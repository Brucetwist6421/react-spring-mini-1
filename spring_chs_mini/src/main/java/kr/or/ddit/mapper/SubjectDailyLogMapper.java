package kr.or.ddit.mapper;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.vo.SubjectDailyLogVO;

import java.util.List;
import java.util.Map;

@Mapper
public interface SubjectDailyLogMapper {

    void upsertDailyLog(SubjectDailyLogVO vo);
    
    List<SubjectDailyLogVO> selectDailyLogList(Map<String, Object> params);

    
}