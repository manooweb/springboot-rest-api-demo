package fr.manooweb.backend.api.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record AuthLoginRequest(
        @Schema(example = "demo@example.com")
        @NotBlank
        String username,

        @Schema(example = "demo")
        @NotBlank
        String password) {
}
