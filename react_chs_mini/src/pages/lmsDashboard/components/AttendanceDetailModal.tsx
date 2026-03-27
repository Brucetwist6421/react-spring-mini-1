import CloseIcon from '@mui/icons-material/Close';
import {
    Avatar, Box, Chip, Dialog, DialogContent, DialogTitle, Divider,
    IconButton, Paper, Typography
} from '@mui/material';
import Grid from '@mui/material/Grid'; 

// 백엔드 AttendanceVO 구조와 일치하도록 인터페이스 수정
interface Student {
  accountSeq: number;
  accountName: string;
  mainFilePath?: string; // VO의 필드명과 일치
  tel?: string;
  status: string;        // VO의 필드명과 일치 ("정상", "지각" 등)
  startTime?: string;    // VO의 TO_CHAR 결과값
}

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  statusLabel: string;
  statusColor: string;
  studentList: Student[];
}

const AttendanceDetailModal = ({ open, onClose, statusLabel, statusColor, studentList }: DetailModalProps) => {
  // 이미지 경로 유효성 검사 및 서버 URL 결합 헬퍼 함수
  const getProfileImage = (path?: string) => {
    if (!path) return '';
    // 만약 path에 이미 http가 포함되어 있다면 그대로 반환, 아니면 서버 주소 결합
    return path.startsWith('http') 
      ? path 
      : `http://168.107.51.143:8080/upload/${encodeURIComponent(path)}`;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth 
      scroll="paper"
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, p: 2.5, bgcolor: '#f8fafc',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b' }}>
            {statusLabel} 명단
          </Typography>
          <Chip 
            label={`${studentList?.length || 0}명`} 
            size="small" 
            sx={{ bgcolor: statusColor, color: 'white', fontWeight: 800 }} 
          />
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
            '&:hover': { color: '#ef4444', bgcolor: '#fee2e2' },
            transition: '0.2s'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />

      <DialogContent sx={{ p: 2, bgcolor: '#f1f5f9', minHeight: '300px' }}>
        {!studentList || studentList.length === 0 ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <Typography sx={{ color: '#94a3b8', fontWeight: 600 }}>
              해당하는 학생이 없습니다.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={1.5}>
            {studentList.map((student) => (
              <Grid size={12} key={student.accountSeq}>
                <Paper sx={{ 
                  p: 1.8, borderRadius: 2, 
                  border: '1px solid #e2e8f0',
                  boxShadow: 'none',
                  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderColor: statusColor + '50' },
                  transition: 'all 0.2s'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        src={getProfileImage(student.mainFilePath)} 
                        sx={{ 
                          width: 48, height: 48, 
                          bgcolor: '#e2e8f0', 
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: '#475569',
                          border: '1px solid #f1f5f9'
                        }}
                      >
                        {student.accountName ? student.accountName[0] : '?'}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem', mb: 0.2 }}>
                          {student.accountName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>
                          {student.tel || '연락처 정보 없음'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* 상태가 '정상'이거나 시간이 기록된 경우만 표시 */}
                    {student.startTime && (
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, mb: 0.3 }}>
                          입실 시간
                        </Typography>
                        <Typography sx={{ fontWeight: 800, color: statusColor, fontSize: '0.95rem', letterSpacing: -0.5 }}>
                          {student.startTime}
                        </Typography>
                      </Box>
                    )}
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