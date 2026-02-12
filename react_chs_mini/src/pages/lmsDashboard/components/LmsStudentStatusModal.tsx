/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  Dialog, DialogTitle, DialogContent, Table, TableHead, TableBody, 
  TableCell, TableRow, Chip, Paper, Typography, Box, TableContainer, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // 닫기 버튼용

const LmsStudentStatusModal = ({ open, onClose, row }: any) => {
  // 실제 데이터가 없을 경우를 대비한 방어 코드
  if (!row) return null;

  // 가상 데이터 (실제로는 API에서 받아온 데이터를 state로 관리하세요)
  const studentScores = [
    { name: "김철수", scores: { "자바": 90, "리액트": 85, "DB": 95 }, total: 270, avg: 90 },
    { name: "이영희", scores: { "자바": 80, "리액트": 70, "DB": 75 }, total: 225, avg: 75 },
    { name: "박지민", scores: { "자바": 95, "리액트": 90, "DB": 85 }, total: 270, avg: 90 },
  ];

  // 과정 평균 계산 (예시)
  const courseAvg = 85.0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      {/* 제목 영역: 닫기 버튼 추가 및 태그 오류 수정 */}
      <DialogTitle sx={{ 
        fontWeight: "bold", 
        bgcolor: "#f8fafc", 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {row.className} - 학생별 성적 현황
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {/* 상단 과정 요약 통계 카드 */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 1 }}>
          <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: 'center', bgcolor: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>과정 전체 평균</Typography>
            <Typography variant="h5" color="primary" fontWeight="bold">{courseAvg}점</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: 'center', bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>수강 인원</Typography>
            <Typography variant="h5" sx={{ color: '#16a34a' }} fontWeight="bold">{studentScores.length}명</Typography>
          </Paper>
        </Box>

        <TableContainer sx={{ maxHeight: 500, borderRadius: 1, border: '1px solid #e2e8f0' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8fafc' }}>학생명</TableCell>
                {row.subjects.map((sub: any) => (
                  <TableCell key={sub.subjectName} align="center" sx={{ fontWeight: 'bold', bgcolor: '#f8fafc' }}>
                    {sub.subjectName}
                  </TableCell>
                ))}
                {/* 배경색 포인트를 주어 시각적 구분 강화 */}
                <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#fff7ed', color: '#c2410c' }}>총점</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#f0fdf4', color: '#15803d' }}>평균</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentScores.map((student, idx) => (
                <TableRow key={idx} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{student.name}</TableCell>
                  {row.subjects.map((sub: any) => (
                    <TableCell key={sub.subjectName} align="center">
                      {/* 학생 데이터의 과목명과 테이블 헤더의 과목명을 매칭 */}
                      {student.scores[sub.subjectName as keyof typeof student.scores] || 0}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#fffaf5' }}>{student.total}</TableCell>
                  <TableCell align="center" sx={{ bgcolor: '#f7fee7' }}>
                    <Chip 
                      label={`${student.avg.toFixed(1)}점`} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontWeight: 'bold', bgcolor: 'white' }}
                      color={student.avg >= 90 ? "success" : student.avg >= 80 ? "primary" : "default"} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default LmsStudentStatusModal;