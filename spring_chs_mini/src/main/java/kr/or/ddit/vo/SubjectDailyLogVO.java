package kr.or.ddit.vo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectDailyLogVO {
    private Integer dailyLogSeq;
    private Integer subSeq;

    private String logDate;

    private Integer period;
    private String content;
    private String status;
    private String regId;
    private String regDate;
    private String updateId;
    private String updateDate;

    private String mainFilePath; // 첨부파일 경로

    // 조인 조회 시 추가 활용 필드
    private String subName;
}