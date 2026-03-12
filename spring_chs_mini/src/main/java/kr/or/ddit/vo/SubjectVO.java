package kr.or.ddit.vo;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class SubjectVO {
    private Integer subSeq;
    private Integer curSeq;
    private Integer accountSeq;
    private String teacherName;
    private String subName;
    private LocalDate startDate;
    private LocalDate endDate;
    
    // 추가된 컬럼들
    private String status;
    private String regId;
    private LocalDateTime regDate;
    private String updateId;
    private LocalDateTime updateDate;
}