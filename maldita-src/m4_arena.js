/* ============================================================
   ARENA: mapa compartilhado, câmera que segue o jogador, minimapa,
   habilidades e visualização de hitbox (tecla H)
   ============================================================ */
const WW=1600,WH=1000,CX=800,CY=500,PR=20;
/* Hitboxes: todas as interações usam estes valores. O círculo do jogador (PR) é a cabeça do avatar. */
const HB={catch:PR*2+6,player:PR,pickup:PR+16,steal:PR*2+4,knock:PR*2+30,shock:170,trap:38,altar:46,plate:26,sym:18,relic:PR+14,creature:{rx:22,ry:46,oy:-4}};
const dist=(a,b,c,d)=>Math.hypot(a-c,b-d);
function ringPos(i,n,rx=380,ry=260){const a=-Math.PI/2+i/Math.max(1,n)*Math.PI*2;return [CX+Math.cos(a)*rx,CY+Math.sin(a)*ry]}
function collideRect(o,r,rc){const nx=clamp(o.x,rc.x,rc.x+rc.w),ny=clamp(o.y,rc.y,rc.y+rc.h),dx=o.x-nx,dy=o.y-ny,d2=dx*dx+dy*dy;
  if(d2<r*r){if(d2===0){const l=o.x-rc.x,rr=rc.x+rc.w-o.x,t=o.y-rc.y,b=rc.y+rc.h-o.y,m=Math.min(l,rr,t,b);if(m===l)o.x=rc.x-r;else if(m===rr)o.x=rc.x+rc.w+r;else if(m===t)o.y=rc.y-r;else o.y=rc.y+rc.h+r}
    else{const d=Math.sqrt(d2);o.x=nx+dx/d*r;o.y=ny+dy/d*r}return true}return false}
const circleHitsRect=(x,y,r,rc)=>{const nx=clamp(x,rc.x,rc.x+rc.w),ny=clamp(y,rc.y,rc.y+rc.h);return (x-nx)**2+(y-ny)**2<r*r};
const inRect=(x,y,r)=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h;
const circleHitsEllipse=(x,y,r,ex,ey,rx,ry)=>((x-ex)/(rx+r))**2+((y-ey)/(ry+r))**2<=1;
function moveToward(b,tx,ty,sp,dt,walls){const d=dist(b.x,b.y,tx,ty);if(d>2){const s=Math.min(d,sp*dt);b.x+=(tx-b.x)/d*s;b.y+=(ty-b.y)/d*s;b.a=Math.atan2(ty-b.y,tx-b.x)}
  if(walls)walls.forEach(w=>collideRect(b,PR,w));b.x=clamp(b.x,PR,WW-PR);b.y=clamp(b.y,PR,WH-PR);return d}
const angDiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return Math.abs(d)};
function freeSpot(r,walls,pad=40){for(let i=0;i<40;i++){const x=pad+r()*(WW-2*pad),y=pad+r()*(WH-2*pad);if(!walls.some(w=>circleHitsRect(x,y,PR+10,w)))return [x,y]}return [CX,CY]}

/* ---------- mapas ---------- */
const COROA_WALLS=[{x:470,y:290,w:90,h:90},{x:1040,y:290,w:90,h:90},{x:470,y:620,w:90,h:90},{x:1040,y:620,w:90,h:90},{x:740,y:60,w:120,h:40},{x:740,y:900,w:120,h:40},{x:690,y:440,w:40,h:120},{x:870,y:440,w:40,h:120}];
function naoOlheMap(seed){const r=mulberry32(seed^0x5bd1);const t=[];for(let i=0;i<30;i++){const w=28+r()*32,h=38+r()*28;t.push({x:240+r()*1100,y:50+r()*(WH-100-h),w,h})}return t}
const REL={
  walls:[{x:560,y:300,w:180,h:36},{x:860,y:300,w:180,h:36},{x:560,y:664,w:180,h:36},{x:860,y:664,w:180,h:36},{x:560,y:336,w:36,h:110},{x:560,y:554,w:36,h:110},{x:1004,y:336,w:36,h:110},{x:1004,y:554,w:36,h:110},
    {x:300,y:330,w:32,h:340},{x:1268,y:330,w:32,h:340},{x:780,y:170,w:40,h:90},{x:780,y:740,w:40,h:90},{x:520,y:200,w:60,h:40},{x:1020,y:200,w:60,h:40},{x:520,y:760,w:60,h:40},{x:1020,y:760,w:60,h:40}],
  gates:[{x:740,y:300,w:120,h:36},{x:740,y:664,w:120,h:36}],
  plates:[{x:300,y:110,i:0},{x:1300,y:110,i:0},{x:300,y:890,i:1},{x:1300,y:890,i:1}],
  traps:[{x:465,y:446,w:95,h:108},{x:1040,y:446,w:95,h:108}],
  levers:[{x:210,y:500,i:0},{x:1390,y:500,i:1}]
};
function relWalls(g){return REL.walls.concat(REL.gates.filter((_,i)=>g&&g[i]===0))}
const ALTAR_WALLS=[{x:640,y:380,w:50,h:50},{x:910,y:380,w:50,h:50},{x:640,y:570,w:50,h:50},{x:910,y:570,w:50,h:50}];
function altarPos(i,n){return ringPos(i,n,640,380)}
function relAltar(i,n){return ringPos(i,n,700,420)}
const LIGHT_SCHED=(seed)=>{const r=mulberry32(seed^0x77);const seg=[{s:0,e:2.2,c:"g"}];let t=2.2,c="r";while(t<80){const d=(1.3+r()*1.9)*Math.max(.45,1-t/55);seg.push({s:t,e:t+d,c});t+=d;c=c==="r"?"g":"r"}return seg};
const lightAt=(sched,t)=>{for(const s of sched)if(t<s.e)return s;return sched[sched.length-1]};
const LUZ={x0:110,x1:1490};
function laneY(i,n){return n<=1?CY:150+i*(WH-230)/(n-1)}
const CHAO={c:12,r:8,x0:140,y0:80,tw:110,th:105,wave:4.2};
function chaoPatterns(seed){const r=mulberry32(seed^0x33);return [0,1,2].map(()=>{const f=new Set();for(let i=0;i<CHAO.c*CHAO.r;i++)if(r()<.36)f.add(i);return f})}
function chaoState(t){t=Math.max(0,t);const w=Math.floor(t/CHAO.wave),ph=t-w*CHAO.wave;return {p:w%3,tremble:ph>=3.0&&ph<3.6,down:ph>=3.6}}
const chaoTile=(x,y)=>{const ci=Math.floor((x-CHAO.x0)/CHAO.tw),ri=Math.floor((y-CHAO.y0)/CHAO.th);if(ci<0||ri<0||ci>=CHAO.c||ri>=CHAO.r)return -1;return ri*CHAO.c+ci};
function circleZones(seed){const r=mulberry32(seed^0x91);const out=[[{x:CX,y:CY,rx:330,ry:330}]];for(let i=1;i<20;i++){const k=Math.floor(r()*4);
  if(k===0){const rr=160+r()*130;out.push([{x:rr+60+r()*(WW-2*rr-120),y:rr+40+r()*Math.max(10,WH-2*rr-80),rx:rr,ry:rr}])}
  else if(k===1){const rx=260+r()*120,ry=110+r()*60;out.push([{x:rx+40+r()*(WW-2*rx-80),y:180+r()*640,rx,ry}])}
  else{const n=k;const z=[];for(let j=0;j<n;j++){const rr=n===2?120+r()*35:95+r()*30;z.push({x:180+r()*1240,y:160+r()*680,rx:rr,ry:rr})}out.push(z)}}return out}
function zoneAt(Z,t){t=Math.max(0,t);const i=Math.min(Z.length-1,Math.floor(t/5)),f=clamp((t-i*5)/1.2,0,1),cur=Z[i],prev=Z[Math.max(0,i-1)];if(i===0||f>=1)return cur;
  const e=f*f*(3-2*f);return cur.map((z,j)=>{const p=prev[j%prev.length];return {x:p.x+(z.x-p.x)*e,y:p.y+(z.y-p.y)*e,rx:p.rx+(z.rx-p.rx)*e,ry:p.ry+(z.ry-p.ry)*e}})}
const inZone=(zs,x,y)=>zs.some(z=>((x-z.x)/z.rx)**2+((y-z.y)/z.ry)**2<=1);
const CACADA_WALLS=[{x:250,y:180,w:200,h:40},{x:250,y:180,w:40,h:180},{x:1150,y:180,w:200,h:40},{x:1310,y:180,w:40,h:180},{x:250,y:780,w:200,h:40},{x:250,y:640,w:40,h:180},{x:1150,y:780,w:200,h:40},{x:1310,y:640,w:40,h:180},
  {x:700,y:300,w:200,h:40},{x:700,y:660,w:200,h:40},{x:560,y:440,w:40,h:120},{x:1000,y:440,w:40,h:120},{x:780,y:60,w:40,h:120},{x:780,y:820,w:40,h:120}];
const COROA_MAPS=[COROA_WALLS,
  [{x:780,y:280,w:40,h:140},{x:780,y:580,w:40,h:140},{x:580,y:480,w:140,h:40},{x:880,y:480,w:140,h:40},{x:230,y:140,w:80,h:80},{x:1290,y:140,w:80,h:80},{x:230,y:780,w:80,h:80},{x:1290,y:780,w:80,h:80},{x:520,y:250,w:40,h:40},{x:1040,y:250,w:40,h:40},{x:520,y:710,w:40,h:40},{x:1040,y:710,w:40,h:40}],
  [{x:430,y:330,w:56,h:56},{x:600,y:430,w:56,h:56},{x:772,y:300,w:56,h:56},{x:944,y:430,w:56,h:56},{x:1114,y:330,w:56,h:56},{x:430,y:614,w:56,h:56},{x:772,y:644,w:56,h:56},{x:1114,y:614,w:56,h:56},{x:680,y:540,w:240,h:34}]];
const CACADA_MAPS=[CACADA_WALLS,
  [{x:200,y:180,w:500,h:36},{x:900,y:180,w:500,h:36},{x:200,y:784,w:500,h:36},{x:900,y:784,w:500,h:36},{x:782,y:380,w:36,h:240},{x:420,y:430,w:36,h:140},{x:1144,y:430,w:36,h:140},{x:80,y:430,w:36,h:140},{x:1484,y:430,w:36,h:140}],
  [{x:280,y:140,w:36,h:220},{x:1284,y:140,w:36,h:220},{x:280,y:640,w:36,h:220},{x:1284,y:640,w:36,h:220},{x:600,y:360,w:120,h:36},{x:880,y:360,w:120,h:36},{x:600,y:604,w:120,h:36},{x:880,y:604,w:120,h:36},{x:760,y:470,w:80,h:60}]];
const MAP_NAMES={coroa:["Salão dos pilares","Cripta em cruz","Colunata"],cacada:["Cemitério murado","Corredores","Capela partida"]};
const mapName=(k,seed)=>MAP_NAMES[k]?MAP_NAMES[k][(seed>>>0)%MAP_NAMES[k].length]:"";
const coroaWalls=seed=>COROA_MAPS[(seed>>>0)%COROA_MAPS.length];
const cacadaWalls=seed=>CACADA_MAPS[(seed>>>0)%CACADA_MAPS.length];
const MAP_WALLS={cacada:()=>CACADA_WALLS,coroa:()=>COROA_WALLS,reliquia:g=>relWalls(g),altar:()=>ALTAR_WALLS};

/* ============================================================
   HABILIDADES (runas no mapa)
   ============================================================ */
const ABIL={
  speed:{n:"Sprint Sombrio",c:"#E8772E",g:"»",d:"Corre 60% mais rápido por 3 s"},
  ghost:{n:"Névoa",c:"#7FB7C9",g:"~",d:"Vira névoa por 3,5 s: atravessa gente, não cai, não é pego nem empurrado"},
  shock:{n:"Grito",c:"#E3263F",g:"!",d:"Empurra todo mundo perto. Derruba a relíquia e assusta a criatura"},
  blink:{n:"Salto Sombrio",c:"#8A6BB0",g:"↯",d:"Teleporta um pouco pra frente"},
  trap:{n:"Poça de Sangue",c:"#8E0A1F",g:"●",d:"Deixa uma poça que prende quem pisar"}
};
const ABIL_KEYS=Object.keys(ABIL);
const ABIL_GAMES=new Set(["cacada","coroa","reliquia","chao","circulo","naoolhe","altar"]);
function isGhost(w,p){return !!(p&&(p.g||(w.ab&&w.ab.ghost[p.id]>w.t)))}
function abInit(w,R){const r=mulberry32(R.d.seed^0xab);w.ab={pk:[],own:{},fx:[],k:0,next:2,lastK:{},ghost:{},r,useT:{}};return w}
function abSpot(w){const k=w.k;const r=w.ab.r;
  if(k==="chao"){const ti=Math.floor(r()*CHAO.c*CHAO.r);return [CHAO.x0+(ti%CHAO.c+.5)*CHAO.tw,CHAO.y0+(Math.floor(ti/CHAO.c)+.5)*CHAO.th]}
  const walls=k==="naoolhe"?w.tomb:w.walls||(MAP_WALLS[k]?MAP_WALLS[k](w.g):[]);return freeSpot(r,walls,80)}
function abTick(w,dt,pl,hooks={}){
  const A=w.ab;if(!A)return;
  A.next-=dt;if(A.next<=0&&A.pk.length<4){const [x,y]=abSpot(w);A.pk.push({id:++A.k,x,y,t:ABIL_KEYS[Math.floor(A.r()*ABIL_KEYS.length)]});A.next=4.5+A.r()*3}
  for(const p of pl){if(A.own[p.id]||p.hid)continue;const i=A.pk.findIndex(q=>dist(q.x,q.y,p.x,p.y)<HB.pickup);if(i>=0){A.own[p.id]=A.pk[i].t;A.pk.splice(i,1);if(p.bot)A.useT[p.id]=.8+Math.random()*2}}
  const use=(p,s,x,y)=>{
    if(s==="shock"){A.fx.push({k:++A.k,t:"shock",x,y,by:p.id,ttl:.7});
      for(const id in w.b){if(id===p.id)continue;const b=w.b[id];const d=dist(b.x,b.y,x,y);if(d<HB.shock&&!isGhost(w,{id})){b.x+=(b.x-x)/(d||1)*160;b.y+=(b.y-y)/(d||1)*160;b.x=clamp(b.x,PR,WW-PR);b.y=clamp(b.y,PR,WH-PR);b.stun=.6}}
      hooks.shock&&hooks.shock(x,y,p.id)}
    else if(s==="trap")A.fx.push({k:++A.k,t:"trap",x,y,by:p.id,ttl:9,hit:{}});
    else if(s==="ghost")A.ghost[p.id]=w.t+3.5;
    else if(s==="speed"&&w.b[p.id])w.b[p.id].boost=3;
    else if(s==="blink"&&w.b[p.id]){const b=w.b[p.id];b.x=clamp(b.x+Math.cos(b.a||0)*200,PR,WW-PR);b.y=clamp(b.y+Math.sin(b.a||0)*200,PR,WH-PR)}};
  for(const p of pl){if(p.bot||!p.ev)continue;const lk=A.lastK[p.id]||0;let mk=lk;
    for(const e of p.ev){if(!e||e.k<=lk)continue;mk=Math.max(mk,e.k);if(e.t==="sk"&&A.own[p.id]===e.s){delete A.own[p.id];use(p,e.s,+e.x||p.x,+e.y||p.y)}}A.lastK[p.id]=mk}
  for(const id in w.b){const s=A.own[id];if(!s)continue;A.useT[id]=(A.useT[id]||1)-dt;if(A.useT[id]<=0){const b=w.b[id];delete A.own[id];use({id,x:b.x,y:b.y},s,b.x,b.y)}}
  for(const f of A.fx){f.ttl-=dt;if(f.t==="trap")for(const id in w.b){if(id===f.by||f.hit[id])continue;const b=w.b[id];if(dist(b.x,b.y,f.x,f.y)<HB.trap+PR*.5&&!isGhost(w,{id})){f.hit[id]=1;b.stun=.9}}}
  A.fx=A.fx.filter(f=>f.ttl>0);
}
function abPub(w){const A=w.ab;if(!A)return null;return {pk:A.pk.map(q=>[q.id,Math.round(q.x),Math.round(q.y),q.t]),own:A.own,fx:A.fx.map(f=>[f.k,f.t,Math.round(f.x),Math.round(f.y),f.by,Math.round(f.ttl*10)/10]),gh:Object.keys(A.ghost).filter(id=>A.ghost[id]>w.t)}}
function botSpeed(b,base,dt){b.stun=Math.max(0,(b.stun||0)-dt);b.boost=Math.max(0,(b.boost||0)-dt);return b.stun>0?0:base*botLv().sp*(b.boost>0?1.6:1)}

/* ============================================================
   LÓGICA DO MESTRE PARA AS ARENAS
   ============================================================ */
function mkBots(R,place){const b={};activePlayers().filter(p=>p.bot).forEach(p=>{const i=R.d.sl[p.id]??0,n=Object.keys(R.d.sl).length;const [x,y]=place(i,n);b[p.id]={x,y,a:0,d:0,tx:x,ty:y,t:0,st:0}});return b}
function separateBots(b,pl){const ids=Object.keys(b);for(let i=0;i<ids.length;i++){const p=b[ids[i]];if(p.hid)continue;
  for(let j=i+1;j<ids.length;j++){const q=b[ids[j]];const d=dist(p.x,p.y,q.x,q.y);if(d<PR*2&&d>0){const m=(PR*2-d)/2;const ux=(p.x-q.x)/d,uy=(p.y-q.y)/d;p.x+=ux*m;p.y+=uy*m;q.x-=ux*m;q.y-=uy*m}else if(d===0){p.x+=3}}
  for(const o of pl){if(o.bot)continue;const d=dist(p.x,p.y,o.x,o.y);if(d<PR*2&&d>0){const m=PR*2-d;p.x+=(p.x-o.x)/d*m;p.y+=(p.y-o.y)/d*m}}}}
const packBots=(w)=>{const o={};for(const id in w.b){const q=w.b[id];o[id]=[Math.round(q.x),Math.round(q.y),Math.round((q.a||0)*100)/100,q.d||0,q.hid?1:0,isGhost(w,{id})?1:0,q.car??-1]}return o};
const withAb=(w,o)=>{const a=abPub(w);if(a)o.ab=a;return o};

const ARENA_HOST={
  generic:{
    init(R){const k=R.k,w={t:0,k,b:{}};const n=Object.keys(R.d.sl||{}).length;
      w.b=mkBots(R,(i)=>k==="luz"?[LUZ.x0,laneY(i,n)]:k==="chao"?[CHAO.x0+CHAO.tw*(i%CHAO.c+.5),CHAO.y0+CHAO.th*(Math.floor(i/CHAO.c)%CHAO.r+.5)]:ringPos(i,n,220,160));
      if(k==="luz")w.sched=LIGHT_SCHED(R.d.seed);if(k==="circulo")w.Z=circleZones(R.d.seed);if(k==="chao")w.P=chaoPatterns(R.d.seed);
      if(k==="cabo"){w.f={};w.rope=0;for(const id in w.b)w.b[id].next=1+Math.random()*1.5}
      if(ABIL_GAMES.has(k))abInit(w,R);
      return w},
    tick(w,dt,pl){w.t+=dt;
      for(const id in w.b){const b=w.b[id];b.t-=dt;
        if(w.k==="luz"){const L=lightAt(w.sched,w.t);if(b.x<LUZ.x1&&((L.c==="r"&&Math.random()>.03)||(L.c==="g"&&w.t-L.s<.25&&Math.random()<.5/botLv().m)))b.x+=170*botLv().sp*dt;b.a=0}
        else if(w.k==="circulo"){const z=zoneAt(w.Z,w.t);const zz=z[Object.keys(w.b).indexOf(id)%z.length];if(b.t<=0){b.tx=zz.x+(Math.random()-.5)*zz.rx;b.ty=zz.y+(Math.random()-.5)*zz.ry;b.t=.8+Math.random()}moveToward(b,b.tx,b.ty,botSpeed(b,200,dt),dt)}
        else if(w.k==="cabo"){b.next-=dt;if(b.next<=0){b.next=(1.3+Math.random()*1.2)/botLv().m;const f=w.f[id]||(w.f[id]={pu:0,er:0});if(Math.random()<.12)f.er++;else f.pu++}}
        else{if(b.t<=0){b.tx=CHAO.x0+40+Math.random()*(CHAO.c*CHAO.tw-80);b.ty=CHAO.y0+40+Math.random()*(CHAO.r*CHAO.th-80);b.t=1+Math.random()*2}
          if(w.k==="chao"){const s=chaoState(w.t);b.hid=!isGhost(w,{id})&&s.down&&w.P[s.p].has(chaoTile(b.x,b.y))}
          moveToward(b,b.tx,b.ty,botSpeed(b,180,dt),dt)}}
      if(w.k!=="luz"&&w.k!=="cabo")separateBots(w.b,[]);
      if(w.ab)abTick(w,dt,pl);
      if(w.k==="cabo"){const S=H.round.d.sides,F=[0,0],N=[0,0];for(const id in S){const f=w.f[id]||{pu:0,er:0};F[S[id]]+=f.pu-.6*f.er;N[S[id]]++}
        const a0=N[0]?F[0]/N[0]:0,a1=N[1]?F[1]/N[1]:0;w.rope=clamp((a0-a1)*.1,-1,1);if(Math.abs(w.rope)>=1&&!w.done){w.done=1;w.end=true}}},
    pub(w){const o={b:packBots(w)};if(w.k==="cabo"){o.rope=Math.round(w.rope*1000)/1000;o.f={};for(const id in w.f)o.f[id]=[w.f[id].pu,w.f[id].er]}return withAb(w,o)}
  },
  coroa:{
    init(R){const n=Object.keys(R.d.sl).length;const ids=activePlayers().map(p=>p.id);const w={t:0,k:"coroa",walls:coroaWalls(R.d.seed),h:ids[rnd(ids.length)]||null,im:1.5,s:{},b:mkBots(R,(i)=>ringPos(i,n,560,360))};return abInit(w,R)},
    tick(w,dt,pl){w.t+=dt;w.im=Math.max(0,w.im-dt);
      const hp=pl.find(p=>p.id===w.h);if(!hp&&pl.length)w.h=pl[rnd(pl.length)].id;
      if(hp){w.s[w.h]=(w.s[w.h]||0)+dt*10;
        if(w.im<=0&&!isGhost(w,hp))for(const p of pl){if(p.id!==w.h&&!isGhost(w,p)&&dist(p.x,p.y,hp.x,hp.y)<HB.steal){w.ev=[p.id,w.h,(w.evk=(w.evk||0)+1),"st"];w.h=p.id;w.im=1.3;w.stl=(w.stl||0)+1;break}}}
      for(const id in w.b){const b=w.b[id];const h=pl.find(p=>p.id===w.h);const sp=botSpeed(b,id===w.h?205:215,dt);
        if(id===w.h){let near=null,nd=1e9;for(const p of pl){if(p.id===id)continue;const d=dist(p.x,p.y,b.x,b.y);if(d<nd){nd=d;near=p}}
          if(near){if(b.t<=0||dist(b.x,b.y,b.tx,b.ty)<20){b.tx=clamp(b.x+(b.x-near.x)+(Math.random()-.5)*300,60,WW-60);b.ty=clamp(b.y+(b.y-near.y)+(Math.random()-.5)*300,60,WH-60);b.t=.7}}
          b.t-=dt;moveToward(b,b.tx,b.ty,sp,dt,w.walls)}
        else if(h)moveToward(b,h.x,h.y,sp,dt,w.walls)}
      separateBots(w.b,pl);abTick(w,dt,pl)},
    pub(w){const s={};for(const id in w.s)s[id]=Math.round(w.s[id]);return withAb(w,{h:w.h,im:w.im>0?1:0,s,st:w.stl||0,ev:w.ev,b:packBots(w)})},
    final(w,act){act.forEach(p=>{p.v=Math.round(w.s[p.id]||0);p.rv=`${Math.round((w.s[p.id]||0)/10)} s de rei`})}
  },
  naoolhe:{
    init(R){const n=Object.keys(R.d.sl).length;const w={t:0,k:"naoolhe",cx:1150,cy:CY,seen:0,pause:0,cg:{},fin:{},prog:{},b:mkBots(R,(i)=>[70,laneY(i,n)]),tomb:naoOlheMap(R.d.seed)};return abInit(w,R)},
    tick(w,dt,pl){w.t+=dt;w.pause=Math.max(0,w.pause-dt);const C=HB.creature;
      for(const id in w.b){const b=w.b[id];if(w.fin[id])continue;b.t-=dt;if(b.t<=0){b.ty=clamp(b.y+(Math.random()-.5)*200,50,WH-50);b.t=1+Math.random()}
        moveToward(b,b.x+100,b.ty,botSpeed(b,110,dt),dt,w.tomb);const dc=dist(b.x,b.y,w.cx,w.cy);b.a=dc<420&&Math.sin(w.t*.7+b.y)>-.2?Math.atan2(w.cy-b.y,w.cx-b.x):0;
        if(b.x>=1480)w.fin[id]=w.t;w.prog[id]=w.fin[id]?2000+Math.round((H.round.dur/1000-w.fin[id])*10):Math.round(clamp((b.x-70)/1410,0,1)*1000)}
      const live=pl.filter(p=>!w.fin[p.id]&&p.x<1480);
      w.seen=live.some(p=>dist(p.x,p.y,w.cx,w.cy)<520&&angDiff(p.a||0,Math.atan2(w.cy-p.y,w.cx-p.x))<.42)?1:0;
      const hunt=live.filter(p=>!isGhost(w,p));
      if(!w.seen&&w.pause<=0&&hunt.length){let t=null,td=1e9;for(const p of hunt){const d=dist(p.x,p.y,w.cx,w.cy);if(d<td){td=d;t=p}}
        const sp=150+Math.min(110,w.t*2.4);if(td>1){w.cx+=(t.x-w.cx)/td*sp*dt;w.cy+=(t.y-w.cy)/td*sp*dt}
        if(circleHitsEllipse(t.x,t.y,PR,w.cx,w.cy+C.oy,C.rx,C.ry)){w.cg[t.id]=(w.cg[t.id]||0)+1;if(w.b[t.id]){w.b[t.id].x=70}w.pause=.8;w.cx=clamp(t.x+380,400,1450);w.cy=clamp(WH-t.y,80,WH-80)}}
      abTick(w,dt,pl,{shock:(x,y)=>{const d=dist(x,y,w.cx,w.cy);if(d<HB.shock+80){w.cx=clamp(w.cx+(w.cx-x)/(d||1)*240,60,WW-60);w.cy=clamp(w.cy+(w.cy-y)/(d||1)*240,60,WH-60);w.pause=1.4}}})},
    pub(w){return withAb(w,{cx:Math.round(w.cx),cy:Math.round(w.cy),sn:w.seen,cg:w.cg,b:packBots(w)})},
    final(w,act){act.forEach(p=>{if(p.bot){p.v=w.prog[p.id]||0;p.rv=p.v>=2000?"escapou":`${Math.round(p.v/10)}%`}})}
  },
  altar:{
    init(R){const n=Object.keys(R.d.sl).length;const r=mulberry32(R.d.seed^0xa1);const al={};
      for(const id in R.d.sl)al[id]={q:Array.from({length:4},()=>Math.floor(r()*4)).join(""),p:0,d:0,cd:0};
      const w={t:0,k:"altar",al,lastK:{},b:mkBots(R,(i)=>altarPos(i,n))};for(const id in w.b)Object.assign(w.b[id],{st:0,car:-1,tgt:null});return abInit(w,R)},
    tick(w,dt,pl){w.t+=dt;const n=Object.keys(H.round.d.sl).length;
      for(const id in w.al)w.al[id].cd=Math.max(0,w.al[id].cd-dt);
      const newQ=(a)=>{a.q=Array.from({length:4},()=>rnd(4)).join("");a.p=0};
      const apply=(from,e)=>{const a=w.al[from];if(!a)return;
        if(e.t==="pl"&&a.q[a.p]==String(e.s)){a.p++;if(a.p>=4){a.d++;newQ(a)}}
        else if(e.t==="sb"&&w.al[e.to]&&e.to!==from){const t=w.al[e.to];if(t.cd<=0&&t.p>0){t.p--;t.cd=2}}};
      for(const p of pl){if(!p.ev||p.bot)continue;const lk=w.lastK[p.id]||0;let mk=lk;for(const e of p.ev){if(!e||e.k<=lk)continue;mk=Math.max(mk,e.k);if(e.t==="pl"||e.t==="sb")apply(p.id,e)}w.lastK[p.id]=mk}
      for(const id in w.b){const b=w.b[id],a=w.al[id];if(!a)continue;b.t-=dt;const i=H.round.d.sl[id];const sp=botSpeed(b,185,dt);
        if(b.st===0){if(!b.tgt||b.t<=0){b.tgt=freeSpot(Math.random,ALTAR_WALLS,90);b.t=2.6+Math.random()*2.4}moveToward(b,b.tgt[0],b.tgt[1],sp,dt,ALTAR_WALLS);
          if(dist(b.x,b.y,b.tgt[0],b.tgt[1])<12||b.t<=0){b.car=Math.random()<.8?+a.q[a.p]:rnd(4);b.st=1;const rivals=Object.keys(w.al).filter(x=>x!==id);b.dest=b.car!==+a.q[a.p]&&rivals.length?rivals[rnd(rivals.length)]:id}}
        else{const di=H.round.d.sl[b.dest];const [tx,ty]=altarPos(di??i,n);if(moveToward(b,tx,ty,sp,dt,ALTAR_WALLS)<HB.altar){apply(id,b.dest===id?{t:"pl",s:b.car}:{t:"sb",to:b.dest});b.st=0;b.car=-1;b.tgt=null}}}
      separateBots(w.b,pl);abTick(w,dt,pl)},
    pub(w){const al={};for(const id in w.al){const a=w.al[id];al[id]=[a.p,a.d,a.q]}return withAb(w,{al,b:packBots(w)})},
    final(w,act){act.forEach(p=>{const a=w.al[p.id];if(!a)return;p.v=(a.d*4+a.p)*100;p.rv=`${a.d} altar${a.d===1?"":"es"} · ${a.p}/4 selos`})}
  },
  cacada:{
    init(R){const ids=Object.keys(R.d.sl);const n=ids.length;const w={t:0,k:"cacada",walls:cacadaWalls(R.d.seed),inf:{},cat:{},ev:null,evk:0,b:mkBots(R,(i)=>ringPos(i,n,480,250))};
      shuffle(ids).slice(0,Math.min(n>=9?2:1,Math.max(1,n-1))).forEach(id=>{w.inf[id]=0});return abInit(w,R)},
    tick(w,dt,pl){w.t+=dt;w.seen=w.seen||{};for(const p of pl)w.seen[p.id]=w.t;
      const hunters=pl.filter(p=>w.inf[p.id]!==undefined),surv=pl.filter(p=>w.inf[p.id]===undefined);
      for(const p of hunters){if(isGhost(w,p)||w.t-w.inf[p.id]<(w.inf[p.id]===0?1.5:1.8))continue;
        for(const q of pl){if(w.inf[q.id]!==undefined||isGhost(w,q))continue;if(dist(p.x,p.y,q.x,q.y)<HB.catch){w.inf[q.id]=w.t;w.cat[p.id]=(w.cat[p.id]||0)+1;w.ev=[q.id,p.id,++w.evk];if(w.b[q.id])w.b[q.id].stun=1.1}}}
      for(const id in w.b){const b=w.b[id];b.t-=dt;const bx=b.x,by=b.y;let sp;
        if(w.inf[id]!==undefined){sp=botSpeed(b,196,dt);let tg=null,td=1e9;for(const q of surv){if(isGhost(w,q))continue;const dd=dist(q.x,q.y,b.x,b.y);if(dd<td){td=dd;tg=q}}
          if(tg)moveToward(b,tg.x,tg.y,sp,dt,w.walls);else moveToward(b,CX,CY,sp*.5,dt,w.walls)}
        else{sp=botSpeed(b,206,dt);let near=null,nd=1e9;for(const q of hunters){const dd=dist(q.x,q.y,b.x,b.y);if(dd<nd){nd=dd;near=q}}
          if(near&&nd<480){if(b.t<=0||dist(b.x,b.y,b.tx,b.ty)<24){b.tx=clamp(b.x+(b.x-near.x)*1.6+(Math.random()-.5)*320,60,WW-60);b.ty=clamp(b.y+(b.y-near.y)*1.6+(Math.random()-.5)*320,60,WH-60);b.t=.6}}
          else if(b.t<=0||b.tx===undefined){[b.tx,b.ty]=freeSpot(Math.random,w.walls,80);b.t=2+Math.random()*2}
          moveToward(b,b.tx,b.ty,sp,dt,w.walls)}
        if(sp>0&&dist(bx,by,b.x,b.y)<sp*dt*.3){b.ax=(b.ax||0)+dt;if(b.ax>.35){b.t=0;b.y+=(b.y<CY?-1:1)*120*dt;b.x+=(b.x<CX?-1:1)*60*dt}}else b.ax=0}
      separateBots(w.b,pl);for(const id in w.b)w.walls.forEach(wl=>collideRect(w.b[id],PR,wl));abTick(w,dt,pl);
      if(pl.length>1&&pl.every(p=>w.inf[p.id]!==undefined)&&!w.done){w.done=1;w.end=true}},
    pub(w){const inf={};for(const id in w.inf)inf[id]=w.cat[id]||0;return withAb(w,{inf,ev:w.ev,b:packBots(w)})},
    final(w,act){let last=null,lt=-1;for(const id in w.inf)if(w.inf[id]>lt){lt=w.inf[id];last=id}const allIn=act.filter(p=>!p.off).every(p=>w.inf[p.id]!==undefined);
      act.forEach(p=>{const ti=w.inf[p.id],c=w.cat[p.id]||0,alive=ti===undefined?w.t:ti;if(ti===undefined&&!((w.seen||{})[p.id]>=w.t-1.5)){p.v=0;p.rv=p.off?"fugiu":"não jogou";return}const lastOne=allIn&&p.id===last&&lt>0;p.v=1+Math.round(alive*10)+c*250+(ti===undefined?1500:0)+(lastOne?600:0);
      p.rv=ti===undefined?"sobreviveu":lastOne?`último vivo · ${Math.round(alive)} s`:ti===0?`${c} captura${c===1?"":"s"}`:`${Math.round(alive)} s vivo · ${c} capt.`})}
  },
  reliquia:{
    init(R){const n=Object.keys(R.d.sl).length;const w={t:0,k:"reliquia",rel:{c:null,x:CX,y:CY,lk:null,lu:0},del:{},hold:{},g:[1,1],gc:[0,0],tr:[0,0],trc:[0,0],lastK:{},lastD:{},b:mkBots(R,(i)=>relAltar(i,n))};return abInit(w,R)},
    tick(w,dt,pl){w.t+=dt;const R=H.round,n=Object.keys(R.d.sl).length,rel=w.rel;
      [0,1].forEach(i=>{w.gc[i]=Math.max(0,w.gc[i]-dt);w.tr[i]=Math.max(0,w.tr[i]-dt);w.trc[i]=Math.max(0,w.trc[i]-dt)});
      for(const p of pl){if(!p.ev||p.bot)continue;const lk=w.lastK[p.id]||0;let mk=lk;for(const e of p.ev){if(!e||e.k<=lk)continue;mk=Math.max(mk,e.k);
          if(e.t==="gate"&&(e.i===0||e.i===1)&&w.gc[e.i]<=0){w.g[e.i]=1-w.g[e.i];w.gc[e.i]=1.5}
          if(e.t==="trap"&&(e.i===0||e.i===1)&&w.trc[e.i]<=0){w.tr[e.i]=4;w.trc[e.i]=7}}w.lastK[p.id]=mk}
      const car=rel.c&&pl.find(p=>p.id===rel.c);if(rel.c&&!car)rel.c=null;
      const drop=()=>{w.ev=[rel.c,null,(w.evk=(w.evk||0)+1),"dp"];rel.lk=rel.c;rel.lu=w.t+1.2;rel.c=null;w.drop=(w.drop||0)+1};
      if(car){rel.x=car.x;rel.y=car.y;w.hold[car.id]=(w.hold[car.id]||0)+dt;
        if(!isGhost(w,car)){for(const p of pl){const ld=w.lastD[p.id];if(p.id!==car.id&&ld!==undefined&&p.d!==ld&&dist(p.x,p.y,car.x,car.y)<HB.knock){drop();break}}
          if(rel.c)for(let i=0;i<2;i++)if(w.tr[i]>0&&circleHitsRect(car.x,car.y,PR,REL.traps[i])){drop();break}}
        if(rel.c){const [ax,ay]=relAltar(R.d.sl[car.id]??0,n);if(dist(car.x,car.y,ax,ay)<HB.altar+PR*.5){w.ev=[car.id,null,(w.evk=(w.evk||0)+1),"dl"];w.del[car.id]=(w.del[car.id]||0)+1;rel.c=null;rel.x=CX;rel.y=CY;rel.lk=null;w.dlv=(w.dlv||0)+1}}}
      else{for(const p of pl){if(isGhost(w,p)||(rel.lk===p.id&&w.t<rel.lu))continue;if(dist(p.x,p.y,rel.x,rel.y)<HB.relic){rel.c=p.id;break}}}
      for(const p of pl)w.lastD[p.id]=p.d;
      const walls=relWalls(w.g);
      for(const id in w.b){const b=w.b[id];b.cool=Math.max(0,(b.cool||0)-dt);const i=R.d.sl[id]??0;let tx,ty,sp=botSpeed(b,190,dt);
        if(rel.c===id){[tx,ty]=relAltar(i,n);sp*=.8}else if(!rel.c){tx=rel.x;ty=rel.y}else{const c=pl.find(p=>p.id===rel.c);tx=c?c.x:CX;ty=c?c.y:CY;if(c&&dist(b.x,b.y,c.x,c.y)<HB.knock-6&&b.cool<=0){b.d=(b.d||0)+1;b.cool=1.6}}
        const bx=b.x,by=b.y;moveToward(b,tx,ty,sp,dt,walls);
        if(sp>0&&dist(bx,by,b.x,b.y)<sp*dt*.3){b.ax=(b.ax||0)+dt;if(b.ax>.4){b.y+=(b.y<CY?-1:1)*140*dt;b.x+=(b.x<CX?-1:1)*70*dt}}else b.ax=0}
      separateBots(w.b,pl);for(const id in w.b)walls.forEach(wl=>collideRect(w.b[id],PR,wl));
      abTick(w,dt,pl,{shock:(x,y,by)=>{const c=rel.c&&pl.find(p=>p.id===rel.c);if(c&&c.id!==by&&!isGhost(w,c)&&dist(c.x,c.y,x,y)<HB.shock)drop()}})},
    pub(w){return withAb(w,{ev:w.ev,r:[Math.round(w.rel.x),Math.round(w.rel.y),w.rel.c],dl:w.del,g:w.g,tr:w.tr.map(x=>x>0?1:0),dv:w.dlv||0,dp:w.drop||0,b:packBots(w)})},
    final(w,act){act.forEach(p=>{const d=w.del[p.id]||0;p.v=d*1000+Math.round((w.hold[p.id]||0)*10);p.rv=`${d} entrega${d===1?"":"s"}`})}
  }
};

/* ============================================================
   CLIENTE DA ARENA
   ============================================================ */
let arena=null,arenaMeRef=null;
function arenaMe(){return arenaMeRef}
function stopArena(){if(arena){arena.stop();arena=null}arenaMeRef=null}
const SYM_DRAW=[(c,r)=>{c.beginPath();c.arc(0,0,r,0,7);c.fillStyle="#F2C14E";c.fill();c.beginPath();c.arc(r*.4,-r*.2,r*.85,0,7);c.fillStyle="#211820";c.fill()},
  (c,r)=>{c.beginPath();c.ellipse(0,0,r,r*.6,0,0,7);c.fillStyle="#EDE3D1";c.fill();c.beginPath();c.arc(0,0,r*.38,0,7);c.fillStyle="#C8102E";c.fill()},
  (c,r)=>{c.fillStyle="#E8772E";c.fillRect(-r*.6,-r*.2,r*1.2,r*1.1);for(let i=0;i<4;i++){c.fillRect(-r*.6+i*r*.32,-r,r*.22,r*.9)}},
  (c,r)=>{c.beginPath();c.arc(0,-r*.15,r*.8,0,7);c.fillStyle="#EDE3D1";c.fill();c.fillRect(-r*.45,r*.4,r*.9,r*.5);c.fillStyle="#030203";c.beginPath();c.arc(-r*.3,-r*.2,r*.22,0,7);c.arc(r*.3,-r*.2,r*.22,0,7);c.fill()}];
const SYM_N=["Lua","Olho","Mão","Caveira"];
function drawSym(c,s,x,y,r,glow){c.save();c.translate(x,y);if(glow){c.shadowColor="#F2C14E";c.shadowBlur=16}SYM_DRAW[s](c,r);c.restore()}
const floorCache=new Map();
function floorTex(c,seed,base="#1A1216"){const key=seed+base;let cv=floorCache.get(key);
  if(!cv){cv=document.createElement("canvas");cv.width=WW;cv.height=WH;const x=cv.getContext("2d");x.fillStyle=base;x.fillRect(0,0,WW,WH);const r=mulberry32(seed);
    // lajes com variação de tom
    for(let y=0,row=0;y<WH;y+=62,row++){for(let xx=(row%2)*-50;xx<WW;xx+=100){const v=r();x.fillStyle=v<.5?`rgba(255,240,230,${.012+v*.03})`:`rgba(0,0,0,${(v-.5)*.28})`;x.fillRect(xx+2,y+2,96,58);
      if(r()<.18){x.strokeStyle="rgba(0,0,0,.35)";x.lineWidth=1.5;x.beginPath();const sx=xx+10+r()*70,sy=y+6+r()*20;x.moveTo(sx,sy);x.lineTo(sx+8+r()*20,sy+14+r()*20);x.lineTo(sx+r()*30,sy+30+r()*14);x.stroke()}}}
    x.strokeStyle="rgba(0,0,0,.45)";x.lineWidth=3;
    for(let y=0,row=0;y<WH;y+=62,row++){x.beginPath();x.moveTo(0,y);x.lineTo(WW,y);x.stroke();for(let xx=(row%2)*50;xx<WW;xx+=100){x.beginPath();x.moveTo(xx,y);x.lineTo(xx,y+62);x.stroke()}}
    x.strokeStyle="rgba(255,255,255,.035)";x.lineWidth=1;
    for(let y=1,row=0;y<WH;y+=62,row++){x.beginPath();x.moveTo(0,y+1);x.lineTo(WW,y+1);x.stroke()}
    // manchas de sangue e musgo
    for(let i=0;i<26;i++){const px=r()*WW,py=r()*WH,rr=10+r()*46;const g=x.createRadialGradient(px,py,0,px,py,rr);const moss=r()<.3;g.addColorStop(0,moss?"rgba(90,120,60,.10)":"rgba(160,14,36,.16)");g.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=g;x.beginPath();x.arc(px,py,rr,0,7);x.fill()}
    for(let i=0;i<14;i++){const px=r()*WW,py=r()*WH;x.fillStyle="rgba(120,10,28,.22)";for(let k=0;k<5;k++){x.beginPath();x.arc(px+(r()-.5)*30,py+(r()-.5)*30,1.5+r()*3.5,0,7);x.fill()}}
    // ossos
    x.fillStyle="rgba(233,223,204,.07)";for(let i=0;i<24;i++){const px=r()*WW,py=r()*WH;x.save();x.translate(px,py);x.rotate(r()*6);x.fillRect(-10,-2,20,4);x.beginPath();x.arc(-10,-1.5,3,0,7);x.arc(-10,1.5,3,0,7);x.arc(10,-1.5,3,0,7);x.arc(10,1.5,3,0,7);x.fill();x.restore()}
    // escurece as bordas do mapa
    const g=x.createRadialGradient(WW/2,WH/2,Math.min(WW,WH)*.3,WW/2,WH/2,Math.max(WW,WH)*.62);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.45)");x.fillStyle=g;x.fillRect(0,0,WW,WH);
    floorCache.set(key,cv);if(floorCache.size>12)floorCache.delete(floorCache.keys().next().value)}
  c.drawImage(cv,0,0)}
function drawWall(c,w){const F=12;
  c.fillStyle="rgba(0,0,0,.45)";c.fillRect(w.x+6,w.y+F,w.w,w.h);
  rrect(c,w.x,w.y+F*.5,w.w,w.h,6);c.fillStyle="#150F12";c.fill();
  const g=c.createLinearGradient(0,w.y,0,w.y+w.h);g.addColorStop(0,"#4A3842");g.addColorStop(1,"#2F232A");
  rrect(c,w.x,w.y,w.w,w.h-F*.5,6);c.fillStyle=g;c.fill();c.lineWidth=2;c.strokeStyle="#050304";c.stroke();
  c.save();c.beginPath();c.rect(w.x,w.y,w.w,w.h-F*.5);c.clip();c.strokeStyle="rgba(0,0,0,.28)";c.lineWidth=1.5;
  for(let y=w.y+22,k=0;y<w.y+w.h-8;y+=22,k++){c.beginPath();c.moveTo(w.x,y);c.lineTo(w.x+w.w,y);c.stroke();for(let x=w.x+(k%2?18:36);x<w.x+w.w;x+=36){c.beginPath();c.moveTo(x,y-22);c.lineTo(x,y);c.stroke()}}
  c.restore();c.fillStyle="rgba(233,223,204,.10)";c.fillRect(w.x+5,w.y+3,w.w-10,2)}
function drawRune(c,x,y,t,tm){const A=ABIL[t];const bob=Math.sin(tm*3+x)*4;c.save();c.translate(x,y+bob);c.shadowColor=A.c;c.shadowBlur=22;c.beginPath();c.moveTo(0,-18);c.lineTo(16,0);c.lineTo(0,18);c.lineTo(-16,0);c.closePath();fillStroke(c,A.c,3);c.shadowBlur=0;
  c.font=FONT(16);c.fillStyle="#EDE3D1";c.textAlign="center";c.textBaseline="middle";c.fillText(A.g,0,1);c.textBaseline="alphabetic";c.restore()}

let _ldr={t:0,id:null};
function leaderId(){const now=performance.now();if(now-_ldr.t<1000)return _ldr.id;_ldr.t=now;const pl=(U.V&&U.V.pl||[]).filter(p=>!p.off);const s=pl.slice().sort((a,b)=>b.sc-a.sc);_ldr.id=s[0]&&s[0].sc>0&&(!s[1]||s[1].sc<s[0].sc)?s[0].id:null;return _ldr.id}
function runArena(k,cv,V,endAt,opt={}){const spect=!!opt.spect;
  const ctx=cv.getContext("2d");const d=V.d,rid=V.rid,sl=d.sl||{},n=Math.max(1,Object.keys(sl).length),myI=sl[U.myId]??0;
  const env={cw:0,ch:0,s:1,vw:WW,vh:WH,cam:{x:0,y:0},shakeT:0,shakeN:0,t:0,debug:spect?false:!!U.hitbox,fxSeen:new Set(),ringFx:[],spect};
  function resize(){const r=cv.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);env.cw=r.width;env.ch=r.height;env.s=spect?Math.min(r.width/WW,r.height/WH):clamp(Math.min(r.width,r.height*1.6)/1050,.62,1.35);env.vw=r.width/env.s;env.vh=r.height/env.s;cv.width=Math.round(r.width*dpr);cv.height=Math.round(r.height*dpr)}
  resize();
  const me={x:CX,y:CY,a:0,dash:0,dashT:0,cool:0,kvx:0,kvy:0,kt:0,stun:0,evq:[],evk:0,moving:false,hold:false,boost:0,ghost:0,slow:0,abPend:0};
  arenaMeRef=me;
  const keys=new Set();let ptr=null,lastTap=0,joy=null,lastBsk=null,lastFeed=null;const feed=[];
  const nm=id=>id===U.myId?"Você":((U.V&&U.V.pl.find(p=>p.id===id))||{n:"Alguém"}).n;
  function checkFeed(){const ev=(U.W||{}).ev;if(!ev)return;if(ev[2]===lastFeed)return;const first=lastFeed===null;lastFeed=ev[2];if(first&&performance.now()-U.phaseAt>2500)return;
    const t=ev[3]||"cp";const txt=t==="st"?`${nm(ev[0])} roubou a coroa${ev[1]?` de ${nm(ev[1])}`:""}`:t==="dl"?`${nm(ev[0])} entregou a relíquia!`:t==="dp"?`${nm(ev[0])} deixou a relíquia cair`:`${nm(ev[1])} possuiu ${nm(ev[0])}`;
    feed.unshift({txt,t:performance.now(),me:ev[0]===U.myId||ev[1]===U.myId});if(feed.length>3)feed.pop()}
  function drawFeed(c){const now=performance.now();const f=Math.max(.8,Math.min(1.15,env.cw/900));c.save();c.font=BODY(12.5*f,800);c.textAlign="center";c.textBaseline="middle";
    feed.forEach((e,i)=>{const age=(now-e.t)/1000;if(age>3.5)return;const a=Math.min(1,(3.5-age)/.6)*Math.min(1,age/.15);c.globalAlpha=a;const w=c.measureText(e.txt).width+24,y=(spect?74:118)*f+i*30*f,x=env.cw/2;
      rrect(c,x-w/2,y-12*f,w,24*f,12*f);c.fillStyle=e.me?"rgba(179,18,43,.9)":"rgba(12,9,10,.82)";c.fill();c.lineWidth=1;c.strokeStyle="rgba(233,223,204,.2)";c.stroke();c.fillStyle="#E9DFCC";c.fillText(e.txt,x,y+1)});c.restore()}
  const G=ARENA_CLIENT[k](d,me,env,{n,myI,sl,V});
  if(G.spawn){const [x,y]=G.spawn(myI,n);me.x=x;me.y=y}
  if(spect){me.x=-600;me.y=-600;me.ghost=1e9}
  const CM=spect?0:48;const camTarget=()=>({x:env.vw>=WW+CM*2?(WW-env.vw)/2:clamp(me.x-env.vw/2,-CM,WW-env.vw+CM),y:env.vh>=WH+CM*2?(WH-env.vh)/2:clamp(me.y-env.vh/2,-CM,WH-env.vh+CM)});
  env.cam=camTarget();
  env.shake=(nn=8)=>{env.shakeT=.25;env.shakeN=nn};
  const pushEv=(e)=>{me.evk++;me.evq.push({...e,k:me.evk});if(me.evq.length>6)me.evq.shift();sendPos(true)};env.pushEv=pushEv;
  const toWorld=(e)=>{const r=cv.getBoundingClientRect();return [(e.clientX-r.left)/env.s+env.cam.x,(e.clientY-r.top)/env.s+env.cam.y]};
  const doDash=()=>{if(me.cool>0||G.noDash||me.stun>0)return;me.dash++;me.dashT=.18;me.cool=1.1;sfx.slash();sendPos(true)};
  const hasAb=ABIL_GAMES.has(k);
  const myAb=()=>{const A=(U.W||{}).ab;return A&&A.own?A.own[U.myId]:null};
  function useAbility(){if(!hasAb||me.stun>0)return;const s=myAb();if(!s||me.abPend>0)return;me.abPend=1.5;
    if(s==="speed"){me.boost=3;sfx.go()}
    else if(s==="ghost"){me.ghost=3.5;sfx.whisper()}
    else if(s==="blink"){const a=me.a||0;const walls=G.walls?G.walls():[];for(let i=0;i<22;i++){const px=me.x,py=me.y;me.x+=Math.cos(a)*10;me.y+=Math.sin(a)*10;me.x=clamp(me.x,PR,WW-PR);me.y=clamp(me.y,PR,WH-PR);if(walls.some(w=>circleHitsRect(me.x,me.y,PR,w))){me.x=px;me.y=py;break}}sfx.whisper();env.ringFx.push({x:me.x,y:me.y,t:0,c:"#8A6BB0",r:60})}
    else if(s==="shock"){env.ringFx.push({x:me.x,y:me.y,t:0,c:"#E3263F",r:HB.shock});sfx.scream();env.shake(8)}
    else if(s==="trap"){sfx.splat()}
    pushEv({t:"sk",s,x:Math.round(me.x),y:Math.round(me.y)})}
  env.useAbility=useAbility;
  const onDown=e=>{e.preventDefault();cv.setPointerCapture?.(e.pointerId);audio();const [x,y]=toWorld(e);ptr={x,y,down:true};
    if(e.pointerType!=="mouse"&&!joy){const r=cv.getBoundingClientRect();joy={id:e.pointerId,ox:e.clientX-r.left,oy:e.clientY-r.top,dx:0,dy:0,mx:0,my:0}}me.hold=true;const now=performance.now();if(e.pointerType!=="mouse"&&now-lastTap<280)doDash();lastTap=now;G.down&&G.down(x,y)};
  const onMove=e=>{const [x,y]=toWorld(e);if(ptr)ptr={...ptr,x,y};
    if(joy&&e.pointerId===joy.id){const r=cv.getBoundingClientRect();let jx=e.clientX-r.left-joy.ox,jy=e.clientY-r.top-joy.oy;const l=Math.hypot(jx,jy);if(l>56){jx*=56/l;jy*=56/l}joy.mx=jx;joy.my=jy;if(l>12){joy.dx=jx/56;joy.dy=jy/56}else{joy.dx=0;joy.dy=0}}if(e.pointerType==="mouse"){me.aimX=x;me.aimY=y;me.aimSX=e.clientX;me.aimSY=e.clientY}};
  const onUp=e=>{if(ptr)ptr.down=false;ptr=null;me.hold=false;if(joy&&(!e||e.pointerId===joy.id))joy=null};
  const KEYS=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Space","KeyA","KeyD","KeyW","KeyS","ShiftLeft","ShiftRight","KeyQ","KeyE","KeyH"];
  const onKey=e=>{if(e.target.closest?.("input"))return;if(!KEYS.includes(e.code))return;e.preventDefault();
    if(e.type==="keydown"){if(!keys.has(e.code)){if(e.code==="Space"||e.code.startsWith("Shift")){if(G.space)G.space();else doDash()}if(e.code==="KeyE"||e.code==="KeyQ")useAbility();if(e.code==="KeyH"){env.debug=!env.debug;U.hitbox=env.debug}}keys.add(e.code)}else keys.delete(e.code)};
  if(!spect){cv.addEventListener("pointerdown",onDown);cv.addEventListener("pointermove",onMove);window.addEventListener("pointerup",onUp);
  window.addEventListener("keydown",onKey);window.addEventListener("keyup",onKey)}window.addEventListener("resize",resize);
  let lastSend=0,lastSig="";
  function sendPos(force){if(spect)return;const now=performance.now();if(!force&&now-lastSend<70)return;const p={r:rid,x:Math.round(me.x),y:Math.round(me.y),a:Math.round(me.a*100)/100,d:me.dash,e:me.evq,g:me.ghost>0?1:0};const sig=JSON.stringify(p);if(sig===lastSig&&!force&&now-lastSend<600)return;lastSig=sig;lastSend=now;
    if(U.tbl&&U.mode!=="solo")U.tbl.presence({p}).catch(()=>{})}
  const disp={};const seenD={};
  function others(){
    const out=[];const W=U.W||{};
    for(const pl of V.pl){if(pl.id===U.myId||pl.off)continue;
      let src=null;if(pl.b){const b=W.b&&W.b[pl.id];if(b)src={x:b[0],y:b[1],a:b[2],d:b[3],hid:b[4],g:b[5],car:b[6]}}else{const o=U.others[pl.id];if(o&&o.r===rid)src=o}
      if(!src)continue;const q=disp[pl.id]||(disp[pl.id]={x:src.x,y:src.y,a:src.a||0});q.x+=(src.x-q.x)*.35;q.y+=(src.y-q.y)*.35;q.a=src.a||0;q.hid=src.hid;q.car=src.car;q.g=src.g;
      if(seenD[pl.id]!==undefined&&src.d!==seenD[pl.id]&&!G.noDash&&me.stun<=0&&me.ghost<=0){const dd=dist(q.x,q.y,me.x,me.y);if(dd<HB.knock){const ux=(me.x-q.x)/(dd||1),uy=(me.y-q.y)/(dd||1);me.kvx=ux*520;me.kvy=uy*520;me.kt=.26;env.shake(10);hurt(.5);G.knocked&&G.knocked(pl.id)}}
      seenD[pl.id]=src.d;
      out.push({id:pl.id,n:pl.n,av:pl.av,x:q.x,y:q.y,a:q.a,hid:q.hid,car:q.car,g:q.g,tm:pl.tm})}
    return out}
  env.others=others;
  const drawPlayer=(c,p,isMe)=>{if(p.hid||(isMe&&spect))return;const r=PR;
    c.save();if(p.g||(isMe&&me.ghost>0))c.globalAlpha=.38;
    c.beginPath();c.ellipse(p.x,p.y+r*.95,r*.85,r*.28,0,0,7);c.fillStyle="rgba(0,0,0,.5)";c.fill();
    const tmv=p.tm||(isMe&&U.V?((U.V.pl.find(q=>q.id===U.myId)||{}).tm):0);if(U.V&&U.V.mode==="times"&&tmv&&TEAMS[tmv-1]){c.beginPath();c.ellipse(p.x,p.y+r*.95,r*1.05,r*.36,0,0,7);c.lineWidth=3;c.strokeStyle=TEAMS[tmv-1].c;c.stroke()}
    if(isMe){const t=performance.now()/1000;c.save();c.translate(p.x,p.y+r*.95);c.scale(1,.34);c.beginPath();c.arc(0,0,r+10,0,7);c.strokeStyle="rgba(235,193,90,.9)";c.lineWidth=4;c.setLineDash([9,7]);c.lineDashOffset=-t*20;c.stroke();c.setLineDash([]);c.restore();
      c.save();c.shadowColor="rgba(235,193,90,.55)";c.shadowBlur=18;drawAvatar(c,p.av||"00000",p.x,p.y,r);c.restore()}
    else drawAvatar(c,p.av||"00000",p.x,p.y,r);
    if(p.tm&&TEAMS[p.tm-1]){c.beginPath();c.arc(p.x+r*.78,p.y-r*.78,5,0,7);c.fillStyle=TEAMS[p.tm-1].c;c.fill();c.lineWidth=2;c.strokeStyle="#050304";c.stroke()}
    const sy=U.says[isMe?U.myId:p.id];if(sy&&performance.now()-sy.t<2800){const a=Math.min(1,(2800-(performance.now()-sy.t))/400);c.save();c.globalAlpha*=a;c.font=BODY(12,800);const bw=c.measureText(sy.m).width+18,bx=p.x-bw/2,by=p.y-r-44;
      rrect(c,bx,by,bw,24,10);c.fillStyle="#E9DFCC";c.fill();c.beginPath();c.moveTo(p.x-6,by+23);c.lineTo(p.x,by+31);c.lineTo(p.x+6,by+23);c.fill();c.fillStyle="#1B1215";c.textAlign="center";c.textBaseline="middle";c.fillText(sy.m,p.x,by+12.5);c.restore()}
    const pid=isMe?U.myId:p.id;if(pid&&pid===leaderId()){c.save();c.font=BODY(15,900);c.textAlign="center";c.textBaseline="middle";c.fillStyle="#E0283F";c.shadowColor="#E0283F";c.shadowBlur=10;c.fillText("☠",p.x+r+2,p.y+r+14);c.restore()}
    const fz=Math.max(11.5,9.5/env.s),k2=fz/11.5;c.font=BODY(fz,800);c.textAlign="center";c.textBaseline="middle";const nm=isMe?"você":p.n;const tw=c.measureText(nm).width+14*k2;rrect(c,p.x-tw/2,p.y+r+7,tw,17*k2,8.5*k2);c.fillStyle=isMe?"rgba(235,193,90,.95)":"rgba(12,9,10,.8)";c.fill();
    if(!isMe){c.lineWidth=1;c.strokeStyle="rgba(233,223,204,.18)";c.stroke()}c.fillStyle=isMe?"#1B1215":"#E9DFCC";c.fillText(nm,p.x,p.y+r+7+8.5*k2+.5);c.textBaseline="alphabetic";c.restore()};
  env.drawPlayer=drawPlayer;
  function abilityFx(){const A=(U.W||{}).ab;if(!A)return;
    for(const f of A.fx||[]){const [kk,t,x,y,by]=f;if(env.fxSeen.has(kk))continue;
      if(t==="shock"){env.fxSeen.add(kk);if(by!==U.myId){env.ringFx.push({x,y,t:0,c:"#E3263F",r:HB.shock});const dd=dist(x,y,me.x,me.y);if(dd<HB.shock&&me.ghost<=0){me.kvx=(me.x-x)/(dd||1)*700;me.kvy=(me.y-y)/(dd||1)*700;me.kt=.3;me.stun=.35;env.shake(14);hurt(.5)}}}
      else if(t==="trap"&&by!==U.myId&&me.ghost<=0&&dist(x,y,me.x,me.y)<HB.trap+PR*.5){env.fxSeen.add(kk);me.stun=.9;me.slow=2;hurt(.7);sfx.splat()}}
    if(!myAb())me.abPend=0}
  let raf=0,last=performance.now(),over=false,sentAt=0,lastScore=-1,stopped=false;
  function report(final){if(!G.score||spect)return;const sc=Math.floor(G.score());if(sc===lastScore&&!final)return;lastScore=sc;sentAt=performance.now();sendArcadeScore(sc)}
  function frame(now){if(spect)MUTE_FX=true;try{frame0(now)}finally{MUTE_FX=false}}
  function frame0(now){if(stopped)return;
    const dt=Math.max(0,Math.min(.05,(now-last)/1000));last=Math.max(last,now);env.t+=dt;const left=endAt-now;
    if(!over&&left<=0){over=true;report(true);sfx.end()}
    if(!over){
      me.cool=Math.max(0,me.cool-dt);me.stun=Math.max(0,me.stun-dt);me.boost=Math.max(0,me.boost-dt);me.ghost=Math.max(0,me.ghost-dt);me.slow=Math.max(0,me.slow-dt);me.abPend=Math.max(0,me.abPend-dt);
      let dx=0,dy=0;if(keys.has("ArrowLeft")||keys.has("KeyA"))dx--;if(keys.has("ArrowRight")||keys.has("KeyD"))dx++;if(keys.has("ArrowUp")||keys.has("KeyW"))dy--;if(keys.has("ArrowDown")||keys.has("KeyS"))dy++;
      if(!dx&&!dy&&joy&&!G.noPtrMove){dx=joy.dx;dy=joy.dy}
      else if(!dx&&!dy&&ptr&&ptr.down&&!joy&&!G.noPtrMove){const dd=dist(ptr.x,ptr.y,me.x,me.y);if(dd>14){dx=(ptr.x-me.x)/dd;dy=(ptr.y-me.y)/dd}}
      const l=Math.hypot(dx,dy);if(l>0){dx/=l;dy/=l}
      me.hold=!!((ptr&&ptr.down)||keys.has("Space")||keys.has("ArrowRight")||keys.has("KeyD")||keys.has("ArrowUp")||keys.has("KeyW"));
      let sp=240*(G.speedMul?G.speedMul():1)*(me.boost>0?1.6:1)*(me.slow>0?.5:1);if(me.dashT>0){sp*=3;me.dashT-=dt}if(me.stun>0)sp=0;
      const px=me.x,py=me.y;
      if(me.aimSX!==undefined){const r=cv.getBoundingClientRect();me.aimX=(me.aimSX-r.left)/env.s+env.cam.x;me.aimY=(me.aimSY-r.top)/env.s+env.cam.y}
      if(!G.customMove){me.x+=dx*sp*dt;me.y+=dy*sp*dt;if(me.aimX!==undefined&&G.aim)me.a=Math.atan2(me.aimY-me.y,me.aimX-me.x);else if(l>0)me.a=Math.atan2(dy,dx)}
      else G.customMove(dt,dx,dy,sp);
      if(me.kt>0){me.x+=me.kvx*dt;me.y+=me.kvy*dt;me.kt-=dt;me.kvx*=.9;me.kvy*=.9}
      const walls=G.walls?G.walls():[];walls.forEach(w=>collideRect(me,PR,w));
      if(!G.noBump&&me.ghost<=0)for(const o of others()){if(o.hid||o.g)continue;const dd=dist(o.x,o.y,me.x,me.y);if(dd<PR*2&&dd>0){const push=(PR*2-dd)/2;me.x+=(me.x-o.x)/dd*push;me.y+=(me.y-o.y)/dd*push}}
      me.x=clamp(me.x,PR,WW-PR);me.y=clamp(me.y,PR,WH-PR);
      me.moving=dist(px,py,me.x,me.y)>1;
      abilityFx();G.update(dt);sendPos(false);
      checkFeed();const bs=(U.W||{}).bs;if(bs&&bs[2]!==lastBsk){if(lastBsk!==null)U.says[bs[0]]={m:bs[1],t:performance.now()};lastBsk=bs[2]}
    }
    const ct=camTarget();env.cam.x+=(ct.x-env.cam.x)*Math.min(1,dt*8);env.cam.y+=(ct.y-env.cam.y)*Math.min(1,dt*8);
    const dpr=Math.min(2,devicePixelRatio||1);ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle="#050304";ctx.fillRect(0,0,env.cw,env.ch);
    ctx.save();ctx.scale(env.s,env.s);ctx.translate(-env.cam.x,-env.cam.y);
    if(env.shakeT>0){env.shakeT-=dt;ctx.translate((Math.random()-.5)*env.shakeN,(Math.random()-.5)*env.shakeN)}
    ctx.beginPath();ctx.rect(0,0,WW,WH);ctx.clip();
    const os=others();
    G.draw(ctx,os,drawPlayer,()=>drawAbilities(ctx));
    if(!G.drawsAbilities)drawAbilities(ctx);
    if(env.debug)drawHitboxes(ctx,os);
    ctx.restore();
    if(spect){checkFeed();vignette(ctx,env.cw,env.ch,.45);drawFeed(ctx);const f=Math.max(.8,Math.min(1.2,env.cw/900));timerPill(ctx,env.cw-12,12,46*f,left,TYPES[k]?TYPES[k].dur:0);
      if(k==="luz"&&G.banner){const b=G.banner();if(b)bigText(ctx,b.t,env.cw/2,90*f,40*f,b.c)}
      if(over){endCard(ctx,env.cw,env.ch,"Acabou!","");return}raf=requestAnimationFrame(frame);return}
    vignette(ctx,env.cw,env.ch,.62);
    arenaHud(ctx,env,G,left,k);
    miniMap(ctx,os);
    if(hasAb)abilitySlot(ctx);
    drawFeed(ctx);
    if(joy&&!G.noPtrMove){ctx.save();ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(joy.ox,joy.oy,56,0,7);ctx.fillStyle="rgba(12,9,10,.45)";ctx.fill();ctx.lineWidth=2;ctx.strokeStyle="rgba(233,223,204,.25)";ctx.stroke();
      ctx.beginPath();ctx.arc(joy.ox+joy.mx,joy.oy+joy.my,24,0,7);ctx.fillStyle="rgba(233,223,204,.85)";ctx.fill();ctx.restore()}
    if(env.t<1.1&&!over){ctx.save();ctx.globalAlpha=Math.max(0,1-env.t/1.1);bigText(ctx,"JÁ!",env.cw/2,env.ch*.42,Math.round(72*Math.max(.8,Math.min(1.2,env.cw/900))*(1+env.t*.25)),"#EBC15A");ctx.restore()}
    if(over){endCard(ctx,env.cw,env.ch,"Acabou!",G.finalText?G.finalText():"");return}
    if(now-sentAt>300)report(false);
    if(!spect&&left>0&&left<10000&&now-(env.hb||0)>(350+left/10000*650)){env.hb=now;sfx.heart()}
    raf=requestAnimationFrame(frame)}
  function drawAbilities(c){const A=(U.W||{}).ab;
    if(A){for(const [id,x,y,t] of A.pk||[])drawRune(c,x,y,t,env.t);
      for(const [kk,t,x,y,by,ttl] of A.fx||[]){if(t==="trap"){c.save();c.globalAlpha=Math.min(1,ttl/1.5);c.fillStyle="#6D0716";c.beginPath();for(let i=0;i<12;i++){const a=i/12*Math.PI*2,rr=HB.trap*(.8+.25*Math.sin(i*2.3+kk));c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr*.75)}c.closePath();c.fill();c.fillStyle="rgba(227,38,63,.5)";c.beginPath();c.ellipse(x-8,y-5,10,5,0,0,7);c.fill();c.restore()}}}
    env.ringFx.forEach(f=>{f.t+=1/60;const p=Math.min(1,f.t/.5);c.beginPath();c.arc(f.x,f.y,f.r*p,0,7);c.strokeStyle=f.c;c.globalAlpha=1-p;c.lineWidth=8*(1-p)+2;c.stroke();c.globalAlpha=1});env.ringFx=env.ringFx.filter(f=>f.t<.5)}
  function drawHitboxes(c,os){c.save();c.lineWidth=2;
    const walls=G.walls?G.walls():[];c.strokeStyle="#00E5FF";walls.forEach(w=>c.strokeRect(w.x,w.y,w.w,w.h));
    const circ=(x,y,r,col,dash)=>{c.beginPath();c.arc(x,y,r,0,7);c.strokeStyle=col;c.setLineDash(dash?[5,4]:[]);c.stroke();c.setLineDash([])};
    circ(me.x,me.y,PR,"#39FF14");os.forEach(o=>{if(!o.hid)circ(o.x,o.y,PR,"#39FF14")});
    const A=(U.W||{}).ab;if(A){(A.pk||[]).forEach(([id,x,y])=>circ(x,y,HB.pickup,"#FFD400",1));(A.fx||[]).forEach(([kk,t,x,y])=>{if(t==="trap")circ(x,y,HB.trap+PR*.5,"#FF3B3B",1)})}
    if(!G.noDash)circ(me.x,me.y,HB.knock,"rgba(255,255,255,.35)",1);
    G.debug&&G.debug(c,circ);
    c.font=BODY(12,900);c.fillStyle="#39FF14";c.textAlign="left";c.textAlign="center";c.fillText(`HITBOX · jogador r=${PR} · pos ${Math.round(me.x)},${Math.round(me.y)}`,env.cam.x+env.vw/2,env.cam.y+24/env.s);c.restore()}
  function miniMap(c,os){const mw=Math.min(190,env.cw*.28),mh=mw*WH/WW,x0=env.cw-mw-12,y0=env.ch-mh-12,sc=mw/WW;
    c.save();glass(c,x0-5,y0-5,mw+10,mh+10,10);rrect(c,x0,y0,mw,mh,6);c.clip();c.fillStyle="rgba(233,223,204,.03)";c.fillRect(x0,y0,mw,mh);
    c.fillStyle="rgba(237,227,209,.25)";(G.walls?G.walls():[]).forEach(w=>c.fillRect(x0+w.x*sc,y0+w.y*sc,Math.max(2,w.w*sc),Math.max(2,w.h*sc)));
    G.mini&&G.mini(c,x0,y0,sc);
    const A=(U.W||{}).ab;if(A)(A.pk||[]).forEach(([id,x,y,t])=>{c.fillStyle=ABIL[t].c;c.fillRect(x0+x*sc-2,y0+y*sc-2,5,5)});
    if(!G.miniPlayers)os.forEach(o=>{if(o.hid)return;c.fillStyle="#E3263F";c.beginPath();c.arc(x0+o.x*sc,y0+o.y*sc,3,0,7);c.fill()});
    c.fillStyle="#EBC15A";c.shadowColor="#EBC15A";c.shadowBlur=8;c.beginPath();c.arc(x0+me.x*sc,y0+me.y*sc,4,0,7);c.fill();c.shadowBlur=0;
    c.strokeStyle="rgba(237,227,209,.6)";c.lineWidth=1;c.strokeRect(x0+env.cam.x*sc,y0+env.cam.y*sc,env.vw*sc,env.vh*sc);c.restore()}
  function abilitySlot(c){const s=myAb();const f=Math.max(.8,Math.min(1.1,env.cw/900));const h=52*f,x0=12,y0=env.ch-h-12;
    c.save();c.textBaseline="middle";
    if(s){const A=ABIL[s];c.font=BODY(14*f,800);const w=Math.max(200*f,c.measureText(A.n).width+h+44*f);glass(c,x0,y0,w,h,14*f,A.c);
      const cx=x0+h/2+4,cy=y0+h/2;const g=c.createRadialGradient(cx,cy,2,cx,cy,h*.42);g.addColorStop(0,A.c);g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.globalAlpha=.45+.25*Math.sin(performance.now()/260);c.fillRect(cx-h/2,cy-h/2,h,h);c.globalAlpha=1;
      c.beginPath();c.arc(cx,cy,h*.3,0,7);c.fillStyle="rgba(5,3,4,.85)";c.fill();c.lineWidth=2;c.strokeStyle=A.c;c.stroke();
      c.font=FONT(17*f);c.fillStyle=A.c;c.textAlign="center";c.fillText(A.g,cx,cy+1);
      c.textAlign="left";c.font=BODY(14*f,800);c.fillStyle="#E9DFCC";c.fillText(A.n,x0+h+8,y0+h*.36);
      c.font=BODY(11.5*f,700);c.fillStyle="rgba(233,223,204,.55)";c.fillText(me.abPend>0?"usando…":"aperte  E  pra usar",x0+h+8,y0+h*.7)}
    else{c.font=BODY(12.5*f,700);const t="Pegue uma runa ◆ no mapa";const w=c.measureText(t).width+28;glass(c,x0,y0+h*.25,w,h*.62,10*f);c.fillStyle="rgba(233,223,204,.6)";c.textAlign="left";c.fillText(t,x0+14,y0+h*.56)}
    c.textBaseline="alphabetic";c.restore()}
  raf=requestAnimationFrame(frame);
  return {stop(){stopped=true;cancelAnimationFrame(raf);cv.removeEventListener("pointerdown",onDown);cv.removeEventListener("pointermove",onMove);window.removeEventListener("pointerup",onUp);window.removeEventListener("keydown",onKey);window.removeEventListener("keyup",onKey);window.removeEventListener("resize",resize);if(!over)report(true);if(U.tbl&&U.mode!=="solo")U.tbl.presence({p:null}).catch(()=>{})},dash:doDash,ability:useAbility,toggleDebug(){env.debug=!env.debug;U.hitbox=env.debug}};
}
function arenaHud(c,env,G,left,k){
  const f=Math.max(.8,Math.min(1.15,env.cw/900)),h=46*f;const txt=G.hud?G.hud():"";
  if(txt)hudPill(c,12,12,h,{luz:"progresso",naoolhe:"progresso",coroa:"reinado",cacada:"caçada",altar:"selos",reliquia:"relíquia"}[k]||"pontos",txt,"#E9DFCC");
  if(G.extra){const ex=G.extra();if(ex){c.save();c.font=BODY(12.5*f,800);const w=c.measureText(ex).width+20;glass(c,12,12+h+6,w,24*f,8*f);c.fillStyle="rgba(233,223,204,.85)";c.textBaseline="middle";c.textAlign="left";c.fillText(ex,22,12+h+6+12*f+1);c.restore()}}
  timerPill(c,env.cw-12,12,h,left,TYPES[k]?TYPES[k].dur:0);
  if(G.banner){const b=G.banner();if(b){const by=b.top?(12+h+6+24*f+34*f):env.ch*.6;bigText(c,b.t,env.cw/2,by,Math.min(40*f,env.cw/(b.t.length*.62)),b.c)}}
}

/* ---------- jogos da arena (lado de cada jogador) ---------- */
const ARENA_CLIENT={
  luz(d,me,env,ctx0){
    const sched=LIGHT_SCHED(d.seed);let t=0,idle=0,movingG=0,fin=null,pulls=0,lastC="g";
    const g={noDash:true,noBump:true,noPtrMove:true};const span=LUZ.x1-LUZ.x0;
    g.spawn=(i,n)=>[LUZ.x0,laneY(i,n)];
    g.customMove=(dt)=>{if(fin!==null||me.stun>0)return;if(me.hold)me.x+=190*dt;me.a=0};
    g.update=dt=>{t+=dt;const L=lightAt(sched,t);if(L.c!==lastC){lastC=L.c;idle=0;movingG=0;L.c==="r"?sfx.heart():sfx.go()}
      if(fin!==null)return;if(me.x>=LUZ.x1){fin=t;sfx.win();drips(12);return}if(me.stun>0)return;
      if(L.c==="g"){if(me.hold&&t-L.s>.35){movingG+=dt;if(movingG>.12){me.x=Math.max(LUZ.x0,me.x-160);me.stun=.7;pulls++;hurt(.8);env.shake(12);movingG=0}}}
      else{if(!me.hold&&t-L.s>.25){idle+=dt;if(idle>.8){me.x=Math.max(LUZ.x0,me.x-70);me.stun=.35;pulls++;hurt(.5);idle=0}}else idle=0}};
    const prog=()=>clamp((me.x-LUZ.x0)/span,0,1);
    g.score=()=>fin!==null?2000+Math.round((TYPES.luz.dur/1000-fin)*10):Math.round(prog()*1000);
    g.hud=()=>fin!==null?"Escapou!":`${Math.round(prog()*100)}%`;g.extra=()=>`${pulls} puxões da coisa`;
    g.banner=()=>{const L=lightAt(sched,t);return L.c==="r"?{t:"VERMELHO: ANDE!",c:"#E3263F",top:1}:{t:"VERDE: PARE!",c:"#7FAF6A",top:1}};
    g.draw=(c,os,dp)=>{const L=lightAt(sched,t);floorTex(c,d.seed,"#140D10");
      const glow=c.createRadialGradient(CX,-60,20,CX,-60,800);glow.addColorStop(0,L.c==="r"?"rgba(227,38,63,.5)":"rgba(127,175,106,.45)");glow.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=glow;c.fillRect(0,0,WW,WH);
      for(let i=0;i<ctx0.n;i++){const y=laneY(i,ctx0.n);c.strokeStyle="rgba(237,227,209,.08)";c.lineWidth=2;c.setLineDash([10,12]);c.beginPath();c.moveTo(LUZ.x0,y+PR+14);c.lineTo(LUZ.x1,y+PR+14);c.stroke();c.setLineDash([])}
      for(let x=LUZ.x0+140;x<LUZ.x1;x+=140){c.fillStyle="rgba(237,227,209,.12)";c.font=BODY(12,900);c.textAlign="center";c.fillText(Math.round((x-LUZ.x0)/span*100)+"%",x,110)}
      c.fillStyle="rgba(127,175,106,.18)";c.fillRect(LUZ.x1,0,WW-LUZ.x1,WH);c.strokeStyle="#7FAF6A";c.lineWidth=5;c.beginPath();c.moveTo(LUZ.x1,0);c.lineTo(LUZ.x1,WH);c.stroke();
      [CX-500,CX,CX+500].forEach(x=>{c.beginPath();c.arc(x,34,24,0,7);c.fillStyle=L.c==="r"?"#E3263F":"#7FAF6A";c.fill();c.lineWidth=4;c.strokeStyle="#030203";c.stroke()});
      c.fillStyle="#030203";c.beginPath();c.moveTo(0,0);c.lineTo(60,0);for(let y=0;y<=WH;y+=40)c.lineTo(54+Math.sin(y*.05+t*3)*10,y);c.lineTo(0,WH);c.fill();
      c.fillStyle="#E3263F";for(let i=0;i<6;i++){const y=120+i*150+Math.sin(t*2+i)*10;c.beginPath();c.arc(26,y,4,0,7);c.arc(40,y,4,0,7);c.fill()}
      os.forEach(o=>{const i=ctx0.sl[o.id]??0;dp(c,{...o,y:laneY(i,ctx0.n)},false)});dp(c,{x:me.x,y:me.y,av:U.av},true)};
    g.mini=(c,x0,y0,sc)=>{c.fillStyle="rgba(127,175,106,.5)";c.fillRect(x0+LUZ.x1*sc,y0,(WW-LUZ.x1)*sc,WH*sc)};
    g.finalText=()=>fin!==null?"Você escapou!":`Chegou a ${Math.round(prog()*100)}% do corredor`;
    return g},
  chao(d,me,env){
    const P=chaoPatterns(d.seed),crack=mulberry32(d.seed^0x44);const cracks=Array.from({length:CHAO.c*CHAO.r},()=>[crack(),crack(),crack()]);
    let t=0,safe=0,falls=0,fall=0;const g={};
    g.spawn=(i)=>{const idx=(i*7+13)%(CHAO.c*CHAO.r);return [CHAO.x0+(idx%CHAO.c+.5)*CHAO.tw,CHAO.y0+(Math.floor(idx/CHAO.c)+.5)*CHAO.th]};
    g.update=dt=>{t+=dt;if(fall>0){fall-=dt;if(fall<=0){const s=chaoState(t);let best=null,bd=1e9;for(let i=0;i<CHAO.c*CHAO.r;i++){if(P[s.p].has(i)||P[(s.p+1)%3].has(i))continue;const x=CHAO.x0+(i%CHAO.c+.5)*CHAO.tw,y=CHAO.y0+(Math.floor(i/CHAO.c)+.5)*CHAO.th,dd=dist(x,y,me.x,me.y);if(dd<bd){bd=dd;best=[x,y]}}if(best){me.x=best[0];me.y=best[1]}}return}
      const s=chaoState(t),ti=chaoTile(me.x,me.y);
      if(me.ghost<=0&&(ti<0||(s.down&&P[s.p].has(ti)))){fall=1;falls++;me.stun=1;hurt(.9);sfx.scream();return}
      safe+=dt};
    g.score=()=>Math.max(0,Math.floor(safe*10)-falls*15);g.hud=()=>fmt(g.score());g.extra=()=>`${falls} queda${falls===1?"":"s"}`;
    g.banner=()=>fall>0?{t:"CAIU!",c:"#E3263F"}:null;
    g.draw=(c,os,dp)=>{c.fillStyle="#0A0507";c.fillRect(0,0,WW,WH);const gl=c.createRadialGradient(CX,CY,50,CX,CY,900);gl.addColorStop(0,"rgba(200,16,46,.25)");gl.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=gl;c.fillRect(0,0,WW,WH);
      const s=chaoState(t);
      for(let i=0;i<CHAO.c*CHAO.r;i++){const fx=P[s.p].has(i);if(s.down&&fx)continue;let x=CHAO.x0+(i%CHAO.c)*CHAO.tw+4,y=CHAO.y0+Math.floor(i/CHAO.c)*CHAO.th+4;
        if(s.tremble&&fx){x+=(Math.random()-.5)*3;y+=(Math.random()-.5)*3}
        const tw=CHAO.tw-8,th=CHAO.th-8;c.fillStyle="#050304";c.fillRect(x+2,y+8,tw,th);rrect(c,x,y+5,tw,th-3,8);c.fillStyle=fx&&s.tremble?"#4A1520":"#1E161A";c.fill();
        const tg=c.createLinearGradient(x,y,x+tw,y+th);tg.addColorStop(0,fx&&s.tremble?"#6A2230":"#4A3A42");tg.addColorStop(1,fx&&s.tremble?"#3E121B":"#2C2228");rrect(c,x,y,tw,th-5,8);c.fillStyle=tg;c.fill();c.lineWidth=2;c.strokeStyle="#050304";c.stroke();
        c.fillStyle="rgba(233,223,204,.08)";c.fillRect(x+6,y+3,tw-12,2);
        const cr=cracks[i];c.strokeStyle="rgba(3,2,3,.55)";c.lineWidth=2;c.beginPath();c.moveTo(x+cr[0]*90,y+6);c.lineTo(x+cr[1]*90+6,y+44);c.lineTo(x+cr[2]*90+4,y+CHAO.th-14);c.stroke()}
      os.forEach(o=>dp(c,o,false));
      if(fall>0){c.save();c.globalAlpha=fall;c.translate(me.x,me.y);c.scale(fall,fall);drawAvatar(c,U.av,0,0,PR);c.restore()}else dp(c,{x:me.x,y:me.y,av:U.av},true)};
    g.debug=(c)=>{const ti=chaoTile(me.x,me.y);if(ti>=0){c.strokeStyle="#FFD400";c.strokeRect(CHAO.x0+(ti%CHAO.c)*CHAO.tw,CHAO.y0+Math.floor(ti/CHAO.c)*CHAO.th,CHAO.tw,CHAO.th)}c.fillStyle="#FFD400";c.beginPath();c.arc(me.x,me.y,3,0,7);c.fill()};
    g.mini=(c,x0,y0,sc)=>{c.fillStyle="rgba(61,43,53,.8)";c.fillRect(x0+CHAO.x0*sc,y0+CHAO.y0*sc,CHAO.c*CHAO.tw*sc,CHAO.r*CHAO.th*sc)};
    g.finalText=()=>`${fmt(g.score())} pontos · ${falls} quedas`;
    return g},
  circulo(d,me,env){
    const Z=circleZones(d.seed);let t=0,inside=0,out=0,poss=0;const g={};
    g.spawn=(i,n)=>ringPos(i,n,180,150);
    g.update=dt=>{t+=dt;const z=zoneAt(Z,t);if(inZone(z,me.x,me.y)){inside+=dt;out=0}else{out+=dt;if(out>2.5){out=0;me.stun=1.4;poss++;hurt(1);sfx.scream()}}};
    g.score=()=>Math.floor(inside*10);g.hud=()=>fmt(g.score());g.extra=()=>`${poss} possess${poss===1?"ão":"ões"}`;
    g.banner=()=>out>0?{t:"VOLTE PRO SAL!",c:"#E3263F"}:null;
    const drawZ=(c,z,col,w,dash)=>z.forEach(e=>{c.beginPath();c.ellipse(e.x,e.y,e.rx,e.ry,0,0,7);c.lineWidth=w;c.strokeStyle=col;c.setLineDash(dash);c.lineCap="round";c.stroke();c.setLineDash([]);c.lineCap="butt"});
    g.draw=(c,os,dp)=>{floorTex(c,d.seed,"#120C0F");const z=zoneAt(Z,t);
      c.fillStyle=out>0?"rgba(200,16,46,.22)":"rgba(0,0,0,.35)";c.fillRect(0,0,WW,WH);
      z.forEach(e=>{c.beginPath();c.ellipse(e.x,e.y,e.rx,e.ry,0,0,7);c.fillStyle="rgba(237,227,209,.1)";c.fill()});drawZ(c,z,"rgba(237,227,209,.85)",10,[3,9]);
      const next=Z[Math.min(Z.length-1,Math.floor(t/5)+1)];if(5-(t%5)<1.3)drawZ(c,next,"rgba(242,193,78,.35)",3,[12,10]);
      os.forEach(o=>dp(c,o,false));dp(c,{x:me.x,y:me.y,av:U.av},true)};
    g.debug=(c)=>{const z=zoneAt(Z,t);z.forEach(e=>{c.beginPath();c.ellipse(e.x,e.y,e.rx,e.ry,0,0,7);c.strokeStyle="#FFD400";c.stroke()});c.fillStyle=inZone(z,me.x,me.y)?"#39FF14":"#FF3B3B";c.beginPath();c.arc(me.x,me.y,4,0,7);c.fill()};
    g.mini=(c,x0,y0,sc)=>{zoneAt(Z,t).forEach(e=>{c.beginPath();c.ellipse(x0+e.x*sc,y0+e.y*sc,e.rx*sc,e.ry*sc,0,0,7);c.strokeStyle="rgba(237,227,209,.8)";c.lineWidth=1.5;c.stroke()})};
    g.finalText=()=>`${fmt(g.score())} pontos dentro do sal`;
    return g},
  cacada(d,me,env){
    const g={miniPlayers:true};const WALLS=cacadaWalls(d.seed);g.walls=()=>WALLS;g.spawn=(i,n)=>ringPos(i,n,480,250);
    const W=()=>U.W||{};const inf=()=>W().inf||{};const isInf=id=>inf()[id]!==undefined;let lastEv=null,bannerT=0,wasInf=false,t=0,lastPh=0;
    g.speedMul=()=>isInf(U.myId)?1.1:1;
    g.update=dt=>{t+=dt;bannerT=Math.max(0,bannerT-dt);const ev=W().ev;const k=ev?ev[2]:0;
      if(k!==lastEv){if(lastEv!==null&&ev){if(ev[0]===U.myId){me.stun=1.1;hurt(.9);sfx.scream()}else if(ev[1]===U.myId){sfx.win();env.shake(6)}else sfx.stab()}lastEv=k}
      const now=isInf(U.myId);if(now&&!wasInf){bannerT=2.2}wasInf=now;
      const ph=Math.floor(t*2.2);if(!now&&ph!==lastPh){lastPh=ph;let nd=1e9;for(const o of env.others())if(isInf(o.id))nd=Math.min(nd,dist(o.x,o.y,me.x,me.y));if(nd<260)sfx.heart()}};
    const alive=()=>{const V=U.V;if(!V)return 0;return V.pl.filter(p=>!p.off&&!isInf(p.id)).length};
    g.hud=()=>isInf(U.myId)?`${inf()[U.myId]} captura${inf()[U.myId]===1?"":"s"}`:`${Math.floor(t)} s vivo`;
    g.extra=()=>{const a=alive(),h=Object.keys(inf()).length;return isInf(U.myId)?`POSSUÍDO · faltam ${a} vivo${a===1?"":"s"}`:`${a} vivo${a===1?"":"s"} · ${h} possuído${h===1?"":"s"}`};
    g.banner=()=>bannerT>0?{t:"VOCÊ ESTÁ POSSUÍDO!",c:"#E0283F",top:1}:null;
    const horns=(c,x,y)=>{c.save();c.translate(x,y);[-1,1].forEach(s=>{c.beginPath();c.moveTo(s*8,-PR*.7);c.quadraticCurveTo(s*20,-PR*1.2,s*16,-PR*1.9);c.quadraticCurveTo(s*12,-PR*1.2,s*2,-PR*.9);c.closePath();fillStroke(c,"#8E0A1F",2)});c.restore()};
    g.draw=(c,os,dp)=>{floorTex(c,d.seed,"#110C0F");WALLS.forEach(w=>drawWall(c,w));
      const all=os.concat([{id:U.myId,x:me.x,y:me.y,av:U.av,me:1}]);
      all.forEach(o=>{if(!isInf(o.id))return;const pr=.5+Math.sin(env.t*6+o.x)*.15;const gl=c.createRadialGradient(o.x,o.y,4,o.x,o.y,70);gl.addColorStop(0,`rgba(224,40,63,${pr})`);gl.addColorStop(1,"rgba(224,40,63,0)");c.fillStyle=gl;c.beginPath();c.arc(o.x,o.y,70,0,7);c.fill()});
      all.forEach(o=>{o.me?dp(c,o,true):dp(c,o,false);if(isInf(o.id))horns(c,o.x,o.y)})};
    g.debug=(c,circ)=>{const all=env.others().concat([{id:U.myId,x:me.x,y:me.y}]);all.forEach(o=>{if(isInf(o.id))circ(o.x,o.y,HB.catch,"#FF3B3B",1)})};
    g.mini=(c,x0,y0,sc)=>{env.others().forEach(o=>{c.fillStyle=isInf(o.id)?"#E0283F":"#E9DFCC";c.beginPath();c.arc(x0+o.x*sc,y0+o.y*sc,3.2,0,7);c.fill()})};
    g.finalText=()=>isInf(U.myId)?`Você capturou ${inf()[U.myId]||0}`:"Você sobreviveu à caçada!";
    return g},
  coroa(d,me,env){
    const g={};const WALLS=coroaWalls(d.seed);g.walls=()=>WALLS;g.spawn=(i,n)=>ringPos(i,n,560,360);
    const W=()=>U.W||{};let lastSt=0;
    g.speedMul=()=>W().h===U.myId?.88:1;
    g.update=()=>{const st=W().st||0;if(st!==lastSt){lastSt=st;if(W().h===U.myId)sfx.win();else sfx.slash()}};
    g.hud=()=>`${Math.round(((W().s||{})[U.myId]||0)/10)} s de rei`;
    g.extra=()=>{const h=W().h;const p=U.V&&U.V.pl.find(x=>x.id===h);return h===U.myId?"VOCÊ É O REI. Fuja!":p?`Rei: ${p.n}`:""};
    const pos=(id,os)=>id===U.myId?{x:me.x,y:me.y}:os.find(o=>o.id===id);
    g.draw=(c,os,dp)=>{floorTex(c,d.seed,"#15100E");WALLS.forEach(w=>drawWall(c,w));const h=W().h;
      const all=os.concat([{id:U.myId,x:me.x,y:me.y,av:U.av,me:1}]);
      all.forEach(o=>{if(o.id===h){const gl=c.createRadialGradient(o.x,o.y,5,o.x,o.y,80);gl.addColorStop(0,"rgba(242,193,78,.45)");gl.addColorStop(1,"rgba(242,193,78,0)");c.fillStyle=gl;c.beginPath();c.arc(o.x,o.y,80,0,7);c.fill()}
        o.me?dp(c,o,true):dp(c,o,false);
        if(o.id===h){c.save();c.translate(o.x,o.y-PR*1.9);if(W().im)c.globalAlpha=.6+Math.sin(env.t*20)*.3;c.beginPath();c.moveTo(-16,8);c.lineTo(-16,-6);c.lineTo(-8,2);c.lineTo(0,-10);c.lineTo(8,2);c.lineTo(16,-6);c.lineTo(16,8);c.closePath();fillStroke(c,"#F2C14E",3);c.restore()}})};
    g.debug=(c,circ)=>{const h=pos(W().h,env.others());if(h)circ(h.x,h.y,HB.steal,"#F2C14E",1)};
    g.mini=(c,x0,y0,sc)=>{const h=pos(W().h,env.others());if(h){c.fillStyle="#F2C14E";c.beginPath();c.arc(x0+h.x*sc,y0+h.y*sc,6,0,7);c.fill()}};
    g.finalText=()=>g.hud();
    return g},
  naoolhe(d,me,env,ctx0){
    const tomb=naoOlheMap(d.seed);let t=0,fin=null,cg=0,lastCg=0;const g={aim:true,noDash:true};const span=1480-70;
    const dark=document.createElement("canvas");dark.width=WW;dark.height=WH;const dc=dark.getContext("2d");
    g.walls=()=>tomb;g.spawn=(i,n)=>[70,laneY(i,n)];
    g.speedMul=()=>fin!==null?0:.95;
    g.update=dt=>{t+=dt;const c=((U.W||{}).cg||{})[U.myId]||0;if(c>lastCg){lastCg=c;cg=c;me.x=70;me.stun=.6;hurt(1.2);sfx.scream();env.shake(16)}
      if(fin===null&&me.x>=1480){fin=t;sfx.win();drips(12)}};
    const prog=()=>clamp((me.x-70)/span,0,1);
    g.score=()=>fin!==null?2000+Math.round((TYPES.naoolhe.dur/1000-fin)*10):Math.round(prog()*1000);
    g.hud=()=>fin!==null?"Escapou!":`${Math.round(prog()*100)}%`;
    g.extra=()=>`pego ${cg} vez${cg===1?"":"es"} · ${matchMedia("(pointer:coarse)").matches?"a lanterna aponta pra onde você anda":"aponte a lanterna com o mouse"}`;
    g.drawsAbilities=true;
    g.draw=(c,os,dp,drawAb)=>{const W=U.W||{};floorTex(c,d.seed,"#10140F");
      c.fillStyle="rgba(127,175,106,.12)";c.fillRect(1480,0,WW-1480,WH);c.strokeStyle="#7FAF6A";c.lineWidth=5;c.beginPath();c.moveTo(1480,0);c.lineTo(1480,WH);c.stroke();
      for(let y=20;y<WH;y+=40){c.fillStyle="#2E2129";c.fillRect(1476,y,8,24)}
      tomb.forEach(s=>{c.fillStyle="#030203";c.fillRect(s.x,s.y+5,s.w,s.h);c.beginPath();c.moveTo(s.x,s.y+s.h);c.lineTo(s.x,s.y+s.w/2);c.arc(s.x+s.w/2,s.y+s.w/2,s.w/2,Math.PI,0);c.lineTo(s.x+s.w,s.y+s.h);c.closePath();fillStroke(c,"#4A3C44",3);c.fillStyle="rgba(3,2,3,.5)";c.fillRect(s.x+s.w/2-2,s.y+s.w/2,4,s.h*.4);c.fillRect(s.x+s.w/2-8,s.y+s.w/2+6,16,4)});
      drawAb();
      const cx=W.cx??1150,cy=W.cy??CY;
      c.save();c.translate(cx,cy);c.fillStyle="#EDE3D1";c.beginPath();c.moveTo(-14,40);c.lineTo(-20,-10);c.quadraticCurveTo(0,-50,20,-10);c.lineTo(14,40);c.lineTo(8,28);c.lineTo(0,42);c.lineTo(-8,28);c.closePath();c.fill();c.lineWidth=3;c.strokeStyle="#030203";c.stroke();
      c.fillStyle="#030203";c.beginPath();c.ellipse(-7,-14,5,8,0,0,7);c.ellipse(7,-14,5,8,0,0,7);c.fill();c.beginPath();c.ellipse(0,4,6,10,0,0,7);c.fill();c.restore();
      const all=os.concat([{id:U.myId,x:me.x,y:me.y,a:me.a,av:U.av,me:1}]);
      all.forEach(o=>o.me?dp(c,o,true):dp(c,o,false));
      if(!env.spect){dc.globalCompositeOperation="source-over";dc.clearRect(0,0,WW,WH);dc.fillStyle="rgba(2,1,2,.94)";dc.fillRect(0,0,WW,WH);dc.globalCompositeOperation="destination-out";
      all.forEach(o=>{const a=o.a||0,L=520;const gr=dc.createRadialGradient(o.x,o.y,10,o.x,o.y,L);gr.addColorStop(0,"rgba(0,0,0,1)");gr.addColorStop(1,"rgba(0,0,0,0)");dc.fillStyle=gr;dc.beginPath();dc.moveTo(o.x,o.y);dc.arc(o.x,o.y,L,a-.42,a+.42);dc.closePath();dc.fill();
        const g2=dc.createRadialGradient(o.x,o.y,5,o.x,o.y,80);g2.addColorStop(0,"rgba(0,0,0,.9)");g2.addColorStop(1,"rgba(0,0,0,0)");dc.fillStyle=g2;dc.beginPath();dc.arc(o.x,o.y,80,0,7);dc.fill()});
      dc.globalCompositeOperation="source-over";c.drawImage(dark,0,0)}
      const lit=W.sn;c.fillStyle=lit?"rgba(227,38,63,.25)":"#E3263F";c.shadowColor="#E3263F";c.shadowBlur=lit?0:14;c.beginPath();c.arc(cx-7,cy-14,2.6,0,7);c.arc(cx+7,cy-14,2.6,0,7);c.fill();c.shadowBlur=0;
      c.font=BODY(14,900);c.textAlign="center";c.fillStyle=lit?"#7FAF6A":"#E3263F";c.fillText(lit?"ela congelou":"ela está vindo",cx,cy+62)};
    g.debug=(c)=>{const W=U.W||{},C=HB.creature;const cx=W.cx??1150,cy=W.cy??CY;c.beginPath();c.ellipse(cx,cy+C.oy,C.rx,C.ry,0,0,7);c.strokeStyle="#FF3B3B";c.stroke();
      c.beginPath();c.moveTo(me.x,me.y);c.arc(me.x,me.y,520,me.a-.42,me.a+.42);c.closePath();c.strokeStyle="rgba(255,212,0,.5)";c.stroke()};
    g.mini=(c,x0,y0,sc)=>{const W=U.W||{};c.fillStyle="rgba(127,175,106,.5)";c.fillRect(x0+1480*sc,y0,(WW-1480)*sc,WH*sc);c.fillStyle="#EDE3D1";c.beginPath();c.arc(x0+(W.cx??1150)*sc,y0+(W.cy??CY)*sc,5,0,7);c.fill()};
    g.finalText=()=>fin!==null?"Você escapou pelo portão!":g.hud()+" do caminho";
    return g},
  altar(d,me,env,ctx0){
    const n=ctx0.n,r=mulberry32(d.seed^0x5a);const spot=()=>freeSpot(r,ALTAR_WALLS,90);
    const syms=Array.from({length:14},()=>{const [x,y]=spot();return {x,y,s:Math.floor(r()*4),cd:0}});
    let carry=-1,t=0,inAltar=null;const g={noDash:true};
    g.walls=()=>ALTAR_WALLS;
    g.spawn=(i)=>{const [x,y]=altarPos(i,n);return [x+(CX-x)*.15,y+(CY-y)*.15]};
    g.space=()=>{if(carry>=0){carry=-1;sfx.tap()}};
    g.update=dt=>{t+=dt;const W=U.W||{},al=W.al||{};
      syms.forEach(s=>{if(s.cd>0){s.cd-=dt;if(s.cd<=0){const [x,y]=spot();s.x=x;s.y=y;s.s=Math.floor(r()*4)}}else if(carry<0&&dist(s.x,s.y,me.x,me.y)<HB.sym+PR){carry=s.s;s.cd=1.6;sfx.tap()}});
      let now=null;for(const id in ctx0.sl){const [ax,ay]=altarPos(ctx0.sl[id],n);if(dist(ax,ay,me.x,me.y)<HB.altar+PR*.5){now=id;break}}
      if(now&&now!==inAltar&&carry>=0){const mine=al[U.myId];
        if(now===U.myId){if(mine&&+mine[2][mine[0]]===carry){env.pushEv({t:"pl",s:carry});carry=-1;sfx.candle(mine[0]);if(mine[0]===3){sfx.win();drips(8)}}else toast("Esse símbolo não é o próximo selo")}
        else{env.pushEv({t:"sb",to:now});carry=-1;slashFx()}}
      inAltar=now};
    g.hud=()=>{const a=((U.W||{}).al||{})[U.myId];return a?`${a[1]} altar${a[1]===1?"":"es"} · ${a[0]}/4`:"—"};
    g.extra=()=>carry>=0?`carregando: ${SYM_N[carry]} · espaço descarta`:"pegue um símbolo";
    g.draw=(c,os,dp)=>{const W=U.W||{},al=W.al||{};floorTex(c,d.seed,"#130E14");
      c.strokeStyle="rgba(138,107,176,.25)";c.lineWidth=3;c.beginPath();c.ellipse(CX,CY,640,380,0,0,7);c.stroke();
      c.beginPath();c.arc(CX,CY,70,0,7);fillStroke(c,"#211820",4);c.fillStyle="rgba(138,107,176,.35)";c.beginPath();c.arc(CX,CY,50+Math.sin(t*2)*6,0,7);c.fill();
      ALTAR_WALLS.forEach(w=>drawWall(c,w));
      syms.forEach(s=>{if(s.cd>0)return;const bob=Math.sin(t*3+s.x)*4;c.beginPath();c.arc(s.x,s.y+bob,HB.sym+2,0,7);fillStroke(c,"#211820",3);drawSym(c,s.s,s.x,s.y+bob,12,true)});
      for(const id in ctx0.sl){const i=ctx0.sl[id],[ax,ay]=altarPos(i,n),a=al[id],pl=U.V.pl.find(p=>p.id===id);const mine=id===U.myId;
        c.beginPath();c.arc(ax,ay,HB.altar,0,7);fillStroke(c,mine?"#3D2B35":"#2E2129",4);if(mine){c.strokeStyle="#F2C14E";c.lineWidth=3;c.setLineDash([6,5]);c.beginPath();c.arc(ax,ay,HB.altar+8,0,7);c.stroke();c.setLineDash([])}
        if(a)for(let j=0;j<4;j++){const ang=-Math.PI/2+j*Math.PI/2,sx=ax+Math.cos(ang)*28,sy=ay+Math.sin(ang)*28;c.beginPath();c.arc(sx,sy,11,0,7);fillStroke(c,j<a[0]?"#F2C14E":"#161013",2);if(mine||j<a[0])drawSym(c,+a[2][j],sx,sy,7,false)}
        c.font=BODY(12,900);c.textAlign="center";c.fillStyle=mine?"#F2C14E":"#A8959B";c.fillText(mine?"SEU ALTAR":(pl?pl.n:""),ax,ay-HB.altar-10)}
      os.forEach(o=>{dp(c,o,false);if(o.car>=0&&o.car!==undefined)drawSym(c,o.car,o.x+18,o.y-24,8,true)});
      dp(c,{x:me.x,y:me.y,av:U.av},true);if(carry>=0){c.beginPath();c.arc(me.x+20,me.y-26,13,0,7);fillStroke(c,"#211820",2);drawSym(c,carry,me.x+20,me.y-26,9,true)}};
    g.debug=(c,circ)=>{for(const id in ctx0.sl){const [ax,ay]=altarPos(ctx0.sl[id],n);circ(ax,ay,HB.altar+PR*.5,"#B388FF",1)}syms.forEach(s=>{if(s.cd<=0)circ(s.x,s.y,HB.sym+PR,"#FFD400",1)})};
    g.mini=(c,x0,y0,sc)=>{for(const id in ctx0.sl){const [ax,ay]=altarPos(ctx0.sl[id],n);c.fillStyle=id===U.myId?"#F2C14E":"#8A6BB0";c.fillRect(x0+ax*sc-3,y0+ay*sc-3,6,6)}};
    g.finalText=()=>g.hud();
    return g},
  reliquia(d,me,env,ctx0){
    const n=ctx0.n;let t=0,onPlate=null,lastDv=0,lastDp=0;const g={};
    const W=()=>U.W||{};
    g.walls=()=>relWalls(W().g||[1,1]);
    g.spawn=(i)=>{const [x,y]=relAltar(i,n);return [x+(CX-x)*.12,y+(CY-y)*.12]};
    g.speedMul=()=>{let m=1;const r=W().r;if(r&&r[2]===U.myId)m*=.8;const tr=W().tr||[0,0];for(let i=0;i<2;i++)if(tr[i]&&circleHitsRect(me.x,me.y,PR,REL.traps[i]))m*=.4;return m};
    g.update=dt=>{t+=dt;const w=W();
      let now=null;for(const p of REL.plates)if(dist(p.x,p.y,me.x,me.y)<HB.plate+PR*.4)now="g"+p.i;for(const l of REL.levers)if(dist(l.x,l.y,me.x,me.y)<HB.plate+PR*.4)now="t"+l.i;
      if(now&&now!==onPlate){env.pushEv(now[0]==="g"?{t:"gate",i:+now[1]}:{t:"trap",i:+now[1]});sfx.creak()}onPlate=now;
      if((w.dv||0)>lastDv){lastDv=w.dv;sfx.bell()}if((w.dp||0)>lastDp){lastDp=w.dp;sfx.stab()}};
    g.hud=()=>`${(W().dl||{})[U.myId]||0} entregas`;
    g.extra=()=>{const r=W().r;if(!r)return "";if(r[2]===U.myId)return "VOCÊ ESTÁ COM A RELÍQUIA · corra pro seu altar";const p=r[2]&&U.V.pl.find(x=>x.id===r[2]);return p?`${p.n} está com a relíquia · espaço derruba`:"a relíquia está livre"};
    const relPos=()=>{const r=W().r||[CX,CY,null];if(r[2]===U.myId)return [me.x,me.y,true];const o=r[2]&&env.others().find(x=>x.id===r[2]);return o?[o.x,o.y,true]:[r[0],r[1],!!r[2]]};
    g.draw=(c,os,dp)=>{const w=W();floorTex(c,d.seed,"#140F12");
      const tr=w.tr||[0,0];REL.traps.forEach((r,i)=>{c.fillStyle=tr[i]?"rgba(227,38,63,.45)":"rgba(237,227,209,.05)";c.fillRect(r.x,r.y,r.w,r.h);c.fillStyle=tr[i]?"#EDE3D1":"#3D2B35";for(let x=r.x+8;x<r.x+r.w;x+=14)for(let y=r.y+10;y<r.y+r.h;y+=16){c.beginPath();c.moveTo(x-4,y+4);c.lineTo(x,y-(tr[i]?8:2));c.lineTo(x+4,y+4);c.fill()}});
      REL.walls.forEach(x=>drawWall(c,x));const gs=w.g||[1,1];REL.gates.forEach((gt,i)=>{if(gs[i]===0){c.fillStyle="#030203";for(let x=gt.x+6;x<gt.x+gt.w;x+=14)c.fillRect(x,gt.y,6,gt.h);c.fillStyle="#6B5560";c.fillRect(gt.x,gt.y+gt.h/2-3,gt.w,6)}else{c.strokeStyle="rgba(237,227,209,.18)";c.setLineDash([6,6]);c.strokeRect(gt.x,gt.y,gt.w,gt.h);c.setLineDash([])}});
      REL.plates.forEach(p=>{c.beginPath();c.arc(p.x,p.y,HB.plate,0,7);fillStroke(c,"#6B5560",3);c.font=BODY(11,900);c.textAlign="center";c.fillStyle="#EDE3D1";c.fillText("PORTÃO",p.x,p.y+4)});
      REL.levers.forEach(l=>{c.beginPath();c.arc(l.x,l.y,HB.plate,0,7);fillStroke(c,"#6D0716",3);c.font=BODY(10,900);c.textAlign="center";c.fillStyle="#EDE3D1";c.fillText("ARMADILHA",l.x,l.y+4)});
      for(const id in ctx0.sl){const [ax,ay]=relAltar(ctx0.sl[id],n);const mine=id===U.myId;c.beginPath();c.arc(ax,ay,HB.altar,0,7);fillStroke(c,mine?"#3D2B35":"#211820",4);
        if(mine){c.strokeStyle="#F2C14E";c.lineWidth=3;c.setLineDash([6,5]);c.beginPath();c.arc(ax,ay,HB.altar+8,0,7);c.stroke();c.setLineDash([])}
        const pl=U.V.pl.find(p=>p.id===id);c.font=BODY(12,900);c.textAlign="center";c.fillStyle=mine?"#F2C14E":"#A8959B";c.fillText(mine?"SEU ALTAR":(pl?pl.n:""),ax,ay+4)}
      os.forEach(o=>dp(c,o,false));dp(c,{x:me.x,y:me.y,av:U.av},true);
      const [rx,ry,car]=relPos();
      c.save();c.translate(rx,ry-(car?32:0));c.shadowColor="#F2C14E";c.shadowBlur=20;c.beginPath();c.moveTo(-12,10);c.lineTo(12,10);c.lineTo(7,-2);c.quadraticCurveTo(14,-14,10,-20);c.lineTo(-10,-20);c.quadraticCurveTo(-14,-14,-7,-2);c.closePath();fillStroke(c,"#F2C14E",3);c.shadowBlur=0;c.beginPath();c.arc(0,-11,4,0,7);c.fillStyle="#C8102E";c.fill();c.restore()};
    g.debug=(c,circ)=>{const [rx,ry,car]=relPos();circ(rx,ry,car?HB.knock:HB.relic,"#F2C14E",1);REL.traps.forEach(r=>{c.strokeStyle="#FF3B3B";c.strokeRect(r.x,r.y,r.w,r.h)});REL.plates.concat(REL.levers).forEach(p=>circ(p.x,p.y,HB.plate+PR*.4,"#B388FF",1));
      for(const id in ctx0.sl){const [ax,ay]=relAltar(ctx0.sl[id],n);circ(ax,ay,HB.altar+PR*.5,"#B388FF",1)}};
    g.mini=(c,x0,y0,sc)=>{for(const id in ctx0.sl){const [ax,ay]=relAltar(ctx0.sl[id],n);c.fillStyle=id===U.myId?"#F2C14E":"#6B5560";c.fillRect(x0+ax*sc-3,y0+ay*sc-3,6,6)}const [rx,ry]=relPos();c.fillStyle="#F2C14E";c.beginPath();c.moveTo(x0+rx*sc,y0+ry*sc-6);c.lineTo(x0+rx*sc+5,y0+ry*sc);c.lineTo(x0+rx*sc,y0+ry*sc+6);c.lineTo(x0+rx*sc-5,y0+ry*sc);c.fill()};
    g.finalText=()=>g.hud();
    return g}
};
