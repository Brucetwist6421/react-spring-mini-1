package kr.or.ddit.service.impl;

import java.net.URI;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import kr.or.ddit.service.StockService;
import kr.or.ddit.vo.StockVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StockServiceImpl implements StockService {

    @Override
    public StockVO getStockPrice(String code, String period, int predictDays) {
        // 1. fromHttpUrl 대신 fromUriString을 사용합니다. (Spring 6.2 권장)
        URI uri = UriComponentsBuilder
                .fromUriString("http://python-api:8000") // 베이스 URL
                .path("/stock/{code}")                  // 경로 분리
                .queryParam("period", period)
                .queryParam("predict_days", predictDays)
                .buildAndExpand(code)                   // 변수 치환 및 인코딩
                .toUri();

        log.info("최종 FastAPI 요청 URI: {}", uri);
        
        RestTemplate restTemplate = new RestTemplate();
        
        try {
            // URI 객체를 전달하여 이중 인코딩 방지
            return restTemplate.getForObject(uri, StockVO.class);
        } catch (Exception e) {
            log.error("FastAPI 호출 실패 (종목: {}): {}", code, e.getMessage());
            throw new RuntimeException("AI 서버로부터 데이터를 가져오지 못했습니다.");
        }
    }
}