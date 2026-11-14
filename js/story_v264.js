// ===== v2.64 이야기 손질 + 갈래 엔딩 — 스토리 점검 v2.63의 '고칠 것' 1~10 · 엔딩 안 가·나·다·라 =====
// 사용자(2026-11-10): "이거 전부 다 해. 엔딩 a~d까지를 선택에 따라 갈리도록 해도 좋아. 가람 떠나는 까닭은 '대방을 저버릴 수 없어서'로."
// 실제 포켓몬처럼 묘사: 큰 흐름(명예의 전당 → 크레디트 → 우리 집)은 그대로 두고, 달라지는 것은 오작교 위 한 장면과 뒷이야기(구조만, 닌텐도 그림·글은 베끼지 않음)
// 방식: 앞 장 파일은 건드리지 않고 say()를 감싸 '그 줄을 바꾸거나(rw) · 앞(bef)·뒤(aft)에 장면을 끼움'. 열쇠가 되는 원문은 src/check_v264.py가 원본에 있는지 검사
// 1 가람의 까닭: 구룡계곡에서 서도역 회상(아무도 안 믿을 때 믿어 준 어른 = 대방) → 반야봉 "대방님을 혼자 가시게 둘 수는 없어" → 출두 "그 말만은 참이었다 / 믿어 준 게 아니라 쓴 거였구나" → "따라간 건 내가 고른 거야"
// 2 전설 통일: 오작 = 까막까치 다리 · 홍우성 = 견우의 별 · 은직성 = 직녀의 별 · 운해룡 = 다리가 끊길 때 남은 빈 마음
// 3 물음 일곱(2·3·4·5·7·8·9장, "너라면 어떻게 할래?" 보기 넷 = 갈래 넷) + 출두에서 되받기 + 가방 '물음 쪽지'
// 4 한결: 교장의 편지 심부름 → 출두에 여덟 마을을 불러 옴   5 대방 정체: '황금 박 지팡이·금테 안경' 대신 달그락 소리
// 6 보름 "항아리가 혼망울의 본디 자리예요?"   7 행수·대방·칠로 뜻풀이   8 후원금 도장 · 별돌을 주는 까닭 · 여울–조박사
// 9 산지기 넷을 남켓몬센터에서 미리 만남   10 되풀이 줄이기(우물·배추·견우직녀) — 여심 선생님 이모티콘은 사용자가 준 말버릇이라 그대로
// 엔딩 가(네 갈래 지킴이 4) · 나(가람의 내일 3) · 다(어사의 한마디 3) · 라(오작교의 길이 2)
// story_v260 뒤에 읽힘
"use strict";
(function storyV264() {
  const F = k => G.flag(k);
  const PG = () => typeof postGame === "function" ? postGame() : (G.flag("ending_seen") || G.flag("champion"));
  const hasI = id => !!(G.bag && G.bag[id]);
  const P_ = () => World.player;

  // ================================================================ say 고쳐 쓰기 틀
  const say0 = say;
  const RW = new Map(), AFT = new Map(), BEF = new Map(), SUB = [], AFTP = [];
  const rw = (k, v) => RW.set(k, v), aft = (k, f) => AFT.set(k, f), bef = (k, f) => BEF.set(k, f), sub = (a, b) => SUB.push([a, b]);
  say = function (text, opt = {}) {
    const key = String(text);
    let t = RW.has(key) ? RW.get(key) : key;
    if (typeof t === "function") t = t();
    if (t !== null) for (const [a, b] of SUB) if (t.includes(a)) t = t.split(a).join(typeof b === "function" ? b() : b);
    const b = BEF.get(key); let a = AFT.get(key);
    if (!a) { const p = AFTP.find(p => p.test(key)); if (p) a = p.run; }
    if (!b && !a) return t === null ? Promise.resolve() : say0(t, opt);
    return (async () => { if (b) await b(); const v = t === null ? undefined : await say0(t, opt); if (a && !opt.keep) await a(); return v; })();
  };

  // ================================================================ 3) 물음 일곱 · 갈래 넷
  const WAYS = [
    { k: "use", n: "쓰는 손", t: "쓰면서 지키는 사람" },
    { k: "flow", n: "흐르는 물", t: "흐르게 하는 사람" },
    { k: "look", n: "살피는 눈", t: "살피는 사람" },
    { k: "listen", n: "듣는 귀", t: "들어 주는 사람" }];
  const U = 0, FL = 1, LK = 2, LS = 3;
  const QS = [
    { n: 2, who: "미영", where: "쪽빛마을", short: "들판 남켓몬이 쉴 곳이 없다면?",
      q: "미영: ……하나만 묻자.\f들판 남켓몬이 쉴 곳이 없다면,\n너라면 어떻게 할래?",
      opts: [["어디서 쉬는지 따라가 본다", LK], ["무당콩한테 먼저 물어본다", LS], ["풀숲 사이에 길을 터 준다", FL], ["들판에 자주 놀러 간다", U]],
      re: ["미영: ……자주 간다.\f자주 보는 얼굴이 있으면\n들판도 덜 쓸쓸하겠지.", "미영: ……길을 튼다.\f막힌 색도 번지게 두면\n살아나기도 해.",
        "미영: ……따라가 본다.\f그리는 사람도\n먼저 오래 봐.", "미영: ……물어본다.\f대답을 기다릴 줄 아는 사람은\n드물어."],
      back: s => `미영: ……쪽빛마을에서\n이 아이가 그랬어.\f'${s}'.` },
    { n: 3, who: "보름", where: "옹기 가마", short: "사람들이 혼망울을 쫓아다닌다면?",
      q: "보름: 그런데 사람들이 혼망울을\n쫓아다닌 건 사실이잖아.\f너라면 어떻게 할래?",
      opts: [["혼망울한테 싫은지 물어본다", LS], ["같이 밤 산책을 다닌다", U], ["멀리서 조용히 지켜본다", LK], ["조용히 보는 법을 널리 알린다", FL]],
      re: ["보름: 오, 그거 좋다!\f같이 다니면 쫓아다니는 게\n아니라 친구잖아.", "보름: 그거 내가 영상으로\n만들어서 올릴게!\f'혼망울 조용히 보는 법'!",
        "보름: 멀리서……\f그러고 보니 내 사진기,\n너무 가까이 댔나 봐.", "보름: 맞다, 물어보면 되는구나!\f다음엔 찍기 전에\n꼭 물어볼래."],
      back: s => `보름: 옹기 가마에서\n얘가 그랬어요!\f'${s}'.` },
    { n: 4, who: "수현", where: "섬진강", short: "강이 흐려졌을 때 뭘 먼저?",
      q: "수현: 그 전에 하나만 물어볼게요.\f강이 흐려졌을 때,\n너라면 뭘 먼저 할래요?",
      opts: [["막힌 곳을 터서 물길을 낸다", FL], ["어디서 흐려지는지 따라가 본다", LK], ["강에서 노는 사람을 늘린다", U], ["강가 사람들한테 물어본다", LS]],
      re: ["수현: 노는 사람이 늘면\n지켜보는 눈도 늘어요.\f좋은 생각이에요.", "수현: 물길을 낸다……\f여울 씨가 들으면\n좋아하겠네요.",
        "수현: 따라가 본다.\f맞아요, 어디서부터인지 알아야\n손을 쓰죠.", "수현: 물어본다.\f강가에서 오래 산 분들은\n다 알고 계시거든요."],
      back: s => `수현: 섬진강에서\n이 아이가 그랬어요.\f'${s}'라고요.` },
    { n: 5, who: "신하", where: "육모정", short: "계곡에 치레뇽이 안 보이면?",
      q: "신하: ……하나만 묻자.\f계곡에 치레뇽이 안 보이면,\n너라면 어떡할래?",
      opts: [["물속을 한참 들여다본다", LK], ["쓰레기를 주워 물길을 튼다", FL], ["계곡 사람들 말을 들어 본다", LS], ["맑은 계곡에서 같이 논다", U]],
      re: ["신하: 놀아?\f……뭐, 자주 오는 사람이\n제일 먼저 알아채긴 하지.", "신하: ……내일 아침 청소,\n너도 오라는 말이야.\f딱히 기대하는 건 아니고.",
        "신하: ……흥.\n별도 오래 봐야 보여.\f틀린 말은 아니네.", "신하: 듣는다, 라.\f……말 많은 사람보다는\n낫네."],
      back: s => `신하: ……육모정에서\n얘가 그러더라.\f'${s}'. 흥.` },
    { n: 7, who: "여심", where: "국악당", short: "소리가 사라질까 봐 걱정될 때?",
      q: "여심: 아, 그 전에 하나만요~\f소리가 사라질까 봐 걱정될 때,\n너라면 어떻게 할래요?",
      opts: [["가서 끝까지 들어 준다", LS], ["한 대목 배워서 불러 본다", U], ["친구들한테 들려주고 퍼뜨린다", FL], ["누가 어디서 부르는지 알아본다", LK]],
      re: ["여심: 직접 불러 본다~\f몸으로 익힌 건\n잘 안 잊히거든요.", "여심: 들려주고 퍼뜨린다~\f좋은 건 옮아도\n괜찮으니까요.",
        "여심: 먼저 알아본다~\f진찰도 살펴보는 데서\n시작해요.", "여심: 끝까지 들어 준다~\f그게 제일 좋은 약이에요."],
      back: s => `여심: 국악당에서\n이 친구가 그랬어요~\f'${s}'라고요.` },
    { n: 8, who: "희주", where: "미색마을", short: "제비 둥지가 사라질 것 같으면?",
      q: "희주: 아, 하나 물어봐도 될까요?\f제비 둥지가 사라질 것 같으면,\n어떻게 하고 싶어요?",
      opts: [["처마 밑을 제비랑 같이 쓴다", U], ["마을 사람들 생각을 들어 본다", LS], ["제비가 오는 날을 적어 둔다", LK], ["둥지 이야기를 널리 알린다", FL]],
      re: ["희주: 같이 쓴다……\f조금 시끄러워도\n봄이 온 줄 알 수 있겠네요.", "희주: 널리 알린다.\f아는 사람이 많아지면\n함부로 못 치우겠죠.",
        "희주: 적어 둔다.\f해마다 적으면\n달라지는 게 보일 거예요.", "희주: 들어 본다.\f맞아요, 이 마을 일은\n이 마을 사람들이 제일 잘 알죠."],
      back: s => `희주: 미색마을에서\n이 친구가 그랬어요.\f'${s}'라고.` },
    { n: 9, who: "국립공원 지킴이", where: "뱀사골", short: "곰과 사람이 같이 지내려면?",
      q: "지킴이: 하나만 물어볼게요.\f곰과 사람이 같이 지내려면,\n뭘 먼저 하면 좋을까요?",
      opts: [["곰이 다니는 길을 조사한다", LK], ["정해진 길로 산을 계속 찾는다", U], ["산 사람들 이야기를 듣는다", LS], ["곰 길 소식을 널리 알린다", FL]],
      re: ["지킴이: 계속 찾아온다.\f찾는 사람이 있어야\n산을 지킬 까닭도 생기죠.", "지킴이: 알린다.\f길을 아는 사람이 많을수록\n곰도 사람도 덜 놀라요.",
        "지킴이: 조사한다.\f우리도 발자국부터\n세고 있어요.", "지킴이: 듣는다.\f산에서 오래 산 분들이\n제일 먼저 알아채세요."],
      back: s => `교장 선생님: 뱀사골에서는\n이렇게 답했다더구나.\f'${s}'.` }];
  const QN = Object.fromEntries(QS.map(q => [q.n, q]));
  const ansOf = q => { const v = G.flags["wq" + q.n]; return v ? q.opts[v - 1] : null; };
  const answered = () => QS.filter(q => ansOf(q));
  function way() {                                         // 0~3, 대답이 없으면 null
    if (G.flags.way_fix) return G.flags.way_fix - 1;
    const A = answered(); if (!A.length) return null;
    const c = [0, 0, 0, 0]; for (const q of A) c[ansOf(q)[1]]++;
    const mx = Math.max(...c);
    const order = A.slice().sort((a, b) => (G.flags["wqt" + b.n] || b.n) - (G.flags["wqt" + a.n] || a.n));   // 같은 수면 나중에 고른 쪽
    for (const q of order) if (c[ansOf(q)[1]] === mx) return ansOf(q)[1];
    return c.indexOf(mx);
  }
  ITEMS.q_note = { n: "물음 쪽지", p: "key", ic: "landdoc",
    d: "길에서 받은 물음과 내가 고른 답을 적어 둔 쪽지. 읽으면 다시 볼 수 있어요.", read: qRead };
  async function qRead() {
    const A = answered();
    if (!A.length && !G.flags.gq2 && !G.flags.gq5 && !G.flags.eosa_word) { await say("아직 아무것도 적혀 있지 않다."); return; }
    for (const q of A) await say(`${q.where} · ${q.who}\n"${q.short}"\f→ ${ansOf(q)[0]}`);
    if (G.flags.gq2) await say(`서도역 · 가람\n"사람 곁에 있으면 행복할까?"\f→ ${GQ2[G.flags.gq2 - 1]}`);
    if (G.flags.gq5) await say(`육모정 · 가람\n"네 남켓몬은 행복해?"\f→ ${GQ5[G.flags.gq5 - 1]}`);
    if (G.flag("garam_q")) await say(`오작교 · 가람\n"사람 쪽 다리는 누가 놓아?"\f→ ${GQN[G.flags.garam_q_ans || 0]}`);
    if (G.flags.eosa_word) await say(`만복사지 · 변도진에게\f→ ${EOSA[G.flags.eosa_word - 1]}`);
    const w = way(); if (PG() && w !== null) await say(`졸업장에 적힌 한 줄.\f'${WAYS[w].t}'.`);
    else await say("(친구는 뭐라고 답했을까?\n서로 까닭을 물어보자.)");
  }
  let qSeq = 0;
  async function askQ(n) {
    const q = QN[n]; if (!q || G.flags["wq" + n]) return;
    const i = await ask(q.q, q.opts.map(o => o[0]));
    G.flags["wq" + n] = i + 1; G.flags["wqt" + n] = Date.now() + (qSeq++);
    await say(q.re[q.opts[i][1]]);
    if (!hasI("q_note")) { await getItem("q_note"); await say("(받은 물음과 고른 답을\n'물음 쪽지'에 적어 두었다.\f가방의 '중요한 물건'에서\n다시 읽을 수 있다.)"); }
  }
  aft("미영: ……너.\n……나쁘지 않아.", () => askQ(2));
  aft("보름: 근데 있잖아.\n닳는 게 꼭 나쁜 걸까?\f내 운동화도 다 닳았는데,\n그만큼 많이 뛰어다녔다는 거잖아.", () => askQ(3));
  bef("수현: 그런데…… 밥은 먹고 다녀요?\f배고프면 마음도 작아지거든요.\f이거, 배움터에서 만든 누룽지예요.\n남켓몬한테 지니게 해 줘요.", () => askQ(4));
  bef("신하: ……딱히 네가 걱정돼서\n나온 건 아니야.\f별 보러 나왔을 뿐이라고.", () => askQ(5));
  bef("여심: 그럼 우리 결론 먼저\n말해볼까? ^^;;\f소리는 가두는 게 아니라\n들어 주는 거예요.", () => askQ(7));
  bef("희주: 그리고 이거, 받아요.", () => askQ(8));
  bef("지킴이: 고마워요.\f위쪽 반야봉 가는 길은 지금\n안개가 짙어서 막아 두었어요.\f길이 열리면 알려 줄게요.", () => askQ(9));
  const WAY_ASK = ["곁에 두고 같이 쓴다", "막힌 곳을 터 준다", "먼저 가서 살펴본다", "먼저 묻고 들어 준다"];
  async function wayFallback(who) {                        // 물음을 못 받은 채 온 예전 기록: 한 번 묻고 정함
    if (way() !== null) return;
    const i = await ask(`${who}: 하나만 물어볼게.\f사라져 가는 걸 지키려면,\n너라면 뭘 먼저 할래?`, WAY_ASK);
    G.flags.way_fix = i + 1;
  }
  // 출두에서 되받기
  aft("교장 선생님: 변도진 이사장.\f이 아이는 혼자 온 게 아니오.\n여덟 마을이 함께 왔소.", async () => {
    const w = way(), A = answered(); if (w === null || !A.length) return;
    const pick = A.filter(q => ansOf(q)[1] === w).sort((a, b) => (G.flags["wqt" + b.n] || b.n) - (G.flags["wqt" + a.n] || a.n))[0];
    if (pick) await say(pick.back(ansOf(pick)[0]));
    await say("교장 선생님: 이 아이는 물음마다\n스스로 답하며 여기까지 왔소.");
  });

  // ================================================================ 1) 가람의 까닭 — 서도역 회상
  let GF = null;
  function gfChar(key, dir, x, y, step) {
    const C = typeof CH === "function" ? CH() : null, im = IMG.chars; if (!C || !im) return;
    const row = C.keys.indexOf(key); if (row < 0) return;
    const s = C.scale || 1, fi = { down: 0, up: 3, left: 6, right: 6 }[dir] + (step ? ((GF.t >> 3) & 1) : 0);
    spriteS(im, fi * 16 * s, row * 24 * s, 16 * s, 24 * s, x, y, 16, 24, dir === "right");
  }
  function gfDraw() {
    const S = GF; if (!S) return; S.t++;
    g.save();
    g.globalAlpha = Math.min(1, S.t / 24);
    const gr = g.createLinearGradient(0, 0, 0, SH); gr.addColorStop(0, "#d8c8a4"); gr.addColorStop(1, "#9c8660"); g.fillStyle = gr; g.fillRect(0, 0, SW, SH);
    g.fillStyle = "#b8a47c"; g.beginPath(); g.moveTo(0, 70); for (let x = 0; x <= SW; x += 8) g.lineTo(x, 62 + Math.sin(x / 34) * 6); g.lineTo(SW, SH); g.lineTo(0, SH); g.fill();   // 먼 산
    rect(0, 108, SW, 12, "#a89068"); rect(0, 108, SW, 2, "#c4b088");                                    // 승강장
    rect(0, 120, SW, SH - 120, "#7c6a4a");                                                               // 자갈
    for (let x = -4; x < SW; x += 12) rect(x, 134, 7, 3, "#5e4e34");                                     // 침목
    rect(0, 131, SW, 2, "#4a3e2c"); rect(0, 139, SW, 2, "#4a3e2c");                                      // 철길
    rect(40, 64, 3, 44, "#6a5638"); rect(84, 64, 3, 44, "#6a5638"); rect(34, 60, 60, 16, "#e4d8b8"); rect(34, 60, 60, 2, "#6a5638"); rect(34, 74, 60, 2, "#6a5638");   // 역 이름판
    Font.draw(g, "서도", 64, 62, { font: "g9", col: "#5a4a30", sh: null, align: "center" });
    rect(128, 98, 44, 3, "#6a5638"); rect(132, 101, 3, 7, "#5a4a30"); rect(165, 101, 3, 7, "#5a4a30");   // 긴 의자
    g.filter = "sepia(1) saturate(0.7) brightness(0.95)";
    gfChar("garam", "down", 136, 80, false);
    if (S.ph === 2) { const dx = Math.min(64, S.t2 * 0.5); S.t2++; gfChar("daebang", "left", 226 - dx, 84, dx < 64); }
    g.filter = "none";
    const vg = g.createRadialGradient(SW / 2, SH / 2, 60, SW / 2, SH / 2, 170); vg.addColorStop(0, "rgba(40,24,8,0)"); vg.addColorStop(1, "rgba(40,24,8,0.55)"); g.fillStyle = vg; g.fillRect(0, 0, SW, SH);
    g.restore();
  }
  function gfOn() { GF = { t: 0, t2: 0, ph: 1, ov: new Overlay(() => gfDraw()) }; Scenes.push(GF.ov); }
  function gfOff() { if (GF) { const o = GF.ov; GF = null; Scenes.pop(o); } }
  async function garamPast() {
    if (F("garam_past")) return;
    G.flag("garam_past", true);
    await fadeOut(10); gfOn(); await fadeIn(10);
    await say("……몇 해 전, 서도역.");
    await say("기차가 서지 않는 승강장에\n아이 하나가 앉아 있었다.");
    await say("'남켓몬 목소리가 들려.'\f그 말을 하면 사람들은\n웃거나, 자리를 피했다.");
    if (GF) { GF.ph = 2; GF.t2 = 0; }
    await say("어느 날, 가면을 쓴 어른이\n곁에 와서 앉았다.");
    await say("'네 귀는 틀리지 않았다.\f그 목소리, 나는 믿는다.\n나와 함께 지키러 가자.'");
    await fadeOut(10); gfOff(); await fadeIn(10);
    await say("가람: 아무도 내 말을 안 믿을 때\n믿어 준 건 대방님뿐이었어.\f……그래서 쉽게\n등을 못 돌려.");
  }
  aft("가람: 그래도…… 대방님 말씀이\n다 틀렸는지는 아직 모르겠어.", garamPast);
  // 반야봉
  bef("가람: 사람 곁에 있으면\n남켓몬은 닳고 지쳐.\f그러니까……\n사람과 남켓몬을 떼어 놓겠어.", () => say("대방: 도령.\f서도역에서 한 약속,\n잊지 않았겠지."));
  rw("가람: 사람 곁에 있으면\n남켓몬은 닳고 지쳐.\f그러니까……\n사람과 남켓몬을 떼어 놓겠어.",
    "가람: ……구룡계곡은\n사람이 치웠어요.\f대방님 말씀이 다 맞는 건\n아닐지도 몰라요.\f그래도 아무도 안 믿을 때\n믿어 준 분을……\f저버릴 수는 없어요.");
  rw("가람: 그래도 나는 내 길로 갈게.\f……다음에 만나면,\n그땐 전설과 함께야.",
    "가람: 그래도 나는\n대방님과 갈게.\f틀린 길이더라도……\n혼자 가시게 둘 수는 없어.\f……다음에 만나면,\n그땐 전설과 함께야.");
  // 출두
  aft("가람: 네 남켓몬들은\n네 곁에 있고 싶대.\f……내가 듣던 소리랑\n다른 소리야.", () => say("가람: 그래도 여기 서 있는 건……\f대방님을 혼자 둘 수\n없어서야."));
  rw("가람: ……나를,\n속였구나.", "가람: ……서도역에서 한 말도,\n거짓이었어요?");
  aft("가람: ……나를,\n속였구나.", async () => {
    await say("변도진: ……그 말만은 참이었다.\f네 귀는 틀리지 않았지.\n그래서 쓸모가 있었고.");
    await say("가람: ……믿어 준 게 아니라,\n쓴 거였구나.");
  });
  bef("가람: 나는…… 남켓몬 목소리만\n들으면 된다고 생각했어.", () => say("가람: 반야봉에서 따라간 건\n내가 고른 거야.\f속았다는 말 뒤에\n숨지 않을게."));

  // ================================================================ 2) 전설 통일 · 8) 별돌을 주는 까닭
  rw("???: ……드디어 이 자리에 섰구나.\f오작이 잠든, 반야봉 꼭대기에.", "???: ……드디어 이 자리에 섰구나.\f견우의 별이 잠든,\n반야봉 꼭대기에.");
  rw("대방: 견우와 직녀는 본디\n하나였다.\f사람들이 '지킬 것이냐,\n새로 만들 것이냐'를 두고 다투자\f오작은 둘로 갈라졌지.",
    "대방: 견우 별과 직녀 별 사이에는\n본디 까막까치의 다리가 있었다.\f사람들이 '지킬 것이냐,\n새로 만들 것이냐'를 두고 다투자\f다리는 끊기고,\n두 별은 따로 잠들었지.");
  rw("대방: 오늘 오작을 깨워\f남켓몬을 모두 본디 자리로\n돌려보내리라.", "대방: 오늘 견우의 별을 깨워\f남켓몬을 모두 본디 자리로\n돌려보내리라.");
  rw("대방: 오작이여, 깨어나라!", "대방: 견우의 별이여, 깨어나라!");
  rw("대방: 오작의 반쪽이\n도령을 택했다!", "대방: 견우의 별이\n도령을 택했다!");
  rw("대방: 그 돌은 남은 반쪽,\n'새로 짜는 것'이다.\f……깨어나지도 못하는 돌,\n아이에게 줘 버려라.",
    "대방: 그 돌은 직녀의 별,\n'새로 짜는 것'이다.\f아무리 불러도\n대답이 없더군.\f……깨어나지도 못하는 돌,\n아이에게 줘 버려라.");
  rw("옹이: 반야봉에서 대방님이\n'의식'을 하신대.\f오작 전설을 깨워서\n남켓몬을 사람한테서 떼어 놓는다고.", "옹이: 반야봉에서 대방님이\n'의식'을 하신대.\f견우의 별을 깨워서\n남켓몬을 사람한테서 떼어 놓는다고.");
  rw("오작이 둘로 갈라질 때\n남은 빈 마음……\f잊힌 것들이 모여\n구름바다가 되었다고 했다.", "까막까치 다리가 끊길 때\n남은 빈 마음……\f잊힌 것들이 모여\n구름바다가 되었다고 했다.");
  sub("'오작 봉인식'", "'두 별 봉인식'");
  sub("대방님이 오작의 힘으로", "대방님이 두 별의 힘으로");
  sub("오늘 밤 오작의 힘으로", "오늘 밤 두 별의 힘으로");
  sub("오작의 힘과 항아리에 모신 남켓몬", "두 별의 힘과 항아리에 모신 남켓몬");
  sub("오작이 갈라질 때 남은 빈 마음", "다리가 끊길 때 남은 빈 마음");
  sub("오작 전설을 더 찾아볼게요", "두 별의 전설을 더 찾아볼게요");
  for (const m of DATA.mons || []) if (m.dex && m.dex.includes("오작이 둘로 갈라질 때")) m.dex = m.dex.replace("오작이 둘로 갈라질 때", "까막까치 다리가 끊길 때");

  // ================================================================ 5) 대방의 정체 — 달그락
  rw("단지: 근데 형님, 그 높으신 분\n지팡이가요……\f대방님 황금 박 지팡이랑\n똑같이 생겼대요.", "단지: 근데 형님, 그 높으신 분\n지팡이가요……\f짚을 때마다 달그락,\n박씨 굴러가는 소리가 난대요.");
  rw("방삼: ……바보야!\f황금 박 지팡이가\n세상에 하나뿐이겠냐!", "방삼: ……바보야!\f지팡이에서 소리가 나면\n그게 딸랑이지 지팡이냐!");
  rw("방삼: ……하나뿐인가?", "방삼: ……어디서 들어 본\n소리 같기도 하고.");
  aft("???: 여러분, 반갑습니다.\f금박재단 이사장,\n변도진입니다.", () => say("이사장이 지팡이를 짚을 때마다\n달그락, 소리가 난다."));
  rw("붉은 인장 가면을 쓴 사람이\n황금 박 지팡이를 짚고 있다.\f가면 위로 금테 안경이\n번쩍인다……", "붉은 인장 가면을 쓴 사람이\n긴 지팡이를 짚고 있다.\f짚을 때마다 달그락,\n소리가 난다……");
  bef("대방이 붉은 인장 가면을\n천천히 벗었다……", () => say("달그락.\f대방의 지팡이 속에서\n박씨 굴러가는 소리가 났다."));

  // ================================================================ 6) 보름의 물음 · 7) 뜻풀이
  aft("보름: 그건 쉬는 게 아니잖아요!\f혼망울은 둥실둥실 날아다닐 때가\n제일 예뻤단 말이에요!", () => say("보름: 본디 자리로\n돌려보낸다면서요.\f그럼 항아리가 혼망울의\n본디 자리예요?"));
  rw("옹이: 나는 옹이.\n본디회의 마을 행수다.\f이 마당 항아리들,\n전부 내 손으로 빚었지.", "옹이: 나는 옹이.\n본디회의 마을 행수다.\f행수는 한 갈래 일을\n맡아 이끄는 사람이지.\f이 마당 항아리들,\n전부 내 손으로 빚었지.");
  aft("여울: 금박…… 재단?\f……대방님이 늘 고마운 후원자라고\n하시던, 그 재단?", () => say("여울: 대방님은 본디회에서\n가장 높은 어른이셔.\f……그분이 모르실 리가."));
  rw("훈장 어른: 허허, 어린 손님이로구나.\f나는 서당에서 아이들에게\n글을 가르치던 사람이다.\f본디회에서는 나를\n'훈장 어른'이라 부르지.",
    "훈장 어른: 허허, 어린 손님이로구나.\f나는 서당에서 아이들에게\n글을 가르치던 사람이다.\f본디회의 일곱 어른을\n'칠로'라고 하는데,\f그 가운데 나를\n'훈장 어른'이라 부르지.");

  // ================================================================ 8) 후원금 · 여울–조박사   4) 한결
  rw("한지 어른: 재단 돈이 어디서 와서\n어디로 가는지, 쭉 알아봤다.\f우리 칠로가 받던 '후원금'……\n그 돈으로 내 닥나무 밭이며\f마을 땅을 서류로만\n몽땅 사들이고 있었더구나.",
    "한지 어른: 재단 돈이 어디서 와서\n어디로 가는지, 쭉 알아봤다.\f우리 칠로에게 '후원금'을 주면서\n받아 간 도장과 이름을\f땅 서류에 몰래\n옮겨 찍었더구나.\f내 닥나무 밭이며 마을 땅을\n그렇게 서류로만 사들인 게야.");
  sub("한지 어른: 칠로 '후원금'으로\n마을 땅을 사들인 기록이오!", "한지 어른: '후원금' 도장을 옮겨 찍어\n마을 땅을 사들인 기록이오!");
  rw("조박사: 그리고 찾았지.\n여울이가 찾던 그 장부.", "조박사: 섬진강 나루에서\n여울이를 만났거든.\f강 쪽은 여울이가,\n서류 쪽은 선생님이 맡기로 했지.\f그리고 찾았어.\n여울이가 찾던 그 장부.");
  aft("교장 선생님: 그러니 걱정 마라.\n너는 혼자가 아니다.\f봉서를 열면 알게 될 게다.", () => say("교장 선생님: 여덟 마을에 보낼 편지는\n한결이에게 맡겼다.\f그 아이, 발 하나는\n빠르더구나."));
  aft("횃불 사이로 사람들이 쏟아져 나왔다.\f관장 선생님들, 한결, 여울,\n솔뫼, 마을 사람들까지……", async () => {
    await say("한결: 헉, 헉……\n안 늦었지!\f여덟 마을 다 뛰어서\n불러 왔어!");
    await say("한결: 오다가 강가에서\n여울 누나도 만났어.\f사진기를 들고 있더라.");
    await say("한결: 혼자 강하면\n다 될 줄 알았는데.\f오늘은 같이 버티는 날이잖아!");
  });

  // ================================================================ 10) 되풀이 줄이기
  rw("윤슬 박사: 오작교 이야기 알아요?\f칠월 칠석이면 까마귀와 까치가\n은하수에 다리를 놓아요.\f일 년 내내 떨어져 있던\n견우와 직녀가 만나는 날이죠.",
    "윤슬 박사: 오작교 이야기,\n훈장 어른께 들었죠?\f까막까치가 다리를 놓아\n견우와 직녀가 만나는\f칠석 이야기요.");
  sub("\f아흔아홉 우물 이야기도\n아이들한테 들려줬지.", "\f옛 우물 이야기도\n아이들한테 들려줬지.");
  { const e = MAPS.gyoryong && (MAPS.gyoryong.npcs || []).find(n => n.id === "gy_elder");
    const e2 = e || Object.values(MAPS).flatMap(m => m.npcs || []).find(n => n.id === "gy_elder");
    if (e2) e2.talk = "할아버지: 산성 이야기는\n배움터 선생님이 잘 아신단다.\f나는 그저 날마다 이 성벽을\n한 바퀴 도는 게 낙이지.";
    const alt = ["아주머니: 올해 농사는 풍년이야.\f김장철에 또 오렴.\n한 포기 줄게.", "이 집 창문을 열면\n고원 바람이 들어와.\f여름에도 이불을 덮고 잔단다.", "장독대는 날마다 닦아야\n장맛이 변하지 않는단다.", "고원 마을은 해가 일찍 져.\f저녁 먹고 나면\n벌써 별이 뜬단다.", "김장하는 날엔 온 마을이\n한 집에 모인단다.\f너도 오렴."];
    let seen = 0, k = 0;
    for (const m of Object.values(MAPS)) for (const n of m.npcs || []) if (typeof n.talk === "string" && n.talk.includes("배추")) {
      if (n.id === "r12_granny" || seen++ < 1) continue;
      if (k < alt.length) n.talk = alt[k++]; }
    for (const m of Object.values(MAPS)) for (const n of m.npcs || []) if (typeof n.talk === "string" && n.talk.includes("\f아흔아홉 우물 이야기도\n아이들한테 들려줬지."))
      n.talk = n.talk.replace("\f아흔아홉 우물 이야기도\n아이들한테 들려줬지.", "\f옛 우물 이야기도\n아이들한테 들려줬지.");
    window.__v264_baechu = k; }

  // ================================================================ 9) 산지기 넷 — 남켓몬센터에서 미리 만남
  const SJG = [
    { map: "center_jjok", id: "pre_haerang", spr: "haerang", flag: "pre_haerang",
      a: "???: 쉿.\n방금이 제일 무서운 대목이었는데.\f나는 이야기꾼 해랑.\n혼불 이야기를 모으러 왔어요.\f옛이야기 속 도깨비는\n끝까지 들어 준 사람한테\f꼭 선물을 남긴대요.\f……오방고원에서 또 만나면,\n내 이야기도 끝까지 들어 줘요.",
      b: "해랑: 이야기는 듣는 사람이\n있어야 이야기예요.\f오방고원에서 기다릴게요." },
    { map: "center_ssukbit", id: "pre_yeongran", spr: "gl_yeongran", flag: "pre_yeongran",
      a: "???: 후—\f운봉 고원 바람은\n숨 쉬기 딱 좋네요.\f나는 영란.\n바람 길을 따라 걷는 중이에요.\f바람은 억지로 붙잡으면\n손가락 사이로 빠져나가요.\f오방고원 꼭대기 바람도\n언젠가 같이 맞아 봐요.",
      b: "영란: 숨 한번 크게 쉬고 가요.\f……후—\n오방고원에서 봐요." },
    { map: "center_inwol", id: "pre_igeul", spr: "igeul", flag: "pre_igeul",
      a: "???: 인월장에 숯가루 사러 왔어!\n낙화놀이에 쓸 거!\f나는 이글.\n불꽃 올리는 사람이야.\f불꽃은 금방 지지만\n본 사람 마음엔 오래 남거든.\f……너 눈빛 좋다.\n오방고원에서 한 판 어때?",
      b: "이글: 오방고원에서\n제일 큰 불꽃 보여 줄게!\f어사패 다 모아서 와!" },
    { map: "center_wolbaek", id: "pre_seola", spr: "seola", flag: "pre_seola",
      a: "???: 반야봉 관측소의 설아야.\f산 위 날씨는 하루에도\n몇 번씩 바뀌어.\f오늘 관측 일지는\n'안개, 구상나무 숲 조용함'.\f날씨는 못 바꿔도\n옷은 단단히 여밀 수 있지.\f……오방고원 날씨도 내가 봐.\n올라오면 알게 될 거야.",
      b: "설아: 산에 갈 땐\n겉옷 하나 더 챙겨.\f오방고원은 더 춥거든." }];
  for (const s of SJG) { const m = MAPS[s.map]; if (!m) continue; m.npcs = m.npcs || [];
    m.npcs.push({ id: s.id, x: 10, y: 6, spr: s.spr, dir: "down", move: "fixed", show: () => !PG(), heart: "산지기(미리 만남)",
      talk: async () => { if (!F(s.flag)) { G.flag(s.flag, true); await say(s.a); } else await say(s.b); } }); }

  // ================================================================ 엔딩 나) 가람의 내일
  const GQ2 = ["행복할 거야", "물어봐야 알지", "잘 모르겠어"], GQ5 = ["행복해!", "같이 물어보자", "잘 모르겠어"], GQN = ["우리가 같이 놓자", "한 사람 한 사람이", "잘 모르겠어"];
  const FUT = ["walk", "school", "mountain"];              // 보기 차례 = 길동무 · 학교 · 지리산
  function future() {
    const v = []; if (G.flags.gq2) v.push(G.flags.gq2 - 1); if (G.flags.gq5) v.push(G.flags.gq5 - 1);
    const night = G.flag("garam_q") ? (G.flags.garam_q_ans || 0) : null; if (night !== null) v.push(night);
    if (!v.length) return "walk";
    const c = [0, 0, 0]; for (const i of v) c[i]++;
    const mx = Math.max(...c);
    if (night !== null && c[night] === mx) return FUT[night];
    for (let i = v.length - 1; i >= 0; i--) if (c[v[i]] === mx) return FUT[v[i]];
    return FUT[c.indexOf(mx)];
  }
  aft("가람: 남켓몬은 볼 속에서\n무슨 꿈을 꿀까?\f……사람 곁에 있으면\n행복할까?", async () => {
    if (G.flags.gq2) return;
    const i = await ask("가람: 너는 어떻게 생각해?", GQ2); G.flags.gq2 = i + 1;
    await say(["가람: ……바로 대답하네.\n조금 부럽다.", "가람: 물어본다고?\f……사람이, 남켓몬한테?", "가람: ……나도 그래.\n그래서 듣고 있는 거야."][i]);
  });
  AFTP.push({ test: s => /^가람: [^\n]+\.\n네 남켓몬은 행복해\?$/.test(s), run: async () => {
    if (G.flags.gq5) return;
    const i = await ask("(뭐라고 대답할까?)", GQ5); G.flags.gq5 = i + 1;
    await say(["가람: ……망설이지도 않네.", "가람: 같이……?\f……그건 생각 못 했어.", "가람: ……솔직하구나."][i]);
  } });
  rw("가람: ……같이 걸어 줄래?", () => F("ending_now") ? ({
    walk: "가람: ……같이 걸어 줄래?\f다음 마을에는 내가 먼저\n가서 기다릴게.",
    school: "가람: 조박사님이 그러셨어.\f덕과 아카데미에 빈자리가\n하나 있다고.\f……내일부터 같은 반이야.\n모르는 건, 물어봐도 돼?",
    mountain: "가람: 나는 지리산에 남을게.\n본디 자리 지킴이로.\f대신 엽서를 쓸게.\n……답장, 해 줄래?" })[future()] : "가람: ……같이 걸어 줄래?");
  const MOM_LAST = "엄마: 참, 오작교에서 만난 가람이가\n한 판 겨뤄 보고 싶대.\f윤슬 박사님도 전설 남켓몬\n소문을 들었다더라.";
  rw(MOM_LAST, () => ({
    walk: MOM_LAST,
    school: "엄마: 참, 가람이라는 아이가\n너희 반에 전학 온다며?\f오작교에서 한 판\n겨뤄 보고 싶대.\f윤슬 박사님도 전설 남켓몬\n소문을 들었다더라.",
    mountain: "엄마: 참, 지리산에서\n엽서가 왔더라.\f가람이라는 아이가\n오작교에서 한 판 겨루재.\f윤슬 박사님도 전설 남켓몬\n소문을 들었다더라." })[future()]);
  ITEMS.garam_card = { n: "가람의 엽서", p: "key", ic: "jp_card", d: "지리산에서 가람이 보낸 엽서. 구상나무 숲 그림이 그려져 있어요.",
    read: async () => { await say("가람의 엽서.\f'구상나무에 새순이 났어.\f남켓몬들이 그러는데\n올해는 눈이 늦게 녹았대.'"); await say("'모르는 게 생기면\n또 쓸게.\f칠석에 오작교에서 만나.'"); } };
  aft(MOM_LAST, async () => { if (future() === "mountain" && !hasI("garam_card")) await getItem("garam_card"); });
  MAPS.class.npcs.push({ id: "garam_class", x: 4, y: 7, spr: "garam", dir: "up", move: "fixed", heart: "가람(교실)", show: () => PG() && future() === "school",
    talk: () => say("가람: ……이 자리,\n창밖으로 운동장이 보여.\f남켓몬 목소리도, 아이들 목소리도\n같이 들려.\f시끄러운데……\n나쁘지 않아.") });

  // ================================================================ 엔딩 다) 어사의 한마디
  const EOSA = ["가져간 것부터 돌려주세요", "이번엔 직접 심어 보세요", "마을 사람들한테 물어보세요"];
  const ew = () => G.flags.eosa_word || 2;                 // 예전 기록 = 지금까지의 끝맺음(박씨)
  bef("교장 선생님: 남은 일은 어른들이\n하겠소.\f매립한 강, 사들인 땅,\n모두 마을 사람들과 함께 바로잡읍시다.", async () => {
    if (G.flags.eosa_word) return;
    await say(`${G.name}의 손에는 아직\n마패가 들려 있다.`);
    const i = await ask("변도진에게 한마디 한다면?", EOSA); G.flags.eosa_word = i + 1;
    await say(["변도진: ……돌려주마.\f강도, 밭도,\n서류 한 장까지.", "변도진: ……심는다, 라.\f쉰 해 만에 받는\n숙제로구나.", "변도진: ……물어본 적이\n한 번도 없었지.\f서류에는 그런 칸이\n없었으니."][i]);
  });
  const byE = (k, a, c) => rw(k, () => ew() === 1 ? a : ew() === 3 ? c : k);
  byE("변도진: 이 밭 한 이랑만 빌려서\n박씨를 심고 있다.", "변도진: 돌려준 땅마다\n팻말을 박는 중이다.\f'이 땅은 마을 것'.\n측량 말뚝을 박던 손으로 말이지.", "변도진: 어제는 마을 회의에\n나가 보았다.\f맨 뒷자리에 앉아\n듣기만 했지.");
  byE("변도진: 쉰 해 동안 제비를\n기다리기만 했지.\f……이번엔 내가\n심어 보려고.", "변도진: 사들이는 데는 하루,\n돌려주는 데는 한 철이 걸리더구나.\f……그래도 끝까지 하마.", "변도진: 이 터에 뭘 지을지는\n마을이 정한다더구나.\f……처음으로, 내 서류에\n남의 목소리를 적었다.");
  byE("변도진: 너도 박씨를 심었다고?\f……그럼 봄에 누구 박이\n먼저 열리나 보자꾸나.", null, null);
  byE("변도진: 박 덩굴은 지붕까지\n올라간다지.\f……천천히 기다려 보마.", "변도진: 팻말이 아직\n열두 개 남았다.\f……천천히, 끝까지 박으마.", "변도진: 다음 회의는\n보름날이라더구나.\f……이번에도 뒷자리에서\n듣고 오마.");

  // ================================================================ 엔딩 라) 오작교의 길이
  const CHILF = ["chil_sangsoe", "chil_ssiat", "chil_hunjang", "chil_daemok"];
  const birds = () => (window.JP_V259 ? window.JP_V259.jpCount() : 0) + CHILF.filter(k => F(k)).length;
  const BR_NEED = 8;
  const brFull = () => birds() >= BR_NEED;
  const BR0 = "까마귀와 까치 떼가 날아올라\n밤하늘에 다리를 놓았다.";
  rw(BR0, () => !F("ending_now") ? BR0 : brFull() ? BR0 + "\f다리는 은하수 이 끝에서 저 끝까지\n환하게 이어졌다!" : BR0 + "\f……다리는 은하수 한가운데에서\n멈추었다.");
  aft(BR0, async () => {
    if (!F("ending_now")) return;
    G.flags.bridge = brFull() ? 1 : 2;
    if (!brFull()) await say(`가람: 새가 조금 모자라네.\f${birds()}가지 이야기가\n놓은 다리야.\f……괜찮아. 남은 자리는\n같이 마저 놓자.`);
  });
  aft("(이야기는 여기서 끝이지만\n모험은 계속돼요!\f오방고원 리그에 다시 도전하거나\n도감을 채워 보세요.)", async () => {
    if (G.flags.bridge === 2) await say(`(오작교는 아직 반쪽이에요.\f정표와 칠로 어른들의 이야기를\n${BR_NEED}가지 넘게 모아\f오작교의 가람에게 가면\n다리가 마저 놓여요.)`);
  });
  async function bridgeDone() {                            // 엔딩 뒤 오작교에서: 모자랐던 다리가 마저 놓임
    if (!PG() || G.flags.bridge === 1 || !brFull()) return false;
    G.flags.bridge = 1;
    await say("가람: ……왔구나.\n새들이 다 모였어.");
    if (typeof endFx === "function") endFx("bridge");
    try { sfx("fx_wing"); } catch (e) {}
    await say("까마귀와 까치 떼가 다시 날아올라\n은하수 끝까지 다리를 이었다!");
    await say("가람: 내년 칠석까지\n안 기다려도 되겠네.\f……다 네가 이어 온\n이야기들이야.");
    try { END_FX = null; } catch (e) {}
    return true;
  }
  { const EG = (MAPS.world.npcs || []).find(n => n.id === "end_garam");
    if (EG) { const t0 = EG.talk;
      EG.talk = async (...a) => {
        if (F("ending_now")) return typeof t0 === "function" ? t0(...a) : say(t0);
        if (await bridgeDone()) return;
        await say(({ walk: "가람: 먼저 와서 기다렸어.\f다음 마을로 떠나기 전에\n얼굴 보려고.", school: "가람: 학교 끝나고 바로 왔어.\f오늘은 손 들고\n질문도 했어.", mountain: "가람: 지리산에서 내려왔어.\f엽서로는 다 못 쓴\n이야기가 있어서." })[future()]);
        return typeof t0 === "function" ? t0(...a) : say(t0);
      }; } }

  // ================================================================ 엔딩 가) 네 갈래 지킴이
  const VIS = ["ongi", "yeoul", "solmoe", "sori"];
  VIS.forEach((spr, i) => MAPS.world.npcs.push({ id: "end_v" + i, x: 7, y: 13, spr, dir: "right", move: "fixed", hidden: true,
    show: () => F("ending_now") && way() === i }));
  const HOF0 = "조박사: ……이제 진짜 졸업이네.\f근데 졸업은 끝이 아니라\n'시작'이라는 뜻도 있대.";
  aft(HOF0, async () => {
    await wayFallback("조박사");
    const w = way(); if (w === null) return;
    await say(`조박사: 졸업장에 한 줄 적었어.\f'${G.name} — ${WAYS[w].t}'.`);
    await say(["조박사: 운동화가 다 닳도록\n다닌 사람한테 주는 말이야.", "조박사: 막힌 데를 그냥\n못 지나치는 사람한테 주는 말이야.", "조박사: 먼저 가서 보고 오는\n사람한테 주는 말이야.", "조박사: 먼저 묻고 기다리는\n사람한테 주는 말이야."][w]);
  });
  aft("가람: 나도 건너 볼게.\n사람 쪽으로.", async () => {
    if (!F("ending_now")) return;
    await wayFallback("가람");
    const w = way(), P = P_(), V = act("end_v" + w), GR = act("end_garam");
    await say(["가람: 너는 늘 써 보자고 했지.\n닳아도 괜찮다고.\f나도 이 신이 닳을 때까지\n걸어 볼게.", "가람: 너는 늘 막지 말자고 했지.\n흐르게 두자고.\f나도 한곳에 고여 있지\n않으려고.",
      "가람: 너는 늘 먼저 가서\n보자고 했지.\f나는 듣기만 했어.\n이제 눈으로도 볼게.", "가람: 너는 늘 먼저\n물어보자고 했지.\f내 귀는 남켓몬 쪽으로만\n열려 있었어.\f이제 사람 말도 들어 볼게."][w]);
    if (V) { V.hidden = false; await walk(V, "right", "right"); face(V, P); face(P, V); }
    if (w === U) { await say("옹이: 가마에 다시 불을 넣었다.\f아이들이 빚은 그릇은\n죄다 삐뚤빼뚤한데……\f그게 제일 먼저 팔리더라."); await say("옹이: 너도 와서 하나 빚어라.\n쓰다가 이가 빠져도 좋으니."); }
    else if (w === FL) { await say("여울: 요천 물이 맑아졌어.\f내일 청소, 너도 올 거지?"); await say("여울: 한결이는 벌써\n장화 신고 기다려.\f강은 흘러야 하니까."); }
    else if (w === LK) { await say("솔뫼: 산길 안내를 시작했다.\f첫 손님은 너로 하지."); await say("솔뫼: 구상나무 숲에\n새순이 났는지,\f같이 살피러 가자."); }
    else { await say("소리 어른: 들어 주는 이가\n이리 많으니,\f한 소리 해야겠구나."); await say("보름: 얼씨구!\f……나 이거 찍어도 돼요?\n아, 먼저 물어봐야지!"); }
    if (GR) face(P, GR);
  });
  aft("엄마: 오늘 저녁은 추어탕이야.\f월매댁에서 두 그릇이나\n공짜로 줬지 뭐니.", async () => {
    const w = way(); if (w === null) return;
    await say(["엄마: 네 운동화,\n또 다 닳았더라.\f……그만큼 많이\n걸었다는 거지?", "엄마: 내일 요천 청소한다며?\n장화는 현관에 내놨어.", "엄마: 책상 위 관찰 일지,\n조금 읽었어.\f……별걸 다 적어 놨더라.", "엄마: 오늘은 엄마가 들을게.\f여행 이야기,\n처음부터 다 해 줘."][w]);
  });

  window.STORY_V264 = { WAYS, QS, way, future, birds, brFull, BR_NEED, EOSA, resolve: k => { let t = RW.has(k) ? RW.get(k) : k; if (typeof t === "function") t = t(); return t; }, keys: () => [...RW.keys(), ...AFT.keys(), ...BEF.keys(), ...SUB.map(s => s[0])],
    texts: () => { const o = []; const add = v => { if (typeof v === "string") o.push(v); };
      for (const v of RW.values()) add(v); for (const s of SUB) add(s[1]);
      for (const q of QS) { add(q.q); q.re.forEach(add); q.opts.forEach(x => { add(x[0]); add(q.back(x[0])); }); }
      for (const s of SJG) { add(s.a); add(s.b); } return o; } };
})();
