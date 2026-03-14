/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, TextField, MenuItem, IconButton, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid"; 
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useState } from "react";
import api from "../../../api/axiosInstance";

const AttendanceTab = ({ students, logDate }: { students: any[], logDate: string }) => {
  const categories = ["지각자", "결석자", "조퇴자", "공결", "외출"];
  const [data, setData] = useState<Record<string, any[]>>({});

  const updateRow = (cat: string, index: number, field: string, value: any) => {
    setData(prev => {
      const newCatData = [...(prev[cat] || [])];
      newCatData[index] = { ...newCatData[index], [field]: value };
      return { ...prev, [cat]: newCatData };
    });
  };

  // 1. 초기값 설정 수정 (addRow)
  const addRow = (cat: string) => {
    setData(prev => ({
      ...prev,
      [cat]: [...(prev[cat] || []), { accountSeq: "", startTime: "", endTime: "", remark: "", file: null }]
    }));
  };

  // 2. 페이로드 생성 수정 (prepareAttendancePayload)
  const prepareAttendancePayload = () => {
    const payload: any[] = [];
    Object.entries(data).forEach(([statusType, rows]) => {
      rows.forEach((row: any) => {
        // accSeq -> accountSeq로 수정
        if (row.accountSeq) { 
          const { file: _file, ...rest } = row; 
          payload.push({ ...rest, status: statusType, attendanceDate: logDate });
        }
      });
    });
    return payload;
  };

  const removeRow = (cat: string, index: number) => {
    setData(prev => ({
      ...prev,
      [cat]: prev[cat].filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (cat: string, index: number, file: File) => {
    updateRow(cat, index, 'file', file);
  };

  const handleSaveAttendance = async () => {
    const payload = prepareAttendancePayload();
    if (payload.length === 0) return alert("저장할 내용이 없습니다.");

    const formData = new FormData();
    formData.append("attendance", new Blob([JSON.stringify(payload)], { type: 'application/json' }));

    Object.entries(data).forEach(([cat, rows]) => {
      rows.forEach((row: any, idx: number) => {
        if (row.file) {
          // 키 생성: 서버의 fileMap.get("file_" + att.getStatus() + "_" + i) 와 일치하게 구성
          formData.append(`file_${cat}_${idx}`, row.file); 
        }
      });
    });
    
    try {
      await api.post("/api/attendance/insert", formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      alert("출석 정보가 저장되었습니다.");
    } catch (e) {
      console.error("출석 저장 실패:", e);
      alert("출석 저장 실패");
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {categories.map((cat) => (
        <Paper key={cat} sx={{ p: 2, borderLeft: '6px solid #e91e63' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1" fontWeight="bold">{cat}</Typography>
            <IconButton color="secondary" onClick={() => addRow(cat)}><AddCircleOutlineIcon /></IconButton>
          </Box>
          
          {(data[cat] || []).map((row, idx) => (
            <Grid container spacing={1} alignItems="center" key={idx} sx={{ mb: 1 }}>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField select fullWidth label="학생" size="small" value={row.accountSeq}
                  onChange={(e) => updateRow(cat, idx, 'accountSeq', e.target.value)}>
                  {students.map(s => <MenuItem key={s.accountSeq} value={s.accountSeq}>{s.accountName}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }} display="flex" gap={1}>
                <TextField type="time" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} label="시작" 
                  value={row.startTime} onChange={(e) => updateRow(cat, idx, 'startTime', e.target.value)} />
                <TextField type="time" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} label="종료" 
                  value={row.endTime} onChange={(e) => updateRow(cat, idx, 'endTime', e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField fullWidth placeholder="사유" size="small" value={row.remark}
                  onChange={(e) => updateRow(cat, idx, 'remark', e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }} display="flex" alignItems="center" gap={1}>
                <Button component="label" size="small" variant="outlined" startIcon={<InsertDriveFileIcon />}>
                  {row.file ? "변경" : "파일"}
                  <input type="file" hidden onChange={(e) => e.target.files?.[0] && handleFileChange(cat, idx, e.target.files[0])} />
                </Button>
                {row.file && (
                  <Typography variant="caption" noWrap sx={{ maxWidth: 60 }}>
                    {row.file.name}
                  </Typography>
                )}
                <IconButton color="error" onClick={() => removeRow(cat, idx)}><RemoveCircleOutlineIcon /></IconButton>
              </Grid>
            </Grid>
          ))}
          
          {(data[cat] || []).length > 0 && (
            <Button variant="contained" color="secondary" onClick={handleSaveAttendance} sx={{ mt: 1 }}>
              {cat} 저장
            </Button>
          )}
        </Paper>
      ))}
    </Box>
  );
};
export default AttendanceTab;