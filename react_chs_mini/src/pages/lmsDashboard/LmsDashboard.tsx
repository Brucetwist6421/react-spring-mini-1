import PeopleIcon from "@mui/icons-material/People";
import PercentIcon from "@mui/icons-material/Percent";
import SchoolIcon from "@mui/icons-material/School";
import { Box, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import api from "../../api/axiosInstance";
import LmsDashboardRow from "./components/LmsDashboardRow";
import LmsStatCard from "./components/LmsStatCard";
import type { LmsDashboardData } from "./types/lmsDashboardType";

const LmsDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<LmsDashboardData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/lmsDashboard/stats");
        setData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
        setData([]); // 에러 시 빈 배열로 초기화
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 안전한 지표 계산 (방어 코드 추가) ---
  
  // data가 배열일 때만 reduce를 실행하도록 보장
  const safeData = Array.isArray(data) ? data : [];

  const totalStudents = safeData.reduce((acc, curr) => acc + (curr.totalEnrolled || 0), 0);
  const activeStudents = safeData.reduce((acc, curr) => acc + (curr.activeAccounts || 0), 0);
  
  const avgRatio = safeData.length > 0 
    ? (safeData.reduce((acc, curr) => acc + (Number(curr.totalAvgRatio) || 0), 0) / safeData.length).toFixed(1) 
    : "0.0";

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#333" }}>
        LMS 교육과정 모니터링
      </Typography>

      {/* 1. 요약 통계 카드 섹션 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <LmsStatCard 
            title="누적 수강생" 
            value={`${totalStudents}명`} 
            icon={<PeopleIcon />} 
            color="#1976d2" 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <LmsStatCard 
            title="현재 재학생" 
            value={`${activeStudents}명`} 
            icon={<SchoolIcon />} 
            color="#2e7d32" 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <LmsStatCard 
            title="전체 평균 이행률" 
            value={`${avgRatio}%`} 
            icon={<PercentIcon />} 
            color="#ed6c02" 
          />
        </Grid>
      </Grid>

      {/* 2. 상세 리스트 테이블 섹션 */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell width="60px" sx={{ bgcolor: "#f5f5f5" }} />
              <TableCell sx={{ bgcolor: "#f5f5f5", fontWeight: "bold" }}>과정명(기수) / 교육기간</TableCell>
              <TableCell align="center" sx={{ bgcolor: "#f5f5f5", fontWeight: "bold" }}>기수</TableCell>
              <TableCell align="center" sx={{ bgcolor: "#f5f5f5", fontWeight: "bold" }}>현재인원/시작인원</TableCell>
              <TableCell align="right" sx={{ bgcolor: "#f5f5f5", fontWeight: "bold" }}>과정 이행률</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safeData.map((item, index) => (
              <LmsDashboardRow key={`${item.className}-${index}`} row={item} />
            ))}
            {safeData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  조회된 데이터가 없습니다.
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