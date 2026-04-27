/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box, Card, CardContent,
  Checkbox,
  FormControl,
  FormControlLabel, FormGroup,
  Grid // Grid v6(Grid2) 사용 권장
  ,
  InputLabel, MenuItem, Select,
  Stack, Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend, Line,
  ReferenceLine,
  ResponsiveContainer,
   XAxis, YAxis
} from 'recharts';
import api from '../../api/axiosInstance';
import RandomSpinner from '../../components/RandomSpinner';

import { Tooltip as MuiTooltip } from '@mui/material';
import { Tooltip as ChartTooltip } from 'recharts'; // 차트 내부는 이걸로 변경

interface FundamentalData {
  per: number;
  pbr: number;
  eps: number;
  div: number;
}

interface StockResponse {
  symbol: string;
  history: { [key: string]: number };
  prediction: { 
    [key: string]: { value: number; lower: number; upper: number } 
  };
  fundamental: FundamentalData;
  volume: { [key: string]: number };
  indicators: { rsi: { [key: string]: number } };
  investors: {
    dates: string[];
    foreign: number[];
    institution: number[];
  };
  error?: string;
}

interface ChartDataItem {
  date: string;
  actual?: number | null;
  predict?: number | null;
  predictRange?: [number, number] | null;
  volume?: number | null;
  rsi?: number | null;
  foreign: number;
  institution: number;
}

const StockChartPage: React.FC = () => {
  const stockCode = "005930";
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [fundamental, setFundamental] = useState<FundamentalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("3mo");
  const [predictDays, setPredictDays] = useState<number>(15);

  const [showVolume, setShowVolume] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [showInvestors, setShowInvestors] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get<StockResponse>(
          `/api/stock/${stockCode}?period=${period}&predict_days=${predictDays}`
        );

        if (response.data.error) {
          setError(response.data.error);
          return;
        }

        const { history, prediction, volume, indicators, investors, fundamental: fundData } = response.data;
        setFundamental(fundData);

        const allDates = Array.from(
          new Set([...Object.keys(history), ...Object.keys(prediction)])
        ).sort();

        const combinedData: ChartDataItem[] = allDates.map((date) => {
          const investorIdx = investors?.dates.indexOf(date);
          const predData = prediction[date];
          let validPredict = null;
          let validRange: [number, number] | null = null;

          if (predData) {
            const val = typeof predData === 'object' ? predData.value : predData;
            validPredict = val > 0 ? Math.round(val) : null;
            if (typeof predData === 'object') {
              validRange = [Math.round(predData.lower), Math.round(predData.upper)];
            }
          }

          return {
            date,
            actual: history[date] !== undefined ? Math.round(history[date]) : null,
            predict: validPredict,
            predictRange: validRange,
            volume: volume?.[date] ?? 0,
            rsi: indicators?.rsi?.[date] ?? null,
            foreign: (investorIdx !== -1 && investors) ? investors.foreign[investorIdx] : 0,
            institution: (investorIdx !== -1 && investors) ? investors.institution[investorIdx] : 0,
          };
        });

        setChartData(combinedData);
      } catch (err) {
        console.error("Error fetching stock data:", err);
        setError("서버 연결에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [stockCode, period, predictDays]);

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          
          {/* 상단 컨트롤러 */}
          <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>📈 주식 종합 지표 및 AI 예측</Typography>
              <Typography variant="body2" color="text.secondary">삼성전자({stockCode})</Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <FormGroup row>
                <FormControlLabel control={<Checkbox checked={showVolume} onChange={e => setShowVolume(e.target.checked)} color="secondary" />} label="거래량" />
                <FormControlLabel control={<Checkbox checked={showRSI} onChange={e => setShowRSI(e.target.checked)} color="error" />} label="RSI" />
                <FormControlLabel control={<Checkbox checked={showInvestors} onChange={e => setShowInvestors(e.target.checked)} color="success" />} label="수급" />
              </FormGroup>

              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>조회기간</InputLabel>
                <Select value={period} label="조회기간" onChange={(e) => setPeriod(e.target.value)}>
                  <MenuItem value="1mo">1개월</MenuItem>
                  <MenuItem value="3mo">3개월</MenuItem>
                  <MenuItem value="6mo">6개월</MenuItem>
                  <MenuItem value="1y">1년</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>예측일</InputLabel>
                <Select 
                  value={predictDays} 
                  label="예측일" 
                  onChange={(e) => setPredictDays(Number(e.target.value))} // setPredictDays 활성화
                >
                  <MenuItem value={5}>5일</MenuItem>
                  <MenuItem value={15}>15일</MenuItem>
                  <MenuItem value={30}>30일</MenuItem>
                  <MenuItem value={60}>60일</MenuItem>
                  <MenuItem value={90}>90일</MenuItem>
                  <MenuItem value={120}>120일</MenuItem>
                  <MenuItem value={150}>150일</MenuItem>
                  <MenuItem value={180}>180일</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>

          {/* 기본적 분석 지표 (PER, PBR 등) */}
          {!loading && fundamental && (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { 
                label: 'PER', 
                value: fundamental.per, 
                unit: '배', 
                color: '#1976d2',
                desc: '주가수익비율: 현재 주가를 주당순이익(EPS)으로 나눈 값입니다. 낮을수록 저평가된 것으로 봅니다.' 
              },
              { 
                label: 'PBR', 
                value: fundamental.pbr, 
                unit: '배', 
                color: '#388e3c',
                desc: '주가순자산비율: 주가를 주당순자산가치(BPS)로 나눈 값입니다. 1배 미만이면 청산가치보다 주가가 낮음을 의미합니다.' 
              },
              { 
                label: 'EPS', 
                value: fundamental.eps, 
                unit: '원', 
                color: '#7b1fa2',
                desc: '주당순이익: 기업이 벌어들인 순이익을 발행 주식 수로 나눈 값입니다. 높을수록 경영 실적이 좋음을 의미합니다.' 
              },
              { 
                label: '배당수익률', 
                value: fundamental.div, 
                unit: '%', 
                color: '#f57c00',
                desc: '주가 대비 배당금의 비율입니다. 현재 주가로 주식을 샀을 때 기대할 수 있는 배당 수익을 나타냅니다.' 
              },
            ].map((item, idx) => (
              <Grid key={idx} size={{ xs: 6, sm: 3 }}>
                {/* Tooltip을 감싸 호버 시 desc를 보여줍니다 */}
                <MuiTooltip 
                  title={item.desc} 
                  arrow 
                  placement="top"
                  enterTouchDelay={0} // 모바일에서도 바로 뜨게 설정
                  // 💡 툴팁 내부 글자 크기 및 스타일 수정
                  slotProps={{
                    tooltip: {
                      sx: {
                        fontSize: '0.85rem',      // 글자 크기 확대 (기본은 매우 작음)
                        lineHeight: 1.5,          // 줄 간격 조절로 가독성 향상
                        bgcolor: 'rgba(50, 50, 50, 0.95)', // 배경색을 좀 더 진하게
                        px: 1.5,                  // 좌우 여백
                        py: 1,                    // 상하 여백
                        maxWidth: 250,            // 툴팁 최대 너비 제한 (줄바꿈 최적화)
                        borderRadius: 2,          // 모서리 둥글게
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      },
                    },
                    arrow: {
                      sx: {
                        color: 'rgba(50, 50, 50, 0.95)',
                      },
                    },
                  }}
                >
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: '#fff', 
                    borderRadius: 3, 
                    border: '1px solid #edf2f7',
                    borderLeft: `4px solid ${item.color}`, 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    cursor: 'help', // 마우스 포인터를 물음표 모양으로 변경
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }
                  }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
                      {item.label}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {item.value?.toLocaleString() ?? '0'}
                      <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>{item.unit}</Typography>
                    </Typography>
                  </Box>
                </MuiTooltip>
              </Grid>
            ))}
          </Grid>
        )}

          {/* 차트 영역 */}
          <Box sx={{ width: '100%', height: 550 }}>
            {loading ? (
              <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }}><RandomSpinner /></Stack>
            ) : error ? (
              <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }}><Typography color="error">{error}</Typography></Stack>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} minTickGap={20} />
                  
                  <YAxis 
                    yAxisId="left"
                    orientation="left" 
                    domain={['dataMin - 2000', 'dataMax + 2000']}
                    tickFormatter={(val) => val.toLocaleString()} 
                    tick={{ fontSize: 12, fontWeight: 'bold', fill: '#333' }}
                  />
                  <YAxis yAxisId="sub" orientation="right" hide={true} domain={['dataMin * 4', 'dataMax * 4']} />
                  <YAxis yAxisId="rsi" orientation="right" domain={[0, 100]} hide={!showRSI} stroke="#f44336" />

                  <ChartTooltip 
                    contentStyle={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: 'none' }}
                    formatter={(value: any, name: any) => {
                      if (value === null || value === undefined) return ["-", name];
                      if (name === "RSI") return [value.toFixed(2), name];
                      return [`${Math.round(value).toLocaleString()}`, name];
                    }}
                  />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
                  
                  <Area 
                    yAxisId="left"
                    name="예측 신뢰구간"
                    dataKey="predictRange"
                    stroke="none"
                    fill="#ff9800"
                    fillOpacity={0.15}
                    connectNulls
                  />

                  {showInvestors && <ReferenceLine yAxisId="sub" y={0} stroke="#999" strokeWidth={1} strokeDasharray="3 3" />}
                  {showVolume && <Bar yAxisId="sub" name="거래량" dataKey="volume" fill="#e0e0e0" opacity={0.4} barSize={15} />}

                  {showInvestors && (
                    <>
                      {/* 외인순매수 */}
                      <Bar 
                        yAxisId="sub" 
                        name="외인순매수" 
                        dataKey="foreign" 
                        barSize={8}
                        // shape 속성을 사용하면 개별 막대의 색상을 직접 제어할 수 있습니다.
                        shape={(props: any) => {
                          const { x, y, width, height, payload } = props;
                          const color = payload.foreign >= 0 ? "#ef5350" : "#1e88e5";
                          return <rect x={x} y={y} width={width} height={height} fill={color} />;
                        }}
                        // 범례(Legend)에 표시될 대표 색상
                        fill="#ef5350" 
                      />

                      {/* 기관순매수 */}
                      <Bar 
                        yAxisId="sub" 
                        name="기관순매수" 
                        dataKey="institution" 
                        barSize={8}
                        shape={(props: any) => {
                          const { x, y, width, height, payload } = props;
                          const color = payload.institution >= 0 ? "#ff80ab" : "#90caf9";
                          return <rect x={x} y={y} width={width} height={height} fill={color} />;
                        }}
                        // 범례(Legend)에 표시될 대표 색상
                        fill="#ff80ab"
                      />
                    </>
                  )}

                  <Line yAxisId="left" name="실제 종가" type="monotone" dataKey="actual" stroke="#1976d2" strokeWidth={3} dot={false} connectNulls />
                  <Line yAxisId="left" name="AI 예측" type="monotone" dataKey="predict" stroke="#ff9800" strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls />
                  
                  {showRSI && <Line yAxisId="rsi" name="RSI" type="monotone" dataKey="rsi" stroke="#f44336" strokeWidth={1} dot={false} />}
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StockChartPage;