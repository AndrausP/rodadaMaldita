// Rodada — "room" local
  window.__RODADA_LOCAL = true;
// Reproduz a API de salas que as páginas usam (claude.use("room")) sobre o WebSocket do server.js.
// Só é ativado quando a página NÃO está dentro do Claude.
(function () {
  if (window.claude && typeof window.claude.use === "function") return;

  const LOBBY = "_lobby";
  const myId = Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => (b % 36).toString(36)).join("") + Date.now().toString(36).slice(-6);
  let ws = null, connected = false, backoff = 500, everConnected = false;
  const connHandlers = new Set();
  const rooms = new Map(); // name -> RoomCore
  let reqSeq = 0;
  const pendingJoins = new Map();
  const KEYS = new WeakMap();

  function send(obj) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj)); }

  function setConnected(v) {
    if (v === connected) return;
    connected = v;
    for (const h of connHandlers) queueMicrotask(() => h(v));
  }

  function connect() {
    const url = (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/ws";
    try { ws = new WebSocket(url); } catch (e) { return retry(); }
    ws.onopen = () => { backoff = 500; send({ t: "hello", peer: myId }); };
    ws.onmessage = (ev) => {
      let m; try { m = JSON.parse(ev.data); } catch { return; }
      if (m.t === "hello") {
        everConnected = true;
        setConnected(true);
        for (const r of rooms.values()) { send({ t: "join", room: r.name }); if (Object.keys(r.mine).length) send({ t: "presence", room: r.name, patch: r.mine }); }
      } else if (m.t === "joined") {
        const p = pendingJoins.get(m.req); if (p) { pendingJoins.delete(m.req); p.resolve(); }
      } else if (m.t === "state") {
        rooms.get(m.room)?.apply(m.peers);
      } else if (m.t === "error") {
        const p = pendingJoins.get(m.req); if (p) { pendingJoins.delete(m.req); p.reject({ code: m.code, message: m.code }); }
      }
    };
    ws.onclose = () => { setConnected(false); retry(); };
    ws.onerror = () => {};
  }
  function retry() { setTimeout(connect, backoff); backoff = Math.min(backoff * 2, 8000); }

  function RoomCore(name) {
    const self = {
      name, mine: {}, list: Object.freeze([]), byPeer: new Map(), handlers: new Set(), delivered: false,
      apply(raw) {
        const prev = self.byPeer, next = new Map(), joined = [], updated = [], left = [];
        for (const r of raw) {
          const key = JSON.stringify(r.presence || {});
          const old = prev.get(r.peer);
          let obj;
          if (old && KEYS.get(old) === key) obj = old;
          else {
            obj = Object.freeze({
              peer: r.peer, by: null, isMe: r.peer === myId, sameTab: r.peer === myId, kind: "viewer", guest: false,
              presence: Object.freeze(JSON.parse(key)), updatedAt: Date.now(),
            });
            KEYS.set(obj, key);
            if (old) updated.push(obj); else joined.push(obj);
          }
          next.set(r.peer, obj);
        }
        for (const [id, o] of prev) if (!next.has(id)) left.push(o);
        self.byPeer = next;
        self.list = Object.freeze([...next.values()]);
        if (!joined.length && !updated.length && !left.length) return;
        const change = { peers: self.list, joined: Object.freeze(joined), updated: Object.freeze(updated), left: Object.freeze(left) };
        for (const h of self.handlers) queueMicrotask(() => h(change));
      },
      api() {
        return Object.freeze({
          name,
          presence(patch) {
            if (!patch || typeof patch !== "object") return Promise.reject({ code: "invalid_argument", message: "patch" });
            for (const [k, v] of Object.entries(patch)) { if (v === null) delete self.mine[k]; else self.mine[k] = v; }
            if (JSON.stringify(self.mine).length > 4096) return Promise.reject({ code: "invalid_argument", message: "presence acima de 4 KiB" });
            send({ t: "presence", room: name, patch });
            // reflete na hora pra quem está nesta aba
            const raw = [...self.byPeer.values()].map((p) => ({ peer: p.peer, presence: p.peer === myId ? { ...self.mine } : p.presence }));
            if (!self.byPeer.has(myId)) raw.push({ peer: myId, presence: { ...self.mine } });
            self.apply(raw);
            return Promise.resolve();
          },
          peers() { return self.list; },
          onPeers(handler) {
            if (typeof handler !== "function") throw new TypeError("handler");
            self.handlers.add(handler);
            queueMicrotask(() => { if (self.handlers.has(handler) && self.list.length) handler({ peers: self.list, joined: self.list, updated: Object.freeze([]), left: Object.freeze([]) }); });
            return () => self.handlers.delete(handler);
          },
          emit() { return Promise.reject({ code: "not_permitted", message: "eventos não existem na versão local" }); },
          on() { return () => {}; },
          connected() { return connected; },
          onConnection(handler) { connHandlers.add(handler); queueMicrotask(() => handler(connected)); return () => connHandlers.delete(handler); },
          leave() {
            if (name === LOBBY) return Promise.resolve();
            rooms.delete(name); self.handlers.clear(); send({ t: "leave", room: name });
            return Promise.resolve();
          },
        });
      },
    };
    return self;
  }

  function joinRoom(name) {
    if (rooms.has(name)) return Promise.resolve(rooms.get(name).api());
    const core = RoomCore(name);
    rooms.set(name, core);
    const api = core.api();
    const req = ++reqSeq;
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => { pendingJoins.delete(req); if (connected) reject({ code: "upstream_error", message: "sem resposta" }); else resolve(api); }, 10000);
      pendingJoins.set(req, { resolve: () => { clearTimeout(t); resolve(api); }, reject: (e) => { clearTimeout(t); rooms.delete(name); reject(e); } });
      send({ t: "join", room: name, req });
    });
  }

  let lobbyApi = null;
  async function getRoom() {
    if (lobbyApi) return lobbyApi;
    if (!ws) connect();
    // espera a primeira conexão (até 5 s); sem servidor, a página segue no modo offline
    const ok = await new Promise((res) => {
      if (connected) return res(true);
      const h = (c) => { if (c) { connHandlers.delete(h); res(true); } };
      connHandlers.add(h);
      setTimeout(() => { connHandlers.delete(h); res(connected); }, 5000);
    });
    if (!ok) return null;
    const lobby = await joinRoom(LOBBY);
    lobbyApi = Object.freeze({
      ...lobby,
      join(name) {
        if (typeof name !== "string" || !/^[a-z0-9][a-z0-9_.-]{0,47}$/.test(name)) return Promise.reject({ code: "invalid_argument", message: "nome" });
        return joinRoom(name);
      },
      sendToClaudeSession() { return Promise.reject({ code: "claude_unavailable", message: "local" }); },
      canSendToClaudeSession() { return Promise.resolve("off"); },
    });
    return lobbyApi;
  }

  window.claude = Object.freeze({
    use(name) { return name === "room" ? getRoom() : Promise.resolve(null); },
  });
})();
