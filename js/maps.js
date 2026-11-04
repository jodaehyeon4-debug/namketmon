// ===== 지도 정의(글자판은 mapdata.js) + 사람·표지판·이야기 =====
"use strict";
const STARTERS = ["mongjjuk", "bulsap", "kkokkuri"];
const RIVAL_OF = { mongjjuk: "bulsap", bulsap: "kkokkuri", kkokkuri: "mongjjuk" };
const D = MAPDATA;
const LOCKS = {
  gym: async () => { await say("배움터 문이 굳게 잠겨 있다.\f'춘향제 준비로 지킴이 찬향 선생님은\n잠시 자리를 비웁니다.'"); },
  house2: "문이 잠겨 있다. 아무도 없는 것 같다.",
  house2_galmae: "문이 잠겨 있다.\f'들판에 일하러 나갑니다.\n점심때 돌아와요.'",
  house2_bisaek: "문이 잠겨 있다.\f'섬진강 둑에 산책 갑니다.'\n쪽지가 붙어 있다.",
  house2_songhwa: "문이 잠겨 있다.\f창문 너머로 솔잎 차 향이\n솔솔 새어 나온다.",
  house2_juhong: "문이 잠겨 있다.\f'구룡계곡 청소하러 갑니다.'\n쪽지가 붙어 있다.",
};
function fixStamps(st) { return st.map(s => { if (s[3] && s[3].locked && typeof s[3].locked === "string") { const o = { ...s[3], locked: LOCKS[s[3].locked] }; return [s[0], s[1], s[2], o]; } return s; }); }
const W0 = D.world.doors;
const exitTo = (k) => ["world", W0[k][0], W0[k][1], "down"];
const ball = (k) => (x, y) => { const bi = JSN.balls.keys.indexOf("namket"); sprite(IMG.balls, 0, bi * 16, 16, 16, x, y - 3); };

const MAPS = {
  world: {
    rows: D.world.rows, stamps: fixStamps(D.world.stamps), name: "용성지방",
    zones: [["광한루원", 2, 2, 16, 16], ["다홍시티", 0, 0, 59, 35], ["요천 둔치", 46, 38, 57, 77], ["1번도로", 0, 36, 59, 79], ["소색마을", 0, 80, 59, 105]],
    zinfo: {
      "다홍시티": { bgm: "city", bg: "city" }, "광한루원": { bgm: "ojakgyo", enc: "광한루원", rate: 0.13, bg: "grass" },
      "1번도로": { bgm: "route", enc: "1번도로", rate: 0.12, bg: "grass" }, "요천 둔치": { bgm: "route", bg: "grass" }, "소색마을": { bgm: "town", bg: "grass" },
    },
    signs: [
      [17, 11, "다홍시티\n춘향의 다홍치마처럼 붉게 물든 시티"], [30, 10, "다홍시티 남켓몬 배움터\n지킴이 찬향 · 노말 타입의 기본기!"],
      [10, 20, "광한루원 생태연구소\n소장 윤슬"], [17, 35, "↓ 1번도로 · 소색마을"], [17, 77, "1번도로\n→ 요천 둑길을 따라 다홍시티\f↓ 소색마을"],
      [46, 47, "요천 둔치\n물가에서는 발밑을 조심하세요!"], [17, 83, "소색마을\n물들지 않은 하루가 시작되는 곳"],
    ],
    checks: [[15, 97, "덕과 아카데미 통학버스 정류장\n'평일 오후 3시 30분 출발'"], [15, 96, "덕과 아카데미 통학버스 정류장\n'평일 오후 3시 30분 출발'"],
      [8, 28, "분수에서 시원한 물줄기가 솟아오른다."], [9, 28, "분수에서 시원한 물줄기가 솟아오른다."], [10, 28, "분수에서 시원한 물줄기가 솟아오른다."],
      [16, 80, "장승이 마을 어귀를 지키고 있다.\n'천하대장군'"], [23, 80, "장승이 마을 어귀를 지키고 있다.\n'지하여장군'"]],
    triggers: [18, 19, 20, 21].map(x => ({ x, y: 82, cond: () => !G.flag("slept"), run: async () => {
      await say("엄마가 기다리고 계실 거야.\n먼저 집에 들어가자!"); await walk(World.player, "down"); } })),
    npcs: [
      // 다홍시티
      { id: "guard1", x: 19, y: 2, spr: "man", dir: "down", show: () => !hasBadge(1), talk: () => say(!G.flag("festival_done")
          ? "미안! 지금은 춘향제 일로\n북쪽 길을 막아 두었어.\f춘향제는 광한루원 동문 건너편\n마당에서 열린단다!"
          : "2번도로는 풀숲이 깊어서\n어사패를 받은 트레이너만\f지나가게 하고 있어.\f찬향 선생님의 배움터에서\n어사패를 받아 오렴!") },
      { id: "guard2", x: 20, y: 2, spr: "woman", dir: "down", show: () => !hasBadge(1), talk: () => say(!G.flag("festival_done")
          ? "춘향제가 열리면 광한루원 앞이\n사람들로 꽉 찬단다!"
          : "배움터는 큰길 동쪽,\n빨간 대문 집이야!") },
      { x: 13, y: 9, spr: "oldman", dir: "left", move: "look", talk: "칠월 칠석이면 까치와 까마귀가\n하늘에 다리를 놓았다지.\f견우와 직녀가 그 다리를 건너\n한 해에 한 번 만났단다.\f이 오작교가 바로 그 다리를\n본떠 만든 것이야." },
      { x: 5, y: 9, spr: "woman", dir: "up", move: "look", talk: "저 광한루에서 춘향이와 몽룡이가\n처음 만났대. 멋지지 않니?" },
      { x: 21, y: 22, spr: "student", move: "wander", r: 2, talk: "빨간 지붕 건물이 남켓몬센터야.\f남켓몬이 지치면 거기서\n공짜로 회복시켜 준다고!" },
      { x: 34, y: 19, spr: "man", move: "look", talk: "만물상에서 남켓볼을 10개 사면\n기념볼을 하나 덤으로 준다더라!" },
      { x: 27, y: 31, spr: "kid_m", move: "wander", r: 1, talk: () => say(hasBadge(1) ? "우와, 오작교 어사패다!\n나도 언젠가 받고 싶어!"
          : G.flag("festival_done") ? "찬향 선생님 배움터에 가 봤어?\n안이 놀이터 같대!"
          : G.flag("dex") ? "춘향제가 시작됐어!\f광한루원 동문 건너편 마당에서\n그네뛰기를 한대!"
          : "찬향 선생님은 춘향제 준비로\n바쁘시대. 배움터도 문을 닫았어!") },
      { x: 8, y: 33, spr: "kid_f", move: "wander", r: 2, talk: "분수 앞에서 남켓몬이랑 사진 찍을 거야!" },
      { id: "bondi", x: 26, y: 31, spr: "bondi", dir: "left", move: "look", talk: async (a) => { await say("……본디대로.\f남켓몬은 본디 있던 자리로\n돌아가야 하는 법."); a.dir = "up"; await say("(흰 도포를 입은 사람은\n말없이 고개를 돌렸다……)"); } },
      // 1번도로
      { id: "r1_fisher", x: 50, y: 52, spr: "oldman", dir: "right", move: "fixed", talk: () => typeof fisherTalk === "function" ? fisherTalk() : say("요천에는 물에 사는 남켓몬이 많지.") },
      // v2.0 1번도로 좌우로: 쉼터·북동 풀숲·숲속 빈터(풀베기)·남동 풀숲
      { item: "potion", x: 6, y: 43 }, { item: "namket", n: 2, x: 34, y: 38 }, { item: "yeot", x: 6, y: 59 }, { item: "antidote", x: 45, y: 77 }, { item: "jujube", x: 47, y: 39 },
      { x: 32, y: 68, spr: "kid_m", dir: "down", trainer: { id: "r1_minjun", cls: "꼬마", name: "민준", spr: "kid_m", range: 3, base: 16, team: [["daramball", 4], ["kkajak", 4]],
        intro: "어이! 눈 마주쳤지?\n그럼 승부다!", lose: "으앗! 졌다……", after: "반바지는 시원하고 편해서 좋아!\n너도 한번 입어 봐!" } },
      { x: 38, y: 59, spr: "bugboy", dir: "left", trainer: { id: "r1_doyun", cls: "벌레잡이", name: "도윤", spr: "bugboy", range: 4, base: 16, team: [["kkomulbae", 5], ["kkulbeong", 4]],
        intro: "잠자리채에 걸린 줄 알았는데……\n사람이잖아? 그럼 승부다!", lose: "내 벌레 남켓몬들이……!", after: "2번도로 풀숲에는 벌레 남켓몬이\n잔뜩 있대. 빨리 가 보고 싶어!" } },
      { x: 47, y: 58, spr: "kid_f", dir: "left", trainer: { id: "r1_harin", cls: "꼬마 숙녀", name: "하린", spr: "kid_f", range: 3, base: 16, team: [["cheongdungkong", 5]],
        intro: "너도 남켓몬 트레이너구나?\n나랑 승부하자!", lose: "에잇, 졌잖아!", after: "요천 물가에는 물 남켓몬이\n많이 산대. 저녁에 가 봐!" } },
      { id: "jebi", x: 48, y: 67, special: (x, y) => { const mi = JSN.misc.t["jebikko" + ((FRAME >> 5) & 1)]; sprite(IMG.misc, mi * 16, 0, 16, 16, x, y); },
        show: () => !G.flag("jebi_done"), move: "fixed", talk: jebiEvent },
      // 소색마을
      { x: 12, y: 91, spr: "woman", move: "look", talk: "도통동 아파트 단지는\n언제나 조용하고 좋아." },
      { x: 24, y: 85, spr: "oldman", move: "look", talk: "장승은 마을 어귀를 지켜 주는\n수호신이란다.\f네 남켓몬도 언젠가 너를\n지켜 주겠지." },
      { x: 20, y: 92, spr: "kid_m", move: "wander", r: 2, talk: () => G.flag("slept") ? say("한결이 형은 아침 일찍\n1번도로로 뛰어갔어!") : say("통학버스 타고 왔구나!\n나도 내년엔 덕과 아카데미 간다!") },
    ],
  },
  class: {
    // v2.40 시작 교실 다시: 14×12 → 16×12(화면을 꽉 채움, 양옆 검은 띠 없음) · 책상 줄 사이를 한 줄 띄움(전엔 아이가 앞뒤 책상에 끼여 서 있었음) · 반 친구 둘 더
    rows: ["################", "#OO##########OO#", "________________", "________________", "________________", "________________",
      "________________", "________________", "________________", "________________", "_______M________", "                "],
    stamps: [["blackboard", 6, 0], ["teacher_desk", 11, 2], ["lab_table", 6, 4], ["student_desk", 2, 6], ["student_desk", 4, 6], ["student_desk", 11, 6], ["student_desk", 13, 6],
      ["student_desk", 2, 9], ["student_desk", 4, 9], ["student_desk", 11, 9], ["student_desk", 13, 9], ["locker", 0, 9], ["locker", 14, 9], ["plant", 15, 2], ["plant", 0, 2], ["bookshelf", 3, 1], ["sticker_board", 10, 0]],
    indoor: true, name: "덕과 아카데미", floor: "floor_class", wall: "wall_class", win: "win_class", bgm: "academy", noPopup: true,
    exitRun: async () => {
      if (!G.flag("starter")) { await say("조박사: 어허, {P}! 어디 가?\n남켓몬부터 골라야지!"); await walk(World.player, "up"); return; }
      await busRide();
    },
    checks: [[6, 1, "칠판에 '남켓몬 생태 탐구'라고 적혀 있다."], [7, 1, "칠판에 '남켓몬 생태 탐구'라고 적혀 있다."], [8, 1, "칠판에 '1학기 끝! 방학 숙제: 남켓몬 관찰 일기'라고 적혀 있다."], [9, 1, "칠판에 '1학기 끝! 방학 숙제: 남켓몬 관찰 일기'라고 적혀 있다."],
      [11, 2, "교탁 위에 출석부가 놓여 있다."], [12, 2, "교탁 위에 출석부가 놓여 있다."], [3, 2, "남켓몬 그림책이 꽂혀 있다.\f'우리 동네 남켓몬'\n'요천에 사는 친구들'"], [4, 2, "남켓몬 그림책이 꽂혀 있다."], [10, 1, "칭찬 스티커판에 스티커가\n빼곡하다."], [11, 1, "칭찬 스티커판에 스티커가\n빼곡하다."]],
    npcs: [
      { id: "jobaksa", x: 7, y: 2, spr: "jobaksa", dir: "down", move: "fixed", talk: async () => { if (!G.flag("starter")) await say("조박사: 탁자 위의 볼 세 개 중에서\n마음에 드는 남켓몬을 골라 봐!"); else await say("조박사: 윤슬 박사님께 편지 전하는 거,\n잊으면 안 돼!"); } },
      { id: "hangyeol", x: 11, y: 7, spr: "hangyeol", dir: "up", talk: () => say(G.flag("starter") ? "한결: 흥, 다음엔 진짜 안 져!" : "한결: 뭘 그렇게 고민해?\n빨리 골라!") },
      { id: "boreum", x: 13, y: 7, spr: "boreum", dir: "up", talk: () => say(G.flag("starter") ? "보름: 우리 남켓몬이랑 영상 찍어서\n올려 볼까? 히히." : "보름: 와, 진짜 남켓몬이야!\n어떤 애가 들어 있을까?") },
      { x: 2, y: 7, spr: "kid_m", dir: "up", talk: "좋겠다…… 나도 남켓몬 갖고 싶어!" },
      { x: 11, y: 10, spr: "kid_f", dir: "up", talk: "방학 숙제가 남켓몬 관찰 일기래.\n재밌겠다!" },
      { x: 2, y: 10, spr: "bugboy", dir: "up", talk: "방학 때 지리산 가서\n벌레 남켓몬 관찰할 거야!" },
      { x: 13, y: 10, spr: "student", dir: "up", talk: "다음 학기엔 우리 반도\n다 같이 남켓몬 데리고 오자!" },
      ...STARTERS.map((k, i) => ({ id: "ball_" + k, x: 6 + i, y: 4, special: ball(k), move: "fixed", show: () => !G.flag("took_" + k), talk: () => chooseStarter(k) })),
    ],
  },
  home: { rows: D.home.rows, stamps: D.home.stamps, indoor: true, name: "우리 집", floor: "floor_lino", wall: "wall_home", win: "win_home", bgm: "town", noPopup: true, exit: exitTo("home"),
    checks: [[5, 2, "TV에서 춘향제 소식이 나오고 있다.\f'올해 춘향제에는 특별한 손님이\n찾아온다고 합니다……'"], [6, 2, "TV에서 춘향제 소식이 나오고 있다."],
      [8, 2, () => usePC()], [9, 2, () => usePC()], [11, 2, "남켓몬 그림책이 잔뜩 꽂혀 있다."], [12, 2, "남켓몬 그림책이 잔뜩 꽂혀 있다."],
      [13, 3, "포근한 이불이 깔려 있다."], [13, 4, "포근한 이불이 깔려 있다."], [0, 2, "냉장고에 엄마가 붙여 둔 메모가 있다.\n'편식하지 말 것!'"], [1, 2, "싱크대가 반짝반짝하다."], [2, 2, "싱크대가 반짝반짝하다."]],
    npcs: [{ id: "mom", x: 3, y: 4, spr: "mom", dir: "down", talk: momTalk }],
    onEnter: async () => { if (G.flag("starter") && !G.flag("slept")) await homeArrive(); },
  },
  home2: { rows: D.home2.rows, stamps: D.home2.stamps, indoor: true, name: "한결이네 집", floor: "floor_lino", wall: "wall_home", win: "win_home", bgm: "town", noPopup: true, exit: exitTo("home2"),
    npcs: [{ x: 4, y: 4, spr: "woman", dir: "down", talk: () => say(G.flag("slept") ? "한결이 엄마: 어머, {P} 왔니?\f한결이는 아침 일찍\n다홍시티로 뛰어나갔단다." : "한결이 엄마: 한결이는 방에서\n남켓몬이랑 노느라 정신이 없단다.") }],
    checks: [[5, 2, "TV에서 남켓몬 배틀 중계를 하고 있다!"], [6, 2, "TV에서 남켓몬 배틀 중계를 하고 있다!"], [9, 2, "운동 잡지가 꽂혀 있다.\n'강해지는 법 100가지'"], [10, 2, "운동 잡지가 꽂혀 있다."]],
  },
  center: { rows: D.center.rows, stamps: D.center.stamps, indoor: true, name: "남켓몬센터", floor: "floor_tile", wall: "wall_center", win: "win_home", bgm: "center", noPopup: true, exit: exitTo("center"),
    checks: [[12, 2, () => usePC()], [12, 1, () => usePC()], [13, 2, () => usePC()], [13, 1, () => usePC()]],
    npcs: [{ id: "nurse", x: 6, y: 2, spr: "nurse", dir: "down", move: "fixed", talk: nurseTalk },
      { x: 2, y: 6, spr: "man", move: "look", talk: "남켓몬이 다 쓰러지면 눈앞이\n캄캄해져. 그 전에 센터에 들르렴." },
      { x: 10, y: 5, spr: "student", move: "look", talk: "남켓몬은 6마리까지 데리고 다닐 수 있어.\f더 잡으면 PC로 보내지니까\n저 PC에서 꺼내면 돼!" },
      { id: "watchman", x: 12, y: 6, spr: "oldman", dir: "left", move: "look", talk: watchTalk }],
  },
  mart: { rows: D.mart.rows, stamps: D.mart.stamps, indoor: true, name: "만물상", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "center", noPopup: true, exit: exitTo("mart"),
    npcs: [{ id: "clerk", x: 1, y: 2, spr: "clerk", dir: "down", move: "fixed", talk: () => shop(martStock()) },
      { id: "clerk2", x: 2, y: 2, spr: "clerk", dir: "down", move: "fixed", talk: async () => { await say("특별 매대예요!\n배틀에 쓰는 부적과 마실 것이 있어요."); await shop(SPECIAL_STOCK); } },
      { x: 7, y: 6, spr: "oldwoman", move: "look", talk: "남켓볼은 넉넉히 사 두렴.\n귀한 남켓몬은 갑자기 나타나거든." }],
    checks: [[4, 2, "여러 가지 물건이 진열되어 있다."], [5, 2, "여러 가지 물건이 진열되어 있다."], [6, 2, "남켓볼이 가지런히 쌓여 있다."], [7, 2, "남켓볼이 가지런히 쌓여 있다."], [8, 2, "약병이 줄지어 서 있다."], [9, 2, "약병이 줄지어 서 있다."]],
  },
  lab: { rows: D.lab.rows, stamps: D.lab.stamps, indoor: true, name: "생태연구소", floor: "floor_lab", wall: "wall_lab", win: "win_lab", bgm: "academy", noPopup: true, exit: exitTo("lab"),
    checks: [[0, 2, "복잡한 기계가 윙윙 돌아가고 있다."], [1, 2, "복잡한 기계가 윙윙 돌아가고 있다."], [2, 2, "남켓몬의 생김새를 기록하는 기계다."], [3, 2, "남켓몬의 생김새를 기록하는 기계다."],
      [6, 2, "화면에 요천의 수질 그래프가 떠 있다."], [10, 2, "'남원의 철새' '지리산 식물 도감'……\n어려운 책이 가득하다."], [11, 2, "'남원의 철새'……"], [12, 2, "'판소리와 생태'……"], [13, 2, "'판소리와 생태'……"]],
    npcs: [{ id: "yunseul", x: 6, y: 3, spr: "yunseul", dir: "down", move: "fixed", talk: yunseulTalk },
      { id: "aide", x: 11, y: 5, spr: "aide", move: "look", talk: aideTalk },
      { id: "boreum", x: 3, y: 7, spr: "boreum", dir: "right", show: () => !G.flag("dex"), talk: () => say("보름: 나도 방금 왔어!") }],
    onEnter: async () => { if (G.has("letter") && !G.flag("dex")) await labEvent(); },
  },
  house_a: { rows: D.house_a.rows, stamps: D.house_a.stamps, indoor: true, name: "한옥", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "city", noPopup: true, exit: exitTo("house_a"),
    checks: [[0, 1, "자개장이 반짝반짝 빛난다."], [1, 1, "자개장이 반짝반짝 빛난다."], [6, 2, "병풍에 지리산 풍경이 그려져 있다."], [7, 2, "병풍에 지리산 풍경이 그려져 있다."]],
    npcs: [{ x: 2, y: 4, spr: "woman", move: "look", talk: async () => { if (!G.flag("omija")) { await say("추어탕 거리의 월매댁 추어탕은\n꼭 먹어 봐야 한단다!\f옳지, 이것도 가져가렴."); await getItem("omija"); G.flag("omija", true); } else await say("오미자는 다섯 가지 맛이 난대.\n남켓몬 상태 이상도 싹 낫게 해 줘!"); } }],
  },
  house_b: { rows: D.house_b.rows, stamps: D.house_b.stamps, indoor: true, name: "한옥", floor: "floor_wood", wall: "wall_hanok", win: "win_home", bgm: "town", noPopup: true, exit: exitTo("house_b"),
    checks: [[0, 1, "자개장이 반짝반짝 빛난다."], [1, 1, "자개장이 반짝반짝 빛난다."], [6, 2, "병풍에 광한루가 그려져 있다."], [7, 2, "병풍에 광한루가 그려져 있다."]],
    npcs: [{ x: 6, y: 4, spr: "oldwoman", dir: "down", talk: async () => { if (!G.flag("jujube")) { await say("아이고, 첫 남켓몬을 받았다고?\n장하구나!\f이 대추 가져가렴.\n남켓몬이 힘들어하면 먹이고."); await getItem("jujube", 3); G.flag("jujube", true); } else await say("남켓몬도 사람처럼\n잘 먹고 잘 쉬어야 쑥쑥 큰단다."); } }],
  },
};

// ---------------- 이야기 ----------------
// 새 게임: 조박사의 첫 인사 (포켓몬 박사 소개 장면의 흐름: 환영 → 이름 → 남켓몬 세계 → 너는 누구니 → 출발)
class IntroStage {
  constructor() { this.opaque = true; this.show = null; this.kk = null; this.sc = 1; this.t = 0; this.pick = 0; }
  update() { this.t++; }
  tr(name, x, y, dim) {
    const im = IMG["tr_" + name]; if (!im) return;
    if (dim) g.globalAlpha = 0.35;
    trImg(im, dim ? 0 : Math.floor(this.t / 6), x, y);
    g.globalAlpha = 1;
  }
  draw() {
    const gr = g.createLinearGradient(0, 0, 0, SH); gr.addColorStop(0, "#f4ecd8"); gr.addColorStop(1, "#d8c8a0"); g.fillStyle = gr; g.fillRect(0, 0, SW, SH);
    g.fillStyle = "#c8b890"; g.beginPath(); g.ellipse(128, 118, 70, 12, 0, 0, 7); g.fill();
    if (this.show === "prof") this.tr("jobaksa", 88, 40);
    if (this.show === "mon" && this.kk) { this.tr("jobaksa", 40, 40); monFront(this.kk, 130, 30); }
    if (this.show === "gender") { this.tr("player_m_front", 14, 40, this.pick !== 0); this.tr("player_f_front", 96, 40, this.pick !== 1); }
    if (this.show === "player") {
      const im = IMG["tr_" + (G.gender === "f" ? "player_f_front" : "player_m_front")]; const s = this.sc;
      if (im) trImg(im, Math.floor(this.t / 6), Math.round(128 - 40 * s), Math.round(120 - 80 * s), Math.round(80 * s), Math.round(80 * s));
    }
  }
}
async function newGameIntro() {
  G.reset();
  const st = new IntroStage(); Scenes.push(st);
  bgm("academy");
  st.show = "prof"; await fadeIn(16);
  await say("어서 와!\n남켓몬의 세계에 온 걸 환영해!");
  await say("나는 조대현.\n아이들은 나를 '조박사'라고 불러!");
  st.show = "mon"; st.kk = "kkajak"; Audio2.cry("kkajak");
  await say("이 세계에는 '남켓몬'이라고 불리는\n생물들이 곳곳에 살고 있어.");
  await say("사람과 남켓몬은 함께 놀기도 하고,\n힘을 합쳐 일하기도 하며 살아가.");
  await say("나는 덕과 아카데미의 담임 선생님이야.\n아이들과 남원의 남켓몬을 탐구하지.");
  await say("그리고 덕과 갈매 배움터의 지킴이,\n여덟 번째 지킴이이기도 해.\f……뭐, 그 얘기는 나중에 하자!");
  st.show = "prof";
  await say("자, 이번엔 네 차례!");
  st.show = "gender"; st.pick = 0;
  const gi = await ask("너는 남자아이니?\n여자아이니?", ["남자아이", "여자아이"], { onMove: i => st.pick = i });
  G.gender = gi === 1 ? "f" : "m";
  st.show = "player"; st.sc = 1;
  let name = null;
  while (!name) {
    const presets = G.gender === "f" ? ["다온", "새봄", "하늘"] : ["한별", "이준", "도담"];
    const v = await ask("좋아. 그리고……\n이름이 뭐였더라?", [...presets, "직접 입력"]);
    if (v === presets.length) name = await typeName("너의 이름은?"); else name = presets[v];
    if (name && !(await yes(`${name}! 맞지?`))) name = null;
  }
  G.name = name;
  await say(`그래, ${name}!\n좋은 이름이야.`);
  await say(`${name}!\f이제부터 너만의\n남켓몬 이야기가 시작이야!`);
  await say("꿈과 모험, 그리고 남켓몬의 세계로!\n자, 출발이다!");
  for (let i = 0; i < 40; i++) { st.sc = 1 - i / 40 * 0.75; await frames(1); }
  await fadeOut(20, "#fff"); Scenes.pop(st); Screen.fadeCol = "#000"; Screen.fade = 1;
  // 교실
  World.init(); World.load("class", 4, 7, "up"); Scenes.push(World);
  await say("용성지방 남원, 덕과 아카데미.\n오늘은 1학기 마지막 수업 날이다.");
  await fadeIn(16);
  await World.run(classIntro);
}
JS["의"] = ["의", "의"];
// typeName(): v2.12부터 js/namekb.js의 화면 속 글자판(실제 게임처럼)
async function classIntro() {
  await say("조박사: 자자, 다들 자리에 앉자!\n오늘이 이번 학기 마지막 수업이야.");
  await say("조박사: 한 학기 동안 남원 곳곳을\n정말 열심히 탐구했지?\f그래서 선생님이 특별한 선물을\n준비했어!");
  await emote(act("hangyeol"), "excl", 30);
  await say("조박사: 앞 탁자에 볼 세 개 보이지?\n그 안에 남켓몬이 한 마리씩 있어.");
  await say(`조박사: 한결, 보름, 그리고 ${G.name}.\n셋이 한 마리씩 맡아서 잘 키워 줘.`);
  await say(`한결: 선생님, 저부터요! 저부터!`);
  await say(`조박사: 음 그건 안 돼.\n${ii(G.name)}부터 고르자.`);
  await say(`한결: 흥, 뭐 좋아.\n난 양보할 줄도 아는 사람이니까.\f먼저 골라, ${G.name}!`);
}
async function chooseStarter(k) {
  if (G.flag("starter")) return;
  const m = MON[k];
  const ov = new Overlay(() => { frame(64, 8, 128, 112); monFront(k, 80, 14); });
  Scenes.push(ov); Audio2.cry(k);
  const ok = await yes(`${m.t[0]} 타입 남켓몬\n${J(m.n, "으로")} 할래?`);
  Scenes.pop(ov);
  if (!ok) return;
  G.flag("took_" + k, true);
  const a = act("ball_" + k); a.hidden = true;
  const mon = makeMon(k, 5, { met: "덕과 아카데미", ot: G.name });
  mon.otid = G.id; G.party.push(mon); G.see(k); G.catch(k); G.flag("starter", true); G.starter = k;
  await say(`조박사: 오, ${ii(m.n)}구나!\n아주 씩씩한 녀석이야.`);
  const tb = await say(`${J(G.name, "은")} 조박사에게서\n${J(m.n, "을")} 받았다!`, { keep: true });
  await Audio2.jingle("jg_keyitem"); Scenes.pop(tb);
  await nicknamePrompt(mon);          // v1.9 실제 게임처럼 받은 남켓몬에게 별명
  // 한결이 상성상 유리한 남켓몬을 고른다
  const rk = RIVAL_OF[k], H = act("hangyeol");
  await say("한결: 그럼 나는…… 이걸로 할래!");
  await walk(H, "left"); await walkTo(H, 9, 3); await walkTo(H, 6 + STARTERS.indexOf(rk), 3); H.dir = "down"; await frames(10);
  act("ball_" + rk).hidden = true; G.flag("took_" + rk, true);
  const tb2 = await say(`한결은 조박사에게서\n${J(MON[rk].n, "을")} 받았다!`, { keep: true }); await Audio2.jingle("jg_item"); Scenes.pop(tb2);
  const bk = STARTERS.find(x => x !== k && x !== rk);
  await say(`보름: 와, 남은 애가 제일 귀엽다!\n${MON[bk].n}, 우리 친하게 지내자!`);
  act("ball_" + bk).hidden = true; G.flag("took_" + bk, true);
  await say("조박사: 좋아. 다들 남켓몬이랑\n사이좋게 지내!");
  // 라이벌 배틀
  const P = World.player; face(H, P);
  bgm("rival");
  await emote(H, "excl", 30);
  await say(`한결: 잠깐, ${G.name}!\n받은 남켓몬, 바로 시험해 보자!\f자, 덤벼!`);
  await trainerBattle({ trainer: { id: "rival1", cls: "라이벌", name: "한결", spr: "hangyeol", team: [[rk, 5]], intro: "한결: 내 남켓몬이 더 세다는 걸\n보여 주지!", bgm: "trainer", music: "rival",
    lose: "한결: 뭐라고?!\n남켓몬을 잘못 골랐나……", prize: 200, canLose: true, loseText: "한결: 거봐!\n역시 내가 최고라니까!", bg: "indoor" }, x: H.x, y: H.y, dir: H.dir }, false);
  World.cam = World.camTarget();
  bgm("academy");
  await say("한결: 흥, 오늘은 이 정도로 해 두지.\f남켓몬을 더 키워서\n다음엔 제대로 붙자! 먼저 간다!");
  await walkTo(H, 9, 3); await walkTo(H, 9, 10); await walkTo(H, 7, 10); H.hidden = true; sfx("exit");
  await say("조박사: 오, 둘 다 멋진 승부였어!\n남켓몬 좀 쉬게 해 주자.");
  G.healAll(); await Audio2.jingle("jg_heal");
  await say("조박사: 얘들아, 선생님 좀 도와줄 사람~?");
  await say(`조박사: ……${G.name}, 방금 눈 마주쳤다.\n너로 정했어!`);
  await say("조박사: 다홍시티 광한루원 안에\n생태연구소가 있어.\f거기 계신 윤슬 박사님께\n이 편지 좀 전해 줄래?");
  await getItem("letter");
  await say("조박사: 박사님이 너희한테 줄 게\n있다고 하셨거든.\f내일 1번도로를 따라\n북쪽으로 가 봐.");
  await say("조박사: 아, 하나 더.\f선생님 갈매 배움터에도 언젠가 와.\n어사패 일곱 개 모아서.\f그때 봐 달라고? 음 그건 안 돼!\n제대로 붙는 거야.");
  await say("조박사: 그럼 오늘 수업 끝!\n통학버스 타고 조심히 가!");
}
async function busRide() {
  await fadeOut(12);
  const s = { opaque: true, t: 0, update() { this.t++; }, draw() {
    const bg = IMG.bg_grass_eve; if (bg) { const off = (this.t * 2) % 256; g.drawImage(bg, off, 0, 256 - off, 144, 0, 0, 256 - off, 144); g.drawImage(bg, 0, 0, off, 144, 256 - off, 0, off, 144); }
    rect(0, 120, SW, 24, "#5a5a62"); for (let x = -((this.t * 6) % 32); x < SW; x += 32) rect(x, 131, 16, 2, "#f0e0a0");
    const bob = (this.t >> 3) & 1; sprite(IMG.bus, ((this.t >> 3) & 1) * 64, 0, 64, 32, 96, 92 + bob);
    darkBox(0, 144, 256, 48);
  } };
  Scenes.push(s); bgm("route");
  await fadeIn(12); sfx("bus");
  await say("통학버스를 타고 집으로 향한다……", { auto: 1400 });
  await say("창밖으로 노을 진 요천이 반짝인다.", { auto: 1400 });
  await fadeOut(14); Scenes.pop(s);
  World.load("world", 17, 98, "up"); World.cam = World.camTarget();
  await fadeIn(14);
  await say("소색마을에 도착했다!");
}
async function homeArrive() {
  const mom = act("mom"), P = World.player;
  await emote(mom, "excl", 30); face(mom, P);
  await say(`엄마: 어머, ${G.name}! 왔구나!`);
  await say(`엄마: 응? 그 볼…… 혹시 남켓몬이니?!\n조박사님께 받았구나!`);
  await say(`엄마: ${MON[G.starter].n}? 이름도 귀엽네!\n우리 ${G.name} 잘 부탁해!`);
  await say("엄마: 오늘은 피곤할 테니\n둘 다 푹 쉬렴.");
  await fadeOut(20);
  G.healAll();
  const nt = new Overlay(() => rect(0, 0, SW, SH, "#000")); Scenes.push(nt);
  Screen.fade = 0;
  await say("그날 밤……", { auto: 1200 });
  await say("다음 날 아침.", { auto: 1200 });
  Scenes.pop(nt); Screen.fade = 1;
  P.x = 12; P.y = 4; P.dir = "down"; mom.x = 11; mom.y = 6; mom.dir = "up";
  World.cam = World.camTarget(); sfx("chime");
  await fadeIn(16);
  await say(`엄마: 잘 잤니, ${G.name}?\n오늘 다홍시티에 간다고 했지?`);
  await say("엄마: 참, 이거 가져가렴!\n엄마가 새로 산 운동화야.");
  await getItem("runshoes", 1, true); G.flag("runshoes", true);
  await say("엄마: X 키(B 버튼)를 누른 채로 움직이면\n쌩쌩 달릴 수 있단다!");
  await say("엄마: 그리고 이 상처약도.\n남켓몬이 다치면 꼭 발라 주렴.");
  await getItem("potion", 2);
  // v2.40 회중시계는 아침 이벤트에서 엄마가 건넴(사용자: "말 안 걸어도 이벤트 도중 획득") — 실제 포켓몬(하트골드)에서 엄마가 시계를 맞춰 주듯
  if (!G.flag("watch")) {
    await say("엄마: 아, 이것도 챙기렴.\n할아버지가 쓰시던 회중시계란다.");
    await getItem("watch"); G.flag("watch", true);
    await say("엄마: 이 세상은 진짜 시계를 따라\n아침·낮·저녁·밤이 바뀌어.\f때가 바뀌면 나오는 남켓몬도\n달라진단다.\f가방에서 회중시계를 쓰면\n'게임 시계'로 바꿀 수 있어.\f게임 시계는 24분이면 하루가 가고,\n'다음 때로 넘기기'도 된단다.");
  }
  await say("엄마: 1번도로를 따라 북쪽으로 가면\n다홍시티야. 조심해서 다녀오렴!");
  G.flag("slept", true); G.heal = ["home", 3, 5, "up"];
  // v1.5.4: 순간이동하지 않고 부엌 자리로 걸어 돌아감(소파 위쪽 줄로)
  await walkTo(mom, 11, 5); await walkTo(mom, 3, 5); await walkTo(mom, 3, 4); mom.dir = "down";
}
async function momTalk() {
  if (!G.flag("slept")) return;
  const hurt = G.party.some(m => m.hp < m.st[0] || m.status || m.moves.some(x => x.pp < x.max));
  if (hurt) {
    await say(`엄마: ${G.name}! 남켓몬이 지쳐 보이는구나.\n잠깐 쉬었다 가렴.`);
    await fadeOut(10); G.healAll(); await Audio2.jingle("jg_heal"); await fadeIn(10);
    await say("엄마: 자, 남켓몬도 기운이 났지?\n힘내렴!");
  } else await say(`엄마: 엄마는 언제나\n${J(G.name, "을")} 응원해! 다녀오렴!`);
}
async function jebiEvent(a) {
  await say("날개를 다친 제비꼬가\n물가에 쓰러져 있다……");
  Audio2.cry("jebikko");
  const c = await ask("제비꼬를 돌봐 줄까?", ["돌봐 준다", "그냥 간다"]);
  if (c === 0) {
    if (G.has("potion")) { G.take("potion"); await say("상처약을 날개에 살살 발라 주었다."); }
    else if (G.has("jujube")) { G.take("jujube"); await say("대추를 잘게 쪼개 먹여 주었다."); }
    else await say("손수건으로 다친 날개를\n조심조심 감싸 주었다.");
    await emote(a, "heart", 40);
    await say("제비꼬는 고맙다는 듯이\n짹짹 울었다!");
    for (let i = 0; i < 24; i++) { a.special = ((yy) => (x, y) => { const mi = JSN.misc.t["jebikko" + ((FRAME >> 2) & 1)]; sprite(IMG.misc, mi * 16, 0, 16, 16, x + yy * 2, y - yy * 3); })(i); await frames(1); }
    a.hidden = true; G.flag("jebi_helped", true);
    await say("제비꼬는 하늘 높이 날아갔다.\f언젠가 다시 만날 것 같은\n기분이 든다……");
  } else { await say("제비꼬를 그냥 두고 가기로 했다……"); a.hidden = true; }
  G.flag("jebi_done", true);
}
// v1.4 게임 시계(D3): 시계방 할아버지가 회중시계를 주고 안내
async function watchTalk() {
  if (G.flag("watch")) { await say("시계방 할아버지: 회중시계는 가방의\n'중요한 물건' 주머니에 있단다.\f게임 시계로 바꾸면\n24분에 하루가 간단다.\f'다음 때로 넘기기'로\n바로 넘길 수도 있지."); return; }
  await say("시계방 할아버지: 허허, 꼬마 트레이너로구나.\f이 세상은 진짜 시계를 따라\n아침·낮·저녁·밤이 바뀐단다.\f때가 바뀌면 나오는 남켓몬도 바뀌고,\n날씨도 철 따라 달라지지.");
  await say("시계방 할아버지: 그런데 낮에만 놀면\n밤에 나오는 남켓몬은 못 만나겠지?\f그래서 이 회중시계를 주마.");
  await getItem("watch"); G.flag("watch", true);
  await say("시계방 할아버지: 가방에서\n회중시계를 쓰면\f'게임 시계'로\n바꿀 수 있단다.\f게임 시계는\n24분이면 하루가 가고,\f'다음 때로 넘기기'로\n원하는 때로 갈 수 있어.\f진짜 시각으로 돌아가고 싶으면\n'실제 시각으로'를 고르면 된단다.");
}
async function nurseTalk() {
  const v = await ask("어서 오세요! 남켓몬센터입니다.\f여기서는 지친 남켓몬을\n건강하게 회복시켜 드려요.\f남켓몬을 쉬게 해 드릴까요?", ["쉬게 한다", "그만둔다"]);
  if (v !== 0) { await say("또 오세요!"); return; }
  await say("그럼 남켓몬을 잠시\n맡아 둘게요.", { auto: 900 });
  const nurse = act("nurse"); nurse.dir = "right";
  const balls = [];
  // v2.18 회복 기계(2배 촘촘) 홈 6칸에 작은 남켓볼(8×8 기기 화소 = 4×4 논리 화소, 반 칸 단위로 그림)
  const BALL = ["..oooo..", ".orrrro.", "orrhrrro", "oddwwddo", "obbwwbbo", "obbbbbbo", ".obbbbo.", "..oooo.."];
  const drawBall = (x, y, lit) => { const C = { o: "#3a2a30", r: lit ? "#fff8c0" : "#d04030", h: "#ffd0c0", d: "#3a3a48", w: "#f8f8f8", b: "#e8e8f0" };
    for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) { const k = BALL[j][i]; if (k !== ".") rect(x + i / 2, y + j / 2, 0.5, 0.5, C[k]); } };
  const hs = (World.def.stamps || []).find(s => s[0] === "healer"), hx = hs ? hs[1] : 8, hy = hs ? hs[2] : 1;   // v2.33 회복 기계 자리(리그 전당 1층은 왼쪽)
  World.extra = (cx, cy) => { for (let i = 0; i < balls.length; i++) { const x = hx * 16 + [8, 17, 28][i % 3] / 2 - cx, y = hy * 16 + [4, 12][Math.floor(i / 3)] / 2 - cy;
    drawBall(x, y, (FRAME >> 3) & 1 && balls.done); } };
  for (let i = 0; i < G.party.length; i++) { balls.push(1); sfx("heal_ball"); await frames(12); }
  balls.done = true;
  await Audio2.jingle("jg_heal");
  G.healAll(); World.extra = null; nurse.dir = "down";
  await say("오래 기다리셨어요!\n맡기신 남켓몬은 모두 건강해졌어요.");
  G.heal = [G.map, nurse.x, nurse.y + 2, "up"];   // v2.40 센터 새 배치: 간호사 앞 칸(카운터 너머)
  if (typeof NURSE_HEART !== "undefined" && !G.flag("nurse_heart_" + G.map)) { await say(NURSE_HEART); G.flag("nurse_heart_" + G.map, true); }   // v1.5.2 센터마다 처음 한 번
  await say("또 오세요!");
}
async function labEvent() {
  const B = act("boreum"), P = World.player;
  await say(`보름: ${G.name}! 너도 왔구나.\n나도 방금 도착했어.`);
  await walkTo(P, 6, 5); P.dir = "up";
  await say("윤슬 박사: 어서 와요!\n조박사님 반 친구들이죠?\f기다리고 있었어요.");
  await say(`${J(G.name, "은")} 조박사의 편지를\n윤슬 박사에게 건넸다.`); G.take("letter");
  await say("윤슬 박사: 어디 보자……\n후후, 조박사님 글씨는 여전하시네요.\f……그렇군요! 셋 다 남켓몬을\n받았다고요.");
  await say("윤슬 박사: 나는 이 연구소의 소장, 윤슬이에요.\f남원의 남켓몬이 어디서 어떻게\n살아가는지 연구하고 있어요.");
  await say("윤슬 박사: 그래서 부탁이 있어요.\n탁자 위의 이 기계 보이죠?\f내가 만든 '남켓몬 도감'이에요!\n만나거나 잡은 남켓몬이 저절로 기록돼요.");
  await say("윤슬 박사: 용성지방의 모든 남켓몬을\n기록하는 게 내 꿈이에요.\f하지만 연구소를 비우기가 어려워서……\n여러분이 대신 채워 줄래요?");
  const tb = await say(`${J(G.name, "은")} 윤슬 박사에게서\n남켓몬 도감을 받았다!`, { keep: true }); await Audio2.jingle("jg_dex"); Scenes.pop(tb);
  G.flag("dex", true);
  await say("윤슬 박사: 도감은 이름 모음이 아니라\n살아 있는 관계의 기록이에요.\f많이 만나고, 많이 친해져 주세요.");
  await say("윤슬 박사: 그리고 이건 남켓볼!\f야생 남켓몬을 조금 약하게 만든 다음\n던지면 잡을 수 있어요.");
  await getItem("namket", 5);
  await say("윤슬 박사: 마지막으로 학습장치!\f켜 두면 싸우지 않은 동료도\n경험치를 절반 받아요.");
  await getItem("expshare", 1, true); G.flag("expshare_on", true);
  // v2.40 타운맵은 도감 받는 이벤트 안에서 조수가 건넴(전엔 조수에게 따로 말을 걸어야 했음)
  if (!G.flag("townmap")) {
    const A = act("aide"); if (A) { face(A, P); await emote(A, "excl", 20); }
    await say("조수: 소장님, 이것도 드려야죠!\f처음 가는 길에서 헤매면\n안 되니까요.");
    await getItem("townmap"); G.flag("townmap", true);
    await say("조수: 가방의 '중요한 물건'에서\n타운맵을 쓰면 지금 있는 곳과\f가 본 마을 이야기를\n볼 수 있어요!");
  }
  await say("보름: 와, 남켓몬 도감이다!\n이걸로 영상 찍으면 구독자 백만 명이야!");
  await say("윤슬 박사: 한결 군은 도감을 받자마자\n뛰쳐나갔답니다. 후후.");
  await say(`보름: 그럼 나도 먼저 가 볼게!\n${G.name}, 나중에 또 봐!`);
  await walk(B, "down", "down"); await walkTo(B, 6, 8); B.hidden = true; sfx("exit");
  await say("윤슬 박사: 참, 오늘부터 춘향제가 열려요!\f광한루원 동문 건너편 마당에\n가 보세요.\f배움터 지킴이 찬향 선생님도\n거기 계실 거예요.");
}
async function yunseulTalk() {
  if (!G.flag("dex")) { await say("윤슬 박사: 어서 와요!"); return; }
  const s = Object.keys(G.seen).length, c = Object.keys(G.caught).length;
  await say(`윤슬 박사: 도감은 잘 채우고 있나요?\f본 남켓몬 ${s}마리,\n잡은 남켓몬 ${c}마리……`);
  const T = c < 3 ? "이제 막 시작이네요!\n풀숲을 꼼꼼히 걸어 봐요." : c < 6 ? "좋아요! 시간대마다 나오는 남켓몬이\n달라요. 저녁과 밤에도 찾아봐요." : c < 10 ? "대단해요! 요천 둔치 근처에도\n귀한 남켓몬이 있다던데요?" : "놀라워요! 벌써 이만큼이나?\n이러다 나보다 박사가 되겠어요!";
  await say("윤슬 박사: " + T);
}
async function aideTalk() {
  if (G.flag("dex") && !G.flag("townmap")) { await say("조수: 소장님 조수예요.\n이거 가져가세요!\f처음 가는 길에서 헤매면\n안 되니까요."); await getItem("townmap"); G.flag("townmap", true); return; }
  if (G.flag("dex") && !G.flag("festival_done")) { await say("조수: 춘향제 마당에 가 봤어요?\n광한루원 동문 건너편이에요!"); return; }
  await say("조수: 남켓몬은 시간대에 따라\n사는 곳이 달라져요.\f요천 둔치는 저녁에 가 보세요!");
}
