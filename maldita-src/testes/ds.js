const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const fs=require('fs');const FD='/tmp/claude-0/fonts/';
let css='';for(const w of [500,700,900])css+=`@font-face{font-family:"Grenze Gotisch";font-weight:${w};src:url(https://fonts.gstatic.com/g/${w}.woff2)}`;for(const w of [400,500,600,700,800,900])css+=`@font-face{font-family:"Figtree";font-weight:${w};src:url(https://fonts.gstatic.com/f/${w}.woff2)}`;
const fontRoute=async ctx=>{await ctx.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:css}));await ctx.route('https://fonts.gstatic.com/**',r=>{const u=r.request().url();const m=u.match(/\/(g|f)\/(\d+)/);const file=m[1]==='g'?`${FD}fontsource-grenze-gotisch-5.3.0/package/files/grenze-gotisch-latin-${m[2]}-normal.woff2`:`${FD}fontsource-figtree-5.3.0/package/files/figtree-latin-${m[2]}-normal.woff2`;r.fulfill({contentType:'font/woff2',body:fs.readFileSync(file)})})};const errs=[];
const S=(p,n)=>p.screenshot({path:`/tmp/claude-0/ds/${n}.png`});
for(const vp of [{width:1400,height:900,n:'d'},{width:390,height:844,n:'m'}]){
const c=await b.newContext({viewport:vp,deviceScaleFactor:1,ignoreHTTPSErrors:true});await fontRoute(c);const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(1500);
await S(p,vp.n+'_lobby');
if(vp.n==='d'){await p.screenshot({path:'/tmp/claude-0/ds/d_lobby_full.png',fullPage:true})}
await p.click('[data-act=bots][data-v="5"]');await p.click('[data-act=solo]');await p.waitForTimeout(700);
await S(p,vp.n+'_room');
const go=async(k,ph,wait=1200)=>{await p.evaluate(([k,ph])=>{H.cfg.count=1;H.plan=[k];H.r=0;H.R=6;nextRound();if(ph!=='intro')playPhase();if(ph==='reveal')revealPhase()},[k,ph]);await p.waitForTimeout(wait)};
await go('coroa','intro',900);await S(p,vp.n+'_intro');
await go('quiz','play');await S(p,vp.n+'_quiz');
await go('quiz','reveal');await S(p,vp.n+'_reveal');
await go('coroa','play',2500);await S(p,vp.n+'_coroa');
if(vp.n==='d'){
 await go('reliquia','play',2500);await S(p,'d_reliquia');
 await go('mira','play',2500);await S(p,'d_mira');
 await go('cabo','play',1200);await S(p,'d_cabo');
 await go('porta','play',1200);await S(p,'d_porta');
 await go('naoolhe','play',2500);await S(p,'d_naoolhe');
 await go('corrida','play',2500);await S(p,'d_corrida');
}
await p.evaluate(()=>{H.pl.forEach((q,i)=>q.sc=40-i*5);finalPhase()});await p.waitForTimeout(900);await S(p,vp.n+'_final');
await c.close()}
console.log('errs',errs);await b.close()})();
