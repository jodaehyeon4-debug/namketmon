// ===== v2.50 기술 이펙트 전수 점검 (사용자: "기술 이펙트 점검해 max effort") =====
// 실제 포켓몬처럼: 기술마다 모양이 다르고(찌르기·채찍·조이기·가루·눈빛·연기·거미줄·흡수…), 몸으로 부딪는 기술은 타입 기운이 튐(불꽃 기술 몸통박치기면 불길),
// 능력 변화·상태 이상은 저마다 그림(오름 = 붉은 화살 · 내림 = 푸른 화살 · 잠듦 Z · 마비 불꽃 · 독 거품 · 화상 불길 · 얼음 · 혼란 별 · 헤롱헤롱 하트)
// 세게 맞는 특수 기술은 배경이 어두워지고(악·고스트·에스퍼·드래곤·밤), 템플릿마다 효과음
"use strict";
(() => {
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
  const ZZ = { "#": 1 };
  // ---------- 타입 기운: 부딪힌 자리에서 튀는 것(몸으로 부딪는 기술·때리기·물기·찌르기 공통) ----------
  function flav(ty, x, y, u, k = 1) {
    if (u <= 0 || u >= 1 || !ty || ty === "노말") return;
    const P = FXP[ty] || FXP["노말"], v = ease(u);
    for (let i = 0; i < 8; i++) {
      const an = i * 0.785 + R(i + 1) * .5, r = (6 + 20 * v) * k, px = x + Math.cos(an) * r, py = y + Math.sin(an) * r * .8;
      switch (ty) {
        case "불꽃": { const fx = x + (R(i) * 2 - 1) * 16 * k, fy = y + 10 - v * 26 * (0.6 + R(i + 3) * .6); flameAt(fx, fy, 3.2 * (1 - v) + 1, i % 2 ? P[1] : P[0], P[2]); break; }
        case "물": { const fx = x + Math.cos(an) * r, fy = y + Math.sin(an) * r * .6 - 10 * v + 22 * v * v; disc(fx, fy, 2.4 * (1 - v) + .8, P[1]); dot(fx - 1, fy - 1, 1, P[2]); break; }
        case "풀": { const s = 3.5 * (1 - v) + 1, a2 = an + v * 6; poly([[px + Math.cos(a2) * s, py + Math.sin(a2) * s], [px + Math.cos(a2 + 1.6) * s * .4, py + Math.sin(a2 + 1.6) * s * .4], [px - Math.cos(a2) * s, py - Math.sin(a2) * s], [px + Math.cos(a2 - 1.6) * s * .4, py + Math.sin(a2 - 1.6) * s * .4]], i % 2 ? P[1] : P[0]); break; }
        case "전기": { const r0 = r * .4; let qx = x + Math.cos(an) * r0, qy = y + Math.sin(an) * r0; for (let j = 0; j < 3; j++) { const nx = qx + Math.cos(an + (j % 2 ? .7 : -.7)) * 5 * k, ny = qy + Math.sin(an + (j % 2 ? .7 : -.7)) * 5 * k; seg(qx, qy, nx, ny, 2, j % 2 ? P[2] : P[1]); qx = nx; qy = ny; } break; }
        case "얼음": { const s = 4 * (1 - v) + 1; poly([[px + Math.cos(an) * s * 1.6, py + Math.sin(an) * s * 1.6], [px + Math.cos(an + 2.2) * s * .6, py + Math.sin(an + 2.2) * s * .6], [px + Math.cos(an - 2.2) * s * .6, py + Math.sin(an - 2.2) * s * .6]], i % 2 ? P[1] : P[2]); if (i % 3 === 0) glint(px, py, 3, P[2]); break; }
        case "격투": { const r1 = (8 + 18 * v) * k, r2 = r1 + 7 * k; seg(x + Math.cos(an) * r1, y + Math.sin(an) * r1, x + Math.cos(an) * r2, y + Math.sin(an) * r2, 2, i % 2 ? P[1] : P[2]); break; }
        case "독": { const bx = x + (R(i) * 2 - 1) * 14 * k, by = y + 8 - v * 22 * (.5 + R(i + 2)); if (v < .85) ring(bx, by, 1.5 + 2.5 * v, 1.5, i % 2 ? P[1] : P[0]); else dot(bx, by, 3, P[2]); break; }
        case "땅": { const fx = x + Math.cos(an) * r * 1.1, fy = y + 6 - 18 * v * (.5 + R(i)) + 26 * v * v; rect(fx - 2, fy - 2, 4 - v * 2 + 1, 4 - v * 2 + 1, i % 2 ? P[0] : P[1]); if (i < 3) alpha(.5 * (1 - v), () => disc(x + (i - 1) * 9, y + 10, 4 + 6 * v, P[2])); break; }
        case "비행": { const fx = px + Math.sin(v * 8 + i) * 3, fy = py + v * 8; seg(fx - 3, fy - 1, fx + 3, fy + 1, 2, i % 2 ? P[2] : P[1]); dot(fx + 3, fy + 1, 1.5, P[0]); break; }
        case "에스퍼": if (i < 3) ring(x, y, (4 + 22 * v) * k - i * 5, 2, i % 2 ? P[1] : P[0]); break;
        case "벌레": { const s = 3.6 * (1 - v) + 1.4, a2 = an + v * 5; poly([[px + Math.cos(a2) * s * 1.4, py + Math.sin(a2) * s * 1.4], [px + Math.cos(a2 + 2.3) * s, py + Math.sin(a2 + 2.3) * s], [px + Math.cos(a2 - 2.3) * s, py + Math.sin(a2 - 2.3) * s]], i % 2 ? P[1] : P[0]); break; }
        case "바위": { const fx = x + Math.cos(an) * r, fy = y + Math.sin(an) * r * .5 + 24 * v * v; rect(fx - 2.5, fy - 2.5, 5, 5, P[0]); rect(fx - 1.5, fy - 2.5, 3, 1.5, P[2]); break; }
        case "고스트": { const fx = x + Math.cos(an + v * 3) * r, fy = y + Math.sin(an + v * 3) * r * .7 - v * 10; alpha(1 - v, () => { disc(fx, fy, 3, P[1]); disc(fx - Math.cos(an) * 3, fy + 2, 2, P[0]); }); break; }
        case "드래곤": { const a2 = an + v * 4, fx = x + Math.cos(a2) * r, fy = y + Math.sin(a2) * r * .7; disc(fx, fy, 2.6 * (1 - v) + 1, i % 2 ? P[1] : P[0]); dot(fx, fy, 1, P[2]); break; }
        case "악": { const r1 = (6 + 16 * v) * k; poly([[x + Math.cos(an) * r1, y + Math.sin(an) * r1], [x + Math.cos(an + .25) * (r1 + 8), y + Math.sin(an + .25) * (r1 + 8)], [x + Math.cos(an - .1) * (r1 + 10), y + Math.sin(an - .1) * (r1 + 10)]], i % 2 ? "#120e10" : P[1]); break; }
        case "강철": { const s = 5 * (1 - v) + 2; poly([[px, py - s], [px + s * .35, py], [px, py + s], [px - s * .35, py]], i % 2 ? P[0] : P[1]); if (i % 2 === 0) glint(px, py, s, "#ffffff"); break; }
        case "페어리": star(px, py - v * 6, 5 * (1 - v) + 1.5, i % 2 ? P[0] : P[1], 4, v * 4); dot(px, py - v * 6, 2, "#ffffff"); break;
      }
    }
  }
  FX.flav = flav;
  const tyOf = (ty) => ty || "노말";
  // ---------- 몸으로 부딪는 기술: 원래 그림 + 타입 기운 ----------
  for (const [k, at] of [["tackle", .15], ["dash", .3], ["punch", .1], ["kick", .15], ["slash", .25], ["bite", .45], ["rampage", .3]]) {
    const o = T[k], d0 = o.draw;
    o.draw = function (t, a, d, p, ty, j) { d0.call(this, t, a, d, p, ty, j); flav(tyOf(ty), d[0], d[1], (t - at) / (1 - at)); };
  }
  T.tackle.snd = "whoosh"; T.dash.snd = "dash"; T.punch.snd = "whoosh"; T.kick.snd = "whoosh"; T.slash.snd = "slash"; T.bite.snd = "bite"; T.rampage.snd = "dragon";
  // 찌르기(쪼기·뿔찌르기·독찌르기·회전부리): 뾰족한 끝이 세 번 빠르게
  T.jab = { dur: 520, hit: .3, snd: "slash", draw(t, a, d, p, ty) { const dir = d[0] > a[0] ? 1 : -1, an = Math.atan2(d[1] - a[1], d[0] - a[0]);
      for (let i = 0; i < 3; i++) { const u = clamp((t - i * .1) / .25); if (u <= 0 || u >= 1) continue; const ox = (i - 1) * 7, oy = (1 - i) * 5, rr = lerp(26, 2, ease(u));
        const tx = d[0] + ox - Math.cos(an) * rr, ty2 = d[1] + oy - Math.sin(an) * rr; seg(tx - Math.cos(an) * 16, ty2 - Math.sin(an) * 16, tx, ty2, 5, p[0]); seg(tx - Math.cos(an) * 14, ty2 - Math.sin(an) * 14, tx, ty2, 2, p[2]);
        poly([[tx + Math.cos(an) * 5, ty2 + Math.sin(an) * 5], [tx + Math.cos(an + 1.8) * 3, ty2 + Math.sin(an + 1.8) * 3], [tx + Math.cos(an - 1.8) * 3, ty2 + Math.sin(an - 1.8) * 3]], p[2]);
        if (u > .8) star(d[0] + ox, d[1] + oy, 8, p[2], 4, .4); }
      flav(tyOf(ty), d[0], d[1], (t - .35) / .65); } };
  // 바늘·뾰족 떼(바늘미사일): 가는 바늘이 줄지어 날아감
  T.needles = { dur: 640, hit: .5, snd: "buzz", draw(t, a, d, p, ty) { const an = Math.atan2(d[1] - a[1], d[0] - a[0]);
      for (let i = 0; i < 7; i++) { const u = clamp((t - i * .05) / .4); if (u <= 0 || u >= 1) continue; const x = lerp(a[0], d[0], u) + (R(i) * 2 - 1) * 6, y = lerp(a[1], d[1], u) + (R(i + 4) * 2 - 1) * 6;
        seg(x - Math.cos(an) * 7, y - Math.sin(an) * 7, x, y, 2, p[0]); dot(x, y, 2, p[2]); }
      if (t > .45) { burst(d, (t - .45) / .55, p, .6); flav(tyOf(ty), d[0], d[1], (t - .45) / .55); } } };
  // 채찍(덩굴채찍·아이언테일·아쿠아테일·힘껏치기): 휘어진 줄이 위에서 내리침
  T.whip = { dur: 640, hit: .45, snd: "whip", draw(t, a, d, p, ty) { const u = t < .45 ? ease(t / .45) : t < .62 ? 1 : 1 - ease((t - .62) / .38);
      if (u > .02) { const tx = lerp(a[0], d[0] + 4, u), tyy = lerp(a[1] - 6, d[1] - 2, u), mx = (a[0] + tx) / 2, my = Math.min(a[1], tyy) - 34 * Math.sin(u * Math.PI * .9) - 6;
        cx.lineCap = "round"; cx.strokeStyle = p[0]; cx.lineWidth = 5; cx.beginPath(); cx.moveTo(a[0], a[1] - 6); cx.quadraticCurveTo(mx, my, tx, tyy); cx.stroke();
        cx.strokeStyle = p[1]; cx.lineWidth = 2.5; cx.stroke(); cx.lineCap = "butt"; disc(tx, tyy, 3, p[2]); }
      if (t > .42) { const v = (t - .42) / .58; alpha(1 - v, () => { cx.strokeStyle = "#ffffff"; cx.lineWidth = 3; cx.beginPath(); cx.arc(d[0] - 6, d[1] - 16, 22, .5, 1.5); cx.stroke(); });
        burst(d, v, p, .7); flav(tyOf(ty), d[0], d[1], v); } }, start() { setTimeout(() => FX.shake(2, 140), 280); } };
  // 조이기(김밥말이·모래지옥·회오리불꽃): 고리가 감아 조임
  T.bind = { dur: 860, hit: .5, snd: "bind", draw(t, a, d, p, ty) { const sq = t < .5 ? 1 - ease(t / .5) * .35 : .65 + .05 * Math.sin(t * 40);
      for (let i = 0; i < 4; i++) { const yy = d[1] - 16 + i * 10, w = 26 * sq; cx.strokeStyle = i % 2 ? p[1] : p[0]; cx.lineWidth = 3; cx.beginPath(); cx.ellipse(d[0], yy, w, 4, 0, Math.PI * (t * 4 + i), Math.PI * (t * 4 + i) + Math.PI * 1.4); cx.stroke(); }
      if (ty === "땅" || ty === "불꽃") for (let i = 0; i < 12; i++) { const an = t * 9 + i, r = 22 * sq; const x = d[0] + Math.cos(an) * r, y = d[1] + 10 - ((t * 60 + i * 7) % 34); if (ty === "불꽃") flameAt(x, y + 4, 2.2, p[0], p[2]); else dot(x, y, 2, p[i % 3]); }
      if (t > .5) flav(tyOf(ty), d[0], d[1], (t - .5) / .5, .7); } };
  // 고드름떨구기·눈사태: 위에서 고드름·얼음덩이가 쏟아짐
  T.icicle = { dur: 720, hit: .45, snd: "crash", draw(t, a, d, p) { for (let i = 0; i < 6; i++) { const u = clamp((t - i * .06) / .38), x = d[0] + (i - 2.5) * 7, y = lerp(-14, d[1] - 4 + (i % 2) * 5, ease(u));
        if (u > 0 && u < 1) { poly([[x - 4, y - 12], [x + 4, y - 12], [x, y + 4]], p[1]); poly([[x - 2, y - 12], [x, y - 12], [x, y]], p[2]); } }
      if (t > .45) { burst(d, (t - .45) / .55, p, .9); flav("얼음", d[0], d[1], (t - .45) / .55); } }, start() { setTimeout(() => FX.shake(3, 220), 320); } };
  // 고양이돈받기: 동전이 튀어 날아감
  T.payday = { dur: 640, hit: .5, snd: "coins", draw(t, a, d, p) { for (let i = 0; i < 6; i++) { const u = clamp((t - i * .05) / .45); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0], u) + (R(i) * 2 - 1) * 5, y = lerp(a[1], d[1], u) - Math.sin(u * Math.PI) * 16 + (R(i + 3) * 2 - 1) * 4, w = Math.abs(Math.cos(u * 12 + i)) * 4.5 + 1;
        cx.fillStyle = "#9a6a10"; cx.beginPath(); cx.ellipse(x, y, w + 1, 5.5, 0, 0, 7); cx.fill(); cx.fillStyle = "#f0c030"; cx.beginPath(); cx.ellipse(x, y, w, 4.5, 0, 0, 7); cx.fill(); dot(x - 1, y - 2, 2, "#fff0a0"); }
      if (t > .5) for (let i = 0; i < 10; i++) { const u = (t - .5) / .5, x = d[0] + (R(i) * 2 - 1) * 24 * u, y = d[1] - 8 - 16 * u * R(i + 4) + 30 * u * u; disc(x, y, 3.4, "#9a6a10"); disc(x, y, 2.6, "#f0c030"); dot(x - .5, y - 1, 1.5, "#fff0a0"); } } };
  // 거미줄(실뿜기·일렉트릭네트·끈적끈적네트): 실이 날아가 그물이 펼쳐짐
  T.web = { dur: 760, hit: .45, snd: "web", draw(t, a, d, p, ty) { const u = ease(clamp(t / .45)), col = ty === "전기" ? p[1] : "#f4f4f0";
      if (t < .5) for (let i = 0; i < 3; i++) seg(a[0], a[1], lerp(a[0], d[0] + (i - 1) * 6, u), lerp(a[1], d[1] + (i - 1) * 4, u), 1, col);
      if (t > .4) { const v = ease(clamp((t - .4) / .3)), r = 22 * v; for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4; seg(d[0], d[1], d[0] + Math.cos(an) * r, d[1] + Math.sin(an) * r * .8, 1, col); }
        for (let k = 1; k <= 3; k++) { cx.strokeStyle = col; cx.lineWidth = 1; cx.beginPath(); for (let i = 0; i <= 8; i++) { const an = i * Math.PI / 4; cx.lineTo(d[0] + Math.cos(an) * r * k / 3, d[1] + Math.sin(an) * r * .8 * k / 3); } cx.stroke(); }
        if (ty === "전기" && (Math.floor(t * 30) % 2)) flav("전기", d[0], d[1], .4); } } };
  // 가루(수면가루·저리가루·독가루·목화포자·분노가루): 위에서 가루가 흩날리며 내려앉음
  T.powder = { dur: 900, hit: .7, snd: "powder", draw(t, a, d, p, ty, j) { const col = ty === "독" ? ["#a65ad0", "#e8c4ff"] : ty === "벌레" ? ["#e05030", "#ffb090"] : j && j.tint ? j.tint : [p[1], p[2]];
      for (let i = 0; i < 46; i++) { const u = clamp(t * 1.4 - R(i) * .4); if (u <= 0 || u >= 1) continue; const x = d[0] + (R(i + 5) * 2 - 1) * 28 + Math.sin(u * 8 + i) * 5, y = lerp(d[1] - 40, d[1] + 16, u);
        if (i % 5 === 0) alpha(.4, () => disc(x, y, 4, col[0])); dot(x, y, i % 3 ? 3 : 4, col[i % 2]); } } };
  // 눈빛(째려보기·겁나는얼굴·검은눈빛·도발·록온): 상대를 노려보는 눈이 번쩍
  T.glare = { dur: 700, hit: .6, snd: "glare", draw(t, a, d, p, ty, j) { const u = ease(clamp(t / .4)), dir = j ? j.dir : 1, ex = a[0] + dir * 6, ey = a[1] - 14;
      alpha(t < .85 ? 1 : (1 - t) / .15, () => { for (const s of [-1, 1]) { const x = ex + s * 8; poly([[x - 7, ey], [x, ey - 4 * u], [x + 7, ey], [x, ey + 4 * u]], "#ffffff"); disc(x + dir * 1.5, ey, 2.4 * u, ty === "악" || ty === "고스트" ? "#c01818" : "#202020"); } });
      if (t > .5) { const v = (t - .5) / .5; for (let i = 0; i < 3; i++) seg(d[0] - 18 + i * 4, d[1] - 18 + i * 12, d[0] - 8 + i * 4, d[1] - 14 + i * 12, 2, "#5a6aa8"); alpha(1 - v, () => ring(d[0], d[1], 10 + v * 10, 2, "#5a6aa8")); } } };
  // 연기·안개(연막·흑안개·독가스·달콤한향기): 뭉게뭉게
  T.smoke = { dur: 900, hit: .6, snd: "smoke", draw(t, a, d, p, ty) { const col = ty === "독" ? ["#7a3aa0", "#b080d0"] : ty === "얼음" ? ["#404858", "#707888"] : ty === "노말" ? ["#706a60", "#a8a090"] : [p[0], p[1]];
      for (let i = 0; i < 9; i++) { const u = clamp((t - i * .04) / .55); if (u <= 0) continue; const x = lerp(a[0], d[0], Math.min(1, u)) + (R(i) * 2 - 1) * 18 * Math.min(1, u), y = lerp(a[1], d[1], Math.min(1, u)) + (R(i + 3) * 2 - 1) * 10 - u * 4;
        alpha(.75 * (1 - clamp((t - .7) / .3)), () => { disc(x, y, 6 + 6 * Math.min(1, u), col[i % 2]); disc(x - 3, y - 3, 3 + 3 * Math.min(1, u), col[1]); }); } } };
  // 흩뿌리기(모래뿌리기·흙놀이·물붓기): 알갱이가 부채꼴로
  T.spray = { dur: 700, hit: .5, snd: "spray", draw(t, a, d, p) { for (let i = 0; i < 36; i++) { const u = clamp((t - R(i) * .25) / .5); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0] + (R(i + 2) * 2 - 1) * 18, u), y = lerp(a[1], d[1] + (R(i + 6) * 2 - 1) * 14, u) - Math.sin(u * Math.PI) * 14; dot(x, y, i % 4 ? 3 : 4, p[i % 3]); }
      if (t > .5) alpha(.6 * (1 - (t - .5) / .5), () => { disc(d[0], d[1] + 4, 10 + (t - .5) * 30, p[1]); }); } };
  // 깃털댄스: 깃털이 하늘하늘 내려앉음
  T.feathers = { dur: 900, hit: .7, snd: "wind", draw(t, a, d, p) { for (let i = 0; i < 9; i++) { const u = clamp(t * 1.3 - i * .05); if (u <= 0 || u >= 1) continue;
        const x = d[0] + (R(i) * 2 - 1) * 24 + Math.sin(u * 7 + i) * 8, y = lerp(d[1] - 40, d[1] + 10, u), an = Math.sin(u * 7 + i) * .7;
        seg(x - Math.cos(an) * 6, y - Math.sin(an) * 6, x + Math.cos(an) * 6, y + Math.sin(an) * 6, 3, "#ffffff"); seg(x - Math.cos(an) * 6, y - Math.sin(an) * 6, x + Math.cos(an) * 6, y + Math.sin(an) * 6, 1, "#a8b4f4"); } } };
  // 음표(노래하기·돌림노래·치료방울): 음표가 물결치며
  const note = (x, y, c) => { cx.fillStyle = c; cx.beginPath(); cx.ellipse(x, y, 2.6, 2, -.4, 0, 7); cx.fill(); rect(x + 1.5, y - 8, 1.2, 8, c); rect(x + 1.5, y - 8, 4, 1.5, c); };
  T.notes = { dur: 900, hit: .6, snd: "notes", draw(t, a, d, p, ty, j) { const self = a === d || (a[0] === d[0] && a[1] === d[1]);
      for (let i = 0; i < 8; i++) { const u = clamp(t * 1.4 - i * .08); if (u <= 0 || u >= 1) continue; const x = self ? a[0] + (i - 3.5) * 6 : lerp(a[0], d[0], u), y = self ? a[1] - u * 30 : lerp(a[1], d[1], u) - 6 + Math.sin(u * 10 + i) * 6;
        note(x, y, ["#ff6aa0", "#4aa8f0", "#f0c030", "#6cc04a"][i % 4]); } } };
  // 스스로 기운 모으기(벌크업·명상·충전·용의춤·성장…): 둘레에서 빛 알갱이가 모여들고 몸이 빛남
  T.aura = { dur: 760, hit: 1, self: true, snd: "aura", draw(t, a, d, p, ty) { for (let i = 0; i < 14; i++) { const u = clamp(t * 1.3 - i * .03); if (u <= 0 || u >= 1) continue;
        const an = i * 2.4, r = 30 * (1 - ease(u)) + 2; dot(a[0] + Math.cos(an) * r, a[1] + Math.sin(an) * r * .8, 3, i % 2 ? p[1] : p[2]); }
      if (t > .55) { const v = (t - .55) / .45; alpha(1 - v, () => { ring(a[0], a[1], 8 + v * 22, 3, p[1]); ring(a[0], a[1], 4 + v * 14, 2, p[2]); }); }
      if (ty === "전기" && t > .4 && (Math.floor(t * 24) % 2)) flav("전기", a[0], a[1], .5, .7);
      if (ty === "드래곤" || ty === "격투") for (let i = 0; i < 6; i++) { const u = (t * 2 + R(i)) % 1; flameAt(a[0] + (i - 2.5) * 7, a[1] + 16 - u * 26, 2.5 * (1 - u) + .5, p[0], p[1]); } } };
  // 단단해지기·철벽·웅크리기·껍질에숨기·코튼가드·코스믹파워: 빛이 몸을 훑고 지나감
  T.shine = { dur: 700, hit: 1, self: true, snd: "metal", draw(t, a, d, p, ty) { const y = lerp(a[1] - 30, a[1] + 26, ease(t)), r = a[2] * .32;
      alpha(.8 * Math.sin(Math.PI * t), () => { rect(a[0] - r, y - 2, r * 2, 4, "#ffffff"); rect(a[0] - r, y - 5, r * 2, 2, p[2]); });
      if (t > .45) { const v = (t - .45) / .55; glint(a[0] + r * .6, a[1] - 10, 6 * Math.sin(Math.PI * v), "#ffffff"); glint(a[0] - r * .5, a[1] + 6, 4 * Math.sin(Math.PI * v), p[2]); }
      if (ty === "에스퍼") for (let i = 0; i < 5; i++) star(a[0] + Math.cos(t * 4 + i * 1.26) * 20, a[1] + Math.sin(t * 4 + i * 1.26) * 14, 3, "#fff6c8", 4, t * 6); } };
  // 고속이동: 잔상이 겹치며 바람줄
  T.speed = { dur: 640, hit: 1, self: true, snd: "wind", draw(t, a, d, p, ty, j) { const dir = j ? j.dir : 1;
      for (let i = 0; i < 9; i++) { const y = a[1] - 24 + i * 6, x = a[0] - dir * (((t * 1.6 + R(i)) % 1) * 40 - 10); seg(x, y, x - dir * 16, y, 2, i % 2 ? "#ffffff" : p[1]); }
      for (let k = 1; k <= 3; k++) alpha(.25 / k * Math.sin(Math.PI * t), () => ring(a[0] - dir * k * 6, a[1], a[2] * .3, 2, p[1])); } };
  // 칼춤·손톱갈기: 칼이 몸 둘레를 돎
  T.swords = { dur: 900, hit: 1, self: true, snd: "metal", draw(t, a, d, p) { const n = 5, r = 26 * (t < .7 ? 1 : 1 - (t - .7) / .3 * .7);
      for (let i = 0; i < n; i++) { const an = t * 9 + i * 2 * Math.PI / n, x = a[0] + Math.cos(an) * r, y = a[1] + Math.sin(an) * r * .55;
        seg(x, y - 7, x, y + 5, 2, "#e8eef4"); seg(x - 3, y + 3, x + 3, y + 3, 2, "#b08830"); dot(x, y - 8, 1.5, "#ffffff"); }
      if (t > .7) glint(a[0], a[1] - 4, 10 * Math.sin(Math.PI * (t - .7) / .3), "#ffffff"); } };
  // 깔아 두는 것(스텔스록·독압정·끈적끈적네트): 상대 발밑에 흩어져 내려앉음
  T.hazard = { dur: 820, hit: .6, snd: "hazard", draw(t, a, d, p, ty) { const gy = d[1] + d[2] * .28;
      for (let i = 0; i < 6; i++) { const u = clamp((t - i * .06) / .5); if (u <= 0) continue; const tx = d[0] + (i - 2.5) * 10, x = lerp(a[0], tx, Math.min(1, u)), y = lerp(a[1], gy + (i % 2) * 3, Math.min(1, u)) - Math.sin(Math.min(1, u) * Math.PI) * 20;
        if (ty === "바위") { poly([[x - 6, y + 3], [x - 2, y - 7], [x + 6, y - 2], [x + 3, y + 4]], p[0]); poly([[x - 2, y - 7], [x + 6, y - 2], [x + 1, y - 2]], p[2]); if (u >= 1) alpha(.6, () => ring(x, y - 2, 6 + Math.sin(t * 20 + i) * 1, 1, "#e0d0a0")); }
        else if (ty === "독") { poly([[x - 4, y + 3], [x, y - 7], [x + 4, y + 3]], p[0]); poly([[x - 2, y + 2], [x, y - 4], [x + 2, y + 2]], p[1]); }
        else { for (let q = 0; q < 4; q++) seg(x - Math.cos(q * .785) * 7, y - Math.sin(q * .785) * 5, x + Math.cos(q * .785) * 7, y + Math.sin(q * .785) * 5, 1, "#f4f4f0"); ring(x, y, 4, 1, "#f4f4f0"); } } } };
  // 도깨비불·이상한빛: 둥둥 떠다니는 불빛이 상대를 감쌈
  T.wisp = { dur: 900, hit: .65, snd: "ghost", draw(t, a, d, p, ty) { const col = ty === "불꽃" ? ["#3060e0", "#80b0ff", "#e0f0ff"] : ["#e8d040", "#fff4a0", "#ffffff"];
      for (let i = 0; i < 4; i++) { const u = ease(clamp(t / .6)), an = t * 8 + i * Math.PI / 2, r = 18 - 6 * u; const x = lerp(a[0], d[0], u) + Math.cos(an) * r, y = lerp(a[1], d[1], u) + Math.sin(an) * r * .6 - Math.sin(u * Math.PI) * 10;
        alpha(.9, () => { disc(x, y, 4.5, col[0]); disc(x, y - 1, 3, col[1]); dot(x, y - 2, 2, col[2]); }); poly([[x - 3, y], [x, y - 8 - Math.sin(t * 30 + i) * 2], [x + 3, y]], col[1]); } } };
  // 흡수(흡수·메가드레인·기가드레인·흡혈·드레인키스·힘흡수): 상대에게서 빛 알갱이가 빨려 옴
  T.drain = { dur: 1000, hit: .35, snd: "drain", draw(t, a, d, p, ty) { if (t < .4) { burst(d, t / .4, p, .7); flav(tyOf(ty), d[0], d[1], t / .4, .7); }
      if (t > .3) for (let i = 0; i < 10; i++) { const u = clamp((t - .3 - i * .035) / .45); if (u <= 0 || u >= 1) continue; const x = lerp(d[0], a[0], ease(u)) + Math.sin(u * 9 + i) * 6, y = lerp(d[1], a[1], ease(u)) - Math.sin(u * Math.PI) * 14;
        disc(x, y, 3, "#7ae07a"); dot(x - 1, y - 1, 1.5, "#ffffff"); }
      if (t > .78) alpha(1 - (t - .78) / .22, () => ring(a[0], a[1], 10 + (t - .78) * 60, 2, "#7ae07a")); } };
  // 씨뿌리기: 씨앗이 날아가 덩굴이 돋음
  T.seed = { dur: 820, hit: .5, snd: "leaf", draw(t, a, d, p) { for (let i = 0; i < 3; i++) { const u = clamp((t - i * .06) / .4), x = lerp(a[0], d[0] + (i - 1) * 9, ease(u)), y = lerp(a[1], d[1] + 8, ease(u)) - Math.sin(u * Math.PI) * 20;
        if (u < 1) { disc(x, y, 3, "#8a6a2a"); dot(x - 1, y - 1, 1.5, "#c8a060"); }
        else { const v = clamp((t - .5) / .4); cx.strokeStyle = "#3a8a2a"; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(x, y); for (let k = 1; k <= 6; k++) cx.lineTo(x + Math.sin(k + i) * 4 * v, y - k * 4 * v); cx.stroke(); poly([[x, y - 24 * v], [x + 5 * v, y - 20 * v], [x, y - 17 * v]], "#6cc04a"); } } } };
  // 스피드스타: 별이 줄지어 날아감 / 트라이어택: 불·얼음·전기 세 구슬
  T.stars = { dur: 700, hit: .55, snd: "twinkle", draw(t, a, d, p) { for (let i = 0; i < 6; i++) { const u = clamp((t - i * .05) / .45); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0], u) + Math.sin(u * 10 + i * 2) * 8, y = lerp(a[1], d[1], u) + Math.cos(u * 10 + i * 2) * 6; star(x, y, 5, "#ffe878", 5, u * 8); star(x, y, 2.5, "#ffffff", 5, u * 8); }
      if (t > .55) burst(d, (t - .55) / .45, ["#c8a020", "#ffe878", "#ffffff"], .9); } };
  T.tri = { dur: 760, hit: .55, snd: "orb", draw(t, a, d, p) { const C = [FXP["불꽃"], FXP["얼음"], FXP["전기"]], u = ease(clamp(t / .55));
      for (let i = 0; i < 3; i++) { const an = t * 10 + i * 2.09, r = 10 * (1 - u) + 2, x = lerp(a[0], d[0], u) + Math.cos(an) * r, y = lerp(a[1], d[1], u) + Math.sin(an) * r - Math.sin(u * Math.PI) * 8;
        if (t < .55) { disc(x, y, 4.5, C[i][0]); disc(x, y, 3, C[i][1]); dot(x - 1, y - 1, 1.5, C[i][2]); } }
      if (t > .55) { const v = (t - .55) / .45; poly([[d[0], d[1] - 16 * v], [d[0] + 14 * v, d[1] + 10 * v], [d[0] - 14 * v, d[1] + 10 * v]], v < 1 ? "rgba(255,255,255,.6)" : "transparent"); burst(d, v, C[Math.floor(v * 3) % 3], 1); } } };
  // 모으는 첫 턴(솔라빔·불새·메테오빔·로켓박치기·칼바람): 빛이 몸으로 빨려 들어감
  T.charge = { dur: 900, hit: 1, self: true, snd: "charge", draw(t, a, d, p) { for (let i = 0; i < 18; i++) { const u = clamp(t * 1.5 - R(i) * .5); if (u <= 0 || u >= 1) continue;
        const an = R(i + 3) * 6.28, r = 40 * (1 - ease(u)); seg(a[0] + Math.cos(an) * r, a[1] + Math.sin(an) * r, a[0] + Math.cos(an) * (r + 6), a[1] + Math.sin(an) * (r + 6), 2, i % 2 ? p[1] : p[2]); }
      alpha(.6 * Math.sin(Math.PI * t), () => { disc(a[0], a[1], 6 + 6 * t, p[2]); disc(a[0], a[1], 3 + 4 * t, "#ffffff"); }); } };
  // ---------- 능력 변화(모든 기술·특성·도구 공통): 오름 = 붉은 화살이 솟음 · 내림 = 푸른 화살이 가라앉음 ----------
  T.statup = { dur: 700, hit: 1, self: true, draw(t, a) { for (let i = 0; i < 9; i++) { const u = clamp(t * 1.4 - i * .05), x = a[0] + (i - 4) * 6, y = a[1] + 18 - u * 36; if (u <= 0 || u >= 1) continue;
        alpha(1 - u * .4, () => { poly([[x, y - 5], [x - 4, y], [x + 4, y]], i % 2 ? "#ff6a40" : "#ffa040"); rect(x - 1.5, y, 3, 5, i % 2 ? "#ff6a40" : "#ffa040"); }); }
      alpha(.35 * Math.sin(Math.PI * t), () => { cx.fillStyle = "#ff8040"; cx.beginPath(); cx.ellipse(a[0], a[1], a[2] * .3, a[2] * .36, 0, 0, 7); cx.fill(); }); } };
  T.statdown = { dur: 700, hit: 1, self: true, draw(t, a) { for (let i = 0; i < 9; i++) { const u = clamp(t * 1.4 - i * .05), x = a[0] + (i - 4) * 6, y = a[1] - 18 + u * 36; if (u <= 0 || u >= 1) continue;
        alpha(1 - u * .4, () => { poly([[x, y + 5], [x - 4, y], [x + 4, y]], i % 2 ? "#4a6ad8" : "#6a9af0"); rect(x - 1.5, y - 5, 3, 5, i % 2 ? "#4a6ad8" : "#6a9af0"); }); }
      alpha(.3 * Math.sin(Math.PI * t), () => { cx.fillStyle = "#3a5ac8"; cx.beginPath(); cx.ellipse(a[0], a[1], a[2] * .3, a[2] * .36, 0, 0, 7); cx.fill(); }); } };
  // ---------- 상태 이상(걸릴 때·턴마다) ----------
  T.c_par = { dur: 620, hit: 1, self: true, snd: "zap", draw(t, a) { const on = Math.floor(t * 14) % 2; if (on) for (let i = 0; i < 4; i++) flav("전기", a[0] + (R(i + Math.floor(t * 7)) * 2 - 1) * 14, a[1] + (R(i + 9) * 2 - 1) * 12, .35, .6);
      alpha(.35 * on, () => { cx.fillStyle = "#ffd630"; cx.beginPath(); cx.ellipse(a[0], a[1], a[2] * .3, a[2] * .36, 0, 0, 7); cx.fill(); }); } };
  T.c_brn = { dur: 700, hit: 1, self: true, snd: "fire", draw(t, a) { for (let i = 0; i < 7; i++) { const u = (t * 1.3 + R(i)) % 1; flameAt(a[0] + (i - 3) * 7, a[1] + 20 - u * 30, 4 * (1 - u) + 1, i % 2 ? "#c2381e" : "#ff8a2a", "#ffe27a"); }
      alpha(.3 * Math.sin(Math.PI * t), () => { cx.fillStyle = "#ff5a2a"; cx.beginPath(); cx.ellipse(a[0], a[1], a[2] * .3, a[2] * .36, 0, 0, 7); cx.fill(); }); } };
  T.c_psn = { dur: 720, hit: 1, self: true, snd: "bubble", draw(t, a) { for (let i = 0; i < 9; i++) { const u = clamp(t * 1.5 - i * .06); if (u <= 0 || u >= 1) continue; const x = a[0] + (R(i) * 2 - 1) * 18, y = a[1] + 14 - u * 30;
        if (u < .8) { ring(x, y, 2 + 3 * u, 1.5, "#a65ad0"); dot(x - 1, y - 1, 1.5, "#e8c4ff"); } else star(x, y, 4, "#e8c4ff", 4, 0); }
      alpha(.35 * Math.sin(Math.PI * t), () => { cx.fillStyle = "#8a3ab0"; cx.beginPath(); cx.ellipse(a[0], a[1], a[2] * .3, a[2] * .36, 0, 0, 7); cx.fill(); }); } };
  const zLetter = (x, y, s, c) => { seg(x - s, y - s, x + s, y - s, 1.6, c); seg(x + s, y - s, x - s, y + s, 1.6, c); seg(x - s, y + s, x + s, y + s, 1.6, c); };
  T.c_slp = { dur: 900, hit: 1, self: true, snd: "sleep", draw(t, a, d, p, ty, j) { const dir = j ? j.dir : 1;
      for (let i = 0; i < 3; i++) { const u = clamp(t * 1.4 - i * .22); if (u <= 0 || u >= 1) continue; const x = a[0] + dir * (8 + u * 18) + Math.sin(u * 6) * 3, y = a[1] - 18 - u * 22;
        alpha(1 - clamp((u - .7) / .3), () => { zLetter(x + 1, y + 1, 2 + i * 1.2, "#203060"); zLetter(x, y, 2 + i * 1.2, "#ffffff"); }); } } };
  T.c_frz = { dur: 720, hit: 1, self: true, snd: "ice", draw(t, a) { const u = ease(clamp(t / .5)), r = a[2] * .32;
      alpha(.45 * u * (1 - clamp((t - .8) / .2)), () => { cx.fillStyle = "#bfefff"; cx.beginPath(); cx.ellipse(a[0], a[1], r, r * 1.15, 0, 0, 7); cx.fill(); });
      for (let i = 0; i < 6; i++) { const an = i * Math.PI / 3 + .3; const x = a[0] + Math.cos(an) * r * u, y = a[1] + Math.sin(an) * r * 1.1 * u; poly([[x, y - 6], [x + 3, y], [x, y + 6], [x - 3, y]], "#ffffff"); dot(x, y, 2, "#8fe2f2"); }
      if (t > .5) glint(a[0] + 6, a[1] - 10, 6 * Math.sin(Math.PI * (t - .5) / .5), "#ffffff"); } };
  T.c_conf = { dur: 800, hit: 1, self: true, snd: "confuse", draw(t, a) { for (let i = 0; i < 4; i++) { const an = t * 10 + i * Math.PI / 2, x = a[0] + Math.cos(an) * 16, y = a[1] - 26 + Math.sin(an) * 5;
        if (i % 2) star(x, y, 4.5, "#ffe040", 5, t * 6); else { disc(x, y, 3, "#ffffff"); dot(x + 2, y - 1, 1.5, "#202020"); poly([[x - 3, y], [x - 7, y - 2], [x - 7, y + 2]], "#ffffff"); } } } };
  T.c_love = { dur: 800, hit: 1, self: true, snd: "twinkle", draw(t, a) { for (let i = 0; i < 6; i++) { const u = clamp(t * 1.4 - i * .07); if (u <= 0 || u >= 1) continue; heartAt(a[0] + (i - 2.5) * 8 + Math.sin(u * 6 + i) * 3, a[1] + 6 - u * 30, 3.5, i % 2 ? "#ff6aa0" : "#ffb0cc"); } } };
  // ---------- 고친 템플릿 ----------
  // 파도타기·탁류: 좁은 물기둥 → 아래에서 밀려오는 큰 물결(마루에 흰 거품)
  T.wave = { dur: 980, hit: .55, snd: "wave", draw(t, a, d, p, ty) { const dir = d[0] > a[0] ? 1 : -1, front = lerp(dir > 0 ? -50 : W + 50, dir > 0 ? W + 70 : -70, ease(t)), top = H * .38;
      for (let x = 0; x < W; x += 2) { const back = dir > 0 ? front - x : x - front; if (back < 0 || back > 150) continue;
        const crest = back < 26 ? Math.sin(back / 26 * Math.PI / 2) : 1, hgt = (H - top) * crest * (back > 110 ? 1 - (back - 110) / 40 : 1), y0 = H - hgt + Math.sin(x * .12 + t * 14) * 3;
        rect(x, y0, 2, H - y0, back % 8 < 4 ? p[0] : p[1]); if (back < 30) rect(x, y0 - 2, 2, 3, p[2]); else if ((x + Math.floor(t * 40)) % 14 === 0) rect(x, y0 + 4, 2, 2, p[2]); }
      for (let i = 0; i < 10; i++) { const fx = front - dir * R(i) * 18, fy = top + 4 - R(i + 3) * 12 - Math.sin(t * 20 + i) * 3; dot(fx, fy, 3, p[2]); } } };
  // 화염방사 등: 굵은 불길
  T.flame = { dur: 740, hit: .5, snd: "fire", draw(t, a, d, p) { for (let i = 0; i < 30; i++) { const s = i / 30 * .55, u = clamp((t - s) / .35); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0], u) + (R(i) * 2 - 1) * 5 * u, y = lerp(a[1], d[1], u) - Math.sin(u * Math.PI) * 6 + (R(i + 9) * 2 - 1) * 4 * u, r = 5 - u * 2;
        disc(x, y, r, p[0]); disc(x, y - 1, r * .7, p[1]); dot(x, y - 1, 2, p[2]); }
      if (t > .45) for (let i = 0; i < 9; i++) { const u = clamp((t - .45 - i * .02) / .5); if (u > 0 && u < 1) flameAt(d[0] + (R(i + 3) * 2 - 1) * d[2] * .26, d[1] + 12 - u * 22, 4.5 * (1 - u) + 1, i % 2 ? p[0] : p[1], p[2]); } } };
  // 잎·꽃잎: 크게, 많이
  T.leaf = { dur: 780, hit: .55, snd: "leaf", draw(t, a, d, p) { for (let i = 0; i < 12; i++) { const s = i * .035, u = clamp((t - s) / .5); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0], u) + Math.sin(u * 9 + i) * 8, y = lerp(a[1], d[1], u) + Math.cos(u * 7 + i) * 7 - Math.sin(u * Math.PI) * 12, an = u * 12 + i, L = 6;
        poly([[x + Math.cos(an) * L, y + Math.sin(an) * L], [x + Math.cos(an + 1.6) * 2.4, y + Math.sin(an + 1.6) * 2.4], [x - Math.cos(an) * L, y - Math.sin(an) * L], [x + Math.cos(an - 1.6) * 2.4, y + Math.sin(an - 1.6) * 2.4]], i % 2 ? p[1] : p[0]);
        seg(x - Math.cos(an) * L * .8, y - Math.sin(an) * L * .8, x + Math.cos(an) * L * .8, y + Math.sin(an) * L * .8, 1, p[2]); }
      if (t > .55) { burst(d, (t - .55) / .45, p, .8); flav("풀", d[0], d[1], (t - .55) / .45); } } };
  // 바람: 소용돌이를 크게 + 바람줄
  T.gust = { dur: 780, hit: .5, snd: "wind", draw(t, a, d, p) { for (let i = 0; i < 4; i++) { const r0 = 8 + i * 6, s = t * 14 + i * 1.7; cx.strokeStyle = i % 2 ? p[1] : p[2]; cx.lineWidth = 3; cx.beginPath();
        cx.ellipse(d[0], d[1] + 4 - i * 4, r0 * (.6 + .4 * t), r0 * .45 * (.6 + .4 * t), 0, s, s + 2.6); cx.stroke(); }
      for (let i = 0; i < 8; i++) { const u = clamp(t * 1.4 - i * .06); if (u > 0 && u < 1) { const x = lerp(a[0], d[0], u), y = lerp(a[1], d[1], u) + (i - 4) * 4; seg(x - 7, y, x + 7, y, 2, p[2]); } }
      if (t > .5) flav("비행", d[0], d[1], (t - .5) / .5); } };
  // 미러샷 등 강철: 테두리 있는 번쩍임
  T.metal = { dur: 680, hit: .45, snd: "metal", draw(t, a, d, p) { if (t < .45) { const u = ease(t / .45), x = lerp(a[0], d[0], u), y = lerp(a[1], d[1], u); disc(x, y, 5, p[0]); disc(x, y, 3.5, p[2]); }
      for (let i = 0; i < 4; i++) { const u = clamp(t * 2 - .8 - i * .15), an = .6 + i * .7; if (u <= 0 || u >= 1) continue;
        seg(d[0] - Math.cos(an) * 18, d[1] - Math.sin(an) * 18, d[0] + Math.cos(an) * 18, d[1] + Math.sin(an) * 18, 4, p[0]); seg(d[0] - Math.cos(an) * 18, d[1] - Math.sin(an) * 18, d[0] + Math.cos(an) * 18, d[1] + Math.sin(an) * 18, 2, p[2]); }
      if (t > .45) { star(d[0], d[1], 10 * Math.sin(Math.PI * (t - .45) / .55), p[0], 4, t * 3); star(d[0], d[1], 7 * Math.sin(Math.PI * (t - .45) / .55), "#ffffff", 4, t * 3); } } };
  // 상태 기술 공통: 반짝이 소용돌이를 또렷하게
  T.status = { dur: 760, hit: 1, snd: "twinkle", draw(t, a, d, p) { for (let i = 0; i < 16; i++) { const u = clamp(t * 1.2 - i * .03), an = i * 2.1 + t * 4, r = 24 * (1 - u) + 4; if (u <= 0 || u >= 1) continue;
        star(d[0] + Math.cos(an) * r, d[1] + Math.sin(an) * r * .7 - u * 6, 3.4, i % 2 ? p[1] : p[2], 4, t * 5); }
      if (t > .6) alpha(1 - (t - .6) / .4, () => ring(d[0], d[1], 6 + (t - .6) * 50, 2, p[1])); } };
  // 회복: 초록 십자 + 그 기술 타입 반짝임
  T.heal = { dur: 780, hit: 1, self: true, snd: "heal", draw(t, a, d, p) { for (let i = 0; i < 12; i++) { const u = clamp(t * 1.3 - i * .045), x = a[0] + (R(i) * 2 - 1) * a[2] * .32, y = a[1] + 14 - u * 30; if (u <= 0 || u >= 1) continue;
        rect(x - 4, y - 1.5, 8, 3, "#5ad05a"); rect(x - 1.5, y - 4, 3, 8, "#5ad05a"); rect(x - 3, y - .5, 6, 1, "#c8ffc8"); }
      alpha(.4 * Math.sin(Math.PI * t), () => { cx.fillStyle = "#a0f0a0"; cx.beginPath(); cx.ellipse(a[0], a[1], a[2] * .3, a[2] * .36, 0, 0, 7); cx.fill(); });
      if (t > .3) for (let i = 0; i < 4; i++) star(a[0] + Math.cos(t * 6 + i * 1.57) * 18, a[1] + Math.sin(t * 6 + i * 1.57) * 14, 3, p[2], 4, t * 5); } };
  // 방어·벽: 몸 앞(상대 쪽)에 육각 방패 — 전엔 내 남켓몬은 늘 등 뒤에 그려졌음
  T.shield = { dur: 720, hit: 1, self: true, snd: "shield", draw(t, a, d, p, ty, j) { const dir = j ? j.dir : 1, r = 18 * ease(clamp(t * 2)), x = a[0] + dir * 14;
      alpha(.85 * (1 - clamp((t - .7) / .3)), () => { const col = ty === "얼음" ? "#ffffff" : ty === "에스퍼" ? "#f8c0e0" : "#9fe0ff";
        cx.fillStyle = col; cx.globalAlpha *= .35; cx.beginPath(); for (let i = 0; i <= 6; i++) { const an = i * Math.PI / 3 + Math.PI / 6; cx.lineTo(x + Math.cos(an) * r * .6, a[1] + Math.sin(an) * r); } cx.fill(); cx.globalAlpha /= .35;
        cx.strokeStyle = col; cx.lineWidth = 2; cx.beginPath(); for (let i = 0; i <= 6; i++) { const an = i * Math.PI / 3 + Math.PI / 6; cx.lineTo(x + Math.cos(an) * r * .6, a[1] + Math.sin(an) * r); } cx.stroke(); });
      if (t > .3 && t < .8) glint(x + 2, a[1] - r * .5, 4, "#ffffff"); } };
  // 날씨·필드 기술: 실제 날씨 그림을 미리(비·햇살·모래·싸라기눈·운해) · 필드는 땅이 빛남
  T.weather = { dur: 900, hit: 1, self: true, snd: "wind", draw(t, a, d, p, ty) { const w = { "물": "rain", "불꽃": "sun", "바위": "sand", "얼음": "hail", "비행": "fog" }[ty];
      if (w) alpha(Math.sin(Math.PI * t) * 1.2, () => drawWeather(cx, w, performance.now(), W, H));
      else { const c = ty === "풀" ? "#6cc04a" : ty === "페어리" ? "#f49ad0" : ty === "전기" ? "#ffd630" : ty === "에스퍼" ? "#f070a8" : p[1];
        alpha(.45 * Math.sin(Math.PI * t), () => { rect(0, H * .55 + (1 - t) * 30, W, H, c); });
        for (let i = 0; i < 24; i++) { const u = (t * 1.2 + R(i)) % 1; star(R(i + 4) * W, H - u * H * .45, 2.5, c, 4, 0); } } } };
  // 꽃잎 템플릿 철쭉꽃보라·꽃잎댄스 공용(색은 타입 색이 아니라 철쭉 분홍) — 그대로
  // ---------- 소리 ----------
  const SND = { orb: "orb", beam: "beam", water: "water", bolt: "zap", thunder: "thunder", ice: "ice", snow: "ice", psy: "psy", shadow: "ghost", dragon: "dragon", dark: "dark",
    fairy: "twinkle", sludge: "bubble", quake: "quake", rocks: "crash", buzz: "buzz", sound: "notes", star: "twinkle", heart: "twinkle", mapae: "gong", gourd: "crash",
    azalea: "leaf", coins: "coins", moon: "twinkle", awaken: "charge", debuff: "", buff: "aura" };
  for (const [k, s] of Object.entries(SND)) if (T[k] && !T[k].snd) T[k].snd = s;
  // ---------- 배경 어둡게(세게 맞는 특수 기술) ----------
  const DIM = { dark: ["#000000", .42], shadow: ["#1a0a30", .4], psy: ["#3a0a28", .28], dragon: ["#08082a", .38], moon: ["#060a28", .45], thunder: ["#000000", .32], snow: ["#102040", .25],
    wisp: ["#0a0a20", .3], glare: ["#000000", .25], c_conf: ["#20102a", .12] };
  for (const [k, v] of Object.entries(DIM)) if (T[k]) T[k].dim = v;
  // ---------- 기술마다 어울리는 그림으로(전엔 80개가 '몸통박치기' 그림 하나였음) ----------
  const MAP = {
    jab: "branchpoke drillpeck drillrun fellstinger hornattack hornleech peck pluck poisonjab smartstrike",
    needles: "pinmissile",
    slash: "crushclaw dragonclaw furyswipes metalclaw scratch shadowclaw crosschop karatechop falseswipe steelwing wingattack",
    whip: "vinewhip aquatail irontail slam brutalswing breakingswipe",
    bind: "wrap sandtomb firespin",
    dash: "flamewheel flareblitz doubleedge takedown acrobatics lunge phantomforce shadowsneak skittersmack spark rapidspin icespinner flipturn waterfall rollout headlongrush darkestlariat",
    punch: "brickbreak forcepalm knockoff pound strength superpower closecombat crabhammer",
    kick: "highhorsepower stomp",
    bite: "bugbite visegrip",
    drain: "absorb megadrain gigadrain leechlife drainingkiss strengthsap",
    icicle: "iciclecrash avalanche",
    ice: "iceshard",
    payday: "payday",
    shadow: "poltergeist",
    azalea: "petaldance petalblizzard",
    web: "electroweb stringshot",
    hazard: "stealthrock toxicspikes stickyweb",
    sludge: "mudslap mudshot toxic",
    beam: "powergem",
    powder: "sleeppowder stunspore poisonpowder cottonspore ragepowder",
    glare: "leer scaryface meanlook taunt lockon",
    smoke: "smokescreen haze poisongas sweetscent clearsmog",
    spray: "sandattack mudsport soak",
    feathers: "featherdance",
    gust: "defog whirlwind tailwind",
    sound: "growl screech metalsound nobleroar",
    notes: "sing round healbell",
    heart: "charm playnice",
    aura: "acidarmor bulkup calmmind charge coil dragondance growth workup amnesia focusenergy magnetrise",
    shine: "harden irondefense withdraw defensecurl cosmicpower cottonguard",
    speed: "agility",
    swords: "swordsdance honeclaws",
    heal: "synthesis wish",
    wisp: "willowisp confuseray",
    seed: "leechseed",
    psy: "hypnosis teeterdance",
    bolt: "thunderwave",
    stars: "swift",
    tri: "triattack",
    c_slp: "yawn",
    wave: "sludgewave",
    status: "tailwhip tickle",
    water: "splash",
  };
  for (const [fx, ids] of Object.entries(MAP)) for (const id of ids.split(" ")) if (MV[id]) MV[id].fx = fx;
  window.FX_MAP_V250 = MAP;
})();
