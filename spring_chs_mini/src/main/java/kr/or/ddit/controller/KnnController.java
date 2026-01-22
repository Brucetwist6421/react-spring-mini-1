package kr.or.ddit.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.service.ItemService;
import kr.or.ddit.util.knn.DataPoint;
import kr.or.ddit.util.knn.KNNClassifier;
import kr.or.ddit.vo.ExamPassFailVO;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/knn")
@Slf4j
@Controller
public class KnnController {

	// 실습 1 시작
	@Autowired
	KNNClassifier classifier;
	@Autowired
	ItemService itemService;
	// 실습 1 끝
	
	// 실습 2 시작
	@ResponseBody
	@PostMapping("/predict01")
	public String predict01(@RequestBody ExamPassFailVO examPassFailVO) {
		log.info("predict01 -> examPassFailVO : " + examPassFailVO);
		
		// 실습 3 시작
		//EXAM_PASS_FAIL 테이블 SELECT
		List<ExamPassFailVO> examPassFailVOList = this.itemService.getExamPassFail();
		log.info("predict01 -> examPassFailVOList : " + examPassFailVOList);
		
		// 1. 훈련데이터 목록
		List<DataPoint> trainingData = new ArrayList<DataPoint>();
		for(ExamPassFailVO vo : examPassFailVOList) {
			//훈련데이터
			DataPoint dp = new DataPoint(vo.getStudyTime(), vo.getLibInvCnt(), vo.getPassFail());
			trainingData.add(dp);
		}
		DataPoint newPoint = new DataPoint(examPassFailVO.getStudyTime(), examPassFailVO.getLibInvCnt(), null);
		// 실습 3 끝
		
		//KNN 사용
		//String passFail = this.classifier.classify(null, null, 5);
		String passFail = this.classifier.classify(trainingData, newPoint, 5); //실습 4 진행. 윗 줄 주석처리
		log.info("predict01 -> passFail : " + passFail);
		
		//데이터 응답
		return passFail;
	}
	// 실습 2 끝
}
