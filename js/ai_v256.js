// ===== v2.56 스토리 난이도: '실력자' 트레이너(관장·라이벌·산지기·행수…) — 실제 게임처럼 =====
// 사용자: "난이도 조정좀 하자 스토리. 너무 쉬움. 특히 3~4관장."
// - 실력자 생각: 아무 기술이나 고르는 일(보통 트레이너 25%)이 없고, 데미지를 어림해서
//     · 쓰러뜨릴 수 있으면 확실한(빠른·잘 맞는) 기술로 쓰러뜨림
//     · 상대가 멀쩡하면 잠듦·마비·화상 같은 상태 이상을 먼저 걺 · HP가 넉넉할 때 능력을 올림
//     · HP가 줄면 회복 기술 · 이미 걸린 상태 이상·소용없는 기술은 고르지 않음
// - 관장 회복약: 실제 게임 관장처럼 HP가 1/4 아래로 떨어지면 정해진 회복약(T.items)을 씀 — 그 턴은 기술 대신
"use strict";
// 생각의 깊이(T.ai): 1 = 보통 트레이너(예전 그대로) · 2 = 배움터 지킴이·라이벌·행수(데미지를 어림해 고르고 쓰러뜨릴 수 있으면 쓰러뜨림, 변화 기술은 가끔)
//                 3 = 산지기·챔피언·누각지기(변화 기술·회복·능력 올리기까지 때맞춰 다 씀)
const SMART_CLS = { "지킴이": 2, "관장": 2, "라이벌": 2, "본디회 행수": 2, "본디 자리 지킴이": 2, "금박재단 이사장": 2, "본디회의 도령": 2, "산지기": 3, "챔피언": 3, "누각지기": 3 };
const AI_HEAL = new Set(["synthesis", "moonlight", "morningsun", "recover", "slackoff", "milkdrink", "roost", "softboiled", "shoreup", "healorder", "rest", "strengthsap", "wish"]);
const AI_CONF = new Set(["confuseray", "supersonic", "sweetkiss", "swagger", "flatter", "teeterdance"]);
const AI_IMMUNE = { levitate: ["땅"], flashfire: ["불꽃"], waterabsorb: ["물"], voltabsorb: ["전기"], sapsipper: ["풀"], motordrive: ["전기"], lightningrod: ["전기"], stormdrain: ["물"], dryskin: ["물"] };

Battle.prototype.aiTier = function () { const t = !this.wild && this.o.trainer; if (!t) return 1; const v = t.smart != null ? t.smart : SMART_CLS[t.cls] || 1; return v === true ? 2 : v === false ? 1 : v; };
Battle.prototype.isSmart = function () { return this.aiTier() >= 2; };

// ---- 데미지 어림(실제 데미지 식 calc를 그대로 씀 · 난수 폭이 곧 작은 망설임) ----
Battle.prototype.aiDmg = function (w, d, id) {
  const X = this.moveFor(w, id), D = d.m; if (!X || X.c === "X") return 0;
  const mul = this.typeMul(X.t, d, id); if (!mul) return 0;
  const dab = w.m.ab === "moldbreaker" ? "" : D.ab;
  if (AI_IMMUNE[dab] && AI_IMMUNE[dab].includes(X.t)) return 0;
  if (dab === "soundproof" && X.snd) return 0;
  if (X.t === "땅" && (d.vol.magnet > 0 || this.hi(d) === "balloon")) return 0;
  if (!X.bp) return { seismictoss: w.m.lv, nightshade: w.m.lv, dragonrage: 40, sonicboom: 20, superfang: Math.floor(D.hp / 2) }[id] || D.hp * 0.2;
  let x = this.calc(w, d, X, false, mul);
  const hits = X.hits ? (Array.isArray(X.hits) ? (w.m.ab === "skilllink" ? X.hits[1] : X.hits[0] === 2 && X.hits[1] === 5 ? 3.1 : X.hits[0]) : X.hits) : 1;
  const wx = this.wx(), sure = X.acc > 100 || (wx === "rain" && ["thunder", "hurricane"].includes(id)) || (wx === "hail" && id === "blizzard");
  const acc = sure ? 1 : Math.min(1, (X.acc || 100) / 100);
  return x * hits * acc;
};

// ---- 변화 기술 값(상대 HP를 1로 볼 때 얼마만큼 값어치인지) ----
Battle.prototype.aiStatusVal = function (w, d, id, X, best) {
  const M = w.m, D = d.m, hpR = M.hp / M.st[0], dR = D.hp / D.st[0];
  const onField = (this.turnNo || 0) - (w.inT || 0);            // 나온 뒤 지난 턴
  const acc = X.acc > 100 ? 1 : (X.acc || 100) / 100;
  const faster = this.speed(w) >= this.speed(d);
  const weak = best < D.hp * 0.45;                              // 공격이 잘 안 먹힘 → 변화 기술이 더 값짐
  const foeLeft = (w.side === "E" ? G.party : this.foe || []).filter(m => m.hp > 0).length;
  const stg = (s, k) => (s.stg && s.stg[k]) || 0;
  // 회복
  if (AI_HEAL.has(id) || X.heal) {
    if (M.hp >= M.st[0] * 0.95) return 0;
    if (id === "rest") return hpR < 0.4 || (M.status && hpR < 0.7) ? 1.1 : 0;
    return hpR < 0.35 ? 1.25 : hpR < 0.55 ? 0.7 : 0.1;
  }
  if (["aquaring", "ingrain"].includes(id)) return hpR > 0.5 && onField <= 1 ? 0.3 : 0.05;
  // 상태 이상 걸기
  if (X.st) {
    if (D.status || !this.canStatus(d, X.st, w)) return 0;
    if (X.pw && (this.types(d).includes("풀") || this.hi(d) === "goggles")) return 0;
    if (X.t === "전기" && !this.typeMul("전기", d)) return 0;
    if (D.ab === "magicbounce") return 0;
    const v = { slp: 0.75, frz: 0.7, par: faster ? 0.45 : 0.6, brn: D.st[1] >= D.st[3] ? 0.6 : 0.25, tox: 0.5, psn: 0.35 }[X.st] || 0.3;
    return v * acc * (dR > 0.5 ? 1 : 0.45) * (hpR < 0.3 ? 0.4 : 1);
  }
  if (id === "yawn") return D.status ? 0 : 0.45 * (dR > 0.5 ? 1 : 0.4);
  if (id === "leechseed") return this.types(d).includes("풀") || d.vol.seed ? 0 : 0.4 * acc * (dR > 0.4 ? 1 : 0.4);
  if (AI_CONF.has(id)) return d.vol.conf || D.ab === "owntempo" ? 0 : 0.3 * acc * (dR > 0.4 ? 1 : 0.4);
  // 지키기
  if (["protect", "detect", "kingsshield", "spikyshield"].includes(id)) {
    if (w.vol.lastProt) return 0;
    const chip = D.status === "psn" || D.status === "tox" || D.status === "brn" || d.vol.seed || this.hi(w) === "left";
    return (chip ? 0.45 : 0.15) * (Math.random() < 0.5 ? 1 : 0.3);
  }
  // 능력 올리기(나에게)
  const b = X.b || {};
  if (SELF_TG.includes(X.tg) && Object.values(b).some(v => v > 0)) {
    if (hpR < 0.6 || onField > 3) return 0.05;
    const phys = w.m.moves.some(mv => { const Y = MV[mv.id]; return Y && Y.c === "P"; }) && M.st[1] >= M.st[3];
    let v = 0;
    if (b.atk > 0 && phys && stg(w, "atk") < 2) v += 0.3 * b.atk;
    if (b.spa > 0 && !phys && stg(w, "spa") < 2) v += 0.3 * b.spa;
    if (b.spe > 0 && !faster && stg(w, "spe") < 2) v += 0.25 * b.spe;
    if (b.def > 0 && D.st[1] >= D.st[3] && stg(w, "def") < 2) v += 0.15 * b.def;
    if (b.spd > 0 && D.st[3] > D.st[1] && stg(w, "spd") < 2) v += 0.15 * b.spd;
    return Math.min(0.7, v) * (weak ? 1 : 0.6) * hpR;
  }
  // 상대 능력 내리기
  if (Object.values(b).some(v => v < 0)) {
    if (onField > 1) return 0.03;
    let v = 0;
    if (b.atk < 0 && D.st[1] >= D.st[3] && stg(d, "atk") > -2) v += 0.12 * -b.atk;
    if (b.spa < 0 && D.st[3] > D.st[1] && stg(d, "spa") > -2) v += 0.12 * -b.spa;
    if (b.def < 0 && stg(d, "def") > -2) v += 0.1 * -b.def;
    if (b.spd < 0 && stg(d, "spd") > -2) v += 0.1 * -b.spd;
    if (b.spe < 0 && !faster && stg(d, "spe") > -2) v += 0.15 * -b.spe;
    if ((b.accuracy < 0 || b.evasion < 0)) v += 0.06;
    return v * acc;
  }
  // 그 밖(장막·순풍·압정·도발·변신…)
  if (["reflect", "lightscreen"].includes(id)) return onField <= 1 ? 0.3 : 0.1;
  if (id === "tailwind") return faster ? 0.05 : 0.4;
  if (["stealthrock", "spikes", "toxicspikes", "stickyweb"].includes(id)) return foeLeft > 1 ? 0.3 : 0.02;
  if (id === "transform") return 0.9;
  if (id === "healbell") return 0.5;
  if (["helpinghand", "focusenergy", "safeguard", "splash"].includes(id)) return 0.05;
  return 0.12;
};

// ---- 실력자의 기술 고르기 ----
Battle.prototype.aiSmart = function (w) {
  const fz = this.forced(w); if (fz) return fz;
  const d = this.w[this.other(w.side)]; if (!d || !d.m) return null;
  let usable = w.m.moves.filter(mv => mv.pp > 0 && !this.cantUse(w, mv.id)); if (!usable.length) return "struggle";
  { const ok = usable.filter(mv => !this.wouldFail(w, d, mv.id)); if (ok.length) usable = ok; }
  const plan = this.o.trainer && this.o.trainer.wx;
  if (plan && this.weather !== plan) { const set = usable.find(mv => WX_MV[mv.id] === plan); if (set && Math.random() < 0.9) return set.id; }
  { const keep = usable.filter(mv => !(WX_MV[mv.id] && WX_MV[mv.id] === this.weather)); if (keep.length) usable = keep; }
  const tier = this.aiTier();
  if (tier < 3 && Math.random() < 0.1) return pick(usable).id;   // 지킴이도 사람이라 가끔은 마음 가는 대로
  const D = d.m, est = {}; let best = 0;
  for (const mv of usable) { const X = this.moveFor(w, mv.id); if (X.c !== "X") { est[mv.id] = this.aiDmg(w, d, mv.id); best = Math.max(best, est[mv.id]); } }
  let pickId = null, ps = -1;
  for (const mv of usable) {
    const id = mv.id, X = this.moveFor(w, id); let sc;
    if (X.c !== "X") {
      const e = est[id];
      sc = Math.min(e, D.hp * 1.05);
      if (e >= D.hp && D.hp > 0) sc = D.hp * (1.6 + (X.pri > 0 ? 0.3 : 0) + (X.acc > 100 || X.acc >= 100 ? 0.1 : 0) - (X.recoil ? 0.1 : 0));   // 쓰러뜨릴 수 있으면 확실하게
      else if (X.recoil) sc *= 0.9;
      if (WX_MV[id] && WX_MV[id] !== plan) sc *= 0.5;
    } else sc = WX_MV[id] ? (WX_MV[id] === plan ? 0.3 : 0.05) * D.hp : this.aiStatusVal(w, d, id, X, best) * D.hp * (tier >= 3 ? 1 : 0.55);
    sc *= 0.9 + Math.random() * 0.2;                           // 작은 망설임(늘 똑같지 않게)
    if (sc > ps) { ps = sc; pickId = id; }
  }
  return pickId;
};
Battle.prototype.aiMove = (function (f0) {
  return function (w) {
    if (w && w.side === "E" && this.isSmart()) { try { const id = this.aiSmart(w); if (id) return id; } catch (e) { console.warn("aiSmart", e); } }
    return f0.call(this, w);
  };
})(Battle.prototype.aiMove);

// ---- 관장 회복약(실제 게임처럼: HP 1/4 아래 · 청심환은 상태 이상도) ----
Battle.prototype.aiItem = function (E) {
  const T = this.o.trainer; if (this.wild || !T || !T.items || !T.items.length) return null;
  const M = E.m; if (!M || M.hp <= 0 || this.forced(E)) return null;
  const r = M.hp / M.st[0];
  for (let i = 0; i < T.items.length; i++) {
    const it = ITEMS[T.items[i]]; if (!it) continue;
    const heal = it.heal === "full" ? M.st[0] - M.hp : it.heal || (it.hpPct ? M.st[0] * it.hpPct : 0);
    if (heal > 0 && r <= 0.25 && Math.random() < 0.85) return i;
    if (it.cure === "all" && M.status && ["slp", "frz", "par", "brn", "tox"].includes(M.status) && r <= 0.5 && Math.random() < 0.5) return i;
  }
  return null;
};
Battle.prototype.trainerItem = async function (E, i) {
  const T = this.o.trainer, id = T.items.splice(i, 1)[0], it = ITEMS[id], M = E.m;
  sfx("select");
  await this.say(`${T.cls} ${J(T.name, "은")}\n${J(it.n, "을")} 사용했다!`, { auto: 300 });
  if (Save.opt.anim) await FX.play("heal", { side: "E" }, { side: "E" }, "노말");
  const h = it.heal === "full" ? M.st[0] : it.heal || (it.hpPct ? Math.floor(M.st[0] * it.hpPct) : 0);
  const st0 = M.status;
  if (it.cure === "all") { M.status = null; M.slp = 0; M.tox = 0; if (it.conf) E.vol.conf = 0; }
  if (h > 0 && M.hp < M.st[0]) { M.hp = Math.min(M.st[0], M.hp + h); sfx("heal_hp"); await this.hpWait("E"); await this.say(`${this.nm("E")}의 HP가\n회복되었다!`); }
  else if (st0 && !M.status) await this.say(`${this.nm("E")}의\n상태 이상이 나았다!`);
};
