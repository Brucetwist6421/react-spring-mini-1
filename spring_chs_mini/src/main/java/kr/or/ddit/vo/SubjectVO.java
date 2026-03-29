package kr.or.ddit.vo;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class SubjectVO {
    private Integer subSeq;      // 과목 시퀀스 (PK)
    private Integer curSeq;      // 과정 시퀀스 (FK)
    private String subName;      // 과목명
    private LocalDate startDate; // 시작일
    private LocalDate endDate;   // 종료일
    private String status;       // 상태 (예: 진행중, 종료)
    private String regId;        // 등록자 ID
    private LocalDateTime regDate; // 등록일시
    private String updateId;     // 수정자 ID
    private LocalDateTime updateDate; // 수정일시
    private Integer accountSeq;  // 담당 교수 시퀀스
    private String teacherName;

    
}