// ===== 터치 패드 (십자키는 손가락을 미끄러뜨려도 방향이 바뀐다) =====
"use strict";
(() => {
  const dp = $("dpad"); let cur = null, pid = null;
  function setDir(d) { if (cur === d) return; if (cur) Input.set(cur, false); cur = d; if (d) Input.set(d, true); }
  function at(e) {
    const r = dp.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
    if (Math.hypot(x, y) < 10) return cur;
    return Math.abs(x) > Math.abs(y) ? (x > 0 ? "right" : "left") : (y > 0 ? "down" : "up");
  }
  dp.addEventListener("pointerdown", e => { pid = e.pointerId; try { dp.setPointerCapture(e.pointerId); } catch (_) {} Audio2.unlock(); setDir(at(e)); e.preventDefault(); });
  dp.addEventListener("pointermove", e => { if (cur) setDir(at(e)); });
  for (const ev of ["pointerup", "pointercancel", "lostpointercapture"]) dp.addEventListener(ev, () => { setDir(null); pid = null; });
  // v1.4 끼임 방지: 손가락이 패드 밖에서 떨어져 패드가 소식을 못 받아도 창 전체에서 한 번 더 놓는다
  for (const ev of ["pointerup", "pointercancel"]) addEventListener(ev, e => { if (pid !== null && e.pointerId === pid) { setDir(null); pid = null; } });
  addEventListener("blur", () => { setDir(null); pid = null; });
  for (const b of document.querySelectorAll("[data-k]")) {
    const k = b.dataset.k;
    b.addEventListener("pointerdown", e => { b.setPointerCapture(e.pointerId); Audio2.unlock(); Input.set(k, true); b.classList.add("down"); e.preventDefault(); });
    for (const ev of ["pointerup", "pointercancel", "lostpointercapture"]) b.addEventListener(ev, () => { Input.set(k, false); b.classList.remove("down"); });
  }
  addEventListener("contextmenu", e => { if (document.body.classList.contains("touch")) e.preventDefault(); });
})();
