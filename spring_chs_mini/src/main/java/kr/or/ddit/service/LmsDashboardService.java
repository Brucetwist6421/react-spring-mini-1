package kr.or.ddit.service;

import java.util.List;

import kr.or.ddit.vo.LmsDashboardVO;
import kr.or.ddit.vo.LmsStudentScoreVO;

public interface LmsDashboardService {
    List<LmsDashboardVO> getLmsDashboardStats(String year);

    List<LmsStudentScoreVO> getStudentScoresByCurriculum(Integer curSeq);

    
}
