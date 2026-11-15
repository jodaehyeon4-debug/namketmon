// ===== v2.75 시작 메뉴(C)에 '타운맵' — 가방에 들어가지 않고 바로 지도 · 하늘택시 =====
// 메뉴 아이콘 여덟 칸 뒤에 접힌 지도 아이콘 한 칸을 그려 붙임(32×32, 받은 시안 아이콘의 굵은 테두리·두 단 음영에 맞춤)
"use strict";
(function menuV275() {
  if (typeof MENU_ICON === "undefined") return;
  MENU_ICON.타운맵 = 8;
  function build() {
    const im = IMG.menuicons; if (!im || !im.naturalWidth || im._v275) return !!(im && im._v275);
    const c = document.createElement("canvas"); c.width = im.naturalWidth + 32; c.height = im.naturalHeight; const x = c.getContext("2d");
    x.imageSmoothingEnabled = false; x.drawImage(im, 0, 0);
    const o = im.naturalWidth, R = (a, b, w, h, col) => { x.fillStyle = col; x.fillRect(o + a, b, w, h); };
    // 세 쪽으로 접힌 종이 지도
    const panes = [[3, 7, "#f2e2b0", "#d8c28a"], [12, 5, "#e8d49c", "#ccb47a"], [21, 7, "#f2e2b0", "#d8c28a"]];
    for (const [px, py, c1, c2] of panes) { R(px - 1, py - 1, 10, 22, "#4a3420"); R(px, py, 8, 20, c1); R(px, py + 14, 8, 6, c2); }
    R(5, 10, 4, 3, "#6ab04a"); R(14, 8, 5, 4, "#6ab04a"); R(22, 15, 5, 3, "#6ab04a");      // 숲
    R(3, 18, 26, 2, "#4a8ad0"); R(12, 17, 8, 1, "#4a8ad0");                                // 요천
    R(8, 12, 16, 1, "#b05a3a"); R(15, 12, 1, 6, "#b05a3a");                               // 길
    R(17, 9, 4, 4, "#d0463a"); R(18, 13, 2, 2, "#d0463a"); R(18, 10, 2, 2, "#fff4e0");     // 지금 있는 곳 표시
    im._v275 = true; c._v275 = true; c.naturalWidth = c.width; c.naturalHeight = c.height; c.complete = true; IMG.menuicons = c; return true;
  }
  let n = 0; const iv = setInterval(() => { if (build() || ++n > 120) clearInterval(iv); }, 500);
  window.MENU_V275 = { build };
})();
