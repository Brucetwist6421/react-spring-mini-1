package kr.or.ddit.util.dbscan;

public class DbscanPoint {
	private double x;
	private double y;
	private int clusterId;//군집ID
	private PointState state; //포인트 상태(UNCLASSIFIED(비군집화), CORE(중앙), BORDER(경계), NOISE(노이즈))
	
	
	//상수 정의
	public static final int UNCLASSIFIED = 0;
	public static final int NOISE = -1;
	
	
	// 실습 1 시작
	//포인트 상태를 나타내는 Enum
	public enum PointState{
		UNCLASSIFIED, CORE, BORDER, NOISE
	}
	
	//생성자
	public DbscanPoint(double x, double y) {
		this.x = x;
		this.y = y;
		this.clusterId = UNCLASSIFIED; //0
		this.state = PointState.UNCLASSIFIED;
	}

	public double getX() {
		return x;
	}

	public void setX(double x) {
		this.x = x;
	}

	public double getY() {
		return y;
	}

	public void setY(double y) {
		this.y = y;
	}

	public int getClusterId() {
		return clusterId;
	}

	public void setClusterId(int clusterId) {
		this.clusterId = clusterId;
	}

	public PointState getState() {
		return state;
	}

	public void setState(PointState state) {
		this.state = state;
	}

	public static int getUnclassified() {
		return UNCLASSIFIED;
	}

	public static int getNoise() {
		return NOISE;
	}
	
	/* KNN, K-means, 
	 *  다른 DbscanPoint 객체와의 유클리드 거리를 계산함
	 */
	public double distanceTo(DbscanPoint other) {
		return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y,2)); 
	}

	@Override
	public String toString() {
		return "DbscanPoint [x=" + x + ", y=" + y + ", clusterId=" + clusterId + ", state=" + state + "]";
	}
	
	// 실습 1 끝
	
	
}
