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
import { Tooltip } from "@mui/material";

const LmsDashboardRow = ({ row }: { row: LmsDashboardData }) => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // 인원 확인 변수 (가독성을 위해 추출)
  const isEmpty = row.activeAccounts === 0;

  return (
    <>
      <TableRow
        // 인원이 0명이면 클릭 이벤트(상세 펼치기)를 실행하지 않음
        onClick={() => !isEmpty && setOpen(!open)}
        sx={{
          "& > *": { borderBottom: "unset" },
          "&:hover": { bgcolor: isEmpty ? "inherit" : "#f1f5f9" }, // 인원 없으면 호버 효과 제거
          cursor: isEmpty ? "default" : "pointer", // 인원 없으면 커서 모양 변경
          transition: "background-color 0.2s",
          opacity: isEmpty ? 0.7 : 1, // 시각적으로 비활성 상태임을 표시
        }}
      >
        {/* 1. 확장 아이콘 */}
        <TableCell width="50px">
          <IconButton 
            size="small" 
            disabled={isEmpty} // 🔥 인원 없으면 아이콘 클릭 불가
          >
            {/* 인원이 0이면 펼쳐질 일이 없으므로 아이콘 상태 고정 혹은 숨김 처리 가능 */}
            {open && !isEmpty ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        {/* 2. 과정 정보 */}
        <TableCell component="th" scope="row" width="20%">
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
        <TableCell align="center" width="20%">
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            {/* 성적현황 버튼 - 인원이 없으면 볼 데이터가 없으므로 함께 비활성화 권장 */}
            <Button
              variant="outlined"
              size="small"
              disabled={row.activeAccounts === 0}
              startIcon={<AssessmentIcon />}
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              sx={{ borderRadius: "6px", textTransform: "none", fontWeight: "bold" }}
            >
              성적현황
            </Button>

            <Tooltip 
              title={row.activeAccounts === 0 ? "등록된 학생이 없습니다" : ""} 
              arrow 
              placement="top"
            >
              <span> {/* disabled 버튼은 Tooltip이 작동하지 않을 수 있어 span으로 감쌉니다 */}
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  disabled={row.activeAccounts === 0} // 인원이 0이면 비활성화
                  startIcon={<SettingsIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/lms/management/${row.curSeq}`);
                    // 이동 후 즉시 스크롤을 최상단으로 이동
                    window.scrollTo({
                      top: 0,
                      behavior: "instant" // "smooth" 보다 "instant"가 페이지 전환 시 더 깔끔합니다.
                    });
                  }}
                  sx={{ 
                    borderRadius: "6px", 
                    fontWeight: "bold", 
                    boxShadow: 'none',
                    // 비활성화 시 스타일 정의 (선택 사항)
                    "&.Mui-disabled": {
                      bgcolor: "#e2e8f0",
                      color: "#94a3b8"
                    }
                  }}
                >
                  학생관리
                </Button>
              </span>
            </Tooltip>
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
          colSpan={6} 
          onClick={(e) => e.stopPropagation()}
        >
          {/*isEmpty가 true이면 Collapse 자체가 렌더링되지 않도록 원천 차단 */}
          {!isEmpty && (
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
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

export default LmsDashboardRow;