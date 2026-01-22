package kr.or.ddit.service.impl;

import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import kr.or.ddit.vo.MemberVO;
import kr.or.ddit.vo.TblUsersVO;

//사용자가 유저를 정의함
//tblUsersVO 정보를 User(스프링 시큐리티에서 정의 된 유저) 객체 정보에 연계하여 넣어줌 
//public class CustomUser extends User {
//
//	private TblUsersVO tblUsersVO;
//	
//	//User 의 생성자를 처리해주는 생성자
//	public CustomUser(String username, String password, Collection<? extends GrantedAuthority> authorities) {
//		super(username, password, authorities);
//	}
//	
//	//return tblUsersVO == null?null:new CustomUser(tblUsersVO);
//	public CustomUser(TblUsersVO tblUsersVO) {
//		//사용자가 select 한 tblUsersVO 타입의 객체인 tblUsersVO 객체를
//		//스프링 시큐리티에서 제공해주고 있는 UsersDetails 타입으로 변환하여
//		//회원정보를 보내주면 스프링이 관리
//		super(tblUsersVO.getEmail(), tblUsersVO.getPassword(),
//				tblUsersVO.getTblUsersAuthVOList().stream()
//				.map(auth->new SimpleGrantedAuthority(auth.getAuth()))
//				.collect(Collectors.toList())
//				);
//		this.tblUsersVO = tblUsersVO;
//	}
//
//	public TblUsersVO getTblUsersVO() {
//		return tblUsersVO;
//	}
//
//	public void setTblUsersVO(TblUsersVO tblUsersVO) {
//		this.tblUsersVO = tblUsersVO;
//	}
//	
//
//}

// 실습 2 진행
public class CustomUser extends User {

	private MemberVO memberVO;
	
	//User 의 생성자를 처리해주는 생성자
	public CustomUser(String username, String password, Collection<? extends GrantedAuthority> authorities) {
		super(username, password, authorities);
	}
	
	//return tblUsersVO == null?null:new CustomUser(tblUsersVO);
	public CustomUser(MemberVO memberVO) {
		//사용자가 select 한 tblUsersVO 타입의 객체인 tblUsersVO 객체를
		//스프링 시큐리티에서 제공해주고 있는 UsersDetails 타입으로 변환하여
		//회원정보를 보내주면 스프링이 관리
		super(memberVO.getUserId(), memberVO.getUserPw(),
				memberVO.getMemberAuthVOList().stream()
				.map(auth->new SimpleGrantedAuthority(auth.getAuth()))
				.collect(Collectors.toList())
				);
		this.memberVO = memberVO;
	}

	public MemberVO getMemberVO() {
		return memberVO;
	}

	public void setMemberVO(MemberVO memberVO) {
		this.memberVO = memberVO;
	}
	

}

// 실습 2 끝
