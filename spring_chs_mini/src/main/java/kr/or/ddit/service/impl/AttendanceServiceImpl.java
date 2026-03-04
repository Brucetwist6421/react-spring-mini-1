package kr.or.ddit.service.impl;

import java.util.List;
import java.util.Map;

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
        // 1. 기초 데이터 조회 (SQL에서 accountStatus, referenceDate, totalWorkingDays 등을 가져옴)
        AttendanceVO status = attendanceMapper.selectAttendanceSummary(accountSeq);
        
        // 데이터가 없거나, 총 수업 가능 일수가 0인 경우(과정 시작 전 등) 처리
        if (status == null) {
            return null; 
        }

        if (status.getTotalWorkingDays() > 0) {
            // 2. 지각, 외출, 조퇴 합산 후 3으로 나눈 몫 계산
            // 정수 나눗셈이므로 몫(3회당 1일)만 정확히 남습니다.
            int specialCaseSum = status.getLateCount() + status.getOutingCount() + status.getEarlyCount();
            int convertedAbsenceFromSpecial = specialCaseSum / 3;
            
            // 3. 총 결석 환산 일 수 계산 (실제 결석 + 특이사항 환산분)
            double totalConvertedAbsence = (double) status.getAbsentCount() + convertedAbsenceFromSpecial;
            status.setConvertedAbsenceDays(totalConvertedAbsence);

            // 4. 출석률 계산
            // (총수업일 - 환산결석일)이 음수가 되지 않도록 보호 로직 추가
            double effectiveWorkingDays = Math.max(0, (double) status.getTotalWorkingDays() - totalConvertedAbsence);
            double rate = (effectiveWorkingDays / (double) status.getTotalWorkingDays()) * 100.0;
            
            // 5. 소수점 둘째자리까지 반올림 (예: 98.3333 -> 98.33)
            status.setAttendanceRate(Math.round(rate * 100.0) / 100.0);

            
        } else {
            // 수업 일수가 0인 경우 (과정 시작 당일 주말 등) 출석률 100% 혹은 0% 설정
            status.setAttendanceRate(100.0);
        }

        // 상세 특이사항 목록 조회 후 VO에 주입
        List<Map<String, Object>> attList = attendanceMapper.selectAttendanceDetailList(accountSeq);
        status.setAttList(attList);
        
        return status;
    }
    
}
