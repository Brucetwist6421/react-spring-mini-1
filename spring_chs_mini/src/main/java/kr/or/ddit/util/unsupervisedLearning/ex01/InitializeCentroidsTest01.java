package kr.or.ddit.util.unsupervisedLearning.ex01;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class InitializeCentroidsTest01 {

	// 실습 1 시작
	private static Random random = new Random();

	public static void main(String[] args) {
		List<Integer> usedIndices = new ArrayList<>();
		for (int i = 0; i < 10; i++) {
			int randomIndex;

			do {
				randomIndex = random.nextInt(12);
				System.out.println("randomIndex : " + randomIndex);
			} while (usedIndices.contains(randomIndex));

			usedIndices.add(randomIndex);
		}
		usedIndices.forEach(System.out::println);
	}
	// 실습 1 끝
}
