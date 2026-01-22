<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<!-- /// header 시작 /// -->
<nav class="navbar navbar-expand navbar-dark bg-dark">
	<div class="container">
		<div class="navbar-header">
			<a class="navbar-brand" href="/product/welcome">Home</a>
		</div>
		<div>
			<!-- ul : unlist => 순서가 없는 목록 -->
			<ul class="navbar-nav mr-auth">
				<!-- 로그인이 안되었다면 -- 실습 2(c:if문 추가)-->
				<c:if test="${isLogin!='Y'}">
					<li class="nav-item"><a class="nav-link" href="/login">로그인</a></li>
				</c:if>
				<!-- 로그인이 되었다면 -- 실습 2(c:if문 추가)-->
				<c:if test="${isLogin=='Y'}">
					<li class="nav-item">
						<a class="nav-link" href="#"> 개똥이님 환영합니다!</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/logout">로그아웃</a>
					</li>
				</c:if>
				<!-- 관리자 권한 -- 실습 3 -->	
				<c:choose>		
					<c:when test="${auth=='ROLE_ADMIN'}">
						<li class="nav-item">
							<a class="nav-link" href="/item2/list">ITEM2</a>
						</li>	
						<li class="nav-item"><a class="nav-link" href="#">상품 목록</a></li>
						<li class="nav-item"><a class="nav-link" href="#">상품 등록</a></li>
					</c:when>
					<%-- 주의할 점 : c:choose 바로 안에 주석을 쓸때는 퍼센트를 사용한다. --%>
					<c:otherwise>
						<!-- 일반 권한 -- 실습 3 -->
						<li class="nav-item"><a class="nav-link" href="#">상품 목록</a></li>
						<li class="nav-item">
							<a class="nav-link" href="/item2/list">ITEM2</a>
						</li>
					</c:otherwise>
				</c:choose>				
			</ul>
		</div>
	</div>
</nav>
<!-- /// header 끝 /// -->
