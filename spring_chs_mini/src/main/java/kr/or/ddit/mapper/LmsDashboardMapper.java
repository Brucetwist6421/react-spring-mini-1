package kr.or.ddit.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.vo.LmsAttendanceStatsVO;
import kr.or.ddit.vo.LmsDashboardVO;
import kr.or.ddit.vo.LmsStudentScoreVO;

@Mapper
public interface LmsDashboardMapper {
    List<LmsDashboardVO> selectLmsDashboardStats(@Param("year") String year, @Param("accountSeq") Integer accountSeq);

    List<LmsStudentScoreVO> selectStudentScoresByCurriculum(@Param("curSeq") Integer curSeq);

    // 오늘 전체 출석 통계 조회 
    LmsAttendanceStatsVO selectDailyAttendanceStats();
}
