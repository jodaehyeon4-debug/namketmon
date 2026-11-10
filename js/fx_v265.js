// ===== v2.65 기술 이펙트 다시 보기 — 작고 가늘던 그림 열셋을 크게 · 기술 위력에 따라 크기가 달라짐 =====
// 사용자(2026-11-10): "기술 이펙트 검토하고, 개선사항 있으면 스스로 피드백 후 고쳐."
// 검토(76가지 그림을 화면에 겹쳐 보고): ① 지진·스톤샤워가 2~3픽셀 점 몇 개 ② 파도타기가 세로 막대 ③ 화염방사·물대포·오물이 구슬 줄
//   ④ 얼음 조각·칼춤 칼·상태 기술 반짝이가 너무 작음 ⑤ 애교부리기에 소리 물결(흰 호)이 같이 그려짐 ⑥ 하이드로펌프(110)와 물대포(40),
//   불대문자(110)와 불꽃세례(40), 지진(100)과 땅고르기(60)가 똑같은 그림
// 고침: 아래 그림 열셋 + FX.play 다섯째 인자(기술) → job.k(위력 45 이하 0.85 · 70 이상 1.1 · 90 이상 1.25 · 110 이상 1.45)
// 실제 포켓몬처럼 묘사(센 기술일수록 크고 화면이 흔들림 — 구조만, 닌텐도 그림은 베끼지 않음) · fx_v250 뒤에 읽힘
"use strict";
(function fxV265() {
  const T = FX.tpl, cx = FX.ctx, W = 256, H = 144;
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
  const glint = (x, y, r, c) => { seg(x - r, y, x + r, y, 1, c); seg(x, y - r, x, y + r, 1, c); dot(x, y, 2, "#ffffff"); };
  const heartAt = (x, y, r, c) => { disc(x - r * .5, y, r * .6, c); disc(x + r * .5, y, r * .6, c); poly([[x - r * 1.05, y + r * .15], [x + r * 1.05, y + r * .15], [x, y + r * 1.3]], c); };
  const flameAt = (x, y, s, c0, c1) => { poly([[x - s, y], [x - s * .5, y - s * 1.3], [x, y - s * 2.3], [x + s * .5, y - s * 1.3], [x + s, y]], c0); poly([[x - s * .5, y], [x, y - s * 1.3], [x + s * .5, y]], c1); };
  const burst = (d, t, p, k = 1) => { t = clamp(t); if (t >= 1) return; star(d[0], d[1], (5 + 12 * ease(t)) * k, p[2], 6, t * 2); ring(d[0], d[1], (3 + 18 * t) * k, 2, p[1]);
    for (let i = 0; i < 8; i++) { const an = i * .785 + .2, r = (6 + 18 * t) * k; dot(d[0] + Math.cos(an) * r, d[1] + Math.sin(an) * r, 2, i % 2 ? p[1] : p[2]); } };
  const K = j => (j && j.k) || 1;
  const set = (name, o) => { T[name] = Object.assign(T[name] || {}, o); };   // 소리(snd)·배경 어둡게(dim)·제자리(self) 같은 설정은 그대로 둠
  const DUST = "#c8b090", EDGE = "#2a1c10";

  // ---------- 땅: 지진 — 바닥이 양쪽으로 갈라지고 돌덩이가 솟음 ----------
  set("quake", { dur: 900, hit: .3, draw(t, a, d, p, ty, j) { const k = K(j), gy = d[1] + d[2] * .24, wd = 44 + 26 * k, u = clamp(t * 2.2);
      for (const s of [-1, 1]) { let px = d[0], py = gy; for (let i = 1; i <= 7; i++) { if (i / 7 > u) break; const x = d[0] + s * wd * i / 7, y = gy + (R(i * 3 + (s > 0 ? 1 : 5)) * 2 - 1) * 5 * k;
          seg(px, py, x, y, 3, EDGE); seg(px, py - 1, x, y - 1, 1, p[0]); if (i % 2) seg(x, y, x + s * 3, y + (i % 4 ? 5 : -5) * k, 2, EDGE); px = x; py = y; } }
      for (let i = 0; i < 12; i++) { const s0 = .06 + R(i) * .36, v = clamp((t - s0) / .5); if (v <= 0 || v >= 1) continue;
        const x = d[0] + (R(i + 20) * 2 - 1) * wd, hh = (14 + 16 * R(i + 7)) * k, y = gy - Math.sin(v * Math.PI) * hh, s = (3 + 3 * R(i + 3)) * k;
        poly([[x - s - 1, y + s * .6 + 1], [x - s * .4, y - s - 1], [x + s * .7 + 1, y - s * .5], [x + s + 1, y + s * .7 + 1]], EDGE);
        poly([[x - s, y + s * .6], [x - s * .4, y - s], [x + s * .7, y - s * .5], [x + s, y + s * .7]], i % 2 ? p[0] : p[1]); dot(x - s * .2, y - s * .4, 2, p[2]); }
      for (let i = 0; i < 8; i++) { const v = clamp((t - .15) / .85); alpha(.55 * (1 - v), () => disc(d[0] + (R(i + 40) * 2 - 1) * wd, gy - 2 - v * 7, 3 + 5 * v, DUST)); } },
    start(j) { FX.shake(4 + 2 * K(j), 700); } });

  // ---------- 바위: 큰 돌이 차례로 떨어져 먼지가 남 ----------
  set("rocks", { dur: 840, hit: .5, draw(t, a, d, p, ty, j) { const k = K(j), n = k > 1.2 ? 7 : 5;
      for (let i = 0; i < n; i++) { const u = clamp((t - i * .06) / .42); if (u <= 0) continue;
        const x = d[0] + (i - (n - 1) / 2) * 9 * k + (R(i) * 2 - 1) * 3, ye = d[1] + 2 + (i % 2) * 6, y = lerp(-12, ye, u * u), s = (5 + 3 * R(i + 4)) * k;
        if (u < 1) { poly([[x - s, y + s * .5], [x - s * .7, y - s * .6], [x, y - s], [x + s * .8, y - s * .5], [x + s, y + s * .4], [x + s * .2, y + s]], EDGE);
          poly([[x - s * .8, y + s * .4], [x - s * .5, y - s * .5], [x, y - s * .8], [x + s * .6, y - s * .4], [x + s * .8, y + s * .3], [x + s * .1, y + s * .8]], p[0]);
          poly([[x - s * .5, y - s * .4], [x, y - s * .75], [x + s * .3, y - s * .3], [x - s * .2, y - s * .1]], p[1]); dot(x - s * .1, y - s * .5, 2, p[2]); }
        else { const v = clamp((t - i * .06 - .42) / .3); if (v < 1) alpha(.6 * (1 - v), () => { disc(x - 3, ye + 2 - v * 4, 2 + 3 * v, DUST); disc(x + 3, ye + 2 - v * 3, 2 + 2 * v, DUST); }); } }
      if (t > .5) burst(d, (t - .5) / .5, p, .8 * k); },
    start(j) { setTimeout(() => FX.shake(2 + 2 * K(j), 280), 380); } });

  // ---------- 물: 파도타기 — 물마루가 말린 큰 물결이 쓸고 지나감 ----------
  set("wave", { dur: 950, hit: .55, draw(t, a, d, p, ty, j) { const k = K(j), dir = d[0] > a[0] ? 1 : -1, x0 = dir > 0 ? -30 : W + 30, xs = lerp(x0, x0 + dir * (W + 150), ease(t));
      const top = H * (.36 - .1 * (k - 1)), tail = 130, wob = Math.sin(t * 22) * 2, P = (dx, y) => [xs - dir * dx, y];
      poly([P(tail, H), P(tail, H * .76), P(tail * .62, H * .62 + wob), P(tail * .3, top + 12 - wob), P(12, top), P(-6, top + 4), P(-15, top + 18), P(-11, top + 36), P(-20, H * .72), P(-27, H)], p[0]);
      poly([P(tail - 4, H), P(tail - 4, H * .78), P(tail * .6, H * .65 + wob), P(tail * .3, top + 16 - wob), P(10, top + 4), P(-4, top + 8), P(-11, top + 20), P(-7, top + 38), P(-16, H * .74), P(-22, H)], p[1]);
      poly([P(tail - 4, H), P(tail - 4, H * .9), P(tail * .5, H * .82 - wob), P(6, H * .66), P(-10, H * .84), P(-20, H)], p[0]);
      for (let i = 0; i < 4; i++) seg(xs - dir * (30 + i * 22), H * (.68 + i * .035) + wob, xs - dir * (46 + i * 22), H * (.665 + i * .035) + wob, 1.5, p[2]);
      for (let i = 0; i < 9; i++) { const dx = -15 + i * 4.5 + Math.sin(t * 30 + i) * 1.5, y = top + (i < 3 ? (3 - i) * 8 : 0) + Math.cos(t * 26 + i * 2) * 1.5; disc(xs - dir * dx, y, 3.6 - (i % 3) * .7, p[2]); }
      for (let i = 0; i < 10; i++) dot(xs + dir * (R(i) * 18 - 2), top - 8 + R(i + 2) * 22 - 4 * Math.sin(t * 20 + i), 2, p[2]); },
    start(j) { setTimeout(() => FX.shake(2 * K(j), 260), 500); } });

  // ---------- 불꽃: 화염방사 — 갈수록 커지는 불길 ----------
  set("flame", { dur: 760, hit: .5, draw(t, a, d, p, ty, j) { const k = K(j);
      for (let i = 0; i < 34; i++) { const s = i / 34 * .55, u = clamp((t - s) / .36); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0], u) + (R(i) * 2 - 1) * 6 * u * k, y = lerp(a[1], d[1], u) - Math.sin(u * Math.PI) * 6 + (R(i + 9) * 2 - 1) * 5 * u * k, r = (3 + 3.8 * u) * k;
        disc(x, y, r, p[0]); disc(x, y + .5, r * .68, p[1]); if (i % 2) disc(x, y + 1, r * .34, p[2]); }
      if (t > .42) for (let i = 0; i < 9; i++) { const u = clamp((t - .42 - i * .02) / .5); if (u <= 0 || u >= 1) continue;
        flameAt(d[0] + (R(i + 3) * 2 - 1) * d[2] * .3 * k, d[1] + 10 - u * 10, (2.5 + 2.5 * R(i + 5)) * k * (1 - u * .6), p[0], p[2]); } },
    start(j) { if (K(j) > 1.3) setTimeout(() => FX.shake(3, 240), 360); } });

  // ---------- 물: 물대포·하이드로펌프 — 굵은 물줄기와 튀는 물 ----------
  set("water", { dur: 700, hit: .5, draw(t, a, d, p, ty, j) { const k = K(j);
      for (let i = 0; i < 30; i++) { const s = i / 30 * .45, u = clamp((t - s) / .32); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0], u) + Math.cos(i * 2.3) * 1.5 * k, y = lerp(a[1], d[1], u) - Math.sin(u * Math.PI) * 5 + Math.sin(i) * 2.2 * k, r = (3.1 + 1.5 * R(i)) * k;
        disc(x, y, r + 1, p[0]); disc(x, y, r, p[1]); dot(x - r * .3, y - r * .4, Math.max(1.5, r * .5), p[2]); }
      if (t > .45) { const u = clamp((t - .45) / .55);
        for (let i = 0; i < 14; i++) { const an = -Math.PI * (.08 + .84 * R(i)), sp = (9 + 12 * R(i + 4)) * k; disc(d[0] + Math.cos(an) * sp * u, d[1] + Math.sin(an) * sp * u + 18 * u * u, 2.4 * (1 - u) * k + .6, i % 3 ? p[1] : p[2]); }
        alpha(1 - u, () => ring(d[0], d[1] + 4, (4 + 14 * u) * k, 2, p[2])); } },
    start(j) { if (K(j) > 1.3) setTimeout(() => FX.shake(3, 240), 340); } });

  // ---------- 독·땅: 오물 — 큼직한 덩어리가 포물선으로 날아와 퍼짐 ----------
  set("sludge", { dur: 720, hit: .6, draw(t, a, d, p, ty, j) { const k = K(j);
      for (let i = 0; i < 6; i++) { const u = clamp((t - i * .055) / .45); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0], u), y = lerp(a[1], d[1], u) - Math.sin(u * Math.PI) * 16, r = (6 - i * .45) * k;
        disc(x, y, r + 1, p[0]); disc(x, y, r, p[1]); disc(x - r * .3, y - r * .35, r * .32, p[2]); disc(x - (d[0] > a[0] ? 1 : -1) * r * .9, y + r * .5, r * .45, p[1]); }
      if (t > .55) { const u = clamp((t - .55) / .45);
        alpha(.9 * (1 - u * .6), () => { cx.fillStyle = p[0]; cx.beginPath(); cx.ellipse(d[0], d[1] + d[2] * .2, (8 + 12 * u) * k, (3 + 3 * u) * k, 0, 0, 7); cx.fill(); cx.fillStyle = p[1]; cx.beginPath(); cx.ellipse(d[0], d[1] + d[2] * .2 - 1, (6 + 10 * u) * k, (2 + 2 * u) * k, 0, 0, 7); cx.fill(); });
        for (let i = 0; i < 8; i++) { const x = d[0] + (R(i) * 2 - 1) * d[2] * .28 * k, y = d[1] + 8 - u * 18 * R(i + 2); ring(x, y, (1.5 + 2.5 * u) * k, 1.5, i % 2 ? p[1] : p[2]); } } } });

  // ---------- 얼음: 굵은 얼음 조각이 날아가 얼음꽃이 핌 ----------
  set("ice", { dur: 700, hit: .55, draw(t, a, d, p, ty, j) { const k = K(j), an = Math.atan2(d[1] - a[1], d[0] - a[0]);
      for (let i = 0; i < 12; i++) { const s = i * .03, u = clamp((t - s) / .45); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0], u) + (R(i) * 2 - 1) * 7 * k, y = lerp(a[1], d[1], u) + (R(i + 5) * 2 - 1) * 7 * k, L = (7 + 3 * R(i + 2)) * k, w = 2.6 * k;
        poly([[x + Math.cos(an) * L, y + Math.sin(an) * L], [x + Math.cos(an + 1.57) * w, y + Math.sin(an + 1.57) * w], [x - Math.cos(an) * L * .6, y - Math.sin(an) * L * .6], [x + Math.cos(an - 1.57) * w, y + Math.sin(an - 1.57) * w]], i % 2 ? p[1] : p[2]);
        seg(x - Math.cos(an) * L * .4, y - Math.sin(an) * L * .4, x + Math.cos(an) * L * .7, y + Math.sin(an) * L * .7, 1, "#ffffff"); }
      if (t > .5) { const u = (t - .5) / .5, r = 17 * k * ease(clamp(u * 1.6));
        alpha(1 - clamp((u - .7) / .3), () => { for (let i = 0; i < 6; i++) { const b = i * Math.PI / 3 + .26, ex = d[0] + Math.cos(b) * r, ey = d[1] + Math.sin(b) * r;
            seg(d[0], d[1], ex, ey, 3, p[1]); seg(d[0], d[1], ex, ey, 1, "#ffffff");
            for (const q of [-.6, .6]) seg(lerp(d[0], ex, .6), lerp(d[1], ey, .6), lerp(d[0], ex, .6) + Math.cos(b + q) * r * .3, lerp(d[1], ey, .6) + Math.sin(b + q) * r * .3, 1.5, p[2]);
            poly([[ex, ey - 3], [ex + 3, ey], [ex, ey + 3], [ex - 3, ey]], p[2]); } disc(d[0], d[1], 3, "#ffffff"); }); } } });

  // ---------- 애교부리기·친해지기·사랑가: 하트만(소리 물결은 뺌) ----------
  set("heart", { dur: 820, hit: .6, draw(t, a, d, p) {
      for (let i = 0; i < 7; i++) { const u = clamp(t * 1.5 - i * .09); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0], u) + Math.sin(u * 10 + i) * 5, y = lerp(a[1], d[1], u) - Math.sin(u * Math.PI) * 14 + Math.cos(u * 8 + i) * 3, r = 4 + (i % 2);
        heartAt(x, y, r + 1, "#a0204a"); heartAt(x, y, r, i % 2 ? "#ff6aa0" : "#ff9ac0"); dot(x - r * .5, y - r * .2, 1.5, "#ffffff"); }
      if (t > .55) { const u = (t - .55) / .45; for (let i = 0; i < 5; i++) alpha(1 - u * .7, () => heartAt(d[0] + (i - 2) * 8, d[1] - 6 - u * 16 - (i % 2) * 5, 3.6, i % 2 ? "#ff6aa0" : "#ff9ac0")); } } });

  // ---------- 상태 기술 공통: 큰 반짝이가 소용돌이치며 모여듦 ----------
  set("status", { dur: 760, hit: 1, draw(t, a, d, p) {
      for (let i = 0; i < 12; i++) { const u = clamp(t * 1.2 - i * .04), an = i * 2.1 + t * 4, r = 26 * (1 - u) + 5; if (u <= 0 || u >= 1) continue;
        const x = d[0] + Math.cos(an) * r, y = d[1] + Math.sin(an) * r * .7 - u * 6; if (i % 3) { disc(x, y, 3.4, p[0]); disc(x, y, 2.4, i % 2 ? p[1] : p[2]); } else { star(x, y, 5, p[0], 4, t * 6); star(x, y, 3.6, p[2], 4, t * 6); } }
      alpha(1 - t, () => { ring(d[0], d[1], 6 + 18 * t, 2.5, p[0]); ring(d[0], d[1], 6 + 18 * t, 1.5, p[1]); }); } });

  // ---------- 칼춤·손톱갈기: 큰 칼 넷이 돌다가 엇갈려 번쩍 ----------
  set("swords", { dur: 820, hit: 1, self: true, draw(t, a, d, p) {
      for (let i = 0; i < 4; i++) { const an = t * 5 + i * Math.PI / 2, x = a[0] + Math.cos(an) * 24, y = a[1] + Math.sin(an) * 9 - 6, back = Math.sin(an) < 0;
        alpha(back ? .65 : 1, () => { poly([[x - 3, y + 8], [x - 3, y - 10], [x, y - 15], [x + 3, y - 10], [x + 3, y + 8]], "#2a3040"); poly([[x - 1.6, y + 8], [x - 1.6, y - 10], [x, y - 13], [x + 1.6, y - 10], [x + 1.6, y + 8]], "#f4f8ff"); rect(x, y - 10, 1, 17, "#b8c4d8");
          rect(x - 6, y + 8, 12, 3, "#7a5a10"); rect(x - 5, y + 8, 10, 2, "#e8b830"); rect(x - 1.5, y + 11, 3, 5, "#5a3414"); });
        if ((Math.floor(t * 20) + i) % 5 === 0) glint(x + 1, y - 12, 4, "#ffffff"); }
      if (t > .7) { const u = (t - .7) / .3; alpha(1 - u, () => { seg(a[0] - 13, a[1] - 13, a[0] + 13, a[1] + 13, 2.5, "#ffffff"); seg(a[0] + 13, a[1] - 13, a[0] - 13, a[1] + 13, 2.5, "#ffffff"); }); } } });

  // ---------- 벌레: 시그널빔 — 두 겹 고리가 줄지어 ----------
  set("buzz", { dur: 700, hit: .5, draw(t, a, d, p, ty, j) { const k = K(j);
      for (let i = 0; i < 5; i++) { const u = t * 1.8 - i * .14; if (u < 0 || u > 1) continue; const x = lerp(a[0], d[0], u), y = lerp(a[1], d[1], u);
        ring(x, y, (4 + 6 * u) * k, 2.5, p[1]); ring(x, y, (2 + 3 * u) * k, 1.5, p[2]); }
      if (t > .5) burst(d, (t - .5) / .5, p, .9 * k); } });

  // ---------- 구슬·빛줄기: 위력에 따라 크기 ----------
  set("orb", { dur: 640, hit: .62, draw(t, a, d, p, ty, j) { const k = K(j), u = ease(clamp(t / .62)), x = lerp(a[0], d[0], u), y = lerp(a[1], d[1], u) - Math.sin(u * Math.PI) * 8;
      if (t < .62) { for (let i = 1; i < 7; i++) { const v = clamp(u - i * .045); disc(lerp(a[0], d[0], v), lerp(a[1], d[1], v) - Math.sin(v * Math.PI) * 8, (4.2 - i * .5) * k, p[1]); }
        disc(x, y, 6.4 * k, p[0]); disc(x, y, 4.8 * k, p[1]); disc(x - 1.5 * k, y - 1.5 * k, 2 * k, p[2]); if (Math.floor(t * 30) % 2) glint(x + 5 * k, y - 4 * k, 3, p[2]); }
      else burst(d, (t - .62) / .38, p, k); } });
  set("beam", { dur: 780, hit: .45, draw(t, a, d, p, ty, j) { const k = K(j), ch = clamp(t / .3), w = (t < .3 ? 0 : t < .85 ? 6 + 2 * Math.sin(t * 60) : 6 * (1 - (t - .85) / .15)) * k;
      disc(a[0], a[1], (3 + 6 * ch) * k, p[1]); disc(a[0], a[1], (1.5 + 3.5 * ch) * k, p[2]);
      if (t < .3) for (let i = 0; i < 6; i++) { const an = i * 1.05 + t * 9, r = 16 * (1 - ch); dot(a[0] + Math.cos(an) * r, a[1] + Math.sin(an) * r, 2, p[2]); }
      if (w > 0) { cx.lineCap = "butt"; cx.strokeStyle = p[0]; cx.lineWidth = w + 4; cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(d[0], d[1]); cx.stroke();
        cx.strokeStyle = p[1]; cx.lineWidth = w; cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(d[0], d[1]); cx.stroke();
        cx.strokeStyle = p[2]; cx.lineWidth = Math.max(1, w - 4); cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(d[0], d[1]); cx.stroke(); burst(d, (t - .3) / .7, p, .8 * k); } },
    start(j) { if (K(j) > 1.3) setTimeout(() => FX.shake(3, 300), 260); } });

  window.FX_V265 = { redone: ["quake", "rocks", "wave", "flame", "water", "sludge", "ice", "heart", "status", "swords", "buzz", "orb", "beam"] };
})();
