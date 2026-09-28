const { chromium } = require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const errs=[];const FD='/tmp/claude-0/fonts/';
let css='';for(const w of [500,700,900])css+=`@font-face{font-family:"Grenze Gotisch";font-weight:${w};src:url(https://fonts.gstatic.com/g/${w}.woff2)}`;for(const w of [400,500,600,700,800,900])css+=`@font-face{font-family:"Figtree";font-weight:${w};src:url(https://fonts.gstatic.com/f/${w}.woff2)}`;
for(const vp of [{width:1400,height:900,n:'d'},{width:390,height:844,n:'m'}]){
const c=await b.newContext({viewport:vp});
await c.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:css}));await c.route('https://fonts.gstatic.com/**',r=>{const m=r.request().url().match(/\/(g|f)\/(\d+)/);r.fulfill({contentType:'font/woff2',body:fs.readFileSync(m[1]==='g'?`${FD}fontsource-grenze-gotisch-5.3.0/package/files/grenze-gotisch-latin-${m[2]}-normal.woff2`:`${FD}fontsource-figtree-5.3.0/package/files/figtree-latin-${m[2]}-normal.woff2`)})});
const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(600);await p.click('[data-act=solo]');await p.waitForTimeout(300);
await p.evaluate(()=>{H.plan=["suss","suss"];H.r=0;H.R=2;nextRound();playPhase()});await p.waitForTimeout(1500);await p.screenshot({path:`/tmp/claude-0/ds/sus_${vp.n}_show.png`});
await p.waitForTimeout(3200);await p.screenshot({path:`/tmp/claude-0/ds/sus_${vp.n}_ask.png`});
const q=await p.evaluate(()=>U.V.d.q);
await p.click(`.tomb[data-v="${q[0]}"]`);await p.waitForTimeout(300);await p.click(`.tomb[data-v="${(q[1]+1)%9}"]`);await p.waitForTimeout(300);await p.click(`.tomb[data-v="${q[2]}"]`);
await p.waitForTimeout(400);console.log(vp.n,await p.evaluate(()=>{const me=H.pl.get("me");return me.rv+" rs="+me.rs}));
await p.evaluate(()=>revealPhase());await p.waitForTimeout(800);await p.screenshot({path:`/tmp/claude-0/ds/sus_${vp.n}_rev.png`});
console.log(await p.evaluate(()=>[...H.pl.values()].map(x=>x.n+":"+x.rv+":"+x.rp).join(" | ")));
await c.close()}
console.log('errs',errs);await b.close()})();
