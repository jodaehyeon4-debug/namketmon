// ===== 게임 상태: 주인공·파티·가방·도감·남켓몬 계산 =====
"use strict";
const MON = Object.fromEntries(DATA.mons.map(m => [m.k, m]));
const MONS = DATA.mons;
const MV = DATA.moves, AB = DATA.abil, TC = DATA.tc;
const STN = ["HP", "공격", "방어", "특수공격", "특수방어", "스피드"];
// 성격 (포켓몬 25가지와 같은 구조: 오르는 능력·내려가는 능력)
const NATURES = [["노력", 0, 0], ["외로움", 1, 2], ["용감", 1, 5], ["고집", 1, 3], ["개구쟁이", 1, 4], ["대담", 2, 1], ["온순", 0, 0], ["무사태평", 2, 5], ["장난꾸러기", 2, 3], ["촐랑", 2, 4],
  ["겁쟁이", 5, 1], ["성급", 5, 2], ["성실", 0, 0], ["명랑", 5, 3], ["천진난만", 5, 4], ["조심", 3, 1], ["의젓", 3, 2], ["냉정", 3, 5], ["수줍음", 0, 0], ["덜렁", 3, 4],
  ["차분", 4, 1], ["얌전", 4, 2], ["건방", 4, 5], ["신중", 4, 3], ["변덕", 0, 0]];
function expAt(gr, n) {
  if (n <= 1) return 0;
  if (gr === "ms") return Math.max(0, Math.floor(1.2 * n ** 3 - 15 * n * n + 100 * n - 140));
  if (gr === "s") return Math.floor(1.25 * n ** 3);
  if (gr === "f") return Math.floor(0.8 * n ** 3);
  return n ** 3;
}
function calcStats(m) {
  const b = MON[m.k].s, L = m.lv, nat = NATURES[m.nat];
  const st = [Math.floor((2 * b[0] + m.iv[0] + Math.floor(m.ev[0] / 4)) * L / 100) + L + 10];
  for (let i = 1; i < 6; i++) {
    let v = Math.floor((2 * b[i] + m.iv[i] + Math.floor(m.ev[i] / 4)) * L / 100) + 5;
    if (nat[1] !== nat[2]) { if (nat[1] === i) v = Math.floor(v * 1.1); if (nat[2] === i) v = Math.floor(v * 0.9); }
    st.push(v);
  }
  return st;
}
function movesAt(k, lv) {
  const L = MON[k].ml.filter(x => x[0] <= lv).sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [, id] of L) { if (!MV[id]) continue; const i = out.indexOf(id); if (i >= 0) out.splice(i, 1); out.push(id); }
  return out.slice(-4);
}
let UID = 1;
// v2.2 물 스타팅 마지막 진화(도감: 꾸무리 Lv36 → 낮에는 용꾸리, 밤에는 뚝꾸리). 데이터 빌드가 조건 붙은 진화를 빼서 꾸무리가
//   36이 넘어도 진화하지 않던 것을 고침. 도감의 '여의주·뚝배기를 지니고' 조건은 그 도구가 게임에 생길 때 더함(지금은 시간만)
if (MON.kkumuri && MON.yongkkuri && MON.ttukkkuri && !(MON.kkumuri.evo || []).length)
  MON.kkumuri.evo = [["yongkkuri", 36, "day"], ["ttukkkuri", 36, "night"]];
// v2.37 무결성 점검: 도감(도감151 v0.4)에 적힌 진화 방법 가운데 게임에 없던 것을 채움
//   여루 Lv38+밤 → 구미루 / 박알이 '친밀도 높을 때 레벨업' → 보물박 (도구 진화 넷은 ITEMS의 evo — js/chapter28.js)
if (MON.yeoru && MON.gumiru && !(MON.yeoru.evo || []).length) MON.yeoru.evo = [["gumiru", 38, "night"]];
if (MON.bakari && MON.bomulbak && !(MON.bakari.evo || []).length) MON.bakari.evo = [["bomulbak", "fr"]];
const FR_EVO = 160;           // 친밀도 진화 기준(실제 게임 220 — 아이들 플레이 시간에 맞춰 낮춤, 걸음·레벨업으로 오름)
function frUp(m, n) { m.fr = Math.max(0, Math.min(255, (m.fr ?? 70) + n)); }
function frLevel(m) { const f = m.fr ?? 70; frUp(m, f < 100 ? 5 : f < 200 ? 3 : 2); }   // 레벨업 때(실제 게임처럼 +5/+3/+2)
function evoFor(m) {          // 지금 진화할 수 있는 다음 모습(없으면 null)
  const day = typeof timeOfDay === "function" ? ["아침", "낮"].includes(timeOfDay()) : true;
  // v2.38 D17: 지닌 도구가 갈래를 정함(꾸무리 + 여의주 → 용꾸리, + 남원 뚝배기 → 뚝꾸리, 시각과 상관없이). 도구가 없으면 지금처럼 낮·밤
  const H = m.item && ITEMS[m.item] && ITEMS[m.item].evoHold;
  if (H && H[m.k]) { const he = (MON[m.k].evo || []).find(e => e[0] === H[m.k]); if (he && typeof he[1] === "number" && m.lv >= he[1]) return he[0]; }
  const e = (MON[m.k].evo || []).find(e => e[1] === "fr" ? (m.fr ?? 70) >= FR_EVO : (m.lv >= e[1] && (!e[2] || (e[2] === "day") === day)));
  return e ? e[0] : null;
}
function makeMon(k, lv, o = {}) {
  const sp = MON[k];
  const m = { uid: UID++, k, lv, nat: o.nat ?? rnd(25), iv: o.iv || [0, 0, 0, 0, 0, 0].map(() => rnd(32)), ev: [0, 0, 0, 0, 0, 0],
    gender: o.gender ?? (Math.random() < 0.5 ? "m" : "f"), ab: o.ab || pick(sp.ab[0]), status: null, slp: 0, tox: 0,
    ot: o.ot || null, met: o.met || "", metLv: lv, item: null, ball: o.ball || "namket", fr: 70 };
  if (o.shiny) m.shiny = true;   // v2.40 이로치
  m.exp = expAt(sp.gr, lv);
  m.st = calcStats(m); m.hp = m.st[0];
  m.moves = (o.moves || movesAt(k, lv)).map(id => ({ id, pp: MV[id].pp, max: MV[id].pp }));
  return m;
}
const mname = m => m.nick || MON[m.k].n;

// ---- 도구 ----
const POCKETS = [["item", "도구"], ["med", "회복약"], ["ball", "볼"], ["tm", "기술머신"], ["berry", "나무열매"], ["key", "중요한 물건"]];
// v1.4 도구: 성능은 4세대 포켓몬과 같게, 이름·그림은 남켓몬 것으로 (괄호 안 = 대응하는 도구, 문서에만)
// 효과 칸: heal(HP, "full"=전부) cure(["psn"...] / "all") conf(혼란도) revive(0.5/1) pp(10/"full") ppAll(모든 기술)
//          repel(걸음) escape(동굴 탈출) xs({atk:1}) crit(급소 단계) mist(능력 내림 막기 5턴) candy
//          ball(배율) bk(특수 볼 종류) / 지니기: hold("hp50"·"status"·"conf"·"pp0"·"left"·"tb") tb(타입) hpPct
const ITEMS = {
  // ---- 회복약 ----
  potion: { n: "고약", p: "med", price: 300, heal: 20, d: "상처에 붙이는 까만 고약이에요. 남켓몬 1마리의 HP를 20 회복해요.", ic: "goyak" },                       // 상처약
  superpotion: { n: "쌍화탕", p: "med", price: 700, heal: 50, d: "몸을 따뜻하게 하는 한약 차예요. HP를 50 회복해요.", ic: "ssanghwa" },                        // 좋은상처약
  hyperpotion: { n: "경옥고", p: "med", price: 1200, heal: 200, d: "꿀과 인삼으로 만든 귀한 보약이에요. HP를 200 회복해요.", ic: "gyeongok" },               // 고급상처약
  maxpotion: { n: "공진단", p: "med", price: 2500, heal: "full", d: "금박에 싼 동그란 환약이에요. HP를 모두 회복해요.", ic: "gongjin" },                       // 풀회복약
  fullrestore: { n: "청심환", p: "med", price: 3000, heal: "full", cure: "all", conf: 1, d: "마음까지 맑게 하는 환약이에요. HP와 상태 이상을 모두 회복해요.", ic: "cheongsim" }, // 회복약
  antidote: { n: "녹두환", p: "med", price: 100, cure: ["psn", "tox"], d: "독을 풀어 주는 녹두 환약이에요. 독 상태를 고쳐요.", ic: "nokdu" },                 // 해독제
  parlyzheal: { n: "마비풀이환", p: "med", price: 200, cure: ["par"], d: "저린 몸을 풀어 주는 환약이에요. 마비를 고쳐요.", ic: "mabi" },                        // 마비치료제
  awakening: { n: "박하사탕", p: "med", price: 250, cure: ["slp"], d: "화한 박하 향이 잠을 확 깨워요. 잠든 남켓몬을 깨워요.", ic: "bakha" },                  // 잠깨는약
  burnheal: { n: "오이즙", p: "med", price: 250, cure: ["brn"], d: "시원한 오이를 갈아 만든 즙이에요. 화상을 고쳐요.", ic: "oi" },                            // 화상치료제
  iceheal: { n: "생강차", p: "med", price: 250, cure: ["frz"], d: "몸을 데우는 따끈한 생강차예요. 얼음 상태를 녹여요.", ic: "saenggang" },                  // 얼음상태치료제
  fullheal: { n: "보약", p: "med", price: 600, cure: "all", conf: 1, d: "몸을 튼튼하게 하는 보약이에요. 상태 이상과 혼란을 모두 고쳐요.", ic: "boyak" },        // 만병통치제
  revive: { n: "인삼조각", p: "med", price: 1500, revive: 0.5, d: "기절한 남켓몬 1마리를 깨우고 HP를 절반 회복해요.", ic: "insam" },                         // 기력의조각
  maxrevive: { n: "산삼", p: "med", price: 4000, revive: 1, d: "깊은 산에서 자란 산삼이에요. 기절한 남켓몬의 HP를 모두 회복해요.", ic: "sansam" },        // 기력의덩어리
  ether: { n: "식혜", p: "med", price: 1200, pp: 10, d: "달콤한 식혜예요. 기술 하나의 PP를 10 회복해요.", ic: "sikhye" },                                    // PP에이드
  maxether: { n: "수정과", p: "med", price: 2000, pp: "full", d: "계피 향 수정과예요. 기술 하나의 PP를 모두 회복해요.", ic: "sujeong" },                     // PP회복
  elixir: { n: "약과", p: "med", price: 3000, pp: 10, ppAll: 1, d: "꿀을 바른 약과예요. 모든 기술의 PP를 10씩 회복해요.", ic: "yakgwa" },                    // PP에이더
  maxelixir: { n: "한과상자", p: "med", price: 4500, pp: "full", ppAll: 1, d: "여러 한과가 든 상자예요. 모든 기술의 PP를 모두 회복해요.", ic: "hangwa" },       // PP맥스
  freshwater: { n: "약수", p: "med", price: 200, heal: 50, d: "산에서 솟는 맑은 약수예요. HP를 50 회복해요.", ic: "yaksu" },                                 // 맛있는물
  sodapop: { n: "보리차", p: "med", price: 300, heal: 60, d: "구수한 보리차예요. HP를 60 회복해요.", ic: "bori" },                                          // 미네랄사이다
  lemonade: { n: "오미자차", p: "med", price: 350, heal: 80, d: "새콤달콤 오미자차예요. HP를 80 회복해요.", ic: "omijacha" },                                  // 후르츠밀크
  moomoomilk: { n: "산양유", p: "med", price: 500, heal: 100, d: "지리산 산양의 고소한 젖이에요. HP를 100 회복해요.", ic: "sanyang" },                       // 튼튼밀크
  // ---- 볼 ----
  namket: { n: "남켓볼", p: "ball", price: 200, ball: 1, d: "야생 남켓몬에게 던져서 잡는 볼이에요. 홍사·청사 비단 빛깔이에요.", ic: "ball_namket" },          // 몬스터볼
  silk: { n: "비단볼", p: "ball", price: 600, ball: 1.5, d: "남켓볼보다 잘 잡혀요. 보랏빛 비단에 금실 무늬예요.", ic: "ball_silk" },                           // 수퍼볼
  ok: { n: "옥볼", p: "ball", price: 1200, ball: 2, d: "비단볼보다 더 잘 잡히는 옥빛 볼이에요.", ic: "ball_ok" },                                             // 하이퍼볼
  gift: { n: "기념볼", p: "ball", price: 0, ball: 1, d: "남켓볼을 10개 사면 덤으로 주는 기념 볼이에요. 잘 잡히는 정도는 남켓볼과 같아요.", ic: "ball_gift" }, // 프레미어볼
  net: { n: "망태볼", p: "ball", price: 1000, ball: 1, bk: "net", d: "그물 망태기 무늬예요. 물·벌레 타입 남켓몬이 3배 잘 잡혀요.", ic: "ball_net" },           // 넷트볼
  dusk: { n: "달빛볼", p: "ball", price: 1000, ball: 1, bk: "dusk", d: "밤이나 동굴에서 던지면 3.5배 잘 잡혀요.", ic: "ball_dusk" },                            // 다크볼
  quick: { n: "번개볼", p: "ball", price: 1000, ball: 1, bk: "quick", d: "배틀이 시작되자마자 던지면 4배 잘 잡혀요.", ic: "ball_quick" },                       // 퀵볼
  heal: { n: "약초볼", p: "ball", price: 300, ball: 1, bk: "heal", d: "잡힌 남켓몬의 HP와 상태 이상이 모두 나아요.", ic: "ball_heal" },                         // 힐볼
  timer: { n: "해시계볼", p: "ball", price: 1000, ball: 1, bk: "timer", d: "배틀이 길어질수록 잘 잡혀요. 가장 잘 잡힐 때는 4배예요.", ic: "ball_timer" },          // 타이머볼
  repeat: { n: "또만남볼", p: "ball", price: 1000, ball: 1, bk: "repeat", d: "도감에 잡은 적이 있는 남켓몬이 3배 잘 잡혀요.", ic: "ball_repeat" },              // 리피드볼
  nest: { n: "둥지볼", p: "ball", price: 1000, ball: 1, bk: "nest", d: "레벨이 낮은 남켓몬일수록 잘 잡혀요.", ic: "ball_nest" },                                 // 네스트볼
  // ---- 도구 ----
  ssukhyang: { n: "쑥향", p: "item", price: 350, repel: 100, d: "쑥을 말려 피우는 향이에요. 100걸음 동안 약한 야생 남켓몬이 다가오지 않아요.", ic: "ssukhyang" },  // 벌레회피스프레이
  superrepel: { n: "진한쑥향", p: "item", price: 500, repel: 200, d: "더 진한 쑥향이에요. 200걸음 동안 약한 야생 남켓몬이 다가오지 않아요.", ic: "ssukhyang2" },  // 실버스프레이
  maxrepel: { n: "모깃불", p: "item", price: 700, repel: 250, d: "여름밤 모깃불 연기예요. 250걸음 동안 약한 야생 남켓몬이 다가오지 않아요.", ic: "mogit" },     // 골드스프레이
  escaperope: { n: "동아줄", p: "item", price: 550, escape: 1, d: "하늘에서 내려온 튼튼한 줄이에요. 동굴·숲 속에서 쓰면 들어온 곳으로 나가요.", ic: "donga" },  // 동굴탈출로프
  yeot: { n: "엿가락", p: "item", price: 4800, candy: 1, nobuy: 1, d: "남원 장날에 파는 쫀득한 엿이에요. 남켓몬 1마리의 레벨이 1 올라요.", ic: "yeot" },       // 이상한사탕
  xattack: { n: "공격부적", p: "item", price: 500, xs: { atk: 1 }, d: "배틀 중에 쓰면 나와 있는 남켓몬의 공격이 올라가요.", ic: "bujeok_atk" },              // 플러스파워
  xdefend: { n: "방어부적", p: "item", price: 550, xs: { def: 1 }, d: "배틀 중에 쓰면 나와 있는 남켓몬의 방어가 올라가요.", ic: "bujeok_def" },               // 디펜드업
  xspatk: { n: "특공부적", p: "item", price: 350, xs: { spa: 1 }, d: "배틀 중에 쓰면 나와 있는 남켓몬의 특수공격이 올라가요.", ic: "bujeok_spa" },             // 스페셜업
  xspdef: { n: "특방부적", p: "item", price: 350, xs: { spd: 1 }, d: "배틀 중에 쓰면 나와 있는 남켓몬의 특수방어가 올라가요.", ic: "bujeok_spd" },             // 스페셜가드
  xspeed: { n: "스피드부적", p: "item", price: 350, xs: { spe: 1 }, d: "배틀 중에 쓰면 나와 있는 남켓몬의 스피드가 올라가요.", ic: "bujeok_spe" },             // 스피드업
  xaccuracy: { n: "명중부적", p: "item", price: 950, xs: { accuracy: 1 }, d: "배틀 중에 쓰면 나와 있는 남켓몬의 명중률이 올라가요.", ic: "bujeok_acc" },         // 잘맞히기
  direhit: { n: "급소부적", p: "item", price: 650, crit: 1, d: "배틀 중에 쓰면 급소에 맞히기 쉬워져요.", ic: "bujeok_crit" },                                   // 크리티컬커터
  guardspec: { n: "수호부적", p: "item", price: 700, mist: 1, d: "배틀 중에 쓰면 5턴 동안 상대가 능력을 떨어뜨리지 못해요.", ic: "bujeok_mist" },              // 이펙트가드
  // ---- 지니게 하는 도구 (배틀에서 저절로) ----
  nurungji: { n: "누룽지", p: "item", price: 200, hold: "left", nobuy: 1, d: "지니게 하면 배틀 중 턴이 끝날 때마다 HP를 조금씩(1/16) 회복해요.", ic: "nurungji" },  // 먹다남은음식
  silkscarf: { n: "비단띠", p: "item", price: 100, hold: "tb", tb: "노말", nobuy: 1, d: "지니게 하면 노말 타입 기술이 1.2배 세져요.", ic: "tb_normal" },           // 실크스카프
  charcoal: { n: "참숯", p: "item", price: 100, hold: "tb", tb: "불꽃", nobuy: 1, d: "지니게 하면 불꽃 타입 기술이 1.2배 세져요.", ic: "tb_fire" },                // 목탄
  mysticwater: { n: "맑은이슬", p: "item", price: 100, hold: "tb", tb: "물", nobuy: 1, d: "지니게 하면 물 타입 기술이 1.2배 세져요.", ic: "tb_water" },            // 신비의물방울
  miracleseed: { n: "볍씨", p: "item", price: 100, hold: "tb", tb: "풀", nobuy: 1, d: "지니게 하면 풀 타입 기술이 1.2배 세져요.", ic: "tb_grass" },                // 기적의씨
  magnet: { n: "자석돌", p: "item", price: 100, hold: "tb", tb: "전기", nobuy: 1, d: "지니게 하면 전기 타입 기술이 1.2배 세져요.", ic: "tb_electric" },           // 자석
  nevermeltice: { n: "얼음구슬", p: "item", price: 100, hold: "tb", tb: "얼음", nobuy: 1, d: "지니게 하면 얼음 타입 기술이 1.2배 세져요.", ic: "tb_ice" },          // 녹지않는얼음
  blackbelt: { n: "샅바", p: "item", price: 100, hold: "tb", tb: "격투", nobuy: 1, d: "지니게 하면 격투 타입 기술이 1.2배 세져요.", ic: "tb_fighting" },          // 검은띠
  poisonbarb: { n: "쐐기털", p: "item", price: 100, hold: "tb", tb: "독", nobuy: 1, d: "지니게 하면 독 타입 기술이 1.2배 세져요.", ic: "tb_poison" },              // 독바늘
  softsand: { n: "고운흙", p: "item", price: 100, hold: "tb", tb: "땅", nobuy: 1, d: "지니게 하면 땅 타입 기술이 1.2배 세져요.", ic: "tb_ground" },                // 부드러운모래
  sharpbeak: { n: "솔개깃", p: "item", price: 100, hold: "tb", tb: "비행", nobuy: 1, d: "지니게 하면 비행 타입 기술이 1.2배 세져요.", ic: "tb_flying" },           // 예리한부리
  twistedspoon: { n: "놋숟가락", p: "item", price: 100, hold: "tb", tb: "에스퍼", nobuy: 1, d: "지니게 하면 에스퍼 타입 기술이 1.2배 세져요.", ic: "tb_psychic" },   // 휘어진스푼
  silverpowder: { n: "누에실", p: "item", price: 100, hold: "tb", tb: "벌레", nobuy: 1, d: "지니게 하면 벌레 타입 기술이 1.2배 세져요.", ic: "tb_bug" },            // 은빛가루
  hardstone: { n: "차돌", p: "item", price: 100, hold: "tb", tb: "바위", nobuy: 1, d: "지니게 하면 바위 타입 기술이 1.2배 세져요.", ic: "tb_rock" },                // 딱딱한돌
  spelltag: { n: "도깨비부적", p: "item", price: 100, hold: "tb", tb: "고스트", nobuy: 1, d: "지니게 하면 고스트 타입 기술이 1.2배 세져요.", ic: "tb_ghost" },      // 저주의부적
  dragonfang: { n: "용비늘", p: "item", price: 100, hold: "tb", tb: "드래곤", nobuy: 1, d: "지니게 하면 드래곤 타입 기술이 1.2배 세져요.", ic: "tb_dragon" },       // 용의이빨
  blackglasses: { n: "먹물", p: "item", price: 100, hold: "tb", tb: "악", nobuy: 1, d: "지니게 하면 악 타입 기술이 1.2배 세져요.", ic: "tb_dark" },                // 검은안경
  metalcoat: { n: "놋쇠조각", p: "item", price: 100, hold: "tb", tb: "강철", nobuy: 1, d: "지니게 하면 강철 타입 기술이 1.2배 세져요.", ic: "tb_steel" },          // 금속코트
  fairyfeather: { n: "꽃가루주머니", p: "item", price: 100, hold: "tb", tb: "페어리", nobuy: 1, d: "지니게 하면 페어리 타입 기술이 1.2배 세져요.", ic: "tb_fairy" },  // 요정의깃털
  // ---- 나무열매 (지니게 하면 배틀에서 저절로 먹음) ----
  jujube: { n: "대추", p: "berry", price: 20, heal: 10, hold: "hp50", nobuy: 1, d: "HP를 10 회복해요. 지니게 하면 HP가 절반 아래일 때 저절로 먹어요.", ic: "jujube" },         // 오렌열매
  mogwa: { n: "모과", p: "berry", price: 20, hpPct: 0.25, hold: "hp50", nobuy: 1, d: "HP를 최대의 1/4만큼 회복해요. 지니게 하면 HP가 절반 아래일 때 먹어요.", ic: "mogwa" }, // 자뭉열매
  aengdu: { n: "앵두", p: "berry", price: 20, cure: ["par"], hold: "status", nobuy: 1, d: "마비를 고쳐요. 지니게 하면 마비될 때 저절로 먹어요.", ic: "aengdu" },                // 버치열매
  odi: { n: "오디", p: "berry", price: 20, cure: ["slp"], hold: "status", nobuy: 1, d: "잠을 깨워요. 지니게 하면 잠들 때 저절로 먹어요.", ic: "odi" },                       // 유루열매
  boksunga: { n: "복숭아", p: "berry", price: 20, cure: ["psn", "tox"], hold: "status", nobuy: 1, d: "독을 고쳐요. 지니게 하면 독에 걸릴 때 저절로 먹어요.", ic: "boksunga" },  // 복슝열매
  sanddalgi: { n: "산딸기", p: "berry", price: 20, cure: ["brn"], hold: "status", nobuy: 1, d: "화상을 고쳐요. 지니게 하면 화상을 입을 때 저절로 먹어요.", ic: "sanddalgi" },   // 복분열매
  bae: { n: "배", p: "berry", price: 20, cure: ["frz"], hold: "status", nobuy: 1, d: "얼음 상태를 녹여요. 지니게 하면 얼어붙을 때 저절로 먹어요.", ic: "bae" },              // 배리열매
  gam: { n: "감", p: "berry", price: 20, conf: 1, hold: "conf", nobuy: 1, d: "혼란을 풀어요. 지니게 하면 혼란에 빠질 때 저절로 먹어요.", ic: "gam" },                  // 시마열매
  meoru: { n: "머루", p: "berry", price: 20, pp: 10, hold: "pp0", nobuy: 1, d: "기술 하나의 PP를 10 회복해요. 지니게 하면 PP가 다 떨어진 기술에 저절로 써요.", ic: "meoru" }, // 과사열매
  omija: { n: "오미자", p: "berry", price: 20, cure: "all", conf: 1, hold: "status", nobuy: 1, d: "다섯 가지 맛 열매예요. 상태 이상과 혼란을 모두 고쳐요.", ic: "omija" },   // 리샘열매
  // ---- 기술머신 ----
  tm09: { n: "기술머신09", p: "tm", price: 3000, nobuy: 1, tm: "venoshock", d: "베놈쇼크를 가르쳐요. 독 상태인 상대에게는 위력이 두 배가 되는 독 타입 기술이에요.", ic: "tm",
          tmTypes: ["독", "풀", "벌레", "물", "악", "땅"] },
  tm40: { n: "기술머신40", p: "tm", price: 3000, nobuy: 1, tm: "aerialace", d: "제비반환을 가르쳐요. 반드시 맞는 비행 타입 기술이에요.", ic: "tm",
          tmTypes: ["비행", "노말", "벌레", "풀", "격투", "악", "강철", "드래곤"] },
  tm48: { n: "기술머신48", p: "tm", price: 3000, nobuy: 1, tm: "round", d: "돌림노래를 가르쳐요. 노래를 이어 부르듯 소리로 공격하는 노말 타입 기술이에요.", ic: "tm",
          tmAll: true, tmNot: ["kkomulbae", "gochibae"] },
  tm71: { n: "기술머신71", p: "tm", price: 3000, nobuy: 1, tm: "drainingkiss", d: "드레인키스를 가르쳐요. 준 데미지의 반 넘게 HP를 되찾는 페어리 타입 기술이에요.", ic: "tm",
          tmTypes: ["페어리", "풀", "에스퍼", "벌레", "노말", "물", "비행"] },
  // ---- 중요한 물건 ----
  runshoes: { n: "운동화", p: "key", d: "엄마가 사 준 가벼운 운동화예요. X(B)를 누른 채 걸으면 달려요. 메뉴에서 늘 달리기를 켤 수 있어요.", ic: "shoes" },
  letter: { n: "조박사의 편지", p: "key", d: "조박사가 윤슬 박사에게 전해 달라고 맡긴 편지예요.", ic: "letter" },
  townmap: { n: "타운맵", p: "key", d: "용성지방 지도예요. 장소를 골라 설명과 실제 남원 이야기를 볼 수 있어요.", ic: "townmap" },
  expshare: { n: "학습장치", p: "key", d: "켜 두면 싸우지 않은 동료도 경험치를 절반 받아요. 가방에서 켜고 끌 수 있어요.", ic: "expshare" },
  watch: { n: "회중시계", p: "key", d: "시계방 할아버지가 준 시계예요. 실제 시각과 게임 시계 중 하나를 고르고, 게임 시계는 시간을 넘길 수 있어요.", ic: "watch" },
};
if (!MV.aerialace) delete ITEMS.tm40;
if (!MV.drainingkiss) delete ITEMS.tm71;
if (!MV.venoshock) delete ITEMS.tm09;
// v1.5 기술 설명 바로잡기: 자료에 '사용할 수 없는 기술' 문구(8세대)가 들어가 있던 9개
Object.entries({
  jumpkick: "높이 뛰어올라 상대를 걷어찬다. 빗나가면 자신이 데미지를 받는다.",
  karatechop: "날카로운 손날로 상대를 내리쳐서 공격한다. 급소에 맞기 쉽다.",
  mirrorshot: "갈고닦은 몸에서 빛의 에너지를 쏘아 공격한다. 상대의 명중률을 떨어뜨릴 때가 있다.",
  mudbomb: "단단한 진흙 덩어리를 쏘아 공격한다. 상대의 명중률을 떨어뜨릴 때가 있다.",
  mudsport: "주위를 진흙투성이로 만든다. 5턴 동안 전기 타입 기술의 위력이 약해진다.",
  ominouswind: "꺼림칙한 바람을 불어 보내 공격한다. 자신의 모든 능력이 올라갈 때가 있다.",
  signalbeam: "기묘한 빛을 쏘아 공격한다. 상대를 혼란시킬 때가 있다.",
  silverwind: "비늘가루를 바람에 실어 공격한다. 자신의 모든 능력이 올라갈 때가 있다.",
  skyuppercut: "높이 뛰어오르며 어퍼컷을 날린다. 하늘을 나는 상대에게도 맞는다.",
}).forEach(([k, d]) => { if (MV[k]) MV[k].d = d; });
// 만물상 물건: 어사패 수에 따라 늘어남 (4세대 프렌들리숍처럼)
function martStock() {
  const b = (G.badges || []).length, L = ["namket", "potion", "antidote", "parlyzheal", "awakening", "burnheal", "escaperope", "ssukhyang"];
  if (b >= 1) L.splice(1, 0, "silk"), L.splice(3, 0, "superpotion"), L.push("iceheal");
  if (b >= 3) L.splice(L.indexOf("superpotion") + 1, 0, "hyperpotion", "revive"), L.push("fullheal", "superrepel");
  if (b >= 5) L.splice(L.indexOf("silk") + 1, 0, "ok"), L.splice(L.indexOf("hyperpotion") + 1, 0, "maxpotion"), L.push("maxrepel");
  if (b >= 7) L.splice(L.indexOf("maxpotion") + 1, 0, "fullrestore");
  return L.filter(id => ITEMS[id]);
}
const SPECIAL_STOCK = ["xattack", "xdefend", "xspatk", "xspdef", "xspeed", "xaccuracy", "direhit", "guardspec", "freshwater", "sodapop", "lemonade"];

// ---- 진행 상태 ----
const G = {
  name: "", gender: "m", id: 0, money: 3000, party: [], box: [], bag: {}, flags: {}, seen: {}, caught: {},
  map: "class", x: 6, y: 6, dir: "up", heal: null, steps: 0, repel: 0, time: 0, badges: [],
  reset() { Object.assign(this, { name: "", gender: "m", id: 10000 + rnd(55535), money: 3000, party: [], box: [], boxes: null, boxCur: 0, pcItems: {}, bag: {}, flags: {}, seen: {}, caught: {}, map: "class", x: 6, y: 7, dir: "up", heal: null, steps: 0, repel: 0, time: 0, badges: [], clock: { mode: "real", min: 600 } }); },
  give(id, n = 1) { this.bag[id] = (this.bag[id] || 0) + n; },
  take(id, n = 1) { this.bag[id] = Math.max(0, (this.bag[id] || 0) - n); if (!this.bag[id]) delete this.bag[id]; },
  has: (id) => (G.bag[id] || 0) > 0,
  flag(k, v) { if (v === undefined) return !!this.flags[k]; this.flags[k] = v; },
  see(k) { this.seen[k] = 1; },
  catch(k) { this.seen[k] = 1; this.caught[k] = 1; },
  alive() { return this.party.filter(m => m.hp > 0); },
  healAll() { for (const m of this.party) { m.hp = m.st[0]; m.status = null; m.slp = 0; for (const mv of m.moves) mv.pp = mv.max; } },
  addMon(m) {
    m.ot = m.ot || this.name; m.otid = m.otid || this.id;
    this.catch(m.k);
    if (this.party.length < 6) { this.party.push(m); return "party"; }
    const bi = PCB.put(m); this.lastBox = bi; return bi >= 0 ? "box" : "full";
  },
  dump() { return JSON.stringify({ ...this, reset: undefined, give: undefined, take: undefined, flag: undefined }); },
};
function itemName(id) { return ITEMS[id] ? ITEMS[id].n : id; }
