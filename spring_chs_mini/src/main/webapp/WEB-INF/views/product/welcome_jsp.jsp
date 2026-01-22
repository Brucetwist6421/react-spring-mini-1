<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!DOCTYPE html>
<html>
<head>
<title></title>
</head>
<body>
	<h1>Welcome to Web Shopping Mall</h1>
	<h3>Welcome to IT MALL!</h3>
	
	<!-- 서블릿
   welcome.jsp -> 해석 -> welcome_jsp.java -> 컴파일 -> welcome_jsp.class
    -->
	<%! //선언문 --실습 1 시작
		int count = 3;
	
		String makeItLower(String data){
			
			return data.toLowerCase();
		}
		
		int makeSum(int a, int b){
			return a + b;
		}
		//실습 1 끝
	%>
	
<!-- 	느낌표가 있으면 전역변수. 느낌표가 없으면 전역변수 -->
	<%=count %>
	
	<!-- 스크립틀릿 -- 실습 2 시작 -->
	<%
		int count = 2;
	for(int i=1;i<=count;i++){
		out.print("<p>Java Server Pages"+i+"</p>");
	}
	%>
	<!-- 스크립틀릿 -- 실습 2 끝 -->
	
	<!-- 실습 1 시작 -->
	<!-- 표현문 -->
	<%=makeItLower("HELLO WORLD") %>
	</br>
	<%=makeSum(2,3) %>
	</br>
	<%=count %>
	</br>
	<!-- 실습 1 끝 -->
</body>
</html>