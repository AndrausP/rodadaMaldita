const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const c=await b.newContext({viewport:{width:1400,height:900}});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.goto('http://localhost:3000/maldita.html');await p.waitForTimeout(800);
// A. avatar x hitbox
const av=await p.evaluate(()=>{const out=[];const S=6,R=PR*S,size=R*6;const cv=document.createElement('canvas');cv.width=size;cv.height=size;const x=cv.getContext('2d');
  const measure=code=>{x.clearRect(0,0,size,size);drawAvatar(x,code,size/2,size/2,R);const d=x.getImageData(0,0,size,size).data;let tot=0,ins=0,rs=[];
    for(let yy=0;yy<size;yy+=2)for(let xx=0;xx<size;xx+=2){if(d[(yy*size+xx)*4+3]>40){tot++;const r=Math.hypot(xx-size/2,yy-size/2)/S;rs.push(r);if(r<=PR)ins++}}rs.sort((a,b)=>a-b);return {inside:Math.round(ins/tot*100),p95:+(rs[Math.floor(rs.length*.95)]).toFixed(1),max:+rs[rs.length-1].toFixed(1)}};
  for(let f=0;f<8;f++){out.push({rosto:AV.f[f],...measure(`${f}0000`)})}
  const acc=[];for(let a=1;a<7;a++)acc.push({adorno:AV.a[a],...measure(`00${0}${a}0`)});
  return {faces:out,acc}});
console.log('AVATAR (PR='+20+')');console.table(av.faces);console.table(av.acc);
// B. unit tests
const ut=await p.evaluate(()=>{const R=[];const ok=(n,v)=>R.push([n,v?'OK':'FALHOU']);
  // parede
  let o={x:105,y:100};const wall={x:100,y:50,w:80,h:100};collideRect(o,PR,wall);ok('parede empurra pra fora (sem sobreposição)',!circleHitsRect(o.x,o.y,PR-0.01,wall));
  o={x:90,y:100};collideRect(o,PR,wall);ok('parede: círculo encostando termina tangente',Math.abs((wall.x-o.x)-PR)<0.01);
  // bots separados
  const bb={a:{x:500,y:500},b:{x:510,y:505},c:{x:505,y:495}};for(let i=0;i<6;i++)separateBots(bb,[]);const ids=Object.keys(bb);let minD=1e9;for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)minD=Math.min(minD,dist(bb[ids[i]].x,bb[ids[i]].y,bb[ids[j]].x,bb[ids[j]].y));ok(`bots não se sobrepõem (menor distância ${minD.toFixed(1)} ≥ ${2*PR-1})`,minD>=2*PR-1);
  // roubo coroa
  ok(`coroa: encostar (distância 40 = 2 raios) rouba`,40<HB.steal);ok(`coroa: 50 de distância não rouba`,!(50<HB.steal));
  // criatura
  const C=HB.creature;ok('criatura: jogador tocando a lateral do corpo é pego',circleHitsEllipse(1000+C.rx+PR-1,500+C.oy,PR,1000,500+C.oy,C.rx,C.ry));
  ok('criatura: 10 px além da lateral não é pego',!circleHitsEllipse(1000+C.rx+PR+10,500+C.oy,PR,1000,500+C.oy,C.rx,C.ry));
  ok('criatura: tocando o topo da cabeça é pego',circleHitsEllipse(1000,500+C.oy-C.ry-PR+1,PR,1000,500+C.oy,C.rx,C.ry));
  // armadilha retangular
  ok('armadilha: borda do círculo dentro da área conta',circleHitsRect(REL.traps[0].x-PR+2,REL.traps[0].y+20,PR,REL.traps[0]));
  // mira
  const env={W:800,H:600,S:1,splat(){},shake(){}};const g=GAMES.mira(env,mulberry32(1));g.targets.push({x:400,y:300,age:.2,life:1.5,c:"#fff"});const Rr=Math.max(26,38*env.S);
  g.down(400,300-Rr*.6-2);ok('olho: clique na borda de cima do olho acerta',g.hits===1);
  g.targets.push({x:400,y:300,age:.2,life:1.5,c:"#fff"});g.down(400,300-Rr*.9);ok('olho: clique acima do olho (antes contava) agora erra',g.hits===1);
  g.down(400+Rr+2,300);ok('olho: canto do olho acerta',g.hits===2);
  // mapas dentro do mundo
  const inside=w=>w.x>=0&&w.y>=0&&w.x+w.w<=WW&&w.y+w.h<=WH;ok('paredes dentro do mapa',COROA_WALLS.every(inside)&&REL.walls.every(inside)&&ALTAR_WALLS.every(inside));
  // altares e placas livres de parede
  let free=true;for(let n=1;n<=12;n++)for(let i=0;i<n;i++){const [x,y]=relAltar(i,n);if(relWalls([0,0]).some(w=>circleHitsRect(x,y,HB.altar+PR,w))||REL.plates.concat(REL.levers).some(q=>dist(q.x,q.y,x,y)<HB.altar+HB.plate))free=false}ok('altares da relíquia livres de paredes e placas (1 a 12 jogadores)',free);
  free=true;for(let n=1;n<=12;n++)for(let i=0;i<n;i++){const [x,y]=altarPos(i,n);if(ALTAR_WALLS.some(w=>circleHitsRect(x,y,HB.altar,w))||x<HB.altar||y<HB.altar||x>WW-HB.altar||y>WH-HB.altar)free=false}ok('altares dos selos dentro do mapa e livres (1 a 12 jogadores)',free);
  ok('placas e alavancas fora das paredes',REL.plates.concat(REL.levers).every(q=>!relWalls([0,0]).some(w=>circleHitsRect(q.x,q.y,HB.plate,w))));
  return R});
console.log('TESTES');ut.forEach(r=>console.log(r[1].padEnd(7),r[0]));
// C. screenshots com hitbox
await p.click('[data-act=solo]');await p.waitForTimeout(400);
for(const k of ["reliquia","coroa","naoolhe","altar","chao","corrida","flap","mira","meteoro"]){
  await p.evaluate(k=>{U.hitbox=true;H.cfg.count=1;H.plan=[k];H.r=0;H.R=1;nextRound();playPhase()},k);await p.waitForTimeout(600);
  if(["reliquia","coroa","naoolhe","altar","chao"].includes(k)){await p.evaluate(()=>{if(H.world&&H.world.ab){H.world.ab.own[U.myId]="shock";H.world.ab.next=0}});}
  for(let i=0;i<12;i++){await p.keyboard.down(i<6?'ArrowRight':'ArrowDown');await p.waitForTimeout(90);await p.keyboard.up(i<6?'ArrowRight':'ArrowDown');if(k==='flap')await p.keyboard.press('Space')}
  if(["reliquia","coroa"].includes(k)){await p.keyboard.press('KeyE');await p.waitForTimeout(250)}
  await p.waitForTimeout(1200);
  await p.screenshot({path:`/tmp/claude-0/hb_${k}.png`});
}
const abTest=await p.evaluate(()=>({own:H.world&&H.world.ab?Object.keys(H.world.ab.own).length:-1}));
console.log('errs',errs);await b.close()})();
