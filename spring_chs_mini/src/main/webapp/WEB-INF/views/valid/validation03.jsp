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
			const id = document.querySelector("input[name='id']").value;
			const passwd = document.querySelector("input[name='passwd']").value;
			console.log("id : ", id, "passwd : ",passwd);
			
			if(id==""){
				alert("아이디를 입력해주세요.");
				document.querySelector("input[name='id']").focus();
				return false;
			} else if (passwd==""){
				alert("비밀번호를 입력해주세요.");
				document.querySelector("input[name='passwd']").focus();
				return;
			}
			
			// 실습 1 시작
			
			// 아이디 : 4 ~ 12 자 이내 입력
			if(id.length<4 || id.length>12){
				alert("아이디는 4~12자 이내로 입력 가능합니다.")
				document.querySelector("input[name='id']").select();
				return;
			}
			
			// 비밀번호 : 4자 이상 입력
			if(passwd.length<4){
				alert("비밀번호는 4자 이상 입력 가능합니다.")
				document.querySelector("input[name='passwd']").select();
				return;
			}
			
			// 통과하면 submit 처리
			loginForm.action = "/valid/validation03_process";
			loginForm.methd = "post";
			
			loginForm.submit();
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
       <h1 class="display-3">유효성검사03</h1>
    </div>
 </div>

<!-- /// body 시작 /// -->

<form name="loginForm" id="loginForm" action="/valid/validation03_process" method="post">
	<p>아이디 : <input type="text" name="id"/></p>
	<p>비밀번호 : <input type="password" name="passwd"/></p>
	<p><input type="submit" value="전송" /></p>
</form>

<!-- /// body 끝 /// -->

<%@ include file="../footer.jsp"%>

</body>
</html>