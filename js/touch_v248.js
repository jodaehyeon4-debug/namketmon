// ===== v2.48 태블릿 터치 (사용자: "터치 기능 만들 수 있어? 태블릿으로 할 수 있는.") =====
// 실제 DS(4·5세대)처럼 화면을 눌러서도 고름: 대화창 누르기 = A, 메뉴·예/아니오는 그 줄을 누르면 바로 고름,
// 배틀 '싸운다·가방·남켓몬·도망친다'와 기술 네 칸도 눌러서 고름. 들판에서 화면을 눌러도 아무 일 없음(실수 방지)
// + 터치 화면 노트북·크롬북: 손가락으로 처음 누르는 순간 터치 단추가 나타남 · 전체 화면 단추 · 두 손가락 확대 막기
"use strict";
(() => {
  const cv = $("screen"), body = document.body;
  let relA = 0;
  const pressA = () => { Input.set("a", false); Input.set("a", true); clearTimeout(relA); relA = setTimeout(() => Input.set("a", false), 80); };
  const relK = {}; const pressKey = k => { Input.set(k, false); Input.set(k, true); clearTimeout(relK[k]); relK[k] = setTimeout(() => Input.set(k, false), 80); };
  const gpos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * SW / r.width, (e.clientY - r.top) * SH / r.height]; };
  const inside = (x, y, x0, y0, w, h) => x >= x0 && x < x0 + w && y >= y0 && y < y0 + h;

  function tap(x, y) {
    const s = Scenes.top(); if (!s) return false;
    if (s.onPtr) return false;                                             // 이름 글자판은 스스로 누르기를 받음
    if (typeof Menu !== "undefined" && s instanceof Menu) {
      const o = s.o; if (!inside(x, y, o.x, o.y, o.w, s.h)) return false;
      const r = Math.floor((y - o.y - o.pad) / o.lh), k = s.scrollTop + r;
      if (r < 0 || r >= s.rows || k >= s.items.length) return false;
      if (s.i !== k) { s.i = k; s.fix(); s.o.onMove && s.o.onMove(k); }
      pressA(); return true;
    }
    if (s.kind === "cmd") {                                                // 배틀: 싸운다 · 가방 / 남켓몬 · 도망친다
      if (!inside(x, y, 128, 144, 128, 48)) return false;
      s.i = (y >= 166 ? 2 : 0) + (x >= 199 ? 1 : 0); pressA(); return true;
    }
    if (s.kind === "move") {                                               // 배틀: 기술 네 칸
      if (!inside(x, y, 0, 144, 176, 48)) return false;
      const n = BT && BT.w && BT.w.P ? BT.w.P.m.moves.length : 4, k = (y >= 166 ? 2 : 0) + (x >= 92 ? 1 : 0);
      if (k >= n) return false;
      s.i = k; pressA(); return true;
    }
    // v2.49 남켓몬 고르기·가방도 눌러서(태블릿)
    if (typeof PartyScreen !== "undefined" && s instanceof PartyScreen && !s.busy) {
      let k = -1;
      if (inside(x, y, 4, 18, 98, 62)) k = 0;
      else if (inside(x, y, 206, 152, 48, 26)) k = 6;
      else if (inside(x, y, 106, 4, 148, 140)) { const r = Math.floor((y - 4) / 28); if (r >= 0 && r < 5 && y - 4 - r * 28 < 26) k = r + 1; }
      if (k < 0 || (k < 6 && k >= G.party.length)) return false;
      s.i = k; pressA(); return true;
    }
    if (typeof Bag !== "undefined" && s instanceof Bag && !s.busy) {
      if (inside(x, y, 4, 4, 48, 22)) { pressKey("left"); return true; }
      if (inside(x, y, 52, 4, 48, 22) || inside(x, y, 16, 40, 72, 100)) { pressKey("right"); return true; }
      if (inside(x, y, 104, 4, 150, 134)) {
        const L = s.list();
        if (y < 10) { if (s.top > 0) { s.i = s.top - 1; sfx("cursor"); } return true; }                         // 위 화살표: 한 줄 올림
        if (y >= 130) { if (s.top + 7 < L.length) { s.i = Math.min(L.length - 1, s.top + 7); sfx("cursor"); } return true; }   // 아래 화살표: 한 줄 내림
        const r = Math.floor((y - 8) / 18), k = s.top + r; if (r < 0 || r > 6 || k >= L.length) return false;
        if (s.i !== k) { s.i = k; sfx("cursor"); return true; }          // 처음 누르면 고르고(설명이 보임) 한 번 더 누르면 결정
        pressA(); return true;
      }
      return false;
    }
    if (typeof Dex !== "undefined" && s instanceof Dex) {                 // v2.49 도감 목록: 줄을 누르면 고르고, 한 번 더 누르면 자세히 · 목록 위·아래 끝은 7칸씩
      if (!inside(x, y, 120, 24, 132, 164)) return false;
      if (y < 28) { pressKey("left"); return true; } if (y >= 182) { pressKey("right"); return true; }
      const r = Math.floor((y - 28) / 19), k = s.top + r; if (r < 0 || r > 7 || k >= s.max) return false;
      if (s.i !== k) { s.i = k; sfx("cursor"); return true; }
      pressA(); return true;
    }
    if (typeof Options !== "undefined" && s instanceof Options) {         // v2.49 설정: 줄을 누르면 고르고, 오른쪽 ◀ ▶ 쪽을 누르면 값 바꾸기, '닫기'는 결정
      const R = s.rows, lh = s.lh || 15, k = Math.floor((y - (s.y0 || 31) + 2) / lh);
      if (x < 8 || x > 248 || k < 0 || k >= R.length) return false;
      if (s.i !== k) { s.i = k; if (R[k][2]) sfx("cursor"); }
      if (!R[k][2]) { pressA(); return true; }
      if (x >= 140) pressKey(x < 194 ? "left" : "right");
      return true;
    }
    if (typeof TownMap !== "undefined" && s instanceof TownMap && s.pts && s.pts.length) {   // v2.49 타운맵·공중날기: 장소를 누르면 고르고, 한 번 더 누르면(날기) 결정
      let best = -1, bd = 12;
      s.pts.forEach((p, j) => { const d = Math.hypot(p.px - x, p.py - y); if (d < bd) { bd = d; best = j; } });
      if (best < 0) return false;
      if (s.i !== best) { s.i = best; sfx("cursor"); return true; }
      if (s.constructor.name === "FlyMap") { pressA(); return true; }
      return true;
    }
    if (s instanceof TextBox) { pressA(); return true; }                   // 대화창: A와 같음(다 읽기 시간은 그대로 지킴)
    const nm = s.constructor && s.constructor.name;
    if (nm === "Intro" || nm === "Title") { pressA(); return true; }      // 시작 화면 "A 버튼(Z)이나 화면을 누르세요"
    return false;
  }
  cv.addEventListener("pointerdown", e => {
    if (e.button > 0) return;
    Audio2.unlock();
    const [x, y] = gpos(e);
    if (tap(x, y)) e.preventDefault();
  });
  window.__tap = (x, y) => tap(x, y);                                      // 테스트용

  // 터치 화면 노트북·크롬북: 손가락으로 누르면 그때부터 터치 단추
  addEventListener("pointerdown", e => {
    if (e.pointerType === "touch" && !body.classList.contains("touch")) { body.classList.add("touch"); fit(); }
  }, true);
  // iOS 사파리: 두 손가락 확대·두 번 눌러 확대 막기
  for (const ev of ["gesturestart", "gesturechange"]) document.addEventListener(ev, e => e.preventDefault());
  // 돌렸을 때(가로·세로) 크기가 늦게 바뀌는 기기
  addEventListener("orientationchange", () => { setTimeout(fit, 120); setTimeout(fit, 500); });

  // 전체 화면 단추(되는 브라우저에서만 — 안드로이드 크롬·아이패드 사파리 등)
  const fb = $("fsbtn"), d = document;
  const can = d.fullscreenEnabled || d.webkitFullscreenEnabled;
  const isFs = () => !!(d.fullscreenElement || d.webkitFullscreenElement);
  if (fb && can) {
    fb.hidden = false;
    fb.addEventListener("click", () => {
      if (isFs()) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else { const el = d.documentElement, rq = el.requestFullscreen || el.webkitRequestFullscreen; if (rq) { try { const r = rq.call(el, { navigationUI: "hide" }); if (r && r.catch) r.catch(() => {}); } catch (_) {} } }
    });
    for (const ev of ["fullscreenchange", "webkitfullscreenchange"]) d.addEventListener(ev, () => { fb.textContent = isFs() ? "작게" : "전체 화면"; setTimeout(fit, 60); setTimeout(fit, 400); });
  }
  fit();
})();
