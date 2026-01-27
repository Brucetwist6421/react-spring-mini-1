/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { HABITAT_MAP, TYPE_MAP } from "../types/dashboardType";


export function usePokemonAnalytics(pokemon: any) {
  const [analytics, setAnalytics] = useState({
    strengths: [] as string[],
    weaknesses: [] as string[],
    evoChain: [] as any[],
    habitat: "알 수 없음",
    typeRank: 0,
    globalRank: 0,
    isLoading: true, // 로딩 상태 추가
  });

  useEffect(() => {
    if (!pokemon) return;
    
    const fetchExtraData = async () => {
      setAnalytics(prev => ({ ...prev, isLoading: true }));
      try {
        const currentBst = pokemon.stats.reduce((acc: number, cur: any) => acc + cur.base_stat, 0);
        const typeBoost = pokemon.types.length > 1 ? 1.05 : 1;
        const adjustedBst = currentBst * typeBoost;
        
        const tRank = adjustedBst >= 600 ? 1 : adjustedBst >= 540 ? 5 : adjustedBst >= 480 ? 15 : adjustedBst >= 400 ? 40 : 70;
        const gRank = currentBst >= 670 ? 0.5 : currentBst >= 600 ? 2 : currentBst >= 530 ? 10 : currentBst >= 480 ? 25 : currentBst >= 400 ? 50 : 85;

        const typeResponses = await Promise.all(pokemon.types.map((t: any) => fetch(t.type.url).then(r => r.json())));
        const sSet = new Set<string>();
        const wSet = new Set<string>();
        typeResponses.forEach((res: any) => {
          res.damage_relations.double_damage_to.forEach((t: any) => TYPE_MAP[t.name] && sSet.add(TYPE_MAP[t.name]));
          res.damage_relations.double_damage_from.forEach((t: any) => TYPE_MAP[t.name] && wSet.add(TYPE_MAP[t.name]));
        });

        const speciesRes = await fetch(pokemon.species.url).then(r => r.json());
        const evoRes = await fetch(speciesRes.evolution_chain.url).then(r => r.json());
        
        const chainData = [];
        let currentEvo = evoRes.chain;
        while (currentEvo) {
          const id = currentEvo.species.url.split('/').filter(Boolean).pop();
          const nodeSpecies = await fetch(currentEvo.species.url).then(r => r.json());
          const koName = nodeSpecies.names.find((n: any) => n.language.name === "ko")?.name || currentEvo.species.name;
          chainData.push({ name: currentEvo.species.name, koName, id });
          currentEvo = currentEvo.evolves_to[0];
        }

        setAnalytics({
          strengths: Array.from(sSet),
          weaknesses: Array.from(wSet),
          evoChain: chainData,
          habitat: HABITAT_MAP[speciesRes.habitat?.name] || "기타",
          typeRank: tRank,
          globalRank: gRank,
          isLoading: false, // 로딩 완료
        });
      } catch (err) {
        console.error(err);
        setAnalytics(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchExtraData();
  }, [pokemon]);

  return analytics;
}