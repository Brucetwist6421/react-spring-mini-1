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
       <h1 class="display-3">장바구니</h1>
    </div>
 </div>

<!-- /// body 시작 /// -->
<!-- 실습 1 시작 -->
<p>${list}</p>
<!-- // 장바구니 상품 목록 시작 // -->
<div class="row">
	<table style="width: 100%;">
		<tr>
			<td style="text-align: left;">
				<a href="/product/deleteCart?cartId=${cartId}" class="btn btn-danger">삭제하기</a>
			</td>
			<td style="text-align: center;">
				<a href="/product/products" class="btn btn-secondary">목록으로이동</a>
			</td>
			<td style="text-align: right;">
<!-- 				<a href="#" class="btn btn-success">주문하기</a> -->
				<!-- 실습 4 시작 -->
				<a href="/product/shippingInfo?cartId=${cartId}" class="btn btn-success">주문하기</a>
				<!-- 실습 4 끝 -->
			</td>
		</tr>
	</table>
</div>
<!-- 실습 1 끝 -->
<!-- 실습 2 시작 -->
<!-- padding-top : 영역의 위쪽 여백 -->
<div style="padding-top: 50px;">
	<p></p>
	<table class="table table-hover">
		<thead>
			<tr>
				<th>상품</th>
				<th>가격</th>
				<th>수량</th>
				<th>금액</th>
				<th>비고</th>
			</tr>
		</thead>
		<tbody>
			<c:if test="${fn:length(list)==0 }">
				<tr style="text-align: center;">
					<td colspan="5" style="text-align: center;">장바구니에 상품이 없습니다.</td>
				</tr>
			</c:if>
			<!-- forEach 태그? 배열(String[], int[][]), Collection(List, Set) 또는 
               Map(HashTable, HashMap, SortedMap)에 저장되어 있는 값들을 
               순차적으로 처리할 때 사용함. 자바의 for, do~while을 대신해서 사용함
               var : 변수
               items : 아이템(배열, Collection, Map)
               varStatus : 루프 정보를 담은 객체 활용
                  - index : 루프 실행 시 현재 인덱스(0부터 시작)
                  - count : 실행 회수(1부터 시작. 보통 행번호 출력)
                  
               model.addAttribute("list", list);
             -->
			<c:forEach var="productVO" items="${list}" varStatus="stat"> 
				<!-- 촣 금액 -->
				<c:set var="amt" value="${amt + (productVO.unitPrice * productVO.quantity)}"/>
				<tr>
					<td>${productVO.productId}-${productVO.pname}</td>
					<td><fmt:formatNumber value="${productVO.unitPrice}" pattern="#,###"/> </td>
					<td>${productVO.quantity}</td>
					<td>
						<fmt:formatNumber value="${productVO.unitPrice * productVO.quantity}" pattern="#,###"/> 
					</td>
					<td>
						<!--  실습 3 시작 -->
						<a href="/product/removeCart?productId=${productVO.productId}"
							class="badge badge-danger">
							삭제
						</a>
						<!--  실습 3 끝 -->
					</td>
				</tr>
			</c:forEach>
		</tbody>
		<c:if test="${fn:length(list)>0 }">
			<tfoot>
				<tr>
					<th></th>
					<th></th>
					<th>총액</th>
					<th><fmt:formatNumber value="${amt}" pattern="#,###"/></th>
					<th></th>
				</tr>
			</tfoot>
		</c:if>
	</table>
</div>
<!-- 실습 2 끝 -->
<!-- // 장바구니 상품 목록 끝 // -->
<!-- /// body 끝 /// -->

<%@ include file="./footer.jsp"%>

</body>
</html>