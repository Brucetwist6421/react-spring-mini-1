package kr.or.ddit.controller;


import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.ddit.service.PokemonService;
import kr.or.ddit.vo.FavoriteVO;
import kr.or.ddit.vo.PokemonVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Pokemon", description = "포켓몬 관련 API")
@RestController
@RequestMapping("/pokemon")
@RequiredArgsConstructor
@Slf4j
public class PokemonController {

	// 실습 1 시작
    private final PokemonService pokemonService;

    // 즐겨찾기 확인
    @Operation(summary = "즐겨찾기 확인", description = "특정 사용자가 특정 포켓몬을 즐겨찾기에 추가했는지 확인합니다.")
    @GetMapping("/favoriteCheck")
    public ResponseEntity<Map<String, Object>> checkFavorite(
            @RequestParam("userId") String userId,
            @RequestParam("pokemonId") Long pokemonId
    ) {
        Map<String, Object> resultMap = new HashMap<>();
        
        try {
            log.info("checkFavorite -> userId: {}, pokemonId: {}", userId, pokemonId);
            
            // FavoriteVO 객체에 담아 서비스로 전달 (혹은 파라미터로 직접 전달 가능)
            FavoriteVO vo = new FavoriteVO();
            vo.setUserId(userId);
            vo.setPokemonId(pokemonId);
            
            // 서비스에서 count 등을 활용해 존재 여부 확인
            boolean isFavorite = pokemonService.isFavorite(vo);
            
            resultMap.put("isFavorite", isFavorite);
            return ResponseEntity.ok(resultMap);
            
        } catch (Exception e) {
            log.error("즐겨찾기 확인 중 오류 발생", e);
            resultMap.put("isFavorite", false);
            resultMap.put("message", "상태 확인 실패");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

    @Operation(summary = "즐겨찾기 목록 조회", description = "특정 사용자가 즐겨찾기에 추가한 포켓몬 목록을 조회합니다.")
    @GetMapping("/favoriteList")
    public ResponseEntity<List<FavoriteVO>> getFavoritePokemonList(
        @RequestParam(value = "userId", required = false, defaultValue = "GUEST_USER") String userId
    ) {
        try {
            log.info("getFavoritePokemonList -> userId: {}", userId);
            // 서비스에서 즐겨찾기 여부가 포함된 리스트를 가져옴
            List<FavoriteVO> favoriteList = pokemonService.getFavoritePokemonList(userId);
            
            return ResponseEntity.ok(favoriteList);
            
        } catch (Exception e) {
            log.error("리스트 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Operation(summary = "포켓몬 생성", description = "새로운 포켓몬을 생성합니다. (이미지 및 첨부파일 포함)")
    @PostMapping("/createPokemon")
    public ResponseEntity<Map<String, Object>> createPokemon(
            @Parameter(description = "포켓몬 정보") @ModelAttribute PokemonVO pokemonVO,
            @Parameter(description = "메인 이미지") @RequestParam(value = "mainImage", required = false) MultipartFile mainImage
    ) {
        Map<String, Object> resultMap = new HashMap<>();

        try {
            log.info("createPokemon -> pokemonVO : {}", pokemonVO);

            if (mainImage != null && !mainImage.isEmpty()) {
                log.info("createPokemon -> mainImage : {}", mainImage.getOriginalFilename());
            }

            List<MultipartFile> uploaded = pokemonVO.getAttachmentFiles();
            if (uploaded != null && !uploaded.isEmpty()) {
                log.info("createPokemon -> attachmentFiles : {}", uploaded.size());
            }

            // 실제 생성 서비스 호출
            pokemonService.createPokemon(pokemonVO, mainImage);
            log.info("createPokemon -> id : {}", pokemonVO.getId());

            // 성공 시 201 Created
            resultMap.put("id", pokemonVO.getId());
            resultMap.put("message", "포켓몬이 성공적으로 생성되었습니다.");
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(resultMap);

        } catch (IllegalArgumentException e) {
            // 유효하지 않은 요청 데이터 등 → 400 Bad Request
            log.error("잘못된 요청 데이터: {}", e.getMessage(), e);
            resultMap.put("message", "잘못된 요청 데이터입니다.");
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(resultMap);

        } catch (Exception e) {
            // 서버 내부 오류 → 500 Internal Server Error
            log.error("포켓몬 생성 중 오류 발생", e);
            resultMap.put("message", "서버 내부 오류가 발생했습니다.");
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(resultMap);
        }
    }
    // 실습 1 끝

    @Operation(summary = "포켓몬 목록 조회", description = "모든 포켓몬의 목록을 조회합니다.")  
     @GetMapping("/list")
    public ResponseEntity<?> getPokemonList() {
        List<PokemonVO> pokemonList = pokemonService.getPokemonList();
        if (pokemonList == null || pokemonList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(Map.of("message", "해당 포켓몬이 존재하지 않습니다."));
        }
        return ResponseEntity.ok(pokemonList);
    }
    
    // 실습 2 시작
    @Operation(summary = "포켓몬 상세 조회", description = "특정 포켓몬의 상세 정보를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<?> getPokemonDetail(@Parameter(description = "포켓몬 ID") @PathVariable("id") Long id) {
        PokemonVO pokemon = pokemonService.getPokemonDetail(id);
        if (pokemon == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(Map.of("message", "해당 포켓몬이 존재하지 않습니다."));
        }
        return ResponseEntity.ok(pokemon);
    }
    // 실습 2 끝
    
    // 실습 3 시작
    // @GetMapping("/download/{fileName:.+}")
    // public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) throws IOException {
    //     String decodedFileName = URLDecoder.decode(fileName, "UTF-8");
    //     Path path = Paths.get("C:/upload").resolve(decodedFileName).normalize();
    //     Resource resource = new UrlResource(path.toUri());

    //     if (!resource.exists()) {
    //         throw new FileNotFoundException(decodedFileName + " not found");
    //     }

    //     return ResponseEntity.ok()
    //             .contentType(MediaType.APPLICATION_OCTET_STREAM)
    //             .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + decodedFileName + "\"")
    //             .body(resource);
    // }
    // 실습 3 끝

    @Operation(summary = "파일 다운로드", description = "포켓몬과 관련된 파일을 다운로드합니다. 파일명이 URL 인코딩되어 전달됩니다.")
    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@Parameter(description = "다운로드할 파일명") @PathVariable("fileName") String fileName) throws IOException {
        
        // 1. 핵심: 이미 Spring이 @PathVariable로 받으면서 디코딩을 수행합니다. 
        // 중복 디코딩(URLDecoder.decode)은 파일명을 깨뜨릴 수 있으므로 제거하거나 주의해야 합니다.
        log.info("수신된 파일명: {}", fileName);

        // 2. 경로 조합 (FileConfig와 동일한 기본 경로 사용)
        Path path = Paths.get("/home/ubuntu/upload").resolve(fileName).normalize();
        log.info("실제 탐색 경로: {}", path.toAbsolutePath());

        Resource resource = new UrlResource(path.toUri());

        // 3. 파일 존재 및 읽기 권한 확인
        if (!resource.exists() || !resource.isReadable()) {
            log.error("파일이 존재하지 않거나 읽을 수 없습니다: {}", path.toAbsolutePath());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // 4. 한글 파일명 다운로드 시 깨짐 방지 (UTF-8 인코딩)
        String encodedFileName = UriUtils.encode(fileName, StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFileName + "\"")
                .body(resource);
    }
    
    // 실습 4 시작
    @Operation(summary = "포켓몬 수정", description = "기존 포켓몬의 정보를 수정합니다. (이미지 및 첨부파일 포함)")
    @PostMapping("/updatePokemon")
    public String updatePokemon(
            @Parameter(description = "포켓몬 정보") @ModelAttribute PokemonVO pokemonVO,
            @Parameter(description = "메인 이미지") @RequestParam(value = "mainImage", required = false) MultipartFile mainImage,
            @Parameter(description = "기존 첨부파일 ID 목록") @RequestParam(value = "existingAttachmentIdList", required = false) List<Long> existingAttachmentIdList
    ) {
    	List<MultipartFile> uploaded = pokemonVO.getAttachmentFiles();
//        System.out.println("폼데이터 수신 완료: " + pokemonVO);
        log.info("updatePokemon->pokemonVO : {}", pokemonVO);
        if (mainImage != null && !mainImage.isEmpty()) {
            log.info("updatePokemon->mainImage : {}", mainImage);
        }
        if (uploaded != null && !uploaded.isEmpty()) {
        	log.info("updatePokemon->attachmentFiles : {}", uploaded);
        }
        if (existingAttachmentIdList != null && !existingAttachmentIdList.isEmpty()) {
        	log.info("updatePokemon->existingAttachmentIdList : {}", existingAttachmentIdList);
        }
        pokemonService.updatePokemon(pokemonVO, mainImage, existingAttachmentIdList);
        return "success";
    }
    // 실습 4 끝
    
    // 실습 5 시작
    @Operation(summary = "포켓몬 삭제", description = "특정 포켓몬을 삭제합니다.")
    @DeleteMapping("/deletePokemon/{id}")
    public ResponseEntity<?> deletePokemon(
            @Parameter(description = "삭제할 포켓몬 ID") @PathVariable Long id) {
        log.info("deletePokemon->id : {}", id);
        int result = pokemonService.deletePokemon(id);
        if (result == 1) {
            return ResponseEntity.ok("삭제 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("삭제 실패");
        }
    }
    // 실습 5 끝
    
    // 실습 6 시작
    @Operation(summary = "포켓몬 일괄 삭제", description = "여러 포켓몬을 한 번에 삭제합니다. ID 목록을 전달받아 처리합니다.")
    @DeleteMapping("/deletePokemons")
    public ResponseEntity<?> deletePokemons(@Parameter(description = "삭제할 포켓몬 ID 목록") @RequestBody List<Long> idList) {
        int result = pokemonService.deletePokemons(idList);
        if (result == 1) {
            return ResponseEntity.ok("삭제 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("삭제 실패");
        }
    }
    // 실습 6 끝

    //즐겨찾기 토글
    @Operation(summary = "즐겨찾기 토글", description = "특정 포켓몬에 대해 즐겨찾기 상태를 토글합니다. (추가/제거)")
    @PostMapping("/toggleFavorite")
    public ResponseEntity<Map<String, Object>> toggleFavorite(
            @Parameter(description = "즐겨찾기 정보") @RequestBody FavoriteVO favoriteVO
            /* , @AuthenticationPrincipal CustomUser user */ // 나중에 인증 도입 시 사용
    ) {
        Map<String, Object> resultMap = new HashMap<>();
        
        // 임시로 userId를 1로 고정 (나중에 세션/토큰에서 가져옴)
        if(favoriteVO.getUserId() == null) favoriteVO.setUserId("admin");

        try {
            boolean isFavorite = pokemonService.toggleFavorite(favoriteVO);
            
            resultMap.put("isFavorite", isFavorite);
            resultMap.put("message", isFavorite ? "즐겨찾기에 추가되었습니다." : "즐겨찾기에서 제거되었습니다.");
            
            return ResponseEntity.ok(resultMap);
        } catch (Exception e) {
            log.error("즐겨찾기 토글 중 오류 발생", e);
            resultMap.put("message", "처리에 실패했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

    
}