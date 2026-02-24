/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar, Box, Button,
  Card, CardContent,
  Chip,
  Divider,
  Paper, Stack, Tab, Tabs,
  TextField,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid'; // MUI 최신 Grid2 권장
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// 아이콘 임포트
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CakeIcon from '@mui/icons-material/Cake';
import ChatIcon from '@mui/icons-material/Chat';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import SaveIcon from '@mui/icons-material/Save';
import SchoolIcon from '@mui/icons-material/School';

const StudentDetailPage = () => {
  const { accSeq } = useParams<{ accSeq: string }>();
  const [student, setStudent] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accSeq) {
      setLoading(true);
      // 백엔드 API 호출 (/api/account/{accSeq})
      axios.get(`/api/account/${accSeq}`)
        .then(res => {
          console.log("학생 상세 정보:", res.data);
          setStudent(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("학생 정보 로딩 실패:", err);
          setLoading(false);
        });
    }
  }, [accSeq]);

  if (loading) return <Typography sx={{ p: 4 }}>데이터를 불러오는 중...</Typography>;
  if (!student) return <Typography sx={{ p: 4 }}>학생 정보를 찾을 수 없습니다.</Typography>;

  // 정보 한 줄 표시용 컴포넌트
  const InfoItem = ({ icon, label, value, color = "text.primary" }: any) => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
      {icon}
      <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 80 }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, color: color }}>{value || '-'}</Typography>
    </Stack>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 4 }}>
      
      {/* 1. 상단 프로필 및 과정 요약 카드 영역*/}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 4, bgcolor: '#ffffff' }}>
        <Grid container spacing={4}>
          {/* 사진 및 이름 섹션 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar 
                src={student.profileImg} // 사진 데이터가 있다면 연동
                sx={{ 
                  width: 100, height: 100, bgcolor: '#3b82f6', 
                  fontSize: '2.5rem', fontWeight: 700,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
              >
                {student.accountName?.[0]}
              </Avatar>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="h5" fontWeight={800} color="#000">{student.accountName}</Typography>
                  <Chip label={student.accountId} size="small" sx={{ fontWeight: 600, height: 20 }} />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{student.accountEmail}</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label={student.status || '수강중'} color="primary" size="small" sx={{ fontWeight: 700 }} />
                  <Chip label={student.militaryStatus || '군필'} variant="outlined" size="small" sx={{ fontWeight: 600 }} />
                </Stack>
              </Box>
            </Stack>
          </Grid>

          {/* 과정 정보 섹션 (tb_curriculum 연동 데이터) */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ borderLeft: { md: '1px solid #f1f5f9' }, pl: { md: 4 } }}>
            <Typography variant="caption" color="primary" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
              <SchoolIcon fontSize="small" /> 소속 과정 정보
            </Typography>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.5 }}>{student.curName}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              사업명: <Box component="span" sx={{ color: '#000', fontWeight: 600 }}>{student.businessName}</Box>
            </Typography>
            <Stack direction="row" spacing={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">과정 기간</Typography>
                <Typography variant="body2" fontWeight={600}>{student.startDate} ~ {student.endDate}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">담당 관리자(ID)</Typography>
                <Typography variant="body2" fontWeight={600}>{student.teacherSeq}</Typography>
              </Box>
            </Stack>
          </Grid>

          {/* 핵심 지표 (출석률 등) */}
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ p: 2.5, bgcolor: '#f0fdf4', borderRadius: 4, border: '1px solid #dcfce7', textAlign: 'center', width: '100%' }}>
               <Typography variant="caption" color="#166534" fontWeight={800}>실시간 출석률</Typography>
               <Typography variant="h3" fontWeight={900} color="#15803d">98<small style={{ fontSize: '1.2rem' }}>%</small></Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. 하단 상세 정보 (그리드 레이아웃: 왼쪽 인적사항 / 오른쪽 탭메뉴) */}
      <Grid container spacing={2}>
        {/* 왼쪽: 고정 인적 사항 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 4, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon /> 인적 사항 상세
            </Typography>
            
            <InfoItem icon={<PhoneIphoneIcon fontSize="small" />} label="전화번호" value={student.tel} />
            <InfoItem icon={<CakeIcon fontSize="small" />} label="생년월일" value={student.birth} />
            <InfoItem icon={<PersonIcon fontSize="small" />} label="성별" value={student.gender === 'M' ? '남성' : '여성'} />
            <InfoItem icon={<HomeIcon fontSize="small" />} label="주소" value={student.address} />
            
            <Divider sx={{ my: 2.5 }} />
            
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 1.5 }}>학력 및 전공</Typography>
            <InfoItem label="최종학력" value={student.edu} />
            <InfoItem label="전공" value={student.major} />
            <InfoItem label="졸업구분" value={student.gradType} />
          </Paper>
        </Grid>

        {/* 오른쪽: 인터랙티브 탭 영역 */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4, minHeight: 500, overflow: 'hidden' }}>
            <Tabs 
              value={tabValue} 
              onChange={(_, val) => setTabValue(val)}
              variant="fullWidth"
              sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
            >
              <Tab icon={<EventAvailableIcon />} label="출석현황" sx={{ fontWeight: 700 }} />
              <Tab icon={<AnalyticsIcon />} label="평가정보" sx={{ fontWeight: 700 }} />
              <Tab icon={<AssignmentIndIcon />} label="의견/특이사항" sx={{ fontWeight: 700 }} />
              <Tab icon={<ChatIcon />} label="상담정보" sx={{ fontWeight: 700 }} />
            </Tabs>

            <Box sx={{ p: 4 }}>
              {/* 탭 1: 출석 정보 */}
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" fontWeight={800} mb={3}>월간 출석 현황</Typography>
                  <Box sx={{ p: 5, border: '2px dashed #e2e8f0', borderRadius: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">출석 데이터 그리드 또는 캘린더 라이브러리가 표시되는 영역입니다.</Typography>
                  </Box>
                </Box>
              )}

              {/* 탭 2: 평가 정보 */}
              {tabValue === 1 && (
                <Box>
                   <Typography variant="h6" fontWeight={800} mb={3}>교과목 평가 결과</Typography>
                   <Grid container spacing={2}>
                      {['Java 프로그래밍', 'SQL 응용', 'React 실습'].map(sub => (
                        <Grid size={{ xs: 12, sm: 4 }} key={sub}>
                          <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent>
                              <Typography variant="caption" color="text.secondary">{sub}</Typography>
                              <Typography variant="h5" fontWeight={800} color="primary">95점</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                   </Grid>
                </Box>
              )}

              {/* 탭 3: 의견 및 특이사항 (실제 입력 기능) */}
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" fontWeight={800} mb={2}>담당자 관찰 기록</Typography>
                  <TextField 
                    fullWidth multiline rows={8} 
                    placeholder="학생의 성취도나 태도에 대한 특이사항을 기록하세요."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#fbfcfd' } }}
                  />
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" startIcon={<SaveIcon />} sx={{ borderRadius: 2, px: 4 }}>저장하기</Button>
                  </Box>
                </Box>
              )}

              {/* 탭 4: 상담 정보 */}
              {tabValue === 3 && (
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={3}>
                    <Typography variant="h6" fontWeight={800}>상담 이력</Typography>
                    <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>+ 신규 상담</Button>
                  </Stack>
                  <Stack spacing={2}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, borderLeft: '4px solid #3b82f6' }}>
                      <Typography variant="subtitle2" fontWeight={800} color="primary" gutterBottom>2026-02-15 정기 상담</Typography>
                      <Typography variant="body2">진로 및 취업 관련 상담 진행. 특정 기업(네이버) 인턴십 준비 중.</Typography>
                    </Paper>
                  </Stack>
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