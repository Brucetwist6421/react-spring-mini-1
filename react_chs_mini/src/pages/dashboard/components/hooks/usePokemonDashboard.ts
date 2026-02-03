/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { POKEMON_OPTIONS } from "../../../../api/datas/pokemonData";

// 폼 이름 한글 변환 매핑 (자주 등장하는 것들)
const FORM_NAME_MAP: Record<string, string> = {
  "altered": "어나더폼",
  "origin": "오리진폼",
  "wash": "워시로토무",
  "heat": "히트로토무",
  "mow": "커트로토무",
  "frost": "프로스트로토무",
  "fan": "스핀로토무",
  "sky": "스카이폼",
  "land": "랜드폼",
  "normal": "노멀폼",
  "attack": "어택폼",
  "defense": "디펜스폼",
  "speed": "스피드폼"
};

export function usePokemonDashboard() {
  const { pokemonName } = useParams<{ pokemonName?: string }>();
  const [pokemon, setPokemon] = useState<any>(null);
  const [topRankers, setTopRankers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allPokemonOptions, setAllPokemonOptions] = useState<{ name: string; koName: string }[]>([]);

  const fetchAllNames = useCallback(async () => {
    try {
      const apiRes = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
      const apiData = await apiRes.json();
      const koNameMap = new Map(POKEMON_OPTIONS.map((item) => [item.name, item.koName]));
      const formatted = apiData.results.map((p: any) => ({
        name: p.name,
        koName: koNameMap.get(p.name) || p.name,
      }));
      setAllPokemonOptions(formatted);
    } catch (e) { console.error("이름 목록 로드 실패:", e); }
  }, []);

  const handleFetchPokemon = useCallback(async (targetIdOrName: string | number) => {
    try {
      setLoading(true);

      let pokeData;
      let speciesData;
      
      const initialRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${targetIdOrName.toString().toLowerCase()}`);
      
      if (initialRes.ok) {
        pokeData = await initialRes.json();
        const sRes = await fetch(pokeData.species.url);
        speciesData = await sRes.json();
      } else {
        const sRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${targetIdOrName.toString().toLowerCase()}`);
        if (!sRes.ok) throw new Error("포켓몬을 찾을 수 없습니다.");
        speciesData = await sRes.json();
        const defaultFormName = speciesData.varieties.find((v: any) => v.is_default)?.pokemon.name || speciesData.varieties[0].pokemon.name;
        const retryRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${defaultFormName}`);
        pokeData = await retryRes.json();
      }

      const koName = speciesData.names.find((n: any) => n.language.name === "ko")?.name || pokeData.name;

      // [추가] 폼 정보 가공 로직
      const forms = speciesData.varieties.map((v: any) => {
        const rawName = v.pokemon.name;
        // 영어 이름에서 폼 특징 추출 (예: giratina-origin -> origin)
        const suffix = rawName.replace(speciesData.name, "").replace("-", "");
        return {
          name: rawName,
          label: FORM_NAME_MAP[suffix] || (suffix ? suffix.toUpperCase() : "기본폼"),
          isCurrent: rawName === pokeData.name
        };
      });

      // --- 랭커 계산 (최적화 유지) ---
      const typeResponses = await Promise.all(
        pokeData.types.map((t: any) => fetch(t.type.url).then(r => r.json()))
      );

      const allTypePokemon = new Map();
      typeResponses.forEach(typeData => {
        typeData.pokemon.forEach((p: any) => allTypePokemon.set(p.pokemon.name, p.pokemon.url));
      });

      const pokemonToFetch = Array.from(allTypePokemon.values()).slice(0, 10);
      const detailedList = await Promise.all(
        pokemonToFetch.map(async (url: string) => {
          try {
            const pRes = await fetch(url).then(r => r.json());
            const bst = pRes.stats.reduce((acc: number, cur: any) => acc + cur.base_stat, 0);
            const koMap = new Map(POKEMON_OPTIONS.map(i => [i.name, i.koName]));
            return { ...pRes, koName: koMap.get(pRes.name) || pRes.name, bst };
          } catch { return null; }
        })
      );

      const rankedList = detailedList.filter(p => p !== null).sort((a: any, b: any) => b.bst - a.bst);

      setPokemon({ ...pokeData, koName, forms }); // forms 데이터 포함
      setTopRankers(rankedList.slice(0, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1").then(r => r.json()).then(d => setTotalCount(d.count));
    fetchAllNames();
  }, [fetchAllNames]);

  useEffect(() => {
    if (pokemonName) {
      if (!pokemon || pokemon.name !== pokemonName) handleFetchPokemon(pokemonName);
    } else if (!pokemon) {
      handleFetchPokemon(Math.floor(Math.random() * 151) + 1);
    }
  }, [pokemonName, handleFetchPokemon]);

  return { pokemon, topRankers, totalCount, loading, handleFetchPokemon, allPokemonOptions };
}