/* eslint-disable @typescript-eslint/no-unused-vars */
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useState, useEffect, type MouseEvent } from "react";
import LoginModal from "./components/LoginModal";
import MenuProfile from "../pages/MenuProfile";
import { LoggedInMenu, LoggedOutMenu } from "./components/HeaderComponents";
// 분리한 컴포넌트 임포트

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export default function Header({ title = "Pokemon Admin", onMenuClick }: HeaderProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 프로필 메뉴를 위한 상태
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isProfileOpen = Boolean(anchorEl);

  // 사용자 정보 state
  const [userInfo, setUserInfo] = useState<{ email: string; memName: string; memType: string } | null>(null);

  // 1. 초기 로드 시 로그인 상태 체크
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedInfo = localStorage.getItem("userInfo");
    if (savedInfo) {
      setUserInfo(JSON.parse(savedInfo));
    }
    console.log("savedInfo:", savedInfo);
    setIsLoggedIn(!!token);
  }, []);

  const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); 
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  // 2. 로그아웃 로직
  const handleLogout = () => {
    // 모든 로컬 스토리지 데이터 삭제 (accessToken, userInfo 등 한 번에)
    localStorage.clear();
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
    window.location.reload(); // 세션 초기화를 위해 새로고침
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        backgroundColor: "#1e293b", 
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)", 
        color: "#ffffff",
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ minHeight: "64px" }}>
        <IconButton 
          edge="start" 
          color="inherit" 
          onClick={onMenuClick} 
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 700, 
            fontSize: "1.1rem",
            color: "#f8fafc" 
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* 3. 모듈화된 버튼 컴포넌트 조건부 렌더링 */}
          {isLoggedIn ? (
            <LoggedInMenu onLogoutClick={handleLogout} />
          ) : (
            <LoggedOutMenu onLoginClick={() => setLoginOpen(true)} />
          )}
          {isLoggedIn && (
            <IconButton 
              color="inherit" 
              onClick={handleProfileClick} 
            >
              <AccountCircle 
                sx={{ 
                  fontSize: 28, 
                  // 로그인 상태일 때 아이콘 색상을 스카이블루로 변경하여 표시
                  color: isLoggedIn ? "#38bdf8" : (isProfileOpen ? "#38bdf8" : "#94a3b8"), 
                  transition: "color 0.2s"
                }} 
              />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      
      <MenuProfile 
        anchorEl={anchorEl} 
        open={isProfileOpen} 
        onClose={handleProfileClose} 
        onLogout={handleLogout} // 추가된 부분
      />
    </AppBar>
  );
}