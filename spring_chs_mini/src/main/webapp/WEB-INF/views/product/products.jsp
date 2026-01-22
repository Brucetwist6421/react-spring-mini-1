<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<!-- 실습 2 시작 -->
<%@ include file="./menu.jsp"%>
<!-- 실습 2 끝 -->

<!-- 실습 3 시작 -->
<div class="jumbotron">
	<!-- container : 안에 내용이 들어간다. -->
	<div class="container">
		<h1 class="display-3">상품 목록</h1>
	</div>
</div>
<!-- 실습 3 끝 -->


<!-- 실습 1 시작 -->
<%-- <p>${productVOList}</p> --%>
<!-- 실습 1 끝 -->

<!-- 실습 4 시작 -->
<!-- 상품 목록 시작 -->
<div class="container">
	<div class="row" align="center">
		<c:forEach var="productVO" items="${productVOList}" varStatus="stats">
			<div class="col-md-4">
				<!-- 실습 5 시작 -->
<%-- 				<img src="/images/${productVO.filename}" style="width: 100%;" --%>
<%-- 					alt="${productVO.pname}" title="${productVO.pname}" /> --%>
				<!-- 실습 5 끝 -->
				<!-- 실습 9 진행 : 구현 후 실습 5 주석 처리-->
				<!-- EL태그 정리 
	               == : eq(equal)
	               != : ne(not equal)
	               <  : lt(less than)
	               >  : gt(greater than)
	               <= : le(less equal)
	               >= : ge(greater equal)
	             -->
				<c:if test="${productVO.filename!=null}">
					<img src="/images/${productVO.filename}" style="width: 100%;"
					alt="${productVO.pname}" title="${productVO.pname}" />	
				</c:if>
				<c:if test="${productVO.filename==null}">
					<img src="/images/pingu.gif" style="width: 100%;"
					alt="이미지가 없습니다." title="이미지가 없습니다." />	
				</c:if>
				<!-- 실습 9 끝 -->
				<h3>${productVO.pname}</h3>
				<p>${productVO.description}</p>
<%-- 				<p>${productVO.unitPrice}</p> --%>
				<!-- 실습 6 진행 : 구현 후 <p>${productVO.unitPrice}</p> 주석 처리-->
				가격 : <fmt:formatNumber value="${productVO.unitPrice}" pattern="###,###" />
				<!-- 실습 6 끝 -->
				<!-- 실습 7 진행 -->
				<p>
					<a href="/product/product?productId=${productVO.productId}"
						class="btn btn-secondary" role="button"> 상세정보&raquo;</a>
				</p>
				<!-- 실습 7 끝 -->
			</div>
		</c:forEach>
		<!-- 실습 8 진행 -->
		<div class="form-group row">
			<!-- 
	        col-sm-10
	         그리드 시스템에서 12칸 중 10칸을 차지하겠다는 의미입니다.
	         sm은 "small" 이상의 화면 크기에서 적용된다는 뜻 (≥576px).
	         즉, 작은 화면 이상에서 이 div는 가로 폭의 10/12 (약 83.3%)를 차지합니다.
	        col-sm-offset-2
	         이건 예전 Bootstrap (v3)에서 사용하는 문법입니다.
	         offset-2는 왼쪽에 2칸을 비워서 여백을 만들겠다는 뜻입니다.
	         즉, 총 12칸 중 왼쪽 2칸은 비우고, 나머지 10칸을 차지하는 구조.
	        -->
			<div class="col-sm-offset-2 col-sm-10">
				<!-- 
		          요청URI : /product/addProduct
		          요청파라미터 : 
		          요청방식 : get
		        -->
				<a href="/product/addProduct" class="btn btn-primary" >상품등록</a>
			</div>
		</div>>
		<!-- 실습 8 끝 -->
	</div>
</div>
<!-- 상품 목록 끝 -->
<!-- 실습 4 끝 -->

<!-- 실습 2 시작 -->
<%@ include file="./footer.jsp"%>
<!-- 실습 2 끝 -->
