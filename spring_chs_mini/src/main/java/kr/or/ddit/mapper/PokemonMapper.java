package kr.or.ddit.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.vo.PokemonAttachmentVO;
import kr.or.ddit.vo.PokemonVO;

@Mapper
public interface PokemonMapper {

	// 실습 1 시작
	public void insertAttachment(Long pokemonId, String name, String fileName);

	public void insertPokemon(PokemonVO vo);
	// 실습 1 끝

	// 실습 2 시작
	public PokemonVO selectPokemonById(Long id);
	
	List<PokemonAttachmentVO> selectAttachmentsByPokemonId(Long pokemonId);
	// 실습 2 끝

	// 실습 3 시작
	public void updatePokemon(PokemonVO pokemonVO);

	public List<Long> selectAttachmentIdsByPokemonId(Long pokemonId);

	public void deleteAttachmentById(Long id);
	// 실습 3 끝

	// 실습 4 시작
	public int deletePokemon(Long id);
	// 실습 4 끝
	
}
