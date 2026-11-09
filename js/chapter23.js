// ===== v2.32 절정: 만복사의 밤 — 암행어사 출두 =====
// 방향성 v1(확정): 교장 선생님의 봉서 → 만복사에서 봉서를 엶 → 마패를 들어 '암행어사 출두' → 본디회·금박재단 사건 마무리 → (v2.33~) 오방고원 리그 → 챔피언 = 본편 엔딩
// 설정집 '절정 만복사: 단원, 소리 어른·한지 어른, 행수 옹이 ③, 가람 ⑤, 변도진' + 끝맺음
//   변도진: 절정 만복사에서 정체 공개 → 암행어사 출두 → 섬진강 매립·땅 매입 서류·봉인 항아리가 사람들 앞에서 드러나 물러남 / 마지막엔 빼앗은 운해룡을 꺼냄(연출 전투)
//   방삼·단지: 절정에서 몰래 봉인 항아리 열쇠를 흘림 / 옹이: '그릇은 쓰라고' — 항아리를 엶 / 칠로 소리·한지 어른: 출두에서 주인공 편 / 여울: 매립 증거
//   가람: 패배 뒤 변도진에게 이용당했음을 알고 전설과 함께 '사람들 사이에서 목소리를 들어 보러' 떠남
//   오작(견우·직녀가 본디 하나 — 반야봉 대방의 말): 가람의 홍우성('지켜 온 것') + 주인공 별돌의 은직성('새로 짜는 것')이 다시 만나 운해룡('빈 마음')을 달램 → 은직성이 주인공 곁으로
//   명장면 '암행어사 출두'(사운드연출 문서 12번) · '절정에 떠오르는 만복사'(빛으로 잠깐 떠오르는 옛 절)
// 아무도 다치지 않음(어린이 눈높이): 변도진은 증거 앞에 물러나고, 남은 일은 어른들이 마을 사람들과 바로잡음
// 사실: 춘향전 — 거지 차림으로 숨어 있던 이몽룡이 변 사또 생일잔치에 암행어사로 출두(구전 판소리·고전소설 줄거리) / 마패를 들어 어사임을 밝힘
// 관장 말버릇은 사용자가 준 것만(조박사 "음 그건 안 돼." · 여심 "음~ 아프겠네" "괜찮아용~" · 신하 "복도에서 누가 뛰어다니냐-!" · 기수 "음~ 아닌 거 같은데~?" · 찬향 "왜 그렇게 생각했을까?")
//   말버릇 D12 가안(v2.36 클로드): 미영 "……나쁘지 않아." · 수현 "밥은 먹고 다녀요?" · 희주 "천천히 해도 괜찮아요." · 교장 "운동화 끈 단단히 묶어라". 신하 대사는 확정(D14, v2.36)
// chapter22.js 뒤에 읽힘
"use strict";
window.CHULDU_READY = true;

ITEMS.jarkey = { n: "항아리 열쇠", p: "key", ic: "jarkey",
  d: "방삼과 단지가 몰래 쥐여 준 놋쇠 열쇠예요. 본디회 봉인 항아리의 붉은 봉인을 풀 수 있대요." };
ITEMS.landdoc = { n: "땅 매입 서류", p: "key", ic: "landdoc",
  d: "한지 어른이 찾아낸 서류예요. 금박재단이 칠로에게 준 '후원금'과 닥나무 밭·마을 땅을 몰래 사들인 기록이 적혀 있어요." };

const cxEv = () => G.flag("bongseo_got") && !G.flag("chuldu_done");
let CX_FX = null;            // { k: 'moon'|'chuldu'|'unhae'|'ojak'|'temple', t }

// ---- 배틀 ----
const CX_G1 = { id: "cx_g1", cls: "본디회 단원", name: "단원", spr: "grunt_m", base: 30, music: "bondi", bgm: "trainer",
  intro: "단원: 멈춰라!\f오늘 밤은 '오작 봉인식'이다.\n아무도 들어갈 수 없다!", lose: "단원: 으윽……\n대방님께 혼나겠다……",
  after: "단원: 대방님이 오작의 힘으로\n남켓몬을 모두 항아리에 모신대.\f……그게 정말 '본디'일까?",
  team: [["eopseureong", 49], ["malgupju", 49]] };
const CX_G2 = { id: "cx_g2", cls: "본디회 단원", name: "단원", spr: "grunt_f", base: 30, music: "bondi", bgm: "trainer",
  intro: "단원: 본디대로!\n남켓몬은 본디 자리로!\f……라고 외치라고 해서\n외치는 중이야!", lose: "단원: 외치는 것만으론\n안 되는구나……",
  after: "단원: 저기 검은 정장 입은 사람들,\n본디회랑은 좀 안 어울리지 않아?",
  team: [["ttanggul", 49], ["dochaedong", 50]] };
const ONGI3 = { id: "ongi3", cls: "본디회 행수", name: "옹이", spr: "ongi", base: 60, music: "bondi", bgm: "trainer",
  intro: "옹이: ……덤벼.\f내가 빚은 항아리가 맞는지,\n내 손으로 확인할래!",
  lose: "옹이: ……가마 불이\n꺼졌네.",
  team: [["mokgiryeong", 55, { mv: ["woodhammer", "poisonjab", "leechseed", "protect"] }],
         ["heosujang", 55, { mv: ["seedbomb", "airslash", "leechseed", "protect"] }],
         ["neokbulhak", 56, { mv: ["flamethrower", "shadowball", "willowisp", "protect"] }],
         ["chamsutjang", 57, { mv: ["flamethrower", "rockslide", "willowisp", "harden"], item: "jujube" }]] };
const SORI8 = { id: "sori_elder", cls: "칠로", name: "소리 어른", spr: "sori", base: 60, music: "eyes", bgm: "trainer",
  intro: "소리 어른: 들려다오.\n네 남켓몬들의 소리를.\f가두지 않고도 오래 남는\n소리가 있는지.",
  lose: "소리 어른: ……얼씨구.\n좋은 소리다.",
  team: [["sorikkoe", 49, { mv: ["deugeum", "airslash", "hypervoice", "roost"] }],
         ["wonanggeum", 49, { mv: ["sarangga", "airslash", "featherdance", "roost"] }],
         ["neokbulhak", 50, { mv: ["flamethrower", "airslash", "shadowball", "roost"] }]] };
const GARAM5 = { id: "garam5", cls: "본디회의 도령", name: "가람", spr: "garam", base: 60, music: "garam", bgm: "battle_legend", canLose: true,
  intro: "가람: ……다음에 만나면\n전설과 함께라고 했지.\f들려줘. 네 남켓몬들이\n정말 네 곁을 원하는지.",
  lose: "가람: ……들렸어.\f'같이 있고 싶다'고.\n홍우성한테서도.",
  loseText: "가람: ……괜찮아?\f남켓몬들을 쉬게 해 줄게.\n아직 끝난 게 아니니까.",
  team: [["gumiru", 57, { mv: ["xscissor", "aerialace", "protect", "swordsdance"] }],
         ["bangmangdochae", 57, { mv: ["shadowball", "darkpulse", "confuseray", "protect"] }],
         ["dancheongmong", 57, { mv: ["psychic", "silverwind", "protect", "calmmind"] }],
         ["eunhajak", 58, { mv: ["airslash", "moonblast", "roost", "protect"] }],
         ["honguseong", 60, { mv: ["earthquake", "firefang", "dig", "sunnyday"] }]] };
const BYEON8 = { id: "byeon_final", cls: "금박재단 이사장", name: "변도진", spr: "byeon", base: 120, music: "jaedan", bgm: "battle_gym",
  intro: "변도진: 옛것은 지켜야지요.\n단, 제 금고 안에서.\f아이 하나 이기는 건\n서류 한 장보다 쉽습니다.",
  lose: "변도진: ……서류에 없는 항목.\f이것이…… 그것이었나.",
  team: [["gujeongwang", 58, { mv: ["sludgebomb", "nightslash", "screech", "harden"] }],
         ["takrankkuk", 58, { mv: ["drillpeck", "nightslash", "aerialace", "swordsdance"] }],
         ["maetdolmet", 59, { mv: ["earthquake", "rockslide", "icefang", "harden"] }],
         ["malgupju", 59, { mv: ["airslash", "brutalswing", "confuseray", "screech"] }],
         ["simsulbak", 61, { mv: ["baktagi", "nightslash", "seedbomb", "swordsdance"], item: "jujube" }]] };

// ---- 잡을 수 없는 연출 배틀(운해룡) ----
{ const _tc = Battle.prototype.throwCatch;
  Battle.prototype.throwCatch = async function (item) { if (this.o.noCatch) { await this.say(this.o.noCatch, { wait: true }); return null; } return _tc.call(this, item); }; }
async function cxWild(k, lv, o = {}) {
  const foe = makeMon(k, lv, { met: World.zone });
  if (o.mv) foe.moves = o.mv.filter(id => MV[id]).map(id => ({ id, pp: MV[id].pp, max: MV[id].pp }));
  bgm("battle_legend");
  await battleTransition("wild");
  const b = new Battle({ kind: "wild", foe: [foe], bg: "grass", weather: null, canLose: true, noCatch: o.noCatch });
  const r = await b.start();
  await afterBattle(r, b);
  return r;
}

// ---- 도우미 ----
async function cxWalk(a, x, y) { if (a) await walkPath(a, x, y); }
async function cxHeal(msg) { G.healAll(); await Audio2.jingle("jg_heal"); await say(msg || "남켓몬들이 기운을 되찾았다!"); }
function cxShow(ids, on = true) { for (const id of ids) { const a = act(id); if (a) a.hidden = !on; } }
const CX_CROWD = ["cx_jb", "cx_hwang", "cx_chan", "cx_mi", "cx_su", "cx_sin", "cx_gi", "cx_ysim", "cx_heeju", "cx_hg", "cx_yeoul", "cx_solmoe", "cx_yun", "cx_br2", "cx_vil1", "cx_vil2"];
const CX_JARS = [[23, 9], [26, 9], [26, 11], [23, 12]];

// =====================================================================
// 0. 들머리: 봉서를 엶
// =====================================================================
async function cxOpen() {
  const P = World.player;
  if (G.flag("cx0")) return;
  bgm("bondi");
  await say("만복사지에 들어서자\n어둠 속에서 북소리가 들린다.\f흰 도포를 입은 사람들이\n횃불을 들고 서 있다……");
  await say("교장 선생님 말씀대로\n봉서를 열어 보았다.");
  sfx("select");
  await say(`'${G.name}에게.\f보름달이 오층석탑 끝에 걸리면\n마패를 높이 들어라.\f그다음은 우리가 하마.\n— 덕과 아카데미 교장'`);
  await say("……마패를 꼭 쥐었다.");
  G.flag("cx0", true);
}

// =====================================================================
// 1. 방삼·단지: 몰래 흘리는 항아리 열쇠
// =====================================================================
async function cxBangsam() {
  const P = World.player, B = act("cx_bangsam"), D = act("cx_danji");
  if (!B || G.flag("cx_key")) return;
  await say("???: 쉿! 쉿!\n여기, 여기!");
  B.x = P.x + 3; B.y = P.y; B.hidden = false; D.x = P.x + 4; D.y = P.y; D.hidden = false;
  P.dir = "right"; face(B, P); face(D, P);
  await cxWalk(B, P.x + 1, P.y); face(B, P);
  await say("방삼: 에헴, 이 몸이 본디회의 방삼……\n아니 아니, 지금은 그게 아니고!");
  await say("단지: 형님, 빨리요!\n들키면 큰일 나요!");
  await say("방삼: 꼬마, 잘 들어.\f오늘 밤 대방님이 항아리를\n잔뜩 쌓아 놓으셨는데……\f그 항아리들, 남켓몬을 '모시는' 게\n아니라 '파는' 거래!");
  await say("단지: 입장료 받는 전시관을\n만든대요.\f저는 항아리에 김치 담는 게\n더 좋은데……");
  await say("방삼: 그래서 말인데…… 이거.\n떨어뜨렸다! 진짜 떨어뜨린 거다!");
  await getItem("jarkey");
  await say("방삼: 봉인 항아리 열쇠다.\f우리는 아무것도 몰라!\n아무것도 안 줬어!");
  await say("단지: 형님, 우리 이번에\n처음으로 좋은 일 한 거 같아요!");
  await say("방삼: 쉿!!");
  sfx("run"); await fadeOut(8); B.hidden = true; D.hidden = true; await fadeIn(8);
  G.flag("cx_key", true);
}

// =====================================================================
// 2. 행수 옹이 ③ — 봉인 항아리 앞
// =====================================================================
async function cxOngi() {
  const P = World.player, O = act("cx_ongi");
  if (!O || G.flag("cx_ongi")) return;
  bgm("bondi");
  P.dir = "right"; face(O, P);
  await emote(O, "excl", 20);
  await say("옹이: ……왔구나.");
  await say("옹이: 이 항아리들, 다 내가 빚은 거야.\f목동이, 혼망울, 소리꾀……\n오늘 밤 다 '쓰인대'.");
  await say("옹이: 쓰인다……\n이게 쓰이는 걸까?");
  const r = await trainerBattle({ x: O.x, y: O.y, dir: O.dir, trainer: ONGI3 }, false);
  if (r !== "win") return;
  bgm("bondi");
  await say("옹이: 스승님이 그러셨어.\n'그릇은 쓰라고 만드는 거다.'");
  await say("옹이: 밥을 담고, 김치를 익히고,\n물을 길어야 그릇이라고.\f……남켓몬을 가두는 데 쓰면\n그건 그릇이 아니야.");
  if (G.has("jarkey")) {
    await say("항아리 열쇠를 꺼내\n붉은 봉인에 대 보았다……");
    await say("옹이: 그 열쇠……\n방삼 녀석이구나.\f좋아. 같이 열자.");
    for (const [x, y] of CX_JARS) { const j = act(`cx_jar_${x}_${y}`); if (j) { sfx("cast"); j.open = true; await frames(10); } }
    await say("철컥, 철컥, 철컥, 철컥!\f항아리 뚜껑이 열리고\n남켓몬들이 하나둘 뛰어나왔다!");
    await say("남켓몬들은 둘레를 한 바퀴 돌더니\n밤하늘로, 풀숲으로 흩어졌다.");
    G.flag("cx_jars", true);
  }
  await say("옹이: 나…… 스승님 공방을\n다시 열고 싶어.\f아이들이랑 옹기를 빚는\n공방으로.");
  await say("옹이: 대방님은 오층석탑 앞에 계셔.\f돌부처님 쪽에 칠로 어른들도\n와 계시고.");
  G.flag("cx_ongi", true);
}

// =====================================================================
// 3. 칠로 소리 어른·한지 어른 · 보름 — 돌부처님 앞
// =====================================================================
async function cxElders() {
  const P = World.player, S = act("cx_sori"), H = act("cx_hanji"), B = act("cx_boreum");
  if (!S || G.flag("cx_elders")) return;
  bgm("bondi");
  await cxWalk(P, 9, 10); P.dir = "up"; face(S, P);
  await say("소리 어른: ……송화마을 그 아이와\n함께 다니던 아이로구나.");
  if (B) { face(B, P); await emote(B, "excl", 20); await say(`보름: ${G.name}!\n할아버지 따라 여기까지 왔어.`); }
  await say("소리 어른: 대방이 칠로를 불렀다.\n'오늘 밤 모든 소리를 영원히 담는다'고.\f……헌데 마음이 영 편치 않구나.");
  await say("소리 어른: 보름이가 그러더구나.\f소리는 들어 주는 사람이 있으면\n더 오래 산다고.");
  await say("소리 어른: 그 말이 참인지,\n네 남켓몬들한테 묻고 싶다.");
  const r = await trainerBattle({ x: S.x, y: S.y, dir: S.dir, trainer: SORI8 }, false);
  if (r !== "win") return;
  bgm("bondi");
  await say("소리 어른: ……그래.\f가두지 않아도,\n함께 부르면 남는 소리가 있구나.");
  if (H) { face(H, P); await cxWalk(H, P.x - 1, P.y); face(H, P); }
  await say("한지 어른: 이 녀석아,\n나도 할 말이 있다.");
  await say("한지 어른: 재단 돈이 어디서 와서\n어디로 가는지, 쭉 알아봤다.\f우리 칠로가 받던 '후원금'……\n그 돈으로 내 닥나무 밭이며\f마을 땅을 서류로만\n몽땅 사들이고 있었더구나.");
  await getItem("landdoc");
  await say("한지 어른: 한지는 천 년을 간다지.\f이 서류도 오래오래 남아\n사람들이 똑똑히 보게 해야지.");
  if (B) {
    face(B, P);
    await say("보름: 다음은 오층석탑이지?\n잠깐만!");
    await say("보름: 할머니가 싸 주신\n쑥 주먹밥이야.\f남켓몬들도 한 입씩!");
    await cxHeal();
  }
  await say("소리 어른: 오층석탑 앞에\n대방과 도령이 있다.\f……조심하거라.");
  G.flag("cx_elders", true);
  await cxGaram();
}

// =====================================================================
// 4. 오층석탑 앞: 가람 ⑤ · 대방 = 변도진 · 보름달 · 암행어사 출두
// =====================================================================
async function cxGaram() {
  const P = World.player, GR = act("cx_garam"), D = act("cx_daebang");
  if (!GR || G.flag("cx_garam")) return cxReveal();
  bgm("garam");
  await cxWalk(P, 14, 10); P.dir = "up";
  await camPan(-40, 30);
  await say("오층석탑 앞에 붉은 인장 가면을 쓴\n대방이 서 있다.\f그 곁에…… 가람이 있다.");
  if (GR) face(GR, P);
  await say("가람: ……왔구나.");
  await say("가람: 대방님이 그러셨어.\f오늘 밤 오작의 힘으로\n남켓몬들을\f사람에게서 떼어 놓을 수\n있다고.");
  await say("가람: 그런데…… 들려.\f항아리 속에서 우는 소리가.\n홍우성도 아까부터 울어.");
  await camPan(0, 20);
  await cxWalk(GR, 14, 9); face(GR, P);
  const r = await trainerBattle({ x: GR.x, y: GR.y, dir: GR.dir, trainer: GARAM5 }, false);
  bgm("garam");
  if (r !== "win") await cxHeal();
  await say("가람: 네 남켓몬들은\n네 곁에 있고 싶대.\f……내가 듣던 소리랑\n다른 소리야.");
  G.flag("cx_garam", true);
  await cxReveal();
}
async function cxReveal() {
  const P = World.player, GR = act("cx_garam"), D = act("cx_daebang");
  if (G.flag("cx_chuldu")) return;
  bgm("jaedan");
  if (D) { await cxWalk(D, 15, 9); face(D, P); }
  await say("대방: 도령, 물러나라.\n감상은 거기까지다.");
  await say("대방: 꼬마야.\f드디어 서류에 없는 항목을\n정리할 때가 왔구나.");
  if (D) await emote(D, "dots", 30);
  sfx("select");
  await say("대방이 붉은 인장 가면을\n천천히 벗었다……");
  if (D) D.spr = "byeon";
  await say("뒤로 넘긴 회색 머리.\n금테 안경. 가는 콧수염.\f금박재단 이사장,\n변도진이었다!");
  if (GR) { face(GR, D); await emote(GR, "excl", 26); }
  await say("가람: ……대방님이,\n이사장이었어?");
  await say("변도진: 그래, 도령.\f남켓몬을 본디 자리로?\n본디 자리는 내 금고 안이다.");
  await say("변도진: 오늘 밤 이 절터는\n'만복 테마파크'가 된다.\f오작의 힘과 항아리에 모신 남켓몬,\n모두 입장료를 받는 전시품이지.");
  await say("변도진: 섬진강을 메운 땅엔 호텔을,\n닥나무 밭엔 주차장을.\f'모두에게 복을'——\n물론 그 복은 내 것이고.");
  if (GR) await say("가람: ……나를,\n속였구나.");
  await say("변도진: 요원들!\n저 아이를 데려가라.");
  cxShow(["cx_ag1", "cx_ag2"]);
  const A1 = act("cx_ag1"), A2 = act("cx_ag2");
  if (A1) await cxWalk(A1, P.x - 1, P.y); if (A2) await cxWalk(A2, P.x + 1, P.y);
  if (A1) face(A1, P); if (A2) face(A2, P);
  // 보름달
  await camPan(-72, 40);
  cxFx("moon");
  await say("그때, 구름이 걷히고\n보름달이 떠올랐다.\f달이…… 오층석탑 끝에\n걸렸다.");
  await say("'보름달이 오층석탑 끝에 걸리면\n마패를 높이 들어라.'");
  await camPan(0, 24);
  // 출두
  const c = await ask("마패를 높이 들까?", ["높이 든다!"]);
  P.dir = "up";
  bgm("chuldu");
  sfx("gong");
  cxFx("chuldu");
  for (let i = 0; i < 2; i++) { await fadeOut(3, "#fff8d0"); await fadeIn(3, "#fff8d0"); }
  await say(`${J(G.name, "은")} 마패를\n하늘 높이 들었다!`);
  await say("암행어사 출두요!!");
  cxShow(CX_CROWD);
  for (const id of ["cx_g1", "cx_g2"]) { const g2 = act(id); if (g2) g2.hidden = true; }
  sfx("excl");
  await say("사방에서 목소리가 울렸다.\f'출두요!' '출두요!'\n'암행어사 출두요!'");
  await say("횃불 사이로 사람들이 쏟아져 나왔다.\f관장 선생님들, 한결, 여울,\n솔뫼, 마을 사람들까지……");
  cxFx("chuldu", 70);
  if (typeof cxRingLine === "function") await cxRingLine();   // v2.59 정표 옥가락지(춘향전의 어사처럼)
  if (typeof cxChilro === "function") await cxChilro();   // v2.60 칠로 넷 · 풍물패가 길을 엶
  const JB = act("cx_jb"), HW = act("cx_hwang");
  if (JB) { await cxWalk(JB, P.x - 1, P.y + 1); face(JB, P); }
  await say("조박사: 잘했어!\n선생님이 다 봤다.");
  await say("조박사: 그동안 꽁꽁 숨겨 둔 증거,\n이제 꺼낼 시간이야.");
  if (A1) A1.hidden = true; if (A2) A2.hidden = true;
  await say(`${J(G.name, "은")} 공사 장부를\n높이 펼쳐 보였다!`);
  await say("조박사: 섬진강 매립 공사 장부.\f허가 없이 강을 메운 날짜가\n하나하나 적혀 있지.");
  const Y = act("cx_yeoul"); if (Y) { await cxWalk(Y, P.x + 1, P.y + 1); face(Y, P); }
  await say("여울: 그리고 이건 내가 찍은 사진.\f흙탕물이 된 섬진강,\n메워진 두꺼비 바위 옆 여울목.\f강은 흘러야 해.\n사람이 막지만 않으면.");
  if (G.has("landdoc")) await say(`${J(G.name, "은")} 땅 매입 서류도\n꺼내 보였다.\f한지 어른: 칠로 '후원금'으로\n마을 땅을 사들인 기록이오!`);
  if (typeof cxVoteEvidence === "function") await cxVoteEvidence();   // v2.59 비색마을 투표 지시서
  if (G.flag("cx_jars")) await say("옹이: 봉인 항아리는 다 열렸어.\f남켓몬들은 이미\n제 자리로 돌아갔고.");
  if (HW) { await cxWalk(HW, P.x, P.y + 1); face(HW, D || P); }
  await say("교장 선생님: 변도진 이사장.\f이 아이는 혼자 온 게 아니오.\n여덟 마을이 함께 왔소.");
  await say("교장 선생님: 강을 메운 일,\n땅을 몰래 사들인 일,\f그리고 남켓몬을 가둔 일.\f이제 마을 사람들 앞에서\n바로잡아야 할 거요.");
  await say("변도진: ……모두에게 복을,\n이었는데.");
  await say("변도진: 아니, 아직이다.\f아이 하나만 넘으면\n서류는 다시 쓸 수 있어!");
  // 여심이 돌봐 줌
  const YS = act("cx_ysim"); if (YS) { await cxWalk(YS, P.x + 1, P.y); face(YS, P); }
  await say("여심: 음~ 아프겠네.\f잠깐만요, 남켓몬들부터\n볼게요.");
  await cxHeal("여심: ……괜찮아용~");
  G.flag("cx_chuldu", true);
  await cxByeon();
}
async function cxByeon() {
  const P = World.player, D = act("cx_daebang");
  if (G.flag("cx_byeon")) return cxUnhae();
  if (D) { D.spr = "byeon"; face(D, P); }
  bgm("jaedan");
  if (G.flag("cx_byeontry")) { await say("변도진: ……또 왔군.\f서류는 몇 번이고\n다시 쓰면 그만이야."); const YS = act("cx_ysim"); if (YS) await cxHeal("여심: 음~ 아프겠네.\n……괜찮아용~"); }
  G.flag("cx_byeontry", true);
  const r = await trainerBattle({ x: D ? D.x : P.x, y: D ? D.y : P.y - 1, dir: "down", trainer: BYEON8 }, false);
  if (r !== "win") return;
  G.flag("cx_byeon", true);
  bgm("jaedan");
  await say("변도진: ……서류에 없는 항목.\f아이의 목소리, 마을의 목소리,\n남켓몬의 목소리.");
  await say("변도진: 하지만 내게는\n아직 이것이 남았다!");
  await cxUnhae();
}

// =====================================================================
// 5. 운해룡 · 오작 · 떠오르는 만복사 · 은직성
// =====================================================================
async function cxUnhae() {
  const P = World.player, D = act("cx_daebang"), GR = act("cx_garam");
  if (G.flag("cx_unhae")) return cxEunjik();
  await say("변도진이 품에서 금빛 항아리를\n꺼내 바닥에 내리쳤다!");
  sfx("gong");
  cxFx("unhae");
  try { Audio2.cry("unhaeryong"); } catch (e) {}
  await camPan(-56, 30);
  await say("깨진 항아리에서 구름이 쏟아져\n절터를 뒤덮었다!\f구름 속에서 속이 빈 용이\n별빛을 흘리며 솟아올랐다!");
  await say("변도진: 반야봉에서 몰래 담아 온\n운해룡이다!\f오작이 갈라질 때 남은 빈 마음……\n이걸로 모두 쓸어버려라!");
  await camPan(0, 20);
  await say("운해룡이 울부짖으며\n덤벼들었다!");
  const r = await cxWild("unhaeryong", 52, { noCatch: "운해룡의 몸이 구름처럼 흩어져\n볼이 닿지 않는다!",
    mv: ["dragonpulse", "ominouswind", "mist", "dragonbreath"] });
  cxFx("unhae", 120);
  await say("운해룡은 쓰러지지 않는다.\f텅 빈 몸속에서 별빛만\n흔들리고 있다……");
  if (r !== "win") await cxHeal("조박사: 버텨! 혼자가 아니야!\f……남켓몬들이 다시 일어섰다!");
  if (typeof cxForgot === "function") await cxForgot();   // v2.60 운해룡의 빈 몸속에 비친 잊힌 자리
  if (typeof cxStars === "function") await cxStars();   // v2.59 정표 여섯이 운해룡의 빈 몸을 채움
  // 별돌
  await say("그때, 가방 속 별돌이\n뜨겁게 빛나기 시작했다!");
  cxFx("ojak");
  try { Audio2.cry("eunjikseong"); } catch (e) {}
  bgm("ojak");
  await say("별돌이 은하수처럼 풀려나며\n날개를 편 남켓몬이 나타났다.\f'새로 짜는 것' — 은직성!");
  if (GR) { face(GR, P); await emote(GR, "excl", 20); }
  await say("가람: 홍우성이……\n울고 있어. 반가워서.");
  try { Audio2.cry("honguseong"); } catch (e) {}
  await say("홍우성과 은직성이\n서로를 바라보았다.\f견우와 직녀가 일 년 만에\n만나는 것처럼.");
  const jpN = typeof jpCount === "function" ? jpCount() : 0;   // v2.59 정표의 빛으로 짠 다리
  if (jpN) await say("은직성이 정표의 빛을\n실처럼 뽑아 엮기 시작했다!");
  await say(jpN ? "까마귀와 까치 떼가 그 빛의 실을\n물고 날아올라\f두 남켓몬 사이에\n빛의 다리를 놓았다!" : "까마귀와 까치 떼가 날아올라\n두 남켓몬 사이에\f빛의 다리를 놓았다!");
  await say("'지켜 온 것'과 '새로 짜는 것'.\f둘이 다시 하나로 이어지자\n운해룡의 빈 몸속이\f따뜻한 별빛으로\n가득 채워졌다……");
  await say("운해룡은 조용히 울더니\n구름을 거두었다.\f그리고 반야봉 쪽 하늘로\n날아갔다.");
  if (typeof jpFxOff === "function") jpFxOff();
  // 떠오르는 만복사
  await camPan(110, 40);
  cxFx("temple");
  sfx("chime");
  await say("그 순간, 절터의 주춧돌 위로\n금빛 기둥이 하나둘 솟아올랐다.");
  await say("기와지붕, 처마, 풍경 소리……\f불에 타 사라졌던 옛 만복사가\n빛으로 떠올랐다!");
  if (typeof cxDaemokTemple === "function") await cxDaemokTemple();   // v2.60 대목 어른
  await say("할아버지 목소리가 떠올랐다.\f'집은 불타도 주춧돌은 남는 법이란다.\n사람도 그래.'");
  await frames(40);
  await say("빛의 절은 천천히 흩어져\n밤하늘의 별이 되었다.");
  await camPan(0, 30);
  cxFx("ojak", 200);
  G.flag("cx_unhae", true);
  await cxEunjik();
}
async function cxEunjik() {
  const P = World.player;
  if (G.flag("cx_eunjik")) return cxEnding();
  await say("은직성이 내려와\n눈앞에 날개를 접었다.\f함께 가고 싶다는 듯\n가만히 바라본다.");
  if (!G.has("ok")) { await say("윤슬 박사: 이 볼을 쓰세요!\n옥볼이에요!"); await getItem("ok", 3); }
  for (;;) {                       // v2.37 잡을 때까지(실제 게임의 이야기 전설처럼) — 전엔 여섯 번 놓치면 도감에서 영영 빠짐
    const r = await cxWild("eunjikseong", 50, {});
    cxFx("ojak", 200);
    if (r === "caught") break;
    await cxHeal("은직성은 아직 곁에서\n날갯짓을 하고 있다……\f남켓몬들이 기운을 되찾았다!");
    if (!G.has("ok") && !G.has("namket")) await getItem("ok", 3);
  }
  G.flag("cx_eunjik", true);
  await cxEnding();
}

// =====================================================================
// 6. 끝맺음
// =====================================================================
async function cxEnding() {
  const P = World.player, D = act("cx_daebang"), GR = act("cx_garam"), HW = act("cx_hwang"), JB = act("cx_jb");
  bgm("ojakgyo");
  cxFxOff();
  await say("구름이 걷힌 절터에\n고요한 달빛이 내려앉았다.");
  if (D) face(D, P);
  await say("변도진: ……'모두에게 복을'.\f내가 바란 건 나 혼자의\n복이었나.");
  if (typeof cxByeonPast === "function") await cxByeonPast(D);   // v2.60 한지 어른 — 박 밭 끝 초가집 도진이
  await say("교장 선생님: 남은 일은 어른들이\n하겠소.\f매립한 강, 사들인 땅,\n모두 마을 사람들과 함께 바로잡읍시다.");
  await say("변도진은 아무 말 없이\n요원들과 함께 절터를 떠났다.");
  if (D) D.hidden = true;
  if (GR) { face(GR, P); }
  await say("가람: 나는…… 남켓몬 목소리만\n들으면 된다고 생각했어.");
  await say("가람: 이제 사람들 사이에서도\n목소리를 들어 볼게.\f홍우성이랑 같이.");
  await say("가람: ……고마워.\n네 남켓몬들, 좋은 소리를 내더라.");
  if (GR) { sfx("exit"); await fadeOut(8); GR.hidden = true; await fadeIn(8); }
  await say("하얀 나비 한 마리가\n가람이 떠난 쪽으로 날아갔다.");
  if (typeof gqHint === "function") await gqHint();   // v2.60 가람의 밤(광한루원 오작교)
  const Y = act("cx_yeoul"), HG = act("cx_hg"), SM = act("cx_solmoe"), SO = act("cx_sori"), BR = act("cx_boreum");
  await say("여울: 내일부터 한결이랑\n요천 청소하기로 했어.\f강은 흘러야 하니까.");
  await say("한결: 야! 너 진짜 멋있었어!\f……다음엔 내가 마패 들 거야!\n아, 몰라!");
  await say("솔뫼: 나는 산으로 돌아가겠다.\f이번엔 문을 닫으러가 아니라,\n길을 안내하러.");
  if (typeof cxEndFan === "function") await cxEndFan();   // v2.59 소리 부채를 돌려 드림
  await say("소리 어른: 보름아,\n한 소리 같이 하자꾸나.");
  await say("보름: 네, 할아버지!\f……얼씨구!");
  if (typeof cxEndFan2 === "function") await cxEndFan2();
  if (typeof cxEndPungmul === "function") await cxEndPungmul();   // v2.60 상쇠 어른의 판
  if (JB) { face(JB, P); }
  await say("조박사: 마패, 잘 썼어?\f이제 선생님 거 돌려줘야지.\n……음 그건 안 돼, 라고 할 줄 알았지?");
  await say("조박사: 농담이야.\f그 마패는 오늘 밤만큼은\n네 거였어.");
  if (typeof cxEndCloth === "function") await cxEndCloth(JB);   // v2.59 청출어람
  G.take && G.take("mapae");
  await say(`${J(G.name, "은")} 조박사에게\n마패를 돌려주었다.`);
  if (typeof cxEndSeed === "function") await cxEndSeed();   // v2.59 박씨 · 엽서
  if (HW) face(HW, P);
  await say("교장 선생님: 수고했다.");
  await say("교장 선생님: 이제 남은 건\n하나뿐이구나.\f오방고원의 덕과 아카데미 리그.\n'졸업 시험'이다.");
  await say("교장 선생님: 운동화 끈 다시 묶고\n오너라.\f……나는 그 꼭대기에서\n기다리마.");
  if (window.CHAMPROAD_READY) await say("교장 선생님: 오방고원은\n16번도로 보절 들판 북쪽,\f17번도로 홍살문을 지나\n만행산을 넘으면 나온다.");
  G.flag("chuldu_done", true);
  await fadeOut(16);
  World.load("manboksa", P.x, P.y, P.dir); World.cam = World.camTarget();
  await fadeIn(16);
  if (!window.CHAMPROAD_READY && !window.LEAGUE_READY) await say("(플레이 버전은 여기까지!\n오방고원 리그는 다음에 열려요.)");
  zoneBgm();
}

// ---- 화면 연출: 밤 빛깔에 물들지 않게 지도 위가 아니라 화면 맨 위 층(Overlay)에 그림 ----
let CX_OV = null;
function cxFx(k, t = 0) {
  CX_FX = { k, t };
  if (!CX_OV) { const ov = CX_OV = new Overlay(() => {
    if (G.map !== "manboksa" || !CX_FX) { if (CX_OV === ov) { CX_OV = null; setTimeout(() => Scenes.pop(ov), 0); } return; }
    const [cx, cy] = World.cam || [0, 0]; cxDrawFx(cx, cy); });
    // 배틀 화면 아래에 깔리도록 World 바로 위에 넣음
    const i = Scenes.st.indexOf(World); if (i >= 0) Scenes.st.splice(i + 1, 0, ov); else Scenes.push(ov); }
}
function cxFxOff() { CX_FX = null; if (CX_OV) { const ov = CX_OV; CX_OV = null; Scenes.pop(ov); } }
function cxDrawFx(cx, cy) {
  if (!CX_FX) return;
  const F = CX_FX; F.t++;
  const mx = Math.round(Math.min(SW - 24, Math.max(24, 15 * TS - cx + 8)));
  if (F.k === "moon" || F.k === "chuldu") {                // 보름달(화면 위쪽, 오층석탑 쪽)
    const my = 26 - Math.max(0, 40 - F.t) * 0.6;
    g.globalAlpha = 0.25; g.fillStyle = "#fff6c8"; g.beginPath(); g.arc(mx, my, 22, 0, Math.PI * 2); g.fill();
    g.globalAlpha = 1; g.fillStyle = "#fff8dc"; g.beginPath(); g.arc(mx, my, 12, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#ece2b8"; g.beginPath(); g.arc(mx - 4, my - 3, 3, 0, Math.PI * 2); g.arc(mx + 3, my + 4, 2, 0, Math.PI * 2); g.fill();
  }
  if (F.k === "chuldu" && F.t < 70) {                      // 번쩍 + 큰 글씨
    const a = Math.max(0, 1 - F.t / 70);
    g.globalAlpha = a * 0.5; g.fillStyle = "#fff4c0"; g.fillRect(0, 0, SW, SH); g.globalAlpha = 1;
    const s = "암행어사 출두요!", w = Font.width(s) + 28;
    rect((SW - w) / 2, 48, w, 24, "#5a1010"); rect((SW - w) / 2 + 2, 50, w - 4, 20, "#c8281e");
    Font.draw(g, s, SW / 2, 54, { align: "center", col: "#fff8e0", sh: "#601010" });
  }
  if (F.k === "unhae") {                                   // 구름바다 + 운해룡
    const a = Math.min(1, F.t / 30);
    g.globalAlpha = a * 0.6; g.fillStyle = "#eef2fa";
    for (let i = 0; i < 10; i++) { const x = ((i * 43 + F.t * 0.6) % (SW + 60)) - 30, y = 132 + Math.sin(i * 1.7 + F.t / 30) * 14; g.beginPath(); g.arc(x, y, 30, 0, Math.PI * 2); g.fill(); }
    g.globalAlpha = a * 0.3; g.fillStyle = "#c8d8ff"; g.beginPath(); g.arc(SW / 2, 50, 46, 0, Math.PI * 2); g.fill();
    g.globalAlpha = a; monFront("unhaeryong", SW / 2 - 48, 4 + Math.sin(F.t / 14) * 4); g.globalAlpha = 1;
  }
  if (F.k === "ojak") {                                    // 홍우성·은직성 + 오작(까마귀·까치) 빛의 다리
    const a = Math.min(1, F.t / 40), lx = 8, rx = SW - 8, by = 70;
    g.globalAlpha = a * 0.35; g.fillStyle = "#ffd890"; g.beginPath(); g.arc(lx + 48, by - 10, 40, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#c8d8ff"; g.beginPath(); g.arc(rx - 48, by - 10, 40, 0, Math.PI * 2); g.fill();
    g.globalAlpha = a; monFront("honguseong", lx, by - 70); monFront("eunjikseong", rx - 96, by - 70);
    const n = Math.min(14, Math.floor(F.t / 6));
    for (let i = 0; i < n; i++) {                          // 다리를 놓는 새 떼(검은 까마귀 · 흰 배 까치)
      const k = i / 13, x = lx + 96 + (rx - lx - 192) * k, y = by - 20 - Math.sin(k * Math.PI) * 22 + Math.sin(F.t / 6 + i) * 1.5;
      const wing = (Math.floor(F.t / 5) + i) % 2;
      rect(x - 3, y, 7, 2, "#1e1e2c"); rect(x - 4 - wing, y - 1 - wing, 3, 1, "#1e1e2c"); rect(x + 2 + wing, y - 1 - wing, 3, 1, "#1e1e2c");
      if (i % 2) rect(x - 1, y + 1, 3, 1, "#f0f0f8");
    }
    if (n >= 14) { g.globalAlpha = a * (0.5 + 0.2 * Math.sin(F.t / 8)); g.strokeStyle = "#fff4c8"; g.lineWidth = 1; g.beginPath();
      for (let i = 0; i <= 20; i++) { const k = i / 20, x = lx + 96 + (rx - lx - 192) * k, y = by - 16 - Math.sin(k * Math.PI) * 22; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    g.globalAlpha = 1;
  }
  if (F.k === "temple") {                                  // 주춧돌 위로 빛으로 떠오르는 옛 만복사(두 겹 지붕 금당)
    const a = Math.min(1, F.t / 50);
    const x0 = 5 * TS - cx, x1 = 26 * TS - cx, mid = (x0 + x1) / 2, base = 23 * TS - cy + 8, rise = Math.min(1, F.t / 80);
    const eave = base - 64 * rise, top = base - 128 * rise;                // 아래 처마 · 위 지붕
    const roof = (xa, xb, y) => {                                          // 끝이 살짝 들린 기와지붕
      const m = (xa + xb) / 2;
      g.beginPath(); g.moveTo(xa - 14, y + 12); g.quadraticCurveTo(m, y - 6, xb + 14, y + 12); g.lineTo(xb - 2, y);
      g.quadraticCurveTo(m, y - 16, xa + 2, y); g.closePath();
      g.fillStyle = "rgba(255,214,120,0.6)"; g.fill(); g.strokeStyle = "rgba(255,236,170,0.9)"; g.stroke();
      g.beginPath(); g.moveTo(xa + 2, y); g.quadraticCurveTo(m, y - 16, xb - 2, y); g.strokeStyle = "rgba(255,250,220,0.95)"; g.stroke();
    };
    g.save(); g.globalAlpha = a; g.lineWidth = 1;
    const grd = g.createLinearGradient(0, top, 0, base); grd.addColorStop(0, "rgba(255,226,140,0.08)"); grd.addColorStop(1, "rgba(255,200,110,0.45)");
    g.fillStyle = grd; g.fillRect(x0 + 4, eave + 12, x1 - x0 - 8, base - eave - 12);
    const ux0 = x0 + (x1 - x0) * 0.2, ux1 = x1 - (x1 - x0) * 0.2;
    g.fillStyle = "rgba(255,226,140,0.22)"; g.fillRect(ux0 + 4, top + 12, ux1 - ux0 - 8, eave - top - 8);
    g.strokeStyle = "rgba(255,236,170,0.9)";
    for (let x = x0 + 10; x < x1 - 4; x += 48) { g.beginPath(); g.moveTo(x, base); g.lineTo(x, eave + 12); g.stroke(); }   // 기둥(주춧돌 줄 위로)
    for (let x = ux0 + 10; x < ux1 - 4; x += 48) { g.beginPath(); g.moveTo(x, eave - 2); g.lineTo(x, top + 12); g.stroke(); }
    roof(x0, x1, eave); roof(ux0, ux1, top);
    g.fillStyle = "rgba(255,248,210,0.95)"; g.fillRect(Math.round(mid) - 1, Math.round(top - 22), 2, 10);                   // 용마루 장식
    for (const fx of [x0 - 10, x1 + 10]) { const sw = Math.sin(F.t / 9 + fx) * 1.5; rect(fx + sw, eave + 14, 2, 4, "#fff4c8"); }  // 풍경
    for (let i = 0; i < 20; i++) { const sx = x0 + ((i * 37 + F.t * 0.5) % (x1 - x0)), sy = base - ((F.t * 0.6 + i * 23) % (base - top + 20)); rect(sx, sy, 1, 1, "#fff8e0"); }
    g.restore();
  }
}

(function attachChapter23() {
  const M = MAPS.manboksa;
  // 사건 중엔 평소 사람·트레이너는 비킴, 풀숲 출현 없음
  for (const n of M.npcs) if (!n.item && !n.id?.startsWith("cx_")) { const s0 = n.show; n.show = () => !cxEv() && (!s0 || s0()); }
  { const z = M.zinfo["만복사지"]; M.zinfo["만복사지"] = { ...z, get enc() { return cxEv() ? null : "만복사지"; }, bgm: () => cxEv() ? "bondi" : "ojakgyo" }; }
  M.onLoad = () => {
    if (!cxEv()) { cxFxOff(); return; }
    const on = G.flag("cx_chuldu");
    for (const id of CX_CROWD) { const a = act(id); if (a) a.hidden = !on; }
    const D = act("cx_daebang"); if (D && on) D.spr = "byeon";
    for (const [x, y] of CX_JARS) { const j = act(`cx_jar_${x}_${y}`); if (j) j.open = G.flag("cx_jars"); }
  };
  const ev = c => () => cxEv() && c();
  M.areas = (M.areas || []).concat([
    { x0: 34, y0: 13, x1: 38, y1: 16, cond: ev(() => !G.flag("cx0")), run: cxOpen },
    { x0: 25, y0: 13, x1: 28, y1: 16, cond: ev(() => G.flag("cx0") && !G.flag("cx_key")), run: cxBangsam },
    { x0: 18, y0: 9, x1: 22, y1: 11, cond: ev(() => !G.flag("cx_ongi")), run: cxOngi },
    { x0: 4, y0: 9, x1: 12, y1: 12, cond: ev(() => G.flag("cx_ongi") && !G.flag("cx_elders")), run: cxElders },
    { x0: 12, y0: 8, x1: 17, y1: 11, cond: ev(() => G.flag("cx_elders") && !G.flag("cx_garam")), run: cxGaram },
    { x0: 12, y0: 8, x1: 17, y1: 11, cond: ev(() => G.flag("cx_garam") && !G.flag("cx_chuldu")), run: cxReveal },
    { x0: 4, y0: 4, x1: 37, y1: 16, cond: ev(() => G.flag("cx_chuldu") && !G.flag("cx_byeon")), run: async () => { await cxWalk(World.player, 15, 10); World.player.dir = "up"; await cxByeon(); } },
    { x0: 4, y0: 4, x1: 37, y1: 16, cond: ev(() => G.flag("cx_byeon")), run: async () => { await cxWalk(World.player, 15, 10); World.player.dir = "up"; await cxUnhae(); } },
  ]);
  const jarDraw = (x, y) => (px, py) => { const T = JSN.tiles_out && JSN.tiles_out.t; const a = act(`cx_jar_${x}_${y}`); if (!T || T.jar === undefined || (a && a.open)) return; tileAt(World.M.ts, T.jar, px, py); };
  const hidden = (id, x, y, spr, dir, extra = {}) => ({ id, x, y, spr, dir, move: "fixed", hidden: true, show: cxEv, ...extra });
  M.npcs.push(
    { id: "cx_g1", x: 30, y: 13, spr: "bondi", dir: "down", move: "fixed", show: () => cxEv() && !G.flag("cx_chuldu"), trainer: { ...CX_G1, range: 2 } },
    { id: "cx_g2", x: 22, y: 12, spr: "bondi_f", dir: "left", move: "fixed", show: () => cxEv() && !G.flag("cx_chuldu"), trainer: { ...CX_G2, range: 4 } },
    hidden("cx_bangsam", 37, 14, "bondi", "left"), hidden("cx_danji", 38, 14, "bondi", "left"),
    { id: "cx_ongi", x: 23, y: 10, spr: "ongi", dir: "left", move: "fixed", show: cxEv,
      talk: () => G.flag("cx_ongi") ? say("옹이: 그릇은 쓰라고 만드는 거야.\n……이제 알겠어.") : cxOngi() },
    ...CX_JARS.map(([x, y]) => ({ id: `cx_jar_${x}_${y}`, x, y, move: "fixed", show: cxEv, special: jarDraw(x, y),
      talk: () => say(act(`cx_jar_${x}_${y}`) && act(`cx_jar_${x}_${y}`).open ? "텅 빈 항아리다.\n이제 김치를 담아도 되겠다." : "붉은 봉인이 붙은 항아리.\f안에서 작은 울음소리가 들린다……") })),
    { id: "cx_sori", x: 9, y: 9, spr: "sori", dir: "down", move: "fixed", show: cxEv, talk: () => G.flag("cx_elders") ? say("소리 어른: 함께 부르면\n남는 소리가 있구나.") : cxElders() },
    { id: "cx_hanji", x: 5, y: 10, spr: "hanji", dir: "right", move: "fixed", show: cxEv, talk: () => say("한지 어른: 한지는 천 년을 간다지.\n서류도 그렇게 오래 남겨야지.") },
    { id: "cx_boreum", x: 11, y: 9, spr: "boreum", dir: "left", move: "fixed", show: cxEv, talk: () => say("보름: 할아버지랑\n같이 부를 거야!") },
    { id: "cx_garam", x: 16, y: 9, spr: "garam", dir: "down", move: "fixed", show: cxEv, talk: () => say("가람: ……들렸어.") },
    { id: "cx_daebang", x: 15, y: 8, spr: "daebang", dir: "down", move: "fixed", show: cxEv, talk: () => G.flag("cx_chuldu") ? cxByeon() : say("대방: ……물러가라.") },
    hidden("cx_ag1", 12, 8, "agent", "right"), hidden("cx_ag2", 18, 8, "agent", "left"),
    // 출두 사람들(출두 때 나타남)
    hidden("cx_jb", 19, 6, "jobaksa", "down", { talk: () => say("조박사: 잘했어.\n선생님이 다 봤다.") }),
    hidden("cx_hwang", 20, 6, "gl_mrhwang", "down", { talk: () => say("교장 선생님: 이 아이는\n혼자 온 게 아니오.") }),
    hidden("cx_chan", 8, 12, "gl_chanhyang", "up", { talk: () => say("찬향: 왜 그렇게 생각했을까?\f……변 이사장님한테\n꼭 묻고 싶었어요.") }),
    hidden("cx_mi", 6, 13, "gl_miyeong", "up", { talk: () => say("미영: ……나쁘지 않았어.\n아니, 멋졌어.") }),
    hidden("cx_su", 26, 13, "gl_suhyeon", "up", { talk: () => say("수현: 끝나면 다 같이\n밥부터 먹어요. 알았죠?") }),
    hidden("cx_sin", 28, 9, "gl_sinha", "left", { talk: () => say("신하: 복도에서 누가 뛰어다니냐-!\n……아니, 절터구나.\f흥, 딱히 걱정돼서\n달려온 건 아니야.") }),
    hidden("cx_gi", 28, 11, "gl_gisu", "left", { talk: () => say("기수: 음~ 아닌 거 같은데~?\f남켓몬을 전시품이라니.\n그건 정말 아니죠.") }),
    hidden("cx_ysim", 13, 12, "gl_yeosim", "up", { talk: () => say("여심: 다친 데 없죠?\n……괜찮아용~") }),
    hidden("cx_heeju", 4, 12, "heeju", "right", { talk: () => say("희주: 하아…… 하아……\n늦지 않았죠?\f아이들 재우고\n뛰어왔어요.\f'천천히 해도 괜찮아요'가\n제 입버릇인데…… 오늘만은요.") }),
    hidden("cx_hg", 17, 12, "hangyeol", "up", { talk: () => say("한결: 다음엔 내가\n마패 들 거야!") }),
    hidden("cx_yeoul", 22, 8, "yeoul", "left", { talk: () => say("여울: 강은 흘러야 해.\n사람이 막지만 않으면.") }),
    hidden("cx_solmoe", 9, 5, "solmoe", "down", { talk: () => say("솔뫼: 산도, 강도,\n사람이 함께 지키는 거로구나.") }),
    hidden("cx_yun", 23, 5, "yunseul", "down", { talk: () => say("윤슬 박사: 남켓몬들이 모두\n제 자리로 돌아갔어요!") }),
    hidden("cx_br2", 30, 9, "oldman", "left", { talk: () => say("할아버지: 출두요!\n……이 나이에 외쳐 볼 줄이야!") }),
    hidden("cx_vil1", 31, 12, "woman", "left", { talk: () => say("아주머니: 우리 동네 강을\n누가 메웠다고?") }),
    hidden("cx_vil2", 6, 5, "oldwoman", "down", { talk: () => say("할머니: 옛 절터에\n사람이 이렇게 많이 모이다니.") }),
  );
  // 마음에 남는 대사(사건 뒤 다시 말을 걸면 — 이 사람들은 사건 동안만 서 있음)
  for (const n of M.npcs) if (n.id && n.id.startsWith("cx_") && n.spr && n.talk) n.heart = "만복사의 밤 " + n.id;
})();
