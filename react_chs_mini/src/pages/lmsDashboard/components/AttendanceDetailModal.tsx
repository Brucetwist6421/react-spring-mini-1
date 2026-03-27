import CloseIcon from '@mui/icons-material/Close';
import {
    Avatar, Box, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Divider,
    IconButton, Paper, Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import api from "../../../api/axiosInstance";

// 상태 설정 정의
const statusConfig: Record<string, { label: string; color: string; bgColor: string; timeLabel: string }> = {
    'OFFICIAL': { label: '공결', color: '#646363', bgColor: '#fef2f2', timeLabel: '출석 상태' },
    'ABSENT': { label: '결석', color: '#ef4444', bgColor: '#fef2f2', timeLabel: '출석 상태' },
    'LATE': { label: '지각', color: '#f59e0b', bgColor: '#fffbeb', timeLabel: '출석 상태' },
    'EARLY': { label: '조퇴', color: '#8b5cf6', bgColor: '#f5f3ff', timeLabel: '출석 상태' },
    'OUTING': { label: '외출', color: '#3b82f6', bgColor: '#eff6ff', timeLabel: '출석 상태' },
};

// 기본 상태 (정상)
const defaultStatus = { label: '정상', color: '#10b981', bgColor: '#ecfdf5', timeLabel: '출석 상태' };

interface Student {
    accountSeq: number;
    accountName: string;
    mainFilePath?: string;
    tel?: string;
    status: string | null; // null 허용
    startTime?: string;
}

interface DetailModalProps {
    open: boolean;
    onClose: () => void;
    statusLabel: string;
    statusColor: string;
    date: string;
    type: string;
}

const AttendanceDetailModal = ({ open, onClose, statusLabel, statusColor, date, type }: DetailModalProps) => {
    const [studentList, setStudentList] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDetailList = async () => {
            if (!open || !type) return;

            setLoading(true);
            try {
                const res = await api.get("/api/attendance/attendance-today/list", {
                    params: { date }
                });

                const listName = `${type}List`;
                setStudentList(res.data[listName] || []);
            } catch (err) {
                console.error("상세 명단 로딩 실패:", err);
                setStudentList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDetailList();
    }, [open, date, type]);

    const getProfileImage = (path?: string) => {
        if (!path) return '';
        return path.startsWith('http') ? path : `http://168.107.51.143:8080/upload/${encodeURIComponent(path)}`;
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper" PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ m: 0, p: 2.5, bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b' }}>{statusLabel} 명단</Typography>
                    {!loading && (
                        <Chip label={`${studentList.length}명`} size="small" sx={{ bgcolor: statusColor, color: 'white', fontWeight: 800 }} />
                    )}
                </Box>
                <IconButton onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500], '&:hover': { color: '#ef4444', bgcolor: '#fee2e2' } }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2, bgcolor: '#f1f5f9', minHeight: '300px' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
                        <CircularProgress size={40} sx={{ color: statusColor }} />
                    </Box>
                ) : studentList.length === 0 ? (
                    <Box sx={{ py: 10, textAlign: 'center' }}>
                        <Typography sx={{ color: '#94a3b8', fontWeight: 600 }}>해당하는 학생이 없습니다.</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={1.5}>
                        {studentList.map((student) => {
                            // 상태 설정 적용 (null이면 정상)
                            const config = student.status ? (statusConfig[student.status] || defaultStatus) : defaultStatus;

                            return (
                                <Grid size={12} key={student.accountSeq}>
                                    <Paper sx={{
                                        p: 1.8,
                                        borderRadius: 2,
                                        border: '1px solid #e2e8f0',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                            borderColor: config.color + '50'
                                        }
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar
                                                    src={getProfileImage(student.mainFilePath)}
                                                    sx={{ width: 48, height: 48, bgcolor: '#e2e8f0', fontWeight: 700 }}
                                                >
                                                    {student.accountName ? student.accountName[0] : '?'}
                                                </Avatar>
                                                <Box>
                                                    <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>
                                                        {student.accountName}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                                        {student.tel || '연락처 없음'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                                                    {config.timeLabel}
                                                </Typography>
                                                <Typography sx={{ fontWeight: 800, color: config.color, fontSize: '0.95rem' }}>
                                                    {config.label}
                                                </Typography>
                                                {student.startTime && (
                                                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 600 }}>
                                                        {student.startTime}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AttendanceDetailModal;