/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";

const KOREAN_NAME_URL = "https://raw.githubusercontent.com/smldms/pokemon-korean/master/pokemon-korean.json";

export function usePokemonDashboard() {
  const [pokemon, setPokemon] = useState<any>(null);
  const [topRankers, setTopRankers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allPokemonOptions, setAllPokemonOptions] = useState<{name: string, koName: string}[]>([]);

  // 1. 이름 데이터 로드 로직 (더 견고하게 수정)
  const fetchAllNames = useCallback(async () => {
    try {
      const [apiRes, koRes] = await Promise.all([
        fetch("https://pokeapi.co/api/v2/pokemon?limit=1025"), // 9세대까지 포함
        fetch(KOREAN_NAME_URL)
      ]);
      
      const apiData = await apiRes.json();
      const koData = await koRes.json(); 

      const formatted = apiData.results.map((p: any, index: number) => {
        // PokeAPI 리스트의 첫 번째 포켓몬은 ID 1번(이상해씨)입니다.
        const id = index + 1;
        // koData 배열에서 id가 일치하는 객체를 찾습니다.
        const koEntry = koData.find((item: any) => Number(item.id) === id);
        
        return { 
          name: p.name, 
          koName: koEntry ? koEntry.name : p.name 
        };
      });

      console.log("한글 이름 매핑 완료:", formatted.slice(0, 5)); // 콘솔에서 확인용
      setAllPokemonOptions(formatted);
    } catch (e) {
      console.error("데이터 로드 실패:", e);
    }
  }, []);

  // 2. 개별 포켓몬 정보 호출 로직
  const handleFetchPokemon = useCallback(async (targetIdOrName: string | number) => {
    try {
      setLoading(true);
      const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${targetIdOrName}`);
      if (!pokeRes.ok) throw new Error("포켓몬을 찾을 수 없습니다.");
      
      const currentPoke = await pokeRes.json();

      // 현재 포켓몬 한글 이름 추출
      const speciesRes = await fetch(currentPoke.species.url);
      const speciesData = await speciesRes.json();
      const koName = speciesData.names.find((n: any) => n.language.name === "ko")?.name || currentPoke.name;

      // 상위 랭커 계산 로직
      const typeRes = await fetch(currentPoke.types[0].type.url);
      const typeData = await typeRes.json();
      
      const detailedList = await Promise.all(
        typeData.pokemon.slice(0, 15).map(async (p: any) => {
          const pData = await fetch(p.pokemon.url).then((r) => r.json());
          const sRes = await fetch(pData.species.url).then((r) => r.json());
          const kName = sRes.names.find((n: any) => n.language.name === "ko")?.name || pData.name;
          return { ...pData, koName: kName };
        })
      );

      const rankedList = detailedList.sort((a, b) => {
        const bstA = a.stats.reduce((acc: number, cur: any) => acc + cur.base_stat, 0);
        const bstB = b.stats.reduce((acc: number, cur: any) => acc + cur.base_stat, 0);
        return bstB - bstA;
      });

      setPokemon({ ...currentPoke, koName });
      setTopRankers(rankedList.slice(0, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. 초기 실행 (순서 보장)
  useEffect(() => {
    const init = async () => {
      // 전체 카운트와 이름 데이터를 먼저 받아옵니다.
      const countRes = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1");
      const countData = await countRes.json();
      setTotalCount(countData.count);

      await fetchAllNames(); // 이 함수가 완료되어야 allPokemonOptions가 채워짐

      // 첫 화면용 랜덤 포켓몬 호출
      const randomId = Math.floor(Math.random() * 151) + 1;
      handleFetchPokemon(randomId);
    };
    init();
  }, [handleFetchPokemon, fetchAllNames]);

  return { pokemon, topRankers, totalCount, loading, handleFetchPokemon, allPokemonOptions };
}