<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html>
<html>
<head>
<title>대덕의 쇼핑몰</title>

</head>
<body>
	<!-- /// menu.jsp 시작  -->
	<%@ include file="../menu.jsp"%>
	<!-- /// menu.jsp 끝 /// -->

<!-- 실습 2 시작 form 태그에 id="frmSubmit" 추가 -->
<script type="text/javascript">
	$(function(){
		$("#btnDelete").on("click", function(){
			console.log("sadfasdg");
			
			let chk = confirm("삭제하시겠습니까?");
			if(chk){
				console.log("2222");
			$("#frmSubmit").attr("action","/item/deletePost");
			$("#frmSubmit").submit(); 
			} else {
				alert("삭제가 취소되었습니다.")
			}
		});	
	});
</script>
<!-- 실습 2 끝 -->

	<!-- /// 제목 시작 /// -->
	<div class="jumbotron">
		<!-- container : 내용이 들어갈 때 -->
		<div class="container">
			<h1 class="display-3">단일 파일업로드 상세</h1>
		</div>
	</div>
	<!-- /// 제목 끝 /// -->

	<!-- 
		ItemVO(itemId=1, itemName=삼성태블릿, price=120000, description=쓸만함
	      , pictureUrl=/2025/09/08/asdldfksj_개똥이.jpg, uploadFile=
	   model.addAttribute("itemVO", itemVO);
	   
	 readonly vs disabled
	 submit 시   submit 시
	 값이 넘어감   값이 안넘어감
	 -->
	<form id="frmSubmit" action="/item/registerPost" method="post"
		enctype="multipart/form-data">
		<input type="hidden" value="${itemVO.itemId }" name="itemId"/>
		<table>
			<tr>
				<th>상품명</th>
				<td><input type="text" name="itemName"
					value="${itemVO.itemName}" readonly required placeholder="상품명" /></td>
			</tr>
			<tr>
				<th>가격</th>
				<td><input type="text" name="price" value="${itemVO.price}" readonly 
					required placeholder="가격" /></td>
			</tr>
			<tr>
				<th>상품이미지</th>
				<td>
					 <!-- <input type="file" name="uploadFile" placeholder="상품이미지" /> -->
					<!-- 실습 3 시작 : 밑의 img 태그 주석 처리 -->
<%-- 					<p>${itemVO.fileGroupVO.fileDetailVOList}</p> --%>
					<c:forEach var="fileDetailVO" items="${itemVO.fileGroupVO.fileDetailVOList}" varStatus="stat">
						<p><img src="/upload${fileDetailVO.fileSaveLocate}" style="width: 250px; height: 250px;" /></p>
					</c:forEach>
					<c:if test="${empty itemVO.fileGroupVO.fileDetailVOList}">
					    <p><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2C5sO5e_L12esPowZDTCLf362e5LQPSentw&s" style="width: 250px; height: 250px;"/></p>
					</c:if>
					<!-- 실습 3 끝 -->
<%-- 					<img src="/upload${itemVO.pictureUrl}" style="width: 250px; height: 250px;" /> --%>
				</td>
			</tr>
			<tr>
				<th>개요</th>
				<td><input type="text" name="description" readonly 
					value="${itemVO.description}" placeholder="개요" /></td>
			</tr>
		</table>
		<a href="/item/edit?itemId=${itemVO.itemId }" class="btn btn-warning">수정</a>
		<button type="button" id="btnDelete" class="btn btn-danger">삭제</button>
		<a type="button" href="/item/list" class="btn btn-success">목록</a>
	</form>
	<hr />

	<!-- /// footer.jsp 시작 /// -->
	<%@ include file="../footer.jsp"%>
	<!-- /// footer.jsp 끝 /// -->
</body>
</html>