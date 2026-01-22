<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<!-- 실습 2 시작 -->
<script type="text/javascript" src="/ckeditor5/ckeditor.js"></script>
<link type="text/css" rel="stylesheet" href="/ckeditor5/sample/css/sample.css">
<!-- 실습 2 끝 -->
<title></title>
<!-- 실습 8 시작 -->
<script type="text/javascript">
	document.addEventListener("DOMContentLoaded", ()=>{
		
		console.log("로딩완료");
		const newProductForm = document.getElementById("newProduct");
		// const newProductForm = document.getElementById("form[name='newProduct']");

		newProductForm.addEventListener("submit",(event)=>{
			event.preventDefault();
			console.log("클릭 시 이벤트 발생")
			//<input type="text" id="productId" name="productId" />
			let productId = document.getElementById("productId");
			//<input type="text" id="name" name="name" />
			let pname = document.getElementById("pname");
			let unitPrice = document.getElementById("unitPrice");
			let unitsInStock = document.getElementById("unitsInStock");
			
			//상품 아이디 체크.   
			//1) 첫글자는 P.  2) 숫자를 조합하여 5~12자까지 입력 가능
			//i) P1234 => if(!true) => if(false) => if문을 건너뜀
			//ii) S1234 => if(!false) => if(true) => if문을 수행
			let regExpProductId = /^P[0-9]{4,11}$/;

			if(!regExpProductId.test(productId.value)){
				alert("[상품 코드]\n첫글자 P와 숫자를 조합하여 5~12자까지 입력하세요.\n 첫글자는 P로 시작하세요.");
				productId.select();
				return;
			}
			

			//상품명 체크
			//4~12자까지 입력 가능
			//ex)name.value : 삼성갤러시S22
			let regExpPname = /^[a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\s]{4,12}$/;

			if(!regExpPname.test(pname.value)){
				alert("[상품명]\n첫글자는 문자로 시작하여 4~12자까지 입력하세요.");
				pname.select();
				return;
			}
			

			//상품 가격 체크
			//숫자만 입력 가능
			//ex) unitPrice.value : 1200000
			let regExpUnitPrice = /^[0-9]+$/;
			
			if(!regExpUnitPrice.test(unitPrice.value)){
				alert("[상품가격]\n숫자만 입력하세요.");
				unitPrice.select();
				return;
			}

			//ex) unitPrice.value : -1200000 막아보자
			if(unitPrice.value < 0){
				alert("마이너스는 입력할 수 없습니다.");
				unitPrice.select();
				return;
			}

			//ex) unitPrice.value : 1200000.1234982174092837 => 1200000.35
			//?:이 뭔지 고민해보자 => spring VO에서 어노테이션으로 자동 처리
			//i) 1200000.35 => if(!true) => if(false) => 함수를 통과
			//ii) 1200000.357 => if(!false) => if(true) => 함수를 멈춤
			let regExpUnitPrice2 = /^\d+(?:[.]?[\d]?[\d])?$/;
			
			if(!regExpUnitPrice2.test(unitPrice.value)){
				alert("[상품가격]\n소수점 둘째자리까지만 입력하세요.");
				unitPrice.select();
				return;
			}

			//재고 수 체크
			//숫자만 입력 가능
			//isNaN : 이거숫자니? 
			if(isNaN(unitsInStock.value)){
				alert("[재고 수]\n숫자만 입력하세요.")
				unitsInStock.select();
				return false;
			}
			let regExpUnitsInStock = /^[0-9]+$/;

			if(!regExpUnitsInStock.test(unitsInStock.value)){
				alert("[재고 수]\n숫자만 입력하세요.");
				unitsInStock.select();
				return;
			}

			}
		)

	})
</script>
<!-- 실습 8 끝 -->
</head>
<body>

	<%@ include file="./menu.jsp"%>

	<div class="jumbotron">
		<!-- container : 이 안에 내용있다 -->
		<div class="container">
			<h1 class="display-3">상품 등록 페이지</h1>
		</div>
	</div>

	<!-- /// body 시작 /// -->
	<!-- -------------- 상품 등록 시작 ------p.203----------------- -->
	<!-- 내용 -->
	<div class="container">
		<form name="newProduct" id="newProduct"
			action="<%=request.getContextPath()%>/product/processAddProduct"
			class="form-horizontal" method="post">
			<div class="form-group row">
				<label class="col-sm-2">상품 코드</label>
				<div class="col-sm-3">
<!-- 					<input type="text" id="productId" name="productId" class="form-control"/> -- insert SQL selectKey 생성 후 밑의 input 으로 변경-->
					<input type="text" id="productId" name="productId" class="form-control"/>
				</div>
			</div>
			<div class="form-group row">
				<label class="col-sm-2">상품명</label>
				<div class="col-sm-3">
					<input type="text" id="pname" name="pname" class="form-control" />
				</div>
			</div>
			<div class="form-group row">
				<label class="col-sm-2">가격</label>
				<div class="col-sm-3">
					<input type="number" id="unitPrice" name="unitPrice"
						class="form-control" />
				</div>
			</div>
			<div class="form-group row">
				<label class="col-sm-2">상세 정보</label>
				<div class="col-sm-3">
					<!-- 실습 1 진행 -->
					<div id="descriptionTemp">
					</div>
					<textarea cols="30" rows="5" id="description" name="description" class="form-control" style="display: none;"></textarea>
					<!-- 실습 1 끝 -->
				</div>
			</div>
			<div class="form-group row">
				<label class="col-sm-2">제조사</label>
				<div class="col-sm-3">
					<input type="text" name="manufacturer" class="form-control" />
				</div>
			</div>
			<div class="form-group row">
				<label class="col-sm-2">분류</label>
				<div class="col-sm-3">
					<input type="text" name="category" class="form-control" />
					<!-- 실습 4 진행 -->
					<select id="category" name="category" class="form-control">
		               <option value="" selected disabled>선택해주세요</option>
		               <option value="Smart Phone">Smart Phone</option>
		               <option value="Notebook">Notebook</option>
		               <option value="Tablet">Tablet</option>
		            </select>
					<!-- 실습 4 끝 -->
				</div>
			</div>
			<div class="form-group row">
				<label class="col-sm-2">제고수</label>
				<div class="col-sm-3">
					<input type="text" id="unitsInStock" name="unitsInStock"
						class="form-control" />
				</div>
			</div>
			<div class="form-group row">
				<label class="col-sm-2">상태</label>
				<div class="col-sm-5">
					<input type="radio" id="condition1" name="condition" value="New" />
					<label for="condition1">신규 제품</label> 
					<input type="radio" id="condition2" name="condition" value="Old" />
					<label for="condition2">중고 제품</label>  
					<input type="radio" id="condition3" name="condition" value="Refurbished" />
					<label for="condition3">재생 제품</label> 
				</div>
			</div>
			<!-- 실습 5 진행 -->
			<div class="form-group row">
				<div class="col-sm-offset-2 col-sm-10">
					<input type="button" class="btn btn-primary" value="등록"
						onclick="checkAddProduct()" />
						<!-- 실습 7 시작 -->
						<input type="submit" class="btn btn-primary" value="등록2"/>
						<!-- 실습 7 끝 -->
					<a href="/product/products" class="btn btn-info">목록보기</a>
				</div>
			</div>
			<!-- 실습 5 끝 -->
		</form>
	</div>
	<!-- -------------- 상품 등록 끝 ----------------------- -->
	<!-- 실습 3 진행 -->
	<script type="text/javascript">
	// 전역 함수 설정(ckeditor 내용을 textarea 에 복사)
	const copyToTextArea = () => {
		editor.model.document.on('change:data', () => {
	          document.querySelector('#description').value = editor.getData();
	     });
	}
		document.addEventListener("DOMContentLoaded",()=>{
		   console.log("개똥이");
		   
		   ClassicEditor.create(document.querySelector('#descriptionTemp'),{ckfinder:{uploadUrl:'/image/upload'}})
		   				.then(editor=>{
							window.editor=editor;
							//ckeditor 내용을 textarea 에 복사
							copyToTextArea();
							})
		   				.catch(err=>{console.error(err.stack);});
		});
	<!-- 실습 3 끝 -->
	
	<!-- 실습 6 시작 -->
	//submit
	function checkAddProduct() {
		document.newProduct.submit();
	}
	<!-- 실습 6 끝 -->
	</script>
	
	<!-- /// body 끝 /// -->

	<%@ include file="./footer.jsp"%>

</body>
</html>