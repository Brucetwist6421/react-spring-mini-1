<%@page import="java.util.Date"%>
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
	<!-- 스크립틀릿 -->
	<%
		int a = 2;
		int b = 3;
		int sum = a + b;
		out.print("<p>2 + 3 =" + sum + "</p>");
	%>
	<hr />
	<%
		for(int i=0;i<=10;i++){
			//JSP 내장객체
			if(i%2 == 0){
				out.print("<p>"+i+"</p>");
			}
		}
	%>
	<hr />
	<%!
		int count = 0;
	%>
	<!-- 지역변수 a 를 1 증가시킴 -->
	<p>
		Page Count is <%=++a %>
	</p>
	<!-- 전역변수 count 를 1 증가시킴 -->
	<p>
		Page Count is <%=++count %>
	</p>
	<hr/>
	<p>
    	Today is <%= new Date() %>
	</p>
</body>
</html>