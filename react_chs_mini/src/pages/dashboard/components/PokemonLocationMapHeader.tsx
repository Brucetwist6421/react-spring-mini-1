/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, Typography, Tabs, Tab, Paper } from "@mui/material";
import { REGION_METADATA } from "./datas/pokemonMapData";
import LanguageIcon from "@mui/icons-material/Language";

export default function PokemonLocationMapHeader({ currentRegion, onRegionChange }: any) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        p: { xs: 1.5, md: 2 }, // 모바일 여백 최적화
        mb: 3,
        borderRadius: "24px",
        bgcolor: "#f8fafc",
        border: "1px solid #e2e8f0",
        display: "flex",
        // 핵심: md(900px) 미만일 때는 세로 정렬로 전환하여 공간 확보
        flexDirection: { xs: 'column', md: 'row' }, 
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: "space-between",
        gap: { xs: 1.5, md: 2 }
      }}
    >
      {/* 왼쪽: 타이틀 섹션 */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            display: 'flex',
            p: 1,
            borderRadius: '12px',
            bgcolor: '#ffffff',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
            // 모바일에서 아이콘 크기 살짝 축소
            flexShrink: 0 
          }}
        >
          <LanguageIcon sx={{ color: "#10b981", fontSize: { xs: "1.5rem", md: "1.8rem" } }} />
        </Box>
        <Box sx={{ minWidth: 0 }}> {/* 텍스트 넘침 방지 */}
          <Typography 
            variant="h6" 
            fontWeight={900} 
            sx={{ 
              color: '#1e293b', 
              lineHeight: 1.2,
              fontSize: { xs: '1rem', md: '1.25rem' }, // 폰트 크기 가변형
              whiteSpace: 'nowrap' 
            }}
          >
            지역별 서식지 분석
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#64748b', 
              fontWeight: 600,
              display: { xs: 'none', sm: 'block' } // 아주 작은 화면에선 부가설명 생략
            }}
          >
            지방별 포켓몬 출현 위치 확인
          </Typography>
        </Box>
      </Stack>

      {/* 오른쪽: 탭 메뉴 섹션 */}
      <Box sx={{ 
        // 핵심: 화면이 줄어들 때 타이틀과 겹치지 않게 최대 너비 제한
        maxWidth: { xs: '100%', md: 'calc(100% - 220px)' }, 
        bgcolor: '#ffffff', 
        borderRadius: '16px', 
        p: 0.5,
        border: '1px solid #f1f5f9',
        boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.03)',
        overflow: 'hidden' 
      }}>
        <Tabs 
          value={currentRegion} 
          onChange={onRegionChange} 
          variant="scrollable" 
          scrollButtons={false} // 화살표 제거하여 공간 확보
          sx={{
            minHeight: { xs: '40px', md: '48px' },
            '& .MuiTabs-scroller': {
              '&::-webkit-scrollbar': { display: 'none' }, // 스크롤바 숨김
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            },
            '& .MuiTabs-indicator': {
              height: '100%',
              borderRadius: '12px',
              bgcolor: 'rgba(16, 185, 129, 0.12)', 
              zIndex: 0,
            },
            '& .MuiTab-root': {
              minHeight: { xs: '40px', md: '48px' },
              minWidth: { xs: '80px', md: '100px' },
              fontWeight: 800,
              fontSize: { xs: '0.9rem', md: '1rem' },
              letterSpacing: '-0.02em',
              color: '#64748b',
              px: { xs: 2, md: 3 },
              zIndex: 1,
              transition: 'all 0.2s ease',
              '&.Mui-selected': { color: '#059669' },
              '&:hover': { color: '#10b981' }
            }
          }}
        >
          {Object.values(REGION_METADATA).map((reg) => (
            <Tab key={reg.id} value={reg.id} label={reg.koName} />
          ))}
        </Tabs>
      </Box>
    </Paper>
  );
}