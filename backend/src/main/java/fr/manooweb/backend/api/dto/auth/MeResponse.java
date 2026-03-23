package fr.manooweb.backend.api.dto.auth;

import java.util.List;

public record MeResponse(String username, List<String> roles) {}
