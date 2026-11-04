// ===== v2.7 곁길 ②: 6번도로(비색 둑 → 섬진강 둑길·갈대밭) · 섬진강 나루(대강 — 뱃사공 집·나룻배·두꺼비 바위)
//   6번도로는 섬진 어사패(3장 섬진강 매립 사건) 뒤 열리는 낚시 길(타운맵 '꼭 가지 않아도 되는 곁길', Lv20–25 그대로)
//   섬진강 나루 = 행수 여울의 집(본디회 문서 '섬진강 뱃사공 집 딸'). 반야봉 1차(v2.5)에서 "섬진강으로 돌아갈게"라고 한 여울이 집에 돌아와 있음(여울 ③, 배틀 없음)
//   남원 수호 삼령 '강' 금섬(설정 '3장에서 오염으로 앓는다'): 반야봉 전에는 두꺼비 바위 그늘에서 앓고 있고, 여울이 돌아온 뒤 기운을 차려 만남(Lv50, 미결정 D10)
// chapter11.js 뒤, hearts.js 앞에 읽힘
// 사실(위키백과 '섬진강'): 고려 우왕 때 왜구가 쳐들어왔다가 수만 마리 두꺼비가 한꺼번에 울어 놀라 물러났다는 전설이 '섬진(蟾津, 두꺼비 나루)'의 유래,
//   길이 223km. 그 나루는 강 아래쪽 광양에 있었다고 함(타운맵 문서) → 이 나루의 '두꺼비 바위'는 창작, 표지판은 '전설이 있어요'·'광양에 있었대요'로
"use strict";
if (typeof FISH !== "undefined") {
  FISH.route6 = { at: "6번도로", list: [{ k: "eunchimi", lv: "20–25", r: "흔함", t: "모두" }, { k: "ssogami", lv: "20–25", r: "흔함", t: "모두" }, { k: "gaegulmi", lv: "22–25", r: "가끔", t: "밤" }] };
  FISH.seomjin = { at: "섬진강 나루", list: [{ k: "eunchimi", lv: "22–28", r: "흔함", t: "모두" }, { k: "ssogami", lv: "22–28", r: "가끔", t: "모두" }, { k: "chamjipwang", lv: "26–28", r: "드묾", t: "밤" }] };
}
(function fixSpawn12() { if (DATA.spawns["섬진강 나루"]) DATA.spawns["섬진강 나루"] = DATA.spawns["섬진강 나루"].filter(e => e.k !== "geumseom"); })();
if (typeof HIDDEN !== "undefined") {
  HIDDEN.route6 = [[20, 12, "superpotion"], [50, 21, "ether"], [61, 3, "rarecandy" in ITEMS ? "rarecandy" : "elixir"]];
  HIDDEN.seomjin = [[3, 3, "fullheal"], [41, 17, "hyperpotion"]];
}

// =====================================================================
// 두꺼비 바위 · 금섬
// =====================================================================
async function toadRock() {
  if (G.flag("geumseom_caught")) { await say("두꺼비를 닮은 바위다.\f강바람에 갈대가\n사르륵 흔들린다."); return; }
  if (!G.flag("yeoul3_done")) {
    await say("두꺼비를 닮은 바위다.\f……바위 그늘에 커다란 두꺼비 남켓몬이\n힘없이 엎드려 있다.");
    await say("강물이 흐려져서\n아파하는 것 같다……");
    return;
  }
  if (G.flag("geumseom_rest")) { await say("금섬이 바위 그늘에서\n쉬고 있다.\f(다음에 다시 오면\n만날 수 있을 것 같다.)"); return; }
  await say("바위 그늘에서 커다란 두꺼비 남켓몬이\n고개를 들었다!");
  try { Audio2.cry("geumseom"); } catch (e) {}
  await say("금섬이 크게 울었다!\f강물 위로 동그란 물결이\n번져 간다……!");
  const r = await startWild("geumseom", 50, "water");
  if (r === "caught") { G.flag("geumseom_caught", true); await say("섬진강에 두꺼비 울음이\n멀리멀리 퍼진다."); return; }
  if (r === "lose") return;
  G.flag("geumseom_rest", true);
  await say("금섬은 갈대 사이로\n천천히 물러났다……\f(다음에 다시 오면\n만날 수 있을 것 같다.)");
}

async function yeoul3Talk() {
  const Y = act("sj_yeoul");
  if (G.flag("yeoul3_done")) {
    await say(G.flag("geumseom_caught") ? "여울: 강은 흘러야 해.\n막히지만 않으면.\f……이제는 그 말을\n사람한테도 하고 싶어." : "여울: 금섬이 다시 울기 시작했어.\f두꺼비 바위에\n한번 가 볼래?");
    return;
  }
  if (Y) face(Y, World.player);
  await emote(Y, "excl", 20);
  await say("여울: ……왔구나.\n여기가 우리 집이야.\f아빠는 이 나루에서\n평생 배를 저으셨어.");
  await say("여울: 반야봉에서 돌아와서\n강부터 봤어.\f흙탕물이 조금씩\n가라앉고 있더라.");
  await say("여울: 그 공사 장부는……\n아직 못 찾았어.\f그런데 들었어.\n갈매마을 조박사님이라는 분도\f그 공사를 몰래\n살피고 계신대.");
  await say("여울: 두꺼비 바위 좀 봐 줄래?\f금섬이……\n다시 울기 시작했어.");
  G.flag("yeoul3_done", true);
}

async function boatmanTalk() {
  if (!G.flag("banya_event_done")) await say("뱃사공: 우리 딸은 몇 해째\n집에 안 들어온단다.\f무슨 '본디회'라는 데서\n강을 지킨다더구나.");
  else await say("뱃사공: 딸이 돌아왔단다.\f……강을 지키는 건\n집에서도 할 수 있는 일이지.");
  const c = await ask("뱃사공: 건너편 비색마을까지\n배로 태워 줄까?", ["예", "아니오"]);
  if (c !== 0) { await say("뱃사공: 그래, 강바람이나\n쐬다 가거라."); return; }
  sfx("exit"); await fadeOut(12);
  World.load("bisaek", 9, 32, "down"); World.cam = World.camTarget();
  await fadeIn(12);
  await say("나룻배가 비색마을 둑에\n닿았다.");
}

// =====================================================================
// 지도에 붙이기
// =====================================================================
(function attachChapter12() {
  const D = MAPDATA;
  const open = () => hasBadge(3);
  // ---- 비색마을 서쪽 둑길 → 6번도로 (섬진 어사패 뒤) ----
  const BS = MAPS.bisaek;
  for (const id of ["bs_fisher", "bs_fisher2"]) { const w = BS.npcs.find(n => n.id === id); if (w) w.show = () => !open(); }
  BS.warps = (BS.warps || []).concat([31, 32].map(y => [0, y, ["route6", 63, y - 17, "left", "edge"]]));
  BS.npcs.push({ id: "bs_fisher3", x: 2, y: 30, spr: "oldman", dir: "down", move: "look", show: open,
    talk: "낚시꾼: 이 둑길로 쭉 가면\n섬진강 나루란다.\f갈대밭엔 남켓몬이\n숨어 있으니 조심하렴." });

  // ---- 6번도로 ----
  const R = D.route6;
  MAPS.route6 = {
    rows: R.rows, stamps: R.stamps, name: "6번도로",
    warps: [14, 15].map(y => [63, y, ["bisaek", 0, y + 17, "right", "edge"]]).concat([14, 15].map(y => [0, y, ["seomjin", 43, y, "left", "edge"]])),
    zones: [["6번도로", 0, 0, 63, 35]],
    zinfo: { "6번도로": { bgm: "route", enc: "6번도로", rate: 0.12, bg: "water" } },
    signs: [[60, 13, "6번도로\n← 섬진강 나루 · 비색마을 →"], [32, 16, "둑 비탈\n아래로 내려가면 갈대밭과 모래 강변"],
      [3, 13, "← 섬진강 나루\n뱃사공이 사는 작은 나루터"]],
    checks: [],
    npcs: [
      { id: "r6_farmer", x: 26, y: 12, spr: "woman", dir: "down", move: "look",
        talk: "아주머니: 둑은 강물이 넘치지 않게\n흙을 높이 쌓은 길이야.\f그 덕에 이 들판에서\n벼가 자란단다." },
      { id: "r6_kid", x: 34, y: 20, spr: "kid_m", move: "wander", r: 1, talk: "갈대밭에 들어가면\n사각사각 소리가 나!" },
      { item: "superpotion", x: 29, y: 6 }, { item: "net", n: 3, x: 45, y: 20 }, { item: "fullheal", x: 59, y: 5 }, { item: "ether", x: 10, y: 21 },
      { x: 8, y: 13, spr: "kid_m", dir: "right", trainer: { id: "r6_seojun", cls: "낚시 소년", name: "서준", spr: "kid_m", range: 3, base: 14, team: [["eunchimi", 22], ["ssogami", 23]],
        intro: "둑길은 내 낚시터야!\n한 판 할래?", lose: "물고기가 다 도망갔다……", after: "은어는 맑은 물을\n좋아한대." } },
      { x: 26, y: 19, spr: "kid_f", dir: "right", trainer: { id: "r6_yerin", cls: "꼬마 숙녀", name: "예린", spr: "kid_f", range: 3, base: 14, team: [["cheongdungkong", 23], ["gaegulmi", 25]],
        intro: "갈대밭에서\n숨바꼭질하고 있었어!", lose: "들켰다……", after: "갈대 사이로 해가 지면\n강물이 금빛이 돼." } },
      { x: 35, y: 19, spr: "bugboy", dir: "down", trainer: { id: "r6_dohyun", cls: "벌레잡이", name: "도현", spr: "bugboy", range: 3, base: 14, team: [["teoljipge", 24]],
        intro: "물가엔 집게 친구들이\n잔뜩 있어!", lose: "집게가 풀렸다……", after: "털집게는 밤에\n강가로 나와." } },
      { x: 54, y: 19, spr: "kid_m", dir: "left", trainer: { id: "r6_minho", cls: "낚시 소년", name: "민호", spr: "kid_m", range: 4, base: 14, team: [["jararong", 24], ["dukkeomi", 23]],
        intro: "모래톱까지 헤엄쳐 가고\n싶었는데……!", lose: "역시 강은 넓구나……", after: "강은 보기보다 깊어.\n혼자 들어가면 안 돼." } },
      { x: 48, y: 13, spr: "hiker", dir: "down", trainer: { id: "r6_gilsu", cls: "등산객", name: "길수", spr: "hiker", range: 3, base: 16, team: [["gujeongmi", 24], ["cheongdungkong", 25]],
        intro: "둑길 걷기는\n최고의 운동이지!", lose: "허허, 오늘은 여기까지!", after: "강을 따라 걸으면\n길을 잃을 일이 없지." } },
    ],
  };

  // ---- 섬진강 나루 ----
  const S = D.seomjin, SD = S.doors;
  MAPS.seomjin = {
    rows: S.rows, stamps: S.stamps, name: "섬진강 나루",
    warps: [14, 15].map(y => [43, y, ["route6", 0, y, "right", "edge"]]),
    zones: [["섬진강 나루", 0, 0, 43, 31]],
    zinfo: { "섬진강 나루": { bgm: "bisaek", enc: "섬진강 나루", rate: 0.1, bg: "water" } },
    onLoad() { G.flag("geumseom_rest", false); },
    signs: [[37, 13, "섬진강 나루\n뱃사공이 배를 건네주는 나루터"],
      [30, 18, "두꺼비 바위\f고려 때 왜구가 쳐들어오자\n수만 마리 두꺼비가 한꺼번에 울어\f놀란 왜구가 물러났다는\n전설이 있어요.\f그래서 이 강을 '두꺼비 나루',\n섬진강이라고 불러요.\f그 나루는 강 아래쪽 광양에\n있었대요."],
      [22, 16, "나룻배 타는 곳\n건너편 비색마을"]],
    checks: [[31, 17, toadRock], [32, 17, toadRock], [31, 18, toadRock], [32, 18, toadRock],
      [19, 24, "작은 나룻배가 물결에\n흔들리고 있다."], [20, 24, "작은 나룻배가 물결에\n흔들리고 있다."], [21, 24, "작은 나룻배가 물결에\n흔들리고 있다."]],
    npcs: [
      { id: "sj_boatman", x: 22, y: 18, spr: "oldman", dir: "left", move: "look", talk: boatmanTalk },
      { id: "sj_yeoul", x: 29, y: 16, spr: "yeoul", dir: "down", move: "look", show: () => G.flag("banya_event_done"), talk: yeoul3Talk },
      { id: "sj_kid", x: 12, y: 13, spr: "kid_f", move: "wander", r: 1, talk: "밤이 되면 갈대밭에서\n개구리랑 두꺼비가 엄청 울어!" },
      { item: "net", n: 2, x: 40, y: 4 }, { item: "superrepel", x: 8, y: 3 },
      { x: 36, y: 13, spr: "kid_m", dir: "left", trainer: { id: "sj_jiho", cls: "낚시 소년", name: "지호", spr: "kid_m", range: 3, base: 14, team: [["teoljipge", 24], ["eunchimi", 25]],
        intro: "나루터 낚시 대장은\n나야!", lose: "대장 자리를 뺏겼다……", after: "물때를 알아야\n고기가 잘 잡혀." } },
    ],
  };
  MAPS.house_nr = { rows: D.house_a.rows, stamps: D.house_a.stamps, indoor: true, name: "뱃사공 집", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "bisaek", noPopup: true,
    exit: ["seomjin", SD.house_nr[0], SD.house_nr[1], "down"],
    checks: [[0, 1, "벽에 오래된 노가\n걸려 있다."], [1, 1, "벽에 오래된 노가\n걸려 있다."]],
    npcs: [{ id: "hnr_mom", x: 2, y: 4, spr: "woman", move: "look", talk: async () => {
      if (!G.flag("banya_event_done")) { await say("아주머니: 우리 딸은 어릴 때부터\n강가에서만 놀았단다.\f……밥은 잘 먹고 다니는지."); return; }
      if (!G.flag("hnr_gift")) { await say("아주머니: 우리 여울이가 돌아왔어.\n밥을 두 그릇이나 먹더라.\f고마워서 그래.\n이거 가져가렴."); await getItem("nurungji", 2); G.flag("hnr_gift", true); return; }
      await say("아주머니: 집 밥이 최고라고\n그러더라."); } }] };
  Object.assign(TOWN_ZONE, { "6번도로": "r6", "섬진강 나루": "seomjin", "뱃사공 집": "seomjin" });
})();
