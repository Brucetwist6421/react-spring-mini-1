/* eslint-disable @typescript-eslint/no-explicit-any */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SchoolIcon from '@mui/icons-material/School';
import { Avatar, Box, Button, Chip, Divider, List, ListItemButton, Paper, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentDetailPage from "./StudentDetailPage";

const LmsStudentManagement = () => {
  const { curSeq, accountSeq } = useParams<{ curSeq: string; accountSeq: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [courseInfo, setCourseInfo] = useState<any>(null);

  // 1. 학생 상태 헬퍼 함수
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ENROLLED': return { label: '재학 중', color: 'success' as const, bgcolor: '#f0fdf4' };
      case 'DROPOUT': return { label: '중도 탈락', color: 'error' as const, bgcolor: '#fef2f2' };
      case 'EARLYOUT': return { label: '수강 철회', color: 'warning' as const, bgcolor: '#fffbeb' };
      case 'GRADUATED': return { label: '수료', color: 'primary' as const, bgcolor: '#eff6ff' };
      default: return { label: '기타', color: 'default' as const, bgcolor: '#f8fafc' };
    }
  };

  useEffect(() => {
    if (curSeq) {
      axios.get(`/api/account/${curSeq}/students`)
        .then(res => {
          setStudents(res.data);
          if (res.data.length > 0) {
            const classData = res.data[0];
            setCourseInfo({
              curName: classData.curName,
              className: classData.className || '1',
              term: classData.term || '1',
              room: classData.room || '미정',
            });
          }
        })
        .catch(err => console.error("데이터 로딩 실패:", err));
    }
  }, [curSeq]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: 'calc(100vh - 120px)' }}>
      
      {/* 상단 경로 안내 헤더 (생략 - 기존 유지) */}
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 3, bgcolor: '#ffffff' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Button 
            variant="text" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/lms/dashboard')}
            sx={{ fontWeight: 700, color: '#000000' }}
          >
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700 }}>목록</Typography>
          </Button>
          <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center' }} />
          <SchoolIcon sx={{ color: '#000000' }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700 }}>학생 관리</Typography>
          <ChevronRightIcon sx={{ opacity: 0.5 }} />
          {courseInfo && (
            <Stack direction="row" spacing={1}>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 800 }}>{courseInfo.curName}</Typography>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>{courseInfo.room}호 ({courseInfo.term}기)</Typography>
            </Stack>
          )}
        </Stack>
      </Paper>

      {/* 메인 컨텐츠 영역 */}
      <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minHeight: 0 }}>
        
        {/* 왼쪽: 학생 리스트 (UX 개선 버전) */}
        <Paper sx={{ width: 320, display: 'flex', flexDirection: 'column', borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }} elevation={0}>
          <Box sx={{ p: 2, bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography fontSize={16} fontWeight="800" color="#334155">수강생 명단</Typography>
            <Chip label={`${students.length}명`} size="small" sx={{ fontWeight: 700, bgcolor: '#e2e8f0' }} />
          </Box>
          <Divider />
          
          <List sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
            {students.map((stu) => {
              const status = getStatusConfig(stu.status);
              const isSelected = Number(accountSeq) === stu.accountSeq;

              return (
                <ListItemButton 
                  key={stu.accountSeq}
                  selected={isSelected}
                  onClick={() => navigate(`/lms/management/${curSeq}/student/${stu.accountSeq}`)}
                  sx={{ 
                    borderRadius: 2,
                    mb: 0.5,
                    py: 1.2,
                    transition: 'all 0.2s',
                    '&.Mui-selected': { 
                      bgcolor: '#eff6ff', 
                      borderLeft: '4px solid #3b82f6',
                      '&:hover': { bgcolor: '#dbeafe' }
                    },
                    '&:hover': { bgcolor: '#f1f5f9' }
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
                    {/* 프로필 사진 처리 영역 */}
                    <Avatar 
                      src={stu.mainImagePath 
                        ? `http://168.107.51.143:8080/upload/${encodeURIComponent(stu.mainImagePath)}` 
                        : `https://w7.pngwing.com/pngs/884/996/png-transparent-pingu-waiting-cartoons-pingu-thumbnail.png`
                      }
                      alt={stu.accountName}
                      sx={{ 
                        width: 40, // 가독성을 위해 크기를 살짝 키웠습니다 (32 -> 40)
                        height: 40, 
                        fontSize: '1rem', 
                        fontWeight: 700,
                        bgcolor: isSelected ? '#3b82f6' : '#e2e8f0',
                        color: isSelected ? '#ffffff' : '#64748b',
                        border: isSelected ? '2px solid #3b82f6' : 'none'
                      }}
                    >
                      {/* src가 null이거나 로드 실패 시 이름 첫 글자 표시 */}
                      {stu.accountName.charAt(0)}
                    </Avatar>
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontWeight: isSelected ? 800 : 600, fontSize: '1rem', color: isSelected ? '#1e40af' : '#1e293b' }}>
                          {stu.accountName}
                        </Typography>
                        <Chip 
                          label={status.label} 
                          size="small" 
                          color={status.color} 
                          variant="filled"
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }}
                        />
                      </Stack>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 0.2 }}>
                        ID: {stu.accountId}
                      </Typography>
                    </Box>
                  </Stack>
                </ListItemButton>
              );
            })}
          </List>
        </Paper>

        {/* 오른쪽: 상세 정보 (생략 - 기존 유지) */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {accountSeq ? <StudentDetailPage /> : (
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