<%@ page language="java" contentType="text/html; charset=UTF-8"%>

<!-- <script type="text/javascript"> -->
<!-- 실습 2 시작 -- 실습 1 주석 처리, 위의 스크립트 시작 태그 주석처리  -->
<script type="text/javascript" src="/js/validation02.js">
// 실습 2 끝
	// 실습 1 시작
// 	document.addEventListener("DOMContentLoaded",()=>{
// 		 const frm = document.querySelector("form[name='Member']");
	
// 		frm.addEventListener("submit",(event)=>{
// 			event.preventDefault();
			
// 			let id = document.querySelector("input[name='id']");
			
// 			let passwd = document.querySelector("input[name='passwd']");
			
// 			let name = document.querySelector("input[name='name']");
			
// 			let phone1 = document.querySelector("select[name='phone1']");
// 			let phone2 = document.querySelector("input[name='phone2']");
// 			let phone3 = document.querySelector("input[name='phone3']");
			
// 			let email = document.querySelector("input[name='email']");
			
// 			let data = {
// 				"id":id.value,
// 				"passwd":passwd.value,
// 				"name":name.value,
// 				"phone1":phone1.value,
// 				"phone2":phone2.value,
// 				"phone3":phone3.value,
// 				"email":email.value,
// 			};
// 			console.log("data : ", data);
			
// 			// 아이디는 문자로 시작
// 			let regExpId = /^[a-zA-Z가-힣]/;
			
// 			// 이름은 한글만 입력. 웃음으로 시작하여 돈으로 끝내자
// 			//+ : 1 이상(필수), * : 0 이상(선택)
// 			let regExpName = /^[가-힣]+$/;
// 			// 비밃번호는 숫자만 입력
// 			let regExpPasswd = /^[0-9]+$/;
// 			// 연락처 형식 준수
// 			let regExpPhone = /^\d{3}-\d{3,4}-\d{4}$/;
// 			// 이메일 형식 준수
// 			let regExpEmail 
// 			= /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
// 			//아이디는 문자로 시작
// 		    if(!regExpId.test(data.id)){
// 				alert("아이디는 문자로 시작해주세요.");
// 				id.select();
// 				return;
// 		    }
// 	        //비밀번호는 숫자만 입력
// 		    if(!regExpPasswd.test(data.passwd)){
// 				alert("비밀번호는 숫자만 입력해주세요.");
// 				passwd.select();
// 				return;
// 		    } 
// 	        //이름은 한글만 입력
// 		    if(!regExpName.test(data.name)){
// 				alert("이름은 한글만 입력해주세요.");
// 				name.select();
// 				return;
// 		    } 
// 	        //연락처 형식 준수(010-111-2222, 010-1111-2222)
// 	        let phone = data.phone1 + "-" + data.phone2 + "-" + data.phone3
	        
// 	        //JSON 오브젝트인 data 오브젝트에 phone 이라는 키와 값을 추가
// 	        data.phone = phone;
// 		    if(!regExpPhone.test(phone)){
// 				alert("연락처를 확인해주세요.");
// 				phone2.select();
// 				return;
// 		    }  
// 	        //이메일 형식 준수(02test-_\.02test@naver-_\..com(kr))
// 		    if(!regExpEmail.test(data.email)){
// 				alert("이메일 형식을 확인해주세요.");
// 				email.select();
// 				return;
// 		    } 
	         
// 	         //유효성검사 통과
// 		});	
// 	});
	// 실습 1 끝
</script>
</head>
<body>
	<%@ include file="../menu.jsp"%>

	<div class="jumbotron">
		<!-- container : 이 안에 내용있다 -->
		<div class="container">
			<h1 class="display-3">유효성검사05(정규 표현식)</h1>
		</div>
	</div>

	<form action="validation05_process.jsp" name="Member" method="post">
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
			연락처 : <select name="phone1">
				<option value="010">010</option>
				<option value="011">011</option>
				<option value="016">016</option>
				<option value="017">017</option>
				<option value="019">019</option>
			</select> - <input type="text" maxlength="4" size="4" name="phone2" /> - <input
				type="text" maxlength="4" size="4" name="phone3" />
		</p>
		<p>
			이메일 : <input type="text" name="email" />
		</p>
		<p>
			<input type="submit" value="가입하기" />
		</p>
	</form>

	<%@ include file="../footer.jsp"%>

</body>
</html>








