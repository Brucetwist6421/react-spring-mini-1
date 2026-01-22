package kr.or.ddit.util.knn;

//데이터 포인트를 나타내는 클래스
public class DataPoint {
	// 실습 1 시작
	//x, y : 데이터 포인트의 특징(2차원)
	double x;
	double y;
	
	//데이터 포인트가 속한 클래스
	//훈련된 데이터에는 값이 있음. 새로운 데이터에는 null
	//분류할 클래스
	String className;

	public DataPoint(double x, double y, String className) {
		this.x = x;
		this.y = y;
		this.className = className;
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

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

	@Override
	public String toString() {
		return "DataPoint [x=" + x + ", y=" + y + ", className=" + className + "]";
	}
	
	
	// 실습 1 끝
}
