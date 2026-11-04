// ===== v2.40 길막기 다시 =====
// 사용자: "돌아서 npc를 지나 지금 가지 못하는 곳을 갈 수 있는 버그 있음. 3관장 마을에서 좌측, 우측으로 가는 길도 검토한 후 전체 길 재검토"
// 점검(test/blockchk): 조건부로 서 있는 사람(길막이) 둘레의 걸을 수 있는 칸이 그 사람을 빼고도 한 덩어리로 이어지면 = 돌아서 지나감
//  · 배움터 문 앞 아이 6명이 문 '바로 앞'이 아니라 대각선 칸에 서 있었음 → 사건 전에도 배움터에 들어감(v2.24 지도 다시 짤 때 한 칸 어긋남)
//  · 4칸 넓이 길에 2명만 서 있음(다홍 북쪽 · 쪽빛 북쪽 · 뱀사골 위) → 양 끝으로 지나감
//  · 송화 북쪽 공사 아저씨는 길 옆에, 요천 다리 공사 아저씨는 다리 옆 땅에 서 있었음
//  · 비색마을 동쪽(요천대교·7번도로)·서쪽(섬진강 둑길) 길막이 옆 칸으로 돌아서 나감
//  · 교룡산성 동문: 기수 옆 칸으로 들어가면 만남 사건 없이 산성 안으로
// 고침: 실제 포켓몬처럼 길막이는 길 폭 전체를 막음 — 사람 + '공사 중' 바리케이드(말 걸면 안내), 문 앞 아이는 문 바로 앞 칸
// chapter29.js 뒤, intro.js 앞에 읽힘
"use strict";

// ---- 바리케이드(16×16, 노랑·검정 빗금 가로판 + 다리 둘) ----
function drawBarricade(x, y) {
  x = Math.round(x); y = Math.round(y);
  rect(x + 1, y + 14, 14, 2, "rgba(0,0,0,0.22)");                  // 그림자
  for (const lx of [2, 12]) { rect(x + lx, y + 7, 2, 8, "#3a3a46"); rect(x + lx, y + 7, 1, 8, "#6a6a78"); rect(x + lx - 1, y + 14, 4, 1, "#2a2a32"); }
  rect(x, y + 3, 16, 7, "#22222a");                                   // 가로판 테두리
  for (let i = 0; i < 14; i++) for (let j = 0; j < 5; j++) rect(x + 1 + i, y + 4 + j, 1, 1, ((i + j) >> 1) % 2 ? "#f2c230" : "#26262e");
  rect(x + 1, y + 4, 14, 1, "rgba(255,255,255,0.25)");               // 윗면 빛
  rect(x + 7, y + 1, 2, 2, (FRAME >> 4) & 1 ? "#ff5a3a" : "#a8302a"); // 깜빡이는 경고등
}

(() => {
  const N = (m, id) => (MAPS[m] && MAPS[m].npcs || []).find(n => n.id === id);
  const barrier = (m, ref, xy, talk, n) => {
    const R = N(m, ref); if (!R) return;
    xy.forEach(([x, y], i) => MAPS[m].npcs.push({ id: `${ref}_bar${n || ""}${i}`, x, y, special: drawBarricade, move: "fixed", dir: "down", show: R.show, talk: talk || R.talk }));
  };
  const moveTo = (m, id, x, y) => { const o = N(m, id); if (o) { o.x = x; o.y = y; } };

  // 1) 배움터 문 앞 아이: 문 바로 앞 칸
  const DK = [["world", "gym_door_kid", "gym"], ["jjok", "gym2_door_kid", "gym2"], ["bisaek", "gym3_door_kid", "gym3"],
              ["juhong", "gym4_door_kid", "gym4"], ["gamcheong", "gym5_door_kid", "gym5"], ["ssukbit", "gym6_door_kid", "gym6"]];
  for (const [m, id, door] of DK) { const d = MAPDATA[m] && MAPDATA[m].doors && MAPDATA[m].doors[door]; if (d) moveTo(m, id, d[0], d[1] + 1); }

  // 2) 4칸 길: 사람 둘 + 양 끝 바리케이드
  barrier("world", "guard1", [[18, 2], [21, 2]], "'춘향제 준비 중'\f축제 준비가 끝날 때까지\n북쪽 길을 잠시 막아 둡니다.");
  barrier("jjok", "jj_worker1", [[18, 1], [21, 1]], "'공사 중'\f3번도로 다리 공사 중이라\n지나갈 수 없다.");
  barrier("baemsagol", "bs_ranger_top", [[18, 5], [21, 5]], "'출입 통제'\f안개가 짙어\n반야봉 가는 길을 막아 두었다.");
  // 송화 북쪽: 아저씨를 길 한가운데로 + 바리케이드 셋
  moveTo("songhwa", "sh_n_worker", 19, 3);
  barrier("songhwa", "sh_n_worker", [[18, 3], [20, 3], [21, 3]], "'공사 중'\f북쪽 8번도로 공사 중이라\n지나갈 수 없다.");
  // 요천 다리: 아저씨를 다리 입구로 + 바리케이드
  moveTo("world", "w_bridge_worker", 51, 58);
  barrier("world", "w_bridge_worker", [[51, 59]], "'공사 중'\f다리 공사 중이라\n건널 수 없다.");

  // 3) 비색마을 동쪽(요천대교): 나가는 두 칸 바로 앞 + 아래 칸 바리케이드
  moveTo("bisaek", "bs_worker1", 42, 21); moveTo("bisaek", "bs_worker2", 42, 22);
  barrier("bisaek", "bs_worker1", [[42, 23]], "'공사 중'\f요천대교 공사 중이라\n지나갈 수 없다.");
  //    서쪽(섬진강 둑길): 낚시꾼 둘 아래 칸으로 돌아 나가던 길 막기
  barrier("bisaek", "bs_fisher", [[1, 33]], "'출입 금지'\f물이 불어 둑길이 위험해요.\n— 비색마을");

  // 4) 교룡산성 동문: 문 앞 띠 전체에서 만남 사건(전엔 아래 두 줄만이라 옆 칸으로 들어가면 건너뜀)
  const GY = MAPS.gyoryong, ev = GY && (GY.areas || []).find(a => a.run === gisuGateEvent);
  if (ev) GY.areas.push({ x0: 17, y0: 24, x1: 25, y1: 25, cond: ev.cond, run: ev.run });
})();

// ===== v2.40 남켓몬센터 안 전면 개편 =====
// 사용자: "포켓몬센터 내부 인테리어 전면 재검토. 너무 휑함." → 실제 포켓몬 센터처럼(카운터 위 간판 · 간호사 뒤 회복 기계 · 오른쪽 PC ·
// 카운터 앞 큰 바닥 문장 · 문에서 이어지는 붉은 깔개 · 양쪽 기다리는 자리(둥근 탁자) · 책장·어항·자판기·정수기·화분)
// 14×9 → 15×11. 모든 마을 센터가 같은 rows·stamps 배열을 같이 쓰므로 그 자리에서 바꿈. 사람 자리(2,6)·(11,5)·PC 자리(12,1)는 그대로
function drawCenterSign(cx, cy) {
  const x = 5 * 16 - cx, y = 2 - cy;
  rect(x + 1, y + 1, 78, 13, "#5a1a1a"); rect(x + 2, y, 76, 13, "#7a2424"); rect(x + 3, y + 1, 74, 11, "#d84a44"); rect(x + 3, y + 1, 74, 2, "#ec7a6e");
  rect(x + 4, y + 3, 72, 8, "#c83e3a");
  const H = [".xx.xx.", "xxxxxxx", "xxxxxxx", ".xxxxx.", "..xxx..", "...x..."];   // 작은 하트
  for (let j = 0; j < H.length; j++) for (let i = 0; i < 7; i++) if (H[j][i] === "x") rect(x + 7 + i, y + 4 + j, 1, 1, "#ffffff");
  Font.draw(g, "남켓몬센터", x + 44, y + 2, { font: "g9", align: "center", col: "#ffffff", sh: "#7a2424" });
}
(() => {
  const C = MAPS.center; if (!C) return;
  const rows = ["###############", "##########OO###",
    "_______________", "____ccccccc____", "_______________", "_______________", "_______________",
    "_______________", "_______________", "_______M_______", "               "];
  C.rows.length = 0; C.rows.push(...rows);
  C.stamps.length = 0;
  C.stamps.push(["bookshelf", 0, 1], ["aquarium", 2, 1], ["poster0", 4, 1], ["poster2", 5, 1], ["healer", 8, 1], ["pc", 12, 1], ["vending_in", 14, 1],
    ["c_water", 11, 2], ["plant", 3, 3], ["c_emblem", 6, 4], ["c_runner", 7, 7], ["c_runner", 7, 8],
    ["c_table", 0, 5], ["c_table", 12, 5], ["c_sofa", 1, 8], ["c_sofa", 12, 8], ["c_plant", 0, 8], ["c_plant", 14, 8]);
  const nurse = C.npcs.find(n => n.id === "nurse"); if (nurse) { nurse.x = 7; nurse.y = 2; }
  for (const n of C.npcs) {
    if (n.spr === "student" && n.x === 10 && n.y === 5) { n.x = 11; n.y = 5; n.dir = "right"; }
    if (n.id === "watchman") { n.x = 10; n.y = 8; n.dir = "left"; }
  }
  const CHK = [[0, 1, "남켓몬 책이 꽂혀 있다.\f'처음 만나는 남켓몬'\n'타입 상성 한눈에 보기'"], [1, 1, "남켓몬 책이 꽂혀 있다."],
    [2, 1, "어항 속에서 물고기가\n한가롭게 헤엄친다."], [3, 1, "어항 속에서 물고기가\n한가롭게 헤엄친다."],
    [4, 1, "포스터: '남켓몬도 쉬어야 힘이 나요!\n지치면 언제든 센터로'"], [5, 1, "포스터: '풀숲에 들어가기 전에\n상처약을 챙겨요'"],
    [14, 1, "자판기다. 맛있는 물·사이다·\n레모네이드가 있다."], [14, 2, "자판기다. 맛있는 물·사이다·\n레모네이드가 있다."],
    [11, 2, "정수기다. 시원한 물을\n한 컵 마셨다."], [11, 3, "정수기다. 시원한 물을\n한 컵 마셨다."],
    [0, 5, "탁자 위에 남원 여행 잡지가\n놓여 있다."], [1, 5, "탁자 위에 남원 여행 잡지가\n놓여 있다."],
    [12, 5, "탁자 위에 '이달의 배움터 소식'이\n놓여 있다."], [13, 5, "탁자 위에 '이달의 배움터 소식'이\n놓여 있다."]];
  const centers = Object.keys(MAPS).filter(k => k === "center" || /^center_/.test(k));
  for (const k of centers) {
    const D = MAPS[k];
    D.under = drawCenterSign;
    D.checks = (D.checks || []).filter(c => !CHK.some(q => q[0] === c[0] && q[1] === c[1])).concat(CHK);
  }
  // 마을 → 센터 들어오는 자리(문 앞 깔개) (6,7) → (7,9)
  for (const D of Object.values(MAPS)) for (const s of D.stamps || []) {
    const o = s[3]; if (o && Array.isArray(o.to) && /^center/.test(o.to[0]) && o.to[1] === 6 && o.to[2] === 7) { o.to = o.to.slice(); o.to[1] = 7; o.to[2] = 9; }
  }
})();

// ===== v2.40 회중시계·타운맵: 이벤트 안에서 받음(엄마 아침 이벤트 · 연구소 도감 이벤트) =====
// 이미 그 이벤트를 지난 저장(전엔 시계방 할아버지·조수에게 말을 걸어야 받음)도 다음 지도에 들어설 때 가방에 넣어 줌
(() => {
  const load0 = World.load.bind(World);
  World.load = function (...a) {
    load0(...a);
    if (G.flag("slept") && !G.flag("watch")) { G.give("watch"); G.flag("watch", true); }
    if (G.flag("dex") && !G.flag("townmap")) { G.give("townmap"); G.flag("townmap", true); }
  };
})();

// ===== v2.40 길막기 다시(2): 문턱(밟으면 되돌려 보내는 칸)도 점검 =====
(() => {
  const W = MAPS.world; if (!W) return;
  // (1) 다홍시티 동·서 출구(10번도로·9번도로): 아무것도 없어서 처음부터 감청마을(5관장)까지 걸어갈 수 있었음 → 구룡 어사패(4개) 전에는 막음
  //     이야기 순서: 주홍마을(4관장) → 10번도로(방삼·단지 통행료) → 다홍 동문 → 다홍 서문 → 9번도로 → 감청마을
  const B4 = () => !hasBadge(4);
  W.npcs.push(
    { id: "dh_w_guard", x: 1, y: 17, spr: "man", dir: "right", move: "fixed", show: B4, talk: "미안! 9번도로 산길에\n돌이 무너져서 치우는 중이야.\f어사패를 넷 모을 즈음이면\n다 치워질 거야." },
    { id: "dh_w_guard_bar0", x: 1, y: 18, special: drawBarricade, move: "fixed", dir: "down", show: B4, talk: "'공사 중'\f9번도로 산길 정비 중이라\n지나갈 수 없다." },
    { id: "dh_e_guard", x: 58, y: 17, spr: "man", dir: "left", move: "fixed", show: B4, talk: "미안! 10번도로는 지금\n길을 넓히는 공사 중이야.\f주홍마을 쪽에서 오는 길이\n먼저 열릴 거래." },
    { id: "dh_e_guard_bar0", x: 58, y: 18, special: drawBarricade, move: "fixed", dir: "down", show: B4, talk: "'공사 중'\f10번도로 길 넓히기 공사 중이라\n지나갈 수 없다." });
  // (2) 만복사지 문턱: (2,42)(2,43)에서 왼쪽으로 갈 때만 막아서, 위 칸(2,41)→(1,41)→(1,42)로 돌아 들어갈 수 있었음 → 출구 앞 칸 모두
  const mb = (W.triggers || []).find(t => t.run === mbGateBlock);
  if (mb) { const cond = () => !(hasBadge(4) && isNight()); for (const [x, y] of [[1, 41], [1, 42], [1, 43], [0, 41]]) W.triggers.push({ x, y, cond, run: mbGateBlock }); }
  // (3) 시작 날 소색마을 북쪽 문턱: 82번째 줄 가운데 넷만 막아 양옆(15~17·22~23칸)으로 돌아 올라갈 수 있었음 → 79번째 줄 좁은 길목(18~21) 전체로
  const home = (W.triggers || []).filter(t => t.y === 82 && t.x >= 18 && t.x <= 21);
  for (const t of home) W.triggers.push({ x: t.x, y: 79, cond: t.cond, run: t.run });
})();
// (4) 주홍마을 북쪽(10번도로): 구룡 어사패 전에 10번도로 '통행료' 사건(Lv28~31)까지 갈 수 있었음 → 4관장 뒤에 열림
(() => {
  const J = MAPS.juhong; if (!J) return;
  const B4 = () => !hasBadge(4);
  J.npcs.push({ id: "jh_n_guard", x: 19, y: 2, spr: "man", dir: "down", move: "fixed", show: B4, talk: "미안! 10번도로 고갯길은\n지금 공사 중이란다.\f신하 선생님 구룡 어사패를\n받을 즈음엔 열릴 거야." },
    ...[[18, 2], [20, 2], [21, 2]].map(([x, y], i) => ({ id: "jh_n_guard_bar" + i, x, y, special: drawBarricade, move: "fixed", dir: "down", show: B4, talk: "'공사 중'\f10번도로 고갯길 공사 중이라\n지나갈 수 없다." })));
})();

// ===== v2.40 흙길 조각남 다듬기 =====
// 사용자: "맵 곳곳에 길이 이따위로 깔린 게 다분해. 점검." (쪽빛 염색 마당: 흙바닥이 장독 둘레·울타리 틈에서 칸 묶음마다 끊겨 섬처럼 보임)
// 원인: 지도 글자에서 길과 길 사이에 풀 한 칸이 끼거나(나란한 길 사이 풀 한 줄, 길 끝과 큰길 사이 풀 한 칸), 마당 한가운데 소품(장독·장작더미·흙더미) 밑이 풀이라
//   흙길 그림이 그 칸마다 테두리를 둘러 조각조각 끊김. 걷는 데는 차이 없음(풀·흙길 모두 걸을 수 있고 풀숲(")은 건드리지 않음)
// 다듬기(바깥 지도만, 지도를 처음 지을 때 한 번, 더 바뀔 게 없을 때까지): 평풀(.) 한 칸이
//   · 좌우 또는 위아래가 모두 길이면 → 길   · 세 면이 길이면 → 길   · 마당 소품(장독·장작·흙더미·짚더미·우물) 밑이고 두 면 이상이 길이면 → 길
// 건물·문 소품 밑, 화분·가로등 같은 장식 밑은 그대로(집 앞 화단 모양 유지). 채우는 글자는 이웃 길 글자(마당 D가 있으면 D)
(() => {
  const PATH = ":dpqDy", YARD = new Set(["jars", "woodpile", "soilpile", "haystack", "well", "jangdok", "jars_big", "excavator"]);
  const b0 = buildMap;
  function tidy(D) {
    if (D._pathTidy || D.indoor || !D.rows || !(TSET.out && TSET.out.js)) return; D._pathTidy = true;
    const ST = TSET.out.js.stamp, rows = D.rows.map(s => s.split("")), h = rows.length, w = (rows[0] || []).length;
    const cover = new Map();
    for (const s of D.stamps || []) { const S = ST[s[0]]; if (!S) continue; const big = !!S.door || (S.w * S.h > 4 && !YARD.has(s[0]));
      for (let j = 0; j < S.h; j++) for (let i = 0; i < S.w; i++) cover.set((s[1] + i) + "," + (s[2] + j), big ? "big" : YARD.has(s[0]) ? "yard" : "deco"); }
    const at = (x, y) => (rows[y] || [])[x] || "T", isP = (x, y) => PATH.includes(at(x, y));
    let n = 0;
    for (let pass = 0; pass < 10; pass++) {
      const add = [];
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (at(x, y) !== ".") continue;
        const cv = cover.get(x + "," + y); if (cv === "big" || cv === "deco") continue;
        const nb = [[x, y - 1], [x + 1, y], [x, y + 1], [x - 1, y]], p = nb.map(([a, b]) => isP(a, b)), c = p.filter(Boolean).length;
        if ((p[1] && p[3]) || (p[0] && p[2]) || c >= 3 || (cv === "yard" && c >= 2)) {
          const chars = nb.filter((_, i) => p[i]).map(([a, b]) => at(a, b));
          add.push([x, y, chars.includes("D") ? "D" : chars.includes(":") ? ":" : chars[0]]);
        }
      }
      if (!add.length) break;
      for (const [x, y, c] of add) rows[y][x] = c; n += add.length;
    }
    // 안내판(s)은 잔디 위에 그리는데, 양옆(또는 위아래)이 다 길이면 길 한가운데 잔디 섬이 됨 → 그 안내판은 흙길 위에(길도 안내판 밑으로 이어 그림, world.js)
    const SP = new Set();
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (at(x, y) === "s" && ((isP(x - 1, y) && isP(x + 1, y)) || (isP(x, y - 1) && isP(x, y + 1)))) SP.add(x + "," + y);
    if (SP.size) D._signPath = SP;
    if (n) { const nr = rows.map(r => r.join("")); for (let y = 0; y < h; y++) D.rows[y] = nr[y]; }
    D._pathTidyN = n;
  }
  buildMap = function (id) { const D = MAPS[id]; if (D) tidy(D); return b0(id); };
  window.pathTidy = tidy;   // 점검 도구용
})();
