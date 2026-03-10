package kr.or.ddit.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import kr.or.ddit.mapper.SubjectDailyLogMapper;
import kr.or.ddit.service.SubjectDailyLogService;
import kr.or.ddit.vo.SubjectDailyLogVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubjectDailyLogServiceImpl implements SubjectDailyLogService {
    private final SubjectDailyLogMapper mapper;

    @Override
        public List<SubjectDailyLogVO> getDailyLogList(Integer subSeq, String logDate) {
        Map<String, Object> params = new HashMap<>();
        params.put("subSeq", subSeq);
        params.put("logDate", logDate);
        return mapper.selectDailyLogList(params);
    }
}