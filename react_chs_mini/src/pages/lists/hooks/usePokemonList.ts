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
  const userId = "GUEST_USER"; 

  const query = useQuery({
    queryKey: ["pokemonList", userId],
    queryFn: async () => {
      try {
        const koNameMap = new Map(POKEMON_OPTIONS.map((item) => [item.name, item.koName]));
        
        // 💡 1,350개의 기본 정보 목록과 내 즐겨찾기 목록만 '딱 2번의 API 호출'로 빠르게 가져옵니다.
        const [pokemonRes, favoriteRes] = await Promise.all([
          api.get("https://pokeapi.co/api/v2/pokemon?limit=1350"), 
          api.get(`/pokemon/favoriteList?userId=${userId}`)
        ]);

        const baseList = pokemonRes.data.results;
        const favoriteList = Array.isArray(favoriteRes.data) ? favoriteRes.data : [];
        const favoriteIds = new Set(favoriteList.map((f: any) => Number(f.pokemonId)));

        // 💡 기존의 무거운 1,350번 상세 API Promise.all 호출 루프를 완전히 제거했습니다.
        const basicList = baseList.map((pokemon: any) => {
          // url 구조 파싱: "https://pokeapi.co/api/v2/pokemon/1/" -> 끝의 고유 ID 추출
          const urlParts = pokemon.url.replace(/\/$/, "").split("/");
          const pId = Number(urlParts[urlParts.length - 1]);
          const koreanName = koNameMap.get(pokemon.name) || pokemon.name;

          return {
            id: pId,               // DataGrid 정렬/필터에 활용할 고유 ID
            name: pokemon.name,
            koName: koreanName,
            url: pokemon.url,      // ⚡ Column 컴포넌트(PokemonDetailCell)가 런타임 캐싱 키로 활용할 핵심 주소
            isFavorite: favoriteIds.has(pId),
          };
        });

        return basicList;

      } catch (err: any) {
        console.error("캐치된 에러 상세 정보:", err);
        console.error("에러 메시지:", err.message);
        console.error("응답 데이터:", err.response?.data);
        throw err; 
      }
    },
    // 💡 실무형 트래픽 방어 세팅 추가
    staleTime: 1000 * 60 * 30, // 기본 목록 데이터는 30분 동안 Fresh 상태 유지 (불필요한 리펫치 전면 차단)
    gcTime: 1000 * 60 * 60,    // 1시간 동안 브라우저 메모리에 캐시 보존
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

  // 3. 상태 관리 (MUI Grid v6 사양에 맞춘 구조 유지)
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
    handleDelete, 
    selection: { rowSelectionModel, setRowSelectionModel },
    modal: { detailOpen, setDetailOpen, selectedRow, setSelectedRow },
    pagination: { paginationModel, setPaginationModel },
  };
}