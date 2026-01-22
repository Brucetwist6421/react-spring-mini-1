//전역함수
function test(){
   //<textarea rows="3" cols="30" id="comment" name="comment"
   document.querySelector(".ck-blurred").addEventListener("keydown",()=>{
      console.log("str : " + window.editor.getData());
      document.querySelector("#description").value = window.editor.getData();
   });
   
   document.querySelector(".ck-blurred").addEventListener("focusout",()=>{
      document.querySelector("#description").value = window.editor.getData();
   });
}

//submit
function checkAddProduct(){
   //<form name="newProduct"..
   document.newProduct.submit();
}

//document 하위의 모든 엘리먼트들이 로딩된 후에 실행
document.addEventListener("DOMContentLoaded",()=>{
   console.log("로딩 완료!");
   
   ClassicEditor.create(document.querySelector("#descriptionTemp"),{ckfinder:{uploadUrl:'/image/upload'}})
             .then(editor=>{window.editor=editor;})
             .then(test)
             .catch(err=>{console.error(err.stack);});

   //폼 엘리먼트를 가져와보자
   //<form name="newProduct" action=..
   const newProduct = document.querySelector("form[name='newProduct']");

   //폼 제출(submit) 이벤트를 감지함
   newProduct.addEventListener("submit",(event)=>{
      //폼 제출 동작을 막음
      event.preventDefault();

      console.log("validation준비 완료!");

      //<input type="text" id="productId" name="productId" />
      let productId = document.getElementById("productId");
      //<input type="text" id="pname" name="pname" />
      let pname = document.getElementById("pname");
      let unitPrice = document.getElementById("unitPrice");
      let unitsInStock = document.getElementById("unitsInStock");
      
      //상품 아이디 체크.   
      //1) 첫글자는 P.  2) 숫자를 조합하여 5~12자까지 입력 가능
      //i) P1234 => if(!true) => if(false) => if문을 건너뜀
      //ii) S1234 => if(!false) => if(true) => if문을 수행
      let regExpProductId = /^P[0-9]{4,11}$/;

      if(!regExpProductId.test(productId.value)){
         alert("[상품 코드]\nP와 숫자를 조합하여 5~12자까지 입력하세요\n첫 글자는 P로 시작하세요");
         productId.select();
         return;   //함수 종료
      }

      //상품명 체크
      //4~12자까지 입력 가능
      //ex)name.value : 삼성갤러시S22
      let regExpPname = /^[a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\s]{4,12}$/;

      if(!regExpPname.test(pname.value)){
         alert("[상품명]\n최소 4자에서 최대 12자까지 입력하세요");
         pname.select();
         return; 
      }
      
      //상품 가격 체크
      //숫자만 입력 가능
      //+ : 1이상 반복
      //ex) unitPrice.value : 1200000
      // let regExpUnitPrice = /^[0-9]+$/;
      // if(!regExpUnitPrice.test(unitPrice.value)){
      //    alert("[가격]\n숫자만 입력하세요");
      //    unitPrice.select();
      //    return;
      // }

      //ex) unitPrice.value : -1200000 막아보자
      if(unitPrice.value<0){
         alert("[가격]\n음수는 입력할 수 없습니다");
         unitPrice.select();
         unitPrice.focus();
         return;   //함수 종료
      }

      //ex) unitPrice.value : 1200000.1234982174092837 => 1200000.35
      //?:이 뭔지 고민해보자 => spring VO에서 어노테이션으로 자동 처리
      //i) 1200000.35 => if(!true) => if(false) => 함수를 통과
      //ii) 1200000.357 => if(!false) => if(true) => 함수를 멈춤
      //let regExpUnitsInStoce = /^[0-9]+$/;
      //소수점 둘째 자리까지만 입력하세요.
      //                                 숫자가1이상반복
      //                                       (                  )없어도 무관
      //                                        .이 없어도 무관   
      //                                                숫자없어도무관 
      let regExpUnitPrice2 = /^\d+(?:.?[\d]?[\d])?$/;
      if(!regExpUnitPrice2.test(unitPrice.value)){
         alert("[가격]\n소수점 둘째자리까지 허용합니다.");
         unitPrice.select();
         return;
      }

      //재고 수 체크
      //숫자만 입력 가능
      //isNaN : 이것은 숫자가 아니다(It is Not a Number)
      if(unitsInStock.value.length==0||isNaN(unitsInStock.value)){
         alert("[재고 수]\n숫자만 입력하세요");
         unitsInStock.select();
         unitsInStock.focus();
         return false;
      }

      newProduct.submit();
   });//end submit
});