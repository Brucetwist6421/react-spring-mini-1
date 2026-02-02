/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Chip, Grid, Stack, Tabs, Tab, Paper, Typography, CircularProgress, Tooltip, IconButton } from "@mui/material"; // Grid2 권장
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import { usePokemonDashboard } from "./hooks/usePokemonDashboard";
import { usePokemonLocation } from "../../map/hooks/usePokemonLocation";
import { useMapRegion } from "./hooks/useMapRegion";
import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { REGION_METADATA, type RegionId } from "./datas/pokemonMapData";

export default function PokemonLocationMap() {
  const { pokemon, loading: pokemonLoading } = usePokemonDashboard();
  const { locations, loading: locationLoading } = usePokemonLocation(pokemon?.id);
  const { currentRegion, setCurrentRegion, regionData } = useMapRegion(locations);

  // 1. 확대/축소 및 위치 상태
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 2. 필터링 로직 (useMemo)
  const filteredLocations = useMemo(() => {
    if (!locations || !regionData || !regionData.locations) return [];
    return locations.reduce((acc: any[], current: any) => {
      const apiName = current.location_area.name.toLowerCase();
      const matchKey = Object.keys(regionData.locations).find(key => 
        apiName.includes(key.toLowerCase())
      );
      if (matchKey && !acc.some(item => item.matchKey === matchKey)) {
        acc.push({ ...current, matchKey });
      }
      return acc;
    }, []);
  }, [locations, regionData]);

  // 3. 핸들러 함수들
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.5, 1);
    setZoom(newZoom);
    if (newZoom === 1) setPosition({ x: 0, y: 0 }); // 1배율일 때 위치 초기화
  };
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleRegionChange = (_: any, newValue: RegionId) => {
    setCurrentRegion(newValue);
    handleReset(); // 지역 변경 시 줌/위치 초기화
  };

  // 4. 드래그 로직
  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return; // 1배율일 때는 드래그 방지
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // 드래그 범위 제한 (이미지가 컨테이너 밖으로 너무 나가지 않도록 설정 가능)
    setPosition({ x: newX, y: newY });
  };

  const onMouseUp = () => setIsDragging(false);

  if (pokemonLoading || !pokemon || !regionData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (pokemonLoading || !pokemon || !regionData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid size={{ xs: 12 }} sx={{ mt: 8 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", mb: 3, flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LanguageIcon sx={{ color: "#10b981", fontSize: "2rem" }} />
          <Typography variant="h5" fontWeight={900} sx={{ color: "#1e293b" }}>
            지역별 서식지 분석
          </Typography>
        </Stack>

        <Tabs 
          value={currentRegion} 
          onChange={handleRegionChange} 
          variant="scrollable"
          sx={{ bgcolor: '#f1f5f9', borderRadius: '12px', p: 0.5 }}
        >
          {Object.values(REGION_METADATA).map((reg) => (
            <Tab key={reg.id} value={reg.id} label={reg.koName} sx={{ 
              fontWeight: 800,
              minHeight: '40px',
              borderRadius: '8px',
              '&.Mui-selected': {
                bgcolor: '#ffffff', // 선택된 탭 강조
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }
            }} />
          ))}
        </Tabs>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, border: "1px solid #e2e8f0", borderRadius: "24px", bgcolor: "#ffffff" }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* 지도 컨테이너: overflow "hidden" 필수 */}
            <Box 
              sx={{ 
                position: "relative", 
                width: "100%", 
                borderRadius: "16px", 
                overflow: "hidden", 
                border: "1px solid #e2e8f0", 
                bgcolor: "#f8fafc",
                cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                touchAction: "none" // 모바일 드래그 충돌 방지
              }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp} // 마우스가 영역을 벗어나도 드래그 중지
            >
              
              {/* 컨트롤 버튼 (우측 상단 고정) */}
              <Stack direction="column" spacing={1} sx={{ position: "absolute", top: 16, right: 16, zIndex: 30 }}>
                <IconButton onClick={handleZoomIn} sx={{ bgcolor: "white", boxShadow: 2, "&:hover": { bgcolor: "#f1f5f9" } }}><AddIcon /></IconButton>
                <IconButton onClick={handleZoomOut} sx={{ bgcolor: "white", boxShadow: 2, "&:hover": { bgcolor: "#f1f5f9" } }}><RemoveIcon /></IconButton>
                <IconButton onClick={handleReset} sx={{ bgcolor: "white", boxShadow: 2, "&:hover": { bgcolor: "#f1f5f9" } }}><RestartAltIcon /></IconButton>
              </Stack>

              {/* 확대가 적용되는 실제 내용물 영역 */}
              <Box sx={{ 
                transition: isDragging ? "none" : "transform 0.3s ease-out", 
                transformOrigin: "center center",
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              }}>
                {locationLoading && (
                  <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.3)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                )}
                
                <img 
                  src={regionData.img} 
                  alt="Map" 
                  style={{ width: "100%", display: "block", userSelect: "none", pointerEvents: "none" }} 
                />

                {filteredLocations.map((loc, index) => {
                  const pos = (regionData.locations as any)[loc.matchKey];
                  if (!pos) return null;
                  return (
                    <Tooltip title={pos.koName} key={index} arrow>
                      <LocationOnIcon 
                        sx={{ 
                          position: "absolute", 
                          left: `${pos.x}%`, 
                          top: `${pos.y}%`, 
                          color: "#ef4444", 
                          fontSize: `${2.5 / zoom}rem`, // 확대해도 핀 크기는 일정하게 유지
                          transform: "translate(-50%, -100%)",
                          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                          cursor: "pointer",
                          transition: "font-size 0.3s ease",
                          pointerEvents: "auto" // 아이콘은 클릭 가능하도록
                        }} 
                      />
                    </Tooltip>
                  );
                })}
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 3, color: "#475569", display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOnIcon color="error" /> {regionData.koName}지방 출현 구역
            </Typography>

            <Stack spacing={1.5} sx={{ maxHeight: "500px", overflowY: "auto", pr: 1 }}>
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc, idx) => {
                  // pos 상수를 선언하여 타입 에러를 방지하고 안전하게 데이터를 가져온다.
                  const pos = (regionData.locations as any)[loc.matchKey];

                  // 혹시라도 매칭되는 좌표 데이터가 없을 경우를 대비한 방어 코드.
                  if (!pos) return null;

                  return (
                    <Box 
                      key={idx} 
                      sx={{ 
                        p: 2, 
                        bgcolor: "#f8fafc", 
                        borderRadius: "12px", 
                        border: "1px solid #f1f5f9", 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center" 
                      }}
                    >
                      <Typography variant="body2" fontWeight={700} color="#1e293b">
                        {pos.koName}
                      </Typography>
                      <Chip 
                        label="야생" 
                        size="small" 
                        sx={{ fontWeight: 600, fontSize: "0.7rem" }} 
                      />
                    </Box>
                  );
                })
              ) : (
                <Box sx={{ textAlign: "center", py: 8, bgcolor: "#f8fafc", borderRadius: "12px" }}>
                  <Typography variant="body2" color="text.secondary">
                    {regionData.koName}지방에서는 발견되지 않습니다.
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}