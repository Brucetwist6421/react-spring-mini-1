/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, Typography } from "@mui/material";
import { PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts';
import { TYPE_COLORS } from "../utils/pokemonUtils";

export default function TypePieChart({ types }: { types: any[] }) {
  // 1. 데이터 가공 (타입이 1개일 때도 원형을 유지하도록 구성)
  const data = types.map((t) => ({
    name: t.type.name.toUpperCase(),
    value: 100 / types.length, // 비율을 백분율로 환산
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
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        // 배경에 미세한 질감을 주어 차트 가독성 향상
        bgcolor: '#ffffff'
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#1e293b', mb: 0.5, letterSpacing: '-0.5px' }}>
        보유 속성 분석
      </Typography>
      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, mb: 2 }}>
        보유 속성 구성 비율(%)
      </Typography>

      <Box sx={{ width: '100%', flexGrow: 1, minHeight: 250, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="65%" // 도넛 두께 조절 (더 세련된 룩)
              outerRadius="90%"
              paddingAngle={data.length > 1 ? 8 : 0} // 타입이 1개일 땐 간격 제거
              stroke="none"
              // Cell 대신 Pie에서 직접 데이터의 fill 속성을 참조하도록 설정
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={800}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                borderRadius: '0px', // 대시보드 테마와 일치
                border: '1px solid #e2e8f0', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                fontWeight: 800
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* ✅ UX 꿀팁: 도넛 차트 중앙에 총 타입 개수 표시 */}
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 1000, color: '#1e293b', lineHeight: 1 }}>
            {types.length}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>
            {types.length > 1 ? `TYPES` : `TYPE`}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}