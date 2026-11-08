// ===== v2.12 비색마을 김주열 열사 기념관 (사용자 지시 2026-10-25: "비색마을에 김주열열사 기념관 + 관련 이벤트 추가") =====
//   비색마을(= 금지면) 북쪽 큰길 서쪽. 벽 패널 넷을 읽고 → 해설사의 세 가지 물음 → '4월의 엽서'. 헌화대(흰 국화·고개 숙이기)·명예졸업장 진열장·방명록
//   3월 15일·4월 11일·4월 19일(실제 날짜)에는 추모하러 온 할머니와 흰 국화가 더 놓임
//   배틀·야생 남켓몬 없음. 어린이 눈높이로 사실만, 무섭거나 자세한 묘사 없이
// chapter15.js 뒤, hearts.js 앞에 읽힘
// 사실(위키백과 '김주열'·'4·19 혁명', 나무위키 '김주열'): 1944년 남원군 금지면 옹정리 출생, 1956 금지동초·1960 금지중 졸업, 마산상업고등학교 합격(입학 전 사망),
//   1960년 3·15 부정선거 규탄 시위에 나갔다가 행방불명, 27일 만인 4월 11일 마산 중앙부두 앞바다에서 시신 발견(경찰이 쏜 최루탄), 부산일보 보도로 알려져 시위가 전국으로 →
//   4월 19일 시위 → 4월 26일 이승만 하야 발표 / 어머니 권찬주가 마산으로 가서 아들을 찾음 / 1995년 4월 11일 마산상고 명예졸업장 추서 / 묘는 고향 금지면, 국립3·15민주묘지·국립4·19민주묘지에 가묘
//   헌법 전문 "불의에 항거한 4·19민주이념을 계승하고"
"use strict";
ITEMS.jjy_card = { n: "4월의 엽서", p: "key", d: "김주열 열사 기념관에서 받은 엽서예요. 앞면엔 흰 국화, 뒷면엔 '함께 지키는 민주주의'라고 쓰여 있어요.", ic: "letter" };
const JJY_DAY = () => { const d = gameNow(), m = d.getMonth() + 1, k = d.getDate(); return (m === 3 && k === 15) ? "3·15" : (m === 4 && k === 11) ? "4·11" : (m === 4 && k === 19) ? "4·19" : null; };
const JJY_PANELS = [
  ["금지에서 자란 소년", "김주열 열사는 1944년 남원 금지면\n옹정리에서 태어났어요.\f금지동초등학교와 금지중학교를\n졸업했어요.\f1960년 봄에는 마산상업고등학교에\n합격했어요."],
  ["3·15 부정선거", "1960년 3월 15일, 대통령과 부통령을\n뽑는 선거가 있었어요.\f그런데 표를 속이는 부정선거가\n저질러졌어요.\f마산의 학생과 시민들은 부정선거에\n맞서 거리로 나섰어요.\f주열도 그 자리에 있었어요.\n그날 뒤로 집에 돌아오지 못했어요."],
  ["어머니의 기다림", "어머니 권찬주 님은 마산으로 가서\n아들을 애타게 찾았어요.\f실종 27일 만인 4월 11일,\n주열은 숨진 채 발견되었어요.\f경찰이 쏜 최루탄에 맞아 목숨을\n잃었다는 사실이 신문에 알려졌어요.\f사람들은 크게 슬퍼하고\n분노했어요."],
  ["4·19 혁명", "부정선거에 맞선 시위가\n전국으로 퍼졌어요.\f4월 19일, 학생과 시민들이\n함께 일어섰어요.\f4월 26일, 이승만 대통령이\n물러나겠다고 발표했어요.\f이것을 4·19 혁명이라고 해요.\f지금 우리 헌법 맨 앞(전문)에는\n'불의에 항거한 4·19민주이념'을\f이어받는다는 말이 적혀 있어요."],
];
async function jjyPanel(i) {
  const [t, body] = JJY_PANELS[i];
  await say(`[${i + 1}] ${t}\f${body}`);
  if (!G.flag("jjy_p" + i)) { G.flag("jjy_p" + i, true); const n = [0, 1, 2, 3].filter(k => G.flag("jjy_p" + k)).length; if (n < 4) await say(`(패널 ${n}/4를 읽었다.)`); else await say("(패널 네 개를 다 읽었다!\n해설사에게 가 보자.)"); }
}
async function jjyAltar() {
  await say("흰 국화가 놓인 헌화대.\f김주열 열사(1944~1960).\f열사의 묘소는 고향 남원 금지면에\n있어요.\f마산과 서울의 민주묘지에도\n열사를 기리는 묘가 있어요.");
  if ((await ask("흰 국화를 한 송이 놓을까?", ["놓는다", "그만둔다"])) !== 0) return;
  Audio2.stop && Audio2.stop();
  await fadeOut(12, "#ffffff"); await wait(600); await fadeIn(12);
  await say("흰 국화 한 송이를 놓고\n조용히 고개를 숙였다……");
  G.flag("jjy_bow", true); zoneBgm();
}
async function jjyVitrine() {
  await say("유리 진열장 안에 졸업장이 있다.\f마산상업고등학교가 1995년에\n김주열 열사에게 준 명예졸업장이다.\f합격하고도 학교에 다니지 못한\n학생에게, 35년 뒤 준 졸업장이다.");
}
const JJY_NOTES = ["잊지 않을게요.", "틀린 건 틀렸다고 말할게요.", "민주주의를 함께 지킬게요."];
async function jjyBook() {
  const k = G.flag("jjy_note") ? G.flags.jjy_note : 0;
  if (k) { await say(`방명록에 '${JJY_NOTES[k - 1]}'\n라고 적은 글이 보인다.\f그 아래로 다른 사람들의 글도\n빼곡하다.`); return; }
  await say("방명록이 펼쳐져 있다.\f'잊지 않겠습니다.'\n'고맙습니다.'\f여러 사람의 글씨가\n한 줄 한 줄 적혀 있다.");
  const v = await ask("방명록에 한 줄 남길까?", [...JJY_NOTES, "그만둔다"]);
  if (v < 0 || v >= JJY_NOTES.length) return;
  G.flags.jjy_note = v + 1; sfx("select");
  await say(`'${JJY_NOTES[v]}'\f정성껏 또박또박 적었다.`);
}
const JJY_QUIZ = [
  ["김주열 열사가 태어나고 자란 곳은\n어디일까요?", ["남원 금지면", "서울", "부산"], 0, "맞아요! 바로 이 마을 가까운\n옹정리예요."],
  ["1960년 3월 15일 선거에서\n무엇이 잘못되었나요?", ["표를 속이는 부정선거", "비가 많이 왔어요", "아무 일도 없었어요"], 0, "맞아요. 그래서 학생과 시민들이\n거리로 나섰어요."],
  ["학생과 시민들이 함께 일어나\n민주주의를 지킨 일은?", ["4·19 혁명", "3·1 운동", "동학 농민 운동"], 0, "맞아요! 1960년 4월의 일이라\n4·19 혁명이라고 불러요."],
];
async function jjyGuide() {
  const day = JJY_DAY();
  if (day) await say(`해설사: 오늘은 ${{ "3·15": "3월 15일, 마산에서 부정선거에\n맞선 시위가 있었던 날", "4·11": "4월 11일, 열사가 발견된 날", "4·19": "4월 19일, 4·19 혁명 기념일" }[day]}이에요.\f그래서 꽃을 들고 오시는 분들이\n많아요.`);
  if (G.flag("jjy_quiz")) { await say("해설사: 또 왔네요.\f엽서는 잘 가지고 있죠?\n천천히 둘러보고 가요."); return; }
  const read = [0, 1, 2, 3].filter(k => G.flag("jjy_p" + k)).length;
  if (!G.flag("jjy_met")) {
    G.flag("jjy_met", true);
    await say("해설사: 김주열 열사 기념관에\n온 걸 환영해요.\f열사는 이 마을 가까운 옹정리에서\n태어나고 자랐어요.\f고등학교에 막 들어갈 나이에\n부정선거에 맞서 거리로 나섰지요.");
    await say("해설사: 벽에 걸린 패널 네 개를\n차례로 읽어 보세요.\f다 읽고 오면 세 가지만\n물어볼게요.");
    if (read < 4) return;
  }
  if (read < 4) { await say(`해설사: 패널을 ${read}개 읽었네요.\f나머지도 읽고 오면\n세 가지를 물어볼게요.`); return; }
  await say("해설사: 패널을 다 읽었군요!\n그럼 세 가지만 물어볼게요.");
  for (const [q, opts, ans, ok] of JJY_QUIZ) {
    const v = await quizAsk(q, opts);   // v2.40 보기 섞기
    if (v !== ans) { await say("해설사: 음…… 다시 생각해 볼까요?\f패널을 한 번 더 읽어 보고\n다시 와요."); return; }
    sfx("select"); await say("해설사: " + ok);
  }
  G.flag("jjy_quiz", true);
  await say("해설사: 끝까지 잘 들어 줘서\n고마워요.\f이건 기념관에서 드리는\n엽서예요.");
  await getItem("jjy_card");
  await say("해설사: 열사가 지키려던 건\n'공정한 선거'였어요.\f우리 반에서 회장을 뽑을 때도\n똑같이 소중한 일이에요.");
  await say("해설사: 이 엽서, 잘 간직해 줘요.\f'틀린 건 틀렸다고' 말해야 할 때\n꼭 떠올려 줘요.");   // v2.59 복선(비색마을 투표·출두)
}
async function jjyCardRead() {
  await say("4월의 엽서.\f앞면에는 흰 국화 한 송이.\f뒷면에는 또박또박\n'함께 지키는 민주주의'.");
}

(function attachChapter16() {
  const D = MAPDATA;
  const BS = MAPS.bisaek;
  { const s = BS.signs.find(s => s[0] === 17 && s[1] === 3); if (s) s[0] = 22; }      // 마을 표지판이 기념관 자리에서 큰길 건너로
  BS.checks.push(...[[12, 7], [16, 7], [11, 7], [17, 7]].map(([x, y]) => [x, y, "김주열 열사 기념관\f1960년 3·15 의거와\n4·19 혁명을 기억하는 곳이에요."]));
  BS.npcs.push({ id: "bs_jjy_kid", x: 16, y: 10, spr: "student", dir: "up", move: "look",
    talk: "기념관에 우리 학교 선배님\n이야기가 있대.\f들어가 보면\n마음이 좀 숙연해져." });
  const J = D.jjy_hall;
  const P = (x0, i) => [[x0, 1, () => jjyPanel(i)], [x0 + 1, 1, () => jjyPanel(i)]];
  MAPS.jjy_hall = {
    rows: J.rows, stamps: J.stamps, indoor: true, name: "김주열 열사 기념관", floor: "floor_tile", wall: "wall_lab", win: "win_lab", bgm: "bisaek", noPopup: true, exit: exitB("jjy_hall"),
    checks: [...P(1, 0), ...P(3, 1), ...P(10, 2), ...P(12, 3),
      [6, 2, jjyAltar], [7, 2, jjyAltar], [8, 2, jjyAltar], [6, 1, jjyAltar], [7, 1, jjyAltar], [8, 1, jjyAltar],
      [5, 2, "흰 국화가 꽂힌 화병."], [9, 2, "흰 국화가 꽂힌 화병."],
      [2, 5, jjyVitrine], [3, 5, jjyVitrine], [11, 5, jjyBook]],
    npcs: [
      { id: "jjy_guide", x: 9, y: 7, spr: "woman", dir: "left", move: "fixed", talk: jjyGuide },
      { id: "jjy_teacher", x: 4, y: 7, spr: "man", dir: "up", move: "look",
        talk: "선생님: 오늘은 사회 시간에 배운\n4·19 혁명을 보러 왔어요.\f책에서 본 이름이 이 마을\n사람이었다니, 다들 놀랐대요." },
      { id: "jjy_student1", x: 3, y: 3, spr: "student", dir: "up", move: "look",
        talk: "고등학교에 막 들어갈 나이였대.\f나랑 몇 살 차이 안 나……" },
      { id: "jjy_student2", x: 12, y: 3, spr: "kid_f", dir: "up", move: "look",
        talk: "나도 틀린 걸 보면\n틀렸다고 말할 수 있을까?" },
      { id: "jjy_visitor", x: 5, y: 4, spr: "oldwoman", dir: "up", move: "fixed", show: () => !!JJY_DAY(),
        talk: "할머니: 해마다 이날이면\n꽃을 들고 와요.\f……잊지 않으려고요." },
    ],
  };
  Object.assign(TOWN_ZONE, { "김주열 열사 기념관": "bisaek" });
})();
