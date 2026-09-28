const { chromium } = require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const errs=[];const FD='/tmp/claude-0/fonts/';
let css='';for(const w of [500,700,900])css+=`@font-face{font-family:"Grenze Gotisch";font-weight:${w};src:url(https://fonts.gstatic.com/g/${w}.woff2)}`;for(const w of [400,500,600,700,800,900])css+=`@font-face{font-family:"Figtree";font-weight:${w};src:url(https://fonts.gstatic.com/f/${w}.woff2)}`;
const c=await b.newContext({viewport:{width:1400,height:900}});
await c.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:css}));await c.route('https://fonts.gstatic.com/**',r=>{const m=r.request().url().match(/\/(g|f)\/(\d+)/);r.fulfill({contentType:'font/woff2',body:fs.readFileSync(m[1]==='g'?`${FD}fontsource-grenze-gotisch-5.3.0/package/files/grenze-gotisch-latin-${m[2]}-normal.woff2`:`${FD}fontsource-figtree-5.3.0/package/files/figtree-latin-${m[2]}-normal.woff2`)})});
const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(600);await p.click('[data-act=bots][data-v="5"]');await p.click('[data-act=solo]');await p.waitForTimeout(300);
await p.evaluate(()=>{H.cfg.count=6;H.cfg.types=Object.fromEntries(TYPE_KEYS.map(k=>[k,["quiz","ref","conta","mira","est","tap"].includes(k)]));startGame()});
for(let i=0;i<6;i++){await p.evaluate(()=>{playPhase()});await p.waitForTimeout(300);
  await p.evaluate(()=>{const R=H.round;if(R.k==="quiz")onAnswer("me",R.ans,"");if(R.k==="conta")onAnswer("me",R.ans,"");if(R.k==="est")onAnswer("me",R.ans,"");if(["mira","tap"].includes(R.k))onAnswer("me",99999,"");if(R.k==="ref"){R.go=true;onAnswer("me",190,"")}revealPhase()});
  await p.waitForTimeout(1600);if(i===3)await p.screenshot({path:'/tmp/claude-0/ds/aw_reveal.png'});
  await p.evaluate(()=>nextRound());await p.waitForTimeout(200)}
await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/claude-0/ds/aw_final.png',fullPage:true});
console.log(await p.evaluate(()=>JSON.stringify(U.V.aw)));
console.log('errs',errs);await b.close()})();
