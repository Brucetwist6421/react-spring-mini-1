/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Stack,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface InfoPanelProps {
  viewMode: "list" | "detail";
  setViewMode: (mode: "list" | "detail") => void;
  regionName: string;
  selectedLocationName: string;
  locations: any[];
  regionMetadata: Record<string, any>;
  areaPokemons: any[];
  isAreaLoading: boolean;
  currentPokemonName: string;
  onLocationClick: (loc: any) => void;
  onPokemonSelect?: (id: string) => void; 
}

// 스크롤바 스타일 공통 적용
const scrollbarStyle = {
  "&::-webkit-scrollbar": { width: "6px" },
  "&::-webkit-scrollbar-track": { backgroundColor: "#f1f5f9" },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#cbd5e1",
    borderRadius: "10px",
    "&:hover": { backgroundColor: "#94a3b8" },
  },
};

export default function PokemonLocationMapInfoPanel({
  viewMode,
  setViewMode,
  regionName,
  selectedLocationName,
  locations,
  regionMetadata,
  areaPokemons,
  isAreaLoading,
  currentPokemonName,
  onLocationClick,
  onPokemonSelect,
}: InfoPanelProps) {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column",maxHeight: { xs: "500px", lg: "700px" } }}>
      <Typography
        variant="h6"
        fontWeight={800}
        sx={{ mb: 2, color: "#475569", display: "flex", alignItems: "center", gap: 1 }}
      >
        <LocationOnIcon color="error" />
        {viewMode === "list" ? `${regionName}지방 서식지` : selectedLocationName}
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          height: { xs: "450px", md: "100%" },
          borderRadius: "24px",
          bgcolor: "#ffffff",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {viewMode === "list" ? (
          /* --- [모드 1] 서식지 목록 뷰 --- */
          <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, ...scrollbarStyle }}>
            <Typography
              variant="caption"
              sx={{ px: 2, mb: 1, display: "block", color: "#94a3b8", fontWeight: 700 }}
            >
              출현 구역 ({locations.length})
            </Typography>
            <List disablePadding>
              {locations.map((loc) => (
                <ListItemButton
                  key={loc.matchKey}
                  onClick={() => onLocationClick(loc)}
                  sx={{ borderRadius: "12px", mb: 1, border: "1px solid #f1f5f9" }}
                >
                  <ListItemText
                    primary={<Typography fontWeight={700}>{regionMetadata[loc.matchKey]?.koName}</Typography>}
                    secondary="야생 출현 정보 보기"
                  />
                  <ArrowForwardIosIcon sx={{ fontSize: 12, color: "#cbd5e1" }} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        ) : (
          /* --- [모드 2] 선택된 지역 상세 뷰 --- */
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ p: 2, display: "flex", alignItems: "center", borderBottom: "1px solid #f1f5f9", bgcolor: "#f8fafc" }}>
              <IconButton onClick={() => setViewMode("list")} size="small">
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 800 }}>지역 목록으로 돌아가기</Typography>
            </Box>

            {isAreaLoading ? (
              <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <Box sx={{ flexGrow: 1, overflowY: "auto", ...scrollbarStyle }}>
                <List disablePadding>
                  {areaPokemons.map((p, idx) => (
                    <Box key={p.id}>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => onPokemonSelect?.(p.id)}
                          sx={{ py: 1.5, px: 2, "&:hover": { bgcolor: "#f1f5f9" } }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                              sx={{ bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                                <Stack 
                                direction="column" // 9:3 비율에서는 가로보다 세로 배치가 텍스트 잘림을 방지합니다.
                                spacing={0.5} 
                                alignItems="flex-start"
                                >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', flexWrap: 'wrap' }}>
                                    <Typography variant="body2" fontWeight={800} sx={{ color: p.name === currentPokemonName ? "#1d4ed8" : "#1e293b" }}>
                                    {p.koName}
                                    </Typography>
                                    {p.name === currentPokemonName && (
                                    <Chip label="현재" size="small" color="primary" sx={{ height: 16, fontSize: "0.55rem" }} />
                                    )}
                                </Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                    ({p.name.toUpperCase()})
                                </Typography>
                                </Stack>
                                }
                                slotProps={{
                                    secondary: {
                                    sx: { fontSize: '0.7rem', color: '#94a3b8' }
                                    }
                                }}
                                />
                        </ListItemButton>
                      </ListItem>
                      {idx < areaPokemons.length - 1 && <Divider variant="inset" component="li" />}
                    </Box>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}