// ===== v2.34 덕과 아카데미 리그(오방고원 '졸업 시험'): 산지기 해랑(북·검정·고스트) → 설아(서·하양·얼음) → 이글(남·빨강·불꽃) → 영란(동·파랑·비행) → 챔피언 교장 선생님 미스터 황(가운데·노랑) → 명예의 전당 =====
// 관장 문서(확정): 리그 순서 해랑 → 설아 → 이글 → 영란(마지막 산지기) → 챔피언 미스터 황. 산지기 Lv54–58 · 챔피언 Lv60–64
//   설아·이글 팀·대사는 trainers.js(날씨 전략, 대사 가안 D14) 그대로 · 영란 팀은 관장 문서 가안(청둥대·말굽쥬·칼깃매·보은비·에이스 우르릉) ·
//   미스터 황 팀은 관장 문서(지리암·별자라·천하장소·남생배·은하작, 에이스 천미르) · 해랑(고스트, 이야기꾼)은 가상 인물 — 대사 가안
//   말버릇(D12 가안 v2.36, 클로드가 고름 — 사용자가 바꿀 수 있음): 영란 "숨 한번 크게 쉬어 볼까요?"(자유로운 영혼·웰빙) / 미스터 황 "운동화 끈 단단히 묶어라"(스포츠맨·중후)
// 실제 포켓몬처럼 묘사(사천왕 방을 차례로 · 들어가면 이기거나 질 때까지 못 나옴 · 방 사이 회복 없음 · 지면 처음부터 · 명예의 전당 — 구조만), 닌텐도 그림은 베끼지 않음
// chapter24.js 뒤, pad.js 앞에 읽힘
"use strict";
window.LEAGUE_READY = true;

const HAERANG = { id: "league_haerang", cls: "산지기", name: "해랑", spr: "haerang", type: "고스트", indoor: true, bg: "indoor", base: 200, music: "eyes", bgm: "battle_gym",
  intro: "해랑: 어서 와요.\n나는 이야기꾼 해랑.\f오늘 들려줄 이야기는……\n밤길에서 만난 도깨비 이야기예요.\f옛이야기 속 도깨비는\n겁주는 척하지만\f끝까지 들어 준 사람에게는\n꼭 선물을 남겨요.\f……끝까지 들을 수 있을까요?",
  lose: "해랑: ……이야기가\n이렇게 끝나네요.\f좋은 이야기는 듣는 사람이\n끝을 바꾸는 법이죠.",
  team: [["mokgiryeong", 53, { mv: ["shadowball", "gigadrain", "willowisp", "leechseed"] }],
         ["heosujang", 54, { mv: ["shadowball", "leafblade", "leechseed", "hex"] }],
         ["gumiru", 55, { mv: ["flamethrower", "shadowball", "willowisp", "hex"] }],
         ["neokbulhak", 55, { mv: ["flamethrower", "hex", "willowisp", "airslash"].filter(m => MV[m]) }],
         ["bangmangdochae", 57, { mv: ["shadowball", "crunch", "hex", "willowisp"], item: "jujube" }]] };
const YEONGRAN = { id: "league_yeongran", cls: "산지기", name: "영란", spr: "gl_yeongran", type: "비행", indoor: true, bg: "indoor", base: 200, music: "eyes", bgm: "battle_gym",
  intro: "영란: 왔어요?\n먼저 숨 한번 크게 쉬어 볼까요?\f……후—\f좋아요.\f바람은 억지로 붙잡으면\n손가락 사이로 빠져나가요.\f같이 흘러가 봐요!",
  lose: "영란: 후— 좋은 바람이었어요.\f몸도 마음도\n한결 가벼워졌네요.",
  team: [["cheongdungdae", 55, { mv: ["surf", "airslash", "roost", "icebeam"] }],
         ["malgupju", 55, { mv: ["airslash", "crunch", "roost", "tailwind"].filter(m => MV[m]) }],
         ["kalgitmae", 56, { mv: ["bravebird", "closecombat", "roost", "swordsdance"] }],
         ["boeunbi", 56, { mv: ["airslash", "dazzlinggleam", "roost", "calmmind"] }],
         ["ureureung", 58, { mv: ["thunderbolt", "hurricane", "roost", "voltswitch"].filter(m => MV[m]), item: "jujube" }]] };
const MRHWANG = { id: "league_mrhwang", cls: "챔피언", name: "미스터 황", spr: "gl_mrhwang", indoor: true, bg: "indoor", base: 300, music: "eyes", bgm: "battle_champ",
  intro: "교장 선생님: 왔구나.\f산지기 넷을 지나\n여기 가운데 방까지.\f……운동화 끈은\n단단히 묶었겠지?\f지금부터는 교장도 학생도 없다.\n트레이너 대 트레이너다!",
  lose: "교장 선생님: ……허허.\f졌다.\n기분 좋게 졌구나.",
  team: [["jiriam", 57, { mv: ["earthquake", "rockslide", "ironhead", "protect"].filter(m => MV[m]) }],
         ["byeoljara", 58, { mv: ["surf", "psychic", "icebeam", "protect"] }],
         ["cheonhajangso", 58, { mv: ["drainpunch", "earthquake", "leer", "protect"].filter(m => MV[m]) }],
         ["namsaengbae", 59, { mv: ["surf", "powergem", "icebeam", "protect"] }],
         ["eunhajak", 59, { mv: ["psychic", "airslash", "roost", "protect"] }],
         ["cheonmireu", 61, { mv: ["dragonclaw", "airslash", "roost", "protect"], item: "jujube" }]] };

// 방: [지도, 산지기, 방위, 빛깔, 기운]
const LGR = [
  { map: "lg1", T: () => HAERANG, spr: "haerang", dir: "북쪽", col: "검정", qi: "물", name: "산지기 해랑의 방" },
  { map: "lg2", T: () => LEADERS.seola, spr: "seola", dir: "서쪽", col: "하양", qi: "쇠", name: "산지기 설아의 방" },
  { map: "lg3", T: () => LEADERS.igeul, spr: "igeul", dir: "남쪽", col: "빨강", qi: "불", name: "산지기 이글의 방" },
  { map: "lg4", T: () => YEONGRAN, spr: "gl_yeongran", dir: "동쪽", col: "파랑", qi: "나무", name: "산지기 영란의 방" },
  { map: "lg5", T: () => MRHWANG, spr: "gl_mrhwang", dir: "가운데", col: "노랑", qi: "흙", name: "챔피언의 방" },
];
const lgWin = i => G.flag("lg_win" + (i + 1));
function leagueReset() { for (let i = 1; i <= 5; i++) G.flag("lg_win" + i, false); }

async function leagueEnter() {
  const P = World.player;
  const c = await ask("문지기: 한 번 들어가면\n이기거나 질 때까지 못 나와요.\f방과 방 사이에서는\n쉴 곳이 없어요.\f들어갈까요?", ["들어간다", "아직"]);
  if (c !== 0) { await say("문지기: 준비가 되면\n말해 주세요."); return; }
  leagueReset();
  G.heal = ["obang_lobby", 6, 4, "up"];
  await say("문지기: 다섯 빛 방을 차례로\n지나가게 될 거예요.\f북쪽 검정, 서쪽 하양,\n남쪽 빨강, 동쪽 파랑.\f……그리고 가운데 노랑.\n행운을 빌어요!");
  sfx("door"); await fadeOut(14);
  const d = MAPDATA.lg1.dev; World.load("lg1", d.start[0], d.start[1], "up"); World.cam = World.camTarget();
  await fadeIn(14);
}
function lgGateOpen(i) {
  const d = MAPDATA[LGR[i].map].dev, M = World.M; const [gx, gy] = d.gate;
  M.solid[gy][gx] = false; M.beh[gy][gx] = "door";
  const nx = i < 4 ? LGR[i + 1].map : "hof", nd = MAPDATA[nx].dev;
  M.warps[gx + "," + gy] = [nx, nd.start[0], nd.start[1], "up"];
}
async function lgLeaderTalk(i) {
  const R = LGR[i], P = World.player, a = act("lg_leader");
  if (lgWin(i)) { await say(i < 4 ? `${R.T().name}: 다음 방이 기다리고 있어요.\n뒤돌아보지 말고 가요!` : "교장 선생님: 저 문 너머가\n명예의 전당이다."); return; }
  if (a) face(a, P);
  const r = await trainerBattle({ x: a.x, y: a.y, dir: a.dir, trainer: R.T() }, false);
  if (r !== "win") return;          // 지면 whiteout(리그 전당 1층) — chapter24
  G.flag("lg_win" + (i + 1), true);
  if (i === 0) await say("해랑: 다음 방은 서쪽, 하양.\f쇠의 기운이라지만\n그 방 주인은 눈을 더 좋아해요.");
  if (i === 1) await say("설아: 다음은 남쪽 방이야.\f……거긴 좀 더울 거야.\n각오해!");
  if (i === 2) await say("이글: 다음은 동쪽, 파랑!\f영란 언니는 전에\n미색마을 지킴이였대.\f희주 선생님한테 배움터를 맡기고\n바람처럼 떠났대!");
  if (i === 3) await say("영란: 문 앞에서 한 번 더,\n숨 한번 크게 쉬어 볼까요?\f……후—\f마지막 문 너머는 가운데,\n노랑 — 흙의 빛이에요.\f모든 빛이 딛고 서는 땅.\f……그분이 기다리고 계세요.");
  if (i === 4) { await championEvent(); return; }
  sfx("door"); await say("뒤쪽 큰 문이 열렸다!");
  lgGateOpen(i);
}
async function championEvent() {
  const P = World.player, a = act("lg_leader");
  bgm("academy");
  await say("교장 선생님: 이제 덕과 아카데미\n리그 챔피언은 너다.");
  await say("교장 선생님: 처음 너를 본 건\n아카데미 교문 앞이었지.\f조 선생님 반의 그 아이가\n여기까지 왔구나.");
  await say("교장 선생님: 이기는 법은\n누구나 가르칠 수 있다.\f하지만 지고 나서 다시 일어나는 건\n스스로 배워야 하지.\f……넌 그걸 끝까지\n해냈구나.");
  sfx("door"); await frames(10);
  const J0 = act("lg_jb"); if (J0) { J0.hidden = false; await walk(J0, "up", "up", "up"); face(J0, P); }
  await say("조박사: 야——!\n해냈다, 해냈어!");
  await say("조박사: ……선생님이 처음에\n그랬잖아.\f'급하게 크지 않아도 돼.\n오늘 하나만 어제보다 잘하면 돼.'\f넌 매일 하나씩 잘해서\n여기까지 온 거야.");
  await say("교장 선생님: 자, 저 문 너머가\n명예의 전당이다.\f네 남켓몬들의 이름을\n남기러 가자꾸나.");
  G.flag("lg_win5", true);
  sfx("door"); await say("뒤쪽 큰 문이 열렸다!");
  lgGateOpen(4);
}
async function hofEvent() {
  const P = World.player, d = MAPDATA.hof.dev;
  if (G.flag("hof_now")) return;
  G.flag("hof_now", true);
  bgm("hof");
  const HW = act("hof_hwang"), JB = act("hof_jb");
  await say("교장 선생님: 여기는 명예의 전당.\f리그를 이긴 트레이너와\n남켓몬을 기록하는 곳이다.");
  await walkTo(P, d.altar[0], d.altar[1] + 1); P.dir = "up";
  await say("기록대에 남켓몬의 이름을\n하나씩 새겼다……");
  for (const m of G.party) { sfx("select"); await say(`${mname(m)}  Lv.${m.lv}\f${MON[m.k].n} · ${MON[m.k].t.join("·")}`); }
  const rec = { t: Date.now(), party: G.party.map(m => [m.k, m.lv, m.nick || ""]) };
  G.hof = (G.hof || []).concat([rec]); G.flag("champion", true);
  await Audio2.jingle("jg_badge");
  await say(`${J(G.name, "과")} 남켓몬들의 이름이\n명예의 전당에 새겨졌다!`);
  if (JB) face(JB, P);
  await say("조박사: ……이제 진짜 졸업이네.\f근데 졸업은 끝이 아니라\n'시작'이라는 뜻도 있대.");
  if (typeof endingRun === "function") { await endingRun(); return; }
  await say("(축하해요! 리그 챔피언이 되었어요.\n엔딩 장면은 다음 버전에서 이어져요!)");
  G.flag("hof_now", false);
  await fadeOut(16); World.load("obang", 19, 11, "down"); World.cam = World.camTarget(); await fadeIn(16);
}

(function attachChapter25() {
  const D = MAPDATA;
  LGR.forEach((R, i) => {
    const d = D[R.map], dv = d.dev, c = dv.color, [cx0, cx1] = dv.carpet;
    MAPS[R.map] = {
      rows: d.rows, stamps: d.stamps, indoor: true, name: R.name, wall: "wall_lg_" + c, win: "win_home", bgm: "league", noPopup: false,
      floorFn: (x, y) => (x >= cx0 && x <= cx1 && y >= dv.leader[1] + 1 ? "floor_lg_" + c + "c" : (x + y) % 2 ? "floor_lg_" + c + "2" : "floor_lg_" + c),
      checks: [[dv.gate[0], dv.gate[1], () => lgWin(i) ? null : say("다섯 빛 띠를 두른 큰 문이다.\n굳게 닫혀 있다.")]],
      under(cx, cy) { if (!lgWin(i)) return; const T = JSN.tiles_in && JSN.tiles_in.t; if (T) tileAt(World.M.ts, T.lg_door_open, dv.gate[0] * TS - cx, dv.gate[1] * TS - cy); },
      onLoad() { if (lgWin(i)) lgGateOpen(i); },
      npcs: [{ id: "lg_leader", x: dv.leader[0], y: dv.leader[1], spr: R.spr, dir: "down", move: "fixed", talk: () => lgLeaderTalk(i) }]
        .concat(i === 4 ? [{ id: "lg_jb", x: dv.start[0], y: dv.start[1] + 1 > d.rows.length - 2 ? dv.start[1] : dv.start[1], spr: "jobaksa", dir: "up", move: "fixed", hidden: true, show: () => !G.flag("champion") }] : []),
    };
  });
  // 챔피언 방 조박사는 처음엔 숨김 — 문으로 뛰어 들어옴(들어온 자리 아래 칸이 벽이라 들어온 자리 옆에서)
  { const n = MAPS.lg5.npcs.find(n => n.id === "lg_jb"); const dv = D.lg5.dev; n.x = dv.start[0] - 1; n.y = dv.start[1]; }
  // ---- 명예의 전당 ----
  const H = D.hof, hv = H.dev;
  MAPS.hof = {
    rows: H.rows, stamps: H.stamps, indoor: true, name: "명예의 전당", floorFn: (x, y) => (x >= 4 && x <= 6 ? "floor_lg_yc" : (x + y) % 2 ? "floor_lg_y2" : "floor_lg_y"),
    wall: "wall_lg_y", win: "win_home", bgm: "hof", noPopup: false,
    checks: [[4, 3, () => say("명예의 전당 기록대.\f리그를 이긴 트레이너와\n남켓몬의 이름이 새겨져 있다.")], [5, 3, () => say("명예의 전당 기록대.")], [6, 3, () => say("명예의 전당 기록대.")]],
    areas: [{ x0: 0, y0: 0, x1: 10, y1: 8, cond: () => !G.flag("hof_now") && G.flag("lg_win5"), run: hofEvent }],
    npcs: [{ id: "hof_hwang", x: 3, y: 5, spr: "gl_mrhwang", dir: "right", move: "fixed", talk: "교장 선생님: 다시 리그에 오고 싶으면\n언제든 오방고원으로 오너라.\f산지기들도 더 세져서\n기다릴 게다." },
      { id: "hof_jb", x: 7, y: 5, spr: "jobaksa", dir: "left", move: "fixed", talk: "조박사: 선생님 반 졸업생 중에\n챔피언은 네가 처음이야.\f……음 그건 안 돼,\n울면 안 돼. 하하." }],
  };
  Object.assign(TOWN_ZONE, Object.fromEntries(LGR.map(R => [R.name, "obang"]).concat([["명예의 전당", "obang"]])));
})();
