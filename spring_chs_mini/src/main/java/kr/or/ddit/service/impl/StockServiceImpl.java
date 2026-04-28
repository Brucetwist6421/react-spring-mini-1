package kr.or.ddit.service.impl;

import java.net.URI;

import org.springframework.http.ResponseEntity;
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
        // buildAndExpand() 이후에 반드시 .encode()를 호출해야 합니다.
        URI uri = UriComponentsBuilder
                .fromUriString("http://python-api:8000")
                .path("/stock/{code}")
                .queryParam("period", period)
                .queryParam("predict_days", predictDays)
                .buildAndExpand(code) // 1. 변수 치환
                .encode()             // 2. 중요: 여기서 한글을 %EC.. 형태로 인코딩!
                .toUri();             // 3. URI 객체 생성

        log.info("최종 인코딩된 FastAPI 요청 URI: {}", uri);
        
        RestTemplate restTemplate = new RestTemplate();
        
        try {
            return restTemplate.getForObject(uri, StockVO.class);
        } catch (Exception e) {
            log.error("FastAPI 호출 실패 (종목: {}): {}", code, e.getMessage());
            throw new RuntimeException("AI 서버로부터 데이터를 가져오지 못했습니다.");
        }
    }
}