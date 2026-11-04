// ===== v2.42 새 얼음 남켓몬 사는 곳 =====
// 사용자: "얼음타입 2~3마리 추가 — 뭘 없애지는 말고, 3~4관장쯤에 잡을 수 있는 얼음타입 특수어태커. 얼음타입 입수시기가 너무 늦어"
// 종 자료는 js/data.js(src/mons_v242.py): 152 빙빙이(물·얼음) → Lv32 153 은빙어 · 154 동치무(얼음)
// 실제 포켓몬처럼 물고기는 낚싯대로: 빙빙이 = 섬진강 나루·6번도로(배지 3, 가끔) / 은빙어 = 13번도로(드묾, 반야봉 뒤)
"use strict";
(() => {
  const add = (m, e) => { if (FISH[m] && !FISH[m].list.some(x => x.k === e.k)) FISH[m].list.push(e); };
  add("seomjin", { k: "bingbingi", lv: "20–26", r: "가끔", t: "모두" });
  add("route6", { k: "bingbingi", lv: "18–24", r: "가끔", t: "모두" });
  add("route13", { k: "eunbingeo", lv: "30–34", r: "드묾", t: "모두" });
  // 동치무: 11번도로 고갯길 풀숲(배지 3, 가끔) — 출현표는 chapter5.js가 정함
  const R11 = DATA.spawns["11번도로"]; if (R11 && !R11.some(e => e.k === "dongchimu")) R11.push({ k: "dongchimu", lv: "20–24", t: "모두", r: "가끔" });
})();
