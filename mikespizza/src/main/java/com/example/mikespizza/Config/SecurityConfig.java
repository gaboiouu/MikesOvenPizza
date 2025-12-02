package com.example.mikespizza.Config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.mikespizza.Service.CustomUserDetailsService;
import com.example.mikespizza.filter.JwtRequestFilter;
import com.example.mikespizza.util.JwtUtil;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtUtil jwtUtil() {
        return new JwtUtil();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public JwtRequestFilter jwtRequestFilter() {
        return new JwtRequestFilter(customUserDetailsService, jwtUtil());
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, @Lazy JwtRequestFilter jwtRequestFilter) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/users/login", "/users/registrar").permitAll()
                            .requestMatchers("/productos/listar", "/productos/{id}").permitAll()
                            .requestMatchers("/productos/crear").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers("/productos/actualizar/**").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers("/productos/eliminar/**").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers("/pedidos/crear").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers("/pedidos/usuario/**").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers("/pedidos/mis-pedidos/**").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers("/pedidos/{id}").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers("/pedidos/listar").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers("/pedidos/{id}/estado").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers("/pedidos/{id}").hasRole("MASTER")
                            .requestMatchers("/reservas/crear-reservas").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers("/reservas/mis-reservas/**").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers("/reservas/listar-reservas").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers("/reservas/actualizar-reservas/**").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers("/reservas/eliminar-reservas/**").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers("/incidencias-admin/crear").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers("/incidencias-admin/listar").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers("/incidencias-admin/listar/estado").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers("/incidencias-admin/{id}").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers("/incidencias-admin/{id}/estado").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers("/incidencias-admin/{id}").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers("/incidencias-admin/{id}").hasRole("MASTER")
                            .requestMatchers("/users/{id}/perfil").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers("/users/agregar-puntos/**").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers("/users/canjear-puntos/**").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers("/users").hasRole("MASTER")
                            .requestMatchers("/users/{id}").hasRole("MASTER")
                            .requestMatchers("/users/{id}").hasRole("MASTER")
                            .anyRequest().authenticated();
                })
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:8080",
                "http://localhost:5173",
                "http://localhost:3000"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}