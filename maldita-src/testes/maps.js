const PR=20,WW=1600,WH=1000,CX=800,CY=500;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function ringPos(i,n,rx,ry){const a=-Math.PI/2+i/Math.max(1,n)*Math.PI*2;return [CX+Math.cos(a)*rx,CY+Math.sin(a)*ry]}
const hit=(x,y,r,rc)=>{const nx=clamp(x,rc.x,rc.x+rc.w),ny=clamp(y,rc.y,rc.y+rc.h);return (x-nx)**2+(y-ny)**2<r*r};
module.exports=function check(ws,rx,ry){let bad=0;for(let n=1;n<=12;n++)for(let i=0;i<n;i++){const [x,y]=ringPos(i,n,rx,ry);if(ws.some(w=>hit(x,y,PR+6,w)))bad++}
  const S=20,cols=WW/S,rows=WH/S;const blocked=(cx,cy)=>{const x=cx*S+S/2,y=cy*S+S/2;return x<PR||y<PR||x>WW-PR||y>WH-PR||ws.some(w=>hit(x,y,PR,w))};
  let free=0;for(let x=0;x<cols;x++)for(let y=0;y<rows;y++)if(!blocked(x,y))free++;
  const [sx,sy]=ringPos(0,1,rx,ry);const seen=new Set();const q=[[Math.floor(sx/S),Math.floor(sy/S)]];let cnt=0;
  while(q.length){const [x,y]=q.pop();const k=x+","+y;if(seen.has(k)||x<0||y<0||x>=cols||y>=rows||blocked(x,y))continue;seen.add(k);cnt++;q.push([x+1,y],[x-1,y],[x,y+1],[x,y-1])}
  return {bad,reach:cnt,free}};
