# Rodada

Jogos de festa, gincana e a Rodada Maldita pra rodar na sua máquina. O poker e o truco ficam na pasta **`cartas/`**, servidos pelo mesmo servidor em `/cartas/` (ou sozinhos, rodando `npm start` dentro de `cartas/`, porta 3100).

- **Jogos de festa** (`rodada.html`): Impostor, Correria e Cartas na Mesa. Feito pra celular, o aparelho passa de mão em mão.
- **Rodada Maldita** (`maldita.html`): versão de terror da gincana. 26 provações, sistema de almas, avatar personalizável, prêmios no fim do ritual, recordes pessoais, sangue e sons de corte. Inclui jogos de mapa ao vivo com joystick no celular (Caçada, Rouba-Coroa, Roubo da Relíquia, Não Olhe, Chão Falso, Último no Círculo, Altar dos Quatro Selos, Luz Vermelha Invertida), Cabo de Guerra Caótico, Porta ou Morte, A Biblioteca que Mente, Sussurros, Pacto Sombrio e Vitral das Almas. Dá pra treinar sozinho contra bots (Fácil, Normal ou Pesadelo) e conduzir no modo telão, numa TV, sem jogar.
- **Gincana** (`gincana.html`): 11 provas ao vivo (quiz, conta, palavra embaralhada, chute, reflexo, toques, sequência e os minijogos Mira certeira, Corrida, Voo livre e Chuva de meteoros), individual ou em times. Cada um joga do próprio celular ou PC.

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
No seu PC:       http://localhost:3000
Amigos na rede:  https://192.168.0.10:3443   (aceite o aviso de certificado)
```

## Jogando online com amigos (Maldita ou Gincana)

1. Todo mundo precisa estar na mesma rede (mesmo Wi-Fi) que o PC que roda o servidor.
2. Você abre `http://localhost:3000`, escolhe a Maldita ou a Gincana e cria a sala.
3. Seus amigos abrem o endereço `https://SEU-IP:3443`. O navegador vai avisar que o certificado não é confiável. Isso é esperado, porque o certificado é gerado na sua máquina. Clique em "Avançado" e depois em "Continuar".
4. Eles digitam o código de 4 letras ou escolhem a sala na lista de salas abertas.

Por que HTTPS na rede? Alguns recursos do navegador (como a criptografia usada nos jogos) só funcionam em `localhost` ou em HTTPS.

Se o Windows perguntar sobre o firewall na primeira vez, permita o acesso em redes privadas.

### Jogar pela internet (fora de casa)

Use um túnel, como `cloudflared tunnel --url http://localhost:3000` ou `ngrok http 3000`, e mande o link `https://...` gerado pros amigos.

## Como funciona

```
public/          arquivos servidos (gerados pelo build)
  index.html     tela inicial
  rodada.html    jogos de festa
  gincana.html   gincana
  maldita.html   Rodada Maldita
  room-shim.js   implementa as "salas" online no navegador, falando com o server.js
src/             fontes das páginas (conteúdo sem <html>/<head>)
build.js         monta public/ a partir de src/
server.js        servidor HTTP/HTTPS + WebSocket das salas
```

- O servidor só repassa a **presença** de cada pessoa na sala: um objeto JSON de até 4 KiB. Ele não conhece as regras dos jogos.
- Na Gincana, quem cria a sala é quem apresenta: o navegador dele sorteia as provas, guarda as respostas certas, confere o que cada um manda e publica o placar.
- Na Rodada Maldita é igual: quem cria o ritual conduz, e os outros mandam as ações pela própria presença.

Mudou algo em `src/`? Rode `npm run build` pra atualizar `public/`.

A Rodada Maldita tem as fontes separadas em `maldita-src/` (veja o `LEIAME.md` lá). Editou uma parte? Rode `node maldita-src/montar.js && npm run build`.

Variáveis de ambiente: `PORT` (padrão 3000) e `HTTPS_PORT` (padrão 3443).
