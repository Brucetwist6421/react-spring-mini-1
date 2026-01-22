package kr.or.ddit.service;

import java.util.List;

import kr.or.ddit.vo.ProductVO;

public interface ProductService {

	// 실습 1 시작
	public List<ProductVO> products();
	// 실습 1 끝

	// 실습 2 시작
	public ProductVO product(ProductVO productVO);
	// 실습 2 끝
	
	// 실습 3 시작
	public int processAddProduct(ProductVO productVO);
	// 실습 3 끝

}
