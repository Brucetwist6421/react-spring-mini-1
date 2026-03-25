import React, { useEffect, useState } from "react";
// MUI v6 Grid2 사양
import Grid from "@mui/material/Grid";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
// 날짜 선택을 위한 라이브러리 (npm install @mui/x-date-pickers dayjs 필요)
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import api from "../../../api/axiosInstance";

interface AttendanceStats {
  totalStudents: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  earlyCount: number;
  outingCount: number;
  officialCount: number;
  yetToArriveCount: number;
}

const AttendanceTodayCard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const fetchAttendance = async (dateStr: string) => {
    setLoading(true);
    try {
      const res = await api.get("/api/lmsDashboard/attendance-today", {
        params: { date: dateStr }
      });
      setStats(res.data);
    } catch (err) {
      console.error("출석 통계 로딩 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedDate.isValid()) {
      fetchAttendance(selectedDate.format("YYYY-MM-DD"));
    }
  }, [selectedDate]);

  const statusItems = [
    { label: "정상", count: stats?.presentCount || 0, color: "#10b981", bgColor: "#f0fdf4" },
    { label: "지각", count: stats?.lateCount || 0, color: "#f59e0b", bgColor: "#fffbeb" },
    { label: "결석", count: stats?.absentCount || 0, color: "#ef4444", bgColor: "#fef2f2" },
    { label: "조퇴", count: stats?.earlyCount || 0, color: "#8b5cf6", bgColor: "#f5f3ff" },
    { label: "외출", count: stats?.outingCount || 0, color: "#3b82f6", bgColor: "#eff6ff" },
    { label: "공결", count: stats?.officialCount || 0, color: "#64748b", bgColor: "#f8fafc" },
  ];

  return (
    <Paper sx={{ 
      p: 3.5, 
      borderRadius: 3, 
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
      border: "1px solid #e2e8f0",
      bgcolor: "white"
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: "#1e293b", lineHeight: 1.2 }}>
            실시간 출석 현황
          </Typography>
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="조회 날짜"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{ 
                textField: { 
                  size: 'small', 
                  sx: { width: 180, '& .MuiInputBase-root': { borderRadius: 2 } } 
                } 
              }}
              maxDate={dayjs()} 
            />
          </LocalizationProvider>
        </Box>

        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: "#475569" }}>
          대상 인원 <Box component="span" sx={{ color: '#1e293b', fontSize: '1.25rem', ml: 0.5 }}>{stats?.totalStudents || 0}</Box> 명
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ py: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={40} sx={{ color: '#1e293b' }} />
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {statusItems.map((item) => (
            <Grid size={{ xs: 4, sm: 2 }} key={item.label}>
              <Box sx={{ 
                textAlign: 'center', py: 2.5, borderRadius: 3, bgcolor: item.bgColor,
                border: `1px solid ${item.color}35`,
                transition: 'all 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 4px 12px -2px ${item.color}20` }
              }}>
                <Typography sx={{ color: '#64748b', fontWeight: 700, fontSize: '1.05rem', mb: 0.8 }}>
                  {item.label}
                </Typography>
                <Typography sx={{ color: item.color, fontWeight: 900, fontSize: '1.75rem', lineHeight: 1 }}>
                  {item.count}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

export default AttendanceTodayCard;