package kr.or.ddit.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.or.ddit.mapper.LmsDashboardMapper;
import kr.or.ddit.service.LmsDashboardService;
import kr.or.ddit.vo.LmsDashboardVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LmsDashboardServiceImpl implements LmsDashboardService{
    private final LmsDashboardMapper dashboardMapper;

    @Override
    public List<LmsDashboardVO> getLmsDashboardStats(String year) {
        return dashboardMapper.selectLmsDashboardStats(year);
    }
    
}
