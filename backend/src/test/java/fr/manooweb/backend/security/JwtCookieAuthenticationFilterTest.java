package fr.manooweb.backend.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.manooweb.backend.api.error.SecurityErrorResponseWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;

class JwtCookieAuthenticationFilterTest {

  private static final String AUTH_COOKIE_NAME = "auth_token";
  private static final String TOKEN_VALUE = "jwt-token";

  private JwtDecoder jwtDecoder;
  private JwtCookieAuthenticationFilter filter;

  @BeforeEach
  void setUp() {
    SecurityContextHolder.clearContext();
    jwtDecoder = mock(JwtDecoder.class);
    filter =
        new JwtCookieAuthenticationFilter(
            jwtDecoder,
            new SecurityErrorResponseWriter(new ObjectMapper().findAndRegisterModules()));
  }

  @AfterEach
  void tearDown() {
    SecurityContextHolder.clearContext();
  }

  @Test
  void doFilterInternal_whenAlreadyAuthenticated_ShouldNotDecodeJwt()
      throws ServletException, IOException {
    Authentication existingAuthentication =
        new TestingAuthenticationToken("existing-user", "credentials");
    SecurityContextHolder.getContext().setAuthentication(existingAuthentication);
    MockHttpServletRequest request = new MockHttpServletRequest();
    request.setCookies(new Cookie(AUTH_COOKIE_NAME, TOKEN_VALUE));

    filter.doFilterInternal(request, new MockHttpServletResponse(), new MockFilterChain());

    assertThat(SecurityContextHolder.getContext().getAuthentication())
        .isSameAs(existingAuthentication);
    verify(jwtDecoder, never()).decode(TOKEN_VALUE);
  }

  @Test
  void doFilterInternal_withoutCookies_ShouldContinueWithoutAuthentication()
      throws ServletException, IOException {
    filter.doFilterInternal(
        new MockHttpServletRequest(), new MockHttpServletResponse(), new MockFilterChain());

    assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    verify(jwtDecoder, never()).decode(TOKEN_VALUE);
  }

  @Test
  void doFilterInternal_withoutAuthCookie_ShouldContinueWithoutAuthentication()
      throws ServletException, IOException {
    MockHttpServletRequest request = new MockHttpServletRequest();
    request.setCookies(new Cookie("other_cookie", TOKEN_VALUE));

    filter.doFilterInternal(request, new MockHttpServletResponse(), new MockFilterChain());

    assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    verify(jwtDecoder, never()).decode(TOKEN_VALUE);
  }

  @Test
  void doFilterInternal_withInvalidJwt_ShouldReturnUnauthorized()
      throws ServletException, IOException {
    MockHttpServletRequest request = requestWithAuthCookie();
    MockHttpServletResponse response = new MockHttpServletResponse();
    MockFilterChain filterChain = new MockFilterChain();
    when(jwtDecoder.decode(TOKEN_VALUE)).thenThrow(new BadJwtException("Invalid JWT"));

    filter.doFilterInternal(request, response, filterChain);

    assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    assertThat(response.getStatus()).isEqualTo(401);
    assertThat(response.getContentAsString())
        .contains("\"message\":\"Invalid or expired authentication token\"");
    assertThat(filterChain.getRequest()).isNull();
    verify(jwtDecoder).decode(TOKEN_VALUE);
  }

  @Test
  void doFilterInternal_withValidJwtAndStringRole_ShouldAuthenticateRequest()
      throws ServletException, IOException {
    MockHttpServletRequest request = requestWithAuthCookie();
    when(jwtDecoder.decode(TOKEN_VALUE)).thenReturn(jwtWithRoles("USER"));

    filter.doFilterInternal(request, new MockHttpServletResponse(), new MockFilterChain());

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    assertThat(authentication).isNotNull();
    assertThat(authentication.getName()).isEqualTo("demo@example.com");
    assertThat(authentication.getAuthorities())
        .extracting("authority")
        .containsExactly("ROLE_USER");
  }

  @Test
  void doFilterInternal_withValidJwtAndRoleCollection_ShouldAuthenticateRequest()
      throws ServletException, IOException {
    MockHttpServletRequest request = requestWithAuthCookie();
    when(jwtDecoder.decode(TOKEN_VALUE))
        .thenReturn(jwtWithRoles(List.of("USER", "ROLE_ADMIN", 42)));

    filter.doFilterInternal(request, new MockHttpServletResponse(), new MockFilterChain());

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    assertThat(authentication).isNotNull();
    assertThat(authentication.getAuthorities())
        .extracting("authority")
        .containsExactly("ROLE_USER", "ROLE_ADMIN");
  }

  @Test
  void doFilterInternal_withValidJwtAndNoRoles_ShouldAuthenticateWithoutAuthorities()
      throws ServletException, IOException {
    MockHttpServletRequest request = requestWithAuthCookie();
    when(jwtDecoder.decode(TOKEN_VALUE)).thenReturn(jwtWithRoles(null));

    filter.doFilterInternal(request, new MockHttpServletResponse(), new MockFilterChain());

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    assertThat(authentication).isNotNull();
    assertThat(authentication.getAuthorities()).isEmpty();
  }

  private MockHttpServletRequest requestWithAuthCookie() {
    MockHttpServletRequest request = new MockHttpServletRequest();
    request.setCookies(new Cookie(AUTH_COOKIE_NAME, TOKEN_VALUE));
    return request;
  }

  private Jwt jwtWithRoles(Object roles) {
    Map<String, Object> claims =
        roles == null
            ? Map.of("sub", "demo@example.com")
            : Map.of("sub", "demo@example.com", "roles", roles);

    return new Jwt(
        TOKEN_VALUE,
        Instant.now(),
        Instant.now().plusSeconds(3600),
        Map.of("alg", "HS256"),
        claims);
  }
}
