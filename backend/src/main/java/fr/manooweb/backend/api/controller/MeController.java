package fr.manooweb.backend.api.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import fr.manooweb.backend.api.dto.auth.MeResponse;

@RestController
@RequestMapping("/api/v1")
public class MeController {

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public MeResponse me(Authentication authentication) {
        // Authentication is populated by Spring Security once the request is authenticated.
        String username = authentication.getName();

        // When authenticated via JWT, the principal is typically a Jwt instance.
        Object principal = authentication.getPrincipal();
        if (principal instanceof Jwt jwt) {
            Object rolesClaim = jwt.getClaim("roles");

            // In this MVP we stored roles as a single string claim.
            // Keep it flexible: if the claim is missing or not a string, return an empty list.
            List<String> roles = rolesClaim instanceof String r ? List.of(r) : Collections.emptyList();

            return new MeResponse(username, roles);
        }

        // Fallback for non-JWT authentication types (should not happen once Basic Auth is disabled).
        return new MeResponse(username, Collections.emptyList());
    }
}
