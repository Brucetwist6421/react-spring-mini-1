/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";

export function usePokemonDashboard() {
  const [pokemon, setPokemon] = useState<any>(null);
  const [topRankers, setTopRankers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // useCallback으로 감싸주면 성능 최적화 및 무한 루프 방지에 도움이 됩니다.
  const handleFetchPokemon = useCallback(async (targetIdOrName: string | number) => {
    try {
      setLoading(true); // 시작할 때 로딩 ON

      // 1. 기본 정보 및 전체 카운트 호출
      const [countRes, pokeRes] = await Promise.all([
        fetch("https://pokeapi.co/api/v2/pokemon?limit=1"),
        fetch(`https://pokeapi.co/api/v2/pokemon/${targetIdOrName}`),
      ]);
      const countData = await countRes.json();
      const currentPoke = await pokeRes.json();

      // 2. 타입 기반 랭커 데이터 로직
      const typeRes = await fetch(currentPoke.types[0].type.url);
      const typeData = await typeRes.json();
      const sampleList = typeData.pokemon.slice(0, 15);

      const detailedList = await Promise.all(
        sampleList.map(async (p: any) => {
          const pokeData = await fetch(p.pokemon.url).then((r) => r.json());
          const speciesData = await fetch(pokeData.species.url).then((r) => r.json());
          const koName = speciesData.names.find((n: any) => n.language.name === "ko")?.name || pokeData.name;
          return { ...pokeData, koName };
        })
      );

      // 3. 종족값 기준 정렬 (랭킹)
      const rankedList = detailedList.sort((a, b) => {
        const bstA = a.stats.reduce((acc: number, cur: any) => acc + cur.base_stat, 0);
        const bstB = b.stats.reduce((acc: number, cur: any) => acc + cur.base_stat, 0);
        return bstB - bstA;
      });

      // 4. 상태 업데이트
      setTotalCount(countData.count);
      setPokemon(currentPoke);
      setTopRankers(rankedList.slice(0, 3));
      
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (e) {
      console.error("데이터 호출 중 오류 발생:", e);
    } finally {
      setLoading(false); // 에러가 나든 성공하든 로딩 OFF
    }
  }, []);

  useEffect(() => {
    const randomId = Math.floor(Math.random() * 800) + 1;
    handleFetchPokemon(randomId);
  }, [handleFetchPokemon]); // 의존성 배열에 추가

  return { pokemon, topRankers, totalCount, loading, handleFetchPokemon };
}