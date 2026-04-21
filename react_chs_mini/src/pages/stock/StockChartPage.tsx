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
}

interface ChartDataItem {
  date: string;
  actual?: number;
  predict?: number;
}

interface Props {
  stockCode?: string;
}

const StockChartPage: React.FC<Props> = ({ stockCode = "005930" }) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 조회 조건 State 추가
  const [period, setPeriod] = useState<string>("1y"); // 기본 1년
  const [predictDays, setPredictDays] = useState<number>(15); // 기본 15일 예측

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 파라미터 적용 (Spring Boot를 거치든 바로 FastAPI로 가든 동일하게 쿼리스트링 추가)
        const response = await api.get<StockResponse>(
          `/api/stock/${stockCode}?period=${period}&predict_days=${predictDays}`
        );

        const { history, prediction } = response.data;

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
        console.error("데이터 로드 실패:", err);
        setError("주가 데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stockCode, period, predictDays]); // 조건이 바뀔 때마다 재요청

  return (
    <div style={{ width: '100%', height: 600, backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📈 삼성전자({stockCode}) 주가 예측</h2>
        
        {/* 컨트롤 패널 UI */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <span style={{ marginRight: '10px', fontSize: '14px', fontWeight: 'bold' }}>조회 기간:</span>
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="1mo">1개월</option>
              <option value="3mo">3개월</option>
              <option value="1y">1년</option>
              <option value="5y">5년</option>
            </select>
          </div>
          <div>
            <span style={{ marginRight: '10px', fontSize: '14px', fontWeight: 'bold' }}>예측 기간:</span>
            <select value={predictDays} onChange={(e) => setPredictDays(Number(e.target.value))}>
              <option value={5}>5일</option>
              <option value={15}>15일</option>
              <option value={30}>30일</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          AI 분석 엔진 가동 중...
        </div>
      ) : error ? (
        <div style={{ color: 'red', height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {error}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={30} />
            <YAxis 
              domain={['auto', 'auto']} 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString()} 
            />
            <Tooltip 
              formatter={(value: number | undefined) => {
                  if (value === undefined) return ["데이터 없음", ""];
                  return [value.toLocaleString() + "원", ""];
              }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
            />
            <Legend verticalAlign="top" height={36}/>
            
            <Line name="실제 종가" type="monotone" dataKey="actual" stroke="#8884d8" strokeWidth={2} dot={false} connectNulls />
            <Line name="AI 예측가" type="monotone" dataKey="predict" stroke="#ff7300" strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      )}
      
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        * 점선은 Prophet AI 모델이 계산한 미래 {predictDays}일간의 예측치입니다.
      </p>
    </div>
  );
};

export default StockChartPage;