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
import MonthlyAttendanceChart from './MonthlyAttendanceChart';

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
  monthlyData: string;
  attList: Array<{
    attendanceDate: string;
    status: string;
    remark: string;
    startTime: string;
    endTime: string;
  }>;
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

  const isInactive = data.accountStatus === 'DROPOUT' || data.accountStatus === 'EARLYOUT';
  const statusLabel = data.accountStatus === 'DROPOUT' ? '중도탈락' : '수강철회';

  const getRateColor = (rate: number) => {
    if (isInactive) return '#94a3b8';
    if (rate >= 90) return '#10b981';
    if (rate >= 80) return '#3b82f6';
    return '#ef4444';
  };

  const StatBox = ({ icon, label, count, color }: any) => (
    <Paper variant="outlined" sx={{ p: 2.2, textAlign: 'center', borderRadius: 3, flex: 1 }}>
      <Box sx={{ color: isInactive ? '#94a3b8' : color, mb: 0.5 }}>{icon}</Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{label}</Typography>
      <Typography variant="h6" fontWeight={800} sx={{ fontSize: '1.4rem' }}>{count}회</Typography>
    </Paper>
  );

  return (
    <Box>
      {isInactive ? (
        <Alert severity="warning" icon={<InfoOutlinedIcon />} sx={{ mb: 3, borderRadius: 3, fontWeight: 700, fontSize: '1rem' }}>
          이 학생은 현재 [{statusLabel}] 상태입니다. 출석률은 산정 종료일({data.referenceDate}) 기준으로 계산되었습니다.
        </Alert>
      ) : (
        <Alert severity="success" icon={<CheckCircleOutlineIcon />} sx={{ mb: 3, borderRadius: 3, fontSize: '1rem', fontWeight: 600 }}>
          현재({data.referenceDate}) 기준 집계 중인 출석 현황입니다.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', border: isInactive ? '2px dashed #e2e8f0' : 'none' }}>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, mb: 1 }}>
              {isInactive ? `${statusLabel} 시점 출석률` : '실시간 출석률'}
            </Typography>
            
            <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
              <CircularProgress variant="determinate" value={100} size={180} thickness={5} sx={{ color: '#e2e8f0', position: 'absolute' }} />
              <CircularProgress 
                variant="determinate" 
                value={data.attendanceRate} 
                size={180} 
                thickness={5} 
                sx={{ 
                  color: getRateColor(data.attendanceRate), 
                  strokeLinecap: 'round',
                  transition: 'all 0.5s ease'
                }} 
              />
              <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', px: 1 }}>
                <Typography fontWeight={900} sx={{ color: getRateColor(data.attendanceRate), fontSize: '2rem', whiteSpace: 'nowrap', letterSpacing: '-0.5px' }}>
                  {data.attendanceRate.toFixed(2)}%
                </Typography>
                <Chip label={isInactive ? "산정 종료" : "정상 산정"} size="small" variant="outlined" sx={{ mt: 0.5, height: 22, fontSize: '0.75rem', fontWeight: 800 }} />
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1.5, fontSize: '0.95rem', lineHeight: 1.6 }}>
              누적 수업 일수: <strong style={{ color: '#334155' }}>{data.totalWorkingDays}일</strong><br />
              환산 결석 일수: <strong style={{ color: isInactive ? '#64748b' : '#ef4444', fontSize: '1rem' }}>{data.convertedAbsenceDays}일</strong>
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2} sx={{ height: '100%' }}>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 800 }}>항목별 상세 현황</Typography>
            <Stack direction="row" spacing={1.5}>
              <StatBox icon={<CancelOutlinedIcon sx={{ fontSize: '1.6rem' }} />} label="결석" count={data.absentCount} color="#ef4444" />
              <StatBox icon={<AccessTimeIcon sx={{ fontSize: '1.6rem' }} />} label="지각" count={data.lateCount} color="#f59e0b" />
            </Stack>
            <Stack direction="row" spacing={1.5}>
              <StatBox icon={<DirectionsWalkIcon sx={{ fontSize: '1.6rem' }} />} label="외출" count={data.outingCount} color="#3b82f6" />
              <StatBox icon={<ExitToAppIcon sx={{ fontSize: '1.6rem' }} />} label="조퇴" count={data.earlyCount} color="#8b5cf6" />
            </Stack>
            
            <Alert icon={<CheckCircleOutlineIcon fontSize="small" />} severity="info" sx={{ borderRadius: 3, mt: 'auto', '& .MuiAlert-message': { fontSize: '0.95rem' } }}>
              지각, 외출, 조퇴 합산 <strong>3회는 결석 1일</strong>로 환산됩니다.
            </Alert>
          </Stack>
        </Grid>
      </Grid>

      <MonthlyAttendanceChart monthlyData={data.monthlyData} />

      <Divider sx={{ my: 4 }} />

      <Box sx={{ p: 2.5, bgcolor: isInactive ? '#f1f5f9' : '#fffbeb', borderRadius: 3, border: '1px solid', borderColor: isInactive ? '#e2e8f0' : '#fef3c7' }}>
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.95rem', color: isInactive ? '#475569' : '#92400e', fontWeight: 600 }}>
          <WarningAmberIcon fontSize="small" /> 
          {isInactive ? "해당 학생은 학적 변동으로 인해 출석 관리 대상에서 제외되었습니다." : "출석률이 80% 미만일 경우 수당 지급에 제한이 있을 수 있으니 관리에 유의 바랍니다."}
        </Typography>
      </Box>

      <Box sx={{ mt: 5, mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 900 }}>출석 특이사항 목록</Typography>
          <Chip 
            label={data.attList?.length || 0} 
            size="small" 
            color="primary" 
            sx={{ fontWeight: 800, height: 24, fontSize: '0.85rem' }} 
          />
        </Stack>

        {data.attList && data.attList.length > 0 ? (
          <Stack spacing={1.8}>
            {data.attList.map((item, index) => {
              const statusConfig: any = {
                'ABSENT': { label: '결석', color: '#ef4444', bgColor: '#fef2f2', timeLabel: '사유 발생' },
                'LATE': { label: '지각', color: '#f59e0b', bgColor: '#fffbeb', timeLabel: '입실 시간' },
                'EARLY': { label: '조퇴', color: '#8b5cf6', bgColor: '#f5f3ff', timeLabel: '조퇴 시간' },
                'OUTING': { label: '외출', color: '#3b82f6', bgColor: '#eff6ff', timeLabel: '외출 시간' },
              };
              const config = statusConfig[item.status] || { label: item.status, color: '#64748b', bgColor: '#f8fafc', timeLabel: '시간' };
              const isAbsent = item.status === 'ABSENT';

              return (
                <Paper 
                  key={index} 
                  variant="outlined" 
                  sx={{ 
                    p: 2.5, 
                    borderRadius: 3, 
                    borderLeft: `5px solid ${config.color}`,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#f8fafc', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                  }}
                >
                    <Grid container alignItems="center" spacing={2}>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Typography sx={{ fontSize: '1.05rem', fontWeight: 800 }}>{item.attendanceDate}</Typography>
                                <Chip 
                                  label={config.label} 
                                  size="small" 
                                  sx={{ bgcolor: config.bgColor, color: config.color, fontWeight: 900, fontSize: '0.75rem', height: 22 }} 
                                />
                            </Stack>
                        </Grid>

                        {!isAbsent && (
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 700, fontSize: '0.8rem', mb: 0.3 }}>
                              {config.timeLabel}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: 'primary.main' }}>
                              {item.status === 'OUTING' 
                                ? `${item.startTime || '?'} ~ ${item.endTime || '?'}` 
                                : item.startTime || '기록없음'}
                            </Typography>
                        </Grid>
                        )}

                        <Grid size={{ xs: 12, sm: isAbsent ? 9 : 6 }}>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 700, fontSize: '0.8rem', mb: 0.3 }}>
                                비고(사유)
                            </Typography>
                            <Typography 
                                sx={{ 
                                  fontSize: '1rem',
                                  color: item.remark ? 'text.primary' : 'text.disabled', 
                                  fontStyle: item.remark ? 'normal' : 'italic',
                                  fontWeight: item.remark ? 600 : 400
                                }}
                            >
                                {item.remark || "등록된 사유가 없습니다."}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
              );
            })}
          </Stack>
        ) : (
          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 4, borderStyle: 'dashed', bgcolor: '#fcfcfc' }}>
             <Typography sx={{ fontSize: '1rem', color: 'text.secondary', fontWeight: 700 }}>출석 특이사항이 없습니다.</Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default AttendanceStatusView;