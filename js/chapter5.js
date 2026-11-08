// ===== v1.8 넷째 장: 요천대교 라이벌 5차전 · 7번도로(솔숲) · 송화마을(송동, 쉼터) · 11번도로(고갯길) · 주홍마을(주천) · 육모정 가람 ② · 주홍 배움터(4관장 신하) =====
// chapter4.js 뒤, hearts.js 앞에 읽힘
// 신하: 관장 문서 4번(단호함·낭만적·살짝 츤데레, 말버릇 "복도에서 누가 뛰어다니냐-!"는 사용자가 준 것). 대사는 D14에 따라 '가안'(맨 마지막에 사용자 확인)
"use strict";
const SD = MAPDATA.songhwa.doors, JD5 = MAPDATA.juhong.doors;
const exitS = k => ["songhwa", SD[k][0], SD[k][1], "down"];
const exitJH = k => ["juhong", JD5[k][0], JD5[k][1], "down"];

// ---- 출현표 (비색 20–23 → 7번도로 22–26 그대로 → 11번도로 25–28 → 주홍 26–28, 4관장 27–30) ----
DATA.spawns["11번도로"] = [
  { k: "dolkongi", lv: "25–28", t: "모두", r: "흔함" }, { k: "satbaso", lv: "25–28", t: "낮", r: "가끔" },
  { k: "jjidami", lv: "25–28", t: "낮", r: "가끔" }, { k: "gorakong", lv: "25–28", t: "저녁", r: "흔함" },
  { k: "sojjeokmi", lv: "25–28", t: "밤", r: "흔함" }, { k: "namujjo", lv: "26–28", t: "낮", r: "드묾" },
  { k: "kkumnoru", lv: "26–28", t: "모두", r: "드묾" }, { k: "ttakkeumi", lv: "25–28", t: "낮", r: "가끔" },
].filter(e => MON[e.k]);
DATA.spawns["주홍마을"] = [
  { k: "chireyong", lv: "26–28", t: "밤", r: "가끔" }, { k: "daseulmi", lv: "26–28", t: "밤", r: "흔함" },
  { k: "gaegulmi", lv: "26–28", t: "모두", r: "가끔" }, { k: "jjidami", lv: "26–28", t: "낮", r: "흔함" },
  { k: "dolkongi", lv: "26–28", t: "모두", r: "가끔" }, { k: "yeonbangul", lv: "26–28", t: "아침", r: "드묾" },
].filter(e => MON[e.k]);
(function fixTownLv5() { for (const r of DATA.town.routes || []) { if (r.no === 7) r.lv = "22~26"; if (r.no === 11) r.lv = "25~28"; } })();

// ---- 기술머신: 57 차지빔(주홍 수업 셋), 18 비바라기(신하 보상) ----
if (MV.chargebeam && !ITEMS.tm57) ITEMS.tm57 = { n: "기술머신57", p: "tm", price: 3000, nobuy: 1, tm: "chargebeam",
  d: "차지빔을 가르쳐요. 쓸 때마다 특수공격이 오를 때가 있는 전기 타입 기술이에요.", ic: "tm", tmTypes: ["전기", "노말", "강철", "에스퍼", "드래곤", "물", "불꽃", "벌레", "비행"] };
if (MV.raindance && !ITEMS.tm18) ITEMS.tm18 = { n: "기술머신18", p: "tm", price: 3000, nobuy: 1, tm: "raindance",
  d: "비바라기를 가르쳐요. 5턴 동안 비를 내려 물 기술을 세게, 불꽃 기술을 약하게 해요.", ic: "tm", tmTypes: ["물", "노말", "드래곤", "전기", "비행"] };

// =====================================================================
// 1. 비색마을 요천대교: 라이벌 한결 5차전 (섬진 어사패 뒤)
// =====================================================================
// bal_gym(셋, 상처약 2, 짝: 4·5번도로·갈매에서 잡히는 여덟 마리 중 둘): 풀 Lv25 30%·27 73% / 불꽃 Lv25 53%·26 67% / 물 Lv25 53%·26 63%
//   (라이벌 으뜸이 늘 상성 우위라 처음 안(으뜸 27·화염 기술) 풀 3~23%였음 → 으뜸 26, 기술 순하게, 둘째·셋째 24. 져도 진행)
const RIVAL5_MV = { chorongsap: ["flamecharge", "ember", "scratch", "growl"], kkumuri: ["waterpulse", "aquajet", "bite", "tailwhip"],
  kkotmong: ["magicalleaf", "megadrain", "mudshot", "growl"] };
const rival5 = () => { const k = RIVAL_EVO[RIVAL_OF[G.starter] || "bulsap"] || "chorongsap";
  return { id: "rival5", cls: "라이벌", name: "한결", spr: "hangyeol", music: "rival", bgm: "trainer", base: 40, canLose: true,
    loseText: "한결: 봤지?\n운동장 특훈의 결과다!",
    intro: "한결: 섬진 어사패?\n나도 땄어. 어제!\f이번엔 진짜 진심이다!",
    lose: "한결: ……하.\n또 졌네.",
    team: [["darijak", 30, { mv: ["wingattack", "quickattack", "pluck", "tailwind"] }],
           ["wonangwang", 30, { mv: ["spark", "chargebeam", "thundershock", "screech"] }],
           [k, 32, { mv: RIVAL5_MV[k] }]] }; };   // v2.55 스토리 난이도 +3
async function rivalBridge() {
  const P = World.player, H = act("hangyeol_c5");
  if (!H) return;
  bgm("rival");
  await say(`???: ${G.name}~!\n거기 서!`);
  P.dir = "left";
  H.x = Math.max(P.x - 4, 30); H.y = P.y; H.hidden = false;
  await walkTo(H, P.x - 1, P.y); face(H, P);
  await emote(H, "excl", 26);
  await say("한결: 요천대교 건너기 전에\n한 판 하자!\f교장 선생님이랑 운동장\n스무 바퀴 돌고 왔거든!");
  // v2.40 라이벌 배틀 줄이기: 갈매(4차전) 바로 뒤라 여기선 말만
  await say("한결: ……라고 하려 했는데!\f교장 선생님이 다리 건너서\n주홍마을 가는 길부터 살펴보래.\f배틀은 다음에 제대로 하자!");
  await say("한결: 나 사실 지는 거\n진짜 싫어.\f근데 너한테 지고 나면\n뭘 더 해야 할지가 보여.\f……그러니까 너도 지지 마!\n알았지?");
  await say("한결: 송화마을 지나서\n주홍마을 간다!\f거기 지킴이 선생님은 비를\n부른대. 우산 챙겨!");
  await walkPath(H, 41, 21); sfx("exit"); H.hidden = true;
  G.flag("rival5_done", true);
  zoneBgm();
}

// =====================================================================
// 2. 주홍마을 육모정: 가람 ② · 지킴이 신하 첫 등장
// =====================================================================
// 설정집: 가람은 만날 때마다 그 지역 친구들로 팀이 바뀜(② 찌다미·꿈노루·채비불). 져도 진행
const GARAM2 = { id: "garam2", cls: "도령", name: "가람", spr: "garam", base: 40, music: "garam", bgm: "trainer", canLose: true,
  loseText: "가람: ……괜찮아.\n쉬게 해 줄게.",
  intro: "가람: 그럼 들려줘.\n네 친구들 목소리.",
  lose: "가람: ……또 들렸어.\f'이 아이 옆이 좋다'고.",
  team: [["jjidami", 25, { mv: ["spark", "voltswitch", "growl", "quickattack"] }], ["kkumnoru", 25, { mv: ["psybeam", "confusion", "yawn", "tackle"] }],
         ["chaebibul", 26, { mv: ["hex", "shadowpunch", "confuseray", "lick"] }]] };
async function garam2Event() {
  const P = World.player, A = act("garam2_f"), S = act("sinha_f");
  if (!A || !S) return;
  World.noBgm = false; bgm("garam");
  await say("……졸졸졸.\f육모정 아래로 냇물 소리가 들린다.\n누군가 정자에 걸터앉아 있다.");
  await walkPath(P, 27, 30); P.dir = "up";
  face(A, P); await emote(A, "quest", 26);
  await say("가람: ……또 만났네.\f여기 구룡계곡에는\n아홉 마리 용이 살았다고 전해져.");
  await say("가람: 지금은 치레뇽도\n잘 안 보여.\f사람들이 계곡에 두고 간 것들 때문에\n물이 흐려졌거든.");
  await say("가람: 치레뇽은 맑고 찬 물에서만\n숨을 쉴 수 있어.\f……사람 곁은, 남켓몬한테\n너무 시끄럽고 더러운 걸까?");
  await say(`가람: ${G.name}.\n네 남켓몬은 행복해?`);
  const r = await trainerBattle({ x: A.x, y: A.y, dir: A.dir, trainer: GARAM2 }, false);
  G.flag("tr_" + GARAM2.id, true);
  bgm("garam");
  if (r === "win") await say("가람: ……이상하다.\f네 남켓몬들은\n너를 걱정하고 있어.\f지는 것보다\n그게 더 싫대.");
  else { await say("가람이 쓰러진 남켓몬들에게\n가만히 손을 얹었다……"); G.healAll(); await Audio2.jingle("jg_heal"); await say("남켓몬들이 기운을 되찾았다!"); }
  // 신하 등장
  sfx("excl");
  await say("???: 거기!\n계곡에서 누가 뛰어다니냐-!");
  S.hidden = false; S.x = 27; S.y = 21;
  await walkPath(S, 26, 29); face(S, A); face(A, S); face(P, S);
  World.noBgm = false; bgm("gym4");
  await say("신하: ……아, 뛰어다닌 건 아니었네.\f주홍 배움터 지킴이, 신하.\n별 보러 나왔다가 소리가 나서.");
  await say("신하: 너, 치레뇽 걱정하는 거야?\f그럼 사람을 떼어 놓을 게 아니라\n쓰레기를 치워야지.\f……내일 아침 아이들이랑\n계곡 청소한다. 너도 와.");
  await say("가람: ……사람들이, 치운다고?");
  await say("신하: 흥, 늘 그런 건 아니야.\n그래도 하는 사람은 있어.");
  await say("가람: ……기억해 둘게.");
  sfx("exit"); await fadeOut(8); A.hidden = true; await fadeIn(8);
  await say("(가람은 냇물을 따라\n구룡계곡 쪽으로 사라졌다……)");
  face(S, P);
  await say(`신하: ……딱히 네가 걱정돼서\n나온 건 아니야.\f별 보러 나왔을 뿐이라고.`);
  await say("신하: 배움터는 지붕을 열어 뒀어.\n오늘 밤엔 비가 올 거야.\f비 속의 물 남켓몬,\n각오하고 와.");
  G.flag("garam2_done", true);
  const kid = act("gym4_door_kid"); if (kid) kid.hidden = true;
  await walkPath(S, 27, 9); await walk(S, "up"); S.hidden = true; sfx("door");
  zoneBgm();
}

// =====================================================================
// 3. 주홍 배움터(지붕을 연 별 배움터): 수업 문 셋 → 신하 → 구룡 어사패
// =====================================================================
const QUIZ4 = [
  { board: "수업판: '수업 하나 · 오늘 있었던 일'\f육모정에서 도령 가람과\n신하 선생님을 만났어요.",
    q: "가람은 왜 계곡에서 치레뇽이\n줄었다고 했나요?", opts: ["계곡물이 흐려져서", "날씨가 더워서", "먹이가 너무 많아서"], a: 0, gift: "superpotion",
    good: "치레뇽은 맑고 찬 물에서만 살아.\f계곡에 쓰레기를 두고 가면\n그 물을 같이 쓰는 모두가 힘들어져.\f그래서 신하 선생님 말씀!\n'가져온 건 가져가기!'" },
  { board: "수업판: '수업 둘 · 남원 생태도감'\f신하 선생님의 치레뇽은\n꼬리치레도롱뇽을 닮았어요.",
    q: "꼬리치레도롱뇽은 무엇으로\n숨을 쉴까요?", opts: ["피부", "아가미", "커다란 허파"], a: 0, gift: "freshwater",
    good: "꼬리치레도롱뇽은 허파가 없어서\n피부로 숨을 쉬어.\f그래서 차고 산소가 많은\n계곡 물에서만 살 수 있대.\f한반도에만 사는\n귀한 도롱뇽이야!" },
  { board: "수업판: '수업 셋 · 타입 상성'\f신하 선생님의 남켓몬은\n모두 물 타입이에요.",
    q: "물 타입에게 효과가\n굉장한 기술 타입은?", opts: ["불꽃", "땅", "전기"], a: 2, gift: "tm57",
    giftAlways: "은하: 이거 줄게!\n기술머신57 '차지빔'이야.",
    good: "전기와 풀 기술이 물에게 잘 통해.\f그리고 오늘 밤엔 비가 와!\f비가 오면 물 기술이 세지고\n불꽃 기술은 약해져.\f쾌청이나 모래바람으로\n날씨를 바꿀 수도 있어.\f비는 다섯 턴이 지나면 그치니까\n버티는 것도 방법이야!" },
];
const GYM4_KIDS = [
  { id: "g4k1", n: 1, x: 8, y: 16, dir: "left", spr: "kid_f",
    hint: "별이: 수업판 문제를 맞히면\n문이 열려!\f아까 육모정에서 가람이\n뭐라고 했는지 기억나?",
    after: "별이: 신하 선생님은 맨날 '흥!' 하시는데\n우리 이름은 하나도 안 틀리셔.",
    tr: { id: "gym4_byeori", cls: "천문반 짝꿍", name: "별이", spr: "kid_f", base: 20, team: [["daseulmi", 27], ["jjidami", 27]],
      intro: "별이: 별자리처럼\n차근차근 이어 볼까?", lose: "별이: 별똥별처럼\n휙 졌다……" } },
  { id: "g4k2", n: 2, x: 4, y: 11, dir: "up", spr: "kid_m",
    hint: "한울: 이번 문제는 남원 생태도감!\f치레뇽을 잡았다면\n도감에서 ▶를 눌러 봐.",
    after: "한울: 치레뇽은 밤에 나와.\n회중시계로 밤을 만들어 봐!",
    tr: { id: "gym4_hanul", cls: "천문반 짝꿍", name: "한울", spr: "kid_m", base: 20, team: [["gaegulmi", 28], ["chireyong", 28]],
      intro: "한울: 비 오는 밤엔\n물 남켓몬이 신난다!", lose: "한울: 우산이 뒤집혔다……" } },
  { id: "g4k3", n: 3, x: 10, y: 6, dir: "right", spr: "kid_f",
    hint: "은하: 마지막은 타입 상성!\f신하 선생님 남켓몬은\n모두 물 타입이야.\f물은 불꽃이랑 땅에는 강한데……\n무엇에 약할까?",
    after: "은하: 비 오는 날엔 별이 안 보이잖아.\f근데 선생님이 그러셨어.\n'안 보여도 거기 있어.'",
    tr: { id: "gym4_eunha", cls: "천문반 짝꿍", name: "은하", spr: "kid_f", base: 20, team: [["eunchimi", 28], ["daseulmi", 29]],
      intro: "은하: 은하수처럼 길게\n버텨 볼게!", lose: "은하: 은하수가\n끊어졌다……" } },
];
async function gym4Quiz(n) {
  const F = "g4q" + n;
  if (G.flag(F)) { await say("수업판 구석에 반짝이는 별 스티커가\n'참 잘했어요' 대신 붙어 있다."); return; }
  const Q = QUIZ4[n - 1], k = GYM4_KIDS[n - 1], K = act(k.id), P = World.player, nm = k.tr.name;
  await say(Q.board);
  const v = await quizAsk(Q.q, Q.opts);
  if (v < 0) { await say("(조금 더 생각해 보고\n다시 풀어 보자.)"); return; }
  if (K) { face(K, P); await emote(K, v === Q.a ? "heart" : "quest", 26); }
  if (v === Q.a) {
    await Audio2.jingle("jg_levelup");
    await say(`${nm}: 딩동댕! 정답이야!`);
    await say(`${nm}: ` + Q.good);
    await say(`${nm}: 정답 선물이야!`); await getItem(Q.gift);
  } else {
    sfx("flee_fail");
    await say(`${nm}: 땡! 아쉽다~\f괜찮아, 구름 낀 날도 있는걸.\n배틀하면서 같이 알아보자!`);
    if (!G.flag("tr_" + k.tr.id)) {
      const r = await trainerBattle({ x: K.x, y: K.y, dir: K.dir, trainer: k.tr }, false);
      if (r !== "win") return;
    }
    await say(`${nm}: 정답은 '${Q.opts[Q.a]}'였어!`);
    await say(`${nm}: ` + Q.good);
    if (Q.giftAlways && !G.has(Q.gift)) { await say(Q.giftAlways); await getItem(Q.gift); }
  }
  const gt = act("g4gate" + n); sfx("door");
  if (gt) { for (let i = 0; i < 4; i++) { gt.hidden = !gt.hidden; await frames(5); } gt.hidden = true; }
  G.flag(F, true);
  await say("별빛 난간 문이 활짝 열렸다!");
}
async function gym4KidTalk(k) {
  const K = act(k.id);
  if (!G.flag("g4q" + k.n)) { await say(k.hint); return; }
  if (!G.flag("tr_" + k.tr.id)) {
    if (await yes(`${k.tr.name}: 수업 문은 열렸어!\n연습 배틀 한 판 할래?`)) await trainerBattle({ x: K.x, y: K.y, dir: K.dir, trainer: k.tr }, false);
    else await say(`${k.tr.name}: 좋아, 신하 선생님께 힘내!`);
    return;
  }
  await say(k.after);
}
async function gym4GuideTalk() {
  if (hasBadge(4)) {
    if (!G.flag("guide4_gift")) { await say("도우미: 구룡 어사패! 축하해요!\f신하 선생님이 '흥' 하고 돌아서실 때\n웃고 계셨던 거, 봤어요?\f……이건 제 선물이에요."); await getItem("lemonade", 2); G.flag("guide4_gift", true); return; }
    await say("도우미: 맑은 날 밤에 오면\n지붕 틈으로 은하수가 보여요."); return;
  }
  await say("도우미: 어서 와요, 도전자님!\n여기는 주홍 배움터예요.\f별이 보이게 지붕을 열어 뒀는데……\n오늘 밤엔 비가 들이치네요.\f별빛 난간 문 앞의 수업판 문제를 맞히면\n문이 열려요.\f신하 선생님은 물 타입, 그리고 비!\n전기·풀 기술을 챙겨 가요!");
}

// ---- 지킴이 신하 (trainers.js의 LEADERS.sinha: 비 전략·가안 대사, 팀은 실제 배틀로 다시 맞춤) ----
// v1.3 팀(치레뇽 27·은치미 28·개굴미 29·메기장 30)은 bal_gym(셋, 상처약 2)에서 불꽃·물 스타팅 0~10%:
//   메기장(물·땅)은 전기가 안 들고, 쓱쓱 은치미가 빗속에서 너무 빠름. → 셋(치레뇽·다슬미·개굴미, Lv26–28), 잔비 치레뇽은 그대로
//   측정: 셋 풀 Lv28 100% · 불꽃 Lv28 77%·29 63%(기술머신57 차지빔) · 물 Lv28 93%
// v2.56 사용자 "스토리 너무 쉬움, 특히 3~4관장" · "최종진화체를 몇 개" → 넷(29·28·28·31)의 비 팀, 에이스는 은치미 최종 진화 은린왕
//   잔비 치레뇽 → 촉촉바디 개굴미 · 메기장(물·땅: 전기가 안 듦, 풀로!) · 은린왕(물·에스퍼) · 실력자 AI · 쌍화탕 1개 · 타고난 힘 20
//   bal_gym3(다섯, 쌍화탕 3, 풀·물 = 베놈쇼크, 짝 = 스타팅 −4): 스타팅 Lv34(레벨 차이 경험치로 오는 길을 다 이긴 레벨) 풀 100 · 불꽃 19 · 물 56% / Lv36 100 · 94 · 100%
//   (쓱쓱 은린왕 34·물먹은돌 안은 불꽃 0~6%라 뺌 — 불꽃은 물 배움터가 가장 어려운 짝, 실제 게임처럼)
const SINHA4_TEAM = [["chireyong", 29, { ab: "drizzle", mv: ["bubblebeam", "dragonbreath", "raindance", "leer"] }],
                     ["gaegulmi", 28, { ab: "hydration", mv: ["waterfall", "bodyslam", "raindance", "leer"] }],
                     ["megijang", 28, { ab: "hydration", mv: ["mudshot", "waterpulse", "raindance", "tickle"] }],
                     ["eunrinwang", 31, { ab: "aromaveil", mv: ["waterfall", "psychicnoise", "supersonic", "raindance"] }]];
const SINHA4_X = { iv: 20, items: ["superpotion"] };
const SN_HINT = [
  "신하: 또 왔어?\n……기다린 건 아니고.\f물에는 전기와 풀이 잘 통해.\n11번도로 고갯길에 찌다미가 살아.",
  "신하: 비가 오면 물 기술이 세져.\f쾌청으로 해를 띄우거나,\n다섯 턴만 버텨 봐. 비는 그쳐.",
  "신하: 치레뇽은 나오자마자\n비를 불러.\f메기장은 물·땅이라 전기가 안 통해.\n대신 풀은 네 배야.\f마지막 은린왕은 물·에스퍼.\n전기·풀·벌레·고스트·악이 잘 들어.\f……이 정도면 됐지?",
];
async function sinhaTalk(a) {
  if (hasBadge(4)) { await say(`신하: ${G.name}. ……흥.\f맑은 밤에 또 와.\n별, 보여 줄 테니까.`); return; }
  const lost = G.flags.sn_lost || 0;
  if (lost) await say(SN_HINT[Math.min(lost, SN_HINT.length) - 1]);
  const T = Object.assign({}, LEADERS.sinha, SINHA4_X, { cls: "지킴이", team: SINHA4_TEAM });
  const r = await trainerBattle({ x: a.x, y: a.y, dir: a.dir, trainer: T }, false);
  if (r !== "win") { G.flags.sn_lost = lost + 1; return; }
  bgm("gym4");
  await getBadge(4, "신하");
  G.flag("badge4", true);
  await say("신하: 구룡계곡에는 아홉 마리 용이\n살았다고 전해져.\f하늘로 올라가려고\n오래오래 기다렸대.");
  await say("신하: 주홍마을의 부탁은 하나야.\f비 오는 날에도\n하늘을 올려다봐.\f구름 뒤에 별은\n그대로 있으니까.");
  await say("신하: 그리고…… 이거.\n딱히 주고 싶어서 주는 건 아니야.");
  await getItem("tm18");
  await say("신하: 기술머신18 '비바라기'.\f비를 부르는 건 쉬워.\n그칠 때까지 버티는 게 어렵지.");
  await emote(a, "heart", 30);
}

// =====================================================================
// 지도에 붙이기
// =====================================================================
(function attachRoute7Songhwa11Juhong() {
  // ---- 비색마을 동쪽: 요천대교 너머 7번도로 열기(섬진 어사패 뒤) ----
  const BS = MAPS.bisaek;
  for (const w of BS.npcs.filter(o => /^bs_worker/.test(o.id || ""))) w.show = () => !hasBadge(3);
  BS.warps = (BS.warps || []).concat([21, 22].map(y => [43, y, ["route7", 0, y - 7, "right", "edge"]]));
  BS.areas = (BS.areas || []).concat([{ x0: 38, y0: 18, x1: 39, y1: 25, cond: () => hasBadge(3) && !G.flag("rival5_done"), run: rivalBridge }]);
  BS.npcs.push({ id: "hangyeol_c5", x: 32, y: 21, spr: "hangyeol", dir: "right", hidden: true, move: "fixed", show: () => hasBadge(3) && !G.flag("rival5_done") });
  BS.signs = BS.signs.map(s => (s[0] === 31 && s[1] === 18) ? [31, 18, "→ 요천대교 · 7번도로(송화마을)\n섬진 어사패가 있으면 지나갈 수 있어요"] : s);

  // ---- 7번도로 ----
  const R7 = MAPDATA.route7;
  MAPS.route7 = {
    rows: R7.rows, stamps: R7.stamps, name: "7번도로",
    warps: [14, 15].map(y => [0, y, ["bisaek", 43, y + 7, "left", "edge"]]).concat([14, 15].map(y => [55, y, ["songhwa", 0, y, "right", "edge"]])),
    zones: [["7번도로", 0, 0, 55, 29]],
    zinfo: { "7번도로": { bgm: "route", enc: "7번도로", rate: 0.12, bg: "grass" } },
    signs: [[4, 13, "7번도로\n← 비색마을(요천대교) · → 송화마을"], [51, 16, "→ 송화마을\n소나무 숲의 쉼터 마을"]],
    checks: [], areas: [],
    npcs: [
      { id: "r7_grandma", x: 22, y: 13, spr: "oldwoman", dir: "down", move: "look", talk: "할머니: 봄이면 이 솔숲에\n노란 송홧가루가 날린단다.\f송홧가루는 소나무 꽃가루야.\n그걸로 다식도 만들지." },
      { x: 40, y: 16, spr: "student", move: "wander", r: 1, talk: "턱은 위에서 아래로만\n뛰어내릴 수 있어.\f풀숲 위쪽으로 가려면\n서쪽 솔숲 옆으로 돌아가!" },
      { item: "superpotion", x: 13, y: 4 }, { item: "hyperpotion", x: 41, y: 5 }, { item: "revive", x: 15, y: 25 }, { item: "dusk", n: 3, x: 40, y: 24 },
      { x: 18, y: 13, spr: "kid_m", dir: "down", trainer: { id: "r7_siwoo", cls: "꼬마", name: "시후", spr: "kid_m", range: 1, base: 16, team: [["satbaso", 23], ["gorakong", 24]],
        intro: "솔숲 길은 내 놀이터야!\n승부!", lose: "솔방울처럼 데굴데굴……", after: "솔방울은 비가 오면\n비늘을 꼭 닫는대!" } },
      { x: 33, y: 8, spr: "bugboy", dir: "down", trainer: { id: "r7_minho", cls: "벌레잡이", name: "민호", spr: "bugboy", range: 3, base: 16, team: [["ttakkeumi", 24], ["nabichae", 24]],
        intro: "송홧가루 날리는 날엔\n벌레 남켓몬이 신나!", lose: "에취! 꽃가루 때문이야!", after: "꽃가루가 날리는 날엔\n마스크를 꼭 써!" } },
      { x: 24, y: 22, spr: "kid_f", dir: "left", trainer: { id: "r7_yuna", cls: "꼬마 숙녀", name: "유나", spr: "kid_f", range: 3, base: 16, team: [["olchaengmi", 24], ["darijak", 24]],
        intro: "섬진 어사패 땄다며?\n나도 보여 줘!", lose: "와, 진짜 반짝이네……", after: "나도 언젠가 수현 선생님께\n도전할 거야!" } },
      { x: 46, y: 13, spr: "kid_m", dir: "down", trainer: { id: "r7_jaehyun", cls: "꼬마", name: "재현", spr: "kid_m", range: 1, base: 16, team: [["pikseldan", 25], ["sogeumjaeng", 24]],
        intro: "송화마을 들어가기 전에\n마지막 관문이다!", lose: "관문이…… 뚫렸다!", after: "송화마을 센터에서\n푹 쉬어 가!" } },
    ],
  };

  // ---- 송화마을 ----
  const SHD = MAPDATA.songhwa;
  MAPS.songhwa = {
    rows: SHD.rows, stamps: SHD.stamps, name: "송화마을",
    warps: [14, 15].map(y => [0, y, ["route7", 55, y, "left", "edge"]]).concat([14, 15].map(y => [39, y, ["route11", 0, y, "right", "edge"]])),
    zones: [["송화마을", 0, 0, 39, 35]],
    zinfo: { "송화마을": { bgm: "songhwa", enc: "송화마을", rate: 0, bg: "grass" } },
    signs: [[17, 13, "송화마을\n솔숲과 섬진강 사이 쉼터 마을"], [22, 27, "섬진강\n강 건너는 전라남도 곡성"], [37, 16, "→ 11번도로(고갯길)\n주홍마을(주천) 방면"]],
    checks: [...[[10, 24], [11, 24], [12, 24], [13, 24]].map(([x, y]) => [x, y, "솔숲 정자.\f솔바람 소리가\n쉬어 가라고 말하는 것 같다."])],
    areas: [],
    npcs: [
      { id: "songhwa_elder", x: 14, y: 26, spr: "oldman", dir: "down", move: "look", talk: "할아버지: 저 강 건너가\n전라남도 곡성이란다.\f강 하나를 사이에 두고\n도가 달라지지." },
      { x: 26, y: 16, spr: "woman", move: "wander", r: 1, talk: "아주머니: 송동의 '송'은\n소나무라는 뜻이래.\f그래서 우리 마을 이름이\n송홧가루 빛 '송화'야." },
      { x: 33, y: 24, spr: "kid_f", move: "wander", r: 1, talk: "모래톱에서 조약돌 주웠어!\f강물에 동글동글\n깎인 거래." },
      { id: "songhwa_fisher", x: 30, y: 27, spr: "man", dir: "down", move: "look", talk: "낚시꾼: 섬진강 은어는\n맑은 물에만 산단다." },
      { item: "fullheal", x: 3, y: 27 }, { item: "superpotion", x: 36, y: 3 },
    ],
  };

  // ---- 11번도로 ----
  const R11 = MAPDATA.route11;
  MAPS.route11 = {
    rows: R11.rows, stamps: R11.stamps, name: "11번도로",
    warps: [14, 15].map(y => [0, y, ["songhwa", 39, y, "left", "edge"]]).concat([20, 21].map(y => [59, y, ["juhong", 0, y, "right", "edge"]])),
    zones: [["11번도로", 0, 0, 59, 33]],
    zinfo: { "11번도로": { bgm: "route", enc: "11번도로", rate: 0.12, bg: "grass" } },
    signs: [[7, 13, "11번도로\n송동 → 수지 → 주천 고갯길"], [57, 19, "→ 주홍마을(주천)\n지리산 자락의 마을"]],
    checks: [], areas: [],
    npcs: [
      { id: "r11_hiker", x: 30, y: 10, spr: "man", dir: "left", move: "look", talk: "등산객: 이 고개만 넘으면\n지리산 자락 주천이야.\f오르막은 천천히,\n내리막은 더 천천히!" },
      { item: "superpotion", x: 14, y: 2 }, { item: "revive", x: 22, y: 18 }, { item: "maxether", x: 53, y: 26 }, { item: "hyperpotion", x: 44, y: 3 },
      { x: 10, y: 9, spr: "kid_m", dir: "right", trainer: { id: "r11_dojun", cls: "꼬마", name: "도준", spr: "kid_m", range: 2, base: 16, team: [["dolkongi", 26], ["satbaso", 26]],
        intro: "고갯길 바위처럼\n단단하게 간다!", lose: "바위가 굴러가 버렸다……", after: "돌콩이는 고갯길 돌 틈에\n숨어 산대." } },
      { x: 20, y: 4, spr: "bugboy", dir: "down", trainer: { id: "r11_seungmin", cls: "벌레잡이", name: "승민", spr: "bugboy", range: 1, base: 16, team: [["ttakkeumi", 26], ["gumbengku", 26]],
        intro: "고개 위 벌레는\n아래 벌레보다 세다!", lose: "고개에서 굴러떨어진 기분……", after: "따끔이는 전기를 모아.\n물 남켓몬한테 세!" } },
      { x: 40, y: 12, spr: "kid_f", dir: "left", trainer: { id: "r11_jia", cls: "꼬마 숙녀", name: "지아", spr: "kid_f", range: 3, base: 16, team: [["jjidami", 26], ["sojjeokmi", 26]],
        intro: "고갯마루에서 쉬는 중!\n같이 놀래?", lose: "쉬는 것도 실력인데……", after: "찌다미는 전기 타입이야.\n주홍 배움터 가기 전에 꼭 잡아!" } },
      { x: 47, y: 18, spr: "kid_m", dir: "up", trainer: { id: "r11_hyunwoo", cls: "꼬마", name: "현우", spr: "kid_m", range: 3, base: 16, team: [["gorakong", 26], ["namujjo", 27]],
        intro: "내리막 시작이다!\n나를 넘어가 봐!", lose: "넘어졌다…… 아니, 넘겨졌다!", after: "나무쪼는 강철 부리로\n나무를 똑똑 두드려." } },
    ],
  };

  // ---- 주홍마을 ----
  const JHD = MAPDATA.juhong;
  MAPS.juhong = {
    rows: JHD.rows, stamps: JHD.stamps, name: "주홍마을",
    warps: [20, 21].map(y => [0, y, ["route11", 59, y, "left", "edge"]]),
    zones: [["주홍마을", 0, 0, 43, 39]],
    zinfo: { "주홍마을": { bgm: "juhong", enc: "주홍마을", rate: 0.12, bg: "grass" } },
    signs: [
      [4, 18, "주홍마을\n지리산 자락, 구룡계곡이 흐르는 마을"],
      [22, 17, "주홍 배움터\n지킴이 신하 · 물 타입의 별 배움터"],
      [27, 29, "육모정\n여섯 모 지붕의 정자"],
      [16, 33, "용담사 터\n보물 돌부처와 칠층석탑이 남아 있어요"],
      [17, 2, "↑ 지리산 둘레길 · 12번도로\n(다음 이야기)"],
    ],
    checks: [
      ...[[3, 17], [3, 18], [3, 22], [3, 23]].map(([x, y]) => [x, y, "마을 어귀를 지키는 돌장승.\f'주천 석장승'이라 불리는\n소중한 민속문화재다."]),
      ...[[14, 31], [15, 31], [14, 32], [15, 32]].map(([x, y]) => [x, y, "용담사 터의 칠층석탑.\f돌을 일곱 층으로 쌓아 올렸다.\n이끼가 파랗게 앉았다."]),
      ...[[11, 32], [12, 32], [11, 33], [12, 33]].map(([x, y]) => [x, y, "용담사 터의 돌부처.\f커다란 돌에 새긴 부처님이\n오랜 세월 마을을 내려다보고 있다."]),   // v2.25 절터 언덕(새 자리 그대로)
      ...[[28, 27], [29, 27], [30, 27], [31, 27]].map(([x, y]) => [x, y, "육모정.\f냇물 소리가\n정자 마루까지 올라온다."]),
    ],
    areas: [
      { x0: 22, y0: 24, x1: 31, y1: 31, cond: () => !G.flag("garam2_done"), run: garam2Event },
    ],
    npcs: [
      { id: "garam2_f", x: 28, y: 28, spr: "garam", dir: "down", move: "fixed", show: () => !G.flag("garam2_done") },
      { id: "sinha_f", x: 27, y: 21, spr: "gl_sinha", dir: "down", hidden: true, move: "fixed", show: () => !G.flag("garam2_done") },
      { id: "gym4_door_kid", x: 27, y: 9, spr: "kid_m", dir: "down", move: "fixed", show: () => !G.flag("garam2_done"),
        talk: () => say("신하 선생님은 별 보러\n육모정에 가셨어.\f오늘은 구름이 많은데……\n그래도 가신대.") },
      { id: "juhong_elder", x: 9, y: 21, spr: "oldman", dir: "left", move: "look", talk: "할아버지: 저 돌장승이\n주천 석장승이란다.\f마을 어귀에 서서\n오가는 사람을 지켜 왔지." },
      { id: "juhong_woman", x: 16, y: 22, spr: "woman", move: "wander", r: 1, talk: "아주머니: 여기는 지리산 자락이라\n전라남도 구례랑 맞닿아 있어." },
      { x: 25, y: 12, spr: "student", move: "wander", r: 1, talk: "신하 선생님은 복도에서 뛰면\n엄청 무섭게 혼내셔.\f근데 넘어지면 제일 먼저\n달려오시는 것도 선생님이야." },
      { id: "jh_worker", x: 41, y: 20, spr: "man", dir: "left", move: "fixed", talk: "미안! 구룡계곡 가는 길은\n아직 정비 중이란다.\f(플레이 버전은 여기까지예요!\n다음 이야기: 구룡계곡과 지리산 둘레길)" },
      { id: "jh_worker2", x: 41, y: 21, spr: "man", dir: "left", move: "fixed", talk: "조금만 기다려 주렴.\n금방 고칠게!" },
      { item: "superpotion", x: 2, y: 36 }, { item: "fullheal", x: 31, y: 36 }, { item: "magnet", x: 40, y: 18 },
      { x: 24, y: 33, spr: "kid_f", dir: "left", trainer: { id: "jh_sohee", cls: "꼬마 숙녀", name: "소희", spr: "kid_f", range: 3, base: 16, team: [["daseulmi", 26], ["jjidami", 27]],
        intro: "구룡계곡 다슬기 잡으러\n가는 길이야!", lose: "다슬기가 도망갔다……", after: "다슬기는 맑은 물에만\n산대." } },
    ],
  };

  // ---- 실내 ----
  const D = MAPDATA;
  MAPS.gym4 = {
    rows: D.gym4.rows, stamps: D.gym4.stamps, indoor: true, name: "주홍 배움터", floor: "floor_star", floor2: "floor_star2", wall: "wall_space", win: "win_sky", rail: "rail_star",
    bgm: "gym4", noPopup: true, exit: exitJH("gym4"),
    checks: [
      ...[[4, 16], [5, 16], [4, 17], [5, 17]].map(([x, y]) => [x, y, () => gym4Quiz(1)]),
      ...[[1, 11], [2, 11], [1, 12], [2, 12]].map(([x, y]) => [x, y, () => gym4Quiz(2)]),
      ...[[12, 6], [13, 6], [12, 7], [13, 7]].map(([x, y]) => [x, y, () => gym4Quiz(3)]),
      ...[5, 6, 7, 8].map(x => [x, 1, "은하수와 별자리 그림.\f한쪽 구석에 작은 글씨.\n'안 보여도 거기 있어.'"]),
      ...[[0, 2], [1, 2], [0, 3], [1, 3], [13, 2], [14, 2], [13, 3], [14, 3]].map(([x, y]) => [x, y, "천체 망원경.\f……오늘은 구름 때문에\n아무것도 안 보인다."]),
      ...[1, 2, 3, 11, 12, 13].map(x => [x, 1, "열린 지붕 틈으로\n빗방울이 떨어진다."]),
    ],
    npcs: [
      { id: "sinha", x: 7, y: 3, spr: "gl_sinha", dir: "down", move: "fixed", talk: sinhaTalk },
      { id: "guide4", x: 10, y: 18, spr: "student", dir: "left", move: "look", talk: gym4GuideTalk },
      ...GYM4_KIDS.map(k => ({ id: k.id, x: k.x, y: k.y, spr: k.spr, dir: k.dir, move: "fixed", talk: () => gym4KidTalk(k) })),
      ...D.gym4.gates.map(([x, y], i) => ({ id: "g4gate" + (i + 1), x, y, special: gateDrawer("gate_star"), move: "fixed", show: () => !G.flag("g4q" + (i + 1)), talk: () => gym4Quiz(i + 1) })),
    ],
  };
  MAPS.center_songhwa = { ...MAPS.center, exit: exitS("center_songhwa"),
    npcs: [MAPS.center.npcs.find(n => n.id === "nurse"),
      { x: 2, y: 6, spr: "man", move: "look", talk: "주홍마을 배움터는\n비를 부르는 물 타입이래.\f전기나 풀 남켓몬을\n데려가!" },
      { x: 11, y: 5, spr: "oldwoman", move: "look", talk: "할머니: 송화마을은 쉬어 가는 마을이야.\n천천히 있다 가렴." }] };
  MAPS.mart_songhwa = { ...MAPS.mart, name: "송화 만물상", exit: exitS("mart_songhwa"),
    npcs: [MAPS.mart.npcs.find(n => n.id === "clerk"), MAPS.mart.npcs.find(n => n.id === "clerk2"),
      { x: 7, y: 6, spr: "kid_m", move: "look", talk: "고갯길 넘기 전엔\n상처약을 넉넉히!" }] };
  MAPS.house_f = { rows: D.house_a.rows, stamps: D.house_a.stamps, indoor: true, name: "보름이 할머니 댁", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "songhwa", noPopup: true, exit: exitS("house_f"),
    checks: [[0, 1, "자개장이 반짝반짝 빛난다."], [1, 1, "자개장이 반짝반짝 빛난다."], [6, 2, "병풍에 소리꾼과 고수가\n그려져 있다."], [7, 2, "병풍에 소리꾼과 고수가\n그려져 있다."]],
    npcs: [
      { id: "boreum_gm", x: 2, y: 4, spr: "oldwoman", move: "look", talk: async () => {
        if (!G.flag("boreum_gm_met")) {
          await say("할머니: 네가 우리 보름이\n친구로구나!");
          await say("할머니: 할미는 젊을 때\n판소리를 배웠단다.\f옛 동무 하나는 이름난 명창이었지.\f……요즘은 통 소리를\n안 한다더구나.");
          await say("할머니: 먼 길 왔으니\n이거 들고 가렴.");
          await getItem("moomoomilk", 2); G.flag("boreum_gm_met", true); return; }
        await say("할머니: 보름이가 영상 찍는다고\n여기저기 돌아다니지?\f그 애 목소리가 꼭\n할미 옛 동무를 닮았어."); } },
      { id: "boreum_sh", x: 6, y: 4, spr: "boreum", dir: "left", move: "look", talk: "보름: 여기 우리 할머니 댁이야!\f할머니 판소리 들으면\n소름 돋는다니까?" },
    ] };
  MAPS.house_g = { rows: D.house_a.rows, stamps: D.house_a.stamps, indoor: true, name: "한옥", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "songhwa", noPopup: true, exit: exitS("house_g"),
    npcs: [{ x: 3, y: 4, spr: "man", dir: "down", move: "look", talk: "아저씨: 이 마을은 조용해서 좋아.\f도시에서 지친 사람들이\n쉬었다 가곤 하지." }] };
  MAPS.center_juhong = { ...MAPS.center, exit: exitJH("center_juhong"),
    npcs: [MAPS.center.npcs.find(n => n.id === "nurse"),
      { x: 2, y: 6, spr: "woman", move: "look", talk: "비가 오면 물 기술이 세지고\n불꽃 기술은 약해진대.\f쾌청으로 날씨를 바꾸면\n반대가 되고!" },
      { x: 11, y: 5, spr: "oldman", move: "look", talk: "할아버지: 구룡계곡은 만복대에서\n흘러내린 물이란다." }] };
  MAPS.mart_juhong = { ...MAPS.mart, name: "주홍 만물상", exit: exitJH("mart_juhong"),
    npcs: [MAPS.mart.npcs.find(n => n.id === "clerk"), MAPS.mart.npcs.find(n => n.id === "clerk2"),
      { x: 7, y: 6, spr: "kid_f", move: "look", talk: "계곡에 놀러 갈 땐\n쓰레기봉투 꼭 챙겨!" }] };
  MAPS.house_h = { rows: D.house_a.rows, stamps: D.house_a.stamps, indoor: true, name: "한옥", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "juhong", noPopup: true, exit: exitJH("house_h"),
    npcs: [{ id: "house_h_gm", x: 2, y: 4, spr: "oldwoman", move: "look", talk: async () => {
      if (!G.flag("house_h_gift")) { await say("할머니: 신하 선생님 말이냐?\f우리 손자 담임인데,\n말은 툭툭 해도 정이 많단다."); await getItem("lemonade", 2); G.flag("house_h_gift", true); return; }
      await say("할머니: 지리산 바람이 불면\n비가 오려나 보다 하지."); } }] };

  Object.assign(TOWN_ZONE, { "7번도로": "r7", "송화마을": "songhwa", "11번도로": "r11", "주홍마을": "juhong", "주홍 배움터": "juhong" });
})();
