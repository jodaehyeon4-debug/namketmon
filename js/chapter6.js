// ===== v2.1 다섯째 장: 10번도로(방삼·단지 통행료) · 다홍시티 동·서 · 9번도로(라이벌 6) · 감청마을(산곡동) · 교룡산성 · 본디회 은신처(훈장 어른·옹이 ②·솔뫼 ①) · 감청 배움터(5관장 기수, 과학실 빛 실험)
// field.js 뒤, hearts.js 앞에 읽힘
// 기수: 관장 문서 5번(친절하지만 화나면 몹시 무서움·외유내강, 말버릇 "음~ 아닌 거 같은데~?"는 사용자가 준 것, 안경·다운펌·흰 실험 가운). 대사는 가안
// 교룡산성 사실: 산곡동 교룡산(518m), 둘레 약 3.1km, 백제 때 쌓은 것으로 보임, 임진왜란 때 승병장 처영이 고쳐 쌓음, 동문은 무지개 모양,
//   선국사 대웅전, 우물 99개가 있었다고 전함, 조선 전기 군량 창고(위키백과 '남원 교룡산성'). 은적암·최제우는 타운맵 문서에서 확인한 것
"use strict";
const GCD = MAPDATA.gamcheong.doors, GYD = MAPDATA.gyoryong.doors;
const exitGC = k => ["gamcheong", GCD[k][0], GCD[k][1], "down"];

// ---- 출현표 (주홍 26–28 → 10번도로 28–31 → 9번도로 29–32 → 감청 30–32 → 교룡산성 30–33, 5관장 32–34) ----
DATA.spawns["10번도로"] = [
  { k: "gorakong", lv: "28–30", t: "저녁", r: "흔함" }, { k: "gaegulmi", lv: "28–30", t: "모두", r: "흔함" }, { k: "satbaso", lv: "28–30", t: "낮", r: "가끔" },
  { k: "heosuni", lv: "28–30", t: "밤", r: "흔함" }, { k: "cheongdungdae", lv: "29–31", t: "낮", r: "가끔" }, { k: "beomageom", lv: "30–31", t: "낮", r: "드묾" },
  { k: "wonanggeum", lv: "30–31", t: "낮", r: "드묾" }, { k: "heosujang", lv: "31", t: "밤", r: "드묾" }, { k: "eosapae", lv: "31", t: "낮", r: "아주 드묾" },
].filter(e => MON[e.k]);
DATA.spawns["9번도로"] = [
  { k: "daramball", lv: "29–31", t: "낮", r: "흔함" }, { k: "bakjumi", lv: "29–31", t: "밤", r: "흔함" }, { k: "gorakong", lv: "29–31", t: "저녁", r: "흔함" },
  { k: "metkongi", lv: "29–31", t: "저녁", r: "가끔" }, { k: "eomnirang", lv: "30–32", t: "저녁", r: "가끔" }, { k: "satbaso", lv: "29–31", t: "낮", r: "가끔" },
  { k: "ttanggul", lv: "31–32", t: "모두", r: "드묾" }, { k: "eopseureong", lv: "31–32", t: "밤", r: "드묾" },
].filter(e => MON[e.k]);
DATA.spawns["감청마을"] = [
  { k: "sojjeokmi", lv: "30–32", t: "밤", r: "흔함" }, { k: "bakjumi", lv: "30–32", t: "밤", r: "흔함" }, { k: "seotkongi", lv: "30–32", t: "모두", r: "흔함" },
  { k: "satbaso", lv: "30–32", t: "낮", r: "가끔" }, { k: "namujjo", lv: "30–32", t: "낮", r: "가끔" }, { k: "chamdaram", lv: "31–32", t: "낮", r: "드묾" },
].filter(e => MON[e.k]);
DATA.spawns["교룡산성"] = [
  { k: "daramball", lv: "30–32", t: "낮", r: "흔함" }, { k: "chamdaram", lv: "30–33", t: "낮", r: "가끔" }, { k: "jjidami", lv: "30–33", t: "밤", r: "가끔" },
  { k: "sojjeokmi", lv: "30–32", t: "밤", r: "가끔" }, { k: "bakjumi", lv: "30–32", t: "밤", r: "흔함" }, { k: "seotkongi", lv: "30–32", t: "모두", r: "흔함" },
  { k: "ttakkeumnabang", lv: "33", t: "밤", r: "드묾" }, { k: "dukkeojang", lv: "32–33", t: "밤", r: "드묾" }, { k: "geumulgeo", lv: "30–33", t: "저녁", r: "가끔" },
  { k: "namujjo", lv: "30–33", t: "낮", r: "가끔" }, { k: "metkongi", lv: "30–33", t: "저녁", r: "가끔" },
].filter(e => MON[e.k]);
(function fixTownLv6() { for (const r of DATA.town.routes || []) { if (r.no === 10) r.lv = "28~31"; if (r.no === 9) r.lv = "29~32"; } })();
if (typeof FISH !== "undefined") {
  FISH.route10 = { at: "10번도로", list: [{ k: "daseulmi", lv: "16–20", r: "흔함", t: "모두" }, { k: "olchaengmi", lv: "16–20", r: "흔함", t: "모두" }, { k: "ssogami", lv: "18–20", r: "드묾", t: "모두" }] };
  FISH.route9 = { at: "9번도로", list: [{ k: "eunchimi", lv: "17–21", r: "흔함", t: "낮" }, { k: "daseulmi", lv: "17–21", r: "흔함", t: "모두" }, { k: "teoljipge", lv: "18–21", r: "가끔", t: "밤" }, { k: "megijang", lv: "20–21", r: "드묾", t: "밤" }] };
  FISH.gamcheong = { at: "감청마을", list: [{ k: "eunchimi", lv: "17–21", r: "흔함", t: "모두" }, { k: "ssogami", lv: "18–21", r: "가끔", t: "모두" }, { k: "jararong", lv: "19–21", r: "드묾", t: "낮" }] };
}
if (typeof HIDDEN !== "undefined") {
  HIDDEN.route10 = [[6, 22, "superpotion"], [45, 28, "boksunga"], [39, 21, "ether"]];
  HIDDEN.route9 = [[22, 20, "hyperpotion"], [53, 22, "sanddalgi"], [47, 9, "elixir"]];
  HIDDEN.gyoryong = [[27, 30, "revive"], [35, 36, "maxether"], [4, 15, "omija"]];
}

// ---- 기술머신31 깨뜨리다(5관장 보상) ----
if (MV.brickbreak && !ITEMS.tm31) ITEMS.tm31 = { n: "기술머신31", p: "tm", price: 3000, nobuy: 1, tm: "brickbreak",
  d: "깨뜨리다를 가르쳐요. 상대가 친 리플렉터·빛의장막도 깨뜨리는 격투 타입 기술이에요.", ic: "tm",
  tmTypes: ["격투", "노말", "땅", "바위", "물", "불꽃", "드래곤", "악", "벌레"] };

// =====================================================================
// 1. 주홍마을 북쪽 → 10번도로 고갯마루: 방삼·단지 '통행료'
// =====================================================================
// 설정집: 방삼·단지는 1·3·5·7장 개그 콤비. 이번엔 고갯마루에 '본디회 통행료' 매표소를 차림(돈 대신 남켓몬을 내라) → 개그 배틀
const BANGSAM5 = { id: "bondi_bangsam5", cls: "본디회 단원", name: "방삼", spr: "grunt_m", base: 40, music: "bondi", bgm: "trainer",
  intro: "방삼: 에헴! 고갯마루를 넘으려면\n통행료를 내야지!\f돈이 없으면…… 남켓몬으로 받는다!",
  lose: "방삼: 끄아악!\n통행료를 도로 뜯겼다……!",
  team: [["neogulmi", 32, { mv: ["bite", "quickattack", "tailwhip", "payback"] }], ["darijak", 32, { mv: ["wingattack", "quickattack", "featherdance", "growl"] }],
         ["heosuni", 31, { mv: ["astonish", "bulletseed", "growth", "leer"] }]] };    // 개그 배틀: 가볍게 — bal_gym(셋·상처약 2) 처음 안(30·30·29)은 Lv29 30–37% → 25·25·24: Lv28 73–83% · Lv30 80–97%
async function bangsam5Event() {
  const P = World.player, B1 = act("bangsam5"), B2 = act("danji5");
  if (!B1 || !B2) return;
  bgm("bondi");
  await emote(B2, "excl", 24);
  await say("단지: 형님, 손님 왔어요!\n첫 손님이에요!");
  await walkPath(P, 46, 12); P.dir = "up"; face(B1, P); face(B2, P);
  await say("방삼: 에헴! 여기는 본디회\n'고갯마루 매표소'다!\f지리산 자락은 본디 사람이\n함부로 넘던 곳이 아니야.");
  await say("단지: 통행료는 한 사람에\n천 원이에요!");
  await say("방삼: 바보야, 돈이 아니라\n남켓몬을 받기로 했잖아!\f대방님이 '돈은 필요 없다'\n하셨다고!");
  await say("단지: 아, 맞다.\f……근데 형님, 우리 점심값은요?");
  await say("방삼: ……그건 나중에 생각하고!\n자, 꼬마! 남켓몬 내놔라!");
  const r = await trainerBattle({ x: B1.x, y: B1.y, dir: B1.dir, trainer: BANGSAM5 }, false);
  if (r !== "win") return;
  bgm("bondi");
  await say("단지: 형님…… 매표소가\n바람에 날아갔어요.");
  await say("방삼: 크윽, 오늘 장사는 여기까지!\f산성 은신처로 돌아가자.\n솔뫼 행수님께 혼나겠다……");
  await say("단지: 형님, 은신처는\n비밀이라면서요!");
  await say("방삼: ……어, 어흠!\n방금 건 못 들은 걸로 해라!");
  sfx("run"); await fadeOut(8); B1.hidden = true; B2.hidden = true; await fadeIn(8);
  await say("(방삼과 단지는 다홍시티 쪽으로\n허둥지둥 달아났다……)\f'산성 은신처'……?\n어디 있는 산성일까?");
  G.flag("bangsam5_done", true);
  zoneBgm();
}

// =====================================================================
// 2. 9번도로 들머리: 라이벌 한결 6차전 (구룡 어사패 뒤, 져도 진행)
// =====================================================================
// bal_gym(셋, 상처약 2, 짝 = 10·9번도로·감청에서 잡히는 여덟 마리 중 둘): 처음 안(다리작·워낭왕·씨름소 30 + 스타팅 32)은 풀 0–13%·물 3–20%
//   → 워낭왕 대신 딸랑공, 29·29·29 + 31: 풀 Lv31 40%·33 73% / 불꽃 93% / 물 Lv31 67%·33 90% (라이벌은 늘 상성 우위·져도 진행)
const RIVAL6_MV = { chorongsap: ["flamecharge", "flamewheel", "bite", "scratch"], kkumuri: ["waterpulse", "aquajet", "bite", "tailwhip"],
  kkotmong: ["magicalleaf", "megadrain", "mudshot", "growl"] };
const rival6 = () => { const k = RIVAL_EVO[RIVAL_OF[G.starter] || "bulsap"] || "chorongsap";
  return { id: "rival6", cls: "라이벌", name: "한결", spr: "hangyeol", music: "rival", bgm: "trainer", base: 40, canLose: true,
    loseText: "한결: 봤지?\n운동장 서른 바퀴의 힘이다!",
    intro: "한결: 처음 남켓몬 받고 붙었던 거\n기억나?\f그때보다 우리 둘 다\n훨씬 세졌지?\f그러니까…… 진심으로 간다!",
    lose: "한결: ……하하.\n졌는데 기분이 좋네.",
    team: [["eunhajak", 36, { mv: ["airslash", "quickattack", "pluck", "leer"] }],
           ["wonangwang", 36, { mv: ["spark", "thundershock", "screech", "astonish"] }],
           ["ssireumso", 36, { mv: ["lowsweep", "machpunch", "doublekick", "leer"] }],
           [k, 38, { mv: RIVAL6_MV[k] }]] }; };   // v2.55 스토리 난이도 +3
async function rival6Event() {
  const P = World.player, H = act("hangyeol_c6");
  if (!H) return;
  bgm("rival");
  await say(`???: ${G.name}~!\n잠깐만!`);
  P.dir = "left";
  H.x = Math.max(P.x - 5, 42); H.y = P.y; H.hidden = false;
  await walkTo(H, P.x - 1, P.y); face(H, P);
  await emote(H, "excl", 26);
  await say("한결: 구룡 어사패도 땄다며?\n나도 어제 땄어!\f근데 감청마을 가는 거지?\n그 전에 한 판!");
  const r = await trainerBattle({ x: H.x, y: H.y, dir: H.dir, trainer: rival6() }, false);
  bgm("rival");
  if (r !== "win") { await say("한결: 자, 쉬게 해 줘.\n산길은 기운 없으면 못 올라가!"); G.healAll(); await Audio2.jingle("jg_heal"); await say("남켓몬들이 기운을 되찾았다!"); }
  await say("한결: 교장 선생님이 그러셨는데\n감청 배움터 기수 선생님은\f평소엔 엄청 친절하신데\n화나시면 엄청 무섭대.");
  await say("한결: 근데 화내시는 건\n누가 남을 괴롭힐 때뿐이래.\f……멋있지 않냐?\n나도 그런 사람 될 거야.");
  await say("한결: 먼저 간다!\n교룡산 오르막에서 지면 안 돼!");
  await walkPath(H, 41, 17); await walkPath(H, 41, 9); sfx("exit"); H.hidden = true;
  G.flag("rival6_done", true);
  zoneBgm();
}

// =====================================================================
// 3. 교룡산성 동문 앞: 지킴이 기수 첫 등장 · 본디회 문지기
// =====================================================================
const GY_GRUNT1 = { id: "bondi_gy1", cls: "본디회", name: "단원", spr: "grunt_m", base: 30, music: "bondi", bgm: "trainer", range: 1,
  intro: "단원: 본디대로!\n산성은 본디 사람이 없던 곳이다!", lose: "단원: 크윽……\n문이 뚫렸다!",
  team: [["bakjumi", 33], ["metkongi", 34]],
  after: "단원: 행수님들은 군창 지하에 계신다.\n……아, 말해 버렸다!" };
const GY_GRUNT2 = { id: "bondi_gy2", cls: "본디회", name: "단원", spr: "grunt_f", base: 30, music: "bondi", bgm: "trainer", range: 1,
  intro: "단원: 교룡산 남켓몬은\n우리가 쉬게 해 줄 거야!", lose: "단원: 이, 이럴 수가!",
  team: [["seotkongi", 33], ["sojjeokmi", 34]],
  after: "단원: 솔뫼 행수님은 산을 사랑하셔.\n……그건 진짜야." };
const GY_GRUNT3 = { id: "bondi_gy3", cls: "본디회", name: "단원", spr: "grunt_m", base: 30, music: "bondi", bgm: "trainer", range: 3,
  intro: "단원: 군창에는 아무도 못 들어간다!\n본디대로!", lose: "단원: 문, 문을 지켜야 하는데……",
  team: [["heosuni", 34], ["bakjumi", 34]],
  after: "단원: 옛날엔 여기 군량 창고가 있었대.\n지금은…… 우리 창고야." };
async function gisuGateEvent() {
  const P = World.player, K = act("gisu_gate");
  if (!K) return;
  G.flag("gisu_met", true);
  bgm("gym");
  await emote(P, "excl", 20);
  await say("……산성 동문 앞에서\n누군가 단원들과 이야기하고 있다.");
  await walkPath(P, 23, 27); P.dir = "up";
  await say("단원: 본디대로!\f산은 본디 사람이 없던 곳이다.\n여기서부터는 못 지나간다!");
  await say("???: 음~ 아닌 거 같은데~?\f산성은 마을 사람들이\n함께 지켜 온 곳이에요.\f길을 막을 권리는\n누구에게도 없어요.");
  face(K, P); await emote(K, "quest", 20);
  await say("???: 아, 혹시 배움터 도전자?\f미안해요. 오늘은 배움터 문을\n잠깐 닫아 뒀어요.");
  await say("기수: 감청 배움터 지킴이, 기수예요.\f과학 선생님이고요.\n그리고…… 격투 타입을 써요.");
  await say("기수: 이 사람들이 산성의\n옛 군량 창고를 막아 두고\f교룡산 남켓몬을 항아리에\n넣는다는 이야기를 들었어요.\f그래서 직접 보러 왔죠.\n관찰은 직접 하는 게 제일이니까.");
  await say("기수: 같이 가 줄래요?\f나는 동쪽 수문 쪽으로\n돌아가 볼게요.\f정문은 부탁해요.\n무리하지는 말고요!");
  await walkPath(K, 30, 25); await walkPath(K, 40, 25); sfx("exit"); K.hidden = true;
  zoneBgm();
}

// =====================================================================
// 4. 본디회 은신처(교룡산성 옛 군량 창고 지하): 훈장 어른 · 옹이 ② · 솔뫼 ① · 기수
// =====================================================================
const HB_GRUNTS = [
  { id: "bondi_hb1", cls: "본디회", name: "단원", spr: "grunt_f", base: 30, music: "bondi", bgm: "trainer",
    intro: "단원: 굴림 바닥에 미끄러져\n여기까지 왔구나!", lose: "단원: 나도 미끄러졌다……",
    team: [["geumulgeo", 34], ["seotkongi", 34]], after: "단원: 화살 쪽으로 밀려 가.\f어디서 멈추는지 잘 보면\n길이 보여." },
  { id: "bondi_hb2", cls: "본디회", name: "단원", spr: "grunt_m", base: 30, music: "bondi", bgm: "trainer",
    intro: "단원: 컨베이어를 타고 왔다고?\n그럼 여기서 멈춰라!", lose: "단원: 거꾸로 밀려났다……",
    team: [["metkongi", 34], ["bakjumi", 35]], after: "단원: 계단은 오른쪽 위야.\f……가르쳐 준 거 아니다!" },
  { id: "bondi_hb3", cls: "본디회", name: "단원", spr: "grunt_f", base: 30, music: "bondi", bgm: "trainer",
    intro: "단원: 여기는 막다른 방!\n잘못 왔지롱!", lose: "단원: 막다른 건 나였네……",
    team: [["sojjeokmi", 34], ["heosuni", 34]], after: "단원: 아래로 가는 화살을 타면\n가운데 방으로 돌아가." },
  { id: "bondi_hb4", cls: "본디회", name: "단원", spr: "grunt_m", base: 30, music: "bondi", bgm: "trainer",
    intro: "단원: 항아리 창고에는\n아무도 못 들어간다!", lose: "단원: 항아리가 흔들렸다……",
    team: [["dukkeojang", 35]], after: "단원: 항아리마다 남켓몬이\n자고 있어. 쉿!" },
  { id: "bondi_hb5", cls: "본디회", name: "단원", spr: "grunt_f", base: 30, music: "bondi", bgm: "trainer",
    intro: "단원: 솔뫼 행수님께는\n절대 못 가!", lose: "단원: 행수님, 죄송해요……",
    team: [["namujjo", 35], ["chamdaram", 35]], after: "단원: 솔뫼 행수님은 원래\n산림 감시원이셨대." },
];
// 설정집 4장 팀(옹이 목기령 28·허수장 28·참숯장 29 / 솔뫼 너덜바 28·맷돌멧 28·달곰콩 29)을 이 게임 진행에 맞춤
//   bal_gym(셋, 상처약 2, 짝 = 이 지역 여덟 마리 중 둘): 옹이 처음 안(목기령·허수장 32·참숯장 33, 저주·이상한빛)은 풀 3–17%·물 10–20%(풀·고스트 둘이 버티기만 함)
//   → 목동이 29·허수니 29(저주·이상한빛 뺌)·참숯장 31: 풀 97–100% · 불꽃 80–83% · 물 70–83%
//   솔뫼 처음 안(32·32·33)은 불꽃 Lv31 33% → 31·31·32: 풀 77–83% · 불꽃 53–77% · 물 87–93%
const ONGI2 = { id: "ongi2", cls: "본디회 행수", name: "옹이", spr: "ongi", base: 60, music: "bondi", bgm: "trainer",
  intro: "옹이: 또 너냐, 꼬마.\f이번 항아리는 지난번과 달라.\n가마 불을 두 배로 땠거든!",
  lose: "옹이: ……또 금이 갔군.\f……이상하지. 스승님 말씀이\n자꾸 떠올라.",
  team: [["mokgiryeong", 36, { mv: ["hex", "megadrain", "astonish", "sweetscent"] }],
         ["heosujang", 36, { mv: ["astonish", "bulletseed", "leer", "megadrain"] }],
         ["chamsutjang", 38, { mv: ["incinerate", "ancientpower", "smackdown", "smokescreen"] }]] };
const SOLMOE1 = { id: "solmoe1", cls: "본디회 행수", name: "솔뫼", spr: "solmoe", base: 60, music: "bondi", bgm: "trainer",
  intro: "솔뫼: 산은 사람 없이도\n잘 살았다.\f……이 산의 문은\n내가 닫는다!",
  lose: "솔뫼: 허……\n바위가 굴렀구먼.",
  team: [["neodeolba", 38, { mv: ["rocktomb", "bulldoze", "stealthrock", "leer"] }],
         ["metkongi", 38, { mv: ["rockslide", "bulldoze", "sandtomb", "mudslap"] }],
         ["bandaljanggun", 39, { mv: ["slash", "facade", "scaryface", "covet"] }]] };
async function elderEvent() {
  const P = World.player, E = act("hb_elder");
  if (!E) return;
  G.flag("elder_met", true);
  await walkPath(P, E.x, E.y + 1); P.dir = "up"; face(E, P);
  await say("……항아리 사이에\n흰 수염의 할아버지가 앉아 있다.");
  await say("훈장 어른: 허허, 어린 손님이로구나.\f나는 서당에서 아이들에게\n글을 가르치던 사람이다.\f본디회에서는 나를\n'훈장 어른'이라 부르지.");
  await say("훈장 어른: 옛날 이야기 하나 해 주마.\f하늘 은하수 양쪽에\n견우와 직녀 별이 산단다.\f일 년에 한 번, 칠월 칠석에\n까마귀와 까치가 날아올라\f머리를 맞대고 다리를 놓아 주지.\n그게 오작교란다.");
  await say("훈장 어른: 그런데 요즘 아이들은\n이 이야기를 몰라.\f옛이야기를 들어 줄 아이가\n없으니, 이야기도 사라지지.");
  await say("훈장 어른: 대방님이 그러시더구나.\f전설의 남켓몬을 항아리에 봉인하면\n이야기도 영원히 남는다고.\f……그래서 여기 와 있단다.");
  const c = await ask("훈장 어른: 너는 옛이야기를\n좋아하느냐?", ["좋아해요", "잘 몰라요"]);
  if (c === 0) await say("훈장 어른: 허허, 그래?\f그럼 다음에 서당에 오너라.\n뒷이야기를 들려주마.");
  else await say("훈장 어른: 허허, 솔직하구나.\f모르면 들으면 되지.\n그게 이야기의 시작이란다.");
  await say("훈장 어른: ……그런데 이상하구나.\f이렇게 이야기를 들어 주는 아이가\n앞에 있는데,\f나는 왜 이야기를 항아리에\n넣으려 했을까.");
}
async function ongi2Event() {
  const P = World.player, O = act("hb_ongi");
  if (!O) return;
  bgm("bondi");
  face(O, P); await emote(O, "excl", 24);
  await say("옹이: ……또 너냐.\f여기 항아리들, 전부\n내가 이번 달에 구운 거다.");
  await say("옹이: 교룡산 남켓몬들이\n등산객 소리에 놀라 숨는다길래\f솔뫼 형님이 쉬게 해 주자고 했지.\n……나는 항아리만 빚었을 뿐이다.");
  await say("옹이: 그런데 말이다.\f가마에 불을 땔 때마다\n스승님 말씀이 들려.\f'그릇은 쓰라고 만드는 거다.'\n……시끄러워!");
  const r = await trainerBattle({ x: O.x, y: O.y, dir: O.dir, trainer: ONGI2 }, false);
  if (r !== "win") return;
  bgm("bondi");
  await say("옹이: ……솔뫼 형님은\n저 안쪽 큰 항아리 앞에 계신다.\f형님은 나보다 훨씬 고집이 세.\n조심해라, 꼬마.");
  await say("옹이: ……나는 가마에 가 봐야겠다.\f불을 꺼 두고 왔는지\n생각이 안 나.");
  sfx("exit"); await fadeOut(8); O.hidden = true; await fadeIn(8);
  G.flag("ongi2_done", true);
}
async function solmoe1Event() {
  const P = World.player, S = act("hb_solmoe"), K = act("hb_gisu"), E = act("hb_elder");
  if (!S) return;
  bgm("bondi");
  await walkPath(P, 17, 15); P.dir = "right"; face(S, P);
  await emote(S, "excl", 24);
  await say("……커다란 항아리 앞에\n덩치 큰 사람이 서 있다.");
  await say("???: 여기까지 왔구먼.\f옹이 녀석이 길을 터 준 게로군.");
  await say("솔뫼: 나는 솔뫼.\n본디회의 산 행수다.\f예전엔 지리산에서\n산림 감시원 일을 했지.");
  await say("솔뫼: 등산객이 버리고 간 쓰레기,\n밤마다 번쩍이는 손전등,\f사람을 피해 길을 잃은\n반달가슴곰 새끼……\f다 내 눈으로 봤다.");
  await say("솔뫼: 이 항아리 안에는\n교룡산 남켓몬들이 잠들어 있다.\f사람 소리 없는 곳에서\n푹 쉬게 해 주는 거다.");
  await say("솔뫼: 산은 사람 없이도\n잘 살았다.\f……이 산의 문은\n내가 닫는다!");
  const r = await trainerBattle({ x: S.x, y: S.y, dir: S.dir, trainer: SOLMOE1 }, false);
  if (r !== "win") return;
  bgm("bondi");
  await say("솔뫼: ……허, 힘이 세구먼.\f그래도 문은 닫아야 해.\n산이 아프단 말이다.");
  // 지킴이 기수가 달려옴
  sfx("door"); await say("???: 괜찮아요?!");
  if (K) { K.hidden = false; K.x = 15; K.y = 14; await walkTo(K, 16, 14); face(K, S); }
  face(P, S);
  await say("기수: 동쪽 수문 쪽 길이\n꽤 길었네요. 늦어서 미안해요.");
  await say("기수: 솔뫼 씨라고 하셨죠.\f걱정하시는 거, 다 진짜예요.\n쓰레기도, 길 잃은 곰도.");
  await say("기수: 그런데…… 음~\n아닌 거 같은데요?\f문을 닫으면 쓰레기를 줍는 사람도\n아픈 곳을 살피는 사람도\f같이 못 들어가요.\f관찰하지 않으면\n지킬 수도 없어요.");
  await say("솔뫼: ……말은 쉽지.");
  await emote(K, "excl", 20);
  await say("기수: ……그리고 하나 더요.");
  await say("기수의 목소리가\n낮고 조용해졌다……");
  await say("기수: 남켓몬을 묻지도 않고\n가둬 두는 건 안 돼요.\f지금, 항아리를 여세요.");
  await emote(S, "dots", 30);
  await say("솔뫼: ……허, 무서운 선생이구먼.");
  await say("솔뫼가 큰 항아리의\n붉은 봉인을 떼어 냈다……");
  sfx("ball_open"); await frames(20); sfx("ball_open");
  await say("박쥬미·소쩍미·멧콩이들이\n항아리에서 쏟아져 나와\f교룡산 숲으로\n힘차게 달려 나갔다!");
  await say("솔뫼: ……반야봉에서 다시 보자.\f그 산은 여기보다\n훨씬 더 아프다.");
  sfx("exit"); await fadeOut(10); S.hidden = true; if (E) E.hidden = true; await fadeIn(10);
  await say("(솔뫼와 훈장 어른은\n은신처를 떠났다……)");
  G.flag("solmoe1_done", true); G.flag("hideout_done", true);
  if (K) { face(K, P); face(P, K); }
  await say(`기수: ${G.name}, 정말 잘했어요.\f아까 그 말은…… 미안해요,\n조금 무서웠죠?`);
  await say("기수: 남이 괴롭힘당하는 걸 보면\n저도 모르게 그래요.\f……평소엔 안 무서워요. 진짜로!");
  await say("기수: 배움터에서 기다릴게요.\f과학실 문은\n이제 활짝 열어 둘게요!");
  await getItem("fullheal", 2);
  if (K) { sfx("exit"); await fadeOut(8); K.hidden = true; await fadeIn(8); }
  zoneBgm();
}

// =====================================================================
// 5. 감청 배움터(과학실) — 빛 실험: 레이저 빛을 거울로 꺾어 감지기에 닿게 하면 관찰 기록(수업) → 문
// =====================================================================
// 거울: A로 '/' ↔ '\' 돌리기. 빛은 바닥 위를 지나가고 벽·칸막이·가구에 막힘. 사람은 빛을 막지 않음
const GYM5_STAGES = [
  { emit: [0, 18, "right"], sensor: [9, 16], mirrors: [[9, 18, "\\"]] },                                                   // 답: (9,18) '/'
  { emit: [14, 13, "left"], sensor: [3, 14], mirrors: [[10, 13, "/"], [10, 11, "/"], [3, 11, "\\"]] },                        // 답: '\' '\' '/'
  { emit: [0, 9, "right"], sensor: [13, 8], mirrors: [[8, 9, "\\"], [8, 6, "/"], [3, 6, "\\"], [3, 8, "/"], [12, 6, "/"]] },  // 답: '/' '\' '/' '\', (12,6)은 미끼
];
const MIR_TURN = { "/": { right: "up", up: "right", left: "down", down: "left" }, "\\": { right: "down", down: "right", left: "up", up: "left" } };
function gym5Mirror(x, y) { return World.actors.find(a => a.mirror && a.x === x && a.y === y); }
function gym5Beam(i) {                       // 빛길: [[x,y],...] 과 감지기에 닿았는지
  const S = GYM5_STAGES[i], M = World.M; let [x, y, d] = S.emit; const pts = [[x, y]]; let hit = false;
  for (let n = 0; n < 80; n++) {
    const [dx, dy] = DIRS[d]; x += dx; y += dy;
    if (x === S.sensor[0] && y === S.sensor[1]) { pts.push([x, y]); hit = true; break; }
    const m = gym5Mirror(x, y);
    if (m) { pts.push([x, y]); d = MIR_TURN[m.mirror][d]; continue; }
    if (x < 0 || y < 0 || x >= M.w || y >= M.h || M.solid[y][x]) { pts.push([x - dx * 0.5, y - dy * 0.5]); break; }
  }
  if (!pts.length || pts[pts.length - 1][0] !== x || pts[pts.length - 1][1] !== y) pts.push([x, y]);
  return { pts, hit };
}
function gym5Draw(cx, cy) {
  const ts = World.M.ts, T = ts.js.t, on = (FRAME >> 2) & 1;
  for (let i = 0; i < GYM5_STAGES.length; i++) {
    const B = gym5Beam(i), S = GYM5_STAGES[i];
    g.save(); g.lineCap = "round";
    for (const [w, col] of [[4, on ? "rgba(255,90,70,.35)" : "rgba(255,90,70,.25)"], [2, "#ff5a46"], [1, "#ffe0d8"]]) {
      g.strokeStyle = col; g.lineWidth = w; g.beginPath();
      B.pts.forEach(([x, y], k) => { const px = x * TS + 8 - cx, py = y * TS + 8 - cy; if (k) g.lineTo(px, py); else g.moveTo(px, py); });
      g.stroke();
    }
    g.restore();
    if (B.hit || G.flag("g5q" + (i + 1))) { const k = T.sensor_on; if (k >= 0) tileAt(ts, k, S.sensor[0] * TS - cx, S.sensor[1] * TS - cy, TS, TS); }
  }
}
const QUIZ5 = [
  { board: "관찰 기록판: '관찰 하나 · 오늘 있었던 일'\f교룡산성 군창 지하에서\n행수 솔뫼를 만났어요.",
    q: "솔뫼는 왜 교룡산 남켓몬을\n항아리에 넣었다고 했나요?", opts: ["산이 아파해서", "남켓몬을 팔려고", "항아리를 자랑하려고"], a: 0, gift: "hyperpotion",
    good: "솔뫼 아저씨의 걱정은 진짜였어.\f그래도 기수 선생님 말씀처럼\n문을 닫으면 아픈 곳도 못 살펴.\f관찰하고, 같이 지키는 거!\n그게 과학반 규칙이야." },
  { board: "관찰 기록판: '관찰 둘 · 남원 생태도감'\f교룡산성에는 해 질 녘이면\n박쥬미가 날아다녀요.",
    q: "박쥐는 깜깜한 밤에 어떻게\n날벌레를 찾을까요?", opts: ["소리의 메아리로", "아주 밝은 눈으로", "냄새로만"], a: 0, gift: "dusk",
    good: "박쥐는 초음파를 내고\n되돌아오는 소리를 들어.\f그 메아리로 날벌레가\n어디 있는지 알아낸대.\f빛 대신 소리로 보는 거야!\n그리고 박쥐는 새가 아니라 포유류래." },
  { board: "관찰 기록판: '관찰 셋 · 타입 상성'\f기수 선생님의 남켓몬은\n모두 격투 타입이에요.",
    q: "격투 타입에게 효과가\n굉장한 기술 타입은?", opts: ["에스퍼", "바위", "악"], a: 0, gift: "twistedspoon",
    giftAlways: "하율: 이거 줄게!\n에스퍼 기술을 세게 해 주는 '놋숟가락'.",
    good: "격투는 에스퍼·비행·페어리에 약해.\f대신 노말·바위·강철·얼음·악에는\n아주 강하지.\f버마검은 벌레 타입이기도 해서\n불꽃·비행이 잘 들어!" },
];
const GYM5_KIDS = [
  { id: "g5k1", n: 1, x: 12, y: 18, dir: "left", spr: "kid_m",
    hint: "지후: 레이저 빛이 감지기에\n닿으면 문이 열려!\f거울 앞에서 A를 누르면\n거울 방향이 바뀌어.",
    after: "지후: 기수 선생님 실험은\n늘 '왜 그럴까?'로 시작해.",
    tr: { id: "gym5_jihu", cls: "과학반 짝꿍", name: "지후", spr: "kid_m", base: 20, team: [["satbaso", 32], ["bakjumi", 32]],
      intro: "지후: 가설! 이 배틀은\n내가 이긴다!", lose: "지후: 가설이 틀렸다……\n다시 실험!" } },
  { id: "g5k2", n: 2, x: 6, y: 14, dir: "right", spr: "kid_f",
    hint: "서진: 빛은 거울에 부딪히면\n꺾여서 나가.\f빛이 지나가는 길을\n손가락으로 따라가 봐!",
    after: "서진: 선생님이 그러셨어.\n'틀린 실험도 좋은 실험'이래.",
    tr: { id: "gym5_seojin", cls: "과학반 짝꿍", name: "서진", spr: "kid_f", base: 20, team: [["eomnirang", 32]],
      intro: "서진: 관찰 일지에\n이 배틀도 적을 거야!", lose: "서진: 관찰 결과:\n네가 더 세다!" } },
  { id: "g5k3", n: 3, x: 11, y: 7, dir: "down", spr: "kid_f",
    hint: "하율: 거울이 네 개나 있어.\f빛이 어디서 막히는지 보고\n하나씩 고쳐 봐.\f(하나는 빛이 안 지나가는\n심술쟁이 거울이야!)",
    after: "하율: 기수 선생님은 화날 때\n목소리가 작아지셔.\f……그게 더 무서워.",
    tr: { id: "gym5_hayul", cls: "과학반 짝꿍", name: "하율", spr: "kid_f", base: 20, team: [["beomageom", 31], ["sojjeokmi", 32]],
      intro: "하율: 사마귀처럼\n재빠르게!", lose: "하율: 낫이 무뎌졌다……" } },
];
async function gym5Check(n) {          // 감지기에 빛이 닿았는지 보고 수업(관찰 기록)
  const F = "g5q" + n;
  if (G.flag(F)) { await say("감지기에 초록 불이 켜져 있다.\f관찰 기록판에 '참 잘했어요'\n도장이 찍혀 있다."); return; }
  if (!gym5Beam(n - 1).hit) { await say("빛 감지기.\f레이저 빛이 닿으면\n초록 불이 켜진다."); return; }
  sfx("chime");
  await say("빛이 감지기에 닿았다!\f띠링! 관찰 기록판에\n문제가 떠올랐다!");
  const k = GYM5_KIDS[n - 1], r = await gymLesson(QUIZ5[n - 1], k);
  if (r === "lost" || r === "cancel") return;
  G.flag(F, true);
  await gymOpenGate("g5gate" + n, "유리 칸막이 문이 스르륵 열렸다!");
}
async function gym5MirrorTalk(a) {
  const n = a.stage + 1;
  if (G.flag("g5q" + n)) { await say("거울이 빛을 받아\n반짝이고 있다."); return; }
  a.mirror = a.mirror === "/" ? "\\" : "/"; sfx("select");
  await frames(6);
  if (gym5Beam(a.stage).hit) await gym5Check(n);
}
async function gym5KidTalk(k) {
  const K = act(k.id);
  if (!G.flag("g5q" + k.n)) { await say(k.hint); return; }
  if (!G.flag("tr_" + k.tr.id)) {
    if (await yes(`${k.tr.name}: 실험 성공!\n연습 배틀 한 판 할래?`)) await trainerBattle({ x: K.x, y: K.y, dir: K.dir, trainer: k.tr }, false);
    else await say(`${k.tr.name}: 좋아, 기수 선생님께 힘내!`);
    return;
  }
  await say(k.after);
}
async function gym5GuideTalk() {
  if (hasBadge(5)) {
    if (!G.flag("guide5_gift")) { await say("도우미: 산성 어사패! 축하해요!\f기수 선생님이 실험 노트에\n'오늘의 관찰: 멋진 도전자'라고\f쓰시는 거 봤어요.\n……이건 제 선물이에요."); await getItem("moomoomilk", 2); G.flag("guide5_gift", true); return; }
    await say("도우미: 과학실 창밖으로\n교룡산성 성벽이 보여요."); return;
  }
  await say("도우미: 어서 와요, 도전자님!\n여기는 감청 배움터, 과학실이에요.\f레이저 장치의 빛을 거울로 꺾어서\n빛 감지기에 닿게 해 보세요.\f거울 앞에서 A를 누르면\n거울 방향이 바뀌어요.\f빛이 닿으면 관찰 기록판에\n문제가 떠요. 틀려도 괜찮아요!");
}
// ---- 지킴이 기수 ----
// bal_gym(셋, 상처약 2, 짝 = 10·9번도로·감청에서 잡히는 여덟 마리 중 둘): 처음 안(씨름소 32·엄니랑 32·버마검 33, 센 기술)은 20–47%
//   → 샅바소 29·씨름소 30(벌크업)·버마검 32(대추, 순한 기술): Lv31 57–60% · Lv33 70–80% / 에스퍼·비행을 챙기면 80–93%
const GISU5 = { id: "leader_gisu", cls: "지킴이", name: "기수", spr: "gl_gisu", type: "격투", indoor: true, bg: "indoor", base: 110, music: "eyes", bgm: "battle_gym",
  intro: "기수: 빛 실험, 잘 풀었네요.\f과학은 '왜?'라고 묻는 데서\n시작해요. 격투도 그래요.\f상대를 잘 관찰하면\n어디로 들어올지 보이거든요.\f자, 실험 시작!",
  lose: "기수: 음~ 졌네요.\f좋은 관찰이었어요.\n가설을 세우고, 실험하고, 고치고.\f오늘 그걸 다 해냈어요.",
  // v2.56 사용자 "5관장이 28~31인데 내 남켓몬이 41" → 넷(38·39·39·43, 모두 진화 끝) · 실력자 AI · 경옥고 1개 · 타고난 힘 22
  iv: 22, items: ["hyperpotion"],
  team: [["ssireumso", 38, { ab: "guts", mv: ["submission", "strength", "bulkup", "scaryface"] }],
         ["eomnirang", 39, { ab: "strongjaw", mv: ["brickbreak", "hyperfang", "bite", "leer"] }],
         ["gulsojang", 39, { ab: "immunity", mv: ["brickbreak", "dig", "taunt", "scaryface"] }],
         ["beomageom", 43, { mv: ["lowsweep", "xscissor", "quickattack", "focusenergy"], item: "mogwa" }]] };
const GS_HINT = [
  "기수: 다시 왔네요. 좋아요!\f격투는 에스퍼·비행·페어리에 약해요.\n9번도로 밤에는 박쥬미가 날아요.",
  "기수: 씨름소는 벌크업으로\n점점 세져요.\f오래 끌지 말고 먼저 쓰러뜨리거나,\n화상을 입혀 봐요.",
  "기수: 버마검은 벌레·격투라서\n불꽃과 비행이 특히 잘 들어요.\f모과를 지니고 있으니\n한 번 더 버틸 거예요.",
];
async function gisuTalk(a) {
  if (hasBadge(5)) { await say(`기수: ${G.name}, 요즘은 뭘 관찰하고 있어요?\f……남켓몬이 웃는 때를\n세어 보는 것도 좋은 관찰이에요.`); return; }
  const lost = G.flags.gs_lost || 0;
  if (!lost) {
    await say(`기수: 어서 와요, ${G.name}.\f은신처에서는 정말 고마웠어요.\n이제 배움터 지킴이로서 상대할게요.`);
  } else await say(GS_HINT[Math.min(lost, GS_HINT.length) - 1]);
  const r = await trainerBattle({ x: a.x, y: a.y, dir: a.dir, trainer: GISU5 }, false);
  if (r !== "win") { G.flags.gs_lost = lost + 1; return; }
  bgm("gym5");
  await say("기수: 이건 감청 배움터의\n'산성 어사패'예요.");
  await getBadge(5, "기수");
  G.flag("badge5", true);
  await say("기수: 교룡산성은 둘레가\n3킬로미터가 넘어요.\f임진왜란 때 처영 스님이\n고쳐 쌓았다고 해요.\f성 안에는 우물이 아흔아홉 개나\n있었다고 전해지고요.");
  await say("기수: 감청마을의 부탁은 하나예요.\f모르는 건 부끄러운 게 아니에요.\n'왜?'라고 물어보는 게 시작이에요.");
  await say("기수: 그리고 이거요.");
  await getItem("tm31");
  await say("기수: 기술머신31 '깨뜨리다'.\f상대가 세운 벽도\n깨뜨리는 격투 기술이에요.\f……벽은 깨뜨리고,\n사람은 지켜 주는 거예요.");
  await emote(a, "heart", 30);
}

// =====================================================================
// 지도에 붙이기
// =====================================================================
(function attachChapter6() {
  const D = MAPDATA;
  if (typeof LOCKS !== "undefined") Object.assign(LOCKS, {
    seonguksa: "선국사 대웅전.\f문틈으로 은은한 향 냄새가 난다.\n조용히 지나가자.",
    house2_gamcheong: "문이 잠겨 있다.\f'과학 학원 — 오늘은 쉽니다'\n라고 적혀 있다.",
  });
  // ---- 주홍마을 북쪽 → 10번도로 ----
  const JH = MAPS.juhong;
  JH.warps = (JH.warps || []).concat([18, 19, 20, 21].map(x => [x, 0, ["route10", x + 22, 39, "up", "edge"]]));
  JH.signs = JH.signs.map(s => (s[0] === 17 && s[1] === 2) ? [17, 2, "↑ 10번도로 · 다홍시티(남원 시내)\n→ 동쪽: 12번도로 · 구룡계곡"] : s);
  { const wk = JH.npcs.find(n => n.id === "jh_worker");
    if (wk) wk.talk = "미안! 구룡계곡 가는 길은\n아직 정비 중이란다.\f북쪽 10번도로로 가면\n다홍시티와 감청마을이 나와.\f감청 배움터 어사패를 받을\n즈음엔 정비가 끝날 거야."; }
  JH.npcs.push({ id: "jh_north_kid", x: 22, y: 3, spr: "kid_m", dir: "left", move: "look",
    talk: () => say(hasBadge(4) ? "북쪽 10번도로로 가면\n다홍시티가 나와.\f거기서 서쪽으로 가면\n교룡산 아래 감청마을이야!" : "신하 선생님한테 이기면\n어디로 가야 하는지 알려 줄게!") });

  // ---- 다홍시티 동·서 출구 ----
  const W = MAPS.world;
  W.warps = (W.warps || []).concat([17, 18].map(y => [59, y, ["route10", 0, y - 9, "right", "edge"]]),
                                   [17, 18].map(y => [0, y, ["route9", 59, y, "left", "edge"]]));
  W.signs.push([57, 16, "→ 10번도로 · 주홍마을(주천)\n지리산 자락으로 가는 고갯길"], [2, 19, "← 9번도로 · 감청마을(산곡동)\n교룡산 오르막"]);

  // ---- 10번도로 ----
  const R10 = D.route10;
  MAPS.route10 = {
    rows: R10.rows, stamps: R10.stamps, name: "10번도로",
    warps: [40, 41, 42, 43].map(x => [x, 39, ["juhong", x - 22, 0, "down", "edge"]]).concat([8, 9].map(y => [0, y, ["world", 59, y + 9, "left", "edge"]])),
    zones: [["10번도로", 0, 0, 59, 39]],
    zinfo: { "10번도로": { bgm: "route", enc: "10번도로", rate: 0.12, bg: "grass" } },
    signs: [[44, 37, "10번도로\n↑ 다홍시티(남원 시내) · ↓ 주홍마을"], [4, 7, "← 다홍시티\n남원 시내 동쪽 어귀"], [45, 17, "고갯마루\n쉬었다 가세요"]],
    checks: [], areas: [
      { x0: 40, y0: 11, x1: 47, y1: 14, cond: () => !G.flag("bangsam5_done"), run: bangsam5Event },
    ],
    npcs: [
      { id: "bangsam5", x: 46, y: 11, spr: "bondi", dir: "down", move: "fixed", show: () => !G.flag("bangsam5_done"), talk: () => bangsam5Event() },
      { id: "danji5", x: 47, y: 11, spr: "bondi", dir: "down", move: "fixed", show: () => !G.flag("bangsam5_done"), talk: () => bangsam5Event() },
      { id: "r10_farmer", x: 27, y: 33, spr: "woman", dir: "left", move: "look", talk: "아주머니: 여기는 이백 들판이야.\f지리산에서 내려온 물로\n농사를 짓지." },
      { id: "r10_hiker", x: 20, y: 7, spr: "man", dir: "down", move: "look", talk: "등산객: 저 아래가 남원 시내야.\f고갯길은 내려갈 때가\n더 조심스러운 법이지." },
      { item: "superpotion", x: 41, y: 4 }, { item: "revive", x: 3, y: 28 }, { item: "hyperpotion", x: 20, y: 30 }, { item: "ok", n: 2, x: 54, y: 26 },
      { x: 38, y: 29, spr: "kid_m", dir: "down", trainer: { id: "r10_seongmin", cls: "꼬마", name: "성민", spr: "kid_m", range: 2, base: 16, team: [["gaegulmi", 29], ["gorakong", 29]],
        intro: "들판 끝까지 달리기 시합!\n…아니, 배틀 시합!", lose: "숨이 차서 졌다……", after: "개굴미는 논에서\n개굴개굴 울어." } },
      { x: 30, y: 24, spr: "kid_f", dir: "left", trainer: { id: "r10_daeun", cls: "꼬마 숙녀", name: "다은", spr: "kid_f", range: 2, base: 16, team: [["angkkomi", 30]],
        intro: "원앙금은 짝이랑\n늘 붙어 다녀!", lose: "원앙금이 짝을 찾으러 갔어……", after: "원앙은 짝을 바꾸기도 한대.\n그래도 예쁘잖아!" } },
      { x: 10, y: 15, spr: "bugboy", dir: "right", trainer: { id: "r10_junhyuk", cls: "벌레잡이", name: "준혁", spr: "bugboy", range: 3, base: 16, team: [["beomageom", 30], ["ttakkeumi", 29]],
        intro: "사마귀 남켓몬 봤어?\n이 낫 좀 봐!", lose: "낫이…… 무뎌졌다……", after: "사마귀는 가을에\n거품 알집을 붙여 둬." } },
      { x: 45, y: 14, spr: "kid_m", dir: "right", trainer: { id: "r10_taemin", cls: "꼬마", name: "태민", spr: "kid_m", range: 2, base: 16, team: [["cheongdungdae", 31], ["satbaso", 30]],
        intro: "고갯마루 대장은 나야!", lose: "대장 자리를 뺏겼다……", after: "샅바소는 씨름 연습 중이야.\n격투 타입이지!" } },
    ],
  };

  // ---- 9번도로 ----
  const R9 = D.route9;
  MAPS.route9 = {
    rows: R9.rows, stamps: R9.stamps, name: "9번도로",
    warps: [17, 18].map(y => [59, y, ["world", 0, y, "right", "edge"]]).concat([8, 9, 10, 11].map(x => [x, 0, ["gamcheong", x + 10, 39, "up", "edge"]])),
    zones: [["9번도로", 0, 0, 59, 39]],
    zinfo: { "9번도로": { bgm: "route", enc: "9번도로", rate: 0.12, bg: "grass" } },
    signs: [[56, 16, "9번도로\n← 교룡산 오르막 · 감청마을(산곡동)"], [12, 3, "↑ 감청마을\n교룡산 아래 마을"], [29, 27, "산곡천\n교룡산에서 흘러내리는 개울"]],
    checks: [], areas: [
      { x0: 50, y0: 17, x1: 57, y1: 18, cond: () => hasBadge(4) && !G.flag("rival6_done"), run: rival6Event },
    ],
    npcs: [
      { id: "hangyeol_c6", x: 44, y: 17, spr: "hangyeol", dir: "right", hidden: true, move: "fixed", show: () => hasBadge(4) && !G.flag("rival6_done") },
      { id: "r9_fisher", x: 33, y: 27, spr: "oldman", dir: "down", move: "look", talk: "낚시꾼: 산곡천은 교룡산에서\n내려오는 물이란다.\f밤에는 털집게가\n돌 틈에서 나오지." },
      { item: "fullheal", x: 16, y: 25 }, { item: "yeot", x: 36, y: 5 }, { item: "maxrepel", x: 53, y: 14 }, { item: "superpotion", x: 3, y: 37 },
      { x: 47, y: 20, spr: "kid_m", dir: "up", trainer: { id: "r9_hyunjun", cls: "꼬마", name: "현준", spr: "kid_m", range: 2, base: 16, team: [["bakjumi", 30], ["metkongi", 30]],
        intro: "교룡산 탐험대 출동!", lose: "탐험대 해산……", after: "박쥬미는 해 질 녘에\n날아다녀." } },
      { x: 39, y: 12, spr: "kid_f", dir: "right", trainer: { id: "r9_seoyun", cls: "꼬마 숙녀", name: "서윤", spr: "kid_f", range: 1, base: 16, team: [["sojjeokmi", 31], ["daramball", 30]],
        intro: "오르막 오느라 힘들지?\n그럼 내가 쉬게 해 줄게!", lose: "내가 쉬게 됐네……", after: "소쩍미는 밤에\n'소쩍 소쩍' 하고 울어." } },
      { x: 50, y: 12, spr: "bugboy", dir: "left", trainer: { id: "r9_haram", cls: "벌레잡이", name: "하람", spr: "bugboy", range: 4, base: 16, team: [["geumulgeo", 31], ["ttakkeumnabang", 31]],
        intro: "숲속 빈터는 벌레 천국!", lose: "그물이 찢어졌다……", after: "그물거는 거미줄 대장이야." } },
      { x: 20, y: 10, spr: "kid_m", dir: "up", trainer: { id: "r9_minseong", cls: "꼬마", name: "민성", spr: "kid_m", range: 1, base: 16, team: [["eomnirang", 29]],
        intro: "산허리 길은 내가 지킨다!", lose: "지키지 못했다……", after: "엄니랑은 격투 타입도 있어.\n감청 배움터에 어울리지?" } },
    ],
  };

  // ---- 감청마을 ----
  const GC = D.gamcheong;
  MAPS.gamcheong = {
    rows: GC.rows, stamps: GC.stamps, name: "감청마을",
    warps: [18, 19, 20, 21].map(x => [x, 39, ["route9", x - 10, 0, "down", "edge"]]).concat([18, 19, 20, 21].map(x => [x, 0, ["gyoryong", x + 4, 43, "up", "edge"]])),
    zones: [["감청마을", 0, 0, 39, 39]],
    zinfo: { "감청마을": { bgm: "gamcheong", enc: "감청마을", rate: 0.12, bg: "grass" } },
    signs: [[17, 2, "↑ 교룡산성\n해발 518m 교룡산의 돌 성"], [22, 37, "감청마을\n교룡산 아래, 짙은 남색 마을"], [24, 9, "감청 배움터\n지킴이 기수 · 격투 타입의 과학실"]],
    checks: [], areas: [],
    npcs: [
      { id: "gym5_door_kid", x: 28, y: 9, spr: "kid_f", dir: "down", move: "fixed", show: () => !G.flag("hideout_done"),
        talk: () => say("기수 선생님은 교룡산성에\n가셨어.\f산성에 수상한 사람들이\n모여 있대!") },
      { id: "gc_elder", x: 16, y: 9, spr: "oldman", dir: "down", move: "look", talk: "할아버지: 교룡산성 안에는\n은적암이라는 작은 절이 있었단다.\f동학을 세운 최제우가\n1861년 겨울 남원에 와서\f그 암자에서 여섯 달을\n머물렀다고 하지." },
      { id: "gc_woman", x: 24, y: 16, spr: "woman", move: "wander", r: 1, talk: "아주머니: 산곡동은 산과 골짜기가\n많아서 붙은 이름이래." },
      { id: "gc_student", x: 10, y: 22, spr: "student", move: "wander", r: 1, talk: "기수 선생님은 과학 시간에\n늘 '왜 그럴까?' 하고 물으셔.\f모르면 같이 실험해 보자고\n하시지!" },
      { id: "gc_kid", x: 30, y: 24, spr: "kid_m", move: "wander", r: 1, talk: "산곡천에서 낚시하면\n은치미가 잡혀!" },
      { item: "superrepel", x: 3, y: 36 }, { item: "hyperpotion", x: 29, y: 33 },
      { x: 9, y: 33, spr: "kid_f", dir: "right", trainer: { id: "gc_yejin", cls: "꼬마 숙녀", name: "예진", spr: "kid_f", range: 3, base: 16, team: [["seotkongi", 31], ["sojjeokmi", 31]],
        intro: "교룡산 아래 풀숲은\n내 놀이터야!", lose: "놀이터를 빼앗겼다……", after: "섯콩이 포자는\n조심해야 해!" } },
    ],
  };

  // ---- 교룡산성 ----
  const GY = D.gyoryong;
  MAPS.gyoryong = {
    rows: GY.rows, stamps: fixStamps(GY.stamps), name: "교룡산성",
    warps: [22, 23, 24, 25].map(x => [x, 43, ["gamcheong", x - 4, 0, "down", "edge"]]),
    zones: [["교룡산성", 0, 0, 47, 43]],
    zinfo: { "교룡산성": { bgm: "route", enc: "교룡산성", rate: 0.13, bg: "grass" } },
    signs: [[26, 25, "교룡산성 동문\n무지개 모양으로 돌을 쌓은 문"], [21, 41, "교룡산성\n백제 때 쌓은 것으로 보이는 돌 성"], [6, 15, "은적암 터\n동학의 최제우가 머문 작은 절이 있던 곳"]],
    checks: [], areas: [
      { x0: 12, y0: 26, x1: 25, y1: 27, cond: () => !G.flag("gisu_met"), run: gisuGateEvent },
    ],
    npcs: [
      { id: "gisu_gate", x: 23, y: 25, spr: "gl_gisu", dir: "up", move: "fixed", show: () => !G.flag("gisu_met") },
      { id: "gy_elder", x: 16, y: 9, spr: "oldman", dir: "down", move: "look", talk: "할아버지: 이 산성 둘레는\n3킬로미터가 넘는단다.\f임진왜란 때 처영 스님이\n승병들과 고쳐 쌓았지.\f성 안엔 우물이 아흔아홉 개나\n있었다고 전해진단다." },
      { item: "ether", x: 44, y: 3 }, { item: "superpotion", x: 3, y: 40 },
      { x: 22, y: 24, spr: "bondi", dir: "right", trainer: GY_GRUNT1 },
      { x: 25, y: 24, spr: "bondi", dir: "left", trainer: GY_GRUNT2 },
      { x: 36, y: 10, spr: "bondi", dir: "left", trainer: GY_GRUNT3 },
    ],
  };

  // ---- 은신처 B1 ----
  const HB1 = D.hideout1;
  MAPS.hideout1 = {
    rows: HB1.rows, stamps: HB1.stamps, indoor: true, name: "본디회 은신처 B1", bg: "cave", floor: "floor_earth", wall: "wall_stone", win: "wall_stone_b", bgm: "hideout", noPopup: false,
    exit: ["gyoryong", GYD.hideout1[0], GYD.hideout1[1], "down"],
    warps: [[17, 3, ["hideout2", 2, 4, "down"]]],
    checks: [...[[0, 12], [5, 13], [9, 14], [18, 14], [0, 7], [9, 7], [13, 10], [19, 7], [0, 2], [8, 2], [11, 4], [13, 2]].map(([x, y]) => [x, y, () => say(G.flag("hideout_done") ? "봉인 종이가 반쯤 떨어진 항아리.\f안은 텅 비어 있다.\n모두 숲으로 돌아갔나 보다." : "붉은 봉인이 붙은 항아리.\f……안에서 새근새근\n숨소리가 들린다.")])],
    npcs: [
      { x: 17, y: 13, spr: "bondi", dir: "left", trainer: Object.assign({ range: 4 }, HB_GRUNTS[0]) },
      { x: 18, y: 9, spr: "bondi", dir: "left", trainer: Object.assign({ range: 5 }, HB_GRUNTS[1]) },
      { x: 4, y: 4, spr: "bondi", dir: "left", trainer: Object.assign({ range: 3 }, HB_GRUNTS[2]) },
      { item: "hyperpotion", x: 19, y: 12 }, { item: "superrepel", x: 1, y: 3 }, { item: "fullheal", x: 19, y: 4 },
    ],
  };
  // ---- 은신처 B2 (봉인 항아리 창고) ----
  const HB2 = D.hideout2;
  MAPS.hideout2 = {
    rows: HB2.rows, stamps: HB2.stamps, indoor: true, name: "본디회 은신처 B2", bg: "cave", floor: "floor_earth", wall: "wall_stone", win: "wall_stone_b", bgm: "hideout", noPopup: false,
    warps: [[2, 3, ["hideout1", 17, 4, "down"]]],
    under(cx, cy) {                                  // 봉인을 뗀 뒤: 열린 큰 항아리
      if (!G.flag("hideout_done")) return;
      const ts = World.M.ts, js = ts.js, S = js.stamp.jar_big_open, fl = js.t.floor_earth;
      const ti = (i, x, y) => tileAt(ts, i, x * TS - cx, y * TS - cy);
      for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) { ti(fl, 20 + i, 14 + j); if (S) ti(S.b[j][i], 20 + i, 14 + j); }
    },
    checks: [[20, 14, () => say(G.flag("hideout_done") ? "텅 빈 큰 항아리.\f봉인 자국만 남아 있다." : "커다란 봉인 항아리.\f……안에서 여러 남켓몬의\n숨소리가 들린다.")],
      [21, 14, () => say(G.flag("hideout_done") ? "텅 빈 큰 항아리." : "커다란 봉인 항아리.")]],
    areas: [
      { x0: 5, y0: 3, x1: 11, y1: 5, cond: () => !G.flag("elder_met") && !G.flag("hideout_done"), run: elderEvent },
      { x0: 0, y0: 7, x1: 5, y1: 9, cond: () => !G.flag("ongi2_done"), run: ongi2Event },
      { x0: 14, y0: 14, x1: 23, y1: 16, cond: () => !G.flag("solmoe1_done"), run: solmoe1Event },
    ],
    npcs: [
      { id: "hb_elder", x: 8, y: 3, spr: "elder_m", dir: "down", move: "fixed", show: () => !G.flag("hideout_done"),
        talk: async () => { if (!G.flag("elder_met")) { await elderEvent(); return; } await say("훈장 어른: 견우와 직녀 별은\n여름밤 은하수 양쪽에서 반짝인단다.\f……다음에 하늘을 보거든\n찾아보거라."); } },
      { id: "hb_ongi", x: 2, y: 8, spr: "ongi", dir: "up", move: "fixed", show: () => !G.flag("ongi2_done"), talk: () => ongi2Event() },
      { id: "hb_solmoe", x: 19, y: 15, spr: "solmoe", dir: "left", move: "fixed", show: () => !G.flag("solmoe1_done"), talk: () => solmoe1Event() },
      { id: "hb_gisu", x: 15, y: 14, spr: "gl_gisu", dir: "right", hidden: true, move: "fixed", show: () => !G.flag("hideout_done") },
      { x: 21, y: 8, spr: "bondi", dir: "up", trainer: Object.assign({ range: 2 }, HB_GRUNTS[3]) },
      { x: 12, y: 12, spr: "bondi", dir: "left", trainer: Object.assign({ range: 6 }, HB_GRUNTS[4]) },
      { item: "revive", x: 23, y: 3 }, { item: "ok", n: 2, x: 0, y: 12 },
    ],
  };

  // ---- 감청 배움터(과학실) ----
  MAPS.gym5 = {
    rows: D.gym5.rows, stamps: D.gym5.stamps, indoor: true, name: "감청 배움터", floor: "floor_sci", floor2: "floor_sci2", wall: "wall_sci", win: "win_sci", rail: "rail_sci",
    bgm: "gym5", noPopup: true, exit: exitGC("gym5"),
    over: gym5Draw,
    checks: [
      [9, 16, () => gym5Check(1)], [3, 14, () => gym5Check(2)], [13, 8, () => gym5Check(3)],
      [0, 18, "레이저 장치.\f빨간 빛이 곧게 뻗어 나간다.\n(눈으로 직접 보면 안 돼요!)"], [14, 13, "레이저 장치.\f빨간 빛이 곧게 뻗어 나간다."], [0, 9, "레이저 장치.\f빨간 빛이 곧게 뻗어 나간다."],
      ...[5, 6, 7, 8].map(x => [x, 1, "주기율표.\f세상의 모든 물질을 만드는\n원소들이 줄지어 있다."]),
      ...[[13, 19], [14, 19]].map(([x, y]) => [x, y, "비커와 플라스크가 가지런하다.\f'실험 뒤엔 꼭 손 씻기!'"]),
      ...[[3, 16], [4, 16], [3, 17], [4, 17]].map(([x, y]) => [x, y, "실험실 개수대.\f'실험 뒤엔 꼭 손 씻기!'"]),
      ...[[0, 11], [1, 11], [0, 12], [1, 12], [0, 6], [1, 6], [0, 7], [1, 7]].map(([x, y]) => [x, y, "관찰 기록판.\f빛이 감지기에 닿으면\n문제가 떠오른다."]),
    ],
    npcs: [
      { id: "gisu", x: 7, y: 3, spr: "gl_gisu", dir: "down", move: "fixed", talk: gisuTalk },
      { id: "guide5", x: 10, y: 18, spr: "student", dir: "left", move: "look", talk: gym5GuideTalk },
      ...GYM5_KIDS.map(k => ({ id: k.id, x: k.x, y: k.y, spr: k.spr, dir: k.dir, move: "fixed", talk: () => gym5KidTalk(k) })),
      ...D.gym5.gates.map(([x, y], i) => ({ id: "g5gate" + (i + 1), x, y, special: gateDrawer("gate_sci"), move: "fixed", show: () => !G.flag("g5q" + (i + 1)), talk: () => gym5Check(i + 1) })),
      ...GYM5_STAGES.flatMap((S, si) => S.mirrors.map(([x, y, init], mi) => ({ id: `g5m${si}_${mi}`, x, y, stage: si, mirror: init, move: "fixed",
        special: function (px, py) { const ts = World.M.ts, k = ts.js.t[this.mirror === "/" ? "mirror_a" : "mirror_b"]; tileAt(ts, k, px, py); },
        talk: (a) => gym5MirrorTalk(a) }))),
    ],
  };
  MAPS.center_gamcheong = { ...MAPS.center, exit: exitGC("center_gamcheong"),
    npcs: [MAPS.center.npcs.find(n => n.id === "nurse"),
      { id: "gcc_man", x: 2, y: 6, spr: "man", move: "look", talk: "감청 배움터는 격투 타입이래.\f에스퍼나 비행, 페어리 남켓몬을\n데려가 봐!" },
      { id: "gcc_gm", x: 11, y: 5, spr: "oldwoman", move: "look", talk: "할머니: 교룡산 바람은\n시원하고 맑단다." }] };
  MAPS.mart_gamcheong = { ...MAPS.mart, name: "감청 만물상", exit: exitGC("mart_gamcheong"),
    npcs: [MAPS.mart.npcs.find(n => n.id === "clerk"), MAPS.mart.npcs.find(n => n.id === "clerk2"),
      { id: "gcm_kid", x: 7, y: 6, spr: "kid_m", move: "look", talk: "산성 올라갈 땐\n상처약 넉넉히!" }] };
  MAPS.house_i = { rows: D.house_a.rows, stamps: D.house_a.stamps, indoor: true, name: "한옥", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "gamcheong", noPopup: true, exit: exitGC("house_i"),
    checks: [[0, 1, "자개장이 반짝반짝 빛난다."], [1, 1, "자개장이 반짝반짝 빛난다."], [6, 2, "병풍에 교룡산이 그려져 있다."], [7, 2, "병풍에 교룡산이 그려져 있다."]],
    npcs: [{ id: "house_i_gm", x: 2, y: 4, spr: "oldwoman", move: "look", talk: async () => {
      if (!G.flag("house_i_gift")) { await say("할머니: 기수 선생님 말이냐?\f우리 손녀 과학 선생님인데,\n손녀가 선생님 얘기만 한단다.\f'선생님은 모르는 걸 물어보면\n엄청 좋아하셔' 하더구나."); await getItem("lemonade", 2); G.flag("house_i_gift", true); return; }
      await say("할머니: 교룡산 바람이 불면\n이 집 처마가 노래를 한단다."); } }] };
  MAPS.house_j = { rows: D.house_b.rows, stamps: D.house_b.stamps, indoor: true, name: "한옥", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "gamcheong", noPopup: true, exit: exitGC("house_j"),
    npcs: [{ id: "house_j_man", x: 6, y: 4, spr: "man", dir: "down", move: "look", talk: "아저씨: 우리 아이가 기수 선생님 반이야.\f선생님이 '틀린 실험도 좋은 실험'\n이라고 하셨대." }] };

  Object.assign(TOWN_ZONE, { "10번도로": "r10", "9번도로": "r9", "감청마을": "gamcheong", "교룡산성": "gyoryong", "감청 배움터": "gamcheong", "본디회 은신처 B1": "gyoryong", "본디회 은신처 B2": "gyoryong" });
})();
