package kr.or.ddit.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.mapper.ItemMapper;
import kr.or.ddit.service.ItemService;
import kr.or.ddit.util.UploadController;
import kr.or.ddit.vo.ExamPassFailVO;
import kr.or.ddit.vo.FinalTestVO;
import kr.or.ddit.vo.FloodInfoVO;
import kr.or.ddit.vo.HoichaAmtDataVO;
import kr.or.ddit.vo.ItemVO;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ItemServiceImpl implements ItemService {

	// 실습 1 시작
	@Autowired
	ItemMapper itemMapper;

	@Override
	public int registerPost(ItemVO itemVO) {
		return this.itemMapper.registerPost(itemVO);
	}
	// 실습 1 끝

	// 실습 15 시작
	@Autowired
	UploadController uploadController;
	// 실습 15 끝

	// 실습 2 시작
	@Override
	public ItemVO detail(ItemVO itemVO) {
		return this.itemMapper.detail(itemVO);
	}
	// 실습 2 끝

	// 실습 3 시작
	@Override
	public int editPost(ItemVO itemVO) {
		return this.itemMapper.editPost(itemVO);
	}
	// 실습 3 끝

	// 실습 4 시작
	@Override
	public int deletePost(ItemVO itemVO) {
		return this.itemMapper.deletePost(itemVO);
	}
	// 실습 4 끝

	// 실습 5 시작
//	@Override
//	public List<ItemVO> list() {
//		return this.itemMapper.list();
//	}
	// 실습 5 끝

	// 실습 6 시작
//	@Override
//	public int getTotal() {
//		return this.itemMapper.getTotal();
//	}
//	// 실습 6 끝

	// 실습 7 시작 -- 실습 5 주석 처리
//	@Override
//	public List<ItemVO> list(int currentPage, int size) {
//		int startRow = (currentPage - 1) * size + 1;
//		int endRow = currentPage * size;
//
//		Map<String, Object> params = new HashMap<>();
//		params.put("startRow", startRow);
//		params.put("endRow", endRow);
//		return this.itemMapper.list(params);
//	}
	// 실습 7 끝

	// 실습 8 시작 -- 실습 7 주석 처리
	@Override
	public List<ItemVO> list(int currentPage, int size, String keyword) {
		int startRow = (currentPage - 1) * size + 1;
		int endRow = currentPage * size;

		Map<String, Object> params = new HashMap<>();
		params.put("startRow", startRow);
		params.put("endRow", endRow);
		params.put("keyword", keyword);
		return this.itemMapper.list(params);
	}
	// 실습 8 끝

	// 실습 9 시작 -- 실습 6 주석 처리
	@Override
	public int getTotal(String keyword) {
		return this.itemMapper.getTotal(keyword);
	}
	//
	// 실습 9 끝

	// 실습 10 시작
	@Override
	public List<ExamPassFailVO> getExamPassFail() {
		return this.itemMapper.getExamPassFail();
	}
	// 실습 10 끝

	// 실습 11 시작
	@Override
	public List<HoichaAmtDataVO> hoichaAmtData() {
		return this.itemMapper.hoichaAmtData();
	}
	// 실습 11 끝

	// 실습 12 시작
	@Override
	public List<FloodInfoVO> floodInfo() {
		return this.itemMapper.floodInfo();
	}
	// 실습 12 끝

	// 실습 13 시작
	@Override
	public List<FinalTestVO> finalTest() {
		return this.itemMapper.finalTest();
	}
	// 실습 13 끝

	// 실습 14 시작
	@Override
	public FinalTestVO getFinalTest(FinalTestVO finalTestVO) {
		return this.itemMapper.getFinalTest(finalTestVO);
	}
	// 실습 14 끝

	// 실습 16 시작
	// @Transactional : 스프링이 트랜잭션 처리를 알아서 한다.
//	@Transactional
//	@Override
//	public int updateFinalTest(FinalTestVO finalTestVO) {
//		// 파일 업로드 및 DB 작업 수행
//		long fileGroupNo = this.uploadController.multiImageUpload(finalTestVO.getUploadFiles());
//		log.info("updateFinalTest->fileGroupNo : " + fileGroupNo);
//
//		// FINAL_TEST 테이블의 FILE_GROUP_NO 값 보정
//		finalTestVO.setFileGroupNo(fileGroupNo);
//
//		int result = this.itemMapper.updateFinalTest(finalTestVO);
//
//		return result;
//	}
	// 실습 16 끝

	// 실습 17 시작 -- 실습 16 주석 처리
	// Transactional : 스프링이 트랜잭션 처리를 알아서 해줌
	@Transactional
	@Override
	public int updateFinalTest(FinalTestVO finalTestVO) {

		// 1. 파일이 있을때만 실행해야 함 시작 //////
		MultipartFile[] uploadFiles = finalTestVO.getUploadFiles();

		if (uploadFiles != null) {// 수정할 파일이 있음
			// 첫번째 파일객체 . 원본파일명 .길이 가 0보다 커야함
			if (uploadFiles[0].getOriginalFilename().length() > 0) {
				// 파일업로드 및 DB작업 수행
				// Insert가 2회 이상(FILE_GROUP테이블 + FILE_DETAIL 테이블에 INSERT)
				long fileGroupNo = this.uploadController.multiImageUpload(finalTestVO.getUploadFiles());
				log.info("updateFinalTest->fileGroupNo : " + fileGroupNo);

				// FINAL_TEST 테이블의 FILE_GROUP_NO 값 보정
				// Update가 1회 발생
				finalTestVO.setFileGroupNo(fileGroupNo);
			} // end if
		} // end if
			// 1. 파일이 있을때만 실행해야 함 끝 //////
			// 2. 파일이 없다면?
			// finalTestVO의 fileGroupNo 프로퍼티의 value는 null임

		int result = this.itemMapper.updateFinalTest(finalTestVO);

		return result;
	}
	// 실습 17 끝

	// 실습 18 시작
	@Override
	public int deleteFinalTest(FinalTestVO finalTestVO) {
		return this.itemMapper.deleteFinalTest(finalTestVO);
	}
	// 실습 18 끝

	
	// 실습 19 시작
	@Transactional
	@Override
	public int editPostAjax(ItemVO itemVO) {
		
		MultipartFile[] uploadFiles = itemVO.getUploadFiles();
		
		if(uploadFiles != null && uploadFiles[0].getOriginalFilename().length() > 0) {
			//1. 파일업로드
			long fileGroupNo = this.uploadController.multiImageUpload(itemVO.getUploadFiles());
			
			itemVO.setFileGroupNo(fileGroupNo);
		}
		
		//2. ITEM 테이블 update
		int result = this.itemMapper.editPostAjax(itemVO);
		
		return result;
	}
	// 실습 19 끝

}
