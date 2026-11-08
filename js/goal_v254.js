// ===== v2.54 길잡이 · 모험 수첩 — 길을 잃거나 이야기를 놓쳤을 때 '지금 할 일'을 알려 줌 =====
// 사용자: "게임 내에서 길을 잃거나 퀘스트 읽는 것을 놓쳤을 때, 어디로 가야하는지 어떤 걸 해야하는지 알 수 있는 공략집.
//          퀘스트를 깨지 않은 채로 몇 분 이상 지나면 게임 우상단에 뜨는 방식으로?"
// - 이야기 진행(깃발·어사패)으로 '지금 할 일' 한 가지를 정함(GOALS 차례대로, 아직 안 한 첫째)
// - 할 일이 바뀌지 않은 채 정한 시간(기본 5분, 놀이 시간)이 지나면 화면 오른쪽 위에 길잡이 쪽지가 미끄러져 나옴(10초) → 3분마다 다시
//   쪽지를 누르거나 메뉴 → '모험 수첩'을 열면 자세히(어디로·무엇을·배움터 장치 도움말·상성) + A로 타운맵에 목표 표시
// - 모험 수첩에서 ◀▶로 쪽지 시간(3분·5분·10분·끄기) — 설정에 저장(Save.opt.hint)
// - 엔딩 뒤에는 쪽지 없음(수첩에 '자유 모험' 안내)
"use strict";
if (Save.opt.hint === undefined) Save.opt.hint = 5;
const HINT_STEPS = [3, 5, 10, 0];
const GYM_INFO = {
  1: { map: "gym", town: "dahong", leader: "찬향", t: "노말", place: "다홍시티 배움터(큰길 북쪽 붉은 지붕)", how: ["문제판을 읽고 ○ 발판이나 × 발판을 밟아 대답해요.", "틀린 발판은 미끄럼틀처럼 아래로 쭉 미끄러지고, 짝꿍과 연습 배틀을 해요.", "시소 스위치를 밟으면 블록 문이 열리고 닫혀요."] },
  2: { map: "gym2", town: "jjok", leader: "미영", t: "페어리", place: "쪽빛마을 배움터 · 숲속 아틀리에", how: ["빨강·노랑·파랑 물감 쟁반을 밟으면 발에 물감이 묻어요. 두 가지를 밟으면 섞여요.", "물감 아치 문은 발자국 색깔로 대답해요(노랑+파랑 = 초록, 빨강+파랑 = 보라, 빨강+노랑 = 주황).", "여섯 걸음 걸으면 물감이 말라요. 색이 엉키면 세숫대야로 씻어요."] },
  3: { map: "gym3", town: "bisaek", leader: "수현", t: "풀", place: "비색마을 배움터 · 요리 교실", how: ["밀가루 바닥에 올라서면 무언가에 부딪힐 때까지 미끄러져요.", "화살 무늬 회전 도마는 화살 쪽으로 밀어 줘요.", "레시피 순서대로 1 손 씻기 → 2 반죽하기 → 3 굽기 자리에 멈춰 서요. 순서를 어기면 손 씻기부터 다시!"] },
  4: { map: "gym4", town: "juhong", leader: "신하", t: "물", place: "주홍마을 배움터 · 별 배움터", how: ["바닥의 별을 큰 별부터 차례로 밟아 별자리를 이어요.", "가짜 별이나 구름 웅덩이를 밟으면 처음 별로 돌아가요.", "별빛 망원경을 먼저 살펴보세요."] },
  5: { map: "gym5", town: "gamcheong", leader: "기수", t: "격투", place: "감청마을 배움터 · 과학실", how: ["레이저 빛을 거울로 꺾어 감지기에 맞히면 문이 열려요.", "프리즘 셔터는 칠판 수업을 들어야 열려요.", "심술쟁이 거울도 있으니 빛이 어디로 가는지 잘 살펴보세요."] },
  6: { map: "gym6", town: "ssuk", leader: "여심", t: "에스퍼", place: "쑥빛시티 배움터 · 보건실", how: ["커튼 진찰 부스마다 문제가 있어요.", "문제의 정답 번호 매트에 올라서면 다음 부스로 순간이동해요.", "보충 부스와 시력검사표에 힌트가 숨어 있어요."] },
  7: { map: "gym7", town: "misaek", leader: "희주", t: "강철", place: "미색마을 배움터 · 강철 공작실", how: ["칠판 수업을 읽고, 정답 번호 톱니바퀴 손잡이를 당기면 철다리가 뻗어 나와요.", "틀리면 톱니가 헛돌고 짝꿍이 달려와 연습 배틀을 해요(힌트도 줘요).", "칸 순서는 쇠를 다루는 차례 그대로: 달구기 → 두드리기 → 식히기."] },
  8: { map: "gym8", town: "galmae", leader: "조박사", t: "악", place: "갈매마을 배움터 · 밤의 교실", how: ["불이 꺼져 있어 내 초롱 둘레만 보여요. 칸마다 청사초롱 둘을 켜면 환해져요.", "책상·궤짝 속에 숨은 교구(유척 → 사목 → 마패)를 찾고 칠판 수업을 들으면 미닫이 문이 열려요.", "어둠 속에 숨은 트레이너를 조심해요."] },
};
const gymGoal = n => {
  const I = GYM_INFO[n];
  return { k: "gym" + n, gym: n, mile: 1, t: `${I.place.split(" ")[0].replace("마을", "").replace("시티", "")} 배움터 도전!`, where: I.place, place: I.town,
    d: `지킴이 ${I.leader}(${I.t} 타입)에게 이기면 어사패를 받아요. 배움터마다 장치를 풀어야 지킴이에게 갈 수 있어요.` };
};
const F = k => G.flag(k), B = n => typeof hasBadge === "function" && hasBadge(n);
const GOALS = [
  { k: "starter", todo: () => !F("starter"), t: "첫 남켓몬 받기", where: "덕과 아카데미 교실", place: "academy",
    d: "조박사 선생님에게 첫 남켓몬을 받아요. 몽쭉이(풀)·불삽이(불꽃)·꼬꾸리(물) 가운데 하나를 골라요." },
  { k: "home", todo: () => !F("slept"), t: "우리 집으로 가기", where: "소색마을 우리 집", place: "sosaek",
    d: "통학버스에서 내리면 소색마을이에요. 우리 집에 들어가 엄마와 이야기하고 푹 쉬어요." },
  { k: "letter", todo: () => !F("dex"), t: "연구소에 편지 전하기", where: "소색마을 → 북쪽 1번도로 → 다홍시티 생태연구소", place: "dahong",
    d: "조박사의 편지를 생태연구소 윤슬 박사님께 전해요. 소색마을에서 1번도로를 따라 북쪽으로 가면 다홍시티예요. 연구소는 다홍 배움터 오른쪽, 유리 온실이 붙은 하얀 건물이에요." },
  { k: "fest", todo: () => !F("festival_done"), t: "춘향제 마당 가 보기", where: "다홍시티 북쪽 춘향제 마당", place: "dahong",
    d: "연구소에서 나와 다홍 배움터 위쪽(북쪽) 춘향제 마당으로 가 보세요. 축제에서 무슨 소동이 벌어지고 있어요!" },
  { todo: () => !B(1), ...gymGoal(1) },
  { k: "jjok", todo: () => !F("garam1_done"), t: "2번도로 → 쪽빛마을", where: "다홍시티 북쪽 출구 → 2번도로 → 쪽빛마을", place: "jjok",
    d: "다홍시티 북쪽 출구로 나가 2번도로를 따라가면 쪽빛마을이에요. 출구에서 라이벌 한결이가 기다릴지도 몰라요!" },
  { k: "dye", todo: () => !F("dye_done"), t: "쪽물 항아리 소동", where: "쪽빛마을 가운데", place: "jjok",
    d: "쪽빛마을 안쪽(북쪽)으로 걸어 들어가 보세요. 쪽물 항아리에서 소동이 벌어졌어요." },
  { todo: () => !B(2), ...gymGoal(2) },
  { k: "route3", todo: () => !F("ongi_done"), t: "3번도로 → 갈매마을", where: "쪽빛마을 북쪽 출구 → 3번도로", place: "r3",
    d: "배움터에서 나오면 쪽 베는 아저씨가 풀베기를 줘요. 쪽빛마을 북쪽 출구로 나가 3번도로를 따라 북쪽으로! 길 중간 옹기 가마에서 무슨 일이 벌어져요." },
  { k: "galmae", todo: () => !F("rival4_done"), t: "갈매마을로 가기", where: "3번도로 북쪽 끝 → 갈매마을", place: "galmae",
    d: "3번도로를 따라 북쪽으로 계속 가면 덕과 아카데미가 있는 갈매마을이에요." },
  { k: "route45", todo: () => !F("bangsam3_done"), t: "4·5번도로 → 비색마을", where: "갈매마을 서쪽 → 4번도로 → 남쪽 5번도로", place: "r5",
    d: "갈매 배움터는 아직 닫혀 있어요(조박사 출장 중). 서쪽 4번도로로 나가 남쪽 5번도로를 따라가면 비색마을이에요." },
  { k: "seomjin", todo: () => !F("seomjin_done"), t: "섬진강 공사 현장", where: "비색마을 남쪽 섬진강 둑", place: "bisaek",
    d: "비색마을 남쪽 섬진강 둑에서 수상한 공사가 벌어지고 있어요. 마을 남쪽으로 내려가 보세요." },
  { todo: () => !B(3), ...gymGoal(3) },
  { k: "bridge", todo: () => !F("rival5_done"), t: "동쪽 요천대교로", where: "비색마을 동쪽 요천대교", place: "bisaek",
    d: "섬진 어사패를 받으면 비색마을 동쪽 요천대교를 건널 수 있어요. 다리에서 한결이가 기다리고 있어요." },
  { k: "juhong", todo: () => !F("garam2_done"), t: "송화 지나 주홍마을로", where: "요천대교 → 7번도로 → 송화마을 → 11번도로 → 주홍마을", place: "juhong",
    d: "7번도로 솔숲길을 지나면 송화마을(쉼터)이에요. 동쪽 11번도로 고갯길을 넘으면 주홍마을! 마을 남쪽 육모정에서 누군가 기다려요." },
  { todo: () => !B(4), ...gymGoal(4) },
  { k: "route10", todo: () => !F("bangsam5_done"), t: "북쪽 10번도로로", where: "주홍마을 북쪽 → 10번도로", place: "r10",
    d: "구룡 어사패를 받으면 주홍마을 북쪽 10번도로가 열려요. 길 위에서 본디회가 통행료를 받고 있대요! (섬진강 나루 뱃사공에게 가면 파도타기도 받을 수 있어요.)" },
  { k: "route9", todo: () => !F("rival6_done"), t: "다홍 서쪽 9번도로로", where: "10번도로 서쪽 → 다홍시티 → 서쪽 9번도로", place: "r9",
    d: "10번도로를 따라 서쪽으로 가면 다홍시티 동쪽 문이에요. 시내를 가로질러 서쪽 문으로 나가면 9번도로예요." },
  { k: "gyoryong", todo: () => !F("gisu_met"), t: "감청 지나 교룡산성", where: "9번도로 북쪽 → 감청마을 → 북쪽 교룡산성", place: "gyoryong",
    d: "9번도로 북쪽 감청마을을 지나 더 북쪽으로 가면 교룡산성이에요. 성문 앞에서 감청 배움터 지킴이 기수를 만나요." },
  { k: "hideout", todo: () => !F("hideout_done"), t: "본디회 은신처", where: "교룡산성 안 본디회 은신처", place: "gyoryong",
    d: "교룡산성 안쪽 본디회 은신처로 들어가요. 깊은 층에서 훈장 어른·행수 옹이·행수 솔뫼를 차례로 만나요." },
  { todo: () => !B(5), ...gymGoal(5) },
  { k: "ssuk", todo: () => !F("ssuk_event_done"), t: "12번도로 → 쑥빛시티", where: "주홍마을 동쪽 → 12번도로 → 쑥빛시티", place: "ssuk",
    d: "산성 어사패를 받으면 감청마을 매사냥꾼 할아버지가 공중날기를 줘요. 주홍마을 동쪽 12번도로(지리산 둘레길)를 따라 동쪽 끝이 쑥빛시티예요. 길 중간 북쪽 구룡계곡에도 들러 보세요." },
  { todo: () => !B(6), ...gymGoal(6) },
  { k: "inwol", todo: () => !F("rival7_done") && !F("ms_event_done"), t: "14번도로 → 인월장터", where: "쑥빛시티 북쪽 → 14번도로 → 인월장터", place: "inwol",
    d: "장단 어사패를 받으면 쑥빛시티 북쪽 14번도로(람천 둑길)가 열려요. 동쪽 끝이 인월장터예요." },
  { k: "misaek", todo: () => !F("ms_event_done"), t: "미색마을 설명회", where: "인월장터 북쪽 → 미색마을", place: "misaek",
    d: "인월장터 북쪽 미색마을에서 '흥부 리조트' 주민 설명회가 열린대요. 마을 가운데로 들어가 보세요. 설명회가 끝나야 미색 배움터 문이 열려요." },
  { todo: () => !B(7), ...gymGoal(7) },
  { k: "baemsa", todo: () => !F("baemsa_event_done"), t: "15번도로 → 뱀사골", where: "인월장터 남쪽 → 15번도로 → 월백마을 → 남쪽 뱀사골", place: "baemsagol",
    d: "인월장터 남쪽 15번도로를 따라 월백마을(산내)로 가요. 마을 남쪽이 뱀사골이에요. 월백마을 목기 공방에도 들러 보세요." },
  { k: "banya", mile: 1, todo: () => !F("banya_event_done"), t: "반야봉 정상으로", where: "뱀사골 북쪽 끝 → 반야봉", place: "banya",
    d: "뱀사골 위 안개가 걷혔어요. 북쪽 끝으로 올라가면 반야봉! 구상나무 숲 고개와 정상에서 본디회와 겨뤄요." },
  { k: "jbback", mile: 1, todo: () => !F("jb_back"), t: "갈매마을로 돌아가기", where: "미색마을 북쪽 16번도로 → 갈매마을 (공중날기도 좋아요)", place: "galmae",
    d: "조박사가 출장에서 돌아온대요! 갈매마을로 가요. 미색마을 북쪽 16번도로를 지나거나, 공중날기로 갈매마을에 날아가요." },
  { todo: () => !B(8), ...gymGoal(8) },
  { k: "reveal", todo: () => !F("jb_reveal"), t: "조박사와 이야기", where: "갈매 배움터", place: "galmae",
    d: "갈매 배움터의 조박사에게 다시 말을 걸어 보세요. 하고 싶은 이야기가 있대요." },
  { k: "bongseo", todo: () => !F("bongseo_got"), t: "교장 선생님 만나기", where: "갈매마을 덕과 아카데미 교실", place: "academy",
    d: "교장 선생님이 갈매마을 덕과 아카데미 교실에서 기다리세요. 교실에 들어가면 봉서를 받아요." },
  { k: "chuldu", mile: 1, todo: () => !F("chuldu_done"), t: "밤에 만복사지로", where: "1번도로 북쪽(다홍시티 바로 아래) 서쪽 끝 → 만복사지 · 밤에만", place: "manboksa",
    d: "봉서를 들고 밤(저녁 8시 ~ 새벽 4시)에 만복사지로 가요. 다홍시티 바로 아래 1번도로의 서쪽 끝에서 서쪽으로 들어가요. 가방의 회중시계를 '게임 시계'로 바꾸면 '다음 때로 넘기기'로 밤을 만들 수 있어요." },
  { k: "r17", mile: 1, todo: () => !F("r17_gate"), t: "17번도로 홍살문", where: "갈매마을 동쪽 16번도로 → 북쪽 17번도로", place: "r17",
    d: "어사패 여덟 개를 모았어요! 갈매마을 동쪽 16번도로에서 북쪽 17번도로로 가면 리그로 가는 홍살문이 있어요." },
  { k: "manhaeng", todo: () => !F("rival9_done"), t: "만행산 넘기", where: "17번도로 북쪽 → 만행산", place: "manhaeng",
    d: "만행산 숲길과 바위굴을 지나 천황봉으로 올라가요. 바위굴은 큰 바위를 누름판에 올리면 길이 열려요. 산꼭대기에서 한결이가 기다려요." },
  { k: "league", mile: 1, todo: () => !F("lg_win5"), t: "오방고원 리그 도전!", where: "만행산 북쪽 → 오방고원 리그 전당", place: "obang",
    d: "리그 전당 1층에서 회복하고 준비해요. 산지기 넷(해랑 고스트 · 설아 얼음 · 이글 불꽃 · 영란 비행)과 챔피언을 차례로 이겨요. 방 사이에는 회복이 없으니 회복약을 넉넉히!" },
  { k: "hof", todo: () => !F("ending_seen"), t: "명예의 전당으로", where: "챔피언의 방 뒤 명예의 전당", place: "obang",
    d: "챔피언을 이겼어요! 문을 지나 명예의 전당으로 가요." },
];
const FREE_GOAL = { k: "free", t: "자유 모험", where: "용성지방 어디든!", place: null, free: true,
  d: "엔딩을 보았어요! 이제 마음대로 모험해요. 다홍시티 배움터 오른쪽 시외버스 정류장에서 전주 배틀누각으로 갈 수 있어요. 전설의 남켓몬 소문을 찾고, 남켓몬 도감도 채워 보세요." };
function goalNow() {   // 큰 이정표(어사패·반야봉·출두·리그)를 이미 넘었으면 그 앞 단계는 건너뜀(옛 리포트에 빠진 깃발이 있어도)
  const td = q => { try { return q.todo(); } catch (e) { return false; } };
  if (G.flag("ending_seen")) return FREE_GOAL;
  let from = 0; GOALS.forEach((q, i) => { if (q.mile && !td(q)) from = i + 1; });
  for (let i = from; i < GOALS.length; i++) if (td(GOALS[i])) return GOALS[i];
  return FREE_GOAL;
}
const goodVs = t => (typeof TC !== "undefined" && TC ? Object.keys(TC).filter(a => TC[a] && TC[a][t] === 2) : []);

// ---- 길잡이 쪽지(오른쪽 위) ----
const GOAL = { k: null, t0: 0, last: -1e9, toast: null };
function goalTick() {
  if (!G || !World.M || !G.flag) return;
  const q = goalNow();
  if (q.k !== GOAL.k) { GOAL.k = q.k; GOAL.t0 = G.time; GOAL.last = -1e9; if (GOAL.toast) GOAL.toast.out = GOAL.toast.out || 1; return; }
  const min = Save.opt.hint; if (!min || q.free) return;
  if (GOAL.toast || World.popup || Scenes.top() !== World || World.busy) return;
  const stuck = G.time - GOAL.t0;
  if (stuck >= min * 60 && G.time - GOAL.last >= 180) {
    GOAL.last = G.time;
    const inGym = q.gym && G.map === GYM_INFO[q.gym].map;
    GOAL.toast = { t: 0, out: 0, title: inGym ? `지킴이 ${GYM_INFO[q.gym].leader}에게 가기` : q.t, sub: inGym ? "장치 도움말은 메뉴 → 모험 수첩" : "자세히: 메뉴 → 모험 수첩" };
    sfx("cursor");
  }
}
function goalToastRect() {
  const T = GOAL.toast; if (!T) return null;
  const w = Math.min(196, Math.max(Font.width(T.title), Font.width(T.sub, "g9"), 90) + 26), h = 31;
  const k = T.out ? Math.max(0, 1 - T.out / 12) : Math.min(1, T.t / 12);
  return { x: Math.round(SW - 4 - w * k - (1 - k) * 8), y: 4, w, h };
}
function goalToastDraw() {
  const T = GOAL.toast; if (!T) return;
  const r = goalToastRect(); if (!r) return;
  const { x, y, w, h } = r;
  rect(x, y, w, h, "#1c2a3a"); rect(x + 1, y + 1, w - 2, h - 2, "#2e4a66"); rect(x + 1, y + 1, w - 2, 1, "#5a82a8");
  rect(x + 1, y + 1, 4, h - 2, "#f0c040");
  const b = (FRAME >> 4) & 1;
  Font.draw(g, "길잡이", x + 9, y + 1, { font: "g9", col: "#ffd970", sh: null });
  Font.draw(g, T.title, x + 9, y + 12, { col: "#ffffff", sh: "#14202c", fit: w - 14 });
  Font.draw(g, T.sub, x + w - 4, y + 1, { font: "g9", col: "#b8cce0", sh: null, align: "right", fit: w - 50 });
  if (b) rect(x + w - 6, y + h - 5, 3, 3, "#ffd970");
}
(() => {
  const u0 = World.update; let n = 0;
  World.update = function (...a) {
    const r = u0.apply(this, a);
    try {
      const T = GOAL.toast;
      if (T && Scenes.top() === World) { if (T.out) { if (++T.out > 12) GOAL.toast = null; } else if (++T.t > 600) T.out = 1; }
      if (++n % 30 === 0) goalTick();
    } catch (e) {}
    return r;
  };
  const d0 = World.draw;
  World.draw = function (...a) { const r = d0.apply(this, a); try { if (Scenes.top() === World || (GOAL.toast && GOAL.toast.out)) goalToastDraw(); } catch (e) {} return r; };
  // 쪽지를 누르면(마우스·터치) 모험 수첩
  const cv = document.getElementById("screen") || document.querySelector("canvas");
  if (cv) cv.addEventListener("pointerdown", e => {
    const r = goalToastRect(); if (!r || Scenes.top() !== World || World.busy) return;
    const b = cv.getBoundingClientRect(), x = (e.clientX - b.left) / b.width * SW, y = (e.clientY - b.top) / b.height * SH;
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) { e.preventDefault(); GOAL.toast.out = 1; World.run(() => show(new GoalBook())); }
  });
  window.goalTap = () => { if (GOAL.toast && Scenes.top() === World && !World.busy) { GOAL.toast.out = 1; World.run(() => show(new GoalBook())); return true; } return false; };   // 시험용
})();

// ---- 모험 수첩 ----
class GoalBook extends Modal {
  constructor() { super(); this.opaque = true; this.q = goalNow(); this.top = 0; this.L = null; GOAL.t0 = G.time; GOAL.last = G.time; if (GOAL.toast) GOAL.toast.out = 1; }
  get doc() {
    if (this.L) return this.L;
    const q = this.q, Bk = [];
    Bk.push({ t: q.where, font: "g9", label: "어디로", lw: 40, labCol: "#a03020" });
    Bk.push({ t: q.d, font: "g11", gap: 4 });
    if (q.gym) {
      const I = GYM_INFO[q.gym], gv = goodVs(I.t);
      if (gv.length) Bk.push({ t: `${I.t} 타입에는 ${gv.join("·")} 기술이 잘 들어요.`, font: "g9", label: "상성", lw: 40, labCol: "#2a6a9a", gap: 6 });
      if (q.gym === 7 && !G.flag("ms_event_done")) Bk.push({ t: "흥부 리조트 설명회가 끝나야 문이 열려요.", font: "g9", label: "문", lw: 40, labCol: "#2a6a9a" });
      Bk.push({ t: "배움터 장치", font: "g9", col: "#2a6a9a", sh: null, gap: 6 });
      I.how.forEach(s => Bk.push({ t: "· " + s, font: "g9" }));
    }
    if (q.free) {
      const dex = Object.keys(G.caught || {}).length;
      Bk.push({ t: `잡은 남켓몬 ${dex}종 · 어사패 ${(G.badges || []).length}개`, font: "g9", label: "기록", lw: 40, labCol: "#2a6a9a", gap: 6 });
    }
    return this.L = layoutDoc(Bk, 228);
  }
  get max() { return docMax(this.doc, 114); }
  update(f) {
    if (!f) return;
    if (Input.rep("down")) { if (this.top < this.max) { this.top++; sfx("cursor"); } }
    else if (Input.rep("up")) { if (this.top > 0) { this.top--; sfx("cursor"); } }
    else if ((this._l = Input.rep("left")) || Input.rep("right")) {
      const i = HINT_STEPS.indexOf(Save.opt.hint), d = this._l ? -1 : 1;
      Save.opt.hint = HINT_STEPS[((i < 0 ? 1 : i) + d + HINT_STEPS.length) % HINT_STEPS.length]; Save.saveOpt(); sfx("cursor"); }
    else if (Input.ok()) { if (this.q.place) { sfx("select"); show(new GoalMap(this.q)); } }
    else if (Input.cancel()) { sfx("cancel"); this.done(); }
  }
  draw() {
    const q = this.q;
    bgPattern("#e8dcc0", "#efe5cc");
    rect(0, 0, SW, 20, "#2e5a7a"); rect(0, 18, SW, 2, "#1a3448");
    Font.draw(g, "모험 수첩", 8, 2, { col: TXT.white, sh: "#1a3448" });
    Font.draw(g, `어사패 ${(G.badges || []).length}/8`, 248, 5, { font: "g9", col: "#ffe9a8", sh: null, align: "right" });
    panel(4, 24, 248, 26, "#fff6dc", "#8a5a2a");
    Font.draw(g, q.free ? "지금은" : "지금 할 일", 12, 25, { font: "g9", col: "#a03020", sh: null });
    Font.draw(g, q.t, 12, 35, { fit: 230, col: "#3a2410", sh: "#f4dcb0" });
    panel(4, 53, 248, 120, "#fbf8f0");
    drawDoc(this.doc, 12, 56, 114, this.top);
    if (this.top > 0) upArrow(240, 55); if (this.top < this.max) downArrow(240, 166);
    frame(2, 174, 252, 17);
    const h = Save.opt.hint;
    Font.draw(g, (q.place ? "A 타운맵  " : "") + "B 닫기", 10, 177, { font: "g9", col: "#2a5aa8", sh: null });
    Font.draw(g, "◀ 길잡이 쪽지: " + (h ? h + "분 뒤 ▶" : "끄기 ▶"), 248, 177, { font: "g9", col: TXT.dark, sh: null, align: "right" });
  }
}
// 타운맵에서 목표 자리 보기: 목표에 깃발 + 커서
class GoalMap extends TownMap {
  constructor(q) { super(); this.q = q; const j = this.pts.findIndex(p => p.id === q.place); if (j >= 0) { this.i = j; this.goalI = j; } }
  draw() {
    super.draw();
    const p = this.pts[this.goalI]; if (!p || this.det) return;
    const b = (FRAME >> 3) & 3, x = Math.round(p.px), y = Math.round(p.py) - 12 - (b === 1 ? 1 : 0);
    rect(x, y, 1, 12, "#3a2a20"); rect(x + 1, y, 7, 5, "#e03a30"); rect(x + 1, y + 1, 6, 1, "#ff8a70");
    const by = p.py > 128 ? 38 : 120;
    rect(4, by, 120, 14, "rgba(30,30,40,.78)"); Font.draw(g, "목표: " + this.q.t, 8, by + 1, { font: "g9", col: "#ffd970", sh: null, fit: 112 });
  }
}
