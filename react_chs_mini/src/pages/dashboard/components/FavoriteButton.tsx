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
}

export default function FavoriteButton({ pokemonId, pokemonName, pokemonKoName }: Props) {
  const queryClient = useQueryClient();
  const userId = "GUEST_USER";

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  // 1. 초기 즐겨찾기 상태 조회 (GET)
  const { data: checkData } = useQuery({
    queryKey: ["favoriteCheck", userId, pokemonId],
    queryFn: () => checkFavoriteApi(userId, pokemonId),
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
    onSuccess: (res) => {
      // 성공 시 'favoriteCheck' 쿼리를 무효화하여 최신 상태를 서버에서 다시 읽어오게 함
      queryClient.invalidateQueries({ queryKey: ["favoriteCheck", userId, pokemonId] });
      
      setToast({
        open: true,
        message: res.message,
        severity: "success",
      });
    },
    onError: (error) => {
      setToast({
        open: true,
        message: "통신 중 오류가 발생했습니다.",
        severity: "error",
      });
      console.error(error);
    },
    retry: false,
  });

  const handleClose = () => setToast({ ...toast, open: false });

  // 서버에서 가져온 데이터(checkData)를 우선적으로 사용
  const isFavorite = checkData?.isFavorite ?? false;

  return (
    <>
      <Tooltip title={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}>
        <span>
          <IconButton
            onClick={() => mutate()}
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