const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const c=await b.newContext({viewport:{width:1100,height:700}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(500);
await p.evaluate(()=>{const cv=document.createElement('canvas');cv.width=1100;cv.height=700;cv.style.cssText='position:fixed;left:0;top:0;z-index:99;background:#1A1216';document.body.appendChild(cv);const c=cv.getContext('2d');
 const codes=[];for(let f=0;f<10;f++)codes.push(`${f}0100`);for(let e=0;e<6;e++)codes.push(`8${e%8}${e}00`);for(let a=0;a<9;a++)codes.push(`9${a%8}1${a}0`);for(let m=0;m<5;m++)codes.push(`${m+5}3${m}${m}${m}`);
 codes.forEach((cd,i)=>{const x=60+(i%10)*105,y=90+Math.floor(i/10)*150;drawAvatar(c,cd,x,y,34);c.fillStyle="#fff";c.font="11px sans-serif";c.textAlign="center";c.fillText(cd,x,y+62)});
 drawAvatar(c,"98150",950,560,20);drawAvatar(c,"85274",1010,560,20)});
await p.screenshot({path:'/tmp/claude-0/ds/avs.png'});console.log('errs',errs);await b.close()})();
