<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<script type="text/javascript">
	// 실습 1 다른 방법 시작
	document.addEventListener("DOMContentLoaded", function() {
// 		getCustList();
		$("#uploadFiles").on("change", function(e){
			previewImage(e, "preview"); // preview 영역		
		});
		
		// 실습 2 시작
		const submitInput = document.querySelector("#btnSubmit");
		
		document.querySelector("#frm").addEventListener("submit", function(e){
			e.preventDefault(); // 폼 제출 막기
			let formData = new FormData();
			
			//모든 컬럼 변수화
			let carNum = document.querySelector("input[name='carNum']").value;
			let manuft = document.querySelector("input[name='manuft']").value;
			let mkyr = document.querySelector("input[name='mkyr']").value;
			let dist = document.querySelector("input[name='dist']").value;
			let selectedCustNum = document.querySelector("#custNum").value;
			
			// formData에 각각 추가
			formData.append("carNum", carNum);
			formData.append("manuft", manuft);
			formData.append("mkyr", mkyr);
			formData.append("dist", dist);
		    formData.append("custNum", selectedCustNum);
			
			
			//단일 파일 처리
// 			let uploadFile = document.querySelector("input[name='uploadFile']");
// 			let uploadFile2 = document.querySelector("input[name='uploadFile2']");
			
// 			if (uploadFile.files.length > 0) {
// 				formData.append("uploadFile", uploadFile.files[0]); 
// 			}
// 			if (uploadFile2.files.length > 0) {
// 				formData.append("uploadFile2", uploadFile2.files[0]);
// 			}
			
			//여러 파일 처리
			let fileElement = document.querySelector("#uploadFiles");
			let files = fileElement.files;
			/*
		      ES6는 2015년에 발표된 자바스크립트의 표준인 ECMAScript 6를 줄여 부르는 말로
		      2009년 발표된 ES5 이후의 주요 개정판. 
		      var 대신 let과 const, 화살표 함수, 템플릿 리터럴, 클래스, 모듈 시스템 등 다양한 새로운 문법과 기능을 도입
		      자바스크립트 개발을 더 효율적이고 편리하게 만듦
		    */
			
			//가상폼인 formData 에 각각의 이미지 객체를 넣자
			for(const file of files){
				formData.append("uploadFiles",file);
				console.log("file : ", file);
			}

			// 확인용
			for (let [key, value] of formData.entries()) {
			  console.log(key + ":", value);
			}
			
			//headers:{"Content-Type":"application/json",} 헤더는 첨부파일이 없을 때 사용. 파일은 무조건 formData를 사용
			fetch("/car/createPostAjax", {
				method:"post",
				body:formData,
			})	
			.then(response=>{
				if(!response.ok){
					throw new Error(`HTTP error! Status : \${response.status}`);
				}
				//dataType: "json" 처리(응답 본문을 JSON 객체로 파싱)
				return response.json();
			})
			.then(result=>{
				console.log("result : ", result);
				var Toast = Swal.mixin({
				      toast: true,
				      position: 'top-end',
				      showConfirmButton: false,
				      timer: 1000
				    });
				
				Toast.fire({
					icon:'success',
					title:'성공적으로 변경되었습니다.'
				});
				/* setTimeOut()
	               - 어떤 코드를 바로 실행하지 않고 일정 시간 기다린 후 실행
	               - 첫 번재 인자로 실행할 코드를 담고 있는 함수를 받고
	               - 두 번째 인자로 지연 시간을 밀리초(ms) 단위로 받음
	               - 세 번째 인자부터는 가변 인자를 받음. 첫번째 인자로 넘어온 함수가 인자를 받는 경우, 
	                  이 함수에 넘길 인자를 명시해주기 위해서 사용함
	            */
				setTimeout(() => {
// 				    location.href = "/item2/detail?itemId=" + ${item2VO.itemId};
					location.href = "/car/list";
				}, 1000);
			})
			.catch(error=>{
				console.error("Fetch 요청 오류 발생 : ", error);
			});
		})	
		// 실습 2 끝

	});
	
	function getCustList() {
		fetch("/car/getCustList", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		})
		.then(response => {
			if (!response.ok) throw new Error("서버 응답 오류");
			return response.json();
		})
		.then(data => {
			console.log("getCustList->data : ", data);
			const select = document.getElementById("custNum");

			// 기존 옵션 초기화 (기본 안내 문구는 남김)
			select.innerHTML = '<option value="" disabled selected>고객을 선택해주세요</option>';

			// 받아온 고객 리스트를 option으로 추가
			data.forEach(cust => {
				const option = document.createElement("option");
				option.value = cust.custNum;
				option.textContent = cust.custName;
				select.appendChild(option);
			});
		})
		.catch(error => {
			console.error("getCustList->data : ", error);
		});
	}
	// 실습 1 다른 방법 끝
	
	// 실습 2 시작
	function previewImage(e, targetId) {
		let files = e.target.files;
		let fileArr = Array.prototype.slice.call(files);
		let str = "";
		
		$("#" + targetId).html(""); // 초기화
		
		fileArr.forEach(function (f) {
			if (!f.type.match("image.*")) {
				alert("이미지 파일만 가능합니다.");
				return;
			}
			
			let reader = new FileReader();
			reader.onload = function (e) {
				str += '<img src="' + e.target.result + 
				       '" style="width:250px; height:250px; margin:10px;" />';
				$("#" + targetId).html(str);
			};
			reader.readAsDataURL(f);
		});
	}
	// 실습 2 끝
	
</script>

<head>
<title></title>
</head>
<body>

	<%@ include file="../qxinclude/header.jsp"%>

	<!-- /// body 시작 /// -->
	<div class="jumbotron">
		<!-- container : 이 안에 내용있다 -->
		<div class="container" id="divCarImg"></div>
	</div>

	<div class="row">
		<div class="col-lg-12">
			<div class="card">
				<div class="card-body">
					<h4 class="card-title">차량 등록</h4>
					<div class="basic-form">
						<!-- 
                   요청URI : /car/createPost
                   요청파라미터 : request{cusName=개똥이,addr=대전광역시,pne=010-111-2222}
                   요청방식 : post
                    -->
						<form id="frm" action="/car/createPost" method="post" enctype="multipart/form-data">
							<div class="form-group">
								<input type="text" class="form-control input-default"
									id="carNum" name="carNum" placeholder="자동차 번호" maxlength="20" />
							</div>
							<div class="form-group">
								<input type="text" class="form-control input-default"
									id="manuft" name="manuft" placeholder="제조사" />
							</div>
							<div class="form-group">
								<input type="number" class="form-control input-default"
									id="mkyr" name="mkyr" placeholder="연식" />
							</div>
							<div class="form-group">
								<input type="number" class="form-control input-default"
									id="dist" name="dist" placeholder="주행거리" />
							</div>
							<div class="form-group">
								<label>고객 선택</label>
								<!-- CUS 테이블의 기본키 cusNum 컬럼 -->
								<select class="form-control" id="custNum" name="custNum">
									<option value="" disabled selected>고객을 선택해주세요</option>
									<!-- 실습 1 시작 -->
									<!-- 반복 시작 -->
									<c:forEach var="cust" items="${custVOList}">
										<option value="${cust.custNum}">${cust.custName}</option>
									</c:forEach>
									<!-- 반복 끝 -->
									<!-- 실습 1 끝 -->
								</select>
							</div>
							<div class="form-group">
								<label for="uploadFile">자동차 사진</label> 
								<input type="file"
									id="uploadFiles" class="form-control-file" multiple
									placeholder="자동차 대표 사진 선택" />
								<div id="preview"></div>
							</div>
							<button type="submit" class="btn btn-dark" id="btnSubmit">등록</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- /// body 끝 /// -->

	<%@ include file="../qxinclude/footer.jsp"%>

</body>
</html>