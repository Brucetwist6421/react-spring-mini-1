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

import RandomSpinner from '../../../components/RandomSpinner';
import AttendanceStatusView from './AttendanceStatusView';

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
    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1.8 }}>
      <Box sx={{ color: 'primary.main', mt: 0.2 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1 }}>{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: color }}>{value || '-'}</Typography>
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 4 }}>
      
      {/* 1. 상단 프로필 요약 (Header) */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          border: '1px solid #e2e8f0', 
          borderRadius: 4, 
          bgcolor: '#ffffff', 
          position: 'relative', 
          overflow: 'hidden',
          '&::before': isInactive ? {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, width: '4px', height: '100%',
            bgcolor: student.status === 'DROPOUT' ? 'error.main' : 'warning.main'
          } : {}
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar 
                src={student.mainImagePath ? `http://168.107.51.143:8080/upload/${encodeURIComponent(student.mainImagePath)}` : `https://w7.pngwing.com/pngs/884/996/png-transparent-pingu-waiting-cartoons-pingu-thumbnail.png`}
                sx={{ width: 110, height: 110, bgcolor: isInactive ? '#94a3b8' : '#3b82f6', fontSize: '2.5rem', fontWeight: 800 }}>
                {student.accountName?.[0]}
              </Avatar>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="h5" fontWeight={800}>{student.accountName}</Typography>
                  <Chip label={student.accountId} size="small" variant="outlined" />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{student.accountEmail}</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label={getStatusConfig(student.status).label} color={getStatusConfig(student.status).color} size="small" sx={{ fontWeight: 700 }} />
                  <Chip label={student.militaryStatus || '군미필'} variant="outlined" size="small" />
                </Stack>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }} sx={{ borderLeft: { md: '1px solid #f1f5f9' }, pl: { md: 4 } }}>
            <Typography variant="caption" color="primary" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
              <SchoolIcon fontSize="small" /> 소속 과정: {student.curName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              사업명: <strong>{student.businessName}</strong> | {student.room}호 ({student.term}기)
            </Typography>
            <Stack direction="row" spacing={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">과정 기간</Typography>
                <Typography variant="body2" fontWeight={600}>{student.startDate} ~ {student.endDate}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">담임</Typography>
                <Typography variant="body2" fontWeight={600}>{student.teacherName || '배정 전'}</Typography>
              </Box>
            </Stack>
          </Grid>

          {/* 출석 상태 요약 섹션 */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Tooltip title={attUX.desc} arrow>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  bgcolor: attUX.bgColor, 
                  borderRadius: 4, 
                  border: '1px solid', 
                  borderColor: attUX.color + '33',
                  textAlign: 'center',
                  cursor: 'help',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                }}
              >
                <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" sx={{ color: attUX.color, mb: 0.5 }}>
                  {attUX.icon}
                  <Typography variant="caption" fontWeight={900}>{attUX.label}</Typography>
                </Stack>
                <Typography variant="h4" fontWeight={900} color={attUX.color}>
                  {attendance ? `${attendance.attendanceRate.toFixed(1)}%` : '--%'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mt: 0.5 }}>
                  {isInactive ? `변동일: ${student.dropoutDate || '-'}` : `집계일: ${attendance?.referenceDate || '-'}`}
                </Typography>
              </Paper>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. 상세 정보 영역 */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 4 }}>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon /> 기본 정보
              </Typography>
              <InfoItem icon={<BadgeIcon fontSize="small" />} label="주민등록번호" value={student.identNumber} />
              <InfoItem icon={<PhoneIphoneIcon fontSize="small" />} label="연락처" value={student.tel} />
              <InfoItem icon={<WarningAmberIcon fontSize="small" />} label="비상연락처" value={student.emergencyTel} />
              <InfoItem icon={<HomeIcon fontSize="small" />} label="주소" value={student.address} />
              <InfoItem icon={<CakeIcon fontSize="small" />} label="생년월일(성별)" value={`${student.birth || '-'} (${student.gender === 'M' ? '남' : '여'})`} />
            </Paper>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 4 }}>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon /> 학적 및 이력
              </Typography>
              
              {/* 중도탈락/철회 시 날짜 섹션 강조 */}
              {isInactive && (
                <Box sx={{ mb: 3, p: 2, bgcolor: student.status === 'DROPOUT' ? '#fff1f2' : '#fffbeb', borderRadius: 2, border: '1px solid', borderColor: student.status === 'DROPOUT' ? '#fee2e2' : '#fef3c7' }}>
                   <InfoItem 
                    icon={<CalendarTodayIcon fontSize="small" color={student.status === 'DROPOUT' ? 'error' : 'warning'} />} 
                    label={student.status === 'DROPOUT' ? "중도 탈락 일자" : "수강 철회 일자"} 
                    value={student.dropoutDate} 
                    color={student.status === 'DROPOUT' ? '#e11d48' : '#d97706'}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: -1, display: 'block', fontSize: '0.7rem' }}>
                    * 해당 일자 이후의 출석은 집계에서 제외되었습니다.
                  </Typography>
                </Box>
              )}

              <InfoItem 
                label="최종학력" 
                value={student.edu ? `${student.edu} (${getGradTypeLabel(student.gradType)})` : '-'} 
              />
              <InfoItem label="전공" value={student.major} />
              <InfoItem label="자격증" value={student.licenses} />
              <Divider sx={{ my: 2 }} />
              <InfoItem label="전 직장명" value={student.prevCompany} />
              <InfoItem label="퇴사일자" value={student.quitDate} />
              <InfoItem label="혼인여부" value={student.maritalStatus === 'Y' ? '기혼' : '미혼'} />
            </Paper>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4, minHeight: 650, overflow: 'hidden' }}>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="fullWidth" sx={{ bgcolor: '#f8fafc', borderBottom: 1, borderColor: 'divider' }}>
              <Tab icon={<EventAvailableIcon />} label="출석" sx={{ fontWeight: 700 }} />
              <Tab icon={<AnalyticsIcon />} label="평가" sx={{ fontWeight: 700 }} />
              <Tab icon={<AssignmentIndIcon />} label="경력/기록" sx={{ fontWeight: 700 }} />
              <Tab icon={<ChatIcon />} label="상담" sx={{ fontWeight: 700 }} />
            </Tabs>

            <Box sx={{ p: 4 }}>
              {tabValue === 0 && (
                <AttendanceStatusView accountSeq={student.accountSeq} />
              )}
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" fontWeight={800} mb={2}>경력 기술 상세</Typography>
                  <Paper variant="outlined" sx={{ p: 2, mb: 4, bgcolor: '#fcfcfc' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {student.career || "등록된 경력 상세 내용이 없습니다."}
                    </Typography>
                  </Paper>
                  
                  <Typography variant="h6" fontWeight={800} mb={2} color={isInactive ? 'error.main' : 'inherit'}>
                    학적 변동 상세 정보
                  </Typography>
                  <TextField 
                    fullWidth multiline rows={3} 
                    placeholder="탈락 사유 등이 여기에 표시됩니다."
                    value={student.dropoutInfo || ""} 
                    slotProps={{input: {readOnly: true,},}}
                    sx={{ mb: 4, bgcolor: isInactive ? '#fffafb' : '#f8fafc' }}
                  />

                  <Typography variant="h6" fontWeight={800} mb={2}>담당자 관찰 기록</Typography>
                  <TextField fullWidth multiline rows={4} placeholder="학생 관찰 내용이나 특이사항을 입력하세요." />
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" startIcon={<SaveIcon />} sx={{ borderRadius: 2 }}>저장하기</Button>
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