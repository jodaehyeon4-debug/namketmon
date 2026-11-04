// ===== 2번도로: 다홍시티 북쪽 출구 → 오리정 언덕 → 사매 들판 → 쪽빛마을 어귀 =====
"use strict";
(function attachRoute2() {
  const W = MAPS.world;
  // 다홍시티 북쪽 끝(y0) ↔ 2번도로 남쪽 끝(y55): 길이 이어지듯 걸어서 넘어감
  W.warps = (W.warps || []).concat([18, 19, 20, 21].map(x => [x, 0, ["route2", x, 43, "up", "edge"]]));
  const R2 = MAPDATA.route2;
  MAPS.route2 = {
    rows: R2.rows, stamps: R2.stamps, name: "2번도로",
    warps: [18, 19, 20, 21].map(x => [x, 43, ["world", x, 0, "down", "edge"]]),
    zones: [["오리정", 2, 33, 17, 41], ["2번도로", 0, 0, 55, 43]],
    zinfo: { "2번도로": { bgm: "route", enc: "2번도로", rate: 0.12, bg: "grass" }, "오리정": { bgm: "route", enc: "2번도로", rate: 0.12, bg: "grass" } },
    signs: [
      [17, 41, "2번도로\n← 오리정 · → 사매 들판 · 쪽빛마을"],
      [37, 23, "사매 들판\n논두렁으로만 다녀 주세요!"],
      [28, 3, "↑ 쪽빛마을\n소설 『혼불』의 마을"],
    ],
    checks: [
      ...[5, 6, 7, 8].map(x => [x, 36, "오리정\f춘향이 한양으로 떠나는 몽룡을\n눈물로 배웅했다고 전해지는 정자."]),
      ...[[7, 19], [29, 26], [31, 19]].map(([x, y]) => [x, y, async () => { if (["저녁", "밤"].includes(timeOfDay())) await say("허수아비가 서 있다.\f……방금 고개를 돌린 것 같은데?"); else await say("밀짚모자를 쓴 허수아비가\n논을 지키고 서 있다."); }]),
    ],
    npcs: [
      { id: "r2_oldman", x: 9, y: 37, spr: "oldman", dir: "left", move: "look", talk: "이 정자가 오리정이란다.\f옛이야기 「춘향전」에서 춘향이가\n한양으로 떠나는 몽룡을\f눈물로 배웅한 곳이라고 전해지지.\f지금 건물은 1953년에\n다시 세운 거란다." },
      { id: "r2_woman", x: 11, y: 22, spr: "woman", dir: "right", move: "look", talk: "논에는 벼가 자라고 있어.\n들어가면 안 된단다!\f대신 논두렁 풀숲에는\n남켓몬이 많이 산단다." },
      { id: "r2_kid", x: 35, y: 23, spr: "kid_m", move: "wander", r: 1, talk: () => say(["저녁", "밤"].includes(timeOfDay()) ? "쉿! 허수아비가 움직였어!\n진짜라니까!" : "밤이 되면 허수아비가 움직인대!\f에이, 설마……") },
      { id: "boreum_r2", x: 17, y: 8, spr: "boreum", dir: "right", move: "fixed", talk: async () => {
        if (!G.flag("net_gift")) { await say(`보름: ${G.name}! 여기 벌레 남켓몬\n진짜 많아! 영상 찍는 중이야.`); await say("보름: 이거 써 봐!\n벌레랑 물 남켓몬이 잘 잡히는 볼이래."); await getItem("net", 3); G.flag("net_gift", true); return; }
        await say("보름: 꼬물배가 고치배로 바뀌는 순간을\n찍고 싶은데, 언제 바뀔지 모르겠어!"); } },
      // 쪽빛마을 어귀 (다음 버전에서 열림)
      { id: "r2_worker1", x: 25, y: 1, spr: "man", dir: "down", move: "fixed", talk: "미안! 쪽빛마을로 가는 다리를\n고치는 중이란다.\f(플레이 버전은 여기까지예요!\n다음 이야기: 쪽빛마을과 미영 선생님)" },
      { id: "r2_worker2", x: 26, y: 1, spr: "man", dir: "down", move: "fixed", talk: "조금만 기다려 주렴.\n금방 고칠게!" },
      // 떨어진 물건
      { item: "namket", n: 3, x: 5, y: 3 }, { item: "antidote", x: 3, y: 29 }, { item: "potion", x: 51, y: 36 }, { item: "xspeed", x: 3, y: 41 }, { item: "odi", x: 53, y: 3 },
      // 트레이너
      { x: 30, y: 37, spr: "bugboy", dir: "left", trainer: { id: "r2_jihun", cls: "벌레잡이", name: "지훈", spr: "bugboy", range: 4, base: 16, team: [["kkomulbae", 7], ["kkulbeong", 8]],
        intro: "오리정 언덕 풀숲은\n벌레 남켓몬 천국이야! 승부다!", lose: "내 꿀벙이가……!", after: "꼬물배는 금방 고치배가 돼.\n그다음엔…… 비밀이야!" } },
      { x: 23, y: 23, spr: "kid_m", dir: "left", trainer: { id: "r2_ujin", cls: "꼬마", name: "우진", spr: "kid_m", range: 3, base: 16, team: [["olchaengmi", 8], ["jjaekcham", 8]],
        intro: "논두렁 달리기 대장이 나야!\n남켓몬 승부도 대장이지!", lose: "으악, 대장 자리를 뺏겼다!", after: "올챙미는 도랑에서 잡았어.\n물가 풀숲을 잘 찾아봐!" } },
      { x: 36, y: 26, spr: "kid_f", dir: "up", trainer: { id: "r2_daeun", cls: "꼬마 숙녀", name: "다은", spr: "kid_f", range: 3, base: 16, team: [["jjaekcham", 8], ["olchaengmi", 9]],
        intro: "참새는 벼 이삭을 좋아한대.\n그래서 허수아비가 있는 거야!", lose: "에잇, 허수아비보다 무섭잖아!", after: "가을이 되면 들판이\n온통 금빛이 된대!" } },
      { x: 45, y: 19, spr: "bugboy", dir: "down", trainer: { id: "r2_seungwoo", cls: "벌레잡이", name: "승우", spr: "bugboy", range: 3, base: 16, team: [["gochibae", 9], ["kkomulbae", 8], ["kkulbeong", 9]],
        intro: "잠자리채 준비 완료!\n너도 잡아 주마!", lose: "잠자리채가 찢어졌어……", after: "쪽빛마을 숲에는 나비 남켓몬이\n산대. 보고 싶다!" } },
    ],
  };
})();
