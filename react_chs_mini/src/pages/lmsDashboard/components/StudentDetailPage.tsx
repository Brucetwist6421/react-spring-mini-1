/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar, Box, Button,
  Chip, Divider,
  Paper, Stack, Tab, Tabs, TextField, Tooltip, Typography
} from '@mui/material';
import Grid from '@mui/material/Grid'; 
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// 아이콘 임포트
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import CakeIcon from '@mui/icons-material/Cake';
import ChatIcon from '@mui/icons-material/Chat';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import SaveIcon from '@mui/icons-material/Save';
import SchoolIcon from '@mui/icons-material/School';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'; 
import EditIcon from '@mui/icons-material/Edit';

import RandomSpinner from '../../../components/RandomSpinner';
import AttendanceStatusView from './AttendanceStatusView';
import React from 'react';
import EditStudentModal from './EditStudentModal';

const StudentDetailPage = ({ onUpdateSuccess }: { onUpdateSuccess: () => void }) => {
  const { accountSeq } = useParams<{ accountSeq: string }>();
  const [student, setStudent] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ENROLLED': return { label: '재학 중', color: 'success' as const };
      case 'DROPOUT': return { label: '중도 탈락', color: 'error' as const };
      case 'EARLYOUT': return { label: '수강 철회', color: 'warning' as const };
      case 'GRADUATED': return { label: '수료', color: 'primary' as const };
      default: return { label: status || '정보 없음', color: 'default' as const };
    }
  };

  const getGradTypeLabel = (type: string) => {
    switch (type) {
      case 'GRADUATED': return '졸업';
      case 'ATTENDING': return '재학 중';
      case 'DROPOUT': return '중퇴';
      case 'REST': return '휴학';
      default: return type || '-';
    }
  };

  // 1. 상세 데이터를 불러오는 독립적인 함수 생성
  const fetchDetail = React.useCallback(() => {
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
        console.error("로딩 실패:", err);
        setLoading(false);
      });
    }
  }, [accountSeq]);

  // 2. 페이지 진입 시 데이터 로드
  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // 3. 모달에서 수정 성공 시 호출할 핸들러
  const handleUpdate = () => {
    fetchDetail();       // 내 화면(상세) 갱신
    onUpdateSuccess();   // 부모 화면(리스트) 갱신
  };

  // 데이터 새로고침 함수
  // const refreshData = () => {
  //   if (accountSeq) {
  //     axios.get(`/api/account/${accountSeq}`).then(res => setStudent(res.data));
  //   }
  // };

  useEffect(() => {
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
        console.error("로딩 실패:", err);
        setLoading(false);
      });
    }
  }, [accountSeq]);

  const getAttendanceUX = (rate: number, status: string) => {
    if (status === 'DROPOUT' || status === 'EARLYOUT') {
      return { 
        label: '산정 종료', 
        color: '#64748b', 
        bgColor: '#f8fafc', 
        icon: <RunningWithErrorsIcon />,
        desc: '학적 변동으로 인해 해당 일자 기준으로 데이터가 동결되었습니다.' 
      };
    }
    if (rate >= 90) return { label: '우수', color: '#15803d', bgColor: '#f0fdf4', icon: <CheckCircleIcon />, desc: '안정적인 출석률을 유지 중입니다.' };
    if (rate >= 80) return { label: '보통', color: '#1d4ed8', bgColor: '#eff6ff', icon: <AnalyticsIcon />, desc: '지속적인 관리가 필요합니다.' };
    return { label: '위험', color: '#dc2626', bgColor: '#fef2f2', icon: <ErrorOutlineIcon />, desc: '출석률이 낮아 수당 지급 제한 가능성이 높습니다.' };
  };

  if (loading) return <RandomSpinner />;
  if (!student) return <Typography sx={{ p: 4 }}>학생 정보를 찾을 수 없습니다.</Typography>;

  const attUX = getAttendanceUX(attendance?.attendanceRate || 0, student.status);
  const isInactive = student.status === 'DROPOUT' || student.status === 'EARLYOUT';

  const InfoItem = ({ icon, label, value, color = "text.primary" }: any) => (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2.5 }}>
      {icon && React.isValidElement(icon) && (
        <Box sx={{ color: 'primary.main', mt: 0.3, display: 'flex', alignItems: 'center' }}>
          {React.cloneElement(icon as React.ReactElement<any>, { 
            sx: { fontSize: '1.4rem', ...(icon.props as any)?.sx } 
          })}
        </Box>
      )}
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2, fontSize: '0.9rem', fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700, color: color, fontSize: '1.05rem', mt: 0.3 }}>
          {value || '-'}
        </Typography>
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
                <Chip 
                    label={getStatusConfig(student.status).label} 
                    color={getStatusConfig(student.status).color} 
                    sx={{ fontWeight: 800, fontSize: '1rem', px: 1, height: 32 }} 
                />
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }} sx={{ borderLeft: { md: '1px solid #f1f5f9' }, pl: { md: 5 } }}>
            <Typography sx={{ fontSize: '1.1rem', color: 'primary.main', fontWeight: 900, display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
              <SchoolIcon /> {student.curName}
            </Typography>
            <Typography sx={{ fontSize: '1.15rem', mb: 2, fontWeight: 700 }}>
              {student.businessName} <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>| {student.room}호 ({student.term}기)</Box>
            </Typography>
            <Stack direction="row" spacing={4}>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary', fontWeight: 700 }}>과정 기간</Typography>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 800 }}>{student.startDate} ~ {student.endDate}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary', fontWeight: 700 }}>담임교수</Typography>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 800 }}>{student.teacherName || '미배정'}</Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Tooltip title={attUX.desc} arrow>
              <Paper elevation={0} sx={{ p: 3, bgcolor: attUX.bgColor, borderRadius: 5, border: '2px solid', borderColor: attUX.color + '33', textAlign: 'center' }}>
                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ color: attUX.color, mb: 1 }}>
                  {React.cloneElement(attUX.icon as React.ReactElement<any>, { sx: { fontSize: '1.6rem' } })}
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 900 }}>{attUX.label}</Typography>
                </Stack>
                <Typography sx={{ fontWeight: 950, color: attUX.color, fontSize: '2rem' }}>
                  <Box component="span" sx={{ fontSize: '1.2rem', fontWeight: 800, mr: 1, opacity: 0.9, color: 'text.secondary' }}>
                    출석률 :
                  </Box>
                  {attendance ? `${attendance.attendanceRate.toFixed(1)}%` : '--%'}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', fontWeight: 700, mt: 1 }}>
                  {isInactive ? `종료일: ${student.dropoutDate || '-'}` : `집계일: ${attendance?.referenceDate || '-'}`}
                </Typography>
              </Paper>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. 상세 정보 영역 */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* 기본 정보 섹터 - 아이디, 이메일, 혼인여부 포함 */}
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3.5 }}>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PersonIcon sx={{ fontSize: '2rem' }} /> 기본 정보
                </Typography>
                <Button 
                  size="small" 
                  variant="outlined" 
                  startIcon={<EditIcon />}
                  onClick={() => setEditModalOpen(true)}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                >
                  학생 정보 수정
                </Button>
              </Stack>
              <InfoItem icon={<ContactPageIcon />} label="아이디" value={student.accountId} color="primary.main" />
              <InfoItem icon={<AlternateEmailIcon />} label="이메일 주소" value={student.accountEmail} />
              
              <Divider sx={{ my: 2.5, borderStyle: 'dashed' }} />
              
              <InfoItem icon={<PersonIcon />} label="성별" value={student.gender === 'M' ? '남성' : '여성'} />
              <InfoItem icon={<BadgeIcon />} label="주민등록번호" value={student.identNumber} />
              <InfoItem icon={<PhoneIphoneIcon />} label="연락처" value={student.tel} />
              <InfoItem icon={<WarningAmberIcon />} label="비상연락처" value={student.emergencyTel} />
              <InfoItem icon={<HomeIcon />} label="거주 주소" value={student.address} />
              <InfoItem icon={<CakeIcon />} label="생년월일" value={`${student.birth || '-'}`} />
              
              <Divider sx={{ my: 2.5, borderStyle: 'dashed' }} />
              
              <InfoItem icon={<MilitaryTechIcon />} label="병역 여부" value={student.militaryStatus || '해당없음'} />
              {/* 혼인여부 이동 배치 */}
              <InfoItem icon={<FamilyRestroomIcon />} label="혼인 여부" value={student.maritalStatus === 'Y' ? '기혼' : '미혼'} />
            </Paper>

            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 5 }}>
              <Typography sx={{ fontSize: '1.3rem', fontWeight: 900, mb: 3.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <BusinessIcon sx={{ fontSize: '2rem' }} /> 학적 및 이력
              </Typography>
              
              {isInactive && (
                <Box sx={{ mb: 4, p: 2.5, bgcolor: student.status === 'DROPOUT' ? '#fff1f2' : '#fffbeb', borderRadius: 3, border: '1px solid', borderColor: student.status === 'DROPOUT' ? '#fee2e2' : '#fef3c7' }}>
                   <InfoItem 
                    icon={<CalendarTodayIcon color={student.status === 'DROPOUT' ? 'error' : 'warning'} />} 
                    label={student.status === 'DROPOUT' ? "중도 탈락 일자" : "수강 철회 일자"} 
                    value={student.dropoutDate} 
                    color={student.status === 'DROPOUT' ? '#e11d48' : '#d97706'}
                  />
                </Box>
              )}

              <InfoItem label="최종학력" value={student.edu ? `${student.edu} (${getGradTypeLabel(student.gradType)})` : '-'} />
              <InfoItem label="전공 학과" value={student.major} />
              <InfoItem label="보유 자격증" value={student.licenses} />
              <Divider sx={{ my: 3 }} />
              <InfoItem label="이전 직장" value={student.prevCompany} />
              <InfoItem label="퇴사 일자" value={student.quitDate} />
            </Paper>
          </Stack>
        </Grid>

        {/* 우측 탭 영역 */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 5, minHeight: 800, overflow: 'hidden' }}>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="fullWidth" sx={{ bgcolor: '#f8fafc', borderBottom: 1, borderColor: 'divider', py: 1 }}>
              <Tab icon={<EventAvailableIcon />} label={<Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>출석 현황</Typography>} />
              <Tab icon={<AnalyticsIcon />} label={<Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>성적/평가</Typography>} />
              <Tab icon={<AssignmentIndIcon />} label={<Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>경력/기록</Typography>} />
              <Tab icon={<ChatIcon />} label={<Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>상담 일지</Typography>} />
            </Tabs>

            <Box sx={{ p: 5 }}>
              {tabValue === 0 && <AttendanceStatusView accountSeq={student.accountSeq} />}
              {tabValue === 2 && (
                <Box>
                  <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, mb: 3 }}>경력 기술 상세</Typography>
                  <Paper variant="outlined" sx={{ p: 3, mb: 5, bgcolor: '#fcfcfc', borderRadius: 4, borderStyle: 'dashed' }}>
                    <Typography sx={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', lineHeight: 1.7, color: '#334155' }}>
                      {student.career || "등록된 상세 경력이 없습니다."}
                    </Typography>
                  </Paper>
                  
                  <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, mb: 3, color: isInactive ? 'error.main' : 'inherit' }}>
                    학적 변동 사유
                  </Typography>
                  <TextField 
                    fullWidth multiline rows={4} 
                    value={student.dropoutInfo || ""} 
                    slotProps={{ 
                        input: { readOnly: true, sx: { fontSize: '1.1rem', p: 2, bgcolor: isInactive ? '#fffafb' : '#f8fafc' } } 
                    }}
                    sx={{ mb: 5 }}
                  />

                  <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, mb: 3 }}>학습자 관찰 기록 (내부용)</Typography>
                  <TextField 
                    fullWidth multiline rows={5} 
                    placeholder="학습 태도, 특이사항 등을 자유롭게 기록하세요." 
                    slotProps={{ input: { sx: { fontSize: '1.1rem', p: 2 } } }}
                  />
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" size="large" startIcon={<SaveIcon />} sx={{ borderRadius: 3, px: 5, py: 1.8, fontSize: '1.15rem', fontWeight: 900, boxShadow: 3 }}>기록 저장</Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 정보 수정 모달 */}
      <EditStudentModal 
        open={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        studentData={student}
        onUpdate={handleUpdate}
      />
    </Box>
  );
};

export default StudentDetailPage;