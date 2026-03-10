package kr.or.ddit.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.mapper.CurriculumMapper;
import kr.or.ddit.service.CurriculumService;
import kr.or.ddit.vo.CurriculumVO;
import kr.or.ddit.vo.SubjectVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CurriculumServiceImpl implements CurriculumService {

    private final CurriculumMapper curriculumMapper;

    @Override
    @Transactional
    public int insertCurriculum(CurriculumVO curriculumVO) {
        curriculumVO.setStatus("A");
        return curriculumMapper.insertCurriculum(curriculumVO);
    }

    @Override
    public int updateCurriculum(CurriculumVO curriculumVO) {
        return curriculumMapper.updateCurriculum(curriculumVO);
    }

    @Override
    public CurriculumVO getCurriculumDetail(Integer curSeq) {
        return curriculumMapper.selectCurriculumDetail(curSeq);
    }

    @Override
    @Transactional
    public int deleteCurriculum(Integer curSeq) {
        // 필요 시 여기서 추가적인 비즈니스 로직(하위 데이터 체크 등)을 수행할 수 있습니다.
        return curriculumMapper.deleteCurriculum(curSeq);
    }

    @Override
    public List<SubjectVO> getSubjectList(Integer curSeq) {
        return curriculumMapper.selectSubjectListByCurSeq(curSeq);
    }
}