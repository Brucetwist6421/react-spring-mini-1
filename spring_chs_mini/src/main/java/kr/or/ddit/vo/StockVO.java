package kr.or.ddit.vo;

import java.util.Map;
import lombok.Data;

@Data
public class StockVO {
    private String symbol;        // 종목 코드 (예: 005930)
    private Map<String, Double> history; // 날짜(String)와 종가(Double) 데이터
    private Map<String, Double> prediction; // AI 예측 데이터

    // 추가된 필드
    private Map<String, Long> volume;      // 날짜별 거래량 데이터
    private Map<String, String> events;    // 날짜별 주요 이벤트/키워드 데이터
}