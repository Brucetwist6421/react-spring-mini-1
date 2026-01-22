<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>

<!-- 실습 7 시작 -->
<script type="text/javascript" src="/js/jquery.min.js"></script>
<!-- 실습 7 끝 -->
<!-- 실습 4 시작 -->
<script type="text/javascript" src="/ckeditor5/ckeditor.js"></script>
<link type="text/css" rel="stylesheet"
	href="/ckeditor5/sample/css/sample.css" />
<!-- 실습 4 끝 -->

<title></title>
<!-- 실습 5 시작 -->
<script type="text/javascript">
	//document가 모두 로딩 된 후 실행
  document.addEventListener("DOMContentLoaded", () => {
    ClassicEditor.create(
      document.querySelector("#commentTemp"),
      {
        ckfinder: {
          uploadUrl: '/image/upload'
        }
      }
    )
    .then(editor => {
      window.editor = editor;
   // 입력 시 textarea에 자동 복사
      editor.model.document.on('change:data', () => {
          document.querySelector('#comment').value = editor.getData();
      });

      // form reset 시 CKEditor 초기화
      document.forms['member'].addEventListener('reset', () => {
          editor.setData(''); // 초기값이 필요하면 '' 대신 초기 텍스트 입력 가능
          //textarea 초기화
          $("#comment").html("");
      });
    })
    .catch(err => {
      console.log(err.stack);
    });
    
    // 실습 8 시작
//     document.querySelector('#autoFill').addEventListener("click", ()=>{
// 		console.log("자동입력");
		
// 		$("input[name='id']").val("a001");
// 		$("input[name='passwd']").val("java");
// 		$("input[name='name']").val("개똥이");
// 		$("input[name='phone1']").val("010");
// 		$("input[name='phone2']").val("1234");
// 		$("input[name='phone3']").val("5678");
// 		$("input[name='gender'][value='female']").prop("checked", true);
// 		let temp = "";
// 		// 체크박스 초기화
// 	    $("input[name='hobby']").prop("checked", false);
// 		$.each($("input[name='hobby']"), function(index, element){
// 		    console.log("개똥이 : " + $(element).val());
		    
// 		    temp = $(this).val();
		    
// 		    if(temp=="read"){
// 				$(this).prop("checked",true);
// 		    }
// 		    if(temp=="movie"){
// 				$(this).prop("checked",true);
// 		    }
		    
// 		});
// 		$("#comment").html("<p>저는 개똥이 입니다.</p>");
// 		//ckeditor
// 		window.editor.setData("저는 개똥이 입니다.");
		
// 		$("select[name='city'] option[value='city01']").prop("selected", true);
		
// 		$.each($("select[name='food']"), function(index, element){
// 			// 전체 선택
// // 			$(element).find("option").prop("selected", true);
// 			// 선택하고 싶은 값들을 배열로 정의
// // 		    const selectedFoods = ["ddeukboki", "kmichijjigae"];
		    
// // 		    element는 DOM 요소이므로 jQuery로 감싸서 .val() 사용
// // 		    $(element).val(selectedFoods);
		    
// 			// 선택하고 싶은 값 배열
// 			const selectedFoods = ["ddeukboki", "kmichijjigae"];

// 			// 모든 option 순회
// 			$("select[name='food'] option").each(function() {
// 			    if(selectedFoods.includes($(this).val())){
// 			        $(this).prop("selected", true); // 선택
// 			    } else {
// 			        $(this).prop("selected", false); // 선택 해제
// 			    }
// 			});
// 		});
//     });
    
 	// 실습 8 끝
 	
 	// 실습 9 시작
 	document.querySelector('#autoFill').addEventListener("click", () => {
    console.log("자동입력");

    // input 값 세팅
    document.querySelector("input[name='id']").value = "a001";
    document.querySelector("input[name='passwd']").value = "java";
    document.querySelector("input[name='name']").value = "개똥이";
    document.querySelector("input[name='phone1']").value = "010";
    document.querySelector("input[name='phone2']").value = "1234";
    document.querySelector("input[name='phone3']").value = "5678";

    // 라디오 버튼 선택
    const genderRadios = document.querySelectorAll("input[name='gender']");
    genderRadios.forEach(radio => {
        radio.checked = (radio.value === "female");
    });

    // 체크박스 초기화 후 선택
    const hobbyCheckboxes = document.querySelectorAll("input[name='hobby']");
    hobbyCheckboxes.forEach(cb => {
        cb.checked = false; // 초기화
        if(cb.value === "read" || cb.value === "movie"){
            cb.checked = true;
        }
    });

    // textarea 및 CKEditor 세팅
    document.querySelector("#comment").value = "저는 개똥이 입니다.";
    if(window.editor){
        window.editor.setData("저는 개똥이 입니다.");
    }

    // select 단일 선택
    const citySelect = document.querySelector("select[name='city']");
    Array.from(citySelect.options).forEach(opt => {
    	if (opt.value === "city01") {
            opt.selected = true;  // city01 선택
        } else if (opt.value === "city02") {
            opt.selected = true;  // city02 선택
        } else {
            opt.selected = false; // 나머지는 선택 해제
        }
    });

    // select multiple 선택
    const foodSelect = document.querySelector("select[name='food']");
//     const selectedFoods = ["ddeukboki", "kmichijjigae"];
    Array.from(foodSelect.options).forEach(opt => {
        if (opt.value === "ddeukboki" || opt.value === "kmichijjigae") {
            opt.selected = true;
        } else {
            opt.selected = false; // 선택 해제
        }
    });
    
});
 	
 	// 실습 9 끝
    
  });
</script>
<!-- 실습 5 끝 -->
</head>
<body>

	<%@ include file="./menu.jsp"%>

	<div class="jumbotron">
		<!-- container : 이 안에 내용있다 -->
		<div class="container">
			<h1 class="display-3">title</h1>
		</div>
	</div>

	<!-- /// body 시작 /// -->
	<h3>회원 가입</h3>
	<!-- 
   요청URL : /request/form01Post
   요청파라미터 : request{id=a001,passwd=java,name=개똥이,phone1=010,phone2=1235,phone3=6780,
                  gender=여성,hobby=read,movie,city=city01,food=ddeukboki,kmichijjigae}
   요청방식 : post
    -->
	<form action="/request/form01Post" name="member" method="post">
		<p>
			아이디 : <input type="text" name="id" /> 
			<input type="button" value="아이디 중복 검사" />
		</p>
		<p>
			비밀번호 : <input type="password" name="passwd" />
		</p>
		<p>
			이름 : <input type="text" name="name" />
		</p>
		<p>
			연락처 : <input type="text" maxlength="4" size="4" name="phone1" /> - 
			<input type="text" maxlength="4" size="4" name="phone2" /> - 
			<input type="text" maxlength="4" size="4" name="phone3" />
		</p>
		<p>
			성별 : <input type="radio" name="gender" value="male" checked /> 남성
			<input type="radio" name="gender" value="female" />여성
		</p>
		<p>
			취미 : 독서<input type="checkbox" name="hobby" value="read" checked />
			운동<input type="checkbox" name="hobby" value="excercise" /> 
			영화<input type="checkbox" name="hobby" value="movie" />
		</p>

		<!-- 실습 2 시작 -->
		<p>
			<textarea rows="3" cols="30" name="comment" id="comment"
				placeholder="가입 인사">
			</textarea>
		</p>
		<!-- 실습 2 끝 -->

		<!-- 실습 3 시작 -->
		<!-- CKEditor5 : 텍스트를 편집할 수 있게 해주는 자바스크립트 기반의 오픈 소스 위지위그(What You See Is What You Get 리치 텍스트 편집기 -->
		<div id="commentTemp"></div>
		<!-- 실습 3 끝 -->


		<p>
			<!-- p.190 -->
			<!-- size속성 : 해당 개수대로 미리 보여줌 -->
			<select name="city" size="3" multiple>
				<option value="city01">대전광역시</option>
				<option value="city02">서울</option>
				<option value="city03">경기</option>
				<option value="city04">인천</option>
				<option value="city05">충청</option>
				<option value="city06">전라</option>
				<option value="city07">경상</option>
			</select>
		</p>
		<p>
			<!-- 다중 선택 가능 -->
			<select name="food" multiple>
				<optgroup label="분식류">
					<option value="ddeukboki">떡볶이</option>
					<option value="sundai">순대</option>
				</optgroup>
				<optgroup label="안주류">
					<option value="oddolpyeo">오돌뼈</option>
					<option value="odaengtang">오뎅탕</option>
				</optgroup>
				<optgroup label="찌개류">
					<option value="kmichijjigae">김치찌개</option>
					<option value="doinjangjjigae">된장찌개</option>
				</optgroup>
			</select>
		</p>
		<p>
			<input type="submit" value="가입하기" /> 
			<input type="reset" value="다시 쓰기" />
			<!-- 실습 6 시작 -->
			<button type="button" id="autoFill">자동입력</button>
			<!-- 실습 6 끝 -->
		</p>
	</form>
	<!-- /// body 끝 /// -->

	<%@ include file="./footer.jsp"%>

</body>
</html>