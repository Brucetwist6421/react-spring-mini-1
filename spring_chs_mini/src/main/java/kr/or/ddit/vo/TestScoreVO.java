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
public class TestScoreVO {
    private Integer accountSeq;
    private Integer testSeq;      // 시험 번호
    private Integer subSeq;       // 과목 번호
    private String subName;       // 과목명
    private String testName;      // 시험명
    private Integer duration;     // 제한 시간
    private Integer totalScore;   // 학생의 취득 점수 (tb_test_result)
    private String resultStatus;  // 시험 결과 상태 (채점완료 등)
    private String testStatus;    // 시험 자체 상태 (A: 활성, D: 삭제 등)
    private String status;        // 상태 (A: 활성, D: 삭제 등)

    private String regId;
    private LocalDateTime regDate;
    private String updateId;
    private LocalDateTime updateDate;
}