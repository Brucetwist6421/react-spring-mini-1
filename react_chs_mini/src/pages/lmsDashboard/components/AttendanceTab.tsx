/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, TextField, MenuItem, IconButton, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid2로 수정
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useState } from "react";
import api from "../../../api/axiosInstance";

const STATUS_MAP: Record<string, string> = {
  "지각자": "LATE",
  "결석자": "ABSENT",
  "조퇴자": "EARLY",
  "공결": "OFFICIAL",
  "외출": "OUTING"
};

// Props에 curSeq 추가하여 데이터 누락 방지
interface AttendanceTabProps {
  students: any[];
  logDate: string;
  curSeq: number | string; 
}

const AttendanceTab = ({ students, logDate, curSeq }: AttendanceTabProps) => {
  const categories = Object.keys(STATUS_MAP);
  const [data, setData] = useState<Record<string, any[]>>({});

  const updateRow = (cat: string, index: number, field: string, value: any) => {
    setData(prev => {
      const newCatData = [...(prev[cat] || [])];
      newCatData[index] = { ...newCatData[index], [field]: value };
      return { ...prev, [cat]: newCatData };
    });
  };

  const addRow = (cat: string) => {
    setData(prev => ({
      ...prev,
      [cat]: [...(prev[cat] || []), { accountSeq: "", startTime: "", endTime: "", remark: "", file: null, curSeq: curSeq }]
    }));
  };

  const removeRow = (cat: string, index: number) => {
    setData(prev => ({
      ...prev,
      [cat]: prev[cat].filter((_, i) => i !== index)
    }));
  };

  const prepareAttendancePayload = () => {
    const payload: any[] = [];
    Object.entries(data).forEach(([cat, rows]) => {
      rows.forEach((row: any) => {
        if (row.accountSeq) {
          const { file: _file, ...rest } = row; 
          payload.push({ 
            ...rest, 
            status: STATUS_MAP[cat], 
            attendanceDate: logDate,
            curSeq: Number(curSeq) // 서버에서 정수형으로 인식하도록 강제 변환
          });
        }
      });
    });
    return payload;
  };

  const handleSaveAttendance = async () => {
    const payload = prepareAttendancePayload();
    if (payload.length === 0) return alert("저장할 내용이 없습니다.");

    const formData = new FormData();
    formData.append("attendance", new Blob([JSON.stringify(payload)], { type: 'application/json' }));

    Object.entries(data).forEach(([cat, rows]) => {
      rows.forEach((row: any, idx: number) => {
        if (row.file) {
          formData.append(`file_${STATUS_MAP[cat]}_${idx}`, row.file); 
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
                  <input type="file" hidden onChange={(e) => e.target.files?.[0] && updateRow(cat, idx, 'file', e.target.files[0])} />
                </Button>
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