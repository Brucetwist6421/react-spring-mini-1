package kr.or.ddit.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import kr.or.ddit.mapper.TblUsersMapper;
import kr.or.ddit.vo.MemberVO;
import kr.or.ddit.vo.TblUsersVO;
import lombok.extern.slf4j.Slf4j;

//스프링 시큐리티에서 사용자 정보를 가져오는 인터페이스(UserDetailsService)
//자바빈으로 등록
@Slf4j
@Service
public class UserDetailServiceImpl implements UserDetailsService {
	//1. TblUsersMapper를 DI
    @Autowired
    TblUsersMapper tblUsersMapper;
	
    //실습 1 시작
    //사용자 이름(email)으로 사용자의 정보를 가져오는 메서드
    //스프링 시큐리티에서는 사용자아이디를 username이라고 함 비밀번호를 password
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
////       return this.tblUsersMapper.findByEmail(email);
//       log.info("loadUserByUserName ->email : "+ email);
//       //1) 사용자 정보를 검색
//       //username : 로그인 시 입력 받은 회원의 아이디. <input type="text" name="username"
//       //email : 로그인 시 입력 받은 회원의 메일주소. <input type="text" name="email"
//       TblUsersVO tblUsersVO = this.tblUsersMapper.findByEmail(email);
//       
//       /*
//       memberVO : MemberVO(userNo=4, userId=d001, userPw=$2a$10$vd.Y8PtJfTina10HtRQ6vOS/LXMf8.b4dejXsiXtI/3Wamkm4l1Ou, userName=개똥이, coin=1000, regDate=Mon Jan 29 00:00:00 KST 2024, updDate=null, enabled=1, 
//       memberAuthVOList=[MemberAuthVO(userNo=4, auth=ROLE_ADMIN), MemberAuthVO(userNo=4, auth=ROLE_MEMBER)])
//        */
//       log.info("loadUserByUserName ->tblUsersVO : "+ tblUsersVO);
//       // 실습 1 끝
//       
//       //MVC에서는 Controller로 리턴하지 않고, CustomUser로 리턴함
//       //CustomUser : 사용자 정의 유저 정보. extends User를 상속받고 있음
//       //2) 스프링 시큐리티의 User 객체의 정보로 넣어줌 => 프링이가 이제부터 해당 유저를 관리
//       //User : 스프링 시큐리에서 제공해주는 사용자 정보 클래스
//       /*
//        memberVO(우리) -> user(시큐리티)
//        -----------------
//        userId        -> username
//        userPw        -> password
//        enabled       -> enabled
//        auth들                -> authorities
//        */
//       // 실습 2 시작
//    	return tblUsersVO == null?null:new CustomUser(tblUsersVO);
//    	// 실습 2 끝
//    }// end loadUserByUserName
    
    // 실습 3 시작 -- 위 메서드 전체 주석 처리
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
//       return this.tblUsersMapper.findByEmail(email);
       log.info("loadUserByUserName ->userId : "+ userId);
       //1) 사용자 정보를 검색
       //username : 로그인 시 입력 받은 회원의 아이디. <input type="text" name="username"
       //email : 로그인 시 입력 받은 회원의 메일주소. <input type="text" name="email"
       MemberVO memberVO = this.tblUsersMapper.findByEmail(userId);
       
       /*
       memberVO : MemberVO(userNo=4, userId=d001, userPw=$2a$10$vd.Y8PtJfTina10HtRQ6vOS/LXMf8.b4dejXsiXtI/3Wamkm4l1Ou, userName=개똥이, coin=1000, regDate=Mon Jan 29 00:00:00 KST 2024, updDate=null, enabled=1, 
       memberAuthVOList=[MemberAuthVO(userNo=4, auth=ROLE_ADMIN), MemberAuthVO(userNo=4, auth=ROLE_MEMBER)])
        */
       log.info("loadUserByUserName ->memberVO : "+ memberVO);
       
       //MVC에서는 Controller로 리턴하지 않고, CustomUser로 리턴함
       //CustomUser : 사용자 정의 유저 정보. extends User를 상속받고 있음
       //2) 스프링 시큐리티의 User 객체의 정보로 넣어줌 => 프링이가 이제부터 해당 유저를 관리
       //User : 스프링 시큐리에서 제공해주는 사용자 정보 클래스
       /*
        memberVO(우리) -> user(시큐리티)
        -----------------
        userId        -> username
        userPw        -> password
        enabled       -> enabled
        auth들                -> authorities
        */
    	return memberVO == null?null:new CustomUser(memberVO);
    }// end loadUserByUserName
    // 실습 3 끝

}
    
    
 
 
    //TblUsersVO.ACCESS_TOKEN 값을 barer 값으로 update
