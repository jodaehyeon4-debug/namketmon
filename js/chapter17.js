// ===== v2.13 마을마다 집·사람 늘리기 (실제 게임 1~5세대 마을 수준) =====
//   새 집 19채(다홍시티 3 · 소색 1 · 쪽빛 2 · 갈매 2 · 비색 1 · 송화 1 · 주홍 1 · 감청 1 · 쑥빛 2 · 인월 2 · 미색 1 · 월백 2)
//   실내 틀: home_s(현대식 거실) · home_t(공부방) · house_a(한옥) · hanok2(한옥 살림방). 집마다 그 고장 이야기를 한두 마디씩
//   마을 바깥에도 한두 사람씩 더(집 앞을 오가는 이웃). 마음에 남는 대사는 hearts.js v2.13 묶음
"use strict";
(() => {
  const D = MAPDATA;
  const MODERN = { floor: "floor_lino", wall: "wall_home", win: "win_home" }, HANOK = { floor: "floor_wood", wall: "wall_hanok", win: "win_home" };
  // 틀마다 살펴보기(가구 칸) — 집마다 글은 바꿔 끼움
  const CK = {
    home_s: (tv, book) => [[0, 2, "냉장고에 김치통이 가득하다."], [1, 2, "개수대가 반짝반짝 닦여 있다."], [2, 2, "개수대가 반짝반짝 닦여 있다."],
      [3, 2, tv], [4, 2, tv], [8, 2, book], [9, 2, book]],
    home_t: (desk, book) => [[0, 3, "이불이 반듯하게 개어져 있다."], [4, 2, desk], [5, 2, desk], [6, 2, "컴퓨터 화면에 남켓몬 도감 숙제가 열려 있다."], [8, 2, book], [9, 2, book]],
    house_a: (scr) => [[0, 1, "자개장이 반짝반짝 빛난다."], [1, 1, "자개장이 반짝반짝 빛난다."], [6, 2, scr], [7, 2, scr]],
    hanok2: (scr) => [[0, 1, "반닫이 위에 이불이 쌓여 있다."], [1, 1, "반닫이 위에 이불이 쌓여 있다."], [3, 2, scr], [4, 2, scr],
      [8, 2, "장독에서 구수한 된장 냄새가 난다."], [9, 2, "고추장 항아리다. 뚜껑을 덮어 두었다."]],
  };
  const house = (id, tmpl, name, bgm, exit, checks, npcs) => {
    MAPS[id] = { rows: D[tmpl].rows, stamps: D[tmpl].stamps, indoor: true, name, ...(tmpl.startsWith("home") ? MODERN : HANOK), bgm, noPopup: true, exit, checks, npcs };
  };

  // ---------------- 다홍시티 동쪽 주택가 ----------------
  house("house_dh1", "home_s", "주택", "city", exitTo("house_dh1"), CK.home_s("TV에서 '이번 주 남원 날씨'를 하고 있다.", "'요천 따라 걷는 길' 지도책이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "woman", move: "look", talk: "우리 집 앞길로 쭉 가면\n10번도로가 나와.\f지리산 쪽 주홍마을로\n이어지는 길이란다." },
    { x: 7, y: 4, spr: "kid_m", move: "wander", r: 1, talk: "광한루원 연못엔 잉어가 살아.\f오작교 위에서 내려다보면\n빨간 잉어가 뻐끔뻐끔!" },
  ]);
  house("house_dh2", "hanok2", "한옥", "city", exitTo("house_dh2"), CK.hanok2("병풍에 춘향과 몽룡이 그려져 있다."), [
    { x: 2, y: 4, spr: "oldman", move: "look", talk: "남원 추어탕은 미꾸라지를 곱게 갈아\n시래기랑 푹 끓인단다.\f가을 논에서 살이 오른 미꾸라지가\n제일 맛나지." },
    { x: 5, y: 5, spr: "oldwoman", move: "look", talk: "해마다 봄이면 춘향제가 열려.\f광한루에서 춘향이랑 몽룡이가\n처음 만난 이야기를 기리는 잔치란다." },
  ]);
  house("house_dh3", "home_t", "주택", "city", exitTo("house_dh3"), CK.home_t("숙제 공책: '우리 고장의 판소리 — 춘향가, 흥부가'", "'남원의 문화유산' 책이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "student", move: "look", talk: "판소리 다섯 바탕 가운데\n춘향가랑 흥부가가 남원 이야기래.\f숙제하다가 처음 알았어!" },
  ]);
  // 소색마을
  house("house_ss1", "home_s", "주택", "town", exitTo("house_ss1"), CK.home_s("TV에서 만화 '남켓몬 탐험대'를 하고 있다.", "그림책이 키 순서대로 꽂혀 있다."), [
    { x: 2, y: 4, spr: "woman", move: "look", talk: "소색은 물들이기 전\n흰 천의 빛깔이래." },
    { x: 7, y: 5, spr: "kid_f", move: "wander", r: 1, talk: "버스 정류장에서 버스를 타면\n다홍시티까지 금방이야!\f……남켓몬이랑 걸어가는 것도\n재밌겠다." },
  ]);

  // ---------------- 쪽빛마을 ----------------
  house("house_jj2", "home_t", "주택", "jjok", exitJ("house_jj2"), CK.home_t("그림일기: '쪽물 들이기 체험 — 손톱까지 파래졌다!'", "기차 사진책이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "kid_f", move: "look", talk: "할아버지 어릴 적엔 서도역에\n기차가 칙칙폭폭 섰대.\f지금은 기차가 안 서도\n역은 그대로 남아 있어." },
  ]);
  house("house_jj3", "house_a", "한옥", "jjok", exitJ("house_jj3"), CK.house_a("병풍에 푸른 불빛 하나가 그려져 있다."), [
    { x: 7, y: 4, spr: "oldman", move: "look", talk: "『혼불』은 이 고장 사람들 이야기를\n아주 길게 쓴 소설이란다.\f혼불은 사람 몸에서 빠져나간다는\n푸른 불빛이지." },
  ]);

  // ---------------- 갈매마을(덕과) ----------------
  house("house_ga2", "home_s", "주택", "galmae", exitG("house_ga2"), CK.home_s("TV에서 '우리 고장 3·1 운동' 다큐멘터리를 하고 있다.", "'덕과면 이야기' 책이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "man", move: "look", talk: "1919년 봄, 덕과 사람들은\n나무 심는 날 함께 모여\f'대한 독립 만세!'를 외쳤단다.\f다음 날엔 남원 장터에서도\n만세 소리가 울렸지." },
  ]);
  house("house_ga3", "home_t", "주택", "galmae", exitG("house_ga3"), CK.home_t("받아쓰기 공책에 동그라미가 가득하다.", "곤충 도감이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "kid_m", move: "look", talk: "아카데미 운동장에서 하는\n남켓몬 수업이 제일 재밌어!" },
  ]);

  // ---------------- 비색마을 ----------------
  house("house_bs2", "home_s", "주택", "bisaek", exitB("house_bs2"), CK.home_s("TV에서 '강물 지킴이' 뉴스를 하고 있다.", "'섬진강 물고기 도감'이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "oldman", move: "look", talk: "요천이랑 섬진강이\n이 마을 앞에서 만난단다.\f맑은 물이 모이니\n물고기도 새도 많지." },
    { x: 7, y: 5, spr: "kid_f", move: "wander", r: 1, talk: () => say(G.flag("jjy_quiz") ? "기념관 엽서 받았어?\n나도 받아서 책상에 붙여 놨어!" : "기념관에 가 봤어?\f방명록에 한 줄 남기면\n마음이 따뜻해져.") },
  ]);

  // ---------------- 송화마을 ----------------
  house("house_sh2", "hanok2", "한옥", "songhwa", exitS("house_sh2"), CK.hanok2("병풍에 소나무와 학이 그려져 있다."), [
    { x: 2, y: 4, spr: "oldwoman", move: "look", talk: "봄이면 소나무에서 노란 송홧가루가\n바람에 날린단다.\f옛날엔 그 가루를 꿀에 개어\n송화다식을 만들어 먹었지." },
  ]);

  // ---------------- 주홍마을(주천) ----------------
  house("house_jh2", "home_s", "주택", "juhong", exitJH("house_jh2"), CK.home_s("TV에서 '지리산 둘레길' 여행 방송을 하고 있다.", "등산 지도가 잔뜩 꽂혀 있다."), [
    { x: 2, y: 4, spr: "hiker", move: "look", talk: "구룡계곡에는 아홉 마리 용이\n살았다는 이야기가 있어.\f들머리 육모정에서 쉬었다 가면\n딱 좋지." },
  ]);

  // ---------------- 감청마을(교룡산 아래) ----------------
  house("house_gc2", "home_s", "주택", "gamcheong", exitGC("house_gc2"), CK.home_s("TV에서 산성 쌓기 다큐멘터리를 하고 있다.", "'교룡산성 둘레길' 안내서가 꽂혀 있다."), [
    { x: 2, y: 4, spr: "man", move: "look", talk: "교룡산성은 산을 빙 둘러\n돌로 쌓은 성이란다.\f성 안에는 오래된 절,\n선국사도 있지." },
    { x: 7, y: 4, spr: "kid_m", move: "wander", r: 1, talk: "산성 돌담 사이로 남켓몬이\n쏙 숨는 걸 봤어!" },
  ]);

  // ---------------- 쑥빛시티(운봉) ----------------
  house("house_sb2", "home_s", "주택", "ssukbit", exitSB("house_sb2"), CK.home_s("TV에서 '고랭지 배추 수확' 방송을 하고 있다.", "요리책이 꽂혀 있다. '배추 요리 100가지'"), [
    { x: 2, y: 4, spr: "woman", move: "look", talk: "운봉은 높은 고원이라\n한여름에도 선선해.\f그래서 배추가 아삭아삭\n달게 자란단다." },
  ]);
  house("house_sb3", "hanok2", "한옥", "ssukbit", exitSB("house_sb3"), CK.hanok2("병풍에 북 치는 고수가 그려져 있다."), [
    { x: 2, y: 4, spr: "oldman", move: "look", talk: "동편제는 소리를 꾸밈없이\n힘차게 내지르는 게 멋이란다.\f운봉은 그 동편제 명창들이\n나고 자란 고장이지." },
    { x: 5, y: 5, spr: "kid_f", move: "look", talk: "할아버지한테 '얼씨구!' 추임새\n배우는 중이야." },
  ]);

  // ---------------- 인월장터 ----------------
  house("house_iw2", "home_s", "주택", "inwol", exitIW("house_iw2"), CK.home_s("TV에서 '장터 맛집' 방송을 하고 있다.", "장부가 빼곡히 꽂혀 있다."), [
    { x: 2, y: 4, spr: "woman", move: "look", talk: "인월장은 닷새마다 서는\n오일장이란다.\f장날이면 산골 마을 사람들이\n다 모여서 북적북적하지." },
  ]);
  house("house_iw3", "house_a", "초가", "inwol", exitIW("house_iw3"), CK.house_a("병풍에 둥근 달과 말 탄 장수가 그려져 있다."), [
    { x: 7, y: 4, spr: "oldman", move: "look", talk: "옛날 이성계 장군이 이 근처\n황산에서 큰 싸움을 했단다.\f캄캄한 밤에 달을 끌어당겨\n싸웠다는 이야기가 있어서\f달을 끌어당긴 곳이라고\n인월이라고 부르지." },
  ]);

  // ---------------- 미색마을(흥부마을) ----------------
  house("house_ms2", "hanok2", "초가", "misaek", exitMS("house_ms2"), CK.hanok2("병풍에 둥근 무덤 언덕들이 그려져 있다."), [
    { x: 2, y: 4, spr: "oldwoman", move: "look", talk: "마을 뒤 둥근 언덕들은\n아주 옛날 가야 사람들 무덤이란다.\f그 안에서 쇠로 만든 갑옷이랑\n그릇이 나왔대." },
  ]);

  // ---------------- 월백마을(산내) ----------------
  house("house_wb2", "home_s", "주택", "wolbaek", exitWB("house_wb2"), CK.home_s("TV에서 '지리산 반달가슴곰' 방송을 하고 있다.", "'실상사 이야기' 책이 꽂혀 있다."), [
    { x: 2, y: 4, spr: "man", move: "look", talk: "실상사는 지리산 아래\n들판 한가운데 있는 절이야.\f산속이 아니라 평지에 있어서\n더 특별하지." },
    { x: 7, y: 5, spr: "kid_m", move: "wander", r: 1, talk: "목기 공방 아저씨가\n나무 숟가락 깎는 걸 보여 줬어!" },
  ]);
  house("house_wb3", "hanok2", "한옥", "wolbaek", exitWB("house_wb3"), CK.hanok2("병풍에 가슴에 흰 반달이 있는 곰이 그려져 있다."), [
    { x: 2, y: 4, spr: "oldman", move: "look", talk: "지리산엔 반달가슴곰이 산단다.\f가슴에 하얀 반달 무늬가 있지.\n만나면 조용히 뒤로 물러나야 해." },
  ]);

  // ---------------- 마을 바깥 이웃(집 앞을 오가는 사람) ----------------
  const add = (map, list) => { if (MAPS[map]) MAPS[map].npcs = (MAPS[map].npcs || []).concat(list); };
  add("world", [
    { x: 43, y: 16, spr: "kid_f", move: "look", talk: "이 길에 새 이웃이\n세 집이나 생겼어!" },
    { x: 55, y: 15, spr: "man", move: "look", dir: "left", talk: "이 길 끝 나무숲 너머는\n요천 둑길까지 이어져 있어." },
    { x: 16, y: 88, spr: "oldman", move: "look", dir: "left", talk: "소색마을은 작아도\n아침마다 새소리가 제일 먼저 들려." },
  ]);
  add("jjok", [{ x: 14, y: 8, spr: "woman", move: "look", dir: "left", talk: "쪽물은 담글수록 짙어진대.\f우리 마을 이름도\n그래서 쪽빛이래." }]);
  add("galmae", [{ x: 8, y: 7, spr: "kid_f", move: "wander", r: 1, talk: "덕과 아카데미 종이 울리면\n다들 운동장으로 뛰어나가!" }]);
  add("bisaek", [{ x: 5, y: 20, spr: "man", move: "look", dir: "left", talk: "두 강물이 만나는 곳이라\n아침 안개가 자주 껴." }]);
  add("songhwa", [{ x: 9, y: 19, spr: "kid_m", move: "wander", r: 1, talk: "정자 그늘에서 낮잠 자면\n솔바람이 솔솔 불어!" }]);
  add("juhong", [{ x: 9, y: 28, spr: "oldwoman", move: "look", dir: "down", talk: "지리산 물은 차고 맑아서\n여름에도 발이 시리단다." }]);
  add("gamcheong", [{ x: 11, y: 9, spr: "student", move: "wander", r: 1, talk: "교룡산은 용이 사는 산이라는\n뜻이래. 멋있지?" }]);
  add("ssukbit", [{ x: 41, y: 19, spr: "man", move: "look", dir: "down", talk: "비각은 훌륭한 사람의 뜻을\n새긴 비석을 지키는 집이란다." }]);
  add("inwol", [{ x: 24, y: 7, spr: "kid_m", move: "wander", r: 1, talk: "장날엔 뻥튀기 아저씨가 와!\f뻥! 하는 소리에\n남켓몬들도 깜짝 놀라." }]);
  add("misaek", [{ x: 34, y: 23, spr: "kid_f", move: "wander", r: 1, talk: "흥부는 제비 다리를\n고쳐 줬대.\f나도 다친 남켓몬을 보면\n꼭 센터에 데려갈 거야." }]);
  add("wolbaek", [{ x: 38, y: 26, spr: "oldwoman", move: "look", dir: "left", talk: "산내 목기는 나무결이 살아 있어서\n오래 쓸수록 윤이 난단다." }]);
})();
