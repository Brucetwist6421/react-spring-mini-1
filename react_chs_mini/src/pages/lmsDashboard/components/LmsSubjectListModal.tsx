import { useCallback, useEffect, useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, Typography, Box, CircularProgress, TextField,
  Select, MenuItem, FormControl
} from "@mui/material";
import api from "../../../api/axiosInstance";

// 과목 정보 타입
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
  teacherName?: string; // 교사 이름 (JOIN 결과로 추가)
}

// 교사 정보 타입 (AccountController 대응)
interface AccountVO {
  accountSeq: number;
  accountId: string;
  accountName: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  curSeq: number;
  curName: string;
}

const LmsSubjectListModal = ({ open, onClose, curSeq, curName }: Props) => {
  const [subjects, setSubjects] = useState<SubjectVO[]>([]);
  const [teachers, setTeachers] = useState<AccountVO[]>([]); // 교사 목록 상태
  const [loading, setLoading] = useState(false);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState({
    subName: "",
    startDate: "",
    endDate: "",
    accountSeq: "" // 초기값은 빈 문자열
  });

  // 1. 과목 목록 조회
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

  // 2. 교사 목록 조회
  const fetchTeachers = useCallback(async () => {
    try {
      const res = await api.get("/api/account/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error("교사 목록 로드 실패:", err);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchSubjects();
      fetchTeachers();
      setIsAdding(false);
    }
  }, [open, fetchSubjects, fetchTeachers]);

  // 3. 과목 등록 처리
  const handleAddSubject = async () => {
    if (!newSubject.subName || !newSubject.startDate || !newSubject.endDate) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const payload = {
        ...newSubject,
        curSeq: curSeq,
        regId: "ADMIN", 
        status: "운영중",
        // accountSeq가 빈 문자열이면 null로, 값이 있으면 숫자로 변환
        accountSeq: newSubject.accountSeq === "" ? null : Number(newSubject.accountSeq)
      };

      await api.post("/api/subject/register", payload);
      alert("새 과목이 등록되었습니다.");
      
      setNewSubject({ subName: "", startDate: "", endDate: "", accountSeq: "" });
      setIsAdding(false);
      fetchSubjects(); 
    } catch (err) {
      console.error("과목 등록 실패:", err);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
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
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f1f5f9", width: '25%' }}>과목명</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f1f5f9", width: '20%' }} align="center">담당 교수</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f1f5f9", width: '35%' }} align="center">학습 기간</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f1f5f9", width: '20%' }} align="center">상태/관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isAdding && (
                <TableRow sx={{ bgcolor: "#f0f9ff" }}>
                  <TableCell>
                    <TextField 
                      size="small" fullWidth placeholder="과목명"
                      value={newSubject.subName}
                      onChange={(e) => setNewSubject({...newSubject, subName: e.target.value})}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select
                        value={newSubject.accountSeq}
                        onChange={(e) => setNewSubject({...newSubject, accountSeq: e.target.value as string})}
                        displayEmpty
                      >
                        <MenuItem value=""><em>미지정</em></MenuItem>
                        {teachers.map((t) => (
                          <MenuItem key={t.accountSeq} value={t.accountSeq}>
                            {t.accountName} ({t.accountId})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                    <Button variant="contained" size="small" onClick={handleAddSubject} sx={{ mr: 1 }}>저장</Button>
                    <Button variant="outlined" size="small" color="inherit" onClick={() => setIsAdding(false)}>취소</Button>
                  </TableCell>
                </TableRow>
              )}

              {subjects.length > 0 ? (
                subjects.map((sub) => (
                  <TableRow key={sub.subSeq} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{sub.subName}</TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {/* 현재는 Seq만 표시, 추후 JOIN 쿼리 적용 시 이름 표시 가능 */}
                        {sub.accountSeq ? `교수명: ${sub.teacherName}` : "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#64748b" }}>
                      {sub.startDate} ~ {sub.endDate}
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={sub.status || "운영중"} size="small" color="primary" variant="outlined" />
                    </TableCell>
                  </TableRow>
                ))
              ) : !isAdding && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>등록된 과목이 없습니다.</TableCell>
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