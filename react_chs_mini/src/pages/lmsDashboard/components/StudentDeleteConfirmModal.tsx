import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  content: string;
  subContent?: string;
}

const StudentDeleteConfirmModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  title = "정보 삭제 확인", 
  content, 
  subContent 
}: DeleteConfirmModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5, color: 'error.main' }}>
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
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ fontWeight: 800, borderRadius: 2, px: 3 }}>
          취소
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" sx={{ fontWeight: 800, borderRadius: 2, px: 3, boxShadow: 0 }}>
          삭제 확정
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentDeleteConfirmModal;