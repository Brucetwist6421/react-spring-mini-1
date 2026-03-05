/* eslint-disable @typescript-eslint/no-explicit-any */
import AddChartIcon from '@mui/icons-material/AddChart';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography
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
        
        // 에러가 있었다면 입력 즉시 제거
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
        if (!formData.startDate) newErrors.startDate = "시작일을 선택해주세요.";
        if (!formData.endDate) newErrors.endDate = "종료일을 선택해주세요.";
        
        // 날짜 논리 검증
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

      // 숫자가 필요한 필드를 변환한 새로운 객체 생성
      const submitData = {
          ...formData,
          // 값이 있으면 숫자로 변환(Number), 없으면 null 처리
          term: formData.term !== "" ? Number(formData.term) : null,
          manCount: formData.manCount !== "" ? Number(formData.manCount) : null,
      };

      setLoading(true);
      try {
        // formData 대신 submitData를 전송합니다.
        await api.post('/api/curriculum/register', submitData);
        alert("등록 성공!");
        onSuccess();
        onClose();
      } catch (err) {
        console.error("등록 실패:", err);
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
            PaperProps={{ 
                sx: { borderRadius: 4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" } 
            }}
        >
            {/* 헤더 섹션 */}
            <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', alignItems: 'center', bgcolor: '#1e293b', color: 'white' }}>
                <AddChartIcon sx={{ mr: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>신규 교육과정 등록</Typography>
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12, color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4, mt: 2 }}>
                <Grid container spacing={3}>
                    {/* 기본 정보 헤더 */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#64748b', fontWeight: 700 }}>
                             기본 정보
                        </Typography>
                    </Grid>
                    
                    {/* 과정 명: 에러 연결 및 required 추가 */}
                    <Grid size={{ xs: 12 }}>
                        <TextField 
                            name="curName" 
                            label="과정 명" 
                            fullWidth 
                            required
                            value={formData.curName}
                            onChange={handleChange}
                            error={!!errors.curName}
                            helperText={errors.curName}
                        />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <TextField name="term" label="기수" fullWidth value={formData.term} onChange={handleChange} />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <TextField name="room" label="강의실" fullWidth value={formData.room} onChange={handleChange} />
                    </Grid>

                    <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#64748b', fontWeight: 700 }}>
                             일정 및 인원
                        </Typography>
                    </Grid>

                    {/* 시작일: 에러 연결 및 required 추가 */}
                    <Grid size={{ xs: 6 }}>
                        <TextField 
                            name="startDate" 
                            label="시작일" 
                            type="date" 
                            fullWidth 
                            required
                            InputLabelProps={{ shrink: true }} 
                            onChange={handleChange}
                            error={!!errors.startDate}
                            helperText={errors.startDate}
                        />
                    </Grid>

                    {/* 종료일: 에러 연결 및 required 추가 */}
                    <Grid size={{ xs: 6 }}>
                        <TextField 
                            name="endDate" 
                            label="종료일" 
                            type="date" 
                            fullWidth 
                            required
                            InputLabelProps={{ shrink: true }} 
                            onChange={handleChange}
                            error={!!errors.endDate}
                            helperText={errors.endDate}
                        />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <TextField name="manCount" label="정원" fullWidth value={formData.manCount} onChange={handleChange} />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <TextField name="businessName" label="협력 업체" fullWidth value={formData.businessName} onChange={handleChange} />
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
                        bgcolor: '#1e293b', 
                        px: 4, 
                        py: 1,
                        borderRadius: 2.5, 
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#334155' },
                        minWidth: '120px'
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "과정 등록"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CurriculumAddModal;