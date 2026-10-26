import {test,expect,type Page} from '@playwright/test';
test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.setItem('forest-quality','low'));});
async function position(page:Page){return page.locator('.forest-game canvas').evaluate(el=>({x:Number((el as HTMLElement).dataset.x),z:Number((el as HTMLElement).dataset.z)}));}
async function walk(page:Page,x:number,z:number){
 // Dispatch the same input events at animation-frame boundaries, avoiding
 // remote browser command latency causing overshoot. Never mutate game state.
 await page.evaluate(({x,z})=>new Promise<void>((resolve,reject)=>{
  const canvas=document.querySelector('.forest-game canvas') as HTMLElement;
  const held=new Set<string>(),until=performance.now()+30000;
  const release=()=>{for(const key of held)window.dispatchEvent(new KeyboardEvent('keyup',{key}));held.clear();};
  function steer(){const dx=x-Number(canvas.dataset.x),dz=z-Number(canvas.dataset.z);
   if(Math.hypot(dx,dz)<.65||document.querySelector('.win-overlay')){release();resolve();return;}
   if(performance.now()>until){release();reject(new Error(`Movement blocked at ${canvas.dataset.x},${canvas.dataset.z}, target ${x},${z}`));return;}
   const next=new Set<string>();if(Math.abs(dx)>.35)next.add(dx>0?'d':'a');if(Math.abs(dz)>.35)next.add(dz>0?'s':'w');
   for(const key of held)if(!next.has(key)){window.dispatchEvent(new KeyboardEvent('keyup',{key}));held.delete(key);}
   for(const key of next)if(!held.has(key)){window.dispatchEvent(new KeyboardEvent('keydown',{key}));held.add(key);}
   requestAnimationFrame(steer);
  }steer();
 }),{x,z});
}
async function pick(page:Page,x:number,z:number,jump=false){await walk(page,x,z);if(jump){await page.keyboard.press('Space');await page.waitForTimeout(500);}}
async function unload(page:Page,x:number,z:number){await walk(page,x,z);await expect(page.locator('.deposit-button')).toBeEnabled();for(let i=0;i<4;i++)await page.keyboard.press('e');}
test('森林方向键事件完整通关：收集12颗修桥、3加2唤醒花门',async({page})=>{
 test.setTimeout(240000);await page.setViewportSize({width:960,height:720});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('./#forest');await page.getByRole('button',{name:'开始冒险'}).click();await page.waitForTimeout(700);
 await pick(page,-2,24);await pick(page,-8,20,true);await pick(page,-12,18);await pick(page,-14,14);await walk(page,-8,12);await unload(page,-7,3);
 await pick(page,-10,5);await pick(page,-16,8);await walk(page,-16,12);await pick(page,-4,14);await pick(page,5,21);await unload(page,0,4);
 await pick(page,13,5);await pick(page,16,15);await pick(page,14,24);await walk(page,6,24);await pick(page,6,12,true);await unload(page,7,3);
 await expect(page.getByRole('heading',{name:'唤醒花门'})).toBeVisible();await walk(page,0,2);await walk(page,0,-10);
 await pick(page,-8,-13);await pick(page,-12,-22);await pick(page,-5,-29);await walk(page,0,-22);await unload(page,0,-23);
 await pick(page,7,-15);await walk(page,16,-17);await walk(page,18,-25);await pick(page,12,-25);await unload(page,0,-23);await walk(page,0,-25);
 await expect(page.getByRole('heading',{name:'你把光带回来了！'})).toBeVisible();expect(errors).toEqual([]);await page.screenshot({path:'test-results/forest-win.png'});
 await page.getByRole('button',{name:'再探险一次'}).click();await expect(page.getByRole('button',{name:'开始冒险'})).toBeVisible();
});
test('森林移动暂停、触屏摇杆、音效开关与手机布局',async({page})=>{
 test.setTimeout(60000);await page.setViewportSize({width:390,height:844});await page.goto('./#forest');await expect(page.getByRole('heading',{name:/小狐狸的/})).toBeVisible();await page.screenshot({path:'test-results/forest-mobile-title.png'});
 await page.getByRole('button',{name:'开始冒险'}).click();await page.waitForTimeout(500);await page.getByRole('button',{name:'开启音效'}).click();await expect(page.getByRole('button',{name:'关闭音效'})).toBeVisible();await page.getByRole('button',{name:'关闭音效'}).click();
 const before=await position(page);const joy=page.getByRole('group',{name:'触屏移动摇杆'});const bounds=await joy.boundingBox();if(!bounds)throw new Error('Missing joystick');await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);await page.mouse.down();await page.mouse.move(bounds.x+bounds.width-5,bounds.y+bounds.height/2);await page.waitForTimeout(600);await page.mouse.up();expect((await position(page)).x).toBeGreaterThan(before.x);
 await page.getByRole('button',{name:'跳跃',exact:false}).click();await expect.poll(()=>page.locator('.forest-game canvas').getAttribute('data-jump')).not.toBe('0.00');
 await page.getByRole('button',{name:'暂停游戏'}).click();const paused=await position(page);await page.keyboard.down('w');await page.waitForTimeout(300);await page.keyboard.up('w');expect(await position(page)).toEqual(paused);await page.getByRole('button',{name:'继续冒险'}).click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'test-results/forest-mobile-play.png'});
});
for(const subject of ['chinese','english'])test(`3D语言关卡收集选词与错误重试 ${subject}`,async({page})=>{test.setTimeout(90000);await page.setViewportSize({width:960,height:720});await page.goto(`./#forest-${subject}`);await page.getByRole('button',{name:'开始冒险'}).click();await pick(page,-2,24);const word=subject==='chinese'?'梨子':'pear';await expect(page.getByRole('button',{name:word,exact:true})).toBeVisible();await page.getByRole('button',{name:word,exact:true}).click();await walk(page,-7,3);await page.keyboard.press('e');await expect(page.getByRole('status')).toContainText('不属于');await expect(page.getByRole('button',{name:word,exact:true})).toBeVisible();await walk(page,0,4);await page.keyboard.press('e');await expect(page.getByRole('button',{name:word,exact:true})).toHaveCount(0);});

test('画质和文字开关不重置进度，关卡可选择',async({page})=>{
 test.setTimeout(60000);await page.goto('./#forest-english?level=1');await expect(page.getByRole('heading',{name:/Rainbow Garden/})).toBeVisible();await page.getByRole('button',{name:'开始冒险'}).click();await pick(page,-2,24);await expect(page.getByRole('button',{name:'yellow duck',exact:true})).toBeVisible();
 await page.getByLabel('画质',{exact:true}).selectOption('high');await expect(page.locator('canvas')).toHaveAttribute('data-quality','high');await page.screenshot({path:'test-results/forest-high.png'});await expect(page.getByRole('button',{name:'yellow duck',exact:true})).toBeVisible();await page.getByLabel('画质',{exact:true}).selectOption('low');
 await page.getByRole('button',{name:'水晶文字提示'}).click();await expect(page.getByRole('button',{name:'水晶文字提示'})).toHaveAttribute('aria-pressed','false');await page.getByRole('button',{name:'水晶文字提示'}).click();
 await page.getByRole('button',{name:'放回选中的水晶'}).click();await expect(page.getByRole('button',{name:'yellow duck',exact:true})).toHaveCount(0);await walk(page,0,21);await pick(page,-2,24);await expect(page.getByRole('button',{name:'yellow duck',exact:true})).toBeVisible();
});
test('英语过桥后仍须按句子选词投递，完成后进入下一关',async({page})=>{
 test.setTimeout(300000);await page.setViewportSize({width:1100,height:800});await page.goto('./#forest-english');await page.getByRole('button',{name:'开始冒险'}).click();
 await pick(page,-12,18);await pick(page,-14,14);await walk(page,-16,12);await pick(page,-16,8);await pick(page,-10,5);await unload(page,-7,3);
 await pick(page,-4,14);await pick(page,-8,20,true);await walk(page,-2,20);await pick(page,-2,24);await pick(page,5,21);await unload(page,0,4);
 await pick(page,13,5);await pick(page,16,15);await walk(page,18,22);await pick(page,14,24);await walk(page,6,24);await pick(page,6,12,true);await unload(page,7,3);
 await walk(page,0,2);await walk(page,0,-10);await pick(page,-8,-13);await pick(page,-12,-22);await pick(page,7,-15);await walk(page,0,-23);
 await page.getByRole('button',{name:'see',exact:true}).click();await page.keyboard.press('e');await expect(page.getByRole('status')).toContainText('下一块需要“I”');
 for(const word of ['I','can','see']){await page.getByRole('button',{name:word,exact:true}).click();await page.keyboard.press('e');}
 await walk(page,16,-17);await walk(page,18,-25);await pick(page,12,-25);await walk(page,0,-25);await pick(page,-5,-29);await walk(page,0,-23);
 for(const word of ['a','fox']){await page.getByRole('button',{name:word,exact:true}).click();await page.keyboard.press('e');}
 await expect(page.getByLabel('花门文字顺序')).toContainText('fox');await walk(page,0,-25);await expect(page.locator('.win-overlay')).toBeVisible();await page.getByRole('button',{name:/下一关/}).click();await expect(page.getByRole('heading',{name:/Rainbow Garden/})).toBeVisible();
});
