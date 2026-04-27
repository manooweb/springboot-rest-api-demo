package fr.manooweb.backend.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import jakarta.servlet.ServletException;
import java.io.IOException;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.web.csrf.CsrfToken;

class CsrfCookieFilterTest {

  @Test
  void doFilterInternal_withoutCsrfToken_ShouldContinueFilterChain()
      throws ServletException, IOException {
    MockFilterChain filterChain = new MockFilterChain();
    MockHttpServletRequest request = new MockHttpServletRequest();
    MockHttpServletResponse response = new MockHttpServletResponse();

    new CsrfCookieFilter().doFilterInternal(request, response, filterChain);

    assertThat(filterChain.getRequest()).isSameAs(request);
    assertThat(filterChain.getResponse()).isSameAs(response);
  }

  @Test
  void doFilterInternal_withCsrfToken_ShouldForceTokenResolution()
      throws ServletException, IOException {
    CsrfToken csrfToken = mock(CsrfToken.class);
    MockHttpServletRequest request = new MockHttpServletRequest();
    request.setAttribute(CsrfToken.class.getName(), csrfToken);

    new CsrfCookieFilter()
        .doFilterInternal(request, new MockHttpServletResponse(), new MockFilterChain());

    verify(csrfToken).getToken();
  }
}
