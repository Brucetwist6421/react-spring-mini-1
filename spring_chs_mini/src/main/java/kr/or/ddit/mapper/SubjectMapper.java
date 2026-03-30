package kr.or.ddit.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import kr.or.ddit.vo.SubjectVO;

@Mapper
public interface SubjectMapper {
    List<SubjectVO> getSubjectsByCurSeq(Integer curSeq);

    int insertSubject(SubjectVO subjectVO);

    int updateSubject(SubjectVO subjectVO);

    int deleteSubjectStatus(SubjectVO subjectVO);
}