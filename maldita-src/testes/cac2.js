const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const c=await b.newContext({viewport:{width:1400,height:900}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(600);await p.click('[data-act=bots][data-v="7"]');await p.click('[data-act=solo]');await p.waitForTimeout(300);
for(let run=0;run<3;run++){
await p.evaluate(()=>{H.plan=["cacada","cacada","cacada","cacada"];H.r=0;H.R=4;nextRound();playPhase()});
// me flees: hold keys randomly
const t0=Date.now();let done=false;
while(Date.now()-t0<46000){const ph=await p.evaluate(()=>H.ph);if(ph!=="play")break;
  const k=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'][Math.floor(Math.random()*4)];await p.keyboard.down(k);await p.waitForTimeout(700);await p.keyboard.up(k)}
const r=await p.evaluate(()=>({t:H.world?H.world.t:null,inf:H.world?Object.keys(H.world.inf).length:null,ph:H.ph,rv:[...H.pl.values()].map(q=>q.n+":"+q.rv+":"+q.rp).join(" | ")}));console.log(run,JSON.stringify(r));
await p.evaluate(()=>{clearTimers()});}
console.log('errs',errs);await b.close()})();
