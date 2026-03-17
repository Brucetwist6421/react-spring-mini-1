/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Avatar, Box, Button, IconButton, MenuItem, Paper, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useRef, useState } from "react";
import api from "../../../api/axiosInstance";
import { fileListDownload } from "../../../api/fileListDownload";

const STATUS_MAP: Record<string, string> = {
  "지각자": "LATE",
  "결석자": "ABSENT",
  "조퇴자": "EARLY",
  "공결": "OFFICIAL",
  "외출": "OUTING"
};

interface AttendanceTabProps {
  students: any[];
  logDate: string;
  curSeq: number | string; 
}

const AttendanceTab = ({ students, curSeq, logDate: parentDate }: AttendanceTabProps) => {
  const categories = Object.keys(STATUS_MAP);
  const [data, setData] = useState<Record<string, any[]>>({});

  const [logDate, setLogDate] = useState(parentDate || new Date().toISOString().split('T')[0]);
  const dateRef = useRef<HTMLInputElement>(null);

  const updateRow = (cat: string, index: number, field: string, value: any) => {
    setData(prev => {
      const newCatData = [...(prev[cat] || [])];
      if (field === 'file') {
        if (newCatData[index].preview) URL.revokeObjectURL(newCatData[index].preview);
        newCatData[index] = { 
          ...newCatData[index], 
          [field]: value, 
          preview: value.type.startsWith('image/') ? URL.createObjectURL(value) : null 
        };
      } else {
        newCatData[index] = { ...newCatData[index], [field]: value };
      }
      return { ...prev, [cat]: newCatData };
    });
  };

  const removeFile = (cat: string, index: number) => {
    setData(prev => {
      const newCatData = [...(prev[cat] || [])];
      const row = newCatData[index];
      if (row.preview) URL.revokeObjectURL(row.preview);
      newCatData[index] = { ...row, file: null, preview: null, mainFilePath: null, fileDeleted: true };
      return { ...prev, [cat]: newCatData };
    });
  };

  const handleDownload = (row: any) => {
    if (row.mainFilePath && !row.file) {
      fileListDownload({ url: `http://168.107.51.143:8080/upload/${encodeURIComponent(row.mainFilePath.trim())}` });
    }
  };

  const addRow = (cat: string) => {
    setData(prev => ({
      ...prev,
      [cat]: [...(prev[cat] || []), { accountSeq: "", startTime: "", endTime: "", remark: "", file: null, preview: null, curSeq: curSeq }]
    }));
  };

  const removeRow = (cat: string, index: number) => {
    setData(prev => ({
      ...prev,
      [cat]: prev[cat].filter((_, i) => i !== index)
    }));
  };

  const handleSaveAttendance = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const payload: any[] = [];
    const formData = new FormData();
    let hasError = false; // 유효성 검사 플래그

    // 1. 데이터 검증 루프
    for (const [cat, rows] of Object.entries(data)) {
      for (const [idx, row] of (rows as any[]).entries()) {
        if (row.accountSeq) {
          const { file, preview, ...rest } = row;
          payload.push({ 
            ...rest, 
            status: STATUS_MAP[cat], 
            attendanceDate: logDate, 
            curSeq: Number(curSeq), 
            regId: userInfo.accId, 
            fileDeleted: !!row.fileDeleted 
          });
          if (file) formData.append(`file_${STATUS_MAP[cat]}_${idx}`, file);
        } else if (Object.keys(row).some(key => key !== 'preview' && row[key])) {
          // 학생은 선택 안 했는데 시간이나 사유를 적은 경우
          alert(`[${cat}] ${idx + 1}번째 행의 학생을 선택해주세요.`);
          hasError = true;
          break;
        }
      }
      if (hasError) break;
    }

    if (hasError) return; // 검증 실패 시 중단
    if (payload.length === 0) return alert("저장할 내용이 없습니다.");

    // 2. 저장 API 호출
    formData.append("attendance", new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    try {
      await api.post("/api/attendance/insert", formData, { headers: { 'Content-Type': undefined } });
      alert("저장되었습니다.");
    } catch (e) {
      console.error(e);
      alert("저장 실패");
    }
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!logDate || !curSeq) return;
      try {
        const res = await api.get(`/api/attendance/list/${curSeq}`, { params: { logDate } });
        const grouped = res.data.reduce((acc: any, cur: any) => {
          const catName = Object.keys(STATUS_MAP).find(key => STATUS_MAP[key] === cur.status);
          if (catName) acc[catName] = [...(acc[catName] || []), { ...cur, preview: null }];
          return acc;
        }, {});
        setData(grouped);
      } catch (e) { console.error(e); }
    };
    fetchAttendance();
  }, [logDate, curSeq]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* 훈련 내용 등록과 동일한 날짜 선택 컴포넌트 */}
      <Paper sx={{ p: 2, width: 'fit-content' }}>
        <Box sx={{ width: 220, cursor: "pointer" }} onClick={() => dateRef.current?.click()}>
          <TextField
            fullWidth type="date" label="조회 날짜" value={logDate} size="small"
            onChange={(e) => setLogDate(e.target.value)} inputRef={dateRef}
            slotProps={{ 
              inputLabel: { shrink: true }, 
              htmlInput: { style: { cursor: "pointer" } } 
            }}
          />
        </Box>
      </Paper>

      {categories.map((cat) => (
        <Paper key={cat} sx={{ p: 2, borderLeft: '6px solid #e91e63' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1" fontWeight="bold">{cat}</Typography>
            <IconButton color="secondary" onClick={() => addRow(cat)}><AddCircleOutlineIcon /></IconButton>
          </Box>
          {(data[cat] || []).map((row, idx) => {
            const fileName = row.file ? row.file.name : (row.mainFilePath?.split('_').slice(1).join('_') || '');
            const hasFile = !!(row.file || row.mainFilePath);
            return (
              <Grid container spacing={1} alignItems="center" key={idx} sx={{ mb: 1 }}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField select fullWidth label="학생" size="small" value={row.accountSeq} onChange={(e) => updateRow(cat, idx, 'accountSeq', e.target.value)}
                    sx={{ '& .MuiInputBase-root': { height: '60px' } }}
                    slotProps={{
                      select: {
                        renderValue: (selected: any) => {
                          const s = students.find(x => x.accountSeq === selected);
                          return s ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                              <Avatar src={s.mainImagePath ? `http://168.107.51.143:8080/upload/${s.mainImagePath}` : undefined} sx={{ width: 50, height: 50 }} />
                              <Typography>{s.accountName}</Typography>
                            </Box>
                          ) : "";
                        }
                      }
                    }}>
                    {students.map(s => (
                      <MenuItem key={s.accountSeq} value={s.accountSeq} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                        <Avatar src={s.mainImagePath ? `http://168.107.51.143:8080/upload/${s.mainImagePath}` : undefined} sx={{ width: 50, height: 50 }} />
                        <Typography>{s.accountName}</Typography>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }} display="flex" gap={1}>
                  <TextField type="time" size="small" fullWidth label="시작" value={row.startTime} onChange={(e) => updateRow(cat, idx, 'startTime', e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
                  <TextField type="time" size="small" fullWidth label="종료" value={row.endTime} onChange={(e) => updateRow(cat, idx, 'endTime', e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} display="flex" alignItems="center" gap={1}>
                  <Button component="label" size="small" variant="outlined">파일<input type="file" hidden onChange={(e) => e.target.files?.[0] && updateRow(cat, idx, 'file', e.target.files[0])} /></Button>
                  {hasFile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #eee', p: 0.5, borderRadius: 1 }}>
                      <IconButton size="small" onClick={() => handleDownload(row)}>
                        {row.preview || (row.mainFilePath && /\.(jpg|png|gif)$/i.test(row.mainFilePath)) 
                          ? <img src={row.preview || `http://168.107.51.143:8080/upload/${encodeURIComponent(row.mainFilePath)}`} style={{ width: 50, height: 50, objectFit: 'cover' }} /> 
                          : <InsertDriveFileIcon color="primary" />}
                      </IconButton>
                      <Typography variant="caption" sx={{ maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>{fileName}</Typography>
                      <IconButton size="small" onClick={() => removeFile(cat, idx)}><CancelIcon color="error" fontSize="small" /></IconButton>
                    </Box>
                  )}
                  <IconButton color="error" onClick={() => removeRow(cat, idx)}><RemoveCircleOutlineIcon /></IconButton>
                </Grid>
              </Grid>
            );
          })}
          {(data[cat] || []).length > 0 && <Button variant="contained" color="secondary" onClick={handleSaveAttendance} sx={{ mt: 1 }}>{cat} 저장</Button>}
        </Paper>
      ))}
    </Box>
  );
};
export default AttendanceTab;