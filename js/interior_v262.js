// ===== v2.62 건물 내부 짜임새 — 집·아파트·만물상 틀을 다시 짬 =====
//   사용자(2026-11-10): "건물 내부도 마찬가지야. 정말 별로인 부분이 많아. 이거 개선해줘."
//   전: 14×8 방 전체가 바닥이고 가구가 한가운데 떠 있음, 집 75채가 틀 넷을 그대로 나눠 씀
//   후: 방을 12칸(또는 10칸)으로 좁혀 양옆을 비우고, 가구는 뒷벽에 붙여 줄 세움 · 부엌/거실 바닥을 나눔 · 밥상·방석·깔개를 한 묶음으로
//       틀마다 2~3가지 짜임 → 집 이름으로 하나 고름(같은 집은 늘 같은 모습). 문 깔개 자리(4,6)·들어서는 자리(4,5)는 그대로
//   살펴보기(가구에 붙은 글)는 가구를 따라 옮기고, 사람은 제자리가 비면 그대로·막히면 그 짜임의 서는 자리로
//   모든 실내(굴 빼고): 뒷벽 아래 그림자 + 방 가장자리 어두운 선(입체감)
"use strict";
(() => {
  const D = MAPDATA;
  // 가구 크기와 막힘(1 = 막힘). 여기 없는 것은 1×1 막힘으로 봄
  const SZ = { tv: [2, 2], table_low: [2, 1], sofa: [2, 1], bed: [1, 2], bed_pink: [1, 2], desk: [2, 2], bookshelf: [2, 2], fridge: [1, 2], sink: [2, 2], plant: [1, 1],
    rug: [3, 2, 0], chest: [2, 1], folding_screen: [2, 2], dining: [3, 2], wardrobe: [2, 2], piano: [2, 2], aquarium: [2, 2], washer: [1, 2], computer: [1, 2], cushion: [1, 1, 0],
    washtub: [1, 1, 0], flower_pot: [1, 1], jar_in: [1, 1], baduk: [1, 1], board_in: [2, 2], stamp_stand: [1, 1], fruit_plate: [1, 1, 0], shelf: [2, 2], display: [1, 1], register: [1, 1],
    poster0: [1, 1], poster1: [1, 1], poster2: [1, 1], c_plant: [1, 2, 2], vending_in: [1, 2], c_sofa: [2, 1], c_table: [2, 2], fruit_stand: [2, 1] };
  const cellsOf = (s) => { const z = SZ[s[0]] || [1, 1], out = []; for (let dy = 0; dy < z[1]; dy++) for (let dx = 0; dx < z[0]; dx++) out.push([s[1] + dx, s[2] + dy, z[2] === 0 ? 0 : z[2] === 2 ? (dy === z[1] - 1 ? 1 : 0) : 1]); return out; };
  const room = (L, R, wall1) => { const W = 14, rows = [], line = (f) => { let s = ""; for (let x = 0; x < W; x++) s += x < L || x > R ? " " : f(x); return s; };
    rows.push(line(() => "#")); rows.push(line(x => (wall1 && wall1[x]) || "#"));
    for (let y = 2; y <= 6; y++) rows.push(line(x => y === 6 && x === 4 ? "M" : "_")); rows.push(" ".repeat(W)); return rows; };
  const zone = (fn) => fn;   // 바닥 나눔: (x, y) => 바닥 이름 또는 없음(기본)

  // ---------- 짜임 ----------
  const V = {
    // 한옥 사랑방(자개장·병풍·밥상·책장·항아리 둘·방석 둘·대야·화분 둘)
    house_a: [
      { rows: room(1, 12), spots: [[3, 4], [9, 4], [6, 5]],
        st: [["chest", 1, 1], ["folding_screen", 6, 1], ["table_low", 6, 4], ["plant", 12, 6], ["bookshelf", 9, 1], ["jar_in", 11, 2], ["jar_in", 12, 2], ["cushion", 5, 4], ["cushion", 8, 4], ["washtub", 12, 3], ["flower_pot", 1, 6],
          ["chest", 3, 1], ["fruit_plate", 6, 4], ["baduk", 10, 5], ["cushion", 9, 5], ["cushion", 11, 5]] },
      { rows: room(2, 11), spots: [[3, 4], [5, 5], [9, 5]],
        st: [["chest", 2, 1], ["folding_screen", 4, 1], ["table_low", 7, 4], ["plant", 2, 6], ["bookshelf", 8, 1], ["jar_in", 10, 2], ["jar_in", 11, 2], ["cushion", 6, 4], ["cushion", 9, 4], ["washtub", 2, 3], ["flower_pot", 11, 6],
          ["chest", 6, 1], ["fruit_plate", 8, 4]] },
      { rows: room(1, 12), spots: [[3, 4], [7, 4], [6, 5]], floorFn: zone((x) => x <= 4 ? "floor_lino" : null),
        st: [["chest", 6, 1], ["folding_screen", 10, 1], ["table_low", 9, 4], ["plant", 12, 6], ["bookshelf", 1, 1], ["jar_in", 3, 2], ["jar_in", 4, 2], ["cushion", 8, 4], ["cushion", 11, 4], ["washtub", 1, 5], ["flower_pot", 12, 2],
          ["chest", 8, 1], ["fruit_plate", 9, 4]] },
    ],
    // 한옥 살림방(반닫이 둘·병풍·밥상 둘을 이어 긴 상·장독 둘·방석 셋·대야·화분 둘)
    hanok2: [
      { rows: room(1, 12), spots: [[2, 4], [5, 5], [8, 5]], floorFn: zone((x) => x >= 10 ? "floor_earth" : null),
        st: [["chest", 1, 1], ["folding_screen", 6, 1], ["table_low", 5, 4], ["jar_in", 11, 2], ["jar_in", 12, 2], ["washtub", 12, 4], ["flower_pot", 12, 6], ["chest", 3, 1], ["table_low", 7, 4], ["cushion", 4, 4], ["cushion", 9, 4], ["plant", 1, 6], ["cushion", 6, 5],
          ["fruit_plate", 6, 4]] },
      { rows: room(2, 11), spots: [[3, 4], [5, 5], [9, 5]],
        st: [["chest", 2, 1], ["folding_screen", 7, 1], ["table_low", 6, 4], ["jar_in", 10, 2], ["jar_in", 11, 2], ["washtub", 2, 3], ["flower_pot", 2, 6], ["chest", 4, 1], ["table_low", 8, 4], ["cushion", 5, 4], ["cushion", 10, 4], ["plant", 11, 6], ["cushion", 7, 5],
          ["fruit_plate", 7, 4]] },
      { rows: room(1, 12), spots: [[2, 4], [5, 5], [6, 3]], floorFn: zone((x) => x <= 4 ? "floor_lino" : null),
        st: [["chest", 6, 1], ["folding_screen", 9, 1], ["table_low", 8, 4], ["jar_in", 1, 2], ["jar_in", 2, 2], ["washtub", 1, 4], ["flower_pot", 3, 2], ["chest", 11, 1], ["table_low", 10, 4], ["cushion", 7, 4], ["cushion", 12, 4], ["plant", 1, 6], ["cushion", 9, 5],
          ["fruit_plate", 10, 4]] },
    ],
    // 현대식 거실(냉장고·개수대·TV·책장·밥상·화분 셋·어항·식탁)
    home_s: [
      { rows: room(1, 12, { 1: "O", 4: "K", 9: "O" }), spots: [[9, 4], [6, 3], [5, 5]], floorFn: zone((x) => x >= 9 ? "floor_kitchen" : null),
        st: [["fridge", 12, 1], ["sink", 10, 1], ["tv", 2, 1], ["bookshelf", 5, 1], ["table_low", 2, 4], ["plant", 1, 6], ["plant", 9, 2], ["aquarium", 7, 1], ["dining", 10, 4], ["plant", 12, 6], ["sofa", 2, 5], ["rug", 5, 4]] },
      { rows: room(1, 12, { 4: "O", 5: "O", 12: "K" }), spots: [[4, 3], [7, 3], [8, 5]], floorFn: zone((x) => x <= 4 ? "floor_kitchen" : null),
        st: [["fridge", 1, 1], ["sink", 2, 1], ["tv", 10, 1], ["bookshelf", 6, 1], ["table_low", 10, 4], ["plant", 12, 6], ["plant", 1, 6], ["aquarium", 8, 1], ["dining", 1, 4], ["plant", 12, 2], ["sofa", 10, 5], ["rug", 6, 4]] },
      { rows: room(1, 12, { 4: "K", 7: "O", 8: "O" }), spots: [[2, 4], [7, 4], [8, 3]], floorFn: zone((x) => x <= 3 ? "floor_kitchen" : null),
        st: [["fridge", 1, 1], ["sink", 2, 1], ["tv", 5, 1], ["bookshelf", 9, 1], ["table_low", 5, 4], ["plant", 12, 6], ["plant", 1, 6], ["aquarium", 11, 1], ["dining", 9, 4], ["plant", 4, 2], ["sofa", 5, 5]] },
    ],
    // 공부방(침대·책상·컴퓨터·책장·깔개·화분 둘·옷장·피아노·소파)
    home_t: [
      { rows: room(1, 12, { 2: "O", 3: "O" }), spots: [[2, 4], [5, 3], [9, 4]],
        st: [["bed", 1, 2], ["desk", 4, 1], ["computer", 6, 1], ["bookshelf", 7, 1], ["rug", 6, 4], ["plant", 12, 6], ["wardrobe", 9, 1], ["piano", 11, 1], ["sofa", 10, 5], ["plant", 1, 6]] },
      { rows: room(1, 12, { 5: "O", 6: "O" }), spots: [[2, 4], [8, 3], [10, 4]],
        st: [["bed", 12, 2], ["desk", 9, 1], ["computer", 11, 1], ["bookshelf", 7, 1], ["rug", 5, 4], ["plant", 1, 6], ["wardrobe", 3, 1], ["piano", 1, 1], ["sofa", 9, 5], ["plant", 12, 6]] },
    ],
    // 아파트 거실
    apt_a: [
      { rows: room(1, 12, { 5: "O", 6: "O", 9: "K" }), spots: [[5, 3], [10, 5], [9, 6]], floorFn: zone((x) => x <= 4 ? "floor_kitchen" : null),
        st: [["fridge", 1, 1], ["sink", 2, 1], ["washer", 4, 1], ["dining", 1, 4], ["tv", 7, 1], ["sofa", 7, 4], ["rug", 6, 5], ["bookshelf", 10, 1], ["plant", 12, 2], ["plant", 12, 6]] },
      { rows: room(1, 12, { 7: "O", 8: "O", 4: "K" }), spots: [[5, 3], [8, 4], [3, 4]], floorFn: zone((x) => x >= 9 ? "floor_kitchen" : null),
        st: [["fridge", 12, 1], ["sink", 10, 1], ["washer", 9, 1], ["dining", 10, 4], ["tv", 5, 1], ["sofa", 5, 4], ["rug", 5, 5], ["bookshelf", 2, 1], ["plant", 1, 2], ["plant", 1, 6]] },
    ],
    // 아파트 아이 방
    apt_b: [
      { rows: room(1, 12, { 1: "O", 3: "O" }), spots: [[5, 4], [10, 5], [6, 3]],
        st: [["bed", 1, 2], ["bed_pink", 3, 2], ["desk", 5, 1], ["wardrobe", 8, 1], ["piano", 11, 1], ["rug", 7, 4], ["plant", 12, 6], ["poster1", 7, 1], ["table_low", 10, 6]] },
      { rows: room(1, 12, { 10: "O", 12: "O" }), spots: [[5, 4], [10, 5], [8, 3]],
        st: [["bed", 12, 2], ["bed_pink", 10, 2], ["desk", 6, 1], ["wardrobe", 3, 1], ["piano", 1, 1], ["rug", 6, 4], ["plant", 12, 6], ["poster1", 5, 1], ["table_low", 1, 5]] },
    ],
  };
  V.house_b = V.house_a;
  // 만물상: 뒷벽 진열대 셋·계산대·점원 자리는 그대로, 가운데 통로와 꾸밈만 세 가지
  const MART = [
    [["shelf", 4, 1], ["shelf", 6, 1], ["shelf", 8, 1], ["shelf", 5, 4], ["display", 0, 5], ["display", 9, 6], ["shelf", 8, 4], ["register", 0, 3], ["poster0", 3, 1], ["plant", 0, 6]],
    [["shelf", 4, 1], ["shelf", 6, 1], ["shelf", 8, 1], ["shelf", 6, 4], ["display", 9, 4], ["display", 9, 5], ["display", 9, 6], ["register", 0, 3], ["poster1", 3, 1], ["plant", 0, 6]],
    [["shelf", 4, 1], ["shelf", 6, 1], ["shelf", 8, 1], ["shelf", 8, 4], ["display", 5, 5], ["display", 6, 5], ["register", 0, 3], ["poster2", 3, 1], ["plant", 0, 6], ["display", 0, 5]],
  ];

  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; };
  const blockedOf = (rows, st) => { const B = new Set(); for (const s of st) for (const [x, y, sol] of cellsOf(s)) if (sol) B.add(x + "," + y);
    return (x, y) => { const c = (rows[y] || "")[x]; return !c || c !== "_" || B.has(x + "," + y); }; };
  // 들어서는 자리에서 걸어서 닿는 칸
  const reach = (rows, st) => { const blk = blockedOf(rows, st), seen = new Set(["4,5"]), q = [[4, 5]];
    while (q.length) { const [x, y] = q.shift(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (x + dx) + "," + (y + dy); if (!seen.has(k) && !blk(x + dx, y + dy)) { seen.add(k); q.push([x + dx, y + dy]); } } }
    return seen; };
  const LOG = window.INTERIOR_V262 = { moved: [], dropped: [], n: 0, ids: [] };

  function remodel(id, m, tm, v) {
    const oldRows = D[tm].rows, oldSt = D[tm].stamps, nst = v.st.map(s => s.slice());
    // 살펴보기: 옛 가구 칸 → 새 가구의 같은 칸
    const ord = (list, i) => { let n = 0; for (let k = 0; k < i; k++) if (list[k][0] === list[i][0]) n++; return n; };
    const nth = (list, name, n) => { const L = list.filter(s => s[0] === name); return L.length ? L[n % L.length] : null; };
    if (m.checks) m.checks = m.checks.map((c) => {
      const oc = (oldRows[c[1]] || "")[c[0]];
      for (let i = oldSt.length - 1; i >= 0; i--) { const s = oldSt[i], z = SZ[s[0]] || [1, 1]; if (z[2] === 0) continue;
        if (c[0] >= s[1] && c[0] < s[1] + z[0] && c[1] >= s[2] && c[1] < s[2] + z[1]) { const t = nth(nst, s[0], ord(oldSt, i)); if (t) return [t[1] + (c[0] - s[1]), t[2] + (c[1] - s[2])].concat(c.slice(2)); } }
      if (oc === "K" || oc === "O") { for (let x = 0; x < 14; x++) if (v.rows[1][x] === oc) return [x, 1].concat(c.slice(2)); }
      LOG.dropped.push([id, c[0], c[1]]); return null; }).filter(Boolean);
    // 사람: 제자리가 비고 닿으면 그대로, 아니면 서는 자리
    const R = reach(v.rows, nst), used = new Set(), ok = (x, y) => R.has(x + "," + y) && !(x === 4 && y === 5) && !used.has(x + "," + y);
    for (const n of m.npcs || []) { if (n.item) continue;
      if (ok(n.x, n.y)) { used.add(n.x + "," + n.y); continue; }
      let to = (v.spots || []).find(s => ok(s[0], s[1]));
      if (!to) { let best = 1e9; for (const k of R) { const [x, y] = k.split(",").map(Number); const d = Math.abs(x - n.x) + Math.abs(y - n.y); if (ok(x, y) && d < best) { best = d; to = [x, y]; } } }
      if (to) { LOG.moved.push([id, n.id || n.spr, n.x, n.y, to[0], to[1]]); n.x = to[0]; n.y = to[1]; used.add(to[0] + "," + to[1]); } }
    m.rows = v.rows; m.stamps = nst; if (v.floorFn) { const f = v.floorFn, base = m.floor || "floor_lino"; m.floorFn = (x, y) => f(x, y) || base; }
    LOG.n++; LOG.ids.push(id);
  }

  const baseOf = (m) => { for (const k in V) if (D[k] && m.rows === D[k].rows) return k; return null; };
  for (const [id, m] of Object.entries(MAPS)) {
    if (!m.indoor) continue;
    if (D.mart && m.rows === D.mart.rows && m.stamps === D.mart.stamps) { m.stamps = MART[hash(id) % MART.length].map(s => s.slice()); LOG.n++; continue; }
    const tm = baseOf(m); if (!tm || m.stamps !== D[tm].stamps || (m.triggers && m.triggers.length) || m.onLoad) continue;
    const vs = V[tm], free = vs.filter(v => { const R = reach(v.rows, v.st); return (m.npcs || []).every(n => n.item || (R.has(n.x + "," + n.y) && !(n.x === 4 && n.y === 5))); });
    const scripted = (m.npcs || []).some(n => n.id);      // 이야기에 쓰이는 사람이 있는 집은 사람을 옮기지 않는 짜임만
    const pool = scripted && free.length ? free : vs; remodel(id, m, tm, pool[hash(id) % pool.length]);
  }

  // ---------- 모든 실내: 뒷벽 그림자 + 방 가장자리 선 ----------
  const WALLC = "#OK", isFloor = (c) => c !== undefined && c !== " " && !WALLC.includes(c);
  for (const [id, m] of Object.entries(MAPS)) {
    if (!m.indoor || m.cave) continue;
    const prev = typeof m.under === "function" ? m.under : null;
    m.under = function (cx, cy) {
      if (prev) prev(cx, cy);
      const M = World.M; if (!M || M.def !== m) return;
      const rows = m.rows, x0 = Math.max(0, Math.floor(cx / TS)), y0 = Math.max(0, Math.floor(cy / TS));
      for (let y = y0; y <= Math.min(M.h - 1, y0 + 12); y++) for (let x = x0; x <= Math.min(M.w - 1, x0 + 16); x++) {
        const c = (rows[y] || "")[x]; if (!isFloor(c)) continue;
        const sx = x * TS - cx, sy = y * TS - cy, bare = !M.sb[y][x] && M.ob[y][x] < 0;
        const up = (rows[y - 1] || "")[x], lf = (rows[y] || "")[x - 1], rt = (rows[y] || "")[x + 1], dn = (rows[y + 1] || "")[x];
        if (up !== undefined && WALLC.includes(up) && bare) { g.fillStyle = "rgba(20,14,10,.20)"; g.fillRect(sx, sy, TS, 3); g.fillStyle = "rgba(20,14,10,.09)"; g.fillRect(sx, sy + 3, TS, 2); }
        g.fillStyle = "rgba(20,14,10,.26)";
        if (lf === undefined || lf === " ") g.fillRect(sx, sy, 2, TS);
        if (rt === undefined || rt === " ") g.fillRect(sx + TS - 2, sy, 2, TS);
        if ((dn === undefined || dn === " ") && c !== "M") g.fillRect(sx, sy + TS - 2, TS, 2);
      }
    };
  }
})();
