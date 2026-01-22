package kr.or.ddit.util.logisticRegression.ex01;

import java.util.Arrays;

import lombok.extern.slf4j.Slf4j;

/* 연습 3: 동일한 배열 내에서 복사하기
 * System.arraycopy()는 원본과 대상 배열이 같아도 작동함.
 *  배열 내에서 요소들을 이동시킬 때 유용하게 쓰일 수 있음
 * 
 * 시나리오:
      배열 [1, 2, 3, 4, 5]가 있음. 이 배열의 첫 3개 요소를 배열 내에서 2칸 뒤로 이동시켜보자

   목표:
      myArray 배열 [1, 2, 3, 4, 5]를 선언함
      myArray의 인덱스 0부터 3개의 요소를 myArray의 인덱스 2부터 복사함

   기대 결과:
      myArray는 [1, 2, 1, 2, 3]이 될 것임 (이동 후 겹치는 부분이 어떻게 되는지 확인)
 */
@Slf4j
public class ArrayCopyTest03 {
	/*
	   이 예제에서는 원본과 대상 배열이 동일함. 
	   [1, 2, 3]이 [1, 2, (1), (2), (3)]과 같이 겹치면서 복사됨
	   
	   각 매개변수가 무엇을 의미하는지, 그리고 어떤 결과를 가져올지 생각하면서 코드를 직접 실행해 보는 것이 중요함
	    */
	   public static void main(String[] args) {
	        // 실습 1 시작
		   int[] myArray = {1,2,3,4,5};
		   log.info("원본 배열 :" + Arrays.toString(myArray));
	        // myArray의 인덱스 0부터 3개의 요소 (1, 2, 3)를
	        //    myArray의 인덱스 2부터 붙여넣기
	        
	        // src: myArray
	        // srcPos: 0
	        // dest: myArray
	        // destPos: 2
	        // length: 3
		   System.arraycopy(myArray, 0, myArray, 2, 3);
	       
		   log.info("복사 후 배열 :" + Arrays.toString(myArray));
		   // 실습 1 끝
	        
	    }
}
