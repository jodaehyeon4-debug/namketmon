// ===== v2.70 위력별 이펙트 크기를 나머지 그림에도 =====
// v2.65는 다시 그린 열셋(지진·화염·물…)만 위력에 따라 크기가 달랐다. 몸통박치기(40)와 기가임팩트(150), 할퀴기(40)와 드래곤크루(80)는
// 여전히 똑같은 그림. 여기서 위력 있는 기술이 쓰는 나머지 그림 서른여섯을 모두 job.k(0.85~1.45)에 맞춘다.
//   ① 맞는 자리에만 그리는 그림(부딪기·때리기·베기·물기…): 맞는 자리를 중심으로 통째 k배
//   ② 날아가서 터지는 그림(용의 숨결·잎날·별…): 날아가는 동안 조금씩 커져서 맞는 순간 k배(쏘는 쪽 자리는 그대로)
//   ③ 쏘는 쪽에도 그림이 남거나 화면 가득 그리는 것(돌진·소리·채찍·번개·흡수·염력·바람·달빛·눈보라·역린): 손으로 다시 — 선 굵기·개수·터짐 크기만 k배
//   ④ 위력 90 이상인데 흔들림이 없던 그림은 맞는 순간 화면이 살짝 흔들림
// 실제 포켓몬처럼 묘사(센 기술일수록 크게 — 구조만, 닌텐도 그림은 베끼지 않음) · fx_v265 뒤에 읽힘
"use strict";
(function fxV270() {
  const T = FX.tpl, cx = FX.ctx;
  const R = n => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
  const lerp = (a, b, t) => a + (b - a) * t, ease = t => t * t * (3 - 2 * t), clamp = t => Math.max(0, Math.min(1, t));
  const rect = (x, y, w, h, c) => { cx.fillStyle = c; cx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))); };
  const dot = (x, y, s, c) => rect(x - s / 2, y - s / 2, s, s, c);
  const disc = (x, y, r, c) => { cx.fillStyle = c; cx.beginPath(); cx.arc(Math.round(x), Math.round(y), Math.max(0.5, r), 0, 7); cx.fill(); };
  const ring = (x, y, r, w, c) => { cx.strokeStyle = c; cx.lineWidth = w; cx.beginPath(); cx.arc(Math.round(x), Math.round(y), Math.max(0.5, r), 0, 7); cx.stroke(); };
  const seg = (x0, y0, x1, y1, w, c) => { cx.strokeStyle = c; cx.lineWidth = w; cx.lineCap = "round"; cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x1, y1); cx.stroke(); cx.lineCap = "butt"; };
  const star = (x, y, r, c, n = 5, rot = 0) => { cx.fillStyle = c; cx.beginPath(); for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? r * 0.42 : r; cx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } cx.fill(); };
  const poly = (pts, c) => { cx.fillStyle = c; cx.beginPath(); pts.forEach(([x, y]) => cx.lineTo(x, y)); cx.fill(); };
  const alpha = (a, f) => { const o = cx.globalAlpha; cx.globalAlpha = o * clamp(a); f(); cx.globalAlpha = o; };
  const burst = (d, t, p, k = 1) => { t = clamp(t); if (t >= 1) return; star(d[0], d[1], (5 + 12 * ease(t)) * k, p[2], 6, t * 2); ring(d[0], d[1], (3 + 18 * t) * k, 2, p[1]);
    for (let i = 0; i < 8; i++) { const an = i * .785 + .2, r = (6 + 18 * t) * k; dot(d[0] + Math.cos(an) * r, d[1] + Math.sin(an) * r, 2, i % 2 ? p[1] : p[2]); } };
  const flav = (ty, d, u, k = 1) => { if (FX.flav) FX.flav(ty || "노말", d[0], d[1], u, k); };
  const K = j => (j && j.k) || 1;
  // c를 중심으로 s배 해서 그리기
  const about = (c, s, f) => { if (s === 1) return f(); cx.save(); cx.translate(c[0], c[1]); cx.scale(s, s); cx.translate(-c[0], -c[1]); try { f(); } finally { cx.restore(); } };

  const base = {}; for (const k of Object.keys(T)) base[k] = T[k].draw;
  const AT = "tackle punch kick slash bite star fairy metal mapae gourd coins jab bind icicle thunder".split(" ");
  const FLY = "dragon dark azalea leaf payday needles tri stars shadow".split(" ");
  // ① 맞는 자리 중심으로 통째
  for (const n of AT) { if (!T[n]) continue; const d0 = base[n];
    T[n].draw = function (t, a, d, p, ty, j) { const k = K(j); about(d, k, () => d0.call(this, t, a, d, p, ty, j)); }; }
  // ② 날아가는 동안 차츰 커짐: 맞는 순간(hit)에 k배 — 쏘는 쪽에서 막 나온 그림은 제자리·제 크기
  for (const n of FLY) { if (!T[n]) continue; const d0 = base[n], hit = T[n].hit || .5;
    T[n].draw = function (t, a, d, p, ty, j) { const k = K(j), w = clamp(t / hit), s = 1 + (k - 1) * w * w; about(d, s, () => d0.call(this, t, a, d, p, ty, j)); }; }

  // ③ 손으로 다시 — 쏘는 쪽 그림은 그대로 두고 굵기·개수·터짐만
  // 돌진: 속도선이 많고 길어짐 + 부딪는 그림 k배
  T.dash.draw = function (t, a, d, p, ty, j) { const k = K(j), dir = d[0] > a[0] ? 1 : -1, n = Math.round(8 * k);
    for (let i = 0; i < n; i++) { const y = lerp(a[1], d[1], .5) + (i - n / 2) * 4, x = lerp(a[0], d[0], ease(t)) - dir * R(i) * 20; seg(x, y, x - dir * 14 * k, y, k >= 1.25 ? 2 : 1, p[2]); }
    if (t > .3) about(d, k, () => base.tackle.call(T.tackle, (t - .3) / .7, a, d, p));
    flav(ty, d, (t - .3) / .7, k); };
  // 소리: 물결이 굵고 넓고 많아짐 + 센 소리는 맞는 자리에서 떨림 고리
  T.sound.draw = function (t, a, d, p, ty, j) { const k = K(j), an = Math.atan2(d[1] - a[1], d[0] - a[0]), n = k >= 1.25 ? 7 : k < 1 ? 4 : 5, L = Math.hypot(d[0] - a[0], d[1] - a[1]);
    for (let i = 0; i < n; i++) { const u = clamp(t * 1.6 - i * .15 * 5 / n); if (u <= 0 || u >= 1) continue;
      cx.strokeStyle = i % 2 ? p[1] : p[2]; cx.lineWidth = 2 * Math.max(1, k); cx.beginPath(); cx.arc(a[0], a[1], 6 + u * L, an - .35 * k, an + .35 * k); cx.stroke(); }
    if (k > 1 && t > .55) { const v = (t - .55) / .45; alpha(1 - v, () => { ring(d[0], d[1], (8 + 14 * v) * k, 2, p[2]); ring(d[0], d[1], (4 + 10 * v) * k, 1, p[1]); }); } };
  // 채찍: 줄이 굵어지고 내리친 자국·터짐이 커짐
  T.whip.draw = function (t, a, d, p, ty, j) { const k = K(j), u = t < .45 ? ease(t / .45) : t < .62 ? 1 : 1 - ease((t - .62) / .38);
    if (u > .02) { const tx = lerp(a[0], d[0] + 4, u), tyy = lerp(a[1] - 6, d[1] - 2, u), mx = (a[0] + tx) / 2, my = Math.min(a[1], tyy) - 34 * Math.sin(u * Math.PI * .9) - 6;
      cx.lineCap = "round"; cx.strokeStyle = p[0]; cx.lineWidth = 5 * k; cx.beginPath(); cx.moveTo(a[0], a[1] - 6); cx.quadraticCurveTo(mx, my, tx, tyy); cx.stroke();
      cx.strokeStyle = p[1]; cx.lineWidth = 2.5 * k; cx.stroke(); cx.lineCap = "butt"; disc(tx, tyy, 3 * k, p[2]); }
    if (t > .42) { const v = (t - .42) / .58; alpha(1 - v, () => { cx.strokeStyle = "#ffffff"; cx.lineWidth = 3 * k; cx.beginPath(); cx.arc(d[0] - 6 * k, d[1] - 16 * k, 22 * k, .5, 1.5); cx.stroke(); });
      burst(d, v, p, .7 * k); flav(ty, d, v, k); } };
  // 번개 줄기: 굵고 더 크게 꺾이고 불똥이 멀리 튐
  T.bolt.draw = function (t, a, d, p, ty, j) { const k = K(j);
    if (t < .7) { const n = 9; let px = a[0], py = a[1];
      for (let i = 1; i <= n; i++) { const u = i / n, x = lerp(a[0], d[0], u) + (i < n ? (R(i + Math.floor(t * 20)) * 2 - 1) * 7 * k : 0), y = lerp(a[1], d[1], u) + (i < n ? (R(i * 3 + Math.floor(t * 20)) * 2 - 1) * 7 * k : 0);
        seg(px, py, x, y, 3 * k, p[0]); seg(px, py, x, y, 1.5 * k, p[2]); px = x; py = y; } }
    if (t > .3) { const n = Math.round(10 * k); for (let i = 0; i < n; i++) { const u = clamp((t - .3) / .7), an = R(i) * 6.3; dot(d[0] + Math.cos(an) * u * 16 * k, d[1] + Math.sin(an) * u * 16 * k, k >= 1.25 ? 3 : 2, i % 2 ? p[1] : p[2]); }
      if (k >= 1.25) alpha(1 - (t - .3) / .7, () => ring(d[0], d[1], 6 + (t - .3) * 30 * k, 2, p[2])); } };
  // 흡수: 터짐이 커지고 빨려 오는 방울이 많아짐
  T.drain.draw = function (t, a, d, p, ty, j) { const k = K(j), n = Math.round(10 * k);
    if (t < .4) { burst(d, t / .4, p, .7 * k); flav(ty, d, t / .4, .7 * k); }
    if (t > .3) for (let i = 0; i < n; i++) { const u = clamp((t - .3 - i * .35 / n) / .45); if (u <= 0 || u >= 1) continue; const x = lerp(d[0], a[0], ease(u)) + Math.sin(u * 9 + i) * 6 * k, y = lerp(d[1], a[1], ease(u)) - Math.sin(u * Math.PI) * 14;
      disc(x, y, 3 * Math.max(.9, k), "#7ae07a"); dot(x - 1, y - 1, 1.5, "#ffffff"); }
    if (t > .78) alpha(1 - (t - .78) / .22, () => ring(a[0], a[1], 10 + (t - .78) * 60, 2, "#7ae07a")); };
  // 염력: 맞는 쪽 고리가 커지고 겹이 늘어남(쏘는 쪽 고리는 그대로)
  T.psy.draw = function (t, a, d, p, ty, j) { const k = K(j), n = k >= 1.25 ? 6 : 4;
    for (let i = 0; i < n; i++) { const u = (t * 1.6 - i * .18 * 4 / n); if (u < 0 || u > 1) continue; ring(d[0], d[1], (4 + u * 20) * k, 2 * Math.max(1, k * .9), i % 2 ? p[1] : p[0]); }
    ring(a[0], a[1], 6 + 3 * Math.sin(t * 20), 1.5, p[1]); };
  // 바람: 회오리가 커지고 바람 줄이 늘어남
  T.gust.draw = function (t, a, d, p, ty, j) { const k = K(j), n = Math.round(6 * k), m = k >= 1.25 ? 4 : 3;
    for (let i = 0; i < m; i++) { const r0 = (6 + i * 5) * k, s = t * 14 + i * 2; cx.strokeStyle = i % 2 ? p[1] : p[2]; cx.lineWidth = 2 * Math.max(1, k * .9); cx.beginPath(); cx.arc(d[0], d[1], r0 * (.6 + .4 * t), s, s + 2.2); cx.stroke(); }
    for (let i = 0; i < n; i++) { const u = clamp(t * 1.4 - i * .48 / n); if (u > 0 && u < 1) { const x = lerp(a[0], d[0], u), y = lerp(a[1], d[1], u) + (i % 3 - 1) * 4 * (k - .6); seg(x - 4 * k, y, x + 4 * k, y, 1, p[2]); } } };
  // 달빛: 달과 빛기둥·터짐이 커짐
  T.moon.draw = function (t, a, d, p, ty, j) { const k = K(j), u = ease(clamp(t / .5)), mx = lerp(a[0], d[0], .5), my = lerp(40, 22, u);
    about([mx, my], k, () => { disc(mx, my, 10, "#fff6c8"); disc(mx + 4, my - 2, 9, "rgba(40,40,80,.85)"); ring(mx, my, 12 + 3 * Math.sin(t * 20), 1, "#fff0a0"); });
    if (t > .45) { const v = (t - .45) / .55; cx.globalAlpha = .55 * (1 - v); poly([[mx - 3 * k, my], [mx + 3 * k, my], [d[0] + 16 * k, d[1] + 14], [d[0] - 16 * k, d[1] + 14]], "#fff6c8"); cx.globalAlpha = 1; burst(d, v, ["#c8b8ff", "#fff6c8", "#fff"], .9 * k); } };

  // 역린: 때리는 그림은 맞는 자리에서 k배, 용 줄기는 닿을 때(0.5)까지 차츰 커짐 — 통째로 키우면 줄기가 쏘는 쪽 뒤로 밀려남
  T.rampage.draw = function (t, a, d, p, ty, j) { const k = K(j), t2 = Math.min(1, t * 1.2), w = clamp(t2 / .6), s = 1 + (k - 1) * w * w;
    about(d, k, () => base.punch.call(T.punch, t, a, d, p)); about(d, s, () => base.dragon.call(T.dragon, t2, a, d, p)); flav(ty, d, (t - .3) / .7, k); };
  // 눈보라: 화면 가득 내리는 눈은 줄이거나 늘리면 가장자리가 비므로, 눈송이 수와 크기·터짐만
  T.snow.draw = function (t, a, d, p, ty, j) { const k = K(j), n = Math.round(60 * k), big = k >= 1.25 ? 1 : 0;
    for (let i = 0; i < n; i++) { const x = (R(i) * 256 * 1.4 - t * 256 * .8 + 256) % 256, y = (R(i + 7) * 144 + t * 144 * 1.3) % 144; dot(x, y, (i % 3 ? 2 : 3) + big, i % 2 ? p[2] : p[1]); }
    if (t > .5) burst(d, (t - .5) / .5, p, .9 * k); };

  // ④ 위력 90 이상: 맞는 순간 화면이 흔들림(이미 크게 흔드는 그림은 빼고)
  const CUSTOM = ["dash", "sound", "whip", "bolt", "drain", "psy", "gust", "moon", "snow", "rampage"], NOSHAKE = { rampage: 1, mapae: 1, snow: 1, moon: 1, drain: 1 };
  for (const n of [...AT, ...FLY, ...CUSTOM]) { const tp = T[n]; if (!tp || NOSHAKE[n]) continue; const s0 = tp.start;
    tp.start = function (job) { if (s0) s0.call(this, job); if (job && job.k >= 1.25) setTimeout(() => FX.shake(job.k >= 1.45 ? 5 : 3, job.k >= 1.45 ? 320 : 220), tp.dur * tp.hit); }; }

  window.FX_V270 = { at: AT.filter(n => T[n]), fly: FLY.filter(n => T[n]), custom: CUSTOM, base };
})();
