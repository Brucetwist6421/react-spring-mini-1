<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<title></title>
<script type="text/javascript">
//달러(function())
	document.addEventListener("DOMContentLoaded",()=>{
	   //폼 엘리먼트를 가져와보자
	   const loginForm = document.getElementById("loginForm");
	
	   //폼 제출(submit) 이벤트를 감지함
	   //event : submit 이벤트
	   loginForm.addEventListener("submit",(event)=>{
	      //폼 제출 동작을 막음
	      event.preventDefault();
	      
	      // 실습 1 시작
	      let name = document.querySelector("input[name='name']");
	      console.log("name : ",name.value);
	      // 정규표현식(Regular Expression)
	      // 1) test() : 판단(true/false)
	      // 2) exec() : 추출
	      let regExp = /Java/i; //대소문자 무관
	      // 패턴.함수(대상)
	      regExp.exec(name.value);
	      //null 처리
	      if(name.value!=null){
			// 패턴 함수(대상)
			let result = regExp.exec(name.value);
			
			if(result!=null){
				console.log("result : ", result[0]);
			}
		  }
	      
	      if(regExp.test(name.value)){
			console.log("입력 대상이 패턴에 맞음");
	      } else {
	    	console.log("입력 대상이 패턴과 다르다");
		  }
	      // 실습 1 끝
	      
	      // 실습 2 시작
	      // 아이디는 영문 소문자만 가능
	      let id = loginForm.id.value;
	      console.log("id :", id);
	      
	      for(i=0;i<id.length;i++){
			//id : a001
			let ch = id.charAt(i); //i : 0 ~ 4
			console.log("ch :", ch);
	      	if((ch<'a'||ch>'z')&&(ch>='A'||ch<='Z')&&(ch=>'0'||ch<='9')){
				alert("아이디는 영문 소문자만 입력 가능합니다.");
				loginForm.id.select();
				return;
	      	}
	      }
	      
	      // 비밀번호는 숫자만 입력 가능
	      let passwd = loginForm.passwd.value;
	      console.log("passwd :", passwd);
	      if(isNaN(passwd)){
			alert("비밀번호는 숫자만 입력 가능합니다.");
			loginForm.passwd.select();
			return;
	      }
	      // 실습 2 끝
	   });
	});


</script>
</head>
<body>

	<%@ include file="../menu.jsp"%>

	<div class="jumbotron">
		<!-- container : 이 안에 내용있다 -->
		<div class="container">
			<h1 class="display-3">유효성검사04</h1>
		</div>
	</div>

	<!-- /// body 시작 /// -->

	<form name="loginForm" id="loginForm"
		action="/valid/validation03_process" method="post">
		<p>
			아이디 : <input type="text" name="id" />
		</p>
		<p>
			비밀번호 : <input type="password" name="passwd" />
		</p>
		<p>
			이름 : <input type="text" name="name" />
		</p>
		<p>
			<input type="submit" value="전송" />
		</p>
	</form>

	<!-- /// body 끝 /// -->

	<%@ include file="../footer.jsp"%>

</body>
</html>