const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const mk=async(url)=>{const c=await b.newContext({viewport:{width:1300,height:860},ignoreHTTPSErrors:true});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto(url);return p};
const A=await mk('http://localhost:3000/maldita.html');const B=await mk('https://127.0.0.1:3443/maldita.html');
for(const [p,n] of [[A,'Ana'],[B,'Beto']]){await p.waitForSelector('#btnCreate:not([disabled])',{timeout:10000});await p.fill('#nick',n)}
await A.click('[data-act=create]');await A.waitForSelector('.code b');const code=await A.$eval('.code b',e=>e.textContent);
await B.fill('#code',code);await B.click('[data-act=join]');await A.waitForTimeout(2000);
await A.evaluate(()=>{H.cfg.count=4;startGame();const b=[...H.pl.values()].find(p=>p.n==="Beto");b.sc=33;commit()});await A.waitForTimeout(800);
await B.reload();await B.waitForSelector('.rejoin',{timeout:10000});await B.waitForTimeout(1500);await B.click('.rejoin');await A.waitForTimeout(10000);
console.log(await A.evaluate(()=>[...H.pl.values()].map(p=>p.n+":"+p.sc+":"+(p.off?"off":"on")).join(" | ")));
console.log('B sees',await B.evaluate(()=>U.V&&U.V.pl.map(p=>p.n+":"+p.sc).join(",")));
console.log('errs',errs);await b.close()})();
