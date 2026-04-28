package kr.or.ddit.service;

import java.util.List;
import java.util.Map;

import kr.or.ddit.vo.StockVO;

public interface StockService {
    StockVO getStockPrice(String code, String period, int predictDays);

    // 종목 검색어 자동완성 리스트 가져오기
    List<Map<String, String>> searchStocks(String query);
}
