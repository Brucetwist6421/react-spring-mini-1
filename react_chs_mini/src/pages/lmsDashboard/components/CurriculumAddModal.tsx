import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment'; // AddChartIcon 대체
import {
  Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, Grid, IconButton, TextField, Typography, InputAdornment
} from '@mui/material';
import React, { useState } from 'react';
import api from "../../../api/axiosInstance";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CurriculumAddModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    curName: '',
    term: '',
    room: '',
    manCount: '',
    startDate: '',
    endDate: '',
    businessName: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.curName.trim()) newErrors.curName = "과정 명을 입력해주세요.";
    if (!formData.businessName.trim()) newErrors.businessName = "사업 명을 입력해주세요.";
    if (!formData.startDate) newErrors.startDate = "시작일을 선택해주세요.";
    if (!formData.endDate) newErrors.endDate = "종료일을 선택해주세요.";
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = "종료일은 시작일 이후여야 합니다.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const submitData = {
      ...formData,
      term: formData.term !== "" ? Number(formData.term) : null,
      manCount: formData.manCount !== "" ? Number(formData.manCount) : null,
    };

    setLoading(true);
    try {
      await api.post('/api/curriculum/register', submitData);
      alert("신규 교육과정이 성공적으로 등록되었습니다.");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("등록 실패:", err);
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth 
      scroll="paper"
      // 1. PaperProps 대체: slotProps.paper 사용
      slotProps={{
        paper: {
          sx: { borderRadius: 4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', alignItems: 'center', bgcolor: '#1e293b', color: 'white' }}>
        <AssignmentIcon sx={{ mr: 1.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>신규 교육과정 등록</Typography>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12, color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, mt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ fontSize: 18, mr: 0.5 }} /> 과정 및 사업 정보
            </Typography>
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <TextField 
              name="curName" label="과정 명" fullWidth required
              value={formData.curName} onChange={handleChange}
              error={!!errors.curName} helperText={errors.curName}
              placeholder="예: 자바 기반 웹 개발자 양성 과정"
              // 2. InputProps 대체: slotProps.input 사용
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><SchoolIcon fontSize="small" /></InputAdornment>
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField 
              name="businessName" label="사업 명" fullWidth required
              value={formData.businessName} onChange={handleChange}
              error={!!errors.businessName} helperText={errors.businessName}
              placeholder="예: 내일배움카드 K-Digital Training"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><BusinessIcon fontSize="small" /></InputAdornment>
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField 
              name="term" label="기수" fullWidth 
              value={formData.term} onChange={handleChange}
              placeholder="숫자 입력"
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">기</InputAdornment>
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField 
              name="room" label="강의실" fullWidth 
              value={formData.room} onChange={handleChange}
              placeholder="예: 301호"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><MeetingRoomIcon fontSize="small" /></InputAdornment>
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <CalendarMonthIcon sx={{ fontSize: 18, mr: 0.5 }} /> 일정 및 인원 관리
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField 
              name="startDate" label="시작일" type="date" fullWidth required
              onChange={handleChange}
              error={!!errors.startDate} helperText={errors.startDate}
              // 3. InputLabelProps 대체: slotProps.inputLabel 사용
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField 
              name="endDate" label="종료일" type="date" fullWidth required
              onChange={handleChange}
              error={!!errors.endDate} helperText={errors.endDate}
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField 
              name="manCount" label="인원 수" fullWidth 
              value={formData.manCount} onChange={handleChange}
              placeholder="최대 수용 인원 입력"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><GroupsIcon fontSize="small" /></InputAdornment>,
                  endAdornment: <InputAdornment position="end">명</InputAdornment>
                }
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, px: 4, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <Button onClick={onClose} sx={{ color: '#64748b', fontWeight: 600 }}>취소하기</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          sx={{ 
            bgcolor: '#1e293b', px: 4, py: 1, borderRadius: 2.5, fontWeight: 700,
            '&:hover': { bgcolor: '#334155' }, minWidth: '120px'
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "과정 등록하기"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CurriculumAddModal;