-- V3: Complaint entities

CREATE TABLE complaint_categories (
    id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name             VARCHAR(200) NOT NULL,
    code             VARCHAR(100) NOT NULL UNIQUE,
    description      TEXT,
    icon_name        VARCHAR(100),
    default_dept_id  UUID REFERENCES departments(id),
    default_priority VARCHAR(20) DEFAULT 'MEDIUM',
    sla_hours        INTEGER DEFAULT 48,
    category_weight  DECIMAL(4,2) DEFAULT 1.0,
    is_active        BOOLEAN DEFAULT TRUE,
    sort_order       INTEGER DEFAULT 0,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE complaints (
    id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_number VARCHAR(30) NOT NULL UNIQUE,
    citizen_id       UUID NOT NULL REFERENCES users(id),
    category_id      UUID NOT NULL REFERENCES complaint_categories(id),
    department_id    UUID REFERENCES departments(id),
    zone_id          UUID REFERENCES city_zones(id),
    title            VARCHAR(500) NOT NULL,
    description      TEXT NOT NULL,
    status           VARCHAR(50) NOT NULL DEFAULT 'REPORT_SUBMITTED',
    priority         VARCHAR(20) DEFAULT 'MEDIUM',
    severity         VARCHAR(20) DEFAULT 'MEDIUM',
    affected_count   INTEGER DEFAULT 1,
    location         GEOMETRY(POINT, 4326),
    address          TEXT,
    landmark         VARCHAR(500),
    city             VARCHAR(200),
    pincode          VARCHAR(20),
    sla_deadline     TIMESTAMPTZ,
    sla_breached     BOOLEAN DEFAULT FALSE,
    is_emergency     BOOLEAN DEFAULT FALSE,
    is_anonymous     BOOLEAN DEFAULT FALSE,
    resolved_at      TIMESTAMPTZ,
    closed_at        TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW(),
    deleted_at       TIMESTAMPTZ
);

CREATE TABLE complaint_images (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    url          VARCHAR(1000) NOT NULL,
    image_type   VARCHAR(20) CHECK (image_type IN ('BEFORE','AFTER','EVIDENCE','SUBMISSION')),
    uploaded_by  UUID REFERENCES users(id),
    caption      VARCHAR(500),
    file_size    BIGINT,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE complaint_status_history (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    status       VARCHAR(50) NOT NULL,
    changed_by   UUID REFERENCES users(id),
    note         TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE comments (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    user_id      UUID NOT NULL REFERENCES users(id),
    content      TEXT NOT NULL,
    is_official  BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ
);

CREATE TABLE citizen_verifications (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id UUID NOT NULL REFERENCES complaints(id) UNIQUE,
    citizen_id   UUID NOT NULL REFERENCES users(id),
    is_satisfied BOOLEAN NOT NULL,
    rating       INTEGER CHECK (rating BETWEEN 1 AND 5),
    feedback     TEXT,
    verified_at  TIMESTAMPTZ DEFAULT NOW()
);
