package kr.or.ddit.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import kr.or.ddit.service.StockService;
import kr.or.ddit.vo.StockVO;

@Service
public class StockServiceImpl implements StockService {
    @Override
    public StockVO getStockPrice(String code) {
        //String url = "http://localhost:8000/stock/" + code;
        // [수정] localhost -> python-api (도커 서비스 이름)
        String url = "http://python-api:8000/stock/" + code;
        
        RestTemplate restTemplate = new RestTemplate();
        
        // Python 결과를 StockVO 형태로 매핑하여 가져옴
        return restTemplate.getForObject(url, StockVO.class);
    }
}
