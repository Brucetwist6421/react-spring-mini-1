package kr.or.ddit.controller;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class GeminiController {

	// 실습 1 시작
	/*
	 * 비동기 요청URI : /geminiApi 요청파라미터 : JSON String{"geminiApiKey":afsdlkfsjad} 요청방식
	 * : post
	 */
	@ResponseBody
	@PostMapping("/geminiApi")
	public Map<String, Object> geminiApi(@RequestBody Map<String, Object> map, HttpSession session) {
		log.info("geminiPai ->map :" + map);

		if (map.get("geminiApiKey") != null) {
			session.setAttribute("geminiApiKey", map.get("geminiApiKey").toString());

			map.put("result", "success");

		} else {
			map.put("result", "failed");
		}
		return map;
	}

	// 실습 1 끝

	// 실습 2 시작
	@ResponseBody
	@PostMapping("/geminiApiPost")
	public String geminiApiPost(@RequestBody Map<String, Object> map, HttpSession session) {
		log.info("geminiApiPost->map" + map);

		String geminiApiKey = (String) session.getAttribute("geminiApiKey");

		log.info("geminiApiPost->geminiApiKey" + geminiApiKey);
		// 세션에 담긴 제미나이 API 키 비동기로 넘어온 검색어
		if (geminiApiKey != null && map.get("txtGeminiSearch") != null) {
			String txtGeminiSearch = map.get("txtGeminiSearch").toString();
			log.info("geminiApiPost->txtGeminiSearch" + txtGeminiSearch);

			// 1) 보통 SDK에서 제공하는 정형화된 사용 패턴
			// Client.builder() : Client를 편리하게 구성하기 위한 Builder를 반환
			// 어떤 객체(Client)를 만들 때 한 번에 new 해서 다 넣기 복잡하다
			// 그럴 때 차곡차곡 옵션을 쌓아가다가 마지막에 build()로 완성하는 방식이 Builder 패턴이다.
			// 예시 : Client client = new Client("my-api-key", "https://api.example.com", 30,
			// true, ... );
			// 빌더 패턴
			/*
			 * Client client = Client.builder() .apiKey("my-api-key") // API 키 지정
			 * .endpoint("https://api.example.com") // 엔드포인트 지정 .timeout(30) // 타임아웃 30초
			 * .build(); // 최종 Client 완성
			 */

			// 2) apiKey(geminiApiKey) : 인증 관련 설정을 Builder에 저장
			// - geminiApiKey 값을 Builder 내부 필드에 저장
			// - 내부적으로 null/빈값 체크 or 포맷 체크를 할 수도 있음
			// - 보안상, 절대 로그로 평문 출력하지 말 것
			// - (일부 SDK는 credentials 객체나 provider를 사용하도록 권장함)
			Client client = Client.builder().apiKey(geminiApiKey) // (1) 인증정보 설정: 문자열 API 키를 전달
					// .endpoint("https://api.gemini.example") // (선택) 엔드포인트 지정
					// .timeout(Duration.ofSeconds(10)) // (선택) 타임아웃 설정
					// .httpClient(customHttpClient) // (선택) 내부 HttpClient 교체
					.build(); // (2) 모든 설정 검증 후 실제 Client 인스턴스 생성

			// 4) 모델에 요청하여 결과 생성
	        // - 첫 번째 파라미터: 모델 이름
	        // - 두 번째 파라미터: 프롬프트 (검색어/내용)
	        // - 세 번째 파라미터: 추가 옵션 (현재 null)
	        GenerateContentResponse response = client.models.generateContent(
	                "gemini-2.5-flash",
	                txtGeminiSearch,
	                null
	        );

	        log.info("gemini response: " + response.text());

	        // 5) 클라이언트에 결과 반환
	        return response.text(); // JSON, 문자열 등 SDK에 따라 반환 형태 다름
	    }

	    // 6) 예외 처리 또는 기본 반환값
	    return "API 키가 없거나 검색어가 비어 있습니다.";

	}

	// 실습 2 끝

}
