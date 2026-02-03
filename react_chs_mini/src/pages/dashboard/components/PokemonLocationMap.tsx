/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Box, CircularProgress, Grid, Paper } from "@mui/material";
import { usePokemonLocation } from "../../map/hooks/usePokemonLocation";
import { useMapRegion } from "./hooks/useMapRegion";

// 분리된 서브 컴포넌트 임포트
import PokemonLocationMapHeader from "./PokemonLocationMapHeader";
import { usePokemonLocationMap } from "./hooks/usePokemonLocationMap";
import PokemonLocationMapDisplay from "./PokemonLocationMapDisplay";
import PokemonLocationMapInfoPanel from "./PokemonLocationMapInfoPanel";
import { POKEMON_OPTIONS } from "../../../api/datas/pokemonData";

export default function PokemonLocationMap({ pokemon, loading, onPokemonSelect }: { pokemon: any; loading: boolean; onPokemonSelect?: (name: string) => void; }) {
  const { locations } = usePokemonLocation(pokemon?.id);
  const { currentRegion, setCurrentRegion, regionData } = useMapRegion(locations);
  
  // 커스텀 훅 사용
  const { 
    zoom, position, isDragging, 
    handleZoomIn, handleZoomOut, handleReset, 
    onDragStart, onDragMove, onDragEnd 
  } = usePokemonLocationMap();

  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [areaPokemons, setAreaPokemons] = useState<any[]>([]);
  const [isAreaLoading, setIsAreaLoading] = useState(false);

  // 데이터 필터링 로직 (Memo)
  const filteredLocations = useMemo(() => {
    if (!locations || !regionData?.locations) return [];
    const entries = Object.entries(regionData.locations);
    return locations.reduce((acc: any[], current: any) => {
      const apiName = current.location_area.name.toLowerCase();
      const match = entries.find(([key]) => apiName.includes(key.toLowerCase()));
      if (match && !acc.some(item => item.matchKey === match[0])) {
        acc.push({ ...current, matchKey: match[0] });
      }
      return acc;
    }, []);
  }, [locations, regionData]);

  // 지역 포켓몬 데이터 페칭
  const handleFetchAreaPokemons = async (loc: any) => {
    setSelectedLocation(loc);
    setViewMode('detail');
    setIsAreaLoading(true);
    try {
      const response = await fetch(loc.location_area.url);
      const data = await response.json();
      
      const raw = data.pokemon_encounters.map((e: any) => {
        const id = Number(e.pokemon.url.split('/').filter(Boolean).pop());
        // POKEMON_OPTIONS에서 해당 id의 데이터 찾기
        const pokemonData = POKEMON_OPTIONS.find(p => p.id === id);
        
        return {
          name: e.pokemon.name,
          id: id,
          koName: pokemonData ? pokemonData.koName : "미확인 포켓몬" // 한글명 매핑
        };
      });

      // 현재 포켓몬을 상단으로 정렬
      const sorted = [
        ...raw.filter((p: any) => p.name === pokemon.name),
        ...raw.filter((p: any) => p.name !== pokemon.name)
      ];
      setAreaPokemons(sorted);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setIsAreaLoading(false);
    }
  };

  if (loading || !pokemon || !regionData) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
  }

  return (
    <Grid container sx={{ mt: 2 }}>
      <PokemonLocationMapHeader 
        currentRegion={currentRegion} 
        onRegionChange={(_: any, val: any) => { setCurrentRegion(val); handleReset(); setViewMode('list'); }} 
      />
      <Paper elevation={0} sx={{ 
        p: { xs: 2, md: 4 }, 
        width: '100%', 
        border: "1px solid #e2e8f0", 
        borderRadius: "24px",
        minHeight: { xs: 'auto', lg: '100%' }, 
        maxHeight: { xs: 'auto', lg: '100%' } 
      }}>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* [좌측 지도 영역]  */}
          <Grid size={{ xs: 12, lg: 9 }}>
            <PokemonLocationMapDisplay 
              regionImg={regionData.img} zoom={zoom} position={position} isDragging={isDragging}
              locations={filteredLocations} regionMetadata={regionData.locations}
              selectedMatchKey={selectedLocation?.matchKey}
              onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleReset}
              onMarkerClick={handleFetchAreaPokemons}
              onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd}
            />
          </Grid>

          {/* [우측 패널 영역]  */}
          <Grid size={{ xs: 12, lg: 3 }}>
            <PokemonLocationMapInfoPanel 
              viewMode={viewMode} setViewMode={setViewMode}
              regionName={regionData.koName}
              selectedLocationName={selectedLocation ? (regionData.locations as any)[selectedLocation.matchKey]?.koName : ''}
              locations={filteredLocations} regionMetadata={regionData.locations}
              areaPokemons={areaPokemons} isAreaLoading={isAreaLoading}
              currentPokemonName={pokemon.name} onLocationClick={handleFetchAreaPokemons}
              onPokemonSelect={onPokemonSelect}
            />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}