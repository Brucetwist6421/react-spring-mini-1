package kr.or.ddit.vo;

import java.util.List;

import lombok.Data;

@Data
public class LmsDashboardVO {
    private Integer curSeq;
    private String curName;
    private String className;
    private int term;
    private String period;
    private int totalEnrolled;
    private int activeAccounts;
    private int dropoutCount;
    private int earlyoutCount;
    private int graduatedCount;
    private double totalAvgRatio;
    private List<SubjectStatVO> subjects; // JSON 내역 매핑
    private Integer accountSeq; // 담임 교수 시퀀스
    private String teacherName; // 담임 교수명

    @Data
    public static class SubjectStatVO {
        private String subjectName;
        private int submittedCount;
        private double ratio;
    }
}
