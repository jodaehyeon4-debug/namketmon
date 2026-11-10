// ===== 시작: 불러오기 → 타이틀 → 새 게임/이어서 =====
"use strict";
const VERSION = "플레이 버전 v2.67";
async function boot(hotData) {
  Save.loadOpt();
  const loading = { opaque: true, p: 0, draw() { rect(0, 0, SW, SH, "#101018"); rect(48, 94, 160, 6, "#2a2a3a"); rect(48, 94, Math.round(160 * this.p), 6, "#d04a3a"); } };
  Scenes.push(loading); fit(); requestAnimationFrame(loop);
  const imgs = [["tiles_out", "img/tiles_out.png"], ["tiles_in", "img/tiles_in.png"], ["chars", "img/chars.png"], ["misc", "img/misc.png"], ["balls", "img/balls.png"],
    ["bus", "img/bus.png"], ["icons", "img/icons.png"], ["items", "img/items.png"], ["townmap", "img/townmap.png"], ["pouch", "img/pouch.png"], ["player", "img/player.png"],
    ["leaders_field", "img/leaders_field.png"], ["badges", "img/badges.png"]];
  for (const b of ["grass_day", "grass_eve", "grass_night", "indoor", "city", "water_day", "water_eve", "water_night", "cave", "nugak"]) imgs.push(["bg_" + b, `img/bg/${b}.png`]);
  for (const b of ["grass", "grass_eve", "grass_night", "indoor", "city", "water", "sand", "water_night", "sand_night", "cave", "nugak"]) for (const s of ["e", "p"]) imgs.push([`base_${b}_${s}`, `img/bg/base_${b}_${s}.png`]);
  for (const t of ["hangyeol", "boreum", "jobaksa", "yunseul", "kid_m", "kid_f", "bugboy", "grunt_m", "grunt_f", "player_m_back", "player_f_back", "player_m_front", "player_f_front", "gl_sinha", "seola", "igeul", "gl_chanhyang", "gl_miyeong", "garam", "ongi", "gl_mrhwang", "gl_suhyeon", "yeoul", "agent", "gl_gisu", "solmoe", "gl_yeosim", "hiker", "gl_heeju", "gl_yeongran", "gl_jobaksa2", "foreign_m", "foreign_f", "doryeong", "nangja", "simmani", "hwagong", "mb_doryeong", "mb_agassi", "nangdokga", "stationmaster", "eosa", "pansori", "traveler", "simmani_girl", "heungbu", "nolbu", "jebi", "nolbu_wife", "byeon", "sori", "haerang", "student"]) imgs.push(["tr_" + t, `img/trainers/${t}.png`]);
  const jsons = [["tiles_out", "img/tiles_out.json"], ["tiles_in", "img/tiles_in.json"], ["chars", "img/chars.json"], ["misc", "img/misc.json"], ["balls", "img/balls.json"], ["items", "img/items.json"], ["player", "img/player.json"],
    ["leaders_field", "img/leaders_field.json"], ["badges", "img/badges.json"]];
  const jobs = [...imgs.map(([n, s]) => loadImg(n, s)), ...jsons.map(([n, s]) => loadJSON(n, s)), Font.load("g11"), Font.load("g9"), Font.load("g7"), Audio2.init()];
  let done = 0; jobs.forEach(p => p.then(() => { done++; loading.p = done / jobs.length; }));
  await Promise.all(jobs);
  tsInit();
  for (const k of STARTERS) battleSheet(k);
  Scenes.pop(loading);
  setInterval(() => { if (Scenes.has(World)) { G.time++; if (G.clock && G.clock.mode === "game") G.clock.min = (G.clock.min + 1) % 1440; } }, 1000);
  if (hotData && hotData.save) { loadData(hotData.save); await enterWorld(); return; }
  if (DEBUG) { await debugStart(); return; }
  if (typeof runIntro === "function") runIntro(); else title();     // v2.38 실제 게임처럼 알림·감사 → 오프닝 → 타이틀
}
async function enterWorld() {
  World.init(); World.load(G.map, G.x, G.y, G.dir); World.cam = World.camTarget();
  Scenes.push(World); Screen.fade = 1;
  await fadeIn(16);
}
// ---- 타이틀 ----
class Title {
  // v2.38: 번갈아 나오던 남켓몬은 치움(사용자) · 인트로에서 넘어오면 하얗게 번쩍 · 가만히 두면 오프닝을 다시(실제 게임처럼)
  constructor() { this.opaque = true; this.t = 0; this.state = "press"; this.flash = 0; this.idle = 0; }
  update(f) {
    this.t++; if (this.flash > 0) this.flash--;
    if (!f || this.state !== "press") { this.idle = 0; return; }
    if (Input.ok() || Input.menuKey() || Input.cancel()) { this.idle = 0; Audio2.unlock(); bgm("title"); sfx("select"); this.state = "menu"; this.go(); return; }
    if (++this.idle > 60 * 40 && typeof Intro === "function") { Scenes.pop(this); Scenes.push(new Intro("kids")); }
  }
  async go() {
    const items = [];
    const has = Save.has(); if (has) items.push("이어서 하기"); items.push("처음부터", "설정");
    while (true) {
      const v = await menu({ items, x: 64, y: 108, w: 128, cancel: true });
      if (v < 0) { this.state = "press"; return; }
      const k = items[v];
      if (k === "설정") { await show(new Options()); continue; }
      if (k === "처음부터" && has && !(await yes("새로 시작하면 지금 리포트는\n다음에 저장할 때 지워집니다. 괜찮나요?"))) continue;
      await fadeOut(20); Scenes.pop(this); Audio2.stop();
      if (k === "이어서 하기") { const d = Save.read(); if (d) { loadData(d); await enterWorld(); return; } }
      await newGameIntro(); return;
    }
  }
  draw() {
    const t = this.t;
    if (typeof bandSky === "function") bandSky([[0, "#1e2a58"], [0.55, "#c86a5a"], [1, "#f0c890"]], SH); else { const sky = g.createLinearGradient(0, 0, 0, SH); sky.addColorStop(0, "#1e2a58"); sky.addColorStop(0.55, "#c86a5a"); sky.addColorStop(1, "#f0c890"); g.fillStyle = sky; g.fillRect(0, 0, SW, SH); }
    // 지리산 능선 실루엣
    for (const [col, base, amp, f] of [["#3a3a6a", 120, 18, 0.03], ["#2a2a4a", 138, 14, 0.05], ["#1a1a30", 156, 10, 0.08]]) {
      g.fillStyle = col; g.beginPath(); g.moveTo(0, SH);
      for (let x = 0; x <= SW; x += 4) g.lineTo(x, base - Math.abs(Math.sin(x * f + base)) * amp - Math.sin(x * f * 2.3) * amp * 0.4);
      g.lineTo(SW, SH); g.fill();
    }
    // 광한루 지붕 실루엣
    g.fillStyle = "#14142a"; g.beginPath(); g.moveTo(20, 150); g.quadraticCurveTo(50, 138, 80, 142); g.lineTo(112, 142); g.quadraticCurveTo(142, 138, 172, 150); g.lineTo(160, 152); g.lineTo(32, 152); g.fill();
    rect(40, 152, 112, 24, "#14142a"); for (let x = 44; x < 150; x += 14) rect(x, 154, 3, 22, "#2a2a48");
    // 반짝이는 별
    for (let i = 0; i < 26; i++) { const x = (i * 97) % SW, y = (i * 53) % 70; if (((t >> 4) + i) % 5) rect(x, y, 1, 1, "#fff8e0"); }
    // 흐르는 구름 · 나는 까치 떼(v2.38)
    for (let i = 0; i < 4; i++) { const x = ((t * (0.15 + i * 0.07) + i * 90) % (SW + 80)) - 60, y = 84 + i * 9; g.globalAlpha = 0.35; g.fillStyle = "#ffe8d8"; g.beginPath(); g.ellipse(x, y, 30 - i * 4, 4, 0, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1; }
    for (let i = 0; i < 6; i++) { const x = ((t * 0.7 + i * 23) % (SW + 60)) - 30, y = 96 + Math.sin(t / 20 + i) * 4 - (i % 3) * 5, w = ((t >> 3) + i) % 2; rect(x, y, 4, 1, "#2a2038"); rect(x - 1 - w, y - 1 + w, 2, 1, "#2a2038"); rect(x + 3 + w, y - 1 + w, 2, 1, "#2a2038"); }
    // 로고
    const s = 3, txt0 = "남켓몬";
    const ox = 128 - (Font.width(txt0) + 4) * s / 2, oy = 16;
    bigText(txt0, ox, oy, s);
    Font.draw(g, "용성지방 이야기", 128, 70, { align: "center", col: "#fff4d8", sh: "#5a2a2a" });
    if (this.state === "press" && ((t >> 5) & 1)) Font.draw(g, "A 버튼(Z)을 누르세요", 128, 160, { align: "center", col: "#ffffff", sh: "#3a2a2a" });
    Font.draw(g, VERSION + " · 덕과초", 4, 1, { font: "g9", col: "#c8c8e8", sh: null });
    Font.draw(g, "비공식 교육용 팬게임 · Thank you, 5th graders!", 128, 180, { align: "center", font: "g9", col: "#e8d8c8", sh: null });
    if (this.flash > 0) { g.globalAlpha = this.flash / 18; rect(0, 0, SW, SH, "#ffffff"); g.globalAlpha = 1; }
  }
}
const bigCache = {};
function bigText(str, x, y, s) {
  let c = bigCache[str + s];
  if (!c) {
    const base = document.createElement("canvas"); const w = Font.width(str) + 4, h = 18; base.width = w * s + 8; base.height = h * s + 8; const bg = base.getContext("2d"); bg.imageSmoothingEnabled = false;
    const t = document.createElement("canvas"); t.width = w; t.height = h; const tg2 = t.getContext("2d");
    const layer = (col) => { tg2.clearRect(0, 0, w, h); const rr = Font.F.g11; let xx = 1; for (const ch of str) { const cp = ch.codePointAt(0); let gl = null;
        for (const run of rr.runs) if (cp >= run[0] && cp < run[0] + run[1]) { gl = [run[2] + cp - run[0], Array.isArray(run[3]) ? run[3][cp - run[0]] : run[3]]; break; }
        if (gl) tg2.drawImage(rr.im, (gl[0] % rr.cols) * rr.cw, Math.floor(gl[0] / rr.cols) * rr.ch, rr.cw, rr.ch, xx, 1, rr.cw, rr.ch); xx += gl ? gl[1] : 6; }
      tg2.globalCompositeOperation = "source-in"; tg2.fillStyle = col; tg2.fillRect(0, 0, w, h); tg2.globalCompositeOperation = "source-over"; return t; };
    const draw = (col, dx, dy) => { const L = layer(col); bg.drawImage(L, 0, 0, w, h, 4 + dx, 4 + dy, w * s, h * s); };
    for (const [dx, dy] of [[-3, 0], [3, 0], [0, -3], [0, 3], [-2, -2], [2, 2], [-2, 2], [2, -2], [4, 4]]) draw("#2a1410", dx, dy);
    draw("#c8402a", 0, 2); draw("#f8d050", 0, 0);
    const hl = layer("#fff8c8"); bg.save(); bg.beginPath(); bg.rect(0, 4, base.width, 5 * s); bg.clip(); bg.drawImage(hl, 0, 0, w, h, 4, 4, w * s, h * s); bg.restore();
    c = bigCache[str + s] = base;
  }
  g.drawImage(c, Math.round(x) - 4, y - 4);
}
function title() { const t = new Title(); Scenes.push(t); Screen.fade = 1; fadeIn(20); }

// ---- 디버그(개발 확인용): ?d 해시 ----
const DEBUG = /^#dbg/.test(location.hash) && /^(localhost|127\.0\.0\.1)$/.test(location.hostname);   // v2.47 배포: 개발 서버에서만(아이들이 주소에 #dbg를 붙여 건너뛰지 않게)
async function debugStart() {
  G.reset(); G.name = "한별"; G.flag("starter", true); G.flag("slept", true); G.flag("runshoes", true); G.flag("dex", true); G.flag("expshare_on", true);
  G.give("potion", 5); G.give("namket", 10); G.give("silk", 3); G.give("ssukhyang", 2); G.give("yeot", 2); G.give("jujube", 3); G.give("townmap"); G.give("expshare"); G.give("runshoes"); if (ITEMS.tm40) G.give("tm40");
  G.starter = "mongjjuk";
  const m = makeMon("mongjjuk", 7, { ot: "한별" }); G.party.push(m); G.catch("mongjjuk");
  G.party.push(makeMon("kkajak", 5, { ot: "한별" })); G.catch("kkajak");
  const h = location.hash.split(":");
  const map = h[1] || "world", x = +(h[2] || 19), y = +(h[3] || 70);
  G.map = map; G.x = x; G.y = y; G.dir = "up";
  Audio2.unlock();
  await enterWorld();
}
// 보는 사람 쪽 화면 갱신 때 진행 상태 유지
if (window.claude && window.claude.hot && window.claude.hot.snapshot) window.claude.hot.snapshot(() => (Scenes.has(World) ? { save: saveData() } : {}));
if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(d => boot(d)); else boot(window.claude && window.claude.hot && window.claude.hot.data || {});
