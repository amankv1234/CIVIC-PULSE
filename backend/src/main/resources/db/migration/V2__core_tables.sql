-- V2: Core entities — users, departments, city_zones, citizen_profiles

CREATE TABLE users (
    id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    phone         VARCHAR(20),
    role          VARCHAR(30) NOT NULL CHECK (role IN ('CITIZEN','OFFICIAL','FIELD_WORKER','ADMIN')),
    is_active     BOOLEAN DEFAULT TRUE,
    is_suspended  BOOLEAN DEFAULT FALSE,
    avatar_url    VARCHAR(500),
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

CREATE TABLE departments (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    code        VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    head_name   VARCHAR(200),
    phone       VARCHAR(20),
    email       VARCHAR(255),
    color_hex   VARCHAR(7) DEFAULT '#6366F1',
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE city_zones (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    code        VARCHAR(50) NOT NULL UNIQUE,
    boundary    GEOMETRY(POLYGON, 4326),
    dept_id     UUID REFERENCES departments(id),
    population  INTEGER,
    area_sqkm   DECIMAL(10,2),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE citizen_profiles (
    id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    reputation_points INTEGER DEFAULT 0,
    total_complaints  INTEGER DEFAULT 0,
    resolved_count    INTEGER DEFAULT 0,
    verified_count    INTEGER DEFAULT 0,
    zone_id           UUID REFERENCES city_zones(id),
    address           TEXT,
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE field_workers (
    id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    department_id    UUID REFERENCES departments(id),
    employee_id      VARCHAR(100) UNIQUE,
    specialization   VARCHAR(200),
    is_available     BOOLEAN DEFAULT TRUE,
    current_location GEOMETRY(POINT, 4326),
    total_tasks      INTEGER DEFAULT 0,
    completed_tasks  INTEGER DEFAULT 0,
    rating           DECIMAL(3,2) DEFAULT 0.00,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE worker_locations (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    worker_id   UUID NOT NULL REFERENCES field_workers(id) ON DELETE CASCADE UNIQUE,
    location    GEOMETRY(POINT, 4326) NOT NULL,
    accuracy    DECIMAL(8,2),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);
