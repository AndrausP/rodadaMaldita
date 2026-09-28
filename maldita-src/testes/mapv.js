const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const c=await b.newContext({viewport:{width:1600,height:900}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(600);await p.click('[data-act=bots][data-v="7"]');await p.click('[data-act=solo]');await p.waitForTimeout(400);
await p.evaluate(()=>{U.tv=true});
for(const k of ["coroa","cacada"])for(let v=0;v<3;v++){await p.evaluate(([k,v])=>{const orig=makeRound;H.plan=[k,k];H.r=0;H.R=2;nextRound();H.round.d.seed=v+3*(1+Math.floor(Math.random()*1000));playPhase()},[k,v]);await p.waitForTimeout(2500);
 await p.screenshot({path:`/tmp/claude-0/ds/map_${k}${v}.png`,clip:{x:90,y:180,width:1090,height:700}});await p.evaluate(()=>clearTimers())}
console.log('errs',errs);await b.close()})();
