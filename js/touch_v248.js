// ===== v2.48 태블릿 터치 (사용자: "터치 기능 만들 수 있어? 태블릿으로 할 수 있는.") =====
// 실제 DS(4·5세대)처럼 화면을 눌러서도 고름: 대화창 누르기 = A, 메뉴·예/아니오는 그 줄을 누르면 바로 고름,
// 배틀 '싸운다·가방·남켓몬·도망친다'와 기술 네 칸도 눌러서 고름. 들판에서 화면을 눌러도 아무 일 없음(실수 방지)
// + 터치 화면 노트북·크롬북: 손가락으로 처음 누르는 순간 터치 단추가 나타남 · 전체 화면 단추 · 두 손가락 확대 막기
"use strict";
(() => {
  const cv = $("screen"), body = document.body;
  let relA = 0;
  const pressA = () => { Input.set("a", false); Input.set("a", true); clearTimeout(relA); relA = setTimeout(() => Input.set("a", false), 80); };
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
