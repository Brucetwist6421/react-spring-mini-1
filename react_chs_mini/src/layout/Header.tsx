import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { useState, type MouseEvent } from "react"; // 1. MouseEvent 추가
import LoginModal from "../pages/modal/LoginModal";
import MenuProfile from "../components/MenuProfile";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export default function Header({ title = "Pokemon Admin", onMenuClick }: HeaderProps) {
  const [loginOpen, setLoginOpen] = useState(false);

  // 프로필 메뉴를 위한 상태
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isProfileOpen = Boolean(anchorEl);

  // 클릭 시 메뉴 열기
  const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); 
  };

  // 메뉴 닫기
  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        backgroundColor: "#1e293b", 
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)", 
        color: "#ffffff",
        borderRadius: 0, // 곡률 제거
      }}
    >
      <Toolbar sx={{ minHeight: "64px" }}>
        {/* 모바일용 햄버거 메뉴 (왼쪽) */}
        <IconButton 
          edge="start" 
          color="inherit" 
          onClick={onMenuClick} // 기존 매개변수로 전달받은 onMenuClick 사용
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
          <Button 
            variant="contained"
            size="small"
            sx={{ 
              backgroundColor: "#38bdf8", 
              color: "#0f172a",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#7dd3fc" } 
            }}
            onClick={() => setLoginOpen(true)}
          >
            Login
          </Button>

          {/* 프로필 아이콘 버튼 (오른쪽) */}
          <IconButton 
            color="inherit" 
            onClick={handleProfileClick} // 클릭 시 anchorEl 설정
          >
            <AccountCircle 
              sx={{ 
                fontSize: 28, 
                color: isProfileOpen ? "#38bdf8" : "#94a3b8", // 메뉴 열리면 스카이블루로 강조
                transition: "color 0.2s"
              }} 
            />
          </IconButton>
        </Box>
      </Toolbar>

      {/* 모달 및 메뉴 컴포넌트들 */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      
      <MenuProfile 
        anchorEl={anchorEl} 
        open={isProfileOpen} 
        onClose={handleProfileClose} 
      />
    </AppBar>
  );
}