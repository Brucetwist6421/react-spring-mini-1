/* eslint-disable @typescript-eslint/no-explicit-any */
import Logout from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle"; // 기본 아이콘 추가
import { Avatar, Box, Divider, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  // userInfo 인터페이스에 mainImagePath 추가
  userInfo: { accId: string; accName: string; accType: string; mainImagePath?: string } | null;
}

export default function MenuProfile({ anchorEl, open, onClose, onLogout, userInfo }: ProfileMenuProps) {
  // 이미지 경로 생성 함수 (Header와 동일)
  const getProfileImageUrl = (path?: string) => {
    if (!path) return "";
    return `http://168.107.51.143:8080/upload/${encodeURIComponent(path)}`;
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      onClick={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      slotProps={{
        paper: {
          elevation: 3,
          sx: { 
            width: 220, 
            mt: 1.5, 
            borderRadius: 2, 
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          }
        }
      }}
    >
      <Box sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
        
        {/* 아바타에 이미지 소스 적용 */}
        <Avatar 
          src={getProfileImageUrl(userInfo?.mainImagePath)} // 경로 적용
          sx={{ 
            mx: 'auto', 
            mb: 1, 
            width: 60, // 메뉴 내부는 조금 더 크게
            height: 60,
            bgcolor: '#38bdf8', // 이미지 없을 때 배경색
            fontWeight: 'bold',
            fontSize: '1.5rem' // 폴백 이니셜 크기
          }}
        >
          {/* 이미지가 없을 때: 이름 첫 글자 혹은 기본 아이콘 */}
          {userInfo?.accName ? userInfo.accName[0] : <AccountCircle />}
        </Avatar>
        
        {/* 실제 로그인 정보로 세팅 */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {userInfo?.accName || "방문자"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {userInfo?.accId || "아이디 정보 없음"}
        </Typography>
        
        {/* 회원 유형 표시 (선택 사항) */}
        {userInfo?.accType && (
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: '#38bdf8' }}>
            {userInfo.accType === 'ADMIN' ? '관리자 계정' : '일반 사용자'}
          </Typography>
        )}
      </Box>
      <Divider />
      <MenuItem 
        onClick={() => {
          onClose();
          onLogout();
        }} 
        sx={{ color: 'error.main' }}
      >
        <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
        로그아웃
      </MenuItem>
    </Menu>
  );
}