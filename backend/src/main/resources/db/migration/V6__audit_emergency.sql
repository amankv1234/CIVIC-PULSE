-- V6: Audit logs and Emergency alerts

CREATE TABLE audit_logs (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID REFERENCES users(id),
    action      VARCHAR(200) NOT NULL,
    entity_type VARCHAR(100),
    entity_id   VARCHAR(255),
    old_value   JSONB,
    new_value   JSONB,
    ip_address  VARCHAR(50),
    user_agent  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE emergency_alerts (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    severity        VARCHAR(20) DEFAULT 'HIGH' CHECK (severity IN ('MEDIUM','HIGH','CRITICAL')),
    activated_by    UUID REFERENCES users(id),
    is_active       BOOLEAN DEFAULT TRUE,
    activated_at    TIMESTAMPTZ DEFAULT NOW(),
    deactivated_at  TIMESTAMPTZ,
    deactivated_by  UUID REFERENCES users(id)
);
