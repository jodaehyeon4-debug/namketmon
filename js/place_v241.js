// ===== v2.41 실전 도구·타입 도구·얼음 기술머신 놓기 · 춘향마트 진화의 돌·겨루기 도구 코너 · 관장·리그가 도구를 지님 =====
// 사용자: "이거 전부 해"(문서 체크리스트: 구할 수 없던 타입 도구 6종 놓기 · 중간 세기 얼음 기술 배지 4~5 무렵 · 배지 5 뒤 춘향마트에서 진화의 돌)
//        + "실전용 도구가 없다면 로컬라이징해서 전부 추가하고, 적절한 곳에 배치해."
// 실제 포켓몬처럼: 길·마을 곳곳 몬스터볼 모양 물건 + 숨겨진 물건, 진행할수록 좋은 도구 · 한 번 쓰는 도구는 가게에서 다시 삼 · 사천왕·챔피언은 실전 도구를 지님
// 자리는 지도마다 막다른 곳·모퉁이를 골라(scratchpad findspots.js) 테스트 audit_maps로 닿는지 확인. items_v241.js 뒤에 읽힘
"use strict";
Object.assign(ITEMS, {
  tm69: { n: "기술머신69", p: "tm", price: 3000, nobuy: 1, tm: "icepunch", tmTypes: ["얼음", "격투"], d: "냉동펀치를 가르쳐요. 차가운 주먹으로 쳐서 가끔 얼어붙게 하는 얼음 타입 기술이에요.", ic: "tm" },
  tm77: { n: "기술머신77", p: "tm", price: 3000, nobuy: 1, tm: "icywind", tmTypes: ["얼음", "물", "비행"], d: "얼어붙은바람을 가르쳐요. 차가운 바람으로 상대의 스피드를 떨어뜨리는 얼음 타입 기술이에요.", ic: "tm" },
});
(() => {
  // [지도, x, y, 도구, 숨김?] — 배지 단계 순서(0~1 다홍·2번도로·쪽빛 / 2 갈매·3~5번도로·비색 / 3 주홍·송화·6·7·11번도로·섬진강 나루 / 4 교룡산성·감청·8~10번도로·은신처 / 5 구룡·쑥빛·12번도로 / 6 인월·14·15번도로·미색·월백·뱀사골 / 7 반야봉·13·16·17번도로·바래봉·만행산)
  const PLACE = [
    ["world", 55, 92, "quickclaw"], ["world", 44, 14, "absorbbulb", 1],                       // 소색마을 동쪽 끝 · 다홍시티 북쪽 골목
    ["route2", 12, 15, "muscleband"], ["route2", 2, 32, "bigroot", 1],                        // 사매 들판 씨름 · 칡넝쿨
    ["jjok", 11, 35, "wiseglasses"], ["jjok", 29, 4, "blackglasses"],                         // 혼불문학관 선비 · 먹(악 타입 도구 '먹물')
    ["galmae", 21, 4, "eviolite"], ["galmae", 24, 26, "mentalherb", 1],                       // 덕과 아카데미 '싹수' · 박하
    ["route3", 27, 2, "lightclay"], ["route3", 44, 21, "heatrock", 1],                        // 옹기 가마 흰 찰흙 · 가마 곁 달군 돌
    ["route4", 35, 3, "airballoon"], ["route4", 15, 13, "whiteherb", 1],                      // 들판 연날리기 · 흰 쑥
    ["route5", 2, 5, "mysticwater"], ["route5", 2, 23, "shedshell", 1],                       // 요천 둑 '맑은이슬'
    ["bisaek", 23, 10, "softsand"], ["bisaek", 12, 4, "smoothrock", 1],                       // 섬진강 매립 현장 고운흙 · 매끈한 강돌
    ["juhong", 16, 4, "scopelens"], ["juhong", 5, 18, "widelens", 1],                         // 별 배움터 천리경
    ["songhwa", 29, 7, "rockyhelmet"], ["songhwa", 29, 17, "protectivepads", 1],              // 솔숲 밤송이
    ["route6", 55, 2, "damprock"],
    ["route7", 12, 27, "poisonbarb"],                                                          // 솔숲 쐐기벌레 '쐐기털'
    ["route11", 6, 13, "nevermeltice"], ["route11", 32, 13, "snowball", 1], ["route11", 27, 20, "razorclaw", 1],   // 고갯길 '얼음구슬'(얼음 타입을 일찍)
    ["seomjin", 26, 2, "shellbell"], ["seomjin", 39, 2, "blacksludge", 1],                    // 나루 조개 · 강 뻘
    ["gyoryong", 45, 24, "focussash"], ["gyoryong", 9, 2, "kingsrock", 1],                    // 산성 · 옥새
    ["gamcheong", 16, 31, "utilityumbrella"], ["gamcheong", 13, 35, "flameorb", 1],
    ["route8", 37, 16, "terrainextender"], ["route8", 13, 47, "cellbattery", 1],
    ["route9", 32, 5, "tm69"], ["route9", 57, 16, "ejectbutton", 1],                           // 중간 세기 얼음 기술(배지 4)
    ["route10", 12, 11, "tm77"], ["route10", 2, 20, "bindingband", 1],
    ["hideout1", 9, 2, "toxicorb"], ["hideout2", 14, 2, "gripclaw", 1],
    ["guryong", 13, 6, "dragonfang"], ["guryong", 26, 6, "luminousmoss", 1],                  // 아홉 용의 계곡 '용비늘' · 계곡 이끼
    ["ssukbit", 30, 35, "throatspray"], ["ssukbit", 19, 37, "expertbelt", 1],                 // 국악당 소리꾼 도라지청
    ["route12", 37, 34, "assaultvest"], ["route12", 13, 7, "weaknesspolicy", 1],
    ["inwol", 18, 16, "choicescarf"], ["inwol", 32, 16, "loadeddice", 1],                     // 인월 장터 · 윷놀이
    ["route14", 9, 5, "covertcloak"],
    ["misaek", 47, 39, "choicespecs"], ["misaek", 35, 5, "punchingglove", 1],
    ["route15", 2, 13, "blunderpolicy"],
    ["wolbaek", 44, 21, "redcard"],
    ["baemsagol", 9, 35, "safetygoggles"], ["baemsagol", 37, 10, "icyrock", 1],               // 뱀사골 찬 골짜기
    ["banya", 2, 17, "choiceband"], ["banya", 41, 17, "powerherb", 1],                         // 지리산 반야봉 산삼
    ["route13", 23, 2, "focusband"], ["route16", 11, 37, "heavydutyboots"], ["route17", 2, 29, "clearamulet"],
    ["manhaeng", 45, 26, "lifeorb"], ["baraebong", 21, 2, "foggyrock", 1],                     // 만행산 도깨비 · 바래봉 운해
  ];
  for (const [m, x, y, it, hid] of PLACE) {
    if (!MAPS[m] || !ITEMS[it]) { console.warn("place_v241", m, it); continue; }
    if (hid) (HIDDEN[m] = HIDDEN[m] || []).push([x, y, it]);
    else MAPS[m].npcs.push({ item: it, x, y });
  }
  window.PLACE_V241 = PLACE;

  // ---- 춘향마트: 2층 부적 코너에 진화의 돌(배지 5 뒤) · 3층 겨루기 도구 코너(배지에 따라 늘어남, 챔피언 뒤 모두) ----
  const nBadge = () => [1, 2, 3, 4, 5, 6, 7, 8].filter(n => hasBadge(n)).length;
  const STONES = ["thunderstone", "moonstone", "dancheongchip", "goldlump"];
  const c3 = MAPS.bigmart_2f && MAPS.bigmart_2f.npcs.find(n => n.id === "bm_clerk3");
  if (c3) c3.talk = async () => {
    const st = nBadge() >= 5 ? STONES.filter(k => ITEMS[k]) : [];
    await say(st.length ? "부적 코너예요!\f이번에 지리산에서 캔\n진화의 돌도 들여왔어요!" : "부적 코너예요!\n배틀에서 힘이 되어 줄 거예요.");
    await shop(["xattack", "xdefend", "xspatk", "xspdef", "xspeed", "xaccuracy", "direhit", "guardspec", ...st]);
  };
  const ONCE = ["whiteherb", "mentalherb", "airballoon", "absorbbulb", "cellbattery", "luminousmoss", "snowball"];
  const MID = ["focussash", "weaknesspolicy", "blunderpolicy", "ejectbutton", "redcard", "throatspray", "powerherb", "heatrock", "damprock", "smoothrock", "icyrock", "foggyrock", "lightclay", "terrainextender"];
  const champ = () => G.flag("champion") || G.flag("ending_seen");
  function battleStock() {
    const b = nBadge(); let L = b >= 2 ? ONCE.slice() : [];
    if (b >= 4) L = L.concat(MID);
    if (champ()) L = L.concat(BATTLE_ITEMS_V241.filter(k => !L.includes(k)), ["nurungji", "silkscarf", "charcoal", "mysticwater", "miracleseed", "magnet", "nevermeltice", "blackbelt", "poisonbarb", "softsand", "sharpbeak", "twistedspoon", "silverpowder", "hardstone", "spelltag", "dragonfang", "blackglasses", "metalcoat", "fairyfeather"]);
    return L.filter(k => ITEMS[k]);
  }
  window.battleStockV241 = battleStock;
  if (MAPS.bigmart_3f) MAPS.bigmart_3f.npcs.push({ id: "bm_clerk5", x: 12, y: 3, spr: "clerk", dir: "down", move: "fixed", talk: async () => {
    const L = battleStock();
    if (!L.length) { await say("겨루기 도구 코너예요!\f지금은 물건을 들이는 중이에요.\n어사패를 두 개 모으면 다시 와 줘요!"); return; }
    await say(champ() ? "챔피언님, 어서 오세요!\f리그에서 쓰는 실전 도구를\n모두 갖춰 놨어요!" : nBadge() >= 4 ? "겨루기 도구 코너예요!\f한 번 쓰면 없어지는 도구는\n여기서 다시 살 수 있어요." : "겨루기 도구 코너예요!\f어사패를 더 모으면\n더 좋은 도구를 들여놓을게요.");
    await shop(L); } });

  // ---- 지닌 도구: 관장 5~8은 한 마리, 리그 산지기·챔피언은 실전 도구(실제 게임 사천왕처럼) ----
  const give = (T, i, it) => { if (!T || !T.team || !T.team[i] || !ITEMS[it]) return; const e = T.team[i]; e[2] = Object.assign({}, e[2] || {}, { item: it }); };
  const T = nm => { try { return eval(nm); } catch (e) { return null; } };   // const로 정한 트레이너(전역 이름)
  give(T("GISU5"), 1, "muscleband"); give(T("YEOSIM6"), 1, "wiseglasses"); give(T("HEEJU7"), 1, "rockyhelmet"); give(T("JOBAKSA8"), 3, "expertbelt");
  give(T("HAERANG"), 0, "focussash"); give(T("HAERANG"), 1, "nurungji"); give(T("HAERANG"), 3, "expertbelt");
  give(T("YEONGRAN"), 0, "focussash"); give(T("YEONGRAN"), 2, "lifeorb"); give(T("YEONGRAN"), 3, "rockyhelmet");
  give(T("MRHWANG"), 0, "focussash"); give(T("MRHWANG"), 1, "weaknesspolicy"); give(T("MRHWANG"), 2, "assaultvest"); give(T("MRHWANG"), 3, "nurungji"); give(T("MRHWANG"), 4, "expertbelt"); give(T("MRHWANG"), 5, "lifeorb");
  // 설아(싸라기눈)·이글(쾌청): 날씨를 부르는 남켓몬에게 날씨 돌, 다른 한 마리에게 질끈띠
  for (const [k, w, rock] of [["seola", "hail", "icyrock"], ["igeul", "sun", "heatrock"]]) {
    const L = typeof LEADERS !== "undefined" && LEADERS[k]; if (!L || !L.team) continue;
    const setter = L.team.findIndex(e => { const o = e[2] || {}; return WX_AB[o.ab] === w || (o.mv || []).some(id => WX_MV[id] === w); });
    if (setter >= 0) give(L, setter, rock);
    give(L, setter === 0 ? 1 : 0, "focussash");
  }
})();
