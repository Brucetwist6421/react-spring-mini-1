/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Tooltip, CircularProgress } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { KANTO_LOCATIONS } from "../../api/datas/gen1MapData";

export default function PokemonMap({ locations, loading }: { locations: any[], loading: boolean }) {
  
  // 1. 중복 좌표 제거 로직: 동일한 matchKey(장소)에 대해 핀은 하나만 생성
  const uniqueDisplayLocations = locations.reduce((acc: any[], current: any) => {
    const apiLocationName = current.location_area.name;
    const matchKey = Object.keys(KANTO_LOCATIONS).find(key => apiLocationName.includes(key));
    
    // 매칭되는 좌표가 있고, 아직 결과 배열에 해당 장소가 없다면 추가
    if (matchKey && !acc.some(item => item.matchKey === matchKey)) {
      acc.push({ ...current, matchKey });
    } else if (!matchKey) {
      console.warn("매칭되지 않은 장소:", apiLocationName);
    }
    return acc;
  }, []);

  return (
    <Box sx={{ position: "relative", width: "100%", borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
      {loading && (
        <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.5)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* 배경 지도 */}
      <img src="/images/maps/kanto_map.png" alt="Kanto Map" style={{ width: "100%", display: "block" }} />

      {/* 정제된 위치 데이터를 기반으로 핀 렌더링 */}
      {uniqueDisplayLocations.map((loc, index) => {
        const pos = KANTO_LOCATIONS[loc.matchKey];

        return (
          <Tooltip title={pos.koName} key={index} arrow>
            <LocationOnIcon 
              sx={{ 
                position: "absolute", 
                // 좌표값 설정
                left: `${pos.x}%`, 
                top: `${pos.y}%`, 
                // 스타일 설정
                color: "#ef4444", 
                fontSize: "2.5rem",
                // 중요: 핀의 하단 중앙이 정확한 좌표를 가리키도록 설정
                transform: "translate(-50%, -100%)",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translate(-50%, -110%) scale(1.2)",
                  color: "#b91c1c",
                  zIndex: 20
                },
                // 애니메이션 (선택 사항)
                animation: "pulse 2s infinite ease-in-out",
                "@keyframes pulse": {
                   "0%": { opacity: 0.8 },
                   "50%": { opacity: 1 },
                   "100%": { opacity: 0.8 }
                }
              }} 
            />
          </Tooltip>
        );
      })}
    </Box>
  );
}