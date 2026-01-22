package kr.or.ddit.util.knn;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

//실습 1 시작
@Component
// 실습 1 끝
public class KNNClassifier {

	 /**
     * 두 데이터 포인트 간의 유클리드 거리를 계산하는 헬퍼 함수
     */
	private static double calculateEuclideanDistance(DataPoint p1, DataPoint p2) {
        return Math.sqrt(Math.pow(p1.getX() - p2.getX(), 2) + Math.pow(p1.getY() - p2.getY(), 2));
    }
	
	 /**
     * K-Nearest Neighbor (KNN) 알고리즘을 사용하여 새로운 데이터 포인트의 클래스를 예측
     * @param trainingData 학습에 사용될 기존 분류된 데이터 목록. 각 데이터는 특징(예: x, y 좌표)과 해당 클래스 정보를 포함
     * @param newPoint 분류해야 할 미지의 데이터 포인트. 특징 정보는 있지만 클래스 정보는 없음
     * @param k 고려할 최근접 이웃의 수. K개의 가장 가까운 이웃을 기반으로 분류를 수행
     * @return 예측된 새로운 데이터 포인트의 클래스 문자열.
     */
    public static String classify(List<DataPoint> trainingData, DataPoint newPoint, int k) {
    	// K 값의 유효성 검사: K는 양수여야 하며, 훈련 데이터의 크기보다 작거나 같아야 함
        if (k <= 0 || k > trainingData.size()) {
            throw new IllegalArgumentException("K는 양수여야 하며 훈련 데이터의 크기보다 작거나 같아야 합니다.");
        }

        // 새로운 데이터 포인트와 훈련 데이터 포인트 간의 거리 및 해당 데이터 포인트를 저장할 리스트를 생성
        List<DistancePoint> distances = new ArrayList<DistancePoint>();

        // 1. 새로운 데이터 포인트와 모든 훈련 데이터 포인트 간의 거리 계산
        // trainingData: 학습에 사용될 기존 분류된 데이터 목록
        for (DataPoint dp : trainingData) {
            // 거리 계산: newPoint와 trainingData의 모든 포인트 간의 유클리드 거리를 계산하여
            // DistancePoint 객체 (거리와 해당 데이터 포인트를 포함)로 저장
        	/*
        	 1) newPoint : (2.0, 2.5, null)
        	 2) dp : 반복하며 하나씩 
        	 	DataPoint{x=1.0, y=1.0, className='A'}
				DataPoint{x=1.5, y=2.0, className='A'}
				DataPoint{x=3.0, y=4.0, className='B'}
				DataPoint{x=3.5, y=3.0, className='B'}
				DataPoint{x=1.2, y=0.8, className='A'}
				DataPoint{x=4.0, y=4.5, className='B'}
        	 */
            double distance = calculateEuclideanDistance(newPoint, dp);
            /* DistancePoint
            //distance: 새로운 데이터 포인트로부터의 거리.
			double distance;
			//dataPoint: 해당 거리의 훈련 데이터 포인트.
		    DataPoint dataPoint;
             */
            distances.add(new DistancePoint(distance, dp));
        }
        
        //sort 전의 distances
        System.out.println("sort 전의 distances : " + distances);

        // 2. 거리에 따라 오름차순으로 정렬
        // distances 리스트를 계산된 거리(distance)를 기준으로 오름차순으로 정렬
        // 이를 통해 새로운 데이터 포인트와 가까운 순서대로 훈련 데이터 포인트에 접근 가능
        Collections.sort(distances, Comparator.comparingDouble(DistancePoint::getDistance));
        
        //sort 전의 distances
        System.out.println("sort 후의 distances : " + distances);

        // 3. K개의 최근접 이웃 선택 및 클래스 빈도 계산
        // 각 클래스별 득표수를 저장할 HashMap을 생성 (예: "A" -> 3표, "B" -> 2표)
        Map<String, Integer> classVotes = new HashMap<String, Integer>();
        // k: 고려할 이웃의 수. 정렬된 리스트에서 상위 k개의 이웃만을 고려
        for (int i = 0; i < k; i++) {
            // 현재 i번째로 가까운 이웃 데이터 포인트를 가져옴
            DataPoint neighbor = distances.get(i).getDataPoint();
            // 해당 이웃의 클래스 이름을 가져옴
            String className = neighbor.getClassName();
            // 해당 클래스의 득표수를 1 증가시킴. 만약 처음 나온 클래스라면 기본값 0에서 시작함
            classVotes.put(className, classVotes.getOrDefault(className, 0) + 1);
        }
        
        System.out.println("classVotes : " + classVotes);

        // 4. 가장 많은 득표를 얻은 클래스 선택
        // 예측된 클래스 이름을 저장할 변수와 최대 득표수를 저장할 변수를 초기화
        String predictedClass = null;
        int maxVotes = -1;
        // K개의 이웃 선택 및 투표: HashMap에 집계된 클래스별 득표수를 반복하여,
        // 가장 많은 "표"를 얻은 클래스를 찾음
        for (Map.Entry<String, Integer> entry : classVotes.entrySet()) {
            // 현재 클래스의 득표수가 지금까지의 최대 득표수보다 크다면,
            if (entry.getValue() > maxVotes) {
                // 최대 득표수를 현재 클래스의 득표수로 업데이트하고,
                maxVotes = entry.getValue();
                // 예측된 클래스를 현재 클래스로 설정
                predictedClass = entry.getKey();
            }
        }
        // 클래스 예측: 최종적으로 가장 많은 표를 얻은 클래스를 반환
        return predictedClass;
    }
    
    /*
    public static void main(String[] args) {
        // 훈련 데이터 생성
    	//예시 훈련 데이터를 생성
    	//https://www.geogebra.org/calculator
        List<DataPoint> trainingData = new ArrayList<>();
        trainingData.add(new DataPoint(1.0, 1.0, "A"));
        trainingData.add(new DataPoint(1.5, 2.0, "A"));
        trainingData.add(new DataPoint(3.0, 4.0, "B"));
        trainingData.add(new DataPoint(3.5, 3.0, "B"));
        trainingData.add(new DataPoint(1.2, 0.8, "A"));
        trainingData.add(new DataPoint(4.0, 4.5, "B"));

        System.out.println("훈련 데이터:");
        for (DataPoint dp : trainingData) {
            System.out.println(dp);
        }
        System.out.println();

        // 분류할 새로운 데이터 포인트
        //분류할 새로운 데이터 포인트를 생성하고 k 값을 설정
        DataPoint newPoint1 = new DataPoint(2.0, 2.5, null); // 클래스는 아직 모름
        int k1 = 3; // K 값 설정

        //--------------------------------------------------------------
        //trainingData : List<DataPoint> trainingData
        //newPoint1 : (2.0, 2.5, null)
        //k1 = 3
        String predictedClass1 = classify(trainingData, newPoint1, k1);
        System.out.println("새로운 데이터 포인트 (" + newPoint1.getX() + ", " + newPoint1.getY() + ")");
        System.out.println("K = " + k1 + "일 때 예측된 클래스: " + predictedClass1);
        System.out.println();

        //--------------------------------------------------------------
        //trainingData : List<DataPoint> trainingData
        //newPoint1 : (0.5, 0.5, null)
        //k1 = 3
        DataPoint newPoint2 = new DataPoint(0.5, 0.5, null);
        int k2 = 5;

        //trainingData : List<DataPoint> trainingData
        //newPoint1 : (0.5, 0.5, null)
        //k2 = 5
        String predictedClass2 = classify(trainingData, newPoint2, k2);
        System.out.println("새로운 데이터 포인트 (" + newPoint2.getX() + ", " + newPoint2.getY() + ")");
        System.out.println("K = " + k2 + "일 때 예측된 클래스: " + predictedClass2);
        System.out.println();

        //--------------------------------------------------------------
        //trainingData : List<DataPoint> trainingData
        //newPoint1 : (3.8, 3.2, null)
        //k1 = 3
        DataPoint newPoint3 = new DataPoint(3.8, 3.2, null);
        int k3 = 1;

        String predictedClass3 = classify(trainingData, newPoint3, k3);
        System.out.println("새로운 데이터 포인트 (" + newPoint3.getX() + ", " + newPoint3.getY() + ")");
        System.out.println("K = " + k3 + "일 때 예측된 클래스: " + predictedClass3);
    }
    */
    
    // 
}













