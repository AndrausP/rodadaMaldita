const { chromium } = require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const errs=[];const FD='/tmp/claude-0/fonts/';
let css='';for(const w of [500,700,900])css+=`@font-face{font-family:"Grenze Gotisch";font-weight:${w};src:url(https://fonts.gstatic.com/g/${w}.woff2)}`;for(const w of [400,500,600,700,800,900])css+=`@font-face{font-family:"Figtree";font-weight:${w};src:url(https://fonts.gstatic.com/f/${w}.woff2)}`;
const mk=async(url,vp)=>{const c=await b.newContext({viewport:vp||{width:1300,height:860},ignoreHTTPSErrors:true});
 await c.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:css}));await c.route('https://fonts.gstatic.com/**',r=>{const m=r.request().url().match(/\/(g|f)\/(\d+)/);r.fulfill({contentType:'font/woff2',body:fs.readFileSync(m[1]==='g'?`${FD}fontsource-grenze-gotisch-5.3.0/package/files/grenze-gotisch-latin-${m[2]}-normal.woff2`:`${FD}fontsource-figtree-5.3.0/package/files/figtree-latin-${m[2]}-normal.woff2`)})});
 const p=await c.newPage();p.on('pageerror',e=>errs.push(url.slice(0,12)+' '+e.message));await p.goto(url);return p};
const A=await mk('http://localhost:3000/maldita.html',{width:1600,height:900});const B=await mk('https://127.0.0.1:3443/maldita.html');
for(const [p,n] of [[A,'Telao'],[B,'Beto']]){await p.waitForSelector('#btnCreate:not([disabled])',{timeout:10000});await p.fill('#nick',n)}
await A.click('[data-act=tv]');await A.click('[data-act=create]');await A.waitForSelector('.code b');const code=await A.$eval('.code b',e=>e.textContent);
await B.fill('#code',code);await B.click('[data-act=join]');await A.waitForTimeout(2000);await A.click('[data-act=botAdd]');await A.click('[data-act=botAdd]');await A.waitForTimeout(500);
await A.screenshot({path:'/tmp/claude-0/ds/tv_lobby.png'});
console.log('players',await A.evaluate(()=>[...H.pl.values()].map(p=>p.n).join(",")));
for(const k of ["quiz","coroa","mira","naoolhe","suss"]){
 await A.evaluate(k=>{H.plan=[k,k];H.r=0;H.R=2;nextRound();playPhase()},k);await A.waitForTimeout(k==="suss"?2000:3000);
 if(k==="coroa"){for(let i=0;i<8;i++){await B.keyboard.down('ArrowLeft');await B.waitForTimeout(100);await B.keyboard.up('ArrowLeft')}}
 await A.screenshot({path:`/tmp/claude-0/ds/tv_${k}.png`});await A.evaluate(()=>clearTimers())}
console.log('errs',errs);await b.close()})();
