<%@ page language="java" contentType="text/html; charset=UTF-8"%> <%@ taglib
prefix="c" uri="http://java.sun.com/jsp/jstl/core"%> <%@ taglib prefix="fmt"
uri="http://java.sun.com/jsp/jstl/fmt"%> <%@ taglib prefix="fn"
uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html>
<html>
  <head>
    <title>대덕의 쇼핑몰</title>
  </head>
  <body>
    <!-- /// menu.jsp 시작  -->
    <%@ include file="../menu.jsp"%>
    <!-- /// menu.jsp 끝 /// -->

    <script type="text/javascript">
      //이미지 미리보기
      //e : onchange 이벤트 객체
      function handleImgFileSelect(e) {
        //1. 이벤트가 발생 된 타겟 안에 들어있는 이미지 파일들을 가져와보자
        let files = e.target.files;

        //2. 이미지가 여러개가 있을 수 있으므로 이미지들을 각각 분리해서 배열로 만듦
        //files : {개똥이.jpg, 개똥삼.jpg, 개똥오.jpg}
        //fileArr : [개똥이.jpg, 개똥삼.jpg, 개똥오.jpg]
        let fileArr = Array.prototype.slice.call(files);

        //3. 파일 타입의 배열 반복. f : 배열 안에 들어있는 각각의 이미지 파일 객체

        let str = "";
        //이미지 미리보기 영역 초기화
        $("#img").html("");

        fileArr.forEach(function (f) {
          //이미지 파일이 아닌 경우 이미지 미리보기 실패 처리(MIME타입)
          if (!f.type.match("image.*")) {
            alert("확장자는 이미지 확장자만 가능합니다");
            //함수 종료
            return;
          }

          //이미지 객체를 읽을 자바스크립트의 reader 객체 생성
          let reader = new FileReader();

          //e : reader가 이미지 객체를 읽는 이벤트
          reader.onload = function (e) {
            // 누적해서 여러 개 가능
            str +=
              '<img src="' +
              e.target.result +
              '" style="width:250px; height:250px; margin:10px;" />';

            // 이미지가 로드된 시점에 갱신
			//id가 preview인 요소에 이미지 태그 추가
			//마지막 자식 요소로 추가
			// document.getElementById("preview").innerHTML = str; -- J/S
            $("#preview").html(str);
          };
          //e.target : f(이미지 객체)
          //e.target.result : reader가 이미지를 다 읽은 결과

          // reader 객체로 f(파일 한개)를 읽음
          reader.readAsDataURL(f);
          //p 사이에 이미지가 렌더링되어 화면에 보임
          //객체.append : 누적, .html : 새로고침, .innerHTML : J/S
        }); // end forEach

        /*[참고]******
         arr.forEach(function(str,idx){
            console.log("str : " + str);
         });

         $.each(arr,function(idx,str){
            console.log("str[" + idx + "] : " + str);
         });
         */
      } //end handleImgFileSelect
      
      //실습 2 시작
   // 공통 이미지 미리보기 함수
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

      $(function () {
	//document.addEventListener("DOMContentLoaded",function(){
		// 실습 7 시작
        const submitInput = document.querySelector("#btnSubmit");
		
		submitInput.addEventListener("click",function(){
			let formData = new FormData();
			
			//상품명, 가격, 개요 + 다중이미지파일들 추가
			let name = document.querySelector("input[name='itemName']").value;
			let description = document.querySelector("input[name='description']").value;
			let price = document.querySelector("input[name='price']").value;
			let itemId = document.querySelector("input[name='itemId']").value;
			
			// formData에 각각 추가
			formData.append("itemName", name);
			formData.append("description", description);
			formData.append("price", price);
			formData.append("itemId", itemId);
			
			
			//단일 파일 처리
			let uploadFile = document.querySelector("input[name='uploadFile']");
			let uploadFile2 = document.querySelector("input[name='uploadFile2']");
			
			if (uploadFile.files.length > 0) {
				formData.append("uploadFile", uploadFile.files[0]); 
			}
			if (uploadFile2.files.length > 0) {
				formData.append("uploadFile2", uploadFile2.files[0]);
			}
			
			//여러 파일 처리
			let fileElement = document.querySelector("input[name='uploadFiles']");
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
			fetch("/item2/editPostAjax", {
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
				    location.href = "/item2/detail?itemId=" + ${item2VO.itemId};
				}, 1000);
			})
			.catch(error=>{
				console.error("Fetch 요청 오류 발생 : ", error);
			});
		})	
        // 실습 7 끝
		
		
        $("input[name='uploadFile']").on("change", function(e){
          previewImage(e, "preview"); // preview 영역
        });
        $("input[name='uploadFile2']").on("change", function(e){
          previewImage(e, "preview2"); // preview2 영역
        });
        
        // 실습 5 시작
        $("input[name='uploadFiles']").on("change", function(e){
          previewImage(e, "img3"); // img3 영역
        });
        
        //vanila JS
        //const uploadFiles = document.querySelector("input[name='uploadFiles']");
        //uploadFiles.addEventListener("change", function(e){
        // 	previewImage(e, "img3"); // img3 영역
        //})
        // 실습 5 끝
        
      });
      // 실습 2 끝

//       $(function () {
//         $("input[name='uploadFile']").on("change", handleImgFileSelect);
//         $("input[name='uploadFile2']").on("change", handleImgFileSelect);
//       });
    </script>

    <!-- /// 제목 시작 /// -->
    <div class="jumbotron">
      <!-- container : 내용이 들어갈 때 -->
      <div class="container">
        <h1 class="display-3">단일 파일업로드 수정</h1>
      </div>
    </div>
    <!-- /// 제목 끝 /// -->

    <!-- 
		ItemVO(itemId=1, itemName=삼성태블릿, price=120000, description=쓸만함
	      , pictureUrl=/2025/09/08/asdldfksj_개똥이.jpg, uploadFile=
	   model.addAttribute("item2VO", item2VO);
	   
	 readonly vs disabled
	 submit 시   submit 시
	 값이 넘어감   값이 안넘어감
	 -->
    <form
      action="/item2/editPost"
      method="post"
      enctype="multipart/form-data"
    >
      <input type="hidden" value="${item2VO.itemId}" name="itemId" />
      <table>
        <tr>
          <th>상품명</th>
          <td>
            <input
              type="text"
              name="itemName"
              value="${item2VO.itemName}"
              required
              placeholder="상품명"
            />
          </td>
        </tr>
        <tr>
          <th>가격</th>
          <td>
            <input
              type="text"
              name="price"
              value="${item2VO.price}"
              required
              placeholder="가격"
            />
          </td>
        </tr>
        <tr>
          <th>기존상품이미지1</th>
          <td>
            <img
              src="/upload${item2VO.pictureUrl}"
              style="width: 250px; height: 250px"
            />
            <p />
          </td>
        </tr>
        <tr>
          <th>기존상품이미지2</th>
          <td>
            <img
              src="/upload${item2VO.pictureUrl2}"
              style="width: 250px; height: 250px"
            />
            <p />
          </td>
        </tr>
        <!-- 실습 8 시작 -->
        <tr>
          <th>기존다중이미지</th>
          <td>
<%--             <p>${item2VO.fileGroupVO.fileDetailVOList}</p> --%>
            <c:forEach var="fileDetailVO" items="${item2VO.fileGroupVO.fileDetailVOList}" varStatus="stat">
            	<img src="/upload${fileDetailVO.fileSaveLocate}" style="width: 250px; height: 250px;" />
            </c:forEach>
          </td>
        </tr>
        <!-- 실습 8 끝 -->
        <!-- 실습 3 시작 -->
        <tr>
          <th>수정상품이미지1</th>
          <td>
            <div id="preview"></div>
            <input type="file" name="uploadFile" placeholder="상품이미지1" />
          </td>
        </tr>
         <tr>
          <th>수정상품이미지2</th>
          <td>
            <div id="preview2"></div>
            <input type="file" name="uploadFile2" placeholder="상품이미지2" />
          </td>
        </tr>
        <!-- 실습 3 끝 -->
        <!-- 실습 4 시작 -->
        <tr>
            <th>다중이미지</th>
            <td>
               <!-- 
               /upload + /2025/09/08/asdldfksj_개똥이.jpg
               D:/upload/2025/09/08/asdldfksj_개똥이.jpg
                -->
<!--                <img src="#" style="width:50%;" /> -->
               <p />
               <div id="img3"></div>
               <input type="file" name="uploadFiles" placeholder="상품이미지" multiple />
            </td>
        </tr>
        <!-- 실습 4 끝 -->
        <tr>
          <th>개요</th>
          <td>
            <input
              type="text"
              name="description"
              value="${item2VO.description}"
              placeholder="개요"
            />
          </td>
        </tr>
      </table>
      <a href="/item2/edit?itemId=${item2VO.itemId }" class="btn btn-warning">수정</a>
<!--       <button type="submit" class="btn btn-primary">확인</button> -->
      <!-- 실습 6 시작 : 확인, 수정 버튼 주석 처리 -->
      <button type="button" id="btnSubmit" class="btn btn-primary">확인</button>
      <!-- 실습 6 끝 -->
      <a  href="/item2/detail?itemId=${item2VO.itemId }" class="btn btn-warning">취소</a>
    </form>
    <hr />

    <!-- /// footer.jsp 시작 /// -->
    <%@ include file="../footer.jsp"%>
    <!-- /// footer.jsp 끝 /// -->
  </body>
</html>
