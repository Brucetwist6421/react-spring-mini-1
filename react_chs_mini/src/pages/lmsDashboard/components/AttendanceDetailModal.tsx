import CloseIcon from '@mui/icons-material/Close';
import {
    Avatar, Box, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Divider,
    IconButton, Paper, Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import api from "../../../api/axiosInstance";

interface Student {
  accountSeq: number;
  accountName: string;
  mainFilePath?: string;
  tel?: string;
  status: string;
  startTime?: string;
}

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  statusLabel: string;
  statusColor: string;
  date: string; 
  type: string; 
}

const AttendanceDetailModal = ({ open, onClose, statusLabel, statusColor, date, type }: DetailModalProps) => {
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetailList = async () => {
      if (!open || !type) return;
      
      setLoading(true);
      try {
        const res = await api.get("/api/attendance/attendance-today/list", {
          params: { date }
        });
        
        // 데이터 구조 확인: res.data 가 바로 객체이고 그 안에 absentList 등이 있음
        const listName = `${type}List`; // 예: "absentList"
        console.log("선택된 리스트 명:", listName);
        console.log("서버 응답 데이터:", res.data);

        setStudentList(res.data[listName] || []);
      } catch (err) {
        console.error("상세 명단 로딩 실패:", err);
        setStudentList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailList();
  }, [open, date, type]);

  const getProfileImage = (path?: string) => {
    if (!path) return '';
    // DB 응답값에 이미 파일명이 있으므로 경로 결합
    return path.startsWith('http') ? path : `http://168.107.51.143:8080/upload/${encodeURIComponent(path)}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ m: 0, p: 2.5, bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b' }}>{statusLabel} 명단</Typography>
          {!loading && (
            <Chip label={`${studentList.length}명`} size="small" sx={{ bgcolor: statusColor, color: 'white', fontWeight: 800 }} />
          )}
        </Box>
        <IconButton onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500], '&:hover': { color: '#ef4444', bgcolor: '#fee2e2' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2, bgcolor: '#f1f5f9', minHeight: '300px' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
            <CircularProgress size={40} sx={{ color: statusColor }} />
          </Box>
        ) : studentList.length === 0 ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <Typography sx={{ color: '#94a3b8', fontWeight: 600 }}>해당하는 학생이 없습니다.</Typography>
          </Box>
        ) : (
          /* Grid2(MUI v6) 사양 준수 */
          <Grid container spacing={1.5}>
            {studentList.map((student) => (
              <Grid size={12} key={student.accountSeq}>
                <Paper sx={{ p: 1.8, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderColor: statusColor + '50' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        src={getProfileImage(student.mainFilePath)} 
                        sx={{ width: 48, height: 48, bgcolor: '#e2e8f0', fontWeight: 700 }}
                      >
                        {student.accountName ? student.accountName[0] : '?'}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>
                          {student.accountName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                          {student.tel || '연락처 없음'}
                        </Typography>
                      </Box>
                    </Box>
                    {/* 결석일 경우 startTime이 null일 수 있으므로 조건부 렌더링 확인 */}
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>상태</Typography>
                        <Typography sx={{ fontWeight: 800, color: statusColor, fontSize: '0.95rem' }}>
                          {student.status}
                        </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDetailModal;