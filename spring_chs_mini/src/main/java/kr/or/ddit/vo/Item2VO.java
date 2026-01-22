package kr.or.ddit.vo;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

//pojo가 약해짐
@Data
public class Item2VO {
	private int itemId;
	private String itemName;
	private int price;
	private String description;
	private String pictureUrl;
	private MultipartFile uploadFile;
	// 실습 2 시작
	private String pictureUrl2;
	private MultipartFile uploadFile2;
	// 실습 2 끝
	private int rn;
	
	// 실습 3 시작
	private MultipartFile[] uploadFiles;
	//FINAL_TEST : FILE_GROUP = 1 : 1
	private FileGroupVO fileGroupVO;
	private long fileGroupNo;
	// 실습 3 끝
	
	// 실습 4 시작
	private int parentItemId; //itemId가 부모글
	private int lvl;
	private String parentName;
	private List<Item2VO> item2VOList;
	// 실습 4 끝
	
	// 실습 5 시작
	private String writer;
	// 실습 5 끝
}
