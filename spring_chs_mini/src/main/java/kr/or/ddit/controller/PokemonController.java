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

import kr.or.ddit.service.PokemonService;
import kr.or.ddit.vo.PokemonVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/pokemon")
@RequiredArgsConstructor
@Slf4j
public class PokemonController {

	// 실습 1 시작
    private final PokemonService pokemonService;

    @PostMapping("/createPokemon")
    public ResponseEntity<Map<String, Object>> createPokemon(
            @ModelAttribute PokemonVO pokemonVO,
            @RequestParam(value = "mainImage", required = false) MultipartFile mainImage
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
    @GetMapping("/{id}")
    public ResponseEntity<?> getPokemonDetail(@PathVariable("id") Long id) {
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

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("fileName") String fileName) throws IOException {
        
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
    @PostMapping("/updatePokemon")
    public String updatePokemon(
            @ModelAttribute PokemonVO pokemonVO,
            @RequestParam(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestParam(value = "existingAttachmentIdList", required = false) List<Long> existingAttachmentIdList
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
    @DeleteMapping("/deletePokemon/{id}")
    public ResponseEntity<?> deletePokemon(
            @PathVariable Long id) {
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
    @DeleteMapping("/pokemon/deletePokemons")
    public ResponseEntity<?> deletePokemons(@RequestBody List<Long> idList) {
        int result = pokemonService.deletePokemons(idList);
        if (result == 1) {
            return ResponseEntity.ok("삭제 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("삭제 실패");
        }
    }
    // 실습 6 끝
}