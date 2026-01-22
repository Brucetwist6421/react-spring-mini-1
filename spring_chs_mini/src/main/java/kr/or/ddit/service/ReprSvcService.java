package kr.or.ddit.service;

import kr.or.ddit.vo.ReprSvcVO;

public interface ReprSvcService {
	
	public String create(ReprSvcVO reprSvcVO); 
	
	public String detail(ReprSvcVO reprSvcVO);
	
	public String update(ReprSvcVO reprSvcVO); 
	
	public String delete(ReprSvcVO reprSvcVO);
	
	public String list(ReprSvcVO reprSvcVO);
}
