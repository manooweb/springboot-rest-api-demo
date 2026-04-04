package fr.manooweb.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "projects")
public class Project {

  @Id private UUID id;

  @Column(nullable = false, length = 120)
  private String name;

  @Column(columnDefinition = "text")
  private String description;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private OffsetDateTime updatedAt;

  protected Project() {
    // JPA only
  }

  public Project(String name, String description) {

    OffsetDateTime now = OffsetDateTime.now();

    this.id = UUID.randomUUID();
    this.name = name;
    this.description = description;
    this.createdAt = now;
    this.updatedAt = now;
  }

  public UUID getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getDescription() {
    return description;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }

  public OffsetDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void update(String name, String description, OffsetDateTime updatedAt) {
    this.name = name;
    this.description = description;
    this.updatedAt = updatedAt;
  }
}
