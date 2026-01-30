import { Avatar, Box, Button } from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import FavoriteButton from "../../dashboard/components/FavoriteButton";

/**
 * 포켓몬 리스트 컬럼 정의를 반환하는 함수
 * @param onOpenDetail 상세 모달을 열기 위한 핸들러
 * @param onNavigate 페이지 이동을 위한 핸들러 (useNavigate)
 */
export const getPokemonColumns = (
  // onOpenDetail: (row: any) => void,
  onNavigate: (path: string) => void
): GridColDef[] => [
  {
    field: "id",
    headerName: "ID",
    headerAlign: "center",
    width: 150,
    align: "center",
    // renderCell: (params: GridRenderCellParams) => (
    //   <Button
    //     variant="text"
    //     sx={{ textTransform: "none", fontWeight: 700 }}
    //     onClick={() => onNavigate(`/pokemon/${params.row.id}`)}
    //   >
    //     {params.value}
    //   </Button>
    // ),
  },
  {
    field: 'name',
    headerName: "포켓몬 영문명",
    width: 150,
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <Button
        variant="text"
        sx={{ textTransform: "none", fontWeight: 700,fontSize: "1rem"}}
        // "/" 경로 뒤에 이름을 붙여 이동 (예: /pikachu)
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
    // renderCell: (params: GridRenderCellParams) => (
    //   <Button
    //     variant="text"
    //     sx={{ textTransform: "none", fontWeight: 700,fontSize: "1rem"}}
    //     // "/" 경로 뒤에 이름을 붙여 이동 (예: /pikachu)
    //     onClick={() => onNavigate(`/${params.value}`)}
    //   >
    //     {params.value}
    //   </Button>
    // ),
  },
  {
    field: "type",
    headerName: "타입",
    width: 150,
    flex: 1,
  },
  // 1. 썸네일 컬럼 추가
  {
    field: "image",
    headerName: "썸네일",
    width: 150,
    flex: 1,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Avatar
          src={params.value} // p.image 값이 들어옴
          alt={params.row.firstName}
          variant="rounded"
          sx={{ width: 50, height: 60, bgcolor: "#f5f5f5" }}
        />
      </Box>
    ),
  },
  {
    field: "isFavorite",
    headerName: "즐겨찾기",
    width: 100,
    sortable: true, // 정렬 가능하도록 설정
    renderCell: (params: GridRenderCellParams) => (
      // 리스트 각 행의 데이터를 props로 전달
      <FavoriteButton 
        pokemonId={params.row.id} 
        pokemonName={params.row.name} 
        pokemonKoName={params.row.koName} 
        initialIsFavorite={params.value}
      />
    ),
  },
];