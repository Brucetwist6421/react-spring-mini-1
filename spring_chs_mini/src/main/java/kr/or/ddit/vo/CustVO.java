package kr.or.ddit.vo;

import java.util.List;

import lombok.Data;

@Data
public class CustVO {
	private int custNum;
	private String custName;
	private String custAddr;
	private String custPhone;

	// 실습 1 진행
	// 직원(기본엔티티) : 자동차수리(액션엔티티) = 1 : N
	private List<ReprSvcVO> ReprSvcVOList;
	
	// 고객 : 자동차 = 1 : N
	private List<CarVO> carVOList;
	// 실습 1 끝
}
