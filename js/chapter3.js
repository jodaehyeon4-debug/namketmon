// ===== v1.6 셋째 장 앞부분: 3번도로(사매 → 덕과 들판·옹기 가마) · 본디회 행수 옹이 ① · 갈매마을(덕과) · 라이벌 4차전 · 덕과 아카데미 다시 =====
// chapter2.js 뒤, hearts.js 앞에 읽힘. 쪽빛마을 북쪽 공사를 열고 3번도로·갈매마을과 실내 지도를 만든다.
// 조박사(8관장)는 '연구 출장 중' → 갈매 배움터는 닫혀 있음(어사패 일곱 개 뒤). 출장의 정체(암행)는 숨긴 채 복선만.
"use strict";
const GD = MAPDATA.galmae.doors;
const exitG = k => ["galmae", GD[k][0], GD[k][1], "down"];

// ---- 출현표: 2번도로 5–9 → 쪽빛 10–13 → 3번도로 15–18 (혼불 어사패 뒤 Lv20 안팎) ----
DATA.spawns["3번도로"] = [
  { k: "kkomulbae", lv: "15–16", t: "낮", r: "흔함" }, { k: "gochibae", lv: "15–17", t: "낮", r: "흔함" },
  { k: "nabichae", lv: "16–18", t: "낮", r: "가끔" }, { k: "kkulbeong", lv: "15–18", t: "낮", r: "흔함" },
  { k: "heosuni", lv: "15–18", t: "밤", r: "흔함" }, { k: "ttallanggong", lv: "15–18", t: "모두", r: "가끔" },
  { k: "olchaengmi", lv: "15–18", t: "모두", r: "가끔" },
].filter(e => MON[e.k]);
DATA.spawns["갈매마을"] = [
  { k: "jjaekcham", lv: "16–18", t: "낮", r: "흔함" }, { k: "olchaengmi", lv: "16–18", t: "모두", r: "흔함" },
  { k: "mudangkong", lv: "16–18", t: "낮", r: "가끔" }, { k: "heosuni", lv: "16–18", t: "밤", r: "흔함" },
  { k: "honmangul", lv: "16–18", t: "밤", r: "가끔" }, { k: "ttallanggong", lv: "16–18", t: "모두", r: "가끔" },
].filter(e => MON[e.k]);
(function fixTownLv() { const r = (DATA.town.routes || []).find(r => r.no === 3); if (r) r.lv = "15~18"; })();

// =====================================================================
// 1. 3번도로 옹기 가마: 본디회 행수 옹이 ①
// =====================================================================
const R3_GRUNT = { id: "bondi_r3", cls: "본디회", name: "단원", spr: "grunt_m", base: 30, music: "bondi", bgm: "trainer",
  intro: "단원: 가마 불 꺼지면\n네가 책임질 거야?",
  lose: "단원: 으앗, 뜨거!\n불똥이 튀었다!",
  team: [["seureumi", 19], ["heosuni", 20]] };
// 설정집: 옹이 = 마을 행수, 옹기장, 고스트·불꽃, 봉인 항아리를 만든 사람. 가마 숯불의 숯꺼미.
// bal_gym(셋, 상처약 2): Lv19 68–93% · Lv20 90–93% (풀·불꽃·물). 허수니를 넣으면 물 스타팅이 25–43%라 뺌
const ONGI1 = { id: "ongi1", cls: "본디회 행수", name: "옹이", spr: "ongi", base: 60, music: "bondi", bgm: "trainer",
  intro: "옹이: 가마 불맛 좀 봐라!",
  lose: "옹이: ……금이 갔군.\f불을 너무 세게 땠어.",
  team: [["mokdongi", 23, { mv: ["ominouswind", "hex", "astonish", "sweetscent"] }],
         ["sutkkeomi", 23, { mv: ["incinerate", "flamecharge", "smokescreen", "growl"] }],
         ["honmangul", 24, { mv: ["mysticalfire", "hex", "willowisp", "astonish"] }]] };
async function ongiEvent() {
  const P = World.player, O = act("ongi_f"), Gr = act("ongi_gr"), B = act("boreum_r3");
  if (!O || !Gr || !B) return;
  await emote(P, "excl", 24);
  await say("……탁, 탁, 탁.\f가마 쪽에서 누군가\n항아리를 두드리는 소리가 난다.");
  await walkPath(P, 15, 30); P.dir = "left";
  bgm("bondi");
  face(Gr, P); await emote(Gr, "excl", 24);
  await say("단원: 멈춰라, 꼬마!\f행수님이 봉인 항아리를\n굽고 계시는 중이다!");
  if (!G.flag("tr_" + R3_GRUNT.id)) { const r = await trainerBattle({ x: Gr.x, y: Gr.y, dir: Gr.dir, trainer: R3_GRUNT }, false); if (r !== "win") return; }
  bgm("bondi");
  await say("단원: 행, 행수님……!\n이 꼬마 보통이 아니에요!");
  face(O, P); await emote(O, "quest", 24);
  await say("???: 살살 해라.\f가마 불이 놀라면\n처음부터 다시 구워야 해.");
  await walkPath(O, 13, 30); face(O, P); face(P, O);
  await say("옹이: 나는 옹이.\n본디회의 마을 행수다.\f이 마당 항아리들,\n전부 내 손으로 빚었지.");
  // 보름이 남쪽 다리 쪽에서 달려옴
  B.hidden = false; B.x = 19; B.y = 36;
  await say(`???: ${G.name}~!`);
  await walkPath(B, 16, 31); face(B, O); await emote(B, "excl", 24);
  await say("보름: 저 사람이야!\f어젯밤 문학관 앞에서 찍던 혼망울,\n저 사람이 항아리에 넣어 갔어!");
  await say("옹이: 아, 그 푸른 불빛.\f밤마다 사람들이 쫓아다니고,\n불빛을 비추고, 사진을 찍고……\f그래서 쉬게 해 준 거다.\n이 봉인 항아리 속에서.");
  await say("옹이: 옹기는 숨 쉬는 그릇이라고들 하지.\f흙 사이 작은 숨구멍으로\n바람이 드나들거든.\f그 속에 든 건 쉽게 상하지 않아.\n김치도, 장도…… 남켓몬도.");
  await say("옹이: 우리 스승님 공방은\n작년에 문을 닫았다.\f옹기 쓰는 집이 줄었거든.\f좋은 건 다 그렇게\n닳아 없어지는 거야.\f……닳아 없어지느니,\n항아리 속에서 영원히!");
  await say("보름: 그건 쉬는 게 아니잖아요!\f혼망울은 둥실둥실 날아다닐 때가\n제일 예뻤단 말이에요!");
  await say("옹이: ……꼬마들이 뭘 알아.");
  const r = await trainerBattle({ x: O.x, y: O.y, dir: O.dir, trainer: ONGI1 }, false);
  if (r !== "win") return;
  bgm("bondi");
  await say("옹이: ……내 탓이다.\n불 조절을 못 했어.");
  await say("옹이가 항아리의 붉은 봉인을\n천천히 떼어 냈다……");
  sfx("ball_open"); await emote(B, "heart", 30);
  await say("푸른 불빛이 둥실 떠올라\n보름의 어깨 위를 맴돈다!");
  await say("보름: 혼망울아……!\n안 답답했어? 괜찮아?");
  face(O, P);
  await say("옹이: ……흥.\f기억해 둬, 꼬마.\n사람 곁에 있으면 닳는다.\f그릇도, 남켓몬도,\n……사람도.");
  await say("단원: 해, 행수님!\n같이 가요!");
  sfx("exit"); await fadeOut(10); O.hidden = true; Gr.hidden = true; await fadeIn(10);
  await say("(옹이는 덕과 들판 쪽으로\n사라졌다……)");
  World.noBgm = false; bgm("route");
  face(B, P); face(P, B);
  await say(`보름: ……고마워, ${G.name}.\f사실 엄청 무서웠어.\f그래도 혼망울이 갇혀 있는 게\n더 싫었어.`);
  await say("보름: 근데 있잖아.\n닳는 게 꼭 나쁜 걸까?\f내 운동화도 다 닳았는데,\n그만큼 많이 뛰어다녔다는 거잖아.");
  await say("보름: 이거 받아!\n밤에 남켓몬 잡을 때 좋대.");
  await getItem("dusk", 3);
  await say("보름: 나는 혼망울이랑 조금 더\n있다 갈게. 갈매마을에서 봐!");
  G.flag("ongi_done", true);
  zoneBgm();
}

// =====================================================================
// 2. 갈매마을: 라이벌 한결 4차전 (마을 남쪽 큰길)
// =====================================================================
// 한결의 스타팅은 늘 내 스타팅에 상성이 좋다 → 가장 센 기술(매지컬플레임·아쿠아커터)은 아직 안 씀. 져도 이야기는 이어짐
// bal_gym(셋, 상처약 2): 풀 Lv22 43%·23 60% / 불꽃 Lv21 73%·22 93% / 물 Lv21 80%·22 90% (라이벌 3차전 풀 Lv20 57%와 비슷한 결)
const RIVAL4_MV = { chorongsap: ["flamecharge", "ember", "scratch", "growl"], kkumuri: ["waterpulse", "aquajet", "mudslap", "raindance"],
  kkotmong: ["magicalleaf", "acid", "mudslap", "synthesis"] };
const rival4 = () => { const k = RIVAL_EVO[RIVAL_OF[G.starter] || "bulsap"] || "chorongsap";
  return { id: "rival4", cls: "라이벌", name: "한결", spr: "hangyeol", music: "rival", bgm: "trainer", base: 40, canLose: true,
    loseText: "한결: 거봐!\n덕과 아카데미는 내 홈그라운드야!",
    intro: "한결: 출장 가신 조박사님 대신\n너한테 보여 주지!",
    lose: "한결: 또……!\n이번엔 진짜 자신 있었는데!",
    team: [["darijak", 22, { mv: ["quickattack", "wingattack", "featherdance", "tailwind"] }],
           ["ttallanggong", 23, { mv: ["spark", "chargebeam", "thundershock", "screech"] }],
           [k, 25, { mv: RIVAL4_MV[k] }]] }; };
async function rivalGalmae() {
  const P = World.player, H = act("hangyeol_c4");
  if (!H) return;
  bgm("rival");
  await say(`???: 야, ${G.name}!\n늦었잖아!`);
  P.dir = "up";
  H.x = P.x; H.y = Math.max(P.y - 4, 22); H.hidden = false;
  await walkTo(H, P.x, P.y - 1); face(H, P);
  await emote(H, "excl", 26);
  await say("한결: 덕과 아카데미,\n진짜 오랜만이다.\f……근데 조박사님 배움터,\n또 출장 중이래!");
  await say("한결: 문에 '연구 출장 중'이라고\n붙어 있더라.\f이번엔 진짜 보여 드리려고 했는데.\n내가 얼마나 세졌는지.");
  const r = await trainerBattle({ x: H.x, y: H.y, dir: H.dir, trainer: rival4() }, false);
  bgm("rival");
  if (r !== "win") { await say("한결: ……근데 너도\n진짜 많이 늘었다."); await say("한결: 자, 쉬게 해 줘.\n쓰러진 채로 다니면 안 되잖아!");
    G.healAll(); await Audio2.jingle("jg_heal"); await say("남켓몬들이 기운을 되찾았다!"); }
  else await say("한결: ……알았어, 인정.\n너 진짜 세졌다.");
  await say("한결: 조박사님이 그러셨잖아.\f남켓몬을 '잘 키우는' 것보다\n'같이 크는' 게 더 어렵다고.\f처음엔 무슨 말인지 몰랐거든.\f……너랑 계속 붙다 보니까\n조금 알 것 같아.");
  await say("한결: 쳇, 이상한 말 했다.\n잊어버려!");
  await say("한결: 난 서쪽 4번도로로\n먼저 간다!\f……공사 중이라고?\n그럼 운동장에서 특훈이다!");
  await walkPath(H, 20, 12); H.hidden = true;
  G.flag("rival4_done", true);
  zoneBgm();
}

// =====================================================================
// 3. 덕과 아카데미(다시): 칠판 쪽지 · 화분 물 주기 · 출장 메모
// =====================================================================
async function waterPlant(k) {
  if (G.flag("cl2_" + k)) { await say("화분 흙이 촉촉하다.\n잎이 반짝반짝하다."); return; }
  await say("화분 흙이 바싹 말라 있다.\f교실 뒤 물뿌리개로\n물을 듬뿍 주었다!");
  G.flag("cl2_" + k, true);
  if (G.flag("cl2_a") && G.flag("cl2_b")) await say("……창가 화분 두 개가\n고개를 든 것 같다!");
}
async function dutyTalk() {
  const both = G.flag("cl2_a") && G.flag("cl2_b");
  if (G.flag("cl2_gift")) { await say("지아: 조박사님 출장 끝나면\n화분 얘기 꼭 해 드릴 거야!"); return; }
  if (!both) { await say("지아: 오늘 내가 당번인데……\f조박사님이 칠판에 쪽지 남기셨어.\n화분에 물 좀 주라고.\f창가 양쪽 끝에 하나씩 있어.\n같이 해 줄래?"); return; }
  await say("지아: 와, 벌써 다 줬어?\n고마워!\f조박사님이 도와준 사람\n주라고 하셨어!");
  await getItem("miracleseed", 1);
  await say("지아: 교실 화분 옆에 두셨던\n볍씨 주머니야.\f남켓몬에게 지니게 하면\n풀 기술이 세진대!");
  G.flag("cl2_gift", true);
}

// =====================================================================
// 지도에 붙이기
// =====================================================================
(function attachRoute3Galmae() {
  // ---- 쪽빛마을 북쪽: 혼불 어사패 뒤 라이벌 3차전이 끝나면 공사 끝 ----
  const JJ = MAPS.jjok;
  for (const w of JJ.npcs.filter(o => /^jj_worker/.test(o.id || ""))) w.show = () => !G.flag("rival3_done");
  const w1 = JJ.npcs.find(o => o.id === "jj_worker1");
  if (w1) w1.talk = "미안! 3번도로 다리를\n고치는 중이란다.\f갈매마을(덕과)로 가는 길이야.\n조박사님 배움터가 있는 마을이지.\f쪽빛 배움터에 다녀올 즈음이면\n다 고쳐 놓을게!";
  const ar = (JJ.areas || []).find(a => a.run === rivalJjok);
  if (ar) ar.run = async () => {
    await rivalJjok();
    const ws = ["jj_worker1", "jj_worker2"].map(act).filter(a => a && !a.hidden);
    if (!ws.length) return;
    await say("일꾼: 영차! 3번도로 다리\n다 고쳤다!\f이제 갈매마을까지\n걸어갈 수 있단다!");
    sfx("exit"); await fadeOut(8); ws.forEach(a => a.hidden = true); await fadeIn(8);
  };
  const bj = JJ.npcs.find(o => o.id === "boreum_jjok"); if (bj) bj.show = () => G.flag("dye_done") && !G.flag("ongi_done");
  JJ.warps = (JJ.warps || []).concat([[18, 19], [19, 19], [20, 20], [21, 20]].map(([x, tx]) => [x, 0, ["route3", tx, 55, "up", "edge"]]));

  // ---- 3번도로 ----
  const R3 = MAPDATA.route3;
  MAPS.route3 = {
    rows: R3.rows, stamps: R3.stamps, name: "3번도로",
    warps: [[18, 19], [19, 19], [20, 20], [21, 20]].map(([x, tx]) => [x, 55, ["jjok", tx, 0, "down", "edge"]])
      .concat([30, 31, 32, 33].map(x => [x, 0, ["galmae", x - 12, 39, "up", "edge"]])),
    zones: [["옹기 가마", 2, 24, 15, 36], ["3번도로", 0, 0, 55, 55]],
    zinfo: { "3번도로": { bgm: "route", enc: "3번도로", rate: 0.12, bg: "grass" }, "옹기 가마": { bgm: "route", enc: "3번도로", rate: 0.12, bg: "grass" } },
    signs: [
      [17, 52, "3번도로\n↑ 옹기 가마 · → 덕과 들판 · 갈매마을"],
      [22, 43, "돌다리\n개울을 건너면 덕과 들판"],
      [37, 21, "덕과 들판\n논두렁으로만 다녀 주세요!"],
      [34, 3, "↑ 갈매마을(덕과)\n↓ 쪽빛마을(사매)"],
    ],
    checks: [
      ...[4, 5, 6, 7, 8, 9, 10].map(x => [x, 28, "옹기 가마.\f흙으로 빚은 그릇을 불에 구워\n옹기를 만드는 긴 가마다."]),
      ...[[12, 25], [13, 25], [12, 26], [13, 26], [2, 32], [3, 32], [2, 33], [3, 33], [6, 31], [8, 31], [10, 33], [5, 34], [13, 34]].map(([x, y]) => [x, y, () => say(G.flag("ongi_done") ? "옹기 항아리.\f겉에 손가락으로 그린\n물결무늬가 있다." : "옹기 항아리.\f……뚜껑에 붉은 종이가\n붙어 있다.")]),
      ...[[28, 1], [28, 2], [35, 1], [35, 2]].map(([x, y]) => [x, y, "마을 어귀를 지키는 장승이다.\f'여기부터 덕과'라고\n말하는 것 같다."]),
      ...[[27, 13], [7, 19]].map(([x, y]) => [x, y, async () => { if (["저녁", "밤"].includes(timeOfDay())) await say("허수아비가 서 있다.\f……방금 고개를 돌린 것 같은데?"); else await say("밀짚모자를 쓴 허수아비가\n논을 지키고 서 있다."); }]),
    ],
    areas: [
      { x0: 2, y0: 29, x1: 37, y1: 32, cond: () => !G.flag("ongi_done"), run: ongiEvent },
    ],
    npcs: [
      // 이야기
      { id: "ongi_f", x: 8, y: 30, spr: "ongi", dir: "left", move: "fixed", show: () => !G.flag("ongi_done") },
      { id: "ongi_gr", x: 13, y: 31, spr: "bondi", dir: "right", move: "fixed", show: () => !G.flag("ongi_done") },
      { id: "boreum_r3", x: 19, y: 36, spr: "boreum", dir: "up", hidden: true, move: "fixed", show: () => !G.flag("ongi_done") },
      { id: "ongi_master", x: 11, y: 29, spr: "oldman", dir: "down", move: "look", show: () => G.flag("ongi_done"),
        talk: "할아버지: ……옹이 녀석이 다녀갔구나.\f내가 공방 문을 닫던 날,\n그 아이가 제일 서운해했지." },
      // 사람
      { x: 16, y: 39, spr: "oldman", dir: "down", move: "look", talk: "낚시꾼: 이 개울에는 송사리가 많단다.\f돌다리는 할아버지의 할아버지 때부터\n여기 놓여 있었지." },
      // 떨어진 물건
      { item: "superpotion", x: 3, y: 45 }, { item: "namket", n: 3, x: 52, y: 3 }, { item: "revive", x: 14, y: 35 }, { item: "superpotion", x: 50, y: 32 }, { item: "xdefend", x: 49, y: 47 },
      { item: "parlyzheal", x: 36, y: 27 }, { item: "tm40", x: 3, y: 24 },
      // 트레이너
      { x: 25, y: 44, spr: "kid_f", dir: "left", trainer: { id: "r3_soyul", cls: "꼬마 숙녀", name: "소율", spr: "kid_f", range: 3, base: 16, team: [["olchaengmi", 17], ["heosuni", 18]],
        intro: "돌다리 건너기 전에\n나랑 한 판!", lose: "퐁당! 물에 빠진 기분이야……", after: "개울물 소리를 듣고 있으면\n마음이 차분해져." } },
      { x: 12, y: 16, spr: "bugboy", dir: "right", trainer: { id: "r3_mingyu", cls: "벌레잡이", name: "민규", spr: "bugboy", range: 4, base: 16, team: [["nabichae", 18], ["kkulbeong", 17]],
        intro: "덕과 들판 나비는\n전부 내 친구야!", lose: "나비처럼 날아가 버렸다……", after: "고치배는 고치 속에서\n가만히 있는 것 같지만\f속에서는 날개를 만드느라\n엄청 바쁘대!" } },
      { x: 42, y: 17, spr: "kid_m", dir: "left", trainer: { id: "r3_taeho", cls: "꼬마", name: "태호", spr: "kid_m", range: 4, base: 16, team: [["ttallanggong", 18], ["jjaekcham", 18]],
        intro: "논두렁 끝까지 달리기……\n말고 승부다!", lose: "딸랑딸랑……\n졌다는 소리야.", after: "딸랑공은 전기를 모아 두었다가\n번쩍 하고 쏜대!" } },
    ],
  };

  // ---- 갈매마을 ----
  const GA = MAPDATA.galmae;
  const scare = async () => { if (["저녁", "밤"].includes(timeOfDay())) await say("허수아비가 서 있다.\f……방금 고개를 돌린 것 같은데?"); else await say("밀짚모자를 쓴 허수아비가\n논을 지키고 서 있다."); };
  MAPS.galmae = {
    rows: GA.rows, stamps: GA.stamps, name: "갈매마을",
    warps: [18, 19, 20, 21].map(x => [x, 39, ["route3", x + 12, 0, "down", "edge"]]),
    zones: [["갈매마을", 0, 0, 39, 39]],
    zinfo: { "갈매마을": { bgm: "galmae", enc: "갈매마을", rate: 0.12, bg: "grass" } },
    signs: [
      [17, 36, "갈매마을\n짙은 초록 들판의 마을 · 덕과"],
      [22, 12, "덕과 아카데미\n↑ 교문"],
      [3, 18, "← 4번도로(대산 방면)\n↑ 남켓몬센터"],
      [36, 9, "갈매 배움터\n지킴이 조박사 · 악 타입"],
    ],
    checks: [
      ...[31, 32, 33, 34, 35].map(x => [x, 7, "갈매 배움터.\f문에 쪽지가 붙어 있다.\n'연구 출장 중 — 지킴이 조박사'\f그 아래 작은 글씨.\n'어사패 일곱 개 모아서 와!'"]),
      ...[[9, 33], [16, 33]].map(([x, y]) => [x, y, "말뚝에 금색 띠가 감겨 있다.\f'금박재단 측량 말뚝\n— 함부로 뽑지 마시오'"]),
      ...[[5, 28], [5, 29]].map(([x, y]) => [x, y, scare]),
      ...[15, 16, 17, 18, 20, 21, 22, 23].map(x => [x, 7, "덕과 아카데미.\f창문 너머로 낯익은 교실이 보인다."]),
    ],
    areas: [
      { x0: 2, y0: 30, x1: 37, y1: 31, cond: () => G.flag("ongi_done") && !G.flag("rival4_done"), run: rivalGalmae },
    ],
    npcs: [
      // 이야기
      { id: "hangyeol_c4", x: 20, y: 9, spr: "hangyeol", dir: "down", hidden: true, move: "fixed", show: () => G.flag("ongi_done") && !G.flag("rival4_done") },
      { id: "hangyeol_yard", x: 26, y: 10, spr: "hangyeol", dir: "left", move: "look", show: () => G.flag("rival4_done"),
        talk: "한결: 4번도로 열리면\n바로 달려갈 거야!\f그때까지 운동장 열 바퀴 더!" },
      { id: "mrhwang", x: 16, y: 9, spr: "gl_mrhwang", dir: "down", move: "look", talk: async () => {
        if (!G.flag("hwang_met")) {
          await say(`교장 선생님: 오, 조 선생님 반의\n${G.name}! 이야기 많이 들었다.`);
          await say("교장 선생님: 조 선생님은 요즘\n출장이 잦아.\f어디로 가는지는……\n나도 다 묻지는 않는단다.");
          await say("교장 선생님: 어사패를 모으다 보면\n언젠가 오방고원에 닿을 게다.\f그때 보자꾸나.\n운동화 끈 단단히 묶고 오너라.");
          G.flag("hwang_met", true); return; }
        await say("교장 선생님: 나도 젊을 땐 운동장을\n날마다 스무 바퀴씩 돌았지.\f몸이 기억하는 건\n쉽게 잊히지 않는 법이다."); } },
      { id: "boreum_galmae", x: 23, y: 15, spr: "boreum", dir: "left", move: "look", show: () => G.flag("ongi_done"),
        talk: "보름: 혼망울이 자꾸\n내 어깨에 앉아. 히히.\f덕과 아카데미 다시 오니까\n기분 이상하다." },
      // 금박재단 요원 (논두렁 측량)
      { id: "agent1", x: 12, y: 33, spr: "agent", dir: "left", move: "fixed",
        talk: "요원: 아, 학생. 지금 측량 중입니다.\f금박재단은 이 들판을\n더 '쓸모 있게' 만들 계획이에요.\f걱정 마세요.\n'모두에게 복을' 드릴 거니까요." },
      { id: "agent2", x: 6, y: 27, spr: "agent", dir: "down", move: "fixed",
        talk: "요원: 서류상으로는\n아무 문제 없습니다.\f네? 논에 사는 남켓몬이요?\f……그건 서류에 없는\n항목이라서요." },
      // 사람
      { id: "galmae_farmer", x: 9, y: 30, spr: "man", dir: "left", move: "look",
        talk: "농부: 저 말뚝, 금박재단 사람들이\n박고 갔어.\f땅이야 서류로 사고판다지만\f이 흙이 몇 해를 묵어서\n이렇게 기름진지는\f서류에 안 적혀 있더라." },
      { x: 28, y: 21, spr: "woman", move: "wander", r: 1, talk: "아주머니: 우리 아들도\n덕과 아카데미를 나왔단다." },
      { x: 25, y: 23, spr: "oldman", dir: "left", move: "look", talk: "할아버지: 덕과는 남원의\n북쪽 관문이란다.\f국도 17호선이 마을을\n남북으로 곧게 지나가지.\f북쪽 임실 오수에서 내려오면\n덕과를 거쳐 남원에 닿는단다." },
      { x: 21, y: 13, spr: "student", move: "wander", r: 1, talk: "조박사님이 출장 가시면\n교장 선생님이 대신 들어오셔.\f그날은 체육 시간이\n두 배가 돼!" },
      { id: "gym8_kid", x: 32, y: 10, spr: "kid_m", dir: "up", move: "look", talk: "조박사님 또 출장이래.\f어사패 일곱 개 모아 온\n형, 누나만 상대해 주신대!\f나도 언젠가 꼭 도전할 거야!" },
      // 4번도로 공사
      { id: "ga_worker1", x: 2, y: 19, spr: "man", dir: "right", move: "fixed", talk: "미안! 4번도로(대산 방면)는\n아직 공사 중이란다.\f(플레이 버전은 여기까지예요!\n다음 이야기: 4번도로와 대산)" },
      { id: "ga_worker2", x: 2, y: 20, spr: "man", dir: "right", move: "fixed", talk: "조금만 기다려 주렴.\n금방 고칠게!" },
      // 떨어진 물건
      { item: "fullheal", x: 37, y: 2 }, { item: "moomoomilk", x: 2, y: 37 }, { item: "superpotion", x: 36, y: 33 },
    ],
  };

  // ---- 실내 ----
  const D = MAPDATA;
  MAPS.class2 = { rows: D.class_.rows, stamps: D.class_.stamps, indoor: true, name: "덕과 아카데미", floor: "floor_class", wall: "wall_class", win: "win_class", bgm: "academy", noPopup: true,
    exit: exitG("class2"),
    checks: [
      [5, 0, "칠판에 조박사님 글씨가 남아 있다.\f'얘들아, 선생님 좀 도와줄 사람~?\n교실 화분에 물 좀 주렴. — 조박사'"],
      [6, 0, "칠판에 조박사님 글씨가 남아 있다.\f'얘들아, 선생님 좀 도와줄 사람~?\n교실 화분에 물 좀 주렴. — 조박사'"],
      [7, 1, "칠판 구석에 '2학기 첫 단원:\n우리 고장 덕과'라고 적혀 있다."], [8, 1, "칠판 구석에 '2학기 첫 단원:\n우리 고장 덕과'라고 적혀 있다."],
      [10, 2, "교탁 위에 출장 서류가 있다.\f'출장지: 금……'\f……물 자국에 번져서\n뒷글자는 읽을 수 없다."],
      [11, 2, "교탁 위에 출장 서류가 있다.\f'출장지: 금……'\f……물 자국에 번져서\n뒷글자는 읽을 수 없다."],
      [0, 2, () => waterPlant("a")], [13, 2, () => waterPlant("b")],
      [5, 4, "스타팅 볼을 올려 두었던 탁자다.\f……여기서 처음 만났지."], [6, 4, "스타팅 볼을 올려 두었던 탁자다.\f……여기서 처음 만났지."], [7, 4, "스타팅 볼을 올려 두었던 탁자다.\f……여기서 처음 만났지."],
    ],
    npcs: [
      { id: "class2_duty", x: 9, y: 9, spr: "kid_f", dir: "up", move: "look", talk: dutyTalk },
      { x: 2, y: 7, spr: "kid_m", dir: "up", move: "look", talk: "선생님 책상 위 서류 봤어?\f'금' 다음 글자가 번져서\n안 보이더라.\f금강산? 금은보화?\n어디 가신 걸까?" },
    ] };
  MAPS.center_galmae = { ...MAPS.center, exit: exitG("center_galmae"),
    npcs: [MAPS.center.npcs.find(n => n.id === "nurse"),
      { x: 2, y: 6, spr: "woman", move: "look", talk: "악 타입은 에스퍼 기술을\n하나도 안 받는대.\f그 대신 격투·벌레·페어리에\n약하고!" },
      { x: 11, y: 5, spr: "oldman", move: "look", talk: "할아버지: 덕과 아카데미 종소리가\n여기까지 들린단다." }] };
  MAPS.mart_galmae = { ...MAPS.mart, name: "갈매 만물상", exit: exitG("mart_galmae"),
    npcs: [MAPS.mart.npcs.find(n => n.id === "clerk"), MAPS.mart.npcs.find(n => n.id === "clerk2"),
      { x: 7, y: 6, spr: "kid_f", move: "look", talk: "학교 끝나면 여기서\n엿가락 사 먹어!\f배틀 중에 먹으면\n남켓몬도 힘이 난대." }] };
  MAPS.house_d = { rows: D.house_a.rows, stamps: D.house_a.stamps, indoor: true, name: "한옥", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "galmae", noPopup: true, exit: exitG("house_d"),
    checks: [[0, 1, "자개장이 반짝반짝 빛난다."], [1, 1, "자개장이 반짝반짝 빛난다."], [6, 2, "병풍에 넓은 들판과\n작은 학교가 그려져 있다."], [7, 2, "병풍에 넓은 들판과\n작은 학교가 그려져 있다."]],
    npcs: [{ id: "house_d_gm", x: 2, y: 4, spr: "oldwoman", move: "look", talk: async () => {
      if (!G.flag("house_d_gift")) { await say("할머니: 덕과는 북쪽으로\n임실이랑 맞닿아 있단다.\f남원 사람, 임실 사람이\n장날마다 오가곤 했지."); await say("할머니: 먼 길 왔구나.\n보리차 한 잔 하고 가렴."); await getItem("sodapop", 2); G.flag("house_d_gift", true); return; }
      await say("할머니: 손주 녀석도 저 학교를\n다녔지. 벌써 다 컸어."); } }] };

  // ---- 타운맵 '지금 있는 곳' ----
  Object.assign(TOWN_ZONE, { "3번도로": "r3", "옹기 가마": "r3", "갈매마을": "galmae" });
})();
