/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, Typography } from "@mui/material";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

export default function StatRadarChart({ stats, typeAverage, color, name, typeName }: { stats: any[], typeAverage: any, color: string, name: string, typeName: string }) {
  const data = stats.map((s) => {
    // 포켓몬 스탯 이름 (hp, attack, defense...)
    const statKey = s.stat.name; // 'hp', 'attack', 'defense' 등
    
    return {
      subject: statKey,
      A: s.base_stat, // 현재 포켓몬의 스탯
      // 타입 평균값이 있으면 넣고, 없으면 0 (전체 평균 value를 각 항목에 동일하게 배분하여 비교)
      B: typeAverage ? typeAverage[statKey] : 0 // 해당 타입의 평균 스탯
      // ※ 참고: ALL_TYPE_STATS의 value가 총합이라면 6으로 나누고, 
      // 만약 개별 항목 비교 데이터가 따로 있다면 그에 맞춰 매핑.
    };
  });
  return (
    <Paper sx={{ p: 3, height: '100%', borderRadius: 0, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
          기본 스탯 비교
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* 현재 포켓몬 범례 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box 
              sx={{ 
                width: 24,           // 선의 길이
                height: 3,           // 선의 두께
                bgcolor: color,  // 포켓몬 타입 색상
                borderRadius: '2px'
              }} 
            />
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
              현재 포켓몬
            </Typography>
          </Box>

          {/* 타입 평균 범례 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ 
              width: 24, 
              height: 2, 
              bgcolor: '#cbd5e1', 
              border: '0.5px dashed #94a3b8' // 대시(점선) 느낌 추가
            }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
              {typeName || '미정'} 타입 평균
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
            {/* 레이어 1: 타입 평균 (배경처럼 점선으로 처리) */}
            <Radar
              name={`${typeName || ''} 평균`}
              dataKey="B"
              stroke="#94a3b8"       // 약간 더 진한 회색으로 경계선 명확화
              strokeDasharray="4 4" // 점선 스타일 추가 (구분감 핵심)
              fill="#e2e8f0"         // 아주 연한 배경색
              fillOpacity={0.3}
              isAnimationActive={false} // 배경은 정적으로 유지하여 집중도 분산 방지
            />

            {/* 레이어 2: 현재 포켓몬 (실선 + 포인트 점 + 진한 강조) */}
            <Radar
              name={name}
              dataKey="A"
              stroke={color}         // 고유 색상 실선
              strokeWidth={3}        // 선 두께 강조
              fill={color}
              fillOpacity={0.5}
              // 정점에 점(Dot)을 찍어 수치 위치를 명확히 표시
              dot={{ r: 4, fill: color, strokeWidth: 2, stroke: "#fff" }} 
              activeDot={{ r: 6 }}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}