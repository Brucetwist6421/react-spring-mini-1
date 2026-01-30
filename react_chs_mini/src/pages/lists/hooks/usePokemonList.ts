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
  const userId = "GUEST_USER"; // 실제 로그인 시스템이 있다면 해당 유저 ID 사용

  const query = useQuery({
    queryKey: ["pokemonList", userId],
    queryFn: async () => {
      // 1. 기초 데이터 준비 (한글명 맵 & 즐겨찾기 목록 병렬 호출)
      const koNameMap = new Map(POKEMON_OPTIONS.map((item) => [item.name, item.koName]));
      
      // 백엔드 API 호출: 사용자의 즐겨찾기 리스트 가져오기
      const [pokemonRes, favoriteRes] = await Promise.all([
        api.get("https://pokeapi.co/api/v2/pokemon?limit=1500"), 
        api.get(`/pokemon/favoriteList?userId=${userId}`)
      ]);

      const baseList = pokemonRes.data.results;
      const favoriteList = favoriteRes.data; // List<FavoriteVO>

      // 즐겨찾기된 포켓몬 ID들만 모아서 Set 생성 (빠른 비교를 위해)
      const favoriteIds = new Set(favoriteList.map((f: any) => f.pokemonId));

      // 2. 상세 정보 병렬 요청 및 데이터 가공
      const detailedList = await Promise.all(
        baseList.map(async (pokemon: any) => {
          const detailRes = await api.get(pokemon.url);
          const pId = detailRes.data.id;
          const koreanName = koNameMap.get(pokemon.name) || pokemon.name;

          return {
            id: pId,
            name: pokemon.name,
            koName: koreanName,
            url: pokemon.url,
            image: detailRes.data.sprites.front_default,
            types: detailRes.data.types.map((t: any) => t.type.name),
            // 즐겨찾기 목록에 포함되어 있는지 확인하여 속성 추가
            isFavorite: favoriteIds.has(pId), 
          };
        })
      );

      return detailedList;
    },
    retry: false,
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