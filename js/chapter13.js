// ===== v2.8 곁길 ③: 8번도로(1번도로 요천 둔치 → 요천 다리 → 요천 동쪽 둑길 → 송동 들판 → 송화마을 북쪽)
//   타운맵 '송동에서 요천을 따라 다시 시내 남쪽으로 돌아가는 길'(Lv24–27 그대로). 구룡 어사패 뒤 열림 — 송화·주홍을 지난 뒤라 이야기 순서를 건너뛰지 않음
// chapter12.js 뒤, hearts.js 앞에 읽힘
// 사실(위키백과 '요천'): 장안산·팔공산에서 시작해 남원 분지 남원시 가운데를 지나 금지면 하도리에서 섬진강으로 흘러듦,
//   강가에 여뀌꽃이 많이 피어 '여뀌 요(蓼)' 자를 써 요천이라 함
"use strict";
if (typeof FISH !== "undefined") FISH.route8 = { at: "8번도로", list: [{ k: "eunchimi", lv: "22–26", r: "흔함", t: "모두" }, { k: "daseulmi", lv: "22–26", r: "흔함", t: "밤" }, { k: "gaegulmi", lv: "24–26", r: "가끔", t: "모두" }] };
if (typeof HIDDEN !== "undefined") HIDDEN.route8 = [[40, 3, "superpotion"], [3, 47, "ether"] , [33, 50, "fullheal"]];

async function yocheonBlock() {
  await say("미안! 요천 다리 너머 8번도로는\n아직 공사 중이란다.\f(구룡 어사패를 받으면\n열린대요.)");
  await walk(World.player, "left");
}
async function songhwaNorthBlock() {
  await say("미안! 북쪽 8번도로는\n아직 공사 중이란다.");
  await walk(World.player, "down");
}

(function attachChapter13() {
  const D = MAPDATA;
  const open = () => hasBadge(4);
  // ---- 1번도로 요천 둔치 → 요천 다리 ----
  const W = MAPS.world;
  W.warps = (W.warps || []).concat([58, 59].map(y => [59, y, ["route8", 0, y - 50, "right", "edge"]]));
  W.triggers = (W.triggers || []).concat([58, 59].map(y => ({ x: 51, y, cond: () => !open(), run: yocheonBlock })));
  W.signs.push([47, 57, "→ 요천 다리 · 8번도로\n송화마을(송동) 방면"]);
  W.npcs.push({ id: "w_bridge_worker", x: 49, y: 57, spr: "man", dir: "down", move: "fixed", show: () => !open(), talk: "미안! 다리 너머는\n아직 공사 중이란다." },
    { id: "w_bridge_guide", x: 49, y: 60, spr: "woman", dir: "up", move: "look", show: open,
      talk: "아주머니: 요천 다리를 건너면\n송동까지 강을 따라 갈 수 있어.\f강바람이 시원하단다." });
  // ---- 송화마을 북쪽 ----
  const SH = MAPS.songhwa;
  SH.warps = (SH.warps || []).concat([18, 19, 20, 21].map(x => [x, 0, ["route8", x, 55, "up", "edge"]]));
  SH.areas = (SH.areas || []).concat([{ x0: 18, y0: 1, x1: 21, y1: 1, cond: () => !open(), run: songhwaNorthBlock }]);
  SH.npcs.push({ id: "sh_n_worker", x: 17, y: 2, spr: "man", dir: "right", move: "fixed", show: () => !open(), talk: "미안! 북쪽 8번도로는\n아직 공사 중이란다." });

  // ---- 8번도로 ----
  const R = D.route8;
  MAPS.route8 = {
    rows: R.rows, stamps: R.stamps, name: "8번도로",
    warps: [8, 9].map(y => [0, y, ["world", 59, y + 50, "left", "edge"]]).concat([18, 19, 20, 21].map(x => [x, 55, ["songhwa", x, 0, "down", "edge"]])),
    zones: [["8번도로", 0, 0, 43, 55]],
    zinfo: { "8번도로": { bgm: "route", enc: "8번도로", rate: 0.12, bg: "grass" } },
    signs: [[12, 7, "8번도로\n← 요천 다리 · 다홍시티 남쪽\f↓ 송화마을(송동)"],
      [9, 26, "요천\f장안산과 팔공산에서 시작해\n남원 시내 한가운데를 지나\f금지에서 섬진강으로\n흘러들어요."],
      [22, 42, "↓ 송화마을\n솔숲과 섬진강 사이 쉼터 마을"]],
    checks: [],
    npcs: [
      { id: "r8_granny", x: 12, y: 16, spr: "oldwoman", dir: "left", move: "look",
        talk: "할머니: 요천의 '요'는\n여뀌라는 풀 이름이란다.\f강가에 여뀌꽃이 많이 피어서\n그렇게 불렀다더구나." },
      { id: "r8_farmer", x: 33, y: 18, spr: "man", dir: "down", move: "look",
        talk: "아저씨: 과수원 나무는\n해마다 가지를 쳐 줘야 해.\f아깝다고 다 두면\n열매가 작아지거든." },
      { id: "r8_kid", x: 20, y: 22, spr: "kid_f", move: "wander", r: 1, talk: "논에 개구리 알이 있어!\f올챙이가 되면\n또 보러 올 거야." },
      { item: "superpotion", x: 35, y: 9 }, { item: "repeat", n: 3, x: 20, y: 32 }, { item: "revive", x: 26, y: 50 }, { item: "superrepel", x: 40, y: 52 },
      { x: 13, y: 12, spr: "kid_m", dir: "left", trainer: { id: "r8_jiu", cls: "낚시 소년", name: "지우", spr: "kid_m", range: 6, base: 14, team: [["daseulmi", 24], ["cheongdungkong", 25]],
        intro: "요천은 내 앞마당이야!\n한 판 하자!", lose: "앞마당을 내줬다……", after: "다슬기는 밤에\n돌 위로 기어 나와." } },
      { x: 26, y: 26, spr: "bugboy", dir: "left", trainer: { id: "r8_hajin", cls: "벌레잡이", name: "하진", spr: "bugboy", range: 4, base: 14, team: [["sogeumjaeng", 25], ["cheongdungkong", 26]],
        intro: "논물 위를 걷는\n소금쟁이 봤어?", lose: "물 위로 미끄러졌다……", after: "소금쟁이는 다리에 난\n털 덕분에 물 위에 서." } },
      { x: 35, y: 30, spr: "kid_f", dir: "down", trainer: { id: "r8_dain", cls: "꼬마 숙녀", name: "다인", spr: "kid_f", range: 3, base: 14, team: [["yeonbangul", 24]],
        intro: "아침 이슬 맺힌 풀숲은\n반짝반짝해!", lose: "이슬이 말랐다……", after: "아침엔 풀잎마다\n이슬이 맺혀." } },
      { x: 22, y: 49, spr: "hiker", dir: "left", trainer: { id: "r8_bongsu", cls: "등산객", name: "봉수", spr: "hiker", range: 4, base: 16, team: [["gaegulmi", 25], ["sogeumjaeng", 25]],
        intro: "강변 걷기도\n등산만큼 좋지!", lose: "허허, 다리가 후들거리네.", after: "물가 길은 평평해도\n오래 걸으면 힘들어." } },
      { x: 16, y: 47, spr: "kid_m", dir: "right", trainer: { id: "r8_yechan", cls: "꼬마", name: "예찬", spr: "kid_m", range: 5, base: 14, team: [["cheongdungkong", 24], ["daseulmi", 24], ["sogeumjaeng", 25]],
        intro: "송화마을 가기 전에\n나랑 한 판!", lose: "셋 다 졌다……", after: "송화마을엔 솔숲 정자가\n있어. 쉬어 가!" } },
    ],
  };
  Object.assign(TOWN_ZONE, { "8번도로": "r8" });
})();
