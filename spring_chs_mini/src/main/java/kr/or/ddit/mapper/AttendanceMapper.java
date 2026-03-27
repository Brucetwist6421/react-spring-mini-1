package kr.or.ddit.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.vo.AttendanceVO;

@Mapper
public interface AttendanceMapper {
    // 특정 학생의 기준일 대비 출석 요약 정보 조회
    AttendanceVO selectAttendanceSummary(@Param("accountSeq") int accountSeq);

    // 상세 특이사항(Remark가 있거나 지각/결석 등) 목록 조회
    List<Map<String, Object>> selectAttendanceDetailList(@Param("accountSeq") int accountSeq);

    int upsertAttendance(AttendanceVO attendanceVO);

    List<AttendanceVO> getDailyAttendanceList(
        @Param("curSeq") int curSeq, 
        @Param("attendanceDate") String attendanceDate
    );

    List<AttendanceVO> selectDailyAttendanceWithAccount(@Param("date") String date);

    /**
     * 출석 테이블에서 특정 seq 삭제
     */
    int deleteAttendance(Integer attendanceSeq);
}
