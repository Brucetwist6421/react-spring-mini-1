package kr.or.ddit.vo;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectDailyLogVO {
    private Integer dailyLogSeq;
    private Integer subSeq;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate logDate;

    private Integer period;
    private String content;
    private String status;
    private String regId;
    private LocalDateTime regDate;
    private String updateId;
    private LocalDateTime updateDate;

    private String mainFilePath; // 첨부파일 경로

    // 조인 조회 시 추가 활용 필드
    private String subName;
}