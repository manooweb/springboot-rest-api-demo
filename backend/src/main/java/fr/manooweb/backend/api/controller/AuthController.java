package fr.manooweb.backend.api.controller;

import fr.manooweb.backend.api.dto.auth.AuthLoginRequest;
import fr.manooweb.backend.api.dto.auth.AuthTokenResponse;
import fr.manooweb.backend.security.JwtTokenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final JwtTokenService tokenService;

  public AuthController(AuthenticationManager authenticationManager, JwtTokenService tokenService) {
    this.authenticationManager = authenticationManager;
    this.tokenService = tokenService;
  }

  @PostMapping("/login")
  @ResponseStatus(HttpStatus.OK)
  public AuthTokenResponse login(@Valid @RequestBody AuthLoginRequest request) {
    // Authenticate username/password against the configured UserDetailsService.
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.username(), request.password()));

    String token = tokenService.generateToken(request.username());

    return new AuthTokenResponse("Bearer", token, tokenService.getTtlSeconds());
  }
}
