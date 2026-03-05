package kr.or.ddit.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.ddit.service.CurriculumService;
import kr.or.ddit.vo.CurriculumVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Curriculum", description = "교육과정 관련 API")
@Slf4j
@RestController
@RequestMapping("/api/curriculum")
@RequiredArgsConstructor
public class CurriculumController {

    private final CurriculumService curriculumService;


    @Operation(summary = "교육과정 단건 상세 조회", description = "특정 일련번호의 교육과정 상세 정보를 가져옵니다.")
    @GetMapping("/{curSeq}")
    public ResponseEntity<CurriculumVO> getCurriculumDetail(@Parameter(description = "과정 시퀀스") @PathVariable Integer curSeq) {
        CurriculumVO detail = curriculumService.getCurriculumDetail(curSeq);
        return detail != null ? ResponseEntity.ok(detail) : ResponseEntity.notFound().build();
    }

    @Operation(summary = "교육과정 등록", description = "새로운 교육과정을 등록합니다.")
    @PostMapping("/register")
    public ResponseEntity<?> register(@Parameter(description = "교육과정 정보") @RequestBody CurriculumVO curriculumVO) {
        try {
            int result = curriculumService.insertCurriculum(curriculumVO);
            if (result > 0) {
                // 성공 시 로직
                log.info("교육과정 등록 성공!");
                return ResponseEntity.ok("등록되었습니다.");
            } else {
                // 실패 시 로직 (사실 DB 에러가 나면 Exception이 먼저 발생하므로 이 케이스는 드뭅니다)
                log.error("등록된 행이 없습니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("등록에 실패했습니다.");
            }
        } catch (Exception e) {
            log.error("교육과정 등록 중 오류가 발생했습니다.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("등록에 실패했습니다.");
        }
    }

    @Operation(summary = "교육과정 수정", description = "기존 교육과정 정보를 업데이트합니다.")
    @PutMapping("/update")
    public ResponseEntity<?> updateCurriculum(@Parameter(description = "교육과정 정보") @RequestBody CurriculumVO curriculumVO) {
        int result = curriculumService.updateCurriculum(curriculumVO);
        if (result > 0) {
            return ResponseEntity.ok("수정 성공");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수정 실패");
    }

    @Operation(summary = "교육과정 삭제 (상태 변경)", description = "교육과정의 상태를 'D'로 변경하여 삭제 처리합니다.")
    @PatchMapping("/delete/{curSeq}")
    public ResponseEntity<?> deleteCurriculum(
            @Parameter(description = "삭제할 과정 시퀀스") @PathVariable Integer curSeq) {
        
        // 수정자 정보를 위해 세션이나 토큰에서 가져온 ID를 넘겨줄 수도 있습니다.
        int result = curriculumService.deleteCurriculum(curSeq);
        
        if (result > 0) {
            return ResponseEntity.ok("삭제 성공");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 실패");
    }
}