/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useRef, useState } from "react";
import api from "../../../api/axiosInstance";
import RandomSpinner from "../../../components/RandomSpinner";

interface LmsDailyLogModalProps {
  open: boolean;
  onClose: () => void;
  curSeq: number;
}

const LmsDailyLogModal = ({ open, onClose, curSeq }: LmsDailyLogModalProps) => {
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [dailyLogs, setDailyLogs] = useState<Record<number, any>>({});
//   const [attendance, setAttendance] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false); // 데이터 준비 상태
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 데이터 로드 로직
  useEffect(() => {
    console.log("useEffect 실행됨 - open:", open, "curSeq:", curSeq, "logDate:", logDate);
    if (open) {
      setIsReady(false); // 모달이 열릴 때마다 로딩 상태 초기화
      if (fileInputRef.current) fileInputRef.current.value = "";

      // 모든 필요한 데이터를 병렬로 로드
      Promise.all([
        api.get(`/api/curriculum/subjects/${curSeq}`),
        api.get(`/api/daily-log/curriculum/${curSeq}`, { params: { logDate } }),
        // api.get(`/api/attendance/${curSeq}/${logDate}`)
      ])
      .then(([subRes, logRes]) => {
        setSubjects(subRes.data);
        
        const logMap = (logRes.data || []).reduce((acc: any, cur: any) => {
            console.log(`교시 ${cur.period} 매핑:`, cur); // 데이터가 정말 들어오는지 확인!
            return { ...acc, [cur.period]: cur };
        }, {});
        setDailyLogs(logMap);
        
        // setAttendance(attRes.data || []);
        setIsReady(true); // 데이터 로드 완료 후 렌더링 허용
      })
      .catch((err) => {
        console.error("데이터 로드 실패:", err);
        setIsReady(true); // 에러가 나도 일단 렌더링은 허용
      });
    }
  }, [open, curSeq, logDate]);

  const handleLogChange = (period: number, field: string, value: any) => {
    setDailyLogs(prev => ({
      ...prev,
      [period]: { ...prev[period], [field]: value, period }
    }));
  };

  const handleSave = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const regId = userInfo.accId;

    const logsPayload = Object.values(dailyLogs)
        .filter(log => log.subSeq && log.content)
        .map(log => ({ ...log, logDate: logDate, regId: regId, status: "A" }));

    if (logsPayload.length === 0) return alert("저장할 내용이 없습니다.");

    const formData = new FormData();
    formData.append("logs", new Blob([JSON.stringify(logsPayload)], { type: 'application/json' }));
    
    const file = fileInputRef.current?.files?.[0];
    if (file) formData.append("attachFile", file);

    try {
        await api.post("/api/daily-log/save", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
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
      <DialogContent sx={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: isReady ? 'start' : 'center', alignItems: isReady ? 'stretch' : 'center' }}>
        {!isReady ? (
          <RandomSpinner /> // 로딩 중일 때 표시
        ) : (
          <>
            <Grid container spacing={2} sx={{ mb: 3, mt: 2 }}>
              <Grid size={{ xs: 12 }}>
                <TextField type="date" fullWidth label="일자 선택" value={logDate} onChange={(e) => setLogDate(e.target.value)} />
              </Grid>
            </Grid>

            {[...Array(8)].map((_, i) => (
              <Box key={i + 1} sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                <TextField select label={`${i + 1}교시 과목`} sx={{ width: '30%' }} value={dailyLogs[i + 1]?.subSeq || ""} onChange={(e) => handleLogChange(i + 1, 'subSeq', e.target.value)}>
                  {subjects.map((sub) => <MenuItem key={sub.subSeq} value={sub.subSeq}>{sub.subName}</MenuItem>)}
                </TextField>
                <TextField fullWidth label={`${i + 1}교시 수업 내용`} value={dailyLogs[i + 1]?.content || ""} onChange={(e) => handleLogChange(i + 1, 'content', e.target.value)} />
              </Box>
            ))}

            <Box sx={{ my: 2 }}>
              <Button variant="outlined" component="label" sx={{ mr: 2 }}>
                파일 첨부<input type="file" hidden ref={fileInputRef} />
              </Button>
              <Button variant="contained" onClick={handleSave}>저장하기</Button>
            </Box>

            {/* <Table size="small">
              <TableHead><TableRow><TableCell>학생명</TableCell><TableCell>상태</TableCell><TableCell>사유</TableCell></TableRow></TableHead>
              <TableBody>
                {attendance.map((row) => (
                  <TableRow key={row.attendanceSeq}>
                    <TableCell>{row.accountName}</TableCell><TableCell>{row.status}</TableCell><TableCell>{row.remark}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table> */}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LmsDailyLogModal;