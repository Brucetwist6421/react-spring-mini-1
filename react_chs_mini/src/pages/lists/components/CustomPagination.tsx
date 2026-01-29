import {
  gridPageCountSelector,
  gridPageSelector,
  gridPageSizeSelector, // 추가된 부분
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { Box, Typography, TextField, IconButton, MenuItem, Select } from "@mui/material";
import { FirstPage, LastPage, NavigateBefore, NavigateNext } from "@mui/icons-material";

export default function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector); // 현재 페이지 사이즈

  const handlePageInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      const targetPage = Number((event.target as HTMLInputElement).value) - 1;
      if (targetPage >= 0 && targetPage < pageCount) {
        apiRef.current.setPage(targetPage);
      } else {
        alert(`1에서 ${pageCount} 사이의 숫자를 입력해주세요.`);
      }
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, px: 2, py: 1, width: "100%" }}>
      
      {/* 1. 페이지 당 데이터 수 (Rows per page) */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>페이지 당 데이터 수:</Typography>
        <Select
          size="small"
          value={pageSize}
          onChange={(e) => apiRef.current.setPageSize(Number(e.target.value))}
          sx={{ height: 30, fontSize: "0.75rem", "& .MuiSelect-select": { py: 0 } }}
        >
          {[10, 30, 50].map((size) => (
            <MenuItem key={size} value={size}>{size}</MenuItem>
          ))}
        </Select>
      </Box>

      {/* 2. 페이지 직접 입력 UI */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b" }}>페이지 이동:</Typography>
        <TextField
          size="small"
          defaultValue={page + 1}
          key={page}
          onKeyDown={handlePageInput}
          sx={{ width: 50, "& .MuiInputBase-input": { p: "4px 8px", fontSize: "0.75rem", textAlign: "center" } }}
        />
        <Typography variant="caption" sx={{ color: "#94a3b8" }}> / {pageCount}</Typography>
      </Box>

      {/* 3. 네비게이션 버튼들 */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => apiRef.current.setPage(0)} disabled={page === 0} size="small">
          <FirstPage fontSize="small" />
        </IconButton>
        <IconButton onClick={() => apiRef.current.setPage(page - 1)} disabled={page === 0} size="small">
          <NavigateBefore fontSize="small" />
        </IconButton>
        
        <Typography variant="caption" sx={{ mx: 1, fontWeight: 700, minWidth: '30px', textAlign: 'center' }}>
          {page + 1}
        </Typography>

        <IconButton onClick={() => apiRef.current.setPage(page + 1)} disabled={page >= pageCount - 1} size="small">
          <NavigateNext fontSize="small" />
        </IconButton>
        <IconButton onClick={() => apiRef.current.setPage(pageCount - 1)} disabled={page >= pageCount - 1} size="small">
          <LastPage fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}