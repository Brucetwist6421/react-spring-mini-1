package kr.or.ddit.util;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.config.BeanController;
import kr.or.ddit.mapper.ItemMapper;
import kr.or.ddit.vo.FileDetailVO;
import kr.or.ddit.vo.FileGroupVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class UploadController {

	// 0. 업로드 될 폴더 DI / IoC
	@Autowired
	BeanController beanController;
	
	// 실습 6 시작
	@Autowired
	ItemMapper itemMapper;
	// 실습 6 끝
	
	// 1. 단일 파일 업로드
	public String singleFileUpload(MultipartFile multipartFile) {
		// 연월일 폴더 생성 실행
		File uploadPath = new File(this.beanController.getUploadFolder(), this.beanController.getFolder());

		// 연 월 일 폴더가 없으면 폴더 생성
		if (uploadPath.exists() == false) {
			uploadPath.mkdirs();
		}
		// 스프링 파일객체의 파일명 꺼내기
		String uploadFileName = multipartFile.getOriginalFilename();
		log.info("registerPost->uploadFileNmae : " + uploadFileName);

		// 같은 날 같은 이미지 업로드 시 파일 중복 방지 시작////////
		// java.util.UUID => 랜덤값 생성
		UUID uuid = UUID.randomUUID();

		// 원래의 파일 이름과 구분하기 위해 _를 붙임(asdflkjs_개똥이.jpg)
		uploadFileName = uuid.toString() + "_" + uploadFileName;
		// 같은 날 같은 이미지 업로드 시 파일 중복 방지 끝////////

		// 파일 복사 설계
		// , : \\ (파일 세퍼레이터)
		File saveFile = new File(uploadPath, uploadFileName);

		// 2. 파일 복사 실행(설계대로)
		// 스프링파일객체.transferTo(설계)
		try {
			multipartFile.transferTo(saveFile);
		} catch (IllegalStateException | IOException e) {
			log.error(e.getMessage());
		}

		// 실습 4 끝

		// 실습 5 시작
		// DB ITEM 테이블에 insert
		/*
		 * ItemVO(itemId=0, itemName=삼성태블릿, price=120000, description=쓸만함 ,
		 * pictureUrl=null, uploadFile=파일객체
		 * 
		 * pictureUrl에 웹경로를 넣어주자
		 * 
		 * registry.addResourceHandler("/upload/**")
		 * .addResourceLocations("file:///D:/upload/");
		 * 
		 * 결과 : /2025/09/08/UUID_파일명.gif
		 */
		String pictureUrl = "/" + this.beanController.getFolder().replace("\\", "/") + "/" + uploadFileName;
		log.info("registerPost->pictureUrl : " + pictureUrl);

		return pictureUrl;

	}// end singleFileUpload

	// 실습 7 시작
	// 다중 파일 업로드
	// ***[다중 파일 업로드] FILE_GROUP(1) 테이블 및 FILE_DETAIL(N) 테이블 사용
	// P.K FILE_GROUP_NO(20251002001) : F.K FILE_GROUP_NO(20251002001)
	public long multiImageUpload(MultipartFile[] multipartFiles) {
		long fileGroupNo = 0L;

		// 시작 ///
		String pictureUrl = "";
		int seq = 1;
		int result = 0;

		/*
		 * multipartFiles=[ 6c0e9dde , 33f91e83 ]
		 */
		// 1. FILE_GROUP 테이블에 insert(1회 실행)
		FileGroupVO fileGroupVO = new FileGroupVO();
		// 실행전 fileGroupVO{fileGroupNo=0,fileRegdate=null)
		result += this.itemMapper.insertFileGroup(fileGroupVO);
		// 실행후 fileGroupVO{fileGroupNo=20250226001,fileRegdate=null) 왜냐하면 selectKey에
		// 의해서..
		
		// selectKey 태그에 의해 fileGropuNo가 채워짐
		fileGroupNo = fileGroupVO.getFileGroupNo();
		log.info("multiImageUpload->getFileGroupNo : " + fileGroupNo);
		
		//파일의 개수만큼 반복
		for(MultipartFile multipartFile : multipartFiles) {
			log.info("이미지 파일 명 : " + multipartFile.getOriginalFilename());
			log.info("이미지 크기 : " + multipartFile.getSize());
			// MIME(Multipurpose Internet Mail Extensions) : 문서, 파일 또는 바이트 집합의 성격과 형식. 표준화
			// .jpg / .jpeg의 MIME 타입 : image/jpeg
			log.info("MIME 타입 : " + multipartFile.getContentType());
			// 서버측 업로드 대상 폴더
			log.info("uploadFolder : " + this.beanController.getUploadFolder());
	
			// 연월일 폴더 생성 설계
			// D:\\springboot\\upload \\ 2025\\05\\21
			File uploadPath = new File(this.beanController.getUploadFolder(), this.beanController.getFolder());
			// 연월일 폴더 생성 실행
			if(uploadPath.exists()==false) {
				uploadPath.mkdirs();
			}
			// 파일명
			String uploadFileName = multipartFile.getOriginalFilename();
		
			// 같은 날 같은 이미지 업로드 시 파일 중복 방지 시작----------------
			// java.util.UUID => 랜덤값 생성
			UUID uuid = UUID.randomUUID();
			// 원래의 파일 이름과 구분하기 위해 _를 붙임(sdafjasdlfksadj_개똥이.jpg)
			uploadFileName = uuid.toString() + " " + uploadFileName;
			// 같은 날 같은 이미지 업로드 시 파일 중복 방지 끝----------------
			
			log.info("multiImageUpload->uploadFileName : " + uploadFileName);
			
			// 설계
			// , : \\ (파일 세퍼레이터)
			// uploadFolder : D:\\springboot\\upload\\2025\\05\\21 + \\ + asdfljk_개똥이.jpg
			File saveFile = new File(uploadPath, uploadFileName);
			
			try {
				// 2.파일 복사 실행(설계대로)
				// 스프링파일객체.transferTo(설계)
				multipartFile.transferTo(saveFile);
			} catch (IllegalStateException | IOException e) {
				e.printStackTrace();
			}
			// 여기까지 진행 후 파일이 uploadPath 에 저장 되는 지 확인
	
			// 웹경로
			// getFolder().replace("\\", "/") : 2025/02/21
			// /2025/02/21/sdaflkfdsaj_개똥이.jpg
			pictureUrl =
				"/" + this.beanController.getFolder().replace("\\", "/") + "/"
				+ uploadFileName;
			;
			
			// 2. FILE_DETAIL 테이블에 insert(첨부파일의 개수만큼 실행)
			FileDetailVO fileDetailVO = new FileDetailVO();
			/*
			 * //실행전 fileGroupVO{fileGroupNo=0,fileRegdate=null) //실행후
			 * fileGroupVO{fileGroupNo=20250226001,fileRegdate=null) 왜냐하면 selectKey에 의해서..
			 * result += this.itemMapper.insertFileGroup(fileGroupVO);
			 */
			//시퀀스
			fileDetailVO.setFileSn(seq++);
			fileDetailVO.setFileGroupNo(fileGroupVO.getFileGroupNo());
			//원본 파일명
			fileDetailVO.setFileOriginalName(multipartFile.getOriginalFilename());
			// UUID + "_" + 원본 파일명
			fileDetailVO.setFileSaveName(uploadFileName);
			// /2025/02/21/sdaflkfdsaj_개똥이.jpg
			fileDetailVO.setFileSaveLocate(pictureUrl);
			fileDetailVO.setFileSize(multipartFile.getSize());
			fileDetailVO.setFileExt(
				multipartFile.getOriginalFilename().substring(
					multipartFile.getOriginalFilename().lastIndexOf(".")+1
				)
			); // jpg(확장자)+
			
			fileDetailVO.setFileMime(multipartFile.getContentType());//MIME 타입
			fileDetailVO.setFileFancysize(null); 
			fileDetailVO.setFileSaveDate(null);
			fileDetailVO.setFileDowncount(0);
			
			// FILE_DETAIL 테이블에 insert
			result += this.itemMapper.insertFileDetail(fileDetailVO);
		}// end for
		// 끝 ///

		return fileGroupNo;
	}
	// 실습 7 끝
}
