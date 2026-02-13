import PeopleIcon from "@mui/icons-material/People";
import PercentIcon from "@mui/icons-material/Percent";
import SchoolIcon from "@mui/icons-material/School";
import { 
  Box, CircularProgress, Grid, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Typography, MenuItem, Select, FormControl, InputLabel 
} from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";

import api from "../../api/axiosInstance";
import LmsDashboardRow from "./components/LmsDashboardRow";
import LmsStatCard from "./components/LmsStatCard";
import type { LmsDashboardData } from "./types/lmsDashboardType";

const LmsDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<LmsDashboardData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // 1. API 호출 함수 (year 파라미터 전달)
  const fetchData = async (year: string) => {
    setLoading(true);
    try {
      // "all"이면 파라미터 제외, 값이 있으면 ?year=2024 형태로 전달
      const params = year === "all" ? {} : { year };
      const res = await api.get("/api/lmsDashboard/stats", { params });
      
      setData(Array.isArray(res.data) ? res.data : []);
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
  const totalStudents = data.reduce((acc, curr) => acc + (curr.totalEnrolled || 0), 0);
  const activeStudents = data.reduce((acc, curr) => acc + (curr.activeAccounts || 0), 0);
  const avgRatio = data.length > 0 
    ? (data.reduce((acc, curr) => acc + (Number(curr.totalAvgRatio) || 0), 0) / data.length).toFixed(1) 
    : "0.0";

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
          LMS 교육과정 모니터링
        </Typography>

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
      </Box>

      {/* 요약 통계 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <LmsStatCard 
            title="누적 수강생" 
            value={`${totalStudents.toLocaleString()} 명`} 
            icon={<PeopleIcon sx={{ fontSize: 32 }} />} 
            color="#3b82f6" 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <LmsStatCard 
            title="현재 재학생" 
            value={`${activeStudents.toLocaleString()} 명`} 
            icon={<SchoolIcon sx={{ fontSize: 32 }} />} 
            color="#10b981" 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <LmsStatCard 
            title="전체 평균 이행률" 
            value={`${avgRatio} %`}
            icon={<PercentIcon sx={{ fontSize: 32 }} />} 
            color="#f59e0b" 
          />
        </Grid>
      </Grid>

      {/* 상세 리스트 테이블 */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", overflow: 'hidden' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell width="50px" sx={{ bgcolor: "#f8fafc" }} />
              <TableCell width="20%" sx={{ bgcolor: "#f8fafc", fontWeight: "bold" }}>과정 명 (기수)</TableCell>
              <TableCell width="15%" sx={{ bgcolor: "#f8fafc", fontWeight: "bold" }}>현재 인원 / 시작 인원</TableCell>
              <TableCell width="40%" sx={{ bgcolor: "#f8fafc", fontWeight: "bold" }}>과정 이행률</TableCell>
              {/* 버튼을 위한 빈 헤더 칸 추가 */}
              <TableCell width="20%" align="center" sx={{ bgcolor: "#f8fafc", fontWeight: "bold" }}>상세 현황</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                   <CircularProgress thickness={4} size={40} sx={{ color: '#1e293b' }} />
                   <Typography sx={{ mt: 2, color: '#64748b' }}>데이터를 불러오는 중...</Typography>
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <LmsDashboardRow key={`${item.className}-${index}`} row={item} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 10, color: '#94a3b8', fontSize: '1.1rem' }}>
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LmsDashboard;