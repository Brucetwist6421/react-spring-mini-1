/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, MenuItem, Paper, TextField, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid v6 사용
import { useEffect, useRef, useState } from "react";
import api from "../../../api/axiosInstance";
import { fileListDownload } from "../../../api/fileListDownload";
import RandomSpinner from "../../../components/RandomSpinner";

const LmsDailyLogModal = ({ open, onClose, curSeq, curData }: any) => {
  const [logDate, setLogDate] = useState<string>("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [dailyLogs, setDailyLogs] = useState<Record<number, any>>({});
  const [isReady, setIsReady] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setLogDate(new Date().toISOString().split('T')[0]);
      setIsReady(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && logDate) {
      Promise.all([
        api.get(`/api/curriculum/subjects/${curSeq}`),
        api.get(`/api/daily-log/curriculum/${curSeq}`, { params: { logDate } })
      ])
      .then(([subRes, logRes]) => {
        setSubjects(subRes.data);
        const logMap = (logRes.data || []).reduce((acc: any, cur: any) => ({ ...acc, [cur.period]: { ...cur } }), {});
        setDailyLogs(logMap);
        setIsReady(true);
      })
      .catch(() => setIsReady(true));
    }
  }, [open, curSeq, logDate]);

  const handleLogChange = (period: number, field: string, value: any) => {
    setDailyLogs(prev => ({ ...prev, [period]: { ...prev[period], [field]: value, period } }));
  };

  const handleFileChange = (period: number, file: File) => {
    setDailyLogs(prev => {
      if (prev[period]?.preview) URL.revokeObjectURL(prev[period].preview);
      return { ...prev, [period]: { ...prev[period], file, preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null } };
    });
  };

  const handleDownload = (log: any) => {
    if (log.mainFilePath && !log.file) {
      fileListDownload({ url: `http://168.107.51.143:8080/upload/${encodeURIComponent(log.mainFilePath.trim())}` });
    }
  };

  const handleSave = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const formData = new FormData();
    const logsPayload: any[] = [];

    // --- 유효성 검사 로직 추가 ---
    const logEntries = Object.entries(dailyLogs);
    for (const [period, data] of logEntries) {
      const hasContent = !!data.content?.trim();
      const hasFile = !!(data.file || data.mainFilePath);
      
      // 내용이나 파일이 있는데 과목이 선택되지 않은 경우
      if ((hasContent || hasFile) && !data.subSeq) {
        alert(`${period}교시 과목을 선택해주세요.`);
        return;
      }
    }

    Object.entries(dailyLogs).forEach(([period, data]: any) => {
      if (data.subSeq && (data.content || data.file || data.mainFilePath)) {
        const { file, preview, ...logData } = data;
        logsPayload.push({ ...logData, logDate, regId: userInfo.accId, status: "A" });
        if (file) formData.append(`file_${period}`, file);
      }
    });

    if (logsPayload.length === 0) return alert("저장할 내용이 없습니다.");

    formData.append("logs", new Blob([JSON.stringify(logsPayload)], { type: 'application/json' }));
    
    try {
      await api.post("/api/daily-log/save", formData, { headers: { 'Content-Type': undefined } });
      alert("저장되었습니다.");
      onClose();
    } catch { alert("저장에 실패했습니다."); }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle sx={{ bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
        <Box>
          훈련일지 관리 - {curData.curName} - {curData.className}호 ({curData.term}기)
        </Box>

        <Typography variant="caption" sx={{ color: "#666", fontSize: "1rem" }}>
          훈련 기간 : {curData.period}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#f9f9f9', pt: 2 }}>
        {!isReady ? <RandomSpinner /> : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* 날짜 선택 영역 */}
            <Paper sx={{ p: 2 }}>
              <Box
                sx={{ width: 220, cursor: "pointer" }}
                onClick={() => dateRef.current?.click()}
              >
                <TextField
                  fullWidth
                  type="date"
                  label="조회 날짜"
                  value={logDate}
                  size="small"
                  onChange={(e) => setLogDate(e.target.value)}
                  inputRef={dateRef}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { style: { cursor: "pointer" } }
                  }}
                />
              </Box>
            </Paper>

            <Paper
              sx={{
                px: 2,
                py: 1,
                bgcolor: "#f5f7fa",
                border: "1px dashed #d0d7de"
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#555",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                📎 첨부된 파일 아이콘 또는 이미지를 클릭하면 다운로드됩니다.
              </Typography>
            </Paper>

            {/* 훈련 내용 입력 영역 */}
            {[...Array(8)].map((_, i) => {
              const p = i + 1;
              const log = dailyLogs[p] || {};
              const fileName = log.file ? log.file.name : (log.mainFilePath?.split('_').slice(1).join('_') || '');
              
              return (
                <Paper key={p} sx={{ p: 1.5, borderLeft: '6px solid #1976d2', bgcolor: log.subSeq ? '#fff' : '#fff9f9' }}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField 
                        select fullWidth label={`${p}교시`} size="small" value={log.subSeq || ""} 
                        onChange={(e) => handleLogChange(p, 'subSeq', e.target.value)}
                        error={(!!log.content || !!log.file) && !log.subSeq}
                      >
                        <MenuItem value=""><em>과정 선택</em></MenuItem>
                        {subjects.map((s) => <MenuItem key={s.subSeq} value={s.subSeq}>{s.subName}({s.teacherName})</MenuItem>)}
                      </TextField>
                    </Grid>
                    
                    {/* 텍스트 필드: multiline + maxRows로 실시간 확장 */}
                    <Grid size={{ xs: 12, md: 8 }}>
                      <TextField 
                        fullWidth
                        multiline
                        minRows={1}
                        maxRows={4}
                        label="훈련 내용"
                        size="small"
                        value={log.content || ""}
                        onChange={(e) => handleLogChange(p, 'content', e.target.value)}
                      />
                    </Grid>

                    <Grid 
                      size={{ xs: 12, md: 2 }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 1
                      }}
                    >
                      <Button
                        variant="outlined"
                        component="label"
                        size="small"
                        sx={{
                          whiteSpace: "nowrap",
                          minWidth: 90
                        }}
                      >
                        파일 선택
                        <input
                          type="file"
                          hidden
                          onChange={(e) =>
                            e.target.files?.[0] && handleFileChange(p, e.target.files[0])
                          }
                        />
                      </Button>

                      {(log.file || log.mainFilePath) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <IconButton size="small" onClick={() => handleDownload(log)}>
                            {log.preview || (log.mainFilePath && /\.(jpg|png|gif)$/i.test(log.mainFilePath))
                              ? (
                                <img
                                  src={log.preview || `http://168.107.51.143:8080/upload/${encodeURIComponent(log.mainFilePath)}`}
                                  style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                                  alt="thumb"
                                />
                              )
                              : <InsertDriveFileIcon color="primary" sx={{ fontSize: 28 }} />
                            }
                          </IconButton>

                          <Tooltip title={fileName}>
                            <Typography
                              variant="caption"
                              sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: 120
                              }}
                            >
                              {fileName}
                            </Typography>
                          </Tooltip>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
            <Button variant="contained" size="large" onClick={handleSave} startIcon={<SaveIcon />} sx={{ height: 50 }}>저장하기</Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LmsDailyLogModal;