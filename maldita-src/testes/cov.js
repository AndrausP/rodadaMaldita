const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const vp of [{width:1300,height:860,n:'d'},{width:390,height:844,n:'m'}]){const c=await b.newContext({viewport:vp});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(600);await p.click('.pv[data-v="covas"]');await p.waitForTimeout(5500);
for(let i=0;i<30;i++){await p.keyboard.press('Digit'+(1+Math.floor(Math.random()*9)));await p.waitForTimeout(120)}
const box=await p.locator('#arena').boundingBox();for(let i=0;i<10;i++){await p.mouse.click(box.x+box.width*(.2+Math.random()*.6),box.y+box.height*(.3+Math.random()*.6));await p.waitForTimeout(150)}
await p.screenshot({path:`/tmp/claude-0/ds/cov_${vp.n}.png`});console.log(vp.n,'score',await p.evaluate(()=>U.arcScore));await c.close()}
console.log('errs',errs);await b.close()})();
