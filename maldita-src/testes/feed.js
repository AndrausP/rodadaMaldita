const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const c=await b.newContext({viewport:{width:1300,height:860}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(600);await p.click('[data-act=bots][data-v="5"]');await p.click('[data-act=solo]');await p.waitForTimeout(400);
for(const k of ["coroa","cacada","reliquia"]){await p.evaluate(k=>{H.plan=[k,k];H.r=0;H.R=2;nextRound();playPhase()},k);await p.waitForTimeout(9000);
 console.log(k,await p.evaluate(()=>JSON.stringify((U.W||{}).ev)));await p.screenshot({path:`/tmp/claude-0/ds/feed_${k}.png`});await p.evaluate(()=>clearTimers())}
console.log('errs',errs);await b.close()})();
