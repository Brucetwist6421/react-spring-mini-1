// HeaderComponents.tsx (또는 Header 파일 하단)

import { Button } from "@mui/material";

interface AuthMenuProps {
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

// 로그아웃 상태일 때 (Login 버튼)
export const LoggedOutMenu = ({ onLoginClick }: AuthMenuProps) => (
  <Button
    variant="contained"
    size="small"
    sx={{
      backgroundColor: "#38bdf8",
      color: "#0f172a",
      fontWeight: 700,
      "&:hover": { backgroundColor: "#7dd3fc" },
    }}
    onClick={onLoginClick}
  >
    Login
  </Button>
);

// 로그인 상태일 때 (Logout 버튼)
export const LoggedInMenu = ({ onLogoutClick }: AuthMenuProps) => (
  <Button
    variant="outlined"
    size="small"
    sx={{
      color: "#f87171",
      borderColor: "#f87171",
      fontWeight: 700,
      "&:hover": {
        borderColor: "#ef4444",
        backgroundColor: "rgba(248, 113, 113, 0.1)",
      },
    }}
    onClick={onLogoutClick}
  >
    Logout
  </Button>
);