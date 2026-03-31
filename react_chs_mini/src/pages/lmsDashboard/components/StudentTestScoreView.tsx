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
  totalScore: number | null;
  resultStatus: string;
  isChanged?: boolean; // 변경 여부 추적을 위한 로컬 필드 추가
}

const StudentTestScoreView = ({ accountSeq, curSeq }: { accountSeq: number; curSeq: string | undefined }) => {
  const [scores, setScores] = useState<TestScoreVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSeq, setSavingSeq] = useState<number | null>(null);

  const fetchScores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/test/score/student/${accountSeq}?curSeq=${curSeq}`);
      // 서버 데이터를 받을 때 isChanged: false 초기화
      const dataWithState = res.data.map((item: TestScoreVO) => ({ ...item, isChanged: false }));
      setScores(dataWithState);
    } catch (err) {
      console.error("성적 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [accountSeq, curSeq]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const handleScoreChange = (testSeq: number, value: string) => {
    // 숫자 범위 검증
    const numericValue = value === '' ? null : Number(value);
    if (numericValue !== null && (numericValue < 0 || numericValue > 100)) return;

    setScores(prev => prev.map(item => 
      item.testSeq === testSeq ? { ...item, totalScore: numericValue, isChanged: true } : item
    ));
  };

  const handleSaveScore = async (testSeq: number, score: number | null) => {
    setSavingSeq(testSeq);
    try {
      await axios.post(`/api/test/score/save`, {
        accountSeq,
        testSeq,
        totalScore: score,
        resultStatus: 'A' 
      });
      // 성공 시 전체 fetch 대신 해당 항목만 상태 업데이트하여 깜빡임 방지 가능
      // 여기서는 확실한 데이터 동기화를 위해 fetchScores 호출
      fetchScores();
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
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '1.4rem', fontWeight: 900 }}>시험 성적 및 평가 관리</Typography>
        <Typography variant="body2" color="text.secondary">
          * 점수 수정 후 <strong>저장</strong> 버튼을 클릭하세요. (0~100점)
        </Typography>
      </Stack>

      <Table sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800, py: 2 }}>과목명</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>시험명</TableCell>
            <TableCell sx={{ fontWeight: 800 }} align="center">상태</TableCell>
            <TableCell sx={{ fontWeight: 800 }} align="center" width="160">점수 입력</TableCell>
            <TableCell sx={{ fontWeight: 800 }} align="center" width="120">작업</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                등록된 시험 정보가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            scores.map((item) => (
              <TableRow key={item.testSeq} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ fontWeight: 600, color: 'primary.dark' }}>{item.subName}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{item.testName}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={item.resultStatus === 'A' ? "채점완료" : "미응시"} 
                    variant={item.resultStatus === 'A' ? "filled" : "outlined"}
                    color={item.resultStatus === 'A' ? "success" : "default"}
                    size="small"
                    sx={{ fontWeight: 700, minWidth: '70px' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    value={item.totalScore ?? ''}
                    onChange={(e) => handleScoreChange(item.testSeq, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveScore(item.testSeq, item.totalScore)}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()} // 휠 입력 방지
                    slotProps={{ 
                        htmlInput: { 
                            style: { textAlign: 'center', fontWeight: 800 },
                            min: 0, max: 100 
                        } 
                    }}
                    placeholder="-"
                    sx={{ 
                      width: 90,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: item.isChanged ? '#fff7ed' : 'transparent', // 변경 시 배경색 강조
                        transition: 'background-color 0.3s'
                      }
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant={item.isChanged ? "contained" : "outlined"}
                    size="small"
                    color={item.isChanged ? "warning" : "primary"}
                    startIcon={savingSeq === item.testSeq ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                    onClick={() => handleSaveScore(item.testSeq, item.totalScore)}
                    disabled={savingSeq !== null || (!item.isChanged && item.resultStatus === 'A')}
                    sx={{ borderRadius: 2, fontWeight: 700, minWidth: '80px' }}
                  >
                    {item.resultStatus === 'A' && !item.isChanged ? '저장됨' : '저장'}
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