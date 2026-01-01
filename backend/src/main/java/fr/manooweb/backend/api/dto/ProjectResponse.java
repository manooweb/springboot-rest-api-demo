package fr.manooweb.backend.api.dto;

import java.util.UUID;

import fr.manooweb.backend.domain.Project;

public record ProjectResponse(
        UUID id,
        String name,
        String description
) {
    public static ProjectResponse from(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription()
        );
    }
}
