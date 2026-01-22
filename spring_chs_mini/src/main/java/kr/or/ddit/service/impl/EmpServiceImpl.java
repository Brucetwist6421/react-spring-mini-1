package kr.or.ddit.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.mapper.EmpMapper;
import kr.or.ddit.service.EmpService;
import kr.or.ddit.vo.EmpVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class EmpServiceImpl implements EmpService {
	
	@Autowired
	EmpMapper empMapper;
	
	@Override
	public String create(EmpVO empVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String detail(EmpVO empVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String update(EmpVO empVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String delete(EmpVO empVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String list(EmpVO empVO) {
		// TODO Auto-generated method stub
		return null;
	}

	// 실습 1 시작
	@Override
	public int createPost(EmpVO empVO) {
		return this.empMapper.createPost(empVO);
	}
	// 실습 1 끝

}
