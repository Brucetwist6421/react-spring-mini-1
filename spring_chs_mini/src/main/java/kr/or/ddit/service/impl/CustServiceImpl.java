package kr.or.ddit.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.mapper.CustMapper;
import kr.or.ddit.service.CustService;
import kr.or.ddit.vo.CustVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CustServiceImpl implements CustService{
	
	@Autowired
	CustMapper custMapper;
	
	@Override
	public String create(CustVO custVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String detail(CustVO custVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String update(CustVO custVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String delete(CustVO custVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String list(CustVO custVO) {
		// TODO Auto-generated method stub
		return null;
	}

	// 실습 1 시작
	@Override
	public int createPost(CustVO custVO) {
		return this.custMapper.createPost(custVO);
	}
	// 실습 1 끝

	// 실습 2 시작
	@Override
	public List<CustVO> getList() {
		return this.custMapper.getList();
	}
	// 실습 2 끝


}
