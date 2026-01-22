package kr.or.ddit.util.knn.ex01;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

//DistancePoint 객체의 리스트를 거리(distance)를 기준으로 오름차순 정렬하는 방법을 보여줌
public class DistanceSortingExample01 {
	// 실습 1 시작
	// 정렬할 객체를 나타내는 클래스
    // 정렬의 대상이 되는 객체를 나타냄. name, distance, x, y 필드를 가짐
	static class DistancePoint{
		private String name; //포인트의 이름
		private double distance; //거리
		private int x;
		private int y;
		
		// 생성자
		public DistancePoint(String name, double distance, int x, int y) {
			super();
			this.name = name;
			this.distance = distance;
			this.x = x;
			this.y = y;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		//distance 프로퍼티의 값을 반환. 이 값이 정렬의 주 기준이 된다.
		//getDistance() 메서드는 distance 필드의 값을 반환하며, 이 값이 정렬의 주 기준이 됨
		public double getDistance() {
			return distance;
		}

		public void setDistance(double distance) {
			this.distance = distance;
		}

		public int getX() {
			return x;
		}

		public void setX(int x) {
			this.x = x;
		}

		public int getY() {
			return y;
		}

		public void setY(int y) {
			this.y = y;
		}

		//java.lang 패키지의 toString() 메서드를 오버라이드(메서드 재정의)를 하여 출력 시 보기 좋게 포맷팅 한다.
		//toString() 메서드를 오버라이드하여 객체를 출력할 때 보기 좋게 포맷팅 함
		@Override
		public String toString() {
			return "DistancePoint [name=" + name + ", distance=" + 
		               String.format("%.2f", distance) + ", x=" + x + ", y=" + y + "]";
		}
		
		// 실습 1 끝
		
	}
 
         

         
	public static void main(String[] args) {
		// 실습 2 시작
		// DistancePoint 객체 리스트 생성
		//DistancePoint 객체들을 담을 ArrayList인 points를 생성
		//몇 개의 DistancePoint 객체를 리스트에 추가 
		//   (특히 "Point B"와 "Point E"는 distance 값이 동일하게 하여 thenComparing의 효과를 볼 수 있도록 함
		// Point B와 동일한 거리
		List<DistancePoint> points = new ArrayList<DistancePoint>();
		points.add(new DistancePoint("Point A", 10.5, 5, 3));
		points.add(new DistancePoint("Point B", 2.1, 1, 1));
		points.add(new DistancePoint("Point C", 7.8, 8, 2));
		points.add(new DistancePoint("Point D", 15.0, 10, 7));
		points.add(new DistancePoint("Point E", 2.1, 2, 0)); // Point B 와 동일한 거리
		
		System.out.println("--정렬 전 리스트--");
		points.forEach(System.out::println);
		// 실습 2 끝
		
		// 실습 3 시작
		//이 부분이 핵심*******
		// Collections.sort와 Comparator.comparingDouble을 사용하여 거리(distance) 기준으로 정렬
		//*** DistancePoint::getDistance는 메서드 참조로, 
		//               DistancePoint 객체의 getDistance() 메서드를 Comparator에 제공합니다.
		//1) Collections.sort()는 리스트를 정렬하는 데 사용
		//2) 두 번째 인자인 Comparator는 정렬 기준을 정의
		//3) Comparator.comparingDouble(DistancePoint::getDistance)는 
		//      DistancePoint 객체의 getDistance() 메서드가 반환하는 double 값을 기준으로 비교하는 Comparator를 생성
		/*4)
          DistancePoint::getDistance는 Java 8에 도입된 **메서드 참조(Method Reference)** 
          이는 DistancePoint 객체를 받아서 getDistance()를 호출하는 
          람다 표현식 (point) -> point.getDistance()와 동일합니다. 코드를 더 간결하게 만듭
		 */
		//Collections.sort(points, Comparator.comparingDouble((point) -> point.getDistance()));//람다 표현식
		//메서드 참조(더 간결함)
		Collections.sort(points, Comparator.comparingDouble(DistancePoint::getDistance));
		
		System.out.println("--거리(distance) 기준으로 정렬 후 리스트(오름차순)--");
		//points.forEach(point->System.out.println(point)); 밑의 줄과 같은 내용
		points.forEach(System.out::println);
		// 실습 3 끝
		
		// 실습 4 시작
		// 추가 연습: 거리(distance)가 같을 경우 이름(name) 기준으로 정렬 (사전순)
		// thenComparing을 사용하여 보조 정렬 기준을 추가할 수 있습니다.
		/*
         Comparator에 thenComparing을 연결하면, 
         주 정렬 기준(여기서는 distance)이 동일할 경우 적용될 보조 정렬 기준을 지정할 수 있음.
       	 이 예제에서는 distance가 같은 DistancePoint 객체들은 name 필드를 기준으로 사전순으로 정렬됨
		 */
		Collections.sort(points, Comparator.comparingDouble(DistancePoint::getDistance)
											.thenComparing(DistancePoint::getName));
		System.out.println("--거리(distance)가 같을 경우 이름(name)으로 정렬 후 리스트(오름차순)--");
		//points.forEach(point->System.out.println(point)); 밑의 줄과 같은 내용
		points.forEach(System.out::println);	
		// 실습 4 끝
		
		// 실습 5 시작
		// 추가 연습: 내림차순 정렬
		//기존 Comparator의 정렬 순서를 뒤집어 내림차순으로 정렬
		Collections.sort(points, Comparator.comparingDouble(DistancePoint::getDistance)
				.reversed());
		
		//System.out.println("\n--- 거리(distance) 기준으로 내림차순 정렬 후 리스트 ---");
		System.out.println("--거리(distance)가 기준으로 내림차순 정렬 후 리스트--");
		//points.forEach(point->System.out.println(point)); 밑의 줄과 같은 내용
		points.forEach(System.out::println);
		// 실습 5 끝
	}
}
