/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import RandomSpinner from "../../../components/RandomSpinner";

interface LmsDailyLogModalProps {
  open: boolean;
  onClose: () => void;
  curSeq: number;
}

const LmsDailyLogModal = ({ open, onClose, curSeq }: LmsDailyLogModalProps) => {
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [dailyLogs, setDailyLogs] = useState<Record<number, any>>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (open) {
      setIsReady(false);
      Promise.all([
        api.get(`/api/curriculum/subjects/${curSeq}`),
        api.get(`/api/daily-log/curriculum/${curSeq}`, { params: { logDate } })
      ])
      .then(([subRes, logRes]) => {
        setSubjects(subRes.data);
        const logMap = (logRes.data || []).reduce((acc: any, cur: any) => ({ 
          ...acc, [cur.period]: { ...cur } 
        }), {});
        setDailyLogs(logMap);
        setIsReady(true);
      })
      .catch((err) => {
        console.error("데이터 로드 실패:", err);
        setIsReady(true);
      });
    }

    // 모달이 닫힐 때 생성된 모든 미리보기 URL 해제
    return () => {
      Object.values(dailyLogs).forEach((log: any) => {
        if (log.preview) URL.revokeObjectURL(log.preview);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, curSeq, logDate]);

  const handleLogChange = (period: number, field: string, value: any) => {
    setDailyLogs(prev => ({
      ...prev,
      [period]: { ...prev[period], [field]: value, period }
    }));
  };

  const handleFileChange = (period: number, file: File) => {
    setDailyLogs(prev => {
      // 이전 파일의 미리보기 URL이 있다면 메모리에서 해제
      if (prev[period]?.preview) URL.revokeObjectURL(prev[period].preview);
      
      return {
        ...prev,
        [period]: { 
          ...prev[period], 
          file, 
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null 
        }
      };
    });
  };

  const handleSave = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const regId = userInfo.accId;

    const formData = new FormData();
    const logsPayload: any[] = [];

    Object.entries(dailyLogs).forEach(([period, data]: any) => {
      if (data.subSeq && data.content) {
        const { file, preview, ...logData } = data;
        logsPayload.push({ ...logData, logDate, regId, status: "A" });
        if (file) formData.append(`file_${period}`, file);
      }
    });

    if (logsPayload.length === 0) return alert("저장할 내용이 없습니다.");
    formData.append("logs", new Blob([JSON.stringify(logsPayload)], { type: 'application/json' }));

    try {
      await api.post("/api/daily-log/save", formData);
      alert("저장되었습니다.");
      onClose();
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>훈련일지 관리 (1~8교시)</DialogTitle>
      <DialogContent sx={{ minHeight: '400px' }}>
        {!isReady ? <RandomSpinner /> : (
          <>
            <TextField type="date" fullWidth label="일자 선택" value={logDate} onChange={(e) => setLogDate(e.target.value)} sx={{ my: 2 }} />
            
            {[...Array(8)].map((_, i) => {
              const p = i + 1;
              const log = dailyLogs[p] || {};
              // 파일이 있는지 체크 (새로 선택한 파일 OR 서버에 존재하는 파일 경로)
              const hasFile = !!(log.file || log.mainFilePath);

              return (
                <Box key={p} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                  <TextField select label={`${p}교시`} sx={{ width: '20%' }} value={log.subSeq || ""} onChange={(e) => handleLogChange(p, 'subSeq', e.target.value)}>
                    {subjects.map((sub) => <MenuItem key={sub.subSeq} value={sub.subSeq}>{sub.subName}</MenuItem>)}
                  </TextField>
                  <TextField fullWidth label="수업 내용" value={log.content || ""} onChange={(e) => handleLogChange(p, 'content', e.target.value)} />
                  
                  <Button variant="outlined" component="label" size="small">
                    파일
                    <input type="file" hidden onChange={(e) => e.target.files?.[0] && handleFileChange(p, e.target.files[0])} />
                  </Button>
                  
                  {/* 파일이 있을 때만 Box를 렌더링 */}
                  {hasFile && (
                    <Box sx={{ width: 50, height: 50, border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {log.preview ? (
                        <img src={log.preview} alt="prev" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Typography variant="caption" sx={{ fontSize: '9px', textAlign: 'center', px: 0.5 }}>
                          {log.file ? log.file.name : '파일 있음'}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              );
            })}
            <Button variant="contained" onClick={handleSave} fullWidth sx={{ mt: 2 }}>저장하기</Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LmsDailyLogModal;