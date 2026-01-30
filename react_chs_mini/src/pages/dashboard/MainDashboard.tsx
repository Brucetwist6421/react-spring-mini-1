/* eslint-disable @typescript-eslint/no-explicit-any */
import LanguageIcon from "@mui/icons-material/Language";
import ListAltIcon from "@mui/icons-material/ListAlt";
import StarIcon from "@mui/icons-material/Star";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RandomSpinner from "../../components/RandomSpinner";
import ActionCard from "./components/ActionCard";
import AllTypeBarChart from "./components/AllTypeBarChart";
import PokemonSearch from "./components/PokemonSearch";
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
import FavoriteButton from "./components/FavoriteButton";
import { useRef } from "react";
import { usePokemonLocation } from "../map/hooks/usePokemonLocation";
import PokemonMap from "../map/PokemonMap";
import { KANTO_LOCATIONS } from "../../api/datas/gen1MapData";
import LocationOn from "@mui/icons-material/LocationOn";

export default function MainDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 스크롤 이동을 위한 ref 추가
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const { pokemon, topRankers, totalCount, loading, handleFetchPokemon } = usePokemonDashboard();

  // 서식지 데이터 호출 (추가)
  const { locations, loading: locationLoading } = usePokemonLocation(pokemon?.id);

  const pokemonMoves = pokemon?.moves || [];
  const { detailedMoves, isLoading: movesLoading } = usePokemonMoves(pokemonMoves);
  const primaryColor = getPrimaryColor(pokemon?.types);

  if (loading || !pokemon) return <RandomSpinner />;

  const typeName = pokemon?.types?.[0]?.type?.name;
  const currentTypeAverage = typeName ? TYPE_STAT_DATA[typeName] : null;

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: { xs: 2, md: 4 }, 
      backgroundColor: "#f8fafc", 
      minHeight: "100vh" 
    }}>
      {/* maxWidth={false}로 설정하여 전체 화면을 넓게 사용합니다 */}
      <Container maxWidth={false} sx={{ px: { xl: 8 } }}>
        
        {/* --- 헤더 통합 컨테이너 --- */}
        <Box sx={{ mb: 6, width: "100%" }}>
  
          {/* [1] 최상단 검색 영역: 사용자가 가장 먼저 접근하는 도구 */}
          <Box sx={{ 
            width: "100%", 
            mb: 4, 
            p: 2.5, 
            bgcolor: "#f8fafc", 
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            display: "flex",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
          }}>
            <Box sx={{ width: "100%", maxWidth: "800px" }}>
              <PokemonSearch onSearch={handleFetchPokemon} />
            </Box>
          </Box>

          {/* [2] 하단 제목 및 지표 영역: 검색 결과의 맥락 표시 */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-end",
            px: 1 // 양끝 여백 살짝 추가
          }}>
            {/* 좌측 제목 영역 */}
            <Box>
              <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 1000, color: "#1e293b", letterSpacing: "-1.5px" }}>
                포켓몬 분석 대시보드
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.8 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  현재 포켓몬:
                </Typography>
                <Chip 
                  label={`${pokemon.koName} (${pokemon.name})`}
                  size="small" 
                  sx={{ 
                    bgcolor: `${primaryColor}15`, 
                    color: primaryColor, 
                    fontWeight: 800,
                    borderRadius: "6px",
                    border: `1px solid ${primaryColor}30`
                  }} 
                />
                {/* 즐겨찾기 버튼 */}
                {pokemon && <FavoriteButton pokemonId={pokemon.id} pokemonName={pokemon.name} pokemonKoName={pokemon.koName} />}
              </Stack>
            </Box>

            {/* 우측 지표 영역 */}
            <Paper 
              elevation={0}
              onClick={() => navigate("/pokemonList")}
              sx={{ 
                p: 3, px: 4,
                border: "1px solid #e2e8f0", 
                borderRadius: "16px", 
                cursor: "pointer",
                // textAlign: "right", // 우측 정렬로 변경하여 엣지 강조
                transition: "all 0.2s ease",
                "&:hover": { 
                  borderColor: primaryColor,
                  bgcolor: "#ffffff",
                  transform: "scale(1.02)"
                },
                justifyContent: "center",  // 세로 중앙
                alignItems: "center",      // 가로 중앙
                textAlign: "center",       // 텍스트 자체 중앙 정렬
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 650, fontSize: '1.5rem', display: 'block' }}>
                전체 포켓몬 개수
              </Typography>
              <Typography variant="h5" fontWeight={1000} sx={{ color: '#1e293b', lineHeight: 1.2, fontSize: '1.rem' }}>
                {totalCount.toLocaleString()}
              </Typography>
            </Paper>
          </Box>

        </Box>

        {/* --- [2] 메인 섹션: 2컬럼 레이아웃 --- */}
        <Grid container spacing={4}>
          {/* 좌측: 주요 정보 카드 */}
          <Grid size={{ xs: 12, lg: 4, xl: 3.5 }}>
            <Stack spacing={4}>
              <TodayPickCard pokemon={pokemon} color={primaryColor} onSelect={handleFetchPokemon}/>
              <RecommendedSkills 
                movesWithDetail={detailedMoves} 
                loading={movesLoading}
                pokemonStats={pokemon.stats}
                pokemonTypes={pokemon.types}
              />
            </Stack>
          </Grid>

          {/* 우측: 차트 및 데이터 테이블 */}
          <Grid size={{ xs: 12, lg: 8, xl: 8.5 }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <StatRadarChart
                  typeAverage={currentTypeAverage}
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
                <Paper sx={{ overflow: "hidden", boxShadow: "none", borderRadius: 0, border: "1px solid #e2e8f0" }}>
                  <PokemonSkillTable moves={pokemon.moves} />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <AllTypeBarChart />
              </Grid>
            </Grid>
          </Grid>

          {/* --- 랭킹 섹션 --- */}
          <Grid size={{ xs: 12 }}>
            {/* 타이틀 영역도 중앙 정렬 혹은 적절한 간격 유지 */}
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: { xs: 'center', md: 'flex-start' }, // 모바일은 중앙, 데스크탑은 좌측 정렬
              gap: 1.5, 
              mb: 3, 
              mt: 6 
            }}>
              <WorkspacePremiumIcon sx={{ color: "#f59e0b", fontSize: "2rem" }} />
              <Typography variant="h5" fontWeight={900} sx={{ color: "#1e293b" }}>
                {pokemon.types.map((t: any) => t.type.name.toUpperCase()).join(" / ")} 관련 타입 랭커
              </Typography>
            </Box>
            
            {/* 랭커 카드 그리드: 데이터가 3개일 때 중앙으로 모아 우측 빈 공간 해결 */}
            <Grid 
              container 
              spacing={3} 
              sx={{ 
                justifyContent: "center", // ✅ 핵심: 카드가 3개일 때 중앙으로 배치하여 균형을 잡음
                maxWidth: "1400px",       // 화면이 너무 넓어지면 카드가 너무 멀어지므로 최대 너비 제한
                mx: "auto"                // 중앙 정렬
              }}
            >
              {topRankers.map((p, i) => (
                <Grid 
                  key={p.id}
                  // md: 4는 3개가 한 줄을 꽉 채우게 하고, lg 이상에서 xl: 3 대신 md: 4를 유지하여 3개일 때 최적화
                  size={{ xs: 12, sm: 6, md: 4 }} 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center' 
                  }}
                >
                  {/* 카드 내부 width를 100%로 하여 Grid 칸을 꽉 채우게 함 */}
                  <Box sx={{ width: '100%', maxWidth: '400px' }}> 
                    <TopRankerCard p={p} rank={i + 1} onSelect={handleFetchPokemon} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
              
          {/* --- [3] 서식지 분석 섹션 (추가) --- */}
          <Grid size={{ xs: 12 }} ref={mapSectionRef} sx={{ mt: 8 }}>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: { xs: 'center', md: 'flex-start' }, 
              gap: 1.5, 
              mb: 3 
            }}>
              <LanguageIcon sx={{ color: "#10b981", fontSize: "2rem" }} />
              <Typography variant="h5" fontWeight={900} sx={{ color: "#1e293b" }}>
                서식지 분석 (관동지방)
              </Typography>
            </Box>

            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 2, md: 4 }, 
                border: "1px solid #e2e8f0", 
                borderRadius: "24px", 
                bgcolor: "#ffffff"
              }}
            >
              <Grid container spacing={4}>
                {/* 왼쪽: 지도 */}
                <Grid size={{ xs: 12, lg: 8 }}>
                  <PokemonMap locations={locations} loading={locationLoading} />
                </Grid>

                {/* 오른쪽: 상세 장소 리스트 */}
                <Grid size={{ xs: 12, lg: 4 }}>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 3, color: "#475569", display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn color="error" /> 출현 지역
                  </Typography>
                  <Stack spacing={1.5} sx={{ maxHeight: '500px', overflowY: 'auto', pr: 1 }}>
                    {locations.length > 0 ? (
                      locations.map((loc, idx) => {
                        const areaName = loc.location_area.name;
                        const matchKey = Object.keys(KANTO_LOCATIONS).find(key => areaName.includes(key));
                        const koName = matchKey ? KANTO_LOCATIONS[matchKey].koName : areaName;

                        return (
                          <Box key={idx} sx={{ 
                            p: 2, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9",
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}>
                            <Typography variant="body2" fontWeight={700} color="#1e293b">{koName}</Typography>
                            <Chip label="야생" size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                          </Box>
                        );
                      })
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f8fafc', borderRadius: '12px' }}>
                        <Typography variant="body2" color="text.secondary">
                          이 포켓몬은 관동지방 야생에서<br/>발견되지 않는 희귀종입니다.
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* 권장 관리 작업 */}
          {/* --- 하단 빠른 작업 (Quick Actions) --- */}
          <Grid size={{ xs: 12 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                mt: 6, 
                fontWeight: 800, 
                color: "#1e293b",
                textAlign: { xs: 'center', md: 'left' } // 모바일에서는 중앙 정렬
              }}
            >
              빠른 작업
            </Typography>
            
            <Grid 
              container 
              spacing={3} 
              sx={{ 
                justifyContent: "center", // ✅ 핵심: 카드가 3개일 때 중앙으로 정렬하여 빈 공간 해소
                maxWidth: "1400px",       // 대화면에서 너무 퍼지지 않게 제한
                mx: "auto" 
              }}
            >
              {[
                { icon: <StarIcon />, title: "관심 포켓몬", desc: "즐겨찾기 관리", color: "#f59e0b" },
                { icon: <ListAltIcon />, title: "속성 리포트", desc: "상세 통계 분석", color: "#3b82f6" },
                { 
                  icon: <LanguageIcon />, 
                  title: "서식지 지도", 
                  desc: "전 세계 분포도", 
                  color: "#10b981",
                  // ✅ 클릭 시 위에서 만든 ref 위치로 스크롤
                  action: () => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
                }
              ].map((action, idx) => (
                <Grid 
                  key={idx}
                  // ✅ md: 4 설정을 통해 데스크톱에서 3개가 한 줄(4+4+4=12)을 꽉 채우게 합니다.
                  // xl에서도 4를 유지하면 3개가 항상 가로를 가득 채웁니다.
                  size={{ xs: 12, sm: 6, md: 4 }} 
                  sx={{ 
                    display: 'flex',
                    flexGrow: 1 // 남는 미세한 공간까지 꽉 채움
                  }}
                >
                  {/* 카드 너비가 너무 무한정 늘어나면 안 예쁘므로 maxWidth를 살짝 잡아줍니다 */}
                  <Box sx={{ width: '100%', maxWidth: '450px', mx: 'auto' }}
                    onClick={action.action} // ✅ 클릭 이벤트 연결
                  >
                    <ActionCard {...action} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}