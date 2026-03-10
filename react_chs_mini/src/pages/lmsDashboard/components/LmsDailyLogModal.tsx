/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogTitle, TextField, Table, TableHead, TableRow, TableCell, TableBody, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid2 사용 권장
import { useState, useEffect, useRef } from "react";
import api from "../../../api/axiosInstance";

interface LmsDailyLogModalProps {
  open: boolean;
  onClose: () => void;
  curSeq: number;
}

const LmsDailyLogModal = ({ open, onClose, curSeq }: LmsDailyLogModalProps) => {
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dailyLogs, setDailyLogs] = useState<Record<number, any>>({});
  const [attendance, setAttendance] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. 데이터 조회 (날짜 기준 8교시 전체 로드)
  useEffect(() => {
    if (open && logDate) {
      // 8교시 일지 조회
      api.get(`/api/daily-log/curriculum/${curSeq}`, { params: { logDate } })
         .then(res => {
           // 서버에서 받은 List를 period 기준 객체로 변환
           const logMap = res.data.reduce((acc: any, cur: any) => ({ ...acc, [cur.period]: cur }), {});
           setDailyLogs(logMap);
         })
         .catch(err => console.error("일지 조회 실패", err));

      // 출석 조회
      api.get(`/api/attendance/${curSeq}/${logDate}`)
         .then(res => setAttendance(res.data))
         .catch(err => console.error("출석 조회 실패", err));
    }
  }, [logDate, curSeq, open]);

  // 2. 입력값 변경
  const handleLogChange = (period: number, value: string) => {
    setDailyLogs(prev => ({
      ...prev,
      [period]: { ...prev[period], content: value, period }
    }));
  };

  // 3. 저장 로직 (FormData)
  const handleSave = async () => {
    const logsPayload = Object.values(dailyLogs).filter(log => log.content); // 내용이 있는 것만 전송
    const formData = new FormData();

    // JSON 문자열을 명확한 타입의 Blob으로 전송
    formData.append("logs", new Blob([JSON.stringify(logsPayload)], { type: "application/json" }));

    if (fileInputRef.current?.files?.[0]) {
        formData.append("attachFile", fileInputRef.current.files[0]);
    }
    console.log("저장할 데이터:", formData);
    console.log("logsPayload:", logsPayload);
    try {
      await api.post("/api/daily-log/save", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("저장되었습니다.");
      onClose();
    } catch (error) {
      console.error("저장 실패", error);
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

        {/* 1~8교시 입력 폼 */}
        {[...Array(8)].map((_, i) => (
          <TextField 
            key={i + 1}
            fullWidth 
            label={`${i + 1}교시 수업 내용`} 
            sx={{ mb: 1.5 }}
            value={dailyLogs[i + 1]?.content || ""}
            onChange={(e) => handleLogChange(i + 1, e.target.value)}
          />
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