<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!DOCTYPE html>
<html>
<head>
<title></title>
<script type="text/javascript">
	function checkForm(e){
		e.preventDefault();
		let id = document.loginForm.id.value;
		let passwd = document.loginForm.passwd.value;
		
		console.log("id : ", id, "passwd : ",passwd);
	}
	document.addEventListener("DOMContentLoaded",()=>{
		//폼 엘리먼트 가져오기
		const loginForm = document.getElementById("loginForm");

		loginForm.addEventListener("submit",(event)=>{
			event.preventDefault();
			const name = document.querySelector("input[name='name']");
			
			console.log("name : ",name.value)
			
			// 실습 1 시작
			// 이름은 숫자로 시작할 수 없고 문자로 시작해야 함
			// 정규표현식 생성 (문자형식) , [a-z] : a~z 사이의 한글자의 문자
			let regExp = /^[a-zA-Z가-힣]/;
			// 문자형식이 아닌 경우
			if(!regExp.test(name.value)){
				alert("이름은 숫자로 시작할 수 없습니다.");
				return;
			}
			// 실습 1 끝
		});
	});


</script>
</head>
<body>

<%@ include file="../menu.jsp"%>

 <div class="jumbotron">
    <!-- container : 이 안에 내용있다 -->
    <div class="container">
       <h1 class="display-3">유효성검사04_2(정규 표현식)</h1>
    </div>
 </div>

<!-- /// body 시작 /// -->

<form name="loginForm" id="loginForm" action="/valid/validation03_process" method="post">
	<p>이름 : <input type="text" name="name"/></p>
	<p><input type="submit" value="전송" /></p>
</form>

<!-- /// body 끝 /// -->

<%@ include file="../footer.jsp"%>

</body>
</html>