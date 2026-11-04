// ===== v2.37 무결성 점검 — 도감 151종을 모두 모을 수 있게: 진화 도구 넷 · 친밀도 할아버지 =====
// 도감151 v0.4에 적힌 진화 방법 가운데 게임에 없던 것(그래서 번다미·달방아·단청몽·보물박·구미루는 만날 길이 없었음)
//   · 도구 진화(실제 게임의 진화의 돌처럼 가방에서 쓰면 바로 진화, 멈출 수 없음): 벼락돌 · 달돌 · 단청 칩 · 금덩이
//   · 여루 Lv38+밤 → 구미루, 박알이 친밀도 → 보물박은 js/game.js(evoFor)
//   · 도구는 그 남켓몬이 나오는 곳 가까이에 하나씩(뱀사골 · 만복사지 · 7번도로 · 인월장터)
"use strict";
Object.assign(ITEMS, {
  thunderstone: { n: "벼락돌", p: "item", price: 2100, evo: { jjidami: "beondami" }, nobuy: 1, d: "번개 무늬가 새겨진 돌. 어떤 남켓몬에게 쓰면 진화한다.", ic: "thunderstone" },
  moonstone: { n: "달돌", p: "item", price: 2100, evo: { bangato: "dalbanga" }, nobuy: 1, d: "달빛을 머금은 돌. 어떤 남켓몬에게 쓰면 진화한다.", ic: "moonstone" },
  dancheongchip: { n: "단청 칩", p: "item", price: 2100, evo: { pikseldan: "dancheongmong" }, nobuy: 1, d: "단청 무늬를 담은 작은 칩. 어떤 남켓몬에게 쓰면 진화한다.", ic: "dancheongchip" },
  goldlump: { n: "금덩이", p: "item", price: 5000, evo: { bakari: "simsulbak" }, nobuy: 1, d: "번쩍이는 금덩이. 어떤 남켓몬에게 쓰면 진화한다.", ic: "goldlump" },
});

(function attachChapter28() {
  const put = (m, it, x, y) => { const D = MAPS[m]; if (!D) return; D.npcs = D.npcs || []; if (!D.npcs.some(n => n.item === it)) D.npcs.push({ item: it, x, y }); };
  put("baemsagol", "thunderstone", 2, 37);       // 찌다미가 밤마다 나오는 뱀사골 서쪽 끝
  put("manboksa", "moonstone", 4, 27);           // 방아토가 사는 만복사지 남서쪽
  put("route7", "dancheongchip", 20, 2);         // 픽셀단이 나오는 7번도로 북쪽 솔숲 끝
  put("inwol", "goldlump", 7, 29);               // 박알이가 사는 아영·인월 — 장터 남서쪽 골목

  // 흥부네 할아버지(미색마을): 볍씨 선물 뒤에는 앞장선 남켓몬의 친밀도를 봐 주고, 하루 한 번 쓰다듬어 줌(실제 게임의 친밀도 봐 주는 사람처럼)
  const H = MAPS.heungbu && (MAPS.heungbu.npcs || []).find(n => n.id === "hb_gp"); if (!H) return;
  const first = H.talk;
  H.talk = async () => {
    if (!G.flag("hb_gift")) return first();
    const m = G.party.find(x => x.hp > 0) || G.party[0];
    if (!m) return first();
    const f = m.fr ?? 70, n = mname(m);
    await say(`할아버지: 어디 보자……\n${n}의 얼굴을.`);
    await say(f >= 220 ? "할아버지: 너를 정말 좋아하는구나!\n이렇게 사이좋은 짝은 처음 본다."
      : f >= FR_EVO ? "할아버지: 정이 듬뿍 들었구나.\n눈빛만 봐도 알겠어."
      : f >= 100 ? "할아버지: 너를 꽤 따르는구나.\n조금 더 함께 다녀 보렴."
      : "할아버지: 아직은 서로\n알아 가는 중이구나.");
    const today = new Date().toDateString();
    if (G.flags.hb_pat !== today) { G.flags.hb_pat = today; frUp(m, 10); sfx("heal_hp"); await say(`할아버지가 ${J(n, "을")}\n가만가만 쓰다듬어 주었다!`); }
    await say("할아버지: 박알이는 정을 듬뿍 주며\n키우면 보물박이 된단다.\f욕심을 내어 금덩이를 쓰면\n심술박이 되고.");
    await say("할아버지: 흥부는 다친 제비 다리를\n고쳐 주었지.\f갚으라고 한 일이 아니었는데\n제비는 잊지 않았단다.");
  };
})();
