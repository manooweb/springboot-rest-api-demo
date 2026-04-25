package fr.manooweb.backend.api;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
class ProjectCreateIntegrationTest {

  @Autowired MockMvc mockMvc;

  @Autowired ProjectRepository projectRepository;

  @Test
  @WithMockUser(username = "test")
  void createProject_ShouldReturnCreatedProject() throws Exception {

    String payload =
        """
                {
                  "name": "First project",
                  "description": "First project created by integration test"
                }
                """;

    // Act + Assert
    mockMvc
        .perform(
            post("/api/v1/projects").with(csrf()).contentType("application/json").content(payload))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.name").value("First project"))
        .andExpect(jsonPath("$.description").value("First project created by integration test"));
  }
}
