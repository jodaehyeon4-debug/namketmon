// ===== v2.71 멈춤 방지 · 상대 남켓몬이 안 보이던 것 =====
// 사용자(2026-11-14): "게임할 때 상대 남켓몬이 보이지 않는 버그 있는듯 해. 그리고 이따금 게임이 멈추기도 하는데, 개선방안 마련하고 실행해."
// 재현으로 확인한 원인
//   ① 배틀 그림(battle/*.png)은 배틀이 시작될 때 처음 내려받는다. 와이파이가 느리면 그림이 오기 전에 배틀이 진행되어 상대가 안 보였다
//   ② 그 내려받기가 실패하면 '깨진 그림'을 그리려다 오류 → 게임 루프가 다음 프레임을 예약하지 못해 화면이 그대로 굳었다
//   ③ 들은 음악을 모두 풀어 둔 채 쌓았다(v2.66~69에서 곡이 길어지고 늘어 최대 1.1GB) → 오래 하면 태블릿 메모리가 바닥
//   ④ 짧은 곡(레벨 업·획득)·배틀 진행이 '끝나지 않는 기다림'에 걸릴 수 있는 곳이 있었다
// 고침(이 파일 + js/core.js): 루프·그리기·불러오기를 튼튼하게(core.js) / 여기서는
//   가) 오류 기록(NKSafe) — 오류가 나도 게임은 계속, 기록은 타이틀 메뉴 '오류 기록'에서 볼 수 있음
//   나) 배틀 그림: 배틀에 들어가기 전에 미리 받고, 나오기 직전에 잠깐 기다리고, 그래도 안 왔으면 작은 그림(아이콘)으로 대신 보여 줌
//       · 구역에 들어서면 그 풀숲에 사는 남켓몬 그림을 미리 받아 둠
//   다) 배틀이 오류로 끊기거나 10초 넘게 아무 진행이 없으면 배틀을 정리하고 들판으로 돌려보냄(남켓몬·가방은 그대로)
//   라) 들판에서 진행이 잠긴 채 8초 넘게 아무 일도 없으면 잠금을 풂
// 실제 포켓몬처럼 묘사(게임이 굳지 않고 끝까지 이어짐 — 구조만) · 맨 마지막(main.js 바로 앞)에 읽힘
"use strict";
(function safeV271() {
  // ---------------------------------------------------------------- 가) 오류 기록
  const LOG = []; const KEY = "nk_errlog"; let total = 0;
  try { const o = JSON.parse(localStorage.getItem(KEY) || "[]"); if (Array.isArray(o)) for (const e of o.slice(-20)) LOG.push(e); } catch (e) {}
  const state = () => { try { const t = Scenes.top(); return { v: (typeof VERSION === "string" ? VERSION.replace(/^[^v]*/, "") : ""), map: typeof G !== "undefined" ? G.map : "", x: World.player ? World.player.x : -1, y: World.player ? World.player.y : -1,
    top: t ? (t.kind || (t.constructor && t.constructor.name) || "?") : "-", bt: typeof BT !== "undefined" && BT ? (BT.wild ? "wild" : "trainer") : "" }; } catch (e) { return {}; } };
  function report(where, e) {
    total++;
    const msg = String(e && e.message || e || "?").slice(0, 160), st = String(e && e.stack || "").split("\n").slice(1, 4).map(s => s.trim().replace(/https?:\/\/[^/]+\//g, "")).join(" | ").slice(0, 300);
    where = String(where).slice(0, 40);
    const hit = LOG.slice(-8).find(x => x.w === where && x.m === msg);
    if (hit) { hit.n = (hit.n || 1) + 1; if (hit.n > 3 && hit.n % 600) return; }                      // 매 프레임 같은 오류: 한 줄로 세기만
    else { LOG.push({ t: new Date().toISOString().slice(0, 19), w: where, m: msg, s: st, g: state(), n: 1 }); if (LOG.length > 20) LOG.shift(); try { console.error("[남켓몬]", where, msg); } catch (x) {} }
    try { localStorage.setItem(KEY, JSON.stringify(LOG)); } catch (x) {}
  }
  window.addEventListener("error", ev => { if (ev && (ev.error || ev.message)) report("error", ev.error || ev.message); });
  window.addEventListener("unhandledrejection", ev => { report("promise", ev && ev.reason); });
  async function showLog() {
    if (!LOG.length) { await say("기록된 오류가 없어요."); return; }
    await say(`오류 기록 ${LOG.length}건.\f최근 것부터 다섯 건을 보여 줘요.\n화면을 찍어 두면 고칠 때 도움이 돼요.`);
    for (const e of LOG.slice(-5).reverse()) {
      const g0 = e.g || {};
      await say(`${e.t.slice(5, 16).replace("T", " ")} ${g0.v || ""}\n${e.w}${e.n > 1 ? " ×" + e.n : ""}\f${e.m.slice(0, 44)}\n${e.m.slice(44, 88)}\f곳: ${g0.map || "?"} (${g0.x},${g0.y})\n화면: ${g0.top || "?"} ${g0.bt || ""}`);
    }
    if (await yes("기록을 지울까요?")) { LOG.length = 0; try { localStorage.removeItem(KEY); } catch (e) {} await say("지웠어요."); }
  }
  window.NKSafe = { report, log: LOG, count: () => LOG.length, total: () => total, showLog, clear() { LOG.length = 0; try { localStorage.removeItem(KEY); } catch (e) {} } };

  // ---------------------------------------------------------------- 나) 배틀 그림
  const sheetFor = m => { try { return sheetOf(m.k, m.shiny); } catch (e) { return null; } };
  // 미리 받기: 한꺼번에 몰리지 않게 줄을 세워 둘씩
  const Q = []; let going = 0;
  function pump() { while (going < 2 && Q.length) { const k = Q.shift(); if (!MON[k]) continue; const im = battleSheet(k); if (imgOk(im) || im.nkBad) continue;
      going++; const done = () => { im.removeEventListener("load", done); clearTimeout(tm); going = Math.max(0, going - 1); pump(); }; const tm = setTimeout(done, 8000); im.addEventListener("load", done); } }
  function warm(keys, first) { for (const k of keys) { if (!k || !MON[k] || Q.includes(k)) continue; const im = lazyImg[k]; if (im && imgOk(im)) { lazyUse[k] = ++lazyClock; continue; } if (first) Q.unshift(k); else Q.push(k); } pump(); }
  const warmParty = () => warm(G.party.filter(m => m && m.hp > 0).slice(0, 3).map(m => m.k), true);
  function warmZone() { try { const zi = World.zoneInfo(); const ks = []; if (zi && zi.enc) for (const e of encTable(zi.enc)) if (!ks.includes(e.k)) ks.push(e.k); warm(ks.slice(0, 12)); warmParty(); } catch (e) {} }
  let wzT = 0;
  const cz0 = World.checkZone;
  if (typeof cz0 === "function") World.checkZone = function (...a) { const z0 = this.zone, r = cz0.apply(this, a); if (this.zone !== z0) { clearTimeout(wzT); wzT = setTimeout(warmZone, 600); } return r; };

  // 한가할 때 배틀 그림 162장(모두 9.7MB)을 브라우저 저장소(캐시)에 한 장씩 천천히 받아 둠 — 그림으로 풀지는 않으므로 메모리는 안 씀.
  //   한 번 받아 두면 그 뒤로는 와이파이가 느려도 그림이 바로 뜬다. 들판에 들어서고 20초 뒤부터, 배틀·대화 중에는 쉼
  const BG = { i: 0, done: 0, fail: 0, on: false };
  function bgCache(delay = 20000) {
    if (BG.on || typeof fetch !== "function") return; BG.on = true;
    try { if (navigator.connection && navigator.connection.saveData) return; } catch (e) {}
    const ks = Object.keys(MON).sort((a, b) => (MON[a].no || 999) - (MON[b].no || 999));
    const step = async () => {
      if (BG.i >= ks.length) return;
      if (document.hidden || (typeof BT !== "undefined" && BT) || Scenes.top() !== World || World.busy) { setTimeout(step, 2500); return; }
      const k = ks[BG.i++];
      if (!(lazyImg[k] && imgOk(lazyImg[k]))) { try { const r = await fetch("battle/" + k + ".png"); if (r.ok) { await r.arrayBuffer(); BG.done++; } else BG.fail++; } catch (e) { BG.fail++; } }
      setTimeout(step, BG.fail > 6 ? 15000 : 350);
    };
    setTimeout(step, delay);
  }
  { const iv = setInterval(() => { try { if (!window.NK_BOT && Scenes.has(World) && World.player) { clearInterval(iv); bgCache(); } } catch (e) {} }, 3000); }

  // 배틀에 들어가는 순간(전환 연출 전에) 상대와 내 첫 남켓몬 그림부터 받기 시작
  const sw0 = startWild; startWild = function (k, lv, bg) { warm([k], true); warmParty(); return sw0(k, lv, bg); };
  const ts0 = trainerSpotted; trainerSpotted = function (a) { try { const T = a && (a.trainer || a); if (T && T.team) warm(T.team.map(t => t[0]).slice(0, 6), true); warmParty(); } catch (e) {} return ts0(a); };
  const tb0 = trainerBattle; trainerBattle = function (a, sp) { try { const T = a && a.trainer; if (T && T.team) warm(T.team.map(t => t[0]).slice(0, 6), true); warmParty(); } catch (e) {} return tb0(a, sp); };

  // 첫 화면이 열리기 전(화면이 아직 까맣다): 상대 첫 남켓몬과 내 첫 남켓몬 그림을 2.5초까지 기다림
  const intro0 = Battle.prototype.intro;
  Battle.prototype.intro = async function () {
    try { const lead = G.party.find(m => m.hp > 0), ims = [this.foe[0], lead].filter(Boolean).map(sheetFor).filter(Boolean);
      for (const m of [...this.foe, ...G.party]) if (m) sheetFor(m);                           // 나머지도 받기 시작
      await Promise.all(ims.map(im => sheetReady(im, 2500))); } catch (e) { report("preload", e); }
    return intro0.call(this);
  };
  // 볼에서 나오기 직전: 아직 안 왔으면 2초까지 기다림(교체·다음 남켓몬)
  const pop0 = Battle.prototype.popOut;
  Battle.prototype.popOut = async function (s) { try { await sheetReady(this.spr[s].im, 2000); } catch (e) {} return pop0.call(this, s); };

  // 그래도 그림이 없으면(아주 느리거나 끝내 실패): 안 보이는 대신 작은 그림(아이콘)을 크게 보여 줌. 진짜 그림이 오면 바로 바뀜
  const bd0 = BSprite.prototype.draw;
  BSprite.prototype.draw = function () {
    if (this.vis && this.key && !imgOk(this.im)) {
      if (this.blink > 0 && (this.blink >> 2) & 1) return;
      const w = BT && BT.w && BT.w[this.side]; if (w && w.vol && w.vol.inv && w.m && w.m.hp > 0 && BT.spr && BT.spr[this.side] === this) return;
      const i = MON[this.key] ? MON[this.key].no - 1 : -1; if (i < 0 || !IMG.icons) return;
      const P = POS[this.side].mon, s = this.scale, sz = Math.round(64 * s), cut = this.sink > 0 ? Math.max(0, 1 - this.sink / 64) : 1; if (cut <= 0) return;
      const x = Math.round(P[0] + 48 + this.dx - sz / 2), y = Math.round(P[1] + 78 + this.dy - sz + (this.sink > 0 ? this.sink : 0));
      g.drawImage(IMG.icons, (i % 16) * 32, Math.floor(i / 16) * 32, 32, 32 * cut, x, y, sz, Math.round(sz * cut));
      if (this.white > 0) { g.globalAlpha = this.white * 0.8; g.fillStyle = "#fff"; g.beginPath(); g.ellipse(x + sz / 2, y + sz / 2, sz / 2, sz / 2, 0, 0, 7); g.fill(); g.globalAlpha = 1; }
      return;
    }
    return bd0.call(this);
  };
  // 스프라이트: 새 남켓몬으로 바뀔 때 흔들림·뜸·깜빡임도 처음으로 / 앞선 동작을 기다리던 쪽이 영영 기다리지 않게
  const set0 = BSprite.prototype.set;
  BSprite.prototype.set = function (k, sh) { set0.call(this, k, sh); this.dx = 0; this.dy = 0; this.blink = 0; if (this.once) { const r = this.once; this.once = null; r(); } };
  const play0 = BSprite.prototype.play;
  BSprite.prototype.play = function (kind) { if (this.once) { const r = this.once; this.once = null; r(); } if (!ROWS[(this.side === "E" ? "f_" : "b_") + kind]) return Promise.resolve(); return play0.call(this, kind); };

  // ---------------------------------------------------------------- 다) 배틀이 끊기거나 멈추면 정리하고 돌아감
  async function recover(b, why) {
    report("battle:" + why, new Error("배틀을 정리하고 들판으로 돌아감"));
    try { FX.clear(); } catch (e) {}
    try { const i = Scenes.st.indexOf(b); if (i >= 0) for (const x of Scenes.st.splice(i + 1)) { try { x.leave && x.leave(); } catch (e) {} } } catch (e) {}
    try { for (const m of [...G.party, ...(b.foe || [])]) { if (m && m.abT) { m.ab = m.abT; delete m.abT; } b.untf(m); } for (const [m, it] of b.restore || []) m.item = it; } catch (e) {}
    b.alarm = false; b.dead = true; Screen.flash = 0; Screen.fade = 0;
    try { if (Scenes.has(b)) await say("앗, 배틀 도중에 문제가 생겼어요.\f배틀을 끝내고 돌아갈게요.\n남켓몬과 가방은 그대로예요."); } catch (e) {}
    try { await fadeOut(14); } catch (e) { Screen.fade = 1; }
    try { Scenes.pop(b); } catch (e) {} if (BT === b) BT = null; try { FX.clear(); } catch (e) {}
    for (const m of G.party) { m.slp = m.status === "slp" ? m.slp : 0; }
    return "run";
  }
  const bsay0 = Battle.prototype.say;
  Battle.prototype.say = function (t, o) { if (this.dead) return new Promise(() => {}); return bsay0.call(this, t, o); };   // 정리된 배틀의 남은 흐름이 뒤늦게 깨어나도 아무것도 띄우지 않음
  Battle.prototype.start = async function () {
    BT = this; FX.clear(); Scenes.push(this);
    let r;
    try { r = await Promise.race([this.main(), new Promise(res => { this.nkAbort = res; })]); }
    catch (e) { report("battle", e); r = "nk_abort"; this.nkWhy = "error"; }
    if (r === "nk_abort") r = await recover(this, this.nkWhy || "stuck");
    return r;
  };

  // ---------------------------------------------------------------- 라) 지켜보기: 진행이 영영 멈춘 상태를 알아채고 풂
  let idleW = 0, idleB = 0, lastFrame = -1;
  setInterval(() => {
    try {
      if (document.hidden) { idleW = idleB = 0; return; }
      if (typeof FRAME !== "number" || FRAME === lastFrame) { lastFrame = FRAME; return; }          // 루프가 안 도는 동안은 세지 않음
      lastFrame = FRAME;
      const top = Scenes.top(), net = Audio2.mem ? Audio2.mem().pend > 0 : false, quiet = timers.length === 0 && !net;
      if (typeof World !== "undefined" && World.player) {
        if (World.busy < 0) World.busy = 0;
        if (top === World && World.busy > 0 && quiet && !World.player.moving) idleW++; else idleW = 0;
        if (idleW >= 8) { idleW = 0; report("stuck:world", new Error("진행 잠금이 풀리지 않아 풀어 줌 (busy " + World.busy + ")")); World.busy = 0; Screen.fade = 0; Screen.flash = 0; }
      }
      if (BT && top === BT && quiet && !(FX.busy > 0)) idleB++; else idleB = 0;
      if (idleB === 4) for (const s of ["P", "E"]) { const sp = BT.spr[s]; if (sp && sp.once) { const r = sp.once; sp.once = null; sp.row = sp.idleRow(); sp.f = 0; r(); } }
      if (idleB >= 10) { idleB = 0; if (BT.nkAbort) { BT.nkWhy = "stuck"; BT.nkAbort("nk_abort"); } }
    } catch (e) {}
  }, 1000);
  // ---------------------------------------------------------------- 마) 키보드가 안 먹을 때: 게임 창이 선택되어 있지 않으면 알려 줌
  // 게임 바깥(주소창·다른 창·페이지의 다른 곳)을 누르면 키 입력이 게임으로 오지 않아 '멈춘 것처럼' 보인다 → 화면 아래에 한 줄로 알림
  let tip = null;
  try { tip = document.createElement("div"); tip.id = "nkfocus"; tip.textContent = "키가 안 먹으면 게임 화면을 한 번 눌러 주세요"; tip.hidden = true;
    tip.style.cssText = "position:absolute;left:50%;bottom:12px;transform:translateX(-50%);background:rgba(16,16,28,.9);color:#fff4d8;font:600 13px var(--font-ui);padding:6px 12px;border-radius:8px;pointer-events:none;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.5);z-index:5";
    const host = document.getElementById("scr"); if (host) host.appendChild(tip);
    const upd = () => { tip.hidden = !(!document.hasFocus() && !document.hidden && !document.body.classList.contains("touch")); };
    addEventListener("blur", () => setTimeout(upd, 400)); addEventListener("focus", upd); setInterval(upd, 1500);
    document.addEventListener("pointerdown", () => { try { window.focus(); } catch (e) {} setTimeout(upd, 50); }, true);
  } catch (e) {}
  window.SAFE_V271 = { tip, bg: BG, bgCache, warm, warmZone, queue: Q, recover, idle: () => [idleW, idleB] };
})();
