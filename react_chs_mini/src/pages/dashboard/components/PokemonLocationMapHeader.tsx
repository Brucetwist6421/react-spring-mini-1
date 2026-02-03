/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, Typography, Tabs, Tab } from "@mui/material";
import { REGION_METADATA } from "./datas/pokemonMapData";
import LanguageIcon from "@mui/icons-material/Language";

export default function PokemonLocationMapHeader({ currentRegion, onRegionChange }: any) {
  return (
  <Box sx={{ display: "flex", width: '100%', alignItems: "center", mb: 3, flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
    <Stack direction="row" spacing={1.5} alignItems="center">
      <LanguageIcon sx={{ color: "#10b981", fontSize: "2rem" }} />
      <Typography variant="h5" fontWeight={900}>지역별 서식지 분석</Typography>
    </Stack>
    <Tabs value={currentRegion} onChange={onRegionChange} variant="scrollable" scrollButtons="auto">
      {Object.values(REGION_METADATA).map((reg) => (
        <Tab key={reg.id} value={reg.id} label={reg.koName} sx={{ fontWeight: 700 }} />
      ))}
    </Tabs>
  </Box>
);
}