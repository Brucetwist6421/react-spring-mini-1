/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import { useState } from "react";
import api from "../../api/axiosInstance";

interface LoginProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginProps) {
  const [formData, setFormData] = useState({ accId: "", password: "" });
  const [loading, setLoading] = useState(false);

  
  // 1. 에러 상태 관리를 위한 state 추가
  const [errors, setErrors] = useState({ accId: false, password: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 입력을 시작하면 에러 메시지 실시간 제거
    if (value !== "") {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 2. 입력값 검증 (유효성 검사)
    const idEmpty = formData.accId.trim() === "";
    const passwordEmpty = formData.password.trim() === "";

    if (idEmpty || passwordEmpty) {
      setErrors({ accId: idEmpty, password: passwordEmpty });
      return; // 서버 요청 중단
    }

    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", formData);
      const { accessToken, accId, accName, accType } = response.data; // 응답 데이터 구조에 맞게 구조분해할당

      if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          // 사용자 정보를 JSON 문자열로 변환하여 저장
          localStorage.setItem("userInfo", JSON.stringify({ accId, accName, accType }));
          
          alert(`${accName}님, 환영합니다!`);
          onClose();
          // 이렇게 하면 axios 인스턴스가 새로 초기화되면서 localStorage에서 새 토큰을 읽어옵니다.
          window.location.href = "/lmsDashboard";
          //window.location.reload(); 
      }
    } catch (error: any) {
      console.error("Login Failure:", error);
      // 서버에서 온 에러 메시지 처리
      const errorMessage = error.response?.data || "로그인에 실패했습니다. 정보를 확인해주세요.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle sx={{ textAlign: "center", fontWeight: 700, pt: 3 }}>
          로그인
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField 
              name="accId"
              label="아이디" 
              variant="outlined" 
              fullWidth 
              autoFocus 
              autoComplete="accId"
              value={formData.accId}
              onChange={handleChange}
              // 3. MUI Error 속성 적용
              error={errors.accId}
              helperText={errors.accId ? "아이디를 입력해주세요." : ""}
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
              // 4. MUI Error 속성 적용
              error={errors.password}
              helperText={errors.password ? "비밀번호를 입력해주세요." : ""}
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
            sx={{ 
              bgcolor: "#1e293b", 
              "&:hover": { bgcolor: "#334155" },
              // 에러가 있을 때 버튼을 살짝 흔드는 효과 등을 줄 수도 있습니다.
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "로그인"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}