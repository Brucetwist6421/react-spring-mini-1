import { Box, Typography, Stack, Avatar, Tooltip } from "@mui/material";
import EastIcon from '@mui/icons-material/East';

interface EvolutionNode {
  id: number;
  name: string;
  koName: string;
}

interface EvolutionSectionProps {
  evoChain: EvolutionNode[];
  currentPokemonName: string;
  activeColor: string;
  // ⭐ 클릭 시 호출될 함수 추가
  onSelectPokemon: (name: string) => void; 
}

export default function EvolutionSection({ 
  evoChain, 
  currentPokemonName, 
  activeColor, 
  onSelectPokemon 
}: EvolutionSectionProps) {
  if (!evoChain || evoChain.length === 0) return null;

  return (
    <Box sx={{ 
      my: 2, 
      p: 2, 
      bgcolor: '#f8fafc', 
      border: '1px solid #e2e8f0', 
      borderRadius: '12px', 
      width: '100%',
    }}>
      <Typography variant="caption" fontWeight={900} color="#94a3b8" display="block" mb={1.5} textAlign="left">
        진화 과정 (클릭 시 이동)
      </Typography>
      
      <Box sx={{ 
        overflowX: 'auto', 
        pt: 2, 
        pb: 2, 
        mx: -1, // 부모 패딩 때문에 스크롤바가 안쪽으로 들어오는 것 방지
        px: 1,
        display: 'flex',
        '&::-webkit-scrollbar': { height: '4px' },
        '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: '10px' }
      }}>
        <Stack 
          direction="row" 
          justifyContent={evoChain.length > 3 ? "flex-start" : "center"} 
          alignItems="center" 
          spacing={0}
          sx={{ 
            minWidth: 'max-content',
            width: '100%',
          }}
        >
          {evoChain.map((node, i) => {
            const isCurrent = node.name === currentPokemonName;
            
            return (
              <Stack key={node.name} direction="row" alignItems="center">
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  {isCurrent && (
                    <Box sx={{ 
                      position: 'absolute', 
                      top: -12, // ✅ NOW 뱃지도 더 잘 보이게 위치 조정
                      right: -5, 
                      bgcolor: activeColor, 
                      color: 'white', 
                      fontSize: '0.6rem', 
                      px: 0.8, 
                      borderRadius: '10px', 
                      zIndex: 2,
                      fontWeight: 900, 
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      NOW
                    </Box>
                  )}

                  <Tooltip title={isCurrent ? "현재 분석 중" : `${node.koName} 분석하기`} arrow>
                    <Avatar 
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${node.id}.png`} 
                      onClick={() => !isCurrent && onSelectPokemon(node.name)} 
                      sx={{ 
                        width: 64, 
                        height: 64, 
                        border: isCurrent ? `3px solid ${activeColor}` : '1px solid #e2e8f0', 
                        p: 0.5, 
                        bgcolor: 'white', 
                        mx: 'auto',
                        cursor: isCurrent ? 'default' : 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        // ✅ scale을 1.15로 유지하되 부모 패딩이 이를 감당함
                        '&:hover': { 
                          transform: isCurrent ? 'none' : 'scale(1.15) translateY(-4px)',
                          boxShadow: isCurrent ? 'none' : '0 10px 20px rgba(0,0,0,0.12)',
                          borderColor: isCurrent ? activeColor : '#3b82f6',
                          zIndex: 10 // 호버 시 다른 요소보다 위에 오도록
                        }
                      }} 
                    />
                  </Tooltip>

                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      mt: 1.5, 
                      fontSize: '0.7rem', 
                      fontWeight: isCurrent ? 900 : 700, 
                      color: isCurrent ? '#1e293b' : '#64748b',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.1
                    }}
                  >
                    {node.koName}
                    <Box component="span" sx={{ display: 'block', fontSize: '0.6rem', fontWeight: 500, opacity: 0.7 }}>
                      {node.name}
                    </Box>
                  </Typography>
                </Box>
                
                {i < evoChain.length - 1 && (
                  <EastIcon sx={{ 
                    fontSize: 16, 
                    color: '#cbd5e1', 
                    mx: { xs: 1, sm: 2 }, 
                    mb: 4 // 화살표 위치를 중앙으로 재조정
                  }} />
                )}
              </Stack>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}