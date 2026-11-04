// ===== v2.45.1 타운맵 레벨을 실제 출현표·관장 팀에서 셈 =====
// 장마다 손으로 고치던 도로 '야생 Lv'가 출현표와 어긋나던 것(11번도로 동치무 20–24, 17번도로 50–53 등)을 맞춤
// 실제 게임 타운맵처럼 그 도로 풀숲(낚시·파도타기 빼고)에 나오는 남켓몬의 가장 낮은~높은 레벨 · 배움터 칸 레벨은 실제 관장 팀
"use strict";
(() => {
  const T = DATA.town; if (!T) return;
  const rng = list => { const a = []; for (const e of list || []) for (const v of String(e.lv).split(/[–~-]/).map(Number)) if (!isNaN(v)) a.push(v);
    if (!a.length) return null; const lo = Math.min(...a), hi = Math.max(...a); return lo === hi ? "" + lo : lo + "~" + hi; };
  for (const r of T.routes || []) { const v = rng(DATA.spawns[r.no + "번도로"]); if (v) r.lv = v; }
  const team = n => { try { return { 1: CHANHYANG, 2: MIYEONG, 3: SUHYEON, 4: { team: SINHA4_TEAM }, 5: GISU5, 6: YEOSIM6, 7: HEEJU7, 8: JOBAKSA8 }[n].team; } catch (e) { return null; } };
  const lgTeams = () => { try { return [HAERANG, LEADERS.seola, LEADERS.igeul, YEONGRAN, MRHWANG].flatMap(x => x.team); } catch (e) { return null; } };
  const lv = t => t && rng(t.map(x => ({ lv: Array.isArray(x) ? x[1] : x.lv })));
  for (const p of T.places || []) { if (!p.gym) continue;
    const v = p.gym[0] === "리그" ? lv(lgTeams()) : lv(team(p.gym[0])); if (v) p.gym[3] = v; }
})();
