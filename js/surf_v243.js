// ===== v2.43 파도타기 (v2.45: 폭포오르기 길·폭포 지움) =====
// 사용자: "파도타기 구현 되어있나? 파도타기, 폭포오르기 등 구현이 되어야할 것 같네." · 실제 포켓몬처럼 묘사
// v2.45 사용자: "폭포오르기 기믹은 삭제하자. 기술은 남기고 비전에서 빼. 맵에서 폭포 전부 삭제해."
//   → 폭포오르기는 보통 기술머신98(구룡계곡 낚시꾼, 배지 5 뒤)로. 구룡계곡·뱀사골 폭포 그림, 구룡폭포 위 용소 지도 지움
//     (예전 저장이 용소에 있으면 구룡계곡 물가로, 가방의 비전머신07은 기술머신98로 바꿔 줌)
// 실제 게임처럼:
//   비전머신03 파도타기 — 섬진강 나루 뱃사공(구룡 어사패=배지 4 뒤)에게서. 배지 4부터 밖에서 씀. 물을 보고 A → "물이 깊고 푸르다… 파도타기를 쓰겠습니까?"
//     물 위에서는 실제 4~5세대처럼 둥근 파도타기 몸에 앉아 둥둥 떠다님(달리기만큼 빠름, v2.45), 물에서도 야생 남켓몬이 나옴, 땅으로 가면 내림
//   파도타기로 새로 닿는 섬·건너편 둑(6번도로 강 가운데 섬, 1번도로 요천 건너편, 13번도로 작은 섬)에 도구
"use strict";
Object.assign(ITEMS, {
  hm03: { n: "비전머신03", p: "tm", hm: 1, tm: "surf", tmTypes: ["물"], d: "파도타기를 가르쳐요. 몇 번이고 쓸 수 있어요. 구룡 어사패가 있으면 남켓몬을 타고 물 위를 건너요.", ic: "hm" },
  tm98: { n: "기술머신98", p: "tm", price: 3000, nobuy: 1, tm: "waterfall", tmTypes: ["물"], d: "폭포오르기를 가르쳐요. 굉장한 기세로 부딪혀 상대를 풀죽게 할 때가 있는 물 타입 기술이에요.", ic: "tm" },
});
const SURF_BADGE = 4;
FIELD_MOVES.surf = { badge: SURF_BADGE, use: (m) => useSurfFromMenu(m) };
delete FIELD_MOVES.waterfall;
const surfUser = () => G.party.find(m => m.hp > 0 && m.moves.some(x => x.id === "surf")) || G.party.find(m => m.moves.some(x => x.id === "surf")) || (typeof fieldHelper === "function" ? fieldHelper("surf") : null);   // v2.56 배운 남켓몬이 없으면 도우미 남생배
const canSurf = () => hasBadge(SURF_BADGE) && !!surfUser();
const isSurfing = () => !!G.flag("surf");
const waterAt = (x, y) => { const M = World.M; return !!(M && M.beh[y] && M.beh[y][x] === "water"); };

// 물에서 만나는 남켓몬: 지도별로 따로 정한 것, 없으면 그 지도 낚시표(조금 더 높은 레벨)
const SURF = {};
function surfTable(id) {
  const S = SURF[id]; if (S) return S.list;
  const F = typeof FISH !== "undefined" && FISH[id]; if (!F) return [];
  return F.list.map(e => { const [a, b] = String(e.lv).split(/[–~-]/).map(Number); return Object.assign({}, e, { lv: `${(a || 10) + 5}–${(b || a || 10) + 5}` }); });
}
function surfEnc(list) {
  const tod = timeOfDay(); const t = tod === "아침" ? "낮" : tod;
  return list.filter(e => RARE_W[e.r] && (e.t === "모두" || e.t === t || e.t === tod || (t === "저녁" && e.t === "밤")) && MON[e.k]);
}

async function startSurf(m) {
  m = m || surfUser();
  if (m.helper && typeof helperArrive === "function") await helperArrive(m);
  await say(`${J(mname(m), "은")}\n파도타기를 썼다!`);
  if (typeof fieldCutIn === "function") await fieldCutIn(m);
  G.flag("surf", true); G.surfMon = m.k; sfx("jump");
  const P = World.player;
  if (World.tryMove(P, P.dir, false)) { P.jump = 0; while (P.moving) await frames(1); }
}
async function surfPrompt(x, y) {
  const fish = G.has("oldrod") && typeof fishAt === "function";
  const opts = fish ? ["파도타기", "낚시", "그만두다"] : ["파도타기", "그만두다"];
  const v = await ask("물이 깊고 푸르다……\f파도타기를 쓰겠습니까?", opts);
  if (opts[v] === "파도타기") await startSurf();
  else if (opts[v] === "낚시") await fishAt(x, y);
}
async function useSurfFromMenu(m) {
  const [x, y] = facingTile();
  if (isSurfing() || !waterAt(x, y)) { await say("여기서는 쓸 수 없다."); return; }
  await startSurf(m);
}

// ---- World 덧대기 ----
(() => {
  const s0 = World.solidAt;
  World.solidAt = function (x, y, who) {
    if (who === this.player && isSurfing()) {
      const M = this.M; if (x < 0 || y < 0 || x >= M.w || y >= M.h) return true;
      if (M.beh[y][x] === "water") {          // 물 위: 사람·물건만 막음
        for (const a of this.actors) if (a !== who && !a.hidden && !(a.pass && a.pass(who)) && ((a.x === x && a.y === y) || (a.moving && a.x - a.mx === x && a.y - a.my === y))) return true;
        return false;
      }
    }
    return s0.call(this, x, y, who);
  };
  const t0 = World.tryMove;
  World.tryMove = function (a, dir, run = false) {
    const ok = t0.call(this, a, dir, run);
    if (ok && a === this.player && isSurfing()) { a.speed = RUN_SPD; a.running = false; }
    return ok;
  };
  const o0 = World.onStep;
  World.onStep = function () {
    const P = this.player;
    if (isSurfing() && !waterAt(P.x, P.y)) { G.flag("surf", false); sfx("land"); }      // 땅에 닿으면 내림
    o0.call(this);
    if (!isSurfing() || this.busy || !waterAt(P.x, P.y)) return;
    if (Math.random() >= 0.08) return;                                                 // 물 위 야생(실제 게임처럼 풀숲보다 조금 덜)
    const list = surfEnc(surfTable(G.map)); if (!list.length) return;
    const [k, lv] = rollEnc(list);
    const lead = G.party.find(m => m.hp > 0);
    if (G.repel > 0 && lead && lv < lead.lv) return;
    this.run(() => startWild(k, lv, "water"));
  };
  const i0 = World.interact;
  World.interact = function () {
    const P = this.player, [dx, dy] = DIRS[P.dir], x = P.x + dx, y = P.y + dy;
    if (!this.actorAt(x, y)) {
      if (!isSurfing() && waterAt(x, y) && canSurf() && !(this.M.signs[x + "," + y] || this.M.checks[x + "," + y])) { this.run(() => surfPrompt(x, y)); return; }
    }
    return i0.call(this);
  };
  const l0 = World.load;
  World.load = function (id, x, y, dir) {
    if (id === "guryong_top" && !MAPS.guryong_top) { id = "guryong"; x = 18; y = 12; dir = "up"; G.flag("surf", false); }   // v2.45 지운 용소에 있던 저장 → 구룡계곡 물가
    if (G.bag && G.bag.hm07) { G.bag.tm98 = (G.bag.tm98 || 0) || 1; delete G.bag.hm07; }                                   // 예전 비전머신07 → 기술머신98
    const r = l0.call(this, id, x, y, dir);
    if (isSurfing() && !waterAt(this.player.x, this.player.y)) G.flag("surf", false);   // 물이 아닌 곳으로 옮겨지면(문·날기·되돌림) 내림
    return r;
  };
  // v2.45 실제 포켓몬 4~5세대처럼: 남켓몬을 '타는' 그림 대신 물 위에 둥둥 뜬 둥근 파도타기 몸(어느 남켓몬이든 같은 모양)에 앉아
  //   몸과 사람이 함께 위아래로 천천히 떠오르내림(가만히 있어도) · 물에 잠긴 둘레에 하얀 물거품 · 움직이면 뒤로 물결 자국
  //   그림은 남켓몬만의 것(점 그림 문자열, 닌텐도 그림을 베끼지 않음). 아래·위·옆(오른쪽은 옆을 뒤집음)
  const SB = {
    down: ["....OOOOOOOOOO....", "..OOBBBBBBBBBBOO..", ".OBBLLBBBBBBLLBBO.", "OBBLLWBBBBBBLWLLBO", "OBBBLLBBBBBBLLBBBO", "ODBBBBBBBBBBBBBBDO",
           ".ODBBBBBBBBBBBBDO.", "..ODDBBBBBBBBDDO..", "...OOBEBBBBEBOO...", "....ODBBLLBBDO....", ".....OODDDDOO.....", ".......OOOO......."],
    up: [".......OOOO.......", ".....OOBLLBOO.....", "....OBBBBBBBBO....", "..OOBBBBBBBBBBOO..", ".OBBLLBBBBBBLLBBO.", "OBBLLWBBBBBBLWLLBO",
         "OBBBBBBBBBBBBBBBBO", "ODBBBBBBBBBBBBBBDO", ".ODBBBBBBBBBBBBDO.", "..ODDDBBBBBBDDDO..", "....OOOOOOOOOO....", ".................."],
    left: ["......OOOOOOOOO...", "....OOBBBBBBBBBOO.", "..OOBBLLBBBBBLWLBO", ".OBBBBBBBBBBBBLLBO", "OBEBBBBBBBBBBBBBDO", "OBBBBBBBBBBBBBBBDO",
           "OLLBBBBBBBBBBBBDO.", ".OODDBBBBBBBDDOO..", "...OOOOOOOOOOO....", ".................."],
  };
  const SBP = { O: "#1b3552", B: "#4ea6de", L: "#9ed9f7", W: "#ffffff", D: "#2b70a8", E: "#0e1a2a" };
  function drawSurfBody(dir, x, y) {
    const flip = dir === "right", S = SB[flip ? "left" : dir] || SB.down;
    for (let j = 0; j < S.length; j++) { const r = S[j];
      for (let i = 0; i < r.length; i++) { const c = r[i]; if (c === ".") continue; rect(x + (flip ? r.length - 1 - i : i), y + j, 1, 1, SBP[c]); } }
  }
  const d0 = World.drawPlayer;
  World.drawPlayer = function (a, cx, cy) {
    if (!isSurfing() || a !== this.player) return d0.call(this, a, cx, cy);
    const t = FRAME / 20, bob = Math.round(Math.sin(t) * 1.4), x = a.px - cx, y = a.py - cy, side = a.dir === "left" || a.dir === "right";
    const by = y + (side ? 5 : 3) + bob, wl = y + 13;                  // 몸 위치(떠오르내림) · 물 높이(고정)
    // 물 위 물결 자국(움직일 때 뒤로)
    if (a.moving) { const [dx, dy] = DIRS[a.dir]; for (let k = 1; k <= 3; k++) { const ox = x + 8 - dx * (6 + k * 4), oy = wl + 1 - dy * (k * 4), w = 3 + k * 2;
      g.globalAlpha = 0.85 - k * 0.22; rect(ox - w, oy, w * 2, 1, "#ffffff"); g.globalAlpha = 1; } }
    drawSurfBody(a.dir, x - 1, by);
    // 물에 잠긴 둘레의 하얀 물거품(떠오를 때 조금 드러남)
    const fw = 9 + ((FRAME >> 3) & 1);
    rect(x + 8 - fw, wl, fw * 2, 1, "#ffffff"); rect(x + 8 - fw - 1, wl + 1, 3, 1, "#d8f2ff"); rect(x + 8 + fw - 2, wl + 1, 3, 1, "#d8f2ff");
    g.globalAlpha = 0.55; rect(x - 1, wl + 1, 18, 3, "#3f8fd0"); g.globalAlpha = 1;      // 물에 잠긴 아랫부분
    // 사람: 앉은 모습(허리 위만), 몸과 함께 떠오르내림
    g.save(); g.beginPath(); g.rect(x - 4, y - 16 + bob, 24, 21); g.clip();
    const m0 = a.moving, p0 = a.p; a.moving = false;
    d0.call(this, a, cx, cy + 3 - bob);
    a.moving = m0; a.p = p0; g.restore();
  };
})();

// ---- 비전머신 주는 사람 ----
(() => {
  const SJ = MAPS.seomjin && MAPS.seomjin.npcs.find(n => n.id === "sj_boatman");
  if (SJ) { const t0 = SJ.talk; SJ.talk = async (a) => {
    if (hasBadge(SURF_BADGE) && !G.has("hm03")) {
      await say("뱃사공: 오, 구룡 어사패를 받았구먼!\f저 섬까지는 나룻배로도\n못 가지만\f너한텐 남켓몬이 있잖니.");
      await say("뱃사공: 이걸 가져가거라.\n파도타기를 가르치는 비전머신이다.");
      await getItem("hm03");
      await say("뱃사공: 물을 바라보고 A를 누르면\n남생배가 와서 등에 태워 준단다.\f파도타기를 배운 남켓몬이 있으면\n그 녀석 등에 타도 되고.\f물 위에도 남켓몬이 산다.\n조심해서 다니거라!");
      return; }
    // v2.47 어사패 4 전에도 원래 이야기(본디회)와 나룻배를 그대로 — 배를 안 타면 섬 이야기를 덧붙임(v2.43에서 나룻배가 막혔던 것 고침)
    if (!hasBadge(SURF_BADGE) && !G.has("hm03")) { if (typeof t0 === "function") await t0(a); else await say(t0);
      if (G.map === "seomjin") await say("뱃사공: 저 섬엔 나룻배로도\n못 간단다.\f구룡 어사패쯤은 받아 와야\n물이 너를 믿어 줄 게다."); return; }
    return typeof t0 === "function" ? t0(a) : say(t0); }; }
  const GR = MAPS.guryong && MAPS.guryong.npcs.find(n => n.id === "gr_fisher");
  if (GR) { const t0 = GR.talk; GR.talk = async (a) => {
    if (hasBadge(5) && !G.has("tm98") && !G.flag("got_tm98")) {
      await say("낚시꾼: 오, 어사패가 다섯 개나!\f이 계곡 물고기들은\n거센 물살을 거슬러 헤엄친단다.\f그 힘을 담은 기술이지.\n이걸 가져가거라.");
      await getItem("tm98"); G.flag("got_tm98", true);
      await say("낚시꾼: 폭포오르기를 가르치는\n기술머신이다.\f물 타입 남켓몬에게 가르치면\n센 물 공격을 할 수 있지.\f가끔 상대가 겁먹고\n움직이지 못하기도 한단다.");
      return; }
    return typeof t0 === "function" ? t0(a) : say(t0); }; }
})();

// ---- v2.45 맵에서 폭포 지움: 구룡계곡·뱀사골 폭포 그림과 물줄기 살펴보기 글을 걷어 냄(아래 땅·물은 그대로) ----
(() => {
  const RM = { guryong: [[18, 5], [19, 5], [20, 5], [21, 5]], baemsagol: [[14, 3], [15, 3], [16, 3], [17, 3]] };
  for (const id in RM) { const M = MAPS[id]; if (!M) continue;
    M.stamps = (M.stamps || []).filter(st => st[0] !== "waterfall");
    if (M.checks) M.checks = M.checks.filter(c => !RM[id].some(([x, y]) => c[0] === x && c[1] === y)); }
  window.FALLS_REMOVED_V245 = true;
})();

// ---- 파도타기로 새로 닿는 섬·건너편 둑에 도구(실제 게임처럼 물 건너 작은 보상) ----
(() => {
  const ADD = [["route6", 27, 29, "ok", 3], ["world", 57, 63, "hyperpotion", 1], ["world", 57, 41, "elixir", 1]];
  for (const [m, x, y, it, n] of ADD) if (MAPS[m] && ITEMS[it]) MAPS[m].npcs.push(n > 1 ? { item: it, n, x, y } : { item: it, x, y });
})();
