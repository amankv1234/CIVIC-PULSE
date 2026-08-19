-- V4: Assignment and Priority entities

CREATE TABLE complaint_assignments (
    id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id     UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    department_id    UUID REFERENCES departments(id),
    field_worker_id  UUID REFERENCES field_workers(id),
    assigned_by      UUID REFERENCES users(id),
    status           VARCHAR(30) DEFAULT 'PENDING'
                     CHECK (status IN ('PENDING','ACCEPTED','REJECTED','COMPLETED','CANCELLED')),
    rejection_reason TEXT,
    deadline         TIMESTAMPTZ,
    accepted_at      TIMESTAMPTZ,
    started_at       TIMESTAMPTZ,
    completed_at     TIMESTAMPTZ,
    work_notes       TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE priority_rules (
    id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name             VARCHAR(200) NOT NULL,
    description      TEXT,
    category_code    VARCHAR(100),
    severity         VARCHAR(20),
    min_affected     INTEGER DEFAULT 0,
    location_type    VARCHAR(50),
    complaint_age_days INTEGER,
    priority_result  VARCHAR(20) NOT NULL,
    is_active        BOOLEAN DEFAULT TRUE,
    sort_order       INTEGER DEFAULT 0,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE announcements (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title       VARCHAR(500) NOT NULL,
    content     TEXT NOT NULL,
    created_by  UUID REFERENCES users(id),
    target_role VARCHAR(50) DEFAULT 'ALL',
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    expires_at  TIMESTAMPTZ
);
