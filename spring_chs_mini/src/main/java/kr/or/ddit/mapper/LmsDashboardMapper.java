package kr.or.ddit.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.vo.LmsDashboardVO;
import kr.or.ddit.vo.LmsStudentScoreVO;

@Mapper
public interface LmsDashboardMapper {
    List<LmsDashboardVO> selectLmsDashboardStats(@Param("year") String year);

    List<LmsStudentScoreVO> selectStudentScoresByCurriculum(@Param("curSeq") Integer curSeq);
}
