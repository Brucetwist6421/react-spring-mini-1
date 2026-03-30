import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  Table, TableBody, TableCell, TableHead, TableRow,
  TextField,
  Typography
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
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
  teacherName?: string; 
}

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
  const [teachers, setTeachers] = useState<AccountVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingSeq, setEditingSeq] = useState<number | null>(null);
  
  const [formValues, setFormValues] = useState({
    subName: "",
    startDate: "",
    endDate: "",
    accountSeq: "" as string | number,
    status: "A" // 기본값을 'A'로 설정
  });

  // 로컬 스토리지에서 accId 추출 공통 함수
  const getUpdateId = (): string => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        return userInfo.accId || 'SYSTEM';
      } catch (e) { console.error(e); return 'SYSTEM'; }
    }
    return 'SYSTEM';
  };

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/subject/curriculum/${curSeq}`);
      setSubjects(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [curSeq]);

  const fetchTeachers = useCallback(async () => {
    try {
      const res = await api.get("/api/account/teachers");
      setTeachers(res.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    if (open) {
      fetchSubjects();
      fetchTeachers();
      cancelAction();
    }
  }, [open, fetchSubjects, fetchTeachers]);

  const cancelAction = () => {
    setIsAdding(false);
    setEditingSeq(null);
    setFormValues({ subName: "", startDate: "", endDate: "", accountSeq: "", status: "A" });
  };

  const startEdit = (sub: SubjectVO) => {
    setIsAdding(false);
    setEditingSeq(sub.subSeq);
    setFormValues({
      subName: sub.subName,
      startDate: sub.startDate,
      endDate: sub.endDate,
      accountSeq: sub.accountSeq || "",
      status: sub.status || "A"
    });
  };

  // 등록 및 수정 실행
  const handleSave = async () => {
    if (!formValues.subName || !formValues.startDate || !formValues.endDate) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const currentAccId = getUpdateId();
    const payload = {
      ...formValues,
      curSeq: curSeq,
      accountSeq: formValues.accountSeq === "" ? null : Number(formValues.accountSeq)
    };

    try {
      if (editingSeq) {
        // 수정 API
        await api.put("/api/subject/update", { 
          ...payload, 
          subSeq: editingSeq, 
          updateId: currentAccId 
        });
        alert("수정되었습니다.");
      } else {
        // 등록 API
        await api.post("/api/subject/register", { 
          ...payload, 
          regId: currentAccId 
        });
        alert("등록되었습니다.");
      }
      fetchSubjects();
      cancelAction();
    } catch (err) {
      console.error(err);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  // 삭제(상태 변경) 실행
  const handleDelete = async (subSeq: number) => {
    if (!window.confirm("정말로 이 과목을 삭제하시겠습니까?")) return;

    const currentAccId = getUpdateId();
    try {
      // 논리 삭제 PATCH 호출 (Query String으로 updateId 전달)
      await api.patch(`/api/subject/delete/${subSeq}?updateId=${currentAccId}`);
      alert("삭제 처리되었습니다.");
      fetchSubjects();
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", bgcolor: "#f8fafc", borderBottom: '1px solid #e2e8f0' }}>
        [{curName}] 과정 커리큘럼 상세
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
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f1f5f9", width: '20%' }} align="center">담당 교수명</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f1f5f9", width: '30%' }} align="center">학습 기간</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f1f5f9", width: '25%' }} align="center">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              
              {/* ✅ [수정포인트 1] 과목 추가 행: 테이블 컬럼 구조를 그대로 유지해야 합니다 */}
              {isAdding && (
                <TableRow sx={{ bgcolor: "#f0f9ff" }}>
                  <TableCell>
                    <TextField 
                      size="small" 
                      fullWidth 
                      placeholder="과목명 입력"
                      value={formValues.subName} 
                      onChange={(e) => setFormValues({...formValues, subName: e.target.value})} 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" fullWidth>
                      <Select 
                        value={formValues.accountSeq} 
                        onChange={(e) => setFormValues({...formValues, accountSeq: e.target.value})} 
                        displayEmpty
                      >
                        <MenuItem value=""><em>미지정</em></MenuItem>
                        {teachers.map((t) => (
                          <MenuItem key={t.accountSeq} value={t.accountSeq}>{t.accountName}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField 
                        type="date" 
                        size="small" 
                        value={formValues.startDate} 
                        onChange={(e) => setFormValues({...formValues, startDate: e.target.value})} 
                      />
                      <Typography variant="body2">~</Typography>
                      <TextField 
                        type="date" 
                        size="small" 
                        value={formValues.endDate} 
                        onChange={(e) => setFormValues({...formValues, endDate: e.target.value})} 
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Button variant="contained" size="small" onClick={handleSave} sx={{ mr: 1 }}>저장</Button>
                    <Button variant="outlined" size="small" onClick={cancelAction}>취소</Button>
                  </TableCell>
                </TableRow>
              )}

              {/* 과목 목록 출력 (기존과 동일) */}
              {subjects.map((sub) => (
                editingSeq === sub.subSeq ? (
                  /* 수정 모드 행 */
                  <TableRow key={sub.subSeq} sx={{ bgcolor: "#fffbeb" }}>
                    <TableCell>
                      <TextField size="small" fullWidth value={formValues.subName} onChange={(e) => setFormValues({...formValues, subName: e.target.value})} />
                    </TableCell>
                    <TableCell align="center">
                      <FormControl size="small" fullWidth>
                        <Select value={formValues.accountSeq} onChange={(e) => setFormValues({...formValues, accountSeq: e.target.value})} displayEmpty>
                          <MenuItem value=""><em>미지정</em></MenuItem>
                          {teachers.map((t) => <MenuItem key={t.accountSeq} value={t.accountSeq}>{t.accountName}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField type="date" size="small" value={formValues.startDate} onChange={(e) => setFormValues({...formValues, startDate: e.target.value})} />
                        <TextField type="date" size="small" value={formValues.endDate} onChange={(e) => setFormValues({...formValues, endDate: e.target.value})} />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Button variant="contained" color="success" size="small" onClick={handleSave} sx={{ mr: 1 }}>수정완료</Button>
                      <Button variant="outlined" size="small" onClick={cancelAction}>취소</Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  /* 조회 모드 행 */
                  <TableRow key={sub.subSeq} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{sub.subName}</TableCell>
                    <TableCell align="center">{sub.teacherName || "-"}</TableCell>
                    <TableCell align="center" sx={{ color: "#64748b" }}>{sub.startDate} ~ {sub.endDate}</TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="outlined" onClick={() => startEdit(sub)} sx={{ mr: 1 }}>수정</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(sub.subSeq)}>삭제</Button>
                    </TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: "#f8fafc" }}>
        <Button onClick={onClose} variant="outlined" color="inherit">닫기</Button>
        {!isAdding && !editingSeq && (
          <Button variant="contained" onClick={() => setIsAdding(true)}>과목 추가</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LmsSubjectListModal;