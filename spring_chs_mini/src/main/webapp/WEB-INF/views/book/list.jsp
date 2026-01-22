<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<title></title>
</head>
<body>
	<h2>도서 목록</h2>
	<!-- 	param : keyword=개똥이 -->
	<!--    요청URI : /list?keyword=개똥이 or /list or /list?keyword= -->
	<!--    요청파라미터 : keyword=개똥이 -->
	<!--    요청방식 : get 
	
		EL(Expression Language)에서 keyword=개똥이 => param
	-->
	<p>
	<form action="/list" method="get">
		<input type="hidden" name="currentPage" value="1" >
		<input type="text" name="keyword" value="${param.keyword}" placeholder="검색어를 입력하세요">
		<button type="submit" id="btnSearch">검색</button>
	</form>
	</p>
	<%-- 	<p>${bookVOList}</p> --%>
	<table border="1">
		<thead>
			<tr>
				<th>번호</th>
				<th>제목</th>
				<th>카테고리</th>
				<th>가격</th>
			</tr>
		</thead>
		<tbody id="bookTbody">
			<!-- 
         forEach 태그? 배열(String[], int[][]), Collection(List, Set) 또는 
         Map(HashTable, HashMap, SortedMap)에 저장되어 있는 값들을 
         순차적으로 처리할 때 사용함. 자바의 for, do~while을 대신해서 사용함
         var : 변수
         items : 아이템(배열, Collection, Map)
         varStatus : 루프 정보를 담은 객체 활용
            - index : 루프 실행 시 현재 인덱스(0부터 시작)
            - count : 실행 회수(1부터 시작. 보통 행번호 출력)
          -->
			<!-- data : mav.addObject("bookVOList", bookVOList); -->
			<!-- row : bookVO 1행 -->
			<c:forEach var="bookVO" items="${articlePage.content}" varStatus="stat">
<%-- 			<c:forEach var="bookVO" items="${bookVOList}" varStatus="stat"> --%>
				<tr>
					<td>${bookVO.rnum}</td>
					<td><a href="/detail?bookId=${bookVO.bookId}">${bookVO.title}</a></td>
					<td>${bookVO.category}</td>
					<td>${bookVO.price}</td>
				</tr>
			</c:forEach>
		</tbody>
		<tfoot>
			<tr>
				<td colspan="4" style="text-align: center;">
				
					<!-- 이전 버튼 -->
		            <c:if test="${articlePage.startPage > 1}">
		                <a href="/list?currentPage=${articlePage.startPage-5}&keyword=${param.keyword}">[이전]</a>
		            </c:if>
		            <c:if test="${articlePage.startPage <= 1}">
		                <span style="color: gray;">[이전]</span>
		            </c:if>
		            &nbsp;
		
		            <!-- 페이지 번호 출력 -->
		            <c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}" step="1">
		                <a href="/list?currentPage=${pNo}&keyword=${param.keyword}">[${pNo}]</a>
		            </c:forEach>
		            &nbsp;
		
		            <!-- 이후 버튼 -->
		            <c:if test="${articlePage.endPage < articlePage.totalPages}">
		                <a href="/list?currentPage=${articlePage.startPage+5}&keyword=${param.keyword}">[이후]</a>
		            </c:if>
		            <c:if test="${articlePage.endPage >= articlePage.totalPages}">
		                <span style="color: gray;">[이후]</span>
		            </c:if>
					<!-- 
					<a href="/list?currentPage=${articlePage.startPage-5}&keyword=${param.keyword}">[이전]</a>
               		&nbsp;
					<c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}" step="1">
						<a href="/list?currentPage=${pNo}&keyword=${param.keyword}">[${pNo}]</a>
					</c:forEach>
					<a href="/list?currentPage=${articlePage.startPage+5}&keyword=${param.keyword}">[이후]</a>
               		&nbsp;
               		 -->
					<!--  <a href="/list?currentPage=1&keyword=${param.keyword}">[1]</a> 
					<a href="/list?currentPage=2&keyword=${param.keyword}">[2]</a> 
					<a href="/list?currentPage=3&keyword=${param.keyword}">[3]</a> 
					<a href="/list?currentPage=4&keyword=${param.keyword}">[4]</a> 
					<a href="/list?currentPage=5&keyword=${param.keyword}">[5]</a>  --> 
				</td>
			</tr>
		</tfoot>
		<p>
			<a href="/create">책 생성</a>
		</p>
	</table>
</body>
</html>