// ===== v2.52 특성 환약·특성 고약 · 병뚜껑(대단한 단련) · 개체값 판정 — 실제 포켓몬처럼 =====
// - 특성 환약(특성캡슐): 일반 특성이 둘인 남켓몬의 특성을 다른 하나로 · 숨은 특성은 바뀌지 않음
// - 특성 고약(특성패치): 일반 특성 → 숨은 특성 · 숨은 특성 → 첫 일반 특성
// - 은병뚜껑/금병뚜껑: 단련 사범에게 주면 Lv50 이상 남켓몬의 능력 하나/전부를 '최고'(개체값 31)로 단련(m.ht) — 실제 개체값은 그대로
// - 판정관: 남켓몬의 타고난 힘(개체값)을 말로 알려 줌 · 한 번 들으면 능력치 화면에 판정이 보임
"use strict";
Object.assign(ITEMS, {
  abilcap: { n: "특성 환약", p: "item", price: 10000, ic: "abilcap", fieldOnly: 1, abil: 1,
    d: "먹이면 그 남켓몬이 가질 수 있는 두 가지 특성 가운데 다른 하나로 바뀌어요. 숨은 특성은 바뀌지 않아요." },
  abilpatch: { n: "특성 고약", p: "item", price: 20000, ic: "abilpatch", fieldOnly: 1, abil: 2,
    d: "붙이면 아주 드문 '숨은 특성'으로 바뀌어요. 숨은 특성인 남켓몬에게 붙이면 처음 특성으로 돌아가요." },
  cap_silver: { n: "은병뚜껑", p: "item", price: 10000, ic: "cap_silver", fieldOnly: 1, cap: 1,
    d: "은빛으로 반짝이는 병뚜껑. 전주 배틀누각 단련 사범에게 주면 Lv50 이상 남켓몬의 능력 하나를 '최고'로 단련해 줘요." },
  cap_gold: { n: "금병뚜껑", p: "item", price: 20000, ic: "cap_gold", fieldOnly: 1, cap: 6,
    d: "금빛으로 번쩍이는 병뚜껑. 전주 배틀누각 단련 사범에게 주면 Lv50 이상 남켓몬의 모든 능력을 '최고'로 단련해 줘요." },
});

// ---- 단련한 능력은 개체값 31로 셈(실제 게임의 '대단한 단련') ----
calcStats = (function (c0) {
  return function (m) {
    if (!m || !m.ht || !m.ht.some(Boolean)) return c0(m);
    const iv = m.iv; m.iv = iv.map((v, i) => (m.ht[i] ? 31 : v));
    try { return c0(m); } finally { m.iv = iv; }
  };
})(calcStats);
const ivEff = (m, i) => (m.ht && m.ht[i] ? 31 : m.iv[i]);
const JH = (w, t) => (/HP$/.test(w) ? w + { 이: "가", 은: "는", 을: "를" }[t] : J(w, t));   // HP(에이치피)는 받침 없음

// ---- 특성 바꾸기 ----
function abilTarget(m, id) {
  const sp = MON[m.k], it = ITEMS[id]; if (!sp || !it) return null;
  const [norm, hid] = sp.ab;
  if (it.abil === 1) { if (norm.length < 2 || !norm.includes(m.ab)) return null; return norm[1 - norm.indexOf(m.ab)]; }
  if (it.abil === 2) { if (!hid || norm.includes(hid)) return null; return m.ab === hid ? norm[0] : hid; }
  return null;
}
const abName = id => (AB[id] ? AB[id].n : id);
async function useAbilItem(id) {
  const it = ITEMS[id];
  const ps = new PartyScreen("item", it.abil === 1 ? "누구에게 먹이겠습니까?" : "누구에게 붙이겠습니까?");
  ps.labFn = m => (abilTarget(m, id) ? ["쓸 수 있다", 1] : ["쓸 수 없다", 0]);
  const t = await show(ps); if (t == null || t < 0) return;
  const m = G.party[t], to = abilTarget(m, id);
  if (!to) {
    const sp = MON[m.k];
    if (it.abil === 1 && sp && sp.ab[1] === m.ab && !sp.ab[0].includes(m.ab)) await say(`${J(mname(m), "은")} 숨은 특성이라\n특성 환약으로는 바뀌지 않는다.`);
    else await say("써도 효과가 없을 것 같다.");
    return;
  }
  const hidTo = MON[m.k].ab[1] === to;
  if (!await yes(`${J(it.n, "을")} 쓰면 ${mname(m)}의 특성이\n${abName(m.ab)} → ${J(abName(to), "으로")} 바뀝니다.\f쓰시겠습니까?`)) return;
  G.take(id); m.ab = to; sfx("heal_hp");
  await say(`${mname(m)}의 특성이\n${J(abName(to), "으로")} 바뀌었다!` + (hidTo ? "\f아주 드문 숨은 특성이다!" : ""));
}

// ---- 개체값 판정(실제 게임의 판정 말) ----
const JUDGE = [[31, "최고", "#2a8a3a"], [30, "훌륭해", "#2a6ac8"], [26, "아주 좋아", "#2a6ac8"], [16, "꽤 좋아", "#5a5a66"], [1, "괜찮아", "#5a5a66"], [0, "별로야", "#b04030"]];
function judgeWord(m, i) {
  if (m.ht && m.ht[i]) return ["단련", "#b07818"];
  const v = m.iv[i]; const j = JUDGE.find(x => v >= x[0]); return [j[1], j[2]];
}
function judgeTotal(m) {
  const s = m.iv.reduce((a, b) => a + b, 0);
  return s <= 90 ? "평균적인 힘" : s <= 120 ? "평균 이상의 힘" : s <= 150 ? "상당히 뛰어난 힘" : "놀라울 만큼 뛰어난 힘";
}
async function judgeTalk() {
  await say("판정관: 나는 남켓몬이 타고난 힘을\n한눈에 알아보는 판정관이오.\f어디, 판정해 줄 남켓몬을\n보여 주시겠소?");
  while (true) {
    const t = await openParty("item", "누구를 판정할까요?"); if (t == null || t < 0) break;
    const m = G.party[t];
    await say(`판정관: 흠…… ${J(mname(m), "은")}\n${judgeTotal(m)}을 지녔구려.`);
    const best = Math.max(...m.iv), hi = [0, 1, 2, 3, 4, 5].filter(i => m.iv[i] === best).map(i => STN[i]);
    await say(`판정관: 그중 가장 좋은 것은\n${hi.join("·")}${best >= 31 ? "!\f이건 더 오를 데가 없는 '최고'요!" : (/HP$/.test(hi.join("·")) ? "요." : "이오.") + (best >= 26 ? "\f아주 좋은 편이오." : "")}`);
    const low = [0, 1, 2, 3, 4, 5].filter(i => m.iv[i] === 0).map(i => STN[i]);
    if (low.length) await say(`판정관: ${JH(low.join("·"), "은")} '별로'구려.\f허나 걱정 마시오. 병뚜껑으로\n단련하면 '최고'가 될 수 있소.`);
    if (!G.flag("judge_on")) {
      G.flag("judge_on", true); sfx("select");
      await say("판정관: 앞으로는 남켓몬 능력치\n화면에서도 내 판정이 보일 거요.\f'최고·훌륭해·아주 좋아·꽤 좋아\n괜찮아·별로야' 여섯 가지요.");
    }
    if (!await yes("판정관: 다른 남켓몬도\n판정해 볼까요?")) break;
  }
  await say("판정관: 타고난 힘이 전부는 아니오.\n함께 쌓은 날들이 더 크다오.");
}

// ---- 단련 사범(병뚜껑) ----
async function hyperTrain() {
  await say("단련 사범: 으랏차! 나는 남켓몬의\n숨은 힘을 끝까지 끌어내는 단련 사범!\f병뚜껑을 가져오면\n'대단한 단련'을 해 주지!");
  if (!G.has("cap_silver") && !G.has("cap_gold")) {
    await say("단련 사범: 은병뚜껑이면 능력 하나,\n금병뚜껑이면 모든 능력을\n'최고'까지 끌어올린다!\f병뚜껑은 BP 교환소에서\n바꿀 수 있지!"); return; }
  const caps = ["cap_silver", "cap_gold"].filter(id => G.has(id));
  const v = await ask("단련 사범: 어느 병뚜껑으로\n단련하겠느냐?", caps.map(id => `${ITEMS[id].n} ×${G.bag[id]}`).concat(["그만두다"]));
  const cap = caps[v]; if (!cap) { await say("단련 사범: 언제든 오너라!"); return; }
  const full = m => [0, 1, 2, 3, 4, 5].every(i => ivEff(m, i) >= 31);
  const ps = new PartyScreen("item", "누구를 단련하겠습니까?");
  ps.labFn = m => (m.lv < 50 ? ["Lv50부터", 0] : full(m) ? ["이미 최고", 0] : ["단련할 수 있다", 1]);
  const t = await show(ps); if (t == null || t < 0) { await say("단련 사범: 언제든 오너라!"); return; }
  const m = G.party[t];
  if (m.lv < 50) { await say(`단련 사범: ${J(mname(m), "은")} 아직 Lv${m.lv}.\f대단한 단련은 Lv50이 넘은\n남켓몬만 버틸 수 있다!`); return; }
  if (full(m)) { await say(`단련 사범: ${J(mname(m), "은")} 이미\n모든 능력이 '최고'다! 대단하구나!`); return; }
  let L;
  if (cap === "cap_silver") {
    const can = [0, 1, 2, 3, 4, 5].filter(i => ivEff(m, i) < 31);
    const k = await menu({ items: can.map(i => ({ label: STN[i], sub: judgeWord(m, i)[0] })).concat([{ label: "그만두다" }]), x: 118, y: 4, w: 136 });
    if (k < 0 || k >= can.length) { await say("단련 사범: 언제든 오너라!"); return; }
    L = [can[k]];
  } else L = [0, 1, 2, 3, 4, 5].filter(i => ivEff(m, i) < 31);
  if (!await yes(`${ITEMS[cap].n} 하나로 ${mname(m)}의\n${L.length > 2 ? "모든 능력을" : JH(L.map(i => STN[i]).join("·"), "을")} 단련합니까?`)) { await say("단련 사범: 언제든 오너라!"); return; }
  G.take(cap);
  m.ht = m.ht || [0, 0, 0, 0, 0, 0]; for (const i of L) m.ht[i] = 1;
  const old = m.st.slice(); m.st = calcStats(m); m.hp = Math.max(1, Math.min(m.st[0], m.hp + m.st[0] - old[0]));
  await fadeOut(8); sfx("hit_super"); await wait(300); sfx("hit_super"); await wait(300); Audio2.jingle("jg_levelup"); await fadeIn(8);
  await say(`단련 사범: 얍! 하앗! 으랏차—!!\f${mname(m)}의 ${L.length === 1 ? JH(STN[L[0]], "이") : "모든 능력이"}\n'최고'까지 단련되었다!`);
  if (G.flag("judge_on")) await say("(능력치 화면 판정에\n'단련'이 붙었다!)");
}

// ---- 가방에서 쓰기 ----
(() => {
  const fu0 = fieldUse;
  window.fieldUse = async function (id) {
    const it = ITEMS[id];
    if (it && it.abil) { await useAbilItem(id); return; }
    if (it && it.cap) { await say("병뚜껑이다.\f전주 배틀누각의 단련 사범에게\n가져가면 단련해 준다고 한다."); return; }
    return fu0(id);
  };
})();
