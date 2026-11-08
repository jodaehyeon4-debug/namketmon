// ===== v1.5 둘째 장: 쪽빛마을(사매) · 서도역의 가람 · 쪽물 항아리 소동 · 숲속 아틀리에 배움터 · 지킴이 미영 · 혼불 어사패 =====
// route2.js 뒤에 읽힘: 2번도로 위쪽을 쪽빛마을과 잇고, 마을·실내 지도와 이야기를 만든다.
"use strict";
const JD = MAPDATA.jjok.doors;
const exitJ = k => ["jjok", JD[k][0], JD[k][1], "down"];
const nightNow = () => ["저녁", "밤"].includes(timeOfDay());
const zoneBgm = () => { const zi = World.zoneInfo(); if (zi.bgm) bgm(typeof zi.bgm === "function" ? zi.bgm() : zi.bgm); };

// 쪽빛마을 들판 출현표 (2번도로 5–9 → 3번도로 9–13 사이). 유혈목이를 닮은 스르미(독)는 페어리 배움터 공략 열쇠
DATA.spawns["쪽빛마을"] = [
  { k: "jjaekcham", lv: "10–13", t: "낮", r: "흔함" }, { k: "olchaengmi", lv: "10–13", t: "모두", r: "흔함" },
  { k: "kkulbeong", lv: "10–13", t: "낮", r: "흔함" }, { k: "seureumi", lv: "10–13", t: "낮", r: "가끔" },
  { k: "mudangkong", lv: "11–13", t: "낮", r: "가끔" }, { k: "heosuni", lv: "10–13", t: "밤", r: "가끔" },
  { k: "honmangul", lv: "10–13", t: "밤", r: "흔함" },
].filter(e => MON[e.k]);

// =====================================================================
// 1. 서도역: 가람과의 첫 만남
// =====================================================================
const GARAM1 = { id: "garam1", cls: "도령", name: "가람", spr: "garam", base: 30, music: "garam", bgm: "trainer", canLose: true,
  loseText: "가람: ……괜찮아.\n네 친구들, 많이 지쳤어.",
  intro: "가람: 네 남켓몬 목소리,\n들어 본 적 있어?\f……없구나.\n그럼 들려줄게.",
  lose: "가람: ……들렸어.\f네 친구들이 말하고 있어.\n'이 아이랑 같이 있고 싶다'고.",
  // 져도 이야기는 이어짐. 측정(둘, Lv15): 풀 43·불꽃 100·물 100% / Lv16: 풀 87%
  team: [["honmangul", 13, { mv: ["ember", "astonish", "tailwhip", "willowisp"] }], ["kkajak", 14]] };
async function garamEvent() {
  const P = World.player, A = act("garam");
  if (!A) return;
  bgm("garam");
  await say("……덜컹, 덜컹.\f기차가 서지 않는 옛 서도역 쪽에서\n바람 소리 같은 노래가 들려온다.");
  A.hidden = false; A.x = 33; A.y = 27;      // v2.24 옛 서도역 옆 집 앞
  await emote(A, "quest", 30);
  await walkPath(A, P.x + 1, P.y); face(A, P); face(P, A);
  await say("???: ……거기, 너.\f지금 네 볼 속의 아이가\n나를 보고 있었어.");
  await say("가람: 나는 가람.\f이 옛 기차역은 조용해서 좋아.\n여기 아이들 목소리가 잘 들리거든.");
  await say("가람: 남켓몬은 볼 속에서\n무슨 꿈을 꿀까?\f……사람 곁에 있으면\n행복할까?");
  const r = await trainerBattle({ x: A.x, y: A.y, dir: A.dir, trainer: GARAM1 }, false);
  G.flag("garam1_done", true);
  bgm("garam");
  if (r === "win") await say("가람: 이상하네.\f사람들이 남켓몬을 아프게 한다고\n들었는데…… 너는 아니구나.");
  else { await say("가람: 쉬게 해 줘.\f……사람들은 남켓몬이 지친 줄도\n모를 때가 많거든.");
    await say("가람이 쓰러진 남켓몬들에게\n가만히 손을 얹었다……"); G.healAll(); await Audio2.jingle("jg_heal");
    await say("남켓몬들이 기운을 되찾았다!"); }
  await say("가람: 남켓몬은 본디 있던 자리에서\n가장 편안해.\f나는 그렇게 믿어.\n……다시 만나.");
  await walkPath(A, 34, 31); sfx("exit"); await fadeOut(8); A.hidden = true; await fadeIn(8);
  await say("(가람은 옛 서도역 뒤로\n어디론가 사라졌다……)");
  zoneBgm();
}

// =====================================================================
// 2. 쪽 염색 마당: 쪽물 항아리 소동 → 지킴이 미영 첫 등장
// =====================================================================
const JJ_GRUNT1 = { id: "bondi_jjok1", cls: "본디회", name: "단원", spr: "grunt_m", base: 30, music: "bondi", bgm: "trainer",
  intro: "단원: 비켜라, 꼬마!\f들판 남켓몬들은 사람 때문에\n쉴 곳이 없다고!\f어둡고 시원한 항아리 속이\n본디 자리지!",
  lose: "단원: 으윽……\n항아리 뚜껑이 미끄러졌다!",
  team: [["seureumi", 15], ["kkulbeong", 15]] };
const JJ_GRUNT2 = { id: "bondi_jjok2", cls: "본디회", name: "단원", spr: "grunt_f", base: 30, music: "bondi", bgm: "trainer",
  intro: "단원: 우리는 남켓몬을 지키는 거야.\n본디대로!\f방해하면 너도 항아리행이야!",
  lose: "단원: 거짓말……\n꼬마한테 둘 다 지다니!",
  team: [["heosuni", 15], ["honmangul", 16]] };
async function dyeEvent() {
  const P = World.player, Gm = act("dye_gm"), B1 = act("jg1"), B2 = act("jg2"), M = act("miyeong_f");
  if (!Gm || !B1 || !B2 || !M) return;
  World.noBgm = false;
  await emote(P, "excl", 24);
  await say("할머니: 아이고, 안 돼!\n그건 내 쪽물 항아리야!");
  bgm("bondi");
  await walkPath(P, 13, 28); P.dir = "up";        // v2.24 쪽물 항아리 앞 가지길
  B1.hidden = false; B2.hidden = false;
  await say("단원: 쉿, 할머니!\f들판 무당콩이 항아리 속에서\n편히 쉬고 있잖아요.");
  await say("할머니: 쪽물은 쪽 잎을 오래 삭힌\n푸른 물이란 말이야!\f남켓몬이 들어가면 온몸이\n새파랗게 물들어 버려!");
  await say("단원: ……어? 정말?\f아, 아무튼! 남켓몬은 본디\n조용한 곳에 있어야 해!");
  face(B1, P); await emote(B1, "excl", 24);
  await say("단원: 뭐야, 너는?\n방해하지 마!");
  if (!G.flag("tr_" + JJ_GRUNT1.id)) { const r = await trainerBattle({ x: B1.x, y: B1.y, dir: B1.dir, trainer: JJ_GRUNT1 }, false); if (r !== "win") return; }
  face(B2, P);
  await say("단원: 내가 해!\n항아리는 못 넘겨!");
  if (!G.flag("tr_" + JJ_GRUNT2.id)) { const r = await trainerBattle({ x: B2.x, y: B2.y, dir: B2.dir, trainer: JJ_GRUNT2 }, false); if (r !== "win") return; }
  bgm("bondi");
  await say("단원: 큭……\n이 꼬마, 만만치 않아!");
  // 미영 등장 (길 위쪽에서 천천히 걸어 내려옴)
  M.hidden = false; M.x = 19; M.y = 19;
  await say("???: ……시끄럽네.");
  await walkPath(M, 14, 28); face(M, B1); face(B1, M); face(B2, M);
  await say("???: 붓이 떨렸잖아.\n그림 하나 망쳤어.");
  await say("단원: 다, 당신은……\f쪽빛 배움터의 지킴이,\n미영……!");
  await say("미영: 남켓몬이 쉴 곳이 없다.\n……그 걱정은 알겠어.");
  await say("미영: 그런데 쉴 곳을 정하는 건\n너희가 아니야.\f무당콩한테 물어봤어?\n항아리 속이 좋으냐고.");
  await say("단원: 그, 그건……");
  sfx("ball_open"); await emote(Gm, "heart", 30);
  await say("항아리 뚜껑이 열리고\n무당콩이 포르르 날아올랐다!\f……빨간 등이 살짝\n파래진 것 같다.");
  await say("단원들: 본, 본디대로—!");
  sfx("exit"); await fadeOut(10); B1.hidden = true; B2.hidden = true; await fadeIn(10);
  bgm("gym2");
  face(M, P); face(P, M);
  await say("미영: ……너.\n……나쁘지 않아.");
  await say("미영: 고맙다는 말은 됐어. 대신—");
  await emote(M, "heart", 30);
  await say(`미영: ……그 아이.\n${J(mname(G.party[0]), "은")} 눈이 참 동그랗네.\f그려 둬도 돼?\f……흠흠.\n아무것도 아니야.`);
  await say("할머니: 미영 선생님은 저래 봬도\n남켓몬이라면 사족을 못 쓴단다.\f고맙구나, 꼬마야.\n덕분에 쪽물도 무사해.");
  face(M, Gm);
  await say("미영: 할머니, 쪽물 색은 괜찮아요?");
  await say("할머니: 그럼그럼.\f오늘도 담그고, 말리고, 또 담글 거야.\n아직 옥색밖에 안 나왔거든.");
  face(M, P);
  await say("미영: ……봐.\f쪽빛은 한 번에 나오지 않아.\n담그고, 꺼내 말리고, 또 담가야 해.\f처음엔 옅은 옥색이지만\n되풀이할수록 깊은 남색이 되지.");
  await say("미영: '청출어람'이라는 말 알아?\f쪽에서 나온 푸른빛이\n쪽보다 더 푸르다.\f제자가 스승보다 나아진다는 뜻으로\n쓰는 말이야.");
  await say("미영: 배틀도 마찬가지야.\n한 번 졌다고 끝나지 않아.\f……배움터에서 기다릴게.\n그리던 그림 마저 그리고.");
  G.flag("dye_done", true);
  const kid = act("gym2_door_kid"); if (kid) kid.hidden = true;
  await walkPath(M, 27, 8); await walk(M, "up"); M.hidden = true; sfx("door");
  if (typeof jpDye === "function") await jpDye();   // v2.59 정표 ② 쪽빛 손수건(청출어람)
  zoneBgm();
}

// =====================================================================
// 3. 쪽빛 배움터 (숲속 아틀리에): 수업 문 셋 → 미영
// =====================================================================
const QUIZ2 = [
  { board: "수업판: '수업 하나 · 오늘 있었던 일'\f쪽 염색 마당에서 미영 선생님이\n쪽빛 이야기를 해 주었어요.",
    q: "짙은 쪽빛을 얻으려면\n어떻게 한다고 했나요?", opts: ["한 번 오래 담가 둔다", "담그고 말리기를 되풀이", "파란 물감을 섞는다"], a: 1, gift: "superpotion",
    good: "쪽 염색은 담그고, 꺼내 말리고,\n또 담그기를 여러 번 되풀이해.\f그럴수록 옅은 옥색에서\n깊은 남색이 된대.\f'청출어람'도 여기서 나온 말이야.\n쪽에서 나온 빛이 쪽보다 푸르다!\f우리 배움터도 그래.\n틀려도 다시 하면 더 깊어져!" },
  { board: "수업판: '수업 둘 · 남원 생태도감'\f2번도로 도랑에서 만난 올챙미는\n'올챙이'를 닮은 남켓몬이에요.",
    q: "올챙이가 개구리가 될 때\n먼저 나오는 다리는?", opts: ["뒷다리", "앞다리", "네 다리가 한꺼번에"], a: 0, gift: "jujube",
    good: "올챙이는 뒷다리가 먼저 나오고\n그다음에 앞다리가 나와.\f꼬리는 몸속으로 흡수되면서\n점점 짧아지다가 없어진대.\f올챙미도 자라면\n개굴미가 된다고!" },
  { board: "수업판: '수업 셋 · 타입 상성'\f미영 선생님의 남켓몬은\n모두 페어리 타입이에요.",
    q: "페어리 타입에게 효과가\n굉장한 기술 타입은?", opts: ["격투", "독", "드래곤"], a: 1, gift: "tm09", giftAlways: "은채: 이거 줄게!\n기술머신09 '베놈쇼크'야.\f독 타입 기술이라 페어리에게\n효과가 굉장해. 꼭 써 봐!",
    good: "독 타입과 강철 타입 기술이\n페어리에게 잘 통해.\f반대로 격투·벌레·악 기술은\n반만 들어가고\f드래곤 기술은\n아예 안 통해.\f쪽빛마을 들판의 스르미가 독 타입,\n광한루원의 엽전이가 강철 타입이야.\f그리고 페어리 기술은\n불꽃·독·강철 타입에게 약해!" },
];
const GYM2_KIDS = [
  { id: "g2k1", n: 1, x: 8, y: 16, dir: "left", spr: "kid_f",
    hint: "하윤: 수업판 문제를 맞히면\n문이 열려!\f아까 쪽 염색 마당에서\n미영 선생님이 뭐라고 하셨는지 기억나?",
    after: "하윤: 미영 선생님은 무뚝뚝해 보여도\n우리 그림을 제일 오래 봐 주셔.",
    tr: { id: "gym2_hayun", cls: "미술반 짝꿍", name: "하윤", spr: "kid_f", base: 20, team: [["bangato", 14], ["jjaekcham", 15]],
      intro: "하윤: 좋아, 배틀로 알아보자!\n내 방아토는 그림 모델이야!", lose: "하윤: 와, 색깔이 확 바뀌었네!" } },
  { id: "g2k2", n: 2, x: 10, y: 11, dir: "up", spr: "kid_m",
    hint: "시우: 이번 문제는 남원 생태도감!\f2번도로 도랑의 올챙미를 떠올려 봐.\n잡았다면 도감에서 ▶를 눌러 봐!",
    after: "시우: 나는 올챙이가 개구리 되는 걸\n그림 일기로 그렸어!",
    tr: { id: "gym2_siu", cls: "미술반 짝꿍", name: "시우", spr: "kid_m", base: 20, team: [["olchaengmi", 15], ["mudangkong", 16]],
      intro: "시우: 내 무당콩은\n칠성무당벌레를 닮았어.\f농부의 친구지!", lose: "시우: 으앗, 물감이 다 튀었다!" } },
  { id: "g2k3", n: 3, x: 4, y: 6, dir: "left", spr: "kid_f",
    hint: "은채: 마지막은 타입 상성!\f미영 선생님 남켓몬은\n모두 페어리 타입이야.\f페어리는 격투랑 드래곤에는 강한데……\n무엇에 약할까?",
    after: "은채: 미영 선생님 스카프, 봤어?\n분홍색이야! 귀엽지?",
    tr: { id: "gym2_eunchae", cls: "미술반 짝꿍", name: "은채", spr: "kid_f", base: 20, team: [["mudangkong", 16], ["bangato", 16]],
      intro: "은채: 페어리 타입의 무서움,\n미리 맛보여 줄게!", lose: "은채: 내가 졌어.\n선생님은 더 세!" } },
];
function gateDrawer(tile) { return (x, y) => { const T = JSN.tiles_in && JSN.tiles_in.t; if (!T || T[tile] === undefined) return; tileAt(TSET.in, T[tile], Math.round(x), Math.round(y)); }; }
async function gym2Quiz(n) {
  const F = "g2q" + n;
  if (G.flag(F)) { await say("수업판 구석에 작은 꽃 그림이\n'참 잘했어요' 도장 대신 그려져 있다."); return; }
  const Q = QUIZ2[n - 1], k = GYM2_KIDS[n - 1], K = act(k.id), P = World.player, nm = k.tr.name;
  await say(Q.board);
  const v = await quizAsk(Q.q, Q.opts);
  if (v < 0) { await say("(조금 더 생각해 보고\n다시 풀어 보자.)"); return; }
  if (K) { face(K, P); await emote(K, v === Q.a ? "heart" : "quest", 26); }
  if (v === Q.a) {
    await Audio2.jingle("jg_levelup");
    await say(`${nm}: 딩동댕! 정답이야!`);
    await say(`${nm}: ` + Q.good);
    await say(`${nm}: 정답 선물이야!`); await getItem(Q.gift);
    if (Q.gift === "tm09") await say(`${nm}: 기술머신09 '베놈쇼크'야.\f독 타입 기술이라 페어리에게\n효과가 굉장해. 꼭 써 봐!`);
  } else {
    sfx("flee_fail");
    await say(`${nm}: 땡! 아쉽다~\f괜찮아, 쪽물도 여러 번 담가야\n깊어지는걸. 배틀하면서 같이 알아보자!`);
    if (!G.flag("tr_" + k.tr.id)) {
      const r = await trainerBattle({ x: K.x, y: K.y, dir: K.dir, trainer: k.tr }, false);
      if (r !== "win") return;
    }
    await say(`${nm}: 정답은 '${Q.opts[Q.a]}'였어!`);
    await say(`${nm}: ` + Q.good);
    if (Q.giftAlways && !G.has(Q.gift)) { await say(Q.giftAlways); await getItem(Q.gift); }
  }
  const gt = act("g2gate" + n); sfx("door");
  if (gt) { for (let i = 0; i < 4; i++) { gt.hidden = !gt.hidden; await frames(5); } gt.hidden = true; }
  G.flag(F, true);
  await say("나무 울타리 문이 활짝 열렸다!");
}
async function gym2KidTalk(k) {
  const K = act(k.id);
  if (!G.flag("g2q" + k.n)) { await say(k.hint); return; }
  if (!G.flag("tr_" + k.tr.id)) {
    if (await yes(`${k.tr.name}: 수업 문은 열렸어!\n연습 배틀 한 판 할래?`)) await trainerBattle({ x: K.x, y: K.y, dir: K.dir, trainer: k.tr }, false);
    else await say(`${k.tr.name}: 좋아, 미영 선생님께 힘내!`);
    return;
  }
  await say(k.after);
}
async function gym2GuideTalk() {
  if (hasBadge(2)) {
    if (!G.flag("guide2_gift")) { await say("도우미: 혼불 어사패! 축하해요!\f미영 선생님이 어사패를 줄 때\n살짝 웃으셨죠? 저는 봤어요!\f이건 제 선물이에요."); await getItem("lemonade", 2); G.flag("guide2_gift", true); return; }
    await say("도우미: 미영 선생님 화실에는\n남켓몬 그림이 백 장도 넘게 있대요.\f……본인은 비밀이라고 하셨지만요!"); return;
  }
  await say("도우미: 어서 와요, 도전자님!\n여기는 쪽빛 배움터, 숲속 아틀리에예요.\f울타리 문 앞의 수업판 문제를 맞히면\n문이 열려요.\f틀려도 괜찮아요. 옆의 미술반 짝꿍과\n배틀하면서 배우면 되니까요!\f미영 선생님은 페어리 타입을 써요.\n페어리 타입은 독과 강철에 약하답니다!");
}

// ---- 지킴이 미영 ----
// v2.56 첫 두 배움터는 처음 배우는 곳이라 보통 트레이너처럼 생각함(smart: 1) — 실제 게임 첫 관장처럼 너그럽게
const MIYEONG = { smart: 1, id: "leader_miyeong", cls: "지킴이", name: "미영", spr: "gl_miyeong", type: "페어리", indoor: true, bg: "indoor", base: 100, music: "eyes", bgm: "battle_gym",
  intro: "미영: 쪽빛 배움터 지킴이, 미영.\f페어리는 여린 줄 알지?\n……한번 겪어 봐.",
  lose: "미영: ……좋은 색이 나왔네.\f네 남켓몬들, 한 번 더 담글수록\n깊어지는 쪽빛 같아.",
  // 난이도(v1.5 측정, 상성 아는 아이 70%·상처약 2개, 스타팅별 30판): 혼자 Lv20 풀 93·불꽃 100·물 67%, 둘(Lv19+둘째 17) 풀 73·불꽃 100·물 73%
  // 처음 안(에이스 달방아 19 + 드레인키스)은 풀·물 스타팅이 Lv21 혼자 0~13%, 둘이 20~37% → 에이스를 방아토로, 기술머신09(베놈쇼크)를 수업 셋에서 줌
  team: [["bangato", 19, { mv: ["drainingkiss", "disarmingvoice", "growl", "pound"] }],
         ["mudangkong", 20, { ab: "liquidooze", mv: ["fairywind", "tackle", "supersonic", "safeguard"] }],
         ["bangato", 21, { mv: ["drainingkiss", "disarmingvoice", "charm", "pound"], item: "jujube" }]] };
const MY_HINT = [
  "미영: 또 왔네.\f……지난번엔 왜 졌는지 생각해 봤어?\f페어리는 독과 강철에 약해.\n쪽빛마을 들판에 스르미가 산다던데.",
  "미영: 포기 안 하는구나.\f……방아토는 애교부리기로\n상대 공격을 크게 떨어뜨려.\f그럴 땐 남켓몬을 바꾸거나\n특수 기술로 맞서는 게 좋아.",
  "미영: 쪽물은 한 번 더 담글수록\n깊어진다고 했지.\f내 방아토는 대추를 지니고 있어.\nHP가 반 아래로 내려가면 먹고 버티지.\f상처약 챙기고, 레벨도 조금 올리고.\n……기다릴게.",
];
async function miyeongTalk(a) {
  if (hasBadge(2)) { await say(`미영: ${G.name}.\f……요즘 표정,\n나쁘지 않아.\f가끔 그림 보여 주러 와.\n네 남켓몬도 같이.`); return; }
  const lost = G.flags.my_lost || 0;
  if (!lost) {
    await say("미영: 왔구나.\f울타리 문 셋, 다 지나왔네.\n……나쁘지 않아.");
    await say("미영: 그림은 한 번에 완성되지 않아.\n밑그림, 물감, 또 물감.\f배틀도 똑같아.\n한 수 한 수 쌓아 가는 거야.");
  } else await say(MY_HINT[Math.min(lost, MY_HINT.length) - 1]);
  const r = await trainerBattle({ x: a.x, y: a.y, dir: a.dir, trainer: MIYEONG }, false);
  if (r !== "win") { G.flags.my_lost = lost + 1; return; }
  bgm("gym2");
  await say("미영: ……이건 쪽빛 배움터의\n'혼불 어사패'.");
  await getBadge(2, "미영");
  G.flag("badge2", true);
  await say("미영: 혼불은 사람 마음속의\n푸르스름한 불빛이래.\f『혼불』을 쓴 작가는 그 이야기를\n17년 동안 한 글자씩 써 내려갔어.\f오래 공들인 것만이\n그런 빛을 내지.");
  await say("미영: 쪽빛마을의 부탁은 하나.\f한 번에 되지 않아도 괜찮아.\n여러 번 물들여서, 깊어져.");
  await say("미영: 그리고…… 이것도.");
  await getItem("tm71");
  await say("미영: 기술머신71 '드레인키스'.\f준 데미지의 반 넘게\nHP를 되찾는 페어리 기술이야.\f……오래 버티는 것도 실력이니까.");
  await emote(a, "heart", 30);
  await say("미영: 아, 그리고 이건 비밀인데.\f아까 그 그림, 다 그렸어.\n……잘 나왔어.");
}

// =====================================================================
// 4. 혼불 어사패 뒤: 북쪽 출구에서 라이벌 한결
// =====================================================================
const RIVAL_EVO = { mongjjuk: "kkotmong", bulsap: "chorongsap", kkokkuri: "kkumuri" };
// 한결의 스타팅은 늘 내 스타팅에 상성이 좋다 → 가장 센 상성 기술(아쿠아커터·매지컬플레임)은 아직 안 씀. 져도 이야기는 이어짐
const RIVAL3_MV = { chorongsap: ["flamecharge", "ember", "scratch", "tailwhip"], kkumuri: ["waterpulse", "aquajet", "mudslap", "leer"], kkotmong: ["magicalleaf", "acid", "mudslap", "growl"] };
const rival3 = () => { const k = RIVAL_EVO[RIVAL_OF[G.starter] || "bulsap"] || "chorongsap";
  return { id: "rival3", cls: "라이벌", name: "한결", spr: "hangyeol", music: "rival", bgm: "trainer", base: 40, canLose: true,
    loseText: "한결: 봤지? 봤지?\n이번엔 내가 이겼다!",
    intro: "한결: 혼불 어사패?\f흥, 나도 방금 땄거든!\n이번엔 진짜 안 져!",
    lose: "한결: 말도 안 돼……!\n세 번째인데!",
    team: [["darijak", 20, { mv: ["quickattack", "wingattack", "featherdance", "tailwind"] }], [k, 20, { mv: RIVAL3_MV[k] }]] }; };
async function rivalJjok() {
  const P = World.player, H = act("hangyeol_c2");
  if (!H) return;
  bgm("rival");
  await say(`???: 야, ${G.name}!`);
  P.dir = "down";
  H.x = P.x; H.y = Math.min(P.y + 4, 12); H.hidden = false;
  await walkTo(H, P.x, P.y + 1); face(H, P);
  await emote(H, "excl", 26);
  const r = await trainerBattle({ x: H.x, y: H.y, dir: H.dir, trainer: rival3() }, false);
  bgm("rival");
  if (r !== "win") { await say("한결: ……근데 너도 많이 늘었다.\n진짜로."); await say("한결: 자, 이거 마시게 해.\n쓰러진 채로 다니면 안 되잖아!");
    G.healAll(); await Audio2.jingle("jg_heal"); await say("남켓몬들이 기운을 되찾았다!"); }
  await say("한결: ……근데 너, 아까 서도역에서\n이상한 애 못 봤어?\f검은 두건 쓴 애.\n나한테 대뜸 묻더라.\f'네 남켓몬은 행복해?'라고.");
  await say("한결: 당연하지!\f……당연한 거, 맞지?");
  await say("한결: 흥, 됐어!\n다음엔 갈매마을에서 붙자!");
  await walkPath(H, P.x === 19 ? 20 : 19, 3); H.hidden = true;
  G.flag("rival3_done", true);
  zoneBgm();
}

// =====================================================================
// 지도에 붙이기
// =====================================================================
(function attachJjok() {
  // ---- 2번도로 위쪽을 쪽빛마을로 연다 (공사 일꾼은 사라짐) ----
  const R2 = MAPS.route2;
  R2.npcs = R2.npcs.filter(o => !/^r2_worker/.test(o.id || ""));
  R2.warps = (R2.warps || []).concat([24, 25, 26, 27].map(x => [x, 0, ["jjok", x - 6, 39, "up", "edge"]]));
  R2.signs = R2.signs.map(s => (s[0] === 28 && s[1] === 3) ? [28, 3, "↑ 쪽빛마을\n소설 『혼불』의 마을 · 옛 서도역"] : s);
  const boreum = R2.npcs.find(o => o.id === "boreum_r2"); if (boreum) boreum.show = () => !G.flag("dye_done");

  const JJ = MAPDATA.jjok;
  MAPS.jjok = {
    rows: JJ.rows, stamps: JJ.stamps, name: "쪽빛마을",
    warps: [18, 19, 20, 21].map(x => [x, 39, ["route2", x + 6, 0, "down", "edge"]]),
    zones: [["쪽빛마을", 0, 0, 39, 39]],
    zinfo: { "쪽빛마을": { bgm: "jjok", enc: "쪽빛마을", rate: 0.12, bg: "grass" } },
    signs: [
      [17, 35, "쪽빛마을\n여러 번 물들어 깊어지는 마을"],
      [22, 2, "쪽빛 배움터 · 숲속 아틀리에\n지킴이 미영 · 페어리 타입"],
      [31, 22, "서도역\n옛 전라선 기차역"],
      [10, 9, "혼불문학관\n소설 『혼불』과 작가 최명희"],
    ],
    checks: [
      ...[10, 11, 12].map(x => [x, 22, "쪽물을 들인 천이 바람에 나부낀다.\f연한 옥색, 하늘색, 짙은 남색……\n물들인 횟수마다 빛깔이 다르다."]),
      ...[[13, 23], [14, 23], [13, 24], [14, 24]].map(([x, y]) => [x, y, () => say(G.flag("dye_done") ? "쪽물 항아리.\f쪽 잎을 삭혀 만든 푸른 물이\n찰랑찰랑 담겨 있다." : "쪽물 항아리.\f……안에서 무언가\n바스락거리는 소리가 난다.")]),
      ...[26, 27, 28, 29, 30, 31].map(x => [x, 23, "옛 서도역.\f기와를 얹은 작은 나무 역사다.\n소설 『혼불』의 배경이 된 곳이다."]),
      ...[19, 20, 22, 24, 26, 28, 30, 31].map(y => [35, y, "옛 기찻길.\f철길을 새로 놓은 뒤로\n이 역에는 기차가 서지 않는다."]),
    ],
    triggers: [],
    areas: [
      { x0: 18, y0: 27, x1: 21, y1: 31, cond: () => !G.flag("garam1_done"), run: garamEvent },
      { x0: 18, y0: 19, x1: 21, y1: 26, cond: () => G.flag("garam1_done") && !G.flag("dye_done"), run: dyeEvent },
      { x0: 18, y0: 2, x1: 21, y1: 6, cond: () => hasBadge(2) && !G.flag("rival3_done"), run: rivalJjok },
    ],
    npcs: [
      // 이야기
      { id: "garam", x: 33, y: 25, spr: "garam", dir: "left", hidden: true, move: "fixed", show: () => !G.flag("garam1_done") },
      { id: "dye_gm", x: 15, y: 24, spr: "oldwoman", dir: "left", move: "look", talk: async () => {
        if (!G.flag("dye_done")) { await say("할머니: 아이고, 저 사람들 좀 말려 다오!"); return; }
        if (!G.flag("dye_gift")) { await say("할머니: 아까는 고마웠다.\f쪽은 잎을 따서 오래 삭혀야\n푸른 물이 나온단다.\f그 물에 담그고, 바람에 말리고,\n또 담그고……\f그렇게 여러 번 되풀이해야\n이렇게 깊은 남색이 되지."); await say("할머니: 이건 고마움의 표시야.\n쪽물 들인 천으로 싸 두었단다."); await getItem("superpotion", 2); G.flag("dye_gift", true); return; }
        await say("할머니: 옥색, 하늘색, 남색……\f한 항아리에서 나온 빛인데\n담근 횟수만큼 다르단다."); } },
      { id: "jg1", x: 13, y: 26, spr: "bondi", dir: "down", hidden: true, move: "fixed", show: () => !G.flag("dye_done") },
      { id: "jg2", x: 12, y: 25, spr: "bondi", dir: "down", hidden: true, move: "fixed", show: () => !G.flag("dye_done") },
      { id: "miyeong_f", x: 19, y: 19, spr: "gl_miyeong", dir: "down", hidden: true, move: "fixed", show: () => !G.flag("dye_done") },
      { id: "gym2_door_kid", x: 27, y: 8, spr: "kid_f", dir: "down", move: "fixed", show: () => !G.flag("dye_done"),
        talk: () => say("미영 선생님은 지금 안 계셔.\f쪽 염색 마당 쪽으로\n그림 그리러 가셨어!") },
      { id: "hangyeol_c2", x: 19, y: 10, spr: "hangyeol", dir: "up", hidden: true, move: "fixed", show: () => hasBadge(2) && !G.flag("rival3_done") },
      // 마을 사람
      { x: 29, y: 26, spr: "oldman", dir: "up", move: "look", talk: "옛날엔 이 서도역에서\n기차를 타고 전주까지 갔단다.\f철길이 새로 놓이면서\n역이 문을 닫았지.\f지금은 시에서 예쁘게 고쳐서\n『혼불』 마을로 가꾸고 있단다." },
      { x: 17, y: 14, spr: "woman", move: "wander", r: 1, talk: "이 마을은 소설 『혼불』의\n무대가 된 곳이야.\f작가 선생님이 17년 동안 쓰신\n아주 긴 이야기란다." },
      { x: 9, y: 33, spr: "kid_m", dir: "right", move: "look", talk: () => say(nightNow() ? "밤에는 허수아비가\n고개를 돌린대!\f……방금 봤어?" : "무당벌레는 진딧물을 잡아먹어서\n농부의 친구래!\f들판 무당콩도 그렇겠지?") },
      { x: 24, y: 17, spr: "student", move: "wander", r: 1, talk: "미영 선생님 배움터는\n마을 북쪽 숲속 아틀리에야.\f페어리 타입이라고 얕보면 큰코다쳐!" },
      { id: "boreum_jjok", x: 8, y: 11, spr: "boreum", dir: "down", move: "look", show: () => G.flag("dye_done"), talk: async () => {
        if (!G.flag("boreum_jjok_gift")) { await say(`보름: ${G.name}! 문학관 앞에서\n혼망울 기다리는 중이야.\f밤이 되면 푸른 불빛처럼\n둥실 떠오른대!`); await say("보름: 이거 써 봐!\n밤에 남켓몬 잡을 때 좋대."); await getItem("namket", 3); G.flag("boreum_jjok_gift", true); return; }
        await say(nightNow() ? "보름: 왔다, 혼망울!\n쉿, 지금 찍는 중이야!" : "보름: 해가 지려면 아직 멀었네……\n회중시계로 시간을 넘겨 볼까?"); } },
      // 3번도로 공사
      { id: "jj_worker1", x: 19, y: 1, spr: "man", dir: "down", move: "fixed", talk: "미안! 3번도로 다리를\n고치는 중이란다.\f갈매마을(덕과)로 가는 길이야.\f조박사님 배움터가 있는 마을이지.\f(플레이 버전은 여기까지예요!\n다음 이야기: 3번도로와 갈매마을)" },
      { id: "jj_worker2", x: 20, y: 1, spr: "man", dir: "down", move: "fixed", talk: "조금만 기다려 주렴.\n금방 고칠게!" },
      // 떨어진 물건
      { item: "superpotion", x: 3, y: 26 }, { item: "silk", n: 2, x: 30, y: 36 }, { item: "antidote", x: 34, y: 33 }, { item: "yeot", x: 2, y: 37 },
      // 트레이너 (역 앞 들판)
      { x: 24, y: 34, spr: "kid_m", dir: "right", trainer: { id: "jj_junseo", cls: "꼬마", name: "준서", spr: "kid_m", range: 4, base: 16, team: [["jjaekcham", 13], ["kkulbeong", 13]],
        intro: "기차는 안 와도\n남켓몬 승부는 언제든 오케이!", lose: "칙칙폭폭…… 멈췄다.", after: "서도역 승강장 끝에 서 있으면\n바람이 시원해!" } },
      { x: 29, y: 29, spr: "kid_f", dir: "left", trainer: { id: "jj_yerin", cls: "꼬마 숙녀", name: "예린", spr: "kid_f", range: 3, base: 16, team: [["olchaengmi", 13], ["seureumi", 14]],
        intro: "스르미는 독이 있어.\n조심해!", lose: "스르미야, 수고했어!", after: "스르미는 유혈목이를 닮았대.\f진짜 유혈목이를 만나면\n건드리지 말고 천천히 물러나야 해!" } },
    ],
  };
  // ---- 실내 ----
  const D = MAPDATA;
  MAPS.center_jjok = { ...MAPS.center, exit: exitJ("center_jjok"),
    npcs: [MAPS.center.npcs.find(n => n.id === "nurse"),
      { x: 2, y: 6, spr: "woman", move: "look", talk: "페어리 타입은 드래곤 기술을\n하나도 안 받는대.\f그 대신 독이랑 강철에 약하고!" },
      { x: 11, y: 5, spr: "oldman", move: "look", talk: "남켓몬센터는 어느 마을이든\n똑같이 공짜란다.\f마지막으로 들른 센터를\n잘 기억해 두렴." }] };
  MAPS.mart_jjok = { ...MAPS.mart, name: "쪽빛 만물상", exit: exitJ("mart_jjok"),
    npcs: [MAPS.mart.npcs.find(n => n.id === "clerk"), MAPS.mart.npcs.find(n => n.id === "clerk2"),
      { x: 7, y: 6, spr: "kid_f", move: "look", talk: "해독제는 꼭 챙겨!\f들판의 스르미한테 물리면\n독에 걸리거든." }] };
  MAPS.house_c = { rows: D.house_a.rows, stamps: D.house_a.stamps, indoor: true, name: "한옥", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "town", noPopup: true, exit: exitJ("house_c"),
    checks: [[0, 1, "자개장이 반짝반짝 빛난다."], [1, 1, "자개장이 반짝반짝 빛난다."], [6, 2, "병풍에 들판과 기차가 그려져 있다."], [7, 2, "병풍에 들판과 기차가 그려져 있다."]],
    npcs: [{ x: 2, y: 4, spr: "oldwoman", move: "look", talk: async () => {
      if (!G.flag("house_c_gift")) { await say("할머니: 쪽빛 배움터에 가는 거니?\f미영 선생님은 말수는 적어도\n속정이 깊은 분이란다.\f옜다, 시원하게 마시고 힘내렴."); await getItem("freshwater", 2); G.flag("house_c_gift", true); return; }
      await say("할머니: 우리 손주도 미영 선생님한테\n그림을 배운단다."); } }] };
  MAPS.museum = { rows: D.museum.rows, stamps: D.museum.stamps, indoor: true, name: "혼불문학관", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "town", noPopup: true, exit: exitJ("museum"),
    checks: [
      ...[[0, 2], [1, 2], [1, 1]].map(([x, y]) => [x, y, "『혼불』 책이 열 권 꽂혀 있다.\f최명희 작가가 1980년부터 1996년까지\n17년에 걸쳐 쓴 소설이다."]),
      ...[[10, 2], [11, 2], [10, 1]].map(([x, y]) => [x, y, "작가가 손으로 쓴 원고가 전시되어 있다.\f원고지 칸칸이 글자가\n빼곡하게 채워져 있다."]),
      ...[[4, 2], [5, 2]].map(([x, y]) => [x, y, "병풍에 옛 마을 풍경이 그려져 있다."]),
      ...[[5, 4], [6, 4]].map(([x, y]) => [x, y, "방명록이 펼쳐져 있다.\f'남켓몬이랑 같이 왔어요!'\n……누가 쓴 걸까?"]),
      [2, 4, "소설 속 장면을 작게 만든 디오라마다.\f일제 강점기, 남원 사매면\n매안마을 사람들의 이야기라고 한다."], [9, 4, "소설 속 장면을 작게 만든 디오라마다.\f옛 서도역 승강장에서\n사람들이 기차를 기다리고 있다."],
    ],
    npcs: [{ x: 7, y: 4, spr: "woman", dir: "down", move: "fixed", talk: async () => {
      await say("해설사: 혼불문학관에 온 걸 환영해요.\f『혼불』은 최명희 작가가\n1980년부터 1996년까지\f17년 동안 쓴 아주 긴 소설이에요.");
      await say("해설사: 일제 강점기 남원 사매면\n매안마을이 이야기의 무대랍니다.\f이 문학관도 소설의 배경이 된\n마을에 세워졌어요.");
      await say("해설사: '혼불'은 사람의 혼을 이루는\n바탕을 가리키는 우리말이래요.\f옛사람들은 그것이 맑고 푸르스름한\n불빛을 띤다고 믿었대요.");
      if (!G.flag("museum_gift")) { await say("해설사: 끝까지 들어 줘서 고마워요.\n이건 문학관 기념품이에요."); await getItem("gift"); G.flag("museum_gift", true); } } },
      { x: 9, y: 6, spr: "student", move: "look", talk: "숙제로 독후감을 써야 해서 왔어.\f열 권이라니……\n한 권씩 천천히 읽어야겠다." }] };
  // ---- 쪽빛 배움터 ----
  const G2 = MAPDATA.gym2;
  MAPS.gym2 = {
    rows: G2.rows, stamps: G2.stamps, indoor: true, name: "쪽빛 배움터", floor: "floor_atelier", floor2: "floor_atelier2", wall: "wall_atelier", win: "win_atelier", rail: "rail_wood",
    bgm: "gym2", noPopup: true, exit: exitJ("gym2"),
    checks: [
      ...[[4, 16], [5, 16], [4, 17], [5, 17]].map(([x, y]) => [x, y, () => gym2Quiz(1)]),
      ...[[12, 11], [13, 11], [12, 12], [13, 12]].map(([x, y]) => [x, y, () => gym2Quiz(2)]),
      ...[[1, 6], [2, 6], [1, 7], [2, 7]].map(([x, y]) => [x, y, () => gym2Quiz(3)]),
      ...[5, 6, 7, 8].map(x => [x, 1, "숲과 들판, 그리고 남켓몬들이\n커다란 벽화로 그려져 있다.\f한쪽 구석에 작은 서명.\n'미영'"]),
      [6, 7, "이젤 위의 그림. 쪽빛 하늘 아래\n무당콩이 날고 있다."], [12, 7, "이젤 위의 그림.\n방아토가 절구를 찧고 있다."],
      [2, 12, "이젤 위의 그림. 올챙이가\n개구리가 되는 순서가 그려져 있다."], [5, 13, "이젤 위의 그림.\n아직 밑그림뿐이다."], [12, 17, "이젤 위의 그림.\n……아까 본 남켓몬을 닮았다?"],
      [8, 8, "아틀리에 한가운데 자란 나무.\n가지 끝에 작은 빛이 맺혀 있다."], [9, 8, "아틀리에 한가운데 자란 나무.\n가지 끝에 작은 빛이 맺혀 있다."],
    ],
    npcs: [
      { id: "miyeong", x: 7, y: 3, spr: "gl_miyeong", dir: "down", move: "fixed", talk: miyeongTalk },
      { id: "guide2", x: 10, y: 18, spr: "student", dir: "left", move: "look", talk: gym2GuideTalk },
      ...GYM2_KIDS.map(k => ({ id: k.id, x: k.x, y: k.y, spr: k.spr, dir: k.dir, move: "fixed", talk: () => gym2KidTalk(k) })),
      ...G2.gates.map(([x, y], i) => ({ id: "g2gate" + (i + 1), x, y, special: gateDrawer("gate_art"), move: "fixed", show: () => !G.flag("g2q" + (i + 1)), talk: () => gym2Quiz(i + 1) })),
    ],
  };
  // ---- 타운맵 '지금 있는 곳' ----
  Object.assign(TOWN_ZONE, { "쪽빛마을": "jjok", "혼불문학관": "honbul" });
})();
