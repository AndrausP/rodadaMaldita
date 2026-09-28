const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const c=await b.newContext({viewport:{width:1300,height:860}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.evaluate(()=>{localStorage.clear()});await p.reload();await p.waitForTimeout(700);
const seen=new Set();for(let i=0;i<12;i++){await p.click('[data-act=avp][data-k=f][data-v="1"]');seen.add(await p.evaluate(()=>avParse(U.av).f))}
console.log('faces reachable at lv0',[...seen].sort().join(","));console.log(await p.$eval('.av-lock',e=>e.textContent));
await p.evaluate(()=>{localStorage.setItem('rodada-maldita:rec',JSON.stringify({t:{},rit:0,win:0,best:0,souls:400}))});await p.reload();await p.waitForTimeout(600);
const s2=new Set();for(let i=0;i<12;i++){await p.click('[data-act=avp][data-k=f][data-v="1"]');s2.add(await p.evaluate(()=>avParse(U.av).f))}console.log('lv',await p.evaluate(()=>myLv()),'faces',[...s2].sort().join(","));
console.log('errs',errs);await b.close()})();
