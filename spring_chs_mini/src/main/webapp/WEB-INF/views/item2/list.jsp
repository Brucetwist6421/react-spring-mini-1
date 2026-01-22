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

	<%@ include file="../menu.jsp"%>

	<div class="jumbotron">
		<!-- container : 이 안에 내용있다 -->
		<div class="container">
			<h1 class="display-3">상품 목록</h1>
		</div>
	</div>

	<!-- /// body 시작 /// -->

	<!-- 실습 2 시작 -->
	<!-- 시멘틱 : 의미를 갖는 태그 -->
	<section class="content" style="margin:20px 20px 20px 20px;">
		<div class="container-flud">
			<div class="row">
				<!-- 12 => 100% -->
				<div class="col-md-12">
					<!-- card header -->
					<div class="card">
<!-- 						<div class="card-header"> -->
<!-- 							<h3 class="card-title">Bordered Table</h3> -->
<!-- 						</div> -->
						<!-- /.card-header -->
						<!-- 실습 6 시작 -->
						<div class="col-12 d-flex justify-content-end">
						    <!-- 검색 폼 시작 -->
						    <form id="searchForm" action="/item2/list" method="get" class="d-flex">
						        <label for="searchInput" class="mr-2">Search:</label>
						        <input type="search" id="searchInput" name="keyword" 
						               class="form-control form-control-sm" 
						               placeholder="검색어를 입력하세요" aria-controls="example1">
						        <button type="submit" class="btn btn-sm btn-primary ml-2">상품명 검색</button>
						    </form>
						    <!-- 검색 폼 끝 -->
						    <a class="page-link" href="/item2/register">
						    	등록하기
						    </a>
						</div>
						<!-- 실습 6 끝 -->
						<!-- card body -->
						<div class="card-body">
							<table class="table table-bordered">
								<thead>
									<tr>
										<th style="width: 10px">순번</th>
										<th>상품명</th>
										<th>가격</th>
										<th>상품 썸네일1</th>
										<th>상품 썸네일2</th>
									</tr>
								</thead>
								<tbody>
<!-- 									<tr> -->
<!-- 										<td>1.</td> -->
<!-- 										<td>Update software</td> -->
<!-- 										<td> -->
<!-- 											<div class="progress progress-xs"> -->
<!-- 												<div class="progress-bar progress-bar-danger" -->
<!-- 													style="width: 55%"></div> -->
<!-- 											</div> -->
<!-- 										</td> -->
<!-- 									</tr> -->
									<!-- 실습 3 시작 윗 부분을 해당 내용으로 변경 -->
<%-- 									<c:forEach var="itemVO" items="${itemVOList}" varStatus="stat"> --%>
<%-- 									<c:forEach var="itemVO" items="${articlePage.content}" varStatus="stat"> <!-- 실습 4 시작 위의 c:forEach 태그를 해당 내용으로 변경 --> --%>
<!-- 										<tr> -->
<%-- 											<td>${itemVO.rn}</td> --%>
<%-- 											<td><a href="/item2/detail?itemId=${itemVO.itemId}"> ${itemVO.itemName} </a></td> --%>
<!-- 											<td> -->
<%-- 												<fmt:formatNumber value="${itemVO.price}" pattern="#,###"></fmt:formatNumber>  --%>
<!-- 											</td> -->
<!-- 											<td> -->
<%-- 												<img src="/upload${itemVO.pictureUrl}" style="width: 30px; height: 30px;" /> --%>
<!-- 											</td> -->
<!-- 											<td> -->
<%-- 												<img src="/upload${itemVO.pictureUrl2}" style="width: 30px; height: 30px;" /> --%>
<!-- 											</td> -->
<!-- 										</tr> -->
<%-- 									</c:forEach> --%>
									<!-- 실습 3 끝 -->
									<!-- 실습 8 시작 : 실습 3,4 주석 처리-->
									<c:forEach var="item2VO" items="${articlePage.content}" varStatus="stat">
										<tr>
											<td>${item2VO.rn}</td>
											<td style="padding-left: ${(item2VO.lvl - 1) * 20}px;">
												<c:choose>
									                <c:when test="${item2VO.lvl > 1}">
									                    <span style="color:#aaa;">⤷</span>&nbsp;
									                    <!-- 부모글 제목 추가 -->
									                    <c:out value="${item2VO.parentName}" /> &gt;&nbsp;
									                </c:when>
									            </c:choose>
									            <a href="/item2/detail?itemId=${item2VO.itemId}">
									                ${item2VO.itemName}
									            </a>
											</td>
											<td>
												<fmt:formatNumber value="${item2VO.price}" pattern="#,###"></fmt:formatNumber> 
											</td>
											<td>
												<img src="/upload${item2VO.pictureUrl}" style="width: 30px; height: 30px;" />
											</td>
											<td>
												<img src="/upload${item2VO.pictureUrl2}" style="width: 30px; height: 30px;" />
											</td>
										</tr>
									</c:forEach>
									<!-- 실습 8 끝 -->
								</tbody>
							</table>
						</div>
						<!-- /.card-body -->
						<div class="card-footer clearfix">
							<ul class="pagination pagination-sm m-0 float-right">
								<!-- 실습 5 시작 -->
								<!-- 이전 버튼: 현재 페이지가 1보다 클 때만 출력 -->
<%-- 								<c:if test="${articlePage.currentPage > 1}"> --%>
<!-- 								    <li class="page-item"> -->
								        <!--
								            현재 페이지에서 5를 빼서 이동
								            단, 1보다 작아지면 1로 고정
								            예: 현재 페이지 3 -> 3-5 = -2 -> 1페이지로 이동
								        -->
<!-- 								        <a class="page-link"  -->
<%-- 								           href="?currentPage=${articlePage.currentPage - 5 <= 0 ? 1 : articlePage.currentPage - 5}"> --%>
<!-- 								           « -->
<!-- 								        </a> -->
<!-- 								    </li> -->
<%-- 								</c:if> --%>
								
								<!-- 페이지 번호 반복: startPage ~ endPage 범위 출력 -->
<%-- 								<c:forEach var="i" begin="${articlePage.startPage}" end="${articlePage.endPage}"> --%>
<%-- 								    <li class="page-item  --%>
<!-- 								        현재 페이지와 i가 같으면 'active' 클래스 추가 (부트스트랩 강조 표시) -->
<%-- 								        ${i == articlePage.currentPage ? 'active' : ''}"> --%>
<!-- 								        i번째 페이지로 이동 -->
<%-- 								        <a class="page-link" href="?currentPage=${i}">${i}</a> --%>
<!-- 								    </li> -->
<%-- 								</c:forEach> --%>
								
								<!-- 다음 버튼: 현재 페이지가 전체 페이지 수보다 작을 때만 출력 -->
<%-- 								<c:if test="${articlePage.currentPage < articlePage.totalPages}"> --%>
<!-- 								    <li class="page-item"> -->
								        <!--
								            현재 페이지에서 5를 더해서 이동
								            단, 마지막 페이지(totalPages)보다 크면 totalPages로 고정
								            예: 현재 페이지 98, 전체 100 -> 98+5 = 103 -> 100페이지로 이동
								        -->
<!-- 								        <a class="page-link"  -->
<%-- 								           href="?currentPage=${articlePage.currentPage + 5 > articlePage.totalPages ? articlePage.totalPages : articlePage.currentPage + 5}"> --%>
<!-- 								           » -->
<!-- 								        </a> -->
<!-- 								    </li> -->
<%-- 								</c:if> --%>
								<!-- 실습 5 끝 -->
								<!-- 실습 7 시작 -- 실습 5 주석 처리 -->
								<!-- 이전 버튼 -->
								<c:if test="${articlePage.currentPage > 1}">
								    <li class="page-item">
								        <a class="page-link" 
								           href="?currentPage=${articlePage.currentPage - 5 <= 0 ? 1 : articlePage.currentPage - 5}&keyword=${fn:escapeXml(param.keyword)}">
								           «
								        </a>
								    </li>
								</c:if>
								
								<!-- 페이지 번호 반복 -->
								<c:forEach var="i" begin="${articlePage.startPage}" end="${articlePage.endPage}">
								    <li class="page-item ${i == articlePage.currentPage ? 'active' : ''}">
								        <a class="page-link" href="?currentPage=${i}&keyword=${fn:escapeXml(param.keyword)}">${i}</a>
								    </li>
								</c:forEach>
								
								<!-- 다음 버튼 -->
								<c:if test="${articlePage.currentPage < articlePage.totalPages}">
								    <li class="page-item">
								        <a class="page-link" 
								           href="?currentPage=${articlePage.currentPage + 5 > articlePage.totalPages ? articlePage.totalPages : articlePage.currentPage + 5}&keyword=${fn:escapeXml(param.keyword)}">
								           »
								        </a>
								    </li>
								</c:if>
								<!-- 실습 7 끝 -->
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<!-- 실슬 2 끝 -->

	<!-- /// body 끝 /// -->

	<%@ include file="../footer.jsp"%>

</body>
</html>