import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, Collapse, Grid, IconButton, LinearProgress, Paper, TableCell, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import type { LmsDashboardData } from "../types/lmsDashboardType";

const LmsDashboardRow = ({ row }: { row: LmsDashboardData }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow 
        // 1. 클릭 이벤트 추가
        onClick={() => setOpen(!open)}
        sx={{ 
          "& > *": { borderBottom: "unset" }, 
          "&:hover": { bgcolor: "#f1f5f9" }, // 호버 색상을 조금 더 명확하게 변경
          cursor: "pointer",                 // 마우스 커서 포인터 변경
          transition: "background-color 0.2s"
        }}
      >
        {/* 1. 확장 아이콘 */}
        <TableCell width="50px">
          <IconButton size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        {/* 2. 과정 정보 */}
        <TableCell component="th" scope="row" width="30%">
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
            {row.className} ({row.term}기)
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
            {row.period}
          </Typography>
        </TableCell>

        {/* 3. 인원 현황 */}
        <TableCell align="left" width="20%">
          <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
            {row.activeAccounts} / {row.totalEnrolled} 명
          </Typography>
        </TableCell>

        {/* 4. 이행률 - 헤더와 맞춰서 정렬 정리 */}
        <TableCell align="left" sx={{ pr: 4 }}> 
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {/* 수치를 막대 왼쪽으로 배치하여 헤더 제목 바로 아래 오도록 함 */}
            <Typography variant="body1" sx={{ mr: 2, minWidth: 50, fontWeight: "bold", fontSize: "1rem" }}>
              {row.totalAvgRatio}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={row.totalAvgRatio} 
              sx={{ 
                flexGrow: 1, 
                height: 12, 
                borderRadius: 6,
                bgcolor: "#e2e8f0"
              }} 
              color={row.totalAvgRatio > 70 ? "success" : "warning"}
            />
          </Box>
        </TableCell>
      </TableRow>

      <TableRow>
        {/* 상세 영역 (클릭해도 닫히지 않도록 이벤트 전파 방지 처리) */}
        <TableCell 
          style={{ paddingBottom: 0, paddingTop: 0 }} 
          colSpan={4}
          onClick={(e) => e.stopPropagation()} // 상세 영역 클릭 시 닫히는 것 방지
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#334155" }}>
                과목별 이행률 상세
              </Typography>
              <Grid container spacing={2}>
                {row.subjects.map((sub, idx) => (
                  <Grid key={idx} size={{ xs: 12, sm: 4 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: "bold", mb: 1 }}>
                        {sub.subjectName}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 600 }}>{sub.ratio}%</Typography>
                        <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                          {sub.submittedCount}명 완료
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={sub.ratio} 
                        sx={{ mt: 1.5, height: 6, borderRadius: 3 }} 
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default LmsDashboardRow;