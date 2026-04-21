/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box, Card, CardContent, CircularProgress,
  Divider,
  FormControl,
  InputLabel, MenuItem, Select,
  Stack,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from 'recharts';
import api from '../../api/axiosInstance';

interface StockResponse {
  symbol: string;
  history: { [key: string]: number };
  prediction: { [key: string]: number };
  error?: string;
}

interface ChartDataItem {
  date: string;
  actual?: number | null;
  predict?: number | null;
}

const StockChartPage: React.FC = () => {
  const stockCode = "005930";
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("1y");
  const [predictDays, setPredictDays] = useState<number>(15);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<StockResponse>(
          `/api/stock/${stockCode}?period=${period}&predict_days=${predictDays}`
        );

        if (response.data.error) {
          setError(response.data.error);
          return;
        }

        const { history, prediction } = response.data;
        const allDates = Array.from(
          new Set([...Object.keys(history), ...Object.keys(prediction)])
        ).sort();

        const combinedData: ChartDataItem[] = allDates.map((date) => ({
          date,
          // 확실하게 숫자 타입으로 캐스팅
          actual: history[date] !== undefined ? Number(history[date]) : null,
          predict: prediction[date] !== undefined ? Number(prediction[date]) : null,
        }));
        console.log("Combined Chart Data:", combinedData);
        setChartData(combinedData);
      } catch (err) {
        console.error("API Error:", err);
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
          
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>📈 주식 종가 예측 프로그램</Typography>
              <Typography variant="body2" color="text.secondary">삼성전자({stockCode}) | AI 예측</Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 110 }}>
                <InputLabel>범위</InputLabel>
                <Select value={period} label="범위" onChange={(e) => setPeriod(e.target.value)}>
                  <MenuItem value="3mo">3개월</MenuItem>
                  <MenuItem value="1y">1년</MenuItem>
                  <MenuItem value="3y">3년</MenuItem>
                  <MenuItem value="5y">5년</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 110 }}>
                <InputLabel>예측</InputLabel>
                <Select value={predictDays} label="예측" onChange={(e) => setPredictDays(Number(e.target.value))}>
                  <MenuItem value={5}>5일</MenuItem>
                  <MenuItem value={15}>15일</MenuItem>
                  <MenuItem value={30}>30일</MenuItem>
                  <MenuItem value={60}>60일</MenuItem>
                  <MenuItem value={90}>90일</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>

          {/* 차트 박스에 명시적인 최소 높이 부여 */}
          <Box sx={{ width: '100%', height: 500, minHeight: 400 }}>
            {loading ? (
              <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }}><CircularProgress /></Stack>
            ) : error ? (
              <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }}><Typography color="error">{error}</Typography></Stack>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} minTickGap={50} />
                  
                  {/* YAxis를 하나만 선언하고 ID를 제거합니다 */}
                  <YAxis 
                    orientation="right" 
                    domain={['auto', 'auto']} 
                    tick={{ fontSize: 11 }} 
                    tickFormatter={(val) => val.toLocaleString()} 
                  />

                  <Tooltip 
                    formatter={(value: any, name: any) => {
                      if (value === null || value === undefined) return ["-", name];
                      return [`${Math.round(Number(value)).toLocaleString()}원`, name];
                    }}
                  />
                  <Legend verticalAlign="top" align="right" />
                  
                  {/* Line에서 yAxisId 속성을 모두 삭제합니다 */}
                  <Line 
                    name="실제 주가" 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#1976d2" 
                    strokeWidth={2} 
                    dot={false} 
                    connectNulls 
                    isAnimationActive={false} 
                  />
                  <Line 
                    name="AI 예측" 
                    type="monotone" 
                    dataKey="predict" 
                    stroke="#ff9800" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={false} 
                    connectNulls 
                    isAnimationActive={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Box>
          <Divider sx={{ my: 2 }} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default StockChartPage;