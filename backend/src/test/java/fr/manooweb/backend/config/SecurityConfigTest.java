package fr.manooweb.backend.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class SecurityConfigTest {

  @Test
  void jwtEncoder_withShortSecret_ShouldFailFast() {
    SecurityConfig securityConfig = new SecurityConfig();
    ReflectionTestUtils.setField(securityConfig, "jwtSecret", "too-short");

    assertThatThrownBy(securityConfig::jwtEncoder)
        .isInstanceOf(IllegalStateException.class)
        .hasMessage("JWT secret must be at least 32 bytes for HS256");
  }

  @Test
  void jwtEncoder_withValidSecret_ShouldCreateEncoder() {
    SecurityConfig securityConfig = new SecurityConfig();
    ReflectionTestUtils.setField(securityConfig, "jwtSecret", "test-secret-at-least-32-characters");

    assertThat(securityConfig.jwtEncoder()).isNotNull();
  }
}
