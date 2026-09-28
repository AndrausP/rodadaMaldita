const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const c=await b.newContext({viewport:{width:390,height:844}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(600);await p.click('[data-act=solo]');await p.waitForTimeout(400);
await p.evaluate(()=>{H.pl.forEach((q,i)=>{q.h=[{k:"quiz",rp:10-i,rank:i}];q.sc=30-i*4});finalPhase()});await p.waitForTimeout(500);
console.log(await p.evaluate(()=>[...H.pl.values()].map(q=>q.sc).join(",")+" | V:"+U.V.pl.map(q=>q.sc).join(",")+" ph "+U.V.ph));
console.log('errs',errs);await b.close()})();
