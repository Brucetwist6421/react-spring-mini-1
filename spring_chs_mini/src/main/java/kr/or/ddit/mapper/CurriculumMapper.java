package kr.or.ddit.mapper;

import kr.or.ddit.vo.CurriculumVO;
import kr.or.ddit.vo.SubjectVO;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CurriculumMapper {
    int insertCurriculum(CurriculumVO curriculumVO);

    int updateCurriculum(CurriculumVO curriculumVO);

    CurriculumVO selectCurriculumDetail(Integer curSeq);

    int deleteCurriculum(Integer curSeq);

    List<SubjectVO> selectSubjectListByCurSeq(Integer curSeq);
}