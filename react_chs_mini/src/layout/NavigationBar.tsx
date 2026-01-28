import { useState } from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Avatar, IconButton } from "@mui/material";
import { Dashboard, CatchingPokemon, AddCircle, Settings, CatchingPokemonTwoTone, Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const fullWidth = 260;
const collapsedWidth = 88; // 접혔을 때의 너비

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true); // 사이드바 상태 관리

  const toggleDrawer = () => setOpen(!open);

  const menuItems = [
    { text: "대시보드", icon: <Dashboard />, path: "/" },
    { text: "기존 포켓몬 목록", icon: <CatchingPokemon />, path: "/pokemonList" },
    { text: "새 포켓몬 목록", icon: <CatchingPokemonTwoTone />, path: "/newPokemonList" },
    { text: "새 포켓몬 등록", icon: <AddCircle />, path: "/pokemon/create" },
    { text: "설정", icon: <Settings />, path: "/settings" },
  ];

  const currentWidth = open ? fullWidth : collapsedWidth;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: currentWidth,
        flexShrink: 0,
        whiteSpace: "nowrap", // 텍스트 줄바꿈 방지 (애니메이션 자연스럽게)
        "& .MuiDrawer-paper": {
          width: currentWidth,
          transition: "width 0.3s ease-in-out", // 부드러운 애니메이션
          overflowX: "hidden",
          boxSizing: "border-box",
          backgroundColor: "#1e293b",
          color: "#f8fafc",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 0,
        },
      }}
    >
      {/* 사이드바 상단 로고 및 토글 버튼 */}
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: open ? "space-between" : "center", borderBottom: "1px solid #334155" }}>
        {open && (
          <Typography variant="h6" fontWeight="bold" color="#38bdf8" sx={{ ml: 1 }}>
            POKEMON
          </Typography>
        )}
        <IconButton onClick={toggleDrawer} sx={{ color: "#94a3b8" }}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* 메뉴 리스트 */}
      <Box sx={{ overflow: "auto", mt: 2 }}>
        <List sx={{ px: open ? 2 : 1.5 }}>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isSelected}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    borderRadius: "8px",
                    "&.Mui-selected": { backgroundColor: "#38bdf8", color: "#fff" },
                    "&.Mui-selected:hover": { backgroundColor: "#0ea5e9" },
                    "&:hover": { backgroundColor: "#334155" },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isSelected ? "#fff" : "#94a3b8", 
                    minWidth: 0, 
                    mr: open ? 2 : "auto", 
                    justifyContent: "center" 
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ fontSize: "14px", fontWeight: 500 }} 
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* 하단 프로필 영역 */}
      <Box sx={{ p: 2, mt: "auto", borderTop: "1px solid #334155", display: "flex", justifyContent: open ? "flex-start" : "center", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ bgcolor: "#38bdf8", width: 32, height: 32, fontSize: '0.8rem' }}>AD</Avatar>
        {open && (
          <Box sx={{ overflow: "hidden" }}>
            <Typography variant="body2" fontWeight="bold" noWrap>Admin User</Typography>
            <Typography variant="caption" color="#94a3b8" noWrap>Premium Plan</Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default NavigationBar;