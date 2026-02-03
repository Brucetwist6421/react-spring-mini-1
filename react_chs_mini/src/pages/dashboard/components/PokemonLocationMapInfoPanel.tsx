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
  Button,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SearchOffIcon from "@mui/icons-material/SearchOff";

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
  currentPokemonKoName?: string;
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
  currentPokemonKoName,
}: InfoPanelProps) {
  
  // 공통 Empty State 컴포넌트
  const EmptyState = ({ message, subMessage, showReset }: any) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        p: 4,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          bgcolor: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <SearchOffIcon sx={{ fontSize: 32, color: "#94a3b8" }} />
      </Box>
      <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#475569", mb: 1 }}>
        {message}
      </Typography>
      <Typography variant="caption" sx={{ color: "#94a3b8", lineHeight: 1.5, mb: 3 }}>
        {subMessage}
      </Typography>
      {showReset && (
        <Button
          variant="contained"
          size="small"
          onClick={() => setViewMode("list")}
          startIcon={<ArrowBackIcon />}
          sx={{
            borderRadius: "12px",
            bgcolor: "#10b981",
            "&:hover": { bgcolor: "#059669" },
            textTransform: "none",
            boxShadow: "none",
          }}
        >
          지역 목록으로 돌아가기
        </Button>
      )}
    </Box>
  );

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", maxHeight: { xs: "500px", lg: "700px" } }}>
      <Typography
        variant="h6"
        fontWeight={800}
        sx={{ mb: 2, color: "#475569", display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}
      >
        <LocationOnIcon color="error" />
        {viewMode === "list" ? `${regionName}지방 서식지` : selectedLocationName}
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          flexGrow: 1,
          minHeight: 0,
          borderRadius: "24px",
          bgcolor: "#ffffff",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {viewMode === "list" ? (
          /* --- [모드 1] 서식지 목록 뷰 --- */
          <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, ...scrollbarStyle, display: 'flex', flexDirection: 'column' }}>
            {locations.length > 0 ? (
              <>
                <Typography variant="caption" sx={{ px: 2, mb: 1, display: "block", color: "#94a3b8", fontWeight: 700 }}>
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
              </>
            ) : (
              <EmptyState 
                message={`${currentPokemonKoName}(${currentPokemonName})의 서식지 없음`}
                subMessage={`현재 ${regionName}지방에서는 야생 ${currentPokemonKoName}(${currentPokemonName})이(가) 발견되지 않습니다.`}
              />
            )}
          </Box>
        ) : (
          /* --- [모드 2] 선택된 지역 상세 뷰 --- */
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ p: 2, display: "flex", alignItems: "center", borderBottom: "1px solid #f1f5f9", bgcolor: "#f8fafc", flexShrink: 0 }}>
              <IconButton onClick={() => setViewMode("list")} size="small">
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 800 }}>지역 목록으로 돌아가기</Typography>
            </Box>

            {isAreaLoading ? (
              <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
                <CircularProgress size={32} />
              </Box>
            ) : areaPokemons.length > 0 ? (
              <Box sx={{ flexGrow: 1, overflowY: "auto", ...scrollbarStyle }}>
                <List disablePadding>
                  {areaPokemons.map((p, idx) => (
                    <Box key={p.id}>
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => onPokemonSelect?.(p.id)} sx={{ py: 1.5, px: 2 }}>
                          <ListItemAvatar>
                            <Avatar
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                              sx={{ bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                                <Stack direction="column" spacing={0.5} alignItems="flex-start">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', flexWrap: 'wrap' }}>
                                        <Typography variant="body2" fontWeight={800} sx={{ color: p.name === currentPokemonName ? "#10b981" : "#1e293b" }}>
                                        {p.koName}
                                        </Typography>
                                        {p.name === currentPokemonName && (
                                        <Chip label="현재" size="small" sx={{ height: 16, fontSize: "0.55rem", bgcolor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', fontWeight: 700 }} />
                                        )}
                                    </Box>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                        ({p.name.toUpperCase()})
                                    </Typography>
                                </Stack>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                      {idx < areaPokemons.length - 1 && <Divider variant="inset" component="li" />}
                    </Box>
                  ))}
                </List>
              </Box>
            ) : (
              <EmptyState 
                message="출현 정보 없음"
                subMessage="이 구역에서 발견되는 포켓몬 데이터가 존재하지 않습니다."
                showReset
              />
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}