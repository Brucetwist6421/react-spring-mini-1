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

// 1. API 응답 데이터 구조 정의
interface StockResponse {
  symbol: string;
  history: { [key: string]: number };
  prediction: { [key: string]: number };
}

// 2. 차트에서 사용할 데이터 아이템 구조 정의
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Spring Boot API 호출
        const response = await api.get<StockResponse>(`/api/stock/${stockCode}`);

        const { history, prediction } = response.data;

        // 3. 데이터 변환 로직
        // 모든 날짜를 합쳐서 정렬하기 위해 Set 사용
        const allDates = Array.from(
          new Set([...Object.keys(history), ...Object.keys(prediction)])
        ).sort();

        const combinedData: ChartDataItem[] = allDates.map((date) => ({
          date,
          // history에 값이 있으면 actual에 할당
          actual: history[date] !== undefined ? history[date] : undefined,
          // prediction에 값이 있으면 predict에 할당
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
  }, [stockCode]);

  if (loading) return <div style={{ padding: '20px' }}>AI 분석 엔진 가동 중...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;

  return (
    <div style={{ width: '100%', height: 500, backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '20px' }}>📈 삼성전자({stockCode}) 주가 예측 결과</h2>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
          />
          <YAxis 
            domain={['auto', 'auto']} 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString()} 
          />
          <Tooltip 
            // value가 undefined일 수 있으므로 기본값 0을 주거나 조건문을 추가합니다.
            formatter={(value: number | undefined) => {
                if (value === undefined) return ["데이터 없음", ""];
                return [value.toLocaleString() + "원", ""];
            }}
            contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)' 
            }}
          />
          <Legend verticalAlign="top" height={36}/>
          
          {/* 실제 주가: 보라색 실선 */}
          <Line
            name="실제 종가"
            type="monotone"
            dataKey="actual"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls // 데이터가 끊기지 않게 연결
          />
          
          {/* 예측 주가: 주황색 점선 */}
          <Line
            name="AI 예측가"
            type="monotone"
            dataKey="predict"
            stroke="#ff7300"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ r: 4 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        * 점선은 Prophet AI 모델이 계산한 미래 5일간의 예측치입니다.
      </p>
    </div>
  );
};

export default StockChartPage;