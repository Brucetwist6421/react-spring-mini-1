<%@page import="kr.or.ddit.vo.ProductVO"%>
<%@page import="java.util.List"%>
<%@page import="java.net.URLDecoder"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
<script type="text/javascript" src="/js/jquery.min.js"></script>  
<title>상상의 쇼핑몰</title>
</head>
<body>
	<!-- /// menu.jsp 시작 
	../ : 상위 폴더
	/// -->
	<%@ include file="../menu.jsp" %>
	<!-- /// menu.jsp 끝 /// -->
	 <!-- /// 제목 시작 /// -->
	<div class="jumbotron">
		<!-- container : 내용이 들어갈 때 -->
		<div class="container">
			<h1 class="display-3">주문 정보</h1>
		</div>
	</div>
	<!-- /// 제목 끝 /// -->
	<!-- /// 내용 시작 /// -->
	<div class="container col-8 alert alert-info">
		<div class="text-center">
			<h1>영수증</h1>
		</div>
		<!-- 고객 정보 시작 : cookie사용-->
		<div class="row justify-content-between">
			<strong>배송 주소</strong><br />
			성명 : <span id="spnName"></span><br />
			우편번호 : <span id="spnZipCode"></span><br />
			주소 : <span id="spnAddress">&nbsp;</span>
		</div>
		<div class="col-4" align="right">
			<p>
				<em>배송일 : </em>
			</p>
		</div>
		<!-- 고객 정보 끝 ---->
		<!-- 장바구니 정보 시작 : session 사용 
		-->
		<div>
			<table class="table table-hover">
				<thead>
					<tr>
						<th class="text-center">상품명</th>
						<th class="text-center">#</th>
						<th class="text-center">가격</th>
						<th class="text-center">소계</th>
					</tr>
				</thead>
				<tbody>
					<!-- 
					//1) 세션의 이름인 cartlist를 통해 ProductVO타입의 상품목록 리스트를 가져와보자 
					
					//2) JSTL의 forEach 태그를 사용하여(viv) 반복처리 해보자
					
					//3) 총계를 내보자
					-->
					<!-- 실습 1 시작 -->
					<!-- 반복 시작 -->
					<!-- model.addAttribute("list",         list); -->
					<!-- List<ProductVO> list -->
					<c:forEach var="productVO" items="${list}">
						<c:set var="amt" value="${amt + (productVO.unitPrice * productVO.quantity)}"></c:set>
						<tr>
							<!-- JSTL 변수는 EL로 표현함 -->
							<td class="text-center"><em>${productVO.pname}</em></td>
							<td class="text-center">${productVO.quantity}</td>
							<td class="text-center">
								 ${productVO.unitPrice}원
							</td>
							<td class="text-center">
								 ${productVO.unitPrice * productVO.quantity}원
							</td>
						</tr>
					</c:forEach>
					<!-- 반복 끝 -->
					<!-- 총계 시작 -->
					<tr>
						<td></td>
						<td></td>
						<td class="text-right" style="text-align:right;"><strong>총액:</strong></td>
						<td class="text-center text-danger" style="text-align:center;color:red;"><strong>
							${amt}원
						</strong></td>
					</tr>
					<!-- 총계 끝 -->
					<!-- 실습 1 끝 -->
				</tbody>
			</table>
			
			<a href="/product/shippingInfo?cartId="
			class="btn btn-secondary" role="button">이전</a>
			<a href="/product/thankCustomer" class="btn btn-success"
			role="button">주문 완료</a>
			<a href="checkOutCancelled.jsp" class="btn btn-secondary"
			role="button">취소</a>
		</div>
		<!-- 장바구니 정보 끝 : session 사용 -->
	</div>
		
	<!--/product/processShippingInfoAjax-->
	<script type="text/javascript">
	$(function(){
		console.log("개똥이");

		/* Asynchronous Javascript And Xml
		- 웹 서버에 데이터를 요청하고 이를 표시함
		- AJAX를 실행하기 위해서는 필수적으로 서버가 요구됨
		- AJAX는 XMLHttpRequest 객체가 가장 중요함
		- 최신 모든 웹 브라우저에서는 기본적으로 XMLHttpRequest 객체가
			지원됨		-
		- 웹 브라우저가 서버와 정보 교환을 통하여 페이지의 내용을 변경하고자 할 때 
			전체 페이지를 로드하지 않고 웹 페이지의 일부(수정된 부분만)를
			업데이트할 수 있도록 지원함
		*/

		//달러.ajax() : 비동기 AJAX 요청을 수행
    	//달러.ajaxSetup() : 향후 AJAX 요청에 대한 기본 값을 설정
    	//달러.ajax() 메서드를 사용하면 AJAX의 다양한 설정을 미리 할 수 있고,
    	//	응답이 성공했을 때의 처리, 응답이 실패했을 때의 처리를 단락 형태로
    	//	구분하여 처리할 수 있음.
    	//	이들 작업이 완료된 후에 처리해야 할 것이 있으면 추가로 작업할 수 있도록 구분함

		//아작나써유..(피)씨다타써...
		//contentType:보내는타입(application/json;charset:utf-8)
		//dataType:응답타입(json, text)
		//type:get / post / put / delete
		//xhr : XMLHttpRequest 객체는 웹 페이지 뒤에 숨어서 서버와 데이터를 교환하도록 지원함
	});
	</script>

	<!-- /// 내용 끝 /// -->
	
	<!-- /// footer.jsp 시작 /// -->
	<%@ include file="../footer.jsp" %>
	<!-- /// footer.jsp 끝 /// -->
</body>
</html>




