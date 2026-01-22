<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!-- 실습 3 시작 -->
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<!-- 실습 3 끝 -->
<!DOCTYPE html>
<html>
<head>
<title></title>

</head>
<body>

<!-- CDN 방식으로 import -->
<!-- 실습 8 시작 -->
<!-- Font Awesome -->
<!-- Font Awesome -->
<link rel="stylesheet" href="/adminlte/plugins/fontawesome-free/css/all.min.css">
<link rel="stylesheet" href="/adminlte/dist/css/adminlte.min.css">
<link rel="stylesheet" href="/css/sweetalert2.min.css">
<script type="text/javascript" src="/js/sweetalert2.min.js"></script>
<!-- 실습 8 끝 -->
<link rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
<!-- 실습 2 시작 -->
<script type="text/javascript" src="/js/jquery.min.js"></script>
<!-- 실습 2 끝 -->
<!-- 실습 9 시작 -->
<!-- Bootstrap 4 -->
<script src="/adminlte/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- AdminLTE App -->
<script src="/adminlte/dist/js/adminlte.min.js"></script>
<!-- 실습 9 끝 -->
<!-- /// header 시작 /// -->
<nav class="navbar navbar-expand navbar-dark bg-dark">
	<div class="container">
		<div class="navbar-header">
			<a class="navbar-brand" href="/product/welcome">Home</a>
		</div>
		<div>
			<!-- ul : unlist => 순서가 없는 목록 -->
			<!-- 실습 4 시작 -->
			<!-- 로그인 안했을 때 보이는 영역 시작 -->
			<sec:authorize access="isAnonymous()">
				<ul class="navbar-nav mr-auth">
					<li class="nav-item">
						<a class="nav-link" href="/login">로그인</a>
					</li>
				</ul>
			</sec:authorize>
			<!-- 로그인 안했을 때 보이는 영역 끝 -->
			<!-- 실습 4 끝 -->
			<!-- 실습 5 시작 -->
			<!-- 로그인 했을 때 보이는 영역 시작 -->
<%-- 			<sec:authorize access="isAuthenticated()"> --%>
<!-- 			<!-- CustomUser의 객체 = principal -->
<!-- 				CustomUser의 객체의 tblUsersVO 프로퍼티 = principal.tblUsersVO -->
				
<!-- 				var : JSTL 변수 -->
<!-- 			 --> -->
<%-- 				<sec:authentication property="principal.tblUsersVO" var="tblUsersVO"/> --%>
<!-- 				<ul class="navbar-nav mr-auth"> -->
<!-- 					<li class="nav-item"> -->
<!-- 						EL(Expression Language) : 표현 언어 -->
<%-- 						<a class="nav-link" href="#">${tblUsersVO.name}(${tblUsersVO.email}) 님 환영합니다!</a> --%>
<!-- 						실습 6 시작 -->
<!-- 						로그아웃 시작 -->
<!-- 						<form action="/logout" method="post"> -->
<!-- 						<button type="submit" class="btn btn-block btn-outline-primary btn-xs" style="width: 100px;height: 30px;float: left"> -->
<!-- 							로그아웃 -->
<!-- 							.csrf(csrf->csrf.disable())에 의해  
<!-- 		                        <sec:csrfInput/>를 생략(토큰값 생성) -->
<!-- 		                      --> -->
<!-- 						</button> -->
<!-- 						</form> -->
<!-- 						로그아웃 끝 -->
<!-- 						실습 6 끝 -->
<!-- 					</li> -->
<!-- 				</ul> -->
<%-- 			</sec:authorize> --%>
			<!-- 로그인 했을 때 보이는 영역 끝 -->
			<!-- 실습 5 끝 -->
			
			<!-- 실습 7 시작  : 위에 중복 되는 영역 다 주석처리-->
			<!-- 로그인 했을 때 보이는 영역 시작 -->
			<sec:authorize access="isAuthenticated()">
			<!-- CustomUser의 객체 = principal
				CustomUser의 객체의 tblUsersVO 프로퍼티 = principal.tblUsersVO
				
				var : JSTL 변수
			 -->
				<sec:authentication property="principal.memberVO" var="memberVO"/>
				<ul class="navbar-nav mr-auth">
					<li class="nav-item">
						<!-- EL(Expression Language) : 표현 언어 -->
						<a class="nav-link" href="#">${memberVO.userId}(${memberVO.userName}) 님 환영합니다!</a>
						<!-- 로그아웃 시작 -->
						<form action="/logout" method="post">
						<button type="submit" class="btn btn-block btn-outline-primary btn-xs" style="width: 100px;height: 30px;float: left">
							로그아웃
							<!-- .csrf(csrf->csrf.disable())에 의해  
		                        <sec:csrfInput/>를 생략(토큰값 생성)
		                      -->
						</button>
						</form>
						<!-- 로그아웃 끝 -->
					</li>
				</ul>
			</sec:authorize>
			<!-- 로그인 했을 때 보이는 영역 끝 -->
			<!-- 실습 7 끝 -->
			
			
		</div>
	</div>
</nav>
<!-- /// header 끝 /// -->