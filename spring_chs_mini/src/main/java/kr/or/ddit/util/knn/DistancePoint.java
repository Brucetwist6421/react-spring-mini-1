package kr.or.ddit.util.knn;

//거리와 해당 데이터 포인트를 저장하는 클래스(정렬에 사용)
//이 클래스는 거리에 따라 정렬하기 위해 사용됨
public class DistancePoint {
	// 실습 1 시작
	//새로운 데이터 포인트로부터의 거리
	double distance;
	
	//해당 거리의 훈련 데이터 포인트
	DataPoint dataPoint;

	public DistancePoint(double distance, DataPoint dataPoint) {
		this.distance = distance;
		this.dataPoint = dataPoint;
	}

	public double getDistance() {
		return distance;
	}

	public void setDistance(double distance) {
		this.distance = distance;
	}

	public DataPoint getDataPoint() {
		return dataPoint;
	}

	public void setDataPoint(DataPoint dataPoint) {
		this.dataPoint = dataPoint;
	}

	@Override
	public String toString() {
		return "DistancePoint [distance=" + distance + ", dataPoint=" + dataPoint + "]";
	}
	
	
	// 실습 1 끝
	
	
}
