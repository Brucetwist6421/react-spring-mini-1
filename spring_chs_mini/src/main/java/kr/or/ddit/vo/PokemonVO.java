package kr.or.ddit.vo;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class PokemonVO {
	private Long id;
	private String name;
	private String description;
	private String type;
	private int height;
	private int weight;
	private int isFavorite;
	private int isPublic;
	private int isNotify;
	private String variant;
	
	private MultipartFile mainImage;

	// 실제 DB 저장 시 파일 경로만 저장
	private String mainImagePath;

	// 업로드용 (사용자가 form에서 업로드할 때)
	private List<MultipartFile> attachmentFiles;

	// 조회용 (DB에서 불러올 때)
	private List<PokemonAttachmentVO> attachments;
}