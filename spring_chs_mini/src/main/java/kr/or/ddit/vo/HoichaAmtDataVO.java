package kr.or.ddit.vo;

import lombok.Data;

@Data
public class HoichaAmtDataVO {
	private int id; // P.K
	private double hoicha; //독립변수
	private double amt; //종속변수
}
