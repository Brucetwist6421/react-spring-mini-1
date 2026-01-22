package kr.or.ddit.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.service.ItemService;
import kr.or.ddit.util.logisticRegression.LogisticRegression;
import kr.or.ddit.util.logisticRegression.LogisticRegressionDataPoint;
import kr.or.ddit.vo.FloodInfoVO;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/logistic")
@Slf4j
@RestController
public class LogisticController {

	// 실습 2 시작
	@Autowired
	ItemService itemService;
	
	@Autowired
	LogisticRegression logisticRegression;
	// 실습 2 끝
	
	// 실습 1 시작
	/*
     요청URI : /logistic/predict
     요청파라미터 : JSON String{waterAmt=603.0,tempNum=30.7}
     요청방식 : post
    */
	@PostMapping("/predict")
	public Map<String,Object> predict(@RequestBody FloodInfoVO floodInfoVO){
		log.info("predict -> floodInfoVO : "+ floodInfoVO);
		
		// 실습 3 시작
		//FLOOD_INFO 테이블 select
		List<FloodInfoVO> floodInfoVOList =  this.itemService.floodInfo();
		log.info("predict -> floodInfoVOList : "+ floodInfoVOList);
		// 실습 3 끝
		
		// 실습 4 시작
		//0) 모델 데이터 초기화 : 독립 변수가 2로 이미 세팅되어 있는 상태
		
		//1) 훈련데이터 생성
		List<LogisticRegressionDataPoint> trainingData = new ArrayList<LogisticRegressionDataPoint>(); 
		
		for(FloodInfoVO vo : floodInfoVOList) {
			double[] dle = new double[] {vo.getWaterAmt(), vo.getTempNum()};
			
			LogisticRegressionDataPoint dp = new LogisticRegressionDataPoint(dle, vo.getFloodYn());
			
			trainingData.add(dp);
		}
		//2) 모델학습
		double learningRate = 0.1;
		int epochs = 1000;
		this.logisticRegression.train(trainingData, learningRate, epochs);
		
		//3) 새로운 데이터 예측
	    //floodInfoVO : FloodInfoVO(yearNum=0, waterAmt=603.0, tempNum=30.7, floodYn=0)
	    int floodYn = this.logisticRegression.predict(
	          new double[] {floodInfoVO.getWaterAmt(),floodInfoVO.getTempNum()});
	    double prob = this.logisticRegression.predictProbability(
	          new double[] {floodInfoVO.getWaterAmt(),floodInfoVO.getTempNum()});
	    log.info("floodYn : " + floodYn);
	    System.out.printf("특징 %s 에 대한 예측 클래스: %d, 예측 확률: %.4f\n"
	            , Arrays.toString(
	                  new double[] {floodInfoVO.getWaterAmt(),floodInfoVO.getTempNum()})
	            , floodYn, prob); // 1 (합격) 예측 예상
	      
	    Map<String,Object> map = new HashMap<String,Object>();
	    map.put("result", floodYn);
		
		// 실습 4 끝
		
		
		// 데이터 응답
		return map;
	}
	
	// 실습 1 끝
}
