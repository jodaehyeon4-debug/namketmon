// ===== v2.27 배움터 1~6 새 짜임 (사용자: "실제 포켓몬 체육관처럼 여러 퀴즈나 미로 요소" → 제미나이 개선안 2026-10-27) =====
// 칸 지도·장치 자리는 MAPDATA.gymN.dev(src/gyms_v227.py). 이 파일은 chapter21.js 뒤에 읽혀 v1.9~v2.2 배움터 설정(gyms.js·chapter6·7)을 바꿔 씀
//   공통: 수업판(칠판) Q1~Q6 — Q1·Q3·Q5는 기존 수업 셋(이야기 교훈·생태도감·상성, 깃발 gq·g2q…g6q 그대로), Q2·Q4·Q6은 새 문제(맞히면 선물)
//         체육관 트레이너 넷(시선 배틀) · 짝꿍 셋(칸마다 힌트·수업 뒤 연습 배틀) · 도우미 · 관장(7,2)
//   1 다홍: OX 발판(오답은 미끄럼틀로 아래 칸) + 시소 스위치로 가운데 블록 문
//   2 쪽빛: 물감 발자국 색 섞기 — 문마다 정해진 색(초록·보라·주황), 발자국은 여섯 걸음이면 마름
//   3 비색: 밀가루 미끄럼 + 회전 도마(↑) + 레시피 순서(손 씻기 → 반죽 → 굽기) + 다시 하기 종 — 레시피와 수업 셋을 마치면 화덕 문
//   4 주홍: 큰 별에서 작은 별을 차례로 잇는 별자리 — 가짜 별·구름 웅덩이는 처음 큰 별로, 둘째 칸은 별빛 망원경으로 진짜 별
//   5 감청: 레이저를 거울로 꺾어 감지기에 — 둘째 칸 프리즘 셔터는 수업을 풀면 열림
//   6 쑥빛: 커튼으로 나뉜 진찰 부스 — 칠판 문제의 답 번호 매트로 다음 부스, 틀리면 보충 부스(초록 매트로 돌아옴)
// 각 칸의 문은 '장치를 풀었다' + '그 칸 수업을 맞혔다' 둘 다일 때 열림(어느 쪽을 먼저 해도 됨)
"use strict";

const G7 = { trail: [], paint: null, steps: 0, star: [0, 0, 0], scopeT: 0 };
const g7dev = m => MAPDATA[m].dev;
const g7at = (L, x, y) => L.findIndex(p => p[0] === x && p[1] === y);

// ---------------------------------------------------------------- 새 문제(Q2·Q4·Q6) — 확인된 사실만
const G7X = {
  gym: [null,
    { q: "그네가 멈추기 전에\n뛰어내려야 용감하다.", opts: ["○", "×"], a: 1, gift: "potion",
      good: "움직이는 그네에서 뛰어내리면\n크게 다칠 수 있어요.\f그네가 멈춘 다음에 내려요!" }, null,
    { q: "광한루원 '오작교'는 견우와\n직녀 이야기에서 이름을 땄다.", opts: ["○", "×"], a: 0, gift: "potion",
      good: "까마귀와 까치가 은하수에 놓아 준\n다리가 오작교래요.\f광한루원 오작교는 그 이야기를\n담아 만든 돌다리예요." }, null,
    { q: "노말 타입의 약점은\n'격투' 타입 하나뿐이다.", opts: ["○", "×"], a: 0, gift: "potion",
      good: "노말 타입의 약점은\n격투 타입 하나예요.\f고스트 기술은 노말에게\n아예 통하지 않고요!" }],
  gym2: [null,
    { q: "첫 아치 문은 초록 발자국!\n어떤 물감 둘을 밟을까?", opts: ["노랑+파랑", "빨강+노랑", "빨강+파랑"], a: 0, gift: "potion",
      good: "노랑과 파랑을 섞으면\n싱그러운 초록이 돼요!" }, null,
    { q: "나무를 깎고 옻칠을 해 만드는\n남원의 전통 공예품은?", opts: ["남원 목기", "유리 공예", "한지 부채"], a: 0, gift: "potion",
      good: "남원 목기는 나무를 깎아\n옻칠을 여러 번 해서 만들어요.\f월백마을 목기 공방에서도\n볼 수 있지요." }, null,
    { q: "페어리 기술이 효과가\n굉장한 타입은?", opts: ["드래곤·격투·악", "불꽃·독·강철", "물·전기"], a: 0, gift: "potion",
      good: "페어리 기술은 드래곤·격투·악\n타입에게 아주 잘 들어요!" }],
  gym3: [null,
    { q: "채소와 과일은 어떻게\n씻는 게 좋을까요?", opts: ["흐르는 물에 씻기", "씻지 않고 먹기", "흙 묻은 채로 두기"], a: 0, gift: "superpotion",
      good: "물에 잠깐 담갔다가\n흐르는 물에 꼼꼼히 헹궈요." }, null,
    { q: "미꾸라지와 시래기로 끓이는\n남원의 향토 음식은?", opts: ["남원 추어탕", "전주 비빔밥", "춘천 닭갈비"], a: 0, gift: "superpotion",
      good: "남원 추어탕은\n남원을 대표하는 향토 음식이에요." }, null,
    { q: "풀 타입 기술이 효과가\n굉장한 타입 셋은?", opts: ["물·땅·바위", "불꽃·얼음·비행", "독·벌레·강철"], a: 0, gift: "superpotion",
      good: "풀 기술은 물·땅·바위 타입에게\n아주 잘 들어요!" }],
  gym4: [null,
    { q: "늘 북쪽 하늘에 떠 있어\n길잡이가 된 별은?", opts: ["북극성", "태양", "달"], a: 0, gift: "superpotion",
      good: "북두칠성 국자 끝 두 별 사이를\n다섯 번 이어 가면 북극성이에요." }, null,
    { board: "칠판: '남원 이야기'\f광한루원 연못은\n은하수를 뜻해요.", q: "광한루원 연못 속 세 섬은\n무엇을 본떴을까요?", opts: ["신선이 산다는 삼신산", "제주도", "독도"], a: 0, gift: "superpotion",
      good: "봉래·방장·영주,\n전설 속 삼신산을 본떴어요." }, null,
    { q: "물 기술은 불꽃·땅, 그리고\n무엇에게 효과가 굉장할까?", opts: ["바위", "풀", "드래곤"], a: 0, gift: "superpotion",
      good: "물 기술은 불꽃·땅·바위 타입에게\n아주 잘 들어요!" }],
  gym5: [null,
    { q: "빛이 거울에 부딪혀\n꺾여 나가는 것은?", opts: ["빛의 반사", "빛의 증발", "소리의 메아리"], a: 0, gift: "superpotion",
      good: "거울에 부딪힌 빛이 튕겨 나가는 걸\n'빛의 반사'라고 해요." }, null,
    { q: "남원에서 망원경으로\n별을 볼 수 있는 곳은?", opts: ["남원항공우주천문대", "해시계 공원", "잠수함 박물관"], a: 0, gift: "superpotion",
      good: "남원항공우주천문대에서는\n밤하늘을 관측할 수 있어요." }, null,
    { q: "격투 기술은 노말·바위·강철에게\n어떤 효과를 줄까?", opts: ["효과가 굉장하다", "효과가 별로다", "효과가 없다"], a: 0, gift: "superpotion",
      good: "격투 기술은 노말·얼음·바위·악·강철\n타입에게 아주 잘 들어요!" }],
  gym6: [null, null,
    { q: "향긋해서 떡이나 뜸에도\n쓰는 들풀은?", opts: ["강아지풀", "선인장", "쑥"], a: 2, gift: "superpotion",
      good: "쑥은 쑥떡으로 먹고\n뜸을 뜰 때도 써요." },
    { board: "문제판: '남원 이야기'\f지리산 자락 운봉에는\n허브와 약초가 자라는 곳이 있어요.",
      q: "운봉에 있는, 허브와 약초가\n자라는 곳은?", opts: ["갯벌 생태공원", "사막 식물원", "지리산 허브밸리"], a: 2, gift: "superpotion",
      good: "운봉의 지리산 허브밸리에서는\n여러 허브와 약초가 자라요." },
    { q: "에스퍼 기술이 효과가\n굉장한 타입 둘은?", opts: ["악·고스트", "격투·독", "강철·에스퍼"], a: 1, gift: "superpotion",
      good: "에스퍼 기술은 격투·독 타입에게\n아주 잘 들어요!" }, null],
};

// ---------------------------------------------------------------- 체육관 트레이너(시선 배틀)
// 첫 배움터 트레이너는 실제 게임 첫 체육관처럼 관장(고라콩 12 · 달곰콩 13)보다 2~5레벨 낮게(아이들이 처음 맞는 연속 배틀)
const G7TR = {
  gym: { cls: "놀이반 친구", L: [
    ["minjae", "민재", "kid_m", [["daramball", 7]], "미끄럼틀 타기 전에\n나랑 승부야!", "으앗, 미끄러졌다!", "첫 번째 문은\n왼쪽 ○ 발판 쪽이야!"],
    ["seoyun", "서윤", "kid_f", [["jjaekcham", 8]], "정글짐 시소 비밀을\n알고 있니?", "시소처럼 기우뚱……", "정글짐 옆 시소를 누르면\n가운데 블록 문이 열려!"],
    ["jian", "지안", "kid_f", [["kkajak", 8], ["daramball", 8]], "그네처럼 신나게\n흔들어 볼까!", "어지러워~", "움직이는 그네에서\n뛰어내리면 안 돼!"],
    ["haram", "하람", "student", [["jjaekcham", 9], ["gorakong", 10]], "관장님 앞 마지막 술래는\n나야!", "술래 끝!", "고스트에겐\n노말 기술이 안 통해!"]] },
  gym2: { cls: "미술반 친구", L: [
    ["yerin", "예린", "kid_f", [["mudangkong", 14]], "내 붓질처럼 산뜻하게\n승부야!", "물감이 번졌다……", "파랑과 노랑을 밟으면\n초록이 돼!"],
    ["doha", "도하", "kid_m", [["bangato", 15]], "철쭉빛 페어리를\n봐!", "꽃잎이 흩어졌다~", "두 번째 문은\n빨강 더하기 파랑!"],
    ["chaewon", "채원", "kid_f", [["jjaekcham", 15], ["mudangkong", 15]], "물감이 마르기 전에\n지나갈 수 있을까?", "물감이 말라 버렸다!", "보라 발자국을 만들면\n바로 위 문으로!"],
    ["junseo", "준서", "student", [["bangato", 16], ["olchaengmi", 16]], "관장님의 숲속 화실은\n내가 지켜!", "화실 문 열렸다……", "마지막 문은 노랑과 빨강,\n주황색!"]] },
  gym3: { cls: "요리반 친구", L: [
    ["yunho", "윤호", "kid_m", [["bakari", 19]], "요리 교실에선\n손 씻기가 먼저야!", "앗, 반죽이 퍼졌다!", "손 씻기 자리는 왼쪽!\n포대에 부딪히면 멈춰."],
    ["soyun", "소윤", "kid_f", [["seotkongi", 20]], "밀가루 바닥에서\n중심 잡기 쉽지 않지?", "미끄러졌다~", "왼쪽 끝 포대에 부딪히면\n손 씻기 자리에 멈춰!"],
    ["geonhui", "건희", "kid_m", [["gwangdaeseot", 21], ["heosuni", 20]], "향긋한 지리산 산나물\n파워를 봐!", "나물이 숨이 죽었다……", "오른쪽 회전 도마를 타면\n반죽 자리로 쭈욱!"],
    ["daeun", "다은", "kid_f", [["seotkongi", 21], ["bakari", 21]], "화덕 앞 굽기 자리가\n코앞이야!", "빵이 탔다!", "굽기 자리는 화덕 바로 앞!\n아래에서 위로 미끄러져 봐."]] },
  gym4: { cls: "천문반 친구", L: [
    ["eunu", "은우", "kid_m", [["daseulmi", 24]], "은하수 연못처럼 깊은\n물의 힘을 봐!", "별똥별처럼 졌다……", "큰 별을 밟고\n작은 별을 번호 차례로!"],
    ["gaon", "가온", "kid_f", [["gaegulmi", 25]], "가짜 별을 밟으면\n별자리가 꺼져!", "별빛이 꺼졌다~", "오른쪽 망원경을 보면\n진짜 별이 빛나!"],
    ["sion", "시온", "kid_m", [["chireyong", 25], ["daseulmi", 25]], "망원경 보기 전에\n나랑 한판 붙자!", "구름이 끼었다……", "구름 웅덩이를 밟으면\n큰 별로 돌아가!"],
    ["haneul", "하늘", "kid_f", [["eunchimi", 26], ["gaegulmi", 26]], "밤하늘 가장 빛나는 별은\n관장님이야!", "별이 졌다……", "가로로 쭉 이은 다음\n위로 꺾어!"]] },
  gym5: { cls: "과학반 친구", L: [
    ["taeo", "태오", "kid_m", [["satbaso", 28]], "과학과 기합은\n각도가 생명이야!", "각도가 틀렸다!", "아래쪽 거울을 돌리면\n위쪽 감지기에 빛이 닿아!"],
    ["roa", "로아", "kid_f", [["bakjumi", 28]], "레이저 광선보다 빠른\n정권 찌르기!", "광선보다 빨랐다……", "오른쪽 거울 둘로\n빛을 왼쪽으로 보내!"],
    ["ujin", "우진", "student", [["eomnirang", 29], ["beomageom", 29]], "심술쟁이 거울에 속지 마라!\n승부다!", "가설이 틀렸다!", "가운데 거울부터\n위로 꺾어 봐!"],
    ["jiyu", "지유", "kid_f", [["sojjeokmi", 30], ["satbaso", 30]], "관장님 실험실 앞\n마지막 관문이다!", "실험 실패……", "오른쪽 위 거울을\n아래로 꺾으면 끝!"]] },
  gym6: { cls: "보건반 친구", L: [
    ["raon", "라온", "kid_m", [["kkumnoru", 31]], "앗, 다른 번호를 밟아서\n여기로 왔구나!", "어질어질……", null],
    ["arin", "아린", "kid_f", [["seureumi", 32]], "보건실에서는 뛰지 말고\n조용히 승부!", "쉿, 졌다……", "코피가 날 땐\n앞으로 살짝 숙이기!"],
    ["dodam", "도담", "kid_m", [["sojjeokmi", 32], ["kkumnoru", 32]], "초능력으로 네가 밟을\n번호를 읽었어!", "번호를 잘못 읽었다!", "허브밸리는\n운봉에 있어!"],
    ["dasom", "다솜", "kid_f", [["yeonbangul", 33], ["seureumi", 33]], "시력검사표의 비밀까지\n풀 수 있을까?", "눈이 침침해……", "시력검사표를 들여다보면\n정답 번호가 보여!"]] },
};
function g7trainers(m) {
  const D = g7dev(m), T = G7TR[m];
  return D.tr.map(([x, y, dir, range], i) => {
    const [id, name, spr, team, intro, lose, after] = T.L[i];
    return { id: m + "_t" + (i + 1), x, y, spr, dir, move: "fixed",
      trainer: { id: m + "_" + id, cls: T.cls, name, spr, range, base: 16, team, intro, lose, after: after || g7afterLine(m, i), home: true } };
  });
}
// 배움터 트레이너는 배틀이 끝나면 제자리로 돌아감(실제 게임처럼 다가와 배틀하되, 좁은 배움터 길을 막지 않게)
const _g7spotted = trainerSpotted;
trainerSpotted = async function (a) {
  const home = a.trainer && a.trainer.home ? [a.x, a.y, a.dir, G.map] : null;
  await _g7spotted(a);
  if (!home || G.map !== home[3] || a.hidden) return;
  const back = { up: "down", down: "up", left: "right", right: "left" }[home[2]];
  for (let n = 0; n < 8 && (a.x !== home[0] || a.y !== home[1]); n++) { if (!World.tryMove(a, back)) break; while (a.moving) await frames(1); }
  a.dir = home[2];
};
function g7afterLine(m, i) { if (m === "gym6") return `1층 정답 매트는\n${QUIZ6[0].a + 1}번이야!`; return "힘내!"; }

// ---------------------------------------------------------------- 수업판(칠판)
function g7Lessons(m) { return { gym: null, gym2: QUIZ2, gym3: QUIZ3, gym4: QUIZ4, gym5: QUIZ5, gym6: QUIZ6 }[m]; }
const G7F = { gym: "gq", gym2: "g2q", gym3: "g3q", gym4: "g4q", gym5: "g5q", gym6: "g6q" };
const G7KIDS = () => ({ gym: GYM_KIDS, gym2: GYM2_KIDS, gym3: GYM3_KIDS, gym4: GYM4_KIDS, gym5: GYM5_KIDS, gym6: GYM6_KIDS });
async function g7Right(Q, who) {
  await Audio2.jingle("jg_levelup");
  await say(`${who ? who + ": " : ""}딩동댕! 정답이야!`);
  await say(Q.good);
}
async function g7Wrong(m, n) {
  sfx("flee_fail");
  const k = G7KIDS()[m][Math.max(0, Math.min(2, n))];
  await say(`땡! 아쉽다~\f괜찮아, 틀리면서 배우는 거야.\n짝꿍 ${k.tr.name}에게 힌트를 들어 볼까?`);
}
// 기존 수업 n(1~3): 맞히면 깃발 + 선물 → 그 칸 문 확인
async function g7Lesson(m, n, opt = {}) {
  const Q = g7Lessons(m)[n - 1], F = G7F[m] + n;
  if (G.flag(F)) { await say("칠판 구석에 '참 잘했어요!'\n도장이 꾹 찍혀 있다."); return true; }
  if (Q.board) await say(Q.board);
  const v = opt.answer !== undefined ? opt.answer : await quizAsk(Q.q, Q.opts);
  if (v < 0) { await say("(조금 더 생각해 보고\n다시 풀어 보자.)"); return false; }
  if (v !== Q.a) { await g7Wrong(m, n - 1); return false; }
  await g7Right(Q);
  await say("정답 선물이야!"); await getItem(Q.alt && G.has(Q.gift) ? Q.alt : Q.gift);
  G.flag(F, true);
  if (G7GATE[m]) await G7GATE[m](n);
  return true;
}
// 새 문제(맞히면 처음 한 번 선물)
async function g7Extra(m, i) {
  const Q = G7X[m][i], F = "g7x_" + m + "_" + i;
  if (Q.board) await say(Q.board);
  const v = await quizAsk(Q.q, Q.opts);
  if (v < 0) { await say("(조금 더 생각해 보고\n다시 풀어 보자.)"); return false; }
  if (v !== Q.a) { sfx("flee_fail"); await say(`땡! 정답은 '${Q.opts[Q.a]}'예요.`); await say(Q.good); return false; }
  await g7Right(Q);
  if (!G.flag(F)) { G.flag(F, true); await say("새 문제를 맞힌 선물!"); await getItem(Q.gift); }
  if (G7EXTRA[m]) await G7EXTRA[m](i);
  return true;
}
async function g7Board(m, i) {
  const D = g7dev(m), L = D.lesson.indexOf(i);
  if (L >= 0) return G7BOARD[m] ? G7BOARD[m](L + 1) : g7Lesson(m, L + 1);
  if (G7X[m][i]) return g7Extra(m, i);
}
const G7BOARD = {}, G7GATE = {}, G7EXTRA = {};
G7BOARD.gym = async n => {            // 다홍: 칠판은 OX 문제(대답은 발판으로)
  await say(`OX 문제판 ${n}\f` + OX1[n - 1].st);
  await say(G.flag("gq" + n) ? "판 구석에 '참 잘했어요!'\n도장이 꾹 찍혀 있다." : "맞으면 ○ 발판, 틀리면 × 발판!\f이 칸 발판을 밟아 대답해요.");
};

// ---------------------------------------------------------------- 공통: 문·사람·장식
async function g7OpenGate(m, i, msg) {
  const id = m + "_g" + (i + 1); const gt = act(id);
  if (!gt || gt.hidden) return;
  await gymOpenGate(id, msg);
}
function g7gates(m, special, showFn, talkFn) {
  const R = (MAPDATA[m] && MAPDATA[m].rows) || [], vert = (x, y) => (R[y - 1] || "")[x] === "V" || (R[y + 1] || "")[x] === "V";   // v2.46 세로 칸막이 사이 문은 세로 문
  const pick = (x, y) => vert(x, y) && JSN.tiles_in && JSN.tiles_in.t[special + "_v"] !== undefined ? special + "_v" : special;
  return g7dev(m).gates.map(([x, y], i) => ({ id: m + "_g" + (i + 1), x, y, special: typeof special === "function" ? special(i) : (sx, sy) => gateDrawer(pick(x, y))(sx, sy), move: "fixed",
    show: () => showFn(i), talk: () => talkFn(i) }));
}
function g7kids(m, leader, hints) {
  const D = g7dev(m), K = G7KIDS()[m];
  return K.map((k, i) => {
    const [x, y, dir] = D.kids[i]; k.x = x; k.y = y; k.dir = dir; if (hints[i]) k.hint = hints[i];
    return { id: k.id, x, y, spr: k.spr, dir, move: "fixed", talk: () => gymKidTalkG(k, () => G.flag(G7F[m] + k.n), leader) };
  });
}
function g7checks(m) {
  const D = g7dev(m);
  return D.q.map(([x, y], i) => [x, y, () => g7Board(m, i)]);
}
function g7setLeader(m, id) { const L = MAPS[m].npcs.find(o => o && o.id === id); if (L) { L.x = g7dev(m).leader[0]; L.y = g7dev(m).leader[1]; L.dir = "down"; } return L; }
function g7guide(m, id, oldTalk, intro) {
  const [x, y, dir] = g7dev(m).guide;
  return { id, x, y, spr: "student", dir, move: "look", talk: async () => { if (hasBadge({ gym: 1, gym2: 2, gym3: 3, gym4: 4, gym5: 5, gym6: 6 }[m])) return oldTalk(); await say(intro); } };
}
function g7drawStampAt(name, x, y) {      // 실내 도장 그림을 (화면 x, y)에 그림(바닥 위 덮어 그리기)
  const ts = TSET.in, S = ts.js.stamp[name]; if (!S) return;
  for (let j = 0; j < S.h; j++) for (let i = 0; i < S.w; i++) {
    const k = S.b[j][i]; if (k >= 0) tileAt(ts, k, x + i * TS, y + j * TS);
    const t = S.top && S.top[j][i]; if (t >= 0) tileAt(ts, t, x + i * TS, y + j * TS);
  }
}
async function g7slide(P, cells) {         // 미끄럼틀: 정한 칸을 차례로 쭈욱(막힘 무시)
  sfx("jump"); P.sliding = true;
  for (const [x, y] of cells) {
    const dx = Math.sign(x - P.x), dy = Math.sign(y - P.y);
    P.dir = dy > 0 ? "down" : dy < 0 ? "up" : dx > 0 ? "right" : "left";
    P.x = x; P.y = y; P.mx = dx; P.my = dy; P.moving = true; P.p = 0; P.speed = RUN_SPD;
    while (P.moving) await frames(1);
  }
  P.sliding = false; P.dir = "down"; sfx("land");
}

// =====================================================================
// 1. 다홍 배움터 — OX 발판 + 미끄럼틀 + 시소 스위치
// =====================================================================
async function g7pad1(z, c) {               // z = 0·1·2 (칸), c = 'o' | 'x'
  const n = z + 1; if (G.flag("gq" + n)) return;
  const D = OX1[n - 1], P = World.player;
  await say(`OX 문제 ${n}!\f` + D.st);
  await say(`${c === "o" ? "○" : "×"} 발판을 밟았다!`);
  if (c === D.ans) {
    await g7Right(QUIZ[n - 1]);
    await say("정답 선물이야!"); await getItem(QUIZ[n - 1].gift);
    G.flag("gq" + n, true);
    await g7OpenGate("gym", [0, 2, 3][z], `'참 잘했어요!' 도장 소리가 났다.\f칸막이 문이 열렸다!`);
    return;
  }
  sfx("flee_fail");
  await say("삐익!\f발판이 기울어지더니\n미끄럼틀로 쭈욱!");
  await g7slide(P, g7dev("gym").slide[z]);
  await g7Wrong("gym", z);
}
async function g7switch1() {
  const on = !G.flag("g1sw"); G.flag("g1sw", on); sfx("select");
  await frames(6);
  if (on) { const gt = act("gym_g2"); if (gt) { sfx("door"); for (let i = 0; i < 4; i++) { gt.hidden = !gt.hidden; await frames(5); } gt.hidden = true; } await say("시소가 쿵! 하고 기울었다.\f가운데 블록 문이\n바닥으로 쏙 내려갔다!"); }
  else { const gt = act("gym_g2"); if (gt) gt.hidden = false; await say("시소가 반대쪽으로 기울었다.\f블록 문이 다시 올라왔다.\n(한 번 더 누르면 열려요.)"); }
}
(function setupGym1v227() {
  const M = MAPS.gym, D = g7dev("gym");
  g7setLeader("gym", "chanhyang");
  const hints = ["서아: 칠판의 OX 문제를 읽고\n맞으면 ○, 틀리면 × 발판!\f틀리면 미끄럼틀로 쭈욱~\n그래도 다시 올라오면 돼.",
    "지호: 정글짐 옆 시소를 눌러 봐!\n가운데 블록 문이 열려.\f칠판 문제는\n남원 생태도감에서 나와!",
    "하준: 마지막은 타입 상성!\f찬향 선생님 남켓몬은\n모두 노말 타입이야."];
  M.checks = (M.checks || []).filter(c => typeof c[2] === "string" && c[1] <= 1)
    .concat(g7checks("gym"))
    .concat([[D.switch[0], D.switch[1], g7switch1], [D.switch[0] + 1, D.switch[1], g7switch1]])
    .concat([[11, 8, "그네가 살랑살랑 흔들린다."], [12, 8, "그네가 살랑살랑 흔들린다."], [13, 8, "그네가 살랑살랑 흔들린다."],
             [0, 18, "모래놀이터에 모래성이 서 있다."], [1, 18, "모래놀이터에 모래성이 서 있다."], [2, 18, "모래놀이터에 모래성이 서 있다."],
             [0, 8, "시소다. 둘이 타야 재밌다."], [1, 8, "시소다. 둘이 타야 재밌다."], [2, 8, "시소다. 둘이 타야 재밌다."],
             [1, 11, "정글짐이다.\n꼭대기에 오르면 다 보일 것 같다."], [2, 11, "정글짐이다."], [1, 12, "정글짐이다."], [2, 12, "정글짐이다."]]);
  M.triggers = D.pads.flatMap((zone, z) => zone.map(([x, y, c]) => ({ x, y, run: () => g7pad1(z, c) })));
  M.npcs = [
    M.npcs.find(o => o && o.id === "chanhyang"),
    g7guide("gym", "guide", gym1GuideTalk, "도우미: 어서 와요, 도전자님!\n여기는 다홍 배움터, 놀이터예요.\f칠판의 OX 문제를 읽고\n맞으면 ○, 틀리면 × 발판을 밟아요.\f잘못 고르면 미끄럼틀을 타고\n아래 칸으로 쭈욱!\f가운데 블록 문은 정글짐 옆\n시소를 누르면 열려요.\f칠판 문제는 모두 여섯 개!\n새 문제를 맞히면 선물도 있어요."),
    ...g7kids("gym", "찬향", hints),
    ...g7trainers("gym"),
    ...g7gates("gym", "gate", i => i === 1 ? !G.flag("g1sw") : !G.flag("gq" + [1, 0, 2, 3][i]),
      i => say(i === 1 ? "블록 문이 닫혀 있다.\f정글짐 옆 시소를 누르면\n내려간다고 적혀 있다." : "칸막이 문이 닫혀 있다.\f칠판의 OX 문제를 읽고\n맞는 발판을 밟으면 열린다.")),
  ].filter(Boolean);
  M.under = (cx, cy) => {
    for (let n = 1; n <= 3; n++) if (G.flag("gq" + n)) {     // 맞힌 칸은 정답 발판에 별 스티커
      const p = D.pads[n - 1].find(q => q[2] === OX1[n - 1].ans); const x = p[0] * 16 - cx, y = p[1] * 16 - cy;
      rect(x + 11, y + 1, 4, 4, "#f8d040"); rect(x + 12, y, 2, 6, "#f8d040"); rect(x + 10, y + 2, 6, 2, "#f8d040"); }
    if (G.flag("g1sw")) { const T = TSET.in.js.t, d = MAPS.gym, [sx, sy] = D.switch;
      for (let i = 0; i < 2; i++) { const fl = d.floor2 && (sx + i + sy) % 2 ? d.floor2 : d.floor || "floor_lino"; tileAt(TSET.in, T[fl], (sx + i) * 16 - cx, sy * 16 - cy); }
      g7drawStampAt("seesaw_b", sx * 16 - cx, sy * 16 - cy); }
  };
  M.over = null;
})();

// =====================================================================
// 2. 쪽빛 배움터 — 물감 발자국(여섯 걸음이면 마름) + 정해진 색 아치 문
// =====================================================================
function g7mix(a, b) { return paintMix(a, b); }
async function g7tray(c) {
  const steps = g7dev("gym2").steps;
  if (c === "씻기") { if (!G7.paint) return; G7.paint = null; G7.steps = 0; G7.trail = []; sfx("heal_hp"); await say("세숫대야에 발을 첨벙!\n발이 깨끗해졌다."); return; }
  const was = G7.paint, now = g7mix(G7.paint, c);
  G7.steps = steps;
  if (was === now) { sfx("grass"); return; }
  G7.paint = now; sfx("grass");
  if (!was) await say(`찰박! 발에\n${c} 물감이 묻었다!\f(여섯 걸음이 지나면 말라요.)`);
  else if (now === "갈색") await say(`${was}에 ${c}이(가) 또 섞여서\n탁한 갈색이 되었다…\f세숫대야에서 발을 씻고\n다시 해 보자.`);
  else await say(`${was} 위에 ${c}이(가) 섞여서…\f${now} 발자국이 되었다!\n(다시 여섯 걸음)`);
}
async function g7arch(i) {
  const need = g7dev("gym2").need[i], n = i + 1;
  if (G.flag("g2a" + n)) return;
  if (!G.flag("g2q" + n)) { await say(`물감 아치 문이다.\f'칠판 수업 ${["하나", "둘", "셋"][i]}'을 마친 도전자만\n지나갈 수 있다고 적혀 있다.`); return; }
  if (G7.paint !== need) { await say(`아치 문에 ${need} 물감 자국이 그려져 있다.\f${need} 발자국으로 다가가면\n열릴 것 같다.\f(지금 발자국: ${G7.paint || "없음"})`); return; }
  G.flag("g2a" + n, true); G7.paint = null; G7.steps = 0; G7.trail = [];
  await gymOpenGate("gym2_g" + n, `${need} 발자국이 아치에 닿자\n무지개 문이 활짝 열렸다!\f지나가면서 발에 묻은 물감이\n말끔히 지워졌다.`);
}
(function setupGym2v227() {
  const M = MAPS.gym2, D = g7dev("gym2");
  g7setLeader("gym2", "miyeong");
  const hints = ["하윤: 아치 문은 정해진 색\n발자국으로만 열려!\f물감은 여섯 걸음이면 말라.\n섞고 나면 서둘러!\f그리고 칠판 수업도\n꼭 풀어야 해.",
    "시우: 보라는 빨강 더하기 파랑!\f노랑을 밟으면 탁해지니까 조심!\n씻는 대야는 왼쪽에 있어.",
    "은채: 주황은 빨강이랑 노랑!\f파랑 쟁반은 함정이야."];
  M.checks = (M.checks || []).filter(c => typeof c[2] === "string" && c[1] <= 1).concat(g7checks("gym2"))
    .concat([[5, 7, "선반 가득 꽃 화분이 놓여 있다."], [6, 7, "선반 가득 꽃 화분이 놓여 있다."], [5, 8, "선반 가득 꽃 화분이 놓여 있다."], [6, 8, "선반 가득 꽃 화분이 놓여 있다."],
             [13, 13, "물감 탁자. 붓이 가지런하다."], [14, 13, "물감 탁자. 붓이 가지런하다."]]);
  M.triggers = D.trays.map(([x, y, c]) => ({ x, y, run: () => g7tray(c) }));
  M.onLoad = () => { G7.paint = null; G7.steps = 0; G7.trail = []; };
  M.onStep = P => {
    if (!G7.paint) return;
    G7.trail.push({ x: P.x, y: P.y, c: G7.paint, d: P.dir }); if (G7.trail.length > 10) G7.trail.shift();
    const onTray = D.trays.some(([x, y]) => x === P.x && y === P.y);
    if (!onTray && --G7.steps <= 0) { G7.paint = null; G7.steps = 0; sfx("cursor"); }
  };
  M.under = (cx, cy) => {
    G7.trail.forEach((t, i) => { if (t.x === World.player.x && t.y === World.player.y) return; const x = t.x * 16 - cx, y = t.y * 16 - cy, h = PAINT_HEX[t.c];
      g.globalAlpha = 0.3 + 0.06 * i; const side = (i & 1) ? 9 : 4; rect(x + side, y + 8, 3, 4, h); rect(x + side, y + 6, 3, 1, h); g.globalAlpha = 1; });
    if (G7.paint) { const P = World.player; rect(P.px - cx + 3, P.py - cy + 13, 10, 3, PAINT_HEX[G7.paint]); }
  };
  M.over = () => {
    const t = G7.paint ? `발자국: ${G7.paint} · ${G7.steps}걸음` : "발자국: 없음", w = Font.width(t, "g9") + 22;
    rect(SW - w - 4, 4, w, 15, "rgba(30,30,40,.78)"); rect(SW - w + 1, 7, 9, 9, G7.paint ? PAINT_HEX[G7.paint] : "#c8c8c8");
    Font.draw(g, t, SW - 8, 5, { font: "g9", align: "right", col: "#fff", sh: null });
  };
  M.npcs = [
    M.npcs.find(o => o && o.id === "miyeong"),
    g7guide("gym2", "guide2", gym2GuideTalk, "도우미: 어서 와요! 여기는 쪽빛 배움터,\n숲속 아틀리에예요.\f아치 문마다 열리는 색이 정해져 있어요.\n초록, 보라, 주황!\f물감 쟁반을 밟으면 발에 물감이 묻고,\n두 가지를 밟으면 색이 섞여요.\f발자국은 여섯 걸음이면 말라요.\n섞으면 서둘러 문으로!\f아치 문을 지나려면 그 칸의\n칠판 수업도 풀어야 해요."),
    ...g7kids("gym2", "미영", hints),
    ...g7trainers("gym2"),
    ...g7gates("gym2", () => drawArch(), i => !G.flag("g2a" + (i + 1)), i => g7arch(i)),
  ].filter(Boolean);
})();

// =====================================================================
// 3. 비색 배움터 — 밀가루 미끄럼 + 회전 도마 + 레시피 순서 + 다시 하기 종
// =====================================================================
async function g7station(n) {
  if (G.flag("g3s" + n) || G.flag("g3open")) return;
  const req = [1, 2, 3].find(i => !G.flag("g3s" + i));
  if (n !== req) { sfx("flee_fail"); await say(`레시피 카드: '${RECIPE[req - 1]}'부터!\f순서대로 해야\n맛있는 빵이 돼요.`); return; }
  await say(RECIPE_IN[n - 1].split("\f").slice(0, 2).join("\f"));
  G.flag("g3s" + n, true); sfx("chime");
  if (n < 3) await say(`레시피 '${RECIPE[n - 1]}' 끝!\f다음은 '${RECIPE[n]}' 자리다.`);
  else await g7gate3();
}
async function g7gate3() {
  if (G.flag("g3open")) return;
  if (![1, 2, 3].every(i => G.flag("g3s" + i))) return;
  const left = [1, 2, 3].filter(i => !G.flag("g3q" + i)).length;
  if (left) { await say(`빵이 화덕 앞에서 기다린다!\f칠판 수업이 ${left}개 남았다.\n수업을 다 마치면 화덕 문이 열린다.`); return; }
  G.flag("g3open", true);
  await gymOpenGate("gym3_g1", "빵이 노릇노릇 구워졌다!\f화덕 옆 문이 활짝 열렸다!");
}
async function g7bell() {
  sfx("chime");
  if (G.flag("g3open")) { await say("딸랑! 맑은 종소리가 울렸다."); return; }
  await say("딸랑! 레시피 다시 하기 종이다.");
  if (await yes("레시피를 처음부터\n다시 할까요?")) { [1, 2, 3].forEach(i => G.flag("g3s" + i, false)); await say("레시피가 처음으로 돌아갔다.\f1.손 씻기 → 2.반죽하기 → 3.굽기!"); }
}
(function setupGym3v227() {
  const M = MAPS.gym3, D = g7dev("gym3");
  g7setLeader("gym3", "suhyeon");
  const hints = ["다인: 밀가루 바닥은 쭈욱 미끄러져!\f레시피는 1.손 씻기 2.반죽 3.굽기.\n그 자리에 딱 멈춰 서야 해.\f헷갈리면 오른쪽 종을 울려\n처음부터!",
    "유찬: 반죽 자리는 오른쪽!\f회전 도마 화살표를 밟으면\n위로 방향이 바뀌어.",
    "소은: 굽기 자리는 화덕 바로 앞!\f그리고 칠판 수업 셋을 다 풀어야\n화덕 문이 열린대."];
  G7GATE.gym3 = () => g7gate3();
  M.checks = [
    ...[5, 6, 7, 8].map(x => [x, 1, "칠판 메뉴판: '오늘의 수업 — 남켓몬 빵 굽기'\f'레시피: 1.손 씻기 2.반죽하기 3.굽기'"]),
    ...[[11, 4], [12, 4], [11, 5], [12, 5]].map(([x, y]) => [x, y, "벽돌 화덕이다. 따끈따끈하다."]),
    ...[[0, 2], [1, 2], [13, 2], [14, 2], [0, 3], [1, 3], [13, 3], [14, 3], [0, 18], [1, 18], [13, 18], [14, 18], [0, 19], [1, 19], [13, 19], [14, 19]].map(([x, y]) => [x, y, "빵 진열장에 남켓몬 모양 빵이\n가지런히 놓여 있다."]),
    ...MAPDATA.gym3.stamps.filter(s => s[0] === "flour").map(s => [s[1], s[2], "밀가루 포대다.\n부딪히면 미끄러지다 멈춘다."]),
    [3, 10, "반죽용 조리대다."], [4, 10, "반죽용 조리대다."],
    [D.bell[0], D.bell[1], g7bell],
    ...g7checks("gym3"),
  ];
  M.triggers = D.st.map(([x, y], i) => ({ x, y, run: () => g7station(i + 1) }));
  M.over = () => {
    const t = "레시피 " + [1, 2, 3].map(i => G.flag("g3s" + i) || G.flag("g3open") ? "●" : "○").join("") + " · 수업 " + [1, 2, 3].filter(i => G.flag("g3q" + i)).length + "/3";
    const w = Font.width(t, "g9") + 12; rect(SW - w - 4, 4, w, 15, "rgba(30,30,40,.78)"); Font.draw(g, t, SW - 10, 5, { font: "g9", align: "right", col: "#fff", sh: null });
  };
  M.npcs = [
    M.npcs.find(o => o && o.id === "suhyeon"),
    g7guide("gym3", "guide3", gym3GuideTalk, "도우미: 어서 와요! 여기는 비색 배움터,\n요리 교실이에요.\f하얀 밀가루 바닥에서는\n뭔가에 막힐 때까지 미끄러져요!\f나무 도마 화살표를 밟으면\n화살표 쪽으로 방향이 바뀌어요.\f레시피 순서대로 1.손 씻기 2.반죽하기\n3.굽기 자리에 멈춰 서고,\f칠판 수업 셋을 마치면\n화덕 옆 문이 열려요.\f꼬이면 오른쪽 종을 울려\n처음부터 다시!"),
    ...g7kids("gym3", "수현", hints),
    ...g7trainers("gym3"),
    ...g7gates("gym3", "gate_kitchen", () => !G.flag("g3open"), () => say("화덕 문이 닫혀 있다.\f레시피 1.2.3.과 칠판 수업 셋을\n마치면 열린다고 적혀 있다.")),
  ].filter(Boolean);
})();

// =====================================================================
// 4. 주홍 배움터 — 큰 별에서 차례로 잇는 별자리 · 가짜 별 · 구름 웅덩이 · 별빛 망원경
// =====================================================================
async function g7gate4(z) {
  const n = z + 1;
  if (G.flag("g4g" + n) || !G.flag("g4s" + n) || !G.flag("g4q" + n)) return false;
  G.flag("g4g" + n, true);
  await gymOpenGate("gym4_g" + n, "별빛 난간 문이 활짝 열렸다!");
  return true;
}
async function g7star(z, i) {
  const S = g7dev("gym4").stars[z], F = "g4s" + (z + 1);
  if (G.flag(F)) return;
  const k = G7.star[z];
  if (i === k) {
    G7.star[z]++; sfx(i === 0 ? "chime" : "cursor");
    if (i === 0) await say("큰 별을 밟았다!\f작은 별을 차례로 밟아\n별자리를 이어 보자.");
    if (G7.star[z] === S.length) {
      G.flag(F, true); await Audio2.jingle("jg_levelup");
      await say("별이 하나로 이어졌다!\n별자리가 바닥에서 반짝인다!");
      if (!(await g7gate4(z))) await say("칠판 수업을 마치면\n별빛 난간 문이 열린다.");
    }
    return;
  }
  if (k === 0) { if (i > 0) await say("작은 별이다.\f먼저 큰 별(☆)을 밟고\n차례로 이어 가자."); return; }
  if (i < k) return;          // 이미 이은 별을 다시 밟음
  await g7starReset(z, "순서가 엉켜서\n별빛이 흩어졌다…");
}
async function g7starReset(z, msg) {
  if (G.flag("g4s" + (z + 1))) return;
  sfx("flee_fail"); G7.star[z] = 0;
  const [x, y] = g7dev("gym4").stars[z][0];
  await say(msg + "\f처음 큰 별로 돌아가자!");
  await g6Teleport(x, y);
  G7.star[z] = 1;
}
async function g7scope() {
  if (!G.flag("g4q2")) { await say("별빛 망원경이다.\f칠판 수업(남원 생태도감)을 풀면\n불이 켜진다고 적혀 있다."); return; }
  sfx("chime"); G7.scopeT = 300;
  await say("망원경을 들여다보자\n바닥의 진짜 별이 반짝였다!\f(잠깐 동안만 빛나요.)");
}
(function setupGym4v227() {
  const M = MAPS.gym4, D = g7dev("gym4");
  g7setLeader("gym4", "sinha");
  const hints = ["별이: 큰 별(☆)부터 밟고\n작은 별을 번호 차례로 이어 봐!\f구름 웅덩이를 밟으면\n큰 별로 돌아가.",
    "한울: 이번 칸 별은 번호가 안 보여!\f오른쪽 망원경을 들여다보면\n진짜 별이 반짝일 거야.\f(칠판 문제를 먼저 풀어야\n망원경이 켜져.)",
    "은하: 길을 잃지 않으려면\n차례대로!\f마지막 별에서 위로 가면\n문이 있어."];
  G7GATE.gym4 = n => g7gate4(n - 1);
  M.checks = (M.checks || []).filter(c => typeof c[2] === "string" && c[1] <= 3)
    .concat(g7checks("gym4")).concat([[D.scope[0], D.scope[1], g7scope]]);
  M.triggers = D.stars.flatMap((S, z) => S.map(([x, y], i) => ({ x, y, run: () => g7star(z, i) })))
    .concat(D.fake.flatMap((L, z) => L.map(([x, y]) => ({ x, y, run: () => G7.star[z] > 0 ? g7starReset(z, "반짝… 하지만 가짜 별이었다!") : say("반짝… 가짜 별이다!") }))))
    .concat(D.cloud.flatMap((L, z) => L.map(([x, y]) => ({ x, y, run: () => G7.star[z] > 0 ? g7starReset(z, "구름 웅덩이를 밟아\n별빛이 흐려졌다…") : null }))));
  M.onLoad = () => { G7.star = [0, 0, 0]; G7.scopeT = 0; };
  M.under = (cx, cy) => {
    D.stars.forEach((S, z) => {
      const done = G.flag("g4s" + (z + 1)), k = done ? S.length : G7.star[z];
      if (k > 1) { g.strokeStyle = done ? "#fff0a0" : "#c8d8ff"; g.lineWidth = 1; g.beginPath();
        S.slice(0, k).forEach(([x, y], i) => { const px = x * 16 - cx + 8, py = y * 16 - cy + 8; i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.stroke(); }
      const glow = z === 1 && G7.scopeT > 0 && (G7.scopeT >> 3) & 1;
      S.forEach(([x, y], i) => {
        const px = x * 16 - cx, py = y * 16 - cy;
        if (i === 0) { rect(px + 2, py + 2, 12, 12, done || k > 0 ? "rgba(255,224,96,.35)" : "rgba(160,176,255,.25)"); }
        drawStar(px, py, i < k || glow, i === 0);
        if (i > 0 && z !== 1) Font.draw(g, String(i), px + 13, py + 9, { font: "g7", align: "center", col: "#c8d4ff", sh: null });
      });
      D.fake[z].forEach(([x, y]) => drawStar(x * 16 - cx, y * 16 - cy, false, false));
    });
    if (G7.scopeT > 0) G7.scopeT--;
  };
  M.npcs = [
    M.npcs.find(o => o && o.id === "sinha"),
    g7guide("gym4", "guide4", gym4GuideTalk, "도우미: 어서 와요! 여기는 주홍 배움터,\n지붕을 연 별 배움터예요.\f칸마다 큰 별(☆)을 먼저 밟고\n작은 별을 차례로 이으면 별자리가 돼요.\f가짜 별이나 구름 웅덩이를 밟으면\n큰 별로 돌아가요.\f별자리를 잇고 칠판 수업을 마치면\n별빛 난간 문이 열려요!"),
    ...g7kids("gym4", "신하", hints),
    ...g7trainers("gym4"),
    ...g7gates("gym4", "gate_star", i => !G.flag("g4g" + (i + 1)), i => say(G.flag("g4s" + (i + 1)) ? "별빛 난간 문이다.\f칠판 수업을 마치면 열린다." : "별빛 난간 문이 닫혀 있다.\f바닥의 별자리를 이으면\n열린다고 적혀 있다.")),
  ].filter(Boolean);
})();

// =====================================================================
// 5. 감청 배움터 — 레이저 + 거울 + 프리즘 셔터
// =====================================================================
(function () { const S = g7dev("gym5").stages; GYM5_STAGES.length = 0; S.forEach(s => GYM5_STAGES.push(s)); })();
function g7prismOpen() { return G.flag("g5q2") || G.flag("g7x_gym5_3"); }
function gym5Beam(i) {                       // v2.27 프리즘 셔터(닫히면 빛을 막음)
  const S = GYM5_STAGES[i], M = World.M; let [x, y, d] = S.emit; const pts = [[x, y]]; let hit = false;
  for (let n = 0; n < 80; n++) {
    const [dx, dy] = DIRS[d]; x += dx; y += dy;
    if (x === S.sensor[0] && y === S.sensor[1]) { pts.push([x, y]); hit = true; break; }
    if (S.prism && x === S.prism[0] && y === S.prism[1] && !g7prismOpen()) { pts.push([x - dx * 0.5, y - dy * 0.5]); break; }
    const m = gym5Mirror(x, y);
    if (m) { pts.push([x, y]); d = MIR_TURN[m.mirror][d]; continue; }
    if (S.prism && x === S.prism[0] && y === S.prism[1]) continue;
    if (x < 0 || y < 0 || x >= M.w || y >= M.h || M.solid[y][x]) { pts.push([x - dx * 0.5, y - dy * 0.5]); break; }
  }
  if (!pts.length || pts[pts.length - 1][0] !== x || pts[pts.length - 1][1] !== y) pts.push([x, y]);
  return { pts, hit };
}
async function g7gate5(n) {
  if (G.flag("g5g" + n) || !G.flag("g5b" + n) || !G.flag("g5q" + n)) return false;
  G.flag("g5g" + n, true);
  await gymOpenGate("gym5_g" + n, "유리 칸막이 문이 스르륵 열렸다!");
  return true;
}
async function gym5Check(n) {          // 감지기 살펴보기
  if (G.flag("g5b" + n)) { await say("감지기에 초록 불이 켜져 있다." + (G.flag("g5q" + n) ? "" : "\f칠판 수업을 마치면\n칸막이 문이 열린다.")); return; }
  await say("빛 감지기.\f레이저 빛이 닿으면\n초록 불이 켜진다.");
}
async function gym5MirrorTalk(a) {
  const n = a.stage + 1;
  if (G.flag("g5g" + n)) { await say("거울이 빛을 받아\n반짝이고 있다."); return; }
  a.mirror = a.mirror === "/" ? "\\" : "/"; sfx("select");
  await frames(6);
  if (gym5Beam(a.stage).hit && !G.flag("g5b" + n)) {
    G.flag("g5b" + n, true); sfx("chime");
    await say("빛이 감지기에 닿았다!\n띠링! 초록 불이 켜졌다!");
    if (!(await g7gate5(n))) await say("칠판 수업을 마치면\n칸막이 문이 열린다.");
  }
}
(function setupGym5v227() {
  const M = MAPS.gym5, D = g7dev("gym5");
  g7setLeader("gym5", "gisu");
  const hints = ["지후: 레이저 빛이 감지기에\n닿으면 불이 켜져!\f거울 앞에서 A를 누르면\n거울 방향이 바뀌어.\f칠판 수업도 풀어야\n문이 열려!",
    "서진: 가운데 프리즘은\n덮개가 닫혀 있어.\f칠판 문제를 풀면\n덮개가 열린대!",
    "하율: 거울이 다섯 개나 있어.\f왼쪽 두 개는 빛이 안 지나가는\n심술쟁이 거울이야!"];
  G7GATE.gym5 = async n => { if (n === 2 && !G.flag("g7x_gym5_3")) await say("어디선가 찰칵!\n프리즘 덮개가 열린 것 같다."); await g7gate5(n); };
  G7EXTRA.gym5 = async i => { if (i === 3) await say("어디선가 찰칵!\n프리즘 덮개가 열린 것 같다."); };
  M.checks = (M.checks || []).filter(c => typeof c[2] === "string" && (c[1] <= 3 || (c[0] >= 13 && c[1] >= 16)))
    .concat(g7checks("gym5"))
    .concat(D.stages.map((S, i) => [S.sensor[0], S.sensor[1], () => gym5Check(i + 1)]))
    .concat(D.stages.map(S => [S.emit[0], S.emit[1], "레이저 장치.\f빨간 빛이 곧게 뻗어 나간다.\n(눈으로 직접 보면 안 돼요!)"]))
    .concat([[6, 12, "실험대. 비커가 놓여 있다."], [7, 12, "실험대. 비커가 놓여 있다."], [8, 12, "실험대. 비커가 놓여 있다."],
             [3, 16, "개수대. '실험 뒤엔 꼭 손 씻기!'"], [4, 16, "개수대."], [3, 17, "개수대."], [4, 17, "개수대."]]);
  M.under = (cx, cy) => {
    const ts = World.M.ts, T = ts.js.t;
    for (let i = 0; i < GYM5_STAGES.length; i++) {
      const B = gym5Beam(i), S = GYM5_STAGES[i], on = (FRAME >> 2) & 1;
      g.save(); g.lineCap = "round";
      for (const [w, col] of [[4, on ? "rgba(255,90,70,.35)" : "rgba(255,90,70,.25)"], [2, "#ff5a46"], [1, "#ffe0d8"]]) {
        g.strokeStyle = col; g.lineWidth = w; g.beginPath();
        B.pts.forEach(([x, y], k) => { const px = x * TS + 8 - cx, py = y * TS + 8 - cy; if (k) g.lineTo(px, py); else g.moveTo(px, py); });
        g.stroke();
      }
      g.restore();
      if (B.hit || G.flag("g5b" + (i + 1))) { const k = T.sensor_on; if (k >= 0) tileAt(ts, k, S.sensor[0] * TS - cx, S.sensor[1] * TS - cy); }
    }
  };
  const old = M.npcs;
  M.npcs = [
    old.find(o => o && o.id === "gisu"),
    g7guide("gym5", "guide5", gym5GuideTalk, "도우미: 어서 와요, 도전자님!\n여기는 감청 배움터, 과학실이에요.\f레이저 장치의 빛을 거울로 꺾어서\n빛 감지기에 닿게 해 보세요.\f거울 앞에서 A를 누르면\n거울 방향이 바뀌어요.\f감지기에 불이 켜지고 그 칸 칠판 수업을\n마치면 유리 문이 열려요.\f가운데 프리즘은 수업을 풀면\n덮개가 열린답니다!"),
    ...g7kids("gym5", "기수", hints).map((o, i) => ({ ...o, talk: () => gym5KidTalk(GYM5_KIDS[i]) })),
    ...g7trainers("gym5"),
    ...g7gates("gym5", "gate_sci", i => !G.flag("g5g" + (i + 1)), i => say(G.flag("g5b" + (i + 1)) ? "유리 칸막이 문이다.\f칠판 수업을 마치면 열린다." : "유리 칸막이 문이 닫혀 있다.\f레이저 빛을 감지기에 닿게 하면\n열린다고 적혀 있다.")),
    ...D.stages.flatMap((S, si) => S.mirrors.map(([x, y, init], mi) => ({ id: `g5m${si}_${mi}`, x, y, stage: si, mirror: init, move: "fixed",
      special: (px, py) => { const T = TSET.in.js.t, a = World.actors.find(q => q.id === `g5m${si}_${mi}`); tileAt(TSET.in, a && a.mirror === "/" ? T.mirror_a : T.mirror_b, px, py); },
      talk: () => gym5MirrorTalk(World.actors.find(q => q.id === `g5m${si}_${mi}`)) }))),
    { id: "g5prism", x: D.stages[1].prism[0], y: D.stages[1].prism[1], move: "fixed",
      special: (px, py) => { const T = TSET.in.js.t; tileAt(TSET.in, g7prismOpen() ? T.prism_o : T.prism_c, px, py); },
      talk: () => say(g7prismOpen() ? "투명한 삼각 프리즘.\f빛이 무지개 빛깔로\n갈라져 보인다." : "금속 덮개로 닫힌 프리즘.\f칠판 문제를 풀면\n덮개가 열린다고 적혀 있다.") },
  ].filter(Boolean);
})();

// =====================================================================
// 6. 쑥빛 배움터 — 커튼 진찰 부스 + 답 번호 매트 + 보충 부스 + 시력검사표
// =====================================================================
function g7booth(b) {               // 부스 b의 매트 문제 → {Q, lesson n | 0, extra i}
  const D = g7dev("gym6"), qi = D.matq[b], L = D.lesson.indexOf(qi);
  return L >= 0 ? { Q: QUIZ6[L], n: L + 1, qi } : { Q: G7X.gym6[qi], n: 0, qi };
}
async function g7mat6(b, i) {
  const D = g7dev("gym6"), B = D.booths[b], { Q, n, qi } = g7booth(b), F = "g6b" + (b + 1);
  const go = async () => { const nx = D.booths[b + 1]; const [x, y] = nx ? nx.arrive : D.leaderArrive; await g6Teleport(x, y, nx ? null : "관장실로 왔다!\f초록 매트를 밟으면\n입구로 나갈 수 있어요."); };
  if (G.flag(F)) { if (i === Q.a) return go(); await g6Teleport(...B.arrive, "삐빅!\n이 매트는 이 부스 처음 자리로 가요."); return; }
  await say(`${i + 1}번 매트에 올라섰다!\f'${Q.opts[i]}'`);
  if (i === Q.a) {
    await g7Right(Q);
    if (n) { await say("정답 선물이야!"); await getItem(Q.gift); G.flag("g6q" + n, true); }
    else if (!G.flag("g7x_gym6_" + qi)) { G.flag("g7x_gym6_" + qi, true); await say("정답 선물이야!"); await getItem(Q.gift); }
    G.flag(F, true);
    await say("매트가 보랏빛으로 빛난다!");
    return go();
  }
  sfx("flee_fail");
  await say("삐빅! 매트가 깜빡이더니……");
  await g6Teleport(...B.wrong, "보충 부스로 왔다.\f초록 매트를 밟으면\n아까 부스로 돌아갈 수 있어요.");
}
async function g7home6(t) {
  const D = g7dev("gym6");
  if (t < 0) { await g6Teleport(7, 18, "초록 매트를 밟자\n입구로 돌아왔다."); return; }
  await g6Teleport(...D.booths[t].arrive, "초록 매트를 밟자\n아까 부스로 돌아왔다.");
}
async function g7board6(i) {
  const D = g7dev("gym6"), b = D.matq.indexOf(i);
  if (b < 0) return g7Extra("gym6", i);         // 보충 부스의 새 문제(맞히면 선물)
  const { Q } = g7booth(b);
  if (Q.board) await say(Q.board);
  await say(Q.q.replace(/\n/g, " ") + "\f" + Q.opts.map((o, k) => `${k + 1}. ${o}`).join("\n"));
  await say(G.flag("g6b" + (b + 1)) ? "판 구석에 '참 잘했어요!'\n도장이 찍혀 있다." : "답의 번호가 적힌 매트에\n올라서요!");
}
async function g7eye() {
  const { Q } = g7booth(3), n = Q.a + 1;
  await say("시력검사표다.\f고리(C)가 뚫린 쪽을 하나씩 읽어 보자……");
  await say(`맨 아랫줄 구석에 작은 글씨.\f'이 방 칠판의 답은 ${n}번'\f……보건 선생님의 힌트 같다!`);
}
(function setupGym6v227() {
  const M = MAPS.gym6, D = g7dev("gym6");
  M.rail = "curtain";
  g7setLeader("gym6", "yeosim");
  const hints = ["수아: 칠판을 읽고\n답의 번호가 적힌 매트에 서 봐.\f맞으면 다음 부스로 슝~!\n틀리면 보충 부스로 가.",
    "건우: 보충 부스에선\n초록 매트를 밟으면 돌아와.\f천천히 다시 풀면 돼!",
    "나윤: 마지막 부스엔\n시력검사표가 있어.\f잘 들여다보면 힌트가 보여!"];
  M.checks = (M.checks || []).filter(c => typeof c[2] === "string" && c[1] <= 3)
    .concat(D.q.map(([x, y], i) => [x, y, () => g7board6(i)]))
    .concat([[D.eye[0], D.eye[1], g7eye]]);
  M.triggers = D.booths.flatMap((B, b) => B.mats.map(([x, y], i) => ({ x, y, run: () => g7mat6(b, i) })))
    .concat(D.home.map(([x, y, t]) => ({ x, y, run: () => g7home6(t) })));
  M.over = (cx, cy) => {
    const ts = World.M.ts, T = ts.js.t;
    D.booths.forEach((B, b) => { if (!G.flag("g6b" + (b + 1))) return; const { Q } = g7booth(b); const [mx, my] = B.mats[Q.a]; const x = mx * 16 - cx, y = my * 16 - cy;
      rect(x + 11, y + 1, 4, 4, "#f8d040"); rect(x + 12, y, 2, 6, "#f8d040"); rect(x + 10, y + 2, 6, 2, "#f8d040"); });
    if (G6_GLOW && G6_GLOW.t > 0) { const k = T.warp_glow; if (k >= 0) { g.globalAlpha = Math.min(1, G6_GLOW.t / 10); tileAt(ts, k, G6_GLOW.x * TS - cx, G6_GLOW.y * TS - cy); g.globalAlpha = 1; } G6_GLOW.t--; }
  };
  M.npcs = [
    M.npcs.find(o => o && o.id === "yeosim"),
    g7guide("gym6", "guide6", gym6GuideTalk, "도우미: 어서 와요, 도전자님!\n여기는 쑥빛 배움터, 보건실이에요.\f커튼으로 나뉜 진찰 부스가 있어요.\n문이 없답니다!\f칠판을 읽고 답의 번호가 적힌\n매트에 올라서면 다음 부스로 슝!\f틀리면 보충 부스로 가요.\n초록 매트를 밟으면 돌아올 수 있어요."),
    ...g7kids("gym6", "여심", hints).map((o, i) => ({ ...o, talk: () => gym6KidTalk(GYM6_KIDS[i]) })),
    ...g7trainers("gym6"),
  ].filter(Boolean);
})();
