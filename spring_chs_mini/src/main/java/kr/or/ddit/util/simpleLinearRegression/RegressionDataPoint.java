package kr.or.ddit.util.simpleLinearRegression;


//데이터 포인트 클래스 (x, y 값 쌍)
public class RegressionDataPoint {
	private double x; //독립변수(입력값)
	private double y; //종속변수(출력값)
	
	public RegressionDataPoint(double x, double y) {
	   this.x = x;
	   this.y = y;
	}
	
	public double getX() {
	   return x;
	}
	
	public double getY() {
	   return y;
	}
	
	@Override
	public String toString() {
	   return "(" + x + ", " + y + ")";
	}
}