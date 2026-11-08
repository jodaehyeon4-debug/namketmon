// ===== v2.2 여섯째 장: 주홍마을 동쪽 → 12번도로(지리산 둘레길) · 구룡계곡(가람 ③) → 쑥빛시티(운봉 — 국악당 단원 습격·칠로 소리 어른·보름·지킴이 여심) → 쑥빛 배움터(보건실, 6관장 여심·에스퍼)
// chapter6.js 뒤, hearts.js 앞에 읽힘
// 여심: 관장 문서 6번(보건 선생님·친절함, 말버릇은 사용자가 준 것만 — "음~ 아프겠네" "그럴 수 있지..." "우리 좀 더 지켜볼까?" "괜찮아용~"
//   "잘가요~ ^____________________^" "우리 결론 먼저 말해볼까? ^^;;"). 대사는 가안(D14)
// 사실(위키백과로 확인): 송흥록(1801~1863)은 운봉면 비전리에서 태어나 동편제를 확립, '가왕', 처음으로 진양조를 만듦(매부 김성옥과),
//   진주 촉석루 귀곡성 대목에 촛불이 꺼졌다고 전함 / 황산대첩비: 1380년 이성계가 왜구를 물리친 황산대첩을 기려 1577년(선조 10) 세움,
//   1945년 일본인들이 깨뜨려 파편만 남음(파비각), 지금 비석은 1957년에 다시 세움, 사적 / 운봉: 지리산 북서쪽 고원 분지, 고랭지 채소(배추)
// 코피 응급처치(고개를 앞으로 숙이고 콧볼을 10분쯤 누름, 뒤로 젖히지 않음)는 일반 응급처치 지침
"use strict";
const SBD = MAPDATA.ssukbit.doors;
const exitSB = k => ["ssukbit", SBD[k][0], SBD[k][1], "down"];

// ---- 출현표: 12번도로·구룡계곡은 DATA에 있던 표(33–37 · 32–37)를 그대로 씀 ----
(function fixTownLv7() { for (const r of DATA.town.routes || []) if (r.no === 12) r.lv = "33~37"; })();
if (typeof FISH !== "undefined") {
  FISH.route12 = { at: "12번도로", list: [{ k: "eunchimi", lv: "20–24", r: "흔함", t: "모두" }, { k: "daseulmi", lv: "20–24", r: "흔함", t: "모두" }, { k: "ssogami", lv: "22–24", r: "가끔", t: "모두" }] };
  FISH.guryong = { at: "구룡계곡", list: [{ k: "daseulmi", lv: "21–25", r: "흔함", t: "모두" }, { k: "eunchimi", lv: "21–25", r: "흔함", t: "낮" }, { k: "chireyong", lv: "24–25", r: "드묾", t: "밤" }] };
}
if (typeof HIDDEN !== "undefined") {
  HIDDEN.route12 = [[21, 9, "maxether"], [52, 24, "revive"], [27, 32, "hyperpotion"]];
  HIDDEN.guryong = [[6, 9, "omija"], [22, 15, "ether"], [34, 11, "mogwa"]];
}
if (MV.calmmind && !ITEMS.tm04) ITEMS.tm04 = { n: "기술머신04", p: "tm", price: 3000, nobuy: 1, tm: "calmmind",
  d: "명상을 가르쳐요. 마음을 가라앉혀 특수공격과 특수방어를 함께 올리는 에스퍼 타입 기술이에요.", ic: "tm",
  tmTypes: ["에스퍼", "페어리", "노말", "물", "풀", "얼음", "드래곤", "고스트", "격투"] };

// =====================================================================
// 1. 구룡계곡 구룡폭포: 가람 ③ (설정집 5장 '주천 구룡계곡 가람 ③', 만날 때마다 그 지역 친구들)
// =====================================================================
const GARAM3 = { id: "garam3", cls: "도령", name: "가람", spr: "garam", base: 40, music: "garam", bgm: "trainer", canLose: true,
  intro: "가람: ……네 남켓몬들,\n오늘은 뭐라고 하는지 들어 볼게.",
  lose: "가람: ……들렸어.\f'계곡 물이 맑아져서 좋다'고.\n네 남켓몬들이.",
  loseText: "가람: ……괜찮아?\f쉬게 해 줄게.\n남켓몬들이 놀랐을 거야.",
  team: [["daseulmi", 32, { mv: ["waterpulse", "rockthrow", "protect", "acidarmor"] }], ["danpungbul", 32, { mv: ["magicalleaf", "flamecharge", "leechseed", "smokescreen"] }],
         ["chireyong", 34, { mv: ["waterpulse", "dragonbreath", "raindance", "growl"] }]] };
async function garam3Event() {
  const P = World.player, A = act("garam3");
  if (!A) return;
  G.flag("garam3_met", true);
  bgm("garam");
  await walkPath(P, 18, 12); P.dir = "left"; face(A, P);
  await say("……계곡 깊은 소 앞에서\n누군가 물을 바라보고 있다.");
  await emote(A, "dots", 30);
  await say("가람: ……왔구나.\f육모정에서 그 선생님이\n'계곡 청소한다'고 했잖아.");
  await say("가람: 정말로 했더라.\f아이들이랑 어른들이 와서\n돌 틈에 낀 것까지 다 주웠어.");
  await say("가람: ……봐.\n물이 맑아졌어.\f치레뇽이 돌아왔어.");
  await say("가람: 사람 곁은 남켓몬한테\n시끄럽고 더러운 곳인 줄 알았는데.\f……사람이 치울 수도 있는 거였어.");
  // v2.40 라이벌 배틀 줄이기: 가람 이야기 배틀 5번 → 4번. 계곡 소 앞에서는 말만
  await say("가람: ……오늘은 배틀 안 할래.\f물소리 듣고 있는 남켓몬들,\n방해하고 싶지 않아.");
  await say("가람: 그래도…… 대방님 말씀이\n다 틀렸는지는 아직 모르겠어.");
  await say("가람: 운봉에서 칠로 어른 한 분이\n소리를 가두려고 하신대.\f'사라지기 전에' 라고.");
  await say("가람: ……나는 그 소리,\n가두지 않고 들어 보고 싶어.\f먼저 갈게.");
  sfx("exit"); await fadeOut(8); A.hidden = true; await fadeIn(8);
  G.flag("garam3_done", true);
  zoneBgm();
}

// =====================================================================
// 2. 쑥빛시티 국악당 마당: 본디회 단원 습격 · 칠로 소리 어른 · 지킴이 여심 첫 등장 · 보름
// =====================================================================
const SB_GRUNT1 = { id: "bondi_sb1", cls: "본디회", name: "단원", spr: "grunt_m", base: 30, music: "bondi", bgm: "trainer",
  intro: "단원: 비켜라!\n소리꾀의 노래는 항아리 속에서\f영원히 남을 거다!", lose: "단원: 크윽……\n노래가 멈추면 안 되는데……",
  team: [["heukdoni", 31, { mv: ["headbutt", "bite", "tailwhip", "takedown"] }], ["dochaedong", 32, { mv: ["bite", "astonish", "confuseray", "payback"] }]] };
const SB_GRUNT2 = { id: "bondi_sb2", cls: "본디회", name: "단원", spr: "grunt_f", base: 30, music: "bondi", bgm: "trainer",
  intro: "단원: 소리 어른께서 그러셨어!\n소리가 사라지는 게 무섭다고!", lose: "단원: 어, 어른……\n어떡하죠……",
  team: [["taoryong", 33, { mv: ["flamecharge", "bite", "smokescreen", "ember"] }], ["gwangdaeseot", 32, { mv: ["megadrain", "stunspore", "headbutt", "growth"] }]] };
async function ssukEvent() {
  const P = World.player, S1 = act("sb_g1"), S2 = act("sb_g2"), S3 = act("sb_g3"), O = act("sb_sori"), Y = act("sb_yeosim"), B = act("sb_boreum"), J = act("sb_jar");
  if (!S1) return;
  bgm("bondi");
  await emote(S3, "excl", 24);
  await say("단원: 소리꾀야, 이리 와!\f항아리 속에서\n영원히 노래하렴!");
  await say("국악당 처마 아래, 노란 새 남켓몬이\n파르르 떨고 있다……");
  await walkPath(P, 26, 13); P.dir = "up";
  await say("단원: 또 그 꼬마다!\n교룡산성에서 행수님들을 막았다는!");
  face(S1, P); await emote(S1, "excl", 20);
  let r = await trainerBattle({ x: S1.x, y: S1.y, dir: S1.dir, trainer: SB_GRUNT1 }, false);
  if (r !== "win") return;
  face(S2, P); await emote(S2, "excl", 20);
  r = await trainerBattle({ x: S2.x, y: S2.y, dir: S2.dir, trainer: SB_GRUNT2 }, false);
  if (r !== "win") return;
  bgm("bondi");
  await say("단원: ……으으.\f그래도 우리 마음대로 하는 게\n아니야!\f소리 어른께서 바라신 거라고!");
  sfx("door"); if (O) { O.hidden = false; O.x = 26; O.y = 10; await walkTo(O, 26, 11); face(O, P); }
  await say("국악당 문이 열리고,\n흰 두루마기의 할아버지가 나왔다.");
  await say("???: ……그만두거라.");
  await say("소리 어른: 나는 평생 소리를 하던\n사람이다.\f이 운봉은 동편제 소리꾼들이\n나고 자란 땅이지.");
  await say("소리 어른: 그런데 요즘은\n소리를 들으러 오는 이가 없어.\f그래서 대방께 그런 말을 했다.\n'소리가 사라지는 게 무섭다'고.");
  await say("소리 어른: ……그런데 저 아이는\n내 소리를 따라 울던 아이다.\f가두면, 노래도 멎겠지.");
  await say("소리 어른: 항아리를 열어라.");
  sfx("ball_open"); if (J) J.hidden = true;
  await say("단원들이 항아리 뚜껑을 열자\n소리꾀가 포르르 날아올랐다!");
  try { Audio2.cry("sorikkoe"); } catch (e) {} await frames(20);
  await say("소리꾀는 마당을 한 바퀴 돌더니\n힘없이 마루 끝에 내려앉았다……");
  // 지킴이 여심
  if (Y) { Y.hidden = false; Y.x = 22; Y.y = 14; await walkTo(Y, 25, 14); face(Y, P); }
  sfx("run");
  await say("???: 잠깐만요~!\n다들 그대로 있어요!");
  await say("구급함을 든 사람이\n소리꾀 곁에 무릎을 꿇었다.");
  await say("???: 음~ 아프겠네.\n잠깐만 볼게요.");
  await say("???: ……숨소리 괜찮고,\n날개도 괜찮아요.\f많이 놀랐나 봐요.\n우리 좀 더 지켜볼까?");
  await frames(40);
  await say("소리꾀가 작게\n'꾀꼴' 하고 울었다.");
  await say("???: ……괜찮아용~");
  await say("여심: 아, 인사가 늦었죠.\f쑥빛 배움터 지킴이, 여심이에요.\n보건 선생님이고요.");
  if (O) face(Y, O);
  await say("여심: 어르신 마음,\n그럴 수 있지...\f소리가 사라질까 봐\n겁나셨던 거잖아요.");
  await say("여심: 그럼 우리 결론 먼저\n말해볼까? ^^;;\f소리는 가두는 게 아니라\n들어 주는 거예요.");
  // 보름
  if (B) { B.hidden = false; B.x = 19; B.y = 12; await walkTo(B, 23, 12); }
  sfx("excl");
  await say("보름: 와, 방금 그 노랫소리\n뭐야?! 사진 찍고 싶어!");
  if (B && O) face(B, O);
  await emote(B, "excl", 24);
  await say("보름: ……혹시, 우리 할머니의\n옛 동무 명창 할아버지?");
  if (O && B) face(O, B);
  await say("소리 어른: ……송화마을 그 아이의\n손녀로구나.\f목소리가 네 할머니를\n꼭 닮았다.");
  await say("보름: 할머니가 그러셨어요!\f소리는 불러야 산다고.\n들어 주는 사람이 있으면\f더 오래 산다고요!");
  await emote(O, "dots", 30);
  await say("소리 어른: ……들어 주는 사람, 이라.");
  await say("소리 어른: 단원들은 돌아가거라.\f나는…… 국악당에 조금\n더 있어야겠다.");
  sfx("exit"); await fadeOut(10);
  for (const a of [S1, S2, S3, O]) if (a) a.hidden = true;
  await fadeIn(10);
  await say("(단원들은 서둘러 떠나고,\n소리 어른은 국악당 안으로 들어갔다.)");
  if (Y) face(Y, P);
  await say("여심: 고생했어요.\n남켓몬들도 한번 볼게요~");
  G.healAll(); await Audio2.jingle("jg_heal"); await say("남켓몬들이 기운을 되찾았다!");
  await say("여심: 배움터에서 기다릴게요.\f보건실이라 조금 신기한\n방일 거예요.\f잘가요~ ^____________________^");
  if (Y) { await walkPath(Y, 11, 12); sfx("exit"); Y.hidden = true; }
  if (B) { face(B, P); await say("보름: 나는 할아버지 소리,\n꼭 한 번 들어 볼 거야.\f국악당 앞에서 기다릴래!"); await walkTo(B, 21, 11); B.dir = "up"; }
  G.flag("ssuk_event_done", true);
  zoneBgm();
}

// =====================================================================
// 3. 쑥빛 배움터(보건실) — 순간이동 매트: 문제판의 답 번호가 적힌 매트에 올라서면 다음 방으로(틀리면 그 방 처음 자리로)
// =====================================================================
const MATS6 = MAPDATA.gym6.mats;                                 // {1: 17, 2: 12, 3: 7} 칸마다 매트 줄
const G6_START = { 1: [7, 18], 2: [7, 14], 3: [7, 9], 4: [7, 4] };   // 칸마다 도착 자리
const G6_X = [3, 7, 11];
const QUIZ6 = [
  { board: "문제판: '오늘 있었던 일'\f쑥빛 국악당에서 본디회가\n소리꾀를 항아리에 넣으려 했어요.",
    q: "본디회는 왜 소리꾀를\n항아리에 넣으려 했나요?", opts: ["노랫소리를 남기려고", "소리꾀가 시끄러워서", "국악당을 차지하려고"], a: 0, gift: "revive",
    good: "소리가 사라질까 봐\n겁이 났던 거래.\f그래도 여심 선생님 말씀처럼\n소리는 가두는 게 아니라\f들어 주는 거야!" },
  { board: "문제판: '보건실 상식'\f놀다가 갑자기 코피가 났어요.\n어떻게 하면 좋을까요?",
    q: "코피가 날 때\n바른 방법은?", opts: ["고개 숙이고 콧볼 누르기", "고개를 뒤로 젖히기", "코를 세게 풀기"], a: 0, gift: "fullheal",
    good: "고개를 뒤로 젖히면\n피가 목으로 넘어가서 안 좋대.\f앞으로 살짝 숙이고\n콧볼을 10분쯤 꼭 누르면 돼.\f그래도 안 멈추면\n보건실이나 어른께 바로!" },
  { board: "문제판: '타입 상성'\f여심 선생님의 남켓몬은\n모두 에스퍼 타입이에요.",
    q: "에스퍼 타입에게 효과가\n굉장한 기술 타입은?", opts: ["벌레", "격투", "독"], a: 0, gift: "silverpowder",
    giftAlways: "나윤: 이거 줄게!\n벌레 기술을 세게 해 주는 '누에실'.",
    good: "에스퍼는 벌레·고스트·악에 약해.\f격투랑 독 기술은 오히려\n에스퍼한테 잘 안 통해!\f구룡계곡 밤에 나오는 말굽쥬는\n악 타입이라 든든할 거야." },
];
const GYM6_KIDS = [
  { id: "g6k1", n: 1, x: 13, y: 17, dir: "left", spr: "kid_f",
    hint: "수아: 문제판을 읽고\n답의 번호가 적힌 매트에 서 봐.\f맞으면 다음 방으로 슝~!",
    after: "수아: 여심 선생님은\n아픈 데를 먼저 물어보셔.",
    tr: { id: "gym6_sua", cls: "보건반 짝꿍", name: "수아", spr: "kid_f", base: 20, team: [["kkumnoru", 32]],
      intro: "수아: 순간이동 배틀!\n……은 아니고 그냥 배틀!", lose: "수아: 어지러워……" } },
  { id: "g6k2", n: 2, x: 13, y: 12, dir: "left", spr: "kid_m",
    hint: "건우: 이번 문제는 보건실 상식!\f여심 선생님이 맨날\n알려 주시는 거야.",
    after: "건우: 다치면 숨기지 말고\n바로 말하래.",
    tr: { id: "gym6_geonu", cls: "보건반 짝꿍", name: "건우", spr: "kid_m", base: 20, team: [["seureumi", 31], ["sojjeokmi", 31]],
      intro: "건우: 보건부장의\n실력을 보여 주지!", lose: "건우: 반창고 좀……" } },
  { id: "g6k3", n: 3, x: 13, y: 7, dir: "left", spr: "kid_f",
    hint: "나윤: 마지막은 타입 상성!\f에스퍼한테 센 건 뭘까?\n벌레? 격투? 독?",
    after: "나윤: 여심 선생님이 '괜찮아용~'\n하시면 진짜 괜찮아져.",
    tr: { id: "gym6_nayun", cls: "보건반 짝꿍", name: "나윤", spr: "kid_f", base: 20, team: [["yeonbangul", 32], ["sorikkoe", 33]],
      intro: "나윤: 연방울아,\n향기로 진정시켜 줘!", lose: "나윤: 내가 진정됐네……" } },
];
function g6Glow(x, y) { G6_GLOW = { x, y, t: 18 }; }
let G6_GLOW = null;
async function g6Teleport(x, y, msg) {
  const P = World.player;
  sfx("cast"); g6Glow(P.x, P.y); await frames(10);
  await fadeOut(6, "#f4ecff");
  P.x = x; P.y = y; P.dir = "down"; World.cam = World.camTarget();
  await fadeIn(6, "#f4ecff");
  g6Glow(x, y); await frames(8);
  if (msg) await say(msg);
}
async function g6Mat(stage, i) {           // stage 1~3, i = 0·1·2 (매트 1·2·3)
  const Q = QUIZ6[stage - 1], k = GYM6_KIDS[stage - 1], F = "g6q" + stage;
  if (G.flag(F)) {
    if (i === Q.a) { await g6Teleport(...G6_START[stage + 1]); return; }
    await g6Teleport(...G6_START[stage], "삐빅!\n이 매트는 이 방 처음 자리로 가요."); return;
  }
  await say(`${i + 1}번 매트에 올라섰다!\f'${Q.opts[i]}'`);
  const r = await gymLesson(Q, k, { board: false, answer: i });
  if (r === "ok") {
    G.flag(F, true);
    await say("매트가 보랏빛으로 빛난다!");
    await g6Teleport(...G6_START[stage + 1]);
    return;
  }
  if (r === "lost") { await g6Teleport(...G6_START[stage]); return; }
  await say(`${k.tr.name}: 이제 ${Q.a + 1}번 매트로 가 봐!`);
  await g6Teleport(...G6_START[stage], "매트가 깜빡이더니\n이 방 처음 자리로 돌아왔다.");
}
async function g6Board(stage) {
  const Q = QUIZ6[stage - 1];
  await say(Q.board);
  await say(Q.q.replace(/\n/g, " ") + "\f" + Q.opts.map((o, i) => `${i + 1}. ${o}`).join("\n"));
  await say(G.flag("g6q" + stage) ? "판 구석에 '참 잘했어요!'\n도장이 찍혀 있다." : "답의 번호가 적힌 매트에\n올라서요!");
}
async function gym6GuideTalk() {
  if (hasBadge(6)) {
    if (!G.flag("guide6_gift")) { await say("도우미: 장단 어사패, 축하해요!\f여심 선생님이 그러셨어요.\n'오늘 도전자는 씩씩했다'고요.\f……이건 제 선물이에요."); await getItem("lemonade", 2); G.flag("guide6_gift", true); return; }
    await say("도우미: 보건실 침대는\n아플 때만 눕는 거예요~"); return;
  }
  await say("도우미: 어서 와요, 도전자님!\n여기는 쑥빛 배움터, 보건실이에요.\f칸막이 커튼으로 막힌 방이\n넷 있어요.\f문제판을 읽고 답의 번호가 적힌\n매트에 올라서면 다음 방으로 슝!\f틀리면 그 방 처음 자리로 와요.\n초록 집 매트는 들어온 자리로 가요.");
}
async function gym6KidTalk(k) {
  const K = act(k.id);
  if (!G.flag("g6q" + k.n)) { await say(k.hint); return; }
  if (!G.flag("tr_" + k.tr.id)) {
    if (await yes(`${k.tr.name}: 연습 배틀 한 판 할래?`)) await trainerBattle({ x: K.x, y: K.y, dir: K.dir, trainer: k.tr }, false);
    else await say(`${k.tr.name}: 좋아, 여심 선생님께 힘내!`);
    return;
  }
  await say(k.after);
}
// ---- 지킴이 여심 ----
// bal_gym(셋, 상처약 2, 짝 = 12번도로·구룡계곡에서 잡히는 여덟 마리 중 둘 — 박쥬미·돌콩이·다슬미·치레뇽·단풍불·소리꾀·흑돈이·혼불새)
//   처음 안(꿈노루 34·연방울 35·선록 37, 명상)은 Lv35 13–37% → 33·34·35, 선록 명상 뺌: Lv35 23–60%(진화 전) · Lv36 57–100% · Lv37 80–100%
const YEOSIM6 = { id: "leader_yeosim", cls: "지킴이", name: "여심", spr: "gl_yeosim", type: "에스퍼", indoor: true, bg: "indoor", base: 120, music: "eyes", bgm: "battle_gym",
  intro: "여심: 어서 와요~\n매트, 어지럽진 않았어요?\f배틀 전에 하나만요.\n어디 아픈 데는 없죠?\f……좋아요.\n그럼 우리 시작해 볼까요?",
  lose: "여심: 어머, 졌네요~\f그래도 남켓몬들 표정을 보니\n다들 괜찮아 보여요.\f……괜찮아용~",
  team: [["kkumnoru", 33, { mv: ["confusion", "calmmind", "charm", "tackle"] }],
         ["yeonbangul", 34, { mv: ["psybeam", "megadrain", "stunspore", "synthesis"] }],
         ["seonrok", 35, { mv: ["psybeam", "dazzlinggleam", "charm", "healbell"], item: "jujube" }]] };
const YS_HINT = [
  "여심: 또 왔네요~ 반가워요.\f에스퍼는 벌레·고스트·악에 약해요.\n구룡계곡 밤에 말굽쥬가 나와요.",
  "여심: 꿈노루는 명상으로\n점점 세져요.\f오래 끌지 말고\n먼저 쓰러뜨려 봐요.",
  "여심: 선록은 에스퍼·페어리라서\n격투는 거의 안 들어요.\f고스트나 강철 기술이\n잘 들어요. ……힌트 너무 줬나? ^^;;",
];
async function yeosimTalk(a) {
  if (hasBadge(6)) { await say(`여심: ${G.name}, 요즘 잘 자요?\f잠이 제일 좋은 약이에요.\n남켓몬도, 사람도요~`); return; }
  const lost = G.flags.ys_lost || 0;
  if (!lost) await say(`여심: 어서 와요, ${G.name}.\f국악당에서는 정말 고마웠어요.\n이제 지킴이로서 상대할게요~`);
  else await say(YS_HINT[Math.min(lost, YS_HINT.length) - 1]);
  const r = await trainerBattle({ x: a.x, y: a.y, dir: a.dir, trainer: YEOSIM6 }, false);
  if (r !== "win") { G.flags.ys_lost = lost + 1; return; }
  bgm("gym6");
  await say("여심: 이건 쑥빛 배움터의\n'장단 어사패'예요.");
  await getBadge(6, "여심");
  G.flag("badge6", true);
  await say("여심: 운봉은 동편제 명창\n송흥록이 태어난 곳이에요.\f판소리에서 가장 느린 장단,\n진양조를 처음 만든 사람이래요.");
  await say("여심: 빠른 장단도, 느린 장단도\n다 쓸모가 있어요.\f우리 몸도 그래요.\n쉴 때는 푹 쉬어야 해요~");
  await say("여심: 그리고 이거요.");
  await getItem("tm04");
  await say("여심: 기술머신04 '명상'.\f마음이 흔들릴 땐\n숨을 한 번 크게 쉬어요.\f그게 명상이에요.");
  await say("여심: 쑥빛마을의 부탁은 하나예요.\f아프면 아프다고 말해 줘요.\n그것도 용기니까요.");
  await emote(a, "heart", 30);
}

// =====================================================================
// 지도에 붙이기
// =====================================================================
(function attachChapter7() {
  const D = MAPDATA;
  if (typeof LOCKS !== "undefined") Object.assign(LOCKS, {
    house2_ssukbit: "문이 잠겨 있다.\f'국악 학원 — 오늘은\n국악당에서 수업합니다'\f라고 적혀 있다.",
  });
  // ---- 주홍마을 동쪽 → 12번도로 (산성 어사패 뒤 정비가 끝남) ----
  const JH = MAPS.juhong;
  { const wk = JH.npcs.find(n => n.id === "jh_worker"); if (wk) wk.show = () => !hasBadge(5); }
  JH.npcs.push({ id: "jh_cleaner", x: 40, y: 22, spr: "man", dir: "left", move: "look", show: () => hasBadge(5),
    talk: "아저씨: 신하 선생님네 천문반 아이들이랑\n구룡계곡 청소를 마쳤단다.\f이제 지리산 둘레길도 열렸지.\n동쪽으로 가면 12번도로야!" });
  JH.warps = (JH.warps || []).concat([20, 21].map(y => [43, y, ["route12", 0, y + 12, "right", "edge"]]));
  JH.signs.push([39, 19, "→ 12번도로 · 지리산 둘레길\n구룡계곡 · 쑥빛시티(운봉)"]);

  // ---- 12번도로 ----
  const R12 = D.route12;
  MAPS.route12 = {
    rows: R12.rows, stamps: R12.stamps, name: "12번도로",
    warps: [32, 33].map(y => [0, y, ["juhong", 43, y - 12, "left", "edge"]])
      .concat([16, 17, 18, 19].map(x => [x, 0, ["guryong", x + 2, 43, "up", "edge"]]))
      .concat([8, 9].map(y => [63, y, ["ssukbit", 0, y + 12, "right", "edge"]])),
    zones: [["12번도로", 0, 0, 63, 43]],
    zinfo: { "12번도로": { bgm: "route", enc: "12번도로", rate: 0.12, bg: "grass" } },
    signs: [[3, 31, "12번도로 · 지리산 둘레길\n← 주홍마을 · → 쑥빛시티(운봉)"], [20, 18, "↑ 구룡계곡\n맑은 물이 흐르는 계곡"], [60, 7, "→ 쑥빛시티\n운봉 고원 · 동편제의 고장"],
      [25, 15, "둘레길 쉼터\n쉬었다 가세요. 쓰레기는 되가져가요!"]],
    checks: [], areas: [],
    npcs: [
      { id: "r12_hiker", x: 24, y: 17, spr: "man", dir: "down", move: "look", talk: "등산객: 지리산 둘레길은\n지리산을 한 바퀴 빙 도는 길이야.\f주천에서 운봉까지가\n그 첫 구간이란다." },
      { id: "r12_granny", x: 33, y: 13, spr: "oldwoman", dir: "left", move: "look", talk: "할머니: 운봉은 높은 곳이라\n여름에도 서늘하단다.\f그래서 배추가 잘 자라지." },
      { item: "ok", n: 2, x: 5, y: 5 }, { item: "hyperpotion", x: 60, y: 40 }, { item: "revive", x: 22, y: 39 }, { item: "ether", x: 55, y: 4 },
      { x: 26, y: 19, spr: "kid_m", dir: "down", trainer: { id: "r12_jinho", cls: "등산 소년", name: "진호", spr: "kid_m", range: 3, base: 18, team: [["heukdoni", 33], ["taoryong", 33]],
        intro: "둘레길 완주가 목표야!\n그 전에 한 판!", lose: "다리에 힘이 풀렸다……", after: "천천히 걸어야\n멀리 가는 법이지." } },
      { x: 40, y: 13, spr: "kid_f", dir: "left", trainer: { id: "r12_haeun", cls: "꼬마 숙녀", name: "하은", spr: "kid_f", range: 4, base: 16, team: [["sorikkoe", 34]],
        intro: "소리꾀 노래 들어 볼래?\n배틀하면서!", lose: "노래가 멈췄다……", after: "꾀꼬리는 여름에\n우리나라에 와서 노래해." } },
      { x: 52, y: 11, spr: "bugboy", dir: "down", trainer: { id: "r12_minjae", cls: "벌레잡이", name: "민재", spr: "bugboy", range: 3, base: 16, team: [["jangsuppul", 34]],
        intro: "장수풍뎅이 뿔 봤어?\n엄청 세!", lose: "뿔이…… 휘었다……", after: "장수풍뎅이는 밤에\n참나무 진을 먹어." } },
      { x: 30, y: 33, spr: "kid_m", dir: "left", trainer: { id: "r12_taeyang", cls: "꼬마", name: "태양", spr: "kid_m", range: 4, base: 16, team: [["godeumi", 33], ["bakjumi", 33]],
        intro: "턱에서 뛰어내렸지?\n나도 그랬어!", lose: "착지 실패……", after: "올라갈 땐 큰길로\n돌아가야 해." } },
      { x: 56, y: 30, spr: "kid_f", dir: "left", trainer: { id: "r12_sora", cls: "꼬마 숙녀", name: "소라", spr: "kid_f", range: 4, base: 20, team: [["ureureung", 35]],
        intro: "천둥소리 들었어?\n우르릉이 왔나 봐!", lose: "번개가 빗나갔네……", after: "산 날씨는\n금방 바뀌어." } },
    ],
  };

  // ---- 구룡계곡 ----
  const GRY = D.guryong;
  MAPS.guryong = {
    rows: GRY.rows, stamps: GRY.stamps, name: "구룡계곡",
    warps: [18, 19, 20, 21].map(x => [x, 43, ["route12", x - 2, 0, "down", "edge"]]),
    zones: [["구룡계곡", 0, 0, 39, 43]],
    zinfo: { "구룡계곡": { bgm: "juhong", enc: "구룡계곡", rate: 0.13, bg: "grass" } },
    signs: [[22, 41, "구룡계곡\n가져온 쓰레기는 되가져가요!\f— 주홍 배움터 천문반"], [16, 12, "구룡계곡 소\f만복대에서 흘러온 맑은 물이\n모여 깊은 소를 이룬 곳"]],
    checks: [],   // v2.45 폭포 지움
    areas: [{ x0: 14, y0: 12, x1: 21, y1: 13, cond: () => !G.flag("garam3_met"), run: garam3Event }],
    npcs: [
      { id: "garam3", x: 15, y: 11, spr: "garam", dir: "up", move: "fixed", show: () => !G.flag("garam3_done"), talk: () => G.flag("garam3_met") ? say("가람: ……물소리, 좋다.") : garam3Event() },
      { id: "gr_fisher", x: 29, y: 10, spr: "oldman", dir: "left", move: "look", talk: "낚시꾼: 물이 맑아지니\n다슬미가 돌아왔구먼.\f밤에는 치레뇽도\n가끔 얼굴을 비춘단다." },
      { item: "superpotion", x: 34, y: 13 }, { item: "maxrepel", x: 6, y: 38 }, { item: "elixir", x: 33, y: 40 },
      { x: 31, y: 26, spr: "kid_f", dir: "left", trainer: { id: "gr_yuna", cls: "꼬마 숙녀", name: "유나", spr: "kid_f", range: 3, base: 16, team: [["daseulmi", 33], ["chireyong", 33]],
        intro: "계곡 청소 같이 했어?\n나도 했는데!", lose: "물에 빠질 뻔했다……", after: "치레뇽은 맑은 물에만 살아.\n그러니까 계속 깨끗하게!" } },
      { x: 8, y: 25, spr: "kid_m", dir: "right", trainer: { id: "gr_seokjin", cls: "등산 소년", name: "석진", spr: "kid_m", range: 4, base: 18, team: [["dolkongi", 33], ["malgupju", 34]],
        intro: "계곡 바위 타기는\n내 특기지!", lose: "미끄러졌다……", after: "바위는 젖으면 미끄러워.\n조심해!" } },
    ],
  };

  // ---- 쑥빛시티 ----
  const SB = D.ssukbit;
  MAPS.ssukbit = {
    rows: SB.rows, stamps: SB.stamps, name: "쑥빛시티",
    warps: [20, 21].map(y => [0, y, ["route12", 63, y - 12, "left", "edge"]]),
    zones: [["쑥빛시티", 0, 0, 51, 43]],
    zinfo: { "쑥빛시티": { bgm: "ssukbit", bg: "city" } },
    signs: [[2, 19, "쑥빛시티\n운봉 고원 · 동편제의 고장"], [18, 9, "운봉 국악당\n명창 송흥록이 태어난 고장의 소리터"],
      [42, 7, "황산대첩비\f1380년 이성계가 쳐들어온 왜구를\n크게 물리친 황산대첩을 기리는 비석.\f1577년에 세웠으나 1945년에 깨져\n지금 비석은 1957년에 다시 세웠다."],
      [30, 22, "운봉 고랭지 배추밭\n높고 서늘한 고원의 배추"], [31, 2, "↑ 14번도로(인월·아영)\n— 공사 중"], [9, 9, "쑥빛 배움터\n지킴이 여심 · 에스퍼 타입의 보건실"]],
    checks: [[39, 6, "비석에 글자가 빼곡하다.\f옛날 이성계가 이곳 황산에서\n왜구를 물리친 이야기가 새겨져 있다."], [40, 6, "비석에 글자가 빼곡하다."]],
    areas: [{ x0: 17, y0: 10, x1: 31, y1: 12, cond: () => !G.flag("ssuk_event_done"), run: ssukEvent }],
    npcs: [
      { id: "sb_g1", x: 22, y: 10, spr: "bondi", dir: "right", move: "fixed", show: () => !G.flag("ssuk_event_done") },
      { id: "sb_g2", x: 26, y: 10, spr: "bondi", dir: "left", move: "fixed", show: () => !G.flag("ssuk_event_done") },
      { id: "sb_g3", x: 25, y: 9, spr: "bondi", dir: "up", move: "fixed", show: () => !G.flag("ssuk_event_done") },
      { id: "sb_jar", x: 23, y: 9, spr: "", special: function (px, py) { const T = JSN.tiles_out && JSN.tiles_out.t; if (!T) return; const ti = T.jar; if (ti === undefined) return;
          tileAt(World.M.ts, ti, px, py); },
        move: "fixed", show: () => !G.flag("ssuk_event_done"), talk: () => say("붉은 봉인이 붙은 항아리.") },
      { id: "sb_sori", x: 24, y: 8, spr: "sori", dir: "down", hidden: true, move: "fixed", show: () => !G.flag("ssuk_event_done") },
      { id: "sb_yeosim", x: 20, y: 12, spr: "gl_yeosim", dir: "right", hidden: true, move: "fixed", show: () => !G.flag("ssuk_event_done") },
      { id: "sb_boreum", x: 19, y: 9, spr: "boreum", dir: "up", hidden: true, move: "fixed", show: () => !G.flag("ssuk_event_done") },
      { id: "sb_boreum2", x: 19, y: 9, spr: "boreum", dir: "up", move: "look", show: () => G.flag("ssuk_event_done") && !hasBadge(6),
        talk: "보름: 할아버지가 국악당 안에\n계셔.\f나는 여기서 기다릴 거야.\n언젠가 한 소리 해 주시겠지!" },
      { id: "gym6_door_kid", x: 5, y: 9, spr: "kid_m", dir: "down", move: "fixed", show: () => !G.flag("ssuk_event_done"),
        talk: () => say("여심 선생님은 국악당 쪽에\n가셨어.\f무슨 소란이 났대!") },
      { id: "sb_worker_n", x: 32, y: 1, spr: "man", dir: "down", move: "fixed", talk: "미안! 14번도로(인월·아영)는\n아직 공사 중이란다.\f여심 선생님 장단 어사패를 받을\n즈음엔 공사가 끝날 거야." },
      { id: "sb_worker_n2", x: 33, y: 1, spr: "man", dir: "down", move: "fixed", talk: "미안! 이쪽 길은\n아직 공사 중이란다." },
      { id: "sb_worker_e", x: 49, y: 20, spr: "man", dir: "left", move: "fixed", talk: "미안! 바래봉과 여원치로 가는 길은\n아직 공사 중이란다.\f봄이면 바래봉이 철쭉으로\n분홍빛이 되지!" },
      { id: "sb_worker_e2", x: 49, y: 21, spr: "man", dir: "left", move: "fixed", talk: "미안! 이쪽 길은\n아직 공사 중이란다." },
      { id: "sb_farmer", x: 33, y: 30, spr: "woman", dir: "down", move: "look", talk: "아주머니: 운봉은 높은 고원이라\n여름에도 서늘해.\f그래서 배추가 단단하고\n달게 자란단다." },
      { id: "sb_elder", x: 43, y: 12, spr: "oldman", dir: "left", move: "look", talk: "할아버지: 저 비석은 한 번 깨졌다가\n다시 세운 거란다.\f깨진 조각들도 버리지 않고\n따로 모셔 두었지." },
      { id: "sb_student", x: 20, y: 22, spr: "student", move: "wander", r: 1, talk: "국악당에서는 판소리를\n배울 수 있어.\f'얼씨구!' 하고 추임새 넣는 것도\n수업이야!" },
      { id: "sb_kid", x: 8, y: 36, spr: "kid_f", move: "wander", r: 1, talk: "운봉 하늘은 엄청 가까워 보여!\n구름이 손에 잡힐 것 같아." },
      { id: "sb_man", x: 22, y: 31, spr: "man", move: "look", talk: "아저씨: 진양조는 판소리에서\n가장 느린 장단이래.\f느려도 그 안에\n다 담겨 있다더라." },
      { item: "superrepel", x: 47, y: 41 }, { item: "fullheal", x: 3, y: 41 },
    ],
  };
  // 국악당(안)
  MAPS.gugak = { rows: D.gugak.rows, stamps: D.gugak.stamps, indoor: true, name: "국악당", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "ssukbit", noPopup: true, exit: exitSB("gugak"),
    checks: [[1, 2, "커다란 북이다.\f둥! 하고 울리면\n가슴까지 떨린다."], [2, 2, "커다란 북이다."], [1, 3, "커다란 북이다."], [2, 3, "커다란 북이다."],
      [10, 3, "장구다. 덩 기덕 쿵 더러러러."], [11, 3, "장구다. 덩 기덕 쿵 더러러러."], [6, 1, "병풍에 지리산 그림이 그려져 있다."], [7, 1, "병풍에 지리산 그림이 그려져 있다."]],
    npcs: [
      { id: "gk_teacher", x: 6, y: 5, spr: "woman", dir: "down", move: "look", talk: "선생님: 운봉은 동편제 명창\n송흥록이 태어난 곳이란다.\f판소리의 '가왕'이라 불렸지.\f촉석루에서 귀곡성 대목을\n부르니 촛불이 꺼졌다고 전해진단다." },
      { id: "gk_kid1", x: 4, y: 7, spr: "kid_m", dir: "up", move: "look", talk: "얼씨구!\n……추임새 연습 중이야." },
      { id: "gk_kid2", x: 9, y: 7, spr: "kid_f", dir: "up", move: "look", talk: "판소리는 소리꾼 한 명이랑\n고수 한 명이면 시작할 수 있대!" },
      { id: "gk_sori", x: 11, y: 6, spr: "sori", dir: "left", move: "look", show: () => G.flag("ssuk_event_done"),
        talk: async () => { await say("소리 어른: ……들어 주는 사람이\n있으면 더 오래 산다라.\f그 아이 할머니가\n어릴 적부터 하던 말이다."); await say("소리 어른: 다음에……\n한 소리 들려주마."); } },
    ] };
  // ---- 쑥빛 배움터(보건실) ----
  const G6M = { 1: MATS6[1], 2: MATS6[2], 3: MATS6[3] };
  MAPS.gym6 = {
    rows: D.gym6.rows, stamps: D.gym6.stamps, indoor: true, name: "쑥빛 배움터", floor: "floor_clinic", floor2: "floor_clinic2", wall: "wall_clinic", win: "win_clinic", rail: "rail_clinic",
    bgm: "gym6", noPopup: true, exit: exitSB("gym6"),
    over(cx, cy) {
      const ts = World.M.ts, T = ts.js.t;
      for (let s = 1; s <= 3; s++) if (G.flag("g6q" + s)) {             // 맞힌 칸의 정답 매트에 별 스티커
        const x = G6_X[QUIZ6[s - 1].a] * 16 - cx, y = G6M[s] * 16 - cy;
        rect(x + 11, y + 1, 4, 4, "#f8d040"); rect(x + 12, y, 2, 6, "#f8d040"); rect(x + 10, y + 2, 6, 2, "#f8d040");
      }
      if (G6_GLOW && G6_GLOW.t > 0) { const k = T.warp_glow; if (k >= 0) { g.globalAlpha = Math.min(1, G6_GLOW.t / 10);
        tileAt(ts, k, G6_GLOW.x * TS - cx, G6_GLOW.y * TS - cy); g.globalAlpha = 1; } G6_GLOW.t--; }
    },
    checks: [
      ...[1, 2, 3].flatMap(s => [[0, G6M[s] + 1], [1, G6M[s] + 1], [0, G6M[s] + 2], [1, G6M[s] + 2]].map(([x, y]) => [x, y, () => g6Board(s)])),
      [5, 0, "시력표.\f맨 아랫줄까지 보이면\n눈이 아주 좋은 거래요."], [6, 0, "시력표."], [5, 1, "시력표."], [6, 1, "시력표."],
      [8, 0, "약장.\f반창고·붕대·소독약이\n가지런히 놓여 있다."], [9, 0, "약장."], [8, 1, "약장."], [9, 1, "약장."],
      [0, 2, "보건실 침대.\f하얀 이불이 반듯하게 개어 있다."], [0, 3, "보건실 침대."], [2, 2, "보건실 침대."], [2, 3, "보건실 침대."],
      [14, 17, "키재기.\f'쑥쑥 자라라!'라고 적혀 있다."], [14, 18, "키재기."],
    ],
    triggers: [
      ...[1, 2, 3].flatMap(s => G6_X.map((x, i) => ({ x, y: G6M[s], run: () => g6Mat(s, i) }))),
      ...[[13, 14], [13, 9], [13, 4]].map(([x, y]) => ({ x, y, run: () => g6Teleport(7, 18, "초록 매트를 밟자\n들어온 자리로 돌아왔다.") })),
    ],
    npcs: [
      { id: "yeosim", x: 7, y: 2, spr: "gl_yeosim", dir: "down", move: "fixed", talk: yeosimTalk },
      { id: "guide6", x: 9, y: 19, spr: "student", dir: "left", move: "look", talk: gym6GuideTalk },
      ...GYM6_KIDS.map(k => ({ id: k.id, x: k.x, y: k.y, spr: k.spr, dir: k.dir, move: "fixed", talk: () => gym6KidTalk(k) })),
    ],
  };
  MAPS.center_ssukbit = { ...MAPS.center, exit: exitSB("center_ssukbit"),
    npcs: [MAPS.center.npcs.find(n => n.id === "nurse"),
      { id: "sbc_man", x: 2, y: 6, spr: "man", move: "look", talk: "쑥빛 배움터는 에스퍼 타입이래.\f벌레·고스트·악 남켓몬을\n데려가 봐!" },
      { id: "sbc_gm", x: 11, y: 5, spr: "oldwoman", move: "look", talk: "할머니: 여심 선생님한테 가면\n아픈 데가 금방 낫는 것 같아.\f말만 들어도 마음이\n편해지거든." }] };
  MAPS.mart_ssukbit = { ...MAPS.mart, name: "쑥빛 만물상", exit: exitSB("mart_ssukbit"),
    npcs: [MAPS.mart.npcs.find(n => n.id === "clerk"), MAPS.mart.npcs.find(n => n.id === "clerk2"),
      { id: "sbm_kid", x: 7, y: 6, spr: "kid_m", move: "look", talk: "둘레길 걸을 땐\n물이랑 쑥향 챙겨!" }] };
  MAPS.house_k = { rows: D.house_a.rows, stamps: D.house_a.stamps, indoor: true, name: "한옥", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "ssukbit", noPopup: true, exit: exitSB("house_k"),
    checks: [[0, 1, "자개장이 반짝반짝 빛난다."], [1, 1, "자개장이 반짝반짝 빛난다."], [6, 2, "병풍에 바래봉 철쭉이 그려져 있다."], [7, 2, "병풍에 바래봉 철쭉이 그려져 있다."]],
    npcs: [{ id: "house_k_gm", x: 2, y: 4, spr: "oldwoman", move: "look", talk: async () => {
      if (!G.flag("house_k_gift")) { await say("할머니: 우리 영감이 젊을 땐\n판소리 북을 쳤단다.\f소리꾼 옆에서 '얼씨구!' 하고\n장단을 맞춰 주는 사람이지."); await getItem("moomoomilk", 2); G.flag("house_k_gift", true); return; }
      await say("할머니: 북 치는 사람을 '고수'라고 해.\n소리꾼이랑 둘이서 한 판을 만들지."); } }] };
  MAPS.house_l = { rows: D.house_b.rows, stamps: D.house_b.stamps, indoor: true, name: "한옥", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "ssukbit", noPopup: true, exit: exitSB("house_l"),
    npcs: [{ id: "house_l_man", x: 6, y: 4, spr: "man", dir: "down", move: "look", talk: "아저씨: 우리 애가 넘어져서\n무릎이 까졌을 때\f여심 선생님이 '음~ 아프겠네'\n하면서 같이 속상해 주셨대." }] };

  Object.assign(TOWN_ZONE, { "12번도로": "r12", "구룡계곡": "guryong", "쑥빛시티": "ssuk", "쑥빛 배움터": "ssuk", "국악당": "ssuk", "쑥빛 만물상": "ssuk" });
})();
