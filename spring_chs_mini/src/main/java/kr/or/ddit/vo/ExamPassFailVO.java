package kr.or.ddit.vo;

import lombok.Data;

@Data
public class ExamPassFailVO {
	private int seq;
	private int studyTime;
	private int libInvCnt;
	private String passFail;
}
