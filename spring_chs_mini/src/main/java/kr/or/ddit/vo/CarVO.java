package kr.or.ddit.vo;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class CarVO {
	private String carNum;
	private String manuft;
	private int mkyr;
	private int dist;
	private int custNum;

	// 실습 1 진행
	// 직원(기본엔티티) : 자동차수리(액션엔티티) = 1 : N
	private List<ReprSvcVO> ReprSvcVOList;
	// 실습 1 끝
	
	// 실습 2 시작
	private MultipartFile[] uploadFiles;
	//FINAL_TEST : FILE_GROUP = 1 : 1
	private FileGroupVO fileGroupVO;
	private long fileGroupNo;
	// 실습 2 끝
}
