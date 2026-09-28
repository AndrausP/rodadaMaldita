const { chromium } = require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const errs=[];const FD='/tmp/claude-0/fonts/';
let css='';for(const w of [500,700,900])css+=`@font-face{font-family:"Grenze Gotisch";font-weight:${w};src:url(https://fonts.gstatic.com/g/${w}.woff2)}`;for(const w of [400,500,600,700,800,900])css+=`@font-face{font-family:"Figtree";font-weight:${w};src:url(https://fonts.gstatic.com/f/${w}.woff2)}`;
const c=await b.newContext({viewport:{width:1400,height:900}});
await c.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:css}));await c.route('https://fonts.gstatic.com/**',r=>{const m=r.request().url().match(/\/(g|f)\/(\d+)/);r.fulfill({contentType:'font/woff2',body:fs.readFileSync(m[1]==='g'?`${FD}fontsource-grenze-gotisch-5.3.0/package/files/grenze-gotisch-latin-${m[2]}-normal.woff2`:`${FD}fontsource-figtree-5.3.0/package/files/figtree-latin-${m[2]}-normal.woff2`)})});
const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(600);await p.click('[data-act=bots][data-v="7"]');await p.click('[data-act=solo]');await p.waitForTimeout(300);
await p.evaluate(()=>{H.plan=["cacada"];H.r=0;H.R=3;nextRound()});await p.waitForTimeout(1200);await p.screenshot({path:'/tmp/claude-0/ds/cac_intro.png'});
await p.evaluate(()=>playPhase());
for(let s=0;s<5;s++){await p.waitForTimeout(3000);console.log(s,await p.evaluate(()=>JSON.stringify(H.world.inf)))}
await p.screenshot({path:'/tmp/claude-0/ds/cac_play.png'});
await p.waitForTimeout(16000);console.log('ph',await p.evaluate(()=>H.ph));
await p.evaluate(()=>{if(H.ph==="play")revealPhase()});await p.waitForTimeout(800);await p.screenshot({path:'/tmp/claude-0/ds/cac_rev.png'});
console.log('errs',errs);await b.close()})();
