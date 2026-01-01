package fr.manooweb.backend.api.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TaskCreateRequest(
        @NotBlank
        @Size(max = 120)
        String title,

        @Size(max = 500)
        String description,

        LocalDate dueDate
) {
}
