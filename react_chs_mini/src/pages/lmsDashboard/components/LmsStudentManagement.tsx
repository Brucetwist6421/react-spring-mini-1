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
  const { curSeq, accSeq } = useParams<{ curSeq: string; accSeq: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  // 과정 정보를 저장할 상태 추가
  const [courseInfo, setCourseInfo] = useState<any>(null);

  useEffect(() => {
    if (curSeq) {
      // 1. 학생 목록 가져오기
      axios.get(`/api/curriculum/${curSeq}/students`)
        .then(res => {
          setStudents(res.data);
          // 2. 학생 목록 중 첫 번째 데이터나 서버 응답에서 과정 정보 추출
          if (res.data.length > 0) {
            const first = res.data[0];
            setCourseInfo({
              curName: first.curName,
              className: first.className || '1', // XML 결과에 따라 조정
              term: first.term || '1'
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
        <Stack direction="row" alignItems="center" spacing={1}>
            <Button 
              variant="text" 
              size="small" 
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/lms/dashboard')} // 대시보드 경로로 이동
              sx={{ mr: 1, fontWeight: 700, color: 'text.secondary' }}
            >
              목록으로
            </Button>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 20, alignSelf: 'center' }} />
          <SchoolIcon color="primary" fontSize="small" />
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            학생 관리
          </Typography>
          <ChevronRightIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
          {courseInfo ? (
            <Stack direction="row" spacing={1} alignItems="baseline">
              <Typography variant="h6" fontWeight={800} color="text.primary">
                {courseInfo.curName}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                {courseInfo.className}호 ({courseInfo.term}기)
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.disabled">과정 정보를 불러오는 중...</Typography>
          )}
        </Stack>
      </Paper>

      {/* 메인 컨텐츠 영역 (2단 구성) */}
      <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minHeight: 0 }}>
        
        {/* 왼쪽: 학생 리스트 */}
        <Paper sx={{ width: 280, display: 'flex', flexDirection: 'column', borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }} elevation={0}>
          <Box sx={{ p: 2, bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" fontWeight="bold">학생 명단</Typography>
            <Chip label={`${students.length}명`} size="small" variant="outlined" sx={{ fontWeight: 700, height: 20, fontSize: '0.7rem' }} />
          </Box>
          <Divider />
          <List sx={{ flexGrow: 1, overflow: 'auto', py: 0 }}>
            {students.map((stu) => (
              <ListItemButton 
                key={stu.accSeq}
                selected={Number(accSeq) === stu.accSeq}
                onClick={() => navigate(`/lms/management/${curSeq}/student/${stu.accSeq}`)}
                sx={{ 
                  borderBottom: '1px solid #f1f5f9', 
                  py: 1.5,
                  '&.Mui-selected': { borderLeft: '4px solid #3b82f6' } 
                }}
              >
                <ListItemText
                  primary={stu.accountName}
                  secondary={stu.accountId}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: Number(accSeq) === stu.accSeq ? 800 : 500,
                        color: Number(accSeq) === stu.accSeq ? 'primary.main' : 'text.primary',
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
          {accSeq ? (
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