package kr.or.ddit.vo;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectDailyLogVO {
    private Integer dailyLogSeq;
    private Integer subSeq;
    private LocalDate logDate;
    private Integer period;
    private String content;
    private String status;
    private String regId;
    private LocalDateTime regDate;
    private String updateId;
    private LocalDateTime updateDate;

    // 조인 조회 시 추가 활용 필드
    private String subName;
}