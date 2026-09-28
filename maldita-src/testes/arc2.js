const { chromium } = require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const errs=[];
const c=await b.newContext({viewport:{width:1300,height:860}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(600);await p.click('[data-act=solo]');await p.waitForTimeout(300);
for(const k of ["mira","flap","meteoro"]){
 await p.evaluate(k=>{H.plan=[k,k];H.r=0;H.R=2;nextRound();playPhase()},k);await p.waitForTimeout(1500);
 if(k==="flap"){for(let i=0;i<14;i++){await p.keyboard.press('Space');await p.waitForTimeout(260)}}
 if(k==="meteoro"){await p.mouse.move(500,400);await p.mouse.down();await p.waitForTimeout(2500);await p.mouse.up()}
 if(k==="mira"){await p.waitForTimeout(2500)}
 await p.screenshot({path:`/tmp/claude-0/ds/a_${k}.png`,clip:{x:20,y:170,width:1030,height:690}});await p.evaluate(()=>clearTimers())}
console.log('errs',errs);await b.close()})();
