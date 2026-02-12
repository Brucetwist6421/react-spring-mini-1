package kr.or.ddit.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;
import kr.or.ddit.mapper.AccountMapper;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // 나중에 토큰을 검증할 필터를 주입받아야 합니다.
    private final JwtProvider jwtProvider;

    private final AccountMapper accountMapper;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/pokemonList", "/newPokemonList").permitAll()
                        .requestMatchers("/pokemon/**").permitAll()
                        .requestMatchers("/upload/**").permitAll()
                        ///api/lmsDashboard -- 시큐리티 적용 시 주석 풀어주기
                        .requestMatchers("/api/lmsDashboard/**").permitAll()
                        .anyRequest().authenticated())
                // 인증 예외 발생 시 401 에러를 반환하도록 설정
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"code\":\"UNAUTHORIZED\", \"message\":\"로그인이 필요합니다.\"}");
                        }));

        // JWT 필터 등록
        JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter(jwtProvider, accountMapper);
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // 스프링 시큐리티가 자동으로 유저를 생성하는 것을 방지합니다.
        return username -> {
            throw new UsernameNotFoundException("인증은 AuthService에서 직접 처리됩니다.");
        };
    }
}