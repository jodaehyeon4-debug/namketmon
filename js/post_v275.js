// ===== v2.75 포스트게임 「용성 다섯 자리」 — 엔딩 뒤 약 2시간(전설·환상 포획 이벤트를 '단서 → 준비 → 연출 → 포획'으로) =====
// 사용자(2026-11-15): "챔피언 이긴다고 끝이 아니라는 식으로, 플레이타임 2시간정도 더 … 특히 전설/환상 포획 이벤트"
// 기획: pipeline/namketmon-postgame/01_plan.md (1단계 Sonnet). 실제 포켓몬처럼 묘사 — 엔딩 뒤 새 목표·전설 이벤트의 '구조만', 닌텐도 그림·문구는 베끼지 않음
// 방식: 앞 장 파일은 건드리지 않고 감싸기·재할당. 대사는 모두 post_text_v275.js의 PG_TEXT(번호)에서만(기존 함수가 하는 말은 그대로)
//  · 별돌의 다섯 갈래 실(다홍 연구소) → 남(오작교 홍우성) · 북(섬진강 금섬) · 가운데(바래봉 노고마) · 동(구룡계곡 천미르) · 서(반야봉 숲 호령산) 아무 순서로
//  · 도장 다섯 → 오방고원 오방기 '다섯 자리 이음' → 반야봉 정상 아침 운해룡 → 만복사지 밤 복나비 → 에필로그 → 자유 모험(+ 오작교 지킴이 시합)
//  · 전설·준전설은 의식 뒤 포획률 22(놓칠 때마다 +6, 최대 40) — 동행볼(3배)·옥볼로 평균 4~6개(v2.73 '50개 던져도 안 잡힘' 재발 방지). 이미 잡았으면 '다시 만남'과 도장만
//  · 도장은 의식을 끝까지 본 순간 찍힘(못 잡아도 장은 끝남). 새 깃발은 모두 pg_ 접두. 기존 *_caught·*_rest 깃발은 이름·뜻 그대로
//  · 관장은 나오지 않음 · 전주 시내는 열지 않음 · 새 그림 없음(legendSprite·캔버스 그리기) · 날씨에 묶지 않음(시각은 운해룡 아침·복나비 밤만, pgWaitFor로 바로 풀림)
// menu_v275.js 뒤, main.js 앞에 읽힘(post_text_v275.js 바로 뒤)
"use strict";
(function postV275() {
  if (typeof PG_TEXT === "undefined") return;
  const F = k => G.flag(k);
  const PG = () => typeof postGame === "function" && postGame();
  const pgOn = () => PG() && F("pg_map");
  const SITES = ["south", "north", "mid", "east", "west"];
  const PLACE = { south: "gwanghanru", north: "seomjin", mid: "baraebong", east: "guryong", west: "banya" };
  const CF = { honguseong: "hongu_caught", geumseom: "geumseom_caught", nogoma: "nogoma_caught", horyeongsan: "horyeong_caught", unhaeryong: "unhae_caught", boknabi: "boknabi_caught" };
  const PK = { honguseong: "hongu", geumseom: "geumseom", nogoma: "nogoma", cheonmireu: "cheonmireu", horyeongsan: "horyeong", unhaeryong: "unhae", boknabi: "boknabi" };
  const had = k => !!(G.caught && G.caught[k]) || !!(CF[k] && F(CF[k]));         // 이미 함께한 적 있음(도감 · 기존 포획 깃발) → '다시 만남'
  // 5단계 F2: 이미 함께한 자리도 도장 전에는 단서 → 세 곳 찾기·물음·시련 → 의식을 그대로 하고, 마지막 배틀 자리에서만 '다시 만남'(P30)으로 바꿈.
  //  done = 이미 함께했고 도장도 찍힘 → 예전처럼(기존 대사·기존 함수). 중복 포획 없음(had면 pgWild를 부르지 않음)
  const done = (k, s) => had(k) && stamped(s);
  // 도감에만 있고 기존 포획 깃발이 없는 저장에서 본편 함수(toadRock 등)가 야생 배틀을 다시 열지 않게: 깃발이 없으면 다시 만남 글만
  const oldOr = (k, fn) => CF[k] && !F(CF[k]) ? pgSay("P30_" + PK[k]) : fn();
  const dexN = () => Object.keys(G.caught || {}).length;
  const night = () => typeof timeOfDay === "function" && ["저녁", "밤"].includes(timeOfDay());
  const morning = () => typeof timeOfDay === "function" && timeOfDay() === "아침";
  const cry = k => { try { Audio2.cry(k); } catch (e) {} };
  const bits = k => G.flags[k] | 0, setBit = (k, i) => { G.flags[k] = bits(k) | (1 << i); }, nBits = v => (v & 1) + ((v >> 1) & 1) + ((v >> 2) & 1);

  // ---------------------------------------------------------------- 글
  function txt(id, vars, from, to) {
    const a = PG_TEXT[id]; if (!a || !a.length) return null;
    let s = a.slice(from || 0, to == null ? a.length : to).join("\f");
    if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
    return s || null;
  }
  async function pgSay(id, vars, from, to) { const s = txt(id, vars, from, to); if (s) await say(s); }
  const askYes = async id => (await ask(txt(id), ["예", "아니오"])) === 0;

  // ---------------------------------------------------------------- 도구: 자리 지도(키) · 동행볼
  ITEMS.jari_map = { n: PG_UI.jari_map.n, p: "key", ic: "landdoc", d: PG_UI.jari_map.d, read: () => show(new PgMapBook()) };
  ITEMS.dongbol = { n: PG_UI.dongbol.n, p: "ball", price: 0, nobuy: 1, ball: 3, ic: "ball_ok", d: PG_UI.dongbol.d };
  function ballAlias() {                       // 동행볼 그림 = 옥볼 그림(새 그림 없음)
    const B = typeof JSN !== "undefined" && JSN.balls; if (!B || !B.keys || B.keys._pg) return;
    const io = B.keys.indexOf; B.keys.indexOf = function (k, ...a) { return io.call(this, k === "dongbol" ? "ok" : k, ...a); }; B.keys._pg = true;
  }

  // ---------------------------------------------------------------- 도장
  const stamped = s => !!G.flags["pg_s_" + s];
  const stampN = () => SITES.filter(stamped).length;
  const leftNames = () => SITES.filter(s => !stamped(s)).map(s => PG_UI.short[s]).join("·");
  function pgStamp(s) { if (!G.flags["pg_s_" + s]) G.flags["pg_s_" + s] = 1; }        // 1 = 찍힘(알림 전) · 2 = 알림까지 끝
  async function pgPending() {                 // 배틀 중 창을 닫았어도 다음에 알림·선물을 받음
    for (const s of SITES) if (G.flags["pg_s_" + s] === 1) {
      G.flags["pg_s_" + s] = 2;
      try { sfx("select"); } catch (e) {}
      await pgSay("PS_" + s);
      await getItem("yeot", 2); await getItem("dongbol", 2);
    }
  }

  // ---------------------------------------------------------------- 포획: 의식 뒤 포획률을 잠깐 올림(fix_v273 방식, finally로 되돌림)
  async function pgWild(k, lv, bg) {
    const m = MON[k], c0 = m.cr, key = "pg_pity_" + (PK[k] || k), p = G.flags[key] | 0;
    if (c0 < 40) m.cr = Math.min(40, 22 + 6 * p);
    let r;
    try { r = await startWild(k, lv, bg); } finally { m.cr = c0; }
    if (r !== "caught") G.flags[key] = p + 1;          // 놓치거나 쓰러뜨리면 다음엔 조금 더 잘 들어옴
    return r;
  }
  async function pgMissed(k, r) { if (r === "lose") return; await pgSay("P31_" + PK[k]); await pgSay("P31t"); }   // 져서 집·센터로 옮겨진 뒤에는 말하지 않음(4단계 검토)

  // ---------------------------------------------------------------- 연출 오버레이(지도 위 · 글상자 아래)
  let PGFX = null, fxOv = null;
  const COL5 = { east: "#3a8ae8", south: "#e84a3a", mid: "#f0c840", west: "#f4f4f4", north: "#3a3a58" };
  function pgFx(k, o = {}) {
    PGFX = Object.assign({ k, t: 0 }, o);
    if (fxOv && Scenes.st.includes(fxOv)) return;
    const ov = fxOv = new Overlay(() => {
      if (!PGFX) { setTimeout(() => { const i = Scenes.st.indexOf(ov); if (i >= 0) Scenes.st.splice(i, 1); }, 0); return; }
      try { drawFx(PGFX); } catch (e) {}
    });
    const i = Scenes.st.indexOf(World); if (i >= 0) Scenes.st.splice(i + 1, 0, ov); else Scenes.push(ov);
  }
  const pgFxOff = () => { PGFX = null; Screen.shakeX = 0; };
  const tileXY = (x, y) => { const c = World.cam || [0, 0]; return [x * TS - c[0] + 8, y * TS - c[1] + 8]; };
  function drawFx(F_) {
    const t = ++F_.t;
    if (F_.k === "threads") {                  // 별돌에서 다섯 갈래 빛실이 화면 끝으로
      const cx = F_.x != null ? F_.x : SW / 2, cy = F_.y != null ? F_.y : SH / 2 - 10, k = Math.min(1, t / 50);
      const ends = { east: [SW + 4, cy - 20], south: [cx + 30, SH + 4], west: [-4, cy + 10], north: [cx - 20, -4] };
      g.lineWidth = 2;
      for (const s of ["east", "south", "west", "north"]) {
        const [ex, ey] = ends[s]; g.strokeStyle = s === "north" ? "#8a8ab8" : COL5[s]; g.globalAlpha = 0.85; g.beginPath(); g.moveTo(cx, cy);
        for (let i = 1; i <= 16; i++) { const q = i / 16 * k; g.lineTo(cx + (ex - cx) * q + Math.sin(t / 7 + i) * 2, cy + (ey - cy) * q + Math.cos(t / 9 + i) * 2); }
        g.stroke();
      }
      g.globalAlpha = 0.5 + 0.3 * Math.sin(t / 6); g.strokeStyle = COL5.mid; g.beginPath(); g.arc(cx, cy, 6 + 4 * k + Math.sin(t / 8) * 2, 0, Math.PI * 2); g.stroke();
      g.globalAlpha = 1; g.lineWidth = 1; rect(cx - 1, cy - 1, 3, 3, "#ffffff");
    } else if (F_.k === "five") {              // 다섯 빛이 하늘로
      const k = Math.min(1, t / 60), xs = [56, 92, 128, 164, 200], cs = ["east", "south", "mid", "west", "north"];
      xs.forEach((x, i) => { const top = SH - SH * 1.1 * k; g.globalAlpha = 0.35 + 0.15 * Math.sin(t / 5 + i); g.fillStyle = COL5[cs[i]] === "#3a3a58" ? "#8a8ab8" : COL5[cs[i]];
        g.fillRect(x - 3 + (128 - x) * k * 0.6, Math.max(-10, top), 6, SH); });
      g.globalAlpha = 1;
      for (let i = 0; i < 18; i++) { const x = (i * 47 + t * 2) % SW, y = SH - ((i * 31 + t * 3) % SH); rect(x, y, 1, 1, i % 5 === 0 ? "#ffe890" : "#ffffff"); }
    } else if (F_.k === "ripple") {            // 동그란 물결
      const [x, y] = F_.tx != null ? tileXY(F_.tx, F_.ty) : [SW / 2, SH / 2];
      g.strokeStyle = "#e8f6ff"; g.lineWidth = 1;
      for (let i = 0; i < 4; i++) { const r = ((t + i * 18) % 72) * 0.8; g.globalAlpha = Math.max(0, 1 - r / 58) * 0.9; g.beginPath(); g.ellipse(x, y + 4, r, r * 0.45, 0, 0, Math.PI * 2); g.stroke(); }
      g.globalAlpha = 1;
    } else if (F_.k === "dust") {              // 땅울림 · 흙먼지
      Screen.shakeX = t < 50 ? (t % 4 < 2 ? 3 : -3) : 0;
      for (let i = 0; i < 28; i++) { const x = (i * 37 + Math.sin(t / 9 + i) * 6) % SW, y = SH - ((i * 23 + t * (1 + i % 3)) % (SH * 0.7)); g.globalAlpha = 0.5; rect(x, y, 2, 2, i % 2 ? "#a88a60" : "#c8b088"); }
      g.globalAlpha = 1;
    } else if (F_.k === "mist") {              // 안개(차차 걷힘)
      const a = F_.clear ? Math.max(0, 0.45 - (t - F_.clear) / 90) : Math.min(0.45, t / 60);
      for (let i = 0; i < 6; i++) { g.globalAlpha = a * (0.6 + 0.4 * Math.sin(t / 30 + i)); g.fillStyle = "#f0f6fa"; g.beginPath(); g.ellipse(((i * 70 + t * (0.4 + i * 0.1)) % (SW + 120)) - 60, 30 + i * 26, 70, 12, 0, 0, Math.PI * 2); g.fill(); }
      g.globalAlpha = 1;
    } else if (F_.k === "leaf") {              // 붉은 낙엽
      for (let i = 0; i < 22; i++) { const x = (i * 41 + Math.sin(t / 15 + i) * 10 + t * 0.5) % SW, y = (i * 29 + t * (0.8 + (i % 4) * 0.3)) % SH; rect(x, y, 3, 2, ["#d8502a", "#e88a2a", "#b83a20"][i % 3]); }
    } else if (F_.k === "gold") {              // 금빛 가루
      for (let i = 0; i < 26; i++) { const x = (i * 53 + Math.sin(t / 12 + i) * 8) % SW, y = (i * 19 + t * (0.4 + (i % 3) * 0.2)) % SH; if ((t >> 2) + i & 1) rect(x, y, 1, 1, i % 4 ? "#f0d060" : "#ffffff"); }
      const k = Math.min(1, t / 40), cs = ["east", "south", "mid", "west", "north"];
      if (F_.five && t < 120) cs.forEach((c, i) => { g.globalAlpha = (1 - t / 120) * 0.7; rect(0, 60 + i * 6, SW * k, 2, COL5[c] === "#3a3a58" ? "#8a8ab8" : COL5[c]); });
      g.globalAlpha = 1;
    }
  }
  async function flashOnce(col = "#ffffff", n = 18) { Screen.flashCol = col; for (let i = n; i >= 0; i--) { Screen.flash = i / n; await frames(1); } Screen.flash = 0; }

  // ---------------------------------------------------------------- 지도 위 표시(소리 나는 갈대 · 살필 물가 · 발자국)
  const REEDS = [[5, 17], [6, 4], [39, 17]];          // 섬진강 나루 갈대밭 세 곳(서쪽 아래 · 서쪽 위 · 동쪽)
  const SPOTS = [[12, 9], [20, 10], [27, 9]];         // 구룡계곡 소 둘레 물가 세 곳
  const TRACKS = [[26, 34], [31, 32], [36, 29]];      // 반야봉 구상나무 숲 발자국(→ 호령산 39,28)
  function sparkle(cx, cy, x, y, col) {
    const sx = x * TS - cx, sy = y * TS - cy, b = (FRAME >> 3) & 3;
    if (sx < -16 || sy < -16 || sx > SW || sy > SH) return;
    rect(sx + 7, sy + 2 + b, 2, 2, col); rect(sx + 3, sy + 7, 1, 1, col); rect(sx + 12, sy + 6 - (b & 1), 1, 1, "#ffffff");
  }
  function footprint(cx, cy, x, y, fresh) {
    const sx = x * TS - cx, sy = y * TS - cy; if (sx < -16 || sy < -16 || sx > SW || sy > SH) return;
    g.globalAlpha = fresh ? 0.75 : 0.35; const c = "#4a3420";
    for (const [ox, oy] of [[2, 3], [9, 8]]) { rect(sx + ox + 1, sy + oy + 2, 4, 3, c); rect(sx + ox, sy + oy, 1, 1, c); rect(sx + ox + 2, sy + oy - 1, 1, 1, c); rect(sx + ox + 4, sy + oy - 1, 1, 1, c); rect(sx + ox + 6, sy + oy, 1, 1, c); }
    g.globalAlpha = 1;
  }
  const overOn = (id, fn) => { const D = MAPS[id]; if (!D) return; const o = D.over; D.over = function (cx, cy) { if (o) o.call(this, cx, cy); try { fn(cx, cy); } catch (e) {} }; };
  overOn("seomjin", (cx, cy) => { if (!pgOn() || !F("pg_c_north") || stamped("north")) return; REEDS.forEach(([x, y], i) => { if (!(bits("pg_n_ear") >> i & 1)) sparkle(cx, cy, x, y, "#c8e8ff"); }); });
  overOn("guryong", (cx, cy) => { if (!pgOn() || !F("pg_c_east") || stamped("east")) return; SPOTS.forEach(([x, y], i) => { if (!(bits("pg_n_quiz") >> i & 1)) sparkle(cx, cy, x, y, "#a8f0ff"); }); });
  overOn("banya", (cx, cy) => { if (!pgOn() || !F("pg_c_west") || done("horyeongsan", "west")) return; TRACKS.forEach(([x, y], i) => footprint(cx, cy, x, y, !(bits("pg_n_track") >> i & 1))); });

  // ---------------------------------------------------------------- 필드 사람·전설을 그 자리에서 세우기(지도를 다시 들어오지 않아도)
  function pgSpawn(id) {
    const ex = act(id); if (ex) { ex.hidden = false; return ex; }
    const o = (World.def.npcs || []).find(n => n && n.id === id); if (!o) return null;
    const a = new Actor({ ...o, x: o.x, y: o.y, spr: o.spr || "man", dir: o.dir || "down", move: o.move || "still" }); World.actors.push(a); return a;
  }
  const LIVE = ["by_horyeong", "mb_boknabi", "pg_cheon"];
  function pgRefresh() {
    if (!World.def) return;
    for (const id of LIVE) { const o = (World.def.npcs || []).find(n => n && n.id === id); if (o && !act(id) && o.show && o.show()) pgSpawn(id); }
  }
  const dropAct = id => { const i = World.actors.findIndex(a => a.id === id); if (i >= 0) World.actors.splice(i, 1); };

  // ---------------------------------------------------------------- 시각 기다리기(운해룡 아침 · 복나비 밤) — 회중시계와 같은 게임 시계
  async function pgWaitFor(tod) {
    if (tod === "아침" ? morning() : night()) return true;
    if (!(await askYes(tod === "아침" ? "P06b" : "P06c"))) return false;
    await fadeOut(16);
    G.clock = { mode: "game", min: tod === "아침" ? 6 * 60 : 21 * 60 };
    await fadeIn(16);
    await pgSay(tod === "아침" ? "P06d" : "P06e");
    pgRefresh();
    return true;
  }

  // ---------------------------------------------------------------- 시련 트레이너(여울·솔뫼 — 본디 자리 지킴이) · 오작교 지킴이 시합
  const trainer = (id, name, spr, team, k) => ({ id, cls: "본디 자리 지킴이", name, spr, base: 40, bgm: "trainer", canLose: true,
    intro: txt(k + "ti"), lose: txt(k + "tl"), loseText: txt(k + "tw"), team });
  const TR_YEOUL = () => trainer("pg_yeoul", "여울", "yeoul", [["ssogalbeom", 62], ["chamjipwang", 63], ["megijang", 64]], "P10");
  const TR_SOLMOE = () => trainer("pg_solmoe", "솔뫼", "solmoe", [["jiriam", 62], ["maetdolmet", 63], ["bandaljanggun", 64]], "P20");
  async function trial(A, T) {
    const r = await trainerBattle({ x: A ? A.x : 0, y: A ? A.y : 0, dir: A ? A.dir : "down", trainer: T }, false);
    G.healAll(); await Audio2.jingle("jg_heal");
    return r === "win";
  }

  // ================================================================ 0. 엔딩 끝: 엄마 덧줄 · 마지막 안내 문구(딱 두 곳)
  const MOM_LAST = "엄마: 참, 오작교에서 만난 가람이가\n한 판 겨뤄 보고 싶대.\f윤슬 박사님도 전설 남켓몬\n소문을 들었다더라.";
  const END_LAST = "(이야기는 여기서 끝이지만\n모험은 계속돼요!\f오방고원 리그에 다시 도전하거나\n도감을 채워 보세요.)";
  const sayIn = say;
  say = function (text, opt) {
    const key = String(text);
    if (key === MOM_LAST) return (async () => { const v = await sayIn(text, opt); await sayIn(txt("P01")); return v; })();
    if (key === END_LAST) return (async () => {
      G.flag("pg_note", true);                         // 엔딩 안내를 직접 본 저장은 옛 저장 안내(F3)가 필요 없음
      const v = await sayIn(txt("P02"), opt);
      // story_v264가 이 줄 뒤에 붙이던 '오작교 반쪽' 안내(원문 그대로) — 줄을 바꾸면 그 뒤붙임이 안 불리므로 여기서 같은 글을 이어 말함
      if (G.flags.bridge === 2 && window.STORY_V264) await sayIn(`(오작교는 아직 반쪽이에요.\f정표와 칠로 어른들의 이야기를\n${STORY_V264.BR_NEED}가지 넘게 모아\f오작교의 가람에게 가면\n다리가 마저 놓여요.)`);
      return v; })();
    return sayIn(text, opt);
  };

  // ================================================================ 1. 연구소: 별돌의 다섯 갈래 실 · 자리 지도
  async function pgLabStart() {
    const Y = act("yunseul"); if (Y) face(Y, World.player);
    await pgSay("P03", null, 0, 2);
    try { sfx("chime"); } catch (e) {}
    const [x, y] = Y ? tileXY(Y.x, Y.y + 1) : [SW / 2, SH / 2];
    pgFx("threads", { x, y: y - 6 }); await flashOnce("#fff8d0", 14);
    await frames(40);
    await pgSay("P03", null, 2);
    pgFxOff();
    await pgSay("P04");
    G.flag("pg_map", true);
    await getItem("jari_map");
    await getItem("dongbol", 5);
    if (!G.has("tm54")) await getItem("tm54");
  }
  { const LAB = MAPS.lab, Y = LAB && LAB.npcs.find(n => n.id === "yunseul");
    if (Y) { const t0 = Y.talk; Y.talk = async (...a) => { if (PG() && !F("pg_map")) return pgLabStart(); return typeof t0 === "function" ? t0(...a) : say(t0); }; }
    const A = LAB && LAB.npcs.find(n => n.id === "aide");                                  // 누룽지 분실 구제
    if (A) { const t0 = A.talk; A.talk = async (...a) => {
      if (pgOn() && F("pg_c_mid") && !stamped("mid") && !hasNurungji()) { await pgSay("P14n"); await getItem("nurungji"); return; }
      return typeof t0 === "function" ? t0(...a) : say(t0); }; } }

  // 윤슬 박사 재방문(다홍 연구소·오방고원 둘 다 chapter29가 legendRumor를 부름)
  legendRumor = async function () {
    if (!F("pg_map")) { await pgSay("P05a"); return; }
    await pgPending();
    await pgMaybeEpilogue();
    const n = stampN();
    if (F("pg_all")) { await pgSay("P05e"); return; }
    if (n === 0) await pgSay("P05h");
    else if (n < 5) await pgSay(n <= 2 ? "P05b" : "P05c", { left: leftNames() });
    else if (!F("pg_five")) await pgSay("P05d");
    else if (!F("pg_sky_done")) await pgSay("P05f");
    else await pgSay("P05g");
    const b = G.bag.dongbol | 0;
    if (b < 3) { await pgSay("P06a"); await getItem("dongbol", 5 - b); }
    if (F("pg_five") && !F("pg_sky_done")) await pgWaitFor("아침");
    else if (F("pg_five") && !F("pg_moth_done")) await pgWaitFor("밤");
  };

  // ================================================================ 2. 남: 광한루원 오작교 — 가람의 시련 → 칠석 밤하늘 → 홍우성
  async function pgRematch(GR) {
    if (!(await askYes("P29q"))) { await pgSay("P29n"); return; }
    const top = Math.max(70, ...G.party.map(m => m.lv));
    const lv = Math.min(80, top);
    const T = Object.assign({}, GARAM6, { id: "pg_garam", base: 10, intro: txt("P29ti"), lose: txt("P29tl"), loseText: txt("P29tw"),
      team: GARAM6.team.map(([k, l], i) => [k, Math.min(80, lv - 2 + Math.min(2, i))]) });
    await trial(GR, T);
  }
  garamPost = async function () {             // chapter29 오작교 가람(story_v264 인사 뒤에 불림) — 전역 이름을 바꿔 끼움
    const P = World.player, GR = act("end_garam"); if (GR) face(GR, P);
    if (!F("pg_map")) { await pgSay("P07w"); return; }
    await pgPending();
    await pgMaybeEpilogue();
    // 5단계 F4: 은직성이 파티에도 상자에도 없으면(놓아줌) 은직성 없이 의식을 진행 — 상자에만 있으면 데려오라고 안내(예전 그대로)
    const ejParty = G.party.some(m => m.k === "eunjikseong");
    const ejGone = !ejParty && !(typeof PCB !== "undefined" && PCB.all().some(m => m && m.k === "eunjikseong"));
    if (F("pg_all") && (had("honguseong") || (!ejParty && !ejGone))) {      // 4단계 검토: 다 끝낸 뒤에도 놓친 홍우성은 은직성과 오면 다시 만남
      if (!stamped("south") && had("honguseong")) { await pgSay("P30_hongu"); pgStamp("south"); await pgPending(); return; }
      if (!had("honguseong")) await pgSay("P07n", null, 0, 1);
      return pgRematch(GR); }
    if (had("honguseong")) { if (!stamped("south")) { await pgSay("P30_hongu"); cry("honguseong"); pgStamp("south"); await pgPending(); } else await pgSay("P09", null, 1, 2); return; }
    const ej = G.party.find(m => m.k === "eunjikseong");
    if (!F("pg_c_south")) {
      const fut = window.STORY_V264 && STORY_V264.future ? STORY_V264.future() : "walk";
      await pgSay({ walk: "P07a", school: "P07b", mountain: "P07c" }[fut] || "P07a", null, 0, ej ? null : 1);   // Gemini 글: 둘째 상자는 은직성을 데려왔을 때만
      await pgSay("P07"); G.flag("pg_c_south", true);
    } else if (stamped("south")) await pgSay("P07r");
    if (!ej && !ejGone) { await pgSay("P07n"); return; }
    if (!stamped("south")) {
      if (!F("garam6_won")) { if (!(await trial(GR, GARAM6))) return; G.flag("garam6_won", true); }
      try { bgm("ojakgyo"); } catch (e) {}
      if (typeof endFx === "function") endFx("stars");
      await pgSay("P08", null, 0, 3);
      await frames(20);
      await pgSay("P08", null, 3, 4);
      if (ej) { cry("eunjikseong"); await frames(30); cry("honguseong");
        await pgSay("P08", null, 4, 5); }                 // '은직성과 홍우성이 서로를 부르듯' — 은직성이 없으면 이 상자만 건너뜀
      else { cry("honguseong"); await frames(30); }
      await flashOnce("#e8eeff", 16);
      pgStamp("south");
      await pgSay("P08", null, 5);
      try { END_FX = null; } catch (e) {}
    } else { cry("honguseong"); }
    G.healAll();
    const r = await pgWild("honguseong", 65, "grass");
    if (r === "caught") { G.flag("hongu_caught", true); hideAct("pe_hongu"); await pgSay("P09"); }
    else await pgMissed("honguseong", r);
    await pgPending();
  };

  // ================================================================ 3. 북: 섬진강 나루 — 여울 → 갈대밭 세 곳 → 여울 시련 → 두꺼비 바위 금섬
  const SJ = MAPS.seomjin;
  async function pgNorthRevisit() { await pgSay("P30_geumseom"); if (G.party.some(m => m.k === "geumseom")) cry("geumseom"); pgStamp("north"); await pgPending(); }
  if (SJ) {
    const YN = SJ.npcs.find(n => n.id === "sj_yeoul");
    if (YN) { const t0 = YN.talk; YN.talk = async (...a) => {
      if (!pgOn()) return typeof t0 === "function" ? t0(...a) : say(t0);
      const Y = act("sj_yeoul"); if (Y) face(Y, World.player);
      await pgPending();
      if (done("geumseom", "north")) return typeof t0 === "function" ? t0(...a) : say(t0);
      if (stamped("north")) { await pgSay("P10v"); return; }
      if (!F("pg_c_north")) { await pgSay("P10"); G.flag("pg_c_north", true); return; }
      if (bits("pg_n_ear") !== 7) { await pgSay("P10w"); return; }
      if (!F("pg_t_north")) { if (!(await trial(Y, TR_YEOUL()))) return; G.flag("pg_t_north", true); }
      await pgSay("P10v"); }; }
    SJ.triggers = (SJ.triggers || []).concat(REEDS.map(([x, y], i) => ({ x, y,
      cond: () => pgOn() && F("pg_c_north") && !stamped("north") && !(bits("pg_n_ear") >> i & 1),
      run: async () => {
        setBit("pg_n_ear", i); const n = nBits(bits("pg_n_ear"));
        pgFx("ripple", { tx: x, ty: y }); cry("geumseom");
        await pgSay(["P11a", "P11b", "P11c"][n - 1]);
        pgFxOff(); } })));
    async function pgToad() {
      if (!pgOn()) return toadRock();
      await pgPending();
      const hd = had("geumseom");
      if (hd && stamped("north")) return oldOr("geumseom", toadRock);
      if (!hd && F("geumseom_rest")) { await pgSay("P31r"); return; }
      if (!stamped("north") && !F("pg_t_north")) { await pgSay("P12x"); return; }
      G.healAll();
      if (!stamped("north")) {
        pgFx("ripple", { tx: 31.5, ty: 17 });
        await pgSay("P12", null, 0, 2);
        const A = pgSpawn("pg_geumseom");
        cry("geumseom"); await frames(24); cry("geumseom");
        await pgSay("P12", null, 2, 4);
        await fadeOut(6, "#a8d8f0"); await fadeIn(6, "#a8d8f0");
        cry("geumseom"); pgStamp("north");
        if (!hd) await pgSay("P12", null, 4);          // 이미 함께했으면 '함께 가자' 상자 대신 다시 만남
        pgFxOff(); if (A) dropAct("pg_geumseom");
      } else cry("geumseom");
      if (hd) return pgNorthRevisit();
      const r = await pgWild("geumseom", 60, "water");
      if (r === "caught") { G.flag("geumseom_caught", true); await pgSay("P13"); }
      else { G.flag("geumseom_rest", true); await pgMissed("geumseom", r); }
      await pgPending();
    }
    SJ.checks = (SJ.checks || []).map(c => c[2] === toadRock ? [c[0], c[1], pgToad] : c);
    SJ.npcs.push({ id: "pg_geumseom", x: 31, y: 17, dir: "down", move: "fixed", special: legendSprite("geumseom", 40), show: () => false, talk: pgToad });
  }

  // ================================================================ 4. 가운데: 바래봉 — 할머니의 노고 바위 이야기 → 누룽지 · 별돌 → 노고마
  const hasNurungji = () => G.has("nurungji") || G.party.some(m => m.item === "nurungji");
  function takeNurungji() { if (G.has("nurungji")) { G.take("nurungji"); return; } const m = G.party.find(m => m.item === "nurungji"); if (m) m.item = null; }
  const BR = MAPS.baraebong;
  async function pgMidRevisit() { await pgSay("P30_nogoma"); try { sfx("chime"); } catch (e) {} pgStamp("mid"); await pgPending(); }
  if (BR) {
    const GN = BR.npcs.find(n => n.id === "br_granny");
    if (GN) { const t0 = GN.talk; GN.talk = async (...a) => {
      if (!pgOn()) return typeof t0 === "function" ? t0(...a) : say(t0);
      await pgPending();
      if (stamped("mid")) return typeof t0 === "function" ? t0(...a) : say(t0);
      await pgSay("P14"); G.flag("pg_c_mid", true); }; }
    async function pgNogoma() {
      if (!pgOn()) return nogomaRock();
      await pgPending();
      const hd = had("nogoma");
      if (hd && stamped("mid")) return oldOr("nogoma", nogomaRock);
      if (!hd && F("nogoma_rest")) { await pgSay("P31r"); return; }
      if (!stamped("mid")) {
        if (!F("pg_c_mid")) { await pgSay("P14y"); return; }
        if (!hasNurungji()) { await pgSay("P14x"); return; }
        G.healAll();
        takeNurungji();
        await pgSay("P15", null, 0, 1);
        try { sfx("chime"); } catch (e) {} await fadeOut(6, "#ffffff"); await fadeIn(6, "#ffffff");
        await pgSay("P15", null, 1, 2);
        pgFx("dust"); try { sfx("fx_quake"); } catch (e) {}
        await pgSay("P15", null, 2, 4);
        cry("nogoma"); pgStamp("mid");
        if (!hd) await pgSay("P15", null, 4);
        pgFxOff();
      } else { G.healAll(); cry("nogoma"); }
      if (hd) return pgMidRevisit();
      const r = await pgWild("nogoma", 62, "grass");
      if (r === "caught") { G.flag("nogoma_caught", true); await pgSay("P16"); }
      else { G.flag("nogoma_rest", true); await pgMissed("nogoma", r); }
      await pgPending();
    }
    BR.checks = (BR.checks || []).map(c => c[2] === nogomaRock ? [c[0], c[1], pgNogoma] : c);
  }

  // ================================================================ 5. 동: 구룡계곡 — 낚시꾼 · 윤슬 쪽지 → 맑은 물 살피기 세 곳(물음 셋) → 천미르(새 이벤트)
  const GY = MAPS.guryong;
  async function pgEastRevisit() { await pgSay("P30_cheonmireu"); if (G.party.some(m => m.k === "cheonmireu")) cry("cheonmireu"); pgStamp("east"); await pgPending(); }
  async function pgQuiz(q) {                   // 틀려도 벌 없이 다시 고름
    const opts = PG_TEXT["P18o" + q] || [], labels = opts.map(s => s.replace(/^○/, "")), ans = opts.findIndex(s => s.startsWith("○"));
    for (let n = 0; n < 12; n++) {
      const i = await ask(txt("P18q" + q), labels);
      if (i === ans) { try { sfx("select"); } catch (e) {} await pgSay("P18a" + q); return true; }
      await pgSay("P18w");
    }
    return false;
  }
  async function pgEastBattle(first) {
    if (first) {
      pgFx("mist");
      await frames(30);
      await pgSay("P19", null, 0, 1);
      PGFX && (PGFX.clear = PGFX.t);
      pgSpawn("pg_cheon"); cry("cheonmireu");
      await pgSay("P19", null, 1);
      if (G.party.some(m => ["mireuni", "gyomireu", "cheonmireu"].includes(m.k))) { const m = G.party.find(m => ["mireuni", "gyomireu", "cheonmireu"].includes(m.k)); cry(m.k); await pgSay("P19b"); }
      pgStamp("east");
      pgFxOff();
      if (had("cheonmireu")) { await pgEastRevisit(); hideAct("pg_cheon"); return; }   // 5단계 F2: 이미 함께했으면 배틀 대신 다시 만남
    } else { pgSpawn("pg_cheon"); cry("cheonmireu"); }
    G.healAll();
    const r = await pgWild("cheonmireu", 62, "water");
    hideAct("pg_cheon");
    if (r === "caught") await pgSay("P19c");
    else { G.flag("pg_rest_cheonmireu", true); await pgMissed("cheonmireu", r); }
    await pgPending();
  }
  if (GY) {
    const FN = GY.npcs.find(n => n.id === "gr_fisher");
    if (FN) { const t0 = FN.talk; FN.talk = async (...a) => {
      if (!pgOn()) return typeof t0 === "function" ? t0(...a) : say(t0);
      await pgPending();
      if (done("cheonmireu", "east")) return typeof t0 === "function" ? t0(...a) : say(t0);
      if (stamped("east")) { await pgSay("P17", null, 0, 1); return; }
      await pgSay("P17"); G.flag("pg_c_east", true); }; }
    GY.triggers = (GY.triggers || []).concat(SPOTS.map(([x, y], i) => ({ x, y,
      cond: () => pgOn() && F("pg_c_east") && !done("cheonmireu", "east") && (!(bits("pg_n_quiz") >> i & 1) || (stamped("east") && !F("pg_rest_cheonmireu"))),
      run: async () => {
        await pgPending();
        if (bits("pg_n_quiz") >> i & 1) return pgEastBattle(false);              // 의식은 끝났고 놓친 뒤: 물가에 서면 다시 만남
        const q = nBits(bits("pg_n_quiz")) + 1;
        if (!(await pgQuiz(q))) return;
        setBit("pg_n_quiz", i);
        await fadeOut(6, "#c8f0ff"); await fadeIn(6, "#c8f0ff");
        if (bits("pg_n_quiz") === 7) await pgEastBattle(true);
        else await pgSay("P18x"); } })));
    GY.npcs.push({ id: "pg_cheon", x: 20, y: 7, dir: "down", move: "fixed", special: legendSprite("cheonmireu", 46),
      show: () => pgOn() && stamped("east") && !had("cheonmireu") && !F("pg_rest_cheonmireu"), talk: () => pgEastBattle(false) });
    const ol = GY.onLoad; GY.onLoad = function () { if (ol) ol.call(this); G.flag("pg_rest_cheonmireu", false); };
  }

  // ================================================================ 6. 서: 반야봉 구상나무 숲 — 솔뫼 → 발자국 세 곳 → 솔뫼 시련 → 호령산
  const BY = MAPS.banya;
  async function pgWestRevisit() { await pgSay("P30_horyeong"); if (G.party.some(m => m.k === "horyeongsan")) cry("horyeongsan"); pgStamp("west"); await pgPending(); }
  async function pgTiger() {
    const hd = had("horyeongsan");
    if (hd && stamped("west")) return;
    await pgPending();
    G.healAll();
    if (!stamped("west")) {
      await pgSay("P22", null, 0, 1);
      cry("horyeongsan");
      pgFx("leaf");
      for (let i = 0; i < 2; i++) { await fadeOut(5, "#c84a28"); await fadeIn(5, "#c84a28"); }
      pgStamp("west");
      await pgSay("P22", null, 1, hd ? 2 : null);    // 이미 함께했으면 '가로막았다' 상자 대신 다시 만남
      pgFxOff();
    } else cry("horyeongsan");
    if (hd) { await pgWestRevisit(); hideAct("by_horyeong"); return; }
    const r = await pgWild("horyeongsan", 64, "grass");
    hideAct("by_horyeong");
    if (r === "caught") { G.flag("horyeong_caught", true); await pgSay("P22c"); }
    else await pgMissed("horyeongsan", r);
    await pgPending();
  }
  async function pgAltar() {
    const hd = had("unhaeryong");
    if (hd && !(pgOn() && F("pg_five") && !F("pg_sky_done"))) return PG() ? oldOr("unhaeryong", unhaeAltar) : unhaeAltar();
    if (!PG()) return unhaeAltar();
    if (!F("pg_five")) { await pgSay("P26x"); return; }
    if (!hd && F("unhae_rest")) { await pgSay("P31r"); return; }
    if (!morning()) { await pgSay("P26n"); if (!(await pgWaitFor("아침"))) return; }
    G.healAll();
    if (!F("pg_sky_done")) {
      await pgSay("P26", null, 0, 1);
      LEGEND_FX = { t: 0 }; cry("unhaeryong");
      await frames(60);
      pgFx("five");
      await pgSay("P26", null, 1, 3);
      await pgSay("P26", null, 3);
      G.flag("pg_sky_done", true);
      pgFxOff(); LEGEND_FX = null;
      if (hd) { await pgSay("P30_unhae"); return pgMaybeEpilogue(); }     // 5단계 F2
    } else { LEGEND_FX = { t: 30 }; cry("unhaeryong"); await frames(40); LEGEND_FX = null; }
    const r = await pgWild("unhaeryong", 68, "grass");
    if (r === "caught") { G.flag("unhae_caught", true); await pgSay("P26c"); }
    else { G.flag("unhae_rest", true); await pgMissed("unhaeryong", r); }
    await pgMaybeEpilogue();
  }
  if (BY) {
    const SO = BY.npcs.find(n => n.id === "by_solmoe_after");
    if (SO) { const t0 = SO.talk; SO.talk = async (...a) => {
      if (!pgOn()) return typeof t0 === "function" ? t0(...a) : say(t0);
      const S = act("by_solmoe_after"); if (S) face(S, World.player);
      await pgPending();
      if (done("horyeongsan", "west")) return typeof t0 === "function" ? t0(...a) : say(t0);
      if (!F("pg_c_west")) { await pgSay("P20"); G.flag("pg_c_west", true); return; }
      if (bits("pg_n_track") !== 7) { await pgSay("P20w"); return; }
      if (!F("pg_t_west")) { if (!(await trial(S, TR_SOLMOE()))) return; G.flag("pg_t_west", true); pgRefresh(); }
      await pgSay("P20v"); }; }
    BY.triggers = (BY.triggers || []).concat(TRACKS.map(([x, y], i) => ({ x, y,
      cond: () => pgOn() && F("pg_c_west") && !done("horyeongsan", "west") && !(bits("pg_n_track") >> i & 1),
      run: async () => { setBit("pg_n_track", i); try { sfx("cursor"); } catch (e) {} await pgSay(["P21a", "P21b", "P21c"][nBits(bits("pg_n_track")) - 1]); } })));
    const HO = BY.npcs.find(n => n.id === "by_horyeong");
    if (HO) { HO.show = () => pgOn() && F("pg_t_west") && !done("horyeongsan", "west"); HO.talk = pgTiger; }
    BY.checks = (BY.checks || []).map(c => c[2] === unhaeAltar ? [c[0], c[1], pgAltar] : c);
  }

  // ================================================================ 7. 오방고원: 다섯 자리 이음 → 윤슬 '내일 아침 구름바다'
  async function pgFive() {
    if (!pgOn() || F("pg_five")) return false;
    await pgPending();
    if (stampN() < 5) { await pgSay("P23x"); return true; }
    const E = act("ob_elder"); if (E) face(E, World.player);
    await pgSay("P23");
    try { sfx("chime"); } catch (e) {}
    pgFx("five");
    await pgSay("P24", null, 0, 3);
    await flashOnce("#ffffff", 20);
    await pgSay("P24", null, 3, 5);
    if (G.party.some(m => /^(obangdam|cheongdam|jeokdam|hwangdam|baekdam|heukdam)$/.test(m.k))) { const m = G.party.find(m => /^(obangdam|cheongdam|jeokdam|hwangdam|baekdam|heukdam)$/.test(m.k)); cry(m.k); await pgSay("P24b"); }
    await pgSay("P24", null, 5);
    G.flag("pg_five", true);
    pgFxOff();
    await pgSay("P23c");
    const Y = act("ob_yunseul"); if (Y) face(Y, World.player);
    await pgSay("P25");
    await getItem("yeot", 3); await getItem("dongbol", 3);
    await pgWaitFor("아침");
    return true;
  }
  if (MAPS.obang) {
    const OE = MAPS.obang.npcs.find(n => n.id === "ob_elder");
    if (OE) { const t0 = OE.talk; OE.talk = async (...a) => { if (pgOn() && !F("pg_five") && stampN() >= 5) return pgFive(); await (typeof t0 === "function" ? t0(...a) : say(t0)); if (pgOn() && !F("pg_five")) await pgSay("P23x"); }; }
    MAPS.obang.checks = (MAPS.obang.checks || []).concat([[20, 13, async () => { if (!(await pgFive())) await pgSay("P24x"); }]]);
  }

  // ================================================================ 8. 흰 나비의 밤: 만복사지 — 해설사 → 저포 놀이 → 석탑 앞 복나비 → 에필로그
  const mothReady = () => pgOn() && F("pg_five") && dexN() >= 70 && (F("jeopo_first") || F("jeopo_played"));
  async function pgMoth() {
    await pgPending();
    if (!F("pg_moth_done")) {
      pgFx("gold", { five: true });
      await pgSay("P28", null, 0, 2);
      try { sfx("fx_wing"); } catch (e) {}
      await pgSay("P28", null, 2);
      cry("boknabi"); G.flag("pg_moth_done", true);
      pgFxOff();
    } else cry("boknabi");
    const r = await pgWild("boknabi", 62, "grass");
    hideAct("mb_boknabi");
    if (r === "caught") { G.flag("boknabi_caught", true); await pgSay("P28c"); }
    else await pgMissed("boknabi", r);
    await pgMaybeEpilogue();
  }
  async function pgMaybeEpilogue() {
    await pgPending();
    if (F("pg_all") || !F("pg_sky_done") || !F("pg_moth_done")) return;
    G.flag("pg_all", true);
    await fadeOut(20);
    await fadeIn(20);
    const nE = PG_TEXT.P29.length - 1;                // 마지막 상자(지킴이 시합 안내)는 선물 뒤에
    await pgSay("P29", null, 0, nE);
    await getItem("yeot", 5);
    await pgSay("P29", null, nE);
  }
  const MB = MAPS.manboksa;
  if (MB) {
    const BN = MB.npcs.find(n => n.id === "mb_boknabi");
    if (BN) { BN.show = () => mothReady() && !had("boknabi") && night(); BN.talk = pgMoth; }
    const GD = MB.npcs.find(n => n.id === "mb_guide");
    if (GD) { const t0 = GD.talk; GD.talk = async (...a) => {
      if (!pgOn() || !F("pg_five") || F("pg_moth_done")) return typeof t0 === "function" ? t0(...a) : say(t0);
      await pgPending();
      if (had("boknabi")) { await pgSay("P30_boknabi"); G.flag("pg_moth_done", true); return pgMaybeEpilogue(); }
      if (!F("pg_c_moth")) { await pgSay("P27"); G.flag("pg_c_moth", true); }
      else await pgSay("P27", null, 3, 4);
      if (dexN() < 70) { await pgSay("P27n"); return; }
      if (!night() && !(await pgWaitFor("밤"))) return;
      if (!(F("jeopo_first") || F("jeopo_played"))) { await pgSay("P27j"); return; }
      pgRefresh(); }; }
    // 저포 놀이를 하고 나면 그 자리에서 나비가 날아듦(지도를 다시 들어오지 않아도)
    MB.checks = (MB.checks || []).map(c => typeof c[2] === "function" && c[2] === (typeof jeopoGame === "function" ? jeopoGame : null) ? [c[0], c[1], async () => { await jeopoGame(); pgRefresh(); }] : c);
  }

  // ================================================================ 9. 모험 수첩 '지금 할 일'
  function pgGoal() {
    if (!PG()) return null;
    if (!F("pg_map")) return { k: "pg_start", t: PG_GOAL.start.t, where: PG_GOAL.start.where, place: "dahong", d: PG_GOAL.start.d };
    const n = stampN();
    if (n < 5) { const s = SITES.find(s => !stamped(s)), I = PG_GOAL.sites[s];
      return { k: "pg_five_" + n, t: `${PG_GOAL.fiveT} (${n}/5)`, where: I.where, place: PLACE[s], d: `${I.d} ${PG_GOAL.left}${leftNames()}. ${PG_GOAL.order}` }; }
    if (!F("pg_five")) return Object.assign({ k: "pg_obang", place: "obang" }, PG_GOAL.obang);
    if (!F("pg_sky_done")) return Object.assign({ k: "pg_sky", place: "banya" }, PG_GOAL.sky);
    if (!F("pg_moth_done")) return Object.assign({ k: "pg_moth", place: "manboksa" }, PG_GOAL.moth);
    return null;
  }
  if (typeof FREE_GOAL !== "undefined" && !FREE_GOAL.d.includes(PG_GOAL.freeAdd.trim())) FREE_GOAL.d += PG_GOAL.freeAdd;
  if (typeof goalNow === "function") { const g0 = goalNow; goalNow = function () { try { if (G.flag("ending_seen")) { const q = pgGoal(); if (q) return q; } } catch (e) {} return g0(); }; }

  // ================================================================ 10. 자리 지도 읽기(도장 현황)
  const pgSiteCap = s => (PG_UI.color ? PG_UI.color[s] + " · " : "") + PG_UI.short[s];
  class PgMapBook extends Modal {
    constructor() { super(); this.opaque = true; this.t = 0; }
    update(f) { this.t++; if (!f) return; if (Input.ok() || Input.cancel()) { sfx("cancel"); this.done(); } }
    draw() {                                   // 4단계 검토: 모험 수첩과 같은 틀(무늬 바탕 · panel · 아래 frame), '가운데' 글자가 눌리지 않게, B 닫기가 겹치지 않게
      bgPattern("#e8dcc0", "#efe5cc");
      rect(0, 0, SW, 20, "#5a3a20"); rect(0, 18, SW, 2, "#2a1a10");
      Font.draw(g, PG_UI.mapTitle, 8, 2, { col: "#fff4d8", sh: "#2a1a10" });
      Font.draw(g, `${PG_UI.stamp} ${stampN()}/5`, 248, 5, { font: "g9", col: "#ffe9a8", sh: null, align: "right" });
      panel(4, 22, 248, 134, "#fbf4e0", "#8a5a2a");
      const P = { north: [128, 39], west: [56, 83], mid: [128, 83], east: [200, 83], south: [128, 129] }, R = s => s === "mid" ? 18 : 13;
      rect(56 + 13, 83, 128 - 18 - 56 - 13, 1, "#c8b490"); rect(128 + 18, 83, 200 - 13 - 128 - 18, 1, "#c8b490");      // 서 — 가운데 — 동
      rect(128, 62, 1, 3, "#c8b490");                                                                                 // 북 — 가운데
      for (const s of SITES) {
        const [x, y] = P[s], on = stamped(s), c = COL5[s], r = R(s);
        g.fillStyle = on ? c : "#efe4c8"; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
        g.strokeStyle = on ? "#5a3a20" : "#a8906a"; g.lineWidth = on ? 2 : 1; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke(); g.lineWidth = 1;
        Font.draw(g, PG_UI.sites[s][0], x, y - 6, { font: "g9", fit: r * 2 - 4, col: on ? (s === "west" || s === "mid" ? "#3a2410" : "#ffffff") : "#6a5434", sh: null, align: "center" });
        Font.draw(g, pgSiteCap(s), x, y + r + 1, { font: "g9", fit: s === "west" || s === "east" ? 104 : 160, col: "#3a2410", sh: null, align: "center" });   // 5단계 F1: 방위가 아니라 오방색 자리임을 함께
      }
      panel(4, 157, 248, 16, "#fff6dc", "#8a5a2a");
      const A = [["five", F("pg_five")], ["sky", F("pg_sky_done")], ["moth", F("pg_moth_done")]];
      A.forEach(([k, on], i) => Font.draw(g, (on ? "● " : "○ ") + PG_UI.after[k], 10 + i * 81, 159, { font: "g9", fit: 76, col: on ? "#a03020" : "#6a5434", sh: null }));
      frame(2, 174, 252, 17);
      Font.draw(g, PG_UI.close, 10, 177, { font: "g9", col: "#2a5aa8", sh: null });
    }
  }

  // ---------------------------------------------------------------- 5단계 F3: 엔딩을 이미 본 옛 저장 — 처음 불러와 필드에 들어가면 한 번만 안내(pg_note)
  //  새로 엔딩을 보는 저장은 엔딩 끝 문구(P02)에서 pg_note를 남겨 이 안내가 뜨지 않음
  let noteDue = false;
  const noteNeed = () => G.flag("ending_seen") && !F("pg_map") && !F("pg_note");
  if (typeof loadData === "function") { const ld0 = loadData; loadData = function (...a) { const r = ld0.apply(this, a); try { noteDue = noteNeed(); } catch (e) {} return r; }; }
  async function pgNote() { G.flag("pg_note", true); try { sfx("select"); } catch (e) {} await pgSay("P05n"); }
  function pgNoteTick() {
    if (!noteDue) return;
    if (!noteNeed()) { noteDue = false; return; }
    if (Scenes.top() !== World || World.busy || !World.M || Screen.fade > 0.05) return;
    noteDue = false; World.run(pgNote);
  }

  // ---------------------------------------------------------------- 매 프레임: 동행볼 그림 · 지도 위 전설 세우기
  { const u0 = World.update; let n = 0;
    World.update = function (...a) { const r = u0.apply(this, a);
      try { if (++n % 30 === 0) { ballAlias(); if (Scenes.top() === World && !World.busy) pgRefresh(); pgNoteTick(); } } catch (e) {}
      return r; }; }

  window.POST_V275 = { pgSay, txt, pgWild, pgWaitFor, pgGoal, pgFive, pgStamp, pgPending, stampN, stamped, leftNames, had, pgFx, pgFxOff, pgRefresh, pgSpawn,
    REEDS, SPOTS, TRACKS, SITES, PgMapBook, pgNote, noteDue: () => noteDue, pgToad: SJ && SJ.checks.find(c => c[0] === 31 && c[1] === 17)[2], pgAltar, pgTiger, pgMoth, pgEastBattle, pgMaybeEpilogue, MOM_LAST, END_LAST };
})();
