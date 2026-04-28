package kr.or.ddit.service.impl;

import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import kr.or.ddit.service.StockService;
import kr.or.ddit.vo.StockVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;

@Slf4j
@Service
public class StockServiceImpl implements StockService {

    // 매번 new RestTemplate() 하기보다 공통 객체를 사용하는 것이 효율적입니다.
    private final RestTemplate restTemplate = new RestTemplate();
    private final String FAST_API_BASE_URL = "http://python-api:8000";

    /**
     * 종목 검색 (자동완성)
     */
    @Override
    public List<Map<String, String>> searchStocks(String query) {
        URI uri = UriComponentsBuilder
                .fromUriString(FAST_API_BASE_URL)
                .path("/stock/search/{query}")
                .buildAndExpand(query)
                .encode()
                .toUri();

        try {
            log.info("FastAPI 검색 요청 URI: {}", uri);
            
            // 💡 ParameterizedTypeReference를 사용하여 제네릭 타입 명시
            ResponseEntity<List<Map<String, String>>> response = restTemplate.exchange(
                uri, 
                HttpMethod.GET, 
                null, 
                new ParameterizedTypeReference<List<Map<String, String>>>() {}
            );
            
            return response.getBody();
        } catch (Exception e) {
            log.error("FastAPI 검색 실패 (검색어: {}): {}", query, e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * 종목 데이터 및 예측 조회
     */
    @Override
    public StockVO getStockPrice(String code, String period, int predictDays) {
        URI uri = UriComponentsBuilder
                .fromUriString(FAST_API_BASE_URL)
                .path("/stock/{code}")
                .queryParam("period", period)
                .queryParam("predict_days", predictDays)
                .buildAndExpand(code)
                .encode()
                .toUri();

        log.info("최종 인코딩된 FastAPI 요청 URI: {}", uri);
        
        try {
            return restTemplate.getForObject(uri, StockVO.class);
        } catch (Exception e) {
            log.error("FastAPI 호출 실패 (종목: {}): {}", code, e.getMessage());
            throw new RuntimeException("AI 서버로부터 데이터를 가져오지 못했습니다.");
        }
    }
}