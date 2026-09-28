const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const c=await b.newContext({viewport:{width:1300,height:860}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(600);await p.click('[data-act=solo]');await p.waitForTimeout(400);
await p.evaluate(()=>{H.cfg.count=4;H.cfg.types=Object.fromEntries(TYPE_KEYS.map(k=>[k,k==="quiz"]));startGame()});
for(let i=0;i<4;i++){await p.waitForTimeout(300);const x=await p.evaluate(()=>U.V.x);if(i===3)await p.screenshot({path:'/tmp/claude-0/ds/moon_intro.png'});
 await p.evaluate(()=>{playPhase();onAnswer("me",H.round.ans,"");revealPhase()});await p.waitForTimeout(300);
 console.log(i,'x',x,'rp',await p.evaluate(()=>H.pl.get("me").rp),'sc',await p.evaluate(()=>H.pl.get("me").sc));await p.evaluate(()=>nextRound())}
console.log('errs',errs);await b.close()})();
