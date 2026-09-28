const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file:///tmp/claude-0/pprev.html');await p.waitForTimeout(700);
await p.screenshot({path:'/tmp/claude-0/plobby.png'});
await p.click('text=Jogar contra bots');
// play many hands quickly: auto act when my turn
for(let k=0;k<160;k++){await p.waitForTimeout(250);
  const has=await p.$('[data-act=call]'); if(has){ const r=Math.random(); if(r<.15) await p.click('[data-act=raise]').catch(()=>p.click('[data-act=call]')); else await p.click('[data-act=call]'); }
  const rb=await p.$('[data-act=rebuy]'); if(rb) await rb.click();
  if(k===40) await p.screenshot({path:'/tmp/claude-0/ptable.png'});
}
await p.screenshot({path:'/tmp/claude-0/ptable2.png'});
const feed=await p.$eval('#feed',e=>e.innerText.slice(-600));
console.log(feed);
// evaluator sanity
const t=await p.evaluate(()=>[best7(["As","Ks","Qs","Js","Ts","2d","3c"]).name,best7(["Ah","2d","3c","4s","5h","9d","Kc"]).name,best7(["Kh","Kd","Ks","7c","7d","2s","3h"]).name,best7(["Ah","Ad","Kc","Kd","2s","3h","9c"]).name,best7(["2h","5h","9h","Jh","Kh","Ad","Ac"]).name]);
console.log(t);
console.log('errs',errs);await b.close()})();
