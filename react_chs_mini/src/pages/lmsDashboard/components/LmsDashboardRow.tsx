import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, LinearProgress, Paper, TableCell, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import type { LmsDashboardData } from "../types/lmsDashboardType";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Button } from "@mui/material";
import LmsStudentStatusModal from "./LmsStudentStatusModal";
import PersonAddIcon from "@mui/icons-material/PersonAdd"; // 아이콘 추가
import LmsStudentAddModal from "./LmsStudentAddModal"; // 생성한 모달 임포트
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ListIcon from "@mui/icons-material/List"; // 아이콘 추가

import { useNavigate } from "react-router-dom"; 
import SettingsIcon from "@mui/icons-material/Settings"; 
import { Tooltip } from "@mui/material";
import LmsCurriculumEditModal from "./LmsCurriculumEditModal";
import api from "../../../api/axiosInstance";
import LmsDailyLogModal from "./LmsDailyLogModal";
import LmsSubjectListModal from "./LmsSubjectListModal";

const LmsDashboardRow = ({ row, onRefresh }: { row: LmsDashboardData, onRefresh: () => void }) => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false); // 과목 모달 상태 추가

  const navigate = useNavigate();

  // 인원 확인 변수 (가독성을 위해 추출)
  const isEmpty = row.activeAndGraduated === 0;

  // 삭제 처리 함수
  const handleDelete = async () => {
    try {
      await api.patch(`/api/curriculum/delete/${row.curSeq}`);
      alert("과정이 삭제 처리되었습니다.");
      onRefresh(); // 리스트 갱신
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

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
            disabled={isEmpty} // 인원 없으면 아이콘 클릭 불가
          >
            {/* 인원이 0이면 펼쳐질 일이 없으므로 아이콘 상태 고정 혹은 숨김 처리 가능 */}
            {open && !isEmpty ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        {/* 2. 과정 정보 */}
        <TableCell component="th" scope="row" width="20%">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              {row.curName} - {row.className}호 ({row.term}기)
            </Typography>

            <Box sx={{ display: 'flex', ml: 'auto' }}>
              {/* 수정 버튼 */}
              <Tooltip title="과정 수정">
                <IconButton 
                  size="small" 
                  onClick={(e) => { e.stopPropagation(); setIsEditModalOpen(true); }}
                  sx={{ color: 'primary.main' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* 삭제 버튼 */}
              <Tooltip title="과정 삭제">
                <IconButton 
                  size="small" 
                  onClick={(e) => { e.stopPropagation(); setIsDeleteConfirmOpen(true); }}
                  sx={{ 
                    color: '#94a3b8', 
                    '&:hover': { color: 'error.main', bgcolor: '#fef2f2' } 
                  }}
                >
                  <DeleteForeverIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
            {row.period}
          </Typography>
        </TableCell>

        {/* 담당 교수 */}
        <TableCell width="7%" align="left">
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
            {row.teacherName || '미정'}
          </Typography>
        </TableCell>

        {/* 3. 인원 현황 */}
        <TableCell align="left" width="12%">
          <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
            {row.activeAndGraduated} / {row.totalEnrolled} 명
          </Typography>
        </TableCell>

        {/* 4. 이행률 */}
        <TableCell align="left" width="20%"> 
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
        <TableCell align="center" width="40%">
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            {/*  과목 관리 버튼 */}
            <Button
              variant="outlined"
              size="small"
              color="success" // 다른 버튼과 구분되게 초록색 계열 추천
              startIcon={<ListIcon />}
              onClick={(e) => {
                e.stopPropagation();
                setIsSubjectModalOpen(true);
              }}
              sx={{ borderRadius: "6px", fontWeight: "bold" }}
            >
              과목관리
            </Button>
             {/* 학생 등록 버튼 */}
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              startIcon={<PersonAddIcon />}
              onClick={(e) => {
                e.stopPropagation();
                setIsAddModalOpen(true);
              }}
              sx={{ borderRadius: "6px", fontWeight: "bold" }}
            >
              학생등록
            </Button>

            <Button
              variant="outlined"
              size="small"
              color="info"
              disabled={row.activeAndGraduated === 0}
              startIcon={<LibraryBooksIcon />}
              onClick={(e) => {
                e.stopPropagation();
                setIsLogModalOpen(true);
              }}
              sx={{ borderRadius: "6px", fontWeight: "bold" }}
            >
              훈련일지 등록
            </Button>

            {/* 성적현황 버튼 - 인원이 없으면 볼 데이터가 없으므로 함께 비활성화 권장 */}
            <Button
              variant="outlined"
              size="small"
              disabled={row.activeAndGraduated === 0}
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
              title={row.activeAndGraduated === 0 ? "등록된 학생이 없습니다" : ""} 
              arrow 
              placement="top"
            >
              <span> {/* disabled 버튼은 Tooltip이 작동하지 않을 수 있어 span으로 감쌉니다 */}
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  disabled={row.activeAndGraduated === 0} // 인원이 0이면 비활성화
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

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: 'error.main' }}>
          과정 삭제 확인
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>[{row.curName} - {row.term}기]</strong> 과정을 삭제하시겠습니까?
            <br />
            삭제된 과정은 대시보드에서 더 이상 조회되지 않습니다.
            {!isEmpty && (
              <Box sx={{ mt: 2, p: 1.5, bgcolor: '#fff7ed', borderRadius: 1, border: '1px solid #ffedd5' }}>
                <Typography variant="caption" color="#9a3412" sx={{ fontWeight: 'bold' }}>
                  ⚠️ 경고: 현재 이 과정에 등록된 학생이 {row.activeAndGraduated}명 존재합니다.
                </Typography>
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsDeleteConfirmOpen(false)} color="inherit">취소</Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error" 
            autoFocus
            sx={{ fontWeight: 'bold' }}
          >
            삭제하기
          </Button>
        </DialogActions>
      </Dialog>

      {/* 학생 성적 상세 모달 */}
      <LmsStudentStatusModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        row={row} 
      />

      {/* 학생 등록 모달 */}
      <LmsStudentAddModal 
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        curSeq={row.curSeq}
        curName={row.curName}
        curClass={row.className}
        term={row.term}
        onSuccess={() => {
          // 필요 시 부모 페이지의 리스트를 다시 불러오는 로직 (window.location.reload() 등)
          onRefresh();
          setIsAddModalOpen(false);
        }}
      />

      {/*  과목 관리 모달 */}
      <LmsSubjectListModal 
        open={isSubjectModalOpen}
        onClose={() => {
          setIsSubjectModalOpen(false);
          onRefresh(); // 모달이 닫힐 때 최신 데이터를 상위에서 다시 불러옴
        }}
        curSeq={row.curSeq}
        curName={row.curName}
      />

      {/* 과정 정보 수정 모달 */}
      <LmsCurriculumEditModal 
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        curData={row}
        onUpdate={onRefresh} // 수정 성공 시 부모 리스트 갱신
      />

      {/* 훈련 일지 등록 모달 */}
      <LmsDailyLogModal 
        open={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false); // 1. 모달창을 닫고
          onRefresh();              // 2. 부모(Dashboard)의 통합 새로고침 함수 실행!
        }}
        curSeq={row.curSeq} // 과정 시퀀스 전달
        curData={row} // 필요 시 과정 데이터 전체 전달
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
                          {row.activeAndGraduated}명 중 {sub.submittedCount}명 완료
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