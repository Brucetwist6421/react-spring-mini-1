/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { POKEMON_OPTIONS } from "../../../../api/datas/pokemonData";


export function usePokemonDashboard() {
  const { pokemonName } = useParams<{ pokemonName?: string }>();

  const [pokemon, setPokemon] = useState<any>(null);
  const [topRankers, setTopRankers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allPokemonOptions, setAllPokemonOptions] = useState<{name: string, koName: string}[]>([]);

  // 1. 이름 데이터 로드 로직 (더 견고하게 수정)
  const fetchAllNames = useCallback(async () => {
    try {
      // 외부 URL 대신 PokeAPI 리스트만 가져옵니다.
      const apiRes = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
      const apiData = await apiRes.json();

      // 로컬 데이터를 Map으로 만들어 검색 최적화
      const koNameMap = new Map(
        POKEMON_OPTIONS.map((item) => [item.name, item.koName])
      );

      const formatted = apiData.results.map((p: any) => ({
        name: p.name,
        // 로컬 데이터에 있으면 한글명, 없으면 영문명 사용
        koName: koNameMap.get(p.name) || p.name 
      }));

      setAllPokemonOptions(formatted);
    } catch (e) {
      console.error("이름 목록 로드 실패:", e);
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

      // --- 상위 랭커 계산 로직 리팩토링 시작 ---
      
      // 1. 모든 타입의 포켓몬 목록을 병렬로 가져옴
      const typeResponses = await Promise.all(
        currentPoke.types.map((t: any) => fetch(t.type.url).then(r => r.json()))
      );

      // 2. 모든 타입에 속한 포켓몬 합치기 및 중복 제거 (이름 기준)
      const allTypePokemon = new Map();
      typeResponses.forEach((typeData: any) => {
        typeData.pokemon.forEach((p: any) => {
          allTypePokemon.set(p.pokemon.name, p.pokemon.url);
        });
      });

      // 3. 표본 추출 (성능을 위해 전체 중 일부만 상세 정보 호출, 필요시 slice 범위 조정)
      const pokemonToFetch = Array.from(allTypePokemon.values()).slice(0, 20);

      const detailedList = await Promise.all(
        pokemonToFetch.map(async (url: string) => {
          const pData = await fetch(url).then((r) => r.json());
          const sRes = await fetch(pData.species.url).then((r) => r.json());
          const kName = sRes.names.find((n: any) => n.language.name === "ko")?.name || pData.name;
          
          // 종족치 총합(BST) 계산
          const bst = pData.stats.reduce((acc: number, cur: any) => acc + cur.base_stat, 0);
          return { ...pData, koName: kName, bst };
        })
      );

      // 4. 랭킹 정렬 (BST 기준 내림차순)
      const rankedList = detailedList.sort((a, b) => b.bst - a.bst);

      // --- 리팩토링 끝 ---

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
  // [1] 기초 데이터 로드 (전체 개수 및 이름 목록) - 최초 1회만 실행
useEffect(() => {
  const loadBaseData = async () => {
    // 이미 데이터가 있다면 로드하지 않음
    if (totalCount > 0 && allPokemonOptions.length > 0) return;

    try {
      const countRes = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1");
      const countData = await countRes.json();
      setTotalCount(countData.count);
      await fetchAllNames();
    } catch (error) {
      console.error("기초 데이터 로드 실패", error);
    }
  };

  loadBaseData();
  // fetchAllNames는 useCallback으로 감싸져 있어야 한다.
}, [fetchAllNames]); 


// [2] 분석 대상 포켓몬 호출 - URL 파라미터가 바뀔 때만 실행
useEffect(() => {
  const loadTargetPokemon = async () => {
    if (pokemonName) {
      // 현재 표시된 포켓몬과 URL의 포켓몬이 다를 때만 fetch
      if (!pokemon || pokemon.name !== pokemonName) {
        await handleFetchPokemon(pokemonName);
      }
    } else {
      // 경로에 이름이 없을 때 (메인 접속 시) 랜덤 호출
      // 단, 이미 포켓몬 데이터가 있다면(뒤로가기 등) 다시 부르지 않음
      if (!pokemon) {
        const randomId = Math.floor(Math.random() * 151) + 1;
        await handleFetchPokemon(randomId);
      }
    }
  };

  loadTargetPokemon();
}, [pokemonName, handleFetchPokemon]); // pokemon은 조건문 안에서만 사용 (의존성 제외)

  return { pokemon, topRankers, totalCount, loading, handleFetchPokemon, allPokemonOptions };
}