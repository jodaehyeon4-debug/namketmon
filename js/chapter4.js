// ===== v1.7 셋째 장: 4번도로(덕과 → 대산) · 5번도로(주생 들판·요천 둑) · 비색마을(금지) · 섬진강 매립 현장(행수 여울 ①·금박재단) · 비색 배움터(3관장 수현) =====
// chapter3.js 뒤, hearts.js 앞에 읽힘. 설정집 일정표 '3장 금지 섬진강: 재단 요원, 행수 여울 ①, 방삼·단지(Lv22–24)'
// 수현은 실제 동료 선생님을 바탕으로 한 관장 → 관장 문서 3번 성격 그대로(생활지도·상담, 친절하지만 단호, 요리), 말버릇(D12)은 넣지 않음
"use strict";
const BD = MAPDATA.bisaek.doors;
const exitB = k => ["bisaek", BD[k][0], BD[k][1], "down"];

// ---- 출현표 (갈매 16–18 → 4번도로 17–20 → 5번도로 19–22 → 비색 20–23, 3관장 22–25) ----
DATA.spawns["4번도로"] = [
  { k: "nabichae", lv: "17–19", t: "낮", r: "흔함" }, { k: "seureumi", lv: "17–20", t: "낮", r: "가끔" },
  { k: "dudeokong", lv: "17–20", t: "모두", r: "가끔" }, { k: "gulsomi", lv: "17–20", t: "밤", r: "가끔" },
  { k: "gumbengku", lv: "17–20", t: "모두", r: "흔함" }, { k: "ttakkeumi", lv: "17–20", t: "낮", r: "가끔" },
  { k: "satbaso", lv: "17–20", t: "낮", r: "가끔" }, { k: "mudangkong", lv: "18–20", t: "낮", r: "흔함" },
  { k: "neogulmi", lv: "18–20", t: "밤", r: "흔함" }, { k: "pikseldan", lv: "18–20", t: "모두", r: "드묾" },
].filter(e => MON[e.k]);
DATA.spawns["5번도로"] = [
  { k: "darijak", lv: "19–22", t: "낮", r: "흔함" }, { k: "chamisak", lv: "21–22", t: "낮", r: "가끔" },
  { k: "seureumi", lv: "19–22", t: "낮", r: "가끔" }, { k: "dudeokong", lv: "19–22", t: "모두", r: "가끔" },
  { k: "ttakkeumi", lv: "19–22", t: "낮", r: "가끔" }, { k: "salkwaengmi", lv: "19–22", t: "밤", r: "가끔" },
  { k: "gorakong", lv: "19–22", t: "저녁", r: "흔함" }, { k: "mudangkong", lv: "19–22", t: "낮", r: "흔함" },
  { k: "neogulmi", lv: "19–22", t: "밤", r: "흔함" }, { k: "olchaengmi", lv: "19–22", t: "모두", r: "가끔" },
].filter(e => MON[e.k]);
DATA.spawns["비색마을"] = [
  { k: "olchaengmi", lv: "20–23", t: "모두", r: "흔함" }, { k: "cheongdungkong", lv: "20–23", t: "낮", r: "흔함" },
  { k: "dukkeomi", lv: "20–23", t: "밤", r: "가끔" }, { k: "teoljipge", lv: "20–23", t: "밤", r: "가끔" },
  { k: "ssogami", lv: "20–23", t: "모두", r: "가끔" }, { k: "mudangkong", lv: "20–23", t: "낮", r: "가끔" },
].filter(e => MON[e.k]);
(function fixTownLv4() { for (const r of DATA.town.routes || []) { if (r.no === 4) r.lv = "17~20"; if (r.no === 5) r.lv = "19~22"; } })();

// ---- 기술머신19 기가드레인 (비색 배움터 보상) ----
if (MV.gigadrain && !ITEMS.tm19) ITEMS.tm19 = { n: "기술머신19", p: "tm", price: 3000, nobuy: 1, tm: "gigadrain",
  d: "기가드레인을 가르쳐요. 준 데미지의 절반만큼 HP를 되찾는 풀 타입 기술이에요.", ic: "tm", tmTypes: ["풀", "벌레", "노말", "독", "물"] };

// =====================================================================
// 1. 5번도로 요천 둑: 방삼·단지 (항아리를 머리에 쓴 단지)
// =====================================================================
const BANGSAM3 = { id: "bondi_bangsam3", cls: "본디회 단원", name: "방삼", spr: "grunt_m", base: 40, music: "bondi", bgm: "trainer",
  intro: "방삼: 에헴! 이 몸이 본디회의\n방삼이시다!\f단지 머리에서 항아리를 빼려면\n힘을 모아야 해. 너부터 치우고!",
  lose: "방삼: 끄아악!\n이번에도 졌다……!",
  team: [["darijak", 18, { mv: ["quickattack", "tackle", "featherdance", "tailwind"] }], ["neogulmi", 19, { mv: ["scratch", "payback", "tailwhip", "block"] }]] };   // 개그 배틀: 가볍게(셋 Lv21 풀도 대부분 이김)
async function bangsamDanjiEvent() {
  const P = World.player, B1 = act("bangsam3"), B2 = act("danji3");
  if (!B1 || !B2) return;
  World.noBgm = false;
  await say("단지: 형님…… 앞이 하나도\n안 보여요……!");
  await emote(P, "excl", 24);
  bgm("bondi");
  await walkPath(P, 26, 26); P.dir = "right";
  await say("방삼: 그러게 항아리 안에 우렁댁이\n있는지 왜 머리를 넣어 봐!\f……어? 꼬마!\n또 너냐!");
  await say("단지(항아리를 머리에 쓴 채):\n그 목소리…… 춘향제 그 꼬마?\f형님, 우렁댁은 논으로\n벌써 도망갔어요……");
  face(B1, P);
  if (!G.flag("tr_" + BANGSAM3.id)) { const r = await trainerBattle({ x: B1.x, y: B1.y, dir: B1.dir, trainer: BANGSAM3 }, false); if (r !== "win") return; }
  bgm("bondi");
  sfx("ball_open"); await emote(B2, "excl", 24);
  await say("……뽕!\f배틀 바람에 단지 머리에서\n항아리가 쑥 빠졌다!");
  await say("단지: 형님! 빠졌어요!\n세상이 다시 보여요!");
  await say("방삼: 흥, 오늘은 단지 머리를\n구해 줬으니 봐준다!\f기억해라!\n남켓몬은 본디 자리로!");
  await say("방삼·단지: 본디대로—!");
  sfx("exit"); await fadeOut(10); B1.hidden = true; B2.hidden = true; await fadeIn(10);
  G.flag("bangsam3_done", true);
  zoneBgm();
}

// =====================================================================
// 2. 비색마을 섬진강 둑: 행수 여울 ① · 금박재단 매립 공사 · 지킴이 수현 첫 등장
// =====================================================================
// 설정집: 여울 = 강의 행수, 물 타입, 3장 금지 팀(쏘가미 23·털집게 23·메기장 24), 3장에서 재단 하청의 매립을 목격하고 처음 의심
const YEOUL1 = { id: "yeoul1", cls: "본디회 행수", name: "여울", spr: "yeoul", base: 60, music: "bondi", bgm: "trainer", canLose: true,
  loseText: "여울: ……물살에 휩쓸렸구나.\n쉬게 해 줄게.",
  intro: "여울: 강물 맛 좀 봐!",
  lose: "여울: ……센 물살이네, 너.",
  // 설정집 팀(쏘가미·털집게·메기장)을 Lv21–22로, 가장 센 물 기술(아쿠아커터·셸블레이드·물의파동)은 빼고. 져도 이야기는 이어짐(불꽃 스타팅이 물 셋을 만남)
  // bal_gym(셋, 상처약 2): 풀 Lv22 100% · 불꽃 Lv23 37%·24 63% · 물 Lv23 80%·24 97%
  team: [["ssogami", 21, { mv: ["aquajet", "flipturn", "scaryface", "leer"] }],
         ["teoljipge", 21, { mv: ["bubblebeam", "visegrip", "protect", "growl"] }],
         ["megijang", 22, { mv: ["mudshot", "watergun", "mudsport", "tickle"] }]] };
const AGENT1 = { id: "agent_bisaek", cls: "금박재단", name: "요원", spr: "agent", base: 50, music: "bondi", bgm: "trainer", canLose: true,
  loseText: "요원: 업무 방해는\n여기까지입니다.",
  intro: "요원: 업무 방해로 간주합니다.\n절차대로 처리하겠습니다.",
  lose: "요원: ……보고서에\n적어 두겠습니다.",
  team: [["yeopjeoni", 20, { mv: ["chargebeam", "rapidspin", "metalsound", "tackle"] }], ["neogulmi", 21, { mv: ["scratch", "payback", "tailwhip", "block"] }]] };
async function seomjinEvent() {
  const P = World.player, Y = act("yeoul_f"), A1 = act("agent1_b"), A2 = act("agent2_b"), S = act("suhyeon_f");
  if (!Y || !A1 || !A2 || !S) return;
  World.noBgm = false;
  sfx("bump");
  await say("쿵…… 쿵……\f강가에서 무거운 기계 소리가\n울린다.");
  await emote(P, "excl", 24);
  await walkPath(P, 22, 31); P.dir = "right";
  face(Y, P); await emote(Y, "quest", 24);
  bgm("bondi");
  await say("???: 가까이 오지 마.\n물 튀어.");
  await say("여울: 나는 여울.\n본디회의 강 행수야.\f섬진강 뱃사공 집 딸이지.");
  await say("여울: 요즘 강물이 탁해졌어.\f강 남켓몬들이 숨을 못 쉬어.\n그래서 항아리로 옮기는 중이야.");
  await say("여울: 강은 흘러야 해.\n사람이 막지만 않으면.\f보를 쌓고, 다리를 놓고……\n사람들이 강을 막아서 이렇게 됐어.");
  await say("여울: ……남켓몬을 항아리에 넣는 게\n이상하다는 얼굴이네.\f좋아. 강물이 어떤 건지\n보여 줄게.");
  let yr = "win";
  if (!G.flag("tr_" + YEOUL1.id)) yr = await trainerBattle({ x: Y.x, y: Y.y, dir: Y.dir, trainer: YEOUL1 }, false);
  G.flag("tr_" + YEOUL1.id, true);
  bgm("bondi");
  if (yr !== "win") { await say("여울이 강물을 떠서 쓰러진 남켓몬들의\n이마를 적셔 주었다……"); G.healAll(); await Audio2.jingle("jg_heal");
    await say("남켓몬들이 기운을 되찾았다!"); await say("여울: 물은 원래 살리는 거야.\n……막지만 않으면."); }
  else await say("여울: 너, 물살을 거스를 줄 아는구나.");
  // 매립
  sfx("bump"); await frames(10); sfx("bump");
  await say("쿠르릉—!\f굴착기가 흙을 강으로\n쏟아붓는다!");
  face(Y, A2); await emote(Y, "excl", 30);
  await say("여울: ……뭐야, 저거.\f강을 흙으로 메우고 있잖아!");
  A1.hidden = false; await walkPath(A1, 20, 31); face(A1, Y);
  await say("요원: 여기는 금박재단\n'하천 정비 공사' 현장입니다.\f관계자 외 출입 금지입니다.");
  await say("여울: 금박…… 재단?\f……대방님이 늘 고마운 후원자라고\n하시던, 그 재단?");
  await say("요원: 질문은 서면으로\n접수해 주십시오.");
  face(A1, P); face(P, A1);
  await say("요원: 그리고 거기 어린이.\n위험하니 비켜 주시죠.");
  let ar = "win";
  if (!G.flag("tr_" + AGENT1.id)) ar = await trainerBattle({ x: A1.x, y: A1.y, dir: A1.dir, trainer: AGENT1 }, false);
  G.flag("tr_" + AGENT1.id, true);
  bgm("bondi");
  if (ar !== "win") await say("요원: 자, 그럼 공사를\n계속하겠습니다.");
  else await say("요원: 서류상으로는 아무 문제가\n없는 공사입니다.\f……없을 겁니다, 아마.");
  // 수현 등장(호루라기)
  sfx("excl"); await frames(6); sfx("excl");
  await say("삐— 삐익!\f호루라기 소리가\n둑길을 가른다!");
  S.hidden = false; S.x = 20; S.y = 24;
  await say("???: 거기, 다들 잠깐 멈춰요!");
  await walkPath(S, 21, 30); face(S, A1); face(A1, S); face(Y, S);
  World.noBgm = false; bgm("gym3");
  await say("수현: 비색 배움터의 수현이에요.\f여기는 우리 아이들이\n물놀이하는 강이에요.");
  await say("수현: 공사 허가서,\n지금 보여 주실 수 있나요?");
  await say("요원: 그, 그건……\n본사에 확인해 보겠습니다.");
  sfx("exit"); await fadeOut(8); A1.hidden = true; A2.hidden = true; await fadeIn(8);
  face(S, Y);
  await say("수현: 그리고 학생…… 아니, 아가씨도요.\f강을 막는 게 싫다면서요.\n그럼 남켓몬을 항아리에 가두는 건요?");
  await say("수현: 막는 건 똑같아요.\n조금 다를 뿐이에요.");
  await emote(Y, "quest", 30);
  await say("여울: …………");
  sfx("ball_open");
  await say("항아리 뚜껑이 열리고\n쏘가미들이 강물로 뛰어들었다!");
  await say("여울: ……오늘은 물러갈게.\f하지만 저 공사, 내가 꼭 알아볼 거야.\n강은 흘러야 하니까.");
  await walkPath(Y, 30, 32); sfx("exit"); await fadeOut(8); Y.hidden = true; await fadeIn(8);
  face(S, P); face(P, S);
  await say(`수현: 많이 놀랐죠, ${G.name}?\n괜찮아요.`);
  await say("수현: 남켓몬들도 많이 지쳤네요.\n잠깐만요.");
  G.healAll(); await Audio2.jingle("jg_heal");
  await say("남켓몬들이 기운을 되찾았다!");
  await say("수현: 그런데…… 밥은 먹고 다녀요?\f배고프면 마음도 작아지거든요.\f이거, 배움터에서 만든 누룽지예요.\n남켓몬한테 지니게 해 줘요.");
  await getItem("nurungji", 1);
  await say("수현: 배틀 중에 조금씩\n기운이 날 거예요.\f배움터에서 기다릴게요.\n오늘은 빵 굽는 날이거든요.");
  await say("수현: 아, 수업 문 셋은\n꼭 거쳐서 와요. 약속!");
  G.flag("seomjin_done", true);
  const kid = act("gym3_door_kid"); if (kid) kid.hidden = true;
  await walkPath(S, 26, 19); await walk(S, "up");      // v2.24 배움터 문 아래 S.hidden = true; sfx("door");
  zoneBgm();
}

// =====================================================================
// 3. 비색 배움터(요리 교실): 수업 문 셋 → 수현 → 섬진 어사패
// =====================================================================
const QUIZ3 = [
  { board: "수업판: '수업 하나 · 오늘 있었던 일'\f섬진강 둑에서 행수 여울과\n금박재단 요원을 만났어요.",
    q: "여울이 처음으로 '이상하다'고\n느낀 건 무엇 때문일까요?", opts: ["강을 흙으로 메우는 공사", "물고기가 너무 많아서", "비가 많이 와서"], a: 0, gift: "superpotion",
    good: "여울은 강을 막는 게 싫었는데\n누군가 강을 흙으로 메우고 있었지.\f수현 선생님이 그러셨어.\n'막는 건 똑같다'고.\f남을 탓하기 전에\n내가 하는 일도 돌아보기!" },
  { board: "수업판: '수업 둘 · 남원 생태도감'\f수현 선생님의 광대섯은\n광대버섯을 닮은 남켓몬이에요.",
    q: "광대버섯 빨간 갓 위의\n흰 점은 무엇일까요?", opts: ["어린 버섯을 감싸던 막", "버섯이 흘린 눈물", "꽃가루"], a: 0, gift: "moomoomilk",
    good: "흰 점은 어린 버섯을 감싸던\n막이 남은 거래.\f그래서 비에 씻겨\n없어지기도 한대.\f그리고 수현 선생님 말씀!\n산에서 딴 버섯은 절대 먹으면 안 돼.\f예쁜 버섯도\n독이 있을 수 있대!" },
  { board: "수업판: '수업 셋 · 타입 상성'\f수현 선생님의 남켓몬은\n모두 풀 타입이에요.",
    q: "풀 타입에게 효과가\n굉장한 기술 타입은?", opts: ["물", "땅", "비행"], a: 2, gift: "tm40", alt: "sharpbeak",
    giftAlways: "소은: 이거 줄게!\n비행 기술을 키워 주는 거야.",
    good: "불꽃·얼음·독·비행·벌레 기술이\n풀에게 잘 통해.\f반대로 물·땅·바위 기술은\n풀에게 반만 들어가.\f그런데 조심!\n선생님 우렁댁은 물 타입이기도 해.\f우렁댁에게는 비행·독·벌레가\n잘 통하고, 불꽃은 보통이래." },
];
const GYM3_KIDS = [
  { id: "g3k1", n: 1, x: 8, y: 16, dir: "left", spr: "kid_f",
    hint: "다인: 수업판 문제를 맞히면\n문이 열려!\f아까 섬진강 둑에서\n무슨 일이 있었는지 기억나?",
    after: "다인: 수현 선생님은 우리가 다투면\n먼저 밥부터 먹이셔.\f배부르면 화가\n반으로 준대!",
    tr: { id: "gym3_dain", cls: "요리반 짝꿍", name: "다인", spr: "kid_f", base: 20, team: [["bakari", 20], ["mudangkong", 20]],
      intro: "다인: 반죽은 손으로 꾹꾹!\n배틀도 꾹꾹!", lose: "다인: 으앗,\n반죽이 다 터졌다!" } },
  { id: "g3k2", n: 2, x: 10, y: 11, dir: "up", spr: "kid_m",
    hint: "유찬: 이번 문제는 남원 생태도감!\f광대섯을 잡았다면\n도감에서 ▶를 눌러 봐.",
    after: "유찬: 버섯은 예쁘다고 먹으면 안 돼.\n선생님이 백 번은 말씀하셨어!",
    tr: { id: "gym3_yuchan", cls: "요리반 짝꿍", name: "유찬", spr: "kid_m", base: 20, team: [["seotkongi", 20], ["gwangdaeseot", 21]],
      intro: "유찬: 버섯 남켓몬의 매력을\n알려 주지!", lose: "유찬: 내 버섯들이\n시들시들……" } },
  { id: "g3k3", n: 3, x: 4, y: 6, dir: "left", spr: "kid_f",
    hint: "소은: 마지막은 타입 상성!\f수현 선생님 남켓몬은\n모두 풀 타입이야.\f풀은 물이랑 땅에는 강한데……\n무엇에 약할까?",
    after: "소은: 선생님 호루라기 소리가 나면\n다들 줄을 딱 맞춰 서!",
    tr: { id: "gym3_soeun", cls: "요리반 짝꿍", name: "소은", spr: "kid_f", base: 20, team: [["bakari", 21], ["heosuni", 21]],
      intro: "소은: 풀 타입은 질긴 거 알지?\n끝까지 버틴다!", lose: "소은: 버티는 것도\n한계가 있구나……" } },
];
async function gym3Quiz(n) {
  const F = "g3q" + n;
  if (G.flag(F)) { await say("수업판 구석에 빵 모양 도장이\n'참 잘했어요' 대신 찍혀 있다."); return; }
  const Q = QUIZ3[n - 1], k = GYM3_KIDS[n - 1], K = act(k.id), P = World.player, nm = k.tr.name;
  await say(Q.board);
  const v = await quizAsk(Q.q, Q.opts);
  if (v < 0) { await say("(조금 더 생각해 보고\n다시 풀어 보자.)"); return; }
  if (K) { face(K, P); await emote(K, v === Q.a ? "heart" : "quest", 26); }
  const gift = Q.alt && G.has(Q.gift) ? Q.alt : Q.gift;
  if (v === Q.a) {
    await Audio2.jingle("jg_levelup");
    await say(`${nm}: 딩동댕! 정답이야!`);
    await say(`${nm}: ` + Q.good);
    await say(`${nm}: 정답 선물이야!`); await getItem(gift);
  } else {
    sfx("flee_fail");
    await say(`${nm}: 땡! 아쉽다~\f괜찮아, 빵도 처음엔 다 타.\n배틀하면서 같이 알아보자!`);
    if (!G.flag("tr_" + k.tr.id)) {
      const r = await trainerBattle({ x: K.x, y: K.y, dir: K.dir, trainer: k.tr }, false);
      if (r !== "win") return;
    }
    await say(`${nm}: 정답은 '${Q.opts[Q.a]}'였어!`);
    await say(`${nm}: ` + Q.good);
    if (Q.giftAlways) { await say(Q.giftAlways); await getItem(gift); }
  }
  const gt = act("g3gate" + n); sfx("door");
  if (gt) { for (let i = 0; i < 4; i++) { gt.hidden = !gt.hidden; await frames(5); } gt.hidden = true; }
  G.flag(F, true);
  await say("조리대 문이 활짝 열렸다!");
}
async function gym3KidTalk(k) {
  const K = act(k.id);
  if (!G.flag("g3q" + k.n)) { await say(k.hint); return; }
  if (!G.flag("tr_" + k.tr.id)) {
    if (await yes(`${k.tr.name}: 수업 문은 열렸어!\n연습 배틀 한 판 할래?`)) await trainerBattle({ x: K.x, y: K.y, dir: K.dir, trainer: k.tr }, false);
    else await say(`${k.tr.name}: 좋아, 수현 선생님께 힘내!`);
    return;
  }
  await say(k.after);
}
async function gym3GuideTalk() {
  if (hasBadge(3)) {
    if (!G.flag("guide3_gift")) { await say("도우미: 섬진 어사패! 축하해요!\f수현 선생님이 오늘 구운 빵,\n제일 큰 걸 남겨 두셨대요.\f……저는 이걸로 대신할게요."); await getItem("sodapop", 2); G.flag("guide3_gift", true); return; }
    await say("도우미: 수현 선생님 상담실 문에는\n'언제든 똑똑'이라고 쓰여 있어요."); return;
  }
  await say("도우미: 어서 와요, 도전자님!\n여기는 비색 배움터, 요리 교실이에요.\f조리대 문 앞의 수업판 문제를 맞히면\n문이 열려요.\f틀려도 괜찮아요. 옆의 요리반 짝꿍과\n배틀하면서 배우면 되니까요!\f수현 선생님은 풀 타입을 써요.\n풀 타입은 불꽃·비행·독에 약해요!");
}

// ---- 지킴이 수현 ----
// 난이도: test/bal_gym.js로 측정(아래 기록)
const SUHYEON = { id: "leader_suhyeon", cls: "지킴이", name: "수현", spr: "gl_suhyeon", type: "풀", indoor: true, bg: "indoor", base: 100, music: "eyes", bgm: "battle_gym",
  intro: "수현: 비색 배움터 지킴이,\n수현이에요.\f풀은 천천히 자라지만\n뿌리는 아주 단단하답니다.\f자, 줄 맞춰 서고—\n시작해 볼까요?",
  lose: "수현: 잘했어요.\f빵도 배틀도 기다릴 줄 알아야\n잘 부풀거든요.\f오늘 정말 잘 기다렸어요.",
  // bal_gym(상처약 2, 둘째·셋째 = 4·5번도로에서 잡히는 벌레·비행·독, 물 스타팅은 쪽빛 기술머신09 베놈쇼크):
  //   셋(Lv24·25) 풀 90·98% · 불꽃 100% · 물 78·75% / 둘 풀 50·60% · 불꽃 100% · 물 30·35%. 처음 안(씨기관총·씨뿌리기·독가루, 에이스 거품광선)은 셋이어도 물 20~70%
  team: [["bakari", 22, { mv: ["magicalleaf", "megadrain", "growl", "absorb"] }],
         ["gwangdaeseot", 23, { mv: ["megadrain", "acid", "stunspore", "sweetscent"] }],
         ["ureongdaek", 25, { mv: ["magicalleaf", "watergun", "growl", "tailwhip"], item: "jujube" }]] };
const SH_HINT = [
  "수현: 다시 왔네요. 좋아요.\f풀 타입은 불꽃·얼음·독·비행·벌레에\n약해요.\f들판의 다리작이나 나비채,\n쪽빛에서 받은 베놈쇼크도 좋아요.",
  "수현: 광대섯 저리가루에 마비되면\n움직이기 힘들죠?\f마비풀이환을 챙기거나\n먼저 쓰러뜨리는 게 좋아요.",
  "수현: 우렁댁은 물 타입이기도 해서\n불꽃이 잘 안 들어요.\f비행·독·벌레 기술로 맞서 봐요.\n대추를 먹고 버티는 것도 조심!",
];
async function suhyeonTalk(a) {
  if (hasBadge(3)) { await say(`수현: ${G.name}, 밥은 먹고 다녀요?\f……남켓몬들도요.\n같이 먹어야 더 맛있어요.`); return; }
  const lost = G.flags.sh_lost || 0;
  if (!lost) {
    await say(`수현: 어서 와요, ${G.name}.\f수업 문 셋, 다 지나왔네요.\n잘했어요.\f……밥은 먹고 다녀요?\n배틀도 든든해야 잘하거든요.`);
    await say("수현: 아까 강가에서 많이 놀랐죠?\f화가 날 땐 먼저 숨 한 번,\n그다음에 이야기.\f배틀도 그래요.\n급하면 지는 거예요.");
  } else await say(SH_HINT[Math.min(lost, SH_HINT.length) - 1]);
  const r = await trainerBattle({ x: a.x, y: a.y, dir: a.dir, trainer: SUHYEON }, false);
  if (r !== "win") { G.flags.sh_lost = lost + 1; return; }
  bgm("gym3");
  await say("수현: 이건 비색 배움터의\n'섬진 어사패'예요.");
  await getBadge(3, "수현");
  G.flag("badge3", true);
  await say("수현: 섬진강 이름에는\n두꺼비 이야기가 전해져요.\f고려 때 왜구가 쳐들어오자\n두꺼비 수만 마리가 한꺼번에 울어\f물리쳤다고요.\n그래서 두꺼비를 뜻하는 '섬' 자를 쓴대요.");
  await say("수현: 작은 두꺼비도\n함께 울면 큰 힘이 되죠.");
  await say("수현: 비색마을의 부탁은 하나예요.\f화가 나면 먼저 밥부터 먹고,\n그다음에 마주 앉아 이야기해요.");
  await say("수현: 그리고…… 이것도요.");
  await getItem("tm19");
  await say("수현: 기술머신19 '기가드레인'.\f준 데미지의 절반만큼\nHP를 되찾는 풀 기술이에요.\f잘 먹고, 잘 버티기!");
  await emote(a, "heart", 30);
}

// =====================================================================
// 지도에 붙이기
// =====================================================================
(function attachRoute45Bisaek() {
  // ---- 갈매마을 서쪽: 4번도로 열기 ----
  const GA = MAPS.galmae;
  GA.npcs = GA.npcs.filter(o => !/^ga_worker/.test(o.id || ""));
  GA.warps = (GA.warps || []).concat([19, 20].map(y => [0, y, ["route4", 59, y, "left", "edge"]]));
  GA.signs = GA.signs.map(s => (s[0] === 3 && s[1] === 18) ? [3, 18, "← 4번도로(대산 · 비색마을)\n↑ 남켓몬센터"] : s);
  const hy = GA.npcs.find(o => o.id === "hangyeol_yard"); if (hy) hy.talk = "한결: 4번도로가 열렸대!\f나는 운동장 열 바퀴만 더 돌고\n바로 따라간다!";

  // ---- 4번도로 ----
  const R4 = MAPDATA.route4;
  MAPS.route4 = {
    rows: R4.rows, stamps: R4.stamps, name: "4번도로",
    warps: [19, 20].map(y => [59, y, ["galmae", 0, y, "right", "edge"]])
      .concat([8, 9, 10, 11].map(x => [x, 33, ["route5", x + 10, 0, "down", "edge"]])),
    zones: [["대산 쉼터", 2, 7, 15, 18], ["4번도로", 0, 0, 59, 33]],
    zinfo: { "4번도로": { bgm: "route", enc: "4번도로", rate: 0.12, bg: "grass" }, "대산 쉼터": { bgm: "route", enc: "4번도로", rate: 0.12, bg: "grass" } },
    signs: [
      [56, 18, "4번도로\n← 대산 · → 갈매마을(덕과)"],
      [43, 12, "저수지\n물가에서 놀 때는 어른과 함께!"],
      [12, 18, "대산 쉼터\n↓ 5번도로(주생 들판 · 금지)"],
    ],
    checks: [
      ...[[3, 12], [4, 12], [5, 12], [6, 12]].map(([x, y]) => [x, y, "대산 쉼터의 정자.\f마룻바닥이 반들반들하다.\n오가는 사람들이 쉬어 간 자국이다."]),
    ],
    areas: [],
    npcs: [
      { x: 7, y: 14, spr: "oldman", dir: "left", move: "look", talk: "할아버지: 덕과에서 대산을 지나\n주생, 금지로 내려가는 길이란다.\f비색마을 배움터 선생님은\n빵을 아주 잘 구우신다더구나." },
      { x: 40, y: 12, spr: "woman", dir: "up", move: "look", talk: "아주머니: 이 저수지 물이\n들판으로 흘러가 벼를 키운단다." },
      { x: 26, y: 15, spr: "student", move: "wander", r: 1, talk: "턱은 뛰어내릴 수만 있고\n거꾸로 올라갈 수는 없어.\f언덕 위 풀숲은\n대산 쉼터 쪽으로 돌아서 가!" },
      // 떨어진 물건
      { item: "superpotion", x: 18, y: 3 }, { item: "ether", x: 55, y: 2 }, { item: "superrepel", x: 3, y: 8 }, { item: "revive", x: 28, y: 31 },
      // 트레이너
      { x: 30, y: 18, spr: "kid_m", dir: "down", trainer: { id: "r4_dohyeon", cls: "꼬마", name: "도현", spr: "kid_m", range: 1, base: 16, team: [["satbaso", 19], ["gumbengku", 20]],
        intro: "길 한가운데서 딱 마주쳤네!\n승부다!", lose: "으, 비켜 줄게……", after: "삿바소는 씨름 선수처럼\n샅바를 꽉 잡는대!" } },
      { x: 44, y: 24, spr: "bugboy", dir: "left", trainer: { id: "r4_jeongwoo", cls: "벌레잡이", name: "정우", spr: "bugboy", range: 3, base: 16, team: [["nabichae", 20], ["ttakkeumi", 20]],
        intro: "덕과 들판 벌레는\n다 내 친구야!", lose: "내 친구들이……", after: "딱그미는 몸에 전기를 모아.\n만지면 찌릿해!" } },
      { x: 24, y: 10, spr: "kid_f", dir: "down", trainer: { id: "r4_seoyun", cls: "꼬마 숙녀", name: "서윤", spr: "kid_f", range: 2, base: 16, team: [["mudangkong", 20], ["dudeokong", 21]],
        intro: "언덕 위까지 올라왔네?\n대단한데!", lose: "올라온 보람이 있구나.", after: "여기서 보면 덕과 들판이\n한눈에 보여!" } },
      { x: 53, y: 16, spr: "kid_f", dir: "left", trainer: { id: "r4_haeun", cls: "꼬마 숙녀", name: "하은", spr: "kid_f", range: 3, base: 16, team: [["seureumi", 20], ["pikseldan", 20]],
        intro: "내 픽셀단 봤어?\n번쩍번쩍해!", lose: "번쩍…… 하고 졌다.", after: "픽셀단은 아주 드물게\n풀숲에서 나온대." } },
    ],
  };

  // ---- 5번도로 ----
  const R5 = MAPDATA.route5;
  MAPS.route5 = {
    rows: R5.rows, stamps: R5.stamps, name: "5번도로",
    warps: [18, 19, 20, 21].map(x => [x, 0, ["route4", x - 10, 33, "up", "edge"]])
      .concat([18, 19, 20, 21].map(x => [x, 59, ["bisaek", x, 0, "down", "edge"]])),
    zones: [["주생 들판", 2, 4, 17, 24], ["요천 둑길", 27, 4, 30, 59], ["5번도로", 0, 0, 39, 59]],
    zinfo: { "5번도로": { bgm: "route", enc: "5번도로", rate: 0.12, bg: "grass" }, "주생 들판": { bgm: "route", enc: "5번도로", rate: 0.12, bg: "grass" },
      "요천 둑길": { bgm: "route", enc: "5번도로", rate: 0.12, bg: "grass" } },
    signs: [
      [17, 14, "주생 들판\n논두렁으로만 다녀 주세요!"],
      [26, 15, "요천 둑길\n강가에서는 조심조심!"],
      [17, 55, "↓ 비색마을(금지)\n요천과 섬진강이 만나는 곳"],
    ],
    checks: [
      ...[[10, 9], [10, 10]].map(([x, y]) => [x, y, async () => { if (["저녁", "밤"].includes(timeOfDay())) await say("허수아비가 서 있다.\f……방금 고개를 돌린 것 같은데?"); else await say("밀짚모자를 쓴 허수아비가\n논을 지키고 서 있다."); }]),
    ],
    areas: [
      { x0: 2, y0: 26, x1: 30, y1: 27, cond: () => !G.flag("bangsam3_done"), run: bangsamDanjiEvent },
    ],
    npcs: [
      { id: "bangsam3", x: 28, y: 25, spr: "bondi", dir: "left", move: "fixed", show: () => !G.flag("bangsam3_done") },
      { id: "danji3", x: 29, y: 26, spr: "bondi", dir: "left", move: "fixed", show: () => !G.flag("bangsam3_done") },
      { id: "jusaeng_farmer", x: 10, y: 14, spr: "man", dir: "right", move: "look", talk: "농부: 주생 들판 논은\n줄이 반듯하지?" },
      { id: "yocheon_fisher", x: 29, y: 44, spr: "oldman", dir: "right", move: "look", talk: "할아버지: 요천은 장수 장안산에서\n시작한단다.\f남원 한가운데를 지나서\n금지에서 섬진강을 만나지." },
      // 떨어진 물건
      { item: "superpotion", x: 4, y: 24 }, { item: "namket", n: 5, x: 13, y: 56 }, { item: "fullheal", x: 29, y: 50 }, { item: "xspeed", x: 24, y: 5 },
      // 트레이너
      { x: 24, y: 9, spr: "kid_f", dir: "down", trainer: { id: "r5_jiyun", cls: "꼬마 숙녀", name: "지윤", spr: "kid_f", range: 3, base: 16, team: [["gorakong", 21], ["mudangkong", 21]],
        intro: "요천 둑에서 산책하는 중!\n같이 놀자!", lose: "산책 끝……", after: "저녁이 되면 고라콩이\n둑길로 나온대!" } },
      { x: 12, y: 28, spr: "bugboy", dir: "right", trainer: { id: "r5_taemin", cls: "벌레잡이", name: "태민", spr: "bugboy", range: 4, base: 16, team: [["ttakkeumi", 21], ["nabichae", 21]],
        intro: "잠자리채 준비 끝!\n너도 잡아 볼까?", lose: "잠자리채가 휘었다……", after: "벌레 남켓몬은 풀 타입에\n아주 세!" } },
      { x: 26, y: 33, spr: "kid_m", dir: "right", trainer: { id: "r5_junwoo", cls: "꼬마", name: "준우", spr: "kid_m", range: 2, base: 16, team: [["darijak", 21], ["salkwaengmi", 22]],
        intro: "비색마을 배움터에 가는 거지?\n나부터 이겨 봐!", lose: "나도 아직 멀었구나.", after: "수현 선생님 우렁댁은\n엄청 튼튼해!" } },
    ],
  };

  // ---- 비색마을 ----
  const BS = MAPDATA.bisaek;
  MAPS.bisaek = {
    rows: BS.rows, stamps: BS.stamps, name: "비색마을",
    warps: [18, 19, 20, 21].map(x => [x, 0, ["route5", x, 59, "up", "edge"]]),
    zones: [["섬진강 둑길", 0, 31, 33, 33], ["비색마을", 0, 0, 43, 39]],
    zinfo: { "비색마을": { bgm: "bisaek", enc: "비색마을", rate: 0.12, bg: "grass" }, "섬진강 둑길": { bgm: "bisaek", enc: "비색마을", rate: 0.12, bg: "grass" } },
    signs: [
      [17, 3, "비색마을\n두 강물이 만나는 맑은 빛의 마을"],
      [22, 18, "비색 배움터\n지킴이 수현 · 풀 타입의 요리 교실"],
      [31, 18, "→ 요천대교 · 7번도로(송화마을)"],
      [33, 30, "요천과 섬진강이\n만나는 곳"],
      [14, 27, () => G.flag("seomjin_done") ? "공사 중지\n— 허가 확인 중(금박재단)" : "금박재단 하천 정비 공사\n관계자 외 출입 금지"],
    ],
    checks: [
      ...[[4, 26], [5, 26], [10, 26], [11, 26], [4, 27], [5, 27], [10, 27], [11, 27]].map(([x, y]) => [x, y, "흙더미가 쌓여 있다.\f강가 흙을 퍼서\n강으로 밀어 넣던 흙이다."]),
      ...[[6, 28], [7, 28], [8, 28], [6, 29], [7, 29], [8, 29]].map(([x, y]) => [x, y, () => say(G.flag("seomjin_done") ? "멈춰 선 굴착기.\f열쇠가 빠져 있다." : "굴착기가 흙을 퍼 올리고 있다.\f옆구리에 금색 박 무늬가 있다.")]),
    ],
    areas: [
      { x0: 2, y0: 29, x1: 33, y1: 30, cond: () => !G.flag("seomjin_done"), run: seomjinEvent },
    ],
    npcs: [
      // 이야기
      { id: "yeoul_f", x: 25, y: 32, spr: "yeoul", dir: "down", move: "fixed", show: () => !G.flag("seomjin_done") },
      { id: "agent1_b", x: 13, y: 30, spr: "agent", dir: "right", hidden: true, move: "fixed", show: () => !G.flag("seomjin_done") },
      { id: "agent2_b", x: 9, y: 31, spr: "agent", dir: "up", move: "fixed", show: () => !G.flag("seomjin_done") },
      { id: "suhyeon_f", x: 20, y: 24, spr: "gl_suhyeon", dir: "down", hidden: true, move: "fixed", show: () => !G.flag("seomjin_done") },
      { id: "gym3_door_kid", x: 27, y: 17, spr: "kid_f", dir: "down", move: "fixed", show: () => !G.flag("seomjin_done"),
        talk: () => say("수현 선생님은 지금 강가에 계셔.\f누가 강에 흙을 막 붓는대!\n선생님이 가 보신다고 하셨어.") },
      // 사람
      { id: "bisaek_elder", x: 16, y: 9, spr: "oldman", dir: "down", move: "look", talk: "할아버지: 여기서 가까운 옹정리에서\n김주열 열사가 태어나셨단다.\f1960년, 3·15 부정선거에 맞선\n시위에 나섰던 학생이었지.\f그 시위에서 세상을 떠났고,\n그 일이 4·19 혁명으로 이어졌단다." },
      { id: "bisaek_woman", x: 12, y: 19, spr: "woman", move: "wander", r: 1, talk: "아주머니: '비색'은 고려청자의\n푸른빛을 부르던 말이래.\f저 강물 빛이랑 닮았지?" },
      { x: 24, y: 23, spr: "kid_m", dir: "down", move: "look", talk: () => say(G.flag("seomjin_done") ? "아까 둑에서 호루라기 소리 들었어?\f수현 선생님 호루라기는\n어른들도 멈추게 한대!" : "강가에서 쿵쿵 소리가 나.\n무서워……") },
      { x: 30, y: 20, spr: "student", move: "wander", r: 1, talk: "비색 배움터는 요리 교실이야.\f수현 선생님은 상담도 해 주셔.\n고민 있으면 빵 먹으면서 털어놔!" },
      // 막힌 길(플레이 버전 끝)
      { id: "bs_worker1", x: 40, y: 21, spr: "man", dir: "left", move: "fixed", talk: "미안! 요천대교 너머 7번도로는\n아직 공사 중이란다.\f수현 선생님 섬진 어사패를 받을\n즈음엔 공사가 끝날 거야." },
      { id: "bs_worker2", x: 40, y: 22, spr: "man", dir: "left", move: "fixed", talk: "조금만 기다려 주렴.\n금방 고칠게!" },
      { id: "bs_fisher", x: 1, y: 31, spr: "oldman", dir: "right", move: "fixed", talk: "낚시꾼: 이 둑길로 쭉 가면\n섬진강 나루란다.\f요즘 물이 불어서 위험해.\n다음에 오렴!" },
      { id: "bs_fisher2", x: 1, y: 32, spr: "man", dir: "right", move: "fixed", talk: "6번도로는 섬진강 나루로 가는\n낚시 길이야. 지금은 막혔어!" },
      // 떨어진 물건
      { item: "superpotion", x: 40, y: 18 }, { item: "dusk", n: 3, x: 31, y: 25 }, { item: "parlyzheal", x: 3, y: 23 },
    ],
  };

  // ---- 실내 ----
  const D = MAPDATA;
  MAPS.gym3 = {
    rows: D.gym3.rows, stamps: D.gym3.stamps, indoor: true, name: "비색 배움터", floor: "floor_kitchen", floor2: "floor_kitchen2", wall: "wall_kitchen", win: "win_kitchen", rail: "rail_kitchen",
    bgm: "gym3", noPopup: true, exit: exitB("gym3"),
    checks: [
      ...[[4, 16], [5, 16], [4, 17], [5, 17]].map(([x, y]) => [x, y, () => gym3Quiz(1)]),
      ...[[12, 11], [13, 11], [12, 12], [13, 12]].map(([x, y]) => [x, y, () => gym3Quiz(2)]),
      ...[[1, 6], [2, 6], [1, 7], [2, 7]].map(([x, y]) => [x, y, () => gym3Quiz(3)]),
      ...[5, 6, 7, 8].map(x => [x, 1, "칠판 메뉴판.\n'오늘의 수업 — 남켓몬 빵 굽기'\f그 아래 작은 글씨.\n'손 씻기 먼저!'"]),
      ...[[12, 6], [13, 6], [12, 7], [13, 7], [1, 12], [2, 12], [1, 13], [2, 13]].map(([x, y]) => [x, y, "벽돌 화덕 안에서\n빵이 노릇노릇 익어 간다."]),
      ...[[0, 2], [1, 2], [0, 3], [1, 3], [13, 2], [14, 2], [13, 3], [14, 3]].map(([x, y]) => [x, y, "갓 구운 빵이 줄지어 있다.\f'남켓몬 모양 빵\n— 하나에 웃음 한 번'"]),
      ...[[6, 7], [7, 7], [5, 12], [6, 12], [11, 17], [12, 17]].map(([x, y]) => [x, y, "조리대 위 반죽이\n말랑말랑하다."]),
      [1, 17, "밀가루 포대가 쌓여 있다."], [2, 17, "밀가루 포대가 쌓여 있다."],
    ],
    npcs: [
      { id: "suhyeon", x: 7, y: 3, spr: "gl_suhyeon", dir: "down", move: "fixed", talk: suhyeonTalk },
      { id: "guide3", x: 10, y: 18, spr: "student", dir: "left", move: "look", talk: gym3GuideTalk },
      ...GYM3_KIDS.map(k => ({ id: k.id, x: k.x, y: k.y, spr: k.spr, dir: k.dir, move: "fixed", talk: () => gym3KidTalk(k) })),
      ...D.gym3.gates.map(([x, y], i) => ({ id: "g3gate" + (i + 1), x, y, special: gateDrawer("gate_kitchen"), move: "fixed", show: () => !G.flag("g3q" + (i + 1)), talk: () => gym3Quiz(i + 1) })),
    ],
  };
  MAPS.center_bisaek = { ...MAPS.center, exit: exitB("center_bisaek"),
    npcs: [MAPS.center.npcs.find(n => n.id === "nurse"),
      { x: 2, y: 6, spr: "woman", move: "look", talk: "풀 타입 기술은 물·땅·바위 타입에\n효과가 굉장하대.\f그 대신 불꽃이랑 비행에\n약하고!" },
      { x: 11, y: 5, spr: "oldman", move: "look", talk: "할아버지: 요천 물과 섬진강 물이\n여기서 하나가 된단다." }] };
  MAPS.mart_bisaek = { ...MAPS.mart, name: "비색 만물상", exit: exitB("mart_bisaek"),
    npcs: [MAPS.mart.npcs.find(n => n.id === "clerk"), MAPS.mart.npcs.find(n => n.id === "clerk2"),
      { x: 7, y: 6, spr: "kid_m", move: "look", talk: "마비풀이환 꼭 사 가!\f광대섯 저리가루에 맞으면\n몸이 찌릿찌릿하거든." }] };
  MAPS.house_e = { rows: D.house_a.rows, stamps: D.house_a.stamps, indoor: true, name: "한옥", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "bisaek", noPopup: true, exit: exitB("house_e"),
    checks: [[0, 1, "자개장이 반짝반짝 빛난다."], [1, 1, "자개장이 반짝반짝 빛난다."], [6, 2, "병풍에 두 줄기 강이\n하나로 만나는 그림이 있다."], [7, 2, "병풍에 두 줄기 강이\n하나로 만나는 그림이 있다."]],
    npcs: [{ id: "house_e_gm", x: 2, y: 4, spr: "oldwoman", move: "look", talk: async () => {
      if (!G.flag("house_e_gift")) { await say("할머니: 우리 손녀가 수현 선생님 반이란다.\f선생님이 반 아이들 생일마다\n빵을 구워 주신다더구나."); await say("할머니: 먼 길 왔구나.\n이거 들고 가렴."); await getItem("moomoomilk", 2); G.flag("house_e_gift", true); return; }
      await say("할머니: 강물 소리 들으면서 자면\n꿈도 맑게 꾼단다."); } }] };

  // ---- 타운맵 '지금 있는 곳' ----
  Object.assign(TOWN_ZONE, { "4번도로": "r4", "대산 쉼터": "r4", "5번도로": "r5", "주생 들판": "r5", "요천 둑길": "r5", "비색마을": "bisaek", "섬진강 둑길": "bisaek", "비색 배움터": "bisaek" });
})();
