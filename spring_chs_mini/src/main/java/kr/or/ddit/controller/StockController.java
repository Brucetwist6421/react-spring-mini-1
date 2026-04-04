package kr.or.ddit.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @Operation(summary = "종목 데이터 조회", description = "Python 서버를 통해 해당 종목의 최근 종가 데이터를 가져옵니다.")
    @GetMapping("/{code}")
    public ResponseEntity<StockVO> getStockData(@PathVariable String code) {
        log.info("주식 데이터 요청 수신 - 종목코드: {}", code);
        StockVO result = stockService.getStockPrice(code);
        log.info("주식 데이터 응답 완료 - 종목코드: {}", code);
        return ResponseEntity.ok(result);
    }
}