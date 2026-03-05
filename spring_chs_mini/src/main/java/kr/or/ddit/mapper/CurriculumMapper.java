package kr.or.ddit.mapper;

import kr.or.ddit.vo.CurriculumVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CurriculumMapper {
    int insertCurriculum(CurriculumVO curriculumVO);

    int updateCurriculum(CurriculumVO curriculumVO);

    CurriculumVO selectCurriculumDetail(Integer curSeq);

    int deleteCurriculum(Integer curSeq);
}