package fr.manooweb.backend.repository;

import fr.manooweb.backend.domain.Project;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

  Optional<Project> findByName(String name);
}
