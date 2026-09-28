const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const c=await b.newContext({viewport:{width:1300,height:860}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.evaluate(()=>localStorage.setItem('rodada-maldita:rec',JSON.stringify({t:{},rit:3,win:1,best:40,souls:170})));await p.reload();await p.waitForTimeout(800);
await p.screenshot({path:'/tmp/claude-0/ds/lv_lobby.png',clip:{x:790,y:100,width:500,height:300}});
await p.click('[data-act=solo]');await p.waitForTimeout(500);await p.screenshot({path:'/tmp/claude-0/ds/lv_room.png',clip:{x:970,y:60,width:330,height:400}});
await p.evaluate(()=>{H.plan=["quiz","quiz"];H.r=0;H.R=2;nextRound();playPhase();onAnswer("me",H.round.ans,"");revealPhase()});await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>[REC.souls,myLv(),lvTitle(myLv())].join(" ")));
console.log('errs',errs);await b.close()})();
