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

    <!-- 실습 2 시작 -->
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
        //dlalwl alflqhrl duddur chrlghk
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

      $(function () {
        $("input[name='uploadFile']").on("change", handleImgFileSelect);
        
        // 실습 10 시작
        $("#btnSubmit").on("click",function(){
			console.log("정보 변경 실행");
			
			let formData = new FormData();
			
			$(".clsItems").each(function(idx,obj){
				console.log("clsItems->idx : ", idx);	
				
				let name = $(this).attr("name");
				let value = $(this).val();
				
				formData.append(name, value);
			}); // end each
			
			//여러 파일 처리
			let fileElement = $("input[name='uploadFile']");
			let files = fileElement[0].files;
			
			//가상폼인 formData 에 각각의 이미지 객체를 넣자
			for(let i = 0;i<files.length;i++){
				formData.append("uploadFiles",files[i]);
			}
			
			
			for(const [key, value] of formData.entries()){
				console.log(key , " : " , value);
			};//end for	
			
			$.ajax({
				url:"/item/editPostAjax",
				processData:false,
				contentType:false,
				data:formData,
				type:"post",
				dataType:"json",
				success:function(result){
					console.log("result : ", result);
					
					// 실습 11 시작
					console.log("result.result : ", result.result);
					if(result.result=="1"){
						var Toast = Swal.mixin({
						      toast: true,
						      position: 'top-end',
						      showConfirmButton: false,
						      timer: 3000
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
						    location.href = "/item/detail?itemId=" + ${itemVO.itemId};
						}, 3000);
// 						location.href = "/item/detail?itemId="+${itemVO.itemId};
					}else{
						var Toast = Swal.mixin({
						      toast: true,
						      position: 'top-end',
						      showConfirmButton: false,
						      timer: 3000
						    });
						
						Toast.fire({
							icon:'warning',
							title:'변경되지 않았습니다. 다시 확인해주세요'
						});
					}
					// 실습 11 끝
					
				}
			});	
		});	
        
        // 실습 10 끝
      });
    </script>
    <!-- 실습 2 끝 -->

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
	   model.addAttribute("itemVO", itemVO);
	   
	 readonly vs disabled
	 submit 시   submit 시
	 값이 넘어감   값이 안넘어감
	 -->
    <form
      action="/item/editPost"
      method="post"
      enctype="multipart/form-data"
    >
      <input type="hidden" value="${itemVO.itemId }" name="itemId" 
      	<%-- 실습 6 시작 --%>
        class="form-control clsItems"
        <%-- 실습 6 끝 --%>
      />
      <table>
        <tr>
          <th>상품명</th>
          <td>
            <input
              type="text"
              name="itemName"
              value="${itemVO.itemName}"
              required
              placeholder="상품명"
              <%-- 실습 7 시작 --%>
              class="form-control clsItems"
              <%-- 실습 7 끝 --%>
            />
          </td>
        </tr>
        <tr>
          <th>가격</th>
          <td>
            <input
              type="number"
              name="price"
              value="${itemVO.price}"
              required
              placeholder="가격"
              <%-- 실습 8 시작 --%>
              class="form-control clsItems"
              <%-- 실습 8 끝 --%>
            />
          </td>
        </tr>
        <tr>
          <th>기존상품이미지</th>
          <td>
            <img
              src="/upload${itemVO.pictureUrl}"
              style="width: 250px; height: 250px"
            />
            <p />
          </td>
        </tr>
        <!-- 실습 3 시작 -->
        <tr>
          <th>수정상품이미지</th>
          <td>
            <div id="preview"></div>
<!--             <input type="file" name="uploadFile" placeholder="상품이미지" /> -->
            <!-- 실습 4 시작 : 윗 줄 주석 처리 -->
            <input type="file" name="uploadFile" placeholder="상품이미지" multiple/>
            <!-- 실습 4 끝 --> 
          </td>
        </tr>
        <!-- 실습 3 끝 -->
        <tr>
          <th>개요</th>
          <td>
            <input
              type="text"
              name="description"
              value="${itemVO.description}"
              placeholder="개요"
              <%-- 실습 9 시작 --%>
              class="form-control clsItems"
              <%-- 실습 9 끝 --%>
            />
          </td>
        </tr>
      </table>
<%--       <a href="/item/edit?itemId=${itemVO.itemId }" class="btn btn-warning">수정</a> --%>
<!--       <button type="submit" class="btn btn-primary">확인</button> -->
	  <!-- 실습 5 시작 : 수정, 확인 주석 처리 -->
      <button type="button" id="btnSubmit" class="btn btn-primary">확인</button>
      <!-- 실습 5 끝 -->
      <a  href="/item/detail?itemId=${itemVO.itemId }" class="btn btn-warning">취소</a>
    </form>
    <hr />

    <!-- /// footer.jsp 시작 /// -->
    <%@ include file="../footer.jsp"%>
    <!-- /// footer.jsp 끝 /// -->
  </body>
</html>
