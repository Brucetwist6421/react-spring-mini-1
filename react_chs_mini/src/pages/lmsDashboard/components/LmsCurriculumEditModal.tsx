/* eslint-disable @typescript-eslint/no-explicit-any */
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosInstance';

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  curData: any; 
  onUpdate: () => void; 
}

const LmsCurriculumEditModal = ({ open, onClose, curData, onUpdate }: EditModalProps) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (open && curData) {
      // 기존 데이터 mapping (날짜 형식이 yyyy-MM-dd여야 input에 표시됨)
      setFormData({ ...curData });
    }
  }, [open, curData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      // localStorage에서 현재 사용자 ID(accId) 추출
      const userInfoString = localStorage.getItem('userInfo');
      let accId = 'system'; // 폴백 값
      
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        accId = userInfo.accId;
      }

      // 서버 전송 데이터 구성
      const updateData = {
        ...formData,
        updateId: accId // 🚩 updateId에 accId 세팅
      };

      await api.put('/api/curriculum/update', updateData);
      
      alert('과정 정보가 성공적으로 변경되었습니다.');
      onUpdate(); 
      onClose();
    } catch (err) {
      console.error('과정 수정 실패:', err);
      alert('과정 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 900, bgcolor: '#f8fafc' }}>
        교육과정 상세 정보 변경
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={2.5}>
          <Grid size={12}>
            <TextField fullWidth label="과정명" name="curName" value={formData.curName || ''} onChange={handleChange} />
          </Grid>
          
          <Grid size={12}>
            <TextField fullWidth label="사업명 (Business Name)" name="businessName" value={formData.businessName || ''} onChange={handleChange} />
          </Grid>

          <Grid size={6}>
            <TextField fullWidth label="강의실" name="room" value={formData.room || ''} onChange={handleChange} />
          </Grid>
          
          <Grid size={6}>
            <TextField fullWidth label="기수" name="term" type="number" value={formData.term || ''} onChange={handleChange} />
          </Grid>

          <Grid size={12}>
            <TextField fullWidth label="인원 수" name="manCount" type="number" value={formData.manCount || ''} onChange={handleChange} />
          </Grid>

          <Grid size={6}>
            <TextField fullWidth label="시작일" name="startDate" type="date" InputLabelProps={{ shrink: true }} value={formData.startDate || ''} onChange={handleChange} />
          </Grid>
          
          <Grid size={6}>
            <TextField fullWidth label="종료일" name="endDate" type="date" InputLabelProps={{ shrink: true }} value={formData.endDate || ''} onChange={handleChange} />
          </Grid>
        </Grid>
        
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
        <Button onClick={onClose} startIcon={<CloseIcon />} color="inherit" sx={{ fontWeight: 'bold' }}>취소</Button>
        <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />} sx={{ fontWeight: 'bold', px: 3 }}>변경사항 저장</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LmsCurriculumEditModal;