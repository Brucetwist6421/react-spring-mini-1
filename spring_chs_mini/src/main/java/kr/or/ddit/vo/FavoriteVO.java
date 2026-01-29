package kr.or.ddit.vo;

import java.util.Date;

import lombok.Data;

@Data
public class FavoriteVO {
    private Long id;                // 즐겨찾기 기록 고유 ID (PK)
    private String userId;         // 사용자 고유 번호 (FK)
    private Long pokemonId;      // 포켓몬 도감 번호
    private String pokemonName;     // 포켓몬 영문 이름 (API 매칭용)
    private String pokemonKoName;   // 포켓몬 한글 이름 (UI 표시용)
    private String regId;         // 등록자 ID
    private Date regDate;
}
