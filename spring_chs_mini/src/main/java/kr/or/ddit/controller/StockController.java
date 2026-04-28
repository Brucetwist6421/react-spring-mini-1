package kr.or.ddit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.ddit.service.StockService;
import kr.or.ddit.vo.StockVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Stock", description = "주식 데이터 및 예측 API")
@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
@Slf4j
public class StockController {

    private final StockService stockService;

    @Operation(summary = "종목 데이터 조회", description = "Python 서버를 통해 해당 종목의 데이터 및 예측치를 가져옵니다.")
    @GetMapping("/{code}")
    public ResponseEntity<StockVO> getStockData(
            @PathVariable String code,
            @RequestParam(defaultValue = "1y") String period,
            @RequestParam(defaultValue = "15") int predict_days) {
        
        // log.info("주식 데이터 요청 수신 - 종목코드: {}, 기간: {}, 예측일: {}", code, period, predict_days);
        
        // 서비스 호출 시 파라미터 전달
        StockVO result = stockService.getStockPrice(code, period, predict_days);
        
        // log.info("FastAPI에서 받은 결과: {}", result); // 여기서 volume이 있는지 확인!
        // log.info("주식 데이터 응답 완료 - 종목코드: {}", code);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "종목 검색 (자동완성)", description = "종목명 또는 코드를 입력받아 유사한 종목 리스트를 반환합니다.")
    @GetMapping("/search/{query}")
    public ResponseEntity<List<Map<String, String>>> searchStocks(@PathVariable String query) {
        log.info("종목 검색 요청 수신 - 검색어: {}", query);
        List<Map<String, String>> results = stockService.searchStocks(query);
        return ResponseEntity.ok(results);
    }
}