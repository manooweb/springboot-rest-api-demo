package fr.manooweb.backend.api.dto;

import java.time.LocalDate;
import java.util.UUID;

import fr.manooweb.backend.domain.Task;

public record TaskResponse(
        UUID id,
        UUID projectId,
        String title,
        String description,
        String status,
        LocalDate dueDate
) {
    public static TaskResponse from(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getProject().getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus().name(),
                task.getDueDate()
        );
    }
}
