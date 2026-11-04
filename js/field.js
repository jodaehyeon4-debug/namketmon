// ===== v2.0 실제 포켓몬 게임처럼 (아이들 적응): 풀베기(비전머신) · 낚시 · 이름 감정사 · 겨루기 징(배틀서처) =====
// 사용자: "실제 게임과 최대한 유사하도록 제작(아이들의 적응문제 이슈)"
// chapter·gyms 뒤, hearts 앞에서 읽힘 (MAPS에 사람을 더하고, 하트가 붙을 수 있게)
"use strict";

// ------------------------------------------------------------------ 공통
let FIELD_PENDING = null;            // 파티·가방에서 고른 필드 행동: 메뉴를 다 닫은 뒤 실행
function fieldLater(fn) { FIELD_PENDING = fn; }
async function runFieldPending() { const f = FIELD_PENDING; FIELD_PENDING = null; if (f) await f(); }
const facingTile = () => { const P = World.player, [dx, dy] = DIRS[P.dir]; return [P.x + dx, P.y + dy]; };

// 4세대 비전 기술 컷인: 화면 가운데 띠에 남켓몬 앞모습이 휙 들어왔다 나감
async function fieldCutIn(m) {
  let t = 0;
  const ov = new Overlay(() => {
    const k = Math.min(1, t / 8), h = Math.round(56 * k), y = 68 - h / 2;
    rect(0, y, SW, h, "rgba(250,246,226,.92)"); rect(0, y, SW, 2, "#d04a3a"); rect(0, y + h - 2, SW, 2, "#d04a3a");
    if (t > 6 && t < 52) { const x = t < 20 ? SW - (t - 6) * 9 : t < 40 ? 128 - 48 : 80 - (t - 40) * 22;
      g.save(); g.beginPath(); g.rect(0, y + 2, SW, h - 4); g.clip(); monFront(m.k, x, y - 22, 0, m.shiny); g.restore(); }
  });
  Scenes.push(ov); Audio2.cry(m.k);
  for (; t < 58; t++) await frames(1);
  Scenes.pop(ov);
}

// ------------------------------------------------------------------ 풀베기
if (!MV.cut) MV.cut = { n: "풀베기", t: "노말", c: "P", bp: 50, acc: 95, pp: 30, pri: 0, tg: "normal",
  d: "낫이나 발톱으로 상대를 베어서 공격한다. 필드에서 쓰면 가는 나무를 베어 길을 열 수 있다.", fx: "slash" };
const STARTER_LINES = (() => { const out = []; const ch = k => { out.push(k); for (const e of (MON[k].evo || [])) ch(e[0]); }; STARTERS.forEach(ch); return out; })();
ITEMS.hm01 = { n: "비전머신01", p: "tm", hm: 1, tm: "cut", d: "풀베기를 가르쳐요. 몇 번이고 쓸 수 있어요. 쪽빛 어사패가 있으면 필드에서 가는 나무를 베어 길을 열어요.", ic: "hm",
  tmTypes: ["풀", "벌레", "노말", "강철", "악", "격투", "땅", "드래곤"], tmAlso: STARTER_LINES };
ITEMS.oldrod = { n: "낡은 낚싯대", p: "key", d: "요천 할아버지가 준 대나무 낚싯대예요. 물을 바라보고 쓰거나, 물 앞에서 A를 누르면 물에 사는 남켓몬을 낚을 수 있어요.", ic: "rod" };
ITEMS.gong = { n: "겨루기 징", p: "key", d: "울리면 이 근처에서 겨뤘던 트레이너들이 다시 붙자고 손을 들어요(배틀서처). 한 번 울리면 100걸음 걸어야 다시 울려요.", ic: "gong" };
const FIELD_MOVES = { cut: { badge: 2, use: (m) => useCutFromMenu(m) } };

function cutUser() { return G.party.find(m => m.moves.some(x => x.id === "cut")); }
async function cutTreeAt(x, y) {
  const m = cutUser();
  if (!hasBadge(2) || !m) {
    await say("가는 나무가 길을 막고 있다.\f이 나무는 풀베기로\n베어 낼 수 있을 것 같다!");
    return;
  }
  if ((await ask("이 나무는 풀베기로\n베어 낼 수 있을 것 같다!\f풀베기를 쓰겠습니까?", ["예", "아니오"])) !== 0) return;
  await doCut(m, x, y);
}
async function doCut(m, x, y) {
  await say(`${J(mname(m), "은")}\n풀베기를 썼다!`);
  await fieldCutIn(m);
  const M = World.M; sfx("cut");
  // 잎이 흩날리며 나무가 사라진다 (지도를 다시 들어오면 실제 게임처럼 다시 자람)
  M.ob[y][x] = -1; M.solid[y][x] = false; M.beh[y][x] = null;
  const leaves = Array.from({ length: 10 }, (_, i) => ({ a: i * 0.63, r: 2, v: 0.8 + (i % 3) * 0.3 }));
  let t = 0; const old = World.extra;
  World.extra = (cx, cy) => { if (old) old(cx, cy); for (const L of leaves) { const r = L.r + t * L.v, px = x * TS + 8 + Math.cos(L.a) * r - cx, py = y * TS + 6 + Math.sin(L.a) * r * 0.7 + t * 0.25 - cy;
    rect(Math.round(px), Math.round(py), 2, 2, t & 4 ? "#62b062" : "#3f9050"); } };
  for (; t < 22; t++) await frames(1);
  World.extra = old;
}
async function useCutFromMenu(m) {
  const [x, y] = facingTile();
  if (World.M.beh[y] && World.M.beh[y][x] === "cut") { await doCut(m, x, y); return; }
  await say("여기서는 쓸 수 없다.");
}

// ------------------------------------------------------------------ 낚시 (낡은 낚싯대)
// 지도마다 물에 사는 남켓몬 (실제 4세대 낡은 낚싯대처럼 낮은 레벨, 자주 걸림). 시간대 t는 풀숲 출현표와 같은 규칙
const FISH = {
  world: { at: "1번도로", list: [{ k: "daseulmi", lv: "4–8", r: "흔함", t: "모두" }, { k: "olchaengmi", lv: "4–8", r: "가끔", t: "모두" }, { k: "eunchimi", lv: "5–8", r: "가끔", t: "낮" }, { k: "ssogami", lv: "6–8", r: "드묾", t: "모두" }] },
  route2: { at: "2번도로", list: [{ k: "olchaengmi", lv: "5–9", r: "흔함", t: "모두" }, { k: "daseulmi", lv: "5–9", r: "흔함", t: "모두" }, { k: "teoljipge", lv: "6–9", r: "드묾", t: "밤" }] },
  route3: { at: "3번도로", list: [{ k: "daseulmi", lv: "8–12", r: "흔함", t: "모두" }, { k: "eunchimi", lv: "8–12", r: "가끔", t: "낮" }, { k: "teoljipge", lv: "9–12", r: "가끔", t: "밤" }, { k: "jararong", lv: "10–12", r: "드묾", t: "낮" }] },
  route4: { at: "4번도로", list: [{ k: "eunchimi", lv: "10–15", r: "흔함", t: "낮" }, { k: "daseulmi", lv: "10–15", r: "흔함", t: "모두" }, { k: "ssogami", lv: "11–15", r: "가끔", t: "모두" }, { k: "jararong", lv: "12–15", r: "드묾", t: "낮" }] },
  route5: { at: "5번도로", list: [{ k: "eunchimi", lv: "10–15", r: "흔함", t: "낮" }, { k: "ssogami", lv: "10–15", r: "가끔", t: "모두" }, { k: "teoljipge", lv: "11–15", r: "가끔", t: "밤" }, { k: "jararong", lv: "12–15", r: "드묾", t: "낮" }] },
  bisaek: { at: "비색마을", list: [{ k: "eunchimi", lv: "12–16", r: "흔함", t: "모두" }, { k: "ssogami", lv: "12–16", r: "가끔", t: "모두" }, { k: "teoljipge", lv: "12–16", r: "가끔", t: "밤" }] },
  songhwa: { at: "송화마을", list: [{ k: "ssogami", lv: "14–19", r: "흔함", t: "모두" }, { k: "eunchimi", lv: "14–19", r: "흔함", t: "낮" }, { k: "jararong", lv: "15–19", r: "가끔", t: "낮" }, { k: "megijang", lv: "18–20", r: "드묾", t: "밤" }] },
  juhong: { at: "주홍마을", list: [{ k: "ssogami", lv: "15–20", r: "흔함", t: "모두" }, { k: "jararong", lv: "15–20", r: "가끔", t: "낮" }, { k: "megijang", lv: "18–20", r: "드묾", t: "밤" }, { k: "teoljipge", lv: "15–20", r: "가끔", t: "밤" }] },
};
function fishTable() {
  const F = FISH[G.map]; if (!F) return [];
  const tod = timeOfDay(); const t = tod === "아침" ? "낮" : tod;
  return F.list.filter(e => (e.t === "모두" || e.t === t || e.t === tod || (t === "저녁" && e.t === "밤")) && MON[e.k]);   // v2.37 아침 낚시도
}
class FishBite extends Modal {       // 입질! A를 바로 누르면 낚는다 (4세대처럼, 아이들을 위해 넉넉하게 약 1.3초)
  constructor(lim) { super(); this.t = 0; this.lim = lim; }
  update() { this.t++; if (Input.ok()) { this.done(true); return; } if (this.t > this.lim) this.done(false); }
  draw() { darkBox(0, 144, 256, 48); Font.draw(g, "앗! 입질이다!", 12, 152, { col: TXT.white, sh: TXT.wsh }); if ((this.t >> 3) & 1) Font.draw(g, "▶ A를 눌러!", 244, 170, { align: "right", col: "#f8d870", sh: null }); }
}
async function fishAt(x, y) {
  if ((await ask("물이 맑다.\n낚싯대를 쓰겠습니까?", ["예", "아니오"])) !== 0) return;
  await goFish(x, y);
}
async function useRod() {
  const [x, y] = facingTile();
  if (!World.M.outdoor || !(World.M.beh[y] && World.M.beh[y][x] === "water")) { await say("조박사의 말이 떠올랐다……\f{P}! 지금은 그것을\n쓸 때가 아니란다!"); return; }
  await goFish(x, y);
}
async function goFish(x, y) {
  const P = World.player, list = fishTable();
  let t = 0, bite = false; const old = World.extra;
  World.extra = (cx, cy) => { if (old) old(cx, cy);            // 낚싯줄과 찌
    const [dx, dy] = DIRS[P.dir], hx = P.px + 8 + dx * 9 - cx, hy = P.py - 4 + dy * 4 - cy;
    t = World._fishT; const bx = x * TS + 8 - cx, by = y * TS + 9 - cy + (bite ? 3 : Math.round(Math.sin(t / 9)));
    g.strokeStyle = "rgba(240,240,240,.85)"; g.lineWidth = 1; g.beginPath(); g.moveTo(hx, hy); g.quadraticCurveTo((hx + bx) / 2, Math.min(hy, by) - 6, bx, by); g.stroke();
    rect(bx - 2, by - 2, 4, 4, "#e04838"); rect(bx - 2, by, 4, 1, "#ffffff");
    if (bite) { rect(bx - 6, by + 3, 3, 1, "#d8f0ff"); rect(bx + 3, by + 3, 3, 1, "#d8f0ff"); } };
  const t0 = FRAME; Object.defineProperty(World, "_fishT", { configurable: true, get: () => FRAME - t0 });
  sfx("cast");
  try {
    const dots = 2 + rnd(3);
    for (let i = 1; i <= dots; i++) await say("……".repeat(i), { auto: 520 });
    if (!list.length || Math.random() > 0.78) { await say("아무것도 걸리지 않았다……"); return; }
    bite = true; sfx("excl"); P.emo = "excl"; P.emoT = 80;
    const ok = await show(new FishBite(80));
    P.emo = null;
    if (!ok) { await say("놓쳐 버렸다……"); return; }
    sfx("splash");
    await say("남켓몬을 낚았다!", { auto: 700 });
    World.extra = old;
    const [k, lv] = rollEnc(list);
    await startWild(k, lv, "water");
  } finally { World.extra = old; }
}
async function fisherTalk() {
  const a = act("r1_fisher");
  if (!G.has("oldrod")) {
    if (!G.flag("dex")) { await say("요천에는 물에 사는 남켓몬이 많지.\f낚싯대가 있으면 좋을 텐데 말이야.\f……응? 아직 도감도 없구나.\n다홍시티 연구소부터 들렀다 오렴."); return; }
    await say("오, 도감을 받은 꼬마 트레이너로구나!\f요천에는 물에 사는 남켓몬이\n많이 산단다.\f풀숲만 다니면 영영 못 만나지.");
    await say("내가 쓰던 낡은 낚싯대를 주마.\n대나무로 만든 거라 가볍단다.");
    await getItem("oldrod");
    await say("물가에서 물을 바라보고\nA를 눌러 보렴.\f찌가 쏙 들어가면\n바로 A를 눌러 끌어 올려!\f가방의 '중요한 물건'에서\n꺼내 써도 된단다.");
    return;
  }
  await say(nightNow() ? "밤에는 털집게 같은 녀석들이\n슬금슬금 나온단다." : "은치미는 몸에서 수박 냄새가 난단다.\n한번 맡아 보렴.");
}

// ------------------------------------------------------------------ 이름 감정사 (다홍시티)
async function nameRaterTalk() {
  await say("이름 감정사: 안녕!\n나는 이름 감정사란다.\f남켓몬의 이름을 보고\n좋은지 나쁜지 봐 주지.");
  if ((await ask("이름 감정사: 네 남켓몬의\n이름을 봐 줄까?", ["예", "아니오"])) !== 0) { await say("이름 감정사: 그래? 언제든 다시 오렴."); return; }
  const i = await openParty("item", "누구의 이름을 볼까요?"); if (i == null || i < 0) { await say("이름 감정사: 그래? 언제든 다시 오렴."); return; }
  const m = G.party[i], sp = MON[m.k].n, cur = mname(m);
  if (m.ot && m.ot !== G.name) { await say(`이름 감정사: ${cur}……\f이 남켓몬은 다른 트레이너가\n정성껏 지어 준 이름이구나.\f그 마음을 지켜 주자꾸나.`); return; }
  await say(`이름 감정사: ${cur}……\f음, 정말 좋은 이름이로구나!\f${J(cur, "을")} 많이 아껴 주렴.`);
  const ch = await ask("이름 감정사: 그래도 더 좋은 이름을\n지어 볼래?", m.nick ? ["새 이름 짓기", `원래 이름(${sp})`, "그대로 둔다"] : ["새 이름 짓기", "그대로 둔다"]);
  if (ch === 0) {
    const ov = new Overlay(() => { rect(0, 0, SW, SH, "rgba(20,24,40,.55)"); frame(64, 4, 128, 104); monFront(m.k, 80, 6, 0, m.shiny); darkBox(0, 144, 256, 48);
      Font.draw(g, `${cur}의 새 이름은?`, 12, 150, { col: TXT.white, sh: TXT.wsh }); Font.draw(g, "(비워 두면 그대로)", 12, 168, { font: "g9", col: "#c8c8d8", sh: null }); });
    Scenes.push(ov); const v = await typeName(cur + "의 새 이름은?", null, { mon: m.k }, m.nick || ""); Scenes.pop(ov);
    if (v && v !== cur) { m.nick = v === sp ? null : v; sfx("select"); await say(`이름 감정사: 좋아! 이제부터 이 아이는\n'${v}'(이)란다.\f전보다 훨씬 좋은 이름이구나!`); return; }
    await say(`이름 감정사: 그래, ${J(cur, "이")}라는 이름이\n역시 제일 잘 어울려.`); return;
  }
  if (m.nick && ch === 1) { m.nick = null; sfx("select"); await say(`이름 감정사: 그래, 원래 이름\n${J(sp, "으로")} 되돌렸단다.`); return; }
  await say(`이름 감정사: 그래, ${J(cur, "이")}라는 이름이\n역시 제일 잘 어울려.`);
}

// ------------------------------------------------------------------ 겨루기 징 (배틀서처): 이긴 트레이너와 다시 붙기
function rematchOk(a) {
  const t = a.trainer;
  return t && !a.hidden && t.base && !t.noRematch && !t.canLose && G.flag("tr_" + t.id) && World.M.outdoor && !/^(rival|gym)/.test(t.id);
}
async function useGong() {
  if (!World.M.outdoor) { await say("여기서는 울릴 수 없다."); return; }
  if (G.gongAt && G.steps < G.gongAt) { await say(`징이 아직 웅웅 떨리고 있다……\f(${G.gongAt - G.steps}걸음 더 걸으면\n다시 울릴 수 있다.)`); return; }
  sfx("gong"); await say(`${J(G.name, "은")} 겨루기 징을 울렸다!\f징~~~!`);
  G.gongAt = G.steps + 100;
  const P = World.player, near = World.actors.filter(a => rematchOk(a) && Math.abs(a.x - P.x) <= 8 && Math.abs(a.y - P.y) <= 6);
  const want = near.filter(() => Math.random() < 0.7);
  if (near.length && !want.length) want.push(near[rnd(near.length)]);       // 하나는 꼭 대답(아이들이 헛걸음하지 않게)
  if (!want.length) { await say("……아무도 대답하지 않았다."); return; }
  for (const a of want) { G.flag("rm_" + a.trainer.id, true); a.emo = "excl"; a.emoT = 50; }
  sfx("excl"); await frames(50);
  await say("다시 겨루고 싶어 하는\n트레이너가 손을 들었다!");
}
function rematchTeam(T) {                 // 레벨: 처음보다 높게, 파티 평균에 맞춰(85%) → 진화할 레벨이면 진화한 모습으로
  const avg = G.party.reduce((s, m) => s + m.lv, 0) / Math.max(1, G.party.length);
  return T.team.map(([k, lv, o]) => {
    const L = Math.min(60, Math.max(lv + 2, Math.floor(avg * 0.85) - (T.team.length > 2 ? 1 : 0)));
    let kk = k; for (let i = 0; i < 3; i++) { const e = (MON[kk].evo || []).find(e => typeof e[1] === "number" && L >= e[1]); if (!e) break; kk = e[0]; }
    return [kk, L];
  });
}
function rematchTrainer(T) {
  return Object.assign({}, T, { team: rematchTeam(T), intro: T.rmIntro || `또 만났네!\n이번엔 안 질 거야!`, lose: T.rmLose || T.lose });
}

// ------------------------------------------------------------------ 숨겨진 물건 (실제 게임처럼 바위·덤불 앞에서 A, 가끔 반짝임)
const HIDDEN = {
  world: [[35, 42, "potion"], [40, 66, "jujube"], [14, 60, "namket"]],
  route2: [[43, 14, "ether"], [16, 10, "odi"], [31, 35, "aengdu"]],
  route3: [[20, 6, "superpotion"], [43, 21, "awakening"]],
  route4: [[16, 13, "escaperope"], [30, 16, "mogwa"]],
  route5: [[22, 46, "ether"], [18, 38, "boksunga"]],
  route7: [[11, 11, "hardstone"]],
  route11: [[52, 25, "revive"], [14, 18, "elixir"]],
};
const hidKey = (x, y) => `hid_${G.map}_${x}_${y}`;
function hiddenAt(x, y) { const L = HIDDEN[G.map]; if (!L) return null; const h = L.find(h => h[0] === x && h[1] === y && ITEMS[h[2]]); return h && !G.flag(hidKey(x, y)) ? h : null; }
async function takeHidden(h) {
  G.flag(hidKey(h[0], h[1]), true);
  await say("어라? 무언가 숨겨져 있다!", { auto: 600 });
  await getItem(h[2], h[3] || 1);
}
function drawHidden(cx, cy) {                // 5~6초에 한 번씩 반짝 (8세대처럼, 아이들이 찾기 쉽게)
  const L = HIDDEN[G.map]; if (!L || !World.M.outdoor) return;
  L.forEach((h, i) => { if (G.flag(hidKey(h[0], h[1]))) return; const t = (FRAME + i * 97) % 330; if (t > 24) return;
    const x = h[0] * TS + 10 - cx, y = h[1] * TS + 2 - cy, r = t < 12 ? t >> 2 : (24 - t) >> 2;
    rect(x - r, y, r * 2 + 1, 1, "#fffbe0"); rect(x, y - r, 1, r * 2 + 1, "#fffbe0"); rect(x, y, 1, 1, "#ffffff"); });
}

// ------------------------------------------------------------------ 기술 떠올리기 (잊은 기술을 다시, 실제 게임의 기술 떠올리기 사람)
async function moveReminderTalk() {
  await say("기억 할아버지: 허허, 남켓몬도 사람처럼\n배운 걸 깜빡 잊곤 하지.\f잊어버린 기술을 다시\n떠올리게 해 주마.");
  if ((await ask("기억 할아버지: 기술을 떠올리게\n해 줄까?", ["예", "아니오"])) !== 0) { await say("기억 할아버지: 그래, 필요하면 또 오렴."); return; }
  const i = await openParty("item", "누구의 기술을 떠올릴까요?"); if (i == null || i < 0) { await say("기억 할아버지: 그래, 필요하면 또 오렴."); return; }
  const m = G.party[i], known = new Set(m.moves.map(x => x.id));
  const list = [...new Set(MON[m.k].ml.filter(([lv, id]) => lv <= m.lv && MV[id] && !known.has(id)).map(x => x[1]))];
  if (!list.length) { await say(`기억 할아버지: 음…… ${J(mname(m), "은")}\n지금 떠올릴 기술이 없구나.`); return; }
  const tb = await say(`기억 할아버지: ${J(mname(m), "이")}\n떠올릴 기술을 골라 보렴.`, { keep: true });
  const v = await menu({ items: list.map(id => ({ label: MV[id].n, sub: MV[id].t })).concat([{ label: "그만두다" }]), x: 110, y: 2, w: 144, rows: Math.min(7, list.length + 1) });
  Scenes.pop(tb);
  if (v < 0 || v >= list.length) { await say("기억 할아버지: 그래, 필요하면 또 오렴."); return; }
  if (await learnMove(m, list[v], (t2, o) => say(t2, o))) await say("기억 할아버지: 허허, 잘 떠올렸구나!");
}

async function giveHm01() {
  await say("나는 쪽 염색 마당에서\n쪽을 베는 사람이란다.\f어사패를 받은 트레이너에게\n이걸 주려고 기다렸지.");
  await getItem("hm01");
  await say("비전머신01, 풀베기란다.\f비전머신은 기술머신처럼\n몇 번이고 쓸 수 있어.\f풀베기를 배운 남켓몬이 있으면\n길을 막은 가는 나무를 벨 수 있지.\f나무 앞에서 A를 누르거나\n남켓몬 메뉴에서 고르면 돼.");
}

// ------------------------------------------------------------------ 지도에 붙이기
(function attachField() {
  const D = MAPDATA;
  // 다홍시티: 이름 감정사의 집 (예전 잠긴 집)
  MAPS.house_name = { rows: D.house_b.rows, stamps: D.house_b.stamps, indoor: true, name: "이름 감정사의 집", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "city", noPopup: true,
    exit: ["world", D.world.doors.house_name[0], D.world.doors.house_name[1], "down"],
    checks: [[0, 1, "두툼한 이름 사전이 꽂혀 있다.\n'좋은 이름 짓는 법'"], [1, 1, "두툼한 이름 사전이 꽂혀 있다.\n'좋은 이름 짓는 법'"], [6, 2, "병풍에 '좋은 이름은\n좋은 친구를 부른다'라고 쓰여 있다."], [7, 2, "병풍에 '좋은 이름은\n좋은 친구를 부른다'라고 쓰여 있다."]],
    npcs: [{ id: "name_rater", x: 6, y: 4, spr: "oldman", dir: "down", move: "fixed", talk: nameRaterTalk }] };
  MAPS.world.signs.push([30, 24, "이름 감정사의 집\n남켓몬 이름, 봐 드립니다"]);
  // 다홍시티 한옥: 기억 할아버지(기술 떠올리기)
  MAPS.house_a.npcs.push({ id: "move_reminder", x: 7, y: 4, spr: "oldman", dir: "left", move: "look", talk: moveReminderTalk });
  // 쪽빛마을: 쪽 베는 아저씨 → 비전머신01 풀베기 (쪽빛 어사패 뒤)
  MAPS.jjok.npcs.push({ id: "jj_cutter", x: 6, y: 26, spr: "man", dir: "right", move: "look", talk: async () => {
    if (!hasBadge(2)) { await say("쪽은 여름에 잎이 무성해지면\n낫으로 베어 거둔단다.\f베는 솜씨가 좋아야\n쪽물이 곱게 나오지."); return; }
    if (!G.has("hm01")) { await say("오! 그거 미영 선생님의\n혼불 어사패 아니냐?"); await giveHm01(); return; }
    await say("1번도로 숲속에도\n가는 나무로 막힌 빈터가 있단다.\f베어 보면 뭐가 있을지도?"); } });
  // 배움터에서 나오면 같은 아저씨가 문 앞에서 기다리다 건넴 (실제 게임처럼 어사패 직후 비전머신을 받게)
  MAPS.jjok.npcs.push({ id: "jj_cutter_gym", x: 25, y: 9, spr: "man", dir: "right", move: "fixed", show: () => hasBadge(2) && !G.has("hm01"), talk: async () => { await giveHm01(); act("jj_cutter_gym").hidden = true; } });
  MAPS.jjok.areas = (MAPS.jjok.areas || []).concat([{ x0: 26, y0: 8, x1: 27, y1: 9, cond: () => hasBadge(2) && !G.has("hm01"), run: async () => {
    const a = act("jj_cutter_gym"); if (!a || a.hidden) return; await emote(a, "excl", 30); face(a, World.player); face(World.player, a);
    await say("어이, 거기 트레이너!\f혼불 어사패를 받았구나!\n축하한다!"); await giveHm01(); a.hidden = true; } }]);
  // 갈매마을: 풍물패 징잡이 → 겨루기 징 (쪽빛 어사패 뒤)
  MAPS.galmae.npcs.push({ id: "ga_gong", x: 30, y: 26, spr: "oldman", dir: "down", move: "look", talk: async () => {
    if (!G.has("gong")) {
      await say("징잡이 할아버지: 징~! 풍물놀이에서\n징이 울리면 모두 한데 모인단다.");
      if (!hasBadge(2)) { await say("징잡이 할아버지: 어사패를 두 개 모으면\n좋은 걸 주마."); return; }
      await say("징잡이 할아버지: 어사패가 둘이로구나.\f그럼 이 겨루기 징을 주마.");
      await getItem("gong");
      await say("징잡이 할아버지: 길에서 울리면\n전에 겨뤘던 트레이너들이\f'한 판 더!' 하고 손을 든단다.\f한 번 울리면 백 걸음은\n걸어야 다시 울릴 수 있어.");
      return;
    }
    await say("징잡이 할아버지: 이긴 상대랑 또 겨루면\n둘 다 더 강해지는 법이지."); } });
})();
