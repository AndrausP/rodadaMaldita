const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(500);
console.log(await p.evaluate(()=>{const o=[];for(let n=1;n<=12;n++)for(let i=0;i<n;i++){const [x,y]=relAltar(i,n);const w=relWalls([0,0]).find(w=>circleHitsRect(x,y,HB.altar+PR,w));const q=REL.plates.concat(REL.levers).find(q=>dist(q.x,q.y,x,y)<HB.altar+HB.plate);if(w||q)o.push(`n${n} i${i} (${x|0},${y|0}) ${w?JSON.stringify(w):''} ${q?JSON.stringify(q):''}`)}return o.join('\n')}));await b.close()})();
