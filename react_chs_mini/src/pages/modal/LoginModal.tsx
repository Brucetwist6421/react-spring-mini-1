import { 
  Dialog, DialogTitle, DialogContent, TextField, 
  DialogActions, Button, Box 
} from "@mui/material";

interface LoginProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: 700, pt: 3 }}>
        관리자 로그인
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="이메일 주소" variant="outlined" fullWidth autoFocus />
          <TextField label="비밀번호" type="password" variant="outlined" fullWidth />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} fullWidth variant="outlined" color="inherit">
          취소
        </Button>
        <Button onClick={onClose} fullWidth variant="contained" sx={{ bgcolor: "#1e293b" }}>
          로그인
        </Button>
      </DialogActions>
    </Dialog>
  );
}