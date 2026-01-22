<%@page import="java.util.Date"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<title></title>
</head>
<body>

	<%@ include file="./menu.jsp"%>

	<div class="jumbotron">
		<!-- container : 이 안에 내용있다 -->
		<div class="container">
			<h1 class="display-3">${title}</h1>
		</div>
	</div>

	<!-- /// body 시작 /// -->

	<!-- 실습 1 시작 -->
<!-- 	<p>이 페이지는 5초마다 새로고침 됩니다.</p> -->
	<%
// 	response.setIntHeader("Refresh", 5);
	%>
	<!-- 표현문 -->
<%-- 	<p><%=new Date().toLocaleString()%></p> --%>
	<!-- 실습 1 끝 -->
	
	<!-- 실습 2 시작 -->
	<p id="p1"></p>
	
	<!-- 실습 2 끝 -->
	
	<!-- /// body 끝 /// -->


<script type="text/javascript">
	<!-- 실습 2 시작 -->
	function gogo(){
		console.log("개똥이");
		
		let today = new Date();
		
		console.log("today : " + today);
		
		let year = today.getFullYear();
		let month = ("0" + (today.getMonth() + 1)).slice(-2);
		let day = ("0" + today.getDate()).slice(-2);
		
		let dateString = year +"-"+ month +"-"+ day;
		
		console.log("dateString : "+ dateString);
		
		let hours = ("0" + today.getHours()).slice(-2);
		let minutes = ("0" + today.getMinutes()).slice(-2);
		let seconds = ("0" + today.getSeconds()).slice(-2);
		
		let timeString = hours +"-"+ minutes +"-"+ seconds;
		
		console.log("timeString : "+ timeString);
		
// 		document.getElementById("p1").innerHTML = dateString + " " + timeString;
		let p1 = document.getElementById("p1");
		p1.innerHTML = dateString + " " + timeString;
	}
	
	setInterval(gogo,1000);
	<!-- 실습 2 끝 -->
</script>



	<%@ include file="./footer.jsp"%>

</body>
</html>