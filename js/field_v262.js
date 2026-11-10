// ===== v2.62 바깥 맵 짜임새 — 물가 · (아래로 계속 더함) =====
"use strict";
(() => {
  // ---------- 물가: 모래와 닿은 물은 모래 물가, 대각선만 뭍인 칸은 안쪽 모서리 ----------
  const WATER = "~hv";
  function shore(M) {
    const A = M.ts.js.auto; if (!A.shoreIn) return;
    const rows = M.def.rows, w = M.w, h = M.h;
    const at = (x, y) => (rows[clamp(y, 0, h - 1)] || "")[clamp(x, 0, w - 1)] || "T";
    const wet = (x, y) => WATER.includes(at(x, y));
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const c = M.gr[y][x]; if (!c || c.auto !== "water") continue;
      c.sandy = [[0, -1], [1, 0], [0, 1], [-1, 0]].some(([dx, dy]) => "_-".includes(at(x + dx, y + dy)));
      const IN = c.sandy && A.shoreInS ? A.shoreInS : A.shoreIn, ov = [];
      [[1, -1], [1, 1], [-1, 1], [-1, -1]].forEach(([dx, dy], i) => { if (!wet(x + dx, y + dy) && wet(x + dx, y) && wet(x, y + dy)) ov.push(IN[i]); });
      if (ov.length) c.ov2 = (c.ov2 || []).concat(ov);
    }
  }
  // ---------- 받은 시안: 붉은 소나무(송화마을 솔숲) · 벚나무(요천 둑) · 추어탕집과 소품(다홍시티) ----------
  const put = (id, list) => { const m = MAPS[id]; if (m) m.stamps = (m.stamps || []).concat(list); };
  const swap = (id, name, x, y, to) => { const m = MAPS[id]; if (!m) return; const i = (m.stamps || []).findIndex(s => s[0] === name && s[1] === x && s[2] === y); if (i >= 0) { const s = m.stamps[i].slice(); s[0] = to[0]; s[1] = to[1]; s[2] = to[2]; m.stamps = m.stamps.slice(); m.stamps[i] = s; } };
  put("songhwa", [["redpine", 4, 24], ["redpine2", 11, 24], ["redpine", 13, 24], ["redpine2", 23, 24]]);
  put("world", [["cherry", 44, 40], ["cherry", 46, 49], ["cherry", 47, 52], ["cherry", 46, 60], ["cherry", 47, 73], ["cherry", 50, 73]]);
  put("route5", [["cherry", 24, 12], ["cherry", 24, 16], ["cherry", 24, 19]]);
  // 추어탕 할아버지 댁(광한루원 건너 담 안) → 추어탕집 · 남쪽 거리 한옥 → 추어탕집 겉모습 + 골목 소품
  swap("world", "house_d", 47, 22, ["chueo_a", 46, 22]); swap("world", "house", 28, 29, ["chueo_b", 28, 29]);
  put("world", [["gamasot_c", 51, 24], ["loach_tub", 51, 23], ["siraegi", 26, 29], ["menuboard", 34, 31], ["chueo_stall", 39, 29], ["gamasot_c", 33, 31], ["lanternline", 32, 31]]);
  if (MAPS.house_dh2) MAPS.house_dh2.name = "추어탕집";
  if (MAPS.world) { MAPS.world.checks = (MAPS.world.checks || []).concat([[34, 32, "오늘의 차림: 남원 추어탕\n'미꾸라지를 곱게 갈아\f시래기와 푹 끓였어요.'"], [51, 25, "가마솥에서 추어탕이\n보글보글 끓고 있다."], [33, 32, "가마솥에서 구수한 김이\n모락모락 올라온다."], [51, 23, "나무 통 안에서 미꾸라지가\n꼬물꼬물 헤엄친다."]]); }

  // ---------- 밤 풍경: 가로등·청사초롱 불빛, 불 켜진 창, 반딧불이 ----------
  const litCache = new Map();
  function litTile(ts, i) {      // 건물 벽 타일에서 유리빛(푸른 창·어두운 창)을 따뜻한 불빛으로 바꾼 덧그림
    let c = litCache.get(i); if (c !== undefined) return c;
    const sc = ts.s || 1, T = 16 * sc, cv2 = document.createElement("canvas"); cv2.width = cv2.height = T; const x = cv2.getContext("2d");
    x.drawImage(ts.im, (i % 16) * T, Math.floor(i / 16) * T, T, T, 0, 0, T, T);
    let d; try { d = x.getImageData(0, 0, T, T); } catch (e) { litCache.set(i, null); return null; }
    const p = d.data; let n = 0;
    for (let k = 0; k < p.length; k += 4) { const r = p[k], gg = p[k + 1], b = p[k + 2], a = p[k + 3];
      const glass = a > 200 && ((b > r + 28 && b > gg + 6 && b > 120) || (r < 78 && gg < 86 && b < 120 && b > r + 10 && b > 46));
      if (glass) { const l = (r + gg + b) / 3; p[k] = 255; p[k + 1] = l > 150 ? 236 : 208; p[k + 2] = l > 150 ? 150 : 96; p[k + 3] = 235; n++; } else p[k + 3] = 0; }
    c = n >= 6 && n < T * T * 0.6 ? (x.putImageData(d, 0, 0), cv2) : null; litCache.set(i, c); return c;
  }
  const GLOW = { lamp: [8, 6, 30], lanternline: [32, 20, 40] };
  const _wd = World.draw;
  World.draw = function () {
    _wd.call(this);
    const M = this.M; if (!M || !M.outdoor || this.def.noTint || typeof timeOfDay !== "function") return;
    const tod = timeOfDay(); if (tod !== "밤" && tod !== "저녁") return;
    const k = tod === "밤" ? 1 : 0.55, [cx, cy] = this.cam || [0, 0], ST = M.ts.js.stamp, sc = M.ts.s || 1;
    g.save();
    for (const s of this.def.stamps || []) {
      const S = ST[s[0]]; if (!S) continue; const px = s[1] * TS - cx, py = s[2] * TS - cy;
      if (px > SW + 48 || py > SH + 48 || px + S.w * TS < -48 || py + S.h * TS < -48) continue;
      if (S.door && S.h >= 3) {      // 건물: 아래 두 줄의 창에 불
        g.globalAlpha = 0.92 * k;
        for (let dy = S.h - 2; dy < S.h; dy++) for (let dx = 0; dx < S.w; dx++) { const t = S.b[dy] ? S.b[dy][dx] : -1; if (t < 0) continue; const c = litTile(M.ts, t); if (c) g.drawImage(c, px + dx * TS, py + dy * TS, TS, TS); }
        g.globalAlpha = 1;
      }
      const G0 = GLOW[s[0]];
      if (G0) { const gx = px + G0[0], gy = py + G0[1], r = G0[2], gr = g.createRadialGradient(gx, gy, 1, gx, gy, r);
        gr.addColorStop(0, "rgba(255,226,140," + (0.5 * k) + ")"); gr.addColorStop(0.5, "rgba(255,200,110," + (0.2 * k) + ")"); gr.addColorStop(1, "rgba(255,190,100,0)");
        g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(gx - r, gy - r, r * 2, r * 2); g.globalCompositeOperation = "source-over"; }
    }
    if (tod === "밤") {      // 반딧불이: 풀숲·물가 가까이에서 몇 마리
      const now = performance.now() / 1000, x0 = Math.floor(cx / TS), y0 = Math.floor(cy / TS);
      for (let i = 0; i < 9; i++) { const hx = x0 + ((i * 7 + 3) % 17), hy = y0 + ((i * 5 + 2) % 12); if (hx < 0 || hy < 0 || hx >= M.w || hy >= M.h) continue;
        const b = M.beh[hy][hx]; if (b !== "grass" && b !== "water" && hash2(hx, hy) % 5) continue; if (b !== "grass" && b !== "water") continue;
        const fx = hx * TS - cx + 8 + Math.sin(now * 0.7 + i * 2.1) * 9, fy = hy * TS - cy + 6 + Math.cos(now * 0.9 + i * 1.3) * 6, a = 0.35 + 0.65 * Math.abs(Math.sin(now * 1.6 + i));
        g.fillStyle = "rgba(214,255,120," + a.toFixed(2) + ")"; g.fillRect(Math.round(fx), Math.round(fy), 1, 1); g.fillStyle = "rgba(214,255,120," + (a * 0.3).toFixed(2) + ")"; g.fillRect(Math.round(fx) - 1, Math.round(fy) - 1, 3, 3); }
    }
    g.restore();
  };

  const _bm = buildMap;
  buildMap = function (id) { const M = _bm(id); if (M.outdoor) shore(M); return M; };
  window.FIELD_V262 = true;
})();
