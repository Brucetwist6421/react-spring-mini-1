import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Box, Card, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// 1. DB에서 내려오는 소문자 키값에 맞게 인터페이스 수정
interface MonthlyDataRaw {
  unitmonth: number;
  mstart: string;
  mend: string;
  mworkingdays: number;
  mrate: number;
}

interface Props {
  monthlyData: string;
}

const MonthlyAttendanceChart = ({ monthlyData }: Props) => {
  const theme = useTheme();

  // 2. 안전한 파싱 처리
  let stats: MonthlyDataRaw[] = [];
  try {
    if (typeof monthlyData === 'string') {
      stats = JSON.parse(monthlyData);
    } else {
      stats = monthlyData; // 이미 객체인 경우 대비
    }
  } catch (e) {
    console.error("Monthly Data Parsing Error:", e);
  }

  if (!stats || stats.length === 0) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <CalendarMonthIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={800}>회차별 출석 추이</Typography>
      </Stack>

      <Grid container spacing={2}>
        {/* 차트 영역 */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, height: 320, bgcolor: '#ffffff' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="unitmonth"  /* 소문자로 수정 */
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                  tickFormatter={(val) => `${val}회차`}
                />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip 
                    formatter={(value) => {
                        // value가 undefined일 수 있으므로 체크
                        if (value != null) {
                        return [`${Number(value).toFixed(1)}%`, '출석률'];
                        }
                        return ['0%', '출석률'];
                    }}
                    labelFormatter={(label) => `${label}회차`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="mrate" /* 소문자로 수정 */
                  stroke={theme.palette.primary.main} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRate)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 요약 카드 리스트 영역 */}
        <Grid size={{ xs: 12, lg: 4 }}>
            <Stack 
                spacing={1.2} 
                sx={{ 
                maxHeight: 320, 
                overflowY: 'auto', 
                pr: 1,
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#e2e8f0', borderRadius: '4px' }
                }}
            >
                {stats.map((item, idx) => {
                const isLowRate = item.mrate < 80;
                const rateColor = isLowRate ? '#ef4444' : '#10b981';

                return (
                    <Card 
                    key={idx} 
                    variant="outlined" 
                    sx={{ 
                        p: 1.5, 
                        borderRadius: 3, 
                        borderLeft: `6px solid ${rateColor}`,
                        bgcolor: '#ffffff',
                    }}
                    >
                    <Stack spacing={1}>
                        {/* 상단 레이어: 회차와 출석률을 큼직하게 배치 */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                            <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1.1rem' }}>
                            {item.unitmonth}달차
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            ({item.mworkingdays}일)
                            </Typography>
                        </Box>
                        
                        <Typography 
                            variant="h6" 
                            sx={{ 
                            fontWeight: 950, 
                            color: rateColor, 
                            fontSize: '1.2rem',
                            letterSpacing: '-0.5px'
                            }}
                        >
                            {Number(item.mrate).toFixed(1)}%
                        </Typography>
                        </Box>

                        {/* 하단 레이어: 날짜 정보를 한 줄로 깔끔하게 (폰트 크기 최적화) */}
                        <Box 
                        sx={{ 
                            bgcolor: '#f1f5f9', 
                            py: 0.5, 
                            px: 1.2, 
                            borderRadius: 1.5,
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                        >
                        <Typography 
                            sx={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 700, 
                            color: '#475569',
                            whiteSpace: 'nowrap'
                            }}
                        >
                            {item.mstart.substring(2)} ~ {item.mend.substring(2)}
                        </Typography>
                        </Box>
                    </Stack>
                    </Card>
                );
                })}
            </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MonthlyAttendanceChart;