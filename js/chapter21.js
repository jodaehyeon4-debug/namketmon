// ===== v2.16 마을회관·경로당 (남켓몬만의 마을 쉼터) =====
//   사용자: "남켓몬 특유의 시스템으로 '마을회관'이나 '경로당' 등을 만드는 것도 괜찮은 것 같아."
//   마을마다 한 곳(12곳). 들어가면 어르신 넷:
//     ① 옛이야기 어르신 — 그 고장 물음 하나(셋 중 고르기). 맞히면 선물(처음 한 번), 틀려도 설명 듣고 다시 도전
//     ② 쉬어 가기 어르신 — 한숨 자고 가면 남켓몬이 모두 회복(센터 대신 쉬는 곳)
//     ③ 총무 — 회관 도장 찍기(처음 한 번). 도장 6개 · 12개 모으면 선물
//     ④ 바둑 두는 어르신 — 그 고장 이야기 한마디
//   벽 소식판 — 오늘 그 고장 날씨와 근처 풀숲에서 자주 보이는 남켓몬(본 적 없으면 ???)
//   사실은 확인된 것만: 광한루·요천→섬진강·혼불(최명희)·덕과 만세운동·송홧가루·구룡(아홉 용)·홍예문·송흥록·인월(끌 인·달 월)·흥부와 제비·실상사
"use strict";
(() => {
  const D = MAPDATA;
  const HANOK = { floor: "floor_wood", wall: "wall_hanok", win: "win_home" }, MODERN = { floor: "floor_lino", wall: "wall_home", win: "win_home" };
  const HALLS = [
    { id: "hall_dh", name: "다홍 경로당", bgm: "city", look: HANOK, exit: () => exitTo("hall_dh"), wx: "다홍시티", enc: "광한루원", where: "광한루원 풀숲",
      q: ["춘향과 몽룡이 처음 만났다고\n전해지는 누각은?", ["광한루", "촉석루", "경회루"], 0, "광한루원 안에 있는 누각이\n바로 광한루란다.\f그 앞 연못에 놓인 다리가\n오작교고."], gift: ["superpotion", 2],
      talk: "광한루원 연못 잉어는\n사람 발소리를 알아듣는단다.", heart: "늙으면 걸음은 느려져도\n반가운 마음은 그대로란다." },
    { id: "hall_ss", name: "도통동 경로당", bgm: "town", look: HANOK, exit: () => exitTo("hall_ss"), wx: "도통동", enc: "1번도로", where: "1번도로 풀숲",
      q: ["도통동 앞을 흐르는 요천은\n어느 강으로 흘러갈까?", ["섬진강", "한강", "낙동강"], 0, "요천은 남원을 지나\n섬진강으로 흘러든단다.\f그 섬진강은 남쪽 바다까지\n가지."], gift: ["potion", 3],
      talk: "아파트가 많이 생겨도\n요천 둑길은 그대로야.", heart: "새 이웃이 오면 떡부터\n나눠 먹는 게 우리 동네 인심이지." },
    { id: "hall_jjok", name: "쪽빛 마을회관", bgm: "jjok", look: MODERN, exit: () => exitJ("hall_jjok"), wx: "사매", enc: "쪽빛마을", where: "쪽빛마을 풀숲",
      q: ["사매 혼불문학관은 어떤\n소설을 기리는 곳일까?", ["『혼불』", "『토지』", "『태백산맥』"], 0, "『혼불』은 최명희 작가가\n이 고장 이야기를 쓴 소설이야.\f문학관에 가면 소설 속\n마을을 볼 수 있단다."], gift: ["silk", 3],
      talk: "서도역에 기차가 서던 시절엔\n장날마다 북적였지.", heart: "오래 쓴 이야기일수록\n마음에 깊이 물이 든단다." },
    { id: "hall_galmae", name: "갈매 마을회관", bgm: "galmae", look: MODERN, exit: () => exitG("hall_galmae"), wx: "덕과", enc: "갈매마을", where: "갈매마을 풀숲",
      q: ["1919년 봄, 덕과 사람들이\n함께 외친 말은?", ["대한 독립 만세", "풍년이 왔네", "춘향이 만세"], 0, "나무 심는 날 모인 덕과 사람들이\n'대한 독립 만세!'를 외쳤단다.\f작은 마을 목소리도 모이면\n큰 힘이 되지."], gift: ["superpotion", 2],
      talk: "덕과 아카데미 운동장 소리가\n여기까지 들려.", heart: "혼자 외치면 작아도\n같이 외치면 산을 넘는단다." },
    { id: "hall_bisaek", name: "비색 마을회관", bgm: "bisaek", look: MODERN, exit: () => exitB("hall_bisaek"), wx: "금지", enc: "비색마을", where: "비색마을 풀숲",
      q: ["비색마을 앞에서 요천과\n만나는 큰 강은?", ["섬진강", "금강", "영산강"], 0, "요천 물이 이 앞에서\n섬진강과 만난단다.\f두 물이 만나 더 큰 강이\n되는 거지."], gift: ["hyperpotion", 1],
      talk: "가을이면 금지 들판이\n온통 황금빛이란다.", heart: "논에 물 대듯이 사람 마음도\n천천히 채워 주는 거란다." },
    { id: "hall_songhwa", name: "송화 경로당", bgm: "songhwa", look: HANOK, exit: () => exitS("hall_songhwa"), wx: "송동", enc: "7번도로", where: "7번도로 풀숲",
      q: ["봄에 소나무에서 바람에\n날리는 노란 가루는?", ["송홧가루", "황사", "모래 먼지"], 0, "소나무 꽃가루를\n송홧가루라고 한단다.\f마을 이름 '송화'도\n여기서 따왔지."], gift: ["lemonade", 3],
      talk: "솔숲 그늘에서 쉬면\n여름에도 시원하단다.", heart: "늘 푸른 소나무처럼\n변하지 않는 친구가 제일이지." },
    { id: "hall_juhong", name: "주홍 마을회관", bgm: "juhong", look: MODERN, exit: () => exitJH("hall_juhong"), wx: "주천·구룡계곡", enc: "주홍마을", where: "주홍마을 풀숲",
      q: ["'구룡계곡'의 '구룡'은\n무슨 뜻일까?", ["아홉 마리 용", "구름 속 용", "거북과 용"], 0, "구(九)는 아홉, 룡(龍)은 용.\n아홉 마리 용이 살았다는 이야기지.\f폭포마다 용 이야기가\n하나씩 있단다."], gift: ["revive", 1],
      talk: "지리산 물은 차고 맑아서\n수박 담가 두기 딱이야.", heart: "계곡물은 바위를 만나도\n돌아서 끝까지 흘러간단다." },
    { id: "hall_gamcheong", name: "감청 마을회관", bgm: "gamcheong", look: MODERN, exit: () => exitGC("hall_gamcheong"), wx: "교룡산성", enc: "감청마을", where: "감청마을 풀숲",
      q: ["교룡산성 성문처럼 돌을\n무지개 모양으로 쌓은 문은?", ["홍예문", "일주문", "솟을대문"], 0, "무지개 홍(虹)에 무지개 예(霓),\n그래서 홍예문이란다.\f돌끼리 서로 기대어\n무너지지 않지."], gift: ["fullheal", 2],
      talk: "산성 돌담은 사람들이\n하나하나 손으로 쌓은 거야.", heart: "돌도 서로 기대야 버티듯\n사람도 기대어 사는 거란다." },
    { id: "hall_ssukbit", name: "쑥빛 마을회관", bgm: "ssukbit", look: MODERN, exit: () => exitSB("hall_ssukbit"), wx: "운봉", enc: "12번도로", where: "12번도로 풀숲",
      q: ["운봉에서 태어나 동편제를\n크게 일으킨 명창은?", ["송흥록", "김홍도", "허준"], 0, "송흥록 명창은 '가왕'이라\n불릴 만큼 소리가 뛰어났단다.\f국악당에 가면 그 이야기를\n더 들을 수 있지."], gift: ["moomoomilk", 3],
      talk: "고원이라 바람이 차도\n별은 제일 잘 보인단다.", heart: "목이 쉬어도 다시 부르는 게\n소리꾼이란다. 너도 그렇게 해." },
    { id: "hall_inwol", name: "인월 경로당", bgm: "inwol", look: HANOK, exit: () => exitIW("hall_inwol"), wx: "인월", enc: "인월장터", where: "인월장터 풀숲",
      q: ["'인월(引月)'이라는 이름에\n들어 있는 것은?", ["달", "해", "별"], 0, "끌 인(引), 달 월(月).\n달을 끌어당겼다는 옛이야기에서\f나온 이름이란다."], gift: ["ok", 2],
      talk: "장날이면 이 앞길이\n발 디딜 틈도 없단다.", heart: "장터에선 덤 하나가\n마음 하나란다." },
    { id: "hall_misaek", name: "미색 경로당", bgm: "misaek", look: HANOK, exit: () => exitMS("hall_misaek"), wx: "아영", enc: "미색마을", where: "미색마을 풀숲",
      q: ["흥부가 다리를 고쳐 준\n새는?", ["제비", "까치", "참새"], 0, "흥부가 고쳐 준 제비가\n박씨를 물어 왔지.\f작은 친절이 큰 복이 되어\n돌아온 이야기란다."], gift: ["hyperpotion", 2],
      talk: "봄이면 제비가 처마 밑에\n다시 집을 짓는단다.", heart: "베푼 건 잊어도 되지만\n받은 건 오래 기억하렴." },
    { id: "hall_wolbaek", name: "월백 경로당", bgm: "wolbaek", look: HANOK, exit: () => exitWB("hall_wolbaek"), wx: "산내", enc: "월백마을", where: "월백마을 풀숲",
      q: ["산내 들판 한가운데 있는\n오래된 절은?", ["실상사", "불국사", "해인사"], 0, "실상사는 산속이 아니라\n들판에 있는 절이란다.\f천 년 넘게 그 자리를\n지켜 왔지."], gift: ["maxrevive", 1],
      talk: "지리산 그늘이 길어지면\n가을이 온 거란다.", heart: "천천히 가도 괜찮다.\n멈추지만 않으면 돼." },
  ];
  const WXN = { rain: "비", sun: "쾌청", sand: "모래바람", hail: "싸라기눈", fog: "안개" };
  const nStamps = () => HALLS.filter(h => G.flag("hstamp_" + h.id)).length;
  window.HALL_IDS = HALLS.map(h => h.id);

  async function quiz(h) {
    if (G.flag("hquiz_" + h.id)) { await say(h.talk); return; }
    const [q, opts, ans, why] = h.q;
    await say("옛날이야기 하나 해 줄까?\f대신 할아비 물음에\n답해 보렴.");
    const v = await quizAsk(q, opts, ["잘 모르겠어요"]);   // v2.40 보기 섞기(정답이 늘 첫 보기였음)
    if (v === ans) {
      await say("옳지! 잘 아는구나.\f" + why);
      await say("상으로 이걸 주마.");
      await getItem(h.gift[0], h.gift[1]);
      G.flag("hquiz_" + h.id, true);
    } else {
      await say("허허, 아깝구나.\f" + why + "\f다음에 다시 물어보마.\n언제든 오너라.");
    }
  }
  async function rest(h) {
    const v = await ask("먼 길 오느라 고단하지?\n여기서 한숨 자고 가렴.", ["쉬어 간다", "괜찮아요"]);
    if (v !== 0) { await say("그래, 몸 조심하고.\n남켓몬도 잘 챙기고."); return; }
    await say("이불 깔아 주마.\n편히 누워라.", { auto: 900 });
    await fadeOut(20); G.healAll(); await Audio2.jingle("jg_heal"); await frames(20); await fadeIn(20);
    await say("푹 잤니?\n남켓몬들도 기운이 펄펄 나는구나!");
  }
  async function stamp(h) {
    if (!G.flag("hstamp_" + h.id)) {
      await say(h.name + "에 온 걸 환영해요!\f마을회관·경로당마다 도장을\n하나씩 찍어 드려요.");
      G.flag("hstamp_" + h.id, true); sfx("select");
      const n = nStamps();
      await say(`쾅!\n${h.name} 도장을 받았다! (${n}/${HALLS.length})`);
      if (n === 6 && !G.flag("hstamp_gift6")) { await say("벌써 여섯 곳이나!\n이건 반 바퀴 기념 선물이에요."); await getItem("maxrevive", 1); G.flag("hstamp_gift6", true); }
      if (n === HALLS.length && !G.flag("hstamp_gift12")) { await say("용성지방 마을회관을\n모두 다녀왔군요!\f남원 엿가락이에요.\n남켓몬이 쑥쑥 자랄 거예요."); await getItem("yeot", 3); G.flag("hstamp_gift12", true); }
      return;
    }
    const n = nStamps();
    await say(n >= HALLS.length ? "도장을 모두 모았네요!\n정말 부지런한 여행자예요." : `지금까지 도장 ${n}개예요.\f${HALLS.length - n}곳 더 남았어요.\n6개·12개를 모으면 선물이 있어요!`);
  }
  async function board(h) {
    const k = typeof fieldWeather === "function" ? fieldWeather(h.wx) : null;
    const tip = k && WX_TIP[k] ? WX_TIP[k][1] : "산책하기 좋은 날이에요.";
    await say(`마을 소식판이다.\f오늘 ${h.name.split(" ")[0]} 날씨: ${WXN[k] || "맑음"}\n${tip}`);
    const L = (typeof encTable === "function" ? encTable(h.enc) : []).slice().sort((a, b) => (RARE_W[b.r] || 0) - (RARE_W[a.r] || 0));
    const seen = new Set(); const names = [];
    for (const e of L) { if (seen.has(e.k)) continue; seen.add(e.k); names.push(G.seen && G.seen[e.k] ? MON[e.k].n : "???"); if (names.length >= 4) break; }
    if (names.length) await say(`'요즘 ${h.where}에서\n자주 보이는 남켓몬'\f${names.join(" · ")}`);
    await say("'마을회관 도장 여행 — 12곳을\n모두 돌면 선물이 있어요!'");
  }

  const CK = (h) => [[3, 2, "TV에서 '우리 고장 소식'을 하고 있다."], [4, 2, "TV에서 '우리 고장 소식'을 하고 있다."],
    [8, 1, () => board(h)], [9, 1, () => board(h)], [12, 2, () => stamp(h)], [10, 4, "바둑판 위에 흰 돌·검은 돌이\n팽팽하게 맞서 있다."],
    [5, 4, "밥상 위에 제철 과일이\n소복이 담겨 있다."], [6, 4, "밥상 위에 제철 과일이\n소복이 담겨 있다."], [6, 1, "자개 반닫이에 어르신들\n장기 알이 들어 있다."], [7, 1, "자개 반닫이에 어르신들\n장기 알이 들어 있다."]];
  for (const h of HALLS) {
    MAPS[h.id] = { rows: D.hall_in.rows, stamps: D.hall_in.stamps, indoor: true, name: h.name, ...h.look, bgm: h.bgm, noPopup: true, exit: h.exit(), checks: CK(h),
      npcs: [
        { id: h.id + "_q", x: 7, y: 4, spr: "oldman", dir: "left", move: "fixed", talk: () => quiz(h) },
        { id: h.id + "_r", x: 2, y: 4, spr: "oldwoman", dir: "down", move: "fixed", talk: () => rest(h) },
        { id: h.id + "_s", x: 12, y: 3, spr: "woman", dir: "down", move: "fixed", talk: () => stamp(h) },
        { id: h.id + "_b", x: 11, y: 4, spr: "oldman", dir: "left", move: "fixed", heart: h.name + " 바둑 어르신", talk: h.talk + "\f" + h.heart },
      ] };
    if (typeof HEART_LOG !== "undefined") HEART_LOG.ok++;
  }
  window.HALLS_V216 = HALLS;
})();
