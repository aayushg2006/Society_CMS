package com.society.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF (essential for non-browser clients like Postman)
            .csrf(csrf -> csrf.disable())

            // 2. Enable CORS (essential for React/Mobile apps)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 3. Stateless Session (because we are building a REST API, not a website with cookies)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 4. URL Permissions
            .authorizeHttpRequests(auth -> auth
                // ALLOW EVERYTHING FOR DEV/TESTING
                // This means any URL starting with /api/ is public.
                // Later, when we go to production, we will change this to .authenticated()
                .requestMatchers("/api/**").permitAll()
                
                // Allow Swagger UI (if you add it later)
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()
                
                // Block everything else that isn't an API (good security practice)
                .anyRequest().authenticated()
            );

        return http.build();
    }

    // 5. Password Encoder (We need this to encrypt passwords before saving to DB)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 6. Global CORS Configuration (Allows your Frontend to talk to Backend)
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(List.of("*")); // Allows React, Mobile, Postman
        config.setAllowedHeaders(List.of("*")); // Allows all headers (Authorization, Content-Type)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allows all actions
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    // Helper for SecurityFilterChain to use the CORS config above
    private UrlBasedCorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("*"));
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}