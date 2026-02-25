/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import { Box, Paper, List, ListItemButton, ListItemText, Typography, Divider, Chip, Stack, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import StudentDetailPage from "./StudentDetailPage";
import SchoolIcon from '@mui/icons-material/School';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // 아이콘 추가

const LmsStudentManagement = () => {
  const { curSeq, accountSeq } = useParams<{ curSeq: string; accountSeq: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  // 과정 정보를 저장할 상태 추가
  const [courseInfo, setCourseInfo] = useState<any>(null);

  useEffect(() => {
    if (curSeq) {
      // 1. 학생 목록 가져오기
      axios.get(`/api/account/${curSeq}/students`)
        .then(res => {
          setStudents(res.data);
          // 2. 학생 목록 중 첫 번째 데이터나 서버 응답에서 과정 정보 추출
          if (res.data.length > 0) {
            const classData = res.data[0];
            // console.log("과정 정보:", classData);
            setCourseInfo({
              curName: classData.curName,
              className: classData.className || '1', // XML 결과에 따라 조정
              term: classData.term || '1',
              room: classData.room || '미정',
              startDate: classData.startDate || '미정',
              endDate: classData.endDate || '미정',
            });
          }
        })
        .catch(err => console.error("데이터 로딩 실패:", err));
    }
  }, [curSeq]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: 'calc(100vh - 120px)' }}>
      
      {/* 상단 경로 안내 및 과정 정보 헤더 */}
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 3, bgcolor: '#ffffff' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
        {/* 목록 이동 버튼 */}
        <Button 
            variant="text" 
            size="medium" 
            startIcon={<ArrowBackIcon sx={{ color: '#000000' }} />}
            onClick={() => navigate('/lms/dashboard')}
            sx={{ 
            mr: 0.5, 
            p: 0,
            minWidth: 'auto',
            '&:hover': { bgcolor: 'transparent', opacity: 0.7 } 
            }}
        >
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#000000' }}>
            목록
            </Typography>
        </Button>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center', bgcolor: '#000000', opacity: 0.2 }} />

        {/* 아이콘 및 카테고리 명칭 */}
        <SchoolIcon sx={{ fontSize: 22, color: '#000000' }} />
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#000000' }}>
            학생 관리
        </Typography>
        
        <ChevronRightIcon sx={{ color: '#000000', fontSize: 20, opacity: 0.5 }} />

        {/* 🔥 글자 크기 +2px 및 검정색 통일 섹션 */}
        {courseInfo ? (
            <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#000000' }}>
                {courseInfo.curName}
            </Typography>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 500, color: '#000000' }}>
                {courseInfo.room}호 ({courseInfo.term}기)
            </Typography>
            </Stack>
        ) : (
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 500, color: '#000000', opacity: 0.5 }}>
            과정 정보를 불러오는 중...
            </Typography>
        )}
        </Stack>
      </Paper>

      {/* 메인 컨텐츠 영역 (2단 구성) */}
      <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minHeight: 0 }}>
        
        {/* 왼쪽: 학생 리스트 */}
        <Paper sx={{ width: 280, display: 'flex', flexDirection: 'column', borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }} elevation={0}>
          <Box sx={{ p: 2, bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography fontSize={17} variant="subtitle2" fontWeight="bold">학생 명단</Typography>
            <Chip label={`${students.length}명`} size="medium" variant="outlined" sx={{ fontWeight: 700, height: 20, fontSize: '1.1rem' }} />
          </Box>
          <Divider />
          <List sx={{ flexGrow: 1, overflow: 'auto', py: 0 }}>
            {students.map((stu) => (
              <ListItemButton 
                key={stu.accountSeq}
                selected={Number(accountSeq) === stu.accountSeq}
                onClick={() => navigate(`/lms/management/${curSeq}/student/${stu.accountSeq}`)}
                sx={{ 
                  borderBottom: '1px solid #f1f5f9', 
                  py: 1.5,
                  '&.Mui-selected': { borderLeft: '4px solid #3b82f6' } 
                }}
              >
                <ListItemText
                  primary={stu.accountName}
                  secondary={`LMS ID : ${stu.accountId}`}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: Number(accountSeq) === stu.accountSeq ? 800 : 500,
                        color: Number(accountSeq) === stu.accountSeq ? 'primary.main' : 'text.primary',
                      },
                    },
                    secondary: { sx: { fontSize: '0.8rem' } }
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>

        {/* 오른쪽: 상세 정보 */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {accountSeq ? (
            <StudentDetailPage /> 
          ) : (
            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 3, border: '1px dashed #cbd5e1', bgcolor: '#fbfcfd' }} elevation={0}>
              <SchoolIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1, opacity: 0.5 }} />
              <Typography color="text.secondary" fontWeight={500}>학생을 선택하면 상세 관리 화면이 나타납니다.</Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LmsStudentManagement;