package kr.or.ddit.service;

import kr.or.ddit.vo.CurriculumVO;

public interface CurriculumService {
    int insertCurriculum(CurriculumVO curriculumVO);

    int updateCurriculum(CurriculumVO curriculumVO);

    CurriculumVO getCurriculumDetail(Integer curSeq);
}