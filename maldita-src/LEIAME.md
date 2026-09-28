# Fontes da Rodada Maldita

A página `src/maldita.body.html` é montada a partir destas partes:

- `m1_head.html`: título, fontes e todo o CSS
- `m2_core.js`: conteúdo (perguntas, palavras), utilidades, sons, efeitos de sangue, ícones e avatares
- `m5_arcade.js`: minijogos de canvas (Olhos no Escuro, Fuga do Cemitério, Voo do Morcego, Exorcismo) e o kit visual dos canvas
- `m3_host.js`: provações, geradores de enigmas, motor de quem conduz, pontuação e prêmios
- `m4_arena.js`: mapas ao vivo, habilidades, bots dos mapas e o cliente da arena
- `m6_ui.js`: interface, rede, telas e eventos

Depois de editar: `node maldita-src/montar.js && npm run build`.

`testes/` tem os scripts Playwright usados pra validar (precisam do servidor rodando em localhost:3000).
