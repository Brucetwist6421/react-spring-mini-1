/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Typography, Avatar, Box, Chip, Divider, Stack, LinearProgress } from "@mui/material";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PublicIcon from '@mui/icons-material/Public'; 
import MapIcon from '@mui/icons-material/Map';
import InsightsIcon from '@mui/icons-material/Insights';

import { usePokemonAnalytics } from "./hooks/usePokemonAnalytics";
import { STAT_LABELS, TYPE_COLORS, TYPE_MAP, TYPE_STAT_DATA } from "./types/dashboardType";
import RandomSpinner from "../../../components/RandomSpinner";
import EvolutionSection from "./EvolutionSection";

export default function TodayPickCard({ pokemon, color, onSelect}: any) {
  const { strengths, weaknesses, evoChain, habitat, typeRank, globalRank, isLoading } = usePokemonAnalytics(pokemon);

  if (!pokemon) return null;

  // 1. 데이터 가공 및 계산 로직
  const statsMap = pokemon.stats.reduce((acc: any, cur: any) => ({ ...acc, [cur.stat.name]: cur.base_stat }), {});
  const bst = Object.values(statsMap).reduce((a: any, b: any) => (a as number) + (b as number), 0) as number;
  const primaryType = pokemon.types[0].type.name;
  const avgStats = TYPE_STAT_DATA[primaryType] || { hp: 70, attack: 70, defense: 70, "special-attack": 70, "special-defense": 70, speed: 70 };
  const performanceScore = Math.max(1, Math.min(10, Number(((bst - 180) / (720 - 180) * 10).toFixed(1))));
  const pokedexNumber = `#${String(pokemon.id).padStart(4, '0')}`;
  //세대 및 지역 판별 함수
  const getPokemonOrigin = (id: number) => {
    if (id <= 151) return { gen: 1, region: "관동" };
    if (id <= 251) return { gen: 2, region: "성도" };
    if (id <= 386) return { gen: 3, region: "호연" };
    if (id <= 493) return { gen: 4, region: "신오" };
    if (id <= 649) return { gen: 5, region: "하나" };
    if (id <= 721) return { gen: 6, region: "칼로스" };
    if (id <= 809) return { gen: 7, region: "알로라" };
    if (id <= 898) return { gen: 8, region: "가라르" };
    if (id <= 1025) return { gen: 9, region: "팔데아" };
    return { gen: 0, region: "기타" };
  };
  const origin = getPokemonOrigin(pokemon.id);

  const getRole = () => {
    if (statsMap.speed >= 110 && (statsMap.attack >= 100 || statsMap['special-attack'] >= 100)) return "고속 스위퍼";
    if (statsMap.hp >= 100 && (statsMap.defense >= 100 || statsMap['special-defense'] >= 100)) return "탱커/벽깔이";
    if (statsMap.attack >= 120 || statsMap['special-attack'] >= 120) return "어태커";
    return "밸런스형";
  };

  const currentKoName = evoChain.find(e => e.name === pokemon.name)?.koName || pokemon.name.toUpperCase();
  console.log(pokemon);
  // 2. 로딩 처리
  if (isLoading) {
    return (
      <Card sx={{ height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: 0 }}>
        <RandomSpinner />
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 0, p: 3, border: '1px solid #e2e8f0', boxShadow: 'none', textAlign: 'center', overflow: "auto" }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>POKÉMON 분석</Typography>

      {/* 헤더 섹션 */}
      <Avatar src={pokemon.sprites.other['official-artwork'].front_default} sx={{ width: 120, height: 120, mx: 'auto', borderRadius: 0, mb: 1 }} />
      <Typography variant="h5" fontWeight={900}>{currentKoName}({pokemon.name})</Typography>
      
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: 0.75, 
          my: 2, 
          flexWrap: 'wrap', //  화면이 좁아지면 자연스럽게 다음 줄로 이동
          px: 1 
        }}
      >
        {/* [그룹 1: 고유 식별 정보] */}
        <Stack direction="row" spacing={0.5}>
          <Chip 
            label={pokedexNumber} 
            size="small" 
            sx={{ 
              bgcolor: '#1e293b', 
              color: 'white', 
              fontWeight: 700, 
              borderRadius: '6px', 
              fontSize: '0.75rem' 
            }} 
          />
          <Chip 
            label={`${origin.gen}세대`} 
            size="small" 
            sx={{ 
              bgcolor: '#475569', 
              color: 'white', 
              fontWeight: 700, 
              borderRadius: '6px', 
              fontSize: '0.75rem'
            }} 
          />
        </Stack>

        {/* [그룹 2: 위치 및 지역 정보] */}
        <Stack direction="row" spacing={0.5}>
          <Chip 
            label={origin.region} 
            size="small" 
            variant="outlined"
            sx={{ 
              color: '#64748b', 
              borderColor: '#e2e8f0', 
              fontWeight: 700, 
              borderRadius: '6px', 
              fontSize: '0.75rem', 
              bgcolor: '#ffffff',
              '::before': { content: '"📍"', fontSize: '0.7rem', mr: -0.8 } 
            }} 
          />
          <Chip 
            icon={<MapIcon sx={{ fontSize: '14px !important', color: '#64748b' }} />} 
            label={habitat} 
            size="small" 
            sx={{ 
              fontWeight: 700, 
              borderRadius: '6px', 
              fontSize: '0.75rem', 
              bgcolor: '#f1f5f9',
              color: '#475569',
              border: '1px solid #e2e8f0'
            }} 
          />
        </Stack>
      </Box>

      {/* 타입, 역할, 전투력 칩 섹션 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {pokemon.types.map((t: any) => {
          const typeName = t.type.name;
          // TYPE_COLORS에서 색상을 찾고, 없으면 기본 회색(#94a3b8)을 사용합니다.
          const backgroundColor = TYPE_COLORS[typeName] || "#94a3b8";

          return (
            <Chip 
              key={typeName}
              label={typeName.toUpperCase()} 
              size="small" 
              sx={{ 
                bgcolor: backgroundColor, 
                color: 'white', 
                fontWeight: 500, 
                borderRadius: 0, 
                fontSize: '0.8rem',
                // 색상에 따라 텍스트 가독성을 높이기 위해 그림자 살짝 추가 (선택 사항)
                textShadow: '0px 1px 2px rgba(0,0,0,0.2)'
              }} 
            />
          );
        })}
        <Chip label={getRole()} size="small" sx={{ bgcolor: '#1e293b', color: 'white', fontWeight: 500, borderRadius: 0, fontSize: '0.8rem' }} />
        <Chip label={`전투력 : ${bst}`} size="small" variant="outlined" sx={{ fontWeight: 500, borderRadius: 0, fontSize: '0.8rem' }} />
      </Box>

      {/* 스탯 상세 분석 */}
      <Box sx={{ my: 3, textAlign: 'left' }}>
        <Typography variant="caption" fontWeight={900} sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>
          {TYPE_MAP[primaryType]} 속성 평균 대비 분석
        </Typography>
        
        <Stack spacing={1.5}>
          {pokemon.stats.map((s: any) => {
            const current = s.base_stat;
            const average = avgStats[s.stat.name];
            const diff = current - average;
            
            return (
              <Box key={s.stat.name}>
                {/* 상단 라벨 및 수치 영역 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#1e293b' }}>
                    {STAT_LABELS[s.stat.name].label}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} alignItems="center">
                    {/* [현재값 / 평균값] 표시 */}
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8' }}>
                      <span style={{ color: '#1e293b', fontWeight: 900 }}>{current}(현재)</span> / {average}(평균)
                    </Typography>
                    
                    {/* [차이값] 강조 표시 */}
                    <Box sx={{ 
                      minWidth: 35,
                      textAlign: 'right',
                      px: 0.6,
                      py: 0.1,
                      bgcolor: diff >= 0 ? '#ecfdf5' : '#fef2f2',
                      borderRadius: '4px'
                    }}>
                      <Typography sx={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 900, 
                        color: diff >= 0 ? '#10b981' : '#ef4444' 
                      }}>
                        {diff >= 0 ? `+${diff}` : diff}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* 프로그레스 바 영역 */}
                <Box sx={{ position: 'relative', height: 8, bgcolor: '#f1f5f9', borderRadius: 1, overflow: 'hidden' }}>
                  {/* 현재값 바 */}
                  <LinearProgress 
                    variant="determinate" 
                    value={(current / 200) * 100} 
                    sx={{ 
                      height: 8, 
                      bgcolor: 'transparent', 
                      '& .MuiLinearProgress-bar': { 
                        bgcolor: STAT_LABELS[s.stat.name].color,
                        borderRadius: 1
                      } 
                    }} 
                  />
                  {/* 평균선 마커 (검은 세로선) */}
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      left: `${(average / 200) * 100}%`, 
                      top: 0, 
                      bottom: 0, 
                      width: '2px', 
                      bgcolor: '#1e293b', 
                      zIndex: 1, 
                      opacity: 0.5 
                    }} 
                  />
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 진화 섹션: 내용 초과 시 내부 스크롤 생성 */}
      <Box 
        sx={{ 
          mx: -4.5,           // 왼쪽, 오른쪽으로 24px(3*8px)만큼 마진을 당김
          width: 'calc(100% + 48px)', // 늘어난 마진만큼 너비를 계산해서 보정
          px: 3,            // 배경은 끝까지 차되, 내부 아이콘들은 다시 안쪽으로 정렬
          py: 1,
          maxHeight: '260px', // 적절한 높이 제한
          height: 'auto',
          overflowY: 'auto',   // 세로 스크롤 활성화
          pr: 0.5,            // 스크롤바와 내용 사이 간격
          // 커스텀 스크롤바 스타일 (선택 사항)
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f5f9',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#cbd5e1',
            borderRadius: '10px',
          },
        }}
      >
        <EvolutionSection 
          evoChain={evoChain} 
          currentPokemonName={pokemon.name} 
          activeColor={color} 
          onSelectPokemon={onSelect}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 상성 정보 */}
      <Box sx={{ textAlign: 'left', mb: 2 }}>
        <Typography variant="caption" fontWeight={900} color="#10b981" display="block" mb={0.5}>
          공략 유리: {strengths.map(s => <Chip key={s} label={s} size="small" sx={{ mr: 0.5, height: 18, fontSize: '0.6rem', bgcolor: '#ecfdf5', color: '#10b981', fontWeight: 700, borderRadius: 0 }} />)}
        </Typography>
        <Typography variant="caption" fontWeight={900} color="#ef4444" display="block" mt={1}>
          공략 취약: {weaknesses.map(w => <Chip key={w} label={w} size="small" sx={{ mr: 0.5, height: 18, fontSize: '0.6rem', bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 700, borderRadius: 0 }} />)}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* 하단 랭킹 및 잠재력 지표 */}
      <Stack spacing={1.5} sx={{ px: 1 }}>
        <RankingRow icon={<InsightsIcon sx={{ color: '#8b5cf6' }} />} label="전투 잠재력(1:최저, 10:최고)" value={performanceScore} valueColor="#8b5cf6" />
        <RankingRow icon={<WorkspacePremiumIcon sx={{ color }} />} label={`${TYPE_MAP[primaryType]} 속성 내`} value={`상위 ${typeRank}%`} valueColor={color} />
        <RankingRow icon={<PublicIcon sx={{ color: '#64748b' }} />} label="전체 포켓몬 중" value={`상위 ${globalRank}%`} valueColor="#64748b" />
      </Stack>
    </Card>
  );
}

// 가독성을 위한 내부 서브 컴포넌트
function RankingRow({ icon, label, value, valueColor }: any) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {icon}
        <Typography variant="body2" fontWeight={800} color="#1e293b">{label}</Typography>
      </Stack>
      <Typography variant={typeof value === 'number' ? "h6" : "body2"} fontWeight={900} color={valueColor}>
        {value}
      </Typography>
    </Box>
  );
}