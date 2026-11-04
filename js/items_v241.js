// ===== v2.41 실전용 지닌 도구(배틀 아이템) =====
// 사용자: "실제 포켓몬 도구에서 쓰이는 기띠, 구애머리띠, 울퉁불퉁멧 등 실전용 도구 … 없다면 로컬라이징해서 전부 추가하고, 적절한 곳에 배치해."
// 실제 포켓몬처럼 효과는 그대로, 이름·그림만 남원·우리 옛 물건으로 바꿈(오른쪽 주석 = 실제 게임 이름). 효과는 js/battle.js(hi() 갈래)에서 처리
// 한 번 쓰면 없어지는 도구(질끈띠·방패연·흰쑥·박하잎·산삼뿌리·분발부적·만회부적·물림방울·퇴장패·도라지청·연근·번개박·반딧이끼·눈뭉치)는 실제 게임처럼 배틀 뒤에도 돌아오지 않음 → 춘향마트 3층에서 다시 살 수 있음
"use strict";
Object.assign(ITEMS, {
  focussash: { n: "질끈띠", p: "item", price: 4000, hold: "sash", once: 1, d: "HP가 가득할 때 한 방에 쓰러질 공격을 받아도 HP 1로 버텨요. 한 번 버티면 풀려 버려요.", ic: "focussash" },              // 기합의띠
  focusband: { n: "다짐머리띠", p: "item", price: 3000, hold: "fband", d: "쓰러질 만한 공격을 받아도 가끔(10번에 1번) HP 1로 버텨요.", ic: "focusband" },                                              // 기합의머리띠
  choiceband: { n: "외길머리띠", p: "item", price: 8000, hold: "cband", d: "공격이 1.5배가 되지만, 처음 쓴 기술만 계속 쓸 수 있어요. 교체하면 풀려요.", ic: "choiceband" },                             // 구애머리띠
  choicespecs: { n: "외길안경", p: "item", price: 8000, hold: "cspecs", d: "특수공격이 1.5배가 되지만, 처음 쓴 기술만 계속 쓸 수 있어요. 교체하면 풀려요.", ic: "choicespecs" },                      // 구애안경
  choicescarf: { n: "외길목도리", p: "item", price: 8000, hold: "cscarf", d: "스피드가 1.5배가 되지만, 처음 쓴 기술만 계속 쓸 수 있어요. 교체하면 풀려요.", ic: "choicescarf" },                    // 구애스카프
  rockyhelmet: { n: "밤송이투구", p: "item", price: 5000, hold: "helmet", d: "몸에 닿는 공격을 한 상대의 HP를 최대의 1/6만큼 깎아요. 가시가 송송!", ic: "rockyhelmet" },                         // 울퉁불퉁멧
  lifeorb: { n: "도깨비구슬", p: "item", price: 8000, hold: "lorb", d: "공격 기술이 1.3배 세지지만, 공격할 때마다 HP가 최대의 1/10씩 줄어요.", ic: "lifeorb" },                                     // 생명의구슬
  assaultvest: { n: "누비조끼", p: "item", price: 6000, hold: "vest", d: "특수방어가 1.5배가 되지만, 변화 기술은 쓸 수 없어요.", ic: "assaultvest" },                                                // 돌격조끼
  expertbelt: { n: "명인띠", p: "item", price: 4000, hold: "ebelt", d: "효과가 굉장한 기술이 1.2배 세져요.", ic: "expertbelt" },                                                                         // 달인의띠
  muscleband: { n: "장사머리띠", p: "item", price: 2000, hold: "mband", d: "물리 기술이 1.1배 세져요.", ic: "muscleband" },                                                                                // 힘의머리띠
  wiseglasses: { n: "선비안경", p: "item", price: 2000, hold: "wglass", d: "특수 기술이 1.1배 세져요.", ic: "wiseglasses" },                                                                              // 박식안경
  eviolite: { n: "싹수돌", p: "item", price: 5000, hold: "evio", d: "아직 진화할 수 있는 남켓몬이 지니면 방어와 특수방어가 1.5배가 돼요.", ic: "eviolite" },                                       // 진화의휘석
  quickclaw: { n: "날쌘발톱", p: "item", price: 2000, hold: "qclaw", d: "가끔(5번에 1번) 상대보다 먼저 움직일 수 있어요.", ic: "quickclaw" },                                                           // 선제공격손톱
  kingsrock: { n: "옥새조각", p: "item", price: 3000, hold: "kings", d: "공격이 맞으면 가끔(10번에 1번) 상대가 풀이 죽어 움직이지 못해요.", ic: "kingsrock" },                                         // 왕의징표석
  scopelens: { n: "천리경알", p: "item", price: 3000, hold: "scope", d: "급소에 맞히기 쉬워져요.", ic: "scopelens" },                                                                                    // 초점렌즈
  razorclaw: { n: "매발톱", p: "item", price: 3000, hold: "scope", d: "날카로운 매의 발톱이에요. 급소에 맞히기 쉬워져요.", ic: "razorclaw" },                                                          // 예리한손톱
  shellbell: { n: "조개방울", p: "item", price: 3000, hold: "sbell", d: "공격으로 준 데미지의 1/8만큼 HP를 회복해요.", ic: "shellbell" },                                                                 // 조개껍질방울
  blacksludge: { n: "검은뻘", p: "item", price: 4000, hold: "sludge", d: "독 타입이 지니면 턴마다 HP를 1/16 회복해요. 다른 타입은 오히려 1/8씩 깎여요.", ic: "blacksludge" },                         // 검은진흙
  lightclay: { n: "흰찰흙", p: "item", price: 3000, hold: "clay", d: "리플렉터와 빛의장막이 5턴 대신 8턴 동안 이어져요.", ic: "lightclay" },                                                           // 빛의점토
  heatrock: { n: "화롯돌", p: "item", price: 2000, hold: "wrock", wrock: "sun", d: "지닌 남켓몬이 부른 쾌청이 8턴 동안 이어져요.", ic: "heatrock" },                                                     // 뜨거운바위
  damprock: { n: "물먹은돌", p: "item", price: 2000, hold: "wrock", wrock: "rain", d: "지닌 남켓몬이 부른 비가 8턴 동안 이어져요.", ic: "damprock" },                                                    // 축축한바위
  smoothrock: { n: "매끈돌", p: "item", price: 2000, hold: "wrock", wrock: "sand", d: "지닌 남켓몬이 부른 모래바람이 8턴 동안 이어져요.", ic: "smoothrock" },                                             // 보송보송바위
  icyrock: { n: "서릿돌", p: "item", price: 2000, hold: "wrock", wrock: "hail", d: "지닌 남켓몬이 부른 싸라기눈이 8턴 동안 이어져요.", ic: "icyrock" },                                                    // 차가운바위
  foggyrock: { n: "운무석", p: "item", price: 2000, hold: "wrock", wrock: "fog", d: "지리산 운해를 머금은 돌이에요. 지닌 남켓몬이 부른 안개가 8턴 동안 이어져요.", ic: "foggyrock" },                  // (남켓몬만의 안개 날씨용)
  terrainextender: { n: "들판멍석", p: "item", price: 3000, hold: "tmat", d: "지닌 남켓몬이 깐 필드가 8턴 동안 이어져요.", ic: "terrainextender" },                                                      // 그라운드코트
  airballoon: { n: "방패연", p: "item", price: 2000, hold: "balloon", once: 1, d: "연을 타고 둥실 떠서 땅 타입 기술을 맞지 않아요. 공격을 맞으면 찢어져요.", ic: "airballoon" },                          // 풍선
  weaknesspolicy: { n: "분발부적", p: "item", price: 4000, hold: "wpolicy", once: 1, d: "효과가 굉장한 공격을 맞으면 공격과 특수공격이 크게 올라요. 한 번 쓰면 없어져요.", ic: "weaknesspolicy" },     // 약점보험
  blunderpolicy: { n: "만회부적", p: "item", price: 3000, hold: "bpolicy", once: 1, d: "기술이 빗나가면 스피드가 크게 올라요. 한 번 쓰면 없어져요.", ic: "blunderpolicy" },                              // 실수보험
  whiteherb: { n: "흰쑥", p: "item", price: 2000, hold: "wherb", once: 1, d: "떨어진 능력을 한 번 원래대로 되돌려요.", ic: "whiteherb" },                                                                  // 하양허브
  mentalherb: { n: "박하잎", p: "item", price: 2000, hold: "mherb", once: 1, d: "헤롱헤롱·도발·사슬묶기를 한 번 풀어 줘요.", ic: "mentalherb" },                                                         // 멘탈허브
  powerherb: { n: "산삼뿌리", p: "item", price: 3000, hold: "pherb", once: 1, d: "지리산 깊은 골의 산삼이에요. 모으는 기술을 한 번 기운을 모으지 않고 바로 써요.", ic: "powerherb" },               // 파워풀허브
  flameorb: { n: "불씨구슬", p: "item", price: 3000, hold: "forb", d: "턴이 끝날 때 지닌 남켓몬이 화상을 입어요. 근성 같은 특성과 함께 써요.", ic: "flameorb" },                                         // 화염구슬
  toxicorb: { n: "독구슬", p: "item", price: 3000, hold: "torb", d: "턴이 끝날 때 지닌 남켓몬이 맹독에 걸려요. 독이 오히려 힘이 되는 남켓몬에게!", ic: "toxicorb" },                                 // 맹독구슬
  bigroot: { n: "칡뿌리", p: "item", price: 2000, hold: "broot", d: "흡수하는 기술·뿌리박기·아쿠아링으로 회복하는 HP가 1.3배가 돼요.", ic: "bigroot" },                                              // 큰뿌리
  bindingband: { n: "조임끈", p: "item", price: 2000, hold: "bband", d: "조이기 같은 기술로 주는 턴마다의 데미지가 1/8에서 1/6으로 커져요.", ic: "bindingband" },                                         // 조임밴드
  gripclaw: { n: "갈고리손", p: "item", price: 2000, hold: "gclaw", d: "조이기 같은 기술이 늘 7턴 동안 이어져요.", ic: "gripclaw" },                                                                       // 끈기갈고리손톱
  safetygoggles: { n: "방진안경", p: "item", price: 3000, hold: "goggles", d: "모래바람·싸라기눈 데미지와 수면가루 같은 가루 기술을 막아요.", ic: "safetygoggles" },                                       // 방진고글
  protectivepads: { n: "솜토시", p: "item", price: 3000, hold: "pads", d: "몸에 닿는 공격을 해도 상대의 특성이나 밤송이투구에 다치지 않아요.", ic: "protectivepads" },                                // 방호패드
  heavydutyboots: { n: "나막신", p: "item", price: 4000, hold: "boots", d: "교체해 나올 때 스텔스록·독압정·끈적끈적네트를 밟지 않아요.", ic: "heavydutyboots" },                                       // 통굽부츠
  ejectbutton: { n: "물림방울", p: "item", price: 3000, hold: "eject", once: 1, d: "공격을 맞으면 방울을 흔들며 뒤로 물러나 다른 남켓몬과 바뀌어요.", ic: "ejectbutton" },                           // 탈출버튼
  redcard: { n: "퇴장패", p: "item", price: 3000, hold: "redcard", once: 1, d: "공격을 맞으면 빨간 패를 내밀어 상대를 물러나게 해요.", ic: "redcard" },                                                   // 레드카드
  utilityumbrella: { n: "지우산", p: "item", price: 3000, hold: "umbrella", d: "기름 먹인 한지 우산이에요. 비와 쾌청의 영향을 받지 않아요.", ic: "utilityumbrella" },                                   // 만능우산
  covertcloak: { n: "도롱이", p: "item", price: 3000, hold: "cloak", d: "짚으로 엮은 비옷이에요. 상대 기술의 추가 효과를 받지 않아요.", ic: "covertcloak" },                                         // 은밀망토
  clearamulet: { n: "맑은노리개", p: "item", price: 4000, hold: "amulet", d: "상대의 기술이나 특성으로 능력이 떨어지지 않아요.", ic: "clearamulet" },                                                   // 클리어참
  loadeddice: { n: "윷가락", p: "item", price: 3000, hold: "dice", d: "여러 번 치는 기술이 거의 늘 4~5번 맞아요.", ic: "loadeddice" },                                                                    // 속임수주사위
  throatspray: { n: "도라지청", p: "item", price: 2000, hold: "tspray", once: 1, d: "소리 기술을 쓰면 목이 트여 특수공격이 올라요. 한 번 쓰면 없어져요.", ic: "throatspray" },                            // 목스프레이
  widelens: { n: "돋보기알", p: "item", price: 2000, hold: "wlens", d: "기술의 명중률이 조금(1.1배) 올라요.", ic: "widelens" },                                                                           // 광각렌즈
  shedshell: { n: "허물껍질", p: "item", price: 2000, hold: "shed", d: "묶이거나 갇혀도 다른 남켓몬과 바꿀 수 있어요.", ic: "shedshell" },                                                                 // 아름다운허물
  punchingglove: { n: "주먹싸개", p: "item", price: 2000, hold: "glove", d: "펀치 기술이 1.1배 세지고, 펀치할 때 몸에 닿지 않아요.", ic: "punchingglove" },                                             // 펀치글러브
  absorbbulb: { n: "연근", p: "item", price: 1000, hold: "hitup", hitT: "물", hitB: { spa: 1 }, once: 1, d: "물 타입 공격을 맞으면 물을 머금어 특수공격이 올라요. 한 번 쓰면 없어져요.", ic: "absorbbulb" },        // 구근
  cellbattery: { n: "번개박", p: "item", price: 1000, hold: "hitup", hitT: "전기", hitB: { atk: 1 }, once: 1, d: "전기 타입 공격을 맞으면 공격이 올라요. 한 번 쓰면 없어져요.", ic: "cellbattery" },                  // 충전지
  luminousmoss: { n: "반딧이끼", p: "item", price: 1000, hold: "hitup", hitT: "물", hitB: { spd: 1 }, once: 1, d: "물 타입 공격을 맞으면 빛나며 특수방어가 올라요. 한 번 쓰면 없어져요.", ic: "luminousmoss" },     // 빛이끼
  snowball: { n: "눈뭉치", p: "item", price: 1000, hold: "hitup", hitT: "얼음", hitB: { atk: 1 }, once: 1, d: "얼음 타입 공격을 맞으면 공격이 올라요. 한 번 쓰면 없어져요.", ic: "snowball" },                       // 눈덩이
});
// 실전 도구 묶음(상점·문서용 차례)
const BATTLE_ITEMS_V241 = ["focussash", "focusband", "choiceband", "choicespecs", "choicescarf", "rockyhelmet", "lifeorb", "assaultvest", "expertbelt", "muscleband", "wiseglasses", "eviolite",
  "quickclaw", "kingsrock", "scopelens", "razorclaw", "shellbell", "blacksludge", "lightclay", "heatrock", "damprock", "smoothrock", "icyrock", "foggyrock", "terrainextender", "airballoon",
  "weaknesspolicy", "blunderpolicy", "whiteherb", "mentalherb", "powerherb", "flameorb", "toxicorb", "bigroot", "bindingband", "gripclaw", "safetygoggles", "protectivepads", "heavydutyboots",
  "ejectbutton", "redcard", "utilityumbrella", "covertcloak", "clearamulet", "loadeddice", "throatspray", "widelens", "shedshell", "punchingglove", "absorbbulb", "cellbattery", "luminousmoss", "snowball"];
// 싹수돌: 아직 진화할 수 있는가(레벨 진화 + 돌·지닌 도구 진화)
function canEvolveV241(k) {
  if (!canEvolveV241.S) { const S = new Set();
    for (const [key, m] of Object.entries(MON)) if (m.evo && m.evo.length) S.add(key);
    for (const it of Object.values(ITEMS)) { for (const x of Object.keys(it.evo || {})) S.add(x); for (const x of Object.keys(it.evoHold || {})) S.add(x); }
    canEvolveV241.S = S; }
  return canEvolveV241.S.has(k);
}
