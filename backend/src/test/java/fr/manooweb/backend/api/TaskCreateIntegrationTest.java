package fr.manooweb.backend.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import fr.manooweb.backend.domain.Project;
import fr.manooweb.backend.domain.TaskStatus;
import fr.manooweb.backend.repository.ProjectRepository;
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
class TaskCreateIntegrationTest {

  @Autowired MockMvc mockMvc;

  @Autowired ProjectRepository projectRepository;

  @Test
  @WithMockUser(username = "test")
  void createTask_allowsNonTodoStatus() throws Exception {
    // Arrange
    Project project =
        projectRepository.save(new Project("Test project", "Created by integration test"));

    String payload =
        """
                {
                  "title": "First",
                  "description": "with in progress status at the beginning",
                  "dueDate": "2026-01-16",
                  "status": "IN_PROGRESS"
                }
                """;

    // Act + Assert
    mockMvc
        .perform(
            post("/api/v1/projects/{projectId}/tasks", project.getId())
                .contentType("application/json")
                .content(payload))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.title").value("First"))
        .andExpect(jsonPath("$.status").value(TaskStatus.IN_PROGRESS.name()));
  }

  @Test
  @WithMockUser(username = "test")
  void createTask_withoutStatus_returnsBadRequest() throws Exception {
    Project project =
        projectRepository.save(new Project("Test project", "Created by integration test"));

    String payload =
        """
                {
                  "title": "First"
                }
                """;

    mockMvc
        .perform(
            post("/api/v1/projects/{projectId}/tasks", project.getId())
                .contentType("application/json")
                .content(payload))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Validation failed"));
  }
}
