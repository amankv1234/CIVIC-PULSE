-- V10: Seed City Zones, Demo Users, Citizen Profiles, Field Workers, Sample Complaints & Status History

-- 1. City Zones for Jaipur
INSERT INTO city_zones (id, name, code, population, area_sqkm) VALUES
('b1000000-0000-0000-0000-000000000001', 'Mansarovar Zone', 'ZONE_MANSAROVAR', 420000, 32.5),
('b1000000-0000-0000-0000-000000000002', 'Malviya Nagar Zone', 'ZONE_MALVIYA', 350000, 24.8),
('b1000000-0000-0000-0000-000000000003', 'Vaishali Nagar Zone', 'ZONE_VAISHALI', 290000, 21.0),
('b1000000-0000-0000-0000-000000000004', 'Walled City (Heritage)', 'ZONE_WALLED_CITY', 480000, 14.2),
('b1000000-0000-0000-0000-000000000005', 'C-Scheme & Civil Lines', 'ZONE_CSCHEME', 180000, 18.5),
('b1000000-0000-0000-0000-000000000006', 'Vidhyadhar Nagar', 'ZONE_VIDHYADHAR', 310000, 26.4),
('b1000000-0000-0000-0000-000000000007', 'Sanganer Industrial Zone', 'ZONE_SANGANER', 390000, 38.0),
('b1000000-0000-0000-0000-000000000008', 'Jagatpura & Sitapura', 'ZONE_JAGATPURA', 340000, 35.2);

-- 2. Demo Users (Password: password123 -> BCrypt hash)
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_active) VALUES
('c1000000-0000-0000-0000-000000000001', 'citizen@civicpulse.gov.in', '$2a$10$4vPsh3wZkL9YwPZ3mJ2wyeVzD6q5g3J5z8uY7h2X1g4V3b2N1mK0O', 'Rahul', 'Sharma', '+91-9829012345', 'CITIZEN', TRUE),
('c1000000-0000-0000-0000-000000000002', 'official@civicpulse.gov.in', '$2a$10$4vPsh3wZkL9YwPZ3mJ2wyeVzD6q5g3J5z8uY7h2X1g4V3b2N1mK0O', 'Rajesh Kumar', 'Sharma', '+91-141-2740001', 'OFFICIAL', TRUE),
('c1000000-0000-0000-0000-000000000003', 'official.sanitation@civicpulse.gov.in', '$2a$10$4vPsh3wZkL9YwPZ3mJ2wyeVzD6q5g3J5z8uY7h2X1g4V3b2N1mK0O', 'Priya', 'Meena', '+91-141-2740002', 'OFFICIAL', TRUE),
('c1000000-0000-0000-0000-000000000004', 'worker@civicpulse.gov.in', '$2a$10$4vPsh3wZkL9YwPZ3mJ2wyeVzD6q5g3J5z8uY7h2X1g4V3b2N1mK0O', 'Amit', 'Kumar', '+91-9414056789', 'FIELD_WORKER', TRUE),
('c1000000-0000-0000-0000-000000000005', 'worker.water@civicpulse.gov.in', '$2a$10$4vPsh3wZkL9YwPZ3mJ2wyeVzD6q5g3J5z8uY7h2X1g4V3b2N1mK0O', 'Ramesh', 'Verma', '+91-9414088990', 'FIELD_WORKER', TRUE),
('c1000000-0000-0000-0000-000000000006', 'admin@civicpulse.gov.in', '$2a$10$4vPsh3wZkL9YwPZ3mJ2wyeVzD6q5g3J5z8uY7h2X1g4V3b2N1mK0O', 'Vikramaditya', 'Rathore', '+91-141-2740000', 'ADMIN', TRUE);

-- 3. Citizen Profile
INSERT INTO citizen_profiles (id, user_id, reputation_points, total_complaints, resolved_count, verified_count, zone_id, address) VALUES
('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 145, 8, 6, 5, 'b1000000-0000-0000-0000-000000000001', 'Plot 42, Sector 5, Mansarovar, Jaipur');

-- 4. Field Workers
INSERT INTO field_workers (id, user_id, department_id, employee_id, specialization, is_available, current_location, total_tasks, completed_tasks, rating) VALUES
('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'EMP-ROADS-042', 'Asphalt repair & pothole patching', TRUE, ST_SetSRID(ST_MakePoint(75.7680, 26.8520), 4326), 28, 25, 4.85),
('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000003', 'EMP-WATER-108', 'Pipeline welding & valve repairs', TRUE, ST_SetSRID(ST_MakePoint(75.8050, 26.8620), 4326), 34, 31, 4.70);

-- 5. Seed Complaints
INSERT INTO complaints (
    id, complaint_number, citizen_id, category_id, department_id, zone_id, 
    title, description, status, priority, severity, affected_count, 
    location, address, landmark, city, pincode, sla_deadline, is_emergency, created_at
) VALUES
(
    'f1000000-0000-0000-0000-000000000001',
    'CP-2026-00101',
    'c1000000-0000-0000-0000-000000000001',
    (SELECT id FROM complaint_categories WHERE code = 'POTHOLE'),
    'a1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'Dangerous 2-foot Deep Pothole on Main Madhyam Marg',
    'Large deep pothole creating severe traffic hazard and multiple near-miss accidents right near the central market crossroad.',
    'IN_PROGRESS', 'HIGH', 'HIGH', 150,
    ST_SetSRID(ST_MakePoint(75.7645, 26.8548), 4326),
    'Near Crossroad 4, Madhyam Marg, Mansarovar', 'Opposite SBI Bank', 'Jaipur', '302020',
    NOW() + INTERVAL '18 hours', FALSE, NOW() - INTERVAL '6 hours'
),
(
    'f1000000-0000-0000-0000-000000000002',
    'CP-2026-00102',
    'c1000000-0000-0000-0000-000000000001',
    (SELECT id FROM complaint_categories WHERE code = 'WATER_LEAKAGE'),
    'a1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000002',
    'Underground Main Pipeline Burst Flooding Road',
    'Drinking water pipeline ruptured under sidewalk, thousands of liters overflowing onto the road causing low water pressure in sector 3.',
    'ASSIGNED', 'CRITICAL', 'CRITICAL', 600,
    ST_SetSRID(ST_MakePoint(75.8165, 26.8582), 4326),
    'Sector 3, Gaurav Tower Road, Malviya Nagar', 'Near GT Central Mall', 'Jaipur', '302017',
    NOW() + INTERVAL '6 hours', FALSE, NOW() - INTERVAL '3 hours'
),
(
    'f1000000-0000-0000-0000-000000000003',
    'CP-2026-00103',
    'c1000000-0000-0000-0000-000000000001',
    (SELECT id FROM complaint_categories WHERE code = 'GARBAGE'),
    'a1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000003',
    'Uncollected Commercial Waste Accumulating on Queens Road',
    'Garbage collection bin overflowing for 4 consecutive days, spreading foul odor and attracting stray cattle.',
    'REPORT_SUBMITTED', 'MEDIUM', 'MEDIUM', 80,
    ST_SetSRID(ST_MakePoint(75.7482, 26.9015), 4326),
    'Queens Road, Vaishali Nagar', 'Near Community Park Gate 2', 'Jaipur', '302021',
    NOW() + INTERVAL '24 hours', FALSE, NOW() - INTERVAL '1 hours'
),
(
    'f1000000-0000-0000-0000-000000000004',
    'CP-2026-00104',
    'c1000000-0000-0000-0000-000000000001',
    (SELECT id FROM complaint_categories WHERE code = 'STREETLIGHT'),
    'a1000000-0000-0000-0000-000000000005',
    'b1000000-0000-0000-0000-000000000004',
    'Entire 500m Stretch of Johari Bazaar in Total Darkness',
    '6 consecutive sodium streetlight poles defective, posing safety concerns for pedestrians and night market shoppers.',
    'RESOLVED', 'MEDIUM', 'MEDIUM', 300,
    ST_SetSRID(ST_MakePoint(75.8267, 26.9219), 4326),
    'Johari Bazaar Main Street, Walled City', 'Near Badi Chaupar', 'Jaipur', '302003',
    NOW() - INTERVAL '12 hours', FALSE, NOW() - INTERVAL '2 days'
);

-- 6. Seed Assignments
INSERT INTO complaint_assignments (
    id, complaint_id, department_id, field_worker_id, assigned_by, status, accepted_at, started_at
) VALUES
(
    gen_random_uuid(),
    'f1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'e1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000002',
    'ACCEPTED',
    NOW() - INTERVAL '4 hours',
    NOW() - INTERVAL '2 hours'
),
(
    gen_random_uuid(),
    'f1000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000003',
    'e1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000002',
    'PENDING',
    NULL,
    NULL
);

-- 7. Seed Status History
INSERT INTO complaint_status_history (id, complaint_id, from_status, to_status, changed_by, notes) VALUES
(gen_random_uuid(), 'f1000000-0000-0000-0000-000000000001', NULL, 'REPORT_SUBMITTED', 'c1000000-0000-0000-0000-000000000001', 'Report submitted by citizen'),
(gen_random_uuid(), 'f1000000-0000-0000-0000-000000000001', 'REPORT_SUBMITTED', 'VERIFIED', 'c1000000-0000-0000-0000-000000000002', 'Verified by Municipal Road Inspector'),
(gen_random_uuid(), 'f1000000-0000-0000-0000-000000000001', 'VERIFIED', 'ASSIGNED', 'c1000000-0000-0000-0000-000000000002', 'Assigned to field worker Amit Kumar'),
(gen_random_uuid(), 'f1000000-0000-0000-0000-000000000001', 'ASSIGNED', 'IN_PROGRESS', 'c1000000-0000-0000-0000-000000000004', 'Field crew deployed on site with cold-mix asphalt patch material'),
(gen_random_uuid(), 'f1000000-0000-0000-0000-000000000004', NULL, 'REPORT_SUBMITTED', 'c1000000-0000-0000-0000-000000000001', 'Report submitted'),
(gen_random_uuid(), 'f1000000-0000-0000-0000-000000000004', 'REPORT_SUBMITTED', 'RESOLVED', 'c1000000-0000-0000-0000-000000000002', 'Electrical maintenance crew replaced driver board and 6 LED fixtures');
