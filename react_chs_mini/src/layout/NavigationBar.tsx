import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Avatar } from "@mui/material";
import { Dashboard, CatchingPokemon, AddCircle, Settings } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 260;

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 표시용

  const menuItems = [
    { text: "대시보드", icon: <Dashboard />, path: "/" },
    { text: "포켓몬 목록", icon: <CatchingPokemon />, path: "/" },
    { text: "새 포켓몬 등록", icon: <AddCircle />, path: "/pokemon/create" },
    { text: "설정", icon: <Settings />, path: "/settings" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#1e293b", // 실무에서 선호하는 다크 블루톤 (Slate 800)
          color: "#f8fafc",
          borderRadius: 0, // 곡률 제거
          borderRight: "1px solid rgba(255, 255, 255, 0.1)", // 헤더와 경계선 통일
        },
      }}
    >
      {/* 사이드바 상단 로고 영역 */}
      <Box sx={{ p: 3, textAlign: "center", borderBottom: "1px solid #334155" }}>
        <Typography variant="h6" fontWeight="bold" color="#38bdf8">
          POKEMON ADMIN
        </Typography>
      </Box>

      <Box sx={{ overflow: "auto", mt: 2 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: "8px",
                  "&.Mui-selected": { backgroundColor: "#38bdf8", color: "#fff" },
                  "&.Mui-selected:hover": { backgroundColor: "#0ea5e9" },
                  "&:hover": { backgroundColor: "#334155" },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? "#fff" : "#94a3b8", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                    primary={
                        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                        {item.text}
                        </Typography>
                    } 
                    />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* 사이드바 하단 프로필 영역 */}
      <Box sx={{ p: 2, mt: "auto", borderTop: "1px solid #334155", display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ bgcolor: "#38bdf8" }}>AD</Avatar>
        <Box>
          <Typography variant="body2" fontWeight="bold">Admin User</Typography>
          <Typography variant="caption" color="#94a3b8">Premium Plan</Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default NavigationBar;