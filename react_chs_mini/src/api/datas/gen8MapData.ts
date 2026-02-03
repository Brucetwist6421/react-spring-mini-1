// src/api/datas/gen8MapData.ts
export const GALAR_LOCATIONS: Record<
  string,
  { x: number; y: number; koName: string }
> = {
  // --- 주요 도시 및 마을 ---
  postwick: { x: 49.0, y: 94.5, koName: "펄롱마을" },
  wedgehurst: { x: 50.5, y: 88.5, koName: "브래시마을" },
  motostoke: { x: 50.0, y: 64.5, koName: "엔진시티" },
  turffield: { x: 30.5, y: 56.5, koName: "터프마을" },
  hulbury: { x: 71.5, y: 54.5, koName: "바우마을" },
  hammerlocke: { x: 50.0, y: 48.5, koName: "너클시티" },
  "stow-on-side": { x: 26.5, y: 44.5, koName: "래터마을" },
  ballonlea: { x: 22.5, y: 31.5, koName: "아라베스크마을" },
  circhester: { x: 80.5, y: 36.5, koName: "키르쿠스마을" },
  wyndon: { x: 50.0, y: 15.5, koName: "슛시티" },

  // --- 주요 도로 및 수로 ---
  "galar-route-1": { x: 50.0, y: 92.5, koName: "1번 도로" },
  "galar-route-2": { x: 57.0, y: 85.5, koName: "2번 도로" },
  "galar-route-3": { x: 46.5, y: 70.5, koName: "3번 도로" },
  "galar-route-4": { x: 38.0, y: 56.5, koName: "4번 도로" },
  "galar-route-5": { x: 51.5, y: 54.5, koName: "5번 도로" },
  "galar-route-6": { x: 35.5, y: 46.5, koName: "6번 도로" },
  "galar-route-7": { x: 67.5, y: 48.5, koName: "7번 도로" },
  "galar-route-8": { x: 74.5, y: 43.5, koName: "8번 도로" },
  "galar-route-9": { x: 87.5, y: 40.5, koName: "9번 도로" },
  "galar-route-10": { x: 50.0, y: 31.5, koName: "10번 도로" },

  // --- 와일드에리어 및 특수 구역 ---
  "wild-area": { x: 48.5, y: 76.5, koName: "와일드에리어" },
  "rolling-fields": { x: 45.0, y: 81.0, koName: "햇살비치는 초원" },
  "dappled-grove": { x: 40.0, y: 81.0, koName: "화사한 숲" },
  "watchtower-ruins": { x: 41.0, y: 77.0, koName: "감시탑 유적" },
  "stony-wilderness": { x: 50.0, y: 56.5, koName: "거인의 거울지" },
  "dusty-bowl": { x: 58.5, y: 50.0, koName: "모래먼지분지" },
  "glimwood-tangle": { x: 22.5, y: 34.5, koName: "루미너스메이즈 숲" },
  "slumbering-weald": { x: 35.0, y: 95.5, koName: "꾸벅꾸벅 숲" },
  "galar-mine": { x: 57.5, y: 72.5, koName: "가라르광산" },
  // --- 남부 영역 (Bottom) ---
  "route-1": { x: 50.0, y: 92.5, koName: "1번 도로" },
  "route-2": { x: 57.0, y: 85.5, koName: "2번 도로" },

  // --- 와일드에리어 및 엔진시티 ---
  "motostoke-riverbank": { x: 58.0, y: 64.5, koName: "엔진시티 강변" },

  // --- 서부 영역 (Left) ---
  "route-4": { x: 38.0, y: 56.5, koName: "4번 도로" },
  "route-5": { x: 51.5, y: 54.5, koName: "5번 도로" },

  // --- 중앙 영역 (Middle) ---
  "route-6": { x: 35.5, y: 46.5, koName: "6번 도로" },

  // --- 동부 및 북부 영역 (Right & Top) ---
  "route-7": { x: 67.5, y: 48.5, koName: "7번 도로" },
  "route-8": { x: 74.5, y: 43.5, koName: "8번 도로" },
  "route-9": { x: 87.5, y: 40.5, koName: "9번 도로" },
  "route-10": { x: 50.0, y: 31.5, koName: "10번 도로" },

  // --- 북부 구역 ---
  "route-3": { x: 43.5, y: 68.5, koName: "3번 도로" },
};
