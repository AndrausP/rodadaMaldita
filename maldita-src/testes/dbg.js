const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();p.on('console',m=>console.log('C',m.type(),m.text()));p.on('pageerror',e=>console.log('E',e.message));
await p.goto('http://localhost:3000/poker.html');await p.waitForSelector('.status.on');
const r=await p.evaluate(async()=>{const room=await claude.use('room');const t=[];t.push(room.peers().length);const j=await Promise.race([room.join('pk-test'),new Promise(r=>setTimeout(()=>r('timeout'),3000))]);t.push(typeof j);if(j!=='timeout'){await new Promise(r=>setTimeout(r,500));t.push(JSON.stringify(j.peers()))}return t});
console.log(r);await b.close()})();
