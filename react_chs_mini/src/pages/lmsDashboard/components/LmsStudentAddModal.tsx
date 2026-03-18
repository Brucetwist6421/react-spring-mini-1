/* eslint-disable @typescript-eslint/no-explicit-any */
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import {
    Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider, IconButton, MenuItem, TextField, Typography
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid2 사용 권장 사양 반영
import React, { useRef, useState } from 'react';
import api from '../../../api/axiosInstance';

interface AddProps {
    open: boolean;
    onClose: () => void;
    curSeq: number;
    curName: string;
    curClass: string;
    term: number;
    onSuccess: () => void;
}

const LmsStudentAddModal = ({ open, onClose, curSeq, curName, curClass, term, onSuccess }: AddProps) => {
    const initialForm = {
        curSeq: curSeq,
        accountId: '',
        accountPasswd: '',
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
        status: 'ENROLLED'
    };

    const [formData, setFormData] = useState<any>(initialForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    // 필수 항목 Ref
    const inputRefs: any = {
        accountId: useRef<HTMLInputElement>(null),
        accountPasswd: useRef<HTMLInputElement>(null),
        accountName: useRef<HTMLInputElement>(null),
        tel: useRef<HTMLInputElement>(null),
        address: useRef<HTMLInputElement>(null),
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    // 이미지 파일 선택 핸들러
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // 이미지 삭제 핸들러 (추가된 기능)
    const handleRemoveImage = () => {
        setImageFile(null);
        setPreviewUrl('');
    };

    const handleSave = async () => {
        // 1. 필수 항목 유효성 검사 (기존 로직 동일)
        const requiredFields = [
            { key: 'accountId', label: '접속 아이디', ref: inputRefs.accountId },
            { key: 'accountPasswd', label: '접속 비밀번호', ref: inputRefs.accountPasswd },
            { key: 'accountName', label: '이름', ref: inputRefs.accountName },
            { key: 'tel', label: '연락처', ref: inputRefs.tel },
            { key: 'address', label: '거주 주소', ref: inputRefs.address },
        ];

        for (const field of requiredFields) {
            if (!formData[field.key] || formData[field.key].trim() === '') {
                alert(`${field.label} 항목을 입력해주세요.`);
                field.ref.current?.focus();
                return;
            }
        }

        try {
            // 2. localStorage에서 로그인한 사용자의 accId 가져오기
            const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
            const loginAccId = userInfo.accId; // localStorage의 accId 추출

            // 3. 전송할 데이터 조립 (기존 formData + regId 추가)
            const sendData = {
                ...formData,
                regId: loginAccId // 서버의 reg_id 컬럼과 매핑될 값
            };

            const data = new FormData();
            if (imageFile) data.append('mainImage', imageFile);
            
            // formData 대신 regId가 포함된 sendData를 전송
            data.append('accountData', new Blob([JSON.stringify(sendData)], { type: 'application/json' }));

            await api.post('/api/account/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('신규 훈련생이 성공적으로 등록되었습니다.');
            onSuccess();
            setFormData(initialForm);
            setPreviewUrl('');
            setImageFile(null);
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
                    
                    {/* 프로필 사진 섹션 */}
                    <Grid size={12}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, gap: 2 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar src={previewUrl} sx={{ width: 130, height: 130, border: '4px solid #f1f5f9', bgcolor: '#e2e8f0' }}>
                                    {!previewUrl && <PhotoCameraIcon sx={{ fontSize: '3rem', color: '#94a3b8' }} />}
                                </Avatar>
                                
                                {/* 이미지 업로드 버튼 */}
                                <IconButton component="label" sx={{ position: 'absolute', bottom: 4, right: 4, bgcolor: 'success.main', color: 'white', '&:hover': { bgcolor: 'success.dark' }, width: 38, height: 38, border: '3px solid white' }}>
                                    <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                                    <PhotoCameraIcon sx={{ fontSize: '1.2rem' }} />
                                </IconButton>

                                {/* 이미지 삭제 버튼 (추가) */}
                                {previewUrl && (
                                    <IconButton 
                                        onClick={handleRemoveImage}
                                        sx={{ position: 'absolute', top: -4, right: -4, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' }, width: 30, height: 30, border: '2px solid white', boxShadow: 2 }}
                                    >
                                        <CloseIcon sx={{ fontSize: '1rem' }} />
                                    </IconButton>
                                )}
                            </Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                {previewUrl ? '사진 변경 또는 삭제' : '프로필 사진 등록'}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* 이하 계정 및 신상 정보 입력 폼 레이아웃 유지 */}
                    <Grid size={12}><Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>계정 정보 (필수)</Typography></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="접속 아이디" name="accountId" value={formData.accountId} onChange={handleChange} required inputRef={inputRefs.accountId} 
                            slotProps={{ htmlInput: { autoComplete: 'off' } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="접속 비밀번호" name="accountPasswd" type="password" value={formData.accountPasswd} onChange={handleChange} required inputRef={inputRefs.accountPasswd} 
                            slotProps={{ htmlInput: { autoComplete: 'new-password' } }}
                        />
                    </Grid>

                    <Grid size={12} sx={{ mt: 1 }}><Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>기본 신상 정보</Typography></Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField fullWidth label="이름" name="accountName" value={formData.accountName} onChange={handleChange} required inputRef={inputRefs.accountName} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField fullWidth select label="성별" name="gender" value={formData.gender} onChange={handleChange} required>
                            <MenuItem value="M">남성</MenuItem>
                            <MenuItem value="F">여성</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField fullWidth label="생년월일" name="birth" type="date" slotProps={{ inputLabel: { shrink: true } }} value={formData.birth} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="주민등록번호" name="identNumber" value={formData.identNumber} onChange={handleChange} placeholder="000000-0000000" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="연락처" name="tel" value={formData.tel} onChange={handleChange} required inputRef={inputRefs.tel} placeholder="010-0000-0000" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="비상연락처" name="emergencyTel" value={formData.emergencyTel} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="이메일" name="accountEmail" value={formData.accountEmail} onChange={handleChange} />
                    </Grid>
                    <Grid size={12}>
                        <TextField fullWidth label="거주 주소" name="address" value={formData.address} onChange={handleChange} required inputRef={inputRefs.address} />
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
                        <TextField fullWidth label="퇴사 일자" name="quitDate" type="date" slotProps={{ inputLabel: { shrink: true } }} value={formData.quitDate} onChange={handleChange} />
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