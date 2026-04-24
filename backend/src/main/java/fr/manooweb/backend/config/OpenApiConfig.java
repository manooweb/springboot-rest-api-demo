package fr.manooweb.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

  @Bean
  public OpenAPI backendOpenApi() {
    return new OpenAPI()
        .info(
            new Info()
                .title("Spring Boot REST API Demo")
                .description(
                    """
                  Demo API.

                  <a href="/" target="_self">🏠 API home</a>
                  """)
                .version("v0"));
  }
}
