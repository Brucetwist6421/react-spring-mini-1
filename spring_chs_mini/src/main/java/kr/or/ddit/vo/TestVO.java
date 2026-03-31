package kr.or.ddit.vo;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TestVO {
    private Integer testSeq;
    private Integer subSeq;
    private String testName;
    private Integer duration;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private String regId;
    private LocalDateTime regDate;
    private String updateId;
    private LocalDateTime updateDate;
}