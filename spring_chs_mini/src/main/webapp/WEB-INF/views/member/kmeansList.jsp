<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<title></title>
<!-- 실습 25 시작 -->
<script type="text/javascript" src="/js/axios.min.js">

</script>
<!-- 실습 25 시작 -->

<script type="text/javascript">
	// 실습 20 시작
	let originSrc;
	// 실습 20 끝
	// 실습 11 시작
	/*
		숫자 배열의 합계와 평균을 계산하는 함수
		@param 숫자 배열
		@returns 합계와 평균
	*/
	function getSumAndAvg(numbers){
		//1. 합계
		console.log("numbers :", numbers);
		
		// reduce(누산기, 현재값)
	   const sum = numbers.reduce((accumulator, currentValue)=>{
	      return accumulator + currentValue;
	   },0);//0 : 초기값 0에서 누적 시작
	   
	   console.log("sum : ",sum);
	   
	   //2. 평균 계산
	   let count = numbers.length;//6
	   const avg = sum / count;
	   
	   console.log("avg : ",avg);
	   
	   //JSON Object로 리턴
	   return {
	      "sum":sum,
	      "avg":avg
	   };
		
	}
	// 실습 11 끝

 	// 실습 3 시작
 	function showStudent(){
	    const studentIds = document.querySelectorAll(".tdStudentId");
	    
	    console.log("studentIds.length : ", studentIds.length);
 	}
    // 실습 3 끝
    <!-- 실습 1 시작 -->
      //전역 함수(async 키워드 사용)
      //asynchronous(비동기). 해당 함수가 항상 promise를 반환
      //이 함수 내에서 await를 사용할 수 있음
      //await : Promise가 해결될 때까지 함수의 실행을 일시 중지함.
      // 		그래서 비동기 코드를 마치 동기 코드처럼 순서대로 읽고 작성할 수 있음
      async function fetchMemberData() {
        console.log("개똥이");

        //요청URI
        const apiUrl = "/kmeans/kmeansPredict";

        try {
          //1. fetch로 요청을 보내고 응답을 기다림
          const response = await fetch(apiUrl, {
            method: "POST",
          });

          //2. 응답 상태 확인
          if (!response.ok) {
            throw new Error(`HTTP 오류! 상태 : ${response.status}`);
          }
          //3. 응답 본문(JSON String)을 JSON Object 형식으로 파싱(직렬화)
          const memberData = await response.json();
          //4. 최종 데이터 처리
          console.log("memberData : ", memberData);

          //6. Object.groupBy() 사용
          //반복
          const clusteredDataNew = Object.groupBy(
            memberData.clusteredData,
            (clusteredDataPoint) => {
              //그룹화할 키 값을 반환
              return clusteredDataPoint.clusterId;
            }
          );
          //결과확인
          console.log("clusteredDataNew : ", clusteredDataNew);
          // 실습 2 시작
          ///////////////////// 수학, 과학 탭 시작 /////////////////////
          console.log("clusteredDataNew[0] : ", clusteredDataNew[0]); //수학,과학
          const clusteredDataMS = clusteredDataNew[0]; //tab0

          const divMS = document.querySelector("#clusteredDataMS");
          
          let strMS = `
        	  <div class="card">              
				<div class="card-body">
					<table class="table table-bordered">
					<thead>
						<tr>
						<th>학번</th>
						<th>이름</th> <!-- 실습 14 -->
						<th>x</th>
						<th>y</th>
						<th>추천계열</th>
						</tr>
					</thead>
					<tbody>
          `;
          
          clusteredDataMS.forEach((clusteredDataPoint, idx) => {
        	  strMS += `
					  <tr>
        		  		<td class="tdStudentId" data-student-id="\${clusteredDataPoint.studentId}" style="cursor:pointer;">\${clusteredDataPoint.studentId}</td>
						<td>\${clusteredDataPoint.studentName}</td> <!-- 실습 14 -->
						<td>\${clusteredDataPoint.x}</td>
						<td>\${clusteredDataPoint.y}</td>
						<td>\${clusteredDataPoint.clusterId}</td>
					  </tr>
					  `;
          });

          strMS += `
					</tbody>
					</table>
				</div>
			</div>
				`;

          divMS.innerHTML = strMS;
          
		  ///////////////////// 수학, 과학 탭 끝 /////////////////////

          ///////////////////// 국어, 영어 탭 시작 /////////////////////
          console.log("clusteredDataNew[1] : ", clusteredDataNew[1]); //국어, 영어
          const clusteredDataKE = clusteredDataNew[1]; //tab1
          const divKE = document.querySelector("#clusteredDataKE");

          let strKE = `
			<div class="card">              
				<div class="card-body">
					<table class="table table-bordered">
					<thead>
						<tr>
						<th>학번</th>
						<th>이름</th> <!-- 실습 14 -->
						<th>x</th>
						<th>y</th>
						<th>추천계열</th>
						</tr>
					</thead>
					<tbody>
			`;

          clusteredDataKE.forEach((clusteredDataPoint, idx) => {
            strKE += `
					  <tr>
            			<td class="tdStudentId" data-student-id="\${clusteredDataPoint.studentId}" style="cursor:pointer;">\${clusteredDataPoint.studentId}</td>
						<td>\${clusteredDataPoint.studentName}</td> <!-- 실습 14 -->
						<td>\${clusteredDataPoint.x}</td>
						<td>\${clusteredDataPoint.y}</td>
						<td>\${clusteredDataPoint.clusterId}</td>
					  </tr>
					  `;
          });

          strKE += `
					</tbody>
					</table>
				</div>
			</div>
				`;

          divKE.innerHTML = strKE;
          ///////////////////// 국어, 영어 탭 끝 /////////////////////

          ///////////////////// 한국사, 세계사 탭 시작 /////////////////////
          console.log("clusteredDataNew[2] : ", clusteredDataNew[2]); //한국사,세계사
          const clusteredDataHW = clusteredDataNew[2]; //tab2

          const divHW = document.querySelector("#clusteredDataHW");
          
          let strHW = `
  			<div class="card">              
  				<div class="card-body">
  					<table class="table table-bordered">
  					<thead>
  						<tr>
  						<th>학번</th>
  						<th>이름</th> <!-- 실습 14 -->
  						<th>x</th>
  						<th>y</th>
  						<th>추천계열</th>
  						</tr>
  					</thead>
  					<tbody>
  			`;

            clusteredDataHW.forEach((clusteredDataPoint, idx) => {
              strHW += `
  					  <tr>
            	  		<td class="tdStudentId" data-student-id="\${clusteredDataPoint.studentId}" style="cursor:pointer;">\${clusteredDataPoint.studentId}</td>
            	  		<td>\${clusteredDataPoint.studentName}</td> <!-- 실습 14 -->
  						<td>\${clusteredDataPoint.x}</td>
  						<td>\${clusteredDataPoint.y}</td>
  						<td>\${clusteredDataPoint.clusterId}</td>
  					  </tr>
  					  `;
            });

            strHW += `
  					</tbody>
  					</table>
  				</div>
  			</div>
  				`;

          divHW.innerHTML = strHW;
          
		  ///////////////////// 한국사, 세계사 탭 끝 /////////////////////

          // 실습 2 끝
          // 실습 4 시작
		  //학생정보확인용 함수
          showStudent();
       	  // 실습 4 끝
        } catch (error) {
          //5. 네트워크 오류나 위의 throw된 에러 처리
          console.error(
            "데이터를 가져오는 중 오류가 발생했습니다 : ",
            error.message
          );
        }
      }
      
      // 실습 19 시작
      function handleImgFileSelect(e){
		console.log("handleImgFileSelect");
		//1. 이벤트가 발생 된 타겟 안에 들어있는 이미지 파일들을 가져와보자
		let files = e.target.files;
		   
	    //2. 이미지가 여러개가 있을 수 있으므로 이미지들을 각각 분리해서 배열로 만듦
	    //files : {개똥이.jpg, 개똥삼.jpg, 개똥오.jpg}
	    //fileArr : [개똥이.jpg, 개똥삼.jpg, 개똥오.jpg]
	    let fileArr = Array.prototype.slice.call(files);
	    
	    originSrc = $("#divProfile").children("img").eq(0).attr("src");
	    
	    console.log("originSrc : ", originSrc);
	    
	    //3. 파일 타입의 배열 반복. f : 배열 안에 들어있는 각각의 이미지 파일 객체
	    $("#divProfile").html("");
	    fileArr.forEach(function(f){
	        //이미지 파일이 아닌 경우 이미지 미리보기 실패 처리(MIME타입)
			if(!f.type.match("image.*")){
				//함수 종료
	        	return;
			}
	    //이미지 객체를 읽을 자바스크립트의 reader 객체 생성
		let reader = new FileReader();	   
	      
	    
	    //e : reader가 이미지 객체를 읽는 이벤트
	    reader.onload = function(e){
	         //e.target : f(이미지 객체)
	         //e.target.result : reader가 이미지를 다 읽은 결과
// 	   		str += `
// 	   			<img class="profile-user-img img-fluid img-circle" src="\${e.target.result}">
// 	   		`;
	   		$("#divProfile").append(`
                <img class="profile-user-img img-fluid img-circle"
                     src="\${e.target.result}" 
                     style="width:100px; height:100px; margin:5px;">
            `);

	         //마지막 자식 요소로 추가
	    }// end onload
	    reader.readAsDataURL(f);

	      //p 사이에 이미지가 렌더링되어 화면에 보임
	      //객체.append : 누적, .html : 새로고침, .innerHTML : J/S
	      
	    })
	  } // end handleImgFileSelect
      // 실습 19 끝

	  // 실습 22 시작
      document.addEventListener("DOMContentLoaded", () => {

    	// 실습 26 시작
    	const btnDelete = document.querySelector('#delete');
    	
    	//클릭 이벤트 리스너 등록
    	btnDelete.addEventListener("click",function(){
			//삭제 여부 확인
			let chk = confirm("삭제하시겠습니까?");
			console.log("btnDelete->chk : ", chk);
			
			if(!chk){
				return;
			}
    	    //어떤 정보를 삭제할것인가?
    	    //<input type="text" .. id="studentId" value="1" readonly="" placeholder="학번">
    	    let studentId = document.querySelector("#studentId").value;
    	    console.log("btnDelete->studentId : ", studentId);
    	    
    	    const data = {
				"studentId":studentId
			};
    	    console.log("btnDelete->data : ", data);
	    	/* [Axios]
	   	   Axios는 node.js와 브라우저를 위한 Promise 기반 HTTP 클라이언트 입니다. 
	   	   그것은 동형 입니다(동일한 코드베이스로 브라우저와 node.js에서 실행할 수 있습니다). 
	   	   서버 사이드에서는 네이티브 node.js의 http 모듈을 사용하고, 
	   	   클라이언트(브라우저)에서는 XMLHttpRequests를 사용합니다.
	   	   
	   	   [특징]
	   	   - 브라우저를 위해 XMLHttpRequests 생성
	   	   - node.js를 위해 http 요청 생성
	   	   - Promise API를 지원
	   	   - 요청 및 응답 인터셉트
	   	   - 요청 및 응답 데이터 변환
	   	   - 요청 취소
	   	   - JSON 데이터 자동 변환
	   	   - XSRF를 막기위한 클라이언트 사이드 지원
	   	   
	   	   [변경 내역]
	   	      1. 달러.ajax({...}) → axios.post(url, data, config) 형태로 간결하게 변경
	
	   	      2. data: JSON.stringify(data) → axios는 객체를 자동으로 JSON으로 변환하므로 JSON.stringify() 불필요
	
	   	      3. success: → .then()으로 처리
	
	   	      4. error 처리는 .catch()에서 담당
	   	   */
    	  //axios를 이용한 POST 요청
    	    /*
    	    요청URI : /kmeans/deleteFinalTest
    	    요청파라미터 : JSONString{studentId=1}
    	    요청방식 : post
    	    */
    	    axios.post("/kmeans/deleteFinalTest",data,{
    	       headers:{
    	          "Content-Type":"application/json;charset=utf-8"
    	       }
    	    })
    	    .then(function (response){
    	       //요청 성공 시 응답 데이터 출력
    	       console.log("result : " + response.data);      
    	       
    	       if(response.data==1){//삭제 성공 시 목록URL을 재요청
    	          location.href="/kmeans/kmeansList";
    	       }else{
    	          alert("삭제 실패!");
    	       }
    	    })
    	    .catch(function (error){
    	       //오류 발생 시 콘솔에 출력
    	       console.error("Axios 오류 발생 : ", error);
    	    })
	   	   
    	});
    	// 실습 26 끝
    	  
		$("#btnSubmit").on("click", function() {
		//document.querySelector("#btnSubmit").addEventListener("click", function(){
			// 가상 폼
			let formData = new FormData();
		    $(".clsStud").each(function(idx,obj){
			//const studentElements = document.querySelector(".clsStud");
			//studentElements.forEach(function(obj,idx){
				let id = $(this).attr("id");
				//let id = obj.id;
				let value = $(this).val();
				//let value = obj.value;
				console.log("idx :", idx, "id : ", id, "value : ", value);
				
				//append : 마지막 자식요소로 추가
				formData.append(id, value);
			});
		    
		    //이미지 파일 꺼내기
		    let inputImgs = $("#uploadFiles");
		    let files = inputImgs[0].files;
		    //가상폼인 formData에 각각의 이미지를 넣기
		    for(let i=0; i<files.length;i++){
				formData.append("uploadFiles", files[i]);
			}
		    
		    for(const [key, value] of formData.entries()){
				console.log(`\${key} : \${value}`);
			}// end for
			$.ajax({
				url:"/kmeans/updateFinalTest",
				processData:false,
				contentType:false,
				data:formData,
				type:"post",
				dataType:"text",
				success:function(result){
					console.log("result : ", result);
					
					// 실습 24 시작
					if(result==1){
// 						var Toast = Swal.mixin({
// 			                  toast: true,
// 			                  position: 'top-end',
// 			                  showConfirmButton: false,
// 			                  timer: 3000
// 			                });
			            
// 			            Toast.fire({
// 			               icon:'success',
// 			               title:'변경 성공!'
// 			            });
						// + 중첩된 자바빈 처리
			            
			          	//일반모드 : 보임
						document.querySelector("#div1").style.display ="block";
						//변경모드 : 가려짐
						document.querySelector("#div2").style.display ="none";
						
						document.querySelector("#div3").style.display ="none";
						
// 						location.href = "/kmeans/kmeansList";
					}
					
					// 실습 24 끝
				}
			})	
			
		});
		// 실습 22 끝
    	  
		// 실습 18 시작
		// 프로필 이미지 미리보기
		$(document).on("change","#uploadFiles", handleImgFileSelect);
		
		// 실습 18 끝
    	  
        //함수 호출
        fetchMemberData();
        // 실습 5 시작
        // 첫 로딩 시 없던 엘리먼트에 접근 시 달러(document)를 사용함
//         $(document).on("click",".tdStudentId",function(){
// 			let studentId = $(this).data("studentId");
// 			console.log("studentId : ", studentId);
// 		});
        // 실습 5 끝
        
        // 실습 13 시작
        document.querySelector("#edit").addEventListener("click", function() {
			console.log("변경 모드 시작!");
			
			//일반모드 : 가려짐
			document.querySelector("#div1").style.display ="none";
			//변경모드 : 보임
			document.querySelector("#div2").style.display ="block";
			
			// 실습 16 시작
			document.querySelector("#div3").style.display ="flex";
			// 실습 16 끝
			
			//입력란의 readonly를 제거
			//1. jQuery
// 			$(".clsStud").removeAttr("readonly");
			
			//2. vanila JS
			// 클래스가 "clsStud"인 모든 요소를 선택합니다. (NodeList 반환)
   			const studInputs = document.querySelectorAll(".clsStud");
   			// 선택된 각 요소에 대해 반복을 수행합니다.
   			studInputs.forEach(inputElement=>{
	       		// 요소에서 "readonly" 속성을 제거합니다.
	       		inputElement.removeAttribute("readonly");
	       
	       		// (선택 사항) 해당 요소의 readonly 상태가 제거되었는지 콘솔로 확인
	       		console.log("요소의 readonly가 제거됨 : ", inputElement);		
   			}); //end forEach
        		
   			
		});
        
        //취소 버튼 클릭 -> 일반 모드로 전환
        document.querySelector("#btnCancel").addEventListener("click",function(){
			console.log("일반 모드!");
			
			//일반모드 : 보임
			document.querySelector("#div1").style.display ="block";
			//변경모드 : 가려짐
			document.querySelector("#div2").style.display ="none";
			
			// 실습 17 시작
			document.querySelector("#div3").style.display ="none";
			// 실습 17 끝
			//입력란에 readonly를 추가
			//1. jQuery
// 			$(".clsStud").attr("readonly","true");
			
			//2. vanila JS
			// 클래스가 "clsStud"인 모든 요소를 선택합니다. (NodeList 반환)
   			const studInputs = document.querySelectorAll(".clsStud");
   			// 선택된 각 요소에 대해 반복을 수행합니다.
   			studInputs.forEach(inputElement=>{
	       		// 요소에서 "readonly" 속성을 추가합니다.
	       		inputElement.readOnly = true;
	       
	       		// (선택 사항) 해당 요소의 readonly 상태가 추가되었는지 콘솔로 확인
	       		console.log("요소의 readonly가 추가됨 : ", inputElement);		
   			}); //end forEach
   			
   			// 실습 21 시작
   			$("#divProfile").html(`
                <img class="profile-user-img img-fluid img-circle"
                     src="\${originSrc}" 
                     style="width:100px; height:100px; margin:5px;">
            `);
   			// 실습 21 끝
        });
        
        // 실습 13 끝
        
        
        // 실습 6 시작 -- 실습 5 주석 처리
        // 첫 로딩 시 없던 엘리먼트에 접근 시 달러(document)를 사용함
        document.addEventListener("click", function(event){
			console.log("개똥미");
		
			//event.target(클릭된 요소) 이 ".tdStudentId" 클래스를 가지고 있는가?
			//closest() : 현재 요소 + 가장 가까운 상위 요소 중에 지정한 선택자와 일치하고 있는 요소를 선택
			const clickedElement = event.target.closest(".tdStudentId");
			
			if(!clickedElement){//null
				return; //함수종료
			}
			
			console.log("clickedElement : ", clickedElement);
			
			let studentId = clickedElement.dataset.studentId;
			console.log("studentId : ", studentId);
			
			// 실습 8 시작
			//fetch API를 사용하여 post 요청을 보내자.
			let data = {
				"studentId":studentId
			};
			
			 /*
			   요청URI : /kmeans/getFinalTest
			   요청파라미터 : JSON String{studentId=12}
			   요청방식 : post
			 */
			fetch("/kmeans/getFinalTest",{
				method:"post",
				headers:{"Content-Type":"application/json"},
				body:JSON.stringify(data),
			})
			.then(response=>response.json())
			.then(data=>{
				console.log("data :", data);
				// 실습 10 시작
				// 점수 배열 생성
				let numbers = [];
				// 벼열의 맨 뒤에 추가[62]
				numbers.push(data.englishScore);
				// 배열의 맨 앞에 추가[55, 62]
				numbers.unshift(data.koreanScore);
				// 인덱스 1 위치(62)에 가서 88, 90 추가
				// 0개를 삭제(삭제 안함) [55, 88, 90, 62]
				numbers.splice(1,0, data.mathScore, data.scienceScore);
				let newNumber = data.historyKr;
				// 새 배열을 생성하고 기존 요소들(numbers)을 펼치고, 새 요소를 뒤에 추가
				// [55, 88, 90, 62, 60]
				let numbersNew =[...numbers,newNumber]; //numbers 는 유지 [55, 88, 90, 62]
				let numbersNew2 =[numbers,newNumber]; //numbers 는 유지 [55, 88, 90, 62]
				// 배열의 맨뒤에 추가 [55, 88, 90, 62, 60, 58]
				numbersNew.push(data.historyWorld);
				
				console.log("numbersNew : ", numbersNew);
				console.log("numbersNew2 : ", numbersNew2);
				
				//합계와 평균 구하기
				let results = getSumAndAvg(numbersNew);
				// 실습 10 끝
				
				// 실습 9 시작
				let str 
					=`
						<div class="card card-primary">
						  <form >
						   <div class="card-body">
						   	 <!-- 실습 15 시작 -->
						     <div class="form-group">
						 	    <div class="text-center" id="divProfile">
 						 	<!--   <img class="profile-user-img img-fluid img-circle" src="/adminlte/dist/img/user4-128x128.jpg" alt="User profile picture"> -->
					`;
					
					//실습 23 시작 : 위의 img 태그 주석 처리
					if(data.fileGroupVO==null){
						str += `<img class="profile-user-img img-fluid img-circle" src="https://i1.sndcdn.com/artworks-cDzKQJGISQrJvOrp-xc9rnA-t500x500.jpg" style="width:100px; height:100px; margin:5px;">`;
					} else{
						$.each(data.fileGroupVO.fileDetailVOList, function(idx, fileDetailVO){
						 	str += `<img class="profile-user-img img-fluid img-circle" src="/upload\${fileDetailVO.fileSaveLocate}" style="width:100px; height:100px; margin:5px;">`;
						
						})
					}
					
					
					//실습 23 끝
								 	
					str += `			 	
							 	</div>
						     </div>
						     <div class="input-group" id="div3" style="display:none;">
							 	<div class="custom-file">
							 		<input type="file" class="custom-file-input" id="uploadFiles" multiple style="width:300px;">
							 		<label class="custom-file-label" for="uploadFiles">Choose file</label>
							 	</div>
							 </div>
							 <!-- 실습 15 끝 -->
						     <div class="form-group">
						      <label for="studentId">학번</label>
						      <input type="text" class="form-control clsStud" id="studentId" value="\${data.studentId}" readonly placeholder="학번" />
						     </div>
						     <div class="form-group">
						      <label for="studentName">이름</label>
						      <input type="text" class="form-control clsStud" id="studentName" value="\${data.studentName}" readonly placeholder="이름" />
						     </div>
						     <div class="form-group">
						      <label for="koreanScore">국어점수</label>
						      <input type="text" class="form-control clsStud" id="koreanScore" value="\${data.koreanScore}" readonly placeholder="국어점수" />
						     </div>
						     <div class="form-group">
						      <label for="englishScore">영어점수</label>
						      <input type="text" class="form-control clsStud" id="englishScore" value="\${data.englishScore}" readonly placeholder="영어점수" />
						     </div>
						     <div class="form-group">
						      <label for="mathScore">수학점수</label>
						      <input type="text" class="form-control clsStud" id="mathScore" value="\${data.mathScore}" readonly placeholder="수학점수" />
						     </div>
						     <div class="form-group">
						      <label for="scienceScore">과학점수</label>
						      <input type="text" class="form-control clsStud" id="scienceScore" value="\${data.scienceScore}" readonly placeholder="과학점수" />
						     </div>
						     <div class="form-group">
						      <label for="historyKr">한국사점수</label>
						      <input type="text" class="form-control clsStud" id="historyKr" value="\${data.historyKr}" readonly placeholder="한국사점수" />
						     </div>
						     <div class="form-group">
						      <label for="historyWorld">세계사점수</label>
						      <input type="text" class="form-control clsStud" id="historyWorld" value="\${data.historyWorld}" readonly placeholder="세계사점수" />
						     </div>
						     <!-- 실습 12 시작 -->
						     <div class="form-group">
				               <label for="tot">총점</label>
				               <input type="text" class="form-control clsStud" id="tot"
				                  value="\${results.sum}" readonly placeholder="총점" />
				              </div>
				              <div class="form-group">
				               <label for="avg">평균</label>
				               <input type="text" class="form-control clsStud" id="avg"
				                  value="\${results.avg.toFixed(2)}" readonly placeholder="평균" />
				              </div>
				              <!-- 실습 12 끝 -->
						   </div>
						  </form>
						</div>
					`;
					let modalBdy = document.querySelector("#modalBdy");
					modalBdy.innerHTML = str;
					// 실습 9 끝
			})
			.catch(error=>{
				console.log("error :", error);
			});
			
			console.log("data : ", data);
			
			// 학생 상세 정보 모달 띄우기
			//1. JQuery
// 			$("#modalStudent").modal("show");
			//2. vanila JS
			const modalStudent = document.querySelector("#modalStudent");
			
			const myModal = new bootstrap.Modal(modalStudent);
			
			myModal.show();
			// 실습 8 끝
			
		});	
        // 실습 6 끝
      });
    </script>
<!-- 실습 1 끝 -->
</head>
<body>
	<%@ include file="../menu.jsp"%>

	<div class="jumbotron">
		<!-- container : 이 안에 내용있다 -->
		<div class="container">
			<h1 class="display-3">title</h1>
		</div>
	</div>

	<!-- /// body 시작 /// -->
	<div class="row">
		<div class="col-md-12">
			<div class="card card-primary card-tabs">
				<div class="card-header p-0 pt-1">
					<ul class="nav nav-tabs" id="custom-tabs-one-tab" role="tablist">
						<li class="nav-item"><a class="nav-link active"
							id="custom-tabs-one-home-tab" data-toggle="pill"
							href="#custom-tabs-one-home" role="tab"
							aria-controls="custom-tabs-one-home" aria-selected="true">Home</a>
						</li>
						<li class="nav-item"><a class="nav-link"
							id="clusteredDataMS-tab" data-toggle="pill"
							href="#clusteredDataMS" role="tab"
							aria-controls="clusteredDataMS" aria-selected="false">이공계열</a></li>
						<li class="nav-item"><a class="nav-link"
							id="clusteredDataKE-tab" data-toggle="pill"
							href="#clusteredDataKE" role="tab"
							aria-controls="clusteredDataKE" aria-selected="false">문과계열</a></li>
						<li class="nav-item"><a class="nav-link"
							id="clusteredDataHW-tab" data-toggle="pill"
							href="#clusteredDataHW" role="tab"
							aria-controls="clusteredDataHW" aria-selected="false">공무계열</a></li>
					</ul>
				</div>
				<div class="card-body">
					<div class="tab-content" id="custom-tabs-one-tabContent">
						<div class="tab-pane fade show active" id="custom-tabs-one-home"
							role="tabpanel" aria-labelledby="custom-tabs-one-home-tab">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
							malesuada lacus ullamcorper dui molestie, sit amet congue quam
							finibus. Etiam ultricies nunc non magna feugiat commodo. Etiam
							odio magna, mollis auctor felis vitae, ullamcorper ornare ligula.
							Proin pellentesque tincidunt nisi, vitae ullamcorper felis
							aliquam id. Pellentesque habitant morbi tristique senectus et
							netus et malesuada fames ac turpis egestas. Proin id orci eu
							lectus blandit suscipit. Phasellus porta, ante et varius ornare,
							sem enim sollicitudin eros, at commodo leo est vitae lacus. Etiam
							ut porta sem. Proin porttitor porta nisl, id tempor risus rhoncus
							quis. In in quam a nibh cursus pulvinar non consequat neque.
							Mauris lacus elit, condimentum ac condimentum at, semper vitae
							lectus. Cras lacinia erat eget sapien porta consectetur.</div>
						<div class="tab-pane fade" id="clusteredDataMS" role="tabpanel"
							aria-labelledby="clusteredDataMS-tab">Mauris tincidunt mi
							at erat gravida, eget tristique urna bibendum. Mauris pharetra
							purus ut ligula tempor, et vulputate metus facilisis. Lorem ipsum
							dolor sit amet, consectetur adipiscing elit. Vestibulum ante
							ipsum primis in faucibus orci luctus et ultrices posuere cubilia
							Curae; Maecenas sollicitudin, nisi a luctus interdum, nisl ligula
							placerat mi, quis posuere purus ligula eu lectus. Donec nunc
							tellus, elementum sit amet ultricies at, posuere nec nunc. Nunc
							euismod pellentesque diam.</div>
						<div class="tab-pane fade" id="clusteredDataKE" role="tabpanel"
							aria-labelledby="clusteredDataKE-tab">Morbi turpis dolor,
							vulputate vitae felis non, tincidunt congue mauris. Phasellus
							volutpat augue id mi placerat mollis. Vivamus faucibus eu massa
							eget condimentum. Fusce nec hendrerit sem, ac tristique nulla.
							Integer vestibulum orci odio. Cras nec augue ipsum. Suspendisse
							ut velit condimentum, mattis urna a, malesuada nunc. Curabitur
							eleifend facilisis velit finibus tristique. Nam vulputate, eros
							non luctus efficitur, ipsum odio volutpat massa, sit amet
							sollicitudin est libero sed ipsum. Nulla lacinia, ex vitae
							gravida fermentum, lectus ipsum gravida arcu, id fermentum metus
							arcu vel metus. Curabitur eget sem eu risus tincidunt eleifend ac
							ornare magna.</div>
						<div class="tab-pane fade" id="clusteredDataHW" role="tabpanel"
							aria-labelledby="clusteredDataHW-tab">Pellentesque
							vestibulum commodo nibh nec blandit. Maecenas neque magna,
							iaculis tempus turpis ac, ornare sodales tellus. Mauris eget
							blandit dolor. Quisque tincidunt venenatis vulputate. Morbi
							euismod molestie tristique. Vestibulum consectetur dolor a
							vestibulum pharetra. Donec interdum placerat urna nec pharetra.
							Etiam eget dapibus orci, eget aliquet urna. Nunc at consequat
							diam. Nunc et felis ut nisl commodo dignissim. In hac habitasse
							platea dictumst. Praesent imperdiet accumsan ex sit amet
							facilisis.</div>
					</div>
				</div>
				<!-- /.card -->
			</div>
		</div>
	</div>

	<!-- 실습 7 시작 -->
	<!-- /// 학생 상세 정보 모달 시작 /// -->
	<div class="modal fade" id="modalStudent">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">Large Modal</h4>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body" id="modalBdy">
					<p></p>
				</div>
				<!-- 				<div class="modal-footer justify-content-between"> -->
				<!-- 					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
				<!-- 					<button type="button"  class="btn btn-primary">Save changes</button> -->
				<!-- 				</div> -->
				<!-- 실습 13 시작 : 위의 div 주석 처리 -->
				<!-- // 일반 모드 시작 // -->
				<div id="div1" class="modal-footer justify-content-between">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					<button type="button" class="btn btn-warning" id="edit">정보 변경</button>
					<button type="button" class="btn btn-danger" id="delete">정보 삭제</button>
				</div>
				<!-- // 일반 모드 끝 // -->
				<!-- // 변경 모드 시작 // -->
				<div id="div2" class="modal-footer justify-content-between"
					style="display: none;">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary" id="btnSubmit">확인</button>
					<button type="button" class="btn btn-danger" id="btnCancel">취소</button>
				</div>
				<!-- // 변경 모드 끝 // -->
				<!-- 실습 13 끝 -->
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /// 학생 상세 정보 모달 끝 /// -->
	<!-- 실습 7 끝 -->
	<!-- /// body 끝 /// -->

	<%@ include file="../footer.jsp"%>
</body>
</html>
