// src/api/datas/gen9MapData.ts
export const PALDEA_LOCATIONS: Record<
  string,
  { x: number; y: number; koName: string }
> = {
  // --- 남부 영역 (Bottom) ---
  postwick: { x: 49.0, y: 94.5, koName: "펄롱마을" },
  wedgehurst: { x: 50.5, y: 88.5, koName: "브래시마을" },
  "slumbering-weald": { x: 35.0, y: 95.5, koName: "꾸벅꾸벅 숲" },
  "galar-route-1": { x: 50.0, y: 92.5, koName: "1번 도로" },
  "galar-route-2": { x: 57.0, y: 85.5, koName: "2번 도로" },

  // --- 와일드에리어 (중앙 하단 넓은 평원) ---
  "rolling-fields": { x: 45.0, y: 81.0, koName: "햇살비치는 초원" },
  "dappled-grove": { x: 40.0, y: 81.0, koName: "화사한 숲" },
  "watchtower-ruins": { x: 41.0, y: 77.0, koName: "감시탑 유적" },
  "east-lake-axewell": { x: 58.0, y: 75.0, koName: "액스웰호 동쪽" },
  "motostoke-riverbank": { x: 58.0, y: 64.5, koName: "엔진시티 강변" },

  // --- 엔진시티 및 주변부 ---
  motostoke: { x: 50.0, y: 64.5, koName: "엔진시티" },
  "galar-route-3": { x: 46.5, y: 70.5, koName: "3번 도로" },
  "galar-mine": { x: 57.5, y: 72.5, koName: "가라르광산" },

  // --- 서부/중부 영역 ---
  turffield: { x: 30.5, y: 56.5, koName: "터프마을" },
  "galar-route-4": { x: 38.0, y: 56.5, koName: "4번 도로" },
  hulbury: { x: 71.5, y: 54.5, koName: "바우마을" },
  "galar-route-5": { x: 51.5, y: 54.5, koName: "5번 도로" },
  "stony-wilderness": { x: 50.0, y: 56.5, koName: "거인의 거울지" },

  // --- 너클시티 및 북서부 ---
  hammerlocke: { x: 50.0, y: 48.5, koName: "너클시티" },
  "galar-route-6": { x: 35.5, y: 46.5, koName: "6번 도로" },
  "stow-on-side": { x: 26.5, y: 44.5, koName: "래터마을" },
  "glimwood-tangle": { x: 22.5, y: 34.5, koName: "루미너스메이즈 숲" },
  ballonlea: { x: 22.5, y: 31.5, koName: "아라베스크마을" },

  // --- 동북부 영역 ---
  "galar-route-7": { x: 67.5, y: 48.5, koName: "7번 도로" },
  "galar-route-8": { x: 74.5, y: 43.5, koName: "8번 도로" },
  circhester: { x: 80.5, y: 36.5, koName: "키르쿠스마을" },
  "galar-route-9": { x: 87.5, y: 40.5, koName: "9번 도로" },

  // --- 최북단 영역 (Top) ---
  "galar-route-10": { x: 50.0, y: 31.5, koName: "10번 도로" },
  wyndon: { x: 50.0, y: 15.5, koName: "슛시티" },
  // --- 중앙 (The Great Crater) ---
  "area-zero": { x: 50.0, y: 50.0, koName: "에리어 제로" },
  mesagoza: { x: 50.0, y: 62.0, koName: "테이블시티" },

  // --- 남부 (South Province) ---
  "poco-path": { x: 47.0, y: 88.0, koName: "코사지마을" },
  "los-platos": { x: 50.0, y: 75.0, koName: "플라토마을" },
  "south-province-area-one": { x: 65.0, y: 85.0, koName: "남부 에리어 1" },
  "south-province-area-six": {
    x: 30.0,
    y: 85.0,
    koName: "남부 에리어 6(알포르나)",
  },

  // --- 서부 (West Province) ---
  cortondo: { x: 35.0, y: 68.0, koName: "세르클마을" },
  cascarrafa: { x: 28.0, y: 53.0, koName: "카라프시티" },
  "porto-marinada": { x: 15.0, y: 45.0, koName: "마리나드마을" },
  medali: { x: 40.0, y: 40.0, koName: "참플마을" },

  // --- 북부 (North Province) ---
  montenevera: { x: 50.0, y: 25.0, koName: "프리지마을" },
  "glaseado-mountain": { x: 50.0, y: 15.0, koName: "나페산" },
  "casseroya-lake": { x: 20.0, y: 25.0, koName: "오야 호수" },
  "north-province-area-two": { x: 75.0, y: 20.0, koName: "북부 에리어 2" },

  // --- 동부 (East Province) ---
  artazon: { x: 72.0, y: 65.0, koName: "보울마을" },
  levincia: { x: 85.0, y: 50.0, koName: "누룩스시티" },
  zapapico: { x: 70.0, y: 42.0, koName: "피케마을" },
  "east-province-area-three": { x: 80.0, y: 35.0, koName: "동부 에리어 3" },
};
