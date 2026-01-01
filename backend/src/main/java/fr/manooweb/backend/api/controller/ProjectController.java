package fr.manooweb.backend.api.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import fr.manooweb.backend.api.dto.ProjectCreateRequest;
import fr.manooweb.backend.api.dto.ProjectResponse;
import fr.manooweb.backend.domain.Project;
import fr.manooweb.backend.service.ProjectService;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(@Valid @RequestBody ProjectCreateRequest request) {
        Project project = projectService.create(
                request.name(),
                request.description()
        );

        return ProjectResponse.from(project);
    }

    @GetMapping
    public List<ProjectResponse> findAll() {
        return projectService.findAll()
                .stream()
                .map(ProjectResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ProjectResponse getById(@PathVariable UUID id) {
        Project project = projectService.getById(id);
        return ProjectResponse.from(project);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        projectService.delete(id);
    }
}
