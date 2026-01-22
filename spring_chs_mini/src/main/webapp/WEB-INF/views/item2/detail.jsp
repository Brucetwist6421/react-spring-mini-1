<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html>
<html>
<head>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<title>대덕의 쇼핑몰</title>

</head>
<body>
	<!-- /// menu.jsp 시작  -->
	<%@ include file="../menu.jsp"%>
	<!-- /// menu.jsp 끝 /// -->

	<!-- 실습 2 시작 form 태그에 id="frmSubmit" 추가 -->
	<script type="text/javascript">
		$(function() {
// 		document.addEventListener("DOMContentLoaded"),function(){
	
			// 실습 21 시작
			$("#modalDeleteConfirm").on("click", function(){
				if (!confirm("삭제하시겠습니까?")) return; // 취소하면 종료
				let itemId = $("#modalDeleteItemId").val();
				
				let data ={
					"itemId":itemId,
				};
				
				console.log("modalDeleteConfirm->data : ", data);
				
				fetch("/item2/deleteAjax",{
					method:"post",
					headers:{
						"Content-Type":"application/json;charset=utf-8"
					},
					body:JSON.stringify(data),
				})	
				.then(response =>{
					console.log("modalDeleteConfirm->response : ", response);	
					return response.json();
				})
				.then(data =>{
					console.log("modalDeleteConfirm->data : ", data);
					if(data === 1){
						alert("삭제가 완료되었습니다.");

					    // 모달 닫기
					    $("#modalDelete").modal("hide");

					    // 댓글 갱신 함수 호출
					    reloadReplyList();
					}else{
						alert("삭제 실패!");
					}
				})
				.catch(error =>{
					console.log("modalDeleteConfirm->error : ", error);
				})
			});
			// 실습 21 끝
	
			// 실습 20 시작
			// 댓글 삭제 (Vanilla JS)
			$(document).on("click",".clsDelete", function(){
				let itemId = $(this).data("itemId");
				console.log("clsDelete->itemId : ", itemId);
				let data = {
					"itemId":itemId,
				};
				
				//해당 댓글 정보 select
				fetch("/item2/detailAjax",{
					method:"post",
					headers:{"Content-Type":"application/json;charset=utf-8"},
					body:JSON.stringify(data),
				})
				.then(response=>{
					console.log("clsDelete->response : ", response);	
					return response.json();
				})
				.then(data=>{
					console.log("clsDelete->data : ", data);
					console.log("clsDelete->data : ", data.item2VO.writer);
					// 모달 필드에 데이터 세팅
			        $("#modalDeleteItemId").val(data.item2VO.itemId);
			        $("#modalDeleteWriter").val(data.item2VO.writer);
			        $("#modalDeleteItemName").val(data.item2VO.itemName);
			        $("#modalDelteItemDescription").val(data.item2VO.description);
			        $("#modalDeletePrice").val(data.item2VO.price);
			        
			        
			        if (data.item2VO.pictureUrl) {
			        	document.querySelector("#divImg3").style.display = "block";
			            document.querySelector("#modalDeletePreviewImg1").src = "/upload" + data.item2VO.pictureUrl;
			        }else{
			        	document.querySelector("#divImg3").style.display = "none";
					}
			        if (data.item2VO.pictureUrl2) {
			        	document.querySelector("#divImg4").style.display = "block";
			            document.querySelector("#modalDeletePreviewImg2").src = "/upload" + data.item2VO.pictureUrl2;
			        }else{
			        	document.querySelector("#divImg4").style.display = "none";
					}
			        
				})
				.catch(error=>{
					console.log("clsDelete->error : ", error);
				})
			});	
			// 실습 20 끝
			
	
			// 실습 18 시작 : 실습 14 의 수정 완료 후 모달 닫기 댓글 재생성 주석처리
			// 화면 클릭 시 댓글 재생성
			document.addEventListener("click",function(event){
				console.log("아무데나 클릭!");
				document.querySelector("#itemName").value = ""; // 입력창 초기화
            	reloadReplyList(); // 등록 후 목록 새로고침
			});
			// 실습 18 끝
	
	
			// 실습 16 시작
			function reloadReplyList() {
			    // 현재 상세 페이지의 itemId 가져오기
			    const itemId = $("input[name='itemId']").val();
			    
			    fetch("/item2/replyListAjax", {
			        method: "post",
			        headers: {"Content-Type": "application/json;charset=utf-8"},
			        body: JSON.stringify({ itemId: itemId })
			    })
			    .then(response => response.json())
			    .then(data => {
			        console.log("reloadReplyList -> data:", data);
			        let str = "";
			        
			        data.item2VOList.forEach(function(item2VO) {
			            str += `
			                <div class="card">
			                    <div class="card-body">
			                        <div class="post">
			                            <p>\${item2VO.itemName}</p>
			                            <p>
			                                <a href="#" class="link-black text-sm mr-2">
			                                    <i class="fas fa-share mr-1"></i> Share
			                                </a> 
			                                <a href="#" class="link-black text-sm">
			                                    <i class="far fa-thumbs-up mr-1"></i>Like
			                                </a>
			                            	<p>로그인아이디 : \${data.username} / 작성자 : \${item2VO.writer}</p>
			            `;
			            if (data.username === item2VO.writer) {
			                str += `
			                                <span class="float-right"> 
						                	<a href="#modalEdit" data-toggle="modal" class="btn btn-warning btn-xs clsEdit" data-item-id="\${item2VO.itemId}">수정(로그인 아이디 : ${memberVO.userId} )</a>
						                    <a href="#modalDelete" data-toggle="modal" class="btn btn-danger btn-xs clsDelete" data-item-id="\${item2VO.itemId}">삭제(글 작성자 : ${item2VO.writer})</a>
			                                </span>
			                `;
			            }
			            str += `
			                            </p>
			                            <input class="form-control form-control-sm" type="text" placeholder="Type a comment">
			                        </div>
			                    </div>
			                </div>
			            `;
			        });
			
			        document.querySelector("#divReplys").innerHTML = str;
			    })
			    .catch(error => console.log("reloadReplyList->error:", error));
			}
			// 실습 16 끝
	
			// 실습 14 시작
			$("#modalEditConfirm").on("click", function(){
				let itemId = $("#modalEditItemId").val();
				
				let itemName = $("#modalEditItemName").val();
				
				let description = $("#modalEditItemDescription").val();
				
				let price = $("#modalEditPrice").val();
				
				
				let data ={
					"itemId":itemId,
					"itemName":itemName,
					"description":description,
					"price":price,
				};
				
				console.log("modalEditConfirm->data : ", data);
				
				fetch("/item2/modifyAjax",{
					method:"post",
					headers:{
						"Content-Type":"application/json;charset=utf-8"
					},
					body:JSON.stringify(data),
				})	
				.then(response =>{
					console.log("modalEditConfirm->response : ", response);	
					return response.json();
				})
				.then(data =>{
					console.log("modalEditConfirm->data : ", data);
					// 실습 15 시작
					if(data.result === 1){
						alert("수정이 완료되었습니다.");

					    // 모달 닫기
// 					    $("#modalEdit").modal("hide");

					    // 댓글 갱신 함수 호출
// 					    reloadReplyList();
					}else{
						alert("수정 실패!");
					}
					// 실습 15 끝
					
				})
				.catch(error =>{
					console.log("modalEditConfirm->error : ", error);
				})
			});
			// 실습 14 끝
			
			// 실습 11 시작
			// 댓글 수정
			$(document).on("click",".clsEdit", function(){
				let itemId = $(this).data("itemId");
				console.log("clsEdit->itemId : ", itemId);
				let data = {
					"itemId":itemId,
				};
				
				//해당 댓글 정보 select
				fetch("/item2/detailAjax",{
					method:"post",
					headers:{"Content-Type":"application/json;charset=utf-8"},
					body:JSON.stringify(data),
				})
				.then(response=>{
					console.log("clsEdit->response : ", response);	
					return response.json();
				})
				.then(data=>{
					console.log("clsEdit->data : ", data);
					// 실습 13 시작
					console.log("clsEdit->data : ", data.item2VO.writer);
					// 모달 필드에 데이터 세팅
			        $("#modalEditItemId").val(data.item2VO.itemId);
					//vanilaJS 변환
// 					let modalEditItemId = document.querySelector("#modalEditItemId").value;
// 					console.log("clsEdit->modalEditItemId : ", modalEditItemId);
// 					let vv = document.querySelector("#btnReply").dataset.itemId;
// 					console.log("clsEdit->vv : ", vv);
			        $("#modalEditWriter").val(data.item2VO.writer);
			        $("#modalEditItemName").val(data.item2VO.itemName);
			        $("#modalEditItemDescription").val(data.item2VO.description);
			        $("#modalEditPrice").val(data.item2VO.price);
			        
			        
			        if (data.item2VO.pictureUrl) {
			        	document.querySelector("#divImg1").style.display = "block";
			            document.querySelector("#modalEditPreviewImg1").src = "/upload" + data.item2VO.pictureUrl;
			        }else{
			        	document.querySelector("#divImg1").style.display = "none";
					}
			        if (data.item2VO.pictureUrl2) {
			        	document.querySelector("#divImg2").style.display = "block";
			            document.querySelector("#modalEditPreviewImg2").src = "/upload" + data.item2VO.pictureUrl2;
			        }else{
			        	document.querySelector("#divImg2").style.display = "none";
					}
			     	// 실습 13 끝
			        
				})
				.catch(error=>{
					console.log("clsEdit->error : ", error);
				})
			});	
			// 실습 11 끝
			
			$("#btnDelete").on("click", function() {
				console.log("btnDelete");

				let chk = confirm("삭제하시겠습니까?");
				if (chk) {
					console.log("2222");
					$("#frmSubmit").attr("action", "/item2/deletePost");
					$("#frmSubmit").submit();
				} else {
					alert("삭제가 취소되었습니다.") 
				}
			});

			// 실습 6 시작
			// 		$("#btnReply").on("click",function(){
			// 			console.log("btnReply");

			// 			let itemId = $("#btnReply").data("itemId");
			// 			let itemName = $("#itemName").val();

			// 			let data = {
			// 				"itemId":itemId,
			// 				"itemName":itemName,
			// 			};

			// 			console.log("btnReply->data : ", data);
			// 		});

			const btnReply = document.querySelector("#btnReply");
			btnReply.addEventListener("click", function() {
				// 여기서는 this가 btnReply를 가리킴
				const itemId = this.dataset.itemId; 
				const itemName = document.querySelector("#itemName").value;

				let formData = new FormData();

				formData.append("parentItemId", itemId);
				formData.append("itemName", itemName);
				
				let data = {
								"parentItemId":itemId,
								"itemName":itemName,
							};

				console.log("btnReply -> formData:", formData);

// 				axios.post('/item2/registerPost', formData) // 기존 API 재활용
// 					.then(response => console.log("서버 응답:", response))
// 					.catch(error => console.error("에러:", error));

// 				fetch("/item2/registerPost", {
				fetch("/item2/createPostAjax", {
					method: 'post',
					headers: {"Content-Type":"application/json;charset=utf-8"
						},
// 					body: formData,
					body: JSON.stringify(data),
				})
				.then(response=>{
					console.log(response);
					return response.json();
					
				})
				.then(data=>{
					console.log("서버 응답:", data);
					
					// 실습 7 시작 : 새로고침 없이 댓글 reload
// 					let str ="";
					// 새로 등록된 댓글 정보
// 		            if(data.result > 0 ){
// 						data.item2VO.item2VOList.forEach(function(item2VO,idx){
// 							str += `
// 								<div class="card">
// 									<div class="card-body">
// 										<div class="post">
// 											<p>
// 												\${item2VO.itemName}</p>
// 											<p>
// 												<a href="#" class="link-black text-sm mr-2"><i class="fas fa-share mr-1"></i> Share</a> 
// 												<a href="#" class="link-black text-sm"><i class="far fa-thumbs-up mr-1"></i>Like</a> 
// 												<span class="float-right"> 
// 													<a href="#" class="btn btn-warning btn-xs">수정(로그인 아이디 : )</a>
// 								                    <a href="#" class="btn btn-danger btn-xs">삭제(글 작성자 : \${item2VO.writer})</a>
// 												</span>
// 											</p>
// 											<input class="form-control form-control-sm" type="text"
// 												placeholder="Type a comment">
// 										</div>
// 									</div>
// 								</div>
// 							`;
							
// 						});
// 						document.querySelector("#divReplys").innerHTML = str;
// 		            }
					// 실습 7 끝
					
					// 실습 9 시작 : 실습 7 주석 처리
// 					let str ="";
// 					// 새로 등록된 댓글 정보
// 		            if(data.result > 0 ){
// 						data.item2VO.item2VOList.forEach(function(item2VO,idx){
// 							str += `
// 								<div class="card">
// 									<div class="card-body">
// 										<div class="post">
// 											<p>
// 												\${item2VO.itemName}</p>
// 											<p>
// 												<a href="#" class="link-black text-sm mr-2"><i class="fas fa-share mr-1"></i> Share</a> 
// 												<a href="#" class="link-black text-sm"><i class="far fa-thumbs-up mr-1"></i>Like</a>
// 												<p>로그인아이디 : \${data.username} / 작성자 : \${item2VO.writer}</p>
												
// 							`;
							
// 							if(data.username==item2VO.writer){
// 								str += `
											
// 												<span class="float-right"> 
// 													<a href="#modalEdit" data-toggle="modal" class="btn btn-warning btn-xs" data-item-id="\${item2VO.itemId}">수정(로그인 아이디 : ${memberVO.userId} )</a>
// 								                    <a href="#modalDelete" data-toggle="modal" class="btn btn-danger btn-xs" data-item-id="\${item2VO.itemId}">삭제(글 작성자 : ${item2VO.writer})</a>
// 												</span>
// 								`;
// 							}//end if
// 							str += `
// 											</p>
// 											<input class="form-control form-control-sm" type="text"
// 												placeholder="Type a comment">
// 										</div>
// 									</div>
// 								</div>
// 							`;
							
// 						});
// 						document.querySelector("#divReplys").innerHTML = str;
// 		            }

		            // 실습 9 끝
		            
		            // 실습 18 시작 : 실습 9 주석 처리
		            document.querySelector("#itemName").value = ""; // 입력창 초기화
                	reloadReplyList(); // 등록 후 목록 새로고침
		            // 실습 18 끝
		            
				})
				.catch(error=>{
					console.log(error);
				})
			});
			// 실습 6 끝
		});
	</script>
	<!-- 실습 2 끝 -->

	<!-- /// 제목 시작 /// -->
	<div class="jumbotron">
		<!-- container : 내용이 들어갈 때 -->
		<div class="container">
			<h1 class="display-3">단일 파일업로드 상세</h1>
		</div>
	</div>
	<!-- /// 제목 끝 /// -->

	<!-- 
		ItemVO(itemId=1, itemName=삼성태블릿, price=120000, description=쓸만함
	      , pictureUrl=/2025/09/08/asdldfksj_개똥이.jpg, uploadFile=
	   model.addAttribute("itemVO", itemVO);
	   
	 readonly vs disabled
	 submit 시   submit 시
	 값이 넘어감   값이 안넘어감
	 -->
	<form id="frmSubmit" action="/item2/registerPost" method="post"
		enctype="multipart/form-data">
		<input type="hidden" value="${item2VO.itemId }" name="itemId" />
		<table>
			<tr>
				<th>상품명</th>
				<td><input type="text" name="itemName"
					value="${item2VO.itemName}" readonly required placeholder="상품명" /></td>
			</tr>
			<tr>
				<th>가격</th>
				<td><input type="text" name="price" value="${item2VO.price}"
					readonly required placeholder="가격" /></td>
			</tr>
			<tr>
				<th>상품이미지1</th>
				<td>
					<!-- <input type="file" name="uploadFile" placeholder="상품이미지" /> -->
					<img src="/upload${item2VO.pictureUrl}"
					style="width: 250px; height: 250px;" />
				</td>
			</tr>
			<tr>
				<th>상품이미지2</th>
				<td>
					<!-- <input type="file" name="uploadFile" placeholder="상품이미지" /> -->
					<img src="/upload${item2VO.pictureUrl2}"
					style="width: 250px; height: 250px;" />
				</td>
			</tr>
			<!-- 실습 3 시작 -->
			<tr>
				<th>다중이미지</th>
				<td><c:forEach var="fileDetailVO"
						items="${item2VO.fileGroupVO.fileDetailVOList}" varStatus="stat">
						<img src="/upload${fileDetailVO.fileSaveLocate}"
							style="width: 250px; height: 250px;" />
					</c:forEach></td>
			</tr>
			<!-- 실습 3 끝 -->
			<tr>
				<th>개요</th>
				<td><input type="text" name="description" readonly
					value="${item2VO.description}" placeholder="개요" /></td>
			</tr>
		</table>
		<a href="/item2/edit?itemId=${item2VO.itemId }"
			class="btn btn-warning">수정</a>
		<button type="button" id="btnDelete" class="btn btn-danger">삭제</button>
		<a type="button" href="/item2/list" class="btn btn-success">목록</a>
	</form>
	<hr />

	<!-- 실습 5 시작 -->
	<div class="col-md-6">
		<form class="form-horizontal">
			<div class="input-group input-group-sm mb-0">
				<a href="#" class="link-black text-sm">
				                                            <!-- JSTL에서 prefix="fn" -->
					<i class="far fa-comments mr-1"></i> Comments (${fn:length(item2VO.item2VOList)})
				</a>
			</div>
			<div class="input-group input-group-sm mb-0">
				<input class="form-control form-control-sm" placeholder="댓글을 작성해주세요"
					id="itemName" />
				<div class="input-group-append">
					<!-- data-item-id 같이 사용하는 것을 데이터셋이라 한다. -->
					<button type="button" class="btn btn-danger"
						data-item-id="${item2VO.itemId}" id="btnReply">댓글등록</button>
				</div>
			</div>
		</form>
	</div>
	<hr />
	<!-- 실습 5 끝 -->
	<!-- 실습 4 시작 -->
	<!-- ///// 댓글 영역 시작 /////  -->
	<div class="col-md-6" id="divReplys">
		<c:forEach var="item2VO" items="${item2VO.item2VOList}">
			<div class="card">
				<div class="card-body">
					<div class="post">
						<p>${item2VO.itemName}</p>
						<p>
							<a href="#" class="link-black text-sm mr-2"><i class="fas fa-share mr-1"></i> Share</a> 
							<a href="#" class="link-black text-sm"><i class="far fa-thumbs-up mr-1"></i>Like</a> 
							<!-- 실습 8 시작 -->
							<!-- 로그인 했는지 체킹 -->
							<!-- 
							isAuthenticated() : 로그인 함
							isAnonymous() : 로그인 안 함
							 -->
							<sec:authorize access="isAuthenticated()">
								<sec:authentication property="principal.memberVO" var="memberVO"/>
								<p>로그인아이디 : ${memberVO.userId} / 작성자 : ${item2VO.writer}</p>
								<c:if test="${memberVO.userId eq item2VO.writer}">
									<span class="float-right"> 
										<a href="#modalEdit" data-toggle="modal" data-item-id="${item2VO.itemId}" class="btn btn-warning btn-xs clsEdit">수정(로그인 아이디 : ${memberVO.userId} )</a>
					                    <a href="#modalDelete" data-toggle="modal" data-item-id="${item2VO.itemId}" class="btn btn-danger btn-xs clsDelete">삭제(글 작성자 : ${item2VO.writer})</a>
									</span>
								</c:if>
							</sec:authorize>
							<!-- 실습 8 끝 -->
						</p>
						<input class="form-control form-control-sm" type="text"
							placeholder="Type a comment">
					</div>
				</div>
			</div>
		</c:forEach>
	</div>
	<!-- ///// 댓글 영역 끝 /////  -->
	<!-- 실습 4 끝 -->
	
	<!-- 실습 10 시작 -->
	<!-- //// 수정 모달 시작 //// -->
	<div class="modal fade" id="modalEdit">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">댓글 수정</h4>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
            	<!-- 실습 12 시작 -->
		        <input type="hidden" id="modalEditItemId" value="">
		        <div class="form-group">
			        <label>작성자</label>
			        <input type="text" id="modalEditWriter" class="form-control" readonly>
		        </div>
		        <div class="form-group">
			        <label>상품명</label>
			        <input type="text" id="modalEditItemName" class="form-control" >
		        </div>
		        <div class="form-group">
			        <label>가격</label>
			        <input type="number" id="modalEditPrice" class="form-control" >
		        </div>
		        <div class="form-group">
			        <label>개요</label>
			        <textarea id="modalEditItemDescription" class="form-control" rows="3"></textarea>
		        </div>
		        <div class="form-group" id="divImg1">
		        	<label>상품이미지1</label>
		        	<img id="modalEditPreviewImg1" style="width: 200px; height: 150px;" />
		        </div>
		        <div class="form-group" id="divImg2">
		        	<label>상품이미지2</label>
		        	<img id="modalEditPreviewImg2" style="width: 200px; height: 150px;" />
		        </div>
		        <!-- 실습 12 끝 -->
	        </div>
            <div class="modal-footer justify-content-between">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" id="modalEditConfirm" class="btn btn-primary">확인</button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    <!-- //// 수정 모달 끝 //// -->
    <!-- 실습 10 끝 -->

	<!-- 실습 19 시작 -->    
    <!-- //// 삭제 모달 시작 //// -->
    <div class="modal fade" id="modalDelete">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">댓글 삭제</h4>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <input type="hidden" id="modalDeleteItemId" value="">
		        <div class="form-group">
			        <label>작성자</label>
			        <input type="text" id="modalDeleteWriter" class="form-control" readonly>
		        </div>
		        <div class="form-group">
			        <label>상품명</label>
			        <input type="text" id="modalDeleteItemName" class="form-control" >
		        </div>
		        <div class="form-group">
			        <label>가격</label>
			        <input type="number" id="modalDeletePrice" class="form-control" >
		        </div>
		        <div class="form-group">
			        <label>개요</label>
			        <textarea id="modalDeleteItemDescription" class="form-control" rows="3"></textarea>
		        </div>
		        <div class="form-group" id="divImg3">
		        	<label>상품이미지1</label>
		        	<img id="modalDeletePreviewImg1" style="width: 200px; height: 150px;" />
		        </div>
		        <div class="form-group" id="divImg4">
		        	<label>상품이미지2</label>
		        	<img id="modalDeletePreviewImg2" style="width: 200px; height: 150px;" />
		        </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-danger" id="modalDeleteConfirm">삭제</button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    <!-- //// 삭제 모달 끝 //// -->
	<!-- 실습 19 끝 -->

	<!-- /// footer.jsp 시작 /// -->
	<%@ include file="../footer.jsp"%>
	<!-- /// footer.jsp 끝 /// -->
</body>
</html>