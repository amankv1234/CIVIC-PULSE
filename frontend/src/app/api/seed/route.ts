import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { UserModel } from '@/lib/models/User';
import { DepartmentModel } from '@/lib/models/Department';
import { MinistryModel } from '@/lib/models/Ministry';
import { CityZoneModel } from '@/lib/models/CityZone';
import { ComplaintModel } from '@/lib/models/Complaint';
import { VerificationModel } from '@/lib/models/Verification';

export async function POST() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ message: 'MongoDB not reachable, using in-memory state' }, { status: 200 });
    }

    // Check if data already exists
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      return NextResponse.json({ message: 'Database already populated with seed data' }, { status: 200 });
    }

    // Seed Departments
    const departments = await DepartmentModel.insertMany([
      { name: 'Roads & Infrastructure', code: 'ROADS', description: 'Road maintenance, potholes, and pavements', headName: 'Rajesh Kumar Sharma', phone: '+91-141-2740001', email: 'roads@jaipur.gov.in', colorHex: '#F97316', activeComplaintsCount: 14, resolvedCount: 182, slaComplianceRate: 92, totalBudgetCr: 85.0, workforceCount: 210 },
      { name: 'Sanitation & Waste Mgmt', code: 'SANITATION', description: 'Garbage disposal, cleanliness, dump clearing', headName: 'Priya Meena', phone: '+91-141-2740002', email: 'sanitation@jaipur.gov.in', colorHex: '#22C55E', activeComplaintsCount: 22, resolvedCount: 310, slaComplianceRate: 88, totalBudgetCr: 65.0, workforceCount: 380 },
      { name: 'Water Supply Department', code: 'WATER', description: 'Water pipeline maintenance, leakage, pressure', headName: 'Suresh Verma', phone: '+91-141-2740003', email: 'water@jaipur.gov.in', colorHex: '#3B82F6', activeComplaintsCount: 9, resolvedCount: 140, slaComplianceRate: 95, totalBudgetCr: 110.0, workforceCount: 145 },
      { name: 'Drainage & Sewage', code: 'DRAINAGE', description: 'Stormwater drains, sewage overflow', headName: 'Anita Gupta', phone: '+91-141-2740004', email: 'drainage@jaipur.gov.in', colorHex: '#8B5CF6', activeComplaintsCount: 11, resolvedCount: 95, slaComplianceRate: 84, totalBudgetCr: 45.0, workforceCount: 90 },
      { name: 'Electrical Department', code: 'ELECTRICAL', description: 'Streetlights, electrical hazards, transformers', headName: 'Vikram Singh Rathore', phone: '+91-141-2740005', email: 'electrical@jaipur.gov.in', colorHex: '#EAB308', activeComplaintsCount: 7, resolvedCount: 220, slaComplianceRate: 96, totalBudgetCr: 38.0, workforceCount: 110 },
      { name: 'Traffic Management', code: 'TRAFFIC', description: 'Traffic signals, zebra crossings, signboards', headName: 'Deepak Yadav', phone: '+91-141-2740006', email: 'traffic@jaipur.gov.in', colorHex: '#F59E0B', activeComplaintsCount: 5, resolvedCount: 78, slaComplianceRate: 91, totalBudgetCr: 28.0, workforceCount: 80 },
      { name: 'Parks & Recreation', code: 'PARKS', description: 'Public parks, fallen trees, playgrounds', headName: 'Sunita Agarwal', phone: '+91-141-2740007', email: 'parks@jaipur.gov.in', colorHex: '#16A34A', activeComplaintsCount: 4, resolvedCount: 65, slaComplianceRate: 94, totalBudgetCr: 20.0, workforceCount: 60 },
      { name: 'Emergency Response', code: 'EMERGENCY', description: 'Disaster response, building collapses, flash floods', headName: 'Col. Manoj Kapoor (Rtd)', phone: '+91-141-2740008', email: 'emergency@jaipur.gov.in', colorHex: '#EF4444', activeComplaintsCount: 2, resolvedCount: 45, slaComplianceRate: 99, totalBudgetCr: 30.0, workforceCount: 75 },
    ]);

    // Seed City Zones
    const zones = await CityZoneModel.insertMany([
      { name: 'Mansarovar Zone', code: 'ZONE_MANSAROVAR', population: 420000, areaSqkm: 32.5, healthScore: 86, openIssuesCount: 12, criticalPotholesCount: 4, waterSupplyCoveragePct: 96, sanitationFrequencyPerWeek: 7, zonalOfficerName: 'R. K. Meena', zonalOfficeContact: '+91-141-2741101' },
      { name: 'Malviya Nagar Zone', code: 'ZONE_MALVIYA', population: 350000, areaSqkm: 24.8, healthScore: 89, openIssuesCount: 8, criticalPotholesCount: 2, waterSupplyCoveragePct: 98, sanitationFrequencyPerWeek: 7, zonalOfficerName: 'Sunita Choudhary', zonalOfficeContact: '+91-141-2741102' },
      { name: 'Vaishali Nagar Zone', code: 'ZONE_VAISHALI', population: 290000, areaSqkm: 21.0, healthScore: 82, openIssuesCount: 15, criticalPotholesCount: 6, waterSupplyCoveragePct: 92, sanitationFrequencyPerWeek: 6, zonalOfficerName: 'Harish Tanwar', zonalOfficeContact: '+91-141-2741103' },
      { name: 'Walled City (Heritage)', code: 'ZONE_WALLED_CITY', population: 480000, areaSqkm: 14.2, healthScore: 78, openIssuesCount: 24, criticalPotholesCount: 9, waterSupplyCoveragePct: 88, sanitationFrequencyPerWeek: 6, zonalOfficerName: 'Kailash Chand', zonalOfficeContact: '+91-141-2741104' },
      { name: 'C-Scheme & Civil Lines', code: 'ZONE_CSCHEME', population: 180000, areaSqkm: 18.5, healthScore: 94, openIssuesCount: 4, criticalPotholesCount: 1, waterSupplyCoveragePct: 99, sanitationFrequencyPerWeek: 7, zonalOfficerName: 'Anil Bhardwaj', zonalOfficeContact: '+91-141-2741105' },
    ]);

    // Seed Ministries
    const ministries = await MinistryModel.insertMany([
      {
        name: 'Ministry of Housing and Urban Affairs (MoHUA)',
        code: 'MOHUA_CENTRAL',
        jurisdiction: 'CENTRAL',
        ministerInCharge: 'Manohar Lal Khattar',
        secretaryName: 'Srinivas Katikithala, IAS',
        contactEmail: 'secymohua@nic.in',
        phone: '+91-11-23061179',
        monitoredDepartments: ['ROADS', 'SANITATION', 'DRAINAGE', 'WATER'],
        totalAllocatedBudgetCr: 1250.0,
        complianceRating: 95.2,
        activeDirectivesCount: 6,
        description: 'Apex Central Ministry overseeing National Smart Cities Mission, AMRUT 2.0, and Swachh Bharat Urban.',
      },
      {
        name: 'Department of Local Self Government (DLB Rajasthan)',
        code: 'DLB_RAJASTHAN',
        jurisdiction: 'STATE',
        ministerInCharge: 'Jhabar Singh Kharra',
        secretaryName: 'Dr. Jogaram, IAS',
        contactEmail: 'dlbrajasthan@rajasthan.gov.in',
        phone: '+91-141-2227280',
        monitoredDepartments: ['ROADS', 'SANITATION', 'WATER', 'DRAINAGE', 'ELECTRICAL', 'TRAFFIC', 'PARKS', 'EMERGENCY'],
        totalAllocatedBudgetCr: 450.0,
        complianceRating: 91.8,
        activeDirectivesCount: 4,
        description: 'State Ministry directly administering Jaipur Municipal Corporation (Heritage & Greater).',
      },
    ]);

    // Seed Demo Users with pre-hashed default password: password123
    const seededUsers = await UserModel.insertMany([
      {
        email: 'citizen@civicpulse.gov.in',
        password: 'password123',
        firstName: 'Rahul',
        lastName: 'Sharma',
        phone: '+91-9829012345',
        role: 'CITIZEN',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        reputationPoints: 145,
        zoneId: zones[0]._id.toString(),
        zoneName: zones[0].name,
        isVerified: true,
        digiLockerVerified: true,
        govIdType: 'AADHAAR',
        govIdNumber: 'XXXX-XXXX-4921',
      },
      {
        email: 'official@civicpulse.gov.in',
        password: 'password123',
        firstName: 'Rajesh Kumar',
        lastName: 'Sharma',
        phone: '+91-141-2740001',
        role: 'OFFICIAL',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        departmentId: departments[0]._id.toString(),
        departmentName: departments[0].name,
        employeeId: 'JMC-ENG-2024-089',
        designation: 'Executive Engineer (Roads)',
        isVerified: true,
        digiLockerVerified: true,
        digiLockerDocId: 'DL-JMC-OFF-99201',
        digiLockerVerifiedAt: new Date('2025-01-15'),
        officerCadre: 'State Engineering Service (SES Rajasthan)',
      },
      {
        email: 'ministry@civicpulse.gov.in',
        password: 'password123',
        firstName: 'Dr. Jogaram',
        lastName: 'IAS',
        phone: '+91-141-2227280',
        role: 'MINISTRY',
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        ministryId: ministries[1]._id.toString(),
        ministryName: ministries[1].name,
        designation: 'Principal Secretary (Urban Development)',
        isVerified: true,
        digiLockerVerified: true,
        digiLockerDocId: 'DL-IAS-CADRE-RAJ-1998',
        digiLockerVerifiedAt: new Date('2024-11-20'),
        officerCadre: 'Indian Administrative Service (IAS)',
      },
      {
        email: 'worker@civicpulse.gov.in',
        password: 'password123',
        firstName: 'Amit',
        lastName: 'Kumar',
        phone: '+91-9414056789',
        role: 'FIELD_WORKER',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        departmentId: departments[0]._id.toString(),
        departmentName: departments[0].name,
        employeeId: 'FW-ROADS-042',
        designation: 'Lead Pothole Repair Tech',
        isVerified: true,
      },
      {
        email: 'admin@civicpulse.gov.in',
        password: 'password123',
        firstName: 'Vikramaditya',
        lastName: 'Rathore',
        phone: '+91-141-2740000',
        role: 'ADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        designation: 'Municipal Commissioner (Jaipur)',
        isVerified: true,
        digiLockerVerified: true,
      },
    ]);

    // Seed Complaints
    await ComplaintModel.insertMany([
      {
        complaintNumber: 'CP-2026-0042',
        citizenId: seededUsers[0]._id.toString(),
        citizenName: 'Rahul Sharma',
        citizenPhone: '+91-9829012345',
        categoryId: 'cat-1',
        categoryName: 'Pothole & Road Damage',
        categoryCode: 'POTHOLE',
        departmentId: departments[0]._id.toString(),
        departmentName: departments[0].name,
        departmentColor: '#F97316',
        zoneId: zones[0]._id.toString(),
        zoneName: zones[0].name,
        title: 'Dangerous Pothole near Mansarovar Metro Station',
        description: 'Large 4-foot deep crater right in the middle lane causing massive traffic snarls and two-wheeler skids.',
        status: 'ASSIGNED',
        priority: 'HIGH',
        priorityScore: 78,
        severity: 'HIGH',
        affectedCount: 250,
        latitude: 26.8642,
        longitude: 75.7689,
        address: 'Opposite Pillar No. 42, Madhyam Marg, Mansarovar, Jaipur',
        city: 'Jaipur',
        pincode: '302020',
        images: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'],
        slaDeadline: new Date(Date.now() + 36 * 3600 * 1000),
        slaBreached: false,
        isEmergency: false,
        assignedWorkerId: seededUsers[3]._id.toString(),
        assignedWorkerName: 'Amit Kumar',
        workerPhone: '+91-9414056789',
        workOrderNotes: 'Cold-mix asphalt patch required immediately with safety cones deployed.',
        reopenCount: 0,
        upvotes: 24,
        statusHistory: [
          {
            toStatus: 'REPORT_SUBMITTED',
            changedBy: seededUsers[0]._id.toString(),
            changedByName: 'Rahul Sharma',
            changedByRole: 'CITIZEN',
            notes: 'Initial complaint filed with GPS tag',
            createdAt: new Date(Date.now() - 6 * 3600 * 1000),
          },
          {
            fromStatus: 'REPORT_SUBMITTED',
            toStatus: 'VERIFIED',
            changedBy: seededUsers[1]._id.toString(),
            changedByName: 'Rajesh Kumar Sharma',
            changedByRole: 'OFFICIAL',
            notes: 'Verified via street surveillance. High traffic hazard confirmed.',
            createdAt: new Date(Date.now() - 4 * 3600 * 1000),
          },
          {
            fromStatus: 'VERIFIED',
            toStatus: 'ASSIGNED',
            changedBy: seededUsers[1]._id.toString(),
            changedByName: 'Rajesh Kumar Sharma',
            changedByRole: 'OFFICIAL',
            notes: 'Assigned to Crew Leader Amit Kumar.',
            createdAt: new Date(Date.now() - 2 * 3600 * 1000),
          },
        ],
      },
      {
        complaintNumber: 'CP-2026-0043',
        citizenId: seededUsers[0]._id.toString(),
        citizenName: 'Priya Meena',
        citizenPhone: '+91-9829019988',
        categoryId: 'cat-2',
        categoryName: 'Water Pipe Rupture / Leakage',
        categoryCode: 'WATER_LEAKAGE',
        departmentId: departments[2]._id.toString(),
        departmentName: departments[2].name,
        departmentColor: '#3B82F6',
        zoneId: zones[1]._id.toString(),
        zoneName: zones[1].name,
        title: 'Major Drinking Water Pipeline Burst at Calgiri Road',
        description: 'Main 6-inch municipal water pipe burst flooding road and cutting drinking water to Sector 3.',
        status: 'IN_PROGRESS',
        priority: 'CRITICAL',
        priorityScore: 92,
        severity: 'CRITICAL',
        affectedCount: 800,
        latitude: 26.8524,
        longitude: 75.8239,
        address: 'Calgiri Marg, Near Apex Hospital, Malviya Nagar, Jaipur',
        city: 'Jaipur',
        pincode: '302017',
        images: ['https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'],
        slaDeadline: new Date(Date.now() + 12 * 3600 * 1000),
        slaBreached: false,
        isEmergency: true,
        assignedWorkerId: 'worker-2',
        assignedWorkerName: 'Suresh Tank',
        workerPhone: '+91-9829033445',
        reopenCount: 0,
        upvotes: 48,
        statusHistory: [
          {
            toStatus: 'REPORT_SUBMITTED',
            changedBy: seededUsers[0]._id.toString(),
            changedByName: 'Priya Meena',
            changedByRole: 'CITIZEN',
            notes: 'High pressure leak reported',
            createdAt: new Date(Date.now() - 8 * 3600 * 1000),
          },
          {
            fromStatus: 'REPORT_SUBMITTED',
            toStatus: 'IN_PROGRESS',
            changedBy: 'worker-2',
            changedByName: 'Suresh Tank',
            changedByRole: 'FIELD_WORKER',
            notes: 'Isolation valve closed. Excavation under way.',
            createdAt: new Date(Date.now() - 1 * 3600 * 1000),
          },
        ],
      },
      {
        complaintNumber: 'CP-2026-0044',
        citizenId: seededUsers[0]._id.toString(),
        citizenName: 'Rahul Sharma',
        categoryId: 'cat-3',
        categoryName: 'Garbage & Waste Accumulation',
        categoryCode: 'GARBAGE',
        departmentId: departments[1]._id.toString(),
        departmentName: departments[1].name,
        departmentColor: '#22C55E',
        zoneId: zones[2]._id.toString(),
        zoneName: zones[2].name,
        title: 'Overflowing Community Dustbin near Amrapali Circle',
        description: 'Garbage not collected for 4 consecutive days, spreading onto pedestrian sidewalk.',
        status: 'RESOLVED',
        priority: 'MEDIUM',
        priorityScore: 52,
        severity: 'MEDIUM',
        affectedCount: 120,
        latitude: 26.9048,
        longitude: 75.7421,
        address: 'Amrapali Circle, Vaishali Nagar, Jaipur',
        city: 'Jaipur',
        pincode: '302021',
        images: ['https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80'],
        slaDeadline: new Date(Date.now() - 5 * 3600 * 1000),
        slaBreached: false,
        isEmergency: false,
        resolutionProofImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
        resolutionNotes: 'Compactor vehicle dispatched. Bin cleared and sanitized with bleaching powder.',
        reopenCount: 0,
        upvotes: 18,
        resolvedAt: new Date(Date.now() - 2 * 3600 * 1000),
        statusHistory: [
          {
            toStatus: 'RESOLVED',
            changedBy: 'worker-3',
            changedByName: 'Dinesh Gehlot',
            changedByRole: 'FIELD_WORKER',
            notes: 'Waste lifted and area disinfected.',
            proofImages: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80'],
            createdAt: new Date(Date.now() - 2 * 3600 * 1000),
          },
        ],
      },
    ]);

    // Seed DigiLocker Verification Ledger
    await VerificationModel.insertMany([
      {
        userId: seededUsers[1]._id.toString(),
        applicantName: 'Rajesh Kumar Sharma',
        applicantRole: 'OFFICIAL',
        govIdType: 'GOV_EMPLOYEE_ID',
        govIdNumberMasked: 'JMC-ENG-XXXX-089',
        issuingAuthority: 'Jaipur Municipal Corporation & DLB Rajasthan',
        verificationHash: '0x8f3c7e912b4a5d6f8a9e0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
        digiLockerTxnId: 'DL-TXN-2026-990812',
        status: 'VERIFIED',
        departmentOrMinistry: 'Roads & Infrastructure',
        verifiedAt: new Date('2025-01-15'),
        documents: [
          {
            docType: 'Official Gazetted Service Record',
            uri: 'digilocker://gov.in/rajasthan/dlb/services/089',
            verifiedOnChain: true,
          },
          {
            docType: 'Aadhaar Identity Anchor',
            uri: 'digilocker://uidai.gov.in/identity/masked_4921',
            verifiedOnChain: true,
          },
        ],
      },
      {
        userId: seededUsers[2]._id.toString(),
        applicantName: 'Dr. Jogaram, IAS',
        applicantRole: 'MINISTRY',
        govIdType: 'MINISTERIAL_CREDENTIAL',
        govIdNumberMasked: 'IAS-CADRE-XXXX-1998',
        issuingAuthority: 'DoPT Government of India / Government of Rajasthan',
        verificationHash: '0x7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d',
        digiLockerTxnId: 'DL-TXN-2026-778841',
        status: 'VERIFIED',
        departmentOrMinistry: 'Department of Local Self Government (DLB Rajasthan)',
        verifiedAt: new Date('2024-11-20'),
        documents: [
          {
            docType: 'IAS Executive Service Commission',
            uri: 'digilocker://dopt.gov.in/ias/executive_1998',
            verifiedOnChain: true,
          },
        ],
      },
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB collections successfully seeded with rich Jaipur municipal records!' 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
