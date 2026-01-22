package kr.or.ddit.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.mapper.ProductMapper;
import kr.or.ddit.service.ProductService;
import kr.or.ddit.vo.ProductVO;

@Service
public class ProductServiceImpl implements ProductService {
	
	@Autowired
	ProductMapper productMapper;

	// 실습 1 시작
	@Override
	public List<ProductVO> products() {
		return this.productMapper.products();
	}
	// 실습 1 끝

	// 실습 2 시작
	@Override
	public ProductVO product(ProductVO productVO) {
		return this.productMapper.product(productVO);
	}
	// 실습 2 끝

	// 실습 3 시작
	@Override
	public int processAddProduct(ProductVO productVO) {
		return this.productMapper.processAddProduct(productVO);
	}
	// 실습 3 끝
	
}
