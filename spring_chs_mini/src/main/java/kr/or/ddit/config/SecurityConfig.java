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

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // 나중에 토큰을 검증할 필터를 주입받아야 합니다.
    private final JwtProvider jwtProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                // 1. 기본 폼 로그인과 HTTP Basic 인증을 비활성화해야 합니다.
                // 이 설정을 안 하면 스프링이 계속 임시 비밀번호를 생성합니다.
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/pokemonList", "/newPokemonList").permitAll()
                        .requestMatchers("/pokemon/**").permitAll()
                        // 리액트에서 외부 API를 직접 호출하면 상관없지만, 서버를 거친다면 아래처럼 허용
                        // .requestMatchers("/api/proxy/**").permitAll()
                        .anyRequest().authenticated());

        // [중요] JWT 필터를 시큐리티 체인에 등록해야 토큰 인증이 작동합니다.
        JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter(jwtProvider);
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