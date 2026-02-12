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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";

const LmsStudentStatusModal = ({ open, onClose, row }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [studentScores, setStudentScores] = useState<any[]>([]);

  console.log("모달 전달 데이터:", row);
  

  // 1. API 데이터 호출
  useEffect(() => {
    // row 자체를 찍어서 정확한 필드명을 확인
    console.log("useEffect 실행됨, row 데이터:", row);

    // curSeq가 아니라 cur_seq 일 수도 있습니다.
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
    } else {
        console.warn("API 호출 조건 미충족: open =", open, "targetSeq =", targetSeq);
    }
  }, [open, row]);

  // 2. 과정 전체 평균 계산 (클라이언트측 계산 또는 API 결과 활용)
  const courseAvg = useMemo(() => {
    if (studentScores.length === 0) return "0.0";
    const total = studentScores.reduce(
      (acc, curr) => acc + (curr.avgScore || 0),
      0,
    );
    return (total / studentScores.length).toFixed(1);
  }, [studentScores]);

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
        {/* component="span"을 추가하여 h2 내부의 h6 문제를 해결합니다. */}
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          {row.className} - 학생별 성적 현황
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* 상단 요약 통계 */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, mt: 1 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              flex: 1,
              textAlign: "center",
              bgcolor: "#f0f9ff",
              border: "1px solid #bae6fd",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: "bold" }}
            >
              과정 전체 평균
            </Typography>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {courseAvg}점
            </Typography>
          </Paper>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              flex: 1,
              textAlign: "center",
              bgcolor: "#f0fdf4",
              border: "1px solid #bbf7d0",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: "bold" }}
            >
              조회 인원
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: "#16a34a" }}
              fontWeight="bold"
            >
              {studentScores.length}명
            </Typography>
          </Paper>
        </Box>

        <TableContainer
          sx={{ maxHeight: 550, borderRadius: 1, border: "1px solid #e2e8f0" }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold", bgcolor: "#f8fafc", minWidth: 100 }}
                >
                  학생명
                </TableCell>
                {/* 3. 과목 헤더: row.subjects를 기반으로 렌더링 */}
                {row.subjects?.map((sub: any) => (
                  <TableCell
                    key={sub.subjectName}
                    align="center"
                    sx={{ fontWeight: "bold", bgcolor: "#f8fafc" }}
                  >
                    {sub.subjectName}
                  </TableCell>
                ))}
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#fff7ed",
                    color: "#c2410c",
                  }}
                >
                  총점
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#f0fdf4",
                    color: "#15803d",
                  }}
                >
                  평균
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={row.subjects?.length + 3}
                    align="center"
                    sx={{ py: 10 }}
                  >
                    <CircularProgress size={40} />
                    <Typography sx={{ mt: 2, color: "text.secondary" }}>
                      데이터를 불러오는 중입니다...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : studentScores.length > 0 ? (
                studentScores.map((student, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {student.accountName}
                    </TableCell>
                    {/* 4. 점수 매칭: API의 scores 배열에서 subjectName이 일치하는 점수 출력 */}
                    {row.subjects?.map((sub: any) => {
                      const subjectScore = student.scores?.find(
                        (s: any) => s.subjectName === sub.subjectName,
                      );
                      return (
                        <TableCell key={sub.subjectName} align="center">
                          {subjectScore ? subjectScore.score : 0}
                        </TableCell>
                      );
                    })}
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "bold", bgcolor: "#fffaf5" }}
                    >
                      {student.totalScore}
                    </TableCell>
                    <TableCell align="center" sx={{ bgcolor: "#f7fee7" }}>
                      <Chip
                        label={`${(student.avgScore || 0).toFixed(1)}점`}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: "bold", bgcolor: "white" }}
                        color={
                          student.avgScore >= 90
                            ? "success"
                            : student.avgScore >= 80
                              ? "primary"
                              : "default"
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={row.subjects?.length + 3}
                    align="center"
                    sx={{ py: 10 }}
                  >
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

export default LmsStudentStatusModal;
