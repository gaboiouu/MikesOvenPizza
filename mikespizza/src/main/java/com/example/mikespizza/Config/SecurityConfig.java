package com.example.mikespizza.Config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
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
                    // ==================== RUTAS PÚBLICAS ====================
                    auth.requestMatchers("/users/login", "/users/registrar").permitAll()
                            
                            // ==================== PRODUCTOS ====================
                            .requestMatchers(HttpMethod.GET, "/productos/listar", "/productos/{id}").permitAll()
                            .requestMatchers(HttpMethod.POST, "/productos/crear").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.PUT, "/productos/actualizar/**").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.DELETE, "/productos/eliminar/**").hasAnyRole("ADMIN", "MASTER")
                            
                            // ==================== PEDIDOS ====================
                            .requestMatchers(HttpMethod.POST, "/pedidos/crear").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.GET, "/pedidos/usuario/**").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.GET, "/pedidos/mis-pedidos/**").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.GET, "/pedidos/listar").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.PUT, "/pedidos/{id}/estado").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.GET, "/pedidos/{id}").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.DELETE, "/pedidos/{id}").hasRole("MASTER")
                            
                            // ==================== RESERVAS ====================
                            .requestMatchers(HttpMethod.GET, "/reservas/listar-reservas").permitAll()
                            .requestMatchers(HttpMethod.POST, "/reservas/crear-reservas").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.GET, "/reservas/mis-reservas/**").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.PUT, "/reservas/actualizar-reservas/**").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.DELETE, "/reservas/eliminar-reservas/**").hasAnyRole("ADMIN", "MASTER")
                            
                            // ==================== INCIDENCIAS ====================
                            .requestMatchers(HttpMethod.POST, "/incidencias-admin/crear").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.GET, "/incidencias-admin/listar").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.GET, "/incidencias-admin/listar/estado").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.PUT, "/incidencias-admin/{id}/estado").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.PUT, "/incidencias-admin/{id}").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.GET, "/incidencias-admin/{id}").hasAnyRole("ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.DELETE, "/incidencias-admin/{id}").hasRole("MASTER")
                            
                            // ==================== USUARIOS ====================
                            .requestMatchers(HttpMethod.GET, "/users/{id}/perfil").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.POST, "/users/agregar-puntos/**").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.POST, "/users/canjear-puntos/**").hasAnyRole("CLIENTE", "ADMIN", "MASTER")
                            .requestMatchers(HttpMethod.GET, "/users").hasAnyRole("MASTER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/users/{id}").hasAnyRole("MASTER", "ADMIN")
                            .requestMatchers(HttpMethod.DELETE, "/users/{id}").hasAnyRole("MASTER", "ADMIN")
                            
                            // ==================== CUALQUIER OTRA RUTA ====================
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