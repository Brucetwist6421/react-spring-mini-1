package kr.or.ddit.service.impl;

import java.util.List;
import org.springframework.stereotype.Service;
import kr.or.ddit.mapper.SubjectMapper;
import kr.or.ddit.service.SubjectService;
import kr.or.ddit.vo.SubjectVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectMapper subjectMapper;

    @Override
    public List<SubjectVO> getSubjectsByCurSeq(Integer curSeq) {
        return subjectMapper.getSubjectsByCurSeq(curSeq);
    }
}