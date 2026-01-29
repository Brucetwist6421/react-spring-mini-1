import { useState, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface Props {
  pokemonName: string;
}

export default function FavoriteButton({ pokemonName }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);

  // 1. 포켓몬이 변경될 때마다 로컬스토리지 확인
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("fav_pokemon") || "[]");
    setIsFavorite(favorites.includes(pokemonName));
  }, [pokemonName]);

  // 2. 즐겨찾기 토글 함수
  const toggleFavorite = () => {
    const favorites: string[] = JSON.parse(
      localStorage.getItem("fav_pokemon") || "[]",
    );
    let newFavorites: string[];

    if (isFavorite) {
      newFavorites = favorites.filter((name) => name !== pokemonName);
    } else {
      newFavorites = [...favorites, pokemonName];
    }

    localStorage.setItem("fav_pokemon", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <Tooltip title={isFavorite ? "현재 포켓몬 즐겨찾기 해제" : "현재 포켓몬 즐겨찾기 추가"}>
      <IconButton
        onClick={toggleFavorite}
        sx={{
          ml: 1.5,
          color: isFavorite ? "#f59e0b" : "#cbd5e1",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "scale(1.2) rotate(15deg)", // 위트 있는 회전 효과
            color: isFavorite ? "#d97706" : "#94a3b8",
          },
        }}
      >
        {isFavorite ? (
          <StarIcon fontSize="large" />
        ) : (
          <StarBorderIcon fontSize="large" />
        )}
      </IconButton>
    </Tooltip>
  );
}
