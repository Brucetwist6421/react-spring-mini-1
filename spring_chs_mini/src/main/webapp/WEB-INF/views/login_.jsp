<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="./include/header.jsp" %>

<script type="text/javascript" src="/js/jquery-3.6.0.js"></script>

<!-- ///// content 시작 ///// -->

<section class="d-flex vh-100">
  <div class="container-fluid row justify-content-center align-content-center">
    <div class="card bg-dark" style="border-radius: 1rem;">
      <div class="card-body p-5 text-center">
        <h2 class="text-white">LOGIN</h2>
        <!-- 실습 2 시작 -->
        <c:if test="${message!=null}">
	        <p class="text-white-50 mt-2 mb-5">${message}</p>
        </c:if>
        <!-- 실습 2 끝 -->
        <p class="text-white-50 mt-2 mb-5">서비스를 사용하려면 로그인을 해주세요!</p>

        <div class = "mb-2">
          <form action="/login" method="POST">
<%--             <input type="hidden" name="${_csrf?.parameterName}" value="${_csrf?.token}" /> --%>
            <div class="mb-3">
              <label class="form-label text-white">ID</label>
<!--               <input type="email" class="form-control" name="username"> -->
              <!-- 실습 3 시작 : 바로 윗 줄 주석 처리 -->
              <input type="text" class="form-control" name="username">
              <!-- 실습 3 끝 -->
            </div>
            <div class="mb-3">
              <label class="form-label text-white">Password</label>
              <input type="password" class="form-control" name="password">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>

          <button type="button" class="btn btn-secondary mt-3" onclick="location.href='/signup'">회원가입</button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ///// content 끝 ///// -->

<%@ include file="./include/footer.jsp" %>   
