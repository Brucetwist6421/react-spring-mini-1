package kr.or.ddit.util.unsupervisedLearning;

//자바빈 클래스 : 프로퍼티 + 기본생성자 + getter/setter메서드
//군집의 중심점(Centroid)을 나타내는 클래스
public class Centroid {
 double x;
 double y;
 int id; // 중심점의 ID (군집 ID와 동일)

 public Centroid(int id, double x, double y) {
     this.id = id;
     this.x = x;
     this.y = y;
 }

 public int getId() {
     return id;
 }

 public double getX() {
     return x;
 }

 public double getY() {
     return y;
 }

 public void setX(double x) {
     this.x = x;
 }

 public void setY(double y) {
     this.y = y;
 }

 @Override
 public String toString() {
     return String.format("Centroid %d(%.2f, %.2f)", id, x, y);
 }
}