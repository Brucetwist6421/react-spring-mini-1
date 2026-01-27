/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Box, Paper, Typography, Container, CircularProgress, Grid } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LanguageIcon from "@mui/icons-material/Language";

// 모듈화된 컴포넌트들
import { getPrimaryColor } from "./utils/pokemonUtils";
import TodayPickCard from "./components/TodayPickCard";
import StatRadarChart from "./components/StatRadarChart";
import TypePieChart from "./components/TypePieChart";
import ActionCard from "./components/ActionCard";
import AllTypeBarChart from "./components/AllTypeBarChart";

// 상단 요약 지표 한글화
const SUMMARY_METRICS_KO = [
  { label: '전체 포켓몬 수', key: 'count', color: '#1e293b' },
  { label: '등록된 속성', value: '18종', color: '#3b82f6' },
  { label: '평균 종족값', value: '432', color: '#10b981' },
  { label: '최신 업데이트', value: '9세대', color: '#f59e0b' },
];

export default function MainDashboard() {
  const [pokemon, setPokemon] = useState<any>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        const [countRes, pokeRes] = await Promise.all([
          fetch("https://pokeapi.co/api/v2/pokemon?limit=1"),
          fetch(`https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 898) + 1}`)
        ]);
        const countData = await countRes.json();
        const pokeData = await pokeRes.json();
        setTotalCount(countData.count);
        setPokemon(pokeData);
      } catch (e) {
        console.error("데이터 로딩 에러", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress sx={{ color: '#1e293b' }} />
    </Box>
  );

  const primaryColor = getPrimaryColor(pokemon.types);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mb: 4 }}>
          포켓몬 통합 관리 대시보드
        </Typography>

        {/* 1. 글로벌 핵심 지표 (Metrics Summary) */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {SUMMARY_METRICS_KO.map((metric, i) => (
            <Grid key={i} size={{ xs: 6, md: 3 }}>
              <Paper sx={{ p: 2.5, borderRadius: 0, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b", textTransform: 'uppercase' }}>
                  {metric.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: metric.color }}>
                  {metric.key === 'count' ? totalCount.toLocaleString() : metric.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* 2. 개별 포켓몬 분석 (Today's Pick) */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TodayPickCard pokemon={pokemon} color={primaryColor} />
          </Grid>

          {/* 3. 차트 섹션: 개별 분석 & 글로벌 분석 */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <StatRadarChart stats={pokemon.stats} color={primaryColor} name={pokemon.name} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TypePieChart types={pokemon.types} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <AllTypeBarChart />
              </Grid>
            </Grid>
          </Grid>

          {/* 4. 추천 메뉴 (주요 관리 기능) */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mb: 2, mt: 1, fontWeight: 700, color: '#334155' }}>
              권장 관리 작업
            </Typography>
            <Grid container spacing={2}>
              <ActionCard 
                icon={<StarIcon fontSize="small" />} 
                title="즐겨찾기 도감" 
                desc="관심 포켓몬 목록을 관리합니다." 
                color="#f59e0b" 
              />
              <ActionCard 
                icon={<ListAltIcon fontSize="small" />} 
                title="속성 심층 분석" 
                desc="18개 속성별 통계 리포트를 확인합니다." 
                color="#3b82f6" 
              />
              <ActionCard 
                icon={<LanguageIcon fontSize="small" />} 
                title="지역별 분포 지도" 
                desc="서식지별 출현 빈도를 모니터링합니다." 
                color="#10b981" 
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}