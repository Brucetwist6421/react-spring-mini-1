package kr.or.ddit.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.service.ItemService;
import kr.or.ddit.util.simpleLinearRegression.RegressionDataPoint;
import kr.or.ddit.util.simpleLinearRegression.SimpleLinearRegression;
import kr.or.ddit.vo.HoichaAmtDataVO;
import lombok.extern.slf4j.Slf4j;

//선형 회귀 분석(Simple Linear Regression)
/*RestController => REST API 서버
Controller 
+
ResponseBody : Spring은 기본적으로 Jackson라이브러리를 통해 
     자바 객체(Object)를 JSON(String)으로 자동 변환함 => Serialize(직렬화)
*/

@RequestMapping("/slr")
@RestController
@Slf4j
public class SlrController {
	
	
	//선형 회귀 분석 객체(train(학습), predict(예측)) 
    @Autowired
    SimpleLinearRegression regressor;

	@Autowired
	ItemService itemService;
	// 실습 1 시작
	/*
    요청URI : /slr/predict
    요청파라미터 : JSON String{varX=31}
    요청방식 : post
    */
	@PostMapping("/predict")
	public Map<String, Object> predict(@RequestBody Map<String, Object> map){
		log.info("predict->map : " + map);
		
		//HOICHA_AMT_DATA select
		List<HoichaAmtDataVO> hoichaAmtDataVOList = this.itemService.hoichaAmtData();

		log.info("predict->hoichaAmtDataVOList : " + hoichaAmtDataVOList);
		
		// 실습 2 시작
		List<RegressionDataPoint> trainingData = new ArrayList<RegressionDataPoint>();
		
		//훈련데이터(메모리)
		for(HoichaAmtDataVO vo : hoichaAmtDataVOList) {
			trainingData.add(new RegressionDataPoint(vo.getHoicha(), vo.getAmt()));
		}

		//모델 학습
		this.regressor.train(trainingData);
		
		//새로운 값 예측
		Object obj = map.get("varX");
		
		if(obj instanceof Number) {
			Number num = (Number) obj;
			double hoicha1 = num.doubleValue();
			double amt = this.regressor.predict(hoicha1);
			log.info("predict->amt : " + amt);
			
			map.put("amt", amt);
		}
		
		
		
		//실습 2 끝
		
		return map;
	}
	// 실습 1 끝
	
}
