import { Avatar, Box, Divider, Menu, MenuItem, Typography, ListItemIcon } from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import Person from "@mui/icons-material/Person";

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onLogout: () => void; // 로그아웃 처리를 위한 프롭 추가
}

export default function MenuProfile({ anchorEl, open, onClose, onLogout }: ProfileMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      onClick={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      // Deprecated 된 PaperProps 대신 slotProps 사용
      slotProps={{
        paper: {
          elevation: 3,
          sx: { 
            width: 220, 
            mt: 1.5, 
            borderRadius: 2, 
            overflow: 'visible',
            '&:before': { // 메뉴 화살표 효과 (선택 사항)
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
        <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: '#38bdf8' }}>A</Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>포켓몬 마스터</Typography>
        <Typography variant="body2" color="text.secondary">admin@test.com</Typography>
      </Box>
      <Divider />
      <MenuItem onClick={onClose}>
        <ListItemIcon><Person fontSize="small" /></ListItemIcon>
        내 프로필
      </MenuItem>
      <MenuItem onClick={onClose}>
        <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
        설정
      </MenuItem>
      <Divider />
      {/* 실제 로그아웃 함수 호출 */}
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