<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<title>Access Denied Page</title>
</head>
<body>
<%@ include file="./include/header.jsp"%>

<div class="jumbotron">
 	<!-- container : 이 안에 내용있다 -->
 	<div class="container">
 		<h1 class="display-3">${SPRING_SECURITY_403_EXCEPTION.getMessage()}</h1>
 	</div>
 </div>

<!-- /// body 시작 /// -->
<h2>${msg}</h2>
<!-- /// body 끝 /// -->

<%@ include file="./include/footer.jsp"%>
</body>
</html>