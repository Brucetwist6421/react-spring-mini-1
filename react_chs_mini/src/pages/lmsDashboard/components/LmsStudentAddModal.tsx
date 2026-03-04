/* eslint-disable @typescript-eslint/no-explicit-any */
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
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
import React, { useState } from 'react';
import api from '../../../api/axiosInstance';

interface AddProps {
    open: boolean;
    onClose: () => void;
    curSeq: number;    // 어떤 과정에 등록할지 식별자
    curName: string;   // 과정명 (제목 표시용)
    curClass: string;  // 반 정보 (선택적, 필요 시)
    term: number;      // 학기 정보 (선택적, 필요 시)
    onSuccess: () => void;
}

const LmsStudentAddModal = ({ open, onClose, curSeq, curName, curClass, term, onSuccess }: AddProps) => {
    // 초기값 설정
    const initialForm = {
        curSeq: curSeq,
        accountName: '',
        gender: 'M',
        birth: '',
        identNumber: '',
        tel: '',
        emergencyTel: '',
        accountEmail: '',
        address: '',
        edu: '',
        major: '',
        gradType: 'GRADUATED',
        militaryStatus: '',
        maritalStatus: 'N',
        prevCompany: '',
        quitDate: '',
        licenses: '',
        career: '',
        status: 'ENROLLED' // 신규 등록 시 기본값: 재학 중
    };

    const [formData, setFormData] = useState<any>(initialForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        // 필수값 체크 (예: 이름)
        if (!formData.accountName) {
            alert('이름은 필수 입력 항목입니다.');
            return;
        }

        try {
            const data = new FormData();
            
            // 1. 이미지 파일
            if (imageFile) {
                data.append('mainImage', imageFile); 
            }

            // 2. 계정 데이터 (JSON)
            data.append('accountData', new Blob([JSON.stringify(formData)], { type: 'application/json' }));

            // 3. POST 요청 (엔드포인트는 백엔드 설계에 맞게 수정 가능)
            await api.post('/api/account/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('신규 훈련생이 성공적으로 등록되었습니다.');
            onSuccess();
            setFormData(initialForm); // 폼 초기화
            setPreviewUrl('');
            onClose();
        } catch (err) {
            console.error('등록 실패:', err);
            alert('등록 중 오류가 발생했습니다.');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 900, bgcolor: '#f8fafc' }}>
                신규 훈련생 등록 [{curName}-{curClass}호 ({term}기)]
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 4 }}>
                <Grid container spacing={2.5}>
                    
                    {/* 프로필 사진 등록 섹션 */}
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
                                    {!previewUrl && <PhotoCameraIcon sx={{ fontSize: '3rem', color: '#94a3b8' }} />}
                                </Avatar>
                                <IconButton
                                    component="label"
                                    sx={{
                                        position: 'absolute', bottom: 4, right: 4,
                                        bgcolor: 'success.main', color: 'white',
                                        '&:hover': { bgcolor: 'success.dark' },
                                        width: 38, height: 38, border: '3px solid white'
                                    }}
                                >
                                    <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                                    <PhotoCameraIcon sx={{ fontSize: '1.2rem' }} />
                                </IconButton>
                            </Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                프로필 사진 등록
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid size={12}><Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>기본 신상 정보</Typography></Grid>
                    
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField fullWidth label="이름" name="accountName" value={formData.accountName} onChange={handleChange} required />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField fullWidth select label="성별" name="gender" value={formData.gender} onChange={handleChange}>
                            <MenuItem value="M">남성</MenuItem>
                            <MenuItem value="F">여성</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField fullWidth label="생년월일" name="birth" type="date" InputLabelProps={{ shrink: true }} value={formData.birth} onChange={handleChange} />
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="주민등록번호" name="identNumber" value={formData.identNumber} onChange={handleChange} placeholder="000000-0000000" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="연락처" name="tel" value={formData.tel} onChange={handleChange} placeholder="010-0000-0000" />
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="비상연락처" name="emergencyTel" value={formData.emergencyTel} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="이메일" name="accountEmail" value={formData.accountEmail} onChange={handleChange} />
                    </Grid>
                    
                    <Grid size={12}>
                        <TextField fullWidth label="거주 주소" name="address" value={formData.address} onChange={handleChange} />
                    </Grid>

                    <Grid size={12} sx={{ mt: 2 }}><Divider /></Grid>
                    <Grid size={12}><Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>학력 및 병역</Typography></Grid>
                    
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField fullWidth label="최종학력" name="edu" value={formData.edu} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField fullWidth label="전공" name="major" value={formData.major} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField fullWidth select label="졸업구분" name="gradType" value={formData.gradType} onChange={handleChange}>
                            <MenuItem value="GRADUATED">졸업</MenuItem>
                            <MenuItem value="ATTENDING">재학중</MenuItem>
                            <MenuItem value="DROPOUT">중퇴</MenuItem>
                            <MenuItem value="REST">휴학</MenuItem>
                        </TextField>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="병역 여부" name="militaryStatus" value={formData.militaryStatus} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth select label="혼인 여부" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                            <MenuItem value="N">미혼</MenuItem>
                            <MenuItem value="Y">기혼</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={12} sx={{ mt: 2 }}><Divider /></Grid>
                    <Grid size={12}><Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>이력 및 기타</Typography></Grid>
                    
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="이전 직장" name="prevCompany" value={formData.prevCompany} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="퇴사 일자" name="quitDate" type="date" InputLabelProps={{ shrink: true }} value={formData.quitDate} onChange={handleChange} />
                    </Grid>
                    
                    <Grid size={12}>
                        <TextField fullWidth multiline rows={2} label="보유 자격증" name="licenses" value={formData.licenses} onChange={handleChange} />
                    </Grid>
                    <Grid size={12}>
                        <TextField fullWidth multiline rows={3} label="경력 기술" name="career" value={formData.career} onChange={handleChange} />
                    </Grid>
                </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc' }}>
                <Button onClick={onClose} startIcon={<CloseIcon />} color="inherit" sx={{ fontWeight: 700 }}>취소</Button>
                <Button onClick={handleSave} variant="contained" color="success" startIcon={<SaveIcon />} sx={{ fontWeight: 700, px: 4 }}>등록하기</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LmsStudentAddModal;