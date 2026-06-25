/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { koKR } from "@mui/x-data-grid/locales";
import { useNavigate } from "react-router-dom";
import RandomSpinner from "../../components/RandomSpinner";
import PokemonDetailModal from "../modal/PokemonDetailModal";
import CustomPagination from "./components/CustomPagination";
import { getPokemonColumns } from "./components/PokemonListColumns";
import { usePokemonList } from "./hooks/usePokemonList"; // 수정된 커스텀 훅 임포트

export default function PokemonList() {
  const navigate = useNavigate();

  // 1. 모든 데이터와 상태를 수정한 커스텀 훅에서 가져옵니다.
  const {
    data: pokeData,
    isLoading,
    error,
    selection,
    modal,
    pagination,
  } = usePokemonList();

  // 2. 외부 모듈화된 컬럼을 가져옵니다. (렌더 셀 내부에 캐싱 훅 장착)
  const columns = getPokemonColumns(
    (path) => navigate(path) 
  );

  // 3. 데이터 변환 로직 (목록에 필요한 필수 Key만 들고 가도록 슬림화)
  // 💡 인덱스(i + 1) 대신 훅에서 정확히 파싱되어 내려온 고유 p.id를 DataGrid Row ID로 사용합니다.
  const gridRows = pokeData?.map((p: any) => ({
    id: p.id,            // 포켓몬 고유 번호 (ex. 1, 4, 25)
    name: p.name,        
    koName: p.koName,
    url: p.url,          // ⚡ 중요: Columns의 렌더 셀이 API 주소 및 캐싱 키로 활용함
    isFavorite: p.isFavorite,
  })) || [];

  // 최초 로드시에만 스피너를 보여준다.
  if (isLoading) return <RandomSpinner />;
  if (error) return <h1>404 ERROR</h1>;

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      {/* 상단 헤더 섹션 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, px: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
          포켓몬 목록
        </Typography>
        <Box sx={{ display: "flex", gap: "8px" }}>
          {/* 필요한 버튼 활성화 시 여기에 배치 */}
        </Box>
      </Box>

      {/* DataGrid (정리된 props 사용) */}
      <DataGrid
        rows={gridRows}
        columns={columns} 
        disableRowSelectionOnClick
        showToolbar 
        rowSelectionModel={selection.rowSelectionModel}
        onRowSelectionModelChange={selection.setRowSelectionModel}
        paginationModel={pagination.paginationModel}
        onPaginationModelChange={pagination.setPaginationModel}
        localeText={koKR.components.MuiDataGrid.defaultProps.localeText}
        
        // 💡 행을 클릭하면 모달을 열면서 해당 행의 데이터를 집어넣습니다.
        onRowClick={(params) => {
          modal.setSelectedRow(params.row);
          modal.setDetailOpen(true);
        }}
        
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
        sx={{ 
          "& .MuiDataGrid-row:hover": { backgroundColor: "#f3f9ff" },
          "& .MuiDataGrid-cell": {
            fontSize: "1rem", 
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "1rem",   
            fontWeight: 700,
          },
        }}
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