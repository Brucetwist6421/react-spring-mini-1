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

	<%-- 	<p>${productVO}</p> --%>
	<div class="jumbotron">
		<!-- container : 이 안에 내용있다 -->
		<h1 class="display-3">상품 상세</h1>

	</div>
	
	<!-- 실습 1 시작 -->
	<div class="container">
		<div class="row">
			<div class="col-md-5">
<%-- 				<img src="/images/${productVO.filename}" alt="${productVO.pname}" -- 실습 3 진행 후 주석 처리--%>
<%-- 					title="${productVO.pname}" style="width: 100%; cursor: pointer;"> --%>
				<!-- 실습 3 시작 -->
				<!-- EL태그 정리 
	               == : eq(equal)
	               != : ne(not equal)
	               <  : lt(less than)
	               >  : gt(greater than)
	               <= : le(less equal)
	               >= : ge(greater equal)
	             -->
	            <c:choose>
	            	<c:when test="${productVO.filename ne null}">
	            		<img src="/images/${productVO.filename}" style="width: 100%;"
							alt="${productVO.pname}" title="${productVO.pname}" />	
	            	</c:when>
	            	<c:otherwise>
	            		<img src="/images/pingu.gif" style="width: 100%;"
							alt="이미지가 없습니다." title="이미지가 없습니다." />
	            	</c:otherwise>
	            </c:choose>
<%-- 				<c:if test="${productVO.filename!=null}"> --%>
<%-- 					<img src="/images/${productVO.filename}" style="width: 100%;" --%>
<%-- 						alt="${productVO.pname}" title="${productVO.pname}" />	 --%>
<%-- 				</c:if> --%>
<%-- 				<c:if test="${productVO.filename==null}"> --%>
<!-- 					<img src="/images/pingu.gif" style="width: 100%;" -->
<%-- 						alt="이미지가 없습니다." title="이미지가 없습니다." />	 --%>
<%-- 				</c:if> --%>
				<!-- 실습 3 끝 -->
			</div>
			<div class="col-md-6">
				<h3>${productVO.pname}</h3>
				<p>${productVO.description}</p>
				<p>
					<b>상품 코드 : </b> <span class="badge badge-danger">
						${productVO.productId} </span>
				</p>
				<p>
					<b>제조사 : </b>${productVO.manufacturer}</p>
				<p>
					<b>분 류 : </b>${productVO.category}</p>
				<p>
					<b>제고수 : </b>${productVO.unitsInStock}</p>
				<h4>
					가격 :
					<fmt:formatNumber value="${productVO.unitPrice}" pattern="#,###"></fmt:formatNumber>
				</h4>
				<!-- 실습 2 시작 -->
				<p>
<!-- 					<a href="#" class="btn btn-info" >상품 주문&raquo;</a> -->
<!-- 					<a href="#" class="btn btn-warning">장바구니&raquo;</a> -->
<!-- 					<a href="/product/products" class="btn btn-secondary">상품 목록&raquo;</a> -->
					<!-- 실습 4 시작 : 윗 두줄 주석처리 -->
					<form name='addForm' action="/product/addCart" method="post">
						<input type="hidden" name="productId" value="${productVO.productId}" />
						<button type="submit"" class="btn btn-info" id="cartInput" >상품 주문&raquo;</button>
						<a href="/product/cart" class="btn btn-warning">장바구니&raquo;</a>
						<a href="/product/products" class="btn btn-secondary">상품 목록&raquo;</a>
					</form>
					<!-- 실습 4 끝 -->
				</p>
				<!-- 실습 2 끝 -->
			</div>
		</div>
	</div>
	<!-- 실습 1 끝 -->
	
<!-- 실습 5 시작 -->
<script type="text/javascript">
document.addEventListener("DOMContentLoaded" ,() =>{
	const loginForm = document.querySelector("form[name='addForm']");
	
	loginForm.addEventListener("submit",(event)=>{
		//폼 제출 동작을 막음
		event.preventDefault();
		
		console.log("개똥이");
		let productId = document.querySelector("input[name='productId']").value;
		console.log("productId : ", productId);
		
		
		if(productId==null || productId==""){
			alert("상품아이디가 없습니다.");
			return;
		}
		loginForm.submit();
	})
})	
</script>
<!-- 실습 5 끝 -->

	<!-- /// footer 시작 /// -->
	<%@ include file="./footer.jsp"%>
	<!-- /// footer 끝 /// -->

</body>
</html>