const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const run=async(vp,label,touch)=>{
const c=await b.newContext({viewport:vp,isMobile:!!touch,hasTouch:!!touch});const p=await c.newPage();p.on('pageerror',e=>errs.push(label+' '+e.message));
await p.goto('http://localhost:3000/gincana.html');await p.waitForTimeout(800);
await p.click('[data-act=solo]');await p.waitForTimeout(300);
await p.evaluate(()=>{H.cfg.types={mira:true,corrida:true,flap:true,meteoro:true};H.cfg.count=4;startGame();H.plan=["mira","corrida","flap","meteoro"];H.round=makeRound("mira");});
for(let r=0;r<4;r++){
  await p.evaluate(()=>{if(H.ph==="intro")playPhase()});
  await p.waitForTimeout(300);
  const k=await p.evaluate(()=>H.round.k);
  const box=await p.$eval('#arena',e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}});
  for(let i=0;i<40;i++){
    if(k==='mira'||k==='meteoro'){await p.mouse.move(box.x+Math.random()*box.w,box.y+Math.random()*box.h);await p.mouse.down();await p.waitForTimeout(60);await p.mouse.up()}
    if(k==='corrida'){await p.keyboard.press(Math.random()<.5?'ArrowLeft':'ArrowRight')}
    if(k==='flap'){await p.keyboard.press('Space')}
    await p.waitForTimeout(100);
    if(i===25)await p.screenshot({path:`/tmp/claude-0/arc_${label}_${k}.png`});
  }
  const sc=await p.evaluate(()=>U.V.pl[0].rv);console.log(label,k,'score',sc);
  await p.evaluate(()=>{revealPhase()});await p.waitForTimeout(400);
  await p.evaluate(()=>{nextRound()});await p.waitForTimeout(200);
}
await c.close()};
await run({width:1400,height:900},'pc');
await run({width:390,height:844},'mob',true);
console.log('errs',errs);await b.close()})();
