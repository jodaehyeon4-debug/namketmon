// ===== v1.9 배움터마다 다른 기믹 (사용자: "체육관 디자인 및 기반시스템을 매 체육관마다 다르게, 실제 포켓몬 체육관처럼") =====
// 1 다홍(놀이터): OX 발판 — 문 앞 ○/× 발판을 밟아 대답, 틀리면 미끄럼틀로 쭈욱
// 2 쪽빛(아틀리에): 물감 발자국 — 쟁반을 밟아 발 색을 만들고(섞으면 새 색), 정답 색 발자국으로 아치 문에 대답
// 3 비색(요리 교실): 밀가루 미끄럼 + 레시피 순서 — 막힐 때까지 미끄러지는 바닥, 1.손 씻기 → 2.반죽 → 3.굽기 자리에 차례로 멈춰 섬
// 4 주홍(별 배움터): 별자리 발판 — 바닥의 별을 차례로 밟아 북두칠성·카시오페이아를 잇고, 북극성을 찾음
// 수업(오늘 있었던 일 · 남원 생태도감 · 타입 상성) 세 가지는 그대로, 기믹 안에서 나옴. 깃발 이름(gq·g2q·g3q·g4q)도 그대로
// chapter5.js 뒤, hearts.js 앞에 읽힘
"use strict";

// ---- 공통: 수업 하나(짝꿍이 정답 풀이, 틀리면 짝꿍과 배틀) → "ok" | "wrong"(배틀로 배움) | "lost" | "cancel"
async function gymLesson(Q, k, o = {}) {
  const K = act(k.id), P = World.player, nm = k.tr.name;
  if (o.board !== false) await say(Q.board);
  const v = o.answer !== undefined ? o.answer : await quizAsk(Q.q, Q.opts);
  if (v < 0) { await say("(조금 더 생각해 보고\n다시 풀어 보자.)"); return "cancel"; }
  if (K) { face(K, P); await emote(K, v === Q.a ? "heart" : "quest", 26); }
  const gift = Q.alt && G.has(Q.gift) ? Q.alt : Q.gift;
  if (v === Q.a) {
    await Audio2.jingle("jg_levelup");
    await say(`${nm}: 딩동댕! 정답이야!`);
    await say(`${nm}: ` + Q.good);
    await say(`${nm}: 정답 선물이야!`); await getItem(gift);
    return "ok";
  }
  sfx("flee_fail");
  await say(`${nm}: 땡! 아쉽다~\f괜찮아, 틀리면서 배우는 거야.\n배틀하면서 같이 알아보자!`);
  if (!G.flag("tr_" + k.tr.id)) {
    const r = await trainerBattle({ x: K.x, y: K.y, dir: K.dir, trainer: k.tr }, false);
    if (r !== "win") return "lost";
  }
  await say(`${nm}: 정답은 '${Q.opts[Q.a]}'였어!`);
  await say(`${nm}: ` + Q.good);
  if (Q.giftAlways && !G.has(Q.gift)) { await say(Q.giftAlways); await getItem(gift); }
  return "wrong";
}
async function gymOpenGate(id, msg) {
  const gt = act(id); sfx("door");
  if (gt) { for (let i = 0; i < 4; i++) { gt.hidden = !gt.hidden; await frames(5); } gt.hidden = true; }
  if (msg) await say(msg);
}
async function gymSlideBack(P, yb) {          // 미끄럼틀처럼 아래로 쭈욱
  P.dir = "down"; sfx("jump");
  while (P.y < yb) { if (!World.tryMove(P, "down", false)) break; P.sliding = true; P.speed = RUN_SPD; while (P.moving) await frames(1); }
  P.sliding = false; sfx("land");
}
async function gymKidTalkG(k, flagFn, leader) {   // 짝꿍: 끝나기 전엔 힌트, 끝나면 연습 배틀·뒷이야기
  const K = act(k.id);
  if (!flagFn()) { await say(k.hint); return; }
  if (!G.flag("tr_" + k.tr.id)) {
    if (await yes(`${k.tr.name}: 연습 배틀 한 판 할래?`)) await trainerBattle({ x: K.x, y: K.y, dir: K.dir, trainer: k.tr }, false);
    else await say(`${k.tr.name}: 좋아, ${leader} 선생님께 힘내!`);
    return;
  }
  await say(k.after);
}

// =====================================================================
// 1. 다홍 배움터 — OX 발판 놀이터
// =====================================================================
const OX1 = [
  { st: "춘향제 마당의 본디회는\n남켓몬이 축제 소리에 놀랄까 봐\f걱정해서 항아리에 넣었다고\n말했어요.", ans: "o" },
  { st: "진짜 제비는 솔방울을 엮어서\n처마 밑에 둥지를 지어요.", ans: "x" },
  { st: "노말 타입 기술은\n고스트 타입에게 하나도 안 통해요.", ans: "o" },
];
const OXY = [16, 11, 6], OXB = [19, 14, 9];       // 발판 줄 · 미끄럼틀 끝 줄
async function oxStep(n, c) {
  if (G.flag("gq" + n)) return;
  const D = OX1[n - 1], Q = QUIZ[n - 1], k = GYM_KIDS[n - 1], K = act(k.id), P = World.player, nm = k.tr.name;
  await say(`OX 문제 ${n}!\f` + D.st);
  await say(`${c === "o" ? "○" : "×"} 발판을 밟았다!`);
  if (K) { face(K, P); await emote(K, c === D.ans ? "heart" : "quest", 26); }
  if (c === D.ans) {
    await Audio2.jingle("jg_levelup");
    await say(`${nm}: 딩동댕! 정답이야!\n왜 그렇게 생각했어? ……역시!`);
    await say(`${nm}: ` + Q.good);
    await say(`${nm}: 정답 선물이야!`); await getItem(Q.gift);
    G.flag("gq" + n, true);
    await say(`'참 잘했어요!' 도장 소리가 났다.\f${c === "o" ? "○" : "×"} 문으로 지나가자!`);
    return;
  }
  sfx("flee_fail");
  await say("삐익!\f발판이 기울어지더니\n미끄럼틀처럼 쭈욱 미끄러졌다!");
  await gymSlideBack(P, OXB[n - 1]);
  await say(`${nm}: 땡! 아쉽다~\f괜찮아, 틀리면서 배우는 거야.`);
  if (!G.flag("tr_" + k.tr.id)) {
    await say(`${nm}: 나랑 배틀하면서\n같이 알아보자!`);
    const r = await trainerBattle({ x: K.x, y: K.y, dir: K.dir, trainer: k.tr }, false);
    if (r !== "win") return;
  }
  await say(`${nm}: 정답은 '${D.ans === "o" ? "○" : "×"}'야!`);
  await say(`${nm}: ` + Q.good);
  await say(`${nm}: 이제 ${D.ans === "o" ? "○" : "×"} 발판으로 가 봐!`);
}
async function oxBoard(n) {
  await say(`OX 문제판 ${n}\f` + OX1[n - 1].st);
  await say(G.flag("gq" + n) ? "판 구석에 '참 잘했어요!'\n도장이 꾹 찍혀 있다." : "맞으면 ○ 발판, 틀리면 × 발판!\f문 앞의 발판을 밟고 지나가요.");
}
async function gym1GuideTalk() {
  if (hasBadge(1)) return gymGuideTalk();
  await say("도우미: 어서 와요, 도전자님!\n여기는 다홍 배움터, 놀이터예요.\f울타리마다 ○ 문과 × 문이 있어요.\f문제판을 읽고, 맞으면 ○ 발판,\n틀리면 × 발판을 밟고 지나가요.\f잘못 고르면 미끄럼틀이 기다려요!\n그래도 짝꿍이 다시 알려 줄 거예요.\f찬향 선생님은 맨 위에 계세요!");
}
(function setupGym1() {
  const M = MAPS.gym;
  GYM_KIDS[0].x = 2; GYM_KIDS[0].y = 16; GYM_KIDS[0].dir = "right";
  GYM_KIDS[1].x = 2; GYM_KIDS[1].y = 14; GYM_KIDS[1].dir = "up";
  GYM_KIDS[2].x = 13; GYM_KIDS[2].y = 6; GYM_KIDS[2].dir = "left";
  GYM_KIDS[0].hint = "서아: 문제판을 읽고\n맞으면 ○, 틀리면 × 발판!\f오늘 춘향제 마당에서 있었던 일,\n기억나?";
  GYM_KIDS[1].hint = "지호: 이번 문제는 남원 생태도감!\f잡은 남켓몬은 도감에서 ▶를 누르면\n'남원 생태도감'을 볼 수 있어.";
  GYM_KIDS[2].hint = "하준: 마지막은 타입 상성!\f찬향 선생님 남켓몬은\n모두 노말 타입이야.";
  M.checks = M.checks.filter(c => typeof c[2] === "string" || false)
    .filter(c => !(c[1] === 7 && [1, 2, 3].includes(c[0])) && !(c[1] === 13 && [11, 12].includes(c[0])) && !(c[1] === 18 && [1, 2, 3].includes(c[0])))
    .concat([[6, 16], [7, 16], [6, 17], [7, 17]].map(([x, y]) => [x, y, () => oxBoard(1)]))
    .concat([[6, 12], [7, 12], [6, 13], [7, 13]].map(([x, y]) => [x, y, () => oxBoard(2)]))
    .concat([[6, 7], [7, 7], [6, 8], [7, 8]].map(([x, y]) => [x, y, () => oxBoard(3)]))
    .concat([[11, 8, "그네가 살랑살랑 흔들린다."], [12, 8, "그네가 살랑살랑 흔들린다."], [13, 8, "그네가 살랑살랑 흔들린다."],
             [12, 12, "미끄럼틀이다. 반짝반짝 닦여 있다."], [13, 12, "미끄럼틀이다. 반짝반짝 닦여 있다."],
             [0, 18, "모래놀이터에 모래성이 서 있다."], [1, 18, "모래놀이터에 모래성이 서 있다."], [2, 18, "모래놀이터에 모래성이 서 있다."],
             [1, 8, "시소다. 둘이 타야 재밌다."], [2, 8, "시소다. 둘이 타야 재밌다."], [3, 8, "시소다. 둘이 타야 재밌다."]]);
  M.triggers = [1, 2, 3].flatMap(n => [{ x: 4, y: OXY[n - 1], run: () => oxStep(n, "o") }, { x: 10, y: OXY[n - 1], run: () => oxStep(n, "x") }]);
  M.npcs = [
    M.npcs.find(o => o.id === "chanhyang"),
    { id: "guide", x: 12, y: 17, spr: "student", dir: "left", move: "look", talk: gym1GuideTalk },
    ...GYM_KIDS.map(k => ({ id: k.id, x: k.x, y: k.y, spr: k.spr, dir: k.dir, move: "fixed", talk: () => gymKidTalkG(k, () => G.flag("gq" + k.n), "찬향") })),
  ];
  M.over = (cx, cy) => {        // 맞힌 줄은 정답 발판에 별 스티커
    for (let n = 1; n <= 3; n++) if (G.flag("gq" + n)) { const x = (OX1[n - 1].ans === "o" ? 4 : 10) * 16 - cx, y = OXY[n - 1] * 16 - cy;
      rect(x + 11, y + 1, 4, 4, "#f8d040"); rect(x + 12, y, 2, 6, "#f8d040"); rect(x + 10, y + 2, 6, 2, "#f8d040"); }
  };
})();

// =====================================================================
// 2. 쪽빛 배움터 — 물감 발자국 문
// =====================================================================
const PAINT_HEX = { 빨강: "#e0403a", 노랑: "#f4c830", 파랑: "#2e5ac8", 초록: "#3aa848", 주황: "#f08a2a", 보라: "#8a4ac8", 갈색: "#7a5a3a" };
const PAINT_MIX = { "노랑+파랑": "초록", "빨강+노랑": "주황", "빨강+파랑": "보라" };
const PAINT_AT = { "1,16": "빨강", "13,17": "노랑", "4,16": "파랑", "2,12": "노랑", "5,12": "파랑", "8,14": "빨강", "13,7": "빨강", "9,6": "파랑", "7,8": "노랑",
  "12,19": "씻기", "1,14": "씻기", "13,9": "씻기" };
const ARCH2 = [{ colors: ["노랑", "파랑", "빨강"] }, { colors: ["초록", "주황", "빨강"] }, { colors: ["주황", "보라", "초록"] }];
let PAINT = null, PAINT_TRAIL = [];
function paintMix(a, b) {
  if (!a || a === b) return b;
  if (["초록", "주황", "보라", "갈색"].includes(a)) return "갈색";
  return PAINT_MIX[[a, b].sort((x, y) => ["빨강", "노랑", "파랑"].indexOf(x) - ["빨강", "노랑", "파랑"].indexOf(y)).join("+")] || "갈색";
}
async function paintStep(c) {
  if (c === "씻기") { if (!PAINT) return; PAINT = null; PAINT_TRAIL = []; sfx("heal_hp"); await say("세숫대야에 발을 첨벙!\n발이 깨끗해졌다."); return; }
  const was = PAINT, now = paintMix(PAINT, c);
  if (was === now) return;
  PAINT = now; sfx("grass");
  if (!was) await say(`찰박! 발에\n${c} 물감이 묻었다!`);
  else if (now === "갈색") await say(`${was}에 ${c}이(가) 또 섞여서\n탁한 갈색이 되었다…\f세숫대야에서 발을 씻고\n다시 해 보자.`);
  else await say(`${was} 위에 ${c}이(가) 섞여서…\f${now} 발자국이 되었다!`);
}
async function archTalk(n) {
  if (G.flag("g2q" + n)) return;
  const Q = QUIZ2[n - 1], A = ARCH2[n - 1], k = GYM2_KIDS[n - 1];
  await say(Q.board);
  await say("아치 문: " + Q.q);
  await say(A.colors.map((c, i) => `${c} 발자국 = ${Q.opts[i]}`).slice(0, 2).join("\n") + "\f" + `${A.colors[2]} 발자국 = ${Q.opts[2]}`);
  if (!PAINT) { await say("발자국 색깔로 대답하는 문이다.\f물감 쟁반을 밟고 다시 와 보자."); return; }
  const v = A.colors.indexOf(PAINT);
  if (v < 0) { await say(`지금 발자국은 ${PAINT}.\f${PAINT}은(는) 대답에 없는 색이다.\n세숫대야에서 씻고 다시 해 보자.`); return; }
  if (!await yes(`지금 발자국은 ${PAINT}.\n'${Q.opts[v]}'(으)로 대답할까?`)) return;
  const r = await gymLesson(Q, k, { board: false, answer: v });
  if (r === "lost" || r === "cancel") return;
  PAINT = null; PAINT_TRAIL = [];
  G.flag("g2q" + n, true);
  await gymOpenGate("g2gate" + n, "물감 아치 문이 활짝 열렸다!\f지나가면서 발에 묻은 물감이\n말끔히 지워졌다.");
}
function drawArch(colorsDone) {
  // v2.18 물감 아치 문(2배 촘촘): 32×32 기기 화소 격자(반 칸)로 둥근 나무 아치 + 도는 무지개 + 물음표 팻말
  return (x, y) => {
    const r = (a, b, w, h, c) => rect(x + a / 2, y + b / 2, w / 2, h / 2, c);
    const C = ["#e0403a", "#f08a2a", "#f4c830", "#3aa848", "#2e5ac8", "#8a4ac8"];
    r(1, 6, 30, 26, "#4a2a14"); r(3, 3, 26, 3, "#4a2a14"); r(6, 1, 20, 2, "#4a2a14");
    r(2, 7, 28, 24, "#9a6034"); r(4, 4, 24, 3, "#9a6034"); r(7, 2, 18, 2, "#b07440");
    r(3, 7, 2, 24, "#c08850"); r(5, 4, 3, 2, "#c08850"); r(27, 7, 2, 24, "#7a4422");
    r(6, 8, 20, 23, "#2a1c14"); r(8, 6, 16, 2, "#2a1c14");
    for (let i = 0; i < 6; i++) r(7, 9 + i * 4 - (i ? 0 : 0), 18, i === 5 ? 3 : 4, C[(i + (FRAME >> 4)) % 6]);
    r(9, 7, 14, 2, C[(5 + (FRAME >> 4)) % 6]);
    r(11, 11, 10, 13, "#3a2a20"); r(12, 12, 8, 11, "#fff8e0"); r(12, 21, 8, 2, "#e8dcc0");
    Font.draw(g, "?", x + 8, y + 5.5, { font: "g9", align: "center", col: "#3a2a20", sh: null });
    r(0, 31, 32, 1, "rgba(0,0,0,0.25)");
  };
}
async function gym2GuideTalk2() {
  if (hasBadge(2)) return gym2GuideTalk();
  await say("도우미: 어서 와요! 여기는 쪽빛 배움터,\n숲속 아틀리에예요.\f울타리마다 물감 아치 문이 있어요.\n아치는 발자국 색깔로 대답을 받아요.\f물감 쟁반을 밟으면 발에 물감이 묻고,\n두 가지를 밟으면 색이 섞여요.\f너무 섞여 탁해지면\n세숫대야에서 발을 씻어요!");
}
(function setupGym2() {
  const M = MAPS.gym2, D = MAPDATA.gym2;
  GYM2_KIDS[0].x = 11; GYM2_KIDS[0].y = 18; GYM2_KIDS[0].dir = "left";
  GYM2_KIDS[1].x = 13; GYM2_KIDS[1].y = 13; GYM2_KIDS[1].dir = "left";
  GYM2_KIDS[2].x = 3; GYM2_KIDS[2].y = 9; GYM2_KIDS[2].dir = "up";
  GYM2_KIDS[0].hint = "하윤: 아치 문은 발자국 색깔로\n대답하는 문이야!\f쟁반을 밟아서 발에 물감을 묻혀 봐.\n미영 선생님이 쪽빛 얘기 하셨지?";
  GYM2_KIDS[1].hint = "시우: 초록 물감은 없지?\f노랑을 밟고 파랑을 밟으면\n두 색이 섞여서 초록이 돼!\f빨강까지 밟으면 탁해지니까 조심!";
  GYM2_KIDS[2].hint = "은채: 보라는 빨강이랑 파랑!\f주황은 빨강이랑 노랑,\n초록은 노랑이랑 파랑이야.";
  const keep = c => typeof c[2] === "string";
  M.checks = (M.checks || []).filter(keep)
    .concat([[8, 16], [9, 16], [8, 17], [9, 17]].map(([x, y]) => [x, y, () => archBoard(1)]))
    .concat([[12, 11], [13, 11], [12, 12], [13, 12]].map(([x, y]) => [x, y, () => archBoard(2)]))
    .concat([[1, 7], [2, 7], [1, 8], [2, 8]].map(([x, y]) => [x, y, () => archBoard(3)]));
  M.triggers = Object.entries(PAINT_AT).map(([k, c]) => { const [x, y] = k.split(",").map(Number); return { x, y, run: () => paintStep(c) }; });
  M.onLoad = () => { PAINT = null; PAINT_TRAIL = []; };
  M.onStep = P => { if (PAINT) { PAINT_TRAIL.push({ x: P.x, y: P.y, c: PAINT, d: P.dir }); if (PAINT_TRAIL.length > 10) PAINT_TRAIL.shift(); } };
  M.under = (cx, cy) => {
    PAINT_TRAIL.forEach((t, i) => { if (t.x === World.player.x && t.y === World.player.y) return; const x = t.x * 16 - cx, y = t.y * 16 - cy, h = PAINT_HEX[t.c];
      g.globalAlpha = 0.35 + 0.06 * i; const side = (i & 1) ? 9 : 4; rect(x + side, y + 8, 3, 4, h); rect(x + side, y + 6, 3, 1, h); g.globalAlpha = 1; });
    if (PAINT) { const P = World.player; rect(P.px - cx + 3, P.py - cy + 13, 10, 3, PAINT_HEX[PAINT]); }
  };
  M.over = () => {
    const t = PAINT ? `발자국: ${PAINT}` : "발자국: 없음", w = Font.width(t, "g9") + 22;
    rect(SW - w - 4, 4, w, 15, "rgba(30,30,40,.78)"); rect(SW - w + 1, 7, 9, 9, PAINT ? PAINT_HEX[PAINT] : "#c8c8c8");
    Font.draw(g, t, SW - 8, 5, { font: "g9", align: "right", col: "#fff", sh: null });
  };
  M.npcs = [
    M.npcs.find(o => o.id === "miyeong"),
    { id: "guide2", x: 10, y: 18, spr: "student", dir: "left", move: "look", talk: gym2GuideTalk2 },
    ...GYM2_KIDS.map(k => ({ id: k.id, x: k.x, y: k.y, spr: k.spr, dir: k.dir, move: "fixed", talk: () => gymKidTalkG(k, () => G.flag("g2q" + k.n), "미영") })),
    ...D.gates.map(([x, y], i) => ({ id: "g2gate" + (i + 1), x, y, special: drawArch(), move: "fixed", show: () => !G.flag("g2q" + (i + 1)), talk: () => archTalk(i + 1) })),
  ].filter(Boolean);
})();
async function archBoard(n) {
  const Q = QUIZ2[n - 1], A = ARCH2[n - 1];
  if (G.flag("g2q" + n)) { await say("수업판 구석에 작은 꽃 그림이\n'참 잘했어요' 도장 대신 그려져 있다."); return; }
  await say(Q.board); await say("문제: " + Q.q);
  await say(A.colors.map((c, i) => `${c} 발자국 = ${Q.opts[i]}`).slice(0, 2).join("\n") + "\f" + `${A.colors[2]} 발자국 = ${Q.opts[2]}`);
}

// =====================================================================
// 3. 비색 배움터 — 밀가루 미끄럼 + 레시피 순서
// =====================================================================
const RECIPE = ["1.손 씻기", "2.반죽하기", "3.굽기"];
const RECIPE_IN = [
  "1.손 씻기 자리에 멈춰 섰다!\f요리하기 전에는\n손부터 뽀득뽀득 씻기.\f개수대 옆에 수업 카드가 있다.",
  "2.반죽하기 자리에 멈춰 섰다!\f밀가루에 물을 넣고\n조물조물 반죽.\f반죽 판 옆에 수업 카드가 있다.",
  "3.굽기 자리에 멈춰 섰다!\f화덕이 따끈따끈하다.\f화덕 옆에 수업 카드가 있다.",
];
async function stationStep(n) {
  if (G.flag("g3q" + n)) return;
  const req = [1, 2, 3].find(i => !G.flag("g3q" + i));
  if (n !== req) { sfx("flee_fail"); await say(`레시피 카드: '${RECIPE[req - 1]}'부터!\f순서대로 해야\n맛있는 빵이 돼요.`); return; }
  await say(RECIPE_IN[n - 1]);
  const r = await gymLesson(QUIZ3[n - 1], GYM3_KIDS[n - 1]);
  if (r === "lost" || r === "cancel") return;
  G.flag("g3q" + n, true);
  if (n < 3) await say(`레시피 '${RECIPE[n - 1]}' 끝!\f다음은 '${RECIPE[n]}' 자리다.`);
  else await gymOpenGate("g3gate1", "빵이 노릇노릇 구워졌다!\f화덕 옆 문이 활짝 열렸다!");
}
async function gym3GuideTalk2() {
  if (hasBadge(3)) return gym3GuideTalk();
  await say("도우미: 어서 와요! 여기는 비색 배움터,\n요리 교실이에요.\f하얀 밀가루 바닥에서는\n뭔가에 막힐 때까지 미끄러져요!\f레시피 순서대로\n1.손 씻기 2.반죽하기 3.굽기\f자리에 멈춰 서면\n수현 선생님께 가는 문이 열려요.\f미끄러지다 길을 잃으면\n아래 바닥으로 내려와서 다시!");
}
(function setupGym3() {
  const M = MAPS.gym3;
  M.slideFloor = "floor_flour";
  GYM3_KIDS[0].x = 2; GYM3_KIDS[0].y = 17; GYM3_KIDS[0].dir = "right";
  GYM3_KIDS[1].x = 11; GYM3_KIDS[1].y = 18; GYM3_KIDS[1].dir = "up";
  GYM3_KIDS[2].x = 4; GYM3_KIDS[2].y = 18; GYM3_KIDS[2].dir = "up";
  GYM3_KIDS[0].hint = "다인: 밀가루 바닥은 쭈욱 미끄러져!\f1.손 씻기 자리는 왼쪽에 있어.\n포대에 부딪히면 멈추니까 잘 봐.";
  GYM3_KIDS[1].hint = "유찬: 2.반죽 자리는 오른쪽!\f벽 끝까지 미끄러졌다가\n아래로 내려와서 다시 올라가 봐.";
  GYM3_KIDS[2].hint = "소은: 3.굽기는 화덕 앞!\f화덕에 부딪히면 멈춘대.\n그다음 옆으로 한 칸!";
  M.checks = [
    ...[5, 6, 7, 8].map(x => [x, 1, "칠판 메뉴판: '오늘의 수업 — 남켓몬 빵 굽기'\f'레시피: 1.손 씻기 2.반죽하기 3.굽기'"]),
    ...[[11, 4], [12, 4]].map(([x, y]) => [x, y, "벽돌 화덕이다. 따끈따끈하다."]),
    ...[[0, 2], [1, 2], [13, 2], [14, 2], [0, 18], [1, 18], [13, 18], [14, 18]].map(([x, y]) => [x, y, "빵 진열장에 남켓몬 모양 빵이\n가지런히 놓여 있다."]),
    ...[[0, 9], [7, 13], [8, 10], [8, 11], [10, 6], [13, 6]].map(([x, y]) => [x, y, "밀가루 포대다.\n부딪히면 미끄러지다 멈춘다."]),
    [3, 9, "반죽용 조리대다."], [4, 9, "반죽용 조리대다."],
  ];
  M.triggers = [[1, 12, 1], [13, 9, 2], [11, 6, 3]].map(([x, y, n]) => ({ x, y, run: () => stationStep(n) }));
  M.over = () => {
    const t = "레시피 " + [1, 2, 3].map(i => G.flag("g3q" + i) ? "●" : "○").join("");
    const w = Font.width(t, "g9") + 12; rect(SW - w - 4, 4, w, 15, "rgba(30,30,40,.78)"); Font.draw(g, t, SW - 10, 5, { font: "g9", align: "right", col: "#fff", sh: null });
  };
  M.npcs = [
    M.npcs.find(o => o.id === "suhyeon"),
    { id: "guide3", x: 10, y: 19, spr: "student", dir: "up", move: "look", talk: gym3GuideTalk2 },
    ...GYM3_KIDS.map(k => ({ id: k.id, x: k.x, y: k.y, spr: k.spr, dir: k.dir, move: "fixed", talk: () => gymKidTalkG(k, () => G.flag("g3q" + k.n), "수현") })),
    { id: "g3gate1", x: 7, y: 5, special: gateDrawer("gate_kitchen"), move: "fixed", show: () => !G.flag("g3q3"),
      talk: () => say("화덕 문이 닫혀 있다.\f레시피 1.2.3.을 다 마치면\n열린다고 적혀 있다.") },
  ].filter(Boolean);
})();

// =====================================================================
// 4. 주홍 배움터 — 별자리 발판
// =====================================================================
const STARS4 = [
  { name: "북두칠성", stars: [[2, 16], [2, 18], [5, 18], [5, 16], [8, 17], [10, 17], [12, 16]], nm: ["두베", "메라크", "페크다", "메그레즈", "알리오트", "미자르", "알카이드"],
    board: "별자리판: 북두칠성\f국자 모양 일곱 별이에요.\n국자 끝 '두베'에서 시작해\f국자 바닥 → 손잡이 끝 '알카이드'까지\n차례로 밟아 이어요." },
  { name: "카시오페이아", stars: [[1, 11], [3, 13], [5, 12], [7, 13], [9, 11]], nm: ["카프", "시라", "감마", "루크바", "세긴"],
    board: "별자리판: 카시오페이아\fW 모양 다섯 별이에요.\n왼쪽 위 별부터 오른쪽 위 별까지\f위·아래·위·아래·위로\n차례로 밟아 이어요." },
  { name: "북극성", stars: [[2, 8], [4, 8], [14, 8]], nm: ["메라크", "두베", "북극성"], decoy: [[8, 6], [10, 8], [12, 7]],
    board: "별자리판: 북극성 찾기\f북두칠성 국자 끝 두 별,\n메라크와 두베를 이어 봐요.\f그 거리를 다섯 번 더 가면\n북극성이 있어요!" },
];
let STAR_K = [0, 0, 2];        // 칸마다 이어 밟은 별 수(셋째 칸은 메라크·두베가 처음부터 빛남)
async function starStep(sec, i) {
  const S = STARS4[sec - 1], F = "g4s" + sec;
  if (G.flag(F)) return;
  if (sec === 3) {
    if (i < 2) return;
    sfx("excl"); STAR_K[2] = 3; G.flag(F, true);
    await say("별 하나가 환하게 빛났다!\f메라크 → 두베 거리의 다섯 배……\n여기가 북극성이다!");
    return starDone(sec);
  }
  if (i === STAR_K[sec - 1]) {
    STAR_K[sec - 1]++; sfx("cursor");
    if (STAR_K[sec - 1] === S.stars.length) { G.flag(F, true); await Audio2.jingle("jg_levelup"); await say(`별이 하나로 이어졌다!\f${S.name}이(가) 바닥에서 반짝인다!`); return starDone(sec); }
    return;
  }
  if (STAR_K[sec - 1] === 0) { if (i !== 0) await say(`이 별은 '${S.nm[i]}'.\f별자리판을 보면\n어디서 시작하는지 알 수 있다.`); return; }
  sfx("flee_fail"); STAR_K[sec - 1] = 0;
  await say(`이 별은 '${S.nm[i]}'.\f순서가 엉켜서\n별빛이 흩어졌다…\f처음 별 '${S.nm[0]}'부터 다시!`);
}
async function decoyStep() {
  if (G.flag("g4s3")) return;
  sfx("flee_fail");
  await say("반짝… 하지만 이 별은\n북극성이 아니다.\f국자 끝 메라크 → 두베 거리를\n다섯 번 이어 가 보자.");
}
async function starDone(sec) {
  const k = GYM4_KIDS[sec - 1], K = act(k.id);
  if (K) { face(K, World.player); await emote(K, "heart", 26); }
  return starLesson(sec);
}
async function starLesson(sec) {
  if (G.flag("g4q" + sec)) return;
  const r = await gymLesson(QUIZ4[sec - 1], GYM4_KIDS[sec - 1]);
  if (r === "lost" || r === "cancel") return;
  G.flag("g4q" + sec, true);
  await gymOpenGate("g4gate" + sec, "별빛 난간 문이 활짝 열렸다!");
}
async function starBoard(sec) {
  const S = STARS4[sec - 1];
  const ov = new Overlay(() => { frame(40, 4, 176, 108); rect(46, 10, 164, 96, "#1e2648");
    const xs = S.stars.map(s => s[0]), ys = S.stars.map(s => s[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), sx = 150 / Math.max(1, Math.max(...xs) - x0), sy = 70 / Math.max(1, Math.max(...ys) - y0 || 1);
    const P = S.stars.map(([x, y]) => [52 + (x - x0) * Math.min(sx, 22), 22 + (y - y0) * Math.min(sy, 30)]);
    g.strokeStyle = "#8aa8ff"; g.lineWidth = 1; g.beginPath(); P.forEach(([x, y], i) => i ? g.lineTo(x + 3, y + 3) : g.moveTo(x + 3, y + 3)); g.stroke();
    P.forEach(([x, y], i) => { rect(x, y, 6, 6, i === P.length - 1 && sec === 3 ? "#ffe060" : "#f8f0c0"); Font.draw(g, String(i + 1), x + 3, y + 7, { font: "g7", align: "center", col: "#c8d4ff", sh: null }); });
    Font.draw(g, S.name, 128, 92, { align: "center", col: "#fff", sh: null, font: "g9" }); });
  Scenes.push(ov);
  try { await say(S.board); if (G.flag("g4s" + sec) && !G.flag("g4q" + sec)) { Scenes.pop(ov); return starLesson(sec); } } finally { if (Scenes.has(ov)) Scenes.pop(ov); }
}
function drawStar(x, y, lit, gold) {
  const c = gold ? "#ffe060" : lit ? "#fff4b0" : "#8494c8";
  if (lit) { g.globalAlpha = 0.25 + 0.1 * ((FRAME >> 4) & 1); rect(x + 3, y + 3, 10, 10, gold ? "#ffd040" : "#fff0a0"); g.globalAlpha = 1; }
  rect(x + 7, y + 3, 2, 10, c); rect(x + 3, y + 7, 10, 2, c); rect(x + 6, y + 6, 4, 4, c);
  if (lit) { rect(x + 7, y + 7, 2, 2, "#ffffff"); }
}
async function gym4GuideTalk2() {
  if (hasBadge(4)) return gym4GuideTalk();
  await say("도우미: 어서 와요! 여기는 주홍 배움터,\n지붕을 연 별 배움터예요.\f바닥의 별을 별자리 순서대로 밟으면\n별자리가 이어져요.\f별자리판에서 순서를 보고 오세요.\n순서가 엉키면 처음부터!\f별자리가 이어지면\n천문반 짝꿍이 수업을 해 줘요.");
}
(function setupGym4() {
  const M = MAPS.gym4, D = MAPDATA.gym4;
  GYM4_KIDS[0].x = 10; GYM4_KIDS[0].y = 19; GYM4_KIDS[0].dir = "up";
  GYM4_KIDS[1].x = 13; GYM4_KIDS[1].y = 13; GYM4_KIDS[1].dir = "left";
  GYM4_KIDS[2].x = 8; GYM4_KIDS[2].y = 9; GYM4_KIDS[2].dir = "up";
  GYM4_KIDS[0].hint = "별이: 바닥에 별이 일곱 개 있지?\f오른쪽 아래 별자리판에서\n순서를 보고 차례로 밟아 봐!";
  GYM4_KIDS[1].hint = "한울: 카시오페이아는 W 모양!\f위·아래·위·아래·위.\n왼쪽 끝 별부터야.";
  GYM4_KIDS[2].hint = "은하: 북극성은 길잡이 별이야.\f메라크에서 두베까지 거리를\n다섯 번 더 가면 있어!";
  for (const k of GYM4_KIDS) k.hint2 = k.hint;
  M.checks = (M.checks || []).filter(c => typeof c[2] === "string" && !(c[1] === 1 && [1, 2, 3, 11, 12, 13].includes(c[0]) && false))
    .filter(c => !([[4, 16], [5, 16], [4, 17], [5, 17], [1, 11], [2, 11], [1, 12], [2, 12], [12, 6], [13, 6], [12, 7], [13, 7]].some(([x, y]) => x === c[0] && y === c[1])))
    .concat([[12, 18], [13, 18], [12, 19], [13, 19]].map(([x, y]) => [x, y, () => starBoard(1)]))
    .concat([[11, 11], [12, 11], [11, 12], [12, 12]].map(([x, y]) => [x, y, () => starBoard(2)]))
    .concat([[0, 6], [1, 6], [0, 7], [1, 7]].map(([x, y]) => [x, y, () => starBoard(3)]));
  M.triggers = STARS4.flatMap((S, si) => S.stars.map(([x, y], i) => ({ x, y, run: () => starStep(si + 1, i) })))
    .concat(STARS4[2].decoy.map(([x, y]) => ({ x, y, run: decoyStep })));
  M.onLoad = () => { STAR_K = [0, 0, 2]; };
  M.under = (cx, cy) => {
    STARS4.forEach((S, si) => {
      const done = G.flag("g4s" + (si + 1)), k = done ? S.stars.length : STAR_K[si];
      if (k > 1) { g.strokeStyle = done ? "#fff0a0" : "#c8d8ff"; g.lineWidth = 1; g.beginPath();
        S.stars.slice(0, k).forEach(([x, y], i) => { const px = x * 16 - cx + 8, py = y * 16 - cy + 8; i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.stroke(); }
      S.stars.forEach(([x, y], i) => drawStar(x * 16 - cx, y * 16 - cy, i < k, si === 2 && i === 2 && done));
      if (S.decoy) S.decoy.forEach(([x, y]) => drawStar(x * 16 - cx, y * 16 - cy, false, false));
    });
  };
  M.npcs = [
    M.npcs.find(o => o.id === "sinha"),
    { id: "guide4", x: 9, y: 18, spr: "student", dir: "left", move: "look", talk: gym4GuideTalk2 },
    ...GYM4_KIDS.map(k => ({ id: k.id, x: k.x, y: k.y, spr: k.spr, dir: k.dir, move: "fixed",
      talk: () => G.flag("g4s" + k.n) && !G.flag("g4q" + k.n) ? starLesson(k.n) : gymKidTalkG(k, () => G.flag("g4q" + k.n), "신하") })),
    ...D.gates.map(([x, y], i) => ({ id: "g4gate" + (i + 1), x, y, special: gateDrawer("gate_star"), move: "fixed", show: () => !G.flag("g4q" + (i + 1)),
      talk: () => say(G.flag("g4s" + (i + 1)) ? "별빛 난간 문이다.\f짝꿍의 수업을 마치면 열린다." : "별빛 난간 문이 닫혀 있다.\f바닥의 별자리를 이으면\n열린다고 적혀 있다.") })),
  ].filter(Boolean);
})();
