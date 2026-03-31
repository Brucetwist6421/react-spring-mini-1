import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  IconButton,
  Box,
  InputAdornment
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

interface TestVO {
  testSeq?: number;
  subSeq: number;
  testName: string;
  duration: number;
  startTime: string;
  endTime: string;
}

interface Props {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  subSeq: number;
  subName: string;
}

const LmsTestFormModal = ({ open, onClose, subSeq, subName }: Props) => {
  const [formValues, setFormValues] = useState<TestVO>({
    subSeq: subSeq,
    testName: "",
    duration: 60,
    startTime: "",
    endTime: ""
  });

  const getAccId = (): string => {
    const user = localStorage.getItem('userInfo');
    return user ? JSON.parse(user).accId : 'SYSTEM';
  };

  // 기존 시험 정보 조회 로직
  useEffect(() => {
    if (open && subSeq) {
      api.get(`/api/test/subject/${subSeq}`)
        .then(res => {
          if (res.data) {
            setFormValues({
              ...res.data,
              startTime: res.data.startTime?.substring(0, 16) || "",
              endTime: res.data.endTime?.substring(0, 16) || ""
            });
          } else {
            // 신규 등록 시 기본값 설정
            setFormValues({ 
              subSeq, 
              testName: `${subName} 평가`, 
              duration: 60, 
              startTime: "", 
              endTime: "" 
            });
          }
        })
        .catch(() => {
          setFormValues({ subSeq, testName: `${subName} 평가`, duration: 60, startTime: "", endTime: "" });
        });
    }
  }, [open, subSeq, subName]);

  const handleSave = async () => {
    if (!formValues.testName || !formValues.startTime || !formValues.endTime) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }

    // 간단한 시간 유효성 검사
    if (new Date(formValues.startTime) >= new Date(formValues.endTime)) {
      alert("종료 시간은 시작 시간보다 이후여야 합니다.");
      return;
    }

    try {
      const accId = getAccId();
      if (formValues.testSeq) {
        await api.put("/api/test/update", { ...formValues, updateId: accId });
        alert("시험 정보가 수정되었습니다.");
      } else {
        await api.post("/api/test/register", { ...formValues, regId: accId });
        alert("시험이 등록되었습니다.");
      }
      onClose(true); // 성공 시 부모 리스트 갱신
    } catch (err) {
      console.error(err);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onClose()} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, boxShadow: 24 }
      }}
    >
      {/* 커스텀 헤더 */}
      <DialogTitle sx={{ 
        m: 0, 
        p: 2.5, 
        bgcolor: '#f8fafc', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <EventNoteIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            시험 등록/수정
          </Typography>
        </Stack>
        <IconButton onClick={() => onClose()} size="small" sx={{ color: '#94a3b8' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* 본문 (Padding 최적화로 Label 겹침 해결) */}
      <DialogContent sx={{ pt: 4, pb: 3, px: 3 }}>
        <Stack spacing={4}>
          {/* 과목명 표시 (Read-Only) */}
          <TextField
            label="대상 과목"
            value={subName}
            fullWidth
            disabled
            variant="filled"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="시험 명칭"
            placeholder="예: 제1회 정기평가"
            fullWidth
            value={formValues.testName}
            onChange={(e) => setFormValues({ ...formValues, testName: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="시험 제한 시간"
            type="number"
            fullWidth
            value={formValues.duration}
            onChange={(e) => setFormValues({ ...formValues, duration: Number(e.target.value) })}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTimeIcon fontSize="small" sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">분</InputAdornment>,
            }}
          />

          {/* 시작/종료 일시 2열 배치 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="시험 시작 일시"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formValues.startTime}
              onChange={(e) => setFormValues({ ...formValues, startTime: e.target.value })}
            />
            <TextField
              label="시험 종료 일시"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formValues.endTime}
              onChange={(e) => setFormValues({ ...formValues, endTime: e.target.value })}
            />
          </Box>
        </Stack>
      </DialogContent>

      {/* 푸터 영역 */}
      <DialogActions sx={{ 
        p: 3, 
        bgcolor: '#f8fafc', 
        borderTop: '1px solid #e2e8f0',
        justifyContent: 'center' 
      }}>
        <Button 
          onClick={() => onClose()} 
          variant="outlined" 
          color="inherit"
          sx={{ px: 4, borderRadius: 2, fontWeight: 600 }}
        >
          취소
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          sx={{ px: 5, borderRadius: 2, fontWeight: 'bold', boxShadow: 'none' }}
        >
          설정 저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LmsTestFormModal;