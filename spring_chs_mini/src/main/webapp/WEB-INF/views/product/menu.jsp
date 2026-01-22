<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<!-- CDN 방식으로 import -->
<link rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
<script type="text/javascript" src="/js/jquery.min.js"></script>
<script type="text/javascript" src="/adminlte/dist/js/adminlte.min.js"></script>
<script type="text/javascript"
	src="/adminlte/plugins/bootstrap/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="/ckeditor5/ckeditor.js"></script>
<title></title>
<script type="text/javascript">
<!-- 실습 3 시작 -->
document.addEventListener("DOMContentLoaded",()=>{
   console.log("개똥이");
   
   const btnGeminiElement = document.querySelector("#btnUseGemini");
   
   //버튼이 있다면 실행
   if(btnGeminiElement!=null){
	   btnGeminiElement.addEventListener("click",()=>{
			// 제미나이 사용 모달 띄우기
			const geminiModal = document.querySelector("#modalGeminiOn"); // div엘리먼트
			const modalInstance = new bootstrap.Modal(geminiModal); // modal 엘리먼트
			
			modalInstance.show();
	   })
	}
   
   // 모달 확인버튼 클릭 처리
   document.querySelector("#btnGeminiOn").addEventListener("click", () => {
	console.log("모달 확인버튼 클릭!");	
	
	let geminiApiKey = document.querySelector("#geminiApiKey").value;
	console.log("geminiApiKey : ", geminiApiKey);
	<!-- 실습 3 끝 -->
	
	// 실습 5 시작
	/*JSON Object
    <p>JSON은 JavaScript Object Notation의 약자.</p>
    <p>JSON은 텍스트에 기반을 둔 데이터 저장 및 교환을 위한 구문임</p>
    <p>JSON은 자바스크립트 객체 표기법으로 작성된 텍스트임</p>
    <p>JSON은 브라우저와 서버 간에 데이터를 교환할 때 데이터는 텍스트일 뿐임</p>
    <p>모든 자바스크립트 객체를 JSON으로 변환하고 JSON을 서버로 보낼 수 있음</p>
    <p>서버에서 받은 JSON을 자바스크립트 객체로 변환할 수 있음</p> */
    
    /*
    client -> server (string 형식으로 전달)
    server -> client (string 형식으로 전달)
    string으로 받아온 데이터를 다시 Object로 변환하여 브라우저에 표기!
    object -> string 으로 변환하는 방식을 serialize 라고 한다!
    string -> object로 다시 변환하는 방식을 deserialize라고 함!
    */
    let data = {
		"geminiApiKey":geminiApiKey
    }
    console.log("data : ", data);
    
    //비동기(Asynchronous Javascript And XML) 통신
    $.ajax({
		url:"/geminiApi",
    	contentType:"application/json;charset=utf-8",
    	data:JSON.stringify(data),
    	type:"post",
    	success:function(result){
    		/* 
            result{"geminiApiKey": "asldfk","result": "success"}
            */
            console.log("result : ", result);
            
            let str = "";
            
            //세션에 key 등록 성공 시
            if(result.result=="success"){
				str = `
					<input type="text" style="width:50%;" class="form-group" id="txtGeminiSearch" placeholder="검색어를 입력해주세요."
					<button type="button" class="btn btn-success btn-sm" id="btnGeminiSearch">Gemini검색</button>
				`;
	            //<span id="spnGemini">...</span>
        		document.querySelector("#spnGemini").innerHTML = str;    
    	        //모달(id="modalGeminiOn") 닫기
        		const geminiClose = document.querySelector("#btnGeminiClose"); // div엘리먼트
    			
        		geminiClose.click();
    	        
            }
    	}
    });
    
 // 실습 5 끝
    
   });
   // 실습 7 시작
   // gemini 검색
   const searchElement = document.querySelector("#btnGeminiSearch");
   
   if(searchElement!=null){
	   searchElement.addEventListener("click", ()=>{
			console.log("제미나이 검색 실행!!");
			//로딩 중 보이기
			if(document.querySelector("#btnSpinner")!=null){
				document.querySelector("#btnSpinner").style.display = "block";
			}
			
			//입력한 검색어
			let txtGeminiSearch = document.querySelector("#txtGeminiSearch").value;
			console.log("txtGeminiSearch : ",txtGeminiSearch);
			
			if(txtGeminiSearch==null || txtGeminiSearch==""){
				alert("검색어를 입력해주세요.");
				return;
			}
			
			let data ={
				"txtGeminiSearch":txtGeminiSearch
			}
			console.log("txtGeminiSearch->data", data);
			
			$.ajax({
				url:"/geminiApiPost",
				contentType:"application/json;charset=utf-8",
				data:JSON.stringify(data),
				type:"post",
// 				dataType:"json",
				success:function(result){
					console.log("성공");
					console.log("result : ", result);
					// 실습 9 시작
					document.querySelector("#divGeminiShow").innerHTML ="";
					
					ClassicEditor.create(
					   document.querySelector("#divGeminiShow"),
					   { ckfinder: "/image/upload" }
					).then(editor => { 
					      window.editor = editor; 
// 					      window.editor.setData(`${result}`);
					      editor.setData(result);
					}).catch(err => { 
					      console.error(err.stack); 
					});
					
					const modalGeminiResult = document.getElementById("modalGeminiResult");
					let modalShowInstance = new bootstrap.Modal(modalGeminiResult);
					modalShowInstance.show();
					// 실습 9 끝
				}
			})
		});
	}
   // 실습 7 끝
}); // end DOMContentLoaded
</script>
</head>
<body>



	<!-- /// header 시작 /// -->
	<nav class="navbar navbar-expand navbar-dark bg-dark">
		<div class="container">
			<div class="navbar-header">
				<a class="navbar-brand" href="/product/welcome">Home</a>
			</div>
			<div>
				<!-- ul : unlist => 순서가 없는 목록 -->
				<ul class="navbar-nav mr-auth">
					<!-- 실습 2 시작 -->
					<!-- 제미나이 API 버튼 시작 -->
					<li class="nav-item">
						<!-- 실습 6 시작 -->
						<c:set var="geminiApiKey" value='<%=(String)session.getAttribute("geminiApiKey")%>' />
						<!-- 실습 6 끝 -->
<%-- 						<p>geminiApiKey : ${geminiApiKey}</p>  --%>
<!-- 						<span id="spnGemini"> -->
<!-- 							<button class="btn btn-primary" type="button" id="btnSpinner" -->
<!-- 								style="display: none;" disabled> -->
<!-- 								<span class="spinner-border spinner-border-sm" -->
<!-- 									aria-hidden="true"></span> <span role="status">Loading...</span> -->
<!-- 							</button> -->
<!-- 							<button type="button" class="btn btn-info btn-sm" -->
<!-- 								id="btnUseGemini">제미나이 활성화</button> -->
<!-- 						</span> -->
						<c:if test="${geminiApiKey==null}">
		                  <span id="spnGemini">
		                     <button class="btn btn-primary" type="button" id="btnSpinner"
		                        style="display:none;" disabled>
		                        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
		                        <span role="status">Loading...</span>
		                     </button>
		                     <button type="button" class="btn btn-info btn-sm" id="btnUseGemini">제미나이 활성화</button>
		                  </span>
		               </c:if>
		               <c:if test="${geminiApiKey!=null}"><!-- session에 key가 안담김 -->
		                  <span id="spnGemini">
		                     <input type="text" style="width:50%;" class="form-group" id="txtGeminiSearch" placeholder="검색어를 입력해주세요" />
		                     <button type="button" class="btn btn-success btn-sm" id="btnGeminiSearch">Gemini검색</button>
		                  </span>
		               </c:if>
					</li>
					<!-- 제미나이 API 버튼 끝 -->
					<!-- 실습 2 끝 -->
					<li class="nav-item"><a class="nav-link" href="#">로그인</a></li>
				</ul>
			</div>
		</div>
	</nav>
	<!-- /// header 끝 /// -->

	<!-- 실습 4 시작 -->
	<!-- // 제미나이 모달 시작 // -->
	<div class="modal fade" id="modalGeminiOn">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">제미나이 활성화</h4>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<p>
						<label class="form-check-label" for="geminiApiKey">GEMINI_API_KEY</label>
						<input type="text" class="form-group" id="geminiApiKey" />
					</p>
				</div>
				<div class="modal-footer justify-content-between">
					<button type="button" class="btn btn-default" data-dismiss="modal" id="btnGeminiClose">닫기</button>
					<button type="button" class="btn btn-primary" id="btnGeminiOn">확인</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- // 제미나이 모달 끝 // -->
	<!-- 실습 4 끝 -->
	
	<!-- 실습 8 시작 -->
	<!-- // 제미나이 모달 시작 // -->
	<div class="modal fade" id="modalGeminiResult">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">제미나이 검색 결과</h4>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div id="divGeminiShow">
					</div>
				</div>
				<div class="modal-footer justify-content-between">
					<button type="button" class="btn btn-default" data-dismiss="modal" id="btnGeminiClose">닫기</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- // 제미나이 모달 끝 // -->
	<!-- 실습 8 끝 -->
	
	