// ===== v2.33 챔피언로드: 17번도로(홍살문 어사패 관문) · 만행산(숲길 → 바위굴 → 천황봉 · 라이벌 한결 9차전) · 오방고원 · 리그 전당 1층 =====
// 방향성 v1: 출두 → 오방고원 '덕과 아카데미 리그'(졸업 시험) → 챔피언 = 본편 엔딩. 이번은 리그 앞 길까지(리그 방은 v2.34)
// 타운맵(확정): 17번도로 '보절 들판에서 만행산을 넘어 오방고원으로 가는 챔피언로드 입구' Lv50–55 ·
//   만행산 '보절과 산동에 걸쳐 있는 숲과 바위 능선의 산 · 숲과 동굴을 지나 오방고원에 닿아요' · '요천과 오수천의 물길이 갈라지는 곳 · 꼭대기 천황봉(약 910m)' ·
//   오방고원 '오방색 = 동 파랑(나무)·남 빨강(불)·서 하양(쇠)·북 검정(물)·가운데 노랑(흙)'
// 실제 포켓몬처럼 묘사(뱃지를 하나씩 확인하는 문 · 챔피언로드 동굴과 괴력 바위·누름판 · 리그 앞 고원과 로비 — 구조만), 닌텐도 그림은 베끼지 않음
// 홍살문 = 관청·능·향교 앞에 세우던 붉은 문(일반 상식) — 여기서는 '어사패를 보이고 지나가는 문'으로 씀
// 들어가는 때: 출두 끝(chuldu_done) + 어사패 여덟. v2.36 미색 배움터가 열려 window.GYM7_READY = true(chapter27.js) — 그 전에는 일곱(1~6·8)이었음(미결정 D19 해결)
// 오방담(오방색 다섯 매듭 — 도감 '어떤 빛의 기운을 만나느냐에 따라 모습이 바뀌어요') → 오방기 앞에서 그 빛의 담으로 바뀜
// chapter23.js 뒤, pad.js 앞에 읽힘
"use strict";
window.CHAMPROAD_READY = true;

const leagueBadges = () => [1, 2, 3, 4, 5, 6, 7, 8].filter(n => n !== 7 || window.GYM7_READY);
const leagueOK = () => G.flag("chuldu_done") && leagueBadges().every(hasBadge);

// ---- 기술머신(챔피언로드 물건) ----
(function tm233() {
  const TM = {
    tm80: ["rockslide", "스톤샤워를 가르쳐요. 큰 바위를 떨어뜨려 공격하고 가끔 상대를 풀죽게 하는 바위 타입 기술이에요.", ["바위", "땅", "격투", "노말", "강철", "드래곤", "불꽃"]],
    tm82: ["dragonclaw", "드래곤클로를 가르쳐요. 날카로운 발톱으로 할퀴는 드래곤 타입 기술이에요.", ["드래곤", "땅", "불꽃", "물", "악", "노말"]],
  };
  for (const [id, [mv, d, types]] of Object.entries(TM)) if (MV[mv] && !ITEMS[id]) ITEMS[id] = { n: "기술머신" + id.slice(2), p: "tm", price: 3000, nobuy: 1, tm: mv, d, ic: "tm", tmTypes: types };
})();
if (typeof HIDDEN !== "undefined") {
  HIDDEN.route17 = [[3, 31, "maxrevive"], [36, 6, "fullrestore"], [12, 44 - 2, "ppup" in ITEMS ? "ppup" : "maxelixir"]];
  HIDDEN.manhaeng = [[4, 45, "fullrestore"], [44, 26, "maxrevive"], [30, 3, "maxelixir"]];
  HIDDEN.manhaeng_cave = [[3, 9, "maxrevive"], [27, 13, "fullrestore"]];
}
(function fixLv233() { for (const r of DATA.town.routes || []) if (r.no === 17) r.lv = "50~55"; })();

// =====================================================================
// 1. 17번도로 홍살문 — 어사패 확인
// =====================================================================
async function r17Gate() {
  const P = World.player, A = act("r17_guard_l"), B = act("r17_guard_r");
  if (A) face(A, P); if (B) face(B, P);
  if (!G.flag("chuldu_done")) {
    await say("문지기: 멈춰 주세요!\f이 홍살문 너머는 만행산,\n그 너머는 오방고원 리그예요.");
    await say("문지기: 지금 남원에\n큰일이 벌어지고 있다고 해서\f리그가 잠시 문을 닫았어요.\n일이 정리되면 다시 열려요.");
    await walk(P, "down"); return;
  }
  await say("문지기: 멈춰 주세요!\f여기는 오방고원 리그로 가는 길,\n17번도로 홍살문이에요.");
  await say(`문지기: 리그에 도전하려면\n어사패 ${leagueBadges().length}개가 필요해요.\f하나씩 보여 주시겠어요?`);
  for (const n of leagueBadges()) {
    if (!hasBadge(n)) {
      sfx("bump");
      await say(`……${BADGE_N[n - 1]} 어사패가 없네요.`);
      if (n === 7) await say("문지기: 미색마을 미색 배움터가\n문을 열었대요.\f지킴이 희주 선생님을\n찾아가 보세요!");   // v2.36 예전 저장(어사패 일곱으로 통과하던 때)도 길을 알게
      await say("문지기: 어사패를 모두 모으고\n다시 와 주세요.\f마을마다 믿어 준 표시예요.\n하나도 빠뜨릴 수 없죠.");
      await walk(P, "down"); return;
    }
    sfx("select");
    await say(`${BADGE_N[n - 1]} 어사패…… 확인!`);
  }
  if (!window.GYM7_READY) await say("문지기: 미색 배움터는\n수업 준비 중이래요.\f그 자리는 비워 둘게요.");
  await Audio2.jingle("jg_keyitem");
  await say(`문지기: 좋아요!\n어사패 ${leagueBadges().length}개 모두 확인했어요.`);
  await say("문지기: 이 문을 지나면 만행산,\n숲과 바위굴을 지나야 해요.\f리그에 가려는 트레이너들이\n마지막으로 실력을 겨루는 길이에요.\f……마을들이 믿어 준 만큼,\n힘내세요!");
  G.flag("r17_gate", true);
}

// =====================================================================
// 2. 만행산 바위굴 — 괴력 바위 · 누름판 · 무너진 돌무더기
// =====================================================================
const MH = { push: false };
const mhDev = () => MAPDATA.manhaeng_cave.dev;
function mhOnPlate() { const B = act("mh_boulder"), [px, py] = mhDev().plate; return B && B.x === px && B.y === py; }
async function mhPush(B, d) {
  const P = World.player;
  if (!MH.push) {
    await say("커다랗고 둥근 바위다.\f남켓몬의 힘을 빌리면\n밀 수 있을 것 같다.");
    const lead = G.party.find(m => m.hp > 0);
    if (!lead) return;
    if ((await ask(`${J(mname(lead), "과")} 함께\n바위를 밀까?`, ["민다", "그만둔다"])) !== 0) return;
    MH.push = true;
    try { Audio2.cry(lead.k); } catch (e) {}
    await say(`${J(mname(lead), "이")} 힘을 냈다!\f이제 바위를 밀 수 있다.`);
  }
  const [dx, dy] = DIRS[d];
  if (World.solidAt(B.x + dx, B.y + dy, B) || (World.M.beh[B.y + dy] && World.M.beh[B.y + dy][B.x + dx] === "mat")) { sfx("bump"); return; }
  sfx("jump");
  B.speed = 1;
  await walk(B, d);
  if (mhOnPlate() && !G.flag("mh_plate")) {
    G.flag("mh_plate", true);
    sfx("chime");
    await frames(12);
    await say("바위가 돌 받침 위에 딱 맞게\n올라갔다!\f……쿠르릉!");
    const R = act("mh_rubble");
    if (R) { sfx("cast"); for (let i = 0; i < 10; i++) { Screen.shakeX = i % 2 ? 3 : -3; await frames(3); } Screen.shakeX = 0; R.hidden = true; }
    await say("어딘가에서 돌무더기가\n무너지는 소리가 났다!");
  }
}

// =====================================================================
// 3. 만행산 천황봉 — 라이벌 한결 9차전(마지막)
// =====================================================================
const RIVAL9_MV = { cheongsarong: ["flamethrower", "psychic", "crunch", "willowisp"], baraemong: ["energyball", "dazzlinggleam", "earthpower", "sludgebomb"],
  yongkkuri: ["surf", "dragonpulse", "icebeam", "crunch"], ttukkkuri: ["surf", "shadowball", "icebeam", "willowisp"] };
const rival9 = () => { const k = RIVAL_FINAL[RIVAL_OF[G.starter] || "bulsap"] || "cheongsarong";
  return { id: "rival9", cls: "라이벌", name: "한결", spr: "hangyeol", music: "rival", bgm: "trainer", base: 60, canLose: true,
    loseText: "한결: 봤지!\f이게 내 남켓몬들이랑\n같이 큰 힘이야!",
    intro: "한결: 오방고원 가기 전에\n마지막으로!\f……봐주는 거 없다.\n진짜 전력이다!",
    lose: "한결: ……하하.\n역시 너야.\f졌는데 이상하게\n후련하다.",
    team: [["eunhajak", 52, { mv: ["psychic", "airslash", "roost", "tailwind"].filter(m => MV[m]) }],
           ["wonangwang", 51, { mv: ["thunderbolt", "flashcannon", "voltswitch", "thunderwave"] }],
           ["cheonhajangso", 52, { mv: ["drainpunch", "earthquake", "rockslide", "leer"].filter(m => MV[m]) }],
           ["kalgitmae", 51, { mv: ["bravebird", "drainpunch", "roost", "leer"].filter(m => MV[m]) }],
           [k, 55, { mv: RIVAL9_MV[k] || RIVAL8_MV[k], item: "jujube" }]] }; };

async function rival9Event() {
  const P = World.player, H = act("mh_hangyeol");
  if (!H || G.flag("rival9_done")) return;
  G.flag("rival9_met", true);
  bgm("rival");
  await emote(H, "excl", 20);
  await say("한결: 왔냐!\n……늦었네, 기다렸잖아.");
  await walkTo(H, P.x, P.y - 1); face(H, P); P.dir = "up";
  await say("한결: 여기가 천황봉이래.\f저기 봐.\n지리산 능선이 다 보여.");
  await say("한결: 처음 아카데미에서 붙었을 땐\n너만 이기면 된다고 생각했거든.\f근데 길마다 너를 만나고,\n할아버지랑 허수아비 세우고,\f출두 때 다 같이 모인 거 보고……\n좀 달라졌어.");
  await say("한결: 이제는 이기고 지는 것보다\n너랑 끝까지 겨뤄 보고 싶어.");
  const r = await trainerBattle({ x: H.x, y: H.y, dir: H.dir, trainer: rival9() }, false);
  bgm("rival");
  if (r !== "win") { G.healAll(); await Audio2.jingle("jg_heal"); await say("남켓몬들이 기운을 되찾았다!"); }
  await say("한결: 조박사님이 그러셨잖아.\n'같이 크는 거다'라고.\f……우리, 진짜 같이 컸다.");
  await say("한결: 리그는 네가 먼저 가.\f나는 여기서 조금 더\n단련하고 따라갈게.\f……꼭 이겨!\n아, 몰라! 이거나 받아!");
  await getItem("fullrestore", 2);
  sfx("run"); await fadeOut(8); H.hidden = true; await fadeIn(8);
  await say("한결은 능선 쪽으로\n뛰어 내려갔다.");
  G.flag("rival9_done", true);
  zoneBgm();
}

// =====================================================================
// 4. 오방고원 — 오방기 · 오방담
// =====================================================================
const OBANG = {
  blue: { n: "파란", dir: "동쪽", qi: "나무", dam: "cheongdam", t: "봄" },
  red: { n: "빨간", dir: "남쪽", qi: "불", dam: "jeokdam", t: "여름" },
  yellow: { n: "노란", dir: "가운데", qi: "흙", dam: "hwangdam", t: "" },
  white: { n: "하얀", dir: "서쪽", qi: "쇠", dam: "baekdam", t: "가을" },
  black: { n: "검은", dir: "북쪽", qi: "물", dam: "heukdam", t: "겨울" },
};
async function obangFlag(c) {
  const F = OBANG[c];
  await say(`${F.n} 오방기가 펄럭인다.\f${F.dir}, ${J(F.qi, "을")} 뜻하는 빛이다.`);
  const idx = G.party.map((m, i) => m.k === "obangdam" ? i : -1).filter(i => i >= 0);
  if (!idx.length) return;
  const m = G.party[idx[0]];
  await say(`${mname(m)}의 목에 맨\n다섯 빛 매듭 가운데\f${F.n} 매듭이\n깃발을 따라 반짝인다……!`);
  if ((await ask(`${J(mname(m), "이")} ${F.n} 빛의\n기운을 받게 할까?`, ["받게 한다", "그만둔다"])) !== 0) return;
  await evolve(m, F.dam);
}
async function obangElder() {
  if (!G.flag("ob_dam_gift")) {
    await say("할아버지: 오방고원까지 왔구나.\f여기 깃발 다섯은\n동서남북과 가운데를 뜻한단다.");
    await say("할아버지: 이 녀석은 오방담이라고,\n목에 다섯 빛 매듭을 맸지.\f어느 깃발의 기운을 만나느냐에 따라\n모습이 바뀐다더구나.");
    await say("할아버지: 리그에 가는 길동무로\n데려가 주겠니?");
    const m = makeMon("obangdam", 50, { ot: G.name });
    const where = G.addMon(m); G.catch("obangdam");
    sfx("select"); await Audio2.jingle("jg_caught");
    await say(`${J(G.name, "은")} 오방담을 받았다!` + (where === "box" ? "\f(오방담은 PC로 보냈다.)" : ""));
    G.flag("ob_dam_gift", true);
    await say("할아버지: 깃발 앞에 데려가 보렴.\f파랑은 나무, 빨강은 불,\n노랑은 흙.\f하양은 쇠, 검정은 물이란다.");
    return;
  }
  await say("할아버지: 다섯 빛은 서로를 낳고,\n서로를 누르기도 한단다.\f어느 하나만 세면\n오래 못 가는 법이지.\f……사람 사는 마을도\n다르지 않더구나.");
}

// =====================================================================
// 5. 리그 전당 1층 문지기
// =====================================================================
async function lobbyGate() {
  const P = World.player;
  await say("문지기: 이 문 너머가\n덕과 아카데미 리그예요.\f산지기 네 분을 차례로 이기면\n챔피언이 기다리고 있어요.");
  if (!window.LEAGUE_READY) {
    await say("문지기: ……그런데 지금은\n산지기 분들이 준비 중이에요.\f(플레이 버전은 여기까지!\n리그는 다음 버전에서 열려요.)");
    return;
  }
  if (typeof leagueEnter === "function") await leagueEnter();
}

// 리그 전당 1층에서 쉬었으면 쓰러졌을 때 그곳으로(센터처럼)
const _whiteout233 = whiteout;
whiteout = async function () {
  if (!(G.heal && G.heal[0] === "obang_lobby")) return _whiteout233();
  G.healAll(); if (typeof leagueReset === "function") leagueReset();
  World.load("obang_lobby", 6, 4, "up"); World.cam = World.camTarget();
  await fadeIn(16);
  await say("남켓몬은 모두 건강해졌어요.\f산지기 방은 처음부터 다시예요.\n무리하지 마세요!");
};

(function attachChapter24() {
  const D = MAPDATA;
  // ---- 16번도로 북쪽 → 17번도로 ----
  const R16 = MAPS.route16;
  R16.rows = D.route16.rows;
  R16.warps = (R16.warps || []).concat([20, 21].map(x => [x, 0, ["route17", x, 55, "up", "edge"]]));
  R16.signs.push([22, 3, "↑ 17번도로\n만행산 · 오방고원(리그)"]);

  // ---- 17번도로 ----
  const R = D.route17;
  MAPS.route17 = {
    rows: R.rows, stamps: R.stamps, name: "17번도로",
    warps: [20, 21].map(x => [x, 55, ["route16", x, 0, "down", "edge"]]).concat([20, 21].map(x => [x, 0, ["manhaeng", x + 2, 51, "up", "edge"]])),
    zones: [["보절 북쪽 들", 0, 43, 39, 55], ["17번도로", 0, 0, 39, 42]],
    zinfo: { "보절 북쪽 들": { bgm: "route", enc: null }, "17번도로": { bgm: "champroad", enc: "17번도로", rate: 0.12, bg: "grass" } },
    signs: [[18, 51, "17번도로\n↓ 16번도로(보절 들판) · ↑ 만행산"], [19, 42, "↑ 만행산(챔피언로드)\n그 너머 오방고원"],
      [10, 34, "보절 북쪽 논\f만행산에서 내려온 개울물을\n논에 대어 농사를 지어요."],
      [31, 20, "← 만행산 물길(샘)"],
      [22, 3, "만행산 물길\f만행산은 요천과 오수천의\n물길이 갈라지는 곳이에요.\f이 산에 내린 빗물은\n어느 비탈로 흐르느냐에 따라\f요천으로도, 오수천으로도 가요."]],
    checks: [],
    areas: [{ x0: 20, y0: 47, x1: 21, y1: 47, cond: () => !G.flag("r17_gate"), run: r17Gate }],
    npcs: [
      { id: "r17_guard_l", x: 19, y: 47, spr: "man", dir: "right", move: "fixed", talk: () => G.flag("r17_gate") ? say("문지기: 리그는 만행산 너머예요.\n힘내세요!") : r17Gate() },
      { id: "r17_guard_r", x: 22, y: 47, spr: "woman", dir: "left", move: "fixed", heart: "17번도로 홍살문 문지기",
        talk: () => say(G.flag("r17_gate") ? "문지기: 홍살문은 원래 귀한 곳 앞에\n세우던 붉은 문이래요.\f이 길 끝이 귀해서가 아니라\n여기까지 걸어온 사람이 귀해서\f세운 거라고 생각해요." : "문지기: 어사패를 보여 주세요.") },
      { id: "r17_spring", x: 11, y: 5, spr: "oldman", dir: "right", move: "look", heart: "만행산 샘 할아버지",
        talk: "할아버지: 같은 하늘에서 내린 비도\n이 산마루에서 갈라져\f한쪽은 요천으로,\n한쪽은 오수천으로 간단다.\f갈라져도 결국 다 섬진강에서\n다시 만나지." },
      { id: "r17_farmer", x: 18, y: 38, spr: "man", dir: "left", move: "look", heart: "보절 북쪽 논 아저씨",
        talk: "아저씨: 산에서 내려온 물을\n논에 대려면 물꼬를 잘 봐야 해.\f물은 막는 것보다\n길을 내 주는 게 어렵거든." },
      { item: "tm80", x: 3, y: 15 }, { item: "maxpotion", x: 36, y: 21 }, { item: "fullheal", x: 2, y: 31 }, { item: "ok", n: 3, x: 33, y: 9 },
      { x: 23, y: 38, spr: "hiker", dir: "left", trainer: { id: "r17_youngcheol", cls: "리그 도전자", name: "영철", spr: "hiker", range: 3, base: 30, team: [["maetdolmet", 51], ["jiriam", 51]],
        intro: "어사패 일곱 개!\n나도 드디어 여기까지 왔다!", lose: "산은 아직 높구나……", after: "올라갈수록 숨이 차지?\n그게 올라가고 있다는 뜻이야." } },
      { x: 12, y: 34, spr: "traveler", dir: "up", trainer: { id: "r17_sora", cls: "리그 도전자", name: "소라", spr: "traveler", range: 2, base: 30, team: [["boeunbi", 51], ["cheongdungdae", 51], ["sorikkoe", 52]],
        intro: "전국을 돌다가\n남원 리그에 도전하러 왔어!", lose: "남원 트레이너, 세다!", after: "어디서 왔느냐보다\n어디까지 가느냐가 중요하대." } },
      { x: 7, y: 24, spr: "doryeong", dir: "right", trainer: { id: "r17_jihun", cls: "리그 도전자", name: "지훈", spr: "doryeong", range: 2, base: 30, team: [["gatseonbi", 51], ["gujeongwang", 52]],
        intro: "선비는 글로 겨루고\n트레이너는 배틀로 겨루지!", lose: "한 수 배웠소……", after: "지는 것도 공부라더군." } },
      { x: 24, y: 17, spr: "nangja", dir: "down", trainer: { id: "r17_haeun", cls: "리그 도전자", name: "하은", spr: "nangja", range: 2, base: 30, team: [["wonanggeum", 52], ["seorikkot", 52]],
        intro: "물길이 갈라지는 곳이래.\n우리 승부도 여기서 갈라지겠지?", lose: "내 쪽이 아니었네.", after: "갈라진 물도 언젠가\n다시 만난대." } },
      { x: 33, y: 13, spr: "simmani", dir: "left", trainer: { id: "r17_deokbae", cls: "심마니", name: "덕배", spr: "simmani", range: 3, base: 28, team: [["mokgiryeong", 52], ["gatseonbi", 51], ["bandaljanggun", 52]],
        intro: "심봤다—!\n……아니, 트레이너 봤다!", lose: "오늘은 빈손이구먼.", after: "귀한 건 서두르면\n안 보이는 법이여." } },
    ],
  };

  // ---- 만행산 ----
  const MM = D.manhaeng;
  MAPS.manhaeng = {
    rows: MM.rows, stamps: MM.stamps, name: "만행산",
    warps: [22, 23].map(x => [x, 51, ["route17", x - 2, 0, "down", "edge"]]).concat([22, 23].map(x => [x, 0, ["obang", x - 3, 29, "up", "edge"]])),
    zones: [["만행산 숲길", 0, 26, 47, 51], ["천황봉 능선", 0, 0, 47, 25]],
    zinfo: { "만행산 숲길": { bgm: "champroad", enc: "만행산", rate: 0.12, bg: "grass" }, "천황봉 능선": { bgm: "champroad", enc: "만행산", rate: 0.12, bg: "grass" } },
    signs: [[21, 45, "만행산(챔피언로드)\f숲길과 바위굴을 지나\n천황봉 너머 오방고원으로"], [24, 27, "← 만행산 바위굴\f굴 안의 큰 바위는\n남켓몬과 힘을 모아 밀 수 있어요."],
      [5, 16, "→ 천황봉 · ↑ 오방고원"], [19, 4, "천황봉\f만행산의 꼭대기예요(약 910m).\f꼭대기에 오르면 지리산의 큰 능선이\n한눈에 보인다고 해요."]],
    checks: [[25, 3, "'천황봉'이라고 새긴 돌이다.\f남쪽으로 지리산 능선이\n구름처럼 이어져 있다……"], [25, 2, "'천황봉'이라고 새긴 돌이다."]],
    areas: [{ x0: 14, y0: 2, x1: 35, y1: 6, cond: () => G.flag("chuldu_done") && !G.flag("rival9_met"), run: rival9Event }],
    npcs: [
      { id: "mh_hangyeol", x: 24, y: 3, spr: "hangyeol", dir: "down", move: "fixed", show: () => G.flag("chuldu_done") && !G.flag("rival9_done") },
      { id: "mh_hiker", x: 39, y: 6, spr: "hiker", dir: "left", move: "look", heart: "천황봉 등산객",
        talk: "등산객: 꼭대기에 오래 서 있는\n사람은 없어.\f다 내려가서 또 다른 산을\n오르러 가지.\f……그래서 산은 늘\n다음을 보여 주는 거야." },
      { id: "mh_ranger", x: 25, y: 47, spr: "ranger", dir: "left", move: "look", heart: "만행산 지킴이",
        talk: "지킴이: 리그에 가는 트레이너들이\n이 길에서 마지막으로 겨뤄요.\f숲은 그 소리를 다 듣고 있지만\n아무 말도 안 하죠.\f……그래서 다들 여기서\n제일 솔직해지나 봐요." },
      { item: "maxrevive", x: 3, y: 26 }, { item: "fullrestore", x: 44, y: 43 }, { item: "maxelixir", x: 26, y: 41 }, { item: "rarecandy" in ITEMS ? "rarecandy" : "maxpotion", x: 18, y: 21 },
      { x: 30, y: 43, spr: "simmani_girl", dir: "down", trainer: { id: "mh_danbi", cls: "심마니 소녀", name: "단비", spr: "simmani_girl", range: 2, base: 26, team: [["eollekkot", 52], ["bomulbak", 53]],
        intro: "할아버지 따라 산에 다니다가\n리그까지 오게 됐어!", lose: "할아버지한테 혼나겠다……", after: "산삼은 잎이 다섯 갈래래.\n손가락처럼!" } },
      { x: 34, y: 38, spr: "foreign_m", dir: "right", trainer: { id: "mh_mark", cls: "여행가", name: "마크", spr: "foreign_m", range: 2, base: 30, team: [["kalgitmae", 52], ["ureureung", 53]],
        intro: "Hello!\n남원의 산은 정말 아름다워요!", lose: "Wow……\n대단해요!", after: "다른 나라 말로도\n배틀은 똑같이 통해요!" } },
      { x: 13, y: 30, spr: "foreign_f", dir: "left", trainer: { id: "mh_yuri", cls: "여행가", name: "유리", spr: "foreign_f", range: 2, base: 30, team: [["byeoljara", 52], ["dalbanga", 52], ["chamjipwang", 53]],
        intro: "지도 한 장 들고\n여기까지 걸어왔어요!", lose: "지도에 없는 길이었네요.", after: "길을 잃어 본 사람이\n길을 잘 알려 준대요." } },
      { x: 30, y: 15, spr: "hiker", dir: "down", trainer: { id: "mh_dongsu", cls: "리그 도전자", name: "동수", spr: "hiker", range: 2, base: 30, team: [["namsaengbae", 53], ["daseultap", 53]],
        intro: "바위굴을 빠져나왔다고\n끝난 줄 알았지?", lose: "끝까지 방심 금물이었네……", after: "내려갈 때 조심해.\n사고는 다 내려갈 때 난대." } },
    ],
  };

  // ---- 만행산 바위굴 ----
  const C = D.manhaeng_cave;
  const tIn = () => JSN.tiles_in && JSN.tiles_in.t;
  MAPS.manhaeng_cave = {
    rows: C.rows, stamps: C.stamps, indoor: true, cave: true, caveEnc: true, name: "만행산 바위굴",
    floorFn: (x, y) => ((x * 7 + y * 13) % 5 === 0 ? "floor_cave2" : "floor_cave"), wall: "wall_cave", bgm: "champroad", noPopup: false,
    enc: "만행산", rate: 0.07, bg: "cave",
    exit: ["manhaeng", 22, 25, "down"],
    checks: [],
    under(cx, cy) {
      const T = tIn(); if (!T) return; const [px, py] = mhDev().plate;
      tileAt(World.M.ts, mhOnPlate() || G.flag("mh_plate") ? T.cave_plate_on : T.cave_plate, px * TS - cx, py * TS - cy);
    },
    onBump(P, d) {
      const [dx, dy] = DIRS[d]; const a = World.actorAt(P.x + dx, P.y + dy);
      if (!a || a.id !== "mh_boulder" || G.flag("mh_plate")) return false;
      World.run(() => mhPush(a, d)); return true;
    },
    onLoad() {
      MH.push = false;
      const B = act("mh_boulder"), R = act("mh_rubble"), dv = mhDev();
      if (G.flag("mh_plate")) { if (B) { B.x = dv.plate[0]; B.y = dv.plate[1]; } if (R) R.hidden = true; }
      else if (B) { B.x = dv.boulder[0]; B.y = dv.boulder[1]; }
    },
    npcs: [
      { id: "mh_boulder", x: 6, y: 17, move: "fixed", special: (px, py) => { const T = tIn(); if (T) tileAt(World.M.ts, T.cave_boulder, px, py); },
        talk: async (a) => { if (G.flag("mh_plate")) { await say("돌 받침 위에 얹힌 바위다.\n꿈쩍도 하지 않는다."); return; } await mhPush(a, World.player.dir); } },
      { id: "mh_rubble", x: 15, y: 13, move: "fixed", special: (px, py) => { const T = tIn(); if (T) tileAt(World.M.ts, T.cave_rubble, px, py); },
        talk: "돌무더기가 굴을 막고 있다.\f어딘가를 누르면\n무너질 것 같은데……" },
      { item: "tm82", x: 5, y: 5 }, { item: "maxrepel", x: 26, y: 20 }, { item: "fullheal", x: 22, y: 4 },
      { x: 19, y: 9, spr: "pansori", dir: "down", trainer: { id: "cv_myeongchang", cls: "소리꾼", name: "명창", spr: "pansori", range: 3, base: 26, team: [["sorikkoe", 53], ["neokbulhak", 53]],
        intro: "굴에서 소리를 하면\n메아리가 같이 불러 주지!\f얼씨구—!", lose: "메아리가 나보다 낫구먼……", after: "소리는 혼자 내도\n돌아올 땐 둘이 된단다." } },
      { x: 24, y: 17, spr: "hwagong", dir: "left", trainer: { id: "cv_jiwon", cls: "화공", name: "지원", spr: "hwagong", range: 3, base: 26, team: [["danpungbul", 52], ["eollekkot", 52], ["seonrok", 53]],
        intro: "어두운 굴에서도\n색은 보여!\f눈을 크게 떠 봐!", lose: "그림이 번졌네……", after: "어두울수록\n작은 빛이 또렷하지." } },
      { x: 12, y: 18, spr: "hiker", dir: "right", trainer: { id: "cv_cheoljin", cls: "등산객", name: "철진", spr: "hiker", range: 3, base: 22, team: [["gulsojang", 53], ["jangsuppul", 53]],
        intro: "굴 탐험은\n내 전문이지!", lose: "허허, 굴보다 깊구먼.", after: "굴 바위는 수만 년 동안\n물방울이 깎은 거래." } },
    ],
  };

  // ---- 오방고원 ----
  const O = D.obang;
  const flagCells = {};
  for (const [nm, x, y] of O.stamps) if (nm.startsWith("obang_")) for (let dy = 0; dy < 3; dy++) flagCells[x + "," + (y + dy)] = nm.slice(6);
  MAPS.obang = {
    rows: O.rows, stamps: O.stamps, name: "오방고원",
    warps: [19, 20].map(x => [x, 29, ["manhaeng", x + 3, 0, "down", "edge"]]),
    zones: [["오방고원", 0, 0, 39, 29]], zinfo: { "오방고원": { bgm: "obang", enc: null } },
    signs: [[21, 25, "오방고원\f덕과 아카데미 리그 ↑"],
      [12, 13, "오방색\f방위와 다섯 기운을 담은 빛이에요.\f동쪽 파랑(나무) · 남쪽 빨강(불)\n서쪽 하양(쇠) · 북쪽 검정(물)\f가운데는 노랑(흙)이에요."]],
    checks: Object.entries(flagCells).map(([k, c]) => { const [x, y] = k.split(",").map(Number); return [x, y, () => obangFlag(c)]; }),
    areas: [],
    npcs: [
      { id: "ob_elder", x: 14, y: 20, spr: "elder_m", dir: "right", move: "fixed", heart: "오방고원 할아버지", talk: obangElder },
      { id: "ob_yunseul", x: 25, y: 19, spr: "yunseul", dir: "left", move: "look", heart: "오방고원 윤슬 박사",
        talk: async () => { await say("윤슬 박사: 여기까지 왔네요!\f도감을 보니 처음 만난 날보다\n남켓몬 이름이 훨씬 많아졌어요."); await say("윤슬 박사: 이름을 하나씩 안다는 건\n그만큼 많이 만났다는 거죠.\f……리그에서 만날 산지기들도\n결국 '만남'이에요. 힘내요!"); } },
      { id: "ob_student", x: 22, y: 13, spr: "student", dir: "down", move: "look", heart: "오방고원 졸업생",
        talk: "졸업생: 나도 작년에 도전했어.\n산지기 첫 번째 방에서 졌지만.\f근데 진 날 밤에 처음으로\n남켓몬들이랑 별을 봤어.\f……그게 더 오래 기억나." },
    ],
  };
  // 오방담이 바뀌는 깃발 칸은 살펴보기(A)로 — 깃대 아래 칸에서 위를 보며
  // ---- 리그 전당 1층 ----
  MAPS.obang_lobby = {
    rows: D.obang_lobby.rows, stamps: D.obang_lobby.stamps, indoor: true, name: "리그 전당", floor: "floor_obang_lobby", wall: "wall_obang", win: "win_home", bgm: "center", noPopup: true,
    exit: ["obang", 19, 10, "down"],
    checks: [[7, 1, "다섯 빛 띠를 두른\n크고 붉은 문이다."]],
    npcs: [
      { id: "nurse", x: 1, y: 2, spr: "nurse", dir: "down", move: "fixed", talk: nurseTalk },
      { id: "ob_clerk", x: 13, y: 2, spr: "clerk", dir: "down", move: "fixed", talk: () => shop(["ok", "silk", "fullrestore", "maxpotion", "hyperpotion", "revive", "fullheal", "maxrepel"]) },
      { id: "ob_gate", x: 7, y: 2, spr: "man", dir: "down", move: "fixed", talk: lobbyGate },
      { id: "ob_hint", x: 10, y: 5, spr: "student", dir: "left", move: "look",
        talk: async () => { await say("선배: 리그 방 다섯 개,\n상성부터 챙겨 가!"); await say("북쪽 해랑은 고스트.\n고스트·악 기술이 잘 들어.\f서쪽 설아는 얼음.\n불꽃·격투·바위·강철!"); await say("남쪽 이글은 불꽃.\n물·바위·땅 기술.\f동쪽 영란은 비행.\n전기·얼음·바위 기술!"); await say("가운데 교장 선생님은\n바위·땅·물 남켓몬이 많대.\f풀·물·얼음·격투 기술을 챙기고\n경옥고도 넉넉히!"); } },
      { id: "ob_lobby_kid", x: 4, y: 5, spr: "kid_f", move: "look", heart: "리그 전당 꼬마",
        talk: "꼬마: 우리 언니가 그러는데,\n저 문은 한 번 들어가면\f이기거나 지기 전까진\n못 나온대.\f……그래서 들어가기 전에\n다들 크게 숨을 쉰대." },
    ],
  };
  Object.assign(TOWN_ZONE, { "17번도로": "r17", "보절 북쪽 들": "r17", "만행산": "manhaeng", "만행산 숲길": "manhaeng", "천황봉 능선": "manhaeng", "만행산 바위굴": "manhaeng", "오방고원": "obang", "리그 전당": "obang" });
  // 출두 끝 메시지(만복사지) — 이제 오방고원으로 가는 길이 열림
  if (typeof window !== "undefined") window.CHULDU_NEXT = "17번도로";
})();
