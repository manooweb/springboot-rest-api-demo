package fr.manooweb.backend.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthIntegrationTest {

  private static final String AUTH_COOKIE_NAME = "auth_token";
  private static final String CSRF_COOKIE_NAME = "XSRF-TOKEN";

  @Autowired MockMvc mockMvc;

  @Test
  void login_withValidCredentials_ShouldSetAuthCookie() throws Exception {
    MvcResult result =
        mockMvc
            .perform(
                post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                          "username": "test@example.com",
                          "password": "test-password"
                        }
                        """))
            .andExpect(status().isOk())
            .andExpect(cookie().exists(AUTH_COOKIE_NAME))
            .andExpect(cookie().httpOnly(AUTH_COOKIE_NAME, true))
            .andExpect(cookie().secure(AUTH_COOKIE_NAME, true))
            .andReturn();

    String authSetCookie =
        result.getResponse().getHeaders(HttpHeaders.SET_COOKIE).stream()
            .filter(header -> header.startsWith(AUTH_COOKIE_NAME + "="))
            .findFirst()
            .orElseThrow();

    assertThat(authSetCookie).contains("SameSite=Strict");
  }

  @Test
  void login_withInvalidCredentials_ShouldReturnUnauthorized() throws Exception {
    mockMvc
        .perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {
                      "username": "test@example.com",
                      "password": "wrong-password"
                    }
                    """))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void login_withInvalidPayload_ShouldReturnBadRequest() throws Exception {
    mockMvc
        .perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {
                      "username": "",
                      "password": ""
                    }
                    """))
        .andExpect(status().isBadRequest());
  }

  @Test
  void me_withoutAuthentication_ShouldReturnUnauthorized() throws Exception {
    mockMvc
        .perform(get("/api/v1/me"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401))
        .andExpect(jsonPath("$.error").value("Unauthorized"))
        .andExpect(jsonPath("$.message").value("Authentication required"))
        .andExpect(jsonPath("$.path").value("/api/v1/me"));
  }

  @Test
  void me_withInvalidJwtCookie_ShouldReturnUnauthorized() throws Exception {
    mockMvc
        .perform(get("/api/v1/me").cookie(new Cookie(AUTH_COOKIE_NAME, "invalid-token")))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401))
        .andExpect(jsonPath("$.error").value("Unauthorized"))
        .andExpect(jsonPath("$.message").value("Invalid or expired authentication token"))
        .andExpect(jsonPath("$.path").value("/api/v1/me"));
  }

  @Test
  void me_withAuthCookie_ShouldReturnCurrentUser() throws Exception {
    Cookie authCookie = loginAndGetAuthCookie();

    mockMvc
        .perform(get("/api/v1/me").cookie(authCookie))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.username").value("test@example.com"))
        .andExpect(jsonPath("$.roles[0]").value("USER"));
  }

  @Test
  void logout_withAuthCookieAndCsrf_ShouldDeleteAuthAndCsrfCookies() throws Exception {
    Cookie authCookie = loginAndGetAuthCookie();

    MvcResult result =
        mockMvc
            .perform(post("/api/v1/auth/logout").cookie(authCookie).with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    String authSetCookie = getSetCookie(result, AUTH_COOKIE_NAME);
    assertThat(authSetCookie)
        .contains(AUTH_COOKIE_NAME + "=")
        .contains("Max-Age=0")
        .contains("Path=/")
        .contains("HttpOnly")
        .contains("Secure")
        .contains("SameSite=Strict");

    String csrfSetCookie = getSetCookie(result, CSRF_COOKIE_NAME);
    assertThat(csrfSetCookie)
        .contains(CSRF_COOKIE_NAME + "=")
        .contains("Max-Age=0")
        .contains("Path=/")
        .contains("Secure")
        .contains("SameSite=Strict")
        .doesNotContain("HttpOnly");
  }

  @Test
  void logout_withoutCsrf_ShouldReturnForbidden() throws Exception {
    Cookie authCookie = loginAndGetAuthCookie();

    mockMvc
        .perform(post("/api/v1/auth/logout").cookie(authCookie))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.status").value(403))
        .andExpect(jsonPath("$.error").value("Forbidden"))
        .andExpect(jsonPath("$.message").value("Invalid or missing CSRF token"))
        .andExpect(jsonPath("$.path").value("/api/v1/auth/logout"));
  }

  @Test
  void logout_withoutAuthentication_ShouldReturnUnauthorized() throws Exception {
    mockMvc
        .perform(post("/api/v1/auth/logout").with(csrf()))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401))
        .andExpect(jsonPath("$.error").value("Unauthorized"))
        .andExpect(jsonPath("$.message").value("Authentication required"))
        .andExpect(jsonPath("$.path").value("/api/v1/auth/logout"));
  }

  private Cookie loginAndGetAuthCookie() throws Exception {
    MvcResult result =
        mockMvc
            .perform(
                post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                          "username": "test@example.com",
                          "password": "test-password"
                        }
                        """))
            .andExpect(status().isOk())
            .andReturn();

    Cookie authCookie = result.getResponse().getCookie(AUTH_COOKIE_NAME);
    assertThat(authCookie).isNotNull();
    return authCookie;
  }

  private String getSetCookie(MvcResult result, String cookieName) {
    return result.getResponse().getHeaders(HttpHeaders.SET_COOKIE).stream()
        .filter(header -> header.startsWith(cookieName + "="))
        .findFirst()
        .orElseThrow();
  }
}
