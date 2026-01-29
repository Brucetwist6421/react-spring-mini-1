/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, Typography, Avatar, Chip } from "@mui/material";
import { TYPE_COLORS } from "./types/dashboardType";

export default function TopRankerCard({ p, rank, onSelect }: any) {
  const bst = p.stats.reduce((acc: any, cur: any) => acc + cur.base_stat, 0);
  const colors = ['#ffd700', '#c0c0c0', '#cd7f32'];
  const pokedexNumber = `#${String(p.id).padStart(4, '0')}`;

  return (
    <Paper 
      onClick={() => onSelect(p.name)}
      sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        // ✅ 핵심: 부모 Grid의 높이에 맞춰 꽉 채움
        height: '100%', 
        minHeight: '100px', // 최소 높이 보장
        borderRadius: "16px", 
        border: '1px solid #e2e8f0', 
        boxShadow: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: '#3b82f6',
          bgcolor: '#f0f7ff',
          transform: 'translateY(-4px)', 
          boxShadow: '0 12px 20px -10px rgba(59, 130, 246, 0.15)'
        }
      }}
    >
      {/* 이미지 섹션: flex-shrink를 0으로 줘서 이미지가 찌그러지지 않게 함 */}
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <Avatar 
          src={p.sprites.front_default} 
          sx={{ 
            width: { xs: 50, sm: 64 }, // 모바일 대응 크기 조절
            height: { xs: 50, sm: 64 }, 
            bgcolor: '#f8fafc',
            border: '1px solid #f1f5f9'
          }} 
        />
        <Box sx={{ 
          position: 'absolute', 
          top: -8, 
          left: -8, 
          bgcolor: colors[rank - 1] || '#94a3b8', 
          color: '#fff', 
          px: 1, 
          py: 0.2, 
          fontSize: '0.7rem', 
          fontWeight: 900,
          borderRadius: '6px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 1
        }}>
          {rank}위
        </Box>
      </Box>

      {/* 정보 섹션: flex-grow: 1을 주어 남은 가로 공간을 다 차지함 */}
      <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', fontSize: '0.9rem' }}>
            {pokedexNumber}
          </Typography>
          <Typography 
            variant="subtitle1" 
            fontWeight={800} 
            sx={{ 
              textTransform: 'capitalize', 
              color: '#1e293b',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {p.koName || p.name}({p.name})
          </Typography>
        </ Box>

        {/* 타입 칩 레이아웃 최적화 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {p.types.map((t: any) => (
            <Chip 
              key={t.type.name}
              label={t.type.name.toUpperCase()} 
              size="small" 
              sx={{ 
                height: 18, 
                fontSize: '0.65rem', 
                fontWeight: 900, 
                bgcolor: TYPE_COLORS[t.type.name] || '#94a3b8', 
                color: '#fff', 
                borderRadius: '4px' 
              }} 
            />
          ))}
        </Box>

        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: '#64748b', fontWeight: 700 }}>
          전투력 <Box component="span" sx={{ ml: 1, color: '#3b82f6', fontWeight: 900 }}>{bst}</Box>
        </Typography>
      </Box>
    </Paper>
  );
}