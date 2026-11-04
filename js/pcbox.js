// ===== v1.8.1 센터 PC: 실제 포켓몬 게임(4세대)처럼 — PC 켜기 → 누구의 PC → 남켓몬 보관 시스템(상자 화면) =====
// 사용자: "PC를 클릭해서 맡기고 데려오는 시스템을 실제 포켓몬의 UI, UX와 유사하게"
// 상자 8개 × 30칸(6×5), 상자마다 이름·벽지. 맡기기 / 데려가기 / 정리하기(손으로 들어 옮기기·바꾸기), 요약 보기, 놓아주기
"use strict";

const PCB = {
  N: 8, SZ: 30,
  WP: ["숲", "요천", "한옥", "노을", "별밤", "꽃밭", "모래톱", "단청"],
  ensure() {
    if (!Array.isArray(G.boxes) || !G.boxes.length) {
      G.boxes = Array.from({ length: this.N }, (_, i) => ({ n: "상자 " + (i + 1), wp: i % this.WP.length, m: Array(this.SZ).fill(null) }));
      G.boxCur = 0;
    }
    if (G.box && G.box.length) {            // 예전 저장(상자 하나짜리 목록) 옮기기
      const old = G.box; G.box = [];
      for (const m of old) { const b = G.boxes.find(b => b.m.includes(null)); if (b) b.m[b.m.indexOf(null)] = m; }
    }
    if (!G.pcItems) G.pcItems = {};
  },
  all() { this.ensure(); return G.boxes.flatMap(b => b.m.filter(Boolean)); },
  free() { this.ensure(); return G.boxes.reduce((s, b) => s + b.m.filter(x => !x).length, 0); },
  count(bi) { return G.boxes[bi].m.filter(Boolean).length; },
  put(m, from) {                            // 지금 상자부터 빈칸을 찾아 넣음(실제 게임처럼). 넣은 상자 번호
    this.ensure(); const n = G.boxes.length, b0 = from ?? G.boxCur;
    for (let k = 0; k < n; k++) { const bi = (b0 + k) % n, b = G.boxes[bi], i = b.m.indexOf(null); if (i >= 0) { b.m[i] = m; return bi; } }
    return -1;
  },
};

// ---- 벽지 (상자마다 다름) ----
function drawWallpaper(wp, x, y, w, h) {
  const R = (n) => { const v = Math.sin(n * 12.9898) * 43758.5453; return v - Math.floor(v); };
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  const K = PCB.WP[wp];
  if (K === "숲") { rect(x, y, w, h, "#9ccf7a"); for (let i = 0; i < 14; i++) { const tx = x + (i * 37) % w, ty = y + 8 + (i * 53) % (h - 10); rect(tx, ty + 6, 2, 5, "#6a4a2a"); rect(tx - 4, ty, 10, 7, "#5aa04a"); rect(tx - 2, ty - 3, 6, 3, "#6ab85a"); } }
  else if (K === "요천") { rect(x, y, w, h, "#8cc4e8"); for (let r = 0; r < h; r += 10) for (let c = (r / 10) % 2 ? 6 : 0; c < w; c += 14) { rect(x + c, y + r + 4, 6, 1, "#c4e4f8"); rect(x + c + 2, y + r + 3, 3, 1, "#c4e4f8"); } }
  else if (K === "한옥") { rect(x, y, w, h, "#e8d8b8"); for (let r = 0; r < h; r += 12) { rect(x, y + r, w, 3, "#5a5a6a"); for (let c = 0; c < w; c += 8) rect(x + c, y + r + 3, 1, 2, "#3a3a46"); } for (let c = 0; c < w; c += 26) rect(x + c, y, 1, h, "#c8b088"); }
  else if (K === "노을") { const C = ["#f8c070", "#f4a868", "#ec8c68", "#d87070", "#a86a88"]; for (let i = 0; i < 5; i++) rect(x, y + Math.round(i * h / 5), w, Math.ceil(h / 5), C[i]); rect(x + w - 40, y + 18, 16, 16, "#fff0b0"); }
  else if (K === "별밤") { rect(x, y, w, h, "#24305a"); for (let i = 0; i < 40; i++) rect(x + Math.floor(R(i) * w), y + Math.floor(R(i + 7) * h), 1, 1, i % 5 ? "#c8d4ff" : "#fff6a0"); rect(x + 20, y + 13, 6, 10, "#f4f0c8"); rect(x + 19, y + 15, 1, 6, "#f4f0c8"); rect(x + 26, y + 15, 1, 6, "#f4f0c8"); rect(x + 23, y + 13, 4, 8, "#24305a"); }
  else if (K === "꽃밭") { rect(x, y, w, h, "#f4d8e4"); for (let i = 0; i < 30; i++) { const fx = x + Math.floor(R(i) * w), fy = y + Math.floor(R(i + 3) * h); rect(fx - 1, fy, 3, 1, i % 2 ? "#e87aa0" : "#f4b040"); rect(fx, fy - 1, 1, 3, i % 2 ? "#e87aa0" : "#f4b040"); rect(fx, fy, 1, 1, "#fff8d0"); } }
  else if (K === "모래톱") { rect(x, y, w, h, "#ecdcae"); rect(x, y + h - 20, w, 20, "#8cc4e8"); for (let i = 0; i < 26; i++) rect(x + Math.floor(R(i) * w), y + Math.floor(R(i + 5) * (h - 24)), 2, 1, "#c8b47e"); }
  else { rect(x, y, w, h, "#2e7a5a"); for (let c = 0; c < w; c += 16) { rect(x + c, y, 8, h, "#c84a3a"); rect(x + c + 2, y, 4, h, "#e8b040"); } for (let r = 0; r < h; r += 20) rect(x, y + r, w, 2, "#f4ecd8"); }
  g.restore();
}
// 손 커서(아래를 가리키는 흰 장갑)
const HAND = ["....kkkk....", "...kwwwwk...", "..kwwwwwwk..", ".kwwwwwwwwk.", "kwwwwwwwwwwk", "kwwkwwkwwwwk", ".kwkwwkwwkk.", "..k.kwwk....", "....kwwk....", "....kwwk....", ".....kk....."];
function drawHand(x, y, grab) {
  const A = grab ? HAND.slice(0, 7).concat(["..kkkkkkkk..", "............", "............", "............"]) : HAND;
  A.forEach((row, j) => { for (let i = 0; i < row.length; i++) { const c = row[i]; if (c === "k") rect(x + i, y + j, 1, 1, "#2a2a36"); else if (c === "w") rect(x + i, y + j, 1, 1, j < 5 ? "#ffffff" : "#e8ecf4"); } });
}

class BoxScreen extends Modal {
  // mode: "deposit"(맡기기) · "withdraw"(데려가기) · "move"(정리하기)
  constructor(mode) {
    super(); PCB.ensure(); this.opaque = true; this.mode = mode; this.bi = G.boxCur || 0;
    this.area = mode === "deposit" ? "party" : "box"; this.cx = 0; this.cy = 0; this.pi = 0; this.btn = 0;
    this.partyOpen = mode !== "withdraw"; this.held = null; this.busy = false; this.slide = 0;
  }
  get box() { return G.boxes[this.bi]; }
  cellMon() { if (this.area === "box") return this.box.m[this.cy * 6 + this.cx]; if (this.area === "party") return G.party[this.pi] || null; return null; }
  turnBox(d) { this.bi = (this.bi + d + G.boxes.length) % G.boxes.length; G.boxCur = this.bi; this.slide = d * 12; sfx("cursor"); }
  fighting(except) { return G.party.filter(m => m !== except && m.hp > 0).length; }
  update(f) {
    if (!f || this.busy) return;
    if (this.slide) this.slide -= Math.sign(this.slide);
    const L = Input.rep("left"), R = Input.rep("right"), U = Input.rep("up"), D = Input.rep("down");
    const a = this.area;
    if (a === "header") {
      if (L) this.turnBox(-1); else if (R) this.turnBox(1);
      else if (D) { this.area = "box"; this.cy = 0; sfx("cursor"); }
      else if (Input.ok()) this.run(() => this.headerMenu());
    } else if (a === "box") {
      if (L) { if (this.cx > 0) this.cx--; else if (this.partyOpen) { this.area = "party"; this.pi = Math.min(5, Math.floor(this.cy * 3 / 5) * 2 + 1); } else this.turnBox(-1); sfx("cursor"); }
      else if (R) { if (this.cx < 5) this.cx++; else this.turnBox(1); sfx("cursor"); }
      else if (U) { if (this.cy > 0) this.cy--; else this.area = "header"; sfx("cursor"); }
      else if (D) { if (this.cy < 4) this.cy++; else { this.area = "btn"; this.btn = this.cx < 3 ? 0 : 1; } sfx("cursor"); }
    } else if (a === "party") {
      const c = this.pi % 2, r = Math.floor(this.pi / 2);
      if (L) { if (c === 1) this.pi--; sfx("cursor"); }
      else if (R) { if (c === 0) this.pi++; else { this.area = "box"; this.cx = 0; this.cy = Math.min(4, Math.round(r * 2)); } sfx("cursor"); }
      else if (U) { if (r > 0) this.pi -= 2; sfx("cursor"); }
      else if (D) { if (r < 2) this.pi += 2; else { this.area = "btn"; this.btn = 0; } sfx("cursor"); }
    } else if (a === "btn") {
      if (L) { if (this.btn > 0) this.btn--; sfx("cursor"); } else if (R) { if (this.btn < 1) this.btn++; sfx("cursor"); }
      else if (U) { if (this.btn === 0 && this.partyOpen) { this.area = "party"; this.pi = 4; } else { this.area = "box"; this.cy = 4; this.cx = this.btn ? 4 : 1; } sfx("cursor"); }
      else if (Input.ok()) {
        if (this.btn === 1) { this.run(() => this.tryExit()); return; }
        if (this.mode === "deposit") { sfx("flee_fail"); return; }
        this.partyOpen = !this.partyOpen; sfx(this.partyOpen ? "select" : "cancel");
        if (this.partyOpen) { this.area = "party"; this.pi = 0; }
      }
    }
    if (this.area !== "btn" && this.area !== "header" && Input.ok()) { this.run(() => this.pick()); return; }
    if (Input.cancel()) this.run(() => this.tryExit());
  }
  run(fn) { this.busy = true; Promise.resolve(fn()).finally(() => { this.busy = false; }); }
  async msg(t) { await say(t); }
  async tryExit() {
    if (this.held) { sfx("flee_fail"); await this.msg("남켓몬을 들고 있습니다!\f빈칸에 내려놓은 다음 나가요."); return; }
    sfx("cancel"); G.boxCur = this.bi; this.done(null);
  }
  async headerMenu() {
    const v = await menu({ items: ["상자 넘기기", "벽지 바꾸기", "그만두기"], x: 150, y: 22, w: 104 });
    if (v === 0) {
      const j = await menu({ items: G.boxes.map((b, i) => ({ label: b.n, sub: PCB.count(i) + "/30" })), x: 132, y: 4, w: 122, rows: 8, initial: this.bi });
      if (j >= 0) { this.bi = j; G.boxCur = j; }
    } else if (v === 1) {
      const j = await menu({ items: PCB.WP, x: 160, y: 4, w: 94, rows: 8, initial: this.box.wp, onMove: i => { this.box.wp = i; } });
      if (j >= 0) this.box.wp = j;
    }
  }
  async chooseBox(text) {             // 맡길 상자 고르기: ◀ 상자 ▶ (A 결정 · B 취소)
    const self = this; let b = this.bi;
    const sc = { update(f) { if (!f) return; if (Input.rep("left")) { b = (b + G.boxes.length - 1) % G.boxes.length; self.bi = b; sfx("cursor"); } else if (Input.rep("right")) { b = (b + 1) % G.boxes.length; self.bi = b; sfx("cursor"); }
        else if (Input.ok()) { sfx("select"); Scenes.pop(sc); sc.res(b); } else if (Input.cancel()) { sfx("cancel"); Scenes.pop(sc); sc.res(-1); } },
      draw() { frame(98, 22, 156, 40); Font.draw(g, text, 176, 26, { align: "center", font: "g9" }); const bx = G.boxes[b];
        Font.draw(g, "◀  " + bx.n + "  ▶", 176, 40, { align: "center" }); Font.draw(g, PCB.count(b) + "/30", 248, 42, { align: "right", font: "g9" }); } };
    sc.promise = new Promise(r => sc.res = r); Scenes.push(sc); return sc.promise;
  }
  async pick() {
    const m = this.cellMon(), inBox = this.area === "box", idx = inBox ? this.cy * 6 + this.cx : this.pi;
    // 정리하기: 들고 있으면 내려놓기·바꾸기
    if (this.held) return this.drop(inBox, idx);
    if (!m) { sfx("flee_fail"); return; }
    Audio2.cry(m.k);
    let items;
    if (this.mode === "withdraw" && inBox) items = ["데려간다", "요약 보기", "놓아준다", "그만둔다"];
    else if (this.mode === "deposit" && !inBox) items = ["맡긴다", "요약 보기", "놓아준다", "그만둔다"];
    else if (this.mode === "move") items = ["옮긴다", "요약 보기", "놓아준다", "그만둔다"];
    else items = ["요약 보기", "그만둔다"];
    const k = items[await menu({ items, x: 150, y: 66, w: 104 })];
    if (k === "요약 보기") {
      const list = inBox ? this.box.m.filter(Boolean) : G.party, j = list.indexOf(m);
      await show(new Summary(j, list));
    } else if (k === "데려간다") {
      if (G.party.length >= 6) { sfx("flee_fail"); await this.msg("파티가 가득 찼습니다!"); return; }
      this.box.m[idx] = null; G.party.push(m); sfx("pc_on"); await this.msg(`${J(mname(m), "을")} 데려갔다.`);
    } else if (k === "맡긴다") {
      if (G.party.length <= 1) { sfx("flee_fail"); await this.msg("마지막 남켓몬은 맡길 수 없습니다!"); return; }
      if (this.fighting(m) === 0) { sfx("flee_fail"); await this.msg("싸울 수 있는 남켓몬이\n없어지게 됩니다!"); return; }
      const b = await this.chooseBox("어느 상자에 맡기겠습니까?"); if (b < 0) return;
      const bx = G.boxes[b], i = bx.m.indexOf(null);
      if (i < 0) { sfx("flee_fail"); await this.msg(`'${bx.n}'은(는)\n가득 차 있습니다!`); return; }
      G.party.splice(this.pi, 1); bx.m[i] = m; this.bi = b; G.boxCur = b; sfx("pc_on");
      await this.msg(`${J(mname(m), "을")}\n'${bx.n}'에 맡겼다.`);
      this.pi = Math.min(this.pi, G.party.length - 1);
    } else if (k === "옮긴다") {
      if (!inBox && this.fighting(m) === 0) { sfx("flee_fail"); await this.msg("싸울 수 있는 남켓몬이\n없어지게 됩니다!"); return; }
      if (!inBox && G.party.length <= 1) { sfx("flee_fail"); await this.msg("마지막 남켓몬은\n옮길 수 없습니다!"); return; }
      this.held = m; this.from = { inBox, bi: this.bi, idx }; sfx("ball_open");
      if (inBox) this.box.m[idx] = null; else G.party.splice(idx, 1);
    } else if (k === "놓아준다") {
      if (!inBox && (G.party.length <= 1 || this.fighting(m) === 0)) { sfx("flee_fail"); await this.msg("그 남켓몬은 놓아줄 수 없습니다!"); return; }
      if ((await ask(`정말 ${J(mname(m), "을")}\n놓아주겠습니까?`, ["예", "아니오"], { initial: 1 })) !== 0) return;
      if (inBox) this.box.m[idx] = null; else { G.party.splice(idx, 1); this.pi = Math.min(this.pi, G.party.length - 1); }
      sfx("ball_poof"); await this.msg(`${J(mname(m), "을")} 놓아주었다.\f잘 가, ${mname(m)}!`);
    }
  }
  async drop(inBox, idx) {
    const m = this.held;
    if (inBox) {
      const there = this.box.m[idx];
      this.box.m[idx] = m; this.held = there || null; if (there) this.from = { inBox: true, bi: this.bi, idx };
    } else {
      const there = G.party[idx] || null;
      if (there) { G.party[idx] = m; this.held = there; }
      else { if (G.party.length >= 6) { sfx("flee_fail"); return; } G.party.push(m); this.held = null; this.pi = G.party.length - 1; }
      if (this.held && this.fighting(this.held) === 0) {          // 바꾼 뒤 파티에 싸울 남켓몬이 없으면 되돌림
        G.party[idx] = this.held; this.held = m; sfx("flee_fail"); await this.msg("싸울 수 있는 남켓몬이\n없어지게 됩니다!"); return; }
    }
    sfx("ball_click");
  }
  // ---- 그리기 ----
  draw() {
    rect(0, 0, SW, SH, "#2a3046");
    for (let y = 0; y < SH; y += 6) rect(0, y, SW, 1, "#30374f");
    const B = this.box, S = Math.round(this.slide * 6);
    // 머리: ◀ 상자 이름 ▶
    const hs = this.area === "header";
    panel(98, 2, 156, 18, hs ? "#f8e8a0" : "#e8eef8");
    Font.draw(g, B.n, 176, 4, { align: "center" });
    const bob = (FRAME >> 4) & 1;
    Font.draw(g, "◀", 104 - (hs ? bob : 0), 4, { col: "#3a5ad0", sh: null }); Font.draw(g, "▶", 240 + (hs ? bob : 0), 4, { col: "#3a5ad0", sh: null });
    // 상자 격자 + 벽지
    g.save(); g.beginPath(); g.rect(98, 22, 156, 132); g.clip(); g.translate(S, 0);
    drawWallpaper(B.wp, 98, 22, 156, 132); rect(98, 22, 156, 1, "#1a1e30");
    for (let i = 0; i < 30; i++) { const m = B.m[i], x = 99 + (i % 6) * 26, y = 24 + Math.floor(i / 6) * 26;
      if (m) drawIcon(m.k, x - 3, y - 5, this.area === "box" && i === this.cy * 6 + this.cx && !this.held ? 1 : 0); }
    g.restore();
    rect(97, 21, 158, 1, "#1a1e30"); rect(97, 154, 158, 1, "#1a1e30"); rect(97, 21, 1, 134, "#1a1e30"); rect(254, 21, 1, 134, "#1a1e30");
    // 왼쪽: 파티 판 또는 미리보기
    if (this.partyOpen) {
      panel(2, 2, 92, 152, "#c84a3a", "#5a1a14"); rect(4, 4, 88, 14, "#a83a2c"); Font.draw(g, "파티 남켓몬", 48, 4, { align: "center", col: "#fff", sh: "#5a1a14", font: "g9" });
      for (let i = 0; i < 6; i++) { const x = 6 + (i % 2) * 43, y = 22 + Math.floor(i / 2) * 44, m = G.party[i];
        panel(x, y, 41, 41, this.area === "party" && this.pi === i ? "#f8e8a0" : "#f0d8c8", "#5a1a14");
        if (m) { drawIcon(m.k, x + 4, y, this.area === "party" && this.pi === i && !this.held ? 1 : 0); Font.draw(g, "Lv" + m.lv, x + 20, y + 30, { font: "g7", align: "center", sh: null }); if (m.hp <= 0) rect(x + 3, y + 27, 35, 1, "#c03030"); } }
    } else this.drawPreview(this.cellMon() || this.held);
    // 아래: 안내 + 단추
    frame(2, 158, 164, 32);
    const mode = { deposit: "남켓몬 맡기기", withdraw: "남켓몬 데려가기", move: "남켓몬 정리하기" }[this.mode];
    const cm = this.cellMon();
    Font.draw(g, mode, 10, 160, { font: "g9", col: "#c84a3a", sh: null });
    Font.draw(g, this.held ? `${J(mname(this.held), "을")} 들고 있다` : cm ? `${mname(cm)}  Lv${cm.lv}` : this.area === "header" ? "◀ ▶ 상자 넘기기 · A 메뉴" : "A 고르기 · B 나가기", 10, 173, { font: "g9" });
    const bt = [this.mode === "deposit" ? "—" : "파티", "나가기"];
    bt.forEach((t, i) => { const x = 170 + i * 43; panel(x, 160, 41, 28, this.area === "btn" && this.btn === i ? "#f8e8a0" : "#e8eef8"); Font.draw(g, t, x + 20, 168, { align: "center", font: "g9" }); });
    // 손 커서
    let hx, hy;
    if (this.area === "box") { hx = 99 + this.cx * 26 + 7; hy = 24 + this.cy * 26 - 12; }
    else if (this.area === "party") { hx = 6 + (this.pi % 2) * 43 + 14; hy = 22 + Math.floor(this.pi / 2) * 44 - 8; }
    else if (this.area === "btn") { hx = 170 + this.btn * 43 + 14; hy = 150; }
    else { hx = 170; hy = 14; }
    const hb = (FRAME >> 3) & 1;
    if (this.held) drawIcon(this.held.k, hx - 10, hy - 14 + hb, 0);
    drawHand(hx, hy + hb, !!this.held);
  }
  drawPreview(m) {
    panel(2, 2, 92, 152, "#e8eef8", "#1a1e30");
    if (!m) { Font.draw(g, "빈칸", 48, 70, { align: "center", col: TXT.gray, sh: null }); return; }
    g.save(); g.beginPath(); g.rect(4, 4, 88, 92); g.clip(); rect(4, 4, 88, 92, "#d0e4f0"); monFront(m.k, -2, 2, 0, m.shiny); g.restore();
    rect(4, 96, 88, 16, "#3a3a46"); Font.draw(g, mname(m), 7, 96, { col: TXT.white, sh: TXT.wsh });
    if (m.gender) Font.draw(g, m.gender === "m" ? "♂" : "♀", 9 + Font.width(mname(m)), 96, { col: m.gender === "m" ? "#90b0ff" : "#ff9090", sh: null });
    Font.draw(g, "Lv" + m.lv, 90, 98, { font: "g9", col: TXT.white, sh: TXT.wsh, align: "right" });
    MON[m.k].t.forEach((t, j) => typeBadge(t, 6 + j * 42, 116, 40));
    Font.draw(g, "지닌 물건", 7, 132, { font: "g9", col: TXT.gray, sh: null });
    Font.draw(g, m.item ? itemName(m.item) : "없음", 7, 142, { font: "g9" });
  }
}

// ---- PC 켜기 (4세대처럼: 누군가의 PC · 나의 PC · 박사의 PC · 로그오프) ----
async function usePC() {
  PCB.ensure();
  const glow = pcGlowOn();
  try {
    sfx("pc_on");
    await say(`${J(G.name, "은")}\nPC의 전원을 켰다!`);
    while (true) {
      const items = ["누군가의 PC", `${G.name}의 PC`, "윤슬 박사의 PC", "로그오프"];
      const D = ["남켓몬을 맡기거나\n데려갈 수 있는 PC예요.", "도구를 맡기거나\n꺼낼 수 있는 PC예요.", "윤슬 박사님이\n도감을 평가해 줘요.", "PC를 끕니다."];
      let cur = 0; const desc = new Overlay(() => { frame(2, 142, 252, 48); Font.wrap(D[cur].replace("\n", " "), 232, "g11").slice(0, 2).forEach((l, k) => Font.draw(g, l, 12, 150 + k * 16)); });
      Scenes.push(desc);
      const v = await menu({ items, x: 2, y: 2, w: 150, onMove: i => cur = i });
      Scenes.pop(desc);
      if (v === 0) await storagePC();
      else if (v === 1) await itemPC();
      else if (v === 2) { sfx("pc_on"); await say("윤슬 박사의 PC에 접속했다."); await dexRating(); }
      else { sfx("cancel"); await say("로그오프했다."); break; }
    }
  } finally { glow(); }
}
async function storagePC() {
  sfx("pc_on"); await say("남켓몬 보관 시스템에\n접속했다.");
  while (true) {
    const items = ["남켓몬 맡기기", "남켓몬 데려가기", "남켓몬 정리하기", "나가기"];
    const D = ["파티의 남켓몬을\n상자에 맡깁니다.", "상자에 맡긴 남켓몬을\n파티로 데려갑니다.", "상자와 파티의 남켓몬을\n들어서 옮기거나 바꿉니다.", "이전 메뉴로 돌아갑니다."];
    let cur = 0; const desc = new Overlay(() => { frame(2, 142, 252, 48); D[cur].split("\n").forEach((l, k) => Font.draw(g, l, 12, 150 + k * 16)); });
    Scenes.push(desc);
    const v = await menu({ items, x: 2, y: 2, w: 150, onMove: i => cur = i });
    Scenes.pop(desc);
    if (v < 0 || v === 3) return;
    if (v === 0 && G.party.length <= 1) { await say("마지막 남켓몬은\n맡길 수 없습니다!"); continue; }
    if (v === 1 && !PCB.all().length) { await say("맡긴 남켓몬이 없습니다."); continue; }
    await fadeOut(6); const bs = new BoxScreen(["deposit", "withdraw", "move"][v]); const p = show(bs); await fadeIn(6); await p;
    await fadeOut(6); await fadeIn(6);
  }
}
async function itemPC() {
  sfx("pc_on"); await say(`${G.name}의 PC에 접속했다.`);
  while (true) {
    const v = await ask("무엇을 하겠습니까?", ["도구 꺼내기", "도구 맡기기", "그만둔다"]);
    if (v === 0) {
      const ids = Object.keys(G.pcItems).filter(id => G.pcItems[id] > 0 && ITEMS[id]);
      if (!ids.length) { await say("맡긴 도구가 없습니다."); continue; }
      const j = await menu({ items: ids.map(id => ({ label: ITEMS[id].n, sub: "×" + G.pcItems[id] })), x: 102, y: 2, w: 152, rows: 7 });
      if (j < 0) continue; const id = ids[j];
      const n = G.pcItems[id] > 1 ? await pickNum({ max: G.pcItems[id], x: 150, y: 110, w: 100 }) : 1; if (!n) continue;
      G.pcItems[id] -= n; if (!G.pcItems[id]) delete G.pcItems[id]; G.give(id, n); sfx("select");
      await say(`${J(ITEMS[id].n, "을")} ${n}개 꺼냈다.`);
    } else if (v === 1) {
      const ids = Object.keys(G.bag).filter(id => G.bag[id] > 0 && ITEMS[id] && ITEMS[id].p !== "key");
      if (!ids.length) { await say("맡길 수 있는 도구가 없습니다."); continue; }
      const j = await menu({ items: ids.map(id => ({ label: ITEMS[id].n, sub: "×" + G.bag[id] })), x: 102, y: 2, w: 152, rows: 7 });
      if (j < 0) continue; const id = ids[j];
      const n = G.bag[id] > 1 ? await pickNum({ max: G.bag[id], x: 150, y: 110, w: 100 }) : 1; if (!n) continue;
      G.take(id, n); G.pcItems[id] = (G.pcItems[id] || 0) + n; sfx("select");
      await say(`${J(ITEMS[id].n, "을")} ${n}개 맡겼다.`);
    } else return;
  }
}
async function dexRating() {
  const s = Object.keys(G.seen).length, c = Object.keys(G.caught).length;
  await say(`남켓몬 도감: 본 남켓몬 ${s}마리,\n잡은 남켓몬 ${c}마리.`);
  const T = c < 5 ? "이제 막 시작이네요!\f풀숲을 꼼꼼히 걸어 봐요." : c < 15 ? "좋아요!\f시간대마다 나오는 남켓몬이 달라요.\n저녁과 밤에도 찾아봐요." : c < 30 ? "대단해요!\f잡은 남켓몬은 도감에서 ▶를 눌러\n남원 생태도감도 꼭 읽어 봐요."  : c < 60 ? "와, 정말 대단해요!\f용성지방 연구가 {P} 덕분에\n쑥쑥 나아가고 있어요!"
    : c < 100 ? "벌써 이만큼이나!\f어떤 남켓몬은 돌이나 칩 같은\n도구를 쓰면 진화한대요."
    : c < 130 ? "정말 많이 모았네요!\f아침에만 나오는 남켓몬도 있어요.\n해 뜰 무렵 풀숲도 걸어 봐요.\f정이 듬뿍 들어야 진화하는\n남켓몬도 있대요."
    : "이건…… 거의 다 모았어요!\f도감을 채운 건 남켓몬들과\n함께 걸어온 길이에요.\f고마워요, {P}!";   // v2.37 실제 게임 박사 평가처럼 단계를 늘림(도구 진화·아침·친밀도 힌트)
  await say("윤슬 박사: " + T);
}
// PC 화면 불빛(센터 PC 도장 위에 밝은 화면)
function pcGlowOn() {
  const st = (World.M && World.def.stamps || []).find(s => s[0] === "pc");
  if (!st) return () => {};
  const old = World.extra;
  World.extra = (cx, cy) => { if (old) old(cx, cy); const x = st[1] * 16 - cx, y = st[2] * 16 - cy, t = (FRAME >> 3) & 1;
    rect(x + 5, y + 10, 15, 9, t ? "#bfeaff" : "#a8e0fa"); rect(x + 9, y + 12, 7, 5, "#ffffff"); rect(x + 6, y + 11, 13, 1, "#e8f8ff"); };
  return () => { World.extra = old; };
}

// ---- 별명 붙이기 (실제 게임처럼: 잡거나 받을 때 "별명을 붙이겠습니까?") ----
async function nicknamePrompt(m, sayFn) {
  const n = MON[m.k].n;
  if ((await ask(`${n}에게 별명을\n붙이겠습니까?`, ["예", "아니오"])) !== 0) return false;
  const ov = new Overlay(() => { rect(0, 0, SW, SH, "rgba(20,24,40,.55)"); frame(64, 4, 128, 104); monFront(m.k, 80, 6, 0, m.shiny);
    darkBox(0, 144, 256, 48); Font.draw(g, `${n}의 별명은?`, 12, 150, { col: TXT.white, sh: TXT.wsh }); Font.draw(g, "(비워 두면 그대로)", 12, 168, { font: "g9", col: "#c8c8d8", sh: null }); });
  Scenes.push(ov);
  const v = await typeName(n + "의 별명은?", null, { mon: m.k });
  Scenes.pop(ov);
  if (v && v !== n) { m.nick = v; sfx("select"); await (sayFn || say)(`${n}의 별명은\n'${v}'(으)로 정했다!`); return true; }
  return false;
}
