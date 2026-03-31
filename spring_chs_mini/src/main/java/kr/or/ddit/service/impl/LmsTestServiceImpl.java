package kr.or.ddit.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.mapper.LmsTestMapper;
import kr.or.ddit.service.LmsTestService;
import kr.or.ddit.vo.TestScoreVO;
import kr.or.ddit.vo.TestVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LmsTestServiceImpl implements LmsTestService {

    private final LmsTestMapper testMapper;

    @Override
    @Transactional
    public void registerTest(TestVO testVO) {
        // 첫 등록 시 상태값 'A' (Active) 설정
        testVO.setStatus("A");
        testMapper.insertTest(testVO);
    }

    @Override
    public TestVO getTestBySubSeq(int subSeq) {
        return testMapper.selectTestBySubSeq(subSeq);
    }

    @Override
    @Transactional
    public int updateTest(TestVO testVO) {
        testVO.setUpdateDate(LocalDateTime.now());
        return testMapper.updateTest(testVO); // Mapper가 반환하는 int(수정된 행의 수)를 그대로 반환
    }

    @Override
    @Transactional
    public int removeTest(int testSeq, String updateId) {
        TestVO testVO = new TestVO();
        testVO.setTestSeq(testSeq);
        testVO.setUpdateId(updateId);
        testVO.setStatus("D"); // 삭제 상태값 설정
        testVO.setUpdateDate(LocalDateTime.now());
        
        return testMapper.updateTestStatus(testVO);
    }

    @Override
    public List<TestScoreVO> getTestScoresByStudent(int accountSeq, int curSeq) {
        return testMapper.selectTestScoresByStudent(accountSeq, curSeq);
    }
    
    @Override
    @Transactional
    public int saveStudentScore(TestScoreVO scoreVO) {
        // 비즈니스 로직: 점수가 0~100 사이인지 검증 등 추가 가능
        if (scoreVO.getTotalScore() != null && (scoreVO.getTotalScore() < 0 || scoreVO.getTotalScore() > 100)) {
            throw new IllegalArgumentException("점수는 0점에서 100점 사이여야 합니다.");
        }
        return testMapper.upsertTestResult(scoreVO);
    }
}