package fr.manooweb.backend.bootstrap;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import fr.manooweb.backend.domain.Project;
import fr.manooweb.backend.domain.Task;
import fr.manooweb.backend.domain.TaskStatus;
import fr.manooweb.backend.repository.ProjectRepository;
import fr.manooweb.backend.repository.TaskRepository;

@Component
@Profile("docker")
public class DemoDataRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataRunner.class);

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public DemoDataRunner(ProjectRepository projectRepository, TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    public void run(String... args) {
        String demoProjectName = "Spring Boot MVP";

        Project project = projectRepository
                .findByName(demoProjectName)
                .orElseGet(() -> createDemoProject(demoProjectName));

        logSummary(project.getId());
    }

    private Project createDemoProject(String name) {
        UUID projectId = UUID.randomUUID();
        OffsetDateTime now = OffsetDateTime.now();

        Project project = new Project(
                projectId,
                name,
                "Demo project created on startup (docker profile).",
                now,
                now);

        projectRepository.save(project);

        Task task1 = new Task(
                UUID.randomUUID(),
                project,
                "Create initial domain model",
                "Create initial domain model",
                TaskStatus.DONE,
                LocalDate.now().plusDays(1),
                now,
                now);

        Task task2 = new Task(
                UUID.randomUUID(),
                project,
                "Implement REST endpoints",
                "Implement REST endpoints",
                TaskStatus.TODO,
                LocalDate.now().plusDays(7),
                now,
                now);

        taskRepository.save(task1);
        taskRepository.save(task2);

        log.info("Demo data inserted: projectId={}", projectId);

        return project;
    }

    private void logSummary(UUID projectId) {
        log.info("Tasks for project: {}", taskRepository.findByProjectId(projectId).size());
        log.info("TODO tasks: {}", taskRepository.findByStatus(TaskStatus.TODO).size());
    }
}
