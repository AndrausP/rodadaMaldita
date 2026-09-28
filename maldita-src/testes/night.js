const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const c=await b.newContext({viewport:{width:1300,height:860}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(600);await p.click('[data-act=solo]');await p.waitForTimeout(400);
for(let g=0;g<2;g++){await p.evaluate(g=>{H.cfg.count=1;startGame();let i=0;H.pl.forEach(q=>{q.sc=(g===0&&q.id==="me")?50:10+i++})},g);await p.evaluate(()=>finalPhase());await p.waitForTimeout(300)}
console.log(await p.evaluate(()=>JSON.stringify(U.V.nt)));await p.waitForTimeout(3500);await p.screenshot({path:'/tmp/claude-0/ds/night.png'});
console.log('errs',errs);await b.close()})();
