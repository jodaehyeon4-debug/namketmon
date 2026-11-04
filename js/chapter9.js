// ===== v2.4 여덟째 장: 인월장터 남쪽 → 15번도로(인월 → 산내) → 월백마을(산내: 실상사·목기 공방 — 행수 옹이가 흔들림) → 뱀사골(단원 습격·국립공원 지킴이)
//   설정집 8장 '산내 뱀사골 단원' · 스토리 초안 8장(목기 장인 "그릇은 밥을 담아야 그릇이다", 뱀사골 이무기 전설과 미르니, 반달가슴곰 서식지와 등산로)
//   반야봉 1차(여울 ②·솔뫼 ②·가람 ④, 전설)는 다음(v2.5) — 뱀사골 위쪽 끝은 안개로 통제
// chapter8.js 뒤, hearts.js 앞에 읽힘
// 사실(위키백과로 확인): 실상사 — 828년(흥덕왕 3) 증각대사 홍척이 세운 것으로 전함, 구산선문 가운데 가장 먼저 세운 선종 사찰,
//   산속이 아닌 들판 가운데 평지 사찰·만수천을 낌, 약사전 철제여래좌상(신라 말, 한국에 남은 가장 큰 철불), 백장암 삼층석탑 국보
//   / 지리산 — 1967년 대한민국 첫 국립공원, 반달가슴곰 복원사업을 시작한 곳 / 달궁 — 마한 왕 관련 구전(정설 아님 → '전해진다')
//   / 뱀사골 이무기 전설은 위키백과 문서가 없어 '전해진다'로만 / 남원 목기는 문서가 없어 공방·장인은 창작(사실 주장 없음)
"use strict";
const WBD = MAPDATA.wolbaek.doors;
const exitWB = k => ["wolbaek", WBD[k][0], WBD[k][1], "down"];

(function fixTownLv9() { for (const r of DATA.town.routes || []) if (r.no === 15) r.lv = "39~43"; })();
for (const [k, lv] of [["15번도로", "39–43"], ["뱀사골", "41–45"]])
  if (DATA.spawns[k]) DATA.spawns[k] = DATA.spawns[k].map(e => ({ ...e, lv: e.k === "mireuni" ? "35–38" : lv }));
DATA.spawns["월백마을"] = [
  { k: "sutkkeomi", lv: "39–42", t: "모두", r: "흔함" }, { k: "mokdongi", lv: "39–42", t: "밤", r: "가끔" }, { k: "jebikko", lv: "39–42", t: "낮", r: "가끔" },
  { k: "namujjo", lv: "40–43", t: "낮", r: "드묾" }, { k: "dalgomkong", lv: "39–42", t: "모두", r: "드묾" } ];
if (typeof FISH !== "undefined") {
  FISH.route15 = { at: "15번도로", list: [{ k: "eunchimi", lv: "24–28", r: "흔함", t: "모두" }, { k: "daseulmi", lv: "24–28", r: "흔함", t: "낮" }, { k: "chireyong", lv: "26–28", r: "드묾", t: "밤" }] };
  FISH.wolbaek = { at: "월백마을", list: [{ k: "eunchimi", lv: "24–28", r: "흔함", t: "모두" }, { k: "ssogami", lv: "26–28", r: "가끔", t: "모두" }, { k: "megijang", lv: "26–28", r: "드묾", t: "밤" }] };
  FISH.baemsagol = { at: "뱀사골", list: [{ k: "daseulmi", lv: "26–30", r: "흔함", t: "모두" }, { k: "chireyong", lv: "27–30", r: "가끔", t: "밤" }, { k: "mireuni", lv: "28–30", r: "아주 드묾", t: "아침" }] };
}
if (typeof HIDDEN !== "undefined") {
  HIDDEN.route15 = [[42, 11, "maxrepel"], [18, 18, "omija"], [12, 51, "ppup" in ITEMS ? "ppup" : "elixir"], [27, 31, "gam"]];
  HIDDEN.wolbaek = [[3, 40, "fullheal"], [47, 3, "maxether"] ];
  HIDDEN.baemsagol = [[6, 56, "revive"], [28, 41, "meoru"], [5, 35, "maxrevive"], [33, 15, "hyperpotion"]];
}

// =====================================================================
// 1. 월백마을 목기 공방: 행수 옹이가 몰래 찾아와 목기 장인의 말에 흔들림 (설정집 옹이 '8장 목기 장인의 "그릇은 밥을 담아야 그릇이다"에 흔들림')
// =====================================================================
async function mokgiEvent() {
  const P = World.player, O = act("mg_ongi"), M = act("mg_master");
  if (!O || G.flag("mokgi_event_done")) return;
  bgm("hideout");
  await say("공방 안에 나무 냄새가 가득하다.\f낯익은 얼굴이 선반의 그릇을\n들여다보고 있다……");
  if (M) face(M, O);
  await say("장인: 그 그릇이 마음에 드나?\f꽤 오래 걸려 깎은 거라네.");
  await say("???: ……쓰지도 않을 그릇을\n왜 이렇게 공들여 깎으세요?");
  await say("장인: 쓰지 않을 그릇이라니.\f그릇은 밥을 담아야 그릇이다.\f쓰지 않고 모셔 두기만 하면\n나무 결이 먼저 잠들어 버려.");
  await emote(O, "dots", 40);
  await say("???: ……우리 스승님도\n똑같은 말을 하셨어요.\f'그릇은 쓰라고 만드는 거다.'");
  await say("장인: 허허, 좋은 스승을 두었구먼.");
  face(O, P); await emote(O, "excl", 24);
  await say("옹이: ……너구나.\n교룡산성에서 본.");
  await say("옹이: 오늘은 싸우러 온 거 아니야.\f……가마에 불을 넣다가\n자꾸 손이 멈춰서.");
  await say("옹이: 반야봉에서 대방님이\n'의식'을 하신대.\f오작 전설을 깨워서\n남켓몬을 사람한테서 떼어 놓는다고.");
  await say("옹이: ……나는 아직 모르겠어.\n뭐가 맞는 건지.");
  sfx("exit"); await fadeOut(8); O.hidden = true; await fadeIn(8);
  if (M) face(M, P);
  await say("장인: 저 젊은이, 손에 흙물이\n배어 있더군. 옹기장이야.");
  await say("장인: 자, 이건 목기에 담아 온\n약과다. 먼 길 가는데 먹으렴.");
  await getItem("elixir");
  G.flag("mokgi_event_done", true);
  zoneBgm();
}
async function mokgiMasterTalk() {
  if (!G.flag("mokgi_event_done")) return mokgiEvent();
  await say("장인: 목기령은 오래 쓴 그릇에\n깃든다고들 하지.\f아끼며 날마다 쓰는 그릇에서만\n태어난다더라.");
}

// =====================================================================
// 2. 뱀사골: 본디회 단원 습격(미르니·달곰콩을 '등산객에게서 지킨다'며 항아리에) · 국립공원 지킴이
// =====================================================================
const BS_GRUNT1 = { id: "bondi_bs1", cls: "본디회", name: "단원", spr: "grunt_m", base: 30, music: "bondi", bgm: "trainer",
  intro: "단원: 솔뫼 행수님이 그러셨다!\n사람 없는 산이 진짜 산이라고!", lose: "단원: 크윽……\n곰이 길을 잃으면 어쩌려고……",
  team: [["neodeolba", 40, { mv: ["rockslide", "stompingtantrum", "sandstorm", "leer"] }], ["bagureong", 41, { mv: ["breakingswipe", "powergem", "harden", "growl"] }]] };
const BS_GRUNT2 = { id: "bondi_bs2", cls: "본디회", name: "단원", spr: "grunt_f", base: 30, music: "bondi", bgm: "trainer",
  intro: "단원: 미르니는 이무기 소의\n아이야!\f등산객 소리에 놀라\n숨어 버리잖아!", lose: "단원: ……항아리가 무거워졌어.",
  team: [["mokdongi", 40, { mv: ["shadowball", "astonish", "harden", "growl"] }], ["chamsutjang", 40, { mv: ["firepunch", "rocktomb", "harden", "ember"] }]] };
async function baemsaEvent() {
  const P = World.player, G1 = act("bs_g1"), G2 = act("bs_g2"), J1 = act("bs_jar1"), J2 = act("bs_jar2"), R = act("bs_ranger");
  if (!G1) return;
  bgm("bondi");
  await say("단원: 미르니야, 들어가!\n달곰콩도!\f항아리 속에선 아무도\n너희를 놀라게 하지 않아!");
  await walkPath(P, 20, 41); P.dir = "up";
  face(G1, P); await emote(G1, "excl", 22);
  await say("단원: 너는……!\n행수님들 얘기에 나오던 꼬마!");
  let r = await trainerBattle({ x: G1.x, y: G1.y, dir: G1.dir, trainer: BS_GRUNT1 }, false);
  if (r !== "win") return;
  face(G2, P); await emote(G2, "excl", 22);
  r = await trainerBattle({ x: G2.x, y: G2.y, dir: G2.dir, trainer: BS_GRUNT2 }, false);
  if (r !== "win") return;
  bgm("bondi");
  await say("단원: ……그래도!\f등산로마다 사람이 넘쳐서\n곰이 다닐 길이 없잖아!");
  // 국립공원 지킴이
  if (R) { R.hidden = false; R.x = 20; R.y = 46; await walkTo(R, 20, 42); await walkTo(R, 21, 42); face(R, G1); }
  sfx("run");
  await say("???: 거기, 잠깐만요!\n국립공원 지킴이입니다.");
  await say("지킴이: 그 걱정, 저도 알아요.\f그래서 곰이 다니는 길이랑\n사람이 다니는 길을 나눠요.");
  await say("지킴이: 사람은 정해진 탐방로로만\n다니고,\f곰 쉼터 쪽은 사람이\n들어가지 않게 하는 거죠.");
  await say("지킴이: 지리산은 반달가슴곰을\n다시 살리는 일을 처음 시작한 곳이에요.\f가두면…… 산이 텅 비어요.");
  await emote(G2, "dots", 30);
  await say("단원: ……항아리, 열게요.");
  sfx("ball_open"); if (J1) J1.hidden = true; if (J2) J2.hidden = true;
  await say("미르니가 소로 미끄러져 들어가고,\n달곰콩은 숲으로 뛰어갔다!");
  try { Audio2.cry("mireuni"); } catch (e) {}
  await say("단원: 반야봉에서 행수님들이\n의식을 준비하고 계셔.\f……우리도 가 봐야 해.");
  sfx("exit"); await fadeOut(8); G1.hidden = true; G2.hidden = true; await fadeIn(8);
  if (R) face(R, P);
  await say("지킴이: 고마워요.\f위쪽 반야봉 가는 길은 지금\n안개가 짙어서 막아 두었어요.\f길이 열리면 알려 줄게요.");
  G.flag("baemsa_event_done", true);
  zoneBgm();
}

// =====================================================================
// 지도에 붙이기
// =====================================================================
(function attachChapter9() {
  const D = MAPDATA;
  if (typeof LOCKS !== "undefined") Object.assign(LOCKS, {
    yaksa_wb: "약사전 문이 닫혀 있다.\f안에는 커다란 쇠부처님이\n앉아 계신다고 한다.",
    house2_wb: "문이 잠겨 있다.\f'지리산 탐방 안내소 —\n오늘은 뱀사골에서 근무합니다'",
  });
  // ---- 인월장터 남쪽 → 15번도로 (흥부 리조트 설명회 뒤 공사 끝) ----
  const IWM = MAPS.inwol;
  for (const id of ["iw_worker_s", "iw_worker_s2"]) { const w = IWM.npcs.find(n => n.id === id); if (w) w.show = () => !G.flag("ms_event_done"); }
  IWM.warps = (IWM.warps || []).concat([38, 39].map(x => [x, 35, ["route15", x - 16, 0, "down", "edge"]]));
  { const s = IWM.signs.find(s => s[0] === 37 && s[1] === 33); if (s) s[2] = "↓ 15번도로(산내)\n월백마을 · 실상사 · 뱀사골"; }
  IWM.npcs.push({ id: "iw_s_guide", x: 40, y: 33, spr: "man", dir: "left", move: "look", show: () => G.flag("ms_event_done"),
    talk: "아저씨: 산내 가는 길이 열렸단다!\f아까 파란 옷 입은 아이가\n'먼저 간다!' 하고 뛰어갔지." });

  // ---- 15번도로 ----
  const R15 = D.route15;
  MAPS.route15 = {
    rows: R15.rows, stamps: R15.stamps, name: "15번도로",
    warps: [22, 23].map(x => [x, 0, ["inwol", x + 16, 35, "up", "edge"]])
      .concat([24, 25].map(x => [x, 59, ["wolbaek", x, 0, "down", "edge"]])),
    zones: [["15번도로", 0, 0, 47, 59]],
    zinfo: { "15번도로": { bgm: "route", enc: "15번도로", rate: 0.12, bg: "grass" } },
    signs: [[21, 2, "15번도로\n↑ 인월장터 · ↓ 월백마을(산내)"], [35, 7, "개울 건너 들판길\n비가 오면 징검다리는 미끄러워요"],
      [10, 24, "다랑논\f산비탈을 깎아 층층이 만든 논.\n논두렁으로 다닐 수 있어요."], [23, 56, "↓ 월백마을\n지리산 깊은 골짜기 마을"]],
    checks: [], areas: [],
    npcs: [
      { id: "r15_farmer", x: 10, y: 36, spr: "oldman", dir: "right", move: "look", talk: "할아버지: 산골에선 평평한 땅이\n귀하단다.\f그래서 비탈을 깎아\n한 층 한 층 논을 만들었지." },
      { id: "r15_hiker", x: 26, y: 29, spr: "woman", dir: "down", move: "look", talk: "등산객: 산내에 가면 실상사에\n꼭 들러 봐.\f산속이 아니라 들판 한가운데\n있는 절이야." },
      { item: "hyperpotion", x: 8, y: 6 }, { item: "fullheal", x: 44, y: 4 }, { item: "revive", x: 40, y: 55 }, { item: "ok", n: 3, x: 3, y: 31 }, { item: "superrepel", x: 12, y: 52 },
      { x: 24, y: 6, spr: "kid_m", dir: "down", trainer: { id: "r15_siu", cls: "등산 소년", name: "시우", spr: "kid_m", range: 3, base: 18, team: [["sutkkeomi", 40], ["mokdongi", 40]],
        intro: "지리산 종주가 꿈이야!\n먼저 너부터!", lose: "다리가 후들후들……", after: "산은 내려갈 때\n더 조심해야 해." } },
      { x: 40, y: 18, spr: "bugboy", dir: "left", trainer: { id: "r15_jaeyun", cls: "벌레잡이", name: "재윤", spr: "bugboy", range: 4, base: 16, team: [["jangsuppul", 41]],
        intro: "들판 끝까지 쫓아왔다!\n장수풍뎅이야, 가자!", lose: "뿔이…… 세 번째로 휘었다……", after: "벌레도 쉬어야 힘이 나." } },
      { x: 16, y: 20, spr: "kid_f", dir: "right", trainer: { id: "r15_eunseo", cls: "꼬마 숙녀", name: "은서", spr: "kid_f", range: 3, base: 16, team: [["jebikko", 39], ["boeunbi", 41]],
        intro: "제비는 논 위를\n낮게 날아다녀!", lose: "제비가 다 날아갔어……", after: "제비는 논의 벌레를\n잡아먹는대." } },
      { x: 38, y: 34, spr: "kid_m", dir: "left", trainer: { id: "r15_hajun", cls: "꼬마", name: "하준", spr: "kid_m", range: 3, base: 16, team: [["heukdoni", 40], ["chamsutjang", 41]],
        intro: "턱에서 뛰어내리면\n여기로 와!", lose: "뜨거워……", after: "참숯장은 오래오래\n뜨거워." } },
      { x: 18, y: 50, spr: "kid_f", dir: "right", trainer: { id: "r15_yuna", cls: "꼬마 숙녀", name: "윤아", spr: "kid_f", range: 3, base: 16, team: [["kkumnoru", 40], ["mokgiryeong", 41]],
        intro: "풀숲에서 꿈노루를\n찾고 있었어!", lose: "꿈에서 깼다……", after: "목기령은 오래 쓴 그릇에서\n태어난대." } },
    ],
  };

  // ---- 월백마을 ----
  const WB = D.wolbaek;
  MAPS.wolbaek = {
    rows: WB.rows, stamps: WB.stamps, name: "월백마을",
    warps: [24, 25].map(x => [x, 0, ["route15", x, 59, "up", "edge"]])
      .concat([24, 25].map(x => [x, 43, ["baemsagol", x - 5, 63, "up", "edge"]])),
    zones: [["월백마을", 0, 0, 51, 43]],
    zinfo: { "월백마을": { bgm: "wolbaek", enc: "월백마을", rate: 0.1, bg: "grass" } },
    signs: [[23, 2, "월백마을\n지리산 깊은 골짜기 마을(산내)"], [9, 4, "목기 공방\n나무 그릇을 깎는 곳"],
      [39, 20, "실상사\f828년 홍척 스님이 세웠다고 전해지는 절.\f신라 말 구산선문 가운데 가장 먼저\n문을 연 선종 사찰이다.\f산속이 아니라 들판 한가운데 있는\n평지 사찰이다."],
      [23, 34, "↓ 뱀사골\n지리산 깊은 골짜기 · 반야봉 가는 길"], [2, 33, "← 달궁 계곡\f옛날 마한의 왕이 난리를 피해\n궁을 지었다고 전해지는 곳"]],
    checks: [[35, 14, "오래된 석탑이다.\f이끼 낀 돌 위로\n햇빛이 비친다."], [36, 14, "오래된 석탑이다."], [45, 14, "오래된 석탑이다."], [46, 14, "오래된 석탑이다."]],
    areas: [],
    npcs: [
      { id: "wb_monk", x: 41, y: 12, spr: "monk", dir: "down", move: "look", talk: async () => {
        await say("스님: 이 절은 산속이 아니라\n들판 한가운데 있단다.\f마을 사람들 곁에 있으려고\n그랬다는 이야기도 있지.");
        await say("스님: 약사전의 쇠부처님은\n우리나라에 남은 가장 큰 철불,\f쇠로 만든 부처님이시란다."); } },
      { id: "wb_monk2", x: 38, y: 16, spr: "monk", dir: "right", move: "look", talk: "스님: 절 마당을 쓰는 것도\n공부란다.\f낙엽은 쓸어도 쓸어도\n또 떨어지지만 말이야." },
      { id: "wb_granny", x: 9, y: 21, spr: "oldwoman", dir: "down", move: "look", talk: "할머니: 지리산 물로 지은 쌀이라\n밥맛이 좋단다.\f골짜기마다 물이 흘러\n논을 적시지." },
      { id: "wb_wood", x: 12, y: 11, spr: "man", dir: "up", move: "look", talk: "아저씨: 장작은 나무를 쪼개서\n한 해쯤 말려야 잘 탄단다.\f급하게 때면\n연기만 나지." },
      { id: "wb_kid", x: 30, y: 26, spr: "kid_m", move: "wander", r: 2, talk: "뱀사골에는 이무기가\n살았대!\f……근데 이무기가 뭐야?" },
      { id: "wb_hiker", x: 26, y: 35, spr: "man", dir: "left", move: "look", talk: "등산객: 뱀사골은 반야봉 쪽으로\n쭉 올라가는 골짜기야.\f물이 엄청 맑아!" },
      { item: "ok", n: 2, x: 47, y: 25 }, { item: "superpotion", n: 2, x: 4, y: 37 },
      { x: 10, y: 38, spr: "kid_f", dir: "right", trainer: { id: "wb_seoa", cls: "꼬마 숙녀", name: "서아", spr: "kid_f", range: 3, base: 16, team: [["namujjo", 41], ["dalgomkong", 40]],
        intro: "숲에서 달곰콩을\n봤어!", lose: "달곰콩이 숨었다……", after: "달곰콩 가슴엔\n하얀 반달이 있어." } },
      { x: 40, y: 37, spr: "bugboy", dir: "left", trainer: { id: "wb_jiwan", cls: "벌레잡이", name: "지완", spr: "bugboy", range: 3, base: 16, team: [["jjidami", 41], ["beondami", 41]],
        intro: "만수천 둑은\n벌레 천국이야!", lose: "다 날아갔다……", after: "잠자리는 물가에\n알을 낳아." } },
    ],
  };
  MAPS.mokgi_in = { rows: D.mokgi_in.rows, stamps: D.mokgi_in.stamps, indoor: true, name: "목기 공방", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "wolbaek", noPopup: true, exit: exitWB("mokgi_in"),
    checks: [[0, 1, "선반에 크고 작은 나무 그릇이\n가지런히 놓여 있다."], [1, 1, "선반에 크고 작은 나무 그릇이\n가지런히 놓여 있다."], [5, 2, "작업대 위에 나무 부스러기가\n소복하다."], [6, 2, "작업대 위에 나무 부스러기가\n소복하다."]],
    areas: [{ x0: 2, y0: 4, x1: 7, y1: 5, cond: () => !G.flag("mokgi_event_done") && hasBadge(6), run: mokgiEvent }],
    npcs: [
      { id: "mg_master", x: 7, y: 3, spr: "mokgong", dir: "left", move: "fixed", talk: mokgiMasterTalk },
      { id: "mg_ongi", x: 3, y: 3, spr: "ongi", dir: "up", move: "fixed", show: () => !G.flag("mokgi_event_done") },
    ] };
  MAPS.center_wolbaek = { ...MAPS.center, exit: exitWB("center_wolbaek"),
    npcs: [MAPS.center.npcs.find(n => n.id === "nurse"),
      { id: "wbc_hiker", x: 2, y: 6, spr: "man", move: "look", talk: "등산객: 반야봉까지 가려면\n물이랑 회복약을 넉넉히!\f산 위는 날씨가\n금방 바뀌거든." },
      { id: "wbc_gm", x: 11, y: 5, spr: "oldwoman", move: "look", talk: "할머니: 옛날엔 골짜기마다\n숯 굽는 연기가 올랐지." }] };
  MAPS.mart_wolbaek = { ...MAPS.mart, name: "월백 만물상", exit: exitWB("mart_wolbaek"),
    npcs: [MAPS.mart.npcs.find(n => n.id === "clerk"), MAPS.mart.npcs.find(n => n.id === "clerk2"),
      { id: "wbm_kid", x: 7, y: 6, spr: "kid_f", move: "look", talk: "모깃불 사 가!\f뱀사골 풀숲은\n남켓몬이 엄청 많아." }] };
  MAPS.house_wb = { rows: D.house_a.rows, stamps: D.house_a.stamps, indoor: true, name: "한옥", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "wolbaek", noPopup: true, exit: exitWB("house_wb"),
    checks: [[0, 1, "반들반들한 나무 함지가\n놓여 있다."], [1, 1, "반들반들한 나무 함지가\n놓여 있다."]],
    npcs: [{ id: "hwb_gp", x: 2, y: 4, spr: "oldman", move: "look", talk: async () => {
      if (!G.flag("hwb_gift")) { await say("할아버지: 우리 집 함지는\n할머니가 시집올 때 가져온 거란다.\f쉰 해 넘게 날마다 썼지."); await getItem("mogwa", 2); G.flag("hwb_gift", true); return; }
      await say("할아버지: 나무 그릇은 쓸수록\n반들반들 윤이 난단다."); } }] };

  // ---- 뱀사골 ----
  const BSD = D.baemsagol;
  MAPS.baemsagol = {
    rows: BSD.rows, stamps: BSD.stamps, name: "뱀사골",
    warps: [19, 20].map(x => [x, 63, ["wolbaek", x + 5, 43, "up", "edge"]]),
    zones: [["뱀사골", 0, 0, 39, 63]],
    zinfo: { "뱀사골": { bgm: "juhong", enc: "뱀사골", rate: 0.13, bg: "grass" } },
    over(cx, cy) {                                                  // 위쪽 끝 안개(반야봉 가는 길, v2.5)
      const y1 = 9 * TS - cy; if (y1 <= 0) return;
      for (let k = 0; k < 6; k++) { g.globalAlpha = 0.11; g.fillStyle = "#eef2f6"; g.fillRect(0, 0, SW, Math.min(y1 - k * 10, 192)); }
      g.globalAlpha = 1;
    },
    signs: [[21, 61, "뱀사골\n지리산 깊은 골짜기\f이무기 전설이 전해지는 곳"],
      [18, 45, "반달가슴곰 출현 지역\f정해진 탐방로로만 다녀요.\n곰 쉼터에 들어가지 마세요.\f— 국립공원 지킴이"],
      [21, 20, "이무기 소\f이무기가 살았다고 전해지는\n깊은 소."], [21, 8, "↑ 반야봉\n— 짙은 안개로 통제 중"]],
    checks: [[14, 3, "물줄기가 바위를 타고\n하얗게 쏟아진다."], [15, 3, "물줄기가 바위를 타고\n하얗게 쏟아진다."], [16, 3, "물줄기가 하얗게 쏟아진다."], [17, 3, "물줄기가 하얗게 쏟아진다."]],
    areas: [{ x0: 19, y0: 41, x1: 20, y1: 44, cond: () => !G.flag("baemsa_event_done"), run: baemsaEvent }],
    npcs: [
      { id: "bs_g1", x: 21, y: 39, spr: "bondi", dir: "left", move: "fixed", show: () => !G.flag("baemsa_event_done") },
      { id: "bs_g2", x: 18, y: 39, spr: "bondi", dir: "right", move: "fixed", show: () => !G.flag("baemsa_event_done") },
      { id: "bs_jar1", x: 22, y: 38, spr: "", special: function (px, py) { const T = JSN.tiles_out && JSN.tiles_out.t; if (!T || T.jar === undefined) return; const ti = T.jar;
          tileAt(World.M.ts, ti, px, py); },
        move: "fixed", show: () => !G.flag("baemsa_event_done"), talk: () => say("붉은 봉인이 붙은 항아리.\f안에서 무언가 꿈틀거린다……") },
      { id: "bs_jar2", x: 17, y: 38, spr: "", special: function (px, py) { const T = JSN.tiles_out && JSN.tiles_out.t; if (!T || T.jar === undefined) return; const ti = T.jar;
          tileAt(World.M.ts, ti, px, py); },
        move: "fixed", show: () => !G.flag("baemsa_event_done"), talk: () => say("붉은 봉인이 붙은 항아리.\f안에서 낑낑대는 소리가 난다……") },
      { id: "bs_ranger", x: 20, y: 46, spr: "ranger", dir: "up", hidden: true, move: "fixed", show: () => !G.flag("baemsa_event_done"),
        talk: () => say("지킴이: 위쪽 반야봉 가는 길은\n안개 때문에 막아 두었어요.") },
      { id: "bs_ranger_top", x: 19, y: 5, spr: "ranger", dir: "down", move: "fixed",
        talk: "지킴이: 여기서부터 반야봉 가는 길은\n짙은 안개로 통제 중이에요.\f(플레이 버전은 뱀사골까지!\n반야봉은 다음에 열려요.)" },
      { id: "bs_ranger_top2", x: 20, y: 5, spr: "ranger", dir: "down", move: "fixed", talk: "지킴이: 안개가 걷히면\n길을 열어 줄게요." },
      { id: "bs_fisher", x: 10, y: 46, spr: "oldman", dir: "up", move: "look", talk: "낚시꾼: 이 골짜기 물은\n바닥 돌까지 다 보여.\f깊은 소는 바닥이 안 보여서\n이무기 얘기가 생겼는지도 모르지." },
      { item: "maxpotion", x: 6, y: 57 }, { item: "fullheal", x: 33, y: 41 }, { item: "ok", n: 3, x: 32, y: 12 }, { item: "elixir", x: 5, y: 22 },
      { x: 22, y: 55, spr: "kid_m", dir: "left", trainer: { id: "bs_dohyun", cls: "등산 소년", name: "도현", spr: "kid_m", range: 3, base: 18, team: [["neodeolba", 42], ["namujjo", 42]],
        intro: "계곡 바위는\n내 놀이터야!", lose: "미끄러졌다……", after: "바위에 이끼가 있으면\n엄청 미끄러워." } },
      { x: 30, y: 44, spr: "kid_f", dir: "left", trainer: { id: "bs_harin", cls: "꼬마 숙녀", name: "하린", spr: "kid_f", range: 3, base: 16, team: [["eollekkot", 42], ["danpungbul", 42]],
        intro: "얼레꽃은 이른 봄에만\n피는 꽃이야!", lose: "꽃잎이 졌다……", after: "얼레꽃은 해가 비치면\n꽃잎을 뒤로 젖힌대." } },
      { x: 21, y: 25, spr: "bugboy", dir: "left", trainer: { id: "bs_yejun", cls: "벌레잡이", name: "예준", spr: "bugboy", range: 3, base: 16, team: [["jjidami", 42], ["seotkongi", 42]],
        intro: "소 옆에는\n잠자리가 많아!", lose: "물에 빠질 뻔……", after: "물가 벌레는\n물이 맑아야 살아." } },
      { x: 8, y: 22, spr: "kid_m", dir: "right", trainer: { id: "bs_minho", cls: "꼬마", name: "민호", spr: "kid_m", range: 3, base: 16, team: [["bagureong", 43]],
        intro: "바구렁은 바위 굴에\n사는 용이래!", lose: "굴로 숨었다……", after: "용이 되려면\n오래 기다려야 한대." } },
    ],
  };

  Object.assign(TOWN_ZONE, { "15번도로": "r15", "월백마을": "wolbaek", "목기 공방": "wolbaek", "월백 만물상": "wolbaek", "뱀사골": "baemsagol" });
})();
