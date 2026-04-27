package fr.manooweb.backend.security;

import fr.manooweb.backend.api.error.SecurityErrorResponseWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.csrf.CsrfException;
import org.springframework.stereotype.Component;

@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {

  private final SecurityErrorResponseWriter responseWriter;

  public RestAccessDeniedHandler(SecurityErrorResponseWriter responseWriter) {
    this.responseWriter = responseWriter;
  }

  @Override
  public void handle(
      HttpServletRequest request,
      HttpServletResponse response,
      AccessDeniedException accessDeniedException)
      throws IOException, ServletException {
    String message =
        accessDeniedException instanceof CsrfException
            ? "Invalid or missing CSRF token"
            : "Access denied";

    responseWriter.write(request, response, HttpStatus.FORBIDDEN, message);
  }
}
