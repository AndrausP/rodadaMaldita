const { chromium } = require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const errs=[];
const c=await b.newContext({viewport:{width:1300,height:860}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(600);await p.click('[data-act=solo]');await p.waitForTimeout(300);
for(const k of ["flap","meteoro","luz","chao","circulo","altar","tap","ref","seq","vitral","biblio","anag"]){
 await p.evaluate(k=>{H.plan=[k,k];H.r=0;H.R=2;nextRound();playPhase()},k);await p.waitForTimeout(k==="ref"?5200:2600);
 if(k==="flap"){for(let i=0;i<5;i++){await p.keyboard.press('Space');await p.waitForTimeout(250)}}
 if(k==="meteoro"){await p.keyboard.down('Space');await p.waitForTimeout(800);await p.keyboard.up('Space')}
 await p.screenshot({path:`/tmp/claude-0/ds/g_${k}.png`});await p.evaluate(()=>clearTimers())}
console.log('errs',errs);await b.close()})();
