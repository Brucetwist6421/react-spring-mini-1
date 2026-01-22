package kr.or.ddit.vo;

import lombok.Data;

@Data
public class FormVO {
	private String id;
	private String passwd;
	private String name;
	private String phone1;
	private String phone2;
	private String phone3;
	private String gender;
	private String[] hobby;
	private String city;
	private String[] food;
	// 실습 2 시작
	private String comment;
	// 실습 2 끝
}
