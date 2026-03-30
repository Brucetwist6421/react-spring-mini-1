import { useCallback, useEffect, useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, Typography, Box, CircularProgress, TextField 
} from "@mui/material";
import api from "../../../api/axiosInstance";

interface SubjectVO {
  subSeq: number;
  curSeq: number;
  subName: string;
  startDate: string;
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
  
  // 과목 추가 입력을 위한 상태
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState({
    subName: "",
    startDate: "",
    endDate: ""
  });

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
  }, [curSeq]);

  useEffect(() => {
    if (open) {
      fetchSubjects();
      setIsAdding(false); // 모달 열 때 입력창 초기화
    }
  }, [open, fetchSubjects]);

  // -----------------------------------------------------------
  // 과목 등록 실행 함수 (API 연동)
  // -----------------------------------------------------------
  const handleAddSubject = async () => {
    if (!newSubject.subName || !newSubject.startDate || !newSubject.endDate) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const payload = {
        ...newSubject,
        curSeq: curSeq,
        regId: "ADMIN", // 실제 구현 시 로그인한 사용자 ID 권장
        status: "운영중"
      };

      await api.post("/api/subject/register", payload);
      alert("새 과목이 등록되었습니다.");
      
      // 입력창 초기화 및 목록 새로고침
      setNewSubject({ subName: "", startDate: "", endDate: "" });
      setIsAdding(false);
      fetchSubjects(); 
    } catch (err) {
      console.error("과목 등록 실패:", err);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

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
          </Box>
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f1f5f9" }}>과목명</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f1f5f9" }} align="center">학습 기간</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f1f5f9" }} align="center">상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* 과목 추가 입력 행 (isAdding이 true일 때만 표시) */}
              {isAdding && (
                <TableRow sx={{ bgcolor: "#fffbeb" }}>
                  <TableCell>
                    <TextField 
                      size="small" fullWidth placeholder="과목명 입력"
                      value={newSubject.subName}
                      onChange={(e) => setNewSubject({...newSubject, subName: e.target.value})}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField 
                        type="date" size="small"
                        value={newSubject.startDate}
                        onChange={(e) => setNewSubject({...newSubject, startDate: e.target.value})}
                      />
                      ~
                      <TextField 
                        type="date" size="small"
                        value={newSubject.endDate}
                        onChange={(e) => setNewSubject({...newSubject, endDate: e.target.value})}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Button variant="contained" size="small" onClick={handleAddSubject}>저장</Button>
                    <Button size="small" color="inherit" onClick={() => setIsAdding(false)}>취소</Button>
                  </TableCell>
                </TableRow>
              )}

              {subjects.length > 0 ? (
                subjects.map((sub) => (
                  <TableRow key={sub.subSeq} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{sub.subName}</TableCell>
                    <TableCell align="center" sx={{ color: "#64748b" }}>
                      {sub.startDate} ~ {sub.endDate}
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={sub.status || "운영중"} size="small" color="primary" />
                    </TableCell>
                  </TableRow>
                ))
              ) : !isAdding && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 5 }}>등록된 과목이 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0', bgcolor: "#f8fafc" }}>
        <Button onClick={onClose} variant="outlined" color="inherit">닫기</Button>
        {!isAdding && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setIsAdding(true)}
            sx={{ fontWeight: 'bold' }}
          >
            과목 추가
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LmsSubjectListModal;