import { AddCircle, CatchingPokemon, CatchingPokemonTwoTone, ChevronLeft as ChevronLeftIcon, Dashboard, Menu as MenuIcon, Settings, ShowChart } from "@mui/icons-material";
import { Avatar, Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dditLogo from "../api/datas/dditLogo.png";

const fullWidth = 260;
const collapsedWidth = 88;
const AUTO_LOGOUT_TIME = 15 * 60 * 1000; // 15분을 밀리초로 환산

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- 자동 로그아웃 로직 추가 시작 ---
  
  const handleLogout = useCallback(() => {
    localStorage.clear();
    setIsLoggedIn(false);
    alert("오랫동안 활동이 없어 자동 로그아웃되었습니다.");
    window.location.href = "/"; // 메인으로 이동
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    if (!token) return; // 로그인 상태가 아니면 타이머 작동 안 함

    let timer: number;

    // 타이머 재설정 함수
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(handleLogout, AUTO_LOGOUT_TIME);
    };

    // 활동 감지 이벤트 리스너 등록
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // 처음 로드될 때 타이머 시작
    resetTimer();

    // 언마운트 시 클린업
    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [location, handleLogout]);

  // --- 자동 로그아웃 로직 추가 끝 ---

  const toggleDrawer = () => setOpen(!open);

  const menuItems = [
    { text: "포켓몬대시보드", icon: <Dashboard />, path: "/" },
    { text: "기존 포켓몬 목록", icon: <CatchingPokemon />, path: "/pokemonList" },
    { text: "새 포켓몬 목록", icon: <CatchingPokemonTwoTone />, path: "/newPokemonList" },
    { text: "새 포켓몬 등록", icon: <AddCircle />, path: "/pokemon/create" },
    { text: "주식 예측 차트", icon: <ShowChart />, path: "/stock/prediction" },
    { text: "LMS 대시보드", icon: <Dashboard />, path: "/lms/dashboard" },
    { text: "설정", icon: <Settings />, path: "/settings" },
  ];

  // 로그인 상태에 따른 메뉴 필터링 (로그인 안 되면 대시보드만)
  const visibleMenuItems = isLoggedIn 
    ? menuItems.filter(item => item.text === "LMS 대시보드")
    : menuItems.filter(item => item.text === "포켓몬대시보드" || item.text === "기존 포켓몬 목록" || item.text === "새 포켓몬 목록"
       || item.text === "새 포켓몬 등록" || item.text === "주식 예측 차트");

  const currentWidth = open ? fullWidth : collapsedWidth;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: currentWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: currentWidth,
          transition: "width 0.3s ease-in-out",
          overflowX: "hidden",
          backgroundColor: "#1e293b",
          color: "#f8fafc",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 0,
        },
      }}
    >
      {/* 상단 로고 영역 */}
      <Box 
        sx={{ 
          p: 2.5, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: open ? "space-between" : "center", 
          borderBottom: "1px solid #334155" 
        }}
      >
        {open && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* 1. 로그인 시에만 나타나는 썸네일 이미지 */}
            {isLoggedIn && (
              <Box
                component="img"
                src={dditLogo} // public 폴더 내의 이미지 경로 혹은 URL
                alt="Logo"
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%", // 원형 이미지를 원할 경우
                  objectFit: "cover"
                }}
              />
            )}
            {/* 2. 로그인 여부에 따른 텍스트 변경 */}
            <Typography variant="h6" fontWeight="bold" color="#38bdf8" sx={{ ml: 1 }}>
              {isLoggedIn ? "대덕인재개발원" : "POKEMON"}
            </Typography>

          </Box>
        )}
        
        <IconButton onClick={toggleDrawer} sx={{ color: "#94a3b8" }}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* 메뉴 리스트 */}
      <Box sx={{ overflow: "auto", mt: 2 }}>
        <List sx={{ px: open ? 2 : 1.5 }}>
          {visibleMenuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isSelected}
                  sx={{
                    minHeight: 52, // 글자가 커진 만큼 최소 높이를 살짝 키움 (48 -> 52)
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    borderRadius: "8px",
                    "&.Mui-selected": { 
                      backgroundColor: "#38bdf8", 
                      color: "#fff",
                      "&:hover": { backgroundColor: "#0ea5e9" } // 선택된 상태 호버 색상 추가
                    },
                    "&:hover": { backgroundColor: "#334155" },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: isSelected ? "#fff" : "#94a3b8", 
                      minWidth: 0, 
                      mr: open ? 2 : "auto",
                      "& svg": { fontSize: "24px" } // 아이콘도 글자 크기에 맞춰 시원하게 조정
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  
                  {open && (
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        fontSize: "16px", // 기존 14px에서 16px로 2px 상향
                        fontWeight: isSelected ? 700 : 500, // 선택 시 글자를 더 굵게 하여 강조
                        letterSpacing: "-0.3px" // 글자가 커진 만큼 자간을 살짝 조절
                      }} 
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* 하단 프로필 영역 */}
      {isLoggedIn && (
        <Box sx={{ p: 2, mt: "auto", borderTop: "1px solid #334155", display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "#38bdf8", width: 32, height: 32 }}>AD</Avatar>
          {open && (
            <Box>
              <Typography variant="body2" fontWeight="bold">Admin User</Typography>
              <Typography variant="caption" color="#94a3b8">Administrator</Typography>
            </Box>
          )}
        </Box>
      )}
    </Drawer>
  );
};

export default NavigationBar;