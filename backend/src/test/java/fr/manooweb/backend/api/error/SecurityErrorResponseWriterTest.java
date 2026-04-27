package fr.manooweb.backend.api.error;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class SecurityErrorResponseWriterTest {

  private final SecurityErrorResponseWriter writer =
      new SecurityErrorResponseWriter(new ObjectMapper().findAndRegisterModules());

  @Test
  void write_whenResponseIsCommitted_ShouldNotWriteBody() throws IOException {
    MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/me");
    MockHttpServletResponse response = new MockHttpServletResponse();
    response.setCommitted(true);

    writer.write(request, response, HttpStatus.UNAUTHORIZED, "Authentication required");

    assertThat(response.getStatus()).isEqualTo(200);
    assertThat(response.getContentAsString()).isEmpty();
  }

  @Test
  void write_whenResponseIsNotCommitted_ShouldWriteApiErrorResponse() throws IOException {
    MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/me");
    MockHttpServletResponse response = new MockHttpServletResponse();

    writer.write(request, response, HttpStatus.UNAUTHORIZED, "Authentication required");

    assertThat(response.getStatus()).isEqualTo(401);
    assertThat(response.getContentType()).isEqualTo("application/json");
    assertThat(response.getContentAsString())
        .contains("\"status\":401")
        .contains("\"error\":\"Unauthorized\"")
        .contains("\"message\":\"Authentication required\"")
        .contains("\"path\":\"/api/v1/me\"");
  }
}
