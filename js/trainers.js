// ===== v1.3 날씨 전략을 쓰는 관장·산지기 (nk/wx_leaders.json → src/gen_trainers.py 로 생성) =====
"use strict";
const LEADERS = {
 "sinha": {
  "id": "leader_sinha",
  "cls": "관장",
  "name": "신하",
  "spr": "gl_sinha",
  "type": "물",
  "wx": "rain",
  "indoor": true,
  "bg": "indoor",
  "base": 120,
  "intro": "신하: 복도에서 누가 뛰어다니냐-!\f……아, 도전자구나.\n기다린 건 아니고.\f오늘 밤 하늘은 별 대신 비야.\n빗속의 물 남켓몬, 감당할 수 있겠어?",
  "lose": "신하: ……비가 그쳤네.\n별이 보여.\f흥, 이번엔 네가 이겼다고 해 두지.\n구룡 어사패, 가져가.",
  "music": "eyes",
  "bgm": "battle_gym",
  "team": [
   [
    "chireyong",
    27,
    {
     "ab": "drizzle",
     "mv": [
      "bubblebeam",
      "twister",
      "raindance",
      "growl"
     ]
    }
   ],
   [
    "eunchimi",
    28,
    {
     "ab": "swiftswim",
     "mv": [
      "waterfall",
      "aquacutter",
      "icywind",
      "waterpulse"
     ]
    }
   ],
   [
    "gaegulmi",
    29,
    {
     "ab": "hydration",
     "mv": [
      "bodyslam",
      "aquacutter",
      "bubblebeam",
      "raindance"
     ]
    }
   ],
   [
    "megijang",
    30,
    {
     "ab": "hydration",
     "mv": [
      "waterfall",
      "mudbomb",
      "waterpulse",
      "mudshot"
     ]
    }
   ]
  ]
 },
 "seola": {
  "id": "leader_seola",
  "cls": "산지기",
  "name": "설아",
  "spr": "seola",
  "type": "얼음",
  "wx": "hail",
  "indoor": true,
  "bg": "indoor",
  "base": 200,
  "intro": "설아: 반야봉 관측소의 설아야.\f산 위 날씨는 하루에도\n몇 번씩 바뀌어.\f오늘 예보는 '싸라기눈'.\f눈 속에 숨은 내 남켓몬들,\n찾아낼 수 있을까?",
  "lose": "설아: 관측 일지에 적어 둘게.\n'도전자, 눈보라를 뚫고 지나감.'\f……날씨는 못 바꿔도\n옷은 단단히 챙길 수 있잖아.\f네 남켓몬들, 단단히 챙겼네.",
  "music": "eyes",
  "bgm": "battle_gym",
  "team": [
   [
    "godeumi",
    53,
    {
     "ab": "icebody",
     "mv": [
      "hail",
      "blizzard",
      "freezedry",
      "iciclecrash"
     ]
    }
   ],
   [
    "gusangmi",
    54,
    {
     "ab": "naturalcure",
     "mv": [
      "woodhammer",
      "iciclecrash",
      "hail",
      "leechseed"
     ]
    }
   ],
   [
    "gusangryeong",
    55,
    {
     "ab": "stamina",
     "mv": [
      "woodhammer",
      "iciclecrash",
      "leafblade",
      "hail"
     ]
    }
   ],
   [
    "seorikkot",
    56,
    {
     "ab": "icebody",
     "mv": [
      "icebeam",
      "dazzlinggleam",
      "freezedry",
      "hail"
     ]
    }
   ],
   [
    "baekdam",
    57,
    {
     "ab": "snowcloak",
     "mv": [
      "icespinner",
      "ironhead",
      "iciclecrash",
      "crunch"
     ]
    }
   ]
  ]
 },
 "igeul": {
  "id": "leader_igeul",
  "cls": "산지기",
  "name": "이글",
  "spr": "igeul",
  "type": "불꽃",
  "wx": "sun",
  "indoor": true,
  "bg": "indoor",
  "base": 200,
  "intro": "이글: 낙화놀이 본 적 있어?\n숯가루 불꽃이 비처럼 쏟아지는 거!\f오늘은 내가 해를 띄울게.\n쨍쨍한 햇볕 아래 불꽃은 더 뜨겁다고!",
  "lose": "이글: 와, 불꽃이 다 떨어졌네!\n멋진 공연이었어!\f불꽃은 금방 지지만\n본 사람 마음엔 오래 남는대.",
  "music": "eyes",
  "bgm": "battle_gym",
  "team": [
   [
    "jeokdam",
    54,
    {
     "ab": "flamebody",
     "mv": [
      "sunnyday",
      "flamethrower",
      "airslash",
      "lavaplume"
     ]
    }
   ],
   [
    "chamsutjang",
    55,
    {
     "ab": "flamebody",
     "mv": [
      "flareblitz",
      "powergem",
      "firepunch",
      "ancientpower"
     ]
    }
   ],
   [
    "danpungbul",
    56,
    {
     "ab": "chlorophyll",
     "mv": [
      "energyball",
      "flamethrower",
      "petaldance",
      "growth"
     ]
    }
   ],
   [
    "honbulsae",
    57,
    {
     "ab": "honbul",
     "mv": [
      "flamethrower",
      "shadowball",
      "inferno",
      "willowisp"
     ]
    }
   ],
   [
    "hwaryongjeong",
    58,
    {
     "ab": "solarpower",
     "mv": [
      "flamethrower",
      "dragonclaw",
      "heatwave",
      "airslash"
     ]
    }
   ]
  ]
 }
};
// 배움터·리그가 열리면 이야기에서 부른다. 지금은 확인용: __nk.leader("sinha" | "seola" | "igeul")
async function leaderBattle(id) { const T = LEADERS[id]; const P = World.player;
  return trainerBattle({ x: P.x, y: P.y - 1, dir: "down", trainer: T }, false); }
window.__nk && (window.__nk.leader = id => World.run(() => leaderBattle(id)));
