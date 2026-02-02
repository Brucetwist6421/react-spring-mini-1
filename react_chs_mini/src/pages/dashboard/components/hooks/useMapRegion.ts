/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useMapRegion.ts
import { useState, useEffect} from 'react';
import { REGION_METADATA, type RegionId } from '../datas/PokemonMapTabData';

export function useMapRegion(locations: any[]) {
  const [currentRegion, setCurrentRegion] = useState<RegionId>('kanto');

  useEffect(() => {
    if (!locations || locations.length === 0) return;

    // 각 지방별로 매칭되는 장소가 몇 개인지 계산
    const regionCounts = Object.keys(REGION_METADATA).map((regionId) => {
      const region = REGION_METADATA[regionId as RegionId];
      const count = locations.filter(loc => 
        Object.keys(region.locations).some(key => loc.location_area.name.includes(key))
      ).length;
      return { id: regionId as RegionId, count };
    });

    // 가장 데이터가 많은 지방 찾기
    const bestRegion = regionCounts.reduce((prev, current) => 
      (current.count > prev.count) ? current : prev
    );

    // 데이터가 하나라도 있는 지방이 현재와 다르다면 자동 스위칭
    if (bestRegion.count > 0 && bestRegion.id !== currentRegion) {
      setCurrentRegion(bestRegion.id);
    }
  }, [locations]);

  return { currentRegion, setCurrentRegion, regionData: REGION_METADATA[currentRegion] };
}