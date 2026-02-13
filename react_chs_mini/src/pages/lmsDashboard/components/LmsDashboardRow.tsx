import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, Collapse, Grid, IconButton, LinearProgress, Paper, TableCell, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import type { LmsDashboardData } from "../types/lmsDashboardType";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Button } from "@mui/material";
import LmsStudentStatusModal from "./LmsStudentStatusModal";

import { useNavigate } from "react-router-dom"; 
import SettingsIcon from "@mui/icons-material/Settings"; 

const LmsDashboardRow = ({ row }: { row: LmsDashboardData }) => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

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
            {row.curName} - {row.className}호 ({row.term}기)
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

        {/* 5. 버튼 그룹 셀 (현황보기 유지 + 과정관리 추가) */}
        <TableCell align="center" width="200px">
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            {/* 기존 현황보기 버튼 */}
            <Button
              variant="outlined"
              size="small"
              startIcon={<AssessmentIcon />}
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              sx={{ borderRadius: "6px", textTransform: "none", fontWeight: "bold" }}
            >
              성적현황
            </Button>

            {/* 과정관리 버튼 (상세 페이지 이동) */}
            <Button
              variant="contained"
              size="small"
              color="primary"
              startIcon={<SettingsIcon />}
              onClick={(e) => {
                e.stopPropagation();
                // 1단계: 해당 과정의 학생 리스트 페이지로 이동
                navigate(`/lms/management/${row.curSeq}`);
              }}
              sx={{ borderRadius: "6px", fontWeight: "bold", boxShadow: 'none' }}
            >
              학생관리
            </Button>
          </Box>
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
          colSpan={6} //
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