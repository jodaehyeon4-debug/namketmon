// ===== v2.36 미색 배움터(7관장 희주 · 강철) — '강철 공작실 · 톱니바퀴 철다리' · 박씨 어사패 (미결정 D13 → 클로드 결정, 사용자가 바꿀 수 있음) =====
// 바깥 겉모습(은빛 기와 · 미색 회벽 · 강철 띠쇠 · 톱니바퀴 문장)에 맞춘 안쪽: 담금물 물길이 칸을 가르고, 칸마다 칠판 수업의 정답 번호 톱니바퀴 손잡이를 당기면
//   철다리가 물길 위로 뻗어 나옴. 틀린 손잡이 = 톱니가 헛돌고 그 칸 짝꿍이 달려와 연습 배틀(한 번) + 힌트 (실제 포켓몬 퀴즈 체육관처럼 — 구조만)
//   칸 이름은 쇠를 다루는 차례: 달구기(화로) → 두드리기(모루) → 식히기(담금물 통) — 희주의 마음에 남는 대사 '달구고, 두드리고, 식히고'와 같음
// 수업 셋: 이야기(미색마을 설명회 — 제비는 봄에 돌아와 옛 둥지를 고쳐 다시 씀, 희주가 chapter8에서 한 말) · 생태(나무쪼 = 오색딱다구리, eco151) · 상성(강철 ← 불꽃·격투·땅)
// 새 문제 셋(확인된 일반 지식): 가야 = 쇠를 잘 다룬 나라('철의 왕국', 아영 고분 = 가야 무덤 · 세계유산) · 모루 · 담금질
// 희주(관장 문서 7번: 몹시 친절함·살짝 병약함·30대·육아로 바쁨, 단발·살짝 묶음, 육각 안경) — 사용자 D13: 안경은 수업할 때만(배움터 = 수업 중이라 씀, 어사패 뒤 수업이 끝나면 벗음)
//   말버릇(D12 가안, 클로드가 고름 — 사용자가 바꿀 수 있음): "천천히 해도 괜찮아요."
// 열리면 window.GYM7_READY = true → 조박사 귀환은 어사패 일곱, 리그 관문은 여덟(미결정 D19 되돌림)
// chapter26.js 뒤, pad.js 앞에 읽힘
"use strict";
window.GYM7_READY = true;

if (MV.flashcannon && !ITEMS.tm91) ITEMS.tm91 = { n: "기술머신91", p: "tm", price: 3000, nobuy: 1, tm: "flashcannon", ic: "tm",
  d: "러스터캐논을 가르쳐요. 몸의 빛을 한곳에 모아 쏘는 강철 타입 기술이에요. 상대의 특수방어를 떨어뜨릴 때가 있어요.",
  tmTypes: ["강철", "전기", "에스퍼", "물", "얼음", "노말", "드래곤"] };

const M7 = { pull: null, ext: null };
const m7D = () => MAPDATA.gym7.dev;
const m7done = z => G.flag("ms7q" + (z + 1));
const m7read = z => G.flag("ms7r" + (z + 1));

// ---- 수업 셋(정답 번호 = 손잡이 번호) ----
const QUIZ_M7 = [
  { board: "칠판: '오늘 있었던 일'\f금박재단은 리조트를 짓는다며\n처마 밑 제비 둥지를 치우려 했어요.",
    q: "봄에 돌아온 제비는\n옛 둥지를 어떻게 할까요?", opts: ["부수고 떠나요", "고쳐서 다시 써요", "다른 새에게 줘요"], a: 1, gift: "hyperpotion",
    good: "제비는 봄이면 먼 남쪽에서 돌아와\n옛 둥지를 고쳐 다시 쓰기도 해요.\f그래서 둥지를 남겨 두는 게\n제비를 맞는 인사래요.",
    hint: "희주 선생님이 설명회 날\n그러셨잖아.\f'옛 둥지를 ……해서\n다시 쓰는 일도 많대요.'" },
  { board: "칠판: '남원 생태도감'\f나무쪼의 모티브는 오색딱다구리.\n어깨에 큰 흰 무늬가 있는 새예요.",
    q: "오색딱다구리가 부리로 쪼아\n꺼내 먹는 것은?", opts: ["도토리", "나뭇잎", "나무속 애벌레"], a: 2, gift: "fullheal",
    good: "오색딱다구리는 부리로 나무를 쪼아\n숨은 애벌레를 꺼내 먹어요.\f봄에는 1초에 10번 넘게 두드려\n'여기는 내 땅' 하고 알린대요.",
    hint: "딱다구리가 '따다다닥'\n나무를 두드리는 건\f나무 속에 숨은\n먹이를 찾는 거래!" },
  { board: "칠판: '타입 상성'\f미색 배움터는\n강철 타입 배움터예요.",
    q: "강철 타입에게 효과가\n굉장한 기술 타입 셋은?", opts: ["불꽃·격투·땅", "물·전기·풀", "독·노말·얼음"], a: 0, gift: "charcoal",
    good: "강철 타입은 불꽃·격투·땅에 약해요!\f독 기술은 아예 안 통하고,\n노말·얼음·바위 기술도 잘 버텨요.",
    hint: "쇠는 화로 불에 녹고,\n주먹으로 두드리면 휘고,\f땅속 깊이 파묻히면\n꼼짝 못 하지!" },
];
// ---- 새 문제(맞히면 처음 한 번 선물) ----
const M7X = [
  { title: "가야와 쇠", q: "아영 고분을 남긴 옛 나라\n'가야'는 무엇으로 이름났을까?", opts: ["쇠(철)", "비단", "도자기"], a: 0, gift: "hyperpotion",
    good: "가야는 쇠를 잘 다뤄서\n'철의 왕국'이라고도 불려요.\f미색마을 고분 언덕의 옛 무덤도\n가야 사람들이 남긴 거예요." },
  { title: "모루", q: "대장간에서 달군 쇠를 올리고\n망치로 두드리는 쇠 받침은?", opts: ["맷돌", "모루", "절구"], a: 1, gift: "hyperpotion",
    good: "모루는 단단한 쇠 받침이에요.\f달군 쇠를 모루에 올리고\n망치로 땅땅 두드려 모양을 잡아요." },
  { title: "담금질", q: "달군 쇠를 물에 넣어\n빨리 식히는 일은?", opts: ["다림질", "바느질", "담금질"], a: 2, gift: "hyperpotion",
    good: "달군 쇠를 물에 '치익' 담가\n빨리 식히는 걸 담금질이라고 해요.\f담금질을 하면 쇠가\n더 단단해진대요." },
];

// ---- 미색반 짝꿍(칸마다 힌트 · 틀린 손잡이 → 달려와 연습 배틀) ----
const GYM7_KIDS = [
  { id: "m7k1", n: 1, spr: "kid_f",
    hint: "소은: 칠판 문제를 읽고\n정답 번호 손잡이를 당기면\f톱니가 돌면서\n철다리가 쭉 뻗어 나와!\f틀린 손잡이를 당기면?\n……내가 출동하지!",
    after: "소은: 화로 앞은 뜨거우니까\n두 걸음 떨어져서 봐야 해!",
    tr: { id: "gym7_soeun", cls: "미색반 짝꿍", name: "소은", spr: "kid_f", base: 20, team: [["namujjo", 36]],
      intro: "소은: 헛돈 톱니는\n배틀로 다시 맞추기!\f미색반 짝꿍 소은, 출동!", lose: "소은: 톱니가 딱 맞았다!" } },
  { id: "m7k2", n: 2, spr: "kid_m",
    hint: "도윤: 여긴 '두드리기' 칸이야.\n모루 소리, 땅땅!\f칠판 문제는 나무쪼 이야기.\n나무쪼는 딱다구리를 닮았대.",
    after: "도윤: 망치질은 세게보다\n똑같이 여러 번이 중요하대.",
    tr: { id: "gym7_doyun", cls: "미색반 짝꿍", name: "도윤", spr: "kid_m", base: 20, team: [["ttanggul", 36], ["yeopjeoni", 36]],
      intro: "도윤: 땅땅! 두드려 줄게!\f미색반 짝꿍 도윤이야!", lose: "도윤: 내가 두드려졌네……" } },
  { id: "m7k3", n: 3, spr: "student",
    hint: "하린: 마지막은 '식히기' 칸.\n달군 쇠를 물에 치익!\f상성 문제는 강철 이야기야.\n쇠가 무서워하는 게 뭘까?",
    after: "하린: 희주 선생님은 틀려도\n'천천히 해도 괜찮아요' 하셔.",
    tr: { id: "gym7_harin", cls: "미색반 짝꿍", name: "하린", spr: "student", base: 20, team: [["chamjipwang", 37], ["jipgeppul", 37]],
      intro: "하린: 선생님 앞 마지막 짝꿍!\f차갑게 식혀 줄게!", lose: "하린: 내가 식어 버렸어……" } },
];
// 체육관 트레이너(시선 배틀)
const M7TR = { cls: "미색반 친구", L: [
  ["junu", "준우", "kid_m", [["yeopjeoni", 36], ["namujjo", 36]], "화로 불보다 뜨거운\n내 배틀 받아라!", "앗, 뜨거!", "칠판 문제부터 읽고\n손잡이를 당겨!"],
  ["seoa", "서아", "kid_f", [["chamjipwang", 37]], "땅땅! 모루 소리\n들리지?", "망치를 놓쳤다……", "희주 선생님 첫 남켓몬은\n옛날 돈 엽전이래!"],
  ["minho", "민호", "student", [["ttanggul", 37], ["jangsuppul", 37]], "물길 건너기 전에\n나랑 한판!", "다리에서 미끄러졌다……", "땅 기술은 강철한테\n아주 잘 들어!"],
  ["yuna", "유나", "kid_f", [["jipgeppul", 38], ["yeopjeoni", 38]], "선생님 앞 마지막 관문!\n쉽게는 못 건너!", "선생님, 저 졌어요~", "워낭왕은 전기·강철.\n땅 기술이 아주 아주 잘 들어!"]] };
const M7TR_HEART = ["쇠도 처음엔 무른 덩어리래.\f두드리고 또 두드려야\n모양이 생긴대.", null, null, "희주 선생님은 아파도\n수업은 꼭 끝까지 하셔.\f대신 우리한텐 늘\n'천천히 해도 괜찮아요' 하시고."];

// ---- 지킴이 희주 ----
// bal_gym2(셋, 상처약 2, 짝 = 14번도로·인월·미색에서 잡히는 남켓몬 여덟 가지 중 둘, 30판):
//   처음 안(나무쪼 40 · 땅굴장 41 · 참집왕 41 · 워낭왕 43)은 Lv44 풀 0 · 불꽃 8 · 물 17% → 갈매(42–45)보다 앞이라 36–39로 낮추고
//   땅굴장 구멍파기 · 참집왕 셸블레이드(불꽃 스타팅에 너무 셈)를 뺌: Lv40 풀 33 · 불꽃 87 · 물 70%, Lv42 63 · 87 · 80%
//   (풀·페어리 스타팅은 강철에 약함 = 상성 수수께끼 — 짝꿍·칠판·문지기 힌트로 불꽃·격투·땅 안내, 상성 수업 선물 = 참숯)
const HEEJU7 = { id: "leader_heeju", cls: "지킴이", name: "희주", spr: "gl_heeju", type: "강철", indoor: true, bg: "indoor", base: 120, music: "eyes", bgm: "battle_gym",
  intro: "희주: 물길을 셋이나 건너왔네요.\n정말 잘했어요.\f달구고, 두드리고, 식히고……\n오늘 수업의 마지막은 배틀이에요.\f천천히 해도 괜찮아요.\n대신 끝까지 같이 가요!",
  lose: "희주: ……와.\n정말 단단해졌네요.\f선생님이 졌어요.\n천천히 해도 괜찮다고 했는데,\f벌써 이렇게 컸네요.",
  team: [["yeopjeoni", 36, { mv: ["spark", "metalsound", "irondefense", "rapidspin"] }],
         ["ttanggul", 37, { mv: ["metalclaw", "mudshot", "sandtomb", "sandattack"] }],
         ["chamjipwang", 37, { mv: ["bubblebeam", "metalclaw", "protect", "leer"] }],
         ["wonangwang", 39, { mv: ["flashcannon", "spark", "thunderwave", "metalsound"], item: "jujube" }]] };
const HJ7_HINT = [
  "희주: 또 와 줬네요. 고마워요.\f강철은 불꽃·격투·땅에 약해요.\n독 기술은 아예 안 통하고요.",
  "희주: 첫 엽전이는 철벽으로\n단단해져요.\f단단해지기 전에\n센 기술로 먼저 쓰러뜨려 봐요.",
  "희주: 마지막 워낭왕은\n전기·강철이에요.\f땅 기술이 아주 아주 잘 들어요.\n대추를 지녔으니 한 번에 몰아붙여요!",
];
async function heejuTalk7(a) {
  if (hasBadge(7)) {
    await say("희주: 천천히 해도 괜찮아요.\f……아, 이 말 또 했네요.\n선생님 입버릇이에요.");
    await say("희주: 강철도 처음부터\n단단했던 건 아니래요.\f뜨거운 불에 달구고, 두드리고,\n식히고…… 그러면서 단단해진대요.\f……사람도 그렇지 않을까요?");
    return;
  }
  const lost = G.flags.hj7_lost || 0;
  if (!lost) await say(`희주: 어서 와요, ${G.name}.\f……아, 이 안경이요?\n수업할 때만 써요.\f칠판 글씨가 잘 보이라고요.`);
  else await say(HJ7_HINT[Math.min(lost, HJ7_HINT.length) - 1]);
  const r = await trainerBattle({ x: a.x, y: a.y, dir: a.dir, trainer: HEEJU7 }, false);
  if (r !== "win") { G.flags.hj7_lost = lost + 1; return; }
  bgm("gym7");
  await say("희주: 이건 미색 배움터의\n'박씨 어사패'예요.");
  await getBadge(7, "희주");
  G.flag("badge7", true);
  await say("희주: 흥부는 다리 다친 제비를\n정성껏 고쳐 줬대요.\f이듬해 봄, 제비는 박씨 하나를\n물고 돌아왔고요.");
  await say("희주: 작은 박씨 하나가\n큰 박이 되었죠.\f오늘 건넌 다리 셋도\n작은 손잡이 하나에서 시작했어요.");
  await say("희주: 그리고 이것도요.");
  await getItem("tm91");
  await say("희주: 기술머신91 '러스터캐논'.\f몸의 빛을 한곳에 모아 쏘는\n강철 기술이에요.");
  await say("희주: 미색마을의 부탁은 하나예요.\f돌아올 자리를 남겨 두세요.\n제비에게도, 친구에게도.\f……그리고 나 자신에게도요.");
  await say("희주: 자, 오늘 수업은\n여기까지예요.");
  await say("희주가 안경을 벗어\n카디건 주머니에 넣었다.");
  a.spr = "heeju";
  await emote(a, "heart", 30);
  await say(G.flag("banya_event_done") ? "희주: 이제 갈매마을에 가 봐요.\f조박사님이 출장에서\n돌아오셨대요." : "희주: 인월 남쪽 15번도로를 지나면\n월백마을과 뱀사골이 나와요.\f조박사님도 곧 출장에서\n돌아오실 거예요. 힘내요!");
}

// ---- 칠판(수업) · 새 문제 ----
async function m7Lesson(z) {
  const Q = QUIZ_M7[z];
  if (m7done(z)) { await say("칠판 구석에 '참 잘했어요!'\n도장이 꾹 찍혀 있다."); return; }
  await say(Q.board);
  await say(Q.q);
  await say(`① ${Q.opts[0]}\n② ${Q.opts[1]}\f③ ${Q.opts[2]}`);
  await say("'정답 번호의 톱니바퀴 손잡이를\n당겨 보세요!'");
  G.flag("ms7r" + (z + 1), true);
}
async function m7Extra(z) {
  const Q = M7X[z], F = "ms7x" + (z + 1);
  await say(`칠판: '${Q.title}'`);
  const v = await quizAsk(Q.q, Q.opts);
  if (v < 0) { await say("(조금 더 생각해 보고\n다시 풀어 보자.)"); return; }
  if (v !== Q.a) { sfx("flee_fail"); await say(`땡! 정답은 '${Q.opts[Q.a]}'예요.`); await say(Q.good); return; }
  await g7Right(Q);
  if (!G.flag(F)) { G.flag(F, true); await say("새 문제를 맞힌 선물!"); await getItem(Q.gift); }
}
async function m7Board(i) {
  const L = m7D().lesson.indexOf(i);
  if (L >= 0) return m7Lesson(L);
  return m7Extra((i - 1) / 2);
}

// ---- 톱니바퀴 손잡이 · 철다리 ----
async function m7Lever(z, i) {
  const Q = QUIZ_M7[z], P = World.player;
  if (m7done(z)) { await say(i === Q.a ? "톱니바퀴 손잡이가 내려가 있다.\f물길 위에 철다리가\n튼튼하게 놓여 있다." : "톱니바퀴 손잡이다.\n이제 당길 필요는 없다."); return; }
  if (!m7read(z)) { await say(`${i + 1}번 톱니바퀴 손잡이다.\f'칠판 문제의 정답 번호를\n당기세요'라고 적혀 있다.`); await say("먼저 이 칸의 칠판 문제를\n읽어 보자."); return; }
  await say(`${i + 1}번 톱니바퀴 손잡이.\f'${Q.opts[i]}'`);
  if (!(await yes(`${i + 1}번 손잡이를 당길까요?`))) return;
  M7.pull = { z, i, down: true, spin: false };
  sfx("cast"); await frames(12);
  if (i === Q.a) {
    M7.pull.spin = true; sfx("door");
    await say("철컥!\f톱니바퀴가 드르르륵\n돌아가기 시작했다!");
    await m7Extend(z);
    M7.pull = null;
    G.flag("ms7q" + (z + 1), true);
    await Audio2.jingle("jg_levelup");
    await say("물길 위로 철다리가\n쭉 뻗어 나왔다!");
    const k = GYM7_KIDS[z], K = act(k.id);
    if (K) { face(K, P); await emote(K, "heart", 26); }
    await say(`${k.tr.name}: 딩동댕! 정답이야!`);
    await say(Q.good);
    await say("정답 선물이야!"); await getItem(Q.gift);
    return;
  }
  // 틀린 손잡이: 톱니가 헛돌고 짝꿍이 달려옴
  sfx("flee_fail");
  await say("덜컹!\f톱니바퀴가 헛돌더니\n손잡이가 제자리로 튕겨 올라갔다!");
  M7.pull = null;
  await m7KidRush(z);
}
async function m7KidRush(z) {
  const k = GYM7_KIDS[z], K = act(k.id), P = World.player, Q = QUIZ_M7[z];
  if (!K) { await say(Q.hint); return; }
  await emote(K, "excl", 22);
  const home = [K.x, K.y, K.dir];
  const nb = [[0, 1], [-1, 0], [1, 0], [0, -1]].map(([dx, dy]) => [P.x + dx, P.y + dy]).find(([x, y]) => (x === K.x && y === K.y) || !World.solidAt(x, y, K));
  if (nb && !(nb[0] === K.x && nb[1] === K.y)) await walkPath(K, nb[0], nb[1]);
  face(K, P); face(P, K);
  if (!G.flag("tr_" + k.tr.id)) {
    await say(`${k.tr.name}: 앗, 그 손잡이 아니야!\n톱니가 헛돌았잖아~`);
    const r = await trainerBattle({ x: K.x, y: K.y, dir: K.dir, trainer: k.tr }, false);
    if (r !== "win") return;
    await say(`${k.tr.name}: 그래도 배틀은 잘하네!\n힌트 줄게.`);
  } else await say(`${k.tr.name}: 또 헛돌았네~\n힌트 줄게!`);
  await say(`${k.tr.name}: ` + Q.hint);
  await walkPath(K, home[0], home[1]); K.dir = home[2];
}
async function m7Extend(z) {
  M7.ext = { z, k: 0 };
  for (let t = 1; t <= 36; t++) { M7.ext.k = t / 36; if (t % 9 === 0) sfx("jump"); await frames(1); }
  for (const p of [0, 1]) { const b = act("m7br" + z + p); if (b) b.hidden = true; }
  M7.ext = null;
}
async function m7GapTalk(z) {
  await say("담금물이 흐르는 물길이다.\f폭이 넓어서\n건널 수 없다.");
  await say(m7read(z) ? "칠판 문제의 정답 번호\n손잡이를 당겨 보자." : "이 칸 어딘가에서\n다리를 놓아야 할 것 같다.");
}
async function gym7GuideTalk() {
  if (hasBadge(7)) {
    if (!G.flag("guide7_gift")) { await say("도우미: 박씨 어사패, 축하해요!\f희주 선생님이 오늘 도전자는\n'서두르지 않고 끝까지 했다'고 하셨어요.\f……이건 제 선물이에요."); await getItem("moomoomilk", 2); G.flag("guide7_gift", true); return; }
    await say("도우미: 쇠도 사람도\n한 번에 단단해지지 않는대요.\f그러니까 오늘 못 한 건\n내일 하면 돼요."); return;
  }
  await say("도우미: 어서 와요, 도전자님!\n여기는 미색 배움터, 강철 공작실!\f칸마다 담금물 물길이 흘러서\n그냥은 못 건너요.\f칠판 문제를 읽고\n정답 번호 손잡이를 당기면\f톱니바퀴가 돌면서\n철다리가 쭉 뻗어 나와요.\f틀리면……\n짝꿍들이 달려올 거예요!");
}

// ---- 그리기 ----
function m7tile(i, x, y, h) {                       // 타일 아래쪽 h칸만(다리가 뻗어 나오는 중)
  const ts = TSET.in, s = ts.s || 1, C = TS * s; if (i == null || h <= 0) return;
  g.drawImage(ts.im, (i % 16) * C, Math.floor(i / 16) * C + (TS - h) * s, C, h * s, x, y + TS - h, TS, h);
}
function m7drawBridge(z, part) {                     // part 0 = 물길 위 칸, 1 = 아래 칸 — 다리가 놓이기 전엔 물길, 뻗는 중엔 아래부터 철판
  return (px, py) => {
    const T = TSET.in.js.t; px = Math.round(px); py = Math.round(py);
    tileAt(TSET.in, part ? T.rail_misaek_v : T.rail_misaek, px, py);
    const E = M7.ext && M7.ext.z === z ? M7.ext.k : 0;
    if (E > 0) { const vis = Math.max(0, Math.min(TS, Math.round(E * 2 * TS - (part ? 0 : TS)))); m7tile(part ? T.bridge7_b : T.bridge7_t, px, py, vis); }
  };
}
function m7drawLever(z, i) {
  return (px, py) => {
    const T = TSET.in.js.t, P = M7.pull; px = Math.round(px); py = Math.round(py);
    const on = P && P.z === z && P.i === i;
    const down = (m7done(z) && i === QUIZ_M7[z].a) || (on && P.down);
    const spin = (on && P.spin) || (M7.ext && M7.ext.z === z && i === QUIZ_M7[z].a) ? (FRAME >> 2) % 2 : 0;
    tileAt(TSET.in, T.lv7_base, px, py);
    tileAt(TSET.in, spin ? T.lv7_gear_b : T.lv7_gear_a, px, py - TS);
    tileAt(TSET.in, down ? T.lv7_hd_dn : T.lv7_hd_up, px, py - TS);
    Font.draw(g, String(i + 1), px + 8, py + 3, { font: "g7", align: "center", col: "#4a3c30", sh: null });
  };
}

(function setupGym7() {
  const D = m7D();
  const kids = GYM7_KIDS.map((k, i) => { const [x, y, dir] = D.kids[i]; k.x = x; k.y = y; k.dir = dir;
    return { id: k.id, x, y, spr: k.spr, dir, move: "fixed", heart: "미색반 짝꿍 " + k.tr.name, talk: () => gymKidTalkG(k, () => m7done(k.n - 1), "희주") }; });
  const trs = D.tr.map(([x, y, dir, range], i) => {
    const [id, name, spr, team, intro, lose, after] = M7TR.L[i];
    const o = { id: "gym7_t" + (i + 1), x, y, spr, dir, move: "fixed",
      trainer: { id: "gym7_" + id, cls: M7TR.cls, name, spr, range, base: 16, team, intro, lose, after: after + (M7TR_HEART[i] ? "\f" + M7TR_HEART[i] : ""), home: true } };
    if (M7TR_HEART[i]) o.heart = M7TR.cls + " " + name;
    return o; });
  const levers = D.levers.flatMap((L, z) => L.map(([x, y], i) => ({ id: `m7L${z}_${i}`, x, y, move: "fixed", special: m7drawLever(z, i), talk: () => m7Lever(z, i) })));
  const gaps = D.bridges.flatMap(([x, y], z) => [0, 1].map(p => ({ id: "m7br" + z + p, x, y: y + p, move: "fixed", special: m7drawBridge(z, p),
    show: () => !m7done(z), talk: () => m7GapTalk(z) })));
  const BR = new Set(D.bridges.flatMap(([x, y]) => [x + "," + y, x + "," + (y + 1)]));
  const BRT = new Set(D.bridges.map(([x, y]) => x + "," + y));
  const cells = (x0, y0, w, h, text) => { const o = []; for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) o.push([x0 + i, y0 + j, text]); return o; };
  const ST = { forge: "화로 속 숯불이 빨갛게\n이글거린다.\f쇠를 달구는 곳이다.\n가까이 가면 뜨겁다!",
    anvil: "모루다.\f달군 쇠를 올려놓고\n망치로 두드리는 쇠 받침이다.",
    quench: "물이 가득 담긴 통이다.\f달군 쇠를 '치익' 담가 식히는\n담금물 통이다.",
    shelf: "선반에 톱니바퀴와 볼트,\n망치와 집게가 가지런하다.",
    bench: "작업대 위에 작은 톱니바퀴와\n'오늘의 수업' 공책이 놓여 있다.\f맨 위에 '천천히, 끝까지'라고\n적혀 있다." };
  MAPS.gym7 = {
    rows: MAPDATA.gym7.rows, stamps: MAPDATA.gym7.stamps, indoor: true, name: "미색 배움터",
    floor: "floor_misaek", floor2: "floor_misaek2", wall: "wall_misaek", win: "win_misaek", rail: "rail_misaek",
    floorFn: (x, y) => BR.has(x + "," + y) ? (BRT.has(x + "," + y) ? "bridge7_t" : "bridge7_b") : ((x * 7 + y * 3) % 5 === 0 ? "floor_misaek2" : "floor_misaek"),
    bgm: "gym7", noPopup: true, exit: ["misaek", 7, 10, "down"],
    checks: [
      ...[6, 7, 8].map(x => [x, 1, "벽에 커다란 톱니바퀴 문장이\n걸려 있다.\f'미색 배움터 —\n달구고, 두드리고, 식히고'"]),
      ...cells(0, 19, 2, 2, ST.forge), ...cells(13, 19, 2, 2, ST.forge),
      ...[[4, 2], [3, 15], [7, 15], [10, 15]].map(([x, y]) => [x, y, ST.anvil]),
      ...[[6, 9], [8, 9]].map(([x, y]) => [x, y, ST.quench]),
      ...cells(0, 2, 2, 2, ST.shelf), ...cells(13, 2, 2, 2, ST.shelf), ...cells(12, 9, 2, 2, ST.shelf), ...cells(9, 2, 2, 1, ST.bench),
      ...D.q.map(([x, y], i) => [x, y, () => m7Board(i)]),
    ],
    npcs: [
      { id: "heeju7", x: D.leader[0], y: D.leader[1], get spr() { return hasBadge(7) ? "heeju" : "gl_heeju"; }, dir: "down", move: "fixed", talk: heejuTalk7, heart: "7관장 희주(어사패 뒤)", heartLeader: true },
      { id: "guide7", x: D.guide[0], y: D.guide[1], spr: "student", dir: D.guide[2], move: "look", talk: gym7GuideTalk, heart: "미색 배움터 도우미" },
      ...kids, ...trs, ...levers, ...gaps,
    ],
  };
  GYM7_KIDS[0].after += "\f소은: 다리는 한 번에 안 놓여.\n손잡이 하나씩, 칸 하나씩!";
  GYM7_KIDS[1].after += "\f도윤: 틀린 손잡이 당겨도 괜찮아.\n그래서 짝꿍이 있는 거야!";
  GYM7_KIDS[2].after += "\f하린: 뜨거울 땐 잠깐 식히는 것도\n단단해지는 방법이래.";
  if (typeof TOWN_ZONE !== "undefined") TOWN_ZONE["미색 배움터"] = "misaek";
})();

// =====================================================================
// 미색마을: 배움터 문을 엶(설명회 뒤) · 희주는 배움터 안에서 기다림
// =====================================================================
function m7DoorNow() {                    // 설명회가 끝난 그 자리에서 바로 문을 엶(다시 들어오면 도장 getter가 처리) — chapter22 g8DoorNow와 같은 방식
  const M = World.M; if (!M || G.map !== "misaek") return;
  const st = MAPS.misaek.stamps.find(s => s[0] === "gym7"); if (!st) return;
  const x = st[1] + 3, y = st[2] + 5;
  M.solid[y][x] = false; M.beh[y][x] = "door"; M.warps[x + "," + y] = ["gym7", 7, 22, "up"]; delete M.checks[x + "," + y];
}
(function attachChapter27() {
  const MS = MAPS.misaek;
  const st = MS.stamps.findIndex(s => s[0] === "gym7");
  if (st >= 0) {
    const s = MS.stamps[st];
    MS.stamps = MS.stamps.slice(); MS.stamps[st] = [s[0], s[1], s[2], {
      get to() { return G.flag("ms_event_done") ? ["gym7", 7, 22, "up"] : undefined; },
      get locked() { return G.flag("ms_event_done") ? undefined : "gym7_closed"; } }];
  }
  if (typeof LOCKS !== "undefined") LOCKS.gym7_closed = "문이 닫혀 있다.\f'미색 배움터 — 지킴이 잠깐 외출\n(아이 데려다주고 올게요)'";
  { const H = MS.npcs.find(n => n.id === "heeju"); if (H) H.show = () => false; }
  { const s = (MS.signs || []).find(s => typeof s[2] === "string" && s[2].includes("미색 배움터")); if (s) s[2] = "미색 배움터\n지킴이 희주 · 강철 타입\f'달구고, 두드리고, 식히고'"; }
})();
