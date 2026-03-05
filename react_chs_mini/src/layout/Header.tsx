import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, IconButton, Toolbar, Typography, Avatar } from "@mui/material";
import { useState, useEffect, type MouseEvent } from "react";
import LoginModal from "./components/LoginModal";
import MenuProfile from "../pages/MenuProfile";
import { LoggedInMenu, LoggedOutMenu } from "./components/HeaderComponents";

import dditLogo from "../api/datas/dditLogo.png"; 

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export default function Header({ title = "Pokemon Admin", onMenuClick }: HeaderProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isProfileOpen = Boolean(anchorEl);

  interface UserInfo {
    accId: string; 
    accName: string; 
    accType: string; 
    accEmail: string;
    mainImagePath?: string; 
  }
  
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedInfo = localStorage.getItem("userInfo");
    if (savedInfo) {
      setUserInfo(JSON.parse(savedInfo));
    }
    setIsLoggedIn(!!token);
  }, []);

  const getProfileImageUrl = (path?: string) => {
    if (!path) return "";
    return `http://168.107.51.143:8080/upload/${encodeURIComponent(path)}`;
  };

  const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); 
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

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

        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
          {isLoggedIn && (
            <Box
              component="img"
              src={dditLogo}
              alt="DDIT Logo"
              sx={{ width: 32, height: 32, objectFit: "contain", borderRadius: "4px" }}
            />
          )}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#f8fafc" }}
          >
            {isLoggedIn && userInfo 
              ? `대덕인재개발원 (${userInfo.accName})` 
              : title}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {isLoggedIn ? (
            <LoggedInMenu onLogoutClick={handleLogout} />
          ) : (
            <LoggedOutMenu onLoginClick={() => setLoginOpen(true)} />
          )}
          
          {/* 로그인 시 환영 문구 및 프로필 영역을 하나의 버튼 영역으로 인식하게 함 */}
          {isLoggedIn && userInfo && (
            <Box 
              onClick={handleProfileClick} // 영역 전체 클릭 시 메뉴 오픈
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                cursor: "pointer", // 마우스 커서 변경
                padding: "4px 8px",
                borderRadius: "20px",
                transition: "background-color 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)", // 살짝 호버 효과
                }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  display: { xs: "none", md: "block" }, 
                  mr: 1.5, // 간격 살짝 넓힘
                  color: "#cbd5e1",
                  userSelect: "none" // 텍스트 드래그 방지
                }}
              >
                <Box component="span" sx={{ color: "#38bdf8", fontWeight: 700 }}>
                  {userInfo.accName}
                </Box>
                님 환영합니다!
              </Typography>

              <Avatar 
                src={getProfileImageUrl(userInfo?.mainImagePath)} 
                sx={{ 
                  width: 35, 
                  height: 35, 
                  border: '2px solid #38bdf8',
                  bgcolor: '#334155',
                }}
              >
                {userInfo?.accName ? userInfo.accName[0] : <AccountCircle />}
              </Avatar>
            </Box>
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