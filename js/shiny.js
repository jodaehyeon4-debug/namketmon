// ===== v2.40 이로치(색이 다른 남켓몬) =====
// 사용자: "이로치는 '간지' 혹은 '귀여움'을 기준으로, 유니크하게. 단색으로 퉁칠 말고 검+골 같은 조합. 확률은 0.3%"
// 실제 포켓몬처럼: 야생에서 0.3%(약 333마리에 1마리)로 만남 · 나올 때 반짝 별 · 정보 화면 이름 옆 ★ · 진화해도 그대로
// 색은 src/shiny_v240.py가 만든 js/shiny_data.js(SHINY · SHINY_TH)대로 배틀 시트를 처음 한 번 다시 칠함(파이썬 미리보기와 같은 식)
"use strict";
const SHINY_RATE = 0.003;
const shinyImg = {};

function hsvOf(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d > 1e-9) {
    if (mx === r) h = (((g - b) / d) % 6 + 6) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
    h = (h * 60) % 360;
  }
  return [h, mx > 0 ? d / mx : 0, mx];
}
function rgbOf(h, s, v) {
  h = ((h % 360) + 360) % 360 / 60; const i = Math.floor(h) % 6, f = h - Math.floor(h);
  const p = v * (1 - s), q = v * (1 - s * f), t = v * (1 - s * (1 - f));
  const c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][i];
  return c.map(x => Math.max(0, Math.min(255, Math.round(x * 255))));
}
const clamp01 = x => Math.max(0, Math.min(1, x));
function shinyGrad(st, t) {     // 그림자(0) → 가운데(0.5) → 빛(1)
  t = clamp01(t);
  const [lo, hi, a] = t < 0.5 ? [st[0], st[1], t * 2] : [st[1], st[2], (t - 0.5) * 2];
  const dh = ((hi[0] - lo[0] + 180) % 360 + 360) % 360 - 180;
  return [((lo[0] + dh * a) % 360 + 360) % 360, lo[1] + (hi[1] - lo[1]) * a, lo[2] + (hi[2] - lo[2]) * a];
}
function shinyRecolor(px, spec) {
  const TH = SHINY_TH[spec.th]; if (!TH) return;
  const G3 = spec.g.map(([hc, hw, ms, mv, role]) => ({ hc, hw, ms: Math.max(ms, 0.05), mv: Math.max(mv, 0.05), role,
    st: role === 0 ? TH.m : role === 1 ? TH.a : TH.a.map(c => [(c[0] + 28) % 360, c[1], c[2]]) }));
  const single = spec.g.length === 1, W = spec.w;
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] === 0) continue;
    const [h, s, v] = hsvOf(px[i], px[i + 1], px[i + 2]);
    let out = null;
    if (s >= 0.16 && v >= 0.22) {
      for (const q of G3) {
        const rel = ((h - q.hc + 180) % 360 + 360) % 360 - 180;
        if (Math.abs(rel) > q.hw) continue;
        const rv = v / q.mv, gg = shinyGrad(q.st, (rv - 0.6) / 0.75), sk = Math.max(0.7, Math.min(1.25, s / q.ms));
        out = [((gg[0] + rel * 0.15) % 360 + 360) % 360, clamp01(gg[1] * sk), clamp01(gg[2])];
        if (q.role === 0 && single && rv >= 1.22) { const a = shinyGrad(TH.a, 0.5 + clamp01((rv - 1.22) / 0.25) * 0.5); out = [a[0], clamp01(a[1]), clamp01(a[2])]; }
        break;
      }
    } else if (W && s < 0.16 && v >= 0.55) {
      const [H, S, V, k] = W; out = [H, s * (1 - k) + S * k, v * (1 - k) + Math.min(1, V * v / 0.92) * k];
    }
    if (out) { const c = rgbOf(out[0], out[1], out[2]); px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2]; }
  }
}
// 이로치 배틀 시트(캔버스): 처음 쓸 때 한 번 칠해 둠. battleSheet처럼 complete·naturalWidth를 씀
function shinySheet(k) {
  if (shinyImg[k]) return shinyImg[k];
  const base = battleSheet(k), c = document.createElement("canvas"); c.complete = false; c.naturalWidth = 0; shinyImg[k] = c;
  const go = () => {
    try {
      c.width = base.naturalWidth; c.height = base.naturalHeight;
      const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(base, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height); shinyRecolor(d.data, SHINY[k]); x.putImageData(d, 0, 0);
      c.naturalWidth = c.width; c.naturalHeight = c.height; c.complete = true;
    } catch (e) { console.warn("shiny fail", k, e); shinyImg[k] = base; }
  };
  if (base.complete && base.naturalWidth) go(); else base.addEventListener("load", go, { once: true });
  return c;
}
function sheetOf(k, shiny) { return shiny && typeof SHINY !== "undefined" && SHINY[k] ? shinySheet(k) : battleSheet(k); }
function rollShiny() { return Math.random() < (window.SHINY_FORCE ? 1 : SHINY_RATE); }   // 시험용: window.SHINY_FORCE = 1

// 나올 때 반짝 별(실제 게임처럼 몸 둘레로 별이 퍼지며 반짝)
function drawShinyStars(list) {
  for (const st of list) {
    const t = st.t / st.n; if (t < 0 || t > 1) continue;
    const r = 6 + t * 26, a = st.a, x = st.x + Math.cos(a) * r, y = st.y + Math.sin(a) * r * 0.8, s = Math.round(4 * (1 - Math.abs(t - 0.5) * 1.6)) + 1;
    const col = (st.i + (FRAME >> 2)) % 2 ? "#fff8c0" : "#ffffff";
    rect(x - s, y, s * 2 + 1, 1, col); rect(x, y - s, 1, s * 2 + 1, col); rect(x - 1, y - 1, 3, 3, "#ffe680");
  }
}
