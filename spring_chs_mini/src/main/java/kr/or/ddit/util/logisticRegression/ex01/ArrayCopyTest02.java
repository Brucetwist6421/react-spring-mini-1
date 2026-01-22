package kr.or.ddit.util.logisticRegression.ex01;

import java.util.Arrays;

import lombok.extern.slf4j.Slf4j;

/*
로지스틱 회귀 코드의 System.arraycopy() 사용 방식을 이해해 보자

LogisticRegressionDataPoint 클래스 (또는 predict 메서드)에서 사용된 코드는 다음과 유사함

   System.arraycopy(actualFeatures, 0, featuresWithBias, 1, actualFeatures.length);
   
시나리오:
  actualFeatures(실제 특징들) 배열의 모든 요소를 
  featuresWithBias(절편이 추가된 특징들) 배열의 두 번째 위치부터 복사
  첫 번째 위치([0])는 절편(1.0)을 위해 비워둘 것임

목표:
  actualFeatures 배열 [2.5, 70.0]을 선언
  featuresWithBias 배열을 actualFeatures 길이보다 1 큰 크기로 선언하고, 
     첫 번째 요소([0])에 1.0을 할당합니다.([1.0, 0.0, 0.0])
  actualFeatures의 모든 요소를 featuresWithBias의 
     두 번째 위치(인덱스 1)부터 복사함

기대 결과:
  featuresWithBias 배열은 [1.0, 2.5, 70.0]이 될 것임
*/

@Slf4j
public class ArrayCopyTest02 {
	public static void main(String[] args) {
		// 실습 1 시작
		// 1. 실제 특징 배열 (원본)
        double[] actualFeatures = {2.5, 70.0};
        //actualFeatures (원본): [2.5, 70.0]
        log.info("actualFeatures (원본) : " + Arrays.toString(actualFeatures));

        // 2. 절편이 추가될 특징 배열 (대상)
        // 실제 특징 개수보다 1 큰 크기로 생성
        double[] featuresWithBias = new double[actualFeatures.length+1];
        // 절편 항 (x0)을 첫 번째 위치에 할당
        featuresWithBias[0] = 1.0;
        //featuresWithBias (초기): [1.0, 0.0, 0.0]
        log.info("featuresWithBias (초기) :" + Arrays.toString(featuresWithBias));

        // 3. actualFeatures의 모든 요소를 featuresWithBias의 인덱스 1부터 복사
        // src: actualFeatures
        // srcPos: 0 (actualFeatures의 첫 번째 요소부터 복사 시작)
        // dest: featuresWithBias
        // destPos: 1 (featuresWithBias의 인덱스 1부터 붙여넣기 시작)
        // length: actualFeatures.length (actualFeatures의 모든 요소를 복사)
        System.arraycopy(actualFeatures, 0, featuresWithBias, 1, actualFeatures.length);
        
        //actualFeatures 배열의 전체 내용을 
        //featuresWithBias 배열의 첫 번째 요소(절편) 다음부터 채워 넣는 역할을 합
        //featuresWithBias (복사 후): [1.0, 2.5, 70.0]
        log.info("featuresWithBias (복사 후 ) :" + Arrays.toString(featuresWithBias));
        // 실습 1 끝
	}
}
