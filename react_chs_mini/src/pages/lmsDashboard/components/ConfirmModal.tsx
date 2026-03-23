/* components/common/ConfirmModal.tsx */

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  content: string;
  subContent?: string;
  confirmText?: string; // 버튼 텍스트 가변화
  confirmColor?: 'error' | 'primary' | 'warning'; // 상황에 따른 색상 변경
}

const ConfirmModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  title = "확인 요청", 
  content, 
  subContent,
  confirmText = "확인",
  confirmColor = "error"
}: ConfirmModalProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      PaperProps={{ sx: { borderRadius: 4, p: 1, maxWidth: 400 } }} // 너비 제한 추가
    >
      <DialogTitle sx={{ 
        fontWeight: 900, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5, 
        color: `${confirmColor}.main` 
      }}>
        <WarningAmberIcon sx={{ fontSize: '2rem' }} /> {title}
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.1rem', mb: 1 }}>
          {content}
        </DialogContentText>
        {subContent && (
          <DialogContentText variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {subContent}
          </DialogContentText>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="inherit" 
          sx={{ fontWeight: 800, borderRadius: 2, px: 3 }}
        >
          취소
        </Button>
        <Button 
          onClick={() => {
            onConfirm();
            onClose(); // 실행 후 닫기
          }} 
          variant="contained" 
          color={confirmColor} 
          sx={{ fontWeight: 800, borderRadius: 2, px: 3, boxShadow: 0 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;