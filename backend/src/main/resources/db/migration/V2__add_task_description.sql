-- V2: add description to tasks

ALTER TABLE tasks
ADD COLUMN description TEXT NULL;
