package fr.manooweb.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI backendOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Spring Boot REST API Demo")
                        .description("MVP REST API for projects and tasks (Spring Boot + Postgres + JWT).")
                        .version("v0"));
    }
}
