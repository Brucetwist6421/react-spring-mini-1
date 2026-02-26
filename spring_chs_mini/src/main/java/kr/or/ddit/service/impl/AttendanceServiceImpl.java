package kr.or.ddit.service.impl;

import org.springframework.stereotype.Service;

import kr.or.ddit.mapper.AttendanceMapper;
import kr.or.ddit.service.AttendanceService;
import kr.or.ddit.vo.AttendanceVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendanceMapper attendanceMapper;

    @Override
    public AttendanceVO getStudentAttendanceRate(int accountSeq) {
        // 1. 기초 데이터 조회 (총 수업일수 및 각 상태별 카운트)
        AttendanceVO status = attendanceMapper.selectAttendanceSummary(accountSeq);
        
        if (status != null && status.getTotalWorkingDays() > 0) {
            // 2. 지각, 외출, 조퇴 합산 후 3으로 나눈 몫 계산 (공결 OFFICIAL 제외)
            int specialCaseSum = status.getLateCount() + status.getOutingCount() + status.getEarlyCount();
            int convertedAbsenceFromSpecial = specialCaseSum / 3;
            
            // 3. 총 결석 환산 일수 = 실제 결석 수 + (특이사항 합산 / 3)
            double totalConvertedAbsence = status.getAbsentCount() + convertedAbsenceFromSpecial;
            status.setConvertedAbsenceDays(totalConvertedAbsence);

            // 4. 출석률 계산: ((총수업일 - 환산결석일) / 총수업일) * 100
            double rate = ((status.getTotalWorkingDays() - totalConvertedAbsence) / status.getTotalWorkingDays()) * 100;
            
            // 소수점 둘째자리까지 반올림
            status.setAttendanceRate(Math.max(0, Math.round(rate * 100.0) / 100.0));
        }
        
        return status;
    }
    
}
