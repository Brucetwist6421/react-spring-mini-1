/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

const KOREAN_NAME_URL = "https://raw.githubusercontent.com/smldms/pokemon-korean/master/pokemon-korean.json";

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
  useEffect(() => {
    const init = async () => {
      // 1. 기초 데이터 로드 (이름 리스트가 없을 때만 최초 1회 로드)
      if (allPokemonOptions.length === 0) {
        try {
          const countRes = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1");
          const countData = await countRes.json();
          setTotalCount(countData.count);
          await fetchAllNames();
        } catch (error) {
          console.error("기초 데이터 로드 실패", error);
        }
      }

      // 2. 분석 대상 호출
      // 이미 분석된 포켓몬이 현재 URL의 포켓몬과 같다면 중복 호출을 방지하는 조건문(선택 사항)
      if (pokemonName) {
        // pokemon?.name과 비교하여 중복 fetch 방지 가능
        if (pokemon?.name !== pokemonName) {
          await handleFetchPokemon(pokemonName);
        }
      } else {
        // 루트("/") 접속 시 랜덤 호출
        const randomId = Math.floor(Math.random() * 151) + 1;
        await handleFetchPokemon(randomId);
      }
    };

    init();
    // 의존성 배열에 allPokemonOptions.length를 포함하면 데이터 로드 후 상태 업데이트를 보장합니다.
  }, [pokemonName, handleFetchPokemon, fetchAllNames, allPokemonOptions.length]);

  return { pokemon, topRankers, totalCount, loading, handleFetchPokemon, allPokemonOptions };
}