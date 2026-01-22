<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="./include/header.jsp" %>

<script type="text/javascript" src="/js/jquery-3.6.0.js"></script>

<!-- ///// content 시작 ///// -->

<div class="jumbotron">
   <div class="container">
      <h1 class="display-3">로그인</h1>
   </div>
</div>

<!-- -------------------- 로그인 폼 시작 --------------------- -->
<!-- container : 내용이 들어옵니다 -->
<div class="container" align="center">
   <div class="col-md-4 col-md-offset-4">
      <h3 class="form-signin-heading">Please sign in</h3>
      <!-- 실습 1 시작 -->
      <c:if test="${param.error ne null}">
	    <div class="alert alert-danger">아이디와 비밀번호를 확인해주세요!</div>
	</c:if>
	<!-- 실습 1 끝 -->
      <!-- p.350 <auth-method>FORM</auth-method> FORM인증 처리 기법 사용 -->
      <form class="form-signin" action="/login" method="post">
         <!-- 아이디 입력 영역, j_username는 고정 -->
         <div class="form-group">
            <label for="inputUserName" class="sr-only">User Name</label>
            <input type="text" class="form-control" placeholder="ID"
               name="username" required autofocus />
         </div>
         <!-- 비밀번호 입력 영역, j_password도 고정 -->
         <div class="form-group">
            <label for="inputPassword" class="sr-only">Password</label>
            <input type="password" class="form-control" placeholder="Password"
               name="password" required autofocus />
         </div>
         <!-- submit버튼 영역 -->
         <!-- button type="button/submit/reset" -->
         <button class="btn btn btn-lg btn-success btn-block" type="submit">
         로그인</button>
      </form>
   </div>
</div>

<!-- ///// content 끝 ///// -->

<%@ include file="./include/footer.jsp" %>   
