/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Paper,
  Grid,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LanguageIcon from "@mui/icons-material/Language";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import { getPrimaryColor } from "./utils/pokemonUtils";
import TodayPickCard from "./components/TodayPickCard";
import StatRadarChart from "./components/StatRadarChart";
import TypePieChart from "./components/TypePieChart";
import ActionCard from "./components/ActionCard";
import AllTypeBarChart from "./components/AllTypeBarChart";
import TopRankerCard from "./components/TopRankerCard";

export default function MainDashboard() {
  const [pokemon, setPokemon] = useState<any>(null);
  const [topRankers, setTopRankers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const randomId = Math.floor(Math.random() * 800) + 1;
        const [countRes, pokeRes] = await Promise.all([
          fetch("https://pokeapi.co/api/v2/pokemon?limit=1"),
          fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`),
        ]);
        const countData = await countRes.json();
        const currentPoke = await pokeRes.json();

        // 1. 해당 타입의 포켓몬 목록 가져오기
        const typeRes = await fetch(currentPoke.types[0].type.url);
        const typeData = await typeRes.json();

        // 2. 상위 10마리 정도의 상세 데이터를 먼저 가져옴 (정렬을 위해)
        // Tip: 실제 운영 시에는 모든 포켓몬의 BST가 저장된 DB가 필요하지만,
        // 여기서는 샘플 15마리를 가져와 그중 진짜 강한 순으로 정렬합니다.
        const sampleList = typeData.pokemon.slice(0, 15);
        const detailedList = await Promise.all(
          sampleList.map((p: any) =>
            fetch(p.pokemon.url).then((r) => r.json()),
          ),
        );

        // 🔥 3. 핵심: 종족값 합계(BST) 계산 후 내림차순 정렬
        const rankedList = detailedList.sort((a, b) => {
          const bstA = a.stats.reduce(
            (acc: number, cur: any) => acc + cur.base_stat,
            0,
          );
          const bstB = b.stats.reduce(
            (acc: number, cur: any) => acc + cur.base_stat,
            0,
          );
          return bstB - bstA; // 높은 순서대로 (내림차순)
        });

        setTotalCount(countData.count);
        setPokemon(currentPoke);
        // 정렬된 리스트에서 최상위 3마리만 추출
        setTopRankers(rankedList.slice(0, 3));
      } catch (e) {
        console.error("데이터 정렬 중 오류 발생", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 20 }}>
        <CircularProgress />
      </Box>
    );

  const primaryColor = getPrimaryColor(pokemon.types);

  return (
    <Box
      sx={{ flexGrow: 1, p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}
    >
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
            포켓몬 관리 대시보드
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
          <Grid size={{ xs: 12, md: 4 }}>
            <TodayPickCard pokemon={pokemon} color={primaryColor} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <StatRadarChart
                  stats={pokemon.stats}
                  color={primaryColor}
                  name={pokemon.name}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TypePieChart types={pokemon.types} />
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
                mt: 3,
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
