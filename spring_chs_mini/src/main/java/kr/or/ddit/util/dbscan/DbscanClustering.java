package kr.or.ddit.util.dbscan;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.Stack;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class DbscanClustering {

	private double epsilon; // 이웃을 탐색할 반경
	private int minPts; // 군집을 형성하기 위한 최소 포인트 수
	private List<DbscanPoint> dataPoints; // 군집화할 데이터 포인트 리스트
	private int nextClusterId; // 다음 군집에 할당할 ID

	// 실습 1 시작
	/*
	 * DBSCAN 알고리즘 인스턴스 생성
	 * 
	 * @param epsilon 이웃을 탐색할 반경
	 * 
	 * @param minPts 코어 포인트가 되기 위한 최소 이웃 수
	 * 
	 */
	public DbscanClustering(double epsilon, int minPts) {
		if (epsilon <= 0) {
			throw new IllegalArgumentException("Epsilon은 양수여야 합니다");
		}
		if (minPts <= 0) {
			throw new IllegalArgumentException("minPts은 양수여야 합니다");
		}

		this.epsilon = epsilon;
		this.minPts = minPts;
		this.nextClusterId = 1; // 군집 ID는 1부터 시작
	}
	// 실습 1 끝

	// 실습 2 시작
	/*
	 * DBSCAN 군집화 수행
	 * 
	 * @param dataPoints 군집화할 데이터 포인트 리스트
	 * 
	 * @return 군집화된 데이터 포인트 리스트(clusterId와 state가 할당된 상태)
	 */
	public List<DbscanPoint> cluster(List<DbscanPoint> dataPoints) {
		if (dataPoints == null || dataPoints.isEmpty()) {
			throw new IllegalArgumentException("데이터 포인트가 비어있습니다.");
		}
		this.dataPoints = dataPoints;
		this.nextClusterId = 1; // 새로운 군집화 시작 시 ID 초기화
		log.info("DBSCAN 군집화 시작 (Epsilon: " + epsilon + ", MinPts: " + minPts + ")...");
		// 모든 데이터 포인트를 순회하며 군집 탐색
		for (DbscanPoint p : dataPoints) {
			// 아직 방문하지 않은 포인트인 경우에만 처리
			if (p.getClusterId() == DbscanPoint.UNCLASSIFIED) {
				// 현재 포인트의 이웃들을 찾습니다.
				List<DbscanPoint> neighbors = getNeighbors(p);
				// 이웃 수가 MinPts보다 적으면 노이즈로 잠정 분류합니다.
				if (neighbors.size() < minPts) {
					p.setClusterId(DbscanPoint.NOISE);
					p.setState(DbscanPoint.PointState.NOISE);
				} else {
					// 이웃 수가 MinPts 이상이면 새로운 군집을 시작합니다.
					p.setState(DbscanPoint.PointState.CORE); // 현재 포인트는 코어 포인트
					expandCluster(p, neighbors, nextClusterId); // 군집 확장
					nextClusterId++; // 다음 군집을 위해 ID 증가
				}
			}
		}
		log.info("DBSCAN 군집화 완료.");
		return this.dataPoints;
	}
	// 실습 2 끝

	// 실습 3 시작
	/**
	 * 특정 포인트의 epsilon 반경 내에 있는 모든 이웃 포인트를 찾습니다.
	 * 
	 * @param p 기준 포인트
	 * @return 이웃 포인트 리스트
	 */
	private List<DbscanPoint> getNeighbors(DbscanPoint p) {
		List<DbscanPoint> neighbors = new ArrayList<>();
		for (DbscanPoint other : dataPoints) {
			if (p != other && p.distanceTo(other) <= epsilon) { // 자기 자신 제외, epsilon 이내
				neighbors.add(other);
			}
		}
		return neighbors;
	}

	// 실습 3 끝

	// 실습 4 시작
	/**
	 * 코어 포인트로부터 군집을 확장합니다.
	 * 
	 * @param corePoint 현재 코어 포인트
	 * @param neighbors 코어 포인트의 이웃 리스트
	 * @param clusterId 현재 군집 ID
	 */
	private void expandCluster(DbscanPoint corePoint, List<DbscanPoint> neighbors, int clusterId) {
		corePoint.setClusterId(clusterId); // 코어 포인트를 현재 군집에 할당

		// 스택을 사용하여 재귀 대신 반복문으로 군집 확장
		// 재귀 호출이 깊어질 경우 StackOverflowError 방지
		Stack<DbscanPoint> stack = new Stack<>();
		stack.addAll(neighbors); // 코어 포인트의 모든 이웃을 스택에 추가

		while (!stack.isEmpty()) {
			DbscanPoint current = stack.pop();

			// 만약 현재 포인트가 노이즈로 분류되어 있었다면 (나중에 코어 포인트에 의해 연결된 경우),
			// 이제는 이 군집의 경계 포인트가 됩니다.
			if (current.getClusterId() == DbscanPoint.NOISE) {
				current.setClusterId(clusterId);
				current.setState(DbscanPoint.PointState.BORDER); // 노이즈에서 경계로 변경
			}

			// 아직 분류되지 않은 포인트인 경우에만 처리
			if (current.getClusterId() == DbscanPoint.UNCLASSIFIED) {
				current.setClusterId(clusterId); // 현재 포인트를 군집에 할당

				List<DbscanPoint> currentNeighbors = getNeighbors(current);

				// 현재 포인트가 코어 포인트라면, 그 이웃들도 군집에 추가
				if (currentNeighbors.size() >= minPts) {
					current.setState(DbscanPoint.PointState.CORE); // 이 포인트도 코어 포인트
					for (DbscanPoint neighbor : currentNeighbors) {
						// 아직 방문하지 않았거나 노이즈로 분류된 이웃만 스택에 추가
						if (neighbor.getClusterId() == DbscanPoint.UNCLASSIFIED
								|| neighbor.getClusterId() == DbscanPoint.NOISE) {
							stack.push(neighbor);
						}
					}
				} else {
					current.setState(DbscanPoint.PointState.BORDER); // 이 포인트는 경계 포인트
				}
			}
		}
	}
	// 실습 4 끝

	// 실습 5 시작
	public static void main(String[] args) {

		// 샘플 데이터 생성
		List<DbscanPoint> dataPoints = new ArrayList<>();

		// 군집 1
		dataPoints.add(new DbscanPoint(1.0, 1.0));
		dataPoints.add(new DbscanPoint(1.2, 1.3));
		dataPoints.add(new DbscanPoint(0.9, 1.1));
		dataPoints.add(new DbscanPoint(1.1, 0.8));
		dataPoints.add(new DbscanPoint(1.3, 1.2));

		// 군집 2
		dataPoints.add(new DbscanPoint(5.0, 5.0));
		dataPoints.add(new DbscanPoint(5.2, 5.3));
		dataPoints.add(new DbscanPoint(4.9, 5.1));
		dataPoints.add(new DbscanPoint(5.1, 4.8));
		dataPoints.add(new DbscanPoint(5.3, 5.2));

		// 노이즈 포인트
		dataPoints.add(new DbscanPoint(2.0, 2.0)); // 노이즈
		dataPoints.add(new DbscanPoint(7.0, 7.0)); // 노이즈
		dataPoints.add(new DbscanPoint(1.5, 5.0)); // 노이즈
		dataPoints.add(new DbscanPoint(4.0, 1.0)); // 노이즈 (경계가 될 수도)

		// DBSCAN 파라미터 설정
		double epsilon = 0.5; // 반경
		int minPts = 3; // 최소 포인트 수

		DbscanClustering dbscan = new DbscanClustering(epsilon, minPts);

		try {
			//군집화 알고리즘 실행
			List<DbscanPoint> clusteredData = dbscan.cluster(dataPoints);

			log.info("\n--- 최종 DBSCAN 군집화 결과 ---");
			for (DbscanPoint dp : clusteredData) {
				log.info(dp.toString());
			}

			// 각 군집별, 그리고 노이즈 포인트 출력
			log.info("\n--- 군집별 데이터 포인트 요약 ---");
			Set<Integer> clusterIds = clusteredData.stream().map(DbscanPoint::getClusterId).collect(Collectors.toSet());

			for (int id : clusterIds) {
				if (id == DbscanPoint.NOISE) {
					List<DbscanPoint> noisePoints = clusteredData.stream()
							.filter(p -> p.getClusterId() == DbscanPoint.NOISE).collect(Collectors.toList());
					log.info("노이즈 포인트 (" + noisePoints.size() + "개): " + noisePoints);
				} else {
					List<DbscanPoint> clusterPoints = clusteredData.stream().filter(p -> p.getClusterId() == id)
							.collect(Collectors.toList());
					log.info("군집 " + id + " (" + clusterPoints.size() + "개): " + clusterPoints);
				}
			}

		} catch (IllegalArgumentException e) {
			System.err.println("오류: " + e.getMessage());
		}

	}

	// 실습 5 끝
}
