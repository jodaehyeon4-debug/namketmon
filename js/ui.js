// ===== UI: 대화창(타자기·▼·한 줄 올림), 선택 메뉴, 예/아니오, 수량 고르기 =====
"use strict";
const CPF = [0.5, 1.0, 2.5];            // 글자/프레임 (느림·보통·빠름)

class TextBox {
  // opt: dark(배틀 글상자), x,y,w,h, auto(ms: 다 쓰면 자동 닫힘), keep(닫지 않고 남김), noArrow
  constructor(text, opt = {}) {
    this.o = Object.assign({ x: 2, y: 144, w: 252, h: 46, dark: false, auto: 0, keep: false }, opt);
    const inner = this.o.w - 22;
    this.pages = String(text).split("\f").map(p => Font.wrap(p, inner));
    this.pg = 0; this.top = 0; this.n = [0, 0]; this.scroll = 0; this.state = "type"; this.waitT = 0; this.done = false;
    this.shownT = 0; this.needT = this.readNeed(this.pages[0].slice(0, 2));
    this.promise = new Promise(r => this.res = r);
  }
  get lines() { return this.pages[this.pg]; }
  // v2.48 대화 다 읽기(사용자: "대화를 막 틱틱틱 하면서 넘기는 경우가 많으므로, 답답하더라도 대화를 전부 읽을 수 있게"):
  //   한 화면(두 줄)이 뜬 뒤 글자 수만큼(한 글자 0.11초, 0.6~4.5초) 지나야 A·B로 넘어감 — 그 전엔 눌러도 안 넘어가고 ▼도 안 보임
  readNeed(lines) { const c = lines.reduce((a, t) => a + (t ? String(t).replace(/\s/g, "").length : 0), 0); return Math.round(Math.max(0.6, Math.min(4.5, c * 0.11)) * 60); }
  get readOk() { return window.NK_READ_LOCK === false || this.shownT >= this.needT; }
  update(focus) {
    if (this.done && this.o.keep) return;
    if (!focus && !this.o.keep) return;
    if (focus) this.shownT++;
    const L = this.lines;
    if (this.state === "type") {
      const fast = Input.is("a") || Input.is("b");
      const sp = fast ? 6 : CPF[Save.opt.speed];
      const a = L[this.top] || "", b = L[this.top + 1];
      if (this.n[0] < a.length) this.n[0] = Math.min(a.length, this.n[0] + sp);
      else if (b !== undefined && this.n[1] < b.length) this.n[1] = Math.min(b.length, this.n[1] + sp);
      else this.endLines();
    } else if (this.state === "wait") {
      this.waitT++;
      const auto = this.o.auto && this.waitT * 16.7 >= this.o.auto;
      if (((Input.ok() || Input.cancel()) && this.readOk) || auto) {
        if (!auto) sfx("cursor");
        this.next();
      }
    } else if (this.state === "scroll") {
      this.scroll += 4;
      if (this.scroll >= 16) { this.scroll = 0; this.top++; this.n = [this.n[1], 0]; this.n[0] = (this.lines[this.top] || "").length; this.state = "type";
        this.shownT = 0; this.needT = this.readNeed([this.lines[this.top + 1]]); }
    }
  }
  endLines() {
    const L = this.lines;
    const more = this.top + 2 < L.length || this.pg + 1 < this.pages.length;
    if (!more && this.o.keep) { this.state = "end"; this.done = true; this.res(); return; }
    this.state = "wait"; this.waitT = 0;
  }
  next() {
    const L = this.lines;
    if (this.top + 2 < L.length) { this.state = "scroll"; this.scroll = 0; return; }
    if (this.pg + 1 < this.pages.length) { this.pg++; this.top = 0; this.n = [0, 0]; this.state = "type"; this.shownT = 0; this.needT = this.readNeed(this.lines.slice(0, 2)); return; }
    this.state = "end"; this.done = true;
    if (!this.o.keep) Scenes.pop(this);
    this.res();
  }
  draw() {
    const { x, y, w, h, dark } = this.o;
    if (dark) darkBox(x, y, w, h); else frame(x, y, w, h);
    const col = dark ? TXT.white : TXT.dark, sh = dark ? TXT.wsh : TXT.sh;
    const L = this.lines, tx = x + 10, ty = y + 7;
    g.save(); g.beginPath(); g.rect(x + 4, y + 4, w - 8, h - 8); g.clip();
    for (let i = 0; i < 3; i++) {
      const s = L[this.top + i]; if (s === undefined) break;
      const n = i < 2 ? this.n[i] : 0; if (i === 2 && this.state !== "scroll") break;
      Font.draw(g, s, tx, ty + i * 16 - this.scroll, { col, sh, n: Math.floor(n) });
    }
    g.restore();
    if (this.state === "wait" && !this.o.auto && !this.o.noArrow && this.readOk) downArrow(x + w - 16, y + h - 13);
  }
}
function say(text, opt = {}) {
  if (typeof BT !== "undefined" && BT && Scenes.has(BT) && opt.dark === undefined) opt = Object.assign({ dark: true, x: 0, y: 144, w: 256, h: 48 }, opt);
  const tb = new TextBox(fmt(text), opt);
  Scenes.push(tb);
  return opt.keep ? tb.promise.then(() => tb) : tb.promise;
}
// 이름 바꿔 넣기
function fmt(s) { return String(s).replace(/\{P\}/g, G.name || "나").replace(/\{R\}/g, "한결"); }

class Menu {
  // items: [문자열 | {label, dis, sub(오른쪽 글)}], x,y,w, rows(보이는 줄), cancel(-1 허용), initial
  constructor(o) {
    this.o = Object.assign({ x: 160, y: 8, w: 92, rows: 0, cancel: true, initial: 0, lh: 16, pad: 6, font: "g11" }, o);
    this.items = this.o.items.map(it => typeof it === "string" ? { label: it } : it);
    this.i = clamp(this.o.initial, 0, this.items.length - 1);
    this.rows = this.o.rows || this.items.length; this.scrollTop = 0;
    this.h = this.rows * this.o.lh + this.o.pad * 2 + 2;
    this.promise = new Promise(r => this.res = r);
    this.fix();
  }
  fix() { if (this.i < this.scrollTop) this.scrollTop = this.i; if (this.i >= this.scrollTop + this.rows) this.scrollTop = this.i - this.rows + 1; }
  update(focus) {
    if (!focus) return;
    const n = this.items.length;
    if (Input.rep("up")) { this.i = (this.i + n - 1) % n; sfx("cursor"); this.fix(); this.o.onMove && this.o.onMove(this.i); }
    else if (Input.rep("down")) { this.i = (this.i + 1) % n; sfx("cursor"); this.fix(); this.o.onMove && this.o.onMove(this.i); }
    else if (Input.ok()) { if (this.items[this.i].dis) { sfx("flee_fail"); return; } sfx("select"); this.close(this.i); }
    else if (Input.cancel() && this.o.cancel) { sfx("cancel"); this.close(-1); }
  }
  close(v) { Scenes.pop(this); this.res(v); }
  draw() {
    const { x, y, w, lh, pad } = this.o;
    frame(x, y, w, this.h);
    for (let r = 0; r < this.rows; r++) {
      const k = this.scrollTop + r, it = this.items[k]; if (!it) break;
      const yy = y + pad + 2 + r * lh;
      Font.draw(g, it.label, x + 16, yy, { col: it.dis ? TXT.gray : it.col || TXT.dark, sh: it.dis ? TXT.gsh : TXT.sh, font: this.o.font });
      if (it.sub) Font.draw(g, it.sub, x + w - 8, yy, { align: "right", font: this.o.font });
      if (k === this.i) cursor(x + 6, yy + 3);
    }
    if (this.scrollTop > 0) { const b = (FRAME >> 4) & 1; for (let i = 0; i < 4; i++) rect(x + w / 2 - 3 + i, y + 3 - b + i, 7 - i * 2, 1, "#d04030"); }
    if (this.scrollTop + this.rows < this.items.length) downArrow(x + w / 2 - 3, y + this.h - 8);
  }
}
function menu(o) { const m = new Menu(o); Scenes.push(m); return m.promise; }
async function ask(text, opts = ["예", "아니오"], o = {}) {
  const tb = await say(text, { keep: true });
  const w = Math.max(56, ...opts.map(s => Font.width(s) + 30));
  const h = opts.length * 16 + 14;
  const v = await menu({ items: opts, x: 254 - w, y: 142 - h, w, cancel: true, initial: o.initial || 0, onMove: o.onMove });
  Scenes.pop(tb);
  return v < 0 ? opts.length - 1 : v;
}
const yes = async (t) => (await ask(t)) === 0;

// 수량 고르기 (가게·버리기): ×01 ~ max
class NumPick {
  constructor(o) { this.o = Object.assign({ x: 150, y: 96, w: 100, max: 99, price: 0 }, o); this.v = 1; this.promise = new Promise(r => this.res = r); }
  update(focus) {
    if (!focus) return; const m = this.o.max;
    if (Input.rep("up")) { this.v = this.v >= m ? 1 : this.v + 1; sfx("cursor"); }
    else if (Input.rep("down")) { this.v = this.v <= 1 ? m : this.v - 1; sfx("cursor"); }
    else if (Input.rep("right")) { this.v = Math.min(m, this.v + 10); sfx("cursor"); }
    else if (Input.rep("left")) { this.v = Math.max(1, this.v - 10); sfx("cursor"); }
    else if (Input.ok()) { sfx("select"); Scenes.pop(this); this.res(this.v); }
    else if (Input.cancel()) { sfx("cancel"); Scenes.pop(this); this.res(0); }
  }
  draw() {
    const { x, y, w, price } = this.o;
    frame(x, y, w, 30);
    Font.draw(g, "×" + String(this.v).padStart(2, "0"), x + 12, y + 8);
    if (price) Font.draw(g, (price * this.v).toLocaleString() + "원", x + w - 10, y + 8, { align: "right" });
    const b = (FRAME >> 4) & 1;
    for (let i = 0; i < 3; i++) { rect(x + 18 + i, y + 2 - b + 2 - i, 5 - i * 2, 1, "#d04030"); rect(x + 18 + i, y + 26 + b + i, 5 - i * 2, 1, "#d04030"); }
  }
}
function pickNum(o) { const p = new NumPick(o); Scenes.push(p); return p.promise; }

// 돈 상자 (가게)
function moneyBox(x = 2, y = 2) { frame(x, y, 96, 30); Font.draw(g, "돈", x + 10, y + 8); Font.draw(g, G.money.toLocaleString() + "원", x + 88, y + 8, { align: "right" }); }

// 그림만 보여 주는 장면 (스크립트용)
class Overlay { constructor(fn) { this.fn = fn; } update() {} draw() { this.fn(); } }

// 타입 표 (작은 글씨 배지)
const TCOL = {"노말":"#9a9480","불꽃":"#e0603a","물":"#3a86c8","풀":"#4f9a3e","전기":"#d0a800","얼음":"#4fb3c4","격투":"#b8402f","독":"#8f4aa0","땅":"#b0874a","비행":"#7d8ad6","에스퍼":"#e0507e","벌레":"#8c9a22","바위":"#9a8a52","고스트":"#5f5aa8","드래곤":"#5a4fd0","악":"#4f4642","강철":"#7f93a3","페어리":"#d77fb8"};
function typeBadge(t, x, y, w = 34) {
  const c = TCOL[t] || "#888";
  rect(x + 1, y, w - 2, 13, "#2a2a32"); rect(x, y + 1, w, 11, "#2a2a32");
  rect(x + 1, y + 1, w - 2, 11, c); rect(x + 1, y + 1, w - 2, 1, "rgba(255,255,255,.35)");
  Font.draw(g, t, x + w / 2, y + 1, { font: "g9", col: "#ffffff", sh: "rgba(0,0,0,.45)", align: "center" });
}
const STATUS = { psn: ["독", "#a050c0"], tox: ["맹독", "#7a2a9a"], brn: ["화상", "#e06030"], par: ["마비", "#c8a000"], slp: ["잠듦", "#8890a0"], frz: ["얼음", "#40a8d0"], fnt: ["기절", "#c03030"] };
function statusBadge(s, x, y) {
  const [n, c] = STATUS[s]; const w = Font.width(n, "g9") + 8;
  rect(x, y, w, 11, "#2a2a32"); rect(x + 1, y + 1, w - 2, 9, c);
  Font.draw(g, n, x + 4, y, { font: "g9", col: "#fff", sh: "rgba(0,0,0,.4)" });
  return w;
}
function hpBar(x, y, w, frac) {   // 'HP' 글자 포함 바
  frac = clamp(frac, 0, 1);
  rect(x, y, w + 18, 7, "#3a3a46"); rect(x + 1, y + 1, 15, 5, "#3a3a46");
  Font.draw(g, "HP", x + 2, y - 2, { font: "g7", col: "#f8c040", sh: null });
  rect(x + 17, y + 1, w, 5, "#505860");
  const c = frac > 0.5 ? ["#58d068", "#90f0a0"] : frac > 0.2 ? ["#e0b020", "#f8e070"] : ["#e04838", "#f89880"];
  const fw = Math.ceil(w * frac);
  if (fw > 0) { rect(x + 17, y + 1, fw, 5, c[0]); rect(x + 17, y + 2, fw, 2, c[1]); }
}
function expBar(x, y, w, frac) {
  rect(x, y, w + 2, 4, "#3a3a46"); rect(x + 1, y + 1, w, 2, "#505860");
  const fw = Math.floor(w * clamp(frac, 0, 1)); if (fw > 0) { rect(x + 1, y + 1, fw, 2, "#40a0f0"); rect(x + 1, y + 1, fw, 1, "#90d0ff"); }
}
