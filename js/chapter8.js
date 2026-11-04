// ===== v2.3 일곱째 장: 쑥빛시티 북쪽 → 14번도로(람천 둑길) → 인월장터(방삼·단지 '항아리 상회' · 라이벌 한결 7차전) → 미색마을(아영 흥부마을)
//   '흥부 리조트' 주민 설명회(설정집 7장: 금박재단 이사장 변도진 · 재단 요원 · 칠로 한지 어른이 닥나무 밭을 보고 의심) · 지킴이 희주 첫 등장
// chapter7.js 뒤, hearts.js 앞에 읽힘
// 희주: 관장 문서 7번(몹시 친절함·살짝 병약함·30대·육아로 바쁨, 마을에서는 안경 없이). 말버릇(D12 가안 v2.36) "천천히 해도 괜찮아요."
//   미색 배움터(D13)는 v2.36 chapter27.js에서 열림(설명회 뒤) — 희주는 배움터 안에서 기다림(수업 중엔 안경을 씀)
// 사실(위키백과로 확인): 인월은 서쪽 운봉에서 흘러온 람천과 북쪽에서 내려온 풍천이 만나는 곳, 람천은 진주 남강의 상류,
//   지리산국립공원으로 들어가는 관문이라 일찍부터 상가가 발달 / 흥부전: 인월면 성산리를 흥부가 태어난 곳, 아영면 성리를
//   흥부가 정착해 부자가 된 곳으로 보는 견해가 있음(흥부발상지) / 유곡리와 두락리 고분군: 삼국 시대 무덤, 사적, 2023년
//   '가야고분군'(7곳)의 하나로 유네스코 세계유산 / 아영: 고랭지 농산물, 봉화산(920m) 철쭉·억새
// 변도진은 이사장 얼굴만(본디회 대방이라는 정체는 절정까지 숨김 — 방삼·단지의 '지팡이' 개그로 복선만)
"use strict";
const IWD = MAPDATA.inwol.doors, MSD = MAPDATA.misaek.doors;
const exitIW = k => ["inwol", IWD[k][0], IWD[k][1], "down"];
const exitMS = k => ["misaek", MSD[k][0], MSD[k][1], "down"];

// ---- 출현표: 14번도로는 DATA 표(40–44)가 여섯째 어사패 바로 뒤로는 높아서 37–41로 낮추고, 아주 드문 3단·전설급을 뺌 ----
(function fixTownLv8() { for (const r of DATA.town.routes || []) if (r.no === 14) r.lv = "37~41"; })();
DATA.spawns["14번도로"] = [
  { k: "jebikko", lv: "37–40", t: "낮", r: "흔함" }, { k: "heukdoni", lv: "37–41", t: "모두", r: "가끔" }, { k: "sutkkeomi", lv: "37–40", t: "모두", r: "가끔" },
  { k: "bakari", lv: "37–40", t: "모두", r: "가끔" }, { k: "sorikkoe", lv: "38–41", t: "낮", r: "가끔" }, { k: "kkumnoru", lv: "37–40", t: "저녁", r: "가끔" },
  { k: "kalgitmae", lv: "38–41", t: "낮", r: "드묾" }, { k: "boeunbi", lv: "39–41", t: "낮", r: "드묾" }, { k: "ureureung", lv: "38–41", t: "낮", r: "드묾" },
  { k: "maetdolmet", lv: "40–41", t: "밤", r: "드묾" }, { k: "gujeongwang", lv: "39–41", t: "밤", r: "아주 드묾" } ];
DATA.spawns["인월장터"] = [
  { k: "jebikko", lv: "37–40", t: "낮", r: "흔함" }, { k: "heukdoni", lv: "37–40", t: "모두", r: "가끔" }, { k: "sutkkeomi", lv: "37–40", t: "밤", r: "가끔" },
  { k: "kalgitmae", lv: "38–40", t: "낮", r: "드묾" }, { k: "simsulbak", lv: "40", t: "밤", r: "아주 드묾" } ];
DATA.spawns["미색마을"] = [
  { k: "bakari", lv: "38–41", t: "모두", r: "흔함" }, { k: "jebikko", lv: "38–41", t: "낮", r: "흔함" }, { k: "kkumnoru", lv: "38–41", t: "저녁", r: "가끔" },
  { k: "boeunbi", lv: "39–42", t: "낮", r: "드묾" }, { k: "kalgitmae", lv: "39–42", t: "낮", r: "드묾" }, { k: "ureureung", lv: "39–42", t: "낮", r: "드묾" } ];
if (typeof FISH !== "undefined") {
  FISH.route14 = { at: "14번도로", list: [{ k: "eunchimi", lv: "22–26", r: "흔함", t: "모두" }, { k: "ssogami", lv: "24–26", r: "가끔", t: "모두" }, { k: "megijang", lv: "25–27", r: "드묾", t: "밤" }] };
  FISH.inwol = { at: "인월장터", list: [{ k: "eunchimi", lv: "22–26", r: "흔함", t: "모두" }, { k: "daseulmi", lv: "22–26", r: "흔함", t: "낮" }, { k: "ssogami", lv: "24–27", r: "가끔", t: "모두" }] };
}
if (typeof HIDDEN !== "undefined") {
  HIDDEN.route14 = [[28, 7, "ether"], [51, 26, "bae"], [3, 3, "maxrevive"], [40, 33, "hyperpotion"]];
  HIDDEN.inwol = [[44, 2, "gam"], [21, 32, "superrepel"]];
  HIDDEN.misaek = [[46, 3, "maxether"], [5, 37, "fullheal"], [49, 40, "meoru"]];
}
const RIVAL_FINAL = { bulsap: "cheongsarong", mongjjuk: "baraemong", kkokkuri: "yongkkuri" };

// =====================================================================
// 1. 인월장터 큰길: 방삼·단지 '본디회 항아리 상회' (설정집 1·3·5·7장 개그 콤비의 7장)
// =====================================================================
const BANGSAM7 = { id: "bondi_bangsam7", cls: "본디회 단원", name: "방삼", spr: "grunt_m", base: 40, music: "bondi", bgm: "trainer",
  intro: "방삼: 마침 잘 왔다!\n손님 1호로 모시지!\f네 남켓몬을 이 항아리에——",
  lose: "방삼: 끄아악!\n개업 첫날부터……!",
  team: [["dungabi", 34, { mv: ["transform"] }], ["neogulmi", 35, { mv: ["slash", "headbutt", "payback", "growl"] }],
         ["heosujang", 34, { mv: ["astonish", "bulletseed", "confuseray", "growl"] }]] };      // 개그 배틀: 가볍게(둔갑이는 상대 남켓몬으로 변신)
async function bangsam7Event() {
  const P = World.player, B1 = act("iw_bangsam"), B2 = act("iw_danji"), V = act("iw_granny");
  if (!B1) return;
  bgm("bondi");
  await say("단지: 봉인 항아리 사세요~!\n하나 사면 하나 더!");
  await say("방삼: 에헴! 남켓몬을 본디 자리로!\f항아리 하나면 오늘부터\n당신도 본디회!");
  if (V) { face(V, B1); await emote(V, "dots", 24); }
  await say("할머니: 항아리 장사면\n김치나 담그지,\f남켓몬을 왜 담어?");
  await say("단지: 형님…… 오늘 하나도\n못 팔았어요……");
  face(B1, P); await emote(B1, "excl", 22);
  await say("방삼: 앗, 너는!\f고갯마루 통행료를 떼먹은\n그 꼬마!");
  await say("단지: 형님, 그건 우리가\n진 거잖아요.");
  const r = await trainerBattle({ x: B1.x, y: B1.y, dir: B1.dir, trainer: BANGSAM7 }, false);
  if (r !== "win") return;
  bgm("bondi");
  await say("단지: 형님, 저쪽 미색마을에서\n리조트 설명회를 한대요.\f엄청 높으신 분이 오신대요!");
  await say("방삼: 높으신 분? 쳇!\f우린 대방님 말고는\n아무도 안 무섭다!");
  face(B2, B1);
  await say("단지: 근데 형님, 그 높으신 분\n지팡이가요……\f대방님 황금 박 지팡이랑\n똑같이 생겼대요.");
  await emote(B1, "dots", 30);
  await say("방삼: ……바보야!\f황금 박 지팡이가\n세상에 하나뿐이겠냐!");
  await say("방삼: ……하나뿐인가?");
  await say("단지: 몰라요~");
  await say("방삼: 몰라도 돼! 철수다!\f항아리는…… 두고 가자.\n무거워!");
  sfx("run"); await fadeOut(8); B1.hidden = true; B2.hidden = true; await fadeIn(8);
  if (V) { face(V, P); await say("할머니: 항아리는 잘 쓰마.\n올겨울 동치미 담가야지."); }
  G.flag("bd7_done", true);
  zoneBgm();
}

// =====================================================================
// 2. 인월장터 풍천 다리: 라이벌 한결 7차전 (져도 진행)
// =====================================================================
const RIVAL7_MV = { cheongsarong: ["flamecharge", "psybeam", "bite", "growl"], baraemong: ["magicalleaf", "mudshot", "acid", "growl"],
  yongkkuri: ["waterpulse", "bite", "mudslap", "scaryface"] };
const rival7 = () => { const k = RIVAL_FINAL[RIVAL_OF[G.starter] || "bulsap"] || "cheongsarong";
  return { id: "rival7", cls: "라이벌", name: "한결", spr: "hangyeol", music: "rival", bgm: "trainer", base: 45, canLose: true,
    loseText: "한결: 봤냐!\n장터 국밥의 힘이다!",
    intro: "한결: 요즘 계속 생각했어.\n나는 왜 이기고 싶은 걸까.\f처음엔 그냥 너를\n이기고 싶어서였는데……\f지금은 내 남켓몬들한테\n'우리가 해냈다'를 보여 주고 싶어!",
    lose: "한결: ……크으.\n또 졌다!\f근데 이상하다.\n하나도 안 분하네.",
    team: [["eunhajak", 36, { mv: ["wingattack", "pluck", "tailwind", "featherdance"] }],
           ["wonangwang", 33, { mv: ["spark", "metalsound", "screech", "tackle"] }],
           ["ssireumso", 34, { mv: ["strength", "machpunch", "scaryface", "leer"] }],
           [k, 36, { mv: RIVAL7_MV[k] }]] }; };
async function rival7Event() {
  const P = World.player, H = act("iw_hangyeol");
  if (!H) return;
  G.flag("rival7_met", true);
  bgm("rival");
  H.hidden = false; H.x = 33; H.y = 13;
  await emote(H, "excl", 20);
  await say("한결: 야——!\n여기서 만날 줄 알았다!");
  await walkTo(H, 30, P.y); face(H, P); P.dir = "right";
  await say("한결: 운봉에서 배추 먹고 왔냐?\f나는 방금 장터 국밥\n두 그릇 먹었다!");
  const r = await trainerBattle({ x: H.x, y: H.y, dir: H.dir, trainer: rival7() }, false);
  bgm("rival");
  if (r !== "win") { G.healAll(); await Audio2.jingle("jg_heal"); await say("남켓몬들이 기운을 되찾았다!"); }
  await say("한결: 아까 그 말 말이야.\f지면 분한 건 똑같은데,\n이제는 그다음이 보여.\f'다음엔 뭘 해 볼까' 하는 거.");
  await say("한결: ……그게 다 너 때문이다.\n고맙다는 말은 안 할 거야!");
  await say("한결: 아, 그리고!\f미색마을에서 무슨 리조트\n설명회를 한대.\f금박인가 은박인가\n하는 데서.");
  await say("한결: 나는 남쪽 산내 쪽 길을\n알아보러 갈게!\f……공사 중이라던데.\n뭐, 가 보면 알겠지!");
  await walkTo(H, 38, H.y); await walkTo(H, 38, 22);
  H.hidden = true;
  G.flag("rival7_done", true);
  zoneBgm();
}

// =====================================================================
// 3. 미색마을 마당: 금박재단 '흥부 리조트' 주민 설명회 · 재단 요원 · 칠로 한지 어른 · 지킴이 희주
// =====================================================================
const AGENT7A = { id: "agent_misaek1", cls: "금박재단", name: "요원", spr: "agent", base: 50, music: "bondi", bgm: "trainer",
  intro: "요원: 설명회 진행을 방해하시면\n곤란합니다.\f절차대로 처리하겠습니다.",
  lose: "요원: ……보고서에\n'예상 밖'이라고 적겠습니다.",
  team: [["neogulmi", 36, { mv: ["nightslash", "headbutt", "honeclaws", "payback"] }], ["eosapae", 37, { mv: ["mirrorshot", "confusion", "metalsound", "block"] }]] };
const AGENT7B = { id: "agent_misaek2", cls: "금박재단", name: "요원", spr: "agent", base: 50, music: "bondi", bgm: "trainer",
  intro: "요원: 서명만 하시면 됩니다.\f……아, 어린이는\n서명할 수 없군요.",
  lose: "요원: 이건 '서류에 없는 항목'\n입니다……",
  team: [["yeopjeoni", 35, { mv: ["mirrorshot", "spark", "irondefense", "metalsound"] }], ["gujeongwang", 38, { mv: ["sludge", "bite", "harden", "payback"] }]] };
async function misaekEvent() {
  const P = World.player, BD = act("ms_byeon"), A1 = act("ms_agent1"), A2 = act("ms_agent2"), HJ = act("ms_hanji"), HE = act("ms_heeju"),
    V1 = act("ms_v_old"), V2 = act("ms_v_kid");
  if (!BD) return;
  bgm("jaedan");
  await walkPath(P, 24, 13); P.dir = "up";
  await say("마당 무대 위에 금빛 현수막이\n걸려 있다.\f'흥부 리조트 주민 설명회'");
  await say("???: 여러분, 반갑습니다.\f금박재단 이사장,\n변도진입니다.");
  await say("변도진: 흥부가 박씨 하나로\n큰 부자가 되었듯이,\f이 미색마을도 '흥부 리조트'\n하나로 부자가 될 겁니다!");
  await say("변도진: 박밭 자리에는\n황금 박 호텔을.\f고분 언덕 옆에는\n전망대와 주차장을.");
  if (V1) { await emote(V1, "excl", 22); }
  await say("할아버지: 고분 옆에 주차장이라니요?\f세계유산이 된\n옛 무덤들인데!");
  await say("변도진: 물론 '절차대로' 하지요.\f허가는…… 곧 나올 겁니다.");
  await say("변도진: 아, 그리고 처마 밑\n제비 둥지는 깔끔하게 치우겠습니다.\f손님들 옷에 흙이 떨어지면\n곤란하니까요.");
  if (V2) { await emote(V2, "excl", 22); await say("꼬마: 제비 집을 치운대!\n봄에 돌아오면 어떡해!"); }
  // 칠로 한지 어른
  if (HJ) { await emote(HJ, "dots", 30); await walkTo(HJ, 20, 10); face(HJ, BD); }
  await say("???: ……잠깐.\n그 지도 좀 봅시다.");
  await say("탕건을 쓴 할아버지가\n설명회 지도를 들여다본다.");
  await say("할아버지: '부지'라고 칠한 여기……\n내 닥나무 밭 아니오?\f한지를 뜨는\n닥나무를 키우는 밭이오.");
  if (BD) face(BD, HJ);
  await say("변도진: 어르신, 서명만 하시면\n됩니다.\f값은 넉넉히 쳐 드리지요.");
  if (HJ) await emote(HJ, "quest", 30);
  await say("할아버지: ……그 목소리.\n어디서 들었더라.");
  if (BD) { face(BD, P); }
  await say("변도진: ……거기, 어린 친구.\f표정이 마음에\n들지 않는군요.");
  await say("변도진: 요원들.\n정중하게 모셔 드리세요.");
  if (A1) { await walkTo(A1, 24, 12); face(A1, P); }
  let r = await trainerBattle({ x: A1.x, y: A1.y, dir: A1.dir, trainer: AGENT7A }, false);
  if (r !== "win") return;
  if (A1) { await walkTo(A1, 23, 12); face(A1, P); }
  if (A2) { await walkTo(A2, 24, 10); await walkTo(A2, 24, 12); face(A2, P); }
  r = await trainerBattle({ x: A2.x, y: A2.y, dir: A2.dir, trainer: AGENT7B }, false);
  if (r !== "win") return;
  bgm("jaedan");
  await say("요원: 이사장님,\n업무 방해가…… 심합니다.");
  if (BD) { face(BD, P); await emote(BD, "dots", 30); }
  await say("변도진: ……흠.\n오늘 설명회는 여기까지 하지요.");
  await say(`변도진: 이름이 뭐지?\f……${G.name}.\n기억해 두지요.`);
  await say("변도진: 서류는 다음에\n다시 가져오겠습니다.\f'모두에게 복을'——\n금박재단이었습니다.");
  sfx("exit"); await fadeOut(10);
  for (const a of [BD, A1, A2]) if (a) a.hidden = true;
  await fadeIn(10);
  bgm("misaek");
  // 지킴이 희주 (마을에서는 안경 없이)
  if (HE) { HE.hidden = false; HE.x = 24; HE.y = 18; await walkTo(HE, 24, 14); face(HE, P); }
  sfx("run");
  await say("???: 하아…… 하아……\n늦었네요.\f설명회, 벌써 끝났어요?");
  await say("목도리를 두른 사람이\n숨을 고르고 있다.");
  await say("???: 아이 어린이집에\n데려다주고 오느라고요.\f……콜록.\n아, 괜찮아요.\f바람이 좀 차서요.");
  if (V1) face(V1, HE);
  await say("할아버지: 희주 선생님!\f리조트를 짓는다고\n제비 둥지를 치운대요!");
  if (HE) await emote(HE, "excl", 24);
  await say("???: ……제비 둥지를요?");
  await say("???: 제비는 봄이면 먼 남쪽에서\n이 마을로 돌아와요.\f옛 둥지를 고쳐서\n다시 쓰는 일도 많대요.");
  await say("???: 돌아왔는데 집이 없으면……\n얼마나 서운하겠어요.");
  if (HE) face(HE, P);
  await say("???: 혹시…… 요원들을\n막아 준 게 이 친구예요?");
  if (V2) await say("꼬마: 응! 남켓몬 배틀로!\n엄청 멋있었어!");
  await say("???: 정말 고마워요.\f인사가 늦었네요.\n미색 배움터 지킴이, 희주예요.\f강철 타입을 맡고 있어요.");
  await say("희주: 남켓몬들이 많이\n지쳤겠네요. 잠깐만요.");
  G.healAll(); await Audio2.jingle("jg_heal"); await say("남켓몬들이 기운을 되찾았다!");
  await say("희주: 그리고 이거, 받아요.");
  await getItem("metalcoat");
  await say("희주: '놋쇠조각'이에요.\f지니고 있으면 강철 기술이\n조금 더 단단해져요.");
  await say("희주: 천천히 와도 괜찮아요.\n미색 배움터에서 기다릴게요.\f강철처럼 단단한 수업으로\n맞이할게요.");
  // 한지 어른의 의심(칠로가 재단 돈의 출처를 의심하기 시작)
  if (HJ) { face(HJ, P); await walkTo(HJ, 22, 12); }
  await say("할아버지: 나는 한지를 뜨는\n늙은이라네.\f사람들은 '한지 어른'이라고\n부르지.");
  await say("한지 어른: 저 이사장 돈이\n어디서 나와 어디로 가는지,\f나도 좀 알아봐야겠구먼.");
  await say("한지 어른: 닥나무는 베어도\n다시 돋는다.\f하지만 밭을 갈아엎으면\n그걸로 끝이지.");
  if (HE) face(HE, P);
  await say("희주: 그럼 저는 배움터에\n가 있을게요.\f……아, 오늘은 아이를 일찍\n데리러 가야 해서, 조금만요!");
  sfx("exit"); await fadeOut(8);
  if (HE) HE.hidden = true;                                          // 설명회 뒤: 희주는 배움터 안(v2.36 chapter27), 한지 어른은 닥나무 밭
  if (HJ) { HJ.x = 6; HJ.y = 37; HJ.dir = "down"; }
  { const K = act("gym7_door_kid"); if (K) K.hidden = true; }
  G.flag("ms_event_done", true);
  if (typeof m7DoorNow === "function") m7DoorNow();   // v2.36 미색 배움터 문(chapter27)
  await fadeIn(8);
  zoneBgm();
}

async function hanjiTalk() {
  await say("한지 어른: 닥나무 껍질을 벗겨\n삶고 두드려서 한지를 뜬단다.\f손이 많이 가지.");
  await say("한지 어른: 재단 돈 말이다……\f우리 칠로가 받던 '후원금'도\n그 재단에서 나왔다는구나.\f……허, 이걸 어쩐다.");
}
// 배움터 앞(v2.36부터 희주는 배움터 안 — chapter27.js)
async function heejuGymTalk() {
  if (!G.flag("ms_event_done")) { await say("배움터 문에 '지킴이 잠깐 외출'이라고\n적혀 있다."); return; }
  await say(`희주: 아, ${G.name}! 와 줬네요.`);
  await say("희주: 배움터 안에서\n기다릴게요.\f천천히 해도 괜찮아요.");
}

// =====================================================================
// 지도에 붙이기
// =====================================================================
(function attachChapter8() {
  const D = MAPDATA;
  if (typeof LOCKS !== "undefined") Object.assign(LOCKS, {
    house2_inwol: "문이 잠겨 있다.\f'국밥집 — 오늘 장사 끝!\n내일 또 오세요'라고 적혀 있다.",
    thatch_ms2: "문이 잠겨 있다.\f'박 타러 갔음 — 금방 와요'\n라고 적혀 있다.",
    gym7_closed: "문이 닫혀 있다.\f'미색 배움터 — 지킴이 잠깐 외출\n(아이 데려다주고 올게요)'",
  });
  // ---- 쑥빛시티 북쪽 → 14번도로 (장단 어사패 뒤 공사 끝) ----
  const SBM = MAPS.ssukbit;
  for (const id of ["sb_worker_n", "sb_worker_n2"]) { const w = SBM.npcs.find(n => n.id === id); if (w) w.show = () => !hasBadge(6); }
  SBM.warps = (SBM.warps || []).concat([32, 33].map(x => [x, 0, ["route14", x - 24, 35, "up", "edge"]]));
  { const s = SBM.signs.find(s => s[0] === 31 && s[1] === 2); if (s) s[2] = "↑ 14번도로\n람천 둑길 · 인월장터 · 미색마을(아영)"; }
  SBM.npcs.push({ id: "sb_n_guide", x: 34, y: 3, spr: "man", dir: "left", move: "look", show: () => hasBadge(6),
    talk: "아저씨: 북쪽 길 공사가 끝났단다!\f람천을 따라 내려가면\n인월장터가 나오지." });

  // ---- 14번도로 ----
  const R14 = D.route14;
  MAPS.route14 = {
    rows: R14.rows, stamps: R14.stamps, name: "14번도로",
    warps: [8, 9].map(x => [x, 35, ["ssukbit", x + 24, 0, "down", "edge"]])
      .concat([13, 14].map(y => [59, y, ["inwol", 0, y, "right", "edge"]])),
    zones: [["14번도로", 0, 0, 59, 35]],
    zinfo: { "14번도로": { bgm: "route", enc: "14번도로", rate: 0.12, bg: "grass" } },
    signs: [[10, 21, "14번도로 · 람천 둑길\n↓ 쑥빛시티 · → 인월장터"], [16, 9, "숯가마\n참나무를 구워 참숯을 만드는 곳"],
      [27, 21, "흑돼지 농장\n울타리 안에 함부로 들어가지 마세요!"], [56, 12, "→ 인월장터\n지리산으로 들어가는 길목의 장터"]],
    checks: [[17, 7, "숯가마 안이 아직 따뜻하다."], [18, 7, "숯가마 안이 아직 따뜻하다."], [19, 7, "숯가마 안이 아직 따뜻하다."]],
    areas: [],
    npcs: [
      { id: "r14_charcoal", x: 21, y: 8, spr: "oldman", dir: "down", move: "look", talk: async () => {
        await say("할아버지: 참나무를 가마에 넣고\n며칠을 구우면 참숯이 된단다.");
        if (!G.flag("r14_charcoal_gift")) { await say("할아버지: 불꽃 남켓몬한테\n하나 쥐여 줘 보렴."); await getItem("charcoal"); G.flag("r14_charcoal_gift", true); return; }
        await say("할아버지: 숯꺼미들이 가마 둘레를\n좋아해. 따뜻하거든."); } },
      { id: "r14_farmer", x: 25, y: 26, spr: "woman", dir: "down", move: "look", talk: "아주머니: 흑돼지는 땀을\n거의 흘리지 못한단다.\f그래서 더운 날엔 진흙에서\n뒹굴며 몸을 식히지." },
      { id: "r14_fisher", x: 30, y: 19, spr: "oldman", dir: "up", move: "look", talk: "낚시꾼: 람천은 동쪽으로 흘러\n인월을 지나간단다.\f더 흘러가면 경남 진주의\n남강이 되지." },
      { item: "maxrevive", x: 5, y: 5 }, { item: "hyperpotion", x: 55, y: 3 }, { item: "revive", x: 44, y: 31 }, { item: "moomoomilk", n: 2, x: 28, y: 29 }, { item: "ok", n: 2, x: 51, y: 25 },
      { x: 20, y: 12, spr: "kid_m", dir: "down", trainer: { id: "r14_ujin", cls: "등산 소년", name: "우진", spr: "kid_m", range: 3, base: 18, team: [["sutkkeomi", 37], ["kalgitmae", 38]],
        intro: "숯가마 구경 왔어?\n그 전에 한 판!", lose: "새카맣게 탔다……", after: "숯은 오래오래\n은근하게 타." } },
      { x: 36, y: 12, spr: "kid_f", dir: "left", trainer: { id: "r14_dain", cls: "꼬마 숙녀", name: "다인", spr: "kid_f", range: 4, base: 16, team: [["jebikko", 37], ["boeunbi", 39]],
        intro: "제비가 낮게 날면\n비가 온대!", lose: "제비가 날아가 버렸네……", after: "보은비는 다리를 고쳐 준\n사람을 안 잊는대." } },
      { x: 50, y: 11, spr: "bugboy", dir: "down", trainer: { id: "r14_hyeonu", cls: "벌레잡이", name: "현우", spr: "bugboy", range: 3, base: 16, team: [["jangsuppul", 39]],
        intro: "람천 둑에도\n장수풍뎅이가 있어!", lose: "뿔이…… 또 휘었다……", after: "벌레는 작아도\n힘이 엄청 세." } },
      { x: 16, y: 27, spr: "kid_m", dir: "right", trainer: { id: "r14_jiho", cls: "꼬마", name: "지호", spr: "kid_m", range: 3, base: 16, team: [["heukdoni", 38], ["bakari", 37]],
        intro: "흑돼지 농장 옆이\n내 자리야!", lose: "꿀꿀……", after: "박알이는 누가 키우느냐에 따라\n다른 박이 된대." } },
      { x: 52, y: 28, spr: "kid_f", dir: "up", trainer: { id: "r14_subin", cls: "꼬마 숙녀", name: "수빈", spr: "kid_f", range: 3, base: 20, team: [["ureureung", 39]],
        intro: "우르릉 쾅!\n천둥 배틀이다!", lose: "번개가 다 빠졌어……", after: "천둥 칠 땐 큰 나무 밑에\n있으면 안 돼." } },
      { x: 38, y: 32, spr: "kid_m", dir: "left", trainer: { id: "r14_minseong", cls: "꼬마", name: "민성", spr: "kid_m", range: 3, base: 16, team: [["dolkongi", 38], ["malgupju", 38]],
        intro: "턱에서 뛰어내렸지?\n여기는 내 비밀 장소야!", lose: "비밀 장소를 들켰다……", after: "다시 올라가려면\n큰길로 돌아가야 해." } },
    ],
  };

  // ---- 인월장터 ----
  const IW = D.inwol;
  MAPS.inwol = {
    rows: IW.rows, stamps: IW.stamps, name: "인월장터",
    warps: [13, 14].map(y => [0, y, ["route14", 59, y, "left", "edge"]])
      .concat([38, 39].map(x => [x, 0, ["misaek", x - 14, 43, "up", "edge"]])),
    zones: [["인월장터", 0, 0, 47, 35]],
    zinfo: { "인월장터": { bgm: "inwol", enc: "인월장터", rate: 0.11, bg: "grass" } },
    signs: [[2, 12, "인월장터\n지리산으로 들어가는 길목의 장터"], [12, 12, "봉인 항아리 특가!\n— 본디회 상회"],
      [32, 15, "람천과 풍천이 만나는 곳\f서쪽 운봉에서 흘러온 람천에\n북쪽에서 내려온 풍천이 더해진다.\f람천은 경남 진주를 흐르는\n남강의 위쪽 물줄기다."],
      [37, 2, "↑ 미색마을(아영)\n흥부 이야기가 전해 오는 마을"], [37, 33, "↓ 15번도로(산내)\n— 공사 중"]],
    checks: [[25, 5, "옹기 항아리가 줄지어 놓여 있다.\f'김장 항아리 팝니다'"], [26, 5, "옹기 항아리가 줄지어 놓여 있다."]],
    areas: [
      { x0: 11, y0: 13, x1: 17, y1: 14, cond: () => !G.flag("bd7_done"), run: bangsam7Event },
      { x0: 26, y0: 13, x1: 29, y1: 14, cond: () => !G.flag("rival7_met"), run: rival7Event },
    ],
    npcs: [
      { id: "iw_bangsam", x: 13, y: 12, spr: "bondi", dir: "down", move: "fixed", show: () => !G.flag("bd7_done") },
      { id: "iw_danji", x: 15, y: 12, spr: "bondi", dir: "down", move: "fixed", show: () => !G.flag("bd7_done") },
      { id: "iw_granny", x: 9, y: 12, spr: "oldwoman", dir: "down", move: "look", talk: () => G.flag("bd7_done")
        ? say("할머니: 그 젊은이들이 두고 간\n항아리에 동치미를 담갔지.\f항아리는 원래\n먹을 걸 익히는 그릇이란다.")
        : say("할머니: 산나물 사 가렴.\n지리산에서 뜯은 거란다.") },
      { id: "iw_hangyeol", x: 33, y: 13, spr: "hangyeol", dir: "left", hidden: true, move: "fixed", show: () => !G.flag("rival7_done") },
      { id: "iw_veg", x: 4, y: 12, spr: "man", dir: "down", move: "look", talk: "아저씨: 인월은 지리산으로 들어가는\n길목이라 예부터 장이 섰단다.\f산에서 나는 것, 들에서 나는 것\n다 여기 모이지." },
      { id: "iw_jar", x: 19, y: 12, spr: "woman", dir: "down", move: "look", talk: "아주머니: 운봉 배추에 아영 감자,\n산내 고사리까지!\f장터에 오면 동네마다 뭐가\n나는지 다 알 수 있어." },
      { id: "iw_fruit", x: 24, y: 12, spr: "oldman", dir: "down", move: "look", talk: async () => {
        if (!G.flag("iw_fruit_gift")) { await say("할아버지: 처음 보는 얼굴이구나.\n장터 인심이다, 받아 가렴."); await getItem("gam", 2); G.flag("iw_fruit_gift", true); return; }
        await say("할아버지: 감은 서리를 맞으면\n더 달아진단다."); } },
      { id: "iw_lane", x: 18, y: 21, spr: "woman", dir: "up", move: "look", talk: "아주머니: 저 국밥집은 장날이면\n줄이 길어.\f오늘은 벌써 다 팔았대!" },
      { id: "iw_kid", x: 22, y: 30, spr: "kid_m", move: "wander", r: 2, talk: "람천 물은 동쪽으로 흘러.\f경상도까지 간대!\n물은 도 경계를 모르나 봐." },
      { id: "iw_bridge", x: 34, y: 10, spr: "oldman", dir: "down", move: "look", talk: "할아버지: 두 물이 만나면\n물이 더 넉넉해지지.\f사람도 그렇단다." },
      { id: "iw_worker_s", x: 38, y: 34, spr: "man", dir: "up", move: "fixed", talk: "미안! 15번도로(산내)는\n아직 공사 중이란다.\f미색마을 일이 정리되면\n길을 열 거야." },
      { id: "iw_worker_s2", x: 39, y: 34, spr: "man", dir: "up", move: "fixed", talk: "미안! 이쪽 길은\n아직 공사 중이란다." },
      { item: "superpotion", n: 2, x: 3, y: 32 }, { item: "nest", n: 2, x: 44, y: 28 },
      { x: 42, y: 30, spr: "kid_f", dir: "left", trainer: { id: "iw_hayul", cls: "꼬마 숙녀", name: "하율", spr: "kid_f", range: 3, base: 16, team: [["jebikko", 38], ["kkumnoru", 38]],
        intro: "장 보러 왔다가\n배틀하러 왔어!", lose: "장바구니 놓고 왔다……", after: "엄마 심부름은\n잊지 말아야지!" } },
      { x: 8, y: 29, spr: "bugboy", dir: "right", trainer: { id: "iw_doyun", cls: "벌레잡이", name: "도윤", spr: "bugboy", range: 3, base: 16, team: [["sutkkeomi", 38], ["heukdoni", 38]],
        intro: "물가에서 잡은\n내 친구들이야!", lose: "다 잡혔다……", after: "벌레잡이도\n가끔은 돼지를 키워." } },
    ],
  };
  MAPS.center_inwol = { ...MAPS.center, exit: exitIW("center_inwol"),
    npcs: [MAPS.center.npcs.find(n => n.id === "nurse"),
      { id: "iwc_hiker", x: 2, y: 6, spr: "man", move: "look", talk: "등산객: 지리산 가기 전에\n여기서 꼭 쉬어 가.\f산에 들어가면 센터가 멀거든." },
      { id: "iwc_gm", x: 11, y: 5, spr: "oldwoman", move: "look", talk: "할머니: 장 보고 나면\n다리가 아파서 여기 들러.\f앉아만 있어도 좀 낫더라고." }] };

  // ---- 미색마을 ----
  const MS = D.misaek;
  MAPS.misaek = {
    rows: MS.rows, stamps: MS.stamps, name: "미색마을",
    warps: [24, 25].map(x => [x, 43, ["inwol", x + 14, 0, "down", "edge"]]),
    zones: [["미색마을", 0, 0, 51, 43]],
    zinfo: { "미색마을": { bgm: "misaek", enc: "미색마을", rate: 0.11, bg: "grass" } },
    signs: [[23, 41, "미색마을\n흥부 이야기가 전해 오는 마을"], [7, 9, "미색 배움터\n지킴이 희주 · 강철 타입"],
      [33, 13, "유곡리와 두락리 고분군\f삼국 시대의 옛 무덤들이\n언덕에 모여 있다.\f2023년 '가야고분군'의 하나로\n유네스코 세계유산이 되었다."],
      [11, 36, "한지 어른의 닥나무 밭\n한지를 뜨는 닥나무를 키운다"], [14, 2, "↑ 16번도로(산동·보절)\n— 공사 중"],
      [20, 18, () => G.flag("ms_event_done") ? "흥부 리조트 주민 설명회\n— 오늘은 끝났습니다(금박재단)" : "흥부 리조트 주민 설명회\n— 금박재단"], [23, 22, "박밭\n흥부네 박이 자라요"]],
    checks: [[21, 6, "금빛 현수막에\n'흥부 리조트'라고 적혀 있다."], [22, 6, "금빛 현수막에\n'흥부 리조트'라고 적혀 있다."], [25, 6, "금빛 현수막이 반짝인다."], [26, 6, "금빛 현수막이 반짝인다."],
      [8, 21, "처마 밑에 제비 둥지가 있다.\f둥지 안에서 새끼 제비가\n노란 입을 쩍 벌리고 있다."]],
    areas: [{ x0: 16, y0: 13, x1: 33, y1: 17, cond: () => !G.flag("ms_event_done"), run: misaekEvent }],
    npcs: [
      { id: "ms_byeon", x: 23, y: 9, spr: "byeon", dir: "down", move: "fixed", show: () => !G.flag("ms_event_done"), talk: () => misaekEvent() },
      { id: "ms_agent1", x: 21, y: 10, spr: "agent", dir: "down", move: "fixed", show: () => !G.flag("ms_event_done") },
      { id: "ms_agent2", x: 26, y: 10, spr: "agent", dir: "down", move: "fixed", show: () => !G.flag("ms_event_done") },
      { id: "ms_hanji", x: 17, y: 11, spr: "hanji", dir: "up", move: "fixed", show: () => !G.flag("ms_event_done"),
        talk: () => G.flag("ms_event_done") ? hanjiTalk() : say("할아버지: ……리조트라.") },
      { id: "ms_heeju", x: 24, y: 18, spr: "heeju", dir: "up", hidden: true, move: "fixed", show: () => !G.flag("ms_event_done"), talk: () => heejuGymTalk() },
      { id: "ms_v_old", x: 20, y: 12, spr: "oldman", dir: "up", move: "look", talk: () => G.flag("ms_event_done")
        ? say("할아버지: 고분 언덕은 마을 사람들이\n대대로 지켜 온 곳이야.\f옛사람들 잠자리 옆에\n주차장이라니, 원.")
        : say("할아버지: 리조트라니……\n무슨 소리를 하려는지 원.") },
      { id: "ms_v_kid", x: 28, y: 12, spr: "kid_f", dir: "up", move: "look", talk: () => G.flag("ms_event_done")
        ? say("제비는 봄에 왔다가\n가을에 남쪽으로 간대.\f돌아올 집은\n꼭 남겨 둬야 해!")
        : say("무대 위 아저씨 지팡이,\n금색이야!") },
      { id: "ms_v_woman", x: 31, y: 11, spr: "woman", dir: "left", move: "look", talk: "아주머니: 아영은 높고 서늘해서\n감자랑 상추가 잘 자라.\f리조트보다 밭이 좋은데……" },
      // 설명회 뒤: 희주는 배움터 안(chapter27.js가 이 자리를 숨김), 한지 어른은 닥나무 밭
      { id: "heeju", x: 6, y: 9, spr: "heeju", dir: "down", move: "fixed", show: () => G.flag("ms_event_done"), talk: heejuGymTalk },
      { id: "gym7_door_kid", x: 6, y: 9, spr: "kid_m", dir: "down", move: "fixed", show: () => !G.flag("ms_event_done"),
        talk: () => say("희주 선생님은 아이 데려다주러\n가셨어.\f마당에서 무슨 설명회를\n한대!") },
      { id: "hanji", x: 6, y: 37, spr: "hanji", dir: "down", move: "look", show: () => G.flag("ms_event_done"), talk: hanjiTalk },
      { id: "ms_gobun", x: 40, y: 12, spr: "student", move: "wander", r: 2, talk: "학생: 이 무덤들은 1,500년도\n넘었대.\f옛날 사람들이 쓰던 그릇이랑\n말 재갈도 나왔대!" },
      { id: "ms_farmer", x: 20, y: 25, spr: "man", dir: "up", move: "look", talk: "아저씨: 박은 덩굴로 자라서\n지붕까지 올라가.\f흥부네 지붕에 박이 열린 것도\n그래서지." },
      { id: "ms_kid2", x: 34, y: 28, spr: "kid_m", move: "wander", r: 2, talk: "흥부는 놀부 형한테 쫓겨났는데도\n나중에 형을 도와줬대.\f나라면…… 음……\n그래도 도와줄래!" },
      { id: "ms_worker_n", x: 12, y: 1, spr: "man", dir: "down", move: "fixed", talk: "미안! 16번도로(산동·보절)는\n아직 공사 중이란다.\f반야봉 쪽 일이 마무리되면\n길을 열 거야." },
      { id: "ms_worker_n2", x: 13, y: 1, spr: "man", dir: "down", move: "fixed", talk: "미안! 이쪽 길은\n아직 공사 중이란다." },
      { item: "fullrestore", x: 47, y: 2 }, { item: "superrepel", x: 12, y: 40 }, { item: "ok", n: 3, x: 31, y: 39 },
      { x: 10, y: 15, spr: "kid_f", dir: "right", trainer: { id: "ms_yerin", cls: "꼬마 숙녀", name: "예린", spr: "kid_f", range: 3, base: 16, team: [["bakari", 39], ["boeunbi", 40]],
        intro: "박알이랑 보은비는\n원래 짝꿍이야!", lose: "박이 데굴데굴……", after: "제비가 박씨를 물어 왔으니까\n둘은 친구지!" } },
      { x: 31, y: 34, spr: "kid_m", dir: "left", trainer: { id: "ms_jun", cls: "꼬마", name: "준", spr: "kid_m", range: 3, base: 16, team: [["kalgitmae", 40]],
        intro: "칼깃매의 날개는\n칼처럼 날카로워!", lose: "날개를 접었다……", after: "칼깃매는 나뭇가지 사이도\n잘 빠져나가." } },
      { x: 44, y: 34, spr: "bugboy", dir: "up", trainer: { id: "ms_seojun", cls: "벌레잡이", name: "서준", spr: "bugboy", range: 3, base: 16, team: [["kkumnoru", 39], ["ureureung", 40]],
        intro: "아영 들판은\n내 사냥터야!", lose: "졸리다……", after: "꿈노루는 저녁에\n들판에 나와." } },
    ],
  };
  MAPS.center_misaek = { ...MAPS.center, exit: exitMS("center_misaek"),
    npcs: [MAPS.center.npcs.find(n => n.id === "nurse"),
      { id: "msc_man", x: 2, y: 6, spr: "man", move: "look", talk: "미색 배움터는 강철 타입이래.\f불꽃·격투·땅 남켓몬을\n키워 두면 좋을 거야!" },
      { id: "msc_gm", x: 11, y: 5, spr: "oldwoman", move: "look", talk: "할머니: 희주 선생님은\n늘 바쁘신데도\f마주치면 꼭 먼저\n인사해 주신단다." }] };
  MAPS.mart_misaek = { ...MAPS.mart, name: "미색 만물상", exit: exitMS("mart_misaek"),
    npcs: [MAPS.mart.npcs.find(n => n.id === "clerk"), MAPS.mart.npcs.find(n => n.id === "clerk2"),
      { id: "msm_kid", x: 7, y: 6, spr: "kid_f", move: "look", talk: "제비꼬는 노란 입을\n쩍 벌리고 밥 달라고 해.\f꼭 내 동생 같아!" }] };
  MAPS.heungbu = { rows: D.house_a.rows, stamps: D.house_a.stamps, indoor: true, name: "흥부네 초가", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "misaek", noPopup: true, exit: exitMS("heungbu"),
    checks: [[0, 1, "선반 위에 반으로 가른\n박 바가지가 놓여 있다."], [1, 1, "선반 위에 반으로 가른\n박 바가지가 놓여 있다."], [6, 2, "병풍에 제비와 박이\n그려져 있다."], [7, 2, "병풍에 제비와 박이\n그려져 있다."]],
    npcs: [{ id: "hb_gp", x: 2, y: 4, spr: "oldman", move: "look", talk: async () => {
      if (!G.flag("hb_gift")) {
        await say("할아버지: 흥부가 태어난 곳은 인월,\n부자가 되어 산 곳은 여기 아영이라고\f전해진단다.");
        await say("할아버지: 박씨를 주고 싶다만……\n오늘은 볍씨뿐이구나.");
        await getItem("miracleseed"); G.flag("hb_gift", true); return; }
      await say("할아버지: 흥부는 다친 제비 다리를\n고쳐 주었지.\f갚으라고 한 일이 아니었는데\n제비는 잊지 않았단다."); } }] };
  MAPS.house_ms = { rows: D.house_b.rows, stamps: D.house_b.stamps, indoor: true, name: "초가", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "misaek", noPopup: true, exit: exitMS("house_ms"),
    npcs: [{ id: "hms_woman", x: 6, y: 4, spr: "woman", dir: "down", move: "look", talk: "아주머니: 해마다 봄이면\n제비가 우리 처마로 돌아와.\f올해도 둥지를 고치고\n새끼를 다섯이나 키웠지." },
      { id: "hms_kid", x: 3, y: 6, spr: "kid_f", dir: "up", move: "look", talk: "제비 둥지 밑에 신문지를\n깔아 두면 돼!\f똥이 떨어져도 괜찮아!" }] };

  Object.assign(TOWN_ZONE, { "14번도로": "r14", "인월장터": "inwol", "미색마을": "misaek", "흥부네 초가": "misaek", "초가": "misaek", "미색 만물상": "misaek" });
})();
