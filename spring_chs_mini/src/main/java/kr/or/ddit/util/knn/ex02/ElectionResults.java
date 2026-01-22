package kr.or.ddit.util.knn.ex02;

import java.util.HashMap;
import java.util.Map;

/*
이 예시를 통해 getOrDefault() 메서드가 어떻게 코드를 간결하게 만들고, 
null 포인터 예외를 방지하면서 맵의 값을 안전하게 업데이트하는지 이해하실 수 있음
 */
public class ElectionResults {
	public static void main(String[] args) {
		// 실습 1 시작
		// 각 후보의 득표수를 저장할 Map을 선언합니다.
	    // 각 후보의 이름을 String 키로, 득표수를 Integer 값으로 저장하는 HashMap을 생성
		Map<String, Integer> candidateVotes = new HashMap<String, Integer>();
	    // 투표를 진행합니다.
	    /*
	    김철수 후보에게 득표합니다.
	     candidateVotes.getOrDefault("김철수", 0) : 
	          candidateVotes 맵에서 "김철수" 키에 해당하는 값을 찾습니다.
	    만약, "김철수" 키가 존재하면 해당 키의 현재 값을 반환
	    만약, "김철수" 키가 존재하지 않으면 두 번째 인자인 0을 기본값으로 반환합니다.
	          여기에 + 1을 하여 득표수를 증가
	    candidateVotes.put(...): 이렇게 계산된 새로운 값을 "김철수" 키에 다시 저장
	    */
		candidateVotes.put("김철수", candidateVotes.getOrDefault("김철수", 0) + 1);
		System.out.println("김철수 투표 후 : " + candidateVotes);
	    // 이영희 후보에게 득표합니다. (새로운 후보)
		candidateVotes.put("이영희", candidateVotes.getOrDefault("이영희", 0) + 1);
		System.out.println("이영희 투표 후 : " + candidateVotes);
	    // 김철수 후보에게 다시 득표합니다.
		candidateVotes.put("김철수", candidateVotes.getOrDefault("김철수", 0) + 1);
		System.out.println("김철수 투표 후 : " + candidateVotes);
	    // 박찬호 후보에게 득표합니다. (새로운 후보)
		candidateVotes.put("박찬호", candidateVotes.getOrDefault("박찬호", 0) + 1);
		System.out.println("박찬호 투표 후 : " + candidateVotes);
	    // 최종 득표 결과 출력
		System.out.println("\n--- 최종 투표 결과 ---");
		// for 문에서 Map 데이터 뽑기
		for(Map.Entry<String, Integer> entry : candidateVotes.entrySet()) {
			System.out.println(entry.getKey() + " : " + entry.getValue() + "표");
		}
		// 실습 1 끝
		
		// 실습 2 시작
	    // 특정 후보의 득표수 조회 (없는 후보의 경우 0표로 표시)
		String searchCandidate1 = "김철수";
		System.out.println("\n" + searchCandidate1 + "의 득표수 : "
							+ candidateVotes.getOrDefault(searchCandidate1, 0) + "표");
	    // 맵에 없는 후보
		String searchCandidate2 = "최민수";
		System.out.println("\n" + searchCandidate2 + "의 득표수 : "
							+ candidateVotes.getOrDefault(searchCandidate2, 0) + "표");
		// 실습 2 끝
	}
}
