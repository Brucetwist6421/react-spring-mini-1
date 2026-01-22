package kr.or.ddit.vo;

import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.util.unsupervisedLearning.ClusterDataPoint;
import lombok.Data;

@Data
public class FinalTestVO {
	private int studentId;
	private String studentName;
	private int koreanScore;
	private int englishScore;
	private int mathScore;
	private int scienceScore;
	private int historyKr;
	private int historyWorld;
	
	private double colx;
	private double coly;
	
	
	private ClusterDataPoint clusterDataPoint;
	
	// 실습 2 시작
	//스프링 파일 객체 타입
	private MultipartFile[] uploadFiles;
	// 실습 2 끝
	
	// 실습 3 시작
	//FINAL_TEST : FILE_GROUP = 1 : 1
	private FileGroupVO fileGroupVO;
	private long fileGroupNo;
	// 실습 3 끝
	
	// 실습 4 시작
	private double tot;
	private double avg;
	// 실습 4 끝
}
