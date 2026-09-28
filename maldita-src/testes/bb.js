const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(700);await p.click('[data-act=solo]');await p.waitForTimeout(300);
await p.evaluate(()=>{H.plan=["coroa"];H.r=0;H.R=3;nextRound()});await p.waitForTimeout(2600);await p.screenshot({path:'/tmp/claude-0/ds/bb_intro.png'});
await p.evaluate(()=>{playPhase();U.says["me"]={m:"Te peguei",t:performance.now()}});await p.waitForTimeout(300);
const box=await p.locator('#arena').boundingBox();const cx=box.x+box.width/2,cy=box.y+box.height*.7;
const x0=await p.evaluate(()=>arenaMeRef.x);
const cdp=await c.newCDPSession(p);
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx,y:cy,id:1}]});
for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx+i*8,y:cy,id:1}]});await p.waitForTimeout(40)}
await p.waitForTimeout(700);await p.screenshot({path:'/tmp/claude-0/ds/bb_joy.png'});
const x1=await p.evaluate(()=>arenaMeRef.x);
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
await p.waitForTimeout(8000);
console.log('moved right',x1-x0, 'bs',await p.evaluate(()=>JSON.stringify((U.W||{}).bs)), 'says',await p.evaluate(()=>Object.keys(U.says).length));
console.log('errs',errs);await b.close()})();
