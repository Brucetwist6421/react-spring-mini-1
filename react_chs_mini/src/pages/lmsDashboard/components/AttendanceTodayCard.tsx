import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
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

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/api/lmsDashboard/attendance-today");
      setStats(res.data);
    } catch (err) {
      console.error("출석 통계 로딩 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) return (
    <Paper sx={{ p: 5, display: 'flex', justifyContent: 'center', borderRadius: 3 }}>
      <CircularProgress size={35} sx={{ color: '#1e293b' }} />
    </Paper>
  );
  if (!stats) return null;

  const statusItems = [
    { label: "정상", count: stats.presentCount, color: "#10b981", bgColor: "#f0fdf4" },
    { label: "지각", count: stats.lateCount, color: "#f59e0b", bgColor: "#fffbeb" },
    { label: "결석", count: stats.absentCount, color: "#ef4444", bgColor: "#fef2f2" },
    { label: "조퇴", count: stats.earlyCount, color: "#8b5cf6", bgColor: "#f5f3ff" },
    { label: "외출", count: stats.outingCount, color: "#3b82f6", bgColor: "#eff6ff" },
    { label: "공결", count: stats.officialCount, color: "#64748b", bgColor: "#f8fafc" },
  ];

  return (
    <Paper sx={{ 
      p: 3.5, // 전체 여백 살짝 증가
      borderRadius: 3, 
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
      border: "1px solid #e2e8f0",
      bgcolor: "white"
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
        <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: "#1e293b", lineHeight: 1.2 }}>
            실시간 출석 현황 -
          <Box component="span" sx={{ fontWeight: 600, fontSize: '1.2rem', color: '#64748b', ml: 1 }}>
            {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
          </Box>
        </Typography>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: "#475569" }}>
          대상 인원 <Box component="span" sx={{ color: '#1e293b', fontSize: '1.25rem', ml: 0.5 }}>{stats.totalStudents}</Box> 명
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {statusItems.map((item) => (
          <Grid size={{ xs: 4, sm: 2 }} key={item.label}>
            <Box sx={{ 
              textAlign: 'center', 
              py: 2.5, // 높이감 확보를 위한 패딩 증가
              borderRadius: 3, 
              bgcolor: item.bgColor,
              border: `1px solid ${item.color}35`,
              transition: 'all 0.2s ease-in-out',
              '&:hover': { 
                transform: 'translateY(-3px)',
                boxShadow: `0 4px 12px -2px ${item.color}20`
              }
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

      {stats.yetToArriveCount > 0 && (
        <Box sx={{ mt: 2.5, textAlign: 'right' }}>
          <Typography sx={{ 
            color: '#ef4444', 
            fontWeight: 800, 
            fontSize: '0.95rem',
            bgcolor: '#fef2f2', 
            px: 1.5, 
            py: 0.8, 
            borderRadius: 1.5,
            display: 'inline-block',
            border: '1px solid #fee2e2'
          }}>
            ● 미입실(기록 대기): {stats.yetToArriveCount}명
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default AttendanceTodayCard;