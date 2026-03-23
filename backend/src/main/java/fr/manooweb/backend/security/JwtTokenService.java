package fr.manooweb.backend.security;

import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {

  private final String issuer;
  private final JwtEncoder jwtEncoder;
  private final long ttlSeconds;

  public JwtTokenService(
      @Value("${app.security.jwt.issuer}") String issuer,
      JwtEncoder jwtEncoder,
      @Value("${app.security.jwt.ttl-seconds}") long ttlSeconds) {
    this.issuer = issuer;
    this.jwtEncoder = jwtEncoder;
    this.ttlSeconds = ttlSeconds;
  }

  public String generateToken(String username) {
    Instant now = Instant.now();

    JwtClaimsSet claims =
        JwtClaimsSet.builder()
            .issuer(issuer)
            .issuedAt(now)
            .expiresAt(now.plusSeconds(ttlSeconds))
            .subject(username)
            .claim("roles", "USER")
            .build();

    // Force HS256 so Nimbus can select the symmetric signing key (HMAC)
    JwsHeader jwsHeader = JwsHeader.with(MacAlgorithm.HS256).build();

    return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
  }

  public long getTtlSeconds() {
    return ttlSeconds;
  }
}
