package fr.manooweb.backend.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProjectUpdateRequest(
        @NotBlank
        @Size(max = 120)
        String name,

        @Size(max = 500)
        String description
) {
}
