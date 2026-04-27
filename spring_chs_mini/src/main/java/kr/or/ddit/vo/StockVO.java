package kr.or.ddit.vo;

import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
public class StockVO {
    private String symbol;          // 종목 코드 (예: 005930)
    private String industry_status; // 산업 현황 메시지 (추가)
    private Map<String, Double> total;   // 전체 데이터 (History + Prediction) (추가)
    private Map<String, Double> history; // 과거 종가 데이터
    private Map<String, PredictionVO> prediction; // AI 예측 데이터

    //기본적 분석 데이터 (PER, PBR 등)를 담을 객체
    private FundamentalVO fundamental;

    private Map<String, Long> volume;      // 날짜별 거래량 데이터
    private Map<String, String> events;    // 날짜별 주요 이벤트

    // 기술적 지표 (rsi, ma20 등)
    private Map<String, Map<String, Double>> indicators;

    // 수급 데이터 (외인/기관)
    private InvestorVO investors;

    @Data
    public static class InvestorVO {
        private List<String> dates;
        private List<Long> foreign;
        private List<Long> institution;
    }

    // 기본적 분석 데이터 클래스
    @Data
    public static class FundamentalVO {
        private Double per; 
        private Double pbr;
        private Double eps;
        private Double div;
    }

    @Data
    public static class PredictionVO {
        private Double value; // 예측값 (yhat)
        private Double lower; // 하한값 (yhat_lower)
        private Double upper; // 상한값 (yhat_upper)
    }
}