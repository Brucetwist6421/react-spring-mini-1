/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueries } from "@tanstack/react-query";

export function usePokemonMoves(moves: any[]) {
  const targetMoves = moves.slice(0, 50); // 상위 50개 제한

  const results = useQueries({
    queries: targetMoves.map((m) => ({
      queryKey: ["move", m.move.name],
      queryFn: async () => {
        const res = await fetch(m.move.url);
        const data = await res.json();
        return {
          ...m,
          koName: data.names.find((n: any) => n.language.name === "ko")?.name,
          type: data.type.name,
          category: data.damage_class.name,
          power: data.power,
          accuracy: data.accuracy,
        };
      },
      staleTime: 1000 * 60 * 60,
    })),
  });

  const isLoading = results.some((query) => query.isLoading);
  const detailedMoves = results.map((query) => query.data).filter(Boolean);

  return { detailedMoves, isLoading };
}