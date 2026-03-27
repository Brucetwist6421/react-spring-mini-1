/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel'; // 삭제 아이콘 추가
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../../api/axiosInstance";
import { fileListDownload } from "../../../api/fileListDownload";
import RandomSpinner from "../../../components/RandomSpinner";
import AttendanceTab from './AttendanceTab';
import CloseIcon from '@mui/icons-material/Close';

const LmsDailyLogModal = ({ open, onClose, curSeq, curData, startDate, endDate }: any) => {
  const [logDate, setLogDate] = useState<string>("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [dailyLogs, setDailyLogs] = useState<Record<number, any>>({});
  const [isReady, setIsReady] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [students, setStudents] = useState<any[]>([]);

  // 데이터 조회 함수 분리
  const fetchLogs = useCallback(async () => {
    if (!open || !logDate || !curSeq) return;
    setIsReady(false);
    try {
      const [subRes, logRes, stuRes] = await Promise.all([
        api.get(`/api/curriculum/subjects/${curSeq}`),
        api.get(`/api/daily-log/curriculum/${curSeq}`, { params: { logDate } }),
        api.get(`/api/account/${curSeq}/students/daily`)
      ]);
      setSubjects(subRes.data);
      const logMap = (logRes.data || []).reduce((acc: any, cur: any) => ({ ...acc, [cur.period]: { ...cur } }), {});
      setDailyLogs(logMap);
      setStudents(stuRes.data);
      setIsReady(true);
    } catch (e) {
      console.error(e);
      setIsReady(true);
    }
  }, [open, curSeq, logDate]);

  useEffect(() => {
    if (open) {
      setLogDate(new Date().toISOString().split('T')[0]);
    }
  }, [open]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleLogChange = (period: number, field: string, value: any) => {
    setDailyLogs(prev => ({ ...prev, [period]: { ...prev[period], [field]: value, period } }));
  };

  const handleFileChange = (period: number, file: File) => {
    setDailyLogs(prev => {
      if (prev[period]?.preview) URL.revokeObjectURL(prev[period].preview);
      return { ...prev, [period]: { ...prev[period], file, preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null } };
    });
  };

  const handleFileDelete = (period: number) => {
    setDailyLogs(prev => ({
      ...prev,
      [period]: {
        ...prev[period],
        file: null,
        preview: null,
        mainFilePath: null,
        fileDeleted: true
      }
    }));
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

    // 1. 유효성 검사 로직: 과목 미선택 시 저장 차단
    for (const [period, data] of Object.entries(dailyLogs)) {
      const logData = data as any;
      const hasContent = !!logData.content?.trim();
      const hasFile = !!(logData.file || logData.mainFilePath);
      
      // 내용이나 파일이 있는데 과목이 선택되지 않은 경우
      if ((hasContent || hasFile) && !logData.subSeq) {
        alert(`${period}교시: 훈련 내용 또는 파일이 첨부되었습니다. 과목을 선택해주세요.`);
        return; // 저장 중단
      }
    }

    // 2. 데이터 구성 로직
    Object.entries(dailyLogs).forEach(([period, data]: any) => {
      // subSeq가 있는 경우에만 유효한 로그로 간주하여 전송
      if (data.subSeq) {
        const { file, preview, ...rest } = data;
        
        const logData = { 
          ...rest, 
          mainFilePath: data.fileDeleted ? null : data.mainFilePath, 
          fileDeleted: !!data.fileDeleted 
        };

        logsPayload.push({ ...logData, logDate, regId: userInfo.accId, status: "A" });
        
        if (file) formData.append(`file_${period}`, file);
      }
    });

    if (logsPayload.length === 0) return alert("저장할 내용이 없습니다.");

    formData.append("logs", new Blob([JSON.stringify(logsPayload)], { type: 'application/json' }));
    
    try {
      await api.post("/api/daily-log/save", formData, { headers: { 'Content-Type': undefined } });
      alert("저장되었습니다.");
      fetchLogs(); // 저장 후 데이터 재조회
    } catch (e) {
      console.error(e);
      alert("저장에 실패했습니다."); 
    }
  };

  const handleCloseAndReload = () => {
    onClose(); // 부모의 state를 닫힘으로 변경
    // window.location.reload(); // 페이지 전체 새로고침
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      {/* 헤더 섹션: 제목과 X 버튼 */}
      <DialogTitle sx={{ 
        m: 0, p: 2.5, bgcolor: '#f8f9fa', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' 
      }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b' }}>
            훈련일지 관리 - {curData?.curName} - {curData?.className}호 ({curData?.term}기)
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.95rem", fontWeight: 500 }}>
            📅 훈련 기간 : {curData.period? `${curData.period}` : `${startDate} ~ ${endDate}`}
          </Typography>
        </Box>
        
        {/* 우측 상단 X 버튼 */}
        <IconButton
          aria-label="close"
          onClick={handleCloseAndReload}
          sx={{
            color: (theme) => theme.palette.grey[500],
            '&:hover': { color: '#ef4444', bgcolor: '#fee2e2' },
            transition: '0.2s'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* 탭 섹션 */}
      <Box sx={{ px: 3, bgcolor: '#f8f9fa', borderBottom: '1px solid #e2e8f0' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="훈련 일지" sx={{ fontWeight: 700 }} />
          <Tab label="출석 관리" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>
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
                                ? <img src={log.preview || `http://168.107.51.143:8080/upload/${encodeURIComponent(log.mainFilePath)}`} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} alt="thumb" /> 
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
          <AttendanceTab students={students} logDate={logDate} setLogDate={setLogDate} curSeq={curSeq} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LmsDailyLogModal;