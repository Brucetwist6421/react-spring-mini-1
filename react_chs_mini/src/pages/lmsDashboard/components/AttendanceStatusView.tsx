/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Box, CircularProgress, Divider, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid'; // 프로젝트 설정에 맞춰 Grid2를 권장함
import axios from 'axios';
import { useEffect, useState } from 'react';

// 아이콘 임포트 (WarningAmber 포함)
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; // 누락되었던 아이콘 추가

interface AttendanceData {
  totalWorkingDays: number;
  absentCount: number;
  lateCount: number;
  outingCount: number;
  earlyCount: number;
  convertedAbsenceDays: number;
  attendanceRate: number;
}

const AttendanceStatusView = ({ accountSeq }: { accountSeq: number }) => {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accountSeq) {
      axios.get(`/api/attendance/status/${accountSeq}`)
        .then(res => {
          setData(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("출석 데이터 로딩 실패:", err);
          setLoading(false);
        });
    }
  }, [accountSeq]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  if (!data) return <Alert severity="info">출석 데이터가 존재하지 않습니다.</Alert>;

  const getRateColor = (rate: number) => {
    if (rate >= 90) return '#10b981';
    if (rate >= 80) return '#3b82f6';
    return '#ef4444';
  };

  const StatBox = ({ icon, label, count, color }: any) => (
    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 3, flex: 1 }}>
      <Box sx={{ color, mb: 0.5 }}>{icon}</Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{label}</Typography>
      <Typography variant="h6" fontWeight={800}>{count}회</Typography>
    </Paper>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        {/* item 속성을 제거하고 size 속성(Grid2 방식) 혹은 기본 Grid 방식으로 조정 */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={800} gutterBottom>실시간 출석률</Typography>
            <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
              <CircularProgress 
                variant="determinate" 
                value={data.attendanceRate} 
                size={160} 
                thickness={5} 
                sx={{ color: getRateColor(data.attendanceRate), strokeLinecap: 'round' }} 
              />
              <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: getRateColor(data.attendanceRate) }}>
                  {data.attendanceRate}%
                </Typography>
                <Typography variant="caption" color="text.secondary">기준일 대비</Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
              총 수업 가능 일수: <strong>{data.totalWorkingDays}일</strong><br />
              환산 결석 일수: <strong style={{ color: '#ef4444' }}>{data.convertedAbsenceDays}일</strong>
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2} sx={{ height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={800}>항목별 상세 현황</Typography>
            <Stack direction="row" spacing={1.5}>
              <StatBox icon={<CancelOutlinedIcon />} label="실제 결석" count={data.absentCount} color="#ef4444" />
              <StatBox icon={<AccessTimeIcon />} label="지각" count={data.lateCount} color="#f59e0b" />
            </Stack>
            <Stack direction="row" spacing={1.5}>
              <StatBox icon={<DirectionsWalkIcon />} label="외출" count={data.outingCount} color="#3b82f6" />
              <StatBox icon={<ExitToAppIcon />} label="조퇴" count={data.earlyCount} color="#8b5cf6" />
            </Stack>
            
            <Alert icon={<CheckCircleOutlineIcon fontSize="inherit" />} severity="info" sx={{ borderRadius: 3, mt: 'auto' }}>
              지각, 외출, 조퇴 합산 <strong>3회는 결석 1일</strong>로 환산됩니다.
            </Alert>
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ p: 2, bgcolor: '#fffbeb', borderRadius: 3, border: '1px solid #fef3c7' }}>
        <Typography variant="body2" color="#92400e" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon fontSize="small" /> 
          출석률이 80% 미만일 경우 수당 지급에 제한이 있을 수 있으니 관리에 유의 바랍니다.
        </Typography>
      </Box>
    </Box>
  );
};

// export 추가
export default AttendanceStatusView;