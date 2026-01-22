package kr.or.ddit.vo;

import lombok.Data;

@Data
public class PokemonAttachmentVO {
    private Long id;
    private Long pokemonId;
    private String fileName;
}