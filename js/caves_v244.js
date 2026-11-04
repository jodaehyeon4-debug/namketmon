// ===== v2.44 지리산 굴 두 곳 — 운봉 바람굴(12번도로, 배지 5) · 뱀사골 얼음굴(뱀사골, 배지 6) =====
// 사용자: "동굴은 없지? 동굴도 지리산 동굴 맵같은 거 몇 개 있으면 하긴 해." (이미 있는 만행산 바위굴과 합쳐 굴 셋)
// 실제 포켓몬 동굴처럼: 바깥 바위에 굴 입구(3×3) → 안은 어두운 바위 바닥, 바닥 어디서나 야생(박쥐·바위·땅, 얼음굴은 얼음 남켓몬),
//   막다른 곳마다 도구, 숨은 도구, 굴 탐험가 트레이너, 입구 발판을 아래로 밟으면 밖으로
// 지도 글자: # 바위벽 · _ 바닥 · M 나가는 발판. 바닥 무늬·벽은 만행산 바위굴과 같은 굴 타일
"use strict";
ITEMS.tm14 = { n: "기술머신14", p: "tm", price: 3000, nobuy: 1, tm: "blizzard", tmTypes: ["얼음"], d: "눈보라를 가르쳐요. 거센 눈보라로 상대를 얼게 할 때가 있는 얼음 타입 기술이에요. 싸라기눈 속에서는 반드시 맞아요.", ic: "tm" };
(() => {
  const floorFn = (x, y) => ((x * 7 + y * 13) % 5 === 0 ? "floor_cave2" : "floor_cave");
  const CAVES = [
    { id: "ice_cave", name: "뱀사골 얼음굴", out: "baemsagol", mouth: [22, 7], bgm: "route", tint: "#9fd6ff",
      rows: ["############################", "############################", "###________####_________####", "###________####_________####", "###______________________###",
        "######_____#####_________###", "######_____#####___##____###", "###________#####___##____###", "###________________##____###", "###____######___________####",
        "###____######___________####", "###____######____####___####", "###______________####___####", "#####____________________###", "#####___###########______###",
        "###_____###########______###", "###______________________###", "###______________________###", "##########_______###########", "##########_______###########",
        "#############M##############", "                            "],
      stamps: [["cave_rock", 6, 3], ["cave_rock2", 21, 2], ["cave_rock", 9, 12], ["cave_rock", 23, 16], ["cave_rock", 4, 16], ["cave_rock2", 16, 9]],
      spawns: [{ k: "godeumi", lv: "40–44", t: "모두", r: "흔함" }, { k: "bakjumi", lv: "40–44", t: "모두", r: "흔함" }, { k: "dongchimu", lv: "41–44", t: "모두", r: "가끔" },
        { k: "neodeolba", lv: "41–45", t: "모두", r: "가끔" }, { k: "malgupju", lv: "41–45", t: "밤", r: "가끔" }, { k: "seorikkot", lv: "42–45", t: "모두", r: "드묾" }, { k: "gusangmi", lv: "41–44", t: "모두", r: "드묾" }],
      items: [{ item: "tm14", x: 23, y: 2 }, { item: "maxrevive", x: 4, y: 2 }, { item: "fullrestore", x: 24, y: 14 }, { item: "maxrepel", x: 4, y: 9 }],
      hidden: [[7, 7, "ultra" in ITEMS ? "ultra" : "ok"], [24, 5, "hyperpotion"], [11, 19, "omija"]],
      checks: [[6, 3, "얼음이 두껍게 덮인 바위다.\f여름에도 녹지 않는 찬 기운이\n바위틈에서 새어 나온다."], [9, 12, "고드름이 바위 끝에 매달려 있다.\f똑…… 똑……\n물방울이 떨어지며 다시 언다."]],
      trainers: [
        { x: 18, y: 4, spr: "hiker", dir: "left", trainer: { id: "ic_haneul", cls: "굴 탐험가", name: "하늘", spr: "hiker", range: 3, base: 24, team: [["godeumi", 42], ["neodeolba", 43]],
          intro: "얼음굴은 여름에도 춥지!\n남켓몬도 단단해져!", lose: "손이 꽁꽁 얼었네……", after: "고드름은 위에서 떨어질 수 있으니\n늘 위를 조심해!" } },
        { x: 20, y: 16, spr: "student", dir: "up", trainer: { id: "ic_seoyun", cls: "탐사반 학생", name: "서윤", spr: "student", range: 3, base: 22, team: [["dongchimu", 43], ["bakjumi", 42]],
          intro: "굴 속 생물을 조사하러 왔어!\n너도 조사 대상이야!", lose: "기록장에 '패배'라고 적어야겠다……", after: "박쥐는 겨울에 굴에서\n겨울잠을 잔대.\f그러니까 조용히 지나가 줘!" } },
      ],
      npc: { x: 12, y: 17, spr: "oldman", dir: "up", heart: "얼음굴 지킴이", talk: "지킴이: 이 굴은 바위틈으로 찬바람이\n들어와서 늘 얼음이 있단다.\f굴은 깜깜하고 미끄러우니\n혼자 깊이 들어가면 안 돼.\f……남켓몬이랑 함께라면\n조금은 괜찮겠지만." } },
    { id: "wind_cave", name: "운봉 바람굴", out: "route12", mouth: [31, 17], bgm: "route",
      rows: ["##########################", "##########################", "###_______######________##", "###_______######________##", "###___________________####",
        "######____####________####", "######____####___###__####", "###_______####___###__####", "###______________###__####", "###___#######_________####",
        "###___#######_________####", "###______________######_##", "#####____________________#", "#####______________#####_#", "##############_____#####_#",
        "##############_____#####_#", "################M#########", "                          "],
      stamps: [["cave_rock2", 7, 2], ["cave_rock", 20, 3], ["cave_rock", 4, 8], ["cave_rock", 16, 12], ["cave_rock", 10, 4]],
      spawns: [{ k: "bakjumi", lv: "33–37", t: "모두", r: "흔함" }, { k: "dolkongi", lv: "33–37", t: "모두", r: "흔함" }, { k: "gulsomi", lv: "34–37", t: "모두", r: "가끔" },
        { k: "dudeokong", lv: "34–37", t: "모두", r: "가끔" }, { k: "malgupju", lv: "34–38", t: "밤", r: "가끔" }, { k: "ttanggul", lv: "35–38", t: "모두", r: "드묾" }, { k: "godeumi", lv: "34–37", t: "아침", r: "드묾" }],
      items: [{ item: "ok", n: 2, x: 22, y: 2 }, { item: "fullheal", x: 24, y: 15 }, { item: "hyperpotion", x: 3, y: 2 }, { item: "maxether" in ITEMS ? "maxether" : "ether", x: 21, y: 8 }],
      hidden: [[3, 10, "superrepel"], [23, 11, "revive"], [17, 15, "jujube"]],
      checks: [[20, 3, "바위틈에서 바람이 휘익 불어온다.\f굴이 산 반대편까지\n뚫려 있는 걸까?"], [16, 12, "바위에 바람이 깎은\n물결 무늬가 남아 있다."]],
      trainers: [
        { x: 12, y: 8, spr: "hiker", dir: "down", trainer: { id: "wc_gangsan", cls: "굴 탐험가", name: "강산", spr: "hiker", range: 3, base: 22, team: [["dolkongi", 35], ["gulsomi", 36]],
          intro: "바람 소리 들려?\n굴이 숨을 쉬는 거야!", lose: "바람에 날아갔다……", after: "굴 바람은 여름엔 시원하고\n겨울엔 따뜻하게 느껴진대." } },
      ],
      npc: { x: 15, y: 13, spr: "kid_m", dir: "up", heart: "바람굴 꼬마", talk: "운봉 고원은 바람이 세서\n굴에도 바람이 들어온대.\f손을 대 봐!\n시원하지?" } },
  ];
  for (const C of CAVES) {
    const W = C.rows[0].length; for (const r of C.rows) if (r.length !== W) console.warn("cave row", C.id);
    const M = C.rows.findIndex(r => r.includes("M")), mx = C.rows[M].indexOf("M");
    const [ox, oy] = C.mouth, door = [ox + 1, oy + 2];
    DATA.spawns[C.name] = C.spawns.filter(e => MON[e.k]);
    MAPS[C.id] = {
      rows: C.rows, stamps: C.stamps, indoor: true, cave: true, caveEnc: true, name: C.name, floorFn, wall: "wall_cave", bgm: C.bgm, noPopup: false,
      enc: C.name, rate: 0.08, bg: "cave", exit: [C.out, door[0], door[1] + 1, "down"],
      checks: C.checks,
      over: C.tint ? () => { g.globalAlpha = 0.2; rect(0, 0, SW, SH, C.tint); g.globalAlpha = 1; } : undefined,   // 얼음굴은 푸르스름한 찬 기운
      npcs: [...C.items, ...C.trainers, Object.assign({ id: C.id + "_npc", move: "look" }, C.npc)],
    };
    if (typeof HIDDEN !== "undefined") HIDDEN[C.id] = C.hidden.filter(h => ITEMS[h[2]]);
    // 바깥: 굴 입구(3×3) — 밑에 있던 나무는 걷어 냄
    const O = MAPS[C.out]; if (!O) continue;
    for (let j = 0; j < 3; j++) { const r = O.rows[oy + j].split(""); for (let i = 0; i < 3; i++) r[ox + i] = "."; O.rows[oy + j] = r.join(""); }
    (O.stamps = O.stamps || []).push(["cave_mouth", ox, oy, { to: [C.id, mx, M, "up"] }]);
    { const sx = door[0] - 2, sy = door[1] + 1, r = O.rows[sy].split("");            // 입구 옆 안내판(실제 게임처럼)
      if (r[sx] === ".") { r[sx] = "s"; O.rows[sy] = r.join(""); (O.signs = O.signs || []).push([sx, sy, C.name + "\f굴 안은 어둡고 미끄러워요.\n남켓몬과 함께 조심해서 다녀요."]); } }
    if (typeof TOWN_ZONE !== "undefined") TOWN_ZONE[C.name] = TOWN_ZONE[C.out === "baemsagol" ? "뱀사골" : "12번도로"] || null;
  }
  window.CAVES_V244 = CAVES.map(C => C.id);
})();
