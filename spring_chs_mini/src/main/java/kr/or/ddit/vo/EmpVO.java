package kr.or.ddit.vo;

import java.util.List;

import lombok.Data;

@Data
public class EmpVO {
	private int empNum;
	private String empName;
	private String empAddr;
	private String empPhone;
	private int sal;
	
	// 실습 1 진행
	//직원(기본엔티티) : 자동차수리(액션엔티티) = 1 : N
	private List<ReprSvcVO> ReprSvcVOList;
	// 실습 1 끝
}
