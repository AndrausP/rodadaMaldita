const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const mk=async(url,opts={})=>{const c=await b.newContext({viewport:{width:1300,height:860},ignoreHTTPSErrors:true,...opts});const p=await c.newPage();p.on('pageerror',e=>errs.push(url.slice(0,12)+' '+e.message+' '+(e.stack||'').split('\n')[1]));await p.goto(url);return p};
const A=await mk('http://localhost:3000/maldita.html');
const B=await mk('https://127.0.0.1:3443/maldita.html');
const C=await mk('https://127.0.0.1:3443/maldita.html',{viewport:{width:390,height:844},isMobile:true,hasTouch:true});
for(const [p,n] of [[A,'Ana'],[B,'Beto'],[C,'Carla']]){await p.waitForSelector('#btnCreate:not([disabled])',{timeout:10000});await p.fill('#nick',n)}
await A.click('[data-act=create]');await A.waitForSelector('.code b');const code=await A.$eval('.code b',e=>e.textContent);
for(const p of [B,C]){await p.fill('#code',code);await p.click('[data-act=join]')}
await A.waitForTimeout(2000);await A.click('[data-act=botAdd]');await A.waitForTimeout(300);
const plan=["coroa","reliquia","naoolhe","altar","cabo","porta","luz","chao"];
await A.evaluate(t=>{H.cfg.count=t.length;startGame();H.plan=t.slice();H.plan[0]=H.round.k},plan);
const first=await A.evaluate(()=>H.round.k);console.log('first',first);
for(let r=0;r<plan.length;r++){
  await A.evaluate(()=>{if(H.ph==="intro")playPhase()});await A.waitForTimeout(800);
  const k=await A.evaluate(()=>H.round.k);
  const t0=Date.now();let i=0;
  while(Date.now()-t0<7000){i++;
    for(const [P,dir] of [[A,'ArrowRight'],[B,'ArrowLeft'],[C,'ArrowDown']]){
      if(k==='cabo'){const combo=await P.$$eval('#combo i:not(.done)',e=>e.map(x=>x.textContent)).catch(()=>[]);const m={'←':'ArrowLeft','↑':'ArrowUp','↓':'ArrowDown','→':'ArrowRight'};if(combo[0])await P.keyboard.press(m[combo[0]])}
      else if(k==='porta'){if(i===1){await P.click('.door >> nth=0').catch(()=>{})}}
      else {await P.keyboard.down(i%6<3?dir:'ArrowUp');await P.waitForTimeout(40);await P.keyboard.up(i%6<3?dir:'ArrowUp');if(i%5===0)await P.keyboard.press('Space')}
    }
    await A.waitForTimeout(60);
  }
  const info=await A.evaluate(()=>({k:H.round.k,others:Object.keys(U.others).length,w:H.world?JSON.stringify(((ARENA_HOST[H.round.k]||ARENA_HOST.generic).pub(H.world))).slice(0,220):null,pl:[...H.pl.values()].map(p=>p.n+':'+p.rv+'/'+p.rs).join(' ')}));
  const gW=await B.evaluate(()=>({W:!!U.W,others:Object.keys(U.others).length,ph:U.V&&U.V.ph}));
  console.log(JSON.stringify(info),'guest:',JSON.stringify(gW));
  if(['coroa','reliquia','naoolhe','altar'].includes(k)){await B.screenshot({path:`/tmp/claude-0/mp_${k}_B.png`});await C.screenshot({path:`/tmp/claude-0/mp_${k}_C.png`})}
  await A.evaluate(()=>revealPhase());await A.waitForTimeout(700);
  console.log('  reveal',await B.evaluate(()=>U.V.pl.map(p=>p.n+'='+p.rv+' '+p.rp).join(' | ')));
  await A.evaluate(()=>nextRound());await A.waitForTimeout(300);
}
console.log('errs',errs.slice(0,10));await b.close()})();
