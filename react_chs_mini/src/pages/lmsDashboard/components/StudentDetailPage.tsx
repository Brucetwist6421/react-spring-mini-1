/* eslint-disable @typescript-eslint/no-explicit-any */
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ChatIcon from '@mui/icons-material/Chat';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SaveIcon from '@mui/icons-material/Save';
import {Avatar,Box,Button,Chip,Paper,Stack,Tab, Tabs,TextField,Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom'; 
import { useEffect, useState } from 'react';

const StudentDetailPage = () => {
  const { accSeq } = useParams<{ accSeq: string }>();
  const [student, setStudent] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 여기서 API 호출을 수행합니다.
    // 예: axios.get(`/api/student/${accSeq}`).then(...)
    console.log("조회할 학생 PK:", accSeq);
    
    // 임시 데이터 세팅 로직 (실제로는 API 연동)
    const timer = setTimeout(() => {
      setStudent({
        accountName: "홍길동",
        accountId: "hong123",
        status: "수강중",
        tel: "010-1234-5678",
        major: "컴퓨터공학"
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [accSeq]);

  if (loading) return <Typography>데이터를 불러오는 중...</Typography>;
  if (!student) return <Typography>학생 정보를 찾을 수 없습니다.</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      
      {/* 1. 상단 프로필 요약 카드 (Header) */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 4, bgcolor: '#ffffff' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size="auto">
            <Avatar 
              sx={{ 
                width: 90, 
                height: 90, 
                bgcolor: '#3b82f6', 
                fontSize: '2.2rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              {student.accountName ? student.accountName[0] : '?'}
            </Avatar>
          </Grid>
          
          <Grid size={{ xs: 'grow' }}>
            <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4" fontWeight={800} color="#1e293b">
                {student.accountName}
              </Typography>
              <Chip label={student.accountId} size="small" variant="filled" sx={{ bgcolor: '#f1f5f9', fontWeight: 600 }} />
            </Box>
            
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              <Chip label={`상태: ${student.status || '알 수 없음'}`} color="success" size="small" sx={{ fontWeight: 600 }} />
              <Chip label={`전공: ${student.major || '미입력'}`} variant="outlined" size="small" />
              <Chip label={`📞 ${student.tel || '연락처 없음'}`} variant="outlined" size="small" />
            </Stack>
          </Grid>

          <Grid size="auto">
             <Box sx={{ 
               p: 2, 
               bgcolor: '#f0fdf4', 
               borderRadius: 3, 
               border: '1px solid #dcfce7',
               textAlign: 'center',
               minWidth: 120
             }}>
                <Typography variant="caption" color="#166534" fontWeight={700}>전체 출석률</Typography>
                <Typography variant="h4" fontWeight={800} color="#15803d">98%</Typography>
             </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. 하단 상세 정보 탭 영역 (Main) */}
      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4, minHeight: '600px', overflow: 'hidden' }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, val) => setTabValue(val)}
          variant="fullWidth" // 탭 너비를 균등하게 배분하여 가독성 향상
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            bgcolor: '#f8fafc',
            '& .MuiTab-root': { fontWeight: 700, py: 2 }
          }}
        >
          <Tab icon={<EventAvailableIcon />} iconPosition="start" label="출석 정보" />
          <Tab icon={<AnalyticsIcon />} iconPosition="start" label="평가 정보" />
          <Tab icon={<AssignmentIndIcon />} iconPosition="start" label="의견/특이사항" />
          <Tab icon={<ChatIcon />} iconPosition="start" label="상담 정보" />
        </Tabs>

        <Box sx={{ p: 4 }}>
          {/* 탭 1: 출석 정보 */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={3}>월간 출석 히스토리</Typography>
              
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: '#f8fafc', borderStyle: 'dashed' }}>
                <Typography align="center" color="text.secondary">
                  출석 캘린더 라이브러리(FullCalendar 등) 연동 구역
                </Typography>
              </Paper>
            </Box>
          )}

          {/* 탭 2: 평가 정보 */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={3}>교과목 성취도 분석</Typography>
              
              <Grid container spacing={2}>
                {['Java 알고리즘', 'DB 설계', 'React 프레임워크'].map((subject) => (
                  <Grid size={{ xs: 12, md: 4 }} key={subject}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">{subject}</Typography>
                      <Typography variant="h5" fontWeight={700}>92점</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* 탭 3: 의견/특이사항 */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={2}>학습 및 태도 관찰 기록</Typography>
              <TextField 
                fullWidth 
                multiline 
                rows={6} 
                placeholder="학생의 수업 참여도, 기술적 강점, 협업 태도 등을 상세히 기록해주세요."
                sx={{ 
                  bgcolor: '#ffffff',
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" size="large" startIcon={<SaveIcon />} sx={{ borderRadius: 2, px: 4 }}>
                  기록 저장
                </Button>
              </Box>
            </Box>
          )}

          {/* 탭 4: 상담 정보 */}
          {tabValue === 3 && (
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight={700}>상담 이력</Typography>
                <Button variant="outlined" startIcon={<ChatIcon />} sx={{ borderRadius: 2 }}>새 상담 기록</Button>
              </Stack>
              
              <Stack spacing={2}>
                {[1, 2].map((i) => (
                  <Paper key={i} variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderLeft: '5px solid #3b82f6' }}>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                      <Typography variant="subtitle1" fontWeight={700} color="primary">2026-02-13 1차 정기 상담</Typography>
                      <Typography variant="caption" color="text.secondary">작성자: 홍길동 교수</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
                      학생이 프로젝트 진행 중 팀원과의 소통에 어려움을 겪고 있음을 확인. 
                      기술적으로는 React Hook 활용 능력이 우수하나 백엔드 연동 부분의 보충 학습 권고함.
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentDetailPage;