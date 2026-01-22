package kr.or.ddit.service;

import java.util.List;

import kr.or.ddit.vo.Item2VO;

public interface Item2Service {

	// 실습 1 시작
	public int registerPost(Item2VO item2VO);
	// 실습 1 끝

	// 실습 2 시작
	public Item2VO detail(Item2VO item2VO);
	// 실습 2 끝

	// 실습 3 시작
	public int editPost(Item2VO item2VO);
	// 실습 3 끝

	// 실습 4 시작
	public int deletePost(Item2VO item2VO);
	// 실습 4 끝

	// 실습 5 시작
//	public List<Item2VO> list();
	// 실습 5 끝

	// 실습 6 시작
//	public int getTotal();
	// 실습 6 끝

	// 실습 7 시작 -- 실습 5 주석 처리
//	public List<Item2VO> list(int currentPage, int size);
	// 실습 7 끝

	// 실습 8 시작 -- 실습 7 주석 처리
	public List<Item2VO> list(int currentPage, int size, String keyword);
	// 실습 8 끝

	// 실습 9 시작 -- 실습 6 주석 처리
	public int getTotal(String keyword);
	// 실습 9 끝

	// 실습 10 시작
	public int editPostAjax(Item2VO item2vo);
	// 실습 10 끝

	// 실습 11 시작
	public int createPostAjax(Item2VO item2vo);
	// 실습 11 끝

	// 실습 12 시작
	public Item2VO detailAjax(Item2VO item2vo);
	// 실습 12 끝

	// 실습 13 시작
	public int modifyAjax(Item2VO item2vo);
	// 실습 13 끝

	// 실습 14 시작
	public int deleteAjax(Item2VO item2vo);
	// 실습 14 끝
}
