package kr.or.ddit.service.impl;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Override
    @Transactional // 등록 작업이므로 트랜잭션 보장
    public int registerSubject(SubjectVO subjectVO) {
        // 기본값 설정 등이 필요할 경우 여기서 처리 (예: 상태가 없으면 '운영중'으로 설정)
        if(subjectVO.getStatus() == null) {
            subjectVO.setStatus("운영중");
        }
        return subjectMapper.insertSubject(subjectVO);
    }

    @Override
    @Transactional
    public int modifySubject(SubjectVO subjectVO) {
        // 실제 운영 환경이라면 세션에서 로그인한 사용자 ID를 가져와 세팅하는 것이 좋습니다.
        // subjectVO.setUpdateId("ADMIN"); 
        return subjectMapper.updateSubject(subjectVO);
    }
}