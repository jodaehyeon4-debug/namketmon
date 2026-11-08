// ===== v2.59 뱀사골 뒤 이야기 다듬기 — '정표(情表)'와 '4월의 엽서' =====
// 사용자(2026-11-08): "뱀사골 이후 스토리 개발해. 스토리 개선안 및 복선 더 몰입되게 … 특히 김주열열사관에서 받은 4월의엽서가
//   나중에 중요기믹으로 … 남원에서 주웠던 물건들이(광한루, 만복사지 등) 나중에 중요히 쓰였으면 … 우리 문화가 널리 알려지도록."
// 1) 정표 여섯: 남원 여행 중 받는 물건마다 우리 이야기 하나 — 받을 때 "언젠가 꼭 쓰일 날이 온다"(복선)
//    옥가락지(광한루원 춘향제 · 춘향전) · 쪽빛 손수건(쪽빛마을 · 청출어람) · 은주발(만복사지 · 만복사저포기)
//    소리 부채(운봉 국악당 · 판소리) · 제비 박씨(미색 배움터 · 흥부전) · 4월의 엽서(김주열 열사 기념관 · 4·19 혁명)
// 2) 반야봉 뒤 월백마을: 윤슬 박사가 별돌을 살핌 → 정표가 별돌에 대답함 = 은직성은 '잊지 않은 이야기'로 깨어난다(복선)
// 3) 비색마을 주민 투표(새 사건): 금박재단이 마을회관에서 연 '섬진강 둔치 개발 찬반 투표'의 네 가지 잘못(선거의 4원칙)을 찾고
//    4월의 엽서를 보여 주면 마을 사람들이 "틀린 건 틀렸다고" 말함 → 실장 노부길 → 다시 하는 공정한 투표 · 투표 지시서(출두 증거)
// 4) 출두(chapter23): 찬향의 옥가락지 · 투표 지시서 · 운해룡의 빈 몸을 정표 여섯 이야기가 채움 → 은직성이 그 빛으로 오작교를 짬
//    소리 부채를 돌려 드림 · 청출어람 · 박씨 → 엔딩(chapter26): 마당에 박씨 · 제비꼬 · 책상 앞 4월의 엽서
// 사실(사회 6학년 '민주 정치'): 선거의 4원칙 = 보통·평등·직접·비밀 선거 / 춘향전 이별 때 춘향은 옥지환(옥가락지)을, 몽룡은 거울을 정표로
//   만복사저포기(김시습 『금오신화』 — 우리나라 첫 한문 소설집으로 꼽힘): 여인이 양생에게 은주발을 정표로 줌
//   판소리 = 2003년 유네스코 인류무형유산 · 4·19혁명 기록물 = 2023년 유네스코 세계기록유산 · 청출어람(『순자』 '푸른빛은 쪽에서 나왔지만 쪽보다 푸르다')
// 존중: 김주열 열사의 일은 패널 그대로(사실만) · 엽서는 마법이 아니라 '기억하고 함께 말하는 마음'으로만 쓰임
// chapter29 · namwon_v257 · ai_v258 뒤에 읽힘
"use strict";

// ---------------------------------------------------------------- 정표
const JP = [
  { id: "jp_ring", n: "옥가락지", ic: "jp_ring", from: "festival_done", place: "광한루원 춘향제",
    d: "춘향제에서 받은 옥가락지. 춘향이 몽룡에게 건넨 정표를 본떠 만들었대요. '변치 않는 마음'.",
    star: "옥가락지가 반짝였다.\f춘향과 몽룡이 '잊지 말자'며\n나눈 정표 — 변치 않는 마음.",
    read: ["옥가락지.\f춘향제에서 받은\n작은 옥가락지 한 쌍이다.",
      "「춘향전」에서 몽룡이 한양으로\n떠나던 날,\f춘향은 옥가락지를,\n몽룡은 거울을 정표로 나눴다.",
      "훗날 암행어사가 되어 돌아온\n몽룡은\f그 옥가락지로 자기가\n몽룡임을 알렸다고 한다."],
    hint: "옥가락지는 다홍 광한루원\n아주머니께(춘향제 기념품)" },
  { id: "jp_cloth", n: "쪽빛 손수건", ic: "jp_cloth", from: "dye_done", place: "쪽빛마을 쪽 염색 마당",
    d: "쪽빛마을 할머니가 쪽물을 여러 번 들인 손수건. '청출어람' — 쪽에서 나온 빛이 쪽보다 푸르다.",
    star: "쪽빛 손수건이 반짝였다.\f담그고 말리고 또 담가\n깊어진 푸른빛 — 청출어람.",
    read: ["쪽빛 손수건.\f쪽물에 여러 번 담갔다 말려\n깊은 남색이 되었다.",
      "쪽은 잎을 삭혀 푸른 물을 내는\n우리 전통 물감 풀이다.\f'청출어람'.\f푸른빛은 쪽에서 나왔지만\n쪽보다 더 푸르다는 말이다.",
      "배운 사람이 가르친 사람보다\n더 훌륭해진다는 뜻으로 쓴다."],
    hint: "쪽빛 손수건은 쪽빛마을\n쪽 염색 마당 할머니께" },
  { id: "jp_bowl", n: "은주발", ic: "jp_bowl", from: "jeopo_first", place: "만복사지",
    d: "만복사저포기 속 여인이 양생에게 건넨 은주발을 본뜬 그릇. 떠난 이와 남은 이를 이어 준 정표.",
    star: "은주발이 반짝였다.\f떠난 사람과 남은 사람을\n이어 준 그릇 — 기다린 마음.",
    read: ["은주발.\f만복사지 해설사님이 준\n뚜껑 덮인 은빛 그릇이다.",
      "김시습의 『금오신화』에 실린\n「만복사저포기」.\f우리나라 첫 한문 소설집으로\n꼽히는 책이다.",
      "외로운 양생은 만복사 부처님과\n저포 놀이를 해서 이기고\f한 여인을 만난다.\n헤어질 때 여인은 은주발을 준다.",
      "그 은주발 덕분에 양생은\n여인의 부모를 만나게 된다.\f정표는 사람과 사람을\n다시 잇는 물건이다."],
    hint: "은주발은 밤의 만복사지\n저포 놀이나 해설사님께" },
  { id: "jp_fan", n: "소리 부채", ic: "jp_fan", from: "ssuk_event_done", place: "쑥빛시티 국악당",
    d: "운봉 국악당에서 맡게 된 소리 어른의 부채. 소리꾼에게 부채는 또 하나의 손. 꼭 돌려 드리기로 했다.",
    star: "소리 부채가 촤라락 펼쳐졌다.\f소리는 가두면 멎고\n들어 주면 오래 산다.",
    read: ["소리 부채.\f소리 어른이 국악당 앞에서\n떨어뜨린 쥘부채다.",
      "판소리 소리꾼은 부채를 쥐고\f접었다 폈다 하며\n이야기 속 장면을 그려 낸다.",
      "운봉은 동편제의 '가왕'\n송흥록이 태어난 곳이다.\f판소리는 2003년 유네스코\n인류무형유산이 되었다.",
      "'다시 소리할 마음이 생기면\n그때 돌려받으마.'\f……소리 어른과의 약속이다."],
    hint: "소리 부채는 쑥빛시티\n국악당 소리 어른께" },
  { id: "jp_seed", n: "제비 박씨", ic: "jp_seed", from: "badge7", place: "미색 배움터",
    d: "희주 선생님이 준 박씨. 흥부가 고쳐 준 제비가 이듬해 봄 물어 온 박씨처럼 — 받은 은혜는 돌아온대요.",
    star: "제비 박씨가 반짝였다.\f다친 제비를 고쳐 준 마음은\n봄이 오면 다시 돌아온다.",
    read: ["제비 박씨.\f미색마을 박 밭에서 거둔\n박씨 세 알이다.",
      "「흥부전」에서 흥부는\n다리 다친 제비를 고쳐 준다.\f이듬해 봄, 제비는\n박씨 하나를 물고 돌아온다.",
      "남원 아영면에는 흥부 이야기가\n전해지는 마을이 있다.\f'돌아올 자리를 남겨 두세요.'\n……희주 선생님의 부탁이다."],
    hint: "제비 박씨는 미색 배움터\n희주 선생님께(박씨 어사패)" },
  { id: "jjy_card", n: "4월의 엽서", ic: "jp_card", from: "jjy_quiz", place: "김주열 열사 기념관",
    star: null,                         // 엽서는 방명록에 쓴 말로(jpCardStar)
    hint: "4월의 엽서는 비색마을\n김주열 열사 기념관에서" },
];
const JPN = Object.fromEntries(JP.map(t => [t.id, t]));
for (const t of JP) {
  if (t.id === "jjy_card") { if (ITEMS.jjy_card) ITEMS.jjy_card.ic = "jp_card"; continue; }
  ITEMS[t.id] = { n: t.n, p: "key", ic: t.ic, get d() { return t.id === "jp_fan" && G.flag("chuldu_done") ? "소리 어른이 '들어 주는 사람의 부채'라며 다시 건네준 쥘부채. 이제 내 정표가 되었다." : t.d; }, read: () => jpRead(t.id) };
}
ITEMS.vote_order = { n: "투표 지시서", p: "key", ic: "landdoc",
  d: "비색마을 투표 날 금박재단 실장이 떨어뜨린 종이. '찬성이 나오게 할 것' — 이사장 도장이 찍혀 있어요." };
const jpHas = id => !!(G.bag && G.bag[id]);
const jpList = () => JP.filter(t => jpHas(t.id));
const jpCount = () => jpList().length;
window.JP_V259 = { JP, jpHas, jpCount };

async function jpRead(id) {
  const t = JPN[id]; if (!t || !t.read) return;
  for (const s of t.read) await say(s);
  if (G.flag("chuldu_done")) await say("(만복사의 밤, 이 정표는\n오작교의 별 하나가 되었다.)");
  else if (G.flag("ys_byeoldol")) await say("(별돌이 이 정표에\n대답하듯 반짝였었다.)");
}
// 정표를 받는 장면(받을 때 늘 같은 '복선' 한 줄)
async function jpGive(id, lines = []) {
  if (jpHas(id)) return false;
  for (const s of lines) await say(s);
  await getItem(id);
  G.flag("jpgot_" + id, true);
  if (!G.flag("jp_first_note")) { G.flag("jp_first_note", true); await say("(정표 — 서로 잊지 말자고\n건네는 물건.\f가방의 '중요한 물건'에서\n이야기를 다시 읽을 수 있다.)"); }
  return true;
}
window.jpGive = jpGive;
// v2.59 전에 그 장면을 지나온 리포트: 장면이 끝난 깃발이 있으면 정표를 가방에 넣어 둠(그 장면에서 받았던 것으로)
function jpMigrate() {
  if (!G.bag) return;
  for (const t of JP) {
    if (t.id === "jjy_card") continue;
    const done = t.id === "jp_seed" ? (typeof hasBadge === "function" && hasBadge(7)) : G.flag(t.from);
    if (done && !jpHas(t.id) && !G.flag("jpgot_" + t.id)) { G.give(t.id, 1); G.flag("jpgot_" + t.id, true); }
  }
}
{ const ld0 = loadData; loadData = function (d) { ld0(d); try { jpMigrate(); } catch (e) {} }; }

// ---- 정표 빛 연출(화면 맨 위 층): 별돌을 가운데 두고 정표가 하나씩 떠오름 ----
let JP_OV = null, JP_FX = null;
function jpFxOn(mode) {
  JP_FX = { mode, t: 0, shown: [], center: mode === "stone" ? "byeoldol" : null };
  if (!JP_OV) { JP_OV = new Overlay(() => jpFxDraw()); Scenes.push(JP_OV); }
}
function jpFxOff() { JP_FX = null; if (JP_OV) { const o = JP_OV; JP_OV = null; Scenes.pop(o); } }
function jpFxDraw() {
  const F = JP_FX; if (!F) return; F.t++;
  const n = F.shown.length, cx = 128, cy = F.mode === "stone" ? 62 : 56;
  if (F.center && typeof drawItemIcon === "function") {
    const r = 18 + Math.sin(F.t / 9) * 2;
    g.globalAlpha = 0.35; g.fillStyle = "#c8d8ff"; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill(); g.globalAlpha = 1;
    drawItemIcon(F.center, cx - 12, cy - 12);
  }
  F.shown.forEach((id, i) => {
    const a = -Math.PI / 2 + (i - (Math.max(6, n) - 1) / 2) * (Math.PI / 6.2) * (F.mode === "stone" ? 1.6 : 1.9);
    const R = F.mode === "stone" ? 44 : 58, x = cx + Math.cos(a + Math.PI / 2) * R, y = cy + Math.sin(a + Math.PI / 2) * (R * 0.42) - 6 + Math.sin(F.t / 12 + i) * 2;
    g.globalAlpha = 0.45; g.fillStyle = F.mode === "stone" ? "#fff2b0" : "#fff8d8"; g.beginPath(); g.arc(x, y, 13 + Math.sin(F.t / 7 + i) * 1.5, 0, 7); g.fill(); g.globalAlpha = 1;
    if (typeof drawItemIcon === "function") drawItemIcon(id, Math.round(x - 12), Math.round(y - 12));
    if (F.mode === "bridge" && F.t % 40 < 20) { g.fillStyle = "#ffffff"; g.fillRect(Math.round(x + 9), Math.round(y - 11), 2, 2); }
  });
}
async function jpFxShow(id) { if (JP_FX && !JP_FX.shown.includes(id)) { JP_FX.shown.push(id); sfx("chime"); await frames(18); } }
window.jpFxOn = jpFxOn; window.jpFxOff = jpFxOff; window.jpFxShow = jpFxShow;
// 4월의 엽서: 방명록에 남긴 말이 별이 됨(남기지 않았으면 방명록에서 본 말)
function jpCardStar() {
  const notes = typeof JJY_NOTES !== "undefined" ? JJY_NOTES : ["잊지 않을게요."];
  const k = G.flags && G.flags.jjy_note; const w = k ? notes[k - 1] : "잊지 않겠습니다.";
  return `4월의 엽서가 반짝였다.\f흰 국화 한 송이.\n'함께 지키는 민주주의'.\f${k ? "방명록에 적은 말이" : "방명록에서 본 말이"}\n떠올랐다. '${w}'`;
}
window.jpCardStar = jpCardStar;

// ---------------------------------------------------------------- 정표를 받는 장면(각 장 끝에서 부름)
function nearFree(P, a) { return [[0, 1], [-1, 0], [1, 0], [0, -1]].map(([dx, dy]) => [P.x + dx, P.y + dy]).find(([x, y]) => !World.solidAt(x, y, a)) || [P.x, P.y + 1]; }
async function jpCome(a) {          // 사람을 주인공 옆으로 데려옴
  const P = World.player; if (!a) return;
  const [x, y] = nearFree(P, a);
  if (a.hidden) { a.x = x; a.y = y; a.hidden = false; sfx("door"); } else await walkPath(a, x, y);
  face(a, P); face(P, a);
}
async function jpLeave(a, tx, ty) { if (!a) return; if (tx != null) await walkPath(a, tx, ty); sfx("exit"); a.hidden = true; }
// ① 춘향제 끝(광한루원 동문 건너편): 월매 역 할머니
async function jpFestival() {
  if (jpHas("jp_ring")) return;
  const W = act("jp_wolmae"); if (!W) { await jpGive("jp_ring", ["춘향제 진행 할머니가\n옥가락지를 쥐여 주었다."]); return; }
  await jpCome(W);
  await say("할머니: 아이고, 장하다 장해!\f항아리에서 까작이를\n꺼내 주는 걸 다 봤단다.");
  await say("할머니: 나는 해마다 춘향제에서\n'월매' 역을 맡는 할미란다.\f춘향이 엄마 말이야.");
  await jpGive("jp_ring", ["할머니: 이건 춘향제 기념품이야."]);
  await say("할머니: 춘향이가 한양 가는 몽룡이한테\n건넨 정표가 옥가락지였지.");
  await say("할머니: 정표는 '잊지 말자'는\n약속이란다.\f잘 간직하렴.\f……정표는 꼭 필요한 날에\n다시 빛나는 법이거든.");
  await jpLeave(W);
}
// ② 쪽물 항아리 소동 끝: 쪽 염색 할머니
async function jpDye() {
  if (jpHas("jp_cloth")) return;
  const Gm = act("dye_gm"); if (Gm) face(Gm, World.player);
  await say("할머니: 꼬마야, 이것 좀\n받아 가렴.");
  await jpGive("jp_cloth", ["할머니: 쪽물을 여러 번 들인\n손수건이란다."]);
  await say("할머니: 미영 선생님 말 들었지?\n청출어람.\f쪽에서 나온 빛이\n쪽보다 더 푸르다.");
  await say("할머니: 언젠가 너를 가르친\n선생님한테 이걸 보여 드리렴.\f……선생님들은 그날을\n제일 기다리신단다.");
}
// ③ 만복사지 저포 놀이 첫 승리: 해설사
async function jpBowl(byGuide) {
  if (jpHas("jp_bowl")) return;
  const Gd = act("mb_guide"); if (Gd && !byGuide) await jpCome(Gd); else if (Gd) face(Gd, World.player);
  if (!byGuide) await say("해설사: 와, 돌부처님을 이겼네요!\f「만복사저포기」의\n양생처럼요.");
  await say("해설사: 양생은 저포 놀이에 이기고\n한 여인을 만났대요.\f헤어질 때 여인이 정표로 준 게\n은주발이었고요.");
  await jpGive("jp_bowl", ["해설사: 이건 그 은주발을 본떠\n만든 기념품이에요."]);
  await say("해설사: 떠난 사람과 남은 사람을\n이어 준 그릇.\f……소중한 날,\n꼭 꺼내 봐요.");
}
// ④ 운봉 국악당 습격 끝: 소리 어른이 떨어뜨린 부채 — 보름이 맡김
async function jpFan() {
  if (jpHas("jp_fan")) return;
  const B = act("sb_boreum"); if (B) face(B, World.player);
  await say("보름: 어? 할아버지가\n부채를 떨어뜨리고 가셨네!");
  await say("보름: 소리꾼한테 부채는\n또 하나의 손이래.");
  await jpGive("jp_fan", ["보름: 할아버지가 다시 소리하시는 날,\n네가 꼭 돌려 드려!\f……나는 부끄러워서\n못 드리겠어. 헤헤."]);
}
// ⑤ 희주 박씨 어사패 끝
async function jpSeed() {
  if (jpHas("jp_seed")) return;
  await jpGive("jp_seed", ["희주: 그리고 이건 선생님이\n미색마을 박 밭에서 받은 박씨예요."]);
  await say("희주: 흥부의 제비처럼,\n받은 마음은 언젠가 돌아온대요.\f……심을 자리가 생기면\n꼭 심어 봐요.");
}
Object.assign(window, { jpFestival, jpDye, jpBowl, jpFan, jpSeed });

// ---------------------------------------------------------------- 반야봉 뒤 월백마을: 윤슬 박사와 별돌
async function ysByeoldol() {
  const P = World.player, Y = act("wb_yunseul");
  if (!Y || G.flag("ys_byeoldol") || !G.flag("banya_event_done")) return;
  bgm("ojakgyo");
  await say("???: 아——! 내려왔군요!");
  await jpCome(Y);
  await say("윤슬 박사: 반야봉 위로 구름이\n소용돌이치는 걸 봤어요.\f걱정돼서 연구소에서\n달려왔지 뭐예요.");
  await say("윤슬 박사: ……별돌이요?\f대방이 '깨어나지도 못하는 돌'\n이라고 했다고요?\f잠깐 볼게요.");
  jpFxOn("stone");
  await say("별돌을 꺼내 윤슬 박사에게\n보여 주었다.");
  await say("윤슬 박사: ……돌 안에\n은하수 같은 실이 엉켜 있어요.");
  await say("윤슬 박사: 오작교 이야기 알아요?\f칠월 칠석이면 까마귀와 까치가\n은하수에 다리를 놓아요.\f일 년 내내 떨어져 있던\n견우와 직녀가 만나는 날이죠.");
  await say("윤슬 박사: 홍우성은 소를 몰던\n견우의 별,\f은직성은 베를 짜던\n직녀의 별이래요.");
  await say("윤슬 박사: 베를 짜려면\n실이 있어야겠죠?");
  await say("윤슬 박사: 옛사람들은 소중한 약속을\n물건에 담아 건넸어요.\f그걸 '정표'라고 해요.\n잊지 말자는 표시.");
  await say("윤슬 박사: 혹시 여행하면서\n받은 물건, 있어요?");
  const have = jpList();
  for (const t of have) { await jpFxShow(t.id); await say(`${J(t.n, "을")} 꺼냈다.\f별돌 속 실이\n반짝 대답했다!`); }
  if (have.length) await say("윤슬 박사: 보세요!\n별돌이 정표마다 대답해요.\f정표에 담긴 이야기가\n실이 되는 거예요.");
  await say("윤슬 박사: 잊히지 않은 이야기\n여섯 가닥.\f그게 다 모이면 은직성이\n깨어날지도 몰라요.");
  const miss = JP.filter(t => !jpHas(t.id));
  if (miss.length) {
    await say(`윤슬 박사: 지금은 ${have.length}가닥이에요.\f남은 정표는요……`);
    for (const t of miss) await say(t.hint);
    await say("윤슬 박사: 타운맵에서 하늘택시를\n부르면 금방 다녀와요.");
  }
  jpFxOff();
  await say("윤슬 박사: 참, 오다가 들었는데요.\f비색마을에서 금박재단이\n'주민 투표'를 연대요.\f섬진강 둔치를 개발할지\n말지 정하는 투표래요.");
  await say("윤슬 박사: 기념관 해설사님이\n걱정을 많이 하시던데……\f한번 가 봐 줄래요?");
  if (!jpHas("jjy_card")) await say("윤슬 박사: 기념관에서 주는\n'4월의 엽서'도 정표예요.\f비색마을에 가는 김에\n꼭 들러 봐요.");
  await say("윤슬 박사: 나는 연구소에 가서\n오작 전설을 더 찾아볼게요.\f별돌, 잘 부탁해요!");
  G.flag("ys_byeoldol", true);
  await jpLeave(Y, Y.x, Math.max(30, Y.y - 6));
  zoneBgm();
}

// ---------------------------------------------------------------- 비색마을 주민 투표(4월의 엽서)
if (typeof SMART_CLS !== "undefined") SMART_CLS["금박재단 실장"] = 2;
const BV_ON = () => G.flag("banya_event_done") && G.flag("bs_vote_on") && !G.flag("bs_vote_done");
const BV_PR = ["보통 선거", "평등 선거", "직접 선거", "비밀 선거"];
const BV_AG_B = { id: "bv_agent_b", cls: "금박재단 요원", name: "요원", spr: "agent", base: 60, music: "jaedan", bgm: "trainer",
  intro: "요원: 업무 방해입니다!\n절차대로 처리하겠습니다!", lose: "요원: ……서류에 없는\n항목입니다.",
  team: [["eosapae", 45], ["neogulmi", 46]] };
const BV_AG_D = { id: "bv_agent_d", cls: "금박재단 요원", name: "요원", spr: "agent", base: 60, music: "jaedan", bgm: "trainer",
  intro: "요원: 효도 서비스를\n방해하시면 곤란합니다!", lose: "요원: 도장이……\n다 흩어졌다……",
  team: [["gujeongwang", 46], ["malgupju", 46]] };
const BV_SIL = { id: "bv_siljang", cls: "금박재단 실장", name: "노부길", spr: "agent", base: 100, music: "jaedan", bgm: "trainer",
  intro: "노부길: 끝까지 방해하신다면\n이사장님 방식대로!", lose: "노부길: ……'모두에게 복을'이\n이렇게 어려울 줄이야.",
  team: [["takrankkuk", 46], ["eomnirang", 47], ["simsulbak", 49, { item: "mogwa" }]] };
const BV = {
  A: { pr: 0, who: ["bv_agA", "bv_deskA", "bv_youth"],
    scene: ["요원: 명부에는 이 마을에 땅을\n가진 분만 올렸습니다.\f세 들어 사시는 분들은\n투표하실 수 없습니다.",
      "청년: 저는 이 마을에서\n십 년을 살았는데요……\f매일 아침 섬진강 둑을\n걸어서 출근해요."],
    why: "보통 선거.\f정해진 나이가 된 사람이면\n누구나 투표할 수 있어요.\f땅이 있든 없든,\n가진 돈이 많든 적든요.",
    hint: "해설사: 음…… 다시 생각해 봐요.\f'누가' 투표할 수 있는지가\n문제 아닐까요?",
    voice: ["청년: ……맞아요.\n강은 땅 주인만의 것이 아니에요.\f저도 이 마을 사람이에요!", "요원: 그, 그건\n본사 방침이……",
      "이장: 명부는 마을 사람\n모두로 다시 쓰겠소!"] },
  B: { pr: 1, who: ["bv_agB", "bv_deskB", "bv_member"], battle: BV_AG_B,
    scene: ["요원: 금박재단 회원 카드가\n있으시면 투표용지 세 장!\f오늘만 드리는 혜택입니다~",
      "아저씨: 회원 카드를 받았더니\n투표용지를 석 장이나 주네……"],
    why: "평등 선거.\f누구나 똑같이\n한 사람에 한 표예요.\f어떤 사람의 표가 더 무거우면\n공정하지 않지요.",
    hint: "해설사: 한 사람이 표를\n몇 장 가졌는지 세어 봐요.",
    voice: ["아저씨: ……사실 나도 찜찜했어.\f한 사람은 한 표지!\n나머지 두 장은 돌려주겠네."] },
  C: { pr: 3, who: ["bv_booth", "bv_grandpa", "bv_agC"],
    scene: ["요원: 어르신, 도장 찍는 걸\n도와 드릴게요~\f어디에 찍으시나……\n쓱.",
      "할아버지: 자네가 그렇게 들여다보면\n내가 어디에 찍겠나……"],
    why: "비밀 선거.\f누구를 골랐는지는\n나만 알아야 해요.\f누가 보고 있으면\n마음대로 고를 수 없으니까요.",
    hint: "해설사: 기표소 안을\n누가 들여다보고 있죠?",
    voice: ["할아버지: 내 마음은\n나만 아는 거요.\f저리 비키시오!", "요원: 히, 히익……"] },
  D: { pr: 2, who: ["bv_box", "bv_agD", "bv_granny"], battle: BV_AG_D,
    scene: ["요원: 바쁘신 어르신들 대신\n제가 다 찍어 드렸습니다.\f도장도 미리 받아 놨고요.\n효도 서비스지요!",
      "요원 손에 도장 꾸러미와\n투표용지 한 다발이 들려 있다.",
      "할머니: 나는 그런 걸\n맡긴 적이 없는데……"],
    why: "직접 선거.\f내 표는 내가 직접\n찍어야 해요.\f다른 사람이 대신 찍으면\n내 목소리가 아니지요.",
    hint: "해설사: 저 투표용지들,\n누가 찍었나요?",
    voice: ["할머니: 그 엽서……\n기념관 엽서로구나.",
      "할머니: 해마다 4월이면\n흰 국화를 들고 갔어요.\f잊지 않으려고요.",
      "할머니: ……그런데 잊지 않는 것만으로는\n모자랐네요.\f틀린 건 틀렸다고\n말해야지요!"] },
};
const bvSolved = k => G.flag("bv_" + k);
async function bvShowCard() {
  await ask("4월의 엽서를 꺼내\n보여 줄까?", ["보여 준다"]);
  sfx("select");
  if (!G.flag("bv_card1")) { G.flag("bv_card1", true); await say("4월의 엽서를 꺼내 보였다.\f흰 국화 한 송이.\n'함께 지키는 민주주의'."); }
  else await say("4월의 엽서를 꺼내 보였다.");
}
async function bvStation(k) {
  const S = BV[k], P = World.player;
  if (!BV_ON()) return;
  if (!G.flag("bs_vote_in")) return bvIntro();
  if (bvSolved(k)) { await say(k === "A" ? "청년: 이제 명부에 제 이름도\n있어요!" : k === "B" ? "아저씨: 한 사람 한 표!\n……이게 맞지." : k === "C" ? "할아버지: 기표소 안은\n이제 조용하구먼." : "할머니: 내 표는\n내가 찍을 거예요."); return; }
  if (!jpHas("jjy_card")) { await say(S.scene[0]); await say("해설사: ……저기 이상하죠?\f그런데 왜 이상한지 말하려면\n기념관 패널을 읽고 와야 해요.\f(김주열 열사 기념관 —\n패널 넷 → 해설사의 물음)"); return; }
  if (!G.flag("bvq_" + k)) {
    for (const s of S.scene) await say(s);
    const v = await quizAsk("이 투표는 선거의 네 가지 원칙\n가운데 무엇을 어겼을까?", BV_PR, ["잘 모르겠어"]);
    if (v !== S.pr) { await say(S.hint); return; }
    sfx("select"); await say(S.why);
    G.flag("bvq_" + k, true);
    await bvShowCard();
    for (const s of S.voice) await say(s);
  }
  if (S.battle && !G.flag("bvb_" + k)) {
    const ag = act(S.who.find(id => id.startsWith("bv_ag")));
    const r = await trainerBattle({ x: ag ? ag.x : P.x, y: ag ? ag.y : P.y - 1, dir: ag ? ag.dir : "down", trainer: S.battle }, false);
    if (r !== "win") return;
    G.flag("bvb_" + k, true);
    await say(k === "B" ? "요원: ……본사에\n보고하겠습니다." : "요원: 투표용지 다발이\n바닥에 흩어졌다……");
  }
  if (k === "C") { const ag = act("bv_agC"); if (ag) { await walkPath(ag, 11, 2); ag.dir = "down"; } }
  if (k === "D") { const ag = act("bv_agD"); if (ag) await emote(ag, "dots", 24); }
  G.flag("bv_" + k, true);
  const n = ["A", "B", "C", "D"].filter(bvSolved).length;
  sfx("chime");
  if (n < 4) { await say(`(이상한 곳을 ${n}군데 찾았다.\n남은 곳: ${4 - n}군데)`); return; }
  await bvFinal();
}
async function bvIntro() {
  const P = World.player, IJ = act("bv_ijang"), GD = act("bv_guide");
  if (G.flag("bs_vote_in") || !BV_ON()) return;
  await say("마을회관 안이 사람들로\n북적인다.\f벽에 큰 벽보가 붙어 있다.\n'섬진강 둔치 개발 찬반 주민 투표'");
  if (IJ) face(IJ, P);
  await say("이장: 오, 해설사님이 말한\n그 학생이구나.\f나는 비색마을 이장이다.");
  await say("이장: 투표는 마을 일을 모두가\n함께 정하는 방법이지.\f그래서 꼭 지켜야 하는\n네 가지 원칙이 있단다.");
  await say("[1] 보통 선거\f정해진 나이가 되면\n누구나 투표할 수 있다.");
  await say("[2] 평등 선거\f누구나 똑같이\n한 사람에 한 표.");
  await say("[3] 직접 선거\f내 표는\n내가 직접 찍는다.");
  await say("[4] 비밀 선거\f누구를 골랐는지는\n나만 안다.");
  await say("이장: 그런데 오늘 투표는\n뭔가 이상해.\f네 군데나 냄새가 나는데,\n내 눈으로는 다 못 찾겠구나.");
  await say("이장: 투표소를 둘러보고\n이상한 곳을 찾으면\f그 사람들에게\n말을 걸어 보렴.");
  if (GD) face(GD, P);
  if (!jpHas("jjy_card")) await say("해설사: 아, 기념관 엽서는\n아직 못 받았죠?\f기념관 패널 넷을 읽고\n물음에 답하면 줄 거예요.\f공정한 선거가 왜 소중한지 알면\n무엇이 잘못됐는지 보여요.");
  else await say("해설사: 기념관 엽서, 가져왔죠?\f'틀린 건 틀렸다고'.\n……함께 찾아봐요.");
  G.flag("bs_vote_in", true);
}
async function bvGuideTalk() {
  if (!G.flag("bs_vote_in")) return bvIntro();
  const left = ["A", "B", "C", "D"].filter(k => !bvSolved(k));
  if (!jpHas("jjy_card")) { await say("해설사: 기념관은 마을 북쪽,\n큰길 서쪽이에요.\f패널 넷을 읽고 오면\n물음 세 가지를 낼게요."); return; }
  const tip = { A: "명부 탁자(왼쪽)", B: "투표용지 탁자", C: "기표소", D: "투표함(오른쪽)" };
  await say(`해설사: 남은 곳은 ${left.length}군데.\f${left.map(k => tip[k]).join(", ")}\n……살펴봐요.`);
}
async function bvFinal() {
  const P = World.player, IJ = act("bv_ijang"), GD = act("bv_guide"), SJ = act("bv_siljang"), GN = act("bv_granny");
  if (G.flag("bs_vote_done")) return;
  bgm("jaedan");
  if (IJ) face(IJ, P);
  await say("이장: 명부, 투표용지, 기표소,\n투표함…… 네 군데 모두!");
  await say("이장: 이 투표는 무효요!");
  sfx("excl");
  await say("마을 사람들: 무효다!\n다시 하자!");
  if (SJ && (SJ.hidden || !G.flag("bv_sil_met"))) { SJ.hidden = false; SJ.x = 4; SJ.y = 6; await walkPath(SJ, 4, 4); face(SJ, P); }
  G.flag("bv_sil_met", true);
  await say("???: 무효라니요?");
  await say("노부길: 금박재단 실장\n노부길입니다.\f오늘 투표는 서류상\n아무 문제 없는 '절차'였습니다.");
  if (GD) face(GD, SJ || P);
  await say("해설사: 서류에 없는 게 있죠.\f이 마을 사람들의\n목소리요.");
  await say("노부길: ……어린이는 투표권도\n없지 않습니까!");
  if (GN) face(GN, SJ || P);
  await say("할머니: 이 아이는 투표하러 온 게\n아니라, 지키러 왔어요.");
  const r = await trainerBattle({ x: SJ ? SJ.x : P.x, y: SJ ? SJ.y : P.y - 1, dir: SJ ? SJ.dir : "down", trainer: BV_SIL }, false);
  if (r !== "win") return;
  bgm("bisaek");
  await say("노부길: ……이사장님께\n뭐라고 보고한담.");
  if (SJ) { await walkPath(SJ, 4, 6); }
  await say("노부길이 허둥지둥 나가다\n종이 한 장을 떨어뜨렸다.");
  if (SJ) SJ.hidden = true;
  await getItem("vote_order");
  await say("'섬진강 둔치 투표 —\n찬성이 나오게 할 것.'\f그 아래 금박재단 이사장\n도장이 꾹 찍혀 있다.");
  if (IJ) face(IJ, P);
  await say("이장: 이건 이사장 도장이잖아?\f……그 종이, 네가 잘 가지고\n있거라. 꼭 쓰일 날이 올 게다.");
  await say("이장: 자, 다시 합시다.\n이번엔 제대로!");
  await say("명부에는 마을 사람 모두.\n투표용지는 한 사람에 한 장.\f자기 표는 자기가 직접,\n기표소 안에는 혼자서.");
  await fadeOut(12);
  for (const id of ["bv_agA", "bv_agB", "bv_agC", "bv_agD"]) { const a = act(id); if (a) a.hidden = true; }
  sfx("select"); await wait(300); sfx("select"); await wait(300); sfx("select");
  await fadeIn(12);
  await say("마을 사람들이 한 사람씩\n기표소에 들어갔다……");
  await say("이장: 개표 결과를 알리겠소!\f찬성 6표, 반대 31표.");
  await Audio2.jingle("jg_badge");
  await say("이장: 섬진강 둔치는\n마을 사람들 뜻대로\f지금처럼 두기로 했소!");
  if (GD) face(GD, P);
  await say("해설사: 김주열 열사가 지키려던 게\n'공정한 선거'였다고 했죠?\f오늘은 이 마을이\n그걸 함께 지켰어요.");
  if (GN) face(GN, P);
  await say("할머니: 해마다 꽃만 들고 갔는데……\f오늘은 목소리를 냈네요.\n꽃보다 크게.");
  const Y = act("bv_youth"); if (Y) face(Y, P);
  await say("청년: 투표는 숫자를 세는 게\n아니라 목소리를 세는 거구나.");
  await say("엽서 뒷면의 글씨가\n오늘따라 또렷해 보였다.\f'함께 지키는 민주주의'.");
  if (IJ) face(IJ, P);
  await say("이장: 고맙다.\n이건 마을의 마음이다.");
  await getItem("yeot", 2);
  await say("해설사: 오늘 일,\n기념관 방명록에도 적어 둘게요.\f'함께 지켰다'고.");
  G.flag("bs_vote_done", true);
  zoneBgm();
}
async function bvCall() {
  const P = World.player, Gd = act("bs_vguide");
  if (!G.flag("banya_event_done") || G.flag("bs_vote_on") || G.flag("chuldu_done")) return;
  G.flag("bs_vote_on", true);
  await say("???: 학생! 잠깐만요!");
  await emote(P, "excl", 20);
  await jpCome(Gd);
  await say(G.flag("jjy_quiz") ? "해설사: 기념관에서 엽서 받아 간\n그 학생 맞죠?" : "해설사: 나는 김주열 열사\n기념관 해설사예요.");
  await say("해설사: 지금 마을회관에서\n금박재단이 투표를 하고 있어요.\f'섬진강 둔치 개발\n찬반 주민 투표'래요.");
  await say("해설사: 오늘 아침에 갑자기\n벽보가 붙었어요.\f그런데 투표하고 나온 분들\n얼굴이 다들 찜찜해요.");
  await say("해설사: 이장님이 투표가 공정한지\n함께 살펴볼 사람을 찾으세요.\f……같이 가 줄래요?");
  if (!jpHas("jjy_card")) await say("해설사: 아, 그 전에!\f기념관 패널 넷을 먼저\n읽고 오면 좋겠어요.\f공정한 선거가 왜 소중한지 알면\n무엇이 잘못됐는지 보이거든요.");
  await say("해설사: 마을회관에서\n기다릴게요!");
  await jpLeave(Gd, 6, 19);
}
// 기표소·투표함·탁자 그림(필드 칸 위에)
const bvDesk = (px, py) => { rect(px + 1, py + 4, 14, 2, "#b07848"); rect(px + 1, py + 6, 14, 6, "#8a5a32"); rect(px + 2, py + 12, 2, 3, "#5a3a20"); rect(px + 12, py + 12, 2, 3, "#5a3a20");
  rect(px + 3, py + 2, 6, 3, "#f4f0e0"); rect(px + 4, py + 3, 4, 1, "#a0a0a8"); rect(px + 10, py + 2, 3, 3, "#f4f0e0"); rect(px, py + 4, 1, 8, "#2a2230"); rect(px + 15, py + 4, 1, 8, "#2a2230"); };
const bvBooth = (px, py) => { rect(px + 1, py - 9, 14, 24, "#2a2230"); rect(px + 2, py - 8, 12, 22, "#d8dce4"); rect(px + 2, py - 8, 12, 3, "#3a62c8");
  rect(px + 3, py - 4, 10, 17, "#f6f6f2"); for (let i = 0; i < 3; i++) rect(px + 5 + i * 3, py - 4, 1, 17, "#c8ccd4"); rect(px + 4, py + 13, 3, 2, "#5a3a20"); rect(px + 9, py + 13, 3, 2, "#5a3a20"); };
const bvBox = (px, py) => { rect(px + 2, py + 2, 12, 13, "#2a2230"); rect(px + 3, py + 3, 10, 11, "#cfd8e8"); rect(px + 3, py + 3, 10, 2, "#aab6cc");
  rect(px + 5, py + 3, 6, 1, "#30343c"); rect(px + 7, py + 8, 2, 2, "#c83a30"); rect(px + 4, py + 6, 1, 6, "#eef2f8"); };
(function attachVote() {
  const BS = MAPS.bisaek, HB = MAPS.hall_bisaek; if (!BS || !HB) return;
  BS.npcs.push({ id: "bs_vguide", x: 8, y: 11, spr: "woman", dir: "down", move: "fixed", hidden: true, show: () => G.flag("banya_event_done") && !G.flag("bs_vote_on") });
  BS.areas = (BS.areas || []).concat([{ x0: 0, y0: 0, x1: 43, y1: 33, cond: () => G.flag("banya_event_done") && !G.flag("bs_vote_on") && !G.flag("chuldu_done"), run: bvCall }]);
  for (const n of HB.npcs) { const s0 = n.show; n.show = () => !BV_ON() && (!s0 || s0()); }
  const V = (id, x, y, o) => ({ id, x, y, dir: "down", move: "fixed", show: BV_ON, ...o });
  const st = k => () => bvStation(k);
  HB.npcs.push(
    V("bv_ijang", 3, 5, { spr: "man", dir: "up", talk: async () => { if (!G.flag("bs_vote_in")) return bvIntro(); const n = ["A", "B", "C", "D"].filter(bvSolved).length; if (n >= 4 && !G.flag("bs_vote_done")) return bvFinal(); await say(`이장: ${n}군데 찾았구나!\f남은 곳도 부탁한다.`); } }),
    V("bv_guide", 5, 5, { spr: "woman", dir: "up", talk: bvGuideTalk }),
    V("bv_agA", 1, 2, { spr: "agent", talk: st("A") }), V("bv_deskA", 1, 3, { special: bvDesk, talk: st("A") }), V("bv_youth", 2, 3, { spr: "student", dir: "left", talk: st("A") }),
    V("bv_agB", 6, 2, { spr: "agent", talk: st("B") }), V("bv_deskB", 6, 3, { special: bvDesk, talk: st("B") }), V("bv_member", 7, 3, { spr: "man", dir: "left", talk: st("B") }),
    V("bv_booth", 9, 2, { special: bvBooth, talk: st("C") }), V("bv_grandpa", 9, 3, { spr: "oldman", dir: "up", talk: st("C") }), V("bv_agC", 10, 3, { spr: "agent", dir: "left", talk: st("C") }),
    V("bv_box", 12, 3, { special: bvBox, talk: st("D") }), V("bv_agD", 13, 3, { spr: "agent", dir: "left", talk: st("D") }), V("bv_granny", 13, 4, { spr: "oldwoman", dir: "up", talk: st("D") }),
    V("bv_vil1", 8, 5, { spr: "woman", dir: "up", talk: () => say(G.flag("bv_A") || G.flag("bv_B") ? "아주머니: 그래, 그거야!\n나도 이상하다 했어!" : "아주머니: 투표하러 왔는데\n어째 마음이 찜찜하네.") }),
    V("bv_vil2", 10, 5, { spr: "oldman", dir: "up", talk: () => say("할아버지: 섬진강 둔치는\n아이들 놀이터였지.\f……물어보지도 않고\n정해 버리면 쓰나.") }),
    V("bv_siljang", 4, 6, { spr: "agent", dir: "up", hidden: true, talk: () => G.flag("bv_sil_met") && !G.flag("bs_vote_done") ? bvFinal() : null }),
  );
  HB.areas = (HB.areas || []).concat([{ x0: 0, y0: 2, x1: 13, y1: 6, cond: () => BV_ON() && !G.flag("bs_vote_in"), run: bvIntro }]);
  // 벽 게시판: 투표 날엔 선거의 4원칙 벽보
  HB.checks = (HB.checks || []).map(c => (c[1] === 1 && (c[0] === 8 || c[0] === 9)) ? [c[0], c[1], (f => () => BV_ON() ? say("벽보: '선거의 네 가지 원칙'\f보통 선거 · 평등 선거\n직접 선거 · 비밀 선거") : (typeof f === "function" ? f() : say(f)))(c[2])] : c);
})();
Object.assign(window, { bvCall, bvIntro, bvStation, bvFinal, ysByeoldol });

// ---------------------------------------------------------------- 정표를 놓친 리포트도 다시 받을 수 있게(그 자리 사람에게)
(function attachGivers() {
  const wrapTalk = (map, find, fn, after) => { const M = MAPS[map]; if (!M) return; const n = M.npcs.find(find); if (!n) return;
    const t0 = n.talk, orig = (...args) => typeof t0 === "function" ? t0(...args) : t0 ? say(t0) : null;
    n.talk = after ? async (...args) => { await orig(...args); await fn(...args); }      // 원래 대화 뒤에 덧붙임(선물 대화 등은 그대로)
      : async (...args) => { if (await fn(...args)) return; return orig(...args); }; };   // 원래 talk(a)에 넘기던 사람(a)을 그대로   // 원래 talk(a)에 넘기던 사람(a)을 그대로
  // 춘향제: 월매 역 할머니(장면용) · 광한루 아주머니(놓쳤을 때)
  if (MAPS.world) MAPS.world.npcs.push({ id: "jp_wolmae", x: 23, y: 8, spr: "oldwoman", dir: "down", move: "fixed", hidden: true, show: () => !jpHas("jp_ring") && !G.flag("festival_done") });
  wrapTalk("world", n => n.x === 5 && n.y === 9 && !n.trainer, async () => {
    if (!G.flag("festival_done") || jpHas("jp_ring")) return;
    await say("아주머니: 어머, 춘향제 날\n까작이를 구해 준 아이구나!\f월매 할머니가 이걸\n꼭 전해 달라고 하셨어.");
    await jpGive("jp_ring", []);
    await say("아주머니: 춘향이가 몽룡이한테\n건넨 정표가 옥가락지였대.\f……정표는 꼭 필요한 날\n다시 빛난다나?");
  }, true);
  wrapTalk("jjok", n => n.id === "dye_gm", async () => { if (!G.flag("dye_done") || jpHas("jp_cloth")) return; await jpDye(); }, true);
  wrapTalk("manboksa", n => n.id === "mb_guide", async () => {
    if (jpHas("jp_bowl") || !G.flag("banya_event_done")) return false;
    await say("해설사: 윤슬 박사님한테 들었어요.\n별돌 이야기요.");
    await jpBowl(true); return true; });
  wrapTalk("gugak", n => n.id === "gk_sori", async () => {
    if (!G.flag("ssuk_event_done")) return false;
    if (!jpHas("jp_fan")) { await say("소리 어른: ……국악당 앞에\n부채를 떨어뜨렸더구나."); await jpGive("jp_fan", ["소리 어른: 그 부채, 네가 맡아 두거라."]); }
    else await say("소리 어른: ……그 부채는 아직\n네가 갖고 있거라.");
    await say("소리 어른: 내가 다시 소리할\n마음이 생기면,\f그때 받으마.");
    return true; });
  wrapTalk("gym7", n => n.id === "heeju7", async () => { if (!(typeof hasBadge === "function" && hasBadge(7)) || jpHas("jp_seed")) return; await say("희주: 아, 깜빡했네요."); await jpSeed(); }, true);
  // 기념관 해설사: 투표 뒤
  wrapTalk("jjy_hall", n => n.id === "jjy_guide", async () => {
    if (!G.flag("bs_vote_done")) return false;
    await say("해설사: 투표 날, 정말 고마웠어요.\f방명록에 그날 일을\n적어 두었어요.\f'함께 지켰다'고.");
    return true; });
  // 갈매마을 한결: 조박사가 아직이면 비색마을 투표 소식
  wrapTalk("galmae", n => n.id === "gm_hangyeol", async () => {
    if (!G.flag("banya_event_done") || G.flag("bs_vote_done") || G.flag("jb_back")) return false;
    await say("한결: 조박사님 아직이야.\f근데 비색마을에서 금박재단이\n투표를 한다던데?\f……냄새가 나.\n가 봐!"); return true; });
  // 월백마을: 윤슬 박사(반야봉에서 내려오면)
  if (MAPS.wolbaek) {
    MAPS.wolbaek.npcs.push({ id: "wb_yunseul", x: 26, y: 36, spr: "yunseul", dir: "down", move: "fixed", hidden: true, show: () => G.flag("banya_event_done") && !G.flag("ys_byeoldol"), talk: () => ysByeoldol() });
    MAPS.wolbaek.areas = (MAPS.wolbaek.areas || []).concat([{ x0: 20, y0: 33, x1: 29, y1: 39, cond: () => G.flag("banya_event_done") && !G.flag("ys_byeoldol"), run: ysByeoldol }]);
  }
  // 4월의 엽서 읽기: 투표 뒤 한 줄 더
  if (typeof jjyCardRead === "function") { const r0 = jjyCardRead; jjyCardRead = async function () { await r0(); if (G.flag("bs_vote_done")) await say("비색마을 투표 날,\n마을 사람들이 함께\f'틀린 건 틀렸다'고\n말했다."); if (G.flag("chuldu_done")) await say("(만복사의 밤, 이 엽서는\n오작교의 별 하나가 되었다.)"); }; }
})();

// ---------------------------------------------------------------- 조박사 귀환은 비색마을 투표 뒤(장부의 빠진 한 장 = 투표 지시서)
(function gateJb() {
  const GM = MAPS.galmae; if (!GM || typeof jbReturnEvent !== "function") return;
  for (const a of GM.areas || []) if (a.run === jbReturnEvent) { const c0 = a.cond; a.cond = () => c0() && (G.flag("bs_vote_done") || G.flag("jb_back")); }
})();

// ---------------------------------------------------------------- 모험 수첩: 반야봉 뒤 두 단계
(function addGoals() {
  if (typeof GOALS === "undefined") return;
  const i = GOALS.findIndex(q => q.k === "banya"); if (i < 0 || GOALS.some(q => q.k === "ysb")) return;
  GOALS.splice(i + 1, 0,
    { k: "ysb", todo: () => !G.flag("ys_byeoldol"), t: "월백마을로 내려가기", where: "반야봉 → 뱀사골 → 월백마을", place: "wolbaek",
      d: "반야봉 제단에서 주운 별돌, 무슨 돌일까요? 뱀사골을 내려가 월백마을로 가면 윤슬 박사님이 기다리고 있어요." },
    { k: "vote", todo: () => !G.flag("bs_vote_done") && !G.flag("jb_back"), t: "비색마을 주민 투표", where: "비색마을 마을회관 (하늘택시로 비색마을)", place: "bisaek",
      d: "금박재단이 비색마을 마을회관에서 '섬진강 둔치 개발 주민 투표'를 연대요. 선거의 네 가지 원칙(보통·평등·직접·비밀)을 어긴 곳을 찾아요. 김주열 열사 기념관에서 받는 '4월의 엽서'가 꼭 필요해요." });
})();

// ---------------------------------------------------------------- 출두(chapter23)에서 부르는 장면
(function attachChuldu() {
  const M = MAPS.manboksa; if (!M || typeof CX_CROWD === "undefined") return;
  const sh = () => typeof cxEv === "function" && cxEv() && G.flag("bs_vote_done");
  M.npcs.push(
    { id: "cx_bsgd", x: 24, y: 12, spr: "woman", dir: "up", move: "fixed", hidden: true, show: sh, talk: () => say("해설사: '함께 지키는 민주주의'.\f오늘 밤도\n함께 왔어요.") },
    { id: "cx_bsgn", x: 25, y: 12, spr: "oldwoman", dir: "up", move: "fixed", hidden: true, show: sh, talk: () => say("할머니: 틀린 건 틀렸다고.\f이번엔 우리가\n먼저 말하러 왔어요.") },
    { id: "cx_ijang", x: 23, y: 13, spr: "man", dir: "up", move: "fixed", hidden: true, show: sh, talk: () => say("이장: 비색마을도\n함께 왔소!") });
  CX_CROWD.push("cx_bsgd", "cx_bsgn", "cx_ijang");
  for (const id of ["cx_bsgd", "cx_bsgn", "cx_ijang"]) { const n = M.npcs.find(q => q.id === id); if (n) n.heart = "만복사의 밤 " + id; }
})();
// ① 출두 뒤: 찬향 — 옥가락지(춘향전에서 어사가 된 몽룡이 옥가락지로 자기를 알림)
async function cxRingLine() {
  if (!jpHas("jp_ring")) return;
  const C = act("cx_chan"), P = World.player; if (C) { await walkPath(C, P.x - 1, P.y + 1); face(C, P); }
  await say("찬향: 그 옥가락지……\n춘향제 날 받은 거죠?");
  await say("찬향: 「춘향전」에서도 어사가 된\n몽룡이 옥가락지를 보여 줬대요.\f'내가 바로 그 사람이다'\n하고요.");
  await say("찬향: 왜 그렇게 생각했을까?\f……오늘은 안 물을게요.\n이미 다 보여 줬으니까.");
}
// ② 증거: 투표 지시서(비색마을)
async function cxVoteEvidence() {
  if (!jpHas("vote_order")) return;
  const IJ = act("cx_ijang"), P = World.player; if (IJ) { await walkPath(IJ, P.x - 1, P.y); face(IJ, P); }
  await say(`${J(G.name, "은")} 투표 지시서도\n꺼내 보였다.`);
  await say("비색 이장: 비색마을 투표 날\n실장이 떨어뜨린 지시서요!\f'찬성이 나오게 할 것' —\n이사장 도장이 꾹!");
  const GN = act("cx_bsgn"); if (GN) face(GN, P);
  await say("할머니: 틀린 건 틀렸다고.\f이번엔 우리 마을이\n먼저 말하러 왔어요.");
}
// ③ 운해룡의 빈 몸을 채우는 정표 여섯
async function cxStars() {
  const have = jpList(); if (!have.length) return;
  await say("그때, 가방 속 정표들이\n하나둘 빛나기 시작했다……");
  jpFxOn("bridge");
  for (const t of have) { await jpFxShow(t.id); await say(t.id === "jjy_card" ? jpCardStar() : t.star); }
  await say(have.length >= 6 ? "여섯 가지 이야기가 별이 되어\n운해룡의 빈 몸속으로 날아들었다." : `${have.length}가지 이야기가 별이 되어\n운해룡의 빈 몸속으로 날아들었다.\f남은 자리는 출두하러 온\n사람들의 목소리가 채웠다.`);
  await say("잊힌 것들이 모여 생긴 구름 속에\f잊지 않은 이야기가\n등불처럼 하나둘 켜졌다.");
}
// ④ 끝맺음: 소리 부채 · 청출어람 · 박씨 · 엽서
async function cxEndFan() {
  if (!jpHas("jp_fan")) return;
  await say("소리 어른: ……그 부채.\n아직 갖고 있느냐?");
  sfx("select");
  await say("소리 부채를 소리 어른께\n돌려 드렸다.");
  await say("소리 어른이 부채를\n촤라락 펼쳤다.");
  await say("소리 어른: 들어 주는 사람이 있으니\n이제야 소리할 맛이 나는구나.");
}
async function cxEndFan2() {
  if (!jpHas("jp_fan")) return;
  await say("소리 어른: ……이 부채는\n이제 네 것이다.\f들어 주는 사람의 부채.\n잘 간직하거라.");
  sfx("select"); await say("소리 부채를 다시 받았다.");
}
async function cxEndCloth(JB) {
  if (!jpHas("jp_cloth")) return;
  await say("조박사: ……어? 그 손수건,\n쪽빛이네?");
  await say("쪽빛마을 할머니가 준\n손수건을 보여 드렸다.");
  await say("조박사: '청출어람'.\f쪽에서 나온 빛이\n쪽보다 더 푸르다.");
  await say("조박사: 선생님보다 더 푸르게\n자란 제자라……\f……음, 그건 좀\n좋은데?");
  if (JB) await emote(JB, "heart", 30);
}
async function cxEndSeed() {
  const H = act("cx_heeju"), P = World.player;
  if (jpHas("jp_seed")) { if (H) face(H, P); await say("희주: 그 박씨, 집 마당에\n심어 봐요.\f봄이 오면 제비가\n돌아올지도 몰라요."); }
  if (G.flag("bs_vote_done")) { const GD = act("cx_bsgd"); if (GD) face(GD, P); await say("해설사: 오늘 밤 일도\n기념관 방명록에 적어 둘게요.\f'함께 지켰다'고."); }
}
Object.assign(window, { cxRingLine, cxVoteEvidence, cxStars, cxEndFan, cxEndFan2, cxEndCloth, cxEndSeed });

// ---------------------------------------------------------------- 엔딩(chapter26) 우리 집: 박씨 · 제비꼬 · 책상 앞 엽서
async function jpEpilogue() {
  const have = jpList(); if (!have.length) return;
  const MO = act("mom"), P = World.player;
  if (MO) face(MO, P);
  await say("엄마: 그런데 가방에서\n반짝이는 건 다 뭐니?");
  await say("여행에서 받은 정표들을\n엄마에게 보여 주었다.");
  jpFxOn("home");
  for (const t of have) await jpFxShow(t.id);
  await say("엄마: 어머, 이게 다\n여행에서 받은 거야?\f……하나하나 이야기가\n들어 있는 것 같네.");
  jpFxOff();
  if (jpHas("jp_seed")) {
    await say("엄마: 박씨도 있네!\n우리 마당에 심어 볼까?");
    await fadeOut(12); await wait(300); await fadeIn(12);
    await say("엄마와 함께 마당 한쪽에\n박씨를 심었다.");
    await say("흥부의 박씨처럼,\n봄이 오면 싹이 틀까?");
    try { Audio2.cry("jebikko"); } catch (e) {}
    await say("그때, 처마 밑으로\n제비꼬 한 마리가 날아들었다.");
    await say("엄마: 어머, 제비가 왔네!\f……돌아올 자리를\n알아본 걸까?");
  }
  if (jpHas("jjy_card")) await say("책상 앞에\n4월의 엽서를 붙였다.\f흰 국화 한 송이.\n'함께 지키는 민주주의'.");
  await say("정표는 '잊지 말자'는 약속.\f이 여행도, 함께한 사람들과\n남켓몬들도,\f오래오래\n잊지 않을 것이다.");
}
window.jpEpilogue = jpEpilogue;
