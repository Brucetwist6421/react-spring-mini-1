import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useState, useEffect, type MouseEvent } from "react";
import LoginModal from "./components/LoginModal";
import MenuProfile from "../pages/MenuProfile";
import { LoggedInMenu, LoggedOutMenu } from "./components/HeaderComponents";

// 1. 이미지 임포트 (경로는 실제 파일 위치에 맞게 수정하세요)
import dditLogo from "../api/datas/dditLogo.png"; 

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
  const [userInfo, setUserInfo] = useState<{ accId: string; accName: string; accType: string; accEmail: string } | null>(null);

  // 초기 로드 시 로그인 상태 체크
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedInfo = localStorage.getItem("userInfo");
    if (savedInfo) {
      setUserInfo(JSON.parse(savedInfo));
    }
    setIsLoggedIn(!!token);
  }, []);

  const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); 
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  // 로그아웃 로직
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
    window.location.reload(); 
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

        {/* 2. 로고 텍스트 및 이미지 영역 수정 */}
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* 로그인 시에만 로고 이미지 표시 */}
          {isLoggedIn && (
            <Box
              component="img"
              src={dditLogo}
              alt="DDIT Logo"
              sx={{
                width: 32,
                height: 32,
                objectFit: "contain",
                borderRadius: "4px" // 필요 시 조절
              }}
            />
          )}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700, 
              fontSize: "1.1rem",
              color: "#f8fafc" 
            }}
          >
            {/* 로그인 여부에 따라 타이틀 변경 */}
            {isLoggedIn && userInfo 
              ? `대덕인재개발원 (${userInfo.accName}) ` 
            : title}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
                  color: "#38bdf8", 
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
        onLogout={handleLogout} 
        userInfo={userInfo}
      />
    </AppBar>
  );
}