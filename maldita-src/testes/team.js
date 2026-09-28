const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const mk=async(url)=>{const c=await b.newContext({viewport:{width:1300,height:860},ignoreHTTPSErrors:true});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto(url);return p};
const A=await mk('http://localhost:3000/maldita.html');const B=await mk('https://127.0.0.1:3443/maldita.html');
for(const [p,n] of [[A,'Ana'],[B,'Beto']]){await p.waitForSelector('#btnCreate:not([disabled])',{timeout:10000});await p.fill('#nick',n)}
await A.click('[data-act=create]');await A.waitForSelector('.code b');const code=await A.$eval('.code b',e=>e.textContent);
await B.fill('#code',code);await B.click('[data-act=join]');await A.waitForTimeout(2000);await A.click('[data-act=botAdd]');await A.click('[data-act=botAdd]');
await A.click('[data-act=mode][data-v=times]');await A.waitForTimeout(500);
for(const k of ["coroa","quiz"]){await A.evaluate(k=>{H.plan=[k,k];H.r=0;H.R=2;nextRound();playPhase()},k);await A.waitForTimeout(2500);
 if(k==="coroa")await A.screenshot({path:'/tmp/claude-0/ds/team_coroa.png'});await A.evaluate(()=>revealPhase());await A.waitForTimeout(800);await B.screenshot({path:`/tmp/claude-0/ds/team_rev_${k}.png`});await A.evaluate(()=>clearTimers())}
console.log('errs',errs);await b.close()})();
