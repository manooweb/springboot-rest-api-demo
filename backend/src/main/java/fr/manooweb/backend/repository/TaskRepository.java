package fr.manooweb.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import fr.manooweb.backend.domain.Task;
import fr.manooweb.backend.domain.TaskStatus;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByProjectId(UUID projectId);

    List<Task> findByProjectIdAndStatus(UUID projectId, TaskStatus status);
    
    List<Task> findByStatus(TaskStatus status);
}
