/* eslint-disable @typescript-eslint/no-explicit-any */
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import LockResetIcon from '@mui/icons-material/LockReset';
import {
  Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, IconButton, MenuItem, TextField, Typography
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

// 1. 상태 옵션 정의
const STATUS_OPTIONS = [
  { value: 'ENROLLED', label: '재학 중' },
  { value: 'DROPOUT', label: '중도 탈락' },
  { value: 'EARLYOUT', label: '수강 철회' },
  { value: 'GRADUATED', label: '수료' },
];

const EditStudentModal = ({ open, onClose, studentData, onUpdate }: EditProps) => {
  const [formData, setFormData] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isPwReset, setIsPwReset] = useState(false);
  // 기존 이미지 삭제 여부 상태 추가
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  useEffect(() => {
    if (open && studentData) {
      // 모달이 열릴 때 상태 초기화
      setFormData({ ...studentData });
      setIsPwReset(false);
      setImageFile(null); 
      setIsImageDeleted(false); // 삭제 상태 초기화
      
      if (studentData.mainImagePath) {
        setPreviewUrl(`http://168.107.51.143:8080/upload/${encodeURIComponent(studentData.mainImagePath)}`);
      } else {
        setPreviewUrl('');
      }
    } else if (!open) {
      setFormData({});
      setPreviewUrl('');
      setImageFile(null);
    }
  }, [open, studentData]);

  // 비밀번호 초기화 핸들러
  const handlePasswordReset = () => {
    if (window.confirm("비밀번호를 '1234'로 초기화하시겠습니까? 저장 버튼을 눌러야 최종 반영됩니다.")) {
      setFormData((prev: any) => ({ ...prev, accountPasswd: '1234' }));
      setIsPwReset(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setIsImageDeleted(false); // 새 파일을 선택하면 삭제 상태 해제
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 첨부된 파일(이미지) 삭제 핸들러 추가
  const handleRemoveImage = () => {
    if (window.confirm("현재 등록된 프로필 사진을 삭제하시겠습니까?")) {
      setImageFile(null);
      setPreviewUrl('');
      setIsImageDeleted(true); // 삭제 모드 활성화
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      if (imageFile) data.append('mainImage', imageFile);

      // updateId 설정 로직 (기존과 동일)
      const userInfoString = localStorage.getItem('userInfo');
      let updateId = '';
      if (userInfoString) {
        try {
          const userInfo = JSON.parse(userInfoString);
          updateId = userInfo.accId || ''; 
        } catch (err) {
          console.error("사용자 정보 파싱 실패:", err);
        }
      }

      const finalData = { ...formData };
      
      // 비밀번호 처리
      if (!isPwReset) {
        delete finalData.accountPasswd;
      }

      // 데이터 정제
      const refinedData = Object.fromEntries(
        Object.entries(finalData).map(([key, value]) => [
          key,
          typeof value === 'string' && value.trim() === '' ? null : value
        ])
      );

      // 수정자 ID 및 기존 이미지 삭제 처리 (중요)
      refinedData.updateId = updateId;
      if (isImageDeleted) {
        refinedData.mainImagePath = null; // 서버에 null을 보내 기존 파일 경로 삭제
      }

      data.append('accountData', new Blob([JSON.stringify(refinedData)], { type: 'application/json' }));

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
      <DialogTitle sx={{ 
        m: 0, p: 2.5, fontWeight: 900, bgcolor: '#f8fafc',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>훈련생 정보 변경</Typography>
        
        {/* 우측 상단 X 버튼 추가 */}
        <IconButton
          aria-label="close"
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
      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={2.5}>
          
          {/* 썸네일 섹션 - 삭제 기능 추가 */}
          <Grid size={12}>
             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, gap: 2 }}>
               <Box sx={{ position: 'relative' }}>
                 <Avatar src={previewUrl} sx={{ width: 130, height: 130, border: '4px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: '#e2e8f0' }}>
                   {formData.accountName?.[0]}
                 </Avatar>
                 
                 {/* 사진 변경(업로드) 버튼 */}
                 <IconButton component="label" sx={{ position: 'absolute', bottom: 4, right: 4, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, width: 38, height: 38, border: '3px solid white', zIndex: 2 }}>
                   <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                   <PhotoCameraIcon sx={{ fontSize: '1.2rem' }} />
                 </IconButton>

                 {/* 사진 삭제 버튼 추가 - 기존 이미지가 있거나 새로 선택한 이미지가 있을 때 표시 */}
                 {(previewUrl) && (
                   <IconButton 
                     onClick={handleRemoveImage}
                     sx={{ 
                       position: 'absolute', 
                       top: 4, 
                       right: 4, 
                       bgcolor: 'error.main', 
                       color: 'white', 
                       '&:hover': { bgcolor: 'error.dark' }, 
                       width: 30, 
                       height: 30, 
                       border: '2px solid white',
                       zIndex: 2
                     }}
                   >
                     <CloseIcon sx={{ fontSize: '1rem' }} />
                   </IconButton>
                 )}
               </Box>
               <Typography variant="caption" sx={{ fontSize: 16, fontWeight: 700, color: 'text.secondary', letterSpacing: -0.5 }}>
                 {studentData?.mainImagePath && !isImageDeleted ? "프로필 사진 변경/삭제" : "프로필 사진 등록"}
               </Typography>
             </Box>
          </Grid>

          {/* 이하 코드 동일 */}
          <Grid size={12} sx={{ mt: -2 }}><Divider /></Grid>
          <Grid size={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                계정 보안 설정
              </Typography>
              
              <Button
                variant={isPwReset ? "contained" : "outlined"}
                color={isPwReset ? "error" : "primary"}
                size="small"
                startIcon={<LockResetIcon />}
                onClick={handlePasswordReset}
                sx={{ fontWeight: 'bold' }}
              >
                {isPwReset ? "비밀번호 초기화 대기중 (1234)" : "비밀번호 '1234'로 초기화"}
              </Button>
            </Box>
          </Grid>

          <Grid size={12}><Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>학적 상태 및 기본 정보</Typography></Grid>
          
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              select
              label="학적 상태"
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { fontWeight: 'bold' } }}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

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
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label="주민등록번호" name="identNumber" value={formData.identNumber || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
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