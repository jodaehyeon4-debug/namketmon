// ===== v2.38 시작 인트로(사용자 "시작 화면 다듬자 … 실제 게임 시작처럼 인트로 + 시작 화면에 포켓몬 번갈아 나오는 것 치우자") =====
// 실제 게임처럼(구조만): ① 알림·감사 화면(누르면 시작 — 소리도 이때 켜짐) → ② 덕과초 5학년에게 영어 감사 → ③ 만든 곳
//   → ④ 오프닝 무비(지리산 새벽 운해 · 들판을 달리는 스타팅 셋 · 칠석 밤 오작교) → 타이틀. ②부터는 아무 단추나 누르면 바로 타이틀
//   타이틀에서 한동안 가만히 있으면 오프닝을 다시 보여 줌(실제 게임처럼). 닌텐도·포켓몬 그림·로고는 쓰지 않음(글로만 감사)
"use strict";
// 'é'가 글꼴에 없어 e를 쓰고 위에 강세 점을 찍음(Pokémon)
function textE(str, x, y, o = {}) {
  const font = o.font || "g9", plain = str.replace(/é/g, "e"), w = Font.width(plain, font);
  const x0 = o.align === "center" ? Math.round(x - w / 2) : x;
  Font.draw(g, plain, x0, y, Object.assign({}, o, { align: "left", font }));
  let i = -1;
  while ((i = str.indexOf("é", i + 1)) >= 0) {
    const ax = x0 + Font.width(plain.slice(0, i), font) + (font === "g9" ? 2 : 3), ay = y + (font === "g9" ? 1 : 1);
    rect(ax + 1, ay, 1, 1, o.col || "#ffffff"); rect(ax, ay + 1, 1, 1, o.col || "#ffffff");
  }
}
const INTRO_CARDS = {
  legal: [
    ["고마운 분들께", "#f8d870", "g11"], ["", 0],
    ["Pokémon은 Nintendo · Creatures ·", "#e8e8f4"], ["GAME FREAK · The Pokémon Company의", "#e8e8f4"], ["상표예요.", "#e8e8f4"], ["", 0],
    ["남켓몬은 이 회사들과 관계없는", "#c8c8dc"], ["비공식 교육용 팬게임이에요.", "#c8c8dc"], ["", 0],
    ["포켓몬이라는 멋진 세계를 만들어 주신", "#ffffff"], ["포켓몬 제작진께 깊이 감사드려요.", "#ffffff"], ["", 0],
    ["Thank you, The Pokémon Company!", "#f8d870"],
  ],
  kids: [
    ["To all the 5th graders of", "#ffffff", "g11"], ["Deokgwa Elementary School,", "#ffffff", "g11"], ["", 0],
    ["thank you for every idea,", "#f8e8b0", "g11"], ["every laugh, and every adventure.", "#f8e8b0", "g11"], ["", 0],
    ["This world is yours, too!", "#f8d870", "g11"],
  ],
};
class Intro {
  constructor(from = "legal") { this.opaque = true; this.ph = from; this.t = 0; this.out = 0; this.done = false; for (const k of STARTERS) battleSheet(k); if (from !== "legal") bgm("title"); }
  next(ph) { this.ph = ph; this.t = 0; }
  update(f) {
    this.t++;
    if (this.out) { if (++this.out > 24) this.finish(); return; }
    if (!f) return;
    const hit = Input.ok() || Input.menuKey() || Input.cancel();
    if (this.ph === "legal") { if (hit && this.t > 20) { Audio2.unlock(); bgm("title"); sfx("select"); this.next("kids"); } return; }
    if (hit) { sfx("select"); this.out = 1; return; }                 // 건너뛰기 → 타이틀
    const L = { kids: 230, presents: 130, movie: 690 }[this.ph];
    if (this.t >= L) { if (this.ph === "kids") this.next("presents"); else if (this.ph === "presents") this.next("movie"); else this.out = 1; }
  }
  finish() { if (this.done) return; this.done = true; Scenes.pop(this); const t = new Title(); t.flash = 18; Scenes.push(t); }
  fadeA(L) { const t = this.t; return Math.max(0, Math.min(1, t / 24, (L - t) / 24)); }
  card(lines, a) {
    rect(0, 0, SW, SH, "#0c0c1a");
    let y = 0; const H = lines.map(([s, , f]) => (s ? (f === "g11" ? 15 : 12) : 6)); const tot = H.reduce((p, c) => p + c, 0);
    y = Math.round((SH - tot) / 2) - (this.ph === "legal" ? 8 : 0);
    g.globalAlpha = a;
    lines.forEach(([s, col, f], i) => { if (s) textE(s, SW / 2, y, { align: "center", col, sh: null, font: f || "g9" }); y += H[i]; });
    g.globalAlpha = 1;
  }
  draw() {
    const t = this.t;
    if (this.ph === "legal") {
      this.card(INTRO_CARDS.legal, Math.min(1, t / 30));
      if (t > 40 && ((t >> 5) & 1)) Font.draw(g, "A 버튼(Z)이나 화면을 누르세요", SW / 2, 176, { align: "center", font: "g9", col: "#9aa0c8", sh: null });
    } else if (this.ph === "kids") {
      this.card(INTRO_CARDS.kids, this.fadeA(230));
      g.globalAlpha = this.fadeA(230);                                // 별 몇 개
      for (let i = 0; i < 18; i++) { const x = (i * 71 + 23) % SW, y = (i * 37 + 9) % SH; if (((t >> 3) + i) % 4) rect(x, y, 1, 1, i % 3 ? "#8888c0" : "#fff4c8"); }
      g.globalAlpha = 1;
    } else if (this.ph === "presents") {
      rect(0, 0, SW, SH, "#0c0c1a"); g.globalAlpha = this.fadeA(130);
      Font.draw(g, "Deokgwa Elementary School", SW / 2, 78, { align: "center", col: "#ffffff", sh: null });
      const k = Math.min(1, t / 50); rect(SW / 2 - 70 * k, 96, 140 * k, 1, "#f8d870");
      Font.draw(g, "presents", SW / 2, 101, { align: "center", font: "g9", col: "#c8c8e0", sh: null });
      g.globalAlpha = 1;
    } else this.movie(t);
    if (this.out) { g.globalAlpha = Math.min(1, this.out / 20); rect(0, 0, SW, SH, "#ffffff"); g.globalAlpha = 1; }
  }
  // ---- 오프닝 무비 ----
  movie(t) {
    if (t < 230) this.dawn(t);
    else if (t < 470) this.field(t - 230);
    else this.night(t - 470);
    const cut = [230, 470].map(c => Math.abs(t - c)).reduce((a, b) => Math.min(a, b));
    if (cut < 12) { g.globalAlpha = 1 - cut / 12; rect(0, 0, SW, SH, "#000000"); g.globalAlpha = 1; }
    if (t < 12) { g.globalAlpha = 1 - t / 12; rect(0, 0, SW, SH, "#000000"); g.globalAlpha = 1; }
  }
  ridges(cols, pan, baseY) {
    cols.forEach(([col, base, amp, f, sp], i) => {
      g.fillStyle = col; g.beginPath(); g.moveTo(0, SH);
      for (let x = 0; x <= SW; x += 4) { const X = x + pan * sp; g.lineTo(x, baseY + base - Math.abs(Math.sin(X * f + i * 3)) * amp - Math.sin(X * f * 2.3 + i) * amp * 0.4); }
      g.lineTo(SW, SH); g.fill();
    });
  }
  dawn(t) {                                                         // 지리산 새벽 운해: 해가 뜨고 구름바다가 흐름
    if (typeof bandSky === "function") bandSky([[0, "#1a2050"], [0.5, "#b05a70"], [0.8, "#f4b070"]], SH); else { const sky = g.createLinearGradient(0, 0, 0, SH); sky.addColorStop(0, "#1a2050"); sky.addColorStop(0.5, "#b05a70"); sky.addColorStop(0.8, "#f4b070"); g.fillStyle = sky; g.fillRect(0, 0, SW, SH); }
    const sy = 120 - Math.min(40, t * 0.25); g.fillStyle = "#fff0b8"; g.beginPath(); g.arc(170, sy, 14, 0, Math.PI * 2); g.fill();
    g.globalAlpha = 0.25; g.beginPath(); g.arc(170, sy, 26, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
    this.ridges([["#5a4a7a", 96, 22, 0.022, 0.3], ["#3e3460", 112, 18, 0.034, 0.6]], t, 0);
    for (let k = 0; k < 3; k++) {                                     // 구름바다
      g.fillStyle = ["#f4e4ec", "#fff4f4", "#ffffff"][k]; g.globalAlpha = [0.7, 0.85, 1][k]; g.beginPath(); g.moveTo(0, SH);
      for (let x = 0; x <= SW; x += 4) g.lineTo(x, 132 + k * 14 + Math.sin((x + t * (0.6 + k * 0.5)) * 0.05 + k) * 4);
      g.lineTo(SW, SH); g.fill();
    }
    g.globalAlpha = 1;
    for (let i = 0; i < 5; i++) { const x = ((t * 1.2 + i * 60) % (SW + 40)) - 20, y = 40 + i * 9 + Math.sin(t / 10 + i) * 2, w = (t >> 2) % 2; rect(x, y, 4, 1, "#2a2440"); rect(x - 1 - w, y - 1 + w, 2, 1, "#2a2440"); rect(x + 3 + w, y - 1 + w, 2, 1, "#2a2440"); }
  }
  field(t) {                                                        // 들판을 달리는 스타팅 셋
    if (typeof bandSky === "function") bandSky([[0, "#5aa0e0"], [0.6, "#bfe4f4"]], SH); else { const sky = g.createLinearGradient(0, 0, 0, SH); sky.addColorStop(0, "#5aa0e0"); sky.addColorStop(0.6, "#bfe4f4"); g.fillStyle = sky; g.fillRect(0, 0, SW, SH); }
    this.ridges([["#7a9ac0", 92, 16, 0.02, 0.4], ["#5a8a6a", 108, 12, 0.03, 1.2]], t, 0);
    rect(0, 128, SW, SH - 128, "#78b84a"); for (let i = 0; i < 40; i++) { const x = ((i * 41 - t * 4) % (SW + 20) + SW + 20) % (SW + 20) - 10, y = 132 + (i * 13) % 56; rect(x, y, 2, 1, "#5a9a3a"); rect(x + 1, y - 1, 1, 1, "#9ad86a"); }
    STARTERS.forEach((k, i) => {
      const im = battleSheet(k); if (!im.complete || !im.naturalWidth) return;
      const C = im.naturalWidth / 24, x = -60 + (t - i * 34) * 1.9, hop = Math.abs(Math.sin((t + i * 9) / 5)) * 5, y = 96 + i * 16 - hop;
      if (x < -60 || x > SW + 10) return;
      g.globalAlpha = 0.25; g.fillStyle = "#24481a"; g.beginPath(); g.ellipse(x + 28, 96 + i * 16 + 50, 14, 3, 0, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
      g.save(); g.translate(x + 56, y); g.scale(-1, 1); g.drawImage(im, (Math.floor(t / 3) % 24) * C, 0, C, C, 0, 0, 56, 56); g.restore();   // 오른쪽을 보게 뒤집음
      if ((t + i * 4) % 10 < 5) rect(x + 6, 96 + i * 16 + 48, 3, 2, "#c8e4a0");
    });
  }
  night(t) {                                                        // 칠석 밤: 까막까치가 은하수에 다리를 놓음 → 번쩍
    rect(0, 0, SW, SH, "#0c1028");
    g.globalAlpha = 0.22; g.fillStyle = "#c8d4ff"; g.beginPath(); g.ellipse(SW / 2, 70, SW * 0.6, 22, -0.25, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
    for (let i = 0; i < 60; i++) { const x = (i * 53 + 11) % SW, y = (i * 29 + 5) % 150, tw = ((t >> 3) + i) % 6; if (tw) rect(x, y, 1, 1, i % 4 ? "#c8d8ff" : "#fff4c8"); }
    const n = Math.min(18, Math.floor(t / 6));
    for (let i = 0; i < n; i++) {
      const k = i / 17, x = 24 + (SW - 48) * k, y = 96 - Math.sin(k * Math.PI) * 44 + Math.sin(t / 6 + i) * 1.5, w = (Math.floor(t / 5) + i) % 2;
      rect(x - 3, y, 7, 2, "#e8ecff"); rect(x - 4 - w, y - 1 - w, 3, 1, "#e8ecff"); rect(x + 2 + w, y - 1 - w, 3, 1, "#e8ecff"); if (i % 2) rect(x - 1, y + 1, 3, 1, "#1a1a2a");
    }
    if (n >= 18) { g.globalAlpha = 0.5 + 0.3 * Math.sin(t / 7); g.strokeStyle = "#fff4c8"; g.lineWidth = 1; g.beginPath();
      for (let i = 0; i <= 30; i++) { const k = i / 30, x = 24 + (SW - 48) * k, y = 100 - Math.sin(k * Math.PI) * 44; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.globalAlpha = 1; }
    rect(0, 156, SW, SH - 156, "#0a0c1c");                          // 광한루 지붕선
    g.fillStyle = "#06081a"; g.beginPath(); g.moveTo(60, 150); g.quadraticCurveTo(96, 134, 128, 140); g.quadraticCurveTo(160, 134, 196, 150); g.lineTo(184, 156); g.lineTo(72, 156); g.fill();
    if (t > 120 && t < 160) { const k = (t - 120) / 40; rect(220 - k * 120, 20 + k * 30, 3, 1, "#ffffff"); rect(223 - k * 120, 19 + k * 30, 6, 1, "rgba(255,255,255,.4)"); }   // 별똥별
    if (t > 196) { g.globalAlpha = Math.min(1, (t - 196) / 24); rect(0, 0, SW, SH, "#ffffff"); g.globalAlpha = 1; }
  }
}
async function runIntro(from) { Scenes.push(new Intro(from)); Screen.fade = 0; }
