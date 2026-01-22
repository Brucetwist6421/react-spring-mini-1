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
       <h1 class="display-3">주문 취소</h1>
    </div>
 </div>

<!-- /// body 시작 /// -->
<div class="container">
   <h2 class="alert alert-danger">주문이 취소되었습니다.</h2>
</div>
<div class="container">
   <p><a href="/product/products" class="btn btn-secondary">&laquo;상품 목록</a></p>
</div>

<!-- /// body 끝 /// -->

<%@ include file="./footer.jsp"%>

</body>
</html>