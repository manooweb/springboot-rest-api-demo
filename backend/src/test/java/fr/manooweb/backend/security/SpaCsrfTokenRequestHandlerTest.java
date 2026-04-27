package fr.manooweb.backend.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.web.csrf.DefaultCsrfToken;

class SpaCsrfTokenRequestHandlerTest {

  private static final DefaultCsrfToken CSRF_TOKEN =
      new DefaultCsrfToken("X-XSRF-TOKEN", "_csrf", "csrf-token-value");

  private final SpaCsrfTokenRequestHandler handler = new SpaCsrfTokenRequestHandler();

  @Test
  void resolveCsrfTokenValue_withHeader_ShouldUsePlainHandler() {
    MockHttpServletRequest request = new MockHttpServletRequest();
    request.addHeader(CSRF_TOKEN.getHeaderName(), CSRF_TOKEN.getToken());

    String resolvedToken = handler.resolveCsrfTokenValue(request, CSRF_TOKEN);

    assertThat(resolvedToken).isEqualTo(CSRF_TOKEN.getToken());
  }

  @Test
  void resolveCsrfTokenValue_withoutHeader_ShouldUseXorHandler() {
    MockHttpServletRequest request = new MockHttpServletRequest();

    String resolvedToken = handler.resolveCsrfTokenValue(request, CSRF_TOKEN);

    assertThat(resolvedToken).isNull();
  }
}
