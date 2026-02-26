package kr.or.ddit.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.vo.AttendanceVO;

@Mapper
public interface AttendanceMapper {
    // 특정 학생의 기준일 대비 출석 요약 정보 조회
    AttendanceVO selectAttendanceSummary(@Param("accountSeq") int accountSeq);
}
