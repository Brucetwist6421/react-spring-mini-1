package kr.or.ddit.service;

import kr.or.ddit.vo.TestVO;

public interface LmsTestService {
    void registerTest(TestVO testVO);
    TestVO getTestBySubSeq(int subSeq);
    int updateTest(TestVO testVO);
}
