// ===== v2.70 태블릿: PC 상자와 남켓몬 정보 화면도 눌러서 =====
// v2.48·v2.49에서 대화·메뉴·배틀·가방·도감·설정·지도는 눌러서 고를 수 있었는데, PC 상자와 정보(능력치·기술) 화면만 십자키로만 움직였다.
//   PC 상자: 칸을 누르면 손이 그리로 가고, 한 번 더 누르면 결정(집기·놓기·메뉴) · ◀ ▶ 로 상자 넘기기 · 상자 이름 = 메뉴 · 파티 칸 · 아래 단추 둘
//   정보 화면: 위 띠의 왼쪽·오른쪽 = 쪽 넘기기 · 남켓몬 그림 = 다음 남켓몬 · 기술 줄 = 그 기술 설명 · 그 밖 = A
// 실제 포켓몬처럼 묘사(DS 세대처럼 화면을 눌러 고름 — 구조만) · touch_v248 뒤에 읽힘
"use strict";
(() => {
  const cv = $("screen");
  let relA = 0; const relK = {};
  const pressA = () => { Input.set("a", false); Input.set("a", true); clearTimeout(relA); relA = setTimeout(() => Input.set("a", false), 80); };
  const pressKey = k => { Input.set(k, false); Input.set(k, true); clearTimeout(relK[k]); relK[k] = setTimeout(() => Input.set(k, false), 80); };
  const inside = (x, y, x0, y0, w, h) => x >= x0 && x < x0 + w && y >= y0 && y < y0 + h;

  function tap(x, y) {
    const s = Scenes.top(); if (!s) return false;
    if (typeof BoxScreen !== "undefined" && s instanceof BoxScreen) {
      if (s.busy) return false;
      if (inside(x, y, 98, 2, 156, 18)) {                                  // 머리: ◀ 이름 ▶
        if (x < 122) { s.turnBox(-1); return true; } if (x >= 230) { s.turnBox(1); return true; }
        if (s.area !== "header") { s.area = "header"; sfx("cursor"); return true; }
        pressA(); return true;
      }
      if (inside(x, y, 98, 22, 156, 130)) {                                // 상자 서른 칸
        const cx = Math.min(5, Math.floor((x - 98) / 26)), cy = Math.min(4, Math.floor((y - 22) / 26));
        if (s.area === "box" && s.cx === cx && s.cy === cy) { pressA(); return true; }
        s.area = "box"; s.cx = cx; s.cy = cy; sfx("cursor"); return true;
      }
      if (s.partyOpen && inside(x, y, 6, 22, 86, 132)) {                   // 파티 여섯 칸
        const c = x < 49 ? 0 : 1, r = Math.min(2, Math.floor((y - 22) / 44)), i = r * 2 + c;
        if (s.area === "party" && s.pi === i) { pressA(); return true; }
        s.area = "party"; s.pi = i; sfx("cursor"); return true;
      }
      if (inside(x, y, 170, 160, 84, 28)) {                                // 아래 단추: 파티 · 나가기
        const b = x < 213 ? 0 : 1; s.area = "btn"; s.btn = b; pressA(); return true;
      }
      return false;
    }
    if (typeof Summary !== "undefined" && s instanceof Summary) {
      if (s.lore) { pressA(); return true; }                               // 남원 이야기 창: 아무 데나 누르면 닫힘
      if (y < 20) { if (s.mi >= 0) return false; pressKey(x < 128 ? "left" : "right"); return true; }   // 위 띠: 쪽 넘기기
      if (s.page === 2 && inside(x, y, 110, 24, 142, 112)) {               // 기술 줄
        const k = Math.floor((y - 24) / 28); if (k < 0 || k >= s.m.moves.length) return false;
        if (s.mi === k) { pressA(); return true; }
        sfx(s.mi >= 0 ? "cursor" : "select"); s.mi = k; return true;
      }
      if (s.mi >= 0) { pressKey("b"); return true; }                       // 기술 보기에서 빈 곳: 돌아가기
      if (inside(x, y, 4, 24, 100, 112)) { if (s.L.length > 1) { pressKey("down"); return true; } return false; }   // 그림: 다음 남켓몬
      if (s.page >= 1) { pressA(); return true; }                          // 능력치 쪽: 남원 특성 이야기 · 기술 쪽: 기술 보기
      return false;
    }
    return false;
  }
  cv.addEventListener("pointerdown", e => { if (e.button > 0) return; const r = cv.getBoundingClientRect(); if (tap((e.clientX - r.left) * SW / r.width, (e.clientY - r.top) * SH / r.height)) e.preventDefault(); });
  const t0 = window.__tap; window.__tap = (x, y) => tap(x, y) || (t0 ? t0(x, y) : false);   // 테스트용
  window.TAP_V270 = { tap };
})();
