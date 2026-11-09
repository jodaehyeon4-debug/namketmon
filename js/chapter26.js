// ===== v2.35 엔딩: 명예의 전당 → '오작교를 건너다'(광한루원 오작교, 가람·홍우성·은직성) → 방삼·단지 추어탕 수레 → 엔딩 크레디트 → 우리 집 =====
// 사운드연출 문서 명장면 13 '오작교를 건너다 — 엔딩' · 본디회 문서 '방삼·단지: 끝에 추어탕 노점 → 월매댁 알바' · '아무도 다치지 않음 · 화해 결말'
// 실제 포켓몬처럼 묘사(명예의 전당 → 크레디트 → 집에서 다시 시작, 리그는 다시 도전 가능 — 구조만), 닌텐도 그림은 베끼지 않음
// chapter25.js 뒤, pad.js 앞에 읽힘
"use strict";
window.ENDING_READY = true;

let END_FX = null;
function endFx(k) {
  END_FX = { k, t: 0 };
  const ov = new Overlay(() => {
    if (!END_FX) { setTimeout(() => Scenes.pop(ov), 0); return; }
    const F = END_FX; F.t++;
    if (F.k === "stars" || F.k === "bridge") {                      // 칠석 밤하늘 · 은하수
      for (let i = 0; i < 40; i++) { const x = (i * 53 + 17) % SW, y = (i * 29 + 7) % 60, tw = (Math.floor(F.t / 8) + i) % 5 === 0; rect(x, y, 1, 1, tw ? "#ffffff" : "#c8d8ff"); }
      g.globalAlpha = 0.18; g.fillStyle = "#dfe8ff"; g.beginPath(); g.ellipse(SW / 2, 22, SW / 2, 10, -0.08, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
    }
    if (F.k === "bridge") {                                         // 까마귀·까치 떼가 놓는 다리
      const n = Math.min(16, Math.floor(F.t / 5));
      for (let i = 0; i < n; i++) {
        const k = i / 15, x = 20 + (SW - 40) * k, y = 44 - Math.sin(k * Math.PI) * 26 + Math.sin(F.t / 6 + i) * 1.5, w = (Math.floor(F.t / 5) + i) % 2;
        rect(x - 3, y, 7, 2, "#1e1e2c"); rect(x - 4 - w, y - 1 - w, 3, 1, "#1e1e2c"); rect(x + 2 + w, y - 1 - w, 3, 1, "#1e1e2c"); if (i % 2) rect(x - 1, y + 1, 3, 1, "#f0f0f8");
      }
      if (n >= 16) { g.globalAlpha = 0.6 + 0.2 * Math.sin(F.t / 8); g.strokeStyle = "#fff4c8"; g.lineWidth = 1; g.beginPath();
        for (let i = 0; i <= 24; i++) { const k = i / 24, x = 20 + (SW - 40) * k, y = 48 - Math.sin(k * Math.PI) * 26; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.globalAlpha = 1; }
    }
  });
  const i = Scenes.st.indexOf(World); if (i >= 0) Scenes.st.splice(i + 1, 0, ov); else Scenes.push(ov);
}

const CREDITS = [
  ["남켓몬", "용성지방 이야기"], [""],
  ["기획 · 이야기", "조대현 선생님 (덕과초등학교)"], [""],
  ["만든 이", "Claude"], [""],
  ["그림", "손 도트 · 캔바·제미나이 시안을 옮긴 도트"],
  ["음악", "국악기 소리를 수식으로 합성한 곡"],
  ["글꼴", "Galmuri (SIL Open Font License)"], [""],
  ["남원 이야기", "확인한 사실은 그대로,"], ["", "전해 오는 이야기는 '전해져요'로,"], ["", "지어낸 이야기는 지어낸 대로."], [""],
  ["등장인물", "모두 남켓몬 세계의 사람들이에요."], [""],
  ["고마운 분들", "남원의 산과 강, 마을, 그리고"], ["", "이 게임을 끝까지 해 준 당신"], [""],
  ["Special Thanks", "포켓몬이라는 세계를 만든 사람들"], ["", "The Pokémon Company · GAME FREAK"], [""],
  ["Thank you,", "all the 5th graders of"], ["", "Deokgwa Elementary School!"], [""], [""],
  ["", "— 끝 —"],
];
const CY = (() => { let y = 0; return CREDITS.map(([a, b]) => { const y0 = y; y += a && b ? 30 : a || b ? 16 : 10; return y0; }); })();   // 줄마다 자리(제목+내용은 두 줄)
async function endCredits() {
  bgm("title");
  let y0 = SH + 10, done = false;
  const ov = new Overlay(() => {
    rect(0, 0, SW, SH, "#0c0c18");
    for (let i = 0; i < 30; i++) rect((i * 61 + 13) % SW, (i * 37 + 5) % SH, 1, 1, i % 3 ? "#3a3a60" : "#8888c0");
    CREDITS.forEach(([a, b], k) => { const y = Math.round(y0 + CY[k]); if (y < -30 || y > SH) return;
      const D = typeof textE === "function" ? (s, x, yy, o) => textE(s, x, yy, Object.assign({ font: "g11" }, o)) : (s, x, yy, o) => Font.draw(g, s, x, yy, o);   // v2.38 'é'(Pokémon)
      if (a && b) { D(a, SW / 2, y, { align: "center", font: "g9", col: "#e8c860", sh: null }); }
      else if (a) D(a, SW / 2, y, { align: "center", col: "#ffffff", sh: null });
      if (b) D(b, SW / 2, y + (a ? 12 : 0), { align: "center", col: "#e0e0f0", sh: null }); });
  });
  Scenes.push(ov);
  const end = -CY[CY.length - 1] + SH / 2;
  while (y0 > end) { y0 -= 0.5; await frames(1); if (Input.ok && Input.ok() && y0 < SH - 40) y0 -= 3; }
  await frames(90);
  Scenes.pop(ov);
}

async function endingRun() {
  const P = World.player;
  G.flag("ending_now", true);
  await say("교장 선생님: 오늘 밤은 칠석이다.\f광한루원 오작교에\n누가 기다리고 있다더구나.");
  await fadeOut(24);
  G.flag("hof_now", false);
  const clk0 = G.clock ? { ...G.clock } : null;
  G.clock = { mode: "game", min: 21 * 60 };
  World.load("world", 7, 13, "right"); World.cam = World.camTarget();
  bgm("ojakgyo");
  await fadeIn(24);
  await say("광한루원 오작교.\n밤하늘에 은하수가 흐른다.");
  await walk(P, "right", "right", "right", "right");
  const GR = act("end_garam");
  if (GR) { await walk(GR, "left"); face(GR, P); }
  await say("가람: ……왔구나.\n챔피언.");
  await say("가람: 들렸어.\f이번엔 남켓몬 목소리가 아니라\n사람 목소리가.");
  await say("가람: 본디회는 이제 없어.\f여울, 솔뫼, 옹이 형……\n칠로 어른들이랑 같이\f'본디 자리 지킴이'를\n하기로 했어.");
  await say("가람: 쫓아내는 게 아니라,\n사람이랑 남켓몬이\f같이 지낼 자리를\n찾는 일이야.");
  try { Audio2.cry("honguseong"); } catch (e) {}
  await say("가람 곁에서 홍우성이\n낮게 울었다.");
  const ej = G.party.find(m => m.k === "eunjikseong");
  if (ej) { try { Audio2.cry("eunjikseong"); } catch (e) {} await say(`${J(mname(ej), "이")} 대답하듯\n날개를 폈다!`); }
  endFx("bridge");
  await say("까마귀와 까치 떼가 날아올라\n밤하늘에 다리를 놓았다.");
  await say("가람: 오작교는 견우와 직녀가\n건너는 다리지만,\f그 다리를 놓는 건\n작은 새들이래.\f……한 마리 한 마리는 작아도.");
  await say("가람: 나도 건너 볼게.\n사람 쪽으로.");
  if (typeof gqEnding === "function") await gqEnding();   // v2.60 가람의 밤에 한 대답
  if (GR) { await walk(GR, "left"); await frames(10); }
  await say("가람: ……같이 걸어 줄래?");
  await frames(30);
  // 방삼·단지 추어탕 수레
  const BS = act("end_bangsam"), DJ = act("end_danji");
  bgm("bondi");
  if (BS) { BS.hidden = false; } if (DJ) { DJ.hidden = false; }
  await say("방삼: 추어탕이요~ 추어탕!\n남원 추어탕 사세요~!");
  if (BS) await walk(BS, "left", "left");
  if (DJ) await walk(DJ, "left", "left");
  if (BS) face(BS, P);
  await say("방삼: 어? 너는……!\f……크흠. 오늘은 칠석이니까\n싸움은 쉬는 날이다.");
  await say("단지: 형님이랑 저,\n월매댁 추어탕집에서 일해요!\f항아리는 이제 김치랑\n동치미 담는 데만 써요!");
  await say("방삼: 챔피언 축하 기념이다.\n한 그릇 공짜로 주마!");
  await say("단지: ……근데 형님,\n우리 월급은요?");
  await say("방삼: 바보야! 할머니가\n밥은 배불리 주신다고 했잖아!");
  await say("가람: ……푸흡.");
  await say("모두 한바탕 웃었다.\f광한루원 위로\n은하수가 반짝였다.");
  END_FX = null;
  await fadeOut(30);
  await endCredits();
  // 우리 집
  G.flag("ending_now", false); G.flag("ending_seen", true);
  if (clk0) G.clock = clk0;
  World.load("home", 3, 5, "up"); World.cam = World.camTarget();
  bgm("town");
  await fadeIn(24);
  const MO = act("mom"); if (MO) face(MO, P);
  await say("엄마: 어서 와!\f……챔피언이 됐다며?\n동네에 소문이 다 났어.");
  await say("엄마: 오늘 저녁은 추어탕이야.\f월매댁에서 두 그릇이나\n공짜로 줬지 뭐니.");
  await say("엄마: 푹 쉬고,\n내일은 또 어디 가 볼 거야?");
  await say("엄마: 참, 오작교에서 만난 가람이가\n한 판 겨뤄 보고 싶대.\f윤슬 박사님도 전설 남켓몬\n소문을 들었다더라.");   // v2.38 D20 클리어 뒤 전설 안내
  G.healAll();
  G.heal = ["home", 3, 5, "up"];
  if (typeof jpEpilogue === "function") await jpEpilogue();   // v2.59 정표 · 박씨 · 제비꼬 · 4월의 엽서
  await say("(이야기는 여기서 끝이지만\n모험은 계속돼요!\f오방고원 리그에 다시 도전하거나\n도감을 채워 보세요.)");
  if (typeof doSave === "function") await doSave();
}

(function attachChapter26() {
  const W = MAPS.world;
  const endShow = () => G.flag("ending_now");
  W.npcs.push(
    { id: "end_garam", x: 14, y: 13, spr: "garam", dir: "left", move: "fixed", show: endShow, talk: "가람: ……같이 걸어 줄래?" },
    { id: "end_bangsam", x: 18, y: 12, spr: "bondi", dir: "left", move: "fixed", hidden: true, show: endShow, talk: "방삼: 추어탕 한 그릇 하고 가!" },
    { id: "end_danji", x: 19, y: 12, spr: "bondi", dir: "left", move: "fixed", hidden: true, show: endShow, talk: "단지: 시래기 듬뿍이요!" },
  );
})();
