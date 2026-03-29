import { useCallback, useEffect, useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, Typography, Box, CircularProgress 
} from "@mui/material";
import api from "../../../api/axiosInstance";

// -----------------------------------------------------------
// 별도 파일 없이 내부에 직접 선언한 SubjectVO 타입 (DB 구조 반영)
// -----------------------------------------------------------
interface SubjectVO {
  subSeq: number;
  curSeq: number;
  subName: string;
  startDate: string; // LocalDate는 JSON 변환 시 string으로 옵니다.
  endDate: string;
  status: string | null;
  regId: string;
  regDate: string;
  updateId: string | null;
  updateDate: string | null;
  accountSeq: number | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  curSeq: number;
  curName: string;
}

const LmsSubjectListModal = ({ open, onClose, curSeq, curName }: Props) => {
  const [subjects, setSubjects] = useState<SubjectVO[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. useCallback으로 감싸서 메모이제이션
    const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
        const res = await api.get(`/api/subject/curriculum/${curSeq}`);
        setSubjects(res.data);
    } catch (err) {
        console.error("과목 조회 실패:", err);
    } finally {
        setLoading(false);
    }
    }, [curSeq]); // curSeq가 바뀔 때만 함수가 새로 생성됨

    // 2. 이제 의존성 배열에 안전하게 추가 가능
    useEffect(() => {
    if (open) {
        fetchSubjects();
    }
    }, [open, fetchSubjects]);


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", bgcolor: "#f8fafc", borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold", color: "#1e293b" }}>
          [{curName}] 과정 커리큘럼 상세
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress size={30} />
            <Typography sx={{ ml: 2, color: 'text.secondary' }}>과목 데이터를 불러오는 중...</Typography>
          </Box>
        ) : subjects.length > 0 ? (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f1f5f9", width: '40%' }}>과목명</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f1f5f9" }} align="center">학습 기간</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f1f5f9" }} align="center">상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects.map((sub) => (
                <TableRow key={sub.subSeq} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 500, color: "#334155" }}>
                    {sub.subName}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#64748b" }}>
                    {sub.startDate} ~ {sub.endDate}
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={sub.status || "운영중"} 
                      size="small" 
                      color={sub.status === "종료" ? "default" : "primary"}
                      variant={sub.status === "종료" ? "outlined" : "filled"}
                      sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary', mb: 1 }}>등록된 과목 정보가 없습니다.</Typography>
            <Typography variant="caption" color="text.disabled">행정실에 교육과정 편성을 확인해주세요.</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0', bgcolor: "#f8fafc" }}>
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ fontWeight: 'bold' }}>
          닫기
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<span>+</span>}
          onClick={() => alert('과목 추가/편집 기능은 다음 업데이트에 포함될 예정입니다.')}
          sx={{ fontWeight: 'bold', boxShadow: 'none' }}
        >
          과목 추가
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LmsSubjectListModal;