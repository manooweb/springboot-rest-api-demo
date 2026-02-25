package fr.manooweb.backend.config;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import jakarta.servlet.http.HttpServletRequest;

import org.springdoc.webmvc.ui.SwaggerIndexTransformer;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.resource.ResourceTransformerChain;
import org.springframework.web.servlet.resource.TransformedResource;

@Configuration
public class SwaggerUiMatomoConfig {

    private static final String CUSTOM_JS_PATH = "/matomo-swagger.js";

    @Bean
    public static BeanPostProcessor swaggerIndexTransformerMatomoWrapper() {
        return new BeanPostProcessor() {

            @Override
            public Object postProcessAfterInitialization(Object bean, String beanName) {
                if (!(bean instanceof SwaggerIndexTransformer delegate)) {
                    return bean;
                }

                // Wrap springdoc's transformer (do NOT replace it)
                return new SwaggerIndexTransformer() {

                    @Override
                    public Resource transform(HttpServletRequest request, Resource resource, ResourceTransformerChain transformerChain) throws IOException {
                        // Let springdoc apply its own transformation (disable petstore, configUrl, etc.)
                        Resource transformed = delegate.transform(request, resource, transformerChain);

                        // ✅ Hard guard: only touch the Swagger UI HTML entrypoint(s)
                        String uri = request.getRequestURI();
                        String filename = transformed.getFilename(); // usually "index.html"

                        boolean isSwaggerIndex = (uri != null
                                && (uri.endsWith("/swagger-ui/index.html") || uri.endsWith("/swagger-ui.html")))
                                || (filename != null && filename.equalsIgnoreCase("index.html"));

                        if (!isSwaggerIndex) {
                            return transformed;
                        }

                        String html;
                        try (InputStream in = transformed.getInputStream()) {
                            html = new String(in.readAllBytes(), StandardCharsets.UTF_8);
                        }

                        // Avoid double injection
                        if (html.contains(CUSTOM_JS_PATH)) {
                            return transformed;
                        }

                        String tag = "<script src=\"" + CUSTOM_JS_PATH + "\" defer></script>";
                        String updated = html.replace("</body>", tag + "\n</body>");

                        return new TransformedResource(transformed, updated.getBytes(StandardCharsets.UTF_8));
                    }
                };
            };
        };
    }
}
