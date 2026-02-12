import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, Collapse, Grid, IconButton, LinearProgress, Paper, TableCell, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import type { LmsDashboardData } from "../types/lmsDashboardType";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Button } from "@mui/material";
import LmsStudentStatusModal from "./LmsStudentStatusModal";

const LmsDashboardRow = ({ row }: { row: LmsDashboardData }) => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <TableRow 
        onClick={() => setOpen(!open)}
        sx={{ 
          "& > *": { borderBottom: "unset" }, 
          "&:hover": { bgcolor: "#f1f5f9" },
          cursor: "pointer",
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
        <TableCell component="th" scope="row" width="25%">
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
            {row.className} ({row.term}기)
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
            {row.period}
          </Typography>
        </TableCell>

        {/* 3. 인원 현황 */}
        <TableCell align="left" width="15%">
          <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
            {row.activeAccounts} / {row.totalEnrolled} 명
          </Typography>
        </TableCell>

        {/* 4. 이행률 */}
        <TableCell align="left" width="40%"> 
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography variant="body1" sx={{ mr: 2, minWidth: 50, fontWeight: "bold", fontSize: "1rem" }}>
              {row.totalAvgRatio}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={row.totalAvgRatio} 
              sx={{ flexGrow: 1, height: 10, borderRadius: 6, bgcolor: "#e2e8f0" }} 
              color={row.totalAvgRatio > 70 ? "success" : "warning"}
            />
          </Box>
        </TableCell>

        {/* 5. 현황보기 버튼 (이 셀을 행 안으로 이동시켰습니다) */}
        <TableCell align="center" width="15%">
          <Button
            variant="outlined" // 배경색이 너무 튀지 않게 outlined로 변경 (취향에 따라 contained 유지 가능)
            size="small"
            startIcon={<AssessmentIcon />}
            onClick={(e) => {
              e.stopPropagation(); // 행 클릭(확장) 이벤트 방지
              setIsModalOpen(true);
            }}
            sx={{ 
              borderRadius: "6px", 
              textTransform: "none", 
              fontWeight: "bold",
              whiteSpace: "nowrap" // 버튼 글자 줄바꿈 방지
            }}
          >
            현황보기
          </Button>
        </TableCell>
      </TableRow>

      {/* 학생 성적 상세 모달 */}
      <LmsStudentStatusModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        row={row} 
      />

      {/* 확장 영역 (Collapse) */}
      <TableRow>
        <TableCell 
          style={{ paddingBottom: 0, paddingTop: 0 }} 
          colSpan={5} // 버튼 셀이 추가되었으므로 colSpan을 5로 늘려야 합니다.
          onClick={(e) => e.stopPropagation()}
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
                      <LinearProgress variant="determinate" value={sub.ratio} sx={{ mt: 1.5, height: 6, borderRadius: 3 }} />
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