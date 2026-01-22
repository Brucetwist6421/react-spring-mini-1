package kr.or.ddit.util.simpleLinearRegression;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class SimpleLinearRegression {

 private double m; // 기울기 (slope)
 private double b; // y절편 (y-intercept)

 /**
  * 훈련 데이터를 사용하여 선형 회귀 모델을 학습합니다.
  * 최소 제곱법(OLS)을 사용하여 기울기(m)와 y절편(b)을 계산합니다.
  *
  * @param dataPoints 훈련에 사용될 데이터 포인트 리스트
  * @throws IllegalArgumentException 데이터 포인트가 부족할 경우 발생
  */
 public void train(List<RegressionDataPoint> dataPoints) {
     if (dataPoints == null || dataPoints.size() < 2) {
         throw new IllegalArgumentException("훈련 데이터 포인트는 최소 2개 이상이어야 합니다.");
     }

     int n = dataPoints.size();
     double sumX = 0;
     double sumY = 0;
     double sumXY = 0;
     double sumX2 = 0;

     // 필요한 합계 계산
     for (RegressionDataPoint dp : dataPoints) {
         sumX += dp.getX();
         sumY += dp.getY();
         sumXY += dp.getX() * dp.getY();
         sumX2 += dp.getX() * dp.getX();
     }
     
     log.info("train->sumX : " + sumX);
     log.info("train->sumY : " + sumY);
     log.info("train->sumXY : " + sumXY);
     log.info("train->sumX2 : " + sumX2);

     // *******기울기 (m) 계산 시작 ///////////////////
     // m = (n * sum(xy) - sum(x) * sum(y)) / (n * sum(x^2) - sum(x)^2)
     double numeratorM = (double) n * sumXY - sumX * sumY;	//분자
     double denominatorM = (double) n * sumX2 - sumX * sumX; //분모

     // 분모가 0이 되는 경우 (모든 x 값이 동일한 경우) 처리
     if (denominatorM == 0) {
         // 모든 x 값이 동일하면 수직선이 되므로, 선형 회귀 모델을 적용할 수 없습니다.
         // 이 경우, 모든 y 값의 평균을 예측하거나 예외를 발생시킬 수 있습니다.
         // 여기서는 예외를 발생시키도록 합니다.
         throw new IllegalArgumentException("모든 X 값이 동일하여 선형 회귀 모델을 생성할 수 없습니다. Y 값을 예측하려면 다른 방법을 사용해야 합니다.");
     }
     m = numeratorM / denominatorM;
     // *******기울기 (m) 계산 끝 ///////////////////

     // *******y절편 (b) 계산 시작 ///////////////
     // b = (sum(y) - m * sum(x)) / n
     b = (sumY - m * sumX) / n;
     // *******y절편 (b) 계산 끝 ///////////////

     log.info("모델 학습 완료:");
     log.info("기울기 (m): %.4f : {}", m);
     log.info("Y절편 (b): %.4f : {}", b);
 }

 /**
  * 학습된 모델을 사용하여 새로운 x 값에 대한 y 값을 예측합니다.
  *
  * @param x 예측할 독립 변수 값
  * @return 예측된 종속 변수 값
  * @throws IllegalStateException 모델이 아직 학습되지 않았을 경우 발생
  */
 public double predict(double x) {
     if (Double.isNaN(m) || Double.isNaN(b)) { // m(기울기) 또는 b(y절편)가 NaN일 수 있으므로 확인
         throw new IllegalStateException("모델이 아직 학습되지 않았습니다. train() 메서드를 먼저 호출하세요.");
     }
     return m * x + b;
 }

/*
 public static void main(String[] args) {

	 SimpleLinearRegression regressor = new SimpleLinearRegression();
     // 훈련 데이터 생성: x와 y의 대략적인 선형 관계가 있는 데이터
     List<RegressionDataPoint> trainingData = new ArrayList<RegressionDataPoint>();
     trainingData.add(new RegressionDataPoint(1, 2));
     trainingData.add(new RegressionDataPoint(2, 3));
     trainingData.add(new RegressionDataPoint(3, 4.5));
     trainingData.add(new RegressionDataPoint(4, 5));
     trainingData.add(new RegressionDataPoint(5, 6.2));
     trainingData.add(new RegressionDataPoint(6, 7));

     System.out.println("훈련 데이터:");
     
     for(RegressionDataPoint dp : trainingData) {
    	 log.info("dp : " + dp );
     }
     
     log.info("===============================");

     try {
         // 모델 학습
    	 regressor.train(trainingData);
    	 log.info("===============================");
         // 새로운 값 예측
    	 double newX1 = 7.0; //독립변수(입력값)
    	 double predictedY1 = regressor.predict(newX1);
    	 System.out.printf("X = %.1f 일 때 예측된 Y 값: %.4f\n", newX1, predictedY1);

    	 double newX2 = 0.5; //독립변수(입력값)
    	 double predictedY2 = regressor.predict(newX1);
    	 System.out.printf("X = %.1f 일 때 예측된 Y 값: %.4f\n", newX2, predictedY2);

    	 
    	 double newX3 = 3.8; //독립변수(입력값)
    	 double predictedY3 = regressor.predict(newX1);
    	 System.out.printf("X = %.1f 일 때 예측된 Y 값: %.4f\n", newX3, predictedY3);

         // 잘못된 데이터로 학습 시도
         // List<RegressionDataPoint> invalidData = new ArrayList<>();
         // invalidData.add(new RegressionDataPoint(10, 20));
         // try {
         //     regressor.train(invalidData); // 예외 발생 예상
         // } catch (IllegalArgumentException e) {
         //     System.out.println("\n오류: " + e.getMessage());
         // }

         // 모든 X 값이 동일한 데이터로 학습 시도
         // List<RegressionDataPoint> sameXData = new ArrayList<>();
         // sameXData.add(new RegressionDataPoint(5, 10));
         // sameXData.add(new RegressionDataPoint(5, 12));
         // sameXData.add(new RegressionDataPoint(5, 15));
         // try {
         //     regressor.train(sameXData); // 예외 발생 예상
         // } catch (IllegalArgumentException e) {
         //     System.out.println("\n오류: " + e.getMessage());
         // }

     } catch (Exception e) {
         System.err.println("오류 발생: " + e.getMessage());
     }
 } */

}