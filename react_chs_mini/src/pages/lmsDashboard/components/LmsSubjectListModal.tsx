import EditIcon from "@mui/icons-material/Edit"; // 수정 아이콘 추가 시 필요
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
  TextField
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
  
  // 상태 관리: 등록(isAdding), 수정(editingSeq)
  const [isAdding, setIsAdding] = useState(false);
  const [editingSeq, setEditingSeq] = useState<number | null>(null);
  
  // 입력 폼 상태 (등록/수정 공용)
  const [formValues, setFormValues] = useState({
    subName: "",
    startDate: "",
    endDate: "",
    accountSeq: "" as string | number,
    status: "운영중"
  });

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

  // 취소 처리 (입력폼 초기화)
  const cancelAction = () => {
    setIsAdding(false);
    setEditingSeq(null);
    setFormValues({ subName: "", startDate: "", endDate: "", accountSeq: "", status: "운영중" });
  };

  // 수정 모드 진입
  const startEdit = (sub: SubjectVO) => {
    setIsAdding(false);
    setEditingSeq(sub.subSeq);
    setFormValues({
      subName: sub.subName,
      startDate: sub.startDate,
      endDate: sub.endDate,
      accountSeq: sub.accountSeq || "",
      status: sub.status || "운영중"
    });
  };

  // 등록 및 수정 실행
  const handleSave = async () => {
    if (!formValues.subName || !formValues.startDate || !formValues.endDate) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const payload = {
      ...formValues,
      curSeq: curSeq,
      accountSeq: formValues.accountSeq === "" ? null : Number(formValues.accountSeq)
    };

    try {
      if (editingSeq) {
        // 수정 API 호출 (PUT)
        await api.put("/api/subject/update", { ...payload, subSeq: editingSeq, updateId: "ADMIN" });
        alert("과목 정보가 수정되었습니다.");
      } else {
        // 등록 API 호출 (POST)
        await api.post("/api/subject/register", { ...payload, regId: "ADMIN" });
        alert("새 과목이 등록되었습니다.");
      }
      fetchSubjects();
      cancelAction();
    } catch (err) {
      console.error(err);
      alert("처리 중 오류가 발생했습니다.");
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
              {/* 등록 행 */}
              {isAdding && (
                <TableRow sx={{ bgcolor: "#f0f9ff" }}>
                  <TableCell><TextField size="small" fullWidth value={formValues.subName} onChange={(e) => setFormValues({...formValues, subName: e.target.value})} /></TableCell>
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
                      ~
                      <TextField type="date" size="small" value={formValues.endDate} onChange={(e) => setFormValues({...formValues, endDate: e.target.value})} />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Button variant="contained" size="small" onClick={handleSave} sx={{ mr: 1 }}>저장</Button>
                    <Button variant="outlined" size="small" onClick={cancelAction}>취 cotton</Button>
                  </TableCell>
                </TableRow>
              )}

              {subjects.map((sub) => (
                editingSeq === sub.subSeq ? (
                  /* 수정 행 */
                  <TableRow key={sub.subSeq} sx={{ bgcolor: "#fffbeb" }}>
                    <TableCell><TextField size="small" fullWidth value={formValues.subName} onChange={(e) => setFormValues({...formValues, subName: e.target.value})} /></TableCell>
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
                  /* 일반 조회 행 */
                  <TableRow key={sub.subSeq} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{sub.subName}</TableCell>
                    <TableCell align="center">{sub.teacherName || "-"}</TableCell>
                    <TableCell align="center" sx={{ color: "#64748b" }}>{sub.startDate} ~ {sub.endDate}</TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="text" startIcon={<EditIcon />} onClick={() => startEdit(sub)}>수정</Button>
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