package fr.manooweb.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    /**
     * Global CORS configuration for the API.
     * This is required when the frontend and backend are hosted on different origins
     * (e.g. projects.manooweb.fr → projects-api.manooweb.fr).
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Explicitly allow the frontend production domain
        config.setAllowedOrigins(List.of(
                "https://projects.manooweb.fr"
        ));

        // HTTP methods allowed by the API
        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));

        // Headers the frontend is allowed to send
        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type"
        ));

        // Headers exposed to the browser (useful if needed later)
        config.setExposedHeaders(List.of(
                "Authorization"
        ));

        // JWT is sent via Authorization header, not cookies
        config.setAllowCredentials(false);

        // Apply this CORS configuration to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
