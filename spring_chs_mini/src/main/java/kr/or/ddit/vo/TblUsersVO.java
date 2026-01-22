package kr.or.ddit.vo;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class TblUsersVO {
	private int id;
	private String email;
	private String password;
	private Date createdAt;
	private Date updatedAt;
	private String name;
	private String imgUrl;
	private String accessToken;
	private String enabled;
	
	// 실습 2 시작
	private List<TblUsersAuthVO> tblUsersAuthVOList;
	// 실습 2 끝
	
}
