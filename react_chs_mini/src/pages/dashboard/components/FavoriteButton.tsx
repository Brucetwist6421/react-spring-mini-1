import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { IconButton, Tooltip } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { toggleFavoriteApi } from "./hooks/favoriteApi";

interface Props {
  pokemonId: number;
  pokemonName: string;
  pokemonKoName: string;
}

export default function FavoriteButton({ pokemonId, pokemonName, pokemonKoName }: Props) {
  const userId = "GUEST_USER"; // 나중에 계정 시스템 도입 시 실제 ID로 교체

  // 1. 초기 즐겨찾기 상태 조회 (낙관적 업데이트를 쓰지 않을 경우를 대비)
  // 여기서는 단순함을 위해 서버에서 불러오는 쿼리는 생략하고 Mutation의 결과값에 의존하거나 
  // 상위에서 넘겨받은 초기 상태를 관리한다고 가정합니다.

  // 2. 즐겨찾기 토글 Mutation
  const { mutate, isPending, data } = useMutation({
    mutationFn: () => toggleFavoriteApi({
      userId,
      pokemonId,
      pokemonName,
      pokemonKoName
    }),
    onSuccess: (res) => {
      // 성공 시 캐시 무효화 또는 상태 업데이트
      // queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
      console.log(res.message);
    },
    onError: (error) => {
      console.error("즐겨찾기 처리 실패:", error);
    }
  });

  // 현재 상태 판단 (서버 응답 결과가 있으면 그 값을 쓰고, 없으면 기본값 설정)
  // 실제로는 useQuery와 연동하여 서버 데이터를 바라보게 하는 것이 가장 좋습니다.
  const isFavorite = data?.isFavorite ?? false; 

  return (
    <Tooltip title={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}>
      <span> {/* disabled 상태일 때 Tooltip 작동을 위해 span으로 감쌈 */}
        <IconButton
          onClick={() => mutate()}
          disabled={isPending} // 통신 중 클릭 방지
          sx={{
            ml: 1.5,
            color: isFavorite ? "#f59e0b" : "#cbd5e1",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "scale(1.2) rotate(15deg)",
              color: isFavorite ? "#d97706" : "#94a3b8",
            },
            "&:disabled": { color: "#e2e8f0" }
          }}
        >
          {isFavorite ? <StarIcon fontSize="large" /> : <StarBorderIcon fontSize="large" />}
        </IconButton>
      </span>
    </Tooltip>
  );
}