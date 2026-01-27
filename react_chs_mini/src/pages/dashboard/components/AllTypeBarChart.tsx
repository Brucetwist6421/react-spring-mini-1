import { Box, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { ALL_TYPE_STATS } from '../utils/pokemonUtils';

export default function AllTypeBarChart() {
  return (
    <Paper sx={{ p: 3, borderRadius: 0, border: '1px solid #e2e8f0', boxShadow: 'none', height: '100%' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: '#64748b' }}>
        전체 포켓몬 속성 별 분류 현황 (18종)
      </Typography>
      
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={ALL_TYPE_STATS} 
            margin={{ top: 20, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} 
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
              interval={0} // 모든 속성 이름 표시
            />
            <YAxis hide /> {/* 개수는 막대 위에 표시하므로 축은 숨겨서 깔끔하게 유지 */}
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              formatter={(value) => [`${value}마리`, '개수']}
              contentStyle={{ borderRadius: 0, border: '1px solid #e2e8f0' }}
            />
            <Bar 
              dataKey="value" 
              barSize={30}
              radius={[4, 4, 0, 0]}
            >
              {/* 막대 상단에 개수 텍스트 표시 */}
              <LabelList 
                dataKey="value" 
                position="top" 
                style={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}