-- V8: Seed complaint categories

INSERT INTO complaint_categories (id, name, code, description, icon_name, default_priority, sla_hours, category_weight, sort_order) VALUES
(gen_random_uuid(), 'Pothole',             'POTHOLE',          'Road potholes and surface damage',           'hole',          'HIGH',   48,  1.8, 1),
(gen_random_uuid(), 'Garbage',             'GARBAGE',          'Uncollected garbage and waste',              'trash',         'MEDIUM', 24,  1.2, 2),
(gen_random_uuid(), 'Water Leakage',       'WATER_LEAKAGE',    'Leaking water pipes or supply issues',       'droplets',      'HIGH',   24,  1.9, 3),
(gen_random_uuid(), 'Drainage',            'DRAINAGE',         'Blocked or overflowing drainage',            'waves',         'HIGH',   36,  1.7, 4),
(gen_random_uuid(), 'Flooding',            'FLOODING',         'Area flooding or waterlogging',              'cloud-rain',    'CRITICAL',12,  2.5, 5),
(gen_random_uuid(), 'Broken Streetlight',  'STREETLIGHT',      'Non-functional or damaged street lights',   'lamp',          'MEDIUM', 48,  1.1, 6),
(gen_random_uuid(), 'Damaged Road',        'DAMAGED_ROAD',     'Road surface damage, cracks or cave-in',    'road',          'HIGH',   48,  1.8, 7),
(gen_random_uuid(), 'Traffic Signal',      'TRAFFIC_SIGNAL',   'Faulty or non-functional traffic signals',  'traffic-cone',  'HIGH',   12,  2.0, 8),
(gen_random_uuid(), 'Illegal Dumping',     'ILLEGAL_DUMPING',  'Illegal waste disposal or dumping',          'ban',           'MEDIUM', 48,  1.3, 9),
(gen_random_uuid(), 'Public Infrastructure','INFRASTRUCTURE',  'Damaged public infrastructure',              'building',      'MEDIUM', 72,  1.4, 10),
(gen_random_uuid(), 'Electricity Issue',   'ELECTRICITY',      'Power cuts, exposed wires, electrical faults','zap',          'HIGH',   24,  2.0, 11),
(gen_random_uuid(), 'Park Maintenance',    'PARK',             'Park damage, equipment issues',              'trees',         'LOW',    96,  0.8, 12),
(gen_random_uuid(), 'Sewage',              'SEWAGE',           'Sewage overflow or blockage',               'pipe',          'HIGH',   24,  2.0, 13),
(gen_random_uuid(), 'Other',               'OTHER',            'Other civic issues not listed above',        'circle-help',   'LOW',    72,  1.0, 14);
