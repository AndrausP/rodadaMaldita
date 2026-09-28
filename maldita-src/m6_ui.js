/* ============================================================
   INTERFACE / REDE
   ============================================================ */
const U={
  screen:"lobby",mode:null,nick:store.get("nick","")||("Alma "+(100+rnd(900))),av:store.get("av",null)||(()=>{const o=avParse(avRandom());if(o.f>7)o.f=0;if(o.e>4)o.e=0;if(o.a>6)o.a=0;if(o.m>3)o.m=0;return avCode(o)})(),
  cfg:(()=>{const s=store.get("cfg",{});const c=Object.assign({mode:"solo",teams:2,count:12,bots:3,bd:1,types:{}},s);c.types=Object.assign(Object.fromEntries(TYPE_KEYS.map(k=>[k,true])),c.types||{});return c})(),
  room:null,roomState:"connecting",tbl:null,myId:"me",V:null,W:null,code:"",hostPeer:null,others:{},
  says:{},key:"",phaseAt:0,ak:0,mine:{},tapN:0,tapSent:0,refAt:0,seqIn:[],lastA:0,myTeam:store.get("team",0),arcScore:0
};
function saveAv(){store.set("av",U.av);U.room?.presence({av:U.av}).catch(()=>{})}
async function connectLobby(){
  try{const r=await window.claude?.use?.("room");
    if(!r){U.roomState="off";return U.screen==="lobby"&&renderLobby()}
    U.room=r;
    r.onConnection(c=>{U.roomState=c?"on":"connecting";if(U.screen==="lobby")renderStatus()},()=>{U.roomState="off";if(U.screen==="lobby")renderStatus()});
    r.onPeers(()=>{if(U.screen==="lobby")renderOpen()});
    r.presence({nick:U.nick,av:U.av,lv:myLv()}).catch(()=>{});
  }catch(e){U.roomState="off";renderLobby()}
}
function myPeerIn(r){return new Promise(res=>{const me=r.peers().find(p=>p.sameTab);if(me)return res(me.peer);let un=null;un=r.onPeers(ch=>{const m=ch.peers.find(p=>p.sameTab);if(m){un&&un();res(m.peer)}});setTimeout(()=>res("me-"+rnd(1e9)),5000)})}
async function createOnline(){
  if(!U.room)return;const code=Array.from({length:4},()=>"ABCDEFGHJKLMNPQRSTUVWXYZ"[rnd(24)]).join("");
  let tbl;try{tbl=await U.room.join("rm-"+code.toLowerCase())}catch(e){toast("Não deu pra abrir o ritual agora. Tente de novo.");return}
  U.tbl=tbl;U.mode="host";U.code=code;U.others={};U.tv=!!U.cfg.tv;
  H=newHost(JSON.parse(JSON.stringify(U.cfg)));H.code=code;
  U.myId=await myPeerIn(tbl);if(!U.tv)addPlayer({id:U.myId,n:U.nick,av:U.av,tm:U.myTeam,lv:myLv()});
  tbl.onPeers(hostOnPeers);enterRoom();commit();
}
async function joinOnline(code){
  code=clean(code,4).toUpperCase();if(code.length!==4){toast("O código tem 4 letras");return}if(!U.room)return;
  let tbl;try{tbl=await U.room.join("rm-"+code.toLowerCase())}catch(e){toast("Não deu pra entrar agora. Tente de novo.");return}
  U.tbl=tbl;U.mode="guest";U.tv=false;U.fullShown=0;U.lastL=0;U.code=code;U.hostPeer=null;U.others={};store.set("last",{c:code,t:Date.now()});
  U.myId=await myPeerIn(tbl);
  await tbl.presence({role:"player",nick:U.nick,av:U.av,tm:U.myTeam,lv:myLv()}).catch(()=>{});
  tbl.onPeers(guestOnPeers);enterRoom();
  setTimeout(()=>{if(U.mode==="guest"&&!U.hostPeer)showOverlay("Ritual não encontrado",`Ninguém está conduzindo o ritual <b>${esc(code)}</b> agora. Confira o código.`,true)},7000);
}
function startSolo(){
  U.mode="solo";U.tv=false;U.myId="me";U.tbl=null;U.code="";U.others={};
  H=newHost(JSON.parse(JSON.stringify(U.cfg)));H.cfg.mode="solo";
  addPlayer({id:"me",n:U.nick,av:U.av,lv:myLv()});for(let i=0;i<U.cfg.bots;i++)addBot();
  enterRoom();commit();
}
function trackPeers(ch){
  for(const p of ch.peers){if(p.sameTab)continue;const pp=p.presence&&p.presence.p;
    if(pp&&typeof pp.x==="number"){U.others[p.peer]={r:pp.r,x:clamp(pp.x,0,WW),y:clamp(pp.y,0,WH),a:+pp.a||0,d:+pp.d||0,g:pp.g?1:0,ev:Array.isArray(pp.e)?pp.e.slice(-6):[]}}
    else delete U.others[p.peer]}
  for(const p of ch.left)delete U.others[p.peer];
  handleChat(ch.peers);
}
function hostOnPeers(ch){
  trackPeers(ch);let dirty=false;
  for(const p of ch.peers){
    if(p.sameTab)continue;const pr=p.presence||{};if(pr.role!=="player")continue;
    let pl=H.pl.get(p.peer);
    if(!pl){const nick=clean(pr.nick)||"Alma";const old=[...H.pl.values()].find(q=>q.off&&!q.bot&&q.n===nick);
      if(old){H.pl.delete(old.id);old.id=p.peer;old.off=false;H.pl.set(p.peer,old);pl=old;dirty=true;toast(`${pl.n} voltou ao ritual`);sfx.creak()}
      else{pl=addPlayer({id:p.peer,n:nick,av:typeof pr.av==="string"?pr.av.slice(0,5):"00000",tm:+pr.tm||0,lv:+pr.lv||0});if(!pl)continue;dirty=true;toast(`${pl.n} entrou no ritual`);sfx.creak()}
      if(H.ph==="play")pl.late=H.rid}
    if(pl.off){pl.off=false;dirty=true;if(H.ph==="play")pl.late=H.rid}
    const nn=clean(pr.nick)||pl.n,na=typeof pr.av==="string"?pr.av.slice(0,5):pl.av;if(nn!==pl.n||na!==pl.av){pl.n=nn;pl.av=na;dirty=true}
    if(H.cfg.mode==="times"&&H.ph==="lobby"){const t=+pr.tm||0;if(t>=1&&t<=H.cfg.teams&&t!==pl.tm){pl.tm=t;dirty=true}}
    const a=pr.ans;if(a&&a.r===H.rid&&H.ph==="play"){onAnswer(p.peer,a.v,a.r+":"+a.k);dirty=false}
  }
  for(const p of ch.left){const pl=H.pl.get(p.peer);if(!pl)continue;dirty=true;if(H.ph==="lobby"){H.pl.delete(p.peer);continue}
    const dup=[...H.pl.values()].find(q=>q!==pl&&!q.bot&&!q.off&&q.n===pl.n&&q.ord>pl.ord);
    if(dup){dup.sc+=pl.sc;dup.h=(pl.h||[]).concat(dup.h||[]);dup.bst=Math.max(dup.bst||0,pl.bst||0);if(pl.bref)dup.bref=Math.min(dup.bref||1e9,pl.bref);if(pl.tm)dup.tm=pl.tm;dup.ord=pl.ord;H.pl.delete(p.peer);toast(`${dup.n} voltou ao ritual`)}
    else pl.off=true}
  if(H.ph==="play"&&ch.left.length)checkDone();
  if(dirty)commit();
}
let lastSt=null,lastW=null,lastSj="";
const setHTML=(el,h)=>{if(el&&el._h!==h){el.innerHTML=h;el._h=h}};
function guestOnPeers(ch){
  trackPeers(ch);
  const host=ch.peers.find(p=>p.presence&&p.presence.role==="host"&&p.presence.st);
  if(!host){if(U.hostPeer&&ch.left.some(p=>p.peer===U.hostPeer)){stopAll();showOverlay("O ritual terminou","Quem conduzia saiu, então o ritual se desfez.",true)}return}
  U.hostPeer=host.peer;
  const w=host.presence.w;if(w!==lastW){lastW=w;U.W=w||null;if(U.screen==="room")renderLive()}
  const st=host.presence.st;if(st===lastSt)return;lastSt=st;if(!st||st.v!==1||!Array.isArray(st.pl))return;const sj=JSON.stringify(st);if(sj===lastSj)return;lastSj=sj;onView(st);
}
function sendAnswer(v){
  const V=U.V;if(!V||V.ph!=="play")return;U.mine[V.rid]=v;
  if(U.mode==="guest"){U.ak++;U.tbl.presence({ans:{r:V.rid,v,k:U.ak}}).catch(()=>{})}else onAnswer(U.myId,v,"");
}
function setTeam(t){U.myTeam=t;store.set("team",t);if(U.mode==="guest")U.tbl.presence({tm:t}).catch(()=>{});else if(H){const p=H.pl.get(U.myId);if(p){p.tm=t;commit()}}}
function stopAll(){stopArcade();stopArena();if(H)clearTimers()}
function leaveRoom(){
  stopAll();if(U.mode==="guest")store.set("last",null);if(U.tbl){try{U.tbl.leave()}catch(e){}}U.room?.presence({gin:null}).catch(()=>{});
  H=null;U.tbl=null;U.mode=null;U.V=null;U.W=null;U.key="";lastSt=null;lastW=null;lastSj="";U.mine={};U.others={};
  $(".overlay")?.remove();U.screen="lobby";document.body.classList.remove("blood-moon");renderLobby();
}
/* chat rápido (provocações) */
let sayK=0;const seenSay={};
function handleChat(peers){for(const p of peers){const s=p.presence&&p.presence.say;const k=s&&typeof s.k==="number"?s.k:0;const prev=seenSay[p.peer];seenSay[p.peer]=k;if(prev===undefined||!s||prev===k)continue;const m=clean(s.m,40);if(m){U.says[p.peer]={m,t:performance.now()};if(!(U.V&&U.V.ph==="play"&&ARENA_GAMES.has(U.V.k)))toast(`${clean(p.presence.nick)||"Alguém"}: ${m}`)}}}
function sayQuick(m){if(U.tbl&&U.mode!=="solo"){sayK++;U.tbl.presence({say:{k:sayK,m}}).catch(()=>{})}U.says[U.myId]={m,t:performance.now()};if(!(U.V&&U.V.ph==="play"&&ARENA_GAMES.has(U.V.k)))toast(`Você: ${m}`)}

/* ---------- recordes pessoais (só neste navegador) ---------- */
const REC=store.get("rec",{t:{},rit:0,win:0,best:0,souls:0});REC.t=REC.t||{};
const ACH=[
  {id:"win",i:"coroa",n:"Primeiro trono",d:"Vença um ritual"},
  {id:"rit5",i:"flame",n:"Veterano do além",d:"Jogue 5 rituais"},
  {id:"souls100",i:"skull",n:"Colecionador",d:"Colha 100 almas no total"},
  {id:"souls500",i:"skull",n:"Ceifador de verdade",d:"Colha 500 almas no total"},
  {id:"ref",i:"ref",n:"Reflexo de gato",d:"Golpeie no Sobressalto em menos de 250 ms"},
  {id:"suss",i:"suss",n:"Memória de fantasma",d:"Acerte os 3 Sussurros"},
  {id:"pacto",i:"pacto",n:"Pactuante",d:"Vença um Pacto Sombrio"},
  {id:"cacada",i:"cacada",n:"Sobrevivente",d:"Sobreviva a uma Caçada"},
  {id:"coroa",i:"coroa",n:"Rei do salão",d:"Reine 20 s no Rouba-Coroa"},
  {id:"vitral",i:"vitral",n:"Vitralista",d:"Monte o Vitral das Almas"},
  {id:"porta",i:"porta",n:"Porta certa",d:"Escolha a porta segura"},
  {id:"moon",i:"flame",n:"Filho da lua",d:"Colha almas numa Lua de sangue"}];
function unlock(id){REC.ach=REC.ach||{};if(REC.ach[id])return;REC.ach[id]=Date.now();store.set("rec",REC);const a=ACH.find(x=>x.id===id);if(a)setTimeout(()=>{toast(`Conquista: ${a.n}`);sfx.ok()},2200)}
const LV_T=["Alma Penada","Visagem","Assombração","Espectro","Poltergeist","Banshee","Ceifador","Necromante","Lorde das Trevas","Entidade Antiga"];
const lvOf=s=>Math.floor(Math.sqrt(Math.max(0,s)/15));const lvTitle=l=>LV_T[Math.min(l,LV_T.length-1)];const myLv=()=>lvOf(REC.souls||0);
function recordRound(V,me){
  const k=V.k,r=REC.t[k]||(REC.t[k]={});let sc=null,rv="";
  if(k==="ref"){const m=U.mine[V.rid];if(typeof m==="number"&&m>0){sc=-m;rv=m+" ms"}}
  else if(k==="tap"){if(U.tapN>0){sc=U.tapN;rv=U.tapN+" toques"}}
  else if((CANVAS_GAMES.has(k)||ARENA_GAMES.has(k)||k==="vitral")&&U.arcScore>0){sc=U.arcScore;rv=me.rv||fmt(sc)}
  let msg="";
  if(sc!==null){if(r.sc===undefined||sc>r.sc){if(r.sc!==undefined)msg=`Novo recorde em ${TYPES[k].n}: ${rv}`;r.sc=sc;r.rv=rv}}
  if((me.rp||0)>(r.rp||0)){r.rp=me.rp}
  const lv0=myLv();r.n=(r.n||0)+1;REC.souls+=Math.max(0,me.rp||0);store.set("rec",REC);
  const rvs=String(me.rv||"");if(k==="ref"&&typeof U.mine[V.rid]==="number"&&U.mine[V.rid]>0&&U.mine[V.rid]<250)unlock("ref");if(k==="suss"&&rvs.startsWith("3/3"))unlock("suss");
  if(k==="pacto"&&me.rs==="ok")unlock("pacto");if(k==="cacada"&&(rv==="sobreviveu"||rv.startsWith("último vivo")))unlock("cacada");if(k==="coroa"&&(parseInt(rv)||0)>=20)unlock("coroa");
  if(k==="vitral"&&rv==="montou")unlock("vitral");if(k==="porta"&&rv.includes("salvo"))unlock("porta");if(V.x>1&&me.rp>0)unlock("moon");if(REC.souls>=100)unlock("souls100");if(REC.souls>=500)unlock("souls500");
  if(myLv()>lv0)setTimeout(()=>{toast(`Nível ${myLv()}: você agora é ${lvTitle(myLv())}!`);sfx.win()},1600);
  if(msg)setTimeout(()=>{toast(msg);sfx.ok()},900);
}
function recordRitual(V){const me=V.pl.find(p=>p.id===U.myId);if(!me)return;const top=V.pl.slice().sort((a,b)=>b.sc-a.sc)[0];
  REC.rit++;if(top&&top.id===me.id&&me.sc>0){REC.win++;unlock("win")}if(me.sc>REC.best){REC.best=me.sc}store.set("rec",REC);if(REC.rit>=5)unlock("rit5")}

/* ---------- estado novo chegou ---------- */
function onView(V){
  const prev=U.V;U.V=V;const key=V.ph+":"+V.rid+":"+(V.go?1:0);let changed=key!==U.key;
  if(changed){const prevPh=U.key.split(":")[0];U.key=key;U.phaseAt=performance.now();
    if(V.ph==="intro"){sfx.bell();U.W=null;setTimeout(()=>{if(MIND.has(V.k))sfx.whisper();else if(ARENA_GAMES.has(V.k)){tone(55,.5,"sine",.3);tone(55,.5,"sine",.25,.35)}else sfx.heart()},650)}
    if(V.ph==="play"&&V.k==="ref"&&V.go){U.refAt=performance.now();sfx.go()}
    if(V.ph==="play"&&!V.go){U.tapN=0;U.tapSent=0;U.seqIn=[];U.lastA=0;U.arcScore=0}
    if(V.ph==="reveal"){sfx.end();const me=V.pl.find(p=>p.id===U.myId);if(me&&prev&&prev.rid===V.rid)recordRound(V,me);
      if(me&&me.rp<0){setTimeout(()=>{hurt(me.rp<=-5?2:1);if(me.rp<=-5)sfx.scream()},200)}else if(me&&me.rp>0)setTimeout(()=>{slashFx();soulFly(me.rp)},350)}
    if(V.ph==="final"&&prevPh!=="final"){[0,.8,1.7].forEach((d,i)=>setTimeout(()=>{sfx.heart();tone([196,247,294][i],.3,"triangle",.1)},d*1000+400));setTimeout(()=>{sfx.win();drips(26)},2600);recordRitual(V)}
  }
  document.body.classList.toggle("blood-moon",!!(V.x>1&&V.ph!=="lobby"&&V.ph!=="final"&&U.screen==="room"));
  if(changed&&V.ph==="intro"&&V.x>1)setTimeout(()=>{tone(49,1.6,"sawtooth",.08,0,40);sfx.scream()},900);
  if(U.mode==="guest"&&!U.fullShown&&!V.pl.some(p=>p.id===U.myId)&&V.pl.filter(p=>!p.off).length>=MAX_PLAYERS){U.fullShown=1;showOverlay("Ritual cheio",`Este ritual já tem ${MAX_PLAYERS} vivos. Você pode assistir daqui ou entrar em outro.`,false)}
  if(U.screen!=="room")return;renderHead();renderSide();const meL=V.pl.find(p=>p.id===U.myId);const lk=meL&&meL.l?1:0;if(lk!==U.lastL){U.lastL=lk;changed=true}if(changed)renderMain();else renderLive();
}

/* ============================================================
   RENDER
   ============================================================ */
const ICON={
  on:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M17 8.5a5 5 0 010 7M19.5 6a8.5 8.5 0 010 12"/></svg>',
  off:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
  low:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M17 9.5a4 4 0 010 5"/></svg>',
  copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/></svg>'
};
const DRIP='<svg viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true"><path d="M0 1.5h120v1.6c-3.4 0-4.6.6-5.4 3.2-.8 2.8-2.6 2.8-3.1 0-.5-2.6-1.8-3.2-4.8-3.2H71c-2 0-3.2.9-3.6 4.4-.5 4.4-3.3 4.4-3.7 0-.3-3.4-1.5-4.4-4-4.4H26c-2.6 0-3.6 1-4.1 3.6-.4 2.2-2.6 2.2-2.9 0-.4-2.6-1.7-3.6-4.4-3.6H0z" fill="#B3122B"/></svg>';
const logo=()=>`<span class="logo" aria-label="Rodada Maldita"><small>RODADA</small><b>Maldita</b>${DRIP}</span>`;
const QUICK=["Corre!","Te peguei","Socorro","Hahaha"];
const GROUPS=[{n:"De cabeça",i:"brain",k:["quiz","conta","anag","est","seq","suss","pacto","porta","biblio","vitral"]},{n:"Reflexo e mira",i:"bolt",k:["ref","tap","mira","covas","corrida","flap","meteoro","cabo"]},{n:"Mapas ao vivo",i:"map",k:["luz","chao","coroa","naoolhe","circulo","altar","reliquia","cacada"]}];
const ctlKeys=t=>esc(t||"").replace(/\b(WASD|A\/D|E|H)\b/g,"<kbd>$1</kbd>").replace(/espaço/g,"<kbd>espaço</kbd>").replace(/← →/g,"<kbd>←</kbd><kbd>→</kbd>").replace(/ · /g,'<span class="sep">·</span>');
const kind=(V,T,txt)=>`<span class="kind" style="--c:${T.c}">${icon(V.k)}${txt||`${T.n} · ${V.r}/${V.R}`}${V.x>1?`<em class="x2">×${V.x}</em>`:""}</span>`;
const soundBtn=()=>`<button class="icon-btn" data-act="sound" aria-label="${soundOn?(volume>.6?"Som alto. Tocar pra baixar":"Som baixo. Tocar pra desligar"):"Som desligado. Tocar pra ligar"}" title="Som">${soundOn?(volume>.6?ICON.on:ICON.low):ICON.off}</button>`;
const tbar=(ms,c,offset=0)=>`<div class="tbar" style="--c:${c}"><i style="animation-duration:${ms}ms;animation-delay:-${Math.max(0,offset)}ms"></i></div>`;
const NEW_TYPES=new Set(["cacada","suss","pacto","covas"]);

/* ---------- LOBBY ---------- */
const AV_LOCK={f:{8:1,9:3},e:{5:2},a:{7:5,8:2},m:{4:1}};
const avLocked=(k,i)=>(AV_LOCK[k]&&AV_LOCK[k][i]||0)>myLv();
const avMyRandom=()=>{let c;for(let t=0;t<40;t++){c=avRandom();const o=avParse(c);if(!["f","e","a","m"].some(k=>avLocked(k,o[k])))break}return c};
function avEditor(){
  const o=avParse(U.av);const locks=Object.entries(AV_LOCK).flatMap(([k,m])=>Object.entries(m).map(([i,l])=>({k,i:+i,l}))).filter(x=>x.l>myLv()).sort((a,b)=>a.l-b.l);
  const row=(k,label)=>`<div class="av-row"><span class="lbl">${label}</span><button data-act="avp" data-k="${k}" data-v="-1" aria-label="Anterior">‹</button><span class="val">${AV[k][o[k]]}</span><button data-act="avp" data-k="${k}" data-v="1" aria-label="Próximo">›</button></div>`;
  return `<div class="av-editor"><div class="av-preview"><canvas id="avPrev" width="224" height="224"></canvas></div>
    <div class="av-rows">${row("f","Rosto")}${row("e","Olhos")}${row("a","Adorno")}${row("m","Marca")}
      <div class="av-row"><span class="lbl">Cor</span><div class="swatches">${AV.c.map((c,i)=>`<button style="--c:${c}" data-act="avc" data-v="${i}" aria-pressed="${o.c===i}" aria-label="Cor ${i+1}"></button>`).join("")}</div></div>
      <button class="btn sm ghost" data-act="avr" style="align-self:flex-start">Sortear aparência</button>
      ${locks.length?`<p class="av-lock">${icon("skull")}Nível ${locks[0].l} libera ${esc(AV[locks[0].k][locks[0].i])}${locks.length>1?` e mais ${locks.length-1}`:""}</p>`:""}</div></div>`;
}
function drawAvPrev(){const cv=$("#avPrev");if(!cv)return;const c=cv.getContext("2d");c.clearRect(0,0,224,224);drawAvatar(c,U.av,112,124,70)}
function renderLobby(){
  const wasLobby=U.screen==="lobby"&&$(".lobby");U.screen="lobby";const local=!!window.__RODADA_LOCAL;if(!wasLobby)window.scrollTo(0,0);
  $("#app").innerHTML=`
  <div class="lobby">
    <div class="lobby-top">${logo()}<div class="top-actions"><button class="btn sm ghost" data-act="howto">${icon("quiz")}Como jogar</button>${soundBtn()}</div></div>
    <div class="lobby-grid">
      <section class="hero">
        <span class="eyebrow kicker">Terror em grupo · cada um no seu aparelho</span>
        <h1 class="h-display">Reúna os vivos.<br>Colha <span>almas</span>.</h1>
        <p>Todos no mesmo pesadelo. Sobreviva às provações, roube coroas e relíquias, e termine com mais almas que os outros. Quem perde, sangra.</p>
        <div class="stats"><div><b>${TYPE_KEYS.length}</b><span>provações</span></div><div><b>${MAX_PLAYERS}</b><span>vivos por ritual</span></div><div><b>${ARENA_GAMES.size}</b><span>mapas ao vivo</span></div><div><b>${ABIL_KEYS.length}</b><span>habilidades</span></div></div>
      </section>
      <section class="catalog">
        ${(()=>{const got=REC.ach||{};const n=ACH.filter(a=>got[a.id]).length;return `<div class="ach"><h3>${icon("coroa")}Conquistas<em>${n}/${ACH.length}</em></h3><div class="ach-list">${ACH.map(a=>`<span class="${got[a.id]?"on":""}" title="${esc(a.n)}: ${esc(a.d)}">${icon(a.i)}</span>`).join("")}</div></div>`})()}
        <div class="pv-groups">${GROUPS.map(g=>`<div class="pv-group"><h3>${icon(g.i)}${g.n}<em>${g.k.length}</em></h3><div class="pv-list">${g.k.map(k=>`<button class="pv" style="--c:${TYPES[k].c}" data-act="try" data-v="${k}" title="Treinar ${esc(TYPES[k].n)} contra as almas penadas"><span class="ic">${icon(k)}</span><div><b>${TYPES[k].n}${NEW_TYPES.has(k)?'<i class="new">nova</i>':""}</b><small>${esc(TYPES[k].r.split(".")[0])}.</small>${REC.t[k]&&(REC.t[k].rv||REC.t[k].rp)?`<span class="rec">${icon("coroa")}${REC.t[k].rv?esc(REC.t[k].rv):"+"+REC.t[k].rp+" almas"}</span>`:""}</div><span class="try">${icon("play")}Treinar</span></button>`).join("")}</div></div>`).join("")}</div>
      </section>
      <section class="panel form join-panel" aria-label="Entrar no ritual">
        <div class="panel-h"><span class="eyebrow">Sua alma</span><h2>Quem entra no círculo?</h2>
          ${(()=>{const l=myLv(),s=REC.souls||0,a=l*l*15,b=(l+1)*(l+1)*15;return `<div class="lvbar"><span class="lvn">${l}</span><div><b>${lvTitle(l)}</b><small>${fmt(s)} almas colhidas · próximo nível em ${fmt(b-s)}</small><i><em style="width:${Math.round((s-a)/(b-a)*100)}%"></em></i></div></div>`})()}</div>
        <div class="field"><label class="label" for="nick">Seu nome no ritual</label><input class="input" id="nick" maxlength="16" value="${esc(U.nick)}" autocomplete="off"></div>
        <div class="field"><span class="label">Sua aparência</span>${avEditor()}</div>
        <div class="divider">Online</div>
        <div id="status"></div>
        ${(()=>{const l=store.get("last",null);return l&&l.c&&Date.now()-l.t<3*3600e3?`<button class="rejoin" data-act="joinCode" data-v="${esc(l.c)}"><span>${icon("users")}Voltar ao ritual <b>${esc(l.c)}</b></span><small>Você saiu sem querer? Entre de novo e mantenha suas almas.</small></button>`:""})()}
        <button class="btn big" data-act="create" id="btnCreate">${icon("flame")}Conduzir um ritual</button>
        <button class="tv-toggle" data-act="tv" aria-pressed="${!!U.cfg.tv}"><span class="sw"></span><span><b>Só apresentar (modo telão)</b><small>Você conduz numa TV ou PC sem jogar. A tela mostra perguntas, placar e os mapas inteiros.</small></span></button>
        <div class="join-row"><input class="input" id="code" maxlength="4" placeholder="CÓDIGO" aria-label="Código do ritual" autocomplete="off"><button class="btn bone" data-act="join" id="btnJoin">Entrar</button></div>
        <div class="tables" id="open"></div>
        <div class="divider">Treino</div>
        <div class="field"><span class="label">Almas penadas (bots) no treino</span><div class="seg">${[0,1,2,3,5,7].map(v=>`<button data-act="bots" data-v="${v}" aria-pressed="${U.cfg.bots===v}">${v}</button>`).join("")}</div></div>
        <div class="field"><span class="label">Dificuldade das almas penadas</span><div class="seg">${BOT_LV.map((l,i)=>`<button data-act="bd" data-v="${i}" aria-pressed="${(U.cfg.bd??1)===i}">${l.n}</button>`).join("")}</div></div>
        <button class="btn ghost" data-act="solo">${icon("play")}Treinar contra as almas penadas</button>
        ${REC.rit?`<div class="my-stats"><div><b>${REC.rit}</b><span>rituais</span></div><div><b>${REC.win}</b><span>vitórias</span></div><div><b>${REC.best}</b><span>recorde de almas</span></div><div><b>${fmt(REC.souls)}</b><span>almas colhidas</span></div></div>`:""}
      </section>
    </div>
  </div>`;
  drawAvPrev();renderStatus();renderOpen();startEmbers();
}
function startEmbers(){
  if(document.getElementById("embers")||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const cv=document.createElement("canvas");cv.id="embers";cv.setAttribute("aria-hidden","true");document.body.prepend(cv);const c=cv.getContext("2d");let W=0,Hh=0;
  const rs=()=>{const d=Math.min(2,devicePixelRatio||1);W=innerWidth;Hh=innerHeight;cv.width=W*d;cv.height=Hh*d;c.setTransform(d,0,0,d,0,0)};rs();addEventListener("resize",rs);
  const P=Array.from({length:46},()=>({x:Math.random()*W,y:Math.random()*Hh,r:.6+Math.random()*2,v:10+Math.random()*28,w:Math.random()*6,h:Math.random()<.7?"224,40,63":"235,150,70",a:.2+Math.random()*.5}));
  let last=performance.now();
  const loop=now=>{if(U.screen!=="lobby"){removeEventListener("resize",rs);cv.remove();return}const dt=Math.min(.05,(now-last)/1000);last=now;c.clearRect(0,0,W,Hh);
    for(const p of P){p.y-=p.v*dt;p.x+=Math.sin(now/1000+p.w)*8*dt;if(p.y<-10){p.y=Hh+10;p.x=Math.random()*W}
      const fl=p.a*(.6+.4*Math.sin(now/300+p.w*3));c.beginPath();c.arc(p.x,p.y,p.r*3,0,7);c.fillStyle=`rgba(${p.h},${fl*.12})`;c.fill();c.beginPath();c.arc(p.x,p.y,p.r,0,7);c.fillStyle=`rgba(${p.h},${fl})`;c.fill()}
    requestAnimationFrame(loop)};
  requestAnimationFrame(loop)}
function renderStatus(){const el=$("#status");if(!el)return;const on=U.roomState==="on",off=U.roomState==="off",local=!!window.__RODADA_LOCAL;
  el.innerHTML=`<div class="status ${on?"on":off?"off":""}"><i></i>${on?(local?"Conectado ao servidor local.":"Conectado. A galera precisa abrir esta mesma página, logada."):off?(local?"Servidor local não encontrado. Rode npm start.":"Online indisponível nesta visualização. Treine contra as almas penadas."):"Conectando…"}</div>`;
  const a=$("#btnCreate"),b=$("#btnJoin");if(a)a.disabled=!on;if(b)b.disabled=!on}
function renderOpen(){
  const el=$("#open");if(!el||!U.room)return;
  const list=U.room.peers().filter(p=>!p.sameTab&&p.presence&&p.presence.gin&&typeof p.presence.gin.c==="string");
  el.innerHTML=list.length?`<span class="eyebrow"><i class="live"></i>Rituais abertos agora</span>`+list.slice(0,6).map(p=>{const g=p.presence.gin,c=clean(g.c,4).toUpperCase();
    return `<div class="tbl-item"><span><b>${esc(c)}</b> <span class="muted">· ${esc(clean(g.h)||"alguém")} · ${Math.min(MAX_PLAYERS,+g.n||0)} vivos${g.on?" · em andamento":""}</span></span><button class="btn sm bone" data-act="joinCode" data-v="${esc(c)}">Entrar</button></div>`}).join(""):"";
}

/* ---------- SALA ---------- */
function enterRoom(){
  U.screen="room";U.key="";window.scrollTo(0,0);
  $("#app").innerHTML=`<div class="room"><header class="topbar" id="head"></header><main class="stage" id="stage"></main><aside class="side" id="side"><div id="sideTools" class="side-sec"></div><div id="sideBoard" class="side-sec"></div><div id="sideSay" class="side-sec"></div></aside></div>`;
  renderHead();renderSide();renderMain();
}
function renderHead(){
  const h=$("#head");if(!h)return;const V=U.V;
  setHTML(h,`${logo()}
    <div class="mid">${U.code?`<span class="code">Ritual <b>${esc(U.code)}</b><button class="icon-btn" data-act="copy" aria-label="Copiar código">${ICON.copy}</button></span>`:`<span class="code">Treino</span>`}
    ${V&&V.ph!=="lobby"&&V.ph!=="final"?`<span class="progress"><span class="pips">${Array.from({length:V.R},(_,i)=>`<i class="${i+1<V.r?"done":i+1===V.r?"cur":""}"></i>`).join("")}</span><span><em class="pw">Provação </em><b>${V.r}</b>/${V.R}</span></span>`:""}</div>
    <div class="right">${soundBtn()}<button class="btn sm ghost" data-act="leave">Sair</button></div>`);
}
const isHost=()=>U.mode==="host"||U.mode==="solo";
function teamTotals(V){const t=Array.from({length:V.teams},(_,i)=>({i:i+1,sc:0}));V.pl.forEach(p=>{if(p.tm>=1&&p.tm<=V.teams)t[p.tm-1].sc+=p.sc});return t}
function renderSide(){
  const s=$("#side");if(!s)return;const V=U.V;if(!V){setHTML($("#sideTools"),"");setHTML($("#sideBoard"),"");setHTML($("#sideSay"),"");return}
  const list=V.pl.slice().sort((a,b)=>b.sc-a.sc);
  const prevIdx={},curIdx={};if(V.ph==="reveal"){const ps=V.pl.map(p=>p.sc-(p.rp||0));if(Math.max(...ps)>Math.min(...ps)){V.pl.forEach(p=>{const ps0=p.sc-(p.rp||0);prevIdx[p.id]=V.pl.filter(q=>q.sc-(q.rp||0)>ps0).length;curIdx[p.id]=V.pl.filter(q=>q.sc>p.sc).length})}}
  const move=(p,i)=>{if(V.ph!=="reveal"||prevIdx[p.id]===undefined)return "";const d=prevIdx[p.id]-curIdx[p.id];return d>0?`<i class="mv up" title="subiu">▲${d}</i>`:d<0?`<i class="mv down" title="caiu">▼${-d}</i>`:""};
  const streak=p=>p.st>=2?`<span class="streak" title="${p.st} provações seguidas no top 3">${icon("flame")}${p.st}</span>`:"";
  const mark=p=>{
    if(V.ph==="play"){if(RANKED.has(V.k)||V.k==="cabo")return p.rv?`<span class="mark plus">${esc(p.rv)}</span>`:"";
      return p.rs==="ok"?`<span class="mark ok">✓</span>`:p.rs==="x"?`<span class="mark x">${V.k==="ref"?"cedo":"✗"}</span>`:p.rs==="done"?`<span class="mark ok">foi</span>`:`<span class="mark wait">…</span>`}
    if(V.ph==="reveal"&&p.rp)return `<span class="mark ${p.rp>0?"plus":"minus"}">${p.rp>0?"+":""}${p.rp}</span>`;return ""};
  setHTML($("#sideTools"),isHost()?hostTools(V):"");
  setHTML($("#sideSay"),U.mode!=="solo"&&V.ph!=="lobby"?`<div class="side-h"><span class="eyebrow">Gritar pro ritual</span></div><div class="seg quick">${QUICK.map(q=>`<button data-act="say" data-v="${q}">${q}</button>`).join("")}</div>`:"");
  setHTML($("#sideBoard"),`
    ${V.mode==="times"&&V.ph!=="lobby"?`<span class="eyebrow">Clãs</span><div class="teams">${teamTotals(V).sort((a,b)=>b.sc-a.sc).map(t=>`<div class="team" style="--c:${TEAMS[t.i-1].c}"><span>${TEAMS[t.i-1].n}</span><b>${soul(t.sc)}</b></div>`).join("")}</div>`:""}
    <div class="side-h"><span class="eyebrow">Almas colhidas</span><span class="hint">${icon("users")}${V.pl.filter(p=>!p.off).length} no ritual</span></div>
    <div class="board ${V.ph==="final"&&performance.now()-U.phaseAt<2800?"suspense":""}">${list.map((p,i)=>`<div class="row ${p.id===U.myId?"me":""} ${p.off?"off":""}"><span class="pos">${i+1}</span>
      <span class="who">${avImg(p.av,30)}${p.lv?`<span class="lv" title="Nível ${p.lv} · ${esc(lvTitle(p.lv))}">${p.lv}</span>`:""}<span class="nm">${esc(p.n)}${p.id===U.myId?" (você)":""}</span>${streak(p)}${move(p,i)}${V.mode==="times"&&p.tm?`<span class="tm" style="--c:${TEAMS[p.tm-1].c}">${TEAMS[p.tm-1].n}</span>`:""}</span>
      <span class="sc">${mark(p)}${soul(p.sc)}</span></div>`).join("")}</div>`);
}
function hostTools(V){
  if(V.ph==="lobby")return "";const b=[];
  if(V.ph==="intro"||V.ph==="play")b.push(`<button class="btn sm ghost" data-act="skip">Encerrar provação</button>`);
  if(V.ph==="reveal")b.push(`<button class="btn sm candle" data-act="next">${V.r>=V.R?"Ver o fim":"Próxima provação"}</button>`);
  if(V.ph!=="final")b.push(`<button class="btn sm ghost" data-act="finish">Encerrar ritual</button>`);
  if(!b.length)return "";return `<span class="eyebrow">Você conduz o ritual</span><div class="host-tools">${b.join("")}</div>`;
}
function renderMain(){
  const st=$("#stage");if(!st)return;const V=U.V;stopArcade();stopArena();
  if(!V){st.innerHTML=`<div class="waiting"><div class="sigil" style="--c:var(--blood-hi)">${icon("skull")}</div><div class="bigmsg">Invocando…</div></div>`;return}
  const T=V.k?TYPES[V.k]:null,el=performance.now()-U.phaseAt;
  const phk=V.ph+":"+(V.rid||"");if(U.lastPhk!==phk){U.lastPhk=phk;if(V.ph!=="lobby"&&window.scrollY>60)window.scrollTo({top:0,behavior:"smooth"})}
  if(V.ph==="lobby")st.innerHTML=lobbyView(V);
  else if(V.ph==="intro")st.innerHTML=`<div class="intro" style="--c:${T.c}"><div class="sigil">${icon(V.k)}</div>${V.x>1?`<div class="moon">${V.r===V.R?"Última provação · ":""}Lua de sangue · almas em dobro</div>`:""}<span class="num">Provação ${V.r} de ${V.R}</span>
      <h1 class="h-display">${T.n}</h1><p class="rule">${T.r}</p>${REC.t[V.k]&&REC.t[V.k].rv?`<p class="rec-line">${icon("coroa")}Seu recorde: <b>${esc(REC.t[V.k].rv)}</b></p>`:""}${V.d&&V.d.seed&&mapName(V.k,V.d.seed)?`<p class="map-name">${icon("map")}Mapa: <b>${mapName(V.k,V.d.seed)}</b></p>`:""}${T.ctl?`<div class="ctl-keys">${ctlKeys(T.ctl)}</div>`:""}${ARENA_GAMES.has(V.k)&&V.k!=="luz"?`<p class="touch-hint">Arraste o dedo pra andar · toque duas vezes pra dar investida</p>`:""}<div class="intro-bar"><div style="width:min(420px,100%)">${tbar(V.it||4800,T.c,el)}</div><span class="cd" id="cd"></span></div>${ABIL_GAMES.has(V.k)?`<div class="abil-legend">${ABIL_KEYS.map(a=>`<span style="--c:${ABIL[a].c}"><b>${ABIL[a].g}</b>${ABIL[a].n}<small>${ABIL[a].d}</small></span>`).join("")}</div>`:""}</div>`;
  else if(V.ph==="play")st.innerHTML=U.tv?tvView(V,T,el):playView(V,T,el);
  else if(V.ph==="reveal")st.innerHTML=revealView(V,T,el);
  else if(V.ph==="final")st.innerHTML=finalView(V);
  afterMain(V);
}
function lobbyView(V){
  const host=isHost(),act=V.pl.filter(p=>!p.off),me=V.pl.find(p=>p.id===U.myId);
  const teamPick=V.mode==="times"?`<div class="field" style="width:100%"><span class="label">Seu clã</span><div class="team-pick">${Array.from({length:V.teams},(_,i)=>`<button style="--c:${TEAMS[i].c}" data-act="team" data-v="${i+1}" aria-pressed="${me&&me.tm===i+1}">${TEAMS[i].n} · ${V.pl.filter(p=>p.tm===i+1&&!p.off).length}</button>`).join("")}</div></div>`:"";
  const players=`<div class="players">${act.map(p=>`<span class="chip ${p.id===U.myId?"me":""}">${avImg(p.av,28)}${esc(p.n)}${p.b?'<span class="bot">bot</span>':""}</span>`).join("")}</div>`;
  if(!host)return `<div class="panel waiting"><div class="sigil" style="--c:var(--blood-hi)">${icon("skull")}</div><span class="eyebrow">Ritual ${esc(U.code)}</span><h1 class="h-display" style="font-size:clamp(34px,6vw,52px)">Você entrou no círculo.</h1><p class="muted" style="margin:0">Esperando quem conduz o ritual começar.</p>${players}${teamPick}
    ${V.cfg&&V.cfg.types?`<div class="chosen"><span class="eyebrow">${V.cfg.count} provações sorteadas entre estas</span><div class="chosen-ic">${TYPE_KEYS.filter(k=>V.cfg.types[k]).map(k=>`<span style="--c:${TYPES[k].c}" title="${esc(TYPES[k].n)}">${icon(k)}</span>`).join("")}</div></div>`:""}</div>`;
  return `<div class="panel form">
    <div><span class="eyebrow">${U.mode==="solo"?"Treino":"Ritual "+esc(U.code)}</span><h1 class="h-display" style="font-size:clamp(34px,5vw,50px);margin-top:6px">${U.mode==="solo"?"Prepare o treino":"Chame os vivos"}</h1>
    ${U.mode==="host"?`<p class="hint" style="margin-top:6px">Quem abrir esta página entra com o código <b class="code-inline">${esc(U.code)}</b>. ${U.tv?"Modo telão: esta tela só apresenta.":"Você também joga."}</p>`:""}</div>
    <div class="field"><span class="label">No círculo (${act.length})</span>${players}<div class="host-tools"><button class="btn sm ghost" data-act="botAdd" ${act.length>=MAX_PLAYERS?"disabled":""}>+ Alma penada</button><button class="btn sm ghost" data-act="botDel" ${act.some(p=>p.b)?"":"disabled"}>− Alma penada</button></div>
      ${act.some(p=>p.b)?`<div class="seg">${BOT_LV.map((l,i)=>`<button data-act="bd" data-v="${i}" aria-pressed="${(H.cfg.bd??1)===i}">Bots: ${l.n}</button>`).join("")}</div>`:""}</div>
    ${U.mode==="host"?`<div class="field"><span class="label">Formato</span><div class="seg"><button data-act="mode" data-v="solo" aria-pressed="${H.cfg.mode==="solo"}">Cada um por si</button><button data-act="mode" data-v="times" aria-pressed="${H.cfg.mode==="times"}">Em clãs</button></div>
      ${H.cfg.mode==="times"?`<div class="seg">${[2,3,4].map(n=>`<button data-act="teams" data-v="${n}" aria-pressed="${H.cfg.teams===n}">${n} clãs</button>`).join("")}</div>`:""}</div>`:""}
    ${teamPick}
    <div class="field"><span class="label">Ritmo</span><div class="seg"><button data-act="pace" data-v="calm" aria-pressed="${H.cfg.pace!=="fast"}">Com calma</button><button data-act="pace" data-v="fast" aria-pressed="${H.cfg.pace==="fast"}">Rápido (menos espera entre provações)</button></div></div>
    <div class="field"><span class="label">Número de provações</span><div class="seg">${[8,12,16,TYPE_KEYS.length].map(n=>`<button data-act="count" data-v="${n}" aria-pressed="${H.cfg.count===n}">${n}</button>`).join("")}</div></div>
    <div class="field"><span class="label">Provações no ritual</span><div class="seg" style="margin-bottom:6px"><button data-act="preset" data-v="all">Todas</button><button data-act="preset" data-v="new">Só reflexo</button><button data-act="preset" data-v="map">Só as de mapa</button><button data-act="preset" data-v="mind">Só de cabeça</button></div>
      <div class="seg types">${TYPE_KEYS.map(k=>`<button style="--c:${TYPES[k].c}" data-act="type" data-v="${k}" aria-pressed="${!!H.cfg.types[k]}">${icon(k)}${TYPES[k].n}</button>`).join("")}</div></div>
    <button class="btn big block" data-act="start">${icon("flame")}Começar o ritual</button>
  </div>`;
}

const DOOR_ICON={
  vela:'<svg viewBox="0 0 40 40" class="mk"><rect x="15" y="16" width="10" height="20" rx="2" fill="#EDE3D1" stroke="#030203" stroke-width="2.5"/><path d="M20 4c-4 5-4 8 0 11 4-3 4-6 0-11z" fill="#F2C14E" stroke="#030203" stroke-width="2"/></svg>',
  mao:'<svg viewBox="0 0 40 40" class="mk"><path d="M12 34V18c0-2 3-2 3 0v-8c0-2 3-2 3 0v-2c0-2 3-2 3 0v2c0-2 3-2 3 0v10c0-2 3-2 3 0v6c0 6-4 8-8 8h-4c-2 0-3 0-3 0z" fill="#C8102E" stroke="#030203" stroke-width="2"/></svg>',
  olho:'<svg viewBox="0 0 40 40" class="mk"><path d="M3 20c9-12 25-12 34 0-9 12-25 12-34 0z" fill="#EDE3D1" stroke="#030203" stroke-width="2.5"/><circle cx="20" cy="20" r="6" fill="#C8102E" stroke="#030203" stroke-width="2"/></svg>',
  corrente:'<svg viewBox="0 0 40 40" class="mk"><g fill="none" stroke="#A8959B" stroke-width="4"><rect x="6" y="6" width="12" height="18" rx="6"/><rect x="14" y="16" width="12" height="18" rx="6"/><rect x="22" y="6" width="12" height="18" rx="6"/></g></svg>',
  cruz:'<svg viewBox="0 0 40 40" class="mk"><path d="M17 4h6v20h8v6h-8v6h-6v-6H9v-6h8z" transform="rotate(180 20 20)" fill="#EDE3D1" stroke="#030203" stroke-width="2"/></svg>'
};
const BOOK_SYM=['<svg viewBox="0 0 40 40" class="sym"><circle cx="20" cy="20" r="13" fill="#F2C14E"/><circle cx="26" cy="16" r="12" fill="var(--bc,#2E2129)"/></svg>',
  '<svg viewBox="0 0 40 40" class="sym"><path d="M3 20c9-12 25-12 34 0-9 12-25 12-34 0z" fill="#EDE3D1"/><circle cx="20" cy="20" r="6" fill="#C8102E"/></svg>',
  '<svg viewBox="0 0 40 40" class="sym"><path d="M12 34V18c0-2 3-2 3 0v-8c0-2 3-2 3 0v-2c0-2 3-2 3 0v2c0-2 3-2 3 0v10c0-2 3-2 3 0v6c0 6-4 8-8 8h-4z" fill="#EDE3D1"/></svg>',
  '<svg viewBox="0 0 40 40" class="sym"><circle cx="20" cy="17" r="12" fill="#EDE3D1"/><rect x="13" y="26" width="14" height="8" fill="#EDE3D1"/><circle cx="15" cy="17" r="3.5" fill="#030203"/><circle cx="25" cy="17" r="3.5" fill="#030203"/></svg>'];

const orderTxt=(V,P)=>P.map(i=>cap(V.d.ev[i])).join(" → ");
const HEART='<svg viewBox="0 0 100 92"><path d="M50 88C20 64 4 48 4 28 4 14 15 4 28 4c9 0 17 5 22 13C55 9 63 4 72 4c13 0 24 10 24 24 0 20-16 36-46 60z" fill="#C8102E" stroke="#030203" stroke-width="5"/><path d="M22 22c4-6 10-8 16-6" stroke="#EDE3D1" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/></svg>';

function playView(V,T,el){
  const me=V.pl.find(p=>p.id===U.myId);const mine=U.mine[V.rid];const d=V.d||{};
  const head=`<div class="card" style="--c:${T.c}">${kind(V,T)}`;
  const bar=tbar(V.dur,T.c,el);
  if((!me||me.l)&&!U.tv)return `<div class="panel waiting"><div class="bigmsg">Você entra na próxima provação</div><p class="muted" style="margin:0">Assista e prepare-se.</p>${bar}</div>`;
  const hbBtn=(CANVAS_GAMES.has(V.k)||ARENA_GAMES.has(V.k))?`<button class="btn sm ghost hb" data-act="hitbox">Hitbox <kbd>H</kbd></button>`:"";
  const slim=`<div class="card slim" style="--c:${T.c}"><div class="slim-row">${kind(V,T)}<span class="ctl">${ctlKeys(T.ctl)}</span>${hbBtn}</div>${tbar(TYPES[V.k].dur,T.c,el)}</div>`;
  if(V.k==="quiz"){const lock=mine!==undefined;
    return `${head}<h2 class="q">${esc(d.q)}</h2>${bar}</div>
    <div class="opts" aria-disabled="${lock}">${d.o.map((o,i)=>`<button class="opt ${lock?(mine===i?"sel":"dim"):""}" style="--c:${["var(--blood-2)","var(--candle)","var(--moss)","var(--frost)"][i]}" data-act="ans" data-v="${i}"><span class="l">${"ABCD"[i]}</span>${esc(o)}</button>`).join("")}</div>
    <p class="hint" style="text-align:center">${lock?"Resposta entregue às sombras…":"Toque na resposta ou use 1 a 4."}</p>`}
  if(V.k==="conta"||V.k==="anag"){const ok=me.rs==="ok";
    return `${head}${V.k==="conta"?`<div class="expr">${esc(d.e)} = ?</div>`:`<p class="sub">Dica: ${esc(d.h)} · ${d.n} letras</p><div class="letters">${[...(d.l||"")].map((ch,i)=>`<span style="--r:${(i%2?1:-1)*(2+i%3)}deg">${esc(ch)}</span>`).join("")}</div>`}
      ${bar}${ok?`<div class="bigmsg ok">Acertou!</div>`:`<form class="answer-form" data-form="ans"><input class="input" id="ansIn" ${V.k==="conta"?'inputmode="numeric"':""} maxlength="24" autocomplete="off" placeholder="${V.k==="conta"?"Resultado":"Palavra"}" aria-label="Sua resposta"><button class="btn big" type="submit">Enviar</button></form>`}
      <div class="feedback" id="fb"></div></div>`}
  if(V.k==="est"){const lock=mine!==undefined;
    return `${head}<h2 class="q">${esc(d.q)}</h2>${d.u?`<p class="sub">Resposta em ${esc(d.u)}</p>`:""}${bar}
      ${lock?`<div class="bigmsg">Sua profecia: ${esc(fmt(parseNum(mine)))}</div>`:`<form class="answer-form" data-form="ans"><input class="input" id="ansIn" inputmode="decimal" maxlength="14" autocomplete="off" placeholder="Seu chute" aria-label="Seu chute"><button class="btn big bruise" type="submit">Profetizar</button></form>`}
      <p class="sub" style="font-size:13px">Um chute só. Quem chegar mais perto leva mais almas.</p></div>`}
  if(V.k==="ref"){const done=mine!==undefined;const cls=done?"done":V.go?"go":"wait";
    const txt=done?(mine<0?`<b>Cedo demais!</b>Custou uma alma.`:`<b>${mine} ms</b>Golpe certeiro.`):V.go?`<div class="eyes"><i></i><i></i></div><b>ATAQUE!</b>`:`<b>Espere…</b>Algo respira no escuro.`;
    return `<div class="reflex ${cls}" id="reflex" role="button" tabindex="0" aria-label="Área do sobressalto"><div>${txt}</div></div>${bar}`}
  if(V.k==="tap"){const left=Math.max(0,TYPES.tap.dur-el);
    return `${head}<p class="sub">Bata sem parar pra manter o coração vivo. Também vale espaço.</p>${tbar(TYPES.tap.dur,T.c,el)}</div>
      <button class="tapper" id="tapper" ${left<=0?'aria-disabled="true"':""} aria-label="Bater">${HEART}<span id="tapN">${U.tapN}</span></button><div class="bars" id="bars">${liveBars(V)}</div>`}
  if(V.k==="pacto"){const done=mine!==undefined;const mx=Math.min(5,me?me.sc:0);
    return `${head}<h2 class="q">${done?`Oferta selada: ${mine} alma${mine===1?"":"s"}.`:"Quanto você oferece ao pacto?"}</h2><p class="sub">${done?"Espere os outros selarem as ofertas…":`Você tem ${me?me.sc:0} alma${me&&me.sc===1?"":"s"}. Só o maior valor, sem empate, leva tudo.`}</p>${bar}</div>
      ${U.tv?"":`<div class="pact" aria-disabled="${done}">${[0,1,2,3,4,5].map(n=>`<button class="pact-b ${done&&mine===n?"sel":""} ${done&&mine!==n?"dim":""}" data-act="pacto" data-v="${n}" ${n>mx?"disabled":""}>${n}<small>${n===0?"nada":n===1?"alma":"almas"}</small></button>`).join("")}</div>`}`}
  if(V.k==="suss"){const done=mine!==undefined;
    return `${head}<h2 class="q sus-q" id="susMsg">${done?"Resposta entregue aos mortos.":"Memorize as lápides…"}</h2><div class="sus-steps" id="susSteps">${[0,1,2].map(i=>`<i></i>`).join("")}</div>${bar}</div>
      <div class="suss" id="suss" aria-disabled="true">${d.g.map((g,i)=>`<button class="tomb" data-act="sus" data-v="${i}" aria-label="Lápide ${i+1}"><span class="face">${icon(g)}</span><span class="back"></span></button>`).join("")}</div>`}
  if(V.k==="seq"){const done=mine!==undefined;
    return `${head}<p class="sub" id="seqMsg">${done?(me.rs==="ok"?"O ritual aceitou a sequência.":"Sequência errada."):"Observe as velas…"}</p>
      <div class="seqdots" id="seqDots">${d.s.map(()=>`<i></i>`).join("")}</div>${bar}</div>
      <div class="pad-wrap"><div class="pads" id="pads" aria-disabled="true">${CANDLES.map((c,i)=>`<button class="pad" style="--c:${c}" data-v="${i}" aria-label="Vela ${i+1}"></button>`).join("")}</div></div>`}
  if(CANVAS_GAMES.has(V.k))return `${slim}<canvas class="arena" id="arena" aria-label="${esc(T.n)}"></canvas><div class="bars" id="bars">${liveBars(V)}</div>`;
  if(ARENA_GAMES.has(V.k)){const dash=!["luz","altar","naoolhe"].includes(V.k);
    const ab=ABIL_GAMES.has(V.k);
    return `${slim}<canvas class="arena map" id="arena" aria-label="${esc(T.n)}"></canvas>${dash||ab?`<div class="touchpad">${dash?`<button class="btn" data-act="dash">${V.k==="reliquia"?"Derrubar":"Investida"}</button>`:""}${ab?`<button class="btn bruise" data-act="ability">Habilidade</button>`:""}</div>`:""}${["luz","chao","circulo","naoolhe"].includes(V.k)?`<div class="bars" id="bars">${liveBars(V)}</div>`:""}`}
  if(V.k==="cabo")return `${slim}${caboView(V)}`;
  if(V.k==="porta")return porteView(V,T,el);
  if(V.k==="biblio")return biblioView(V,T,el);
  if(V.k==="vitral")return `${slim}<div class="vitral" id="vitral"></div><div class="rune" id="rune"><p class="hint" style="font-weight:800">Arraste uma peça até outra pra trocar. Toque pra girar. A seta clara de cada peça deve apontar pra cima.</p></div>`;
  return "";
}
/* ---------- telão: quem conduz só apresenta ---------- */
function tvView(V,T,el){
  const d=V.d||{},bar=tbar(V.dur,T.c,el),head=`<div class="card" style="--c:${T.c}">${kind(V,T)}`;const act=V.pl.filter(p=>!p.off);
  const answered=`<p class="tv-note">${icon("users")}<b>${act.filter(p=>p.rs).length}</b> de ${act.length} já responderam nos aparelhos</p>`;
  const cols=["var(--blood-2)","var(--candle)","var(--moss)","var(--frost)"];
  if(V.k==="quiz")return `${head}<h2 class="q">${esc(d.q)}</h2>${bar}</div><div class="opts" aria-disabled="true">${d.o.map((o,i)=>`<div class="opt" style="--c:${cols[i]}"><span class="l">${"ABCD"[i]}</span>${esc(o)}</div>`).join("")}</div>${answered}`;
  if(V.k==="conta")return `${head}<div class="expr">${esc(d.e)} = ?</div>${bar}</div>${answered}`;
  if(V.k==="anag")return `${head}<p class="sub">Dica: ${esc(d.h)} · ${d.n} letras</p><div class="letters">${[...(d.l||"")].map((ch,i)=>`<span style="--r:${(i%2?1:-1)*(2+i%3)}deg">${esc(ch)}</span>`).join("")}</div>${bar}</div>${answered}`;
  if(V.k==="est")return `${head}<h2 class="q">${esc(d.q)}</h2>${d.u?`<p class="sub">Resposta em ${esc(d.u)}</p>`:""}${bar}</div>${answered}`;
  if(V.k==="ref")return `<div class="reflex ${V.go?"go":"wait"}"><div>${V.go?`<div class="eyes"><i></i><i></i></div><b>ATAQUE!</b>`:`<b>Espere…</b>Algo respira no escuro.`}</div></div>${bar}${answered}`;
  if(CANVAS_GAMES.has(V.k)||V.k==="tap"||V.k==="vitral")return `<div class="card slim" style="--c:${T.c}"><div class="slim-row">${kind(V,T)}<span class="ctl">Jogando nos aparelhos</span></div>${tbar(TYPES[V.k].dur,T.c,el)}</div>
    <div class="tv-live"><div class="sigil" style="--c:${T.c}">${icon(V.k)}</div><div class="bars big" id="bars">${liveBars(V)}</div></div>`;
  return playView(V,T,el);
}
function liveBars(V){
  const val=p=>{if(p.id===U.myId&&V.k==="tap")return Math.max(U.tapN,+String(p.rv).replace(/\D/g,"")||0);const s=String(p.rv||"0");if(s==="escapou"||s==="montou")return 1e9;return +s.replace(/[^\d]/g,"")||0};
  const g=V.pl.filter(p=>!p.off).map(p=>({p,n:val(p)})).sort((a,b)=>b.n-a.n);const max=Math.max(1,...g.map(x=>x.n===1e9?0:x.n));
  return g.map(({p,n})=>`<div class="bar"><span class="nm">${avImg(p.av,22)}<span class="t">${esc(p.n)}${p.id===U.myId?" (você)":""}</span></span><span class="tr"><i style="--c:${p.id===U.myId?"var(--candle)":"var(--blood)"};width:${n===1e9?100:n/max*100}%"></i></span><span class="n">${esc(p.id===U.myId&&V.k==="tap"?String(n):p.rv||"0")}</span></div>`).join("");
}
function caboView(V){
  const sides=V.d.sides||{},my=sides[U.myId];const names=s=>V.pl.filter(p=>sides[p.id]===s).map(p=>`${avImg(p.av,24)}`).join("");
  return `<div class="panel tug">
    <div class="sides"><div class="${my===0?"mine":""}">${names(0)}</div><b class="eyebrow">${my===0?"← seu lado":my===1?"seu lado →":"assistindo"}</b><div class="${my===1?"mine":""}" style="justify-content:flex-end">${names(1)}</div></div>
    <div class="rope"><div class="cord"></div><div class="mid"></div><div class="lim" style="left:3%"></div><div class="lim" style="right:3%"></div><div class="knot" id="knot" style="left:50%"></div></div>
    <div class="combo" id="combo"></div><div class="feedback" id="fb" style="color:var(--bone)"></div>
    <div class="arrows">${["←","↑","↓","→"].map((a,i)=>`<button data-act="arrow" data-v="${["ArrowLeft","ArrowUp","ArrowDown","ArrowRight"][i]}" aria-label="Seta ${a}">${a}</button>`).join("")}</div>
    <p class="hint" id="pullInfo">0 puxões · 0 erros</p></div>`;
}
function porteView(V,T,el){
  const d=V.d,mine=U.mine[V.rid],read=U.read||{};const cols=["#3D2B35","#2E2129","#4A3040"];
  return `<div class="card slim" style="--c:${T.c}"><div class="slim-row">${kind(V,T)}<span class="ctl">Clique nos bilhetes pra ler as pistas</span></div>${tbar(V.dur,T.c,el)}</div>
    <div class="scene" id="scene"><svg class="bg" viewBox="0 0 160 90" preserveAspectRatio="none"><defs><radialGradient id="pgL" cx="50%" cy="-10%" r="90%"><stop offset="0" stop-color="#E07A2F" stop-opacity=".28"/><stop offset=".6" stop-color="#B3122B" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient><linearGradient id="pgF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B1216"/><stop offset="1" stop-color="#060405"/></linearGradient></defs><rect width="160" height="90" fill="#1A1216"/><rect y="70" width="160" height="20" fill="#0E0A0C"/><g fill="#2A1E24">${Array.from({length:10},(_,i)=>`<rect x="${i*16}" y="0" width="15" height="70" opacity="${.3+i%3*.15}"/>`).join("")}</g><rect y="70" width="160" height="20" fill="url(#pgF)"/><path d="M0 70 L160 70" stroke="#030203" stroke-width="1"/><rect width="160" height="90" fill="url(#pgL)"/></svg>
      ${[0,1,2].map(i=>`<button class="door ${mine===i?"sel":""}" style="left:${12+i*29}%;--dc:${cols[i]}" data-act="door" data-v="${i}" ${mine!==undefined?"disabled":""} aria-label="Porta ${i+1}">${DOOR_ICON[d.f[i]]||""}<span class="num">${i+1}</span><span class="knob"></span></button>`).join("")}
      ${d.nt.map((n,i)=>`<button class="note ${read[V.rid+i]?"read":""}" style="left:${n.x}%;top:${n.y}%;--r:${n.r}deg" data-act="note" data-v="${i}" aria-label="Bilhete ${i+1}">?</button>`).join("")}</div>
    <div class="clues" id="clues">${d.c.map((c,i)=>read[V.rid+i]?`<div class="clue">${esc(c)}</div>`:"").join("")||`<p class="hint">Nenhum bilhete lido ainda.</p>`}</div>
    ${mine!==undefined?`<div class="bigmsg">Você escolheu a porta ${mine+1}…</div>`:""}`;
}
function biblioView(V,T,el){
  const d=V.d,mine=U.mine[V.rid],read=U.read||{};const bc=["#5A3A2A","#3D2B35","#2E3B2A","#2B2E45","#4A2030"];
  return `<div class="card slim" style="--c:${T.c}"><div class="slim-row">${kind(V,T)}<span class="ctl">Exatamente um livro mente</span></div>${tbar(V.dur,T.c,el)}</div>
    <div class="scene shelf"><svg class="bg" viewBox="0 0 210 80" preserveAspectRatio="none"><defs><radialGradient id="bgL" cx="50%" cy="0%" r="85%"><stop offset="0" stop-color="#EBC15A" stop-opacity=".2"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><rect width="210" height="80" fill="#1A1216"/><rect width="210" height="80" fill="url(#bgL)"/><rect y="64" width="210" height="6" fill="#5A3A2A" stroke="#030203"/><rect y="0" width="210" height="4" fill="#5A3A2A"/></svg>
      <div class="books">${d.b.map((b,i)=>`<button class="book ${read[V.rid+"b"+i]?"read":""}" style="--h:${70+(i*13)%28}%;--bc:${bc[i%5]}" data-act="book" data-v="${i}" aria-label="${esc(b.ti)}">${BOOK_SYM[b.s]}<b>${esc(b.ti)}</b></button>`).join("")}</div></div>
    <div class="clues">${d.b.map((b,i)=>read[V.rid+"b"+i]?`<div class="bookcard" style="--bc:#EDE3D1">${BOOK_SYM[b.s].replace('class="sym"','class="sym" style="background:#2E2129;border-radius:8px"')}<div><b>${esc(b.ti)}</b><small>Registrado em ${b.y}</small>${esc(b.t)}</div></div>`:"").join("")||`<p class="hint">Clique nos livros da estante pra ler o que dizem.</p>`}</div>
    <div class="side-h"><span class="eyebrow">Qual foi a ordem verdadeira?</span></div>
    <div class="orders opts" aria-disabled="${mine!==undefined}">${d.o.map((P,i)=>`<button class="opt ${mine!==undefined?(mine===i?"sel":"dim"):""}" style="--c:var(--bone)" data-act="order" data-v="${i}"><span class="l">${i+1}</span>${esc(orderTxt(V,P))}</button>`).join("")}</div>`;
}
function revealView(V,T,el){
  const d=V.d||{},res=V.res||{};let answer="";
  if(V.k==="quiz")answer=`<h2 class="q">${esc(d.q)}</h2><div class="opts" aria-disabled="true">${d.o.map((o,i)=>`<div class="opt ${i===res.i?"right":"dim"}" style="--c:${["var(--blood-2)","var(--candle)","var(--moss)","var(--frost)"][i]}"><span class="l">${"ABCD"[i]}</span>${esc(o)}<span class="who-picked">${V.pl.filter(p=>p.rv==="ABCD"[i]).slice(0,6).map(p=>avImg(p.av,22)).join("")}</span><span class="cnt">${res.cnt?res.cnt[i]:""}</span></div>`).join("")}</div>`;
  else if(V.k==="conta")answer=`<div class="expr">${esc(d.e)} = ${esc(res.t)}</div>`;
  else if(V.k==="anag")answer=`<p class="sub">O nome maldito era</p><div class="bigmsg">${esc(res.t)}</div>`;
  else if(V.k==="est")answer=`<h2 class="q" style="font-size:22px">${esc(d.q)}</h2><div class="bigmsg">${esc(res.t)}</div>`;
  else if(V.k==="pacto"){const w=res.w&&V.pl.find(p=>p.id===res.w);answer=`<div class="bigmsg">${w?`${esc(w.n)} selou o pacto com ${res.top}`:res.top?"Empate no topo. O pacto devorou as ofertas.":"Ninguém ofereceu nada."}</div>`}
  else if(V.k==="suss"&&res.q)answer=`<p class="sub">Os sussurros perguntavam por ${res.q.map(i=>`<b>${esc(SUSS_N[d.g[i]])}</b>`).join(", ")}</p><div class="suss small" aria-disabled="true">${d.g.map((g,i)=>`<div class="tomb show ${res.q.includes(i)?"asked":""}"><span class="face">${icon(g)}${res.q.includes(i)?`<em>${res.q.indexOf(i)+1}</em>`:""}</span></div>`).join("")}</div>`;
  else if(V.k==="seq")answer=`<p class="sub">A ordem das velas era</p><div class="seqdots">${(res.s||[]).map(i=>`<i class="on" style="--c:${CANDLES[i]};width:26px;height:26px"></i>`).join("")}</div>`;
  else if(V.k==="porta"&&res.t)answer=`<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">${res.t.map((r,i)=>`<span class="kind" style="--c:${r==="s"?"var(--moss)":r==="p"?"var(--candle)":"var(--blood-2)"};font-size:15px">Porta ${i+1}: ${r==="s"?"segura":r==="p"?"castigo":"morte"}</span>`).join("")}</div>`;
  else if(V.k==="biblio")answer=`<p class="sub">A ordem verdadeira</p><div class="bigmsg" style="font-size:clamp(20px,3.6vw,30px)">${esc(orderTxt(V,d.o[res.i]))}</div>`;
  else if(V.k==="cabo")answer=`<div class="bigmsg">${res.win===0?"O lado esquerdo arrastou os outros":res.win===1?"O lado direito arrastou os outros":"Ninguém cedeu. Empate."}</div>`;
  else answer=`<div class="bigmsg">${{ref:"Quem golpeou primeiro?",tap:"Quem manteve o coração batendo?",coroa:"Quem reinou mais tempo?",cacada:"Quem sobreviveu à caçada?",altar:"Quem abriu mais selos?",reliquia:"Quem entregou a relíquia?",naoolhe:"Quem escapou da criatura?",luz:"Quem chegou mais longe?",chao:"Quem não caiu no abismo?",circulo:"Quem ficou no sal?",vitral:"Quem montou o vitral?"}[V.k]||"Quem fez mais pontos?"}</div>`;
  const rows=V.pl.filter(p=>!p.off||p.rp).slice().sort((a,b)=>b.rp-a.rp);
  const teamRound=V.mode==="times"?`<div class="team-round">${Array.from({length:V.teams},(_,i)=>{const t=V.pl.filter(p=>p.tm===i+1).reduce((a,p)=>a+(p.rp||0),0);return {i,t}}).sort((a,b)=>b.t-a.t).map(({i,t})=>`<span style="--c:${TEAMS[i].c}"><b>${TEAMS[i].n}</b>${t>0?"+":""}${t}</span>`).join("")}</div>`:"";
  const mvp=rows[0]&&rows[0].rp>0&&(!rows[1]||rows[1].rp<rows[0].rp)?rows[0]:null;
  return `<div class="card" style="--c:${T.c}">${kind(V,T,"Resultado · "+T.n)}${answer}
    ${teamRound}${mvp?`<div class="mvp">${icon("coroa")}${avImg(mvp.av,34)}<span><small>Destaque da provação</small><b>${esc(mvp.n)}${mvp.id===U.myId?" (você)":""}</b></span><em>${soul(mvp.rp,true)}</em></div>`:""}<div class="results">${rows.map((p,i)=>`<div class="res ${p.rp?"":"zero"} ${p.id===U.myId?"me":""}"><span class="rk">${i+1}</span><span class="who">${avImg(p.av,28)}<span class="nm">${esc(p.n)}${p.id===U.myId?" (você)":""}</span>${V.mode==="times"&&p.tm&&TEAMS[p.tm-1]?`<span class="tm" style="--c:${TEAMS[p.tm-1].c}">${TEAMS[p.tm-1].n}</span>`:""}</span><span class="v">${esc(p.rv||"nada")}</span><span class="p ${p.rp<0?"neg":""}">${soul(p.rp,true)}</span></div>`).join("")}</div>
    ${tbar(V.rt||(V.r>=V.R?6000:9500),T.c,el)}</div>`;
}
function finalView(V){
  const list=V.pl.slice().sort((a,b)=>b.sc-a.sc);const top=[list[1],list[0],list[2]];const h=[110,150,80];const cols=["#CFC8C0","var(--candle)","#C8875A"];
  let teams="";if(V.mode==="times"){const t=teamTotals(V).sort((a,b)=>b.sc-a.sc);teams=`<div class="panel" style="text-align:center;display:flex;flex-direction:column;gap:10px;align-items:center"><span class="eyebrow">Clã vencedor</span><div class="bigmsg" style="color:${TEAMS[t[0].i-1].c}">${TEAMS[t[0].i-1].n}</div><div class="teams" style="width:100%">${t.map(x=>`<div class="team" style="--c:${TEAMS[x.i-1].c}"><span>${TEAMS[x.i-1].n}</span><b>${soul(x.sc)}</b></div>`).join("")}</div></div>`}
  const rest=list.slice(3);
  return `<div class="final-h"><span class="eyebrow">O ritual terminou</span><h1 class="h-display">${esc(list[0]?list[0].n:"")} colheu mais almas</h1></div>
    ${teams}<div class="podium">${top.map((p,i)=>p?`<div class="pod ${p.id===U.myId?"me":""}" style="--c:${cols[i]}">${i===1?icon("coroa","crown"):""}${avImg(p.av,i===1?96:72)}<span class="nm">${esc(p.n)}${p.id===U.myId?" (você)":""}</span>${soul(p.sc)}<div class="blk" style="height:${h[i]}px">${[2,1,3][i]}</div></div>`:`<div></div>`).join("")}</div>
    ${V.nt&&V.nt.length?`<div class="night"><span class="eyebrow">Placar da noite</span>${V.nt.map(([n,w],i)=>`<span class="nt ${i===0?"lead":""}">${i===0?icon("coroa"):""}<b>${esc(n)}</b> ${w} vitória${w===1?"":"s"}</span>`).join("")}</div>`:""}
    ${(V.aw&&V.aw.length)?`<div class="awards">${V.aw.map((a,i)=>{const p=V.pl.find(x=>x.id===a.id);return p?`<div class="award ${p.id===U.myId?"me":""}" style="--d:${.25+i*.12}s"><span class="ic">${icon(a.i)}</span><div><small>${esc(a.t)}</small><b>${avImg(p.av,22)}${esc(p.n)}</b><em>${esc(a.d)}</em></div></div>`:""}).join("")}</div>`:""}
    ${rest.length?`<div class="panel final-rest"><div class="board">${rest.map((p,i)=>`<div class="row ${p.id===U.myId?"me":""}"><span class="pos">${i+4}</span><span class="who">${avImg(p.av,30)}<span class="nm">${esc(p.n)}${p.id===U.myId?" (você)":""}</span></span><span class="sc">${soul(p.sc)}</span></div>`).join("")}</div></div>`:""}
    <div class="final-actions">${isHost()?`<button class="btn big" data-act="rematch">${icon("flame")}Revanche</button><button class="btn big ghost" data-act="again">Mudar as provações</button>`:""}<button class="btn big ghost" data-act="share">${ICON.copy}Copiar resultado</button></div>
    ${isHost()?"":`<p class="muted" style="text-align:center;margin:0">Quem conduz pode começar a revanche.</p>`}`;
}

/* ---------- almas voando até o placar ---------- */
function soulFly(n){
  const tgt=$(".side .row.me");const src=$(".res.me .p")||$(".res.me")||$("#stage");if(!tgt||!src)return;
  const tr=tgt.getBoundingClientRect(),sr=src.getBoundingClientRect();
  const tx=tr.right-40,ty=tr.top+tr.height/2;const visible=tr.top>0&&tr.bottom<innerHeight;
  const cnt=Math.min(10,Math.max(1,n));
  for(let i=0;i<cnt;i++){const d=document.createElement("div");d.className="fly-soul";d.innerHTML=SOUL_SVG;
    const x0=sr.left+sr.width/2+(Math.random()-.5)*60,y0=sr.top+sr.height/2+(Math.random()-.5)*30;d.style.left=x0+"px";d.style.top=y0+"px";document.body.appendChild(d);
    const ex=visible?tx:x0+(Math.random()-.5)*80,ey=visible?ty:y0-160;const mx=(x0+ex)/2+(Math.random()-.5)*160,my=Math.min(y0,ey)-80-Math.random()*80;
    const a=d.animate([{transform:"translate(-50%,-50%) scale(.4)",opacity:0},{transform:`translate(calc(-50% + ${mx-x0}px),calc(-50% + ${my-y0}px)) scale(1.2)`,opacity:1,offset:.45},{transform:`translate(calc(-50% + ${ex-x0}px),calc(-50% + ${ey-y0}px)) scale(.6)`,opacity:visible?1:0}],{duration:900+i*70,delay:i*70,easing:"cubic-bezier(.3,.6,.3,1)",fill:"forwards"});
    a.onfinish=()=>{d.remove();if(visible){tgt.classList.remove("bump");void tgt.offsetWidth;tgt.classList.add("bump")}tone(880+i*60,.08,"sine",.06)}}
}

/* ---------- atualizações leves ---------- */
function renderLive(){
  const V=U.V;if(!V)return;
  if(V.ph==="lobby"){renderMain();return}
  if(V.ph!=="play")return;
  const b=$("#bars");if(b)b.innerHTML=liveBars(V);
  const me=V.pl.find(p=>p.id===U.myId);
  if((V.k==="conta"||V.k==="anag")&&me){
    if(me.rs==="ok"&&$("#ansIn")){slashFx();renderMain()}
    else if(me.a>U.lastA&&me.rs==="x"){U.lastA=me.a;const f=$("#fb"),i=$("#ansIn");if(f){f.className="feedback x";f.textContent="Errado. Tente de novo."}if(i){i.classList.remove("shake");void i.offsetWidth;i.classList.add("shake");i.select()}sfx.bad()}}
  if(V.k==="seq"&&me&&U.mine[V.rid]!==undefined){const m=$("#seqMsg");if(m&&me.rs)m.textContent=me.rs==="ok"?"O ritual aceitou a sequência.":"Sequência errada."}
  if(V.k==="cabo"){const k=$("#knot");const r=(U.W&&U.W.rope)||0;if(k)k.style.left=(50-r*47)+"%"}
}
let seqTimers=[],tickT=null;
function afterMain(V){
  seqTimers.forEach(clearTimeout);seqTimers=[];
  if(V.ph==="intro"){const el=performance.now()-U.phaseAt;[3,2,1].forEach((n,i)=>{const t=(V.it||4800)-3000+i*1000-el;if(t<-900)return;seqTimers.push(setTimeout(()=>{const c=$("#cd");if(!c)return;c.textContent=n;c.classList.remove("on");void c.offsetWidth;c.classList.add("on");tone(n===1?660:440,.09,"sine",.08)},Math.max(0,t)))})}
  clearInterval(tickT);tickT=null;
  if(V.ph!=="play")return;
  const me=V.pl.some(p=>p.id===U.myId);
  if(me&&!["ref","tap"].includes(V.k)){const endAt=U.phaseAt+((CANVAS_GAMES.has(V.k)||ARENA_GAMES.has(V.k))?TYPES[V.k].dur:V.dur);let lastS=99;const rid=V.rid;
    tickT=setInterval(()=>{if(!U.V||U.V.rid!==rid||U.V.ph!=="play"){clearInterval(tickT);tickT=null;return}if(!(CANVAS_GAMES.has(V.k)||ARENA_GAMES.has(V.k)||V.k==="cabo"||V.k==="vitral")&&U.mine[rid]!==undefined)return;
      const s=Math.ceil((endAt-performance.now())/1000);if(s!==lastS&&s>=1&&s<=5){lastS=s;tone(s===1?1320:990,.05,"square",.035)}},200)}
  const i=$("#ansIn");if(i&&!("ontouchstart" in window))i.focus();
  if(V.k==="seq"&&U.mine[V.rid]===undefined){
    const s=V.d.s,el=performance.now()-U.phaseAt;const pads=[...document.querySelectorAll(".pad")];
    s.forEach((c,k)=>{const t=400+k*650-el;if(t<0)return;seqTimers.push(setTimeout(()=>{pads[c]?.classList.add("lit");sfx.candle(c)},t));seqTimers.push(setTimeout(()=>pads[c]?.classList.remove("lit"),t+440))});
    seqTimers.push(setTimeout(()=>{const p=$("#pads");if(p)p.setAttribute("aria-disabled","false");const m=$("#seqMsg");if(m)m.textContent="Sua vez. Acenda na mesma ordem."},Math.max(0,V.d.show-el)))}
  if(V.k==="tap"){const left=TYPES.tap.dur-(performance.now()-U.phaseAt);seqTimers.push(setTimeout(()=>{const t=$("#tapper");if(t)t.setAttribute("aria-disabled","true");flushTap(true)},Math.max(0,left)))}
  if(U.tv){if(ARENA_GAMES.has(V.k)){const cv=$("#arena");if(cv)arena=runArena(V.k,cv,V,U.phaseAt+TYPES[V.k].dur,{spect:true})}if(V.k==="suss")startSuss(V);return}
  if(!me)return;
  if(CANVAS_GAMES.has(V.k)){const cv=$("#arena");if(cv){U.arcScore=0;arcade=runArcade(V.k,cv,V.d.seed,U.phaseAt+TYPES[V.k].dur,sc=>sendArcadeScore(sc))}}
  if(ARENA_GAMES.has(V.k)){const cv=$("#arena");if(cv)arena=runArena(V.k,cv,V,U.phaseAt+TYPES[V.k].dur)}
  if(V.k==="cabo")startCabo(V);
  if(V.k==="suss")startSuss(V);
  if(V.k==="vitral")startVitral(V);
}
function flushTap(final){const V=U.V;if(!V||V.k!=="tap")return;if(U.tapN===U.tapSent&&!final)return;U.tapSent=U.tapN;
  if(U.mode==="guest"){U.ak++;U.tbl.presence({ans:{r:V.rid,v:U.tapN,k:U.ak}}).catch(()=>{})}else onAnswer(U.myId,U.tapN,"")}
let tapFlushTimer=null;
function doTap(){const V=U.V;if(!V||V.ph!=="play"||V.k!=="tap")return;if(performance.now()-U.phaseAt>TYPES.tap.dur)return;
  U.tapN++;const t=$("#tapN");if(t)t.textContent=U.tapN;if(U.tapN%2)sfx.heart();if(!tapFlushTimer)tapFlushTimer=setTimeout(()=>{tapFlushTimer=null;flushTap(false)},250)}
function doReflex(){const V=U.V;if(!V||V.ph!=="play"||V.k!=="ref"||U.mine[V.rid]!==undefined)return;
  if(!V.go){sendAnswer(-1);hurt(.8)}else{const ms=Math.round(performance.now()-U.refAt);sendAnswer(ms);slashFx();blood(innerWidth/2,innerHeight/2,.6)}renderMain()}
function doPad(i){const V=U.V;if(!V||V.k!=="seq"||U.mine[V.rid]!==undefined)return;if($("#pads")?.getAttribute("aria-disabled")==="true")return;
  sfx.candle(i);U.seqIn.push(i);const pads=document.querySelectorAll(".pad");pads[i].classList.add("lit");setTimeout(()=>pads[i]&&pads[i].classList.remove("lit"),200);
  const dots=document.querySelectorAll("#seqDots i");const k=U.seqIn.length-1;if(dots[k]){dots[k].style.setProperty("--c",CANDLES[i]);dots[k].classList.add("on")}
  if(U.seqIn.length>=V.d.s.length){sendAnswer(U.seqIn.join(""));$("#pads")?.setAttribute("aria-disabled","true");const m=$("#seqMsg");if(m)m.textContent="Enviado ao ritual…"}}

/* ---------- sussurros ---------- */
let SUS=null;
function startSuss(V){
  const done=U.mine[V.rid]!==undefined;const el=performance.now()-U.phaseAt;SUS={rid:V.rid,step:0,ans:[],open:false};
  const grid=$("#suss");if(!grid)return;const tombs=[...grid.querySelectorAll(".tomb")];
  const ask=()=>{const m=$("#susMsg");if(m)m.innerHTML=SUS.step<3?`Onde estava <b>${esc(SUSS_N[V.d.g[V.d.q[SUS.step]]])}</b>?`:"Resposta entregue aos mortos.";
    [...document.querySelectorAll("#susSteps i")].forEach((d,i)=>d.className=i<SUS.step?(SUS.ans[i]===V.d.q[i]?"ok":"x"):i===SUS.step?"cur":"")};
  if(done){tombs.forEach(t=>t.classList.add("closed"));return}
  tombs.forEach(t=>t.classList.add("show"));
  seqTimers.push(setTimeout(()=>{tombs.forEach(t=>{t.classList.remove("show");t.classList.add("closed")});sfx.whisper();SUS.open=true;grid.setAttribute("aria-disabled","false");ask()},Math.max(0,V.d.show-el)));
  SUS.pick=i=>{if(U.tv||!SUS.open||SUS.step>=3||!U.V||U.V.rid!==SUS.rid)return;const t=tombs[i];const ok=i===V.d.q[SUS.step];SUS.ans.push(i);SUS.step++;
    t.classList.add(ok?"hit":"miss","show");setTimeout(()=>t.classList.remove("show","hit","miss"),700);ok?sfx.ok():sfx.bad();ask();
    if(SUS.step>=3){SUS.open=false;grid.setAttribute("aria-disabled","true");sendAnswer(SUS.ans.join(","))}}
}
/* ---------- cabo de guerra ---------- */
let CABO=null;
function startCabo(V){
  const my=(V.d.sides||{})[U.myId];const r=mulberry32(V.d.seed^((V.d.sl||{})[U.myId]||0)*7919);
  const KEYS=["ArrowLeft","ArrowUp","ArrowDown","ArrowRight"],GL={ArrowLeft:"←",ArrowUp:"↑",ArrowDown:"↓",ArrowRight:"→"};
  CABO={rid:V.rid,pu:0,er:0,pos:0,combo:[],sent:"",end:U.phaseAt+TYPES.cabo.dur};
  const newCombo=()=>{const n=CABO.pu>=6?5:4;CABO.combo=Array.from({length:n},()=>KEYS[Math.floor(r()*4)]);CABO.pos=0;draw()};
  const draw=()=>{const el=$("#combo");if(el)el.innerHTML=CABO.combo.map((k,i)=>`<i class="${i<CABO.pos?"done":""}">${GL[k]}</i>`).join("");const inf=$("#pullInfo");if(inf)inf.textContent=`${CABO.pu} ${CABO.pu===1?"puxão":"puxões"} · ${CABO.er} erros`};
  CABO.press=(k)=>{if(my===undefined||performance.now()>CABO.end||!U.V||U.V.rid!==CABO.rid||U.V.ph!=="play")return;
    if(k===CABO.combo[CABO.pos]){CABO.pos++;sfx.tap();if(CABO.pos>=CABO.combo.length){CABO.pu++;sfx.slash();newCombo();send()}else draw()}
    else{CABO.er++;CABO.pos=0;sfx.bad();const el=$("#combo");if(el){el.querySelectorAll("i").forEach(x=>x.classList.add("bad"))}setTimeout(draw,280);send();const f=$("#fb");if(f)f.textContent="Escorregou! Seu lado perdeu força."}};
  const send=()=>{const v=`${CABO.pu}:${CABO.er}`;if(v===CABO.sent)return;CABO.sent=v;sendArcadeScore(v)};
  newCombo();
}
/* ---------- vitral ---------- */
function startVitral(V){
  const host=$("#vitral");if(!host)return;const seed=V.d.seed,r=mulberry32(seed^0x9e);
  const S=360,src=document.createElement("canvas");src.width=S;src.height=S;const c=src.getContext("2d");
  const pts=Array.from({length:22},()=>[r()*S,r()*S,["#8E0A1F","#C8102E","#2B4A8A","#3E7A2E","#F2C14E","#6B3A8A","#1F6F7A"][Math.floor(r()*7)]]);
  const img=c.createImageData(S,S);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let a=1e9,b=1e9,ai=0;for(let i=0;i<pts.length;i++){const d=(x-pts[i][0])**2+(y-pts[i][1])**2;if(d<a){b=a;a=d;ai=i}else if(d<b)b=d}
    const edge=Math.sqrt(b)-Math.sqrt(a)<3;const col=pts[ai][2];const R=parseInt(col.slice(1,3),16),G=parseInt(col.slice(3,5),16),B=parseInt(col.slice(5,7),16);
    const light=1.25-y/S*.55;const o=(y*S+x)*4;if(edge){img.data[o]=12;img.data[o+1]=8;img.data[o+2]=10}else{img.data[o]=Math.min(255,R*light);img.data[o+1]=Math.min(255,G*light);img.data[o+2]=Math.min(255,B*light)}img.data[o+3]=255}
  c.putImageData(img,0,0);
  c.strokeStyle="#0C080A";c.lineWidth=7;c.beginPath();c.arc(S/2,S/2,S*.36,0,7);c.stroke();c.beginPath();c.arc(S/2,S/2,S*.14,0,7);c.stroke();
  for(let i=0;i<8;i++){const a=i*Math.PI/4;c.beginPath();c.moveTo(S/2+Math.cos(a)*S*.14,S/2+Math.sin(a)*S*.14);c.lineTo(S/2+Math.cos(a)*S*.36,S/2+Math.sin(a)*S*.36);c.stroke()}
  const T=S/3;for(let i=0;i<9;i++){const x=(i%3)*T+T/2,y=Math.floor(i/3)*T+10;c.beginPath();c.moveTo(x,y);c.lineTo(x-9,y+14);c.lineTo(x+9,y+14);c.closePath();c.fillStyle="#FFF7E0";c.fill();c.lineWidth=2.5;c.strokeStyle="#0C080A";c.stroke()}
  const pieces=Array.from({length:9},(_,i)=>{const cv=document.createElement("canvas");cv.width=T;cv.height=T;cv.getContext("2d").drawImage(src,(i%3)*T,Math.floor(i/3)*T,T,T,0,0,T,T);return cv});
  let order;do{order=Array.from({length:9},(_,i)=>i);for(let i=8;i>0;i--){const j=Math.floor(r()*(i+1));[order[i],order[j]]=[order[j],order[i]]}}while(order.every((v,i)=>v===i));
  const slots=order.map(p=>({p,r:Math.floor(r()*4)}));
  let solved=false,drag=null;const t0=U.phaseAt;
  const correct=()=>slots.filter((s,i)=>s.p===i&&s.r%4===0).length;
  function paint(){host.innerHTML="";slots.forEach((s,i)=>{const d=document.createElement("div");d.className="tile"+(s.p===i&&s.r%4===0?" ok":"");d.dataset.i=i;const cv=pieces[s.p];cv.style.transform=`rotate(${s.r*90}deg)`;d.appendChild(cv);host.appendChild(d)});host.classList.toggle("solved",solved)}
  function report(){const n=correct();if(n===9&&!solved){solved=true;const el=performance.now()-t0;sendArcadeScore(10000+Math.max(0,Math.round((TYPES.vitral.dur-el)/10)));sfx.win();drips(10);
      $("#rune").innerHTML=`<svg viewBox="0 0 200 80" width="260" height="104" style="filter:drop-shadow(0 0 14px #F2C14E)"><g fill="none" stroke="#F2C14E" stroke-width="5" stroke-linecap="round"><path d="M40 70L70 10L100 70M55 42h30"/><path d="M120 10v60M120 40l30-30M120 40l30 30"/><circle cx="175" cy="40" r="18"/></g></svg>`}
    else if(!solved)sendArcadeScore(n*100)}
  host.onpointerdown=e=>{if(solved)return;const t=e.target.closest(".tile");if(!t)return;e.preventDefault();host.setPointerCapture?.(e.pointerId);drag={i:+t.dataset.i,x:e.clientX,y:e.clientY};t.classList.add("pick")};
  host.onpointerup=e=>{if(!drag||solved)return;const el=document.elementFromPoint(e.clientX,e.clientY);const t=el&&el.closest?el.closest(".tile"):null;const j=t?+t.dataset.i:drag.i;const moved=Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>12;
    if(j!==drag.i){[slots[drag.i],slots[j]]=[slots[j],slots[drag.i]];sfx.tap()}else if(!moved){slots[j].r=(slots[j].r+1)%4;noise(.05,.1,3000,1500)}
    drag=null;paint();report()};
  host.onpointerleave=()=>{};
  paint();report();
}

/* ============================================================
   EVENTOS
   ============================================================ */
function showHowTo(){$(".overlay")?.remove();const o=document.createElement("div");o.className="overlay";
  const step=(i,ic,t,d)=>`<div class="how-step"><span class="n">${i}</span><span class="ic">${icon(ic)}</span><div><b>${t}</b><p>${d}</p></div></div>`;
  o.innerHTML=`<div class="panel how"><button class="icon-btn close" data-act="closeOv" aria-label="Fechar">✕</button><span class="eyebrow">Como jogar</span><h2 class="h-display">O ritual em 4 passos</h2>
    ${step(1,"users","Reúna os vivos","Um conduz o ritual e recebe um código de 4 letras. Os outros abrem esta mesma página e entram com o código. Dá pra treinar sozinho contra bots.")}
    ${step(2,"flame","Sobreviva às provações","Cada rodada sorteia uma provação: perguntas, reflexo, minijogos e mapas ao vivo. Quem vai melhor colhe mais almas (10, 8, 7…). Errar algumas custa almas. Na Lua de sangue (sempre na última provação) as almas valem o dobro.")}
    ${step(3,"map","Nos mapas ao vivo",`Ande com <kbd>WASD</kbd> ou setas (no celular, arraste o dedo). <kbd>espaço</kbd> dá investida, <kbd>E</kbd> usa a habilidade da runa ◆ que você pegar. <span class="nowrap"><kbd>1</kbd>–<kbd>4</kbd></span> mandam provocações.`)}
    ${step(4,"coroa","Colha mais almas","No fim, quem tiver mais almas vence e o ritual entrega prêmios. Seus recordes ficam salvos neste navegador.")}
    <button class="btn big block" data-act="closeOv">Entendi</button></div>`;
  o.addEventListener("click",e=>{if(e.target===o)o.remove()});document.body.appendChild(o)}
function showOverlay(title,body,leave){$(".overlay")?.remove();const o=document.createElement("div");o.className="overlay";
  o.innerHTML=`<div class="panel"><h2 class="h-display" style="font-size:30px">${esc(title)}</h2><p class="muted" style="margin:0">${body}</p><button class="btn" data-act="${leave?"leave":"closeOv"}">${leave?"Voltar ao início":"Ok"}</button></div>`;document.body.appendChild(o)}
function saveNick(){const n=clean($("#nick")?.value)||U.nick;U.nick=n;store.set("nick",n);U.room?.presence({nick:n}).catch(()=>{})}
function saveCfg(){if(H){U.cfg=Object.assign(U.cfg,JSON.parse(JSON.stringify(H.cfg)),{bots:U.cfg.bots})}store.set("cfg",U.cfg)}
let firstGesture=true;
document.addEventListener("pointerdown",e=>{
  if(firstGesture){firstGesture=false;audio();if(soundOn)setDrone(true)}
  if(e.target.closest("#tapper")){e.preventDefault();doTap()}
  else if(e.target.closest("#reflex")){e.preventDefault();doReflex()}
  else if(e.target.closest(".pad")){e.preventDefault();doPad(+e.target.closest(".pad").dataset.v)}
});
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-act]");if(!b)return;const a=b.dataset.act,v=b.dataset.v;audio();
  switch(a){
    case "sound":{if(!soundOn){soundOn=true;setVolume(1)}else if(volume>.6)setVolume(.4);else soundOn=false;store.set("sound",soundOn);setDrone(soundOn);if(soundOn)sfx.tap();toast(soundOn?(volume>.6?"Som alto":"Som baixo"):"Som desligado");U.screen==="lobby"?renderLobby():renderHead();break}
    case "avp":{const o=avParse(U.av),k=b.dataset.k,n=AV[k].length;let g=0;do{o[k]=(o[k]+(+v)+n)%n;g++}while(avLocked(k,o[k])&&g<n);U.av=avCode(o);saveAv();renderLobby();sfx.tap();break}
    case "avc":{const o=avParse(U.av);o.c=+v;U.av=avCode(o);saveAv();renderLobby();break}
    case "avr":U.av=avMyRandom();saveAv();renderLobby();sfx.slash();break;
    case "bots":U.cfg.bots=+v;store.set("cfg",U.cfg);renderLobby();break;
    case "tv":U.cfg.tv=!U.cfg.tv;store.set("cfg",U.cfg);renderLobby();break;
    case "bd":U.cfg.bd=+v;store.set("cfg",U.cfg);if(H&&U.screen==="room"){H.cfg.bd=+v;commit()}else renderLobby();break;
    case "create":saveNick();createOnline();break;
    case "join":saveNick();joinOnline($("#code").value);break;
    case "joinCode":saveNick();joinOnline(v);break;
    case "solo":saveNick();startSolo();break;
    case "try":{saveNick();startSolo();H.cfg.count=1;H.cfg.types=Object.fromEntries(TYPE_KEYS.map(x=>[x,x===v]));if(v==="pacto")H.pl.forEach(p=>{p.sc=0});startGame();if(v==="pacto")H.pl.forEach(p=>{p.sc=10});commit();break}
    case "leave":leaveRoom();break;
    case "closeOv":$(".overlay")?.remove();break;
    case "howto":showHowTo();break;
    case "copy":navigator.clipboard?.writeText(U.code).then(()=>toast("Código copiado"),()=>toast("Código: "+U.code));break;
    case "mode":H.cfg.mode=v;H.pl.forEach(p=>p.tm=0);if(v==="times")H.pl.forEach(p=>{p.tm=chooseTeam(p.id===U.myId?U.myTeam:0)});saveCfg();commit();break;
    case "teams":H.cfg.teams=+v;H.pl.forEach(p=>{if(p.tm>H.cfg.teams)p.tm=0});H.pl.forEach(p=>{if(!p.tm)p.tm=chooseTeam(0)});saveCfg();commit();break;
    case "count":H.cfg.count=+v;saveCfg();commit();break;
    case "pace":H.cfg.pace=v;saveCfg();commit();break;
    case "type":{H.cfg.types[v]=!H.cfg.types[v];if(!TYPE_KEYS.some(k=>H.cfg.types[k]))H.cfg.types[v]=true;saveCfg();commit();break}
    case "preset":{const pick={all:()=>true,new:k=>GROUPS[1].k.includes(k),map:k=>ARENA_GAMES.has(k)||k==="cabo",mind:k=>MIND.has(k)}[v];TYPE_KEYS.forEach(k=>H.cfg.types[k]=pick(k));saveCfg();commit();break}
    case "botAdd":if(H&&activePlayers().length<MAX_PLAYERS){addBot();commit()}break;
    case "botDel":if(H){const b=[...H.pl.values()].reverse().find(p=>p.bot);if(b){H.pl.delete(b.id);commit()}}break;
    case "team":setTeam(+v);break;
    case "start":if(H){if(!activePlayers().length){toast("Ninguém no círculo ainda");break}startGame()}break;
    case "skip":if(H){if(H.ph==="intro")playPhase();else if(H.ph==="play")revealPhase()}break;
    case "next":if(H&&H.ph==="reveal")nextRound();break;
    case "finish":if(H)finalPhase();break;
    case "again":if(H)backToLobby();break;
    case "rematch":if(H){backToLobby();startGame()}break;
    case "share":{const V=U.V;if(!V)break;const l=V.pl.slice().sort((a,b)=>b.sc-a.sc);const txt=["Rodada Maldita · resultado do ritual",...l.map((p,i)=>`${i+1}º ${p.n} — ${p.sc} almas`),...(V.aw&&V.aw.length?["","Prêmios:",...V.aw.map(a=>{const p=V.pl.find(x=>x.id===a.id);return `${a.t}: ${p?p.n:"?"} (${a.d})`})]:[])].join("\n");
      navigator.clipboard?.writeText(txt).then(()=>toast("Resultado copiado"),()=>toast("Não deu pra copiar"));break}
    case "say":sayQuick(v);break;
    case "dash":if(arena)arena.dash();break;
    case "ability":if(arena)arena.ability();break;
    case "hitbox":if(arena)arena.toggleDebug();else if(arcade)arcade.toggleDebug();else U.hitbox=!U.hitbox;toast(U.hitbox?"Hitbox visível":"Hitbox escondido");break;
    case "arrow":if(CABO)CABO.press(v);break;
    case "pacto":{const V=U.V;if(V&&V.k==="pacto"&&V.ph==="play"&&U.mine[V.rid]===undefined){sendAnswer(+v);sfx.stab();renderMain()}break}
    case "sus":if(SUS&&SUS.pick)SUS.pick(+v);break;
    case "ans":{const V=U.V;if(V&&V.k==="quiz"&&U.mine[V.rid]===undefined){sendAnswer(+v);sfx.tap();renderMain()}break}
    case "note":{const V=U.V;U.read=U.read||{};if(!U.read[V.rid+v]){U.read[V.rid+v]=1;sfx.creak()}renderMain();break}
    case "book":{const V=U.V;U.read=U.read||{};if(!U.read[V.rid+"b"+v]){U.read[V.rid+"b"+v]=1;sfx.whisper()}renderMain();break}
    case "door":{const V=U.V;if(V&&V.k==="porta"&&U.mine[V.rid]===undefined){sendAnswer(+v);sfx.creak();renderMain()}break}
    case "order":{const V=U.V;if(V&&V.k==="biblio"&&U.mine[V.rid]===undefined){sendAnswer(+v);sfx.tap();renderMain()}break}
  }
});
document.addEventListener("submit",e=>{e.preventDefault();
  if(e.target.dataset.form==="ans"){const V=U.V,i=$("#ansIn");if(!V||!i)return;const val=i.value.trim();if(!val)return;
    if(V.k==="est"){if(parseNum(val)===null){toast("Digite um número");return}sendAnswer(val);sfx.tap();renderMain()}
    else if(V.k==="conta"){if(parseNum(val)===null){toast("Digite um número");return}sendAnswer(val);const f=$("#fb");if(f){f.className="feedback";f.textContent="Conferindo…"}}
    else if(V.k==="anag"){sendAnswer(val);const f=$("#fb");if(f){f.className="feedback";f.textContent="Conferindo…"}}}});
document.addEventListener("keydown",e=>{
  if(U.screen==="lobby"&&e.key==="Enter"&&e.target.id==="code"){saveNick();joinOnline(e.target.value);return}
  if(U.screen!=="room"||!U.V)return;const V=U.V;if(e.target.closest("input"))return;
  if(V.ph==="play"&&V.k==="tap"&&e.code==="Space"){e.preventDefault();if(!e.repeat)doTap()}
  if(V.ph==="play"&&V.k==="ref"&&(e.code==="Space"||e.key==="Enter")){e.preventDefault();if(!e.repeat)doReflex()}
  if(V.ph==="play"&&V.k==="cabo"&&CABO&&e.key.startsWith("Arrow")){e.preventDefault();if(!e.repeat)CABO.press(e.key)}
  if(V.ph==="play"&&ARENA_GAMES.has(V.k)&&U.mode!=="solo"&&/^[1-4]$/.test(e.key)&&!e.repeat){sayQuick(QUICK[+e.key-1]);return}
  if(V.ph==="play"&&V.k==="quiz"&&/^[1-4]$/.test(e.key)&&U.mine[V.rid]===undefined){sendAnswer(+e.key-1);sfx.tap();renderMain()}
});

renderLobby();
connectLobby();
