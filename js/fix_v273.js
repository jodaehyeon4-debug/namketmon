// ===== v2.73 출두의 은직성: 볼을 던지면 반드시 들어옴 =====
// 사용자(2026-11-15): "은직성 이거 잡히는거 맞냐? … 아예 잡히지가 않아. 볼 50개 던짐"
// 원인: 은직성은 전설이라 포획률이 3(체력이 가득이면 볼 하나에 1~2%). 그런데 이 장면은 은직성이 "함께 가고 싶다는 듯" 스스로 내려와
//   '잡을 때까지' 되풀이되는 이야기 장면이라, 낮은 확률은 아이들을 붙잡아 둘 뿐이었다
// 고침: 만복사의 밤 이 장면에서만 은직성은 어떤 볼이든 한 번에 들어옴(실제 포켓몬의 이야기 전설처럼 — 구조만). 다른 곳의 전설은 그대로
"use strict";
(function fixV273() {
  if (typeof cxWild !== "function") return;
  const cw0 = cxWild;
  cxWild = async function (k, lv, o) {
    if (k !== "eunjikseong" || !MON[k]) return cw0(k, lv, o);
    const m = MON[k], c = m.cr; m.cr = 100000;
    try { return await cw0(k, lv, o); } finally { m.cr = c; }
  };
  window.FIX_V273 = true;
})();
