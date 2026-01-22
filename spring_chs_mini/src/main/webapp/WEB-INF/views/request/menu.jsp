<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<title></title>
</head>
<body>

<!-- CDN 방식으로 import -->
<link rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">

<!-- /// header 시작 /// -->
<nav class="navbar navbar-expand navbar-dark bg-dark">
	<div class="container">
		<div class="navbar-header">
			<a class="navbar-brand" href="/product/welcome">Home</a>
		</div>
		<div>
			<!-- ul : unlist => 순서가 없는 목록 -->
			<ul class="navbar-nav mr-auth">
				<li class="nav-item"><a class="nav-link" href="#">로그인</a></li>
			</ul>
		</div>
	</div>
</nav>
<!-- /// header 끝 /// -->