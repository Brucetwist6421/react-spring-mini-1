import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
  actual?: number;
  predict?: number;
}

const StockChartPage: React.FC = () => {
  const stockCode = "005930"; // 삼성전자
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 상태 관리: 조회 기간 및 예측 기간
  const [period, setPeriod] = useState<string>("1y");
  const [predictDays, setPredictDays] = useState<number>(15);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // API 호출 시 파라미터 전달
        const response = await api.get<StockResponse>(
          `/api/stock/${stockCode}?period=${period}&predict_days=${predictDays}`
        );

        if (response.data.error) {
          setError(response.data.error);
          return;
        }

        const { history, prediction } = response.data;

        // 날짜 병합 및 정렬
        const allDates = Array.from(
          new Set([...Object.keys(history), ...Object.keys(prediction)])
        ).sort();

        const combinedData: ChartDataItem[] = allDates.map((date) => ({
          date,
          actual: history[date] !== undefined ? history[date] : undefined,
          predict: prediction[date] !== undefined ? prediction[date] : undefined,
        }));

        setChartData(combinedData);
      } catch (err) {
        console.error("Error fetching stock data:", err);
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, predictDays]); // 설정 변경 시 자동 재실행

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '30px', 
        borderRadius: '16px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0 }}>📈 삼성전자 주가 예측 시스템</h2>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={selectBoxStyle}>
              <label>조회 기간</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="1mo">1개월</option>
                <option value="3mo">3개월</option>
                <option value="1y">1년</option>
                <option value="5y">5년</option>
              </select>
            </div>
            <div style={selectBoxStyle}>
              <label>예측 기간</label>
              <select value={predictDays} onChange={(e) => setPredictDays(Number(e.target.value))}>
                <option value={5}>5일</option>
                <option value={15}>15일</option>
                <option value={30}>30일</option>
                <option value={60}>60일</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ width: '100%', height: 450 }}>
          {loading ? (
            <div style={centerStyle}>AI 분석 모델 계산 중...</div>
          ) : error ? (
            <div style={{ ...centerStyle, color: 'red' }}>{error}</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {/* key를 통해 데이터 변경 시 차트를 강제로 다시 그림 */}
              <LineChart key={`${period}-${predictDays}`} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: '#888' }} 
                  minTickGap={40}
                  axisLine={{ stroke: '#eee' }}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  tick={{ fontSize: 11, fill: '#888' }}
                  tickFormatter={(val) => val.toLocaleString()}
                  orientation="right"
                  axisLine={false}
                />
                <Tooltip 
                  formatter={(val: number | string | undefined) => {
                    // 값이 없거나 숫자가 아닌 경우 처리
                    if (val === undefined || val === null) return ["데이터 없음", ""];
                    
                    // 숫자인 경우 포맷팅 (string으로 들어올 경우를 대비해 Number 변환 추가)
                    const numericValue = typeof val === 'string' ? parseFloat(val) : val;
                    return [numericValue.toLocaleString() + "원", ""];
                  }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Legend verticalAlign="top" align="right" iconType="circle" />
                
                <Line 
                  name="실제 주가" 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={false} 
                  activeDot={{ r: 6 }}
                  connectNulls
                />
                <Line 
                  name="AI 예측가" 
                  type="monotone" 
                  dataKey="predict" 
                  stroke="#f97316" 
                  strokeWidth={3} 
                  strokeDasharray="5 5" 
                  dot={false}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '20px', textAlign: 'center' }}>
          * 본 데이터는 Facebook Prophet 모델을 통한 통계적 예측치이며 투자 손실에 책임지지 않습니다.
        </p>
      </div>
    </div>
  );
};

// 스타일링 오브젝트
const selectBoxStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const centerStyle: React.CSSProperties = {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '15px',
  color: '#64748b'
};

export default StockChartPage;