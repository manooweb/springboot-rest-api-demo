package fr.manooweb.backend.api.controller;

import fr.manooweb.backend.api.dto.auth.AuthLoginRequest;
import fr.manooweb.backend.security.JwtTokenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@ResponseStatus(HttpStatus.OK)
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final JwtTokenService tokenService;

  public AuthController(AuthenticationManager authenticationManager, JwtTokenService tokenService) {
    this.authenticationManager = authenticationManager;
    this.tokenService = tokenService;
  }

  @PostMapping("/login")
  @ResponseStatus(HttpStatus.OK)
  public ResponseEntity<Void> login(@Valid @RequestBody AuthLoginRequest request) {
    // Authenticate username/password against the configured UserDetailsService.
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.username(), request.password()));

    String token = tokenService.generateToken(request.username());

    ResponseCookie cookie =
        ResponseCookie.from("auth_token", token)
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .path("/")
            .maxAge(tokenService.getTtlSeconds())
            .build();

    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
  }

  @PostMapping("/logout")
  @ResponseStatus(HttpStatus.OK)
  public ResponseEntity<Void> logout() {
    ResponseCookie authCookie =
        ResponseCookie.from("auth_token", "")
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .path("/")
            .maxAge(0)
            .build();

    ResponseCookie csrfCookie =
        ResponseCookie.from("XSRF-TOKEN", "")
            .httpOnly(false)
            .secure(true)
            .sameSite("Strict")
            .path("/")
            .maxAge(0)
            .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, authCookie.toString())
        .header(HttpHeaders.SET_COOKIE, csrfCookie.toString())
        .build();
  }
}
