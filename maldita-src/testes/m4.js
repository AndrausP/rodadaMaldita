const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const mk=async(url,opts={})=>{const c=await b.newContext({viewport:{width:1300,height:860},ignoreHTTPSErrors:true,...opts});const p=await c.newPage();p.on('pageerror',e=>errs.push(url.slice(0,12)+' '+e.message+' '+(e.stack||'').split('\n')[1]));await p.goto(url);return p};
const A=await mk('http://localhost:3000/maldita.html');const B=await mk('https://127.0.0.1:3443/maldita.html');
for(const [p,n] of [[A,'Ana'],[B,'Beto']]){await p.waitForSelector('#btnCreate:not([disabled])',{timeout:10000});await p.fill('#nick',n)}
await A.click('[data-act=create]');await A.waitForSelector('.code b');const code=await A.$eval('.code b',e=>e.textContent);
await B.fill('#code',code);await B.click('[data-act=join]');await A.waitForTimeout(2000);await A.click('[data-act=botAdd]');
for(const k of ["reliquia","coroa","chao"]){
  await A.evaluate(k=>{H.cfg.count=1;H.plan=[k];H.r=0;H.R=1;if(H.ph==="lobby"){H.pl.forEach(p=>{p.sc=0})}nextRound();playPhase()},k);await A.waitForTimeout(1200);
  const bid=await B.evaluate(()=>U.myId);
  await A.evaluate(id=>{H.world.ab.own[id]="shock"},bid);await A.waitForTimeout(500);
  const hasAb=await B.evaluate(()=>((U.W||{}).ab||{}).own&&U.W.ab.own[U.myId]);
  for(let i=0;i<6;i++){await B.keyboard.down('ArrowLeft');await B.waitForTimeout(80);await B.keyboard.up('ArrowLeft')}
  await B.keyboard.press('KeyE');await A.waitForTimeout(900);
  const fx=await A.evaluate(id=>({fx:H.world.ab.fx.filter(f=>f.by===id).map(f=>f.t),own:H.world.ab.own[id]||null,others:Object.keys(U.others).length,pk:H.world.ab.pk.length}),bid);
  const gSees=await B.evaluate(()=>({W:!!U.W,others:Object.keys(U.others).length,cam:!!document.querySelector('#arena')}));
  console.log(k,'guest had ability:',hasAb,'host saw use:',JSON.stringify(fx),'guest:',JSON.stringify(gSees));
  await B.screenshot({path:`/tmp/claude-0/mp2_${k}.png`});
  await A.evaluate(()=>{revealPhase()});await A.waitForTimeout(500);
}
console.log('errs',errs);await b.close()})();
