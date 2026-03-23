package fr.manooweb.backend.api.dto.auth;

public record AuthTokenResponse(String tokenType, String accessToken, long expiresInSeconds) {}
