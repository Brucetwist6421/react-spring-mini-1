import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Box, Card, Divider, Stack, Typography } from '@mui/material';

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
  // 1. 데이터 파싱
  let stats: MonthlyDataRaw[] = [];
  try {
    stats = typeof monthlyData === 'string' ? JSON.parse(monthlyData) : monthlyData;
  } catch (e) {
    console.error("Data Parsing Error:", e);
  }

  if (!stats || stats.length === 0) return null;

  // 2. 출석률에 따른 색상 및 상태 반환 함수
  const getRateStatus = (rate: number) => {
    if (rate >= 90) return { color: '#10b981', label: '우수', bgColor: '#ecfdf5' };
    if (rate >= 80) return { color: '#3b82f6', label: '양호', bgColor: '#eff6ff' };
    if (rate >= 60) return { color: '#f59e0b', label: '주의', bgColor: '#fffbeb' };
    return { color: '#ef4444', label: '위험', bgColor: '#fef2f2' };
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: 22 }} /> {/* 아이콘 크기 살짝 증가 */}
        <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary' }}>
          월 별 통계
        </Typography>
      </Stack>

      <Stack spacing={1.5}>
        {stats.map((item, idx) => {
          const status = getRateStatus(item.mrate);

          return (
            <Card
              key={idx}
              variant="outlined"
              sx={{
                p: 2.2, // 내부 패딩 소폭 증가
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2.5, // 요소 간 간격 넓힘
                transition: '0.2s',
                '&:hover': { bgcolor: '#f8fafc', borderColor: status.color },
              }}
            >
              {/* 왼쪽: 회차 정보 */}
              <Box sx={{ minWidth: 65, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1.35rem', lineHeight: 1.1 }}>
                  {item.unitmonth}개월
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem />

              {/* 중앙: 기간 및 수업일수 */}
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', mb: 0.5, color: '#1e293b' }}>
                  {item.mstart.substring(5)} ~ {item.mend.substring(5)}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.85rem' }}>
                  총 {item.mworkingdays}일 수업
                </Typography>
              </Box>

              {/* 오른쪽: 출석률 및 상태 */}
              <Box sx={{ textAlign: 'right', minWidth: 80 }}>
                <Typography 
                  sx={{ 
                    fontWeight: 950, 
                    color: status.color, 
                    fontSize: '1.35rem', // 출석률 강조
                    lineHeight: 1 
                  }}
                >
                  {Number(item.mrate).toFixed(2)}%
                </Typography>
                <Typography 
                  sx={{ 
                    fontWeight: 800, 
                    color: status.color,
                    fontSize: '0.8rem', // 상태 텍스트 크기 증가
                    mt: 0.2
                  }}
                >
                  {status.label}
                </Typography>
              </Box>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};

export default MonthlyAttendanceChart;