/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogTitle, MenuItem, TextField, Table, TableHead, TableRow, TableCell, TableBody, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid"; 
import { useState, useEffect, useRef } from "react";
import api from "../../../api/axiosInstance";

interface LmsDailyLogModalProps {
  open: boolean;
  onClose: () => void;
  curSeq: number;
}

const LmsDailyLogModal = ({ open, onClose, curSeq }: LmsDailyLogModalProps) => {
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [subjects, setSubjects] = useState<any[]>([]); // 과목 리스트
  const [dailyLogs, setDailyLogs] = useState<Record<number, any>>({});
  const [attendance, setAttendance] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. 초기 데이터 로드 및 폼 초기화
  useEffect(() => {
    if (open) {
      // 모달이 열릴 때마다 파일 입력창 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // 과목 리스트 로드
      api.get(`/api/curriculum/subjects/${curSeq}`).then(res => setSubjects(res.data));
    }
  }, [open, curSeq]);

  useEffect(() => {
    if (open && logDate) {
      // 데이터가 없거나 조회 실패 시 폼이 초기화되도록 빈 객체로 설정
      setDailyLogs({}); 
      setAttendance([]);

      api.get(`/api/daily-log/curriculum/${curSeq}`, { params: { logDate } })
         .then(res => {
           // 서버에서 온 데이터가 있을 경우만 맵핑
           if (res.data && res.data.length > 0) {
             const logMap = res.data.reduce((acc: any, cur: any) => ({ ...acc, [cur.period]: cur }), {});
             setDailyLogs(logMap);
           }
         })
         .catch(() => setDailyLogs({})); // 에러 발생 시에도 초기화

      api.get(`/api/attendance/${curSeq}/${logDate}`)
         .then(res => setAttendance(res.data))
         .catch(() => setAttendance([]));
    }
  }, [logDate, curSeq, open]);

  // 2. 입력값 변경 (과목 또는 내용)
  const handleLogChange = (period: number, field: string, value: any) => {
    setDailyLogs(prev => ({
      ...prev,
      [period]: { ...prev[period], [field]: value, period }
    }));
  };

  // 3. 저장 로직
  const handleSave = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const regId = userInfo.accId; // accId 추출

    const logsPayload = Object.values(dailyLogs)
        .filter(log => log.subSeq && log.content)
        .map(log => ({ ...log, logDate: logDate, regId: regId, status: "A" }));

    if (logsPayload.length === 0) return;

    const formData = new FormData();
    
    // 서버의 @RequestPart(value = "logs")와 일치해야 합니다.
    formData.append("logs", new Blob([JSON.stringify(logsPayload)], { type: 'application/json' }));
    
    // 서버의 @RequestPart(value = "attachFile")와 일치해야 합니다.
    const file = fileInputRef.current?.files?.[0];
    if (file) {
        formData.append("attachFile", file);
    }

    try {
        await api.post("/api/daily-log/save", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
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
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12 }}>
            <TextField type="date" fullWidth label="일자 선택" value={logDate} onChange={(e) => setLogDate(e.target.value)} />
          </Grid>
        </Grid>

        {[...Array(8)].map((_, i) => (
          <Box key={i + 1} sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
            <TextField
              select
              label={`${i + 1}교시 과목`}
              sx={{ width: '30%' }}
              value={dailyLogs[i + 1]?.subSeq || ""}
              onChange={(e) => handleLogChange(i + 1, 'subSeq', e.target.value)}
            >
              {subjects.map((sub) => (
                <MenuItem key={sub.subSeq} value={sub.subSeq}>{sub.subName}</MenuItem>
              ))}
            </TextField>
            <TextField 
              fullWidth 
              label={`${i + 1}교시 수업 내용`} 
              value={dailyLogs[i + 1]?.content || ""}
              onChange={(e) => handleLogChange(i + 1, 'content', e.target.value)}
            />
          </Box>
        ))}

        <Box sx={{ my: 2 }}>
          <Button variant="outlined" component="label" sx={{ mr: 2 }}>
            파일 첨부
            <input type="file" hidden ref={fileInputRef} />
          </Button>
          <Button variant="contained" onClick={handleSave}>저장하기</Button>
        </Box>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>학생명</TableCell><TableCell>상태</TableCell><TableCell>사유</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map((row) => (
              <TableRow key={row.attendanceSeq}>
                <TableCell>{row.accountName}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.remark}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default LmsDailyLogModal;