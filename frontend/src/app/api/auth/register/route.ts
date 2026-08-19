import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { UserModel } from '@/lib/models/User';
import { signJwt } from '@/lib/jwt';
import { UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role = 'CITIZEN',
      departmentId,
      departmentName,
      zoneId,
      zoneName,
      ministryId,
      ministryName,
      designation,
      employeeId,
      govIdType,
      govIdNumber,
      digiLockerVerified = false,
    } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email address already exists' },
        { status: 409 }
      );
    }

    // Determine verification status
    const isGovRole = role === 'OFFICIAL' || role === 'MINISTRY';
    const isUserVerified = isGovRole ? Boolean(digiLockerVerified) : true;

    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      password, // Mongoose pre-save hook will hash with bcrypt
      firstName,
      lastName,
      phone,
      role: role as UserRole,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firstName + ' ' + lastName)}`,
      departmentId,
      departmentName,
      zoneId,
      zoneName,
      ministryId,
      ministryName,
      designation,
      employeeId,
      govIdType,
      govIdNumber,
      isVerified: isUserVerified,
      digiLockerVerified: Boolean(digiLockerVerified),
      digiLockerDocId: digiLockerVerified ? `DL-${Date.now()}` : undefined,
      digiLockerVerifiedAt: digiLockerVerified ? new Date() : undefined,
      reputationPoints: role === 'CITIZEN' ? 100 : 250,
    });

    const token = signJwt({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role as UserRole,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      departmentId: newUser.departmentId,
      ministryId: newUser.ministryId,
      zoneId: newUser.zoneId,
      isVerified: newUser.isVerified,
      digiLockerVerified: newUser.digiLockerVerified,
    });

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        role: newUser.role,
        avatarUrl: newUser.avatarUrl,
        departmentId: newUser.departmentId,
        departmentName: newUser.departmentName,
        zoneId: newUser.zoneId,
        zoneName: newUser.zoneName,
        ministryId: newUser.ministryId,
        ministryName: newUser.ministryName,
        designation: newUser.designation,
        employeeId: newUser.employeeId,
        reputationPoints: newUser.reputationPoints,
        isVerified: newUser.isVerified,
        digiLockerVerified: newUser.digiLockerVerified,
        digiLockerDocId: newUser.digiLockerDocId,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error during registration' },
      { status: 500 }
    );
  }
}
