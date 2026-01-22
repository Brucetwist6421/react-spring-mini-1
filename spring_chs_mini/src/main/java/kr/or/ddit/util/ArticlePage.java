package kr.or.ddit.util;

import java.util.List;

import lombok.Data;

//페이징 관련 프로퍼티 + 게시글 프로퍼티
@Data
public class ArticlePage<T> {
	// 전체글 수
	private int total;
	// 현재 페이지 번호
	private int currentPage;
	// 전체 페이지수
	private int totalPages;
	// 블록의 시작 페이지 번호
	private int startPage;
	// 블록의 종료 페이지 번호
	private int endPage;
	// 검색어
	private String keyword = "";
	// 요청URL
	private String url = "";
	// select 결과 데이터
	private List<T> content;
	// 페이징 처리
	private String pagingarea = "";

	// 생성자(Constructor) : 페이징 정보를 생성
	public ArticlePage(int total, int currentPage, int size, String keyword, List<T> content) {
		// size : 한 화면에 보여질 목록의 행 수
		this.total = total;
		this.currentPage = currentPage;
		this.keyword = keyword;
		this.content = content;
	}

	// 생성자(Constructor) : 페이징 정보를 생성
	// 전체글 수 현재 페이지 번호 한 화면 목록 데이터 검색어
	public ArticlePage(int total, int currentPage, int size, List<T> content, String keyword) {
		// size : 한 화면에 보여질 목록의 행 수(10)
		this.total = total;
		this.currentPage = currentPage;
		this.keyword = keyword;
		this.content = content;

		// 전체글 수가 0이면?
		if (total == 0) {
			// 전체 페이지 수
			totalPages = 0;
			// 블록 시작번호
			startPage = 0;
			// 블록 종료번호
			endPage = 0;
			// 글이 있다면
		} else {
			// 전체 페이지 수 = 전체글 수 / 한 화면에 보여질 목록의 행 수
			// 3 = 31 / 10
			totalPages = total / size;
			// 나머지가 있다면, 페이지를 1 증가
			if (total % size > 0) {
				totalPages++;
			}
			// 페이지 블록시작번호를 구하는 공식
			// 블록시작번호 = 현재페이지 / 블록크기 * 페이지크기 + 1
			startPage = currentPage / 5 * 5 + 1;

			// 현재페이지 % 페이지크기 => 0일 때 보정
			if (currentPage % 5 == 0) {
				startPage -= 5;
			}

			// 블록종료번호 = 블록시작번호 + (블록크기 - 1)
			// [1][2][3][4][5][다음]
			endPage = startPage + (5 - 1);

			// 블록종료번호 > 전체페이지수
			if (endPage > totalPages) {
				endPage = totalPages;
			}
		} // end if

	}

	@Override
	public String toString() {
		return "ArticlePage [total=" + total + ", currentPage=" + currentPage + ", totalPages=" + totalPages
				+ ", startPage=" + startPage + ", endPage=" + endPage + ", keyword=" + keyword + ", url=" + url
				+ ", content=" + content + ", pagingarea=" + pagingarea + "]";
	}

}
