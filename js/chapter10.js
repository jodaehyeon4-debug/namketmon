// ===== v2.5 반야봉 1차(중간 절정): 뱀사골 위쪽 안개가 걷힘 → 반야봉 — 구상나무 숲 좁은 고개에서 행수 솔뫼 ② → 정상 본디회 의식
//   행수 여울 ②(배틀 뒤 돌아섬) → 대방(가면)이 오작 전설을 깨움 → 홍우성이 가람을 택함 → 가람 ④ → 제단에 남은 '별돌'(은직성이 잠듦)
//   설정집 '반야봉 1차: 행수 여울 ②·행수 솔뫼 ②·가람 ④' · 스토리 초안 '중간 절정 — 버전의 반대쪽 전설이 깨어나 가람을 영웅으로 택한다.
//   주인공에게는 다른 전설이 잠든 별돌이 남는다. 생태: 말라 죽은 구상나무 숲(기후 변화)'
//   버전이 없으므로 가람 = 홍우성('지켜 온 것'), 주인공 별돌 = 은직성('새로 짜는 것')으로 고정(미결정 D18, Claude)
//   대방은 가면을 썼지만 뒤로 넘긴 회색 머리·금테 안경·황금 박 지팡이가 이사장과 같음 = 정체 복선(공개는 절정)
// chapter9.js 뒤, hearts.js 앞에 읽힘
// 사실(위키백과 '반야봉'·'지리산'): 반야봉 1,732m, 지리산 제2봉, 주릉에서 벗어나 있음, 반야낙조는 지리십경의 하나 / 구상나무는 지리산 특산식물
//   (구상나무가 따뜻해진 날씨로 말라 간다는 것은 도감 설명 — 대사에서는 '그렇다고들 하지'로)
"use strict";
if (!ITEMS.byeoldol) ITEMS.byeoldol = { n: "별돌", p: "key", ic: "byeoldol",
  d: "반야봉 제단에 남은 남빛 돌. 은하수 같은 빛이 잠들어 있어요. 오작의 '새로 짜는 것'이 깃든 쪽이래요." };   // v2.37 가방 설명 세 줄에 맞춤
(function fixTownLv10() { if (DATA.spawns["반야봉"]) DATA.spawns["반야봉"] = DATA.spawns["반야봉"].filter(e => !["horyeongsan", "unhaeryong", "cheonmireu", "hwaryongjeong"].includes(e.k)).map(e => ({ ...e, lv: "42–46" })); })();
if (typeof HIDDEN !== "undefined") HIDDEN.banya = [[3, 36, "maxrevive"], [39, 37, "fullrestore"], [30, 49, "maxelixir"]];
let BANYA_FX = null;                       // { t, k: 'honguseong' | 'glow' } 의식 연출
async function camPan(to, n = 30) {         // 카메라를 천천히 위(음수)·아래로 옮김 — 실제 게임의 전설 등장 연출처럼
  const from = World.camDY || 0;
  for (let i = 1; i <= n; i++) { World.camDY = Math.round(from + (to - from) * (1 - Math.cos(Math.PI * i / n)) / 2); await frames(1); }
}

// =====================================================================
// 1. 구상나무 숲 좁은 고개: 행수 솔뫼 ② (에이스 반달장군 — 설정집 '반야봉 1차에서 길을 막음')
// =====================================================================
const SOLMOE2 = { id: "solmoe2", cls: "본디회 행수", name: "솔뫼", spr: "solmoe", base: 60, music: "bondi", bgm: "trainer",
  intro: "솔뫼: 또 너냐.\f여기서부터는 지나갈 수 없다.\n이 산의 문은 내가 닫는다!",
  lose: "솔뫼: ……반달장군이\n쓰러지다니.",
  team: [["jiriam", 48, { mv: ["rocktomb", "bulldoze", "harden", "leer"] }],
         ["maetdolmet", 50, { mv: ["bulldoze", "rockthrow", "growl", "harden"] }],
         ["bandaljanggun", 51, { mv: ["brickbreak", "slash", "scaryface", "leer"] }]] };
async function solmoe2Event() {
  const P = World.player, S = act("by_solmoe");
  if (!S || G.flag("solmoe2_done")) return;
  bgm("bondi");
  await walkPath(P, 21, 32); P.dir = "up"; face(S, P);
  await emote(S, "excl", 24);
  await say("솔뫼: ……교룡산성의 그 아이.");
  await say("솔뫼: 봐라, 이 구상나무들.\f하얗게 말라 서 있는 게\n다 죽어 가는 나무다.");
  await say("솔뫼: 날이 따뜻해져서\n그렇다고들 하지.\f……그게 다 누구 탓이냐.");
  const r = await trainerBattle({ x: S.x, y: S.y, dir: S.dir, trainer: SOLMOE2 }, false);
  if (r !== "win") return;
  bgm("bondi");
  await emote(S, "dots", 36);
  await say("솔뫼: ……이 숲이 아픈 건\n사람 탓이다.\f그런데 이 숲을 걱정하는 것도\n사람이로구나.");
  await say("솔뫼: 정상에서 대방님이\n의식을 하신다.\f……가라. 나는 이 숲에\n조금 더 있겠다.");
  sfx("exit"); await fadeOut(8); S.x = 19; S.y = 27; S.dir = "right"; await fadeIn(8);
  G.flag("solmoe2_done", true);
  zoneBgm();
}

// =====================================================================
// 2. 정상: 본디회 의식 — 여울 ② · 대방(가면) · 오작 전설(홍우성)이 가람을 택함 · 가람 ④ · 별돌
// =====================================================================
const YEOUL2 = { id: "yeoul2", cls: "본디회 행수", name: "여울", spr: "yeoul", base: 60, music: "bondi", bgm: "trainer",
  intro: "여울: ……미안.\n지금은 비켜 줄 수 없어.",
  lose: "여울: ……물살이 바뀌었네.",
  team: [["ssogalbeom", 48, { mv: ["waterpulse", "bite", "scaryface", "leer"] }],
         ["chamjipwang", 48, { mv: ["bubblebeam", "metalclaw", "protect", "growl"] }],
         ["megijang", 49, { mv: ["mudshot", "waterpulse", "harden", "tickle"] }]] };
const GARAM4 = { id: "garam4", cls: "도령", name: "가람", spr: "garam", base: 40, music: "garam", bgm: "trainer", canLose: true,
  intro: "가람: 너하고는……\n한 번 더 붙어 보고 싶었어.\f네 남켓몬들 목소리,\n마지막으로 들어 볼게.",
  lose: "가람: ……들렸어.\f'이 아이 곁이라 좋다'고.\n……정말이구나.",
  loseText: "가람: ……괜찮아?\f남켓몬들이 놀랐을 거야.\n쉬게 해 줄게.",
  team: [["gusangryeong", 40, { mv: ["avalanche", "megadrain", "leer", "growl"] }],
         ["seorikkot", 39, { mv: ["icywind", "fairywind", "growl", "protect"] }],
         ["beondami", 40, { mv: ["aircutter", "shockwave", "growl", "protect"] }],
         ["seonrok", 41, { mv: ["psybeam", "fairywind", "yawn", "growl"] }]] };
async function banyaEvent() {
  const P = World.player, D = act("by_daebang"), GR = act("by_garam"), Y = act("by_yeoul"), U1 = act("by_g1"), U2 = act("by_g2");
  if (!D || G.flag("banya_event_done")) return;
  bgm("bondi");
  await walkPath(P, 21, 12); P.dir = "up";
  await camPan(-64, 36);
  await say("구름바다 위, 돌 고리 둘레에\n흰 도포를 입은 사람들이 서 있다.");
  await say("???: ……드디어 이 자리에 섰구나.\f오작이 잠든, 반야봉 꼭대기에.");
  await say("붉은 인장 가면을 쓴 사람이\n황금 박 지팡이를 짚고 있다.\f가면 위로 금테 안경이\n번쩍인다……");
  await say("대방: 견우와 직녀는 본디\n하나였다.\f사람들이 '지킬 것이냐,\n새로 만들 것이냐'를 두고 다투자\f오작은 둘로 갈라졌지.");
  await say("대방: 오늘 오작을 깨워\f남켓몬을 모두 본디 자리로\n돌려보내리라.");
  // 여울 ②
  if (Y) { face(Y, P); await walkTo(Y, 22, 10); face(Y, P); }
  await emote(Y, "excl", 22);
  await say("여울: ……너구나.\n섬진강에서 본.");
  await say("여울: 나도 모르겠어.\f그 금박재단 공사……\n대방님은 정말 모르셨을까.");
  let r = await trainerBattle({ x: Y.x, y: Y.y, dir: Y.dir, trainer: YEOUL2 }, false);
  if (r !== "win") return;
  bgm("bondi");
  await say("여울: ……강이 흐르듯,\n나도 멈춰 있을 수만은 없겠다.");
  await say("여울: 나, 섬진강으로 돌아갈게.\f그 공사 장부,\n내가 꼭 찾아볼 거야.");
  await say("여울: ……네 남켓몬들,\n많이 지쳤네.\f자, 강물 한 모금.\n이건 그냥 주는 거야.");
  G.healAll(); await Audio2.jingle("jg_heal"); await say("남켓몬들이 기운을 되찾았다!");
  if (Y) { await walkTo(Y, 23, 10); await walkTo(Y, 23, 16); Y.hidden = true; }
  if (D) await emote(D, "dots", 30);
  await say("대방: ……여울.\n쯧, 물은 결국 제 길로 흐르는군.");
  // 의식
  bgm("ojak");
  await camPan(-96, 40);
  await say("대방: 오작이여, 깨어나라!");
  sfx("gong");
  for (let i = 0; i < 3; i++) { await fadeOut(4, "#ffffff"); await fadeIn(4, "#ffffff"); }
  BANYA_FX = { t: 0, k: "honguseong" };
  try { Audio2.cry("honguseong"); } catch (e) {}
  await frames(50);
  await say("구름바다가 갈라지고,\f불타는 쟁기 뿔의 남켓몬이\n솟아올랐다!");
  await say("홍우성은 둘레를 천천히\n둘러보더니……\f가람 앞에 멈춰 섰다.");
  if (GR) { await walkTo(GR, 21, 8); GR.dir = "up"; }
  await frames(30);
  await say("가람: ……들렸어.\f'지켜 온 것을 지켜 달라'고.");
  await say("가람: 사람 곁에 있으면\n남켓몬은 닳고 지쳐.\f그러니까……\n사람과 남켓몬을 떼어 놓겠어.");
  if (GR) face(GR, P);
  await say("대방: 오작의 반쪽이\n도령을 택했다!");
  // 가람 ④
  r = await trainerBattle({ x: GR.x, y: GR.y, dir: GR.dir, trainer: GARAM4 }, false);
  bgm("garam");
  if (r !== "win") { G.healAll(); await Audio2.jingle("jg_heal"); await say("남켓몬들이 기운을 되찾았다!"); }
  await say("가람: ……너는 남켓몬 목소리를\n듣는구나. 나랑은 다른 방법으로.");
  await say("가람: 그래도 나는 내 길로 갈게.\f……다음에 만나면,\n그땐 전설과 함께야.");
  // 별돌
  BANYA_FX = { t: 0, k: "glow" };
  await say("제단 가운데에서 작은 돌 하나가\n희미하게 빛나고 있다……");
  await say("대방: 그 돌은 남은 반쪽,\n'새로 짜는 것'이다.\f……깨어나지도 못하는 돌,\n아이에게 줘 버려라.");
  sfx("exit"); await fadeOut(12, "#ffffff");
  for (const a of [D, GR, U1, U2]) if (a) a.hidden = true;
  World.camDY = 0;
  BANYA_FX = { t: 0, k: "glow" };
  await fadeIn(12, "#ffffff");
  await say("구름 속으로 대방과 가람,\n그리고 홍우성이 사라졌다.");
  await walkTo(P, 21, 7); P.dir = "up";
  await getItem("byeoldol");
  await say("별돌 안에서 은하수 같은 빛이\n천천히 맴돈다.\f……아직 잠들어 있는 것 같다.");
  BANYA_FX = null;
  G.flag("banya_event_done", true);
  bgm("banya");
  await say("구름바다 너머로 해가 기운다.\f반야봉의 해넘이, 반야낙조는\n지리산 열 가지 경치의 하나다.");
  await say("(지리산 둘레 곳곳에\n새 길이 열렸어요.\f어사패 일곱을 모았다면\n갈매마을에 가 보세요.)");
}

// =====================================================================
// 지도에 붙이기
// =====================================================================
(function attachChapter10() {
  const D = MAPDATA;
  // ---- 뱀사골 위쪽: 단원 습격 뒤 안개가 걷힘 ----
  const BSM = MAPS.baemsagol;
  for (const id of ["bs_ranger_top", "bs_ranger_top2"]) { const w = BSM.npcs.find(n => n.id === id); if (w) w.show = () => !G.flag("baemsa_event_done"); }
  { const o = BSM.over; BSM.over = function (cx, cy) { if (!G.flag("baemsa_event_done")) o.call(this, cx, cy); }; }
  BSM.warps = (BSM.warps || []).concat([19, 20].map(x => [x, 0, ["banya", x + 2, 59, "up", "edge"]]));
  { const s = BSM.signs.find(s => s[0] === 21 && s[1] === 8); if (s) s[2] = () => G.flag("baemsa_event_done") ? "↑ 반야봉(1,732m)\n지리산 제2봉" : "↑ 반야봉\n— 짙은 안개로 통제 중"; }
  BSM.npcs.push({ id: "bs_ranger_open", x: 21, y: 6, spr: "ranger", dir: "left", move: "look", show: () => G.flag("baemsa_event_done"),
    talk: "지킴이: 안개가 걷혔어요!\f그런데 아까 흰 도포 입은\n사람들이 잔뜩 올라갔어요.\f……조심해요." });

  // ---- 반야봉 ----
  const BY = D.banya;
  MAPS.banya = {
    rows: BY.rows, stamps: BY.stamps, name: "반야봉",
    warps: [21, 22].map(x => [x, 59, ["baemsagol", x - 2, 0, "down", "edge"]]),
    zones: [["반야봉", 0, 0, 43, 59]],
    zinfo: { "반야봉": { bgm: () => G.flag("banya_event_done") ? "banya" : "bondi", enc: "반야봉", rate: 0.12, bg: "grass" } },
    over(cx, cy) {
      if (!BANYA_FX) return;
      BANYA_FX.t++;
      const ax = 21 * TS - cx + 8, ay = 4 * TS - cy + 8;
      if (BANYA_FX.k === "honguseong") {
        const a = Math.min(1, BANYA_FX.t / 40);
        g.globalAlpha = a * 0.35; g.fillStyle = "#ffb060"; g.beginPath(); g.arc(ax, ay, 46 + Math.sin(BANYA_FX.t / 9) * 4, 0, Math.PI * 2); g.fill();
        g.globalAlpha = a; monFront("honguseong", ax - 48, ay - 60 + Math.round(Math.max(0, 1 - BANYA_FX.t / 40) * 24)); g.globalAlpha = 1;
      } else {
        const r = 6 + Math.sin(BANYA_FX.t / 8) * 2;
        g.globalAlpha = 0.5; g.fillStyle = "#c8d8ff"; g.beginPath(); g.arc(ax, ay, r + 6, 0, Math.PI * 2); g.fill();
        g.globalAlpha = 0.9; g.fillStyle = "#ffffff"; g.beginPath(); g.arc(ax, ay, r / 2, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
      }
    },
    signs: [[23, 56, "반야봉 오르는 길\n↓ 뱀사골"], [23, 33, "구상나무 숲\f우리나라에만 사는 나무.\n하얗게 마른 나무가 늘고 있어요."],
      [23, 15, "반야봉 정상\n구름바다 조심!"]],
    checks: [[27, 2, "'반야봉 1,732m'\f지리산에서 두 번째로\n높은 봉우리다."], [27, 3, "'반야봉 1,732m'"],
      [20, 6, "돌 고리 제단.\f가운데 넓적한 돌에\n별 모양 홈이 패어 있다."], [22, 6, "돌 고리 제단."]],
    areas: [
      { x0: 21, y0: 32, x1: 22, y1: 33, cond: () => !G.flag("solmoe2_done"), run: solmoe2Event },
      { x0: 12, y0: 10, x1: 31, y1: 13, cond: () => !G.flag("banya_event_done"), run: banyaEvent },
    ],
    npcs: [
      { id: "by_solmoe", x: 21, y: 30, spr: "solmoe", dir: "down", move: "fixed", show: () => !G.flag("solmoe2_done"), talk: () => solmoe2Event() },
      { id: "by_solmoe_after", x: 19, y: 27, spr: "solmoe", dir: "right", move: "look", show: () => G.flag("solmoe2_done"),
        talk: "솔뫼: 구상나무는 찬 바람을\n버티며 수백 년을 산다.\f……버티는 것만으론\n안 되는 때도 있는 거겠지." },
      { id: "by_daebang", x: 21, y: 6, spr: "daebang", dir: "down", move: "fixed", show: () => !G.flag("banya_event_done"), talk: () => banyaEvent() },
      { id: "by_garam", x: 18, y: 7, spr: "garam", dir: "up", move: "fixed", show: () => !G.flag("banya_event_done") },
      { id: "by_yeoul", x: 24, y: 7, spr: "yeoul", dir: "left", move: "fixed", show: () => !G.flag("banya_event_done") },
      { id: "by_g1", x: 16, y: 5, spr: "bondi", dir: "right", move: "fixed", show: () => !G.flag("banya_event_done") },
      { id: "by_g2", x: 26, y: 5, spr: "bondi", dir: "left", move: "fixed", show: () => !G.flag("banya_event_done") },
      { id: "by_hiker", x: 12, y: 43, spr: "man", dir: "right", move: "look", talk: "등산객: 반야봉은 지리산 큰 능선에서\n살짝 비켜나 있어.\f그래서 오르는 길이\n한 번 더 꺾이지." },
      { item: "maxpotion", x: 4, y: 45 }, { item: "fullheal", x: 36, y: 50 }, { item: "ok", n: 3, x: 15, y: 46 }, { item: "maxrevive", x: 28, y: 37 },
      { x: 32, y: 40, spr: "kid_m", dir: "left", trainer: { id: "by_jun", cls: "등산 소년", name: "준혁", spr: "kid_m", range: 3, base: 18, team: [["neodeolba", 43], ["bagureong", 43]],
        intro: "정상까지 얼마 안 남았어!\n그 전에 한 판!", lose: "숨이 찬다……", after: "높이 올라올수록\n숨 쉬는 게 힘들어." } },
      { x: 9, y: 48, spr: "kid_f", dir: "right", trainer: { id: "by_sowon", cls: "꼬마 숙녀", name: "소원", spr: "kid_f", range: 3, base: 16, team: [["seorikkot", 44]],
        intro: "산꼭대기는 여름에도\n추워!", lose: "꽁꽁 얼었다……", after: "높은 산은 날씨가\n빨리 바뀌어." } },
      { x: 30, y: 15, spr: "bugboy", dir: "left", trainer: { id: "by_eunho", cls: "벌레잡이", name: "은호", spr: "bugboy", range: 3, base: 16, team: [["beondami", 44]],
        intro: "구름 위에도\n잠자리가 날아!", lose: "구름 속으로 날아갔다……", after: "잠자리는 바람을 타고\n높이 올라온대." } },
    ],
  };
  Object.assign(TOWN_ZONE, { "반야봉": "banya" });
})();
