// src/constants/regions.ts
import { KANTO_LOCATIONS } from "../../../../api/datas/gen1MapData";
import { JOHTO_LOCATIONS } from "../../../../api/datas/gen2MapData";
import { HOENN_LOCATIONS } from "../../../../api/datas/gen3MapData";
import { SINNOH_LOCATIONS } from "../../../../api/datas/gen4MapData";
import { UNOVA_LOCATIONS } from "../../../../api/datas/gen5MapData";
import { KALOS_LOCATIONS } from "../../../../api/datas/gen6MapData";
import { ALOLA_LOCATIONS } from "../../../../api/datas/gen7MapData";
// ✅ 성도지방 데이터가 준비되었다면 주석을 해제하세요.
// import { JOHTO_LOCATIONS } from "../../../../api/datas/gen2MapData";
// import { HOENN_LOCATIONS } from "../../../../api/datas/gen3MapData";

export const REGION_METADATA = {
  kanto: {
    id: 'kanto' as const, // 1세대
    koName: '관동',
    img: '/images/maps/kanto_map.png',
    locations: KANTO_LOCATIONS,
  },
  johto: {
    id: 'johto' as const, // 2세대
    koName: '성도',
    img: '/images/maps/johto_map.png',
    locations: JOHTO_LOCATIONS,
  },
  hoenn: {
    id: 'hoenn' as const, // 3세대
    koName: '호연',
    img: '/images/maps/hoenn_map.png',
    locations: HOENN_LOCATIONS,
  },
  sinnoh: {
    id: 'sinnoh' as const, // 4세대
    koName: '신오',
    img: '/images/maps/sinnoh_map.png',
    locations: SINNOH_LOCATIONS,
  },
  unova: {
    id: 'unova' as const, // 5세대
    koName: '하나',
    img: '/images/maps/unova_map.png',
    locations: UNOVA_LOCATIONS,
  },
  kalos: {
    id: 'kalos' as const, // 6세대
    koName: '칼로스', // 
    img: '/images/maps/kalos_map.png',
    locations: KALOS_LOCATIONS, //
  },
  alola: {
    id: 'alola' as const, // 7세대
    koName: '알로라',
    img: '/images/maps/alola_map.jpg', // 
    locations: ALOLA_LOCATIONS,
  },
};

// 자동으로 'kanto' | 'johto' | 'hoenn' | 'sinnoh' | 'unova' 타입이 생성.
export type RegionId = keyof typeof REGION_METADATA;