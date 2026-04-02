import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
  Typography,
  Stack,
  IconButton
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import LmsTestFormModal from './LmsTestFormModal';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

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
  testSeq?: number | null;
  testName?: string;
  duration?: number;
  testStatus?: string;
}

interface AccountVO {
  accountSeq: number;
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
    status: "A"
  });

  // 2. 시험 모달 제어용 state 추가
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<{seq: number, name: string} | null>(null);

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
        await api.put("/api/subject/update", { ...payload, subSeq: editingSeq, updateId: currentAccId });
        alert("수정되었습니다.");
      } else {
        await api.post("/api/subject/register", { ...payload, regId: currentAccId });
        alert("등록되었습니다.");
      }
      fetchSubjects();
      cancelAction();
    } catch (err) {
      console.error(err);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (subSeq: number) => {
    if (!window.confirm("정말로 이 과목을 삭제하시겠습니까?\n삭제 시 해당 과목의 시험 정보도 함께 삭제됩니다.")) return;
    const currentAccId = getUpdateId();
    try {
      await api.patch(`/api/subject/delete/${subSeq}?updateId=${currentAccId}`);
      alert("삭제 처리되었습니다.");
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestClick = (sub: SubjectVO) => {
    setSelectedSub({ seq: sub.subSeq, name: sub.subName });
    setTestModalOpen(true);
  };

  const handleTestModalClose = (refresh?: boolean) => {
    setTestModalOpen(false);
    setSelectedSub(null);
    if (refresh) fetchSubjects(); // 시험 등록 후 목록(시험정보 유무) 갱신
  };

  // 시험 정보 삭제(Soft Delete) 함수
  const handleDeleteTest = async (testSeq: number, subName: string) => {
    if (!window.confirm(`[${subName}]의 시험 설정을 삭제하시겠습니까?\n삭제된 시험 정보는 복구할 수 없습니다.`)) return;
    
    const currentAccId = getUpdateId();
    try {
      // 이전에 가이드드린 PATCH /api/test/delete/{testSeq} API 호출
      await api.patch(`/api/test/delete/${testSeq}?updateId=${currentAccId}`);
      alert("시험 정보가 삭제되었습니다.");
      fetchSubjects(); // 목록 새로고침 (시험정보 컬럼 갱신)
    } catch (err) {
      console.error(err);
      alert("시험 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xl" // 전체 사이즈 확대
      fullWidth
    >
      <DialogTitle sx={{ 
        fontWeight: "bold", 
        fontSize: '1.5rem', 
        bgcolor: "#f8fafc", 
        borderBottom: '1px solid #e2e8f0',
        p: 3
      }}>
        [{curName}] 과목 및 시험 관리
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Table stickyHeader sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: '1.1rem', bgcolor: "#f1f5f9", width: '22%' }}>과목명</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: '1.1rem', bgcolor: "#f1f5f9", width: '13%' }} align="center">담당 교수</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: '1.1rem', bgcolor: "#f1f5f9", width: '22%' }} align="center">학습 기간</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: '1.1rem', bgcolor: "#f1f5f9", width: '15%' }} align="center">시험 명</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: '1.1rem', bgcolor: "#f1f5f9", width: '13%' }} align="center">시험 관리</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: '1.1rem', bgcolor: "#f1f5f9", width: '15%' }} align="center">과목 관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              
              {/* 과목 추가 행 */}
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
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <TextField type="date" size="small" value={formValues.startDate} onChange={(e) => setFormValues({...formValues, startDate: e.target.value})} />
                      <TextField type="date" size="small" value={formValues.endDate} onChange={(e) => setFormValues({...formValues, endDate: e.target.value})} />
                    </Stack>
                  </TableCell>
                  <TableCell align="center">-</TableCell>
                  <TableCell align="center">-</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button variant="contained" size="small" onClick={handleSave}>저장</Button>
                      <Button variant="outlined" size="small" color="inherit" onClick={cancelAction}>취소</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}

              {subjects.map((sub) => (
                editingSeq === sub.subSeq ? (
                  /* 수정 모드 행 */
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
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <TextField type="date" size="small" value={formValues.startDate} onChange={(e) => setFormValues({...formValues, startDate: e.target.value})} />
                        <TextField type="date" size="small" value={formValues.endDate} onChange={(e) => setFormValues({...formValues, endDate: e.target.value})} />
                      </Stack>
                    </TableCell>
                    <TableCell align="center">-</TableCell>
                    <TableCell align="center">-</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button variant="contained" color="success" size="small" onClick={handleSave}>완료</Button>
                        <Button variant="outlined" size="small" color="inherit" onClick={cancelAction}>취소</Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  /* 조회 모드 행 */
                  <TableRow key={sub.subSeq} hover>
                    <TableCell sx={{ fontWeight: 600, fontSize: '1.05rem' }}>{sub.subName}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '1rem' }}>{sub.teacherName || "-"}</TableCell>
                    <TableCell align="center" sx={{ color: "#475569", fontSize: '1rem' }}>
                      {sub.startDate} ~ {sub.endDate}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ 
                        color: sub.testSeq ? 'primary.main' : 'text.disabled', 
                        fontWeight: sub.testSeq ? 'bold' : 'normal',
                        fontSize: '0.95rem'
                      }}>
                        {sub.testName || "미등록"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                        {sub.testSeq ? (
                          <>
                            <Button 
                              variant="contained" 
                              size="small" 
                              color="primary" 
                              startIcon={<EditIcon />} 
                              onClick={() => handleTestClick(sub)}
                            >
                              수정
                            </Button>
                            <Button 
                              variant="contained" 
                              size="small" 
                              color="error" 
                              startIcon={<DeleteIcon />} 
                              onClick={() => handleDeleteTest(sub.testSeq!, sub.subName)}
                            >
                              삭제
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="outlined" 
                            size="small"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => handleTestClick(sub)}
                            sx={{ color: '#64748b', borderColor: '#cbd5e1', minWidth: '100px' }}
                          >
                            시험등록
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button 
                          variant="contained" 
                          size="small" 
                          color="primary" 
                          startIcon={<EditIcon />} 
                          onClick={() => startEdit(sub)}
                        >
                          수정
                        </Button>
                        <Button 
                          variant="contained" 
                          size="small" 
                          color="error" 
                          startIcon={<DeleteIcon />} 
                          onClick={() => handleDelete(sub.subSeq)}
                        >
                          삭제
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: "#f8fafc", borderTop: '1px solid #e2e8f0' }}>
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ px: 4 }}>닫기</Button>
        {!isAdding && !editingSeq && (
          <Button variant="contained" size="large" onClick={() => setIsAdding(true)} sx={{ px: 4 }}>
            과목 추가
          </Button>
        )}
      </DialogActions>

      {/* 시험 관리 모달 */}
      {selectedSub && (
        <LmsTestFormModal
          open={testModalOpen}
          onClose={handleTestModalClose}
          subSeq={selectedSub.seq}
          subName={selectedSub.name}
        />
      )}
    </Dialog>

    
  );
};

export default LmsSubjectListModal;