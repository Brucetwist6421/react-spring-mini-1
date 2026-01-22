<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<script
	src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
<script src="/js/jquery.min.js"></script>

<script type="text/javascript">
// 실습 1 시작
//document 내 요소들이 모두 로딩된 후 실행
document.addEventListener("DOMContentLoaded",()=>{
   //<button type="button" id="btnPost" class="btn btn-info btn-sm">우편번호 검색</button>
   document.getElementById("btnPost").addEventListener("click",()=>{
      //다음 우편번호 검색
      new daum.Postcode({
            oncomplete:function(data){
               //data{"zonecode":"12345","address":"대전 중구","buildingName":"123-67"}
               // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
               // 예제를 참고하여 다양한 활용법을 확인해 보세요.
               //<input type="text" id="zipCode"...
               document.getElementById("zipCode").value = data.zonecode;
               //<input type="text" id="addressName" ...
               document.getElementById("addressName").value = data.address;
               //<input type="text" id="addressDetName"...
               document.getElementById("addressDetName").value = data.buildingName;
            }//end oncomplete
      }).open();
   });//end btnPost
});//end DOMContentLoaded
// 실습 1 끝
</script>
</head>
<body>
	<!-- /// menu.jsp 시작 
   ../ : 상위 폴더
   /// -->
	<%@ include file="../menu.jsp"%>
	<!-- /// menu.jsp 끝 /// -->
	<!-- /// 제목 시작 /// -->
	<div class="jumbotron">
		<!-- container : 내용이 들어갈 때 -->
		<div class="container">
			<h1 class="display-3">배송 정보</h1>
		</div>
	</div>
	<!-- /// 제목 끝 /// -->
	<%
	//스크립틀릿
	%>
	<!-- /// 내용 시작 /// 
   요청URI : /product/processShippingInfo
   요청파라미터 : request{cartId=ABCDE,name=개똥이,shippingDate=2025-02-11,
                  zipCode=06112,addressName=서울 강남구 논현로123길 4-1,
                  addressDetName=123} 
   요청방식 : post
   -->
	<div class="container">
		<form name="frm" id="frm" action="/product/processShippingInfo"
			class="form-horizontal" method="post">
			<!-- model.addAttribute("cartId", cartId); -->
			<input type="text" name="cartId" value="${cartId}" />
			<div class="form-group row">
				<label class="col-sm-2">성명</label>
				<div class="col-sm-3">
					<input type="text" name="name" class="form-control" required
						placeholder="성명" />
				</div>
			</div>
			<div class="form-group row">
				<label class="col-sm-2">배송일</label>
				<div class="col-sm-3">
					<input type="date" name="shippingDate" class="form-control"
						required />(yyyy-mm-dd)
				</div>
			</div>
			<div class="form-group row">
				<label class="col-sm-2">우편번호</label>
				<div class="col-sm-3">
					<!-- 
            required : 필수 입력
            readonly : 읽기 전용 => submit 시 값이 전달 됨
            disabled : 비활성 => submit 시 값이 전달 안됨
             -->
					<input type="text" id="zipCode" name="zipCode" class="form-control"
						required readonly placeholder="우편번호 검색 클릭" />&nbsp;
					<button type="button" id="btnPost" class="btn btn-info btn-sm">우편번호
						검색</button>
				</div>
			</div>
			<div class="form-group row">
				<label class="col-sm-2">주소</label>
				<div class="col-sm-3">
					<input type="text" id="addressName" name="addressName"
						class="form-control" required readonly placeholder="주소" />
				</div>
			</div>
			<div class="form-group row">
				<label class="col-sm-2">상세 주소</label>
				<div class="col-sm-3">
					<input type="text" id="addressDetName" name="addressDetName"
						class="form-control" required placeholder="상세 주소" />
				</div>
			</div>
			<div class="form-group row">
				<div class="col-sm-offset-2 col-sm-10">
					<!-- model.addAttribute("cartId", cartId); -->
					<a href="/product/cart?cartId=${cartId}" class="btn btn-secondary"
						role="button">이전</a> <input type="submit" class="btn btn-primary"
						value="등록" /> <a href="/product/checkOutCancelled"
						class="btn btn-secondary" role="button">취소</a>
				</div>
			</div>
			<form>
	</div>
	<!-- /// 내용 끝 /// -->

	<!-- /// footer.jsp 시작 /// -->
	<%@ include file="../footer.jsp"%>
	<!-- /// footer.jsp 끝 /// -->
</body>
</html>


