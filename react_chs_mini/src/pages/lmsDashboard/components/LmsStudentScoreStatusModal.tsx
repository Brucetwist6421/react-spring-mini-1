/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  Paper,
  Typography,
  Box,
  TableContainer,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LaunchIcon from "@mui/icons-material/Launch"; // 새창 아이콘 추가
import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";

const LmsStudentScoreStatusModal = ({ open, onClose, row }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [studentScores, setStudentScores] = useState<any[]>([]);

  useEffect(() => {
    const targetSeq = row?.curSeq || row?.cur_seq || row?.CUR_SEQ;

    if (open && targetSeq) {
      const fetchStudentStats = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/api/lmsDashboard/student-stats/${targetSeq}`);
          setStudentScores(res.data);
        } catch (err) {
          console.error("전송 에러:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchStudentStats();
    }
  }, [open, row]);

  const courseAvg = useMemo(() => {
    if (studentScores.length === 0) return "0.0";
    const total = studentScores.reduce((acc, curr) => acc + (curr.avgScore || 0), 0);
    return (total / studentScores.length).toFixed(1);
  }, [studentScores]);

  // 학생 성적 관리 페이지로 이동 (탭 번호 1번 전달)
  const handleGoToStudentDetail = (accountSeq: number) => {
    // 부모 컴포넌트의 URL 구조에 맞게 설정 (관리 ID 18, 학생 ID 154 등)
    // tab=1은 "시험 성적 관리" 탭을 의미함
    const url = `/lms/management/${row.curSeq}/student/${accountSeq}?tab=1`; 
    window.open(url, "_blank");
  };

  if (!row) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: "bold",
          bgcolor: "#f8fafc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          {row.curName} - {row.className} 호 학생 별 성적 현황
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", gap: 2, mb: 3, mt: 1 }}>
          <Paper
            variant="outlined"
            sx={{ p: 2, flex: 1, textAlign: "center", bgcolor: "#f0f9ff", border: "1px solid #bae6fd" }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "bold" }}>
              과정 전체 평균
            </Typography>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {courseAvg}점
            </Typography>
          </Paper>
          <Paper
            variant="outlined"
            sx={{ p: 2, flex: 1, textAlign: "center", bgcolor: "#f0fdf4", border: "1px solid #bbf7d0" }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "bold" }}>
              조회 인원
            </Typography>
            <Typography variant="h5" sx={{ color: "#16a34a" }} fontWeight="bold">
              {studentScores.length}명
            </Typography>
          </Paper>
        </Box>

        <TableContainer sx={{ maxHeight: 550, borderRadius: 1, border: "1px solid #e2e8f0" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f8fafc", minWidth: 100 }}>
                  학생명
                </TableCell>
                {row.subjects?.map((sub: any) => (
                  <TableCell key={sub.subjectName} align="center" sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                    {sub.subjectName}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "#fff7ed", color: "#c2410c" }}>
                  총점
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "#f0fdf4", color: "#15803d" }}>
                  평균
                </TableCell>
                {/* 관리 버튼 헤더 추가 */}
                <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}>
                  성적 관리
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={(row.subjects?.length || 0) + 4} align="center" sx={{ py: 10 }}>
                    <CircularProgress size={40} />
                  </TableCell>
                </TableRow>
              ) : studentScores.length > 0 ? (
                studentScores.map((student, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{student.accountName}</TableCell>
                    {row.subjects?.map((sub: any) => {
                      const subjectScore = student.scores?.find(
                        (s: any) => s.subjectName.trim() === sub.subjectName.trim()
                      );
                      const hasScore = subjectScore !== undefined && subjectScore.score !== null;
                      return (
                        <TableCell key={sub.subjectName} align="center">
                          {hasScore ? subjectScore.score : <span style={{ color: '#94a3b8' }}>미응시</span>}
                        </TableCell>
                      );
                    })}
                    <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "#fffaf5" }}>
                      {student.totalScore}
                    </TableCell>
                    <TableCell align="center" sx={{ bgcolor: "#f7fee7" }}>
                      <Chip
                        label={`${(student.avgScore || 0).toFixed(1)}점`}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: "bold", bgcolor: "white" }}
                        color={
                          student.avgScore >= 90 ? "success" : student.avgScore >= 80 ? "primary" : "default"
                        }
                      />
                    </TableCell>
                    {/* 이동 버튼 셀 추가 */}
                    <TableCell align="center">
                      <Tooltip title="성적 관리 상세로 이동">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleGoToStudentDetail(student.accountSeq)}
                        >
                          <LaunchIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={(row.subjects?.length || 0) + 4} align="center" sx={{ py: 10 }}>
                    데이터가 존재하지 않습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default LmsStudentScoreStatusModal;