package fr.manooweb.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

        private static final String SECURITY_SCHEME_NAME = "bearerAuth";

        @Bean
        public OpenAPI backendOpenApi() {
                return new OpenAPI()
                                .info(new Info()
                                                .title("Spring Boot REST API Demo")
                                                .description("""
                                                                Demo API.

                                                                <a href="/" target="_self">🏠 API home</a>
                                                                """)
                                                .version("v0"))
                                // Register the Bearer JWT scheme so Swagger UI can show the "Authorize" button.
                                .components(new Components().addSecuritySchemes(
                                                SECURITY_SCHEME_NAME,
                                                new SecurityScheme()
                                                                .type(SecurityScheme.Type.HTTP)
                                                                .scheme("bearer")
                                                                // JWT is the standard for Bearer tokens here
                                                                // (Authorization: Bearer <token>).
                                                                .bearerFormat("JWT")))
                                // Apply the scheme globally so secured endpoints require Authorization header
                                // in Swagger.
                                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME));
        }
}
