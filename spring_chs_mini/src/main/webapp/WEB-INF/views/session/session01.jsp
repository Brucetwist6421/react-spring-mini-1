<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ page isErrorPage="true" %>
<!DOCTYPE html>
<html>
<head>
<title></title>
</head>
<body>
	<!-- 실습 1 시작 -->
	<% //내장 객체
// 	session.getId();
// 	request.setAttribute("test","개똥이");
// 	pageContext.setAttribute("test","말똥이");
// 	application.setAttribute("test","소똥이");
// 	out.print("토끼똥");
// 	exception.getMessage();
	%>
	<!-- 실습 1 끝 -->
	<!-- 아이디, 비밀번호, submit버튼(전송) 
	요청URI : session01_process.jsp
	요청파라미터 : {id=admin&passwd=java}
	요청방식 : post
	-->
	<form action="/session/session01_process" method="post">
		<p>아이디 : <input type="text" name="id" required placeholder="아이디" /></p>
		<p>비밀번호 : <input type="text" name="passwd" required placeholder="비밀번호" /></p>
		<p><input type="submit" value="전송" /></p>
	</form>
</body>
</html>


