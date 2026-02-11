package kr.or.ddit.vo;

import java.util.List;

import lombok.Data;

@Data
public class LmsDashboardVO {
    private String className;
    private int term;
    private String period;
    private int totalEnrolled;
    private int activeAccounts;
    private int dropoutCount;
    private double totalAvgRatio;
    private List<SubjectStatVO> subjects; // JSON 내역 매핑

    @Data
    public static class SubjectStatVO {
        private String subjectName;
        private int submittedCount;
        private double ratio;
    }
}
