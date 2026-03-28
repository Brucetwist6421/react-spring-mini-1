/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar, Box, Button, Chip, Divider, Paper, Stack, Tab, Tabs, TextField, Tooltip, Typography
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid v6 (Grid2) 사용
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// 아이콘 임포트
import {
  AlternateEmail as AlternateEmailIcon,
  Analytics as AnalyticsIcon, AssignmentInd as AssignmentIndIcon, Badge as BadgeIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  ContactPage as ContactPageIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ErrorOutline as ErrorOutlineIcon,
  EventAvailable as EventAvailableIcon,
  FamilyRestroom as FamilyRestroomIcon,
  Home as HomeIcon, Person as PersonIcon,
  PhoneIphone as PhoneIphoneIcon,
  RunningWithErrors as RunningWithErrorsIcon,
  Save as SaveIcon, School as SchoolIcon
} from '@mui/icons-material';

import RandomSpinner from '../../../components/RandomSpinner';
import AttendanceStatusView from './AttendanceStatusView';
import EditStudentModal from './EditStudentModal';
import StudentDeleteConfirmModal from './StudentDeleteConfirmModal';

const StudentDetailPage = ({ onUpdateSuccess, curSeq, curData }: { onUpdateSuccess: () => void; curSeq: string|undefined; curData: any }) => {
  const { accountSeq } = useParams<{ accountSeq: string }>();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // 모달 상태 관리
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // 데이터 로드 함수
  const fetchDetail = useCallback(() => {
    if (accountSeq) {
      setLoading(true);
      Promise.all([
        axios.get(`/api/account/${accountSeq}`),
        axios.get(`/api/attendance/status/${accountSeq}`)
      ]).then(([accRes, attRes]) => {
        setStudent(accRes.data);
        setAttendance(attRes.data);
        setLoading(false);
      }).catch(err => {
        console.error("데이터 로딩 실패:", err);
        setLoading(false);
      });
    }
  }, [accountSeq]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // 수정 핸들러
  const handleUpdate = () => {
    fetchDetail();
    onUpdateSuccess();
  };

  // 삭제 핸들러
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/account/delete/${accountSeq}`);
      setDeleteModalOpen(false);
      onUpdateSuccess(); // 목록 갱신 요청
      navigate(-1);      // 목록으로 돌아가기
    } catch (err) {
      console.error("삭제 중 오류 발생:", err);
      alert("삭제 처리에 실패했습니다.");
    }
  };

  // 상태 구성 함수들
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ENROLLED': return { label: '재학 중', color: 'success' as const };
      case 'DROPOUT': return { label: '중도 탈락', color: 'error' as const };
      case 'EARLYOUT': return { label: '수강 철회', color: 'warning' as const };
      case 'GRADUATED': return { label: '수료', color: 'primary' as const };
      default: return { label: status || '정보 없음', color: 'default' as const };
    }
  };

  const getAttendanceUX = (rate: number, status: string) => {
    if (status === 'DROPOUT' || status === 'EARLYOUT') {
      return { label: '산정 종료', color: '#64748b', bgColor: '#f8fafc', icon: <RunningWithErrorsIcon />, desc: '학적 변동으로 인해 데이터가 동결되었습니다.' };
    }
    if (rate >= 90) return { label: '우수', color: '#15803d', bgColor: '#f0fdf4', icon: <CheckCircleIcon />, desc: '안정적인 출석률 유지 중' };
    if (rate >= 80) return { label: '보통', color: '#1d4ed8', bgColor: '#eff6ff', icon: <AnalyticsIcon />, desc: '지속적인 관리 필요' };
    return { label: '위험', color: '#dc2626', bgColor: '#fef2f2', icon: <ErrorOutlineIcon />, desc: '수당 지급 제한 가능성 높음' };
  };

  if (loading) return <RandomSpinner />;
  if (!student) return <Typography sx={{ p: 4 }}>학생 정보를 찾을 수 없습니다.</Typography>;

  const attUX = getAttendanceUX(attendance?.attendanceRate || 0, student.status);
  const isInactive = student.status === 'DROPOUT' || student.status === 'EARLYOUT';

  const InfoItem = ({ icon, label, value, color = "text.primary" }: any) => (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2.5 }}>
      {icon && <Box sx={{ color: 'primary.main', mt: 0.3, display: 'flex', alignItems: 'center' }}>{React.cloneElement(icon as any, { sx: { fontSize: '1.4rem' } })}</Box>}
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 700 }}>{label}</Typography>
        <Typography variant="body1" sx={{ fontWeight: 700, color: color, fontSize: '1.05rem', mt: 0.3 }}>{value || '-'}</Typography>
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 4, mt: 1 }}>
      
      {/* 1. 상단 프로필 요약 (Header) */}
      <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 5, bgcolor: '#ffffff' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={4} alignItems="center">
              <Avatar 
                src={student.mainImagePath ? `http://168.107.51.143:8080/upload/${encodeURIComponent(student.mainImagePath)}` : `https://w7.pngwing.com/pngs/884/996/png-transparent-pingu-waiting-cartoons-pingu-thumbnail.png`}
                sx={{ width: 130, height: 130, bgcolor: isInactive ? '#94a3b8' : '#3b82f6', fontSize: '3rem', fontWeight: 800 }}>
                {student.accountName?.[0]}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: '2rem', fontWeight: 900, mb: 1.5 }}>{student.accountName}</Typography>
                <Chip label={getStatusConfig(student.status).label} color={getStatusConfig(student.status).color} sx={{ fontWeight: 800, fontSize: '1rem', px: 1 }} />
              </Box>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }} sx={{ borderLeft: { md: '1px solid #f1f5f9' }, pl: { md: 5 } }}>
            <Typography sx={{ fontSize: '1.1rem', color: 'primary.main', fontWeight: 900, display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}><SchoolIcon /> {student.curName}</Typography>
            <Typography sx={{ fontSize: '1.15rem', mb: 2, fontWeight: 700 }}>{student.businessName} <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>| {student.room}호 ({student.term}기)</Box></Typography>
            <Stack direction="row" spacing={4}>
              <Box><Typography sx={{ fontSize: '0.9rem', color: 'text.secondary', fontWeight: 700 }}>과정 기간</Typography><Typography sx={{ fontSize: '1.1rem', fontWeight: 800 }}>{student.startDate} ~ {student.endDate}</Typography></Box>
              <Box><Typography sx={{ fontSize: '0.9rem', color: 'text.secondary', fontWeight: 700 }}>담임교수</Typography><Typography sx={{ fontSize: '1.1rem', fontWeight: 800 }}>{student.teacherName || '미배정'}</Typography></Box>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Tooltip title={attUX.desc} arrow>
              <Paper elevation={0} sx={{ p: 3, bgcolor: attUX.bgColor, borderRadius: 5, border: '2px solid', borderColor: attUX.color + '33', textAlign: 'center' }}>
                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ color: attUX.color, mb: 1 }}>{attUX.icon}<Typography sx={{ fontSize: '1.1rem', fontWeight: 900 }}>{attUX.label}</Typography></Stack>
                <Typography sx={{ fontWeight: 950, color: attUX.color, fontSize: '2rem' }}><Box component="span" sx={{ fontSize: '1.2rem', mr: 1, color: 'text.secondary' }}>출석률 :</Box>{attendance ? `${attendance.attendanceRate.toFixed(1)}%` : '--%'}</Typography>
              </Paper>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. 상세 정보 영역 */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3.5 }}>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5 }}><PersonIcon sx={{ fontSize: '2rem' }} /> 기본 정보</Typography>
                
                {/* 버튼 그룹 */}
                <Stack direction="row" spacing={1}>
                   <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteModalOpen(true)} sx={{ fontWeight: 700, borderRadius: 2 }}>삭제</Button>
                   <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => setEditModalOpen(true)} sx={{ fontWeight: 700, borderRadius: 2 }}>수정</Button>
                </Stack>
              </Stack>
              <InfoItem icon={<ContactPageIcon />} label="아이디" value={student.accountId} color="primary.main" />
              <InfoItem icon={<AlternateEmailIcon />} label="이메일 주소" value={student.accountEmail} />
              <Divider sx={{ my: 2.5, borderStyle: 'dashed' }} />
              <InfoItem icon={<PersonIcon />} label="성별" value={student.gender === 'M' ? '남성' : '여성'} />
              <InfoItem icon={<BadgeIcon />} label="주민등록번호" value={student.identNumber} />
              <InfoItem icon={<PhoneIphoneIcon />} label="연락처" value={student.tel} />
              <InfoItem icon={<HomeIcon />} label="거주 주소" value={student.address} />
              <InfoItem icon={<FamilyRestroomIcon />} label="혼인 여부" value={student.maritalStatus === 'Y' ? '기혼' : '미혼'} />
            </Paper>

            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 5 }}>
              <Typography sx={{ fontSize: '1.3rem', fontWeight: 900, mb: 3.5, display: 'flex', alignItems: 'center', gap: 1.5 }}><BusinessIcon sx={{ fontSize: '2rem' }} /> 학적 및 이력</Typography>
              <InfoItem label="최종학력" value={student.edu || '-'} />
              <InfoItem label="전공 학과" value={student.major} />
              <InfoItem label="보유 자격증" value={student.licenses} />
            </Paper>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 5, minHeight: 800, overflow: 'hidden' }}>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="fullWidth" sx={{ bgcolor: '#f8fafc', borderBottom: 1, borderColor: 'divider', py: 1 }}>
              <Tab icon={<EventAvailableIcon />} label={<Typography sx={{ fontWeight: 800 }}>출석 현황</Typography>} />
              <Tab icon={<AnalyticsIcon />} label={<Typography sx={{ fontWeight: 800 }}>성적/평가</Typography>} />
              <Tab icon={<AssignmentIndIcon />} label={<Typography sx={{ fontWeight: 800 }}>경력/기록</Typography>} />
              {/* <Tab icon={<ChatIcon />} label={<Typography sx={{ fontWeight: 800 }}>상담 일지</Typography>} /> */}
            </Tabs>
            <Box sx={{ p: 5 }}>
              {tabValue === 0 && <AttendanceStatusView accountSeq={student.accountSeq} curSeq={curSeq} curData={curData} startDate={student?.startDate} endDate={student?.endDate} />}
              {tabValue === 2 && (
                <Box>
                  <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, mb: 3 }}>학습자 관찰 기록</Typography>
                  <TextField fullWidth multiline rows={5} placeholder="특이사항 기록" slotProps={{ input: { sx: { fontSize: '1.1rem', p: 2 } } }} />
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" size="large" startIcon={<SaveIcon />} sx={{ borderRadius: 3, px: 5, py: 1.5, fontWeight: 900 }}>기록 저장</Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 모달 섹션 */}
      <EditStudentModal open={editModalOpen} onClose={() => setEditModalOpen(false)} studentData={student} onUpdate={handleUpdate} />
      
      <StudentDeleteConfirmModal 
        open={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleDeleteConfirm} 
        content={`${student.accountName} 학생의 모든 정보를 삭제하시겠습니까?`}
        subContent="이 작업은 목록에서 해당 학생을 보이지 않게 처리하며, 시스템 관리자가 복구 가능합니다."
      />
    </Box>
  );
};

export default StudentDetailPage;