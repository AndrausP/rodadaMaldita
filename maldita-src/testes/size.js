const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const c=await b.newContext({viewport:{width:1300,height:860}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(600);await p.click('[data-act=bots][data-v="7"]');await p.click('[data-act=solo]');await p.waitForTimeout(300);
await p.evaluate(()=>{while(activePlayers().length<12)addBot();[...H.pl.values()].forEach((q,i)=>{q.n="Nome Comprido "+i})});
for(const k of TYPES_K=["quiz","porta","biblio","coroa","reliquia","altar","naoolhe","cacada","luz","chao","circulo","cabo"]){
 await p.evaluate(k=>{H.plan=[k,k];H.r=0;H.R=2;nextRound();playPhase()},k);await p.waitForTimeout(3000);
 const r=await p.evaluate(()=>{const st=JSON.stringify(publicView());const ctrl=(ARENA_HOST[H.round.k]||ARENA_HOST.generic);const w=H.world?JSON.stringify({w:ctrl.pub(H.world)}):"";return [st.length,w.length]});
 await p.evaluate(()=>{revealPhase()});await p.waitForTimeout(200);const rv=await p.evaluate(()=>JSON.stringify(publicView()).length);
 console.log(k,'st',r[0],'w',r[1],'reveal st',rv);await p.evaluate(()=>clearTimers())}
await p.evaluate(()=>{H.pl.forEach(q=>{q.h=[{k:"quiz",rp:10,rank:0}];q.sc=50});finalPhase()});console.log('final st',await p.evaluate(()=>JSON.stringify(publicView()).length));
console.log('errs',errs);await b.close()})();
