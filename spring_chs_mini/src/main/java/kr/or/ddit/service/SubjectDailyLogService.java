package kr.or.ddit.service;

import java.util.List;

import kr.or.ddit.vo.SubjectDailyLogVO;

public interface SubjectDailyLogService {
    List<SubjectDailyLogVO> getDailyLogList(Integer subSeq, String logDate);
}
