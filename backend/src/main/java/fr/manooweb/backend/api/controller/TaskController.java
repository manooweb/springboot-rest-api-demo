package fr.manooweb.backend.api.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import fr.manooweb.backend.api.dto.TaskCreateRequest;
import fr.manooweb.backend.api.dto.TaskResponse;
import fr.manooweb.backend.api.dto.TaskStatusUpdateRequest;
import fr.manooweb.backend.api.dto.TaskUpdateRequest;
import fr.manooweb.backend.domain.Task;
import fr.manooweb.backend.domain.TaskStatus;
import fr.manooweb.backend.service.TaskService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/projects/{projectId}/tasks")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse create(@PathVariable UUID projectId, @Valid @RequestBody TaskCreateRequest request) {
        Task task = taskService.create(
                projectId,
                request.title(),
                request.description(),
                request.dueDate(),
                request.status()
        );

        return TaskResponse.from(task);
    }

    @PutMapping("/tasks/{taskId}")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse update(@PathVariable UUID taskId, @Valid @RequestBody TaskUpdateRequest request) {
        Task task = taskService.update(
                taskId,
                request.title(),
                request.description(),
                request.dueDate(),
                request.status()
        );

        return TaskResponse.from(task);
    }

    @GetMapping("/projects/{projectId}/tasks")
    public List<TaskResponse> listByProject(
            @PathVariable UUID projectId,
            @RequestParam(required = false) TaskStatus status
    ) {
        return taskService.findByProject(projectId, status)
                .stream()
                .map(TaskResponse::from)
                .toList();
    }

    @GetMapping("/tasks/{taskId}")
    public TaskResponse getById(@PathVariable UUID taskId) {
        return TaskResponse.from(taskService.getById(taskId));
    }

    @PatchMapping("/tasks/{taskId}/status")
    public TaskResponse updateStatus(@PathVariable UUID taskId, @Valid @RequestBody TaskStatusUpdateRequest request) {
        Task task = taskService.updateStatus(taskId, request.status());
        return TaskResponse.from(task);
    }

    @DeleteMapping("/tasks/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID taskId) {
        taskService.delete(taskId);
    }
}
