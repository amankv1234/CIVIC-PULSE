-- V5: Notifications

CREATE TABLE notifications (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type         VARCHAR(100) NOT NULL,
    title        VARCHAR(500) NOT NULL,
    message      TEXT NOT NULL,
    complaint_id UUID REFERENCES complaints(id) ON DELETE SET NULL,
    is_read      BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);
