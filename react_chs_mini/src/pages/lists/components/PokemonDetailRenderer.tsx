/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axiosInstance";

interface RendererProps {
  url: string;
  renderType: "image" | "types";
  fallbackValue?: string;
}

// 💡 하나의 독립된 파일로 분리하여 Fast Refresh 규칙을 준수합니다.
export default function PokemonDetailRenderer({ url, renderType, fallbackValue }: RendererProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["pokemonDetail", url],
    queryFn: async () => {
      const res = await api.get(url);
      return {
        image: res.data.sprites?.front_default || "",
        types: res.data.types?.map((t: any) => t.type.name).join(", ") || "",
      };
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 2,
    retry: false,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
        <CircularProgress size={18} thickness={5} sx={{ color: "#cbd5e1" }} />
      </Box>
    );
  }

  if (renderType === "image") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", height: "100%", width: "100%", justifyContent: "center" }}>
        <Avatar
          src={data?.image || ""}
          alt={fallbackValue}
          variant="rounded"
          sx={{ width: 50, height: 60, bgcolor: "#f5f5f5" }}
        />
      </Box>
    );
  }

  return <span style={{ fontSize: "1rem" }}>{data?.types || "-"}</span>;
}