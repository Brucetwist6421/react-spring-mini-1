package kr.or.ddit.service;

import java.util.List;
import kr.or.ddit.vo.SubjectVO;

public interface SubjectService {
    List<SubjectVO> getSubjectsByCurSeq(Integer curSeq);

    int registerSubject(SubjectVO subjectVO);

    int modifySubject(SubjectVO subjectVO);

    /**
     * 과목 논리 삭제 (status -> 'D')
     * @param subSeq 과목 번호
     * @param updateId 수정자 ID
     * @return 수정된 행의 수
     */
    int removeSubject(int subSeq, String updateId);
}