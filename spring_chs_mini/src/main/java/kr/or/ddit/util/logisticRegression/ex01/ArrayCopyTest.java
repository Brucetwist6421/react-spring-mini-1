package kr.or.ddit.util.logisticRegression.ex01;

import java.util.Arrays;

import lombok.extern.slf4j.Slf4j;

/*
System.arraycopy() 메서드는 자바에서 배열의 특정 부분을 다른 배열로 복사할 때 매우 유용하게 사용 됨
이 메서드가 조금 복잡하게 느껴질 수 있지만, 몇 가지 예제를 통해 연습해 보면 금방 익숙해질 수 있을 것임

[System.arraycopy() 메서드의 기본 문법]
public static void arraycopy(Object src, int srcPos, Object dest, int destPos, int length)

src: 원본(소스) 배열입니다. 복사할 데이터가 있는 배열
srcPos: 원본 배열에서 복사를 시작할 위치(인덱스)
dest: 대상(목표) 배열입니다. 복사된 데이터가 저장될 배열
destPos: 대상 배열에서 데이터를 붙여넣기 시작할 위치(인덱스)
length: 원본 배열에서 복사할 요소의 개수
 */
@Slf4j
public class ArrayCopyTest {

	/*연습1 : 배열의 일부를 다른 배열로 복사하기
    * 시나리오:
      원본 배열의 특정 부분을 대상 배열로 복사
      
     목표:
      원본 배열 [10, 20, 30, 40, 50]을 선언합니다.
      대상 배열 [0, 0, 0, 0, 0]을 선언합니다.
      원본 배열의 두 번째 요소(20)부터 시작하여 3개의 요소를 대상 배열의 첫 번째 위치부터 복사
      
     기대 결과:
      대상 배열은 [20, 30, 40, 0, 0]이 될 것임
    */
	public static void main(String[] args) {
		// 실습 1 시작
		// 1. 원본 배열 선언
        int [] sourceArray = {10,20,30,40,50};
        //원본 배열: [10, 20, 30, 40, 50]
        log.info("원본 배열 : " + Arrays.toString(sourceArray));

        // 2. 대상 배열 선언 (충분한 크기로)
        int[] destinationArray = new int[5];
        //대상 배열 (초기): [0, 0, 0, 0, 0]
        log.info("대상 배열(초기) : " + Arrays.toString(destinationArray));

        // 3. System.arraycopy() 사용하여 복사
        // src: sourceArray
        // srcPos: 1 (인덱스 1은 두 번째 요소 20)
        // dest: destinationArray
        // destPos: 0 (인덱스 0부터 시작)
        // length: 3 (3개의 요소 복사: 20, 30, 40)
        System.arraycopy(sourceArray, 1, destinationArray, 0, 3);

        /*
        sourceArray의 인덱스 1 (값 20)부터 3개의 요소(20, 30, 40)를 
           destinationArray의 인덱스 0부터 복사
           
        대상 배열 (복사 후): [20, 30, 40, 0, 0]
         */
        log.info("대상 배열(복사 후) : " + Arrays.toString(destinationArray));
        // 실습 1 끝
	}
}
