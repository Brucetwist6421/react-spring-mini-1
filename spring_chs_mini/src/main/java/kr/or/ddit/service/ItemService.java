package kr.or.ddit.service;

import java.util.List;

import kr.or.ddit.vo.ExamPassFailVO;
import kr.or.ddit.vo.FinalTestVO;
import kr.or.ddit.vo.FloodInfoVO;
import kr.or.ddit.vo.HoichaAmtDataVO;
import kr.or.ddit.vo.Item2VO;
import kr.or.ddit.vo.ItemVO;

public interface ItemService {

	// 실습 1 시작
	public int registerPost(ItemVO itemVO);
	// 실습 1 끝

	// 실습 2 시작
	public ItemVO detail(ItemVO itemVO);
	// 실습 2 끝

	// 실습 3 시작
	public int editPost(ItemVO itemVO);
	// 실습 3 끝

	// 실습 4 시작
	public int deletePost(ItemVO itemVO);
	// 실습 4 끝

	// 실습 5 시작
//	public List<ItemVO> list();
	// 실습 5 끝

	// 실습 6 시작
//	public int getTotal();
	// 실습 6 끝

	// 실습 7 시작 -- 실습 5 주석 처리
//	public List<ItemVO> list(int currentPage, int size);
	// 실습 7 끝

	// 실습 8 시작 -- 실습 7 주석 처리
	public List<ItemVO> list(int currentPage, int size, String keyword);
	// 실습 8 끝

	// 실습 9 시작 -- 실습 6 주석 처리
	public int getTotal(String keyword);
	// 실습 9 끝

	// 실습 10 시작
	public List<ExamPassFailVO> getExamPassFail();
	// 실습 10 끝

	// 실습 11 시작
	public List<HoichaAmtDataVO> hoichaAmtData();
	// 실습 11 끝

	// 실습 12 시작
	public List<FloodInfoVO> floodInfo();
	// 실습 12 끝

	// 실습 13 시작
	public List<FinalTestVO> finalTest();
	// 실습 13 끝

	// 실습 14 시작
	public FinalTestVO getFinalTest(FinalTestVO finalTestVO);
	// 실습 14 끝

	// 실습 15 시작
	public int updateFinalTest(FinalTestVO finalTestVO);
	// 실습 15 끝

	// 실습 16 시작
	public int deleteFinalTest(FinalTestVO finalTestVO);
	// 실습 16 끝

	// 실습 17 시작
	public int editPostAjax(ItemVO itemVO);
	// 실습 17 끝
}
