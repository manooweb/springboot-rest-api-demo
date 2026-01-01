package fr.manooweb.backend.api.dto;

import fr.manooweb.backend.domain.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record TaskStatusUpdateRequest(
        @NotNull
        TaskStatus status
) {
}
