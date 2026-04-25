package fr.manooweb.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtCookieAuthenticationFilter extends OncePerRequestFilter {

  private static final String AUTH_COOKIE_NAME = "auth_token";

  private final JwtDecoder jwtDecoder;

  public JwtCookieAuthenticationFilter(JwtDecoder jwtDecoder) {
    this.jwtDecoder = jwtDecoder;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    if (SecurityContextHolder.getContext().getAuthentication() == null) {
      String token = extractTokenFromCookie(request);

      if (token != null) {
        try {
          Jwt jwt = jwtDecoder.decode(token);
          JwtAuthenticationToken authentication =
              new JwtAuthenticationToken(jwt, extractAuthorities(jwt), jwt.getSubject());
          authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (JwtException ex) {
          SecurityContextHolder.clearContext();
        }
      }
    }

    filterChain.doFilter(request, response);
  }

  private String extractTokenFromCookie(HttpServletRequest request) {
    Cookie[] cookies = request.getCookies();
    if (cookies == null) {
      return null;
    }

    for (Cookie cookie : cookies) {
      if (AUTH_COOKIE_NAME.equals(cookie.getName())) {
        return cookie.getValue();
      }
    }

    return null;
  }

  private List<GrantedAuthority> extractAuthorities(Jwt jwt) {
    Object rolesClaim = jwt.getClaim("roles");

    if (rolesClaim instanceof String role) {
      return List.of(toRoleAuthority(role));
    }

    if (rolesClaim instanceof Collection<?> roles) {
      return roles.stream()
          .filter(String.class::isInstance)
          .map(String.class::cast)
          .map(this::toRoleAuthority)
          .map(GrantedAuthority.class::cast)
          .toList();
    }

    return List.of();
  }

  private SimpleGrantedAuthority toRoleAuthority(String role) {
    String normalizedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;
    return new SimpleGrantedAuthority(normalizedRole);
  }
}
