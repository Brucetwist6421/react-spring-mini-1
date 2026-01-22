package kr.or.ddit.vo;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

//pojo가 약해짐
@Data
public class ItemVO {
	private int itemId;
	private String itemName;
	private int price;
	private String description;
	private String pictureUrl;
	private String pictureUrl2;
	private MultipartFile uploadFile;
	private int rn;
	
	// 실습 2 시작
	private MultipartFile[] uploadFiles;
	// 실습 2 끝
	
	// 실습 3 시작
	//FINAL_TEST : FILE_GROUP = 1 : 1
	private FileGroupVO fileGroupVO;
	private long fileGroupNo;
	// 실습 3 끝
	
}
