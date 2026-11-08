// ===== v2.49 공중날기(비전머신02) — 실제 포켓몬처럼 한 번 가 본 마을로 날아가기 =====
// 전수 점검에서 찾은 '불편': 지도가 넓은데(도로 17개) 빨리 돌아갈 방법이 없어, 반야봉 → 갈매 · 만복사지(밤) · 곁길을 다닐 때 한참 걸어야 했음
// - 감청마을 매사냥꾼 할아버지가 산성 어사패(5) 뒤 비전머신02를 줌(전북 진안 매사냥)
// - 비행 타입이나 비행 기술을 배우는 남켓몬이 배움 · 남켓몬 메뉴의 파란 '공중날기' → 타운맵에서 가 본 마을·시티를 골라 그 마을 남켓몬센터 앞으로
// - 밖에서만(건물 안·굴·리그 방에서는 못 씀) · 가 본 곳은 저장(G.flyV), 예전 저장은 어사패·사건으로 가 본 곳을 채워 줌
"use strict";
const FLY_BADGE = 5;
const FLY_DEST = {
  sosaek: ["world", "home"], dahong: ["world", "center"], jjok: ["jjok", "center_jjok"], galmae: ["galmae", "center_galmae"],
  bisaek: ["bisaek", "center_bisaek"], songhwa: ["songhwa", "center_songhwa"], juhong: ["juhong", "center_juhong"],
  gamcheong: ["gamcheong", "center_gamcheong"], ssuk: ["ssukbit", "center_ssukbit"], inwol: ["inwol", "center_inwol"],
  misaek: ["misaek", "center_misaek"], wolbaek: ["wolbaek", "center_wolbaek"], obang: ["obang", null, 19, 11],   // 오방고원: 리그 전당 문 앞
};
ITEMS.hm02 = { n: "비전머신02", p: "tm", hm: 1, tm: "fly", tmTypes: ["비행"], ic: "hm",
  d: "공중날기를 가르쳐요. 몇 번이고 쓸 수 있어요. 산성 어사패가 있으면 한 번 가 본 마을로 날아가요." };
function flyVisit(k) { if (!k || !FLY_DEST[k]) return; G.flyV = G.flyV || []; if (!G.flyV.includes(k)) G.flyV.push(k); }
function flySeed() {           // 예전 저장: 어사패·사건으로 지나온 곳
  if (G.flyV) return; G.flyV = ["sosaek", "dahong"];
  const B = n => typeof hasBadge === "function" && hasBadge(n);
  if (B(1)) flyVisit("jjok"); if (B(2)) { flyVisit("galmae"); flyVisit("bisaek"); } if (B(3)) { flyVisit("songhwa"); flyVisit("juhong"); }
  if (B(4)) flyVisit("gamcheong"); if (B(5)) flyVisit("ssuk"); if (B(6)) { flyVisit("inwol"); flyVisit("misaek"); }
  if (G.flag("banya_event_done")) flyVisit("wolbaek");
}
function flySpot(k) {
  const [map, door, fx, fy] = FLY_DEST[k]; if (fx !== undefined) return [map, fx, fy];
  const D = MAPDATA[map] && MAPDATA[map].doors && MAPDATA[map].doors[door];
  if (D) return [map, D[0], D[1] + 1];
  const M = MAPS[map]; for (const [xy, to] of Object.entries((M && M.warps) || {})) if (to && to[0] === door) { const [x, y] = xy.split(",").map(Number); return [map, x, y + 1]; }
  return null;
}
class FlyMap extends TownMap {
  constructor() {
    super(); flySeed(); const V = new Set(G.flyV);
    this.pts = this.pts.filter(p => FLY_DEST[p.id] && V.has(p.id) && flySpot(p.id));
    this.i = Math.max(0, this.pts.findIndex(p => p.id === this.here));
  }
  update(f) {
    if (!f) return;
    if (Input.rep("up")) this.move(0, -1); else if (Input.rep("down")) this.move(0, 1);
    else if (Input.rep("left")) this.move(-1, 0); else if (Input.rep("right")) this.move(1, 0);
    else if (Input.ok()) { if (this.cur) { sfx("select"); this.done(this.cur.id); } }
    else if (Input.cancel()) { sfx("cancel"); this.done(null); }
  }
  draw() {
    if (IMG.townmap) g.drawImage(IMG.townmap, 0, 0, 768, 576, 0, 0, SW, SH);
    const blink = (FRAME >> 4) & 1;
    for (const p of this.pts) { rect(p.px - 3, p.py - 3, 6, 6, "#ffffff"); rect(p.px - 2, p.py - 2, 4, 4, "#3a62c8"); }
    const c = this.cur; if (!c) return;
    const r = { city: 7, league: 7, town: 6, spot: 5 }[c.kind] || 5, col = blink ? "#f8f040" : "#e04030";
    rect(c.px - r - 1, c.py - r - 1, r * 2 + 2, 2, col); rect(c.px - r - 1, c.py + r - 1, r * 2 + 2, 2, col);
    rect(c.px - r - 1, c.py - r - 1, 2, r * 2 + 2, col); rect(c.px + r - 1, c.py - r - 1, 2, r * 2 + 2, col);
    const by = c.py > 128 ? 2 : 156;
    frame(2, by, 252, 34);
    Font.draw(g, c.n, 10, by + 3);
    Font.draw(g, "어디로 날아갈까?", 10, by + 19, { font: "g9", col: TXT.gray, sh: null });
    Font.draw(g, "A 날아가기  B 그만두기", 246, by + 6, { font: "g9", col: "#2a5aa8", sh: null, align: "right" });
    if (c.id === this.here) Font.draw(g, "지금 있는 곳", 246, by + 19, { font: "g9", col: "#2060d0", sh: null, align: "right" });
  }
}
async function useFlyFromMenu(m) {
  const d = World.def;
  if (d.indoor || d.cave || !World.M.outdoor) { await say("여기서는 쓸 수 없다."); return; }
  const k = await show(new FlyMap()); if (!k) return;
  const spot = flySpot(k); if (!spot) return;
  sfx("jump"); await fadeOut(14);
  World.load(spot[0], spot[1], spot[2], "down"); World.cam = World.camTarget();
  await frames(4); await fadeIn(14); sfx("land");
  if (World.def.onEnter) await World.run(World.def.onEnter);
}
FIELD_MOVES.fly = { badge: FLY_BADGE, use: (m) => useFlyFromMenu(m) };
// 가 본 곳 적기: 지도에 들어설 때 + 걸어서 마을 구역에 들어설 때(바깥 큰 지도는 구역이 바뀜)
(() => {
  const l0 = World.load;
  World.load = function (...a) { const r = l0.apply(this, a); try { flySeed(); flyVisit(townHere()); } catch (e) {} return r; };
  const u0 = World.update; let t = 0;
  World.update = function (...a) { if (++t % 30 === 0) { try { if (G.flyV) flyVisit(townHere()); } catch (e) {} } return u0.apply(this, a); };
})();
// 감청마을 매사냥꾼 할아버지
(() => {
  const M = MAPS.gamcheong; if (!M) return;
  M.npcs.push({ id: "gc_falconer", x: 9, y: 11, spr: "oldman", dir: "down", move: "look", heart: "감청마을 매사냥꾼", talk: async () => {   // 마음에 남는 대사는 talk 안(바람을 타고 오른다)
    if (G.has("hm02")) { await say("매사냥꾼: 매는 바람을 거스르지 않고\n바람을 타고 오른단다.\f너도 남켓몬과 함께라면\n어디든 갈 수 있을 게다."); return; }
    if (!hasBadge(FLY_BADGE)) { await say("매사냥꾼: 교룡산 바람을 타는\n매를 본 적 있니?\f감청 배움터에서 산성 어사패를\n받아 오면 하늘 길을 알려 주마."); return; }
    await say("매사냥꾼: 오, 산성 어사패로구나!\f옛사람들은 길들인 매와 함께\n산과 들을 누볐단다.\f전북 진안에는 지금도\n매사냥을 잇는 사람들이 있지.");
    await say("매사냥꾼: 이걸 가져가거라.\n하늘을 나는 비전머신이다.");
    await getItem("hm02");
    await say("매사냥꾼: 날개 있는 남켓몬에게\n공중날기를 가르쳐 두면\f한 번 가 본 마을로\n훌쩍 날아갈 수 있단다.\f남켓몬 메뉴에서\n파란 '공중날기'를 골라 보렴.");
  } });
})();
// 새 게임·불러오기: 가 본 곳을 그 저장 것으로(한 화면에서 다른 리포트로 바꿔도 섞이지 않게)
(() => {
  const r0 = G.reset; G.reset = function (...a) { const r = r0.apply(this, a); this.flyV = null; return r; };
  const ld0 = loadData; window.loadData = function (d) { const r = ld0(d); G.flyV = (d && d.G && d.G.flyV) || null; return r; };
})();
