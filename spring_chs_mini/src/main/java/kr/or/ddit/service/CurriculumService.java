package kr.or.ddit.service;

import java.util.List;

import kr.or.ddit.vo.CurriculumVO;
import kr.or.ddit.vo.SubjectVO;

public interface CurriculumService {
    int insertCurriculum(CurriculumVO curriculumVO);

    int updateCurriculum(CurriculumVO curriculumVO);

    CurriculumVO getCurriculumDetail(Integer curSeq);

    int deleteCurriculum(Integer curSeq);

    List<SubjectVO> getSubjectList(Integer curSeq);
}