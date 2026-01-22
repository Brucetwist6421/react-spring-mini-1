package kr.or.ddit.mapper;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.vo.ReprSvcVO;

@Mapper
public interface ReprSvcMapper {
	
	public String create(ReprSvcVO reprSvcVO); 
	
	public String detail(ReprSvcVO reprSvcVO);
	
	public String update(ReprSvcVO reprSvcVO); 
	
	public String delete(ReprSvcVO reprSvcVO);
	
	public String list(ReprSvcVO reprSvcVO);
}
