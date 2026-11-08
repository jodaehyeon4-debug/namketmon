// ===== v2.31 여덟째 장: 조박사 귀환 · 갈매 배움터(밤의 교실 · 8관장 조박사 · 악) · 갈매 어사패 · 조박사의 정체(암행) · 교장 선생님의 봉서 =====
// 방향성 v1(확정): 여덟째 갈매 어사패 → 조박사가 암행어사임을 밝힘 → 교장 선생님이 봉서를 맡김 → 암행어사 출두(v2.32) → 오방고원 리그 → 챔피언 = 본편 엔딩
//   역할: 조박사 = 신분을 숨긴 조사(증거 모으기 — 얼굴이 알려져 앞에 나설 수 없음) · 교장 선생님 = 봉서를 맡길 사람을 고름 · 주인공 = 남켓몬과 맺은 관계, 마을들의 믿음(어사패)
// 들어가는 때: 반야봉 1차 뒤 + 어사패 일곱(v2.36 미색 배움터가 열려 GYM7_READY — 그 전에는 여섯이었음, 미결정 D19 되돌림)
// 배움터 기믹(실제 포켓몬처럼 '불 꺼진 체육관을 등불로 밝히기' + 숨은 트레이너 — 구조만): 내 손 초롱 둘레만 보이고, 칸마다 청사초롱 둘을 켜면 그 칸이 환해짐.
//   칸마다 조박사의 암행 수업 교구(유척 → 사목 → 마패)가 숨어 반짝이고(빛이 닿아야 보임), 교구 + 칠판 수업이면 미닫이 창호문이 열림
// 사실(확인된 일반 역사 지식): 암행어사는 임금에게 봉서·사목·마패·유척을 받음 / 봉서 겉봉에는 도성 문 밖에서 열어 보라고 적음 /
//   사목 = 할 일·규칙을 적은 책 / 마패 = 새겨진 말의 수만큼 역에서 말을 빌림, 출두 때 신분을 밝힘 / 유척 = 놋쇠 자, 고을의 자·되가 바른지 잼
//   덕과(1919년 봄 나무 심는 날 만세 — chapter21 마을회관과 같은 말) / 삵(생태도감 eco151: 주로 밤, 쥐를 가장 많이 잡아먹음, 멸종위기 2급)
// 말버릇은 사용자가 준 둘만: "음 그건 안 돼." · "얘들아 선생님 좀 도와줄 사람~?"  교장 선생님 말버릇(D12)은 넣지 않음(톤만: 스포츠맨·중후)
// explore_v230.js 뒤, pad.js 앞에 읽힘(relayout.js 뒤라 여기 자리는 옮겨지지 않음)
"use strict";

// ---- 물건 ----
if (MV.darkpulse && !ITEMS.tm79) ITEMS.tm79 = { n: "기술머신79", p: "tm", price: 3000, nobuy: 1, tm: "darkpulse", ic: "tm",
  d: "악의파동을 가르쳐요. 검은 파동을 쏘아 공격하고 가끔 상대를 풀죽게 하는 악 타입 기술이에요.",
  tmTypes: ["악", "고스트", "에스퍼", "드래곤", "노말", "독"] };
ITEMS.ledger = { n: "공사 장부", p: "key", ic: "ledger",
  d: "조박사가 암행으로 찾아낸 금박재단 공사 장부. 허가 없이 섬진강을 메운 날짜와 사들인 땅이 적혀 있어요." };   // v2.37 세 줄에 맞춤
ITEMS.mapae = { n: "마패", p: "key", ic: "mapae",
  d: "말이 새겨진 둥근 구리 패. 옛 암행어사는 그 수만큼 역에서 말을 빌리고, 출두할 때 마패를 들어 보였대요." };   // v2.37 세 줄에 맞춤
ITEMS.bongseo = { n: "봉서", p: "key", ic: "bongseo",
  d: "교장 선생님이 맡긴 한지 봉투예요. 붉은 봉인 옆에 '만복사 앞에서 열어 보라'고 적혀 있어요." };

const gym8Open = () => G.flag("jb_back");
const jbCanReturn = () => G.flag("banya_event_done") && hasBadge(window.GYM7_READY ? 7 : 6) && !G.flag("jb_back");

// ---- 갈매 배움터 문(바깥 도장 gym8에 문 칸이 없던 것) — 타일셋을 읽은 뒤 문 자리(3,5)를 열어 둠 ----
const _tsInit231 = tsInit;
tsInit = function () {
  _tsInit231();
  const S = TSET.out && TSET.out.js && TSET.out.js.stamp.gym8;
  if (S && !S.door) { S.door = [3, 5]; if (S.solid && S.solid[5]) S.solid[5][3] = 0; }
};

// =====================================================================
// 1. 갈매 배움터 — 밤의 교실
// =====================================================================
const G8 = { cv: null };
const g8D = () => MAPDATA.gym8.dev;
const g8lit = (z, j) => G.flag(`g8L${z}_${j}`);
const g8zoneLit = z => z === 3 || (z >= 0 && [0, 1].every(j => g8lit(z, j)));
const g8zoneOf = y => g8D().zone.findIndex(([a, b]) => y >= a && y <= b);

// 칸마다 숨은 수업 교구
const G8TOOL = [
  { n: "유척", find: "서랍 속에서 무언가 반짝인다!\f놋쇠로 만든 자, '유척' 모형이다.\n조박사님의 수업 교구 같다." },
  { n: "사목", find: "책상 서랍 속에서 무언가 반짝인다!\f표지에 '사목'이라고 적힌\n작은 책이다. 조박사님의 수업 교구다." },
  { n: "마패", find: "궤짝 속에서 무언가 반짝인다!\f말이 여러 마리 새겨진\n둥근 구리 패 '마패' 모형이다." },
];
const G8SPOT = {
  책상: ["책상 서랍엔 공책과\n몽당연필뿐이다.", "서랍 속에 '조박사님 최고!'라고\n적힌 쪽지가 있다.", "서랍 속에 구슬 하나가\n굴러다닌다.", "서랍이 텅 비어 있다."],
  사물함: ["사물함 속엔 실내화가\n가지런히 놓여 있다."],
  책장: ["'우리 고장 덕과' 책이\n꽂혀 있다.", "'남원 생태도감' 책이\n빼곡히 꽂혀 있다."],
  궤짝: ["궤짝 속엔 체육복이\n개켜져 있다."],
  항아리: ["빈 항아리다.\f'우웅~' 하고 소리가 울린다."],
};

// 수업 셋(문을 여는 수업) — 확인된 사실만
const QUIZ8 = [
  { board: "칠판: '오늘 있었던 일'\f반야봉 꼭대기에서 행수 여울은\n본디회에 등을 돌렸어요.",
    q: "여울이 섬진강으로 돌아가며\n꼭 찾겠다고 한 것은?", opts: ["그 공사 장부", "잃어버린 삿갓", "두꺼비 바위"], a: 0, gift: "revive",
    good: "금박재단 공사가 이상하다고 느낀\n여울은 증거를 찾기로 했대.\f말보다 증거를 차근차근 모으는 것,\n그게 '암행'의 첫걸음이래!" },
  { board: "칠판: '남원 생태도감'\f덤불 속 밤의 사냥꾼 삵(살쾡이)은\n우리나라의 마지막 야생 고양이 맹수예요.",
    q: "삵이 가장 많이\n잡아먹는 먹이는?", opts: ["쥐", "도토리", "나뭇잎"], a: 0, gift: "fullheal",
    good: "삵은 주로 밤에 혼자 다니며\n쥐를 가장 많이 잡아먹어요.\f사는 곳이 줄고 찻길 사고가 잦아\n지금은 보호하고 있대요." },
  { board: "칠판: '타입 상성'\f갈매 배움터는\n악 타입 배움터예요.",
    q: "악 타입에게 효과가\n굉장한 기술 타입 셋은?", opts: ["격투·벌레·페어리", "에스퍼·고스트·악", "불꽃·물·풀"], a: 0, gift: "blackbelt",
    good: "악 타입은 격투·벌레·페어리에 약해!\f에스퍼 기술은 아예 안 통하고,\n고스트·악 기술도 잘 버텨." },
];
// 새 문제(교구 셋 이야기, 맞히면 처음 한 번 선물)
const G8X = [
  { q: "놋쇠 자 '유척'으로\n암행어사가 잰 것은?", opts: ["고을의 자·되가 바른지", "산의 높이", "강물의 깊이"], a: 0, gift: "hyperpotion",
    good: "고을에서 곡식 되나 자를 속이면\n백성이 손해를 보잖아요.\f그래서 암행어사는 유척으로\n바른지 쟀대요." },
  { q: "암행어사가 받은 책 '사목'에는\n무엇이 적혀 있었을까?", opts: ["할 일과 지킬 규칙", "맛있는 요리법", "남켓몬 이름"], a: 0, gift: "hyperpotion",
    good: "사목에는 암행어사가 할 일과\n지켜야 할 규칙이 적혀 있었어요.\f몰래 다녀도 규칙은\n꼭 지켜야 했대요." },
  { q: "마패에 새겨진 말의 수는\n무엇을 뜻할까?", opts: ["역에서 빌릴 수 있는 말의 수", "어사의 나이", "다녀간 고을의 수"], a: 0, gift: "hyperpotion",
    good: "말이 세 마리 새겨져 있으면\n역에서 말 세 마리를 빌렸대요.\f출두할 때는 마패를 들어\n어사라는 걸 알렸지요." },
];

// 갈매반 짝꿍(칸마다 힌트 · 수업 뒤 연습 배틀)
const GYM8_KIDS = [
  { id: "g8k1", n: 1, spr: "kid_m",
    hint: "은찬: 교실이 깜깜하지?\f청사초롱에 불을 켜면\n둘레가 환해져.\f둘 다 켜면\n이 칸이 다 보여!\f조박사님 교구는 빛이 닿으면\n반짝반짝 빛나.\f칠판 문제는 반야봉 이야기래.\n여울 누나가 뭘 찾는다고 했더라?",
    after: "은찬: 깜깜해도 무섭지 않았어.\n초롱이 있으니까!",
    tr: { id: "gym8_eunchan", cls: "갈매반 짝꿍", name: "은찬", spr: "kid_m", base: 20, team: [["neogulmi", 41]],
      intro: "은찬: 불 끄고 하는 배틀,\n해 볼래?", lose: "은찬: 눈앞이 캄캄……" } },
  { id: "g8k2", n: 2, spr: "kid_f",
    hint: "보미: 이 칸 교구는 '사목'이래.\n작은 책이야.\f책이라고 꼭 책장에만\n있는 건 아니야!\f칠판 문제는 삵 이야기.\n밤에 들쥐가 제일 무서워한대.",
    after: "보미: 삵은 숨소리도 없이 다가가.\n……나도 몰래 연습해서 놀래 줄 거야!",
    tr: { id: "gym8_bomi", cls: "갈매반 짝꿍", name: "보미", spr: "kid_f", base: 20, team: [["salkwaengmi", 41], ["malgupju", 41]],
      intro: "보미: 살금살금……\n찾았다! 배틀이야!", lose: "보미: 들켜 버렸네……" } },
  { id: "g8k3", n: 3, spr: "student",
    hint: "다율: 마지막은 '마패'!\f진짜 마패는 조박사님이\n갖고 계신대. 여긴 모형이야.\f무겁고 귀한 건\n궤짝에 넣어 두잖아?\f상성 문제는…… 악 타입이\n무서워하는 건 주먹, 벌레, 요정!",
    after: "다율: 조박사님은\n'음 그건 안 돼' 하시면서도\f결국 다 도와주셔.",
    tr: { id: "gym8_dayul", cls: "갈매반 짝꿍", name: "다율", spr: "student", base: 20, team: [["takrankkuk", 42], ["dochaedong", 42]],
      intro: "다율: 선생님 앞 마지막 짝꿍,\n나야!", lose: "다율: 선생님한테\n이른다~ ……농담!" } },
];
// 체육관 트레이너(시선 배틀) — 어둠 속에 서 있어 가까이 가야 보임
const G8TR = { cls: "갈매반 친구", L: [
  ["seonu", "선우", "kid_m", [["neogulmi", 43], ["salkwaengmi", 43]], "불 꺼진 교실은\n내 놀이터야!", "불 좀 켜 줘……!", "초롱 두 개를 다 켜면\n그 칸이 환해져!"],
  ["yunseo", "윤서", "kid_f", [["malgupju", 44]], "어둠 속에서\n날 찾아냈구나!", "들켰다~", "책상 서랍도\n꼼꼼히 살펴봐!"],
  ["geonho", "건호", "student", [["takrankkuk", 44], ["bangmangdochae", 44]], "암행어사는 몰래 살핀대.\n나도 몰래 기다렸지!", "몰래 진 건 아니야……", "'사목'은 암행어사가 지킬\n규칙을 적은 책이래."],
  ["chaea", "채아", "kid_f", [["gujeongwang", 45], ["salkwaengbeom", 45]], "선생님 앞 마지막 관문!\n쉽게는 못 지나가!", "선생님, 저 졌어요~", "조박사님 첫 남켓몬은\n상대 모습으로 둔갑해!"]] };
const G8TR_HEART = ["어두울수록 작은 불빛이\n더 잘 보이더라.", null, null, "조박사님은 우리가 틀려도\n'괜찮아, 다시!' 하셔.\f그래서 우리 반은\n틀리는 걸 안 무서워해."];

// ---- 지킴이 조박사 ----
// bal_gym(셋, 상처약 2, 짝 = 14·16번도로·뱀사골에서 잡히는 남켓몬 열 가지 중 둘): 처음 안(관장 문서 47–50, 흑담 달빛·대추)은 셋 Lv47 0–25%
//   → 희주 배움터(D13)를 건너오는 레벨에 맞춰 42–45로 낮춤: Lv47 풀 77·불꽃 43·물 63%, Lv49 67–70%
//   (불꽃 청사롱은 불꽃·에스퍼라 악에 약함 = 상성 수수께끼, 힌트 셋으로 격투·벌레·페어리 안내. 물은 시험 도구에서 진화 전)
const JOBAKSA8 = { id: "leader_jobaksa", cls: "지킴이", name: "조박사", spr: "gl_jobaksa2", type: "악", indoor: true, bg: "indoor", base: 120, music: "eyes", bgm: "battle_gym",
  intro: "조박사: 깜깜한 교실, 잘 헤쳐 왔네!\f유척, 사목, 마패……\n오늘 교구는 다 찾았지?\f자, 마지막 수업이다.\n봐 달라고? 음 그건 안 돼!\f약속했잖아.\n제대로 붙는 거야!",
  lose: "조박사: ……와.\n선생님이 졌다.\f처음 볼을 고르던 날이\n엊그제 같은데.",
  // v2.56 레벨 다시 맞춤: 다섯(54·54·55·55·58, 도채동은 최종 진화 방망도채로) · 실력자 AI(깊이 3) · 경옥고 1개 · 타고난 힘 26
  iv: 26, items: ["hyperpotion"], smart: 3,   // 마지막 지킴이: "봐 달라고? 음 그건 안 돼!" — 산지기처럼 다 씀
  team: [["dungabi", 54, { ab: "imposter", mv: ["transform"] }],
         ["bangmangdochae", 54, { mv: ["shadowball", "darkpulse", "confuseray", "swordsdance"] }],
         ["salkwaengbeom", 55, { mv: ["brickbreak", "crunch", "taunt", "leer"] }],
         ["ssogalbeom", 55, { mv: ["aquacutter", "crunch", "scaryface", "leer"] }],
         ["heukdam", 58, { mv: ["darkpulse", "rockslide", "snarl", "harden"], item: "mogwa" }]] };
const JB_HINT = [
  "조박사: 다시 왔네! 좋아, 그래야지.\f악 타입은 격투·벌레·페어리에 약해.\n에스퍼 기술은 아예 안 통하고.",
  "조박사: 첫 번째 둔갑이는\n네 남켓몬 모습으로 둔갑해.\f똑같은 둘이 붙으면?\n……먼저 움직이는 쪽이 유리하겠지?",
  "조박사: 마지막 흑담은 악·바위야.\f격투가 아주 잘 들고\n물·풀·땅·강철·페어리도 잘 들어.\f모과를 지녔고, 선생님도 경옥고를\n하나 챙겼다. 한 번에 몰아붙여 봐!",
];
async function jobaksaTalk(a) {
  if (hasBadge(8)) {
    if (!G.flag("jb_reveal")) { await jbReveal(a); return; }
    if (!G.flag("bongseo_got")) { await say("조박사: 교장 선생님이 덕과 아카데미\n교실에서 기다리셔.\f……아, 이 얘기는 아직 비밀!\n한결이한테도!"); return; }
    await say("조박사: 만복사 가기 전에\n남켓몬들 꼭 쉬게 해 주고!\f밤길이니까\n발밑 조심하고.");
    await say("조박사: 어두울 땐 불을 하나씩 켜면 돼.\n한꺼번에 다 밝힐 필요는 없어.\f하나 켜면, 옆 사람이\n하나 더 켜 주거든.");
    return;
  }
  const lost = G.flags.jb_lost || 0;
  if (!lost) await say(`조박사: 왔구나, ${G.name}!\f선생님 배움터, 깜깜해서\n좀 무서웠지?`);
  else await say(JB_HINT[Math.min(lost, JB_HINT.length) - 1]);
  const r = await trainerBattle({ x: a.x, y: a.y, dir: a.dir, trainer: JOBAKSA8 }, false);
  if (r !== "win") { G.flags.jb_lost = lost + 1; return; }
  bgm("gym8");
  await say("조박사: 이건 갈매 배움터의\n'갈매 어사패'야.");
  await getBadge(8, "조박사");
  G.flag("badge8", true);
  await say("조박사: 어사패마다 새겨진 말이\n한 마리씩 늘어난 거 알았어?\f갈매 어사패에는 여덟 마리.\n……꼭 마패 같지?");
  await say("조박사: 그리고 이거.");
  await getItem("tm79");
  await say("조박사: 기술머신79 '악의파동'.\f어둠은 무서운 게 아니야.\n잘 쓰면 숨은 걸 비춰 보는 힘이 돼.");
  await say("조박사: 덕과는 1919년 봄,\n나무 심는 날 모인 사람들이\f다 같이 '대한 독립 만세'를\n외친 곳이야.\f한 사람 목소리는 작아도\n모이면 큰 소리가 되지.");
  await say("조박사: 갈매마을의 부탁은 하나야.\f혼자 다 하려고 하지 마.\n도와 달라고 말하는 것도 실력이야.");
  await emote(a, "heart", 30);
  await jbReveal(a);
}
// ---- 조박사의 정체: 출장 = 암행 ----
async function jbReveal(a) {
  const P = World.player;
  await say("조박사: ……자, 이제 수업 정리 시간.");
  await say("조박사: 오늘 찾은 교구 셋.\n유척, 사목, 마패.");
  for (let t = 0; ; t++) {
    const v = await quizAsk("이 셋을 지니고 다닌\n사람은 누구일까?", ["암행어사", "고을 사또", "장사꾼"]);
    if (v === 0) break;
    await say(t === 0 ? "조박사: 음 그건 안 돼~\f힌트! 춘향전에서 이몽룡이\n남원에 돌아올 때 무엇이 되어 왔지?" : "조박사: 거지 차림으로 숨어 있다가\n'출두요!' 하고 나타난 사람!");
  }
  await Audio2.jingle("jg_levelup");
  await say("조박사: 딩동댕! 암행어사.\f임금의 명을 받고\n몰래 고을을 살피던 사람이지.");
  await say("조박사: ……그리고.");
  if (a) face(a, P);
  bgm("ojakgyo");
  await say("조박사가 품에서 둥근 구리 패를\n꺼냈다.\f모형이 아니다.\n오래 쓴 듯 반들반들 닳아 있다.");
  await say("조박사: 선생님 '출장'은……\n암행이었어.");
  await say("조박사: 금박재단이 섬진강을\n몰래 메우고,\f서류로만 마을 땅을\n사들이는 걸 쭉 살피고 있었거든.");
  await say("조박사: 그리고 찾았지.\n여울이가 찾던 그 장부.");
  await getItem("ledger");
  await say("조박사: 그런데 선생님은 이제\n앞에 나설 수가 없어.\f재단 사람들이 선생님 얼굴을\n알아 버렸거든.\f선생님이 나서면 그 사람들은\n증거를 몽땅 숨길 거야.");
  await say("조박사: 그래서 말인데……");
  await say("조박사: 얘들아, 선생님 좀 도와줄 사람~?");
  await frames(30);
  if (a) await emote(a, "excl", 24);
  await say(`조박사: ……${G.name}, 방금 눈 마주쳤다.\n너로 정했어!`);
  await say("조박사: 혼자 하라는 거 아니야.\f네가 모은 어사패는\n마을들이 너를 믿는다는 표시야.\f그 믿음이면 충분해.");
  await say("조박사: 이건 선생님 마패야.\n잠깐 맡아 줘.");
  await getItem("mapae");
  await say("조박사: 교장 선생님이 덕과 아카데미\n교실에서 기다리셔.\f……아, 이 얘기는 아직 비밀!\n한결이한테도!");
  G.flag("jb_reveal", true);
  bgm("gym8");
}

// ---- 칠판·교구·초롱·문 ----
async function g8gate(z) {
  const n = z + 1;
  if (G.flag("g8g" + n) || !G.flag("g8e" + n) || !G.flag("g8q" + n)) return false;
  G.flag("g8g" + n, true);
  await gymOpenGate("gym8_g" + n, "미닫이 창호문이\n드르륵 열렸다!");
  return true;
}
async function g8Lesson(z) {
  const Q = QUIZ8[z], F = "g8q" + (z + 1);
  if (G.flag(F)) { await say("칠판 구석에 '참 잘했어요!'\n도장이 꾹 찍혀 있다."); return; }
  await say(Q.board);
  const v = await quizAsk(Q.q, Q.opts);
  if (v < 0) { await say("(조금 더 생각해 보고\n다시 풀어 보자.)"); return; }
  if (v !== Q.a) { sfx("flee_fail"); await say(`땡! 아쉽다~\f괜찮아, 틀리면서 배우는 거야.\n짝꿍 ${GYM8_KIDS[z].tr.name}에게 힌트를 들어 볼까?`); return; }
  await g7Right(Q);
  await say("정답 선물이야!"); await getItem(Q.gift);
  G.flag(F, true);
  if (!(await g8gate(z))) await say("이제 이 칸 어딘가에 숨은\n수업 교구를 찾아보자!");
}
async function g8Extra(z) {
  const Q = G8X[z], F = "g8x" + (z + 1);
  await say(`칠판: '${G8TOOL[z].n} 이야기'`);
  const v = await quizAsk(Q.q, Q.opts);
  if (v < 0) { await say("(조금 더 생각해 보고\n다시 풀어 보자.)"); return; }
  if (v !== Q.a) { sfx("flee_fail"); await say(`땡! 정답은 '${Q.opts[Q.a]}'예요.`); await say(Q.good); return; }
  await g7Right(Q);
  if (!G.flag(F)) { G.flag(F, true); await say("새 문제를 맞힌 선물!"); await getItem(Q.gift); }
}
async function g8Board(i) {
  const L = g8D().lesson.indexOf(i);
  if (L >= 0) return g8Lesson(L);
  return g8Extra((i - 1) / 2);
}
async function g8Spot(z, sp) {
  const [x, y, nm, real] = sp, F = "g8e" + (z + 1);
  if (real && !G.flag(F)) {
    sfx("chime");
    await say(G8TOOL[z].find);
    G.flag(F, true);
    if (!(await g8gate(z))) await say("칠판 수업을 마치면\n미닫이 문이 열린다.");
    return;
  }
  if (real) { await say(`${G8TOOL[z].n} 모형을 찾았던 자리다.`); return; }
  const L = G8SPOT[nm] || ["별다른 것은 없다."];
  await say(L[(x * 3 + y) % L.length]);
}
async function g8Lantern(z, j) {
  if (g8lit(z, j)) { await say("청사초롱이 따뜻하게\n빛나고 있다."); return; }
  await say("청사초롱이다.\f심지에 불을 붙일 수 있을 것 같다.");
  if (!(await yes("초롱에 불을 켤까요?"))) return;
  G.flag(`g8L${z}_${j}`, true); sfx("cast");
  if (g8zoneLit(z)) { await Audio2.jingle("jg_levelup"); await say("두 초롱이 함께 빛나자\n이 칸이 환하게 밝아졌다!"); }
  else await say("초롱에 불이 켜졌다!\f둘레가 따뜻하게 밝아졌다.");
}
async function g8GateTalk(z) {
  const n = z + 1, e = G.flag("g8e" + n), q = G.flag("g8q" + n);
  if (e && q) { await g8gate(z); return; }
  if (e) { await say("미닫이 창호문이 닫혀 있다.\f교구는 찾았다.\n칠판 수업을 마치면 열린다."); return; }
  if (q) { await say("미닫이 창호문이 닫혀 있다.\f칠판 수업은 마쳤다.\n이 칸 어딘가에 숨은 교구를 찾자."); return; }
  await say("미닫이 창호문이 닫혀 있다.\f'이 칸의 수업 교구를 찾고\n칠판 수업을 마치면 열립니다.'");
}
async function gym8GuideTalk() {
  if (hasBadge(8)) {
    if (!G.flag("guide8_gift")) { await say("도우미: 갈매 어사패, 축하해요!\f조박사님이 오늘 도전자는\n'깜깜해도 서두르지 않았다'고 하셨어요.\f……이건 제 선물이에요."); await getItem("moomoomilk", 2); G.flag("guide8_gift", true); return; }
    await say("도우미: 깜깜한 데서 길을 찾는 법?\n아는 데부터 하나씩 밝히는 거래요."); return;
  }
  await say("도우미: 어서 와요, 도전자님!\n여기는 갈매 배움터, 밤의 교실이에요.\f조박사님이 불을 다 꺼 두셨어요.\n오늘 수업 주제가 '암행'이래요.\f칸마다 청사초롱이 둘 있어요.\n불을 켜면 둘레가 밝아지고,\f둘 다 켜면 그 칸이 환해져요.\f칸마다 조박사님의 수업 교구가\n하나씩 숨어 있어요.\f빛이 닿으면 반짝이니까\n책상이며 궤짝을 잘 살펴봐요!\f교구를 찾고 칠판 수업을 마치면\n미닫이 문이 열린답니다.");
}

// ---- 어둠 그리기 ----
function g8Dark(cx, cy) {
  const D = g8D(), P = World.player;
  if (hasBadge(8)) return;                                        // 어사패 뒤에는 조박사가 불을 켜 둠
  if (!G8.cv) { G8.cv = document.createElement("canvas"); G8.cv.width = SW * DPR; G8.cv.height = SH * DPR; }
  const x = G8.cv.getContext("2d");
  x.setTransform(DPR, 0, 0, DPR, 0, 0);
  x.globalCompositeOperation = "source-over"; x.clearRect(0, 0, SW, SH);
  x.fillStyle = "rgba(6,8,22,0.95)"; x.fillRect(0, 0, SW, SH);
  x.globalCompositeOperation = "destination-out";
  const light = (px, py, r, k = 1) => { const gr = x.createRadialGradient(px, py, r * 0.3, px, py, r); gr.addColorStop(0, `rgba(0,0,0,${k})`); gr.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = gr; x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill(); };
  x.fillStyle = "#000";
  D.zone.forEach(([y0, y1], z) => { if (g8zoneLit(z)) x.fillRect(0, (y0 - (z === 3 ? 2 : 0)) * TS - cy - 4, SW, (y1 - y0 + 1 + (z === 3 ? 2 : 0)) * TS + 8); });
  light(P.px + 8 - cx, P.py + 6 - cy, 40);
  light(7 * TS + 8 - cx, 20 * TS - cy, 30, 0.7);                 // 들어온 문 쪽 바깥 빛
  D.lanterns.forEach((L, z) => L.forEach(([lx, ly], j) => { if (g8lit(z, j)) light(lx * TS + 8 - cx, ly * TS - cy, 60); }));
  g.drawImage(G8.cv, 0, 0, SW, SH);
  // 켜진 초롱의 따뜻한 빛
  g.save(); g.globalCompositeOperation = "lighter";
  D.lanterns.forEach((L, z) => L.forEach(([lx, ly], j) => { if (!g8lit(z, j)) return;
    const px = lx * TS + 8 - cx, py = ly * TS - 4 - cy, f = 0.12 + 0.03 * Math.sin(FRAME / 9 + lx);
    const gr = g.createRadialGradient(px, py, 2, px, py, 26); gr.addColorStop(0, `rgba(255,170,90,${f + 0.1})`); gr.addColorStop(1, "rgba(255,120,60,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(px, py, 26, 0, Math.PI * 2); g.fill(); }));
  g.restore();
}
function g8Under(cx, cy) {                // 숨은 교구의 반짝임(어둠 아래에 그려서 빛이 닿아야 보임)
  const D = g8D();
  D.spots.forEach((S, z) => {
    if (G.flag("g8e" + (z + 1))) return;
    const sp = S.find(s => s[3]); if (!sp) return;
    const px = sp[0] * TS - cx, py = sp[1] * TS - cy, t = (FRAME >> 3) % 4;
    const c = ["#fff8c0", "#ffe070", "#ffffff", "#ffe070"][t];
    rect(px + 7, py + 2 + (t & 1), 2, 6, c); rect(px + 5, py + 4 + (t & 1), 6, 2, c);
    if (t === 2) { rect(px + 12, py + 9, 1, 1, "#fff"); rect(px + 3, py + 10, 1, 1, "#fff"); }
  });
}
function g8drawLantern(z, j) {
  return (px, py) => { const T = TSET.in.js.t, on = g8lit(z, j);
    tileAt(TSET.in, on ? T.chorong_on_t : T.chorong_off_t, px, py - TS); tileAt(TSET.in, on ? T.chorong_on_b : T.chorong_off_b, px, py); };
}
// 여러 칸 도장(사물함·책장·궤짝)의 모든 칸을 같은 자리로
function g8SpotCells() {
  const D = g8D(), ST = JSN.tiles_in ? JSN.tiles_in.stamp : null, out = [], seen = new Set();
  D.spots.forEach((S, z) => S.forEach(sp => {
    const st = MAPDATA.gym8.stamps.find(s => { const W = ST && ST[s[0]]; if (!W) return s[1] === sp[0] && s[2] === sp[1];
      return sp[0] >= s[1] && sp[0] < s[1] + W.w && sp[1] >= s[2] && sp[1] < s[2] + W.h; });
    const cells = [];
    if (st && ST && ST[st[0]]) { const W = ST[st[0]]; for (let j = 0; j < W.h; j++) for (let i = 0; i < W.w; i++) cells.push([st[1] + i, st[2] + j]); }
    else cells.push([sp[0], sp[1]]);
    for (const [x, y] of cells) { const k = x + "," + y; if (seen.has(k)) continue; seen.add(k); out.push([x, y, () => g8Spot(z, sp)]); }
  }));
  return out;
}

(function setupGym8() {
  const D = g8D();
  const kids = GYM8_KIDS.map((k, i) => { const [x, y, dir] = D.kids[i]; k.x = x; k.y = y; k.dir = dir;
    return { id: k.id, x, y, spr: k.spr, dir, move: "fixed", heart: "갈매반 짝꿍 " + k.tr.name, talk: () => gymKidTalkG(k, () => G.flag("g8q" + k.n), "조박사") }; });
  const trs = D.tr.map(([x, y, dir, range], i) => {
    const [id, name, spr, team, intro, lose, after] = G8TR.L[i];
    const o = { id: "gym8_t" + (i + 1), x, y, spr, dir, move: "fixed",
      trainer: { id: "gym8_" + id, cls: G8TR.cls, name, spr, range, base: 16, team, intro, lose, after: after + (G8TR_HEART[i] ? "\f" + G8TR_HEART[i] : ""), home: true } };
    if (G8TR_HEART[i]) o.heart = G8TR.cls + " " + name;
    return o; });
  const lanterns = D.lanterns.flatMap((L, z) => L.map(([x, y], j) => ({ id: `g8L${z}_${j}`, x, y, move: "fixed", special: g8drawLantern(z, j), talk: () => g8Lantern(z, j) })));
  const gates = D.gates.map(([x, y], i) => ({ id: "gym8_g" + (i + 1), x, y, special: gateDrawer("gate_galmae"), move: "fixed",
    show: () => !G.flag("g8g" + (i + 1)), talk: () => g8GateTalk(i) }));
  MAPS.gym8 = {
    rows: MAPDATA.gym8.rows, stamps: MAPDATA.gym8.stamps, indoor: true, name: "갈매 배움터",
    floor: "floor_maru", floor2: "floor_maru2", wall: "wall_galmae", win: "win_galmae", rail: "rail_galmae",
    bgm: "gym8", noPopup: true, exit: ["galmae", 26, 10, "down"],
    checks: [
      ...[5, 6, 7, 8].map(x => [x, 1, "칠판에 조박사님 글씨.\f'오늘의 수업: 암행\n— 불을 켜고, 살피고, 기록하자'"]),
      [9, 2, "교탁 위에 출석부가 있다.\f맨 위에 낯익은 이름이 보인다……\n덕과 아카데미 우리 반이다!"], [10, 2, "교탁 위에 출석부가 있다."],
      ...[[1, 3], [2, 3], [1, 4], [2, 4], [12, 3], [13, 3], [12, 4], [13, 4]].map(([x, y]) => [x, y, "책장에 '춘향전'·'흥부전'이\n가지런히 꽂혀 있다."]),
      ...D.q.map(([x, y], i) => [x, y, () => g8Board(i)]),
      ...g8SpotCells(),
    ],
    under: g8Under,
    over: g8Dark,
    npcs: [
      { id: "jobaksa8", x: D.leader[0], y: D.leader[1], spr: "gl_jobaksa2", dir: "down", move: "fixed", talk: jobaksaTalk, heart: "8관장 조박사(어사패 뒤)", heartLeader: true },
      { id: "guide8", x: D.guide[0], y: D.guide[1], spr: "student", dir: D.guide[2], move: "look", talk: gym8GuideTalk, heart: "갈매 배움터 도우미" },
      ...kids, ...trs, ...lanterns, ...gates,
    ],
  };
  // 짝꿍·트레이너 뒷말에 마음에 남는 대사
  GYM8_KIDS[0].after += "\f은찬: 너도 누군가한테\n초롱이 되어 줄 수 있어.";
  GYM8_KIDS[1].after += "\f보미: 들키면 어때.\n같이 웃으면 되지!";
  GYM8_KIDS[2].after += "\f다율: 틀린 답도 칠판에 써 두면\n다음엔 맞는 답이 된대.";
  if (typeof TOWN_ZONE !== "undefined") TOWN_ZONE["갈매 배움터"] = "galmae";
})();

// =====================================================================
// 2. 갈매마을: 조박사 귀환 · 배움터 문 · 교장 선생님의 봉서(덕과 아카데미 교실)
// =====================================================================
async function jbReturnEvent() {
  const P = World.player, J = act("jb_galmae"), H = act("gm_hangyeol");
  if (!J || !jbCanReturn()) return;
  bgm("academy");
  await say("???: 얘들아~\n선생님 왔다!");
  // 남쪽 큰길에서 걸어옴
  let sx = P.x, sy = Math.min(38, P.y + 4);
  if (World.solidAt(sx, sy, J)) { sx = 19; sy = 36; }
  J.x = sx; J.y = sy; J.hidden = false; J.dir = "up";
  const nb = [[0, 1], [-1, 0], [1, 0], [0, -1]].map(([dx, dy]) => [P.x + dx, P.y + dy]).find(([x, y]) => !World.solidAt(x, y, J)) || [P.x, P.y + 1];
  await walkPath(J, nb[0], nb[1]); face(J, P); face(P, J);
  await emote(P, "excl", 24);
  await say(`조박사: 오, ${G.name}!\n많이 컸다?\f얼굴이 완전히\n모험가 얼굴이 됐네.`);
  if (H && !H.hidden) {
    await say("한결: 조박사님!!");
    const hb = [[1, 0], [-1, 0], [0, -1], [0, 1]].map(([dx, dy]) => [P.x + dx, P.y + dy]).find(([x, y]) => !World.solidAt(x, y, H) && !(x === J.x && y === J.y));
    if (hb) await walkPath(H, hb[0], hb[1]); face(H, J);
    await say("한결: 출장 끝나셨어요?\f저, 보절 들판에서\n허수아비 세우다가 알았어요!\f혼자 강한 것보다\n같이 버티는 게 진짜 강한 거래요!");
    face(J, H);
    await say("조박사: ……그거, 선생님이 일 년 내내\n하고 싶던 말인데.\f한결이가 스스로 찾았구나.");
    await emote(J, "heart", 30);
    face(J, P);
  }
  await say("조박사: 어사패…… 일곱 개!\n여기까지 왔구나.");
  if (G.flag("bs_vote_done")) {   // v2.59 비색마을 투표
    await say("조박사: 그리고 비색마을 투표 이야기,\n선생님 다 들었다!");
    await say("조박사: 4월의 엽서를 보여 주고\n마을 사람들이랑 함께 지켰다며?\f……선생님이 가르친 것보다\n더 잘했네.");
    await say("조박사: 그 '투표 지시서',\n선생님 장부의 빠진 한 장이야.\f잘 가지고 있어.\n곧 쓸 날이 와.");
  }
  await say("조박사: 희주 선생님 수업도\n들었네?\f'천천히 해도 괜찮아요'\n……그 말 들었지?\f그 말 듣고 나면 이상하게\n더 힘이 난다니까.");
  await say("조박사: 약속대로 일곱 개.\f이제 선생님 수업을\n들어 볼 차례야.");
  await say("조박사: 아, 선생님 배움터는\n불을 다 꺼 놨어.\f오늘 수업 주제가 '암행'이거든.");
  await say("조박사: ……무슨 뜻이냐고?\n음 그건 안 돼.\f수업 시간에 알려 줄게!");
  if (H && !H.hidden) await say("한결: 나는 아까 조박사님한테\n허수아비 얘기 다 했으니까,\f이번엔 네 차례야!\n힘내!");
  await walkPath(J, 26, 10); J.dir = "up";
  sfx("door"); await fadeOut(8); J.hidden = true; G.flag("jb_back", true); g8DoorNow(); await fadeIn(8);
  await say("조박사는 갈매 배움터로\n들어갔다.\f문틈으로 빛 한 줄기\n새어 나오지 않는다……");
  zoneBgm();
}
function g8DoorNow() {                    // 이미 만든 지도에도 바로 문을 엶(다시 들어오면 도장 getter가 처리)
  const M = World.M; if (!M || G.map !== "galmae") return;
  const st = MAPS.galmae.stamps.find(s => s[0] === "gym8"); if (!st) return;
  const x = st[1] + 3, y = st[2] + 5;
  M.solid[y][x] = false; M.beh[y][x] = "door"; M.warps[x + "," + y] = ["gym8", 7, 19, "up"]; delete M.checks[x + "," + y];
}
async function hwangBongseo() {
  const P = World.player, H = act("hwang_class");
  if (!H || G.flag("bongseo_got") || !G.flag("jb_reveal")) return;
  bgm("academy");
  P.dir = "up";
  await walkPath(P, 8, 4); P.dir = "up"; face(H, P);
  await say(`교장 선생님: 왔구나, ${G.name}.`);
  await say("교장 선생님: 조 선생님한테 들었다.\f……'어디로 가는지는 다 묻지 않는다'고\n했었지?\f묻지 않은 건,\n이미 알고 있어서였단다.");
  await say("교장 선생님: 봉서라는 걸 아느냐?\f임금이 암행어사에게 내리던 편지다.\f겉봉에는 '도성 문 밖에 나가서\n열어 보라'고 적혀 있었다고 하지.");
  await say("교장 선생님: 이건 내가 쓴 봉서다.");
  await getItem("bongseo");
  await say("교장 선생님: 보름달이 뜨는 밤,\n본디회와 금박재단이\f만복사에 모인다는구나.\n만복사 앞에서 열어 보거라.");
  await say("교장 선생님: 나는 학교와 아이들을\n지키는 사람이다.\f아이를 위험한 곳에 혼자 보내는 건\n내 원칙에 어긋나지.");
  await say("교장 선생님: 그러니 걱정 마라.\n너는 혼자가 아니다.\f봉서를 열면 알게 될 게다.");
  await say("교장 선생님: 항아리에 갇힌 남켓몬들은\n어른들 말보다 네 목소리를 믿을 거다.\f……그건 네가 이 길에서\n스스로 쌓아 온 거란다.");
  await say("교장 선생님: 운동화 끈,\n단단히 묶었느냐?");
  await emote(H, "heart", 26);
  G.flag("bongseo_got", true);
  await say("(만복사지는 1번도로 서쪽,\n밤에만 열려요.)");
  if (!window.CHULDU_READY) await say("(플레이 버전은 여기까지!\n만복사의 밤은 다음에 열려요.)");
  zoneBgm();
}

(function attachChapter22() {
  // ---- 갈매마을 ----
  const GM = MAPS.galmae;
  const st = GM.stamps.findIndex(s => s[0] === "gym8");
  if (st >= 0) {
    const s = GM.stamps[st];
    GM.stamps = GM.stamps.slice(); GM.stamps[st] = [s[0], s[1], s[2], {
      get to() { return gym8Open() ? ["gym8", 7, 19, "up"] : undefined; },
      get locked() { return gym8Open() ? undefined : "gym8_closed"; } }];
  }
  if (typeof LOCKS !== "undefined") LOCKS.gym8_closed = "갈매 배움터.\f문에 쪽지가 붙어 있다.\n'연구 출장 중 — 지킴이 조박사'\f그 아래 작은 글씨.\n'어사패 일곱 개 모아서 와!'";
  // 문 앞 쪽지 살펴보기(옛 글) → 돌아온 뒤에는 깜깜한 문
  GM.checks = (GM.checks || []).map(c => (c[1] === 9 && c[0] >= 24 && c[0] <= 28 && typeof c[2] === "string" && c[2].includes("출장 중"))
    ? [c[0], c[1], () => say(gym8Open() ? "갈매 배움터.\f문틈으로 빛 한 줄기\n새어 나오지 않는다.\f안이 깜깜한 것 같다." : c[2])] : c);
  GM.areas = (GM.areas || []).concat([
    { x0: 0, y0: 18, x1: 39, y1: 21, cond: jbCanReturn, run: jbReturnEvent },
    { x0: 17, y0: 21, x1: 22, y1: 38, cond: jbCanReturn, run: jbReturnEvent },
  ]);
  GM.npcs.push({ id: "jb_galmae", x: 19, y: 36, spr: "jobaksa", dir: "up", hidden: true, move: "fixed", show: jbCanReturn });
  { const K = GM.npcs.find(n => n.id === "gym8_kid");
    if (K) { const old = K.talk; K.talk = async a => {
      if (gym8Open() && !hasBadge(8)) { await say("조박사님 돌아오셨어!\f배움터 불을 다 끄셨대.\n'암행 수업'이래!\f……암행이 뭐지?"); return; }
      if (hasBadge(8)) { await say("형, 누나가 조박사님을 이겼다고?!\f우와…… 나도 언젠가\n꼭 도전할 거야!"); await say("조박사님이 그러셨어.\n'급하게 크지 않아도 돼.'\f'대신 오늘 하나만\n어제보다 잘하면 돼.'"); return; }
      return typeof old === "function" ? old(a) : say(old); }; } }
  // 교장 선생님: 봉서를 줄 때는 교실 교탁 앞에서 기다림
  { const MH = GM.npcs.find(n => n.id === "mrhwang");
    if (MH) { MH.show = () => !(G.flag("jb_reveal") && !G.flag("bongseo_got"));
      const old = MH.talk; MH.talk = async a => {
        if (G.flag("bongseo_got") && !G.flag("chuldu_done")) { await say("교장 선생님: 만복사는 밤에만 열린다.\n밤길이니 조심하거라.\f……너는 혼자가 아니다.\n그걸 잊지 마라."); return; }
        return old(a); }; } }
  // ---- 덕과 아카데미 교실 ----
  const C2 = MAPS.class2;
  C2.npcs.push({ id: "hwang_class", x: 8, y: 3, spr: "gl_mrhwang", dir: "down", move: "fixed", show: () => G.flag("jb_reveal") && !G.flag("bongseo_got"),
    talk: hwangBongseo, heart: "교장 선생님(봉서)" });
  C2.areas = (C2.areas || []).concat([{ x0: 0, y0: 5, x1: 13, y1: 9, cond: () => G.flag("jb_reveal") && !G.flag("bongseo_got"), run: hwangBongseo }]);
})();
