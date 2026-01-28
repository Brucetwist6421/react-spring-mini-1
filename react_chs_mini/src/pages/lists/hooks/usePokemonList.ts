/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import api from "../../../api/axiosInstance";
import SampleSwal from "../../../components/SampleSwal";

export function usePokemonList() {
  const queryClient = useQueryClient();

  // 1. 데이터 가져오기
  const query = useQuery({
    queryKey: ["pokemonList"],
    queryFn: async () => {
      const res = await api.get("https://pokeapi.co/api/v2/pokemon?limit=2000");
      return res.data;
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

  // 4. 🔥 handleDelete 함수 정의 (핵심!)
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