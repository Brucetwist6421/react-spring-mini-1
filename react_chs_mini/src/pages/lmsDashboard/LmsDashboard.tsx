import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // 수강 철회용
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd"; // 재학 중용
import PersonOffIcon from "@mui/icons-material/PersonOff"; // 중도 탈락용
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import {
  Box, Button, CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

import api from "../../api/axiosInstance";
import LmsDashboardRow from "./components/LmsDashboardRow";
import LmsStatCard from "./components/LmsStatCard";
import type { LmsDashboardData } from "./types/lmsDashboardType";
import CurriculumAddModal from "./components/CurriculumAddModal";
import AttendanceTodayCard from "./components/AttendanceTodayCard";

const LmsDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<LmsDashboardData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [myClassOnly, setMyClassOnly] = useState<boolean>(false);

  // ✅ 1. 출석 카드를 위한 독립적인 트리거 상태 추가
  const [attendanceTrigger, setAttendanceTrigger] = useState(0);

  // ✅ 2. 전체 데이터를 새로고침하면서 출석 카드도 같이 찌르는 통합 함수
  const refreshAll = () => {
    fetchData(selectedYear); // 기존 리스트 새로고침
    setAttendanceTrigger(prev => prev + 1); // 출석 카드 리렌더링 유도
  };

  // 1. API 호출 함수 (year 파라미터 전달)
  const fetchData = async (year: string) => {
    setLoading(true);
    try {
      // "all"이면 파라미터 제외, 값이 있으면 ?year=2024 형태로 전달
      const params = year === "all" ? {} : { year };
      const res = await api.get("/api/lmsDashboard/stats", { params });
      
      setData(Array.isArray(res.data) ? res.data : []);
      // console.log("API 응답 데이터:", res.data);
    } catch (err) {
      console.error("데이터 로딩 실패:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // 2. 초기 렌더링 및 selectedYear가 바뀔 때마다 API 호출
  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  // 3. 연도 목록 (이전과 동일하게 현재 데이터 기준 혹은 고정값 사용 가능)
  // API 방식에서는 보통 고정된 최근 연도 리스트를 제공하거나 별도 API로 연도 목록을 받아옵니다.
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [
      currentYear.toString(),
      (currentYear - 1).toString(),
      (currentYear - 2).toString(),
      (currentYear - 3).toString()
    ];
  }, []);

  // 4. 통계 데이터 계산 (API로 받아온 data 기준)
  const stats = useMemo(() => {
    return data.reduce((acc, curr) => ({
      active: acc.active + (curr.activeAccounts || 0),
      dropout: acc.dropout + (curr.dropoutCount || 0),
      earlyout: acc.earlyout + (curr.earlyoutCount || 0),
      graduated: acc.graduated + (curr.graduatedCount || 0),
      total: acc.total + (curr.totalEnrolled || 0)
    }), { active: 0, dropout: 0, earlyout: 0, graduated: 0, total: 0 });
  }, [data]);

  const avgRatio = data.length > 0 
    ? (data.reduce((acc, curr) => acc + (Number(curr.totalAvgRatio) || 0), 0) / data.length).toFixed(1) 
    : "0.0";

  const myAccSeq = useMemo(() => {
    const userInfo = localStorage.getItem("userInfo"); // 혹은 저장하신 키값
    if (!userInfo) return null;
    try {
      return JSON.parse(userInfo).accSeq;
    } catch {
      return null;
    }
  }, []);

  // 5. 내 과정만 보기 필터링 (선택적)
  const filteredData = useMemo(() => {
    if (!myClassOnly) return data;
    
    // 데이터 객체 내에 교수님의 식별값(예: teacherId)이 있다고 가정
    return data.filter(item => item.accountSeq === myAccSeq); 
  }, [data, myClassOnly, myAccSeq]);

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
          LMS 교육과정 모니터링
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="year-select-label">연도 선택</InputLabel>
            <Select
              labelId="year-select-label"
              value={selectedYear}
              label="연도 선택"
              onChange={(e) => setSelectedYear(e.target.value)}
              sx={{ borderRadius: 2, bgcolor: 'white' }}
            >
              <MenuItem value="all">전체보기</MenuItem>
              {availableYears.map(year => (
                <MenuItem key={year} value={year}>{year}년</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch 
                checked={myClassOnly} 
                onChange={(e) => setMyClassOnly(e.target.checked)} 
                color="primary"
              />
            }
            label="내 담당 과정만 보기"
            sx={{ 
              ml: 1, 
              '& .MuiFormControlLabel-label': { fontWeight: 600, fontSize: '0.9rem' } 
            }}
          />
        </Box>
      </Box>

      {/* 요약 통계 카드 섹션 */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* 1. 전체 누적 학생 수 */}
        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}> {/* 5개를 한 줄에 배치하기 위해 12 / 5 = 2.4 적용 */}
          <LmsStatCard 
            title="누적 학생 수" 
            value={`${stats.total.toLocaleString()} 명`} 
            icon={<PeopleIcon sx={{ fontSize: 30 }} />} 
            color="#64748b" // Slate Gray
            subtitle="전체 등록 인원"
          />
        </Grid>

        {/* 2. 재학 중 */}
        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
          <LmsStatCard 
            title="재학 중" 
            value={`${stats.active.toLocaleString()} 명`} 
            icon={<PersonAddIcon sx={{ fontSize: 30 }} />} 
            color="#10b981" 
            subtitle="현재 교육 참여"
          />
        </Grid>
        
        {/* 3. 중도 탈락 */}
        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
          <LmsStatCard 
            title="중도 탈락" 
            value={`${stats.dropout.toLocaleString()} 명`} 
            icon={<PersonOffIcon sx={{ fontSize: 30 }} />} 
            color="#ef4444" 
            subtitle="미수료 탈락자"
          />
        </Grid>
        
        {/* 4. 수강 철회 */}
        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
          <LmsStatCard 
            title="수강 철회" 
            value={`${stats.earlyout.toLocaleString()} 명`} 
            icon={<ExitToAppIcon sx={{ fontSize: 30 }} />} 
            color="#f59e0b" 
            subtitle="개강 전후 포기"
          />
        </Grid>

        {/* 5. 수료 */}
        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
          <LmsStatCard 
            title="수료" 
            value={`${stats.graduated.toLocaleString()} 명`} 
            icon={<SchoolIcon sx={{ fontSize: 30 }} />} 
            color="#3b82f6" 
            subtitle="누적 수료생 총계"
          />
        </Grid>
      </Grid>

      {/* 이행률 표시 */}
      <Paper sx={{ p: 2, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8fafc', borderRadius: 3, border: '1px dashed #cbd5e1' }}>
         {/* <PercentIcon sx={{ color: '#64748b', mr: 1 }} /> */}
         <Typography variant="body1" sx={{ color: '#475569', fontWeight: 600 }}>
            선택된 연도 전체 학생 LMS 시험 이행률 평균: <span style={{ color: '#f59e0b', fontSize: '1.2rem' }}>{avgRatio}%</span>
         </Typography>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <AttendanceTodayCard refreshTrigger={attendanceTrigger} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1.5, px: 0.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155' }}>
          교육과정 목록
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          sx={{
            bgcolor: "#1e293b",
            color: "white",
            px: 2.5,
            py: 0.8,
            borderRadius: 2,
            fontWeight: 700,
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "#334155",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
            }
          }}
        >
          과정 추가
        </Button>
      </Box>

      {/* 상세 리스트 테이블 */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", overflow: 'hidden' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell width="50px" sx={{ bgcolor: "#f8fafc" }} />
              <TableCell width="20%" sx={{ bgcolor: "#f8fafc", fontWeight: "bold" }}>과정 명 (기수)</TableCell>
              <TableCell width="7%" sx={{ bgcolor: "#f8fafc", fontWeight: "bold" }}>담당 교수</TableCell>
              <TableCell width="12%" sx={{ bgcolor: "#f8fafc", fontWeight: "bold" }}>현재 인원 / 시작 인원</TableCell>
              <TableCell width="20%" sx={{ bgcolor: "#f8fafc", fontWeight: "bold" }}>과정 이행률</TableCell>
              <TableCell width="40%" align="center" sx={{ bgcolor: "#f8fafc", fontWeight: "bold" }}>기능</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                   <CircularProgress thickness={4} size={40} sx={{ color: '#1e293b' }} />
                   <Typography sx={{ mt: 2, color: '#64748b' }}>데이터를 불러오는 중...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <LmsDashboardRow 
                  key={`${item.className}-${index}`} 
                  row={item} 
                  // ✅ 4. 자식에게 통합 새로고침 함수 전달
                  onRefresh={refreshAll} 
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10, color: '#94a3b8', fontSize: '1.1rem' }}>
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 과정 추가 모달 영역 */}
      <CurriculumAddModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSuccess={refreshAll}
      />
    </Box>
  );
};

export default LmsDashboard;