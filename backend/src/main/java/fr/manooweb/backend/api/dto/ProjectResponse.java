package fr.manooweb.backend.api.dto;

import fr.manooweb.backend.domain.Project;
import java.util.UUID;

public record ProjectResponse(UUID id, String name, String description) {
  public static ProjectResponse from(Project project) {
    return new ProjectResponse(project.getId(), project.getName(), project.getDescription());
  }
}
