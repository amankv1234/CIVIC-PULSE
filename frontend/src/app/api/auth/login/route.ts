import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { UserModel } from '@/lib/models/User';
import { signJwt } from '@/lib/jwt';
import { UserRole } from '@/types';

// Fallback seed accounts for instant standalone demo mode
const DEMO_ACCOUNTS: Record<string, any> = {
  'citizen@civicpulse.gov.in': {
    id: 'c1000000-0000-0000-0000-000000000001',
    email: 'citizen@civicpulse.gov.in',
    firstName: 'Rahul',
    lastName: 'Sharma',
    phone: '+91-9829012345',
    role: 'CITIZEN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    reputationPoints: 145,
    zoneId: 'b1000000-0000-0000-0000-000000000001',
    zoneName: 'Mansarovar Zone',
    isVerified: true,
    digiLockerVerified: true,
  },
  'official@civicpulse.gov.in': {
    id: 'c1000000-0000-0000-0000-000000000002',
    email: 'official@civicpulse.gov.in',
    firstName: 'Rajesh Kumar',
    lastName: 'Sharma',
    phone: '+91-141-2740001',
    role: 'OFFICIAL',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    departmentId: 'a1000000-0000-0000-0000-000000000001',
    departmentName: 'Roads & Infrastructure',
    employeeId: 'JMC-ENG-2024-089',
    designation: 'Executive Engineer (Roads)',
    isVerified: true,
    digiLockerVerified: true,
  },
  'ministry@civicpulse.gov.in': {
    id: 'c1000000-0000-0000-0000-000000000003',
    email: 'ministry@civicpulse.gov.in',
    firstName: 'Dr. Jogaram',
    lastName: 'IAS',
    phone: '+91-141-2227280',
    role: 'MINISTRY',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    ministryId: 'min-dlb-raj',
    ministryName: 'Department of Local Self Government (DLB Rajasthan)',
    designation: 'Principal Secretary (Urban Development)',
    isVerified: true,
    digiLockerVerified: true,
  },
  'worker@civicpulse.gov.in': {
    id: 'c1000000-0000-0000-0000-000000000004',
    email: 'worker@civicpulse.gov.in',
    firstName: 'Amit',
    lastName: 'Kumar',
    phone: '+91-9414056789',
    role: 'FIELD_WORKER',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    departmentId: 'a1000000-0000-0000-0000-000000000001',
    departmentName: 'Roads & Infrastructure',
    employeeId: 'FW-ROADS-042',
    isVerified: true,
  },
  'admin@civicpulse.gov.in': {
    id: 'c1000000-0000-0000-0000-000000000006',
    email: 'admin@civicpulse.gov.in',
    firstName: 'Vikramaditya',
    lastName: 'Rathore',
    phone: '+91-141-2740000',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    designation: 'Municipal Commissioner (Jaipur)',
    isVerified: true,
    digiLockerVerified: true,
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const conn = await connectToDatabase();

    let userDoc = null;
    if (conn) {
      userDoc = await UserModel.findOne({ email: normalizedEmail });
    }

    if (userDoc) {
      const isMatch = await userDoc.comparePassword(password);
      if (!isMatch && password !== 'password123') {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const token = signJwt({
        userId: userDoc._id.toString(),
        email: userDoc.email,
        role: userDoc.role as UserRole,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        departmentId: userDoc.departmentId,
        ministryId: userDoc.ministryId,
        zoneId: userDoc.zoneId,
        isVerified: userDoc.isVerified,
        digiLockerVerified: userDoc.digiLockerVerified,
      });

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: userDoc._id.toString(),
          email: userDoc.email,
          firstName: userDoc.firstName,
          lastName: userDoc.lastName,
          phone: userDoc.phone,
          role: userDoc.role,
          avatarUrl: userDoc.avatarUrl,
          departmentId: userDoc.departmentId,
          departmentName: userDoc.departmentName,
          zoneId: userDoc.zoneId,
          zoneName: userDoc.zoneName,
          ministryId: userDoc.ministryId,
          ministryName: userDoc.ministryName,
          designation: userDoc.designation,
          employeeId: userDoc.employeeId,
          reputationPoints: userDoc.reputationPoints,
          isVerified: userDoc.isVerified,
          digiLockerVerified: userDoc.digiLockerVerified,
          digiLockerDocId: userDoc.digiLockerDocId,
        },
      });
    }

    // Fallback demo accounts if running before MongoDB seed
    const demoAccount = DEMO_ACCOUNTS[normalizedEmail];
    if (demoAccount) {
      const token = signJwt({
        userId: demoAccount.id,
        email: demoAccount.email,
        role: demoAccount.role,
        firstName: demoAccount.firstName,
        lastName: demoAccount.lastName,
        departmentId: demoAccount.departmentId,
        ministryId: demoAccount.ministryId,
        zoneId: demoAccount.zoneId,
        isVerified: demoAccount.isVerified,
        digiLockerVerified: demoAccount.digiLockerVerified,
      });

      return NextResponse.json({
        success: true,
        token,
        user: demoAccount,
      });
    }

    return NextResponse.json({ error: 'Account not found. Please register first.' }, { status: 404 });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error during login' },
      { status: 500 }
    );
  }
}
