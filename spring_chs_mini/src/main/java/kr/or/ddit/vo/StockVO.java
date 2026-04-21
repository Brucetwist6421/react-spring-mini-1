package kr.or.ddit.vo;

import java.util.List;
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

    // 신규 추가: 기술적 지표 (RSI 등)
    // Python에서 "indicators": {"rsi": {...}} 형태로 보내므로 Map 안에 Map 구조가 필요합니다.
    private Map<String, Map<String, Double>> indicators;

    // 신규 추가: 수급 데이터 (외인/기관)
    // Python에서 {"dates": [], "foreign": [], "institution": []} 형태로 보내므로 아래와 같이 정의합니다.
    private InvestorVO investors;

    @Data
    public static class InvestorVO {
        private List<String> dates;
        private List<Long> foreign;
        private List<Long> institution;
    }
}