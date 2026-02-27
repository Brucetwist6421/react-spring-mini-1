package kr.or.ddit.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceVO {
    private int accountSeq;
    private String accountName;
    private String curName;
    private String startDate;
    private String endDate;

    private String accountStatus;  // 학생 상태 (ENROLLED, DROPOUT, EARLYOUT 등)
    private String referenceDate;  // 출석률 계산 기준일 (오늘 날짜 혹은 dropout_date)

    private int totalWorkingDays;  // 기준일까지의 총 수업 일수 (주말 제외)
    private int absentCount;       // 결석 횟수
    private int lateCount;         // 지각 횟수
    private int outingCount;       // 외출 횟수
    private int earlyCount;        // 조퇴 횟수
    
    private double convertedAbsenceDays; // 환산된 총 결석 일수 (3회당 1일 포함)
    private double attendanceRate;       // 최종 출석률 (%)
}
