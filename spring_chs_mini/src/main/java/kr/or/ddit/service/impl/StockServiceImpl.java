package kr.or.ddit.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import kr.or.ddit.service.StockService;
import kr.or.ddit.vo.StockVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StockServiceImpl implements StockService {
    @Override
    public StockVO getStockPrice(String code, String period, int predictDays) {
        // FastAPI 경로에 맞게 /stock/으로 수정 및 쿼리 파라미터 추가
        String url = String.format("http://python-api:8000/stock/%s?period=%s&predict_days=%d", 
                                    code, period, predictDays);
        
        log.info("FastAPI 요청 URL: {}", url);
        
        RestTemplate restTemplate = new RestTemplate();
        
        try {
            return restTemplate.getForObject(url, StockVO.class);
        } catch (Exception e) {
            log.error("FastAPI 호출 실패: {}", e.getMessage());
            throw new RuntimeException("AI 서버로부터 데이터를 가져오지 못했습니다.");
        }
    }
}
