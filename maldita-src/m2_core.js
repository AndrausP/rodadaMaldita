/* ============================================================
   CONTEÚDO
   ============================================================ */
const QUIZ=[
["Quem escreveu Drácula?",["Bram Stoker","Mary Shelley","Edgar Allan Poe","H. P. Lovecraft"]],
["Quem escreveu Frankenstein?",["Mary Shelley","Bram Stoker","Stephen King","Anne Rice"]],
["Em que país fica a região da Transilvânia?",["Romênia","Hungria","Alemanha","Rússia"]],
["Qual ser do folclore brasileiro tem os pés virados para trás?",["Curupira","Saci","Boitatá","Iara"]],
["Qual ser do folclore é um menino de uma perna só com gorro vermelho?",["Saci","Curupira","Boto","Cuca"]],
["Qual criatura vira lobo em noite de lua cheia?",["Lobisomem","Vampiro","Zumbi","Múmia"]],
["Em que dia se comemora o Halloween?",["31 de outubro","2 de novembro","1º de novembro","13 de outubro"]],
["O Dia de Finados no Brasil cai em qual data?",["2 de novembro","31 de outubro","1º de novembro","15 de novembro"]],
["Quem dirigiu o filme Psicose, de 1960?",["Alfred Hitchcock","Stanley Kubrick","John Carpenter","Wes Craven"]],
["Múmias são mais associadas a qual civilização antiga?",["Egípcia","Grega","Romana","Maia"]],
["Qual animal é mais associado aos vampiros?",["Morcego","Corvo","Lobo","Aranha"]],
["Quem escreveu o conto O Corvo?",["Edgar Allan Poe","Machado de Assis","Bram Stoker","Oscar Wilde"]],
["Qual cobra de fogo protege as matas no folclore brasileiro?",["Boitatá","Cuca","Iara","Mapinguari"]],
["Qual planeta é conhecido como Planeta Vermelho?",["Marte","Júpiter","Vênus","Saturno"]],
["Qual é o maior oceano do mundo?",["Pacífico","Atlântico","Índico","Ártico"]],
["Qual é o símbolo químico do ouro?",["Au","Ag","Or","Go"]],
["Quantos ossos tem o corpo de um adulto?",["206","186","256","212"]],
["Qual é o osso mais longo do corpo humano?",["Fêmur","Tíbia","Úmero","Rádio"]],
["Qual é o coletivo de lobos?",["Alcateia","Cardume","Enxame","Manada"]],
["Qual destes animais é um mamífero?",["Morcego","Pinguim","Tubarão","Jacaré"]],
["Qual é a capital da Austrália?",["Canberra","Sydney","Melbourne","Perth"]],
["Quem pintou a Mona Lisa?",["Leonardo da Vinci","Michelangelo","Rafael","Van Gogh"]],
["Quantas patas tem uma aranha?",["8","6","10","12"]],
["Como se chama o medo de aranhas?",["Aracnofobia","Claustrofobia","Acrofobia","Nictofobia"]],
["Como se chama o medo do escuro?",["Nictofobia","Hidrofobia","Agorafobia","Aracnofobia"]],
["Qual é a capital de Goiás?",["Goiânia","Anápolis","Aparecida de Goiânia","Rio Verde"]],
["Qual fruto do Cerrado vai no arroz goiano?",["Pequi","Cupuaçu","Açaí","Caju"]],
["Qual é o menor planeta do Sistema Solar?",["Mercúrio","Marte","Vênus","Netuno"]],
["Em que ano o Brasil ganhou sua primeira Copa do Mundo?",["1958","1962","1970","1950"]],
["Qual gás existe em maior quantidade no ar?",["Nitrogênio","Oxigênio","Gás carbônico","Argônio"]],
["Qual rio atravessa Paris?",["Sena","Tâmisa","Reno","Danúbio"]],
["Qual linguagem roda direto no navegador?",["JavaScript","C#","Java","Python"]],
["Qual ser do folclore é uma sereia dos rios?",["Iara","Cuca","Mula sem cabeça","Boto"]],
["Qual criatura do folclore não tem cabeça e solta fogo pelo pescoço?",["Mula sem cabeça","Boitatá","Saci","Curupira"]],
["Qual animal do folclore vira um homem sedutor nas festas?",["Boto","Iara","Jacaré","Peixe-boi"]],
["Qual bruxa do folclore tem cabeça de jacaré?",["Cuca","Iara","Mapinguari","Comadre Fulozinha"]],
["Quem escreveu It: A Coisa?",["Stephen King","Dean Koontz","Clive Barker","Neil Gaiman"]],
["Em qual filme aparece o palhaço Pennywise?",["It","Sexta-feira 13","Halloween","Pânico"]],
["Qual vilão usa uma máscara de hóquei?",["Jason Voorhees","Freddy Krueger","Michael Myers","Ghostface"]],
["Qual vilão ataca as vítimas dentro dos sonhos?",["Freddy Krueger","Jason Voorhees","Chucky","Jigsaw"]],
["Como se chama o boneco de Brinquedo Assassino?",["Chucky","Annabelle","Billy","Slappy"]],
["Em qual filme a menina Regan é possuída?",["O Exorcista","A Profecia","Invocação do Mal","Hereditário"]],
["Qual casal de investigadores inspirou Invocação do Mal?",["Ed e Lorraine Warren","Gomez e Mortícia","Mulder e Scully","Sam e Dean"]],
["Quem escreveu O Médico e o Monstro?",["Robert Louis Stevenson","Charles Dickens","Oscar Wilde","H. G. Wells"]],
["Quem escreveu O Retrato de Dorian Gray?",["Oscar Wilde","Edgar Allan Poe","Mary Shelley","Bram Stoker"]],
["Qual escritor criou Cthulhu?",["H. P. Lovecraft","Edgar Allan Poe","Stephen King","Bram Stoker"]],
["O filme Nosferatu, de 1922, é de qual país?",["Alemanha","França","Estados Unidos","Inglaterra"]],
["Nas lendas, qual metal fere o lobisomem?",["Prata","Ouro","Ferro","Cobre"]],
["Segundo as lendas, o que afasta vampiros?",["Alho","Canela","Cebola","Pimenta"]],
["Como se chama o medo do número 13?",["Triscaidecafobia","Hexafobia","Numerofobia","Tetrafobia"]],
["Como se chama o medo de altura?",["Acrofobia","Claustrofobia","Agorafobia","Nictofobia"]],
["Como se chama o medo de lugares fechados?",["Claustrofobia","Acrofobia","Agorafobia","Hidrofobia"]],
["Qual órgão bombeia o sangue pelo corpo?",["Coração","Fígado","Pulmão","Rim"]],
["Qual tipo de sangue é o doador universal?",["O negativo","AB positivo","A negativo","B positivo"]],
["Quantas câmaras tem o coração humano?",["4","2","3","6"]],
["Qual é o maior órgão do corpo humano?",["Pele","Fígado","Pulmão","Intestino"]],
["Qual é o maior planeta do Sistema Solar?",["Júpiter","Saturno","Netuno","Terra"]],
["Qual é a estrela mais próxima da Terra?",["Sol","Proxima Centauri","Sirius","Alfa Centauri"]],
["Qual é o maior país da América do Sul?",["Brasil","Argentina","Peru","Colômbia"]],
["Em que ano Brasília foi inaugurada?",["1960","1950","1964","1955"]],
["Qual bioma domina o estado de Goiás?",["Cerrado","Caatinga","Pampa","Mata Atlântica"]],
["De qual país vem o Día de los Muertos?",["México","Espanha","Peru","Colômbia"]],
["Como se chama a abóbora esculpida do Halloween?",["Jack-o'-lantern","Pumpkin pie","Trick-or-treat","Samhain"]],
["Qual festival celta deu origem ao Halloween?",["Samhain","Beltane","Yule","Ostara"]],
["Quantas pontas tem um pentagrama?",["5","6","4","7"]],
["Qual ave é tradicionalmente ligada ao mau agouro?",["Corvo","Pomba","Arara","Pardal"]],
["Qual é o ponto de ebulição da água ao nível do mar?",["100 °C","90 °C","120 °C","80 °C"]],
["Qual elemento químico tem o símbolo Fe?",["Ferro","Flúor","Fósforo","Frâncio"]],
["Quem propôs a teoria da relatividade?",["Albert Einstein","Isaac Newton","Nikola Tesla","Galileu Galilei"]],
["Qual país tem o formato de uma bota?",["Itália","Grécia","Portugal","Chile"]],
["Qual é o animal terrestre mais rápido?",["Guepardo","Leão","Cavalo","Antílope"]],
["Quantos corações tem um polvo?",["3","1","2","8"]],
["De que cor é o sangue de um polvo?",["Azul","Verde","Vermelho","Transparente"]],
["Qual inseto é famoso porque a fêmea pode devorar o macho?",["Louva-a-deus","Abelha","Formiga","Besouro"]],
["Como se chama o cão de três cabeças da mitologia grega?",["Cérbero","Hidra","Quimera","Pégaso"]],
["Qual deus grego governa o mundo dos mortos?",["Hades","Zeus","Poseidon","Ares"]],
["Quem transformava em pedra quem olhasse para ela?",["Medusa","Hera","Circe","Pandora"]],
["Qual barqueiro leva as almas pelo rio dos mortos?",["Caronte","Hermes","Orfeu","Cérbero"]],
["Qual deus egípcio tem cabeça de chacal?",["Anúbis","Rá","Hórus","Osíris"]],
["Na mitologia nórdica, qual é o salão dos guerreiros mortos?",["Valhalla","Asgard","Midgard","Olimpo"]],
["O que significa a sigla HTML?",["HyperText Markup Language","High Tech Modern Language","Home Tool Markup Language","Hyperlink Text Mode Language"]],
["Quantos bits tem um byte?",["8","4","16","10"]],
["Qual empresa criou o C#?",["Microsoft","Apple","Google","Oracle"]],
["Em qual jogo existe o Creeper, que explode?",["Minecraft","Terraria","Roblox","Fortnite"]],
["Em qual jogo você foge de animatrônicos numa pizzaria?",["Five Nights at Freddy's","Resident Evil","Silent Hill","Outlast"]],
["Qual série de jogos se passa em Raccoon City?",["Resident Evil","Silent Hill","Dead Space","The Last of Us"]],
["Qual série tem o Demogorgon e o Mundo Invertido?",["Stranger Things","Dark","The Walking Dead","Wandinha"]],
["Qual é o nome da filha da Família Addams?",["Wandinha","Mortícia","Feioso","Tropeço"]],
["Em qual série os zumbis são chamados de errantes?",["The Walking Dead","Stranger Things","Supernatural","Lost"]],
["Qual planeta tem os anéis mais famosos?",["Saturno","Júpiter","Urano","Netuno"]],
["Quantos dias tem um ano bissexto?",["366","365","364","367"]],
["Qual metal é líquido à temperatura ambiente?",["Mercúrio","Chumbo","Estanho","Alumínio"]],
["Qual é a capital do Japão?",["Tóquio","Quioto","Osaka","Seul"]],
["Qual é o maior deserto quente do mundo?",["Saara","Gobi","Atacama","Kalahari"]],
["Qual é o menor osso do corpo humano?",["Estribo","Martelo","Bigorna","Falange"]],
["Qual vampiro é personagem de Entrevista com o Vampiro?",["Lestat","Drácula","Edward","Orlok"]],
["Quem escreveu Noite na Taverna?",["Álvares de Azevedo","Machado de Assis","José de Alencar","Castro Alves"]],
["Em qual livro de Machado de Assis o narrador é um defunto?",["Memórias Póstumas de Brás Cubas","Dom Casmurro","Quincas Borba","O Alienista"]],
["Como se chama o hospício de O Alienista?",["Casa Verde","Casa Amarela","Casa Branca","Casa Azul"]],
["Quem escreveu O Iluminado?",["Stephen King","Anne Rice","Dean Koontz","Peter Straub"]],
["Qual hotel é o cenário de O Iluminado?",["Overlook","Bates","Cecil","Stanley"]],
["Qual é o nome do motel de Psicose?",["Bates Motel","Overlook","Hotel California","Motel Norman"]],
["Qual filme tem a frase \"Eles estão aqui\"?",["Poltergeist","O Chamado","Sinais","Atividade Paranormal"]],
["Em O Chamado, o que acontece 7 dias depois de ver a fita?",["A pessoa morre","Ela esquece tudo","Ela vira fantasma","Nada acontece"]],
["Como se chama a menina da fita em O Chamado (versão americana)?",["Samara","Sadako","Regan","Carrie"]],
["Qual personagem de Stephen King tem telecinese e vai ao baile?",["Carrie","Samara","Wandinha","Eleven"]],
["Em Stranger Things, qual personagem tem poderes e ama waffles?",["Eleven","Max","Will","Nancy"]],
["Qual monstro vive no Lago Ness, segundo a lenda?",["Nessie","Kraken","Pé Grande","Chupa-cabra"]],
["Qual criatura lendária ataca cabras nas Américas?",["Chupa-cabra","Mapinguari","Wendigo","Yeti"]],
["Como se chama o abominável homem das neves do Himalaia?",["Yeti","Pé Grande","Wendigo","Sasquatch"]],
["Que cor resulta da mistura de azul e amarelo?",["Verde","Roxo","Laranja","Marrom"]],
["Quantos minutos dura um jogo de futebol, sem acréscimos?",["90","80","100","120"]],
["Qual é o maior mamífero do mundo?",["Baleia-azul","Elefante-africano","Girafa","Cachalote"]],
["Como se chama o processo em que as plantas usam a luz para produzir energia?",["Fotossíntese","Respiração","Digestão","Fermentação"]],
["Qual é a moeda do Japão?",["Iene","Yuan","Won","Rupia"]],
["Quem descobriu a penicilina?",["Alexander Fleming","Louis Pasteur","Marie Curie","Charles Darwin"]],
["Qual é o símbolo químico da prata?",["Ag","Au","Pt","Pb"]],
["Em programação, o que é um bug?",["Um erro no código","Um tipo de vírus","Uma linguagem","Um servidor"]],
["Qual destes é um banco de dados relacional?",["PostgreSQL","Redis","MongoDB","Kafka"]],
["Qual padrão separa comandos de consultas?",["CQRS","MVC","REST","SOLID"]],
["Qual planeta gira quase deitado de lado?",["Urano","Netuno","Marte","Vênus"]],
["Qual é a montanha mais alta da América do Sul?",["Aconcágua","Pico da Neblina","Chimborazo","Huascarán"]],
["Qual fruta aparece como o fruto proibido em muitas pinturas?",["Maçã","Pera","Uva","Figo"]],
["Qual continente tem mais países?",["África","Ásia","Europa","América"]]
];
const EST=[
["Em que ano foi publicado Drácula, de Bram Stoker?",1897,""],["Em que ano foi publicado Frankenstein?",1818,""],["Quantos ossos tem o corpo de um adulto?",206,"ossos"],
["Quantos dentes tem um adulto, contando os sisos?",32,"dentes"],["Em que ano Cabral chegou ao Brasil?",1500,""],["Qual a altura do Monte Everest?",8849,"metros"],
["Qual a distância média da Terra até a Lua?",384400,"km"],["Quantos minutos tem um dia?",1440,"minutos"],["Qual a altura do Cristo Redentor contando o pedestal?",38,"metros"],
["Em que ano o Brasil declarou a independência?",1822,""],["Quantas casas tem um tabuleiro de xadrez?",64,"casas"],["Quantos segundos tem uma hora?",3600,"segundos"],
["Em que ano o homem pisou na Lua pela primeira vez?",1969,""],["Quantos países fazem fronteira com o Brasil?",10,"países"],["Quantas cartas tem um baralho sem os coringas?",52,"cartas"],
["Quantas teclas tem um piano padrão?",88,"teclas"],
["Em que ano estreou o filme O Exorcista?",1973,""],["Em que ano estreou Psicose, de Hitchcock?",1960,""],["Em que ano saiu o primeiro Halloween, de John Carpenter?",1978,""],
["Quantos litros de sangue tem um adulto, em média?",5,"litros"],["Qual a temperatura normal do corpo humano?",36.5,"°C"],["Em que ano o Titanic afundou?",1912,""],
["Em que ano começou a Segunda Guerra Mundial?",1939,""],["Quantos estados tem o Brasil, sem contar o DF?",26,"estados"],["Quantos quilômetros tem uma maratona?",42.195,"km"],
["Em que ano Goiânia foi fundada?",1933,""],["Quantas vértebras tem a coluna humana?",33,"vértebras"],["Qual a profundidade da Fossa das Marianas?",10994,"metros"],
["Com quantos anos morreu Edgar Allan Poe?",40,"anos"],["Em que ano saiu a versão completa do Minecraft?",2011,""],["Qual a altura da Torre Eiffel?",330,"metros"],
["A que temperatura a água congela, em Fahrenheit?",32,"°F"],["Em que ano Brasília foi inaugurada?",1960,""],["Quantas pernas tem uma lacraia-doméstica adulta?",30,"pernas"],
["Quantos anos durou a Guerra dos Cem Anos?",116,"anos"],["Em quantos dias a Terra dá uma volta no Sol?",365,"dias"],["Quantos músculos tem o corpo humano, aproximadamente?",600,"músculos"],
["Quantos ossos tem o crânio humano adulto?",22,"ossos"],["Qual a circunferência da Terra na linha do Equador?",40075,"km"],["Em que ano foi lançado o primeiro iPhone?",2007,""],
["Em que ano a linguagem C# foi apresentada?",2000,""],["Em que ano o JavaScript foi criado?",1995,""],["Quantos países tem a América do Sul?",12,"países"],
["Qual a distância média da Terra ao Sol, em milhões de km?",150,"milhões de km"],["Qual a velocidade do som no ar?",1235,"km/h"],["Em que ano Stephen King publicou Carrie?",1974,""],
["Quantas horas tem uma semana?",168,"horas"],["Quantas pernas têm 3 aranhas juntas?",24,"pernas"],["Qual a altura do Pão de Açúcar?",396,"metros"],
["Quantos dentes tem um cachorro adulto?",42,"dentes"],["Qual o comprimento aproximado do Rio Amazonas?",6400,"km"]
];
const WORDS=[["VAMPIRO","Criatura"],["LOBISOMEM","Criatura"],["CAVEIRA","Ossos"],["FANTASMA","Assombração"],["CEMITERIO","Lugar"],["CAIXAO","Objeto"],["ASSOMBRACAO","Assombração"],
["BRUXA","Criatura"],["MALDICAO","Magia"],["CURUPIRA","Folclore"],["BOITATA","Folclore"],["TUMULO","Lugar"],["VELORIO","Ritual"],["ZUMBI","Criatura"],["ESQUELETO","Ossos"],
["PESADELO","Sonho"],["GRIMORIO","Livro"],["ESPANTALHO","Criatura"],["MUMIA","Criatura"],["MORCEGO","Animal"],["SOMBRA","Escuridão"],["CRUCIFIXO","Objeto"],["EXORCISMO","Ritual"],
["POSSESSAO","Ritual"],["NECROTERIO","Lugar"],["ARANHA","Animal"],["CORVO","Animal"],["ABOBORA","Halloween"],["CATACUMBA","Lugar"],["SANGUE","Corpo"],["LAPIDE","Cemitério"],
["MACHADO","Arma"],["PORAO","Lugar"],["SUSSURRO","Som"],["NEBLINA","Clima"],["SACRIFICIO","Ritual"],["CORRENTE","Objeto"],["MANICOMIO","Lugar"],["RELIQUIA","Objeto"],
["LANTERNA","Objeto"],["CALAFRIO","Sensação"],["GARGULA","Criatura"],["DEMONIO","Criatura"],["ESPIRITO","Assombração"],["CORUJA","Animal"],["VENENO","Morte"],["FEITICO","Magia"],
["CALDEIRAO","Bruxaria"],["VASSOURA","Bruxaria"],["POCAO","Bruxaria"],["SANATORIO","Lugar"],["CRIPTA","Lugar"],["MASMORRA","Lugar"],["CASTELO","Lugar"],["ESCURIDAO","Noite"],
["UIVO","Som"],["GRITO","Som"],["RANGIDO","Som"],["TROVAO","Clima"],["GUILHOTINA","Execução"],["COVEIRO","Profissão"],["AGOURO","Presságio"],["RITUAL","Magia"],["AMULETO","Proteção"],
["ESTACA","Arma"],["PENTAGRAMA","Símbolo"],["SACI","Folclore"],["MAPINGUARI","Folclore"],["CUCA","Folclore"],["LAMPIAO","Objeto"],["TENEBROSO","Adjetivo"],["ARREPIO","Sensação"],["FUNERAL","Ritual"],
["ALMA","Espírito"],["TREVAS","Escuridão"],["MORTALHA","Tecido"],["CARPIDEIRA","Velório"],["BADALADA","Sino"],["CAMPANARIO","Igreja"],["SEPULTURA","Cemitério"],["OSSUARIO","Ossos"],
["ENFORCADO","Forca"],["CADAVER","Corpo"],["AUTOPSIA","Legista"],["LEGISTA","Profissão"],["SONAMBULO","Sono"],["ALUCINACAO","Mente"],["PARANORMAL","Fenômeno"],["MEDIUM","Vidente"],
["VIDENTE","Profecia"],["TARO","Cartas"],["VODU","Boneco"],["INCENSO","Ritual"],["ESPELHO","Reflexo"],["RELOGIO","Meia-noite"],["BONECA","Brinquedo"],["PALHACO","Circo"],["SERINGA","Hospital"],["BISTURI","Cirurgia"],["NEVOA","Clima"]];
const LIB_EVENTS=["o Incêndio da Capela","a Peste do Vilarejo","o Eclipse de Sangue","o Sumiço do Coveiro","o Primeiro Sacrifício","a Enchente das Covas","o Sino que Tocou Sozinho","a Noite sem Lua","a Queda do Campanário","o Retorno da Freira","a Praga dos Corvos","o Pacto do Prefeito"];
const LIB_TITLES=["Crônicas de Vale Negro","Diário do Padre Anselmo","Registro do Coveiro","Livro das Cinzas","Almanaque Proibido","Cartas da Viúva","Anais do Mosteiro","O Caderno Rasgado","Sermões do Abade","Livro de Óbitos","Memórias do Farol"];

/* ============================================================
   UTILITÁRIOS
   ============================================================ */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clean=(s,n=16)=>String(s??"").replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁠-⁯﻿]/g,"").trim().slice(0,n);
const rnd=n=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%n};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const fmt=n=>Number(n||0).toLocaleString("pt-BR");
const norm=s=>String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toUpperCase().replace(/[^A-Z0-9]/g,"");
const parseNum=s=>{const t=String(s||"").replace(/\s/g,"").replace(/\.(?=\d{3}(\D|$))/g,"").replace(",",".");const n=parseFloat(t);return Number.isFinite(n)?n:null};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const store={get(k,d){try{const v=localStorage.getItem("rodada-maldita:"+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem("rodada-maldita:"+k,JSON.stringify(v))}catch(e){}}};
function toast(t){const d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2300)}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const SOUL_SVG='<svg viewBox="0 0 20 24" aria-hidden="true"><path d="M10 1C7 6 3 9 3 14a7 7 0 0014 0c0-3-2-5-3-7-1 2-2 3-3 3 1-3 0-6-1-9z" fill="#BFE3EC" stroke="#030203" stroke-width="2" stroke-linejoin="round"/><circle cx="8" cy="15" r="1.3" fill="#030203"/><circle cx="12" cy="15" r="1.3" fill="#030203"/></svg>';
const soul=(n,sign)=>`<span class="soul">${SOUL_SVG}${sign&&n>0?"+":""}${fmt(n)}</span>`;

/* ============================================================
   SOM (sintetizado)
   ============================================================ */
let actx=null,soundOn=store.get("sound",true),noiseBuf=null,drone=null,master=null,volume=store.get("vol",1);
function outNode(a){if(!master){master=a.createGain();master.gain.value=volume;master.connect(a.destination)}return master}
function setVolume(v){volume=v;store.set("vol",v);if(master&&actx)master.gain.setTargetAtTime(v,actx.currentTime,.05)}
function audio(){if(!soundOn)return null;try{if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();if(actx.state==="suspended")actx.resume();return actx}catch(e){return null}}
let MUTE_FX=false;
function tone(f,d=.1,type="triangle",v=.15,w=0,slide=0){if(MUTE_FX)return;const a=audio();if(!a)return;const t=a.currentTime+w,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(outNode(a));o.start(t);o.stop(t+d+.02)}
function noise(d=.2,v=.3,f0=3000,f1=500,type="bandpass",w=0,q=1.2){if(MUTE_FX)return;const a=audio();if(!a)return;if(!noiseBuf){noiseBuf=a.createBuffer(1,a.sampleRate,a.sampleRate);const ch=noiseBuf.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1}
  const t=a.currentTime+w,s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain();s.buffer=noiseBuf;fl.type=type;fl.Q.value=q;fl.frequency.setValueAtTime(f0,t);fl.frequency.exponentialRampToValueAtTime(Math.max(40,f1),t+d);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl).connect(g).connect(outNode(a));s.start(t);s.stop(t+d+.02)}
const sfx={
  tap:()=>tone(520,.05,"triangle",.08),
  slash:()=>{noise(.16,.5,5200,900,"bandpass",0,.9);tone(1400,.12,"sawtooth",.05,0,300)},
  stab:()=>{noise(.12,.45,900,120,"lowpass");tone(90,.18,"sine",.35,0,50)},
  splat:()=>{noise(.25,.35,700,90,"lowpass");tone(70,.25,"sine",.25,.02,40)},
  ok:()=>{tone(523,.12,"triangle",.14);tone(784,.2,"triangle",.14,.09)},
  bad:()=>{tone(180,.35,"sawtooth",.1,0,70);noise(.2,.15,400,100,"lowpass")},
  bell:()=>{tone(196,2.2,"sine",.22);tone(392,1.6,"sine",.1);tone(588,1.1,"sine",.05)},
  heart:()=>{tone(62,.13,"sine",.5);tone(55,.16,"sine",.4,.18)},
  go:()=>{noise(.08,.4,3000,3000,"highpass");tone(880,.2,"square",.08)},
  end:()=>{tone(110,.6,"sawtooth",.1,0,55)},
  creak:()=>{tone(210,.7,"sawtooth",.05,0,340);noise(.6,.06,1200,600)},
  whisper:()=>noise(.9,.12,2600,1800,"bandpass",0,4),
  win:()=>{[262,311,392,523].forEach((f,i)=>tone(f,.5,"triangle",.12,i*.16));tone(131,1.6,"sine",.2,.1)},
  candle:i=>tone([294,349,440,523][i],.32,"triangle",.14),
  scream:()=>{tone(900,.5,"sawtooth",.06,0,1600);noise(.5,.12,3000,1500,"bandpass",0,2)}
};
function setDrone(on){
  const a=audio();
  if(!on||!a){if(drone){try{drone.g.gain.setTargetAtTime(0,actx.currentTime,.4);const d=drone;setTimeout(()=>{try{d.o.forEach(o=>o.stop())}catch(e){}},1500)}catch(e){}drone=null}return}
  if(drone)return;
  const g=a.createGain();g.gain.value=0;g.connect(outNode(a));
  const f=a.createBiquadFilter();f.type="lowpass";f.frequency.value=420;f.connect(g);
  const o=[55,55.6,82.4].map((fr,i)=>{const x=a.createOscillator();x.type=i===2?"triangle":"sawtooth";x.frequency.value=fr;const xg=a.createGain();xg.gain.value=i===2?.25:.18;x.connect(xg).connect(f);x.start();return x});
  const lfo=a.createOscillator(),lg=a.createGain();lfo.frequency.value=.07;lg.gain.value=180;lfo.connect(lg).connect(f.frequency);lfo.start();o.push(lfo);
  g.gain.setTargetAtTime(.05,a.currentTime,1.5);drone={g,o};
}

/* ============================================================
   EFEITOS: sangue, corte, flash
   ============================================================ */
const FX={parts:[],running:false};
function fxLoop(){
  const c=$("#fx");if(!c)return;const x=c.getContext("2d"),dpr=Math.min(2,devicePixelRatio||1);
  if(c.width!==Math.round(innerWidth*dpr)){c.width=Math.round(innerWidth*dpr);c.height=Math.round(innerHeight*dpr)}
  x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,innerWidth,innerHeight);
  const dt=1/60;
  FX.parts.forEach(p=>{p.t+=dt;if(p.k==="drop"){p.vy+=900*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.y>p.floor){p.y=p.floor;p.vx=0;p.vy=0;p.k="stain"}}
    else if(p.k==="drip"){p.len=Math.min(p.max,p.len+p.sp*dt)}});
  FX.parts=FX.parts.filter(p=>p.t<p.life);
  for(const p of FX.parts){const a=Math.max(0,1-Math.max(0,p.t-p.life*.6)/(p.life*.4));x.globalAlpha=a;x.fillStyle=p.c;
    if(p.k==="drip"){x.fillRect(p.x-p.w/2,p.y,p.w,p.len);x.beginPath();x.arc(p.x,p.y+p.len,p.w*.9,0,7);x.fill()}
    else{x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()}}
  x.globalAlpha=1;
  if(FX.parts.length)requestAnimationFrame(fxLoop);else FX.running=false;
}
function blood(x,y,power=1){if(MUTE_FX)return;
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  x=x??innerWidth/2;y=y??innerHeight/2;const cols=["#8E0A1F","#B3122B","#C8102E","#6D0716"];
  for(let i=0;i<Math.round(26*power);i++){const a=Math.random()*Math.PI*2,s=(120+Math.random()*420)*power;FX.parts.push({k:"drop",x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-200,r:2+Math.random()*6*power,c:cols[i%4],t:0,life:2.6,floor:y+60+Math.random()*innerHeight*.35})}
  for(let i=0;i<Math.round(5*power);i++)FX.parts.push({k:"drop",x:x+(Math.random()-.5)*30,y:y+(Math.random()-.5)*30,vx:0,vy:0,r:10+Math.random()*16*power,c:cols[i%4],t:0,life:2.2,floor:-1e9});
  if(!FX.running){FX.running=true;requestAnimationFrame(fxLoop)}
}
function drips(n=10){if(MUTE_FX)return;
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  for(let i=0;i<n;i++)FX.parts.push({k:"drip",x:Math.random()*innerWidth,y:0,w:4+Math.random()*9,len:0,max:60+Math.random()*innerHeight*.45,sp:60+Math.random()*160,c:["#8E0A1F","#B3122B","#6D0716"][i%3],t:0,life:3.2});
  if(!FX.running){FX.running=true;requestAnimationFrame(fxLoop)}
}
const buzz=ms=>{try{if(soundOn&&matchMedia("(pointer:coarse)").matches)navigator.vibrate?.(ms)}catch(e){}};
function hurt(power=1,x,y){if(MUTE_FX)return;buzz(Math.round(40+power*50));const f=document.createElement("div");f.className="flash";document.body.appendChild(f);setTimeout(()=>f.remove(),600);blood(x,y,power);sfx.stab()}
function slashFx(){if(MUTE_FX)return;buzz(18);const s=document.createElement("div");s.className="slash";s.style.top=(30+Math.random()*40)+"%";document.body.appendChild(s);setTimeout(()=>s.remove(),400);sfx.slash()}

/* ============================================================
   ÍCONES (traço, 24x24, currentColor)
   ============================================================ */
const ICONS={
  quiz:'<circle cx="12" cy="12" r="9"/><path d="M9.3 9.3a2.8 2.8 0 015.4.9c0 1.9-2.7 2.3-2.7 4.3"/><path d="M12 17.6h.01"/>',
  conta:'<path d="M8.2 15.8l7.6-7.6"/><circle cx="6.2" cy="15.3" r="2.1"/><circle cx="8.7" cy="17.8" r="2.1"/><circle cx="15.3" cy="6.2" r="2.1"/><circle cx="17.8" cy="8.7" r="2.1"/>',
  anag:'<path d="M3 19l4.2-12L11.4 19M4.6 15h5.2"/><path d="M14 8.5h7l-2.2-2.2M21 15.5h-7l2.2 2.2"/>',
  est:'<circle cx="12" cy="10" r="6.8"/><path d="M7.5 20.5h9M8.6 16.2L7.6 20.5M15.4 16.2l1 4.3"/><path d="M9.2 8.2a3.2 3.2 0 012.8-1.7"/>',
  ref:'<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M12 2.5v1.5M5.5 4.5l1 1.3M18.5 4.5l-1 1.3"/>',
  tap:'<path d="M12 20.5S3.5 15.3 3.5 9.3A4.4 4.4 0 0112 7a4.4 4.4 0 018.5 2.3c0 6-8.5 11.2-8.5 11.2z"/><path d="M7 12h2.3l1.2-2.2 2 4.2 1.2-2h3.2"/>',
  seq:'<path d="M6.5 21v-8.5h3.4V21M14.1 21V9.5h3.4V21M4 21h16"/><path d="M8.2 10.2c-1.3-1-1.3-2.3 0-4 1.3 1.7 1.3 3 0 4zM15.8 7.2c-1.3-1-1.3-2.3 0-4 1.3 1.7 1.3 3 0 4z"/>',
  mira:'<circle cx="12" cy="12" r="7.2"/><circle cx="12" cy="12" r="1.6"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  corrida:'<path d="M10 21V11a4.2 4.2 0 018.4 0v10z"/><path d="M14.2 12.3v4.4M12 14.4h4.4M7.5 21H21"/><path d="M2.5 11h4.2M3.5 14.5h3.3M2.5 18h4.2"/>',
  flap:'<path d="M12 9.2l-1.4-2.4-.6 2.6C7.4 7.5 4.2 7.6 2 9.6c2.2.1 3.3 1.2 3.7 3.2 1.1-1.1 2.6-1.1 3.6 0 .7-1 1.6-1.4 2.7-1.4s2 .4 2.7 1.4c1-1.1 2.5-1.1 3.6 0 .4-2 1.5-3.1 3.7-3.2-2.2-2-5.4-2.1-8-.2l-.6-2.6z"/>',
  meteoro:'<path d="M5 21V11a7 7 0 0114 0v10l-2.4-2-2.3 2-2.3-2-2.3 2-2.3-2z"/><path d="M9.5 11v.6M14.5 11v.6"/>',
  luz:'<rect x="7.5" y="2.5" width="9" height="19" rx="4.5"/><circle cx="12" cy="7.3" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="12" cy="16.7" r="1.9"/>',
  chao:'<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M3 12h18M12 3v18"/><path d="M14.5 14.5l1.8 1.6-1 2 2 2.9"/>',
  coroa:'<path d="M3 8l4.3 4.2L12 5l4.7 7.2L21 8l-2 11H5z"/><path d="M5 19h14"/>',
  naoolhe:'<path d="M3 12s3.4-6 9-6c1.9 0 3.5.6 4.9 1.5M21 12s-3.4 6-9 6c-1.9 0-3.5-.6-4.9-1.5"/><path d="M9.6 14.2a3 3 0 014.2-4.3"/><path d="M4 20L20 4"/>',
  cabo:'<path d="M2 12h7M15 12h7"/><circle cx="12" cy="12" r="3"/><path d="M5 8.5L2 12l3 3.5M19 8.5l3 3.5-3 3.5"/>',
  porta:'<path d="M6 21V9.5a6 6 0 0112 0V21"/><path d="M3.5 21h17"/><path d="M14.5 13.5v1"/>',
  circulo:'<circle cx="12" cy="12" r="8.5" stroke-dasharray="2.4 2.6"/><circle cx="12" cy="12" r="2.6"/>',
  altar:'<path d="M3 21h18M5 21v-7.5h14V21M3 13.5h18"/><path d="M12 3.5c-1.8 1.6-1.8 3.4 0 5 1.8-1.6 1.8-3.4 0-5zM12 8.5v2"/>',
  vitral:'<path d="M5 21V10a7 7 0 0114 0v11z"/><path d="M12 3v18M5 13.5h14M8.4 5.8L12 13.5l3.6-7.7"/>',
  biblio:'<path d="M4 19V5.2A2.2 2.2 0 016.2 3H20v16H6.2A2.2 2.2 0 004 21.2"/><path d="M4 19.5V21M8.5 7.5h7M8.5 11h5"/>',
  covas:'<path d="M3 21h18M6 21c0-2 2.7-3 6-3s6 1 6 3"/><path d="M9 18v-6.5a1 1 0 012 0V10a1 1 0 012 0v1a1 1 0 012 0v6"/><path d="M11 10V7.5a1 1 0 012 0V10"/>',
  pacto:'<path d="M12 2.8l2.5 7.4h7.8l-6.3 4.6 2.4 7.4L12 17.6l-6.4 4.6L8 14.8 1.7 10.2h7.8z"/>',
  suss:'<path d="M4 5h16v10H9.5L4 19.5z"/><path d="M8.5 10h.01M12 10h.01M15.5 10h.01"/>',
  cacada:'<path d="M6.5 3.5c1.2 5.5.8 11.5-2.5 17M11.5 3c1.2 6 .8 12-2.5 18M16.5 3.5c1.2 5.5.8 11.5-2.5 17"/><path d="M19 8.5l2-1"/>',
  reliquia:'<path d="M7 3h10l-1 5.8a4 4 0 01-8 0z"/><path d="M12 12.8v5.2M8 21h8M9.5 18h5"/>',
  users:'<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M15.5 5.2a3.5 3.5 0 010 6.6M18 14.2a6.5 6.5 0 013.5 5.8"/>',
  skull:'<path d="M12 3a8 8 0 00-5 14.2V20h10v-2.8A8 8 0 0012 3z"/><circle cx="9" cy="11.5" r="1.6"/><circle cx="15" cy="11.5" r="1.6"/><path d="M10.5 20v-2M13.5 20v-2"/>',
  map:'<path d="M9 4L3 6.5v13L9 17l6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13M15 6.5v13"/>',
  brain:'<path d="M9 4.5a3 3 0 00-3 3 3 3 0 00-2 5.3A3 3 0 007 18a3 3 0 005 1.5V5.5A3 3 0 009 4.5zM15 4.5a3 3 0 013 3 3 3 0 012 5.3A3 3 0 0117 18a3 3 0 01-5 1.5"/>',
  bolt:'<path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12z"/>',
  play:'<path d="M7 4.5v15l12-7.5z"/>',
  flame:'<path d="M12 21.5a6.5 6.5 0 01-6.5-6.5c0-4.2 3.5-6 4-10.5 3 2 4.5 4.3 4.5 7 1-.5 1.8-1.5 2-2.8 1.6 1.7 2.5 3.8 2.5 6.3a6.5 6.5 0 01-6.5 6.5z"/>'
};
const icon=(k,cls="ico")=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]||ICONS.skull}</svg>`;

/* ============================================================
   AVATAR
   código "f c e a m": rosto, cor, olhos, acessório, marca
   ============================================================ */
const AV={
  f:["Caveira","Fantasma","Abóbora","Demônio","Boneca","Porcelana","Bico da peste","Zumbi","Lobisomem","Vampiro"],
  c:["#EDE3D1","#C8102E","#7FAF6A","#8A6BB0","#7FB7C9","#E8772E","#F2C14E","#5B4B52"],
  e:["Vazios","Brilhantes","Costurados","Um olho só","Espiral","Fenda de fera"],
  a:["Nada","Capuz","Chifres","Auréola quebrada","Cartola","Faca cravada","Laço","Coroa","Chapéu de bruxa"],
  m:["Limpo","Sangue escorrendo","Cicatriz","Boca costurada","Pontos na testa"]
};
const AV_KEYS=["f","c","e","a","m"];
const avParse=s=>{const d=String(s||"00000").padEnd(5,"0").slice(0,5).split("").map(n=>+n||0);return {f:d[0]%10,c:d[1]%8,e:d[2]%6,a:d[3]%9,m:d[4]%5}};
const avCode=o=>AV_KEYS.map(k=>o[k]).join("");
const avRandom=()=>AV_KEYS.map(k=>rnd(AV[k].length)).join("");
const hexRGB=h=>{h=h.replace("#","");if(h.length===3)h=h.split("").map(x=>x+x).join("");const n=parseInt(h,16);return [n>>16&255,n>>8&255,n&255]};
const mixHex=(h,t,a)=>{const A=hexRGB(h),B=hexRGB(t);return `rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*a)).join(",")})`};
function shadeFill(c,fill,r){if(typeof fill!=="string"||fill[0]!=="#")return fill;
  const g=c.createRadialGradient(-r*.38,-r*.5,r*.05,0,0,r*1.35);g.addColorStop(0,mixHex(fill,"#FFFFFF",.3));g.addColorStop(.45,fill);g.addColorStop(1,mixHex(fill,"#000000",.5));return g}
function drawAvatar(c,code,x,y,r){
  const o=avParse(code),col=AV.c[o.c],INKC="#030203",lw=Math.max(1.6,r*.09);
  c.save();c.translate(x,y);c.lineJoin="round";c.lineCap="round";
  const st=(fill)=>{c.fillStyle=shadeFill(c,fill,r);c.fill();c.lineWidth=lw;c.strokeStyle=INKC;c.stroke()};
  // acessório atrás
  if(o.a===1){c.beginPath();c.moveTo(-r*1.15,r*1.05);c.quadraticCurveTo(-r*1.3,-r*1.35,0,-r*1.3);c.quadraticCurveTo(r*1.3,-r*1.35,r*1.15,r*1.05);c.closePath();st("#2E2129")}
  // rosto
  const face=o.f;
  c.beginPath();
  if(face===0){c.arc(0,-r*.12,r*.92,Math.PI*.85,Math.PI*2.15);c.lineTo(r*.5,r*.62);c.quadraticCurveTo(r*.45,r*.95,0,r*.95);c.quadraticCurveTo(-r*.45,r*.95,-r*.5,r*.62);c.closePath();st(col)}
  else if(face===1){c.moveTo(-r*.85,r*.95);c.lineTo(-r*.85,-r*.05);c.arc(0,-r*.05,r*.85,Math.PI,0);c.lineTo(r*.85,r*.95);for(let i=0;i<4;i++){const x0=r*.85-i*r*.425;c.quadraticCurveTo(x0-r*.21,r*.6,x0-r*.425,r*.95)}c.closePath();st(col)}
  else if(face===2){c.ellipse(0,r*.08,r*1.02,r*.84,0,0,7);st(o.c===0?"#E8772E":col);c.beginPath();c.moveTo(-r*.35,-r*.66);c.quadraticCurveTo(-r*.45,r*.08,-r*.35,r*.86);c.moveTo(r*.35,-r*.66);c.quadraticCurveTo(r*.45,r*.08,r*.35,r*.86);c.lineWidth=lw*.8;c.strokeStyle="rgba(3,2,3,.45)";c.stroke();c.beginPath();c.rect(-r*.1,-r*1.02,r*.2,r*.3);st("#4E7A3E")}
  else if(face===3){c.moveTo(0,r*1.02);c.quadraticCurveTo(-r*.85,r*.55,-r*.88,-r*.1);c.arc(0,-r*.1,r*.88,Math.PI,0);c.quadraticCurveTo(r*.85,r*.55,0,r*1.02);st(o.c===0?"#C8102E":col)}
  else if(face===4){c.arc(0,0,r*.9,0,7);st(col);c.beginPath();c.arc(0,-r*.1,r*.92,Math.PI*1.05,Math.PI*1.95);c.lineTo(r*.55,-r*.45);c.lineTo(r*.25,-r*.35);c.lineTo(0,-r*.48);c.lineTo(-r*.28,-r*.35);c.lineTo(-r*.55,-r*.45);c.closePath();st("#3D2B35");c.beginPath();c.arc(-r*.5,r*.3,r*.14,0,7);c.arc(r*.5,r*.3,r*.14,0,7);c.fillStyle="rgba(227,38,63,.45)";c.fill()}
  else if(face===5){c.ellipse(0,r*.02,r*.78,r*.98,0,0,7);st(o.c===7?"#EDE3D1":col);c.beginPath();c.moveTo(r*.2,-r*.9);c.lineTo(r*.05,-r*.5);c.lineTo(r*.22,-r*.3);c.lineTo(r*.02,r*.05);c.lineWidth=lw*.7;c.strokeStyle=INKC;c.stroke()}
  else if(face===6){c.arc(0,-r*.05,r*.85,0,7);st(o.c===0?"#2E2129":col);c.beginPath();c.moveTo(-r*.25,r*.1);c.quadraticCurveTo(r*.1,r*1.35,r*.32,r*1.25);c.quadraticCurveTo(r*.3,r*.5,r*.25,r*.1);c.closePath();st("#EDE3D1")}
  else if(face===8){[-1,1].forEach(s=>{c.beginPath();c.moveTo(s*r*.25,-r*.75);c.lineTo(s*r*.78,-r*1.28);c.lineTo(s*r*.86,-r*.35);c.closePath();st(o.c===0?"#6E5C52":col)});
    c.beginPath();c.ellipse(0,-r*.02,r*.9,r*.84,0,0,7);st(o.c===0?"#7D6A5E":col);c.beginPath();c.ellipse(0,r*.45,r*.42,r*.34,0,0,7);st(o.c===0?"#B8A58E":"#EDE3D1")}
  else if(face===9){c.ellipse(0,r*.04,r*.8,r*.96,0,0,7);st(o.c===0?"#DCD6E4":col);c.beginPath();c.moveTo(-r*.82,-r*.1);c.quadraticCurveTo(-r*.9,-r*1.05,0,-r*.98);c.quadraticCurveTo(r*.9,-r*1.05,r*.82,-r*.1);c.quadraticCurveTo(r*.55,-r*.62,r*.2,-r*.6);c.lineTo(0,-r*.3);c.lineTo(-r*.2,-r*.6);c.quadraticCurveTo(-r*.55,-r*.62,-r*.82,-r*.1);c.closePath();st("#1A1014")}
  else{c.moveTo(-r*.8,-r*.2);c.lineTo(-r*.6,-r*.85);c.lineTo(r*.2,-r*.95);c.lineTo(r*.85,-r*.5);c.lineTo(r*.9,r*.4);c.lineTo(r*.4,r*.95);c.lineTo(-r*.5,r*.9);c.lineTo(-r*.9,r*.4);c.closePath();st(o.c===0?"#7FAF6A":col);c.beginPath();c.rect(r*.3,-r*.55,r*.35,r*.3);st("rgba(3,2,3,.25)")}
  // brilho do rosto
  c.save();c.globalAlpha=.16;c.fillStyle="#fff";c.beginPath();c.ellipse(-r*.34,-r*.46,r*.26,r*.14,-.6,0,7);c.fill();c.restore();
  // olhos
  const ey=face===6?-r*.25:-r*.12,ex=r*.36,er=r*(face===1?.2:.22);
  const socket=(x,y2)=>{c.beginPath();if(face===2){c.moveTo(x-er,y2+er*.8);c.lineTo(x,y2-er);c.lineTo(x+er,y2+er*.8);c.closePath()}else c.ellipse(x,y2,er,er*1.15,0,0,7)};
  if(face===6){[-1,1].forEach(s=>{c.beginPath();c.arc(s*ex,ey,er*1.25,0,7);st("#7FB7C9")})}
  if(o.e===3){c.beginPath();c.arc(0,ey,er*1.5,0,7);st("#fff");c.beginPath();c.arc(0,ey,er*.7,0,7);c.fillStyle=INKC;c.fill()}
  else [-1,1].forEach(s=>{const X=s*ex;
    if(o.e===0){socket(X,ey);c.fillStyle=INKC;c.fill()}
    else if(o.e===1){socket(X,ey);c.fillStyle=INKC;c.fill();c.save();c.beginPath();c.arc(X,ey,er*.45,0,7);c.fillStyle=face===2?"#F2C14E":"#E3263F";c.shadowColor=c.fillStyle;c.shadowBlur=r*.35;c.fill();c.restore()}
    else if(o.e===2){c.beginPath();c.moveTo(X-er,ey-er);c.lineTo(X+er,ey+er);c.moveTo(X+er,ey-er);c.lineTo(X-er,ey+er);c.lineWidth=lw*1.1;c.strokeStyle=INKC;c.stroke()}
    else if(o.e===5){c.beginPath();c.ellipse(X,ey,er*1.05,er*.8,s*.18,0,7);c.fillStyle="#F2C14E";c.fill();c.lineWidth=lw*.8;c.strokeStyle=INKC;c.stroke();c.beginPath();c.ellipse(X,ey,er*.18,er*.7,0,0,7);c.fillStyle=INKC;c.fill()}
    else{socket(X,ey);st("#fff");c.beginPath();for(let t=0;t<9;t+=.3){const rr=er*.08*t;c.lineTo(X+Math.cos(t*2)*rr,ey+Math.sin(t*2)*rr)}c.lineWidth=lw*.6;c.strokeStyle=INKC;c.stroke()}});
  // boca
  c.lineWidth=lw;c.strokeStyle=INKC;c.fillStyle=INKC;
  if(face===0){c.beginPath();c.moveTo(0,r*.18);c.lineTo(-r*.09,r*.36);c.lineTo(r*.09,r*.36);c.closePath();c.fill();for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(i*r*.14,r*.56);c.lineTo(i*r*.14,r*.8);c.stroke()}}
  else if(face===1){c.beginPath();c.ellipse(0,r*.38,r*.16,r*.22,0,0,7);c.fill()}
  else if(face===2){c.beginPath();c.moveTo(-r*.55,r*.3);for(let i=0;i<=6;i++)c.lineTo(-r*.55+i*r*.183,r*.3+(i%2?r*.2:0));c.lineTo(r*.45,r*.55);c.lineTo(-r*.45,r*.55);c.closePath();c.fillStyle=o.e===1?"#F2C14E":INKC;c.fill();c.stroke()}
  else if(face===3){c.beginPath();c.moveTo(-r*.4,r*.4);c.quadraticCurveTo(0,r*.62,r*.4,r*.4);c.stroke();c.beginPath();c.moveTo(-r*.22,r*.47);c.lineTo(-r*.15,r*.64);c.lineTo(-r*.09,r*.5);c.moveTo(r*.22,r*.47);c.lineTo(r*.15,r*.64);c.lineTo(r*.09,r*.5);c.fillStyle="#fff";c.fill();c.stroke();
    c.beginPath();c.moveTo(-r*.6,-r*.42);c.lineTo(-r*.15,-r*.3);c.moveTo(r*.6,-r*.42);c.lineTo(r*.15,-r*.3);c.stroke()}
  else if(face===4||face===5){c.beginPath();c.moveTo(-r*.28,r*.45);c.quadraticCurveTo(0,r*.58,r*.28,r*.45);c.stroke()}
  else if(face===8){c.beginPath();c.moveTo(-r*.12,r*.3);c.lineTo(r*.12,r*.3);c.lineTo(0,r*.44);c.closePath();c.fillStyle=INKC;c.fill();c.beginPath();c.moveTo(-r*.28,r*.58);c.quadraticCurveTo(0,r*.72,r*.28,r*.58);c.stroke();
    [-1,1].forEach(s=>{c.beginPath();c.moveTo(s*r*.2,r*.6);c.lineTo(s*r*.14,r*.8);c.lineTo(s*r*.08,r*.63);c.closePath();c.fillStyle="#fff";c.fill();c.lineWidth=lw*.6;c.stroke();c.lineWidth=lw})}
  else if(face===9){c.beginPath();c.moveTo(-r*.3,r*.45);c.quadraticCurveTo(0,r*.56,r*.3,r*.45);c.stroke();[-1,1].forEach(s=>{c.beginPath();c.moveTo(s*r*.2,r*.48);c.lineTo(s*r*.15,r*.7);c.lineTo(s*r*.1,r*.5);c.closePath();c.fillStyle="#fff";c.fill();c.lineWidth=lw*.6;c.stroke();c.lineWidth=lw});
    c.beginPath();c.arc(r*.15,r*.78,r*.05,0,7);c.fillStyle="#C8102E";c.fill()}
  else if(face===7){c.beginPath();c.moveTo(-r*.4,r*.45);c.lineTo(-r*.1,r*.38);c.lineTo(r*.15,r*.5);c.lineTo(r*.4,r*.4);c.stroke()}
  // marcas
  if(o.m===1){c.fillStyle="#C8102E";[-1,1].forEach((s,i)=>{const X=o.e===3?(i?r*.1:-r*.1):s*ex;c.beginPath();c.moveTo(X-r*.06,ey+er);c.lineTo(X+r*.06,ey+er);c.lineTo(X+r*.05,ey+er+r*(.45+i*.15));c.arc(X,ey+er+r*(.45+i*.15),r*.07,0,Math.PI);c.closePath();c.fill()})}
  if(o.m===2){c.beginPath();c.moveTo(-r*.7,-r*.55);c.lineTo(r*.1,r*.15);c.lineWidth=lw*.9;c.strokeStyle="#6D0716";c.stroke();for(let i=0;i<4;i++){const t=i/3,X=-r*.7+t*r*.8,Y=-r*.55+t*r*.7;c.beginPath();c.moveTo(X-r*.08,Y+r*.08);c.lineTo(X+r*.08,Y-r*.08);c.stroke()}}
  if(o.m===4){c.beginPath();c.moveTo(-r*.5,-r*.52);c.quadraticCurveTo(0,-r*.62,r*.5,-r*.5);c.lineWidth=lw*.8;c.strokeStyle=INKC;c.stroke();for(let i=-3;i<=3;i++){const X=i*r*.14,Y=-r*.56-Math.cos(i/3)*r*.04+r*.02;c.beginPath();c.moveTo(X,Y-r*.08);c.lineTo(X,Y+r*.08);c.stroke()}}
  if(o.m===3){c.beginPath();c.moveTo(-r*.35,r*.48);c.lineTo(r*.35,r*.48);c.lineWidth=lw;c.strokeStyle=INKC;c.stroke();for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(i*r*.14,r*.38);c.lineTo(i*r*.14,r*.58);c.stroke()}}
  // acessórios na frente
  if(o.a===2){[-1,1].forEach(s=>{c.beginPath();c.moveTo(s*r*.35,-r*.72);c.quadraticCurveTo(s*r*.9,-r*1.05,s*r*.75,-r*1.45);c.quadraticCurveTo(s*r*.55,-r*1.05,s*r*.12,-r*.85);c.closePath();st("#EDE3D1")})}
  if(o.a===3){c.beginPath();c.ellipse(0,-r*1.2,r*.62,r*.18,0,.3,Math.PI*1.75);c.lineWidth=lw*1.6;c.strokeStyle="#F2C14E";c.stroke();c.lineWidth=lw*.5;c.strokeStyle=INKC;c.stroke()}
  if(o.a===4){c.beginPath();c.rect(-r*.5,-r*1.55,r,r*.7);st("#1A1014");c.beginPath();c.rect(-r*.5,-r*1.02,r,r*.16);st("#C8102E");c.beginPath();c.rect(-r*.85,-r*.9,r*1.7,r*.14);st("#1A1014")}
  if(o.a===5){c.save();c.rotate(-.5);c.beginPath();c.rect(-r*.08,-r*1.55,r*.16,r*.65);st("#D9DDE3");c.beginPath();c.rect(-r*.14,-r*.95,r*.28,r*.14);st("#1A1014");c.restore();c.beginPath();c.arc(r*.34,-r*.62,r*.09,0,7);c.fillStyle="#C8102E";c.fill()}
  if(o.a===6){c.beginPath();c.moveTo(r*.3,-r*.78);c.lineTo(r*.02,-r*1.05);c.lineTo(r*.04,-r*.62);c.closePath();st("#C8102E");c.beginPath();c.moveTo(r*.3,-r*.78);c.lineTo(r*.62,-r*1.05);c.lineTo(r*.6,-r*.58);c.closePath();st("#C8102E");c.beginPath();c.arc(r*.31,-r*.8,r*.1,0,7);st("#8E0A1F")}
  if(o.a===7){c.beginPath();c.moveTo(-r*.55,-r*.78);c.lineTo(-r*.6,-r*1.3);c.lineTo(-r*.3,-r*1.05);c.lineTo(0,-r*1.42);c.lineTo(r*.3,-r*1.05);c.lineTo(r*.6,-r*1.3);c.lineTo(r*.55,-r*.78);c.closePath();st("#F2C14E");[-r*.3,0,r*.3].forEach(x=>{c.beginPath();c.arc(x,-r*.92,r*.07,0,7);c.fillStyle="#C8102E";c.fill()})}
  if(o.a===8){c.beginPath();c.ellipse(0,-r*.78,r*1.15,r*.22,0,0,7);st("#1A1014");c.beginPath();c.moveTo(-r*.62,-r*.82);c.quadraticCurveTo(-r*.2,-r*1.35,r*.15,-r*2.05);c.quadraticCurveTo(r*.28,-r*1.7,r*.38,-r*1.55);c.quadraticCurveTo(r*.5,-r*1.1,r*.62,-r*.82);c.closePath();st("#241820");c.beginPath();c.rect(-r*.58,-r*1.0,r*1.16,r*.16);st("#8A6BB0")}
  c.restore();
}
const avCache=new Map();
function avURL(code,px=64){const k=code+"@"+px;if(avCache.has(k))return avCache.get(k);const cv=document.createElement("canvas");cv.width=px*2;cv.height=px*2;const c=cv.getContext("2d");drawAvatar(c,code,px,px*1.08,px*.62);const u=cv.toDataURL();avCache.set(k,u);return u}
const avImg=(code,size=28)=>`<img class="avimg" src="${avURL(code||"00000",Math.max(32,size))}" width="${size}" height="${size}" alt="">`;
