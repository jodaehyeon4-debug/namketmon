// ===== v2.38 미결정 정리(사용자 "미결정사항 스스로 진행해") =====
// D17 꾸무리 마지막 진화의 도구: 여의주(→ 용꾸리) · 남원 뚝배기(→ 뚝꾸리)를 지니면 시각과 상관없이 그 모습으로(도구가 없으면 지금처럼 낮·밤).
//     윤슬 박사(다홍 연구소·오방고원)가 꾸무리를 본 뒤 둘 다 줌 — 고르는 건 아이 몫. 평소엔 드래곤·고스트 기술 1.2배(지니는 도구)
// D18 반야봉에서 가람을 택한 전설 = 홍우성(v2.5 그대로 확정)
// D20 클리어 뒤 전설 넷(기획 원칙 "전설은 이벤트", 사운드연출 명장면 7·10·11):
//     · 호령산 — 반야봉 구상나무 숲 '산군의 포효' · 운해룡 — 반야봉 정상 제단, 해 뜰 무렵(아침)에만 '운해 위의 운해룡'
//     · 홍우성 — 광한루원 오작교의 가람: 은직성을 데려가면 견우의 소가 직녀 곁으로(가람과 한 판 뒤, 잡을 때까지)
//     · 복나비(환상) — 만복사지 석탑 앞, 밤 · 도감에서 잡은 남켓몬 100마리 이상(실제 게임의 환상 남켓몬처럼 특별한 때에만)
//     놓치면(쓰러뜨리거나 도망) 지도를 다시 들어오면 또 만남. 홍우성은 가람에게 다시 말을 걸면 됨
"use strict";
Object.assign(ITEMS, {
  yeouiju: { n: "여의주", p: "item", price: 3000, hold: "tb", tb: "드래곤", evoHold: { kkumuri: "yongkkuri" }, nobuy: 1,
    d: "지니면 드래곤 기술이 1.2배. 꾸무리가 지니고 Lv36이 되면 용꾸리로.", ic: "yeouiju" },
  ttukbaegi: { n: "남원 뚝배기", p: "item", price: 3000, hold: "tb", tb: "고스트", evoHold: { kkumuri: "ttukkkuri" }, nobuy: 1,
    d: "지니면 고스트 기술이 1.2배. 꾸무리가 지니고 Lv36이 되면 뚝꾸리로.", ic: "ttukbaegi" },
});
const postGame = () => G.flag("ending_seen") || G.flag("champion");

// ---------------------------------------------------------------- D17 윤슬 박사의 선물
async function kkumuriGift() {
  if (G.flag("ys_kkumuri_gift") || !G.caught.kkumuri) return false;
  await say("윤슬 박사: 어머, 꾸무리!\f'미꾸라지 용 됐다'는 말 알죠?\n이 아이는 Lv36에 모습이 갈려요.");
  await say("윤슬 박사: 여의주를 지니면 용꾸리,\n남원 뚝배기를 지니면 뚝꾸리.\f아무것도 안 지니면\n낮엔 용꾸리, 밤엔 뚝꾸리예요.");
  await getItem("yeouiju"); await getItem("ttukbaegi");
  await say("윤슬 박사: 어느 쪽이 될지는\n같이 다니는 사람이 정하는 거예요.");
  G.flag("ys_kkumuri_gift", true);
  return true;
}
async function legendRumor() {
  const left = [["horyeongsan", "반야봉 구상나무 숲에서\n커다란 호랑이 울음이 들린대요."], ["unhaeryong", "반야봉 정상에선 해 뜰 무렵\n구름바다 위로 무언가 솟는대요."],
    ["honguseong", "광한루원 오작교에서\n가람이 기다리고 있대요."], ["boknabi", "밤의 만복사지 석탑 앞에\n흰 나비가 날아든대요."]].filter(([k]) => !G.caught[k]);
  if (!left.length) { await say("윤슬 박사: 전설 남켓몬까지 모두!\f정말 대단해요.\n고마워요."); return; }
  await say("윤슬 박사: 들어 봐요, 소문이에요.\f" + left.map(r => r[1]).join("\f"));
  if (!G.caught.boknabi && Object.keys(G.caught).length < 100) await say("윤슬 박사: 흰 나비는 남켓몬을\n100마리 넘게 만난 사람에게만\f보인다고 하더라고요.");
}

// ---------------------------------------------------------------- 그림 도우미
const FOOT = {};                             // 배틀 그림마다 발바닥 줄(그림 아래 빈칸이 남켓몬마다 달라 '떠 보이던' 것 — v2.38 사용자 "공중에 떠있는거")
function footOf(k, im, C) {
  if (FOOT[k] !== undefined) return FOOT[k];
  try {
    const c = document.createElement("canvas"); c.width = C; c.height = C; const x = c.getContext("2d", { willReadFrequently: true });
    let low = 0;
    for (let f = 0; f < 24; f += 6) { x.clearRect(0, 0, C, C); x.drawImage(im, f * C, 0, C, C, 0, 0, C, C);
      const d = x.getImageData(0, 0, C, C).data; for (let y = C - 1; y > low; y--) { let hit = false; for (let xx = 0; xx < C; xx++) if (d[(y * C + xx) * 4 + 3] > 40) { hit = true; break; } if (hit) { low = y; break; } } }
    FOOT[k] = (low + 1) / C;                    // 0~1: 그림 위에서 발바닥까지
  } catch (e) { FOOT[k] = 0.8; }
  return FOOT[k];
}
function legendSprite(k, size = 44) {        // 필드에 선 전설(배틀 그림을 작게) — 발바닥이 그림자 위에 닿게
  return (x, y) => {
    const im = battleSheet(k); if (!im.complete || !im.naturalWidth) return;
    const C = im.naturalWidth / 24, f = Math.floor(FRAME / 5) % 24, foot = footOf(k, im, C);
    g.globalAlpha = 0.28; g.fillStyle = "#101820"; g.beginPath(); g.ellipse(x + 8, y + 14, size / 3, 3, 0, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
    g.drawImage(im, f * C, 0, C, C, x + 8 - size / 2, Math.round(y + 15 - size * foot), size, size);
  };
}
function butterflySprite(x, y) {             // 복나비: 흰 날개에 분홍 복 무늬, 금빛 가루
  const t = FRAME, bob = Math.sin(t / 14) * 2, w = 2 + Math.abs(Math.sin(t / 6)) * 4, cx = x + 8, cy = y + 2 + bob;
  g.globalAlpha = 0.3; g.fillStyle = "#fff4c8"; g.beginPath(); g.arc(cx, cy, 10, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
  g.fillStyle = "#ffffff";
  g.beginPath(); g.ellipse(cx - w / 2 - 1, cy - 2, w / 2 + 1, 4, -0.4, 0, Math.PI * 2); g.ellipse(cx + w / 2 + 1, cy - 2, w / 2 + 1, 4, 0.4, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#f4a0b8"; g.fillRect(cx - w / 2 - 1, cy - 3, 1, 1); g.fillRect(cx + w / 2, cy - 3, 1, 1);
  g.fillStyle = "#e8c050"; if ((t >> 3) & 1) { g.fillRect(cx - 6, cy + 4, 1, 1); g.fillRect(cx + 5, cy + 2, 1, 1); }
  g.fillStyle = "#4a3a40"; g.fillRect(cx, cy - 4, 1, 6);
}
let LEGEND_FX = null;                        // 반야봉 정상 운해룡 연출 { t }

// ---------------------------------------------------------------- D20 ① 호령산(반야봉 구상나무 숲)
const hideAct = (...ids) => { for (const id of ids) { const a = act(id); if (a) a.hidden = true; } };   // 배틀 뒤 바로 사라지게(다시 들어오면 show가 다시 정함)
async function horyeongEvent() {
  if (G.flag("horyeong_caught")) return;
  await say("구상나무 숲 한가운데,\n커다란 범이 앉아 있다.\f이마에 뾰족한 산봉우리\n무늬가 또렷하다……");
  try { Audio2.cry("horyeongsan"); } catch (e) {}
  for (let i = 0; i < 2; i++) { await fadeOut(5, "#c84a28"); await fadeIn(5, "#c84a28"); }
  await say("어흐흥 어흥!!\f산이 한순간에\n붉게 물드는 것 같았다!");
  const r = await startWild("horyeongsan", 60, "grass");
  if (r === "caught") { G.flag("horyeong_caught", true); hideAct("by_horyeong"); await say("숲에 다시 바람이 분다.\f산군이 길을 내어 준 것 같다."); return; }
  if (r === "lose") return;
  hideAct("by_horyeong");
  await say("호령산은 숲 깊이\n몸을 감췄다……\f(다시 오면 만날 수 있을 것 같다.)");
}

// ---------------------------------------------------------------- D20 ② 운해룡(반야봉 정상 제단, 아침에만)
async function unhaeAltar() {
  if (!postGame()) { await say("돌 고리 제단.\f가운데 넓적한 돌에\n별 모양 홈이 패어 있다."); return; }
  if (G.flag("unhae_caught")) { await say("돌 고리 제단.\f발아래로 구름바다가\n잔잔하게 흐른다."); return; }
  if (G.flag("unhae_rest")) { await say("구름바다가 조용하다.\f(다시 오면 만날 수 있을 것 같다.)"); return; }
  if (timeOfDay() !== "아침") { await say("구름바다가 잔잔하다.\f……해 뜰 무렵이면\n무언가 보일 것 같다.\f(아침에 다시 와 보자.\n회중시계로 때를 넘길 수 있다.)"); return; }
  await say("해가 떠오르자\n구름바다가 끓어오른다……!");
  LEGEND_FX = { t: 0 };
  try { Audio2.cry("unhaeryong"); } catch (e) {}
  await frames(70);
  await say("구름 사이로 몸 가운데가\n별빛으로 빈 용이 솟았다!");
  await say("오작이 둘로 갈라질 때\n남은 빈 마음……\f잊힌 것들이 모여\n구름바다가 되었다고 했다.");
  LEGEND_FX = null;
  const r = await startWild("unhaeryong", 65, "grass");
  if (r === "caught") { G.flag("unhae_caught", true); await say("구름바다 위로\n햇살이 길게 번진다."); return; }
  if (r === "lose") return;
  G.flag("unhae_rest", true);
  await say("운해룡은 구름 속으로\n흩어졌다……\f(다시 오면 만날 수 있을 것 같다.)");
}

// ---------------------------------------------------------------- D20 ③ 홍우성(오작교의 가람)
const GARAM6 = { id: "garam6", cls: "본디 자리 지킴이", name: "가람", spr: "garam", base: 60, music: "garam", bgm: "battle_legend", canLose: true,
  intro: "가람: 홍우성이 자꾸 네 은직성을 봐.\f……그 전에, 지킴이끼리\n한 판 하자.",
  lose: "가람: ……역시.\n같이 걷는 사람이 강하구나.",
  loseText: "가람: 괜찮아?\f남켓몬들 쉬게 하고\n또 와.",
  team: [["gumiru", 68], ["bangmangdochae", 68], ["dancheongmong", 69], ["gusangryeong", 69], ["eunhajak", 70]] };
async function garamPost() {
  const P = World.player, GR = act("end_garam");
  if (GR) face(GR, P);
  if (G.flag("hongu_caught")) { await say("가람: 홍우성이랑 은직성,\n잘 지내지?\f견우랑 직녀도 이제\n1년 내내 같이 있겠네."); return; }
  const ej = G.party.find(m => m.k === "eunjikseong");
  if (!G.flag("garam6_won")) {
    await say("가람: 왔구나.\f요즘 홍우성이 밤마다\n하늘을 올려다봐.");
    if (!ej) { await say("가람: 은직성은 같이 안 왔어?\f홍우성이 은직성을\n찾는 것 같아."); return; }
    const r = await trainerBattle({ x: GR.x, y: GR.y, dir: GR.dir, trainer: GARAM6 }, false);
    if (r !== "win") { G.healAll(); await Audio2.jingle("jg_heal"); await say("남켓몬들이 기운을 되찾았다!"); return; }
    G.flag("garam6_won", true);
    bgm("ojakgyo");
    await say("가람: 견우의 소는 1년 내내\n밭을 갈고,\f칠석에 한 번 직녀를 만나러\n다리를 건넌대.");
    await say("가람: 지켜 온 것만으로도,\n새로 짜는 것만으로도\f다리는 안 놓이더라.\n……둘 다 있어야 해.");
    await say("가람: 홍우성, 가고 싶으면 가.\f나는 이제 네가 없어도\n지킬 수 있어.");
  } else {
    if (!ej) { await say("가람: 홍우성이 은직성을\n기다리고 있어."); return; }
    await say("가람: 홍우성이\n아직 다리 위에서 기다려.");
  }
  try { Audio2.cry("honguseong"); } catch (e) {}
  if (ej) { try { Audio2.cry("eunjikseong"); } catch (e) {} }
  await say(`홍우성이 ${J(mname(ej), "과")}\n마주 보고 낮게 울었다.\f……다리를 건너려는 듯\n앞발을 들었다!`);
  const r = await startWild("honguseong", 65, "grass");
  if (r === "caught") {
    G.flag("hongu_caught", true); hideAct("pe_hongu");
    await say("가람: ……잘 부탁해.\f오작교 지킴이는\n여기서 계속 있을게.");
    return;
  }
  if (r === "lose") return;
  G.healAll();
  await say("홍우성은 다리 끝에서\n가만히 기다리고 있다.\f(가람에게 다시 말을 걸면\n또 만날 수 있다.)");
}

// ---------------------------------------------------------------- D20 ④ 복나비(만복사지 석탑, 밤 · 100마리)
const boknabiShow = () => postGame() && !G.flag("boknabi_caught") && Object.keys(G.caught).length >= 100
  && typeof timeOfDay === "function" && ["저녁", "밤"].includes(timeOfDay());
async function boknabiEvent() {
  await say("흰 나비 한 마리가\n석탑 둘레를 맴돈다.");
  await say("옛날 양생이라는 젊은이가\n이 절에서 부처님과\f저포 놀이를 해서 이기고\n귀한 인연을 만났다고 한다.\f「만복사저포기」 이야기다.");
  await say("……흰 나비가 날개의\n분홍 무늬를 펼쳤다!");
  const r = await startWild("boknabi", 60, "grass");
  if (r === "caught") { G.flag("boknabi_caught", true); hideAct("mb_boknabi"); await say("석탑 위로\n금빛 가루가 흩날린다."); return; }
  if (r === "lose") return;
  hideAct("mb_boknabi");
  await say("흰 나비는 밤하늘로\n날아올랐다……\f(다시 오면 만날 수 있을 것 같다.)");
}

// ---------------------------------------------------------------- 지도에 붙이기
(function attachChapter29() {
  // D17 윤슬 박사(다홍 연구소)
  const LAB = Object.values(MAPS).find(D => (D.npcs || []).some(n => n.id === "yunseul"));
  if (LAB) { const Y = LAB.npcs.find(n => n.id === "yunseul"); const t0 = Y.talk;
    Y.talk = async () => { if (await kkumuriGift()) return; await t0(); if (postGame()) await legendRumor(); }; }
  // 오방고원 윤슬 박사
  const OB = MAPS.obang && (MAPS.obang.npcs || []).find(n => n.id === "ob_yunseul");
  if (OB) { const t1 = OB.talk; OB.talk = async () => { if (await kkumuriGift()) return; await (typeof t1 === "function" ? t1() : say(t1)); if (postGame()) await legendRumor(); }; }

  // 반야봉: 호령산 · 운해룡
  const BY = MAPS.banya;
  if (BY) {
    BY.npcs.push({ id: "by_horyeong", x: 39, y: 28, dir: "left", move: "fixed", special: legendSprite("horyeongsan", 44),
      show: () => postGame() && !G.flag("horyeong_caught"), talk: horyeongEvent });
    BY.checks = (BY.checks || []).filter(c => !(c[1] === 6 && (c[0] === 20 || c[0] === 22)))
      .concat([[20, 6, unhaeAltar], [22, 6, unhaeAltar], [20, 5, unhaeAltar], [21, 5, unhaeAltar], [22, 5, unhaeAltar]]);
    const o = BY.over;
    BY.over = function (cx, cy) {
      if (o) o.call(this, cx, cy);
      if (!LEGEND_FX) return;
      LEGEND_FX.t++;
      const ax = 21 * TS - cx + 8, ay = 4 * TS - cy + 8, a = Math.min(1, LEGEND_FX.t / 50);
      g.globalAlpha = a * 0.4; g.fillStyle = "#e8f0ff"; g.beginPath(); g.arc(ax, ay, 52 + Math.sin(LEGEND_FX.t / 10) * 4, 0, Math.PI * 2); g.fill();
      g.globalAlpha = a; monFront("unhaeryong", ax - 48, ay - 64 + Math.round(Math.max(0, 1 - LEGEND_FX.t / 50) * 30)); g.globalAlpha = 1;
    };
    const ol = BY.onLoad;
    BY.onLoad = function () { if (ol) ol.call(this); G.flag("unhae_rest", false); LEGEND_FX = null; };
    const H = (BY.npcs || []).find(n => n.id === "by_hiker");
    if (H) { const t = H.talk; H.talk = async () => {
      if (postGame() && !(G.caught.horyeongsan && G.caught.unhaeryong)) { await say("등산객: 요즘 숲에서 범 울음이\n들린다는 소문이 있어.\f정상에선 해 뜰 무렵\n구름바다가 끓는대!"); return; }
      await say(t); }; }
  }

  // 광한루원 오작교: 엔딩 뒤 가람(홍우성)
  const W = MAPS.world;
  const EG = (W.npcs || []).find(n => n.id === "end_garam");
  if (EG) {
    EG.show = () => G.flag("ending_now") || postGame();      // 홍우성을 보낸 뒤에도 오작교 지킴이로 남음
    EG.talk = () => G.flag("ending_now") ? say("가람: ……같이 걸어 줄래?") : garamPost();
    W.npcs.push({ id: "pe_hongu", x: 15, y: 13, dir: "left", move: "fixed", special: legendSprite("honguseong", 46),
      show: () => !G.flag("ending_now") && postGame() && !G.flag("hongu_caught"), talk: () => say("홍우성이 은하수 쪽을\n올려다보고 있다.\f(가람에게 말을 걸어 보자.)") });
  }

  // 만복사지: 복나비
  const MB = MAPS.manboksa;
  if (MB) {
    MB.npcs.push({ id: "mb_boknabi", x: 14, y: 8, dir: "down", move: "fixed", special: butterflySprite, show: boknabiShow, talk: boknabiEvent });
  }
})();
