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
      try {
        const koNameMap = new Map(POKEMON_OPTIONS.map((item) => [item.name, item.koName]));
        
        // console.log("1. API 호출 시작");
        const [pokemonRes, favoriteRes] = await Promise.all([
          api.get("https://pokeapi.co/api/v2/pokemon?limit=1350"), 
          api.get(`/pokemon/favoriteList?userId=${userId}`)
        ]);
        // console.log("2. 기본 데이터 수신 성공", { pokemonRes, favoriteRes });

        const baseList = pokemonRes.data.results;
        const favoriteList = Array.isArray(favoriteRes.data) ? favoriteRes.data : [];
        console.log("서버에서 온 즐겨찾기 데이터:", favoriteList);
        console.log("서버에서 온 즐겨찾기 데이터:", favoriteRes.data);
        const favoriteIds = new Set(favoriteList.map((f: any) => Number(f.pokemonId)));
        // console.log("서버에서 온 즐겨찾기 원본:", favoriteList);
        // console.log("3. 상세 정보 병렬 요청 시작 (1350건)");
        const detailedList = await Promise.all(
          baseList.map(async (pokemon: any) => {
            // 여기서 개별 요청 에러가 나는지 확인하기 위해 한번 더 감쌀 수 있습니다.
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
              isFavorite: favoriteIds.has(Number(pId)),
            };
          })
        );
        // console.log("4. 전체 데이터 가공 완료");
        return detailedList;

      } catch (err: any) {
        // 서버 로그에서 보였던 Invalid character나 NoResourceFound 에러가 여기서 잡힐 것입니다.
        console.error("캐치된 에러 상세 정보:", err);
        console.error("에러 메시지:", err.message);
        console.error("응답 데이터:", err.response?.data);
        throw err; // 에러를 다시 던져야 useQuery의 error 객체에 담깁니다.
      }
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