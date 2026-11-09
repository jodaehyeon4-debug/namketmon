// ===== v2.60 스토리 더하기 — 변도진의 이유 · 가람의 밤 · 칠로 넷 · 잊힌 자리 · 이야기 조각 · 기념일 · 운해룡 특성 =====
// 사용자(2026-11-09): 스토리개선 3절 가운데 "6번 빼고 ㄱㄱ" + "운해룡 특성은 운해 깔고, 더 어드밴티지가 있으면 좋겠어. 운해+드래곤 기술 1.5배라든가"
// 1) 변도진의 이유(놀부의 그늘): 반야봉 뒤 미색마을에서 한지 어른이 옛일을 기억(쉰 해 전 박 밭 끝 초가의 아이 도진 — 오지 않는 박씨) → 출두 끝맺음에서
//    "박씨는 기다리는 게 아니라 심는 거란다" → 엔딩 뒤 미색 박 밭에서 박씨를 심는 변도진(화해 결말)
// 2) 가람의 밤: 출두 뒤 ~ 엔딩 전, 광한루원 오작교에 혼자 선 가람과 홍우성 · 흰 나비(복나비 복선) · "사람 쪽 다리는 누가 놓아?"(고르기) → 엔딩 대사로 이어짐
// 3) 칠로 넷: 상쇠(비색마을 투표 끝 — 풍물패, 농악 2014 유네스코) · 씨앗(갈매 들판 — 토종 씨앗, 덕과 1919 나무 심는 날) ·
//    훈장(덕과 아카데미 교실 — 이야기는 항아리 말고 아이들 귀에) · 대목(만복사지 앞 — 주춧돌, 대목장 2010 유네스코) → 출두에 함께 옴 · 풍물패가 길을 엶
// 4) 잊힌 자리 넷(운해룡 복선): 3번도로 불 꺼진 옹기 가마 · 서도역 승강장 · 감청마을 마른 우물 · 16번도로 옛 분교 운동장 — 옅은 안개 한 줄기가 맴돎
//    → 운해룡의 빈 몸속에 그 자리들이 비침 → 출두 뒤엔 사람들이 다시 찾음(옹이의 가마·낭독회·우물 치기·아이들 운동장)
// 5) 이야기 조각 넷: 혼불 원고 한 장(혼불문학관) · 숨 쉬는 사발(옹이 — 옹기) · 나무 심는 날(씨앗 어른 — 덕과) · 쇠부처님 이야기(실상사)
//    + 정표 여섯 = 열 가지 → 엔딩 뒤 '남원 이야기 지도'(타운맵 위에 꽂아 읽음) · 다 모으면 윤슬 박사 선물
// 6) 기념일: 3월 15일·4월 11일·4월 19일(실제 날짜)에 비색마을 사람들이 기념관에 모여 함께 묵념 · 투표 뒤엔 "이젠 혼자 오지 않아요"
// 7) 운해룡 특성 '운해': 등장하면 운해(5턴) + 운해 속에서 드래곤 기술 위력 1.5배(가이오가의 비처럼 날씨에 묶인 힘 — 바람으로 걷히면 사라짐)
// 사실: 농악 = 2014 유네스코 인류무형문화유산 / 대목장 = 2010 유네스코 인류무형문화유산 / 사물놀이 꽹과리·징·장구·북 = 천둥·바람·비·구름(흔히 쓰는 비유)
//   만복사 = 정유재란(1597) 때 불탐 / 실상사 = 828년 홍척, 구산선문 첫 절, 약사전 철불(chapter9 머리말과 같게) / 『혼불』 = 최명희 1980~1996, 17년(chapter2와 같게)
//   덕과 1919: 4월 덕과면에서 나무 심는 행사에 모인 사람들이 독립 만세(날짜는 '4월'까지만 — 사용자 확인 필요)
// story_v259 뒤에 읽힘
"use strict";
(function storyV260() {
  const F = k => G.flag(k);
  const BG = n => typeof hasBadge === "function" && hasBadge(n);
  const PG = () => typeof postGame === "function" ? postGame() : (G.flag("ending_seen") || G.flag("champion"));
  const hasI = id => !!(G.bag && G.bag[id]);
  const hide = id => { const a = act(id); if (a) a.hidden = true; };
  const wrapTalk = (map, find, fn, after) => { const M = MAPS[map]; if (!M) return null; const n = M.npcs.find(find); if (!n) return null;
    const t0 = n.talk, orig = (...args) => typeof t0 === "function" ? t0(...args) : t0 ? say(t0) : null;
    n.talk = after ? async (...args) => { await orig(...args); await fn(...args); }
      : async (...args) => { if (await fn(...args)) return; return orig(...args); };
    return n; };
  const near = a => { const P = World.player; return [[0, 1], [-1, 0], [1, 0], [0, -1]].map(([dx, dy]) => [P.x + dx, P.y + dy]).find(([x, y]) => !World.solidAt(x, y, a)) || [P.x, P.y + 1]; };
  async function popIn(a) { const P = World.player; if (!a) return; const [x, y] = near(a); a.x = x; a.y = y; a.hidden = false; face(a, P); face(P, a); }
  async function beat() {                                  // 꽹과리 가락: 깽매갱 깽!
    for (const w of [0, 130, 110, 240]) { if (w) await wait(w); sfx("fx_metal"); }
    sfx("gong"); await wait(200);
  }

  // ================================================================ 7) 운해룡 특성 '운해'
  const UNHAE_D = "등장하면 5턴 동안 운해를 깐다. 운해 속에서는 드래곤 기술의 위력이 1.5배가 되고, 자신은 안개 속에서도 잘 맞힌다.";
  if (DATA.abil && DATA.abil.unhae) DATA.abil.unhae.d = UNHAE_D;
  if (typeof AB !== "undefined" && AB && AB.unhae) AB.unhae.d = UNHAE_D;
  { const BP = Battle.prototype;
    BP.calc = (function (c0) {
      return function (a, d, mv, crit, mul) {
        let x = c0.call(this, a, d, mv, crit, mul);
        if (typeof x === "number" && mv && a && a.m && a.m.ab === "unhae" && mv.t === "드래곤" && typeof this.wx === "function" && this.wx() === "fog")
          x = Math.max(1, Math.floor(x * 1.5));
        return x;
      };
    })(BP.calc); }

  // ================================================================ 이야기 조각(아이템) · 남원 이야기 지도
  const SJ = [
    { id: "sj_honbul", n: "혼불 원고 한 장", place: "혼불문학관",
      d: "혼불문학관 해설사님이 준 원고지 한 장(본뜬 것). 작가가 17년 동안 칸칸이 채운 소설의 한 쪽이에요.",
      read: ["혼불 원고 한 장.\f작가가 손으로 쓴 원고지를\n그대로 본뜬 것이다.",
        "최명희 작가는 1980년부터\n1996년까지 17년 동안\f『혼불』을 썼다.",
        "일제 강점기 남원 사매면\n매안마을 사람들의 이야기다.",
        "'혼불'은 사람의 혼을 이루는\n바탕을 가리키는 우리말.\f옛사람들은 그것이 푸르스름한\n불빛을 띤다고 믿었다.",
        "사라져 가는 우리말과 풍속을\n원고지 칸칸이 붙잡아 둔 소설.\f글로 남긴 것은\n쉽게 잊히지 않는다."],
      hint: "혼불 원고는 쪽빛마을\n혼불문학관 해설사님께\f(반야봉에 다녀온 뒤)" },
    { id: "sj_sabal", n: "숨 쉬는 사발", place: "3번도로 옹기 가마",
      d: "옹이가 처음으로 '쓰려고' 구운 옹기 사발. 흙 사이 숨구멍으로 공기가 드나드는 숨 쉬는 그릇이에요.",
      read: ["숨 쉬는 사발.\f옹이가 처음으로 '쓰려고'\n구운 옹기 사발이다.",
        "옹기는 흙으로 빚어\n잿물을 입혀 구운 그릇.\f흙 사이 작은 숨구멍으로\n공기가 드나든다.",
        "그래서 김치·된장·간장처럼\n오래 익히는 음식을\f옹기에 담아 왔다.",
        "'그릇은 쓰라고 만드는 거다.'\f……닳는다는 건, 그만큼\n함께했다는 뜻이다."],
      hint: "숨 쉬는 사발은 3번도로\n옹기 가마의 옹이에게\f(만복사의 밤이 지난 뒤)" },
    { id: "sj_mansei", n: "나무 심는 날", place: "갈매마을(덕과) 들판",
      d: "씨앗 어른이 들려준 덕과 이야기. 1919년 4월, 나무를 심는 날 모인 사람들이 함께 만세를 불렀어요.",
      read: ["나무 심는 날.\f씨앗 어른이 들려준\n덕과 들판의 이야기다.",
        "1919년 3월 1일,\n'대한 독립 만세' 소리가\f온 나라로 퍼져 나갔다.\n(3·1 운동)",
        "그해 4월, 덕과에서는\n나무를 심는 날 모인 사람들이\f함께 만세를 불렀다고 한다.",
        "나무를 심듯 마음을 심은 날.\f그 마음이 자라\n오늘의 우리가 되었다."],
      hint: "나무 심는 날 이야기는\n갈매마을의 씨앗 어른께" },
    { id: "sj_cheolbul", n: "쇠부처님 이야기", place: "월백마을 실상사",
      d: "실상사 스님이 들려준 약사전 쇠부처님 이야기. 들판 한가운데서 천 년 넘게 마을 곁을 지켜 왔어요.",
      read: ["쇠부처님 이야기.\f실상사 약사전에 앉아 계신\n쇠로 만든 부처님 이야기다.",
        "실상사는 828년 홍척 스님이\n세웠다고 전한다.\f구산선문 가운데 가장 먼저\n문을 연 절이다.",
        "약사전의 철불은\n신라 말에 쇠로 만든 부처님.\f우리나라에 남은 가장 큰\n철불이다.",
        "절은 산속이 아니라\n들판 한가운데 있다.\f마을 사람들 곁에서\n천 년 넘게 이야기를 지켜 왔다."],
      hint: "쇠부처님 이야기는 월백마을\n실상사 스님께\f(반야봉에 다녀온 뒤)" },
  ];
  const SJN = Object.fromEntries(SJ.map(t => [t.id, t]));
  async function sjRead(id) {
    const t = SJN[id]; if (!t) return;
    for (const s of t.read) await say(s);
    if (G.flag("chuldu_done")) await say("(잊지 않은 이야기 한 토막.\n오래오래 전해질 것이다.)");
  }
  for (const t of SJ) ITEMS[t.id] = { n: t.n, p: "key", ic: t.id, d: t.d, read: () => sjRead(t.id) };
  async function sjGive(id, lines = []) {
    if (hasI(id)) return false;
    for (const s of lines) await say(s);
    await getItem(id);
    G.flag("sjgot_" + id, true);
    if (!G.flag("sj_first_note")) { G.flag("sj_first_note", true);
      await say("(이야기 조각 — 남원에 전해 오는\n이야기 한 토막.\f가방의 '중요한 물건'에서\n다시 읽을 수 있다.)"); }
    return true;
  }

  // 남원 이야기 지도: 정표 여섯 + 이야기 조각 넷
  const SM = [["jp_ring", "gwanghanru"], ["jp_cloth", "jjok"], ["jp_bowl", "manboksa"], ["jp_fan", "ssuk"], ["jp_seed", "misaek"], ["jjy_card", "bisaek"],
    ["sj_honbul", "honbul"], ["sj_sabal", "r3"], ["sj_mansei", "galmae"], ["sj_cheolbul", "wolbaek"]];
  const smPos = key => { const T = DATA.town; if (key[0] === "r" && /^r\d+$/.test(key)) { const r = T.routes.find(q => q.no === +key.slice(1)); return r ? [r.x, r.y] : [50, 50]; }
    const p = T.places.find(q => q.k === key); return p ? [p.x, p.y] : [50, 50]; };
  const smName = id => (ITEMS[id] && ITEMS[id].n) || id;
  const smHint = id => { const jp = typeof JP !== "undefined" ? JP.find(t => t.id === id) : null; return jp ? jp.hint : SJN[id] ? SJN[id].hint : ""; };
  const smPlace = id => { const jp = typeof JP !== "undefined" ? JP.find(t => t.id === id) : null; return jp ? jp.place : SJN[id] ? SJN[id].place : ""; };
  const smCount = () => SM.filter(([id]) => hasI(id)).length;
  async function smRead(id) {
    if (!hasI(id)) { await say(`아직 찾지 못한 이야기.\f${smHint(id)}`); return; }
    if (id === "jjy_card") { if (typeof jjyCardRead === "function") await jjyCardRead(); return; }
    const it = ITEMS[id]; if (it && it.read) await it.read();
  }
  class StoryMap extends Modal {
    constructor() { super(); this.opaque = true; this.i = 0; this.busy = false; this.cool = 6; }
    update(f) {
      if (!f || this.busy) return;
      if (this.cool > 0) { this.cool--; return; }
      if (Input.rep("left") || Input.rep("up")) { this.i = (this.i + SM.length - 1) % SM.length; sfx("cursor"); }
      else if (Input.rep("right") || Input.rep("down")) { this.i = (this.i + 1) % SM.length; sfx("cursor"); }
      else if (Input.ok()) { sfx("select"); this.busy = true;
        (async () => { try { await smRead(SM[this.i][0]); } catch (e) { console.warn(e); } this.busy = false; this.cool = 8; })(); }
      else if (Input.cancel()) { sfx("cancel"); this.done(); }
    }
    draw() {
      if (IMG.townmap) g.drawImage(IMG.townmap, 0, 0, 768, 576, 0, 0, SW, SH); else rect(0, 0, SW, SH, "#6a9a5a");
      g.globalAlpha = 0.25; rect(0, 0, SW, SH, "#2a2030"); g.globalAlpha = 1;
      const blink = (FRAME >> 4) & 1;
      SM.forEach(([id, key], j) => {
        const [x0, y0] = smPos(key), px = Math.round(x0 / 100 * SW), py = Math.round(y0 / 100 * SH), has = hasI(id), sel = j === this.i;
        const r = sel ? 5 : 3;
        rect(px - r - 1, py - r - 1, r * 2 + 2, r * 2 + 2, "#2a2230");
        rect(px - r, py - r, r * 2, r * 2, has ? (id.startsWith("jp") || id === "jjy_card" ? "#f8d040" : "#80c8f0") : "#8a8a96");
        if (has) rect(px - 1, py - 1, 2, 2, "#ffffff");
        if (sel && blink) { rect(px - 8, py - 8, 16, 2, "#f8f040"); rect(px - 8, py + 6, 16, 2, "#f8f040"); rect(px - 8, py - 8, 2, 16, "#f8f040"); rect(px + 6, py - 8, 2, 16, "#f8f040"); }
      });
      frame(2, 2, 252, 20);
      Font.draw(g, "남원 이야기 지도", 10, 5);
      Font.draw(g, `${smCount()} / ${SM.length}`, 246, 8, { font: "g9", col: "#8a6a3a", sh: null, align: "right" });
      const [id, key] = SM[this.i], has = hasI(id), by = smPos(key)[1] > 62 ? 26 : 150;
      frame(2, by, 252, 40);
      if (has && typeof drawItemIcon === "function") drawItemIcon(id === "jjy_card" ? "jjy_card" : id, 8, by + 8);
      Font.draw(g, has ? smName(id) : "？？？", 38, by + 5);
      Font.draw(g, smPlace(id), 38, by + 22, { font: "g9", col: TXT.gray, sh: null });
      Font.draw(g, has ? "A 읽기  B 닫기" : "A 힌트  B 닫기", 246, by + 6, { font: "g9", col: "#4a7a3a", sh: null, align: "right" });
      Font.draw(g, id.startsWith("sj") ? "이야기 조각" : "정표", 246, by + 22, { font: "g9", col: "#8a6a3a", sh: null, align: "right" });
    }
  }
  ITEMS.story_map = { n: "남원 이야기 지도", p: "key", ic: "story_map",
    d: "윤슬 박사님이 만든 지도. 여행에서 모은 정표와 이야기 조각을 남원 곳곳에 꽂아 다시 읽을 수 있어요.",
    read: () => show(new StoryMap()) };
  async function smGiveHome() {          // 엔딩 우리 집: 엄마가 윤슬 박사님의 선물을 건넴
    if (hasI("story_map")) return;
    const MO = act("mom"), P = World.player; if (MO) face(MO, P);
    await say("엄마: 참, 윤슬 박사님이\n이걸 두고 가셨어.\f'여행 이야기를 꽂아 보라'고.");
    await getItem("story_map");
    await say("(가방의 '중요한 물건'에서\n남원 이야기 지도를 펼칠 수 있다.)");
  }
  async function smYunseul() {           // 다홍 연구소 윤슬 박사(엔딩 뒤): 지도 · 다 모으면 선물
    if (!PG()) return;
    if (!hasI("story_map")) { await say("윤슬 박사: 참, 이거 받아요.\f남원 이야기 지도예요.\n모은 이야기를 꽂아 봐요!"); await getItem("story_map"); }
    const n = smCount();
    if (n >= SM.length && !G.flag("sm_all")) {
      G.flag("sm_all", true);
      await say("윤슬 박사: 열 가지 이야기를\n다 모았네요!\f정표 여섯, 이야기 조각 넷.");
      await say("윤슬 박사: 이야기는 전하는 사람이\n있어야 살아요.\f……이제 그 사람이\n바로 당신이에요.");
      await getItem("abilpatch"); await getItem("yeot", 3);
    } else if (n < SM.length) await say(`윤슬 박사: 이야기 지도는\n${n}/${SM.length}이에요.\f남은 이야기도 찾아봐요!`);
  }

  // ================================================================ 1) 변도진의 이유(놀부의 그늘)
  let FB = null;
  function fbOn() { FB = { t: 0, ph: 1, ov: new Overlay(() => fbDraw()) }; Scenes.push(FB.ov); }
  function fbOff() { if (FB) { const o = FB.ov; FB = null; Scenes.pop(o); } }
  function fbChar(key, dir, x, y, flip) {
    const C = typeof CH === "function" ? CH() : null, im = IMG.chars; if (!C || !im) return;
    const row = C.keys.indexOf(key); if (row < 0) return;
    const s = C.scale || 1, fi = { down: 0, up: 3, left: 6, right: 6 }[dir] + (FB && FB.ph === 2 ? ((FB.t >> 3) & 1) : 0);
    spriteS(im, fi * 16 * s, row * 24 * s, 16 * s, 24 * s, x, y, 16, 24, flip || dir === "right");
  }
  function fbDraw() {
    const F = FB; if (!F) return; F.t++;
    g.save();
    g.globalAlpha = Math.min(1, F.t / 24);
    const gr = g.createLinearGradient(0, 0, 0, SH); gr.addColorStop(0, "#e2cfa4"); gr.addColorStop(1, "#a4865a"); g.fillStyle = gr; g.fillRect(0, 0, SW, SH);
    g.fillStyle = "#c2a676"; g.beginPath(); g.moveTo(0, 96); for (let x = 0; x <= SW; x += 8) g.lineTo(x, 84 + Math.sin(x / 28) * 7); g.lineTo(SW, SH); g.lineTo(0, SH); g.fill();
    rect(0, 112, SW, SH - 112, "#9c7e52");
    for (let x = 140; x < 250; x += 10) { g.fillStyle = "#86704a"; g.fillRect(x, 118 + ((x / 10) & 1) * 4, 6, 2); }   // 박 밭 이랑
    rect(44, 72, 76, 40, "#cdb48c"); rect(44, 72, 76, 3, "#b49a70");                                                 // 초가 벽
    g.fillStyle = "#8c6c3c"; g.beginPath(); g.moveTo(34, 78); g.quadraticCurveTo(82, 40, 130, 78); g.lineTo(130, 84); g.lineTo(34, 84); g.fill();   // 이엉 지붕
    g.strokeStyle = "#6e5430"; g.lineWidth = 1; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(44 + k * 14, 82); g.lineTo(52 + k * 12, 58 + Math.abs(k - 2.5) * 3); g.stroke(); }
    g.strokeStyle = "#7c8a4c"; g.beginPath(); g.moveTo(48, 64); g.quadraticCurveTo(74, 52, 104, 60); g.stroke();       // 박 덩굴(박은 없음)
    rect(72, 90, 16, 22, F.ph === 2 ? "#5a4428" : "#6c5434");                                                          // 문
    g.fillStyle = "#6c4e2a"; g.beginPath(); g.ellipse(112, 86, 6, 3, 0, 0, Math.PI); g.fill();                         // 빈 제비 둥지
    g.filter = "sepia(1) saturate(0.7) brightness(0.95)";
    if (F.ph === 1) fbChar("kid_m", "up", 104, 98);
    else { const dx = Math.min(40, F.t * 0.4); fbChar("man", "left", 150 - dx, 98); fbChar("woman", "left", 166 - dx, 100); fbChar("kid_m", "right", 190 - dx * 0.6, 100); }
    g.filter = "none";
    const vg = g.createRadialGradient(SW / 2, SH / 2, 60, SW / 2, SH / 2, 170); vg.addColorStop(0, "rgba(40,24,8,0)"); vg.addColorStop(1, "rgba(40,24,8,0.55)"); g.fillStyle = vg; g.fillRect(0, 0, SW, SH);
    g.restore();
  }
  async function byeonPast() {
    if (G.flag("byeon_past") || !F("banya_event_done") || F("chuldu_done")) return false;
    const P = World.player, HJ = act("hanji");
    G.flag("byeon_past", true);
    await say("???: 얘야!\n잠깐 이리 와 보거라.");
    await emote(P, "excl", 18);
    const hx = HJ ? [HJ.x, HJ.y] : null;
    if (HJ && Math.abs(HJ.x - P.x) + Math.abs(HJ.y - P.y) > 1) await popIn(HJ); else if (HJ) { face(HJ, P); face(P, HJ); }
    await say("한지 어른: 반야봉에서\n대방을 봤다지?");
    await say("한지 어른: 설명회 날 그 이사장 목소리……\f어디서 들었나 했더니,\n이제야 생각이 났다.");
    await say("한지 어른: 도진이.\f쉰 해 전, 바로 이 박 밭 끝\n초가에 살던 아이다.");
    await fadeOut(10); fbOn(); await fadeIn(10);
    await say("……쉰 해 전, 미색마을.");
    await say("가난한 집 막내 도진이는\n해마다 처마 밑 제비 둥지를\f올려다보았다.");
    await say("'제비가 박씨를 물어다 주면\f우리 집도 흥부네처럼\n부자가 될 거야.'");
    await say("그러나 제비는 끝내\n박씨를 물어 오지 않았다.");
    if (FB) { FB.ph = 2; FB.t = 24; }
    await say("흉년이 든 해, 도진이네는\n빚 때문에 밭을 내주고\f마을을 떠났다.");
    await say("떠나던 날, 도진이는\n텅 빈 둥지를 돌아보며\f말했다.");
    await say("'복은 기다리면 안 와.\n……내가 다 사 버릴 거야.'");
    await fadeOut(10); fbOff(); await fadeIn(10);
    await say("한지 어른: 「흥부전」의 놀부는\n욕심쟁이지.\f그런데 도진이는\n처음엔 흥부였어.");
    await say("한지 어른: 오지 않는 복을\n기다리다 지쳐서\f놀부가 되어 버린 게야.");
    await say("한지 어른: '모두에게 복을'이라……\f그 아이가 정말 바란 건\n뭐였을까.");
    await say("한지 어른: 그 아이를 다시 만나면,\n나도 할 말이 있구나.");
    if (HJ && hx) { HJ.hidden = true; HJ.x = hx[0]; HJ.y = hx[1]; HJ.hidden = false; HJ.dir = "down"; }
    return true;
  }
  async function cxByeonPast(D) {          // 출두 끝맺음: "내가 바란 건 나 혼자의 복이었나" 바로 뒤
    const H = act("cx_hanji"), P = World.player;
    if (H && D) face(H, D);
    if (!G.flag("byeon_past")) await say("한지 어른: ……그 목소리.\n이제야 알겠다.");
    await say("한지 어른: 도진아.\f박 밭 끝 초가집\n도진이 아니냐.");
    if (D) await emote(D, "excl", 24);
    await say("변도진: ……한지 어른.");
    await say("변도진: 해마다 처마 밑 둥지를\n올려다봤지요.\f제비는 끝내 박씨를\n물어 오지 않았습니다.");
    await say("한지 어른: 박씨는 기다리는 게 아니라\n심는 거란다.\f……아직 늦지 않았다.");
    if (D) face(D, P);
    await say("변도진: …………");
    G.flag("byeon_past", true);
  }
  async function byeonPost() {             // 엔딩 뒤 미색 박 밭
    if (!G.flag("byeon_post")) {
      await say("변도진: ……너로구나.");
      await say("변도진: 사들인 땅은 마을에\n모두 돌려주었다.\f닥나무 밭도, 섬진강 둔치도.");
      await say("변도진: 이 밭 한 이랑만 빌려서\n박씨를 심고 있다.");
      await say("변도진: 쉰 해 동안 제비를\n기다리기만 했지.\f……이번엔 내가\n심어 보려고.");
      if (hasI("jp_seed")) await say("변도진: 너도 박씨를 심었다고?\f……그럼 봄에 누구 박이\n먼저 열리나 보자꾸나.");
      await say("변도진: '모두에게 복을'.\f……이번엔 정말로.");
      G.flag("byeon_post", true);
    } else await say("변도진: 박 덩굴은 지붕까지\n올라간다지.\f……천천히 기다려 보마.");
  }

  // ================================================================ 2) 가람의 밤(광한루원 오작교, 출두 뒤 ~ 엔딩 전)
  const GQ_ANS = ["우리가 같이 놓자", "한 사람 한 사람이", "잘 모르겠어"];
  const gqShow = () => F("chuldu_done") && !F("ending_now") && !PG();
  async function gqScene() {
    const P = World.player, GR = act("gq_garam");
    if (G.flag("garam_q")) { await say("가람: 리그, 꼭 이겨.\f……칠석 밤에 여기서\n다시 만나자."); return; }
    bgm("ojakgyo");
    if (GR) face(GR, P);
    await say("가람: ……왔구나.");
    try { Audio2.cry("honguseong"); } catch (e) {}
    await say("가람: 홍우성은 여기가 좋대.\f견우랑 직녀가 만나는\n다리라서.");
    await say("가람: 만복사에서 까마귀랑 까치가\n빛의 다리를 놓았지.\f홍우성이랑 은직성 사이에.");
    await say("가람: 그런데 나는\n그날 밤부터 계속 궁금해.");
    const i = await ask("가람: 사람 쪽 다리는,\n누가 놓아?", GQ_ANS);
    G.flags.garam_q_ans = i;
    if (i === 0) await say("가람: 같이……\f혼자 놓는 다리는\n없구나.");
    else if (i === 1) await say("가람: 한 마리 한 마리는 작아도……\f까치들처럼?");
    else await say("가람: ……나도 몰라.\n그래서 물어본 거야.\f같이 알아보자.");
    const N = act("gq_nabi");
    if (N) { N.x = GR ? GR.x : N.x; N.y = GR ? GR.y - 1 : N.y; }
    await say("흰 나비 한 마리가 날아와\n가람의 어깨 위를 맴돌았다.");
    await say("가람: 이 나비, 만복사에서부터\n따라왔어.\f사람들은 '복나비'라고\n부르더라.");
    await say("가람: 남켓몬을 아주 많이 만난\n사람 앞에만 나타난대.\f……너라면 언젠가\n볼 수 있을 거야.");
    await say("흰 나비는 은하수 쪽으로\n날아올랐다.");
    if (N) N.hidden = true;
    await say("가람: 나는 여기 조금 더 있을게.\f리그, 꼭 이겨.\n칠석 밤에 여기서 만나자.");
    G.flag("garam_q", true);
    zoneBgm();
  }
  async function gqHint() { await say("(가람은 광한루원 쪽으로\n천천히 걸어갔다……)"); }
  async function gqEnding() {
    if (!G.flag("garam_q")) return;
    const ans = GQ_ANS[G.flags.garam_q_ans || 0] || GQ_ANS[0];
    await say(`가람: 그날 밤 네가 그랬지.\n'${ans}'.`);
    await say(ans === GQ_ANS[2] ? "가람: 그래서 같이 알아보기로\n했잖아.\f……이제 조금 알 것 같아." : "가람: 그 말, 계속\n생각했어.");
    await say("가람: 사람 쪽 다리는\n작은 새들처럼,\f한 사람 한 사람이\n놓는 거였어.");
  }

  // ================================================================ 3) 칠로 넷
  const CHIL = [
    { k: "sangsoe", flag: "chil_sangsoe", cx: "cx_sangsoe", spr: "sangsoe", line: "상쇠 어른: 길 열어라!\n칠로가 왔다!" },
    { k: "ssiat", flag: "chil_ssiat", cx: "cx_ssiat", spr: "ssiat", line: "씨앗 어른: 심으러 왔네.\f……여기 심을 게\n많구먼." },
    { k: "hunjang", flag: "chil_hunjang", cx: "cx_hunjang", spr: "elder_m", line: "훈장 어른: 이야기를 지키러 왔다.\f항아리 말고,\n아이들 귀에." },
    { k: "daemok", flag: "chil_daemok", cx: "cx_daemok", spr: "daemok", line: "대목 어른: 무너진 걸\n다시 세우러 왔소." },
  ];
  // 상쇠(비색마을 투표 끝)
  async function chilSangsoe() {
    if (G.flag("chil_sangsoe")) return;
    const P = World.player, S = act("cs_sangsoe"), M1 = act("cs_pm1"), M2 = act("cs_pm2");
    await say("그때, 마을회관 밖에서\n꽹과리 소리가 울렸다!");
    await beat();
    for (const [a, x, y] of [[S, 4, 6], [M1, 3, 6], [M2, 5, 6]]) if (a) { a.x = x; a.y = y; a.hidden = false; a.dir = "up"; }
    sfx("door");
    if (S) { const [x, y] = near(S); await walkPath(S, x, y); face(S, P); face(P, S); }
    await say("상쇠 어른: 깽매갱 깽!\f칠로의 '상쇠'라 하오.\n풍물패 맨 앞에서\f꽹과리를 치는 사람이지.");
    await say("상쇠 어른: 대방이 그러더군.\f'판을 벌일 젊은이가 없으니\n풍물 소리도 항아리에\f담아 두자.'");
    await say("상쇠 어른: 그래서 오늘도\n재단 일을 거들러 왔는데……\f이 마을 사람들\n목소리를 들었소.");
    await say("상쇠 어른: 꽹과리는 혼자 치면\n시끄럽기만 하지.\f징, 장구, 북이 같이 울려야\n비로소 판이 서오.");
    if (M1) face(M1, P);
    await say("풍물패: 꽹과리는 천둥, 징은 바람,\n장구는 비, 북은 구름!");
    await say("상쇠 어른: 농악은 마을 사람들이\n함께 일하고 함께 놀던 소리요.\f2014년 유네스코\n인류무형문화유산이 되었지.");
    await say("상쇠 어른: 소리를 가둘 게 아니라\n판을 다시 벌여야겠소.");
    await say("상쇠 어른: 만복사에서 큰일이\n벌어진다면\f그날 밤, 우리 풍물패가\n길을 열어 주겠소!");
    await beat();
    G.flag("chil_sangsoe", true);
    for (const a of [S, M1, M2]) if (a) a.hidden = true;
    sfx("exit");
    await say("풍물패는 꽹과리를 울리며\n마을 쪽으로 나갔다.");
  }
  // 씨앗(갈매 들판 — 어사패 여덟 뒤 배움터 앞)
  async function ssiatTalkMansei() {
    await say("씨앗 어른: 이 덕과 들판에도\n이야기가 하나 있지.");
    await say("씨앗 어른: 1919년 4월,\n덕과에서는\f나무를 심는 날 모인 사람들이\n'대한 독립 만세'를 외쳤다네.");
    await say("씨앗 어른: 나무를 심듯\n마음을 심은 거지.\f그 마음이 자라서\n오늘 우리가 여기 있는 게야.");
    await sjGive("sj_mansei", ["씨앗 어른: 이 이야기 한 토막,\n가져가게."]);
  }
  async function chilSsiat() {
    if (G.flag("chil_ssiat") || F("chuldu_done")) return;
    const P = World.player, S = act("gm_ssiat");
    await say("???: 어이쿠, 이 녀석!\n어사패 여덟 개라고?");
    await popIn(S);
    await say("씨앗 어른: 칠로의 '씨앗 어른'이라\n하네.\f할머니의 할머니 때부터\n받아 온 씨앗을 지키지.");
    await say("씨앗 어른: 토종 씨앗이라는 게 있어.\f한 마을에서 대대로\n심고 거두며 이어 온 씨앗.");
    await say("씨앗 어른: 요즘은 심는 사람이 없어\n하나둘 사라진다네.\f그래서 대방 말대로\n항아리에 넣어 두려 했지.");
    await say("씨앗 어른: 그런데 씨앗은\n항아리 속에서\f잠만 자다 끝나더구먼.\n해마다 심어야 산다네.");
    await ssiatTalkMansei();
    await say("씨앗 어른: 만복사에서\n큰일이 있다지?\f나도 씨앗 주머니\n들고 가겠네.");
    G.flag("chil_ssiat", true);
    if (S) { sfx("exit"); S.hidden = true; }
  }
  // 훈장(덕과 아카데미 교실 — 봉서를 받은 뒤)
  async function chilHunjang() {
    if (G.flag("chil_hunjang") || F("chuldu_done") || !F("bongseo_got")) return;
    const P = World.player, H = act("cl_hunjang"), K = act("class2_duty");
    if (H) { H.x = 7; H.y = 9; H.hidden = false; sfx("door"); const [x, y] = near(H); await walkPath(H, x, y); face(H, P); face(P, H); }
    await say("훈장 어른: 허허, 교룡산성에서 만난\n그 아이로구나.");
    await say("훈장 어른: 그날 네가 오작교 이야기를\n끝까지 들어 주었지.");
    await say("훈장 어른: 그래서 알았다.\f이야기는 항아리가 아니라\n사람 귀에 담는 거라는 걸.");
    await say("훈장 어른: 교장 선생님께 부탁해서\n이 교실에서\f아이들에게 옛이야기를\n들려주기로 했다.");
    if (K) face(K, H || P);
    await say("아이: 훈장님!\n견우랑 직녀 이야기\f또 해 주세요!");
    if (H) face(H, P);
    await say("훈장 어른: 허허, 그래그래.\f……칠로는 대방 곁을\n떠났다.");
    await say("훈장 어른: 만복사의 밤엔\n우리도 가마.\f이번엔 이야기를\n지키러.");
    G.flag("chil_hunjang", true);
  }
  // 대목(1번도로 서쪽 끝 · 만복사지 앞)
  async function chilDaemok() {
    if (G.flag("chil_daemok") || F("chuldu_done") || !F("bongseo_got")) return;
    const P = World.player, D = act("pre_daemok");
    await say("???: 거기, 봉서 든 아이.");
    if (D && D.hidden) await popIn(D);
    else if (D && Math.abs(D.x - P.x) + Math.abs(D.y - P.y) > 1) { const [x, y] = near(D); await walkPath(D, x, y); face(D, P); face(P, D); }
    else if (D) { face(D, P); face(P, D); }
    await say("대목 어른: 나는 칠로의 대목이다.\f기둥을 세우고 들보를 얹어\n한옥을 짓는 목수지.");
    await say("대목 어른: 대방은 '집도 언젠가\n무너지니\f차라리 봉인하자'\n하더군.");
    await say("대목 어른: 그런데 이 앞 만복사 터를\n보게.\f절은 불타 사라졌는데\n주춧돌은 사백 년을 넘게\f버티고 있지.");
    await say("대목 어른: 누군가 그 위에\n다시 기둥을 세워 주길\f기다리면서 말이야.");
    await say("대목 어른: 우리 대목은 못 하나\n쓰지 않고\f나무를 깎아\n짜 맞춘다.");
    await say("대목 어른: 이 솜씨는 2010년\n유네스코\f인류무형문화유산이\n되었지.");
    await say("대목 어른: 짜임은 혼자 버티지 않아.\f기둥과 들보가\n서로를 붙들어 주지.");
    await say("대목 어른: 오늘 밤엔 나도 가겠다.\f허물어진 걸 다시 세우는 게\n대목의 일이니까.");
    G.flag("chil_daemok", true);
    if (D) { sfx("exit"); D.hidden = true; }
  }
  // 출두(chapter23 cxReveal: 사람들이 쏟아져 나온 뒤)
  async function cxChilro() {
    const who = CHIL.filter(c => G.flag(c.flag)); if (!who.length) return;
    const P = World.player;
    if (G.flag("chil_sangsoe")) { await beat(); await say("깽매갱 깽! 깽매갱 깽!\f꽹과리 소리를 앞세우고\n풍물패가 절터로 들어섰다!"); }
    else await say("칠로 어른들도\n절터로 들어섰다!");
    for (const c of who) { const a = act(c.cx); if (a) a.hidden = false; }
    if (G.flag("chil_sangsoe")) for (const id of ["cx_pm1", "cx_pm2"]) { const a = act(id); if (a) a.hidden = false; }
    for (const c of who) await say(c.line);
    const D = act("cx_daebang"); if (D) face(D, P);
    await say("변도진: ……칠로까지.");
    await say("소리 어른: 대방.\f우리 칠로는 이제\n이 아이 편이오.");
  }
  async function cxDaemokTemple() { if (G.flag("chil_daemok")) await say("대목 어른: 저 짜임 좀 보게!\f못 하나 없이 기둥과 들보가\n서로를 붙들고 있어……"); }
  async function cxEndPungmul() {
    if (!G.flag("chil_sangsoe")) return;
    await beat();
    await say("상쇠 어른: 자, 판을 벌이자!\f오늘 같은 날엔 모두가\n한 마당이오!");
    await say("꽹과리, 징, 장구, 북이\n한데 어우러졌다.\f풍물패를 따라 사람들이\n절터를 빙글빙글 돌았다.");
  }

  // ================================================================ 4) 잊힌 자리(운해룡 복선)
  const FG = [
    { id: "kiln", map: "route3", x: 3, y: 27, ghost: "불이 꺼진 옹기 가마.",
      text: ["옹기 가마 옆에 깨진 항아리 조각이\n수북이 쌓여 있다.\f'옹기 쓰는 집이 줄어서……'\n누군가의 한숨이 들린 것 같다."] },
    { id: "station", map: "jjok", x: 33, y: 21, ghost: "기차가 서지 않는 옛 역.",
      text: ["옛 서도역 승강장.\f새 철길이 놓인 뒤로\n기차가 서지 않는다.", "찾아오는 사람도\n하나둘 줄었다고 한다."] },
    { id: "well", map: "gamcheong", x: 28, y: 12, ghost: "물이 마른 우물.",
      text: ["돌로 쌓은 우물.\f두레박줄이 끊긴 채\n물이 말라 있다.", "교룡산성에는 우물이 아흔아홉 개나\n있었다고 하는데……"] },
    { id: "school", map: "route16", x: 55, y: 12, ghost: "아이들이 떠난 분교 운동장.",
      text: ["풀이 무릎까지 자란 빈터.\f아이들이 줄어 문을 닫은\n작은 분교의 운동장이었다고 한다.", "녹슨 철봉 하나만\n남아 있다."] },
  ];
  function wisp(px, py) {
    const t = FRAME;
    for (let i = 0; i < 3; i++) {
      const a = t / 38 + i * 2.1, x = px + 8 + Math.cos(a) * 5, y = py + 5 + Math.sin(a * 1.3) * 3 - i * 3;
      g.globalAlpha = 0.24 + 0.1 * Math.sin(t / 20 + i); g.fillStyle = "#eef2ff";
      g.beginPath(); g.ellipse(x, y, 6 - i, 3.5 - i * 0.6, 0, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
  }
  function bar(px, py) {                     // 녹슨(→ 닦은) 철봉
    const c = F("chuldu_done") ? "#9aa4b4" : "#8a5a3a";
    rect(px + 2, py + 2, 2, 13, "#4a3a30"); rect(px + 12, py + 2, 2, 13, "#4a3a30"); rect(px + 2, py + 2, 12, 2, c); rect(px + 3, py + 3, 10, 1, F("chuldu_done") ? "#d8e0ea" : "#a8784a");
  }
  async function fgLook(s) {
    for (const t of s.text) await say(t);
    await say("옅은 안개 한 줄기가\n그 둘레를 맴돌다가\f지리산 쪽으로\n흘러갔다……");
    if (G.flag("ys_byeoldol") || G.flag("banya_event_done")) await say("가방 속 별돌이\n차갑게 떨렸다.");
    G.flag("fgseen_" + s.id, true);
  }
  async function fgYsHint() {                // 월백 윤슬 박사(story_v259 ysByeoldol 끝에서 부름)
    await say("윤슬 박사: 아, 그리고요.\f요즘 마을마다 옅은 안개가\n맴도는 자리가 있대요.");
    await say("윤슬 박사: 불 꺼진 가마, 마른 우물……\n사람들이 잊은 자리마다요.\f……운해룡하고 무슨\n관계가 있을까요?");
  }
  async function cxForgot() {                // 운해룡의 빈 몸속(chapter23 cxUnhae, 정표 별 앞)
    const seen = FG.filter(s => G.flag("fgseen_" + s.id));
    await say("운해룡의 텅 빈 몸속에\n희미한 것들이 비쳤다……");
    if (seen.length) { for (const s of seen) await say(s.ghost); await say("모두 사람들이\n잊어버린 것들이었다."); }
    else await say("불 꺼진 가마, 멈춘 기차역,\n마른 우물, 빈 운동장……\f사람들이 잊어버린 것들이\n안개처럼 떠돌고 있었다.");
    if (act("cx_garam")) await say("가람: ……그래서 속이\n비어 있었구나.\f잊힌 것들이 모여서.");
  }
  // 출두 뒤: 옹이의 가마(숨 쉬는 사발)
  async function ongiKiln() {
    if (!hasI("sj_sabal")) {
      await say("옹이: 왔구나.\f……가마에 다시 불을 넣었어.\n스승님이랑 같이.");
      await say("옹이: 예전엔 남켓몬을 가두는\n항아리만 구웠지.\f오늘은 처음으로\n밥 담을 사발을 구웠어.");
      await say("옹이: 옹기는 숨 쉬는 그릇이야.\f흙 사이 작은 숨구멍으로\n바람이 드나들어서\f김치랑 장이 맛있게 익지.");
      await say("옹이: 월백마을 목기 장인님께도\n하나 갖다 드렸어.\f'그릇은 밥을 담아야\n그릇이다.'");
      await sjGive("sj_sabal", ["옹이: 이거, 네 거야.\n첫 사발."]);
      await say("옹이: 쓰다 보면 닳고\n이도 빠지겠지.\f……그게 그릇이 할 일을\n다 하는 거래.");
      const M = act("ongi_master"); if (M) { face(M, World.player); await say("할아버지: 녀석,\n손이 많이 늘었어."); }
      return;
    }
    await say("옹이: 가마 불은\n꺼뜨리지 않을 거야.\f……쓰는 그릇을 굽는 불이니까.");
  }

  // ================================================================ 6) 기념일(실제 날짜 3·15 · 4·11 · 4·19)
  const memDay = () => window.NK_MEMDAY || (typeof JJY_DAY === "function" ? JJY_DAY() : null);
  const memKey = () => "jjymem_" + new Date().getFullYear() + "_" + String(memDay()).replace(/\D/g, "");
  const MEM_TXT = {
    "3·15": ["해설사: 오늘은 3월 15일이에요.", "해설사: 1960년 오늘, 마산에서\n부정선거에 맞서\f학생과 시민들이\n거리로 나섰어요."],
    "4·11": ["해설사: 오늘은 4월 11일이에요.", "해설사: 1960년 오늘,\n실종 27일 만에\f열사가 마산 앞바다에서\n발견되었어요.", "해설사: 그 소식에 사람들이\n다시 거리로 나섰지요."],
    "4·19": ["해설사: 오늘은 4월 19일,\n4·19 혁명 기념일이에요.", "해설사: 1960년 오늘,\n학생과 시민들이\f함께 일어섰어요."],
  };
  async function memScene() {
    const day = memDay(); if (!day || G.flag(memKey())) return;
    G.flag(memKey(), true);
    const P = World.player, GD = act("jjy_guide"), V = act("jjy_visitor");
    await say("기념관 안에 비색마을 사람들이\n모여 있다.\f모두 흰 국화를\n한 송이씩 들었다.");
    if (GD) face(GD, P);
    for (const t of MEM_TXT[day] || MEM_TXT["4·19"]) await say(t);
    await say("해설사: 다 함께 잠시\n묵념하겠습니다.");
    let dim = 0; const ov = new Overlay(() => { dim = Math.min(0.55, dim + 0.02); g.globalAlpha = dim; rect(0, 0, SW, SH, "#000000"); g.globalAlpha = 1; });
    Scenes.push(ov); await frames(70);
    await say("(…………)");
    Scenes.pop(ov);
    await say("해설사: 고맙습니다.");
    if (G.flag("bs_vote_done")) {
      const IJ = act("mem_ijang"), Y = act("mem_youth");
      if (IJ) face(IJ, P);
      await say("이장: 투표 날 이후로 우리 마을은\n이날마다\f이렇게 함께 모이기로 했소.");
      if (Y) face(Y, P);
      await say("청년: 올해는 저도\n꽃을 들고 왔어요.");
      if (V) face(V, P);
      await say("할머니: 해마다 혼자 왔는데……\f이젠 혼자\n오지 않아요.");
    } else {
      if (V) face(V, P);
      await say("할머니: 해마다 혼자 오다가……\f올해는 마을 사람들이\n함께 와 줬네요.");
    }
    sfx("chime");
    await say("흰 국화 한 송이를 받아\n헌화대에 놓았다.");
  }

  // ================================================================ 지도에 붙이기
  const hid = (id, x, y, spr, dir, o = {}) => ({ id, x, y, spr, dir, move: "fixed", hidden: true, show: () => true, ...o });   // 장면에서 나타남(show가 거짓이면 사람이 아예 안 생김)
  // 비색 마을회관: 상쇠·풍물패(투표 끝에 들어옴) · 투표 끝에 이어 부름
  if (MAPS.hall_bisaek) MAPS.hall_bisaek.npcs.push(hid("cs_sangsoe", 4, 6, "sangsoe", "up"), hid("cs_pm1", 3, 6, "pungmul", "up"), hid("cs_pm2", 5, 6, "pungmul", "up"));
  if (typeof bvFinal === "function") { const bf0 = bvFinal; bvFinal = async function () { const was = G.flag("bs_vote_done"); await bf0(); if (!was && G.flag("bs_vote_done")) await chilSangsoe(); }; window.bvFinal = bvFinal; }
  // 갈매: 씨앗 어른(어사패 여덟 뒤 배움터 앞) · 출두 뒤엔 들판에
  if (MAPS.galmae) {
    const M = MAPS.galmae;
    M.npcs.push(hid("gm_ssiat", 22, 11, "ssiat", "down", { show: () => BG(8) && !F("chil_ssiat") && !F("chuldu_done") }),
      { id: "gm_ssiat2", x: 12, y: 30, spr: "ssiat", dir: "down", move: "look", show: () => F("chuldu_done"),
        talk: async () => { if (!hasI("sj_mansei")) { await say("씨앗 어른: 올봄엔 마을 아이들이랑\n토종 씨앗을 심었네."); await ssiatTalkMansei(); return; }
          await say("씨앗 어른: 올봄엔 마을 아이들이랑\n토종 씨앗을 심었네.\f……측량 말뚝은 뽑아서\n허수아비 다리로 썼지!"); } });
    M.areas = (M.areas || []).concat([{ x0: 20, y0: 10, x1: 31, y1: 12, cond: () => BG(8) && !F("chil_ssiat") && !F("chuldu_done"), run: chilSsiat }]);
  }
  // 덕과 아카데미 교실: 훈장 어른(봉서 뒤)
  if (MAPS.class2) {
    const C2 = MAPS.class2;
    C2.npcs.push(hid("cl_hunjang", 7, 9, "elder_m", "up", { show: () => F("bongseo_got") && !F("chil_hunjang") && !F("chuldu_done") }));
    C2.npcs.push({ id: "cl_hunjang2", x: 6, y: 7, spr: "elder_m", dir: "down", move: "fixed", show: () => F("chil_hunjang"),
      talk: () => say(F("chuldu_done") ? (PG() ? "훈장 어른: 오늘은 「흥부전」을\n들려주었단다.\f아이들이 박 타는 대목에서\n제일 크게 웃더구나." : "훈장 어른: 칠월 칠석이면\n까마귀와 까치가……\f허허, 오늘은 여기까지.")
        : "훈장 어른: 만복사의 밤엔\n우리도 가마.\f이번엔 이야기를\n지키러.") });
    if (typeof hwangBongseo === "function") for (const a of C2.areas || []) if (a.run === hwangBongseo) { const r0 = a.run; a.run = async () => { await r0(); await chilHunjang(); }; }
    C2.areas = (C2.areas || []).concat([{ x0: 0, y0: 5, x1: 13, y1: 9, cond: () => F("bongseo_got") && !F("chil_hunjang") && !F("chuldu_done"), run: chilHunjang }]);
  }
  // 1번도로 서쪽 끝(만복사지 앞): 대목 어른
  if (MAPS.world) {
    const W = MAPS.world;
    W.npcs.push({ id: "pre_daemok", x: 7, y: 40, spr: "daemok", dir: "left", move: "fixed", show: () => F("bongseo_got") && !F("chuldu_done") && !F("chil_daemok"), talk: chilDaemok });
    W.areas = (W.areas || []).concat([{ x0: 1, y0: 40, x1: 12, y1: 43, cond: () => F("bongseo_got") && !F("chuldu_done") && !F("chil_daemok"), run: chilDaemok }]);
    // 고침: 처음 만나는 날씨 쪽지(world.js)가 그 걸음의 칸 트리거보다 먼저 떠서 낮에도 만복사지 문(x 2)을 지나칠 수 있었음 → 한 칸 안쪽(x 1)에도 같은 막음
    if (typeof mbGateCond === "function" && typeof mbGateBlock === "function") W.triggers = (W.triggers || []).concat([42, 43].map(y => ({ x: 1, y, cond: mbGateCond, run: mbGateBlock })));
    // 광한루원 오작교: 가람의 밤(출두 뒤 ~ 엔딩 전)
    W.npcs.push({ id: "gq_garam", x: 14, y: 13, spr: "garam", dir: "left", move: "fixed", show: gqShow, talk: gqScene },
      { id: "gq_hongu", x: 15, y: 13, dir: "left", move: "fixed", special: typeof legendSprite === "function" ? legendSprite("honguseong", 46) : undefined, show: gqShow,
        talk: () => say("홍우성이 은하수 쪽을\n올려다보고 있다.") },
      { id: "gq_nabi", x: 13, y: 12, dir: "down", move: "fixed", special: typeof butterflySprite === "function" ? butterflySprite : undefined, show: () => gqShow() && !F("garam_q"),
        talk: () => say("흰 나비 한 마리가\n가람 곁을 맴돈다.") });
  }
  // 만복사지: 출두 때 칠로 넷 · 풍물패 / 출두 뒤 대목 어른(주춧돌)
  if (MAPS.manboksa) {
    const M = MAPS.manboksa, ev = () => typeof cxEv === "function" && cxEv();
    const cxs = (id, x, y, spr, dir, flag, line) => ({ id, x, y, spr, dir, move: "fixed", hidden: true, show: () => ev() && F(flag), talk: () => say(line), heart: "만복사의 밤 " + id });
    const ol = M.onLoad;   // 출두가 지난 뒤 다시 들어오면 칠로·풍물패가 그대로 서 있음
    M.onLoad = function () { if (ol) ol.call(this); if (ev() && F("cx_chuldu")) for (const a of World.actors) if (/^cx_(sangsoe|pm1|pm2|ssiat|hunjang|daemok)$/.test(a.id || "")) a.hidden = false; };
    M.npcs.push(cxs("cx_sangsoe", 31, 10, "sangsoe", "left", "chil_sangsoe", "상쇠 어른: 깽매갱 깽!\f꽹과리는 천둥이오!"),
      cxs("cx_pm1", 32, 9, "pungmul", "left", "chil_sangsoe", "풍물패: 징은 바람,\n장구는 비, 북은 구름!"),
      cxs("cx_pm2", 32, 11, "pungmul", "left", "chil_sangsoe", "풍물패: 판이 섰다!"),
      cxs("cx_ssiat", 20, 12, "ssiat", "up", "chil_ssiat", "씨앗 어른: 심을 게 많구먼."),
      cxs("cx_hunjang", 10, 12, "elder_m", "up", "chil_hunjang", "훈장 어른: 이야기는 아이들 귀에."),
      cxs("cx_daemok", 7, 10, "daemok", "right", "chil_daemok", "대목 어른: 주춧돌은\n기다리고 있었지."),
      { id: "mb_daemok", x: 12, y: 15, spr: "daemok", dir: "up", move: "look", show: () => F("chuldu_done") && F("chil_daemok") && !ev(),
        talk: () => say("대목 어른: 이 주춧돌 위에\n언젠가 다시 기둥을 세울 게다.\f그날까지 젊은 목수들을\n가르쳐야지.") });
  }
  // 인월장터: 출두 뒤 상쇠 어른의 장날 판
  if (MAPS.inwol) MAPS.inwol.npcs.push(
    { id: "iw_sangsoe", x: 27, y: 16, spr: "sangsoe", dir: "down", move: "fixed", show: () => F("chuldu_done") && F("chil_sangsoe"),
      talk: async () => { await beat(); await say("상쇠 어른: 장날이면 판을 벌인다오!\f꽹과리는 천둥, 징은 바람,\n장구는 비, 북은 구름!"); } },
    { id: "iw_pm1", x: 26, y: 17, spr: "pungmul", dir: "right", move: "fixed", show: () => F("chuldu_done") && F("chil_sangsoe"), talk: "풍물패: 저도 장구 배우는 중이에요!\f덩 기덕 쿵 더러러러!" },
    { id: "iw_pm2", x: 28, y: 17, spr: "pungmul", dir: "left", move: "fixed", show: () => F("chuldu_done") && F("chil_sangsoe"), talk: "풍물패: 판이 서니까\n장터가 들썩들썩하죠?" });
  // 미색마을: 변도진의 옛일(한지 어른) · 엔딩 뒤 박 밭의 변도진
  if (MAPS.misaek) {
    const M = MAPS.misaek;
    const cond = () => F("banya_event_done") && !F("byeon_past") && !F("chuldu_done");
    M.areas = (M.areas || []).concat([{ x0: 9, y0: 22, x1: 14, y1: 23, cond, run: byeonPast }, { x0: 33, y0: 22, x1: 33, y1: 23, cond, run: byeonPast }]);
    wrapTalk("misaek", n => n.id === "hanji", async () => {
      if (await byeonPast()) return true;
      if (F("chuldu_done")) { await say("한지 어른: 닥나무 밭은 돌려받았다.\f올해도 한지를\n뜰 수 있겠어.");
        if (PG()) await say("한지 어른: 도진이 녀석, 요즘\n박 밭에서 호미를 쥐더구나.\f허허."); return true; }
      if (F("byeon_past")) { await say("한지 어른: 도진이를 다시 만나면……\f나도 할 말이 있구나."); return true; }
      return false; });
    M.npcs.push({ id: "ms_byeon2", x: 24, y: 26, spr: "byeon", dir: "up", move: "fixed", show: PG, talk: byeonPost });
  }
  // 잊힌 자리 넷 + 출두 뒤 모습
  for (const s of FG) {
    const M = MAPS[s.map]; if (!M) continue;
    M.npcs.push({ id: "fg_" + s.id, x: s.x, y: s.y, dir: "down", move: "fixed", special: wisp, show: () => !F("chuldu_done"), talk: () => fgLook(s) });
  }
  if (MAPS.route3) MAPS.route3.npcs.push({ id: "r3_ongi2", x: 3, y: 27, spr: "ongi", dir: "right", move: "fixed", show: () => F("chuldu_done"), talk: ongiKiln });
  if (MAPS.jjok) MAPS.jjok.npcs.push({ id: "jj_reader", x: 33, y: 21, spr: "woman", dir: "down", move: "look", show: () => F("chuldu_done"),
    talk: "낭독가: 이번 주말, 이 승강장에서\n『혼불』 낭독회를 열어요.\f기차는 서지 않아도\n이야기는 여기 서요." });
  if (MAPS.gamcheong) MAPS.gamcheong.npcs.push({ id: "gc_wellman", x: 28, y: 12, spr: "oldman", dir: "down", move: "look", show: () => F("chuldu_done"),
    talk: "할아버지: 마을 사람들이 모여\n우물을 쳤단다.\f맑은 물이 다시 고였어.\f아흔아홉 우물 이야기도\n아이들한테 들려줬지." });
  if (MAPS.route16) MAPS.route16.npcs.push(
    { id: "r16_bar", x: 54, y: 11, dir: "down", move: "fixed", special: bar, talk: () => say(F("chuldu_done") ? "반짝반짝 닦은 철봉.\f누가 거꾸로 매달려\n놀았나 보다." : "녹슨 철봉이다.\f옛날 분교 아이들이\n매달려 놀던 철봉일까?") },
    { id: "r16_kidA", x: 53, y: 12, spr: "kid_m", dir: "right", move: "look", show: () => F("chuldu_done"), talk: "여기가 옛 분교 운동장이래!\f풀 베고 철봉도 닦았어.\n이제 우리 놀이터야!" },
    { id: "r16_kidB", x: 55, y: 12, spr: "kid_f", dir: "left", move: "look", show: () => F("chuldu_done"), talk: "할머니가 그러는데\n여기서 운동회도 했대!\f우리도 해 볼까?" });
  // 이야기 조각: 혼불문학관 해설사 · 실상사 스님
  wrapTalk("museum", n => n.x === 7 && n.y === 4 && n.spr === "woman", async () => {
    if (!F("banya_event_done") || hasI("sj_honbul")) return;
    await say("해설사: 요즘 '잊힌 것' 이야기를\n자주 듣네요.\f별돌이라는 돌 이야기도요.");
    await sjGive("sj_honbul", ["해설사: 이거 받아요.\f작가가 쓴 원고 한 장을\n본뜬 거예요."]);
    await say("해설사: 작가는 사라져 가는\n우리말과 풍속을\f원고지 칸칸이\n붙잡아 두었어요.");
    await say("해설사: 글로 남긴 것은\n쉽게 잊히지 않는대요.");
  }, true);
  wrapTalk("wolbaek", n => n.id === "wb_monk", async () => {
    if (!F("banya_event_done") || hasI("sj_cheolbul")) return;
    await say("스님: 반야봉에 다녀왔구나.\f얼굴에 구름 기운이\n묻었네.");
    await say("스님: 쇠는 녹이 슬지.\f그래도 해마다 사람들이 찾아와\n닦고 절하고 이야기를 전해서\f지금까지 남아 계신 거란다.");
    await sjGive("sj_cheolbul", ["스님: 이 이야기 한 토막,\n가져가거라."]);
    await say("스님: 잊지 않는 것도\n공부란다.");
  }, true);
  // 기념관: 기념일에 모인 마을 사람들 · 비색마을 길에도
  if (MAPS.jjy_hall) {
    const JH = MAPS.jjy_hall, md = () => !!memDay();
    JH.npcs.push(
      { id: "mem_ijang", x: 8, y: 4, spr: "man", dir: "up", move: "fixed", show: md, talk: () => say(F("bs_vote_done") ? "이장: 이날만큼은 마을 일을\n잠시 내려놓고\f다 같이 오기로 했소." : "이장: 해마다 이날이면\n마을 사람들이 꽃을 들고 와요.") },
      { id: "mem_youth", x: 9, y: 4, spr: "student", dir: "up", move: "fixed", show: () => md() && F("bs_vote_done"), talk: "청년: 투표 날 배웠어요.\f기억하는 것에서 그치지 않고\n함께 말하는 것까지요." },
      { id: "mem_kid", x: 6, y: 5, spr: "kid_m", dir: "up", move: "fixed", show: md, talk: "엄마가 오늘은 조용히\n있어야 한댔어.\f……꽃은 내가 놓을래." },
      { id: "mem_vil", x: 10, y: 5, spr: "woman", dir: "up", move: "fixed", show: md, talk: "아주머니: 흰 국화는\n'잊지 않겠다'는 뜻이래요." });
    JH.areas = (JH.areas || []).concat([{ x0: 0, y0: 3, x1: 14, y1: 8, cond: () => md() && !G.flag(memKey()), run: memScene }]);
  }
  if (MAPS.bisaek) MAPS.bisaek.npcs.push(
    { id: "mem_out1", x: 16, y: 10, spr: "oldman", dir: "left", move: "fixed", show: () => !!memDay(), talk: "할아버지: 오늘은 기념관에\n가는 날이오.\f꽃 한 송이 들고." },
    { id: "mem_out2", x: 17, y: 11, spr: "woman", dir: "left", move: "fixed", show: () => !!memDay(), talk: "아주머니: 해마다 사람이\n조금씩 늘어요.\f……그게 기뻐요." });
  // 다홍 연구소 윤슬 박사(엔딩 뒤): 이야기 지도
  { const LAB = Object.values(MAPS).find(D => (D.npcs || []).some(n => n.id === "yunseul"));
    if (LAB) { const Y = LAB.npcs.find(n => n.id === "yunseul"), t0 = Y.talk; Y.talk = async (...a) => { await (typeof t0 === "function" ? t0(...a) : say(t0)); await smYunseul(); }; } }
  // 모험 수첩: 출두 뒤 곁 이야기(가람의 밤)
  if (typeof GOALS !== "undefined") { const q = GOALS.find(q => q.k === "r17"); if (q) { const d0 = q.d;
    Object.defineProperty(q, "d", { configurable: true, get: () => d0 + (F("chuldu_done") && !F("garam_q") ? " (곁 이야기: 광한루원 오작교에 가람이 혼자 서 있대요.)" : "") }); } }
  // 엔딩 우리 집: 정표 이야기 뒤에 이야기 지도
  if (typeof jpEpilogue === "function") { const e0 = jpEpilogue; jpEpilogue = async function () { await e0(); await smGiveHome(); }; window.jpEpilogue = jpEpilogue; }

  Object.assign(window, { byeonPast, cxByeonPast, byeonPost, gqScene, gqHint, gqEnding, chilSangsoe, chilSsiat, chilHunjang, chilDaemok, cxChilro, cxDaemokTemple, cxEndPungmul,
    fgYsHint, cxForgot, ongiKiln, memScene, smGiveHome, smYunseul, StoryMap, sjRead, V260: { SJ, SM, FG, CHIL, smCount, memDay, memKey } });
})();
