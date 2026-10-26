import base64
import copy
import datetime as dt
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("controller", ROOT / ".github/codex/controller.py")
c = importlib.util.module_from_spec(spec)
spec.loader.exec_module(c)
NOW = dt.datetime(2026, 10, 26, 12, tzinfo=c.UTC)


class MemoryStore:
    def __init__(self):
        self.state = c.empty_state()
        self.version = None
        self.writes = 0
        self.fail_on = None
        self.terminal = True

    def load(self):
        return self.version, copy.deepcopy(self.state)

    def save(self, expected, state):
        self.writes += 1
        if self.writes == self.fail_on or self.version != expected:
            raise c.Conflict("Injected persistence conflict")
        self.state = copy.deepcopy(state)
        self.version = str(self.writes)
        return self.version

    def run_terminal(self, run_id):
        return self.terminal


class SchedulerTests(unittest.TestCase):
    def setUp(self):
        self.store = MemoryStore()
        self.now = NOW
        self.calls = []
        self.scheduler = self.make_scheduler("100")

    def make_scheduler(self, run_id):
        def execute(task):
            # The executor must observe a durable claim before it runs.
            self.assertEqual(self.store.state["tasks"]["once"]["status"], "claimed")
            self.calls.append(task)
            return c.Scheduler.simulate(task)
        return c.Scheduler(self.store, run_id, c.timestamp(NOW), lambda: self.now, execute)

    def register(self, fail=False):
        return self.scheduler.register("once", "60", simulate_failure=fail)

    def due(self):
        self.now = NOW + dt.timedelta(hours=1)

    def test_manual_registration_persists_schedule(self):
        state = self.register()
        self.assertEqual(state["tasks"]["once"]["planned_at"], "2026-10-26T13:00:00Z")
        self.assertEqual(self.store.state, state)
        self.assertEqual(self.calls, [])

    def test_before_due_never_executes(self):
        self.register()
        self.now = NOW + dt.timedelta(minutes=59, seconds=59)
        self.scheduler.check()
        self.assertEqual(self.calls, [])
        self.assertEqual(self.store.writes, 1)

    def test_due_once_duplicate_check_and_new_runner(self):
        self.register()
        self.due()
        state, failed = self.scheduler.check()
        self.assertFalse(failed)
        self.assertEqual(state["tasks"]["once"]["status"], "succeeded")
        self.scheduler.check()
        self.make_scheduler("101").check()
        self.assertEqual(len(self.calls), 1)
        task = self.store.state["tasks"]["once"]
        self.assertEqual(task["run_id"], "100")
        self.assertEqual(task["triggered_at"], c.timestamp(NOW))
        self.assertIn("执行完成", c.report(state))

    def test_absolute_timezone(self):
        state = self.scheduler.register("once", run_at="2026-10-26T22:00:00+08:00")
        self.assertEqual(state["tasks"]["once"]["planned_at"], "2026-10-26T14:00:00Z")

    def test_invalid_inputs(self):
        for delay, absolute in [("", ""), ("1", "2026-10-27T00:00:00Z"), ("0", ""),
                                ("1.5", ""), ("-1", ""), ("43201", ""),
                                ("", "2026-10-27T00:00:00"), ("", c.timestamp(NOW))]:
            with self.subTest(delay=delay, absolute=absolute), self.assertRaises(ValueError):
                self.scheduler.register("once", delay, absolute)
        with self.assertRaises(ValueError):
            self.scheduler.register("../unsafe", "60")
        self.assertEqual(self.store.writes, 0)

    def test_duplicate_registration_does_not_rearm(self):
        self.register()
        with self.assertRaises(c.Conflict):
            self.register()
        self.assertEqual(self.store.writes, 1)

    def test_claim_failure_never_executes(self):
        self.register()
        self.due()
        self.store.fail_on = 2
        with self.assertRaises(c.Conflict):
            self.scheduler.check()
        self.assertEqual(self.calls, [])
        self.assertEqual(self.store.state["tasks"]["once"]["status"], "pending")

    def test_competing_claims_only_one_executor(self):
        self.register()
        self.due()
        stale = self.store.load()
        self.scheduler.check()
        original_load = self.store.load
        self.store.load = lambda: copy.deepcopy(stale)
        with self.assertRaises(c.Conflict):
            self.make_scheduler("101").check()
        self.store.load = original_load
        self.assertEqual(len(self.calls), 1)

    def test_simulator_failure_is_terminal_no_retry(self):
        self.register(fail=True)
        self.due()
        state, failed = self.scheduler.check()
        self.assertTrue(failed)
        self.assertIn("Requested simulator failure", state["tasks"]["once"]["error"])
        self.make_scheduler("101").check()
        self.assertEqual(len(self.calls), 1)

    def test_completion_conflict_recovery_does_not_rerun(self):
        self.register()
        self.due()
        self.store.fail_on = 3
        with self.assertRaises(c.Conflict):
            self.scheduler.check()
        self.assertEqual(self.store.state["tasks"]["once"]["status"], "claimed")
        self.scheduler.check()  # Same run ID (including rerun): never reclaim.
        self.assertEqual(len(self.calls), 1)
        state, failed = self.make_scheduler("101").check()
        self.assertTrue(failed)
        self.assertEqual(state["tasks"]["once"]["status"], "failed")
        self.assertEqual(len(self.calls), 1)

    def test_active_old_claim_is_left_untouched(self):
        self.register()
        self.due()
        self.store.fail_on = 3
        with self.assertRaises(c.Conflict):
            self.scheduler.check()
        self.store.terminal = False
        self.make_scheduler("101").check()
        self.assertEqual(self.store.state["tasks"]["once"]["status"], "claimed")
        self.assertEqual(len(self.calls), 1)

    def test_runner_dies_after_claim_before_simulation(self):
        self.register()
        self.due()
        def die(task):
            raise SystemExit("runner terminated")
        self.scheduler.executor = die
        with self.assertRaises(SystemExit):
            self.scheduler.check()
        state, _ = self.make_scheduler("101").check()
        self.assertEqual(state["tasks"]["once"]["status"], "failed")
        self.assertEqual(self.calls, [])


class GitHubStoreTests(unittest.TestCase):
    def test_race_at_ref_update_is_not_retried(self):
        store = c.GitHubStore("jatjun/codex-ext1", "test-placeholder")
        writes = []
        def api(method, path, body=None, missing_ok=False):
            if method == "PATCH":
                writes.append(body)
                raise c.Conflict("Concurrent sibling commit won the ref update")
            if path.startswith("git/ref/"):
                return {"object": {"sha": "old"}}
            if path == "git/commits/old":
                return {"tree": {"sha": "tree"}}
            return {"sha": "new"}
        store.api = api
        with self.assertRaises(c.Conflict):
            store.save("old", c.empty_state())
        self.assertEqual(writes, [{"sha": "new", "force": False}])

    def test_create_is_orphan_and_existing_update_is_nonforce(self):
        store = c.GitHubStore("jatjun/codex-ext1", "test-placeholder")
        calls = []
        def api(method, path, body=None, missing_ok=False):
            calls.append((method, path, body))
            if path.startswith("git/ref/"):
                return None
            return {"sha": "new"}
        store.api = api
        store.save(None, c.empty_state())
        commit = next(body for method, path, body in calls if path == "git/commits")
        self.assertEqual(commit["parents"], [])
        self.assertEqual(calls[-1][2]["ref"], "refs/heads/codex-state")
        calls.clear()
        def update(method, path, body=None, missing_ok=False):
            calls.append((method, path, body))
            if path.startswith("git/ref/"):
                return {"object": {"sha": "old"}}
            if path == "git/commits/old":
                return {"tree": {"sha": "tree"}}
            return {"sha": "new"}
        store.api = update
        store.save("old", c.empty_state())
        self.assertEqual(calls[-1], ("PATCH", "git/refs/heads/codex-state", {"sha": "new", "force": False}))

    def test_ref_conflict_stops_before_creating_commit(self):
        store = c.GitHubStore("jatjun/codex-ext1", "test-placeholder")
        calls = []
        def api(method, path, body=None, missing_ok=False):
            calls.append(method)
            return {"object": {"sha": "changed"}}
        store.api = api
        with self.assertRaises(c.Conflict):
            store.save("old", c.empty_state())
        self.assertEqual(calls, ["GET"])

    def test_unrecognized_state_branch_cannot_be_overwritten(self):
        store = c.GitHubStore("jatjun/codex-ext1", "test-placeholder")
        def api(method, path, body=None, missing_ok=False):
            if path.startswith("git/ref/"):
                return {"object": {"sha": "old"}}
            return {"content": base64.b64encode(b'{"unrelated": true}').decode()}
        store.api = api
        with self.assertRaises(ValueError):
            store.load()

    def test_scope_is_fixed(self):
        with self.assertRaises(ValueError):
            c.GitHubStore("other/repository", "test-placeholder")


class EntrypointTests(unittest.TestCase):
    def test_manual_schedule_and_artifact_path_without_network(self):
        store = MemoryStore()
        store.api = lambda *args: {"created_at": "2026-10-26T12:00:00Z"}
        event = {"repository": {"default_branch": "main"}, "inputs": {
            "operation": "register", "task_id": "phone-demo", "delay_minutes": "60"}}
        with tempfile.TemporaryDirectory() as directory:
            event_path = Path(directory) / "event.json"
            event_path.write_text(json.dumps(event))
            summary = Path(directory) / "summary.md"
            environment = {"GITHUB_EVENT_PATH": str(event_path),
                           "GITHUB_REPOSITORY": "jatjun/codex-ext1",
                           "GITHUB_REF": "refs/heads/main", "GITHUB_RUN_ID": "123",
                           "GITHUB_EVENT_NAME": "workflow_dispatch", "GH_TOKEN": "test-placeholder",
                           "GITHUB_STEP_SUMMARY": str(summary)}
            previous = Path.cwd()
            try:
                os.chdir(directory)
                with patch.dict(os.environ, environment), patch.object(c, "GitHubStore", return_value=store), patch("builtins.print"):
                    self.assertEqual(c.main(), 0)
                    self.assertTrue((Path(directory) / "p0-output/state.json").exists())
                    self.assertIn("phone-demo", summary.read_text())
                    os.environ["GITHUB_EVENT_NAME"] = "schedule"
                    self.assertEqual(c.main(), 0)  # not yet due
                    self.assertEqual(store.state["tasks"]["phone-demo"]["status"], "pending")
                    self.assertEqual(store.writes, 1)
            finally:
                os.chdir(previous)


if __name__ == "__main__":
    unittest.main()
