/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box, Card, CardContent,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel, FormGroup,
  InputLabel, MenuItem, Select,
  Stack, Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend, Line,
  ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from 'recharts';
import api from '../../api/axiosInstance';

interface StockResponse {
  symbol: string;
  history: { [key: string]: number };
  prediction: { [key: string]: number };
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
  volume?: number | null;
  rsi?: number | null;
  foreign?: number | null;
  institution?: number | null;
}

const StockChartPage: React.FC = () => {
  const stockCode = "005930";
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("1mo");
  const [predictDays, setPredictDays] = useState<number>(15);

  const [showVolume, setShowVolume] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [showInvestors, setShowInvestors] = useState(false);

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

        const { history, prediction, volume, indicators, investors } = response.data;
        const allDates = Array.from(
          new Set([...Object.keys(history), ...Object.keys(prediction)])
        ).sort();

        const combinedData: ChartDataItem[] = allDates.map((date) => {
          const investorIdx = investors?.dates.indexOf(date);
          
          // 예측값이 0보다 작으면 차트에서 제외(null) 처리하여 시각적 오류 방지
          const rawPredict = prediction[date];
          const validPredict = (rawPredict !== undefined && rawPredict > 0) ? Math.round(rawPredict) : null;

          return {
            date,
            actual: history[date] !== undefined ? Math.round(history[date]) : null,
            predict: validPredict,
            volume: volume?.[date] ?? 0,
            rsi: indicators?.rsi?.[date] ?? null,
            foreign: (investorIdx !== -1 && investors) ? investors.foreign[investorIdx] : null,
            institution: (investorIdx !== -1 && investors) ? investors.institution[investorIdx] : null,
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
    <Box sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Card sx={{ borderRadius: 4, flex: 1, display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, md: 4 } }}>
          
          <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>📈 주식 종가 예측/분석</Typography>
              <Typography variant="body2" color="text.secondary">삼성전자({stockCode}) | 가격 메인 분석</Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <FormGroup row>
                <FormControlLabel control={<Checkbox checked={showVolume} onChange={e => setShowVolume(e.target.checked)} color="secondary" />} label="거래량" />
                <FormControlLabel control={<Checkbox checked={showRSI} onChange={e => setShowRSI(e.target.checked)} color="error" />} label="RSI" />
                <FormControlLabel control={<Checkbox checked={showInvestors} onChange={e => setShowInvestors(e.target.checked)} color="success" />} label="투자자" />
              </FormGroup>

              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>범위</InputLabel>
                <Select value={period} label="범위" onChange={(e) => setPeriod(e.target.value)}>
                  <MenuItem value="1mo">1개월</MenuItem>
                  <MenuItem value="3mo">3개월</MenuItem>
                  <MenuItem value="1y">1년</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>예측</InputLabel>
                <Select value={predictDays} label="예측" onChange={(e) => setPredictDays(Number(e.target.value))}>
                  <MenuItem value={5}>5일</MenuItem>
                  <MenuItem value={15}>15일</MenuItem>
                  <MenuItem value={30}>30일</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>

          <Box sx={{ width: '100%', height: 550 }}>
            {loading ? (
              <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }}><CircularProgress /></Stack>
            ) : error ? (
              <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }}><Typography color="error">{error}</Typography></Stack>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  
                  {/* 메인 Y축: 가격 전용 (소수점 제거) */}
                  <YAxis 
                    yAxisId="left"
                    orientation="left" 
                    domain={['dataMin - 1000', 'dataMax + 1000']} // 주가가 잘 보이도록 범위를 자동 조절
                    tickFormatter={(val) => Math.floor(val).toLocaleString()} 
                    tick={{ fontSize: 12, fontWeight: 'bold' }}
                  />

                  {/* 보조 축들 (모두 숨김 또는 우측 배치) */}
                  <YAxis yAxisId="volume" orientation="right" hide={true} />
                  <YAxis yAxisId="rsi" orientation="right" domain={[0, 100]} hide={!showRSI} stroke="#f44336" />
                  <YAxis yAxisId="investor" orientation="right" hide={true} />

                  <Tooltip 
                    formatter={(value: any, name: any) => {
                      if (value === null || value === undefined) return ["-", name];
                      // 모든 가격/매수 수치는 정수로 변환하여 콤마 표시
                      if (name === "RSI") return [value.toFixed(2), name];
                      return [`${Math.round(value).toLocaleString()}`, name];
                    }}
                  />
                  <Legend verticalAlign="top" align="right" />
                  
                  {/* 실제 주가 및 예측 (항상 표시, 소수점 없음) */}
                  <Line yAxisId="left" name="실제 주가" type="monotone" dataKey="actual" stroke="#1976d2" strokeWidth={3} dot={false} connectNulls />
                  <Line yAxisId="left" name="AI 예측" type="monotone" dataKey="predict" stroke="#ff9800" strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls />

                  {showVolume && <Bar yAxisId="volume" name="거래량" dataKey="volume" fill="#9c27b0" opacity={0.1} barSize={20} />}
                  {showRSI && <Line yAxisId="rsi" name="RSI" type="monotone" dataKey="rsi" stroke="#f44336" dot={false} />}
                  {showInvestors && (
                    <>
                      <Bar yAxisId="investor" name="외인매수" dataKey="foreign" fill="#4caf50" opacity={0.3} />
                      <Bar yAxisId="investor" name="기관매수" dataKey="institution" fill="#2196f3" opacity={0.3} />
                    </>
                  )}
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