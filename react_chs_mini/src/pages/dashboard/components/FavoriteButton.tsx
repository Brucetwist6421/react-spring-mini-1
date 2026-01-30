/* eslint-disable @typescript-eslint/no-explicit-any */
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Alert, IconButton, Snackbar, Tooltip } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toggleFavoriteApi, checkFavoriteApi } from "./hooks/favoriteApi"; // checkFavoriteApi 추가

interface Props {
  pokemonId: number;
  pokemonName: string;
  pokemonKoName: string;
  initialIsFavorite?: boolean; // 👈 이 줄을 추가 (Optional로 설정)
}

export default function FavoriteButton({ pokemonId, pokemonName, pokemonKoName, initialIsFavorite }: Props) {
  const queryClient = useQueryClient();
  const userId = "GUEST_USER";

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  // 1. 초기 즐겨찾기 상태 조회 (GET)
  const { data: checkData } = useQuery({
    queryKey: ["favoriteCheck", userId, pokemonId], //userId 가 생기면 userId로 조회
    queryFn: () => checkFavoriteApi(userId, pokemonId),
    initialData: { isFavorite: initialIsFavorite },
    enabled: !!pokemonId, // id가 있을 때만 실행
    retry: false,
  });

  // 2. 즐겨찾기 토글 Mutation (POST)
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      toggleFavoriteApi({
        userId,
        pokemonId,
        pokemonName,
        pokemonKoName,
      }),
    
    // 비동기 처리의 핵심: 서버 응답 전 실행
    onMutate: async () => {
      // 1. 관련 쿼리 취소 (서버 응답이 수동 업데이트를 덮어쓰지 않게)
      await queryClient.cancelQueries({ queryKey: ["pokemonList"] });
      await queryClient.cancelQueries({ queryKey: ["favoriteCheck", userId, pokemonId] });

      // 2. 현재 캐시 데이터 스냅샷 저장 (에러 발생 시 복구용)
      const previousList = queryClient.getQueryData(["pokemonList"]);
      const previousCheck = queryClient.getQueryData(["favoriteCheck", userId, pokemonId]);

      // 3. 리스트 캐시 즉시 수정 (비동기 UI 반영)
      queryClient.setQueryData(["pokemonList"], (old: any) => {
        if (!old) return [];
        return old.map((p: any) => 
          p.id === pokemonId ? { ...p, isFavorite: !isFavorite } : p
        );
      });

      // 4. 개별 체크 캐시 즉시 수정
      queryClient.setQueryData(["favoriteCheck", userId, pokemonId], { isFavorite: !isFavorite });

      return { previousList, previousCheck };
    },

    onSuccess: (res) => {
      setToast({ open: true, message: res.message, severity: "success" });
    },

    onError: (error, _, context) => {
      // 실패 시 원래 데이터로 복구
      console.error("즐겨찾기 토글 오류:", error);
      queryClient.setQueryData(["pokemonList"], context?.previousList);
      queryClient.setQueryData(["favoriteCheck", userId, pokemonId], context?.previousCheck);
      
      setToast({ open: true, message: "오류가 발생했습니다.", severity: "error" });
    },

    onSettled: () => {
      // 마지막에 서버와 싱크를 맞춰 데이터 무결성 보장 (배경에서 실행됨)
      queryClient.invalidateQueries({ queryKey: ["favoriteCheck", userId, pokemonId] });
      queryClient.invalidateQueries({ queryKey: ["pokemonList"] });
    },
  });

  const handleClose = () => setToast({ ...toast, open: false });

  // 서버에서 가져온 데이터(checkData)를 우선적으로 사용
  const isFavorite = checkData?.isFavorite ?? false;

  return (
    <>
      <Tooltip title={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}>
        <span>
          <IconButton
            onClick={(e) => {
              e.stopPropagation(); // 리스트 행 클릭 이벤트 전파 방지
              mutate();
            }}
            disabled={isPending}
            sx={{
              ml: 1.5,
              color: isFavorite ? "#f59e0b" : "#cbd5e1",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "scale(1.2) rotate(15deg)",
                color: isFavorite ? "#d97706" : "#94a3b8",
              },
              "&:disabled": { color: "#e2e8f0" },
            }}
          >
            {isFavorite ? <StarIcon fontSize="large" /> : <StarBorderIcon fontSize="large" />}
          </IconButton>
        </span>
      </Tooltip>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={toast.severity} variant="filled" sx={{ width: "100%", borderRadius: 0, fontWeight: 700 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}