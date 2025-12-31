-- V1: initial schema (projects, tasks)

CREATE TABLE projects (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    project_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    status VARCHAR(30) NOT NULL,
    due_date DATE NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_tasks_project
        FOREIGN KEY (project_id)
        REFERENCES projects (id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
