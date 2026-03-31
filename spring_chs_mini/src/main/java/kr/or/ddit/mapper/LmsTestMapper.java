package kr.or.ddit.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.vo.TestScoreVO;
import kr.or.ddit.vo.TestVO;

@Mapper
public interface LmsTestMapper {
    int insertTest(TestVO testVO);
    TestVO selectTestBySubSeq(int subSeq);
    int updateTest(TestVO testVO); 
    int updateTestStatus(TestVO testVO);
    /**
     * 학생별 시험 목록 및 성적 조회 (Left Join 사용)
     */
    List<TestScoreVO> selectTestScoresByStudent(
        @Param("accountSeq") int accountSeq, 
        @Param("curSeq") int curSeq
    );
}
