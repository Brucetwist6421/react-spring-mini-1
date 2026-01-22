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
       <h1 class="display-3">해당 상품이 존재하지 않습니다.</h1>
    </div>
 </div>

<!-- /// body 시작 /// -->
<div class="container">
	<p><%=request.getRequestURL() %>?<%=request.getQueryString() %></p>
	<p><a href="/product/products" class="btn btn-secondary">상품 목록</a></p>
</div>

<!-- /// body 끝 /// -->

<%@ include file="./footer.jsp"%>

</body>
</html>