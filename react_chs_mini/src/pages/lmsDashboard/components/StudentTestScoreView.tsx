import { Save as SaveIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

// 인터페이스 정의
interface TestScoreVO {
  testSeq: number;
  subName: string;
  testName: string;
  totalScore: number | null;
  resultStatus: string; // 'A': 채점완료, 'D': 삭제 등
  isChanged?: boolean;  // 프론트엔드 로컬 상태: 변경 여부 추적
}

interface StudentTestScoreViewProps {
  accountSeq: number;           // 학생 번호
  curSeq: string | undefined;   // 교육과정 번호
}

const StudentTestScoreView = ({ accountSeq, curSeq }: StudentTestScoreViewProps) => {
  const [scores, setScores] = useState<TestScoreVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSeq, setSavingSeq] = useState<number | null>(null);

  /**
   * 1. 현재 로그인한 사용자 ID 추출 (localStorage)
   */
  const getCurrentUserId = (): string => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        return userInfo.accId || 'system';
      } catch (err) {
        console.error("사용자 정보 파싱 에러:", err);
      }
    }
    return 'system';
  };

  /**
   * 2. 성적 목록 조회 API 호출
   */
  const fetchScores = useCallback(async () => {
    if (!curSeq) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/test/score/student/${accountSeq}?curSeq=${curSeq}`);
      // 서버 데이터를 받을 때 변경 여부(isChanged)를 false로 초기화
      const dataWithState = res.data.map((item: TestScoreVO) => ({
        ...item,
        isChanged: false,
      }));
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

  /**
   * 3. 점수 입력 변경 핸들러
   */
  const handleScoreChange = (testSeq: number, value: string) => {
    const numericValue = value === '' ? null : Number(value);
    
    // 0~100점 범위 제한
    if (numericValue !== null && (numericValue < 0 || numericValue > 100)) return;

    setScores((prev) =>
      prev.map((item) =>
        item.testSeq === testSeq 
          ? { ...item, totalScore: numericValue, isChanged: true } 
          : item
      )
    );
  };

  /**
   * 4. 점수 저장 API 호출 (Upsert)
   */
  const handleSaveScore = async (testSeq: number, score: number | null) => {
    const userId = getCurrentUserId();
    setSavingSeq(testSeq);
    
    try {
      await axios.post(`/api/test/score/save`, {
        accountSeq,
        testSeq,
        totalScore: score,
        resultStatus: 'A', // 채점 완료 상태로 저장
        regId: userId,     // 최초 등록 시 사용
        updateId: userId,  // 수정 시 사용
      });
      
      alert("성적이 성공적으로 반영되었습니다.");
      await fetchScores(); // 최신 데이터로 리스트 갱신
    } catch (err) {
      console.error("점수 저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSavingSeq(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '1.4rem', fontWeight: 900 }}>시험 성적 및 평가 관리</Typography>
        <Typography variant="body2" color="text.secondary">
          * 점수 수정 후 <strong>저장</strong> 버튼을 클릭하세요. (0~100점 입력 가능)
        </Typography>
      </Stack>

      <Table sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800, py: 2 }}>과목명 / 시험명</TableCell>
            <TableCell sx={{ fontWeight: 800 }} align="center">상태</TableCell>
            <TableCell sx={{ fontWeight: 800 }} align="center" width="160">점수 입력</TableCell>
            <TableCell sx={{ fontWeight: 800 }} align="center" width="120">작업</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                등록된 시험 정보가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            scores.map((item) => (
              <TableRow key={item.testSeq} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    {item.subName}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {item.testName}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={item.resultStatus === 'A' ? "채점완료" : "미응시"} 
                    variant={item.resultStatus === 'A' ? "filled" : "outlined"}
                    color={item.resultStatus === 'A' ? "success" : "default"}
                    size="small"
                    sx={{ fontWeight: 700, minWidth: '75px' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    value={item.totalScore ?? ''}
                    onChange={(e) => handleScoreChange(item.testSeq, e.target.value)}
                    // 엔터키 저장을 위한 이벤트 핸들러
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveScore(item.testSeq, item.totalScore);
                    }}
                    // 마우스 휠로 점수가 변하는 것 방지
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    slotProps={{ 
                      htmlInput: { 
                        style: { textAlign: 'center', fontWeight: 800 },
                        min: 0, 
                        max: 100 
                      } 
                    }}
                    placeholder="-"
                    sx={{ 
                      width: 90,
                      '& .MuiOutlinedInput-root': {
                        // 변경된 행은 배경색을 연하게 강조
                        bgcolor: item.isChanged ? '#fff7ed' : 'transparent',
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
                    // 저장 중이거나, 변경사항이 없는 '채점완료' 상태면 비활성화
                    disabled={savingSeq !== null || (!item.isChanged && item.resultStatus === 'A')}
                    sx={{ borderRadius: 2, fontWeight: 700, minWidth: '85px' }}
                  >
                    {item.isChanged ? '저장' : (item.resultStatus === 'A' ? '저장됨' : '저장')}
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