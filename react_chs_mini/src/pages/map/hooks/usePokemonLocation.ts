/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/usePokemonLocation.ts
import { useState, useEffect } from 'react';

export function usePokemonLocation(pokemonId: number | string) {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pokemonId) return;

    const fetchEncounters = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/encounters`);
        const data = await res.json();
        // 실제 좌표 데이터셋에 등록된 장소만 필터링
        setLocations(data);
      } catch (e) {
        console.error("서식지 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchEncounters();
  }, [pokemonId]);

  return { locations, loading };
}