/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

/**
 * 포켓몬 리스트 컬럼 정의를 반환하는 함수
 * @param onOpenDetail 상세 모달을 열기 위한 핸들러
 * @param onNavigate 페이지 이동을 위한 핸들러 (useNavigate)
 */
export const getPokemonColumns = (
  onOpenDetail: (row: any) => void,
  onNavigate: (path: string) => void
): GridColDef[] => [
  {
    field: "id",
    headerName: "ID",
    width: 90,
    renderCell: (params: GridRenderCellParams) => (
      <Button
        variant="text"
        sx={{ textTransform: "none", fontWeight: 700 }}
        onClick={() => onNavigate(`/pokemon/${params.row.id}`)}
      >
        {params.value}
      </Button>
    ),
  },
  {
    field: "firstName",
    headerName: "포켓몬 이름",
    width: 150,
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <Button
        variant="text"
        color="primary"
        sx={{ textTransform: "none", p: 0, fontWeight: 600 }}
        onClick={() => onOpenDetail(params.row)}
      >
        {params.value}
      </Button>
    ),
  },
//   {
//     field: "lastName",
//     headerName: "닉네임/코드",
//     width: 150,
//     flex: 1,
//     renderCell: (params: GridRenderCellParams) => (
//       <Button
//         variant="text"
//         color="secondary"
//         sx={{ textTransform: "none", p: 0 }}
//         onClick={() => onNavigate(`/pokemon2/${params.row.id}`)}
//       >
//         {params.value}
//       </Button>
//     ),
//   },
  {
    field: "age",
    headerName: "레벨/나이",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "전체 명칭",
    sortable: false,
    width: 160,
    flex: 1,
    valueGetter: (_value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
  {
    field: "taxRate",
    headerName: "개체치(%)",
    flex: 1,
    valueGetter: (value) => (value ? Math.floor(value * 100) : value),
  },
  {
    field: "profit",
    headerName: "예상 전투력",
    flex: 1,
    valueGetter: (_value, row) => {
      if (!row.gross || !row.costs) return null;
      return Math.floor(row.gross - row.costs);
    },
  },
];