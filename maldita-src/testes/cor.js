const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const c=await b.newContext({viewport:{width:1300,height:860}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(600);await p.click('[data-act=solo]');await p.waitForTimeout(300);
await p.evaluate(()=>{H.plan=["corrida","corrida"];H.r=0;H.R=2;nextRound();playPhase()});await p.waitForTimeout(6000);
await p.screenshot({path:'/tmp/claude-0/ds/cor.png'});console.log('errs',errs);await b.close()})();
