// ===== v2.70 명예의 전당 등록 장면 =====
// 전에는 기록대 앞에서 글상자로 이름만 한 줄씩 읽어 주었다. 이제 남켓몬이 한 마리씩 빛 속에 나와 울음소리를 내고
// (이름 · 레벨 · 종 · 타입), 마지막에 여섯 마리와 주인공이 한자리에 선다. 기록대를 살피면 지난 기록도 볼 수 있다.
// 실제 포켓몬처럼 묘사(전당 등록: 한 마리씩 소개 → 모두 함께 — 구조만, 닌텐도 그림·문구는 베끼지 않음) · chapter25/26 · story_v264 뒤에 읽힘
"use strict";
(function hofV270() {
  if (typeof MAPS === "undefined" || !MAPS.hof) return;
  const ease = t => t * t * (3 - 2 * t), clamp = t => Math.max(0, Math.min(1, t));
  const Rn = n => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
  const GOLD = "#f0c850", GOLD2 = "#fff0a8", GSH = "#6a4a10";

  class HofScene {
    constructor(party, o = {}) { this.opaque = true; this.t = 0; this.i = -1; this.in = 1; this.all = 0; this.party = party; this.title = o.title || "명예의 전당"; this.sub = o.sub || "";
      for (const m of party) sheetOf(m.k, m.shiny); }
    update() { this.t++; if (this.in < 1) this.in = Math.min(1, this.in + 1 / 20); if (this.all > 0 && this.all < 1) this.all = Math.min(1, this.all + 1 / 36); }
    show(i) { this.i = i; this.in = 0; this.all = 0; }
    lineup() { this.i = -1; this.all = 0.01; }
    mon(m, x, y, sz, white = 0) { const im = sheetOf(m.k, m.shiny); if (!im.complete) return; const C = cellOf(im), f = Math.floor(FRAME / 4) % 24;
      tmpG.clearRect(0, 0, 192, 192); tmpG.globalCompositeOperation = "source-over"; tmpG.drawImage(im, f * C, 0, C, C, 0, 0, C, C);
      if (white > 0) { tmpG.globalCompositeOperation = "source-atop"; tmpG.globalAlpha = white; tmpG.fillStyle = "#fff"; tmpG.fillRect(0, 0, C, C); tmpG.globalAlpha = 1; tmpG.globalCompositeOperation = "source-over"; }
      g.drawImage(tmpC, 0, 0, C, C, Math.round(x), Math.round(y), sz, sz); }
    draw() {
      // 바탕: 밤빛 전당 + 금빛 기둥 + 빛줄기
      for (let y = 0; y < SH; y += 4) { const u = y / SH; rect(0, y, SW, 4, `rgb(${Math.round(18 + 34 * u)},${Math.round(20 + 16 * u)},${Math.round(52 + 44 * u)})`); }
      for (const x of [10, 232]) { rect(x, 0, 14, 144, "#2a2448"); rect(x + 2, 0, 3, 144, "#4a4270"); rect(x - 2, 0, 18, 5, GOLD); rect(x - 2, 5, 18, 2, GSH); }
      g.globalAlpha = .16 + .04 * Math.sin(this.t / 22); g.fillStyle = GOLD2; g.beginPath(); g.moveTo(112, 0); g.lineTo(144, 0); g.lineTo(196, 118); g.lineTo(60, 118); g.fill(); g.globalAlpha = 1;
      for (let i = 0; i < 18; i++) { const tw = (Math.sin(this.t / 14 + i * 1.7) + 1) / 2; if (tw > .55) rect(Math.round(30 + Rn(i) * 196), Math.round(8 + Rn(i + 9) * 70), 2, 2, i % 2 ? GOLD2 : "#b8d0ff"); }
      // 받침: 금테 두른 단
      g.fillStyle = GSH; g.beginPath(); g.ellipse(128, 116, 62, 12, 0, 0, 7); g.fill(); g.fillStyle = GOLD; g.beginPath(); g.ellipse(128, 114, 60, 11, 0, 0, 7); g.fill();
      g.fillStyle = "#3a3266"; g.beginPath(); g.ellipse(128, 113, 54, 8, 0, 0, 7); g.fill();
      Font.draw(g, this.title, 128, 4, { font: "g9", align: "center", col: GOLD2, sh: GSH });
      if (this.sub) Font.draw(g, this.sub, 128, 15, { font: "g9", align: "center", col: "#d8d8f0", sh: "#2a2448" });
      const P = this.party;
      if (this.i >= 0 && P[this.i]) {                                   // 한 마리씩: 오른쪽에서 들어와 단 위에
        const m = P[this.i], u = ease(this.in), x = 80 + (1 - u) * 130, sp = MON[m.k];
        this.mon(m, x, 18, 96, 1 - clamp(this.in * 1.6));
        if (this.in >= 1 && m.shiny) for (let i = 0; i < 5; i++) { const a = this.t / 12 + i * 1.26; rect(Math.round(128 + Math.cos(a) * 44), Math.round(62 + Math.sin(a) * 30), 2, 2, GOLD2); }
        const a2 = clamp(this.in * 2 - .6); g.globalAlpha = a2;
        rect(28, 122, 200, 19, "#161430"); rect(29, 123, 198, 17, "#2c2856"); rect(29, 123, 198, 1, GOLD);
        Font.draw(g, `${this.i + 1}`, 34, 126, { font: "g9", col: GOLD, sh: GSH });
        const nw = Font.draw(g, mname(m), 44, 124, { col: "#f8f8f8", sh: "#5a5a6a", fit: 92 });
        Font.draw(g, "Lv" + m.lv, 48 + nw, 127, { font: "g9", col: GOLD2, sh: GSH });
        Font.draw(g, `${sp.n} · ${sp.t.join("·")}`, 223, 127, { font: "g9", align: "right", col: "#d8d8f0", sh: "#2a2448", fit: 90 });
        g.globalAlpha = 1;
      } else if (this.all > 0) {                                        // 모두 함께: 여섯 마리가 차례로 톡 내려서고 주인공이 앞에
        const n = P.length, gap = n > 4 ? 38 : 46, sz = 48;
        P.forEach((m, i) => { const u = clamp(this.all * (n + 2) - i), y0 = 46 + (i % 2) * 6, hop = u < 1 ? -18 * Math.sin(u * Math.PI) : 0;
          if (u > 0) this.mon(m, 128 + (i - (n - 1) / 2) * gap - sz / 2, y0 + hop - (1 - ease(u)) * 10, sz); });
        if (IMG.player && JSN.player) { const J2 = JSN.player, row = Math.max(0, J2.keys.indexOf((G.gender === "f" ? "player_f" : "player_m") + "_walk")), s = J2.scale || 1;
          spriteS(IMG.player, 0, row * 24 * s, 16 * s, 24 * s, 112, 94, 32, 48); }
        for (let i = 0; i < 34; i++) { const yy = ((this.t * (.6 + Rn(i) * .7) + Rn(i + 3) * 150) % 150) - 6, xx = 24 + Rn(i + 5) * 208 + Math.sin(this.t / 16 + i) * 5;
          rect(Math.round(xx), Math.round(yy), 2, i % 3 ? 2 : 3, [GOLD, "#f08070", "#80c0f0", GOLD2, "#a0e090"][i % 5]); }
      }
      darkBox(0, 144, 256, 48);
    }
  }
  window.HofScene = HofScene;

  // ---- 등록 장면(말·깃발·기록은 예전 그대로, 그림만 얹음) ----
  const run = async function hofEvent() {
    const P = World.player, d = MAPDATA.hof.dev;
    if (G.flag("hof_now")) return;
    G.flag("hof_now", true);
    bgm("hof");
    const JB = act("hof_jb");
    await say("교장 선생님: 여기는 명예의 전당.\f리그를 이긴 트레이너와\n남켓몬을 기록하는 곳이다.");
    await walkTo(P, d.altar[0], d.altar[1] + 1); P.dir = "up";
    await say("기록대에 남켓몬의 이름을\n하나씩 새겼다……");
    const party = G.party.slice(0, 6), nth = (G.hof || []).length + 1;
    const sc = new HofScene(party, { sub: `${nth}번째 기록 · ${G.name}` });
    await fadeOut(12); Scenes.push(sc); await fadeIn(12);
    for (let i = 0; i < party.length; i++) { const m = party[i]; sc.show(i); await frames(22); if (Audio2.cry) Audio2.cry(m.k); sfx("select");
      await say(`${mname(m)}  Lv.${m.lv}\f${MON[m.k].n} · ${MON[m.k].t.join("·")}`); }
    const rec = { t: Date.now(), party: G.party.map(m => [m.k, m.lv, m.nick || ""]) };
    G.hof = (G.hof || []).concat([rec]); G.flag("champion", true);
    sc.lineup(); await frames(40);
    await Audio2.jingle("jg_badge");
    await say(`${J(G.name, "과")} 남켓몬들의 이름이\n명예의 전당에 새겨졌다!`);
    await fadeOut(12); Scenes.pop(sc); await fadeIn(12);
    if (JB) face(JB, P);
    await say("조박사: ……이제 진짜 졸업이네.\f근데 졸업은 끝이 아니라\n'시작'이라는 뜻도 있대.");
    if (typeof endingRun === "function") { await endingRun(); return; }
    G.flag("hof_now", false);
    await fadeOut(16); World.load("obang", 19, 11, "down"); World.cam = World.camTarget(); await fadeIn(16);
  };
  window.hofEvent = run;
  for (const a of MAPS.hof.areas || []) if (a.run && a.run.name === "hofEvent") a.run = run;

  // ---- 기록대: 지난 기록 다시 보기 ----
  async function hofRecords() {
    const H = G.hof || [];
    if (!H.length) return say("명예의 전당 기록대.\f리그를 이긴 트레이너와\n남켓몬의 이름이 새겨져 있다.");
    await say(`명예의 전당 기록대.\f${G.name}의 기록이\n${H.length}번 새겨져 있다.`);
    const pick = H.length === 1 ? 0 : await ask("어느 기록을 볼까?", H.slice(-4).map((r, i) => `${H.length - Math.min(4, H.length) + i + 1}번째 기록`).concat(["그만둔다"]));
    const base = H.length - Math.min(4, H.length); if (pick < 0 || base + pick >= H.length) return;
    const r = H[base + pick], party = r.party.filter(x => MON[x[0]]).map(([k, lv, nick]) => ({ k, lv, nick: nick || "", shiny: false }));
    if (!party.length) return;
    const dt = new Date(r.t), sc = new HofScene(party, { sub: `${base + pick + 1}번째 기록 · ${dt.getFullYear()}. ${dt.getMonth() + 1}. ${dt.getDate()}.` });
    await fadeOut(10); Scenes.push(sc); sc.lineup(); sc.all = 1; await fadeIn(10);
    await say(party.map(m => `${m.nick || MON[m.k].n} Lv.${m.lv}`).reduce((o, s, i) => o + (i ? (i % 2 ? "\n" : "\f") : "") + s, ""));
    await fadeOut(10); Scenes.pop(sc); await fadeIn(10);
  }
  window.hofRecords = hofRecords;
  for (const c of MAPS.hof.checks || []) c[2] = hofRecords;
  window.HOF_V270 = { run, hofRecords };
})();
