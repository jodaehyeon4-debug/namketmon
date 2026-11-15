// ===== v2.74 오방담 계열 특성 손질 · 전 종 기술폭 점검(실전 네 칸) · 기술 떠올리기 =====
// 사용자 플레이 피드백: "오방담 계열 특성이 너무 약하다", "방망도채가 선공기가 없다", "모든 남켓몬이 실전 네 칸을 채울 수 있게".
// 실제 포켓몬처럼 묘사(레벨업 기술표 · 특성 · 기술 떠올리기 — 구조만, 닌텐도 자료는 베끼지 않음). data.js는 그대로 두고 여기서 덧씀.
"use strict";
(function movesV274() {
  if (typeof MON === "undefined" || typeof MV === "undefined") return;
  // ---- 1) 오방담 계열 특성: [보통 특성들, 숨은 특성] ----
  const ABIL = {
    obangdam:  [["adaptability", "pickup"], "quickfeet"],        // 적응력(자속 강화) · 픽업 / 속보
    cheongdam: [["naturalcure", "regenerator"], "chlorophyll"],  // 자연회복 · 재생력 / 엽록소
    jeokdam:   [["flamebody", "solarpower"], "sheerforce"],      // 불꽃몸 · 선파워 / 우격다짐
    hwangdam:  [["intimidate", "stamina"], "solidrock"],         // 위협 · 지구력 / 하드록
    baekdam:   [["toughclaws"], "moxie"],                        // 단단한발톱 / 자기과신
    heukdam:   [["regenerator", "shellarmor"], "magicbounce"],   // 재생력 · 조가비갑옷 / 매직미러
  };
  const OLD = {};
  for (const k in ABIL) { const M = MON[k]; if (!M) continue; if (ABIL[k].flat().some(a => !AB[a])) continue; OLD[k] = M.ab; M.ab = ABIL[k]; }
  // 이미 데리고 있는 아이: 예전 특성 자리를 새 특성 같은 자리로 옮김
  function migrate(m) { if (!m || !OLD[m.k]) return; const N = MON[m.k].ab; if (N[0].includes(m.ab) || N[1] === m.ab) return;
    const o = OLD[m.k], i = o[0].indexOf(m.ab); m.ab = i >= 0 ? N[0][Math.min(i, N[0].length - 1)] : (o[1] === m.ab ? N[1] : N[0][0]); }
  function migrateAll() { try { (G.party || []).forEach(migrate); for (const b of G.boxes || []) (b.m || []).forEach(migrate); (G.box || []).forEach(migrate); } catch (e) { if (typeof nkErr === "function") nkErr("migrate274", e); } }
  if (typeof World !== "undefined" && World.load) { const wl = World.load; World.load = function () { migrateAll(); return wl.apply(this, arguments); }; }

  // ---- 2) 기술폭: 종마다 레벨업 기술 더하기 [레벨, 기술] ----
  const ADD = {
    // 선공기(느린 물리 공격수)
    dochaedong: [[15, "shadowsneak"]], bangmangdochae: [[15, "shadowsneak"], [37, "knockoff"]],
    heosujang: [[20, "shadowsneak"]], gulsojang: [[22, "machpunch"], [56, "closecombat"]], chamjipwang: [[18, "aquajet"]],
    bandaljanggun: [[22, "machpunch"], [60, "closecombat"]], gaegoljang: [[58, "closecombat"]],
    // 자속·견제·보조가 비던 종
    ttukkkuri: [[38, "shadowball"], [46, "icebeam"], [30, "confuseray"]],
    eunhajak: [[40, "dazzlinggleam"], [48, "roost"]], nabichae: [[38, "energyball"]], beondami: [[40, "bugbuzz"], [46, "roost"]],
    eopseureong: [[42, "shadowball"]], bangato: [[30, "psychic"]], dalbanga: [[40, "psychic"], [48, "icebeam"]],
    gatseonbi: [[40, "earthpower"], [34, "synthesis"]], jangsuppul: [[44, "agility"], [54, "closecombat"]],
    wonanggeum: [[36, "calmmind"], [44, "icebeam"], [50, "roost"]], chamsutjang: [[50, "earthquake"]],
    neokbulhak: [[40, "airslash"], [48, "calmmind"]], dukkeojang: [[46, "earthquake"], [54, "stoneedge"]],
    jiriam: [[50, "hammerarm"]], geumulgeo: [[30, "stickyweb"], [38, "nightslash"], [46, "leechlife"]],
    eollekkot: [[40, "psychic"], [34, "synthesis"]], eosapae: [[36, "psychic"], [48, "highhorsepower"]],
    cheongdungdae: [[40, "icebeam"], [48, "roost"], [56, "bravebird"]], gujeongwang: [[40, "crunch"], [50, "earthquake"]],
    daseultap: [[52, "stoneedge"]], bagureong: [[36, "dragonclaw"], [48, "stoneedge"]],
    seonrok: [[36, "psychic"], [44, "mysticalfire"]], wonangwang: [[34, "voltswitch"], [26, "thunderwave"]],
    bomulbak: [[40, "energyball"], [50, "earthpower"]], simsulbak: [[40, "crunch"], [50, "drainpunch"]],
    boeunbi: [[40, "energyball"], [48, "roost"]], mokgiryeong: [[38, "energyball"], [48, "earthpower"]],
    neogulmi: [[32, "crunch"], [40, "playrough"], [46, "uturn"]],
    kalgitmae: [[36, "swordsdance"], [44, "nightslash"], [52, "bravebird"], [58, "closecombat"], [30, "roost"]],
    maetdolmet: [[44, "bulkup"], [54, "stoneedge"]], ureongdaek: [[30, "leechseed"], [38, "gigadrain"], [46, "icebeam"]],
    eunrinwang: [[40, "icebeam"], [48, "dazzlinggleam"]], chireyong: [[34, "scald"], [42, "icebeam"], [50, "dragondance"]],
    beomageom: [[34, "swordsdance"], [42, "nightslash"], [50, "leafblade"]], seorikkot: [[36, "calmmind"], [44, "gigadrain"]],
    ureureung: [[40, "uproar"], [48, "roost"]], danpungbul: [[38, "flamethrower"], [44, "energyball"], [50, "airslash"]],
    heukdoni: [[40, "bodyslam"], [50, "earthquake"]], dancheongmong: [[40, "shadowball"], [48, "calmmind"]],
    gusangryeong: [[40, "synthesis"], [48, "earthpower"]], takrankkuk: [[32, "uturn"], [40, "nightslash"], [48, "roost"]],
    eunbingeo: [[42, "dazzlinggleam"]], kkulbeong: [[18, "toxicspikes"]],
    // 오방담 계열
    obangdam: [[30, "facade"], [38, "bodyslam"]], cheongdam: [[45, "synthesis"], [50, "earthpower"]],
    jeokdam: [[38, "willowisp"], [45, "extrasensory"], [50, "solarbeam"]], hwangdam: [[46, "stoneedge"], [50, "ironhead"], [56, "dragondance"]],
    baekdam: [[45, "swordsdance"], [56, "closecombat"]], heukdam: [[35, "stealthrock"], [46, "taunt"], [50, "crunch"]],
    // 전설·환상
    horyeongsan: [[50, "bulkup"], [60, "closecombat"], [66, "stoneedge"]], geumseom: [[50, "calmmind"], [58, "moonlight"], [64, "icebeam"]],
    nogoma: [[50, "playrough"], [58, "stoneedge"], [64, "earthquake"]], cheonmireu: [[55, "fly"], [62, "roost"]],
    honguseong: [[55, "bulkup"], [62, "flareblitz"], [68, "stoneedge"]], eunjikseong: [[55, "calmmind"], [62, "shadowball"], [68, "moonlight"]],
    unhaeryong: [[55, "shadowball"], [62, "calmmind"]],
  };
  const added = [];
  for (const k in ADD) { const M = MON[k]; if (!M) continue;
    for (const [lv, id] of ADD[k]) { if (!MV[id] || M.ml.some(x => x[1] === id)) continue; M.ml.push([lv, id]); added.push([k, lv, id]); }
    M.ml = M.ml.map((x, i) => [x, i]).sort((a, b) => (a[0][0] - b[0][0]) || (a[1] - b[1])).map(x => x[0]); }

  // ---- 3) 기술 떠올리기: 레벨이 지나 놓친 기술을 파티 화면에서 다시 배움(9세대처럼 언제든, 무료) ----
  function remindList(m) { const M = MON[m.k]; const out = [];
    for (const [lv, id] of M.ml) if (lv <= m.lv && MV[id] && !m.moves.some(x => x.id === id) && !out.includes(id)) out.push(id);
    return out; }
  async function remindMenu(m) {
    const L = remindList(m);
    if (!L.length) { await say(`${J(mname(m), "은")} 지금\n떠올릴 기술이 없다.`); return false; }
    let pg = 0; const PER = 5;
    while (true) {
      const part = L.slice(pg * PER, pg * PER + PER), more = L.length > PER;
      const items = part.map(id => `${MV[id].n}`).concat(more ? ["다음 ▶"] : [], ["그만두다"]);
      const v = await ask(`어느 기술을 떠올릴까?${more ? `  (${pg + 1}/${Math.ceil(L.length / PER)})` : ""}`, items);
      if (v < 0 || v === items.length - 1) return false;
      if (more && v === part.length) { pg = (pg + 1) % Math.ceil(L.length / PER); continue; }
      const id = part[v], mv = MV[id];
      const c = await ask(`${mv.n}  ${mv.t} · ${mv.c === "P" ? "물리" : mv.c === "S" ? "특수" : "변화"}${mv.bp ? " · 위력 " + mv.bp : ""}\n${String(mv.d || "").slice(0, 34)}`, ["떠올린다", "다른 기술"]);
      if (c !== 0) continue;
      return await learnMove(m, id, say);
    }
  }
  window.MOVES_V274 = { ABIL, ADD, added, migrate, migrateAll, remindList, remindMenu };
})();
