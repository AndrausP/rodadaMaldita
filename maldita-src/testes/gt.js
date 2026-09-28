const { chromium } = require('playwright');
(async()=>{
const b=await chromium.launch();const errs=[];
const mk=async(url,opts={})=>{const c=await b.newContext({viewport:{width:1300,height:860},ignoreHTTPSErrors:true,...opts});const p=await c.newPage();p.on('pageerror',e=>errs.push(url+' '+e.message));p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('ERR_'))errs.push(m.text())});await p.goto(url);return p};
const A=await mk('http://localhost:3000/gincana.html');
const B=await mk('https://127.0.0.1:3443/gincana.html');
const C=await mk('https://127.0.0.1:3443/gincana.html',{viewport:{width:390,height:844},isMobile:true,hasTouch:true});
for(const [p,n] of [[A,'Ana'],[B,'Beto'],[C,'Carla']]){await p.waitForSelector('.status.on',{timeout:10000});await p.fill('#nick',n)}
await A.click('[data-act=create]');await A.waitForSelector('.code b');const code=await A.$eval('.code b',e=>e.textContent);
for(const p of [B,C]){await p.fill('#code',code);await p.click('[data-act=join]')}
await A.waitForTimeout(2000);
await A.click('[data-act=mode][data-v=times]');await A.waitForTimeout(300);
await C.click('[data-act=team][data-v="2"]').catch(e=>console.log('team err',e.message));
await A.click('[data-act=count][data-v="12"]');
await A.waitForTimeout(600);
await A.screenshot({path:'/tmp/claude-0/g_lobby.png'});await C.screenshot({path:'/tmp/claude-0/g_lobbyC.png'});
await A.evaluate(()=>{H.cfg.count=6});await A.click('[data-act=start]');await A.evaluate(()=>{H.plan=['corrida','meteoro','quiz','flap','mira','tap']});
const shots={};const seen=new Set();
const t0=Date.now();
while(Date.now()-t0<200000){
  const st=await A.evaluate(()=>H&&({ph:H.ph,k:H.round&&H.round.k,ans:H.round&&H.round.ans,s:H.round&&H.round.d&&H.round.d.s,rid:H.rid,r:H.r,go:H.round&&H.round.go}));
  if(!st)break; if(st.ph==='final')break;
  const tag=st.ph+':'+st.k;
  if(st.ph==='play'){
    for(const [i,p] of [[0,A],[1,B],[2,C]].map(x=>x)){
      const key=st.rid+i; if(seen.has(key)&&!['ref','tap','conta','anag'].includes(st.k))continue;
      try{
      if(st.k==='quiz'){await p.click(`.opt[data-v="${i===2?st.ans:(Math.random()*4|0)}"]`,{timeout:1500});seen.add(key)}
      else if(st.k==='est'){await p.fill('#ansIn',String(Math.round((1+Math.random())*1000)),{timeout:1500});await p.press('#ansIn','Enter');seen.add(key)}
      else if(st.k==='conta'||st.k==='anag'){ if(seen.has(key))continue; if(await p.$('#ansIn')){ if(i===1){await p.fill('#ansIn','errado');await p.press('#ansIn','Enter');await p.waitForTimeout(300)} await p.fill('#ansIn',String(st.ans));await p.press('#ansIn','Enter');seen.add(key)} }
      else if(st.k==='ref'){ if(seen.has(key))continue; if(st.go){await p.click('#reflex',{timeout:1500});seen.add(key)} else if(i===1&&Math.random()<.1){await p.click('#reflex');seen.add(key)} }
      else if(st.k==='tap'){ if(seen.has(key))continue; for(let t=0;t<15+i*5;t++)await p.click('#tapper',{timeout:500}).catch(()=>{}); seen.add(key)}
      else if(['mira','corrida','flap','meteoro'].includes(st.k)){ const a=await p.$('#arena'); if(a){const bb=await a.boundingBox(); for(let q=0;q<4;q++){await p.mouse.click(bb.x+bb.width*Math.random(),bb.y+bb.height*Math.random())} await p.keyboard.press('Space');} }
      else if(st.k==='seq'){ const en=await p.$('#pads[aria-disabled=false]'); if(en&&!seen.has(key)){ for(const c of st.s) await p.click(`.pad[data-v="${i===1?(c+1)%4:c}"]`); seen.add(key)} }
      }catch(e){}
    }
    if(!shots[tag]){shots[tag]=1;await A.screenshot({path:`/tmp/claude-0/g_${st.k}_A.png`});await C.screenshot({path:`/tmp/claude-0/g_${st.k}_C.png`})}
  }
  if(st.ph==='reveal'){ if(!shots[tag]){shots[tag]=1;if(['corrida','meteoro','flap','mira'].includes(st.k))console.log('reveal',st.k,await B.evaluate(()=>U.V.pl.map(p=>p.n+'='+p.rv+'/+'+p.rp).join(' ')));await A.waitForTimeout(700);await B.screenshot({path:`/tmp/claude-0/g_rev_${st.k}.png`})} await A.click('[data-act=next]').catch(()=>{}) }
  if(st.ph==='intro'){ await A.click('[data-act=skip]').catch(()=>{}) }
  await A.waitForTimeout(150);
}
await A.waitForTimeout(1500);
await A.screenshot({path:'/tmp/claude-0/g_final.png'});await C.screenshot({path:'/tmp/claude-0/g_finalC.png'});
console.log('types seen',Object.keys(shots));
console.log('scores',await B.evaluate(()=>U.V.pl.map(p=>p.n+':'+p.sc+':t'+p.tm)));
console.log('phase B',await B.evaluate(()=>U.V.ph),'C',await C.evaluate(()=>U.V.ph));
console.log('errs',errs);await b.close()})();
