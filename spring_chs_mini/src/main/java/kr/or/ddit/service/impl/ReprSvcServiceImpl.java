package kr.or.ddit.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.mapper.ReprSvcMapper;
import kr.or.ddit.service.ReprSvcService;
import kr.or.ddit.vo.ReprSvcVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ReprSvcServiceImpl implements ReprSvcService {
	
	@Autowired
	ReprSvcMapper reprSvcMapper;
	
	@Override
	public String create(ReprSvcVO reprSvcVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String detail(ReprSvcVO reprSvcVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String update(ReprSvcVO reprSvcVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String delete(ReprSvcVO reprSvcVO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String list(ReprSvcVO reprSvcVO) {
		// TODO Auto-generated method stub
		return null;
	}

}
