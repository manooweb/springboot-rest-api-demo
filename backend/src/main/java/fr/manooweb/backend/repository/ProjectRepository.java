package fr.manooweb.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import fr.manooweb.backend.domain.Project;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
}
