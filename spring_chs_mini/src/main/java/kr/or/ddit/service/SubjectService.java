package kr.or.ddit.service;

import java.util.List;
import kr.or.ddit.vo.SubjectVO;

public interface SubjectService {
    List<SubjectVO> getSubjectsByCurSeq(Integer curSeq);

    int registerSubject(SubjectVO subjectVO);
}