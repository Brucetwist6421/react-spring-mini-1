import { Button } from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import FavoriteButton from "../../dashboard/components/FavoriteButton";
import PokemonDetailRenderer from "./PokemonDetailRenderer"; // 💡 분리한 컴포넌트 임포트

/**
 * 포켓몬 리스트 컬럼 정의를 반환하는 함수
 * @param onNavigate 페이지 이동을 위한 핸들러 (useNavigate)
 */
export const getPokemonColumns = (
  onNavigate: (path: string) => void
): GridColDef[] => [
  {
    field: "id",
    headerName: "포켓몬 번호",
    headerAlign: "center",
    width: 200,
    align: "center",
  },
  {
    field: 'name',
    headerName: "포켓몬 영문명",
    width: 150,
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <Button
        variant="text"
        sx={{ textTransform: "none", fontWeight: 700, fontSize: "1rem" }}
        onClick={() => onNavigate(`/${params.value}`)}
      >
        {params.value}
      </Button>
    ),
  },
  {
    field: 'koName',
    headerName: "포켓몬 한글명",
    width: 150,
    flex: 1,
  },
  {
    field: "type",
    headerName: "타입",
    align: "center",
    headerAlign: "center",
    width: 150,
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <PokemonDetailRenderer url={params.row.url} renderType="types" />
    ),
  },
  {
    field: "image",
    headerName: "썸네일",
    align: "center",
    headerAlign: "center",
    width: 150,
    flex: 1,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams) => (
      <PokemonDetailRenderer url={params.row.url} renderType="image" fallbackValue={params.row.name} />
    ),
  },
  {
    field: "isFavorite",
    type: "boolean",
    headerName: "즐겨찾기",
    headerAlign: "center",
    align: "center",
    width: 200,
    sortable: true,
    renderCell: (params: GridRenderCellParams) => (
      <FavoriteButton 
        pokemonId={params.row.id} 
        pokemonName={params.row.name} 
        pokemonKoName={params.row.koName} 
        initialIsFavorite={params.value}
      />
    ),
  },
];