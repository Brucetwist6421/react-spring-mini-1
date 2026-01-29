/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, Typography, Avatar, Grid, Chip } from "@mui/material";
import { TYPE_COLORS } from "./types/dashboardType";

// ⭐ onSelect 프롭 추가
export default function TopRankerCard({ p, rank, onSelect }: any) {
  const bst = p.stats.reduce((acc: any, cur: any) => acc + cur.base_stat, 0);
  const colors = ['#ffd700', '#c0c0c0', '#cd7f32'];
  const pokedexNumber = `#${String(p.id).padStart(4, '0')}`;

  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Paper 
        // 클릭 이벤트 연결
        onClick={() => onSelect(p.name)}
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          borderRadius: 0, 
          border: '1px solid #e2e8f0', 
          boxShadow: 'none',
          cursor: 'pointer', // 클릭 가능함을 알리는 커서
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: '#3b82f6', // 호버 시 테두리 색상 변경
            bgcolor: '#f8fafc',    // 배경색 살짝 변경
            transform: 'translateY(-2px)', // 위로 살짝 들리는 효과
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }
        }}
      >
        {/* 이미지 섹션 */}
        <Box sx={{ position: 'relative' }}>
          <Avatar src={p.sprites.front_default} sx={{ width: 60, height: 60, bgcolor: '#f8fafc' }} />
          <Box sx={{ position: 'absolute', top: -5, left: -5, bgcolor: colors[rank - 1] || '#94a3b8', color: '#fff', px: 0.8, py: 0.2, fontSize: '0.65rem', fontWeight: 900 }}>
            {rank}위
          </Box>
        </Box>

        {/* 정보 섹션 */}
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8' }}>{pokedexNumber}</Typography>
            <Typography variant="subtitle2" fontWeight={800} sx={{ textTransform: 'capitalize' }}>
              {p.koName || p.name}({p.name})
            </Typography>
          </Box>

          {/* 타입 칩 */}
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
            {p.types.map((t: any) => (
              <Chip 
                key={t.type.name}
                label={t.type.name.toUpperCase()} 
                size="small" 
                sx={{ 
                  height: 16, fontSize: '0.6rem', fontWeight: 900, 
                  bgcolor: TYPE_COLORS[t.type.name] || '#94a3b8', 
                  color: '#fff', borderRadius: '2px' 
                }} 
              />
            ))}
          </Box>

          <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontWeight: 600 }}>
            전투력(BST): <span style={{ color: '#3b82f6' }}>{bst}</span>
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}