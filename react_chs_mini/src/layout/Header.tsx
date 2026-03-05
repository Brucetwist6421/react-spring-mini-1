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
          
          {/* 로그인 시 환영 문구 및 프로필 영역 */}
          {isLoggedIn && userInfo && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* ⭐ 환영 문구 추가 (모바일에서는 숨김 처리) */}
              <Typography 
                variant="body2" 
                sx={{ 
                  display: { xs: "none", md: "block" }, 
                  mr: 1, 
                  color: "#cbd5e1" 
                }}
              >
                <Box component="span" sx={{ color: "#38bdf8", fontWeight: 700 }}>
                  {userInfo.accName}
                </Box>
                님 환영합니다!
              </Typography>

              <IconButton 
                color="inherit" 
                onClick={handleProfileClick} 
                sx={{ p: 0.5 }}
              >
                <Avatar 
                  src={getProfileImageUrl(userInfo?.mainImagePath)} 
                  sx={{ 
                    width: 35, 
                    height: 35, 
                    border: '2px solid #38bdf8',
                    bgcolor: '#334155',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {userInfo?.accName ? userInfo.accName[0] : <AccountCircle />}
                </Avatar>
              </IconButton>
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