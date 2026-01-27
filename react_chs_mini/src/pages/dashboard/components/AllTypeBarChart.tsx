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
      
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={ALL_TYPE_STATS} 
            // 1. margin의 좌우 값을 20 정도로 넉넉히 주어 잘림 방지
            margin={{ top: 30, right: 20, left: 20, bottom: 20 }}
            barCategoryGap="15%" 
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} 
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
              interval={0}
              // 2. padding을 추가하여 막대가 차트 끝에 붙지 않게 조절
              padding={{ left: 10, right: 10 }} 
            />
            {/* 3. YAxis를 완전히 숨기지 않고 width: 0만 주어 공간 확보 */}
            <YAxis width={0} domain={[0, 'dataMax + 15']} /> 
            
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
    </Paper>
  );
}