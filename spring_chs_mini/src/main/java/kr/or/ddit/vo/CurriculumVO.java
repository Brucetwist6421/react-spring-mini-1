package kr.or.ddit.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurriculumVO {
    private Integer curSeq;        // 교육과정 일련번호 (PK)
    private String room;           // 강의실
    private Integer term;          // 기간/기수
    private Integer manCount;      // 인원수
    private LocalDate startDate;   // 시작일
    private LocalDate endDate;     // 종료일
    private String curName;        // 교육과정명
    private Integer accountSeq;    // 담당자 일련번호
    private String businessName;   // 업체명
}