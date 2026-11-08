// ===== 배틀: 4세대 화면 밀도 + 3세대식 한 화면 명령창. 등장·기술·이펙트·HP·경험치·레벨업·포획·교체·도구·도망 =====
"use strict";
let BT = null;
const ROWS = { f_idle: [0, 24, 60], f_phys: [1, 17, 40], f_spec: [2, 19, 40], f_hit: [3, 14, 40], f_faint: [4, 14, 40],
  b_idle: [5, 24, 60], b_phys: [6, 17, 40], b_spec: [7, 19, 40], b_hit: [8, 14, 40], b_faint: [9, 14, 40] };
const POS = { E: { base: [190, 92], mon: [142, 16], tr: [150, 16] }, P: { base: [70, 142], mon: [22, 64], tr: [30, 64] } };
const STK = ["atk", "def", "spa", "spd", "spe"];
const STG_N = { atk: "공격", def: "방어", spa: "특수공격", spd: "특수방어", spe: "스피드", accuracy: "명중률", evasion: "회피율" };
const tmpC = document.createElement("canvas"); tmpC.width = 192; tmpC.height = 192; const tmpG = tmpC.getContext("2d");
const cellOf = im => (im && im.naturalWidth ? im.naturalWidth / 24 : 96);   // v2.18 배틀 시트 칸: 96(예전) 또는 192(2배 촘촘)

class BSprite {
  constructor(side) { this.side = side; this.key = null; this.vis = false; this.row = side === "E" ? "f_idle" : "b_idle"; this.f = 0; this.t = 0;
    this.scale = 1; this.white = 0; this.red = 0; this.dx = 0; this.dy = 0; this.sink = 0; this.blink = 0; this.once = null; }
  idleRow() { return this.side === "E" ? "f_idle" : "b_idle"; }
  set(key, shiny) { this.key = key; this.shiny = !!shiny; this.im = sheetOf(key, shiny); this.row = this.idleRow(); this.f = 0; this.t = 0; this.sink = 0; this.scale = 1; this.white = 0; this.red = 0; }
  play(kind) {     // phys·spec·hit·faint 한 번
    const row = (this.side === "E" ? "f_" : "b_") + kind;
    if (!Save.opt.anim && kind !== "faint") return Promise.resolve();
    this.row = row; this.f = 0; this.t = 0;
    return new Promise(r => { this.once = r; });
  }
  update() {
    const R = ROWS[this.row]; this.t += 1000 / 60;
    while (this.t >= R[2]) { this.t -= R[2]; this.f++;
      if (this.f >= R[1]) { if (this.once) { const r = this.once; this.once = null; if (this.row.endsWith("faint")) { this.f = R[1] - 1; r(); return; } this.row = this.idleRow(); this.f = 0; r(); } else this.f = 0; } }
    if (this.blink > 0) this.blink--;
  }
  draw() {
    if (!this.vis || !this.key || !this.im || !this.im.complete) return;
    if (this.blink > 0 && (this.blink >> 2) & 1) return;
    { const w = BT && BT.w && BT.w[this.side]; if (w && w.vol && w.vol.inv && w.m && w.m.hp > 0 && BT.spr && BT.spr[this.side] === this) return; }   // v2.50 하늘·땅속·어딘가로 사라진 동안
    const R = ROWS[this.row], P = POS[this.side].mon, C = cellOf(this.im);
    const sx = this.f * C, sy = R[0] * C;
    let src = this.im, ssx = sx, ssy = sy;
    if (this.white > 0 || this.red > 0) {
      tmpG.clearRect(0, 0, 192, 192); tmpG.globalCompositeOperation = "source-over"; tmpG.drawImage(this.im, sx, sy, C, C, 0, 0, C, C);
      tmpG.globalCompositeOperation = "source-atop"; tmpG.globalAlpha = Math.max(this.white, this.red); tmpG.fillStyle = this.red > 0 ? "#ff5040" : "#ffffff"; tmpG.fillRect(0, 0, C, C);
      tmpG.globalAlpha = 1; tmpG.globalCompositeOperation = "source-over"; src = tmpC; ssx = 0; ssy = 0;
    }
    const s = this.scale, w = 96 * s, h = 96 * s;
    const footX = P[0] + 48 + this.dx, footY = P[1] + 78 + this.dy;
    const dx = Math.round(footX - 48 * s), dy = Math.round(footY - 78 * s);
    if (this.sink > 0) {   // 쓰러질 때 땅으로 가라앉음
      const cut = Math.round(78 * s - this.sink);
      if (cut <= 0) return;
      g.drawImage(src, ssx, ssy, C, cut / s * C / 96, dx, dy + this.sink, w, cut);
      return;
    }
    g.drawImage(src, ssx, ssy, C, C, dx, dy, Math.round(w), Math.round(h));
  }
}

// ===== v1.2 날씨 =====
const WX = {
  rain: { n: "비", t: "물", start: "비가 내리기 시작했다!", field: "비가 내리고 있다!", end: "비가 그쳤다." },
  sun:  { n: "쾌청", t: "불꽃", start: "햇살이 강해졌다!", field: "햇살이 쨍쨍하다!", end: "햇살이 원래대로 돌아왔다." },
  sand: { n: "모래바람", t: "바위", start: "모래바람이 불기 시작했다!", field: "황사 섞인 모래바람이 분다!", end: "모래바람이 가라앉았다.", hurt: "모래바람이" },
  hail: { n: "싸라기눈", t: "얼음", start: "싸라기눈이 내리기 시작했다!", field: "싸라기눈이 내리고 있다!", end: "싸라기눈이 그쳤다.", hurt: "싸라기눈이" },
  fog:  { n: "운해", t: "노말", start: "짙은 운해가 깔렸다!", field: "짙은 안개가 끼어 있다!", end: "안개가 걷혔다." },
};
const WX_AB = { drizzle: "rain", drought: "sun", sandstream: "sand", snowwarning: "hail", unhae: "fog" };
const WX_MV = { raindance: "rain", sunnyday: "sun", sandstorm: "sand", hail: "hail", sanangae: "fog" };
const SELF_TG = ["self", "allySide", "allies", "adjacentAllyOrSelf", "all"];
// v2.11 기술·특성 전수 ①: 따로 다루는 기술 묶음
const HIGH_CRIT = new Set(["aircutter", "crabhammer", "crosschop", "crosspoison", "drillrun", "leafblade", "nightslash", "razorleaf", "shadowclaw", "slash", "stoneedge", "karatechop", "psychocut", "aeroblast", "blazekick", "poisontail", "attackorder", "skyattack"]);
const CHARGE = { fly: { msg: "하늘 높이 날아올랐다!", inv: "fly" }, bounce: { msg: "높이 뛰어올랐다!", inv: "fly" }, dig: { msg: "땅속으로 파고들었다!", inv: "dig" },
  phantomforce: { msg: "어디론가 사라졌다!", inv: "phantom" }, shadowforce: { msg: "어디론가 사라졌다!", inv: "phantom" }, meteorbeam: { msg: "우주의 힘이 넘쳐흐른다!", up: { spa: 1 } },
  solarbeam: { msg: "빛을 흡수했다!", sun: 1 }, solarblade: { msg: "빛을 흡수했다!", sun: 1 }, skullbash: { msg: "목을 움츠렸다!", up: { def: 1 } }, skyattack: { msg: "세찬 빛에 휩싸였다!" }, razorwind: { msg: "주위에 바람이 휘몰아친다!" } };
const HIT_INV = { fly: ["gust", "twister", "thunder", "hurricane", "skyuppercut", "smackdown"], dig: ["earthquake", "magnitude", "fissure"], phantom: [] };
const RAMPAGE = new Set(["outrage", "thrash", "petaldance"]);
const TRAP_MV = new Set(["firespin", "sandtomb", "wrap", "bind", "whirlpool", "clamp", "infestation", "magmastorm"]);
const PIVOT = new Set(["uturn", "voltswitch", "flipturn"]);
const POWDER_V241 = new Set(["sleeppowder", "stunspore", "poisonpowder", "spore", "cottonspore", "ragepowder", "magicpowder", "powder"]);   // v2.41 가루 기술(풀 타입·방진안경은 안 맞음)
const FORCE_SW = new Set(["roar", "whirlwind", "circlethrow", "dragontail"]);
const IGN_STG = new Set(["darkestlariat", "sacredsword", "chipaway"]);
const DOUBLES_ONLY = new Set(["afteryou", "helpinghand", "ragepowder", "dragoncheer", "followme", "allyswitch"]);
const BOOM = new Set(["selfdestruct", "explosion", "mindblown", "mistyexplosion"]);
const SIDE_NM = s => s === "P" ? "우리 편" : "상대 편";
for (const k in MV) MV[k].id = k;

class Battle {
  constructor(o) {
    this.o = o; this.opaque = true; this.kind = o.kind; this.wild = o.kind === "wild";
    const tod = timeOfDay();
    this.bgName = o.bg === "grass" || !o.bg ? (tod === "밤" ? "grass_night" : tod === "저녁" ? "grass_eve" : "grass_day") : o.bg;
    this.baseName = o.bg === "grass" || !o.bg ? (tod === "밤" ? "grass_night" : tod === "저녁" ? "grass_eve" : "grass") : o.bg;
    if (o.bg === "water") {        // v2.0 낚시: 요천 물가 배경, 상대는 물결 발판·나는 모래톱
      this.bgName = tod === "밤" ? "water_night" : tod === "저녁" ? "water_eve" : "water_day";
      this.baseE = tod === "밤" ? "water_night" : "water"; this.baseP = tod === "밤" ? "sand_night" : "sand";
    }
    this.spr = { P: new BSprite("P"), E: new BSprite("E") };
    this.w = { P: null, E: null };
    this.foe = o.foe; this.box = { P: { vis: false, off: 150, hp: 0, exp: 0 }, E: { vis: false, off: -150, hp: 0 } };
    this.baseOff = { P: 0, E: 0 }; this.trP = { vis: false, x: 0, f: 0 }; this.trE = o.trainer ? { vis: false, x: 0, f: 0, key: o.trainer.spr } : null;
    this.part = new Set(); this.balls = []; this.shk = { a: 0, t: 0 }; this.fl = { a: 0, c: "#fff", t: 0, d: 1 }; this.runTries = 0; this.weather = o.weather || null; this.wturns = 0; this.wperm = !!o.weather; this.disg = new Set(); this.coins = 0; this.boeun = {};
    this.lowT = 0; this.leveled = new Set(); this.indicator = null; this.res = null;
    this.abp = null;      // v1.8.1 특성 알림판(어느 쪽 남켓몬의 무슨 특성인지)
    this.sc = { P: {}, E: {} }; this.terrain = null; this.wishQ = {}; this.futQ = {}; this.echo = { t: -9, n: 0 }; this.endNow = null; this.restore = [];   // v2.11 편 상태·필드·희망사항·미래예지·되돌릴 도구
  }
  // ---- 화면 ----
  fxPos(side) { const P = POS[side].mon, s = this.spr[side]; return [P[0] + 48 + s.dx, P[1] + 52 + s.dy, 80]; }
  shake(a, ms) { this.shk = { a, t: ms / 16.7 }; }
  flash(c, ms, op) { this.fl = { a: op, c, t: ms / 16.7, d: ms / 16.7 }; }
  update(focus) {
    this.spr.P.update(); this.spr.E.update();
    if (this.abp) { const a = this.abp; a.t++; if (a.ttl > 0 && --a.ttl === 0) a.out = 1; else if (a.out) a.out++; if (a.out > 10) this.abp = null; }
    if (this.shk.t > 0) this.shk.t--;
    if (this.fl.t > 0) this.fl.t--;
    for (const s of ["P", "E"]) { const b = this.box[s], w = this.w[s]; if (w && b.vis) { const tgt = w.m.hp; if (b.hp !== tgt) { const st = Math.max(0.5, w.m.st[0] / 48); b.hp = Math.abs(tgt - b.hp) <= st ? tgt : b.hp + Math.sign(tgt - b.hp) * st; } } }
    // 낮은 체력 경보
    const P = this.w.P;
    const top = Scenes.top();
    if (P && P.m.hp > 0 && P.m.hp <= P.m.st[0] / 5 && this.box.P.vis && top && top.battleUI) { if (++this.lowT % 36 === 0) sfx("lowhp"); }
  }
  draw() {
    const sx = this.shk.t > 0 ? ((this.shk.t & 2) ? this.shk.a : -this.shk.a) : 0, sy = this.shk.t > 0 ? ((this.shk.t & 4) ? 1 : -1) * this.shk.a / 2 : 0;
    g.save(); g.translate(Math.round(sx), Math.round(sy));
    const bg = IMG["bg_" + this.bgName]; if (bg) g.drawImage(bg, 0, 0);
    const be = IMG["base_" + (this.baseE || this.baseName) + "_e"], bp = IMG["base_" + (this.baseP || this.baseName) + "_p"];
    if (be) g.drawImage(be, Math.round(POS.E.base[0] - be.width / 2 + this.baseOff.E), POS.E.base[1] - be.height / 2);
    if (bp) g.drawImage(bp, Math.round(POS.P.base[0] - bp.width / 2 + this.baseOff.P), POS.P.base[1] - bp.height / 2);
    { const dm = FX.dimNow ? FX.dimNow(performance.now()) : null; if (dm && dm.a > 0.01) { g.globalAlpha = dm.a; g.fillStyle = dm.c; g.fillRect(-8, -8, SW + 16, 160); g.globalAlpha = 1; } }   // v2.50 세게 맞는 기술: 배경만 어둡게
    if (this.trE && this.trE.vis) { const im = IMG["tr_" + this.trE.key]; if (im) trImg(im, Math.floor(FRAME / 6), POS.E.tr[0] + this.trE.x + this.baseOff.E, POS.E.tr[1]); }
    this.spr.E.draw();
    if (this.trP.vis) { const im = IMG["tr_" + (G.gender === "f" ? "player_f_back" : "player_m_back")]; if (im) trImg(im, this.trP.f, POS.P.tr[0] + this.trP.x + this.baseOff.P, POS.P.tr[1]); }
    this.spr.P.draw();
    FX.render(performance.now()); g.drawImage(FX.cv, 0, 0);
    if (this.stars) drawShinyStars(this.stars);
    for (const b of this.balls) { const bi = JSN.balls.keys.indexOf(b.type), fi = JSN.balls.frames.indexOf(b.fr); sprite(IMG.balls, fi * 16, bi * 16, 16, 16, b.x - 8, b.y - 8); }
    if (this.indicator) this.drawIndicator();
    g.restore();
    this.drawBox("E"); this.drawBox("P");
    if (this.abp) this.drawAbp();
    const wxn = this.wx(); if (wxn && this.box.P.vis) { const lab = WX[wxn].n + (this.wperm ? "" : " " + this.wturns);
      const ww = Font.width(lab, "g9") + 22; rect(SW - ww - 3, 3, ww, 13, "rgba(30,30,40,.72)"); drawWxIcon(g, wxn, SW - ww + 1, 5); Font.draw(g, lab, SW - 8, 3, { font: "g9", align: "right", col: "#fff", sh: null }); }
    if (!Scenes.st.some(s => s instanceof TextBox || s.battleUI)) darkBox(0, 144, 256, 48);
    if (this.fl.t > 0) { g.globalAlpha = this.fl.a * (this.fl.t / this.fl.d); g.fillStyle = this.fl.c; g.fillRect(0, 0, SW, SH); g.globalAlpha = 1; }
  }
  drawAbp() {          // 특성 알림판: 그 남켓몬 쪽에서 미끄러져 나와 "○○의 / [특성]"을 보여 줌
    const a = this.abp, k = a.out ? Math.max(0, 1 - a.out / 10) : Math.min(1, a.t / 8);
    const l1 = a.nm + "의", w = Math.max(92, Math.max(Font.width(l1, "g9"), Font.width(a.ab)) + 20), h = 27;
    const y = a.side === "E" ? 47 : 67, x = a.side === "E" ? Math.round(-w + (w + 4) * k) : Math.round(SW - (w + 4) * k);
    rect(x, y, w, h, "#1c1e2a"); rect(x + 1, y + 1, w - 2, h - 2, "#33395a"); rect(x + 1, y + 1, w - 2, 1, "#56628c");
    rect(a.side === "E" ? x + w - 5 : x + 1, y + 1, 4, h - 2, "#f0c040");
    const tx = a.side === "E" ? x + 7 : x + 10;
    Font.draw(g, l1, tx, y + 1, { font: "g9", col: "#d4d8ee", sh: null });
    Font.draw(g, a.ab, tx, y + 11, { col: "#ffe27a", sh: "#4a3a10" });
  }
  abDetect(t) {        // 글에 [특성]이 있으면 누구의 특성인지 찾음(글 맨 앞에 나온 이름)
    const m = /\[([^\]]+)\]/.exec(String(t)); if (!m) return null;
    let best = null;
    for (const s of ["P", "E"]) { if (!this.w[s]) continue; const i = String(t).indexOf(this.nm(s)); if (i >= 0 && i < m.index && (!best || i < best.i)) best = { i, side: s }; }
    return best ? { side: best.side, nm: mname(this.w[best.side].m), ab: m[1] } : null;
  }
  drawIndicator() {   // 트레이너 배틀 시작 때 남은 남켓몬 볼 줄
    const { side, n, total } = this.indicator; const mi = JSN.misc.t;
    const y = side === "E" ? 40 : 112, x0 = side === "E" ? 10 : 150;
    rect(x0 - 2, y + 12, 98, 3, "#3a3a46"); rect(x0 - 2, y + 12, 98, 1, "#8890a0");
    for (let i = 0; i < 6; i++) { const id = i >= total ? "ball_icon_empty" : i < n ? "ball_icon" : "ball_icon_faint"; sprite(IMG.misc, mi[id] * 16, 0, 16, 16, x0 + i * 14, y); }
  }
  drawBox(s) {
    const b = this.box[s], w = this.w[s]; if (!b.vis || !w) return;
    const m = w.m, sp = MON[m.k];
    if (s === "E") {
      // v2.52 이름 옆에 타입(사용자: "배틀 중 포켓몬의 타입이 보이도록 … 이름 옆에") — 상자를 140으로 넓히고 Lv는 체력 줄 오른쪽으로
      const x = 6 + b.off, y = 12, T = this.types(w), tw = typeChipsW(T);
      rect(x, y, 140, 32, "#3a3a46"); rect(x + 1, y + 1, 138, 30, "#f8f8f0"); rect(x + 1, y + 1, 138, 2, "#ffffff"); rect(x + 1, y + 27, 138, 4, "#d8d8c8");
      const nw = Font.draw(g, mname(m), x + 6, y + 2, { fit: 130 - (m.gender ? 14 : 0) - tw });   // v2.49 긴 별명이 ♂와 겹치지 않게(v2.52 타입 칸만큼 더)
      if (m.gender) Font.draw(g, m.gender === "m" ? "♂" : "♀", x + 8 + nw, y + 2, { col: m.gender === "m" ? TXT.blue : TXT.red, sh: m.gender === "m" ? TXT.bsh : TXT.rsh });
      typeChips(T, x + 10 + nw + (m.gender ? 12 : 0), y + 3);
      if (this.wild && G.caught[m.k]) sprite(IMG.misc, JSN.misc.t.ball_icon * 16, 0, 16, 16, x - 2, y + 15);
      if (m.status) statusBadge(m.status, x + 6, y + 18);
      hpBar(x + 36, y + 19, 52, b.hp / m.st[0]);
      Font.draw(g, "Lv" + m.lv, x + 136, y + 16, { font: "g9", align: "right" });
    } else {
      const x = 114 + b.off, y = 96, T = this.types(w), tw = typeChipsW(T);   // v2.52 이름 옆에 타입 · Lv는 체력 숫자 줄 왼쪽
      rect(x, y, 140, 44, "#3a3a46"); rect(x + 1, y + 1, 138, 42, "#f8f8f0"); rect(x + 1, y + 1, 138, 2, "#ffffff"); rect(x + 1, y + 39, 138, 4, "#d8d8c8");
      rect(x + 3, y + 4, 4, 30, "#e8a050");
      const nw = Font.draw(g, mname(m), x + 12, y + 2, { fit: 124 - (m.gender ? 14 : 0) - tw });
      if (m.gender) Font.draw(g, m.gender === "m" ? "♂" : "♀", x + 14 + nw, y + 2, { col: m.gender === "m" ? TXT.blue : TXT.red, sh: m.gender === "m" ? TXT.bsh : TXT.rsh });
      typeChips(T, x + 16 + nw + (m.gender ? 12 : 0), y + 3);
      hpBar(x + 48, y + 19, 70, b.hp / m.st[0]);
      const lw = Font.draw(g, "Lv" + m.lv, x + 12, y + 25, { font: "g9" });
      if (m.status) statusBadge(m.status, x + 16 + lw, y + 26);          // v2.52 상태 이상은 Lv 옆(체력 숫자 줄)
      Font.draw(g, `${Math.max(0, Math.round(b.hp))}/${m.st[0]}`, x + 136, y + 25, { font: "g9", align: "right" });
      const lo = expAt(sp.gr, m.lv), hi = expAt(sp.gr, m.lv + 1);
      const ex = b.exp ?? m.exp;
      rect(x + 12, y + 37, 14, 5, "#3a3a46"); Font.draw(g, "EXP", x + 13, y + 34, { font: "g7", col: "#f8c040", sh: null });
      expBar(x + 27, y + 38, 106, m.lv >= 100 ? 0 : (ex - lo) / (hi - lo));
    }
  }
  // ---- 글 ----
  async say(t, o = {}) {
    // v1.8.1: 배틀 글이 너무 빨리 넘어가 이유(특성·도구)를 못 읽던 것 → 글 길이만큼 더 기다림. 특성 글은 알림판을 띄우고 조금 더
    const ab = this.abDetect(t);
    if (ab) this.abp = { side: ab.side, nm: ab.nm, ab: ab.ab, t: 0, ttl: 0, out: 0 };
    const len = String(t).replace(/[\n\f]/g, "").length;
    const auto = 560 / (Save.opt.speed + 1) + 420 + Math.min(600, len * 14) + (ab ? 450 : 0);
    await say(t, Object.assign({ dark: true, x: 0, y: 144, w: 256, h: 48, auto: o.wait ? 0 : auto }, o));
    if (ab) {          // 처음 보는 특성은 무슨 특성인지 한 번 풀어 줌(저장에 남음)
      const ABN = Battle.abByName || (Battle.abByName = Object.fromEntries(Object.entries(AB).map(([k, v]) => [v.n, k])));
      const key = ABN[ab.ab];
      if (key && AB[key].d && !G.flag("abx_" + key)) { G.flag("abx_" + key, true); if (this.abp) this.abp.ttl = 0;
        await say(`특성 '${ab.ab}'\f${AB[key].d}`, { dark: true, x: 0, y: 144, w: 256, h: 48, auto: o.wait ? 0 : auto + 900 }); }
    }
    if (ab && this.abp && this.abp.ab === ab.ab && !this.abp.out) this.abp.ttl = 45;
  }
  async eatMsg(w, it, little) {   // 지닌 도구를 먹는 장면(먼저 '먹었다!' → 그다음 효과)
    FX.play("aura", { side: w.side }, { side: w.side }, "풀");   // v2.50 먹는 장면: 풀빛이 모여듦(전엔 능력 오름 화살과 같은 그림)
    await this.say(`${J(this.nm(w.side), "은")} 지니고 있던\n${J(it.n, "을")} ${little ? "조금 " : ""}먹었다!`);
  }
  nm(s) { const w = this.w[s]; return (s === "E" ? (this.wild ? "야생 " : "상대 ") : "") + mname(w.m); }
  other(s) { return s === "P" ? "E" : "P"; }
  // ---- v2.11 기술·특성 전수: 도우미 ----
  types(w) { const t = (w.vol && w.vol.types) || MON[w.m.k].t; return w.vol && w.vol.roost && w.vol.roost === this.turnNo && t.includes("비행") ? (t.length > 1 ? t.filter(x => x !== "비행") : ["노말"]) : t; }   // 날개쉬기: 그 턴엔 비행타입이 아님
  grounded(w) { return this.hi(w) !== "balloon" && !this.types(w).includes("비행") && w.m.ab !== "levitate" && !(w.vol.magnet > 0) && w.vol.inv !== "fly"; }
  forced(w) { const v = w && w.vol; if (!v || w.m.hp <= 0) return null; return v.charge || (v.rampage && v.rampage.id) || (v.rollout && v.rollout.id) || (v.uproar && v.uproar.id) || null; }
  nervous(w) { const o = this.w[this.other(w.side)]; return !!(o && o.m.hp > 0 && o.m.ab === "unnerve"); }
  // v2.41 지닌 도구: hi(w) = 효과 갈래(ITEMS[..].hold) · used(w) = 한 번 쓰는 도구를 없앰(실제 게임처럼 배틀 뒤에도 돌아오지 않음)
  hi(w) { const id = w && w.m && w.m.item, it = id && ITEMS[id]; return it && w.m.ab !== "klutz" ? (it.hold || null) : null; }
  async used(w, msg) { w.vol.usedItem = w.m.item; w.m.item = null; if (msg) await this.say(msg); }
  async mherb(w) { if (w && w.m.hp > 0 && this.hi(w) === "mherb" && (w.vol.attract || w.vol.taunt || w.vol.disable)) { delete w.vol.attract; delete w.vol.taunt; delete w.vol.disable; await this.used(w, `${J(this.nm(w.side), "은")} 박하잎을 씹었다!\n마음이 개운해졌다!`); } }
  cantUse(w, id) {        // 사슬묶기·도발·봉인으로 못 쓰는 기술이면 그 까닭
    if (!w || id === "struggle" || !MV[id]) return null;
    if (w.vol.disable && w.vol.disable.id === id) return `${this.nm(w.side)}의 ${J(MV[id].n, "은")}\n사슬묶기 때문에 쓸 수 없다!`;
    if (w.vol.taunt && MV[id].c === "X") return `${J(this.nm(w.side), "은")} 도발당해서\n${J(MV[id].n, "을")} 쓸 수 없다!`;
    const o = this.w[this.other(w.side)];
    if (o && o.m.hp > 0 && o.vol.imprison && o.m.moves.some(x => x.id === id)) return `${J(this.nm(w.side), "은")} 봉인당한\n${J(MV[id].n, "을")} 쓸 수 없다!`;
    const h = this.hi(w);   // v2.41 외길머리띠·안경·목도리 = 처음 쓴 기술만 / 누비조끼 = 변화 기술 못 씀
    if ((h === "cband" || h === "cspecs" || h === "cscarf") && w.vol.choice && w.vol.choice !== id && w.m.moves.some(x => x.id === w.vol.choice)) return `${ITEMS[w.m.item].n} 때문에\n${MV[w.vol.choice].n}밖에 쓸 수 없다!`;
    if (h === "vest" && MV[id].c === "X") return `${ITEMS[w.m.item].n} 때문에\n변화 기술은 쓸 수 없다!`;
    return null;
  }
  trapped(w) { if (this.types(w).includes("고스트") || this.hi(w) === "shed") return false; return !!(w.vol.trapped || w.vol.bind || w.vol.ingrain); }
  untf(m) { if (m && m.tfSave) { const t = m.tfSave; delete m.tfSave; m.k = t.k; m.st = t.st; m.moves = t.moves; m.ab = t.ab; m.nick = t.nick; if (m.nick === undefined) delete m.nick; } }
  async heal(w, n, msg) { const M = w.m; if (M.hp <= 0 || M.hp >= M.st[0]) return false; M.hp = Math.min(M.st[0], M.hp + Math.max(1, Math.floor(n))); sfx("heal_hp"); await this.hpWait(w.side); if (msg) await this.say(msg); return true; }
  async transform(a, d) {         // 변신·괴짜: 배틀 동안만(바꾸거나 끝나면 원래대로)
    const m = a.m, t = d.m;
    m.tfSave = { k: m.k, st: m.st, moves: m.moves, ab: m.ab, nick: m.nick };
    m.nick = mname(m); m.k = t.k; m.st = [m.st[0], ...t.st.slice(1)]; m.moves = t.moves.map(x => ({ id: x.id, pp: 5, max: 5 })); m.ab = t.ab;
    for (const k in a.stg) a.stg[k] = d.stg[k]; delete a.vol.types; if (d.vol.types) a.vol.types = d.vol.types.slice();
    await FX.play("status", { side: a.side }, { side: a.side }, "노말");
    this.spr[a.side].set(t.k);
    await this.say(`${J(this.nm(a.side), "은")}\n${J(MON[t.k].n, "으로")} 변신했다!`);
  }
  async steal(to, from, pre) {
    const it = from.m.item; from.m.item = null; to.m.item = it;
    if (G.party.includes(from.m)) this.restore.push([from.m, it]);                 // 내 남켓몬이 빼앗긴 도구는 배틀이 끝나면 돌아옴
    else if (!this.wild && G.party.includes(to.m)) this.restore.push([to.m, null]); // 트레이너에게서 빼앗은 도구도 끝나면 돌려줌(야생에게서는 그대로)
    await this.say((pre ? pre + "\n" : "") + `${J(this.nm(to.side), "은")} ${this.nm(from.side)}에게서\n${J(ITEMS[it].n, "을")} 빼앗았다!`);
  }
  async berryFx(w, id) {          // 벌레먹기·쪼아대기: 빼앗은 열매의 효과를 바로 받음
    const it = ITEMS[id], M = w.m, n = this.nm(w.side);
    if (it.hold === "hp50") await this.heal(w, it.hpPct ? M.st[0] * it.hpPct : it.heal, `${n}의 HP가\n회복되었다!`);
    else if (it.hold === "status" && M.status && (it.cure === "all" || it.cure.includes(M.status))) { M.status = null; M.slp = 0; M.tox = 0; sfx("heal_hp"); await this.say(`${n}의\n상태 이상이 나았다!`); }
    if ((it.conf || it.hold === "conf") && w.vol.conf) { w.vol.conf = 0; await this.say(`${n}의\n혼란이 풀렸다!`); }
    if (it.hold === "pp0") { const sl = M.moves.find(x => x.pp < x.max); if (sl) { sl.pp = Math.min(sl.max, sl.pp + 10); await this.say(`${MV[sl.id].n}의\nPP가 회복되었다!`); } }
  }
  async hazards(s) {              // 스텔스록·독압정·끈적끈적네트: 교체해 나올 때
    const w = this.w[s], S = this.sc[s]; if (!w || w.m.hp <= 0) return;
    if (this.hi(w) === "boots") return;            // v2.41 나막신(통굽부츠)
    if (S.rocks && w.m.ab !== "magicguard") { const n = Math.max(1, Math.floor(w.m.st[0] * this.typeMul("바위", w) / 8)); this.spr[s].blink = 12; await this.damage(w, n); await this.say(`뾰족한 바위가\n${this.nm(s)}에게 박혔다!`); }
    if (w.m.hp > 0 && S.tspikes && this.grounded(w)) {
      if (this.types(w).includes("독")) { S.tspikes = 0; await this.say(`${J(this.nm(s), "이")}\n독압정을 치워 버렸다!`); }
      else { const st = S.tspikes >= 2 ? "tox" : "psn"; if (this.canStatus(w, st)) await this.inflict(w, st); } }
    if (w.m.hp > 0 && S.web && this.grounded(w)) { await this.say(`${J(this.nm(s), "은")}\n끈적끈적네트에 걸렸다!`); await this.boost(w, { spe: -1 }); }
  }
  async forceOut(a, d, st) {      // 울부짖기·날려버리기·배대뒤치기·드래곤테일
    const fail = async t => { if (st) await this.say(t || "그러나 실패하고 말았다!"); };
    if (d.m.hp <= 0) return;
    if (d.vol.ingrain) return fail(`${J(this.nm(d.side), "은")}\n뿌리를 내리고 있다!`);
    if (d.m.ab === "suctioncups" && a.m.ab !== "moldbreaker") return fail(`${this.nm(d.side)}의 [${AB.suctioncups.n}]!\n${J(this.nm(d.side), "은")} 꿈쩍도 하지 않는다!`);
    if (this.wild) { this.endNow = "run"; await this.say(d.side === "E" ? `${J(this.nm("E"), "은")}\n멀리 도망가 버렸다!` : `${J(this.nm("P"), "은")}\n멀리 날려가 버렸다!`); return; }
    const party = d.side === "P" ? G.party : this.foe, cur = d.side === "P" ? this.pi : this.ei;
    const cand = party.map((m, i) => i).filter(i => i !== cur && party[i].hp > 0);
    if (!cand.length) return fail();
    if (d.m.abT) { d.m.ab = d.m.abT; delete d.m.abT; }
    this.box[d.side].vis = false; await this.withdraw(d.side);
    await this.sendOut(d.side, pick(cand), false, true);
  }
  async pivot(a) {                // 유턴·볼트체인지·퀵턴: 치고 돌아옴
    if (a.side === "P") {
      if (!G.party.some((m, i) => m.hp > 0 && i !== this.pi)) return;
      let i = -1; this.pivoting = true;            // 교체 화면: 지금 싸우는 남켓몬은 고를 수 없고 그만둘 수도 없음
      while (i < 0 || i === this.pi || G.party[i].hp <= 0) { i = await openParty("battle_forced", "누구와 교체하겠습니까?"); if (i == null) i = -1; }
      this.pivoting = false;
      await this.switchIn("P", i);
    } else {
      if (this.wild) return;
      const i = this.foe.findIndex((m, k) => m.hp > 0 && k !== this.ei); if (i < 0) return;
      await this.say(`${J(this.nm("E"), "은")} ${this.o.trainer.name}에게\n돌아갔다!`);
      if (a.m.abT) { a.m.ab = a.m.abT; delete a.m.abT; }
      this.box.E.vis = false; await this.withdraw("E");
      await this.sendOut("E", i, false);
    }
  }
  wouldFail(a, d, id) {           // AI가 헛수고할 변화 기술은 고르지 않음
    const S = this.sc[a.side], F = this.sc[this.other(a.side)], v = a.vol, dv = d ? d.vol : {};
    if (DOUBLES_ONLY.has(id)) return true;
    switch (id) {
      case "reflect": case "lightscreen": case "safeguard": case "tailwind": return !!S[id];
      case "stealthrock": return !!F.rocks; case "toxicspikes": return (F.tspikes || 0) >= 2; case "stickyweb": return !!F.web;
      case "grassyterrain": return !!(this.terrain && this.terrain.t === "grassy"); case "mistyterrain": return !!(this.terrain && this.terrain.t === "misty");
      case "taunt": return !!dv.taunt; case "disable": return !!dv.disable || !dv.lastMv; case "yawn": return !!dv.yawn || !!(d && d.m.status);
      case "focusenergy": return (v.crit || 0) >= 2; case "aquaring": return !!v.aquaring; case "ingrain": return !!v.ingrain; case "wish": return !!this.wishQ[a.side];
      case "curse": return this.types(a).includes("고스트") && !!dv.curse; case "transform": return !!a.m.tfSave || !d || !!d.m.tfSave;
      case "block": case "meanlook": return !!dv.trapped; case "lockon": return !!v.lockon; case "magnetrise": return v.magnet > 0;
      case "soak": return !!d && this.types(d).length === 1 && this.types(d)[0] === "물";
      case "roar": case "whirlwind": return !this.wild && !!d && !(a.side === "P" ? this.foe : G.party).some(m => m.hp > 0 && m !== d.m);
      case "healbell": return !(a.side === "P" ? G.party : this.foe).some(m => m.status);
      case "imprison": return !!v.imprison; case "strengthsap": return !!d && d.stg.atk <= -6;
      case "futuresight": return !!d && !!this.futQ[d.side];
    }
    return false;
  }
  async statusSpecial(a, d, id, mv) {   // v2.11 따로 다루는 변화 기술(처리했으면 true)
    const s = a.side, o = d.side, S = this.sc[s], F = this.sc[o], N = this.nm(s), D = this.nm(o);
    const fail = async () => { await this.say("그러나 실패하고 말았다!"); return true; };
    const veil = async () => { if (d.m.ab === "aromaveil" && a.m.ab !== "moldbreaker") { await this.say(`${D}의 [${AB.aromaveil.n}]!\n그러나 효과가 없었다!`); return true; } return false; };
    switch (id) {
      case "reflect": case "lightscreen": case "safeguard":
        if (S[id]) return fail(); S[id] = id !== "safeguard" && this.hi(a) === "clay" ? 8 : 5; sfx("stat_up");
        await this.say(`${SIDE_NM(s)}은 ` + { reflect: "리플렉터로\n물리 공격에 강해졌다!", lightscreen: "빛의장막으로\n특수 공격에 강해졌다!", safeguard: "신비의 베일에\n둘러싸였다!" }[id]); return true;
      case "tailwind": if (S.tailwind) return fail(); S.tailwind = 4; await this.say(`${SIDE_NM(s)} 뒤에서\n순풍이 불기 시작했다!`); return true;
      case "stealthrock": if (F.rocks) return fail(); F.rocks = 1; await this.say(`${SIDE_NM(o)} 주위에\n뾰족한 바위가 떠올랐다!`); return true;
      case "toxicspikes": if ((F.tspikes || 0) >= 2) return fail(); F.tspikes = (F.tspikes || 0) + 1; await this.say(`${SIDE_NM(o)} 발밑에\n독압정이 뿌려졌다!`); return true;
      case "stickyweb": if (F.web) return fail(); F.web = 1; await this.say(`${SIDE_NM(o)} 발밑에\n끈적끈적네트가 펼쳐졌다!`); return true;
      case "grassyterrain": case "mistyterrain": { const t = id === "grassyterrain" ? "grassy" : "misty"; if (this.terrain && this.terrain.t === t) return fail();
        this.terrain = { t, n: this.hi(a) === "tmat" ? 8 : 5 }; await this.say(t === "grassy" ? "발밑에 풀이\n무성하게 자라났다!" : "발밑에 안개가\n자욱하게 깔렸다!"); return true; }
      case "taunt": if (d.vol.taunt) return fail(); if (await veil()) return true;
        if (d.m.ab === "oblivious" && a.m.ab !== "moldbreaker") { await this.say(`${D}의 [${AB.oblivious.n}]!\n그러나 효과가 없었다!`); return true; }
        d.vol.taunt = 3; await this.say(`${J(D, "은")}\n도발에 넘어가 버렸다!`); return true;
      case "disable": { const lm = d.vol.lastMv, sl = lm && d.m.moves.find(x => x.id === lm);
        if (d.vol.disable || !sl || sl.pp <= 0) return fail(); if (await veil()) return true;
        d.vol.disable = { id: lm, n: 4 }; await this.say(`${D}의\n${J(MV[lm].n, "을")} 사슬묶기 했다!`); return true; }
      case "yawn": if (d.vol.yawn || d.m.status || !this.canStatus(d, "slp", a)) return fail(); d.vol.yawn = 2; await this.say(`${J(D, "은")}\n졸음이 쏟아지기 시작했다!`); return true;
      case "focusenergy": if ((a.vol.crit || 0) >= 2) return fail(); a.vol.crit = (a.vol.crit || 0) + 2; sfx("stat_up"); await this.say(`${J(N, "은")}\n의욕이 넘친다!`); return true;
      case "curse":
        if (this.types(a).includes("고스트")) { if (d.vol.curse) return fail(); d.vol.curse = 1; await this.damage(a, Math.max(1, Math.floor(a.m.st[0] / 2))); await this.say(`${J(N, "은")} 자신의 체력을 깎아서\n${D}에게 저주를 걸었다!`); return true; }
        await this.boost(a, { spe: -1 }, true); await this.boost(a, { atk: 1, def: 1 }, true); return true;
      case "aquaring": if (a.vol.aquaring) return fail(); a.vol.aquaring = 1; await this.say(`${J(N, "은")}\n물의 베일로 몸을 감쌌다!`); return true;
      case "ingrain": if (a.vol.ingrain) return fail(); a.vol.ingrain = 1; delete a.vol.magnet; await this.say(`${J(N, "은")}\n뿌리를 내렸다!`); return true;
      case "healbell": { const L = s === "P" ? G.party : this.foe; if (!L.some(m => m.status)) return fail();
        await this.say("기분 좋은 방울 소리가\n울려 퍼졌다!"); for (const m of L) { m.status = null; m.slp = 0; m.tox = 0; } sfx("heal_hp"); await this.say(`${SIDE_NM(s)}의\n상태 이상이 모두 나았다!`); return true; }
      case "wish": if (this.wishQ[s]) return fail(); this.wishQ[s] = { n: 2, hp: Math.floor(a.m.st[0] / 2), who: N }; await this.say(`${J(N, "은")}\n희망사항을 빌었다!`); return true;
      case "strengthsap": { if (d.stg.atk <= -6) return fail(); const h = this.eff(d, "atk"); await this.boost(d, { atk: -1 });
        if (d.m.ab === "liquidooze") { await this.say(`${D}의 [${AB.liquidooze.n}]!`); await this.damage(a, h); await this.say(`${J(N, "은")}\n해감액을 빨아들였다!`); }
        else await this.heal(a, h, `${J(N, "은")}\n체력을 흡수했다!`); return true; }
      case "soak": { const T = this.types(d); if (T.length === 1 && T[0] === "물") return fail(); d.vol.types = ["물"]; await this.say(`${J(D, "은")}\n물타입이 되었다!`); return true; }
      case "reflecttype": a.vol.types = this.types(d).slice(); await this.say(`${J(N, "은")} ${J(D, "과")}\n같은 타입이 되었다!`); return true;
      case "transform": if (a.m.tfSave || d.m.tfSave || d.vol.inv) return fail(); await this.transform(a, d); return true;
      case "block": case "meanlook": if (d.vol.trapped || this.types(d).includes("고스트")) return fail(); d.vol.trapped = 1; await this.say(`${J(D, "은")} 이제\n도망칠 수 없다!`); return true;
      case "lockon": a.vol.lockon = this.turnNo + 1; await this.say(`${J(N, "은")}\n${J(D, "을")} 겨냥했다!`); return true;
      case "magnetrise": if (a.vol.magnet > 0 || a.vol.ingrain) return fail(); a.vol.magnet = 5; await this.say(`${J(N, "은")}\n전자기력으로 떠올랐다!`); return true;
      case "imprison": if (a.vol.imprison || !d.m.moves.some(x => a.m.moves.some(y => y.id === x.id))) return fail(); a.vol.imprison = 1; await this.say(`${J(N, "은")} 상대가 같이 지닌\n기술을 봉인했다!`); return true;
      case "roar": case "whirlwind":
        if (id === "roar" && d.m.ab === "soundproof" && a.m.ab !== "moldbreaker") { await this.say(`${D}의 [${AB.soundproof.n}]!\n${D}에게는 효과가 없다!`); return true; }
        await this.forceOut(a, d, true); return true;
    }
    if (DOUBLES_ONLY.has(id)) return fail();
    return false;
  }
  // ---- 시작 ----
  async start() {
    BT = this; FX.clear();
    Scenes.push(this);
    const r = await this.main();
    return r;
  }
  mkW(side, m) { return { side, m, stg: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 }, vol: {}, turns: 0 }; }
  async intro() {
    // 발판이 미끄러져 들어온다
    this.baseOff = { E: -256, P: 256 }; this.trP.vis = true; this.trP.f = 0;
    const foe = this.foe[0];
    if (this.wild) { this.w.E = this.mkW("E", foe); this.spr.E.set(foe.k, foe.shiny); this.spr.E.vis = true; }
    else { this.trE.vis = true; }
    await fadeIn(8);
    for (let i = 1; i <= 40; i++) { const t = 1 - (1 - i / 40) ** 2; this.baseOff.E = -256 * (1 - t); this.baseOff.P = 256 * (1 - t); await frames(1); }
    this.baseOff = { E: 0, P: 0 };
    if (this.weather) { FX.setWeather(this.weather); await this.say(WX[this.weather].field); }
    if (this.wild) {
      G.see(foe.k);
      const ms = Audio2.cry(foe.k);
      this.box.E.vis = true; this.box.E.hp = foe.hp; await this.slideBox("E");
      if (foe.shiny) await this.shinyFx("E");   // v2.40 이로치: 반짝!
      await this.say(`앗! ${J("야생 " + mname(foe), "이")} 튀어나왔다!`);
    } else {
      const T = this.o.trainer;
      this.indicator = { side: "E", n: this.foe.filter(m => m.hp > 0).length, total: this.foe.length };
      await this.say(`${T.cls} ${J(T.name, "이")}\n승부를 걸어왔다!`);
      this.indicator = null;
      for (let i = 0; i < 16; i++) { this.trE.x += 6; await frames(1); }
      this.trE.vis = false;
      await this.sendOut("E", 0, true);
    }
    await this.sendOut("P", G.party.findIndex(m => m.hp > 0), true);
    await this.entryAbility("E");      // 야생·트레이너 첫 남켓몬의 등장 특성(첫 내보내기 땐 상대가 아직 없어서 건너뜀)
  }
  async slideBox(s) { const b = this.box[s]; const from = s === "E" ? -150 : 150; for (let i = 1; i <= 12; i++) { b.off = from * (1 - i / 12); await frames(1); } b.off = 0; }
  async sendOut(s, i, first, drag) {
    const party = s === "P" ? G.party : this.foe;
    const m = party[i];
    const prev = this.w[s]; if (prev && prev.m !== m) this.untf(prev.m);       // v2.11 변신은 들어가면 풀림
    this.w[s] = this.mkW(s, m); this.w[s].inT = this.turnNo || 0; if (s === "P") { this.pi = i; this.part.add(m.uid); } else this.ei = i;
    const sp = this.spr[s]; sp.set(m.k, m.shiny); sp.vis = false;
    if (s === "P") {
      if (!drag) await this.say(`가랏! ${mname(m)}!`, { auto: 300 });
      if (first) { // 던지는 동작
        for (const f of [1, 2, 3]) { this.trP.f = f; await frames(5); }
        this.throwBall(52, 72, 72, 120, m.ball || "namket", 22).then(() => {});   // v2.40 던지는 그림을 좌우로 뒤집어(상대 쪽을 봄) 공이 든 손(왼쪽 위)에서 출발
        this.trP.f = 4; await frames(6);
        (async () => { for (let k = 0; k < 20; k++) { this.trP.x -= 7; await frames(1); } this.trP.vis = false; this.trP.x = 0; this.trP.f = 0; })();
        await frames(16);
      } else if (!drag) { await this.throwBall(20, 110, 72, 120, m.ball || "namket", 16); }
    } else {
      if (!drag) await this.say(`${this.o.trainer.cls} ${J(this.o.trainer.name, "은")}\n${J(mname(m), "을")} 내보냈다!`, { auto: 300 });
      G.see(m.k);
      if (!drag) await this.throwBall(256, 20, 190, 70, "namket", 14);
    }
    await this.popOut(s);
    if (m.shiny) await this.shinyFx(s);
    const b = this.box[s]; b.hp = m.hp; if (s === "P") b.exp = m.exp; b.vis = true; await this.slideBox(s);
    if (drag) await this.say(`${J(this.nm(s), "이")}\n끌려 나왔다!`);
    if (this.boeun[s]) { this.boeun[s] = null; const heal = Math.max(1, Math.floor(m.st[0] / 2));
      if (m.hp < m.st[0] || m.status) { await FX.play("heal", { side: s }, { side: s }, "풀"); m.hp = Math.min(m.st[0], m.hp + heal); m.status = null; m.tox = 0; sfx("heal_hp"); await this.hpWait(s);
        await this.say(`제비가 은혜를 갚았다! [보은]\n${this.nm(s)}의 기운이 돌아왔다!`); } }
    if (this.hi(this.w[s]) === "balloon") await this.say(`${J(this.nm(s), "은")} 방패연을 타고\n둥실 떠올랐다!`);   // v2.41
    await this.hazards(s);
    if (this.w[s].m.hp > 0) await this.entryAbility(s);
  }
  async shinyFx(s) {   // v2.40 이로치 반짝 별
    const P = POS[s].mon, cx = P[0] + 48 + (this.baseOff[s] || 0), cy = P[1] + 52;
    this.stars = Array.from({ length: 10 }, (_, i) => ({ i, a: i / 10 * 6.283 + (i % 2) * 0.3, x: cx, y: cy, t: -(i % 5) * 3, n: 26 }));
    sfx("chime");
    for (let f = 0; f < 44; f++) { for (const st of this.stars) st.t++; if (f === 14) sfx("chime"); await frames(1); }
    this.stars = null;
  }
  async throwBall(x0, y0, x1, y1, type, n) {
    sfx("ball_throw");
    const b = { x: x0, y: y0, type, fr: "spin0" }; this.balls.push(b);
    for (let i = 1; i <= n; i++) { const t = i / n; b.x = x0 + (x1 - x0) * t; b.y = y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * 30; b.fr = "spin" + (i % 4); await frames(1); }
    b.fr = "open"; sfx("ball_open"); await frames(3); b.fr = "burst"; await frames(4);
    this.balls.splice(this.balls.indexOf(b), 1);
  }
  async popOut(s) {
    const sp = this.spr[s]; sp.vis = true; sp.scale = 0.1; sp.white = 1;
    this.flash("#ffffff", 120, 0.5);
    const ms = Audio2.cry(this.w[s].m.k);
    for (let i = 1; i <= 10; i++) { sp.scale = 0.1 + 0.9 * (i / 10); await frames(1); }
    for (let i = 1; i <= 8; i++) { sp.white = 1 - i / 8; await frames(1); }
    sp.scale = 1; sp.white = 0;
    await wait(Math.max(0, ms - 300));
  }
  async withdraw(s) {
    const sp = this.spr[s];
    sfx("ball_open");
    for (let i = 1; i <= 10; i++) { sp.red = i / 10; sp.scale = 1 - 0.9 * (i / 10); await frames(1); }
    sp.vis = false; sp.red = 0; sp.scale = 1;
  }
  async entryAbility(s) {
    const w = this.w[s], o = this.w[this.other(s)];
    if (!w || !o) return;
    if (w.m.ab === "trace" && o.m.hp > 0 && !["trace", "imposter", "disguise"].includes(o.m.ab) && AB[o.m.ab]) {
      w.m.abT = "trace"; w.m.ab = o.m.ab; await this.say(`${this.nm(s)}의 [${AB.trace.n}]!\n${this.nm(o.side)}의 [${AB[o.m.ab].n}]${jp(AB[o.m.ab].n, "을")} 따라 했다!`); }
    if (w.m.ab === "intimidate" && o.m.hp > 0) {
      await this.say(`${this.nm(s)}의 [${AB.intimidate.n}]!`);
      if (["innerfocus", "owntempo", "oblivious", "scrappy"].includes(o.m.ab)) await this.say(`${this.nm(o.side)}에게는\n통하지 않았다!`);
      else await this.boost(o, { atk: -1 });
    }
    if (WX_AB[w.m.ab] && this.weather !== WX_AB[w.m.ab]) await this.setWx(WX_AB[w.m.ab], `${this.nm(s)}의 [${AB[w.m.ab].n}]!`, w);
    if (w.m.ab === "pressure" && AB.pressure) await this.say(`${this.nm(s)}의 [${AB.pressure.n}]!\n압박감이 느껴진다!`);
    if (w.m.ab === "moldbreaker" && AB.moldbreaker) await this.say(`${this.nm(s)}의 [${AB.moldbreaker.n}]!\n상대 특성을 깨뜨리는 기운이 느껴진다!`);
    if (w.m.ab === "frisk" && AB.frisk && o.m.hp > 0 && o.m.item && ITEMS[o.m.item]) await this.say(`${this.nm(s)}의 [${AB.frisk.n}]!\n${J(this.nm(o.side), "이")} 지닌 ${J(ITEMS[o.m.item].n, "을")} 알아챘다!`);
    if (w.m.ab === "mapae" && o.m.hp > 0) {
      await FX.play("mapae", { side: s }, { side: o.side }, "강철");
      await this.say(`${this.nm(s)}의 [${AB.mapae.n}]!\n"암행어사 출두요!"`);
      await this.clearUps(o);
    }
    // v2.11 등장 특성 더함
    if (w.m.ab === "imposter" && o.m.hp > 0 && !w.m.tfSave && !o.m.tfSave) { await this.say(`${this.nm(s)}의 [${AB.imposter.n}]!`); await this.transform(w, o); }
    if (w.m.ab === "download" && o.m.hp > 0) { await this.say(`${this.nm(s)}의 [${AB.download.n}]!`); await this.boost(w, this.eff(o, "def") < this.eff(o, "spd") ? { atk: 1 } : { spa: 1 }, true); }
    if (w.m.ab === "unnerve" && o.m.hp > 0) await this.say(`${this.nm(s)}의 [${AB.unnerve.n}]!\f${SIDE_NM(o.side)}은 긴장해서\n나무열매를 먹을 수 없게 되었다!`);
    if (w.m.ab === "forewarn" && o.m.hp > 0) { const pw = x => MV[x.id].c === "X" ? 0 : (MV[x.id].bp || 0); const top = o.m.moves.slice().sort((p, q) => pw(q) - pw(p))[0];
      if (top) await this.say(`${this.nm(s)}의 [${AB.forewarn.n}]!\f${this.nm(o.side)}의\n${J(MV[top.id].n, "을")} 꿰뚫어 보았다!`); }
    if (w.m.ab === "anticipation" && o.m.hp > 0 && o.m.moves.some(x => MV[x.id].c !== "X" && this.typeMul(MV[x.id].t, w) > 1)) await this.say(`${this.nm(s)}의 [${AB.anticipation.n}]!\n${J(this.nm(s), "은")} 몸서리를 쳤다!`);
  }
  // ---- 메인 흐름 ----
  async main() {
    await this.intro();
    this.alarm = true;
    while (true) {
      let r0; while ((r0 = await this.checkFaint()) === "cont") { }       // v2.11 교체해 나오다 쓰러진 경우(스텔스록 등)
      if (r0) { this.alarm = false; return await this.finish(r0); }
      const fid = this.forced(this.w.P);                                  // 모으기 둘째 턴·난동·구르기·소란은 고르지 않고 이어서
      const act = fid ? { type: "move", id: fid } : await this.choose();
      const r = await this.turn(act);
      if (r) { this.alarm = false; return await this.finish(r); }
    }
  }
  async choose() {
    const P = this.w.P;
    // 반동·충전 같은 강제 행동은 없음(데모)
    while (true) {
      const c = await this.cmdMenu();
      if (c === 0) {
        if (P.m.moves.every(mv => mv.pp <= 0 || this.cantUse(P, mv.id))) { await this.say(`${J(this.nm("P"), "은")}\n쓸 수 있는 기술이 없다!`, { wait: true }); return { type: "move", id: "struggle" }; }
        const id = await this.moveMenu(); if (id == null) continue;
        const why = this.cantUse(P, id); if (why) { await this.say(why, { wait: true }); continue; }
        return { type: "move", id };
      }
      if (c === 1) {
        if (this.o.noBag) { await this.say("이 배틀에서는\n가방을 쓸 수 없다!", { wait: true }); continue; }   // v2.52 배틀누각(실제 배틀타워처럼)
        const r = await openBag("battle"); if (!r) continue;
        if (ITEMS[r.item].ball) {
          if (!this.wild) { await this.say("안 돼! 트레이너의 남켓몬을\n빼앗을 수는 없어!", { wait: true }); continue; }
          return { type: "ball", item: r.item };
        }
        return { type: "item", item: r.item, target: r.target, move: r.move };
      }
      if (c === 2) {
        if (this.trapped(P)) { await this.say(`${J(this.nm("P"), "은")}\n교체할 수 없다!`, { wait: true }); continue; }
        const i = await openParty("battle"); if (i == null || i < 0) continue;
        if (i === this.pi) { await this.say(`${J(mname(G.party[i]), "은")} 이미\n나가서 싸우고 있다!`, { wait: true }); continue; }
        if (G.party[i].hp <= 0) { await this.say(`${J(mname(G.party[i]), "은")}\n싸울 수 있는 기력이 없다!`, { wait: true }); continue; }
        return { type: "switch", i };
      }
      if (c === 3) { if (this.wild && this.trapped(P) && P.m.ab !== "runaway") { await this.say("도망칠 수 없다!", { wait: true }); continue; } return { type: "run" }; }
    }
  }
  cmdMenu() {
    const B = this; const P = this.w.P;
    return new Promise(res => {
      const ui = { battleUI: true, kind: "cmd", i: this.lastCmd || 0,
        update(focus) { if (!focus) return;
          const i = this.i; if (Input.hit("up") || Input.hit("down")) { this.i = i ^ 2; sfx("cursor"); } else if (Input.hit("left") || Input.hit("right")) { this.i = i ^ 1; sfx("cursor"); }
          else if (Input.ok()) { sfx("select"); B.lastCmd = this.i; Scenes.pop(this); res(this.i); } },
        draw() {
          darkBox(0, 144, 256, 48);
          Font.draw(g, `${J(mname(P.m), "은")}`, 10, 151, { col: TXT.white, sh: TXT.wsh });
          Font.draw(g, "무엇을 할까?", 10, 167, { col: TXT.white, sh: TXT.wsh });
          frame(128, 144, 128, 48);
          const L = ["싸운다", "가방", "남켓몬", "도망친다"];
          L.forEach((s, k) => { const x = 146 + (k & 1) * 56, y = 151 + (k >> 1) * 16; Font.draw(g, s, x, y); if (k === this.i) cursor(x - 10, y + 3); });
        } };
      Scenes.push(ui);
    });
  }
  moveMenu() {
    const B = this; const P = this.w.P;
    return new Promise(res => {
      const ui = { battleUI: true, kind: "move", i: Math.min(this.lastMove || 0, P.m.moves.length - 1),
        update(focus) { if (!focus) return; const n = P.m.moves.length;
          if (Input.hit("up") || Input.hit("down")) { const j = this.i ^ 2; if (j < n) { this.i = j; sfx("cursor"); } }
          else if (Input.hit("left") || Input.hit("right")) { const j = this.i ^ 1; if (j < n) { this.i = j; sfx("cursor"); } }
          else if (Input.ok()) {
            if (P.m.moves.every(mv => mv.pp <= 0)) { sfx("select"); Scenes.pop(this); res("struggle"); return; }
            const mv = P.m.moves[this.i]; if (mv.pp <= 0) { sfx("flee_fail"); return; }
            sfx("select"); B.lastMove = this.i; Scenes.pop(this); res(mv.id); }
          else if (Input.cancel()) { sfx("cancel"); Scenes.pop(this); res(null); } },
        draw() {
          frame(0, 144, 176, 48);
          P.m.moves.forEach((mv, k) => { const x = 18 + (k & 1) * 80, y = 151 + (k >> 1) * 16, nm = MV[mv.id].n, sm = Font.width(nm) > 74;   // v2.49 일곱 글자 기술(벌레의야단법석 등)은 작은 글씨로(옆 칸·PP 칸을 넘던 것)
            Font.draw(g, nm, x, y + (sm ? 2 : 0), Object.assign(sm ? { font: "g9" } : {}, B.cantUse(P, mv.id) ? { col: TXT.gray, sh: TXT.gsh } : {})); if (k === this.i) cursor(x - 10, y + 3); });
          for (let k = P.m.moves.length; k < 4; k++) Font.draw(g, "-", 18 + (k & 1) * 80, 151 + (k >> 1) * 16, { col: TXT.gray, sh: TXT.gsh });
          frame(176, 144, 80, 48);
          const mv = P.m.moves[this.i], d = MV[mv.id];
          Font.draw(g, "PP", 186, 151);
          const low = mv.pp === 0 ? [TXT.red, TXT.rsh] : mv.pp <= mv.max / 4 ? ["#d08000", "#f0d8a0"] : [TXT.dark, TXT.sh];
          Font.draw(g, `${mv.pp}/${mv.max}`, 246, 151, { align: "right", col: low[0], sh: low[1] });
          typeBadge(d.t, 186, 169, 36); Font.draw(g, { P: "물리", S: "특수", X: "변화" }[d.c], 246, 168, { align: "right", font: "g9" });
        } };
      Scenes.push(ui);
    });
  }
  // ---- 한 턴 ----
  wx() { return this.weather && !["P", "E"].some(q => this.w[q] && this.w[q].m.hp > 0 && ["cloudnine", "airlock"].includes(this.w[q].m.ab)) ? this.weather : null; }
  async setWx(w, pre, by) {      // 기술·특성으로 바뀌는 날씨: 5턴(v2.41 날씨 돌을 지니면 8턴)
    if (this.weather === w) { if (!pre) await this.say("그러나 실패하고 말았다!"); return false; }
    this.weather = w; this.wturns = by && this.hi(by) === "wrock" && ITEMS[by.m.item].wrock === w ? 8 : 5; this.wperm = false; FX.setWeather(w);
    await this.say((pre ? pre + "\n" : "") + WX[w].start); return true;
  }
  async clearUps(w) {        // 마패·어사출두: 올라간 능력만 원래대로
    const up = Object.keys(w.stg).filter(k => w.stg[k] > 0);
    if (!up.length) return false;
    for (const k of up) w.stg[k] = 0;
    await this.say(`${this.nm(w.side)}의 올라간 능력이\n원래대로 돌아왔다!`); return true;
  }
  moveFor(a, id) {           // 날씨·시간에 따라 바뀌는 기술
    const mv = MV[id], wx = this.wx();
    if (id === "weatherball" && wx) return Object.assign({}, mv, { t: WX[wx].t, bp: 100, fx: { rain: "water", sun: "flame", sand: "rocks", hail: "ice", fog: "orb" }[wx] });
    return mv;
  }
  speed(w) { let v = this.eff(w, "spe"); if (w.m.status === "par" && w.m.ab !== "quickfeet") v = Math.floor(v / 2);
    if (w.m.ab === "quickfeet" && w.m.status) v = Math.floor(v * 1.5);
    const wx = this.wx();
    if ((w.m.ab === "swiftswim" && wx === "rain") || (w.m.ab === "chlorophyll" && wx === "sun") || (w.m.ab === "sandrush" && wx === "sand") || (w.m.ab === "slushrush" && wx === "hail")) v *= 2; if (this.sc[w.side].tailwind) v *= 2; if (this.hi(w) === "cscarf") v = Math.floor(v * 1.5); return v; }
  eff(w, k) { const i = STK.indexOf(k) + 1, s = w.stg[k]; return Math.floor(w.m.st[i] * (s >= 0 ? (2 + s) / 2 : 2 / (2 - s))); }
  aiMove(w) {
    const fz = this.forced(w); if (fz) return fz;
    const d0 = this.w[this.other(w.side)];
    let usable = w.m.moves.filter(mv => mv.pp > 0 && !this.cantUse(w, mv.id)); if (!usable.length) return "struggle";
    { const ok = usable.filter(mv => !this.wouldFail(w, d0, mv.id)); if (ok.length) usable = ok; }
    const wxNow = this.wx(), plan = !this.wild && this.o.trainer && this.o.trainer.wx;
    if (plan && this.weather !== plan) { const set = usable.find(mv => WX_MV[mv.id] === plan); if (set && Math.random() < 0.9) return set.id; }   // 날씨 전략: 먼저 날씨부터
    const keep = usable.filter(mv => !(WX_MV[mv.id] && WX_MV[mv.id] === this.weather)); if (keep.length) usable = keep;                         // 이미 그 날씨면 또 부르지 않음
    if (this.wild || Math.random() < 0.25) return pick(usable).id;
    const d = this.w.P;
    const wxm = t => wxNow === "rain" ? (t === "물" ? 1.5 : t === "불꽃" ? 0.5 : 1) : wxNow === "sun" ? (t === "불꽃" ? 1.5 : t === "물" ? 0.5 : 1) : 1;
    let best = null, bs = -1;
    for (const mv of usable) { const M = this.moveFor(w, mv.id); const sure = (wxNow === "rain" && ["thunder", "hurricane"].includes(mv.id)) || (wxNow === "hail" && mv.id === "blizzard");
      let sc = M.c === "X" ? 18 + rnd(20) : M.bp * this.typeMul(M.t, d) * wxm(M.t) * (w.m.k && MON[w.m.k].t.includes(M.t) ? 1.5 : 1) * ((sure || M.acc > 100 ? 100 : M.acc) / 100);
      if (M.c === "X" && M.st && d.m.status) sc = 0; if (sc > bs) { bs = sc; best = mv.id; } }
    return best;
  }
  async turn(act) {
    const P = this.w.P, E = this.w.E;
    this.turnNo = (this.turnNo || 0) + 1;
    for (const s of ["P", "E"]) { this.w[s].vol.flinch = false; this.w[s].vol.protect = false; this.w[s].vol.endure = false; }
    if (act.type === "run") {
      if (!this.wild) { await this.say("안 돼! 트레이너와의 승부에서\n등을 보일 수는 없어!", { wait: true }); return null; }
      this.runTries++;
      const ps = this.speed(P), es = this.speed(E);
      const F = Math.floor(ps * 128 / Math.max(1, es)) + 30 * this.runTries;
      if (ps >= es || P.m.ab === "runaway" || F > 255 || rnd(256) < F) { sfx("run"); await this.say("무사히 도망쳤다!"); return "run"; }
      sfx("flee_fail"); await this.say("도망칠 수 없었다!");
      return await this.enemyOnly();
    }
    if (act.type === "switch") { await this.switchIn("P", act.i); return await this.enemyOnly(); }
    if (act.type === "item") { await this.useItem(act); return await this.enemyOnly(); }
    if (act.type === "ball") { const r = await this.throwCatch(act.item); if (r) return r; return await this.enemyOnly(); }
    const eid = this.aiMove(E);
    const pr = (w, id) => MV[id].pri + (w.m.ab === "prankster" && MV[id].c === "X" ? 1 : 0) + (w.m.ab === "galewings" && MV[id].t === "비행" && w.m.hp === w.m.st[0] ? 1 : 0);
    const pp = pr(P, act.id), ep = pr(E, eid);
    const qc = w => this.hi(w) === "qclaw" && Math.random() < 0.2, qP = qc(P), qE = qc(E);   // v2.41 날쌘발톱(선제공격손톱)
    const pFirst = pp !== ep ? pp > ep : qP !== qE ? qP : this.speed(P) !== this.speed(E) ? this.speed(P) > this.speed(E) : Math.random() < 0.5;
    const qcSide = pp === ep && qP !== qE ? (qP ? "P" : "E") : null;
    const order = pFirst ? [["P", act.id], ["E", eid]] : [["E", eid], ["P", act.id]];
    const actors = { P: this.w.P, E: this.w.E };
    for (const [s, id] of order) {
      const a = this.w[s], d = this.w[this.other(s)];
      if (a !== actors[s]) continue;            // v2.11 끌려 나온·바뀌어 들어온 남켓몬은 이번 턴에 움직이지 않음
      if (a.m.hp <= 0 || d.m.hp <= 0) continue;
      a.vol.last = s === order[1][0];
      if (qcSide === s) await this.say(`${J(this.nm(s), "은")} 날쌘발톱으로\n재빨리 움직였다!`);
      await this.useMove(s, id);
      if (this.endNow) { const r = this.endNow; this.endNow = null; return r; }
      const r = await this.checkFaint(); if (r) return r === "cont" ? null : r;
    }
    return await this.endTurn();
  }
  async enemyOnly() {
    const E = this.w.E; if (E.m.hp <= 0) return null;
    E.vol.last = true;
    await this.useMove("E", this.aiMove(E));
    if (this.endNow) { const r = this.endNow; this.endNow = null; return r; }
    const r = await this.checkFaint(); if (r) return r === "cont" ? null : r;
    return await this.endTurn();
  }
  typeMul(t, d) { return this.types(d).reduce((a, x) => a * (TC[t][x] ?? 1), 1); }
  async boost(w, b, selfMove, echo) {
    for (const [k0, v] of Object.entries(b || {})) {
      const k = k0;
      if (!(k in w.stg)) continue;
      const nm = STG_N[k];
      if (v < 0 && !selfMove && this.hi(w) === "amulet") { await this.say(`${this.nm(w.side)}의 맑은노리개 덕분에\n능력이 떨어지지 않는다!`); continue; }   // v2.41
      if (v < 0 && !selfMove && w.vol.mist > 0) { await this.say(`${J(this.nm(w.side), "은")} 수호부적의 기운에\n지켜지고 있다!`); continue; }
      if (v < 0 && !selfMove && ["clearbody", "whitesmoke", "ilpyeondansim"].includes(w.m.ab)) { await this.say(`${this.nm(w.side)}의 [${AB[w.m.ab] ? AB[w.m.ab].n : "특성"}] 때문에\n능력이 떨어지지 않는다!`); continue; }
      if (v < 0 && !selfMove && ((k === "atk" && w.m.ab === "hypercutter") || (k === "def" && w.m.ab === "bigpecks") || (k === "accuracy" && w.m.ab === "keeneye"))) { await this.say(`${this.nm(w.side)}의 [${AB[w.m.ab].n}] 때문에\n${J(nm, "은")} 떨어지지 않는다!`); continue; }
      const nv = clamp(w.stg[k] + v, -6, 6);
      if (nv === w.stg[k]) { await this.say(`${this.nm(w.side)}의 ${J(nm, "은")}\n더 이상 ${v > 0 ? "오르지" : "떨어지지"} 않는다!`); continue; }
      w.stg[k] = nv; if (v > 0) w.vol.upT = this.turnNo;
      if (Save.opt.anim) { await FX.play(v > 0 ? "statup" : "statdown", { side: w.side }, { side: w.side }, v > 0 ? "노말" : "악"); }   // v2.50 오름 = 붉은 화살 · 내림 = 푸른 화살
      sfx(v > 0 ? "stat_up" : "stat_down");
      await this.say(`${this.nm(w.side)}의 ${J(nm, "이")}\n${Math.abs(v) >= 3 ? "매우 크게 " : Math.abs(v) === 2 ? "크게 " : ""}${v > 0 ? "올라갔다!" : "떨어졌다!"}`);
      if (v < 0 && !selfMove && w.m.ab === "defiant" && w.m.hp > 0) { await this.say(`${this.nm(w.side)}의 [${AB.defiant.n}]!`); await this.boost(w, { atk: 2 }, true); }
      if (v > 0 && !echo) { const o = this.w[this.other(w.side)];
        if (o && o.m.hp > 0 && o.m.ab === "simsulbo") { await this.say(`${this.nm(o.side)}의 [${AB.simsulbo.n}]!\n샘이 나서 똑같이 따라 했다!`); await this.boost(o, { [k]: v }, true, true); } }
    }
    if (w.m.hp > 0 && this.hi(w) === "wherb" && Object.values(w.stg).some(x => x < 0)) { for (const k in w.stg) if (w.stg[k] < 0) w.stg[k] = 0; await this.used(w, `${J(this.nm(w.side), "은")} 흰쑥으로\n떨어진 능력을 되돌렸다!`); }   // v2.41 흰쑥(하양허브)
  }
  canStatus(w, st, src) {
    const t = this.types(w), ab = w.m.ab;
    if (w.m.status) return false;
    if (st === "slp" && ["P", "E"].some(q => this.w[q] && this.w[q].vol.uproar)) return false;            // v2.11 소란 중엔 못 잠듦
    if (this.terrain && this.terrain.t === "misty" && this.grounded(w)) return false;                    // 미스트필드
    if (this.sc[w.side].safeguard && src !== w && !(src && src.m.ab === "infiltrator")) return false;    // 신비의부적(틈새포착은 뚫음)
    if (ab === "leafguard" && this.wx() === "sun") return false;
    if (st === "brn" && (t.includes("불꽃") || ab === "waterveil" || ab === "waterbubble")) return false;
    if ((st === "psn" || st === "tox") && (t.includes("독") || t.includes("강철") || ab === "immunity" || ab === "otchil")) return false;
    if (st === "par" && (t.includes("전기") || ab === "limber")) return false;
    if (st === "frz" && (t.includes("얼음") || ab === "magmaarmor" || this.wx() === "sun")) return false;
    if (st === "slp" && (ab === "insomnia" || ab === "vitalspirit" || ab === "sweetveil")) return false;
    return true;
  }
  statusAb(w, st) {     // 상태 이상을 막은 것이 특성이면 그 특성
    const ab = w.m.ab; if (!AB[ab]) return null;
    if (ab === "leafguard" && this.wx() === "sun") return ab;
    if (st === "brn" && ["waterveil", "waterbubble"].includes(ab)) return ab;
    if ((st === "psn" || st === "tox") && ["immunity", "otchil"].includes(ab)) return ab;
    if (st === "par" && ab === "limber") return ab;
    if (st === "frz" && ab === "magmaarmor") return ab;
    if (st === "slp" && ["insomnia", "vitalspirit", "sweetveil"].includes(ab)) return ab;
    return null;
  }
  async inflict(w, st) {
    w.m.status = st; if (st === "slp") w.m.slp = 1 + rnd(3); if (st === "tox") w.m.tox = 1;
    const n = this.nm(w.side);
    const T = { par: `${J(n, "은")} 마비되어\n기술이 나오기 어려워졌다!`, brn: `${J(n, "은")}\n화상을 입었다!`, psn: `${J(n, "은")}\n독에 걸렸다!`, tox: `${J(n, "은")}\n맹독을 입었다!`, slp: `${J(n, "은")}\n잠들어 버렸다!`, frz: `${J(n, "은")}\n얼어붙었다!` };
    FX.play({ par: "c_par", brn: "c_brn", psn: "c_psn", tox: "c_psn", slp: "c_slp", frz: "c_frz" }[st] || "status", { side: w.side }, { side: w.side }, { par: "전기", brn: "불꽃", psn: "독", tox: "독", slp: "에스퍼", frz: "얼음" }[st]);   // v2.50 상태마다 그림
    await this.say(T[st]);
    if (w.m.item) await this.eatBerry(w, "status");
  }
  async sync(w, o, st) {
    if (w.m.ab === "synchronize" && ["psn", "tox", "par", "brn"].includes(st) && o.m.hp > 0 && this.canStatus(o, st === "tox" ? "psn" : st)) { await this.say(`${this.nm(w.side)}의 [${AB.synchronize.n}]!`); await this.inflict(o, st === "tox" ? "psn" : st); }
  }
  async damage(w, n, quiet) { w.m.hp = Math.max(0, w.m.hp - n); await this.hpWait(w.side); if (w.m.hp > 0 && w.m.item) await this.eatBerry(w, "hp"); }
  async hpWait(s) { const w = this.w[s]; for (let i = 0; i < 90 && Math.abs(this.box[s].hp - w.m.hp) > 0.5; i++) await frames(1); this.box[s].hp = w.m.hp; }
  async useMove(s, id) {
    const a = this.w[s], d = this.w[this.other(s)]; const A = a.m;
    const cont = this.forced(a) === id;            // v2.11 이어 쓰는 중(충전 둘째 턴·난동·구르기·소란): PP를 또 쓰지 않음
    const brk = () => { delete a.vol.charge; delete a.vol.inv; delete a.vol.rampage; delete a.vol.rollout; delete a.vol.uproar; a.vol.fc = 0; a.vol.lastFail = true; };
    // 행동 전 상태
    if (A.status === "slp") { if ((A.slp -= (A.ab === "earlybird" || A.ab === "dongmyeon") ? 2 : 1) > 0) { await FX.play("c_slp", { side: s }, { side: s }, "에스퍼"); await this.say(`${J(this.nm(s), "은")}\n쿨쿨 잠들어 있다.`); brk(); return; } A.status = null; await this.say(`${J(this.nm(s), "은")}\n눈을 떴다!`); }
    if (A.status === "frz") { if (Math.random() < 0.2 || (MV[id] && MV[id].t === "불꽃")) { A.status = null; await this.say(`${this.nm(s)}의\n얼음이 녹았다!`); } else { await FX.play("c_frz", { side: s }, { side: s }, "얼음"); await this.say(`${J(this.nm(s), "은")} 얼어붙어서\n움직일 수 없다!`); brk(); return; } }
    if (a.vol.flinch) { await this.say(`${J(this.nm(s), "은")} 풀이 죽어서\n기술을 쓸 수 없었다!`); if (A.ab === "steadfast") { await this.say(`${this.nm(s)}의 [${AB.steadfast.n}]!`); await this.boost(a, { spe: 1 }, true); } brk(); return; }
    if (a.vol.conf) {
      a.vol.conf--;
      if (a.vol.conf <= 0) { await this.say(`${this.nm(s)}의\n혼란이 풀렸다!`); }
      else { await this.say(`${J(this.nm(s), "은")}\n혼란에 빠져 있다!`); await FX.play("c_conf", { side: s }, { side: s }, "노말");
        if (Math.random() < 1 / 3) { const dmg = this.rawDmg(a, a, 40, "P", true); if (Save.opt.anim) await FX.play("tackle", { side: s }, { side: s }, "노말"); sfx("hit"); this.spr[s].blink = 24; await this.damage(a, dmg); await this.say("영문도 모른 채\n자신을 공격했다!"); brk(); return; } }
    }
    await this.mherb(a);         // v2.41 박하잎(멘탈허브)
    if (a.vol.attract) {         // 헤롱헤롱(헤롱헤롱바디): 상대가 바뀌면 풀림
      if (d.m !== a.vol.attract) delete a.vol.attract;
      else { await FX.play("c_love", { side: s }, { side: s }, "페어리"); await this.say(`${J(this.nm(s), "은")}\n${this.nm(d.side)}에게 헤롱헤롱하다!`); if (Math.random() < 0.5) { await this.say(`${J(this.nm(s), "은")} 헤롱헤롱해서\n기술을 쓸 수 없었다!`); brk(); return; } }
    }
    if (A.status === "par" && Math.random() < 0.25) { await FX.play("c_par", { side: s }, { side: s }, "전기"); await this.say(`${J(this.nm(s), "은")} 몸이 저려서\n움직일 수 없다!`); brk(); return; }
    const why = cont ? null : this.cantUse(a, id); if (why) { await this.say(why); brk(); return; }
    const slot = A.moves.find(m => m.id === id); if (slot && !cont) slot.pp = Math.max(0, slot.pp - (d.m.ab === "pressure" ? 2 : 1));
    if (slot && slot.pp === 0 && A.item && ITEMS[A.item] && ITEMS[A.item].hold === "pp0" && !this.nervous(a)) { const it = ITEMS[A.item]; a.vol.berry = A.item; A.item = null; await this.eatMsg(a, it); slot.pp = Math.min(slot.max, 10); sfx("heal_hp");
      await this.say(`${MV[id].n}의\nPP가 회복되었다!`); }
    let mv = this.moveFor(a, id); const dab = A.ab === "moldbreaker" ? "" : d.m.ab;
    await this.say(`${this.nm(s)}의\n${mv.n}!`, { auto: 250 });
    a.vol.lastMv = id; const prevFail = a.vol.lastFail; a.vol.lastFail = true;
    if (["cband", "cspecs", "cscarf"].includes(this.hi(a)) && id !== "struggle" && !a.vol.choice) a.vol.choice = id;   // v2.41 외길: 처음 쓴 기술에 묶임
    if (id !== "furycutter") a.vol.fc = 0;
    // 모으는 기술: 첫 턴엔 모으기만(공중날기·구멍파기는 그동안 거의 맞지 않음)
    const CH = CHARGE[id];
    if (CH && !cont && !(CH.sun && this.wx() === "sun") && this.hi(a) === "pherb") {   // v2.41 산삼뿌리(파워풀허브): 모으기를 건너뜀
      await this.say(`${J(this.nm(s), "은")}\n${CH.msg}`); if (CH.up) await this.boost(a, CH.up, true);
      await this.used(a, `${J(this.nm(s), "은")} 산삼뿌리를 씹고\n단숨에 기운을 모았다!`);
    } else if (CH && !cont && !(CH.sun && this.wx() === "sun")) {
      a.vol.charge = id;
      if (CH.inv) await this.vanish(a, CH.inv); else if (Save.opt.anim) await FX.play("charge", { side: s }, { side: s }, mv.t);
      await this.say(`${J(this.nm(s), "은")}\n${CH.msg}`);
      if (CH.up) await this.boost(a, CH.up, true);
      a.vol.lastFail = false; return;
    }
    if (a.vol.charge === id) { const inv = a.vol.inv; delete a.vol.charge; delete a.vol.inv; if (inv) await this.appear(a, inv); }
    if (DOUBLES_ONLY.has(id)) { await this.say("그러나 실패하고 말았다!"); return; }
    if (BOOM.has(id)) { const dm = [a, d].find(w => w.m.hp > 0 && w.m.ab === "damp"); if (dm) { await this.say(`${this.nm(dm.side)}의 [${AB.damp.n}]!\n${J(this.nm(s), "은")} ${J(mv.n, "을")} 쓸 수 없다!`); return; } }
    if (id === "futuresight") {            // 미래예지: 2턴 뒤에 맞음
      if (this.futQ[d.side]) { await this.say("그러나 실패하고 말았다!"); return; }
      this.futQ[d.side] = { n: 3, a: { side: s, m: { lv: A.lv, st: A.st.slice(), ab: "", k: A.k, hp: 1, status: null }, stg: Object.assign({}, a.stg), vol: { types: this.types(a).slice() } } };
      await this.say(`${J(this.nm(s), "은")}\n미래를 내다보았다!`); a.vol.lastFail = false; return;
    }
    const ignP = ["phantomforce", "shadowforce", "feint"].includes(id);
    if (d.vol.protect && !SELF_TG.includes(mv.tg) && !ignP) { await this.say(`${J(this.nm(d.side), "은")}\n공격으로부터 몸을 지켰다!`); brk(); return; }
    // 공중·땅속·사라진 상대에게는 닿지 않음(몇몇 기술만 닿음)
    const selfT = SELF_TG.includes(mv.tg), wx0 = this.wx();
    const lock = a.vol.lockon && a.vol.lockon >= this.turnNo; if (!selfT) delete a.vol.lockon;
    if (!selfT && d.vol.inv && !(HIT_INV[d.vol.inv] || []).includes(id) && !lock && A.ab !== "noguard" && d.m.ab !== "noguard") { await this.say(`그러나 ${this.nm(s)}의\n공격은 빗나갔다!`); brk(); return; }
    // 명중
    const sure = (wx0 === "rain" && (id === "thunder" || id === "hurricane")) || (wx0 === "hail" && id === "blizzard");
    if (!selfT && !sure && !lock && mv.acc <= 100 && A.ab !== "noguard" && d.m.ab !== "noguard") {
      const st = clamp(a.stg.accuracy - d.stg.evasion, -6, 6);
      const base = wx0 === "sun" && (id === "thunder" || id === "hurricane") ? 50 : mv.acc;
      let acc = base * (st >= 0 ? (3 + st) / 3 : 3 / (3 - st)); if (A.ab === "compoundeyes") acc *= 1.3; if (A.ab === "hustle" && mv.c === "P") acc *= 0.8;
      if (wx0 === "fog" && !["keeneye", "unhae"].includes(A.ab)) acc *= 0.8;
      if ((wx0 === "sand" && dab === "sandveil") || (wx0 === "hail" && dab === "snowcloak")) acc *= 0.8;
      if (this.hi(a) === "wlens") acc *= 1.1;                                  // v2.41 돋보기알(광각렌즈)
      if (Math.random() * 100 >= acc) { await this.say(`그러나 ${this.nm(s)}의\n공격은 빗나갔다!`);
        if (A.hp > 0 && this.hi(a) === "bpolicy") { await this.used(a, `${J(this.nm(s), "은")} 만회부적을\n꽉 움켜쥐었다!`); await this.boost(a, { spe: 2 }, true); }   // v2.41 만회부적(실수보험)
        brk(); return; }
    }
    if (POWDER_V241.has(id) && !SELF_TG.includes(mv.tg) && (this.hi(d) === "goggles" || this.types(d).includes("풀"))) { await this.say(`${this.nm(d.side)}에게는\n효과가 없는 것 같다…`); brk(); return; }   // v2.41 가루 기술: 풀 타입·방진안경(실제 게임처럼)
    if (mv.c === "X") { a.vol.lastFail = false; await this.statusMove(a, d, id, mv); await this.chuimsae(a, mv); await this.mherb(d); return; }
    // 면역
    const im0 = { levitate: ["땅"], flashfire: ["불꽃"], waterabsorb: ["물"], voltabsorb: ["전기"], sapsipper: ["풀"], motordrive: ["전기"], lightningrod: ["전기"], stormdrain: ["물"], dryskin: ["물"] }[dab];
    const im = dab === "soundproof" && mv.snd ? [mv.t] : im0;
    let mul = id === "struggle" ? 1 : this.typeMul(mv.t, d);
    if (mul === 0 && A.ab === "scrappy" && (mv.t === "노말" || mv.t === "격투")) mul = this.types(d).filter(t => t !== "고스트").reduce((p, x) => p * (TC[mv.t][x] ?? 1), 1);
    if (mv.t === "땅" && (d.vol.magnet > 0 || this.hi(d) === "balloon")) mul = 0;   // v2.41 방패연(풍선)
    if ((im && im.includes(mv.t)) || mul === 0) {
      await this.anim(a, d, mv);
      if (im && im.includes(mv.t)) { await this.say(`${this.nm(d.side)}의 [${AB[d.m.ab].n}]!\n${this.nm(d.side)}에게는 효과가 없다!`); if (["waterabsorb", "voltabsorb", "dryskin"].includes(d.m.ab)) { d.m.hp = Math.min(d.m.st[0], d.m.hp + Math.floor(d.m.st[0] / 4)); await this.hpWait(d.side); }
        if (d.m.ab === "motordrive") await this.boost(d, { spe: 1 }, true);
        if (["lightningrod", "stormdrain"].includes(d.m.ab)) await this.boost(d, { spa: 1 }, true);
        if (d.m.ab === "sapsipper") await this.boost(d, { atk: 1 }, true);
        if (d.m.ab === "flashfire" && !d.vol.ff) { d.vol.ff = 1; await this.say(`${this.nm(d.side)}의\n불꽃의 위력이 올라갔다!`); } }
      else await this.say(`${this.nm(d.side)}에게는\n효과가 없는 것 같다…`);
      brk(); return;
    }
    // 위력이 바뀌는 기술(v2.11)
    let bp = mv.bp;
    if (id === "flail" || id === "reversal") { const p = Math.floor(48 * A.hp / A.st[0]); bp = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20; }
    if (id === "acrobatics" && !A.item) bp *= 2;
    if (id === "payback" && a.vol.last) bp *= 2;
    if (id === "avalanche" && a.vol.hurtT === this.turnNo) bp *= 2;
    if (id === "assurance" && d.vol.hurtT === this.turnNo) bp *= 2;
    if (id === "stompingtantrum" && prevFail) bp *= 2;
    if (id === "furycutter") bp = Math.min(160, 40 * 2 ** (a.vol.fc || 0));
    if (id === "rollout") bp = 30 * 2 ** (cont && a.vol.rollout ? a.vol.rollout.n : 0);
    if (id === "echoedvoice") { const e = this.echo; e.n = e.t === this.turnNo ? e.n : e.t === this.turnNo - 1 ? Math.min(5, e.n + 1) : 1; e.t = this.turnNo; bp = 40 * e.n; }
    if (id === "knockoff" && d.m.item && dab !== "stickyhold") bp *= 1.5;
    if (id === "poltergeist") { if (!d.m.item) { await this.say("그러나 실패하고 말았다!"); brk(); return; } await this.say(`${this.nm(d.side)}에게\n${J(ITEMS[d.m.item].n, "이")} 덮쳐 온다!`); }
    if ((d.vol.inv === "fly" && ["gust", "twister"].includes(id)) || (d.vol.inv === "dig" && ["earthquake", "magnitude"].includes(id))) bp *= 2;
    if (this.terrain && this.terrain.t === "grassy" && mv.t === "풀" && this.grounded(a)) bp *= 1.3;
    if (this.terrain && this.terrain.t === "grassy" && ["earthquake", "magnitude", "bulldoze"].includes(id) && this.grounded(d)) bp *= 0.5;
    if (this.terrain && this.terrain.t === "misty" && mv.t === "드래곤" && this.grounded(d)) bp *= 0.5;
    if (bp !== mv.bp) mv = Object.assign({}, mv, { bp: Math.max(1, Math.floor(bp)) });
    // 박타기: 박 속에서 무엇이 나올까
    let bak = null;
    if (id === "baktagi") { const r = Math.random(); bak = r < 0.4 ? "gold" : r < 0.8 ? "rice" : "swallow"; mv = Object.assign({}, mv, { bp: { gold: 120, rice: 60, swallow: 80 }[bak] }); }
    // 위력
    const hits = mv.hits ? (Array.isArray(mv.hits) ? (A.ab === "skilllink" ? mv.hits[1] : mv.hits[0] === 2 && mv.hits[1] === 5 ? (this.hi(a) === "dice" ? pick([4, 5]) : pick([2, 2, 3, 3, 4, 5])) : mv.hits[0]) : mv.hits) : 1;
    let total = 0, crit = false, n = 0;
    await this.anim(a, d, mv);
    for (let h = 0; h < hits && d.m.hp > 0; h++) {
      if (h > 0) await this.reFx(a, d, mv);     // v2.50 실제 게임처럼 한 번 맞을 때마다 이펙트(전엔 첫 번째만 그리고 나머지는 소리만)
      const cst = (A.ab === "superluck" ? 1 : 0) + (this.hi(a) === "scope" ? 1 : 0) + (a.vol.crit || 0) + (HIGH_CRIT.has(id) ? 1 : 0);
      const c = !["battlearmor", "shellarmor"].includes(dab) && Math.random() < [1 / 24, 1 / 8, 1 / 2, 1][Math.min(3, cst)];
      const dmg = this.calc(a, d, mv, c, mul);
      if (c) crit = true;
      sfx(mul > 1 ? "hit_super" : mul < 1 ? "hit_weak" : "hit");
      this.spr[d.side].play("hit"); this.spr[d.side].blink = 20;
      let real = Math.min(dmg, d.m.hp);
      if (dab === "disguise" && !this.disg.has(d.m.uid)) { this.disg.add(d.m.uid); real = 0; d.vol.disg = 1; }
      if (dab === "sturdy" && d.m.hp === d.m.st[0] && real >= d.m.hp) { real = d.m.hp - 1; d.vol.sturdy = 1; }
      if (id === "falseswipe" && real >= d.m.hp) real = d.m.hp - 1;                   // 칼등치기: 꼭 1 남김
      if (d.vol.endure && real >= d.m.hp && real > 0) { real = d.m.hp - 1; d.vol.endured = 1; }
      let tie = null;                                                                  // v2.41 질끈띠(기합의띠)·다짐머리띠(기합의머리띠)
      if (real >= d.m.hp && real > 0 && d.m.hp > 0) { const dh = this.hi(d); if (dh === "sash" && d.m.hp === d.m.st[0]) tie = "sash"; else if (dh === "fband" && Math.random() < 0.1) tie = "fband"; if (tie) real = d.m.hp - 1; }
      await this.damage(d, real); total += real; n++;
      if (tie === "sash") await this.used(d, `${J(this.nm(d.side), "은")}\n질끈띠로 버텼다!`); else if (tie === "fband") await this.say(`${J(this.nm(d.side), "은")}\n다짐머리띠로 버텼다!`);
      if (real > 0) d.vol.hurtT = this.turnNo;
      if (h < hits - 1) await frames(4);
    }
    if (hits > 1) await this.say(`${n}번 맞았다!`);
    if (bak) await this.say("슬근슬근 톱질이야! 박을 타 보니…\n" + { gold: "금은보화가 쏟아져 나왔다!", rice: "하얀 쌀이 쏟아져 나왔다!", swallow: "제비가 박차고 날아올랐다!" }[bak]);
    if (d.vol.disg) { d.vol.disg = 0; await this.say(`${this.nm(d.side)}의 [${AB.disguise.n}]${jp(AB.disguise.n, "이")}\n대신 맞아 주었다!`); await this.damage(d, Math.max(1, Math.floor(d.m.st[0] / 8))); await this.say(`${this.nm(d.side)}의\n탈이 벗겨졌다!`); }
    else { if (crit) await this.say("급소에 맞았다!");
      if (mul > 1) await this.say("효과가 굉장했다!"); else if (mul < 1) await this.say("효과가 별로인 듯하다…"); }
    if (d.vol.sturdy) { d.vol.sturdy = 0; await this.say(`${J(this.nm(d.side), "은")}\n[옹골참]으로 버텼다!`); }
    if (d.vol.endured) { d.vol.endured = 0; await this.say(`${J(this.nm(d.side), "은")}\n공격을 버텼다!`); }
    if (mv.drain && total) { const h = Math.max(1, Math.floor(total * mv.drain[0] / mv.drain[1] * (this.hi(a) === "broot" ? 1.3 : 1)));
      if (d.m.ab === "liquidooze") { await this.say(`${this.nm(d.side)}의 [${AB.liquidooze.n}]!`); await this.damage(a, h); await this.say(`${J(this.nm(s), "은")}\n해감액을 빨아들였다!`); }
      else { A.hp = Math.min(A.st[0], A.hp + h); await this.hpWait(s); await this.say(`${this.nm(d.side)}의\n체력을 흡수했다!`); } }
    if (id === "struggle" && total && A.hp > 0) { this.spr[s].blink = 16; sfx("hit_weak"); await this.damage(a, Math.max(1, Math.floor(A.st[0] / 4))); await this.say(`${J(this.nm(s), "은")}\n반동으로 데미지를 입었다!`); }
    if (mv.recoil && total && A.ab !== "rockhead" && A.ab !== "magicguard") { this.spr[s].blink = 16; sfx("hit_weak"); await this.damage(a, Math.max(1, Math.floor(total * mv.recoil[0] / mv.recoil[1]))); await this.say(`${J(this.nm(s), "은")}\n반동으로 데미지를 입었다!`); }
    // v2.41 지닌 도구(맞힌 뒤): 방패연 찢어짐 · 도깨비구슬 · 조개방울 · 분발부적 · 맞으면 오르는 도구
    const ha = this.hi(a), ct = mv.ct && ha !== "pads" && !(ha === "glove" && mv.punch), secBlock = d.m.ab === "shielddust" || this.hi(d) === "cloak";
    if (total && this.hi(d) === "balloon") await this.used(d, `${this.nm(d.side)}의 방패연이\n찢어지고 말았다!`);
    if (total && ha === "lorb" && A.hp > 0 && A.ab !== "magicguard") { await this.damage(a, Math.max(1, Math.floor(A.st[0] / 10))); await this.say(`${J(this.nm(s), "은")} 도깨비구슬에\n기운을 조금 빼앗겼다!`); }
    if (total && ha === "sbell" && A.hp > 0 && A.hp < A.st[0]) await this.heal(a, Math.max(1, total / 8), `${J(this.nm(s), "은")} 조개방울 소리에\nHP를 조금 회복했다!`);
    if (total && mul > 1 && d.m.hp > 0 && this.hi(d) === "wpolicy") { await this.used(d, `${this.nm(d.side)}의 분발부적이\n번쩍 빛났다!`); await this.boost(d, { atk: 2, spa: 2 }, true); }
    if (total && d.m.hp > 0 && this.hi(d) === "hitup" && ITEMS[d.m.item].hitT === mv.t) { const it = ITEMS[d.m.item]; await this.used(d, `${this.nm(d.side)}의\n${J(it.n, "이")} 반응했다!`); await this.boost(d, it.hitB, true); }
    if (total && d.m.hp > 0 && dab === "stamina") { await this.say(`${this.nm(d.side)}의 [${AB.stamina.n}]!`); await this.boost(d, { def: 1 }, true); }
    if (total && d.m.hp > 0 && dab === "steamengine" && (mv.t === "물" || mv.t === "불꽃")) { await this.say(`${this.nm(d.side)}의 [${AB.steamengine.n}]!`); await this.boost(d, { spe: 6 }, true); }
    if (total && d.m.hp > 0 && d.m.ab === "weakarmor" && mv.c === "P") { await this.say(`${this.nm(d.side)}의 [${AB.weakarmor.n}]!`); await this.boost(d, { def: -1 }, true); await this.boost(d, { spe: 2 }, true); }
    if (total && d.m.hp > 0 && d.m.ab === "justified" && mv.t === "악") { await this.say(`${this.nm(d.side)}의 [${AB.justified.n}]!`); await this.boost(d, { atk: 1 }, true); }
    if (total && A.hp > 0 && d.m.ab === "cursedbody" && !a.vol.disable && id !== "struggle" && A.ab !== "aromaveil" && Math.random() < 0.3) { a.vol.disable = { id, n: 4 }; await this.say(`${this.nm(d.side)}의 [${AB.cursedbody.n}]!\n${this.nm(s)}의 ${J(mv.n, "이")} 사슬묶기 되었다!`); }
    if (total && d.m.hp <= 0 && A.hp > 0 && d.m.ab === "honbul" && this.canStatus(a, "brn")) { await this.say(`${this.nm(d.side)}의 [${AB.honbul.n}]!\n넋불이 ${this.nm(s)}에게 옮겨붙었다!`); await this.inflict(a, "brn"); }
    if (bak === "rice" && total && A.hp > 0 && A.hp < A.st[0]) { await this.say(`${J(this.nm(s), "은")}\n쌀밥을 한 술 먹었다!`); A.hp = Math.min(A.st[0], A.hp + Math.max(1, Math.floor(A.st[0] / 4))); sfx("heal_hp"); await this.hpWait(s); await this.say(`${this.nm(s)}의 HP가\n회복되었다!`); }
    if (bak === "swallow" && total && A.hp > 0) await this.boost(a, { spe: 1 }, true);
    if (id === "eosachuldu" && total && d.m.hp > 0) await this.clearUps(d);
    if (id === "geumnawara" && total && s === "P") { this.coins += A.lv * 5; await this.say("금 나와라 뚝딱!\n돈이 와르르 쏟아졌다!"); }
    if (total && d.m.hp <= 0 && A.hp > 0 && A.ab === "moxie") { await this.say(`${this.nm(s)}의 [${AB.moxie.n}]!`); await this.boost(a, { atk: 1 }, true); }
    if (ct && total && A.hp > 0 && dab === "roughskin" && A.ab !== "magicguard") { await this.say(`${this.nm(d.side)}의 [${AB.roughskin.n}]!`); await this.damage(a, Math.max(1, Math.floor(A.st[0] / 8))); await this.say(`${J(this.nm(s), "은")}\n상처를 입었다!`); }
    if (ct && total && A.hp > 0 && this.hi(d) === "helmet" && A.ab !== "magicguard") { this.spr[s].blink = 12; await this.damage(a, Math.max(1, Math.floor(A.st[0] / 6))); await this.say(`${J(this.nm(s), "은")}\n밤송이투구에 찔렸다!`); }   // v2.41 밤송이투구(울퉁불퉁멧)
    // 접촉 특성
    if (ct && A.hp > 0 && d.m.hp > 0 && Math.random() < 0.3) {
      const st = dab === "effectspore" ? (this.types(a).includes("풀") ? null : pick(["psn", "par", "slp"])) : { static: "par", flamebody: "brn", poisonpoint: "psn", otchil: "psn" }[dab];
      if (st && this.canStatus(a, st)) { await this.say(`${this.nm(d.side)}의 [${AB[d.m.ab].n}]!`); await this.inflict(a, st); }
      else if (dab === "cutecharm" && !a.vol.attract && A.gender && d.m.gender && A.gender !== d.m.gender && !["oblivious", "aromaveil"].includes(A.ab)) { await this.say(`${this.nm(d.side)}의 [${AB.cutecharm.n}]!\n${J(this.nm(s), "은")} 헤롱헤롱해졌다!`); a.vol.attract = d.m; }
    }
    if (mv.ct && total && d.m.hp > 0 && A.ab === "poisontouch" && dab !== "shielddust" && Math.random() < 0.3 && this.canStatus(d, "psn", a)) { await this.say(`${this.nm(s)}의 [${AB.poisontouch.n}]!`); await this.inflict(d, "psn"); }
    if (ct && total && d.m.hp > 0 && A.hp > 0 && d.m.ab === "pickpocket" && !d.m.item && A.item && A.ab !== "stickyhold") await this.steal(d, a, `${this.nm(d.side)}의 [${AB.pickpocket.n}]!`);
    // 추가 효과
    if (mv.sec && A.ab !== "sheerforce") {      // v2.41 인분·도롱이(은밀망토)는 상대에게 가는 추가 효과만 막음(자기 능력 오름은 그대로, 실제 게임처럼)
      const ch = (mv.sec.ch || 100) * (A.ab === "serenegrace" ? 2 : 1);
      if (Math.random() * 100 < ch) {
        if (!secBlock && mv.sec.st && d.m.hp > 0 && this.canStatus(d, mv.sec.st, a)) { await this.inflict(d, mv.sec.st); await this.sync(d, a, mv.sec.st); }
        if (!secBlock && mv.sec.vol === "flinch" && d.m.hp > 0 && !["innerfocus", "ilpyeondansim"].includes(d.m.ab)) d.vol.flinch = true;
        if (!secBlock && mv.sec.vol === "confusion" && d.m.hp > 0 && !d.vol.conf && !["owntempo", "ilpyeondansim"].includes(d.m.ab) && !(this.terrain && this.terrain.t === "misty" && this.grounded(d))) { d.vol.conf = 2 + rnd(4); await this.say(`${J(this.nm(d.side), "은")}\n혼란에 빠졌다!`); if (d.m.item) await this.eatBerry(d, "conf"); }
        if (!secBlock && mv.sec.boosts && d.m.hp > 0) await this.boost(d, mv.sec.boosts);
        if (mv.sec.self && A.hp > 0) await this.boost(a, mv.sec.self.boosts || mv.sec.self, true);
      }
    }
    if (id === "burningjealousy" && total && d.m.hp > 0 && d.vol.upT === this.turnNo && dab !== "shielddust" && this.canStatus(d, "brn", a)) await this.inflict(d, "brn");   // 질투의불꽃: 그 턴에 능력이 오른 상대
    if (ha === "kings" && total && d.m.hp > 0 && !secBlock && !d.vol.flinch && !["innerfocus", "ilpyeondansim"].includes(dab) && Math.random() < 0.1) d.vol.flinch = true;   // v2.41 옥새조각(왕의징표석)
    if (A.ab === "stench" && total && d.m.hp > 0 && !d.vol.flinch && !["innerfocus", "ilpyeondansim"].includes(dab) && Math.random() < 0.1) d.vol.flinch = true;
    if (mv.sb && Object.keys(mv.sb).length && A.hp > 0) await this.boost(a, mv.sb, true);
    // 도구를 건드리는 기술(v2.11)
    if (total && A.hp > 0 && (id === "thief" || id === "covet") && !A.item && d.m.item) { if (dab === "stickyhold") await this.say(`${this.nm(d.side)}의 [${AB.stickyhold.n}]!\n도구를 빼앗을 수 없다!`); else await this.steal(a, d); }
    if (total && id === "knockoff" && d.m.item && d.m.hp > 0) { if (dab === "stickyhold") await this.say(`${this.nm(d.side)}의 [${AB.stickyhold.n}]!\n도구가 떨어지지 않는다!`);
      else { const it = d.m.item; if (G.party.includes(d.m)) this.restore.push([d.m, it]); d.m.item = null; await this.say(`${J(this.nm(s), "은")} ${this.nm(d.side)}의\n${J(ITEMS[it].n, "을")} 탁 쳐서 떨어뜨렸다!`); } }
    if (total && id === "incinerate" && d.m.item && ITEMS[d.m.item] && ITEMS[d.m.item].p === "berry") { const it = d.m.item; d.m.item = null; await this.say(`${this.nm(d.side)}의\n${J(ITEMS[it].n, "이")} 불타 버렸다!`); }
    if (total && A.hp > 0 && (id === "bugbite" || id === "pluck") && d.m.item && ITEMS[d.m.item] && ITEMS[d.m.item].p === "berry" && dab !== "stickyhold") {
      const it = d.m.item; d.m.item = null; await this.say(`${J(this.nm(s), "은")} ${this.nm(d.side)}의\n${J(ITEMS[it].n, "을")} 빼앗아 먹었다!`); await this.berryFx(a, it); }
    if (total && id === "clearsmog" && d.m.hp > 0 && Object.values(d.stg).some(v => v)) { for (const k in d.stg) d.stg[k] = 0; await this.say(`${this.nm(d.side)}의 능력 변화가\n원래대로 돌아왔다!`); }
    if (total && TRAP_MV.has(id) && d.m.hp > 0 && !d.vol.bind) { d.vol.bind = { n: ha === "gclaw" ? 7 : 4 + rnd(2), nm: mv.n, src: A, band: ha === "bband" }; await this.say(`${J(this.nm(d.side), "은")}\n${mv.n}에 갇혔다!`); }
    if (id === "uproar") { if (!cont) { a.vol.uproar = { id, n: 2 }; await this.say(`${J(this.nm(s), "은")}\n소란을 피우기 시작했다!`); }
      for (const w of [a, d]) if (w.m.hp > 0 && w.m.status === "slp") { w.m.status = null; w.m.slp = 0; await this.say(`${J(this.nm(w.side), "은")}\n소란 때문에 잠에서 깼다!`); } }
    // 이어 쓰는 기술 정리
    a.vol.lastFail = false;
    if (id === "furycutter") a.vol.fc = Math.min(3, (a.vol.fc || 0) + 1);
    if (RAMPAGE.has(id) && A.hp > 0) { if (!cont || !a.vol.rampage) a.vol.rampage = { id, n: 1 + rnd(2) };
      else if (--a.vol.rampage.n <= 0) { delete a.vol.rampage; if (!a.vol.conf && A.ab !== "owntempo") { a.vol.conf = 2 + rnd(4); await this.say(`${J(this.nm(s), "은")} 지쳐서\n혼란에 빠졌다!`); } } }
    if (id === "rollout") { const k = (cont && a.vol.rollout ? a.vol.rollout.n : 0) + 1; if (k >= 5) delete a.vol.rollout; else a.vol.rollout = { id, n: k }; }
    if (id === "uproar" && cont && a.vol.uproar && --a.vol.uproar.n <= 0) { delete a.vol.uproar; await this.say(`${J(this.nm(s), "은")}\n조용해졌다!`); }
    await this.chuimsae(a, mv);
    // v2.41 퇴장패(레드카드)·물림방울(탈출버튼): 맞은 뒤 바꿈 → 이 기술의 교체 효과는 없음
    if (total && d.m.hp > 0 && A.hp > 0 && this.hi(d) === "redcard" && !(this.wild && d.side === "E")) { await this.used(d, `${J(this.nm(d.side), "은")}\n퇴장패를 번쩍 들었다!`); await this.forceOut(d, a, false); return; }
    if (total && d.m.hp > 0 && this.hi(d) === "eject" && !(this.wild && d.side === "E") && (d.side === "P" ? G.party : this.foe).some((m, i) => m.hp > 0 && i !== (d.side === "P" ? this.pi : this.ei))) {
      await this.used(d, `${J(this.nm(d.side), "은")} 물림방울을 울리며\n뒤로 물러났다!`); await this.pivot(d); return; }
    // 공격하고 바뀌는 기술·끌어내는 기술
    if (FORCE_SW.has(id) && total && d.m.hp > 0 && A.hp > 0) await this.forceOut(a, d, false);
    else if (PIVOT.has(id) && total && A.hp > 0 && d.m.hp > 0) await this.pivot(a);
  }
  async chuimsae(a, mv) {    // 추임새: 소리 기술 뒤 "얼쑤!" 특공 +1
    if (mv.snd && a.m.ab === "chuimsae" && a.m.hp > 0) { await this.say(`${this.nm(a.side)}의 [${AB.chuimsae.n}]!\n"얼쑤! 좋다!"`); await this.boost(a, { spa: 1 }, true); }
    if (mv.snd && a.m.hp > 0 && this.hi(a) === "tspray") { await this.used(a, `${J(this.nm(a.side), "은")} 도라지청으로\n목을 축였다!`); await this.boost(a, { spa: 1 }, true); }   // v2.41 도라지청(목스프레이)
  }
  async reFx(a, d, mv) {
    if (!Save.opt.anim) { await frames(8); return; }
    const tp = FX.tpl && FX.tpl[mv.fx];
    await FX.play(tp && tp.dur <= 640 && !tp.self ? mv.fx : "star", { side: a.side }, { side: d.side }, mv.t);
  }
  // v2.50 공중날기·뛰어오르기·구멍파기·고스트다이브: 첫 턴엔 화면에서 사라짐(하늘로·땅속으로·스르르) → 둘째 턴에 다시 나타나며 공격
  async vanish(w, inv) {
    const sp = this.spr[w.side];
    if (Save.opt.anim) {
      if (inv === "fly") { sfx("jump"); for (let f = 1; f <= 14; f++) { sp.dy = -f * f * 0.6; await frames(1); } }
      else if (inv === "dig") { sfx("fx_quake"); for (let f = 1; f <= 16; f++) { sp.sink = f * 5; await frames(1); } }
      else { sfx("fx_ghost"); sp.blink = 24; await frames(24); }
    }
    w.vol.inv = inv; sp.dy = 0; sp.sink = 0; sp.blink = 0;
  }
  async appear(w, inv) {
    const sp = this.spr[w.side]; if (!Save.opt.anim) return;
    if (inv === "fly") { for (let f = 10; f >= 0; f--) { sp.dy = -f * f * 1.2; await frames(1); } sfx("land"); }
    else if (inv === "dig") { sfx("fx_crash"); for (let f = 12; f >= 0; f--) { sp.sink = f * 6; await frames(1); } }
    else { sp.blink = 12; await frames(12); }
    sp.dy = 0; sp.sink = 0;
  }
  async anim(a, d, mv) {
    const kind = mv.c === "P" ? "phys" : "spec";
    const p1 = this.spr[a.side].play(kind);
    await frames(mv.c === "P" ? 14 : 18);
    await FX.play(mv.fx || "star", { side: a.side }, { side: d.side }, mv.t);
    p1.then(() => {});
  }
  rawDmg(a, d, bp, cat, conf) {
    const A = cat === "P" ? this.eff(a, "atk") : this.eff(a, "spa"), D = cat === "P" ? this.eff(d, "def") : this.eff(d, "spd");
    let x = Math.floor(Math.floor(Math.floor(2 * a.m.lv / 5 + 2) * bp * A / Math.max(1, D)) / 50) + 2;
    return Math.max(1, Math.floor(x * (85 + rnd(16)) / 100));
  }
  calc(a, d, mv, crit, mul) {
    const A0 = a.m, ab = A0.ab, dab = ab === "moldbreaker" ? "" : d.m.ab, wx = this.wx();
    let bp = mv.bp;
    if (ab === "technician" && bp <= 60) bp *= 1.5;
    if (ab === "ironfist" && mv.punch) bp *= 1.2;
    if (ab === "toughclaws" && mv.ct) bp *= 1.3;
    if (ab === "strongjaw" && mv.bite) bp *= 1.5;
    if (ab === "punkrock" && mv.snd) bp *= 1.3;
    if (ab === "analytic" && a.vol.last) bp *= 1.3;
    if (ab === "waterbubble" && mv.t === "물") bp *= 2;
    if (ab === "sheerforce" && mv.sec) bp *= 1.3;
    if ({ overgrow: "풀", blaze: "불꽃", torrent: "물", swarm: "벌레" }[ab] === mv.t && A0.hp <= A0.st[0] / 3) bp *= 1.5;
    if (ab === "sandforce" && wx === "sand" && ["바위", "땅", "강철"].includes(mv.t)) bp *= 1.3;
    if (ab === "chuimsae" && mv.snd) bp *= 1.2;
    if (mv.id === "solarbeam" && wx && wx !== "sun") bp *= 0.5;
    if (mv.id === "inwol" && ["저녁", "밤"].includes(timeOfDay())) bp *= 1.5;
    if ((mv.id === "venoshock" && ["psn", "tox"].includes(d.m.status)) || (mv.id === "hex" && d.m.status) || (mv.id === "facade" && A0.status) || (mv.id === "brine" && d.m.hp * 2 <= d.m.st[0])) bp *= 2;
    if (A0.item && ITEMS[A0.item] && ITEMS[A0.item].hold === "tb" && ITEMS[A0.item].tb === mv.t) bp *= 1.2;
    const h = this.hi(a), hd = this.hi(d);   // v2.41 지닌 도구
    if ((h === "mband" && mv.c === "P") || (h === "wglass" && mv.c !== "P" && mv.c !== "X") || (h === "glove" && mv.punch)) bp *= 1.1;
    const phys = mv.c === "P", ignA = dab === "unaware", ignD = ab === "unaware" || IGN_STG.has(mv.id);
    let At = phys ? (ignA ? A0.st[1] : this.eff(a, "atk")) : (ignA ? A0.st[3] : this.eff(a, "spa"));
    let Df = phys ? (ignD ? d.m.st[2] : this.eff(d, "def")) : (ignD ? d.m.st[4] : this.eff(d, "spd"));
    if (crit) { At = Math.max(At, phys ? A0.st[1] : A0.st[3]); Df = Math.min(Df, phys ? d.m.st[2] : d.m.st[4]); }
    if ((ab === "hugepower" || ab === "purepower") && phys) At *= 2;
    if ((h === "cband" && phys) || (h === "cspecs" && !phys)) At *= 1.5;                   // v2.41 외길머리띠·외길안경
    if (hd === "vest" && !phys) Df *= 1.5;                                                  // 누비조끼
    if (hd === "evio" && canEvolveV241(d.m.k)) Df *= 1.5;                                   // 싹수돌(진화의휘석)
    if (a.vol && a.vol.ff && mv.t === "불꽃") At *= 1.5;                     // 타오르는불꽃이 켜진 뒤
    if (dab === "marvelscale" && d.m.status && phys) Df *= 1.5;               // 이상한비늘
    if (ab === "hustle" && phys) At *= 1.5;
    if (ab === "guts" && A0.status && phys) At *= 1.5;
    if (ab === "solarpower" && wx === "sun" && !phys) At *= 1.5;
    if (wx === "sand" && !phys && this.types(d).includes("바위")) Df *= 1.5;
    if (dab === "thickfat" && (mv.t === "불꽃" || mv.t === "얼음")) At *= 0.5;
    if ((dab === "heatproof" || dab === "waterbubble") && mv.t === "불꽃") At *= 0.5;
    let x = Math.floor(Math.floor(Math.floor(2 * A0.lv / 5 + 2) * bp * At / Math.max(1, Df)) / 50) + 2;
    const umb = h === "umbrella" || hd === "umbrella";                                    // v2.41 지우산(만능우산)
    if (wx === "rain" && !umb) x *= mv.t === "물" ? 1.5 : mv.t === "불꽃" ? 0.5 : 1;
    if (wx === "sun" && !umb) x *= mv.t === "불꽃" ? 1.5 : mv.t === "물" ? 0.5 : 1;
    if (crit) x *= ab === "sniper" ? 2.25 : 1.5;
    x = Math.floor(x * (85 + rnd(16)) / 100);
    if (this.types(a).includes(mv.t)) x *= ab === "adaptability" ? 2 : 1.5;
    x *= mul;
    if (h === "ebelt" && mul > 1) x *= 1.2;                                                 // v2.41 명인띠(달인의띠)
    if (h === "lorb") x *= 1.3;                                                             // 도깨비구슬(생명의구슬)
    if (ab === "tintedlens" && mul < 1) x *= 2;
    if ((dab === "filter" || dab === "solidrock") && mul > 1) x *= 0.75;
    if (dab === "dryskin" && mv.t === "불꽃") x *= 1.25;
    if (dab === "punkrock" && mv.snd) x *= 0.5;
    if (A0.status === "brn" && phys && ab !== "guts") x *= 0.5;
    if (dab === "multiscale" && d.m.hp === d.m.st[0]) x *= 0.5;
    { const SC = this.sc[d.side]; if (!crit && ab !== "infiltrator" && ((phys && SC.reflect) || (!phys && SC.lightscreen))) x *= 0.5; }   // 리플렉터·빛의장막
    if (ab === "stakeout" && d.inT && d.inT === this.turnNo) x *= 2;          // 잠복: 이번 턴에 바뀌어 나온 상대
    return Math.max(1, Math.floor(x));
  }
  async statusMove(a, d, id, mv, bounced) {
    const s = a.side; const selfT = SELF_TG.includes(mv.tg);
    if (!bounced && ["normal", "adjacentFoe", "allAdjacentFoes", "any", "randomNormal"].includes(mv.tg) && d.m.ab === "magicbounce" && a.m.ab !== "moldbreaker" && d.m.hp > 0) {
      await this.say(`${this.nm(d.side)}의 [${AB.magicbounce.n}]!\n${J(mv.n, "을")} 되받아쳤다!`); return this.statusMove(d, a, id, mv, true); }
    const fxp = FX.play(mv.fx || "status", { side: s }, { side: selfT || ["allyTeam", "adjacentAlly"].includes(mv.tg) ? s : d.side }, mv.t);   // v2.50 치료방울처럼 우리 편 기술은 내 쪽에
    await this.spr[s].play("spec"); await fxp;
    let did = false;
    if (WX_MV[id]) { await this.setWx(WX_MV[id], undefined, a); return; }
    if (["synthesis", "moonlight", "morningsun"].includes(id)) { const wx = this.wx(), f = wx === "sun" ? 2 / 3 : wx ? 1 / 4 : 1 / 2;
      if (a.m.hp >= a.m.st[0]) { await this.say(`${this.nm(s)}의 HP는\n가득 차 있다!`); return; }
      a.m.hp = Math.min(a.m.st[0], a.m.hp + Math.max(1, Math.floor(a.m.st[0] * f))); sfx("heal_hp"); await this.hpWait(s); await this.say(`${J(this.nm(s), "은")}\n체력을 회복했다!`); return; }
    if (id === "defog") { if (this.weather === "fog") { this.weather = null; this.wperm = false; FX.setWeather(null); await this.say("강한 바람에\n안개가 걷혔다!"); }
      await this.boost(d, { evasion: -1 }); return; }
    if (id === "protect" || id === "detect" || id === "endure") { if (a.vol.lastProt && Math.random() < 0.5) { a.vol.lastProt = false; await this.say("그러나 실패하고 말았다!"); return; } a.vol.lastProt = true;
      if (id === "endure") { a.vol.endure = true; await this.say(`${J(this.nm(s), "은")}\n버티기 태세에 들어갔다!`); return; }
      a.vol.protect = true; await this.say(`${J(this.nm(s), "은")}\n방어 태세에 들어갔다!`); return; }
    a.vol.lastProt = false;
    if (await this.statusSpecial(a, d, id, mv)) return;
    if (["supersonic", "confuseray", "sweetkiss", "teeterdance"].includes(id)) { if (d.vol.conf || ["owntempo", "ilpyeondansim"].includes(d.m.ab) || (this.terrain && this.terrain.t === "misty" && this.grounded(d))) { await this.say("그러나 실패하고 말았다!"); return; } d.vol.conf = 2 + rnd(4); await this.say(`${J(this.nm(d.side), "은")}\n혼란에 빠졌다!`); if (d.m.item) await this.eatBerry(d, "conf"); return; }
    if (id === "leechseed") { if (this.types(d).includes("풀") || d.vol.seed) { await this.say("그러나 실패하고 말았다!"); return; } d.vol.seed = true; await this.say(`${this.nm(d.side)}에게\n씨앗을 심었다!`); return; }
    if (id === "rest") { if (a.m.hp === a.m.st[0]) { await this.say("그러나 실패하고 말았다!"); return; } a.m.status = "slp"; a.m.slp = 3; a.m.hp = a.m.st[0]; await this.hpWait(s); await this.say(`${J(this.nm(s), "은")} 잠들어서\n건강해졌다!`); return; }
    if (id === "haze") { for (const w of [a, d]) for (const k in w.stg) w.stg[k] = 0; await this.say("모든 능력 변화가\n원래대로 돌아왔다!"); return; }
    if (mv.st) {
      if (mv.pw && this.types(d).includes("풀")) { await this.say(`${this.nm(d.side)}에게는\n효과가 없는 것 같다…`); return; }
      if (mv.st === "par" && mv.t === "전기" && this.types(d).includes("땅")) { await this.say(`${this.nm(d.side)}에게는\n효과가 없는 것 같다…`); return; }
      if (!this.canStatus(d, mv.st, a)) { const bab = !d.m.status && this.statusAb(d, mv.st);
        const sg = !d.m.status && this.sc[d.side].safeguard && a.m.ab !== "infiltrator", mist = !d.m.status && this.terrain && this.terrain.t === "misty" && this.grounded(d);
        await this.say(d.m.status ? `${J(this.nm(d.side), "은")} 이미\n${STATUS[d.m.status][0]} 상태다!` : sg ? `${J(this.nm(d.side), "은")}\n신비의 베일에 지켜지고 있다!` : mist ? `${J(this.nm(d.side), "은")}\n미스트필드에 지켜지고 있다!` : bab ? `${this.nm(d.side)}의 [${AB[bab].n}]!\n` + { par: "마비되지 않는다!", brn: "화상을 입지 않는다!", psn: "독에 걸리지 않는다!", tox: "독에 걸리지 않는다!", slp: "잠들지 않는다!", frz: "얼지 않는다!" }[mv.st] : "그러나 실패하고 말았다!"); return; }
      await this.inflict(d, mv.st); did = true; await this.sync(d, a, mv.st);
    }
    if (mv.heal) { if (a.m.hp >= a.m.st[0]) { await this.say(`${this.nm(s)}의 HP는\n가득 차 있다!`); } else { a.m.hp = Math.min(a.m.st[0], a.m.hp + Math.floor(a.m.st[0] * mv.heal[0] / mv.heal[1])); sfx("heal_hp"); await this.hpWait(s); await this.say(`${J(this.nm(s), "은")}\n체력을 회복했다!`); } did = true; if (id === "roost") a.vol.roost = this.turnNo; }
    if (mv.b && Object.keys(mv.b).length) { await this.boost(selfT ? a : d, mv.b, selfT); did = true; }
    if (mv.sb && Object.keys(mv.sb).length) { await this.boost(a, mv.sb, true); did = true; }
    if (!did) await this.say("그러나 아무 일도\n일어나지 않았다!");
  }
  // ---- 턴 끝 ----
  async endTurn() {
    for (const s of ["P", "E"]) {
      const w = this.w[s]; if (!w || w.m.hp <= 0) continue;
      const M = w.m, wxe = this.wx();
      if (wxe === "sand" || wxe === "hail") { const T = this.types(w);
        if (wxe === "hail" && M.ab === "icebody") { if (M.hp < M.st[0]) { await this.say(`${this.nm(s)}의 [${AB.icebody.n}]!\n싸라기눈을 맞으며 기운을 낸다!`); M.hp = Math.min(M.st[0], M.hp + Math.max(1, Math.floor(M.st[0] / 16))); sfx("heal_hp"); await this.hpWait(s); await this.say(`${this.nm(s)}의 HP가\n조금 회복되었다!`); } }
        else if (this.hi(w) !== "goggles" && !(wxe === "sand" ? (T.some(t => ["바위", "땅", "강철"].includes(t)) || ["sandveil", "sandforce", "sandrush", "overcoat", "magicguard"].includes(M.ab))
                                  : (T.includes("얼음") || ["snowcloak", "slushrush", "overcoat", "magicguard"].includes(M.ab)))) {
          this.spr[s].blink = 12; await this.damage(w, Math.max(1, Math.floor(M.st[0] / 16))); await this.say(`${WX[wxe].hurt} ${J(this.nm(s), "을")}\n덮쳤다!`);
          const r0 = await this.checkFaint(); if (r0) return r0 === "cont" ? null : r0; if (M.hp <= 0) continue; } }
      if (M.status === "brn" && M.ab !== "magicguard") { await FX.play("c_brn", { side: s }, { side: s }, "불꽃"); await this.damage(w, Math.max(1, Math.floor(M.st[0] / 16))); await this.say(`${J(this.nm(s), "은")}\n화상 데미지를 입었다!`); }
      if ((M.status === "psn" || M.status === "tox") && M.ab !== "magicguard") {
        await FX.play("c_psn", { side: s }, { side: s }, "독");
        const n = M.status === "tox" ? Math.max(1, Math.floor(M.st[0] * Math.min(15, M.tox++) / 16)) : Math.max(1, Math.floor(M.st[0] / 8));
        await this.damage(w, n); await this.say(`${J(this.nm(s), "은")}\n독에 의한 데미지를 입었다!`);
      }
      if (w.vol.seed && M.hp > 0) { const o = this.w[this.other(s)]; const n = Math.max(1, Math.floor(M.st[0] / 8)); await FX.play("drain", { side: o.side }, { side: s }, "풀"); await this.damage(w, n);
        if (o.m.hp > 0) { o.m.hp = Math.min(o.m.st[0], o.m.hp + n); await this.hpWait(o.side); } await this.say(`씨뿌리기가\n${this.nm(s)}의 체력을 빼앗는다!`); }
      const wx = this.wx();
      if (M.hp > 0 && M.status && ((M.ab === "shedskin" && Math.random() < 1 / 3) || (M.ab === "hydration" && wx === "rain"))) { M.status = null; M.tox = 0; await this.say(`${this.nm(s)}의 [${AB[M.ab].n}]!\n상태 이상이 나았다!`); }
      if (M.hp > 0 && M.hp < M.st[0] && (M.ab === "raindish" || M.ab === "dryskin") && wx === "rain") { await this.say(`${this.nm(s)}의 [${AB[M.ab].n}]!\n빗물을 머금었다!`); M.hp = Math.min(M.st[0], M.hp + Math.max(1, Math.floor(M.st[0] / (M.ab === "dryskin" ? 8 : 16)))); sfx("heal_hp"); await this.hpWait(s); await this.say(`${this.nm(s)}의 HP가\n회복되었다!`); }
      if (M.hp > 0 && M.ab === "dryskin" && wx === "sun") { await this.say(`${this.nm(s)}의 [${AB.dryskin.n}]!\n햇볕에 피부가 말랐다!`); await this.damage(w, Math.max(1, Math.floor(M.st[0] / 8))); }
      if (M.hp > 0 && M.ab === "solarpower" && wx === "sun") { await this.say(`${this.nm(s)}의 [${AB.solarpower.n}]!\n뜨거운 햇볕에 체력이 깎인다!`); await this.damage(w, Math.max(1, Math.floor(M.st[0] / 8))); }
      if (M.hp > 0 && M.hp < M.st[0] && M.ab === "hwasubun") { await this.say(`${this.nm(s)}의 [${AB.hwasubun.n}]!\n박에서 쌀이 다시 차올랐다!`); M.hp = Math.min(M.st[0], M.hp + Math.max(1, Math.floor(M.st[0] / 16))); sfx("heal_hp"); await this.hpWait(s); await this.say(`${this.nm(s)}의 HP가\n조금 회복되었다!`); }
      // v2.11 저주·조이기·아쿠아링·뿌리박기·그래스필드·하품·수확
      if (M.hp > 0 && w.vol.curse && M.ab !== "magicguard") { this.spr[s].blink = 12; await this.damage(w, Math.max(1, Math.floor(M.st[0] / 4))); await this.say(`${J(this.nm(s), "은")}\n저주를 받고 있다!`); }
      if (M.hp > 0 && w.vol.bind) { const b = w.vol.bind, o = this.w[this.other(s)];
        if (b.n <= 0 || !o || o.m !== b.src || o.m.hp <= 0) { delete w.vol.bind; await this.say(`${J(this.nm(s), "은")}\n${b.nm}에서 풀려났다!`); }
        else { b.n--; if (M.ab !== "magicguard") { this.spr[s].blink = 12; await this.damage(w, Math.max(1, Math.floor(M.st[0] / (b.band ? 6 : 8)))); await this.say(`${J(this.nm(s), "은")}\n${b.nm}의 데미지를 입고 있다!`); } } }
      if (M.hp > 0 && M.hp < M.st[0] && (w.vol.aquaring || w.vol.ingrain)) await this.heal(w, M.st[0] / 16 * (this.hi(w) === "broot" ? 1.3 : 1), `${J(this.nm(s), "은")} ` + (w.vol.ingrain ? "뿌리로\n양분을 빨아들였다!" : "아쿠아링으로\nHP를 회복했다!"));
      if (M.hp > 0 && M.hp < M.st[0] && this.terrain && this.terrain.t === "grassy" && this.grounded(w)) await this.heal(w, M.st[0] / 16, `${J(this.nm(s), "은")}\n그래스필드로 HP를 회복했다!`);
      if (M.hp > 0 && w.vol.yawn && --w.vol.yawn <= 0) { delete w.vol.yawn; if (this.canStatus(w, "slp")) await this.inflict(w, "slp"); }
      if (M.hp > 0 && M.ab === "harvest" && !M.item && w.vol.berry && (wx === "sun" || Math.random() < 0.5)) { M.item = w.vol.berry; delete w.vol.berry; await this.say(`${this.nm(s)}의 [${AB.harvest.n}]!\n${J(ITEMS[M.item].n, "을")} 수확했다!`); }
      if (M.hp > 0 && M.hp < M.st[0] && M.ab === "dongmyeon" && M.status === "slp") { await this.say(`${this.nm(s)}의 [${AB.dongmyeon.n}]!\n겨울잠을 자며 기운을 모은다!`); M.hp = Math.min(M.st[0], M.hp + Math.max(1, Math.floor(M.st[0] / 8))); sfx("heal_hp"); await this.hpWait(s); await this.say(`${this.nm(s)}의 HP가\n회복되었다!`); }
      const r = await this.checkFaint(); if (r) return r === "cont" ? null : r;
    }
    for (const s of ["P", "E"]) { const w = this.w[s]; if (!w || w.m.hp <= 0) continue; const M = w.m;
      { const h = this.hi(w);   // v2.41 검은뻘(검은진흙) · 불씨구슬·독구슬(화염구슬·맹독구슬)
        if (h === "sludge" && this.types(w).includes("독")) await this.heal(w, M.st[0] / 16, `${J(this.nm(s), "은")} 검은뻘로\nHP를 조금 회복했다!`);
        else if (h === "sludge" && M.ab !== "magicguard") { this.spr[s].blink = 12; await this.damage(w, Math.max(1, Math.floor(M.st[0] / 8))); await this.say(`${J(this.nm(s), "은")}\n검은뻘 때문에 데미지를 입었다!`); const r = await this.checkFaint(); if (r) return r === "cont" ? null : r; if (M.hp <= 0) continue; }
        if ((h === "forb" || h === "torb") && this.canStatus(w, h === "forb" ? "brn" : "tox")) { await this.say(`${this.nm(s)}의 ${h === "forb" ? "불씨구슬이\n확 타올랐다!" : "독구슬에서\n독 기운이 퍼졌다!"}`); await this.inflict(w, h === "forb" ? "brn" : "tox"); } }
      if (M.item && ITEMS[M.item] && ITEMS[M.item].hold === "left" && M.hp < M.st[0]) { await this.eatMsg(w, ITEMS[M.item], true); M.hp = Math.min(M.st[0], M.hp + Math.max(1, Math.floor(M.st[0] / 16))); sfx("heal_hp"); await this.hpWait(s); await this.say(`${this.nm(s)}의 HP가\n조금 회복되었다!`); }
      if (w.vol.mist > 0 && --w.vol.mist === 0) await this.say(`${this.nm(s)}의\n수호부적의 기운이 사라졌다!`);
      if (w.vol.taunt && --w.vol.taunt <= 0) { delete w.vol.taunt; await this.say(`${this.nm(s)}의\n도발 효과가 풀렸다!`); }
      if (w.vol.disable && --w.vol.disable.n <= 0) { delete w.vol.disable; await this.say(`${this.nm(s)}의\n사슬묶기가 풀렸다!`); }
      if (w.vol.magnet > 0 && --w.vol.magnet === 0) await this.say(`${this.nm(s)}의\n전자부유가 끝났다!`); }
    // v2.11 희망사항·미래예지·편 상태·필드
    for (const s of ["P", "E"]) { const q = this.wishQ[s]; if (q && --q.n <= 0) { delete this.wishQ[s]; const w = this.w[s]; if (w && w.m.hp > 0 && w.m.hp < w.m.st[0]) { await this.say(`${q.who}의\n희망사항이 이루어졌다!`); await this.heal(w, q.hp); } } }
    for (const s of ["P", "E"]) { const f = this.futQ[s]; if (f && --f.n <= 0) { delete this.futQ[s]; const w = this.w[s];
      if (w && w.m.hp > 0) { await this.say(`${J(this.nm(s), "은")}\n미래예지 공격을 받았다!`); const mul = this.typeMul("에스퍼", w);
        if (!mul) await this.say(`${this.nm(s)}에게는\n효과가 없는 것 같다…`);
        else { this.spr[s].play("hit"); this.spr[s].blink = 20; sfx(mul > 1 ? "hit_super" : "hit"); await this.damage(w, Math.min(w.m.hp, this.calc(f.a, w, MV.futuresight, false, mul))); }
        const r = await this.checkFaint(); if (r) return r === "cont" ? null : r; } } }
    for (const s of ["P", "E"]) { const S = this.sc[s];
      for (const [k, t] of [["reflect", "리플렉터"], ["lightscreen", "빛의장막"], ["safeguard", "신비의 베일"], ["tailwind", "순풍"]]) if (S[k] && --S[k] <= 0) { delete S[k]; await this.say(`${SIDE_NM(s)}의\n${J(t, "이")} 사라졌다!`); } }
    if (this.terrain && --this.terrain.n <= 0) { const t = this.terrain.t; this.terrain = null; await this.say(t === "grassy" ? "발밑의 풀이\n사라졌다!" : "발밑의 안개가\n걷혔다!"); }
    if (this.weather && !this.wperm && --this.wturns <= 0) { const was = this.weather; this.weather = null; FX.setWeather(null); await this.say(WX[was].end); }
    return null;
  }
  // ---- 쓰러짐 ----
  async faintAnim(s) {
    const w = this.w[s]; const sp = this.spr[s];
    Audio2.cry(w.m.k, { faint: true }); sfx("faint");
    await sp.play("faint");
    for (let i = 1; i <= 16; i++) { sp.sink = i * 5; await frames(1); }
    sp.vis = false; sp.sink = 0;
    this.box[s].vis = false;
    await this.say(`${J(this.nm(s), "은")}\n쓰러졌다!`);
    if (w.m.ab === "boeun") { this.boeun[s] = true; await this.say(`${this.nm(s)}의 [${AB.boeun.n}]!\n다음 동료에게 박씨를 남겼다!`); }
    w.vol = {}; for (const k in w.stg) w.stg[k] = 0; w.m.status = null;
  }
  async checkFaint() {
    const E = this.w.E, P = this.w.P;
    if (E.m.hp <= 0 && !E.done) {
      E.done = true; await this.faintAnim("E");
      const next = this.foe.findIndex(m => m.hp > 0);
      if (next < 0) bgm(this.wild ? "victory_wild" : "victory");
      if (P.m.tfSave) { this.untf(P.m); this.spr.P.set(P.m.k, P.m.shiny); }
      if (!this.o.noExp) await this.giveExp(E.m);       // v2.52 배틀누각: 경험치 없음
      if (next < 0) return "win";
      if (P.m.hp > 0) {
        const nm = MON[this.foe[next].k].n;
        if (Save.opt.style === 0 && !this.o.setStyle && G.party.filter(m => m.hp > 0).length > 1) {   // v2.52 배틀누각은 실제 배틀타워처럼 늘 '토너먼트'(교체 묻지 않음)
          const c = await ask(`${this.o.trainer.cls} ${J(this.o.trainer.name, "은")} ${J(nm, "을")}\n내보내려 한다. 남켓몬을 바꾸겠습니까?`);
          if (c === 0) { const i = await openParty("battle_switch"); if (i != null && i >= 0 && i !== this.pi && G.party[i].hp > 0) await this.switchIn("P", i); }
        }
      }
      await this.sendOut("E", next, false);
      if (P.m.hp > 0) return "cont";
    }
    if (P.m.hp <= 0 && !P.done) {
      P.done = true; await this.faintAnim("P");
      if (!G.party.some(m => m.hp > 0)) return "lose";
      if (this.wild) {
        const c = await ask("다음 남켓몬을 쓰겠습니까?");
        if (c === 1) { const ps = 1, es = 0; const ok = Math.random() < 0.6; if (ok) { sfx("run"); await this.say("무사히 도망쳤다!"); return "run"; } await this.say("도망칠 수 없었다!"); }
      }
      let i = -1;
      while (i < 0 || G.party[i].hp <= 0) { i = await openParty("battle_forced"); if (i == null) i = -1; }
      await this.sendOut("P", i, false);
      return "cont";
    }
    return null;
  }
  async switchIn(s, i) {
    const cur = this.w.P;
    if (cur && cur.m.hp > 0) {
      await this.say(`돌아와, ${mname(cur.m)}!`, { auto: 300 });
      if (cur.m.abT) { cur.m.ab = cur.m.abT; delete cur.m.abT; }
      if (cur.m.ab === "naturalcure") cur.m.status = null;
      if (cur.m.ab === "regenerator") cur.m.hp = Math.min(cur.m.st[0], cur.m.hp + Math.floor(cur.m.st[0] / 3));
      this.box.P.vis = false;
      await this.withdraw("P");
    }
    await this.sendOut("P", i, false);
  }
  // ---- 경험치·레벨업 ----
  async giveExp(foe) {
    const sp = MON[(foe.tfSave || foe).k]; const tr = this.wild ? 1 : 1.5;
    const base = Math.floor(sp.by * foe.lv / 7 * tr);
    const parts = G.party.filter(m => m.hp > 0 && this.part.has(m.uid));
    const share = G.flag("expshare_on") && G.has("expshare");
    const list = [];
    for (const m of G.party) {
      if (m.hp <= 0 || m.lv >= 100) continue;
      if (this.part.has(m.uid)) list.push([m, Math.max(1, Math.floor(base / Math.max(1, parts.length)))]);
      else if (share) list.push([m, Math.max(1, Math.floor(base / 2))]);
    }
    // 노력치: 상대 종족값이 가장 높은 능력 +1
    const hi = sp.s.indexOf(Math.max(...sp.s));
    for (const [m, n] of list) {
      m.ev[hi] = Math.min(252, m.ev[hi] + 1);
      await this.say(`${J(mname(m), "은")}\n경험치를 ${n} 얻었다!`);
      await this.addExp(m, n);
    }
    this.part = new Set([this.w.P.m.uid]);
  }
  async addExp(m, n) {
    const sp = MON[m.k]; const active = this.w.P && this.w.P.m === m;
    let target = m.exp + n;
    while (true) {
      const next = expAt(sp.gr, m.lv + 1);
      const to = Math.min(target, next);
      if (active) { sfx("exp"); const st = this.box.P.exp ?? m.exp; for (let i = 1; i <= 24; i++) { this.box.P.exp = st + (to - st) * i / 24; await frames(1); } }
      m.exp = to;
      if (to >= next && m.lv < 100) { await this.levelUp(m); if (active) this.box.P.exp = m.exp; continue; }
      break;
    }
    if (active) this.box.P.exp = m.exp;
  }
  async levelUp(m) {
    const old = m.st.slice(); m.lv++; const hpGain = 0; frLevel(m);
    m.st = calcStats(m); m.hp = Math.min(m.st[0], m.hp + (m.st[0] - old[0]));
    this.leveled.add(m.uid);
    if (this.w.P && this.w.P.m === m) this.box.P.hp = m.hp;
    Audio2.jingle("jg_levelup");
    await this.say(`${J(mname(m), "은")}\n레벨 ${J(String(m.lv), "으로")} 올랐다!`, { wait: true });
    await statWindow(old, m.st);
    await learnAtLevel(m, (t, o) => this.say(t, Object.assign({ wait: true }, o)));
  }
  // ---- 도구·포획 ----
  async useItem(act) {
    const it = ITEMS[act.item]; const m = G.party[act.target];
    G.take(act.item);
    await this.say(`${J(G.name, "은")}\n${J(it.n, "을")} 사용했다!`, { auto: 300 });
    const P = this.w.P;
    if (it.xs) { await this.boost(P, it.xs, true); return; }                       // 부적: 능력 1단계
    if (it.crit) { if ((P.vol.crit || 0) >= 2) { await this.say("그러나 아무 일도 일어나지 않았다!"); return; }
      P.vol.crit = (P.vol.crit || 0) + it.crit; if (Save.opt.anim) await FX.play("aura", { side: "P" }, { side: "P" }, "격투"); sfx("stat_up"); await this.say(`${J(this.nm("P"), "은")}\n급소를 노리기 쉬워졌다!`); return; }
    if (it.mist) { if (P.vol.mist > 0) { await this.say("그러나 아무 일도 일어나지 않았다!"); return; }
      P.vol.mist = 5; if (Save.opt.anim) await FX.play("shield", { side: "P" }, { side: "P" }, "얼음"); sfx("stat_up"); await this.say(`${J(this.nm("P"), "은")}\n수호부적의 기운에 둘러싸였다!`); return; }
    if (P && P.m === m && Save.opt.anim && (it.heal || it.hpPct || it.cure || it.pp || it.full)) await FX.play("heal", { side: "P" }, { side: "P" }, "노말");   // v2.50 상처약·해독제 등: 실제 게임처럼 반짝임
    const res = applyItem(act.item, m, act.move);
    if (P && P.m === m) await this.hpWait("P");
    await this.say(res);
  }
  // ---- 지니는 도구 ----
  async eatBerry(w, why) {
    const M = w.m, id = M.item, it = ITEMS[id]; if (!it || M.hp <= 0) return false;
    if (it.p === "berry" && this.nervous(w)) return false;        // v2.11 긴장감
    const n = this.nm(w.side);
    if (why === "hp" && it.hold === "hp50" && M.hp <= M.st[0] / 2 && M.hp < M.st[0]) {
      const h = Math.min(M.st[0] - M.hp, it.hpPct ? Math.max(1, Math.floor(M.st[0] * it.hpPct)) : it.heal);
      M.item = null; w.vol.berry = id; await this.eatMsg(w, it); M.hp = Math.min(M.st[0], M.hp + h); sfx("heal_hp"); await this.hpWait(w.side); await this.say(`${n}의 HP가\n회복되었다!`); await this.pouch(w); return true; }
    if (why === "status" && it.hold === "status" && M.status && (it.cure === "all" || it.cure.includes(M.status))) {
      const st0 = M.status; M.item = null; w.vol.berry = id; await this.eatMsg(w, it); M.status = null; M.slp = 0; M.tox = 0; sfx("heal_hp");
      await this.say(`${n}의\n` + ({ par: "마비가 풀렸다!", brn: "화상이 나았다!", psn: "독이 사라졌다!", tox: "독이 사라졌다!", slp: "잠에서 깨어났다!", frz: "얼음이 녹았다!" }[st0] || "상태 이상이 나았다!")); await this.pouch(w); return true; }
    if (why === "conf" && w.vol.conf && (it.hold === "conf" || (it.hold === "status" && it.conf))) {
      M.item = null; w.vol.berry = id; await this.eatMsg(w, it); w.vol.conf = 0; sfx("heal_hp"); await this.say(`${n}의\n혼란이 풀렸다!`); await this.pouch(w); return true; }
    return false;
  }
  async pouch(w) {
    const M = w.m; if (M.ab !== "cheekpouch" || M.hp <= 0 || M.hp >= M.st[0]) return;
    await this.say(`${this.nm(w.side)}의 [${AB.cheekpouch.n}]!\n볼 주머니에 남은 걸 먹었다!`);
    M.hp = Math.min(M.st[0], M.hp + Math.max(1, Math.floor(M.st[0] / 3))); sfx("heal_hp"); await this.hpWait(w.side);
    await this.say(`${this.nm(w.side)}의 HP가\n더 회복되었다!`);
  }
  async throwCatch(id) {
    const it = ITEMS[id]; G.take(id);
    const E = this.w.E, M = E.m, sp = MON[(M.tfSave || M).k];
    await this.say(`${J(G.name, "은")}\n${J(it.n, "을")} 던졌다!`, { auto: 200 });
    // 던지기
    sfx("ball_throw");
    const b = { x: 40, y: 120, type: id, fr: "spin0" }; this.balls.push(b);
    const tx = 190, ty = 62;
    for (let i = 1; i <= 26; i++) { const t = i / 26; b.x = 40 + (tx - 40) * t; b.y = 120 + (ty - 120) * t - Math.sin(t * Math.PI) * 50; b.fr = "spin" + (i % 4); await frames(1); }
    b.fr = "open"; sfx("ball_open"); this.flash("#ffffff", 120, 0.4);
    const s = this.spr.E;
    for (let i = 1; i <= 12; i++) { s.red = i / 12; s.scale = 1 - i / 12; s.dy = -10 * i / 12; await frames(1); }
    s.vis = false; s.red = 0; s.scale = 1; s.dy = 0;
    b.fr = "closed"; await frames(6);
    for (let i = 1; i <= 12; i++) { b.y = ty + (88 - ty) * (i / 12) ** 2; await frames(1); }
    sfx("ball_shake"); for (let i = 0; i < 4; i++) { b.y = 88 - [5, 3, 1, 0][i]; await frames(3); } b.y = 88;
    await frames(20);
    // 포획 판정 (3·4세대식)
    const st = { slp: 2, frz: 2, par: 1.5, psn: 1.5, tox: 1.5, brn: 1.5 }[M.status] || 1;
    const T = sp.t, night = timeOfDay() === "밤" || !!(World.def && World.def.cave);
    const bm = { net: T.includes("물") || T.includes("벌레") ? 3 : 1, dusk: night ? 3.5 : 1, quick: (this.turnNo || 0) <= 1 ? 4 : 1,
                 timer: Math.min(4, ((this.turnNo || 0) + 10) / 10), repeat: G.caught[M.k] ? 3 : 1, nest: Math.max(1, (40 - M.lv) / 10) }[it.bk] || it.ball;
    const a = Math.floor((3 * M.st[0] - 2 * M.hp) * sp.cr * bm / (3 * M.st[0]) * st);
    let shakes = 0;
    if (a >= 255) shakes = 4; else { const bb = Math.floor(1048560 / Math.sqrt(Math.sqrt(16711680 / Math.max(1, a)))); while (shakes < 4 && rnd(65536) < bb) shakes++; }
    for (let i = 0; i < Math.min(3, shakes); i++) {
      for (const f of ["tilt_l", "closed", "tilt_r", "closed"]) { b.fr = f; if (f !== "closed") sfx("ball_shake"); await frames(6); }
      await frames(24);
    }
    if (shakes >= 4) {
      sfx("ball_click"); b.fr = "dim";
      for (let i = 0; i < 3; i++) { await FX.play("star", { side: "E" }, { side: "E" }, "전기"); }
      this.box.E.vis = false; this.untf(M);
      Audio2.stop();
      const tb = await say(`신난다!\n${J(mname(M), "을")} 잡았다!`, { dark: true, x: 0, y: 144, w: 256, h: 48, keep: true });
      await Audio2.jingle("jg_caught"); Scenes.pop(tb);
      M.ball = id; M.met = World.zone || "용성지방"; M.metLv = M.lv;
      if (it.bk === "heal") { M.hp = M.st[0]; M.status = null; M.slp = 0; for (const x of M.moves) x.pp = x.max; }
      const isNew = !G.caught[M.k];
      if (isNew && G.flag("dex")) { await this.say(`${MON[M.k].n}의 데이터가\n새로 도감에 등록됩니다!`, { wait: true }); await showDexEntry(M.k, true); }
      M.status = M.status; this.balls = [];
      await nicknamePrompt(M, (t, o) => this.say(t, Object.assign({ wait: true }, o)));     // v1.9 실제 게임처럼 별명 붙이기
      const where = G.addMon(M);
      if (where === "box") {   // v1.8.1 실제 게임처럼: 어느 상자로 갔는지(지금 상자가 가득 차면 그 말도)
        const bx = G.boxes[G.lastBox], cur = G.boxes[G.boxCur];
        if (G.lastBox !== G.boxCur) await this.say(`누군가의 PC의 '${cur.n}'${jp(cur.n, "이")}\n가득 차 있다!`, { wait: true });
        await this.say(`${J(mname(M), "은")} 누군가의 PC의\n'${bx.n}'${jp(bx.n, "으로")} 전송되었다!`, { wait: true }); }
      return "caught";
    }
    b.fr = "burst"; sfx("ball_poof"); await frames(6); this.balls.splice(this.balls.indexOf(b), 1);
    s.vis = true; s.white = 1;
    for (let i = 1; i <= 8; i++) { s.white = 1 - i / 8; await frames(1); }
    Audio2.cry(M.k);
    await this.say(["안 돼! 남켓몬이\n볼에서 나와 버렸다!", "으앗! 잡았다고\n생각했는데!", "아쉽다! 조금만 더 하면\n잡을 수 있었는데!", "아깝다! 거의\n잡았는데!"][Math.min(3, shakes)]);
    return null;
  }
  // ---- 끝 ----
  async finish(r) {
    FX.setWeather(null);
    for (const m of [...G.party, ...(this.foe || [])]) { if (m && m.abT) { m.ab = m.abT; delete m.abT; } this.untf(m); }
    for (const [m, it] of this.restore) m.item = it;                    // v2.11 빼앗기거나 떨어뜨린 도구는 돌아옴
    for (const m of G.party) if (m.ab === "pickup" && !m.item && m.hp > 0 && Math.random() < 0.1) {   // 픽업: 배틀 뒤 가끔 물건을 주워 옴(실제 게임처럼 말없이 지니고 있음)
      const L = (m.lv <= 10 ? ["potion", "antidote", "ok", "repel"] : m.lv <= 30 ? ["superpotion", "fullheal", "ok", "revive", "ether"] : m.lv <= 50 ? ["hyperpotion", "fullheal", "revive", "ether", "elixir"] : ["maxpotion", "fullrestore", "maxrevive", "elixir"]).filter(x => ITEMS[x]);
      if (L.length) m.item = pick(L); }
    if (r === "win") {
      if (this.wild) { /* 승리 음악은 경험치 받기 전에 이미 */ }
      else {
        this.trE.vis = true; this.trE.x = 80;
        for (let i = 0; i < 16; i++) { this.trE.x -= 5; await frames(1); } this.trE.x = 0;
        const T = this.o.trainer;
        await this.say(`${T.cls} ${J(T.name, "과")}의\n승부에서 이겼다!`, { wait: true });
        if (T.lose) await this.say(T.lose, { wait: true });
        const prize = T.prize || 0;
        if (prize) { G.money += prize; sfx("money"); await this.say(`${J(G.name, "은")} 상금으로\n${prize.toLocaleString()}원을 받았다!`, { wait: true }); }
      }
    }
    if (this.coins && r !== "lose" && !this.o.noExp) { G.money += this.coins; sfx("money"); await this.say(`${J(G.name, "은")} 쏟아진 돈\n${this.coins.toLocaleString()}원을 주웠다!`, { wait: true }); }
    if (r === "lose") {
      if (this.o.canLose) { await this.say(this.o.loseText || "졌다…", { wait: true }); }
      else {
        await this.say(`${G.name}에게는\n싸울 수 있는 남켓몬이 없다!`, { wait: true });
        const lost = Math.min(G.money, Math.floor(G.money / 2));
        if (!this.wild && lost) await this.say(`${J(G.name, "은")} ${this.o.trainer.cls} ${this.o.trainer.name}에게\n${lost.toLocaleString()}원을 건네주었다…`, { wait: true });
        else if (lost) await this.say(`${J(G.name, "은")} 당황해서\n${lost.toLocaleString()}원을 떨어뜨렸다…`, { wait: true });
        G.money -= lost;
        await this.say("……\n눈앞이 캄캄해졌다!", { wait: true });
      }
    }
    await fadeOut(14);
    Scenes.pop(this); BT = null; FX.clear();
    for (const m of G.party) { m.slp = m.status === "slp" ? m.slp : 0; }
    return r;
  }
}

// v2.52 배틀 상자 이름 옆 타입 칸(능력치 화면·기술 칸과 같은 타입 색, 글은 작은 글씨)
function typeChipsW(T) { return T && T.length ? T.reduce((a, t) => a + Font.width(t, "g9") + 4, 0) + (T.length - 1) * 2 + 2 : 0; }
function typeChips(T, x, y) {
  let cx = Math.round(x);
  for (const t of T) { const w = Font.width(t, "g9") + 4, c = TCOL[t] || "#888";
    rect(cx + 1, y, w - 2, 12, "#2a2a32"); rect(cx, y + 1, w, 10, "#2a2a32");
    rect(cx + 1, y + 1, w - 2, 10, c); rect(cx + 1, y + 1, w - 2, 1, "rgba(255,255,255,.35)");
    Font.draw(g, t, cx + 2, y, { font: "g9", col: "#ffffff", sh: "rgba(0,0,0,.5)" }); cx += w + 2; }
}
// 레벨업 능력치 창 (+오른 값 → 총합)
async function statWindow(old, now) {
  for (const mode of [0, 1]) {
    await new Promise(res => {
      const ui = { battleUI: true, update(f) { if (f && (Input.ok() || Input.cancel())) { sfx("cursor"); Scenes.pop(this); res(); } },
        draw() { frame(150, 30, 104, 110); for (let i = 0; i < 6; i++) { const y = 38 + i * 16; Font.draw(g, ["HP", "공격", "방어", "특공", "특방", "스피드"][i], 160, y);
          Font.draw(g, mode === 0 ? "+" + (now[i] - old[i]) : String(now[i]), 244, y, { align: "right" }); }
          darkBox(0, 144, 256, 48); } };
      Scenes.push(ui);
    });
  }
}
// 레벨에 맞는 기술 배우기 (배틀·도구 공용). sayf(text) 로 글 출력
async function learnAtLevel(m, sayf) {
  const ids = MON[m.k].ml.filter(x => x[0] === m.lv).map(x => x[1]).filter(id => MV[id] && !m.moves.some(mv => mv.id === id));
  for (const id of ids) await learnMove(m, id, sayf);
}
async function learnMove(m, id, sayf) {
  const n = mname(m), mvn = MV[id].n;
  if (m.moves.length < 4) {
    m.moves.push({ id, pp: MV[id].pp, max: MV[id].pp });
    const p = sayf(`${J(n, "은")} 새로\n${J(mvn, "을")} 배웠다!`, { auto: 0, wait: true }); Audio2.jingle("jg_levelup"); await p; return true;
  }
  while (true) {
    await sayf(`${J(n, "은")} 새로\n${J(mvn, "을")} 배우고 싶다…`);
    await sayf(`하지만 ${J(n, "은")} 기술을 4개\n알고 있으므로 더 이상 배울 수 없다!`);
    const c = await ask(`${mvn} 대신 다른 기술을\n잊게 하겠습니까?`);
    if (c === 0) {
      const k = await forgetMenu(m, id);
      if (k >= 0) {
        const old = MV[m.moves[k].id].n;
        await sayf("1, 2, 그리고…… 짠!");
        await sayf(`${J(n, "은")} ${J(old, "을")}\n깨끗이 잊었다!`);
        m.moves[k] = { id, pp: MV[id].pp, max: MV[id].pp };
        const p = sayf(`그리고…\n${J(n, "은")} 새로 ${J(mvn, "을")} 배웠다!`, { wait: true }); Audio2.jingle("jg_levelup"); await p;
        return true;
      }
    }
    const q = await ask(`그럼… ${J(mvn, "을")}\n배우는 것을 포기하겠습니까?`);
    if (q === 0) { await sayf(`${J(n, "은")} ${J(mvn, "을")}\n배우지 않았다!`); return false; }
  }
}
function forgetMenu(m, newId) {
  return new Promise(res => {
    const L = m.moves.map(x => x.id).concat([newId]);
    const ui = { battleUI: true, kind: "forget", L, i: 0,
      update(f) { if (!f) return; if (Input.rep("up")) { this.i = (this.i + 4) % 5; sfx("cursor"); } else if (Input.rep("down")) { this.i = (this.i + 1) % 5; sfx("cursor"); }
        else if (Input.ok()) { sfx("select"); Scenes.pop(this); res(this.i === 4 ? -1 : this.i); } else if (Input.cancel()) { sfx("cancel"); Scenes.pop(this); res(-1); } },
      draw() {
        rect(0, 0, SW, SH, "#e8e0d0"); rect(0, 0, SW, 22, "#4a6080"); Font.draw(g, "잊게 할 기술을 고르세요", 8, 3, { col: TXT.white, sh: TXT.wsh });
        // v2.37 기술 설명이 왼쪽 좁은 칸(폭 80, 세 줄)에서 거의 다 잘리던 것 → 아래 넓은 칸(요약 화면과 같은 폭 232, 세 줄)
        drawIcon(m.k, 33, 26); Font.draw(g, mname(m), 49, 60, { align: "center" }); MON[m.k].t.forEach((t, k, a) => typeBadge(t, a.length > 1 ? 10 + k * 40 : 30, 78));
        L.forEach((id, k) => { const y = 30 + k * 18 + (k === 4 ? 4 : 0); frame(98, y - 3, 150, 18 + 0, k === this.i ? 1 : 0); typeBadge(MV[id].t, 104, y + 1);
          const pp = "PP" + MV[id].pp, sm = 144 + Font.width(MV[id].n) > 238 - Font.width(pp, "g9");   // v2.49 긴 기술 이름이 PP와 겹치던 것
          Font.draw(g, MV[id].n, 144, y + (sm ? 2 : 0), sm ? { font: "g9" } : {}); Font.draw(g, pp, 242, y, { align: "right", font: "g9" }); });
        const d = MV[L[this.i]];
        frame(4, 126, 248, 62); Font.draw(g, `분류 ${{ P: "물리", S: "특수", X: "변화" }[d.c]}  위력 ${d.bp || "-"}  명중 ${d.acc > 100 ? "-" : d.acc}`, 12, 131, { font: "g9" });
        Font.wrap(d.d || "", 232, "g9").slice(0, 3).forEach((l, k) => Font.draw(g, l, 12, 145 + k * 12, { font: "g9" }));
      } };
    Scenes.push(ui);
  });
}

// ---- 배틀로 들어가는 화면 전환 ----
async function battleTransition(kind) {
  sfx("encounter");
  for (let i = 0; i < 2; i++) { Screen.flash = 0.9; Screen.flashCol = "#fff"; await frames(4); Screen.flash = 0; await frames(4); }
  const ov = { t: 0, kind, update() { this.t++; }, draw() {
    const t = Math.min(1, this.t / 26);
    if (this.kind === "trainer") { // 가운데로 모이는 원(트레이너)
      const r = (1 - t) * 180; g.fillStyle = "#000"; g.beginPath(); g.rect(0, 0, SW, SH); g.arc(128, 96, Math.max(0, r), 0, 7, true); g.fill();
    } else for (let i = 0; i < 12; i++) { const w = Math.min(SW, t * SW * 1.6 - (i % 2) * 40); rect(i % 2 ? SW - w : 0, i * 16, Math.max(0, w), 16, "#000"); }
  } };
  Scenes.push(ov); await frames(30); Screen.fade = 1; Scenes.pop(ov);
}
async function startWild(k, lv, bg) {
  const foe = makeMon(k, lv, { met: World.zone, shiny: typeof rollShiny === "function" && rollShiny() });   // v2.40 이로치 0.3%
  bgm(["전설", "준전설", "환상"].includes(MON[k].rare) ? "battle_legend" : "battle_wild");
  await battleTransition("wild");
  const b = new Battle({ kind: "wild", foe: [foe], bg, weather: World.fieldWx() });
  let r = await b.start();
  if (r === "win") { /* 경험치는 이미 */ }
  await afterBattle(r, b);
  return r;
}
async function afterBattle(r, b) {
  if (r === "lose" && !b.o.canLose) { await whiteout(); return; }
  if (r === "win" && b.wild) { /* 야생 승리 */ }
  World.noBgm = false;
  const zi = World.zoneInfo(); if (zi.bgm) bgm(typeof zi.bgm === "function" ? zi.bgm() : zi.bgm);
  await fadeIn(12);
  // 진화
  for (const m of G.party) {
    if (!b.leveled.has(m.uid) || m.hp <= 0) continue;
    const ev = evoFor(m);
    if (ev) await evolve(m, ev);
  }
}
async function whiteout() {
  const h = G.heal || ["home", 5, 4, "up"];
  G.healAll();
  World.load(h[0], h[1], h[2], h[3] || "up"); World.cam = World.camTarget();
  await fadeIn(16);
  await say(/^(center|obang_lobby|bt_lobby)/.test(h[0]) ? "남켓몬은 모두 건강해졌어요.\f무리하지 마세요. 또 오세요!" : "엄마: 어머, 괜찮니?\f남켓몬들 푹 쉬었으니\n다시 힘내 보자!");
}
// ---- 트레이너 ----
async function trainerSpotted(a) {
  const P = World.player;
  bgm(a.trainer.music || "eyes");
  await emote(a, "excl", 36);
  // 플레이어 바로 앞까지 걸어온다
  while (Math.abs(a.x - P.x) + Math.abs(a.y - P.y) > 1) { const d = a.dir; if (!World.tryMove(a, d)) break; while (a.moving) await frames(1); }
  face(P, a);
  await trainerBattle(a, true);
}
async function trainerBattle(a, spotted) {
  const rm = typeof rematchTrainer === "function" && G.flag("tr_" + a.trainer.id) && G.flag("rm_" + a.trainer.id);   // v2.0 겨루기 징 재대결
  const T = rm ? rematchTrainer(a.trainer) : a.trainer;
  if (!spotted) { bgm(T.music || "eyes"); face(a, World.player); }
  await say(T.intro);
  bgm(T.bgm || "trainer");
  await battleTransition("trainer");
  const foe = T.team.map(([k, lv, o]) => { const m = makeMon(k, lv, { ot: T.name });      // v1.3 트레이너가 특성·기술을 정해 줄 수 있음
    if (o && o.ab) m.ab = o.ab;
    if (o && o.item) m.item = o.item;
    if (o && o.mv) m.moves = o.mv.filter(id => MV[id]).map(id => ({ id, pp: MV[id].pp, max: MV[id].pp }));
    return m; });
  const b = new Battle({ kind: "trainer", foe, weather: T.indoor ? null : World.fieldWx(), bg: T.bg || World.zoneInfo().bg || (World.M.outdoor ? "grass" : "indoor"), trainer: { name: T.name, cls: T.cls, spr: T.spr, lose: T.lose, wx: T.wx, prize: T.prize || T.base * foe[foe.length - 1].lv }, canLose: T.canLose, loseText: T.loseText });
  const r = await b.start();
  if (r === "win" || (r === "lose" && T.canLose)) G.flag("tr_" + T.id, true);
  if (rm && r === "win") G.flag("rm_" + T.id, false);
  if (r === "lose" && !T.canLose) { await afterBattle(r, b); return r; }
  await afterBattle(r, b);
  if (T.post) await T.post(r);
  return r;
}
// ---- 진화 ----
async function evolve(m, to, o = {}) {
  const from = m.k; const n0 = mname(m);
  const sc = new EvoScene(from, to); sc.noCancel = !!o.noCancel; sc.sh = !!m.shiny; Scenes.push(sc);   // v2.37 도구 진화는 실제 게임처럼 멈출 수 없음
  await fadeIn(8);
  await say(`어라……!?\n${n0}의 상태가……!`);
  bgm("evolution");
  Audio2.cry(from);
  const ok = await sc.run();
  if (!ok) { await say(`어라……?\n${n0}의 변화가 멈췄다!`); }
  else {
    sc.cur = to; Audio2.stop();
    const oi = MON[m.k].ab[0].indexOf(m.ab), oh = MON[m.k].ab[1] === m.ab;
    if (m.item && ITEMS[m.item] && ITEMS[m.item].evoHold && ITEMS[m.item].evoHold[from] === to) m.item = null;   // v2.38 진화에 쓴 지닌 도구는 사라짐(실제 게임처럼)
    m.k = to; const hpGap = m.st[0] - m.hp; m.st = calcStats(m); m.hp = Math.max(1, m.st[0] - hpGap);
    if (oi >= 0) m.ab = MON[to].ab[0][Math.min(oi, MON[to].ab[0].length - 1)]; else if (oh) m.ab = MON[to].ab[1];
    G.catch(to);
    Audio2.cry(to);
    const tb = await say(`축하합니다! ${J(n0, "은")}\n${J(MON[to].n, "으로")} 진화했다!`, { keep: true });
    await Audio2.jingle("jg_evolved"); Scenes.pop(tb);
    await learnAtLevel(m, (t, o) => say(t, o));
  }
  await fadeOut(10); Scenes.pop(sc);
  const zi = World.zoneInfo(); if (zi.bgm) bgm(typeof zi.bgm === "function" ? zi.bgm() : zi.bgm);
  await fadeIn(10);
}
class EvoScene {
  constructor(a, b) { this.a = a; this.b = b; this.cur = a; this.opaque = true; this.mix = 0; this.white = 0; battleSheet(a); battleSheet(b); this.t = 0; }
  update() { this.t++; }
  async run() {
    let cancel = false;
    for (let i = 1; i <= 60; i++) { this.white = Math.min(1, i / 30); await frames(1); }
    let per = 40;
    for (let k = 0; k < 14 && !cancel; k++) {
      for (let i = 0; i < per; i++) { this.mix = (Math.sin((i / per) * Math.PI)); await frames(1); if (!this.noCancel && Input.cancel()) { cancel = true; break; } }
      per = Math.max(6, Math.floor(per * 0.8));
    }
    this.mix = 0;
    if (cancel) { for (let i = 1; i <= 20; i++) { this.white = 1 - i / 20; await frames(1); } return false; }
    this.cur = this.b; Screen.flash = 1; Screen.flashCol = "#fff";
    for (let i = 1; i <= 30; i++) { Screen.flash = 1 - i / 30; this.white = 1 - i / 30; await frames(1); }
    Screen.flash = 0; this.white = 0; return true;
  }
  draw() {
    const gr = g.createLinearGradient(0, 0, 0, 144); gr.addColorStop(0, "#1a2a5a"); gr.addColorStop(1, "#4a6aa8"); g.fillStyle = gr; g.fillRect(0, 0, SW, SH);
    for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283 + this.t / 90, r = 40 + (i % 3) * 20 + Math.sin(this.t / 20 + i) * 6; rect(128 + Math.cos(a) * r, 70 + Math.sin(a) * r * 0.6, 2, 2, i % 2 ? "#ffe8a0" : "#a8d8ff"); }
    const showB = this.mix > 0.5;
    const key = this.cur === this.b ? this.b : showB ? this.b : this.a;
    const im = sheetOf(key, this.sh); if (!im.complete) return;
    const f = Math.floor(FRAME / 4) % 24;
    const C = cellOf(im);
    tmpG.clearRect(0, 0, 192, 192); tmpG.globalCompositeOperation = "source-over"; tmpG.drawImage(im, f * C, 0, C, C, 0, 0, C, C);
    if (this.white > 0) { tmpG.globalCompositeOperation = "source-atop"; tmpG.globalAlpha = this.white; tmpG.fillStyle = "#fff"; tmpG.fillRect(0, 0, C, C); tmpG.globalAlpha = 1; tmpG.globalCompositeOperation = "source-over"; }
    g.drawImage(tmpC, 0, 0, C, C, 80, 8, 96, 96);
    darkBox(0, 144, 256, 48);
  }
}
