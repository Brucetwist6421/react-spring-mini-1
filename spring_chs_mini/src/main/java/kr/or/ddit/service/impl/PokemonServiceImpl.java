package kr.or.ddit.service.impl;

import kr.or.ddit.mapper.PokemonMapper;
import kr.or.ddit.service.PokemonService;
import kr.or.ddit.vo.FavoriteVO;
import kr.or.ddit.vo.PokemonAttachmentVO;
import kr.or.ddit.vo.PokemonVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PokemonServiceImpl implements PokemonService {

	// 실습 1 시작
	@Autowired
	private final PokemonMapper pokemonMapper;
	

	@Override
	public void createPokemon(PokemonVO vo, MultipartFile mainImage) {
		try {
			// 1. 메인 이미지 저장 후 VO에 세팅
			String mainImagePath = saveMainImage(mainImage);
			vo.setMainImagePath(mainImagePath);

			// 2. Pokemon insert
			pokemonMapper.insertPokemon(vo);
			Long pokemonId = vo.getId(); // insert 후 생성된 ID

			// 3. 첨부파일 저장
			saveAttachments(pokemonId, vo.getName(), vo.getAttachmentFiles());

		} catch (IOException e) {
			throw new RuntimeException("createPokemon 실패", e);
		}
	}

	// 공통 파일 업로드(컴포넌트 화)
	// 첨부 파일 저장
	// private void saveAttachments(Long pokemonId, String pokemonName,
	// List<MultipartFile> attachmentFiles)
	// throws IOException {
	// if (attachmentFiles == null || attachmentFiles.isEmpty())
	// return;

	// for (MultipartFile file : attachmentFiles) {
	// if (!file.isEmpty()) {
	// String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
	// file.transferTo(new File("/upload/" + fileName));
	// pokemonMapper.insertAttachment(pokemonId, pokemonName, fileName);
	// }
	// }
	// }

	// 첨부 파일 저장
	private void saveAttachments(Long pokemonId, String pokemonName, List<MultipartFile> attachmentFiles)
			throws IOException {
		if (attachmentFiles == null || attachmentFiles.isEmpty())
			return;

		// 1. 실제 저장될 서버의 절대 경로를 설정합니다. (끝에 / 포함)
		// 윈도우라면 "C:/upload/", 리눅스라면 "/home/ubuntu/upload/"
		String uploadPath = "/home/ubuntu/upload/";

		// 2. 해당 폴더가 없으면 생성하는 로직 추가 (방어 코드)
		File uploadDir = new File(uploadPath);
		if (!uploadDir.exists()) {
			uploadDir.mkdirs();
		}

		for (MultipartFile file : attachmentFiles) {
			if (!file.isEmpty()) {
				// 한글 파일명 문제를 방지하기 위해 가급적 공백을 제거하거나
				// 실무에서는 UUID로만 저장하는 것을 권장하지만, 일단 현재 로직을 유지합니다.
				String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

				// 3. 수정된 절대 경로로 파일 저장
				File saveFile = new File(uploadPath + fileName);
				file.transferTo(saveFile);

				pokemonMapper.insertAttachment(pokemonId, pokemonName, fileName);
			}
		}
	}

	// 메인 이미지 저장
	private String saveMainImage(MultipartFile mainImage) throws IOException {
		if (mainImage == null || mainImage.isEmpty())
			return null;

		// 1. 경로 통일 (첨부파일과 동일하게!)
		String uploadPath = "/home/ubuntu/upload/";
		
		// 2. 방어 코드 추가 (폴더 없으면 생성)
		File uploadDir = new File(uploadPath);
		if (!uploadDir.exists()) {
			uploadDir.mkdirs();
		}

		String mainName = UUID.randomUUID() + "_" + mainImage.getOriginalFilename();

		// 3. 전체 경로로 파일 생성
		File mainFile = new File(uploadPath + mainName);
		mainImage.transferTo(mainFile);

		return mainName;
	}
	// 실습 1 끝

	@Override
	public List<PokemonVO> getPokemonList() {
		List<PokemonVO> pokemonList = pokemonMapper.selectPokemonList();
		if (pokemonList == null || pokemonList.isEmpty()) {
			for (PokemonVO vo : pokemonList) {
				List<PokemonAttachmentVO> attachments = pokemonMapper.selectAttachmentsByPokemonId(vo.getId());
				if (attachments != null && !attachments.isEmpty()) {
					vo.setAttachments(attachments);
				}
			}
		}
		return pokemonList;
	}

	// 실습 2 시작
	@Override
	public PokemonVO getPokemonDetail(Long id) {
		PokemonVO pokemon = pokemonMapper.selectPokemonById(id);
		if (pokemon != null) {
			List<PokemonAttachmentVO> attachments = pokemonMapper.selectAttachmentsByPokemonId(id);
			if (attachments != null && !attachments.isEmpty()) {
				pokemon.setAttachments(attachments);
			}
		}
		return pokemon;
	}
	// 실습 2 끝

	// 실습 3 시작
	@Override
	@Transactional
	public void updatePokemon(PokemonVO pokemonVO, MultipartFile mainImage, List<Long> existingAttachmentIdList) {
		try {
			// 1. 메인 이미지가 변경 된 경우에만 실행
			if (mainImage != null && !mainImage.isEmpty()) {
				String mainImagePath = saveMainImage(mainImage);
				pokemonVO.setMainImagePath(mainImagePath);
			}

			log.info("updatePokemonSvImpl->mainImagePath : {}", pokemonVO.getMainImagePath());
			// 2. Pokemon update
			pokemonMapper.updatePokemon(pokemonVO);
			Long pokemonId = pokemonVO.getId(); // insert 후 생성된 ID

			// 3. 기존 첨부파일 유지 및 삭제 로직
			if (existingAttachmentIdList != null && !existingAttachmentIdList.isEmpty()) {
				log.info("유지할 기존 첨부파일 ID: {}", existingAttachmentIdList);
				// 3-1) 기존 포켓몬의 모든 첨부파일 ID 조회
				List<Long> allAttachmentIds = pokemonMapper.selectAttachmentIdsByPokemonId(pokemonId);

				// 3-2) 유지되지 않은 파일들은 삭제 처리 (혹은 status='D')
				for (Long id : allAttachmentIds) {
					if (!existingAttachmentIdList.contains(id)) {
						pokemonMapper.deleteAttachmentById(id); // or update status='D'
					}
				}
			}

			// 4. 새로 첨부된 파일 저장
			List<MultipartFile> newFiles = pokemonVO.getAttachmentFiles();
			if (newFiles != null && !newFiles.isEmpty()) {
				log.info("새 첨부파일 저장: {}", newFiles);
				log.info("새 첨부파일 저장: {}개", newFiles.size());
				saveAttachments(pokemonId, pokemonVO.getName(), newFiles);
			}

		} catch (IOException e) {
			throw new RuntimeException("updatePokemon 실패", e);
		}

	}
	// 실습 3 끝

	// 실습 4 시작
	@Override
	public int deletePokemon(Long id) {
		return pokemonMapper.deletePokemon(id);
	}
	// 실습 4 끝

	// 실습 5 시작
	@Override
	@Transactional
	public int deletePokemons(List<Long> idList) {
		int result = 0;

		try {
			for (Long id : idList) {
				int deleted = pokemonMapper.deletePokemon(id);
				if (deleted > 0) {
					result++;
				}
			}

			// 모든 삭제가 성공했는지 여부 확인
			if (result == idList.size()) {
				return 1; // 전부 성공
			} else {
				return 0; // 일부 또는 전체 실패
			}

		} catch (Exception e) {
			e.printStackTrace();
			return 0; // 예외 발생 시 실패
		}
	}

	@Override
	public boolean toggleFavorite(FavoriteVO favoriteVO) {
		// 1. 이미 즐겨찾기 되어있는지 확인
        int count = pokemonMapper.checkFavorite(favoriteVO.getPokemonId());

        if (count > 0) {
            // 2. 있으면 삭제
            pokemonMapper.deleteFavorite(favoriteVO);
            return false;
        } else {
            // 3. 없으면 추가
            pokemonMapper.insertFavorite(favoriteVO);
            return true;
        }
	}

	
	// 실습 5 끝

}
