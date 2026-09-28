const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const mk=async(url,opts={})=>{const c=await b.newContext({viewport:{width:1300,height:860},ignoreHTTPSErrors:true,...opts});const p=await c.newPage();p.on('pageerror',e=>errs.push(url.slice(0,12)+' '+e.message));await p.goto(url);return p};
const A=await mk('http://localhost:3000/maldita.html');const B=await mk('https://127.0.0.1:3443/maldita.html');
for(const [p,n] of [[A,'Ana'],[B,'Beto']]){await p.waitForSelector('#btnCreate:not([disabled])',{timeout:10000});await p.fill('#nick',n)}
await A.click('[data-act=create]');await A.waitForSelector('.code b');const code=await A.$eval('.code b',e=>e.textContent);
await B.fill('#code',code);await B.click('[data-act=join]');await A.waitForTimeout(2000);
const bid=await B.evaluate(()=>U.myId),aid=await A.evaluate(()=>U.myId);
await A.click('[data-act=botAdd]');await A.waitForTimeout(300);await A.evaluate(()=>{H.plan=["cacada"];H.r=0;H.R=1;nextRound();playPhase()});await A.waitForTimeout(800);
// force A infected only, then place A next to B
await A.evaluate(([aid,bid])=>{H.world.inf={};H.world.inf[aid]=-5;for(const id in H.world.b){H.world.b[id].x=1500;H.world.b[id].y=900}},[aid,bid]);await A.waitForTimeout(400);
const bp=await B.evaluate(()=>({x:arenaMeRef.x,y:arenaMeRef.y}));
await A.evaluate(bp=>{arenaMeRef.x=bp.x+10;arenaMeRef.y=bp.y},bp);await A.waitForTimeout(1200);
console.log('host inf',await A.evaluate(()=>JSON.stringify(H.world.inf)));
console.log('guest W.inf',await B.evaluate(()=>JSON.stringify((U.W||{}).inf)),'guest stun',await B.evaluate(()=>arenaMeRef.stun));
await B.keyboard.press('Digit2');await A.waitForTimeout(700);console.log('host sees guest say',await A.evaluate(id=>JSON.stringify(U.says[id]),bid));
await A.waitForTimeout(1000);console.log('ph',await A.evaluate(()=>H.ph));
console.log('errs',errs);await b.close()})();
