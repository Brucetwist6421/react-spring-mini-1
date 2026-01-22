<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<!-- CDN 방식으로 import -->
<link rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
<title></title>
</head>
<body>
	<%!String greeting = "welcome to Web Shopping Mall";
	String tagline = "Welcome to Web Market";%>
	<!-- Java 변수를 JSTL 변수로 넣어줌 -- 실습 2-->
	<c:set var="greeting" value="<%=greeting%>" />
	<c:set var="tagline" value="<%=tagline%>" />
	<!-- /// header 시작 /// -->
	<!-- 	<nav class="navbar navbar-expand navbar-dark bg-dark"> -->
	<!--       <div class="container"> -->
	<!--          <div class="navbar-header"> -->
	<!--             <a class="navbar-brand" href="/product/welcome">Home</a> -->
	<!--          </div> -->
	<!--          <div> -->
	<!--             ul : unlist => 순서가 없는 목록 -->
	<!--             <ul class="navbar-nav mr-auth"> -->
	<!--                <li class="nav-item"> -->
	<!--                   <a class="nav-link" href="#">로그인</a> -->
	<!--                </li> -->
	<!--                <li class="nav-item"><a class="nav-link" href="#">상품 목록</a></li> -->
	<!--                <li class="nav-item"><a class="nav-link" href="#">상품 등록</a></li> -->
	<!--             </ul> -->
	<!--          </div> -->
	<!--       </div> -->
	<!--    </nav> -->
	<%@ include file="./header.jsp"%>
	<!-- /// header 끝 /// -->
	<!-- 표현문 -->
	<div class="jumbotron">
		<!-- container : 내용이 들어갈 때 -->
		<div class="container">
			<%-- 			<h1 class="display-3"><%=greeting%></h1> 실습 2--%>
			<h1 class="display-3">${greeting}</h1>
		</div>
	</div>
	<!-- container : 내용이 들어갈 때 -->
	<div class="container">
		<!-- 내용을 중간 정렬 -->
		<div class="text-center">
			<%-- 			<h3><%=tagline%></h3> 실습 2 --%>
			<h3>${tagline}</h3>
		</div>
	</div>

	<!-- 실습 2 시작 -->
	<!--1부터 10까지 1씩 증가 -->
	<c:forEach var="i" begin="1" end="10" step="1">
		<p>${i}</p>
	</c:forEach>

	<!-- 실습 4 시작 -->
	<!-- 1부터 10까지 1씩 증가 
   i : JSTL변수
   
   i를 누적(accumulation)해보자
   -->
	<!-- 누적 JSTL 변수 : sum 
   sum = sum + i;
   -->
	<c:set var="sum" value="0" />

	<c:forEach var="i" begin="1" end="10" step="1">
		<c:set var="sum" value="${sum + i}" />
		<p>${i}</p>
	</c:forEach>

	<hr />
	<p>sum : ${sum}</p>
	<!-- 실습 4 끝 -->

	<!-- 
      forEach 태그? 배열(String[], int[][]), Collection(List, Set) 또는 
      Map(HashTable, HashMap, SortedMap)에 저장되어 있는 값들을 
      순차적으로 처리할 때 사용함. 자바의 for, do~while을 대신해서 사용함
      var : 변수
      items : 아이템(배열, Collection, Map)
      varStatus : 루프 정보를 담은 객체 활용
         - index : 루프 실행 시 현재 인덱스(0부터 시작)
         - count : 실행 회수(1부터 시작. 보통 행번호 출력)
   -->
	<c:forEach var="bookVO" items="${bookVOList}" varStatus="stat">
		<p>${bookVO.title}</p>
	</c:forEach>
	<!-- 실습 2 종료 -->

	<!-- 실습 3 시작 -->
	<select name="hobbys" id="hobbys">
		<option value="" selected>선택해주세요.</option>
		<c:forEach var="map" items="${hobbyMap}">
			<option value="${map.key}">${map.value}</option>
		</c:forEach>
	</select>
	<hr />
	<!-- 실습 3 종료 -->

	<!-- 실습 4 시작 -->
	<!-- stat : 상태(status)변수
   stat.index : 0,1,2...
   stat.count : 1,2,3..
   
   label 엘리먼트의 for 속성의 값과 input 엘리먼트의 id 속성의 값이 같으므로
   label 텍스트를 클릭 시 input 엘리먼트를 클릭한 효과가 남
    -->
	<c:forEach var="map" items="${hobbyMap}" varStatus="stat">
		<input type="checkbox" id="cbox${stat.index}" value="${map.key}" />
		<label for="cbox${stat.index}" style="cursor: pointer">${map.value}</label>
		&nbsp;
	</c:forEach>
	<!-- 실습 4 종료 -->


	<!-- 	<!-- /// footer 시작 /// -->
	<!-- 	<footer class="container"> -->
	<!-- 		<p>&copy; IT Market</p> -->
	<!-- 	</footer> -->
	<%@ include file="./footer.jsp"%>
	<!-- 	<!-- /// footer 끝 /// -->
</body>
</html>
