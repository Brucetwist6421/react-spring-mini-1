package kr.or.ddit.vo;

import java.util.List;

import lombok.Data;

@Data
public class LmsStudentScoreVO {
    private Integer accSeq;         // 학생 번호
    private String accountName;     // 학생 이름 (tb_account.account_name)
    private Integer totalScore;     // 학생별 모든 과목 점수 합계
    private Double avgScore;        // 학생별 평균 점수
    private List<SubjectScoreVO> scores; // JSONB 매핑용 (과목명, 점수)

}