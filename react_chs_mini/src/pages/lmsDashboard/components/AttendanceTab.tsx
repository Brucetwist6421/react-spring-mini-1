/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Avatar, Box, Button, IconButton, MenuItem, Paper, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"; 
import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../../api/axiosInstance";
import { fileListDownload } from "../../../api/fileListDownload";
import RandomSpinner from '../../../components/RandomSpinner';

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
  setLogDate: (date: string) => void;
  curSeq: number | string; 
}

const AttendanceTab = ({ students, curSeq, logDate, setLogDate }: AttendanceTabProps) => {
  const categories = Object.keys(STATUS_MAP);
  const [data, setData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);

  // ✅ 1. useCallback으로 함수를 감싸 메모이제이션합니다.
  // 의존성 배열에 있는 logDate나 curSeq가 변할 때만 함수가 새로 정의됩니다.
  const fetchAttendance = useCallback(async () => {
    if (!logDate || !curSeq) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/attendance/list/${curSeq}`, { params: { logDate } });
      const grouped = res.data.reduce((acc: any, cur: any) => {
        const catName = Object.keys(STATUS_MAP).find(key => STATUS_MAP[key] === cur.status);
        if (catName) acc[catName] = [...(acc[catName] || []), { ...cur, preview: null }];
        return acc;
      }, {});
      setData(grouped);
    } catch (e) {
      console.error(e); 
    } finally {
      setLoading(false);
    }
  }, [logDate, curSeq]); // logDate와 curSeq를 의존성에 추가

  // ✅ 2. 이제 useEffect의 의존성 배열에 fetchAttendance를 넣어도 안전합니다.
  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

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

  // ✅ 행 삭제 로직 수정 (API 연동)
  const removeRow = async (cat: string, index: number) => {
    const rowToDelete = data[cat][index];

    // DB에 저장된 데이터인 경우 서버에 삭제 요청
    if (rowToDelete.attendanceSeq) {
      if (!window.confirm("이 출석 기록을 영구 삭제하시겠습니까?")) return;
      
      try {
        await api.delete(`/api/attendance/${rowToDelete.attendanceSeq}`);
        // 삭제 성공 시 알림 생략하고 바로 UI 업데이트 가능
      } catch (e) {
        console.error(e);
        alert("기록 삭제 중 오류가 발생했습니다.");
        return;
      }
    }

    // UI 상태 업데이트
    setData(prev => ({
      ...prev,
      [cat]: prev[cat].filter((_, i) => i !== index)
    }));
  };

  const handleSaveAttendance = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const payload: any[] = [];
    const formData = new FormData();
    let hasError = false;

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
          alert(`[${cat}] ${idx + 1}번째 행의 학생을 선택해주세요.`);
          hasError = true;
          break;
        }
      }
      if (hasError) break;
    }

    if (hasError) return;
    if (payload.length === 0) return alert("저장할 내용이 없습니다.");

    formData.append("attendance", new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    try {
      await api.post("/api/attendance/insert", formData, { headers: { 'Content-Type': undefined } });
      alert("저장되었습니다.");
      fetchAttendance(); // 저장 후 최신 데이터 재조회 (attendanceSeq 확보용)
    } catch (e) {
      console.error(e);
      alert("저장 실패");
    }
  };

  if(loading) return <RandomSpinner />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 2, width: 'fit-content' }}>
        <Box sx={{ width: 220, cursor: "pointer" }} onClick={() => dateRef.current?.click()}>
          <TextField
            fullWidth type="date" label="출석 조회 날짜" value={logDate} size="small"
            onChange={(e) => setLogDate(e.target.value)}
            inputRef={dateRef}
            slotProps={{ 
              inputLabel: { shrink: true }, 
              htmlInput: { style: { cursor: "pointer" } } 
            }}
          />
        </Box>
      </Paper>

      <Paper sx={{ px: 2, py: 1, bgcolor: "#f5f7fa", border: "1px dashed #d0d7de" }}>
        <Typography variant="caption" sx={{ color: "#555", display: "flex", alignItems: "center" }}>
          📎 첨부된 파일 아이콘 또는 이미지를 클릭하면 다운로드됩니다. (X 버튼 클릭 시 삭제)
        </Typography>
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
                              <Avatar src={s.mainImagePath ? `http://168.107.51.143:8080/upload/${s.mainImagePath}` : undefined} sx={{ width: 45, height: 45 }} />
                              <Typography>{s.accountName}</Typography>
                            </Box>
                          ) : "";
                        }
                      }
                    }}>
                    {students.map(s => (
                      <MenuItem key={s.accountSeq} value={s.accountSeq} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                        <Avatar src={s.mainImagePath ? `http://168.107.51.143:8080/upload/${s.mainImagePath}` : undefined} sx={{ width: 45, height: 45 }} />
                        <Typography>{s.accountName}</Typography>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 4.5 }} display="flex" gap={1}>
                  <TextField type="time" size="small" fullWidth label="시작" value={row.startTime ? row.startTime.substring(11, 16) : ""} onChange={(e) => updateRow(cat, idx, 'startTime', e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
                  <TextField type="time" size="small" fullWidth label="종료" value={row.endTime ? row.endTime.substring(11, 16) : ""} onChange={(e) => updateRow(cat, idx, 'endTime', e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
                </Grid>
                <Grid size={{ xs: 12, md: 4.5 }} display="flex" alignItems="center" gap={1}>
                  <Button component="label" size="small" variant="outlined" sx={{ minWidth: 60 }}>파일<input type="file" hidden onChange={(e) => e.target.files?.[0] && updateRow(cat, idx, 'file', e.target.files[0])} /></Button>
                  {hasFile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #eee', p: 0.5, borderRadius: 1 }}>
                      <IconButton size="small" onClick={() => handleDownload(row)}>
                        {row.preview || (row.mainFilePath && /\.(jpg|png|gif)$/i.test(row.mainFilePath)) 
                          ? <img src={row.preview || `http://168.107.51.143:8080/upload/${encodeURIComponent(row.mainFilePath)}`} style={{ width: 40, height: 40, objectFit: 'cover' }} /> 
                          : <InsertDriveFileIcon color="primary" />}
                      </IconButton>
                      <Typography variant="caption" sx={{ maxWidth: 40, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{fileName}</Typography>
                      <IconButton size="small" onClick={() => removeFile(cat, idx)}><CancelIcon color="error" fontSize="small" /></IconButton>
                    </Box>
                  )}
                  {/* ✅ 아이콘 대신 '삭제' 버튼으로 변경 */}
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small" 
                    onClick={() => removeRow(cat, idx)}
                    sx={{ minWidth: 60, fontWeight: 'bold' }}
                  >
                    삭제
                  </Button>
                </Grid>
              </Grid>
            );
          })}
          {(data[cat] || []).length > 0 && <Button variant="contained" color="secondary" onClick={handleSaveAttendance} sx={{ mt: 1 }}>{cat} 전체 저장</Button>}
        </Paper>
      ))}
    </Box>
  );
};

export default AttendanceTab;