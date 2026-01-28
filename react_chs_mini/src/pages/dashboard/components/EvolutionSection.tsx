import { Box, Typography, Stack, Avatar } from "@mui/material";
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
    <Box sx={{ my: 2, p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 1 }}>
      <Typography variant="caption" fontWeight={900} color="#94a3b8" display="block" mb={1.5} textAlign="left">
        진화 과정 (클릭 시 해당 포켓몬 분석)
      </Typography>
      
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
        {evoChain.map((node, i) => {
          const isCurrent = node.name === currentPokemonName;
          
          return (
            <Stack key={node.name} direction="row" alignItems="center">
              <Box sx={{ textAlign: 'center' }}>
                <Avatar 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${node.id}.png`} 
                  // ⭐ 클릭 이벤트 연결
                  onClick={() => !isCurrent && onSelectPokemon(node.name)} 
                  sx={{ 
                    width: 65, 
                    height: 65, 
                    border: isCurrent ? `3px solid ${activeColor}` : '1px solid #cbd5e1', 
                    p: 0.5, 
                    bgcolor: 'white', 
                    mx: 'auto',
                    cursor: isCurrent ? 'default' : 'pointer', // ⭐ 커서 모양 변경
                    transition: 'all 0.2s',
                    '&:hover': { 
                      transform: isCurrent ? 'none' : 'scale(1.15)',
                      boxShadow: isCurrent ? 'none' : '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }} 
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mt: 1, 
                    fontSize: '0.75rem', 
                    fontWeight: isCurrent ? 900 : 600, 
                    color: isCurrent ? activeColor : '#64748b' 
                  }}
                >
                  {node.koName}<br/>({node.name})
                </Typography>
              </Box>
              
              {i < evoChain.length - 1 && (
                <EastIcon sx={{ fontSize: 20, color: '#cbd5e1', mx: 0.8, mb: 4 }} />
              )}
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}