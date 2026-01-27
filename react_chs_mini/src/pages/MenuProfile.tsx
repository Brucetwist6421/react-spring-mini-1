import { Avatar, Box, Divider, Menu, MenuItem, Typography, ListItemIcon } from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import Person from "@mui/icons-material/Person";

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

export default function MenuProfile({ anchorEl, open, onClose }: ProfileMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      onClick={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        elevation: 3,
        sx: { width: 220, mt: 1.5, borderRadius: 2, overflow: 'visible' }
      }}
    >
      <Box sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
        <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: '#38bdf8' }}>P</Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>포켓몬 마스터</Typography>
        <Typography variant="body2" color="text.secondary">admin@pokemon.com</Typography>
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
      <MenuItem onClick={onClose} sx={{ color: 'error.main' }}>
        <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
        로그아웃
      </MenuItem>
    </Menu>
  );
}