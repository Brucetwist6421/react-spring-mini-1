package kr.or.ddit.service.impl;

import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import kr.or.ddit.service.StockService;
import kr.or.ddit.vo.StockVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StockServiceImpl implements StockService {
    @Override
    public StockVO getStockPrice(String code, String period, int predictDays) {
        // 1. 한글 종목명이 들어올 경우를 대비해 code 부분만 UTF-8로 인코딩합니다.
        String encodedCode = UriUtils.encode(code, StandardCharsets.UTF_8);

        // 2. 인코딩된 encodedCode를 사용하여 URL 생성
        String url = String.format("http://python-api:8000/stock/%s?period=%s&predict_days=%d", 
                                        encodedCode, period, predictDays);
        
        log.info("FastAPI 요청 URL: {}", url);
        
        RestTemplate restTemplate = new RestTemplate();
        
        try {
            return restTemplate.getForObject(url, StockVO.class);
        } catch (Exception e) {
            log.error("FastAPI 호출 실패 (종목: {}): {}", code, e.getMessage());
            throw new RuntimeException("AI 서버로부터 데이터를 가져오지 못했습니다. 종목명 또는 코드를 확인해주세요.");
        }
    }
}
