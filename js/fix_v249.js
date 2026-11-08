// ===== v2.49 전수 점검 고침 (사용자: "MAX EFFORT로 게임의 모든 불편·버그 사항 찾아 개선하고, 스토리·포켓몬 구성 등 모든 점을 최대한 많이 점검해") =====
// 1) 출현표: 저녁·밤에 한두 종만 나오던 풀숲(1번도로·광한루원·바래봉·미색마을)·낮에 두 종뿐이던 16번도로에 어울리는 종을 더함(실제 게임처럼 밤엔 올빼미·박쥐·도깨비)
//    v2.47에서 진화형으로 바꾸며 같은 곳에 같은 종이 두 줄이 된 것(17번도로 워낭왕·살쾡범, 13번도로 엄니랑, 뱀사골 광대섯)은 한 줄로
"use strict";
(() => {
  const S = DATA.spawns, RW = ["아주 드묾", "드묾", "가끔", "흔함"];
  const add = (z, e) => { if (S[z] && MON[e.k] && !S[z].some(x => x.k === e.k && x.t === e.t)) S[z].push(e); };
  add("1번도로", { k: "sojjeokmi", lv: "2–5", t: "밤", r: "가끔" });          // 밤 들길의 소쩍새(실제 게임 1번도로 밤의 부엉이처럼)
  add("광한루원", { k: "bakjumi", lv: "5–7", t: "밤", r: "드묾" });          // 밤 누각 처마의 박쥐
  add("바래봉", { k: "bueongdaegam", lv: "45–49", t: "밤", r: "가끔" });
  add("바래봉", { k: "malgupju", lv: "45–48", t: "밤", r: "가끔" });
  add("바래봉", { k: "seonrok", lv: "45–49", t: "저녁", r: "가끔" });
  add("미색마을", { k: "bueongdaegam", lv: "38–41", t: "밤", r: "가끔" });
  add("미색마을", { k: "dochaedong", lv: "38–40", t: "밤", r: "드묾" });     // 흥부 마을 밤의 도깨비
  add("16번도로", { k: "boeunbi", lv: "46–50", t: "낮", r: "가끔" });         // 보절 들판의 제비
  // 같은 곳·같은 시간·같은 종 두 줄 → 한 줄(더 자주 나오는 쪽, 레벨은 넓게)
  const rng = s => String(s).split(/[–~-]/).map(Number).filter(v => !isNaN(v));
  for (const z in S) {
    const out = [];
    for (const e of S[z]) {
      const o = out.find(x => x.k === e.k && (x.t || "모두") === (e.t || "모두"));
      if (!o) { out.push(e); continue; }
      const a = rng(o.lv).concat(rng(e.lv)), lo = Math.min(...a), hi = Math.max(...a);
      o.lv = lo === hi ? "" + lo : lo + "–" + hi;
      if (RW.indexOf(e.r) > RW.indexOf(o.r)) o.r = e.r;
    }
    S[z] = out;
  }
})();

// 2) 기술·특성 설명에 남아 있던 '포켓몬'(공식 설명을 옮겨 온 것) → '남켓몬' (기술 설명·특성 풀이 화면에 그대로 보였음)
(() => { for (const T of [MV, AB, ITEMS]) for (const k in T) { const v = T[k]; if (v && typeof v.d === "string" && v.d.includes("포켓몬")) v.d = v.d.replace(/포켓몬/g, "남켓몬"); } })();

// 3) 지도 사람 말에 남아 있던 '(플레이 버전은 …)' 쪽 지우기 — 뱀사골 위 지킴이가 "반야봉은 다음에 열려요"라고 하던 것(지금은 이어서 열림)
(() => { for (const id in MAPS) for (const n of MAPS[id].npcs || []) if (typeof n.talk === "string" && n.talk.includes("플레이 버전")) {
  const t = n.talk.split("\f").filter(p => !p.includes("플레이 버전")).join("\f"); if (t) n.talk = t; } })();

// 4) 자동 리포트(설정에서 끌 수 있음, 기본 켬) — 교실 태블릿에서 창을 닫거나 다른 앱으로 가면 진행이 사라지던 불편
//    밖을 걷는 중(사건·배틀·메뉴가 아닐 때)에만: 1분마다(걸었으면) · 창이 가려질 때 · 페이지를 떠날 때
//    다른 게임의 리포트(트레이너 번호가 다름)는 덮어쓰지 않음 — '처음부터'를 잘못 눌러도 옛 리포트가 지켜짐(손으로 리포트를 쓰면 그때부터)
(() => {
  const same = () => { const d = Save.read(); return !d || !d.G || d.G.id === G.id; };
  const idle = () => Save.opt.autosave && Scenes.top() === World && World.busy === 0 && !(typeof BT !== "undefined" && BT) && G.party && G.party.length > 0 && World.player && G.map;
  let last = -1;
  const auto = () => { try { if (!idle() || !same()) return false; if (Save.write(saveData())) { last = G.steps; window.__autoSaved = (window.__autoSaved || 0) + 1; return true; } } catch (e) {} return false; };
  window.autoReport = auto;
  document.addEventListener("visibilitychange", () => { if (document.hidden) auto(); });
  addEventListener("pagehide", auto);
  setInterval(() => { if (G.steps !== last) auto(); }, 60000);
})();

// 5) 사건 전 서 있는 사람(본디회 단원·행수·한결 등)에게 먼저 말을 걸면 아무 반응이 없던 것 → 그 지도에서 지금 일어날 사건을 바로 시작(실제 게임처럼 말 걸어도 사건)
(() => {
  for (const id in MAPS) { const M = MAPS[id];
    for (const n of M.npcs || []) {
      if (n.item || n.trainer || n.special || (n.talk !== undefined && n.talk !== null && n.talk !== "")) continue;
      n.talk = async (a) => {
        // 가까운 사건만(사람 둘레 8칸 안에 닿는 구역) — 큰 바깥 지도에서 먼 곳 사건이 시작되지 않게
        const d = ar => Math.hypot(Math.max(ar.x0 - a.x, 0, a.x - ar.x1), Math.max(ar.y0 - a.y, 0, a.y - ar.y1));
        const D = MAPS[G.map] || {}, all = (D.areas || []).concat((D.triggers || []).map(t => ({ x0: t.x, x1: t.x, y0: t.y, y1: t.y, cond: t.cond, run: t.run })));
        const L = all.filter(ar => ar.run && (!ar.cond || ar.cond()) && d(ar) <= 8);
        if (!L.length) { await say("……"); return; }
        L.sort((p, q) => d(p) - d(q)); await L[0].run();
      };
      n.talk.evTalk = true;          // 사건 사람(마음에 남는 대사 셈에서는 빼는 '사건 때만 서 있는 사람')
    }
  }
})();
