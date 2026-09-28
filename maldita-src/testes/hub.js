const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1280,height:900}});const p=await c.newPage();
await p.goto('http://localhost:3000/');await p.waitForTimeout(800);await p.screenshot({path:'/tmp/claude-0/ds/hub.png'});await b.close()})();
