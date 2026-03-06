/* eslint-disable @typescript-eslint/no-explicit-any */
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, CircularProgress, Box } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react'; // useCallback 추가
import api from '../../../api/axiosInstance';
import TeacherSelectField from './TeacherSelectField';

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  curData: any; 
  onUpdate: () => void;
}

const LmsCurriculumEditModal = ({ open, onClose, curData, onUpdate }: EditModalProps) => {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDetail = useCallback(async (curSeq: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/curriculum/${curSeq}`);
      if (response.data) {
        setFormData(response.data);
      }
    } catch (err) {
      console.error('상세 정보 조회 실패:', err);
      alert('데이터를 불러오는 중 오류가 발생했습니다.');
      onClose();
    } finally {
      setLoading(false);
    }
  }, [onClose]); // onClose가 변경될 때만 함수 재생성

  useEffect(() => {
    if (open && curData?.curSeq) {
      fetchDetail(curData.curSeq);
    }
  }, [open, curData?.curSeq, fetchDetail]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const userInfoString = localStorage.getItem('userInfo');
      let accId = 'system';
      
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        accId = userInfo.accId;
      }

      const updateData = {
        ...formData,
        updateId: accId 
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
      
      <DialogContent sx={{ p: 3, minHeight: '300px' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            <Grid size={12}>
              <TextField fullWidth label="과정명" name="curName" value={formData.curName || ''} onChange={handleChange} />
            </Grid>

            {/* 담당 교사 선택 컴포넌트 */}
            <Grid size={12}>
              <TeacherSelectField 
                value={formData.accountSeq || null}
                onChange={(seq) => setFormData((prev: any) => ({ ...prev, accountSeq: seq }))}
              />
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
        )}
      </DialogContent>

      <Divider />
      <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
        <Button onClick={onClose} startIcon={<CloseIcon />} color="inherit" sx={{ fontWeight: 'bold' }}>취소</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={loading}
          startIcon={<SaveIcon />} 
          sx={{ fontWeight: 'bold', px: 3 }}
        >
          변경사항 저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LmsCurriculumEditModal;