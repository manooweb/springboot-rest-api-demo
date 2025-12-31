package fr.manooweb.backend.service;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.manooweb.backend.domain.Project;
import fr.manooweb.backend.domain.Task;
import fr.manooweb.backend.domain.TaskStatus;
import fr.manooweb.backend.exception.TaskNotFoundException;
import fr.manooweb.backend.repository.TaskRepository;

@Service
@Transactional
public class TaskService {

    private final ProjectService projectService;
    private final TaskRepository taskRepository;

    public TaskService(ProjectService projectService, TaskRepository taskRepository) {
        this.projectService = projectService;
        this.taskRepository = taskRepository;
    }

    public Task create(UUID projectId, String title, LocalDate dueDate) {
        Project project = projectService.getById(projectId);

        OffsetDateTime now = OffsetDateTime.now();

        Task task = new Task(
                UUID.randomUUID(),
                project,
                title,
                TaskStatus.TODO,
                dueDate,
                now,
                now
        );

        return taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public Task getById(UUID taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));
    }

    @Transactional(readOnly = true)
    public List<Task> findByProject(UUID projectId, TaskStatus status) {
        projectService.getById(projectId);

        if (status == null) {
            return taskRepository.findByProjectId(projectId);
        }

        return taskRepository.findByProjectIdAndStatus(projectId, status);
    }

    public Task updateStatus(UUID taskId, TaskStatus status) {
        Task task = getById(taskId);

        OffsetDateTime now = OffsetDateTime.now();

        Task updated = new Task(
                task.getId(),
                task.getProject(),
                task.getTitle(),
                status,
                task.getDueDate(),
                task.getCreatedAt(),
                now
        );

        return taskRepository.save(updated);
    }

    public void delete(UUID taskId) {
        Task task = getById(taskId);
        taskRepository.delete(task);
    }
}
