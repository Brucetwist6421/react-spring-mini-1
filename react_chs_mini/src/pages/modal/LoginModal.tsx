/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, TextField, 
  DialogActions, Button, Box, CircularProgress 
} from "@mui/material";
import api from "../../api/axiosInstance";

interface LoginProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      // 1. 스프링 부트 서버로 로그인 요청
      // 백엔드의 @PostMapping("/login") 엔드포인트와 맞춰주세요.
      const response = await api.post("/api/auth/login", formData);
      
      // 2. 서버에서 보낸 응답 데이터 확인 (예: { accessToken: "..." })
      // 필드명은 백엔드 DTO 설계에 따라 다를 수 있습니다 (token, accessToken 등)
      const token = response.data.accessToken || response.data.token;
      
      if (token) {
        localStorage.setItem("accessToken", token);
        alert("성공적으로 로그인되었습니다.");
        onClose();
        window.location.reload(); // 토큰이 적용된 상태로 UI를 갱신하기 위해 새로고침
      }
    } catch (error: any) {
      console.error("Login Failure:", error);
      const errorMessage = error.response?.data?.message || "로그인에 실패했습니다. 정보를 확인해주세요.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: 700, pt: 3 }}>
          로그인
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField 
              name="email"
              label="이메일 주소" 
              variant="outlined" 
              fullWidth 
              autoFocus 
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField 
              name="password"
              label="비밀번호" 
              type="password" 
              variant="outlined" 
              fullWidth 
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} fullWidth variant="outlined" color="inherit" disabled={loading}>
            취소
          </Button>
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            disabled={loading}
            sx={{ bgcolor: "#1e293b", "&:hover": { bgcolor: "#334155" } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "로그인"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}