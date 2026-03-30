package kr.or.ddit.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.ddit.service.SubjectService;
import kr.or.ddit.vo.SubjectVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Subject", description = "과목 관련 API")
@Slf4j
@RestController
@RequestMapping("/api/subject")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @Operation(summary = "과정별 과목 목록 조회", description = "특정 교육과정(curSeq)에 포함된 모든 과목 리스트를 가져옵니다.")
    @GetMapping("/curriculum/{curSeq}")
    public ResponseEntity<List<SubjectVO>> getSubjectsByCurriculum(
            @Parameter(description = "과정 시퀀스") @PathVariable Integer curSeq) {
        
        log.info("SubjectController - Fetching subjects for curSeq: {}", curSeq);
        List<SubjectVO> subjects = subjectService.getSubjectsByCurSeq(curSeq);
        
        return ResponseEntity.ok(subjects);
    }

    @Operation(summary = "새로운 과목 등록", description = "특정 과정에 귀속되는 새로운 과목을 생성합니다.")
    @PostMapping("/register")
    public ResponseEntity<Integer> registerSubject(@RequestBody SubjectVO subjectVO) {
        log.info("Registering new subject: {}", subjectVO.getSubName());
        
        // 성공 시 생성된 subSeq를 반환하도록 설계 (RESTful)
        int result = subjectService.registerSubject(subjectVO);
        
        return result > 0 
            ? ResponseEntity.status(HttpStatus.CREATED).body(subjectVO.getSubSeq()) 
            : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @Operation(summary = "과목 정보 수정", description = "기존 과목의 이름, 기간, 상태, 담당 교수를 수정합니다.")
    @PutMapping("/update")
    public ResponseEntity<String> updateSubject(@RequestBody SubjectVO subjectVO) {
        log.info("Updating subject: {}", subjectVO.getSubSeq());
        
        // 수정 성공 시 1(행의 수)이 반환됩니다.
        int result = subjectService.modifySubject(subjectVO);
        
        return result > 0 
            ? ResponseEntity.ok("수정 성공") 
            : ResponseEntity.status(HttpStatus.NOT_FOUND).body("수정 대상을 찾을 수 없습니다.");
    }
}