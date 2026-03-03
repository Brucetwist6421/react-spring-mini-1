/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar, Box, Button,
  Chip, Divider,
  Paper, Stack, Tab, Tabs, TextField, Tooltip, Typography
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid2 권장 사용
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

import RandomSpinner from '../../../components/RandomSpinner';
import AttendanceStatusView from './AttendanceStatusView';
import React from 'react';

const StudentDetailPage = () => {
  const { accountSeq } = useParams<{ accountSeq: string }>();
  const [student, setStudent] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. 상태별 한글 명칭 및 UX 컬러 매핑 함수
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ENROLLED': return { label: '재학 중', color: 'success' as const };
      case 'DROPOUT': return { label: '중도 탈락', color: 'error' as const };
      case 'EARLYOUT': return { label: '수강 철회', color: 'warning' as const };
      case 'GRADUATED': return { label: '수료', color: 'primary' as const };
      default: return { label: status || '정보 없음', color: 'default' as const };
    }
  };

  // 2. 학력 상태(gradType) 한글 매핑 함수
  const getGradTypeLabel = (type: string) => {
    switch (type) {
      case 'GRADUATED': return '졸업';
      case 'ATTENDING': return '재학 중';
      case 'DROPOUT': return '중퇴';
      case 'REST': return '휴학';
      default: return type || '-';
    }
  };

  useEffect(() => {
    if (accountSeq) {
      setLoading(true);
      // 학생 정보와 출석 정보를 동시에 로드
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

  // 출석률 및 학적 상태에 따른 UX 설정 함수
  const getAttendanceUX = (rate: number, status: string) => {
    if (status === 'DROPOUT' || status === 'EARLYOUT') {
      return { 
        label: '산정 종료', 
        color: '#64748b', 
        bgColor: '#f8fafc', 
        icon: <RunningWithErrorsIcon fontSize="small" />,
        desc: '학적 변동으로 인해 해당 일자 기준으로 데이터가 동결되었습니다.' 
      };
    }
    if (rate >= 90) return { label: '우수', color: '#15803d', bgColor: '#f0fdf4', icon: <CheckCircleIcon fontSize="small" />, desc: '안정적인 출석률을 유지 중입니다.' };
    if (rate >= 80) return { label: '보통', color: '#1d4ed8', bgColor: '#eff6ff', icon: <AnalyticsIcon fontSize="small" />, desc: '지속적인 관리가 필요합니다.' };
    return { label: '위험', color: '#dc2626', bgColor: '#fef2f2', icon: <ErrorOutlineIcon fontSize="small" />, desc: '출석률이 낮아 수당 지급 제한 가능성이 높습니다.' };
  };

  if (loading) return <RandomSpinner />;
  if (!student) return <Typography sx={{ p: 4 }}>학생 정보를 찾을 수 없습니다.</Typography>;

  const attUX = getAttendanceUX(attendance?.attendanceRate || 0, student.status);
  const isInactive = student.status === 'DROPOUT' || student.status === 'EARLYOUT';

  const InfoItem = ({ icon, label, value, color = "text.primary" }: any) => (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2.2 }}>
      {icon && React.isValidElement(icon) && (
        <Box sx={{ color: 'primary.main', mt: 0.3, display: 'flex', alignItems: 'center' }}>
          {/* React.cloneElement를 사용해 기존 아이콘에 새로운 속성(sx)을 안전하게 주입 */}
          {React.cloneElement(icon as React.ReactElement<any>, { 
            sx: { 
              fontSize: '1.4rem',
              ...(icon.props as any)?.sx // 기존에 아이콘이 가지고 있던 sx 속성이 있다면 유지
            } 
          })}
        </Box>
      )}
      {/* 아이콘이 없는 경우에도 레이아웃 유지를 위해 왼쪽 여백 확보 (선택 사항) */}
      {!icon && <Box sx={{ minWidth: label ? 0 : 32 }} />} 
      
      <Box>
        <Typography 
          variant="caption" 
          sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2, fontSize: '0.9rem', fontWeight: 700 }}
        >
          {label}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ fontWeight: 700, color: color, fontSize: '1.05rem', mt: 0.3 }}
        >
          {value || '-'}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 4, mt: 1 }}>
      
      {/* 1. 상단 프로필 요약 (Header) */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, // 패딩 증가
          border: '1px solid #e2e8f0', 
          borderRadius: 5, 
          bgcolor: '#ffffff', 
          position: 'relative', 
          overflow: 'hidden'
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={4} alignItems="center">
              <Avatar 
                src={student.mainImagePath ? `http://168.107.51.143:8080/upload/${encodeURIComponent(student.mainImagePath)}` : `https://w7.pngwing.com/pngs/884/996/png-transparent-pingu-waiting-cartoons-pingu-thumbnail.png`}
                sx={{ width: 130, height: 130, bgcolor: isInactive ? '#94a3b8' : '#3b82f6', fontSize: '3rem', fontWeight: 800 }}>
                {student.accountName?.[0]}
              </Avatar>
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Typography sx={{ fontSize: '1.8rem', fontWeight: 900 }}>{student.accountName}</Typography>
                  <Chip label={student.accountId} size="medium" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.9rem' }} />
                </Stack>
                <Typography sx={{ fontSize: '1.1rem', color: 'text.secondary', mb: 2 }}>이메일 : {student.accountEmail}</Typography>
                <Stack direction="row" spacing={1.5}>
                  <Chip label={getStatusConfig(student.status).label} color={getStatusConfig(student.status).color} sx={{ fontWeight: 800, fontSize: '0.95rem', px: 1 }} />
                </Stack>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }} sx={{ borderLeft: { md: '1px solid #f1f5f9' }, pl: { md: 5 } }}>
            <Typography sx={{ fontSize: '1rem', color: 'primary.main', fontWeight: 900, display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
              <SchoolIcon /> 소속 과정: {student.curName}
            </Typography>
            <Typography sx={{ fontSize: '1.1rem', mb: 2 }}>
              사업명: <strong>{student.businessName}</strong> | {student.room}호 ({student.term}기)
            </Typography>
            <Stack direction="row" spacing={4}>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary', fontWeight: 700 }}>과정 기간</Typography>
                <Typography sx={{ fontSize: '1.05rem', fontWeight: 800 }}>{student.startDate} ~ {student.endDate}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary', fontWeight: 700 }}>담임</Typography>
                <Typography sx={{ fontSize: '1.05rem', fontWeight: 800 }}>{student.teacherName || '배정 전'}</Typography>
              </Box>
            </Stack>
          </Grid>

          {/* 출석 상태 요약 섹션 */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Tooltip title={attUX.desc} arrow>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  bgcolor: attUX.bgColor, 
                  borderRadius: 5, 
                  border: '2px solid', 
                  borderColor: attUX.color + '33',
                  textAlign: 'center'
                }}
              >
                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ color: attUX.color, mb: 1 }}>
                  {React.cloneElement(attUX.icon, { sx: { fontSize: '1.5rem' } })}
                  <Typography sx={{ fontSize: '1rem', fontWeight: 900 }}>{attUX.label}</Typography>
                </Stack>
                <Typography sx={{ fontWeight: 950, color: attUX.color, fontSize: '1.8rem' }}>
                  <Box component="span" sx={{ fontSize: '1.1rem', fontWeight: 800, mr: 0.5 }}>출석률 :</Box>
                  {attendance ? `${attendance.attendanceRate.toFixed(1)}%` : '--%'}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', fontWeight: 700, mt: 1 }}>
                  {isInactive ? `변동일: ${student.dropoutDate || '-'}` : `집계일: ${attendance?.referenceDate || '-'}`}
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
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 5 }}>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PersonIcon sx={{ fontSize: '1.8rem' }} /> 기본 정보
              </Typography>
              <InfoItem icon={<BadgeIcon />} label="주민등록번호" value={student.identNumber} />
              <InfoItem icon={<PhoneIphoneIcon />} label="연락처" value={student.tel} />
              <InfoItem icon={<WarningAmberIcon />} label="비상연락처" value={student.emergencyTel} />
              <InfoItem icon={<HomeIcon />} label="주소" value={student.address} />
              <InfoItem icon={<CakeIcon />} label="생년월일(성별)" value={`${student.birth || '-'} (${student.gender === 'M' ? '남' : '여'})`} />
              <InfoItem icon={<MilitaryTechIcon />} label="군필 여부" value={student.militaryStatus || '미필'} />
            </Paper>

            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 5 }}>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <BusinessIcon sx={{ fontSize: '1.8rem' }} /> 학적 및 이력
              </Typography>
              
              {isInactive && (
                <Box sx={{ mb: 4, p: 2.5, bgcolor: student.status === 'DROPOUT' ? '#fff1f2' : '#fffbeb', borderRadius: 3, border: '1px solid', borderColor: student.status === 'DROPOUT' ? '#fee2e2' : '#fef3c7' }}>
                   <InfoItem 
                    icon={<CalendarTodayIcon color={student.status === 'DROPOUT' ? 'error' : 'warning'} />} 
                    label={student.status === 'DROPOUT' ? "중도 탈락 일자" : "수강 철회 일자"} 
                    value={student.dropoutDate} 
                    color={student.status === 'DROPOUT' ? '#e11d48' : '#d97706'}
                  />
                  <Typography sx={{ mt: -1, color: 'text.secondary', fontWeight: 600, fontSize: '0.85rem' }}>
                    * 학적 변동으로 인해 출석 집계가 종료되었습니다.
                  </Typography>
                </Box>
              )}

              <InfoItem label="최종학력" value={student.edu ? `${student.edu} (${getGradTypeLabel(student.gradType)})` : '-'} />
              <InfoItem label="전공" value={student.major} />
              <InfoItem label="자격증" value={student.licenses} />
              <Divider sx={{ my: 3 }} />
              <InfoItem label="전 직장명" value={student.prevCompany} />
              <InfoItem label="퇴사일자" value={student.quitDate} />
              <InfoItem label="혼인여부" value={student.maritalStatus === 'Y' ? '기혼' : '미혼'} />
            </Paper>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 5, minHeight: 700, overflow: 'hidden' }}>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="fullWidth" sx={{ bgcolor: '#f8fafc', borderBottom: 1, borderColor: 'divider' }}>
              <Tab icon={<EventAvailableIcon />} label={<Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>출석</Typography>} />
              <Tab icon={<AnalyticsIcon />} label={<Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>평가</Typography>} />
              <Tab icon={<AssignmentIndIcon />} label={<Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>경력/기록</Typography>} />
              <Tab icon={<ChatIcon />} label={<Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>상담</Typography>} />
            </Tabs>

            <Box sx={{ p: 5 }}>
              {tabValue === 0 && <AttendanceStatusView accountSeq={student.accountSeq} />}
              {tabValue === 2 && (
                <Box>
                  <Typography sx={{ fontSize: '1.3rem', fontWeight: 900, mb: 3 }}>경력 기술 상세</Typography>
                  <Paper variant="outlined" sx={{ p: 3, mb: 5, bgcolor: '#fcfcfc', borderRadius: 3 }}>
                    <Typography sx={{ whiteSpace: 'pre-wrap', fontSize: '1.05rem', lineHeight: 1.6 }}>
                      {student.career || "등록된 경력 상세 내용이 없습니다."}
                    </Typography>
                  </Paper>
                  
                  <Typography sx={{ fontSize: '1.3rem', fontWeight: 900, mb: 3, color: isInactive ? 'error.main' : 'inherit' }}>
                    학적 변동 상세 정보
                  </Typography>
                  <TextField 
                    fullWidth multiline rows={4} 
                    value={student.dropoutInfo || ""} 
                    slotProps={{ 
                        input: { readOnly: true, sx: { fontSize: '1.05rem', p: 2 } } 
                    }}
                    sx={{ mb: 5, bgcolor: isInactive ? '#fffafb' : '#f8fafc' }}
                  />

                  <Typography sx={{ fontSize: '1.3rem', fontWeight: 900, mb: 3 }}>담당자 관찰 기록</Typography>
                  <TextField 
                    fullWidth multiline rows={5} 
                    placeholder="특이사항을 입력하세요." 
                    slotProps={{ input: { sx: { fontSize: '1.05rem' } } }}
                  />
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" startIcon={<SaveIcon />} sx={{ borderRadius: 3, px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 800 }}>저장하기</Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDetailPage;