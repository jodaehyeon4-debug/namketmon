// ===== v2.15 둘째 묶음: 마을 열 곳 집 늘리기 (19채 + 쑥빛시티 고원마트) =====
//   집마다 그 고장 이야기 한두 마디(지명·문화유산은 실제 남원 것만). 실내 틀은 v2.15에 넓힌 home_s · home_t · hanok2 · house_a
"use strict";
(() => {
  const D = MAPDATA;
  const MODERN = { floor: "floor_lino", wall: "wall_home", win: "win_home" }, HANOK = { floor: "floor_wood", wall: "wall_hanok", win: "win_home" };
  const house = (id, tmpl, name, bgm, exit, checks, npcs) => {
    MAPS[id] = { rows: D[tmpl].rows, stamps: D[tmpl].stamps, indoor: true, name, ...(tmpl.startsWith("home") ? MODERN : HANOK), bgm, noPopup: true, exit, checks, npcs };
  };
  const CK = {
    home_s: (tv, book) => [[0, 2, "냉장고에 반찬통이 가득하다."], [1, 2, "개수대가 반짝반짝 닦여 있다."], [2, 2, "개수대가 반짝반짝 닦여 있다."],
      [3, 2, tv], [4, 2, tv], [8, 2, book], [9, 2, book], [12, 2, "어항 속에서 금붕어가\n뻐끔뻐끔 헤엄친다."], [13, 2, "어항 속에서 금붕어가\n뻐끔뻐끔 헤엄친다."]],
    home_t: (desk, book) => [[0, 3, "이불이 반듯하게 개어져 있다."], [4, 2, desk], [5, 2, desk], [6, 2, "컴퓨터 화면에 남켓몬 도감이 열려 있다."], [8, 2, book], [9, 2, book],
      [10, 2, "옷장에 외출복이 걸려 있다."], [11, 2, "옷장에 외출복이 걸려 있다."], [12, 2, "피아노 위에 악보가 펼쳐져 있다."], [13, 2, "피아노 위에 악보가 펼쳐져 있다."]],
    house_a: (scr) => [[0, 1, "자개장이 반짝반짝 빛난다."], [1, 1, "자개장이 반짝반짝 빛난다."], [6, 2, scr], [7, 2, scr], [10, 2, "옛 책이 가지런히 꽂혀 있다."], [11, 2, "옛 책이 가지런히 꽂혀 있다."]],
    hanok2: (scr) => [[0, 1, "반닫이 위에 이불이 쌓여 있다."], [1, 1, "반닫이 위에 이불이 쌓여 있다."], [3, 2, scr], [4, 2, scr],
      [8, 2, "장독에서 구수한 된장 냄새가 난다."], [9, 2, "고추장 항아리다. 뚜껑을 덮어 두었다."]],
  };

  // 쪽빛마을(사매)
  house("house_jj4", "home_s", "주택", "jjok", exitJ("house_jj4"), CK.home_s("TV에서 '쪽빛 염색 체험' 방송을 하고 있다.", "'우리 고장 사매' 책이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "woman", move: "look", talk: "쪽은 여름에 베어서\n물에 담가 우려낸단다.\f그 물에 천을 담그면\n하늘빛이 곱게 배어 나지." },
    { x: 7, y: 5, spr: "kid_m", move: "wander", r: 1, talk: "서도역 기찻길 따라\n걷는 게 제일 좋아!" }]);
  house("house_jj5", "home_t", "주택", "jjok", exitJ("house_jj5"), CK.home_t("독서 감상문: '『혼불』을 읽고'", "'혼불' 전집이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "student", move: "look", talk: "사매에는 혼불문학관이 있어.\f소설 속 마을 이야기를\n그대로 볼 수 있대." }]);
  // 갈매마을(덕과)
  house("house_ga4", "hanok2", "한옥", "galmae", exitG("house_ga4"), CK.hanok2("병풍에 푸른 들판이 그려져 있다."), [
    { x: 2, y: 4, spr: "oldman", move: "look", talk: "갈매는 짙은 초록빛이란다.\f여름 들판이 딱\n그 빛깔이지." }]);
  house("house_ga5", "home_s", "주택", "galmae", exitG("house_ga5"), CK.home_s("TV에서 '덕과 아카데미 운동회' 소식이 나온다.", "운동회 사진첩이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "woman", move: "look", talk: "아카데미 운동장에서\n남켓몬 달리기 대회를 한대." },
    { x: 7, y: 5, spr: "kid_f", move: "wander", r: 1, talk: "우리 남켓몬이 1등 할 거야!\n……아마도!" }]);
  // 비색마을(금지)
  house("house_bs3", "home_t", "주택", "bisaek", exitB("house_bs3"), CK.home_t("관찰 일기: '금지 들판의 가을'", "'들판의 새' 도감이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "kid_m", move: "look", talk: "금지 들판은 남원에서\n제일 넓은 들판이래.\f가을이면 온통\n황금빛이야!" }]);
  // 송화마을(송동)
  house("house_sh3", "hanok2", "한옥", "songhwa", exitS("house_sh3"), CK.hanok2("병풍에 강가 솔숲이 그려져 있다."), [
    { x: 2, y: 4, spr: "oldwoman", move: "look", talk: "강바람이 솔숲을 지나면\n솔향이 마을까지 온단다." },
    { x: 5, y: 5, spr: "kid_f", move: "look", talk: "할머니가 솔잎 차를\n끓여 주셨어!" }]);
  house("house_sh4", "home_s", "주택", "songhwa", exitS("house_sh4"), CK.home_s("TV에서 '섬진강 물고기' 방송을 하고 있다.", "낚시 잡지가 꽂혀 있다."), [
    { x: 2, y: 4, spr: "man", move: "look", talk: "정자에 앉아 강을 보면\n시간 가는 줄 몰라." }]);
  // 주홍마을(주천)
  house("house_jh3", "house_a", "한옥", "juhong", exitJH("house_jh3"), CK.house_a("병풍에 육모정과 계곡이 그려져 있다."), [
    { x: 2, y: 4, spr: "oldman", move: "look", talk: "구룡계곡 들머리 육모정 옆에는\n춘향 묘가 있단다.\f이야기 속 사람이지만\n마음으로 기리는 거지." }]);
  house("house_jh4", "home_t", "주택", "juhong", exitJH("house_jh4"), CK.home_t("지도에 '지리산 둘레길 1구간'이 표시되어 있다.", "등산 안내서가 꽂혀 있다."), [
    { x: 2, y: 4, spr: "kid_m", move: "look", talk: "지리산 둘레길 1구간이\n주천에서 시작한대!\f운봉까지 이어진다더라." }]);
  // 감청마을(산곡동)
  house("house_gc3", "home_s", "주택", "gamcheong", exitGC("house_gc3"), CK.home_s("TV에서 '산성의 문' 다큐멘터리를 하고 있다.", "'교룡산성' 사진집이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "woman", move: "look", talk: "교룡산성 성문은\n무지개 모양 홍예문이야.\f돌을 둥글게 맞물려\n쌓은 거래." }]);
  house("house_gc4", "home_t", "주택", "gamcheong", exitGC("house_gc4"), CK.home_t("등산 일지: '산성 둘레 한 바퀴!'", "등산 지도가 꽂혀 있다."), [
    { x: 2, y: 4, spr: "student", move: "look", talk: "산성 오르는 길은 가팔라서\n운동화 끈을 꽉 매야 해!" }]);
  // 쑥빛시티(운봉): 고원마트 + 집 둘
  MAPS.gowon_mart = { rows: D.gowon_mart.rows, stamps: D.gowon_mart.stamps, indoor: true, name: "고원마트", floor: "floor_mart", floor2: "floor_mart2", wall: "wall_mart", win: "win_mart",
    bgm: "center", noPopup: true, exit: exitSB("gowon_mart"),
    checks: [[3, 2, "과자랑 라면이\n빼곡하게 놓여 있다."], [4, 2, "과자랑 라면이\n빼곡하게 놓여 있다."], [5, 2, "칫솔, 비누, 우산……\n없는 게 없다."], [6, 2, "칫솔, 비누, 우산……\n없는 게 없다."],
      [7, 2, "냉장고에 운봉 우유가\n시원하게 들어 있다."], [8, 2, "냉장고에 운봉 우유가\n시원하게 들어 있다."],
      [3, 4, "고랭지 배추가 수북하다.\n'운봉 고원에서 키웠어요!'"], [4, 4, "고랭지 배추가 수북하다.\n'운봉 고원에서 키웠어요!'"], [8, 4, "사과랑 배가 수북하다."], [9, 4, "사과랑 배가 수북하다."]],
    npcs: [{ x: 1, y: 2, spr: "clerk", dir: "down", move: "fixed", talk: () => shop(martStock()) },
      { x: 6, y: 4, spr: "oldwoman", dir: "left", move: "look", talk: "고원 바람이 차서\n배추가 달고 아삭하단다.\f김장할 때 이만한 게 없지." },
      { x: 10, y: 5, spr: "hiker", dir: "up", move: "look", talk: "바래봉 가기 전에\n물이랑 상처약 챙겨 가야지!" }] };
  MAPS.ssukbit.warps = (MAPS.ssukbit.warps || []).concat([[14, 6, ["gowon_mart", 6, 6, "up"]]]);
  house("house_sb4", "home_s", "주택", "ssukbit", exitSB("house_sb4"), CK.home_s("TV에서 '고원의 날씨'를 하고 있다.", "'운봉 고원 이야기' 책이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "man", move: "look", talk: "운봉은 높은 고원이라\n여름에도 밤이 선선해.\f별도 아주 잘 보인단다." }]);
  house("house_sb5", "hanok2", "한옥", "ssukbit", exitSB("house_sb5"), CK.hanok2("병풍에 북과 부채가 그려져 있다."), [
    { x: 2, y: 4, spr: "oldwoman", move: "look", talk: "고원 바람이 차서\n김장 배추가 달고 아삭해." },
    { x: 5, y: 5, spr: "kid_m", move: "look", talk: "할머니 집 장독대엔\n남켓몬이 숨어 있을 때가 있어!" }]);
  // 인월장터
  house("house_iw4", "home_s", "주택", "inwol", exitIW("house_iw4"), CK.home_s("TV에서 '지리산 나물 장터' 방송을 하고 있다.", "장부가 빼곡히 꽂혀 있다."), [
    { x: 2, y: 4, spr: "woman", move: "look", talk: "장날이면 지리산 나물이랑\n약초가 가득 나온단다." }]);
  house("house_iw5", "home_t", "주택", "inwol", exitIW("house_iw5"), CK.home_t("그림일기: '장터에서 뻥튀기를 먹었다'", "만화책이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "kid_f", move: "look", talk: "장터 뻥튀기 소리에\n깜짝 놀라 넘어졌어!\f뻥튀기는 맛있었어." }]);
  house("house_iw6", "hanok2", "한옥", "inwol", exitIW("house_iw6"), CK.hanok2("병풍에 둘레길 이정표가 그려져 있다."), [
    { x: 2, y: 4, spr: "oldman", move: "look", talk: "지리산 둘레길 걷는 사람들이\n인월에서 많이들 쉬어 간단다." }]);
  // 미색마을(흥부마을)
  house("house_ms3", "home_s", "주택", "misaek", exitMS("house_ms3"), CK.home_s("TV에서 '흥부와 놀부' 인형극을 하고 있다.", "옛이야기 그림책이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "woman", move: "look", talk: "흥부처럼 착하게 살면\n박에서 복이 나온대!" },
    { x: 7, y: 5, spr: "kid_m", move: "wander", r: 1, talk: "나는 놀부 말고\n흥부 할 거야!" }]);
  house("house_ms4", "hanok2", "초가", "misaek", exitMS("house_ms4"), CK.hanok2("병풍에 붉은 철쭉 산이 그려져 있다."), [
    { x: 2, y: 4, spr: "oldman", move: "look", talk: "봄이면 봉화산 철쭉도\n참 볼만하단다." }]);
  // 월백마을(산내)
  house("house_wb4", "home_t", "주택", "wolbaek", exitWB("house_wb4"), CK.home_t("물놀이 사진: '뱀사골 계곡에서'", "곤충 채집 도감이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "kid_m", move: "look", talk: "뱀사골 계곡물은\n한여름에도 얼음장 같아!" }]);
  // ---------------- 마음에 남는 대사(v2.15 새 사람 16명) — hearts.js 'after'와 같은 방식 ----------------
  const H215 = [
    ["bigmart_3f", 5, 5, "쉼터 할아버지", "높은 데서 보면 길이 다 이어져 있지.\n사람 사이도 그렇단다."],
    ["bigmart_1f", 9, 6, "추어탕 할머니", "어릴 때 먹던 그 맛은\n재료보다 마음이 내는 거란다."],
    ["shop_bread", 9, 4, "빵집 손님", "기다린 만큼 맛있는 건\n빵이나 사람이나 같더라."],
    ["shop_flower", 1, 2, "꽃집 주인", "꽃은 피는 때가 다 달라.\n너도 너만의 때가 올 거야."],
    ["apt_201", 5, 3, "201동 아저씨", "높이 살아도 이웃은\n얼굴 보고 인사해야 이웃이지."],
    ["apt_202", 5, 4, "202동 할머니", "손주들 웃음소리가 들리면\n집이 꽉 찬 것 같단다."],
    ["apt_104", 5, 4, "104동 아저씨", "새 동네는 처음엔 다 낯설어.\n먼저 인사하면 금방 익숙해지지."],
    ["apt_105", 5, 3, "둑길 할아버지", "천천히 걸어야 보이는 게 있어.\n남켓몬 걸음에 맞춰 걸어 보렴."],
    ["house_jj4", 2, 4, "쪽물 아주머니", "손이 파랗게 물들어도 괜찮아.\n좋아하는 일에 묻은 색이니까."],
    ["house_jh3", 2, 4, "육모정 할아버지", "이야기 속 사람도 오래 기억하면\n마음속에 살아 있단다."],
    ["house_iw6", 2, 4, "둘레길 할아버지", "길에서 만난 사람한테\n물 한 잔 건네는 게 인정이란다."],
    ["gowon_mart", 6, 4, "고원마트 할머니", "찬 바람을 견딘 배추가\n제일 달단다. 사람도 그래."],
    ["house_gc4", 2, 4, "산성 길 학생", "가파른 길도 한 걸음씩 가면\n어느새 꼭대기더라!"],
    ["house_wb4", 2, 4, "계곡 꼬마", "차가운 계곡물도 같이 들어가면\n하나도 안 무서워!"],
    ["world", 49, 90, "단지 아주머니", "이웃이 늘면 인사도 늘어.\n그게 동네가 크는 거래."],
  ];
  for (const [m, x, y, who, text] of H215) {
    const n = (MAPS[m] && MAPS[m].npcs || []).find(n => n.x === x && n.y === y && !n.item);
    if (!n) { if (typeof HEART_LOG !== "undefined") HEART_LOG.miss.push(m + ":" + x + ":" + y); continue; }
    n.heart = who; const orig = n.talk;
    n.talk = typeof orig === "string" ? orig + "\f" + text : async (a) => { await orig(a); await say(text); };
    if (typeof HEART_LOG !== "undefined") HEART_LOG.ok++;
  }
  window.TOWNS_V215 = true;
})();
