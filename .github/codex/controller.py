"""P0-01: standard-library-only scheduler. No AI, subprocesses or task scripts."""
import base64
import copy
import datetime as dt
import json
import os
from pathlib import Path
import re
import urllib.error
import urllib.request

UTC = dt.timezone.utc
BRANCH = "codex-state"
STATE_FILE = "p0-01/state.json"


class Conflict(RuntimeError):
    pass


def timestamp(value):
    return value.astimezone(UTC).isoformat().replace("+00:00", "Z")


def parse_time(value):
    result = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    if result.tzinfo is None or result.utcoffset() is None:
        raise ValueError("run_at requires an explicit timezone")
    return result.astimezone(UTC)


def empty_state():
    return {"schema_version": 1, "tasks": {}}


def validate(state):
    if state.get("schema_version") != 1 or not isinstance(state.get("tasks"), dict):
        raise ValueError("Unsupported or corrupt state; refusing to overwrite")
    for key, task in state["tasks"].items():
        if not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", key):
            raise ValueError("Invalid persisted task ID")
        if task.get("status") not in {"pending", "claimed", "succeeded", "failed"}:
            raise ValueError("Invalid persisted task status")
        parse_time(task["planned_at"])


def report(state):
    lines = ["# P0-01 执行记录", "", "仅固定模拟任务；无 AI/API Key、部署、合并或强推。", "",
             "定时检查可能延迟；不保证准时或精确到秒。", ""]
    for key, task in sorted(state["tasks"].items()):
        lines += [f"## {key}", "", f"- 状态：{task['status']}",
                  f"- 计划时间 UTC：{task['planned_at']}",
                  f"- 注册时间 UTC：{task['registered_at']}"]
        for field in ("triggered_at", "claimed_at", "finished_at", "run_id", "error", "result"):
            if field in task:
                lines.append(f"- {field}：{task[field]}")
        if "run_url" in task:
            lines.append(f"- [查看 Actions 运行]({task['run_url']})")
        lines.append("")
    return "\n".join(lines)


class GitHubStore:
    """Append commits to a dedicated branch; never force an existing ref.

    Concurrent writers create sibling commits. Only one can fast-forward the ref.
    An ambiguous network failure is surfaced, never retried as a new execution.
    """
    def __init__(self, repository, token):
        if repository != "jatjun/codex-ext1":
            raise ValueError("Repository is outside the authorized scope")
        self.repository = repository
        self.token = token

    def api(self, method, path, body=None, missing_ok=False):
        url = f"https://api.github.com/repos/{self.repository}/{path}"
        payload = None if body is None else json.dumps(body).encode()
        request = urllib.request.Request(url, data=payload, method=method, headers={
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
        })
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            if missing_ok and error.code == 404:
                return None
            # Do not log response bodies, headers or credentials.
            if error.code in (409, 422):
                raise Conflict(f"GitHub state conflict ({error.code}); no retry") from None
            raise RuntimeError(f"GitHub request failed: {method} {path} HTTP {error.code}") from None

    def load(self):
        ref = self.api("GET", f"git/ref/heads/{BRANCH}", missing_ok=True)
        if ref is None:
            return None, empty_state()
        sha = ref["object"]["sha"]
        data = self.api("GET", f"contents/{STATE_FILE}?ref={sha}")
        state = json.loads(base64.b64decode(data["content"]))
        validate(state)
        return sha, state

    def save(self, expected, state):
        validate(state)
        current = self.api("GET", f"git/ref/heads/{BRANCH}", missing_ok=True)
        actual = None if current is None else current["object"]["sha"]
        if actual != expected:
            raise Conflict("State changed before persistence; no execution")
        # Never initialize over an unrelated existing state branch.
        files = {STATE_FILE: json.dumps(state, ensure_ascii=False, indent=2) + "\n",
                 "README.md": report(state)}
        tree_body = {"tree": [{"path": path, "mode": "100644", "type": "blob", "content": content}
                              for path, content in files.items()]}
        if expected:
            parent = self.api("GET", f"git/commits/{expected}")
            tree_body["base_tree"] = parent["tree"]["sha"]
        tree = self.api("POST", "git/trees", tree_body)
        commit = self.api("POST", "git/commits", {
            "message": "P0-01: persist simulator state", "tree": tree["sha"],
            "parents": [expected] if expected else [],
        })
        if expected:
            self.api("PATCH", f"git/refs/heads/{BRANCH}", {"sha": commit["sha"], "force": False})
        else:
            self.api("POST", "git/refs", {"ref": f"refs/heads/{BRANCH}", "sha": commit["sha"]})
        return commit["sha"]

    def run_terminal(self, run_id):
        run = self.api("GET", f"actions/runs/{int(run_id)}")
        return run["status"] == "completed"


class Scheduler:
    def __init__(self, store, run_id, triggered_at, clock=None, executor=None):
        self.store = store
        self.run_id = str(run_id)
        self.triggered_at = triggered_at
        self.clock = clock or (lambda: dt.datetime.now(UTC))
        self.executor = executor or self.simulate

    @staticmethod
    def simulate(task):
        if task["simulate_failure"]:
            raise RuntimeError("Requested simulator failure")
        return "固定模拟任务执行完成；未调用 AI，未执行用户代码。"

    def register(self, task_id, delay_minutes="", run_at="", simulate_failure=False):
        if not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", task_id):
            raise ValueError("task_id must contain 1-64 letters, numbers, underscores or hyphens")
        if bool(delay_minutes) == bool(run_at):
            raise ValueError("Specify exactly one of delay_minutes and run_at")
        now = self.clock()
        if delay_minutes:
            if not re.fullmatch(r"[0-9]{1,6}", delay_minutes) or not 1 <= int(delay_minutes) <= 43200:
                raise ValueError("delay_minutes must be an integer between 1 and 43200")
            planned = now + dt.timedelta(minutes=int(delay_minutes))
        else:
            planned = parse_time(run_at)
            if planned <= now or planned > now + dt.timedelta(days=30):
                raise ValueError("run_at must be in the future and within 30 days")
        if not isinstance(simulate_failure, bool):
            raise ValueError("simulate_failure must be boolean")
        sha, state = self.store.load()
        if task_id in state["tasks"]:
            raise Conflict("Task ID already exists; registration does not overwrite or rearm")
        state["tasks"][task_id] = {
            "status": "pending", "registered_at": timestamp(now), "planned_at": timestamp(planned),
            "registration_run_id": self.run_id, "simulate_failure": simulate_failure,
            "schedule_input": {"delay_minutes": delay_minutes, "run_at": run_at},
        }
        self.store.save(sha, state)
        return state

    def check(self):
        sha, state = self.store.load()
        failed = False
        for key in sorted(state["tasks"]):
            task = state["tasks"][key]
            if task["status"] == "claimed":
                # Never reclaim or execute an interrupted task, including a rerun
                # with the same run ID. Recovery only records terminal failure.
                if task["run_id"] != self.run_id and self.store.run_terminal(task["run_id"]):
                    task.update(status="failed", finished_at=timestamp(self.clock()),
                                error="Previous run ended without durable completion; not retried",
                                recovery_run_id=self.run_id)
                    sha = self.store.save(sha, state)
                    failed = True
                continue
            if task["status"] != "pending" or parse_time(task["planned_at"]) > self.clock():
                continue
            task.update(status="claimed", run_id=self.run_id, triggered_at=self.triggered_at,
                        claimed_at=timestamp(self.clock()),
                        run_url=f"https://github.com/jatjun/codex-ext1/actions/runs/{self.run_id}")
            sha = self.store.save(sha, state)  # MUST succeed before simulate().
            try:
                task["result"] = self.executor(copy.deepcopy(task))
                task["status"] = "succeeded"
            except Exception as error:
                task.update(status="failed", error=f"{type(error).__name__}: {error}")
                failed = True
            task["finished_at"] = timestamp(self.clock())
            sha = self.store.save(sha, state)  # failure leaves durable claim, no retry
        return state, failed


def main():
    output = Path("p0-output")
    output.mkdir(exist_ok=True)
    exit_code = 1
    text = ""
    try:
        event = json.loads(Path(os.environ["GITHUB_EVENT_PATH"]).read_text())
        repo = os.environ["GITHUB_REPOSITORY"]
        if os.environ["GITHUB_REF"] != "refs/heads/" + event["repository"]["default_branch"]:
            raise ValueError("Only the default branch may register/check tasks")
        store = GitHubStore(repo, os.environ["GH_TOKEN"])
        run_id = os.environ["GITHUB_RUN_ID"]
        # GitHub's run creation time is the observable trigger time, not cron's
        # intended wall-clock time and not the later runner start time.
        run = store.api("GET", f"actions/runs/{int(run_id)}")
        scheduler = Scheduler(store, run_id, run["created_at"])
        inputs = event.get("inputs", {})
        event_name = os.environ["GITHUB_EVENT_NAME"]
        operation = "check" if event_name == "schedule" else inputs.get("operation")
        if event_name not in {"schedule", "workflow_dispatch"}:
            raise ValueError("Unsupported event")
        if operation == "register":
            failure = inputs.get("simulate_failure", "false")
            if failure not in ("true", "false", True, False):
                raise ValueError("Invalid simulate_failure input")
            state = scheduler.register(inputs.get("task_id", ""), inputs.get("delay_minutes", ""),
                                       inputs.get("run_at", ""), failure in ("true", True))
            exit_code = 0
        elif operation == "check":
            state, failed = scheduler.check()
            exit_code = int(failed)
        else:
            raise ValueError("Unsupported operation")
        (output / "state.json").write_text(json.dumps(state, ensure_ascii=False, indent=2))
        text = report(state)
    except Exception as error:
        text = f"# P0-01 BLOCKED / FAILED\n\n{type(error).__name__}: {error}\n\nNo automatic task retry.\n"
    finally:
        (output / "result.md").write_text(text)
        if os.environ.get("GITHUB_STEP_SUMMARY"):
            with open(os.environ["GITHUB_STEP_SUMMARY"], "a") as summary:
                summary.write(text)
        print(text)
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
