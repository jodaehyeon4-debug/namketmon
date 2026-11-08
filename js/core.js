// ===== 남켓몬 플레이 버전 — 코어: 화면·입력·불러오기·루프·글꼴·소리·저장 =====
"use strict";
const SW = 256, SH = 192, TS = 16;
const $ = id => document.getElementById(id);
const cv = $("screen"), g = cv.getContext("2d");
// v2.14: 화면 속 픽셀을 2배로 촘촘하게(논리 좌표는 256×192 그대로) → 트레이너 도트를 2배로 자세하게 그릴 수 있음
const DPR = 2;
cv.width = SW * DPR; cv.height = SH * DPR; g.imageSmoothingEnabled = false;
// 트레이너 그림: 한 장이 80×80(보통) 또는 160×160(2배 촘촘). 높이로 알아서 맞춤
function trImg(im, f, dx, dy, dw = 80, dh = 80) { const s = im.height / 80, n = Math.max(1, Math.round(im.width / (80 * s))); g.drawImage(im, (f % n) * 80 * s, 0, 80 * s, 80 * s, dx, dy, dw, dh); }
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPP = { up: "down", down: "up", left: "right", right: "left" };
// v2.49 받침 셈: 한글 + 숫자(0 영 1 일 2 이 3 삼 4 사 5 오 6 육 7 칠 8 팔 9 구 — 받침 ㄹ은 8)
const JONG_D = { 0: 21, 1: 8, 2: 0, 3: 16, 4: 0, 5: 0, 6: 1, 7: 8, 8: 8, 9: 0 };
const jongOf = w => { const s = String(w).replace(/['"’”)\]\s.!?…]+$/, ""), c = s.charCodeAt(s.length - 1); if (c >= 0xac00 && c <= 0xd7a3) return (c - 0xac00) % 28; const ch = s[s.length - 1]; return ch in JONG_D ? JONG_D[ch] : 1; };
const josa = (w, a, b) => w + (jongOf(w) ? a : b);
// 은/는, 이/가, 을/를, 과/와, 으로/로
const JS = { "은": ["은", "는"], "이": ["이", "가"], "을": ["을", "를"], "과": ["과", "와"], "아": ["아", "야"], "이여": ["이여", "여"] };
// 받침 있으면 '이'를 붙인다 (한별 → 한별이, 몽쭉이 → 몽쭉이): 친근한 부름·서술격 조사 생략형에 쓴다
function ii(w) { const c = w.charCodeAt(w.length - 1); return (c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28) ? w + "이" : w; }
function J(w, t) { const p = JS[t]; if (t === "으로") { const jong = jongOf(w); return w + (jong && jong !== 8 ? "으로" : "로"); } return josa(w, p[0], p[1]); }
// v2.49 조사만(따옴표·괄호 뒤에 붙일 때): jp("상자 2", "이") → "가"
function jp(w, t) { return J(w, t).slice(String(w).length); }

// ---- 화면 맞춤 (정수 배율) ----
function fit() {
  // v2.48 태블릿: 기기 화소 단위로 정수배(고해상도 화면에서 더 크게, 도트는 고르게) · 가로로 들면 조작 단추를 양옆으로 · 단추 크기도 화면에 맞춤
  const B = document.body, touch = B.classList.contains("touch"), dpr = Math.min(3, window.devicePixelRatio || 1);
  const W = innerWidth, H = innerHeight;
  const cs = touch ? Math.max(1, Math.min(1.15, Math.min(W, H) / 560)) : 1;
  document.documentElement.style.setProperty("--cs", cs.toFixed(3));
  const scale = (aw, ah) => { const f = Math.min(aw / SW, ah / SH), kd = Math.floor(f * dpr); if (kd < 1) return Math.max(0.2, f);
    const k = kd / dpr; return touch && dpr >= 2 && f > k * 1.12 ? Math.floor(f * 100) / 100 : k; };   // 레티나 태블릿은 빈칸이 많이 남으면 꽉 채움
  const below = scale(W - 44, H - (touch ? 132 * cs + 32 : 40) - 30);
  const sideW = 140 * cs + 22, side = touch && W > H ? scale(W - 2 * sideW, H - 28) : 0;
  const useSide = side > below * 1.06;
  B.classList.toggle("side", useSide);
  const k = useSide ? side : below;
  cv.style.width = SW * k + "px"; cv.style.height = SH * k + "px";
}
addEventListener("resize", fit);

// ---- 입력 ----
const Input = (() => {
  const down = {}, pressed = {}, held = {};
  const MAP = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", KeyW: "up", KeyS: "down", KeyA: "left", KeyD: "right",
    KeyZ: "a", Space: "a", KeyJ: "a", Enter: "enter", NumpadEnter: "enter", KeyX: "b", Escape: "b", Backspace: "b", KeyK: "b", KeyC: "menu", KeyI: "menu", ShiftLeft: "b", ShiftRight: "b" };
  const KEY = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", Enter: "enter", Escape: "b" };
  let any = false;
  // v1.4 방향키 끼임 방지: 키보드로 누른 키는 마지막 keydown(자동 반복 포함) 시각을 기억해, 자동 반복이 오는 환경에서
  // 1.2초 넘게 소식이 없으면(keyup을 놓친 경우: 한글 입력기·포커스 이동 등) 뗀 것으로 본다
  const last = {}, src = {}; let repSeen = false;
  function set(k, v, from) { if (v && !down[k]) { pressed[k] = true; any = true; } down[k] = v; if (!v) held[k] = 0; if (v) src[k] = from || "pad"; }
  function releaseAll(from) { for (const k in down) if (down[k] && (!from || src[k] === from)) set(k, false); }
  const keyOf = e => MAP[e.code] || KEY[e.key];
  addEventListener("keydown", e => { const k = keyOf(e); if (!k) return; e.preventDefault(); last[k] = performance.now(); if (e.repeat) repSeen = true;
    if (!e.repeat || !down[k]) set(k, true, "kb"); Audio2.unlock(); });
  addEventListener("keyup", e => { const k = keyOf(e); if (!k) { if (e.key === "Process" || !e.code) releaseAll("kb"); return; } e.preventDefault(); set(k, false); });
  addEventListener("blur", () => releaseAll());
  document.addEventListener("visibilitychange", () => { if (document.hidden) releaseAll(); });
  addEventListener("pagehide", () => releaseAll());
  return {
    set, down,
    is: k => !!down[k] || (k === "a" && !!down.enter),
    hit: k => !!pressed[k],
    ok: () => !!(pressed.a || pressed.enter),
    cancel: () => !!pressed.b,
    menuKey: () => !!(pressed.menu || pressed.enter),
    dir() { for (const d of ["up", "down", "left", "right"]) if (down[d]) return d; return null; },
    // 메뉴용 반복 입력
    rep(k) { if (pressed[k]) return true; if (!down[k]) return false; held[k] = (held[k] || 0) + 1; return held[k] > 18 && held[k] % 5 === 0; },
    end() { for (const k in pressed) delete pressed[k]; for (const k in down) if (down[k]) held[k] = held[k] || 0; any = false;
      if (repSeen) { const now = performance.now(); for (const k in down) if (down[k] && src[k] === "kb" && now - (last[k] || 0) > 1200) set(k, false); } },
    releaseAll,
    get anyPressed() { return any; },
  };
})();

// ---- 불러오기 ----
const IMG = {}, JSN = {};
function loadImg(name, src) { return new Promise((res) => { const im = new Image(); im.onload = () => { IMG[name] = im; res(im); }; im.onerror = () => { console.warn("img fail", src); res(null); }; im.src = src; }); }
async function loadJSON(name, src) { const r = await fetch(src); JSN[name] = await r.json(); return JSN[name]; }
const lazyImg = {};
function battleSheet(k) {   // 배틀 시트는 필요할 때 불러온다
  if (lazyImg[k]) return lazyImg[k];
  const im = new Image(); im.src = "battle/" + k + ".png"; lazyImg[k] = im; return im;
}

// ---- 시간 ----
let FRAME = 0;
const timers = [];
function wait(ms) { return new Promise(res => timers.push({ t: ms, res })); }
function frames(n) { return wait(n * 1000 / 60); }
function tickTimers() { for (let i = timers.length - 1; i >= 0; i--) { timers[i].t -= 1000 / 60; if (timers[i].t <= 0) { const r = timers[i].res; timers.splice(i, 1); r(); } } }

// ---- 장면 스택 ----
const Scenes = {
  st: [],
  push(s) { this.st.push(s); s.enter && s.enter(); return s; },
  pop(s) { const i = s ? this.st.lastIndexOf(s) : this.st.length - 1; if (i >= 0) { const [x] = this.st.splice(i, 1); x.leave && x.leave(); } },
  top() { return this.st[this.st.length - 1]; },
  has(s) { return this.st.includes(s); },
};
// 화면 효과 (페이드·번쩍임) — 맨 위에 그린다
const Screen = { fade: 0, fadeCol: "#000", flash: 0, flashCol: "#fff", shakeX: 0, shakeY: 0, tint: null };
async function fadeTo(v, n = 12, col = "#000") { Screen.fadeCol = col; const s = Screen.fade; for (let i = 1; i <= n; i++) { Screen.fade = s + (v - s) * i / n; await frames(1); } Screen.fade = v; }
const fadeOut = (n, c) => fadeTo(1, n, c), fadeIn = (n, c) => fadeTo(0, n, c);

function tick() {
  FRAME++;
  tickTimers();
  const top = Scenes.top();
  for (const s of Scenes.st) if (s.update) s.update(s === top);
  Input.end();
  Audio2.tick();
}
function draw() {
  g.setTransform(DPR, 0, 0, DPR, 0, 0); g.imageSmoothingEnabled = false;
  g.fillStyle = "#000"; g.fillRect(0, 0, SW, SH);
  let from = 0;
  for (let i = Scenes.st.length - 1; i >= 0; i--) if (Scenes.st[i].opaque) { from = i; break; }
  for (let i = from; i < Scenes.st.length; i++) Scenes.st[i].draw && Scenes.st[i].draw(g);
  if (Screen.flash > 0) { g.globalAlpha = Screen.flash; g.fillStyle = Screen.flashCol; g.fillRect(0, 0, SW, SH); g.globalAlpha = 1; }
  if (Screen.fade > 0) { g.globalAlpha = Screen.fade; g.fillStyle = Screen.fadeCol; g.fillRect(0, 0, SW, SH); g.globalAlpha = 1; }
}
let acc = 0, last = 0;
function loop(t) {
  if (!last) last = t;
  acc += Math.min(120, t - last); last = t;
  const step = 1000 / 60; let n = 0;
  while (acc >= step && n < 6) { tick(); acc -= step; n++; }
  draw();
  requestAnimationFrame(loop);
}

// ---- 글꼴 (Galmuri 비트맵, SIL OFL) ----
const Font = (() => {
  const F = {};
  async function load(name) {
    const [im, js] = await Promise.all([loadImg("font_" + name, "font/" + name + ".png"), loadJSON("font_" + name, "font/" + name + ".json")]);
    F[name] = { im, ...js };
  }
  function glyph(f, cp) {
    const R = f.runs; let lo = 0, hi = R.length - 1;
    while (lo <= hi) { const m = (lo + hi) >> 1, r = R[m]; if (cp < r[0]) hi = m - 1; else if (cp >= r[0] + r[1]) lo = m + 1;
      else { const i = r[2] + cp - r[0], adv = Array.isArray(r[3]) ? r[3][cp - r[0]] : r[3]; return [i, adv]; } }
    return null;
  }
  function adv(f, ch) { const gl = glyph(f, ch.codePointAt(0)); return gl ? gl[1] : (ch === " " ? 4 : f.cw - 2); }
  function width(str, name = "g11") { const f = F[name]; let w = 0; for (const ch of str) w += adv(f, ch); return w; }
  const cache = new Map();
  const tmp = document.createElement("canvas"), tg = tmp.getContext("2d");
  function render(str, name, col, sh) {
    const key = name + "|" + col + "|" + sh + "|" + str;
    let c = cache.get(key); if (c) { cache.delete(key); cache.set(key, c); return c; }
    const f = F[name]; const xs = [0]; let w = 0;
    for (const ch of str) { w += adv(f, ch); xs.push(w); }
    const W = Math.max(1, w + 2), H = f.ch + 1;
    tmp.width = W; tmp.height = H; tg.clearRect(0, 0, W, H);
    let x = 0;
    for (const ch of str) { const gl = glyph(f, ch.codePointAt(0));
      if (gl) tg.drawImage(f.im, (gl[0] % f.cols) * f.cw, Math.floor(gl[0] / f.cols) * f.ch, f.cw, f.ch, x, 0, f.cw, f.ch);
      x += gl ? gl[1] : adv(f, ch); }
    const out = document.createElement("canvas"); out.width = W; out.height = H; const og = out.getContext("2d");
    const tint = (color) => { const t = document.createElement("canvas"); t.width = W; t.height = H; const x2 = t.getContext("2d");
      x2.drawImage(tmp, 0, 0); x2.globalCompositeOperation = "source-in"; x2.fillStyle = color; x2.fillRect(0, 0, W, H); return t; };
    if (sh) { const s = tint(sh); og.drawImage(s, 1, 0); og.drawImage(s, 0, 1); og.drawImage(s, 1, 1); }
    og.drawImage(tint(col), 0, 0);
    c = { c: out, xs, w, h: f.ch };
    cache.set(key, c); if (cache.size > 600) cache.delete(cache.keys().next().value);
    return c;
  }
  // n: 보여 줄 글자 수(타자기). 반환: 그린 너비
  // v2.49 fit: 그 너비를 넘으면 작은 글씨(g9)로, 그래도 넘으면 가로로 살짝 좁혀 그림(여섯 글자 별명이 체력 막대·Lv와 겹치던 것)
  function draw(ctx, str, x, y, { font = "g11", col = TXT.dark, sh = TXT.sh, n = Infinity, align = "left", fit = 0 } = {}) {
    str = String(str); if (!str) return 0;
    if (fit && font === "g11" && width(str, "g11") > fit) { font = "g9"; y += 2; }
    const r = render(str, font, col, sh);
    if (fit && r.w > fit && n === Infinity) {
      const dw = fit + 1; if (align === "right") x -= fit; else if (align === "center") x -= Math.floor(fit / 2);
      ctx.drawImage(r.c, 0, 0, r.c.width, r.c.height, Math.round(x), Math.round(y), dw, r.c.height); return fit; }
    if (align === "right") x -= r.w; else if (align === "center") x -= Math.floor(r.w / 2);
    const cnt = Math.min(n, r.xs.length - 1); if (cnt <= 0) return 0; const cw = cnt >= r.xs.length - 1 ? r.c.width : r.xs[cnt] + 1;
    if (cw > 0) ctx.drawImage(r.c, 0, 0, cw, r.c.height, Math.round(x), Math.round(y), cw, r.c.height);
    return r.w;
  }
  // 줄 바꿈: 띄어쓰기 단위, 넘치면 글자 단위
  function wrap(text, maxW, name = "g11") {
    const out = [];
    for (const para of text.split("\n")) {
      let line = "";
      for (const word of para.split(" ")) {
        const t = line ? line + " " + word : word;
        if (width(t, name) <= maxW) { line = t; continue; }
        if (line) out.push(line);
        line = "";
        let wbuf = "";
        for (const ch of word) { if (width(wbuf + ch, name) > maxW) { out.push(wbuf); wbuf = ""; } wbuf += ch; }
        line = wbuf;
      }
      out.push(line);
    }
    return out;
  }
  return { load, width, draw, wrap, F };
})();
const TXT = { dark: "#3a3a46", sh: "#c8c8c0", white: "#f8f8f8", wsh: "#5a5a6a", red: "#e04030", rsh: "#f0b0a0", blue: "#3060d0", bsh: "#a8c0f0", gray: "#9a9aa4", gsh: "#dcdcd8" };
const txt = (s, x, y, o) => Font.draw(g, s, x, y, o);

// ---- 그리기 도구 ----
function rect(x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }
// 창 테두리 (설정에서 고르는 6가지 — 포켓몬의 '창 테두리' 설정처럼)
const FRAMES = [
  { name: "기본", o: "#4a6080", m: "#88a8c8", i: "#d8e4f0", bg: "#fbfbf6" },
  { name: "단청", o: "#2f5a3a", m: "#c8402a", i: "#3a8a5a", bg: "#fbfaf2", stripe: "#2a5aa8" },
  { name: "한지", o: "#6a4a2a", m: "#c8a070", i: "#ece0c4", bg: "#fcf8ec" },
  { name: "청사초롱", o: "#283a7a", m: "#d84a4a", i: "#4a6ad8", bg: "#fbfbf8", stripe: "#f0c040" },
  { name: "먹", o: "#1a1a20", m: "#4a4a52", i: "#a0a0a8", bg: "#f8f8f4" },
  { name: "조각보", o: "#5a3a5a", m: "#e08aa0", i: "#8ac0a0", bg: "#fffaf6", stripe: "#f0c060" },
];
function frame(x, y, w, h, style) {
  const F = FRAMES[style ?? Save.opt.frame] || FRAMES[0];
  rect(x + 2, y, w - 4, h, F.o); rect(x, y + 2, w, h - 4, F.o); rect(x + 1, y + 1, w - 2, h - 2, F.o);
  rect(x + 2, y + 1, w - 4, h - 2, F.m); rect(x + 1, y + 2, w - 2, h - 4, F.m);
  if (F.stripe) { for (let i = x + 4; i < x + w - 4; i += 6) { rect(i, y + 1, 2, 1, F.stripe); rect(i, y + h - 2, 2, 1, F.stripe); } }
  rect(x + 3, y + 2, w - 6, h - 4, F.i); rect(x + 2, y + 3, w - 4, h - 6, F.i);
  rect(x + 4, y + 3, w - 8, h - 6, F.bg); rect(x + 3, y + 4, w - 6, h - 8, F.bg);
}
function darkBox(x, y, w, h) {   // 배틀 글상자 (3세대식 진한 상자)
  rect(x, y, w, h, "#1c2232"); rect(x + 1, y + 1, w - 2, h - 2, "#c8b070"); rect(x + 2, y + 2, w - 4, h - 4, "#2a3550");
  rect(x + 3, y + 3, w - 6, h - 6, "#36466a"); rect(x + 4, y + 4, w - 8, h - 8, "#2e3c5e");
}
function cursor(x, y) { // ▶
  const c = "#3a3a46"; for (let i = 0; i < 5; i++) rect(x + i, y + i, 1, 9 - i * 2, c);
  rect(x + 1, y + 6, 4, 1, "#c8c8c0");
}
function downArrow(x, y) { const b = (FRAME >> 4) & 1; const c = "#d04030"; for (let i = 0; i < 4; i++) rect(x + i, y + b + i, 7 - i * 2, 1, c); }
// v2.19 촘촘한 그림(sw×sh)을 화면 자리(dw×dh)에
function spriteS(im, sx, sy, sw, sh, dx, dy, dw, dh, flip = false) {
  if (!im) return;
  if (!flip) { g.drawImage(im, sx, sy, sw, sh, Math.round(dx), Math.round(dy), dw, dh); return; }
  g.save(); g.translate(Math.round(dx) + dw, Math.round(dy)); g.scale(-1, 1); g.drawImage(im, sx, sy, sw, sh, 0, 0, dw, dh); g.restore();
}
function sprite(im, sx, sy, w, h, dx, dy, flip = false) {
  if (!im) return;
  if (!flip) { g.drawImage(im, sx, sy, w, h, Math.round(dx), Math.round(dy), w, h); return; }
  g.save(); g.translate(Math.round(dx) + w, Math.round(dy)); g.scale(-1, 1); g.drawImage(im, sx, sy, w, h, 0, 0, w, h); g.restore();
}

// ---- 소리: 배경 음악(이음매 없는 반복) + 효과음(합성) + 울음소리(종마다 다른 합성) ----
const Audio2 = (() => {
  let ac = null, master = null, musG = null, sfxG = null, unlocked = false;
  let L = {}; const buf = {}; let cur = null, curName = null, wantName = null, duck = 1;
  async function init() { try { L = await (await fetch("bgm/bgm.json")).json(); } catch (e) { L = {}; } }
  function ensure() {
    if (ac) return;
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.connect(ac.destination);
    musG = ac.createGain(); musG.connect(master); sfxG = ac.createGain(); sfxG.connect(master);
    vol();
  }
  function vol() { if (!ac) return; musG.gain.value = Save.opt.music * 0.55; sfxG.gain.value = Save.opt.sfx * 0.5; }
  function unlock() { ensure(); if (ac.state !== "running") ac.resume(); if (!unlocked) { unlocked = true; if (wantName) play(wantName); } }
  async function get(name) {
    if (buf[name]) return buf[name];
    const meta = L[name]; if (!meta) return null;
    const r = await fetch("bgm/" + meta.file); const ab = await r.arrayBuffer();
    return buf[name] = await ac.decodeAudioData(ab);
  }
  function stop(fade = 0.5) { if (!cur) return; const c = cur; cur = null; curName = null; try { c.g.gain.setTargetAtTime(0, ac.currentTime, fade / 4); c.s.stop(ac.currentTime + fade); } catch (e) {} }
  async function play(name, { fade = 0.4, force = false } = {}) {
    wantName = name;
    if (!name) { stop(fade); return; }
    if (!ac || !unlocked) return;
    if (curName === name && !force) return;
    curName = name;
    const b = await get(name); if (!b || wantName !== name) return;
    if (cur) { const c = cur; try { c.g.gain.setTargetAtTime(0, ac.currentTime, fade / 4); c.s.stop(ac.currentTime + fade); } catch (e) {} }
    const meta = L[name];
    const s = ac.createBufferSource(), gg = ac.createGain(); s.buffer = b;
    if (meta.loop) { s.loop = true; s.loopStart = meta.loopStart || 0; s.loopEnd = Math.min(meta.loopEnd || b.duration, b.duration); }
    gg.gain.value = 0; gg.gain.setTargetAtTime(duck, ac.currentTime, 0.04); s.connect(gg).connect(musG); s.start();
    cur = { s, g: gg, name };
  }
  // 짧은 곡: 배경 음악을 멈췄다가(포켓몬처럼) 끝나면 다시
  async function jingle(name) {
    if (!ac || !unlocked || !L[name]) { await wait(900); return; }
    const b = await get(name); if (!b) return;
    const meta = L[name]; const len = (meta.loopEnd || b.duration);
    if (cur) cur.g.gain.setTargetAtTime(0, ac.currentTime, 0.03);
    const s = ac.createBufferSource(), gg = ac.createGain(); s.buffer = b; gg.gain.value = 1; s.connect(gg).connect(musG); s.start();
    await wait(len * 1000 + 150);
    if (cur) cur.g.gain.setTargetAtTime(duck, ac.currentTime, 0.25);
  }
  // ---- 효과음 합성 ----
  function tone(type, f0, f1, dur, v = 0.3, t0 = 0, out = sfxG) {
    if (!ac || !unlocked) return;
    const t = ac.currentTime + t0, o = ac.createOscillator(), gg = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    gg.gain.setValueAtTime(v, t); gg.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(gg).connect(out); o.start(t); o.stop(t + dur + 0.02);
  }
  let noiseBuf = null;
  function noise(dur, v = 0.3, t0 = 0, hp = 800, lp = 6000, f1) {
    if (!ac || !unlocked) return;
    if (!noiseBuf) { noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const t = ac.currentTime + t0, s = ac.createBufferSource(), f = ac.createBiquadFilter(), f2 = ac.createBiquadFilter(), gg = ac.createGain();
    s.buffer = noiseBuf; f.type = "highpass"; f.frequency.value = hp; f2.type = "lowpass"; f2.frequency.setValueAtTime(lp, t); if (f1) f2.frequency.exponentialRampToValueAtTime(f1, t + dur);
    gg.gain.setValueAtTime(v, t); gg.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f).connect(f2).connect(gg).connect(sfxG); s.start(t); s.stop(t + dur + 0.02);
  }
  const SFX = {
    select() { tone("square", 1320, 1320, 0.06, 0.12); tone("square", 1760, 1760, 0.07, 0.1, 0.05); },
    cursor() { tone("square", 1200, 1200, 0.03, 0.07); },
    cancel() { tone("square", 900, 600, 0.08, 0.1); },
    bump() { tone("sine", 140, 60, 0.12, 0.45); noise(0.06, 0.15, 0, 100, 600); },
    door() { noise(0.18, 0.18, 0, 300, 3000, 500); tone("triangle", 330, 220, 0.18, 0.15); },
    exit() { noise(0.15, 0.18, 0, 400, 4000, 800); tone("triangle", 260, 390, 0.14, 0.15); },
    jump() { tone("square", 300, 700, 0.12, 0.13); },
    land() { tone("sine", 120, 70, 0.1, 0.35); },
    grass() { noise(0.09, 0.07, 0, 2500, 9000); },
    excl() { tone("square", 880, 880, 0.05, 0.12); tone("square", 1760, 1760, 0.1, 0.12, 0.06); },
    encounter() { for (let i = 0; i < 6; i++) tone("square", 440 + i * 110, 440 + i * 110, 0.05, 0.1, i * 0.04); },
    ball_throw() { tone("sine", 600, 1400, 0.25, 0.12); noise(0.25, 0.05, 0, 3000, 9000); },
    ball_open() { tone("square", 1600, 2400, 0.12, 0.08); noise(0.3, 0.12, 0, 2000, 9000, 3000); },
    ball_shake() { tone("triangle", 220, 180, 0.08, 0.3); noise(0.05, 0.12, 0, 200, 2000); },
    ball_click() { tone("square", 2000, 2000, 0.03, 0.12); tone("square", 1000, 1000, 0.06, 0.1, 0.035); },
    ball_poof() { noise(0.35, 0.2, 0, 1500, 8000, 1000); tone("sine", 1200, 400, 0.3, 0.12); },
    hit() { noise(0.12, 0.35, 0, 200, 5000, 600); tone("square", 200, 90, 0.1, 0.2); },
    hit_super() { noise(0.2, 0.4, 0, 150, 7000, 400); tone("sawtooth", 260, 60, 0.2, 0.25); tone("square", 520, 120, 0.15, 0.1, 0.02); },
    hit_weak() { noise(0.08, 0.2, 0, 400, 3000, 800); tone("triangle", 160, 120, 0.08, 0.15); },
    stat_up() { for (let i = 0; i < 5; i++) tone("square", 600 + i * 150, 700 + i * 150, 0.05, 0.07, i * 0.045); },
    stat_down() { for (let i = 0; i < 5; i++) tone("square", 1200 - i * 150, 1100 - i * 150, 0.05, 0.07, i * 0.045); },
    exp() { tone("square", 500, 1500, 0.5, 0.05); },
    heal_hp() { for (let i = 0; i < 4; i++) tone("triangle", 800 + i * 200, 900 + i * 200, 0.08, 0.1, i * 0.07); },
    faint() { tone("sawtooth", 600, 80, 0.55, 0.12); },
    run() { noise(0.3, 0.15, 0, 600, 5000, 900); for (let i = 0; i < 3; i++) tone("square", 300 - i * 50, 280 - i * 50, 0.05, 0.08, i * 0.07); },
    save() { tone("square", 784, 784, 0.1, 0.1); tone("square", 988, 988, 0.1, 0.1, 0.1); tone("square", 1175, 1175, 0.2, 0.1, 0.2); },
    lowhp() { tone("square", 1568, 1568, 0.07, 0.06); tone("square", 1318, 1318, 0.07, 0.06, 0.09); },
    pc_on() { tone("square", 523, 523, 0.06, 0.08); tone("square", 784, 784, 0.08, 0.08, 0.07); },
    heal_ball() { tone("square", 1046, 1046, 0.05, 0.08); },
    money() { tone("square", 1568, 1568, 0.05, 0.1); tone("square", 2093, 2093, 0.12, 0.1, 0.06); },
    menu() { tone("square", 1046, 1046, 0.05, 0.1); tone("square", 1318, 1318, 0.06, 0.1, 0.04); },
    flee_fail() { tone("square", 300, 200, 0.12, 0.1); },
    bus() { noise(1.2, 0.12, 0, 60, 500); tone("sawtooth", 70, 90, 1.2, 0.08); },
    chime() { tone("sine", 1318, 1318, 0.4, 0.12); tone("sine", 988, 988, 0.6, 0.12, 0.35); },
    // v2.0 풀베기·낚시·겨루기 징
    cut() { noise(0.16, 0.3, 0, 2500, 12000, 4000); tone("square", 1800, 600, 0.08, 0.06); noise(0.2, 0.12, 0.08, 800, 5000); },
    cast() { tone("sine", 900, 300, 0.25, 0.08); noise(0.2, 0.05, 0, 3000, 9000); },
    splash() { noise(0.35, 0.3, 0, 300, 3500, 900); tone("sine", 500, 200, 0.2, 0.08); },
    gong() { tone("sine", 196, 190, 1.6, 0.22); tone("sine", 392, 380, 1.2, 0.08); tone("triangle", 587, 560, 0.8, 0.05); noise(0.12, 0.1, 0, 200, 1500); },
    // v2.50 기술 이펙트 효과음(실제 게임처럼 기술마다 소리) — 맞는 소리(hit)는 따로 그대로
    fx_whoosh() { noise(0.14, 0.12, 0, 600, 4000, 1500); },
    fx_dash() { noise(0.2, 0.12, 0, 800, 6000, 2000); tone("sine", 300, 600, 0.15, 0.04); },
    fx_slash() { noise(0.08, 0.14, 0, 3000, 12000, 6000); tone("square", 2400, 1200, 0.06, 0.04); },
    fx_bite() { tone("square", 180, 120, 0.05, 0.13); noise(0.05, 0.14, 0.05, 500, 3000); tone("square", 220, 140, 0.05, 0.1, 0.07); },
    fx_dragon() { tone("sawtooth", 110, 70, 0.35, 0.09); noise(0.3, 0.08, 0, 100, 1200); },
    fx_whip() { noise(0.06, 0.15, 0.2, 2000, 9000, 4000); tone("square", 1600, 400, 0.07, 0.05, 0.22); },
    fx_bind() { tone("triangle", 200, 160, 0.3, 0.09); tone("triangle", 160, 210, 0.3, 0.07, 0.15); },
    fx_crash() { noise(0.3, 0.22, 0.2, 100, 2500, 400); tone("sine", 120, 50, 0.25, 0.18, 0.2); },
    fx_coins() { for (let i = 0; i < 4; i++) tone("square", i % 2 ? 2637 : 2093, i % 2 ? 2637 : 2093, 0.04, 0.05, i * 0.06); },
    fx_web() { tone("sine", 1200, 1800, 0.2, 0.04); noise(0.15, 0.05, 0, 4000, 10000); },
    fx_powder() { noise(0.5, 0.05, 0, 5000, 12000); for (let i = 0; i < 3; i++) tone("sine", 1800 + i * 300, 1800 + i * 300, 0.08, 0.03, i * 0.1); },
    fx_glare() { tone("square", 880, 880, 0.06, 0.07); tone("square", 660, 660, 0.12, 0.07, 0.07); },
    fx_smoke() { noise(0.5, 0.1, 0, 200, 1500, 600); },
    fx_spray() { noise(0.25, 0.1, 0, 1500, 7000, 3000); },
    fx_wind() { noise(0.55, 0.12, 0, 300, 800, 3000); },
    fx_notes() { tone("triangle", 784, 784, 0.1, 0.07); tone("triangle", 988, 988, 0.1, 0.07, 0.1); tone("triangle", 1175, 1175, 0.14, 0.07, 0.2); },
    fx_aura() { for (let i = 0; i < 6; i++) tone("sine", 400 + i * 120, 420 + i * 120, 0.08, 0.05, i * 0.05); },
    fx_metal() { tone("square", 1800, 1700, 0.2, 0.05); tone("triangle", 2600, 2500, 0.25, 0.05, 0.01); },
    fx_hazard() { for (let i = 0; i < 3; i++) tone("square", 900 - i * 100, 880 - i * 100, 0.04, 0.06, 0.25 + i * 0.08); noise(0.06, 0.08, 0.3, 800, 4000); },
    fx_ghost() { tone("sine", 400, 250, 0.45, 0.07); tone("sine", 412, 258, 0.45, 0.05, 0.02); },
    fx_drain() { tone("sine", 300, 300, 0.05, 0.05); for (let i = 0; i < 5; i++) tone("sine", 500 + i * 150, 520 + i * 150, 0.06, 0.05, 0.3 + i * 0.07); },
    fx_leaf() { noise(0.3, 0.08, 0, 2500, 8000, 4000); tone("sine", 1200, 1500, 0.12, 0.03); },
    fx_twinkle() { tone("square", 2093, 2093, 0.05, 0.04); tone("square", 2637, 2637, 0.05, 0.04, 0.06); tone("square", 3136, 3136, 0.08, 0.04, 0.12); },
    fx_orb() { tone("sine", 500, 900, 0.18, 0.08); },
    fx_charge() { tone("sine", 200, 900, 0.6, 0.07); noise(0.6, 0.04, 0, 2000, 8000); },
    fx_zap() { for (let i = 0; i < 4; i++) tone("sawtooth", 900 + (i % 2) * 400, 300, 0.07, 0.06, i * 0.05); noise(0.2, 0.07, 0, 2000, 9000); },
    fx_fire() { noise(0.4, 0.17, 0, 150, 2500, 800); tone("sawtooth", 90, 70, 0.3, 0.05); },
    fx_bubble() { for (let i = 0; i < 4; i++) tone("sine", 300 + i * 90, 500 + i * 90, 0.05, 0.07, i * 0.08); },
    fx_sleep() { tone("triangle", 600, 400, 0.25, 0.06); tone("triangle", 500, 330, 0.3, 0.05, 0.3); },
    fx_ice() { tone("sine", 2400, 2400, 0.15, 0.05); tone("sine", 3200, 3200, 0.2, 0.04, 0.05); noise(0.1, 0.06, 0, 5000, 12000); },
    fx_confuse() { tone("sine", 700, 500, 0.2, 0.06); tone("sine", 500, 700, 0.2, 0.06, 0.2); },
    fx_wave() { noise(0.8, 0.16, 0, 200, 2500, 600); tone("sine", 150, 90, 0.6, 0.06); },
    fx_heal() { tone("triangle", 1046, 1046, 0.08, 0.05); tone("triangle", 1318, 1318, 0.08, 0.05, 0.08); tone("triangle", 1568, 1568, 0.12, 0.05, 0.16); },
    fx_shield() { tone("sine", 440, 660, 0.2, 0.07); tone("sine", 880, 880, 0.25, 0.04, 0.05); },
    fx_beam() { tone("square", 400, 1600, 0.3, 0.05); noise(0.5, 0.08, 0.1, 1000, 6000); },
    fx_water() { noise(0.3, 0.12, 0, 600, 4000, 1200); tone("sine", 600, 300, 0.15, 0.05); },
    fx_thunder() { noise(0.6, 0.28, 0.18, 60, 3000, 300); tone("sawtooth", 1200, 100, 0.2, 0.08, 0.18); },
    fx_psy() { tone("sine", 500, 800, 0.3, 0.07); tone("sine", 800, 500, 0.3, 0.05, 0.15); },
    fx_dark() { tone("sawtooth", 150, 90, 0.3, 0.08); noise(0.2, 0.06, 0, 100, 800); },
    fx_quake() { noise(0.7, 0.28, 0, 40, 500, 200); tone("sine", 60, 40, 0.6, 0.22); },
    fx_buzz() { tone("sawtooth", 160, 170, 0.3, 0.05); tone("sawtooth", 163, 158, 0.3, 0.04); },
    fx_gong() { tone("sine", 392, 385, 0.6, 0.12); tone("triangle", 784, 770, 0.4, 0.05); },
  };
  function sfx(n) { if (!ac || !unlocked) return; try { SFX[n] && SFX[n](); } catch (e) {} }
  // ---- 울음소리: 종 키로 정해지는 짧은 합성음 (포켓몬처럼 종마다 다르다) ----
  function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function cry(k, { faint = false } = {}) {
    if (!ac || !unlocked) return 600;
    const m = MON[k]; const h = hash(k); const r = i => ((h >>> (i * 3)) & 7) / 7;
    const bst = m ? m.s.reduce((a, b) => a + b, 0) : 400;
    const base = 900 - Math.min(600, bst) * 0.9 + r(0) * 380;      // 클수록 낮다
    const types = ["square", "sawtooth", "triangle", "square"];
    const sp = faint ? 1.6 : 1, pitch = faint ? 0.7 : 1;
    const segs = 2 + (h & 1) + (r(5) > .6 ? 1 : 0);
    let t = 0; const total = (0.28 + r(1) * 0.32) * sp;
    const t0 = ac.currentTime + 0.01;
    const o = ac.createOscillator(), o2 = ac.createOscillator(), gg = ac.createGain(), f = ac.createBiquadFilter();
    o.type = types[h % 4]; o2.type = types[(h >>> 3) % 4]; o2.detune.value = 7 + r(2) * 18;
    f.type = "lowpass"; f.frequency.value = 2200 + r(3) * 2500; f.Q.value = 2 + r(4) * 6;
    const fm = ac.createOscillator(), fmg = ac.createGain(); fm.frequency.value = 18 + r(6) * 40; fmg.gain.value = base * (0.04 + r(7) * 0.12);
    fm.connect(fmg); fmg.connect(o.frequency); fmg.connect(o2.frequency);
    for (let i = 0; i <= segs; i++) {
      const fr = base * pitch * (0.7 + ((h >>> (i * 5 + 2)) & 15) / 15 * 0.9);
      o.frequency.linearRampToValueAtTime(fr, t0 + t); o2.frequency.linearRampToValueAtTime(fr * 1.005, t0 + t);
      t += total / segs;
    }
    gg.gain.setValueAtTime(0, t0); gg.gain.linearRampToValueAtTime(0.16, t0 + 0.02); gg.gain.setValueAtTime(0.16, t0 + total * 0.7); gg.gain.linearRampToValueAtTime(0, t0 + total);
    o.connect(f); o2.connect(f); f.connect(gg).connect(sfxG);
    for (const x of [o, o2, fm]) { x.start(t0); x.stop(t0 + total + 0.05); }
    if (r(2) > .5) noise(total * 0.6, 0.05, 0, 1500, 6000);
    return total * 1000 + 80;
  }
  return { init, unlock, play, stop, jingle, sfx, cry, vol, tick() {}, get cur() { return curName; }, get ready() { return unlocked; }, list: () => L };
})();
const bgm = n => Audio2.play(n), sfx = n => Audio2.sfx(n);

// ---- 저장 (이 브라우저에만; 실패해도 게임은 돈다) ----
const Save = {
  opt: { speed: 1, anim: 1, style: 0, frame: 0, music: 0.8, sfx: 0.9, autorun: 0, autosave: 1, readlock: 1 },   // v2.49 자동 리포트(기본 켬) · v2.51 대화 다 읽기(기본 켬, 설정에서 끔)
  loadOpt() { try { const o = JSON.parse(localStorage.getItem("nk_opt") || "null"); if (o) Object.assign(this.opt, o); } catch (e) {} },
  saveOpt() { try { localStorage.setItem("nk_opt", JSON.stringify(this.opt)); } catch (e) {} },
  has() { try { return !!localStorage.getItem("nk_save1"); } catch (e) { return false; } },
  write(data) { try { localStorage.setItem("nk_save1", JSON.stringify(data)); return true; } catch (e) { return false; } },
  read() { try { return JSON.parse(localStorage.getItem("nk_save1") || "null"); } catch (e) { return null; } },
};
