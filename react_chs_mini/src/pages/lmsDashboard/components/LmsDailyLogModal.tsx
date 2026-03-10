/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogTitle, MenuItem, TextField, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import Grid from "@mui/material/Grid"; 
import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";

interface LmsDailyLogModalProps {
  open: boolean;
  onClose: () => void;
  curSeq: number;
}

const LmsDailyLogModal = ({ open, onClose, curSeq }: LmsDailyLogModalProps) => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSub, setSelectedSub] = useState<string>("");
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dailyLogs, setDailyLogs] = useState<Record<number, string>>({});
  const [attendance, setAttendance] = useState<any[]>([]);

  // 1. 모달이 열릴 때 해당 커리큘럼의 과목 목록 조회
  useEffect(() => {
    if (open) {
      api.get(`/api/curriculum/subjects/${curSeq}`).then(res => {
        setSubjects(res.data);
        if (res.data.length > 0) {
          setSelectedSub(res.data[0].subSeq.toString()); // 첫 번째 과목 자동 선택
        }
      });
    }
  }, [open, curSeq]);

  // 2. 과목이나 날짜가 변경될 때 일지 및 출석 데이터 조회
  useEffect(() => {
    if (selectedSub && logDate) {
      // 훈련일지 조회 (subSeq, logDate 기준)
      api.get(`/api/daily-log/${selectedSub}`, { params: { logDate } })
         .then(res => {
           const logs = res.data.reduce((acc: any, cur: any) => ({ ...acc, [cur.period]: cur.content }), {});
           setDailyLogs(logs);
         })
         .catch(err => console.error("일지 조회 실패", err));
      
      // 출석 데이터 조회 (curSeq, logDate 기준)
      api.get(`/api/attendance/${curSeq}/${logDate}`)
         .then(res => setAttendance(res.data))
         .catch(err => console.error("출석 조회 실패", err));
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