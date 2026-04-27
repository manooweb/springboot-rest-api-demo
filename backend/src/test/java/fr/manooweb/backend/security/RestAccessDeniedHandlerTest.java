package fr.manooweb.backend.security;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.manooweb.backend.api.error.SecurityErrorResponseWriter;
import jakarta.servlet.ServletException;
import java.io.IOException;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.csrf.DefaultCsrfToken;
import org.springframework.security.web.csrf.InvalidCsrfTokenException;

class RestAccessDeniedHandlerTest {

  private final RestAccessDeniedHandler handler =
      new RestAccessDeniedHandler(
          new SecurityErrorResponseWriter(new ObjectMapper().findAndRegisterModules()));

  @Test
  void handle_withCsrfException_ShouldReturnCsrfMessage() throws ServletException, IOException {
    MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/auth/logout");
    MockHttpServletResponse response = new MockHttpServletResponse();

    DefaultCsrfToken expectedToken =
        new DefaultCsrfToken("X-XSRF-TOKEN", "_csrf", "expected-token");

    handler.handle(
        request, response, new InvalidCsrfTokenException(expectedToken, "invalid-token"));

    assertThat(response.getStatus()).isEqualTo(403);
    assertThat(response.getContentAsString())
        .contains("\"message\":\"Invalid or missing CSRF token\"");
  }

  @Test
  void handle_withGenericAccessDeniedException_ShouldReturnAccessDeniedMessage()
      throws ServletException, IOException {
    MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/admin");
    MockHttpServletResponse response = new MockHttpServletResponse();

    handler.handle(request, response, new AccessDeniedException("Forbidden"));

    assertThat(response.getStatus()).isEqualTo(403);
    assertThat(response.getContentAsString())
        .contains("\"error\":\"Forbidden\"")
        .contains("\"message\":\"Access denied\"")
        .contains("\"path\":\"/api/v1/admin\"");
  }
}
