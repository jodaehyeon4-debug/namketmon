// ===== v2.6 곁길(현황표 '6·8·13·16·17번도로·명소' 가운데 첫째): 13번도로(소색 → 이백 들판 → 여원치 → 운봉) · 바래봉(산철쭉 군락 · 옛 양 목장 터 · 노고 바위)
//   반야봉 1차(v2.5) 뒤 공사가 끝나 열림. 희주 배움터(D13)는 사용자 결정을 기다리므로, 그동안 막혀 있던 곁길을 실제 게임처럼 채움
//   남원 수호 삼령 가운데 '땅' 노고마(설정 '바래봉에서 만난다', 미결정 D10 '진행 선택지로 두되 제대로 된 기술은 후반부') — 별돌이 빛나면 깨어남
// chapter10.js 뒤, hearts.js 앞에 읽힘
// 사실(위키백과로 확인): 이백면 — 동쪽으로 백두대간, 서쪽으로 요천이 흐름 / 운봉읍 — 지리산 북서쪽의 고원 분지, 1380년 황산대첩
//   / 남원시 — 지리산 바래봉 철쭉제·바래봉 눈꽃축제 / 영문 위키백과 Baraebong — 높이 1,165m
//   / 여원치·바래봉 이름 유래·양 목장·마고할미는 위키백과 문서가 없거나 다루지 않아 '전해져요'·'불렀단다'로만(생태도감 확인 메모와 같은 기준)
"use strict";
(function fixLv11() {
  for (const r of DATA.town.routes || []) if (r.no === 13) r.lv = "43~47";
  if (DATA.spawns["13번도로"]) DATA.spawns["13번도로"] = DATA.spawns["13번도로"].filter(e => !["neokbulhak", "bangmangdochae", "gumiru"].includes(e.k)).map(e => ({ ...e, lv: "43–47" }));
  if (DATA.spawns["바래봉"]) DATA.spawns["바래봉"] = DATA.spawns["바래봉"].filter(e => e.k !== "nogoma").map(e => ({ ...e, lv: "45–49" }));
})();
if (typeof MV !== "undefined" && MV.rocktomb && !ITEMS.tm39) ITEMS.tm39 = { n: "기술머신39", p: "tm", price: 3000, nobuy: 1, tm: "rocktomb",
  d: "암석봉인을 가르쳐요. 바위를 던져 상대의 스피드를 떨어뜨리는 바위 타입 기술이에요.", ic: "tm",
  tmTypes: ["바위", "땅", "격투", "노말", "강철", "드래곤", "악", "불꽃"] };
if (typeof FISH !== "undefined") FISH.route13 = { at: "13번도로", list: [{ k: "eunchimi", lv: "24–28", r: "흔함", t: "모두" }, { k: "daseulmi", lv: "24–28", r: "흔함", t: "낮" }, { k: "ssogami", lv: "26–28", r: "가끔", t: "모두" }] };
if (typeof HIDDEN !== "undefined") {
  HIDDEN.route13 = [[30, 4, "maxether"], [5, 31, "hyperpotion"], [55, 24, "fullrestore"], [74, 8, "omija"]];
  HIDDEN.baraebong = [[4, 8, "maxelixir"], [44, 13, "ppup" in ITEMS ? "ppup" : "elixir"], [3, 50, "maxrevive"]];
}

// =====================================================================
// 노고 바위: 별돌이 빛나면 남원 수호 삼령 '땅' 노고마가 깨어남 (놓쳐도 다시 오면 또 만남)
// =====================================================================
async function nogomaRock() {
  if (G.flag("nogoma_caught")) { await say("새끼줄을 두른 둥근 바위다.\f이끼 낀 어깨에 햇살이\n따뜻하게 내려앉는다."); return; }
  if (G.flag("nogoma_rest")) { await say("바위가 고요히 잠들어 있다.\f(다음에 다시 오면\n깨어날 것 같다.)"); return; }
  await say("새끼줄을 두른 커다란 바위다.\f웅크려 앉은 할머니처럼\n보인다……");
  if (!G.has("byeoldol")) { await say("……아무 일도 일어나지 않았다."); return; }
  await say("가방 속 별돌이\n희미하게 빛나기 시작했다!");
  sfx("chime"); await fadeOut(6, "#ffffff"); await fadeIn(6, "#ffffff");
  try { Audio2.cry("nogoma"); } catch (e) {}
  await say("바위가 천천히\n숨을 쉬기 시작했다……!");
  const r = await startWild("nogoma", 50, "grass");
  if (r === "caught") { G.flag("nogoma_caught", true); await say("꼭대기에 다시\n산바람이 분다."); return; }
  if (r === "lose") return;
  G.flag("nogoma_rest", true);
  await say("노고마는 다시\n바위 속으로 잠들었다……\f(다음에 다시 오면\n만날 수 있을 것 같다.)");
}

async function ibaekRestTalk() {
  await say("할머니: 여원치 넘어가느라\n다리 아프지?\f좀 쉬었다 가렴.");
  G.healAll(); await Audio2.jingle("jg_heal");
  await say("남켓몬들이 기운을 되찾았다!");
  await say("할머니: 쉬어 가는 것도\n길을 가는 거란다.");
}

// =====================================================================
// 지도에 붙이기
// =====================================================================
(function attachChapter11() {
  const D = MAPDATA;
  const open = () => G.flag("banya_event_done");
  if (typeof LOCKS !== "undefined") Object.assign(LOCKS, {
    house2_mokjang: "문이 잠겨 있다.\f'옛 양 목장 관리소'라고 적힌\n낡은 문패가 걸려 있다.",
  });
  // ---- 소색마을 동쪽 숲길 → 13번도로 ----
  const W = MAPS.world;
  W.warps = (W.warps || []).concat([89, 90].map(y => [59, y, ["route13", 0, y - 60, "right", "edge"]]));
  W.signs.push([57, 92, "→ 13번도로\n이백 들판 · 여원치 · 운봉"]);
  W.npcs.push({ id: "ss_worker_e", x: 56, y: 89, spr: "man", dir: "left", move: "fixed", show: () => !open(), talk: "미안! 이 숲길 너머 13번도로는\n아직 공사 중이란다.\f반야봉 쪽 일이 마무리되면\n길을 열 거야." },
    { id: "ss_worker_e2", x: 56, y: 90, spr: "man", dir: "left", move: "fixed", show: () => !open(), talk: "미안! 이쪽 길은\n아직 공사 중이란다." });
  // ---- 쑥빛시티: 서북쪽(13번도로) · 동쪽(바래봉) ----
  const SB = MAPS.ssukbit;
  SB.warps = (SB.warps || []).concat([11, 12].map(y => [0, y, ["route13", 79, y - 5, "left", "edge"]]), [20, 21].map(y => [51, y, ["baraebong", 0, y + 24, "right", "edge"]]));
  SB.signs.push([2, 10, "← 13번도로\n여원치 고개 너머 이백 · 소색마을"], [48, 19, "→ 바래봉\n봄이면 산철쭉으로 분홍빛이 되는 산"]);
  for (const id of ["sb_worker_e", "sb_worker_e2"]) { const w = SB.npcs.find(n => n.id === id); if (w) w.show = () => !open(); }
  { const w = SB.npcs.find(n => n.id === "sb_worker_e"); if (w) w.talk = "미안! 바래봉 가는 길은\n아직 공사 중이란다.\f봄이면 바래봉이 철쭉으로\n분홍빛이 되지!"; }
  SB.npcs.push({ id: "sb_worker_w", x: 2, y: 11, spr: "man", dir: "right", move: "fixed", show: () => !open(), talk: "미안! 여원치를 넘는 13번도로는\n아직 공사 중이란다." },
    { id: "sb_worker_w2", x: 2, y: 12, spr: "man", dir: "right", move: "fixed", show: () => !open(), talk: "미안! 이쪽 길은\n아직 공사 중이란다." },
    { id: "sb_side_guide", x: 47, y: 22, spr: "woman", dir: "up", move: "look", show: open,
      talk: "아주머니: 바래봉에도 여원치에도\n길이 새로 났대!\f산 위 큰 바위를 보면\n인사하고 오렴." });

  // ---- 13번도로 ----
  const R = D.route13, RD = R.doors;
  MAPS.route13 = {
    rows: R.rows, stamps: R.stamps, name: "13번도로",
    warps: [29, 30].map(y => [0, y, ["world", 59, y + 60, "left", "edge"]]).concat([6, 7].map(y => [79, y, ["ssukbit", 0, y + 5, "right", "edge"]])),
    zones: [["여원치", 56, 2, 66, 14], ["13번도로", 0, 0, 79, 39]],
    zinfo: { "13번도로": { bgm: "route13", enc: "13번도로", rate: 0.12, bg: "grass" }, "여원치": { bgm: "route13", enc: "13번도로", rate: 0.12, bg: "grass" } },
    signs: [[2, 28, "13번도로\n← 소색마을 · 여원치 고개 →"], [23, 28, "이백 개울\n건너면 여원치 오르막이에요."],
      [32, 21, "여원치 오르막\f턱에서 뛰어내리면\n아래로 빨리 내려갈 수 있어요."], [59, 5, "여원치\f운봉 고원으로 넘어가는 고개.\n장승이 길을 지키고 있다."],
      [77, 5, "→ 쑥빛시티(운봉)\n높고 평평한 운봉 고원"]],
    checks: [[57, 4, "나무 장승이다.\n'천하대장군'"], [57, 5, "나무 장승이다.\n'천하대장군'"], [57, 8, "나무 장승이다.\n'지하여장군'"], [57, 9, "나무 장승이다.\n'지하여장군'"]],
    areas: [],
    npcs: [
      { id: "r13_farmer", x: 6, y: 27, spr: "oldman", dir: "down", move: "look",
        talk: "할아버지: 여기 이백은 동쪽엔\n높은 산줄기가 있고,\f서쪽으로는 요천이 흐르는\n들판이란다." },
      { id: "r13_rest", x: 64, y: 9, spr: "hiker", dir: "left", move: "look",
        talk: "등산객: 여원치만 넘으면\n운봉 고원이야.\f지리산 북서쪽에 높고 평평하게\n펼쳐진 땅이지." },
      { id: "r13_kid", x: 28, y: 33, spr: "kid_f", move: "wander", r: 1, talk: "개울에 다슬기가 있어!\f물이 맑아야\n다슬기가 산대." },
      { item: "hyperpotion", x: 10, y: 8 }, { item: "maxrevive", x: 19, y: 8 }   /* v2.30: 암석봉인은 11번도로 탐방 선물로 */, { item: "revive", x: 42, y: 31 }, { item: "fullheal", x: 70, y: 3 },
      { item: "superrepel", x: 76, y: 14 }, { item: "ok", n: 3, x: 3, y: 37 },
      { x: 12, y: 27, spr: "kid_m", dir: "down", trainer: { id: "r13_doyun", cls: "낚시 소년", name: "도윤", spr: "kid_m", range: 3, base: 18, team: [["ssogami", 43], ["chireyong", 44]],
        intro: "개울에서 잡은 친구들이야!\n한번 볼래?", lose: "줄이 끊어졌다……", after: "개울물은 요천으로\n흘러간대." } },
      { x: 20, y: 32, spr: "kid_f", dir: "up", trainer: { id: "r13_harin", cls: "꼬마 숙녀", name: "하린", spr: "kid_f", range: 3, base: 16, team: [["gorakong", 43], ["chamdaram", 44]],
        intro: "들판에서 고라니 봤어!\n너도 봤어?", lose: "고라니처럼 도망가고 싶다……", after: "고라니는 겁이 많아서\n금방 숨어." } },
      { x: 36, y: 21, spr: "hiker", dir: "down", trainer: { id: "r13_mansu", cls: "등산객", name: "만수", spr: "hiker", range: 3, base: 20, team: [["gulsojang", 44], ["jipgeppul", 45]],
        intro: "허허! 오르막에선\n숨부터 고르는 거야!", lose: "허허, 숨이 차는구먼.", after: "산은 천천히 올라야\n오래 오를 수 있지." } },
      { x: 50, y: 17, spr: "bugboy", dir: "left", trainer: { id: "r13_taeo", cls: "벌레잡이", name: "태오", spr: "bugboy", range: 4, base: 16, team: [["gumbengku", 44], ["jangsuppul", 45]],
        intro: "솔숲 벌레는\n힘이 세다고!", lose: "뿔이 걸렸다……", after: "장수풍뎅이 애벌레는\n굼벵이야." } },
      { x: 52, y: 9, spr: "kid_m", dir: "up", trainer: { id: "r13_jihu", cls: "등산 소년", name: "지후", spr: "kid_m", range: 3, base: 18, team: [["malbeoljang", 45], ["tadagi", 45]],
        intro: "고개 꼭대기까지\n누가 먼저 가나!", lose: "졌다! 그래도 다 올라왔어.", after: "올라온 길을 내려다보면\n뿌듯해." } },
      { x: 66, y: 5, spr: "hiker", dir: "down", trainer: { id: "r13_jeongman", cls: "등산객", name: "정만", spr: "hiker", range: 3, base: 22, team: [["eomnirang", 44], ["gulsomi", 43], ["malbeoljang", 44]],
        intro: "고갯마루에선\n쉬어 가는 게 법이지!\f……쉬기 전에 한 판!", lose: "허허, 다리가 풀렸네.", after: "장승은 마을 어귀나\n고개를 지켜 준단다." } },
    ],
  };
  MAPS.house_ib = { rows: D.house_a.rows, stamps: D.house_a.stamps, indoor: true, name: "이백 쉼터", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "route13", noPopup: true,
    exit: ["route13", RD.house_ib[0], RD.house_ib[1], "down"],
    checks: [[0, 1, "보리차가 든 주전자가\n따뜻하다."], [1, 1, "보리차가 든 주전자가\n따뜻하다."]],
    npcs: [{ id: "hib_granny", x: 2, y: 4, spr: "oldwoman", move: "look", talk: ibaekRestTalk },
      { id: "hib_kid", x: 6, y: 5, spr: "kid_m", move: "wander", r: 1, talk: "할머니는 지나가는 사람한테\n늘 보리차를 주셔!" }] };

  // ---- 바래봉 ----
  const B = D.baraebong;
  MAPS.baraebong = {
    rows: B.rows, stamps: B.stamps, name: "바래봉",
    warps: [44, 45].map(y => [0, y, ["ssukbit", 51, y - 24, "left", "edge"]]),
    zones: [["바래봉", 0, 0, 47, 55]],
    zinfo: { "바래봉": { bgm: "baraebong", enc: "바래봉", rate: 0.12, bg: "grass" } },
    onLoad() { G.flag("nogoma_rest", false); },
    signs: [[2, 43, "바래봉 가는 길\f봄이면 산철쭉이 산을\n분홍빛으로 물들여요."],
      [12, 34, "옛 양 목장 터\f옛날 운봉에는 양 목장이\n있었다고 해요.\f양들이 다른 풀은 다 뜯어 먹고\n독이 있는 철쭉만 남겨서\f철쭉밭이 넓어졌다고\n전해져요."],
      [12, 25, "산철쭉 군락\f산철쭉은 독이 있어서\n먹으면 안 돼요.\f진달래와 달리\n잎과 꽃이 함께 피어요."],
      [31, 14, "→ 팔랑치\f바래봉에서 팔랑치까지\n산철쭉 능선이 이어져요."],
      [20, 6, "바래봉 꼭대기\f스님의 밥그릇 '바리때'를\n엎어 놓은 것처럼 둥글어서\f바래봉이라 부른다고\n전해져요."]],
    checks: [[27, 2, "'바래봉 1,165m'\f지리산 서북쪽 능선의\n둥근 봉우리다."], [27, 3, "'바래봉 1,165m'"],
      [22, 2, nogomaRock], [23, 2, nogomaRock], [22, 3, nogomaRock], [23, 3, nogomaRock]],
    areas: [],
    npcs: [
      { id: "br_granny", x: 8, y: 28, spr: "oldwoman", dir: "right", move: "look", talk: async () => {
        await say("할머니: 지리산 사람들은\n산을 지키는 신을\f할머니로 여겼단다.\n'마고할미', '노고할미'라고 불렀지.");
        await say("할머니: 바래봉 꼭대기 큰 바위가\n꼭 웅크려 앉은 할머니 같아서\f우리 마을 사람들은\n'노고 바위'라고 부른단다."); } },
      { id: "br_ranger", x: 13, y: 30, spr: "ranger", dir: "left", move: "look",
        talk: "지킴이: 철쭉 꽃은 꺾지 말고\n눈으로만 봐 주세요!\f겨울에 오면 눈꽃도\n아주 예뻐요." },
      { id: "br_hiker", x: 33, y: 4, spr: "hiker", dir: "left", move: "look",
        talk: "등산객: 꼭대기가 둥글고\n완만하지?\f오르기는 힘들어도\n여기선 다 같이 쉬어 가." },
      { item: "maxpotion", x: 5, y: 20 }, { item: "ok", n: 3, x: 28, y: 20 }, { item: "fullrestore", x: 40, y: 9 }, { item: "hardstone", x: 39, y: 41 },
      { item: "fairyfeather", x: 41, y: 51 }, { item: "maxrevive", x: 21, y: 49 },
      { x: 8, y: 38, spr: "hiker", dir: "right", trainer: { id: "br_dongho", cls: "등산객", name: "동호", spr: "hiker", range: 3, base: 22, team: [["godeumi", 46], ["obangdam", 46]],
        intro: "바래봉은 처음인가?\n길 안내 대신 한 판!", lose: "허허, 길 안내는\n필요 없겠구먼.", after: "철쭉 철엔 사람이\n산을 덮는다네." } },
      { x: 16, y: 19, spr: "kid_f", dir: "down", trainer: { id: "br_narae", cls: "꼬마 숙녀", name: "나래", spr: "kid_f", range: 2, base: 16, team: [["eollekkot", 44], ["seorikkot", 45]],
        intro: "꽃밭에서는\n조용히 걸어야 해!", lose: "꽃잎이 흩날렸다……", after: "꽃잎이 떨어져도\n내년에 또 피어." } },
      { x: 20, y: 13, spr: "bugboy", dir: "up", trainer: { id: "br_siwon", cls: "벌레잡이", name: "시원", spr: "bugboy", range: 3, base: 16, team: [["gumbengku", 45], ["malbeoljang", 46]],
        intro: "철쭉에 모이는 벌레를\n찾고 있었어!", lose: "철쭉 독에 혼났다……", after: "꽃이 예쁘다고\n아무거나 먹으면 안 돼!" } },
      { x: 31, y: 6, spr: "hiker", dir: "left", trainer: { id: "br_byeongcheol", cls: "등산객", name: "병철", spr: "hiker", range: 3, base: 22, team: [["obangdam", 46], ["godeumi", 46], ["taoryong", 47]],
        intro: "꼭대기 바로 앞이다!\n마지막 고비!", lose: "허허, 꼭대기는\n자네 차지로구먼.", after: "꼭대기 바위엔\n함부로 올라가지 말게." } },
    ],
  };
  Object.assign(TOWN_ZONE, { "13번도로": "r13", "여원치": "yeowon", "이백 쉼터": "r13", "바래봉": "baraebong" });
})();
