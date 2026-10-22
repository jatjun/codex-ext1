import { describe, it, expect } from 'vitest';
// JS modules deliberately run unchanged in CI and local Node.
// @ts-expect-error deployment guard is a standalone Node module
import { allowedPath, inspectText, inspectBuild, prepareBuild, verifyBuild } from '../scripts/check-public-build.mjs';
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

async function fixture(run: (dir:string)=>Promise<void>) {
  const dir=await mkdtemp(join(tmpdir(),'math-public-test-'));
  try {
    await mkdir(join(dir,'assets'));
    await writeFile(join(dir,'index.html'),'<html lang="zh-CN"><script src="/codex-ext1/assets/index-123.js"></script><link href="/codex-ext1/assets/index-123.css"></html>');
    await writeFile(join(dir,'assets/index-123.js'),'console.log("数学")');
    await writeFile(join(dir,'assets/index-123.css'),'body{color:green}');
    await run(dir);
  } finally { await rm(dir,{recursive:true,force:true}); }
}
describe('公开产物发布门槛',()=>{
  it('只允许入口、辅助元数据、编译后的JS/CSS',()=>{
    for(const p of ['src/main.tsx','tests/data.json','docs/private.md','.env','assets/textbook.png','assets/app.js.map','records.json','CNAME','.git/config']) expect(allowedPath(p)).toBe(false);
    expect(allowedPath('assets/index-123.js')).toBe(true);
  });
  it('阻止密钥、记录、邮箱、source map、外传接口',()=>{
    const samples=['-----BEGIN PRIVATE KEY-----','ghp_'+'a'.repeat(36),'github_pat_'+'b'.repeat(50),'sourceMappingURL=x.map','"firstAnswer":"孩子的答案"','child@example.com','fetch("/upload")','navigator.sendBeacon("/upload")'];
    for(const sample of samples) expect(()=>inspectText('assets/index-123.js',sample)).toThrow();
    expect(()=>inspectText('assets/index-123.js','const firstAnswer=null;localStorage.getItem("math")')).not.toThrow();
  });
  it('有效构建生成可追踪SHA与文件哈希',async()=>fixture(async dir=>{
    await prepareBuild(dir,'a'.repeat(40));
    const files=await inspectBuild(dir,{metadata:true});
    expect(files['deployment.json']).toMatch(/^[a-f0-9]{64}$/);
  }));
  it('上传前拒绝错误源SHA或被修改的产物',async()=>fixture(async dir=>{
    await prepareBuild(dir,'a'.repeat(40));
    await expect(verifyBuild(dir,'a'.repeat(40))).resolves.toHaveProperty('deployment.json');
    await expect(verifyBuild(dir,'b'.repeat(40))).rejects.toThrow('provenance');
    await writeFile(join(dir,'assets/index-123.js'),'console.log("changed")');
    await expect(verifyBuild(dir,'a'.repeat(40))).rejects.toThrow('hash mismatch');
  }));
  it('教材图片即使放到public后进入dist也拒绝发布',async()=>fixture(async dir=>{
    await writeFile(join(dir,'assets/page-123.png'),'not a real image');
    await expect(inspectBuild(dir)).rejects.toThrow('File rejected');
  }));
  it('根路径资源和软链接被拒绝',async()=>fixture(async dir=>{
    await writeFile(join(dir,'index.html'),'<html lang="zh-CN"><script src="/assets/index-123.js"></script><link href="/codex-ext1/assets/index-123.css"></html>');
    await expect(inspectBuild(dir)).rejects.toThrow('Invalid subpath');
    await symlink(join(dir,'index.html'),join(dir,'assets/link-123.js'));
    await expect(inspectBuild(dir)).rejects.toThrow('Symlink rejected');
  }));
});
