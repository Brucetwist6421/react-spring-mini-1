/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography, Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { koKR } from "@mui/x-data-grid/locales";
import { useNavigate } from "react-router-dom";
import { usePokemonList } from "./hooks/usePokemonList"; // 커스텀 훅 임포트
import PokemonDetailModal from "../modal/PokemonDetailModal";
import RandomSpinner from "../../components/RandomSpinner";
import CustomPagination from "./components/CustomPagination";
import { getPokemonColumns } from "./components/PokemonListColumns";

export default function PokemonList() {
  const navigate = useNavigate();

  // 1. 모든 데이터와 상태를 커스텀 훅에서 가져옵니다.
  const {
    data: pokeData,
    isLoading,
    isFetching,
    error,
    selection,
    modal,
    pagination,
    handleDelete, // 삭제 핸들러 (훅 내부에 정의 추천)
  } = usePokemonList();

  // 2. 외부 모듈화된 컬럼을 가져옵니다. (중복 로직 삭제)
  const columns = getPokemonColumns(
    (path) => navigate(path) // 첫 번째 인자: 페이지 이동 함수
  );

  // 3. 데이터 변환 로직 (간결화)
  const gridRows = pokeData?.map((p: any, i: number) => ({
    id: i + 1,
    name: p.name,
    // lastName: p.name + i,
    type: p.types.join(", "),
    image: p.image,
    // age: Math.floor(i + Math.random() * 10),
    // taxRate: Math.random(),
    // gross: 100 + i,
    // costs: 50,
  })) || [];

  if (isLoading || isFetching) return <RandomSpinner />;
  if (error) return <h1>404 ERROR</h1>;

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      {/* 상단 헤더 섹션 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, px: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
          포켓몬 목록
        </Typography>
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Button
            variant="contained"
            color="info"
            onClick={() => handleDelete(selection.rowSelectionModel)}
            disabled={selection.rowSelectionModel.ids?.size === 0}
            sx={{ borderRadius: '8px', fontWeight: 700, boxShadow: 'none' }}
          >
            선택 항목 삭제
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/pokemon/create")}
            sx={{ borderRadius: '8px', fontWeight: 700, boxShadow: 'none', px: 3 }}
          >
            포켓몬 등록
          </Button>
        </Box>
      </Box>

      {/* DataGrid (정리된 props 사용) */}
      <DataGrid
        rows={gridRows}
        columns={columns} // 변환된 columnsWithHandler 대신 순수 columns 사용
        // checkboxSelection
        disableRowSelectionOnClick
        showToolbar // 기본 툴바 표시 (GridToolbar import 불필요)
        rowSelectionModel={selection.rowSelectionModel}
        onRowSelectionModelChange={selection.setRowSelectionModel}
        paginationModel={pagination.paginationModel}
        onPaginationModelChange={pagination.setPaginationModel}
        localeText={koKR.components.MuiDataGrid.defaultProps.localeText}
        // Excel 내보내기 옵션 커스터마이징
        slotProps={{
          toolbar: {
            csvOptions: {
              fileName: "포켓몬리스트_" + Date.now().toString(),
              delimiter: ";",
              utf8WithBom: true,
            },
          },
        }}
        slots={{ pagination: CustomPagination }}
        sx={{ "& .MuiDataGrid-row:hover": { backgroundColor: "#f3f9ff" } }}
      />

      {/* 상세조회 모달 */}
      <PokemonDetailModal
        open={modal.detailOpen}
        onClose={() => modal.setDetailOpen(false)}
        row={modal.selectedRow}
      />
    </Box>
  );
}