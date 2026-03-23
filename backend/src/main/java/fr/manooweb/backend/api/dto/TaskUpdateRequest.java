package fr.manooweb.backend.api.dto;

import fr.manooweb.backend.domain.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TaskUpdateRequest(
    @NotBlank @Size(max = 120) String title,
    @Size(max = 500) String description,
    LocalDate dueDate,
    @NotNull TaskStatus status) {}
