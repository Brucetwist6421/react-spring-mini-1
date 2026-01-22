package kr.or.ddit.util;

public class Test {

	public static void main(String[] args) {
		
		//파일의 확장자 가져오기
		String fileName = "개똥이.jpg";
		
		//1) .의 위치를 구해보자
		System.out.println(fileName.lastIndexOf("."));
		
		//2) substring
		System.out.println(fileName.substring(fileName.lastIndexOf(".")+1));
	}

}
