/* ============================================================
   PROVAÇÕES
   cat: ans (resposta), arcade (canvas local), arena (mapa compartilhado), dom (quebra-cabeça)
   ============================================================ */
const TYPES={
  quiz:{n:"Interrogatório",c:"var(--blood-2)",cat:"ans",dur:15000,r:"A voz na escuridão pergunta. Responda certo e rápido pra colher mais almas."},
  conta:{n:"Contagem de Ossos",c:"var(--candle)",cat:"ans",dur:20000,r:"Resolva a conta dos ossos e digite o resultado. Pode tentar de novo."},
  anag:{n:"Nome Amaldiçoado",c:"var(--moss)",cat:"ans",dur:35000,r:"As letras do nome maldito foram embaralhadas. Descubra a palavra."},
  est:{n:"Profecia",c:"var(--bruise)",cat:"ans",dur:20000,r:"Ninguém sabe o número exato. Quem chegar mais perto leva mais almas."},
  ref:{n:"Sobressalto",c:"var(--frost)",cat:"ans",dur:10000,r:"Espere no escuro. Quando os olhos abrirem, ataque. Atacar antes custa uma alma."},
  tap:{n:"Coração Disparado",c:"var(--blood-2)",cat:"arcade",dur:8000,r:"Bata no coração o máximo que conseguir em 8 segundos.",ctl:"Toque, clique ou espaço"},
  seq:{n:"Velas do Ritual",c:"var(--candle)",cat:"ans",dur:14000,r:"As velas acendem numa ordem. Repita a sequência sem errar."},
  mira:{n:"Olhos no Escuro",c:"var(--blood-2)",cat:"arcade",dur:25000,r:"Olhos se abrem na escuridão. Fure todos antes que fechem. Errar custa pontos.",ctl:"Clique ou toque nos olhos"},
  corrida:{n:"Fuga do Cemitério",c:"var(--moss)",cat:"arcade",dur:30000,r:"Corra entre as lápides e caixões. Pegue as almas perdidas. Bater te atrasa.",ctl:"Setas ← → ou A/D · no celular, toque no lado"},
  flap:{n:"Voo do Morcego",c:"var(--bruise)",cat:"arcade",dur:30000,r:"Passe entre as colunas de ossos. Se bater, recomeça. Vale seu melhor voo.",ctl:"Clique, toque ou espaço"},
  meteoro:{n:"Exorcismo",c:"var(--frost)",cat:"arcade",dur:35000,r:"Espíritos cercam sua lanterna. Destrua antes que te alcancem. Os grandes se partem.",ctl:"Mire e segure pra atirar · teclado: ← → e espaço"},
  covas:{n:"Mãos da Cova",c:"var(--moss)",cat:"arcade",dur:25000,nw:1,r:"Mãos brotam das covas. Esmague todas antes que afundem. Não acerte as almas inocentes.",ctl:"Clique ou toque nas mãos · no teclado, 1 a 9"},
  luz:{n:"Luz Vermelha Invertida",c:"var(--blood-2)",cat:"arena",dur:35000,nw:1,r:"Luz VERMELHA: ande sem parar. Luz VERDE: congele. Errar faz a coisa te puxar pra trás.",ctl:"Segure espaço ou → pra andar · no celular, o dedo na tela"},
  chao:{n:"Chão Falso",c:"#9A7F6A",cat:"arena",dur:35000,nw:1,r:"Algumas lajes desabam em ciclos. Decore o padrão e empurre os outros pro abismo.",ctl:"WASD ou setas · espaço empurra · E habilidade"},
  coroa:{n:"Rouba-Coroa",c:"var(--candle)",cat:"arena",dur:40000,nw:1,r:"Quem está com a coroa colhe almas a cada segundo. Encoste no rei pra roubar.",ctl:"WASD ou setas · espaço investida · E habilidade"},
  naoolhe:{n:"Não Olhe",c:"var(--frost)",cat:"arena",dur:45000,nw:1,r:"A criatura só anda quando ninguém ilumina ela. Atravesse o cemitério até o portão.",ctl:"WASD anda · mouse aponta a lanterna · E habilidade"},
  cabo:{n:"Cabo de Guerra Caótico",c:"var(--ember)",cat:"arena",dur:30000,nw:1,r:"Acerte a sequência de setas pra puxar a corda. Errar faz seu lado perder força.",ctl:"Setas do teclado ou os botões"},
  porta:{n:"Porta ou Morte",c:"var(--blood-2)",cat:"ans",dur:30000,nw:1,r:"Três portas: uma salva, uma castiga, uma mata. Leia as pistas espalhadas e escolha."},
  circulo:{n:"Último no Círculo",c:"var(--moss)",cat:"arena",dur:35000,nw:1,r:"Só o círculo de sal protege. Ele muda de lugar, de forma e às vezes se divide.",ctl:"WASD ou setas · espaço empurra · E habilidade"},
  altar:{n:"Altar dos Quatro Selos",c:"var(--bruise)",cat:"arena",dur:50000,nw:1,r:"Colete os símbolos na ordem do seu altar. Leve um símbolo ao altar rival pra quebrar um selo dele.",ctl:"WASD ou setas · passe por cima pra pegar · E habilidade"},
  vitral:{n:"Vitral das Almas",c:"var(--candle)",cat:"dom",dur:60000,nw:1,r:"Monte o vitral: cada peça no lugar certo e com a seta da luz apontando pra cima.",ctl:"Toque na peça pra girar · arraste pra trocar"},
  biblio:{n:"A Biblioteca que Mente",c:"var(--ember)",cat:"ans",dur:45000,nw:1,r:"Leia os livros. Exatamente um deles mente. Descubra a ordem verdadeira dos acontecimentos."},
  pacto:{n:"Pacto Sombrio",c:"var(--blood-2)",cat:"ans",dur:15000,nw:1,r:"Ofereça em segredo de 0 a 5 das suas almas. Se só você oferecer o maior valor, o pacto dobra a sua oferta e você leva as dos outros. Empate no topo: o pacto devora todas as ofertas."},
  suss:{n:"Sussurros",c:"var(--frost)",cat:"ans",dur:16000,nw:1,r:"Memorize os símbolos nas lápides. Depois elas se fecham e uma voz pergunta onde estava cada um."},
  cacada:{n:"Caçada",c:"var(--ember)",cat:"arena",dur:45000,nw:1,r:"Um de vocês começa possuído. Quem ele tocar vira caçador também. Sobreviva o máximo que puder ou capture o maior número de vivos.",ctl:"WASD ou setas · espaço investida · E habilidade"},
  reliquia:{n:"Roubo da Relíquia",c:"var(--blood-2)",cat:"arena",dur:50000,nw:1,r:"Leve a relíquia até o seu altar. Derrube quem carrega, feche portões e arme as armadilhas.",ctl:"WASD ou setas · espaço derruba · placas no chão · E habilidade"}
};
const TYPE_KEYS=Object.keys(TYPES);
const RANKED=new Set(["covas","tap","mira","corrida","flap","meteoro","luz","chao","circulo","naoolhe","vitral","coroa","altar","reliquia","cacada"]);
const CANVAS_GAMES=new Set(["covas","mira","corrida","flap","meteoro"]);
const ARENA_GAMES=new Set(["luz","chao","coroa","naoolhe","circulo","altar","reliquia","cacada"]);
const TEAMS=[{n:"Sangue",c:"#E3263F"},{n:"Vela",c:"#F2C14E"},{n:"Musgo",c:"#7FAF6A"},{n:"Névoa",c:"#8A6BB0"}];
const CANDLES=["#E3263F","#F2C14E","#7FAF6A","#7FB7C9"];
const ALMAS=[10,8,7,6,5,4,4,3,3,3,2,2,2,2,2,2];
const MAX_PLAYERS=12;
const ACCENT={CEMITERIO:"CEMITÉRIO",CAIXAO:"CAIXÃO",ASSOMBRACAO:"ASSOMBRAÇÃO",MALDICAO:"MALDIÇÃO",BOITATA:"BOITATÁ",TUMULO:"TÚMULO",VELORIO:"VELÓRIO",GRIMORIO:"GRIMÓRIO",MUMIA:"MÚMIA",POSSESSAO:"POSSESSÃO",NECROTERIO:"NECROTÉRIO",ABOBORA:"ABÓBORA",LAPIDE:"LÁPIDE",PORAO:"PORÃO",SACRIFICIO:"SACRIFÍCIO",MANICOMIO:"MANICÔMIO",RELIQUIA:"RELÍQUIA",GARGULA:"GÁRGULA",DEMONIO:"DEMÔNIO",ESPIRITO:"ESPÍRITO",FEITICO:"FEITIÇO",CALDEIRAO:"CALDEIRÃO",POCAO:"POÇÃO",SANATORIO:"SANATÓRIO",ESCURIDAO:"ESCURIDÃO",TROVAO:"TROVÃO",LAMPIAO:"LAMPIÃO",CAMPANARIO:"CAMPANÁRIO",OSSUARIO:"OSSUÁRIO",CADAVER:"CADÁVER",AUTOPSIA:"AUTÓPSIA",SONAMBULO:"SONÂMBULO",ALUCINACAO:"ALUCINAÇÃO",MEDIUM:"MÉDIUM",TARO:"TARÔ",RELOGIO:"RELÓGIO",PALHACO:"PALHAÇO",NEVOA:"NÉVOA"};
const MIND=new Set(["quiz","conta","anag","est","seq","porta","biblio","vitral","suss","pacto"]);
const SUSS_SYM=["skull","coroa","flame","reliquia","ref","tap","flap","meteoro","seq","est","biblio","porta","conta","cacada"];
const SUSS_N={skull:"a caveira",coroa:"a coroa",flame:"a chama",reliquia:"o cálice",ref:"o olho",tap:"o coração",flap:"o morcego",meteoro:"o fantasma",seq:"as velas",est:"a bola de cristal",biblio:"o livro",porta:"a porta",conta:"o osso",cacada:"as garras"};
const BOT_TAUNTS=["Vem me pegar!","Hahaha","Corre!","Tô chegando…","Sua alma é minha","Socorro!","Não olha pra trás","Essa foi perto","Cadê você?","Hoje não!"];
const BOT_NAMES=["Alma Perdida","Coveiro","Viúva","Sombra","Freira","Espantalho","Menino do Poço","Palhaço Triste"];

/* ============================================================
   GERADORES DE ENIGMAS
   ============================================================ */
const ROLE_N={s:"segura",p:"do castigo",d:"da morte"};
const DOOR_FEATS=[{k:"vela",n:"com a vela"},{k:"mao",n:"com a marca de mão"},{k:"olho",n:"com o olho pintado"},{k:"corrente",n:"com correntes"},{k:"cruz",n:"com a cruz invertida"}];
const POS_N=["da esquerda","do meio","da direita"];
function genDoors(){
  const perms=[];const R=["s","p","d"];
  for(const a of R)for(const b of R)for(const c of R)if(a!==b&&b!==c&&a!==c)perms.push([a,b,c]);
  const truth=perms[rnd(6)];const feats=shuffle(DOOR_FEATS).slice(0,3);
  const dn=i=>rnd(2)?`A porta ${POS_N[i]}`:`A porta ${feats[i].n}`;
  const pool=[];
  for(let i=0;i<3;i++)for(const r of R){
    pool.push({t:`${dn(i)} ${truth[i]===r?"é":"não é"} a ${ROLE_N[r]}.`,f:P=>(P[i]===r)===(truth[i]===r)});
  }
  for(const a of R)for(const b of R){if(a===b)continue;
    const ia=truth.indexOf(a),ib=truth.indexOf(b);
    pool.push({t:`A porta ${ROLE_N[a]} fica ${ia<ib?"à esquerda":"à direita"} da porta ${ROLE_N[b]}.`,f:P=>(P.indexOf(a)<P.indexOf(b))===(ia<ib)});
    pool.push({t:`A porta ${ROLE_N[a]} ${Math.abs(ia-ib)===1?"fica":"não fica"} ao lado da porta ${ROLE_N[b]}.`,f:P=>(Math.abs(P.indexOf(a)-P.indexOf(b))===1)===(Math.abs(ia-ib)===1)});
  }
  for(const r of R){const mid=truth.indexOf(r)===1;pool.push({t:`A porta ${ROLE_N[r]} ${mid?"está":"não está"} no meio.`,f:P=>(P.indexOf(r)===1)===mid})}
  for(let tries=0;tries<200;tries++){
    const cl=[];let cand=perms.slice();const p=shuffle(pool);
    for(const c of p){const next=cand.filter(c.f);if(next.length<cand.length&&next.length>=1){cl.push(c.t);cand=next}if(cand.length===1)break;if(cl.length>=4)break}
    if(cand.length===1&&cl.length>=2&&cl.length<=4&&cand[0].join()===truth.join())return {feats:feats.map(f=>f.k),clues:cl,truth};
  }
  return {feats:feats.map(f=>f.k),clues:[`A porta ${POS_N[truth.indexOf("s")]} é a segura.`,`A porta ${POS_N[truth.indexOf("d")]} é a da morte.`],truth};
}
function permsOf(a){if(a.length<=1)return [a];const out=[];a.forEach((x,i)=>permsOf(a.filter((_,j)=>j!==i)).forEach(p=>out.push([x,...p])));return out}
function genLibrary(){
  const evIdx=shuffle(LIB_EVENTS.map((_,i)=>i)).slice(0,3);const perms=permsOf([0,1,2]);
  for(let tries=0;tries<400;tries++){
    const truth=perms[rnd(6)];const liar=rnd(4);
    const stmts=[];
    const mk=(P)=>{const k=rnd(4),a=rnd(3);let b=rnd(3);while(b===a)b=rnd(3);
      if(k===0)return {t:`${cap(LIB_EVENTS[evIdx[a]])} aconteceu antes de ${LIB_EVENTS[evIdx[b]]}.`,f:Q=>Q.indexOf(a)<Q.indexOf(b)};
      if(k===1)return {t:`${cap(LIB_EVENTS[evIdx[a]])} foi o primeiro de todos.`,f:Q=>Q[0]===a};
      if(k===2)return {t:`${cap(LIB_EVENTS[evIdx[a]])} foi o último.`,f:Q=>Q[2]===a};
      return {t:`${cap(LIB_EVENTS[evIdx[a]])} não aconteceu no meio.`,f:Q=>Q[1]!==a}};
    let ok=true;
    for(let i=0;i<4;i++){let s,g=0;do{s=mk();g++}while(g<60&&(s.f(truth)!==(i!==liar)||stmts.some(x=>x.t===s.t)));if(g>=60){ok=false;break}stmts.push(s)}
    if(!ok)continue;
    const sols=perms.filter(P=>stmts.filter(s=>!s.f(P)).length===1);
    if(sols.length===1&&sols[0].join()===truth.join()){
      const books=shuffle(stmts.map((s,i)=>({t:s.t,title:LIB_TITLES[(evIdx[0]+i*3)%LIB_TITLES.length],year:1650+rnd(250),sym:rnd(4)})));
      const opts=shuffle(perms);
      return {ev:evIdx.map(i=>LIB_EVENTS[i]),books:books.map(b=>({t:b.t,ti:b.title,y:b.year,s:b.sym})),opts,ans:opts.findIndex(P=>P.join()===truth.join())};
    }
  }
  return genLibrary();
}
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);

/* ============================================================
   MOTOR DO MESTRE (roda só em quem criou a sala)
   ============================================================ */
let H=null;
function newHost(cfg){return {cfg,ph:"lobby",r:0,R:cfg.count,rid:"",round:null,pl:new Map(),seq:0,plan:[],used:{quiz:new Set(),est:new Set(),anag:new Set()},timer:null,goTimer:null,res:null,world:null,tick:null,botT:[]}}
function addPlayer(o){
  if(H.pl.has(o.id))return H.pl.get(o.id);
  if(activePlayers().length>=MAX_PLAYERS)return null;
  if(H.pl.size>=MAX_PLAYERS+4){const old=[...H.pl.values()].filter(p=>p.off).sort((a,b)=>a.sc-b.sc)[0];if(old)H.pl.delete(old.id)}
  const p={id:o.id,n:o.n,av:o.av||"00000",lv:clamp(Math.floor(+o.lv||0),0,99),tm:0,sc:0,rs:"",rp:0,rv:"",a:0,off:false,ak:"",bot:!!o.bot,ord:H.pl.size};
  p.tm=chooseTeam(o.tm);H.pl.set(o.id,p);return p;
}
function addBot(){
  const used=new Set([...H.pl.values()].map(p=>p.n));const n=BOT_NAMES.find(x=>!used.has(x))||("Alma "+rnd(99));
  return addPlayer({id:"bot-"+rnd(1e9),n,av:avRandom(),bot:true,lv:rnd(6)});
}
function chooseTeam(want){
  if(H.cfg.mode!=="times")return 0;const n=H.cfg.teams;if(want>=1&&want<=n)return want;
  const cnt=Array(n+1).fill(0);H.pl.forEach(p=>{if(!p.off&&p.tm)cnt[p.tm]++});let best=1;for(let t=2;t<=n;t++)if(cnt[t]<cnt[best])best=t;return best;
}
function pickUnused(kind,arr){const u=H.used[kind];if(u.size>=arr.length)u.clear();let i;do{i=rnd(arr.length)}while(u.has(i));u.add(i);return arr[i]}
function activePlayers(){return [...H.pl.values()].filter(p=>!p.off)}
function slotsMap(){const m={};activePlayers().sort((a,b)=>a.ord-b.ord).forEach((p,i)=>m[p.id]=i);return m}
function makeRound(k){
  const T=TYPES[k],seed=1+rnd(2**31-2);
  if(k==="quiz"){const [q,o]=pickUnused("quiz",QUIZ);const opts=shuffle(o);return {k,d:{q,o:opts},ans:opts.indexOf(o[0]),dur:T.dur}}
  if(k==="conta"){const t=rnd(3);let a,b,e,ans;
    if(t===0){a=12+rnd(78);b=12+rnd(78);e=`${a} + ${b}`;ans=a+b}else if(t===1){a=40+rnd(60);b=11+rnd(a-15);e=`${a} − ${b}`;ans=a-b}else{a=3+rnd(7);b=6+rnd(14);e=`${a} × ${b}`;ans=a*b}
    return {k,d:{e},ans,dur:T.dur}}
  if(k==="anag"){const [w,h]=pickUnused("anag",WORDS);let l;do{l=shuffle([...w]).join("")}while(l===w);return {k,d:{l,h,n:w.length},ans:w,dur:T.dur}}
  if(k==="est"){const [q,a,u]=pickUnused("est",EST);return {k,d:{q,u},ans:a,dur:T.dur}}
  if(k==="ref")return {k,d:{},ans:null,dur:T.dur};
  if(k==="tap")return {k,d:{},ans:null,dur:T.dur+1800};
  if(k==="seq"){const len=5+Math.min(2,Math.floor(H.r/6));const s=Array.from({length:len},()=>rnd(4));const show=len*650+900;return {k,d:{s,show},ans:s.join(""),dur:show+T.dur}}
  if(k==="pacto")return {k,d:{},ans:null,dur:T.dur};
  if(k==="suss"){const g=shuffle(SUSS_SYM).slice(0,9);const q=shuffle([0,1,2,3,4,5,6,7,8]).slice(0,3);const show=H.r>6?3200:4200;return {k,d:{g,q,show},ans:q.join(","),dur:show+T.dur}}
  if(k==="porta"){const g=genDoors();const notes=g.clues.map((_,i)=>i%2?{x:[1,32,61,90][(i>>1)%4]+rnd(3),y:70+rnd(6),r:rnd(30)-15}:{x:6+i*22+rnd(10),y:4+rnd(12),r:rnd(30)-15});return {k,d:{f:g.feats,c:g.clues,nt:notes},ans:g.truth,dur:T.dur}}
  if(k==="biblio"){const g=genLibrary();return {k,d:{ev:g.ev,b:g.books,o:g.opts},ans:g.ans,dur:T.dur}}
  const d={seed,sl:slotsMap()};
  if(k==="cabo"){const sides={};activePlayers().sort((a,b)=>a.ord-b.ord).forEach((p,i)=>{sides[p.id]=H.cfg.mode==="times"?((p.tm-1)%2):(i%2)});
    if(new Set(Object.values(sides)).size<2){const ids=Object.keys(sides);if(ids.length>1)sides[ids[ids.length-1]]=1-sides[ids[0]]}d.sides=sides}
  return {k,d,ans:null,dur:T.dur+(T.cat==="dom"?1500:2200)};
}
function planRounds(){
  const on=TYPE_KEYS.filter(k=>H.cfg.types[k]);const pool=on.length?on:TYPE_KEYS;const out=[];let bag=[];
  while(out.length<H.R){if(!bag.length)bag=shuffle(pool);let k=bag.pop();if(out.length&&k===out[out.length-1]&&bag.length){bag.unshift(k);k=bag.pop()}out.push(k)}
  for(let i=0;i<Math.min(2,out.length);i++)if(out[i]==="pacto"){const j=out.findIndex((x,idx)=>idx>=2&&x!=="pacto");if(j>0)[out[i],out[j]]=[out[j],out[i]]}
  return out;
}
function clearTimers(){clearTimeout(H.timer);clearTimeout(H.goTimer);H.botT.forEach(clearTimeout);H.botT=[];if(H.tick){clearInterval(H.tick);H.tick=null}}
function startGame(){
  H.R=H.cfg.count;H.r=0;H.plan=planRounds();H.aw=null;
  H.pl.forEach((p,id)=>{if(p.off)H.pl.delete(id);else{p.sc=0;p.rs="";p.rp=0;p.rv="";p.h=[];p.st=0;p.bst=0;p.bref=0}});
  nextRound();
}
function nextRound(){
  clearTimers();
  if(H.r>=H.R)return finalPhase();
  H.round=makeRound(H.plan[H.r]);H.r++;H.round.mult=(H.r===H.R&&H.R>=4)?2:(H.r>2&&H.r<H.R&&Math.random()<.1?2:1);H.rid=Math.random().toString(36).slice(2,8);H.res=null;H.world=null;
  H.pl.forEach(p=>{p.rs="";p.rp=0;p.rv="";p.a=0;p.t=null;p.v=null;p.ak="";p.late=null});
  H.ph="intro";H.seq++;commit();
  const rid=H.rid;H.timer=setTimeout(()=>{if(H&&H.rid===rid&&H.ph==="intro")playPhase()},introMs());
}
function playPhase(){
  clearTimeout(H.timer);const R=H.round;H.ph="play";R.start=performance.now();R.go=false;H.seq++;
  if(ARENA_HOST[R.k]||ARENA_GAMES.has(R.k)||R.k==="cabo"){H.world=(ARENA_HOST[R.k]||ARENA_HOST.generic).init(R);startWorldTick()}
  commit();
  const rid=H.rid;
  H.timer=setTimeout(()=>{if(H&&H.rid===rid&&H.ph==="play")revealPhase()},R.dur);
  if(R.k==="ref"){H.goTimer=setTimeout(()=>{if(H&&H.rid===rid&&H.ph==="play"){R.go=true;R.goAt=performance.now();H.seq++;commit();botsAfterGo()}},1800+rnd(3200))}
  scheduleBots();botLive();
}
const HOST_FINAL=["coroa","altar","reliquia","naoolhe","cacada"];
const botRv=(k,v)=>k==="luz"?(v>=2000?"escapou":`${Math.round(v/10)}%`):k==="vitral"?(v>=10000?"montou":`${Math.floor(v/100)} ${Math.floor(v/100)===1?"peça":"peças"}`):fmt(v);
function botLive(){const R=H.round,k=R.k;if(!RANKED.has(k)||HOST_FINAL.includes(k))return;const bots=activePlayers().filter(p=>p.bot);if(!bots.length)return;
  bots.forEach(b=>{b.fin=botScore(k);b.v=0;b.rv=""});const rid=H.rid,t0=performance.now(),dur=(CANVAS_GAMES.has(k)||ARENA_GAMES.has(k))?TYPES[k].dur:R.dur;
  const iv=setInterval(()=>{if(!H||H.rid!==rid||H.ph!=="play"){clearInterval(iv);return}const f=Math.min(1,(performance.now()-t0)/dur);
    bots.forEach(b=>{if(b.off)return;b.v=Math.max(b.v||0,Math.round(b.fin*Math.min(1,f*(.85+Math.random()*.3))));b.rv=botRv(k,b.v)});commitSoon()},1000);H.botT.push(iv)}
function startWorldTick(){
  let last=performance.now(),pub=0;const rid=H.rid;
  H.tick=setInterval(()=>{if(!H||H.rid!==rid||H.ph!=="play")return;const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;
    const ctrl=(ARENA_HOST[H.round.k]||ARENA_HOST.generic);ctrl.tick(H.world,dt,worldPlayers());
    if(ARENA_GAMES.has(H.round.k)&&Math.random()<dt/6){const bots=activePlayers().filter(p=>p.bot);if(bots.length){const b=bots[rnd(bots.length)];H.bsk=(H.bsk||0)+1;H.bsay=[b.id,BOT_TAUNTS[rnd(BOT_TAUNTS.length)],H.bsk]}}
    pub+=dt;if(pub>=.1){pub=0;const w=ctrl.pub(H.world);if(w&&H.bsay)w.bs=H.bsay;publishWorld(w)}
    if(H.world.end){H.world.end=false;clearTimeout(H.timer);H.timer=setTimeout(()=>{if(H&&H.rid===rid&&H.ph==="play")revealPhase()},900)}
  },50);
}
function worldPlayers(){
  const out=[];
  for(const p of activePlayers()){
    if(p.bot){const b=H.world&&H.world.b&&H.world.b[p.id];if(b)out.push({id:p.id,bot:true,...b});continue}
    if(p.id===U.myId){const m=arenaMe();if(m)out.push({id:p.id,x:m.x,y:m.y,a:m.a,d:m.dash,ev:m.evq,g:m.ghost>0?1:0});continue}
    const o=U.others[p.id];if(o&&o.r===H.rid)out.push({id:p.id,x:o.x,y:o.y,a:o.a,d:o.d,ev:o.ev,g:o.g});
  }
  return out;
}
const BOT_LV=[{n:"Fácil",m:.72,sp:.86,p:[.3,.35,.3,.4,.2,.25],spread:.65,ref:[330,700],early:.15},{n:"Normal",m:1,sp:1,p:[.5,.55,.5,.6,.4,0],spread:.45,ref:[230,490],early:.1},{n:"Pesadelo",m:1.3,sp:1.12,p:[.78,.82,.75,.85,.7,.6],spread:.18,ref:[185,320],early:.04}];
const botLv=()=>BOT_LV[H&&H.cfg&&H.cfg.bd!==undefined?H.cfg.bd:1]||BOT_LV[1];
function scheduleBots(){
  const R=H.round,k=R.k,bots=activePlayers().filter(p=>p.bot);if(!bots.length)return;const rid=H.rid;const L=botLv(),P=L.p,q=1/L.m;
  const at=(ms,fn)=>H.botT.push(setTimeout(()=>{if(H&&H.rid===rid&&H.ph==="play")fn()},ms*q));
  bots.forEach(b=>{const r=Math.random();
    if(k==="quiz")at(2500+rnd(8000),()=>onAnswer(b.id,r<P[0]?R.ans:rnd(4),""));
    else if(k==="conta")at(5000+rnd(12000),()=>onAnswer(b.id,r<P[1]?R.ans:R.ans+1+rnd(9),""));
    else if(k==="anag"){if(r<P[2])at(8000+rnd(20000),()=>onAnswer(b.id,R.ans,""))}
    else if(k==="est")at(3000+rnd(9000),()=>{const g=R.ans*(1-L.spread+Math.random()*L.spread*2);onAnswer(b.id,Number.isInteger(R.ans)?Math.round(g):Math.round(g*10)/10,"")});
    else if(k==="seq")at(R.d.show+2500+rnd(5000),()=>onAnswer(b.id,r<P[3]?R.ans:R.ans.split("").reverse().join(""),""));
    else if(k==="pacto")at(2000+rnd(8000),()=>{const mx=Math.min(5,b.sc);const L2=botLv();onAnswer(b.id,mx<=0?0:Math.min(mx,Math.floor(Math.random()*(mx+1)*(L2.m>1?1.15:L2.m<1?.7:1))),"")});
    else if(k==="suss")at(R.d.show+3000+rnd(8000),()=>onAnswer(b.id,R.d.q.map(c=>Math.random()<P[3]?c:rnd(9)).join(","),""));
    else if(k==="porta")at(6000+rnd(14000),()=>onAnswer(b.id,r<P[5]?R.ans.indexOf("s"):rnd(3),""));
    else if(k==="biblio")at(12000+rnd(20000),()=>onAnswer(b.id,r<P[4]?R.ans:rnd(6),""));
  });
}
function botsAfterGo(){const L=botLv();activePlayers().filter(p=>p.bot).forEach(b=>{const rid=H.rid;H.botT.push(setTimeout(()=>{if(H&&H.rid===rid&&H.ph==="play")onAnswer(b.id,Math.random()<L.early?-1:L.ref[0]+rnd(L.ref[1]-L.ref[0]),"")},200+rnd(300)))})}
function botScore(k){const m=botLv().m;const R=(a,b)=>Math.round((a+Math.random()*(b-a))*m);
  return {covas:R(900,2600),tap:R(28,62),mira:R(1200,3800),corrida:R(350,900),flap:R(1,11),meteoro:R(250,1300),luz:Math.min(1000,R(300,1000)),chao:R(120,320),circulo:R(120,330),vitral:R(200,700)}[k]||0}

function onAnswer(id,v,key){
  const p=H.pl.get(id),R=H.round;if(!p||H.ph!=="play"||!R)return;
  if(key){if(p.ak===key)return;p.ak=key}
  const t=performance.now()-R.start,k=R.k;
  if(RANKED.has(k)&&!["coroa","altar","reliquia","cacada"].includes(k)){const n=Math.max(0,Math.min(500000,Math.floor(+v||0)));p.v=n;p.rv=k==="vitral"?(n>=10000?"montou":`${Math.floor(n/100)} ${Math.floor(n/100)===1?"peça":"peças"}`):k==="naoolhe"||k==="luz"?(n>=2000?"escapou":`${Math.round(n/10)}%`):fmt(n);p.rs="ok";return commitSoon()}
  if(k==="cabo"){const [pu,er]=String(v||"").split(":").map(x=>Math.max(0,Math.min(999,+x||0)));p.v={pu,er};p.rv=`${pu} ${pu===1?"puxão":"puxões"}`;if(H.world)H.world.f[id]={pu,er};return commitSoon()}
  if(p.rs==="ok"||(p.rs&&["quiz","est","ref","seq","porta","biblio","suss","pacto"].includes(k)))return;
  if(k==="quiz"||k==="biblio"){const i=+v;if(!(i>=0&&i<(k==="quiz"?4:6)))return;p.v=i;p.t=t;p.rs="done";p.rv=k==="quiz"?"ABCD"[i]:`ordem ${i+1}`}
  else if(k==="porta"){const i=+v;if(!(i>=0&&i<3))return;p.v=i;p.t=t;p.rs="done";p.rv=`porta ${i+1}`}
  else if(k==="est"){const n=parseNum(v);if(n===null)return;p.v=n;p.t=t;p.rs="done";p.rv=fmt(n)}
  else if(k==="ref"){const ms=Math.round(+v);if(!R.go&&ms>=0)return;if(ms<0||!Number.isFinite(ms)){p.v=-1;p.rv="atacou cedo";p.rs="x"}else{p.v=clamp(ms,80,5000);p.rv=p.v+" ms";p.rs="done"}}
  else if(k==="pacto"){const n=clamp(Math.floor(+v||0),0,Math.min(5,p.sc));p.v=n;p.t=t;p.rs="done";p.rv=`ofereceu ${n}`}
  else if(k==="suss"){const a=String(v||"").split(",").slice(0,3).map(x=>clamp(Math.floor(+x||0),0,8));if(a.length!==3)return;const n=a.filter((c,i)=>c===R.d.q[i]).length;p.v=n;p.t=Math.max(0,t-R.d.show);p.rs=n===3?"ok":"done";p.rv=`${n}/3${n===3?` · ${(p.t/1000).toFixed(1)} s`:""}`}
  else if(k==="seq"){const s=String(v||"").replace(/[^0-3]/g,"").slice(0,12);p.v=s;p.t=Math.max(0,t-R.d.show);p.rs=s===R.ans?"ok":"x";p.rv=s===R.ans?`${(p.t/1000).toFixed(1)} s`:"errou"}
  else if(k==="conta"||k==="anag"){const ok=k==="conta"?parseNum(v)===R.ans:norm(v)===norm(R.ans);p.a++;if(ok){p.rs="ok";p.t=t;p.rv=`${(t/1000).toFixed(1)} s`;if(!R.first)R.first=id}else p.rs="x"}
  commit();checkDone();
}
const playing=()=>activePlayers().filter(p=>p.late!==H.rid);
function checkDone(){const R=H.round;if(!R||H.ph!=="play")return;const k=R.k;if(RANKED.has(k)||k==="cabo")return;
  const act=playing();const done=act.length&&act.every(q=>k==="conta"||k==="anag"?q.rs==="ok":q.rs!=="");
  if(done){clearTimeout(H.timer);const rid=H.rid;H.timer=setTimeout(()=>{if(H&&H.rid===rid&&H.ph==="play")revealPhase()},700)}}
function revealPhase(){
  const R=H.round,k=R.k,act=[...H.pl.values()];
  if(H.world){const ctrl=(ARENA_HOST[k]||ARENA_HOST.generic);ctrl.final&&ctrl.final(H.world,act)}
  clearTimers();
  const speed=(t,dur)=>4+Math.round(6*Math.max(0,1-t/dur));
  const ladder=(list,key)=>{let rank=0,prev=null;list.forEach((p,i)=>{const val=key(p);if(val!==prev){rank=i;prev=val}p.rp=ALMAS[Math.min(rank,ALMAS.length-1)];p.rs=rank===0?"ok":"done"})};
  act.forEach(p=>{p.rp=0});
  if(RANKED.has(k)){act.forEach(p=>{if(p.bot&&!HOST_FINAL.includes(k)){p.v=p.fin??botScore(k);p.rv=botRv(k,p.v);p.fin=undefined}});
    const g=act.filter(p=>(+p.v||0)>0).sort((a,b)=>b.v-a.v);ladder(g,p=>p.v)}
  else if(k==="quiz"||k==="biblio"){act.forEach(p=>{if(p.rs==="done"&&p.v===R.ans){p.rp=speed(p.t,R.dur);p.rs="ok"}else if(p.rs==="done")p.rs="x"})}
  else if(k==="conta"||k==="anag"){act.forEach(p=>{if(p.rs==="ok")p.rp=speed(p.t,R.dur)+(R.first===p.id?1:0)})}
  else if(k==="seq"){act.forEach(p=>{if(p.rs==="ok")p.rp=speed(p.t,R.dur-R.d.show)})}
  else if(k==="pacto"){const g=act.filter(p=>p.rs==="done"&&p.v>0);const top=g.reduce((m,p)=>Math.max(m,p.v),0);const tops=g.filter(p=>p.v===top);
    const pot=g.reduce((s,p)=>s+p.v,0);R.win=tops.length===1?tops[0].id:null;R.top=top;
    g.forEach(p=>{if(tops.length===1&&p===tops[0]){p.rp=Math.min(15,pot);p.rs="ok"}else{p.rp=-p.v;p.rs="x"}});
    act.forEach(p=>{if(p.rs!=="done"&&p.rs!=="ok"&&p.rs!=="x"&&!p.off){p.rv="não ofereceu"}})}
  else if(k==="suss"){act.forEach(p=>{if(typeof p.v!=="number")return;p.rp=p.v*2+(p.v===3?speed(p.t,R.dur-R.d.show)-4:0);if(p.v===0)p.rs="x"})}
  else if(k==="est"){const g=act.filter(p=>p.rs==="done").sort((a,b)=>Math.abs(a.v-R.ans)-Math.abs(b.v-R.ans));ladder(g,p=>Math.abs(p.v-R.ans));g.forEach(p=>{if(p.v===R.ans)p.rp+=3})}
  else if(k==="ref"){const g=act.filter(p=>p.rs==="done").sort((a,b)=>a.v-b.v);ladder(g,p=>p.v);act.forEach(p=>{if(p.rs==="x")p.rp=-1})}
  else if(k==="porta"){act.forEach(p=>{if(p.rs!=="done"){if(!p.off&&p.late!==H.rid){p.rp=-1;p.rv="não escolheu"}return}const role=R.ans[p.v];
    if(role==="s"){p.rp=speed(p.t,R.dur);p.rs="ok";p.rv+=" · salvo"}else if(role==="p"){p.rp=-2;p.rs="x";p.rv+=" · castigo"}else{p.rp=-5;p.rs="x";p.rv+=" · morto"}})}
  else if(k==="cabo"&&H.world){const w=H.world;const win=w.rope>=.02?0:w.rope<=-.02?1:-1;
    act.forEach(p=>{const s=R.d.sides[p.id];const f=w.f[p.id]||{pu:0,er:0};p.rv=`${f.pu} ${f.pu===1?"puxão":"puxões"}`;if(s===undefined)return;
      if(win<0)p.rp=f.pu>0?3:0;else if(s===win){p.rp=6;p.rs="ok"}else p.rp=f.pu>0?1:0});
    if(win>=0){const top=act.filter(p=>R.d.sides[p.id]===win).sort((a,b)=>((w.f[b.id]||{}).pu||0)-((w.f[a.id]||{}).pu||0))[0];if(top)top.rp+=2}
    R.win=win}
  if(R.mult>1)act.forEach(p=>{p.rp=(p.rp||0)*R.mult});
  act.forEach(p=>{p.sc=Math.max(0,p.sc+(p.rp||0))});
  const order=act.filter(p=>p.rp>0).sort((a,b)=>b.rp-a.rp);
  act.forEach(p=>{p.h=p.h||[];const rank=p.rp>0?order.findIndex(q=>q.rp===p.rp):-1;p.h.push({k,rp:p.rp||0,rank});
    p.st=(p.rp>0&&rank>=0&&rank<3)?(p.st||0)+1:0;p.bst=Math.max(p.bst||0,p.st);
    if(k==="ref"&&(p.rs==="ok"||p.rs==="done")&&typeof p.v==="number"&&p.v>0)p.bref=Math.min(p.bref||1e9,p.v)});
  let ans=null;
  if(k==="quiz")ans={i:R.ans,cnt:[0,1,2,3].map(i=>act.filter(p=>p.v===i).length)};
  else if(k==="conta")ans={t:fmt(R.ans)};else if(k==="anag")ans={t:ACCENT[R.ans]||R.ans};
  else if(k==="est")ans={t:fmt(R.ans)+(R.d.u?" "+R.d.u:"")};else if(k==="seq")ans={s:R.d.s};else if(k==="suss")ans={q:R.d.q};else if(k==="pacto")ans={w:R.win,top:R.top||0};
  else if(k==="porta")ans={t:R.ans};else if(k==="biblio")ans={i:R.ans};else if(k==="cabo")ans={win:R.win};
  H.res=ans;H.ph="reveal";H.seq++;commit();publishWorld(null);
  const rid=H.rid;H.timer=setTimeout(()=>{if(H&&H.rid===rid&&H.ph==="reveal")nextRound()},revealMs());
}
const introMs=()=>H&&H.cfg.pace==="fast"?3200:4800;
const revealMs=()=>H.r>=H.R?6000:(H.cfg.pace==="fast"?6000:9500);
function finalPhase(){clearTimers();H.aw=computeAwards();
  if(H.ph!=="final"){H.night=H.night||{};const l=[...H.pl.values()].filter(p=>!p.off||p.sc).sort((a,b)=>b.sc-a.sc);if(l[0]&&l[0].sc>0)H.night[l[0].n]=(H.night[l[0].n]||0)+1;H.rits=(H.rits||0)+1}H.ph="final";H.seq++;commit()}
function computeAwards(){
  const ps=[...H.pl.values()].filter(p=>p.h&&p.h.length);const out=[];if(!ps.length)return out;
  const got={};const best=(f,min)=>{const c=ps.map(p=>[p,f(p)]).filter(x=>x[1]>=min).sort((a,b)=>b[1]-a[1]);if(!c.length)return null;
    const pick=c.find(x=>(got[x[0].id]||0)<2&&x[1]===c[0][1])||c.find(x=>(got[x[0].id]||0)<1&&x[1]>=c[0][1]*.8)||c[0];got[pick[0].id]=(got[pick[0].id]||0)+1;return pick};
  const pl=(n,a,b)=>n===1?a:b;let r;
  if(r=best(p=>p.h.filter(x=>x.rank===0).length,1))out.push({i:"coroa",t:"Ceifador",id:r[0].id,d:`Venceu ${r[1]} ${pl(r[1],"provação","provações")}`});
  if(r=best(p=>Math.max(0,...p.h.map(x=>x.rp)),5)){const e=r[0].h.find(x=>x.rp===r[1]);out.push({i:"flame",t:"Colheita farta",id:r[0].id,d:`+${r[1]} almas em ${TYPES[e.k].n}`})}
  if(r=best(p=>p.h.reduce((a,x)=>a+(MIND.has(x.k)?Math.max(0,x.rp):0),0),4))out.push({i:"brain",t:"Mente afiada",id:r[0].id,d:`${r[1]} almas nas provações de cabeça`});
  if(r=best(p=>p.h.reduce((a,x)=>a+(ARENA_GAMES.has(x.k)?Math.max(0,x.rp):0),0),4))out.push({i:"map",t:"Senhor dos mapas",id:r[0].id,d:`${r[1]} almas nos mapas ao vivo`});
  if(r=best(p=>p.bref?-p.bref:-Infinity,-5000))out.push({i:"bolt",t:"Reflexo de gato",id:r[0].id,d:`Golpe em ${-r[1]} ms`});
  if(r=best(p=>p.bst||0,3))out.push({i:"flame",t:"Imparável",id:r[0].id,d:`${r[1]} provações seguidas no top 3`});
  if(r=best(p=>-p.h.reduce((a,x)=>a+Math.min(0,x.rp),0),2))out.push({i:"skull",t:"Pé frio",id:r[0].id,d:`Perdeu ${r[1]} almas pelo caminho`});
  return out.slice(0,6);
}
function backToLobby(){clearTimers();H.ph="lobby";H.r=0;H.round=null;H.res=null;H.world=null;H.aw=null;H.pl.forEach((p,id)=>{if(p.off)H.pl.delete(id);else{p.sc=0;p.rs="";p.rp=0;p.rv="";p.h=[];p.st=0;p.bst=0;p.bref=0}});H.seq++;commit()}

function publicView(){
  const R=H.round;
  return {v:1,code:H.code||"",ph:H.ph,r:H.r,R:H.R,rid:H.rid,seq:H.seq,mode:H.cfg.mode,teams:H.cfg.teams,
    it:introMs(),rt:H.ph==="reveal"?revealMs():undefined,k:R?R.k:null,x:R&&R.mult>1&&H.ph!=="final"?R.mult:undefined,d:R?R.d:null,dur:R?R.dur:0,go:R?!!R.go:false,res:H.ph==="reveal"?H.res:null,
    pl:[...H.pl.values()].map(p=>({id:p.id,n:p.n,av:p.av,tm:p.tm,sc:p.sc,rs:p.rs,rp:p.rp,rv:H.ph==="reveal"||H.ph==="final"||(R&&(RANKED.has(R.k)||R.k==="cabo"))?p.rv:"",a:p.a,off:p.off?1:0,b:p.bot?1:0,lv:p.lv||undefined,st:p.st||undefined,l:p.late&&p.late===H.rid?1:undefined})),aw:H.ph==="final"?H.aw:undefined,nt:H.ph==="final"&&H.rits>1?Object.entries(H.night||{}).sort((a,b)=>b[1]-a[1]).slice(0,6):undefined,
    cfg:{count:H.cfg.count,types:H.cfg.types}};
}
let commitChain=Promise.resolve(),softTimer=null;
function commit(){clearTimeout(softTimer);softTimer=null;commitChain=commitChain.then(doCommit).catch(e=>console.error(e));return commitChain}
function commitSoon(){if(softTimer)return;softTimer=setTimeout(()=>{softTimer=null;commit()},220)}
async function doCommit(){
  if(!H)return;const V=publicView();
  if(U.mode==="host"&&U.tbl){
    try{await U.tbl.presence({role:"host",nick:U.nick,av:U.av,st:V})}catch(e){if(e&&e.code==="invalid_argument"){V.pl.forEach(p=>{p.n=p.n.slice(0,8)});try{await U.tbl.presence({role:"host",nick:U.nick,av:U.av,st:V})}catch(_){}}}
    U.room?.presence({gin:{c:H.code,h:U.nick,n:activePlayers().filter(p=>!p.bot).length,on:H.ph!=="lobby"&&H.ph!=="final"?1:0}}).catch(()=>{});
  }
  onView(V);
}
let lastWorldPub=0;
function publishWorld(w){
  U.W=w;if(U.screen==="room"&&U.V&&U.V.ph==="play")renderLive();
  if(U.mode==="host"&&U.tbl){U.tbl.presence({w:w||null}).catch(()=>{})}
}
