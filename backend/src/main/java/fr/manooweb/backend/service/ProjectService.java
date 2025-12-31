package fr.manooweb.backend.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.manooweb.backend.domain.Project;
import fr.manooweb.backend.exception.ProjectNotFoundException;
import fr.manooweb.backend.repository.ProjectRepository;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project create(String name, String description) {
        OffsetDateTime now = OffsetDateTime.now();

        Project project = new Project(
                UUID.randomUUID(),
                name,
                description,
                now,
                now
        );

        return projectRepository.save(project);
    }

    @Transactional(readOnly = true)
    public Project getById(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));
    }

    @Transactional(readOnly = true)
    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public void delete(UUID projectId) {
        Project project = getById(projectId);
        projectRepository.delete(project);
    }
}
