export const SINNOH_LOCATIONS: Record<
  string,
  { x: number; y: number; koName: string }
> = {

  // --- 주요 도시 (마을 입구/중심 기준) ---
  "twinleaf-town": { x: 17.5, y: 84.5, koName: "떡잎마을" },
  "sandgem-town": { x: 27.5, y: 80.5, koName: "잔모래마을" },
  "jubilife-city": { x: 27.0, y: 66.5, koName: "축복시티" },
  "oreburgh-city": { x: 44.5, y: 67.5, koName: "무쇠시티" },
  "floaroma-town": { x: 25.5, y: 46.5, koName: "꽃향기마을" },
  "eterna-city": { x: 46.5, y: 36.5, koName: "영원시티" },
  "hearthome-city": { x: 57.5, y: 61.5, koName: "연고시티" },
  "solaceon-town": { x: 77.0, y: 55.5, koName: "신수마을" },
  "veilstone-city": { x: 89.0, y: 42.0, koName: "장막시티" },
  "pastoria-city": { x: 74.0, y: 80.5, koName: "들판시티" },
  "celestic-town": { x: 62.5, y: 37.5, koName: "봉신마을" },
  "canalave-city": { x: 7.5, y: 66.5, koName: "운하시티" },
  "snowpoint-city": { x: 54.0, y: 11.5, koName: "선단시티" },
  "sunyshore-city": { x: 96.0, y: 72.0, koName: "물가시티" },
  "pokemon-league": { x: 96.5, y: 45.0, koName: "포켓몬 리그" },

  // --- 주요 던전 및 랜드마크 (이미지 랜드마크 중심) ---
  "mt-coronet": { x: 56.5, y: 48.0, koName: "천관산" },
  "spear-pillar": { x: 56.5, y: 42.5, koName: "창기둥" }, // 검은 구멍 정중앙
  "lake-verity": { x: 15.0, y: 76.5, koName: "진실호수" },
  "lake-valor": { x: 89.0, y: 63.0, koName: "입지호수" },
  "lake-acuity": { x: 45.5, y: 11.5, koName: "예지호수" },
  "stark-mountain": { x: 77.5, y: 4.5, koName: "하드마운틴" },
  "iron-island": { x: 6.5, y: 47.5, koName: "강철섬" },
  "old-chateau": { x: 32.5, y: 34.0, koName: "숲의 양옥집" },
  "solaceon-ruins": { x: 80.5, y: 55.5, koName: "신수유적" },
  "turnback-cave": { x: 93.0, y: 56.0, koName: "귀환의 동굴" },
  "fuego-ironworks": { x: 19.5, y: 40.5, koName: "골풀무제철소" },

  // --- 주요 도로 (길의 중간 지점) ---
  "route-201": { x: 22.0, y: 84.5, koName: "201번 도로" },
  "route-202": { x: 27.5, y: 73.5, koName: "202번 도로" },
  "route-203": { x: 36.5, y: 66.5, koName: "203번 도로" },
  "route-205": { x: 36.5, y: 42.0, koName: "205번 도로" },
  "route-209": { x: 67.5, y: 61.5, koName: "209번 도로" },
  "route-210": { x: 77.0, y: 46.5, koName: "210번 도로" },
  "route-212": { x: 63.5, y: 80.5, koName: "212번 도로" },
  "route-216": { x: 42.5, y: 17.5, koName: "216번 도로" },
  "route-217": { x: 54.0, y: 22.5, koName: "217번 도로" },
  "route-222": { x: 87.5, y: 72.0, koName: "222번 도로" },
  "route-225": { x: 47.5, y: 7.5, koName: "225번 도로" },
  "route-228": { x: 82.5, y: 7.5, koName: "228번 도로" },
  
  // --- 보강 데이터 ---
  "victory-road": { x: 96.5, y: 53.5, koName: "챔피언로드" },
  "trophy-garden": { x: 63.5, y: 73.5, koName: "자랑의 뒷마당" },
  "snowpoint-temple": { x: 54.0, y: 7.0, koName: "선단신전" },

  // --- 주요 던전 및 랜드마크 ---
  "oreburgh-gate": { x: 34.0, y: 67.0, koName: "무쇠게이트" },
  "ravaged-path": { x: 25.5, y: 57.0, koName: "험한 샛길" },
  "eterna-forest": { x: 33.5, y: 37.0, koName: "영원의 숲" },
  "wayward-cave": { x: 47.5, y: 46.5, koName: "미혹의 동굴" },
  "great-marsh": { x: 71.5, y: 75.5, koName: "대습원" },

  // --- 주요 도로 및 수로 ---
  // --- 누락된 도로 및 수로 보강 ---
  "route-207": { x: 42.5, y: 64.5, koName: "207번 도로" },
  "route-208": { x: 48.5, y: 64.5, koName: "208번 도로" },
  "route-211": { x: 50.5, y: 39.5, koName: "211번 도로" },
  "route-213": { x: 82.5, y: 83.5, koName: "213번 도로" },
  "route-214": { x: 86.5, y: 55.5, koName: "214번 도로" },
  "route-215": { x: 80.5, y: 44.5, koName: "215번 도로" },
  "route-218": { x: 15.5, y: 69.5, koName: "218번 도로" },
  "route-219": { x: 26.5, y: 90.0, koName: "219번 도로" },
  "route-220": { x: 20.5, y: 94.0, koName: "220번 수로" },
  "route-221": { x: 45.5, y: 94.0, koName: "221번 도로" },
  "route-223": { x: 94.5, y: 60.5, koName: "223번 수로" },
  "route-226": { x: 60.5, y: 5.5, koName: "226번 수로" },
  "route-227": { x: 70.5, y: 5.5, koName: "227번 도로" },
  "route-229": { x: 80.5, y: 20.5, koName: "229번 도로" },
  "route-230": { x: 70.5, y: 20.5, koName: "230번 수로" },

  // --- 추가 던전 및 명소 ---
  "lost-tower": { x: 65.5, y: 58.5, koName: "포켓몬저택(자랑의 뒷마당)" },
  "pal-park": { x: 45.5, y: 88.5, koName: "팔파크" },
  "fullmoon-island": { x: 10.5, y: 10.5, koName: "만월섬" },
  "newmoon-island": { x: 15.5, y: 10.5, koName: "신월섬" },
  // --- 마지막 세부 명소 보강 ---
  "mt-coronet-summit": { x: 54.5, y: 44.5, koName: "천관산 산정" }, // 전설의 포켓몬 등장
  "stark-mountain-interior": { x: 75.5, y: 2.5, koName: "하드마운틴 내부" }, // 히드런 서식지
  "maniac-tunnel": { x: 70.0, y: 55.5, koName: "유적마니아굴" }, // 하마돈 등 등장
  "oreburgh-mine": { x: 42.5, y: 75.5, koName: "무쇠탄광" }, // 꼬마돌, 롱스톤 등

};