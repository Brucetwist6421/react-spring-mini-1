package kr.or.ddit.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.mapper.CarMapper;
import kr.or.ddit.service.CarService;
import kr.or.ddit.util.UploadController;
import kr.or.ddit.vo.CarVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CarServiceImpl implements CarService{
	
	@Autowired
	CarMapper carMapper;
	
	@Autowired
	UploadController uploadController;
	
	@Override
	public String create(CarVO carVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String detail(CarVO carVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String update(CarVO carVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String delete(CarVO carVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String list(CarVO carVO) {
		// TODO Auto-generated method stub
		return null;
	}

	// 실습 1 시작
	@Override
	@Transactional
	public int createPostAjax(CarVO carVO) {
		MultipartFile[] uploadFiles = carVO.getUploadFiles();

		if (uploadFiles != null && uploadFiles[0].getOriginalFilename().length() > 0) {
			// 1. 파일업로드
			long fileGroupNo = this.uploadController.multiImageUpload(carVO.getUploadFiles());

			carVO.setFileGroupNo(fileGroupNo);
		}

		// 1. 단일 파일업로드
//		MultipartFile uploadFile = carVO.getUploadFile();
//		MultipartFile uploadFile2 = carVO.getUploadFile2();

//		String pictureUrl = handleFileUpload(uploadFile);
//		item2VO.setPictureUrl(pictureUrl);
//
//		String pictureUrl2 = handleFileUpload(uploadFile2);
//		item2VO.setPictureUrl2(pictureUrl2);

		// 2. ITEM 테이블 update
		int result = this.carMapper.createPostAjax(carVO);

		return result;
	}
	// 실습 1 끝

}
