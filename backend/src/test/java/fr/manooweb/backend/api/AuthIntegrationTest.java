package fr.manooweb.backend.api;

import static org.assertj.core.api.Assertions.assertThat;
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

    String setCookie = result.getResponse().getHeader(HttpHeaders.SET_COOKIE);
    assertThat(setCookie).contains("SameSite=Strict");
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
  void me_withoutAuthentication_ShouldReturnForbidden() throws Exception {
    mockMvc.perform(get("/api/v1/me")).andExpect(status().isForbidden());
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
}
