/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Typography, Avatar, Box, Chip } from "@mui/material";

interface TodayPickCardProps {
  pokemon: any;
  color: string;
}

export default function TodayPickCard({ pokemon, color }: TodayPickCardProps) {
  if (!pokemon) return null;

  return (
    <Card 
      sx={{ 
        borderRadius: 0, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 3, 
        boxShadow: 'none', 
        border: '1px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 배경에 살짝 비치는 원형 데코 (속성 색상 활용) */}
      <Box sx={{
        position: 'absolute',
        top: -20,
        right: -20,
        width: 120,
        height: 120,
        borderRadius: '50%',
        backgroundColor: color,
        opacity: 0.1,
        zIndex: 0
      }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#64748b', zIndex: 1 }}>
        오늘의 추천 포켓몬
      </Typography>

      <Avatar 
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={pokemon.name}
        sx={{ 
          width: 180, 
          height: 180, 
          mb: 2, 
          borderRadius: 0,
          filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.1))', // 이미지에 입체감 부여
          zIndex: 1
        }}
      />

      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 800, 
          color: '#0f172a', 
          textTransform: 'capitalize',
          mb: 0.5,
          zIndex: 1
        }}
      >
        {pokemon.name}
      </Typography>

      <Typography 
        variant="body2" 
        sx={{ 
          color: color, 
          fontWeight: 800, 
          letterSpacing: '1px',
          mb: 2,
          zIndex: 1
        }}
      >
        #{pokemon.id.toString().padStart(4, '0')}
      </Typography>

      {/* 타입들을 Chip 형태로 나열 */}
      <Box sx={{ display: 'flex', gap: 1, zIndex: 1 }}>
        {pokemon.types.map((t: any) => (
          <Chip 
            key={t.type.name}
            label={t.type.name.toUpperCase()} 
            size="small"
            sx={{ 
              backgroundColor: color, 
              color: '#ffffff', 
              fontWeight: 700,
              fontSize: '0.7rem',
              borderRadius: '4px' // 각진 컨셉 유지
            }} 
          />
        ))}
      </Box>
    </Card>
  );
}