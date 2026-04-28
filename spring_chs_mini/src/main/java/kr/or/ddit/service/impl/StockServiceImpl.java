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
        // 1. URI 생성 (동일)
        URI uri = UriComponentsBuilder
                .fromUriString("http://python-api:8000")
                .path("/stock/{code}")
                .queryParam("period", period)
                .queryParam("predict_days", predictDays)
                .buildAndExpand(code)
                .toUri();

        // 💡 로그에서 URI가 정확히 어떻게 찍히는지 반드시 확인하세요.
        // 예: http://python-api:8000/stock/%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90?...
        log.info("최종 FastAPI 요청 URI: {}", uri);
        
        RestTemplate restTemplate = new RestTemplate();
        
        try {
            // 2. 💡 응답을 받기 전, 파이썬 서버가 처리하는 시간이 길 수 있으므로 
            // 404나 500 에러인지, 아니면 아예 데이터 매핑 오류인지 확인하기 위해 ResponseEntity를 사용합니다.
            ResponseEntity<StockVO> response = restTemplate.getForEntity(uri, StockVO.class);
            
            log.info("FastAPI 응답 상태 코드: {}", response.getStatusCode());
            return response.getBody();
            
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            // 4xx 에러 (요청 잘못됨)
            log.error("FastAPI 클라이언트 에러: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("AI 서버 요청이 잘못되었습니다: " + e.getMessage());
        } catch (org.springframework.web.client.HttpServerErrorException e) {
            // 5xx 에러 (파이썬 서버 내부 오류)
            log.error("FastAPI 서버 에러: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("AI 서버 내부 오류가 발생했습니다.");
        } catch (Exception e) {
            // 💡 중요: 상세 스택트레이스를 찍어서 진짜 원인을 파악합니다.
            log.error("FastAPI 호출 중 예외 발생!", e); 
            throw new RuntimeException("AI 서버 연결 실패: " + e.getMessage());
        }
    }
}