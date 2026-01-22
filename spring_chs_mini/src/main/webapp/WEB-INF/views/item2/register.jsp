<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html>
<head>
<title>대덕의 쇼핑몰</title>
</head>
<body>
	<!-- /// menu.jsp 시작  -->
	<%@ include file="../menu.jsp" %>
	<!-- /// menu.jsp 끝 /// -->
	
	<!-- /// 제목 시작 /// -->
	<div class="jumbotron">
		<!-- container : 내용이 들어갈 때 -->
		<div class="container">
			<h1 class="display-3">단일 파일업로드 등록</h1>
		</div>
	</div>
	<!-- /// 제목 끝 /// -->
	
	<!-- 
	요청URI : /item/registerPost
	요청파라미터 : {itemName=삼성태블릿,price=120000,description=쓸만함,uploadFile=파일객체}
	요청방식 : post
	-->
	<!-- 파일업로드
	1) method는 꼭 post!
	2) enctype="multipart/form-data"
	3) <input type="file" name="uploadFile".. name속성이 꼭 있어야 함!
	4) <sec땡땡csrfInput />
	5) action 속성의 uri 뒤에 token 추가
	 -->
	<form action="/item2/registerPost"
		method="post" enctype="multipart/form-data">
		<table>
			<tr>
				<th>상품명</th>
				<td><input type="text" name="itemName" required placeholder="상품명" /></td>
			</tr>
			<tr>
				<th>가격</th>
				<td><input type="text" name="price" required placeholder="가격" /></td>
			</tr>		
			<tr>
				<th>상품이미지</th>
				<td><input type="file" name="uploadFile" placeholder="상품이미지" /></td>
			</tr>
			<!-- 실습 2 시작 -->
			<tr>
				<th>상품이미지2</th>
				<td><input type="file" name="uploadFile2" placeholder="상품이미지2" /></td>
			</tr>
			<!-- 실습 2 끝 -->
			<tr>
				<th>개요</th>
				<td><input type="text" name="description" placeholder="개요" /></td>
			</tr>
		</table>
		<button type="submit">상품 등록</button>
		<button type="reset">초기화</button>
	</form>
	<hr />

	<!-- /// footer.jsp 시작 /// -->
	<%@ include file="../footer.jsp" %>
	<!-- /// footer.jsp 끝 /// -->
</body>
</html>