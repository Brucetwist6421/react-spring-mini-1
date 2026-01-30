/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import api from "../../../api/axiosInstance";
import SampleSwal from "../../../components/SampleSwal";
import { POKEMON_OPTIONS } from "../../../api/datas/pokemonData";

export function usePokemonList() {
  const queryClient = useQueryClient();

  // 1. 데이터 가져오기
  const query = useQuery({
    queryKey: ["pokemonList"],
    queryFn: async () => {
      // 1. 검색 효율을 위해 로컬 데이터를 Map으로 변환 (이름 -> 한글명)
      const koNameMap = new Map(
        POKEMON_OPTIONS.map((item) => [item.name, item.koName])
      );

      // 2. 기본 목록 가져오기
      const res = await api.get("https://pokeapi.co/api/v2/pokemon?limit=2000");
      const baseList = res.data.results;

      // 3. 상세 정보 병렬 요청 및 한글 이름 합치기
      const detailedList = await Promise.all(
        baseList.map(async (pokemon: any) => {
          const detailRes = await api.get(pokemon.url);
          
          // 로컬 데이터에서 한글 이름 찾기 (없으면 영어 이름 그대로 사용)
          const koreanName = koNameMap.get(pokemon.name) || pokemon.name;

          return {
            id: detailRes.data.id, // 실제 포켓몬 도감 번호
            name: pokemon.name,
            koName: koreanName,    // ★ 한글 이름 추가
            url: pokemon.url,
            image: detailRes.data.sprites.front_default,
            types: detailRes.data.types.map((t: any) => t.type.name),
          };
        })
      );

      return detailedList;
    },
  });

  // 2. 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: async (selectedIds: Array<string | number>) => {
      return await api.delete("/pokemon/deletePokemons", { data: selectedIds });
    },
    onSuccess: () => {
      SampleSwal.fire({ title: "삭제되었습니다.", icon: "success" });
      queryClient.invalidateQueries({ queryKey: ["pokemonList"] });
    },
    onError: () => alert("삭제 중 오류가 발생했습니다.")
  });

  // 3. 상태 관리
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set()
  });
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  // 4. handleDelete 함수 정의
  const handleDelete = (selectionModel: GridRowSelectionModel) => {
    const selectedIds = Array.from(selectionModel.ids).map(id => Number(id));
    
    if (selectedIds.length === 0) return;

    SampleSwal.fire({
      title: "선택된 데이터를 삭제하시겠습니까?",
      text: `선택된 ID: ${selectedIds.join(", ")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니오",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(selectedIds);
      }
    });
  };

  // 5. 모든 것을 반환
  return {
    ...query,
    deleteMutation,
    handleDelete, // 여기에 포함되어야 에러가 사라집니다!
    selection: { rowSelectionModel, setRowSelectionModel },
    modal: { detailOpen, setDetailOpen, selectedRow, setSelectedRow },
    pagination: { paginationModel, setPaginationModel },
  };
}