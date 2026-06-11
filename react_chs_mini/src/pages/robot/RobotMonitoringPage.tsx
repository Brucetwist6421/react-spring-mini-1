import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { robotApi, type RobotLog } from "../../api/robotApi";

const STATUS_OPTIONS = [
  { value: "RUNNING", label: "가동 중 (RUNNING)" },
  { value: "STOPPED", label: "중지됨 (STOPPED)" },
  { value: "MAINTENANCE", label: "정비 중 (MAINTENANCE)" },
  { value: "ERROR", label: "에러 발생 (ERROR)" },
];

export default function RobotMonitoringPage() {
  const [logs, setLogs] = useState<RobotLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // [신규 등록] 폼 입력 상태 관리
  const [robotName, setRobotName] = useState("");
  const [status, setStatus] = useState<RobotLog["status"]>("RUNNING");
  const [command, setCommand] = useState("");

  // [수정 기능] 모달 및 수정 타겟 상태 관리
  const [editOpen, setEditOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<RobotLog | null>(null);
  const [editStatus, setEditStatus] = useState<RobotLog["status"]>("RUNNING");
  const [editCommand, setEditCommand] = useState("");

  // 데이터 로드 (READ)
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await robotApi.getLogs();
      setLogs(data);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 로그 생성 처리 (CREATE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!robotName || !command) return alert("모든 필드를 입력해 주세요.");

    try {
      await robotApi.createLog({ robot_name: robotName, status, command });
      setRobotName("");
      setCommand("");
      await loadData();
    } catch (error) {
      console.error("로그 생성 실패:", error);
      alert("로그 생성 실패");
    }
  };

  // 수정 모달 열기 및 데이터 바인딩
  const handleEditOpen = (log: RobotLog) => {
    setEditingLog(log);
    setEditStatus(log.status);
    setEditCommand(log.command);
    setEditOpen(true);
  };

  // 수정 모달 닫기
  const handleEditClose = () => {
    setEditingLog(null);
    setEditOpen(false);
  };

  // 로그 수정 요청 처리 (UPDATE)
  const handleUpdateSubmit = async () => {
    if (!editingLog || !editingLog.id) return;
    if (!editCommand) return alert("내용을 입력해 주세요.");

    try {
      await robotApi.updateLog(editingLog.id, {
        status: editStatus,
        command: editCommand,
      });
      handleEditClose();
      await loadData(); // 목록 갱신
    } catch (error) {
      console.error("로그 수정 실패:", error);
      alert("수정 실패");
    }
  };

  // 로그 삭제 처리 (DELETE)
  const handleDelete = async (id: number) => {
    if (!window.confirm("해당 정비 로그를 삭제하시겠습니까?")) return;
    try {
      await robotApi.deleteLog(id);
      await loadData();
    } catch (error) {
      console.error("로그 삭제 실패:", error);
      alert("삭제 실패");
    }
  };

  if (loading && logs.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        실시간 로봇 모니터링 - Express.js 연동 컴포넌트
      </Typography>

      <Grid container spacing={3}>
        {/* 왼쪽 영역: 등록 폼 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                오류 및 특이사항 등록
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    label="로봇 일련번호 (Robot Serial Number)"
                    variant="outlined"
                    fullWidth
                    value={robotName}
                    onChange={(e) => setRobotName(e.target.value)}
                    placeholder="예: ROBOT-ALPHA"
                  />
                  <TextField
                    select
                    label="현재 상태 (Status)"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as RobotLog["status"])}
                    fullWidth
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="오류 및 특이사항"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="오류/특이사항 및 정비 일지를 적어주세요."
                  />
                  <Button type="submit" variant="contained" size="large" fullWidth>
                    로그 저장
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 오른쪽 영역: 실시간 연동 로그 리스트 */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            {logs.map((log) => {
              const statusColors = {
                RUNNING: "#2e7d32",
                STOPPED: "#757575",
                MAINTENANCE: "#ed6c02",
                ERROR: "#d32f2f",
              };

              return (
                <Card
                  key={log.id}
                  variant="outlined"
                  sx={{ borderLeft: `6px solid ${statusColors[log.status]}` }}
                >
                  <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                          {log.robot_name}
                        </Typography>
                        <Box
                          sx={{
                            backgroundColor: statusColors[log.status],
                            color: "white",
                            px: 1,
                            py: 0.2,
                            borderRadius: 1,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        >
                          {log.status}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {log.created_at ? new Date(log.created_at).toLocaleString("ko-KR") : ""}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.primary">
                        {log.command}
                      </Typography>
                    </Box>
                    
                    {/* 관리 액션 버튼 모음 */}
                    <Stack direction="row" spacing={1}>
                      <Button color="primary" variant="outlined" size="small" onClick={() => handleEditOpen(log)}>
                        수정
                      </Button>
                      <Button color="error" variant="text" size="small" onClick={() => log.id && handleDelete(log.id)}>
                        삭제
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Grid>
      </Grid>

      {/* ========================================================
          ⚙️ 실무형 정비 로그 수정 모달 팝업 (Dialog)
         ======================================================== */}
      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: "bold" }}>🛠️ 정비 로그 수정 (Edit Log)</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="로봇 일련번호"
              variant="outlined"
              fullWidth
              disabled
              value={editingLog?.robot_name || ""}
              helperText="로봇 고유 식별자는 수정할 수 없습니다."
            />
            <TextField
              select
              label="현재 상태 (Status)"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as RobotLog["status"])}
              fullWidth
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="오류 및 특이사항"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={editCommand}
              onChange={(e) => setEditCommand(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleEditClose} color="inherit">
            취소
          </Button>
          <Button onClick={handleUpdateSubmit} variant="contained" color="primary">
            변경사항 저장
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}