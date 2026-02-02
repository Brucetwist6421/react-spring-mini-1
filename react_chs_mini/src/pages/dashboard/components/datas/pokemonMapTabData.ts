// src/constants/regions.ts
import { KANTO_LOCATIONS } from "../../../../api/datas/gen1MapData";
import { JOHTO_LOCATIONS } from "../../../../api/datas/gen2MapData";
// ✅ 성도지방 데이터가 준비되었다면 주석을 해제하세요.
// import { JOHTO_LOCATIONS } from "../../../../api/datas/gen2MapData";
// import { HOENN_LOCATIONS } from "../../../../api/datas/gen3MapData";

export const REGION_METADATA = {
  kanto: {
    id: 'kanto' as const, // 타입을 리터럴로 고정
    koName: '관동',
    img: '/images/maps/kanto_map.png',
    locations: KANTO_LOCATIONS,
  },
  johto: {
    id: 'johto' as const,
    koName: '성도',
    img: '/images/maps/johto_map.png',
    locations: JOHTO_LOCATIONS,
  },
  hoenn: {
    id: 'hoenn' as const,
    koName: '호연',
    img: '/images/maps/hoenn_map.png',
    locations: {},
  },
};

// ✅ 자동으로 'kanto' | 'johto' | 'hoenn' 타입이 생성됩니다.
export type RegionId = keyof typeof REGION_METADATA;