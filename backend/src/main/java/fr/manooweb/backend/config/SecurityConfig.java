package fr.manooweb.backend.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Value("${app.security.jwt.secret}")
  private String jwtSecret;

  // Password hashing strategy used for encoding in-memory user passwords.
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  // MVP: in-memory user store with a single demo user (demo/demo).
  // This will be replaced later by a real user model + JWT authentication.
  @Bean
  public UserDetailsService userDetailsService(PasswordEncoder encoder) {
    UserDetails demoUser =
        User.builder()
            .username("demo@example.com")
            .password(encoder.encode("demo"))
            .roles("USER")
            .build();

    return new InMemoryUserDetailsManager(demoUser);
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
      throws Exception {
    // Exposes the AuthenticationManager used by Spring Security.
    return config.getAuthenticationManager();
  }

  @Bean
  public JwtDecoder jwtDecoder() {
    // HMAC SHA-256 decoder using a symmetric secret.
    return NimbusJwtDecoder.withSecretKey(hmacKey()).build();
  }

  @Bean
  public JwtEncoder jwtEncoder() {
    // HMAC SHA-256 encoder using a symmetric secret.
    return new NimbusJwtEncoder(new ImmutableSecret<>(hmacKey()));
  }

  private SecretKey hmacKey() {
    // For HMAC, the secret should be at least 32 bytes for HS256.
    byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
    return new SecretKeySpec(keyBytes, "HmacSHA256");
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        // Stateless API: do not create HTTP sessions.
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        // Enable CORS support and delegate configuration to CorsConfigurationSource
        .cors(Customizer.withDefaults())

        // Stateless API (JWT later). CSRF disabled for simplicity in this MVP.
        .csrf(csrf -> csrf.disable())

        // Enable HTTP Basic authentication (handy for quick testing).
        // Note: if you access endpoints via browser, Spring may also show a login page.
        .httpBasic(basic -> basic.disable())

        // Enable JWT Bearer token authentication (Authorization: Bearer <token>).
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
        .authorizeHttpRequests(
            auth ->
                auth
                    // Allow CORS preflight requests
                    .requestMatchers(HttpMethod.OPTIONS, "/**")
                    .permitAll()

                    // Public endpoints (Swagger + health)
                    .requestMatchers(
                        "/",
                        "/css/**",
                        "/js/**",
                        "/images/**",
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html")
                    .permitAll()
                    .requestMatchers("/api/v1/health")
                    .permitAll()

                    // (planned in step 7.3) JWT login endpoint: keep it public
                    .requestMatchers(HttpMethod.POST, "/api/v1/auth/login")
                    .permitAll()
                    .requestMatchers("/matomo-swagger.js")
                    .permitAll()

                    // Everything else requires authentication
                    .anyRequest()
                    .authenticated());

    return http.build();
  }
}
