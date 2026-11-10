// ===== v2.66 도로마다 다른 곡 · v2.67 마을·도로 곡 전부 포켓몬풍으로 다시 지음(같은 이름의 파일을 바꿈) + 굴 곡(cave) · 교룡산성은 9번도로 곡
"use strict";
(() => {
  // 구역 이름 → 곡. 한 맵에 구역이 여럿이어도 같은 도로면 같은 곡(구역을 넘을 때 곡이 끊기지 않게)
  const ROAD = {
    "2번도로": "route2", "오리정": "route2",
    "3번도로": "route3", "옹기 가마": "route3",
    "4번도로": "route4", "대산 쉼터": "route4",
    "5번도로": "route5", "주생 들판": "route5", "요천 둑길": "route5",
    "6번도로": "route6", "7번도로": "route7", "8번도로": "route8", "9번도로": "route9", "10번도로": "route10",
    "11번도로": "route11", "12번도로": "route12", "14번도로": "route14", "15번도로": "route15",
    "보절 들판": "route16", "산동 숲길": "route16", "보절 북쪽 들": "route16",
    "교룡산성": "route9",
  };
  const done = [];
  for (const id in MAPS) { const zi = MAPS[id].zinfo; if (!zi) continue;
    for (const zn in zi) if (ROAD[zn] && zi[zn].bgm === "route") { zi[zn].bgm = ROAD[zn]; done.push(id + "/" + zn); } }
  for (const id in MAPS) if (MAPS[id].bgm === "route" && (MAPS[id].cave || /cave/.test(id))) { MAPS[id].bgm = "cave"; done.push(id); }   // v2.67 얼음굴·바람굴
  // 이야기 장면이 끝나고 bgm("route")로 되돌리는 곳(3번도로 옹이 장면 등) → 지금 선 도로의 곡으로
  const play = Audio2.play;
  Audio2.play = function (n, ...a) {
    if (n === "route") { try { if (Scenes.top() === World && World.def && World.player) { const zi = World.zoneInfo(), b = typeof zi.bgm === "function" ? zi.bgm() : zi.bgm; if (/^route\d+$/.test(b)) n = b; } } catch (e) {} }
    return play.call(Audio2, n, ...a);
  };
  window.BGM_V266 = { ROAD, done };
})();
