package kr.or.ddit.service;

import kr.or.ddit.vo.StockVO;

public interface StockService {
    StockVO getStockPrice(String code, String period, int predictDays);
}
