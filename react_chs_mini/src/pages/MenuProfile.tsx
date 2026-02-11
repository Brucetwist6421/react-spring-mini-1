import Logout from "@mui/icons-material/Logout";
import { Avatar, Box, Divider, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  // 유저 정보 전달을 위한 프롭 추가
  userInfo: { email: string; memName: string; memType: string } | null;
}

export default function MenuProfile({ anchorEl, open, onClose, onLogout, userInfo }: ProfileMenuProps) {
  // 이름의 첫 글자를 아바타에 표시 (정보가 없으면 'A')
  const initial = userInfo?.memName ? userInfo.memName.charAt(0) : 'A';

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
        {/* 아바타에 이름 첫 글자 표시 */}
        <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: '#38bdf8', fontWeight: 'bold' }}>
          {initial}
        </Avatar>
        
        {/* 실제 로그인 정보로 세팅 */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {userInfo?.memName || "방문자"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {userInfo?.email || "이메일 정보 없음"}
        </Typography>
        
        {/* 회원 유형 표시 (선택 사항) */}
        {userInfo?.memType && (
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: '#38bdf8' }}>
            {userInfo.memType === 'ADMIN' ? '관리자 계정' : '일반 사용자'}
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