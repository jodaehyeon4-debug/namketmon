// ===== v2.62 미뤄 둔 화면 손질 — 띠로 끊어 칠한 하늘 · 대화창 이름 딱지 · 설정 두 쪽 · 메뉴 아이콘 · 상자 벽지 · 남켓몬 발밑 그림자 =====
"use strict";
(() => {
  loadImg("menuicons", "img/menuicons.png"); loadImg("boxwall", "img/boxwall.png");

  // ---------- 하늘: 매끈한 색 번짐 대신 띠 + 점 섞기(도트 화면과 같은 결) ----------
  const skyCache = new Map(), BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const hex = (c) => { c = c.replace("#", ""); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; };
  window.bandSky = function (stops, H, N) {
    H = H || SH; N = N || 12; const key = JSON.stringify(stops) + H + N; let c = skyCache.get(key);
    if (!c) { c = document.createElement("canvas"); c.width = SW; c.height = H; const x = c.getContext("2d"), d = x.createImageData(SW, H), S = stops.map(s => [s[0], hex(s[1])]);
      if (S[S.length - 1][0] < 1) S.push([1, S[S.length - 1][1]]);
      const col = (t) => { let i = 0; while (i < S.length - 2 && t > S[i + 1][0]) i++; const a = S[i], b = S[i + 1], k = clamp((t - a[0]) / Math.max(1e-6, b[0] - a[0]), 0, 1); return a[1].map((v, j) => Math.round(v + (b[1][j] - v) * k)); };
      const band = []; for (let i = 0; i <= N; i++) band.push(col(Math.min(1, (i + 0.5) / N)));
      for (let y = 0; y < H; y++) { const t = y / H * N, b = Math.min(N - 1, Math.floor(t)), fr = t - b, f2 = (fr - 0.55) / 0.45;
        for (let px = 0; px < SW; px++) { const use = f2 > (BAYER[(y & 3) * 4 + (px & 3)] + 0.5) / 16 ? band[Math.min(N, b + 1)] : band[b], o = (y * SW + px) * 4; d.data[o] = use[0]; d.data[o + 1] = use[1]; d.data[o + 2] = use[2]; d.data[o + 3] = 255; } }
      x.putImageData(d, 0, 0); skyCache.set(key, c); }
    g.drawImage(c, 0, 0, SW, H);
  };

  // ---------- 대화창 이름 딱지: "방삼: 꼬마야" → 창 위에 [방삼] 딱지, 글에서는 이름을 뺌 ----------
  const NAME = /^([가-힣A-Za-z][가-힣A-Za-z0-9 ·]{0,7}): ?/;
  const Base = TextBox;
  TextBox = class extends Base {
    constructor(text, opt = {}) {
      const pages = String(text).split("\f"), names = []; let cur = null;
      const out = pages.map((p) => { const m = NAME.exec(p); if (m && !/[0-9]$/.test(m[1])) { cur = m[1]; names.push(cur); return p.slice(m[0].length); }
        if (/^[(（'‘"“『]/.test(p)) { names.push(null); return p; } names.push(cur); return p; });
      super(out.join("\f"), opt); this.names = names;
    }
    draw() {
      super.draw();
      const n = this.names && this.names[this.pg]; if (!n || this.o.dark) return;
      const w = Font.width ? Font.width(n, "g9") + 12 : n.length * 10 + 12, x = this.o.x + 8, y = this.o.y - 11;
      rect(x + 1, y, w - 2, 1, "#262a3a"); rect(x, y + 1, w, 13, "#262a3a"); rect(x + 1, y + 1, w - 2, 13, "#fbf8f0"); rect(x + 1, y + 1, w - 2, 1, "#ffffff");
      Font.draw(g, n, x + 6, y + 1, { font: "g9", col: "#b03a2c", sh: null });
    }
  };

  // ---------- 설정: 열한 줄 한 화면 → 두 쪽(줄 간격 넉넉히, 아래 도움말 칸 되살림) ----------
  if (typeof Options !== "undefined") {
    const od = Object.getOwnPropertyDescriptor(Options.prototype, "rows"), CUT = 6;
    Object.defineProperty(Options.prototype, "allRows", od);
    Object.defineProperty(Options.prototype, "rows", { configurable: true, get() { const A = this.allRows;
      return (this.pg || 0) === 0 ? A.slice(0, CUT).concat([["다음 쪽 ▶", null, null]]) : A.slice(CUT, A.length - 1).concat([["◀ 앞 쪽", null, null], A[A.length - 1]]); } });
    const ou = Options.prototype.update, odr = Options.prototype.draw;
    Options.prototype.update = function (f) {
      if (f && Input.ok()) { const r = this.rows[this.i]; if (r && !r[2] && /쪽/.test(r[0])) { sfx("select"); this.pg = this.pg ? 0 : 1; this.i = 0; return; } }
      ou.call(this, f); };
    Options.prototype.draw = function () { odr.call(this); Font.draw(g, ((this.pg || 0) + 1) + " / 2", 238, 6, { font: "g9", align: "right", col: TXT.gray, sh: null }); };
  }

  // ---------- 메뉴 아이콘(받은 시안 여덟 개): 항목에 icon 번호가 있으면 글 앞에 16×16 그림 ----------
  Menu.prototype.draw = function () {
    const { x, y, w, lh, pad } = this.o, ic = IMG.menuicons && this.items.some(it => it.icon !== undefined);
    frame(x, y, w, this.h);
    for (let r = 0; r < this.rows; r++) {
      const k = this.scrollTop + r, it = this.items[k]; if (!it) break;
      const yy = y + pad + 2 + r * lh;
      if (ic && it.icon >= 0) g.drawImage(IMG.menuicons, it.icon * 32, 0, 32, 32, x + 15, yy - 1, 16, 16);
      Font.draw(g, it.label, x + (ic ? 34 : 16), yy, { col: it.dis ? TXT.gray : it.col || TXT.dark, sh: it.dis ? TXT.gsh : TXT.sh, font: this.o.font });
      if (it.sub) Font.draw(g, it.sub, x + w - 8, yy, { align: "right", font: this.o.font });
      if (k === this.i) cursor(x + 6, yy + 3);
    }
    if (this.scrollTop > 0) { const b = (FRAME >> 4) & 1; for (let i = 0; i < 4; i++) rect(x + w / 2 - 3 + i, y + 3 - b + i, 7 - i * 2, 1, "#d04030"); }
    if (this.scrollTop + this.rows < this.items.length) downArrow(x + w / 2 - 3, y + this.h - 8);
  };
  window.MENU_ICON = { 도감: 0, 남켓몬: 1, 가방: 2, 수첩: 3, 카드: 4, 리포트: 5, 설정: 6, 닫기: 7, 달리기: -1, 타이틀: -1 };

  // ---------- PC 상자 벽지(받은 시안 여덟 장) ----------
  if (typeof drawWallpaper === "function") {
    const WP = { 숲: 0, 노을: 1, 요천: 2, 모래톱: 3, 한옥: 4, 꽃밭: 5, 별밤: 6 }, old = drawWallpaper;
    drawWallpaper = function (K, x, y, w, h) { const im = IMG.boxwall; if (!im) return old(K, x, y, w, h);
      const i = WP[K] !== undefined ? WP[K] : 7; g.drawImage(im, i * 312, 0, 312, 264, x, y, w, h); };
  }

  // ---------- 배틀: 남켓몬 발밑 그림자(발판 위에 떠 보이지 않게) ----------
  const foot = new Map();
  const footOf = (sp) => { const key = sp.key + sp.side; let f = foot.get(key); if (f !== undefined) return f;
    try { const C = cellOf(sp.im), R = ROWS[sp.idleRow()], c = document.createElement("canvas"); c.width = c.height = C; const x = c.getContext("2d");
      x.drawImage(sp.im, 0, R[0] * C, C, C, 0, 0, C, C); const d = x.getImageData(0, 0, C, C).data; let x0 = C, x1 = -1, y1 = -1;
      for (let yy = C - 1; yy >= 0 && y1 < 0; yy--) for (let xx = 0; xx < C; xx++) if (d[(yy * C + xx) * 4 + 3] > 80) { y1 = yy; break; }
      if (y1 < 0) f = null; else { for (let yy = Math.max(0, y1 - Math.round(C * 0.16)); yy <= y1; yy++) for (let xx = 0; xx < C; xx++) if (d[(yy * C + xx) * 4 + 3] > 80) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; }
        const k = 96 / C; f = { cx: (x0 + x1 + 1) / 2 * k, by: (y1 + 1) * k, w: Math.max(14, (x1 - x0 + 1) * k) }; }
    } catch (e) { f = null; }
    foot.set(key, f); return f; };
  const bd = BSprite.prototype.draw;
  BSprite.prototype.draw = function () {
    if (this.vis && this.key && this.im && this.im.complete && this.im.naturalWidth && !(this.blink > 0 && (this.blink >> 2) & 1) && this.sink <= 0 && this.scale >= 0.98) {
      const inv = BT && BT.w && BT.w[this.side] && BT.w[this.side].vol && BT.w[this.side].vol.inv, f = inv ? null : footOf(this);
      if (f) { const P = POS[this.side].mon, sx = P[0] + f.cx + this.dx, sy = P[1] + f.by - 2, rw = f.w * 0.52, rh = Math.max(3, Math.min(7, f.w * 0.1));
        const lift = clamp(-this.dy / 30, 0, 0.7);
        g.save(); g.globalAlpha = 0.26 * (1 - lift); g.fillStyle = "#101820"; g.beginPath(); g.ellipse(Math.round(sx), Math.round(sy), rw * (1 - lift * 0.4), rh, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
    }
    bd.call(this);
  };
  window.UI_V262 = true;
})();
