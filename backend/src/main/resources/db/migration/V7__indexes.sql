-- V7: Performance indexes

-- Spatial (GIST) indexes
CREATE INDEX idx_complaints_location       ON complaints USING GIST(location);
CREATE INDEX idx_city_zones_boundary       ON city_zones USING GIST(boundary);
CREATE INDEX idx_field_workers_location    ON field_workers USING GIST(current_location);
CREATE INDEX idx_worker_locations_location ON worker_locations USING GIST(location);

-- B-tree indexes on frequently queried columns
CREATE INDEX idx_users_email               ON users(email);
CREATE INDEX idx_users_role                ON users(role);

CREATE INDEX idx_complaints_citizen        ON complaints(citizen_id);
CREATE INDEX idx_complaints_status         ON complaints(status);
CREATE INDEX idx_complaints_priority       ON complaints(priority);
CREATE INDEX idx_complaints_department     ON complaints(department_id);
CREATE INDEX idx_complaints_zone           ON complaints(zone_id);
CREATE INDEX idx_complaints_category       ON complaints(category_id);
CREATE INDEX idx_complaints_created        ON complaints(created_at DESC);
CREATE INDEX idx_complaints_sla_deadline   ON complaints(sla_deadline) WHERE sla_breached = FALSE;
CREATE INDEX idx_complaints_number         ON complaints(complaint_number);

CREATE INDEX idx_assignments_complaint     ON complaint_assignments(complaint_id);
CREATE INDEX idx_assignments_worker        ON complaint_assignments(field_worker_id);
CREATE INDEX idx_assignments_status        ON complaint_assignments(status);

CREATE INDEX idx_status_history_complaint  ON complaint_status_history(complaint_id, created_at DESC);

CREATE INDEX idx_notifications_user        ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_read        ON notifications(user_id) WHERE is_read = FALSE;

CREATE INDEX idx_audit_logs_user           ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity         ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created        ON audit_logs(created_at DESC);

CREATE INDEX idx_comments_complaint        ON comments(complaint_id, created_at);
