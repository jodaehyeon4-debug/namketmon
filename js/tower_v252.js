// ===== v2.52 엔딩 뒤 '전주 배틀누각' — 실제 포켓몬의 배틀타워처럼 =====
// - 챔피언이 되면 다홍시티 시외버스 정류장에서 전주행 버스(전주 한옥마을)
// - 배틀누각: 남켓몬 셋 · 모두 Lv50으로 맞춤 · 같은 남켓몬·같은 도구 안 됨 · 전설·환상 안 됨 · 가방·경험치·상금 없음
//   이기면 BP · 7연승마다 보너스 · 21번째·49번째는 누각지기 완산 · 지면 연승 끝 · 쉬려면 리포트(도전 중에 끄면 실격 — 실제 게임처럼)
// - BP 교환소(특성 환약·특성 고약·병뚜껑·배틀 도구) · 판정관 · 단련 사범 · 회복
// - 동쪽 길은 '전주 시내(전주지방)' — 길 닦는 중(DLC 예고)
"use strict";
const BT_BAN = k => ["전설", "환상"].includes(MON[k] && MON[k].rare);
let BT_RUN = false;
function btState() {
  if (!G.bt) G.bt = { cur: 0, best: 0, team: [], live: false, inArena: false, wins: 0, sets: 0 };
  if (typeof G.bp !== "number") G.bp = 0;
  return G.bt;
}
(() => {
  const r0 = G.reset; G.reset = function (...a) { const r = r0.apply(this, a); this.bp = 0; this.bt = null; return r; };
  const ld0 = loadData; window.loadData = function (d) { const r = ld0(d); G.bp = (d && d.G && d.G.bp) || 0; G.bt = (d && d.G && d.G.bt) || null; return r; };
})();
Object.assign(LOCKS, {
  hanji: "한지 공방 문에 쪽지가 붙어 있다.\f'오늘은 닥나무 껍질로\n한지를 뜨는 날이라 쉽니다.'",
  munhak: "최명희문학관 별관.\f'소설 혼불 원고 전시를\n준비하고 있습니다.'",
  minbak: "한옥 민박집.\f'오늘은 예약 손님만\n받습니다.'",
  gukbap: "초가 콩나물국밥집.\f'아침 장사를 마치고\n문을 닫았습니다.'",
});

// ---- 지도 ----
MAPDATA.jeonju = {
  rows: [
    "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPP", "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPP", "PP..........................PP", "PP..........................PP", "PP..........................PP",
    "PP..........................PP", "PP..........................PP", "PP........s.................PP", "PP.......ooooooooooooo......PP", "PP.......ooooooooooooo......PP",
    "PP.......ooooooooooooo......PP", "PP.:::::::::::oo::::::::::..PP", "PP.:......RY..oo..RY....:...PP", "PPw:wwwwww....oo....wwww:wwwPP", "PP............oo............PP",
    "PP............oo..........WYPP", "PP.........s..oo............PP", "PP........WR..oo..WR........PP", "PP............oo...........sPP", "PP........s...oo:::::::::::::f",
    "PP............oo:::::::::::::f", "PP..........s.oo............PP", "PP..YR........oo.........YR.PP", "PP............oo............PP", "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPP"],
  stamps: [["gugakdang", 12, 2, { to: ["bt_lobby", 7, 7, "up"] }], ["mokgi", 2, 2, { locked: "hanji" }], ["senior", 2, 7, { locked: "munhak" }],
    ["senior", 23, 2, { locked: "minbak" }], ["thatch", 22, 7, { locked: "gukbap" }], ["hongye", 12, 13], ["pavilion", 3, 15], ["jeongja", 22, 14],
    ["stall", 20, 21], ["busstop", 16, 21], ["jangdok", 7, 4], ["well", 7, 8], ["lamp", 9, 6], ["lamp", 21, 6], ["lamp", 13, 17], ["lamp", 16, 17],
    ["tree", 10, 14], ["tree", 18, 14], ["bench", 10, 21], ["jangseung", 12, 8], ["jangseung", 17, 8]],
};
const JJ_GATE = "풍남문을 닮은 문\f전주 읍성의 남쪽 문 '풍남문'은\n보물로 지정된 옛 성문이에요.";
MAPS.jeonju = {
  rows: MAPDATA.jeonju.rows, stamps: MAPDATA.jeonju.stamps, name: "전주 한옥마을",
  zones: [["전주 한옥마을", 0, 0, 29, 25]], zinfo: { "전주 한옥마을": { bgm: "ojakgyo", enc: null, bg: "city" } },
  signs: [[10, 7, "전주 배틀누각\f전국의 강한 트레이너가\n실력을 겨루는 곳이에요.\f챔피언도 이곳에선\n처음부터 다시 시작!"],
    [12, 21, "전주 한옥마을\f↑ 배틀누각\n← 다홍시티행 시외버스(기사님께)"],
    [11, 16, JJ_GATE],
    [10, 19, "오목대\f고려 말 이성계가 남원 운봉\n황산에서 왜구를 크게 무찌르고\f(황산대첩) 돌아가는 길에\n잔치를 열었던 곳이에요.\f남원과 전주는 그렇게\n옛날부터 이어져 있었대요."],
    [27, 18, "→ 전주 시내 · 완산칠봉\f(지금은 길을 닦는 중이에요)"]],
  checks: [[12, 16, JJ_GATE], [17, 16, JJ_GATE],
    [22, 17, "경기전 대숲 쉼터\f경기전은 조선을 세운 태조\n이성계의 초상화(어진)를\n모신 곳이에요."], [23, 17, "경기전 대숲 쉼터\f대나무 잎이 바람에\n사르륵 흔들린다."],
    [16, 22, "전주 한옥마을 정류장\f'다홍시티행 시외버스'"]],
  npcs: [
    { id: "jj_driver", x: 13, y: 22, spr: "stationmaster", dir: "right", move: "fixed", talk: () => jeonjuBusTalk("dahong") },
    { id: "jj_hanji", x: 7, y: 6, spr: "hanji", dir: "down", move: "look",
      talk: "한지 장인: 전주 한지는 닥나무 껍질을\n물에 불리고, 두드리고, 떠서 만들지.\f천 년을 간다고 해서\n'지천년 견오백'이라 한단다.\f비단은 오백 년, 종이는 천 년!" },
    { id: "jj_reader", x: 8, y: 12, spr: "nangdokga", dir: "up", move: "look",
      talk: "낭독가: 전주에서 태어난 작가\n최명희의 소설 『혼불』은\f남원 사매면 노봉마을이\n배경이에요.\f남원에서 왔다고요?\n그럼 소설 속 고향에서 오셨네요!" },
    { id: "jj_singer", x: 6, y: 21, spr: "pansori", dir: "up", move: "look",
      talk: "소리꾼: 전주에서는 해마다\n'대사습놀이'가 열린다오.\f조선 시대부터 소리꾼들이\n실력을 겨루던 큰 잔치지.\f배틀누각도 그 마음 그대로!\n얼씨구—!" },
    { id: "jj_vendor", x: 19, y: 22, spr: "oldwoman", dir: "right", move: "fixed",
      talk: "노점 할머니: 비빔밥 한 그릇\n먹고 가!\f오방색 나물이 다 들어가서\n먹으면 힘이 펄펄 난다니까.\f……남켓몬 몫은 없어!\n배틀누각 가서 이기고 와!" },
    { id: "jj_tourist", x: 11, y: 9, spr: "foreign_f", dir: "down", move: "look",
      talk: "여행객: 한복을 빌려 입고\n한옥마을을 걸었어요!\f기와지붕 골목이 정말 예뻐요.\n배틀누각도 멋지죠?" },
    { id: "jj_kid", x: 19, y: 10, spr: "kid_m", dir: "down", move: "look",
      talk: "꼬마: 우리 형은 배틀누각에서\n7연승 했대!\f근데 21번째에 무서운\n누각지기 할아버지가 나온대……" },
    { id: "jj_hiker", x: 25, y: 20, spr: "hiker", dir: "left", move: "look",
      talk: "등산객: 저 길 너머가 전주 시내야.\f모악산, 완산칠봉, 전주천……\n남원이랑은 또 다른 남켓몬들이\n산다는 소문이 있지." },
    { id: "jj_guard", x: 28, y: 20, spr: "ranger", dir: "left", move: "fixed",
      talk: async () => { await say("길 안내원: 죄송해요!\n전주 시내로 가는 길은\n지금 닦고 있어요.");
        await say("길 안내원: 길이 다 닦이면\n'전주지방'이 열릴 거예요.\f그때는 남원에서 만나지 못한\n남켓몬과 배움터가 기다린대요!"); } },
  ],
};
MAPS.bt_lobby = {
  rows: MAPDATA.obang_lobby.rows, indoor: true, name: "배틀누각", floor: "floor_maru", floor2: "floor_maru2", wall: "wall_hanok", win: "win_home", bgm: "center",
  stamps: [["healer", 1, 1], ["c_plant", 0, 4], ["c_plant", 14, 4], ["gate_obang", 7, 1], ["c_sofa", 2, 6], ["c_sofa", 11, 6]],
  exit: ["jeonju", 15, 8, "down"],
  checks: [[10, 1, () => btBoard()], [11, 1, () => btBoard()], [7, 1, "다섯 빛 띠를 두른 문.\f너머에서 배틀 소리가\n울려 퍼진다."]],
  npcs: [
    { id: "nurse", x: 1, y: 2, spr: "nurse", dir: "down", move: "fixed", talk: nurseTalk },
    { id: "bt_desk", x: 7, y: 2, spr: "clerk", dir: "down", move: "fixed", talk: () => btDesk() },
    { id: "bt_shop", x: 12, y: 2, spr: "clerk", dir: "down", move: "fixed", talk: () => bpShop() },
    { id: "bt_judge", x: 4, y: 4, spr: "elder_m", dir: "down", move: "fixed", talk: () => judgeTalk() },
    { id: "bt_hyper", x: 10, y: 4, spr: "mokgong", dir: "down", move: "fixed", talk: () => hyperTrain() },
    { id: "bt_fan", x: 13, y: 6, spr: "student", dir: "left", move: "look",
      talk: "학생: 배틀누각에선 레벨이\n모두 50으로 맞춰져.\f그래서 레벨보다 성격·특성·\n기술 짜임이 더 중요하대!" },
  ],
};
{
  const d = MAPDATA.lg1, dv = d.dev, c = "r", [cx0, cx1] = dv.carpet;
  MAPS.bt_arena = {
    rows: d.rows, indoor: true, name: "배틀누각 대결장", wall: "wall_lg_" + c, win: "win_home", bgm: "league", noPopup: true,
    stamps: d.stamps.map(s => (s[0] === "lg_banner_k" ? ["lg_banner_r", s[1], s[2]] : s)),
    floorFn: (x, y) => (x >= cx0 && x <= cx1 && y >= 3 ? "floor_lg_" + c + "c" : (x + y) % 2 ? "floor_lg_" + c + "2" : "floor_lg_" + c),
    npcs: [],
    onLoad() { if (!BT_RUN) World.run(async () => { await say("배틀누각 안내원: 도전이 끝났어요.\n로비로 모실게요."); await fadeOut(10); World.load("bt_lobby", 7, 3, "up"); World.cam = World.camTarget(); await fadeIn(10); }); },
  };
}
// 다홍시티 시외버스 정류장(체육관과 연구소 사이)
(() => {
  const W = MAPS.world; if (!W) return;
  W.stamps.push(["busstop", 30, 15]);
  (W.checks = W.checks || []).push([30, 16, () => say(typeof postGame === "function" && postGame() ? "다홍 시외버스 정류장\f'전주 한옥마을행'" : "다홍 시외버스 정류장\f'전주행 — 노선 준비 중'")]);
  W.npcs.push({ id: "dh_jeonju_bus", x: 29, y: 16, spr: "stationmaster", dir: "down", move: "fixed", show: () => typeof postGame === "function" && postGame(), talk: () => jeonjuBusTalk("jeonju") });
})();
if (typeof TOWN_ZONE !== "undefined") Object.assign(TOWN_ZONE, { "전주 한옥마을": null });

// ---- 시외버스 ----
async function jeonjuBusTalk(to) {
  if (to === "jeonju") {
    if (!await yes("버스 기사: 전주 한옥마을행\n시외버스입니다!\f배틀누각에 가시나요?\n타시겠어요?")) { await say("버스 기사: 또 오세요!"); return; }
  } else if (!await yes("버스 기사: 다홍시티행\n시외버스입니다.\f남원으로 돌아가시겠어요?")) { await say("버스 기사: 천천히 둘러보세요!"); return; }
  await fadeOut(12);
  const s = { opaque: true, t: 0, update() { this.t++; }, draw() {
    const bg = IMG.bg_grass_day || IMG.bg_grass_eve; if (bg) { const off = (this.t * 2) % 256; g.drawImage(bg, off, 0, 256 - off, 144, 0, 0, 256 - off, 144); g.drawImage(bg, 0, 0, off, 144, 256 - off, 0, off, 144); }
    rect(0, 120, SW, 24, "#5a5a62"); for (let x = -((this.t * 6) % 32); x < SW; x += 32) rect(x, 131, 16, 2, "#f0e0a0");
    if (IMG.bus) sprite(IMG.bus, ((this.t >> 3) & 1) * 64, 0, 64, 32, 96, 92 + ((this.t >> 3) & 1));
    darkBox(0, 144, 256, 48);
  } };
  Scenes.push(s); bgm("route");
  await fadeIn(12); sfx("bus");
  if (to === "jeonju") { await say("전주행 시외버스를 탔다……", { auto: 1300 }); await say("남원을 지나 북쪽으로\n한 시간쯤 달린다.", { auto: 1400 }); }
  else { await say("다홍시티행 시외버스를 탔다……", { auto: 1300 }); await say("창밖으로 남원 들판이\n다시 보이기 시작한다.", { auto: 1400 }); }
  await fadeOut(14); Scenes.pop(s);
  if (to === "jeonju") World.load("jeonju", 14, 22, "up"); else World.load("world", 29, 17, "down");
  World.cam = World.camTarget(); await fadeIn(14);
  if (to === "jeonju") {
    await say("전주 한옥마을에 도착했다!");
    if (!G.flag("jeonju_first")) { G.flag("jeonju_first", true); await say("기와지붕이 줄지어 선 골목 끝에\n큰 누각이 보인다.\f저곳이 배틀누각인가 보다!"); }
  } else await say("다홍시티에 도착했다!");
}

// ---- 상대 만들기 ----
const BT_NO_MOVE = new Set(["selfdestruct", "explosion", "memento", "finalgambit", "healingwish", "lunardance", "fissure", "guillotine", "horndrill", "sheercold",
  "dreameater", "focuspunch", "lastresort", "bide", "counter", "mirrorcoat", "metalburst", "snore", "sleeptalk", "belch", "hyperbeam", "gigaimpact", "blastburn",
  "hydrocannon", "frenzyplant", "rockwrecker", "solarbeam", "solarblade", "skyattack", "skullbash", "razorwind", "fly", "dig", "dive", "bounce", "phantomforce",
  "shadowforce", "futuresight", "doomdesire", "struggle", "naturalgift", "fling", "present", "magnitude", "spitup", "synchronoise", "steelbeam", "mindblown", "mistyexplosion"]);
const BT_SUP_P = ["swordsdance", "dragondance", "bulkup", "shellsmash", "honeclaws", "coil"];
const BT_SUP_S = ["nastyplot", "calmmind", "quiverdance", "tailglow"];
const BT_SUP = ["toxic", "willowisp", "thunderwave", "spore", "sleeppowder", "hypnosis", "yawn", "leechseed", "recover", "roost", "softboiled", "synthesis",
  "moonlight", "morningsun", "slackoff", "milkdrink", "substitute", "protect", "reflect", "lightscreen", "stealthrock", "trickroom"];
function btPreMoves(k, seen = new Set()) {   // 진화 전 모습이 배우는 기술도
  if (seen.has(k)) return []; seen.add(k);
  const out = []; for (const sp of MONS) if ((sp.evo || []).some(e => e[0] === k)) { out.push(...sp.ml); out.push(...btPreMoves(sp.k, seen)); }
  return out;
}
function btMoves(k, set, tm) {          // tm: 같은 팀이 이미 고른 기술(겹치면 덜 고름)
  const sp = MON[k], phys = sp.s[1] >= sp.s[3], cand = new Set();
  for (const [lv, id] of sp.ml.concat(btPreMoves(k))) if (lv <= 50 && MV[id]) cand.add(id);
  if (set >= 1) for (const it of Object.values(ITEMS)) if (it.tm && MV[it.tm] && !it.hm && tmOk({ k }, it.tm)) cand.add(it.tm);
  const hits = M => (Array.isArray(M.hits) ? 3 : M.hits || 1);
  const dmg = [...cand].filter(id => MV[id].c !== "X" && MV[id].bp > 1 && !BT_NO_MOVE.has(id))
    .map(id => { const M = MV[id]; return [id, M.bp * hits(M) * (sp.t.includes(M.t) ? 1.5 : 1) * Math.min(100, M.acc) / 100 * (M.c === (phys ? "P" : "S") ? 1 : 0.55) * (tm && tm.has(id) ? 0.7 : 1) + (M.pri > 0 ? 8 : 0) + Math.random() * 12]; })
    .sort((a, b) => b[1] - a[1]);
  const pick3 = [], types = new Set();
  for (const [id] of dmg) { if (pick3.length >= 3) break; if (!types.has(MV[id].t)) { pick3.push(id); types.add(MV[id].t); } }
  for (const [id] of dmg) { if (pick3.length >= 3) break; if (!pick3.includes(id)) pick3.push(id); }
  const own = (phys ? BT_SUP_P : BT_SUP_S).filter(id => cand.has(id) && MV[id]), gen = BT_SUP.filter(id => cand.has(id) && MV[id] && !(tm && tm.has(id)));
  const sup = own.concat(gen.length ? gen : BT_SUP.filter(id => cand.has(id) && MV[id]));
  const out = pick3.slice();
  if (set >= 1 && sup.length) out.push(own.length && Math.random() < 0.6 ? pick(own) : pick(sup));
  for (const [id] of dmg) { if (out.length >= 4) break; if (!out.includes(id)) out.push(id); }
  for (const id of sup) { if (out.length >= 4) break; if (!out.includes(id)) out.push(id); }
  return out.length ? out.slice(0, 4) : movesAt(k, 50);
}
const BT_COMP = ["focussash", "lifeorb", "expertbelt", "quickclaw", "scopelens", "shellbell", "weaknesspolicy", "whiteherb", "rockyhelmet", "muscleband", "wiseglasses"];
const BT_CHOICE = ["choiceband", "choicespecs", "choicescarf", "assaultvest"];
function btMon(k, set, used, boss, tm) {
  const sp = MON[k], phys = sp.s[1] >= sp.s[3], fast = sp.s[5] >= 85;
  const iv = boss ? 31 : [10, 16, 21, 26, 31][Math.min(4, set)];
  const nat = phys ? (fast ? 13 : 3) : (fast ? 10 : 15);       // 명랑·고집 / 겁쟁이·조심
  const m = makeMon(k, 50, { iv: [iv, iv, iv, iv, iv, iv], nat, ot: "배틀누각" });
  const A = phys ? 1 : 3;
  if (set >= 1 || boss) m.ev[A] = 252;
  if (set >= 2 || boss) { m.ev[5] = 252; m.ev[0] = 4; }
  if ((set >= 3 || boss) && sp.ab[1] && Math.random() < 0.3) m.ab = sp.ab[1];
  const mv = btMoves(k, boss ? 4 : set, tm); if (tm) mv.forEach(id => tm.add(id)); m.moves = mv.map(id => ({ id, pp: MV[id].pp, max: MV[id].pp }));
  const allDmg = mv.every(id => MV[id].c !== "X");
  let pool;
  if (set === 0 && !boss) pool = Object.keys(ITEMS).filter(id => ITEMS[id].tb && sp.t.includes(ITEMS[id].tb));
  else pool = BT_COMP.concat(allDmg ? BT_CHOICE : []).filter(id => ITEMS[id] && !(phys && ["wiseglasses", "choicespecs"].includes(id)) && !(!phys && ["muscleband", "choiceband"].includes(id)));
  pool = pool.filter(id => !used.has(id));
  if (pool.length) { m.item = pick(pool); used.add(m.item); }
  m.st = calcStats(m); m.hp = m.st[0];
  return m;
}
function btSpecies(set) {
  const R = [[380, 480], [420, 500], [450, 535], [470, 560], [490, 999]][Math.min(4, set)];
  const L = MONS.filter(sp => sp.s && !BT_BAN(sp.k) && (set >= 4 || sp.rare !== "준전설") && sp.ml && sp.ml.length)
    .filter(sp => { const b = sp.s.reduce((a, c) => a + c, 0); return b >= R[0] && b <= R[1]; });
  return L;
}
const BT_CLS = [
  ["한옥마을 여행객", ["traveler"], "한복 빌려 입고 골목 구경 끝!\n이제 배틀 구경 시켜 줄게!", "골목보다 배틀이\n더 어렵네……", "구경 잘했지?"],
  ["판소리 명창", ["pansori"], "대사습놀이 무대에 섰던 소리꾼이오!\n얼쑤, 한판 놀아 봅시다!", "소리는 남았는데\n남켓몬이 쉬어야겠구려.", "얼씨구, 좋다!"],
  ["한지 화공", ["hwagong"], "한지 위엔 먹이 번지지 않아.\n내 배틀도 흔들리지 않지!", "붓끝이 떨렸네……", "그림처럼 깔끔했지?"],
  ["한복 낭자", ["nangja"], "경기전 대숲 바람처럼\n시원하게 겨뤄 봐요!", "바람이 그쪽으로\n불었나 봐요.", "대숲 바람이 내 편이었네요!"],
  ["한복 도령", ["doryeong"], "오목대에 올라 전주를\n내려다보며 수련했소!", "수련이 모자랐구려!", "오목대의 기운이오!"],
  ["외국인 여행객", ["foreign_m", "foreign_f"], "전주 비빔밥 먹고\n힘이 넘쳐요! 한 판 해요!", "와! 정말 강해요!", "비빔밥 힘이에요!"],
  ["모악산 등산객", ["hiker"], "모악산 정상 찍고 내려왔지!\n다리는 아파도 배틀은 자신 있어!", "하산보다\n힘들구먼……", "산에서 다진 힘이지!"],
  ["꼬마 손님", ["kid_m", "kid_f"], "엄마랑 수제 초코파이\n사러 왔다가 들어왔어!", "으앙, 초코파이\n먹고 다시 올 거야!", "히히, 이겼다!"],
  ["곤충 채집 소년", ["bugboy"], "전주천 반딧불이 보러 왔다가\n남켓몬도 잔뜩 데려왔지!", "반딧불이처럼\n번쩍 졌네……", "반짝반짝 이겼다!"],
  ["문학관 낭독가", ["nangdokga"], "오늘 낭독할 장면은\n'나의 승리'랍니다.", "이야기가 바뀌었군요.", "이야기대로 되었네요."],
  ["전주역 역무원", ["stationmaster"], "전라선 전주역에서 왔습니다!\n출발 신호, 배틀 시작!", "종착역에 다다랐네요.", "정시 도착입니다!"],
  ["모악산 심마니", ["simmani"], "모악산 깊은 골짜기에서\n귀한 약초를 찾았지!", "심봤다……가 아니라\n졌구먼!", "심봤다!"],
  ["체험학습 학생", ["student"], "한옥마을로 체험학습 왔어요!\n배틀도 체험해 볼래요!", "보고서에 쓸 게\n많아졌어요……", "보고서에 '이김'이라고 써야지!"],
];
const BT_NAMES = ["준호", "서연", "민준", "지우", "하은", "도윤", "수아", "예준", "시우", "지호", "하린", "유나", "은우", "서진", "다은", "건우", "소율", "태윤", "채원", "현우", "나은", "지안", "윤호", "세아"];
function btTrainer(n) {
  const set = Math.floor((n - 1) / 7);
  const boss = n === 21 || n === 49;
  if (boss) return btBoss(n);
  const C = pick(BT_CLS), spr = pick(C[1]);
  const L = btSpecies(set), used = new Set(), team = [], ks = new Set(), tm = new Set();
  while (team.length < 3 && ks.size < L.length) { const sp = pick(L); if (ks.has(sp.k)) continue; ks.add(sp.k); team.push(btMon(sp.k, set, used, false, tm)); }
  return { name: pick(BT_NAMES), cls: C[0], spr, intro: C[2], lose: C[3], win: C[4], team, n };
}
function btBoss(n) {
  const gold = n >= 49, used = new Set();
  let ks;
  if (gold) ks = ["horyeongsan", "geumseom", "nogoma"].filter(k => MON[k]);
  else ks = MONS.filter(sp => !sp.rare || !["전설", "환상", "준전설"].includes(sp.rare)).filter(sp => !(sp.evo || []).length)
    .sort((a, b) => b.s.reduce((x, y) => x + y, 0) - a.s.reduce((x, y) => x + y, 0)).slice(0, 6).map(sp => sp.k).sort(() => Math.random() - 0.5).slice(0, 3);
  const tm = new Set(), team = ks.map(k => btMon(k, 4, used, true, tm));
  return gold
    ? { name: "완산", cls: "누각지기", spr: "eosa", boss: true, n, team,
      intro: "누각지기 완산: 마흔아홉 번째……\n또 만났구려!\f이번엔 아껴 두었던\n내 진짜 동료들이오.\f전주 배틀누각의 으뜸을\n가려 봅시다!", lose: "졌소! 그대야말로\n이 누각의 으뜸이오!", win: "허허, 으뜸 자리는\n아직 내 것이오." }
    : { name: "완산", cls: "누각지기", spr: "eosa", boss: true, n, team,
      intro: "누각지기 완산: 스물한 번을\n내리 이겼다고?\f허허, 오랜만에 손님다운\n손님이 왔구려.\f나는 이 배틀누각을 지키는\n완산이오.\f전주에서는 예부터 대사습놀이로\n솜씨를 겨뤘지.\f오늘은 남켓몬 솜씨를\n겨뤄 봅시다!", lose: "대단하구려!\n그 실력, 인정하겠소.", win: "아직 한 걸음\n모자랐구려." };
}

// ---- 배틀 ----
function btClone(m) {
  const c = JSON.parse(JSON.stringify(m));
  delete c.abT; delete c.tfSave;
  c.lv = 50; c.exp = expAt(MON[c.k].gr, 50); c.st = calcStats(c); c.hp = c.st[0]; c.status = null; c.slp = 0; c.tox = 0;
  for (const mv of c.moves) mv.pp = mv.max;
  return c;
}
async function btFight(T) {
  const real = G.party, S = btState();
  const team = S.team.map(uid => real.find(m => m.uid === uid)).filter(Boolean);
  bgm(T.boss ? "battle_champ" : "battle_gym");
  await battleTransition("trainer");
  G.party = team.map(btClone);
  let r;
  try {
    const b = new Battle({ kind: "trainer", foe: T.team, weather: null, bg: "nugak", trainer: { name: T.name, cls: T.cls, spr: T.spr, lose: T.lose, prize: 0 },
      canLose: true, loseText: `${T.cls} ${T.name}: ${T.win}`, noBag: true, noExp: true, setStyle: true });
    r = await b.start();
  } finally { G.party = real; }
  World.noBgm = false; bgm("league");
  await fadeIn(12);
  return r;
}
const btBpFor = n => Math.min(6, 2 + Math.floor((n - 1) / 7));
async function btSave(quiet) {
  const d = Save.read(); if (d && d.G && d.G.id !== G.id && !await yes("이미 다른 리포트가 있습니다.\n덮어써도 괜찮습니까?")) return false;
  const tb = quiet ? null : await say("리포트를 쓰고 있습니다……\n전원을 끄지 마십시오.", { keep: true });
  if (!quiet) await wait(700);
  const ok = Save.write(saveData()); if (tb) Scenes.pop(tb);
  sfx("save"); return ok;
}
function btToLobby() { World.load("bt_lobby", 7, 3, "up"); World.cam = World.camTarget(); }
async function btRun() {
  const S = btState(); BT_RUN = true;
  try {
    await fadeOut(12); World.load("bt_arena", 5, 7, "up"); World.cam = World.camTarget(); await fadeIn(12);
    while (true) {
      const n = S.cur + 1, T = btTrainer(n);
      await say(n % 7 === 1 && n > 1 ? `${Math.ceil(n / 7)}번째 7연전!\f${n}번째 대결이에요!` : `${n}번째 대결이에요!`);
      const a = new Actor({ id: "bt_foe", x: 5, y: 2, spr: T.spr, dir: "down", move: "fixed" }); World.actors.push(a);
      await walk(a, "down", "down", "down"); World.player.dir = "up";
      if (T.boss) { bgm("eyes"); await emote(a, "excl", 30); }
      await say(T.boss ? T.intro : `${T.cls} ${T.name}: ${T.intro}`);
      const r = await btFight(T);
      if (r !== "win") {
        World.actors.splice(World.actors.indexOf(a), 1);
        const got = S.cur; S.best = Math.max(S.best, got); S.cur = 0; S.live = false; S.inArena = false; S.team = [];
        await say(`아쉬워요!\f이번 기록은 ${got}연승이에요.\n(최고 기록 ${S.best}연승)`);
        await fadeOut(12); btToLobby(); await fadeIn(12);
        await say("접수원: 수고하셨어요!\f남켓몬들은 다시 기운을\n되찾았어요. 또 도전해 주세요!");
        await btSave(true);
        return;
      }
      await walk(a, "face:up", "up", "up", "up"); World.actors.splice(World.actors.indexOf(a), 1);
      S.cur++; S.wins = (S.wins || 0) + 1; S.best = Math.max(S.best, S.cur);
      let gain = btBpFor(n);
      sfx("money"); G.bp += gain;
      await say(`${n}번째 대결 승리!\f${J(G.name, "은")} BP를 ${gain} 받았다!`);
      if (T.boss) {
        const key = n >= 49 ? "bt_print_g" : "bt_print_s", bonus = n >= 49 ? 30 : 15;
        if (!G.flag(key)) { G.flag(key, true); Audio2.jingle("jg_badge"); await say(`누각지기 완산에게서\n${n >= 49 ? "금빛" : "은빛"} 인장을 받았다!`); }
        G.bp += bonus; sfx("money"); await say(`누각지기를 이긴 상으로\nBP를 ${bonus} 더 받았다!`);
      }
      if (S.cur % 7 === 0) { S.sets = (S.sets || 0) + 1; G.bp += 5; Audio2.jingle("jg_item"); await say(`${S.cur}연승을 해냈어요!\f7연승 보너스로\nBP를 5 더 받았다!`); }
      await say(`지금 ${S.cur}연승 · 가진 BP ${G.bp}`);
      const v = await ask("다음 대결로 나갈까요?", ["다음 대결", "쉬고 리포트를 쓴다", "그만둔다"]);
      if (v === 1) {
        S.inArena = false; S.live = true;
        await fadeOut(12); btToLobby(); await fadeIn(12);
        await say("접수원: 쉬는 동안 기록을\n리포트에 남겨 둘게요.");
        await btSave(false);
        await say(`접수원: ${S.cur}연승에서 이어서\n도전할 수 있어요.\f다음에 또 와 주세요!`);
        return;
      }
      if (v === 2) {
        if (await yes(`그만두면 ${S.cur}연승 기록이\n여기서 끝나요. 괜찮아요?`)) {
          S.cur = 0; S.live = false; S.inArena = false; S.team = [];
          await fadeOut(12); btToLobby(); await fadeIn(12);
          await say("접수원: 수고하셨어요!\n또 도전해 주세요!"); await btSave(true);
          return;
        }
      }
    }
  } finally { BT_RUN = false; }
}

// ---- 남켓몬 고르기 ----
async function btPickTeam() {
  const ok = G.party.filter(m => !BT_BAN(m.k));
  if (new Set(ok.map(m => m.k)).size < 3) { await say("접수원: 배틀누각에는 서로 다른\n남켓몬 세 마리가 필요해요.\f(전설·환상의 남켓몬은\n나갈 수 없어요.)"); return null; }
  let sel = [];
  while (true) {
    const ps = new PartyScreen("item", sel.length < 3 ? `함께 나갈 남켓몬을 고르세요 (${sel.length}/3)` : "이 셋이면 '취소'를 누르세요");
    ps.labFn = m => { const j = sel.indexOf(m.uid); return j >= 0 ? [`${j + 1}번째로 나감`, 1] : BT_BAN(m.k) ? ["나갈 수 없다", 0] : ["나갈 수 있다", 1]; };
    const t = await show(ps);
    if (t == null || t < 0) {
      if (sel.length === 3) {
        const nm = sel.map(u => mname(G.party.find(m => m.uid === u))).join(", ");
        const v = await ask(`${nm}\n이 셋으로 도전하겠습니까?`, ["도전한다", "다시 고른다", "그만둔다"]);
        if (v === 0) return sel; if (v === 1) { sel = []; continue; } return null;
      }
      if (await yes("남켓몬 고르기를\n그만두겠습니까?")) return null; continue;
    }
    const m = G.party[t]; if (!m) continue;
    if (sel.includes(m.uid)) { sel = sel.filter(u => u !== m.uid); sfx("cancel"); continue; }
    if (sel.length >= 3) { await say("벌써 세 마리를 골랐어요.\f바꾸려면 고른 남켓몬을\n한 번 더 눌러 빼 주세요."); continue; }
    if (BT_BAN(m.k)) { await say("전설·환상의 남켓몬은\n배틀누각에 나갈 수 없어요."); continue; }
    const S = sel.map(u => G.party.find(x => x.uid === u));
    if (S.some(x => x.k === m.k)) { await say("같은 남켓몬은 두 마리\n함께 나갈 수 없어요."); continue; }
    if (m.item && S.some(x => x.item === m.item)) { await say("같은 도구를 지닌 남켓몬은\n함께 나갈 수 없어요.\f(지닌 물건을 바꿔 주세요.)"); continue; }
    sel.push(m.uid);
  }
}

// ---- 접수원 ----
const BT_RULES = ["접수원: 배틀누각 싱글 배틀 규칙이에요.", "남켓몬 세 마리를 골라\n한 마리씩 차례로 싸워요.", "레벨은 모두 50으로 맞춰져요.\n(높아도 낮아도 50!)",
  "같은 남켓몬 두 마리, 같은 도구\n두 개는 함께 나갈 수 없어요.", "전설·환상의 남켓몬은\n나갈 수 없어요.", "배틀 중에는 가방을 쓸 수 없고\n경험치와 상금도 없어요.",
  "대신 이길 때마다 BP를 받아요.\n7연승마다 보너스 BP!", "배틀이 끝나면 체력·기술·도구는\n모두 처음대로 돌아와요.", "도전 중에 리포트 없이 게임을 끄면\n연승 기록이 끝나니 조심하세요!"];
async function btDesk() {
  const S = btState();
  if (S.inArena) {
    S.inArena = false; const got = S.cur; S.best = Math.max(S.best, got); S.cur = 0; S.live = false; S.team = [];
    await say(`접수원: 지난번 도전은 리포트를 쓰지\n않고 그만두셨네요.\f아쉽지만 연승 기록은\n${got}연승에서 끝났어요.`);
  }
  await say("접수원: 어서 오세요!\n여기는 전주 배틀누각이에요.\f강한 트레이너들과\n연달아 겨루는 곳이랍니다.");
  if (!G.flag("bt_gift")) {
    G.flag("bt_gift", true);
    await say("접수원: 처음 오셨군요!\n환영 선물을 드릴게요.");
    await getItem("abilcap"); await getItem("cap_silver");
    await say("접수원: 특성 환약은 특성을 바꾸고,\n병뚜껑은 저기 단련 사범님께\n가져가면 능력을 단련해 줘요.\f이기면 받는 BP로 오른쪽\n교환소에서 더 바꿀 수 있어요!");
  }
  if (S.live && S.cur > 0) {
    const team = S.team.map(u => G.party.find(m => m.uid === u));
    if (await yes(`접수원: 기다리고 있었어요!\n${S.cur}연승에서 이어서 도전할까요?`)) {
      if (team.some(m => !m)) { await say("접수원: 함께 도전하던 남켓몬이\n파티에 없네요.\f아쉽지만 이번 기록은\n여기서 끝이에요."); S.best = Math.max(S.best, S.cur); S.cur = 0; S.live = false; S.team = []; return; }
      S.inArena = true; await say("접수원: 도전 전에 리포트를\n써 둘게요."); if (!await btSave(false)) { S.inArena = false; return; }
      await say("접수원: 그럼 대결장으로\n안내할게요!"); await btRun(); return;
    }
    if (!await yes(`접수원: 그러면 ${S.cur}연승 기록은\n여기서 끝나요. 괜찮아요?`)) { await say("접수원: 언제든 이어서\n도전하러 와 주세요!"); return; }
    S.best = Math.max(S.best, S.cur); S.cur = 0; S.live = false; S.team = [];
  }
  while (true) {
    const v = await ask("접수원: 싱글 배틀에\n도전하시겠어요?", ["도전한다", "규칙을 듣는다", "그만둔다"]);
    if (v === 1) { for (const t of BT_RULES) await say(t.startsWith("접수원") ? t : "접수원: " + t); continue; }
    if (v !== 0) { await say("접수원: 또 오세요!"); return; }
    break;
  }
  const sel = await btPickTeam(); if (!sel) { await say("접수원: 또 오세요!"); return; }
  S.team = sel; S.cur = 0; S.live = true; S.inArena = true;
  await say("접수원: 도전 전에 리포트를\n써 둘게요.");
  if (!await btSave(false)) { S.live = false; S.inArena = false; S.team = []; return; }
  await say("접수원: 그럼 대결장으로\n안내할게요!");
  await btRun();
}
async function btBoard() {
  const S = btState();
  await say(`배틀누각 기록판\f최고 기록: ${S.best}연승\n지금 기록: ${S.live ? S.cur : 0}연승\f모두 ${S.wins || 0}번 이겼다.\n가진 BP: ${G.bp}`);
  if (G.flag("bt_print_s") || G.flag("bt_print_g")) await say(`받은 인장: ${[G.flag("bt_print_s") ? "은빛 인장" : "", G.flag("bt_print_g") ? "금빛 인장" : ""].filter(Boolean).join(" · ")}`);
}

// ---- BP 교환소 ----
const BP_STOCK = [["abilcap", 20], ["abilpatch", 40], ["cap_silver", 12], ["cap_gold", 40], ["yeot", 8], ["focussash", 16], ["lifeorb", 16], ["choiceband", 16],
  ["choicespecs", 16], ["choicescarf", 16], ["assaultvest", 16], ["expertbelt", 12], ["rockyhelmet", 12], ["weaknesspolicy", 12]].filter(x => ITEMS[x[0]]);
async function bpShop() {
  btState();
  await say("BP 교환소: 어서 오세요!\f배틀누각에서 모은 BP를\n도구로 바꿔 드려요.");
  const box = new Overlay(() => { frame(2, 2, 96, 30); Font.draw(g, "BP", 12, 10); Font.draw(g, String(G.bp), 88, 10, { align: "right" }); });
  Scenes.push(box);
  try {
    while (true) {
      let cur = 0;
      const desc = new Overlay(() => { frame(2, 142, 252, 48); const x = BP_STOCK[cur]; if (x) { drawItemIcon(x[0], 10, 154); Font.wrap(ITEMS[x[0]].d, 206, "g9").slice(0, 3).forEach((l, k) => Font.draw(g, l, 40, 148 + k * 12, { font: "g9" })); } });
      Scenes.push(desc);
      const j = await menu({ items: BP_STOCK.map(([id, c]) => ({ label: ITEMS[id].n, sub: c + "BP" })).concat([{ label: "그만두다" }]), x: 102, y: 2, w: 152, rows: 7, onMove: i => cur = i });
      Scenes.pop(desc);
      if (j < 0 || j >= BP_STOCK.length) break;
      const [id, cost] = BP_STOCK[j], it = ITEMS[id];
      const max = Math.min(99, Math.floor(G.bp / cost));
      if (max <= 0) { await say(`BP가 모자라요.\n(${it.n}은 ${cost}BP예요.)`); continue; }
      const tb = await say(`${J(it.n, "을")} 몇 개\n바꾸시겠어요?`, { keep: true });
      const np = new NumPick({ max, x: 140, y: 106, w: 112 }); const d0 = np.draw.bind(np);
      np.draw = () => { d0(); Font.draw(g, cost * np.v + "BP", 140 + 112 - 10, 114, { align: "right" }); };
      Scenes.push(np); const n = await np.promise; Scenes.pop(tb);
      if (!n) continue;
      if (!await yes(`${it.n} ${n}개, 모두 ${cost * n}BP예요.\n바꾸시겠어요?`)) continue;
      G.bp -= cost * n; G.give(id, n); sfx("money");
      await say(`${J(it.n, "을")} ${n}개 받았다!`);
    }
  } finally { Scenes.pop(box); }
  await say("BP 교환소: 또 오세요!");
}
