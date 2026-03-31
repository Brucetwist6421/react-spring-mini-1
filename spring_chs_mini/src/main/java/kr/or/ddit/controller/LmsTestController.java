package kr.or.ddit.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.ddit.service.LmsTestService;
import kr.or.ddit.vo.TestScoreVO;
import kr.or.ddit.vo.TestVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "LMS Test API", description = "과목별 시험 등록 및 관리 API")
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class LmsTestController {

    private final LmsTestService testService;

    @Operation(summary = "시험 등록", description = "특정 과목에 귀속되는 새로운 시험 정보를 등록합니다. 상태값은 'A'로 자동 설정됩니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "등록 성공"),
        @ApiResponse(responseCode = "500", description = "서버 내부 오류")
    })
    @PostMapping("/register")
    public ResponseEntity<String> registerTest(@RequestBody TestVO testVO) {
        log.info("Registering new test for subject: {}", testVO.getSubSeq());
        testService.registerTest(testVO);
        return ResponseEntity.ok("시험이 등록되었습니다.");
    }

    @Operation(summary = "과목별 시험 조회", description = "과목 번호(subSeq)를 기준으로 등록된 시험 상세 정보를 조회합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "404", description = "해당 과목에 등록된 시험이 없음")
    })
    @GetMapping("/subject/{subSeq}")
    public ResponseEntity<TestVO> getTestBySubject(
            @Parameter(description = "과목 일련번호", example = "10") 
            @PathVariable int subSeq) {
        
        TestVO test = testService.getTestBySubSeq(subSeq);
        return test != null 
            ? ResponseEntity.ok(test) 
            : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @Operation(summary = "시험 정보 수정", description = "기존 등록된 시험의 명칭, 제한시간, 시작/종료 시간 등을 수정합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "수정 성공"),
        @ApiResponse(responseCode = "404", description = "수정할 시험 대상을 찾을 수 없음")
    })
    @PutMapping("/update")
    public ResponseEntity<String> updateTest(@RequestBody TestVO testVO) {
        log.info("Updating test: {}", testVO.getTestSeq());
        
        // 수정 성공 시 영향받은 행의 수를 체크하도록 Service 구조를 가져간다고 가정
        int result = testService.updateTest(testVO);
        
        return result > 0 
            ? ResponseEntity.ok("시험 정보가 수정되었습니다.") 
            : ResponseEntity.status(HttpStatus.NOT_FOUND).body("수정 대상을 찾을 수 없습니다.");
    }

    @Operation(summary = "시험 삭제 (상태 변경)", description = "시험의 상태(status)를 'D'로 변경하여 논리적으로 삭제 처리합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "삭제 성공"),
        @ApiResponse(responseCode = "404", description = "삭제할 시험 대상을 찾을 수 없음")
    })
    @PatchMapping("/delete/{testSeq}")
    public ResponseEntity<String> deleteTest(
            @Parameter(description = "시험 일련번호", example = "1") @PathVariable int testSeq,
            @Parameter(description = "수정자 ID", example = "admin") @RequestParam String updateId) {
        
        log.info("Soft deleting test: {} by {}", testSeq, updateId);
        
        int result = testService.removeTest(testSeq, updateId);
        
        return result > 0 
            ? ResponseEntity.ok("시험이 삭제 처리되었습니다.") 
            : ResponseEntity.status(HttpStatus.NOT_FOUND).body("삭제 대상을 찾을 수 없습니다.");
    }

    @Operation(summary = "학생별 시험 및 성적 목록 조회", description = "특정 학생이 수강 중인 과정의 모든 시험과 본인의 성적을 조회합니다.")
    @GetMapping("/score/student/{accountSeq}")
    public ResponseEntity<List<TestScoreVO>> getStudentTestScores(
            @PathVariable int accountSeq,
            @RequestParam int curSeq) {
        
        List<TestScoreVO> list = testService.getTestScoresByStudent(accountSeq, curSeq);
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "시험 성적 저장/수정", description = "학생의 시험 점수를 등록하거나 기존 점수를 수정합니다.")
    @PostMapping("/score/save")
    public ResponseEntity<String> saveTestScore(@RequestBody TestScoreVO scoreVO) {
        // resultStatus가 없으면 기본값 'A'로 설정
        if (scoreVO.getResultStatus() == null) {
            scoreVO.setResultStatus("A");
        }
        
        int result = testService.saveStudentScore(scoreVO);
        
        return result > 0 
            ? ResponseEntity.ok("성적이 성공적으로 저장되었습니다.") 
            : ResponseEntity.internalServerError().body("성적 저장에 실패했습니다.");
    }
}