// ===== 메뉴들: 시작 메뉴·파티·능력치·가방·도감·트레이너 카드·설정·리포트·PC·가게·타운맵 =====
"use strict";
function drawIcon(k, x, y, bob = 0) {
  const i = MON[k] ? MON[k].no - 1 : -1; if (i < 0 || !IMG.icons) return;
  g.drawImage(IMG.icons, (i % 16) * 32, Math.floor(i / 16) * 32, 32, 32, x, y - (bob ? ((FRAME >> 3) & 1) * 2 : 0), 32, 32);
}
function drawItemIcon(id, x, y) {
  const it = ITEMS[id]; if (!it || !JSN.items) return;
  const i = JSN.items.t[it.ic]; if (i === undefined) return;
  g.drawImage(IMG.items, (i % 16) * 24, Math.floor(i / 16) * 24, 24, 24, x, y, 24, 24);
}
function bgPattern(c1, c2) { rect(0, 0, SW, SH, c1); for (let y = 0; y < SH; y += 8) for (let x = ((y / 8) % 2) * 8; x < SW; x += 16) rect(x, y, 8, 8, c2); }
function panel(x, y, w, h, c = "#f8f8f0", o = "#3a3a46") { rect(x + 1, y, w - 2, h, o); rect(x, y + 1, w, h - 2, o); rect(x + 1, y + 1, w - 2, h - 2, c); }
function monFront(k, x, y, row = 0, shiny = false) {   // 배틀 시트 앞모습 대기 동작(v2.40 이로치면 다시 칠한 시트)
  const im = sheetOf(k, shiny); if (!im.complete) return; const f = Math.floor(FRAME / 4) % 24, C = im.naturalWidth / 24 || 96;   // v2.18 2배 촘촘 시트도
  g.drawImage(im, f * C, row * C, C, C, x, y, 96, 96);
}
// 모달 장면 도우미: 클래스에 update/draw 두고 끝나면 this.done(v)
class Modal { constructor() { this.promise = new Promise(r => this._r = r); } done(v) { Scenes.pop(this); this._r(v); } }
const show = s => { Scenes.push(s); return s.promise; };

// ---- 시작 메뉴 ----
const MENU_HELP = { 도감: "남켓몬 도감을 펼쳐 본다.", 남켓몬: "함께 다니는 남켓몬을 본다.", 가방: "가방 속 물건을 확인한다.", 리포트: "지금까지의 모험을 기록한다.", 설정: "글자 속도·소리 등을 바꾼다.", 닫기: "메뉴를 닫는다.",
  달리기: "켜면 늘 달린다.\nX를 누르고 있으면 걷는다.", 타이틀: "타이틀 화면으로 간다.\n리포트를 먼저 쓰세요!", 카드: "트레이너 카드를 본다." };
async function openStartMenu() {
  World.busy++;
  let last = 0, toTitle = false;
  try {
    while (true) {
      const keys = [];
      if (G.flag("dex")) keys.push("도감");
      if (G.party.length) keys.push("남켓몬");
      keys.push("가방", "카드");
      if (G.flag("runshoes")) keys.push("달리기");
      keys.push("리포트", "설정", "타이틀", "닫기");
      const items = keys.map(k => k === "카드" ? G.name : k === "달리기" ? { label: "늘 달리기", sub: Save.opt.autorun ? "켬" : "끔" } : k === "타이틀" ? "타이틀로" : k);
      let help = null; last = Math.min(last, keys.length - 1);
      const hb = new Overlay(() => { const lab = keys[help ?? last]; frame(2, 150, 148, 40); Font.wrap(MENU_HELP[lab] || "", 132, "g9").slice(0, 2).forEach((l, j) => Font.draw(g, l, 10, 156 + j * 13, { font: "g9" })); });
      Scenes.push(hb);
      const v = await menu({ items, x: 154, y: 2, w: 100, initial: last, onMove: i => help = i });
      Scenes.pop(hb);
      if (v < 0 || keys[v] === "닫기") break;
      last = v; const k = keys[v];
      if (k === "도감") await openDex();
      else if (k === "남켓몬") await openParty("field");
      else if (k === "가방") await openBag("field");
      if (typeof FIELD_PENDING !== "undefined" && FIELD_PENDING) break;          // v2.0 풀베기·낚싯대·징: 메뉴를 닫고 바로
      else if (k === "카드") await show(new TrainerCard());
      else if (k === "달리기") { Save.opt.autorun = Save.opt.autorun ? 0 : 1; Save.saveOpt(); sfx("select");
        await say(Save.opt.autorun ? "늘 달리기를 켰다!\nX를 누르고 있으면 걸을 수 있다." : "늘 달리기를 껐다.\nX를 누르고 있으면 달릴 수 있다."); }
      else if (k === "리포트") { if (await doSave()) break; }
      else if (k === "설정") await show(new Options());
      else if (k === "타이틀") { if (await yes("타이틀 화면으로 돌아갈까요?\n리포트에 쓰지 않은 모험은 사라져요.")) { toTitle = true; break; } }
    }
    if (typeof FIELD_PENDING !== "undefined" && FIELD_PENDING) await runFieldPending();
  } finally { World.busy--; }
  if (toTitle) await backToTitle();
}
// 타이틀로 돌아가기: 필드·겹친 화면을 모두 닫고 처음 화면을 다시 연다
async function backToTitle() {
  World.busy++;
  await fadeOut(16);
  Audio2.stop();
  while (Scenes.st.length) Scenes.pop();
  World.busy = 0; World.popup = null;
  title();
}

// ---- 파티 ----
class PartyScreen extends Modal {
  constructor(mode, msg) { super(); this.mode = mode; this.i = 0; this.msg = msg || (mode === "item" ? "어느 남켓몬에게 쓰겠습니까?" : mode === "battle_forced" ? "다음에 나갈 남켓몬을 고르세요." : "남켓몬을 골라 주십시오."); this.swap = -1; this.busy = false; this.opaque = true; }
  get n() { return G.party.length; }
  update(f) {
    if (!f || this.busy) return;
    const n = this.n;
    if (Input.rep("up")) { this.i = this.i === 0 ? 6 : this.i === 6 ? n - 1 : this.i - 1; sfx("cursor"); }
    else if (Input.rep("down")) { this.i = this.i === 6 ? 0 : this.i >= n - 1 ? 6 : this.i + 1; sfx("cursor"); }
    else if (Input.rep("left")) { if (this.i > 0 && this.i < 6) { this.i = 0; sfx("cursor"); } }
    else if (Input.rep("right")) { if (this.i === 0 && n > 1) { this.i = 1; sfx("cursor"); } }
    else if (Input.ok()) { if (this.i === 6) { if (this.mode === "battle_forced") { sfx("flee_fail"); return; } sfx("cancel"); this.done(-1); return; } sfx("select"); this.pick(); }
    else if (Input.cancel()) { if (this.swap >= 0) { this.swap = -1; sfx("cancel"); return; } if (this.mode === "battle_forced") return; sfx("cancel"); this.done(-1); }
  }
  async pick() {
    this.busy = true;
    try {
      const i = this.i, m = G.party[i];
      if (this.swap >= 0) { const j = this.swap; [G.party[i], G.party[j]] = [G.party[j], G.party[i]]; this.swap = -1; sfx("select"); return; }
      if (this.mode === "item" || this.mode === "tm" || this.mode === "evo") { this.done(i); return; }
      let items;
      if (this.mode.startsWith("battle")) items = ["교체한다", "능력치를 보다", "그만두다"];
      else items = ["능력치를 보다", "순서 바꾸기", "도구", "그만두다"];
      const fm = this.mode === "field" && typeof FIELD_MOVES !== "undefined" ? m.moves.filter(x => FIELD_MOVES[x.id]).map(x => x.id) : [];
      if (fm.length) items = fm.map(id => ({ label: MV[id].n, col: TXT.blue, fm: id })).concat(items);
      const v = await menu({ items, x: 150, y: Math.max(4, 90 - (items.length > 3 ? 16 * (items.length - 3) : 0)), w: 104 });
      const k = items[v];
      if (k && k.fm) {                       // v2.0 필드 기술
        const F = FIELD_MOVES[k.fm];
        if (!hasBadge(F.badge)) { await say("어사패가 없으면\n밖에서 쓸 수 없다."); return; }
        fieldLater(() => F.use(m)); this.done(-1); return; }
      if (k === "교체한다") {
        if (m.hp <= 0) { await say(`${J(mname(m), "은")}\n싸울 기력이 없다!`); return; }
        if (typeof BT !== "undefined" && BT && i === BT.pi && (this.mode !== "battle_forced" || BT.pivoting)) { await say(`${J(mname(m), "은")}\n이미 싸우고 있다!`); if (!BT.pivoting) this.done(-1); return; }
        this.done(i); return; }
      if (k === "능력치를 보다") { const j = await show(new Summary(i)); this.i = j; }
      if (k === "순서 바꾸기") { this.swap = i; }
      if (k === "도구") await holdMenu(m);
    } finally { this.busy = false; }
  }
  draw() {
    bgPattern("#4a8a9a", "#5a9aaa");
    for (let i = 0; i < 6; i++) this.slot(i);
    frame(2, 146, 200, 44); Font.draw(g, this.swap >= 0 ? "어디로 옮기겠습니까?" : this.msg, 12, 154);
    panel(206, 152, 48, 26, this.i === 6 ? "#f8d870" : "#e0e0d8"); Font.draw(g, "취소", 230, 157, { align: "center" });
  }
  slot(i) {
    const m = G.party[i]; const sel = this.i === i, sw = this.swap === i;
    const [x, y, w, h] = i === 0 ? [4, 18, 98, 62] : [106, 4 + (i - 1) * 28, 148, 26];
    if (!m) { panel(x, y, w, h, "rgba(40,60,70,.35)", "rgba(20,40,50,.5)"); return; }
    const fnt = m.hp <= 0;
    const c = sw ? "#f8b878" : sel ? "#f8e8a0" : fnt ? "#e8b0a8" : "#a8d8f0";
    panel(x, y, w, h, c, sel ? "#d04030" : "#2a3a4a");
    rect(x + 2, y + 2, w - 4, 2, "rgba(255,255,255,.5)");
    // v2.37 기술머신·진화 도구: 실제 게임처럼 체력 막대 자리에 '배울 수 있다/쓸 수 있다'(전엔 막대 위에 겹치고 맨 앞 남켓몬엔 안 보였음)
    const lab = this.mode === "tm" && this.tmId ? (tmOk(m, this.tmId) ? ["배울 수 있다", 1] : ["배울 수 없다", 0])
      : this.mode === "evo" && this.evoId ? (ITEMS[this.evoId].evo[m.k] ? ["쓸 수 있다", 1] : ["쓸 수 없다", 0]) : null;
    const labDraw = (lx, ly, al) => Font.draw(g, lab[0], lx, ly, { font: "g9", align: al, col: lab[1] ? TXT.blue : TXT.red, sh: null });
    if (i === 0) {
      drawIcon(m.k, x + 2, y + 2, sel); Font.draw(g, mname(m), x + 36, y + 6);
      Font.draw(g, "Lv" + m.lv, x + 36, y + 22, { font: "g9" }); if (m.gender) Font.draw(g, m.gender === "m" ? "♂" : "♀", x + 70, y + 20, { col: m.gender === "m" ? TXT.blue : TXT.red, sh: null });
      if (m.status || fnt) statusBadge(fnt ? "fnt" : m.status, x + 6, y + 36);
      if (lab) labDraw(x + w - 6, y + 42, "right");
      else { hpBar(x + 34, y + 38, 44, m.hp / m.st[0]); Font.draw(g, `${m.hp}/${m.st[0]}`, x + w - 6, y + 47, { font: "g9", align: "right" }); }
    } else {
      drawIcon(m.k, x, y - 4, sel); Font.draw(g, mname(m), x + 32, y + 1);
      Font.draw(g, "Lv" + m.lv, x + 32, y + 14, { font: "g9" }); if (m.gender) Font.draw(g, m.gender === "m" ? "♂" : "♀", x + 62, y + 12, { col: m.gender === "m" ? TXT.blue : TXT.red, sh: null });
      if (m.status || fnt) statusBadge(fnt ? "fnt" : m.status, x + 74, y + 15);
      if (lab) labDraw(x + w - 6, y + 8, "right");
      else { hpBar(x + 76, y + 5, 44, m.hp / m.st[0]); Font.draw(g, `${m.hp}/${m.st[0]}`, x + w - 6, y + 13, { font: "g9", align: "right" }); }
    }
  }
}
async function openParty(mode, msg) { const s = new PartyScreen(mode, msg); return show(s); }

// ---- 능력치 ----
class Summary extends Modal {
  constructor(i, list) { super(); this.i = i; this.list = list || null; this.page = 0; this.opaque = true; this.mi = -1; this.lore = null; }   // list: PC 상자에서 볼 때
  get L() { return this.list || G.party; }
  get m() { return this.L[this.i]; }
  update(f) {
    if (!f) return;
    if (this.lore) { if (Input.ok() || Input.cancel()) { this.lore = null; sfx("cancel"); } return; }
    if (this.mi >= 0) { if (Input.rep("up")) { this.mi = (this.mi + this.m.moves.length - 1) % this.m.moves.length; sfx("cursor"); } else if (Input.rep("down")) { this.mi = (this.mi + 1) % this.m.moves.length; sfx("cursor"); }
      else if (Input.ok() && MV[this.m.moves[this.mi].id].orig) { const d = MV[this.m.moves[this.mi].id]; this.lore = [d.n, d.lore]; sfx("select"); }
      else if (Input.cancel() || Input.ok()) { this.mi = -1; sfx("cancel"); } return; }
    if (Input.ok() && this.page === 1 && AB[this.m.ab] && AB[this.m.ab].orig) { const a = AB[this.m.ab]; this.lore = [a.n, a.lore]; sfx("select"); return; }
    if (Input.rep("left")) { if (this.page > 0) { this.page--; sfx("cursor"); } }
    else if (Input.rep("right")) { if (this.page < 2) { this.page++; sfx("cursor"); } }
    else if (Input.rep("up")) { if (this.L.length > 1) { this.i = (this.i + this.L.length - 1) % this.L.length; sfx("cursor"); Audio2.cry(this.m.k); } }
    else if (Input.rep("down")) { if (this.L.length > 1) { this.i = (this.i + 1) % this.L.length; sfx("cursor"); Audio2.cry(this.m.k); } }
    else if (Input.ok() && this.page === 2) { this.mi = 0; sfx("select"); }
    else if (Input.cancel()) { sfx("cancel"); this.done(this.i); }
  }
  draw() {
    const m = this.m, sp = MON[m.k];
    bgPattern("#e8dcc0", "#efe5cc");
    rect(0, 0, SW, 20, "#c05030"); rect(0, 18, SW, 2, "#7a2a18");
    Font.draw(g, ["남켓몬 정보", "능력치", "기술"][this.page], 8, 2, { col: TXT.white, sh: "#7a2a18" });
    for (let k = 0; k < 3; k++) rect(214 + k * 12, 7, 8, 6, k === this.page ? "#f8e070" : "#7a2a18");
    // 왼쪽: 모습
    panel(4, 24, 100, 112, "#d8e8f0");
    monFront(m.k, 6, 30, 0, m.shiny);
    // v1.8.1: 성별 기호가 고정 자리(80)에 있어 Lv·이름과 겹치던 것 → 이름 바로 뒤에 붙임(실제 게임처럼 '이름 ♂ … Lv')
    rect(4, 120, 100, 16, "#3a3a46"); Font.draw(g, mname(m), 8, 120, { col: TXT.white, sh: TXT.wsh });
    if (m.gender) Font.draw(g, m.gender === "m" ? "♂" : "♀", 10 + Font.width(mname(m)), 120, { col: m.gender === "m" ? "#90b0ff" : "#ff9090", sh: null });
    if (m.shiny) { Font.draw(g, "★", 8, 32, { col: "#ffd040", sh: "#a06010" }); }   // v2.40 이로치 표시(모습 칸 왼쪽 위)
    Font.draw(g, "Lv" + m.lv, 101, 122, { font: "g9", col: TXT.white, sh: TXT.wsh, align: "right" });
    const bi = JSN.balls.keys.indexOf(m.ball || "namket"); sprite(IMG.balls, 0, Math.max(0, bi) * 16, 16, 16, 6, 26);
    if (m.status) statusBadge(m.status, 70, 28);
    const X = 110;
    if (this.page === 0) {
      const rows = [["도감 번호", String(sp.no).padStart(3, "0")], ["이름", sp.n], ["타입", ""], ["어버이", m.ot || G.name], ["ID No.", String(m.otid || G.id).padStart(5, "0")], ["지닌 물건", m.item ? itemName(m.item) : "없음"]];
      rows.forEach(([a, b], k) => { const y = 26 + k * 16; rect(X, y, 56, 14, "#c8b890"); Font.draw(g, a, X + 4, y, { font: "g9" }); if (k === 2) sp.t.forEach((t, j) => typeBadge(t, X + 62 + j * 38, y)); else Font.draw(g, b, X + 62, y - 1); });
      panel(4, 140, 248, 50, "#fbf8f0");
      const nat = NATURES[m.nat][0];
      Font.draw(g, `${nat} 성격.`, 12, 146); Font.draw(g, `${m.met || "용성지방"}에서 Lv${m.metLv || m.lv}일 때 만났다.`, 12, 162, { font: "g9" });
      Font.draw(g, sp.motif, 12, 176, { font: "g9", col: TXT.gray, sh: null });
    } else if (this.page === 1) {
      const nat = NATURES[m.nat];
      rect(X, 26, 140, 14, "#c8b890"); Font.draw(g, "HP", X + 4, 26, { font: "g9" }); Font.draw(g, `${m.hp}/${m.st[0]}`, X + 136, 26, { align: "right", font: "g9" });
      hpBar(X + 40, 42, 76, m.hp / m.st[0]);
      for (let k = 1; k < 6; k++) { const y = 50 + k * 13; const up = nat[1] === k && nat[1] !== nat[2], dn = nat[2] === k && nat[1] !== nat[2];
        Font.draw(g, STN[k], X + 4, y, { font: "g9", col: up ? TXT.red : dn ? TXT.blue : TXT.dark, sh: up ? TXT.rsh : dn ? TXT.bsh : TXT.sh }); Font.draw(g, String(m.st[k]), X + 136, y, { font: "g9", align: "right" }); }
      const lo = expAt(sp.gr, m.lv), hi = expAt(sp.gr, m.lv + 1);
      Font.draw(g, "경험치", X + 4, 128, { font: "g9" }); Font.draw(g, String(m.exp), X + 136, 128, { font: "g9", align: "right" });
      panel(4, 140, 248, 50, "#fbf8f0");
      Font.draw(g, "다음 레벨까지 " + (m.lv >= 100 ? 0 : hi - m.exp), 12, 144, { font: "g9" }); expBar(130, 148, 112, (m.exp - lo) / Math.max(1, hi - lo));
      const a = AB[m.ab];
      Font.draw(g, "특성  " + (a ? a.n : m.ab), 12, 158, { font: "g9", col: "#a03020", sh: TXT.rsh });
      if (a && a.orig) Font.draw(g, "★남원 특성  A: 이야기", 244, 158, { font: "g9", align: "right", col: "#b07818", sh: null });
      Font.wrap(a ? a.d : "", 232, "g9").slice(0, 2).forEach((l, k) => Font.draw(g, l, 12, 168 + k * 10, { font: "g9" }));
    } else {
      m.moves.forEach((mv, k) => { const y = 24 + k * 28, d = MV[mv.id];
        panel(X, y, 142, 27, this.mi === k ? "#f8e8a0" : "#fbf8f0"); typeBadge(d.t, X + 4, y + 3);
        Font.draw(g, d.n, X + 42, y + 1); Font.draw(g, `PP ${mv.pp}/${mv.max}`, X + 138, y + 15, { font: "g9", align: "right" });
        if (d.orig) Font.draw(g, "★", X + 136, y + 1, { font: "g9", align: "right", col: "#c08818", sh: null }); });
      panel(4, 140, 248, 50, "#fbf8f0");
      if (this.mi >= 0) { const d = MV[m.moves[this.mi].id];
        Font.draw(g, `분류 ${{ P: "물리", S: "특수", X: "변화" }[d.c]}  위력 ${d.bp || "-"}  명중 ${d.acc > 100 ? "-" : d.acc}`, 12, 144, { font: "g9" });
        Font.wrap(d.d || "", 232, "g9").slice(0, 3).forEach((l, k) => Font.draw(g, l, 12, 157 + k * 10, { font: "g9" })); }
      else Font.draw(g, "A: 기술 설명 보기  (★ = 남원 전용기술)", 12, 150, { font: "g9", col: TXT.gray, sh: null });
      if (this.mi >= 0 && MV[m.moves[this.mi].id].orig) Font.draw(g, "A: 남원 이야기", 244, 144, { font: "g9", align: "right", col: "#b07818", sh: null });
    }
    if (this.lore) {   // 남원 이야기 창
      frame(6, 30, 244, 150); rect(10, 34, 236, 16, "#7a4a20");
      Font.draw(g, "★ 남원 이야기 — " + this.lore[0], 16, 35, { col: "#fff4d0", sh: "#3a2010" });
      Font.wrap(this.lore[1] || "", 224, "g9").slice(0, 9).forEach((l, k) => Font.draw(g, l, 16, 56 + k * 13, { font: "g9" }));
      Font.draw(g, "A/B: 닫기", 240, 164, { font: "g9", align: "right", col: TXT.gray, sh: null });
    }
  }
}

// ---- 가방 (주머니 = 복주머니) ----
const POUCH_COL = { item: ["#c84a3a", "#f08060"], med: ["#3a9a5a", "#80d890"], ball: ["#c8402a", "#4a6ad8"], tm: ["#4a6ab8", "#90b0f0"], berry: ["#a8402a", "#e09060"], key: ["#a08a2a", "#f0d870"] };
class Bag extends Modal {
  constructor(mode) { super(); this.mode = mode; this.p = Bag.lastP || 1; this.i = 0; this.top = 0; this.busy = false; this.opaque = true; this.note = null; }
  list() { const pk = POCKETS[this.p][0]; return Object.keys(G.bag).filter(id => ITEMS[id] && ITEMS[id].p === pk).concat(["__close"]); }
  update(f) {
    if (!f || this.busy) return;
    const L = this.list();
    if (Input.rep("left")) { this.p = (this.p + POCKETS.length - 1) % POCKETS.length; this.i = 0; this.top = 0; sfx("cursor"); }
    else if (Input.rep("right")) { this.p = (this.p + 1) % POCKETS.length; this.i = 0; this.top = 0; sfx("cursor"); }
    else if (Input.rep("up")) { this.i = (this.i + L.length - 1) % L.length; sfx("cursor"); }
    else if (Input.rep("down")) { this.i = (this.i + 1) % L.length; sfx("cursor"); }
    else if (Input.ok()) { sfx("select"); if (L[this.i] === "__close") { Bag.lastP = this.p; this.done(null); } else this.use(L[this.i]); }
    else if (Input.cancel()) { sfx("cancel"); Bag.lastP = this.p; this.done(null); }
    if (this.i < this.top) this.top = this.i; if (this.i >= this.top + 7) this.top = this.i - 6;
  }
  async use(id) {
    this.busy = true;
    try {
      const it = ITEMS[id];
      if (this.mode === "give") { if (!canHold(id)) { await say("그것은 지니게 할 수 없다."); return; } Bag.lastP = this.p; this.done({ item: id }); return; }
      if (this.mode === "battle") {
        if (it.p === "key" || it.p === "tm" || it.repel || it.escape || it.candy || it.evo || (it.hold && !it.heal && !it.hpPct && !it.cure && !it.pp && !it.conf)) { await say("지금은 쓸 수 없다."); return; }
        if (it.ball) { if (G.party.length >= 6 && PCB.free() <= 0) { await say("PC가 가득 차서 더 잡을 수 없다!"); return; } Bag.lastP = this.p; this.done({ item: id }); return; }
        if (isBattleOnly(it)) { Bag.lastP = this.p; this.done({ item: id, target: BT ? BT.pi : 0 }); return; }
        const t = await openParty("item"); if (t == null || t < 0) return;
        let mi = null;
        if (it.pp) { mi = await pickMove(G.party[t], it); if (mi == null) return; }
        if (!canApply(id, G.party[t], mi)) { await say("써도 효과가 없을 것 같다."); return; }
        Bag.lastP = this.p; this.done({ item: id, target: t, move: mi }); return;
      }
      const opts = it.p === "key" ? (["townmap", "expshare", "watch", "oldrod", "gong", "jjy_card"].includes(id) ? (id === "jjy_card" ? ["읽다", "그만두다"] : ["쓰다", "그만두다"]) : ["그만두다"]) : canHold(id) ? ["쓰다", "지니게 하다", "버리다", "그만두다"] : ["쓰다", "버리다", "그만두다"];
      const v = await menu({ items: opts, x: 160, y: 96 - (opts.length > 3 ? 16 : 0), w: 94 });
      const k = opts[v];
      if (k === "쓰다" || k === "읽다") { await fieldUse(id); if (typeof FIELD_PENDING !== "undefined" && FIELD_PENDING) { Bag.lastP = this.p; this.done(null); return; } }
      else if (k === "지니게 하다") { const t = await openParty("item"); if (t != null && t >= 0) await giveItem(G.party[t], id); }
      else if (k === "버리다") {
        const n = await pickNum({ max: G.bag[id], x: 150, y: 110, w: 70 });
        if (n > 0 && await yes(`${it.n} ${n}개를 버리겠습니까?`)) { G.take(id, n); await say(`${it.n} ${n}개를 버렸다.`); }
      }
    } finally { this.busy = false; if (!this.list()[this.i]) this.i = 0; }
  }
  draw() {
    const pk = POCKETS[this.p], col = POUCH_COL[pk[0]];
    bgPattern("#e8d8b0", "#efe2c0");
    // 주머니 이름
    panel(4, 4, 96, 22, "#fbf8f0"); Font.draw(g, pk[1], 52, 7, { align: "center" });
    const b = (FRAME >> 4) & 1; Font.draw(g, "◀", 6 - b, 7, { col: "#d04030", sh: null }); Font.draw(g, "▶", 88 + b, 7, { col: "#d04030", sh: null });
    // 복주머니 그림
    if (IMG.pouch) g.drawImage(IMG.pouch, this.p * 72, 0, 72, 72, 16, 40, 72, 72); else drawPouch(52, 80, col);
    for (let k = 0; k < POCKETS.length; k++) rect(16 + k * 12, 132, 8, 6, k === this.p ? col[0] : "#a89878");
    // 목록
    panel(104, 4, 150, 134, "#fbf8f0");
    const L = this.list();
    for (let r = 0; r < 7; r++) { const k = this.top + r, id = L[k]; if (!id) break; const y = 10 + r * 18;
      if (id === "__close") Font.draw(g, this.mode === "field" ? "가방을 닫는다" : "돌아가기", 122, y);
      else { Font.draw(g, ITEMS[id].n, 122, y); if (ITEMS[id].p !== "key") Font.draw(g, "×" + String(G.bag[id]).padStart(2, " "), 248, y, { align: "right" });
        if (id === "expshare") Font.draw(g, G.flag("expshare_on") ? "켜짐" : "꺼짐", 248, y, { align: "right", font: "g9", col: G.flag("expshare_on") ? TXT.blue : TXT.gray, sh: null }); }
      if (k === this.i) cursor(110, y + 3); }
    if (this.top > 0) { for (let i = 0; i < 4; i++) rect(176 + i, 6 + i - b, 7 - i * 2, 1, "#d04030"); }
    if (this.top + 7 < L.length) downArrow(176, 130);
    // 설명
    frame(2, 142, 252, 48);
    const id = L[this.i];
    if (id && id !== "__close") { drawItemIcon(id, 10, 154); Font.wrap(ITEMS[id].d, 206, "g9").slice(0, 3).forEach((l, k) => Font.draw(g, l, 40, 148 + k * 12, { font: "g9" })); }
    else Font.draw(g, "가방을 닫는다.", 40, 158, { font: "g9" });
  }
}
function drawPouch(cx, cy, col) {   // 복주머니
  const [a, b] = col;
  g.fillStyle = "#3a2a2a"; g.beginPath(); g.ellipse(cx, cy + 6, 34, 30, 0, 0, 7); g.fill();
  g.fillStyle = a; g.beginPath(); g.ellipse(cx, cy + 6, 32, 28, 0, 0, 7); g.fill();
  g.fillStyle = b; g.beginPath(); g.ellipse(cx - 8, cy, 14, 12, 0, 0, 7); g.fill();
  rect(cx - 16, cy - 30, 32, 10, "#3a2a2a"); rect(cx - 15, cy - 29, 30, 8, a);
  for (let i = -14; i < 14; i += 4) rect(cx + i, cy - 26, 2, 4, b);
  rect(cx - 18, cy - 21, 36, 4, "#f0c040"); rect(cx - 18, cy - 21, 36, 1, "#fff0a0");
  rect(cx - 4, cy - 2, 8, 8, "#f0c040"); rect(cx - 3, cy - 1, 6, 6, "#c89020"); Font.draw(g, "복", cx - 6, cy - 4, { font: "g11", col: "#fff0a0", sh: null });
}
async function openBag(mode) { return show(new Bag(mode)); }

// ---- 도구 쓰기 (v1.4: 4세대 성능) ----
const isBattleOnly = it => !!(it.xs || it.crit || it.mist);
const healAmt = (it, m) => it.heal === "full" ? m.st[0] : it.hpPct ? Math.max(1, Math.floor(m.st[0] * it.hpPct)) : (it.heal || 0);
function canApply(id, m, mi) {
  const it = ITEMS[id];
  if (it.revive) return m.hp <= 0;
  if (m.hp <= 0) return false;
  if ((it.heal || it.hpPct) && m.hp < m.st[0]) return true;
  if (it.cure && m.status && (it.cure === "all" || it.cure.includes(m.status))) return true;
  if (it.conf && BT && BT.w.P && BT.w.P.m === m && BT.w.P.vol.conf) return true;
  if (it.pp) return mi == null ? m.moves.some(x => x.pp < x.max) : (mi === "all" ? m.moves.some(x => x.pp < x.max) : m.moves[mi] && m.moves[mi].pp < m.moves[mi].max);
  if (it.candy) return m.lv < 100;
  return false;
}
function applyItem(id, m, mi) {
  const it = ITEMS[id], n = mname(m);
  if (it.revive) { m.hp = Math.max(1, Math.floor(m.st[0] * it.revive)); m.status = null; m.slp = 0; sfx("heal_hp"); return `${J(n, "은")} 기운을 되찾았다!`; }
  const msgs = [];
  if ((it.heal || it.hpPct) && m.hp < m.st[0]) { const h = Math.min(healAmt(it, m), m.st[0] - m.hp); m.hp += h; msgs.push(it.heal === "full" ? `${n}의 HP가\n모두 회복되었다!` : `${n}의 HP가\n${h} 회복되었다!`); }
  if (it.cure && m.status && (it.cure === "all" || it.cure.includes(m.status))) { const s0 = m.status; m.status = null; m.slp = 0; m.tox = 0;
    msgs.push({ psn: `${n}의 독이 깨끗이 나았다!`, tox: `${n}의 독이 깨끗이 나았다!`, par: `${n}의 마비가 풀렸다!`, slp: `${J(n, "은")} 잠에서 깨어났다!`, brn: `${n}의 화상이 나았다!`, frz: `${n}의 얼음이 녹았다!` }[s0] || `${J(n, "은")} 건강해졌다!`); }
  if (it.conf && BT && BT.w.P && BT.w.P.m === m && BT.w.P.vol.conf) { BT.w.P.vol.conf = 0; msgs.push(`${n}의 혼란이 풀렸다!`); }
  if (it.pp) { const list = mi === "all" || it.ppAll ? m.moves : [m.moves[mi]];
    for (const x of list) if (x) x.pp = it.pp === "full" ? x.max : Math.min(x.max, x.pp + it.pp);
    msgs.push(it.ppAll ? `${n}의 모든 기술의\nPP가 회복되었다!` : `${MV[m.moves[mi].id].n}의\nPP가 회복되었다!`); }
  if (msgs.length) { sfx("heal_hp"); return msgs.join("\f"); }
  return "그러나 아무 일도 일어나지 않았다!";
}
// PP 회복 도구: 기술 고르기 (모든 기술용이면 "all")
async function pickMove(m, it) {
  if (it.ppAll) return "all";
  const v = await menu({ items: m.moves.map(x => ({ label: MV[x.id].n, sub: `${x.pp}/${x.max}` })).concat([{ label: "그만두다" }]), x: 110, y: 40, w: 144 });
  return v < 0 || v >= m.moves.length ? null : v;
}
// 기술머신 궁합 (v1.4): tmAll = 거의 모두(tmNot 빼고), tmTypes = 그 타입이거나 같은 타입 기술을 스스로 배우는 종, 레벨업으로 배우는 기술이면 늘 가능
function tmOk(m, mv) {
  const it = Object.values(ITEMS).find(i => i.tm === mv) || {}, M = MON[m.k];
  if (M.ml.some(x => x[1] === mv)) return true;
  if (it.tmAlso && it.tmAlso.includes(m.k)) return true;
  if (it.tmAll) return !(it.tmNot || []).includes(m.k);
  if (it.tmTypes) return it.tmTypes.some(x => M.t.includes(x)) || M.ml.some(x => MV[x[1]] && MV[x[1]].t === MV[mv].t);
  return false;
}
// 지니게 하기·받기
const canHold = id => ITEMS[id] && !["key", "tm"].includes(ITEMS[id].p);
async function giveItem(m, id) {
  if (m.item) { const old = m.item; if (!await yes(`${J(mname(m), "은")} ${J(itemName(old), "을")} 지니고 있다.\n바꿔서 지니게 하겠습니까?`)) return false; G.give(old); }
  G.take(id); m.item = id; sfx("select");
  await say(`${mname(m)}에게\n${J(itemName(id), "을")} 지니게 했다.`); return true;
}
async function holdMenu(m) {
  const v = await menu({ items: m.item ? ["지니게 하기", "받기", "그만두다"] : ["지니게 하기", "그만두다"], x: 150, y: 74, w: 104 });
  if (v === 0) { const r = await show(new Bag("give")); if (r && r.item) await giveItem(m, r.item); }
  else if (v === 1 && m.item) { const id = m.item; m.item = null; G.give(id); sfx("select"); await say(`${mname(m)}에게서\n${J(itemName(id), "을")} 받았다.`); }
}
async function useEvoItem(id) {           // v2.37 진화 도구: 누구에게 쓸지 고르면(쓸 수 있다/없다 표시) 바로 진화 — 멈출 수 없음
  const it = ITEMS[id];
  const ps = new PartyScreen("evo", "누구에게 쓰겠습니까?"); ps.evoId = id;
  const t = await show(ps); if (t == null || t < 0) return;
  const m = G.party[t], to = it.evo[m.k];
  if (!to || !MON[to]) { await say("써도 효과가 없을 것 같다."); return; }
  G.take(id); await fadeOut(10); await evolve(m, to, { noCancel: true });
  if (m.k !== to) G.give(id, 1);
}
async function fieldUse(id) {
  const it = ITEMS[id];
  if (it.ball) { await say("조박사의 말이 떠올랐다……\f{P}! 지금은 그것을\n쓸 때가 아니란다!"); return; }
  if (isBattleOnly(it)) { await say("배틀 중에만 쓸 수 있다."); return; }
  if (it.repel) { if (G.repel > 0) { await say("아직 쑥향의 향기가 남아 있다."); return; } G.take(id); G.repel = it.repel; G.lastRepel = id; sfx("heal_hp");
    await say(id === "maxrepel" ? "모깃불을 피웠다!\n매캐한 연기가 퍼진다." : `${J(it.n, "을")} 피웠다!\n은은한 쑥 냄새가 퍼진다.`); return; }
  if (it.escape) { const d = World.def;
    if (!d.dungeon || !d.escape) { await say("여기서는 쓸 수 없다."); return; }
    G.take(id); sfx("heal_hp"); await say("동아줄을 붙잡았다!\n쑤욱 끌려 올라간다!"); await World.warp(d.escape, "fade"); return; }
  if (id === "townmap") { await show(new TownMap()); return; }
  if (id === "jjy_card") { await jjyCardRead(); return; }       // v2.12 4월의 엽서
  if (id === "watch") { await useWatch(); return; }
  if (id === "oldrod") { fieldLater(useRod); return; }          // v2.0 낚시: 가방을 닫고 바로
  if (id === "gong") { fieldLater(useGong); return; }           // v2.0 겨루기 징
  if (id === "expshare") { const on = !G.flag("expshare_on"); G.flag("expshare_on", on); sfx("select"); await say(on ? "학습장치를 켰다!\f싸우지 않은 동료도\n경험치를 절반 받는다." : "학습장치를 껐다."); return; }
  if (it.tm) {
    const mv = MV[it.tm];
    await say(`기술머신을 켰다!\f${J(mv.n, "이")} 들어 있다!`);
    if (!await yes(`${J(mv.n, "을")}\n남켓몬에게 가르치겠습니까?`)) return;
    const ps = new PartyScreen("tm", "누구에게 가르치겠습니까?"); ps.tmId = it.tm;
    const t = await show(ps); if (t == null || t < 0) return;
    const m = G.party[t];
    if (!tmOk(m, it.tm)) { await say(`${J(mname(m), "은")} ${J(mv.n, "을")}\n배울 수 없다!`); return; }
    if (m.moves.some(x => x.id === it.tm)) { await say(`${J(mname(m), "은")} 이미\n${J(mv.n, "을")} 알고 있다!`); return; }
    await learnMove(m, it.tm, (t2, o) => say(t2, o));
    return;
  }
  if (it.evo) { await useEvoItem(id); return; }                // v2.37 진화 도구(벼락돌·달돌·단청 칩·금덩이)
  if (!it.candy && !it.heal && !it.hpPct && !it.cure && !it.revive && !it.pp && !it.conf) { await say(it.hold ? "남켓몬에게 지니게 하면\n배틀에서 힘을 내 준다." : "지금은 쓸 수 없다."); return; }
  const t = await openParty("item"); if (t == null || t < 0) return;
  const m = G.party[t];
  if (it.candy) {
    if (m.lv >= 100) { await say("써도 효과가 없을 것 같다."); return; }
    G.take(id); const old = m.st.slice(); m.lv++; frLevel(m); m.exp = Math.max(m.exp, expAt(MON[m.k].gr, m.lv)); m.st = calcStats(m); m.hp = Math.min(m.st[0], m.hp + m.st[0] - old[0]);
    Audio2.jingle("jg_levelup");
    await say(`${J(mname(m), "은")}\n레벨 ${J(String(m.lv), "으로")} 올랐다!`);
    await statWindow(old, m.st);
    await learnAtLevel(m, (t2, o) => say(t2, o));
    const ev = evoFor(m);
    if (ev) { await fadeOut(10); await evolve(m, ev); }
    return;
  }
  let mi = null;
  if (it.pp) { if (m.hp <= 0) { await say("써도 효과가 없을 것 같다."); return; } mi = await pickMove(m, it); if (mi == null) return; }
  if (!canApply(id, m, mi)) { await say("써도 효과가 없을 것 같다."); return; }
  G.take(id);
  const msg = applyItem(id, m, mi);
  await say(msg);
}

// ---- v1.4 회중시계 (게임 시계) ----
const TOD_START = { 아침: 240, 낮: 600, 저녁: 1020, 밤: 1200 };
function clockText() { const d = gameNow(), h = d.getHours(), m = d.getMinutes();
  return `${timeOfDay()} ${h < 12 ? "오전" : "오후"} ${((h + 11) % 12) + 1}시 ${String(m).padStart(2, "0")}분`; }
function refreshTime() { if (World.M && World.M.outdoor && !World.def.noTint) World.weather = fieldWeather(World.zone); }
async function useWatch() {
  if (!G.clock) G.clock = { mode: "real", min: 600 };
  while (true) {
    const game = G.clock.mode === "game";
    const items = game ? ["실제 시각으로", "다음 때로 넘기기", "그만두다"] : ["게임 시계로", "그만두다"];
    const tb = await say(`지금은 ${clockText()}.\n${game ? "게임 시계가 흐르고 있다." : "실제 시각을 따르고 있다."}`, { keep: true });
    const v = await menu({ items, x: 132, y: 64, w: 122, cancel: true });
    Scenes.pop(tb);
    const k = items[v];
    if (v < 0 || k === "그만두다") return;
    if (k === "게임 시계로") { const d = new Date(); G.clock = { mode: "game", min: d.getHours() * 60 + d.getMinutes() }; sfx("select");
      await say("시계를 게임 시계로 바꿨다!\f게임 시계는 실제보다 빨리 흘러서\n24분이면 하루가 지난다."); }
    else if (k === "실제 시각으로") { G.clock.mode = "real"; sfx("select"); await say("시계를 실제 시각에 맞췄다."); }
    else if (k === "다음 때로 넘기기") {
      const order = ["아침", "낮", "저녁", "밤"], nx = order[(order.indexOf(timeOfDay()) + 1) % 4];
      G.clock.min = TOD_START[nx]; sfx("select"); refreshTime();
      await say(`시곗바늘을 돌렸다…\n${J(nx, "이")} 되었다!`); }
    refreshTime();
  }
}

// ---- 도감 ----
class Dex extends Modal {
  constructor() { super(); this.i = Dex.last || 0; this.top = Math.max(0, this.i - 3); this.opaque = true; }
  get max() { let mx = 0; for (const k in G.seen) mx = Math.max(mx, MON[k] ? MON[k].no : 0); return Math.max(mx, 1); }
  update(f) {
    if (!f) return; const n = this.max;
    if (Input.rep("up")) { this.i = (this.i + n - 1) % n; sfx("cursor"); }
    else if (Input.rep("down")) { this.i = (this.i + 1) % n; sfx("cursor"); }
    else if (Input.rep("left")) { this.i = Math.max(0, this.i - 7); sfx("cursor"); }
    else if (Input.rep("right")) { this.i = Math.min(n - 1, this.i + 7); sfx("cursor"); }
    else if (Input.ok()) { const k = MONS[this.i].k; if (G.seen[k]) { sfx("select"); Dex.last = this.i; showDexEntry(k); } else sfx("flee_fail"); }
    else if (Input.cancel()) { sfx("cancel"); Dex.last = this.i; this.done(); }
    if (this.i < this.top) this.top = this.i; if (this.i >= this.top + 8) this.top = this.i - 7;
  }
  draw() {
    bgPattern("#c03838", "#c84848");
    rect(0, 0, SW, 20, "#7a1a1a"); Font.draw(g, "남켓몬 도감", 8, 2, { col: TXT.white, sh: "#3a0a0a" });
    Font.draw(g, `본 수 ${Object.keys(G.seen).length}  잡은 수 ${Object.keys(G.caught).length}`, 250, 5, { font: "g9", col: "#f8e0e0", sh: null, align: "right" });
    panel(4, 24, 112, 112, "#e8f0f0");
    const k = MONS[this.i].k;
    if (G.seen[k]) monFront(k, 12, 30); else { Font.draw(g, "?", 60, 70, { align: "center" }); }
    panel(120, 24, 132, 164, "#fbf8f0");
    for (let r = 0; r < 8; r++) { const j = this.top + r; if (j >= this.max) break; const m = MONS[j]; const y = 30 + r * 19;
      if (j === this.i) rect(122, y - 2, 128, 18, "#f8e8a0");
      Font.draw(g, String(m.no).padStart(3, "0"), 140, y + 2, { font: "g9" });
      if (G.caught[m.k]) sprite(IMG.misc, JSN.misc.t.ball_icon * 16, 0, 16, 16, 122, y - 1);
      Font.draw(g, G.seen[m.k] ? m.n : "-----", 166, y); }
    frame(2, 140, 116, 50);
    Font.draw(g, "A 자세히  B 닫기", 10, 148, { font: "g9" }); Font.draw(g, "◀▶ 7칸씩", 10, 162, { font: "g9" });
  }
}
async function openDex() { return show(new Dex()); }
// ---- 긴 글 상자(위아래로 넘겨 읽기) — 생태도감·옛이야기·타운맵 ----
// blocks: [{t, font, col, sh, gap, label, lw, labCol}] → 줄 목록
function layoutDoc(blocks, w) {
  const L = [];
  for (const b of blocks) {
    if (!b || !b.t) continue;
    const font = b.font || "g11", lh = font === "g9" ? 13 : 15;
    if (b.gap) L.push({ s: "", h: b.gap });
    const lw = b.label ? (b.lw || 54) : 0;
    Font.wrap(b.t, w - lw, font).forEach((s2, i) => L.push({ s: s2, font, x: lw, h: lh, col: b.col, sh: b.sh, lab: i === 0 ? b.label : null, labCol: b.labCol }));
  }
  return L;
}
function drawDoc(L, x, y, h, top) {
  let yy = y;
  for (let i = top; i < L.length; i++) { const l = L[i]; if (yy + l.h > y + h + 1) break;
    if (l.lab) Font.draw(g, l.lab, x, yy, { font: l.font, col: l.labCol || "#4a7a3a", sh: null });
    if (l.s) Font.draw(g, l.s, x + l.x, yy, { font: l.font, col: l.col || TXT.dark, sh: l.sh === undefined ? TXT.sh : l.sh });
    yy += l.h; }
}
function docMax(L, h) { let s2 = 0, top = L.length; for (let i = L.length - 1; i >= 0; i--) { s2 += L[i].h; if (s2 > h + 1) break; top = i; } return Math.min(top, L.length); }
function upArrow(x, y) { const b = (FRAME >> 4) & 1; for (let i = 0; i < 4; i++) rect(x + 3 - i, y - b + i, 1 + i * 2, 1, "#d04030"); }
function pageTag(i, n, x, y, col = "#ffffff") { if (n < 2) return; Font.draw(g, (i > 0 ? "◀ " : "") + (i + 1) + "/" + n + (i < n - 1 ? " ▶" : ""), x, y, { font: "g9", col, sh: null, align: "right" }); }

// ---- 도감 한 마리: ① 남켓몬 도감 ② 남원 생태도감(모티브가 된 실제 생물·전통) ③ 옛이야기 ----
const ECO_KIND = { "생물": ["생물", "#4f8a3e"], "전통·문화": ["전통 문화", "#b0603a"], "민담·설화": ["옛이야기", "#7a5aa0"], "자연현상": ["자연 현상", "#3a7ab0"], "지형·지질": ["산과 땅", "#8a7040"] };
class DexEntry extends Modal {
  constructor(k, fresh) { super(); this.k = k; this.fresh = fresh; this.opaque = true; this.pg = 0; this.top = 0; this.L = null; Audio2.cry(k); }
  get m() { return MON[this.k]; }
  get caught() { return !!(G.caught[this.k] || this.fresh); }
  get pages() { const P = ["dex", "area"]; if (this.caught && this.m.eco) { P.push("eco"); if (this.m.story) P.push("story"); } return P; }   // v1.9 분포(실제 게임처럼)
  get bodyH() { return this.pages[this.pg] === "eco" ? 117 : 156; }
  get doc() {
    if (this.L) return this.L;
    const m = this.m, e = m.eco || {}, pg = this.pages[this.pg];
    if (pg === "eco") { const rows = [e.status && { t: e.status, font: "g9", label: "보호", labCol: "#c03a2a", col: "#c03a2a", sh: null },
      e.size && { t: e.size, font: "g9", label: "크기" }, e.when && { t: e.when, font: "g9", label: "만나는 때" },
      e.where && { t: e.where, font: "g9", label: e.kind === "생물" ? "사는 곳" : "있는 곳" }].filter(Boolean);
      this.L = layoutDoc([...rows, { t: e.text, font: "g11", gap: rows.length ? 5 : 0 }], 232); }
    else if (pg === "story") this.L = layoutDoc([{ t: m.story, font: "g11" }], 232);
    else this.L = [];
    return this.L;
  }
  get max() { return docMax(this.doc, this.bodyH); }
  turn(d) { const p = this.pg + d; if (p < 0 || p >= this.pages.length) return false; this.pg = p; this.top = 0; this.L = null; sfx("cursor"); return true; }
  update(f) {
    if (!f) return;
    if (Input.rep("right")) this.turn(1);
    else if (Input.rep("left")) this.turn(-1);
    else if (Input.rep("down")) { if (this.top < this.max) { this.top++; sfx("cursor"); } }
    else if (Input.rep("up")) { if (this.top > 0) { this.top--; sfx("cursor"); } }
    else if (Input.ok()) { if (this.top < this.max) { this.top = Math.min(this.max, this.top + 5); sfx("cursor"); } else if (!this.turn(1)) { sfx("cancel"); this.done(); } }
    else if (Input.cancel()) { sfx("cancel"); this.done(); }
  }
  draw() {
    const pg = this.pages[this.pg];
    if (pg === "eco") return this.drawEco();
    if (pg === "area") return this.drawArea();
    if (pg === "story") return this.drawStory();
    const m = this.m, caught = this.caught, n = this.pages.length;
    bgPattern("#d8c8a0", "#e0d2b0");
    panel(4, 4, 104, 98, "#e8f0f0"); monFront(this.k, 8, 4);
    panel(112, 4, 140, 98, "#fbf8f0");
    Font.draw(g, "No." + String(m.no).padStart(3, "0"), 120, 9); Font.draw(g, m.n, 120, 24);
    if (caught) m.t.forEach((t, j) => typeBadge(t, 120 + j * 38, 43));
    Font.draw(g, "모티브", 120, 59, { font: "g9", col: "#8a6a3a", sh: null });
    Font.wrap(m.motif, 124, "g9").slice(0, 2).forEach((l, j) => Font.draw(g, l, 120, 71 + j * 12, { font: "g9", col: TXT.gray, sh: null }));
    frame(2, 104, 252, 86);
    if (caught) Font.wrap(m.dex, 232, "g11").slice(0, 5).forEach((l, j) => Font.draw(g, l, 12, 111 + j * 15));
    else Font.draw(g, "잡으면 자세한 이야기를 볼 수 있어요.", 12, 138, { font: "g9" });
    if (n > 1) Font.draw(g, "▶ 분포", 246, 176, { font: "g9", col: "#4a7a3a", sh: null, align: "right" });
  }
  areas() {          // 이 남켓몬이 나오는 곳(출현표) + 타운맵 위치
    if (this._ar) return this._ar;
    const T = DATA.town, k = this.k, out = [];
    const pos = z => { const m = /^(\d+)번도로$/.exec(z); if (m) { const r = T.routes.find(r => r.no === +m[1]); return r ? [r.x, r.y] : null; }
      const p = T.places.find(p => p.n === z || z.includes(p.n) || p.n.includes(z)); return p ? [p.x, p.y] : null; };
    for (const [z, arr] of Object.entries(DATA.spawns)) for (const e of arr) if (e.k === k && z !== "덕과 아카데미") out.push({ z, t: e.t, r: e.r, p: pos(z) });
    if (typeof FISH !== "undefined") for (const F of Object.values(FISH)) for (const e of F.list) if (e.k === k) out.push({ z: F.at + " 낚시", t: e.t, r: e.r, p: pos(F.at) });
    return (this._ar = out);
  }
  drawArea() {
    const A = this.areas(), m = this.m;
    if (IMG.townmap) g.drawImage(IMG.townmap, 0, 0, 768, 576, 0, 0, SW, SH); else rect(0, 0, SW, SH, "#6a9a5a");
    rect(0, 0, SW, SH, "rgba(10,20,30,.28)");
    const on = (FRAME >> 4) & 1, RC = { "흔함": "#f8d040", "가끔": "#f89040", "드묾": "#f05080", "아주 드묾": "#c060f0" };
    for (const a of A) if (a.p) { const x = a.p[0] / 100 * SW, y = a.p[1] / 100 * SH, c = RC[a.r] || "#f8d040";
      rect(x - 4, y - 4, 8, 8, on ? "#ffffff" : c); rect(x - 3, y - 3, 6, 6, c); }
    rect(0, 0, SW, 18, "#2a4a6a"); Font.draw(g, `분포 · ${m.n}`, 8, 1, { col: "#ffffff", sh: "#10202a" });
    pageTag(this.pg, this.pages.length, 250, 4, "#d0e4f8");
    frame(2, 140, 252, 50);
    if (!A.length) { Font.draw(g, "분포 불명", 12, 146); Font.draw(g, "풀숲에서는 만날 수 없는 남켓몬이다.", 12, 164, { font: "g9", col: TXT.gray, sh: null }); return; }
    const n = A.length > 4 ? 3 : A.length;          // v2.0 낚시가 더해져 길어지면 넷째 칸에 '외 n곳'
    A.slice(0, n).forEach((a, i) => { const x = 10 + (i % 2) * 122, y = 146 + Math.floor(i / 2) * 20; rect(x, y + 4, 6, 6, RC[a.r] || "#f8d040");
      Font.draw(g, a.z, x + 10, y, { font: "g9" }); Font.draw(g, `${a.t === "모두" ? "" : a.t + "·"}${a.r}`, x + 112, y, { font: "g9", align: "right", col: TXT.gray, sh: null }); });
    if (A.length > 4) Font.draw(g, `외 ${A.length - 3}곳`, 142, 166, { font: "g9", col: TXT.gray, sh: null });
  }
  drawEco() {
    const m = this.m, e = m.eco, [kl, kc] = ECO_KIND[e.kind] || [e.kind, "#4f8a3e"];
    bgPattern("#9cc48a", "#a6cc94");
    rect(0, 0, SW, 18, "#3e6a3a"); Font.draw(g, "남원 생태도감", 8, 1, { col: "#ffffff", sh: "#1e3a1e" });
    pageTag(this.pg, this.pages.length, 250, 4, "#e0f0d0");
    panel(4, 21, 248, 38, "#f8f8ec");
    drawIcon(this.k, 6, 24);
    const kw = Font.width(kl, "g9") + 8; rect(44, 25, kw, 12, kc); Font.draw(g, kl, 48, 25, { font: "g9", col: "#ffffff", sh: null });
    Font.draw(g, e.group || "", 48 + kw, 25, { font: "g9", col: "#6a7a5a", sh: null });
    const big = Font.width(e.name, "g11") <= 200;
    Font.draw(g, e.name, 44, big ? 39 : 41, { font: big ? "g11" : "g9" });
    panel(4, 62, 248, 127, "#fbfbf4");
    drawDoc(this.doc, 12, 67, this.bodyH, this.top);
    if (this.top > 0) upArrow(240, 65); if (this.top < this.max) downArrow(240, 181);
  }
  drawStory() {
    const m = this.m, e = m.eco;
    bgPattern("#e2cfa8", "#e8d8b6");
    rect(0, 0, SW, 18, "#7a4a2a"); Font.draw(g, "옛이야기", 8, 1, { col: "#ffffff", sh: "#3a1a0a" });
    Font.draw(g, e.name, 64, 4, { font: "g9", col: "#f8e0c0", sh: null });
    pageTag(this.pg, this.pages.length, 250, 4, "#f8e0c0");
    panel(4, 21, 248, 168, "#fbf6ea");
    drawDoc(this.doc, 12, 27, this.bodyH, this.top);
    if (this.top > 0) upArrow(240, 25); if (this.top < this.max) downArrow(240, 181);
  }
}
async function showDexEntry(k, fresh) { return show(new DexEntry(k, fresh)); }

// ---- 트레이너 카드 ----
class TrainerCard extends Modal {
  constructor() { super(); this.opaque = true; }
  update(f) { if (f && (Input.ok() || Input.cancel())) { sfx("cancel"); this.done(); } }
  draw() {
    bgPattern("#3a5a8a", "#44669a");
    panel(10, 14, 236, 164, "#f0e8d0", "#2a3a5a"); rect(12, 16, 232, 18, "#c8a050"); Font.draw(g, "트레이너 카드", 18, 17, { col: "#fff", sh: "#7a5a20" });
    Font.draw(g, "ID No. " + String(G.id).padStart(5, "0"), 236, 19, { font: "g9", align: "right", col: "#fff", sh: null });
    const rows = [["이름", G.name], ["돈", G.money.toLocaleString() + "원"], ["도감", Object.keys(G.caught).length + "마리"], ["플레이 시간", `${Math.floor(G.time / 3600)}:${String(Math.floor(G.time / 60) % 60).padStart(2, "0")}`]];
    rows.forEach(([a, b], k) => { Font.draw(g, a, 22, 42 + k * 20); Font.draw(g, b, 170, 42 + k * 20, { align: "right" }); rect(20, 58 + k * 20, 152, 1, "#c8b890"); });
    const tim = IMG["tr_" + (G.gender === "f" ? "player_f_front" : "player_m_front")];
    if (tim) trImg(tim, Math.floor(FRAME / 6), 164, 36);
    Font.draw(g, "어사패", 22, 128, { font: "g9" });
    for (let i = 0; i < 8; i++) { const x = 28 + i * 26, got = (G.badges || []).includes(i + 1);
      if (IMG.badges) sprite(IMG.badges, i * 20, got ? 0 : 20, 20, 20, x, 146);
      else { g.fillStyle = "#c8b890"; g.beginPath(); g.arc(x + 10, 156, 9, 0, 7); g.fill(); } }
  }
}

// ---- 설정 ----
class Options extends Modal {
  constructor() { super(); this.i = 0; this.opaque = true; }
  get rows() { const o = Save.opt; return [
    ["글자 속도", ["느림", "보통", "빠름"], "speed"], ["배틀 애니메이션", ["켜기", "끄기"], "anim", true], ["배틀 방식", ["교체", "계속"], "style"],
    ["늘 달리기", ["켜기", "끄기"], "autorun", true], ["배경 음악", null, "music"], ["효과음", null, "sfx"], ["창 테두리", FRAMES.map(f => f.name), "frame"], ["닫기"]]; }
  update(f) {
    if (!f) return; const R = this.rows, o = Save.opt;
    if (Input.rep("up")) { this.i = (this.i + R.length - 1) % R.length; sfx("cursor"); }
    else if (Input.rep("down")) { this.i = (this.i + 1) % R.length; sfx("cursor"); }
    else if (Input.rep("left") || Input.rep("right")) {
      const r = R[this.i]; if (!r[2]) return; const d = Input.rep("left") || Input.down.left ? -1 : 1;
      if (r[1]) { const n = r[1].length; if (r[3]) o[r[2]] = o[r[2]] ? 0 : 1; else o[r[2]] = (o[r[2]] + n + d) % n; }
      else { o[r[2]] = clamp(Math.round((o[r[2]] + d * 0.1) * 10) / 10, 0, 1); Audio2.vol(); }
      sfx("cursor"); Save.saveOpt();
    }
    else if (Input.ok() && this.i === R.length - 1) { sfx("select"); this.done(); }
    else if (Input.cancel()) { sfx("cancel"); Save.saveOpt(); this.done(); }
  }
  draw() {
    bgPattern("#5a7a5a", "#648464");
    frame(8, 6, 240, 22); Font.draw(g, "설정", 128, 9, { align: "center" });
    frame(8, 30, 240, 128);
    const o = Save.opt;
    this.rows.forEach((r, k) => { const y = 37 + k * 15; Font.draw(g, r[0], 24, y); if (k === this.i) cursor(14, y + 3);
      if (!r[2]) return;
      let v; if (r[1]) v = r[1][r[3] ? (o[r[2]] ? 0 : 1) : o[r[2]]]; else v = "■".repeat(Math.round(o[r[2]] * 10)) + "□".repeat(10 - Math.round(o[r[2]] * 10));
      if (!r[1]) { for (let i = 0; i < 10; i++) rect(150 + i * 8, y + 4, 6, 8, i < Math.round(o[r[2]] * 10) ? "#d04030" : "#c8c8c0"); }
      else Font.draw(g, "◀ " + v + " ▶", 238, y, { align: "right", col: "#d04030", sh: TXT.rsh }); });
    frame(8, 160, 240, 30, o.frame); Font.draw(g, "Z: 결정  X: 취소·달리기  C/Enter: 메뉴", 128, 168, { align: "center", font: "g9" });
  }
}

// ---- 리포트(저장) ----
async function doSave() {
  const info = new Overlay(() => { frame(2, 2, 150, 97); const L = [["장소", World.zone || "?"], ["날씨", World.fieldWx() ? WX[World.weather].n : World.M && World.M.outdoor ? "맑음" : "-"], ["이름", G.name], ["어사패", G.badges.length + "개"], ["도감", Object.keys(G.caught).length + "마리"], ["시간", `${Math.floor(G.time / 3600)}:${String(Math.floor(G.time / 60) % 60).padStart(2, "0")}`]];
    L.forEach(([a, b], k) => { Font.draw(g, a, 10, 7 + k * 15, { font: "g9" }); Font.draw(g, b, 144, 7 + k * 15, { font: "g9", align: "right" }); }); });
  Scenes.push(info);
  try {
    if (!await yes("지금까지의 활약을\n리포트에 기록하겠습니까?")) return false;
    if (Save.has() && !await yes("이미 다른 리포트가 있습니다.\n덮어써도 괜찮습니까?")) return false;
    const tb = await say("리포트를 쓰고 있습니다……\n전원을 끄지 마십시오.", { keep: true });
    await wait(900);
    const ok = Save.write(saveData());
    Scenes.pop(tb);
    sfx("save");
    await say(ok ? `${J(G.name, "은")}\n리포트에 제대로 기록했다!` : "리포트를 기록하지 못했다…\n(이 브라우저는 저장을 막고 있어요)");
    return true;
  } finally { Scenes.pop(info); }
}
function saveData() { const P = World.player; return { v: 1, G: { ...G, map: G.map, x: P.x, y: P.y, dir: P.dir }, uid: UID }; }
function loadData(d) { Object.assign(G, d.G); UID = d.uid || 1000;
  // v1.1 특성 리밸런싱: 지금 종에 없는 특성을 가진 남켓몬은 새 일반 특성으로 바꿔 준다
  PCB.ensure();
  for (const m of [...(G.party || []), ...PCB.all()]) { const sp = MON[m.k]; if (sp && !sp.ab[0].includes(m.ab) && sp.ab[1] !== m.ab) m.ab = pick(sp.ab[0]); } }

// ---- PC ----
// usePC: v1.8.1부터 js/pcbox.js(실제 게임처럼 상자 화면)

// ---- 가게 ----
async function shop(stock) {
  let first = true;
  while (true) {
    const mb = new Overlay(() => moneyBox()); Scenes.push(mb);
    const v = await ask(first ? "어서 오세요!\n무엇을 도와드릴까요?" : "더 필요한 건 없으세요?", ["사러 왔다", "팔러 왔다", "그만두다"]);
    first = false;
    if (v === 0) {
      while (true) {
        let cur = 0;
        const desc = new Overlay(() => { frame(2, 142, 252, 48); const id = stock[cur]; if (id) { drawItemIcon(id, 10, 154); Font.wrap(ITEMS[id].d, 206, "g9").slice(0, 3).forEach((l, k) => Font.draw(g, l, 40, 148 + k * 12, { font: "g9" })); } });
        Scenes.push(desc);
        const j = await menu({ items: stock.map(id => ({ label: ITEMS[id].n, sub: ITEMS[id].price + "원" })).concat([{ label: "그만두다" }]), x: 102, y: 2, w: 152, rows: 7, onMove: i => cur = i });
        Scenes.pop(desc);
        if (j < 0 || j >= stock.length) break;
        const id = stock[j], it = ITEMS[id];
        const max = Math.min(99, Math.floor(G.money / it.price));
        if (max <= 0) { await say("돈이 모자랍니다."); continue; }
        const tb = await say(`${it.n} 말씀이시군요.\n몇 개 드릴까요?`, { keep: true });
        const n = await pickNum({ max, price: it.price, x: 140, y: 106, w: 112 });
        Scenes.pop(tb);
        if (!n) continue;
        if (!await yes(`${it.n} ${n}개, 합계 ${(it.price * n).toLocaleString()}원입니다.\n괜찮으십니까?`)) continue;
        G.money -= it.price * n; G.give(id, n); sfx("money");
        await say("네, 감사합니다!");
        if (id === "namket" && n >= 10) { G.give("gift", 1); await say("남켓볼을 많이 사 주셨으니\n기념볼을 하나 덤으로 드릴게요!"); }
      }
    } else if (v === 1) {
      const ids = Object.keys(G.bag).filter(id => ITEMS[id] && ITEMS[id].p !== "key" && ITEMS[id].price);
      if (!ids.length) { await say("팔 만한 물건이 없으시네요."); Scenes.pop(mb); continue; }
      const j = await menu({ items: ids.map(id => ({ label: ITEMS[id].n, sub: "×" + G.bag[id] })).concat([{ label: "그만두다" }]), x: 102, y: 2, w: 152, rows: 7 });
      if (j >= 0 && j < ids.length) {
        const id = ids[j], it = ITEMS[id], half = Math.floor(it.price / 2);
        const n = await pickNum({ max: G.bag[id], price: half, x: 140, y: 106, w: 112 });
        if (n && await yes(`${it.n} ${n}개를\n${(half * n).toLocaleString()}원에 사겠습니다. 괜찮으십니까?`)) { G.take(id, n); G.money += half * n; sfx("money"); await say("감사합니다!"); }
      }
    }
    Scenes.pop(mb);
    if (v === 2 || v < 0) break;
  }
  await say("또 오세요!");
}

// ---- 타운맵: 커서로 마을·명소·도로를 골라 설명과 '실제 남원' 이야기를 본다 ----
const TOWN_ZONE = { "춘향제 마당": "dahong", "2번도로": "r2", "오리정": "r2", "소색마을": "sosaek", "1번도로": "r1", "요천 둔치": "r1", "다홍시티": "dahong", "광한루원": "gwanghanru", "덕과 아카데미": "academy" };
const TOWN_KIND = { city: "시티", town: "마을", spot: "명소", league: "리그", route: "도로" };
function townHere() {
  if (!World.M) return null;
  let zn = World.zone; const d = World.def;
  const OM = d.indoor && d.exit && MAPS[d.exit[0]];
  if (OM) { zn = OM.name; for (const z of OM.zones || []) if (d.exit[1] >= z[1] && d.exit[1] <= z[3] && d.exit[2] >= z[2] && d.exit[2] <= z[4]) { zn = z[0]; break; } }
  return (d.indoor && TOWN_ZONE[d.name]) || TOWN_ZONE[zn] || null;
}
class TownMap extends Modal {
  constructor() {
    super(); this.opaque = true; this.det = false; this.top = 0; this.L = null;
    const T = DATA.town;
    this.pts = [...T.places.map(p => ({ ...p, id: p.k, px: p.x / 100 * SW, py: p.y / 100 * SH })),
      ...T.routes.map(r => ({ ...r, id: "r" + r.no, n: r.no + "번도로", kind: "route", px: r.x / 100 * SW, py: r.y / 100 * SH }))];
    this.here = townHere();
    this.i = Math.max(0, this.pts.findIndex(p => p.id === (this.here || "sosaek")));
  }
  get cur() { return this.pts[this.i]; }
  move(dx, dy) {
    const c = this.cur; let best = -1, bs = 1e9;
    this.pts.forEach((p, j) => { if (j === this.i) return; const vx = p.px - c.px, vy = p.py - c.py, along = vx * dx + vy * dy, perp = Math.abs(vx * dy - vy * dx);
      if (along < 2) return; const sc = along + perp * 2.2; if (sc < bs) { bs = sc; best = j; } });
    if (best >= 0) { this.i = best; sfx("cursor"); }
  }
  get doc() {
    if (this.L) return this.L;
    const p = this.cur, B = [];
    B.push({ t: p.real, font: "g9", label: "실제 지역" });
    if (p.kind === "route") { B.push({ t: p.link, font: "g9", label: "잇는 곳" }); B.push({ t: "Lv " + p.lv, font: "g9", label: "야생" }); }
    if (p.gym) B.push({ t: p.gym[0] === "리그" ? "산지기 4명과 챔피언" : `${p.gym[0]}번째 배움터 · ${p.gym[1]} 타입`, font: "g9", label: p.gym[0] === "리그" ? "리그" : "배움터" });
    if (p.why) B.push({ t: p.why, font: "g9", label: "이름의 색" });
    B.push({ t: p.d, font: "g11", gap: 4 });
    if (p.fact) { B.push({ t: "실제 남원 이야기", font: "g9", col: "#2a6a9a", sh: null, gap: 6 }); B.push({ t: p.fact, font: "g11" }); }
    return this.L = layoutDoc(B, 228);
  }
  get max() { return docMax(this.doc, 146); }
  update(f) {
    if (!f) return;
    if (this.det) {
      if (Input.rep("down")) { if (this.top < this.max) { this.top++; sfx("cursor"); } }
      else if (Input.rep("up")) { if (this.top > 0) { this.top--; sfx("cursor"); } }
      else if (Input.ok()) { if (this.top < this.max) { this.top = Math.min(this.max, this.top + 5); sfx("cursor"); } else { this.det = false; sfx("cancel"); } }
      else if (Input.cancel()) { this.det = false; sfx("cancel"); }
      return;
    }
    if (Input.rep("up")) this.move(0, -1); else if (Input.rep("down")) this.move(0, 1);
    else if (Input.rep("left")) this.move(-1, 0); else if (Input.rep("right")) this.move(1, 0);
    else if (Input.ok()) { this.det = true; this.top = 0; this.L = null; sfx("select"); }
    else if (Input.cancel()) { sfx("cancel"); this.done(); }
  }
  draw() {
    if (IMG.townmap) g.drawImage(IMG.townmap, 0, 0, 768, 576, 0, 0, SW, SH);
    const blink = (FRAME >> 4) & 1;
    const h = this.pts.find(p => p.id === this.here);
    if (h && blink) { rect(h.px - 3, h.py - 3, 6, 6, "#f8f8f8"); rect(h.px - 2, h.py - 2, 4, 4, "#2060d0"); }
    const c = this.cur, r = { city: 7, league: 7, town: 6, spot: 4, route: 4 }[c.kind] || 4;
    const col = blink ? "#f8f040" : "#e04030";
    rect(c.px - r - 1, c.py - r - 1, r * 2 + 2, 2, col); rect(c.px - r - 1, c.py + r - 1, r * 2 + 2, 2, col);
    rect(c.px - r - 1, c.py - r - 1, 2, r * 2 + 2, col); rect(c.px + r - 1, c.py - r - 1, 2, r * 2 + 2, col);
    if (this.det) return this.drawDet();
    const by = c.py > 128 ? 2 : 156;
    frame(2, by, 252, 34);
    Font.draw(g, c.n, 10, by + 3);
    Font.draw(g, TOWN_KIND[c.kind] || "", 10 + Font.width(c.n) + 6, by + 6, { font: "g9", col: "#8a6a3a", sh: null });
    Font.draw(g, c.real, 10, by + 19, { font: "g9", col: TXT.gray, sh: null });
    Font.draw(g, "A 자세히  B 닫기", 246, by + 6, { font: "g9", col: "#4a7a3a", sh: null, align: "right" });
    if (c.id === this.here) Font.draw(g, "지금 있는 곳", 246, by + 19, { font: "g9", col: "#2060d0", sh: null, align: "right" });
  }
  drawDet() {
    const c = this.cur;
    frame(4, 4, 248, 184);
    if (c.hex) { rect(14, 12, 10, 10, "#3a3a46"); rect(15, 13, 8, 8, c.hex); }
    Font.draw(g, c.n, c.hex ? 30 : 14, 9);
    Font.draw(g, TOWN_KIND[c.kind] || "", (c.hex ? 30 : 14) + Font.width(c.n) + 6, 12, { font: "g9", col: "#8a6a3a", sh: null });
    rect(14, 27, 228, 1, "#d8d0c0");
    drawDoc(this.doc, 14, 32, 146, this.top);
    if (this.top > 0) upArrow(238, 30); if (this.top < this.max) downArrow(238, 178);
  }
}
