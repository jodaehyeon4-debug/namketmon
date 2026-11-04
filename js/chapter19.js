// ===== v2.15 도시 다듬기: 다홍시티·소색마을 새 건물 실내 + 사람 =====
//   사용자: "마을의 생김새·짜임새 · 도로 · 집 내부와 집 수를 훨씬 늘리자. 아파트도, 롯데마트 같은 건물도"
//   다홍시티: 춘향마트(대형마트 1~3층, 승강기·계단) · 상가(빵집·꽃집·편의점·분식) · 아파트 201·202동 · 주택 둘
//   소색마을(도통동): 아파트 103·104·105동 · 편의점 · 주택 하나
"use strict";
(() => {
  const D = MAPDATA;
  const MODERN = { floor: "floor_lino", wall: "wall_home", win: "win_home" }, HANOK = { floor: "floor_wood", wall: "wall_hanok", win: "win_home" };
  const MART = { floor: "floor_mart", floor2: "floor_mart2", wall: "wall_mart", win: "win_mart" };
  const SHOPL = { floor: "floor_tile", wall: "wall_home", win: "win_home" };
  const room = (id, tmpl, name, bgm, look, exit, checks, npcs, extra) => {
    MAPS[id] = { rows: D[tmpl].rows, stamps: D[tmpl].stamps, indoor: true, name, ...look, bgm, noPopup: true, exit, checks: checks || [], npcs: npcs || [], ...(extra || {}) };
  };
  const once = (flag, before, item, n, after) => async () => {
    if (!G.flag(flag)) { await say(before); await getItem(item, n || 1); G.flag(flag, true); }
    else await say(after);
  };
  const two = (x, y, t) => [[x, y, t], [x + 1, y, t]];

  // ---------------- 자판기 (실제 게임처럼 가끔 하나 더) ----------------
  const DRINKS = [["freshwater", 200], ["sodapop", 300], ["lemonade", 350]];
  async function vending() {
    await say("자판기다!\n시원한 음료가 줄지어 있다.");
    while (true) {
      const v = await ask("무엇을 살까?", DRINKS.map(([id, p]) => `${ITEMS[id].n} ${p}원`).concat(["그만두다"]));
      if (v >= DRINKS.length) return;
      const [id, p] = DRINKS[v];
      if (G.money < p) { await say("돈이 모자란다."); return; }
      G.money -= p; sfx("select");
      await say(`덜컹!\n${J(ITEMS[id].n, "이")} 나왔다!`);
      await getItem(id, 1, true);
      if (rnd(16) === 0) { await say("어라? 덜컹!\n하나 더 나왔다!"); await getItem(id, 1, true); }
    }
  }

  // ---------------- 춘향마트 ----------------
  const FLOORS = [["bigmart_1f", "1층 식품·생활"], ["bigmart_2f", "2층 부적·몸보신"], ["bigmart_3f", "3층 쉼터"]];
  const elevator = (cur) => async () => {
    const v = await ask("승강기다.\n몇 층으로 갈까?", FLOORS.map(f => f[1]).concat(["그만두다"]));
    if (v >= FLOORS.length) return;
    if (FLOORS[v][0] === cur) { await say("지금 있는 층이다."); return; }
    await say("띵동!\n문이 스르르 닫힌다……");
    await World.warp([FLOORS[v][0], 7, 2, "down"], "door");
  };
  function ballStock() {
    const b = (G.badges || []).length, L = ["namket", "heal"];
    if (b >= 1) L.push("silk", "net", "nest");
    if (b >= 3) L.push("dusk", "quick", "timer", "repeat");
    if (b >= 5) L.push("ok");
    return L.filter(id => ITEMS[id]);
  }
  const GUIDE = "춘향마트 층 안내\f1층 식품·생활용품 · 볼 코너\n2층 부적·몸보신 코너\f3층 쉼터·자판기\n(승강기·계단 이용)";
  room("bigmart_1f", "bigmart_1f", "춘향마트 1층", "center", MART, exitTo("bigmart"),
    [...two(7, 1, elevator("bigmart_1f")), [5, 1, GUIDE], [5, 2, GUIDE],
      ...two(5, 4, "지리산 자락에서 자란\n사과와 배가 수북하다."), ...two(10, 4, "빨간 고추, 노란 참외,\n푸른 오이가 가득하다."),
      ...two(12, 5, "남원 목기로 만든 그릇이\n가지런히 놓여 있다.\f나무를 깎고 옻칠을 해서\n오래 쓸수록 윤이 난대."),
      [0, 6, "오늘의 전단지다.\n'춘향제 맞이 큰 잔치 할인!'"]],
    [{ id: "bm_clerk1", x: 1, y: 2, spr: "clerk", dir: "down", move: "fixed", talk: () => shop(martStock()) },
      { id: "bm_clerk2", x: 3, y: 2, spr: "clerk", dir: "down", move: "fixed", talk: async () => { await say("볼 코너예요!\n여러 가지 볼을 모아 놨어요."); await shop(ballStock()); } },
      { x: 14, y: 3, spr: "woman", dir: "down", move: "look", talk: "춘향마트에 어서 오세요!\f1층은 식품과 생활용품,\n2층은 부적과 몸보신 코너,\f3층은 쉼터예요.\n승강기나 계단을 이용하세요!" },
      { x: 9, y: 6, spr: "oldwoman", dir: "up", move: "look", talk: "추어탕 거리에서 먹던 맛을\n집에서도 내 보려고 왔지.\f미꾸라지랑 시래기를\n듬뿍 사 가야겠다." },
      { x: 4, y: 5, spr: "kid_m", move: "wander", r: 1, talk: "엄마! 남켓볼 모양 과자\n사 줘, 응?" }],
    { warps: [[14, 1, ["bigmart_2f", 14, 3, "down"]]] });
  room("bigmart_2f", "bigmart_2f", "춘향마트 2층", "center", MART, null,
    [...two(7, 1, elevator("bigmart_2f")), ...two(3, 4, "부적이 색깔별로\n가지런히 걸려 있다."), ...two(5, 4, "약수병과 차 꾸러미가\n층층이 쌓여 있다."),
      [9, 1, "'배틀 전에 부적 한 장!'\n포스터가 붙어 있다."], [10, 1, "'지리산 산양유로 기운 펄펄!'\n포스터가 붙어 있다."], [15, 6, "쑥향 견본이 놓여 있다.\n향긋한 쑥 냄새가 난다."]],
    [{ id: "bm_clerk3", x: 10, y: 3, spr: "clerk", dir: "down", move: "fixed", talk: async () => { await say("부적 코너예요!\n배틀에서 힘이 되어 줄 거예요."); await shop(["xattack", "xdefend", "xspatk", "xspdef", "xspeed", "xaccuracy", "direhit", "guardspec"]); } },
      { id: "bm_clerk4", x: 12, y: 3, spr: "clerk", dir: "down", move: "fixed", talk: async () => { await say("몸보신 코너예요!\n지친 남켓몬에게 딱이죠."); await shop(["freshwater", "sodapop", "lemonade", "moomoomilk", "ssukhyang", "superrepel", "escaperope"]); } },
      { x: 4, y: 6, spr: "man", dir: "up", move: "look", talk: "공격부적을 쓰면 그 배틀 동안\n공격이 한 단계 오른대.\f남켓몬을 바꾸면 효과가\n사라지니까 조심해!" },
      { x: 13, y: 6, spr: "student", move: "wander", r: 1, talk: "산양유는 지리산 산양 젖이래.\n남켓몬 체력이 쑥 차오른대!" }],
    { warps: [[14, 2, ["bigmart_1f", 14, 2, "down"]], [1, 1, ["bigmart_3f", 1, 3, "down"]]] });
  room("bigmart_3f", "bigmart_3f", "춘향마트 3층 쉼터", "center", MART, null,
    [...two(7, 1, elevator("bigmart_3f")), [12, 2, vending], [13, 2, vending], [14, 2, vending],
      [3, 1, "창밖으로 다홍시티가\n한눈에 내려다보인다."], [4, 1, "창밖으로 다홍시티가\n한눈에 내려다보인다."], [5, 1, "멀리 지리산 능선이\n푸르게 이어져 있다."], [10, 1, "주차장에 차들이\n빼곡하게 서 있다."]],
    [{ id: "bm_gift", x: 9, y: 3, spr: "clerk", dir: "down", move: "look", talk: once("bm_gift", "춘향마트 쉼터에 오신 걸\n환영해요!\f문 연 기념 선물이에요.\n받아 주세요!", "silkscarf", 1,
        "비단띠는 노말 타입 기술을\n조금 세게 해 줘요.\f남켓몬에게 지니게 해 보세요!") },
      { x: 5, y: 5, spr: "oldman", dir: "left", move: "look", talk: "여기 앉아 쉬다 보면\n지리산 능선이 멀리 보인단다.\f구름이 걸린 날엔\n산이 더 높아 보이지." },
      { x: 4, y: 2, spr: "woman", dir: "up", move: "look", talk: "창밖으로 광한루원이 보여.\n연못이 반짝반짝해!" },
      { x: 10, y: 6, spr: "kid_f", move: "wander", r: 1, talk: "자판기에서 오미자차 뽑았어!\n새콤달콤해!\f가끔 하나 더 나온대!" }],
    { warps: [[1, 2, ["bigmart_2f", 1, 2, "down"]]] });

  // ---------------- 상가 거리 ----------------
  room("shop_bread", "shop_bread", "빵집", "city", SHOPL, exitTo("shop_bread"),
    [...two(3, 2, "갓 구운 빵이\n먹음직스럽게 놓여 있다."), ...two(5, 2, "단팥빵, 소보로빵, 크림빵……\n고소한 냄새가 난다."), ...two(7, 2, "오븐에서 빵이 노릇노릇\n익어 가고 있다.")],
    [{ x: 1, y: 2, spr: "clerk", dir: "down", move: "fixed", talk: once("bread_gift", "어서 오세요!\f어머, 남켓몬 트레이너구나.\n빵 대신 이거 줄게요.\f남켓몬 간식으로 딱이에요!", "jujube", 3,
        "빵 냄새를 맡고 남켓몬들이\n가게 앞을 기웃거려요.") },
      { x: 9, y: 4, spr: "woman", dir: "left", move: "look", talk: "아침마다 빵 사러 오면\n줄이 길어.\f그래도 갓 구운 빵 맛은\n못 참지!" },
      { x: 5, y: 5, spr: "kid_f", dir: "up", move: "look", talk: "소보로빵 위에 부스러기가\n남켓몬 털 같아!" }]);
  room("shop_flower", "shop_flower", "꽃집", "city", SHOPL, exitTo("shop_flower"),
    [...two(3, 2, "알록달록한 꽃이\n물통마다 꽂혀 있다."), ...two(5, 2, "꽃다발 견본이 걸려 있다.\n'춘향제 축하 꽃다발'")],
    [{ x: 1, y: 2, spr: "woman", dir: "down", move: "fixed", talk: once("flower_gift", "봄이면 운봉 바래봉에\n철쭉이 온 산을 붉게 물들여.\f꽃을 좋아하는 남켓몬에게\n이걸 지니게 해 봐!", "fairyfeather", 1,
        "꽃가루주머니는 페어리 타입\n기술을 세게 해 준단다.\f철쭉 필 무렵 바래봉에\n꼭 가 보렴!") },
      { x: 8, y: 6, spr: "man", dir: "up", move: "look", talk: "결혼기념일이라서\n장미꽃을 사러 왔어.\f……남켓몬한테는 비밀이야." }]);
  const CONV_DH = ["potion", "superpotion", "antidote", "parlyzheal", "awakening", "burnheal", "freshwater", "sodapop", "lemonade", "ssukhyang", "escaperope"];
  room("shop_conv", "shop_conv", "편의점", "city", SHOPL, exitTo("shop_conv"),
    [...two(3, 2, "과자랑 라면이\n빼곡하게 놓여 있다."), ...two(5, 2, "칫솔, 비누, 우산……\n없는 게 없다."), [7, 2, "냉장고에 우유와 음료가\n시원하게 들어 있다."], [8, 2, "냉장고에 우유와 음료가\n시원하게 들어 있다."], [9, 2, vending],
      ...two(6, 4, "삼각김밥이 줄지어 있다.\n'참치마요' '불고기'……")],
    [{ x: 1, y: 2, spr: "clerk", dir: "down", move: "fixed", talk: () => shop(CONV_DH.filter(id => id !== "superpotion" || (G.badges || []).length >= 1)) },
      { x: 8, y: 5, spr: "student", dir: "left", move: "look", talk: "삼각김밥 사러 왔다가\n상처약을 샀어……\f남켓몬 트레이너는\n늘 상처약이 먼저야!" }]);
  room("shop_snack", "shop_snack", "분식집", "city", SHOPL, exitTo("shop_snack"),
    [...two(0, 3, "떡볶이가 보글보글 끓고\n어묵 국물 냄새가 난다."), [4, 1, "차림표: 떡볶이 · 순대 ·\n튀김 · 어묵 · 김밥"], [5, 1, "'방학 맞이 떡볶이 한 접시\n더 드려요!'"]],
    [{ x: 2, y: 2, spr: "woman", dir: "down", move: "fixed", talk: async () => { await say("어서 와!\n떡볶이 한 접시 줄까?\f……아, 남켓몬 트레이너구나.\n그럼 마실 거라도!"); await shop(["freshwater", "sodapop", "lemonade"]); } },
      { x: 8, y: 4, spr: "kid_m", dir: "left", move: "look", talk: "떡볶이는 국물까지\n싹싹 먹어야 제맛이지!" },
      { x: 4, y: 5, spr: "student", dir: "right", move: "look", talk: "아카데미 끝나면 여기 들러서\n튀김 하나씩 먹어.\f남켓몬 이야기하면서 먹으면\n더 맛있어!" }]);

  // ---------------- 아파트 · 새 주택 ----------------
  const CK_A = (tv, book) => [[0, 2, "냉장고에 반찬통이 가득하다."], [1, 2, "개수대가 반짝반짝 닦여 있다."], [2, 2, "개수대가 반짝반짝 닦여 있다."], [3, 2, "세탁기가 윙윙 돌아간다."],
    [8, 2, tv], [9, 2, tv], [11, 2, book], [12, 2, book], [10, 1, "시계가 똑딱똑딱 간다."]];
  const CK_B = (desk, ward) => [[0, 3, "이불이 반듯하게 개어져 있다."], [2, 3, "분홍 이불 위에 인형이 놓여 있다."], [4, 2, desk], [5, 2, desk], [7, 2, ward], [8, 2, ward],
    [11, 2, "피아노 위에 악보가 펼쳐져 있다."], [12, 2, "피아노 위에 악보가 펼쳐져 있다."], [6, 1, "벽에 남켓몬 포스터가 붙어 있다."]];
  room("apt_201", "apt_a", "201동", "city", MODERN, exitTo("apt_201"), CK_A("TV에서 '남원 시티 투어'를 하고 있다.", "'남원 땅이름 이야기' 책이 꽂혀 있다."), [
    { x: 5, y: 3, spr: "man", dir: "down", move: "look", talk: "201동 꼭대기 층에서는\n광한루원 기와지붕이 보여.\f춘향제 날엔 불꽃놀이도\n여기서 다 보인다니까!" },
    { x: 11, y: 5, spr: "kid_f", move: "wander", r: 1, talk: "아빠랑 춘향마트 갔다 왔어!\n승강기 타는 게 제일 재밌어!" }]);
  room("apt_202", "apt_b", "202동", "city", MODERN, exitTo("apt_202"), CK_B("방학 숙제: '우리 고장 남원 지도 그리기'", "옷장 안에 춘향제 한복이 걸려 있다."), [
    { x: 5, y: 4, spr: "oldwoman", dir: "down", move: "look", talk: "방학이라 손주들이\n할미 집에 놀러 왔단다.\f남원 목기에 밥을 담아 주니\n얼마나 잘 먹는지." },
    { x: 10, y: 5, spr: "kid_m", move: "wander", r: 1, talk: "피아노로 '학교 종'\n칠 수 있어! 들어 볼래?" }]);
  room("house_dh4", "apt_a", "주택", "city", MODERN, exitTo("house_dh4"), CK_A("TV에서 '요천의 새' 다큐멘터리를 하고 있다.", "'생태 관찰 일기' 공책이 꽂혀 있다."), [
    { x: 5, y: 3, spr: "woman", dir: "down", move: "look", talk: "옆집 생태연구소는\n밤늦게까지 불이 켜져 있어.\f윤슬 박사님은 언제\n주무시는지 몰라." },
    { x: 10, y: 6, spr: "kid_m", move: "wander", r: 1, talk: "연구소 창문으로\n남켓몬 사진을 봤어!" }]);
  // 소색마을
  room("apt_103", "apt_a", "103동", "town", MODERN, exitTo("apt_103"), CK_A("TV에서 '덕과 아카데미 소식'을 하고 있다.", "요리책이 꽂혀 있다. '추어탕 끓이는 법'"), [
    { x: 5, y: 3, spr: "woman", dir: "down", move: "look", talk: "새로 지은 동이라\n승강기가 아주 빨라.\f우리 남켓몬은 승강기만 타면\n신이 나서 빙글빙글 돌아." },
    { x: 11, y: 5, spr: "student", move: "wander", r: 1, talk: "덕과 아카데미 통학버스는\n저 앞 정류장에서 타!" }]);
  room("apt_104", "apt_b", "104동", "town", MODERN, exitTo("apt_104"), CK_B("그림일기: '요천에서 왜가리를 봤다!'", "옷장에 운동복이 걸려 있다."), [
    { x: 5, y: 4, spr: "man", dir: "down", move: "look", talk: "도통동은 남원에서\n아파트가 제일 많은 동네야.\f그래도 조금만 걸으면\n요천 둑길이라 좋지." },
    { x: 10, y: 5, spr: "kid_f", move: "wander", r: 1, talk: "우리 집 창문으로\n요천이 반짝반짝 보여!" }]);
  room("apt_105", "apt_a", "105동", "town", MODERN, exitTo("apt_105"), CK_A("TV에서 '지리산 날씨'를 하고 있다.", "'남원의 판소리' 책이 꽂혀 있다."), [
    { x: 5, y: 3, spr: "oldman", dir: "down", move: "look", talk: "요천 둑길을 따라 걸으면\n광한루원까지 금방이지.\f아침마다 남켓몬이랑\n같이 걷는단다." },
    { x: 10, y: 6, spr: "kid_m", move: "wander", r: 1, talk: "놀이터 미끄럼틀은\n엎드려 타면 안 돼!" }]);
  room("house_ss2", "home_t", "주택", "town", MODERN, exitTo("house_ss2"),
    [[0, 3, "이불이 반듯하게 개어져 있다."], [4, 2, "숙제 공책: '버스 정류장 시간표 조사'"], [5, 2, "숙제 공책: '버스 정류장 시간표 조사'"], [6, 2, "컴퓨터 화면에 남켓몬 도감이 열려 있다."],
      [8, 2, "버스 사진책이 꽂혀 있다."], [9, 2, "버스 사진책이 꽂혀 있다."], [10, 2, "옷장 안에 아카데미 체육복이 걸려 있다."], [11, 2, "옷장 안에 아카데미 체육복이 걸려 있다."]], [
    { x: 2, y: 4, spr: "kid_m", dir: "down", move: "look", talk: "정류장에 서 있으면\n다홍시티 가는 버스가 와.\f나는 버스 번호를\n다 외웠어!" }]);
  room("conv_ss", "shop_conv", "편의점", "town", SHOPL, exitTo("conv_ss"),
    [...two(3, 2, "과자랑 라면이\n빼곡하게 놓여 있다."), ...two(5, 2, "칫솔, 비누, 우산……\n없는 게 없다."), [7, 2, "냉장고에 우유와 음료가\n시원하게 들어 있다."], [8, 2, "냉장고에 우유와 음료가\n시원하게 들어 있다."], [9, 2, vending],
      ...two(6, 4, "삼각김밥이 줄지어 있다.")],
    [{ x: 1, y: 2, spr: "clerk", dir: "down", move: "fixed", talk: async () => {
        if (!G.flag("dex")) { await say("어서 오세요!\f남켓볼은 다홍시티 만물상이나\n춘향마트에서 팔아요.\f여기는 상처약이랑\n마실 것만 있어요!"); }
        await shop(["potion", "antidote", "parlyzheal", "awakening", "freshwater", "sodapop"]); } },
      { x: 8, y: 5, spr: "woman", dir: "left", move: "look", talk: "소색마을에도 편의점이 생겨서\n얼마나 편한지 몰라." }]);

  // ---------------- 바깥: 춘향마트 두 번째 문 · 안내판 · 거리 사람 ----------------
  const W = MAPS.world;
  W.warps = (W.warps || []).concat([[MAPDATA.world.doors.bigmart[0] + 1, MAPDATA.world.doors.bigmart[1], ["bigmart_1f", 8, 7, "up"]]]);   // v2.24 춘향마트 두 칸 문(오른쪽 칸)
  W.signs.push([57, 5, "춘향마트 주차장\n'천천히! 아이들이 다녀요'"]);
  W.npcs.push(
    { x: 52, y: 9, spr: "man", dir: "down", move: "look", talk: "주말이면 춘향마트 주차장이\n꽉 찬단다.\f남켓몬이랑 걸어오는 게\n제일 빠르지!" },
    { x: 46, y: 26, spr: "woman", move: "wander", r: 1, talk: "상가 거리에 빵집이 생겨서\n아침마다 줄이 길어." },
    { x: 44, y: 34, spr: "kid_f", move: "wander", r: 1, talk: "201동 언니랑\n놀이터에서 놀기로 했어!" },
    { x: 49, y: 90, spr: "woman", dir: "down", move: "look", talk: "103동, 104동이 새로 생겨서\n이웃이 많이 늘었어." },
    { x: 55, y: 96, spr: "kid_m", move: "wander", r: 1, talk: "미끄럼틀 타고\n쭈욱~ 내려가면 신나!" },
  );
  window.CITY_V215 = true;
})();
