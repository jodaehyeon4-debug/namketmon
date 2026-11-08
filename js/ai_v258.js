// ===== v2.58 실전 배틀 느낌 — 트레이너 배틀을 실제 대전처럼 =====
// 사용자: "난이도 전반적으로 실전배틀 느낌 나게 바꾸면 좋겠어.
//   1. 상성 보고 교체플 함  2. 지닌도구 실전도구 많이 낌  3. 레벨스케일 나보다 -2~+4 정도  4. 쓰는 기술도 약점보완 가능하도록."
// 1) 교체: 실력자(지킴이·라이벌·행수·산지기·챔피언)는 지금 남켓몬이 불리하면(내 남켓몬에게 크게 맞고 저는 별로 못 때림)
//    더 잘 버티고 잘 때리는 동료로 바꿈 · 쓰러지면 다음 동료도 상성을 보고 고름(에이스는 마지막)
// 2) 지닌 도구: 실력자 남켓몬은 역할에 맞는 실전 도구(질끈띠·누룽지·도깨비구슬·누비조끼·밤송이투구·명인띠·타입 강화…)를 한 종류씩
//    보통 트레이너도 가끔 나무열매
// 3) 레벨: 내 파티에서 가장 높은 레벨을 기준으로 실력자는 −2~+4(에이스가 +4), 보통 트레이너는 −2~+1
//    다만 이야기에서 정한 레벨의 −15%(최대 −6) ~ +3%(최소 +1) 안에서만(덜 키운 아이는 조금 쉬워지고, 더 키우면 앞설 수 있게)
//    경험치·상금은 이야기에서 정한 레벨로 셈(m.xlv) — 키우는 속도(레벨 곡선)는 v2.57 그대로
//    (그 레벨이면 진화했을 남켓몬은 진화한 모습으로) · 배틀누각은 그대로 Lv50
// 4) 기술: 같은 타입 센 기술 + 자기 약점 타입을 잡는 기술(기술머신으로 배울 수 있는 것까지) · 깊이 3은 능력 올리기·상태 이상 하나
// 설정 '트레이너 실력': 실전(기본) / 보통(v2.57처럼 — 이야기에서 정한 팀·레벨, 교체 없음). 실제 게임 BW2의 챌린지 모드·이지 모드처럼
"use strict";
(() => {
  if (Save.opt.real == null) Save.opt.real = 1;
  const realOn = () => !window.NK_BOT && Save.opt.real !== 0;
  const off = k => (window.V258OFF || "").includes(k);          // 측정용: lv·item·mv·sw 하나씩 끄기
  const tierOf = T => { const v = T && (T.smart != null ? T.smart : (typeof SMART_CLS !== "undefined" ? SMART_CLS[T.cls] : 0)); return v === true ? 2 : v || 1; };
  const tcMul = (mt, types) => types.reduce((a, x) => a * ((TC[mt] && TC[mt][x]) ?? 1), 1);
  const ALLT = Object.keys(TC);

  // ---------------- 3) 레벨 ----------------
  // 측정(test/sim58b.sh: 스타팅+동료, 회복약, 상성 아는 아이 70%)으로 정함: 이야기 레벨 위로 3%까지 · 기술머신 위력 70(깊이 2)·80(깊이 3)까지
  //   보통(v2.57)보다 조금 어렵고, 스타팅이 3레벨 더 높으면 보통과 비슷하거나 쉬워짐 — 키우면 넘을 수 있게
  let UP = 0.03, TMBP = 70, HI2 = 4, HI3 = 4, TMBP3 = 80;                                                   // 이야기 레벨 위로는 5%까지(측정으로 정함 — 더 키우면 앞설 수 있게)
  function refLevel() { const L = (G.party || []).map(m => m.lv || 1); return L.length ? Math.max(...L) : 5; }
  function evolveFor(k, lv) {
    for (let i = 0; i < 3; i++) { const m = MON[k]; if (!m) return k;
      const e = (m.evo || []).find(x => typeof x[1] === "number" && lv >= x[1] && MON[x[0]]); if (!e) return k; k = e[0]; }
    return k;
  }
  function scaleTeam(T) {
    const tier = tierOf(T), [lo, hi] = tier >= 3 ? [-2, HI3] : tier >= 2 ? [-2, HI2] : [-2, 1], ref = refLevel();
    const L = T.team.map(e => e[1]), dmin = Math.min(...L), dmax = Math.max(...L);
    return T.team.map(([k, lv, o], i) => {
      const rel = dmax === dmin ? (i === T.team.length - 1 ? 1 : 0.5) : (lv - dmin) / (dmax - dmin);   // 레벨이 다 같으면 마지막만 에이스
      // 이야기 레벨에서 너무 멀어지지는 않게(설계 −6 ~ +12, 처음엔 더 좁게 — 첫 라이벌 Lv5는 6까지만): 덜 키운 아이는 조금 쉬워지고, 아주 많이 키우면 결국 앞설 수 있음
      const up = Math.max(1, Math.round(lv * UP)), dn = Math.min(6, Math.max(2, Math.round(lv * 0.15)));
      const nl = Math.max(2, Math.min(100, lv + up, Math.max(lv - dn, Math.round(ref + lo + rel * (hi - lo)))));
      return [o && o.keepForm ? k : evolveFor(k, nl), nl, o];
    });
  }

  // ---------------- 4) 기술 ----------------
  const SETUP = ["swordsdance", "calmmind", "bulkup", "nastyplot", "dragondance", "quiverdance", "nalgaeot", "growth", "irondefense", "coil", "shellsmash", "workup"];
  const STATUS = ["thunderwave", "willowisp", "toxic", "sleeppowder", "stunspore", "spore", "yawn", "hypnosis", "leechseed"];
  const RECOVER = ["recover", "roost", "synthesis", "softboiled", "slackoff", "moonlight", "morningsun", "milkdrink", "shoreup"];
  const BAD = new Set(["struggle", "transform", "selfdestruct", "explosion", "memento", "finalgambit", "focuspunch", "dreameater", "snore", "sleeptalk", "lastresort", "belch", "naturalgift", "fling", "endeavor", "counter", "mirrorcoat", "metalburst", "bide"]);
  const CHARGE2 = new Set(["solarbeam", "skyattack", "razorwind", "skullbash", "fly", "dig", "dive", "bounce", "phantomforce", "shadowforce", "hyperbeam", "gigaimpact", "blastburn", "hydrocannon", "frenzyplant", "rockwrecker", "meteorbeam"]);
  function pool(k, lv, tm) {
    const S = new Set();
    for (const [l, id] of MON[k].ml) if (l <= lv && MV[id]) S.add(id);
    // 기술머신: 약점 보완용 — 깊이 2는 위력 TMBP까지, 깊이 3(산지기·챔피언·조박사)은 TMBP3까지
    if (tm && typeof tmOk === "function") for (const it of Object.values(ITEMS)) if (it && it.tm && MV[it.tm] && !it.hm && tmOk({ k }, it.tm) && (MV[it.tm].bp || 0) <= (tm >= 3 ? TMBP3 : TMBP)) S.add(it.tm);
    return [...S].filter(id => !BAD.has(id));
  }
  function power(k, id) {
    const M = MON[k], X = MV[id]; if (!X || X.c === "X" || !X.bp) return 0;
    const atk = X.c === "P" ? M.s[1] : M.s[3], best = Math.max(M.s[1], M.s[3]);
    const hits = X.hits ? (Array.isArray(X.hits) ? (X.hits[0] === 2 && X.hits[1] === 5 ? 3 : X.hits[0]) : X.hits) : 1;
    let p = X.bp * hits * Math.min(1, (X.acc > 100 ? 100 : X.acc || 100) / 100) * (M.t.includes(X.t) ? 1.5 : 1) * (atk / best);
    if (X.recoil) p *= 0.9; if (CHARGE2.has(id)) p *= 0.5; if (X.pri > 0) p *= 0.85;
    return p;
  }
  function weakTypes(k) { const t = MON[k].t; return ALLT.filter(a => tcMul(a, t) > 1); }
  function buildSet(k, lv, tier, authored) {
    const P = pool(k, lv, tier >= 2 ? tier : 0), M = MON[k], W = weakTypes(k);   // 보통 트레이너는 레벨로 배우는 기술만, 실력자는 기술머신 기술까지
    const dmg = P.filter(id => power(k, id) > 0).sort((a, b) => power(k, b) - power(k, a));
    const covers = id => W.filter(w => (TC[MV[id].t] || {})[w] === 2);
    const out = [];
    const keep = (authored || []).filter(id => MV[id] && (MV[id].orig || (typeof WX_MV !== "undefined" && WX_MV[id]) || (MV[id].c !== "X" && power(k, id) >= 60) || (MV[id].c === "X" && !MV[id].b) || (MV[id].b && Object.values(MV[id].b).some(v => v > 0))));
    for (const id of keep) if (!out.includes(id) && out.length < 4) out.push(id);
    // 같은 타입 센 기술(타입마다 하나)
    for (const t of M.t) { if (out.some(id => MV[id].t === t && MV[id].c !== "X")) continue; const s = dmg.find(id => MV[id].t === t); if (s && out.length < 4) out.push(s); }
    // 약점 보완: 내 약점 타입을 잘 때리는 기술
    const need = () => W.filter(w => !out.some(id => MV[id].c !== "X" && (TC[MV[id].t] || {})[w] === 2));
    for (let g = 0; g < 2 && out.length < 4 && need().length; g++) {
      let best = null, bs = 0;
      for (const id of dmg) { if (out.includes(id) || out.some(o => MV[o].t === MV[id].t)) continue;
        const c = covers(id).filter(w => need().includes(w)).length; if (!c) continue;
        const sc = c * 40 + power(k, id); if (sc > bs) { bs = sc; best = id; } }
      if (best) out.push(best); else break;
    }
    // 깊이 3: 능력 올리기·회복·상태 이상 하나
    if (tier >= 3 && out.length < 4 && !out.some(id => MV[id].c === "X")) {
      const phys = M.s[1] >= M.s[3];
      const su = P.find(id => SETUP.includes(id) && MV[id].b && ((phys && (MV[id].b.atk > 0)) || (!phys && (MV[id].b.spa > 0))));
      const st = P.find(id => STATUS.includes(id)), rc = P.find(id => RECOVER.includes(id));
      const pickX = (M.s[0] + M.s[2] + M.s[4] > 270 && rc) || su || st || rc; if (pickX) out.push(pickX);
    }
    for (const id of dmg) { if (out.length >= 4) break; if (!out.includes(id) && !out.some(o => MV[o].t === MV[id].t && power(k, o) >= power(k, id))) out.push(id); }
    for (const id of dmg) { if (out.length >= 4) break; if (!out.includes(id)) out.push(id); }
    return out.length ? out.slice(0, 4) : movesAt(k, lv);
  }

  // ---------------- 2) 지닌 도구 ----------------
  const TB = {}; for (const [id, it] of Object.entries(ITEMS)) if (it.hold === "tb" && it.tb && !TB[it.tb]) TB[it.tb] = id;
  function pickItem(k, moves, used, ace) {
    const s = MON[k].s, bulk = s[0] + s[2] + s[4], phys = s[1] >= s[3], fast = s[5] >= 90, frail = bulk < 200;
    const hasX = moves.some(id => MV[id] && MV[id].c === "X"), setup = moves.some(id => SETUP.includes(id));
    const stab = moves.map(id => MV[id]).filter(X => X && X.c !== "X" && MON[k].t.includes(X.t)).map(X => X.t);
    const c = [];
    if (setup || (ace && bulk < 270)) c.push("lifeorb");        // 튼튼한 에이스는 누룽지 쪽
    if (fast && frail) c.push("focussash");
    if (bulk >= 270) c.push("nurungji");
    if (bulk >= 240 && s[2] >= s[4] && s[2] >= 85) c.push("rockyhelmet");
    if (!hasX && s[4] >= 80 && bulk >= 230) c.push("assaultvest");
    if (stab.length && TB[stab[0]]) c.push(TB[stab[0]]);
    c.push(phys ? "muscleband" : "wiseglasses", "expertbelt", "mogwa", "omija", "scopelens", "shellbell", "quickclaw");
    return c.find(id => ITEMS[id] && !used.has(id)) || null;
  }

  // ---------------- 트레이너 팀 만들기(battle.js trainerFoe를 덮음) ----------------
  const tf0 = trainerFoe;
  trainerFoe = function (T) {
    if (!T || !T.team || T.noScale || !realOn()) return tf0(T);          // 보통 · NK_BOT(이야기 흐름 시험 봇: 상처약·교체를 안 씀)은 예전처럼
    const tier = tierOf(T);
    const team = off("lv") ? T.team.map(e => e.slice()) : scaleTeam(T);
    const S = Object.assign({}, T, { team: team.map(([k, lv, o]) => {
      o = Object.assign({}, o || {});
      if (o.mv && o.mv.includes("transform")) { /* 둔갑이(변신)는 변신만 */ }
      else if (off("mv")) { /* 측정용 */ }
      else if (o.mv && tier >= 2) o.mv = buildSet(k, lv, tier, o.mv);
      else if (!o.mv) o.mv = buildSet(k, lv, tier, null);
      if (o.ab && !(MON[k].ab[0].includes(o.ab) || MON[k].ab[1] === o.ab)) delete o.ab;          // 진화해서 그 종에 없는 특성
      return [k, lv, o]; }) });
    const foe = tf0(S);
    foe.forEach((m, i) => { m.xlv = T.team[i][1]; });          // 경험치·상금은 이야기에서 정한 레벨로(레벨을 맞춰도 키우는 속도는 그대로)
    // 지닌 도구
    const used = new Set();
    for (const m of foe) if (m.item) { if (used.has(m.item) && tier >= 2) m.item = null; else used.add(m.item); }   // 실력자 팀은 같은 도구를 겹쳐 들지 않음(실제 대전 규칙처럼)
    const aceLv = Math.max(...foe.map(m => m.lv));
    if (!off("item")) foe.forEach((m, i) => {
      if (m.item) return;
      if (tier >= 2) { const id = pickItem(m.k, m.moves.map(x => x.id), used, m.lv === aceLv && i === foe.length - 1); if (id) { m.item = id; used.add(id); } }
      else if (Math.random() < 0.3) m.item = pick(["mogwa", "jujube", "omija"].filter(id => ITEMS[id]));
    });
    foe.ace = foe.length - 1;
    return foe;
  };

  // ---------------- 1) 교체 ----------------
  const BP = Battle.prototype;
  BP.mScore = function (Ew, Pw) {                // 이 남켓몬이 지금 상대(P)와 붙으면 얼마나 좋은지
    if (!Pw || !Pw.m || Pw.m.hp <= 0) return 0;
    const off = Math.max(0, ...Ew.m.moves.filter(x => x.pp > 0).map(x => this.aiDmg(Ew, Pw, x.id))) / Math.max(1, Pw.m.hp);
    const thr = Math.max(0, ...Pw.m.moves.filter(x => x.pp > 0).map(x => this.aiDmg(Pw, Ew, x.id))) / Math.max(1, Ew.m.hp);
    const fast = this.speed(Ew) >= this.speed(Pw);
    return { off: Math.min(1.5, off), thr: Math.min(1.5, thr), fast, sc: Math.min(1.5, off) * (fast ? 1.2 : 1) - Math.min(1.5, thr) * (fast ? 0.8 : 1.1) };
  };
  BP.aiSwitch = function (E) {
    if (this.wild || !this.o.trainer || this.aiTier() < 2 || this.o.noSwitch || !realOn() || off("sw")) return null;
    const P = this.w.P; if (!E || !E.m || E.m.hp <= 0 || !P || P.m.hp <= 0 || this.forced(E)) return null;
    if (this.trapped(E) || (this.turnNo || 0) - (E.inT || 0) < 1) return null;
    const tier = this.aiTier(), cap = tier >= 3 ? 4 : 2; this.swN = this.swN || 0; if (this.swN >= cap) return null;
    const cur = this.mScore(E, P);
    const allBad = cur.off < 0.12;
    if (!(cur.thr >= 0.55 && cur.off < 0.6) && !allBad) return null;
    if (cur.fast && cur.off >= cur.thr) return null;                            // 먼저 쓰러뜨릴 수 있으면 그대로
    let best = -1, bs = -9;
    this.foe.forEach((m, i) => { if (i === this.ei || m.hp <= 0) return;
      if (i === (this.foe.ace != null ? this.foe.ace : this.foe.length - 1) && this.foe.filter((q, j) => q.hp > 0 && j !== this.ei).length > 1) return;   // 에이스는 아껴 둠
      const r = this.mScore(this.mkW("E", m), P);
      if (r.thr <= cur.thr * 0.6 && r.sc > bs) { bs = r.sc; best = i; } });
    if (best < 0 || bs < cur.sc + 0.35) return null;
    return Math.random() < (tier >= 3 ? 0.85 : 0.6) ? best : null;
  };
  BP.trainerSwitch = async function (i) {
    const T = this.o.trainer, E = this.w.E, m = E.m;
    this.swN = (this.swN || 0) + 1;
    await this.say(`${T.cls} ${J(T.name, "은")}\n${J(mname(m), "을")} 불러들였다!`, { auto: 300 });
    if (m.abT) { m.ab = m.abT; delete m.abT; }
    if (m.ab === "naturalcure") m.status = null;
    if (m.ab === "regenerator") m.hp = Math.min(m.st[0], m.hp + Math.floor(m.st[0] / 3));
    this.box.E.vis = false; await this.withdraw("E");
    await this.sendOut("E", i, false);
  };
  // 쓰러진 뒤 다음 남켓몬: 상성을 보고(에이스는 마지막)
  BP.aiNext = function () {
    const alive = this.foe.map((m, i) => i).filter(i => this.foe[i].hp > 0); if (!alive.length) return -1;
    if (this.wild || !this.o.trainer || this.aiTier() < 2 || !realOn()) return alive[0];
    const P = this.w.P, ace = this.foe.ace != null ? this.foe.ace : this.foe.length - 1;
    const pool = alive.length > 1 ? alive.filter(i => i !== ace) : alive;
    if (!P || P.m.hp <= 0) return pool[0];
    let best = pool[0], bs = -9;
    for (const i of pool) { const r = this.mScore(this.mkW("E", this.foe[i]), P); if (r.sc > bs) { bs = r.sc; best = i; } }
    return best;
  };
  // 실력자에게 두 번 지면 한 번만: 설정에서 '보통'으로 바꿀 수 있다고 알려 줌
  const tb0 = trainerBattle;
  trainerBattle = async function (a, spotted) {
    const r = await tb0(a, spotted);
    if (r === "lose" && realOn() && a && a.trainer && !a.trainer.canLose && tierOf(a.trainer) >= 2) {
      G.flags.realLose = (G.flags.realLose || 0) + 1;
      if (G.flags.realLose >= 2 && !G.flag("tip_real")) { G.flag("tip_real", true);
        await say("(도움말) 이 게임의 지킴이·라이벌은\n실제 대전처럼 싸워요.\f내 레벨에 맞춰 나오고, 불리하면 교체하고,\n실전 도구도 지니고 있어요.\f너무 어렵다면 메뉴 → 설정 →\n'트레이너 실력'을 '보통'으로 바꿀 수 있어요."); }
    }
    return r;
  };
  window.TRAINER_V258 = { refLevel, scaleTeam, buildSet, pickItem, evolveFor, tierOf, realOn, set: (u, b, h2, h3) => { if (u != null) UP = u; if (b != null) TMBP = b; if (h2 != null) HI2 = h2; if (h3 != null) HI3 = h3; }, set3: b3 => { TMBP3 = b3; } };
})();
