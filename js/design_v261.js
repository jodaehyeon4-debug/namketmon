// ===== v2.61 디자인 다듬기 — 화면 모양만 고침(이야기·밸런스·저장 자료는 그대로) =====
// 사용자(2026-11-10): "포켓몬 본가(HGSS·BW·ORAS) 기준으로 디자인을 다시 검토하고, 바로 고칠 수 있는 건 직접 고쳐서 새 버전으로"
// 이 파일 하나에 모음 — index.html에서 맨 끝(main.js 바로 앞)에 읽혀 앞 파일의 그리기 함수를 덮어씀
//  1) 배틀 이름표(HP 상자): 그림자·모서리·아래 경험치 띠 · 'Lv'와 'EXP'가 겹치던 것 · 잡은 남켓몬 볼은 모서리에
//  2) HP 막대·경험치 막대·배틀 글상자: 한 가지 모양으로(둥근 통, 밝은 줄·어두운 줄)
//  3) 남켓몬 고르기: 작은 칸에서 이름과 Lv가 겹치던 것 · 상태 이상 자리
//  4) 능력치 화면: 경험치 줄·특성 설명이 칸 밖으로 나가던 것 · 기술 칸 PP가 테두리에 걸리던 것
//  5) 이름 글자판: 탭 글자(한글·ABC…)가 반쯤 가려지던 것
//  6) 필드: 사람 발밑 그림자(BW처럼)
//  7) 어사패 받기·진화: 빛살·반짝이(어사패 그림은 2배로 또렷하게 — 전엔 3배라 다른 그림보다 도트가 굵었음)
//  8) 터치 단추: 태블릿에서 크게, 화면 양 끝(엄지 자리)에 · 가로로 든 태블릿은 화면 양옆에 · 십자키 화살표 · 누른 방향 불빛
//  그림 파일: img/townmap.png(src/townmap_v261.py — 지형·강·길을 HGSS풍으로 다시 칠함, 자리는 그대로) · img/tiles_out.png 풀숲 빛깔(src/grass_v261.py)
"use strict";
(function designV261() {
  const INK = "#262a3a";                      // 이름표·막대 테두리(한 가지로)
  const px = (x, y, c) => { g.fillStyle = c; g.fillRect(x, y, 1, 1); };
  // 3×5 작은 글자(HP·EXP 딱지)
  const TINY = { H: ["101", "101", "111", "101", "101"], P: ["111", "101", "111", "100", "100"], E: ["111", "100", "110", "100", "111"], X: ["101", "101", "010", "101", "101"] };
  function tiny(s, x, y, c) { g.fillStyle = c; for (const ch of s) { const G5 = TINY[ch]; if (G5) for (let r = 0; r < 5; r++) for (let k = 0; k < 3; k++) if (G5[r][k] === "1") g.fillRect(x + k, y + r, 1, 1); x += 4; } }

  // ---------------------------------------------------------------- 2) HP 막대 · 경험치 막대 · 배틀 글상자
  hpBar = function (x, y, w, frac) {           // 자리·크기는 예전과 같음(너비 w+18, 높이 7)
    frac = clamp(frac, 0, 1);
    rect(x + 1, y, w + 16, 7, INK); rect(x, y + 1, w + 18, 5, INK);
    tiny("HP", x + 4, y + 1, "#ffc83a");
    rect(x + 16, y + 1, w + 1, 5, "#4a5266"); rect(x + 16, y + 1, w + 1, 1, "#3a4052");
    const c = frac > 0.5 ? ["#3ecf6c", "#9af4ae", "#2a9c50"] : frac > 0.2 ? ["#f2ba22", "#ffe878", "#c08c12"] : ["#ea4a3c", "#ffa090", "#b02c24"];
    const fw = frac > 0 ? Math.max(1, Math.ceil((w + 1) * frac)) : 0;
    if (fw > 0) { rect(x + 16, y + 1, fw, 5, c[0]); rect(x + 16, y + 2, fw, 1, c[1]); rect(x + 16, y + 5, fw, 1, c[2]); }
  };
  expBar = function (x, y, w, frac) {
    rect(x, y, w + 2, 4, INK); rect(x + 1, y + 1, w, 2, "#4a5266");
    const fw = Math.floor(w * clamp(frac, 0, 1)); if (fw > 0) { rect(x + 1, y + 1, fw, 2, "#3aa2f2"); rect(x + 1, y + 1, fw, 1, "#a4dcff"); }
  };
  darkBox = function (x, y, w, h) {            // 배틀 글상자: 금빛 줄 한 겹 + 모서리 깎기 + 위쪽 밝은 줄
    rect(x, y, w, h, "#10141f");
    rect(x + 2, y + 1, w - 4, h - 2, "#dcbc68"); rect(x + 1, y + 2, w - 2, h - 4, "#dcbc68");
    rect(x + 2, y + 2, w - 4, h - 4, "#1a2136");
    rect(x + 3, y + 3, w - 6, h - 6, "#2e3c62");
    rect(x + 3, y + 3, w - 6, 1, "#44578a");
    rect(x + 3, y + Math.floor(h / 2), w - 6, h - Math.floor(h / 2) - 3, "#2a3759");
    rect(x + 3, y + h - 4, w - 6, 1, "#222d4a");
  };

  // ---------------------------------------------------------------- 1) 배틀 이름표
  function plate(x, y, w, h) {
    g.globalAlpha = 0.3; rect(x + 2, y + 3, w, h, "#000000"); g.globalAlpha = 1;                 // 그림자
    rect(x + 2, y, w - 4, h, INK); rect(x, y + 2, w, h - 4, INK); rect(x + 1, y + 1, w - 2, h - 2, INK);
    rect(x + 2, y + 1, w - 4, h - 2, "#f7f5ea"); rect(x + 1, y + 2, w - 2, h - 4, "#f7f5ea");
    rect(x + 2, y + 1, w - 4, 1, "#ffffff");
  }
  const genderCol = gd => gd === "m" ? [TXT.blue, TXT.bsh] : [TXT.red, TXT.rsh];
  Battle.prototype.drawBox = function (s) {
    const b = this.box[s], w = this.w[s]; if (!b.vis || !w) return;
    const m = w.m, sp = MON[m.k], T = this.types(w), tw = typeChipsW(T);
    if (s === "E") {
      const x = Math.round(6 + b.off), y = 12;
      plate(x, y, 140, 32);
      rect(x + 1, y + 16, 138, 13, "#e9e5d2"); rect(x + 2, y + 29, 136, 2, "#d2cdb6"); rect(x + 1, y + 16, 138, 1, "#dad5c0");
      const nw = Font.draw(g, mname(m), x + 6, y + 1, { fit: 130 - (m.gender ? 14 : 0) - tw });
      if (m.gender) { const [c, sh] = genderCol(m.gender); Font.draw(g, m.gender === "m" ? "♂" : "♀", x + 8 + nw, y + 1, { col: c, sh }); }
      typeChips(T, x + 10 + nw + (m.gender ? 12 : 0), y + 2);
      if (this.wild && G.caught[m.k]) sprite(IMG.misc, JSN.misc.t.ball_icon * 16, 0, 16, 16, x - 7, y - 7);   // 잡아 본 남켓몬: 이름표 모서리에 볼
      if (m.status) statusBadge(m.status, x + 5, y + 18);
      hpBar(x + 36, y + 20, m.lv >= 100 ? 51 : 56, b.hp / m.st[0]);   // v2.70 레벨 100이면 "Lv100"이 막대 끝에 닿아서 막대를 조금 줄임
      Font.draw(g, "Lv" + m.lv, x + 135, y + 17, { font: "g9", align: "right" });
    } else {
      const x = Math.round(114 + b.off), y = 96;
      plate(x, y, 140, 44);
      for (let i = 0; i < 5; i++) { rect(x - 1 - i, y + 14 + i, 1, 11 - i * 2, INK); if (i < 4) rect(x - i, y + 15 + i, 1, 9 - i * 2, "#f7f5ea"); }   // 내 남켓몬 쪽을 가리키는 꼬리
      rect(x + 2, y + 35, 136, 8, INK); rect(x + 1, y + 35, 138, 6, INK);                         // 아래 경험치 띠
      const nw = Font.draw(g, mname(m), x + 8, y + 1, { fit: 126 - (m.gender ? 14 : 0) - tw });
      if (m.gender) { const [c, sh] = genderCol(m.gender); Font.draw(g, m.gender === "m" ? "♂" : "♀", x + 10 + nw, y + 1, { col: c, sh }); }
      typeChips(T, x + 12 + nw + (m.gender ? 12 : 0), y + 2);
      hpBar(x + 30, y + 17, 86, b.hp / m.st[0]);
      const lw = Font.draw(g, "Lv" + m.lv, x + 8, y + 23, { font: "g9" });
      if (m.status) statusBadge(m.status, x + 12 + lw, y + 24);
      const hpN = Math.max(0, Math.round(b.hp)), low = hpN > 0 && hpN <= m.st[0] / 5;
      Font.draw(g, `${hpN}/${m.st[0]}`, x + 135, y + 23, { font: "g9", align: "right", col: low ? TXT.red : TXT.dark, sh: low ? TXT.rsh : TXT.sh });
      const lo = expAt(sp.gr, m.lv), hi = expAt(sp.gr, m.lv + 1), ex = b.exp ?? m.exp;
      tiny("EXP", x + 7, y + 37, "#ffc83a");
      const fw = Math.floor(112 * clamp(m.lv >= 100 ? 0 : (ex - lo) / Math.max(1, hi - lo), 0, 1));
      rect(x + 22, y + 37, 112, 4, "#4a5266"); rect(x + 22, y + 37, 112, 1, "#3a4052");
      if (fw > 0) { rect(x + 22, y + 37, fw, 4, "#3aa2f2"); rect(x + 22, y + 38, fw, 1, "#a4dcff"); rect(x + 22, y + 40, fw, 1, "#2a7ac8"); }
    }
  };

  // ---------------------------------------------------------------- 3) 남켓몬 고르기 칸
  PartyScreen.prototype.slot = function (i) {
    const m = G.party[i]; const sel = this.i === i, sw = this.swap === i;
    const [x, y, w, h] = i === 0 ? [4, 18, 98, 62] : [106, 4 + (i - 1) * 28, 148, 26];
    if (!m) { panel(x, y, w, h, "rgba(30,52,62,.30)", "rgba(20,40,50,.38)"); rect(x + 3, y + 3, w - 6, 1, "rgba(255,255,255,.07)"); return; }
    const fnt = m.hp <= 0;
    const c = sw ? "#f8b878" : sel ? "#f8e8a0" : fnt ? "#e8b0a8" : "#a8d8f0";
    g.globalAlpha = 0.25; rect(x + 2, y + 2, w, h, "#000000"); g.globalAlpha = 1;
    panel(x, y, w, h, c, sel ? "#d04030" : INK);
    rect(x + 2, y + 1, w - 4, 1, "rgba(255,255,255,.6)"); rect(x + 2, y + h - 2, w - 4, 1, "rgba(0,0,0,.12)");
    const lab = this.mode === "tm" && this.tmId ? (tmOk(m, this.tmId) ? ["배울 수 있다", 1] : ["배울 수 없다", 0])
      : this.mode === "evo" && this.evoId ? (ITEMS[this.evoId].evo[m.k] ? ["쓸 수 있다", 1] : ["쓸 수 없다", 0]) : this.labFn ? this.labFn(m) : null;
    const labDraw = (lx, ly, al) => Font.draw(g, lab[0], lx, ly, { font: "g9", align: al, col: lab[1] ? TXT.blue : TXT.red, sh: null });
    const gdr = (gx, gy) => { if (m.gender) Font.draw(g, m.gender === "m" ? "♂" : "♀", gx, gy, { font: "g9", col: m.gender === "m" ? TXT.blue : TXT.red, sh: null }); };
    if (i === 0) {
      drawIcon(m.k, x + 2, y + 2, sel); Font.draw(g, mname(m), x + 36, y + 5, { fit: w - 40 });
      const lw = Font.draw(g, "Lv" + m.lv, x + 36, y + 21, { font: "g9" }); gdr(x + 40 + lw, y + 21);
      if (lab) labDraw(x + w - 6, y + 42, "right");
      else { hpBar(x + 8, y + 38, 64, m.hp / m.st[0]); Font.draw(g, `${m.hp}/${m.st[0]}`, x + w - 7, y + 47, { font: "g9", align: "right" }); }
      if (m.status || fnt) statusBadge(fnt ? "fnt" : m.status, x + 7, y + 48);
    } else {
      drawIcon(m.k, x + 1, y - 4, sel); Font.draw(g, mname(m), x + 34, y - 1, { fit: 50 });        // 큰 글씨는 그린 자리보다 3칸 아래부터 13칸: 이름 y+2~14 · Lv y+16~24(전엔 한 칸 겹치고 아래 테두리에 걸렸음)
      const lw = Font.draw(g, "Lv" + m.lv, x + 34, y + 14, { font: "g9" }); gdr(x + 38 + lw, y + 14);
      if (m.status || fnt) statusBadge(fnt ? "fnt" : m.status, x + 50 + lw, y + 13);
      if (lab) labDraw(x + w - 6, y + 8, "right");
      else { hpBar(x + w - 66, y + 5, 42, m.hp / m.st[0]); Font.draw(g, `${m.hp}/${m.st[0]}`, x + w - 6, y + 14, { font: "g9", align: "right" }); }
    }
  };

  // ---------------------------------------------------------------- 4) 능력치 화면(자리만 다시 잡음 — 내용·조작은 menus.js Summary 그대로)
  Summary.prototype.draw = function () {
    const m = this.m, sp = MON[m.k];
    bgPattern("#e8dcc0", "#efe5cc");
    rect(0, 0, SW, 20, "#c05030"); rect(0, 18, SW, 2, "#7a2a18"); rect(0, 0, SW, 1, "#d87050");
    Font.draw(g, ["남켓몬 정보", "능력치", "기술"][this.page], 8, 2, { col: TXT.white, sh: "#7a2a18" });
    for (let k = 0; k < 3; k++) rect(214 + k * 12, 7, 8, 6, k === this.page ? "#f8e070" : "#7a2a18");
    panel(4, 24, 100, 112, "#d8e8f0"); rect(5, 25, 98, 1, "#eef6fa");
    monFront(m.k, 6, 30, 0, m.shiny);
    rect(4, 120, 100, 16, "#3a3a46"); const nw = Font.draw(g, mname(m), 8, 120, { col: TXT.white, sh: TXT.wsh, fit: 80 });
    if (m.gender) Font.draw(g, m.gender === "m" ? "♂" : "♀", 10 + nw, 120, { col: m.gender === "m" ? "#90b0ff" : "#ff9090", sh: null });
    if (m.shiny) Font.draw(g, "★", 8, 32, { col: "#ffd040", sh: "#a06010" });
    Font.draw(g, "Lv" + m.lv, 101, 122, { font: "g9", col: TXT.white, sh: TXT.wsh, align: "right" });
    const bi = JSN.balls.keys.indexOf(m.ball || "namket"); sprite(IMG.balls, 0, Math.max(0, bi) * 16, 16, 16, 6, 26);
    if (m.status) statusBadge(m.status, 70, 28);
    const X = 110;
    if (this.page === 0) {
      const rows = [["도감 번호", String(sp.no).padStart(3, "0")], ["이름", sp.n], ["타입", ""], ["어버이", m.ot || G.name], ["ID No.", String(m.otid || G.id).padStart(5, "0")], ["지닌 물건", m.item ? itemName(m.item) : "없음"]];
      rows.forEach(([a, b], k) => { const y = 26 + k * 16; rect(X, y, 56, 14, "#c8b890"); Font.draw(g, a, X + 4, y, { font: "g9" }); if (k === 2) sp.t.forEach((t, j) => typeBadge(t, X + 62 + j * 38, y)); else Font.draw(g, b, X + 62, y - 1, { fit: 80 }); });
      panel(4, 140, 248, 50, "#fbf8f0");
      const nat = NATURES[m.nat][0];
      Font.draw(g, `${nat} 성격.`, 12, 143); Font.draw(g, `${m.met || "용성지방"}에서 Lv${m.metLv || m.lv}일 때 만났다.`, 12, 159, { font: "g9" });
      Font.draw(g, sp.motif, 12, 172, { font: "g9", col: TXT.gray, sh: null, fit: 232 });
    } else if (this.page === 1) {
      const nat = NATURES[m.nat];
      rect(X, 26, 140, 14, "#c8b890"); Font.draw(g, "HP", X + 4, 26, { font: "g9" }); Font.draw(g, `${m.hp}/${m.st[0]}`, X + 136, 26, { align: "right", font: "g9" });
      const jd = typeof judgeWord === "function" && G.flag("judge_on");
      const sy = k => 44 + k * 12;                                                   // 능력치 줄(12칸 간격) — 경험치 줄까지 칸 안에
      if (jd) for (let k = 0; k < 6; k++) { const [wd, c] = judgeWord(m, k); Font.draw(g, wd, X + 50, k ? sy(k) : 26, { font: "g9", col: c, sh: null }); }
      hpBar(X + 40, 43, 76, m.hp / m.st[0]);
      for (let k = 1; k < 6; k++) { const y = sy(k); const up = nat[1] === k && nat[1] !== nat[2], dn = nat[2] === k && nat[1] !== nat[2];
        if (k % 2) rect(X, y + 1, 140, 12, "rgba(200,184,144,.28)");
        Font.draw(g, STN[k], X + 4, y, { font: "g9", col: up ? TXT.red : dn ? TXT.blue : TXT.dark, sh: up ? TXT.rsh : dn ? TXT.bsh : TXT.sh }); Font.draw(g, String(m.st[k]), X + 136, y, { font: "g9", align: "right" }); }
      const lo = expAt(sp.gr, m.lv), hi = expAt(sp.gr, m.lv + 1);
      rect(X, 121, 140, 14, "#c8b890"); Font.draw(g, "경험치", X + 4, 121, { font: "g9" }); Font.draw(g, String(m.exp), X + 136, 121, { font: "g9", align: "right" });
      panel(4, 140, 248, 50, "#fbf8f0");
      Font.draw(g, "다음 레벨까지 " + (m.lv >= 100 ? 0 : hi - m.exp), 12, 141, { font: "g9" }); expBar(130, 146, 112, (m.exp - lo) / Math.max(1, hi - lo));
      const a = AB[m.ab];
      const aw = Font.draw(g, "특성  " + (a ? a.n : m.ab), 12, 153, { font: "g9", col: "#a03020", sh: TXT.rsh });
      if (MON[m.k] && MON[m.k].ab[1] === m.ab && !MON[m.k].ab[0].includes(m.ab)) Font.draw(g, "· 숨은 특성", 16 + aw, 153, { font: "g9", col: "#6a3aa8", sh: null });
      if (a && a.orig) Font.draw(g, "★남원 특성  A: 이야기", 244, 153, { font: "g9", align: "right", col: "#b07818", sh: null });
      Font.wrap(a ? a.d : "", 232, "g9").slice(0, 2).forEach((l, k) => Font.draw(g, l, 12, 164 + k * 11, { font: "g9" }));
    } else {
      m.moves.forEach((mv, k) => { const y = 24 + k * 28, d = MV[mv.id];
        panel(X, y, 142, 27, this.mi === k ? "#f8e8a0" : "#fbf8f0"); typeBadge(d.t, X + 4, y + 2);
        Font.draw(g, d.n, X + 42, y, { fit: d.orig ? 84 : 96 });
        Font.draw(g, `PP ${mv.pp}/${mv.max}`, X + 137, y + 13, { font: "g9", align: "right" });
        if (d.orig) Font.draw(g, "★", X + 137, y + 1, { font: "g9", align: "right", col: "#c08818", sh: null }); });
      panel(4, 140, 248, 50, "#fbf8f0");
      if (this.mi >= 0) { const d = MV[m.moves[this.mi].id];
        Font.draw(g, `분류 ${{ P: "물리", S: "특수", X: "변화" }[d.c]}  위력 ${d.bp || "-"}  명중 ${d.acc > 100 ? "-" : d.acc}`, 12, 141, { font: "g9" });
        Font.wrap(d.d || "", 232, "g9").slice(0, 3).forEach((l, k) => Font.draw(g, l, 12, 153 + k * 11, { font: "g9" })); }
      else Font.draw(g, "A: 기술 설명 보기  (★ = 남원 전용기술)", 12, 150, { font: "g9", col: TXT.gray, sh: null });
      if (this.mi >= 0 && MV[m.moves[this.mi].id].orig) Font.draw(g, "A: 남원 이야기", 244, 141, { font: "g9", align: "right", col: "#b07818", sh: null });
    }
    if (this.lore) {
      frame(6, 30, 244, 150); rect(10, 34, 236, 16, "#7a4a20");
      Font.draw(g, "★ 남원 이야기 — " + this.lore[0], 16, 35, { col: "#fff4d0", sh: "#3a2010" });
      Font.wrap(this.lore[1] || "", 224, "g9").slice(0, 9).forEach((l, k) => Font.draw(g, l, 16, 56 + k * 13, { font: "g9" }));
      Font.draw(g, "A/B: 닫기", 240, 164, { font: "g9", align: "right", col: TXT.gray, sh: null });
    }
  };

  // ---------------------------------------------------------------- 5) 이름 글자판 탭(글자가 글자판 판에 반쯤 가려졌음)
  if (typeof NameKB !== "undefined" && typeof KB_PAGES !== "undefined") {
    const d0 = NameKB.prototype.draw;
    NameKB.prototype.draw = function () {
      d0.call(this);
      KB_PAGES.forEach((p, i) => { const x = 14 + i * 58, on = i === this.page;
        rect(x, 58, 54, 16, on ? "#2a3a4a" : "#3e627c"); rect(x + 1, 59, 52, 15, on ? "#f8d848" : "#86b0c8"); rect(x + 1, 59, 52, 1, on ? "#fff0a0" : "#a8cce0");
        Font.draw(g, p.n, x + 27, 59, { font: "g9", align: "center", col: on ? TXT.dark : "#ffffff", sh: on ? null : "#3e627c" }); });
      rect(12, 74, 232, 1, "#2a3a4a");
    };
  }

  // ---------------------------------------------------------------- 6) 필드: 발밑 그림자
  { const da0 = World.drawActor;
    World.drawActor = function (a, cx, cy) {
      if (!a.item && !a.special && !a.jump && !a.noShadow && !(a === this.player && typeof isSurfing === "function" && isSurfing())) {
        const x = Math.round(a.px - cx), y = Math.round(a.py - cy);
        g.globalAlpha = 0.2; g.fillStyle = "#0a1420";
        g.fillRect(x + 4, y + 12, 8, 1); g.fillRect(x + 3, y + 13, 10, 2); g.fillRect(x + 4, y + 15, 8, 1);
        g.globalAlpha = 1;
      }
      return da0.call(this, a, cx, cy);
    }; }

  // ---------------------------------------------------------------- 7) 어사패 받기 · 진화
  function rays(cx, cy, r0, r1, n, t, col, alpha) {
    g.save(); g.globalAlpha = alpha; g.fillStyle = col; g.translate(cx, cy);
    for (let i = 0; i < n; i++) { const a = t + i * Math.PI * 2 / n, w = Math.PI / n * 0.5;
      g.beginPath(); g.moveTo(Math.cos(a - w) * r0, Math.sin(a - w) * r0); g.lineTo(Math.cos(a - w) * r1, Math.sin(a - w) * r1); g.lineTo(Math.cos(a + w) * r1, Math.sin(a + w) * r1); g.lineTo(Math.cos(a + w) * r0, Math.sin(a + w) * r0); g.fill(); }
    g.restore();
  }
  function twinkle(x, y, k, c) { if (k <= 0) return; rect(x, y, 1, 1, c); if (k > 1) { rect(x - 1, y, 3, 1, c); rect(x, y - 1, 1, 3, c); } if (k > 2) { rect(x - 2, y, 5, 1, c); rect(x, y - 2, 1, 5, c); } }
  if (typeof getBadge === "function" && typeof BADGE_N !== "undefined") {
    getBadge = async function (n, giver) {
      if (!hasBadge(n)) G.badges.push(n);
      let t = 0;
      const ov = new Overlay(() => {
        t++;
        const k = Math.min(1, t / 18);
        g.fillStyle = "rgba(12,10,24,0.6)"; g.fillRect(0, 0, SW, 144);
        g.save(); g.beginPath(); g.rect(0, 0, SW, 144); g.clip();
        rays(128, 60, 8, 150, 12, t / 70, "#ffe9a0", 0.16 * k); rays(128, 60, 8, 110, 12, -t / 90 + 0.26, "#ffffff", 0.10 * k);
        g.restore();
        const by = 60 - Math.round((1 - k) * (1 - k) * 40);                                           // 위에서 내려와 자리 잡음
        g.globalAlpha = 0.35 * k; g.fillStyle = "#fff6c8"; g.beginPath(); g.arc(128, by, 30 + Math.sin(t / 9) * 2, 0, 7); g.fill(); g.globalAlpha = 1;
        if (IMG.badges) { g.imageSmoothingEnabled = false; g.drawImage(IMG.badges, (n - 1) * 20, 0, 20, 20, 108, by - 20, 40, 40); }
        for (let i = 0; i < 8; i++) { const a = t / 26 + i * Math.PI / 4, r = 30 + Math.sin(t / 7 + i) * 4;
          twinkle(Math.round(128 + Math.cos(a) * r), Math.round(by + Math.sin(a) * r * 0.8), ((t >> 3) + i) % 4, i % 2 ? "#fff4b0" : "#ffffff"); }
        const nm = BADGE_N[n - 1] + " 어사패", w = Math.max(96, Font.width(nm) + 24), x0 = Math.round(128 - w / 2);
        rect(x0 + 2, 104, w - 4, 20, INK); rect(x0, 106, w, 16, INK); rect(x0 + 1, 105, w - 2, 18, INK);
        rect(x0 + 2, 105, w - 4, 18, "#f7f5ea"); rect(x0 + 1, 106, w - 2, 16, "#f7f5ea"); rect(x0 + 2, 120, w - 4, 3, "#e4dfc8");
        Font.draw(g, nm, 128, 106, { align: "center" });
        Font.draw(g, `어사패 ${G.badges.length}/8`, 128, 128, { align: "center", font: "g9", col: "#fff4d0", sh: "#3a2a10" });
      });
      Scenes.push(ov);
      const tb = await say(`${J(G.name, "은")} ${giver}에게서\n${BADGE_N[n - 1]} 어사패를 받았다!`, { keep: true });
      await Audio2.jingle("jg_badge");
      Scenes.pop(tb); Scenes.pop(ov);
    };
  }
  if (typeof EvoScene !== "undefined") {
    EvoScene.prototype.draw = function () {
      const t = this.t, lit = Math.max(this.white, this.mix);
      if (typeof bandSky === "function") bandSky([[0, "#141c48"], [1, "#4464a8"]], SH); else { const gr = g.createLinearGradient(0, 0, 0, 144); gr.addColorStop(0, "#141c48"); gr.addColorStop(1, "#4464a8"); g.fillStyle = gr; g.fillRect(0, 0, SW, SH); }
      g.save(); g.beginPath(); g.rect(0, 0, SW, 144); g.clip();
      rays(128, 58, 10, 180, 14, t / 60, "#bcd8ff", 0.05 + 0.12 * lit); rays(128, 58, 10, 120, 14, -t / 80 + 0.2, "#ffffff", 0.03 + 0.09 * lit);
      g.globalAlpha = 0.25 + 0.3 * lit; g.fillStyle = "#e8f2ff"; g.beginPath(); g.arc(128, 58, 34 + Math.sin(t / 8) * 3, 0, 7); g.fill(); g.globalAlpha = 1;
      g.restore();
      for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283 + t / 90, r = 44 + (i % 3) * 20 + Math.sin(t / 20 + i) * 6;
        twinkle(Math.round(128 + Math.cos(a) * r), Math.round(64 + Math.sin(a) * r * 0.6), 1 + ((t >> 3) + i) % 3, i % 2 ? "#ffe8a0" : "#a8d8ff"); }
      for (let i = 0; i < 10; i++) { const u = ((t * (0.6 + (i % 4) * 0.2) + i * 37) % 120) / 120; rect(52 + (i * 53) % 152, 140 - Math.round(u * 120), 1, 2 + (i % 2), `rgba(255,255,255,${(0.55 * (1 - u) * (0.3 + lit)).toFixed(2)})`); }   // 위로 떠오르는 빛
      const showB = this.mix > 0.5;
      const key = this.cur === this.b ? this.b : showB ? this.b : this.a;
      const im = sheetOf(key, this.sh); if (!im.complete) { darkBox(0, 144, 256, 48); return; }
      const f = Math.floor(FRAME / 4) % 24, C = cellOf(im);
      tmpG.clearRect(0, 0, 192, 192); tmpG.globalCompositeOperation = "source-over"; tmpG.drawImage(im, f * C, 0, C, C, 0, 0, C, C);
      if (this.white > 0) { tmpG.globalCompositeOperation = "source-atop"; tmpG.globalAlpha = this.white; tmpG.fillStyle = "#fff"; tmpG.fillRect(0, 0, C, C); tmpG.globalAlpha = 1; tmpG.globalCompositeOperation = "source-over"; }
      g.globalAlpha = 0.28; g.fillStyle = "#0a1030"; g.beginPath(); g.ellipse(128, 104, 30, 5, 0, 0, 7); g.fill(); g.globalAlpha = 1;
      g.drawImage(tmpC, 0, 0, C, C, 80, 8, 96, 96);
      darkBox(0, 144, 256, 48);
    };
  }

  // ---------------------------------------------------------------- 8) 터치 단추(태블릿) · 화면 맞춤
  const css = document.createElement("style");
  css.textContent = `
body.touch #wrap { padding-block: max(10px, env(safe-area-inset-top, 0px)) 8px; }
body.touch #pad { width: min(100%, 1180px); box-sizing: border-box; padding-inline: clamp(4px, 2.6vw, 34px); margin-block: auto; }
body.touch.side #pad { width: auto; margin: 0; padding: 12px max(14px, env(safe-area-inset-right, 0px)) max(18px, 11vh, env(safe-area-inset-bottom, 0px)) max(14px, env(safe-area-inset-left, 0px)); }
#dpad, .ab { flex: none; }
#dpad i { background: #343246; box-shadow: inset 0 -3px 0 rgba(0,0,0,.4), inset 0 2px 0 rgba(255,255,255,.07); }
#dpad .c { background: #1c1b26; box-shadow: none; }
#dpad b { position: absolute; width: 0; height: 0; border: calc(8px * var(--cs, 1)) solid transparent; opacity: .5; pointer-events: none; }
#dpad b.u { left: calc(58px * var(--cs, 1)); top: calc(6px * var(--cs, 1)); border-top-width: 0; border-bottom: calc(12px * var(--cs, 1)) solid #c9c5d8; }
#dpad b.d { left: calc(58px * var(--cs, 1)); bottom: calc(6px * var(--cs, 1)); border-bottom-width: 0; border-top: calc(12px * var(--cs, 1)) solid #c9c5d8; }
#dpad b.l { top: calc(58px * var(--cs, 1)); left: calc(6px * var(--cs, 1)); border-left-width: 0; border-right: calc(12px * var(--cs, 1)) solid #c9c5d8; }
#dpad b.r { top: calc(58px * var(--cs, 1)); right: calc(6px * var(--cs, 1)); border-right-width: 0; border-left: calc(12px * var(--cs, 1)) solid #c9c5d8; }
#dpad[data-dir="up"] b.u, #dpad[data-dir="down"] b.d, #dpad[data-dir="left"] b.l, #dpad[data-dir="right"] b.r { opacity: 1; filter: drop-shadow(0 0 4px #f0c040); }
.btn { box-shadow: inset 0 -4px 0 rgba(0,0,0,.35), inset 0 3px 0 rgba(255,255,255,.22), 0 3px 0 rgba(0,0,0,.45); }
.pill { white-space: nowrap; color: #d6d2e2; background: #343246; font-size: calc(13px * var(--cs, 1)); padding: calc(9px * var(--cs, 1)) calc(18px * var(--cs, 1)); border-radius: 999px; box-shadow: inset 0 -2px 0 rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.08); }
#scr { box-shadow: inset 0 0 0 2px var(--bezel), inset 0 0 0 3px rgba(255,255,255,.05), 0 8px 24px rgba(0,0,0,.45); }
`;
  document.head.appendChild(css);
  const dp = document.getElementById("dpad");
  if (dp && !dp.querySelector("b")) {
    for (const k of ["u", "d", "l", "r"]) { const e = document.createElement("b"); e.className = k; dp.appendChild(e); }
    const at = e => { const r = dp.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      if (Math.hypot(x, y) < 10) return dp.dataset.dir || ""; return Math.abs(x) > Math.abs(y) ? (x > 0 ? "right" : "left") : (y > 0 ? "down" : "up"); };
    let on = false;
    dp.addEventListener("pointerdown", e => { on = true; dp.dataset.dir = at(e); });
    dp.addEventListener("pointermove", e => { if (on) dp.dataset.dir = at(e); });
    for (const ev of ["pointerup", "pointercancel", "lostpointercapture"]) dp.addEventListener(ev, () => { on = false; dp.dataset.dir = ""; });
    addEventListener("blur", () => { on = false; dp.dataset.dir = ""; });
  }
  // 화면 맞춤: 단추를 태블릿에서 더 크게(짧은 변 560 → 1배, 810 → 1.45배) · 가로로 든 기기는 화면 양옆 단추를 먼저 고름
  const canvas = document.getElementById("screen");
  fit = function () {
    const B = document.body, touch = B.classList.contains("touch"), dpr = Math.min(3, window.devicePixelRatio || 1);
    const W = innerWidth, H = innerHeight;
    const cs = touch ? Math.max(1, Math.min(1.5, Math.min(W, H) / 560)) : 1, csS = Math.min(cs, 1.3);   // 양옆 단추는 1.3배까지(가로 태블릿에서 화면 3배가 들어가게)
    const scale = (aw, ah) => { const f = Math.min(aw / SW, ah / SH), kd = Math.floor(f * dpr); if (kd < 1) return Math.max(0.2, f);
      const k = kd / dpr; return touch && dpr >= 2 && f > k * 1.12 ? Math.floor(f * 100) / 100 : k; };
    const below = scale(W - 44, H - (touch ? 132 * cs + 40 : 40) - 30);
    const sideW = 140 * csS + 22, side = touch && W > H ? scale(W - 2 * sideW, H - 28) : 0;
    const useSide = side > 0 && side >= below * 0.9;
    B.classList.toggle("side", useSide);
    document.documentElement.style.setProperty("--cs", (useSide ? csS : cs).toFixed(3));
    const k = useSide ? side : below;
    canvas.style.width = SW * k + "px"; canvas.style.height = SH * k + "px";
  };
  addEventListener("resize", fit);
  fit();
  window.DESIGN_V261 = true;
})();
