import LanguageIcon from "@mui/icons-material/Language";
import ListAltIcon from "@mui/icons-material/ListAlt";
import StarIcon from "@mui/icons-material/Star";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import {
  Box,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import RandomSpinner from "../../components/RandomSpinner";
import ActionCard from "./components/ActionCard";
import AllTypeBarChart from "./components/AllTypeBarChart";
import PokemonSkillTable from "./components/PokemonSkillTable";
import RecommendedSkills from "./components/RecommendedSkills";
import StatRadarChart from "./components/StatRadarChart";
import TodayPickCard from "./components/TodayPickCard";
import TopRankerCard from "./components/TopRankerCard";
import TypePieChart from "./components/TypePieChart";
import { usePokemonDashboard } from "./components/hooks/usePokemonDashboard";
import { usePokemonMoves } from "./components/hooks/usePokemonMoves";
import { TYPE_STAT_DATA } from "./components/types/dashboardType";
import { getPrimaryColor } from "./utils/pokemonUtils";

export default function MainDashboard() {
  // 1. 커스텀 훅으로 로직 분리
  const { pokemon, topRankers, totalCount, loading, handleFetchPokemon } = usePokemonDashboard();
  
  // 2. 파생 데이터 계산 (가벼운 로직만 남김)
  const pokemonMoves = pokemon?.moves || [];
  const { detailedMoves, isLoading: movesLoading } = usePokemonMoves(pokemonMoves);
  const primaryColor = getPrimaryColor(pokemon?.types);


  if (loading || !pokemon)
    return (
      <RandomSpinner/>
    );


  // 포켓몬 타입 이름 가져오기 (예: 'electric')
  const typeName = pokemon?.types?.[0]?.type?.name;

  // TYPE_STAT_DATA에서 해당 타입의 스탯 객체 가져오기
  const currentTypeAverage = typeName ? TYPE_STAT_DATA[typeName] : null;


  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
            포켓몬 분석 대시보드
          </Typography>
          <Paper sx={{ p: 2, border: "2px solid #1e293b", borderRadius: 0 }}>
            <Typography variant="caption" display="block">
              전체 등록 포켓몬 수
            </Typography>
            <Typography variant="h5" fontWeight={900}>
              {totalCount.toLocaleString()}
            </Typography>
          </Paper>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              <TodayPickCard pokemon={pokemon} color={primaryColor} onSelect={handleFetchPokemon}/>
              <RecommendedSkills 
                movesWithDetail={detailedMoves} 
                loading={movesLoading}
                pokemonStats={pokemon.stats} // 이 부분!
                pokemonTypes={pokemon.types}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <StatRadarChart
                  typeAverage={currentTypeAverage} // 찾은 평균 데이터를 전달
                  stats={pokemon.stats}
                  color={primaryColor}
                  name={pokemon.name}
                  typeName={typeName}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TypePieChart types={pokemon.types} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <PokemonSkillTable moves={pokemon.moves} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <AllTypeBarChart />
             </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                mt: 1,
              }}
            >
              <WorkspacePremiumIcon sx={{ color: "#f59e0b" }} />
              <Typography variant="h6" fontWeight={800}>
                {pokemon.types[0].type.name.toUpperCase()} 속성 상위 랭커
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {topRankers.map((p, i) => (
                <TopRankerCard key={p.id} p={p} rank={i + 1} />
              ))}
            </Grid>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: 700 }}>
              권장 관리 작업
            </Typography>
            <Grid container spacing={2}>
              <ActionCard
                icon={<StarIcon />}
                title="관심 포켓몬"
                desc="즐겨찾기 관리"
                color="#f59e0b"
              />
              <ActionCard
                icon={<ListAltIcon />}
                title="속성 리포트"
                desc="데이터 분석"
                color="#3b82f6"
              />
              <ActionCard
                icon={<LanguageIcon />}
                title="서식지 지도"
                desc="분포도 확인"
                color="#10b981"
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
