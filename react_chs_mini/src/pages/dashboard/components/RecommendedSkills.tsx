/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, Typography, Stack, Chip, Skeleton, Divider } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BoltIcon from '@mui/icons-material/Bolt';
import ShieldIcon from '@mui/icons-material/Shield';
import PsychologyIcon from '@mui/icons-material/Psychology';

interface RecommendedSkillsProps {
  movesWithDetail: any[];
  loading: boolean;
  pokemonStats: any[]; // 💥 추가: 포켓몬 스탯
  pokemonTypes: any[]; // 💥 추가: 포켓몬 타입
}

export default function RecommendedSkills({ movesWithDetail, loading, pokemonStats, pokemonTypes }: RecommendedSkillsProps) {
  
  if (loading) {
    return (
      <Paper sx={{ p: 2, borderRadius: 0, border: "1px solid #e2e8f0", boxShadow: "none" }}>
        <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={80} />
          ))}
        </Stack>
      </Paper>
    );
  }

  // 1. 포켓몬 성향 분석 (AI 기초 데이터)
  const attack = pokemonStats.find(s => s.stat.name === 'attack')?.base_stat || 0;
  const spAttack = pokemonStats.find(s => s.stat.name === 'special-attack')?.base_stat || 0;
  // 공격력이 높으면 'physical', 특공이 높으면 'special' 기술에 가중치
  const mainStatType = attack > spAttack ? 'physical' : 'special';
  const myTypeNames = pokemonTypes.map(t => t.type.name);

  // 2. 기술별 AI 점수 산출 로직
  const scoredMoves = movesWithDetail.map(m => {
    let score = m.power || 0;
    const reasons: string[] = [];

    if (score > 0) {
      // 가중치 A: 자속 보정 (STAB) - 타입이 일치하면 위력 1.5배
      if (myTypeNames.includes(m.type)) {
        score *= 1.5;
        reasons.push("타입 일치");
      }
      // 가중치 B: 스탯 적합도 - 포켓몬의 주력 스탯 카테고리와 일치하면 점수 추가
      if (m.category === mainStatType) {
        score *= 1.2;
        reasons.push("스탯 최적화");
      }
    }
    return { ...m, aiScore: score, reasons };
  });

  // 3. 추천 세트 구성 (변경됨)
  
  // A. AI 최적화 공격 조합 (가산점 포함 최고 점수 순)
  const highPowerSet = [...scoredMoves]
    .filter((m) => m.power)
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 4);

  // B. 안정적 밸런스 세트 (명중 100이면서 AI 점수가 높은 순)
  const balancedSet = [...scoredMoves]
    .filter((m) => m.accuracy === 100 && m.power)
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 4);

  // C. 전략적 유틸리티 (위력은 없지만 보조 효과가 있는 기술)
  const utilitySet = [...scoredMoves]
    .filter((m) => !m.power)
    .slice(0, 4);

  const recommendationData = [
    {
      title: `${mainStatType === 'physical' ? '물리' : '특수'} 최적화 조합`,
      icon: <BoltIcon sx={{ fontSize: 16, color: "#ef4444" }} />,
      moves: highPowerSet,
      tag: "OFFENSE",
      color: "#ef4444",
    },
    {
      title: "안정적 밸런스",
      icon: <ShieldIcon sx={{ fontSize: 16, color: "#3b82f6" }} />,
      moves: balancedSet,
      tag: "STABLE",
      color: "#3b82f6",
    },
    {
      title: "기술적 유틸리티",
      icon: <PsychologyIcon sx={{ fontSize: 16, color: "#10b981" }} />,
      moves: utilitySet,
      tag: "STRATEGY",
      color: "#10b981",
    },
  ];

  return (
    <Paper sx={{ p: 2, borderRadius: 0, border: "1px solid #e2e8f0", boxShadow: "none", height: 406, overflowY: 'auto' }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b" }}>
            AI 추천 스킬 세트
          </Typography>
        </Box>
        <Chip 
          label={mainStatType.toUpperCase()} 
          size="small" 
          variant="outlined" 
          sx={{ fontSize: '0.65rem', fontWeight: 700 }} 
        />
      </Box>

      <Stack spacing={2}>
        {recommendationData.map((rec, idx) => (
          <Box
            key={idx}
            sx={{
              p: 1.5,
              border: "1px solid #f1f5f9",
              bgcolor: "#f8fafc",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.01)", bgcolor: "#fff" },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {rec.icon}
                <Typography variant="caption" sx={{ fontWeight: 900, color: rec.color }}>
                  RANK {idx + 1}. {rec.title}
                </Typography>
              </Box>
              <Chip
                label={rec.tag}
                size="small"
                sx={{
                  height: 16,
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  bgcolor: rec.color,
                  color: "white",
                  borderRadius: 0,
                }}
              />
            </Box>

            <Divider sx={{ my: 1, opacity: 0.5 }} />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {rec.moves.length > 0 ? (
                rec.moves.map((m: any, i: number) => (
                  <Chip
                    key={i}
                    label={m.koName || m.move.name}
                    variant="outlined"
                    size="small"
                    sx={{
                      fontSize: "0.7rem",
                      height: 22,
                      borderColor: m.reasons?.length > 0 ? rec.color : "#e2e8f0", // 최적화된 기술은 컬러 강조
                      bgcolor: "white",
                      fontWeight: 600,
                    }}
                  />
                ))
              ) : (
                <Typography variant="caption" color="text.secondary">
                  분석 가능한 기술이 부족합니다.
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Stack>
      
      <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#94a3b8', textAlign: 'center' }}>
        * 포켓몬의 스탯 성향과 타입을 분석한 지능형 추천입니다.
      </Typography>
    </Paper>
  );
}