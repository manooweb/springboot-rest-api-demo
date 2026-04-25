package fr.manooweb.backend.api;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import fr.manooweb.backend.domain.Project;
import fr.manooweb.backend.domain.Task;
import fr.manooweb.backend.domain.TaskStatus;
import fr.manooweb.backend.repository.ProjectRepository;
import fr.manooweb.backend.repository.TaskRepository;
import java.time.LocalDate;
import java.util.UUID;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class TaskUpdateIntegrationTest {

  @Autowired MockMvc mockMvc;
  @Autowired ProjectRepository projectRepository;
  @Autowired TaskRepository taskRepository;

  @Test
  @WithMockUser(username = "test")
  void updateTask_ShouldReturnUpdatedTask() throws Exception {
    // Given
    Project project = new Project("Project for updating task", "Project Description");
    projectRepository.save(project);

    Task task =
        new Task(
            project,
            "Initial Task Title",
            "Initial Task Description",
            TaskStatus.TODO,
            LocalDate.of(2024, 12, 31));
    taskRepository.save(task);

    // When & Then
    mockMvc
        .perform(
            put("/api/v1/tasks/{taskId}", task.getId())
                .with(csrf())
                .contentType("application/json")
                .content(
                    """
                        {
                            "title": "Updated Task Title",
                            "description": "Updated Task Description",
                            "dueDate": "2025-01-15",
                            "status": "IN_PROGRESS"
                        }
                        """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.projectId").value(project.getId().toString()))
        .andExpect(jsonPath("$.id").value(task.getId().toString()))
        .andExpect(jsonPath("$.title").value("Updated Task Title"))
        .andExpect(jsonPath("$.description").value("Updated Task Description"))
        .andExpect(jsonPath("$.dueDate").value("2025-01-15"))
        .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
  }

  @Test
  @WithMockUser(username = "test")
  @SuppressWarnings("null")
  void updateTask_withWrongId_ShouldReturnNotFound() throws Exception {
    // Given
    UUID taskId = UUID.randomUUID();
    // When & Then
    mockMvc
        .perform(
            put("/api/v1/tasks/{taskId}", taskId)
                .with(csrf())
                .contentType("application/json")
                .content(
                    """
                        {
                            "title": "Updated Task Title",
                            "description": "Updated Task Description",
                            "dueDate": "2025-01-15",
                            "status": "IN_PROGRESS"
                        }
                        """))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error").value("Not Found"))
        .andExpect(jsonPath("$.message").value(Matchers.containsString(taskId.toString())));
  }

  @Test
  @WithMockUser(username = "test")
  void updateTask_withMissingStatus_ShouldReturnBadRequest() throws Exception {
    // Given
    UUID taskId = UUID.randomUUID();
    // When & Then
    mockMvc
        .perform(
            put("/api/v1/tasks/{taskId}", taskId)
                .with(csrf())
                .contentType("application/json")
                .content(
                    """
                        {
                            "title": "Updated Task Title",
                            "description": "Updated Task Description",
                            "dueDate": "2025-01-15"
                        }
                        """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Validation failed"))
        .andExpect(jsonPath("$.fieldErrors[0].field").exists());
  }

  @Test
  @WithMockUser(username = "test")
  void updateTask_withMalformedJson_ShouldReturnBadRequest() throws Exception {
    // Given
    UUID taskId = UUID.randomUUID();
    // When & Then
    mockMvc
        .perform(
            put("/api/v1/tasks/{taskId}", taskId)
                .with(csrf())
                .contentType("application/json")
                // Trailing comma causes malformed JSON
                .content(
                    """
                        {
                            "title": "Updated Task Title",
                            "description": "Updated Task Description",
                            "dueDate": "2025-01-15",
                            "status": "IN_PROGRESS",
                        }
                        """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Malformed JSON request"))
        .andExpect(jsonPath("$.fieldErrors").isArray())
        .andExpect(jsonPath("$.fieldErrors").isEmpty());
  }
}
