-- V9: Seed departments and update category routing

INSERT INTO departments (id, name, code, description, head_name, phone, email, color_hex) VALUES
('a1000000-0000-0000-0000-000000000001', 'Roads & Infrastructure',      'ROADS',         'Responsible for road maintenance and infrastructure',          'Rajesh Kumar Sharma',    '+91-141-2740001', 'roads@jaipur.gov.in',       '#F97316'),
('a1000000-0000-0000-0000-000000000002', 'Sanitation & Waste Mgmt',     'SANITATION',    'Garbage collection, waste disposal and sanitation',           'Priya Meena',            '+91-141-2740002', 'sanitation@jaipur.gov.in',  '#22C55E'),
('a1000000-0000-0000-0000-000000000003', 'Water Supply Department',     'WATER',         'Water supply, pipelines and leakage management',             'Suresh Verma',           '+91-141-2740003', 'water@jaipur.gov.in',       '#3B82F6'),
('a1000000-0000-0000-0000-000000000004', 'Drainage & Sewage',           'DRAINAGE',      'Drainage systems, sewage and waterlogging management',       'Anita Gupta',            '+91-141-2740004', 'drainage@jaipur.gov.in',    '#8B5CF6'),
('a1000000-0000-0000-0000-000000000005', 'Electrical Department',       'ELECTRICAL',    'Street lights, electrical infrastructure and power supply',  'Vikram Singh Rathore',   '+91-141-2740005', 'electrical@jaipur.gov.in',  '#EAB308'),
('a1000000-0000-0000-0000-000000000006', 'Traffic Management',          'TRAFFIC',       'Traffic signals, flow management and road safety',           'Deepak Yadav',           '+91-141-2740006', 'traffic@jaipur.gov.in',     '#F59E0B'),
('a1000000-0000-0000-0000-000000000007', 'Parks & Recreation',          'PARKS',         'Public parks, gardens and recreational facilities',          'Sunita Agarwal',         '+91-141-2740007', 'parks@jaipur.gov.in',       '#16A34A'),
('a1000000-0000-0000-0000-000000000008', 'Emergency Response',          'EMERGENCY',     'Emergency response, disaster management and rapid action',   'Col. Manoj Kapoor (Rtd)', '+91-141-2740008', 'emergency@jaipur.gov.in',   '#DC2626'),
('a1000000-0000-0000-0000-000000000009', 'General Administration',      'ADMIN',         'General civic issues and administrative matters',            'Pooja Tripathi',          '+91-141-2740009', 'admin@jaipur.gov.in',       '#64748B');

-- Update categories with department routing
UPDATE complaint_categories SET default_dept_id = 'a1000000-0000-0000-0000-000000000001' WHERE code IN ('POTHOLE','DAMAGED_ROAD');
UPDATE complaint_categories SET default_dept_id = 'a1000000-0000-0000-0000-000000000002' WHERE code IN ('GARBAGE','ILLEGAL_DUMPING');
UPDATE complaint_categories SET default_dept_id = 'a1000000-0000-0000-0000-000000000003' WHERE code = 'WATER_LEAKAGE';
UPDATE complaint_categories SET default_dept_id = 'a1000000-0000-0000-0000-000000000004' WHERE code IN ('DRAINAGE','SEWAGE','FLOODING');
UPDATE complaint_categories SET default_dept_id = 'a1000000-0000-0000-0000-000000000005' WHERE code IN ('STREETLIGHT','ELECTRICITY');
UPDATE complaint_categories SET default_dept_id = 'a1000000-0000-0000-0000-000000000006' WHERE code = 'TRAFFIC_SIGNAL';
UPDATE complaint_categories SET default_dept_id = 'a1000000-0000-0000-0000-000000000007' WHERE code = 'PARK';
UPDATE complaint_categories SET default_dept_id = 'a1000000-0000-0000-0000-000000000009' WHERE code IN ('INFRASTRUCTURE','OTHER');

-- Seed priority override rules
INSERT INTO priority_rules (name, description, category_code, severity, min_affected, location_type, priority_result, sort_order) VALUES
('Flooding Always Critical',    'Flooding complaints are always CRITICAL',              'FLOODING',  NULL,     0,   NULL,           'CRITICAL', 1),
('High Affected Count',         'More than 100 affected citizens → minimum HIGH',       NULL,        NULL,     100, NULL,           'HIGH',     2),
('Traffic Signal Safety',       'Traffic signal faults in busy areas are HIGH',         'TRAFFIC_SIGNAL', NULL,0,  'PUBLIC_SAFETY','HIGH',     3),
('Critical Electricity Safety', 'Exposed wires with HIGH severity are CRITICAL',        'ELECTRICITY','HIGH',  0,   NULL,           'CRITICAL', 4),
('Sewage Health Hazard',        'Sewage overflow is HIGH priority minimum',             'SEWAGE',    NULL,     0,   NULL,           'HIGH',     5),
('Water Supply Critical',       'Water leakage with many affected is CRITICAL',         'WATER_LEAKAGE','HIGH',50,  NULL,           'CRITICAL', 6);
