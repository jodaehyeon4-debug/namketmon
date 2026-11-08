// ===== v2.9 곁길 ④: 16번도로(미색 북쪽 → 산동 숲길 → 보절 들판 → 갈매마을 동쪽) · 라이벌 한결 8차전
//   타운맵 '산동과 보절의 산길과 들길을 지나 덕과로 돌아오는 긴 길'(Lv46–50 그대로). 반야봉 1차(v2.5) 뒤 공사 끝
//   한결 8차전(져도 진행): 스토리 초안 한결 '혼자 강한 것보다 함께 버티는 법을 배운다' — 보절 바람에 쓰러진 허수아비를 농부와 함께 다시 세우는 한결
// chapter13.js 뒤, hearts.js 앞에 읽힘
// 사실(위키백과): '산동면' — 남원시 동북쪽 15km, 임야가 전체 면적의 86% / '보절면' — 준고냉지역으로 냉해와 강풍, 안개와 비가 잦음, 쌀농사 중심
"use strict";
(function fixLv14() { for (const r of DATA.town.routes || []) if (r.no === 16) r.lv = "46~50"; })();
if (typeof HIDDEN !== "undefined") HIDDEN.route16 = [[3, 3, "maxrevive"], [76, 22, "ppup" in ITEMS ? "ppup" : "elixir"], [46, 35, "fullrestore"], [40, 39, "maxrepel"]];

const RIVAL8_MV = { cheongsarong: ["flamecharge", "psybeam", "bite", "growl"], baraemong: ["magicalleaf", "mudshot", "acid", "growl"],
  yongkkuri: ["waterpulse", "dragonbreath", "bite", "scaryface"], ttukkkuri: ["waterpulse", "hex", "bite", "scaryface"] };
const rival8 = () => { const k = RIVAL_FINAL[RIVAL_OF[G.starter] || "bulsap"] || "cheongsarong";
  return { id: "rival8", cls: "라이벌", name: "한결", spr: "hangyeol", music: "rival", bgm: "trainer", base: 48, canLose: true,
    loseText: "한결: 봤냐!\n허수아비 세우다 생긴 힘이다!",
    intro: "한결: 예전엔 강해야\n지킬 수 있다고 생각했거든.\f지금은 좀 달라.\n……그걸 너한테 보여 줄게!",
    lose: "한결: ……하하.\n역시 너는 세다.\f근데 오늘은\n진 것 같지가 않아.",
    team: [["eunhajak", 50, { mv: ["wingattack", "confusion", "tailwind", "featherdance"] }],
           ["wonangwang", 49, { mv: ["spark", "metalclaw", "screech", "tackle"] }],
           ["cheonhajangso", 50, { mv: ["karatechop", "strength", "scaryface", "leer"] }],
           [k, 52, { mv: RIVAL8_MV[k] || RIVAL7_MV[k] }]] }; };   // v2.55 스토리 난이도 +3

async function rival8Event() {
  const P = World.player, H = act("r16_hangyeol"), F = act("r16_farmer");
  if (!H || G.flag("rival8_done")) return;
  G.flag("rival8_met", true);
  bgm("rival");
  await say("논 가운데서 누군가 허수아비를\n붙잡고 끙끙대고 있다……");
  await emote(H, "excl", 20);
  await say("한결: 어? 야——!\n마침 잘 왔다!");
  await walkTo(H, P.x, P.y - 1); face(H, P); P.dir = "up";
  await say("한결: 밤새 바람이 엄청 불어서\n허수아비가 다 쓰러졌대.\f할아버지랑 다시 세우고 있었어.");
  if (F) face(F, P);
  await say("할아버지: 보절은 바람이 세고\n안개랑 비가 잦은 곳이라.\f혼자서는 못 세운단다.\n하나는 잡고, 하나는 묶어야지.");
  await say("한결: ……그 말 듣고 좀 놀랐어.\f혼자 강하면 다 될 줄 알았는데,\n허수아비 하나도 혼자 못 세우더라.");
  const r = await trainerBattle({ x: H.x, y: H.y, dir: H.dir, trainer: rival8() }, false);
  bgm("rival");
  if (r !== "win") { G.healAll(); await Audio2.jingle("jg_heal"); await say("남켓몬들이 기운을 되찾았다!"); }
  await say("한결: 내 남켓몬들도 그래.\f하나가 버텨 주면\n다른 하나가 힘을 낼 수 있어.");
  await say("한결: 그게 내가 찾은\n'강한 거'야.\f……너한테 배운 거 같기도 하고.\n아, 몰라!");
  await say("한결: 나는 갈매마을에 가서\n조박사님 기다릴래.\f출장에서 돌아오시면\n제일 먼저 보여 드릴 거야!");
  sfx("run"); await fadeOut(8); H.hidden = true; await fadeIn(8);
  await say("한결은 갈매마을 쪽으로\n뛰어갔다.");
  G.flag("rival8_done", true);
  zoneBgm();
}

(function attachChapter14() {
  const D = MAPDATA;
  const open = () => G.flag("banya_event_done");
  // ---- 미색마을 북쪽 ----
  const MS = MAPS.misaek;
  for (const id of ["ms_worker_n", "ms_worker_n2"]) { const w = MS.npcs.find(n => n.id === id); if (w) w.show = () => !open(); }
  MS.warps = (MS.warps || []).concat([12, 13].map(x => [x, 0, ["route16", x + 56, 43, "up", "edge"]]));
  { const s = MS.signs.find(s => s[0] === 14 && s[1] === 2); if (s) s[2] = () => open() ? "↑ 16번도로\n산동 숲길 · 보절 들판 · 갈매마을" : "↑ 16번도로(산동·보절)\n— 공사 중"; }
  // ---- 갈매마을 동쪽 ----
  const GM = MAPS.galmae;
  GM.warps = (GM.warps || []).concat([19, 20].map(y => [39, y, ["route16", 0, y + 1, "right", "edge"]]));
  GM.npcs.push({ id: "gm_worker_e", x: 37, y: 19, spr: "man", dir: "left", move: "fixed", show: () => !open(), talk: "미안! 보절 가는 16번도로는\n아직 공사 중이란다." },
    { id: "gm_worker_e2", x: 37, y: 20, spr: "man", dir: "left", move: "fixed", show: () => !open(), talk: "미안! 이쪽 길은\n아직 공사 중이란다." },
    { id: "gm_hangyeol", x: 36, y: 18, spr: "hangyeol", dir: "left", move: "look", show: () => G.flag("rival8_done") && !hasBadge(8),
      talk: "한결: 조박사님 아직이야.\f……기다리는 것도\n같이 하면 덜 심심하다!" });

  // ---- 16번도로 ----
  const R = D.route16;
  MAPS.route16 = {
    rows: R.rows, stamps: R.stamps, name: "16번도로",
    warps: [20, 21].map(y => [0, y, ["galmae", 39, y - 1, "left", "edge"]]).concat([68, 69].map(x => [x, 43, ["misaek", x - 56, 0, "down", "edge"]])),
    zones: [["보절 들판", 0, 0, 41, 43], ["산동 숲길", 42, 0, 79, 43]],
    zinfo: { "보절 들판": { bgm: "route", enc: "16번도로", rate: 0.12, bg: "grass" }, "산동 숲길": { bgm: "route", enc: "16번도로", rate: 0.12, bg: "grass" } },
    signs: [[3, 19, "16번도로\n← 갈매마을(덕과) · 미색마을(아영) →"], [19, 19, "보절 들판\f서늘하고 바람이 세서\n안개와 비가 잦은 곳이에요."],
      [57, 32, "산동 숲길\f남원 동북쪽 산동은\n땅의 대부분이 숲이에요."], [67, 41, "↓ 미색마을(아영)\n흥부마을 · 가야 고분"]],
    checks: [],
    areas: [{ x0: 36, y0: 20, x1: 41, y1: 21, cond: () => !G.flag("rival8_met"), run: rival8Event }],
    npcs: [
      { id: "r16_hangyeol", x: 33, y: 17, spr: "hangyeol", dir: "down", move: "fixed", show: () => !G.flag("rival8_done") },
      { id: "r16_farmer", x: 31, y: 17, spr: "oldman", dir: "right", move: "look",
        talk: () => say(G.flag("rival8_done") ? "할아버지: 그 녀석, 허수아비 묶는\n솜씨가 제법이더구나.\f혼자 했으면 하루 종일\n걸렸을 게야." : "할아버지: 보절은 바람이 세서\n허수아비가 자주 쓰러진단다.") },
      { id: "r16_woodsman", x: 60, y: 25, spr: "man", dir: "left", move: "look",
        talk: "아저씨: 산동은 땅 대부분이\n숲이라 나무가 많아.\f나무를 베면 꼭\n다시 심어야 하지." },
      { id: "r16_kid", x: 12, y: 23, spr: "kid_f", move: "wander", r: 1, talk: "안개 낀 날엔 논이\n바다처럼 보여!" },
      { item: "maxpotion", x: 54, y: 12 }, { item: "fullheal", x: 72, y: 8 }, { item: "ultra" in ITEMS ? "ultra" : "ok", n: 3, x: 50, y: 30 }, { item: "maxrevive", x: 73, y: 36 },
      { item: "hyperpotion", x: 40, y: 27 }, { item: "superrepel", x: 3, y: 40 },
      { x: 24, y: 18, spr: "kid_m", dir: "down", trainer: { id: "r16_siwoo", cls: "꼬마", name: "시우", spr: "kid_m", range: 3, base: 18, team: [["yeoru", 46], ["maetdolmet", 46]],
        intro: "안개 속에서\n갑자기 나타났지?", lose: "안개처럼 사라지고 싶다……", after: "안개는 해가 뜨면\n금방 걷혀." } },
      { x: 14, y: 22, spr: "kid_f", dir: "up", trainer: { id: "r16_yuna", cls: "꼬마 숙녀", name: "유나", spr: "kid_f", range: 3, base: 16, team: [["seonrok", 47]],
        intro: "아침 논길 산책 중이야!\n같이 겨룰래?", lose: "산책이 길어졌다……", after: "아침 논물엔\n하늘이 비쳐." } },
      { x: 40, y: 30, spr: "bugboy", dir: "left", trainer: { id: "r16_jaemin", cls: "벌레잡이", name: "재민", spr: "bugboy", range: 4, base: 16, team: [["malbeoljang", 47], ["malbeoljang", 47]],
        intro: "말벌 둘이면\n무서울 게 없다!", lose: "벌집으로 돌아가자……", after: "말벌 집은 건드리면\n절대 안 돼!" } },
      { x: 50, y: 22, spr: "hiker", dir: "down", trainer: { id: "r16_cheolsu", cls: "등산객", name: "철수", spr: "hiker", range: 3, base: 22, team: [["maetdolmet", 47], ["cheonhajangso", 46]],
        intro: "숲길 걷기엔\n든든한 친구가 있어야지!", lose: "허허, 든든하구먼.", after: "숲에선 길보다\n발밑을 먼저 보게." } },
      { x: 62, y: 26, spr: "kid_m", dir: "left", trainer: { id: "r16_hyunwoo", cls: "등산 소년", name: "현우", spr: "kid_m", range: 3, base: 18, team: [["salkwaengbeom", 46], ["yeoru", 47]],
        intro: "밤에 여우를 봤어!\n진짜야!", lose: "여우처럼 도망칠래……", after: "여우는 눈이 밤에\n반짝 빛나." } },
      { x: 70, y: 35, spr: "hiker", dir: "left", trainer: { id: "r16_gangho", cls: "등산객", name: "강호", spr: "hiker", range: 3, base: 22, team: [["salkwaengbeom", 46], ["yeoru", 46]],
        intro: "산동 숲은\n내 앞마당이지!", lose: "허허, 앞마당을 내줬군.", after: "숲이 깊을수록\n사는 것도 많지." } },
    ],
  };
  Object.assign(TOWN_ZONE, { "16번도로": "r16", "보절 들판": "r16", "산동 숲길": "r16" });
})();
