/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogTitle, MenuItem, TextField, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid2 전용 임포트
import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";

interface LmsDailyLogModalProps {
  open: boolean;
  onClose: () => void;
  curSeq: number;
}

const LmsDailyLogModal = ({ open, onClose, curSeq }: LmsDailyLogModalProps) => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSub, setSelectedSub] = useState("");
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  
  // 1~8교시 데이터를 객체로 관리: { 1: "내용", 2: "내용", ... }
  const [dailyLogs, setDailyLogs] = useState<Record<number, string>>({});
  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      api.get(`/api/curriculum/subjects/${curSeq}`).then(res => setSubjects(res.data));
    }
  }, [open, curSeq]);

  useEffect(() => {
    console.log("Selected Subject:", selectedSub, "Log Date:", logDate);
    if (selectedSub && logDate) {
      // 교시별 데이터를 조회하여 상태 업데이트
      api.get(`/api/daily-log/${selectedSub}`, { params: { logDate } })
         .then(res => {
           const logs = res.data.reduce((acc: any, cur: any) => ({ ...acc, [cur.period]: cur.content }), {});
           setDailyLogs(logs);
         });
      
      api.get(`/api/attendance/${curSeq}/${logDate}`).then(res => setAttendance(res.data));
    }
  }, [selectedSub, logDate, curSeq]);

  const handleLogChange = (period: number, value: string) => {
    setDailyLogs(prev => ({ ...prev, [period]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>훈련일지 관리 (1~8교시)</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6 }}>
            <TextField select fullWidth label="과목 선택" value={selectedSub} onChange={(e) => setSelectedSub(e.target.value)}>
               {subjects.map((sub) => <MenuItem key={sub.subSeq} value={sub.subSeq}>{sub.subName}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField type="date" fullWidth label="일자 선택" value={logDate} onChange={(e) => setLogDate(e.target.value)} />
          </Grid>
        </Grid>

        {/* 1~8교시 입력 폼 반복 생성 */}
        {[...Array(8)].map((_, i) => (
          <TextField 
            key={i + 1}
            fullWidth label={`${i + 1}교시 수업 내용`} sx={{ mb: 1.5 }}
            value={dailyLogs[i + 1] || ""}
            onChange={(e) => handleLogChange(i + 1, e.target.value)}
          />
        ))}

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