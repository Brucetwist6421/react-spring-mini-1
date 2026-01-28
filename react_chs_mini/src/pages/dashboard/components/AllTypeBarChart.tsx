/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { ALL_TYPE_STATS } from '../utils/pokemonUtils';

const TYPE_COLORS: { [key: string]: string } = {
  물: "#3b82f6", 불꽃: "#ef4444", 풀: "#10b981", 전기: "#f59e0b", 얼음: "#7dd3fc",
  격투: "#991b1b", 독: "#a855f7", 땅: "#b45309", 비행: "#818cf8", 에스퍼: "#ec4899",
  벌레: "#65a30d", 바위: "#78350f", 고스트: "#6366f1", 드래곤: "#4338ca", 악: "#1f2937",
  강철: "#64748b", 페어리: "#f472b6", 노말: "#94a3b8"
};

export default function AllTypeBarChart() {
  return (
    <Paper sx={{ p: 3, borderRadius: 0, border: '1px solid #e2e8f0', boxShadow: 'none', height: '100%' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3, color: '#1e293b' }}>
        포켓몬 속성 분포 현황
      </Typography>
      
      {/* 1. 가로 스크롤을 허용하는 부모 컨테이너 */}
      <Box sx={{ 
        width: '100%', 
        overflowX: 'auto', // 가로 스크롤 자동 생성
        overflowY: 'hidden',
        pb: 1, // 스크롤바가 차트 숫자를 가리지 않게 약간의 여백
        // 스크롤바 커스텀 스타일 (선택사항)
        '&::-webkit-scrollbar': { height: '6px' },
        '&::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: '10px' }
      }}>
        {/* 2. 차트가 찌그러지지 않도록 최소 너비(minWidth) 고정 */}
        <Box sx={{ width: '100%', minWidth: 800, height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={ALL_TYPE_STATS} 
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
                padding={{ left: 20, right: 20 }} 
              />
              <YAxis hide domain={[0, 'dataMax + 15']} /> 
              
              <Tooltip 
                cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
                contentStyle={{ borderRadius: 0, border: '1px solid #e2e8f0', fontWeight: 700 }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {ALL_TYPE_STATS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry.name] || "#94a3b8"} />
                ))}
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