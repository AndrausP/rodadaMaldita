/* ============================================================
   FLIPERAMA MACABRO (cada um joga no seu aparelho, mesma semente pra todos)
   ============================================================ */
const INK="#030203",PAL=["#E3263F","#F2C14E","#7FAF6A","#8A6BB0","#7FB7C9","#E8772E"];
function rrect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function fillStroke(c,fill,lw){c.fillStyle=fill;c.fill();c.lineWidth=lw;c.strokeStyle=INK;c.stroke()}
const _atm={};
function atmos(c,W,H,seed=7){const key=W+"x"+H+"x"+seed;let bg=_atm[key];
  if(!bg){bg=document.createElement("canvas");bg.width=Math.max(1,W);bg.height=Math.max(1,H);const x=bg.getContext("2d");const r=mulberry32(seed);
    const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#0B0710");g.addColorStop(.7,"#130A10");g.addColorStop(1,"#070405");x.fillStyle=g;x.fillRect(0,0,W,H);
    const mx=W*(.2+r()*.6),my=H*.2;const mg=x.createRadialGradient(mx,my,4,mx,my,H*.5);mg.addColorStop(0,"rgba(233,223,204,.10)");mg.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=mg;x.fillRect(0,0,W,H);
    for(let layer=0;layer<2;layer++){x.fillStyle=layer?"#050304":"#0E080C";const base=H*(layer?.93:.86);
      for(let i=0;i<14;i++){const tx=r()*W,th=H*(.12+r()*.2)*(layer?1.2:.9),tw=th*.45;x.beginPath();x.moveTo(tx,base-th);x.lineTo(tx-tw/2,base);x.lineTo(tx+tw/2,base);x.closePath();x.fill();x.fillRect(tx-2,base-4,4,8)}
      x.fillRect(0,base,W,H-base);
      if(layer)for(let i=0;i<8;i++){const gx=r()*W,gs=H*(.03+r()*.03);x.fillRect(gx-gs*.15,base-gs*1.4,gs*.3,gs*1.4);x.fillRect(gx-gs*.5,base-gs,gs,gs*.25)}}
    _atm[key]=bg;const ks=Object.keys(_atm);if(ks.length>6)delete _atm[ks[0]]}
  c.drawImage(bg,0,0,W,H);
  const t=performance.now()/1000;c.save();for(let i=0;i<5;i++){const fx=((t*(8+i*3)+i*W/5)%(W+400))-200,fy=H*(.55+.08*Math.sin(i*1.7))+Math.sin(t*.3+i)*10;const fg=c.createRadialGradient(fx,fy,10,fx,fy,180);fg.addColorStop(0,"rgba(191,227,236,.05)");fg.addColorStop(1,"rgba(191,227,236,0)");c.fillStyle=fg;c.fillRect(fx-180,fy-180,360,360)}c.restore()}
function dots(c,W,H,off=0){c.fillStyle="rgba(227,38,63,.08)";for(let y=((off%22)+22)%22;y<H;y+=22)for(let x=0;x<W;x+=22){c.fillRect(x,y,2,2)}}
const FONT=(px)=>`900 ${Math.round(px*1.08)}px "Grenze Gotisch",Georgia,serif`;
/* ---------- kit visual dos canvas ---------- */
function glass(c,x,y,w,h,r,accent){c.save();rrect(c,x,y,w,h,r);c.fillStyle="rgba(12,9,10,.84)";c.fill();c.lineWidth=1.5;c.strokeStyle="rgba(233,223,204,.16)";c.stroke();
  if(accent){c.beginPath();c.rect(x,y,w,h);c.clip();c.fillStyle=accent;c.fillRect(x,y,4,h)}c.restore()}
function hudPill(c,x,y,h,label,value,col,right){c.save();c.textBaseline="middle";
  c.font=BODY(Math.max(9,h*.2),800);const lw=label?c.measureText(label.toUpperCase()).width+label.length*1.2:0;c.font=BODY(h*.42,900);const vw=c.measureText(value).width;
  const w=Math.max(lw,vw)+h*.7+6;const x0=right?x-w:x;glass(c,x0,y,w,h,h*.3,col);
  c.textAlign="left";if(label){c.font=BODY(Math.max(9,h*.2),800);c.fillStyle="rgba(233,223,204,.5)";if(c.letterSpacing!==undefined)c.letterSpacing="1.2px";c.fillText(label.toUpperCase(),x0+h*.35+4,y+h*.3);if(c.letterSpacing!==undefined)c.letterSpacing="0px"}
  c.font=BODY(h*.42,900);c.fillStyle=col||"#E9DFCC";c.fillText(value,x0+h*.35+4,y+(label?h*.66:h*.52));c.restore();return w}
function timerPill(c,x,y,h,left,total){c.save();const s=Math.max(0,Math.ceil(left/1000)),low=s<=5,col=low?"#E0283F":"#EBC15A";
  c.font=BODY(h*.42,900);const tw=c.measureText(s+"s").width;const w=h*.95+tw+h*.4;glass(c,x-w,y,w,h,h*.3);
  const p=total?Math.max(0,Math.min(1,left/total)):1;const cx=x-w+h*.5,cy=y+h/2,rr=h*.24;
  c.beginPath();c.arc(cx,cy,rr,0,7);c.strokeStyle="rgba(233,223,204,.14)";c.lineWidth=h*.08;c.stroke();
  c.beginPath();c.arc(cx,cy,rr,-Math.PI/2,-Math.PI/2+p*Math.PI*2);c.strokeStyle=col;c.lineCap="round";c.stroke();
  if(low){c.shadowColor=col;c.shadowBlur=12+Math.sin(performance.now()/90)*6}
  c.fillStyle=col;c.textAlign="left";c.textBaseline="middle";c.fillText(s+"s",x-w+h*.95,cy+1);c.restore()}
function bigText(c,t,x,y,px,col){c.save();c.font=FONT(px);c.textAlign="center";c.textBaseline="middle";c.lineJoin="round";c.lineWidth=px*.16;c.strokeStyle="#050304";c.strokeText(t,x,y);
  c.shadowColor=col;c.shadowBlur=px*.5;c.fillStyle=col;c.fillText(t,x,y);c.restore()}
function endCard(c,W,H,title,sub){c.save();c.fillStyle="rgba(5,3,4,.78)";c.fillRect(0,0,W,H);const f=Math.max(.7,Math.min(1.3,W/800));
  const g=c.createRadialGradient(W/2,H/2,10,W/2,H/2,Math.max(W,H)*.5);g.addColorStop(0,"rgba(179,18,43,.28)");g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  c.font=BODY(12*f,800);c.fillStyle="rgba(233,223,204,.55)";c.textAlign="center";c.fillText("F I M   D A   P R O V A Ç Ã O",W/2,H/2-58*f);
  bigText(c,title,W/2,H/2-12*f,64*f,"#E0283F");
  if(sub){c.font=BODY(17*f,700);c.fillStyle="#E9DFCC";c.textBaseline="middle";c.fillText(sub,W/2,H/2+44*f)}c.restore()}
const _vig={};
function vignette(c,W,H,strength){const k=W+"x"+H+"x"+(strength||.7);let g=_vig[k];if(!g){g=c.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.75);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,`rgba(0,0,0,${strength||.7})`);_vig[k]=g}c.fillStyle=g;c.fillRect(0,0,W,H)}
const BODY=(px,w=800)=>`${w} ${px}px Figtree,system-ui,sans-serif`;
const GAMES={};

/* ---------- OLHOS NO ESCURO ---------- */
GAMES.mira=(env,rng)=>{
  const g={score:0,hits:0,shots:0,t:0,next:.3,targets:[],pops:[],extra:()=>`${g.hits} olhos furados · precisão ${g.shots?Math.round(g.hits/g.shots*100):100}%`};
  const R=()=>Math.max(26,38*env.S);
  function spawn(){const {W,H}=env,r=R(),m=r+12;g.targets.push({x:m+rng()*(W-2*m),y:m+54+rng()*Math.max(10,H-2*m-54),age:0,life:Math.max(1.05,1.75-g.t*.022),c:["#E3263F","#F2C14E","#7FAF6A","#8A6BB0"][Math.floor(rng()*4)]})}
  g.update=dt=>{g.t+=dt;if(g.t>=g.next&&g.targets.length<3){spawn();g.next=g.t+Math.max(.26,.55-g.t*.009)}
    g.targets.forEach(o=>o.age+=dt);g.targets=g.targets.filter(o=>o.age<o.life);g.pops.forEach(p=>p.a+=dt);g.pops=g.pops.filter(p=>p.a<.7)};
  const EY=.6,TOL=4;/* hitbox do olho = elipse (largura R, altura 0,6R) + 4px de tolerância */
  const eyeHit=(o,x,y)=>((x-o.x)/(R()+TOL))**2+((y-o.y)/(R()*EY+TOL))**2;
  g.down=(x,y)=>{g.shots++;let best=null,bd=1e9;for(const o of g.targets){const d=eyeHit(o,x,y);if(d<=1&&d<bd){bd=d;best=o}}
    if(best){const f=1-best.age/best.life,pts=100+Math.round(100*f);g.score+=pts;g.hits++;g.targets=g.targets.filter(o=>o!==best);g.pops.push({x,y,t:"+"+pts,c:"#7FAF6A",a:0,b:1});sfx.slash();env.splat(x,y)}
    else{g.score=Math.max(0,g.score-25);g.pops.push({x,y,t:"-25",c:"#E3263F",a:0});sfx.bad()}};
  g.draw=c=>{const {W,H,S}=env;atmos(c,W,H,11);
    for(const o of g.targets){const f=1-o.age/o.life,r=R(),lw=Math.max(2.5,3*S),open=Math.min(1,o.age*6)*Math.min(1,f*3);
      c.save();c.translate(o.x,o.y);c.shadowColor=o.c;c.shadowBlur=24;
      c.beginPath();c.moveTo(-r,0);c.quadraticCurveTo(0,-r*1.1*open,r,0);c.quadraticCurveTo(0,r*1.1*open,-r,0);c.closePath();fillStroke(c,"#EDE3D1",lw);c.shadowBlur=0;
      c.save();c.clip();c.beginPath();c.arc(0,0,r*.5,0,7);fillStroke(c,o.c,lw*.8);c.beginPath();c.ellipse(0,0,r*.14,r*.36,0,0,7);c.fillStyle=INK;c.fill();
      c.strokeStyle="rgba(200,16,46,.6)";c.lineWidth=1.5;for(let i=0;i<4;i++){c.beginPath();c.moveTo(-r,(i-1.5)*r*.2);c.quadraticCurveTo(-r*.6,(i-1.5)*r*.3,-r*.45,(i-1.5)*r*.1);c.stroke()}c.restore();
      c.beginPath();c.arc(0,0,r+8,-Math.PI/2,-Math.PI/2+f*Math.PI*2);c.strokeStyle="rgba(237,227,209,.35)";c.lineWidth=3;c.stroke();c.restore()}
    for(const p of g.pops){c.globalAlpha=1-p.a/.7;c.font=FONT(22*Math.max(.8,S));c.fillStyle=p.c;c.textAlign="center";c.fillText(p.t,p.x,p.y-p.a*50);c.globalAlpha=1}};
  g.debug=c=>{c.strokeStyle="#39FF14";c.lineWidth=2;for(const o of g.targets){c.beginPath();c.ellipse(o.x,o.y,R()+TOL,R()*EY+TOL,0,0,7);c.stroke()}};
  return g;
};

/* ---------- MÃOS DA COVA ---------- */
GAMES.covas=(env,rng)=>{
  const g={score:0,hits:0,combo:0,best:0,t:0,next:.5,holes:[],pops:[],extra:()=>`${g.hits} mãos esmagadas · combo ${g.combo}`};
  function lay(){const {W,H}=env;const cols=3,rows=3;const top=H*.2,cw=W/cols,ch=(H-top-10)/rows;const r=Math.min(cw,ch)*.34;const out=[];
    for(let j=0;j<rows;j++)for(let i=0;i<cols;i++)out.push({x:cw*(i+.5),y:top+ch*(j+.62),r});return out}
  let L=lay();g.holes=L.map(()=>null);
  const spawn=()=>{const free=g.holes.map((o,i)=>o?-1:i).filter(i=>i>=0);if(!free.length)return;const i=free[Math.floor(rng()*free.length)];const q=rng();
    g.holes[i]={k:q<.16?"soul":q<.26?"skull":"hand",age:0,life:Math.max(.62,1.25-g.t*.022),hit:0}};
  g.update=dt=>{g.t+=dt;const nL=lay();if(nL.length!==L.length){g.holes=nL.map(()=>null)}L=nL;
    if(g.t>=g.next){spawn();if(g.t>8&&rng()<.35)spawn();g.next=g.t+Math.max(.28,.7-g.t*.016)}
    g.holes.forEach((o,i)=>{if(!o)return;o.age+=dt;if(o.hit)o.hit+=dt;if(o.age>=o.life||o.hit>.25){if(!o.hit&&o.k==="hand")g.combo=0;g.holes[i]=null}});
    g.pops.forEach(p=>p.a+=dt);g.pops=g.pops.filter(p=>p.a<.7)};
  const rise=o=>{const a=o.age,l=o.life;return Math.max(0,Math.min(1,a/.12,(l-a)/.15))};
  const hitAt=(i,x,y)=>{const o=g.holes[i];if(!o||o.hit)return false;const h=L[i];const up=rise(o);if(up<.35)return false;
    if(o.k==="soul"){g.score=Math.max(0,g.score-150);g.combo=0;g.pops.push({x:h.x,y:h.y-h.r,t:"-150",c:"#E3263F",a:0});sfx.bad();env.shake(8)}
    else{g.combo++;g.best=Math.max(g.best,g.combo);const pts=(o.k==="skull"?200:100)+Math.min(10,g.combo)*10;g.score+=pts;g.hits++;g.pops.push({x:h.x,y:h.y-h.r,t:"+"+pts,c:o.k==="skull"?"#F2C14E":"#7FAF6A",a:0});sfx.stab();env.splat(h.x,h.y-h.r*.5)}
    o.hit=.001;return true};
  g.down=(x,y)=>{let best=-1,bd=1e9;L.forEach((h,i)=>{const d=Math.hypot(x-h.x,y-(h.y-h.r*.6));if(d<h.r*1.25&&d<bd){bd=d;best=i}});
    if(best<0||!hitAt(best,x,y)){g.score=Math.max(0,g.score-20);g.combo=0;g.pops.push({x,y,t:"-20",c:"#E3263F",a:0});sfx.tap()}};
  g.key=(code,down)=>{if(!down)return;const m=code.match(/^(?:Digit|Numpad)([1-9])$/);if(!m)return;const n=+m[1]-1;const cols=L.length/3;const i=cols===3?n:Math.min(L.length-1,Math.floor(n/3)*4+(n%3));if(!hitAt(i)){g.combo=0;sfx.tap()}};
  g.draw=c=>{const {W,H,S}=env;atmos(c,W,H,23);const lw=Math.max(2.5,3*S);
    L.forEach((h,i)=>{const o=g.holes[i];const r=h.r;
      c.save();c.translate(h.x,h.y);{const tg=c.createLinearGradient(0,-r*1.5,0,0);tg.addColorStop(0,"#5E4E56");tg.addColorStop(1,"#2E2328");c.fillStyle=tg;c.beginPath();c.moveTo(-r*.55,-r*.05);c.lineTo(-r*.55,-r*.95);c.arc(0,-r*.95,r*.55,Math.PI,0);c.lineTo(r*.55,-r*.05);c.closePath();c.fill();c.lineWidth=lw*.6;c.strokeStyle="#050304";c.stroke();
      c.fillStyle="rgba(0,0,0,.45)";c.fillRect(-r*.06,-r*1.25,r*.12,r*.6);c.fillRect(-r*.22,-r*1.08,r*.44,r*.1)}
      c.beginPath();c.ellipse(0,0,r*1.1,r*.4,0,0,7);c.fillStyle="#4A3528";c.fill();c.beginPath();c.ellipse(0,-r*.02,r*.85,r*.26,0,0,7);c.fillStyle="#070405";c.fill();
      if(o){const up=rise(o)*(o.hit?Math.max(0,1-o.hit*4):1);c.save();c.beginPath();c.rect(-r*1.2,-r*2.4,r*2.4,r*2.4);c.clip();c.translate(0,r*(1-up)*1.5);
        if(o.k==="soul"){c.shadowColor="#BFE3EC";c.shadowBlur=18;c.beginPath();c.moveTo(-r*.45,0);c.lineTo(-r*.45,-r*.9);c.arc(0,-r*.9,r*.45,Math.PI,0);c.lineTo(r*.45,0);c.closePath();fillStroke(c,"#DDEFF3",lw*.7);c.shadowBlur=0;c.fillStyle=INK;c.beginPath();c.arc(-r*.16,-r*.95,r*.07,0,7);c.arc(r*.16,-r*.95,r*.07,0,7);c.fill();c.beginPath();c.arc(0,-r*.72,r*.06,0,7);c.fill()}
        else if(o.k==="skull"){c.shadowColor="#F2C14E";c.shadowBlur=16;c.beginPath();c.arc(0,-r*.95,r*.48,0,7);fillStroke(c,"#F2C14E",lw*.7);c.shadowBlur=0;c.fillStyle=INK;c.beginPath();c.arc(-r*.18,-r*1,r*.12,0,7);c.arc(r*.18,-r*1,r*.12,0,7);c.fill();c.fillRect(-r*.2,-r*.6,r*.4,r*.12)}
        else{c.fillStyle="#6E8F5A";c.beginPath();c.moveTo(-r*.28,0);c.lineTo(-r*.3,-r*.8);for(let f=0;f<4;f++){const fx=-r*.3+f*r*.2;c.lineTo(fx,-r*1.35+(f===0||f===3?r*.2:0));c.lineTo(fx+r*.14,-r*1.35+(f===0||f===3?r*.2:0));c.lineTo(fx+r*.14,-r*.85)}c.lineTo(r*.34,-r*.6);c.lineTo(r*.28,0);c.closePath();fillStroke(c,"#6E8F5A",lw*.7);
          c.fillStyle="rgba(120,10,28,.7)";c.fillRect(-r*.1,-r*.5,r*.08,r*.3)}
        c.restore()}
      c.beginPath();c.ellipse(0,-r*.02,r*.85,r*.26,0,0,Math.PI);c.lineTo(-r*1.1,r*.05);c.ellipse(0,r*.05,r*1.1,r*.35,0,Math.PI,0,true);c.closePath();c.fillStyle="#4A3528";c.fill();
      c.font=BODY(Math.max(10,12*S),900);c.fillStyle="rgba(233,223,204,.25)";c.textAlign="center";c.fillText(L.length===9?String(i+1):"",0,r*.75);c.restore()});
    for(const p of g.pops){c.globalAlpha=1-p.a/.7;c.font=FONT(22*Math.max(.8,S));c.fillStyle=p.c;c.textAlign="center";c.fillText(p.t,p.x,p.y-p.a*50);c.globalAlpha=1}};
  g.debug=c=>{c.strokeStyle="#39FF14";c.lineWidth=2;L.forEach(h=>{c.beginPath();c.arc(h.x,h.y-h.r*.6,h.r*1.25,0,7);c.stroke()})};
  return g;
};

/* ---------- FUGA DO CEMITÉRIO ---------- */
GAMES.corrida=(env,rng)=>{
  const g={score:0,t:0,dist:0,lane:1,x:null,obs:[],gen:1.2,coins:0,crash:0,v:.8,extra:()=>`${g.coins} almas recolhidas`};
  function geom(){const {W,H}=env;const roadW=Math.min(W*.94,H*.95);const laneW=roadW/3;const pw=laneW*.5,ph=pw*1.1;return {W,H,roadW,roadX:(W-roadW)/2,laneW,pw,ph,y0:H-ph-40}}
  function genTo(limit){while(g.gen<limit){const r=rng();
    if(r<.62){const l=Math.floor(rng()*3);g.obs.push({p:g.gen,l,k:rng()<.5?"tomb":"coffin"});if(rng()<.55){let cl=(l+1+Math.floor(rng()*2))%3;g.obs.push({p:g.gen,l:cl,k:"soul"})}}
    else{const free=Math.floor(rng()*3);for(let l=0;l<3;l++)if(l!==free)g.obs.push({p:g.gen,l,k:rng()<.5?"tomb":"coffin"});if(rng()<.6)g.obs.push({p:g.gen,l:free,k:"soul"})}
    g.gen+=.62+rng()*.5}}
  const move=d=>{g.lane=Math.max(0,Math.min(2,g.lane+d));sfx.tap()};
  g.key=(code,down)=>{if(!down)return;if(code==="ArrowLeft"||code==="KeyA")move(-1);if(code==="ArrowRight"||code==="KeyD")move(1)};
  g.down=(x)=>move(x<env.W/2?-1:1);
  /* hitboxes: lápide e caixão = retângulo do desenho; alma = círculo; jogador = círculo da cabeça (85%) */
  const obsBox=(o,ox,oy,G)=>o.k==="tomb"?{x:ox-G.pw*.45,y:oy,w:G.pw*.9,h:G.pw*1.15}:o.k==="coffin"?{x:ox-G.pw*.4,y:oy,w:G.pw*.8,h:G.pw*1.04}:{cx:ox,cy:oy+G.pw*.4,r:G.pw*.3};
  const circleRect=(x,y,r,b)=>{const nx=Math.max(b.x,Math.min(x,b.x+b.w)),ny=Math.max(b.y,Math.min(y,b.y+b.h));return (x-nx)**2+(y-ny)**2<r*r};
  g.debug=c=>{const G=geom(),py=G.y0+G.ph*.4;c.strokeStyle="#39FF14";c.lineWidth=2;c.beginPath();c.arc(g.x,py,G.pw*.46*.92,0,7);c.stroke();c.strokeStyle="#00E5FF";
    for(const o of g.obs){if(o.hit)continue;const oy=G.y0-(o.p-g.dist)*G.H;const ox=G.roadX+G.laneW*(o.l+.5);const b=obsBox(o,ox,oy,G);if(o.k==="soul"){c.beginPath();c.arc(b.cx,b.cy,b.r,0,7);c.stroke()}else c.strokeRect(b.x,b.y,b.w,b.h)}};
  g.update=dt=>{const G=geom();g.t+=dt;const base=Math.min(2.1,.85+g.t*.042);const rec=g.crash>0?Math.max(.3,1-g.crash/1.4*.7):1;g.v=base*rec;g.crash=Math.max(0,g.crash-dt);
    g.dist+=g.v*dt;genTo(g.dist+2.5);
    const tx=G.roadX+G.laneW*(g.lane+.5);g.x=g.x===null?tx:g.x+(tx-g.x)*Math.min(1,dt*16);
    const py=G.y0+G.ph*.4,pr=G.pw*.46*.92;
    for(const o of g.obs){if(o.hit)continue;const oy=G.y0-(o.p-g.dist)*G.H;const ox=G.roadX+G.laneW*(o.l+.5);const b=obsBox(o,ox,oy,G);
      if(o.k==="soul"?Math.hypot(g.x-b.cx,py-b.cy)<pr+b.r:circleRect(g.x,py,pr,b)){
        if(o.k==="soul"){o.hit=1;g.coins++;sfx.ok()}
        else if(g.crash<=0){o.hit=1;g.crash=1.4;sfx.stab();env.shake(10);env.splat(g.x,G.y0)}}}
    g.obs=g.obs.filter(o=>o.p-g.dist>-.5);g.score=Math.floor(g.dist*50)+g.coins*25};
  g.draw=c=>{const G=geom(),{W,H,S}=env,lw=Math.max(2.5,3*S);
    c.fillStyle="#0C120B";c.fillRect(0,0,W,H);const off=(g.dist*H)%60;c.fillStyle="rgba(127,175,106,.07)";for(let y=-60+off;y<H;y+=60){c.fillRect(0,y,G.roadX,26);c.fillRect(G.roadX+G.roadW,y+30,W,26)}
    // decoração nas margens: cruzes e lápides tortas
    const seg=H*.34,base=Math.floor(g.dist*H/seg);for(let i=-1;i<5;i++){const n=base+i,hsh=Math.sin(n*127.1)*43758.5,rr=hsh-Math.floor(hsh);const y=H-((g.dist*H)%seg)-i*seg+seg*.3;
      [[G.roadX*.5,rr],[G.roadX+G.roadW+(W-G.roadX-G.roadW)*.5,1-rr]].forEach(([x,q])=>{if(G.roadX<30)return;const sz=Math.min(G.roadX*.35,26*S)*(0.7+q*.5);c.save();c.translate(x+(q-.5)*G.roadX*.4,y);c.rotate((q-.5)*.3);c.fillStyle="rgba(10,7,9,.9)";
        if(q<.5){c.fillRect(-sz*.12,-sz,sz*.24,sz*1.3);c.fillRect(-sz*.45,-sz*.7,sz*.9,sz*.22)}else{c.beginPath();c.moveTo(-sz*.4,sz*.3);c.lineTo(-sz*.4,-sz*.4);c.arc(0,-sz*.4,sz*.4,Math.PI,0);c.lineTo(sz*.4,sz*.3);c.fill()}c.restore()})}
    rrect(c,G.roadX,-10,G.roadW,H+20,0);const rg=c.createLinearGradient(G.roadX,0,G.roadX+G.roadW,0);rg.addColorStop(0,"#1A1316");rg.addColorStop(.5,"#2A2024");rg.addColorStop(1,"#1A1316");c.fillStyle=rg;c.fill();c.lineWidth=lw*1.4;c.strokeStyle=INK;c.stroke();
    c.save();c.beginPath();c.rect(G.roadX,0,G.roadW,H);c.clip();const sh=Math.max(22,34*S),so=(g.dist*H)%(sh*2);c.strokeStyle="rgba(0,0,0,.35)";c.lineWidth=2;
    for(let y=-sh*2+so,k=0;y<H+sh;y+=sh,k++){c.beginPath();c.moveTo(G.roadX,y);c.lineTo(G.roadX+G.roadW,y);c.stroke();const bw=sh*1.6;for(let x=G.roadX+((k%2)?bw/2:0);x<G.roadX+G.roadW;x+=bw){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+sh);c.stroke()}}
    c.restore();
    c.strokeStyle="rgba(237,227,209,.18)";c.lineWidth=Math.max(3,4*S);c.setLineDash([6,30]);c.lineDashOffset=-(g.dist*H)%36;
    for(let l=1;l<3;l++){c.beginPath();c.moveTo(G.roadX+G.laneW*l,0);c.lineTo(G.roadX+G.laneW*l,H);c.stroke()}c.setLineDash([]);
    for(const o of g.obs){if(o.hit&&o.k==="soul")continue;const oy=G.y0-(o.p-g.dist)*H;const ox=G.roadX+G.laneW*(o.l+.5);if(oy>H+60||oy<-120)continue;
      c.save();if(o.hit)c.globalAlpha=.3;
      if(o.k==="soul"){c.shadowColor="#BFE3EC";c.shadowBlur=18;const r=G.pw*.28;c.beginPath();c.moveTo(ox,oy);c.quadraticCurveTo(ox-r*1.4,oy+r*1.6,ox,oy+r*2.4);c.quadraticCurveTo(ox+r*1.4,oy+r*1.6,ox,oy);fillStroke(c,"#BFE3EC",lw*.8);c.shadowBlur=0}
      else if(o.k==="tomb"){const w=G.pw*.9,h=G.pw*1.15;c.beginPath();c.moveTo(ox-w/2,oy+h);c.lineTo(ox-w/2,oy+w/2);c.arc(ox,oy+w/2,w/2,Math.PI,0);c.lineTo(ox+w/2,oy+h);c.closePath();{const tg=c.createLinearGradient(0,oy,0,oy+h);tg.addColorStop(0,"#7A6870");tg.addColorStop(1,"#3E3238");fillStroke(c,tg,lw)}c.fillStyle="rgba(127,175,106,.35)";c.fillRect(ox-w/2+lw,oy+h*.82,w-lw*2,h*.14);c.fillStyle=INK;c.fillRect(ox-3,oy+w*.45,6,h*.45);c.fillRect(ox-w*.22,oy+w*.6,w*.44,5)}
      else{const w=G.pw*.8,h=G.pw*1.04;c.beginPath();c.moveTo(ox-w*.3,oy);c.lineTo(ox+w*.3,oy);c.lineTo(ox+w*.5,oy+h*.3);c.lineTo(ox+w*.32,oy+h);c.lineTo(ox-w*.32,oy+h);c.lineTo(ox-w*.5,oy+h*.3);c.closePath();{const wg=c.createLinearGradient(ox-w/2,0,ox+w/2,0);wg.addColorStop(0,"#4A2E20");wg.addColorStop(.5,"#7A4E36");wg.addColorStop(1,"#4A2E20");fillStroke(c,wg,lw)}c.fillStyle="#C8102E";c.fillRect(ox-3,oy+h*.2,6,h*.4);c.fillRect(ox-w*.2,oy+h*.32,w*.4,5)}
      c.restore()}
    {const fg=c.createLinearGradient(0,0,0,H*.38);fg.addColorStop(0,"rgba(12,9,11,.95)");fg.addColorStop(1,"rgba(12,9,11,0)");c.fillStyle=fg;c.fillRect(0,0,W,H*.38)}
    const blink=g.crash>0&&Math.floor(g.crash*10)%2===0;if(!blink){drawAvatar(c,U.av,g.x,G.y0+G.ph*.4,G.pw*.46)}};
  return g;
};

/* ---------- VOO DO MORCEGO ---------- */
GAMES.flap=(env,rng)=>{
  const gaps=[];const gapAt=i=>{while(gaps.length<=i)gaps.push(.22+rng()*.56);return gaps[i]};
  const g={score:0,best:0,cur:0,state:"wait",y:0,vy:0,pipes:[],pi:0,spawnX:0,dead:0,t:0,extra:()=>`agora ${g.cur} · melhor ${g.best}`};
  const K=()=>env.H/560;const col=AV.c[avParse(U.av).c];
  function reset(){g.state="wait";g.y=env.H*.45;g.vy=0;g.pipes=[];g.pi=0;g.cur=0;g.spawnX=env.W*.7}
  reset();
  const flap=()=>{if(g.state==="dead")return;if(g.state==="wait")g.state="fly";g.vy=-440*K();noise(.06,.08,900,400)};
  g.down=()=>flap();g.key=(code,down)=>{if(down&&(code==="Space"||code==="ArrowUp"||code==="KeyW"))flap()};
  g.update=dt=>{const k=K(),{W,H}=env,bx=W*.28,r=Math.max(13,20*k),sp=210*k,pw=Math.max(46,72*k),gap=Math.max(120,176*k);g.t+=dt;
    if(g.state==="wait"){g.y=H*.45+Math.sin(g.t*5)*8;return}
    if(g.state==="dead"){g.dead-=dt;g.vy+=1500*k*dt;g.y=Math.min(H-30*k-r,g.y+g.vy*dt);if(g.dead<=0)reset();return}
    g.vy+=1500*k*dt;g.y+=g.vy*dt;
    g.spawnX-=sp*dt;if(g.spawnX<=W){g.pipes.push({x:g.spawnX+pw,i:g.pi,gy:gapAt(g.pi)*(H-30*k),passed:false});g.pi++;g.spawnX+=Math.max(250,330*k)}
    g.pipes.forEach(p=>p.x-=sp*dt);g.pipes=g.pipes.filter(p=>p.x>-pw-10);
    for(const p of g.pipes){if(!p.passed&&p.x+pw/2<bx-r){p.passed=true;g.cur++;if(g.cur>g.best)g.best=g.cur;sfx.ok()}
      if(bx+r*.8>p.x-pw/2&&bx-r*.8<p.x+pw/2&&(g.y-r*.8<p.gy-gap/2||g.y+r*.8>p.gy+gap/2))die()}
    if(g.y+r>H-30*k||g.y-r<0)die();g.score=g.best};
  g.debug=()=>{g.dbg&&g.dbg()};
  function die(){if(g.state!=="fly")return;g.state="dead";g.dead=.9;g.vy=-200*K();sfx.stab();env.shake(8);env.splat(env.W*.28,g.y)}
  g.draw=c=>{const k=K(),{W,H,S}=env,bx=W*.28,r=Math.max(13,20*k),pw=Math.max(46,72*k),gap=Math.max(120,176*k),lw=Math.max(2.5,3*S);
    c.fillStyle="#120B14";c.fillRect(0,0,W,H);c.beginPath();c.arc(W*.8,H*.2,60*k,0,7);c.fillStyle="#EDE3D1";c.shadowColor="#EDE3D1";c.shadowBlur=40;c.fill();c.shadowBlur=0;
    c.fillStyle="#0A060B";for(let i=0;i<8;i++){const x=((i*170-g.t*40)%(W+170)+W+170)%(W+170)-85;c.beginPath();c.moveTo(x-60,H-30*k);c.lineTo(x,H-30*k-120*k-(i%3)*30*k);c.lineTo(x+60,H-30*k);c.fill()}
    const bone=(x,y,w,h)=>{rrect(c,x,y,w,h,8);fillStroke(c,"#D8CCB6",lw);c.strokeStyle="rgba(3,2,3,.25)";c.lineWidth=2;for(let yy=y+14;yy<y+h;yy+=22){c.beginPath();c.moveTo(x+6,yy);c.lineTo(x+w-6,yy);c.stroke()}};
    for(const p of g.pipes){const top=p.gy-gap/2,bot=p.gy+gap/2;bone(p.x-pw/2,-10,pw,top+10);bone(p.x-pw/2,bot,pw,H-bot);
      [[p.x,top-pw*.3],[p.x,bot+pw*.3]].forEach(([sx,sy])=>{c.beginPath();c.arc(sx,sy,pw*.36,0,7);fillStroke(c,"#EDE3D1",lw);c.fillStyle=INK;c.beginPath();c.arc(sx-pw*.13,sy-2,pw*.08,0,7);c.arc(sx+pw*.13,sy-2,pw*.08,0,7);c.fill()})}
    c.fillStyle="#1A1014";c.fillRect(0,H-30*k,W,30*k);c.fillStyle=INK;c.fillRect(0,H-30*k,W,lw);
    c.save();c.translate(bx,g.y);c.rotate(Math.max(-.5,Math.min(1.2,g.vy/900)));const wf=Math.sin(g.t*22)*.6;
    [-1,1].forEach(s=>{c.beginPath();c.moveTo(0,-r*.2);c.quadraticCurveTo(s*r*1.3,-r*(1.1+wf),s*r*2.1,-r*(.2+wf));c.quadraticCurveTo(s*r*1.6,r*.1,s*r*1.2,-r*.05);c.quadraticCurveTo(s*r*.9,r*.4,0,r*.3);c.closePath();fillStroke(c,"#2E2129",lw*.8)});
    c.beginPath();c.arc(0,0,r*.8,0,7);fillStroke(c,col,lw);c.beginPath();c.moveTo(-r*.5,-r*.55);c.lineTo(-r*.35,-r*1.05);c.lineTo(-r*.1,-r*.7);c.moveTo(r*.5,-r*.55);c.lineTo(r*.35,-r*1.05);c.lineTo(r*.1,-r*.7);fillStroke(c,col,lw*.8);
    c.fillStyle="#E3263F";c.beginPath();c.arc(-r*.28,-r*.12,r*.14,0,7);c.arc(r*.28,-r*.12,r*.14,0,7);c.fill();c.fillStyle="#fff";c.beginPath();c.moveTo(-r*.15,r*.3);c.lineTo(-r*.08,r*.55);c.lineTo(0,r*.3);c.moveTo(r*.15,r*.3);c.lineTo(r*.08,r*.55);c.lineTo(0,r*.3);c.fill();
    c.restore();
    if(g.state==="wait"){c.font=FONT(26*Math.max(.8,S));c.fillStyle="#EDE3D1";c.textAlign="center";c.fillText("Toque, clique ou espaço pra voar",W/2,H*.72)}
    g.dbg=()=>{c.strokeStyle="#39FF14";c.lineWidth=2;c.beginPath();c.arc(bx,g.y,r*.8,0,7);c.stroke();c.strokeStyle="#00E5FF";for(const p of g.pipes){c.strokeRect(p.x-pw/2,-10,pw,p.gy-gap/2+10);c.strokeRect(p.x-pw/2,p.gy+gap/2,pw,H)}};
    if(g.state==="dead"){bigText(c,"Esmagado! De novo…",W/2,H*.72,34*Math.max(.8,S),"#E0283F")}};
  return g;
};

/* ---------- EXORCISMO ---------- */
GAMES.meteoro=(env,rng)=>{
  const g={score:0,t:0,a:-Math.PI/2,aim:null,fire:false,cool:0,bul:[],met:[],parts:[],next:.4,inv:0,hits:0,rot:0,extra:()=>`${g.hits} espíritos exorcizados`};
  const RAD=[44,28,16];
  function spawn(){const {W,H,S}=env,cx=W/2,cy=H/2,ang=rng()*Math.PI*2,Rr=Math.hypot(W,H)/2+50;const x=cx+Math.cos(ang)*Rr,y=cy+Math.sin(ang)*Rr;
    const tx=cx+(rng()-.5)*W*.5,ty=cy+(rng()-.5)*H*.5,d=Math.hypot(tx-x,ty-y),sp=(55+rng()*55)*S*(1+g.t/45);
    g.met.push({x,y,vx:(tx-x)/d*sp,vy:(ty-y)/d*sp,lv:0,r:RAD[0]*S,ph:rng()*6,c:["#BFE3EC","#8A6BB0","#7FAF6A"][Math.floor(rng()*3)]})}
  function burst(x,y,c,n){for(let i=0;i<n;i++){const a=Math.random()*7,s=60+Math.random()*180;g.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.5+Math.random()*.4,c})}}
  g.down=(x,y)=>{g.aim=[x,y];g.fire=true};g.move=(x,y)=>{g.aim=[x,y]};g.up=()=>{g.fire=false};
  g.key=(code,down)=>{if(code==="Space")g.fire=down;if(code==="ArrowLeft"||code==="KeyA")g.rot=down?-1:(g.rot===-1?0:g.rot);if(code==="ArrowRight"||code==="KeyD")g.rot=down?1:(g.rot===1?0:g.rot);if(down&&g.rot)g.aim=null};
  g.update=dt=>{const {W,H,S}=env,cx=W/2,cy=H/2;g.t+=dt;g.inv=Math.max(0,g.inv-dt);
    if(g.aim)g.a=Math.atan2(g.aim[1]-cy,g.aim[0]-cx);else g.a+=g.rot*3.6*dt;
    g.cool-=dt;if(g.fire&&g.cool<=0){g.cool=.13;const sp=640*S;g.bul.push({x:cx+Math.cos(g.a)*22*S,y:cy+Math.sin(g.a)*22*S,vx:Math.cos(g.a)*sp,vy:Math.sin(g.a)*sp,l:1.1});tone(1200,.03,"sine",.03)}
    g.next-=dt;if(g.next<=0){spawn();g.next=Math.max(.5,1.35-g.t*.025)}
    g.bul.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt});g.bul=g.bul.filter(b=>b.l>0);g.met.forEach(m=>{m.x+=m.vx*dt;m.y+=m.vy*dt;m.ph+=dt*4});
    for(const b of g.bul){for(const m of g.met){if(m.dead||b.l<=0)continue;if(Math.hypot(b.x-m.x,b.y-m.y)<m.r*.85){b.l=0;m.dead=1;g.hits++;g.score+=[20,50,100][m.lv];burst(m.x,m.y,m.c,10);noise(.12,.12,2400,600);
      if(m.lv<2){const r=RAD[m.lv+1]*S,sp=Math.hypot(m.vx,m.vy)*1.35;const base=Math.atan2(m.vy,m.vx);for(const s of [-.7,.7]){const a=base+s;g.met.push({x:m.x,y:m.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,lv:m.lv+1,r,ph:rng()*6,c:m.c})}}}}}
    const shipR=18*S;for(const m of g.met){if(m.dead)continue;if(g.inv<=0&&Math.hypot(m.x-cx,m.y-cy)<m.r*.8+shipR*.9){m.dead=1;g.inv=1.6;g.score=Math.max(0,g.score-150);burst(cx,cy,"#E3263F",18);sfx.stab();env.shake(12);env.splat(cx,cy)}}
    const lim=Math.hypot(W,H)/2+140;g.met=g.met.filter(m=>!m.dead&&Math.hypot(m.x-cx,m.y-cy)<lim);g.parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt});g.parts=g.parts.filter(p=>p.l>0)};
  g.debug=c=>{const {W,H,S}=env;c.lineWidth=2;c.strokeStyle="#39FF14";c.beginPath();c.arc(W/2,H/2,18*S*.9,0,7);c.stroke();c.strokeStyle="#FF3B3B";for(const m of g.met){c.beginPath();c.arc(m.x,m.y,m.r*.85,0,7);c.stroke()}};
  g.draw=c=>{const {W,H,S}=env,cx=W/2,cy=H/2,lw=Math.max(2.5,3*S);
    c.fillStyle="#08050A";c.fillRect(0,0,W,H);const gl=c.createRadialGradient(cx,cy,10,cx,cy,Math.min(W,H)*.45);gl.addColorStop(0,"rgba(242,193,78,.18)");gl.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=gl;c.fillRect(0,0,W,H);
    c.strokeStyle="rgba(237,227,209,.12)";c.lineWidth=2;c.beginPath();c.arc(cx,cy,90*S,0,7);c.stroke();for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5,b=-Math.PI/2+((i+2)%5)*Math.PI*2/5;c.moveTo(cx+Math.cos(a)*90*S,cy+Math.sin(a)*90*S);c.lineTo(cx+Math.cos(b)*90*S,cy+Math.sin(b)*90*S)}c.stroke();
    {const tt=performance.now()/1000;for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5,x=cx+Math.cos(a)*112*S,y=cy+Math.sin(a)*112*S,h=16*S,w=6*S;c.fillStyle="#D9CDB4";c.fillRect(x-w/2,y-h/2,w,h);
      const fl=1+Math.sin(tt*9+i*2)*.15;const fg=c.createRadialGradient(x,y-h/2-5*S,1,x,y-h/2-5*S,26*S);fg.addColorStop(0,"rgba(242,193,78,.45)");fg.addColorStop(1,"rgba(242,193,78,0)");c.fillStyle=fg;c.fillRect(x-26*S,y-h/2-31*S,52*S,52*S);
      c.fillStyle="#F2C14E";c.beginPath();c.ellipse(x,y-h/2-5*S*fl,3*S,6*S*fl,0,0,7);c.fill()}}
    for(const m of g.met){c.save();c.translate(m.x,m.y);c.globalAlpha=.9;c.shadowColor=m.c;c.shadowBlur=18;
      c.beginPath();c.arc(0,-m.r*.15,m.r*.8,Math.PI,0);for(let i=0;i<=4;i++){const x=m.r*.8-i*m.r*.4;c.lineTo(x,m.r*(.7+Math.sin(m.ph+i)*.15))}c.closePath();fillStroke(c,m.c,lw);c.shadowBlur=0;
      c.fillStyle=INK;c.beginPath();c.ellipse(-m.r*.28,-m.r*.15,m.r*.14,m.r*.2,0,0,7);c.ellipse(m.r*.28,-m.r*.15,m.r*.14,m.r*.2,0,0,7);c.fill();c.beginPath();c.ellipse(0,m.r*.25,m.r*.12,m.r*.18,0,0,7);c.fill();c.restore()}
    c.fillStyle="#F2C14E";for(const b of g.bul){c.beginPath();c.arc(b.x,b.y,4*Math.max(.8,S),0,7);c.fill()}
    for(const p of g.parts){c.globalAlpha=Math.max(0,p.l*1.6);c.fillStyle=p.c;c.fillRect(p.x-3,p.y-3,6,6)}c.globalAlpha=1;
    if(!(g.inv>0&&Math.floor(g.inv*12)%2===0)){drawAvatar(c,U.av,cx,cy,20*S);c.save();c.translate(cx,cy);c.rotate(g.a);c.beginPath();c.moveTo(26*S,-6*S);c.lineTo(40*S,0);c.lineTo(26*S,6*S);c.closePath();fillStroke(c,"#F2C14E",lw*.8);c.restore()}
    if(g.aim){c.strokeStyle="rgba(237,227,209,.5)";c.lineWidth=2;c.beginPath();c.arc(g.aim[0],g.aim[1],10,0,7);c.moveTo(g.aim[0]-15,g.aim[1]);c.lineTo(g.aim[0]+15,g.aim[1]);c.moveTo(g.aim[0],g.aim[1]-15);c.lineTo(g.aim[0],g.aim[1]+15);c.stroke()}};
  return g;
};

/* ---------- motor comum ---------- */
let arcade=null;
function stopArcade(){if(arcade){arcade.stop();arcade=null}}
function runArcade(k,cv,seed,endAt,report){
  const ctx=cv.getContext("2d");
  const env={W:0,H:0,S:1,shakeT:0,shake(n){env.shakeT=.25;env.shakeN=n},splat(x,y){const r=cv.getBoundingClientRect();blood(r.left+x,r.top+y,.45)}};
  function resize(){const r=cv.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);env.W=r.width;env.H=r.height;env.S=Math.min(r.width,r.height)/520;cv.width=Math.round(r.width*dpr);cv.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
  resize();
  const game=GAMES[k](env,mulberry32(seed));
  let raf=0,last=performance.now(),over=false,lastSent=-1,lastSendAt=0,stopped=false;const t0=performance.now();
  const pos=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
  const onDown=e=>{if(over)return;e.preventDefault();cv.setPointerCapture?.(e.pointerId);audio();const [x,y]=pos(e);game.down&&game.down(x,y)};
  const onMove=e=>{if(over)return;const [x,y]=pos(e);game.move&&game.move(x,y)};
  const onUp=()=>{game.up&&game.up()};
  const KEYS=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Space","KeyA","KeyD","KeyW",...[1,2,3,4,5,6,7,8,9].flatMap(n=>["Digit"+n,"Numpad"+n])];
  env.debug=!!U.hitbox;
  const onKey=e=>{if(over||e.target.closest?.("input"))return;if(e.code==="KeyH"&&e.type==="keydown"){env.debug=!env.debug;U.hitbox=env.debug;return}if(KEYS.includes(e.code)){e.preventDefault();if(e.repeat&&e.type==="keydown"&&e.code!=="Space")return;game.key&&game.key(e.code,e.type==="keydown")}};
  cv.addEventListener("pointerdown",onDown);cv.addEventListener("pointermove",onMove);window.addEventListener("pointerup",onUp);
  window.addEventListener("keydown",onKey);window.addEventListener("keyup",onKey);window.addEventListener("resize",resize);
  function hud(left){const {W,S}=env,f=Math.max(.8,Math.min(1.2,S)),h=46*f;
    hudPill(ctx,12,12,h,"pontos",fmt(game.score),"#E9DFCC");
    const ex=game.extra?game.extra():"";if(ex){ctx.save();ctx.font=BODY(12.5*f,800);const w=ctx.measureText(ex).width+20;glass(ctx,12,12+h+6,w,24*f,8*f);ctx.fillStyle="rgba(233,223,204,.8)";ctx.textBaseline="middle";ctx.fillText(ex,22,12+h+6+12*f+1);ctx.restore()}
    timerPill(ctx,W-12,12,h,left,TYPES[k].dur)}
  function send(final){const sc=Math.floor(game.score);if(sc===lastSent&&!final)return;lastSent=sc;lastSendAt=performance.now();report(sc,final)}
  function frame(now){
    if(stopped)return;const dt=Math.max(0,Math.min(.05,(now-last)/1000));last=Math.max(last,now);const left=endAt-now;
    if(!over&&left<=0){over=true;send(true);sfx.end()}
    if(!over)game.update(dt);
    ctx.save();if(env.shakeT>0){env.shakeT-=dt;ctx.translate((Math.random()-.5)*env.shakeN,(Math.random()-.5)*env.shakeN)}
    game.draw(ctx);if(env.debug&&game.debug)game.debug(ctx);ctx.restore();vignette(ctx,env.W,env.H,.55);hud(left);{const st=(now-t0)/1000;if(st<1.1&&!over){ctx.save();ctx.globalAlpha=Math.max(0,1-st/1.1);bigText(ctx,"JÁ!",env.W/2,env.H*.42,Math.round(72*Math.max(.8,Math.min(1.2,env.S))*(1+st*.25)),"#EBC15A");ctx.restore()}}
    if(over){endCard(ctx,env.W,env.H,"Acabou!",fmt(game.score)+" pontos");return}
    if(now-lastSendAt>300)send(false);
    if(left>0&&left<8000&&now-(env.hb||0)>(350+left/8000*650)){env.hb=now;tone(62,.1,"sine",.18)}raf=requestAnimationFrame(frame)}
  raf=requestAnimationFrame(frame);
  return {stop(){stopped=true;cancelAnimationFrame(raf);cv.removeEventListener("pointerdown",onDown);cv.removeEventListener("pointermove",onMove);window.removeEventListener("pointerup",onUp);window.removeEventListener("keydown",onKey);window.removeEventListener("keyup",onKey);window.removeEventListener("resize",resize);if(!over)send(true)},toggleDebug(){env.debug=!env.debug;U.hitbox=env.debug}};
}
function sendArcadeScore(sc){
  const V=U.V;if(!V||V.ph!=="play")return;U.arcScore=sc;
  if(U.mode==="guest"){U.ak++;U.tbl.presence({ans:{r:V.rid,v:sc,k:U.ak}}).catch(()=>{})}
  else onAnswer(U.myId,sc,"");
}
