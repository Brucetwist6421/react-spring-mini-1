/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, Typography, Stack, Chip, Skeleton, Divider } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BoltIcon from '@mui/icons-material/Bolt';
import ShieldIcon from '@mui/icons-material/Shield';
import PsychologyIcon from '@mui/icons-material/Psychology';

interface RecommendedSkillsProps {
  movesWithDetail: any[];
  loading: boolean;
  pokemonStats: any[];
  pokemonTypes: any[];
  variant?: "horizontal" | "vertical"; // ✅ variant 타입 추가
}

export default function RecommendedSkills({ 
  movesWithDetail, 
  loading, 
  pokemonStats, 
  pokemonTypes,
  variant = "vertical" // ✅ 기본값 설정
}: RecommendedSkillsProps) {
  
  if (loading) {
    return (
      <Paper sx={{ p: 2, borderRadius: 0, border: "1px solid #e2e8f0", boxShadow: "none" }}>
        <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
        <Stack direction={variant === "horizontal" ? "row" : "column"} spacing={2}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={100} sx={{ flex: 1 }} />
          ))}
        </Stack>
      </Paper>
    );
  }

  // --- 기존 AI 로직 (동일) ---
  const attack = pokemonStats.find(s => s.stat.name === 'attack')?.base_stat || 0;
  const spAttack = pokemonStats.find(s => s.stat.name === 'special-attack')?.base_stat || 0;
  const mainStatType = attack > spAttack ? 'physical' : 'special';
  const myTypeNames = pokemonTypes.map(t => t.type.name);

  const scoredMoves = movesWithDetail.map(m => {
    let score = m.power || 0;
    const reasons: string[] = [];
    if (score > 0) {
      if (myTypeNames.includes(m.type)) { score *= 1.5; reasons.push("타입 일치"); }
      if (m.category === mainStatType) { score *= 1.2; reasons.push("스탯 최적화"); }
    }
    return { ...m, aiScore: score, reasons };
  });

  const highPowerSet = [...scoredMoves].filter((m) => m.power).sort((a, b) => b.aiScore - a.aiScore).slice(0, 4);
  const balancedSet = [...scoredMoves].filter((m) => m.accuracy === 100 && m.power).sort((a, b) => b.aiScore - a.aiScore).slice(0, 4);
  const utilitySet = [...scoredMoves].filter((m) => !m.power).slice(0, 4);

  const recommendationData = [
    { title: `${mainStatType === 'physical' ? '물리' : '특수'} 최적화`, icon: <BoltIcon sx={{ fontSize: 16, color: "#ef4444" }} />, moves: highPowerSet, tag: "OFFENSE", color: "#ef4444" },
    { title: "안정적 밸런스", icon: <ShieldIcon sx={{ fontSize: 16, color: "#3b82f6" }} />, moves: balancedSet, tag: "STABLE", color: "#3b82f6" },
    { title: "기술적 유틸리티", icon: <PsychologyIcon sx={{ fontSize: 16, color: "#10b981" }} />, moves: utilitySet, tag: "STRATEGY", color: "#10b981" },
  ];

  return (
    <Paper sx={{ 
      p: 2.5, 
      borderRadius: 0, 
      border: "1px solid #e2e8f0", 
      boxShadow: "none", 
      // ✅ 가로 배치일 때는 고정 높이를 해제하여 유연하게 대응
      height: variant === "horizontal" ? "auto" : 406, 
      overflowY: 'auto' 
    }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b" }}>
            AI 추천 스킬 세트
          </Typography>
        </Box>
        <Chip label={mainStatType.toUpperCase()} size="small" variant="outlined" sx={{ fontSize: '0.65rem', fontWeight: 700 }} />
      </Box>

      {/* ✅ 핵심 수정 부분: variant에 따라 Stack 방향 조절 */}
      <Stack 
        direction={variant === "horizontal" ? { xs: "column", md: "row" } : "column"} 
        spacing={2}
      >
        {recommendationData.map((rec, idx) => (
          <Box
            key={idx}
            sx={{
              flex: 1, // ✅ 가로 배치 시 1:1:1 비율 유지
              p: 1.5,
              border: "1px solid #f1f5f9",
              bgcolor: "#f8fafc",
              display: 'flex',
              flexDirection: 'column',
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)", bgcolor: "#fff", boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {rec.icon}
                <Typography variant="caption" sx={{ fontWeight: 900, color: rec.color, whiteSpace: 'nowrap' }}>
                  {rec.title}
                </Typography>
              </Box>
              <Chip label={rec.tag} size="small" sx={{ height: 16, fontSize: "0.55rem", fontWeight: 800, bgcolor: rec.color, color: "white", borderRadius: 0 }} />
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
                      fontSize: "0.65rem",
                      height: 20,
                      borderColor: m.reasons?.length > 0 ? rec.color : "#e2e8f0",
                      bgcolor: "white",
                      fontWeight: 600,
                    }}
                  />
                ))
              ) : (
                <Typography variant="caption" color="text.secondary">기술 부족</Typography>
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