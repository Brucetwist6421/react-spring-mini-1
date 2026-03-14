/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel'; // 삭제 아이콘 추가
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useRef, useState } from "react";
import api from "../../../api/axiosInstance";
import { fileListDownload } from "../../../api/fileListDownload";
import RandomSpinner from "../../../components/RandomSpinner";
import AttendanceTab from './AttendanceTab';

const LmsDailyLogModal = ({ open, onClose, curSeq, curData }: any) => {
  const [logDate, setLogDate] = useState<string>("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [dailyLogs, setDailyLogs] = useState<Record<number, any>>({});
  const [isReady, setIsReady] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [students, setStudents] = useState<any[]>([]);

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
        api.get(`/api/daily-log/curriculum/${curSeq}`, { params: { logDate } }),
        api.get(`/api/account/${curSeq}/students`)
      ])
      .then(([subRes, logRes, stuRes]) => {
        setSubjects(subRes.data);
        const logMap = (logRes.data || []).reduce((acc: any, cur: any) => ({ ...acc, [cur.period]: { ...cur } }), {});
        setDailyLogs(logMap);
        setStudents(stuRes.data);
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

  // 파일 삭제 핸들러
  const handleFileDelete = (period: number) => {
    setDailyLogs(prev => {
      const updated = {
        ...prev,
        [period]: {
          ...prev[period],
          file: null,          // 파일 객체 제거
          preview: null,       // 미리보기 제거
          mainFilePath: null,  // 경로 제거
          fileDeleted: true    // 삭제 플래그 활성화
        }
      };
      console.log("삭제 후 로그 상태:", updated[period]); // <--- 여기서 확인하세요!
      return updated;
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

    // 1. 유효성 검사 로직은 그대로 유지
    const logEntries = Object.entries(dailyLogs);
    for (const [period, data] of logEntries) {
      const hasContent = !!data.content?.trim();
      const hasFile = !!(data.file || data.mainFilePath);
      if ((hasContent || hasFile) && !data.subSeq) {
        alert(`${period}교시 과목을 선택해주세요.`);
        return;
      }
    }

    // 2. 데이터 구성 로직 수정
    Object.entries(dailyLogs).forEach(([period, data]: any) => {
      // 삭제 요청(fileDeleted: true)이 있거나, 내용/파일이 존재하는 경우에만 전송
      if (data.subSeq && (data.content || data.file || data.mainFilePath || data.fileDeleted)) {
        
        // file, preview를 제외한 나머지 데이터를 복사
        const { file, preview, ...rest } = data;
        
        // 삭제 요청이 있다면 mainFilePath를 null로 확실하게 설정
        const logData = {
          ...rest,
          mainFilePath: data.fileDeleted ? null : data.mainFilePath,
          fileDeleted: !!data.fileDeleted // 명시적으로 포함
        };

        console.log("전송할 payload 항목:", logData);
        logsPayload.push({ ...logData, logDate, regId: userInfo.accId, status: "A" });
        
        // 실제 파일이 새로 선택된 경우만 formData에 append
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
        <Box>훈련일지 관리 - {curData?.curName} - {curData?.className}호 ({curData?.term}기)</Box>
        <Typography variant="caption" sx={{ color: "#666", fontSize: "1rem" }}>
          훈련 기간 : {curData?.period}
        </Typography>
      </DialogTitle>
      <DialogTitle>
        {/* 기존 타이틀 코드 */}
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mt: 2 }}>
          <Tab label="훈련 일지" />
          <Tab label="출석 관리" />
        </Tabs>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#f9f9f9', pt: 2 }}>
        {activeTab === 0 ? (
          !isReady ? <RandomSpinner /> : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ width: 220, cursor: "pointer" }} onClick={() => dateRef.current?.click()}>
                  <TextField
                    fullWidth type="date" label="조회 날짜" value={logDate} size="small"
                    onChange={(e) => setLogDate(e.target.value)} inputRef={dateRef}
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { style: { cursor: "pointer" } } }}
                  />
                </Box>
              </Paper>

              <Paper sx={{ px: 2, py: 1, bgcolor: "#f5f7fa", border: "1px dashed #d0d7de" }}>
                <Typography variant="caption" sx={{ color: "#555", display: "flex", alignItems: "center" }}>
                  📎 첨부된 파일 아이콘 또는 이미지를 클릭하면 다운로드됩니다. (X 버튼 클릭 시 삭제)
                </Typography>
              </Paper>

              {[...Array(8)].map((_, i) => {
                const p = i + 1;
                const log = dailyLogs[p] || {};
                const hasAnyFile = !!(log.file || log.mainFilePath);
                const fileName = log.file ? log.file.name : (log.mainFilePath?.split('_').slice(1).join('_') || '');
                
                return (
                  <Paper key={p} sx={{ p: 1.5, borderLeft: '6px solid #1976d2', bgcolor: log.subSeq ? '#fff' : '#fff9f9' }}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid size={{ xs: 12, md: 2 }}>
                        <TextField 
                          select fullWidth label={`${p}교시`} size="small" value={log.subSeq || ""} 
                          onChange={(e) => handleLogChange(p, 'subSeq', e.target.value)}
                          error={(!!log.content || hasAnyFile) && !log.subSeq}
                        >
                          <MenuItem value=""><em>과정 선택</em></MenuItem>
                          {subjects.map((s) => <MenuItem key={s.subSeq} value={s.subSeq}>{s.subName}({s.teacherName})</MenuItem>)}
                        </TextField>
                      </Grid>
                      
                      <Grid size={{ xs: 12, md: 7.5 }}>
                        <TextField 
                          fullWidth multiline minRows={1} maxRows={4} label="훈련 내용" size="small" 
                          value={log.content || ""} onChange={(e) => handleLogChange(p, 'content', e.target.value)} 
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 2.5 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="outlined" component="label" size="small" sx={{ whiteSpace: "nowrap", minWidth: 80 }}>
                          파일 선택 <input type="file" hidden onChange={(e) => e.target.files?.[0] && handleFileChange(p, e.target.files[0])} />
                        </Button>
                        
                        {hasAnyFile && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, position: 'relative', border: '1px solid #eee', p: 0.5, borderRadius: 1 }}>
                            <IconButton size="small" onClick={() => handleDownload(log)}>
                              {log.preview || (log.mainFilePath && /\.(jpg|png|gif)$/i.test(log.mainFilePath)) 
                                ? <img src={log.preview || `http://168.107.51.143:8080/upload/${encodeURIComponent(log.mainFilePath)}`} style={{ width: 35, height: 35, objectFit: 'cover', borderRadius: 4 }} alt="thumb" /> 
                                : <InsertDriveFileIcon color="primary" sx={{ fontSize: 24 }} />}
                            </IconButton>
                            <Tooltip title={fileName}>
                              <Typography variant="caption" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 60 }}>
                                {fileName}
                              </Typography>
                            </Tooltip>
                            {/* 파일 삭제 버튼 */}
                            <IconButton 
                              size="small" 
                              onClick={() => handleFileDelete(p)}
                              sx={{ p: 0, color: '#d32f2f' }}
                            >
                              <CancelIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                );
              })}
              <Button variant="contained" size="large" onClick={handleSave} startIcon={<SaveIcon />} sx={{ height: 50 }}>저장하기</Button>
            </Box>
          )
        ) : (
          <AttendanceTab students={students} logDate={logDate} curSeq={curSeq} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LmsDailyLogModal;