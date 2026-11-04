// ===== v2.12 이름 글자판: 실제 게임처럼 화면 속 글자판에서 고르기(한글 자모를 모아 글자로 · ABC · 숫자·기호) =====
//   방향키로 고르고 A(Z)로 넣기, B(X)로 한 자모 지우기, 메뉴(C)로 글자판 바꾸기, '끝'으로 정함. 화면을 직접 눌러도 됨(터치·마우스)
//   typeName(안내, _, 그림) 하나로 주인공 이름·별명·이름 감정사가 모두 이 글자판을 씀
"use strict";
const HG = (() => {
  const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ", JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ", JONG = " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";
  const V2 = { "ㅗㅏ": "ㅘ", "ㅗㅐ": "ㅙ", "ㅗㅣ": "ㅚ", "ㅜㅓ": "ㅝ", "ㅜㅔ": "ㅞ", "ㅜㅣ": "ㅟ", "ㅡㅣ": "ㅢ" };
  const F2 = { "ㄱㅅ": "ㄳ", "ㄴㅈ": "ㄵ", "ㄴㅎ": "ㄶ", "ㄹㄱ": "ㄺ", "ㄹㅁ": "ㄻ", "ㄹㅂ": "ㄼ", "ㄹㅅ": "ㄽ", "ㄹㅌ": "ㄾ", "ㄹㅍ": "ㄿ", "ㄹㅎ": "ㅀ", "ㅂㅅ": "ㅄ" };
  const isC = c => CHO.includes(c) || "ㄳㄵㄶㄺㄻㄼㄽㄾㄿㅀㅄ".includes(c), isV = c => JUNG.includes(c);
  const syl = (c, v, f) => String.fromCharCode(0xac00 + (CHO.indexOf(c) * 21 + JUNG.indexOf(v)) * 28 + Math.max(0, JONG.indexOf(f || " ")));
  // 자모 줄 → 글자(두벌식 오토마타)
  function compose(seq) {
    let out = "", c = null, v = null, f = null;
    const flush = () => { if (c && v) out += syl(c, v, f); else if (c) out += c; else if (v) out += v; c = v = f = null; };
    for (const j of seq) {
      if (isV(j)) {
        if (c && !v) { v = j; continue; }
        if (c && v && !f && V2[v + j]) { v = V2[v + j]; continue; }
        if (!c && v && V2[v + j]) { v = V2[v + j]; continue; }
        if (f) {                                  // 받침이 다음 글자 첫소리로 넘어감
          const two = Object.keys(F2).find(k => F2[k] === f);
          let nc; if (two) { f = two[0]; nc = two[1]; } else { nc = f; f = null; }
          flush(); c = nc; v = j; continue;
        }
        flush(); v = j; continue;
      }
      // 자음
      if (c && v && !f && JONG.includes(j) && j !== " ") { f = j; continue; }
      if (c && v && f && F2[f + j]) { f = F2[f + j]; continue; }
      flush(); c = j;
    }
    flush(); return out;
  }
  // 글자 → 자모 줄(타이핑한 이름을 고칠 때)
  function decompose(s) {
    const r = [];
    for (const ch of s) {
      const k = ch.charCodeAt(0) - 0xac00;
      if (k < 0 || k > 11171) { r.push(ch); continue; }
      const c = CHO[Math.floor(k / 588)], v = JUNG[Math.floor((k % 588) / 28)], f = JONG[k % 28];
      r.push(c); const vv = Object.keys(V2).find(x => V2[x] === v); if (vv) r.push(vv[0], vv[1]); else r.push(v);
      if (f !== " ") { const ff = Object.keys(F2).find(x => F2[x] === f); if (ff) r.push(ff[0], ff[1]); else r.push(f); }
    }
    return r;
  }
  return { compose, decompose };
})();

const KB_PAGES = [
  { n: "한글", rows: ["ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊ", "ㅋㅌㅍㅎㄲㄸㅃㅆㅉ ", "ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ", "ㅐㅒㅔㅖ      "] },
  { n: "ABC", rows: ["ABCDEFGHIJ", "KLMNOPQRST", "UVWXYZ    ", "          "] },
  { n: "abc", rows: ["abcdefghij", "klmnopqrst", "uvwxyz    ", "          "] },
  { n: "123", rows: ["1234567890", "!?.,~-'&♪★", "()+=/:;#%♥", "          "] },
];
const KB_MAX = 6;

class NameKB extends Modal {
  constructor(title, icon, init) {
    super(); this.title = title || "이름은?"; this.icon = icon || null;
    this.seq = init ? HG.decompose(init) : []; this.page = 0; this.cx = 0; this.cy = 0; this.t = 0; this.msg = null;
    this.onPtr = e => this.pointer(e); cv.addEventListener("pointerdown", this.onPtr);
  }
  get text() { return HG.compose(this.seq); }
  key(x, y) { return y < 4 ? (KB_PAGES[this.page].rows[y][x] || " ") : ["page", "page", "page", "del", "del", "del", "del", "ok", "ok", "ok"][x]; }
  put(ch) {
    if (ch === " ") return;
    const next = HG.compose([...this.seq, ch]);
    if ([...next].length > KB_MAX) { sfx("flee_fail"); this.msg = KB_MAX + "자까지 쓸 수 있어요"; this.t = 0; return; }
    this.seq.push(ch); sfx("cursor");
  }
  press() {
    const k = this.key(this.cx, this.cy);
    if (k === "page") { this.page = (this.page + 1) % KB_PAGES.length; sfx("select"); return; }
    if (k === "del") { if (this.seq.length) { this.seq.pop(); sfx("cancel"); } return; }
    if (k === "ok") { this.finish(); return; }
    this.put(k);
  }
  finish() { const v = this.text.trim(); sfx("select"); cv.removeEventListener("pointerdown", this.onPtr); this.done(v || null); }
  pointer(e) {
    const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * SW / r.width, y = (e.clientY - r.top) * SH / r.height;
    const gx = Math.floor((x - 18) / 22), gy = Math.floor((y - 78) / 18);
    if (gx < 0 || gx > 9 || gy < 0 || gy > 4) return;
    e.preventDefault(); this.cx = gx; this.cy = gy; this.press();
  }
  update(focus) {
    if (!focus) return; this.t++;
    if (Input.rep("left")) { this.cx = (this.cx + 9) % 10; sfx("cursor"); }
    else if (Input.rep("right")) { this.cx = (this.cx + 1) % 10; sfx("cursor"); }
    else if (Input.rep("up")) { this.cy = (this.cy + 4) % 5; sfx("cursor"); }
    else if (Input.rep("down")) { this.cy = (this.cy + 1) % 5; sfx("cursor"); }
    else if (Input.hit("menu")) { this.page = (this.page + 1) % KB_PAGES.length; sfx("select"); }
    else if (Input.hit("enter") && !Input.hit("a")) { this.cx = 7; this.cy = 4; sfx("cursor"); }   // 실제 게임의 START: '끝'으로
    else if (Input.ok()) this.press();
    else if (Input.cancel()) { if (this.seq.length) { this.seq.pop(); sfx("cancel"); } }
  }
  draw() {
    bgPattern("#3a6a8a", "#4a7a9a");
    // 위: 안내·그림·이름 칸
    frame(4, 4, 248, 56);
    if (this.icon && this.icon.mon) drawIcon(this.icon.mon, 16, 14, 1);
    const x0 = this.icon ? 60 : 16;
    Font.draw(g, this.title, x0, 10);
    const T = [...this.text];
    for (let i = 0; i < KB_MAX; i++) {
      const x = x0 + i * 16, y = 28;
      rect(x, y + 15, 13, 2, i === T.length && this.t % 40 < 24 ? "#d04030" : "#7a8aa0");
      if (T[i]) Font.draw(g, T[i], x + 6, y, { align: "center" });
    }
    if (this.msg && this.t < 90) Font.draw(g, this.msg, 244, 30, { font: "g9", align: "right", col: "#c03020", sh: null });
    Font.draw(g, "B 지우기 · C 글자판", 244, 45, { font: "g9", align: "right", col: TXT.gray, sh: null });
    // 글자판 탭
    KB_PAGES.forEach((p, i) => { const x = 14 + i * 58, on = i === this.page;
      rect(x, 62, 54, 11, on ? "#f8d848" : "rgba(255,255,255,.35)"); Font.draw(g, p.n, x + 27, 64, { font: "g9", align: "center", col: on ? TXT.dark : "#eef4f8", sh: null }); });
    // 글자판
    rect(12, 74, 232, 112, "rgba(255,255,255,.92)"); rect(12, 74, 232, 1, "#2a3a4a"); rect(12, 185, 232, 1, "#2a3a4a");
    const P = KB_PAGES[this.page];
    for (let y = 0; y < 4; y++) for (let x = 0; x < 10; x++) {
      const ch = P.rows[y][x], px = 18 + x * 22, py = 78 + y * 18;
      if (x === this.cx && y === this.cy) rect(px, py, 20, 16, "#f8d848");
      if (!ch || ch === " ") continue;
      Font.draw(g, ch, px + 10, py + 2, { align: "center" });
    }
    // 아래 줄: 바꾸기 · 지우기 · 끝
    const B = [[0, 3, KB_PAGES[(this.page + 1) % KB_PAGES.length].n + "로"], [3, 4, "지우기"], [7, 3, "끝"]];
    for (const [x, w, s] of B) {
      const px = 18 + x * 22, py = 78 + 4 * 18, on = this.cy === 4 && this.cx >= x && this.cx < x + w;
      rect(px, py, w * 22 - 2, 16, on ? "#f8d848" : "#c8d8e8"); Font.draw(g, s, px + (w * 22 - 2) / 2, py + 2, { align: "center" });
    }
  }
}
// 예전 입력 칸(HTML) 대신 글자판(실제 게임처럼). ph: 안내 글, _: (쓰지 않음), icon: { mon: 종 }
function typeName(ph, _, icon, init) {
  Input.releaseAll && Input.releaseAll();
  const title = (ph || "이름은?").replace(/\s*\(\d자까지\)\s*/, "");
  return show(new NameKB(title, icon, init));
}
