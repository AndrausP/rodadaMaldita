// Monta src/maldita.body.html a partir das partes. Uso: node maldita-src/montar.js && npm run build
const fs=require("fs"),path=require("path");const d=__dirname;
const js=["m2_core.js","m5_arcade.js","m3_host.js","m4_arena.js","m6_ui.js"].map(f=>fs.readFileSync(path.join(d,f),"utf8")).join("");
const out=fs.readFileSync(path.join(d,"m1_head.html"),"utf8")+"<script>\n"+js+"</script>\n";
new Function(js);fs.writeFileSync(path.join(d,"..","src","maldita.body.html"),out);console.log("ok",out.length);
