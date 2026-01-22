<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>도서 상세</title>
<script type="text/javascript" src="/js/jquery.min.js"></script>

<script type="text/javascript">
	//document의 모든 엘리먼트가 완전히 로드되면 실행
	// 	$(function(){
	// 		$("#btnDelete").on("click",function(){
	// 			$("#frm").attr("action","/deletePost");
	// 			$("#frm").submit();
	// 		})
	// 	});
	
	// 자바스크립트로 리팩토링
	document.addEventListener("DOMContentLoaded", () => {
		const btnDelete = document.getElementById("btnDelete");

		btnDelete.addEventListener("click", function(){
			const frm = document.querySelector("#frm");
			
			// 속성
			frm.setAttribute("action","/deletePost");
			
			frm.submit();
		})//end btnDelete
	});//end DOMContentLoaded
</script>
</head>
<body>

	<h1>도서 상세</h1>
	<!-- mav.addObject("bookVO", bookVO); -->
	<!--  EL(Expression Language) : 표현어 
   model의 속성명을 쓰면 매핑된 객체(실체)로 치환됨
   -->
	<p>${bookVO}</p>

	<!-- 
   요청URI : /create
   요청파라미터(HTTP파라미터) : {title=개똥이의 모험, category=소설, price=12000}
   요청방식 : post
   
   get방식 : 주소표시줄에 요청파라미터가 노출됨
   post방식 : 주소표시줄에 요청파라미터가 노출되지 않음. 주소창에 변화 없이
            데이터만 서버로 전달 됨
            
   required 속성 : 필수입력
   -->
	<!-- 폼 페이지 -->
	<!-- 
   요청URI : /create
   요청파라미터
   요청방식 : post
    -->
	<form id="frm" action="/create" method="post">
		<!-- 폼데이터 -->
		<!--
       명         객체
       bookVO : (bookId=5, title=개똥이의 모험5, category=소설, price=15000, insertDate=25/08/27) 
       -->
		<input type="hidden" name="bookId" value="${bookVO.bookId}" />
		<p>
			제목 : <input type="text" name="title" value="${bookVO.title}" required
				readonly placeholder="제목" />
		</p>
		<p>
			카테고리 : <input type="text" name="category" value="${bookVO.category}"
				required readonly placeholder="카테고리" />
		</p>
		<p>
			가격 : <input type="number" name="price" required
				value="${bookVO.price}" readonly placeholder="가격" />
		</p>
		<p>
			<!-- <form>~</form> 태그 안에 내용이 서버로 전송됨
               서버로 전달되는 항목들은 form 태그 안에 존재해야 함.
               name 속성은 key로, value 속성을 value로 판단함
               
         요청URI : /modify?bookId=3
         요청파라미터 : bookId=3
         요청방식 : get
          -->
			<a href="/modify?bookId=${bookVO.bookId}">수정</a>
			<button type="button" id="btnDelete">삭제</button>
			<input type="button" value="목록"
				onclick="javascript:location.href='/list'" />
		</p>
	</form>
</body>
</html>



