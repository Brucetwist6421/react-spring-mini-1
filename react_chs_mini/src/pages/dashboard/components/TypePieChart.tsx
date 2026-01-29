/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, Typography } from "@mui/material";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { TYPE_COLORS } from "../utils/pokemonUtils";

export default function TypePieChart({ types }: { types: any[] }) {
  const data = types.map((t) => ({
    name: t.type.name,
    value: 1,
    fill: TYPE_COLORS[t.type.name] || '#94a3b8'
  }));

  return (
    <Paper 
      sx={{ 
        p: 3, 
        height: '100%', 
        borderRadius: 0, 
        border: '1px solid #e2e8f0', 
        boxShadow: 'none', 
        // 1. 차트가 잘리지 않도록 overflow: hidden 권장 (필요시 내부 스크롤)
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
        보유 속성 구성
      </Typography>

      <Box sx={{ width: '100%', flexGrow: 1, minHeight: 250 }}>
        {/* 2. ResponsiveContainer에 정확한 가로세로 비율(aspect)을 주거나 minHeight를 확인하세요 */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius="60%" // 3. 픽셀(70) 대신 퍼센트(%)를 사용하면 반응형에 더 유연합니다.
              outerRadius="85%" // 바깥쪽 여백을 위해 100%보다는 80~90%를 권장합니다.
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              // 차트가 중앙에 오도록 명시
              cx="50%"
              cy="50%"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}