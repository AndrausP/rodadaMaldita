const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const vp of [{width:1300,height:860},{width:390,height:844}]){
const c=await b.newContext({viewport:vp});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(800);await p.click('[data-act=solo]');
for(const k of ["circulo","chao","luz","mira","coroa"]){
  await p.evaluate(k=>{H.cfg.count=1;H.plan=[k];H.r=0;H.R=1;nextRound();playPhase()},k);await p.waitForTimeout(1500);
  for(let i=0;i<10;i++){await p.keyboard.down('ArrowRight');await p.waitForTimeout(120);await p.keyboard.up('ArrowRight')}
  const rv=await p.evaluate(()=>U.V.pl[0].rv);console.log(vp.width,k,rv);
  if(vp.width<500&&k==='coroa')await p.screenshot({path:'/tmp/claude-0/mob_coroa.png'});
}
await c.close()}
console.log('errs',errs);await b.close()})();
