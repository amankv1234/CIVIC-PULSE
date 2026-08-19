import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import { connectToDatabase } from '@/lib/db';
import { UserModel } from '@/lib/models/User';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or malformed authorization token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyJwt(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired session token' }, { status: 401 });
    }

    await connectToDatabase();
    const userDoc = await UserModel.findById(payload.userId).select('-password');

    if (userDoc) {
      return NextResponse.json({
        success: true,
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
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: payload.userId,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
        departmentId: payload.departmentId,
        ministryId: payload.ministryId,
        zoneId: payload.zoneId,
        isVerified: payload.isVerified,
        digiLockerVerified: payload.digiLockerVerified,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
