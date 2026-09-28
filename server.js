// Rodada — servidor local
// Serve os jogos da pasta /public e faz o papel das "salas" online (presença compartilhada)
// via WebSocket, no mesmo formato que as páginas esperam.
//
//   npm install
//   npm start
//
// HTTP  : http://localhost:3000        (use no seu PC)
// HTTPS : https://SEU-IP:3443          (use pros amigos na mesma rede; aceite o aviso de certificado)

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { WebSocketServer } = require("ws");

const PORT = +process.env.PORT || 3000;
const HTTPS_PORT = +process.env.HTTPS_PORT || 3443;
const PUBLIC = path.join(__dirname, "public");
const CERT_DIR = path.join(__dirname, ".cert");
const GRACE_MS = 8000;            // tempo pra reconectar sem "sair" da sala
const MAX_PRESENCE = 4096;        // bytes de presença por pessoa, por sala
const ROOM_RE = /^[a-z0-9_][a-z0-9_.-]{0,47}$/;

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8",
};

/* ------------------------------------------------------------------ */
/* arquivos estáticos                                                  */
/* ------------------------------------------------------------------ */
function handler(req, res) {
  let url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/") url = "/index.html";
  const file = path.normalize(path.join(PUBLIC, url));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Não encontrado"); return; }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(data);
  });
}

/* ------------------------------------------------------------------ */
/* salas                                                               */
/* ------------------------------------------------------------------ */
// rooms: nome -> Map(peerId -> { presence, updatedAt })
const rooms = new Map();
// peers: peerId -> { ws, rooms:Set, timer }
const peers = new Map();

function roomOf(name) {
  if (!rooms.has(name)) rooms.set(name, new Map());
  return rooms.get(name);
}
function snapshot(name) {
  const r = rooms.get(name);
  if (!r) return [];
  return [...r.entries()].map(([peer, v]) => ({ peer, presence: v.presence, updatedAt: v.updatedAt, online: !!peers.get(peer)?.ws }));
}
function broadcast(name) {
  const r = rooms.get(name);
  if (!r) return;
  const msg = JSON.stringify({ t: "state", room: name, peers: snapshot(name) });
  for (const id of r.keys()) {
    const p = peers.get(id);
    if (p && p.ws && p.ws.readyState === 1) p.ws.send(msg);
  }
}
function leaveRoom(id, name) {
  const r = rooms.get(name);
  if (!r) return;
  r.delete(id);
  peers.get(id)?.rooms.delete(name);
  if (r.size === 0) rooms.delete(name);
  else broadcast(name);
}
function dropPeer(id) {
  const p = peers.get(id);
  if (!p) return;
  for (const name of [...p.rooms]) leaveRoom(id, name);
  peers.delete(id);
}

function attachWs(server) {
  const wss = new WebSocketServer({ server, path: "/ws", maxPayload: 16 * 1024 });
  wss.on("connection", (ws) => {
    let id = null;
    ws.on("message", (raw) => {
      let m;
      try { m = JSON.parse(raw); } catch { return; }
      if (!m || typeof m !== "object") return;

      if (m.t === "hello") {
        const wanted = typeof m.peer === "string" && /^[a-z0-9]{8,24}$/.test(m.peer) ? m.peer : null;
        if (!wanted) return ws.close();
        const existing = peers.get(wanted);
        if (existing && existing.ws && existing.ws !== ws && existing.ws.readyState === 1) {
          // outra aba usando o mesmo id: gera outro
          id = Math.random().toString(36).slice(2, 14);
        } else id = wanted;
        const p = existing && id === wanted ? existing : { ws: null, rooms: new Set(), timer: null };
        clearTimeout(p.timer);
        p.ws = ws;
        peers.set(id, p);
        ws.send(JSON.stringify({ t: "hello", peer: id }));
        for (const name of p.rooms) broadcast(name);
        return;
      }
      if (!id) return;
      const p = peers.get(id);
      if (!p) return;

      if (m.t === "join" && typeof m.room === "string" && ROOM_RE.test(m.room)) {
        if (p.rooms.size >= 17) return ws.send(JSON.stringify({ t: "error", room: m.room, code: "limit_reached" }));
        const r = roomOf(m.room);
        if (!r.has(id)) r.set(id, { presence: {}, updatedAt: Date.now() });
        p.rooms.add(m.room);
        ws.send(JSON.stringify({ t: "joined", room: m.room, req: m.req }));
        broadcast(m.room);
      } else if (m.t === "leave" && typeof m.room === "string") {
        leaveRoom(id, m.room);
      } else if (m.t === "presence" && typeof m.room === "string" && m.patch && typeof m.patch === "object") {
        const r = rooms.get(m.room);
        const me = r && r.get(id);
        if (!me) return;
        const next = { ...me.presence };
        for (const [k, v] of Object.entries(m.patch)) {
          if (k === "__proto__" || k === "constructor" || k === "prototype") continue;
          if (v === null) delete next[k]; else next[k] = v;
        }
        if (Buffer.byteLength(JSON.stringify(next)) > MAX_PRESENCE) {
          return ws.send(JSON.stringify({ t: "error", room: m.room, code: "invalid_argument", req: m.req }));
        }
        me.presence = next;
        me.updatedAt = Date.now();
        broadcast(m.room);
      }
    });
    ws.on("close", () => {
      if (!id) return;
      const p = peers.get(id);
      if (!p || p.ws !== ws) return;
      p.ws = null;
      p.timer = setTimeout(() => dropPeer(id), GRACE_MS);
    });
  });
}

/* ------------------------------------------------------------------ */
/* start                                                               */
/* ------------------------------------------------------------------ */
function lanIps() {
  return Object.values(os.networkInterfaces()).flat().filter((i) => i && i.family === "IPv4" && !i.internal).map((i) => i.address);
}

async function loadCert() {
  try {
    fs.mkdirSync(CERT_DIR, { recursive: true });
    const keyF = path.join(CERT_DIR, "key.pem"), certF = path.join(CERT_DIR, "cert.pem");
    if (fs.existsSync(keyF) && fs.existsSync(certF)) return { key: fs.readFileSync(keyF), cert: fs.readFileSync(certF) };
    const selfsigned = require("selfsigned");
    const altNames = [{ type: 2, value: "localhost" }, ...lanIps().map((ip) => ({ type: 7, ip })), { type: 7, ip: "127.0.0.1" }];
    const pems = await selfsigned.generate([{ name: "commonName", value: "Rodada local" }], { days: 825, keySize: 2048, extensions: [{ name: "subjectAltName", altNames }] });
    fs.writeFileSync(keyF, pems.private);
    fs.writeFileSync(certF, pems.cert);
    return { key: pems.private, cert: pems.cert };
  } catch (e) {
    console.warn("Não consegui gerar o certificado HTTPS:", e.message);
    return null;
  }
}

(async () => {
  const httpServer = http.createServer(handler);
  attachWs(httpServer);
  httpServer.listen(PORT, () => {
    console.log("\n  RODADA rodando!\n");
    console.log(`  No seu PC:       http://localhost:${PORT}`);
  });

  // no Render o HTTPS já vem pronto na frente do app
  if (process.env.RENDER) return;
  const cert = await loadCert();
  if (cert) {
    const httpsServer = https.createServer(cert, handler);
    attachWs(httpsServer);
    httpsServer.listen(HTTPS_PORT, () => {
      for (const ip of lanIps()) console.log(`  Amigos na rede:  https://${ip}:${HTTPS_PORT}   (aceite o aviso de certificado)`);
      console.log("\n  Ctrl+C para parar.\n");
    });
  }
})();
