/* eslint-disable @typescript-eslint/no-explicit-any */
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'; // 아이콘 추가
import SaveIcon from '@mui/icons-material/Save';
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    MenuItem,
    TextField,
    Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosInstance';

interface EditProps {
  open: boolean;
  onClose: () => void;
  studentData: any;
  onUpdate: () => void;
}

const EditStudentModal = ({ open, onClose, studentData, onUpdate }: EditProps) => {
  const [formData, setFormData] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null); // 신규 이미지 파일 상태
  const [previewUrl, setPreviewUrl] = useState<string>(''); // 썸네일 미리보기 URL

  useEffect(() => {
    if (studentData) {
      setFormData({ ...studentData });
      // 기존 이미지가 있다면 썸네일 경로 설정
      if (studentData.mainImagePath) {
        setPreviewUrl(`http://168.107.51.143:8080/upload/${encodeURIComponent(studentData.mainImagePath)}`);
      } else {
        setPreviewUrl(''); // 이미지 없는 경우 빈값
      }
    }
  }, [studentData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // 이미지 변경 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string); // 미리보기 생성
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
        const data = new FormData();
        
        // 1. 이미지 파일 (키 이름을 백엔드의 mainImage와 맞춤)
        if (imageFile) {
         data.append('mainImage', imageFile); 
        }

        // 2. VO 데이터 (Blob으로 만들어 'accountData'라는 키로 전송)
        data.append('accountData', new Blob([JSON.stringify(formData)], { type: 'application/json' }));

        // 3. PUT 메서드 사용, URL은 /api/account/update/145 형태
        await api.put(`/api/account/update/${formData.accountSeq}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

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
          
          {/* 📸 썸네일 수정 섹션 */}
          <Grid size={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, gap: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar 
                  src={previewUrl} 
                  sx={{ 
                    width: 130, height: 130, 
                    border: '4px solid #f1f5f9', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    bgcolor: '#e2e8f0'
                  }}
                >
                  {formData.accountName?.[0]}
                </Avatar>
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute', bottom: 4, right: 4,
                    bgcolor: 'primary.main', color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                    width: 38, height: 38, border: '3px solid white'
                  }}
                >
                  <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                  <PhotoCameraIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                기본 사진 변경
              </Typography>
            </Box>
          </Grid>

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