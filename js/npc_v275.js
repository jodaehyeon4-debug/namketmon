// ===== v2.75 필드 인물이 '툭' 나타나거나 사라지지 않게 =====
// 사용자: "맵에서 갑자기 npc가 등장하거나, 대화 후 갑자기 삭제되는 경우가 빈번하게 발생해."
// 원인: 이야기 스크립트 90여 곳이 a.hidden = true / false 로 사람을 바로 지우거나 세움(걸어 나가지 않고 그 자리에서 사라짐).
// 고침(스크립트는 그대로, 한곳에서): 화면에 보이는 사람이
//   · 사라질 때 → 가까운 출입구(문·길 끝)나 화면 밖까지 걸어 나간 뒤 사라짐. 갈 길이 없으면 천천히 옅어짐.
//     (이미 걸어서 문 앞에 간 뒤 사라지는 경우는 예전처럼 바로 — 문으로 들어간 것)
//   · 나타날 때(hidden = false · 새로 끼워 넣음) → 천천히 짙어지며 나타남.
// 보이지 않을 때(화면 밖 · 배틀 · 어두워진 전환 중)는 예전 그대로 바로 바뀜. 실제 포켓몬처럼 묘사(인물이 걸어 나감 — 구조만)
"use strict";
(function npcV275() {
  if (typeof Actor === "undefined" || typeof World === "undefined") return;
  const LEAVE_MAX = 16, LEAVE_T = 150, FADE_IN = 28, FADE_OUT = 16;   // 5단계 F5: 나타날 때 14 → 28프레임(약 0.5초)으로 '툭' 덜 보이게
  const person = a => a && a !== World.player && !a.item && !a.special && !a.noFade && !/^ball_/.test(a.id || "") &&
    ((typeof CH === "function" && CH().keys.includes(a.spr)) || (JSN.leaders_field && JSN.leaders_field.keys.includes(a.spr)));
  function worldShown() {              // 필드가 지금 실제로 보이는가(배틀·전환 화면에 가려지지 않음)
    if (!World.M || !Scenes.has(World) || Screen.fade > 0.35) return false;
    const st = Scenes.st, i = st.indexOf(World);
    for (let j = i + 1; j < st.length; j++) if (st[j] && st[j].opaque) return false;
    return true;
  }
  function onScreen(a, pad = 0) { const [cx, cy] = World.cam, x = a.x * TS - cx, y = a.y * TS - cy;
    return x > -TS * (1 + pad) && x < SW + TS * pad && y > -TS * (1 + pad) && y < SH + TS * pad; }
  // 나갈 길: 가까운 문(출입구) 또는 화면 밖 칸까지(사람·주인공이 선 칸은 피함)
  function exitPath(a) {
    const M = World.M, P = World.player, key = (x, y) => y * M.w + x, prev = new Map([[key(a.x, a.y), null]]), q = [[a.x, a.y, 0]];
    let goal = null;
    while (q.length) { const [x, y, d] = q.shift();
      if ((x !== a.x || y !== a.y) && (M.warps[x + "," + y] || !onScreen({ x, y }, 0.5))) { goal = [x, y]; break; }
      if (d >= LEAVE_MAX) continue;
      for (const dir of ["up", "down", "left", "right"]) { const [dx, dy] = DIRS[dir], nx = x + dx, ny = y + dy, k = key(nx, ny);
        if (prev.has(k) || nx < 0 || ny < 0 || nx >= M.w || ny >= M.h || M.solid[ny][nx]) continue;
        if (P && P.x === nx && P.y === ny) continue;
        if (World.actors.some(o => o !== a && !o.hidden && o.x === nx && o.y === ny)) continue;
        prev.set(k, [key(x, y), dir]); q.push([nx, ny, d + 1]); } }
    if (!goal) return null;
    const out = []; let k = key(goal[0], goal[1]); while (prev.get(k)) { const [pk, d] = prev.get(k); out.unshift(d); k = pk; }
    return out;
  }
  // hidden 을 '뜻'(_h)과 '그리기'로 나눔: 걸어 나가는 동안은 이미 없는 사람(말 걸기·부딪힘·시선 없음)이지만 그림은 보임
  Object.defineProperty(Actor.prototype, "hidden", { configurable: true,
    get() { return World._nkDraw && this._ghost ? false : !!this._h; },
    set(v) { v = !!v; const was = !!this._h; this._h = v; if (v === was) return;
      if (!World.M || !World.actors.includes(this)) { this._pend = 0; this._ghost = 0; this._alpha = 1; return; }
      if (v) this._pend = 1;
      else { if (this._ghost) { this._ghost = 0; this._leave = null; backHome(this); }
        this._pend = this._pend === 1 ? 0 : 2; } } });

  function backHome(a) {            // 걸어 나간 자리에서 원래 자리로(스크립트가 그사이 옮겼으면 그 자리 그대로)
    const moved = a._gp && (a.x !== a._gp[0] || a.y !== a._gp[1]);
    a.moving = false; a.p = 0; a.speed = 1;
    if (!moved && a._hx) { a.x = a._hx[0]; a.y = a._hx[1]; a.dir = a._dir0 || a.dir; } }
  function tick() {
    const show = worldShown();
    for (const a of World.actors) {
      if (a.moving) a._mvF = FRAME;
      if (!a._seen) { a._seen = 1; if (World._nkLoaded && show && !a._h && person(a) && onScreen(a)) a._alpha = 0.01; }   // 새로 끼워 넣은 사람
      if (a._pend === 1) { a._pend = 0;
        if (a._h && show && person(a) && onScreen(a) && !(a._mvF && FRAME - a._mvF < 6)) {
          a._ghost = 1; a._gT = 0; a._hx = [a.x, a.y]; a._gp = [a.x, a.y]; a._dir0 = a.dir; a._alpha = 1; a._leave = exitPath(a) || []; } }
      if (a._pend === 2) { a._pend = 0; if (!a._h && show && person(a) && onScreen(a)) a._alpha = 0.01; }
      if (a._ghost && a._gp && (a.x !== a._gp[0] || a.y !== a._gp[1])) {   // 5단계 F5(04 S2): 걸어 나가는 사이 스크립트가 옮겼으면 그 자리를 존중하고 걷기를 끝냄
        a._ghost = 0; a._leave = null; a._alpha = 1; a.speed = 1; a._hx = null; continue; }
      if (a._ghost) { a._gT++;
        if (!a.moving && a._leave.length && a._gT < LEAVE_T) { const d = a._leave.shift(), [dx, dy] = DIRS[d];
          a.dir = d; a.x += dx; a.y += dy; a.mx = dx; a.my = dy; a.moving = true; a.p = 0; a.step++; a.jump = 0; a.speed = 2; a._gp = [a.x, a.y]; }
        const out = !a.moving && (!a._leave.length || a._gT >= LEAVE_T);
        if (out || !onScreen(a, 0.2)) { a._alpha = Math.max(0, (a._alpha || 1) - 1 / (out && a._gT < 8 ? FADE_OUT : 6));
          if (a._alpha <= 0 || !show) { a._ghost = 0; a._leave = null; a._alpha = 1; backHome(a); } } }
      else if (a._alpha < 1) a._alpha = Math.min(1, a._alpha + 1 / FADE_IN);
    }
  }
  const up0 = World.update;
  World.update = function (focus) { const r = up0.apply(this, arguments); try { tick(); } catch (e) { if (typeof nkErr === "function") nkErr("npc275", e); } return r; };
  const dr0 = World.draw;
  World.draw = function () { this._nkDraw = 1; try { return dr0.apply(this, arguments); } finally { this._nkDraw = 0; } };
  const da0 = World.drawActor;
  World.drawActor = function (a) { const al = a._alpha; if (al == null || al >= 1 || a === this.player) return da0.apply(this, arguments);
    const s = g.globalAlpha; g.globalAlpha = s * Math.max(0, al); try { return da0.apply(this, arguments); } finally { g.globalAlpha = s; } };
  World.drawActor._inner = da0;
  const ld0 = World.load;
  World.load = function () { this._nkLoaded = 0; const r = ld0.apply(this, arguments); for (const a of this.actors) { a._seen = 1; a._alpha = 1; a._ghost = 0; a._pend = 0; } this._nkLoaded = 1; return r; };
  window.NPC_V275 = { exitPath, person, worldShown };
})();
