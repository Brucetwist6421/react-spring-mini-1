/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import RandomSpinner from "../../../components/RandomSpinner";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
// 요청하신 경로에 맞춰 유틸리티 함수 import
import { fileListDownload } from "../../../api/fileListDownload";

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

    return () => {
      Object.values(dailyLogs).forEach((log: any) => {
        if (log.preview) URL.revokeObjectURL(log.preview);
      });
    };
  }, [open, curSeq, logDate]);

  const handleLogChange = (period: number, field: string, value: any) => {
    setDailyLogs(prev => ({
      ...prev,
      [period]: { ...prev[period], [field]: value, period }
    }));
  };

  const handleFileChange = (period: number, file: File) => {
    setDailyLogs(prev => {
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

  // 모듈화된 다운로드 함수 호출
  const handleDownload = (log: any) => {
    if (log.mainFilePath && !log.file) {
      // .trim()을 통해 공백 제거 후 URL 인코딩 수행
      const cleanPath = log.mainFilePath.trim();
      fileListDownload({
        url: `http://168.107.51.143:8080/upload/${encodeURIComponent(cleanPath)}`
      });
    }
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
      await api.post("/api/daily-log/save", formData, {
        headers: { 'Content-Type': undefined }
      });
      alert("저장되었습니다.");
      onClose();
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>훈련일지 관리 (1~8교시)</DialogTitle>
      <DialogContent sx={{ minHeight: '600px', pt: 2 }}>
        {!isReady ? <RandomSpinner /> : (
          <>
            <TextField type="date" fullWidth label="일자 선택" value={logDate} onChange={(e) => setLogDate(e.target.value)} sx={{ my: 2 }} />
            
            {[...Array(8)].map((_, i) => {
              const p = i + 1;
              const log = dailyLogs[p] || {};
              const hasFile = !!(log.file || log.mainFilePath);

              return (
                <Box key={p} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                  <TextField select label={`${p}교시`} sx={{ width: '15%' }} value={log.subSeq || ""} onChange={(e) => handleLogChange(p, 'subSeq', e.target.value)}>
                    {subjects.map((sub) => <MenuItem key={sub.subSeq} value={sub.subSeq}>{sub.subName}</MenuItem>)}
                  </TextField>
                  <TextField fullWidth label="수업 내용" value={log.content || ""} onChange={(e) => handleLogChange(p, 'content', e.target.value)} />
                  
                  <Button variant="outlined" component="label" size="small" sx={{ height: 40, flexShrink: 0 }}>
                    파일 선택
                    <input type="file" hidden onChange={(e) => e.target.files?.[0] && handleFileChange(p, e.target.files[0])} />
                  </Button>
                  
                  {hasFile && (
                    <Box 
                      onClick={() => handleDownload(log)}
                      sx={{ 
                        width: 80, height: 60, border: '1px solid #ddd', borderRadius: 1, 
                        display: 'flex', flexDirection: 'column', alignItems: 'center', 
                        justifyContent: 'center', overflow: 'hidden', bgcolor: '#f9f9f9', p: 0.5,
                        cursor: log.mainFilePath && !log.file ? 'pointer' : 'default',
                        '&:hover': { bgcolor: log.mainFilePath && !log.file ? '#f0f0f0' : '#f9f9f9' }
                      }}
                    >
                      {(log.preview || (log.mainFilePath && log.mainFilePath.match(/\.(jpeg|jpg|png|gif)$/i))) ? (
                        <img 
                          src={log.preview || `http://168.107.51.143:8080/upload/${encodeURIComponent(log.mainFilePath)}`} 
                          alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <>
                          <InsertDriveFileIcon color="primary" />
                          <Typography 
                            sx={{ 
                              fontSize: '10px', 
                              textAlign: 'center', 
                              width: '100%', 
                              whiteSpace: 'nowrap', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis' 
                            }}
                          >
                            {(() => {
                              // 1. 표시할 이름 결정 (로컬 파일명 우선)
                              const rawName = log.file ? log.file.name : (log.mainFilePath?.split('/').pop() || '파일');
                              
                              // 2. UUID_파일명.ext 구조에서 첫 번째 '_' 이후의 문자열만 추출
                              if (rawName.includes('_')) {
                                const parts = rawName.split('_');
                                // UUID를 제외한 나머지 부분들을 다시 합침 (혹시 파일명에 '_'가 또 있을 경우를 대비)
                                return parts.slice(1).join('_');
                              }
                              
                              return rawName;
                            })()}
                          </Typography>
                        </>
                      )}
                    </Box>
                  )}
                </Box>
              );
            })}
            <Button variant="contained" onClick={handleSave} fullWidth sx={{ mt: 2, height: 50 }}>저장하기</Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LmsDailyLogModal;