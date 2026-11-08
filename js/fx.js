// ===== 배틀 이펙트 (배틀 시험장 v7_fx.js를 게임 화면 256×144 픽셀 캔버스로 옮김) =====
"use strict";
const FXP = {"노말":["#9a9480","#d8d2bc","#ffffff"],"불꽃":["#c2381e","#ff8a2a","#ffe27a"],"물":["#1f5fae","#4aa8f0","#d6f2ff"],"풀":["#2f7a2a","#6cc04a","#d9f5a0"],
  "전기":["#b88a00","#ffd630","#fffbd0"],"얼음":["#3a8fae","#8fe2f2","#ffffff"],"격투":["#8a2a1e","#e0603a","#ffd0a0"],"독":["#5a2a7a","#a65ad0","#e8c4ff"],
  "땅":["#6a4a22","#c0904a","#f0d8a0"],"비행":["#5060b0","#a8b4f4","#ffffff"],"에스퍼":["#a8305e","#f070a8","#ffd6ea"],"벌레":["#5a6a10","#a8c02a","#eaf6a0"],
  "바위":["#5a4a2a","#a8905a","#e0d0a0"],"고스트":["#2e2a6a","#7a6ad8","#d6ccff"],"드래곤":["#2a1e8a","#6a5af0","#c8c0ff"],"악":["#1e1a1a","#4f4642","#a89a90"],
  "강철":["#4a5a6a","#a8b8c8","#ffffff"],"페어리":["#b04a8a","#f49ad0","#fff0fa"]};
const FX = (() => {
  const cv = document.createElement("canvas"); cv.width = SW; cv.height = 144; const cx = cv.getContext("2d");
  const W = SW, H = 144; let jobs = [], weather = null, aura = new Map();
  const slow = 1; const still = false;
  const pos = side => BT ? BT.fxPos(side) : [128, 72, 96];
  const R = n => { let x = Math.sin(n*12.9898)*43758.5453; return x - Math.floor(x); };
  const lerp = (a, b, t) => a + (b - a)*t, ease = t => t*t*(3 - 2*t), clamp = t => Math.max(0, Math.min(1, t));
  const rect = (x, y, w, h, c) => { cx.fillStyle = c; cx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))); };
  const dot = (x, y, s, c) => rect(x - s/2, y - s/2, s, s, c);
  const disc = (x, y, r, c) => { cx.fillStyle = c; cx.beginPath(); cx.arc(Math.round(x), Math.round(y), Math.max(0.5, r), 0, 7); cx.fill(); };
  const ring = (x, y, r, w, c) => { cx.strokeStyle = c; cx.lineWidth = w; cx.beginPath(); cx.arc(Math.round(x), Math.round(y), Math.max(0.5, r), 0, 7); cx.stroke(); };
  const seg = (x0, y0, x1, y1, w, c) => { cx.strokeStyle = c; cx.lineWidth = w; cx.lineCap = "square"; cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x1, y1); cx.stroke(); };
  const star = (x, y, r, c, n = 5, rot = 0) => { cx.fillStyle = c; cx.beginPath(); for (let i = 0; i < n*2; i++) { const a = rot + i*Math.PI/n, rr = i % 2 ? r*0.42 : r; cx.lineTo(x + Math.cos(a)*rr, y + Math.sin(a)*rr); } cx.fill(); };
  const poly = (pts, c) => { cx.fillStyle = c; cx.beginPath(); pts.forEach(([x, y]) => cx.lineTo(x, y)); cx.fill(); };
  const shake = (amp = 4, ms = 300) => { if (BT && Save.opt.anim) BT.shake(amp, ms); };
  const flash = (col = "#fff", ms = 160, op = .7) => { if (BT && Save.opt.anim) BT.flash(col, ms, op); };
  // 템플릿: (t 0~1, ctx) → 그림. hit = 맞는 순간(0~1), dur = 길이(ms)
  const T = {
    orb: { dur: 620, hit: .62, draw(t, a, d, p) { const u = ease(clamp(t/.62)), x = lerp(a[0], d[0], u), y = lerp(a[1], d[1], u) - Math.sin(u*Math.PI)*8;
      if (t < .62) { for (let i = 1; i < 6; i++) { const v = clamp(u - i*.05); disc(lerp(a[0], d[0], v), lerp(a[1], d[1], v) - Math.sin(v*Math.PI)*8, 3.5 - i*.5, p[1]); }
        disc(x, y, 5, p[0]); disc(x, y, 3.6, p[1]); disc(x - 1, y - 1, 1.6, p[2]); }
      else burst(d, (t - .62)/.38, p); } },
    beam: { dur: 760, hit: .45, draw(t, a, d, p) { const ch = clamp(t/.3), w = t < .3 ? 0 : t < .85 ? 5 + 2*Math.sin(t*60) : 5*(1 - (t - .85)/.15);
      disc(a[0], a[1], 2 + 5*ch, p[1]); disc(a[0], a[1], 1 + 3*ch, p[2]);
      if (w > 0) { seg(a[0], a[1], d[0], d[1], w + 3, p[0]); seg(a[0], a[1], d[0], d[1], w, p[1]); seg(a[0], a[1], d[0], d[1], Math.max(1, w - 3), p[2]); burst(d, (t - .3)/.7, p, .7); } } },
    flame: { dur: 720, hit: .5, draw(t, a, d, p) { for (let i = 0; i < 26; i++) { const s = i/26*.55, u = clamp((t - s)/.35); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0], u) + (R(i)*2 - 1)*4*u, y = lerp(a[1], d[1], u) - Math.sin(u*Math.PI)*6 + (R(i + 9)*2 - 1)*3*u; disc(x, y, 3.5 - u*1.5, p[1]); dot(x, y - 1, 2, p[2]); }
      if (t > .45) for (let i = 0; i < 9; i++) { const u = clamp((t - .45 - i*.02)/.5), x = d[0] + (R(i + 3)*2 - 1)*d[2]*.28, y = d[1] + 8 - u*22;
        if (u > 0 && u < 1) { poly([[x - 3*(1 - u), y], [x, y - 7*(1 - u)], [x + 3*(1 - u), y]], p[0]); dot(x, y - 2, 2, p[1]); } } } },
    water: { dur: 680, hit: .5, draw(t, a, d, p) { for (let i = 0; i < 22; i++) { const s = i/22*.45, u = clamp((t - s)/.32); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0], u), y = lerp(a[1], d[1], u) - Math.sin(u*Math.PI)*5 + Math.sin(i)*2; disc(x, y, 3, p[1]); dot(x - 1, y - 1, 1.5, p[2]); }
      if (t > .45) for (let i = 0; i < 12; i++) { const u = clamp((t - .45)/.55), an = -Math.PI*(.1 + .8*R(i)), sp = 8 + 10*R(i + 4);
        disc(d[0] + Math.cos(an)*sp*u, d[1] + Math.sin(an)*sp*u + 16*u*u, 2*(1 - u) + .5, p[1]); } } },
    wave: { dur: 900, hit: .55, draw(t, a, d, p) { const dir = d[0] > a[0] ? 1 : -1, x0 = dir > 0 ? -20 : W + 20, xs = lerp(x0, x0 + dir*(W + 40), ease(t));
      for (let y = H*.25; y < H; y += 2) { const off = Math.sin(y*.15 + t*12)*4; rect(dir > 0 ? xs - 40 + off : xs + off, y, 40, 2, y % 4 ? p[1] : p[0]); }
      for (let i = 0; i < 14; i++) dot(xs + dir*(R(i)*10) , H*.25 + R(i + 2)*H*.1 - 4*Math.sin(t*20 + i), 2, p[2]); } },
    leaf: { dur: 760, hit: .55, draw(t, a, d, p) { for (let i = 0; i < 8; i++) { const s = i*.05, u = clamp((t - s)/.5); if (u <= 0) continue;
        const k = u >= 1 ? 1 : u, x = lerp(a[0], d[0], k) + Math.sin(k*9 + i)*6, y = lerp(a[1], d[1], k) + Math.cos(k*7 + i)*6 - Math.sin(k*Math.PI)*10, an = k*12 + i;
        if (u < 1) poly([[x + Math.cos(an)*4, y + Math.sin(an)*4], [x + Math.cos(an + 1.7)*1.6, y + Math.sin(an + 1.7)*1.6], [x - Math.cos(an)*4, y - Math.sin(an)*4], [x + Math.cos(an - 1.7)*1.6, y + Math.sin(an - 1.7)*1.6]], i % 2 ? p[1] : p[0]); }
      if (t > .55) burst(d, (t - .55)/.45, p, .8); } },
    bolt: { dur: 560, hit: .35, draw(t, a, d, p) { if (t < .7) { const n = 9; let px = a[0], py = a[1];
        for (let i = 1; i <= n; i++) { const u = i/n, x = lerp(a[0], d[0], u) + (i < n ? (R(i + Math.floor(t*20))*2 - 1)*7 : 0), y = lerp(a[1], d[1], u) + (i < n ? (R(i*3 + Math.floor(t*20))*2 - 1)*7 : 0);
          seg(px, py, x, y, 3, p[0]); seg(px, py, x, y, 1.5, p[2]); px = x; py = y; } }
      if (t > .3) for (let i = 0; i < 10; i++) { const u = clamp((t - .3)/.7), an = R(i)*6.3; dot(d[0] + Math.cos(an)*u*16, d[1] + Math.sin(an)*u*16, 2, i % 2 ? p[1] : p[2]); } } },
    thunder: { dur: 700, hit: .35, draw(t, a, d, p) { if (t > .2 && t < .75) { let px = d[0] + 3, py = -4;
        for (let i = 1; i <= 8; i++) { const y = lerp(-4, d[1], i/8), x = d[0] + (i < 8 ? (R(i + Math.floor(t*16))*2 - 1)*8 : 0); seg(px, py, x, y, 4, p[0]); seg(px, py, x, y, 2, p[2]); px = x; py = y; } }
      if (t > .3) burst(d, (t - .3)/.7, p, 1.1); } , start() { setTimeout(() => flash("#fffbd0", 220, .8), 200*slow); } },
    ice: { dur: 680, hit: .55, draw(t, a, d, p) { for (let i = 0; i < 10; i++) { const s = i*.035, u = clamp((t - s)/.45); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0], u) + (R(i)*2 - 1)*6, y = lerp(a[1], d[1], u) + (R(i + 5)*2 - 1)*6, an = Math.atan2(d[1] - a[1], d[0] - a[0]);
        poly([[x + Math.cos(an)*6, y + Math.sin(an)*6], [x + Math.cos(an + 2.6)*3, y + Math.sin(an + 2.6)*3], [x + Math.cos(an - 2.6)*3, y + Math.sin(an - 2.6)*3]], i % 2 ? p[1] : p[2]); }
      if (t > .5) { const u = (t - .5)/.5; for (let i = 0; i < 6; i++) { const an = i*Math.PI/3; seg(d[0], d[1], d[0] + Math.cos(an)*12*u, d[1] + Math.sin(an)*12*u, 2, p[1]); dot(d[0] + Math.cos(an)*12*u, d[1] + Math.sin(an)*12*u, 3, p[2]); } } } },
    snow: { dur: 900, hit: .5, draw(t, a, d, p) { for (let i = 0; i < 60; i++) { const x = (R(i)*W*1.4 - t*W*.8 + W) % W, y = (R(i + 7)*H + t*H*1.3) % H; dot(x, y, i % 3 ? 2 : 3, i % 2 ? p[2] : p[1]); }
      if (t > .5) burst(d, (t - .5)/.5, p, .9); } },
    psy: { dur: 760, hit: .5, draw(t, a, d, p) { for (let i = 0; i < 4; i++) { const u = (t*1.6 - i*.18); if (u < 0 || u > 1) continue; ring(d[0], d[1], 4 + u*20, 2, i % 2 ? p[1] : p[0]); }
      ring(a[0], a[1], 6 + 3*Math.sin(t*20), 1.5, p[1]); } , start() { flash("#f070a8", 300, .25); } },
    shadow: { dur: 700, hit: .62, draw(t, a, d, p) { T.orb.draw(t, a, d, p); if (t < .62) { const u = ease(t/.62); for (let i = 0; i < 6; i++) { const an = t*14 + i; dot(lerp(a[0], d[0], u) + Math.cos(an)*7, lerp(a[1], d[1], u) - Math.sin(u*Math.PI)*8 + Math.sin(an)*7, 2, p[2]); } } } },
    dragon: { dur: 780, hit: .6, draw(t, a, d, p) { for (let i = 0; i < 30; i++) { const u = clamp(t*1.7 - i*.025); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0], u), y = lerp(a[1], d[1], u) + Math.sin(u*14 - t*10)*7; disc(x, y, 3.2*(1 - i/40), i % 3 ? p[1] : p[0]); }
      if (t > .6) burst(d, (t - .6)/.4, p, 1); } },
    dark: { dur: 640, hit: .5, draw(t, a, d, p) { for (let i = 0; i < 3; i++) { const u = clamp((t - i*.1)/.5); if (u <= 0 || u >= 1) continue; const x = lerp(a[0], d[0], u), y = lerp(a[1], d[1], u);
        cx.fillStyle = p[0]; cx.beginPath(); cx.arc(x, y, 9, -1.2, 1.2); cx.arc(x - 4, y, 7, 1.0, -1.0, true); cx.fill(); }
      if (t > .5) burst(d, (t - .5)/.5, ["#000", p[1], p[2]], .9); } },
    fairy: { dur: 760, hit: .5, draw(t, a, d, p) { for (let i = 0; i < 14; i++) { const u = clamp((t - i*.02)/.6), an = i*2.4 + t*4, r = 22*(1 - u) + 3;
        if (u > 0 && u < 1) star(d[0] + Math.cos(an)*r, d[1] + Math.sin(an)*r, 3.5, i % 2 ? p[1] : p[2], 4, t*6); } if (t > .5) burst(d, (t - .5)/.5, p, .8); } },
    sludge: { dur: 700, hit: .6, draw(t, a, d, p) { for (let i = 0; i < 6; i++) { const u = clamp((t - i*.06)/.45); if (u <= 0 || u >= 1) continue;
        disc(lerp(a[0], d[0], u), lerp(a[1], d[1], u) - Math.sin(u*Math.PI)*14, 3.5, p[1]); dot(lerp(a[0], d[0], u) - 1, lerp(a[1], d[1], u) - Math.sin(u*Math.PI)*14 - 1, 1.5, p[2]); }
      if (t > .55) for (let i = 0; i < 8; i++) { const u = clamp((t - .55)/.45), x = d[0] + (R(i)*2 - 1)*d[2]*.25, y = d[1] + 6 - u*14*R(i + 2); ring(x, y, 1 + 2*u, 1, p[1]); } } },
    quake: { dur: 800, hit: .3, draw(t, a, d, p) { const gy = d[1] + d[2]*.22; for (let i = 0; i < 5; i++) { const u = clamp(t*2 - i*.1); seg(d[0], gy, d[0] + (i - 2)*10*u, gy + (R(i)*2 - 1)*4*u, 2, p[0]); }
      for (let i = 0; i < 14; i++) { const u = clamp((t - .2)/.8), x = d[0] + (R(i)*2 - 1)*d[2]*.45, y = gy - u*18*R(i + 1) + u*u*14; dot(x, y, 3, i % 2 ? p[1] : p[2]); } },
      start() { shake(5, 600); } },
    rocks: { dur: 760, hit: .5, draw(t, a, d, p) { for (let i = 0; i < 5; i++) { const u = clamp((t - i*.07)/.4), x = d[0] + (i - 2)*6, y = lerp(-8, d[1] - 2 + (i % 2)*4, ease(u));
        if (u > 0) { rect(x - 3, y - 3, 6, 6, p[0]); rect(x - 2, y - 3, 4, 2, p[2]); } } if (t > .5) burst(d, (t - .5)/.5, p, .8); } , start() { setTimeout(() => shake(3, 250), 380*slow); } },
    metal: { dur: 640, hit: .45, draw(t, a, d, p) { for (let i = 0; i < 4; i++) { const u = clamp(t*2 - i*.2), an = .6 + i*.7; if (u <= 0 || u >= 1) continue;
        seg(d[0] - Math.cos(an)*16, d[1] - Math.sin(an)*16, d[0] + Math.cos(an)*16, d[1] + Math.sin(an)*16, 2, p[2]); } star(d[0], d[1], 8*Math.sin(Math.PI*t), p[2], 4, t*3); } },
    gust: { dur: 760, hit: .5, draw(t, a, d, p) { for (let i = 0; i < 3; i++) { const r0 = 6 + i*5, s = t*14 + i*2; cx.strokeStyle = i % 2 ? p[1] : p[2]; cx.lineWidth = 2; cx.beginPath();
        cx.arc(d[0], d[1], r0*(.6 + .4*t), s, s + 2.2); cx.stroke(); } for (let i = 0; i < 6; i++) { const u = clamp(t*1.4 - i*.08); if (u > 0 && u < 1) seg(lerp(a[0], d[0], u) - 4, lerp(a[1], d[1], u), lerp(a[0], d[0], u) + 4, lerp(a[1], d[1], u), 1, p[2]); } } },
    buzz: { dur: 680, hit: .5, draw(t, a, d, p) { for (let i = 0; i < 3; i++) { const u = (t*1.8 - i*.2); if (u < 0 || u > 1) continue; ring(lerp(a[0], d[0], u), lerp(a[1], d[1], u), 3 + 5*u, 2, p[1]); }
      if (t > .5) burst(d, (t - .5)/.5, p, .7); } },
    sound: { dur: 760, hit: .55, draw(t, a, d, p) { const an = Math.atan2(d[1] - a[1], d[0] - a[0]); for (let i = 0; i < 5; i++) { const u = clamp(t*1.6 - i*.15); if (u <= 0 || u >= 1) continue;
        const r = 6 + u*Math.hypot(d[0] - a[0], d[1] - a[1]); cx.strokeStyle = i % 2 ? p[1] : p[2]; cx.lineWidth = 2; cx.beginPath(); cx.arc(a[0], a[1], r, an - .35, an + .35); cx.stroke(); } } },
    star: { dur: 480, hit: .2, draw(t, a, d, p) { burst(d, t, p, 1); } },
    punch: { dur: 520, hit: .15, draw(t, a, d, p) { star(d[0], d[1], 4 + 12*ease(clamp(t*3)), p[2], 8, .3); if (t > .1) ring(d[0], d[1], 4 + t*18, 2, p[1]);
      for (let i = 0; i < 6; i++) { const an = i*1.05 + .3, u = clamp(t*1.5); seg(d[0] + Math.cos(an)*(8 + 10*u), d[1] + Math.sin(an)*(8 + 10*u), d[0] + Math.cos(an)*(12 + 12*u), d[1] + Math.sin(an)*(12 + 12*u), 1.5, p[2]); } }, start() { shake(2, 160); } },
    kick: { dur: 520, hit: .2, draw(t, a, d, p) { cx.strokeStyle = p[2]; cx.lineWidth = 3; cx.beginPath(); cx.arc(d[0] + 6, d[1] + 6, 14, Math.PI*.9, Math.PI*(.9 + 1.0*ease(clamp(t*2.5)))); cx.stroke(); T.punch.draw(t, a, d, p); } },
    slash: { dur: 520, hit: .3, draw(t, a, d, p) { for (let i = 0; i < 3; i++) { const u = clamp((t - i*.08)*4); if (u <= 0 || t > .85) continue; const o = (i - 1)*6;
        seg(d[0] - 13 + o, d[1] - 13, lerp(d[0] - 13 + o, d[0] + 13 + o, u), lerp(d[1] - 13, d[1] + 13, u), 3, p[0]); seg(d[0] - 13 + o, d[1] - 13, lerp(d[0] - 13 + o, d[0] + 13 + o, u), lerp(d[1] - 13, d[1] + 13, u), 1, "#fff"); } } },
    bite: { dur: 560, hit: .45, draw(t, a, d, p) { const c = ease(clamp(t/.45)), gap = 16*(1 - c) + 1;
      for (let i = -2; i <= 2; i++) { poly([[d[0] + i*5 - 2.5, d[1] - gap - 8], [d[0] + i*5 + 2.5, d[1] - gap - 8], [d[0] + i*5, d[1] - gap]], "#fff"); poly([[d[0] + i*5 - 2.5, d[1] + gap + 8], [d[0] + i*5 + 2.5, d[1] + gap + 8], [d[0] + i*5, d[1] + gap]], "#fff"); }
      rect(d[0] - 13, d[1] - gap - 10, 26, 2, p[0]); rect(d[0] - 13, d[1] + gap + 8, 26, 2, p[0]); if (t > .45) burst(d, (t - .45)/.55, p, .6); } },
    tackle: { dur: 480, hit: .2, draw(t, a, d, p) { ring(d[0], d[1], 3 + 16*t, 2, p[2]); for (let i = 0; i < 6; i++) { const u = clamp(t*1.3), an = Math.PI*(.9 + .2*R(i)), x = d[0] + (i - 3)*4, y = d[1] + d[2]*.18; disc(x - u*6*(i - 3)/3, y - u*4, 3*(1 - u) + .5, "#d8cbb0"); } }, start() { shake(2, 140); } },
    dash: { dur: 440, hit: .3, draw(t, a, d, p) { for (let i = 0; i < 8; i++) { const y = lerp(a[1], d[1], .5) + (i - 4)*4, x = lerp(a[0], d[0], ease(t)) - (d[0] > a[0] ? 1 : -1)*R(i)*20; seg(x, y, x - (d[0] > a[0] ? 1 : -1)*14, y, 1, p[2]); } if (t > .3) T.tackle.draw((t - .3)/.7, a, d, p); } },
    rampage: { dur: 700, hit: .3, draw(t, a, d, p) { T.punch.draw(t, a, d, p); T.dragon.draw(Math.min(1, t*1.2), a, d, p); }, start() { shake(4, 500); } },
    buff: { dur: 700, hit: 1, self: true, draw(t, a, d, p) { for (let i = 0; i < 8; i++) { const u = clamp(t*1.4 - i*.06), x = a[0] + (i - 3.5)*5, y = a[1] + 14 - u*28; if (u <= 0 || u >= 1) continue;
        poly([[x, y - 4], [x - 3, y], [x + 3, y]], p[1]); rect(x - 1, y, 2, 4, p[1]); } ring(a[0], a[1], 10 + 4*Math.sin(t*12), 1.5, p[2]); } },
    debuff: { dur: 700, hit: 1, draw(t, a, d, p) { for (let i = 0; i < 8; i++) { const u = clamp(t*1.4 - i*.06), x = d[0] + (i - 3.5)*5, y = d[1] - 14 + u*28; if (u <= 0 || u >= 1) continue;
        poly([[x, y + 4], [x - 3, y], [x + 3, y]], "#5a6aa8"); rect(x - 1, y - 4, 2, 4, "#5a6aa8"); } } },
    heal: { dur: 760, hit: 1, self: true, draw(t, a, d, p) { for (let i = 0; i < 10; i++) { const u = clamp(t*1.3 - i*.05), x = a[0] + (R(i)*2 - 1)*a[2]*.3, y = a[1] + 12 - u*26; if (u <= 0 || u >= 1) continue;
        rect(x - 3, y - 1, 6, 2, "#7ae07a"); rect(x - 1, y - 3, 2, 6, "#7ae07a"); dot(x, y, 1, "#fff"); } } },
    shield: { dur: 700, hit: 1, self: true, draw(t, a, d, p) { const r = 16*ease(clamp(t*2)), x = a[0] + (d[0] > a[0] ? 8 : -8); cx.globalAlpha = .75*(1 - clamp((t - .7)/.3));
      cx.strokeStyle = "#9fe0ff"; cx.lineWidth = 2; cx.beginPath(); for (let i = 0; i <= 6; i++) { const an = i*Math.PI/3 + Math.PI/6; cx.lineTo(x + Math.cos(an)*r*.6, a[1] + Math.sin(an)*r); } cx.stroke(); cx.globalAlpha = 1; } },
    status: { dur: 760, hit: 1, draw(t, a, d, p) { for (let i = 0; i < 16; i++) { const u = clamp(t*1.2 - i*.03), an = i*2.1 + t*3, r = 18*(1 - u) + 4; if (u <= 0 || u >= 1) continue; dot(d[0] + Math.cos(an)*r, d[1] + Math.sin(an)*r*.7 - u*6, 2, i % 2 ? p[1] : p[2]); } } },
    weather: { dur: 900, hit: 1, self: true, draw(t, a, d, p) { for (let i = 0; i < 40; i++) dot((R(i)*W + t*30) % W, (R(i + 3)*H + t*H*1.5) % H, 2, p[1]); } },
    heart: { dur: 820, hit: .6, draw(t, a, d, p) { for (let i = 0; i < 7; i++) { const u = clamp(t*1.5 - i*.09); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0], u) + Math.sin(u*10 + i)*5, y = lerp(a[1], d[1], u) - Math.sin(u*Math.PI)*14 + Math.cos(u*8 + i)*3; heartAt(x, y, 3.2, i % 2 ? "#ff6aa0" : p[1]); }
      T.sound.draw(Math.min(1, t*1.3), a, d, ["#f49ad0", "#ffd0e8", "#fff"]); if (t > .55) for (let i = 0; i < 5; i++) { const u = (t - .55)/.45; heartAt(d[0] + (i - 2)*7, d[1] - 6 - u*14 - (i % 2)*4, 2.6, "#ff6aa0"); } } },
    mapae: { dur: 760, hit: .45, draw(t, a, d, p) { const u = ease(clamp(t/.45)), y = lerp(-20, d[1] - 4, u);
        if (t < .8) { rect(d[0] - 9, y - 12, 18, 24, "#b08830"); rect(d[0] - 7, y - 10, 14, 20, "#e8c860"); disc(d[0], y - 4, 3, "#b08830"); for (let i = 0; i < 3; i++) rect(d[0] - 5 + i*4, y + 3, 2, 4, "#7a5a18"); }
        if (t > .45) { ring(d[0], d[1], 4 + (t - .45)*60, 3, "#ffe890"); star(d[0], d[1], 14*(1 - (t - .45)/.55), "#fff8c0", 8, t*4); } }, start() { setTimeout(() => { flash("#fff4c0", 220, .7); shake(4, 260); }, 340*slow); } },
    gourd: { dur: 900, hit: .55, draw(t, a, d, p) { const s = t < .5 ? 0 : (t - .5)*2;
        disc(d[0] - s*8, d[1], 11, "#e8e0b0"); disc(d[0] + s*8, d[1], 11, "#e8e0b0"); disc(d[0] - s*8, d[1] - 2, 9, "#f8f4d8"); disc(d[0] + s*8, d[1] - 2, 9, "#f8f4d8");
        if (t < .5) { const x = d[0] + Math.sin(t*40)*8; rect(x - 1, d[1] - 16, 2, 30, "#8a7a6a"); for (let i = 0; i < 6; i++) rect(x - 3, d[1] - 14 + i*5, 6, 1, "#5a4a3a"); }
        else for (let i = 0; i < 14; i++) { const an = R(i)*6.28, r = s*26*R(i + 2); dot(d[0] + Math.cos(an)*r, d[1] + Math.sin(an)*r - s*8, i % 3 ? 3 : 2, i % 2 ? "#ffd030" : "#fff4a0"); } } },
    azalea: { dur: 820, hit: .55, draw(t, a, d, p) { const C = ["#e0306a", "#ff6a9a", "#ffc0d8"]; for (let i = 0; i < 16; i++) { const s0 = i*.03, u = clamp((t - s0)/.55); if (u <= 0 || u >= 1) continue;
        const x = lerp(a[0], d[0], u) + Math.sin(u*9 + i)*9, y = lerp(a[1], d[1], u) + Math.cos(u*7 + i*2)*8 - Math.sin(u*Math.PI)*12, an = u*10 + i;
        poly([[x + Math.cos(an)*4, y + Math.sin(an)*4], [x + Math.cos(an + 2.1)*3, y + Math.sin(an + 2.1)*3], [x + Math.cos(an + 4.2)*3, y + Math.sin(an + 4.2)*3]], C[i % 3]); dot(x, y, 1, "#fff0a0"); }
      if (t > .55) burst(d, (t - .55)/.45, C, .9); } },
    coins: { dur: 760, hit: .35, draw(t, a, d, p) { const sw = clamp(t/.35), an = -1.8 + sw*2.2, hx = d[0] - 14, hy = d[1] - 18;
        if (t < .5) { seg(hx, hy, hx + Math.cos(an)*22, hy + Math.sin(an)*22 + 22, 6, "#6a3a1a"); disc(hx + Math.cos(an)*22, hy + Math.sin(an)*22 + 22, 5, "#8a5a2a"); }
        if (t > .35) for (let i = 0; i < 12; i++) { const u = (t - .35)/.65, x = d[0] + (R(i)*2 - 1)*26*u, y = d[1] - 10 - 20*u*R(i + 4) + 34*u*u; disc(x, y, 2.6, "#e0a820"); dot(x - .5, y - .5, 1.4, "#fff0a0"); } }, start() { setTimeout(() => shake(3, 180), 240*slow); } },
    moon: { dur: 900, hit: .6, draw(t, a, d, p) { const u = ease(clamp(t/.5)), mx = lerp(a[0], d[0], .5), my = lerp(40, 22, u);
        disc(mx, my, 10, "#fff6c8"); disc(mx + 4, my - 2, 9, "rgba(40,40,80,.85)"); ring(mx, my, 12 + 3*Math.sin(t*20), 1, "#fff0a0");
        if (t > .45) { const v = (t - .45)/.55; cx.globalAlpha = .55*(1 - v); poly([[mx - 3, my], [mx + 3, my], [d[0] + 16, d[1] + 14], [d[0] - 16, d[1] + 14]], "#fff6c8"); cx.globalAlpha = 1; burst(d, v, ["#c8b8ff", "#fff6c8", "#fff"], .9); } }, start() { flash("#202050", 300, .35); } },
    awaken: { dur: 1700, hit: 1, self: true, draw(t, a, d, p) { const O = ["#2f6fd0", "#e0402a", "#f0c030", "#ffffff", "#30303a"];
      for (let i = 0; i < 5; i++) { const an = t*5 + i*2*Math.PI/5, r = 26*(1 - ease(clamp(t*1.2))) + 6; disc(a[0] + Math.cos(an)*r, a[1] + Math.sin(an)*r*.6, 4, O[i]); }
      if (t > .5) { const u = (t - .5)/.5; rect(a[0] - 10*(1 - u), 0, 20*(1 - u) + 2, a[1] + 10, "rgba(255,240,180,.55)"); for (let i = 0; i < 4; i++) ring(a[0], a[1], 4 + u*40 + i*6, 2, O[i]); }
      for (let i = 0; i < 18; i++) { const u = (t*1.5 + R(i)) % 1; dot(a[0] + (R(i + 5)*2 - 1)*24, a[1] + 16 - u*40, 2, O[i % 5]); } },
      start() { setTimeout(() => flash("#fff8d0", 500, .95), 1150*slow); } },
  };
  function heartAt(x, y, r, c) { disc(x - r*.5, y, r*.6, c); disc(x + r*.5, y, r*.6, c); poly([[x - r*1.05, y + r*.15], [x + r*1.05, y + r*.15], [x, y + r*1.3]], c); }
  function burst(d, t, p, k = 1) { t = clamp(t); if (t >= 1) return; star(d[0], d[1], (5 + 12*ease(t))*k, p[2], 6, t*2); ring(d[0], d[1], (3 + 18*t)*k, 2, p[1]);
    for (let i = 0; i < 8; i++) { const an = i*.785 + .2, r = (6 + 18*t)*k; dot(d[0] + Math.cos(an)*r, d[1] + Math.sin(an)*r, 2, i % 2 ? p[1] : p[2]); } }
  function render(now) {
    cx.clearRect(0, 0, W, H);
    if (weather) drawWeather(cx, weather, now, W, H);
    for (const [side, col] of aura) { const [x, y, w] = pos(side); for (let i = 0; i < 10; i++) { const u = (now/1600 + R(i)) % 1; dot(x + (R(i + 3)*2 - 1)*w*.38, y + w*.25 - u*w*.7, 2, col[i % 3]); } }
    const t0 = now; jobs = jobs.filter(j => { const t = (t0 - j.start)/(j.dur*slow); if (t >= 1) { j.done(); return false; }
      try { j.tp.draw(t, j.a, j.d, j.p, j.ty, j); } catch (e) { if (!errs.has(j.name)) { errs.add(j.name); console.warn("FX " + j.name + ": " + e.message); } } return true; });
  }
  function kick() {}
  const errs = new Set();
  // v2.50 세게 맞는 기술: 배경을 잠깐 어둡게(남켓몬·이펙트는 그대로 밝게)
  function dimNow(now) { let best = null; for (const j of jobs) { const D = j.tp.dim; if (!D) continue; const t = (now - j.start) / (j.dur * slow); if (t < 0 || t >= 1) continue;
      const a = D[1] * clamp(t / .15) * clamp((1 - t) / .2); if (!best || a > best.a) best = { c: D[0], a }; } return best; }
  return {
    // 기술 연출. 맞는 순간에 resolve(그 뒤에도 연출은 끝까지 그린다)
    play(name, a, d, type) {
      const tp = T[name] || T.star; if (!Save.opt.anim) return Promise.resolve();
      const p = FXP[type] || FXP["노말"], A = pos(a.side), Dd = pos(d.side);
      return new Promise(res => { let hit = false; const job = { tp, name, ty: type, dir: a.side === "E" ? -1 : 1, a: A, d: tp.self ? A : Dd, p, start: performance.now(), dur: tp.dur, done: () => { if (!hit) res(); } };
        jobs.push(job); if (tp.start) tp.start(); kick(); if (tp.snd && typeof sfx === "function") sfx("fx_" + tp.snd);   // v2.50 템플릿마다 효과음
        setTimeout(() => { hit = true; res(); }, tp.dur*tp.hit*slow); });
    },
    setWeather(w) { weather = w; kick(); }, get weather() { return weather; }, dimNow, get busy() { return jobs.length; },
    setAura(side, type) { if (type) aura.set(side, FXP[type] || FXP["노말"]); else aura.delete(side); kick(); },
    shake, flash, render, cv, tpl: T, pal: FXP, ctx: cx, clear() { jobs = []; weather = null; aura.clear(); cx.clearRect(0, 0, W, H); },
  };
})();
// ===== v1.2 날씨 그림 (배틀 FX 캔버스·필드 화면 공용) =====
function drawWeather(c, w, now, W, H, field) {
  const R = n => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
  const fill = (col, a) => { c.globalAlpha = a; c.fillStyle = col; c.fillRect(0, 0, W, H); c.globalAlpha = 1; };
  if (w === "rain") {
    if (field) fill("#30406a", .16);
    c.lineWidth = 1;
    for (let i = 0; i < (field ? 70 : 50); i++) { const x = (R(i) * W + now * .03) % W, y = (R(i + 9) * H + now * .28 * (0.8 + R(i + 3) * .4)) % H;
      c.strokeStyle = i % 2 ? "#9fc0f0" : "#6a8ac0"; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 2, y + 7); c.stroke(); }
  } else if (w === "sun") {
    fill("#fff0a0", field ? .10 : .07);
    for (let i = 0; i < 4; i++) { const x = (R(i) * W + now * .004) % (W + 60) - 30; c.globalAlpha = .08; c.fillStyle = "#fff8d0"; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 18, 0); c.lineTo(x + 58, H); c.lineTo(x + 30, H); c.fill(); }
    c.globalAlpha = 1;
    for (let i = 0; i < 14; i++) { const x = (R(i) * W + now * .006) % W, y = (R(i + 9) * H + now * .01) % H; c.fillStyle = i % 2 ? "#ffd040" : "#fff0a0"; c.fillRect(Math.round(x), Math.round(y), 2, 2); }
  } else if (w === "sand") {
    fill("#c89850", field ? .30 : .22);
    for (let i = 0; i < 60; i++) { const x = (R(i) * W + now * (.18 + R(i + 1) * .12)) % (W + 20) - 10, y = (R(i + 9) * H + Math.sin(now / 300 + i) * 6 + H) % H;
      c.fillStyle = i % 3 ? "#d8b070" : "#a07840"; c.fillRect(Math.round(x), Math.round(y), i % 4 ? 3 : 5, 1); }
  } else if (w === "hail") {
    if (field) fill("#dce6ff", .14);
    for (let i = 0; i < 55; i++) { const x = (R(i) * W + now * .03 + Math.sin(now / 500 + i) * 4) % W, y = (R(i + 9) * H + now * (.08 + R(i + 2) * .08)) % H;
      c.fillStyle = i % 3 ? "#ffffff" : "#b8d0f0"; const s = i % 4 ? 2 : 3; c.fillRect(Math.round(x), Math.round(y), s, s); }
  } else if (w === "fog") {
    fill("#e8eef4", field ? .22 : .14);
    for (let i = 0; i < 7; i++) { const y = (R(i) * H * 1.2 + H * .1) % H, x = ((now * (.006 + R(i + 5) * .008) + R(i + 2) * W * 2) % (W * 2)) - W * .6, wd = W * (.6 + R(i + 7) * .5), hh = 10 + R(i + 1) * 18;
      c.globalAlpha = .18 + R(i + 3) * .14; c.fillStyle = "#ffffff"; c.beginPath(); c.ellipse(x + wd / 2, y, wd / 2, hh / 2, 0, 0, 7); c.fill(); }
    c.globalAlpha = 1;
  }
}
// 날씨 아이콘 (10×10 픽셀)
function drawWxIcon(c, w, x, y) {
  const P = (px, py, col, ww = 1, hh = 1) => { c.fillStyle = col; c.fillRect(x + px, y + py, ww, hh); };
  if (w === "rain") { P(2, 1, "#8a98b0", 6, 1); P(1, 2, "#8a98b0", 8, 3); P(2, 2, "#c8d0e0", 5, 1); P(2, 6, "#4a8ae0", 1, 2); P(5, 7, "#4a8ae0", 1, 2); P(8, 6, "#4a8ae0", 1, 2); }
  else if (w === "sun") { P(3, 3, "#f0a020", 4, 4); P(4, 4, "#ffe060", 2, 2); for (const [a, b] of [[4, 0], [4, 8], [0, 4], [8, 4], [1, 1], [7, 1], [1, 7], [7, 7]]) P(a + (a === 4 ? 0 : 0), b, "#f0a020", a === 4 ? 2 : 1, b === 4 ? 2 : 1); }
  else if (w === "sand") { for (const [r, o] of [[2, 0], [5, 2], [8, 1]]) { P(o, r, "#b08040", 6, 1); P(o + 6, r - 1, "#b08040", 2, 1); } P(1, 9, "#d8b070", 2, 1); P(6, 9, "#d8b070", 2, 1); }
  else if (w === "hail") { P(4, 0, "#5a8ad0", 1, 9); P(0, 4, "#5a8ad0", 9, 1); P(2, 2, "#5a8ad0"); P(6, 2, "#5a8ad0"); P(2, 6, "#5a8ad0"); P(6, 6, "#5a8ad0"); P(4, 4, "#ffffff"); }
  else if (w === "fog") { P(1, 2, "#9aa4b0", 7, 1); P(0, 5, "#9aa4b0", 9, 1); P(2, 8, "#9aa4b0", 6, 1); P(3, 2, "#c8d0d8", 2, 1); P(5, 5, "#c8d0d8", 2, 1); }
}
