package kr.or.ddit.util.unsupervisedLearning;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

// 실습 1 시작
@Slf4j
@Component
// 실습 1 끝
public class KMeansClustering {

    private int k; // 군집의 개수
    private int maxIterations; // 최대 반복 횟수
    private List<Centroid> centroids; // 각 군집의 중심점
    private Random random;

    public KMeansClustering(
//    		int k, int maxIterations
    		// 실습 2 시작 -- 윗 줄 주석처리
    		@Value("${kMeansClustering.k}")int k, 
    		@Value("${kMeansClustering.maxIterations}")int maxIterations
    		// 실습 2 끝
    		) {
        if (k <= 0) {
            throw new IllegalArgumentException("K는 양수여야 합니다.");
        }
        if (maxIterations <= 0) {
            throw new IllegalArgumentException("최대 반복 횟수는 양수여야 합니다.");
        }
        this.k = k;
        this.maxIterations = maxIterations;
        this.centroids = new ArrayList<Centroid>(k);
        this.random = new Random();
    }

    /**
     * 두 데이터 포인트 간의 유클리드 거리를 계산합니다.
     */
    private double calculateDistance(ClusterDataPoint point, Centroid centroid) {
        return Math.sqrt(Math.pow(point.getX() - centroid.getX(), 2) + Math.pow(point.getY() - centroid.getY(), 2));
    }

    /**
     * K-평균 군집화를 수행합니다.
     * @param dataPoints 군집화할 데이터 포인트 리스트
     * @return 군집화된 데이터 포인트 리스트 (clusterId가 할당된 상태)
     */
    public List<ClusterDataPoint> cluster(List<ClusterDataPoint> dataPoints) {
    	System.out.println("cluster01");
    	dataPoints.forEach(System.out::print);
    	
        if (dataPoints == null || dataPoints.size() < k) {
            throw new IllegalArgumentException("데이터 포인트는 K개 이상이어야 합니다.");
        }

        // 1. 초기 중심점 설정
        // 데이터를 무작위로 선택하여 초기 중심점으로 설정
        initializeCentroids(dataPoints);
        //초기 중심점: [Centroid 0(2.20, 7.20), Centroid 1(5.50, 4.80), Centroid 2(2.50, 7.50)]
        System.out.println("초기 중심점: " + centroids);

        // 군집화 과정 반복
        for (int iter = 0; iter < maxIterations; iter++) {
        	//반복 1 시작:
        	//반복 2 시작:
            System.out.println("\n반복 " + (iter + 1) + " 시작:");

            // 2. 데이터 포인트 할당 (E-step: Expectation)
            // 각 데이터 포인트를 가장 가까운 중심점에 할당
            boolean changed = assignPointsToCentroids(dataPoints);

            // 3. 중심점 업데이트 (M-step: Maximization)
            // 각 군집에 할당된 포인트들의 평균으로 중심점 업데이트
            updateCentroids(dataPoints);
            
            //새로운 중심점: [Centroid 0(2.00, 7.00), Centroid 1(3.14, 3.11), Centroid 2(2.50, 7.50)]
            //새로운 중심점: [Centroid 0(2.00, 7.00), Centroid 1(3.14, 3.11), Centroid 2(2.50, 7.50)]
            System.out.println("새로운 중심점: " + centroids);

            // 중심점의 위치가 더 이상 변하지 않으면 수렴했다고 판단하고 종료
            if (!changed) {
            	//군집 중심점이 더 이상 변하지 않아 수렴했습니다. 총 반복 횟수: 2
                System.out.println("군집 중심점이 더 이상 변하지 않아 수렴했습니다. 총 반복 횟수: " + (iter + 1));
                break;
            }
            if (iter == maxIterations - 1) {
                System.out.println("최대 반복 횟수에 도달했습니다.");
            }
        }
        // 실습 4 시작
    	System.out.println("cluster03");
    	dataPoints.forEach(System.out::print);
    	// 실습 4 끝
        
        return dataPoints;
    }

    /**
     * 데이터 포인트 중 K개를 무작위로 선택하여 초기 중심점으로 설정합니다.
     */
    private void initializeCentroids(List<ClusterDataPoint> dataPoints) {
        centroids.clear();
        List<Integer> usedIndices = new ArrayList<>();
        for (int i = 0; i < k; i++) {
            int randomIndex;
            do {
                randomIndex = random.nextInt(dataPoints.size());
            } while (usedIndices.contains(randomIndex)); // 중복되지 않는 인덱스 선택
            usedIndices.add(randomIndex);

            ClusterDataPoint p = dataPoints.get(randomIndex);
            centroids.add(new Centroid(i, p.getX(), p.getY()));
        }
    }

    /**
     * 각 데이터 포인트를 가장 가까운 중심점에 할당합니다.
     * @param dataPoints 군집화할 데이터 포인트 리스트
     * @return 군집 할당이 변경된 데이터 포인트가 하나라도 있으면 true, 없으면 false
     */
    private boolean assignPointsToCentroids(List<ClusterDataPoint> dataPoints) {
        boolean changed = false;
        for (ClusterDataPoint dp : dataPoints) {
            double minDistance = Double.MAX_VALUE;
            int closestCentroidId = -1;

            for (Centroid centroid : centroids) {
                double distance = calculateDistance(dp, centroid);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCentroidId = centroid.getId();
                }
            }
            // 군집 ID가 변경되었는지 확인
            if (dp.getClusterId() != closestCentroidId) {
                dp.setClusterId(closestCentroidId);
                changed = true; // 변경이 있었음을 표시
            }
        }
        return changed;
    }

    /**
     * 각 군집에 할당된 데이터 포인트들의 평균 위치를 계산하여 중심점을 업데이트합니다.
     * @param dataPoints 군집화된 데이터 포인트 리스트
     */
    private void updateCentroids(List<ClusterDataPoint> dataPoints) {
        // 각 중심점에 대해 새로운 위치를 계산
        for (Centroid centroid : centroids) {
            double sumX = 0;
            double sumY = 0;
            int count = 0;

            for (ClusterDataPoint dp : dataPoints) {
                if (dp.getClusterId() == centroid.getId()) { // 현재 중심점에 할당된 포인트들만 고려
                    sumX += dp.getX();
                    sumY += dp.getY();
                    count++;
                }
            }

            if (count > 0) { // 할당된 포인트가 있어야만 업데이트
                centroid.setX(sumX / count);
                centroid.setY(sumY / count);
            }
            // else: 만약 어떤 중심점에도 할당된 포인트가 없다면 (드문 경우), 해당 중심점은 업데이트되지 않습니다.
            // 또는 이 경우 새로운 위치로 재설정하는 전략을 사용할 수도 있습니다.
        }
    }


    /*
    public static void main(String[] args) {
        // 훈련 데이터 생성
        List<ClusterDataPoint> dataPoints = new ArrayList<>();
        // 첫 번째 군집 경향(0~2)
        dataPoints.add(new ClusterDataPoint(1.0, 1.0));
        dataPoints.add(new ClusterDataPoint(1.2, 1.5));
        dataPoints.add(new ClusterDataPoint(0.8, 0.9));
        dataPoints.add(new ClusterDataPoint(1.5, 1.0));

        // 두 번째 군집 경향(4~6)
        dataPoints.add(new ClusterDataPoint(5.0, 5.0));
        dataPoints.add(new ClusterDataPoint(5.5, 4.8));
        dataPoints.add(new ClusterDataPoint(4.8, 5.2));
        dataPoints.add(new ClusterDataPoint(5.3, 5.5));

        // 세 번째 군집 경향(1~3)
        dataPoints.add(new ClusterDataPoint(2.0, 7.0));
        dataPoints.add(new ClusterDataPoint(2.5, 7.5));
        dataPoints.add(new ClusterDataPoint(1.8, 6.8));
        dataPoints.add(new ClusterDataPoint(2.2, 7.2));

        int k = 3; // 군집 개수
        int maxIterations = 100; // 최대 반복 횟수

//         KMeansClustering
//        private int k; // 군집의 개수
//	    private int maxIterations; // 최대 반복 횟수
//	    private List<Centroid> centroids; // 각 군집의 중심점
//	    private Random random;
         
        KMeansClustering kmeans = new KMeansClustering(k, maxIterations);

//         try~catch
//        이 코드의 주된 목적은 K-평균 군집화가 완료된 후, 그 결과를 사용자에게 명확하게 보여주는 것임.
//        단순히 각 데이터 포인트가 어떤 군집에 할당되었는지뿐만 아니라, 
//        각 군집에 어떤 데이터 포인트들이 속해 있는지를 별도로 정리하여 보여줌으로써 
//        군집화 결과를 더 쉽게 이해하고 분석할 수 있도록 도와줌
//		데이터를 군집화하면, 유사한 특성을 가진 데이터들을 묶어 패턴을 파악하거나 
//		이상치를 감지하는 등 다양한 분석에 활용할 수 있음.
        
        try {
        	
//        	kmeans.cluster(dataPoints) : 이 부분은 K-평균 군집화 알고리즘을 실행하는 핵심 메서드
//        	kmeans: K-평균 알고리즘의 로직을 담고 있는 객체.
//        		이 객체는 K-평균 군집화를 수행하는 데 필요한 설정(예: 군집의 개수 k, 최대 반복 횟수 등)을 가지고 있을
//        	cluster(dataPoints): 이 메서드는 입력된 dataPoints (데이터 포인트들의 리스트)를 
//        		K-평균 알고리즘에 따라 k개의 군집으로 나눔
//        		각 데이터 포인트는 가장 가까운 군집의 중심(Centroid)에 할당됨
//        	List<ClusterDataPoint> clusteredData: cluster 메서드의 결과.
//        	 	각 데이터 포인트가 어떤 군집에 속하는지에 대한 정보가 담긴 ClusterDataPoint 객체들의 리스트가 반환.
//        	 	ClusterDataPoint 클래스 안에는 원래 데이터 포인트와 함께 해당 포인트가 할당된 군집의 ID가 포함되어 있을 것임
        	 
            List<ClusterDataPoint> clusteredData = kmeans.cluster(dataPoints);
            	
            //콘솔에 군집화 결과가 시작됨을 알리는 헤더를 출력
            System.out.println("\n--- 군집화 결과 ---");
            
            //clusteredData 리스트에 있는 모든 ClusterDataPoint 객체를 반복하면서 
            //		각 데이터 포인트의 정보를 출력
            for (ClusterDataPoint dp : clusteredData) {
            	//각 ClusterDataPoint 객체의 toString() 메서드를 호출하여 
            	//	해당 데이터 포인트의 정보(예: 좌표 값과 할당된 군집 ID)를 출력
            	
//            	Point(1.00, 1.00) [Cluster: 1]
//				Point(1.20, 1.50) [Cluster: 1]
//				Point(0.80, 0.90) [Cluster: 1]
//				Point(1.50, 1.00) [Cluster: 1]
//				Point(5.00, 5.00) [Cluster: 1]
//				Point(5.50, 4.80) [Cluster: 1]
//				Point(4.80, 5.20) [Cluster: 1]
//				Point(5.30, 5.50) [Cluster: 1]
//				Point(2.00, 7.00) [Cluster: 0]
//				Point(2.50, 7.50) [Cluster: 2]
//				Point(1.80, 6.80) [Cluster: 0]
//				Point(2.20, 7.20) [Cluster: 0]
            	 
                System.out.println(dp);
            }
            // 각 군집별 포인트 출력 (선택 사항)
            // 콘솔에 군집별 데이터 포인트 출력이 시작됨을 알리는 헤더를 출력
            System.out.println("\n--- 군집별 데이터 포인트 ---");
            
            //k는 군집의 개수를 나타내는 변수입니다. 이 루프는 각 군집(0부터 k-1까지)에 대해 반복
            for (int i = 0; i < k; i++) {
            	//현재 처리 중인 군집의 ID를 저장하는 변수입니다. 람다 표현식 내에서 사용하기 위해 final로 선언됨.
                final int currentClusterId = i;//0, 1, 2
                
//                clusteredData.stream(): clusteredData 리스트를 스트림으로 변환함. 
//                		스트림을 사용하면 데이터를 효율적으로 필터링하고 변환할 수 있음.
//                .filter(p -> p.getClusterId() == currentClusterId): 스트림의 각 ClusterDataPoint(p)에 대해, 
//                		해당 포인트의 군집 ID(p.getClusterId())가 
//                		현재 처리 중인 군집 ID(currentClusterId)와 같은 경우에만 필터링하여 남김. 
//                		즉, 현재 군집에 속하는 데이터 포인트만 선택함
//                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll): 필터링된 데이터 포인트들을 새로운 ArrayList에 수집함.
//						ArrayList::new: 새로운 ArrayList 인스턴스를 생성함.
//						ArrayList::add: 각 요소를 ArrayList에 추가함.
//						ArrayList::addAll: (병렬 스트림에서) 여러 결과 리스트를 하나로 합침.
                 
                List<ClusterDataPoint> clusterPoints = clusteredData.stream()
                                                    .filter(p -> p.getClusterId() == currentClusterId)
                                                    .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
                //현재 군집의 ID(i)와 해당 군집에 속하는 모든 데이터 포인트들을 출력함
                
//                군집 0: [Point(2.00, 7.00) [Cluster: 0], Point(1.80, 6.80) [Cluster: 0], Point(2.20, 7.20) [Cluster: 0]]
//				군집 1: [Point(1.00, 1.00) [Cluster: 1], Point(1.20, 1.50) [Cluster: 1], Point(0.80, 0.90) [Cluster: 1], Point(1.50, 1.00) [Cluster: 1], Point(5.00, 5.00) [Cluster: 1], Point(5.50, 4.80) [Cluster: 1], Point(4.80, 5.20) [Cluster: 1], Point(5.30, 5.50) [Cluster: 1]]
//				군집 2: [Point(2.50, 7.50) [Cluster: 2]]
						
                System.out.println("군집 " + i + ": " + clusterPoints);
            }

        } catch (IllegalArgumentException e) {
            System.err.println("오류: " + e.getMessage());
        }
    } // end main
    */
}