// ===== v2.57 남원 남켓몬 리뉴얼 — ★남원 기술 12 · ★남원 특성 5 =====
// 사용자: "우렁댁 특성 바꿔줘. 남원 특유의 것으로." · "남원의 것들이 드러나는 남켓몬들을 대거 리뉴얼해줘.
//          신규기술, 신규특성 등 추가해서 아이들이 자주 그리고 많이 사용할 수 있도록."
// 원칙: 잘 잡히는(흔함·가끔) 남원 남켓몬이 이른 레벨에 배워서 바로 써 보게 · 효과는 실제 포켓몬 기술처럼 한 줄로 설명되는 것
//   기술: 오작교(유턴) · 뒤집기(씨름) · 방아찧기(2~5번) · 워낭소리(소리·마비) · 새쫓기(비행에 2배) · 부채바람(반드시 맞음)
//         수궁가(소리·혼란) · 옻칠하기(방어·특방) · 날개옷(특공·스피드) · 숯불(화상)
//         첫 남켓몬: 청사초롱(초롱삽·청사롱, 쓸 때마다 특공↑) · 요천물살(꾸무리·용꾸리·뚝꾸리, 쓸 때마다 스피드↑) — 몽쭉이 줄은 원래 철쭉꽃보라
//   특성: 향단이(우렁댁 — 「춘향가」의 향단이처럼 몰래 밥상) · 씨름꾼(샅바소 줄) · 달맞이(방아토·달방아) · 허수아비(허수니 줄) · 업(업스렁)
"use strict";
(() => {
  // ---------------- 기술 ----------------
  const NEW_MV = {
    ojakgyo: { n: "오작교", t: "비행", c: "P", bp: 70, acc: 100, pp: 20, pri: 0, tg: "normal", ct: 1, fx: "dash",
      d: "칠월 칠석에 까치들이 놓는 다리. 공격한 뒤 다리를 건너 돌아와 교대 남켓몬과 교체한다." },
    dwijipgi: { n: "뒤집기", t: "격투", c: "P", bp: 70, acc: 100, pp: 15, pri: 0, tg: "normal", ct: 1, fx: "punch",
      d: "씨름 기술. 샅바를 잡아 상대를 뒤집어 넘긴다. 상대의 능력 변화를 뒤집는다(오른 것은 내리고 내린 것은 올린다)." },
    bangajjitgi: { n: "방아찧기", t: "페어리", c: "P", bp: 25, acc: 100, pp: 20, pri: 0, tg: "normal", ct: 1, hits: [2, 5], fx: "punch",
      d: "달토끼가 절구를 쿵덕쿵덕 찧는다. 2~5번 연속으로 공격한다." },
    wonangsori: { n: "워낭소리", t: "전기", c: "S", bp: 70, acc: 100, pp: 15, pri: 0, tg: "normal", snd: 1, sec: { ch: 30, st: "par" }, fx: "sound",
      d: "일소 목에 걸린 워낭이 딸랑딸랑 울린다. 소리 기술. 30% 확률로 상대를 마비시킨다." },
    saejjotgi: { n: "새쫓기", t: "노말", c: "P", bp: 60, acc: 100, pp: 20, pri: 0, tg: "normal", fx: "tackle",
      d: "허수아비가 팔을 휘휘 저어 들판의 새를 쫓는다. 비행 타입 상대에게는 위력이 2배가 된다." },
    buchaebaram: { n: "부채바람", t: "비행", c: "S", bp: 70, acc: 101, pp: 15, pri: 0, tg: "normal", fx: "gust",
      d: "소리꾼의 합죽선을 촥 펼쳐 바람을 일으킨다. 공격은 반드시 맞는다." },
    sugungga: { n: "수궁가", t: "물", c: "S", bp: 80, acc: 100, pp: 10, pri: 0, tg: "normal", snd: 1, sec: { ch: 20, vol: "confusion" }, fx: "sound",
      d: "판소리 「수궁가」를 부른다. 별주부가 토끼를 꾀어 용궁으로 가는 대목. 소리 기술. 20% 확률로 상대를 혼란시킨다." },
    otchilhagi: { n: "옻칠하기", t: "독", c: "X", bp: 0, acc: 101, pp: 20, pri: 0, tg: "self", b: { def: 1, spd: 1 }, fx: "shine",
      d: "남원 목기에 옻칠을 덧입히듯 몸을 반들반들 칠한다. 방어와 특수방어가 올라간다." },
    nalgaeot: { n: "날개옷", t: "페어리", c: "X", bp: 0, acc: 101, pp: 20, pri: 0, tg: "self", b: { spa: 1, spe: 1 }, fx: "buff",
      d: "선녀의 날개옷을 걸친다. 특수공격과 스피드가 올라간다." },
    cheongsachorong: { n: "청사초롱", t: "불꽃", c: "S", bp: 80, acc: 100, pp: 10, pri: 0, tg: "normal", sec: { ch: 100, self: { spa: 1 } }, fx: "flame",
      d: "붉고 푸른 비단을 씌운 청사초롱 불빛을 쏟아 낸다. 쓸 때마다 자신의 특수공격이 올라간다." },
    yocheonmulsal: { n: "요천물살", t: "물", c: "P", bp: 80, acc: 100, pp: 10, pri: 0, tg: "normal", ct: 1, sec: { ch: 100, self: { spe: 1 } }, fx: "water",
      d: "남원을 가로지르는 요천의 물살을 타고 돌진한다. 쓸 때마다 자신의 스피드가 올라간다." },
    sutbul: { n: "숯불", t: "불꽃", c: "S", bp: 80, acc: 100, pp: 15, pri: 0, tg: "normal", sec: { ch: 30, st: "brn" }, fx: "flame",
      d: "지리산 참숯에 붙은 숯불을 쏟아붓는다. 30% 확률로 상대를 화상 상태로 만든다." },
  };
  for (const [k, v] of Object.entries(NEW_MV)) MV[k] = Object.assign({ id: k, orig: 1 }, v);
  if (typeof PIVOT !== "undefined") PIVOT.add("ojakgyo");
  // ---------------- 특성 ----------------
  const NEW_AB = {
    hyangdan: { n: "향단이", d: "춘향이를 돌보던 향단이처럼, HP가 처음으로 절반 아래가 된 턴이 끝나면 몰래 밥상을 차려 HP를 절반 회복하고 상태 이상을 고친다. 배틀마다 한 번." },
    ssireumkkun: { n: "씨름꾼", d: "샅바를 잡는 씨름 솜씨. 접촉하는 격투 기술의 위력이 1.3배가 된다." },
    dalmaji: { n: "달맞이", d: "저녁과 밤이 되면 달빛을 받아 기술의 위력이 1.3배가 된다." },
    heosuabi: { n: "허수아비", d: "들판을 지키는 허수아비. 비행 타입 상대에게 주는 데미지는 1.5배, 비행 타입에게서 받는 데미지는 절반이 된다." },
    eop: { n: "업", d: "집안의 재물을 지켜 주는 업. 이 남켓몬이 함께 다니면 트레이너에게 이겨서 받는 상금이 1.5배가 된다." },
  };
  for (const [k, v] of Object.entries(NEW_AB)) AB[k] = Object.assign({ orig: 1 }, v);
  // ---------------- 남켓몬 ----------------
  const learn = (k, lv, id) => { const m = MON[k]; if (!m || !MV[id] || m.ml.some(x => x[1] === id)) return;
    m.ml.push([lv, id]); m.ml.sort((a, b) => a[0] - b[0]); };
  [["kkajak", 15, "ojakgyo"], ["darijak", 16, "ojakgyo"], ["eunhajak", 1, "ojakgyo"],
   ["satbaso", 18, "dwijipgi"], ["ssireumso", 19, "dwijipgi"], ["cheonhajangso", 1, "dwijipgi"],
   ["bangato", 12, "bangajjitgi"], ["dalbanga", 12, "bangajjitgi"],
   ["ttallanggong", 18, "wonangsori"], ["wonangwang", 1, "wonangsori"], ["wonangwang", 18, "wonangsori"],
   ["heosuni", 12, "saejjotgi"], ["heosujang", 12, "saejjotgi"],
   ["nabichae", 14, "buchaebaram"],
   ["jararong", 30, "sugungga"], ["byeoljara", 30, "sugungga"],
   ["mokdongi", 17, "otchilhagi"], ["mokgiryeong", 17, "otchilhagi"],
   ["seonrok", 30, "nalgaeot"],
   ["sutkkeomi", 24, "sutbul"], ["chamsutjang", 24, "sutbul"],
   // 첫 남켓몬 최종 진화의 남원 기술(9세대 첫 남켓몬 전용 기술처럼) — 몽쭉이 줄은 원래 철쭉꽃보라
   ["chorongsap", 28, "cheongsachorong"], ["cheongsarong", 1, "cheongsachorong"], ["cheongsarong", 28, "cheongsachorong"],
   ["kkumuri", 28, "yocheonmulsal"], ["yongkkuri", 1, "yocheonmulsal"], ["yongkkuri", 28, "yocheonmulsal"], ["ttukkkuri", 1, "yocheonmulsal"], ["ttukkkuri", 28, "yocheonmulsal"]].forEach(a => learn(...a));
  const setAb = (k, norm, hid) => { if (MON[k]) MON[k].ab = [norm, hid]; };
  setAb("ureongdaek", ["hyangdan"], "naturalcure");
  for (const k of ["satbaso", "ssireumso", "cheonhajangso"]) setAb(k, ["ssireumkkun", "guts"], "intimidate");
  for (const k of ["bangato", "dalbanga"]) setAb(k, ["dalmaji", "cutecharm"], "naturalcure");
  setAb("heosuni", ["heosuabi", "cursedbody"], "intimidate");
  setAb("heosujang", ["heosuabi", "intimidate"], "cursedbody");
  setAb("eopseureong", ["eop", "multiscale"], "intimidate");

  // ---------------- 더 자주 만나게 ----------------
  // 우렁댁: 7·8번도로 밤에 드물게 → 낮에도 가끔 · 방아토: 만복사지(밤)뿐 → 광한루원(달나라 궁전 이름을 딴 곳)에도 저녁·밤에 가끔
  for (const z of ["7번도로", "8번도로"]) for (const e of (DATA.spawns[z] || [])) if (e.k === "ureongdaek") { e.r = "가끔"; e.t = "모두"; }
  if (DATA.spawns["광한루원"] && !DATA.spawns["광한루원"].some(e => e.k === "bangato")) DATA.spawns["광한루원"].push({ k: "bangato", lv: "4–7", t: "밤", r: "가끔" });   // "밤"은 저녁에도 나옴

  // ---------------- 배틀 ----------------
  const BP = Battle.prototype;
  // 데미지 셈: 새쫓기 · 씨름꾼 · 달맞이 · 허수아비
  BP.calc = (function (c0) {
    return function (a, d, mv, crit, mul) {
      let x = c0.call(this, a, d, mv, crit, mul);
      if (!mv || !a || !d || !a.m || !d.m) return x;
      const ab = a.m.ab, dab = ab === "moldbreaker" ? "" : d.m.ab, dT = this.types(d), aT = this.types(a);
      if (mv.id === "saejjotgi" && dT.includes("비행")) x *= 2;
      if (ab === "ssireumkkun" && mv.t === "격투" && mv.ct) x *= 1.3;
      if (ab === "dalmaji" && typeof timeOfDay === "function" && ["저녁", "밤"].includes(timeOfDay())) x *= 1.3;
      if (ab === "heosuabi" && dT.includes("비행")) x *= 1.5;
      if (dab === "heosuabi" && aT.includes("비행")) x *= 0.5;
      return Math.max(1, Math.floor(x));
    };
  })(BP.calc);
  // 뒤집기: 맞힌 뒤 상대 능력 변화를 뒤집음
  BP.useMove = (function (u0) {
    return async function (s, id) {
      const d0 = this.w[this.other(s)];
      const r = await u0.call(this, s, id);
      if (id === "dwijipgi" && d0 && d0 === this.w[this.other(s)] && d0.m.hp > 0 && d0.vol.hurtT === this.turnNo) {
        const st = d0.stg, any = Object.values(st).some(v => v);
        if (any) { for (const k in st) st[k] = -st[k]; await this.say(`${this.nm(d0.side)}의\n능력 변화가 뒤집혔다!`); }
      }
      return r;
    };
  })(BP.useMove);
  // 향단이(우렁댁): 턴이 끝날 때
  BP.endTurn = (function (e0) {
    return async function () {
      const r = await e0.call(this); if (r) return r;
      this.ugUsed = this.ugUsed || new Set();
      for (const s of ["P", "E"]) {
        const w = this.w[s]; if (!w || !w.m || w.m.hp <= 0 || w.m.ab !== "hyangdan" || this.ugUsed.has(w.m.uid)) continue;
        const M = w.m; if (M.hp > M.st[0] / 2) continue;
        this.ugUsed.add(M.uid);
        await this.say(`${this.nm(s)}의 [${AB.hyangdan.n}]!\n몰래 따뜻한 밥상을 차렸다!`);
        if (Save.opt.anim) await FX.play("heal", { side: s }, { side: s }, "풀");
        M.hp = Math.min(M.st[0], M.hp + Math.floor(M.st[0] / 2)); sfx("heal_hp"); await this.hpWait(s);
        const st0 = M.status; M.status = null; M.slp = 0; M.tox = 0;
        await this.say(`${this.nm(s)}의 HP가\n회복되었다!` + (st0 ? "\f상태 이상도 말끔히 나았다!" : ""));
      }
      return null;
    };
  })(BP.endTurn);
  // 업: 상금 1.5배
  BP.finish = (function (f0) {
    return async function (r) {
      const T = !this.wild && this.o.trainer;
      if (r === "win" && T && T.prize && !this.eopDone && G.party.some(m => m.ab === "eop")) { this.eopDone = true; T.prize = Math.floor(T.prize * 1.5); }
      return f0.call(this, r);
    };
  })(BP.finish);
})();
