// ===== 필드: 지도 만들기·그리기·이동·풀숲·문·사람·트레이너 시선·스크립트 =====
"use strict";
const TSET = {};
function tsInit() {
  for (const n of ["out", "in"]) TSET[n] = { im: IMG["tiles_" + n], js: JSN["tiles_" + n], s: (JSN["tiles_" + n] && JSN["tiles_" + n].scale) || 1 };
}
// v2.18 타일 그리기 도우미: 타일 그림이 2배 촘촘(32칸)이어도 화면에는 16칸 자리에 그림(캔버스가 2배라 촘촘함이 그대로 보임)
function tileAt(ts, i, x, y) {
  if (i == null || i < 0) return; const s = ts.s || 1, C = TS * s;
  g.drawImage(ts.im, (i % 16) * C, Math.floor(i / 16) * C, C, C, x, y, TS, TS);
}
const CH = () => JSN.chars, MISC = () => JSN.misc;
const WALK_SPD = 16 / 12, RUN_SPD = 16 / 6;     // 칸당 12프레임(걷기), 6프레임(달리기)
const OBJ_CH = "fwbkjnsxARYWi";   // v2.22 i = 집 앞마당 얇은 울타리          // v2.0 x = 풀베기로 베어 낼 수 있는 가는 나무
//          // 바닥 위에 겹치는 물체 문자
const SOLID_T = new Set(["fence_h", "fence_v", "fence_c", "wall_h", "wall_v", "wall_c", "sign", "rock", "bush", "jar", "post"]);
// v1.4 게임 시계: 실제 시각(기본) 또는 게임 시계(실제 1초 = 게임 1분, 하루 24분). 회중시계로 바꾸고 넘긴다
function gameNow() {
  const d = new Date();
  if (G.clock && G.clock.mode === "game") { const m = ((G.clock.min % 1440) + 1440) % 1440; d.setHours(Math.floor(m / 60), m % 60, 0, 0); }
  return d;
}
const todOf = h => h >= 4 && h < 10 ? "아침" : h < 17 ? "낮" : h < 20 ? "저녁" : "밤";
function timeOfDay() { return todOf(gameNow().getHours()); }
// ---- v1.2 날씨: 지역 기후 × 계절(실제 달력) × 시간대. 3시간마다 바뀐다 ----
const CLIMATE = {   // 지역 → 기후 (low 들판·마을, city 도시, river 강가, valley 계곡, high 고원, peak 높은 봉우리)
  "다홍시티": "city", "광한루원": "low", "1번도로": "low", "소색마을": "low", "요천 둔치": "river",
  "도통동": "city", "사매": "low", "덕과": "low", "송동": "low", "주생": "low", "대산": "low", "이백": "low", "보절": "low", "산동": "low", "금지": "river", "대강": "river",
  "교룡산성": "high", "춘향테마파크": "low", "만복사지": "low", "인월": "low", "아영": "low", "운봉": "high", "바래봉": "high",
  "산내": "valley", "뱀사골": "valley", "주천·구룡계곡": "valley", "반야봉": "peak", "노고단": "peak",
};
const CLIM_MUL = { low: {}, city: { fog: .5, sand: 1.3 }, river: { fog: 2.5, rain: 1.1 }, valley: { rain: 1.4, fog: 1.8, sand: .4 },
  high: { fog: 2.2, hail: 1.5, sand: .6, sun: 1.2 }, peak: { fog: 3, hail: 2.5, rain: 1.2, sand: .3 } };
function wxOdds(prof, month, tod, ymd) {
  // 남원 계절 날씨(대략): 겨울 눈, 봄 황사, 6월 말~7월 장마, 8월 불볕, 가을 아침 강안개
  const B = { 12: { hail: .18, fog: .05, rain: .03 }, 1: { hail: .22, fog: .04 }, 2: { hail: .14, fog: .05, rain: .04 },
    3: { sand: .12, rain: .08, fog: .05 }, 4: { sand: .16, rain: .09, sun: .04 }, 5: { sand: .08, rain: .08, sun: .10 },
    6: { rain: .22, sun: .14 }, 7: { rain: .42, sun: .10 }, 8: { sun: .30, rain: .18 },
    9: { sun: .12, rain: .10, fog: .08 }, 10: { fog: .10, rain: .06, sun: .06 }, 11: { fog: .09, rain: .07, hail: .03, sun: .03 } }[month];
  const o = {}, M = CLIM_MUL[prof] || {};
  for (const k of ["rain", "sun", "sand", "hail", "fog"]) {
    let v = (B[k] || 0) * (M[k] || 1);
    if (k === "hail" && prof === "peak" && [3, 4, 11].includes(month)) v = Math.max(v, .2);        // 높은 봉우리는 늦가을·이른 봄에도 눈
    if (k === "sun") v *= tod === "낮" ? 1 : tod === "아침" ? .4 : 0;                             // 밤에는 쨍쨍한 햇살이 없다
    if (k === "fog") v *= tod === "아침" ? 2 : tod === "낮" ? .5 : 1;
    o[k] = v;
  }
  const tot = Object.values(o).reduce((a, b) => a + b, 0);
  if (tot > .85) for (const k in o) o[k] *= .85 / tot;
  return o;
}
function fieldWeather(zone, date) {
  if (World.wxForce !== undefined) return World.wxForce;
  const prof = CLIMATE[zone]; if (!prof) return null;
  const d = date || gameNow(), h = d.getHours();
  const tod = h >= 4 && h < 10 ? "아침" : h < 17 ? "낮" : h < 20 ? "저녁" : "밤";
  const day = d.getFullYear() * 400 + (d.getMonth() + 1) * 32 + d.getDate(), blk = Math.floor(h / 3);
  let zh = 0; for (const ch of zone) zh = (zh * 31 + ch.charCodeAt(0)) >>> 0;
  const r = (hash2(day * 8 + blk, zh % 9973) % 10000) / 10000;
  const o = wxOdds(prof, d.getMonth() + 1, tod);
  let acc = 0; for (const k of ["rain", "sun", "sand", "hail", "fog"]) { acc += o[k]; if (r < acc) return k; }
  return null;
}
// 처음 만나는 날씨마다 한 번 알려 주는 탐구 쪽지
const WX_TIP = {
  rain: ["비가 내리고 있다!", "비가 오면 물 기술은 세지고\n불꽃 기술은 약해진다.", "물을 좋아하는 남켓몬이\n풀숲에서 더 자주 나타난다!"],
  sun: ["햇살이 쨍쨍하다!", "햇살 아래에서는 불꽃 기술이\n세지고 물 기술은 약해진다.", "불꽃·풀 타입 남켓몬이\n더 자주 나타난다!"],
  sand: ["황사 섞인 모래바람이 분다!", "봄이면 멀리 사막에서 날아온\n황사가 하늘을 뿌옇게 덮는다.", "모래바람은 바위·땅·강철 타입이\n아니면 조금씩 데미지를 준다.", "땅·바위 타입 남켓몬이\n더 자주 나타난다!"],
  hail: ["싸라기눈이 내리고 있다!", "싸라기눈은 얼음 타입이 아니면\n조금씩 데미지를 준다.", "얼음 타입 남켓몬이\n더 자주 나타난다!"],
  fog: ["짙은 안개가 끼었다!", "밤새 식은 공기 속 수증기가\n땅 가까이 엉기면 안개가 된다.", "높은 산에서 내려다보면\n구름바다 '운해'가 된다.", "안개 속에서는 기술이 잘 빗나간다.\n고스트·에스퍼 타입이 자주 나온다!"],
};
const WX_TYPES = { rain: ["물"], sun: ["불꽃", "풀"], sand: ["땅", "바위"], hail: ["얼음"], fog: ["고스트", "에스퍼"] };

const hash2 = (x, y) => { let h = x * 374761393 + y * 668265263; h = (h ^ (h >>> 13)) * 1274126177; return (h ^ (h >>> 16)) >>> 0; };

// v2.20 풀숲·꽃밭 덩어리 가운데 30% 안팎을 들쭉날쭉하게: 모서리를 깎고 가장자리를 물어뜯음(풀을 빼기만 함 → 막힘·억지 풀숲 없음)
function shapePatches(id, def) {
  def._shaped = true;
  const R = def.rows.map(r => r.split("")), H = R.length, key = (x, y) => x + "," + y;
  const keep = new Set();
  for (const n of def.npcs || []) keep.add(key(n.x, n.y));
  for (const a of [def.warps || [], def.signs || [], def.checks || []]) for (const e of a) keep.add(key(e[0], e[1]));
  let idh = 0; for (const ch of id) idh = (idh * 31 + ch.charCodeAt(0)) >>> 0;
  for (const ch of ['"', "t"]) {
    const seen = R.map(r => new Uint8Array(r.length));
    for (let y = 0; y < H; y++) for (let x = 0; x < R[y].length; x++) {
      if (R[y][x] !== ch || seen[y][x]) continue;
      const cells = [], q = [[x, y]]; seen[y][x] = 1;
      while (q.length) { const [cx, cy] = q.pop(); cells.push([cx, cy]);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy;
          if (ny >= 0 && ny < H && nx >= 0 && nx < R[ny].length && R[ny][nx] === ch && !seen[ny][nx]) { seen[ny][nx] = 1; q.push([nx, ny]); } } }
      if (cells.length < 8) continue;
      let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1; for (const [cx, cy] of cells) { x0 = Math.min(x0, cx); y0 = Math.min(y0, cy); x1 = Math.max(x1, cx); y1 = Math.max(y1, cy); }
      if (x1 - x0 < 2 || y1 - y0 < 2) continue;
      let sd = hash2(x0 * 7 + (idh % 997), y0 * 13 + ch.charCodeAt(0)); const rnd = () => (sd = (Math.imul(sd, 1103515245) + 12345) >>> 0) / 4294967296;
      if (rnd() >= 0.3) continue;
      const set = new Set(cells.map(([cx, cy]) => key(cx, cy))), gone = [];
      const cut = (cx, cy) => { const k = key(cx, cy); if (set.has(k) && !keep.has(k)) { set.delete(k); gone.push([cx, cy]); } };
      const big = x1 - x0 >= 4 && y1 - y0 >= 3;
      for (const [cx, cy, dx, dy] of [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]]) {
        if (rnd() < 0.25) continue;
        cut(cx, cy);
        const r2 = rnd(); if (big && r2 < 0.45) cut(cx + dx, cy); else if (big && r2 < 0.8) cut(cx, cy + dy);
        if (big && rnd() < 0.3) { cut(cx + dx, cy); cut(cx, cy + dy); }
      }
      for (const [len, along] of [[x1 - x0 + 1, "top"], [x1 - x0 + 1, "bottom"], [y1 - y0 + 1, "left"], [y1 - y0 + 1, "right"]]) {
        if (len < 5 || rnd() < 0.45) continue;
        const p = 2 + Math.floor(rnd() * (len - 4)), n = 1 + (rnd() < 0.4 && len >= 7 ? 1 : 0);
        for (let k = 0; k < n; k++) {
          if (along === "top") cut(x0 + p + k, y0); else if (along === "bottom") cut(x0 + p + k, y1);
          else if (along === "left") cut(x0, y0 + p + k); else cut(x1, y0 + p + k);
        }
      }
      // 끊기거나 너무 줄면 되돌림
      const left = [...set]; let ok = left.length >= cells.length * 0.65;
      if (ok) { const st = new Set([left[0]]), qq = [left[0]];
        while (qq.length) { const [cx, cy] = qq.pop().split(",").map(Number);
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = key(cx + dx, cy + dy); if (set.has(k) && !st.has(k)) { st.add(k); qq.push(k); } } }
        ok = st.size === left.length; }
      if (ok) for (const [cx, cy] of gone) R[cy][cx] = ".";
    }
  }
  def.rows = R.map(r => r.join(""));
}

// v2.21 건물 밑 잔디: 문 있는 건물이 보도·광장·흙길 위에 서 있으면, 건물 발 칸과 건물에 붙은 외톨이 잔디(작은 덩어리)를 둘레 바닥으로
//   (사용자: "집 밑에 띨롱 잔디밭인게 너무 어색함") — 잔디밭 위의 시골집은 그대로
function fixYards(def, ST) {
  def._yards = true;
  const R = def.rows.map(r => r.split("")), H = R.length, PAV = "pqDydy:_-", GR = ".,";
  const at = (x, y) => (R[y] || [])[x];
  const own = new Set();
  for (const s of def.stamps || []) { const S = ST[s[0]]; if (!S) continue; for (let j = 0; j < S.h; j++) for (let i = 0; i < S.w; i++) own.add((s[1] + i) + "," + (s[2] + j)); }
  const keep = new Set(); for (const n of def.npcs || []) keep.add(n.x + "," + n.y);
  for (const s of def.stamps || []) {
    const S = ST[s[0]]; if (!S || !S.door || S.w < 3) continue;
    if (def.name !== "용성지방" && /^(house|thatch|senior|mokgi)/.test(s[0])) continue;   // v2.22 시골 마을 집은 앞마당(잔디 + 얇은 울타리)으로 — 보도로 바꾸지 않음
    const [, sx, sy] = s, cnt = {}; let ring = 0;
    for (let x = sx - 1; x <= sx + S.w; x++) for (const y of [sy - 1, sy + S.h]) { const c = at(x, y); if (c === undefined || own.has(x + "," + y)) continue; ring++; cnt[c] = (cnt[c] || 0) + 1; }
    for (let y = sy; y < sy + S.h; y++) for (const x of [sx - 1, sx + S.w]) { const c = at(x, y); if (c === undefined || own.has(x + "," + y)) continue; ring++; cnt[c] = (cnt[c] || 0) + 1; }
    let best = null, bn = 0, pav = 0; for (const c in cnt) if (PAV.includes(c)) { pav += cnt[c]; if (cnt[c] > bn) { bn = cnt[c]; best = c; } }
    const grass = (cnt["."] || 0) + (cnt[","] || 0);
    if (!best || (pav < ring * 0.45 && !(grass < ring * 0.3))) continue;   // 둘레가 거의 보도 · 또는 잔디가 거의 없고(꽃밭·보도로 둘러싸임) 보도가 닿음
    // 발 칸
    for (let j = 0; j < S.h; j++) for (let i = 0; i < S.w; i++) { const x = sx + i, y = sy + j; if (GR.includes(at(x, y))) R[y][x] = best; }
    // 건물에 붙은 작은 잔디 덩어리(6칸 이하, 건물·보도·꽃밭으로 둘러싸임)
    const seen = new Set();
    for (let y = sy - 1; y <= sy + S.h; y++) for (let x = sx - 1; x <= sx + S.w; x++) {
      const GRF = GR + "RYW";   // 외톨이 칸 위 꽃 한 송이도 함께
      if (!GRF.includes(at(x, y) || "#") || seen.has(x + "," + y) || own.has(x + "," + y)) continue;
      const comp = [], q = [[x, y]]; seen.add(x + "," + y); let open = false;
      while (q.length && comp.length <= 6) { const [cx, cy] = q.pop(); comp.push([cx, cy]);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy, k = nx + "," + ny, c = at(nx, ny);
          if (c === undefined) { open = true; continue; }
          if (GRF.includes(c) && !own.has(k)) { if (!seen.has(k)) { seen.add(k); q.push([nx, ny]); } } } }
      if (open || comp.length > 6 || q.length) continue;
      for (const [cx, cy] of comp) R[cy][cx] = best;
    }
  }
  // 보도 한가운데 외톨이 꽃밭·잔디(2칸 이하, 사방이 보도) → 보도 (네모 한 칸 꽃밭이 동동 떠 보이지 않게)
  const W0 = Math.max(...R.map(r => r.length)), seen2 = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W0; x++) {
    const c0 = at(x, y); if (!c0 || !"t.,RYW".includes(c0) || seen2.has(x + "," + y) || own.has(x + "," + y)) continue;
    const comp = [], q = [[x, y]], nb = {}; seen2.add(x + "," + y); let bad = false;
    while (q.length) { const [cx, cy] = q.pop(); comp.push([cx, cy]); if (comp.length > 2 || keep.has(cx + "," + cy)) bad = true;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy, k = nx + "," + ny, c = at(nx, ny);
        if (c === undefined) { bad = true; continue; }
        if ("t.,RYW".includes(c) && !own.has(k)) { if (!seen2.has(k)) { seen2.add(k); q.push([nx, ny]); } }
        else if (PAV.includes(c)) nb[c] = (nb[c] || 0) + 1; else bad = true; } }
    if (bad) continue;
    let best = null, bn = 0; for (const c in nb) if (nb[c] > bn) { bn = nb[c]; best = c; }
    if (best) for (const [cx, cy] of comp) R[cy][cx] = best;
  }
  def.rows = R.map(r => r.join(""));
}

// v2.22 마을·길마다 분위기(사용자: "필드 색 각 마을마다 분위기 달라지게 채도 조절") — 이름 색을 따라
//   s = 채도(+ 진하게 / − 엷게), c = 덧입히는 빛(부드러운 빛 섞기), a = 그 세기. 지역이 바뀌면 1초쯤에 걸쳐 천천히 바뀜
const MOOD = {
  "다홍시티": { s: 0.14, c: [255, 170, 110], a: 0.10 }, "광한루원": { s: 0.10, c: [255, 180, 130], a: 0.08 }, "춘향제 마당": { s: 0.16, c: [255, 160, 120], a: 0.10 },
  "소색마을": { s: -0.20, c: [240, 228, 205], a: 0.12 }, "요천 둔치": { s: -0.04, c: [200, 225, 240], a: 0.08 },
  "쪽빛마을": { s: -0.06, c: [96, 130, 214], a: 0.14 }, "갈매마을": { s: 0.06, c: [60, 130, 80], a: 0.12 }, "비색마을": { s: -0.10, c: [140, 210, 190], a: 0.14 },
  "송화마을": { s: 0.06, c: [240, 214, 96], a: 0.13 }, "주홍마을": { s: 0.16, c: [255, 130, 70], a: 0.11 }, "감청마을": { s: -0.06, c: [70, 90, 170], a: 0.15 },
  "쑥빛시티": { s: -0.14, c: [150, 176, 120], a: 0.13 }, "인월장터": { s: 0.08, c: [255, 196, 130], a: 0.09 }, "미색마을": { s: -0.22, c: [255, 240, 205], a: 0.15 },
  "월백마을": { s: -0.18, c: [225, 236, 255], a: 0.15 }, "섬진강 나루": { s: -0.04, c: [170, 210, 230], a: 0.10 },
  "반야봉": { s: -0.16, c: [210, 225, 245], a: 0.14 }, "뱀사골": { s: -0.08, c: [120, 170, 160], a: 0.12 }, "바래봉": { s: 0.06, c: [255, 170, 200], a: 0.10 },
  "구룡계곡": { s: -0.04, c: [130, 190, 200], a: 0.10 }, "교룡산성": { s: -0.10, c: [190, 180, 160], a: 0.10 }, "만복사지": { s: -0.20, c: [170, 170, 210], a: 0.12 },
};
function moodFor(zn) { const m = MOOD[zn]; return m ? { s: m.s * 1.4, c: m.c, a: m.a * 1.4 } : { s: 0, c: [255, 255, 255], a: 0 }; }
function drawMood(m) {
  if (!m || (Math.abs(m.s) < 0.005 && m.a < 0.005)) return;
  g.save();
  if (m.s < -0.005) { g.globalCompositeOperation = "saturation"; g.globalAlpha = Math.min(1, -m.s); g.fillStyle = "#808080"; g.fillRect(0, 0, SW, SH); }
  else if (m.s > 0.005) { g.globalCompositeOperation = "saturation"; g.globalAlpha = Math.min(1, m.s * 0.6); g.fillStyle = "#ff2020"; g.fillRect(0, 0, SW, SH); }
  if (m.a > 0.005) { g.globalCompositeOperation = "soft-light"; g.globalAlpha = Math.min(1, m.a * 2.2); g.fillStyle = `rgb(${m.c.map(Math.round).join(",")})`; g.fillRect(0, 0, SW, SH); }
  g.restore();
}

// ---- 지도 만들기 ----
// v2.23 대숲 고르기: 몸(바탕·줄기·뒤 잎, 8×8칸 무늬) + 앞 잎(8×5칸 무늬) + 끝 덧그림
//   끝 변형 ev = 서쪽이 비면 1 | 동쪽이 비면 2 → 바깥 줄기에서 끝나고 잎이 바깥으로 늘어짐
//   위가 비면 잎 머리(아래 절반은 이 칸, 위 절반은 위 칸 사람 위층) · 아래가 비면 밑동·그늘·죽순
//   계단 모양 안쪽 모서리(옆 칸은 이어지는데 그 위·아래가 빔)는 그쪽 띠만 잎 머리·밑동
function bamTiles(B, x, y, bm) {
  const m = (v, n) => ((v % n) + n) % n, cx = m(x, 8);
  const n = bm(x, y - 1), s = bm(x, y + 1), w = bm(x - 1, y), e = bm(x + 1, y);
  const ev = (w ? 0 : 1) | (e ? 0 : 2);
  const ov = [B.front[ev * 40 + m(y, 5) * 8 + cx]], up = [];
  if (!n) { ov.push(B.top[ev * 8 + cx]); up.push(B.over[ev * 8 + cx]); }
  else {
    if (e && !bm(x + 1, y - 1)) { ov.push(B.top[32 + cx]); up.push(B.over[32 + cx]); }
    if (w && !bm(x - 1, y - 1)) { ov.push(B.top[40 + cx]); up.push(B.over[40 + cx]); }
  }
  if (!s) ov.push(B.base[ev * 8 + cx]);
  else {
    if (e && !bm(x + 1, y + 1)) ov.push(B.base[32 + cx]);
    if (w && !bm(x - 1, y + 1)) ov.push(B.base[40 + cx]);
  }
  return { ob: B.body[ev * 64 + m(y, 8) * 8 + cx], ov: ov.filter(i => i >= 0), up: up.filter(i => i >= 0) };
}
function buildMap(id) {
  const def = MAPS[id]; const ts = TSET[def.ts || (def.indoor ? "in" : "out")];
  // v2.24 하트골드식: 풀숲·꽃밭 모서리 깎기(v2.20 shapePatches) 끔 — 모든 경계는 반듯한 직각
  // v2.18 실내 2배 촘촘: 지도마다 바꿔 쓰는 이름(배움터마다 제 문제판·매트, 작은 마트는 가게 바닥·벽)
  const AL = def.indoor && ts.js.alias ? ts.js.alias[id] || ts.js.alias[id.split("_")[0]] : null;
  const aliasOf = (base) => { if (!AL) return base; const o = Object.create(base); for (const k in AL) if (base[AL[k]] !== undefined) o[k] = base[AL[k]]; return o; };
  const T = aliasOf(ts.js.t), ST = aliasOf(ts.js.stamp);
  // v2.24: 건물 밑 보도 깔기(v2.21 fixYards) 삭제 — 건물은 언제나 잔디 위
  const WU = def.indoor ? ts.js.winUp : null, WF = ts.js.winFor || {};
  // v2.20 같은 자리에 쓸 수 있는 변형 그림(바닥·덤불·바위·떨기나무·꽃) — 칸 자리 해시로 하나
  const VAR = ts.js.vari || null, AV = ts.js.animVar || {};
  const vh = (x, y, s) => hash2(x * 5 + 3 + s, y * 7 + 11);
  const vpick = (t, x, y) => { const L = VAR && t != null && VAR[t]; return L ? L[vh(x, y, 0) % L.length] : t; };
  const apick = (k, x, y) => { const L = AV[k]; return L ? L[vh(x, y, 1) % L.length] : k; };       // 창·벽시계·매트는 벽/바닥 위에 겹쳐 그림(창은 두 칸 높이)
  const rows = def.rows, h = rows.length, w = Math.max(...rows.map(r => r.length));
  const M = { id, def, ts, w, h, gr: [], ob: [], bo: [], bt: [], sb: [], st: [], solid: [], beh: [], warps: {}, signs: {}, checks: {}, outdoor: !def.indoor };
  const at = (x, y) => { const c = (rows[y] || "")[x]; if (c) return c; if (def.indoor) return " ";
    const e = (rows[clamp(y, 0, h - 1)] || "")[clamp(x, 0, w - 1)]; return e === ":" || e === "~" || "dpqyhvo".includes(e) ? e : "T"; };   // v2.1 가장자리 길·물은 바깥으로 이어짐
  // v2.40 돌길(p)·흙길 갈래(d·q·y)·다리(h·v·o)로 끝나는 출구도 바깥으로 이어짐 — 전엔 ':'만 이어 봐서 2번도로 남쪽·6번도로·섬진강 나루·8번도로 출구 칸이
  //   '끝난 길'(아래 테두리 있음)로 그려지고, 지도 밖에 그 칸을 되풀이해 흙길이 줄마다 끊긴 띠처럼 보였음(사용자 스크린샷)
  for (let y = 0; y < h; y++) { M.gr.push([]); M.ob.push([]); M.bo.push([]); M.bt.push([]); M.sb.push([]); M.st.push([]); M.solid.push([]); M.beh.push([]);
    for (let x = 0; x < w; x++) { M.gr[y].push(null); M.ob[y].push(-1); M.bo[y].push(null); M.bt[y].push(null); M.sb[y].push(null); M.st[y].push(null); M.solid[y].push(false); M.beh[y].push(null); } }
  const groundOf = (c) => !OBJ_CH.includes(c);
  const under = (x, y) => { for (const [dx, dy] of [[-1, 0], [0, -1], [1, 0], [0, 1], [-1, -1], [1, 1]]) { const c = at(x + dx, y + dy); if (groundOf(c) && !"TP~LBUCXHVOeulmQ%/".includes(c)) return c; } return def.under || "."; };
  // v2.47 울타리·담·덤불 등 물체 밑 바닥: 흙길 안쪽(사방 중 셋 이상이 흙길)일 때만 흙길, 아니면 잔디 — 흙길 가장자리 울타리 밑에
  //   흙길 한 칸이 혹처럼 삐져나오던 것(사용자 "울타리 밑에 흙길이 단 하나만 있는 경우") 없앰
  const underObj = (x, y) => { let n = 0; for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) if (":dpqDyhvo".includes(at(x + dx, y + dy))) n++;
    if (n >= 3) return under(x, y);
    const cnt = {}; for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) { const c = at(x + dx, y + dy); if (groundOf(c) && !"TP~LBUCXHVOeulmQ%/N\"".includes(c) && !":dpqDyhvo".includes(c)) cnt[c] = (cnt[c] || 0) + 1; }
    let best = null; for (const c in cnt) if (best === null || cnt[c] > cnt[best] || (cnt[c] === cnt[best] && c === ".")) best = c;   // 사방에서 가장 많은 바닥(같으면 잔디)
    return best || def.under || "."; };
  const same = (x, y, set) => set.includes(at(x, y));
  const mask = (x, y, set) => (same(x, y - 1, set) ? 1 : 0) | (same(x + 1, y, set) ? 2 : 0) | (same(x, y + 1, set) ? 4 : 0) | (same(x - 1, y, set) ? 8 : 0);
  // v2.13 벼랑·산울타리·대숲: 맵 밖도 이어진 것으로 봄(가장자리에서 끊겨 보이지 않게)
  const sameIn = (x, y, set) => x < 0 || y < 0 || x >= w || y >= h || set.includes(at(x, y));
  const BAM = !def.indoor && ts.js.auto.bam && false;      // v2.23 통짜 대숲은 안 씀(v2.24 2×2 덤불)
  M.bamC = (x, y) => at(clamp(x, 0, w - 1), clamp(y, 0, h - 1)) === "V";      // v2.23 대숲 이웃(지도 밖은 가장자리 칸과 같게)
  const maskIn = (x, y, set) => (sameIn(x, y - 1, set) ? 1 : 0) | (sameIn(x + 1, y, set) ? 2 : 0) | (sameIn(x, y + 1, set) ? 4 : 0) | (sameIn(x - 1, y, set) ? 8 : 0);
  // v2.24 흙길 이웃 8방향(N1 E2 S4 W8 NE16 SE32 SW64 NW128). 다리·징검돌·건물 문은 길로 봄(문 앞 길이 문에 붙음)
  const PATHN = ":dpqDyhvo", DOORC = new Set();
  for (const s of def.stamps || []) { const S = ST[s[0]]; if (S && S.door && s[3] && s[3].to) DOORC.add((s[1] + S.door[0]) + "," + (s[2] + S.door[1])); }
  const SGP = def._signPath || null;      // v2.40 길 한가운데 안내판은 흙길 위(fix_v240 다듬기)
  const pn = (x, y) => PATHN.includes(at(x, y)) || DOORC.has(x + "," + y) || (SGP !== null && SGP.has(x + "," + y));
  const pv = (x, y) => ":dpqDy".includes(at(x, y));      // v2.24 길 옆 잔디 덮개용(흙길만)
  const pmask8 = (x, y) => (pn(x, y - 1) ? 1 : 0) | (pn(x + 1, y) ? 2 : 0) | (pn(x, y + 1) ? 4 : 0) | (pn(x - 1, y) ? 8 : 0) |
    (pn(x + 1, y - 1) ? 16 : 0) | (pn(x + 1, y + 1) ? 32 : 0) | (pn(x - 1, y + 1) ? 64 : 0) | (pn(x - 1, y - 1) ? 128 : 0);
  // v2.24 숲 그늘: 사방이 나무인 칸(나무 덩어리 안쪽)은 바닥을 어두운 숲 그늘로 — 나무가 빽빽하게 겹친 느낌
  const WOOD = "TPV";
  // v2.63 숲 그늘 바닥은 여덟 방향이 모두 나무인 칸만(숲 가장자리에서 어두운 네모가 잔디 위로 삐져나와 보이던 것)
  const wd = (x, y) => WOOD.includes(at(x, y));
  const woods = (x, y) => T.forest !== undefined && wd(x, y - 1) && wd(x + 1, y) && wd(x, y + 1) && wd(x - 1, y) && wd(x - 1, y - 1) && wd(x + 1, y - 1) && wd(x - 1, y + 1) && wd(x + 1, y + 1) ? T.forest : T.grass;
  function ground(c, x, y) {
    if (def.indoor) {
      switch (c) {
        case " ": return { t: T.void, solid: true };
        case "_": return { t: T[def.floorFn ? def.floorFn(x, y) : def.floor2 && (x + y) % 2 ? def.floor2 : def.floor || "floor_lino"] };
        case "F": { const rl = def.rail || "rail", J = at(x, y - 1) === "V" ? T[rl + "_v_join"] : undefined;     // v2.46 위에서 내려온 세로 칸막이가 가로 칸막이에 닿게(밑에 깔기)
          return Object.assign({ t: T[def.floor2 && (x + y) % 2 ? def.floor2 : def.floor || "floor_lino"], ob: T[rl], solid: true }, J !== undefined ? { ov2: [J] } : {}); }
        case "V": { const rl = def.rail || "rail", up = at(x, y - 1), mid = (up === "V" || up === "F") && T[rl + "_v_mid"] !== undefined;   // v2.27 세로 칸막이 · v2.46 이어지는 칸은 위 마개 없이(한 줄로 이어짐)
          return { t: T[def.floor2 && (x + y) % 2 ? def.floor2 : def.floor || "floor_lino"], ob: T[rl + (mid ? "_v_mid" : "_v")], solid: true }; }
        case "#": { if (def.cave) { const face = at(x, y + 1) !== "#"; return { t: T[def.wall + (face ? "_b" : "_t")], solid: true }; }   // v2.33 굴: 아래가 트인 칸 = 바위 벽면, 나머지 = 바위 윗면
          const top = at(x, y - 1) !== "#" && at(x, y - 1) !== "O" && at(x, y - 1) !== "K"; return { t: T[(def.wall || "wall_home") + (top ? "_t" : "_b")], solid: true }; }
        case "O": { const wl = def.wall || "wall_home"; let wk = def.win || "win_home"; if (wk === "win_home" && WF[wl]) wk = WF[wl];
          return WU ? { t: T[wl + "_b"], ob: T[wk], solid: true } : { t: T[wk], solid: true }; }
        case "K": return WU ? { t: T[(def.wall || "wall_home") + "_b"], ob: T.wall_clock, solid: true } : { t: T.wall_clock, solid: true };
        case "M": return WU ? { t: ground("_", x, y).t, ob: T.mat, beh: "mat" } : { t: T.mat, beh: "mat" };
        case "I": return { t: T[def.slideFloor || "floor_flour"], beh: "slide" };          // v1.9 미끄러지는 바닥(밀가루 등)
        case "^": case "v": case "<": case ">": { const d = { "^": "up", "v": "down", "<": "left", ">": "right" }[c]; return { t: T["arrow_" + d[0]], beh: "arrow_" + d }; }   // v2.1 은신처 굴림 바닥
        case "c": { const l = at(x - 1, y) === "c", r = at(x + 1, y) === "c"; return { t: T[def.floor || "floor_tile"], ob: T[!l ? "counter_l" : !r ? "counter_r" : "counter_m"], solid: true, beh: "counter" }; }
        default: return { t: T[def.floor || "floor_lino"] };
      }
    }
    switch (c) {
      case ".": { const v = hash2(x, y) % 9, g = { t: T[v === 0 ? "grass2" : v === 1 ? "grass3" : "grass"] };
        // v2.24 길 옆 잔디: 흙 얼룩·조약돌 덮개로 경계를 풀어 줌(무늬 셋 중 하나)
        const VG = ts.js.auto.verge; if (VG) { const m = (pv(x, y - 1) ? 1 : 0) | (pv(x + 1, y) ? 2 : 0) | (pv(x, y + 1) ? 4 : 0) | (pv(x - 1, y) ? 8 : 0); if (m) g.ov2 = [VG[m * 3 + vh(x, y, 5) % 3]]; }
        return g; }
      case "%": {   // v2.24 언덕(높은 땅): 사방이 언덕인 칸은 윗면(걸어 다님), 가장자리는 비탈(막힘)
        const HL = ts.js.auto.hill; if (!HL) return { t: T.grass };
        const hk = (X, Y) => "%/".includes(at(clamp(X, 0, w - 1), clamp(Y, 0, h - 1)));
        const m8 = (hk(x, y - 1) ? 1 : 0) | (hk(x + 1, y) ? 2 : 0) | (hk(x, y + 1) ? 4 : 0) | (hk(x - 1, y) ? 8 : 0) | (hk(x + 1, y - 1) ? 16 : 0) | (hk(x + 1, y + 1) ? 32 : 0) | (hk(x - 1, y + 1) ? 64 : 0) | (hk(x - 1, y - 1) ? 128 : 0);
        if (m8 === 255) { const v = hash2(x, y) % 9; return { t: T[v === 0 ? "grass2" : v === 1 ? "grass3" : "grass"] }; }   // v2.63 언덕 위도 들판과 같은 잔디
        return (m8 & 15) === 15 ? { t: HL[m8] } : { t: HL[m8], solid: true }; }
      case "/": { const SS = ts.js.auto.stairs; if (!SS) return { t: T.grass };   // v2.24 돌계단(언덕 남쪽 비탈)
        return { t: SS[(at(x + 1, y) === "/" ? 1 : 0) | (at(x - 1, y) === "/" ? 2 : 0)] }; }
      case ",": return { t: T.grass };                                    // v2.24 꽃풀 → 맨 잔디
      case '"': return { t: T.tallgrass, beh: "grass" };
      case "T": return { t: woods(x, y), ob: ST.tree.b[((y % 2) + 2) % 2][((x % 2) + 2) % 2], solid: true };
      case "P": return { t: woods(x, y), ob: ST.pine.b[((y % 2) + 2) % 2][((x % 2) + 2) % 2], solid: true };
      case "O": return { t: T.grass, ob: T.rock, solid: true };                                   // v2.13 바위 무더기(2×2 맞춤은 fitTrees)
      case "X": return { t: T.grass, ob: ts.js.auto.cliff ? ts.js.auto.cliff[maskIn(x, y, "X") + (ts.js.auto.cliff.length > 16 ? (hash2(x, y) % 2) * 16 : 0)] : T.rock, solid: true };   // v2.13 바위 벼랑
      case "H": return { t: T.grass, ob: ts.js.auto.hedge ? ts.js.auto.hedge[maskIn(x, y, "H")] : T.bush, solid: true };   // v2.13 산울타리
      case "V": return { t: woods(x, y), ob: ST.bamboo ? ST.bamboo.b[((y % 2) + 2) % 2][((x % 2) + 2) % 2] : T.bush, solid: true };   // v2.24 대나무 덤불 2×2(나무처럼 격자, fitTrees)
      case ":": case "d": case "p": case "q": case "D": case "y": {   // v2.24 흙길 하나로(격자 보도블록·광장 판석 대신 밝은 황토 흙길, 8방향 이음·직선 테두리)
        const P8 = ts.js.auto.path8;
        if (!P8) { const m = mask(x, y, ":hvo"); return { auto: "path", m }; }
        const m8 = pmask8(x, y); return { t: m8 === 255 && ts.js.auto.pathFill ? ts.js.auto.pathFill[vh(x, y, 2) % 4] : P8[m8] }; }
      case "~": return { auto: "water", m: mask(x, y, "~hv"), solid: true, beh: "water" };
      case "_": return { t: T.sand }; case "-": return { t: T.sand2 };
      // v2.24: p·q(보도)·D·y(광장)는 위 흙길로
      case "r": return { t: T.road }; case "=": return { t: T.road_lh }; case "I": return { t: T.road_lv };
      case "z": return { t: T.cross_h }; case "Z": return { t: T.cross_v };
      // v2.15 도시: 노란 중앙선 차도(e·u 가로, l·m 세로) · 주차칸(Q) · 광장 판석(D·y)
      case "e": return { t: T.road_cb }; case "u": return { t: T.road_ct }; case "l": return { t: T.road_cr }; case "m": return { t: T.road_cl };
      case "Q": return { t: T.parking };
      case "t": return { anim: "flower_r" };                              // v2.24 다색 꽃밭 대신(지도에는 남기지 않음)
      case "o": {   // v2.21 꽃밭·돌길: 8×8칸 큰 무늬의 제 자리 조각 + 끝나는 쪽은 풀 덮개(돌·꽃을 통째로 덮는 물결 풀 띠)
        const AU = ts.js.auto, F = c === "t" ? AU.flowerField : AU.stoneField, E = c === "t" ? AU.flowerEdge : AU.stoneEdge;
        if (!F) return c === "t" ? { t: T["flowers_dense" + (hash2(x, y) % 3)] } : { t: T.stones };
        const k = (((y % 8) + 8) % 8) * 8 + (((x % 8) + 8) % 8), ov2 = [];
        [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy], sd) => { if (at(x + dx, y + dy) !== c) ov2.push(E[k * 4 + sd]); });
        return ov2.length ? { t: F[k], ov2 } : { t: F[k] }; }
      case "N": return { t: T.paddy, solid: true, beh: "paddy" };
      case "&": return { t: T.dakbat !== undefined ? (hash2(x, y) % 2 ? T.dakbat2 : T.dakbat) : T.cabbage, solid: true };   // v2.24 닥나무 밭(한지 어른)
      case "B": return { t: T.cabbage, solid: true, beh: "cabbage" };   // v2.2 운봉 고원 고랭지 배추밭
      case "U": return { t: T.gourd, solid: true, beh: "gourd" };        // v2.3 흥부마을 박밭
      case "C": return { t: T.cloud, solid: true, beh: "cloud" };        // v2.5 반야봉 구름바다
      case "a": return { t: T.azalea_gr };                                 // v2.6 철쭉 꽃잎 풀밭
      case "J": return { t: T.reed, beh: "grass", reed: true };            // v2.7 섬진강 갈대밭(풀숲처럼 남켓몬이 나옴)
      case "E": return { t: T.track_v, solid: true }; case "G": return { t: T.platform }; case "g": return { t: T.platform_e };
      case "L": { const l = at(x - 1, y) === "L", r = at(x + 1, y) === "L"; return { t: T[!l ? "ledge_l" : !r ? "ledge_r" : "ledge"], solid: true, beh: "ledge" }; }
      case "h": return { t: T.bridge_h }; case "v": return { t: T.bridge_v };
      case "R": return { anim: "flower_r" }; case "Y": return { anim: "flower_y" }; case "W": return { anim: "flower_w" };   // v2.24 작은 꽃(2×3 화단)
      default: return { t: T.grass };
    }
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let c = at(x, y);
    if (!def.indoor && OBJ_CH.includes(c) && !"RYW".includes(c)) {
      const u = ground(c === "s" ? (SGP && SGP.has(x + "," + y) ? ":" : ".") : underObj(x, y), x, y); if (u.t != null) u.t = vpick(u.t, x, y);   // v2.24 안내판은 잔디 위
      M.gr[y][x] = u;
      const hor = s => s.includes(at(x - 1, y)) || s.includes(at(x + 1, y)), ver = s => s.includes(at(x, y - 1)) || s.includes(at(x, y + 1));
      let o = null;
      if (c === "f") o = hor("f") && !ver("f") ? "fence_h" : ver("f") && !hor("f") ? "fence_v" : hor("f") ? "fence_c" : "fence_c";
      else if (c === "w") o = hor("w") && !ver("w") ? "wall_h" : ver("w") && !hor("w") ? "wall_v" : "wall_c";
      else o = { b: "bush", k: "rock", j: "jar", n: "post", s: "sign", x: "cuttree", A: "azalea" }[c];
      M.ob[y][x] = vpick(T[o], x, y); M.solid[y][x] = true;
      // v2.20 울타리·담 이음(ㄱ자·T자·끝): 사방 이웃으로 고름
      const AU = ts.js.auto;
      if (c === "f" && AU.fence) { const m = mask(x, y, "f"), FV = AU.fenceVar && AU.fenceVar[m]; M.ob[y][x] = FV ? FV[vh(x, y, 3) % FV.length] : AU.fence[m]; }
      if (c === "w" && AU.wall) M.ob[y][x] = AU.wall[mask(x, y, "w")];
      if (c === "i") M.ob[y][x] = AU.picket ? AU.picket[mask(x, y, "i")] : T.fence_c;
      if (c === "x") M.beh[y][x] = "cut";
      if (c === "A") M.beh[y][x] = "azalea";                          // v2.6 바래봉 산철쭉 덤불
      continue;
    }
    const r = ground(c, x, y); M.gr[y][x] = r;
    if (r.t != null && c !== '"') r.t = vpick(r.t, x, y);
    // v2.24: 보도 가장자리 풀 번짐(v2.22 creep) 끔
    if (r.ob !== undefined) M.ob[y][x] = r.ob;
    // v2.23 대숲: 줄기·댓잎 큰 무늬 + 끝(옆·위 잎 머리·아래 밑동) 덧그림. 잎 머리는 위 칸에 사람보다 위로(bt)
    if (c === "V" && BAM) { const b = bamTiles(BAM, x, y, M.bamC); M.ob[y][x] = b.ob; if (b.ov.length) M.bo[y][x] = b.ov; if (b.up.length && y > 0) M.bt[y - 1][x] = (M.bt[y - 1][x] || []).concat(b.up); }
    if (r.solid) M.solid[y][x] = true;
    if (r.beh) M.beh[y][x] = r.beh;
  }
  // v2.24 단차(높은 땅): MAPDATA[지도].hgt = 칸마다 높이('0'~'3'). 더 낮은 이웃이 있는 칸은 비탈(막힘·흙 벼랑 그림),
  //   안쪽 칸은 그 위에 무엇이든(길·담·건물·나무) 그대로, 맨 잔디는 밝은 언덕 잔디. 계단('/')으로만 오르내림
  const HG = !def.indoor && (def.hgt || (MAPDATA[id] && MAPDATA[id].hgt));
  if (HG && ts.js.auto.hill) {
    const lv = (X, Y) => { const r_ = HG[clamp(Y, 0, h - 1)]; const c_ = r_ ? r_.charCodeAt(clamp(X, 0, w - 1)) - 48 : 0; return c_ > 0 ? c_ : 0; };
    const HL = ts.js.auto.hill;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const L = lv(x, y); if (!L) continue;
      const hk = (X, Y) => lv(X, Y) >= L;
      const m8 = (hk(x, y - 1) ? 1 : 0) | (hk(x + 1, y) ? 2 : 0) | (hk(x, y + 1) ? 4 : 0) | (hk(x - 1, y) ? 8 : 0) | (hk(x + 1, y - 1) ? 16 : 0) | (hk(x + 1, y + 1) ? 32 : 0) | (hk(x - 1, y + 1) ? 64 : 0) | (hk(x - 1, y - 1) ? 128 : 0);
      const c = at(x, y);
      if (c === "/") continue;                                             // 돌계단(ground에서 그림, 걸어 다님)
      if ((m8 & 15) !== 15) { M.gr[y][x] = { t: HL[m8] }; M.ob[y][x] = -1; M.solid[y][x] = true; M.beh[y][x] = null; continue; }   // 비탈
      if (m8 !== 255 && ts.js.auto.hillIn) {      // 안쪽 모서리 조각(대각선만 낮음): 귀퉁이 비탈 덮개
        const IN = ts.js.auto.hillIn, add = [];
        [16, 32, 64, 128].forEach((bit, k) => { if (!(m8 & bit)) add.push(IN[k]); });
        M.gr[y][x] = Object.assign({}, M.gr[y][x], { ov2: (M.gr[y][x].ov2 || []).concat(add) }); }
      // v2.63: 언덕 위 맨 잔디를 밝은 잔디로 바꾸지 않음(정자·불상 터가 둘레와 다른 빛으로 네모나게 보이던 것)
    }
    M.lv = lv;
  }
  // v2.18 두 칸 높이 창: 창(아래 칸) 바로 위 벽 칸에 창 위쪽을 겹침
  if (WU) for (let y = 1; y < h; y++) for (let x = 0; x < w; x++) { const u = M.ob[y][x] >= 0 ? WU[M.ob[y][x]] : undefined;
    if (u !== undefined && at(x, y - 1) === "#" && M.ob[y - 1][x] < 0) M.ob[y - 1][x] = u; }
  // 도장
  for (const s of def.stamps || []) {
    const [name, sx, sy, opt] = s; const S = ST[name]; if (!S) { console.warn("no stamp", name); continue; }
    // v2.18 지붕 처마(ov): 발 칸 위로 튀어나온 줄 — 위층(사람 위)에 그리고 막지 않음
    if (S.ov) for (let j = 0; j < S.ov.length; j++) for (let dx = 0; dx < S.w; dx++) {
      const x = sx + dx, y = sy - S.ov.length + j, t = S.ov[j][dx]; if (t < 0 || x < 0 || y < 0 || x >= w || y >= h) continue;
      (M.st[y][x] = M.st[y][x] || []).push(t);
    }
    for (let dy = 0; dy < S.h; dy++) for (let dx = 0; dx < S.w; dx++) {
      const x = sx + dx, y = sy + dy; if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const b = S.b[dy] ? S.b[dy][dx] : -1, t = S.top && S.top[dy] ? S.top[dy][dx] : -1;
      if (b >= 0) (M.sb[y][x] = M.sb[y][x] || []).push(b);
      if (t >= 0) (M.st[y][x] = M.st[y][x] || []).push(t);
      const so = S.solid && S.solid[dy] ? S.solid[dy][dx] : 0;
      if (so) M.solid[y][x] = true;
      else if (b >= 0 || t >= 0) { if (!(opt && opt.keepSolid)) M.solid[y][x] = M.gr[y][x] && M.gr[y][x].beh === "water" && name !== "ojakgyo" ? true : false; if (name === "ojakgyo") M.beh[y][x] = null; }
    }
    if (name === "lab_table" || name === "teacher_desk") for (let dx = 0; dx < S.w; dx++) { const x = sx + dx; if (M.beh[sy] && x < w) M.beh[sy][x] = "counter"; }
    if (name === "pansori") for (let dx = 0; dx < S.w; dx++) { const x = sx + dx, y = sy + 2; if (M.beh[y] && x < w) M.beh[y][x] = "counter"; }   // v2.24 무대 앞턱 너머로 소리꾼·고수와 이야기
    if (S.door && opt && opt.to) { const dx = sx + S.door[0], dy = sy + S.door[1]; M.solid[dy][dx] = false; M.beh[dy][dx] = "door"; M.warps[dx + "," + dy] = opt.to; }
    if (S.door && opt && opt.locked) { const dx = sx + S.door[0], dy = sy + S.door[1]; M.solid[dy][dx] = true;
      // v1.8.1: 글자 열쇠(house2_galmae 등)는 LOCKS에서 찾음(전에는 "house2"가 그대로 나옴)
      M.checks[dx + "," + dy] = typeof opt.locked === "string" && typeof LOCKS !== "undefined" && LOCKS[opt.locked] ? LOCKS[opt.locked] : opt.locked; }
  }
  for (const wp of def.warps || []) M.warps[wp[0] + "," + wp[1]] = wp[2];
  for (const s of def.signs || []) M.signs[s[0] + "," + s[1]] = s[2];
  for (const c of def.checks || []) M.checks[c[0] + "," + c[1]] = c[2];
  fitTrees(M, at, ST, T);
  return M;
}

// v2.13 반쪽 나무 없애기: 숲(T 활엽수 · P 소나무) 칸을 ① 바둑판에 맞춘 2×2 큰 나무 → ② 어긋난 2×2 → ③ 세로 두 칸 좁은 나무 → ④ 한 칸 떨기나무 순서로 채움.
//   도장(건물·나무 그림)이 덮은 숲 칸은 그리지 않음(겹쳐 그려져 잘려 보이던 것). 맵 밖 테두리도 같은 규칙(출구 길 옆은 좁은 나무·떨기나무)
function fitTrees(M, at, ST, T) {
  const { w, h, def } = M, rows = def.rows;
  if (def.indoor) return;
  let nT = 0, nP = 0; for (const r of rows) for (const c of r) { if (c === "T") nT++; else if (c === "P") nP++; }
  M.border = def.border || (nP > nT && ST.pine ? "pine" : "tree");
  const inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h;
  M.exitOut = (x, y) => { const ex = clamp(x, 0, w - 1), ey = clamp(y, 0, h - 1); return !!(M.warps[ex + "," + ey] && !M.solid[ey][ex] && (x === ex || y === ey)); };
  const used = rows.map(() => new Uint8Array(w));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = at(x, y); if ((c === "T" || c === "P" || c === "O" || c === "V") && M.sb[y][x]) { M.ob[y][x] = -1; used[y][x] = 1; } }   // v2.24 지붕 처마(위층)만 걸친 나무는 그대로
  M.bq = {};    // 맵 밖 칸 중 2×2가 안 되는 자리: "x,y" → 타일
  for (const [ch, nm] of [["T", "tree"], ["P", "pine"], ["O", "boulder"], ["V", "bamboo"]]) {
    const S = ST[nm], N = ST[nm + "_n"], SM = ch === "O" ? T.rock : ch === "V" ? T.bush : T[nm + "_s"]; if (!S) continue;
    // v2.20 2×2 나무 덩어리마다 변형(좌우 뒤집기·잎 빛)
    const SV = ((M.ts.js.treeVar || {})[nm] || [nm]).map(k => ST[k]).filter(Boolean);
    const pickS = (bx, by) => SV[hash2(bx * 3 + 1, by * 5 + 7) % SV.length] || S;
    const svAt = [0, 1].map(j => [0, 1].map(i => new Set(SV.map(v => v.b[j][i]))));
    const bord = M.border === nm;
    const ok = (x, y) => inb(x, y) ? at(x, y) === ch && !used[y][x] : bord && !M.exitOut(x, y);
    const set = (x, y, t) => { M.ob[y][x] = t; used[y][x] = 1; };
    // ① 2×2 — v2.24 세로 짝맞춤: 두 칸 폭 나무 기둥마다, 나무 줄이 길·잔디와 만나는 쪽에 맞춰 2칸씩 끊음
    //   (옆 출구 길이 홀수 줄에서 시작해도 길 바로 옆에 떨기나무 한 줄이 남지 않게, 남는 한 줄은 맵 끝 쪽으로)
    //   위·아래 끝에 다 닿는 기둥은 예전처럼 짝수 줄(맵 밖 테두리와 이어짐)
    const blk = (bx, by) => {
      if (!(ok(bx, by) && ok(bx + 1, by) && ok(bx, by + 1) && ok(bx + 1, by + 1))) return;
      const SB = pickS(bx, by); for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) if (inb(bx + i, by + j)) set(bx + i, by + j, SB.b[j][i]);
    };
    for (let bx = 0; bx <= w; bx += 2) {
      let y = 0;
      while (y <= h) {
        if (!(ok(bx, y) && ok(bx + 1, y))) { y++; continue; }
        const ya = y; while (y <= h && ok(bx, y) && ok(bx + 1, y)) y++;
        const yb = y - 1, topE = ya === 0, botE = yb >= h - 1;
        if (topE && botE) { for (let by = 0; by + 1 <= yb; by += 2) blk(bx, by); }
        else if (topE) { for (let by = yb - 1; by >= -1; by -= 2) blk(bx, by); }
        else { for (let by = ya; by + 1 <= yb; by += 2) blk(bx, by); }
      }
    }
    const free = (x, y) => inb(x, y) && at(x, y) === ch && !used[y][x];
    // ② 어긋난 2×2
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (!free(x, y)) continue;
      for (const [ox, oy] of [[0, 0], [-1, 0], [0, -1], [-1, -1]]) {
        const X = x + ox, Y = y + oy;
        if (free(X, Y) && free(X + 1, Y) && free(X, Y + 1) && free(X + 1, Y + 1)) { const SB = pickS(X, Y); for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) set(X + i, Y + j, SB.b[j][i]); break; }
      }
    }
    // ③ 세로 두 칸 → 좁은 나무, ④ 한 칸 → 떨기나무
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (!free(x, y)) continue;
      if (N && free(x, y + 1)) { set(x, y, N.b[0][0]); set(x, y + 1, N.b[1][0]); }
      else set(x, y, SM !== undefined ? SM : M.ob[y][x]);
    }
    // 맵 밖 테두리: 바둑판 2×2가 맵 안 숲·출구 길과 어긋나는 칸은 좁은 나무·떨기나무(그릴 때 물어봄)
    if (bord) {
      const isIn = (x, y) => at(x, y) === ch && svAt[((y % 2) + 2) % 2][((x % 2) + 2) % 2].has(M.ob[y][x]);
      const cell = (x, y) => inb(x, y) ? isIn(x, y) : !M.exitOut(x, y);
      M.borderTile = (x, y) => {
        const k = x + "," + y; if (k in M.bq) return M.bq[k];
        const qx = ((x % 2) + 2) % 2, qy = ((y % 2) + 2) % 2, bx = x - qx, by = y - qy;
        let t = pickS(bx, by).b[qy][qx];
        if (!(cell(bx, by) && cell(bx + 1, by) && cell(bx, by + 1) && cell(bx + 1, by + 1))) {
          const py = qy ? y - 1 : y + 1;
          t = N && !inb(x, py) && !M.exitOut(x, py) ? N.b[qy][0] : SM;
        }
        return (M.bq[k] = t);
      };
    }
  }
}

// ---- 사람(필드 인물) ----
class Actor {
  constructor(o) {
    Object.assign(this, { x: 0, y: 0, dir: "down", spr: "man", p: 0, mx: 0, my: 0, moving: false, speed: 1, step: 0, anim: 0, jump: 0, hidden: false, move: "still", wt: 60 + rnd(120), home: null, emo: null, emoT: 0 }, o);
    this.home = this.home || [this.x, this.y];
  }
  get px() { return R2(this.x * TS - (this.moving ? (TS - this.p) * this.mx : 0) * (this.jump ? 2 : 1)); }
  get py() { return R2(this.y * TS - (this.moving ? (TS - this.p) * this.my : 0) * (this.jump ? 2 : 1)); }
  frameIdx() {
    const base = { down: 0, up: 3, left: 6, right: 6 }[this.dir];
    if (this.moving && this.p < 8 && !this.jump && !this.sliding) return base + 1 + (this.step & 1);
    if (this.bumpAnim) return base + 1 + ((this.bumpAnim >> 4) & 1);
    return base;
  }
}

// ---- 필드 장면 ----
const World = {
  opaque: true, M: null, actors: [], player: null, busy: 0, cam: [0, 0], rustle: [], zone: null, popup: null, popT: 0, turnT: 0, weather: null, wxT: 0,
  init() { this.player = new Actor({ spr: G.gender === "f" ? "player_f" : "player_m", id: "player" }); },
  load(id, x, y, dir) {
    this.M = buildMap(id); G.map = id; this.actors = []; this.camDY = 0;
    const P = this.player; P.x = x; P.y = y; P.dir = dir || P.dir; P.moving = false; P.p = 0; P.spr = G.gender === "f" ? "player_f" : "player_m";
    for (const o of this.M.def.npcs || []) {
      if (o.show && !o.show()) continue;
      // v2.19 여자 본디회 단원(배틀 그림 grunt_f·단지)은 필드에서도 여자 단원 그림
      const fem = o.spr === "bondi" && ((o.trainer && o.trainer.spr === "grunt_f") || /danji/.test(o.id || "")) && CH().keys.includes("bondi_f");
      // v2.19 길 트레이너(서도역장·화공 등)는 배틀 그림과 같은 모습의 필드 칸이 있으면 그것으로
      const tk = o.trainer && o.trainer.spr, ownTr = tk && (CH().fromTrainer || []).includes(tk);
      const a = new Actor({ ...o, x: o.x, y: o.y, spr: fem ? "bondi_f" : ownTr ? tk : o.spr || "man", dir: o.dir || "down", move: o.move || "still" });
      if (o.item && G.flag("item_" + id + "_" + o.x + "_" + o.y)) continue;
      this.actors.push(a);
    }
    this.zone = null; this.checkZone(true);
    if (this.M.def.onLoad) this.M.def.onLoad();
  },
  get def() { return this.M.def; },
  zoneAt(x, y) { for (const z of this.def.zones || []) if (x >= z[1] && x <= z[3] && y >= z[2] && y <= z[4]) return z[0]; return null; },
  zoneInfo() { const zn = this.zoneAt(this.player.x, this.player.y); return (this.def.zinfo || {})[zn] || this.def; },
  checkZone(force) {
    const zn = this.zoneAt(this.player.x, this.player.y) || this.def.name;
    if (zn === this.zone && !force) return;
    const prev = this.zone; this.zone = zn;
    this.weather = this.M.outdoor && !this.def.noTint ? fieldWeather(zn) : null;
    const zi = this.zoneInfo();
    if (zi.bgm && !this.noBgm) bgm(typeof zi.bgm === "function" ? zi.bgm() : zi.bgm);
    if (zn && (prev !== null || force) && zn !== prev && !this.def.noPopup) { this.popup = zn; this.popT = 0; }
  },
  fieldWx() { return this.M && this.M.outdoor && !this.def.noTint ? this.weather : null; },
  solidAt(x, y, who) {
    const M = this.M;
    if (x < 0 || y < 0 || x >= M.w || y >= M.h) return true;
    if (M.solid[y][x]) return true;
    for (const a of this.actors) if (a !== who && !a.hidden && !(a.pass && a.pass(who)) && ((a.x === x && a.y === y) || (a.moving && a.x - a.mx === x && a.y - a.my === y))) return true;
    if (who !== this.player && this.player.x === x && this.player.y === y) return true;
    return false;
  },
  actorAt(x, y) { return this.actors.find(a => !a.hidden && a.x === x && a.y === y); },
  // 한 칸 이동 시작 (true = 시작함)
  tryMove(a, dir, run = false) {
    a.dir = dir; const [dx, dy] = DIRS[dir]; const nx = a.x + dx, ny = a.y + dy; const M = this.M;
    if (a === this.player && dir === "down" && nx >= 0 && ny < M.h && M.beh[ny] && M.beh[ny][nx] === "ledge" && !this.solidAt(nx, ny + 1, a) && !(M.beh[ny + 1] && M.beh[ny + 1][nx] === "ledge")) {
      a.x = nx; a.y = ny + 1; a.mx = dx; a.my = dy; a.moving = true; a.p = 0; a.jump = 1; a.speed = 1; sfx("jump"); return true;
    }
    if (this.solidAt(nx, ny, a)) return false;
    a.x = nx; a.y = ny; a.mx = dx; a.my = dy; a.moving = true; a.p = 0; a.step++; a.jump = 0;
    a.running = !!run; a.speed = a === this.player ? (run ? RUN_SPD : WALK_SPD) : 1;
    if (M.beh[ny][nx] === "grass") this.rustle.push({ x: nx, y: ny, t: 0 });
    return true;
  },
  updateActor(a) {
    if (!a.moving) return false;
    a.p += a.speed * (a.jump ? 1 : 1);
    // v2.37 16/6·16/12를 여섯·열두 번 더하면 15.999…라 한 프레임 늦게 도착 → 칸마다 한 프레임 멈칫(달리기에서 특히 덜컥거림). 아주 작은 여유를 둠
    if (a.jump) { if (a.p >= TS - 1e-6) { a.moving = false; a.jump = 0; a.p = 0; sfx("land"); return true; } return false; }
    if (a.p >= TS - 1e-6) { a.moving = false; a.p = 0; return true; }
    return false;
  },
  update(focus) {
    const P = this.player;
    for (const r of this.rustle) r.t++;
    this.rustle = this.rustle.filter(r => r.t < 16);
    if (this.popup) { this.popT++; if (this.popT > 170) this.popup = null; }
    if (++this.wxT >= 600) { this.wxT = 0; const w0 = this.weather; this.weather = this.M.outdoor && !this.def.noTint ? fieldWeather(this.zone) : null; if (w0 !== this.weather && this.weather && !this.popup) { this.popup = this.zone; this.popT = 0; } }
    for (const a of this.actors) {
      if (a.emoT > 0) a.emoT--;
      const done = this.updateActor(a);
      if (!a.moving && a.move === "wander" && !this.busy && focus) {
        if (--a.wt <= 0) { a.wt = 70 + rnd(160); const d = pick(["up", "down", "left", "right"]); const [dx, dy] = DIRS[d];
          if (Math.abs(a.x + dx - a.home[0]) <= (a.r || 2) && Math.abs(a.y + dy - a.home[1]) <= (a.r || 2)) this.tryMove(a, d); else a.dir = d; }
      } else if (!a.moving && a.move === "look" && !this.busy && focus) { if (--a.wt <= 0) { a.wt = 90 + rnd(200); a.dir = pick(["up", "down", "left", "right"]); } }
    }
    if (P.moving) {
      if (!this.updateActor(P)) return;
      if (!this.busy) this.onStep(); else { this.checkZone(); return; }
      if (this.busy || P.moving) return;
      this.turnT = 7;          // 걷는 중에 방향을 바꾸면 멈칫 없이 바로 꺾는다
    }
    if (P.bumpAnim) P.bumpAnim--;
    if (!focus || this.busy) return;
    // 메뉴
    if (Input.menuKey()) { sfx("menu"); openStartMenu(); return; }
    if (Input.ok()) { this.interact(); return; }
    const d = Input.dir();
    if (!d) { this.turnT = 0; return; }
    if (d !== P.dir && this.turnT === 0) { P.dir = d; this.turnT = 1; return; }
    if (this.turnT > 0 && this.turnT < 4) { this.turnT++; if (Input.dir() === P.dir) return; }
    const run = G.flag("runshoes") && (Save.opt.autorun ? !Input.is("b") : Input.is("b"));   // v1.4 늘 달리기: 켜면 X를 누른 동안 걷기
    P.spr = (G.gender === "f" ? "player_f" : "player_m") + (run ? "_run" : "");
    if (!this.tryMove(P, d, run)) {
      if (this.def.onBump && this.def.onBump(P, d)) return;      // v2.33 괴력 바위 밀기 등
      // 실내 발판에서 아래로 = 나가기
      if (d === "down" && this.M.beh[P.y][P.x] === "mat") { this.exitMat(); return; }
      if (!P.bumpAnim || P.bumpAnim < 2) { if (!P.bumpAnim) sfx("bump"); P.bumpAnim = 32; }
    } else P.bumpAnim = 0;
  },
  onStep() {
    const P = this.player, M = this.M;
    G.steps++;
    if (G.steps % 64 === 0) for (const m of G.party) if (m.hp > 0) frUp(m, 1);     // v2.37 함께 걸으면 친밀도가 조금씩(실제 게임처럼)
    const key = P.x + "," + P.y;
    if (M.warps[key] && M.beh[P.y][P.x] !== "mat") { this.warp(M.warps[key], M.warps[key][4] === "edge" ? "edge" : "door"); return; }
    this.checkZone();
    if (this.weather && !G.flag("wxtip_" + this.weather)) { const w = this.weather; G.flag("wxtip_" + w, true); this.run(() => say(WX_TIP[w].join("\f"))); return; }
    if (G.repel > 0) { G.repel--; if (G.repel === 0) { this.run(async () => {      // v1.9 실제 게임처럼: 남은 향이 있으면 또 쓸지 물어봄
      const id = (G.lastRepel && G.has(G.lastRepel)) ? G.lastRepel : ["ssukhyang", "superrepel", "maxrepel"].find(k => G.has(k));
      if (!id) { await say("쑥향의 효과가 사라졌다…"); return; }
      if ((await ask(`쑥향의 효과가 사라졌다…\f${J(ITEMS[id].n, "을")} 또 쓰겠습니까?`, ["예", "아니오"])) === 0) {
        G.take(id); G.repel = ITEMS[id].repel; G.lastRepel = id; sfx("heal_hp"); await say(`${J(G.name, "은")} ${J(ITEMS[id].n, "을")} 피웠다!`); } }); return; } }
    if (this.def.onStep) this.def.onStep(P);
    if (M.beh[P.y][P.x] === "slide") {          // v1.9 미끄럼: 막힐 때까지 같은 쪽으로
      if (this.tryMove(P, P.dir, false)) { P.sliding = true; P.speed = RUN_SPD; return; }
      if (!P.sliding) { /* 처음부터 막힘 */ }
    }
    { const bh = M.beh[P.y][P.x];                  // v2.1 굴림 바닥: 화살 쪽으로 밀려감(다음 칸도 화살이면 그쪽으로 계속)
      if (bh && bh.startsWith("arrow_")) { const d = bh.slice(6); P.dir = d; if (this.tryMove(P, d, false)) { if (!P.sliding) sfx("jump"); P.sliding = true; P.speed = RUN_SPD; return; } } }
    if (P.sliding) { P.sliding = false; sfx("land"); }
    for (const t of this.def.triggers || []) {
      if (t.x === P.x && t.y === P.y && (!t.cond || t.cond())) { this.run(t.run); return; }
    }
    for (const t of this.def.areas || []) {
      if (P.x >= t.x0 && P.x <= t.x1 && P.y >= t.y0 && P.y <= t.y1 && (!t.cond || t.cond())) { this.run(t.run); return; }
    }
    const tr = this.findTrainer(); if (tr) { this.run(() => trainerSpotted(tr)); return; }
    if (M.beh[P.y][P.x] === "grass" || (this.def.caveEnc && M.beh[P.y][P.x] == null)) {     // v2.33 굴은 바닥 어디서나(실제 게임 동굴처럼)
      const zi = this.zoneInfo(); if (!zi.enc || Math.random() >= (zi.rate || 0.1)) return;
      const list = encTable(zi.enc); if (!list.length) return;
      const [k, lv] = rollEnc(list);
      const lead = G.party.find(m => m.hp > 0);
      if (G.repel > 0 && lead && lv < lead.lv) return;
      this.run(() => startWild(k, lv, zi.bg || "grass"));
    }
  },
  interact() {
    const P = this.player; const [dx, dy] = DIRS[P.dir]; let x = P.x + dx, y = P.y + dy; const M = this.M;
    let a = this.actorAt(x, y);
    if (!a && M.beh[y] && M.beh[y][x] === "counter") { x += dx; y += dy; a = this.actorAt(x, y); }
    if (a) { this.run(async () => { await talkTo(a); }); return; }
    const k = (P.x + dx) + "," + (P.y + dy);
    if (M.signs[k]) { this.run(async () => { const sg = M.signs[k]; await say(typeof sg === "function" ? sg() : sg); }); return; }
    if (M.checks[k]) { const c = M.checks[k]; this.run(async () => { if (typeof c === "function") await c(); else await say(c); }); return; }
    if (typeof hiddenAt === "function") { const h = hiddenAt(x, y); if (h) { this.run(() => takeHidden(h)); return; } }      // v2.0 숨겨진 물건
    if (M.beh[y] && M.beh[y][x] === "cut" && typeof cutTreeAt === "function") { this.run(() => cutTreeAt(x, y)); return; }      // v2.0 풀베기
    if (M.beh[y] && M.beh[y][x] === "water" && typeof fishAt === "function" && G.has("oldrod")) { this.run(() => fishAt(x, y)); return; }   // v2.0 낚시
    if (M.beh[y] && M.beh[y][x] === "azalea") { this.run(() => say("진분홍 산철쭉이 가득 피었다.\f예쁘지만 독이 있어서\n먹으면 안 된다.")); return; }
    if (M.beh[y] && M.beh[y][x] === "cloud") { this.run(() => say("발아래로 하얀 구름바다가\n끝없이 펼쳐져 있다.")); return; }
    if (M.beh[y] && M.beh[y][x] === "gourd") { this.run(() => say("박 덩굴 사이로 하얀 박이\n주렁주렁 열렸다.\f흥부는 제비가 물어 온 박씨를 심어\n박을 탔다고 전해진다.")); return; }
    if (M.beh[y] && M.beh[y][x] === "cabbage") { this.run(() => say("통통한 배추가 줄지어 자란다.\f높고 서늘한 운봉 고원은\n고랭지 배추로 이름난 곳이다.")); return; }
    if (M.beh[y] && M.beh[y][x] === "paddy") { this.run(() => say("푸릇푸릇한 모가 줄지어 자라는 논이다.\f농부들이 애써 가꾸는 논이니\n들어가지 말자.")); return; }
  },
  async run(fn) {
    this.busy++;
    try { await fn(); } catch (e) { console.error(e); }
    finally { this.busy--; }
  },
  async warp(to, how) {
    const [map, x, y, dir] = to;
    this.busy++;
    if (how !== "edge") sfx(how === "door" ? "door" : how === "mat" ? "exit" : "door");
    await fadeOut(10);
    const wasOut = this.M.outdoor;
    this.load(map, x, y, dir || (this.M.def.indoor ? "up" : "down"));
    this.cam = this.camTarget();
    await frames(4);
    await fadeIn(10);
    // 건물에서 나오면 한 걸음 앞으로
    if (how === "mat") { const P = this.player; P.dir = "down"; if (this.tryMove(P, "down")) { while (P.moving) await frames(1); } }
    if (how === "edge") { const P = this.player; if (this.tryMove(P, P.dir)) { while (P.moving) await frames(1); } }
    this.busy--;
    if (this.def.onEnter) await this.run(this.def.onEnter);
  },
  async exitMat() {
    if (this.def.exitRun) { this.run(this.def.exitRun); return; }
    const k = this.player.x + "," + this.player.y;
    const to = this.M.warps[k] || this.def.exit;
    if (to) await this.warp(to, "mat");
  },
  // ---- 트레이너 시선 ----
  findTrainer() {
    const P = this.player;
    for (const a of this.actors) {
      const t = a.trainer; if (!t || (G.flag("tr_" + t.id) && !G.flag("rm_" + t.id)) || a.hidden || (t.cond && !t.cond())) continue;
      const [dx, dy] = DIRS[a.dir]; const R = t.range || 4;
      for (let i = 1; i <= R; i++) {
        const x = a.x + dx * i, y = a.y + dy * i;
        if (x === P.x && y === P.y) return a;
        if (this.M.solid[y] && this.M.solid[y][x]) break;
        if (this.actorAt(x, y)) break;
      }
    }
    return null;
  },
  camTarget() {
    const P = this.player; let cx = P.px - 120, cy = P.py - 88 + (this.camDY || 0);   // camDY: 연출용 카메라 위아래 이동(v2.5)
    if (this.def.indoor) { const W = this.M.w * TS, H = this.M.h * TS;
      cx = W <= SW ? (W - SW) / 2 : clamp(cx, 0, W - SW); cy = H <= SH ? (H - SH) / 2 : clamp(cy, 0, H - SH); }
    return [R2(cx), R2(cy)];
  },
  draw() {
    const M = this.M, P = this.player;
    const [cx, cy] = this.cam = this.camTarget();
    const x0 = Math.floor(cx / TS), y0 = Math.floor(cy / TS);
    const ts = M.ts, im = ts.im, T = ts.js.t, ST = ts.js.stamp, now = performance.now();
    const ti = (i, x, y) => tileAt(ts, i, x, y);
    const wf = Math.floor(now / 280) % 3;
    for (let y = y0; y <= y0 + 12; y++) for (let x = x0; x <= x0 + 16; x++) {
      const sx = x * TS - cx, sy = y * TS - cy;
      if (x < 0 || y < 0 || x >= M.w || y >= M.h) {
        if (M.outdoor) {
          // v2.1 실제 게임처럼: 맵 가장자리 출구(이웃 맵으로 이어지는 길)는 바깥으로도 길이 이어져 보이게
          const ex = clamp(x, 0, M.w - 1), ey = clamp(y, 0, M.h - 1), ec = M.warps[ex + "," + ey] && !M.solid[ey][ex] ? M.gr[ey][ex] : null;
          if (ec && (x === ex || y === ey)) { ti(T.grass, sx, sy); if (ec.auto) ti(ec.auto === "water" ? ts.js.auto.water[wf][15] : ec.pv !== undefined ? ec.pv : ts.js.auto.path[ec.m], sx, sy); else if (!ec.anim) ti(ec.t, sx, sy); }
          else if (ts.js.auto.bam && M.bamC(x, y)) { const b = bamTiles(ts.js.auto.bam, x, y, M.bamC); ti(T.grass, sx, sy); ti(b.ob, sx, sy); for (const i of b.ov) ti(i, sx, sy); }   // v2.23 대숲은 지도 밖으로도 이어짐
          else { ti(T.grass, sx, sy); ti(M.borderTile ? M.borderTile(x, y) : ST[M.border || "tree"].b[((y % 2) + 2) % 2][((x % 2) + 2) % 2], sx, sy); }
          if (ts.js.auto.bam && !ec && M.bamC(x, y + 1) && !M.bamC(x, y)) for (const i of bamTiles(ts.js.auto.bam, x, y + 1, M.bamC).up) ti(i, sx, sy);
        } else rect(sx, sy, TS, TS, "#000");
        continue;
      }
      const c = M.gr[y][x];
      if (c) {
        if (c.auto) ti(c.auto === "water" ? (c.sandy && ts.js.auto.waterS ? ts.js.auto.waterS : ts.js.auto.water)[wf][c.m] : c.pv !== undefined ? c.pv : ts.js.auto.path[c.m], sx, sy);   // v2.62 모래와 닿은 물은 모래 물가
        else if (c.anim) { const A = ts.js.anim[c.anim]; ti(A.f[Math.floor(now / A.ms) % A.f.length], sx, sy); }
        else ti(c.t, sx, sy);
        if (c.ov2) for (const o of c.ov2) ti(o, sx, sy);
      }
      const r = this.rustle.find(r => r.x === x && r.y === y);
      if (r && M.beh[y][x] === "grass") { const A = (M.gr[y][x] && M.gr[y][x].reed && ts.js.anim.reed_rustle) || ts.js.anim.tallgrass_rustle; ti(A.f[Math.min(A.f.length - 1, Math.floor(r.t / 5))], sx, sy); }
      if (M.ob[y][x] >= 0) ti(M.ob[y][x], sx, sy);
      if (M.bo[y][x]) for (const i of M.bo[y][x]) ti(i, sx, sy);
      if (M.sb[y][x]) for (const i of M.sb[y][x]) ti(i, sx, sy);
    }
    if (this.def.under) this.def.under(cx, cy);          // v1.9 배움터 장치(별 발판·발자국 등)
    // 사람 (y 순서)
    const list = this.actors.filter(a => !a.hidden).concat(this.hidePlayer ? [] : [P]).sort((a, b) => a.py - b.py);
    for (const a of list) this.drawActor(a, cx, cy);
    // 위층
    for (let y = y0; y <= y0 + 13; y++) for (let x = x0; x <= x0 + 16; x++) {
      if (x < 0 || y < 0 || x >= M.w || y >= M.h) continue;
      if (M.bt[y][x]) for (const i of M.bt[y][x]) ti(i, x * TS - cx, y * TS - cy);
      if (M.st[y][x]) for (const i of M.st[y][x]) ti(i, x * TS - cx, y * TS - cy);
    }
    // 풀숲 앞잎 (서 있는 사람 다리 가리기)
    if (M.outdoor) for (const a of list) {
      if (a.moving && a.p < 8) continue;
      if (M.beh[a.y] && M.beh[a.y][a.x] === "grass" && !a.jump) ti(M.gr[a.y][a.x] && M.gr[a.y][a.x].reed && T.reed_over !== undefined ? T.reed_over : T.tallgrass_over, a.x * TS - cx, a.y * TS - cy);
    }
    if (this.def.over) this.def.over(cx, cy);
    if (typeof drawHidden === "function") drawHidden(cx, cy);
    if (this.extra) this.extra(cx, cy);
    for (const a of list) if (a.emo && a.emoT > 0) { const mi = MISC().t[a.emo]; sprite(IMG.misc, mi * 16, 0, 16, 16, a.px - cx, a.py - cy - 24); }
    // v2.22 마을·길 분위기(채도·빛깔) — 지역이 바뀌면 천천히
    if (M.outdoor && !this.def.noTint) {
      const tg = moodFor(this.zone || this.def.name), cm = this.mood || (this.mood = { s: tg.s, c: tg.c.slice(), a: tg.a });
      const k = 0.06; cm.s += (tg.s - cm.s) * k; cm.a += (tg.a - cm.a) * k; for (let i = 0; i < 3; i++) cm.c[i] += (tg.c[i] - cm.c[i]) * k;
      drawMood(cm);
    }
    // 낮·밤
    if (M.outdoor && !this.def.noTint) {
      const tod = timeOfDay();
      if (tod === "저녁" || tod === "밤") { g.globalCompositeOperation = "multiply"; g.fillStyle = tod === "저녁" ? "#ffd2a8" : "#7684c6"; g.fillRect(0, 0, SW, SH); g.globalCompositeOperation = "source-over"; }
      if (this.weather) drawWeather(g, this.weather, now, SW, SH, true);
    }
    // 지역 이름 팻말 (4세대처럼 위에서 내려온다)
    if (this.popup) {
      const t = this.popT, yy = t < 12 ? -30 + t * 2.5 : t > 150 ? -30 + (170 - t) * 1.5 : 0;
      const w = Math.max(96, Font.width(this.popup) + 32);
      rect(4, yy + 2, w, 26, "#5a3a1e"); rect(5, yy + 3, w - 2, 24, "#c8955a"); rect(7, yy + 5, w - 6, 20, "#e8c890"); rect(7, yy + 5, w - 6, 2, "#f4dcb0");
      rect(10, yy + 1, 3, 4, "#5a3a1e"); rect(w - 7, yy + 1, 3, 4, "#5a3a1e");
      Font.draw(g, this.popup, 4 + w / 2, yy + 8, { align: "center", col: "#4a2a10", sh: "#f4dcb0" });
      if (this.weather && this.popup === this.zone) { const lab = WX[this.weather].n, lw = Font.width(lab, "g9") + 24;
        rect(w + 8, yy + 8, lw, 14, "#5a3a1e"); rect(w + 9, yy + 9, lw - 2, 12, "#f4e4c0"); drawWxIcon(g, this.weather, w + 12, yy + 10); Font.draw(g, lab, w + 25, yy + 9, { font: "g9", col: "#4a2a10", sh: null }); }
    }
  },
  drawActor(a, cx, cy) {
    if (a.item) { const mi = MISC().t.itemball; sprite(IMG.misc, mi * 16, 0, 16, 16, a.px - cx, a.py - cy); return; }
    if (a.special) { a.special(a.px - cx, a.py - cy); return; }
    if (a === this.player && IMG.player && JSN.player) { this.drawPlayer(a, cx, cy); return; }
    let C = CH(), im = IMG.chars, row = C.keys.indexOf(a.spr);
    if (row < 0 && JSN.leaders_field) { C = JSN.leaders_field; im = IMG.leaders_field; row = C.keys.indexOf(a.spr); }
    if (row < 0 || !im) return;
    let fi = a.frameIdx();
    let yo = 0;
    if (a.jump) { const t = a.p / TS; yo = -Math.round(Math.sin(t * Math.PI) * 10); const si = MISC().t.shadow; sprite(IMG.misc, si * 16, 0, 16, 16, a.px - cx, a.py - cy + 2); }
    if (a.moving && a.p < 8 && a.jump) fi = { down: 1, up: 4, left: 7, right: 7 }[a.dir];
    const s = C.scale || 1;   // v2.19 필드 인물 2배 촘촘(32×48 그림을 16×24 자리에)
    spriteS(im, fi * 16 * s, row * 24 * s, 16 * s, 24 * s, a.px - cx, a.py - cy - 8 + yo, 16, 24, a.dir === "right");
  },
};

// 주인공: 4단 걷기·달리기 (0 서기, 1 왼발, 2 지나감, 3 오른발). 한 칸 앞 절반 = 딛는 발, 뒤 절반 = 지나감
World.drawPlayer = function (a, cx, cy) {
  const J2 = JSN.player, key = (G.gender === "f" ? "player_f" : "player_m") + (a.running && a.moving ? "_run" : "_walk");
  const row = Math.max(0, J2.keys.indexOf(key)), base = { down: 0, up: 4, left: 8, right: 8 }[a.dir];
  let ph = 0, yo = 0;
  if (a.jump) { const t = a.p / TS; yo = -Math.round(Math.sin(t * Math.PI) * 10); ph = 2; const si = MISC().t.shadow; sprite(IMG.misc, si * 16, 0, 16, 16, a.px - cx, a.py - cy + 2); }
  else if (a.moving && a.sliding) ph = 0;          // 미끄러질 때는 선 채로
  else if (a.moving) ph = a.p < TS / 2 ? ((a.step & 1) ? 3 : 1) : 2;
  else if (a.bumpAnim) ph = (a.bumpAnim >> 3) & 1 ? 1 : 3;
  // v2.24 달리기: 뒤 절반 '뜨기'는 디딘 발에 맞는 그림(왼발 뒤 = run 줄, 오른발 뒤 = run2 줄)이고 몸 전체가 살짝 뜸(v2.37 1칸 → 반 칸: 통통 튀던 것 줄임)
  let r2 = row;
  if (a.running && a.moving && !a.jump && !a.sliding && ph === 2) { yo -= 0.5; if (a.step & 1) { const k2 = J2.keys.indexOf(key + "2"); if (k2 >= 0) r2 = k2; } }
  const s = J2.scale || 1;
  spriteS(IMG.player, (base + ph) * 16 * s, r2 * 24 * s, 16 * s, 24 * s, a.px - cx, a.py - cy - 8 + yo, 16, 24, a.dir === "right");
};
// ---- 야생 출현 ----
const RARE_W = { "흔함": 50, "가끔": 22, "드묾": 8, "아주 드묾": 2 };
function encTable(loc) {
  const tod = timeOfDay(); const t = tod === "아침" ? "낮" : tod;
  return (DATA.spawns[loc] || []).filter(e => RARE_W[e.r] && (e.t === "모두" || e.t === t || e.t === tod || (t === "저녁" && e.t === "밤")) && MON[e.k]);   // v2.37 '아침'에만 나오는 남켓몬이 아침에 나오게(전엔 아침을 낮으로만 봐서 하나도 안 나옴)
}
function encW(e) {     // v1.2 날씨에 어울리는 타입은 2배 자주 나온다 (비 → 물, 쾌청 → 불꽃·풀, 모래바람 → 땅·바위, 싸라기눈 → 얼음, 운해 → 고스트·에스퍼)
  const T = WX_TYPES[World.weather]; return RARE_W[e.r] * (T && MON[e.k] && MON[e.k].t.some(t => T.includes(t)) ? 2 : 1);
}
function rollEnc(list) {
  const tot = list.reduce((s, e) => s + encW(e), 0); let r = Math.random() * tot;
  for (const e of list) { r -= encW(e); if (r <= 0) { const [a, b] = String(e.lv).split(/[–-]/).map(Number); return [e.k, b ? a + rnd(b - a + 1) : a]; } }
  const e = list[0]; return [e.k, parseInt(e.lv)];
}

// ---- 스크립트 도구 ----
const act = id => World.actors.find(a => a.id === id);
async function walk(a, ...dirs) {
  for (const d of dirs.flat()) {
    if (typeof d === "number") { await frames(d); continue; }
    if (d.startsWith("face:")) { a.dir = d.slice(5); await frames(4); continue; }
    let tries = 0;
    while (!World.tryMove(a, d)) { a.dir = d; await frames(2); if (++tries > 60) break; }
    while (a.moving) await frames(1);
  }
}
async function walkTo(a, x, y) {
  const path = [];
  let cx = a.x, cy = a.y;
  while (cx !== x) { const d = x > cx ? "right" : "left"; path.push(d); cx += x > cx ? 1 : -1; }
  while (cy !== y) { const d = y > cy ? "down" : "up"; path.push(d); cy += y > cy ? 1 : -1; }
  await walk(a, path);
}
function face(a, b) { const dx = b.x - a.x, dy = b.y - a.y; a.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"); }
async function emote(a, e = "excl", n = 40) { a.emo = e; a.emoT = n; if (e === "excl") sfx("excl"); await frames(n); a.emo = null; }
async function talkTo(a) {
  const P = World.player;
  if (a.item) { await pickItem(a); return; }
  if (a.move !== "fixed") face(a, P);
  if (a.trainer && (!G.flag("tr_" + a.trainer.id) || G.flag("rm_" + a.trainer.id))) { await trainerBattle(a, false); return; }
  if (a.trainer && a.trainer.after) { await say(a.trainer.after); return; }
  if (a.talk) { if (typeof a.talk === "function") await a.talk(a); else await say(a.talk); }
}
async function getItem(id, n = 1, quiet = false) {
  const it = ITEMS[id]; G.give(id, n);
  const pk = POCKETS.find(p => p[0] === it.p)[1];
  const jg = it.p === "key" ? "jg_keyitem" : "jg_item";
  const P = fmt("{P}"), lab = n > 1 ? `${it.n} ${n}개` : it.n;
  const tb = await say(`${J(P, "은")} ${J(lab, "을")} 손에 넣었다!`, { keep: true });
  await Audio2.jingle(jg);
  Scenes.pop(tb);
  if (!quiet) await say(`${J(P, "은")} ${J(it.n, "을")}\n가방의 ${pk} 주머니에 넣었다.`);
}
async function pickItem(a) {
  const id = a.item, n = a.n || 1;
  G.flag("item_" + G.map + "_" + a.home[0] + "_" + a.home[1], true);
  World.actors.splice(World.actors.indexOf(a), 1);
  await getItem(id, n);
}
// 길 찾기 (스크립트·확인용): 막힌 칸·사람을 피해 가장 짧은 길
function findPath(a, tx, ty) {
  const M = World.M, key = (x, y) => y * M.w + x, prev = new Map([[key(a.x, a.y), null]]); const q = [[a.x, a.y]];
  while (q.length) {
    const [x, y] = q.shift(); if (x === tx && y === ty) break;
    for (const d of ["up", "down", "left", "right"]) { const [dx, dy] = DIRS[d], nx = x + dx, ny = y + dy, k = key(nx, ny);
      if (prev.has(k) || nx < 0 || ny < 0 || nx >= M.w || ny >= M.h) continue;
      if ((nx !== tx || ny !== ty) && World.solidAt(nx, ny, a)) continue;
      prev.set(k, [key(x, y), d]); q.push([nx, ny]); }
  }
  const out = []; let k = key(tx, ty); if (!prev.has(k)) return null;
  while (prev.get(k)) { const [pk, d] = prev.get(k); out.unshift(d); k = pk; }
  return out;
}
window.__nk = { wx: (w) => { World.wxForce = w; World.weather = World.M && World.M.outdoor && !World.def.noTint ? fieldWeather(World.zone) : null; return World.weather; },
  go: async (x, y) => { const p = findPath(World.player, x, y); if (!p) return false; await World.run(() => walk(World.player, p)); return true; } };
