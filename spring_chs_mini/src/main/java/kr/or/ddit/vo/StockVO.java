package kr.or.ddit.vo;

import java.util.Map;
import lombok.Data;

@Data
public class StockVO {
    private String symbol;        // 종목 코드 (예: 005930)
    private Map<String, Double> history; // 날짜(String)와 종가(Double) 데이터
    private Map<String, Double> prediction; // AI 예측 데이터
}