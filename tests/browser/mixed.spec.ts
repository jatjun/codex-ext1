import {test,expect} from '@playwright/test';
for(const width of [390,1280])for(const kind of ['yogurt','peaches'])test(`混合运算完整流程 ${kind} ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('./');
 await page.getByRole('button',{name:kind==='yogurt'?/探索 03/:/探索 04/}).click();
 await expect(page.locator('[data-object]')).toHaveCount(kind==='yogurt'?22:40);
 await page.getByRole('button',{name:'下一步 →'}).click();
 await page.getByRole('button',{name:'下一步 →'}).click();
 await expect(page.getByRole('button',{name:'下一步 →'})).toBeDisabled();
 const question=page.locator('.question');
 await question.getByRole('button',{name:kind==='yogurt'?'4＋6':'25＋15÷8',exact:true}).click();
 await expect(page.getByRole('status')).toContainText(kind==='yogurt'?'不是每组':'第一篮');
 await question.getByRole('button',{name:kind==='yogurt'?'6×3':'(25＋15)÷8',exact:true}).click();
 await page.getByRole('button',{name:'下一步 →'}).click();await page.waitForTimeout(1750);
 await expect(page.locator('[data-object]')).toHaveCount(kind==='yogurt'?22:40);
 await page.getByRole('button',{name:'下一步 →'}).click();await page.getByRole('button',{name:'开始独立练习 →'}).click();
 const answers=kind==='yogurt'?['22','23','57','18÷3']:['5','5','(54＋9)÷7','29','67','5','10'];
 for(let i=0;i<answers.length;i++){await question.getByRole('button',{name:answers[i],exact:true}).click();if(i<answers.length-1)await page.getByRole('button',{name:'下一道挑战 →'}).click();}
 await expect(page.getByText(/本次探索完成/)).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`test-results/${kind}-${width}.png`,fullPage:true});
 await page.getByRole('button',{name:'学习足迹 ↗'}).click();await expect(page.getByText(kind==='yogurt'?'order-practice':'flowers-double')).toBeVisible();
});
test('物体移动能暂停继续、调速和重播',async({page})=>{
 await page.goto('./');await page.getByRole('button',{name:/探索 04/}).click();
 await page.getByRole('combobox').selectOption('0.5');await page.getByRole('button',{name:'下一步 →'}).click();
 await page.waitForTimeout(250);await page.getByRole('button',{name:'暂停',exact:true}).click();
 const object=page.locator('[data-object="0"]');const frozen=await object.getAttribute('transform');await page.waitForTimeout(350);expect(await object.getAttribute('transform')).toBe(frozen);
 await page.getByRole('button',{name:'播放',exact:true}).click();await page.waitForTimeout(350);expect(await object.getAttribute('transform')).not.toBe(frozen);
 await page.getByRole('button',{name:'重播',exact:true}).click();await expect(object).toHaveAttribute('transform','translate(35 70)');await expect(page.getByText('步骤 1 / 5')).toBeVisible();
});
for(const width of [390,1280])test(`自选数字练习及保存 ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('./');await page.getByRole('button',{name:/混合运算自选练习/}).click();await page.getByRole('button',{name:'第2题 · 教材第14页',exact:true}).click();
 await page.getByRole('button',{name:'1',exact:true}).click();await page.getByRole('button',{name:'6',exact:true}).click();await page.getByRole('button',{name:'检查答案'}).click();await expect(page.getByRole('status')).toContainText('分别');
 await page.getByRole('button',{name:'退一位'}).click();await page.getByRole('button',{name:'退一位'}).click();await page.getByRole('button',{name:'2',exact:true}).click();await page.getByRole('button',{name:'检查答案'}).click();await expect(page.getByRole('status')).toContainText('答对');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.reload();await page.getByRole('button',{name:'学习足迹 ↗'}).click();await expect(page.getByText('beads',{exact:true})).toBeVisible();await expect(page.getByText(/首答：16/)).toBeVisible();
});
