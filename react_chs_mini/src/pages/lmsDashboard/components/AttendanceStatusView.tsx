/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Box, CircularProgress, Divider, Paper, Stack, Typography, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { useEffect, useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface AttendanceData {
  totalWorkingDays: number;
  absentCount: number;
  lateCount: number;
  outingCount: number;
  earlyCount: number;
  convertedAbsenceDays: number;
  attendanceRate: number;
  accountStatus: string; 
  referenceDate: string; 
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

  // 상태별 텍스트 매핑
  const isInactive = data.accountStatus === 'DROPOUT' || data.accountStatus === 'EARLYOUT';
  const statusLabel = data.accountStatus === 'DROPOUT' ? '중도탈락' : '수강철회';

  const getRateColor = (rate: number) => {
    if (isInactive) return '#94a3b8'; // 탈락/철회자는 회색으로 표시 (UX 차별화)
    if (rate >= 90) return '#10b981';
    if (rate >= 80) return '#3b82f6';
    return '#ef4444';
  };

  const StatBox = ({ icon, label, count, color }: any) => (
    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 3, flex: 1 }}>
      <Box sx={{ color: isInactive ? '#94a3b8' : color, mb: 0.5 }}>{icon}</Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{label}</Typography>
      <Typography variant="h6" fontWeight={800}>{count}회</Typography>
    </Paper>
  );

  return (
    <Box>
      {/* 1. 상태별 안내 문구 추가 */}
      {isInactive ? (
        <Alert severity="warning" icon={<InfoOutlinedIcon />} sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}>
          이 학생은 현재 [{statusLabel}] 상태입니다. 출석률은 산정 종료일({data.referenceDate}) 기준으로 계산되었습니다.
        </Alert>
      ) : (
        <Alert severity="success" icon={<CheckCircleOutlineIcon />} sx={{ mb: 3, borderRadius: 3 }}>
          현재({data.referenceDate}) 기준 정상 집계 중인 출석 현황입니다.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', border: isInactive ? '2px dashed #e2e8f0' : 'none' }}>
            <Typography variant="subtitle1" fontWeight={800} gutterBottom>
              {isInactive ? `${statusLabel} 시점 출석률` : '실시간 출석률'}
            </Typography>
            
            <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
              <CircularProgress variant="determinate" value={100} size={170} thickness={5} sx={{ color: '#e2e8f0', position: 'absolute' }} />
              <CircularProgress 
                variant="determinate" 
                value={data.attendanceRate} 
                size={170} 
                thickness={5} 
                sx={{ 
                  color: getRateColor(data.attendanceRate), 
                  strokeLinecap: 'round',
                  transition: 'all 0.5s ease'
                }} 
              />
              
              <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', px: 1 }}>
                <Typography variant="h5" fontWeight={900} sx={{ color: getRateColor(data.attendanceRate), whiteSpace: 'nowrap', letterSpacing: '-0.5px' }}>
                  {data.attendanceRate.toFixed(2)}%
                </Typography>
                <Chip label={isInactive ? "산정 종료" : "정상 산정"} size="small" variant="outlined" sx={{ mt: 0.5, height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
              누적 수업 일수: <strong>{data.totalWorkingDays}일</strong><br />
              환산 결석 일수: <strong style={{ color: isInactive ? '#64748b' : '#ef4444' }}>{data.convertedAbsenceDays}일</strong>
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2} sx={{ height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={800}>항목별 상세 현황</Typography>
            <Stack direction="row" spacing={1.5}>
              <StatBox icon={<CancelOutlinedIcon />} label="결석" count={data.absentCount} color="#ef4444" />
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

      <Box sx={{ p: 2, bgcolor: isInactive ? '#f1f5f9' : '#fffbeb', borderRadius: 3, border: '1px solid', borderColor: isInactive ? '#e2e8f0' : '#fef3c7' }}>
        <Typography variant="body2" color={isInactive ? '#475569' : '#92400e'} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon fontSize="small" /> 
          {isInactive ? "해당 학생은 학적 변동으로 인해 출석 관리 대상에서 제외되었습니다." : "출석률이 80% 미만일 경우 수당 지급에 제한이 있을 수 있으니 관리에 유의 바랍니다."}
        </Typography>
      </Box>
    </Box>
  );
};

export default AttendanceStatusView;