package kr.or.ddit.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.vo.PokemonVO;

public interface PokemonService {

	// 실습 1 시작
	public void createPokemon(PokemonVO pokemonVO, MultipartFile mainImage);
	// 실습 1 끝
	
	public List<PokemonVO> getPokemonList();

	// 실습 2 시작
	public PokemonVO getPokemonDetail(Long id);
	// 실습 2 끝

	// 실습 3 시작
	public void updatePokemon(PokemonVO pokemonVO, MultipartFile mainImage, List<Long> existingAttachmentIdList);
	// 실습 3 끝

	// 실습 4 시작
	public int deletePokemon(Long id);
	// 실습 4 끝

	// 실습 5 시작
	public int deletePokemons(List<Long> idList);
	// 실습 5 끝
}
