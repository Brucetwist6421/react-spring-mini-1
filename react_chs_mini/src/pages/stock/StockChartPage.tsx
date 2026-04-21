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
// LineChart 대신 ComposedChart와 Bar를 가져옵니다.
import {
  CartesianGrid, Legend, Line, ComposedChart, Bar, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from 'recharts';
import api from '../../api/axiosInstance';

// 1. API 응답 인터페이스에 volume 추가
interface StockResponse {
  symbol: string;
  history: { [key: string]: number };
  prediction: { [key: string]: number };
  volume: { [key: string]: number }; // 추가
  events: { [key: string]: string }; 
  error?: string;
}

// 2. 차트 데이터 아이템에 volume 추가
interface ChartDataItem {
  date: string;
  actual?: number | null;
  predict?: number | null;
  volume?: number | null; // 추가
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

        // 3. volume 데이터를 포함하여 병합 로직 수정
        const { history, prediction, volume } = response.data;
        const allDates = Array.from(
          new Set([...Object.keys(history), ...Object.keys(prediction)])
        ).sort();

        const combinedData: ChartDataItem[] = allDates.map((date) => ({
          date,
          actual: history[date] !== undefined ? Number(history[date]) : null,
          predict: prediction[date] !== undefined ? Number(prediction[date]) : null,
          // 해당 날짜의 거래량이 있으면 숫자로, 없으면 0으로 처리
          volume: volume && volume[date] !== undefined ? Number(volume[date]) : 0,
        }));
        
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
              <Typography variant="body2" color="text.secondary">삼성전자({stockCode}) | AI 예측 및 거래량</Typography>
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

          <Box sx={{ width: '100%', height: 500, minHeight: 400 }}>
            {loading ? (
              <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }}><CircularProgress /></Stack>
            ) : error ? (
              <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }}><Typography color="error">{error}</Typography></Stack>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {/* 4. LineChart를 ComposedChart로 변경 */}
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} minTickGap={50} />
                  
                  {/* 주가용 Y축 (왼쪽) */}
                  <YAxis 
                    yAxisId="left"
                    orientation="left" 
                    domain={['auto', 'auto']} 
                    tick={{ fontSize: 11 }} 
                    tickFormatter={(val) => val.toLocaleString()} 
                  />

                  {/* 거래량용 Y축 (오른쪽, 주가와 겹치지 않게 숨김 처리 권장) */}
                  <YAxis 
                    yAxisId="right"
                    orientation="right" 
                    hide={true} 
                  />

                  <Tooltip 
                    formatter={(value: any, name: any) => {
                      if (value === null || value === undefined) return ["-", name];
                      // 이름에 따라 포맷팅 변경
                      if (name === "거래량") return [`${value.toLocaleString()}주`, name];
                      return [`${Math.round(Number(value)).toLocaleString()}원`, name];
                    }}
                  />
                  <Legend verticalAlign="top" align="right" />
                  
                  {/* 5. 거래량 막대그래프 추가 (배경처럼 연하게 설정) */}
                  <Bar 
                    yAxisId="right"
                    name="거래량"
                    dataKey="volume"
                    fill="#dd89d2"
                    opacity={0.5}
                    barSize={20}
                  />

                  <Line 
                    yAxisId="left"
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
                    yAxisId="left"
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
                </ComposedChart>
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