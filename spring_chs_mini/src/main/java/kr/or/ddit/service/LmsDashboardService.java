package kr.or.ddit.service;

import java.util.List;

import kr.or.ddit.vo.LmsDashboardVO;

public interface LmsDashboardService {
    List<LmsDashboardVO> getLmsDashboardStats(String year);
}
