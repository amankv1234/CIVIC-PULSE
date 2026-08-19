import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ComplaintModel } from '@/lib/models/Complaint';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const complaint = await ComplaintModel.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { complaintNumber: id }],
    });

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, complaint });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      status,
      assignedWorkerId,
      assignedWorkerName,
      workerPhone,
      workOrderNotes,
      resolutionProofImage,
      resolutionNotes,
      citizenRating,
      citizenFeedback,
      changedBy = 'system',
      changedByName = 'Civic Official',
      changedByRole = 'OFFICIAL',
      notes = '',
    } = body;

    await connectToDatabase();

    const complaint = await ComplaintModel.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { complaintNumber: id }],
    });

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const previousStatus = complaint.status;

    if (status) complaint.status = status;
    if (assignedWorkerId) complaint.assignedWorkerId = assignedWorkerId;
    if (assignedWorkerName) complaint.assignedWorkerName = assignedWorkerName;
    if (workerPhone) complaint.workerPhone = workerPhone;
    if (workOrderNotes) complaint.workOrderNotes = workOrderNotes;
    if (resolutionProofImage) complaint.resolutionProofImage = resolutionProofImage;
    if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;
    if (citizenRating !== undefined) complaint.citizenRating = citizenRating;
    if (citizenFeedback !== undefined) complaint.citizenFeedback = citizenFeedback;

    if (status === 'RESOLVED') {
      complaint.resolvedAt = new Date();
    }
    if (status === 'CITIZEN_VERIFIED') {
      complaint.verifiedAt = new Date();
    }
    if (status === 'REOPENED') {
      complaint.reopenCount = (complaint.reopenCount || 0) + 1;
      // Escalate priority on reopen
      complaint.priority = 'HIGH';
    }

    // Append to status audit trail
    complaint.statusHistory.push({
      fromStatus: previousStatus,
      toStatus: status || previousStatus,
      changedBy,
      changedByName,
      changedByRole,
      notes: notes || `Status transitioned to ${status}`,
      proofImages: resolutionProofImage ? [resolutionProofImage] : [],
      createdAt: new Date(),
    });

    await complaint.save();

    return NextResponse.json({
      success: true,
      message: 'Complaint updated successfully',
      complaint,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
