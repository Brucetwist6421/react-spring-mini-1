import { Save as SaveIcon } from '@mui/icons-material';
import {
    Box,
    Button, Chip,
    CircularProgress,
    Stack,
    Table, TableBody, TableCell, TableHead,
    TableRow, TextField,
    Typography
} from '@mui/material';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

interface TestScoreVO {
  testSeq: number;
  subName: string;
  testName: string;
  score: number | null;
  status: string; // 'A': 응시전, 'C': 채점완료 등
}

const StudentTestScoreView = ({ accountSeq, curSeq }: { accountSeq: number; curSeq: string | undefined }) => {
  const [scores, setScores] = useState<TestScoreVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSeq, setSavingSeq] = useState<number | null>(null);

  // 성적 목록 조회
  const fetchScores = useCallback(async () => {
    setLoading(true);
    try {
      // API 설계 예시: 해당 학생의 과정 내 모든 시험 및 현재 점수 조회
      const res = await axios.get(`/api/test/score/student/${accountSeq}?curSeq=${curSeq}`);
      setScores(res.data);
    } catch (err) {
      console.error("성적 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [accountSeq, curSeq]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  // 점수 로컬 상태 변경
  const handleScoreChange = (testSeq: number, value: string) => {
    const numericValue = value === '' ? null : Number(value);
    if (numericValue !== null && (numericValue < 0 || numericValue > 100)) return;

    setScores(prev => prev.map(item => 
      item.testSeq === testSeq ? { ...item, score: numericValue } : item
    ));
  };

  // 점수 저장 전송
  const handleSaveScore = async (testSeq: number, score: number | null) => {
    setSavingSeq(testSeq);
    try {
      await axios.post(`/api/test/score/save`, {
        accountSeq,
        testSeq,
        score
      });
      alert("점수가 반영되었습니다.");
      fetchScores(); // 최신 상태 갱신
    } catch (err) {
        console.error("점수 저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSavingSeq(null);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '1.4rem', fontWeight: 900 }}>시험 성적 및 평가 관리</Typography>
        <Typography variant="body2" color="text.secondary">* 0~100점 사이로 입력 가능합니다.</Typography>
      </Stack>

      <Table sx={{ border: '1px solid #e2e8f0' }}>
        <TableHead sx={{ bgcolor: '#f1f5f9' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800 }}>과목명</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>시험명</TableCell>
            <TableCell sx={{ fontWeight: 800 }} align="center">상태</TableCell>
            <TableCell sx={{ fontWeight: 800 }} align="center" width="200">점수 입력</TableCell>
            <TableCell sx={{ fontWeight: 800 }} align="center">작업</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>등록된 시험 정보가 없습니다.</TableCell>
            </TableRow>
          ) : (
            scores.map((item) => (
              <TableRow key={item.testSeq} hover>
                <TableCell sx={{ fontWeight: 700 }}>{item.subName}</TableCell>
                <TableCell>{item.testName}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={item.score !== null ? "채점완료" : "미응시/대기"} 
                    color={item.score !== null ? "success" : "default"}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    value={item.score ?? ''}
                    onChange={(e) => handleScoreChange(item.testSeq, e.target.value)}
                    slotProps={{ htmlInput: { style: { textAlign: 'center', fontWeight: 800 } } }}
                    placeholder="-"
                    sx={{ width: 80 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={savingSeq === item.testSeq ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                    onClick={() => handleSaveScore(item.testSeq, item.score)}
                    disabled={savingSeq !== null}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                  >
                    저장
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default StudentTestScoreView;