package fr.manooweb.backend.service;

import fr.manooweb.backend.domain.Project;
import fr.manooweb.backend.domain.Task;
import fr.manooweb.backend.domain.TaskStatus;
import fr.manooweb.backend.exception.TaskNotFoundException;
import fr.manooweb.backend.repository.TaskRepository;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TaskService {

  private final ProjectService projectService;
  private final TaskRepository taskRepository;

  public TaskService(ProjectService projectService, TaskRepository taskRepository) {
    this.projectService = projectService;
    this.taskRepository = taskRepository;
  }

  public Task create(
      UUID projectId, String title, String description, LocalDate dueDate, TaskStatus status) {
    Project project = projectService.getById(projectId);

    OffsetDateTime now = OffsetDateTime.now();

    Task task = new Task(UUID.randomUUID(), project, title, description, status, dueDate, now, now);

    return taskRepository.save(task);
  }

  public Task update(
      UUID taskId, String title, String description, LocalDate dueDate, TaskStatus status) {
    Task task = getById(taskId);
    task.update(title, description, dueDate, status, OffsetDateTime.now());
    return taskRepository.save(task);
  }

  @SuppressWarnings("null")
  @NonNull
  public Task getById(UUID taskId) {
    return taskRepository.findById(taskId).orElseThrow(() -> new TaskNotFoundException(taskId));
  }

  public List<Task> findByProject(UUID projectId, TaskStatus status) {
    projectService.getById(projectId);

    if (status == null) {
      return taskRepository.findByProjectId(projectId);
    }

    return taskRepository.findByProjectIdAndStatus(projectId, status);
  }

  public Task updateStatus(UUID taskId, TaskStatus status) {
    Task task = getById(taskId);
    task.changeStatus(status, OffsetDateTime.now());
    return taskRepository.save(task);
  }

  public void delete(UUID taskId) {
    Task task = getById(taskId);
    taskRepository.delete(task);
  }
}
