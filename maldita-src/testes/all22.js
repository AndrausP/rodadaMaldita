const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const vp of [{width:1300,height:860},{width:390,height:844}]){
const c=await b.newContext({viewport:vp});const p=await c.newPage();p.on('pageerror',e=>errs.push(vp.width+' '+e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(700);await p.click('[data-act=solo]');await p.waitForTimeout(300);
const ks=await p.evaluate(()=>TYPE_KEYS);
for(const k of ks){for(const ph of ['intro','play','reveal']){await p.evaluate(([k,ph])=>{H.plan=[k];H.r=0;H.R=3;nextRound();if(ph!=='intro')playPhase();if(ph==='reveal')revealPhase()},[k,ph]);await p.waitForTimeout(ph==='play'?700:200)}
 const ov=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);if(ov)errs.push(vp.width+' overflow-x on '+k)}
await p.evaluate(()=>finalPhase());await p.waitForTimeout(300);
await c.close()}
console.log('errs',errs);await b.close()})();
