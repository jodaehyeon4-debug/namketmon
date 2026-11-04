// ===== v2.10 명소: 만복사지(1번도로 북서쪽 — 밤에만 열리는 옛 절터)
//   타운맵 '고려 때 큰 절이 있던 옛 절터예요. 게임에서는 밤에만 들어갈 수 있는 신비한 곳'. 어사패 넷(구룡) 뒤 · 밤(저녁 8시~새벽 4시)에만 들어감
//   — 낮에는 지킴이가 "해가 지면 열려요"(회중시계로 시간을 넘길 수 있음을 알려 줌)
//   돌부처님과 '저포 놀이'(만복사저포기에서 양생이 부처와 저포 놀이를 함) — 나무 막대 다섯 개 던지기, 세 판 두 번 이기면 선물(밤마다 한 번)
//   오층석탑 둘레의 하얀 나비(복나비·가람 복선 — 설정 '만복사지에서 가람을 키운 혼', 클리어 뒤 이야기)
// chapter14.js 뒤, hearts.js 앞에 읽힘
// 사실(위키백과 '남원 만복사지'): 남원시 왕정동, 1991년 사적, 고려 문종(1046~1083) 때 지어진 것으로 전함, 석조여래입상·오층석탑·석조대좌·당간지주(보물),
//   정유재란 때 남원읍성이 함락될 때 불에 탔다고 함 / '만복사저포기': 김시습 『금오신화』, 남원에 사는 양생이 부처와 저포 놀이를 해 이기고 처녀의 혼령과 가약을 맺음
//   (아이 눈높이로 '신비한 아가씨를 만났다는 이야기'까지만)
"use strict";
(function fixSpawn15() { if (DATA.spawns["만복사지"]) DATA.spawns["만복사지"] = DATA.spawns["만복사지"].filter(e => !["honguseong", "eunjikseong", "boknabi"].includes(e.k)).map(e => ({ ...e, t: "모두" })); })();
if (typeof HIDDEN !== "undefined") HIDDEN.manboksa = [[37, 2, "spelltag" in ITEMS ? "spelltag" : "ether"], [4, 29, "maxether"]];
const isNight = () => timeOfDay() === "밤";
let MB_FX = 0;

async function mbGateBlock() {
  if (!hasBadge(4)) await say("지킴이: 만복사지는 어사패를\n넷 모은 트레이너만 들어가요.\f밤길이 어둡거든요.");
  else await say("지킴이: 만복사지는\n해가 지면 열려요.\f(회중시계로 게임 시계를 쓰면\n시간을 넘길 수 있어요.)");
  await walk(World.player, "right");
}

function mbGateCond() {   // 왼쪽(절터 쪽)으로 들어갈 때만 막음. 낮에 지나가면 저포 놀이가 다시 열림
  if (!isNight()) G.flag("jeopo_played", false);
  return World.player.dir === "left" && !(hasBadge(4) && isNight());
}
function throwSticks() { let n = 0; const s = []; for (let i = 0; i < 5; i++) { const f = Math.random() < 0.5; if (f) n++; s.push(f ? "●" : "○"); } return { n, s: s.join("") }; }
async function jeopoGame() {
  if (!isNight()) { await say("돌로 만든 부처님이\n고요히 서 계신다.\f'석조여래입상' — 보물이다."); return; }
  if (G.flag("jeopo_played")) { await say("돌부처님이 빙그레\n웃으시는 것 같다.\f(저포 놀이는 하룻밤에\n한 번만 할 수 있다.)"); return; }
  await say("돌부처님 앞에 나무 막대\n다섯 개가 놓여 있다.\f옛이야기 속 양생처럼\n저포 놀이를 해 볼까?");
  const c = await ask("막대를 던져 볼까?", ["예", "아니오"]);
  if (c !== 0) return;
  await say("나무 막대를 던져 앞면(●)이\n더 많이 나온 쪽이 이겨요.\f세 판 가운데 두 번 이기면\n승리!");
  let me = 0, bu = 0;
  for (let round = 1; round <= 3 && me < 2 && bu < 2; round++) {
    let a, b;
    do { a = throwSticks(); b = throwSticks(); } while (a.n === b.n);
    sfx("select");
    await say(`${round}판: 나 ${a.s}  ${a.n}\n부처님 ${b.s}  ${b.n}`);
    if (a.n > b.n) { me++; await say("이겼다!"); } else { bu++; await say("졌다……"); }
  }
  G.flag("jeopo_played", true);   // 밤이 아닐 때 1번도로 입구를 지나면 다시 할 수 있음(mbGateCond)
  if (me >= 2) {
    await say("돌부처님이 빙그레\n웃으시는 것 같다……!");
    if (!G.flag("jeopo_first")) { G.flag("jeopo_first", true); await getItem("spelltag" in ITEMS ? "spelltag" : "ether"); }
    else { const L = ["ether", "superpotion", "ok"]; await getItem(L[Math.floor(Math.random() * L.length)]); }
  } else await say("돌부처님이 '다음에 또 오너라'\n하시는 것 같다.");
}

async function pagodaCheck() {
  if (isNight()) { MB_FX = 1; await say("오층석탑 둘레를 하얀 나비\n한 마리가 맴돌고 있다……"); await say("나비는 달빛 속으로\n사라졌다."); MB_FX = 0; return; }
  await say("다섯 층 돌탑이다.\f'오층석탑' — 보물이다.");
}

(function attachChapter15() {
  const D = MAPDATA;
  // ---- 1번도로 북서쪽 → 만복사지 ----
  const W = MAPS.world;
  W.warps = (W.warps || []).concat([42, 43].map(y => [0, y, ["manboksa", 39, y - 28, "left", "edge"]]));
  W.triggers = (W.triggers || []).concat([42, 43].map(y => ({ x: 2, y, cond: mbGateCond, run: mbGateBlock })));
  W.signs.push([16, 41, "← 만복사지\n고려 때 큰 절이 있던 옛 절터 · 밤에만"]);
  W.npcs.push({ id: "w_mb_keeper", x: 3, y: 41, spr: "ranger", dir: "down", move: "look",
    talk: () => say(isNight() ? "지킴이: 밤길 조심하세요.\f옛 절터는 조용히\n둘러봐 주세요." : "지킴이: 만복사지는\n해가 지면 열려요.") });

  const M = D.manboksa;
  MAPS.manboksa = {
    rows: M.rows, stamps: M.stamps, name: "만복사지",
    warps: [14, 15].map(y => [39, y, ["world", 0, y + 28, "right", "edge"]]),
    zones: [["만복사지", 0, 0, 39, 31]],
    zinfo: { "만복사지": { bgm: "ojakgyo", enc: "만복사지", rate: 0.12, bg: "grass" } },
    over(cx, cy) {
      if (!MB_FX) return;
      const t = FRAME / 10, ax = 15 * TS - cx + 8 + Math.cos(t) * 18, ay = 5 * TS - cy + Math.sin(t * 1.3) * 10;
      const f = Math.floor(FRAME / 6) % 2;
      const x0 = Math.round(ax), y0 = Math.round(ay), W = f ? [4, 4, 3, 2, 1] : [2, 2, 2, 1, 1];   // 날갯짓 두 장(펼침·접힘)
      g.globalAlpha = 0.95; g.fillStyle = "#ffffff";
      W.forEach((w, r) => { g.fillRect(x0 - w, y0 + r, w, 1); g.fillRect(x0 + 1, y0 + r, w, 1); });
      g.fillStyle = "#b8b8cc"; g.fillRect(x0, y0, 1, 5);                                       // 몸
      g.globalAlpha = 0.45; g.fillStyle = "#ffffff";                                            // 지나간 자리 반짝임
      g.fillRect(Math.round(x0 - Math.cos(t) * 6), Math.round(y0 + 6 - Math.sin(t * 1.3) * 3), 1, 1);
      g.globalAlpha = 1;
    },
    signs: [[36, 13, "만복사지\f고려 문종 때 지었다고 전해지는\n큰 절이 있던 터예요.\f정유재란 때 불에 탔다고 해요.\n1991년에 사적이 되었어요."],
      [12, 12, "만복사저포기\f김시습의 『금오신화』에 실린\n이야기의 무대예요.\f외로운 청년 양생이 부처님과\n저포 놀이를 해서 이기고\f신비한 아가씨를 만났다는\n이야기가 전해져요."]],
    checks: [[6, 7, jeopoGame], [7, 7, jeopoGame], [6, 8, jeopoGame], [7, 8, jeopoGame],
      [14, 6, pagodaCheck], [15, 6, pagodaCheck], [14, 7, pagodaCheck], [15, 7, pagodaCheck],
      [24, 7, "부처님을 모셨던 돌 받침이다.\f'석조대좌' — 보물이다."], [25, 7, "부처님을 모셨던 돌 받침이다.\f'석조대좌' — 보물이다."],
      [24, 8, "부처님을 모셨던 돌 받침이다."], [25, 8, "부처님을 모셨던 돌 받침이다."],
      [33, 11, "절 앞에 깃발 장대를 세우던\n돌기둥 한 쌍이다.\f'당간지주' — 보물이다."], [34, 11, "절 앞에 깃발 장대를 세우던\n돌기둥 한 쌍이다."],
      [33, 12, "'당간지주' — 보물이다."], [34, 12, "'당간지주' — 보물이다."]],
    areas: [],
    npcs: [
      { id: "mb_guide", x: 30, y: 13, spr: "woman", dir: "down", move: "look",
        talk: "해설사: 여기에는 보물이\n넷이나 남아 있어요.\f돌부처님, 오층석탑, 돌 받침,\n그리고 당간지주예요." },
      { id: "mb_oldman", x: 10, y: 14, spr: "oldman", dir: "up", move: "look",
        talk: "할아버지: 옛날엔 이 터에\n큰 절이 있었단다.\f지금은 주춧돌만 남았지만\n자리는 그대로지." },
      { item: "ether", x: 31, y: 22 }, { item: "ok", n: 2, x: 9, y: 26 },
      { x: 26, y: 16, spr: "kid_m", dir: "left", trainer: { id: "mb_junseo", cls: "밤 탐방 소년", name: "준서", spr: "kid_m", range: 3, base: 16, team: [["bangato", 30], ["dochaedong", 31]],
        intro: "밤 탐방 왔어!\n무섭지 않아…… 진짜야!", lose: "역시 조금 무섭다……", after: "달빛이 밝으니까\n하나도 안 무서워." } },
      { x: 20, y: 22, spr: "kid_f", dir: "right", trainer: { id: "mb_haeun", cls: "꼬마 숙녀", name: "해은", spr: "kid_f", range: 4, base: 16, team: [["yeopjeoni", 28, { mv: ["chargebeam", "mirrorshot", "metalsound", "block"] }], ["dukkeojang", 30]],
        intro: "밤에만 나오는 남켓몬을\n찾고 있어!", lose: "오늘은 여기까지……", after: "밤에는 풀숲 소리가\n더 크게 들려." } },
      { x: 8, y: 22, spr: "hiker", dir: "right", trainer: { id: "mb_sangho", cls: "탐방객", name: "상호", spr: "hiker", range: 3, base: 20, team: [["dungabi", 30], ["megijang", 30]],
        intro: "옛 절터에 오면\n마음이 차분해지지.\f……배틀은 신나게!", lose: "허허, 마음이 들뜨는구먼.", after: "주춧돌을 보면 옛 절이\n얼마나 컸는지 알 수 있지." } },
    ],
  };
  Object.assign(TOWN_ZONE, { "만복사지": "manboksa" });
})();
