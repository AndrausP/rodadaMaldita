# Rodada Cartas

Poker e truco online pra rodar na sua máquina, com mesa por código, chat e bots.

- **Truco** (`truco.html`): paulista ou mineiro, de 2, 4 ou 6 jogadores (em duplas ou trios, os times se alternam na mesa). Funciona no celular e no PC.
  - **Paulista**: a vira define a manilha (a carta seguinte), com naipes na ordem paus (zap) › copas › espadas › ouros. A mão vale 1, e o truco sobe para 3, 6, 9 e 12. Mão de onze vale 3.
  - **Mineiro**: manilhas fixas, zap (4♣) › copas (7♥) › espadilha (A♠) › pica-fumo (7♦). A mão vale 2, e o truco sobe para 4, 6, 10 e 12. Mão de dez vale 4.
  - **Baralho vazio** (só família real Q, J, K, mais 2, 3 e as manilhas: 20 cartas no paulista, com a manilha saindo da vira; 24 no mineiro, com as 4 manilhas fixas) ou **cheio** (52 cartas, com 8, 9 e 10 entre o 7 e a dama).
  - **Coringa 3,5** (opcional): entram 2 coringas que ganham do 3 e perdem das manilhas.
  - Mão de onze/dez (quem está nela vê as cartas do parceiro e decide se joga), mão de ferro (os dois times nela: ninguém vê as próprias cartas e não tem truco), carta encoberta a partir da 2ª vaza, empates (cangou/empachou) e partidas até 12 pontos.
  - Atalhos: `1` `2` `3` jogam a carta, `T` pede truco, `E` liga a encoberta, `A` aceita, `M` aumenta, `C` corre, `J` joga a mão de onze.
- **Poker** (`poker.html`): Texas Hold'em No-Limit pra PC, com até 8 lugares.

## Como rodar

Precisa do [Node.js](https://nodejs.org) 18 ou mais novo.

**Windows:** dê dois cliques em `iniciar.bat`.

**Linux/macOS:** `./iniciar.sh`

Ou, no terminal:

```bash
npm install
npm start
```

O terminal mostra dois endereços:

```
No seu PC:       http://localhost:3100
Amigos na rede:  https://192.168.0.10:3543   (aceite o aviso de certificado)
```

As portas são diferentes das do projeto Rodada (3000/3443), então dá pra rodar os dois ao mesmo tempo.

## Jogando online com amigos

1. Todo mundo precisa estar na mesma rede (mesmo Wi-Fi) que o PC que roda o servidor.
2. Você abre `http://localhost:3100`, escolhe o jogo e cria a mesa.
3. Seus amigos abrem `https://SEU-IP:3543`. O navegador vai avisar que o certificado não é confiável, porque ele é gerado na sua máquina. Clique em "Avançado" e depois em "Continuar".
4. Eles digitam o código de 4 letras ou escolhem a mesa na lista de mesas abertas. No truco, antes de começar, dá pra clicar num lugar vago pra escolher o time.

Por que HTTPS na rede? As cartas de cada jogador são criptografadas no navegador (ECDH + AES-GCM), e o navegador só libera essa API em `localhost` ou em HTTPS.

Se o Windows perguntar sobre o firewall na primeira vez, permita o acesso em redes privadas.

Pra jogar pela internet, use um túnel, como `cloudflared tunnel --url http://localhost:3100` ou `ngrok http 3100`, e mande o link `https://...` gerado.

## Como funciona

```
public/          arquivos servidos (gerados pelo build)
  index.html     tela inicial
  poker.html     poker
  truco.html     truco
  room-shim.js   implementa as "salas" online no navegador, falando com o server.js
src/             fontes das páginas (conteúdo sem <html>/<head>)
build.js         monta public/ a partir de src/
server.js        servidor HTTP/HTTPS + WebSocket das salas
```

- O servidor só repassa a **presença** de cada pessoa na sala: um objeto JSON de até 4 KiB. Ele não conhece as regras dos jogos.
- Quem cria a mesa é o **anfitrião**. O navegador dele embaralha, distribui, valida as jogadas, roda os bots e publica o estado da mesa na presença dele. Se o anfitrião fechar a aba, a mesa acaba.
- Cada jogador publica o apelido, a cor, a chave pública e a jogada da vez na própria presença.
- As cartas de cada jogador vão criptografadas com uma chave que só o anfitrião e aquele jogador conseguem derivar. No truco, na mão de onze, o parceiro também recebe as cartas do outro, como manda a regra. O anfitrião conhece o baralho, então jogue com gente de confiança e sem dinheiro.
- Se alguém sai no meio do truco, um bot assume o lugar até a pessoa voltar.

Mudou algo em `src/`? Rode `npm run build` pra atualizar `public/`.

Variáveis de ambiente: `PORT` (padrão 3100) e `HTTPS_PORT` (padrão 3543).
