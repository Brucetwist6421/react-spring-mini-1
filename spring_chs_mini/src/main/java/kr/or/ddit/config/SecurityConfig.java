package kr.or.ddit.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import jakarta.servlet.DispatcherType;
import kr.or.ddit.security.CustomAccessDeniedHandler;
import kr.or.ddit.security.CustomLoginSuccessHandler;
import kr.or.ddit.security.CustomLogoutSuccessHandler;
import kr.or.ddit.service.impl.UserDetailServiceImpl;

//스프링이 환경설정을 위한 자바빈 객체로 미리 등록해줌
@Configuration
@EnableWebSecurity(debug = false)
@EnableMethodSecurity  //@PreAuthorize, @PostAuthorize 를 사용한다.
public class SecurityConfig {
	// 실습 3 시작
	//0. 스프링 시큐리티의 사용자정보를 담은 객체 D.I(의존성 주입)
	@Autowired
	UserDetailServiceImpl detailServiceImpl;
	// 실습 3 끝
	
	//1. 스프링 시큐리티 기능 비활성화
	   /*
	    스프링 시큐리티의 모든 기능을 사용하지 않게 설정하는 코드. 즉, 인증, 인가 서비스를 모든 곳에 적용하지는 않음
	    일반적으로 정적 리소스(이미지, HTML 파일)에 설정함. 정적 리소스만 스프링 시큐리티 사용을 비활성화 하는 데
	    static 하위 경로에 있는 리소스를 대상으로 ignoring() 메서드를 사용함
	    */
	   public WebSecurityCustomizer configure() {
	      return (web)->web.ignoring()
	            .requestMatchers(new AntPathRequestMatcher("/static/**"));
	   }
	   
	   //***2. 특정 HTTP 요청에 대한 웹 기반 보안 구성
	   /*
	    이 메서드에서 인증/인가 및 로그인, 로그아웃 관련 설정을 할 수 있음
	    
	    클라이언트 ----> 필터1 ----> 필터2 ---> 필터3 ---> 서버
	    클라이언트 <---- 필터1 <---- 필터2 <--- 필터3 <--- 서버
	    
	              req      req         req        req
	              resp      resp      resp      resp
	              
	    * CSRF(Cross-Site Request Forgery) 보호 비활성화
	     
	              
	    * HTTP Basic : 시큐리티에서 제공해주는 기본 인증 방식(구식 form), HTTP Basic 인증 비활성화 
	    
	    * sameOrigin : iframe 설정
	       X-Frame-Options 헤더는 브라우저에서 렌더링을 허용, 금지 여부를 결정하는 응답헤더이다. 
	       헤더 설정: X-Frame-Options를 SAMEORIGIN으로 설정하여 동일 출처의 프레임만 허용 (H2 콘솔 등 사용 시 필요)
	         사용 가능한 옵션은 아래와 같다.
	         DENY : iframe 비허용(불가)
	         SAMEORIGIN : 동일 도메인 내에선 접근 가능
	         ALLOW-FROM {도메인} : 특정 도메인 접근 가능
	    * .authorizeHttpRequests(... : // HTTP 요청에 대한 인가 규칙 설정
	          
	    * authz.dispatcherTypeMatchers(DispatcherType.FORWARD..
	                    : FORWARD, ASYNC 디스패처 유형의 요청은 모두 허용 (서블릿 포워딩 등)
	                    
	    * .requestMatchers(... : 특정 경로들에 대한 요청은 인증 없이 모두 허용
	     
	    * "/ceo/**" 경로는 "CEO" 역할을 가진 사용자만 접근 허용 
	     
	    * "/manager/**" 경로는 "CEO" 또는 "MANAGER" 역할을 가진 사용자만 접근 허용 
	     
	    * .anyRequest().authenticated() : 위에서 설정한 경로 외의 모든 요청은 인증된 사용자만 접근 허용 
	     
	     
	     // 폼 기반 로그인 설정
	    .formLogin(formLogin -> formLogin
	            // 사용자 정의 로그인 페이지 경로 설정
	            .loginPage("/login")
	            // 로그인 성공 시 리다이렉트될 기본 URL 설정
	            .defaultSuccessUrl("/articles/list")
	    )
	    // 세션 관리 설정
	    .sessionManagement(session -> session
	            // 최대 동시 세션 수를 1로 제한 (중복 로그인 방지)
	            .maximumSessions(1)
	    )
	    // 로그아웃 설정
	    .logout(logout -> logout
	            // 로그아웃 성공 시 리다이렉트될 URL 설정
	            .logoutSuccessUrl("/login")
	            // 로그아웃 시 HTTP 세션 무효화
	            .invalidateHttpSession(true)
	    )
	    // SecurityFilterChain 빌드 및 반환
	    .build(); 
	     
	     CSRF = Cross-Site Request Forgery : 공격자가 사용자의 권한을 몰래 이용해 요청을 보내는 공격
	    */
	   // 실습 1 진행
	   @Bean
	   protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		   return http.csrf(csrf->csrf.disable()).httpBasic(hbasic->hbasic.disable())
				   .headers(config->config.frameOptions(customizer->customizer.sameOrigin()))
				   .authorizeHttpRequests(
						   authz->authz.dispatcherTypeMatchers(DispatcherType.FORWARD, DispatcherType.ASYNC).permitAll()
						   .requestMatchers("/accessError","/login","/signup","/js/**","/adminlte/**","/images/**","/css/**","/sbadmin/**","*/**").permitAll()
						   .requestMatchers("/download/**").permitAll() // ← 다운로드 경로 허용
//						   .requestMatchers("/member/list").permitAll()
						   // 실습 4 시작
//						   .requestMatchers("/member/regist").hasAnyRole("ADMIN","MEMBER") //SecurityConfig에서만 ROLE_ 접두어를 생략(이렇게 만들어졌다.) hasAnyRole : 둘 중에 하나의 권한만 있어도 된다.
						   // 실습 4 끝
						   // 실습 5 시작
//						   .requestMatchers("/notice/list").permitAll()
//						   .requestMatchers("/notice/regist").hasRole("ADMIN") //SecurityConfig에서만 ROLE_ 접두어를 생략(이렇게 만들어졌다.)
						   // 실습 5 끝
						   .anyRequest().authenticated())
				   .formLogin(formLogin->formLogin.loginPage("/login")
						   	 					//.defaultSuccessUrl("/member/list"))
						   						// 실습 7 시작 -- 바로 윗 줄 주석 처리
				   								.successHandler(new CustomLoginSuccessHandler()))
				   								// 실습 7 끝
				   .sessionManagement(session->session.maximumSessions(1))
				   .logout(logout->logout
						   // 실습 8 시작
						   .logoutUrl("/logout") //로그아웃을 처리할 URL
						   // 실습 8 끝
//						   .logoutSuccessUrl("/login") //로그아웃 성공 시 이동할 URL
						   // 실습 9 시작 -- 윗줄 주석 처리
						   .logoutSuccessHandler(new CustomLogoutSuccessHandler())
						   // 실습 9 끝
						   .invalidateHttpSession(true)) // 세션 무효화
				   // 실습 6 시작
				   .exceptionHandling(exceptionHandling->exceptionHandling.accessDeniedHandler(new CustomAccessDeniedHandler()))
				   // 실습 6 끝
				   .build();
	   }
	   // 실습 1 끝
	  
	 // 실습 2 시작
	 //3. 인증 관리자 관련 설정(UserDetailServiceImpl)
      /*
       사용자 정보를 가져올 서비스를 재정의하거나, 인증 방법, 예를들어 LDAP, JDBC 기반 인증 등을 설정할 때 사용함
       */
      /* 
       요청URI : /login
       요청파라미터 : request{username=test@test.com,password=java}
       요청방식 : post
       */
	   @Bean
	   public AuthenticationManager authenticationManager(HttpSecurity http,
			   BCryptPasswordEncoder bCryptPasswordEncoder,
			   UserDetailsService detailService) throws Exception {
		   //4. 사용자 정보 서비스 설정
		   /*
          userDetailsService() : 사용자 정보를 가져올 서비스를 설정함.
                             이때 설정하는 서비스클래스는 반드시 UserDetailsService를 상속받은 클래스여야 함.
          passwordEncoder() : 비밀번호를 암호화하기 위한 인코더를 설정
		    */
		   DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		   authProvider.setUserDetailsService(detailServiceImpl);
		   authProvider.setPasswordEncoder(bCryptPasswordEncoder);
		   
		   return new ProviderManager(authProvider); 
	   }
	   // 실습 2 끝
	   
	   // 실습 3 시작
	   // 패스워드 인코더로 사용할 빈 등록
	   // 톰캣 서버 기동 시 객체가 메모리에 로딩 됨
	   @Bean
	   public BCryptPasswordEncoder bCryptPasswordEncoder() {
		   return new BCryptPasswordEncoder();
	   }
	   // 실습 3 끝
}
