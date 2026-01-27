/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Typography, Avatar, Box, Chip, Divider, Stack, LinearProgress } from "@mui/material";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PublicIcon from '@mui/icons-material/Public'; 
import EastIcon from '@mui/icons-material/East';
import MapIcon from '@mui/icons-material/Map';
import InsightsIcon from '@mui/icons-material/Insights';
import { usePokemonAnalytics } from "./hooks/usePokemonAnalytics";
import { STAT_LABELS, TYPE_MAP, TYPE_STAT_DATA } from "./types/dashboardType";


export default function TodayPickCard({ pokemon, color }: any) {
  const { strengths, weaknesses, evoChain, habitat, typeRank, globalRank } = usePokemonAnalytics(pokemon);

  if (!pokemon) return null;

  // 인라인 계산 로직
  const statsMap = pokemon.stats.reduce((acc: any, cur: any) => ({ ...acc, [cur.stat.name]: cur.base_stat }), {});
  const bst = Object.values(statsMap).reduce((a: any, b: any) => (a as number) + (b as number), 0) as number;
  const primaryType = pokemon.types[0].type.name;
  const avgStats = TYPE_STAT_DATA[primaryType] || { hp: 70, attack: 70, defense: 70, "special-attack": 70, "special-defense": 70, speed: 70 };
  const performanceScore = Math.max(1, Math.min(10, Number(((bst - 180) / (720 - 180) * 10).toFixed(1))));

  const getRole = () => {
    if (statsMap.speed >= 110 && (statsMap.attack >= 100 || statsMap['special-attack'] >= 100)) return "고속 스위퍼";
    if (statsMap.hp >= 100 && (statsMap.defense >= 100 || statsMap['special-defense'] >= 100)) return "탱커/벽깔이";
    if (statsMap.attack >= 120 || statsMap['special-attack'] >= 120) return "어태커";
    return "밸런스형";
  };

  const currentKoName = evoChain.find(e => e.name === pokemon.name)?.koName || pokemon.name.toUpperCase();

  return (
    <Card sx={{ borderRadius: 0, p: 3, border: '1px solid #e2e8f0', boxShadow: 'none', textAlign: 'center' }}>
      <Typography variant="caption" sx={{ fontWeight: 900, color: '#94a3b8', display: 'block', mb: 1.5 }}>POKÉMON ANALYTICS</Typography>

      {/* 헤더 섹션 */}
      <Avatar src={pokemon.sprites.other['official-artwork'].front_default} sx={{ width: 120, height: 120, mx: 'auto', borderRadius: 0, mb: 1 }} />
      <Typography variant="h5" fontWeight={900}>{currentKoName}</Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, my: 1 }}>
        <Chip label={getRole()} size="small" sx={{ bgcolor: '#1e293b', color: 'white', fontWeight: 800, borderRadius: 0, fontSize: '0.65rem' }} />
        <Chip icon={<MapIcon style={{ fontSize: '12px' }} />} label={`서식지: ${habitat}`} size="small" sx={{ fontWeight: 800, borderRadius: 0, fontSize: '0.65rem', bgcolor: '#f1f5f9' }} />
        <Chip label={`전투력 : ${bst}`} size="small" variant="outlined" sx={{ fontWeight: 800, borderRadius: 0, fontSize: '0.65rem' }} />
      </Box>

      {/* 스탯 상세 분석 */}
      <Box sx={{ my: 3, textAlign: 'left' }}>
        <Typography variant="caption" fontWeight={900} sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>{TYPE_MAP[primaryType]} 속성 평균 대비 분석</Typography>
        <Stack spacing={1.2}>
          {pokemon.stats.map((s: any) => {
            const current = s.base_stat;
            const average = avgStats[s.stat.name];
            const diff = current - average;
            return (
              <Box key={s.stat.name}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>{STAT_LABELS[s.stat.name].label}</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 900, color: diff >= 0 ? '#10b981' : '#ef4444' }}>{diff >= 0 ? `+${diff}` : diff}</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 900 }}>{current}</Typography>
                  </Stack>
                </Box>
                <Box sx={{ position: 'relative', height: 6, bgcolor: '#f1f5f9', borderRadius: 1 }}>
                  <LinearProgress variant="determinate" value={(current / 200) * 100} sx={{ height: 6, bgcolor: 'transparent', borderRadius: 1, '& .MuiLinearProgress-bar': { bgcolor: STAT_LABELS[s.stat.name].color } }} />
                  <Box sx={{ position: 'absolute', left: `${(average / 200) * 100}%`, top: -2, bottom: -2, width: '2px', bgcolor: '#1e293b', zIndex: 1, opacity: 0.4 }} />
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 진화 및 상성 섹션 */}
      <Box sx={{ my: 2, p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 1 }}>
        <Typography variant="caption" fontWeight={900} color="#94a3b8" display="block" mb={1.5} textAlign="left">EVOLUTION CHAIN</Typography>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          {evoChain.map((node, i) => (
            <Stack key={node.name} direction="row" alignItems="center">
              <Box sx={{ textAlign: 'center' }}>
                <Avatar src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${node.id}.png`} sx={{ width: 65, height: 65, border: node.name === pokemon.name ? `3px solid ${color}` : '1px solid #cbd5e1', p: 0.5, bgcolor: 'white', mx: 'auto' }} />
                <Typography variant="caption" sx={{ display: 'block', mt: 1, fontSize: '0.75rem', fontWeight: node.name === pokemon.name ? 900 : 600, color: node.name === pokemon.name ? color : '#64748b' }}>{node.koName}</Typography>
              </Box>
              {i < evoChain.length - 1 && <EastIcon sx={{ fontSize: 20, color: '#cbd5e1', mx: 0.8, mb: 4 }} />}
            </Stack>
          ))}
        </Stack>
      </Box>

      <Box sx={{ textAlign: 'left', mb: 2 }}>
        <Typography variant="caption" fontWeight={900} color="#10b981" display="block" mb={0.5}>공략 유리: {strengths.map(s => <Chip key={s} label={s} size="small" sx={{ mr: 0.5, height: 18, fontSize: '0.6rem', bgcolor: '#ecfdf5', color: '#10b981' }} />)}</Typography>
        <Typography variant="caption" fontWeight={900} color="#ef4444" display="block" mt={1}>공략 취약: {weaknesses.map(w => <Chip key={w} label={w} size="small" sx={{ mr: 0.5, height: 18, fontSize: '0.6rem', bgcolor: '#fef2f2', color: '#ef4444' }} />)}</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* 하단 랭킹 지표 */}
      <Stack spacing={1.5} sx={{ px: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center"><InsightsIcon sx={{ fontSize: 18, color: '#8b5cf6' }} /><Typography variant="body2" fontWeight={800}>전투 잠재력</Typography></Stack>
          <Typography variant="h6" fontWeight={900} color="#8b5cf6">{performanceScore}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center"><WorkspacePremiumIcon sx={{ fontSize: 18, color }} /><Typography variant="body2" fontWeight={800}>{TYPE_MAP[primaryType]} 속성 내</Typography></Stack>
          <Typography variant="body2" fontWeight={900} color={color}>상위 {typeRank}%</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center"><PublicIcon sx={{ fontSize: 18, color: '#64748b' }} /><Typography variant="body2" fontWeight={800}>전체 포켓몬 중</Typography></Stack>
          <Typography variant="body2" fontWeight={900} color="#64748b">상위 {globalRank}%</Typography>
        </Box>
      </Stack>
    </Card>
  );
}