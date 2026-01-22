package kr.or.ddit.util.logisticRegression;

import java.util.Arrays;

//훈련 데이터를 나타내는 클래스 (여러 독립 변수와 이진 종속 변수)
public class LogisticRegressionDataPoint {
 private double[] features; // 독립 변수들 (x1, x2, ...)(예: 공부 시간, 수업 참석률)
 private int label;         // 종속 변수 (0 또는 1)(예: 시험 통과 여부 0 또는 1)

 // 절편(bias) 항을 위해 첫 번째 특징은 항상 1.0으로 가정합니다.
 // 즉, features 배열의 0번째 인덱스는 항상 1.0 (bias)이 되고,
 // 실제 특징은 1번째 인덱스부터 시작합니다.
 public LogisticRegressionDataPoint(double[] actualFeatures, int label) {
	 /*
	 features : 모델에 입력될 독립 변수들의 배열입니다. 
	 			로지스틱 회귀에서는 일반적으로 절편(bias) 항을 포함하기 위해 첫 번째 요소에 상수 1.0을 추가
	 			main 메서드에서 trainingData를 생성할 때 new double[]{2.5, 70.0}과 같이 실제 독립 변수만 넘겨주면, 
	 			LogisticRegressionDataPoint 생성자에서 자동으로 
	 			[1.0, 2.5, 70.0]과 같은 형태로 변환하여 저장
	 label : 해당 데이터 포인트의 실제 클래스를 나타내는 종속 변수입니다. 이진 분류이므로 0 또는 1의 값을 가집
	  */
	 // 첫 번째 특징으로 절편(bias)을 위한 1.0을 추가합니다.
     // 실제 특징 개수보다 하나 더 큰 배열을 만듭니다.
     this.features = new double[actualFeatures.length + 1];
     this.features[0] = 1.0; // 절편 항 (bias term), 절편을 위한 상수 항 (x0 = 1)
     System.arraycopy(actualFeatures, 0, this.features, 1, actualFeatures.length);
     this.label = label;
 }

 public double[] getFeatures() {
     return features;
 }

 public int getLabel() {
     return label;
 }

 @Override
 public String toString() {
     return "Features: " + Arrays.toString(features) + ", Label: " + label;
 }
}
