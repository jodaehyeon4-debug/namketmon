// ===== v2.72 갈매 배움터 문 앞을 막던 한결 =====
// 사용자(2026-11-15): "갈매마을 관장전 하려는데 라이벌이 길막중."
// 원인: 3장에서 '운동장을 도는 한결'(hangyeol_yard)을 갈매마을 (26,10)에 세워 두었는데, 그 칸이 나중에 열리는 갈매 배움터(여덟째) 문 바로 앞 칸이었다.
//   보이는 조건이 '한결 넷째 승부 뒤'뿐이라 끝까지 그 자리에 서 있어 배움터에 들어갈 수 없었다(시험은 그 승부를 건너뛴 채 문을 지나서 못 잡음)
// 고침: ① 그 한결은 미끄럼틀 옆 빈 칸으로 옮기고, 어사패 셋을 받으면(다음 승부 자리로 떠남) 사라짐
//       ② 어느 지도든 들어설 때, 길을 막으려고 세운 사람이 아닌데 문 바로 앞 칸에 서 있는 사람은 옆 빈 칸으로 비켜 세움(같은 실수가 또 있어도 막히지 않게)
// 실제 포켓몬처럼 묘사(문 앞은 늘 비어 있음 — 구조만) · story/safe 뒤, main.js 앞에 읽힘
"use strict";
(function fixV272() {
  const GA = MAPS.galmae;
  if (GA) { const hy = (GA.npcs || []).find(n => n.id === "hangyeol_yard");
    if (hy) { hy.x = 22; hy.y = 11; hy.dir = "up"; const s0 = hy.show; hy.show = () => (!s0 || s0()) && !hasBadge(3); } }
  // 문 앞 비우기
  const GATE = /door_kid|worker|guard|gate|block|sb_sori/;                 // 일부러 길을 막는 사람(조건이 풀리면 사라짐)
  const l0 = World.load;
  World.load = function (id, x, y, dir) {
    const r = l0.call(this, id, x, y, dir);
    try { const M = this.M, doors = new Set(Object.keys(M.warps || {}).filter(k => { const [dx, dy] = k.split(",").map(Number); return M.beh[dy] && M.beh[dy][dx] === "door"; }));
      for (const st of this.def.stamps || []) if (st[0] === "gym8") doors.add((st[1] + 3) + "," + (st[2] + 5));     // 나중에 열리는 문
      for (const a of this.actors) { if (a === this.player || a.trainer || a.special || a.item || GATE.test(a.id || "") || a.blocker) continue;
        if (!doors.has(a.x + "," + (a.y - 1))) continue;
        const spot = [[-1, 0], [1, 0], [-2, 0], [2, 0], [-1, 1], [1, 1]].map(([dx, dy]) => [a.x + dx, a.y + dy]).find(([nx, ny]) => !this.solidAt(nx, ny, a) && !doors.has(nx + "," + (ny - 1)) && !(this.player.x === nx && this.player.y === ny));
        if (spot) { a.x = spot[0]; a.y = spot[1]; } } } catch (e) { if (typeof nkErr === "function") nkErr("fix272", e); }
    return r;
  };
  window.FIX_V272 = true;
})();
