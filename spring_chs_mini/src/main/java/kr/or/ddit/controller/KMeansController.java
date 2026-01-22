package kr.or.ddit.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.service.ItemService;
import kr.or.ddit.util.UploadController;
import kr.or.ddit.util.unsupervisedLearning.ClusterDataPoint;
import kr.or.ddit.util.unsupervisedLearning.KMeansClustering;
import kr.or.ddit.vo.FinalTestVO;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/kmeans")
@Slf4j
@Controller
public class KMeansController {

	// 실습 1 시작
	@Autowired
	KMeansClustering kMeans;
	
	@Autowired
	ItemService itemservice;
	
	// 실습 8 시작
	//파일 업로드 및 DB작업전용 객체 DI
	@Autowired
	UploadController uploadController;
	// 실습 8 끝
	
	/*
	 * 요청URI : /kmeans/kmeansPredict
	 * 요청파라미터 :
	 * 요청방식 : post
	 */
	@ResponseBody
	@PostMapping("/kmeansPredict")
	public Map<String, Object> kmeansPredict() {
		
		//군집 개수
		int k =3;
		int maxIterations = 100; // centroid를 찾아가기 위한 반복 횟수
		
		List<FinalTestVO> finalTestVOList = this.itemservice.finalTest();
		log.info("kmeansPredict > finalTestVOList : "+ finalTestVOList);
		
		// 실습 2 시작
		List<ClusterDataPoint> dataPoints = new ArrayList<ClusterDataPoint>();
		
		for(FinalTestVO vo : finalTestVOList) {
//			dataPoints.add(new ClusterDataPoint(vo.getColx(), vo.getColy()));
			// 실습 3 시작 -- 위의 줄 주석처리
			dataPoints.add(new ClusterDataPoint(vo.getStudentId(), vo.getColx(), vo.getColy()));
			// 실습 3 끝
		}
		
		KMeansClustering kmeans = new KMeansClustering(k, maxIterations);
		
		// K-평균 군집화 알고리즘 실행 -> k 개의 군집으로 나눠줌 -> 각 데이터포인트인 (x,y)를 가장 가까운 군집의 중심(centroin)에 할당
		List<ClusterDataPoint> clusteredData = kmeans.cluster(dataPoints);
		// 실습 2 끝
		
		// 실습 7 시작
		for (ClusterDataPoint cdp : clusteredData) {
		    for (FinalTestVO ftv : finalTestVOList) {
		        if (cdp.getStudentId() == ftv.getStudentId()) {
		            cdp.setStudentName(ftv.getStudentName());
		            break;
		        }
		    }
		}

		// 실습 7 끝
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("result", "success");
		map.put("finalTestVOList", finalTestVOList);
		map.put("clusteredData", clusteredData); // 
		
		return map;
	}
	
	// 실습 1 끝
	
	
	// 실습 4 시작
	/*
	 * 요청URI : /kmeans/kmeansList
	 * 요청방식 : get
	 */
	@GetMapping("/kmeansList")
	public String kmeansList(){
		
		return "member/kmeansList";
	}
	// 실습 4 끝
	
	
	
	// 실습 5 시작
	/*
	   요청URI : /kmeans/getFinalTest
	   요청파라미터 : JSON String{studentId=12}
	   요청방식 : post
	*/
	@ResponseBody
	@PostMapping("/getFinalTest")
	public FinalTestVO getFinalTest(
			@RequestBody FinalTestVO finalTestVO 
			){
		
		log.info("getFinalTest->finalTestVO : " + finalTestVO);
		
		// 실습 6 시작
		finalTestVO = this.itemservice.getFinalTest(finalTestVO);
		
		log.info("getFinalTest->finalTestVO(after select) : " + finalTestVO);
		// 실습 6 끝
		
		return finalTestVO;
	}
	// 실습 5 끝
	
	// 실습 9 시작
	/*
    요청URI : /kmeans/updateFinalTest
    요청파라미터 : formData
    요청방식 : post
    */
	@ResponseBody
	@PostMapping("/updateFinalTest")
	public int updateFinalTest(FinalTestVO finalTestVO) {
		log.info("updateFinalTest->finalTestVO : " + finalTestVO);
		
		
		//파일 업로드 및 DB 작업 수행
//		long fileGroupNo = this.uploadController.multiImageUpload(finalTestVO.getUploadFiles());
//		log.info("updateFinalTest->fileGroupNo : " + fileGroupNo);		
		
		
		// 실습 10 시작 -- 윗 내용(2줄) 주석 처리(impl 에서 구현)
		
		//Controller 의 동일한 메서드에서 여러개의 SQL을 실행하지 않고 service layer 에서 제어함
		int result = this.itemservice.updateFinalTest(finalTestVO);
		log.info("updateFinalTest->result : " + result);
		
		// 실습 10 끝
		
		//
		return result;
	}
	// 실습 9 끝
	
	// 실습 11 시작
	/*
    요청URI : /kmeans/deleteFinalTest
    요청파라미터 : JSONString{studentId=1}
    요청방식 : post
    */
	@ResponseBody
	@PostMapping("/deleteFinalTest")
	public int deleteFinalTest(@RequestBody FinalTestVO finalTestVO) {
		log.info("deleteFinalTest->finalTestVO : " + finalTestVO);
		
		// delete 수행
		// 성공 : 1 / 실패 : 0
		int result = this.itemservice.deleteFinalTest(finalTestVO);
		
		return result;
	}
	
	// 실습 11 끝
}
