package kr.or.ddit.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.mapper.LmsTestMapper;
import kr.or.ddit.service.LmsTestService;
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
}