package kr.or.ddit.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import kr.or.ddit.mapper.AttendanceMapper;
import kr.or.ddit.service.AttendanceService;
import kr.or.ddit.service.FileService;
import kr.or.ddit.vo.AttendanceVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendanceMapper attendanceMapper;
    private final FileService fileService; // 공통 파일 업로드 서비스 의존성 주입

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

    @Override
    @Transactional
    public void insertAttendance(List<AttendanceVO> attendanceList, MultipartHttpServletRequest request) {
        try {
            Map<String, MultipartFile> fileMap = request.getFileMap();

            for (int i = 0; i < attendanceList.size(); i++) {
                AttendanceVO att = attendanceList.get(i);
                
                // 키 생성 규칙: file_카테고리명_인덱스 (프론트에서 보낸 키와 일치해야 함)
                String fileKey = "file_" + att.getStatus() + "_" + i;
                MultipartFile file = fileMap.get(fileKey);

                if (file != null && !file.isEmpty()) {
                    // 케이스 1: 새 파일 업로드
                    String filePath = fileService.saveMainImage(file);
                    att.setMainFilePath(filePath);
                } 
                else if (att.isFileDeleted()) {
                    // 케이스 2: 기존 파일 삭제 처리
                    att.setMainFilePath(null);
                }
                // 케이스 3: 아무것도 하지 않으면 기존 DB 경로 유지 (자동)

                attendanceMapper.upsertAttendance(att);
            }
        } catch (Exception e) {
            throw new RuntimeException("출석 정보 저장 중 오류 발생", e);
        }
    }

    @Override
    public List<AttendanceVO> getDailyAttendanceList(int curSeq, String attendanceDate) {
        return attendanceMapper.getDailyAttendanceList(curSeq, attendanceDate);
    }
    
    @Override
    public AttendanceVO getTodayAttendanceStats(String date) {
        String searchDate = (date == null || date.isEmpty()) ? LocalDate.now().toString() : date;
        List<AttendanceVO> allAttendance = attendanceMapper.selectDailyAttendanceWithAccount(searchDate);

        AttendanceVO stats = new AttendanceVO();
        stats.setTotalStudents(allAttendance.size());

        // 1. "정상" 대신 DB 값인 "PRESENT" (또는 해당 코드) 사용
        // 만약 Mapper에서 COALESCE로 '결석'을 넣었다면 그 부분도 'ABSENT'로 수정 필요
        stats.setPresentList(filterByStatus(allAttendance, "PRESENT")); 
        stats.setPresentCount(stats.getPresentList().size());

        // 2. "지각" -> "LATE"
        stats.setLateList(filterByStatus(allAttendance, "LATE"));
        stats.setLateCount(stats.getLateList().size());

        // 3. "결석" -> "ABSENT"
        stats.setAbsentList(filterByStatus(allAttendance, "ABSENT"));
        stats.setAbsentCount(stats.getAbsentList().size());

        // 4. "조퇴" -> "EARLY"
        stats.setEarlyList(filterByStatus(allAttendance, "EARLY"));
        stats.setEarlyCount(stats.getEarlyList().size());

        // 5. "외출" -> "OUTING"
        stats.setOutingList(filterByStatus(allAttendance, "OUTING"));
        stats.setOutingCount(stats.getOutingList().size());

        // 6. "공결" -> "OFFICIAL"
        stats.setOfficialList(filterByStatus(allAttendance, "OFFICIAL"));
        stats.setOfficialCount(stats.getOfficialList().size());

        return stats;
    }

    // 중복 로직 방지를 위한 헬퍼 메서드
    private List<AttendanceVO> filterByStatus(List<AttendanceVO> list, String statusName) {
        return list.stream()
                .filter(vo -> statusName.equals(vo.getStatus()))
                .collect(Collectors.toList());
    }
}
