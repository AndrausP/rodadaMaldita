const { chromium } = require('playwright');
(async()=>{
const b=await chromium.launch();
const errs=[];
const mk=async(url,ctxOpts={})=>{const c=await b.newContext({viewport:{width:1440,height:900},...ctxOpts});const p=await c.newPage();p.on('pageerror',e=>errs.push(url+' '+e.message));p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('ERR_'))errs.push(m.text())});await p.goto(url);return p};
const H=await mk('http://localhost:3000/poker.html');
const Gp=await mk('https://127.0.0.1:3443/poker.html',{ignoreHTTPSErrors:true});
await H.waitForSelector('.status.on',{timeout:10000});await Gp.waitForSelector('.status.on',{timeout:10000});
await H.fill('#nick','Ana');await Gp.fill('#nick','Beto');
await H.click('[data-act=create]');await H.waitForSelector('.code b');
const code=await H.$eval('.code b',e=>e.textContent);console.log('code',code);
await Gp.waitForTimeout(800);
const listed=await Gp.$$eval('.tbl-item',els=>els.map(e=>e.innerText));console.log('lobby list',listed);
await Gp.fill('#code',code);await Gp.click('[data-act=join]');
await H.waitForTimeout(2000);
console.log('host seats',await H.$$eval('.seat .nm',e=>e.map(x=>x.textContent)));
await H.click('[data-act=addBot]');await H.waitForTimeout(500);
await H.click('[data-act=deal]');await H.waitForTimeout(1500);
console.log('guest seats',await Gp.$$eval('.seat .nm',e=>e.map(x=>x.textContent)));
console.log('guest hole',await Gp.$$eval('.myhand .pc',e=>e.map(x=>x.getAttribute('aria-label')||'vazio')));
console.log('host hole',await H.$$eval('.myhand .pc',e=>e.map(x=>x.getAttribute('aria-label')||'vazio')));
// guest's view of host seat cards should be backs
console.log('guest sees backs',await Gp.$$eval('.seat .pc.back',e=>e.length));
await Gp.fill('#chatIn','bora perder');await Gp.press('#chatIn','Enter');
await H.waitForTimeout(800);
console.log('host bubble',await H.$$eval('.bubble',e=>e.map(x=>x.textContent)));
let hands=new Set();
for(let k=0;k<140;k++){
  for(const P of [H,Gp]){const c=await P.$('[data-act=call]:not([disabled])');if(c){if(Math.random()<.2&&await P.$('[data-act=raise]'))await P.click('[data-act=raise]');else await c.click()}
    const rb=await P.$('[data-act=rebuy]');if(rb)await rb.click();}
  await H.waitForTimeout(250);
  const h=await Gp.$eval('#head',e=>e.innerText).catch(()=>'');const m=h.match(/Mão (\d+)/);if(m)hands.add(m[1]);
  if(k===30){await H.screenshot({path:'/tmp/claude-0/mpH.png'});await Gp.screenshot({path:'/tmp/claude-0/mpG.png'})}
}
console.log('hands seen by guest',[...hands]);
console.log('guest feed tail',(await Gp.$eval('#feed',e=>e.innerText)).slice(-500));
console.log('host feed tail',(await H.$eval('#feed',e=>e.innerText)).slice(-300));
// host leaves
await H.click('[data-act=leave]');await Gp.waitForTimeout(10000);
console.log('guest overlay',await Gp.$eval('.overlay',e=>e.innerText).catch(()=>'none'));
console.log('errs',errs);await b.close()})();
