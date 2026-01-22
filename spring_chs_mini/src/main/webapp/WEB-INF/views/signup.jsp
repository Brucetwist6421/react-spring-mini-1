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
        <h2 class="text-white">SIGN UP</h2>
        <p class="text-white-50 mt-2 mb-5">서비스 사용을 위한 회원 가입</p>

        <div class = "mb-2">
          <!-- 
          요청URI : /user
          요청파라미터 : request{email=test@test.com,password=asdf}
          요청방식 : post
           -->
          <form action="/user" method="POST">
            <!-- 토큰을 추가하여 CSRF 공격 방지 -->
<%--             <input type="hidden" name="${_csrf?.parameterName}" value="${_csrf?.token}" /> --%>
            <div class="mb-3">
              <label class="form-label text-white">Email address</label>
              <input type="email" class="form-control" name="email" placeholder="이메일 주소" required />
            </div>
            <div class="mb-3">
              <label class="form-label text-white">Password</label>
              <input type="password" class="form-control" name="password" placeholder="비밀번호" required />
            </div>

            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ///// content 끝 ///// -->

<%@ include file="./include/footer.jsp" %>   
