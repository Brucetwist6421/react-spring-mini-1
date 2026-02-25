/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar, Box, Button,
  Chip, Divider,
  Paper, Stack, Tab, Tabs, TextField, Typography
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
import RandomSpinner from '../../../components/RandomSpinner';

const StudentDetailPage = () => {
  const { accSeq } = useParams<{ accSeq: string }>();
  const [student, setStudent] = useState<any>(null);
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

  // 2. 학력 상태(gradType) 한글 매핑 함수 추가
  const getGradTypeLabel = (type: string) => {
    switch (type) {
      case 'GRADUATED': return '졸업';
      case 'ATTENDING': return '재학 중';
      case 'DROPOUT': return '중퇴';
      case 'REST': return '휴학';
      //case 'COMPLETED': return '수료';
      default: return type || '-';
    }
  };

  useEffect(() => {
    if (accSeq) {
      setLoading(true);
      axios.get(`/api/account/${accSeq}`)
        .then(res => {
          setStudent(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("학생 정보 로딩 실패:", err);
          setLoading(false);
        });
    }
  }, [accSeq]);

  if (loading) return <RandomSpinner/>;
  if (!student) return <Typography sx={{ p: 4 }}>학생 정보를 찾을 수 없습니다.</Typography>;

  const statusCfg = getStatusConfig(student.status);

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
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 4, bgcolor: '#ffffff' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar sx={{ width: 100, height: 100, bgcolor: '#3b82f6', fontSize: '2.5rem', fontWeight: 800 }}>
                {student.accountName?.[0]}
              </Avatar>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="h5" fontWeight={800}>{student.accountName}</Typography>
                  <Chip label={student.accountId} size="small" variant="outlined" />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{student.accountEmail}</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label={statusCfg.label} color={statusCfg.color} size="small" sx={{ fontWeight: 700 }} />
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

          <Grid size={{ xs: 12, md: 3 }} sx={{ textAlign: 'center' }}>
            <Box sx={{ p: 2, bgcolor: student.status === 'DROPOUT' ? '#fef2f2' : '#f0fdf4', borderRadius: 4, border: '1px solid', borderColor: student.status === 'DROPOUT' ? '#fee2e2' : '#dcfce7' }}>
               <Typography variant="caption" color={student.status === 'DROPOUT' ? '#991b1b' : '#166534'} fontWeight={800}>출석 상태</Typography>
               <Typography variant="h4" fontWeight={900} color={student.status === 'DROPOUT' ? '#dc2626' : '#15803d'}>
                 {student.status === 'DROPOUT' ? '중단' : '정상'}
               </Typography>
            </Box>
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
              <InfoItem icon={<CakeIcon fontSize="small" />} label="생년월일" value={`${student.birth || '-'} (${student.gender === 'M' ? '남' : '여'})`} />
            </Paper>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 4 }}>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon /> 학력 및 경력
              </Typography>
              {/* 최종학력 매핑 적용 부분 */}
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
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" fontWeight={800} mb={2}>경력 기술 상세</Typography>
                  <Paper variant="outlined" sx={{ p: 2, mb: 4, bgcolor: '#fcfcfc' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {student.career || "등록된 경력 상세 내용이 없습니다."}
                    </Typography>
                  </Paper>
                  
                  <Typography variant="h6" fontWeight={800} mb={2} color={student.status === 'DROPOUT' ? 'error.main' : 'inherit'}>
                    중도탈락/변동 정보
                  </Typography>
                  <TextField 
                    fullWidth multiline rows={3} 
                    value={student.dropoutInfo || ""} 
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 4, bgcolor: student.status === 'DROPOUT' ? '#fff5f5' : '#f8fafc' }}
                  />

                  <Typography variant="h6" fontWeight={800} mb={2}>담당자 관찰 기록</Typography>
                  <TextField fullWidth multiline rows={4} placeholder="특이사항을 입력하세요." />
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