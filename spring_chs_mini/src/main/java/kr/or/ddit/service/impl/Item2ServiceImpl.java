package kr.or.ddit.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.mapper.Item2Mapper;
import kr.or.ddit.service.Item2Service;
import kr.or.ddit.util.UploadController;
import kr.or.ddit.vo.Item2VO;
import kr.or.ddit.vo.ItemVO;
import kr.or.ddit.vo.MemberVO;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class Item2ServiceImpl implements Item2Service {

	// 실습 1 시작
	@Autowired
	Item2Mapper item2Mapper;

	@Autowired
	UploadController uploadController;

	@Override
	public int registerPost(Item2VO item2VO) {
		return this.item2Mapper.registerPost(item2VO);
	}
	// 실습 1 끝

	// 실습 2 시작
	@Override
	public Item2VO detail(Item2VO item2VO) {
		return this.item2Mapper.detail(item2VO);
	}
	// 실습 2 끝

	// 실습 3 시작
	@Override
	public int editPost(Item2VO item2VO) {
		return this.item2Mapper.editPost(item2VO);
	}
	// 실습 3 끝

	// 실습 4 시작
	@Override
	public int deletePost(Item2VO item2VO) {
		return this.item2Mapper.deletePost(item2VO);
	}
	// 실습 4 끝

	// 실습 5 시작
//	@Override
//	public List<ItemVO> list() {
//		return this.item2Mapper.list();
//	}
	// 실습 5 끝

	// 실습 6 시작
//	@Override
//	public int getTotal() {
//		return this.item2Mapper.getTotal();
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
//		return this.item2Mapper.list(params);
//	}
	// 실습 7 끝

	// 실습 8 시작 -- 실습 7 주석 처리
	@Override
	public List<Item2VO> list(int currentPage, int size, String keyword) {
		int startRow = (currentPage - 1) * size + 1;
		int endRow = currentPage * size;

		Map<String, Object> params = new HashMap<>();
		params.put("startRow", startRow);
		params.put("endRow", endRow);
		params.put("keyword", keyword);
		params.put("currentPage", currentPage);
		return this.item2Mapper.list(params);
	}
	// 실습 8 끝

	// 실습 9 시작 -- 실습 6 주석 처리
	@Override
	public int getTotal(String keyword) {
		return this.item2Mapper.getTotal(keyword);
	}
	//
	// 실습 9 끝

	// 실습 10 시작
	@Transactional
	@Override
	public int editPostAjax(Item2VO item2VO) {

		MultipartFile[] uploadFiles = item2VO.getUploadFiles();

		if (uploadFiles != null && uploadFiles[0].getOriginalFilename().length() > 0) {
			// 1. 파일업로드
			long fileGroupNo = this.uploadController.multiImageUpload(item2VO.getUploadFiles());

			item2VO.setFileGroupNo(fileGroupNo);
		}

		// 1. 단일 파일업로드
		MultipartFile uploadFile = item2VO.getUploadFile();
		MultipartFile uploadFile2 = item2VO.getUploadFile2();

		String pictureUrl = handleFileUpload(uploadFile);
		item2VO.setPictureUrl(pictureUrl);

		String pictureUrl2 = handleFileUpload(uploadFile2);
		item2VO.setPictureUrl2(pictureUrl2);

		// 2. ITEM 테이블 update
		int result = this.item2Mapper.editPostAjax(item2VO);

		return result;
	}
	// 실습 10 끝

	// 실습 11 시작
	private String handleFileUpload(MultipartFile file) {
		if (file != null && file.getOriginalFilename().length() > 0) {
			return this.uploadController.singleFileUpload(file);
		}
		return null; // 파일이 없으면 null 리턴
	}
	// 실습 11 끝

	// 실습 12 시작
	@Override
	public int createPostAjax(Item2VO item2vo) {
		// 실습 13 시작
		// 3. Security Context에서 Authentication 객체를 가져옴
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		// 로그인 되어있나?
		if (authentication == null || !authentication.isAuthenticated()) {
			return 0;// 댓글 등록 실패
		}

		Object principal = authentication.getPrincipal();

		MemberVO memberVO = new MemberVO();
		// principal(사용자 정보) 객체가 CustomUser 타입의 객체인지 체킹
		if (principal instanceof CustomUser) {
			CustomUser customUser = (CustomUser) principal;

			memberVO = customUser.getMemberVO();
		}
		log.info("createPostAjax->memberVO : {}", memberVO);
		// 실습 13 끝

		return this.item2Mapper.createPostAjax(item2vo);
	}
	// 실습 12 끝

	// 실습 14 시작
	@Override
	public Item2VO detailAjax(Item2VO item2vo) {
		return this.item2Mapper.detailAjax(item2vo);
	}
	// 실습 14 끝

	// 실습 15 시작
	@Override
	public int modifyAjax(Item2VO item2vo) {
		return this.item2Mapper.modifyAjax(item2vo);
	}
	// 실습 15 끝

	// 실습 16 시작
	@Override
	public int deleteAjax(Item2VO item2vo) {
		return this.item2Mapper.deleteAjax(item2vo);
	}
	// 실습 16 끝

}
