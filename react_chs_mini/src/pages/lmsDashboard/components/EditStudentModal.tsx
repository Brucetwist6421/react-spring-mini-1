/* eslint-disable @typescript-eslint/no-explicit-any */
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    MenuItem,
    TextField,
    Typography
} from '@mui/material';
import Grid from '@mui/material/Grid'; // 또는 @mui/material/Grid2
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface EditProps {
  open: boolean;
  onClose: () => void;
  studentData: any;
  onUpdate: () => void;
}

const EditStudentModal = ({ open, onClose, studentData, onUpdate }: EditProps) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (studentData) setFormData({ ...studentData });
  }, [studentData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // API 경로와 메서드는 실제 백엔드 명세에 맞춰 조정하세요.
      await axios.put(`/api/account/${formData.accountSeq}`, formData);
      alert('정보가 성공적으로 수정되었습니다.');
      onUpdate();
      onClose();
    } catch (err) {
      console.error('수정 실패:', err);
      alert('정보 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 900, bgcolor: '#f8fafc' }}>훈련생 정보 변경</DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={2.5}>
          <Grid size={12}><Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>기본 신상 정보</Typography></Grid>
          
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label="이름" name="accountName" value={formData.accountName || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth select label="성별" name="gender" value={formData.gender || ''} onChange={handleChange}>
              <MenuItem value="M">남성</MenuItem>
              <MenuItem value="F">여성</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label="생년월일" name="birth" type="date" InputLabelProps={{ shrink: true }} value={formData.birth || ''} onChange={handleChange} />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="주민등록번호" name="identNumber" value={formData.identNumber || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="연락처" name="tel" value={formData.tel || ''} onChange={handleChange} />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="비상연락처" name="emergencyTel" value={formData.emergencyTel || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="이메일" name="accountEmail" value={formData.accountEmail || ''} onChange={handleChange} />
          </Grid>
          
          <Grid size={12}>
            <TextField fullWidth label="거주 주소" name="address" value={formData.address || ''} onChange={handleChange} />
          </Grid>

          <Grid size={12} sx={{ mt: 2 }}><Divider /></Grid>
          <Grid size={12}><Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>학력 및 병역</Typography></Grid>
          
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label="최종학력" name="edu" value={formData.edu || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label="전공" name="major" value={formData.major || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth select label="졸업구분" name="gradType" value={formData.gradType || ''} onChange={handleChange}>
              <MenuItem value="GRADUATED">졸업</MenuItem>
              <MenuItem value="ATTENDING">재학중</MenuItem>
              <MenuItem value="DROPOUT">중퇴</MenuItem>
              <MenuItem value="REST">휴학</MenuItem>
            </TextField>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="병역 여부" name="militaryStatus" value={formData.militaryStatus || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth select label="혼인 여부" name="maritalStatus" value={formData.maritalStatus || ''} onChange={handleChange}>
              <MenuItem value="N">미혼</MenuItem>
              <MenuItem value="Y">기혼</MenuItem>
            </TextField>
          </Grid>

          <Grid size={12} sx={{ mt: 2 }}><Divider /></Grid>
          <Grid size={12}><Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>이력 및 기타</Typography></Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="이전 직장" name="prevCompany" value={formData.prevCompany || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="퇴사 일자" name="quitDate" type="date" InputLabelProps={{ shrink: true }} value={formData.quitDate || ''} onChange={handleChange} />
          </Grid>
          
          <Grid size={12}>
            <TextField fullWidth multiline rows={2} label="보유 자격증" name="licenses" value={formData.licenses || ''} onChange={handleChange} />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth multiline rows={3} label="경력 기술" name="career" value={formData.career || ''} onChange={handleChange} />
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc' }}>
        <Button onClick={onClose} startIcon={<CloseIcon />} color="inherit" sx={{ fontWeight: 700 }}>취소</Button>
        <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />} sx={{ fontWeight: 700, px: 4 }}>저장하기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStudentModal;