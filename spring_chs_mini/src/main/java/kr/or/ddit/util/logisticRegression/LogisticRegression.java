package kr.or.ddit.util.logisticRegression;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

//Component : 서버를 기동 시 스프링이 자바빈 객체로 생성해줌
@Slf4j
@Component
public class LogisticRegression {

	/*
	역할: 로지스틱 회귀 모델의 계수(coefficient) 또는 가중치(weights)를 저장하는 배열입니다.
		이 가중치들은 모델이 데이터를 통해 학습하면서 최적화됩니다. 
		b0 (절편), b1 (첫 번째 특징의 계수), b2 (두 번째 특징의 계수) 등을 포함
	 */
    private double[] weights; // 모델의 계수 (b0, b1, b2, ...)
    /*
    역할: 모델이 사용하는 전체 특징의 개수를 나타냅니다.
		이는 실제 독립 변수의 개수에 절편 항(bias term)을 위한 1을 더한 값입니다. 
		예를 들어, 공부 시간과 참석률 두 가지 특징을 사용한다면 numFeatures는 2 + 1 = 3이 됩니다 (b0, b1, b2).
     */
    private int numFeatures;  // 특징의 개수 (절편 포함)

    /** 생성자 
     * 로지스틱 회귀 모델을 초기화합니다.
     * @param numActualFeatures 실제 독립 변수의 개수 (절편 제외), 
     * 		  사용자가 제공하는 실제 독립 변수의 개수입니다 (예: 공부 시간, 수업 참석률이 각각 1개이므로 총 2개).
     */
    public LogisticRegression(
    		@Value("${logistic.numActualFeatures}") int numActualFeatures) {
    	//생성자 내부에서는 numFeatures를 numActualFeatures + 1로 설정하여 
    	//		절편 항을 위한 공간을 확보
        this.numFeatures = numActualFeatures + 1; // 절편 항을 위해 +1
        //weights 배열은 이 numFeatures 크기로 초기화되며, 
        //		모든 가중치는 0.0으로 시작함. 학습이 진행되면서 이 값들이 조정됨
        this.weights = new double[this.numFeatures];
        // 계수들을 작은 임의의 값으로 초기화하거나 0으로 초기화할 수 있음
        // 여기서는 0으로 초기화 함.
        Arrays.fill(weights, 0.0);
    }

    /**
     * 로지스틱 회귀의 핵심인 시그모이드 함수를 계산함
     * P(y=1|x) = 1 / (1 + e^(-z))
     * @param z 선형 조합 결과. (b0 + b1*x1 + b2*x2 + ...)의 결과 값
     * @return 0과 1 사이의 확률 값
     *  시그모이드 함수는 어떤 실수 z 값을 받아서 항상 0과 1 사이의 값으로 변환해줌.
     *  이 0과 1 사이의 값은 특정 클래스(여기서는 y=1)에 속할 확률로 해석됨.
     *  함수의 그래프는 'S'자 형태를 띠기 때문에 'S-커브'라고도 불림
     */
    private double sigmoid(double z) {
        return 1.0 / (1.0 + Math.exp(-z));
    }

    /**
     * 주어진 데이터 포인트와 현재 가중치로 선형 조합 z를 계산합니다.
     * 주어진 특징(features)과 현재 모델의 가중치(weights)를 사용하여 선형 조합(Linear Combination) z를 계산
     * z = b0 * 1 + b1 * x1 + b2 * x2 + ...
     * 수식으로는 z = b_0
		cdotx_0 +  b_1
		cdotx_1 +  b_2
		cdotx_2 +  dots 와 같음. 여기서 x_0는 절편을 위한 상수 1.0
     * @param features 데이터 포인트의 특징 배열 (첫 번째 요소는 1.0이어야 함)
     * @return 선형 조합 z 값(이 z 값은 시그모이드 함수의 입력으로 사용되어 확률을 도출)
     */
    private double calculateZ(double[] features) {
        double z = 0.0;
        for (int i = 0; i < numFeatures; i++) {
            z += weights[i] * features[i];
        }
        return z;
    }

    /** 모델 훈련 함수
     * 훈련 데이터를 사용하여 로지스틱 회귀 모델을 학습함 (경사 하강법).
     * 역할: 모델이 훈련 데이터로부터 패턴을 학습하여 최적의 weights를 찾아내는 과정 
     * 	   경사 하강법(Gradient Descent) 알고리즘을 사용
     * @param trainingData 훈련에 사용될 데이터 포인트 리스트
     * 		    모델을 학습시키는 데 사용될 데이터 포인트들의 리스트
     * @param learningRate(학습률) (계수 업데이트 크기)
     * 		가중치를 업데이트할 때 얼마나 큰 폭으로 업데이트할지를 결정하는 중요한 하이퍼파라미터
	 * 		값이 너무 크면 최적의 가중치를 지나쳐 발산할 수 있고, 
	 * 		너무 작으면 학습 시간이 오래 걸리거나 지역 최솟값에 갇힐 수 있음.
     * @param epochs 에포크 수 (전체 훈련 데이터를 반복할 횟수)
     * 		전체 훈련 데이터를 모델이 몇 번 반복해서 학습할지를 결정하는 횟수
			하나의 에포크는 모든 훈련 데이터 포인트를 한 번씩 검토하고 가중치를 업데이트하는 과정을 의미 함
	 * 학습 과정 (각 에포크 내에서):
	예측 확률 계산: 각 훈련 데이터 포인트에 대해 현재 가중치를 사용하여 z를 계산하고, 
			이를 시그모이드 함수에 넣어 predictedProb (클래스 1일 예측 확률)를 얻음
	비용(손실) 계산: totalLoss는 현재 모델이 얼마나 예측을 잘못하고 있는지를 나타내는 값. 
			로지스틱 회귀에서는 주로 로그 손실(Log Loss) 또는 교차 엔트로피(Cross-Entropy) 손실 함수를 사용함
			실제 라벨이 1일 때는 -\log(predictedProb), 
			실제 라벨이 0일 때는 -\log(1 - predictedProb)로 손실을 계산함
			epsilon은 log(0)이 발생하는 것을 방지하기 위한 작은 값(예측 확률이 0 또는 1에 매우 가깝게 나올 때).
	계수 업데이트 (경사 하강법):
			모델의 목표는 totalLoss를 최소화하는 것임. 
			이를 위해 각 가중치(weights[i])에 대해 손실 함수의 **기울기(gradient)**를 계산함
			기울기는 손실이 가장 빠르게 증가하는 방향을 나타내므로, 
			우리는 그 반대 방향(-learningRate * gradient)으로 가중치를 업데이트하여 손실을 줄여나감
			기울기는 (예측 확률 - 실제 라벨) * 특징 값으로 간단히 계산됨. 
			이는 예측 오류가 클수록, 해당 특징의 값이 클수록 가중치 업데이트 폭이 커짐을 의미함
     */
    public void train(List<LogisticRegressionDataPoint> trainingData, double learningRate, int epochs) {
        if (trainingData == null || trainingData.isEmpty()) {
            throw new IllegalArgumentException("훈련 데이터가 비어있습니다.");
        }

        System.out.println("모델 학습 시작...");
        for (int epoch = 0; epoch < epochs; epoch++) {
        	//현재 모델이 얼마나 예측을 잘못하고 있는지를 나타내는 값
            double totalLoss = 0.0;
            
            for (LogisticRegressionDataPoint dp : trainingData) {
                double[] features = dp.getFeatures();
                int actualLabel = dp.getLabel();

                // 1. 예측 확률 계산 (시그모이드 출력)
                //	주어진 데이터 포인트와 현재 가중치로 선형 조합 z를 계산
                double z = calculateZ(features);
                //로지스틱 회귀의 핵심인 시그모이드 함수를 계산
                double predictedProb = sigmoid(z);

                // 2. 비용 계산 (로그 손실)
                // 작은 값으로 로그 오류 방지
                double epsilon = 1e-10; // Log(0) 방지
                totalLoss += -(actualLabel * Math.log(predictedProb + epsilon) +
                                (1 - actualLabel) * Math.log(1 - predictedProb + epsilon));

                // 3. 계수 업데이트 (경사 하강법)
                // 각 계수에 대한 기울기를 계산하고 업데이트합니다.
                for (int i = 0; i < numFeatures; i++) {
                    // 		   기울기 = (예측 확률      - 실제 라벨)      * 특징 값
                    double gradient = (predictedProb - actualLabel) * features[i];
                    weights[i] -= learningRate * gradient; // 계수 업데이트
                }
            }
            totalLoss /= trainingData.size(); // 평균 비용
            if (epoch % 100 == 0 || epoch == epochs - 1) { // 100 에포크마다 또는 마지막 에포크에 출력
                System.out.printf("에포크 %d, 평균 비용: %.4f, 가중치: %s\n", epoch, totalLoss, Arrays.toString(weights));
            }
        }
        System.out.println("모델 학습 완료.");
    }

    /** 예측 함수
     * 역할 : 학습된 모델을 사용하여 새로운 데이터의 클래스 (0 또는 1)를 예측
     * 역할 : 학습된 모델을 사용하여 새로운 데이터 포인트의 **클래스(0 또는 1)**를 예측
     * @param actualFeatures 예측할 독립 변수 값 배열
     * 				  예측하고자 하는 독립 변수들의 배열
     * @return 예측된 클래스 (0 또는 1)
     */
    public int predict(double[] actualFeatures) {
        // 예측 시에도 절편 항을 추가해야 합니다.
    	// 훈련 시와 마찬가지로, 이 특징 배열에도 **절편 항 1.0**을 추가하여 featuresWithBias 배열을 만듭니다.
        double[] featuresWithBias = new double[actualFeatures.length + 1];
        featuresWithBias[0] = 1.0;
        System.arraycopy(actualFeatures, 0, featuresWithBias, 1, actualFeatures.length);
        
        /*
         calculateZ를 통해 선형 조합 z를 계산하고, 
         sigmoid 함수를 통해 클래스 1에 속할 probability를 얻음.
         */
        double z = calculateZ(featuresWithBias);
        double probability = sigmoid(z);

        // 0.5를 기준으로 클래스 결정
        // 분류 기준: 예측된 확률이 0.5 이상이면 클래스 1로 분류하고, 그렇지 않으면 클래스 0으로 분류
        return (probability >= 0.5) ? 1 : 0;
    }

    /** 예측 확률 반환 함수
     * 역할: predict 함수와 유사하지만, 최종 클래스 예측 대신 클래스 1에 속할 예측 확률 자체를 반환
     * 이 확률 값은 0과 1 사이의 실수임
     * 학습된 모델을 사용하여 새로운 데이터의 예측 확률을 반환합니다.
     * @param actualFeatures 예측할 독립 변수 값 배열
     * @return 클래스 1에 속할 예측 확률 (0과 1 사이)
     */
    public double predictProbability(double[] actualFeatures) {
        double[] featuresWithBias = new double[actualFeatures.length + 1];
        featuresWithBias[0] = 1.0;
        System.arraycopy(actualFeatures, 0, featuresWithBias, 1, actualFeatures.length);

        double z = calculateZ(featuresWithBias);
        return sigmoid(z);
    }

    public static void main(String[] args) {
        // 훈련 데이터 생성
        // 예시: [공부 시간, 수업 참석률], 라벨 (시험 통과 여부: 1=통과, 0=실패)
    	/*
    	훈련 데이터 생성: LogisticRegressionDataPoint 객체들을 생성하여 trainingData 리스트에 추가 함
    	이 데이터는 학습을 통해 모델의 가중치를 조정하는 데 사용됨
    	 */
        List<LogisticRegressionDataPoint> trainingData = new ArrayList<>();
        //new double[]{2.5, 70.0}: 여기서 2.5는 공부 시간, 70.0은 참석률을 나타내며, 0은 시험 불합격을 의미합
        trainingData.add(new LogisticRegressionDataPoint(new double[]{2.5, 70.0}, 0)); // 공부 시간, 참석률 -> 불합격
        trainingData.add(new LogisticRegressionDataPoint(new double[]{3.0, 75.0}, 0));
        trainingData.add(new LogisticRegressionDataPoint(new double[]{4.0, 80.0}, 0));
        trainingData.add(new LogisticRegressionDataPoint(new double[]{5.0, 85.0}, 1)); // -> 합격
        trainingData.add(new LogisticRegressionDataPoint(new double[]{6.0, 90.0}, 1));
        trainingData.add(new LogisticRegressionDataPoint(new double[]{7.0, 95.0}, 1));
        trainingData.add(new LogisticRegressionDataPoint(new double[]{4.5, 78.0}, 0));
        trainingData.add(new LogisticRegressionDataPoint(new double[]{5.5, 88.0}, 1));
        trainingData.add(new LogisticRegressionDataPoint(new double[]{3.2, 65.0}, 0));
        trainingData.add(new LogisticRegressionDataPoint(new double[]{6.5, 92.0}, 1));

        // 실제 독립 변수의 개수 (여기서는 공부 시간, 참석률 2개)
        /*모델 초기화
        2개의 독립 변수(공부 시간, 참석률)를 사용하는 로지스틱 회귀 모델 객체를 생성함. 
        내부적으로는 절편 항을 포함하여 총 3개의 가중치(b0, b1, b2)를 관리하게 됨
         */
        LogisticRegression classifier = new LogisticRegression(2);

        // 모델 학습
        double learningRate = 0.1;
        int epochs = 1000;
        
        /*모델 학습
	        learningRate : (학습률) (계수 업데이트 크기)
	        		learningRate: 0.1로 설정되어 가중치 업데이트의 보폭을 지정
	        epochs : 에포크 수 (전체 훈련 데이터를 반복할 횟수)
	        		epochs: 1000으로 설정되어 전체 훈련 데이터를 1000번 반복하여 학습
        */
        //								   0.1		  1000
        classifier.train(trainingData, learningRate, epochs);
        System.out.println();

        /* 새로운 데이터 예측
         * 학습이 완료된 모델을 사용하여 testFeatures 배열에 담긴 새로운 데이터 포인트에 대해 
         * 	predict (클래스 예측) 및 predictProbability (확률 예측)를 수행하고 
         *  결과를 출력
         */
        double[] testFeatures1 = {5.8, 89.0}; // 공부 시간 5.8, 참석률 89.0
        int prediction1 = classifier.predict(testFeatures1);
        double prob1 = classifier.predictProbability(testFeatures1);
        System.out.printf("특징 %s 에 대한 예측 클래스: %d, 예측 확률: %.4f\n", Arrays.toString(testFeatures1), prediction1, prob1); // 1 (합격) 예측 예상

        double[] testFeatures2 = {3.5, 72.0}; // 공부 시간 3.5, 참석률 72.0
        int prediction2 = classifier.predict(testFeatures2);
        double prob2 = classifier.predictProbability(testFeatures2);
        System.out.printf("특징 %s 에 대한 예측 클래스: %d, 예측 확률: %.4f\n", Arrays.toString(testFeatures2), prediction2, prob2); // 0 (불합격) 예측 예상

        double[] testFeatures3 = {4.8, 83.0}; // 애매한 값
        int prediction3 = classifier.predict(testFeatures3);
        double prob3 = classifier.predictProbability(testFeatures3);
        System.out.printf("특징 %s 에 대한 예측 클래스: %d, 예측 확률: %.4f\n", Arrays.toString(testFeatures3), prediction3, prob3); // 0 또는 1 예측 가능성
    }
}