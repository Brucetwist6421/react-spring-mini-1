package kr.or.ddit.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.mapper.CurriculumMapper;
import kr.or.ddit.service.CurriculumService;
import kr.or.ddit.vo.CurriculumVO;
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
}