// ===== v2.56 도우미 남켓몬 — 비전 기술을 배우지 않아도 쓰기(7세대 '라이드 남켓몬'·8세대 '아머까오 택시'처럼) =====
// 사용자: "비전머신 개선하자. 요즘 애들은 비전머신 포켓몬이 안배워도 쓸 수 있는 것에 익숙해. (아머까오 택시 등..)"
// - 비전머신을 받고 그 어사패가 있으면, 파티에 그 기술을 배운 남켓몬이 없어도 도우미 남켓몬이 와서 대신 써 줌
//     풀베기(비전머신01·어사패 2): 칼깃매가 날아와 가는 나무를 벰
//     파도타기(비전머신03·어사패 4): 남생배를 불러 등에 타고 건넘(물 위 모습은 전과 같은 둥근 파도타기 몸)
//     공중날기(비전머신02·어사패 5): '하늘택시' — 가방의 타운맵(또는 남켓몬 메뉴)에서 부르면 은하작이 가 본 마을로 데려다 줌
// - 배운 남켓몬이 있으면 예전처럼 그 남켓몬이 씀(컷인도 그 남켓몬) · 비전머신은 그대로 기술머신처럼 가르칠 수도 있음
"use strict";
const RIDE = {
  cut: { k: "kalgitmae", hm: "hm01", badge: 2, come: "부름 소리를 듣고\n칼깃매가 날아왔다!" },
  surf: { k: "namsaengbae", hm: "hm03", badge: 4, come: "남생배를 불렀다!\f남생배가 물 위로\n둥실 떠올랐다!" },
  fly: { k: "eunhajak", hm: "hm02", badge: 5, come: "하늘택시를 불렀다!\f은하작이 바람을 가르며\n내려앉았다!" },
};
function fieldHelper(id) {
  const R = RIDE[id]; if (!R || !MON[R.k] || !G.has(R.hm) || !hasBadge(R.badge)) return null;
  return { k: R.k, helper: id, shiny: false, moves: [{ id, pp: 1, max: 1 }] };
}
const fieldKnower = id => G.party.find(m => m.hp > 0 && m.moves.some(x => x.id === id)) || G.party.find(m => m.moves.some(x => x.id === id));
async function helperArrive(m) {
  if (!m || !m.helper) return;
  sfx("select"); await say(RIDE[m.helper].come);
}

// ---- 풀베기 ----
cutUser = function () { return fieldKnower("cut") || fieldHelper("cut"); };
cutTreeAt = async function (x, y) {
  const m = cutUser();
  if (!hasBadge(2) || !m) { await say("가는 나무가 길을 막고 있다.\f이 나무는 풀베기로\n베어 낼 수 있을 것 같다!"); return; }
  if ((await ask("이 나무는 풀베기로\n베어 낼 수 있을 것 같다!\f풀베기를 쓰겠습니까?", ["예", "아니오"])) !== 0) return;
  await helperArrive(m);
  await doCut(m, x, y);
};

// ---- 공중날기: 하늘택시 ----
const canFlyTaxi = () => !!(fieldKnower("fly") || fieldHelper("fly"));
async function callFlyTaxi() {
  const d = World.def;
  if (d.indoor || d.cave || !World.M.outdoor) { await say("하늘택시는 밖에서만\n부를 수 있다."); return; }
  const m = fieldKnower("fly") || fieldHelper("fly"); if (!m) return;
  const k = await show(new FlyMap()); if (!k) return;
  const spot = flySpot(k); if (!spot) return;
  if (m.helper) await helperArrive(m); else await say(`${J(mname(m), "은")}\n공중날기를 썼다!`);
  if (typeof fieldCutIn === "function") await fieldCutIn(m);
  sfx("jump"); await fadeOut(14);
  World.load(spot[0], spot[1], spot[2], "down"); World.cam = World.camTarget();
  await frames(4); await fadeIn(14); sfx("land");
  if (World.def.onEnter) await World.run(World.def.onEnter);
}
// 비전머신 설명(가방)
Object.assign(ITEMS.hm01, { d: "풀베기를 가르쳐요. 몇 번이고 쓸 수 있어요. 쪽빛 어사패가 있으면 배운 남켓몬이 없어도 도우미 칼깃매가 가는 나무를 베어 줘요." });
Object.assign(ITEMS.hm02, { d: "공중날기를 가르쳐요. 몇 번이고 쓸 수 있어요. 산성 어사패가 있으면 가방의 타운맵에서 '하늘택시'를 불러 가 본 마을로 날아가요." });
Object.assign(ITEMS.hm03, { d: "파도타기를 가르쳐요. 몇 번이고 쓸 수 있어요. 구룡 어사패가 있으면 배운 남켓몬이 없어도 남생배를 불러 물 위를 건너요." });
// 타운맵(가방): 하늘택시를 부를 수 있으면 고르게
(() => {
  const fu0 = window.fieldUse;
  window.fieldUse = async function (id) {
    if (id === "townmap" && canFlyTaxi()) {
      const v = await ask("타운맵을 펼쳤다.\f어떻게 할까?", ["지도 보기", "하늘택시 부르기", "그만두다"]);
      if (v === 0) { await show(new TownMap()); return; }
      if (v === 1) { fieldLater(callFlyTaxi); return; }
      return;
    }
    return fu0(id);
  };
})();
