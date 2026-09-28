const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const c=await b.newContext({viewport:{width:1400,height:900}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('ERR_'))errs.push(m.text())});
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(1500);
await p.screenshot({path:'/tmp/claude-0/ml_lobby.png',fullPage:true});
await p.click('[data-act=solo]');await p.waitForTimeout(500);
await p.screenshot({path:'/tmp/claude-0/ml_roomlobby.png'});
const types=["quiz","conta","anag","est","ref","tap","seq","mira","corrida","flap","meteoro","luz","chao","coroa","naoolhe","cabo","porta","circulo","altar","vitral","biblio","reliquia"];
await p.evaluate(t=>{H.cfg.count=t.length;startGame();H.plan=t.slice();H.plan[0]=H.round.k;},types);
for(let r=0;r<types.length;r++){
  await p.evaluate(()=>{if(H.ph==="intro")playPhase()});await p.waitForTimeout(700);
  const k=await p.evaluate(()=>H.round.k);
  // interações
  for(let i=0;i<8;i++){
    if(['luz','chao','coroa','circulo','altar','reliquia','naoolhe'].includes(k)){await p.keyboard.down(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'][i%4]);await p.waitForTimeout(250);await p.keyboard.up(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'][i%4]);if(i%3==0)await p.keyboard.press('Space')}
    else if(k==='cabo'){await p.keyboard.press(['ArrowLeft','ArrowUp','ArrowDown','ArrowRight'][i%4])}
    else if(k==='porta'&&i===0){await p.click('.note >> nth=0').catch(()=>{});await p.click('.note >> nth=1').catch(()=>{});await p.click('.door >> nth=1').catch(()=>{})}
    else if(k==='biblio'&&i===0){await p.click('.book >> nth=0').catch(()=>{});await p.click('.book >> nth=2').catch(()=>{})}
    else if(k==='vitral'&&i<3){await p.click('.tile >> nth=0').catch(()=>{})}
    else if(k==='quiz'&&i===0){await p.click('.opt >> nth=0').catch(()=>{})}
    else if(['mira','meteoro','flap'].includes(k)){const a=await p.$('#arena');if(a){const bb=await a.boundingBox();await p.mouse.click(bb.x+bb.width*Math.random(),bb.y+bb.height*Math.random())}}
    await p.waitForTimeout(120);
  }
  await p.screenshot({path:`/tmp/claude-0/ml_${k}.png`});
  await p.evaluate(()=>revealPhase());await p.waitForTimeout(500);
  if(['porta','cabo','coroa','reliquia','quiz'].includes(k))await p.screenshot({path:`/tmp/claude-0/ml_rev_${k}.png`});
  await p.evaluate(()=>nextRound());await p.waitForTimeout(250);
}
await p.waitForTimeout(800);await p.screenshot({path:'/tmp/claude-0/ml_final.png'});
console.log('scores',await p.evaluate(()=>U.V.pl.map(x=>x.n+':'+x.sc)));
console.log('errs',errs.slice(0,15));await b.close()})();
