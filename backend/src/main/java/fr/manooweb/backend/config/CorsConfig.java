package fr.manooweb.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "app.cors")
public class CorsConfig {

    /**
     * Origins allowed to call the API (ex: https://projects.manooweb.fr,
     * http://localhost:4200).
     */
    private List<String> allowedOrigins = List.of();

    public List<String> getAllowedOrigins() {
        return allowedOrigins;
    }

    public void setAllowedOrigins(List<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }

    /**
     * Global CORS configuration for the API.
     * This is required when the frontend and backend are hosted on different
     * origins
     * (e.g. projects.manooweb.fr → projects-api.manooweb.fr).
     */
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow only configured origins
        config.setAllowedOrigins(allowedOrigins);
        // HTTP methods allowed by the API
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // Headers the frontend is allowed to send
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        // Headers exposed to the browser (useful if needed later)
        config.setExposedHeaders(List.of("Authorization"));
        // JWT is sent via Authorization header, not cookies
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
