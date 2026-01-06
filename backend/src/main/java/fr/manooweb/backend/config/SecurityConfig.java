package fr.manooweb.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Password hashing strategy used for encoding in-memory user passwords.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // MVP: in-memory user store with a single demo user (demo/demo).
    // This will be replaced later by a real user model + JWT authentication.
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        UserDetails demoUser = User.builder()
                .username("demo")
                .password(encoder.encode("demo"))
                .roles("USER")
                .build();

        return new InMemoryUserDetailsManager(demoUser);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Stateless API: do not create HTTP sessions.
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Stateless API (JWT later). CSRF disabled for simplicity in this MVP.
                .csrf(csrf -> csrf.disable())

                // Enable HTTP Basic authentication (handy for quick testing).
                // Note: if you access endpoints via browser, Spring may also show a login page.
                .httpBasic(Customizer.withDefaults())

                .authorizeHttpRequests(auth -> auth
                        // Public endpoints (Swagger + health)
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/api/v1/health").permitAll()

                        // (planned in step 7.3) JWT login endpoint: keep it public
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
