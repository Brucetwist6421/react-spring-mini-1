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

<%@ include file="./menu.jsp"%>

 <div class="jumbotron">
    <!-- container : 이 안에 내용있다 -->
    <div class="container">
       <h1 class="display-3">${title}</h1>
    </div>
 </div>

<!-- /// body 시작 /// -->

	<!-- 실습 1 진행 -->
<!-- 	<form action="/request/requestProcess" method="post" > -->
	<form action="/request/requestProcess" method="post" enctype="multipart/form-data"> <!-- 위에 것을 밑의 것으로 변경 -- 실습 2 진행 -->
		<p>이름 : <input type="text" name="name"> </p>
		<!-- 실습 2 진행 -->
		<!-- 파일업로드
		1) method는 꼭 post!
		2) enctype="multipart/form-data"
		3) <input type="file" name="uploadFile".. name속성이 꼭 있어야 함!
		
		참고,시큐리티1) <sec땡땡csrfInput />
		참고,시큐리티2) action 속성의 uri 뒤에 token 추가
	   -->
		<p>이미지 : <input type="file" name="uploadFile"> </p>
		<!-- 실습 2 끝 -->
		<p><input type="submit" value="전송"> </p>
	</form>
	<!-- 실습 1 끝 -->

<!-- /// body 끝 /// -->

<%@ include file="./footer.jsp"%>

</body>
</html>