package fr.manooweb.backend.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import fr.manooweb.backend.domain.Project;
import fr.manooweb.backend.repository.ProjectRepository;
import java.time.OffsetDateTime;
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
class ProjectUpdateIntegrationTest {

  @Autowired MockMvc mockMvc;
  @Autowired ProjectRepository projectRepository;

  @Test
  @WithMockUser(username = "test")
  void updateProject_ShouldReturnUpdatedProject() throws Exception {
    // Given
    Project project =
        new Project(
            UUID.randomUUID(),
            "Project for updating task",
            "Project Description",
            OffsetDateTime.now(),
            OffsetDateTime.now());
    projectRepository.save(project);

    // When & Then
    mockMvc
        .perform(
            put("/api/v1/projects/{id}", project.getId())
                .contentType("application/json")
                .content(
                    """
                        {
                            "name": "Updated Project Name",
                            "description": "Updated Project Description"
                        }
                        """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(project.getId().toString()))
        .andExpect(jsonPath("$.name").value("Updated Project Name"))
        .andExpect(jsonPath("$.description").value("Updated Project Description"));
  }

  @Test
  @WithMockUser(username = "test")
  @SuppressWarnings("null")
  void updateProject_withWrongId_ShouldReturnNotFound() throws Exception {
    // Given
    UUID projectId = UUID.randomUUID();
    // When & Then
    mockMvc
        .perform(
            put("/api/v1/projects/{id}", projectId)
                .contentType("application/json")
                .content(
                    """
                        {
                            "name": "Updated Project Name",
                            "description": "Updated Project Description"
                        }
                        """))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.error").value("Not Found"))
        .andExpect(jsonPath("$.message").value(Matchers.containsString(projectId.toString())));
  }

  @Test
  @WithMockUser(username = "test")
  void updateProject_withEmptyName_ShouldReturnBadRequest() throws Exception {
    // Given
    UUID projectId = UUID.randomUUID();
    // When & Then
    mockMvc
        .perform(
            put("/api/v1/projects/{id}", projectId)
                .contentType("application/json")
                .content(
                    """
                        {
                            "name": "",
                            "description": "Updated Project Description"
                        }
                        """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Validation failed"))
        .andExpect(jsonPath("$.fieldErrors[0].field").exists());
  }

  @Test
  @WithMockUser(username = "test")
  void updateProject_withMalformedJson_ShouldReturnBadRequest() throws Exception {
    // Given
    UUID projectId = UUID.randomUUID();
    // When & Then
    mockMvc
        .perform(
            put("/api/v1/projects/{id}", projectId)
                .contentType("application/json")
                // Trailing comma causes malformed JSON
                .content(
                    """
                        {
                            "name": "Updated Project Name",
                            "description": "Updated Project Description",
                        }
                        """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Malformed JSON request"))
        .andExpect(jsonPath("$.fieldErrors").isArray())
        .andExpect(jsonPath("$.fieldErrors").isEmpty());
  }
}
