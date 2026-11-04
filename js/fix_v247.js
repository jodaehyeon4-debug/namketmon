// ===== v2.47 무결성 검사 고침 (사용자: "무결성검사 시작해. 특히 맵 디자인 및 레벨스케일, 전투 시 버그 및 오류 중심으로") =====
// 레벨 스케일(실제 포켓몬처럼, 도감 문서의 규칙 그대로):
//   ① 진화형은 진화 레벨보다 낮게 나오지 않음 — 풀숲·굴·낚시(파도타기는 낚시표 +5)에서 어긋난 것은 진화 레벨부터
//   ② 진화 전 모습이 진화 레벨보다 15 이상 높게 나오는 늦은 곳은 진화한 모습으로(그 종이 다른 곳에서 알맞은 레벨로 잡힐 때만 — 도감 154종은 그대로)
// 맵: 2번도로 오리정 돌길 가운데 빈칸 한 칸 메움
"use strict";
(() => {
  const ML = {}, PRE = {};
  for (const m of DATA.mons) for (const e of m.evo || []) if (typeof e[1] === "number") { PRE[e[0]] = [m.k, e[1]]; }
  const needLv = k => { let lv = 0, p = PRE[k]; while (p) { lv = Math.max(lv, p[1]); p = PRE[p[0]]; } return lv; };
  const rng = s => String(s).split(/[–~-]/).map(Number).filter(v => !isNaN(v));
  const fmt = (a, b) => a === b ? "" + a : a + "–" + b;
  const tables = [];
  for (const z in DATA.spawns) tables.push(DATA.spawns[z]);
  if (typeof FISH !== "undefined") for (const id in FISH) tables.push(FISH[id].list);
  // 다른 곳에서 '알맞은 레벨(진화 레벨+15 아래)'로 잡히는 종
  const okElsewhere = (k, self) => tables.some(L => L.some(e => e !== self && e.k === k && rng(e.lv)[0] < (((MON[k] || {}).evo || []).find(x => typeof x[1] === "number") || [0, 999])[1] + 15));
  const log = [];
  for (const L of tables) for (const e of L) {
    if (!MON[e.k]) continue;
    let [a, b] = rng(e.lv); if (b === undefined) b = a;
    // ②
    const ev = (MON[e.k].evo || []).find(x => typeof x[1] === "number");
    if (ev && a >= ev[1] + 15 && MON[ev[0]] && okElsewhere(e.k, e)) { log.push(e.k + "→" + ev[0] + " " + e.lv); e.k = ev[0]; }
    // ①
    const need = needLv(e.k);
    if (need && a < need) { log.push(e.k + " " + e.lv + "→" + fmt(need, Math.max(b, need))); a = need; b = Math.max(b, need); e.lv = fmt(a, b); }
  }
  window.LV_FIX_V247 = log;
  // 2번도로 오리정 돌길(o) 가운데 한 칸 빈 곳
  const R2 = MAPS.route2; if (R2 && R2.rows[37] && R2.rows[37][12] === "." && R2.rows[37][11] === "o" && R2.rows[37][13] === "o") { const r = R2.rows[37].split(""); r[12] = "o"; R2.rows[37] = r.join(""); }
})();

// 바리케이드는 옆 사람(공사 아저씨·경비·낚시꾼)과 함께 사라짐 — 사건 중 사람만 사라지고 바리케이드가 다시 들어올 때까지 남던 것(쪽빛 북쪽 등)
(() => {
  const ld = World.load;
  World.load = function (...a) { const r = ld.apply(this, a);
    for (const b of this.actors || []) { const m = /^(.+)_bar\d*$/.exec(b.id || ""); if (!m) continue;
      const par = this.actors.find(o => o.id === m[1]); if (!par) continue;
      let own = b.hidden; Object.defineProperty(b, "hidden", { get: () => own || par.hidden, set: v => { own = v; }, configurable: true, enumerable: true }); }
    return r; };
})();
