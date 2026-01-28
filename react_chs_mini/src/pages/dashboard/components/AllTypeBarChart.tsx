/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts'; 
import { ALL_TYPE_STATS } from '../utils/pokemonUtils';

const TYPE_COLORS: { [key: string]: string } = {
  물: "#3b82f6", 불꽃: "#ef4444", 풀: "#10b981", 전기: "#f59e0b", 얼음: "#7dd3fc",
  격투: "#991b1b", 독: "#a855f7", 땅: "#b45309", 비행: "#818cf8", 에스퍼: "#ec4899",
  벌레: "#65a30d", 바위: "#78350f", 고스트: "#6366f1", 드래곤: "#4338ca", 악: "#1f2937",
  강철: "#64748b", 페어리: "#f472b6", 노말: "#94a3b8"
};

export default function AllTypeBarChart() {
  // 1. 데이터 레이어에서 색상(fill)을 미리 정의합니다.
  // Recharts는 데이터 객체 안에 'fill'이라는 키가 있으면 자동으로 해당 막대의 색상으로 사용합니다.
  const chartData = ALL_TYPE_STATS.map((entry) => ({
    ...entry,
    fill: TYPE_COLORS[entry.name] || "#94a3b8"
  }));

  return (
    <Paper sx={{ p: 3, borderRadius: 0, border: '1px solid #e2e8f0', boxShadow: 'none', height: '100%' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3, color: '#1e293b' }}>
        포켓몬 속성 분포 현황
      </Typography>
      
      <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', pb: 1 }}>
        <Box sx={{ width: '100%', minWidth: 800, height: 378 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} // fill 정보가 포함된 데이터 전달
              margin={{ top: 30, right: 20, left: 10, bottom: 20 }}
              barCategoryGap="20%" 
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} 
                axisLine={{ stroke: '#e2e8f0' }} 
                tickLine={false} 
                interval={0} 
              />
              <YAxis hide domain={[0, 'dataMax + 15']} /> 
              <Tooltip cursor={{ fill: '#f1f5f9', opacity: 0.4 }} contentStyle={{ borderRadius: 0, border: '1px solid #e2e8f0', fontWeight: 700 }} />

              {/* 2. Bar 컴포넌트에 특정 색(fill)을 지정하지 않으면 
                   데이터 객체 내부의 'fill' 속성을 따라갑니다. */}
              <Bar dataKey="value" radius={0}>
                <LabelList 
                  dataKey="value" 
                  position="top" 
                  style={{ fill: '#1e293b', fontSize: 11, fontWeight: 800 }} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper>
  );
}