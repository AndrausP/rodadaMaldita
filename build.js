// Monta /public a partir dos arquivos-fonte (src/*.body.html).
// Os fontes são o conteúdo das páginas sem <html>/<head>; aqui ganham o esqueleto completo.
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "src");
const OUT = path.join(__dirname, "public");
const RESET = "html{-webkit-text-size-adjust:100%}";

const pages = [
  { src: "index.body.html", out: "index.html" },
  { src: "rodada.body.html", out: "rodada.html" },
  { src: "poker.body.html", out: "poker.html", head: '<script src="room-shim.js"></script>' },
  { src: "gincana.body.html", out: "gincana.html", head: '<script src="room-shim.js"></script>' },
  { src: "maldita.body.html", out: "maldita.html", head: '<script src="room-shim.js"></script>' },
];

for (const p of pages) {
  const body = fs.readFileSync(path.join(SRC, p.src), "utf8");
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<style>${RESET}</style>
${p.head || ""}
</head>
<body>
${body}
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, p.out), html);
  console.log("ok", p.out);
}
