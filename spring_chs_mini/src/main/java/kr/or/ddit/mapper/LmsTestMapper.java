package kr.or.ddit.mapper;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.vo.TestVO;

@Mapper
public interface LmsTestMapper {
    int insertTest(TestVO testVO);
    TestVO selectTestBySubSeq(int subSeq);
    int updateTest(TestVO testVO); 
    int updateTestStatus(TestVO testVO);
}
