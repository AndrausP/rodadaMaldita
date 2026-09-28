const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const c=await b.newContext({viewport:{width:1300,height:860}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
for(const k of ["cacada","pacto","suss"]){await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(600);
 await p.click(`.pv[data-v="${k}"]`);await p.waitForTimeout(700);console.log(k,await p.evaluate(()=>U.V.ph+" "+U.V.k+" R="+U.V.R+" sc="+U.V.pl.map(x=>x.sc).join(",")));
 await p.waitForTimeout(4500);console.log(' ->',await p.evaluate(()=>U.V.ph+" "+U.V.pl.map(x=>x.sc).join(",")));}
await p.hover('.pv[data-v="quiz"]');await p.screenshot({path:'/tmp/claude-0/ds/try_hover.png',clip:{x:100,y:400,width:700,height:300}});
console.log('errs',errs);await b.close()})();
