package fr.manooweb.backend.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import fr.manooweb.backend.api.error.SecurityErrorResponseWriter;
import fr.manooweb.backend.security.CsrfCookieFilter;
import fr.manooweb.backend.security.JwtCookieAuthenticationFilter;
import fr.manooweb.backend.security.RestAccessDeniedHandler;
import fr.manooweb.backend.security.RestAuthenticationEntryPoint;
import fr.manooweb.backend.security.SpaCsrfTokenRequestHandler;
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
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.AndRequestMatcher;
import org.springframework.security.web.util.matcher.NegatedRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Value("${app.security.jwt.secret}")
  private String jwtSecret;

  @Value("${APP_USER_NAME}")
  private String demoUsername;

  @Value("${APP_USER_PASSWORD}")
  private String demoPassword;

  @Value("${app.security.jwt.issuer}")
  private String jwtIssuer;

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
            .username(demoUsername)
            .password(encoder.encode(demoPassword))
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
    NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(hmacKey()).build();
    decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(jwtIssuer));
    return decoder;
  }

  @Bean
  public JwtEncoder jwtEncoder() {
    // HMAC SHA-256 encoder using a symmetric secret.
    return new NimbusJwtEncoder(new ImmutableSecret<>(hmacKey()));
  }

  @Bean
  public JwtCookieAuthenticationFilter jwtCookieAuthenticationFilter(
      JwtDecoder jwtDecoder, SecurityErrorResponseWriter securityErrorResponseWriter) {
    return new JwtCookieAuthenticationFilter(jwtDecoder, securityErrorResponseWriter);
  }

  @Bean
  public CsrfCookieFilter crsfCookieFilter() {
    return new CsrfCookieFilter();
  }

  @Bean
  public RequestMatcher csrfProtectionMatcher() {
    // Login is the only unsafe endpoint excluded from CSRF because it bootstraps
    // the authentication and CSRF cookies. Mutating authenticated endpoints remain protected.
    return new AndRequestMatcher(
        CsrfFilter.DEFAULT_CSRF_MATCHER,
        new NegatedRequestMatcher(
            PathPatternRequestMatcher.withDefaults()
                .matcher(HttpMethod.POST, "/api/v1/auth/login")));
  }

  private SecretKey hmacKey() {
    // For HMAC, the secret should be at least 32 bytes for HS256.
    byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);

    if (keyBytes.length < 32) {
      throw new IllegalStateException("JWT secret must be at least 32 bytes for HS256");
    }

    return new SecretKeySpec(keyBytes, "HmacSHA256");
  }

  @Bean
  public SecurityFilterChain securityFilterChain(
      HttpSecurity http,
      JwtCookieAuthenticationFilter jwtCookieAuthenticationFilter,
      CsrfCookieFilter csrfCookieFilter,
      RestAuthenticationEntryPoint authenticationEntryPoint,
      RestAccessDeniedHandler accessDeniedHandler)
      throws Exception {
    http
        // Stateless API: do not create HTTP sessions.
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        // Enable CORS support and delegate configuration to CorsConfigurationSource
        .cors(Customizer.withDefaults())

        // Enable CSRF protection because of using cookies for JWT authentication.
        // The CSRF cookie must be readable by SPA clients so they can echo it in the
        // X-XSRF-TOKEN header. The JWT auth cookie remains HttpOnly.
        .csrf(
            csrf ->
                csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                    .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler())
                    .requireCsrfProtectionMatcher(csrfProtectionMatcher()))

        // Enable HTTP Basic authentication (handy for quick testing).
        // Note: if you access endpoints via browser, Spring may also show a login page.
        .httpBasic(basic -> basic.disable())

        // Return consistent JSON responses for security failures.
        .exceptionHandling(
            exceptions ->
                exceptions
                    .authenticationEntryPoint(authenticationEntryPoint)
                    .accessDeniedHandler(accessDeniedHandler))

        // Enable cookie-based JWT authentication.
        .addFilterBefore(jwtCookieAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        .addFilterAfter(csrfCookieFilter, CsrfFilter.class)
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
