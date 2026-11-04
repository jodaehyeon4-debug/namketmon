// ===== v1.4 첫 장: 춘향제(본디회 첫 등장) · 다홍 배움터(수업 퀴즈) · 지킴이 찬향 · 오작교 어사패 · 라이벌 =====
// maps.js 뒤에 읽힘: MAPS.world에 사람·트리거를 더하고, 배움터 지도(MAPS.gym)를 만든다.
"use strict";
const BADGE_N = ["오작교", "혼불", "섬진", "구룡", "산성", "장단", "박씨", "갈매"];
const hasBadge = n => (G.badges || []).includes(n);
const festDone = () => G.flag("festival_done");

// ---- 공용: 길 찾아 걷기 (막히면 순간 이동) ----
async function walkPath(a, x, y) {
  const p = findPath(a, x, y);
  if (p) await walk(a, p); else { a.x = x; a.y = y; }
}

// ---- 어사패 받기 화면 ----
async function getBadge(n, giver) {
  if (!hasBadge(n)) G.badges.push(n);
  let t = 0;
  const ov = new Overlay(() => {
    t++;
    g.fillStyle = "rgba(12,10,24,0.55)"; g.fillRect(0, 0, SW, 144);
    frame(72, 12, 112, 124);
    if (IMG.badges) { g.imageSmoothingEnabled = false; g.drawImage(IMG.badges, (n - 1) * 20, 0, 20, 20, 98, 22, 60, 60); }
    for (let i = 0; i < 8; i++) {
      const a = t / 24 + i * Math.PI / 4, r = 38 + Math.sin(t / 7 + i) * 3;
      if (((t >> 3) + i) % 3) rect(Math.round(128 + Math.cos(a) * r), Math.round(52 + Math.sin(a) * r * 0.75), 2, 2, i % 2 ? "#fff4b0" : "#ffffff");
    }
    Font.draw(g, BADGE_N[n - 1], 128, 92, { align: "center" });
    Font.draw(g, "어사패", 128, 108, { align: "center" });
  });
  Scenes.push(ov);
  const tb = await say(`${J(G.name, "은")} ${giver}에게서\n${BADGE_N[n - 1]} 어사패를 받았다!`, { keep: true });
  await Audio2.jingle("jg_badge");
  Scenes.pop(tb); Scenes.pop(ov);
}

// =====================================================================
// 1. 춘향제 마당 (광한루원 동문 건너편 x22~28, y2~8)
// =====================================================================
const BANGSAM = { id: "bondi_bangsam", cls: "본디회 단원", name: "방삼", spr: "grunt_m", base: 40, music: "bondi", bgm: "trainer",
  intro: "방삼: 꼬마야, 남켓몬을 볼에 넣고\n끌고 다니면 남켓몬이 힘들어!\f내가 본디대로 돌려놔 주지!",
  lose: "방삼: 으아악!\n항아리가 흔들린다……!",
  team: [["kkajak", 7], ["dolkongi", 6]] };
const DANJI = { id: "bondi_danji", cls: "본디회 단원", name: "단지", spr: "grunt_f", base: 40, music: "bondi", bgm: "trainer",
  intro: "단지: 방삼은 맨날 이래!\f이번엔 내 차례야.\n채비불, 꼬마를 깜짝 놀래 줘!",
  lose: "단지: 말도 안 돼……!\n우리 둘 다 졌잖아!",
  team: [["chaebibul", 8]] };

async function festivalEvent() {
  const P = World.player, C = act("ch_f"), B1 = act("bangsam"), B2 = act("danji"), boy = act("fest_boy");
  if (!C || !B1 || !B2) return;
  World.noBgm = false;
  if (!G.flag("fest_seen")) {
    bgm("festival");
    await say("둥 둥 둥—!\n북소리와 꽹과리 소리가\f춘향제 마당을 가득 채운다!");
    await say("여자아이: 우와,\n그네가 하늘까지 올라가!");
    await emote(C, "excl", 30); face(C, P);
    await say("찬향: 어머, 처음 보는 얼굴이네요?\n춘향제에 온 걸 환영해요!");
    await say("찬향: 나는 찬향이에요.\n다홍 배움터의 지킴이이자\f1학년 아이들의 담임 선생님이에요.");
    await say("찬향: 춘향이가 단옷날 그네를 타다가\n몽룡을 처음 만났다는 이야기, 알아요?\f그래서 춘향제에는 그네뛰기가\n빠지지 않는답니다.");
    G.flag("fest_seen", true);
  }
  // 소동
  bgm("bondi"); sfx("excl");
  B1.hidden = false; B2.hidden = false;
  await walk(B1, "left"); await walk(B2, "left");
  await say("남자아이: 으앙!\n내 까작이가 항아리 속으로……!");
  await emote(C, "excl", 24); face(C, B1); face(B1, C);
  await say("방삼: 본디대로—!\f우리는 본디회!\n남켓몬을 본디 있던 자리로 돌려보낸다!");
  await say("단지: 둥둥 북 치고 꽹꽹 꽹과리 치고……\n남켓몬들이 얼마나 놀랐겠어?\f항아리 안은 조용하고 아늑하거든.\n쉿~");
  await say("찬향: 잠깐만요!\n왜 그렇게 생각했을까요?\f그 아이가 항아리에 들어가고 싶은지\n물어보기는 했나요?");
  await say("방삼: 남켓몬이 말을 하나, 뭐!\f단지야, 시끄러운 꼬마부터 치우자!");
  face(C, P);
  await say(`찬향: ${G.name}, 도와줄 수 있어요?\n선생님은 아이들을 지킬게요!`);
  face(B1, P); face(P, B1);
  if (!G.flag("tr_" + BANGSAM.id)) {
    const r = await trainerBattle({ x: B1.x, y: B1.y, dir: B1.dir, trainer: BANGSAM }, false);
    if (r !== "win") return;
    await say("방삼: 으으……\n단지야, 네가 해!");
  }
  face(B2, P); face(P, B2);
  if (!G.flag("tr_" + DANJI.id)) {
    const r = await trainerBattle({ x: B2.x, y: B2.y, dir: B2.dir, trainer: DANJI }, false);
    if (r !== "win") return;
  }
  bgm("bondi");
  await say("단지: 이, 이럴 수가……!\n방삼, 항아리 뚜껑 열어!");
  sfx("ball_open"); if (boy) await emote(boy, "heart", 40);
  await say("까작이가 항아리에서 뛰쳐나와\n남자아이 품으로 날아들었다!");
  await say("방삼: 흥, 오늘은 춘향제라 봐준다!\f기억해라. 남켓몬은 본디\n있던 자리로 돌아가야 하는 법!");
  await say("방삼·단지: 본디대로—!");
  sfx("exit"); await fadeOut(10); B1.hidden = true; B2.hidden = true; await fadeIn(10);
  bgm("festival");
  face(C, P); face(P, C);
  await say(`찬향: ${G.name}, 고마워요!\n정말 용감했어요.`);
  await say("찬향: 남켓몬들이 많이 지쳤네요.\n선생님이 잠깐 돌봐 줄게요.");
  G.healAll(); await Audio2.jingle("jg_heal");
  await say("찬향: ……그런데요,\n저 사람들 말에도 생각해 볼 점이 있어요.\f큰 소리에 놀라는 남켓몬도\n정말 있거든요.\f하지만 남켓몬의 마음은 묻지 않고\n항아리에 가둬 버렸죠.");
  const v = await ask(`찬향: ${G.name}라면 어떻게 하면\n좋을 것 같아요?`, ["조용한 쉼터를 만들어요", "남켓몬 마음을 살펴요", "잘 모르겠어요"]);
  await say([
    "찬향: 좋은 생각이에요!\n왜 그렇게 생각했을까?\f……놀란 남켓몬이 쉴 곳이 있으면\n축제도, 남켓몬도 함께 지킬 수 있겠네요.",
    "찬향: 맞아요.\n왜 그렇게 생각했을까?\f……무엇을 좋아하고 무서워하는지\n살피면\f가두지 않고도\n지켜 줄 수 있지요.",
    "찬향: 괜찮아요. 모르는 걸 모른다고\n말하는 것도 용기예요.\f오늘 본 일을 기억해 두었다가\n천천히 같이 생각해 봐요."][v]);
  await say(`찬향: 참, ${G.name}도 트레이너죠?\f춘향제 일은 끝났으니\n배움터 문을 열어 둘게요.\f우리 배움터는\n'수업'부터 시작해요.\f오늘 보고 들은 것이\n모두 수업이 된답니다.\f준비가 되면 놀러 와요!`);
  G.flag("festival_done", true);
  const kid = act("gym_door_kid"); if (kid) kid.hidden = true;
  await walkPath(C, 25, 16); await walk(C, "up"); C.hidden = true; sfx("door");      // v2.24 배움터 문 아래
}

// =====================================================================
// 2. 다홍 배움터 (놀이터). 문 셋 = 수업판 문제. 틀리면 짝꿍과 배틀로 배운다
// =====================================================================
const QUIZ = [
  { board: "수업판: '수업 하나 · 오늘 있었던 일'\f춘향제 마당에서 본디회는\n남켓몬을 항아리에 넣었어요.",
    q: "본디회는 왜 그렇게 했다고\n말했을까요?", opts: ["돈을 벌고 싶어서", "축제 소리에 놀랄까 봐", "그냥 장난치려고"], a: 1, gift: "potion",
    good: "본디회는 북과 꽹과리 소리에\n남켓몬이 놀랄까 봐 걱정했대.\f걱정하는 마음은\n이해할 수 있어.\f하지만 묻지 않고 가둔 건\n잘못된 방법이지.\f상대가 왜 그렇게 했는지 아는 것,\n그게 오늘의 첫 수업이야!" },
  { board: "수업판: '수업 둘 · 남원 생태도감'\f1번도로에서 만난 제비꼬는\n'제비'를 닮은 남켓몬이에요.",
    q: "진짜 제비는 처마 밑에\n무엇으로 둥지를 지을까요?", opts: ["진흙과 침", "솔방울", "눈과 얼음"], a: 0, gift: "jujube",
    good: "제비는 진흙에 침을 섞어서\n밥그릇 모양 둥지를 지어.\f봄에 우리나라에 와서 새끼를 키우고\n가을이면 따뜻한 남쪽으로 떠나는 철새야.\f남켓몬을 잡으면 도감에서 ▶를 눌러\n'남원 생태도감'을 읽을 수 있어!" },
  { board: "수업판: '수업 셋 · 타입 상성'\f찬향 선생님의 남켓몬은\n모두 노말 타입이에요.",
    q: "노말 타입 기술이 하나도\n통하지 않는 타입은?", opts: ["고스트", "물", "풀"], a: 0, gift: "xattack",
    good: "노말 기술은 고스트 타입에게\n전혀 통하지 않아.\f바위·강철 타입에게는 반만 들어가고.\f광한루원에서 밤에 나오는\n채비불이 고스트 타입이야.\f1번도로의 돌콩이는 바위!\f그리고 노말 타입 남켓몬은\n격투 기술에 약해. 꼭 기억해!" },
];
const GYM_KIDS = [
  { id: "gk1", n: 1, x: 8, y: 16, dir: "left", spr: "kid_f",
    hint: "서아: 수업판 문제를 맞히면\n문이 열려!\f오늘 춘향제 마당에서 있었던 일,\n기억나?",
    after: "서아: 찬향 선생님은 우리가 틀려도\n'왜 그렇게 생각했어?' 하고 물어봐 주셔.",
    tr: { id: "gym1_seoa", cls: "배움터 짝꿍", name: "서아", spr: "kid_f", base: 20, team: [["daramball", 8], ["jjaekcham", 8]],
      intro: "서아: 좋아, 배틀로 알아보자!", lose: "서아: 와, 잘한다!" } },
  { id: "gk2", n: 2, x: 4, y: 11, dir: "up", spr: "kid_m",
    hint: "지호: 이번 문제는 남원 생태도감에서 나와!\f잡은 남켓몬은 도감에서 ▶를 누르면\n'남원 생태도감'을 볼 수 있어.",
    after: "지호: 나는 커서 생태연구소에서\n일할 거야. 윤슬 박사님처럼!",
    tr: { id: "gym2_jiho", cls: "배움터 짝꿍", name: "지호", spr: "kid_m", base: 20, team: [["kkajak", 9], ["daramball", 10]],
      intro: "지호: 내 까작이랑 다람볼이\n가르쳐 줄게!", lose: "지호: 으앗, 졌다!" } },
  { id: "gk3", n: 3, x: 10, y: 6, dir: "right", spr: "student",
    hint: "하준: 마지막 문제는 타입 상성!\f찬향 선생님 남켓몬은\n모두 노말 타입이야.",
    after: "하준: 찬향 선생님 남켓몬은 다 같이\n돌림노래를 불러. 한번 들어 봐!",
    tr: { id: "gym3_hajun", cls: "배움터 짝꿍", name: "하준", spr: "kid_m", base: 20, team: [["gorakong", 11]],
      intro: "하준: 내 고라콩은 두번차기를 써!\n격투 기술이지!", lose: "하준: 고라콩, 수고했어!" } },
];
function drawGate(x, y) { const T = JSN.tiles_in && JSN.tiles_in.t; if (!T || T.gate === undefined) return; tileAt(TSET.in, T.gate, Math.round(x), Math.round(y)); }

// v2.40 보기 섞기 — 사용자 "체육관 퀴즈에서 언제나 답이 1번임"(문제 자료가 거의 다 정답을 첫 보기에 둠)
// 보기 순서를 문제 글로 정해 섞음(같은 문제는 다시 물어도 같은 순서). 돌려주는 값은 '원래' 보기 번호라 Q.a와 비교하는 곳은 그대로.
// ○/×·예/아니요처럼 순서가 뜻인 보기는 섞지 않음. tail = 섞지 않고 끝에 붙이는 보기('잘 모르겠어요' 등, 번호는 opts 뒤로 이어짐)
const QUIZ_KEEP = /^(○|×|예|아니요|아니오)$/;
function quizOrder(text, n) {
  let h = 2166136261;
  for (const ch of text + "#nq" + n) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }   // "#nq" = 퀴즈 58문제의 정답 자리가 첫째·둘째·셋째 20·19·19로 고르고, 한 수업 안에서 같은 자리가 셋 잇따르지 않게 고른 값
  const idx = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) { h = (Math.imul(h ^ (h >>> 15), 2246822519) + 3266489917) >>> 0; const j = (h >>> 7) % (i + 1); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return idx;
}
async function quizAsk(text, opts, tail = []) {
  const ord = opts.every(s => QUIZ_KEEP.test(s)) ? opts.map((_, i) => i) : quizOrder(text, opts.length);
  const map = ord.concat(tail.map((_, k) => opts.length + k)), shown = map.map(i => i < opts.length ? opts[i] : tail[i - opts.length]);
  const tb = await say(text, { keep: true });
  const w = Math.max(56, ...shown.map(s => Font.width(s) + 30)), h = shown.length * 16 + 14;
  const v = await menu({ items: shown, x: 254 - w, y: 142 - h, w, cancel: true, qmap: map });
  Scenes.pop(tb); return v < 0 ? v : map[v];
}
async function openGate(n) {
  const gt = act("gate" + n); sfx("door");
  if (gt) { for (let i = 0; i < 4; i++) { gt.hidden = !gt.hidden; await frames(5); } gt.hidden = true; }
  G.flag("gq" + n, true);
  await say("수업 문이 활짝 열렸다!");
}
async function gymQuiz(n) {
  if (G.flag("gq" + n)) { await say("수업판에 '참 잘했어요!'\n도장이 꾹 찍혀 있다."); return; }
  const Q = QUIZ[n - 1], k = GYM_KIDS[n - 1], K = act(k.id), P = World.player, nm = k.tr.name;
  await say(Q.board);
  const v = await quizAsk(Q.q, Q.opts);
  if (v < 0) { await say("(조금 더 생각해 보고\n다시 풀어 보자.)"); return; }
  if (K) { face(K, P); await emote(K, v === Q.a ? "heart" : "quest", 26); }
  if (v === Q.a) {
    await Audio2.jingle("jg_levelup");
    await say(`${nm}: 딩동댕! 정답이야!\n왜 그렇게 생각했어? ……역시!`);
    await say(`${nm}: ` + Q.good);
    await say(`${nm}: 정답 선물이야!`); await getItem(Q.gift);
  } else {
    sfx("flee_fail");
    await say(`${nm}: 땡! 아쉽다~\f괜찮아, 틀리면서 배우는 거야.\n나랑 배틀하면서 같이 알아보자!`);
    if (!G.flag("tr_" + k.tr.id)) {
      const r = await trainerBattle({ x: K.x, y: K.y, dir: K.dir, trainer: k.tr }, false);
      if (r !== "win") return;            // 졌으면 센터로. 문은 닫힌 채
    }
    await say(`${nm}: 정답은 '${Q.opts[Q.a]}'였어!`);
    await say(`${nm}: ` + Q.good);
  }
  await openGate(n);
}
async function gymKidTalk(k) {
  const K = act(k.id);
  if (!G.flag("gq" + k.n)) { await say(k.hint); return; }
  if (!G.flag("tr_" + k.tr.id)) {
    if (await yes(`${k.tr.name}: 수업 문은 열렸어!\n연습 배틀 한 판 할래?`)) await trainerBattle({ x: K.x, y: K.y, dir: K.dir, trainer: k.tr }, false);
    else await say(`${k.tr.name}: 좋아, 찬향 선생님께 힘내!`);
    return;
  }
  await say(k.after);
}
async function gymGuideTalk() {
  if (hasBadge(1)) {
    if (!G.flag("guide_gift")) { await say("도우미: 오작교 어사패! 축하해요!\f이건 제 선물이에요.\n시원하게 마시고 힘내요!"); await getItem("freshwater", 2); G.flag("guide_gift", true); return; }
    await say("도우미: 찬향 선생님 말버릇, 알아요?\n'왜 그렇게 생각했을까?'\f저도 요즘 동생한테 따라 해요!"); return;
  }
  await say("도우미: 어서 와요, 도전자님!\n여기는 다홍 배움터예요.\f문 앞의 수업판 문제를 맞히면\n수업 문이 열려요.\f틀려도 괜찮아요. 옆에 있는 짝꿍과\n배틀하면서 배우면 되니까요!\f찬향 선생님은 노말 타입을 써요.\n노말 타입은 격투 기술에 약하답니다!");
}

// ---- 지킴이 찬향 ----
const CHANHYANG = { id: "leader_chanhyang", cls: "지킴이", name: "찬향", spr: "gl_chanhyang", type: "노말", indoor: true, bg: "indoor", base: 100, music: "eyes", bgm: "battle_gym",
  intro: "찬향: 다홍 배움터 지킴이 찬향!\n노말 타입의 기본기, 보여 줄게요!",
  lose: "찬향: 와아……! 정말 잘했어요!\f질문하고, 생각하고, 남켓몬을 믿었죠?\n그래서 이긴 거예요.",
  team: [["gorakong", 12, { ab: "runaway", mv: ["doublekick", "tackle", "growl"] }],
         ["dalgomkong", 13, { ab: "quickfeet", mv: ["round", "scratch", "leer", "tackle"], item: "jujube" }]] };
const CH_HINT = [
  "찬향: 다시 왔네요, {P}!\n지난번 배틀, 왜 졌는지 생각해 봤어요?\f노말 타입은 격투 기술에 약해요.\f바위·강철 타입은 노말 기술을 반만 받고\n고스트 타입은 아예 받지 않아요.\f그런 남켓몬을 데려오는 것도 방법이랍니다.",
  "찬향: 또 와 줬군요! 포기하지 않는 마음,\n선생님은 참 좋아해요.\f달곰콩은 대추를 지니고 있어요.\nHP가 반 아래로 내려가면 먹고 힘을 내죠.\f한 번에 세게 공격하는 것도 방법이에요.\f1번도로나 광한루원 풀숲에서\n레벨을 조금 올리고 오는 것도 좋아요.",
  "찬향: 좋아요, {P}!\n이번엔 어떤 작전이에요?\f상처약은 넉넉히 챙겼나요?\n만물상에서 고약을 살 수 있어요.\f작전을 세우고, 남켓몬을 믿어 봐요!",
];
async function chanhyangTalk(a) {
  if (hasBadge(1)) { await say(`찬향: ${G.name}, 오늘도 잊지 말아요.\n'왜 그렇게 생각했을까?'\f북쪽 2번도로를 지나 쪽빛마을에 가면\n미영 선생님의 배움터가 있어요.`); return; }
  const lost = G.flags.ch_lost || 0;
  if (!lost) {
    await say(`찬향: 어서 와요, ${G.name}!\f수업 문 세 개를\n모두 지나왔네요.\f정말 잘했어요!`);
    await say("찬향: 선생님 반 아이들은\n질문을 참 좋아해요.\f그래서 나도 늘 물어봐요.\n'왜 그렇게 생각했을까?'");
    await say("찬향: 남켓몬 배틀도 똑같아요.\f기술 하나를 고를 때도 이유가 있으면\n남켓몬과 더 가까워진답니다.");
  } else await say(CH_HINT[Math.min(lost, CH_HINT.length) - 1]);
  const r = await trainerBattle({ x: a.x, y: a.y, dir: a.dir, trainer: CHANHYANG }, false);
  if (r !== "win") { G.flags.ch_lost = lost + 1; return; }
  bgm("gym");
  await say("찬향: 약속대로, 이건 다홍 배움터의\n'오작교 어사패'예요.");
  await getBadge(1, "찬향");
  G.flag("badge1", true);
  await say("찬향: 어사패는 그 마을 사람들이\n'이 트레이너라면 믿을 수 있어' 하고\f건네는 약속의 표시예요.");
  await say("찬향: 다홍시티의 부탁은 딱 하나예요.\f어디를 가든, 남켓몬에게 먼저\n물어봐 주세요.\f'왜 그렇게 생각했니?' 하고요.");
  await say("찬향: 그리고 이건 선생님의 선물!");
  await getItem("tm48");
  await say("찬향: 기술머신48 '돌림노래'예요.\f한 사람이 부르면 다음 사람이\n이어 부르는 노래, 알죠?\f거의 모든 남켓몬이 배울 수 있어요.\n가방의 기술머신 주머니에서 써 봐요.");
  await say("찬향: 이제 북쪽 2번도로로 갈 수 있어요.\f쪽빛마을에는 그림을 그리는\n미영 선생님의 배움터가 있답니다.");
}

// =====================================================================
// 3. 첫 어사패 뒤: 북쪽 출구에서 라이벌 한결
// =====================================================================
const rival2 = () => ({ id: "rival2", cls: "라이벌", name: "한결", spr: "hangyeol", music: "rival", bgm: "trainer", base: 40,
  intro: "한결: 오작교 어사패, 반짝반짝하지?\f그럼 이제 누가 더 센지\n제대로 붙어 보자!",
  lose: "한결: 칫……!\n또 졌잖아!",
  team: [["kkajak", 12], [RIVAL_OF[G.starter] || "bulsap", 14]] });
async function rivalNorth() {
  const P = World.player, H = act("hangyeol_c1");
  if (!H) return;
  bgm("rival");
  await say(`???: 야, ${G.name}!`);
  P.dir = "down";
  H.x = P.x; H.y = Math.min(P.y + 4, 10); H.hidden = false;
  await walkTo(H, P.x, P.y + 1); face(H, P);
  await emote(H, "excl", 26);
  await say("한결: 너도 어사패 땄구나?\n……흥, 나도 아까 받았거든!");
  // v2.40 라이벌 배틀 줄이기(사용자: "너무 자주 싸움" → 지금의 70~80%): 한결 9번 → 7번. 교실에서 막 붙은 뒤라 여기선 말만
  await say("한결: 지금 당장 붙고 싶은데……\f엄마가 어사패 따면 바로\n집에 들러 보여 달랬거든.");
  await say("한결: ……야, 근데 너\n남켓몬이랑 언제 그렇게 친해졌냐?");
  await say("한결: 흥, 됐어.\n쪽빛마을에서 제대로 붙자!\f그때는 진짜 안 져!");
  await walkPath(H, P.x === 19 ? 20 : 19, 1); await walk(H, "up"); H.hidden = true;
  G.flag("rival2_done", true);
  const zi = World.zoneInfo(); if (zi.bgm) bgm(typeof zi.bgm === "function" ? zi.bgm() : zi.bgm);
}

// =====================================================================
// 지도에 붙이기
// =====================================================================
(function attach() {
  const W = MAPS.world;
  W.zones.splice(1, 0, ["춘향제 마당", 22, 2, 28, 8]);
  W.zinfo["춘향제 마당"] = { bgm: () => G.flag("dex") ? "festival" : "city", bg: "city" };
  W.areas = (W.areas || []).concat([
    { x0: 22, y0: 2, x1: 28, y1: 8, cond: () => G.flag("dex") && !festDone(), run: festivalEvent },
    { x0: 18, y0: 0, x1: 21, y1: 5, cond: () => hasBadge(1) && !G.flag("rival2_done"), run: rivalNorth },
  ]);
  W.checks.push(...[26, 27, 28].map(x => [x, 8, async () => {
    if (!G.flag("dex")) { await say("천막 아래 매대가 비어 있다.\n축제 준비가 한창이다."); return; }
    if (!G.flag("fest_gift")) { await say("떡집 할머니: 춘향제 구경 왔구나!\f옛다, 춘향제 기념 선물이란다."); await getItem("gift"); G.flag("fest_gift", true); return; }
    await say("떡집 할머니: 쑥떡, 꿀떡, 인절미!\n춘향제엔 떡이 빠질 수 없지.");
  }]));
  W.npcs.push(
    // 축제 준비 (도감 받기 전)
    { x: 25, y: 7, spr: "man", dir: "up", move: "look", show: () => !G.flag("dex"), talk: "춘향제 준비가 한창이야.\f그네에 새 동아줄도 매달았지!\n축제가 열리면 꼭 구경 오렴." },
    // 축제 (도감 받은 뒤)
    { id: "ch_f", x: 25, y: 6, spr: "gl_chanhyang", dir: "up", move: "fixed", show: () => G.flag("dex") && !festDone(), talk: () => say("찬향: 그네뛰기, 재밌어 보이죠?") },
    { id: "fest_girl", x: 22, y: 6, spr: "kid_f", dir: "right", move: "look", show: () => G.flag("dex"),
      talk: () => say(festDone() ? "그네를 높이 타면\n광한루원이 다 보인대!" : "우와, 그네가 하늘까지 올라가!") },
    { id: "fest_boy", x: 27, y: 5, spr: "kid_m", dir: "left", move: "look", show: () => G.flag("dex"),
      talk: () => say(festDone() ? "까작이를 구해 줘서 고마워!\f항아리 안에서 까작이가\n엄청 무서웠대……" : "춘향제 최고!") },
    { id: "bangsam", x: 28, y: 3, spr: "bondi", dir: "left", hidden: true, move: "fixed", show: () => G.flag("dex") && !festDone() },
    { id: "danji", x: 28, y: 4, spr: "bondi", dir: "left", hidden: true, move: "fixed", show: () => G.flag("dex") && !festDone() },
    // 배움터 문 앞 (춘향제 전)
    { id: "gym_door_kid", x: 32, y: 9, spr: "kid_f", dir: "down", move: "fixed", show: () => !festDone(),
      talk: () => say(G.flag("dex") ? "찬향 선생님은 춘향제 마당에 계셔!\f광한루원 동문 건너편,\n그네 있는 곳이야!" : "배움터는 지금 문을 닫았어.\f찬향 선생님은 춘향제 준비로\n바쁘시거든!") },
    // 라이벌 (어사패 뒤 북쪽 출구)
    { id: "hangyeol_c1", x: 19, y: 9, spr: "hangyeol", dir: "up", hidden: true, move: "fixed", show: () => hasBadge(1) && !G.flag("rival2_done") },
  );

  MAPS.gym = {
    rows: MAPDATA.gym.rows, stamps: MAPDATA.gym.stamps, indoor: true, name: "다홍 배움터", floor: "floor_gym", floor2: "floor_gym2", wall: "wall_gym", win: "win_gym",
    bgm: "gym", noPopup: true, exit: ["world", MAPDATA.world.doors.gym[0], MAPDATA.world.doors.gym[1], "down"],
    checks: [
      ...[[4, 16], [5, 16], [4, 17], [5, 17]].map(([x, y]) => [x, y, () => gymQuiz(1)]),
      ...[[1, 11], [2, 11], [1, 12], [2, 12]].map(([x, y]) => [x, y, () => gymQuiz(2)]),
      ...[[12, 6], [13, 6], [12, 7], [13, 7]].map(([x, y]) => [x, y, () => gymQuiz(3)]),
      [6, 1, "칭찬 스티커판에 별 스티커가\n빼곡하게 붙어 있다."], [7, 1, "칭찬 스티커판에 별 스티커가\n빼곡하게 붙어 있다."],
      [3, 1, "아이들이 그린 그림이다.\n해님, 꽃, 그리고 남켓몬!"], [4, 1, "아이들이 그린 그림이다.\n해님, 꽃, 그리고 남켓몬!"],
      [9, 1, "아이들이 그린 그림이다.\n'우리 반 남켓몬'이라고 적혀 있다."], [10, 1, "아이들이 그린 그림이다.\n'우리 반 남켓몬'이라고 적혀 있다."],
      [1, 7, "그네가 살랑살랑 흔들린다."], [2, 7, "그네가 살랑살랑 흔들린다."], [3, 7, "그네가 살랑살랑 흔들린다."],
      [11, 13, "미끄럼틀이다. 반짝반짝 닦여 있다."], [12, 13, "미끄럼틀이다. 반짝반짝 닦여 있다."],
      [1, 18, "모래놀이터에 모래성이 서 있다."], [2, 18, "모래놀이터에 모래성이 서 있다."], [3, 18, "모래놀이터에 모래성이 서 있다."],
    ],
    npcs: [
      { id: "chanhyang", x: 7, y: 3, spr: "gl_chanhyang", dir: "down", move: "fixed", talk: chanhyangTalk },
      { id: "guide", x: 10, y: 18, spr: "student", dir: "left", move: "look", talk: gymGuideTalk },
      ...GYM_KIDS.map(k => ({ id: k.id, x: k.x, y: k.y, spr: k.spr, dir: k.dir, move: "fixed", talk: () => gymKidTalk(k) })),
      ...MAPDATA.gym.gates.map(([x, y], i) => ({ id: "gate" + (i + 1), x, y, special: drawGate, move: "fixed", show: () => !G.flag("gq" + (i + 1)), talk: () => gymQuiz(i + 1) })),
    ],
  };
})();
