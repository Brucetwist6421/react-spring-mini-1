package kr.or.ddit.vo;

import lombok.Data;

@Data
public class LmsAttendanceStatsVO {
    private int totalStudents;      // 오늘 출석해야 할 총 인원
    private int presentCount;       // 정상 입실
    private int lateCount;          // 지각
    private int absentCount;        // 결석
    private int earlyCount;         // 조퇴
    private int outingCount;        // 외출
    private int officialCount;      // 공결
    private int yetToArriveCount;   // 아직 아무 기록 없는 인원 (미입실)
}
